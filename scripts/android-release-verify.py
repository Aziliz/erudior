#!/usr/bin/env python3
"""Verify an ARM64 preview and its public predecessor without accessing signing keys."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess
import zipfile

APK_NAME = "Erudior-Android-arm64.apk"
APK_URL = "https://github.com/Aziliz/erudior/releases/download/android-preview/" + APK_NAME
MAX_BYTES = 41_943_040


def require(condition, message):
    if not condition:
        raise ValueError(message)


def parse_badging(text):
    package = re.search(r"^package: name='([^']+)' versionCode='(\d+)' versionName='([^']+)'", text, re.M)
    require(package is not None, "Missing APK package/version metadata")
    native = re.search(r"^native-code:\s*(.*)$", text, re.M)
    require(native is not None, "Missing APK ABI metadata")
    return {"package": package[1], "versionCode": int(package[2]), "version": package[3],
            "abis": re.findall(r"'([^']+)'", native[1]),
            "debuggable": bool(re.search(r"^application-debuggable(?:\s|$)", text, re.M))}


def parse_signers(text):
    signers = sorted(set(re.findall(r"^Signer #\d+ certificate SHA-256 digest: ([a-fA-F0-9]{64})\s*$", text, re.M)))
    require(bool(signers), "No verified APK signing certificate")
    return [value.lower() for value in signers]


def validate_upgrade(candidate, previous):
    require(candidate["package"] == previous["package"] == "com.erudior.app", "APK package identity changed")
    require(bool(candidate["signers"]) and candidate["signers"] == previous["signers"],
            "Signing certificate changed: existing installations cannot upgrade; publication blocked")
    require(candidate["versionCode"] >= previous["versionCode"], "Android versionCode downgrade blocked")


def verify_manifest(manifest, data, version, build):
    require(bool(re.fullmatch(r"[a-f0-9]{40}", build)), "Invalid source commit")
    require(type(manifest.get("schema")) is int and manifest["schema"] == 1, "Invalid manifest schema")
    require(manifest.get("version") == version and manifest.get("build") == build, "Manifest build/version mismatch")
    require(manifest.get("apk") == APK_URL, "Unexpected APK URL")
    require(type(manifest.get("bytes")) is int and 0 < manifest["bytes"] <= MAX_BYTES,
            "Invalid manifest size")
    require(manifest["bytes"] == len(data), "Manifest size does not match APK")
    require(manifest.get("sha256") == hashlib.sha256(data).hexdigest(), "Manifest checksum does not match APK")


def verify_baseline_digest(metadata, data):
    assets = [asset for asset in metadata.get("assets", []) if asset.get("name") == APK_NAME]
    require(len(assets) == 1 and assets[0].get("state") == "uploaded", "Missing or ambiguous public baseline APK")
    require(assets[0].get("size") == len(data), "Public baseline size differs from GitHub metadata")
    require(assets[0].get("digest") == "sha256:" + hashlib.sha256(data).hexdigest(),
            "Public baseline digest differs from GitHub metadata")


def inspect_apk(apk, candidate=True):
    data = apk.read_bytes()
    require(0 < len(data) <= MAX_BYTES, "APK exceeds the 40 MiB release ceiling or is empty")
    with zipfile.ZipFile(apk) as archive:
        require(archive.testzip() is None, "APK ZIP integrity failed")
        names = archive.namelist()
        if candidate:
            require("res/xml/erudior_update_paths.xml" in names, "Updater FileProvider paths missing")
            require(not any(re.search(r"(^|/)(samples/(math|languages)/|colorado-broker-course\.json|dist-courses/|courses-dev/)", n, re.I)
                            for n in names), "Bundled coursework found in release APK")
    tools = Path(os.environ["ANDROID_HOME"]) / "build-tools/35.0.0"
    def run(tool, *args):
        return subprocess.check_output([str(tools / tool), *map(str, args)], text=True)
    info = parse_badging(run("aapt", "dump", "badging", apk))
    info["signers"] = parse_signers(run("apksigner", "verify", "--verbose", "--print-certs", apk))
    require(info["package"] == "com.erudior.app", "Unexpected APK package")
    require(info["abis"] == ["arm64-v8a"], "Release APK must contain only ARM64 native code")
    if candidate:
        require(not info["debuggable"], "Debuggable APK cannot be published")
        run("zipalign", "-c", "-p", "4", apk)
        subprocess.run(["bash", "scripts/android-verify-installer-package.sh", str(apk)], check=True)
    info.update({"bytes": len(data), "sha256": hashlib.sha256(data).hexdigest()})
    return info, data


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("apk", type=Path)
    parser.add_argument("--build", required=True)
    parser.add_argument("--version", required=True)
    parser.add_argument("--manifest", type=Path, required=True)
    parser.add_argument("--create-manifest", action="store_true")
    parser.add_argument("--baseline", type=Path)
    parser.add_argument("--baseline-metadata", type=Path)
    parser.add_argument("--baseline-manifest", type=Path)
    parser.add_argument("--evidence", type=Path, required=True)
    args = parser.parse_args()
    require(bool(re.fullmatch(r"[a-f0-9]{40}", args.build)), "Invalid source commit")
    require(bool(re.fullmatch(r"\d+\.\d+\.\d+", args.version)), "Invalid release version")
    candidate, data = inspect_apk(args.apk)
    require(candidate["version"] == args.version, "Packaged APK version differs from project version")
    if args.create_manifest:
        require(not args.baseline, "Manifest creation and predecessor verification are separate operations")
        manifest = {"schema": 1, "version": args.version, "build": args.build, "apk": APK_URL,
                    "sha256": candidate["sha256"], "bytes": candidate["bytes"],
                    "notes": "Verified native Android updater; courses and progress remain on device."}
        args.manifest.write_text(json.dumps(manifest) + "\n")
        args.apk.with_name(APK_NAME + ".sha256").write_text(candidate["sha256"] + "  " + APK_NAME + "\n")
    manifest = json.loads(args.manifest.read_text())
    verify_manifest(manifest, data, args.version, args.build)
    evidence = {"ok": True, "build": args.build, "candidate": candidate,
                "publicTransportVerified": False, "physicalPhoneVerified": False}
    if args.baseline:
        require(args.baseline_metadata is not None, "GitHub baseline metadata is required")
        previous, previous_data = inspect_apk(args.baseline, candidate=False)
        metadata = json.loads(args.baseline_metadata.read_text())
        verify_baseline_digest(metadata, previous_data)
        validate_upgrade(candidate, previous)
        manifests = [a for a in metadata.get("assets", []) if a.get("name") == "android-update.json"]
        require(len(manifests) <= 1, "Ambiguous public update manifest")
        if manifests:
            require(args.baseline_manifest is not None, "Existing public manifest must be checked")
            previous_manifest = json.loads(args.baseline_manifest.read_text())
            verify_manifest(previous_manifest, previous_data, previous["version"], previous_manifest.get("build", ""))
            # A delayed older workflow must never roll the rolling preview back.
            subprocess.run(["git", "merge-base", "--is-ancestor", previous_manifest["build"], args.build], check=True)
        evidence["previous"] = previous
        evidence["upgradeCompatible"] = True
    args.evidence.parent.mkdir(parents=True, exist_ok=True)
    args.evidence.write_text(json.dumps(evidence, indent=2) + "\n")
    print(json.dumps(evidence, indent=2))


if __name__ == "__main__":
    main()

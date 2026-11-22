"""Collect the platform build outputs and verify every updater package before publication."""
import base64
import datetime
import json
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
from urllib.parse import quote


def collect(artifacts, output, tag, repository):
    config = json.loads(Path("src-tauri/tauri.conf.json").read_text())
    version = config["version"]
    if tag != "v" + version:
        raise ValueError("Installer tag must match the built application version.")
    key = base64.b64decode(config["plugins"]["updater"]["pubkey"], validate=True).decode().splitlines()[1]
    output.mkdir()
    platforms = {}
    packages = {
        "erudior-Windows": [("*_x64_en-US.msi", ["windows-x86_64", "windows-x86_64-msi"]),
                            ("*_x64-setup.exe", ["windows-x86_64-nsis"])],
        "erudior-Linux": [("*_amd64.AppImage", ["linux-x86_64", "linux-x86_64-appimage"]),
                          ("*_amd64.deb", ["linux-x86_64-deb"]), ("*.x86_64.rpm", ["linux-x86_64-rpm"])],
        "erudior-macOS": [("*.app.tar.gz", ["darwin-x86_64", "darwin-aarch64",
                                             "darwin-x86_64-app", "darwin-aarch64-app"]),
                          ("*_universal.dmg", [])],
    }
    for folder, files in packages.items():
        for pattern, targets in files:
            matches = list((artifacts / folder).rglob(pattern))
            if len(matches) != 1 or matches[0].stat().st_size == 0:
                raise ValueError(f"Expected one nonempty {folder}/{pattern}, found {matches}")
            file = matches[0]
            if not file.name.endswith(".app.tar.gz") and version not in file.name:
                raise ValueError(f"Unexpected installer version in {file.name}")
            shutil.copyfile(file, output / file.name)
            if not targets:
                shutil.copyfile(file, output / "Erudior-macOS-universal.dmg")
                continue
            sig = file.with_name(file.name + ".sig")
            signature = sig.read_text().strip()
            with tempfile.NamedTemporaryFile() as temp:
                temp.write(base64.b64decode(signature, validate=True))
                temp.flush()
                subprocess.run(["minisign", "-Vm", str(file), "-P", key, "-x", temp.name], check=True)
            shutil.copyfile(sig, output / sig.name)
            url = f"https://github.com/{repository}/releases/download/{tag}/{quote(file.name)}"
            for target in targets:
                platforms[target] = {"signature": signature, "url": url}
    manifest = {"version": version, "notes": f"Erudior {version} desktop update.",
                "pub_date": datetime.datetime.now(datetime.timezone.utc).isoformat(), "platforms": platforms}
    (output / "latest.json").write_text(json.dumps(manifest, indent=2) + "\n")


if __name__ == "__main__":
    collect(Path(sys.argv[1]), Path(sys.argv[2]), sys.argv[3], sys.argv[4])

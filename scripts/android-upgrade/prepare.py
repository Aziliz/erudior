#!/usr/bin/env python3
"""Configure a disposable x86_64 CI build; NEVER modify the production updater."""
import json
import os
from pathlib import Path
import shutil
import xml.etree.ElementTree as ET

ANDROID = "http://schemas.android.com/apk/res/android"
PREFIX = "https://github.com/Aziliz/erudior/releases/download/android-preview/"
ORIGIN = "https://127.0.0.1:38473"
MARKER = "// ERUDIOR_UPGRADE_E2E_ONLY"


def prepare(root: Path) -> None:
    if os.environ.get("GITHUB_ACTIONS") != "true" or os.environ.get("ERUDIOR_UPGRADE_E2E") != "1":
        raise RuntimeError("This generator only runs in the isolated upgrade CI job")
    generated = root / "src-tauri/gen/android/app/src/main"
    plugin = generated / "java/com/erudior/updates/InstallerPlugin.kt"
    production = root / "src-tauri/android-installer/src/main/java/com/erudior/updates/InstallerPlugin.kt"
    original = production.read_bytes()
    source = plugin.read_text()
    if MARKER in source:
        raise RuntimeError("Test configuration already applied; use a clean generated project")
    for name in ["android-update.json", "Erudior-Android-arm64.apk"]:
        old = PREFIX + name
        if source.count(old) != 1:
            raise RuntimeError(f"Expected exactly one fixed native endpoint: {name}")
        source = source.replace(old, ORIGIN + "/" + name)
    anchor = "    override fun load(webView: WebView) {"
    if source.count(anchor) != 1:
        raise RuntimeError("Unknown plugin load lifecycle; refusing an unverified rewrite")
    # Preserve the production lifecycle bridge; only generated CI copies enable inspection.
    source = source.replace(anchor, anchor + "\n" + MARKER + "\n"
        "        android.webkit.WebView.setWebContentsDebuggingEnabled(true)\n")
    plugin.write_text(source)
    raw = generated / "res/raw"
    raw.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(root / ".android-upgrade/ca.pem", raw / "erudior_upgrade_test_ca.pem")
    xml = generated / "res/xml"
    xml.mkdir(parents=True, exist_ok=True)
    (xml / "erudior_upgrade_test_network.xml").write_text('''<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
  <base-config cleartextTrafficPermitted="false"><trust-anchors><certificates src="system" /></trust-anchors></base-config>
  <domain-config cleartextTrafficPermitted="false">
    <domain includeSubdomains="false">127.0.0.1</domain>
    <trust-anchors><certificates src="@raw/erudior_upgrade_test_ca" /></trust-anchors>
  </domain-config>
</network-security-config>
''')
    ET.register_namespace("android", ANDROID)
    manifest = generated / "AndroidManifest.xml"
    tree = ET.parse(manifest)
    app = tree.getroot().find("application")
    if app is None:
        raise RuntimeError("No Android application in generated manifest")
    app.set(f"{{{ANDROID}}}networkSecurityConfig", "@xml/erudior_upgrade_test_network")
    tree.write(manifest, encoding="unicode")
    entry = root / "src/main.tsx"
    entry.write_text(entry.read_text() + '\n// ERUDIOR_UPGRADE_E2E_ONLY\nimport "./__androidUpgradeE2E";\n')
    shutil.copyfile(root / "scripts/android-upgrade/fixture.ts", root / "src/__androidUpgradeE2E.ts")
    for variant, patch in [("a", 1), ("b", 2)]:
        (root / f"src-tauri/ci-upgrade-{variant}.json").write_text(json.dumps({
            "version": f"0.25.{patch}",
            "bundle": {"android": {"versionCode": 250000 + patch}},
        }))
    if production.read_bytes() != original:
        raise RuntimeError("Production Kotlin was changed")
    print("Configured CI-only native HTTPS fixture and WebView inspection; production updater unchanged")


if __name__ == "__main__":
    prepare(Path(__file__).resolve().parents[2])

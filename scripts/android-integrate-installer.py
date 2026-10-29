#!/usr/bin/env python3
"""Integrate the private-cache installer bridge into Tauri's generated Android project."""
from pathlib import Path
import shutil

root = Path("src-tauri/gen/android/app/src/main")
main = root / "java/com/erudior/app/MainActivity.kt"
if not main.exists():
    raise SystemExit(f"Missing generated Tauri Android MainActivity: {main}")
# Keep Tauri's generated MainActivity intact. Plugin registration belongs in
# the Rust mobile plugin lifecycle; rewriting the activity broke Kotlin builds.
# Kotlin source and FileProvider resources are integrated independently.

plugin_root = Path("src-tauri/android-installer/src/main")
target = root / "java/com/erudior/updates/InstallerPlugin.kt"
target.parent.mkdir(parents=True, exist_ok=True)
shutil.copy2(plugin_root / "java/com/erudior/updates/InstallerPlugin.kt", target)
res = root / "res/xml/erudior_update_paths.xml"
res.parent.mkdir(parents=True, exist_ok=True)
shutil.copy2(plugin_root / "res/xml/erudior_update_paths.xml", res)
manifest = root / "AndroidManifest.xml"
xml = manifest.read_text()
if "com.erudior.app.erudior-updates" not in xml:
    xml = xml.replace(
        "<manifest ",
        '<manifest ',
        1,
    )
    xml = xml.replace(
        "<application",
        '<uses-permission android:name="android.permission.REQUEST_INSTALL_PACKAGES" />\n  <application',
        1,
    )
    provider = '''
    <provider android:name="androidx.core.content.FileProvider"
      android:authorities="${applicationId}.erudior-updates"
      android:exported="false" android:grantUriPermissions="true">
      <meta-data android:name="android.support.FILE_PROVIDER_PATHS"
        android:resource="@xml/erudior_update_paths" />
    </provider>
'''
    xml = xml.replace("</application>", provider + "  </application>", 1)
    manifest.write_text(xml)
print("Android FileProvider installer bridge included in generated application")

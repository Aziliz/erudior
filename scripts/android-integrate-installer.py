#!/usr/bin/env python3
"""Integrate a uniquely named private-cache provider without changing MainActivity."""
from pathlib import Path
import shutil
import xml.etree.ElementTree as ET

ANDROID = "http://schemas.android.com/apk/res/android"
TOOLS = "http://schemas.android.com/tools"
PROVIDER = "com.erudior.updates.ErudiorUpdateFileProvider"
AUTHORITY = "${applicationId}.erudior-updates"


def integrate(project: Path) -> None:
    root = project / "src-tauri/gen/android/app/src/main"
    main = root / "java/com/erudior/app/MainActivity.kt"
    if not main.is_file():
        raise RuntimeError(f"Missing generated Tauri Android MainActivity: {main}")
    # Never rewrite Tauri's activity. Register the plugin through the Rust lifecycle.
    plugin_root = project / "src-tauri/android-installer/src/main"
    for name in ["InstallerPlugin.kt", "ErudiorUpdateFileProvider.kt"]:
        relative = Path("java/com/erudior/updates") / name
        target = root / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(plugin_root / relative, target)
    relative = Path("res/xml/erudior_update_paths.xml")
    (root / relative).parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(plugin_root / relative, root / relative)
    ET.register_namespace("android", ANDROID)
    ET.register_namespace("tools", TOOLS)
    manifest = root / "AndroidManifest.xml"
    tree = ET.parse(manifest)
    document = tree.getroot()
    app = document.find("application")
    if app is None:
        raise RuntimeError("Generated Android manifest has no application element")
    name_attr = f"{{{ANDROID}}}name"
    authority_attr = f"{{{ANDROID}}}authorities"
    permission = "android.permission.REQUEST_INSTALL_PACKAGES"
    if not any(node.get(name_attr) == permission for node in document.findall("uses-permission")):
        document.insert(0, ET.Element("uses-permission", {name_attr: permission}))
    matches = [node for node in app.findall("provider") if node.get(authority_attr)
               in [AUTHORITY, "com.erudior.app.erudior-updates"]]
    if len(matches) > 1:
        raise RuntimeError("Duplicate Erudior update authorities; refusing an ambiguous provider")
    provider = matches[0] if matches else ET.SubElement(app, "provider")
    # Tauri already owns androidx.core.content.FileProvider. Reusing its class
    # registers competing authorities against one Android component identity.
    provider.set(name_attr, PROVIDER)
    provider.set(authority_attr, AUTHORITY)
    provider.set(f"{{{ANDROID}}}exported", "false")
    provider.set(f"{{{ANDROID}}}grantUriPermissions", "true")
    for child in list(provider):
        if child.tag == "meta-data" and child.get(name_attr) == "android.support.FILE_PROVIDER_PATHS":
            provider.remove(child)
    ET.SubElement(provider, "meta-data", {
        name_attr: "android.support.FILE_PROVIDER_PATHS",
        f"{{{ANDROID}}}resource": "@xml/erudior_update_paths",
    })
    tree.write(manifest, encoding="unicode")
    print("Unique Erudior update FileProvider integrated; generated Tauri activity and provider preserved")


if __name__ == "__main__":
    integrate(Path.cwd())

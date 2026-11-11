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
    # Diagnostics/fault injection exist only in this disposable copy. Production
    # callbacks, state reducer, timing, authorization and endpoints stay untouched.
    diagnostics = {
        "    private fun notifyLifecycle() {":
            '\n        android.util.Log.i("ErudiorLifecycleE2E", "notify sequence=${lifecycleState.sequence()} paused=${lifecycleState.paused()} backgroundMs=${lifecycleState.backgroundMs()} webView=${lifecycleWebView != null} revocation=${lifecycleState.revocation()}")',
        "    override fun load(webView: WebView) {":
            '\n        android.util.Log.i("ErudiorLifecycleE2E", "load")',
        "    override fun onDestroy(activity: AppCompatActivity) {":
            '\n        android.util.Log.i("ErudiorLifecycleE2E", "destroy")',
        "                                    webView.visibility = View.VISIBLE":
            '\n                                    android.util.Log.i("ErudiorLifecycleE2E", "visible sequence=$sequence")',
        "                { result ->":
            '\n                    android.util.Log.i("ErudiorLifecycleE2E", "evaluated sequence=$sequence result=$result")',
        "        lifecycleState.pause(SystemClock.elapsedRealtime())":
            '\n        if (lifecycleLongResumes == 1 && !lifecyclePauseDropDone) lifecyclePauseDropSequence = lifecycleState.sequence()',
        "        lifecycleState.resume(SystemClock.elapsedRealtime())":
            '\n        if (lifecycleState.backgroundMs() >= 30_000L) lifecycleLongResumes++\n'
            '        if (lifecycleLongResumes == 2 && lifecycleState.backgroundMs() >= 30_000L) lifecycleDropSequence = lifecycleState.sequence()',
    }
    for anchor, diagnostic in diagnostics.items():
        if source.count(anchor) != 1:
            raise RuntimeError("Unknown native lifecycle diagnostic anchor; refusing rewrite")
        source = source.replace(anchor, anchor + diagnostic)
    anchor = "    private var lifecycleWebView: WebView? = null"
    if source.count(anchor) != 1:
        raise RuntimeError("Unknown lifecycle fields; refusing diagnostic rewrite")
    source = source.replace(anchor, anchor + '\n    private var lifecycleLongResumes = 0\n'
        '    private var lifecycleDropSequence = -1L\n    private var lifecycleDropDone = false\n'
        '    private var lifecyclePauseDropSequence = -1L\n    private var lifecyclePauseDropDone = false\n'
        '    private var lifecycleNativePauseDropDone = false')
    # The third HOME omits the native callback itself, reproducing an unpaired
    # resume rather than the second case's lost JavaScript evaluation. Do not set
    # clocks, revocation tokens, DOM locks, or authorization in this fault fixture.
    anchor = "    override fun onPause(activity: AppCompatActivity) {"
    if source.count(anchor) != 1:
        raise RuntimeError("Unknown native pause callback; refusing fault injection")
    source = source.replace(anchor, anchor + '\n'
        '        if (lifecycleLongResumes == 2 && lifecyclePauseDropDone && lifecycleDropDone && !lifecycleNativePauseDropDone) {\n'
        '            check(!lifecycleState.paused() && !lifecycleState.pending() && lifecycleState.revocation() == 0L) { "Missing-pause fixture requires consumed foreground state" }\n'
        '            lifecycleNativePauseDropDone = true\n'
        '            android.util.Log.i("ErudiorLifecycleE2E", "drop-native-pause sequence=${lifecycleState.sequence()}")\n'
        '            return\n'
        '        }')
    evaluation = "            webView.evaluateJavascript("
    if source.count(evaluation) != 1:
        raise RuntimeError("Unknown lifecycle evaluation; refusing diagnostic rewrite")
    # Drop the second HOME pause and first evaluation of its qualifying resume.
    # The unchanged production retry must deliver it; no JS lock event is injected.
    source = source.replace(evaluation,
        '            if (sequence == lifecyclePauseDropSequence && !lifecyclePauseDropDone) {\n'
        '                check(webView.visibility == View.INVISIBLE) { "Lost pause must remain natively concealed" }\n'
        '                lifecyclePauseDropDone = true\n'
        '                android.util.Log.i("ErudiorLifecycleE2E", "drop-pause sequence=$sequence")\n'
        '            } else if (sequence == lifecycleDropSequence && !lifecycleDropDone) {\n'
        '                check(webView.visibility == View.INVISIBLE) { "Lost resume must remain natively concealed" }\n'
        '                lifecycleDropDone = true\n'
        '                android.util.Log.i("ErudiorLifecycleE2E", "drop-resume sequence=$sequence")\n'
        '            } else webView.evaluateJavascript(')
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

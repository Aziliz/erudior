import { readFileSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";
import { validateAndroidRelease, compareAndroidVersions, shouldOfferAndroidUpdate } from "../src/lib/androidUpdates.ts";

const release = {
  schema: 1, version: "0.25.1",
  build: "a".repeat(40),
  apk: "https://github.com/Aziliz/erudior/releases/download/android-preview/Erudior-Android-arm64.apk",
  sha256: "b".repeat(64), bytes: 11246912,
};
test("accepts exact GitHub Android release metadata", () => {
  assert.deepEqual(validateAndroidRelease(release), release);
});
test("rejects redirected download URLs and malformed hashes", () => {
  assert.throws(() => validateAndroidRelease({ ...release, apk: "https://example.org/app.apk" }));
  assert.throws(() => validateAndroidRelease({ ...release, sha256: "a" }));
  assert.throws(() => validateAndroidRelease({ ...release, bytes: 50000000 }));
  assert.throws(() => validateAndroidRelease({ ...release, build: "not-a-sha" }));
});

test("numeric version ordering and installed build identity", () => {
  assert.equal(compareAndroidVersions("0.25.10", "0.25.9"), 1);
  assert.equal(compareAndroidVersions("0.24.0", "0.25.0"), -1);
  assert.equal(compareAndroidVersions("0.25.0", "0.25.0"), 0);
  assert.equal(shouldOfferAndroidUpdate(release, "0.25.0", release.build), true);
  assert.equal(shouldOfferAndroidUpdate(release, "0.25.1", ""), false);
  assert.equal(shouldOfferAndroidUpdate(release, "0.25.2", "c".repeat(40)), false);
  assert.equal(shouldOfferAndroidUpdate(release, "0.25.0", "c".repeat(40)), true);
  assert.equal(shouldOfferAndroidUpdate(release, "0.24.9", ""), true);
});

test("Android installer never re-downloads an unverified APK", () => {
  const updates = readFileSync("src/lib/updates.ts", "utf8");
  assert.ok(!updates.includes("await openUrl(release.apk)"));
  assert.match(updates, /launch_android_installer/);
  assert.match(updates, /android_download_verified_apk/);
});

test("Android FileProvider bridge is limited to verified private-cache APK", () => {
  const plugin = readFileSync("src-tauri/android-installer/src/main/java/com/erudior/updates/InstallerPlugin.kt", "utf8");
  const paths = readFileSync("src-tauri/android-installer/src/main/res/xml/erudior_update_paths.xml", "utf8");
  const manifest = readFileSync("src-tauri/android-installer/src/main/AndroidManifest.xml", "utf8");
  assert.match(plugin, /updates\/verified-update\.apk/);
  assert.match(plugin, /FileProvider\.getUriForFile/);
  assert.match(plugin, /FLAG_GRANT_READ_URI_PERMISSION/);
  assert.match(plugin, /canRequestPackageInstalls/);
  assert.match(paths, /cache-path/);
  assert.ok(!paths.includes("external-path"));
  assert.match(manifest, /android:exported="false"/);
});

test("Android integration leaves generated Tauri MainActivity unmodified", () => {
  const script = readFileSync("scripts/android-integrate-installer.py", "utf8");
  assert.ok(!script.includes("main.write_text("));
  assert.ok(!script.includes("registerPlugin(InstallerPlugin::class.java)"));
  assert.match(script, /InstallerPlugin\.kt/);
});

test("installer rechecks the original release checksum rather than trusting a recomputed file digest", () => {
  const rust = readFileSync("src-tauri/src/lib.rs", "utf8");
  const updates = readFileSync("src/lib/updates.ts", "utf8");
  assert.match(rust, /fn launch_android_installer\(app: AppHandle, expected_sha256: String\)/);
  assert.match(rust, /verify_android_update_bytes\(&bytes, &expected_sha256\)/);
  assert.match(updates, /launch_android_installer", \{ expectedSha256: release.sha256 \}/);
});

test("WebView CSP permits Android release manifest and redirected APK asset hosts", () => {
  const config = JSON.parse(readFileSync("src-tauri/tauri.conf.json", "utf8"));
  const connect = config.app.security.csp.split("connect-src ")[1]?.split(";")[0] ?? "";
  assert.match(connect, /https:\/\/github\.com/);
  assert.match(connect, /https:\/\/release-assets\.githubusercontent\.com/);
  assert.match(connect, /https:\/\/objects\.githubusercontent\.com/);
});

test("Android update downloads use native HTTP and preserve release checksum", () => {
  const updates = readFileSync("src/lib/updates.ts", "utf8");
  const rust = readFileSync("src-tauri/src/lib.rs", "utf8");
  const kotlin = readFileSync("src-tauri/android-installer/src/main/java/com/erudior/updates/InstallerPlugin.kt", "utf8");
  assert.match(updates, /android_fetch_manifest/);
  assert.match(updates, /android_download_verified_apk/);
  assert.ok(!updates.includes("fetchAndroidRelease()"));
  assert.match(rust, /run_mobile_plugin\("downloadVerifiedApk"/);
  assert.match(kotlin, /HttpURLConnection/);
  assert.match(kotlin, /APK checksum mismatch/);
});

test("Native release downloader validates HTTPS redirects and APK ZIP header", () => {
  const kotlin = readFileSync("src-tauri/android-installer/src/main/java/com/erudior/updates/InstallerPlugin.kt", "utf8");
  assert.match(kotlin, /Manifest redirect is not HTTPS/);
  assert.match(kotlin, /APK redirect is not HTTPS/);
  assert.match(kotlin, /Downloaded APK is not a ZIP archive/);
});

test("Native Android installer rejects wrong package and signing certificate", () => {
  const kotlin = readFileSync("src-tauri/android-installer/src/main/java/com/erudior/updates/InstallerPlugin.kt", "utf8");
  assert.match(kotlin, /archive\.packageName != activity\.packageName/);
  assert.match(kotlin, /archiveSignatures != installedSignatures/);
  assert.match(kotlin, /GET_SIGNING_CERTIFICATES/);
});

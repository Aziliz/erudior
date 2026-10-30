import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../src/pages/DownloadPage.tsx", import.meta.url), "utf8");

test("Android preview recognizes a real .apk file, not a literal backslash", () => {
  assert.ok(source.includes(String.raw`/\.apk$/i`));
  assert.ok(!source.includes(String.raw`/\\.apk$/i`));
});

test("Android public download uses a release asset rather than a workflow artifact", () => {
  assert.match(source, /releases\/tags\/android-preview/);
  assert.match(source, /browser_download_url/);
  assert.match(source, /!r\.draft/);
  assert.match(source, /coming soon/);
});

test("published Android download stays clickable when GitHub's release API is unavailable", () => {
  assert.match(source, /ANDROID_PREVIEW_DOWNLOAD = `\$\{RELEASES\}\/download\/android-preview\/Erudior-Android-arm64\.apk`/);
  assert.match(source, /androidApk\s*\? link\(androidApk, "Download Android APK"/);
  assert.match(source, /href=\{ANDROID_PREVIEW_DOWNLOAD\}/);
  assert.match(source, /install over the existing app/);
  assert.match(source, /do not uninstall it first/);
});

test("download page metadata identifies Android alongside desktop", () => {
  const site = readFileSync(new URL("../src/Site.tsx", import.meta.url), "utf8");
  assert.match(site, /Download Erudior for Android, Windows, macOS and Linux/);
});

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
  assert.match(updates, /System installer handoff is not yet implemented/);
  assert.match(updates, /stage_android_update/);
});

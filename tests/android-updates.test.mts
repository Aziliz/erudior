import test from "node:test";
import assert from "node:assert/strict";
import { validateAndroidRelease } from "../src/lib/androidUpdates.ts";

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

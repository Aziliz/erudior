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

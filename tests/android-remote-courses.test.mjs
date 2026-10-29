import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const workflow = fs.readFileSync(".github/workflows/android.yml", "utf8");
const vite = fs.readFileSync("vite.config.ts", "utf8");
const remoteStub = fs.readFileSync("src/lib/bundledCourses.remote.ts", "utf8");
const catalog = fs.readFileSync("src/lib/catalog.ts", "utf8");
const source = fs.readFileSync("src/lib/courseSource.ts", "utf8");

test("both Android build jobs use live remote course endpoint", () => {
  assert.equal(process.env.VITE_COURSES_URL, "https://courses.erudior.com/v1/");
  assert.equal((workflow.match(/VITE_COURSES_URL: https:\/\/courses\.erudior\.com\/v1\//g) ?? []).length, 2);
});

test("Vite replaces bulky bundled course imports when remote URL is configured", () => {
  assert.match(vite, /const remote = !!process\.env\.VITE_COURSES_URL/);
  assert.ok(vite.includes('find: "./bundledCourses"'));
  assert.ok(vite.includes('bundledCourses.remote.ts'));
  assert.ok(remoteStub.includes("isn't bundled in this build"));
});

test("catalog loads individual course files on demand", () => {
  assert.ok(catalog.includes("if (REMOTE) return downloadCourse(entry)"));
  assert.ok(source.includes("export const REMOTE = BASE !=="));
  assert.ok(source.includes("await fetchBytes(entry.file"));
  assert.ok(source.includes("entry.sha256"));
});

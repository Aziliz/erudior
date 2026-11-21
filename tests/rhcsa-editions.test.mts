import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { CATALOG, carryForwardLessons, setCatalog, type CatalogEntry } from "../src/lib/catalog.ts";
import { importValidatedCourseSnapshot } from "../src/lib/courseIntegrity.ts";
import { pathToView } from "../src/lib/routes.ts";
import type { Progress } from "../src/lib/types.ts";

const entries: CatalogEntry[] = JSON.parse(readFileSync("samples/catalog.json", "utf8"));
const current = entries.find(e => e.id === "rhcsa-rhel10-administration")!;
const previous = { id: "rhcsa-rhel10-study", title: "RHCSA preparation • RHEL 10 lessons and quizzes" };
assert.deepEqual(entries.filter(e => e.id.startsWith("rhcsa-rhel10-")).map(e => e.id), [current.id]);
assert.equal(existsSync("samples/rhcsa-10-study.json"), false);
for (const [native, userAgent] of [[false, "Firefox Linux"], [true, "Windows NT"], [true, "Macintosh"], [true, "X11 Linux"], [true, "Android"], [true, "iPhone"]] as const) {
  Object.defineProperty(globalThis, "isTauri", { configurable: true, value: native });
  Object.defineProperty(globalThis, "navigator", { configurable: true, value: { userAgent } });
  setCatalog(entries);
  assert.deepEqual(CATALOG.filter(e => e.id.startsWith("rhcsa-rhel10-")).map(e => e.id), [current.id]);
}
// A saved older catalog may still describe the duplicate as available or archived.
for (const platform of ["study", "archived"] as const) {
  setCatalog([...entries, { ...current, ...previous, platform, supersededBy: current.id }]);
  assert.deepEqual(CATALOG.filter(e => e.id.startsWith("rhcsa-rhel10-")).map(e => e.id), [current.id]);
}
setCatalog([
  { ...current, ...previous, platform: "study", revision: 2 },
  { ...current, platform: "desktop", revision: 2, title: "Earlier desktop edition" },
]);
assert.deepEqual(CATALOG.map(e => e.title), [current.title]);
setCatalog(entries);
for (const alias of current.aliases ?? []) {
  assert.deepEqual(pathToView("/" + alias, "", [], CATALOG), { name: "overview", catalogId: current.id });
  const deep = pathToView("/" + alias + "/lessons/shell-evidence", "", [], CATALOG);
  assert.equal(deep?.name === "overview" && deep.requestedPath?.endsWith("/lessons/shell-evidence"), true);
}
assert.deepEqual(pathToView("/" + previous.id, "", [previous], CATALOG), { name: "overview", catalogId: current.id });

const course = importValidatedCourseSnapshot(readFileSync("samples/" + current.file, "utf8"));
assert.deepEqual(pathToView("/" + previous.id + "/lessons/root-recovery", "", [previous, current], CATALOG), { name: "lesson", courseId: current.id, lessonId: "root-recovery" });
const questions = course.banks.flatMap(bank => bank.questions);
assert.equal(course.id, current.id);
assert.equal(course.revision, current.revision);
assert.equal(course.lessons.length, current.lessons);
assert.equal(questions.length, current.questions);
assert.deepEqual(course.lessons.map(l => l.id), current.lessonIds);
assert.deepEqual(current.outline, course.modules.map(m => ({ title: m.title, lessons: course.lessons.filter(l => l.module === m.id).map(l => l.title) })));
assert.equal(course.lessons.filter(l => l.vmLab).length, 14);
assert(course.lessons.filter(l => !l.vmLab).every(l => l.quiz?.length && l.quiz.every(id => questions.some(q => q.id === id))));
assert(course.lessons.findIndex(l => l.id === "first-prompt") < course.lessons.findIndex(l => l.id === "shell-evidence"));

const done = { [previous.id + "/shell-evidence"]: "2026-10-01", [previous.id + "/first-session"]: "2026-10-02", [current.id + "/first-session"]: "2026-10-03", [previous.id + "/practice-exam"]: "2026-10-04" };
const p = { lessonsDone: done, attempts: [] } as unknown as Progress;
const merged = carryForwardLessons(current.id, p);
assert.equal(merged.lessonsDone[current.id + "/shell-evidence"], "2026-10-01");
assert.equal(merged.lessonsDone[current.id + "/first-session"], "2026-10-03");
assert.equal(merged.lessonsDone[current.id + "/practice-exam"], undefined);
assert.equal(p.lessonsDone[current.id + "/shell-evidence"], undefined);
assert.equal(merged.attempts, p.attempts);
assert.equal(carryForwardLessons(current.id, merged), merged);
console.log("Unified RHCSA catalog, routes, course import, quiz links, practicals and legacy completion checks passed.");

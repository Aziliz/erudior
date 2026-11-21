import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { CATALOG, carryForwardLessons, isPublishedCourse, replacementFor, setCatalog, type CatalogEntry } from "../src/lib/catalog.ts";
import { importValidatedCourseSnapshot } from "../src/lib/courseIntegrity.ts";
import { pathToView } from "../src/lib/routes.ts";
import type { Progress } from "../src/lib/types.ts";

const entries: CatalogEntry[] = JSON.parse(readFileSync("samples/catalog.json", "utf8"));
const current = entries.find(e => e.id === "rhcsa-rhel10-administration")!;
const previous = entries.find(e => e.id === "rhcsa-rhel10-study")!;
assert.equal(previous.platform, "archived");
assert.equal(previous.supersededBy, current.id);
for (const [native, userAgent] of [[false, "Firefox Linux"], [true, "Windows NT"], [true, "Macintosh"], [true, "X11 Linux"], [true, "Android"], [true, "iPhone"]] as const) {
  Object.defineProperty(globalThis, "isTauri", { configurable: true, value: native });
  Object.defineProperty(globalThis, "navigator", { configurable: true, value: { userAgent } });
  setCatalog(entries);
  assert.deepEqual(CATALOG.filter(e => e.id.startsWith("rhcsa-rhel10-")).map(e => e.id), [current.id]);
}
assert.equal(replacementFor(previous.id)?.id, current.id);
assert(isPublishedCourse(previous));
for (const alias of current.aliases ?? []) {
  assert.deepEqual(pathToView("/" + alias, "", [], CATALOG), { name: "overview", catalogId: current.id });
  const deep = pathToView("/" + alias + "/lessons/shell-evidence", "", [], CATALOG);
  assert.equal(deep?.name === "overview" && deep.requestedPath?.endsWith("/lessons/shell-evidence"), true);
}
assert.deepEqual(pathToView("/" + previous.id, "", [previous], CATALOG), { name: "course", courseId: previous.id });

const course = importValidatedCourseSnapshot(readFileSync("samples/" + current.file, "utf8"));
const archived = importValidatedCourseSnapshot(readFileSync("samples/" + previous.file, "utf8"));
const questions = course.banks.flatMap(bank => bank.questions);
assert.equal(course.id, current.id);
assert.equal(course.revision, current.revision);
assert.equal(course.lessons.length, current.lessons);
assert.equal(questions.length, current.questions);
assert.deepEqual(course.lessons.map(l => l.id), current.lessonIds);
assert.deepEqual(current.outline, course.modules.map(m => ({ title: m.title, lessons: course.lessons.filter(l => l.module === m.id).map(l => l.title) })));
assert(archived.lessons.every(old => course.lessons.some(l => l.id === old.id)));
assert(archived.banks[0].questions.every(old => questions.some(q => q.id === old.id)));
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

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { CATALOG, setCatalog, type CatalogEntry } from "../src/lib/catalog.ts";

const entries: CatalogEntry[] = JSON.parse(readFileSync("samples/catalog.json", "utf8"));
const editions = entries.filter(entry => entry.id.startsWith("rhcsa-rhel10-"));
const study = editions.find(entry => entry.platform === "study")!;
const desktop = editions.find(entry => entry.platform === "desktop")!;
assert.equal(editions.length, 2);
assert(CATALOG.some(entry => entry.id === study.id));
assert(!CATALOG.some(entry => entry.id === desktop.id));

for (const [native, userAgent, expectedId] of [
  [false, "Firefox Linux", study.id],
  [true, "Windows NT", desktop.id],
  [true, "Macintosh", desktop.id],
  [true, "X11 Linux", desktop.id],
  [true, "Android", study.id],
  [true, "iPhone", study.id],
] as const) {
  Object.defineProperty(globalThis, "isTauri", { configurable: true, value: native });
  Object.defineProperty(globalThis, "navigator", { configurable: true, value: { userAgent } });
  setCatalog(entries);
  assert.deepEqual(CATALOG.filter(entry => editions.some(e => e.id === entry.id)).map(entry => entry.id), [expectedId]);
  assert(CATALOG.some(entry => !entry.platform));
}

type Course = {
  id: string; revision: number; lessons: { id: string; quiz?: string[]; vmLab?: unknown }[];
  banks: { questions: { id: string }[] }[];
};
const load = (e: CatalogEntry): Course => JSON.parse(readFileSync("samples/" + e.file, "utf8"));
const webCourse = load(study);
const desktopCourse = load(desktop);
for (const [course, entry] of [[webCourse, study], [desktopCourse, desktop]] as const) {
  assert.equal(course.id, entry.id);
  assert.equal(course.revision, entry.revision);
  assert.equal(course.lessons.length, entry.lessons);
  assert.equal(course.banks.flatMap(bank => bank.questions).length, entry.questions);
  assert.deepEqual(course.lessons.map(lesson => lesson.id), entry.lessonIds);
}
assert.deepEqual(webCourse.banks.flatMap(bank => bank.questions), desktopCourse.banks.flatMap(bank => bank.questions));
const questions = webCourse.banks.flatMap(bank => bank.questions).map(q => q.id);
assert(webCourse.lessons.every(lesson => !lesson.vmLab && lesson.quiz?.length && lesson.quiz.every(id => questions.includes(id))));
assert.equal(desktopCourse.lessons.filter(lesson => lesson.vmLab).length, 14);
console.log("RHCSA catalog visibility, edition revisions, browser quizzes and desktop practicals passed.");

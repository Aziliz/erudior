import assert from "node:assert/strict";
import type { CatalogEntry } from "../src/lib/catalog";
import type { Course, Progress } from "../src/lib/types";
import type { LearningPathway } from "../src/lib/learningPathways";

// Exercise the production profile and backup boundaries with isolated synthetic state.
const state = new Map<string, string>();
const writes: string[] = [];
(globalThis as any).isTauri = true;
(globalThis as any).window = { __TAURI_INTERNALS__: { invoke: async (command: string, args: any) => {
  if (command === "load_state") return state.get(args.name) ?? null;
  if (command === "compare_and_swap_state") {
    if ((state.get(args.name) ?? null) !== args.expected) return false;
    state.set(args.name, args.content); writes.push(args.name); return true;
  }
  if (command === "save_state") {
    if (args.content === null) state.delete(args.name); else state.set(args.name, args.content);
    writes.push(args.name); return;
  }
  if (command === "delete_item") { writes.push("delete:" + args.id); return; }
  throw new Error("Unexpected storage command " + command);
} } };

const { parseLearningPathways, starterPathways, pathwayProgress, LEARNING_PATHWAY_LIMITS } = await import("../src/lib/learningPathways");
const store = await import("../src/lib/storage");
const { emptyCourse } = await import("../src/lib/course");
const { CATALOG } = await import("../src/lib/catalog");
const { parseAnonymousProgress, captureAnonymousRecovery, parseAnonymousRecovery, recoveryProgress } = await import("../src/lib/anonymousPrivacy");
const { collect, restoreContents, encryptText, decryptText } = await import("../src/lib/backup");
const date = "2026-10-29";
const path: LearningPathway = { id: "personal-math", title: "My math pathway", courseIds: ["a", "b", "missing"] };

assert.deepEqual(parseLearningPathways(undefined), []);
assert.deepEqual(parseLearningPathways([]), []);
assert.deepEqual(parseLearningPathways([path]), [path]);
const copy = parseLearningPathways([path]);
copy[0].courseIds.reverse();
assert.deepEqual(path.courseIds, ["a", "b", "missing"], "parsed pathways do not retain mutable input arrays");

for (const malformed of [
  null, {}, "[]", [null], [{}], [{ ...path, extra: true }], [{ ...path, id: "__proto__" }],
  [{ ...path, id: "../other" }], [{ ...path, title: " " }], [{ ...path, title: " padded " }],
  [{ ...path, title: "a\nb" }], [{ ...path, title: "x".repeat(LEARNING_PATHWAY_LIMITS.title + 1) }],
  [{ ...path, courseIds: [] }], [{ ...path, courseIds: ["a", "a"] }],
  [{ ...path, courseIds: ["__proto__"] }], [{ ...path, courseIds: ["a", null] }],
  [{ ...path, courseIds: Array.from({ length: 101 }, (_, i) => "course" + i) }],
  [path, path], Array.from({ length: 21 }, (_, i) => ({ ...path, id: "path" + i })),
  [Object.assign(Object.create({ inherited: true }), path)],
]) assert.throws(() => parseLearningPathways(malformed), /Invalid learning pathways/);

const starters = starterPathways();
assert.deepEqual(starters.find(p => p.id === "math-foundations")?.courseIds, [
  "math-prealgebra", "math-algebra1", "math-algebra2", "math-geometry", "math-trigonometry", "math-precalculus", "math-calculus",
]);
assert.equal(starters.find(p => p.id === "german-a1-b1")?.courseIds.length, 3);
assert(!starters.some(p => /data science/i.test(p.title)), "starter paths do not invent unavailable courses");
assert(!starterPathways(CATALOG.filter(c => c.id !== "math-calculus")).some(p => p.id === "math-foundations"));
assert.deepEqual(starterPathways([]), []);

function course(id: string, lessonCount: number): Course {
  const base = emptyCourse("Course " + id);
  return { ...base, id, modules: [{ id: "main", title: "Core" }], banks: [], lessons: Array.from({ length: lessonCount }, (_, i) => ({
    id: "lesson" + (i + 1), module: "main", title: "Lesson " + (i + 1), body: "Synthetic lesson.",
  })) };
}
function entry(id: string, lessonIds: string[]): CatalogEntry {
  return { ...CATALOG[0], id, title: "Catalog " + id, lessons: lessonIds.length, lessonIds, requires: [] };
}
const a = course("a", 2), b = course("b", 8), progress: Progress = store.emptyProgress();
for (const id of ["a/lesson1", "a/lesson2", "b/lesson1", "b/lesson2", "b/lesson3", "b/lesson4", "a/obsolete"]) progress.lessonsDone[id] = date;
const summary = pathwayProgress(path, [a, b], progress, []);
assert.equal(summary.percent, 50, "equal course shares: (100 + 50 + unavailable 0) / 3, not lesson-weighted");
assert.equal(summary.completedCourses, 1);
assert.equal(summary.totalCourses, 3);
assert.equal(summary.nextCourseId, "b");
assert.equal(summary.steps[2].available, false);
assert.equal(summary.steps[2].percent, null);
assert.equal(pathwayProgress({ ...path, courseIds: ["missing", "a", "b"] }, [a, b], progress, []).nextCourseId, "missing", "unavailable steps are not silently skipped");
const fractions = { ...store.emptyProgress(), lessonsDone: { "a/lesson1": date, "a/lesson2": date, "b/lesson1": date } };
assert.equal(pathwayProgress({ ...path, courseIds: ["a", "b"] }, [course("a", 3), course("b", 3)], fractions, []).percent, 50, "round once after equal-course aggregation, not once for each course");
assert.equal(pathwayProgress({ ...path, courseIds: ["a", "b"] }, [], fractions, [entry("a", ["lesson1", "lesson2", "lesson3"]), entry("b", ["lesson1", "lesson2", "lesson3"])]).percent, 50, "removed-catalog progress uses exact shares before rounding too");
const fiftyEight = { ...store.emptyProgress(), lessonsDone: Object.fromEntries(Array.from({ length: 58 }, (_, i) => ["a/lesson" + (i + 1), date])) };
assert.equal(pathwayProgress({ ...path, courseIds: ["a"] }, [course("a", 100)], fiftyEight, []).percent, 58, "floating-point arithmetic cannot drop an exact integer percentage");

const removedPath = { ...path, courseIds: ["a"] };
const catalog = [entry("a", ["lesson1", "lesson2"])];
const removed = pathwayProgress(removedPath, [], progress, catalog);
assert.equal(removed.percent, 100);
assert.equal(removed.nextCourseId, null);
assert.deepEqual(removed.steps[0], { courseId: "a", title: "Catalog a", available: true, enrolled: false, complete: true, percent: 100, completionBasis: "lessons" });
assert.equal(pathwayProgress(removedPath, [], { ...progress, lessonsDone: { "a/obsolete": date } }, catalog).percent, 0, "only currently allowlisted lesson IDs count");
assert.equal(pathwayProgress(removedPath, [], progress, [{ ...catalog[0], lessons: 3 }]).steps[0].percent, null, "incomplete catalog metadata cannot manufacture completion");
assert.equal(pathwayProgress(removedPath, [], progress, [{ ...catalog[0], lessonIds: undefined }]).steps[0].percent, null);
assert.equal(pathwayProgress(removedPath, [], progress, [], [course("a", 4)]).percent, 50, "known current source takes precedence over removed-course guesses");
assert.equal(pathwayProgress(removedPath, [], progress, catalog, [course("a", 4)]).percent, 50, "installed source takes precedence over a shorter catalog list");
assert.equal(pathwayProgress(removedPath, [], progress, catalog, [course("a", 0)]).steps[0].percent, null, "a current course with no checkpoints cannot reuse an unrelated old denominator");
assert.equal(pathwayProgress(removedPath, [], store.emptyProgress(), catalog, [a]).percent, 0, "shared course content never contributes another learner's activity");
assert.equal(pathwayProgress(removedPath, [], store.emptyProgress(), catalog, [a]).steps[0].enrolled, false);
const prefixOnlyExam = { ...store.emptyProgress(), attempts: [{
  id: "exam", bankId: "a__unverified", bankTitle: "Unverified", mode: "exam" as const,
  startedAt: date + "T10:00:00Z", finishedAt: date + "T10:01:00Z", durationSec: 60,
  total: 1, answered: 1, correct: 1, passingPercent: 70, byTopic: {}, bySection: {}, answers: [],
}] };
assert.equal(pathwayProgress(removedPath, [], prefixOnlyExam, catalog).completedCourses, 0, "removed-course exam ownership cannot be inferred from a bank ID prefix");

await store.updateProfileProgress("alice", current => ({ ...current, learningPathways: [path] }));
store.useStudentFiles("bob");
assert.equal((await store.loadProgress()).learningPathways, undefined);
store.useStudentFiles("alice");
assert.deepEqual((await store.loadProgress()).learningPathways, [path]);
const pending = store.updateProfileProgress("alice", current => ({ ...current, learningPathways: [{ ...path, title: "Updated pathway" }] }));
store.useStudentFiles("bob");
await pending;
assert.equal((await store.loadProfileProgress("alice")).learningPathways?.[0].title, "Updated pathway");
assert.equal((await store.loadProgress()).learningPathways, undefined, "an in-flight profile write keeps its original scope");
const beforeInvalid = [...state]; writes.length = 0;
await assert.rejects(store.saveProgress({ ...store.emptyProgress(), learningPathways: [{ ...path, courseIds: ["a", "a"] }] }), /Invalid learning pathways/);
assert.deepEqual([...state], beforeInvalid); assert.deepEqual(writes, []);
state.set("progress-bob", JSON.stringify({ ...store.emptyProgress(), learningPathways: null }));
await assert.rejects(store.loadProgress(), /Invalid learning pathways/);
state.delete("progress-bob");

const archivedProgress = { ...store.emptyProgress(), learningPathways: [path] };
assert.deepEqual(parseAnonymousProgress(archivedProgress).learningPathways, [path]);
assert.throws(() => parseAnonymousProgress({ ...archivedProgress, learningPathways: [{ ...path, forged: true }] }), /Invalid learning pathways/);
const recovery = await captureAnonymousRecovery(archivedProgress, null, {}, [a, b], [], date + "T12:00:00Z");
assert.equal(recovery.sources.length, 2, "recovery records the sources referenced by pathway choices");
assert.deepEqual(parseAnonymousRecovery(JSON.stringify(recovery)).progress.learningPathways, [path]);
assert.deepEqual(recoveryProgress(recovery, store.emptyProgress()).learningPathways, [path]);

store.useStudentFiles(null);
const staleActivity = store.emptyProgress();
await store.saveProgress(staleActivity);
await store.updateProfileProgress(null, current => ({ ...current, learningPathways: [path] }));
await store.saveProgress({ ...staleActivity, seeded: true });
assert.deepEqual((await store.loadBaseProgress()).learningPathways, [path], "an unrelated stale activity save preserves the newer pathway list");
await store.saveProgress(staleActivity, { replaceLearningPathways: true });
assert.equal((await store.loadBaseProgress()).learningPathways, undefined, "an explicit replacement can remove pathways");
await store.saveProgress({ ...staleActivity, learningPathways: [path] });
assert.equal((await store.loadBaseProgress()).learningPathways, undefined, "an unrelated stale save cannot resurrect a removed pathway");
const plain = { format: "erudior-backup", version: 1, progress: archivedProgress, courses: [], banks: [] };
await store.restoreBackup(plain, { courses: [], banks: [] });
assert.deepEqual((await store.loadBaseProgress()).learningPathways, [path]);
await store.restoreBackup({ ...plain, progress: store.emptyProgress() }, { courses: [], banks: [] });
assert.equal((await store.loadBaseProgress()).learningPathways, undefined, "plain legacy restore explicitly replaces a present pathway list with absence");
await store.restoreBackup(plain, { courses: [], banks: [] });
for (const malformed of [null, [{ ...path, courseIds: ["a", "a"] }]]) {
  const before = [...state]; writes.length = 0;
  await assert.rejects(store.restoreBackup({ ...plain, progress: { ...archivedProgress, learningPathways: malformed } }, { courses: [{ id: "never-delete" } as Course], banks: [] }), /Invalid learning pathways/);
  assert.deepEqual([...state], before); assert.deepEqual(writes, [], "invalid pathways fail before deleting any current course");
}

state.set("family", JSON.stringify({ format: "erudior-family", version: 1, students: [
  { id: "alice", name: "Learner A", grade: 7, assigned: [], freeChoice: true },
  { id: "bob", name: "Learner B", grade: 8, assigned: [], freeChoice: true },
] }));
await store.updateProfileProgress("bob", current => ({ ...current, learningPathways: [{ id: "reading", title: "My reading", courseIds: ["reading"] }] }));
const family = await collect([], []);
const encrypted = await encryptText(JSON.stringify(family), "synthetic pathway recovery passphrase");
state.delete("progress-alice"); state.delete("progress-bob");
await restoreContents(await decryptText(JSON.parse(encrypted), "synthetic pathway recovery passphrase"), { courses: [], banks: [] });
assert.equal((await store.loadProfileProgress("alice")).learningPathways?.[0].title, "Updated pathway");
assert.equal((await store.loadProfileProgress("bob")).learningPathways?.[0].title, "My reading");
assert.deepEqual((await store.loadBaseProgress()).learningPathways, [path]);
await restoreContents(JSON.stringify({ ...family, progress: store.emptyProgress() }), { courses: [], banks: [] });
assert.equal((await store.loadBaseProgress()).learningPathways, undefined, "family base restore explicitly replaces pathways even when a legacy archive omits them");
await restoreContents(JSON.stringify(family), { courses: [], banks: [] });
const malformedFamily = { ...family, students: { ...family.students, alice: { ...family.students.alice, progress: { ...family.students.alice.progress, learningPathways: [{ ...path, courseIds: [] }] } } } };
const beforeFamily = [...state]; writes.length = 0;
await assert.rejects(restoreContents(JSON.stringify(malformedFamily), { courses: [{ id: "never-delete" } as Course], banks: [] }), /Invalid learning pathways/);
assert.deepEqual([...state], beforeFamily); assert.deepEqual(writes, [], "family preflight rejects malformed learner pathways before restore writes");

console.log("Learning pathways: bounded ordered plans, real starters, equal course shares, missing/current source handling, isolated profile persistence, and plain/encrypted/anonymous recovery passed.");

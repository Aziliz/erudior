import assert from "node:assert/strict";
import { assignCourseLesson, courseLessonDeleteReason, courseModuleDeleteReason, deleteCourseItem, reorderCourseItem } from "../src/lib/courseStructureControls";
import type { Course } from "../src/lib/types";
const course: Course = {
  format: "examiner-course", version: 1, id: "course", title: "Course",
  modules: [{ id: "m1", title: "One" }, { id: "m2", title: "Two", quiz: ["q1"] }],
  lessons: [{ id: "l1", title: "Lesson", module: "m1", body: "Keep this text", topics: [] }, { id: "l2", title: "Second", module: "m1", body: "Second text", topics: [] }],
  banks: [], decks: [], glossary: [], references: [], drills: [],
};
const original = structuredClone(course);
assert.equal(reorderCourseItem(course, "modules", "m1", -1), course);
assert.equal(reorderCourseItem(course, "lessons", "missing", 1), course);
const reordered = reorderCourseItem(course, "modules", "m1", 1);
assert.deepEqual(reordered.modules.map(x => x.id), ["m2", "m1"]);
assert.equal(reordered.lessons, course.lessons);
assert.equal(reorderCourseItem(reordered, "modules", "m1", 1), reordered);
assert.deepEqual(reorderCourseItem(course, "lessons", "l1", 1).lessons.map(x => x.id), ["l2", "l1"]);
assert.equal(assignCourseLesson(course, "l1", "missing"), course);
assert.equal(assignCourseLesson(course, "missing", "m2"), course);
assert.equal(assignCourseLesson(course, "l1", "m1"), course);
const moved = assignCourseLesson(course, "l1", "m2");
assert.deepEqual(moved.lessons[0], { ...course.lessons[0], module: "m2" });
assert.equal(moved.lessons[1], course.lessons[1]);
assert.ok(courseModuleDeleteReason(course, "m1"));
assert.equal(deleteCourseItem(course, "modules", "m1", JSON.stringify(course.modules[0])), course);
const deleted = deleteCourseItem(course, "modules", "m2", JSON.stringify(course.modules[1]));
assert.deepEqual(deleted.modules.map(x => x.id), ["m1"]);
assert.equal(deleted.banks, course.banks);
assert.equal(deleteCourseItem(deleted, "modules", "m2", JSON.stringify(course.modules[1])), deleted);
assert.equal(deleteCourseItem(course, "modules", "m2", JSON.stringify({ ...course.modules[1], title: "Earlier" })), course);
assert.equal(deleteCourseItem(course, "lessons", "l1", JSON.stringify({ ...course.lessons[0], body: "Earlier" })), course);
const snapshot = JSON.stringify(course.lessons[0]);
const withoutLesson = deleteCourseItem(course, "lessons", "l1", snapshot);
assert.deepEqual(withoutLesson.lessons.map(x => x.id), ["l2"]);
assert.equal(withoutLesson.modules, course.modules);
assert.equal(withoutLesson.banks, course.banks);
assert.equal(deleteCourseItem(withoutLesson, "lessons", "l1", snapshot), withoutLesson);
for (const key of ["spreadsheetAssignments", "branchingScenarios", "scientificWorkspaces", "advancedAssessments"] as const) {
  const linked = { ...course, [key]: [{ id: "resource", lessonId: "l1" }] } as Course;
  assert.ok(courseLessonDeleteReason(linked, "l1"), key);
  assert.equal(deleteCourseItem(linked, "lessons", "l1", snapshot), linked, key);
  assert.equal(assignCourseLesson(linked, "l1", "m2")[key], linked[key], key);
}
for (const key of ["writing", "labs"] as const) {
  const linked = { ...course, [key]: [{ id: "resource", module: "m2" }] } as Course;
  assert.ok(courseModuleDeleteReason(linked, "m2"), key);
  assert.equal(deleteCourseItem(linked, "modules", "m2", JSON.stringify(course.modules[1])), linked);
}
for (const from of [undefined, "course"]) {
  const linked = { ...course, vocab: [{ id: "v1", term: "word", meanings: ["meaning"], lesson: "l1", ...(from ? { from } : {}) }] } as Course;
  assert.ok(courseLessonDeleteReason(linked, "l1"));
  assert.equal(deleteCourseItem(linked, "lessons", "l1", snapshot), linked);
}
const imported = { ...course, vocab: [{ id: "v1", from: "other-course", term: "word", meanings: ["meaning"], lesson: "l1" }] } as Course;
assert.equal(courseLessonDeleteReason(imported, "l1"), null);
assert.deepEqual(course, original, "operations do not mutate the input");
console.log("course structure control tests passed");

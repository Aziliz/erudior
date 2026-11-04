import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { validateCourseWork, normalizeValidatedCourseWork, courseWorkRevisionProblems, validateWorkLessonReferences, type CourseWork } from "../src/lib/courseWork.ts";
import { emptyCourse, exportCourseSnapshot } from "../src/lib/course.ts";
import { importValidatedCourseSnapshot, validateCourseIntegrity } from "../src/lib/courseIntegrity.ts";
import { compareCourseRevisions } from "../src/lib/courseRevision.ts";
const work: CourseWork = {
  rubrics: [{ id: "rubric1", title: "Evidence", criteria: [{ id: "clarity", name: "Clarity", levels: [{ points: 2, label: "Clear" }, { points: 0, label: "Revise" }] }] }],
  writing: [{ id: "writing1", title: "Explain", module: "m1", kind: "short", prompt: "Describe your reasoning.", words: { min: 10, max: 100 }, rubric: "rubric1", selfCheck: true }],
  labs: [{ id: "lab1", title: "Observe", module: "m1", adult: true, safety: ["Follow instructor directions."], materials: ["Paper"], steps: [{ text: "Observe", adult: true }], tables: [{ id: "table1", columns: ["Observation"], rows: 2, rowLabels: ["Before", "After"] }], questions: [{ id: "why", kind: "conclusion", prompt: "What changed?" }], rubric: "rubric1" }],
  activityLog: { title: "Practice", types: ["Observation"], weeklyMinutes: 30, weeklyDays: 2, uploads: false },
};
assert.deepEqual(validateCourseWork(work, { moduleIds: ["m1"] }), []);
const canonical = normalizeValidatedCourseWork(work, { moduleIds: ["m1"] });
assert.deepEqual(canonical, work, "canonical fields preserved exactly");
canonical.writing![0].prompt = "changed";
assert.equal(work.writing![0].prompt, "Describe your reasoning.", "canonical clone isolated");
assert.deepEqual(validateCourseWork({}), [], "absent work compatible");
const demo = JSON.parse(readFileSync("samples/demo-student-work.json", "utf8"));
assert.deepEqual(validateCourseWork(demo, { legacy: true, moduleIds: ["m1"] }), []);
const migrated = normalizeValidatedCourseWork(demo, { legacy: true, moduleIds: ["m1"] });
assert.equal(migrated.labs![0].rubric, "lab-basic");
assert.deepEqual(validateCourseWork(migrated, { moduleIds: ["m1"] }), [], "explicit legacy migration produces canonical data");
assert.ok(validateCourseWork(demo).length, "legacy shorthand not silently accepted as canonical");
const invalid = [
  { writing: {} },
  { ...work, writing: [{ ...work.writing![0], kind: { toString: "invalid" }, words: { min: { toString: "invalid" } } }] },
  { ...work, rubrics: [{ id: "r", criteria: [{ id: "c", name: "C", levels: [{ points: { toString: "invalid" }, label: "L" }] }] }] }, { rubrics: [null] }, { activityLog: [] },
  { writing: [{ ...work.writing![0], id: "bad/id" }] },
  { ...work, labs: [{ ...work.labs![0], id: "writing1" }] },
  { ...work, writing: [{ ...work.writing![0], module: "missing" }] },
  { ...work, writing: [{ ...work.writing![0], rubric: "missing" }] },
  { ...work, writing: [{ ...work.writing![0], kind: "unknown" }] },
  { ...work, writing: [{ ...work.writing![0], words: { min: 50, max: 10 } }] },
  { ...work, writing: [{ ...work.writing![0], minutes: 1.5 }] },
  { ...work, writing: [{ ...work.writing![0], unknown: "would be dropped" }] },
  { ...work, labs: [{ ...work.labs![0], adult: false }] },
  { ...work, labs: [{ ...work.labs![0], steps: [42] }] },
  { ...work, labs: [{ ...work.labs![0], safety: ["", 7] }] },
  { ...work, labs: [{ ...work.labs![0], tables: [{ id: "table1", columns: ["One"], rows: 1, rowLabels: ["one", "two"] }] }] },
  { ...work, labs: [{ ...work.labs![0], tables: [{ ...work.labs![0].tables[0], rows: 51 }] }] },
  { ...work, labs: [{ ...work.labs![0], questions: [work.labs![0].questions[0], work.labs![0].questions[0]] }] },
  { ...work, rubrics: [{ ...work.rubrics![0], criteria: [work.rubrics![0].criteria[0], work.rubrics![0].criteria[0]] }] },
  { ...work, rubrics: [{ ...work.rubrics![0], criteria: [{ ...work.rubrics![0].criteria[0], levels: [{ points: Infinity, label: "Invalid" }] }] }] },
  { ...work, activityLog: { ...work.activityLog!, weeklyDays: 8 } },
  { ...work, activityLog: { ...work.activityLog!, uploads: "yes" } },
];
for (const [i, item] of invalid.entries()) {
  assert.ok(validateCourseWork(item, { moduleIds: ["m1"] }).length, `invalid raw ${i}`);
  assert.throws(() => normalizeValidatedCourseWork(item, { moduleIds: ["m1"] }), undefined, `no silent drops ${i}`);
}
const draft = { ...work, writing: [{ ...work.writing![0], title: "", prompt: "" }] };
assert.deepEqual(validateCourseWork(draft, { strict: false, moduleIds: ["m1"] }), []);
assert.ok(validateCourseWork(draft).length, "publishing requires complete text");
assert.ok(validateCourseWork({ writing: Array(201).fill(work.writing![0]) }).length);
const cyclic: any = { writing: [] }; cyclic.writing.push(cyclic);
assert.match(validateCourseWork(cyclic).join(), /cyclic/);
assert.match(validateCourseWork(JSON.parse('{"writing":[{"__proto__":{}}]}')).join(), /unsafe/);
const course = { ...emptyCourse("Work test"), id: "work-test", revision: 1, modules: [{ id: "m1", title: "Module" }], lessons: [{ id: "l1", module: "m1", title: "Lesson", body: "```assignment\nwriting: writing1\nlab: lab1\nlog\n```" }], ...work };
assert.deepEqual(validateCourseIntegrity(course), []);
assert.deepEqual(validateWorkLessonReferences(work, course.lessons), []);
assert.ok(validateWorkLessonReferences(work, [{ id: "bad", body: "```assignment\nwriting: missing\n```" }]).length);
assert.ok(validateWorkLessonReferences(work, [{ id: "bad", body: "```assignment writing: writing1\n```" }]).length);
const imported = importValidatedCourseSnapshot(exportCourseSnapshot(course));
assert.equal(imported.writing![0].id, "writing1");
assert.deepEqual(imported.writing, course.writing, "portable installation retains all canonical task fields");
assert.deepEqual(imported.labs, course.labs);
assert.deepEqual(imported.rubrics, course.rubrics);
assert.throws(() => importValidatedCourseSnapshot(JSON.stringify({ ...course, writing: [null] })), /Invalid course work/);
assert.throws(() => importValidatedCourseSnapshot(JSON.stringify({ ...course, labs: [{ ...work.labs![0], steps: [{ text: "", secret: true }] }] })), /Invalid course work/);
const update = { ...course, revision: 2 };
assert.deepEqual(compareCourseRevisions(course, update), []);
assert.ok(compareCourseRevisions(course, { ...update, lessons: [{ ...course.lessons[0], body: "Removed assignments" }] }).some(issue => /assignment link/.test(issue.message)), "published lesson links retained");
assert.ok(compareCourseRevisions(course, { ...update, lessons: [{ ...course.lessons[0], body: "No links" }, { ...course.lessons[0], id: "l2" }] }).some(issue => /assignment link/.test(issue.message)), "moving a link to another lesson is blocked");
assert.deepEqual(compareCourseRevisions(course, { ...update, lessons: [{ ...course.lessons[0], body: course.lessons[0].body + "\nAdditional explanatory text" }] }), []);
for (const next of [
  { ...work, writing: [] }, { ...work, labs: [] }, { ...work, rubrics: [] }, { ...work, activityLog: undefined },
  { ...work, writing: [{ ...work.writing![0], rubric: undefined }] },
  { ...work, writing: [{ ...work.writing![0], kind: "essay" as const }] },
  { ...work, labs: [{ ...work.labs![0], tables: [] }] },
  { ...work, labs: [{ ...work.labs![0], questions: [] }] },
  { ...work, labs: [{ ...work.labs![0], steps: [] }] },
  { ...work, rubrics: [{ ...work.rubrics![0], criteria: [] }] },
]) {
  assert.ok(courseWorkRevisionProblems(work, next).length);
  assert.ok(compareCourseRevisions(course, { ...update, ...next }).some(issue => issue.severity === "blocking" && issue.path === "work"));
}
assert.deepEqual(courseWorkRevisionProblems(work, { ...work, writing: [{ ...work.writing![0], prompt: "Clarified prompt." }] }), [], "content revisions allowed with stable identities");
console.log("canonical work validation, legacy migration, identity and revision tests passed");

for (const reserved of ["__proto__", "constructor", "prototype"]) {
  for (const mutate of [
    (w:CourseWork)=>{w.writing![0].id=reserved;},
    (w:CourseWork)=>{w.labs![0].id=reserved;},
    (w:CourseWork)=>{w.rubrics![0].id=reserved;},
    (w:CourseWork)=>{w.rubrics![0].criteria[0].id=reserved;},
    (w:CourseWork)=>{w.labs![0].tables[0].id=reserved;},
    (w:CourseWork)=>{w.labs![0].questions[0].id=reserved;},
    (w:CourseWork)=>{w.writing![0].module=reserved;},
    (w:CourseWork)=>{w.writing![0].rubric=reserved;},
  ]) { const candidate=structuredClone(work);mutate(candidate);assert.ok(validateCourseWork(candidate).some(e=>e.includes("invalid stable ID")),`reserved ID ${reserved}`); }
}

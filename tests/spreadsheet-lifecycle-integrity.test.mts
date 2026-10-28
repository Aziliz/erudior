import assert from "node:assert/strict";
import { emptyCourse, exportCourseSnapshot, importCourseSnapshot, normalizeCourse } from "../src/lib/course.ts";
import { importValidatedCourseSnapshot, validateCourseIntegrity } from "../src/lib/courseIntegrity.ts";
import { compareCourseRevisions } from "../src/lib/courseRevision.ts";
import { canonicalAssignmentAddress, gradeAssignment, normalizeSpreadsheetAssignment, SAMPLE_ASSIGNMENT, validateAssignment } from "../src/lib/spreadsheetAssignments.ts";
import { isWorkbookCellAddress, validateWorkbook } from "../src/lib/workbookTemplates.ts";
import type { Course } from "../src/lib/types.ts";

let checks = 0;
const check = (name: string, test: () => void) => { test(); checks++; console.log("PASS", name); };
const base = emptyCourse("Spreadsheet lifecycle");
base.revision = 1;
base.lessons = [{ id: "intro", module: "m1", title: "Intro", body: "" }];
const valid = { ...structuredClone(SAMPLE_ASSIGNMENT), lessonId: "intro" };
const course = { ...base, spreadsheetAssignments: [valid] };

check("mixed-case references canonicalize without changing worksheet names", () => {
  assert.equal(canonicalAssignmentAddress(valid.starter, "BUDGET!b3"), "Budget!B3");
  assert.equal(canonicalAssignmentAddress(valid.starter, "Missing!B3"), null);
  const authored = { ...valid, protectedCells: ["budget!b1"], answers: { "BUDGET!b3": 750 } };
  assert.deepEqual(validateAssignment(authored), []);
  const normalized = normalizeSpreadsheetAssignment(authored);
  assert.deepEqual(normalized.protectedCells, ["Budget!B1"]);
  assert.deepEqual(normalized.answers, { "Budget!B3": 750 });
  assert.deepEqual(authored.protectedCells, ["budget!b1"]);
  normalized.starter.sheets.Budget.B1 = 99;
  assert.equal(authored.starter.sheets.Budget.B1, 1200);
});
check("case aliases cannot duplicate grading or protection", () => {
  assert(validateAssignment({ ...valid, answers: { "Budget!B3": 750, "budget!b3": 1 } }).some(e => e.includes("Duplicate")));
  assert(validateAssignment({ ...valid, protectedCells: ["Budget!B1", "BUDGET!b1"] }).some(e => e.includes("Duplicate")));
});
check("unknown assignment values return errors rather than crashing", () => {
  for (const value of [null, [], 7, "assignment", {}, { id: null }, { ...valid, starter: undefined },
    { ...valid, protectedCells: null }, { ...valid, protectedCells: [Object.create(null)] },
    { ...valid, answers: null }, { ...valid, answers: [] }, { ...valid, tolerance: "0" },
    { ...valid, answers: { "Budget!B3": NaN } }, { ...valid, answers: { "Budget!B3": Infinity } },
    { ...valid, answers: { "Budget!B3": false } }, { ...valid, answers: { "Budget!B3": {} } }])
    assert(validateAssignment(value).length > 0);
});
check("ambiguous or inherited worksheets cannot be imported", () => {
  assert.equal(validateWorkbook({ sheets: { Budget: {}, budget: {} } }), false);
  assert.equal(validateWorkbook({ sheets: { constructor: {} } }), false);
  assert.equal(validateWorkbook({ sheets: JSON.parse('{"__proto__":{"A1":1}}') }), false);
  assert.equal(validateWorkbook({ sheets: Object.create({ Budget: { A1: 1 } }) }), false);
  assert.equal(validateWorkbook({ sheets: { Budget: Object.create({ A1: 1 }) } }), false);
});
check("worksheet bounds reject pathological addresses but retain distant authored cells", () => {
  for (const value of ["A1", "Z99", "AA10", "XFD1048576"]) assert.equal(isWorkbookCellAddress(value), true);
  for (const value of ["XFE1", "A1048577", "A0", "a1", "AAAA1", "A99999999999999999", null]) assert.equal(isWorkbookCellAddress(value), false);
  assert.equal(validateWorkbook({ sheets: { Budget: { H20: "=1+2" } } }), true);
});
check("ordinary and validated imports reject malformed assignments without silently dropping", () => {
  const badAssignments: unknown[] = [null, {}, "bad", [null], [{ ...valid, starter: undefined }],
    [{ ...valid, protectedCells: undefined }], [{ ...valid, answers: undefined }],
    [{ ...valid, lessonId: "missing" }], [valid, valid], [{ ...valid, id: "" }]];
  for (const spreadsheetAssignments of badAssignments) {
    const raw = { ...base, spreadsheetAssignments };
    assert.throws(() => normalizeCourse(raw));
    assert.throws(() => importCourseSnapshot(JSON.stringify(raw)));
    assert.throws(() => importValidatedCourseSnapshot(JSON.stringify(raw)));
  }
});
check("direct course integrity reports malformed assignment shapes", () => {
  for (const spreadsheetAssignments of [null, {}, [null], [{ ...valid, starter: null }]]) {
    assert(validateCourseIntegrity({ ...base, spreadsheetAssignments } as unknown as Course).length > 0);
  }
});
check("canonical portable assignment round-trip is deterministic and retains rubric", () => {
  const before = JSON.stringify(course);
  const first = importValidatedCourseSnapshot(exportCourseSnapshot(course));
  const second = importValidatedCourseSnapshot(exportCourseSnapshot(first));
  assert.equal(exportCourseSnapshot(first), exportCourseSnapshot(second));
  assert.deepEqual(first.spreadsheetAssignments, [valid]);
  assert.equal(JSON.stringify(course), before);
});
check("published assignment identity cannot be removed or renamed", () => {
  const removed = compareCourseRevisions(course, { ...course, revision: 2, spreadsheetAssignments: [] });
  assert(removed.some(i => i.path === `spreadsheetAssignments.${valid.id}` && i.severity === "blocking"));
  const renamed = compareCourseRevisions(course, { ...course, revision: 2, spreadsheetAssignments: [{ ...valid, id: "new-id" }] });
  assert(renamed.some(i => i.severity === "blocking"));
});
check("assignment lesson moves require review and dangling lesson updates block", () => {
  const moved = compareCourseRevisions(course, { ...course, revision: 2,
    lessons: [...course.lessons, { ...course.lessons[0], id: "next" }], spreadsheetAssignments: [{ ...valid, lessonId: "next" }] });
  assert(moved.some(i => i.path === `spreadsheetAssignments.${valid.id}` && i.severity === "warning"));
  const bad = compareCourseRevisions(course, { ...course, revision: 2, spreadsheetAssignments: [{ ...valid, lessonId: "missing" }] });
  assert(bad.some(i => i.path === "spreadsheetAssignments[0].lessonId" && i.severity === "blocking"));
});
check("case aliases grade consistently and cannot evade protected checks", () => {
  const assignment = { ...valid, answers: { "BUDGET!b3": 750 }, protectedCells: ["BUDGET!b1"] };
  const learner = structuredClone(valid.starter); learner.sheets.Budget.B3 = "=B1-B2";
  assert.equal(gradeAssignment(assignment, learner).score, 1);
  learner.sheets.Budget.B1 = 1300; learner.sheets.Budget.B3 = 750;
  assert.equal(gradeAssignment(assignment, learner).score, 0);
  assert.deepEqual(gradeAssignment(assignment, learner).protectedChanges, ["Budget!B1"]);
});
check("new assignment IDs remain allowed and ordinary courses are unchanged", () => {
  assert.deepEqual(compareCourseRevisions(base, { ...course, revision: 2 }), []);
  assert.deepEqual(validateCourseIntegrity(base), []);
  assert.equal(importValidatedCourseSnapshot(exportCourseSnapshot(base)).spreadsheetAssignments, undefined);
});
console.log(`spreadsheet lifecycle integrity: ${checks} groups passed`);

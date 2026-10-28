import assert from "node:assert/strict";
import { SAMPLE_ASSIGNMENT } from "../src/lib/spreadsheetAssignments.ts";
import { appendSpreadsheetSubmission, createSpreadsheetSubmission, mergeSpreadsheetSubmissions, spreadsheetSubmissionsForCourses, submissionMatchesAssignment, validateSpreadsheetSubmission, SPREADSHEET_EVIDENCE_LIMITS, type SpreadsheetSubmissionMap } from "../src/lib/spreadsheetEvidence.ts";
let checks = 0;
const check = (name: string, test: () => void) => { test(); checks++; console.log("PASS", name); };
const input = () => ({ id: "attempt-1", submittedAt: 1700000000000, courseId: "course-1", lessonId: "lesson-1", assignment: structuredClone(SAMPLE_ASSIGNMENT), workbook: { sheets: { Budget: { ...SAMPLE_ASSIGNMENT.starter.sheets.Budget, B3: "=B1-B2" } } } });
check("exact immutable snapshots grade reproducibly without caller mutation", () => {
 const source = input(); const entry = createSpreadsheetSubmission(source);
 assert.equal(entry.grade.score, 1); assert.deepEqual(validateSpreadsheetSubmission(entry), []);
 assert.deepEqual(entry.assignment, source.assignment); assert.deepEqual(entry.workbook, source.workbook);
 source.workbook.sheets.Budget.B3 = "=1"; source.assignment.title = "changed";
 assert.equal(entry.workbook.sheets.Budget.B3, "=B1-B2"); assert.equal(entry.assignment.title, SAMPLE_ASSIGNMENT.title);
 assert(Object.isFrozen(entry)); assert(Object.isFrozen(entry.assignment.starter.sheets.Budget));
 assert.deepEqual(createSpreadsheetSubmission(input()), entry);
});
check("formula failures and protected changes retain faithful failed grades", () => {
 const source = input(); source.workbook.sheets.Budget.B3 = "=1/0";
 const failed = createSpreadsheetSubmission(source); assert.equal(failed.grade.score, 0); assert.equal(failed.grade.feedback[0].actual, null);
 source.workbook.sheets.Budget.B3 = "=B1-B2"; source.workbook.sheets.Budget.B1 = 1300;
 const changed = createSpreadsheetSubmission(source); assert.equal(changed.grade.score, 0); assert.deepEqual(changed.grade.protectedChanges, ["Budget!B1"]);
});
check("tampered grades, metadata, malformed snapshots and lossy JSON are rejected", () => {
 const entry = createSpreadsheetSubmission(input());
 for (const bad of [null, [], {...entry, id: "__proto__"}, {...entry, assignmentId: "other"}, {...entry, submittedAt: -1}, {...entry, submittedAt: Infinity}, {...entry, lessonId: ""}, {...entry, grade: {...entry.grade, score: 0}}, {...entry, workbook: null}, {...entry, assignment: {...entry.assignment, lessonId: "other"}}, {...entry, ignored: undefined}, {...entry, ignored: BigInt(1)}]) assert(validateSpreadsheetSubmission(bad).length);
 const cyclic: any = {...entry}; cyclic.self = cyclic; assert(validateSpreadsheetSubmission(cyclic).length);
 assert.throws(() => createSpreadsheetSubmission({...input(), submittedAt: NaN}));
});
check("append and merge are immutable, idempotent and reject conflicting IDs", () => {
 const a = createSpreadsheetSubmission(input()); const b = createSpreadsheetSubmission({...input(), id: "attempt-2"});
 const one = appendSpreadsheetSubmission({}, a); const two = appendSpreadsheetSubmission(one, b);
 assert.equal(Object.keys(one).length, 1); assert.equal(Object.keys(two).length, 2);
 assert.deepEqual(mergeSpreadsheetSubmissions(two, one), two);
 assert.deepEqual(appendSpreadsheetSubmission(two, a), two);
 assert.throws(() => appendSpreadsheetSubmission(one, createSpreadsheetSubmission({...input(), submittedAt: 1700000000001})), /Conflicting/);
 assert.throws(() => mergeSpreadsheetSubmissions({}, {wrong: a}), /key/);
});
check("course filtering uses exact assigned IDs and never changes source history", () => {
 const a = createSpreadsheetSubmission(input()); const b = createSpreadsheetSubmission({...input(), id: "attempt-2", courseId: "course-10"});
 const ledger = mergeSpreadsheetSubmissions({[a.id]: a}, {[b.id]: b});
 assert.deepEqual(Object.keys(spreadsheetSubmissionsForCourses(ledger, ["course-1"])), [a.id]);
 assert.deepEqual(spreadsheetSubmissionsForCourses(ledger, []), {}); assert.equal(Object.keys(ledger).length, 2);
});
check("current rubric comparison detects changes without rewriting old evidence", () => {
 const entry = createSpreadsheetSubmission(input()); assert(submissionMatchesAssignment(entry, SAMPLE_ASSIGNMENT));
 assert(!submissionMatchesAssignment(entry, {...SAMPLE_ASSIGNMENT, answers: {"Budget!B3": 5}}));
 assert.equal(entry.grade.score, 1);
});
check("individual bytes, aggregate bytes and count limits fail without pruning", () => {
 assert.throws(() => createSpreadsheetSubmission({...input(), assignment: {...SAMPLE_ASSIGNMENT, title: "x".repeat(SPREADSHEET_EVIDENCE_LIMITS.submissionBytes)}}), /byte/);
 const ledger: SpreadsheetSubmissionMap = {};
 for (let i=0;i<SPREADSHEET_EVIDENCE_LIMITS.count;i++) { const entry=createSpreadsheetSubmission({...input(), id: `a${i}`}); ledger[entry.id]=entry; }
 assert.throws(() => appendSpreadsheetSubmission(ledger, createSpreadsheetSubmission({...input(), id: "overflow"})), /count/); assert.equal(Object.keys(ledger).length, SPREADSHEET_EVIDENCE_LIMITS.count);
 const large: SpreadsheetSubmissionMap = {};
 for(let i=0;i<12;i++) { const entry=createSpreadsheetSubmission({...input(), id:`big${i}`, assignment: {...SAMPLE_ASSIGNMENT, title:"é".repeat(100000)}}); large[entry.id]=entry; }
 assert.throws(() => mergeSpreadsheetSubmissions({}, large), /byte/);
});
console.log(`${checks} spreadsheet evidence test groups passed`);

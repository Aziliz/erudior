import assert from "node:assert/strict";
import {
  beginSpreadsheetGrade, confirmSpreadsheetGrade, spreadsheetGradeUnconfirmed,
  learnerWorkbookProblems, restoreSpreadsheetDraft, serializeSpreadsheetDraft, spreadsheetCellPosition,
  spreadsheetColumnName, spreadsheetDraftKey, spreadsheetSnapshot, spreadsheetViewport,
} from "../src/lib/spreadsheetLearnerState.ts";
import { SAMPLE_ASSIGNMENT } from "../src/lib/spreadsheetAssignments.ts";

const failedSubmission = beginSpreadsheetGrade("learner-a");
const newerSubmission = beginSpreadsheetGrade("learner-a");
assert.equal(spreadsheetGradeUnconfirmed("learner-b", failedSubmission), false);
confirmSpreadsheetGrade("learner-b", failedSubmission);
assert.equal(spreadsheetGradeUnconfirmed("learner-a", failedSubmission), true);
confirmSpreadsheetGrade("learner-a", newerSubmission);
assert.equal(spreadsheetGradeUnconfirmed("learner-a", failedSubmission), true, "confirming newer write cannot confirm an older failure");
assert.equal(spreadsheetGradeUnconfirmed("learner-a", newerSubmission), false);
confirmSpreadsheetGrade("learner-a", failedSubmission);
const assignment = structuredClone(SAMPLE_ASSIGNMENT);
const edited = structuredClone(assignment.starter);
edited.sheets.Budget.B3 = "=B1-B2";
assert.notEqual(spreadsheetDraftKey("child-a", "course", assignment.id), spreadsheetDraftKey("child-b", "course", assignment.id));
assert.notEqual(spreadsheetDraftKey("guest", "course", assignment.id), spreadsheetDraftKey(null, "course", assignment.id));
assert.notEqual(spreadsheetDraftKey("a/b", "c", "d"), spreadsheetDraftKey("a", "b/c", "d"));
assert.equal(spreadsheetSnapshot({ b: 2, a: 1 }), spreadsheetSnapshot({ a: 1, b: 2 }));
const serialized = serializeSpreadsheetDraft(assignment, edited);
assert.deepEqual(restoreSpreadsheetDraft(serialized, assignment).workbook, edited);
assert.deepEqual(restoreSpreadsheetDraft(null, assignment).workbook, assignment.starter);
assert.deepEqual(restoreSpreadsheetDraft(JSON.stringify(edited), assignment).workbook, assignment.starter, "legacy envelopes never reused");
assert.deepEqual(restoreSpreadsheetDraft("broken", assignment).workbook, assignment.starter);
const changed = { ...assignment, answers: { "Budget!B3": 900 } };
assert.deepEqual(restoreSpreadsheetDraft(serialized, changed).workbook, assignment.starter, "different rubric invalidates draft");
assert.match(restoreSpreadsheetDraft(serialized, changed).message, /changed/);
const tampered = structuredClone(edited); tampered.sheets.Budget.B1 = 999999;
assert.throws(() => serializeSpreadsheetDraft(assignment, tampered), /Protected/);
const corruptEnvelope = JSON.parse(serialized); corruptEnvelope.workbook = tampered;
assert.deepEqual(restoreSpreadsheetDraft(JSON.stringify(corruptEnvelope), assignment).workbook, assignment.starter);
assert(learnerWorkbookProblems(assignment, { sheets: { Other: {} } }).length > 0);
assert(learnerWorkbookProblems(assignment, { sheets: { ...edited.sheets, Other: {} } }).length > 0);
assert(learnerWorkbookProblems(assignment, { sheets: null }).length > 0);
assert.equal(learnerWorkbookProblems(assignment, edited).length, 0);
assert.deepEqual(spreadsheetCellPosition("aa12"), { row: 12, column: 27 });
assert.deepEqual(spreadsheetCellPosition("XFD1048576"), { row: 1048576, column: 16384 });
for (const bad of ["XFE1", "A1048577", "A0", "AAAA1", "A1;alert(1)", "", "A99999999999999999999"])
  assert.equal(spreadsheetCellPosition(bad), null, bad);
assert.equal(spreadsheetColumnName(27), "AA");
assert.equal(spreadsheetColumnName(16384), "XFD");
assert.throws(() => spreadsheetColumnName(16385));
const edge = spreadsheetViewport(1048576, 16384);
assert.deepEqual(edge.rows, [1048576]); assert.deepEqual(edge.columns, ["XFD"]);
assert.equal(edge.hasNextRows, false); assert.equal(edge.hasNextColumns, false);
for (const [row, column] of [[1, 1], [12, 27], [Number.MAX_VALUE, Number.MAX_VALUE], [NaN, NaN], [-1, -1]]) {
  const view = spreadsheetViewport(row, column);
  assert(view.rows.length <= 10 && view.columns.length <= 6);
  assert(view.row >= 1 && view.row <= 1048576 && view.column >= 1 && view.column <= 16384);
}
const restored = restoreSpreadsheetDraft(serialized, assignment); restored.workbook.sheets.Budget.B3 = 1;
assert.equal(edited.sheets.Budget.B3, "=B1-B2", "restored workbook is independent");
console.log("spreadsheet learner state: isolation, exact snapshot, protected integrity, recovery and bounded viewport checks passed");

// Exercise interrupted/repeated learner flows using the actual React component.
const { JSDOM } = await import("jsdom");
const dom = new JSDOM("<!doctype html><html><body><div id=root></div></body></html>", { url: "https://example.test", pretendToBeVisual: true });
const g = globalThis as Record<string, unknown>;
g.window = dom.window; g.document = dom.window.document; g.HTMLElement = dom.window.HTMLElement;
g.localStorage = dom.window.localStorage; g.IS_REACT_ACT_ENVIRONMENT = true;
const React = await import("react");
const { createRoot } = await import("react-dom/client");
const { default: SpreadsheetCourseAssignment } = await import("../src/components/SpreadsheetCourseAssignment.tsx");
const { useStudentFiles } = await import("../src/lib/storage.ts");
const { act } = React;
const doc = dom.window.document;
const root = createRoot(doc.getElementById("root")!);
const authored = { ...assignment, lessonId: "lesson-1", answers: { "Budget!AA12": 750 } };
let updates = 0;
let finishGrade: (() => void) | undefined;
let progress: Record<string, unknown> = {};
const api = {
  student: { id: "child-a" }, progress,
  updateProgress: async (fn: (p: object) => object) => {
    updates++;
    progress = fn(progress) as Record<string, unknown>;
    await new Promise<void>(resolve => { finishGrade = resolve; });
  },
};
const show = async (studentId = "child-a", activeAssignment = authored) => {
  useStudentFiles(studentId);
  api.student = { id: studentId }; api.progress = progress;
  await act(async () => root.render(React.createElement(SpreadsheetCourseAssignment, { api: api as never, courseId: "course", assignment: activeAssignment })));
};
const input = (label: string) => {
  const element = [...doc.querySelectorAll("label")].find(x => x.textContent === label);
  assert(element, "missing label " + label);
  return doc.getElementById(element.getAttribute("for")!) as HTMLInputElement;
};
const type = async (element: HTMLInputElement, value: string) => {
  await act(async () => {
    Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype, "value")!.set!.call(element, value);
    element.dispatchEvent(new dom.window.Event("input", { bubbles: true }));
  });
};
const press = async (label: string) => {
  const button = [...doc.querySelectorAll("button")].find(x => x.textContent === label);
  assert(button, "missing button " + label);
  await act(async () => button.click());
};
await show();
assert.equal(doc.querySelectorAll("tbody input").length, 60);
assert.equal(input("Budget!B1 (protected)").readOnly, true);
await type(input("Go to cell"), "AA12"); await press("Go");
assert.equal(input("Budget!AA12").value, "");
await type(input("Budget!AA12"), "=B1-B2");
assert.match(doc.body.textContent ?? "", /Result: 750/);
await show("child-b");
await type(input("Go to cell"), "AA12"); await press("Go");
assert.equal(input("Budget!AA12").value, "", "second learner starts independently");
await show("child-a");
await type(input("Go to cell"), "AA12"); await press("Go");
assert.equal(input("Budget!AA12").value, "=B1-B2", "first learner resumes their own draft");
useStudentFiles("child-b");
await press("Grade assignment");
assert.equal(updates, 0, "switching storage cannot receive previous learner's grade");
assert.match(doc.body.textContent ?? "", /active learner is changing/);
useStudentFiles("child-a");
const gradeButton = [...doc.querySelectorAll("button")].find(x => x.textContent === "Grade assignment")!;
await act(async () => { gradeButton.click(); gradeButton.click(); });
assert.equal(updates, 1, "duplicate clicks produce one update");
await act(async () => { finishGrade?.(); });
assert.match(doc.body.textContent ?? "", /100% correct/);
await show("child-a", { ...authored, answers: { "Budget!AA12": 999 } });
await type(input("Go to cell"), "AA12"); await press("Go");
assert.equal(input("Budget!AA12").value, "", "changed content never resumes stale draft");
assert.match(doc.body.textContent ?? "", /older or unverified assignment version/);
await type(input("Go to cell"), "XFD1048576"); await press("Go");
assert.equal(doc.querySelectorAll("tbody input").length, 1, "edge address never creates an enormous DOM");
await type(input("Go to cell"), "AA12"); await press("Go");
await type(input("Budget!AA12"), "10");
dom.window.confirm = () => false;
await press("Reset workbook");
assert.equal(input("Budget!AA12").value, "10", "cancel leaves edits untouched");
dom.window.confirm = () => true;
await press("Reset workbook");
await type(input("Go to cell"), "AA12"); await press("Go");
assert.equal(input("Budget!AA12").value, "", "confirmed reset returns to starter");
const originalSetItem = dom.window.Storage.prototype.setItem;
dom.window.Storage.prototype.setItem = () => { throw Error("storage full"); };
await type(input("Budget!AA12"), "12");
assert.equal(input("Budget!AA12").value, "12", "failed storage never discards visible edits");
assert.match(doc.body.textContent ?? "", /Could not save this draft/);
dom.window.Storage.prototype.setItem = originalSetItem;
await press("Retry save");
assert.match(doc.body.textContent ?? "", /Saved locally for this learner/);
api.updateProgress = async fn => { progress = fn(progress) as Record<string, unknown>; api.progress = progress; throw Error("disk unavailable"); };
await press("Grade assignment");
await show("child-a", { ...authored, answers: { "Budget!AA12": 999 } });
assert.match(doc.body.textContent ?? "", /Could not save the grade/);
assert(!doc.body.textContent?.includes("Saved grade:"), "optimistic failed progress never appears as saved");
assert.equal([...doc.querySelectorAll("button")].find(x => x.textContent === "Grade assignment")?.disabled, false, "failed grading can retry");
// Fully unmount the learner component, then reopen it with optimistic shared progress.
await act(async () => root.render(null));
await show("child-a", { ...authored, answers: { "Budget!AA12": 999 } });
assert(!doc.body.textContent?.includes("Saved grade:"), "failed optimistic grade remains unconfirmed after remount");
assert.match(doc.body.textContent ?? "", /has not been confirmed saved/);
// A later confirmed submission has its own identity and is not hidden by the failed one.
api.updateProgress = async fn => { progress = fn(progress) as Record<string, unknown>; api.progress = progress; };
await press("Grade assignment");
await show("child-a", { ...authored, answers: { "Budget!AA12": 999 } });
assert.match(doc.body.textContent ?? "", /Saved grade:/);
assert(!doc.body.textContent?.includes("has not been confirmed saved"));

await act(async () => root.unmount());
useStudentFiles(null);
dom.window.close();
console.log("spreadsheet learner UI: paging, protected inputs, student switch, version switch, duplicate grading, reset and failure recovery passed");

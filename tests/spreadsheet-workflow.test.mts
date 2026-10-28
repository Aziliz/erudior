import assert from "node:assert/strict";
import { emptyCourse, exportCourseSnapshot } from "../src/lib/course.ts";
import { importValidatedCourseSnapshot } from "../src/lib/courseIntegrity.ts";
import { attachSpreadsheetAssignment, replaceSpreadsheetAssignment, removeSpreadsheetAssignment } from "../src/lib/spreadsheetCoursePackage.ts";
import { gradeAssignment, type SpreadsheetAssignment } from "../src/lib/spreadsheetAssignments.ts";
import { compareCourseRevisions } from "../src/lib/courseRevision.ts";
import { restoreSpreadsheetDraft, serializeSpreadsheetDraft, spreadsheetDraftKey } from "../src/lib/spreadsheetLearnerState.ts";
import { spreadsheetReviewReport } from "../src/lib/spreadsheetReview.ts";
import { validateSpreadsheetReleaseApproval } from "../src/lib/spreadsheetReleaseApproval.ts";
import { sha256Hex } from "../src/lib/courseSign.ts";

// A complete reusable author -> save/reopen -> learner -> review -> portable release flow.
const course = emptyCourse("State-neutral spreadsheet workshop");
course.lessons = [{ id: "budget-lesson", module: course.modules[0].id, title: "Budget", body: "Practice a budget." }];
const assignment: SpreadsheetAssignment = {
  id: "budget-work", title: "Calculate remaining funds",
  starter: { sheets: { Budget: { B1: 1200, B2: 450, G12: "" }, Summary: { A1: "=Budget!G12" } } },
  protectedCells: ["budget!b1", "BUDGET!b2", "summary!a1"],
  answers: { "budget!g12": 750, "SUMMARY!a1": 750 }, tolerance: 0,
};
const authored = attachSpreadsheetAssignment(course, "budget-lesson", assignment);
const reopened = importValidatedCourseSnapshot(exportCourseSnapshot(authored));
const exercise = reopened.spreadsheetAssignments![0];
assert.deepEqual(Object.keys(exercise.answers), ["Budget!G12", "Summary!A1"]);
assert.equal(exercise.lessonId, "budget-lesson");
const workbook = structuredClone(exercise.starter);
workbook.sheets.Budget.G12 = "=B1-B2";
const serialized = serializeSpreadsheetDraft(exercise, workbook);
const restored = restoreSpreadsheetDraft(serialized, exercise).workbook;
assert.equal(gradeAssignment(exercise, restored).score, 1);
assert.notEqual(spreadsheetDraftKey("child-one", course.id, exercise.id), spreadsheetDraftKey("child-two", course.id, exercise.id));
assert.equal(spreadsheetReviewReport(reopened).readyForHumanReview, true);
const snapshot = exportCourseSnapshot(reopened);
const approval = { courseId: reopened.id, revision: reopened.revision ?? 1,
  snapshotSha256: await sha256Hex(new TextEncoder().encode(snapshot)), reviewer: "Test reviewer", reviewedAt: "2026-10-28T00:00:00Z" };
assert.deepEqual(await validateSpreadsheetReleaseApproval(reopened, approval), []);
assert((await validateSpreadsheetReleaseApproval(reopened, undefined)).length > 0, "human review remains mandatory");
assert.equal(exportCourseSnapshot(importValidatedCourseSnapshot(snapshot)), snapshot, "portable review snapshot remains exact");
const revised = replaceSpreadsheetAssignment(reopened, "budget-lesson", { ...exercise, title: "Revised budget exercise" });
assert.equal(revised.spreadsheetAssignments![0].id, exercise.id);
assert((await validateSpreadsheetReleaseApproval(revised, approval)).length > 0, "edits invalidate review");
assert.notEqual(restoreSpreadsheetDraft(serialized, revised.spreadsheetAssignments![0]).workbook.sheets.Budget.G12, "=B1-B2", "edited assignment cannot silently reuse prior work");
const removed = { ...removeSpreadsheetAssignment(reopened, exercise.id), revision: (reopened.revision ?? 1) + 1 };
assert(compareCourseRevisions(reopened, removed).some(issue => issue.severity === "blocking" && issue.path.includes(exercise.id)), "issued assignment identity is protected");
assert.equal(course.spreadsheetAssignments?.length ?? 0, 0, "authoring never mutates the source course");
console.log("spreadsheet complete workflow: author, reopen, learner, review and portable release checks passed");

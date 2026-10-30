import assert from "node:assert/strict";
import { checkDoc, type CommunityDoc } from "../src/lib/communityFormat.ts";
import { normalizeCourse, exportCourseSnapshot } from "../src/lib/course.ts";
import { importValidatedCourseSnapshot } from "../src/lib/courseIntegrity.ts";
import { gradeAssignment } from "../src/lib/spreadsheetAssignments.ts";
import { spreadsheetSnapshot } from "../src/lib/spreadsheetLearnerState.ts";
import { ApiError, downloadCommunityCourse } from "../src/lib/community.ts";

const assignment = {
  id: "budget-assignment", lessonId: "budget-lesson", title: "Forecast a budget balance",
  starter: { sheets: {
    Budget: { A1: "Income", B1: 1200, A2: "Expenses", B2: 450, AA12: "" },
    Forecast: { A1: "Next balance", B1: "=Budget!B1-Budget!B2" },
  } },
  protectedCells: ["Budget!A1", "Budget!B1", "Budget!A2", "Budget!B2", "Forecast!B1"],
  answers: { "Budget!AA12": 750, "Forecast!B1": 750 }, tolerance: 0.01,
};
const doc = {
  format: "erudior-community", version: 1, title: "Budget forecasting", description: "Practice reusable spreadsheet formulas.",
  subject: "Math", level: "High School", type: "Course",
  modules: [{ id: "budget-module", title: "Budget formulas" }],
  lessons: [{ id: "budget-lesson", module: "budget-module", title: "Forecast a balance", blocks: [
    { type: "text", md: "Calculate the remaining balance in Budget!AA12." },
  ] }], decks: [], spreadsheetAssignments: [assignment],
} as unknown as CommunityDoc;

let responseDoc: unknown = doc;
const requests: { url: string; credentials?: RequestCredentials }[] = [];
const originalFetch = globalThis.fetch;
const originalReader = globalThis.FileReader;
class EmbeddedImageReader {
  result: string | ArrayBuffer | null = null;
  error: Error | null = null;
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  readAsDataURL(blob: Blob) {
    blob.arrayBuffer().then(bytes => {
      this.result = `data:${blob.type};base64,${Buffer.from(bytes).toString("base64")}`;
      this.onload?.();
    }).catch(error => { this.error = error; this.onerror?.(); });
  }
}
globalThis.FileReader = EmbeddedImageReader as unknown as typeof FileReader;
globalThis.fetch = async (input, init) => {
  const url = String(input); requests.push({ url, credentials: init?.credentials });
  if (url.endsWith("/courses/community-budget")) return Response.json({
    id: "community-budget", version: 7, review: "not_reviewed", author: "Example Author", doc: responseDoc,
  });
  if (url.endsWith("/images/example-image")) return new Response(new Uint8Array([1, 2, 3]), { headers: { "Content-Type": "image/png" } });
  throw Error("Unexpected network request: " + url);
};

try {
  assert.deepEqual(checkDoc(doc, true), []);
  const before = JSON.stringify(doc);
  const installed = normalizeCourse(await downloadCommunityCourse("community-budget"));
  assert.equal(installed.id, "community-community-budget");
  assert.equal(installed.revision, 7);
  assert.equal(installed.author, "Example Author");
  assert.deepEqual(installed.community, { id: "community-budget", version: 7, review: "not_reviewed", author: "Example Author" });
  assert.equal(requests.length, 1);
  assert.equal(requests[0].credentials, "omit", "public installation never adds sign-in requirements");
  assert.equal(JSON.stringify(doc), before, "download/conversion never mutates published input");
  assert.equal(spreadsheetSnapshot(installed.spreadsheetAssignments), spreadsheetSnapshot([assignment]));
  const learner = structuredClone(assignment.starter); learner.sheets.Budget.AA12 = "=B1-B2";
  const expectedGrade = gradeAssignment(assignment, learner);
  assert.equal(expectedGrade.score, 1);
  assert.deepEqual(gradeAssignment(installed.spreadsheetAssignments![0], learner), expectedGrade);
  const imported = importValidatedCourseSnapshot(exportCourseSnapshot(installed));
  assert.equal(spreadsheetSnapshot(imported.spreadsheetAssignments), spreadsheetSnapshot([assignment]));
  assert.deepEqual(gradeAssignment(imported.spreadsheetAssignments![0], learner), expectedGrade);
  const tampered = structuredClone(learner); tampered.sheets.Budget.B1 = 9000;
  assert.equal(gradeAssignment(imported.spreadsheetAssignments![0], tampered).score, 0);
  assert.equal(imported.spreadsheetAssignments![0].tolerance, 0.01);

  // Real image embedding still happens for valid documents after validation.
  const withImage = structuredClone(doc);
  withImage.lessons[0].blocks.push({ type: "image", imageId: "example-image", alt: "Budget illustration", caption: "Example" });
  responseDoc = withImage; requests.length = 0;
  const embedded = normalizeCourse(await downloadCommunityCourse("community-budget"));
  assert.equal(requests.length, 2);
  assert.match(embedded.lessons[0].body, /data:image\/png;base64,AQID/);
  assert.deepEqual(embedded.spreadsheetAssignments, imported.spreadsheetAssignments);

  // Reject malformed assignment payloads before even attempting image retrieval.
  for (const broken of [
    null,
    { ...assignment, starter: undefined },
    { ...assignment, lessonId: "missing-lesson" },
    { ...assignment, answers: { "Budget!AA12": null } },
    { ...assignment, protectedCells: ["Missing!A1"] },
    { ...assignment, starter: { sheets: { Budget: {}, BUDGET: {} } } },
  ]) {
    responseDoc = { ...withImage, spreadsheetAssignments: [broken] }; requests.length = 0;
    await assert.rejects(downloadCommunityCourse("community-budget"), error => error instanceof ApiError && error.status === 422);
    assert.equal(requests.length, 1, "invalid assignment cannot trigger image downloads");
  }
  responseDoc = { ...withImage, spreadsheetAssignments: [assignment, assignment] }; requests.length = 0;
  await assert.rejects(downloadCommunityCourse("community-budget"), error => error instanceof ApiError && error.status === 422);
  assert.equal(requests.length, 1);
  responseDoc = { ...withImage, spreadsheetAssignments: {} }; requests.length = 0;
  await assert.rejects(downloadCommunityCourse("community-budget"), error => error instanceof ApiError && error.status === 422);
  assert.equal(requests.length, 1);

  // Existing courses without assignments and historical valid labels remain installable.
  const ordinary = structuredClone(doc) as CommunityDoc & { spreadsheetAssignments?: unknown };
  delete ordinary.spreadsheetAssignments;
  responseDoc = { ...ordinary, level: "High school", type: undefined }; requests.length = 0;
  const oldCourse = normalizeCourse(await downloadCommunityCourse("community-budget"));
  assert.equal(oldCourse.lessons.length, 1);
  assert.equal(oldCourse.spreadsheetAssignments, undefined);
  assert.equal(oldCourse.community?.review, "not_reviewed");
  responseDoc = null; requests.length = 0;
  await assert.rejects(downloadCommunityCourse("community-budget"), error => error instanceof ApiError && error.status === 422);
  assert.equal(requests.length, 1);
  console.log("community spreadsheet install: canonical preservation, grading parity, image preflight, metadata and legacy compatibility passed");
} finally {
  globalThis.fetch = originalFetch;
  globalThis.FileReader = originalReader;
}

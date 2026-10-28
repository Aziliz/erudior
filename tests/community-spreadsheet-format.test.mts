import assert from "node:assert/strict";
import { checkDoc, checkCommunitySpreadsheetAssignments, emptyDoc, LIMITS, toCourse, upgradeDoc, type CommunityDoc } from "../src/lib/communityFormat.ts";
import { exportCourseSnapshot } from "../src/lib/course.ts";
import { importValidatedCourseSnapshot } from "../src/lib/courseIntegrity.ts";
import { gradeAssignment, SAMPLE_ASSIGNMENT } from "../src/lib/spreadsheetAssignments.ts";

let passed = 0;
const test = (title: string, run: () => void) => { run(); passed++; console.log("PASS", title); };
const meta = { id: "spreadsheet-community", version: 1, review: "not_reviewed" as const, author: "Instructor" };
const assignment = { ...structuredClone(SAMPLE_ASSIGNMENT), lessonId: "l1" };
const doc: CommunityDoc = {
  ...emptyDoc("Reusable spreadsheet lesson"), description: "Practice safe arithmetic and compare two worksheets.",
  lessons: [{ id: "l1", title: "Budget practice", blocks: [{ type: "text", md: "Calculate the remaining balance." }] }],
  spreadsheetAssignments: [assignment],
};
const convert = (value: CommunityDoc) => toCourse(value, meta, () => "");

test("canonical spreadsheet community draft and publication validate", () => {
  assert.deepEqual(checkDoc(doc, false), []);
  assert.deepEqual(checkDoc(doc, true), []);
});
test("older label upgrades preserve all assignment fields without mutation", () => {
  const legacy = { ...doc, level: "Adult", type: undefined };
  const before = JSON.stringify(legacy);
  const upgraded = upgradeDoc(legacy);
  assert.equal(upgraded.level, "Professional");
  assert.deepEqual(upgraded.spreadsheetAssignments, doc.spreadsheetAssignments);
  assert.equal(JSON.stringify(legacy), before);
});
test("installed course retains IDs, criteria, protection and lesson links", () => {
  const before = JSON.stringify(doc);
  const installed = importValidatedCourseSnapshot(JSON.stringify(convert(doc)));
  assert.deepEqual(installed.spreadsheetAssignments, doc.spreadsheetAssignments);
  assert.equal(installed.community?.review, "not_reviewed");
  assert.equal(installed.revision, meta.version);
  const learner = structuredClone(assignment.starter);
  learner.sheets.Budget.B3 = "=B1-B2";
  assert.equal(gradeAssignment(installed.spreadsheetAssignments![0], learner).score, 1);
  learner.sheets.Budget.B1 = 0;
  assert.equal(gradeAssignment(installed.spreadsheetAssignments![0], learner).score, 0);
  const restored = importValidatedCourseSnapshot(exportCourseSnapshot(installed));
  assert.equal(exportCourseSnapshot(restored), exportCourseSnapshot(installed));
  assert.equal(JSON.stringify(doc), before);
});
test("conversion canonicalizes casing and deeply clones exercise data", () => {
  const authored = { ...doc, spreadsheetAssignments: [{ ...assignment,
    answers: { "BUDGET!b3": 750 }, protectedCells: ["budget!b1"] }] };
  const converted = convert(authored).spreadsheetAssignments as NonNullable<CommunityDoc["spreadsheetAssignments"]>;
  assert.deepEqual(converted[0].answers, { "Budget!B3": 750 });
  assert.deepEqual(converted[0].protectedCells, ["Budget!B1"]);
  converted[0].starter.sheets.Budget.B1 = 99;
  assert.equal(authored.spreadsheetAssignments[0].starter.sheets.Budget.B1, 1200);
});
test("draft, publish and installation reject malformed assignment collections", () => {
  for (const spreadsheetAssignments of [null, {}, "bad", [null], [{ ...assignment, starter: undefined }],
    [{ ...assignment, answers: null }], [{ ...assignment, protectedCells: null }],
    [{ ...assignment, lessonId: "missing" }], [assignment, assignment],
    [{ ...assignment, answers: { "Budget!B3": Infinity } }],
    [{ ...assignment, starter: { sheets: { Budget: {}, BUDGET: {} } } }],
    [{ ...assignment, starter: { sheets: JSON.parse('{"constructor":{"A1":1}}') } }],
    [{ ...assignment, answers: { "Budget!B3": 750, "BUDGET!b3": 0 } }]]) {
    const invalid = { ...doc, spreadsheetAssignments } as unknown as CommunityDoc;
    assert(checkDoc(invalid, false).length > 0);
    assert(checkDoc(invalid, true).length > 0);
    assert.throws(() => convert(invalid));
  }
});
test("assignments cannot silently follow a deleted lesson", () => {
  const missing = { ...doc, lessons: [{ ...doc.lessons[0], id: "replacement" }] };
  assert(checkDoc(missing, false).some(message => message.includes("lesson doesn't exist")));
  assert.throws(() => convert(missing), /lesson doesn't exist/);
});
test("collection, per-assignment and UTF-8 document byte limits are enforced", () => {
  const tooMany = { ...doc, spreadsheetAssignments: Array.from({ length: LIMITS.spreadsheetAssignments + 1 }, (_, index) => ({ ...assignment, id: `item-${index}` })) };
  assert(checkDoc(tooMany, false).some(message => message.includes("At most")));
  const cells = Object.fromEntries(Array.from({ length: 100 }, (_, i) => [`A${i + 1}`, "x".repeat(2048)]));
  const oversized = { ...assignment, starter: { sheets: { Budget: cells } } };
  assert(checkCommunitySpreadsheetAssignments([oversized], new Set(["l1"])).some(message => message.includes("byte limit")));
  const hugeUnicode = { ...doc, description: "界".repeat(Math.floor(LIMITS.docBytes / 2)) };
  assert(checkDoc(hugeUnicode, false).some(message => message.includes("too large")));
});
test("nonserializable spreadsheet data fails closed rather than throwing during validation", () => {
  const circular: Record<string, unknown> = { ...assignment }; circular.self = circular;
  assert(checkCommunitySpreadsheetAssignments([circular], new Set(["l1"])).some(message => message.includes("JSON")));
  assert(checkDoc({ ...doc, spreadsheetAssignments: [circular] }, false).some(message => message.includes("JSON")));
  assert(checkDoc({ ...doc, spreadsheetAssignments: [{ ...assignment, tolerance: 1n }] }, true).some(message => message.includes("JSON")));
});
test("omitted and empty assignments remain backward compatible", () => {
  const { spreadsheetAssignments: _assignments, ...oldDoc } = doc;
  assert.deepEqual(checkDoc(oldDoc, true), []);
  assert.equal(convert(oldDoc).spreadsheetAssignments, undefined);
  assert.deepEqual(convert({ ...oldDoc, spreadsheetAssignments: [] }).spreadsheetAssignments, []);
  assert.deepEqual(checkDoc(emptyDoc(), false), []);
});
console.log(`community spreadsheet format: ${passed} groups passed`);

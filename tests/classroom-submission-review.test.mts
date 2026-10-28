import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
const dom = new JSDOM('<!doctype html><div id="root"></div>', { url: "https://example.test" });
Object.assign(globalThis, { window: dom.window, document: dom.window.document, HTMLElement: dom.window.HTMLElement, IS_REACT_ACT_ENVIRONMENT: true });
const React = await import("react");
const { createRoot } = await import("react-dom/client");
const { default: Review } = await import("../src/components/ClassroomSubmissionReview.tsx");
const snapshot = { format: "erudior-handin", version: 1, classId: "class-a", className: "Science", studentId: "student-a", studentName: "Alice", created: "2026-10-01T10:00:00Z", courses: ["science"], mac: "signed", progress: { attempts: [{ id: "attempt", bankId: "science__quiz", score: 80 }], lessonsDone: {}, drills: {}, work: { "science/essay": { text: "Original writing evidence", submitted: "2026-10-01" }, "science/lab": { observations: "Original lab evidence" } }, spreadsheetGrades: { "science/sheet": { workbookSnapshot: '{"sheets":{"Budget":{"AA12":"=A1-450"}}}' } } } };
const make = (id: string, studentId = "student-a", name = "Alice") => ({ id, importComplete: true, classId: "class-a", studentId, studentName: name, submittedAt: snapshot.created, receivedAt: "2026-10-02T10:00:00Z", courses: ["science"], attemptCount: 1, status: "pending", snapshot: { ...structuredClone(snapshot), studentId, studentName: name }, reviewEvents: [] as any[] });
let persisted: any[] = [make("receipt-1"), make("hidden", "not-rostered", "PRIVATE STUDENT")];
const family: any = { classes: [{ id: "class-a", name: "Science", students: ["student-a", "student-b"] }], students: [{ id: "student-a", name: "Alice" }, { id: "student-b", name: "Bob" }] };
let failLoad = true, failSave = false, failImport = false;
const saveCalls: any[] = [];
let picked: string | null = "{}";
let importedRaw: unknown;
const services: any = {
  loadClassroomSubmissions: async () => { if (failLoad) throw Error("disk read failed"); return structuredClone(persisted); },
  pickJsonFile: async () => picked,
  importClassroomSubmission: async (raw: unknown) => { importedRaw = raw; if (failImport) throw Error("disk import failed"); persisted[0].importComplete = true; return { record: structuredClone(persisted[0]), inserted: false }; },
  saveClassroomSubmissionReview: async (event: any) => {
    saveCalls.push(event); if (failSave) throw Error("disk review failed");
    persisted = persisted.map(r => r.id !== event.submissionId ? r : { ...r, status: event.status, reviewNote: event.note, reviewEvents: [...r.reviewEvents, { ...event, id: event.eventId }] });
    return structuredClone(persisted);
  },
};
const root = createRoot(document.getElementById("root")!);
const render = () => React.act(async () => root.render(React.createElement(Review, { family, services })));
const button = (text: string) => [...document.querySelectorAll("button")].find(b => b.textContent?.startsWith(text))!;
const click = (el: HTMLElement) => React.act(async () => el.click());
const text = () => document.body.textContent!;
const setValue = async (el: HTMLTextAreaElement | HTMLSelectElement, value: string) => React.act(async () => {
  Object.getOwnPropertyDescriptor(el instanceof dom.window.HTMLSelectElement ? dom.window.HTMLSelectElement.prototype : dom.window.HTMLTextAreaElement.prototype, "value")!.set!.call(el, value);
  el.dispatchEvent(new dom.window.Event(el instanceof dom.window.HTMLSelectElement ? "change" : "input", { bubbles: true }));
});
try {
  await render(); assert.match(text(), /disk read failed/); assert(button("Import a hand-in").disabled);
  failLoad = false; await click(button("Reload submission")); assert(!button("Import a hand-in").disabled); assert(!text().includes("PRIVATE STUDENT"));
  await click(button("Inspect submission"));
  for (const value of ["Original writing evidence", "Original lab evidence", "=A1-450", "Quiz and exam attempts", "No instructor reviews yet."])
    assert(text().includes(value), value);
  failSave = true; await setValue(document.querySelector("textarea")!, "Revise your explanation");
  await click(button("Save instructor review")); assert.match(text(), /disk review failed/); assert(!text().includes("Instructor review saved.")); assert.equal(persisted[0].reviewEvents.length, 0);
  assert.equal(saveCalls[0].note, "Revise your explanation");
  const firstId = saveCalls[0].eventId;
  failSave = false; await click(button("Save instructor review")); assert.equal(saveCalls[1].eventId, firstId, "retry reuses event id"); assert.equal(persisted[0].reviewEvents.length, 1);
  assert.match(text(), /Instructor review saved/);
  await setValue([...document.querySelectorAll("select")].at(-1)!, "needs_revision");
  await click(button("Save instructor review")); assert.notEqual(saveCalls[2].eventId, firstId); assert.equal(persisted[0].reviewEvents.length, 2);
  assert.equal(persisted[0].reviewEvents[0].status, "reviewed"); assert.equal(persisted[0].reviewEvents[1].status, "needs_revision");
  await React.act(async () => root.render(null)); await render(); await click(button("Inspect submission")); assert.match(text(), /Needs revision/); assert.match(text(), /Original writing evidence/);
  persisted[0].importComplete = false;
  failImport = true; await click(button("Import a hand-in")); assert.match(text(), /disk import failed/); assert(!text().includes("already saved"));
  assert.match(text(), /Received, import incomplete/); assert(button("Save instructor review").disabled);
  failImport = false; await click(button("Retry saved import"));
  assert.deepEqual(importedRaw, persisted[0].snapshot, "retry uses exact durable evidence, no new file selection");
  assert(!button("Save instructor review").disabled);
  await click(button("Import a hand-in")); assert.match(text(), /already saved/); assert.equal(document.querySelectorAll("tbody tr").length, 1);
  picked = null; await click(button("Import a hand-in")); assert.equal(persisted.length, 2);
  failLoad = true; await click(button("Reload submission")); assert.match(text(), /disk read failed/); assert.equal(button("Save instructor review"), undefined, "reload failure hides stale actionable receipt");
  failLoad = false; await click(button("Reload submission")); assert.match(text(), /Submission history reloaded/);
  await click(button("Inspect submission"));
  const normalSave = services.saveClassroomSubmissionReview;
  let finishSave: (() => void) | undefined;
  services.saveClassroomSubmissionReview = async (event: any) => {
    await new Promise<void>(resolve => { finishSave = resolve; }); return normalSave(event);
  };
  const before = saveCalls.length;
  await React.act(async () => { button("Save instructor review").click(); button("Save instructor review").click(); });
  assert(button("Save instructor review").disabled); assert.equal(saveCalls.length, before);
  await React.act(async () => { finishSave!(); }); assert.equal(saveCalls.length, before + 1, "repeated save clicks produce one review");
  services.saveClassroomSubmissionReview = normalSave;
  // A legacy signed receipt may reference files it did not include. Neither decision is allowed.
  persisted[0].snapshot.progress.work["science/lab"].photos = [{ fileId: "missingphoto" }];
  await click(button("Reload submission"));
  assert.match(text(), /Incomplete attachment evidence: missingphoto/);
  assert(button("Save instructor review").disabled);
  const reviewDecision = [...document.querySelectorAll("select")].at(-1)!;
  assert(reviewDecision.disabled); assert.deepEqual([...reviewDecision.options].map(x => x.value), ["reviewed", "needs_revision"]);
  const callsBeforeIncomplete = saveCalls.length;
  await click(button("Save instructor review")); assert.equal(saveCalls.length, callsBeforeIncomplete);
  // Removing roster membership preserves evidence for an existing profile, but only read-only.
  const reducedFamily = { ...family, classes: [{ ...family.classes[0], students: ["student-b"] }] };
  await React.act(async () => root.render(React.createElement(Review, { family: reducedFamily, services })));
  assert.match(text(), /Archived receipts/); assert.equal(button("Inspect submission"), undefined);
  await click(button("Inspect archived receipt"));
  assert.match(text(), /Original writing evidence/); assert.match(text(), /Archived receipt — read-only/);
  assert(button("Save instructor review").disabled); assert(!text().includes("PRIVATE STUDENT"));
  // Removing the entire class still exposes archived evidence, not import or review authority.
  persisted[0].importComplete = false;
  await React.act(async () => root.render(React.createElement(Review, { family: { ...family, classes: [] }, services })));
  await click(button("Inspect archived receipt"));
  assert(button("Retry saved import").disabled); assert(button("Save instructor review").disabled);
  assert.match(text(), /Original lab evidence/);
  // A deleted student profile must not expose even the archived receipt.
  await React.act(async () => root.render(React.createElement(Review, { family: { ...family, classes: [], students: [] }, services })));
  assert(!text().includes("Original writing evidence")); assert.equal(button("Inspect archived receipt"), undefined);
  console.log("classroom submission review: immutable evidence, roster isolation, reload/remount, append-only review and import failure/retry checks passed");
} finally { await React.act(async () => root.unmount()); dom.window.close(); }

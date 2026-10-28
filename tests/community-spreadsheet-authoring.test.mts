import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import type { AppApi } from "../src/App.tsx";
import { checkDoc, type CommunityDoc } from "../src/lib/communityFormat.ts";

const dom = new JSDOM("<!doctype html><body><div id='root'></div></body>", { url: "https://example.test" });
Object.assign(globalThis, { window: dom.window, document: dom.window.document, HTMLElement: dom.window.HTMLElement,
  localStorage: dom.window.localStorage, IS_REACT_ACT_ENVIRONMENT: true });
Object.defineProperty(globalThis, "navigator", { configurable: true, value: dom.window.navigator });
const { createElement, act } = await import("react");
const { createRoot } = await import("react-dom/client");
const { api: community } = await import("../src/lib/community.ts");
const { default: CommunityEditor } = await import("../src/pages/CommunityEditor.tsx");
const original = { ...community };
const doc: CommunityDoc & { futureMetadata: { preserve: string[] } } = {
  format: "erudior-community", version: 1, title: "Community math", description: "Practice reusable budget calculations.",
  subject: "Math", level: "Middle School", type: "Course", calculator: "scientific",
  modules: [{ id: "m1", title: "Budgets" }],
  lessons: [{ id: "l1", module: "m1", title: "Introduction", blocks: [{ type: "text", md: "Keep this **rich text**." }] },
    { id: "l2", module: "m1", title: "Practice", blocks: [{ type: "heading", text: "Work independently" }, { type: "text", md: "Complete the assigned workbook." }] }],
  decks: [{ id: "d1", title: "Terms", cards: [{ id: "c1", front: "Income", back: "Money received" }] }],
  glossary: [{ term: "Income", definition: "Money received" }], references: [{ id: "r1", title: "Guide", md: "**Do not lose this.**" }],
  futureMetadata: { preserve: ["untouched", "by spreadsheet adapter"] },
};
assert.deepEqual(checkDoc(doc, true), []);
let stored: CommunityDoc = structuredClone(doc);
let saveCalls = 0, publishes = 0, navigation = 0;
let deferNextSave = false, failNextSave = false;
let releaseSave: (() => void) | undefined, releasePublish: (() => void) | undefined;
const savedTitles: string[] = [];
community.draft = async id => ({ id, status: "draft", version: 0, review: "not_reviewed", reviewNote: null, role: "owner", doc: structuredClone(stored) });
community.save = async (_id, value) => {
  saveCalls++; savedTitles.push(value.title);
  if (failNextSave) { failNextSave = false; throw new Error("Offline test"); }
  if (deferNextSave) { deferNextSave = false; await new Promise<void>(resolve => { releaseSave = resolve; }); }
  stored = structuredClone(value); return {};
};
community.editors = async () => ({ owner: null, editors: [] });
community.publish = async () => { publishes++; await new Promise<void>(resolve => { releasePublish = resolve; }); return { version: 1 }; };
const notices: string[] = [];
const api = { toast: (message: string) => notices.push(message), go: () => { navigation++; } } as unknown as AppApi;
const root = createRoot(document.getElementById("root")!);
const button = (text: string, last = false) => { const found = [...document.querySelectorAll("button")].filter(el => el.textContent?.trim() === text); assert.ok(found.length, `button ${text}`); return found[last ? found.length - 1 : 0]; };
const field = (text: string) => { const label = [...document.querySelectorAll("label")].find(el => el.firstChild?.textContent?.trim() === text); assert.ok(label, `field ${text}`); const input = label.querySelector("input,select,textarea"); assert.ok(input); return input as HTMLInputElement; };
async function click(text: string, last = false) { await act(async () => button(text, last).click()); }
async function fill(label: string, value: string) {
  const input = field(label);
  const proto = input.tagName === "SELECT" ? dom.window.HTMLSelectElement.prototype : input.tagName === "TEXTAREA" ? dom.window.HTMLTextAreaElement.prototype : dom.window.HTMLInputElement.prototype;
  await act(async () => { Object.getOwnPropertyDescriptor(proto, "value")!.set!.call(input, value); input.dispatchEvent(new dom.window.Event(input.tagName === "SELECT" ? "change" : "input", { bubbles: true })); });
}
async function mount() { await act(async () => root.render(createElement(CommunityEditor, { api, id: "community-test" }))); }
try {
  await mount();
  await click("Spreadsheets (0)");
  await click("Add spreadsheet assignment");
  assert.equal(button("Save draft").disabled, true);
  await click("About");
  assert.ok(document.querySelector('[aria-label="Spreadsheet assignment author"]'), "pending author edits block tab navigation");
  await click("← Your courses");
  assert.equal(navigation, 0);
  await click("Publish");
  assert.equal(publishes, 0);
  const unloading = new dom.window.Event("beforeunload", { cancelable: true });
  window.dispatchEvent(unloading);
  assert.equal(unloading.defaultPrevented, true, "browser unload warns about unapplied author edits");
  await fill("Assignment title", "Community budget");
  await fill("Attached lesson", "l2");
  await fill("Protected cells (comma-separated worksheet!cell references)", "budget!b1, Budget!B2");
  await fill("Graded cell", "budget!b3"); await fill("Expected result", "750");
  await click("Add or replace criterion");
  await click("Apply assignment to course");
  await click("Save draft");
  assert.equal(stored.spreadsheetAssignments?.length, 1);
  const assignmentId = stored.spreadsheetAssignments![0].id;
  assert.equal(stored.spreadsheetAssignments![0].lessonId, "l2");
  assert.deepEqual(stored.spreadsheetAssignments![0].protectedCells, ["Budget!B1", "Budget!B2"]);
  const { spreadsheetAssignments: _assignments, ...preserved } = stored;
  assert.deepEqual(preserved, doc, "minimal adapter preserves every non-spreadsheet field, including future metadata");
  await act(async () => root.render(null)); await mount();
  await click("Spreadsheets (1)");
  await click("Edit Community budget");
  await fill("Assignment title", "Reopened community budget");
  await click("Apply assignment to course"); await click("Save draft");
  assert.equal(stored.spreadsheetAssignments![0].id, assignmentId);
  assert.equal(stored.spreadsheetAssignments![0].title, "Reopened community budget");
  await click("Lessons (2)"); await click("2. Practice");
  assert.equal(button("Delete lesson").disabled, true, "referenced lesson cannot be removed");
  await click("About");
  deferNextSave = true;
  await fill("Title", "Older pending title"); await click("Save draft");
  const pendingCalls = saveCalls;
  await fill("Title", "Latest title");
  assert.equal(button("Save draft").disabled, false, "newer edits remain visibly unsaved");
  await click("Save draft");
  assert.equal(saveCalls, pendingCalls, "second flush shares serialized writer");
  await act(async () => releaseSave!());
  assert.equal(stored.title, "Latest title", "newer edit is saved after older request completes");
  assert.deepEqual(savedTitles.slice(-2), ["Older pending title", "Latest title"]);
  assert.equal(document.querySelector(".save-state")!.textContent?.trim(), "All changes saved");
  failNextSave = true;
  await fill("Title", "Retry after offline"); await click("← Your courses");
  assert.equal(navigation, 0, "failed persistence cannot silently navigate away");
  assert.match(document.querySelector(".save-state")!.textContent!, /Offline test/);
  await click("Save draft"); assert.equal(stored.title, "Retry after offline");
  await click("Publish"); await click("Publish", true);
  assert.equal(publishes, 1);
  await click("About"); await click("← Your courses");
  assert.equal(navigation, 0, "publication in flight blocks departure");
  assert.ok(document.querySelector("fieldset[disabled]"), "publication freezes edits");
  await act(async () => releasePublish!());
  assert.ok(document.body.textContent?.includes("Published version 1"));
  assert.deepEqual(checkDoc(stored, true), []);
  console.log("community spreadsheet authoring: attach/save/reopen, field preservation, pending edits, lesson guard, serialized recovery and publish freeze passed");
} finally {
  await act(async () => root.unmount());
  Object.assign(community, original);
  dom.window.close();
}

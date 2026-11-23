import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { emptyBank } from "../src/lib/validate.ts";
import { emptyCourse } from "../src/lib/course.ts";
import { requestNavigation } from "../src/lib/navigationGuard.ts";
import { readObjectiveFile } from "../src/lib/objectiveReview.ts";

const dom = new JSDOM('<!doctype html><main id="root"></main>', { url: "https://example.test" });
Object.assign(globalThis, {
  window: dom.window, document: dom.window.document, HTMLElement: dom.window.HTMLElement,
  FormData: dom.window.FormData, IS_REACT_ACT_ENVIRONMENT: true,
});
Object.defineProperty(globalThis, "navigator", { value: dom.window.navigator, configurable: true });
const { act, createElement } = await import("react");
const { createRoot } = await import("react-dom/client");
const { default: CourseEditor } = await import("../src/pages/CourseEditor.tsx");

const course = emptyCourse("Evidence workshop");
course.author = "Author";
course.revision = 3;
course.lessons = [{ id: "lesson", module: "m1", title: "Support a claim", body: "Choose evidence." }];
course.writing = [{ id: "response", title: "Short response", kind: "essay", prompt: "Explain your reasoning.", rubric: "guide" }];
course.rubrics = [{ id: "guide", title: "Evidence guide", criteria: [{ id: "reason", name: "Evidence", levels: [{ points: 1, label: "Supported" }, { points: 0, label: "Missing" }] }] }];
const bank = emptyBank("Item review bank");
bank.id = "evidence-bank";
bank.questions = [
  { id: "claim", topic: "Evidence", type: "text", stem: "Name the source.", choices: [], answer: [], accept: [["Witness", "Eyewitness"]], explanation: "Firsthand observation explains the claim." },
  { id: "broken", topic: "Evidence", stem: "Choose from an unavailable diagram.", choices: ["A", "B"], answer: [1], explanation: "Missing figure example." },
];
course.banks = [bank];
const api = { courses: [course], toast() {} } as Parameters<typeof CourseEditor>[0]["api"];
const root = createRoot(document.querySelector("main")!);
let download: Blob | undefined, filename = "", imported = "";
URL.createObjectURL = blob => { download = blob; return "blob:test"; };
URL.revokeObjectURL = () => {};
dom.window.HTMLAnchorElement.prototype.click = function () { filename = this.download; };
const originalClick = dom.window.HTMLInputElement.prototype.click;
dom.window.HTMLInputElement.prototype.click = function () {
  if (this.type !== "file") return originalClick.call(this);
  Object.defineProperty(this, "files", { value: [{ text: async () => imported }] });
  this.dispatchEvent(new dom.window.Event("change"));
};
dom.window.confirm = () => true;

const page = () => document.body.textContent!;
async function click(name: string) {
  const button = [...document.querySelectorAll("button")].find(b => b.textContent === name);
  assert.ok(button && !button.disabled, name);
  await act(async () => button.click());
}
async function fill(label: string, text: string, scope: ParentNode = document) {
  const field = [...scope.querySelectorAll("label")].find(l => l.textContent?.startsWith(label));
  const input = field?.querySelector("input, select, textarea");
  assert.ok(input, label);
  const key = input.tagName === "SELECT" ? "change" : "input";
  await act(async () => {
    Object.getOwnPropertyDescriptor(Object.getPrototypeOf(input), "value")!.set!.call(input, text);
    input.dispatchEvent(new dom.window.Event(key, { bubbles: true }));
  });
}
async function sign(result: string, finding: string) {
  await fill("Reviewer name", "Reviewer");
  await fill("Review result", result);
  await fill("Review findings", finding);
  const consent = document.querySelector<HTMLInputElement>('form input[type="checkbox"]')!;
  await act(async () => consent.click());
  await click("Record review for revision 3");
}
async function openEditor(key: string) {
  await act(async () => root.render(createElement(CourseEditor, { api, course, key })));
  await click("Objective review");
}
async function waitForText(text: string) {
  for (let i = 0; i < 50 && !page().includes(text); i++) {
    await act(async () => { await new Promise(resolve => setTimeout(resolve, 10)); });
  }
  assert.ok(page().includes(text), text);
}

await openEditor("writer");
await click("Open blind question review");
await waitForText("Name the source.");
const revealButton = () => [...document.querySelectorAll("button")].find(b => b.textContent === "Lock response and reveal key")!;
assert.ok(revealButton().disabled);
assert.doesNotMatch(page(), /Firsthand observation|Witness/);
await fill("Your answer", "Eyewitness");
await click("Lock response and reveal key");
assert.match(page(), /The engine accepted this response/);
assert.match(page(), /Firsthand observation/);
await fill("Question reviewer", "Author");
await fill("Item review note", "The accepted alternative graded correctly.");
await click("Record item finding");
assert.match(page(), /independent of the author/);
await fill("Question reviewer", "Reader");
await click("Record item finding");
assert.match(page(), /Question review recorded/);
await fill("Question to review", "broken");
await fill("Question reviewer", "Reader");
await fill("Item finding", "Unanswerable");
await fill("Item review note", "The question refers to a missing diagram.");
await click("Record item finding");
await click("Close blind question review");
await click("Add objective");
await fill("Learning objective", "Defend a claim using evidence");
await fill("Worked example", "Lesson opening, paragraph 2");
await fill("Guided practice", "Practice with feedback, step 3");
await fill("Independent application", "Select evidence for a new claim");
await fill("Independent task", "writing:response");
assert.match(page(), /Linked rubric · Evidence guide/);
const sourceFields = document.querySelectorAll(".objective-fields fieldset");
const urls = ["https://first.edu/lesson", "https://second.edu/practice", "https://official.example.org/standard"];
for (let i = 0; i < urls.length; i++) {
  await fill("Source URL", urls[i], sourceFields[i]);
  await fill("Comparison finding", "Checked the stated outcome against this source.", sourceFields[i]);
}
assert.equal(requestNavigation(), false);
await sign("changes", "Explain what counts as strong evidence.");
await waitForText("Changes requested");
await sign("reviewed", "Checked the revised explanation.");
await waitForText("1 of 1 objectives have all evidence recorded");
assert.match(page(), /Previous reviews \(1\)/);
await click("Export review file");
assert.equal(requestNavigation(), true);
assert.equal(filename, course.id + ".objectives.json");
assert.ok(download);
const saved = await download.text();
const stored = readObjectiveFile(saved, course.id);
assert.equal(stored.baselines?.length, 1);
assert.equal(stored.attempts?.length, 2);
assert.equal(stored.attempts?.[0].comparison?.correct, true);
assert.equal(stored.attempts?.[1].comparison, undefined);
assert.equal(stored.attempts?.[1].issue, "Unanswerable");
bank.questions[0] = { ...bank.questions[0], accept: [["Witness"]] };
assert.equal(readObjectiveFile(saved, course.id).objectives[0].previousReviews?.[0].result, "changes");

await openEditor("independent-reader");
imported = saved;
await click("Open review file");
await waitForText("Review outdated");
await waitForText("Edited · Answer key · Item review bank / claim");
await click("Review question");
await waitForText("Name the source.");
assert.ok(revealButton().disabled);
await click("Close blind question review");
await click("Details");
await fill("Title", "Changed course content");
await click("Objective review");
await waitForText("Review outdated");
assert.match(page(), /Checked the revised explanation/);
imported = JSON.stringify({ ...JSON.parse(saved), courseId: "another" });
await click("Open review file");
assert.match(page(), /Choose an objective review file for this course/);
assert.match(page(), /Defend a claim using evidence/);
await act(async () => root.unmount());
dom.window.close();
console.log("Objective review editor workflow passed.");

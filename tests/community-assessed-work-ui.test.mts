import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { JSDOM } from "jsdom";
const work = JSON.parse(readFileSync(new URL("./fixtures/community-assessed-work.json", import.meta.url), "utf8"));
const dom = new JSDOM('<!doctype html><div id="root"></div>', { url: "https://example.test" });
Object.assign(globalThis, { window: dom.window, document: dom.window.document, HTMLElement: dom.window.HTMLElement, localStorage: dom.window.localStorage, IS_REACT_ACT_ENVIRONMENT: true });
Object.defineProperty(globalThis, "navigator", { configurable: true, value: dom.window.navigator });
const React = await import("react");
const { createRoot } = await import("react-dom/client");
const { default: Editor } = await import("../src/pages/CommunityEditor.tsx");
const { ReviewItem } = await import("../src/pages/ReviewQueue.tsx");
const { api: community } = await import("../src/lib/community.ts");
const { checkDoc } = await import("../src/lib/communityFormat.ts");
const old = { ...community };
const originalBlock = { type: "text", md: "Preserve this **formatted lesson** and $x^2$." };
let stored: any = { ...work, format: "erudior-community", version: 1, title: "Observation course", description: "Practice evidence.", subject: "Science", level: "Elementary School", modules: [{ id: "m1", title: "Observation" }], lessons: [{ id: "l1", module: "m1", title: "Observe and explain", blocks: [originalBlock] }], decks: [], futureMetadata: { preserve: true } };
let publication: any, failSave = false;
const reviews: any[][] = [], notices: string[] = [];
community.draft = async () => ({ id: "course", status: "draft", version: 0, review: "not_reviewed", reviewNote: null, role: "owner", doc: structuredClone(stored) });
community.save = async (_id, value) => { if (failSave) throw Error("Save failed"); stored = structuredClone(value); return {}; };
community.editors = async () => ({ owner: null, editors: [] });
community.publish = async () => { assert.deepEqual(checkDoc(stored, true), []); publication = structuredClone(stored); return { version: 1 }; };
community.course = async () => ({ id: "course", version: 1, author: "Author", review: "not_reviewed", doc: structuredClone(publication) }) as never;
community.review = async (...args) => { reviews.push(args); return {} as never; };
const api: any = { toast: (message: string) => notices.push(message), go() {} };
const root = createRoot(document.getElementById("root")!);
const button = (label: string, last = false) => { const found = [...document.querySelectorAll("button")].filter(b => b.textContent?.trim() === label); assert(found.length, label); return found[last ? found.length - 1 : 0]; };
const click = (el: HTMLElement) => React.act(async () => el.click());
const labelField = (label: string) => [...document.querySelectorAll("label")].find(l => l.textContent?.trim() === label)!.querySelector("input,textarea,select") as HTMLInputElement;
async function fill(label: string, value: string) { const field = labelField(label); const proto = field.tagName === "TEXTAREA" ? dom.window.HTMLTextAreaElement.prototype : dom.window.HTMLInputElement.prototype; await React.act(async () => { Object.getOwnPropertyDescriptor(proto, "value")!.set!.call(field, value); field.dispatchEvent(new dom.window.Event("input", { bubbles: true })); }); }
const mount = () => React.act(async () => root.render(React.createElement(Editor, { api, id: "course" })));
try {
  await mount(); await click(button("Writing, labs and activities"));
  for (const name of ["Explain an observation", "Observe safely", "Observation practice"]) {
    await click(button(`Edit ${name}`)); await click(labelField("Attach to Observe and explain"));
    assert(button("Remove selected resource").disabled, "attached resources cannot be silently removed");
  }
  await click(button("Edit Explain an observation"));
  await fill("Resource title", "Explain a recorded observation");
  failSave = true; await click(button("Save draft")); assert(document.body.textContent!.includes("Not saved:"));
  failSave = false; await click(button("Save draft"));
  assert.deepEqual(stored.lessons[0].blocks[0], originalBlock); assert.deepEqual(stored.futureMetadata, { preserve: true });
  assert.deepEqual(stored.lessons[0].blocks.slice(1), [{ type: "assignment", kind: "writing", id: "bird-report" }, { type: "assignment", kind: "lab", id: "bird-observation" }, { type: "assignment", kind: "log" }]);
  assert.equal(stored.writing[0].title, "Explain a recorded observation");
  await React.act(async () => root.render(null)); await mount(); await click(button("Writing, labs and activities"));
  await click(button("Edit Explain a recorded observation")); assert(labelField("Attach to Observe and explain").checked);
  await click(button("Publish")); await click(button("Publish", true)); assert(publication); assert.deepEqual(publication, stored);
  const entry: any = { id: "course", title: stored.title, description: stored.description, subject: stored.subject, level: stored.level, version: 1, author: "Author", review: "not_reviewed", counts: { lessons: 1, questions: 0, cards: 0 }, updated: null };
  await React.act(async () => root.render(React.createElement(ReviewItem, { api, c: entry, onDone() {} })));
  const prefix = (value: string) => [...document.querySelectorAll("button")].find(b => b.textContent!.startsWith(value))!;
  await click(prefix("Read the course"));
  for (const text of ["Explain a recorded observation", "Evidence and explanation", "4 points", "Stay with an adult", "Bird counts", "What supports your conclusion?", "Weekly minutes: 30", "Uploads: Disabled", "Observe and explain (l1): writing — bird-report"])
    assert(document.body.textContent!.includes(text), text);
  const mark = () => prefix("Mark version"); assert(mark().disabled);
  await click(document.querySelector('input[type="checkbox"]') as HTMLInputElement); assert(!mark().disabled);
  await click(prefix("Reload course contents")); assert(mark().disabled, "content reload resets assessed-work acknowledgment");
  await click(document.querySelector('input[type="checkbox"]') as HTMLInputElement); await click(mark());
  assert.deepEqual(reviews, [["course", "reviewed", "", 1]]);
  await React.act(async () => root.render(React.createElement(ReviewItem, { api, c: { ...entry, version: 2 }, onDone() {} })));
  await click(prefix("Read the course")); assert(mark().disabled); assert(notices.some(n => /changed/.test(n)));
  console.log("community assessed-work UI: shared authoring, typed attachments, save/reopen/publish preservation and exact-version acknowledged review passed");
} finally { Object.assign(community, old); await React.act(async () => root.unmount()); dom.window.close(); }

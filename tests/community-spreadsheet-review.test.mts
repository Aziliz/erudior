import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import type { CommunityEntry } from "../src/lib/community.ts";
const dom = new JSDOM('<!doctype html><div id="root"></div>', { url: "https://example.test" });
Object.assign(globalThis, { window: dom.window, document: dom.window.document, HTMLElement: dom.window.HTMLElement, IS_REACT_ACT_ENVIRONMENT: true });
const React = await import("react");
const { createRoot } = await import("react-dom/client");
const { ReviewItem, default: ReviewQueue } = await import("../src/pages/ReviewQueue.tsx");
const { api: community } = await import("../src/lib/community.ts");
const doc = {
  format: "erudior-community", version: 1, title: "Budget course", description: "Budget practice", subject: "Math", level: "High School", type: "Course",
  modules: [{ id: "module", title: "Budgets" }], lessons: [{ id: "lesson", module: "module", title: "Budget lesson", blocks: [{ type: "text", md: "Budget instructions" }] }], decks: [],
  spreadsheetAssignments: [{ id: "assignment", lessonId: "lesson", title: "Compute balance", starter: { sheets: { Budget: { A1: 1200, AA12: "=A1-450" }, Empty: {} } }, protectedCells: ["Budget!A1"], answers: { "Budget!AA12": 750 }, tolerance: 0.01 }],
};
let entry = { id: "course", title: "Budget course", description: "Budget practice", subject: "Math", level: "High School", author: "Author", version: 7, review: "not_reviewed", counts: { lessons: 1, questions: 0, cards: 0 }, updated: null } as CommunityEntry;
let responseVersion = 7;
let responseId = "course";
let responseDoc: unknown = doc;
const reviews: unknown[][] = [];
const messages: string[] = [];
const old = { ...community };
community.course = async () => ({ ...entry, id: responseId, version: responseVersion, doc: structuredClone(responseDoc) }) as never;
community.review = async (...args) => { reviews.push(args); return {} as never; };
const api = { toast: (message: string) => messages.push(message) } as never;
const root = createRoot(document.getElementById("root")!);
const show = () => React.act(async () => root.render(React.createElement(ReviewItem, { api, c: entry, onDone() {} })));
const button = (text: string) => [...document.querySelectorAll("button")].find(b => b.textContent?.startsWith(text))!;
const click = (el: HTMLElement) => React.act(async () => el.click());
const mark = () => button("Mark version");
const ack = () => document.querySelector('input[type="checkbox"]') as HTMLInputElement;
try {
  await show(); assert(mark().disabled);
  responseVersion = 8; await click(button("Read the course"));
  assert(mark().disabled); assert.equal(ack(), null); assert.match(messages.at(-1)!, /changed/);
  responseVersion = 7; await click(button("Read the course"));
  for (const text of ["Budget lesson (lesson)", "Compute balance", "Assignment ID: assignment", "Budget!AA12", "=A1-450", "1200", "750", "Numeric tolerance: 0.01", "Protected cells", "Budget!A1", "Empty worksheet"])
    assert(document.body.textContent!.includes(text), text);
  assert(mark().disabled, "loading spreadsheet does not acknowledge inspection");
  await click(ack()); assert(!mark().disabled);
  await click(button("Reload course contents")); assert(!ack().checked); assert(mark().disabled, "reloading content invalidates acknowledgment");
  await click(ack()); await click(mark());
  assert.deepEqual(reviews, [["course", "reviewed", "", 7]]);
  entry = { ...entry, version: 8 }; await show();
  assert(mark().disabled); assert.equal(ack(), null, "version replacement clears contents and acknowledgment");
  responseVersion = 8; await click(button("Read the course")); assert(mark().disabled);
  await click(ack()); await click(mark()); assert.equal(reviews.at(-1)![3], 8);
  entry = { ...entry, id: "other" }; await show();
  await click(button("Read the course")); assert(mark().disabled, "wrong course response rejected");
  responseId = "other"; responseDoc = { ...doc, spreadsheetAssignments: [null] };
  await click(button("Read the course")); assert(mark().disabled); assert.match(messages.at(-1)!, /invalid/);
  responseDoc = { ...doc, spreadsheetAssignments: undefined };
  await click(button("Read the course")); assert(!mark().disabled, "non-spreadsheet courses need no spreadsheet acknowledgment");
  // A response to an unmounted identity cannot populate its replacement session.
  const normalRead = community.course;
  let finishRead: ((value: unknown) => void) | undefined;
  community.course = () => new Promise(resolve => { finishRead = resolve as never; }) as never;
  await click(button("Reload course contents"));
  entry = { ...entry, version: 9 }; await show();
  await React.act(async () => { finishRead!({ ...entry, version: 8, doc }); });
  assert(mark().disabled); assert.equal(ack(), null);
  community.course = normalRead; responseVersion = 9;
  // All-courses shortcut must open the same inspection, never call promotion directly.
  await React.act(async () => root.render(null));
  community.queue = async () => ({ waiting: [], reports: [], removed: [] });
  community.me = async () => ({ user: null, providers: { google: false, github: false, dev: false } });
  community.allCourses = async () => ({ courses: [{ ...entry, status: "published", reviewNote: null }] });
  responseDoc = doc;
  await React.act(async () => root.render(React.createElement(ReviewQueue, { api })));
  await React.act(async () => { await new Promise(resolve => setTimeout(resolve, 300)); });
  const before = reviews.length;
  await click(button("Reviewed")); assert.equal(reviews.length, before); assert(mark().disabled);
  await click(button("Read the course")); assert(mark().disabled); await click(ack()); await click(mark());
  assert.deepEqual(reviews.at(-1), ["other", "reviewed", "", 9]);
  // A failed/conflicting approval invalidates the loaded inspection rather than reusing its acknowledgment.
  await React.act(async () => root.render(null));
  await show(); await click(button("Read the course")); await click(ack());
  community.review = async () => { throw Error("Published version changed"); };
  await click(mark()); assert(mark().disabled); assert.equal(ack(), null);
  assert.match(messages.at(-1)!, /changed/);
  console.log("community spreadsheet review: read-only full inspection, acknowledgment, stale course/version rejection, exact-version API and shortcut gating passed");
} finally {
  Object.assign(community, old);
  await React.act(async () => root.unmount()); dom.window.close();
}

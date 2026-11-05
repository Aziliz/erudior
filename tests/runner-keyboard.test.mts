import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import type { AppApi } from "../src/App";
import type { Session } from "../src/lib/session";
import type { Course, Question } from "../src/lib/types";

const dom = new JSDOM('<!doctype html><main tabindex="-1"><div id="root"></div></main>', { url: "https://example.test" });
Object.assign(globalThis, {
  window: dom.window,
  document: dom.window.document,
  Element: dom.window.Element,
  HTMLElement: dom.window.HTMLElement,
  HTMLInputElement: dom.window.HTMLInputElement,
  localStorage: dom.window.localStorage,
  IS_REACT_ACT_ENVIRONMENT: true,
});
Object.defineProperty(globalThis, "navigator", { configurable: true, value: dom.window.navigator });
dom.window.HTMLElement.prototype.scrollTo = () => {};

const { act, createElement } = await import("react");
const { createRoot } = await import("react-dom/client");
const { default: Runner } = await import("../src/pages/Runner");
const { emptyProgress } = await import("../src/lib/storage");

const root = createRoot(document.getElementById("root")!);
const first: Question = {
  id: "first", topic: "Synthetic", stem: "Choose two.",
  choices: Array.from({ length: 26 }, (_, index) => `Choice ${index + 1}`),
  answer: [17, 0],
};
const second: Question = {
  id: "second", topic: "Synthetic", stem: "Choose one.", choices: ["One", "Two"], answer: [1],
};
const third: Question = {
  id: "third", type: "text", topic: "Synthetic", stem: "Type the final syllable.",
  choices: [], answer: [], accept: [["ん"]],
};
const exam: Session = {
  id: "exam", bankId: "bank", bankTitle: "Synthetic exam", mode: "exam", startedAt: Date.now(),
  items: [
    { q: first, order: first.choices.map((_, i) => 25 - i) },
    { q: second, order: [1, 0] },
    { q: third, order: [] },
  ],
  blocks: [{ start: 0, end: 2, name: "Section one" }, { start: 2, end: 3, name: "Section two" }],
};
const course = { id: "course", language: { code: "ja", ime: "ja" }, lessons: [] } as unknown as Course;
const bank = { id: "bank", courseId: course.id, sections: [] } as unknown as NonNullable<Parameters<typeof Runner>[0]["bank"]>;
const routes: unknown[] = [];
const confirmations: string[] = [];
let confirm = false;
dom.window.confirm = (message) => { confirmations.push(message); return confirm; };
let progress = emptyProgress();
const api = {
  get progress() { return progress; },
  courses: [course],
  go: (route: unknown) => routes.push(route),
  toast: () => {},
  saveLearnerSession: async () => {},
  updateProgress: async (update: (value: typeof progress) => typeof progress) => { progress = update(progress); },
} as unknown as AppApi;

const render = (session: Session) => act(async () => {
  root.render(createElement(Runner, { key: session.id, api, bank, session }));
});
const press = (key: string, init: KeyboardEventInit = {}) => act(async () => {
  document.activeElement!.dispatchEvent(new dom.window.KeyboardEvent("keydown", {
    key, bubbles: true, cancelable: true, ...init,
  }));
});
const choice = (original: number) => document.querySelector<HTMLButtonElement>(`[data-choice="${original}"]`)!;
const checked = (original: number) => choice(original).getAttribute("aria-checked") === "true";
const question = () => document.querySelector(".q-stem")!.textContent;
const flag = () => document.querySelector(".flag-btn")!.getAttribute("aria-pressed");
const attempt = () => progress.attempts[0];

try {
  await render(exam);
  document.querySelector("main")!.focus();
  await press("f");
  assert(checked(20), "F selects the sixth displayed option");
  assert.equal(flag(), "false");
  await press("F", { shiftKey: true });
  assert.equal(flag(), "true");
  assert(checked(20), "flagging leaves the answer intact");
  await press("f");
  await press("9");
  await press("Z");
  await press("Z", { repeat: true });
  assert(checked(17) && checked(0) && !checked(20), "number and letter keys follow shuffled display order and held keys do not toggle choices");

  choice(0).focus();
  await press("Enter");
  assert.equal(question(), second.stem, "Enter advances from a focused answer choice");
  await press("Enter", { repeat: true });
  assert.equal(confirmations.length, 0, "held Enter does not finish a section");
  await press("ArrowLeft");
  assert.equal(question(), first.stem);
  assert(checked(17) && checked(0), "going back restores both answers");
  await press("ArrowRight");
  await press("0");
  await press("Z");
  assert(!checked(0) && !checked(1), "unavailable keys leave the answer unchanged");
  await press("Enter");
  assert.match(confirmations.at(-1)!, /1 question is unanswered/);
  assert.equal(question(), second.stem, "cancelled section confirmation keeps the current question");

  confirm = true;
  await press("1");
  await press("Enter");
  assert.equal(question(), third.stem);
  await press("ArrowLeft");
  assert.equal(question(), third.stem, "completed section stays closed");
  const answer = document.querySelector<HTMLInputElement>(".text-answer input")!;
  answer.focus();
  Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype, "value")!.set!.call(answer, "n");
  await act(async () => answer.dispatchEvent(new dom.window.Event("input", { bubbles: true })));
  await press("Enter", { isComposing: true });
  assert.equal(routes.length, 0, "IME composition keeps Enter inside the field");
  await press("Enter");
  assert.match(confirmations.at(-1)!, /Submit your exam now/);
  assert.equal(attempt().correct, 3, "submission scores the finalized typed answer");
  assert.equal((routes[0] as { name: string }).name, "results");

  progress = emptyProgress();
  const quiz: Session = {
    ...exam, id: "quiz", mode: "practice", items: [exam.items[1]], blocks: [{ start: 0, end: 1 }],
    lesson: { courseId: course.id, lessonId: "quiz" },
  };
  await render(quiz);
  await press("a");
  await press("Enter");
  assert.match(document.querySelector(".verdict")!.textContent!, /Correct/);
  await press("Enter");
  assert.equal(attempt().correct, 1, "Enter on the final checked quiz question opens results");
  assert.equal((routes[1] as { name: string }).name, "results");
  console.log("Runner keyboard shortcuts passed for shuffled choices, split exams, typed answers, and quizzes.");
} finally {
  await act(async () => root.unmount());
  dom.window.close();
}

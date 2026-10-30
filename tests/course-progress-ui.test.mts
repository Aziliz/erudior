import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { emptyCourse } from "../src/lib/course.ts";
import { emptyProgress } from "../src/lib/storage.ts";
import { pathToView, viewToPath } from "../src/lib/routes.ts";
import type { Attempt, Course } from "../src/lib/types.ts";

const dom = new JSDOM('<!doctype html><div id="root"></div>', { url: "https://example.test" });
Object.assign(globalThis, { window: dom.window, document: dom.window.document, HTMLElement: dom.window.HTMLElement, localStorage: dom.window.localStorage, IS_REACT_ACT_ENVIRONMENT: true });
Object.defineProperty(globalThis, "navigator", { configurable: true, value: dom.window.navigator });
const React = await import("react");
const { createRoot } = await import("react-dom/client");
const { default: CourseProgress } = await import("../src/pages/CourseProgress.tsx");
const { default: CourseHome } = await import("../src/pages/CourseHome.tsx");

const course = emptyCourse("Course Alpha");
course.id = "alpha";
course.modules = [{ id: "m1", title: "Alpha module", quiz: ["q1"] }];
course.lessons = [
  { id: "one", module: "m1", title: "First alpha lesson", body: "", quiz: ["q1"] },
  { id: "two", module: "m1", title: "Second alpha lesson", body: "", quiz: ["q2"] },
  { id: "optional", module: "m1", title: "Optional challenge", body: "", honors: true },
];
course.banks = [{ format: "examiner-bank", version: 1, id: "alpha__bank", courseId: "alpha", title: "Alpha questions", sections: [], questions: [
  { id: "q1", topic: "Alpha fractions", stem: "One half?", choices: ["1/2", "1"], answer: [0] },
  { id: "q2", topic: "Alpha algebra", stem: "One?", choices: ["1", "2"], answer: [0] },
], exam: { questionCount: 2, timeLimitMinutes: 10, passingPercent: 70 } }];
const foreign = emptyCourse("Foreign course");
foreign.id = "foreign";
foreign.banks = [{ ...course.banks[0], id: "foreign__bank", courseId: "foreign", title: "Foreign bank" }];

const attempt = (id: string, fields: Partial<Attempt> = {}): Attempt => ({
  id, bankId: "alpha__bank", bankTitle: "Alpha questions", mode: "practice",
  startedAt: "2026-10-28T10:00:00.000Z", finishedAt: "2026-10-28T10:02:00.000Z", durationSec: 120,
  total: 2, answered: 2, correct: 1, byTopic: {}, bySection: {}, answers: [
    { qid: "q1", chosen: [0], correct: true }, { qid: "q2", chosen: [1], correct: false },
  ], ...fields,
});
const progress = emptyProgress();
progress.lessonsDone = { "alpha/one": "2026-10-28", "foreign/one": "2026-10-28", "alpha/removed": "2026-10-28" };
progress.attempts = [
  attempt("own-practice"),
  attempt("foreign", { bankId: "foreign__bank", bankTitle: "Foreign bank", correct: 2 }),
  attempt("foreign-collision", { lesson: { courseId: "foreign", lessonId: "one" }, bankTitle: "Foreign collision" }),
  attempt("own-exam", { mode: "exam", passingPercent: 70, finishedAt: "2026-10-29T10:02:00.000Z" }),
];
progress.stats = {
  alpha__bank: { q1: { seen: 4, correct: 2, lastCorrect: false, lastSeen: "2026-10-28T10:02:00.000Z" } },
  foreign__bank: { q1: { seen: 8, correct: 0, lastCorrect: false, lastSeen: "2026-10-28T10:02:00.000Z" } },
};
const routes: any[] = [];
let api: any = { progress, courses: [course, foreign], allCourses: [course, foreign], banks: [...course.banks, ...foreign.banks], family: null, student: null, go: (view: unknown) => routes.push(view), toast() {} };
const root = createRoot(document.getElementById("root")!);
const mount = async (component: typeof CourseProgress | typeof CourseHome = CourseProgress, selected: Course = course) => React.act(async () => root.render(React.createElement(component, { api, course: selected, tab: "progress" })));
const button = (text: string) => {
  const value = [...document.querySelectorAll<HTMLButtonElement>("button")].find(item => item.textContent === text);
  assert(value, `Missing button: ${text}`);
  return value;
};
const click = async (text: string) => React.act(async () => button(text).click());

await mount();
assert.equal(document.querySelector("progress")?.value, 50, "only current core lessons contribute to percentage");
assert.match(document.body.textContent!, /1 of 2 core lessons complete/);
assert.match(document.body.textContent!, /Optional honors lessons/);
assert.equal(document.querySelectorAll('[aria-label="Course session history"] tbody tr').length, 2);
assert.doesNotMatch(document.body.textContent!, /Foreign bank|Foreign collision|Foreign course/, "other course activity does not appear");
assert.match(document.querySelector('[aria-label="Course topics to practice"]')!.textContent!, /Alpha fractions/);
assert.match(document.querySelector('[aria-label="Course exam scores"]')!.textContent!, /latest 1 exam/);
await click("Continue lesson");
assert.deepEqual(routes.pop(), { name: "lesson", courseId: "alpha", lessonId: "two" });
await click("View result");
assert.deepEqual(routes.pop(), { name: "results", attemptId: "own-exam", back: { name: "course", courseId: "alpha", tab: "progress" } });
await click("All enrolled courses");
assert.deepEqual(routes.pop(), { name: "progress" });

await mount(CourseHome);
const nav = document.querySelector('[aria-label="Course sections"]')!;
const progressTab = [...nav.querySelectorAll<HTMLButtonElement>("button")].find(item => item.textContent === "Progress")!;
assert.equal(progressTab.getAttribute("aria-current"), "page");
await React.act(async () => progressTab.click());
assert.deepEqual(routes.pop(), { name: "course", courseId: "alpha", tab: "progress" });
const addresses = [course, foreign].map(({ id, title }) => ({ id, title }));
assert.equal(viewToPath({ name: "course", courseId: "alpha", tab: "progress" }, addresses, () => undefined), "/course-alpha/progress");
assert.deepEqual(pathToView("/course-alpha/progress", "", addresses, []), { name: "course", courseId: "alpha", tab: "progress" });
assert.deepEqual(pathToView("/course-alpha/progress", "", [], addresses), { name: "overview", catalogId: "alpha", requestedPath: "/course-alpha/progress" });

// Successful full-course assessment is identified without claiming unfinished lessons were read.
api = { ...api, progress: { ...progress, attempts: [attempt("pass", { mode: "exam", correct: 2, passingPercent: 70 })] } };
await mount();
assert.equal(document.querySelector("progress")?.value, 100);
assert.match(document.body.textContent!, /Completed by passing a full-course exam/);
assert.match(document.body.textContent!, /1 of 2 core lessons complete/);

// An empty learner/course must not inherit another learner's marks or invent 100% completion.
const empty = emptyCourse("New empty course");
empty.id = "empty";
api = { ...api, progress: emptyProgress(), student: { id: "second-learner" }, courses: [empty], banks: [] };
await mount(CourseProgress, empty);
assert.equal(document.querySelector("progress"), null);
assert.match(document.body.textContent!, /no core lessons to measure yet/);
assert.match(document.body.textContent!, /No completed sessions in this course/);
assert.doesNotMatch(document.body.textContent!, /Alpha fractions|Alpha questions|100% complete/);

// Profile changes also reset bounded history, so an earlier expanded view does not expose a huge list.
api = { ...api, progress: { ...emptyProgress(), attempts: Array.from({ length: 25 }, (_, i) => attempt(`many-${i}`)) }, courses: [course], banks: course.banks };
await mount();
assert.equal(document.querySelectorAll('[aria-label="Course session history"] tbody tr').length, 20);
await click("Show 5 more sessions");
assert.equal(document.querySelectorAll('[aria-label="Course session history"] tbody tr').length, 25);
api = { ...api, student: { id: "third-learner" } };
await mount();
assert.equal(document.querySelectorAll('[aria-label="Course session history"] tbody tr').length, 20);

// Cross-course prerequisites may inform readiness, but the displayed skill list belongs to this course.
const math = { ...course, id: "math-prealgebra", title: "Pre-algebra", banks: course.banks.map(bank => ({ ...bank, id: "math-prealgebra__questions", courseId: "math-prealgebra" })),
  lessons: [{ ...course.lessons[0], id: "pre-place-value", title: "Place-value lesson" }, { ...course.lessons[1], id: "pre-whole-ops", title: "Whole-number lesson" }] };
const algebra = { ...emptyCourse("Algebra"), id: "math-algebra1" };
let retries = 0;
api = { ...api, progress: emptyProgress(), courses: [math, algebra], banks: math.banks, competencySync: { pending: false, error: "" }, retryCompetencySync: () => { retries++; } };
await mount(CourseProgress, math);
assert.match(document.body.textContent!, /Skills in this course|Whole-number operations/);
assert.doesNotMatch(document.body.textContent!, /Linear equations|Slope and linear models/);
api = { ...api, competencySync: { pending: true, error: "" } };
await mount(CourseProgress, math);
assert.match(document.querySelector('[role="status"]')!.textContent!, /Updating course skill evidence/);
assert.doesNotMatch(document.body.textContent!, /Whole-number operations/);
api = { ...api, competencySync: { pending: false, error: "Synthetic interrupted sync" } };
await mount(CourseProgress, math);
assert.match(document.querySelector('[role="alert"]')!.textContent!, /Synthetic interrupted sync/);
await click("Retry course skills");
assert.equal(retries, 1);

await React.act(async () => root.unmount());
console.log("Course Progress: current content, course/profile isolation, exact result return, routes, completion basis, empty states, bounded history and skill sync states passed.");

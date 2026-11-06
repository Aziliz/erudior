import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import type { AppApi, View } from "../src/App.tsx";
import type { Course, Progress } from "../src/lib/types.ts";
import type { LearningPathway } from "../src/lib/learningPathways.ts";

const dom = new JSDOM('<!doctype html><div id="root"></div>', { url: "https://example.test" });
Object.assign(globalThis, {
  window: dom.window, document: dom.window.document, HTMLElement: dom.window.HTMLElement,
  HTMLInputElement: dom.window.HTMLInputElement, HTMLSelectElement: dom.window.HTMLSelectElement,
  localStorage: dom.window.localStorage, IS_REACT_ACT_ENVIRONMENT: true,
});
Object.defineProperty(globalThis, "navigator", { configurable: true, value: dom.window.navigator });
const React = await import("react");
const { createRoot } = await import("react-dom/client");
const { default: ProgressPage } = await import("../src/pages/ProgressPage.tsx");
const { emptyProgress } = await import("../src/lib/storage.ts");
const { emptyCourse } = await import("../src/lib/course.ts");
const { CATALOG } = await import("../src/lib/catalog.ts");
const { parseLearningPathways, LEARNING_PATHWAY_LIMITS } = await import("../src/lib/learningPathways.ts");

function course(id: string, title: string, count: number): Course {
  return {
    ...emptyCourse(title), id, modules: [{ id: "m", title: "Module" }],
    lessons: Array.from({ length: count }, (_, i) => ({ id: `lesson-${i + 1}`, module: "m", title: `${title} lesson ${i + 1}`, body: "" })),
  };
}
const alpha = course("local-algorithms", "Algorithms foundations", 2);
const beta = course("local-python", "Python foundations", 4);
const foreign = course("private-class", "Another learner's private course", 2);
const initial = emptyProgress();
initial.enrolled = [alpha.id, beta.id];
initial.lessonsDone = {
  [`${alpha.id}/lesson-1`]: "2026-10-29",
  ...Object.fromEntries(beta.lessons.map(lesson => [`${beta.id}/${lesson.id}`, "2026-10-29"])),
  [`${foreign.id}/lesson-1`]: "2026-10-29",
};
initial.plans = { [alpha.id]: { examDate: "2026-11-29", daysPerWeek: 5, newCardsPerDay: 10, createdAt: "2026-10-29T12:00:00.000Z" } };
const stored = new Map<string, Progress>([["alice", structuredClone(initial)], ["bob", emptyProgress()]]);
let selected = "alice";
let selection = 0;
let pauseNextWrite: Promise<void> | null = null;
const routes: View[] = [];
const toasts: string[] = [];
let api: AppApi;
const root = createRoot(document.getElementById("root")!);
const renderNow = () => root.render(React.createElement(ProgressPage, { api }));
const mount = () => React.act(async () => renderNow());

/** Same callback contract as the app: mutate the current saved path list, never a stale UI snapshot. */
function makeApi(profile: string, courses: Course[]): AppApi {
  const capturedSelection = selection;
  const value = {
    progress: structuredClone(stored.get(profile)!), courses, allCourses: [alpha, beta, foreign],
    banks: courses.flatMap(item => item.banks), family: {}, student: { id: profile, name: profile === "alice" ? "Alice" : "Bob" },
    go: (view: View) => { routes.push(view); }, toast: (message: string) => { toasts.push(message); },
    updateProgress: () => { throw Error("Pathway edits must use the dedicated persisted-state callback"); },
    updateLearningPathways: async (change: (paths: LearningPathway[]) => LearningPathway[]) => {
      const gate = pauseNextWrite;
      pauseNextWrite = null;
      if (gate) await gate;
      if (selected !== profile || selection !== capturedSelection) throw Error("The learner changed. Reopen the pathway.");
      const current = stored.get(profile)!;
      const paths = parseLearningPathways(change(parseLearningPathways(current.learningPathways)));
      stored.set(profile, { ...current, learningPathways: paths });
      if (selected === profile && selection === capturedSelection) {
        api = { ...api, progress: { ...api.progress, learningPathways: structuredClone(paths) } };
        renderNow();
      }
    },
  };
  return value as unknown as AppApi;
}
api = makeApi(selected, [alpha, beta]);

function button(text: string, scope: ParentNode = document): HTMLButtonElement {
  const found = [...scope.querySelectorAll<HTMLButtonElement>("button")].find(item => item.textContent?.trim() === text || item.getAttribute("aria-label") === text);
  assert(found, `Missing button: ${text}`);
  return found;
}
const click = (target: string | HTMLElement, scope: ParentNode = document) => React.act(async () => (typeof target === "string" ? button(target, scope) : target).click());
function field(label: string): HTMLInputElement | HTMLSelectElement {
  const aria = document.querySelector<HTMLInputElement | HTMLSelectElement>(`[aria-label="${label}"]`);
  if (aria) return aria;
  const wrapper = [...document.querySelectorAll("label")].find(item => item.querySelector("span")?.textContent === label);
  const found = wrapper?.querySelector<HTMLInputElement | HTMLSelectElement>("input,select");
  assert(found, `Missing field: ${label}`);
  return found;
}
async function fill(label: string, value: string) {
  const item = field(label);
  await React.act(async () => {
    Object.getOwnPropertyDescriptor(item.tagName === "SELECT" ? dom.window.HTMLSelectElement.prototype : dom.window.HTMLInputElement.prototype, "value")!.set!.call(item, value);
    item.dispatchEvent(new dom.window.Event(item.tagName === "SELECT" ? "change" : "input", { bubbles: true }));
  });
}
function card(title: string): HTMLElement {
  const found = document.querySelector<HTMLElement>(`article[aria-label="${title} progress"]`);
  assert(found, `Missing course card: ${title}`);
  return found;
}
function pathway(title: string): HTMLElement {
  const found = document.querySelector<HTMLElement>(`article[aria-label="${title} pathway"]`);
  assert(found, `Missing pathway: ${title}`);
  return found;
}
const visibleCourses = () => [...document.querySelectorAll(".enrolled-course-card h3")].map(item => item.textContent);
const unchangedWork = (value: Progress) => { const { learningPathways: _paths, ...work } = value; return work; };
const baseWork = structuredClone(unchangedWork(initial));

await mount();
assert.equal(document.querySelector("h1")?.textContent, "Courses", "the global enrollment overview is named Courses");
assert.deepEqual(visibleCourses(), [alpha.title, beta.title], "only the active learner's enrolled courses appear");
assert.equal(document.querySelectorAll(".progress-summary > div")[0].querySelector("strong")?.textContent, "2");
assert.equal(document.querySelectorAll(".progress-summary > div")[2].querySelector("strong")?.textContent, "75%");
assert.equal(card(alpha.title).querySelector("progress")?.value, 50);
assert.equal(card(beta.title).querySelector("progress")?.value, 100);
assert.doesNotMatch(document.body.textContent!, /Another learner's private course/);
assert.match(document.querySelector(".progress-tools-disclosure summary")!.textContent!, /Study tools, skill evidence, and data/);
assert.equal(document.querySelector<HTMLDetailsElement>(".progress-tools-disclosure")!.open, false, "advanced capabilities are retained behind a closed disclosure");
await click("Course progress", card(alpha.title));
assert.deepEqual(routes.pop(), { name: "course", courseId: alpha.id, tab: "progress" });
await click("Continue", card(alpha.title));
assert.deepEqual(routes.pop(), { name: "lesson", courseId: alpha.id, lessonId: "lesson-2" });
await fill("Filter enrolled courses", "complete");
assert.deepEqual(visibleCourses(), [beta.title]);
await fill("Filter enrolled courses", "active");
assert.deepEqual(visibleCourses(), [alpha.title]);
await fill("Filter enrolled courses", "all");

// Create a cross-subject ordered plan from actual enrolled/local courses.
await click("Create a pathway");
assert.equal(field("Pathway name").getAttribute("maxlength"), String(LEARNING_PATHWAY_LIMITS.title));
assert.equal(document.activeElement, field("Pathway name"));
assert.equal([...field("Add a course").querySelectorAll("option")].some(option => option.value === foreign.id), false, "another learner's shared local course is not offered");
await fill("Pathway name", "Data science plan");
await fill("Add a course", alpha.id); await click("Add course");
await fill("Add a course", beta.id); await click("Add course");
await click(`Move ${beta.title} up`);
await click("Save pathway");
let custom = stored.get("alice")!.learningPathways!.find(path => path.title === "Data science plan")!;
assert(custom);
assert.deepEqual(custom.courseIds, [beta.id, alpha.id]);
assert.equal(pathway(custom.title).querySelector("progress")?.value, 75);
assert.match(pathway(custom.title).textContent!, /1 of 2 courses completed/);
assert.deepEqual(unchangedWork(stored.get("alice")!), baseWork, "following a pathway does not enroll courses or alter completed work");
await click("Continue course", pathway(custom.title));
assert.deepEqual(routes.pop(), { name: "lesson", courseId: alpha.id, lessonId: "lesson-2" });
await click(pathway(custom.title).querySelector("summary")!);
await click("View progress", pathway(custom.title));
assert.deepEqual(routes.pop(), { name: "course", courseId: beta.id, tab: "progress" });

// Editing supports renaming, removing and re-adding steps, and explicit ordering.
await click("Edit pathway", pathway(custom.title));
await fill("Pathway name", "My data science sequence");
await click(`Move ${beta.title} down`);
await click(`Remove ${alpha.title} from pathway`);
await fill("Add a course", alpha.id); await click("Add course");
await click("Save pathway");
custom = stored.get("alice")!.learningPathways!.find(path => path.id === custom.id)!;
assert.equal(custom.title, "My data science sequence");
assert.deepEqual(custom.courseIds, [beta.id, alpha.id]);
assert.deepEqual(unchangedWork(stored.get("alice")!), baseWork);

// A real seven-course starter is an explicit plan; its unstarted courses remain out of enrollment.
const mathSuggestion = [...document.querySelectorAll<HTMLElement>(".pathway-suggestion")].find(item => item.querySelector("h3")?.textContent === "Math foundations")!;
assert(mathSuggestion);
await click(mathSuggestion.querySelector("button")!);
const math = stored.get("alice")!.learningPathways!.find(path => path.id === "math-foundations")!;
assert.equal(math.courseIds.length, 7);
assert.equal(pathway(math.title).querySelector("progress")?.value, 0);
assert.deepEqual(stored.get("alice")!.enrolled, [alpha.id, beta.id]);
assert.deepEqual(visibleCourses(), [alpha.title, beta.title]);
await click("View next course", pathway(math.title));
assert.deepEqual(routes.pop(), { name: "overview", catalogId: "math-prealgebra" });
await click("Stop following", pathway(custom.title));
assert.equal(stored.get("alice")!.learningPathways!.some(path => path.id === custom.id), false);
assert.equal(stored.get("alice")!.learningPathways!.some(path => path.id === math.id), true);
assert.deepEqual(unchangedWork(stored.get("alice")!), baseWork);

// Concurrent changes are checked against persisted state rather than the rendered snapshot.
stored.set("alice", { ...stored.get("alice")!, learningPathways: [{ id: "shared-plan", title: "Saved plan", courseIds: [alpha.id, beta.id] }] });
api = makeApi("alice", [alpha, beta]); await mount();
await click("Edit pathway", pathway("Saved plan"));
await fill("Pathway name", "Unsaved local edit");
stored.set("alice", { ...stored.get("alice")!, learningPathways: [{ id: "shared-plan", title: "Edited elsewhere", courseIds: [beta.id, alpha.id] }] });
await click("Save pathway");
assert.match(document.querySelector('[role="alert"]')!.textContent!, /This pathway changed/);
assert.equal(stored.get("alice")!.learningPathways![0].title, "Edited elsewhere");
assert.equal(field("Pathway name").value, "Unsaved local edit", "failed stale edits retain the draft for review");
assert.deepEqual(unchangedWork(stored.get("alice")!), baseWork);
await click("Cancel");

// A pending save cannot follow a profile switch, and the next profile is not stuck busy.
stored.set("alice", { ...stored.get("alice")!, learningPathways: [] });
api = makeApi("alice", [alpha, beta]); await mount();
let release!: () => void;
pauseNextWrite = new Promise<void>(resolve => { release = resolve; });
const delayedStarter = [...document.querySelectorAll<HTMLElement>(".pathway-suggestion")].find(item => item.querySelector("h3")?.textContent === "Math foundations")!;
await click(delayedStarter.querySelector("button")!);
assert.equal(button("Create a pathway").disabled, true);
selected = "bob"; selection++;
api = makeApi("bob", []); await mount();
assert.equal(button("Create a pathway").disabled, false);
assert.equal(document.querySelector(".pathway-editor"), null);
assert.doesNotMatch(document.body.textContent!, /Unsaved local edit|Saved plan|Algorithms foundations|Python foundations/);
const toastCount = toasts.length;
await React.act(async () => { release(); await Promise.resolve(); });
assert.equal(stored.get("bob")!.learningPathways, undefined);
assert.deepEqual(stored.get("alice")!.learningPathways, []);
assert.equal(toasts.length, toastCount, "an old profile's save cannot report success in the new profile");

// Missing custom content stays visible as an unavailable step, with no misleading launch button.
stored.set("bob", { ...emptyProgress(), learningPathways: [{ id: "archived", title: "Archived pathway", courseIds: [foreign.id] }] });
api = makeApi("bob", []); await mount();
const archived = pathway("Archived pathway");
assert.equal(archived.querySelector("progress")?.value, 0);
assert.match(archived.textContent!, /Course unavailable/);
assert.equal([...archived.querySelectorAll("button")].some(item => /View next course|Continue course|View course/.test(item.textContent ?? "")), false);
assert.doesNotMatch(archived.textContent!, /Another learner's private course|Pathway complete/);

// Empty enrollment offers a useful next step and never invents 100% completion.
stored.set("bob", emptyProgress()); api = makeApi("bob", []); await mount();
assert.match(document.body.textContent!, /Your learning starts with a course/);
assert.equal(document.querySelectorAll(".progress-summary > div")[0].querySelector("strong")?.textContent, "0");
assert.equal(document.querySelectorAll(".progress-summary > div")[2].querySelector("strong")?.textContent, "—");
await click("Browse courses");
assert.deepEqual(routes.pop(), { name: "library" });

// The partially released JD program follows the same explicit, profile-scoped lifecycle.
const { STUDY_PROGRAMS, programPathway } = await import("../src/lib/studyPrograms");
const jd = STUDY_PROGRAMS[0];
const availableProgramCount = programPathway(jd).courseIds.filter(id => CATALOG.some(c => c.id === id)).length;
const programCard = () => document.querySelector<HTMLElement>('article[aria-label="J.D. Preparation program"]')!;
assert.match(programCard().textContent!, /25 courses/);
assert(programCard().textContent!.includes(`${availableProgramCount} of 25 courses available`));
assert.equal(programCard().querySelectorAll('button').length, availableProgramCount + 1, "follow plus released course actions");
await click(programCard().querySelector('button')!);
assert.deepEqual(stored.get('bob')!.learningPathways, [programPathway(jd)]);
assert.equal(stored.get('bob')!.enrolled?.length ?? 0, 0);
const jdPath = pathway(jd.title);
assert.match(jdPath.textContent!, /LSAT 180 Mastery/);
assert.match(jdPath.textContent!, /Planned; not yet published/);
assert.equal(jdPath.querySelector('progress')?.value, 0);
assert.equal(jdPath.querySelectorAll('.study-program progress').length, 3, "each stage has its own progress");
assert.equal(jdPath.querySelectorAll('.pathway-step button').length, availableProgramCount, 'only released steps can be opened');
assert.equal([...jdPath.querySelectorAll('.study-program button')].length, availableProgramCount, 'planned outlines have no course action');
await click('View next course', jdPath);
assert.deepEqual(routes.pop(), { name: 'overview', catalogId: 'lsat-180-mastery' });
assert.equal(stored.get('bob')!.enrolled?.length ?? 0, 0, 'viewing a course does not enroll');
await click(jdPath.querySelectorAll<HTMLButtonElement>('.study-program button')[1]);
assert.deepEqual(routes.pop(), { name: 'overview', catalogId: 'law-us-legal-system' });
await click(jdPath.querySelectorAll<HTMLButtonElement>('.study-program button')[2]);
assert.deepEqual(routes.pop(), { name: 'overview', catalogId: 'law-case-reading' });
const writingSection = [...jdPath.querySelectorAll<HTMLElement>('.study-program details')].find(e => e.querySelector('summary')?.textContent?.includes('Legal Writing I: Objective Analysis'));
assert(writingSection, 'writing course remains in the program outline');
await click(writingSection.querySelector('button')!);
assert.deepEqual(routes.pop(), { name: 'overview', catalogId: 'law-legal-writing-1' });
const advocacySection = [...jdPath.querySelectorAll<HTMLElement>('.study-program details')].find(e => e.querySelector('summary')?.textContent?.includes('Legal Writing II: Persuasion and Advocacy'));
assert(advocacySection, 'advocacy course remains in the program outline');
await click(advocacySection.querySelector('button')!);
assert.deepEqual(routes.pop(), { name: 'overview', catalogId: 'law-legal-writing-2' });
const contractsSection = [...jdPath.querySelectorAll<HTMLElement>('.study-program details')].find(e => e.querySelector('summary')?.textContent?.includes('Contracts I: Formation and Interpretation'));
assert(contractsSection, 'Contracts I remains in the Stage 2 outline');
await click(contractsSection.querySelector('button')!);
assert.deepEqual(routes.pop(), { name: 'overview', catalogId: 'law-contracts-1' });
assert.equal(stored.get('bob')!.enrolled?.length ?? 0, 0, 'viewing the second course does not enroll');
api = makeApi('bob', []);await mount();
assert.equal(pathway(jd.title).querySelector('progress')?.value, 0, "saved program survives remount");
await click('Edit pathway', pathway(jd.title));
assert.doesNotMatch(document.querySelector('.pathway-editor')!.textContent!, /LSAT 180 Mastery \(planned\)/);
assert.doesNotMatch(document.querySelector('.pathway-editor')!.textContent!, /Introduction to the U.S. Legal System \(planned\)/);
assert.doesNotMatch(document.querySelector('.pathway-editor')!.textContent!, /Case Reading and Legal Reasoning \(planned\)/);
assert.doesNotMatch(document.querySelector('.pathway-editor')!.textContent!, /Legal Writing I: Objective Analysis \(planned\)/);
assert.doesNotMatch(document.querySelector('.pathway-editor')!.textContent!, /Legal Writing II: Persuasion and Advocacy \(planned\)/);
assert.doesNotMatch(document.querySelector('.pathway-editor')!.textContent!, /Contracts I: Formation and Interpretation \(planned\)/);
assert.match(document.querySelector('.pathway-editor')!.textContent!, /Contracts II: Performance, Breach and Remedies \(planned\)/);
await click('Move Legal Writing II: Persuasion and Advocacy up');
await click('Save pathway');
assert.equal(pathway(jd.title).querySelector('.study-program'), null, "custom course order does not inherit canonical stage progress");
assert.match(programCard().textContent!, /customized version/);
await click('Stop following', pathway(jd.title));
assert.deepEqual(stored.get('bob')!.learningPathways, []);
assert.equal(stored.get('bob')!.enrolled?.length ?? 0, 0);
// A delayed program save is cancelled when the selected profile changes.
pauseNextWrite = new Promise<void>(resolve => { release = resolve; });
await click(programCard().querySelector('button')!);
selected = 'alice'; selection++; api = makeApi('alice', [alpha,beta]); await mount();
await React.act(async () => { release(); await Promise.resolve(); });
assert.deepEqual(stored.get('bob')!.learningPathways, []);
assert.deepEqual(stored.get('alice')!.learningPathways, []);

await React.act(async () => root.unmount());
console.log("Enrollment Progress UI: learner-scoped courses and averages, navigation and filters, explicit ordered pathway lifecycle, fresh-state edit conflicts, unavailable content, profile-switch guards and empty states passed.");

import { emptyCourse, exportCourseSnapshot, importCourseSnapshot } from "../src/lib/course.ts";
import { importValidatedCourseSnapshot, validateCourseIntegrity } from "../src/lib/courseIntegrity.ts";

const base = emptyCourse("Integrity test");
base.lessons = [{ id: "l1", module: "m1", title: "Intro", topics: [], body: "Hello" }];
function assert(name: string, value: boolean) {
  if (!value) throw new Error(name);
  console.log("PASS", name);
}
assert("valid course", validateCourseIntegrity(base).length === 0);
assert("missing module", validateCourseIntegrity({ ...base, lessons: [{ ...base.lessons[0], module: "missing" }] }).some((i) => i.path === "lessons[0].module"));
assert("duplicate lesson ID", validateCourseIntegrity({ ...base, lessons: [base.lessons[0], base.lessons[0]] }).some((i) => i.message.includes("Duplicate ID")));
assert("missing quiz question", validateCourseIntegrity({ ...base, lessons: [{ ...base.lessons[0], quiz: ["missing"] }] }).some((i) => i.message.includes("Question not found")));
assert("missing drill", validateCourseIntegrity({ ...base, lessons: [{ ...base.lessons[0], drills: ["missing"] }] }).some((i) => i.message.includes("Unknown drill")));
assert("missing reference", validateCourseIntegrity({ ...base, lessons: [{ ...base.lessons[0], refs: ["missing"] }] }).some((i) => i.message.includes("Unknown reference")));
assert("reader duplicate section IDs", validateCourseIntegrity({
  ...base,
  texts: [{ id: "text1", title: "Book", sections: [{ id: "s1", title: "One", body: "A" }, { id: "s1", title: "Two", body: "B" }] }],
}).some((i) => i.message.includes("Duplicate ID")));
assert("non-mutating validation", base.lessons[0].module === "m1");

const portable = exportCourseSnapshot(base);
assert("deterministic snapshot", portable === exportCourseSnapshot(base));
const restored = importCourseSnapshot(portable);
assert("portable import stable", exportCourseSnapshot(restored) === portable);
assert("portable snapshot does not mutate course", base.lessons[0].id === "l1");
let rejected = false;
try { importCourseSnapshot(JSON.stringify({ ...base, version: 2 })); } catch { rejected = true; }
assert("unsupported schema rejected", rejected);

assert("validated snapshot imports", importValidatedCourseSnapshot(portable).lessons.length === 1);
let rejectedRefs = false;
try {
  importValidatedCourseSnapshot(JSON.stringify({ ...base, lessons: [{ ...base.lessons[0], quiz: ["absent"] }] }));
} catch (e) { rejectedRefs = String(e).includes("Question not found"); }
assert("checked import rejects missing question references", rejectedRefs);

let rejectedDanglingModule = false;
try { importValidatedCourseSnapshot(JSON.stringify({ ...base, lessons: [{ ...base.lessons[0], module: "missing" }] })); }
catch (e) { rejectedDanglingModule = String(e).includes("module"); }
assert("import rejects missing module before normalization", rejectedDanglingModule);

// The App's common saveCourse boundary uses this validation for standalone bank
// saves/deletions as well as the course editor. First-bank reader links are not
// interchangeable with a coincidentally equal ID in a different bank.
const readerLinked = { ...base, banks: [
  { format: 'examiner-bank', version: 1, id: 'main', title: 'Main', sections: [], exam: { questionCount: 1, timeLimitMinutes: 5, passingPercent: 70 }, questions: [{ id: 'q1', stem: 'Read?', topic: 'Reading', choices: ['A','B'], answer: [0] }] },
  { format: 'examiner-bank', version: 1, id: 'other', title: 'Other', sections: [], exam: { questionCount: 1, timeLimitMinutes: 5, passingPercent: 70 }, questions: [] },
], texts: [{ id: 'text', title: 'Read', kind: 'prose', sections: [{ id: 'section', title: 'Section', body: 'A passage.', questions: ['q1'] }] }] } as any;
assert('reader links valid before bank edit', validateCourseIntegrity(readerLinked).length === 0);
assert('bank edit cannot delete reader question', validateCourseIntegrity({ ...readerLinked, banks: [{ ...readerLinked.banks[0], questions: [] }, readerLinked.banks[1]] }).some(i => i.path === 'texts'));
assert('bank deletion cannot orphan reader', validateCourseIntegrity({ ...readerLinked, banks: [readerLinked.banks[1]] }).some(i => i.path === 'texts'));
assert('reader cannot silently relink to another bank', validateCourseIntegrity({ ...readerLinked, banks: [{ ...readerLinked.banks[0], questions: [] }, { ...readerLinked.banks[1], questions: readerLinked.banks[0].questions }] }).some(i => i.path === 'texts'));

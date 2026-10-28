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

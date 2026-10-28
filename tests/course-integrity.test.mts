import { emptyCourse } from "../src/lib/course.ts";
import { validateCourseIntegrity } from "../src/lib/courseIntegrity.ts";

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

import { emptyCourse } from "../src/lib/course.ts";
import { compareCourseRevisions } from "../src/lib/courseRevision.ts";
const original = emptyCourse("Versioned test");
original.revision = 1;
original.lessons = [{ id: "intro", module: "m1", title: "Introduction", topics: [], body: "Start" }];
const next = structuredClone(original);
next.revision = 2;
function check(label: string, pass: boolean) { if (!pass) throw new Error(label); console.log("PASS", label); }
check("safe revision", compareCourseRevisions(original, next).length === 0);
check("revision must increase", compareCourseRevisions(original, original).some((i) => i.path === "revision" && i.severity === "blocking"));
check("course ID immutable", compareCourseRevisions(original, { ...next, id: "different" }).some((i) => i.path === "id"));
check("old lesson cannot vanish", compareCourseRevisions(original, { ...next, lessons: [] }).some((i) => i.path === "lessons.intro" && i.severity === "blocking"));
check("moved lesson warns", compareCourseRevisions(original, { ...next, modules: [...next.modules, { id: "m2", title: "Second" }], lessons: [{ ...next.lessons[0], module: "m2" }] }).some((i) => i.path === "lessons.intro" && i.severity === "warning"));
check("new lesson permitted", compareCourseRevisions(original, { ...next, lessons: [...next.lessons, { id: "next", module: "m1", title: "Next", topics: [], body: "Next" }] }).length === 0);

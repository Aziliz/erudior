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

const oldWithDrill = structuredClone(original);
oldWithDrill.drills = [{ id: "drill1", title: "Practice", vars: {}, prompt: "2+2", answer: "4", format: "number", solution: "4" }];
const newWithoutDrill = { ...oldWithDrill, revision: 2, drills: [] };
check("removed drill blocks revision", compareCourseRevisions(oldWithDrill, newWithoutDrill).some((i) => i.path === "drills.drill1" && i.severity === "blocking"));
const oldWithReader = structuredClone(original);
oldWithReader.texts = [{ id: "reader1", title: "Text", sections: [{ id: "section1", title: "Chapter", body: "Text" }] }];
const newWithoutSection = { ...oldWithReader, revision: 2, texts: [{ id: "reader1", title: "Text", sections: [] }] };
check("removed reader section blocks revision", compareCourseRevisions(oldWithReader, newWithoutSection).some((i) => i.path === "texts.reader1.sections.section1" && i.severity === "blocking"));

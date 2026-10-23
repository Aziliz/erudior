// Homeschool records: letter grades, course percents, GPA, report placement by school year,
// transcript and the state progress report.
import { cutoffProblem, coursePercent, gradeParts, letterFor, weightedPoints, MIN_CUTOFFS, DEFAULT_WEIGHTS } from "../src/lib/grades.ts";
import { compliance, coursesInYear, quarters, reportCard, transcript, yearOf, type StudentData } from "../src/lib/reports.ts";
import { emptyRecords } from "../src/lib/records.ts";
import type { Family } from "../src/lib/family.ts";
import type { Attempt, Progress } from "../src/lib/types.ts";

let fails = 0;
const ok = (name: string, cond: boolean, extra?: unknown) => {
  if (!cond) {
    fails++;
    console.log("FAIL", name, extra ?? "");
  }
};
const near = (a: number | undefined, b: number) => a !== undefined && Math.abs(a - b) < 1e-6;

// ---- letters ----
const L = (p: number) => letterFor(p);
ok("A+", L(97) === "A+" && L(100) === "A+");
ok("A", L(96) === "A" && L(93) === "A");
ok("A-", L(92) === "A-" && L(90) === "A-" && L(89.6) === "A-");
ok("B+/B/B-", L(89) === "B+" && L(85) === "B" && L(80) === "B-");
ok("D-/F", L(60) === "D-" && L(59.4) === "F" && L(0) === "F");
const strict = { A: 93, B: 85, C: 77, D: 70 };
ok("stricter scale", letterFor(92, strict) === "B+" && letterFor(93, strict) === "A-" && letterFor(69, strict) === "F");
ok("default scale ok", cutoffProblem(MIN_CUTOFFS) === null && cutoffProblem(strict) === null);
ok("looser refused", cutoffProblem({ A: 89, B: 80, C: 70, D: 60 })?.includes("stricter") === true);
ok("D looser refused", cutoffProblem({ A: 90, B: 80, C: 70, D: 55 }) !== null);
ok("order enforced", cutoffProblem({ A: 90, B: 90, C: 70, D: 60 }) !== null);
ok("above 100 refused", cutoffProblem({ A: 101, B: 80, C: 70, D: 60 }) !== null);
ok("weighted points", weightedPoints("B", "honors") === 3.5 && weightedPoints("A", "ap") === 5 && weightedPoints("F", "ap") === 0);

// ---- course percent ----
let n = 0;
const att = (course: string, correct: number, total: number, date: string, extra: Partial<Attempt> = {}): Attempt => ({
  id: `a${n++}`,
  bankId: `${course}__main`,
  bankTitle: "Main",
  mode: "practice",
  startedAt: `${date}T10:00:00.000Z`,
  finishedAt: `${date}T10:20:00.000Z`,
  durationSec: 1200,
  total,
  answered: total,
  correct,
  byTopic: {},
  bySection: {},
  answers: [],
  ...extra,
});
const C = "math-algebra1";
const progress: Progress = {
  version: 1,
  seeded: true,
  stats: {},
  cards: {},
  plans: {},
  activity: {},
  drills: {},
  lessonsDone: { [`${C}/l1`]: "2026-09-02", [`${C}/l2`]: "2026-09-20", "math-prealgebra/p1": "2026-03-01" },
  attempts: [
    att(C, 6, 10, "2026-09-02", { lesson: { courseId: C, lessonId: "l1" } }),
    att(C, 9, 10, "2026-09-03", { lesson: { courseId: C, lessonId: "l1" } }), // best for l1 = 90
    att(C, 7, 10, "2026-09-20", { lesson: { courseId: C, lessonId: "l2" } }), // l2 = 70
    att(C, 16, 20, "2026-10-01", { module: { courseId: C, moduleId: "m1" } }), // 80
    att(C, 40, 50, "2026-10-05", { mode: "exam" }), // 80 (not a pass for the whole course; lessons not all done)
    att(C, 20, 50, "2026-10-02", { mode: "exam" }),
    att(C, 5, 10, "2026-10-04"), // plain practice: ignored
    att("math-prealgebra", 45, 50, "2026-04-10", { mode: "exam", passingPercent: 70 }), // 90, passes → finished in 2025–26
  ],
};
const parts = gradeParts(C, progress, [{ id: "g", courseId: C, date: "2026-09-15", title: "Worksheet", percent: 100 }]);
ok("lesson best then mean", near(parts.lessons, 80) && parts.counts.lessons === 2, parts);
ok("module and final best", near(parts.modules, 80) && near(parts.final, 80));
ok("parent grade", near(parts.parent, 100));
ok("weighted course percent", near(coursePercent(parts, DEFAULT_WEIGHTS), (80 * 25 + 80 * 35 + 80 * 25 + 100 * 15) / 100));
ok("missing parts renormalize", near(coursePercent({ lessons: 90, counts: { lessons: 1, modules: 0, final: 0, parent: 0 } }), 90));
ok("nothing graded", coursePercent({ counts: { lessons: 0, modules: 0, final: 0, parent: 0 } }) === undefined);
ok("until date limits", near(gradeParts(C, progress, [], "2026-09-10").lessons, 90));

// ---- school years and reports ----
const family: Family = {
  format: "examiner-family",
  version: 1,
  state: "NY",
  route: "Home education law",
  year: { start: "2026-08-01", end: "2027-07-31" },
  dailyMinutes: 180,
  parent: { password: { salt: "", hash: "", iterations: 1 }, recovery: { salt: "", hash: "", iterations: 1 } },
  students: [{ id: "kim", name: "Kim", grade: 10, assigned: [{ courseId: C, subject: "Math" }], freeChoice: true }],
  reminders: [],
  done: [],
  school: { name: "Pine Hill School", administrator: "Pat Doe", address: "" },
};
ok("yearOf current", yearOf(family, "2026-12-01").from === "2026-08-01");
ok("yearOf past", yearOf(family, "2026-04-10").from === "2025-08-01" && yearOf(family, "2026-04-10").to === "2026-07-31");
const q = quarters(family);
ok("quarters contiguous", q[0].from === family.year.start && q[3].to === family.year.end && q.every((x, i) => i === 0 || x.from > q[i - 1].to));

const records = {
  ...emptyRecords(),
  time: { "2026-09-02": { [C]: 2 * 3600 }, "2026-04-10": { "math-prealgebra": 3600 } },
  days: { "2026-09-02": "present" as const },
  courses: { "math-prealgebra": { gradeLevel: 9 } },
  outside: [{ id: "o", title: "Biology", subject: "Science", yearStart: "2025-08-01", gradeLevel: 9, percent: 85, credits: 1, level: "honors" as const, where: "Co-op" }],
};
const d: StudentData = { family, student: family.students[0], progress: { ...progress, enrolled: [C, "math-prealgebra"] }, records, courses: [] };
const thisYear = coursesInYear(d, "2026-08-01");
const lastYear = coursesInYear(d, "2025-08-01");
ok("in-progress course this year", thisYear.length === 1 && thisYear[0].courseId === C && thisYear[0].status === "in progress", thisYear);
ok("finished course in the year it finished", lastYear.length === 1 && lastYear[0].courseId === "math-prealgebra" && lastYear[0].status === "finished", lastYear);
const rc = reportCard(d, "2026-08-01");
ok("report card days/hours", rc.daysPresent === 1 && near(rc.hours, 2) && rc.gradeLevel === 10);

const t = transcript(d);
ok("transcript years", t.years.length === 2 && t.years[0].year.from === "2025-08-01", t.years);
ok("transcript year 1 has prealgebra + outside biology", t.years[0].lines.length === 2);
// Prealgebra: final 90 only → 90 A- (3.7), 1 credit (High school level); Biology 85 B (3.0), honors +0.5.
ok("credits earned", t.credits === 2, t.credits);
ok("GPA", near(t.gpa, (3.7 + 3.0) / 2) && near(t.weightedGpa, (3.7 + 3.5) / 2), t);
ok("in progress listed, not counted", t.years[1].lines[0].status === "in progress" && t.years[1].credits === 0);

const c = compliance(d, { from: "2026-08-01", to: "2026-10-31", label: "Quarter 1" });
const math = c.material.get("Math") ?? [];
ok("material covered", math.length === 1 && math[0].lessons.map((l) => l.date).join() === "2026-09-02,2026-09-20", math);
ok("tests in period", math[0].tests.length === 3, math[0].tests);
ok("hours and days", near(c.hours, 2) && c.daysPresent === 1 && c.needHours === 990);
ok("grades to date", c.grades.length === 1 && c.grades[0].courseId === C);

if (fails) {
  console.log(`${fails} records test(s) failed`);
  process.exit(1);
}
console.log("records tests passed");

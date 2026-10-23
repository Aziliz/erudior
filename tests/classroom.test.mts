// Classroom mode: class files, signed hand-ins, merging work into the teacher's copy.
import { classFile, makeHandIn, mergeWork, parseClassFile, stableJson, verifyHandIn, workFor } from "../src/lib/classroom.ts";
import { newClass, newStudent, type Family } from "../src/lib/family.ts";
import type { Attempt, Progress } from "../src/lib/types.ts";

let fails = 0;
const ok = (name: string, cond: boolean, extra?: unknown) => {
  if (!cond) {
    fails++;
    console.log("FAIL", name, extra ?? "");
  }
};
const throwsAsync = async (fn: () => Promise<unknown>, re: RegExp) => {
  try {
    await fn();
    return false;
  } catch (e) {
    return re.test((e as Error).message);
  }
};

ok("stable json sorts keys", stableJson({ b: 1, a: [{ d: 2, c: undefined, b: "x" }] }) === '{"a":[{"b":"x","d":2}],"b":1}');

const ana = newStudent("Ana", 7);
const ben = newStudent("Ben", 7);
const cls = newClass("Period 3", [ana.id, ben.id]);
cls.assignments = [{ courseId: "math-algebra1", due: "2026-11-01", assigned: "2026-10-01" }];
const other = newClass("Period 5", [ben.id]);
const fam = {
  format: "examiner-family",
  version: 1,
  mode: "classroom",
  classes: [cls, other],
  state: "",
  route: "",
  year: { start: "2026-08-01", end: "2027-07-31" },
  dailyMinutes: 180,
  parent: { password: { salt: "", hash: "", iterations: 1 }, recovery: { salt: "", hash: "", iterations: 1 } },
  students: [ana, ben],
  reminders: [],
  done: [],
  school: { name: "Lincoln MS", administrator: "Ms. Ruiz", address: "" },
} as Family;

const file = parseClassFile(JSON.parse(JSON.stringify(classFile(fam, cls, () => "Algebra 1"))));
ok("class file", file.name === "Period 3" && file.teacher === "Ms. Ruiz" && file.students.map((s) => s.name).join() === "Ana,Ben" && file.assignments[0].title === "Algebra 1");
ok("not a class file", await throwsAsync(async () => parseClassFile({ format: "x" }), /class file/));

const att = (id: string, bank: string, extra: Partial<Attempt> = {}): Attempt => ({
  id,
  bankId: bank,
  bankTitle: "b",
  mode: "practice",
  startedAt: "2026-10-05T10:00:00Z",
  finishedAt: "2026-10-05T10:10:00Z",
  durationSec: 600,
  total: 10,
  answered: 10,
  correct: 8,
  byTopic: {},
  bySection: {},
  answers: [],
  ...extra,
});
const studentProgress = {
  version: 1,
  seeded: true,
  stats: {},
  cards: {},
  plans: {},
  activity: {},
  attempts: [att("a1", "math-algebra1__main"), att("x1", "lang-german-a1__main")],
  lessonsDone: { "math-algebra1/l1": "2026-10-05", "lang-german-a1/g1": "2026-10-04" },
  modulesDone: { "math-algebra1/m1": "2026-10-06" },
  drills: { "math-algebra1/d1": { attempts: 5, correct: 4 }, "math-geometry/d9": { attempts: 1, correct: 1 } },
} as Progress;

const w = workFor(studentProgress, ["math-algebra1"]);
ok("only assigned courses handed in", w.attempts.length === 1 && Object.keys(w.lessonsDone).join() === "math-algebra1/l1" && Object.keys(w.drills).join() === "math-algebra1/d1");

const h = await makeHandIn(file, ana.id, studentProgress);
const v = await verifyHandIn(JSON.parse(JSON.stringify(h)), fam);
ok("hand-in verifies", v.cls.id === cls.id && v.h.studentName === "Ana");
ok("needs a name on the roster", await throwsAsync(() => makeHandIn(file, "nobody", studentProgress), /Pick your name/));
const tampered = JSON.parse(JSON.stringify(h));
tampered.progress.attempts[0].correct = 10;
ok("edited file refused", await throwsAsync(() => verifyHandIn(tampered, fam), /changed/));
const renamed = { ...JSON.parse(JSON.stringify(h)), studentId: ben.id };
ok("swapped student refused", await throwsAsync(() => verifyHandIn(renamed, fam), /changed/));
const elsewhere = { ...JSON.parse(JSON.stringify(h)), classId: "zzz" };
ok("unknown class refused", await throwsAsync(() => verifyHandIn(elsewhere, fam), /isn't on this computer/));
const notOnRoster = { ...fam, classes: [{ ...cls, students: [ben.id] }, other] } as Family;
ok("student removed from roster refused", await throwsAsync(() => verifyHandIn(JSON.parse(JSON.stringify(h)), notOnRoster), /roster/));
const rekeyed = { ...fam, classes: [{ ...cls, secret: newClass("x").secret }, other] } as Family;
ok("wrong class secret refused", await throwsAsync(() => verifyHandIn(JSON.parse(JSON.stringify(h)), rekeyed), /changed/));

// Merging into the teacher's copy (which already has some work from the shared computer).
const teacher = {
  ...studentProgress,
  attempts: [att("a0", "math-algebra1__main", { finishedAt: "2026-10-01T10:00:00Z" }), att("a1", "math-algebra1__main")],
  lessonsDone: { "math-algebra1/l1": "2026-10-02" },
  modulesDone: {},
  drills: { "math-algebra1/d1": { attempts: 9, correct: 9 } },
  enrolled: [],
} as Progress;
const m = mergeWork(teacher, h.progress, h.courses);
ok("attempts unioned, no duplicates", m.attempts.map((a) => a.id).sort().join() === "a0,a1");
ok("earliest completion kept", m.lessonsDone["math-algebra1/l1"] === "2026-10-02" && m.modulesDone?.["math-algebra1/m1"] === "2026-10-06");
ok("drill tallies keep the larger", m.drills["math-algebra1/d1"].attempts === 9);
ok("course enrolled", m.enrolled?.includes("math-algebra1"));

if (fails) {
  console.log(`${fails} classroom test(s) failed`);
  process.exit(1);
}
console.log("classroom tests passed");

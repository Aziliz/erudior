// Classroom mode: class files, signed hand-ins, merging work into the teacher's copy.
import { classFile, parseHandIn, validateHandIn, makeHandIn, mergeWork, parseClassFile, stableJson, verifyHandIn, workFor } from "../src/lib/classroom.ts";
import { createSpreadsheetSubmission } from "../src/lib/spreadsheetEvidence.ts";
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


// A valid HMAC is not schema validation: students possess the shared class secret.
const signed = async (raw: any) => {
  const { mac: _mac, ...body } = raw;
  const key = await crypto.subtle.importKey("raw", Uint8Array.from(atob(cls.secret), c => c.charCodeAt(0)), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return { ...body, mac: btoa(String.fromCharCode(...new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(stableJson(body)))))) };
};
const malformed = [
  { ...h, version: 2 },
  { ...h, progress: { ...h.progress, reviews: {} } },
  { ...h, progress: { ...h.progress, grades: [] } },
  { ...h, progress: { ...h.progress, attempts: {} } },
  { ...h, progress: { ...h.progress, attempts: [{ ...h.progress.attempts[0], correct: -1 }] } },
  { ...h, progress: { ...h.progress, attempts: [{ ...h.progress.attempts[0], correct: 99 }] } },
  { ...h, progress: { ...h.progress, attempts: [...h.progress.attempts, ...h.progress.attempts] } },
  { ...h, progress: { ...h.progress, attempts: [{ ...h.progress.attempts[0], lesson: { courseId: "other", lessonId: "l1" } }] } },
  { ...h, progress: { ...h.progress, lessonsDone: { "other/l1": "2026-10-01" } } },
  { ...h, progress: { ...h.progress, modulesDone: { "math-algebra1/": "2026-10-01" } } },
  { ...h, progress: { ...h.progress, drills: { "math-algebra1/d1": { attempts: 1, correct: 2 } } } },
  { ...h, progress: { ...h.progress, work: { "other/w1": { kind: "writing", started: h.created, updated: h.created } } } },
  { ...h, progress: { ...h.progress, work: { "math-algebra1/w1": { kind: "writing", started: h.created, updated: h.created, submitted: "not a date" } } } },
  { ...h, progress: { ...h.progress, logs: [{ id: "log1", courseId: "other", date: "2026-10-01", minutes: 10, type: "art", note: "" }] } },
  { ...h, files: { f1: { mime: "text/plain", data: "eA==" } } },
  { ...h, courses: [...h.courses, ...h.courses] },
  { ...h, created: "2026-02-30" },
  { ...h, progress: JSON.parse('{"attempts":[],"lessonsDone":{},"__proto__":{}}') },
];
for (const [index, payload] of malformed.entries()) {
  ok(`malformed signed payload ${index} refused`, await throwsAsync(() => verifyHandIn(payload, fam), /Invalid hand-in/));
}
// Re-sign malicious scope and shape to demonstrate rejection independent of MAC.
for (const payload of [malformed[1], malformed[4], malformed[8]])
  ok("correctly signed hostile data refused", await throwsAsync(async () => verifyHandIn(await signed(payload), fam), /Invalid hand-in/));
const unassigned = await signed({ ...h, courses: [...h.courses, "math-geometry"] });
ok("declared unassigned course refused even with valid MAC", await throwsAsync(() => verifyHandIn(unassigned, fam), /not assigned/));
ok("validator returns diagnostics", validateHandIn({}).length > 0);
const parsed = parseHandIn(h); parsed.studentName = "changed";
ok("parser isolates input objects", h.studentName !== "changed");
ok("conflicting immutable attempt rejected", await throwsAsync(async () => mergeWork(teacher, { ...h.progress, attempts: [{ ...h.progress.attempts[0], correct: 7 }] }, h.courses), /conflicting attempt/));
ok("merge refuses unassigned course data independently", await throwsAsync(async () => mergeWork(teacher, { ...h.progress, lessonsDone: { "other/l1": "2026-10-01" } }, h.courses), /unassigned/));
ok("repeated merge idempotent", stableJson(mergeWork(m, h.progress, h.courses)) === stableJson(m));
const work = { kind: "writing" as const, started: h.created, updated: h.created, text: "Original" };
const log = { id: "log1", courseId: h.courses[0], date: "2026-10-01", type: "Art", minutes: 10, note: "Original" };
const withWork = { ...teacher, work: { "math-algebra1/w1": work }, logs: [log] };
ok("same-time work conflict rejected", await throwsAsync(async () => mergeWork(withWork, { ...h.progress, work: { "math-algebra1/w1": { ...work, text: "Changed" } } }, h.courses), /conflicting work/));
ok("conflicting log rejected", await throwsAsync(async () => mergeWork(withWork, { ...h.progress, logs: [{ ...log, minutes: 20 }] }, h.courses), /conflicting log/));
const photo = { id: "photo1", fileId: "file1", name: "example.txt", mime: "text/plain", bytes: 1, caption: "Evidence", date: "2026-10-01" };
const fileHandin = await makeHandIn(file, ana.id, { ...studentProgress, work: { "math-algebra1/w1": { ...work, photos: [photo] } } }, async () => ({ mime: "text/plain", data: "eA==" }));
ok("legacy attached file roundtrip", (await verifyHandIn(fileHandin, fam)).h.files?.file1.data === "eA==");
ok("bad attachment base64 rejected", await throwsAsync(async () => verifyHandIn(await signed({ ...fileHandin, files: { file1: { mime: "text/plain", data: "bad!" } } }), fam), /base64/));

const submission = createSpreadsheetSubmission({ id: "submission1", submittedAt: Date.now(), courseId: "math-algebra1", lessonId: "l1",
  assignment: { id: "sheet1", title: "Totals", starter: { sheets: { Budget: { A1: 2 } } }, protectedCells: [], answers: { "Budget!A1": 2 } }, workbook: { sheets: { Budget: { A1: 2 } } } });
const outsideSubmission = { ...submission, id: "submission2", courseId: "other" };
const withSheets = await makeHandIn(file, ana.id, { ...studentProgress, spreadsheetSubmissions: { submission1: submission, submission2: outsideSubmission } });
ok("only assigned spreadsheet evidence exported", Object.keys(withSheets.progress.spreadsheetSubmissions ?? {}).join() === "submission1");
ok("spreadsheet handin verifies", (await verifyHandIn(withSheets, fam)).h.progress.spreadsheetSubmissions?.submission1.grade.score === 1);
const sheetMerge = mergeWork(teacher, withSheets.progress, withSheets.courses);
ok("spreadsheet evidence merge idempotent", stableJson(mergeWork(sheetMerge, withSheets.progress, withSheets.courses)) === stableJson(sheetMerge));
ok("unassigned spreadsheet evidence refused", await throwsAsync(async () => verifyHandIn(await signed({ ...withSheets, progress: { ...withSheets.progress, spreadsheetSubmissions: { submission2: outsideSubmission } } }), fam), /unassigned/));
ok("altered spreadsheet automatic score refused", await throwsAsync(async () => verifyHandIn(await signed({ ...withSheets, progress: { ...withSheets.progress, spreadsheetSubmissions: { submission1: { ...submission, grade: { ...submission.grade, score: 0 } } } } }), fam), /[Gg]rade|[Ee]vidence/));
ok("legacy intervention skills retain dotted IDs", validateHandIn({ ...h, progress: { ...h.progress, attempts: [{ ...h.progress.attempts[0], intervention: { skillId: "math.fractions", baseline: 0.5 } }] } }).length === 0);
if (fails) {
  console.log(`${fails} classroom test(s) failed`);
  process.exit(1);
}
console.log("classroom tests passed");

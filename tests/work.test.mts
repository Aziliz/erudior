// Student work: writing with rubrics, labs, activity logs, reviews feeding grades, hand-ins.
// Run: npx tsx tests/work.test.mts
import { readFileSync } from "node:fs";
import { JSDOM } from "jsdom";
import { normalizeCourse } from "../src/lib/course.ts";
import {
  addReview,
  assignTarget,
  currentReview,
  editable,
  gradeId,
  logTotals,
  mergeStudentWork,
  normalizeWork,
  parseAssignBlock,
  protectAssignments,
  reopenWork,
  rubricScore,
  studentHtml,
  submitWork,
  thisWeek,
  touchWork,
  weekStart,
  wordCount,
  workFileIds,
  workProblems,
  workStatus,
  type LogEntry,
  type WorkRecord,
  type WorkReview,
} from "../src/lib/work.ts";
import { adjustTime, emptyRecords } from "../src/lib/records.ts";
import { coursePercent, gradeParts } from "../src/lib/grades.ts";
import { makeHandIn, mergeWork, parseClassFile, verifyHandIn, classFile } from "../src/lib/classroom.ts";
import { newClass, newStudent, type Family } from "../src/lib/family.ts";
import { emptyProgress } from "../src/lib/storage.ts";
import { checkCourse } from "./check-course.mts";

let fails = 0;
const ok = (name: string, cond: boolean, extra?: unknown) => {
  if (!cond) {
    fails++;
    console.log("FAIL", name, extra ?? "");
  }
};

// --- Course format -------------------------------------------------------------------
const demo = normalizeCourse(JSON.parse(readFileSync("samples/demo-student-work.json", "utf8")));
ok("demo writing", demo.writing?.length === 2 && demo.writing[0].kind === "short" && demo.writing[1].rubric === "paragraph");
ok("inline lab rubric moved to rubrics", demo.labs?.[0].rubric === "lab-basic" && !!demo.rubrics?.some((r) => r.id === "lab-basic"));
ok("levels sorted high to low", demo.rubrics![0].criteria[0].levels.map((l) => l.points).join() === "4,3,2,1");
ok("lab adult + adult step", demo.labs![0].adult && demo.labs![0].steps[1].adult === true && !demo.labs![0].steps[0].adult);
ok("lab table row labels", demo.labs![0].tables[0].rowLabels?.length === 5 && demo.labs![0].tables[0].rows === 5);
ok("activity log", demo.activityLog?.weeklyMinutes === 150 && demo.activityLog.uploads && demo.activityLog.types.length === 5);
ok("demo has no problems", workProblems(demo).length === 0, workProblems(demo));
ok("demo passes the course checker", (await checkCourse("samples/demo-student-work.json")).length === 0);
ok("no work fields when absent", Object.keys(normalizeWork({})).length === 0);
const lean = normalizeWork({ labs: [{ id: "x", steps: ["a"], photos: true }], writing: [{ id: "w", prompt: "p", selfCheck: false, words: { min: "50" } }] });
ok("photos: true gets a prompt", !!lean.labs?.[0].photos);
ok("selfCheck false kept, words parsed", lean.writing?.[0].selfCheck === false && lean.writing[0].words?.min === 50);

const bad = normalizeCourse({
  title: "Bad",
  modules: [{ id: "m1", title: "M" }],
  lessons: [{ id: "l1", module: "m1", title: "L", body: "```assignment\nwriting: nope\nlab: gone\nlog\nhello\n```\n\n```assignment writing: x\n```" }],
  rubrics: [{ id: "r", criteria: [{ id: "a", name: "A", levels: [{ points: 2, label: "x" }] }] }],
  writing: [
    { id: "dup", prompt: "", rubric: "missing", words: { min: 100, max: 50 } },
    { id: "dup", prompt: "x", module: "m9" },
  ],
  labs: [{ id: "lab", steps: [{ text: "s", adult: true }], tables: [{ id: "t", columns: [] }] }],
});
const probs = workProblems(bad).join("\n");
for (const want of [
  "criterion a: needs at least two levels",
  "writing dup: no prompt",
  "rubric missing doesn't exist",
  "words.min is more than words.max",
  "id is used by another",
  "module m9 doesn't exist",
  "lab lab: no materials",
  "no safety notes",
  "adult steps but isn't marked adult",
  "table t: no columns",
  "writing nope doesn't exist",
  "lab gone doesn't exist",
  "no activityLog",
  'can\'t read "hello"',
  "never closed",
])
  ok(`problem: ${want}`, probs.includes(want), probs);

// --- Lesson blocks -----------------------------------------------------------------------
ok("parse block", JSON.stringify(parseAssignBlock("writing: a\n  Lab: b \nactivity log\n").links) === JSON.stringify([{ kind: "writing", id: "a" }, { kind: "lab", id: "b" }, { kind: "log" }]));
const prot = protectAssignments("Intro\n\n```assignment\nwriting: class-pet\n```\n\nEnd", (l) =>
  l.kind === "writing" ? { title: "Pets <b>& more", status: "Draft", detail: "Aim for 80 words." } : undefined,
);
ok("placeholder", /XASSIGNX0XASSIGNX/.test(prot.text) && !prot.text.includes("```"));
const html = prot.restore(`<p>Intro</p>\n<p>${prot.text.match(/XASSIGNX0XASSIGNX/)![0]}</p>\n<p>End</p>`);
ok("card escaped", html.includes("Pets &lt;b&gt;&amp; more") && !html.includes("<b>&"), html);
ok("card has button + status", html.includes('data-assign="writing:class-pet"') && html.includes("Draft") && !html.includes("<p><div"));
const dom = new JSDOM(`<!doctype html><body>${html}</body>`);
const btn = dom.window.document.querySelector("button.assign-open")!;
ok("assignTarget", JSON.stringify(assignTarget(btn)) === JSON.stringify({ kind: "writing", id: "class-pet" }));
ok("assignTarget elsewhere", assignTarget(dom.window.document.body) === null);
ok("no block, untouched", protectAssignments("plain", undefined).text === "plain");

// --- Writing ------------------------------------------------------------------------------
ok("word count", wordCount("Hello, **world**! It's a dog-friendly day.\n\n- one\n- two") === 8, wordCount("Hello, **world**! It's a dog-friendly day.\n\n- one\n- two"));
ok("word count empty", wordCount("   ") === 0);
const sh = studentHtml("# Title\n\nHi **bold** and *it* <script>x</script>\nline two\n\n- a\n- b");
ok("student html", sh === "<h3>Title</h3><p>Hi <strong>bold</strong> and <em>it</em> &lt;script&gt;x&lt;/script&gt;<br>line two</p><ul><li>a</li><li>b</li></ul>", sh);
ok("snake_case stays", !studentHtml("my_var_name").includes("<em>"));

// --- Status and reviews -------------------------------------------------------------------
const rubric = demo.rubrics![0];
const s1 = rubricScore(rubric, { claim: 4, reasons: 3 });
ok("partial score", s1.points === 7 && s1.outOf === 12 && !s1.complete);
const s2 = rubricScore(rubric, { claim: 4, reasons: 3, conventions: 2 });
ok("complete score", s2.complete && Math.round(s2.percent) === 75);
ok("bad level not counted", !rubricScore(rubric, { claim: 9, reasons: 3, conventions: 2 }).complete);

let p = emptyProgress();
const key = "demo-student-work/class-pet";
ok("new", workStatus(p.work?.[key]) === "new");
p = touchWork(p, key, "writing", (w) => ({ ...w, text: "Pets teach us." }));
ok("draft", workStatus(p.work![key]) === "draft" && editable("draft"));
const w1 = submitWork(p.work![key], "2026-10-01T10:00:00.000Z");
ok("submitted", workStatus(w1) === "submitted" && !editable("submitted") && w1.rounds === 1);
const rv = (over: Partial<WorkReview>): WorkReview => ({ at: "2026-10-02T10:00:00.000Z", by: "Parent", forSubmitted: w1.submitted!, levels: {}, comment: "", ...over });
const back = rv({ revise: true, comment: "Add a second reason." });
ok("revise", workStatus(w1, [back]) === "revise" && editable("revise"));
const w2 = reopenWork(w1);
ok("revising draft still shows feedback", workStatus(w2, [back]) === "revise" && currentReview(w2, [back]) === back);
const w3 = submitWork(w2, "2026-10-03T10:00:00.000Z");
ok("resubmitted waits again", workStatus(w3, [back]) === "submitted" && w3.rounds === 2);
const final = rv({ at: "2026-10-04T10:00:00.000Z", forSubmitted: w3.submitted!, levels: { claim: 4, reasons: 3, conventions: 2 }, points: 9, outOf: 12, percent: 75 });
ok("reviewed", workStatus(w3, [back, final]) === "reviewed" && currentReview(w3, [back, final]) === final);

let rec = emptyRecords();
rec = addReview(rec, "demo-student-work", "class-pet", "Writing: pets", back);
ok("revise gives no grade", rec.grades.length === 0 && rec.reviews![key].length === 1);
rec = addReview(rec, "demo-student-work", "class-pet", "Writing: pets", final);
ok("final grade written", rec.grades.length === 1 && rec.grades[0].id === gradeId("demo-student-work", "class-pet") && rec.grades[0].percent === 75 && rec.grades[0].date === "2026-10-04");
rec = addReview(rec, "demo-student-work", "class-pet", "Writing: pets", { ...final, at: "2026-10-05T10:00:00.000Z", percent: 91.666 });
ok("regrade replaces", rec.grades.length === 1 && rec.grades[0].percent === 91.7 && rec.reviews![key].length === 3);
const parts = gradeParts("demo-student-work", emptyProgress(), rec.grades);
ok("feeds course grade (parent part)", parts.parent === 91.7 && coursePercent(parts) === 91.7);

// --- Activity logs ------------------------------------------------------------------------
ok("week starts Monday", weekStart("2026-10-28") === "2026-10-26" && weekStart("2026-10-26") === "2026-10-26" && weekStart("2026-11-01") === "2026-10-26");
const log = (date: string, type: string, minutes: number): LogEntry => ({ id: `${date}${type}`, courseId: "pe", date, type, minutes, note: "" });
const logs = [log("2026-10-26", "Biking", 30), log("2026-10-26", "Swimming", 20), log("2026-10-28", "Biking", 45), log("2026-10-20", "Biking", 60)];
const wk = thisWeek(logs, "2026-10-29");
ok("this week", wk.minutes === 95 && wk.days === 2 && wk.entries === 3, wk);
const all = logTotals(logs);
ok("by type", all.byType[0].type === "Biking" && all.byType[0].minutes === 135 && all.minutes === 155);

let r = emptyRecords();
r = adjustTime(r, "2026-10-26", "pe", 1800);
r = adjustTime(r, "2026-10-26", "pe", 600);
ok("time added", r.time["2026-10-26"].pe === 2400);
r = adjustTime(r, "2026-10-26", "pe", -1800);
ok("time taken back", r.time["2026-10-26"].pe === 600);
r = adjustTime(r, "2026-10-26", "pe", -5000);
ok("never negative; empty day removed", !r.time["2026-10-26"]);

// --- Hand-ins carry work and files --------------------------------------------------------
const ana = newStudent("Ana", 5);
const cls = newClass("Period 1", [ana.id]);
cls.assignments = [{ courseId: "demo-student-work", assigned: "2026-10-01" }];
const fam = {
  format: "examiner-family",
  version: 1,
  mode: "classroom",
  classes: [cls],
  state: "",
  route: "",
  year: { start: "2026-08-01", end: "2027-07-31" },
  dailyMinutes: 180,
  parent: { password: { salt: "", hash: "", iterations: 1 }, recovery: { salt: "", hash: "", iterations: 1 } },
  students: [ana],
  reminders: [],
  done: [],
} as Family;
const cf = parseClassFile(JSON.parse(JSON.stringify(classFile(fam, cls, () => "Demo"))));
const photo = { id: "w1", fileId: "fphoto1", name: "a.jpg", mime: "image/jpeg", bytes: 3, caption: "", date: "2026-10-01" };
let sp = emptyProgress();
sp = touchWork(sp, "demo-student-work/ice-melt", "lab", (w) => submitWork({ ...w, photos: [photo], tables: { watch: [["", "big", "small"]] } }));
sp = touchWork(sp, "other-course/x", "writing", (w) => ({ ...w, text: "not assigned" }));
sp = { ...sp, logs: [{ ...log("2026-10-02", "Biking", 20), courseId: "demo-student-work", file: { ...photo, id: "w2", fileId: "flog1" } }, log("2026-10-02", "Biking", 5)] };
ok("file ids", workFileIds(sp).sort().join() === "flog1,fphoto1");
const h = await makeHandIn(cf, ana.id, sp, async (id) => ({ mime: "image/jpeg", data: `data-${id}` }));
ok("hand-in carries assigned work only", Object.keys(h.progress.work ?? {}).join() === "demo-student-work/ice-melt" && h.progress.logs?.length === 1);
ok("hand-in carries files", h.files?.fphoto1?.data === "data-fphoto1" && h.files?.flog1?.data === "data-flog1");
const { h: hv } = await verifyHandIn(JSON.parse(JSON.stringify(h)), fam);
ok("verified", hv.studentId === ana.id);
const tampered = JSON.parse(JSON.stringify(h));
tampered.files.fphoto1.data = "swapped";
ok("files are covered by the signature", await verifyHandIn(tampered, fam).then(() => false, () => true));
const merged = mergeWork(emptyProgress(), hv.progress, hv.courses);
ok("merged into teacher copy", !!merged.work?.["demo-student-work/ice-melt"]?.submitted && merged.logs?.length === 1);

const older: WorkRecord = { kind: "writing", started: "a", updated: "2026-10-01T00:00:00Z", text: "old" };
const newer: WorkRecord = { ...older, updated: "2026-10-02T00:00:00Z", text: "new" };
ok("newer copy wins", mergeStudentWork({ ...emptyProgress(), work: { k: newer } }, { work: { k: older } }).work!.k.text === "new");
ok("newer copy wins (incoming)", mergeStudentWork({ ...emptyProgress(), work: { k: older } }, { work: { k: newer } }).work!.k.text === "new");

if (fails) {
  console.log(`${fails} work test(s) failed`);
  process.exit(1);
}
console.log("work tests passed");

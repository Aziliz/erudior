// State compliance rules: filing reminders, parent qualifications, Florida's evaluation date, subject
// coverage, Missouri core hours, daily minimums, low test scores, and the instruction plan.
import type { Family } from "../src/lib/family.ts";
import { emptyRecords, parseRecords, reminders } from "../src/lib/records.ts";
import { belowDailyMinimum, coreHoursDone, lowScore, lowScoreLine, stateInfo, statesData, subjectCoverage } from "../src/lib/states.ts";
import { instructionPlan, planKey, PLAN_TITLES, type StudentData } from "../src/lib/reports.ts";

let fails = 0;
const ok = (name: string, cond: boolean) => {
  if (!cond) {
    fails++;
    console.log("FAIL", name);
  }
};

const family = {
  format: "erudior-family",
  version: 1,
  state: "NY",
  route: "Home education law",
  year: { start: "2026-08-01", end: "2027-07-31" },
  dailyMinutes: 180,
  parent: {} as Family["parent"],
  students: [{ id: "ada", name: "Ada", grade: 3, assigned: [], freeChoice: true }],
  reminders: [],
  done: [],
} as Family;
const at = (state: string, extra: Partial<Family> = {}) => reminders({ ...family, state, ...extra });

// ---- filing reminders ----
const ny = at("NY");
const dates = (prefix: string) => ny.filter((x) => x.text.startsWith(prefix)).map((x) => x.date);
ok("NY quarterly 1 Nov 15", dates("Quarterly report 1").join() === "2026-11-15");
ok("NY quarterly 2 Jan 31", dates("Quarterly report 2").join() === "2027-01-31");
ok("NY quarterly 3 Apr 15", dates("Quarterly report 3").join() === "2027-04-15");
ok("NY quarterly 4 + assessment Jun 30", dates("Quarterly report 4").join() === "2027-06-30");
ok("TN attendance at year end", at("TN").some((x) => x.text.startsWith("Attendance records") && x.date === "2027-07-31"));
const sc = at("SC");
ok("SC semiannual midyear", sc.some((x) => x.text.includes("(first half)") && x.date === "2027-01-30"));
ok("SC semiannual year end", sc.some((x) => x.text.includes("(second half)") && x.date === "2027-07-31"));

// ---- parent qualification ----
const qual = statesData().states.filter((s) => s.rules.qualification).map((s) => s.code).sort().join();
ok("13 qualification states", qual === "DC,GA,MN,NC,ND,NE,NM,PA,SC,TN,VA,WA,WV");
ok("PA qualification reminder", at("PA").some((x) => x.key === "qualification" && x.text.includes("diploma")));
ok("TX no qualification reminder", !at("TX").some((x) => x.key === "qualification"));
ok("TN proof goes with notice", stateInfo("TN")!.teacher.includes("notice"));

// ---- Florida: evaluation on the notice anniversary ----
const fl = (noticeFiled?: string) => at("FL", noticeFiled ? { noticeFiled } : {}).find((x) => x.key === "assess:2026");
ok("FL without date: asks for it", !!fl()?.text.includes("anniversary") && fl()!.date === "2026-08-01");
ok("FL anniversary in this school year", fl("2025-09-10")?.date === "2026-09-10");
ok("FL anniversary after Jan", fl("2025-03-02")?.date === "2027-03-02");
ok("FL first year: one year after filing", fl("2026-08-20")?.date === "2027-08-20");
ok("FL no year-end assessment duplicate", at("FL").filter((x) => x.key.startsWith("assess")).length === 1);

// ---- subject coverage and core hours ----
const co = stateInfo("CO")!;
const cover = subjectCoverage(co.rules, [{ subject: "Math", hours: 40 }, { subject: "Science", hours: 0 }]);
ok("CO areas", cover.map((c) => c.area).join() === "English language arts,Math,Science,Social studies");
ok("CO missing hours", cover.filter((c) => c.hours === 0).map((c) => c.area).join() === "English language arts,Science,Social studies");
ok("AK has no areas", subjectCoverage(stateInfo("AK")!.rules, []).length === 0);
const mo = stateInfo("MO")!;
ok("MO core hours", coreHoursDone(mo.rules, [{ subject: "Math", hours: 100 }, { subject: "Arts", hours: 50 }, { subject: "Science", hours: 20 }]) === 120);
ok("MO needs 600", mo.rules.coreHours?.hours === 600);
ok("no core rule elsewhere", coreHoursDone(co.rules, []) === undefined);

// ---- daily minimum ----
ok("GA 4.5 h/day: 3 h is short", belowDailyMinimum(stateInfo("GA")!.rules, 180));
ok("GA 4.5 h/day: 270 min ok", !belowDailyMinimum(stateInfo("GA")!.rules, 270));
ok("TX no daily rule", !belowDailyMinimum(stateInfo("TX")!.rules, 15));

// ---- low scores ----
ok("CO 13th flagged", lowScore(co.rules, { percentile: 13 }) && !lowScore(co.rules, { percentile: 14 }));
ok("OR below 15th", lowScore(stateInfo("OR")!.rules, { percentile: 14 }) && !lowScore(stateInfo("OR")!.rules, { percentile: 15 }));
ok("VA stanine below 4", lowScore(stateInfo("VA")!.rules, { stanine: 3 }) && !lowScore(stateInfo("VA")!.rules, { stanine: 4 }));
ok("no score, no flag", !lowScore(co.rules, {}));
ok("line wording", lowScoreLine(co.rules) === "at or below the 13th percentile" && lowScoreLine(stateInfo("WV")!.rules) === "below the 4th stanine");
const rec = emptyRecords();
const withScore = { ...rec, tests: [{ id: "t1", date: "2027-05-01", name: "CAT", result: "12th", notes: "", percentile: 12 }] };
ok("records keep percentile", parseRecords(JSON.stringify(withScore)).tests[0].percentile === 12);
let rejected = false;
try {
  parseRecords(JSON.stringify({ ...rec, tests: [{ ...withScore.tests[0], percentile: 140 }] }));
} catch {
  rejected = true;
}
ok("records reject bad percentile", rejected);

// ---- instruction plan ----
const student = { id: "ada", name: "Ada", grade: 3, freeChoice: true, assigned: [{ courseId: "math-6", subject: "Math" }] };
const d: StudentData = {
  family: { ...family, students: [student] },
  student,
  progress: { enrolled: [], lessonsDone: {}, attempts: [] } as unknown as StudentData["progress"],
  records: emptyRecords(),
  courses: [],
};
const plan = instructionPlan(d, "2026-08-01");
ok("NY plan title", plan.title === PLAN_TITLES.ihip);
ok("plan subject from assignment", plan.subjects.map((s) => s.subject).join() === "Math");
ok("plan units from catalog outline", plan.subjects[0].courses[0].units.length > 0);
ok("plan lists unplanned NY areas", plan.unplanned.includes("Science") && !plan.unplanned.includes("Math"));
ok("plan quarterly dates", plan.quarters.dates.join() === "2026-11-15,2027-01-31,2027-04-15,2027-06-30");
ok("plan hours grade 3", plan.needHours === 900);
const edited = instructionPlan({ ...d, records: { ...d.records, narratives: { [planKey("2026-08-01")]: { "objectives:Science": "Plants\nWeather" } } } }, "2026-08-01");
ok("parent-added subject", edited.subjects.some((s) => s.subject === "Science" && s.objectives === "Plants\nWeather") && !edited.unplanned.includes("Science"));
ok("PA plan title", instructionPlan({ ...d, family: { ...d.family, state: "PA" } }, "2026-08-01").title === PLAN_TITLES.objectives);
ok("TX generic plan", instructionPlan({ ...d, family: { ...d.family, state: "TX" } }, "2026-08-01").title === "Instruction plan");

if (fails) {
  console.log(`${fails} state compliance test(s) failed`);
  process.exit(1);
}
console.log("state compliance tests passed");

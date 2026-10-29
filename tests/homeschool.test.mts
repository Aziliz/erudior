// Homeschool: parent sign-in, records and attendance, reminders, encrypted backups, state rules.
import fs from "node:fs";
import { checkSecret, currentAssignments, lockedFor, makeSecret, resetWithRecovery, unlockParent, type Family } from "../src/lib/family.ts";
import { addManual, addTime, confirmProposed, dayRows, emptyRecords, minutesOn, reminders, upcoming, yearSummary } from "../src/lib/records.ts";
import { decryptText, encryptText } from "../src/lib/backup.ts";
import { ActiveClock, IDLE_MS } from "../src/lib/timer.ts";
import { hoursFor, routeOptions, stateInfo, statesData } from "../src/lib/states.ts";

let fails = 0;
const ok = (name: string, cond: boolean) => {
  if (!cond) {
    fails++;
    console.log("FAIL", name);
  }
};

// ---- state rules file ----
const states = JSON.parse(fs.readFileSync("samples/states.json", "utf8"));
ok("51 jurisdictions", states.states.length === 51 && statesData().states.length === 51);
ok("GA hours from days x hours/day", hoursFor(stateInfo("GA")!.rules, 5) === 810);
ok("NY grade bands", hoursFor(stateInfo("NY")!.rules, 3) === 900 && hoursFor(stateInfo("NY")!.rules, 8) === 990);
ok("MT grade bands", hoursFor(stateInfo("MT")!.rules, 2) === 720 && hoursFor(stateInfo("MT")!.rules, 9) === 1080);
ok("TX no hours", hoursFor(stateInfo("TX")!.rules, 5) === undefined);
ok("routes listed", routeOptions(stateInfo("PA")!).length >= 2 && routeOptions(stateInfo("PA")!)[0] === "Home education law");

// ---- parent password / PIN ----
const fast = (s: string) => makeSecret(s, 1000);
const family: Family = {
  format: "erudior-family",
  version: 1,
  state: "GA",
  route: "Home education law",
  year: { start: "2026-08-01", end: "2027-07-31" },
  dailyMinutes: 180,
  parent: { password: await fast("correct horse"), pin: await fast("2468"), recovery: await fast("ABCDEFGHJKLMNPQR") },
  students: [
    { id: "ada", name: "Ada", grade: 3, assigned: [], freeChoice: true },
    { id: "ben", name: "Ben", grade: 7, assigned: [], freeChoice: false },
  ],
  reminders: [],
  done: [],
};
ok("secret matches", await checkSecret("correct horse", family.parent.password));
ok("secret mismatch", !(await checkSecret("correct horsE", family.parent.password)));

let f = family;
const t0 = 1_000_000;
for (let i = 0; i < 4; i++) f = (await unlockParent(f, "pin", "0000", t0)).family;
ok("4 wrong tries: not locked", lockedFor(f, t0) === 0 && f.parent.failures === 4);
f = (await unlockParent(f, "pin", "0000", t0)).family;
ok("5th wrong try locks 1 min", lockedFor(f, t0) === 60_000);
ok("right PIN refused while locked", !(await unlockParent(f, "pin", "2468", t0 + 1000)).ok);
const after = await unlockParent(f, "pin", "2468", t0 + 61_000);
ok("right PIN after the lock", after.ok && after.family.parent.failures === 0 && !after.family.parent.lockedUntil);
ok("password works", (await unlockParent(family, "password", "correct horse")).ok);
ok("no PIN set = PIN refused", !(await unlockParent({ ...family, parent: { ...family.parent, pin: undefined } }, "pin", "2468")).ok);
ok("bad recovery code", (await resetWithRecovery(family, "nope", "newpassword")) === null);
const reset = await resetWithRecovery(family, "abcd-efgh-jklm-npqr", "new password");
ok("recovery resets password and PIN", !!reset && (await checkSecret("new password", reset.family.parent.password)) && !reset.family.parent.pin);

// ---- records and attendance ----
let r = emptyRecords();
r = addTime(r, "2026-09-01", "math-algebra1", 3 * 3600);
r = addTime(r, "2026-09-02", "math-algebra1", 60 * 60);
r = addManual(r, { date: "2026-09-02", minutes: 150, subject: "Science", note: "Museum" });
r = addTime(r, "2026-09-03", "lang-german-a1", 20 * 60);
r = addTime(r, "2026-06-01", "math-algebra1", 5 * 3600); // last school year
ok("minutes tracked + manual", minutesOn(r, "2026-09-02") === 210);
const rows = dayRows(r, family, "2026-09-10");
ok("rows only this school year", rows.length === 3 && rows[0].date === "2026-09-03");
ok("proposed vs short", rows.find((x) => x.date === "2026-09-01")!.status === "proposed" && rows.find((x) => x.date === "2026-09-03")!.status === "short");
r = { ...r, days: { "2026-09-02": "absent" } };
r = confirmProposed(r, family, "2026-09-10");
ok("confirm keeps parent's choice", r.days["2026-09-01"] === "present" && r.days["2026-09-02"] === "absent" && !r.days["2026-09-03"]);
const y = yearSummary(r, family, family.students[0], "2026-09-10");
ok("summary days", y.daysPresent === 1 && y.daysProposed === 0);
ok("summary hours", Math.abs(y.hours - (4 + 2.5 + 1 / 3)) < 1e-9);
ok("subjects", y.bySubject[0].subject === "Math" && y.bySubject.some((b) => b.subject === "World languages" && Math.abs(b.hours - 1 / 3) < 1e-9));
ok("GA needs", y.needDays === 180 && y.needHours === 810);

// ---- reminders ----
const ga = reminders(family);
ok("GA notice Sept 1", ga.some((x) => x.key === "notice:2026" && x.date === "2026-09-01"));
ok("GA testing year for grade 3", ga.some((x) => x.key === "test:2026" && x.text.includes("Ada") && !x.text.includes("Ben")));
const ny = reminders({ ...family, state: "NY" });
ok("NY notice July 1 next year", ny.some((x) => x.key === "notice:2026" && x.date === "2027-07-01"));
ok("NY IHIP Aug 15 this year", ny.some((x) => x.text.startsWith("IHIP") && x.date === "2026-08-15"));
ok("CO 14 days before start", reminders({ ...family, state: "CO" }).some((x) => x.key === "notice:2026" && x.date === "2026-07-18"));
ok("other route: no state deadlines", reminders({ ...family, route: "Private school" }).length === 0);
const custom = { ...family, reminders: [{ id: "x", date: "2026-08-20", text: "Order books" }] };
ok("upcoming includes custom + soon", upcoming(custom, 45, "2026-08-10").map((x) => x.key).join() === "custom:x,notice:2026");
ok("done hides", upcoming({ ...custom, done: ["custom:x"] }, 45, "2026-08-10").length === 1);

// ---- assignments ----
const s = { ...family.students[0], assigned: [
  { courseId: "a1", subject: "World languages" },
  { courseId: "alg", subject: "Math" },
  { courseId: "a2", subject: "World languages" },
  { courseId: "geo", subject: "Math" },
] };
let cur = currentAssignments(s, () => false);
ok("first per subject", [...cur].sort().join() === "a1,alg");
cur = currentAssignments(s, (id) => id === "a1");
ok("next unlocks when finished", [...cur].sort().join() === "a2,alg");

// ---- active time ----
const c = new ActiveClock(0);
for (let t = 5000; t <= 60_000; t += 5000) c.tick(t, true);
ok("counts while active", c.take() === 60);
for (let t = 65_000; t <= IDLE_MS + 60_000; t += 5000) c.tick(t, true);
const idle = c.take();
ok("stops when idle", idle > 0 && idle < IDLE_MS / 1000);
c.input(IDLE_MS + 60_000);
c.tick(IDLE_MS + 65_000, false);
ok("hidden window doesn't count", c.take() === 0);
c.tick(IDLE_MS + 600_000, true);
ok("a long gap (sleep) counts at most 10 s", c.take() <= 10);

// ---- encrypted backup ----
const secret = JSON.stringify({ hello: "Ada", n: [1, 2, 3] });
const env = await encryptText(secret, "a long passphrase", 1000);
ok("ciphertext hides content", !env.includes("Ada"));
ok("round trip", (await decryptText(JSON.parse(env), "a long passphrase")) === secret);
let wrong = false;
try {
  await decryptText(JSON.parse(env), "wrong passphrase");
} catch {
  wrong = true;
}
ok("wrong passphrase fails", wrong);
const tampered = JSON.parse(env);
tampered.data = tampered.data.slice(0, -4) + (tampered.data.endsWith("AAA=") ? "BBB=" : "AAA=");
let bad = false;
try {
  await decryptText(tampered, "a long passphrase");
} catch {
  bad = true;
}
ok("tampering detected", bad);

if (fails) {
  console.log(`${fails} homeschool test(s) failed`);
  process.exit(1);
}
console.log("homeschool tests passed");

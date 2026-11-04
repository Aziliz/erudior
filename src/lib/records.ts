// A student's school records: time spent learning (tracked in the app and entered by hand),
// and attendance the parent confirmed. One file per student: records-<id>.

import { parseHomeschoolPlanning, restoreHomeschoolPlanning, type HomeschoolPlanning } from "./homeschoolPlanning";
import { parseAcademicRecords, restoreAcademicRecords, type AcademicRecords } from "./academicRecords";
import { CATALOG } from "./catalog";
import type { Family, Student } from "./family";
import { addDays, daysBetween, today } from "./srs";
import { hoursFor, stateInfo, type StateInfo } from "./states";
import { loadState, saveState, updateState, competencyProfileExists } from "./storage";
import { uid } from "./util";
import type { CourseRecord, OutsideCourse, ParentGrade } from "./grades";
import type { DocumentRef } from "./documents";
import type { WorkReview } from "./work";

/** A book the student read (for the reading log; Pennsylvania requires one). */
export interface BookEntry {
  id: string;
  /** Date finished. */
  date: string;
  title: string;
  author: string;
  subject: string;
  note: string;
  /** Minutes spent reading it in the app's reader (only for books read there). */
  minutes?: number;
  /** `${courseId}/${textId}` for books read in the app, so finishing again updates the entry. */
  textKey?: string;
}

/** Add a book the student finished in the reader, or update its entry (minutes, date). */
export function logBook(r: Records, e: Omit<BookEntry, "id">): Records {
  const old = e.textKey ? r.reading.find((b) => b.textKey === e.textKey) : undefined;
  if (!old) return { ...r, reading: [...r.reading, { ...e, id: uid("b") }] };
  // Keep what the parent may have changed (subject, note); refresh the time read.
  if (old.minutes === e.minutes) return r;
  return { ...r, reading: r.reading.map((b) => (b === old ? { ...b, minutes: e.minutes } : b)) };
}

/** "3 h 20 min" / "45 min" for the reading log. */
export const bookMinutes = (m: number) => (m >= 60 ? `${Math.floor(m / 60)} h${m % 60 ? ` ${m % 60} min` : ""}` : `${m} min`);

export const ACTIVITY_KINDS = ["Physical education and sports", "Extracurricular", "Volunteer service", "Work experience", "Other"] as const;

/** An activity for the high school résumé and transcript. */
export interface Activity {
  id: string;
  kind: string;
  name: string;
  /** Role or position, e.g. captain, first violin. */
  role: string;
  from: string;
  to: string;
  hours: number;
  note: string;
}

/** A standardized test or outside evaluation. */
export interface TestResult {
  id: string;
  date: string;
  name: string;
  /** Free text: score, percentile, stanine, or the evaluator's conclusion. */
  result: string;
  notes: string;
}

export interface ManualEntry {
  id: string;
  date: string;
  minutes: number;
  subject: string;
  note: string;
}

export interface Records {
  format: "erudior-records";
  version: 1;
  /** Local optimistic revision; imported revisions never establish authority. */
  revision?: number;
  academic?: AcademicRecords;
  /** Private parent planning notes, never enrollment approval or earned credit. */
  planning?: HomeschoolPlanning;
  /** Bounded local change journal, not a signed or tamper-proof institutional audit. */
  audit?: RecordsAuditEntry[];
  /** Imported history is preserved as historical claims, not authenticated authorship. */
  restoredAt?: string;
  /** Seconds of active study, by day and course id. */
  time: Record<string, Record<string, number>>;
  /** Learning away from the app (field trips, reading, sports…). */
  manual: ManualEntry[];
  /** Days the parent confirmed. Days missing here are only proposals. */
  days: Record<string, "present" | "absent">;
  /** Parent's settings per course (credits, Honors/AP, override, comment). */
  courses: Record<string, CourseRecord>;
  /** Grades the parent entered for work outside the app. */
  grades: ParentGrade[];
  /** Courses taken elsewhere, for the transcript. */
  outside: OutsideCourse[];
  /** Standardized tests and evaluations. */
  tests: TestResult[];
  /** Parent's per-subject evaluation for a report period, keyed `${from}..${to}` then subject. */
  narratives: Record<string, Record<string, string>>;
  /** Attached files on record (the files themselves are in documents/). */
  documents: DocumentRef[];
  reading: BookEntry[];
  activities: Activity[];
  /** Reviews of writing and labs, keyed `${courseId}/${itemId}`, oldest first (lib/work.ts). */
  reviews?: Record<string, WorkReview[]>;
}

export const emptyRecords = (): Records => ({
  format: "erudior-records",
  version: 1,
  time: {},
  manual: [],
  days: {},
  courses: {},
  grades: [],
  outside: [],
  tests: [],
  narratives: {},
  documents: [],
  reading: [],
  activities: [],
});

export interface RecordsAuditEntry {
  revision: number;
  at: string;
  action: string;
  fields: string[];
  origin: "local" | "imported";
}
export const MAX_RECORDS_BYTES = 8 * 1024 * 1024;
export const MAX_RECORDS_AUDIT = 1000;
const recordError = () => Error("Academic records are damaged or unsupported. They are quarantined in place and were not replaced. Export the damaged source for recovery before repairing or restoring a backup.");
const object = (v: unknown): v is Record<string, any> => !!v && typeof v === "object" && !Array.isArray(v);
function assertObject(v: unknown): asserts v is Record<string, any> { if (!object(v)) throw recordError(); }
const string = (v: unknown, max = 10000) => { if (typeof v !== "string" || v.length > max) throw recordError(); };
const number = (v: unknown, max = 1e12, min = 0) => { if (typeof v !== "number" || !Number.isFinite(v) || v < min || v > max) throw recordError(); };
const array = (v: unknown): any[] => { if (!Array.isArray(v) || v.length > 50000) throw recordError(); return v; };
const strings = (v: Record<string, any>, keys: string[]) => keys.forEach(k => string(v[k]));
function safeTree(value: unknown, depth = 0, budget = { n: 0 }): void {
  if (++budget.n > 250000 || depth > 24) throw recordError();
  if (typeof value === "number" && !Number.isFinite(value)) throw recordError();
  if (typeof value === "string" && value.length > 250000) throw recordError();
  if (value && typeof value === "object") for (const [key, child] of Object.entries(value)) {
    if (["__proto__", "prototype", "constructor"].includes(key)) throw recordError();
    safeTree(child, depth + 1, budget);
  }
}
/** Legacy fields are retained; malformed input is never projected as an empty record. */
export function parseRecords(value: unknown): Records {
  if (typeof value === "string") {
    if (new TextEncoder().encode(value).length > MAX_RECORDS_BYTES) throw recordError();
    try { value = JSON.parse(value); } catch { throw recordError(); }
  }
  assertObject(value); safeTree(value);
  if (value.format !== "erudior-records" || value.version !== 1) throw recordError();
  const r = { ...emptyRecords(), ...value } as Records;
  for (const name of ["time", "days", "courses", "narratives"] as const) assertObject(r[name]);
  for (const day of Object.values(r.time)) { assertObject(day); Object.values(day).forEach(v => number(v)); }
  if (Object.values(r.days).some(v => v !== "present" && v !== "absent")) throw recordError();
  for (const c of Object.values(r.courses)) {
    assertObject(c);
    for (const k of ["credits", "percentOverride", "gradeLevel"] as const) if (c[k] !== undefined) number(c[k], k === "percentOverride" ? 100 : 1000, k === "gradeLevel" ? -1 : 0);
    for (const k of ["overrideNote", "comment", "yearStart"] as const) if (c[k] !== undefined) string(c[k]);
    if (c.level !== undefined && !["regular", "honors", "ap"].includes(c.level)) throw recordError();
  }
  for (const map of Object.values(r.narratives)) { assertObject(map); Object.values(map).forEach(v => string(v)); }
  const required: Record<string,string[]> = {
    manual:["id","date","subject","note"], grades:["id","courseId","date","title"],
    outside:["id","title","subject","yearStart","level","where"], tests:["id","date","name","result","notes"],
    documents:["id","fileId","name","mime","kind","date","note"], reading:["id","date","title","author","subject","note"],
    activities:["id","kind","name","role","from","to","note"],
  };
  for (const [field, keys] of Object.entries(required)) {
    const rows = array((r as any)[field]); const ids = new Set<string>();
    for (const row of rows) {
      assertObject(row); strings(row, keys);
      if (!row.id || ids.has(row.id)) throw recordError(); ids.add(row.id);
      for (const k of ["minutes", "hours", "credits", "bytes", "percent", "gradeLevel"]) if (row[k] !== undefined) number(row[k], k === "percent" ? 100 : 1e12, k === "gradeLevel" ? -1 : 0);
      if (field === "manual" && row.minutes === undefined || field === "grades" && row.percent === undefined || field === "outside" && row.credits === undefined || field === "documents" && row.bytes === undefined || field === "activities" && row.hours === undefined) throw recordError();
      if (field === "outside" && !["regular", "honors", "ap"].includes(row.level)) throw recordError();
      if (row.textKey !== undefined) string(row.textKey);
    }
  }
  if (r.reviews !== undefined) {
    assertObject(r.reviews);
    for (const reviews of Object.values(r.reviews)) for (const review of array(reviews)) {
      assertObject(review); strings(review,["at","by","forSubmitted","comment"]); assertObject(review.levels);
      Object.values(review.levels).forEach(v => number(v));
      if (review.notes !== undefined) { assertObject(review.notes); Object.values(review.notes).forEach(v => string(v)); }
      for (const k of ["points","outOf","percent"]) if (review[k] !== undefined) number(review[k]);
      if (review.revise !== undefined && typeof review.revise !== "boolean") throw recordError();
    }
  }
  if (r.academic !== undefined) r.academic = parseAcademicRecords(r.academic);
  if (r.planning !== undefined) r.planning = parseHomeschoolPlanning(r.planning);
  if (r.revision !== undefined && (!Number.isSafeInteger(r.revision) || r.revision < 0)) throw recordError();
  if (r.restoredAt !== undefined) string(r.restoredAt);
  if (r.audit !== undefined) {
    if (array(r.audit).length > MAX_RECORDS_AUDIT) throw recordError();
    for (const entry of r.audit) {
      assertObject(entry); strings(entry,["at","action"]); number(entry.revision,Number.MAX_SAFE_INTEGER);
      array(entry.fields).forEach(v => string(v,100));
      if (!["local","imported"].includes(entry.origin)) throw recordError();
    }
  }
  if (new TextEncoder().encode(JSON.stringify(r)).length > MAX_RECORDS_BYTES) throw recordError();
  return r;
}
export function recordsMutation(current: Records, next: Records, action = "Records updated", now = new Date().toISOString()): Records {
  const checked = parseRecords(next), revision = (current.revision ?? 0) + 1;
  if (!Number.isSafeInteger(revision)) throw Error("Academic record revision limit reached.");
  const fields = Object.keys(checked).filter(k => !["revision","audit"].includes(k) && JSON.stringify((current as any)[k]) !== JSON.stringify((checked as any)[k]));
  return parseRecords({ ...checked, revision, audit: [...(current.audit ?? []), {revision,at:now,action:action.slice(0,200),fields,origin:"local"}].slice(-MAX_RECORDS_AUDIT) });
}
export interface RecordsIO {
  read(name: string): Promise<string | null>;
  update(name: string, change: (old: string | null) => string | Promise<string>): Promise<string>;
  remove(name: string): Promise<void>;
  exists(id: string): Promise<boolean>;
}
const recordsIO: RecordsIO = {read:loadState,update:updateState,remove:name=>saveState(name,null),exists:competencyProfileExists};
const recordKey = (id: string) => { if (!/^[a-z0-9]{1,24}$/.test(id)) throw Error("Invalid learner profile."); return `records-${id}`; };
export async function loadRecords(studentId: string, io: RecordsIO = recordsIO): Promise<Records> {
  const text = await io.read(recordKey(studentId));
  return text === null ? emptyRecords() : parseRecords(text);
}
export interface RecordsSaveOptions { action?: string; guard?: () => void | Promise<void> }
/** Pure changes can be retried by CAS. Timers/reader updates must use this instead of a stale snapshot. */
export async function updateRecordsAtomic(studentId: string, change: (r: Records) => Records, options: RecordsSaveOptions = {}, io: RecordsIO = recordsIO): Promise<Records> {
  const key = recordKey(studentId);
  const assertScope = async () => { await options.guard?.(); if (!await io.exists(studentId)) throw Error("This learner profile was deleted or no longer exists."); await options.guard?.(); };
  await assertScope();
  const text = await io.update(key, async old => {
    await assertScope();
    const current = old === null ? emptyRecords() : parseRecords(old), next = change(current);
    await assertScope();
    return JSON.stringify(next === current ? current : recordsMutation(current,next,options.action));
  });
  if (!await io.exists(studentId)) { await io.remove(key); throw Error("This learner profile was deleted during saving; its records were removed."); }
  await options.guard?.();
  return parseRecords(text);
}
export async function saveRecords(studentId: string, r: Records, options: RecordsSaveOptions = {}, io: RecordsIO = recordsIO): Promise<Records> {
  const snapshot = parseRecords(r);
  return updateRecordsAtomic(studentId, current => {
    if ((current.revision ?? 0) !== (snapshot.revision ?? 0)) throw Error("Academic records changed in another view. Reload records before saving; your changes were not written.");
    return snapshot;
  }, options, io);
}
/** Explicit full-backup restore: history is not authenticated by encryption or import. */
export function restoredRecords(value: unknown): Records {
  const r = parseRecords(value);
  return parseRecords({ ...r, ...(r.planning === undefined ? {} : {planning: restoreHomeschoolPlanning(r.planning)}), ...(r.academic === undefined ? {} : {academic: restoreAcademicRecords(r.academic)}), restoredAt: new Date().toISOString(), audit: (r.audit ?? []).map(entry => ({...entry,origin:"imported"})) });
}

export function addTime(r: Records, date: string, courseId: string, seconds: number): Records {
  if (seconds <= 0) return r;
  const day = { ...(r.time[date] ?? {}) };
  day[courseId] = (day[courseId] ?? 0) + Math.round(seconds);
  return { ...r, time: { ...r.time, [date]: day } };
}

/**
 * Add (or with a negative number, take back) logged minutes on a course: activity-log entries
 * count as learning time on their course and day, like time tracked in the app, so they reach
 * attendance, hours by subject and every report without special cases.
 */
export function adjustTime(r: Records, date: string, courseId: string, seconds: number): Records {
  if (!seconds) return r;
  const day = { ...(r.time[date] ?? {}) };
  const v = Math.max(0, (day[courseId] ?? 0) + Math.round(seconds));
  if (v) day[courseId] = v;
  else delete day[courseId];
  const time = { ...r.time };
  if (Object.keys(day).length) time[date] = day;
  else delete time[date];
  return { ...r, time };
}

export function addManual(r: Records, e: Omit<ManualEntry, "id">): Records {
  return { ...r, manual: [...r.manual, { ...e, id: uid("m") }].sort((a, b) => a.date.localeCompare(b.date)) };
}

/** The subject a course counts toward for this student. */
export function subjectOf(courseId: string, student: Student | undefined): string {
  const a = student?.assigned.find((x) => x.courseId === courseId);
  if (a) return a.subject;
  const e = CATALOG.find((x) => x.id === courseId);
  switch (e?.subject) {
    case "Math":
      return "Math";
    case "Science":
      return "Science";
    case "Languages":
      return "World languages";
    default:
      return "Other";
  }
}

/** Minutes learned on a day: tracked plus entered by hand. */
export function minutesOn(r: Records, date: string): number {
  const tracked = Object.values(r.time[date] ?? {}).reduce((s, x) => s + x, 0) / 60;
  const manual = r.manual.filter((m) => m.date === date).reduce((s, m) => s + m.minutes, 0);
  return tracked + manual;
}

export type DayStatus = "present" | "absent" | "proposed" | "short" | "none";

export interface DayRow {
  date: string;
  minutes: number;
  status: DayStatus;
}

/** Every day of the school year up to `until` that has learning or a decision. Newest first. */
export function dayRows(r: Records, f: Family, until = today()): DayRow[] {
  const end = until < f.year.end ? until : f.year.end;
  const dates = new Set<string>([...Object.keys(r.time), ...r.manual.map((m) => m.date), ...Object.keys(r.days)]);
  const rows: DayRow[] = [];
  for (const date of dates) {
    if (date < f.year.start || date > end) continue;
    const minutes = minutesOn(r, date);
    const decided = r.days[date];
    const status: DayStatus = decided ?? (minutes >= f.dailyMinutes ? "proposed" : minutes > 0 ? "short" : "none");
    rows.push({ date, minutes, status });
  }
  return rows.sort((a, b) => b.date.localeCompare(a.date));
}

/** Confirm every proposed day (the parent's one-click "looks right"). */
export function confirmProposed(r: Records, f: Family, until = today()): Records {
  const days = { ...r.days };
  for (const row of dayRows(r, f, until)) if (row.status === "proposed") days[row.date] = "present";
  return { ...r, days };
}

export interface YearSummary {
  state?: StateInfo;
  daysPresent: number;
  daysProposed: number;
  hours: number;
  bySubject: { subject: string; hours: number }[];
  /** Days and hours the state asks for in a year, if any. */
  needDays?: number;
  needHours?: number;
  /** Share of the school year gone (0–1), to judge pace. */
  yearElapsed: number;
}

export function yearSummary(r: Records, f: Family, s: Student, until = today()): YearSummary {
  const inYear = (d: string) => d >= f.year.start && d <= f.year.end && d <= until;
  const subj = new Map<string, number>();
  let seconds = 0;
  for (const [date, byCourse] of Object.entries(r.time)) {
    if (!inYear(date)) continue;
    for (const [courseId, sec] of Object.entries(byCourse)) {
      seconds += sec;
      const k = subjectOf(courseId, s);
      subj.set(k, (subj.get(k) ?? 0) + sec);
    }
  }
  for (const m of r.manual) {
    if (!inYear(m.date)) continue;
    seconds += m.minutes * 60;
    subj.set(m.subject, (subj.get(m.subject) ?? 0) + m.minutes * 60);
  }
  const rows = dayRows(r, f, until);
  const state = stateInfo(f.state);
  const total = Math.max(1, daysBetween(f.year.start, f.year.end));
  const gone = Math.min(1, Math.max(0, daysBetween(f.year.start, until) / total));
  return {
    state,
    daysPresent: rows.filter((x) => x.status === "present").length,
    daysProposed: rows.filter((x) => x.status === "proposed").length,
    hours: seconds / 3600,
    bySubject: [...subj].map(([subject, sec]) => ({ subject, hours: sec / 3600 })).sort((a, b) => b.hours - a.hours),
    needDays: state?.rules.days,
    needHours: state ? hoursFor(state.rules, s.grade) : undefined,
    yearElapsed: gone,
  };
}

// ---------- reminders ----------

export interface Reminder {
  /** Stable per school year, so "done" sticks for this year only. */
  key: string;
  date: string;
  text: string;
  custom?: boolean;
}

/** The date in the school year that falls on MM-DD. */
function inYear(f: Family, mmdd: string): string {
  const startYear = Number(f.year.start.slice(0, 4));
  const candidate = `${startYear}-${mmdd}`;
  return candidate >= f.year.start ? candidate : `${startYear + 1}-${mmdd}`;
}

/** Deadlines for this school year from the state's rules, plus the parent's own reminders. */
export function reminders(f: Family): Reminder[] {
  const out: Reminder[] = [];
  const s = stateInfo(f.state);
  const y = f.year.start.slice(0, 4);
  if (s && f.route === "Home education law") {
    const n = s.rules.notice;
    const what = n.kind === "approval" ? "Get this year's homeschool plan approved" : "File the homeschool notice";
    if (n.kind === "annual" || n.kind === "approval") {
      if (n.due) out.push({ key: `notice:${y}`, date: inYear(f, n.due), text: `${what} (${s.name}): ${s.notice}` });
      else if (n.beforeStart !== undefined)
        out.push({ key: `notice:${y}`, date: addDays(f.year.start, -n.beforeStart), text: `${what} (${s.name}): ${s.notice}` });
      else if (n.afterStart !== undefined)
        out.push({ key: `notice:${y}`, date: addDays(f.year.start, n.afterStart), text: `${what} (${s.name}): ${s.notice}` });
      else out.push({ key: `notice:${y}`, date: f.year.start, text: `${what} (${s.name}): ${s.notice}` });
    }
    if (n.kind === "once") {
      const date = n.afterStart !== undefined ? addDays(f.year.start, n.afterStart) : addDays(f.year.start, -(n.beforeStart ?? 0));
      out.push({ key: `notice-once`, date, text: `If this is your first year: ${s.notice}` });
    }
    for (const r of s.rules.reports ?? []) out.push({ key: `report:${r.what}:${y}`, date: inYear(f, r.due), text: `${r.what} due (${s.name})` });
    const testing = f.students.filter((st) => s.rules.testGrades?.includes(st.grade));
    if (testing.length)
      out.push({
        key: `test:${y}`,
        date: addDays(f.year.end, -60),
        text: `Testing year for ${testing.map((t) => t.name).join(", ")}: ${s.assessment}`,
      });
    else if (s.rules.annualAssessment)
      out.push({ key: `assess:${y}`, date: addDays(f.year.end, -60), text: `Yearly assessment (${s.name}): ${s.assessment}` });
  }
  for (const c of f.reminders) out.push({ key: `custom:${c.id}`, date: c.date, text: c.text, custom: true });
  return out.sort((a, b) => a.date.localeCompare(b.date));
}

/** Reminders not marked done that are overdue or within `days` days. */
export function upcoming(f: Family, days = 45, now = today()): Reminder[] {
  const horizon = addDays(now, days);
  return reminders(f).filter((r) => !f.done.includes(r.key) && r.date <= horizon);
}

// A student's school records: time spent learning (tracked in the app and entered by hand),
// and attendance the parent confirmed. One file per student: records-<id>.

import { CATALOG } from "./catalog";
import type { Family, Student } from "./family";
import { addDays, daysBetween, today } from "./srs";
import { hoursFor, stateInfo, type StateInfo } from "./states";
import { loadState, saveState } from "./storage";
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

export async function loadRecords(studentId: string): Promise<Records> {
  const text = await loadState(`records-${studentId}`);
  if (!text) return emptyRecords();
  try {
    return { ...emptyRecords(), ...(JSON.parse(text) as Records) };
  } catch {
    return emptyRecords();
  }
}

export async function saveRecords(studentId: string, r: Records): Promise<void> {
  await saveState(`records-${studentId}`, JSON.stringify(r));
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

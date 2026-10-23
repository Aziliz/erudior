// What goes on the homeschool reports: report card, transcript, portfolio, compliance report.
// Pure functions over the family, a student's progress and records, and the installed courses.

import type { Attempt, Course, Progress } from "./types";
import { answerText, chosenText } from "./questions";
import { CATALOG } from "./catalog";
import { gradingOf, type Family, type Student } from "./family";
import {
  activityDates,
  coursePercent,
  defaultCredits,
  finishedOn,
  gradeParts,
  gradePoints,
  letterFor,
  weightedPoints,
  type CourseGradeParts,
  type CourseLevel,
  type Letter,
} from "./grades";
import { dayRows, subjectOf, type DayRow, type Records, type TestResult } from "./records";
import { addDays, daysBetween } from "./srs";
import { hoursFor, stateInfo } from "./states";

export interface Period {
  from: string;
  to: string;
  label: string;
}

/** The school year (start, end) that contains `date`, using the family's start day. */
export function yearOf(f: Family, date: string): Period {
  if (date >= f.year.start && date <= f.year.end) return { from: f.year.start, to: f.year.end, label: yearLabel(f.year.start, f.year.end) };
  const md = f.year.start.slice(5);
  const y = Number(date.slice(0, 4));
  const start = date >= `${y}-${md}` ? `${y}-${md}` : `${y - 1}-${md}`;
  const end = addDays(`${Number(start.slice(0, 4)) + 1}-${md}`, -1);
  return { from: start, to: end, label: yearLabel(start, end) };
}

export const yearLabel = (from: string, to: string) => `${from.slice(0, 4)}–${to.slice(0, 4)}`;

/** The four quarters of the current school year (equal lengths). */
export function quarters(f: Family): Period[] {
  const n = daysBetween(f.year.start, f.year.end) + 1;
  return [0, 1, 2, 3].map((i) => {
    const from = addDays(f.year.start, Math.round((n * i) / 4));
    const to = i === 3 ? f.year.end : addDays(f.year.start, Math.round((n * (i + 1)) / 4) - 1);
    return { from, to, label: `Quarter ${i + 1}` };
  });
}

/** The student's grade level during a school year (their current grade, counted back). */
export function gradeIn(f: Family, s: Student, yearStart: string): number {
  const back = Number(f.year.start.slice(0, 4)) - Number(yearStart.slice(0, 4));
  return Math.max(0, s.grade - back);
}

export interface StudentData {
  family: Family;
  student: Student;
  progress: Progress;
  records: Records;
  /** Installed courses (for titles, lessons and questions). */
  courses: Course[];
}

export interface CourseRow {
  courseId: string;
  title: string;
  subject: string;
  status: "finished" | "in progress";
  finished?: string;
  parts: CourseGradeParts;
  /** Final percent (override if the parent set one). */
  percent?: number;
  letter?: Letter;
  overridden: boolean;
  overrideNote?: string;
  credits: number;
  level: CourseLevel;
  gradeLevel: number;
  comment?: string;
  /** Hours of tracked study in this course during the year. */
  hours: number;
  yearStart: string;
}

export const titleOf = (id: string, courses: Course[]) =>
  courses.find((c) => c.id === id)?.title ?? CATALOG.find((e) => e.id === id)?.title ?? id;

function courseIds(d: StudentData): Set<string> {
  const ids = new Set<string>([
    ...d.student.assigned.map((a) => a.courseId),
    ...(d.progress.enrolled ?? []),
    ...Object.keys(d.records.courses),
    ...d.records.grades.map((g) => g.courseId),
  ]);
  for (const day of Object.values(d.records.time)) for (const id of Object.keys(day)) if (!id.startsWith("bank:")) ids.add(id);
  // Community courses are free learning only; they never appear on records.
  for (const id of ids) if (id.startsWith("community-")) ids.delete(id);
  return ids;
}

/** Which school year a course is recorded in. */
function recordYear(d: StudentData, id: string): string | undefined {
  const set = d.records.courses[id]?.yearStart;
  if (set) return set;
  const course = d.courses.find((c) => c.id === id);
  const done = finishedOn(id, d.progress, course);
  if (done) return yearOf(d.family, done).from;
  const dates = [
    ...activityDates(id, d.progress),
    ...Object.entries(d.records.time)
      .filter(([, v]) => v[id])
      .map(([k]) => k),
    ...d.records.grades.filter((g) => g.courseId === id).map((g) => g.date),
  ].sort();
  if (!dates.length) return d.student.assigned.some((a) => a.courseId === id) ? d.family.year.start : undefined;
  // Not finished: it belongs to the current year if worked on this year, else the year it was last worked on.
  const last = dates[dates.length - 1];
  return yearOf(d.family, last).from;
}

export function courseRow(d: StudentData, id: string, until?: string): CourseRow {
  const { cutoffs, weights } = gradingOf(d.family);
  const rec = d.records.courses[id] ?? {};
  const course = d.courses.find((c) => c.id === id);
  const parts = gradeParts(id, d.progress, d.records.grades, until);
  const computed = coursePercent(parts, weights);
  const percent = rec.percentOverride ?? computed;
  const finished = finishedOn(id, d.progress, course);
  const yearStart = recordYear(d, id) ?? d.family.year.start;
  const yr = yearOf(d.family, yearStart);
  let sec = 0;
  for (const [date, v] of Object.entries(d.records.time)) if (date >= yr.from && date <= yr.to) sec += v[id] ?? 0;
  return {
    courseId: id,
    title: titleOf(id, d.courses),
    subject: subjectOf(id, d.student),
    status: finished && (!until || finished <= until) ? "finished" : "in progress",
    finished,
    parts,
    percent,
    letter: percent === undefined ? undefined : letterFor(percent, cutoffs),
    overridden: rec.percentOverride !== undefined,
    overrideNote: rec.overrideNote,
    credits: rec.credits ?? defaultCredits(id),
    level: rec.level ?? "regular",
    gradeLevel: rec.gradeLevel ?? gradeIn(d.family, d.student, yearStart),
    comment: rec.comment,
    hours: sec / 3600,
    yearStart,
  };
}

/** Courses on the student's record for one school year. */
export function coursesInYear(d: StudentData, yearStart: string): CourseRow[] {
  return [...courseIds(d)]
    .filter((id) => recordYear(d, id) === yearStart)
    .map((id) => courseRow(d, id))
    .sort((a, b) => a.subject.localeCompare(b.subject) || a.title.localeCompare(b.title));
}

/** School years with anything on record, newest first (always includes the current year). */
export function recordYears(d: StudentData): string[] {
  const ys = new Set<string>([d.family.year.start]);
  for (const id of courseIds(d)) {
    const y = recordYear(d, id);
    if (y) ys.add(y);
  }
  for (const date of Object.keys(d.records.time)) ys.add(yearOf(d.family, date).from);
  for (const o of d.records.outside) ys.add(o.yearStart);
  return [...ys].sort().reverse();
}

// ---------- report card ----------

export interface ReportCard {
  year: Period;
  gradeLevel: number;
  rows: CourseRow[];
  daysPresent: number;
  hours: number;
}

export function reportCard(d: StudentData, yearStart: string): ReportCard {
  const year = yearOf(d.family, yearStart);
  const rows = dayRows(d.records, d.family.year.start === year.from ? d.family : { ...d.family, year: { start: year.from, end: year.to } }, year.to);
  let sec = 0;
  for (const [date, v] of Object.entries(d.records.time)) if (date >= year.from && date <= year.to) for (const x of Object.values(v)) sec += x;
  const manual = d.records.manual.filter((m) => m.date >= year.from && m.date <= year.to).reduce((s, m) => s + m.minutes * 60, 0);
  return {
    year,
    gradeLevel: gradeIn(d.family, d.student, year.from),
    rows: coursesInYear(d, year.from),
    daysPresent: rows.filter((r) => r.status === "present").length,
    hours: (sec + manual) / 3600,
  };
}

// ---------- transcript ----------

export interface TranscriptLine {
  title: string;
  subject: string;
  percent?: number;
  letter?: Letter;
  credits: number;
  level: CourseLevel;
  status: "finished" | "in progress";
  where?: string;
}

export interface TranscriptYear {
  year: Period;
  gradeLevel: number;
  lines: TranscriptLine[];
  credits: number;
  gpa?: number;
  weightedGpa?: number;
}

export interface Transcript {
  years: TranscriptYear[];
  credits: number;
  gpa?: number;
  weightedGpa?: number;
  bySubject: { subject: string; credits: number }[];
}

function gpa(lines: TranscriptLine[]): { credits: number; gpa?: number; weightedGpa?: number } {
  const counted = lines.filter((l) => l.status === "finished" && l.letter && l.credits > 0);
  const credits = counted.reduce((s, l) => s + l.credits, 0);
  if (!credits) return { credits };
  const g = counted.reduce((s, l) => s + gradePoints(l.letter!) * l.credits, 0) / credits;
  const w = counted.reduce((s, l) => s + weightedPoints(l.letter!, l.level) * l.credits, 0) / credits;
  return { credits, gpa: g, weightedGpa: w };
}

/**
 * High school transcript: courses with credit (finished ones count; this year's unfinished ones
 * are listed as in progress) and courses taken elsewhere, by school year.
 */
export function transcript(d: StudentData): Transcript {
  const { cutoffs } = gradingOf(d.family);
  const byYear = new Map<string, TranscriptLine[]>();
  const add = (y: string, l: TranscriptLine) => byYear.set(y, [...(byYear.get(y) ?? []), l]);
  for (const id of courseIds(d)) {
    const r = courseRow(d, id);
    if (r.credits <= 0) continue;
    if (r.status === "in progress" && r.yearStart !== d.family.year.start) continue;
    if (r.gradeLevel < 9 && r.status !== "finished") continue;
    add(r.yearStart, { title: r.title, subject: r.subject, percent: r.percent, letter: r.letter, credits: r.credits, level: r.level, status: r.status });
  }
  for (const o of d.records.outside)
    add(o.yearStart, {
      title: o.title,
      subject: o.subject,
      percent: o.percent,
      letter: o.letter ?? (o.percent !== undefined ? letterFor(o.percent, cutoffs) : undefined),
      credits: o.credits,
      level: o.level,
      status: "finished",
      where: o.where,
    });
  const years = [...byYear.keys()].sort().map((y) => {
    const lines = byYear.get(y)!.sort((a, b) => a.subject.localeCompare(b.subject) || a.title.localeCompare(b.title));
    const outsideGrade = d.records.outside.find((o) => o.yearStart === y)?.gradeLevel;
    return { year: yearOf(d.family, y), gradeLevel: outsideGrade ?? gradeIn(d.family, d.student, y), lines, ...gpa(lines) };
  });
  const all = years.flatMap((y) => y.lines);
  const subj = new Map<string, number>();
  for (const l of all) if (l.status === "finished") subj.set(l.subject, (subj.get(l.subject) ?? 0) + l.credits);
  return { years, ...gpa(all), bySubject: [...subj].map(([subject, credits]) => ({ subject, credits })).sort((a, b) => b.credits - a.credits) };
}

// ---------- compliance report ----------

export interface MaterialLine {
  courseId: string;
  title: string;
  /** Lessons finished in the period, in order of completion. */
  lessons: { title: string; date: string }[];
  /** Module tests and exams taken in the period. */
  tests: { title: string; date: string; percent: number }[];
}

export interface Compliance {
  period: Period;
  year: Period;
  days: DayRow[];
  daysPresent: number;
  daysPresentYear: number;
  hours: number;
  hoursYear: number;
  bySubject: { subject: string; hours: number }[];
  material: Map<string, MaterialLine[]>;
  manual: { date: string; subject: string; minutes: number; note: string }[];
  grades: CourseRow[];
  tests: TestResult[];
  narratives: Record<string, string>;
  needDays?: number;
  needHours?: number;
}

export const periodKey = (p: { from: string; to: string }) => `${p.from}..${p.to}`;

function hoursBetween(d: StudentData, from: string, to: string) {
  const subj = new Map<string, number>();
  let sec = 0;
  for (const [date, byCourse] of Object.entries(d.records.time)) {
    if (date < from || date > to) continue;
    for (const [id, s] of Object.entries(byCourse)) {
      sec += s;
      const k = id.startsWith("bank:") ? "Other" : subjectOf(id, d.student);
      subj.set(k, (subj.get(k) ?? 0) + s);
    }
  }
  for (const m of d.records.manual) {
    if (m.date < from || m.date > to) continue;
    sec += m.minutes * 60;
    subj.set(m.subject, (subj.get(m.subject) ?? 0) + m.minutes * 60);
  }
  return { hours: sec / 3600, bySubject: [...subj].map(([subject, s]) => ({ subject, hours: s / 3600 })).sort((a, b) => b.hours - a.hours) };
}

export function compliance(d: StudentData, period: Period): Compliance {
  const year = yearOf(d.family, period.from);
  const fam = { ...d.family, year: { start: year.from, end: year.to } };
  const all = dayRows(d.records, fam, period.to);
  const days = all.filter((r) => r.date >= period.from);
  const span = hoursBetween(d, period.from, period.to);
  const ytd = hoursBetween(d, year.from, period.to);
  const material = new Map<string, MaterialLine[]>();
  const inP = (date: string) => date >= period.from && date <= period.to;
  for (const id of courseIds(d)) {
    const course = d.courses.find((c) => c.id === id);
    const lessons = Object.entries(d.progress.lessonsDone)
      .filter(([k, date]) => k.startsWith(`${id}/`) && inP(date))
      .map(([k, date]) => ({ title: course?.lessons.find((l) => `${id}/${l.id}` === k)?.title ?? k.slice(id.length + 1), date }))
      .sort((a, b) => a.date.localeCompare(b.date));
    const tests = d.progress.attempts
      .filter((a) => a.bankId.startsWith(`${id}__`) && (a.module || (a.mode === "exam" && !a.lesson)) && inP(a.finishedAt.slice(0, 10)))
      .map((a) => ({
        title: a.module ? `Module test: ${course?.modules.find((m) => m.id === a.module!.moduleId)?.title ?? a.module.moduleId}` : "Full practice exam",
        date: a.finishedAt.slice(0, 10),
        percent: a.total ? (a.correct / a.total) * 100 : 0,
      }));
    if (!lessons.length && !tests.length) continue;
    const subject = subjectOf(id, d.student);
    material.set(subject, [...(material.get(subject) ?? []), { courseId: id, title: titleOf(id, d.courses), lessons, tests }]);
  }
  const st = stateInfo(d.family.state);
  return {
    period,
    year,
    days,
    daysPresent: days.filter((r) => r.status === "present").length,
    daysPresentYear: all.filter((r) => r.status === "present").length,
    hours: span.hours,
    hoursYear: ytd.hours,
    bySubject: span.bySubject,
    material,
    manual: d.records.manual.filter((m) => inP(m.date)),
    grades: [...courseIds(d)]
      .map((id) => courseRow(d, id, period.to))
      .filter((r) => r.yearStart === year.from && r.percent !== undefined)
      .sort((a, b) => a.subject.localeCompare(b.subject)),
    tests: d.records.tests.filter((t) => inP(t.date)),
    narratives: d.records.narratives[periodKey(period)] ?? {},
    needDays: st?.rules.days,
    needHours: st ? hoursFor(st.rules, d.student.grade) : undefined,
  };
}

// ---------- portfolio ----------

export interface PortfolioPhoto {
  id: string;
  date: string;
  subject: string;
  caption: string;
  /** JPEG data URL, resized on the way in. */
  image: string;
}

export interface WorkSample {
  courseId: string;
  title: string;
  subject: string;
  attempt: Attempt;
  label: string;
  questions: { stem: string; chosen: string; answer: string; correct: boolean }[];
}

/** The best module test per module, and the best full exam, for each course in the year. */
export function workSamples(d: StudentData, yearStart: string): WorkSample[] {
  const year = yearOf(d.family, yearStart);
  const out: WorkSample[] = [];
  for (const row of coursesInYear(d, year.from)) {
    const course = d.courses.find((c) => c.id === row.courseId);
    const attempts = d.progress.attempts.filter((a) => a.bankId.startsWith(`${row.courseId}__`));
    const groups = new Map<string, Attempt>();
    for (const a of attempts) {
      const key = a.module ? `m:${a.module.moduleId}` : a.mode === "exam" && !a.lesson ? "exam" : null;
      if (!key) continue;
      const cur = groups.get(key);
      const score = a.total ? a.correct / a.total : 0;
      if (!cur || score > (cur.total ? cur.correct / cur.total : 0)) groups.set(key, a);
    }
    for (const [key, a] of groups) {
      const bank = course?.banks.find((b) => b.id === a.bankId);
      const byId = new Map(bank?.questions.map((q) => [q.id, q]) ?? []);
      const label = key === "exam" ? "Full practice exam" : `Module test: ${course?.modules.find((m) => `m:${m.id}` === key)?.title ?? key.slice(2)}`;
      out.push({
        courseId: row.courseId,
        title: row.title,
        subject: row.subject,
        attempt: a,
        label,
        questions: a.answers.map((ans) => {
          const q = byId.get(ans.qid);
          return {
            stem: q?.stem ?? ans.qid,
            chosen: q ? chosenText(q, ans.chosen) || "(no answer)" : "",
            answer: q ? answerText(q) : "",
            correct: ans.correct,
          };
        }),
      });
    }
  }
  return out;
}

// Grades for homeschool records: a percent per course from the app's quizzes and exams plus
// grades the parent enters, letter grades on an A–F scale with +/-, credits and GPA.

import type { Attempt, Course, Progress } from "./types";
import { CATALOG, courseFinished } from "./catalog";

// ---------- scale ----------

export interface Cutoffs {
  A: number;
  B: number;
  C: number;
  D: number;
}

/** The loosest scale allowed. Parents may make it stricter (higher), never looser. */
export const MIN_CUTOFFS: Cutoffs = { A: 90, B: 80, C: 70, D: 60 };

export interface Weights {
  /** End-of-lesson quizzes. */
  lessons: number;
  /** End-of-module tests. */
  modules: number;
  /** The course's full practice exam. */
  final: number;
  /** Grades the parent entered for work done outside the app. */
  parent: number;
}

export const DEFAULT_WEIGHTS: Weights = { lessons: 25, modules: 35, final: 25, parent: 15 };

export function cutoffProblem(c: Cutoffs): string | null {
  for (const k of ["A", "B", "C", "D"] as const) {
    if (!Number.isFinite(c[k])) return `Enter a number for ${k}.`;
    if (c[k] < MIN_CUTOFFS[k]) return `${k} can't start below ${MIN_CUTOFFS[k]}%; the scale can only be made stricter.`;
  }
  if (c.A > 100) return "A can't start above 100%.";
  if (!(c.A > c.B && c.B > c.C && c.C > c.D)) return "Each letter has to start higher than the one below it.";
  return null;
}

export type Letter = "A+" | "A" | "A-" | "B+" | "B" | "B-" | "C+" | "C" | "C-" | "D+" | "D" | "D-" | "F";

/** Letter for a percent (rounded to a whole number first). Plus = top 30% of a band, minus = bottom 30%. */
export function letterFor(percent: number, c: Cutoffs = MIN_CUTOFFS): Letter {
  const p = Math.round(percent);
  const bands: [keyof Cutoffs, number, number][] = [
    ["A", c.A, 100],
    ["B", c.B, c.A],
    ["C", c.C, c.B],
    ["D", c.D, c.C],
  ];
  for (const [l, lo, hi] of bands) {
    if (p < lo) continue;
    const w = hi - lo;
    if (p >= lo + 0.7 * w) return `${l}+` as Letter;
    if (p < lo + 0.3 * w) return `${l}-` as Letter;
    return l as Letter;
  }
  return "F";
}

const POINTS: Record<Letter, number> = {
  "A+": 4.0, A: 4.0, "A-": 3.7,
  "B+": 3.3, B: 3.0, "B-": 2.7,
  "C+": 2.3, C: 2.0, "C-": 1.7,
  "D+": 1.3, D: 1.0, "D-": 0.7,
  F: 0,
};

export type CourseLevel = "regular" | "honors" | "ap";
export const LEVEL_LABEL: Record<CourseLevel, string> = { regular: "Regular", honors: "Honors", ap: "AP / dual credit" };
const LEVEL_BONUS: Record<CourseLevel, number> = { regular: 0, honors: 0.5, ap: 1.0 };

export const gradePoints = (l: Letter) => POINTS[l];
/** Weighted points: Honors +0.5, AP / dual credit +1.0, on passing grades only. */
export const weightedPoints = (l: Letter, level: CourseLevel) => POINTS[l] + (l === "F" ? 0 : LEVEL_BONUS[level]);

/** Default credits for a catalog course: 1.0 for high school, college and language-level courses. */
export function defaultCredits(courseId: string): number {
  const e = CATALOG.find((x) => x.id === courseId);
  if (!e) return 0;
  if (e.subject === "Languages") return 1;
  return e.level.some((l) => l === "High School" || l === "College") ? 1 : 0;
}

// ---------- course percent ----------

export interface ParentGrade {
  id: string;
  courseId: string;
  date: string;
  title: string;
  percent: number;
}

export interface CourseGradeParts {
  lessons?: number;
  modules?: number;
  final?: number;
  parent?: number;
  /** Counts behind each part, for the report. */
  counts: { lessons: number; modules: number; final: number; parent: number };
}

const pct = (a: Attempt) => (a.total ? (a.correct / a.total) * 100 : 0);
const mean = (xs: number[]) => (xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : undefined);

/** Best score per lesson quiz, per module test and on the full exam, plus the parent's grades. */
export function gradeParts(courseId: string, p: Progress, parentGrades: ParentGrade[], until?: string): CourseGradeParts {
  const pre = `${courseId}__`;
  const mine = p.attempts.filter((a) => a.bankId.startsWith(pre) && (!until || a.finishedAt.slice(0, 10) <= until));
  const best = (key: (a: Attempt) => string | null) => {
    const m = new Map<string, number>();
    for (const a of mine) {
      const k = key(a);
      if (k !== null) m.set(k, Math.max(m.get(k) ?? 0, pct(a)));
    }
    return [...m.values()];
  };
  // Honors work is optional extra content: it doesn't count toward the grade.
  const entry = CATALOG.find((e) => e.id === courseId);
  const hl = new Set(entry?.honorsLessonIds ?? []);
  const hm = new Set(entry?.honorsModuleIds ?? []);
  const lessons = best((a) => (a.lesson && !hl.has(a.lesson.lessonId) ? a.lesson.lessonId : null));
  const modules = best((a) => (a.module && !hm.has(a.module.moduleId) ? a.module.moduleId : null));
  const finals = best((a) => (a.mode === "exam" && !a.lesson && !a.module ? "final" : null));
  const parent = parentGrades.filter((g) => g.courseId === courseId && (!until || g.date <= until)).map((g) => g.percent);
  return {
    lessons: mean(lessons),
    modules: mean(modules),
    final: finals.length ? Math.max(...finals) : undefined,
    parent: mean(parent),
    counts: { lessons: lessons.length, modules: modules.length, final: finals.length, parent: parent.length },
  };
}

/** Weighted course percent over the parts that exist; undefined when nothing is graded yet. */
export function coursePercent(parts: CourseGradeParts, w: Weights = DEFAULT_WEIGHTS): number | undefined {
  let sum = 0;
  let total = 0;
  for (const k of ["lessons", "modules", "final", "parent"] as const) {
    const v = parts[k];
    if (v === undefined || w[k] <= 0) continue;
    sum += v * w[k];
    total += w[k];
  }
  return total ? sum / total : undefined;
}

// ---------- per-course record ----------

/** What the parent set for a course on this student's records. */
export interface CourseRecord {
  credits?: number;
  level?: CourseLevel;
  /** Replaces the computed percent (with a reason shown on the report). */
  percentOverride?: number;
  overrideNote?: string;
  /** Comment printed on the report card. */
  comment?: string;
  /** School year (its start date) the course is recorded in; defaults to the year it was finished. */
  yearStart?: string;
  /** Grade level when taken, if different from the student's grade that year. */
  gradeLevel?: number;
}

/** A course taken somewhere else (another school, co-op, community college) for the transcript. */
export interface OutsideCourse {
  id: string;
  title: string;
  subject: string;
  /** School year start, YYYY-MM-DD (e.g. 2025-08-01). */
  yearStart: string;
  gradeLevel: number;
  percent?: number;
  letter?: Letter;
  credits: number;
  level: CourseLevel;
  where: string;
}

/** The date a course was finished (last lesson or passing full exam), if it is. */
export function finishedOn(courseId: string, p: Progress, course?: Course): string | undefined {
  const f = courseFinished(courseId, p, course);
  if (!f.done) return undefined;
  const dates = Object.entries(p.lessonsDone)
    .filter(([k]) => k.startsWith(`${courseId}/`))
    .map(([, d]) => d);
  const exams = p.attempts
    .filter((a) => a.mode === "exam" && !a.lesson && !a.module && a.bankId.startsWith(`${courseId}__`))
    .map((a) => a.finishedAt.slice(0, 10));
  const all = [...dates, ...exams].sort();
  return all[all.length - 1];
}

/** Every day something was done in a course (lessons, quizzes, exams), for placing it in a school year. */
export function activityDates(courseId: string, p: Progress): string[] {
  const d = Object.entries(p.lessonsDone)
    .filter(([k]) => k.startsWith(`${courseId}/`))
    .map(([, v]) => v);
  const a = p.attempts.filter((x) => x.bankId.startsWith(`${courseId}__`)).map((x) => x.finishedAt.slice(0, 10));
  return [...d, ...a].sort();
}

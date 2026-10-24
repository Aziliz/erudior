// The course catalog: every course Erudior offers. Courses aren't installed until someone
// adds one ("Start course"); then it's stored like any other course and shows under In
// progress. samples/catalog.json (written by content/math/build.py) is bundled as a snapshot;
// when the build sets VITE_COURSES_URL, the signed catalog on the website replaces it at
// startup and course files are downloaded from there (see courseSource.ts).

import catalogJson from "../../samples/catalog.json";
import type { Course, Progress } from "./types";
import { attemptPassed } from "./session";
import { coreLessons } from "./course";
import { REMOTE, downloadCourse } from "./courseSource";
import { LEVELS, TYPES, normalizeLevels, normalizeTypes } from "./taxonomy";

export interface CatalogEntry {
  id: string;
  /** Course JSON, relative to samples/. */
  file: string;
  order: number;
  title: string;
  description: string;
  revision: number;
  subject: string;
  level: string[];
  type: string[];
  /** Core lessons. */
  lessons: number;
  /** Optional honors lessons. */
  honors?: number;
  questions: number;
  cards: number;
  drills: number;
  /** Core lesson ids, in order (to tell whether a prerequisite course is finished). */
  lessonIds?: string[];
  /** Honors lessons and modules (optional; left out of grades and finishing). */
  honorsLessonIds?: string[];
  honorsModuleIds?: string[];
  /** Courses that must be finished first (catalog ids). */
  requires?: string[];
  /** Language courses: words carried over from earlier courses (included in `words`). */
  carried?: number;
  /** Lesson plan: module titles and their lesson titles. */
  outline?: { title: string; lessons: string[]; honors?: string[]; isHonors?: boolean }[];
  /** Language courses: target vocabulary size and items in the course. */
  words?: number;
  /** Published catalogs only: size and SHA-256 of the course file (covered by the catalog signature). */
  bytes?: number;
  sha256?: string;
}

/** The current catalog. Replaced in place by setCatalog, so modules can keep a reference. */
// Labels are normalized so catalogs published before the current level/type lists still sort and filter.
const tidy = (e: CatalogEntry): CatalogEntry => ({ ...e, level: normalizeLevels(e.level ?? []), type: normalizeTypes(e.type ?? []) });

export const CATALOG: CatalogEntry[] = (catalogJson as CatalogEntry[]).map(tidy);

export function setCatalog(entries: CatalogEntry[]) {
  CATALOG.splice(0, CATALOG.length, ...entries.map(tidy));
}

export async function loadCatalogCourse(entry: CatalogEntry): Promise<unknown> {
  if (REMOTE) return downloadCourse(entry);
  // Bundled builds: each course is its own chunk, fetched only when it's added or updated.
  const { bundledCourse } = await import("./bundledCourses");
  return bundledCourse(entry.file);
}

export const catalogEntry = (id: string) => CATALOG.find((e) => e.id === id);


/** Filter values in a stable order: by how they appear in the catalog. */
export function facets() {
  const uniq = (xs: string[]) => [...new Set(xs)];
  return {
    subject: uniq(CATALOG.map((e) => e.subject)),
    // Every level and type is always offered, so the choices don't shift as courses are added.
    level: [...LEVELS] as string[],
    type: [...TYPES] as string[],
  };
}

/** True if the person has done anything in this course (lessons, quizzes, cards, drills, a plan). */
export function hasActivity(courseId: string, p: Progress): boolean {
  const pre = `${courseId}/`;
  const bankPre = `${courseId}__`;
  const anyKey = (o?: Record<string, unknown>, prefix = pre) => !!o && Object.keys(o).some((k) => k.startsWith(prefix));
  return (
    anyKey(p.lessonsDone) ||
    anyKey(p.modulesDone) ||
    anyKey(p.cards) ||
    anyKey(p.drills) ||
    anyKey(p.stats, bankPre) ||
    anyKey(p.qmeta, bankPre) ||
    !!p.plans[courseId] ||
    p.attempts.some((a) => a.bankId.startsWith(bankPre))
  );
}

/** Courses newer in the catalog than the installed copy. */
export async function catalogUpdates(installed: Course[]): Promise<{ entry: CatalogEntry; course: unknown }[]> {
  const out = [];
  for (const e of CATALOG) {
    const mine = installed.find((c) => c.id === e.id);
    if (!mine || e.revision <= (mine.revision ?? 0)) continue;
    try {
      out.push({ entry: e, course: await loadCatalogCourse(e) });
    } catch {
      /* offline or not published yet: offered again next start */
    }
  }
  return out;
}

export interface Prerequisite {
  id: string;
  title: string;
  done: boolean;
  lessonsDone: number;
  lessons: number;
  /** Finished by passing the course's full practice exam rather than every lesson. */
  byExam: boolean;
}

/**
 * A course is finished when every lesson is complete, or when its full practice exam has
 * been passed (for learners who already know the material).
 */
export function prerequisites(entry: CatalogEntry, p: Progress): Prerequisite[] {
  return (entry.requires ?? []).map((id) => courseFinished(id, p));
}

/** How far along a course is, and whether it counts as finished (catalog or library course). */
export function courseFinished(id: string, p: Progress, course?: Course): Prerequisite {
  const req = catalogEntry(id);
  const ids = req?.lessonIds ?? (course ? coreLessons(course).map((l) => l.id) : []);
  const lessonsDone = ids.filter((l) => p.lessonsDone[`${id}/${l}`]).length;
  const byExam = p.attempts.some(
    (a) => a.mode === "exam" && !a.lesson && !a.module && a.bankId.startsWith(`${id}__`) && attemptPassed(a) === true,
  );
  return { id, title: req?.title ?? course?.title ?? id, lessonsDone, lessons: ids.length, byExam, done: (ids.length > 0 && lessonsDone === ids.length) || byExam };
}

export const isLocked = (entry: CatalogEntry, p: Progress) => prerequisites(entry, p).some((r) => !r.done);

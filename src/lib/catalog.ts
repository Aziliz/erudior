// The course catalog: every course that ships with the app. Courses aren't installed
// until someone adds one ("Start course"); then it's stored like any other course and
// shows under In progress. samples/catalog.json is written by content/math/build.py.

import catalogJson from "../../samples/catalog.json";
import type { Course, Progress } from "./types";

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
  lessons: number;
  questions: number;
  cards: number;
  drills: number;
}

export const CATALOG = catalogJson as CatalogEntry[];

// Each course is its own chunk, fetched only when it's added or updated.
const FILES = import.meta.glob<{ default: unknown }>(["../../samples/math/*.json", "../../samples/colorado-broker-course.json"]);

export async function loadCatalogCourse(entry: CatalogEntry): Promise<unknown> {
  const load = FILES[`../../samples/${entry.file}`];
  if (!load) throw new Error(`Course file ${entry.file} isn't bundled`);
  return (await load()).default;
}

export const catalogEntry = (id: string) => CATALOG.find((e) => e.id === id);

const LEVELS = ["Middle school", "High school", "College", "Graduate", "Professional"];
const levelRank = (l: string) => (LEVELS.includes(l) ? LEVELS.indexOf(l) : LEVELS.length);

/** Filter values in a stable order: by how they appear in the catalog. */
export function facets() {
  const uniq = (xs: string[]) => [...new Set(xs)];
  return {
    subject: uniq(CATALOG.map((e) => e.subject)),
    level: uniq(CATALOG.flatMap((e) => e.level)).sort((a, b) => levelRank(a) - levelRank(b)),
    type: uniq(CATALOG.flatMap((e) => e.type)),
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
    if (mine && e.revision > (mine.revision ?? 0)) out.push({ entry: e, course: await loadCatalogCourse(e) });
  }
  return out;
}

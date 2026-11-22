import { compareCourseRevisions } from "../../src/lib/courseRevision";
import type { Course } from "../../src/lib/types";

interface LessonMove {
  lesson: string;
  from: string;
  to: string;
}

/** A publisher-owned migration may change the grouping of named lessons in one exact pair
 * of releases. Progress and VM receipts use course and lesson IDs. All other revision
 * comparisons, including missing lessons/modules and scenario changes, still run. */
export function compareWithLessonMoves(previous: Course, next: Course, receipt: unknown, fromHash: string, toHash: string) {
  if (!receipt || typeof receipt !== "object") throw Error("Invalid lesson move receipt.");
  const r = receipt as Record<string, unknown>;
  if (previous.id !== next.id || r.courseId !== previous.id || r.fromRevision !== (previous.revision ?? 1) ||
      r.toRevision !== next.revision || r.fromSha256 !== fromHash || r.toSha256 !== toHash || !Array.isArray(r.moves))
    throw Error("Lesson moves do not match these course releases.");

  const destinations = new Map(next.lessons.map(l => [l.id, l.module]));
  const moves: LessonMove[] = [];
  for (const l of previous.lessons) {
    const to = destinations.get(l.id);
    if (to && to !== l.module) moves.push({ lesson: l.id, from: l.module, to });
  }
  const recorded: unknown[] = r.moves;
  if (!moves.length || recorded.length !== moves.length || !moves.every(m => recorded.some(row => {
    if (!row || typeof row !== "object") return false;
    const item = row as Record<string, unknown>;
    return item.lesson === m.lesson && item.from === m.from && item.to === m.to;
  }))) throw Error("Lesson moves must record every exact old and new module assignment.");

  const relocated = new Map(moves.map(m => [m.lesson, m.to]));
  const lessons = previous.lessons.map(l => relocated.has(l.id) ? { ...l, module: relocated.get(l.id)! } : l);
  return compareCourseRevisions({ ...previous, lessons }, next);
}

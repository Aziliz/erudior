import type { Confidence } from "./review";
import type { Attempt, Bank, Chosen, Course, Progress } from "./types";
import { attemptPassed, finishSession, type Session } from "./session";
import { lessonKey, logActivity } from "./planner";
import { today } from "./srs";
import { moduleCoreLessons } from "./course";

/**
 * Fold a finished quiz or practice session into progress: the attempt and question
 * stats, today's activity, and (for a passed lesson or module quiz) completion.
 */
export function recordSession(
  p: Progress,
  session: Session,
  answers: Record<string, Chosen>,
  flags: Record<string, boolean>,
  bank: Bank | undefined,
  usedSec?: number,
  confidence: Record<string, Confidence> = {},
): { progress: Progress; attempt: Attempt } {
  const { attempt, progress } = finishSession(session, answers, flags, p, bank, usedSec, confidence);
  let next = logActivity(progress, "questions", attempt.answered);
  if (session.lesson && attemptPassed(attempt)) {
    const key = lessonKey(session.lesson.courseId, session.lesson.lessonId);
    if (!next.lessonsDone[key]) {
      next = logActivity({ ...next, lessonsDone: { ...next.lessonsDone, [key]: today() } }, "lessons");
    }
  }
  if (session.module && attemptPassed(attempt)) {
    const key = `${session.module.courseId}/${session.module.moduleId}`;
    if (!next.modulesDone?.[key]) next = { ...next, modulesDone: { ...(next.modulesDone ?? {}), [key]: today() } };
  }
  return { progress: next, attempt };
}

/** Best score so far on a lesson's or module's quiz. */
export function bestQuizScore(
  p: Progress,
  courseId: string,
  ref: { lessonId: string } | { moduleId: string },
): { correct: number; total: number; tries: number } | null {
  const tries = p.attempts.filter((a) =>
    "lessonId" in ref
      ? a.lesson?.courseId === courseId && a.lesson.lessonId === ref.lessonId
      : a.module?.courseId === courseId && a.module.moduleId === ref.moduleId,
  );
  if (!tries.length) return null;
  const best = tries.reduce((b, a) => (a.correct / a.total > b.correct / b.total ? a : b));
  return { correct: best.correct, total: best.total, tries: tries.length };
}

export const moduleKey = (courseId: string, moduleId: string) => `${courseId}/${moduleId}`;

/** True once every lesson in the module is complete. */
export function moduleLessonsDone(course: Course, p: Progress, moduleId: string): boolean {
  return moduleCoreLessons(course, moduleId).every((l) => p.lessonsDone[lessonKey(course.id, l.id)]);
}

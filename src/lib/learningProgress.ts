import { coreLessons, isHonorsLesson } from "./course";
import { attemptPassed, lessonQuizQuestions } from "./session";
import type { Attempt, Course, Progress } from "./types";

export type CourseProgressStatus = "not-started" | "in-progress" | "complete" | "no-checkpoints";

/** A display summary of the learner's recorded work, never a grade or credential. */
export interface CourseProgressSummary {
  courseId: string;
  title: string;
  status: CourseProgressStatus;
  /** Core-lesson completion; a qualifying full-course exam can finish the course. */
  percent: number | null;
  complete: boolean;
  completionBasis: "lessons" | "exam" | null;
  /** Aliases for core lesson counts, kept separate from optional practice. */
  completedUnits: number;
  totalUnits: number;
  lessonsDone: number;
  lessonsTotal: number;
  /** Runnable, non-honors module quizzes. These do not change course finishing rules. */
  moduleQuizzesDone: number;
  moduleQuizzesTotal: number;
  nextLessonId: string | null;
  nextModuleId: string | null;
  /** Newest first, scoped to this course. */
  attempts: Attempt[];
  questionsAnswered: number;
  /** Correct / actually answered, rather than treating unanswered questions as answers. */
  accuracy: number | null;
  /** Time recorded in this course's finished exam and practice sessions only. */
  studySeconds: number;
  lastStudiedAt: string | null;
}

export interface EnrollmentProgressSummary {
  courses: CourseProgressSummary[];
  enrolledCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  notStartedCourses: number;
  unmeasuredCourses: number;
  /** Equal share per enrolled course; a course without measurable progress contributes 0. */
  percent: number | null;
  lessonsDone: number;
  lessonsTotal: number;
  moduleQuizzesDone: number;
  moduleQuizzesTotal: number;
}

function ownedBankIds(course: Course): Set<string> {
  return new Set(course.banks.filter(bank => !bank.courseId || bank.courseId === course.id).map(bank => bank.id));
}

function timestamp(value: string): number {
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

/**
 * A current bank or an explicit historical course reference identifies ownership.
 * A conflicting explicit reference must never leak another course's results into this one.
 * Bank-name prefixes alone are not sufficient to establish ownership.
 */
export function courseAttempts(course: Course, progress: Progress): Attempt[] {
  const banks = ownedBankIds(course);
  return progress.attempts.filter(attempt => {
    const references = [attempt.lesson?.courseId, attempt.module?.courseId].filter((id): id is string => id !== undefined);
    if (references.some(id => id !== course.id)) return false;
    return banks.has(attempt.bankId) || references.includes(course.id);
  }).slice().sort((a, b) => timestamp(b.finishedAt) - timestamp(a.finishedAt));
}

function hasRecordedActivity(course: Course, progress: Progress, attempts: Attempt[]): boolean {
  if (attempts.length) return true;
  const prefix = `${course.id}/`;
  const scoped = (values: Record<string, unknown> | undefined) =>
    !!values && Object.keys(values).some(key => key.startsWith(prefix));
  return scoped(progress.lessonsDone) || scoped(progress.modulesDone) || scoped(progress.cards)
    || scoped(progress.drills) || scoped(progress.vocab) || scoped(progress.reading) || scoped(progress.work)
    || course.banks.some(bank => (!bank.courseId || bank.courseId === course.id) && Object.keys(progress.stats[bank.id] ?? {}).length > 0)
    || !!progress.logs?.some(log => log.courseId === course.id);
}

/**
 * Preserve Erudior's existing finishing rule: all current core lessons, or a passed full
 * exam. A passed exam does not manufacture lesson completions. Honors work, module-quiz
 * passes, question accuracy, and activity time remain separate measures.
 */
export function courseProgress(course: Course, progress: Progress): CourseProgressSummary {
  const moduleOrder = new Map(course.modules.map((module, index) => [module.id, index]));
  const lessons = coreLessons(course).slice().sort((a, b) =>
    (moduleOrder.get(a.module) ?? Number.MAX_SAFE_INTEGER) - (moduleOrder.get(b.module) ?? Number.MAX_SAFE_INTEGER));
  const done = (id: string) => !!progress.lessonsDone[`${course.id}/${id}`];
  const lessonsDone = lessons.filter(lesson => done(lesson.id)).length;
  const attempts = courseAttempts(course, progress);
  const banks = ownedBankIds(course);
  const byExam = attempts.some(attempt => banks.has(attempt.bankId) && attempt.mode === "exam"
    && !attempt.lesson && !attempt.module && !attempt.kind && attempt.total > 0 && attempt.answered > 0
    && attemptPassed(attempt) === true);
  const byLessons = lessons.length > 0 && lessonsDone === lessons.length;
  const completionBasis = byLessons ? "lessons" : byExam ? "exam" : null;
  const complete = completionBasis !== null;
  const percent = complete ? 100 : lessons.length ? Math.floor(100 * lessonsDone / lessons.length) : null;

  // LessonsTab uses the largest bank for quizzes. Empty/deleted quiz question lists are
  // not runnable and do not become phantom module checkpoints in this display summary.
  const quizBank = course.banks.filter(bank => banks.has(bank.id)).slice()
    .sort((a, b) => b.questions.length - a.questions.length)[0];
  const modules = course.modules.filter(module => !module.honors
    && course.lessons.some(lesson => lesson.module === module.id)
    && lessonQuizQuestions(quizBank, module.quiz).length > 0);
  const passed = (id: string) => !!progress.modulesDone?.[`${course.id}/${id}`];
  const moduleQuizzesDone = modules.filter(module => passed(module.id)).length;
  const nextModule = modules.find(module => !passed(module.id)
    && course.lessons.filter(lesson => lesson.module === module.id && !isHonorsLesson(course, lesson)).every(lesson => done(lesson.id)));

  const questionsAnswered = attempts.reduce((sum, attempt) => sum + attempt.answered, 0);
  const correct = attempts.reduce((sum, attempt) => sum + attempt.correct, 0);
  const dates = [
    ...attempts.map(attempt => attempt.finishedAt),
    ...course.lessons.filter(lesson => done(lesson.id)).map(lesson => progress.lessonsDone[`${course.id}/${lesson.id}`]),
    ...modules.filter(module => passed(module.id)).map(module => progress.modulesDone![`${course.id}/${module.id}`]),
    ...course.banks.filter(bank => banks.has(bank.id)).flatMap(bank => Object.values(progress.stats[bank.id] ?? {}).map(stat => stat.lastSeen)),
  ].filter(value => timestamp(value) > 0).sort((a, b) => timestamp(b) - timestamp(a));

  return {
    courseId: course.id,
    title: course.title,
    status: complete ? "complete" : percent === null ? "no-checkpoints"
      : hasRecordedActivity(course, progress, attempts) ? "in-progress" : "not-started",
    percent,
    complete,
    completionBasis,
    completedUnits: lessonsDone,
    totalUnits: lessons.length,
    lessonsDone,
    lessonsTotal: lessons.length,
    moduleQuizzesDone,
    moduleQuizzesTotal: modules.length,
    nextLessonId: complete ? null : lessons.find(lesson => !done(lesson.id))?.id ?? null,
    nextModuleId: nextModule?.id ?? null,
    attempts,
    questionsAnswered,
    accuracy: questionsAnswered > 0 ? correct / questionsAnswered : null,
    studySeconds: attempts.reduce((sum, attempt) => sum + attempt.durationSec, 0),
    lastStudiedAt: dates[0] ?? null,
  };
}

/**
 * The caller supplies the active learner's enrolled courses (AppApi.courses). Do not
 * re-interpret Progress.enrolled here: single-user library courses also count as enrollment.
 */
export function enrollmentProgress(enrolled: Course[], progress: Progress): EnrollmentProgressSummary {
  const unique = [...new Map(enrolled.map(course => [course.id, course])).values()];
  const courses = unique.map(course => courseProgress(course, progress));
  const fractions = courses.map(course => course.complete ? 1 : course.lessonsTotal > 0 ? course.lessonsDone / course.lessonsTotal : 0);
  const complete = courses.filter(course => course.complete).length;
  return {
    courses,
    enrolledCourses: courses.length,
    completedCourses: complete,
    inProgressCourses: courses.filter(course => course.status === "in-progress").length,
    notStartedCourses: courses.filter(course => course.status === "not-started").length,
    unmeasuredCourses: courses.filter(course => course.percent === null).length,
    percent: courses.length ? (complete === courses.length ? 100 : Math.min(99,
      Math.floor(100 * fractions.reduce((sum, value) => sum + value, 0) / courses.length + 1e-9))) : null,
    lessonsDone: courses.reduce((sum, course) => sum + course.lessonsDone, 0),
    lessonsTotal: courses.reduce((sum, course) => sum + course.lessonsTotal, 0),
    moduleQuizzesDone: courses.reduce((sum, course) => sum + course.moduleQuizzesDone, 0),
    moduleQuizzesTotal: courses.reduce((sum, course) => sum + course.moduleQuizzesTotal, 0),
  };
}

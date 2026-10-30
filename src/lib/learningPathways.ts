import { CATALOG, type CatalogEntry } from "./catalog";
import { courseProgress } from "./learningProgress";
import type { Course, Progress } from "./types";

/** A learner's ordered course plan. Joining a pathway does not enroll its courses. */
export interface LearningPathway {
  id: string;
  title: string;
  courseIds: string[];
}

export const LEARNING_PATHWAY_LIMITS = { pathways: 20, courses: 100, title: 120 } as const;

const validId = (value: unknown): value is string => typeof value === "string"
  && /^[A-Za-z0-9_-]{1,100}$/.test(value)
  && !["__proto__", "prototype", "constructor"].includes(value);

function invalid(): never {
  throw new Error("Invalid learning pathways. Use a title and an ordered list of unique courses for each pathway.");
}

/** Optional in older progress files; reject malformed plans instead of silently losing them. */
export function parseLearningPathways(input: unknown): LearningPathway[] {
  if (input === undefined) return [];
  if (!Array.isArray(input) || input.length > LEARNING_PATHWAY_LIMITS.pathways
      || Object.keys(input).length !== input.length) invalid();
  const ids = new Set<string>();
  const paths: LearningPathway[] = [];
  for (const item of input) {
    if (!item || typeof item !== "object" || Array.isArray(item)
        || ![Object.prototype, null].includes(Object.getPrototypeOf(item))) invalid();
    const keys = Object.keys(item);
    if (keys.length !== 3 || keys.some(key => !["id", "title", "courseIds"].includes(key))) invalid();
    const { id, title, courseIds } = item as Record<string, unknown>;
    if (!validId(id) || ids.has(id)) invalid();
    if (typeof title !== "string" || title.trim() !== title || !title.length
        || title.length > LEARNING_PATHWAY_LIMITS.title || /[\x00-\x1f\x7f]/.test(title)) invalid();
    if (!Array.isArray(courseIds) || !courseIds.length || courseIds.length > LEARNING_PATHWAY_LIMITS.courses
        || Object.keys(courseIds).length !== courseIds.length) invalid();
    const courses = new Set<string>();
    for (const courseId of courseIds) {
      if (!validId(courseId) || courses.has(courseId)) invalid();
      courses.add(courseId);
    }
    ids.add(id);
    paths.push({ id, title, courseIds: [...courses] });
  }
  return paths;
}

/** Only offer starter sequences whose real courses are all present in the current catalog. */
export function starterPathways(catalog: readonly CatalogEntry[] = CATALOG): LearningPathway[] {
  const available = new Set(catalog.map(course => course.id));
  const starters: LearningPathway[] = [
    { id: "math-foundations", title: "Math foundations", courseIds: [
      "math-prealgebra", "math-algebra1", "math-algebra2", "math-geometry",
      "math-trigonometry", "math-precalculus", "math-calculus",
    ] },
    { id: "german-a1-b1", title: "German A1 to B1", courseIds: [
      "lang-german-a1", "lang-german-a2", "lang-german-b1",
    ] },
  ];
  return starters.filter(path => path.courseIds.every(id => available.has(id)));
}

export interface LearningPathwayStep {
  courseId: string;
  title: string;
  available: boolean;
  enrolled: boolean;
  complete: boolean;
  percent: number | null;
  completionBasis: "lessons" | "exam" | null;
}

export interface LearningPathwayProgress {
  pathway: LearningPathway;
  steps: LearningPathwayStep[];
  completedCourses: number;
  totalCourses: number;
  /** Equal course shares; unavailable or unmeasured steps contribute zero. */
  percent: number;
  nextCourseId: string | null;
}

/**
 * A removed catalog course can retain recorded core-lesson work using its current
 * allowlist. A bank-name prefix is not sufficient proof of a historical passed exam.
 * If the current lesson list is absent or incomplete, progress remains unmeasured.
 */
function catalogLessonProgress(entry: CatalogEntry | undefined, progress: Progress) {
  const ids = entry?.lessonIds;
  if (!entry || !Array.isArray(ids) || !ids.length || ids.length !== entry.lessons
      || ids.some(id => !validId(id)) || new Set(ids).size !== ids.length) {
    return { complete: false, percent: null, completionBasis: null, fraction: 0 } as const;
  }
  const completed = ids.filter(id => !!progress.lessonsDone[`${entry.id}/${id}`]).length;
  const complete = completed === ids.length;
  return {
    complete,
    percent: Math.floor(completed / ids.length * 100),
    completionBasis: complete ? "lessons" as const : null,
    fraction: completed / ids.length,
  };
}

export function pathwayProgress(
  pathway: LearningPathway,
  enrolledCourses: readonly Course[],
  progress: Progress,
  catalog: readonly CatalogEntry[] = CATALOG,
  knownCourses: readonly Course[] = enrolledCourses,
): LearningPathwayProgress {
  const checked = parseLearningPathways([pathway])[0];
  const enrolled = new Map(enrolledCourses.map(course => [course.id, course]));
  const known = new Map(knownCourses.map(course => [course.id, course]));
  const entries = new Map(catalog.map(course => [course.id, course]));
  let completedShares = 0;
  const steps = checked.courseIds.map((courseId): LearningPathwayStep => {
    const course = enrolled.get(courseId) ?? known.get(courseId);
    const entry = entries.get(courseId);
    const current = course ? courseProgress(course, progress) : null;
    const summary = current ? {
      complete: current.complete,
      percent: current.percent,
      completionBasis: current.completionBasis,
      fraction: current.complete ? 1 : current.lessonsTotal ? current.lessonsDone / current.lessonsTotal : 0,
    } : catalogLessonProgress(entry, progress);
    completedShares += summary.fraction;
    return {
      courseId,
      title: course?.title ?? entry?.title ?? courseId,
      available: !!course || !!entry,
      enrolled: enrolled.has(courseId),
      complete: summary.complete,
      percent: summary.percent,
      completionBasis: summary.completionBasis,
    };
  });
  return {
    pathway: checked,
    steps,
    completedCourses: steps.filter(step => step.complete).length,
    totalCourses: steps.length,
    percent: steps.every(step => step.complete) ? 100 : Math.min(99, Math.floor(completedShares / steps.length * 100 + 1e-9)),
    nextCourseId: steps.find(step => !step.complete)?.courseId ?? null,
  };
}

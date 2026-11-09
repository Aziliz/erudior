import type { LearningPathway } from "./learningPathways";
import { JD_PROGRAM } from "./jdProgram";
import { COLLEGE_CORE_PROGRAM } from "./collegeCoreProgram";

export interface ProgramCourse {
  courseId: string;
  title: string;
  recommendedBefore: string[];
  modules: string[];
  outcomes: string[];
  assignment: string;
}

export interface ProgramStage {
  id: string;
  title: string;
  summary: string;
  milestone: string;
  courses: ProgramCourse[];
}

/**
 * A "choose at least N" area. Learners pick their own courses and may take more than
 * the minimum. Theme areas may be met by courses that also count in a subject area.
 */
export interface ProgramPool {
  id: string;
  title: string;
  summary: string;
  minimum: number;
  /** Catalog course ids or ids of the program's course outlines. */
  courseIds: string[];
  /** Further minimums within the area, such as at least one arts course. */
  requirements?: { label: string; minimum: number; courseIds: string[] }[];
  theme?: boolean;
  /** Suggested picks used when a learner first follows the program. */
  defaults: string[];
}

/** Editorial program definitions are separate from the signed, available-course catalog. */
export interface StudyProgram {
  id: string;
  version: number;
  title: string;
  description: string;
  notice: string;
  stages: ProgramStage[];
  /** Areas to choose from; their courses are described in courseOutlines or the catalog. */
  pools?: ProgramPool[];
  courseOutlines?: ProgramCourse[];
  sources: { title: string; url: string }[];
  reviewedOn: string;
}

export const STUDY_PROGRAMS: readonly StudyProgram[] = [JD_PROGRAM, COLLEGE_CORE_PROGRAM];

/** Every course outline the program describes: required stage courses, then area outlines. */
export function programCourses(program: StudyProgram): ProgramCourse[] {
  const stage = program.stages.flatMap(item => item.courses);
  const seen = new Set(stage.map(course => course.courseId));
  return [...stage, ...(program.courseOutlines ?? []).filter(course => !seen.has(course.courseId))];
}

/** Every course id a learner may choose in the program, in display order. */
export function programCourseIds(program: StudyProgram): string[] {
  const ids = [...program.stages.flatMap(stage => stage.courses.map(course => course.courseId)),
    ...(program.pools ?? []).flatMap(pool => pool.courseIds)];
  return [...new Set(ids)];
}

/** Reuse existing profile-scoped pathway persistence and backup, without enrolling courses. */
export function programPathway(program: StudyProgram): LearningPathway {
  const ids = [...program.stages.flatMap(stage => stage.courses.map(course => course.courseId)),
    ...(program.pools ?? []).flatMap(pool => pool.defaults)];
  return { id: program.id, title: program.title, courseIds: [...new Set(ids)] };
}

/**
 * Never attach canonical stage progress to a learner's edited/reordered course sequence.
 * A program with areas matches any selection drawn from its courses that keeps the
 * required stage courses in order; the selection itself is the learner's.
 */
export function matchingProgram(pathway: LearningPathway): StudyProgram | undefined {
  return STUDY_PROGRAMS.find(program => {
    if (program.id !== pathway.id) return false;
    if (!program.pools?.length) return JSON.stringify(programPathway(program).courseIds) === JSON.stringify(pathway.courseIds);
    const allowed = new Set(programCourseIds(program));
    if (!pathway.courseIds.every(id => allowed.has(id))) return false;
    const required = program.stages.flatMap(stage => stage.courses.map(course => course.courseId));
    const chosenRequired = pathway.courseIds.filter(id => required.includes(id));
    return JSON.stringify(chosenRequired) === JSON.stringify(required);
  });
}

export interface PoolStatus {
  pool: ProgramPool;
  chosen: string[];
  completed: string[];
  /** Chosen courses meet the minimum and every requirement. */
  planned: boolean;
  /** Completed courses meet the minimum and every requirement. */
  met: boolean;
  requirements: { label: string; minimum: number; chosen: number; completed: number }[];
}

/** Area status for a learner's selection; extra courses beyond the minimum are welcome. */
export function poolStatus(pool: ProgramPool, chosenIds: readonly string[], completedIds: ReadonlySet<string>): PoolStatus {
  const inPool = new Set(pool.courseIds);
  const chosen = chosenIds.filter(id => inPool.has(id));
  const completed = chosen.filter(id => completedIds.has(id));
  const requirements = (pool.requirements ?? []).map(req => ({
    label: req.label, minimum: req.minimum,
    chosen: chosen.filter(id => req.courseIds.includes(id)).length,
    completed: completed.filter(id => req.courseIds.includes(id)).length,
  }));
  return {
    pool, chosen, completed, requirements,
    planned: chosen.length >= pool.minimum && requirements.every(req => req.chosen >= req.minimum),
    met: completed.length >= pool.minimum && requirements.every(req => req.completed >= req.minimum),
  };
}

/** Problems with a program's area definitions; empty when valid. */
export function programPoolProblems(program: StudyProgram, knownCourseIds: ReadonlySet<string>): string[] {
  const problems: string[] = [];
  const outlines = new Set(programCourses(program).map(course => course.courseId));
  const poolIds = new Set<string>();
  for (const pool of program.pools ?? []) {
    if (poolIds.has(pool.id)) problems.push(`${pool.id}: duplicate area id`);
    poolIds.add(pool.id);
    if (!Number.isInteger(pool.minimum) || pool.minimum < 1) problems.push(`${pool.id}: minimum must be a positive whole number`);
    if (new Set(pool.courseIds).size !== pool.courseIds.length) problems.push(`${pool.id}: duplicate course`);
    if (pool.courseIds.length < pool.minimum) problems.push(`${pool.id}: fewer courses than the minimum`);
    for (const id of pool.courseIds) if (!outlines.has(id) && !knownCourseIds.has(id)) problems.push(`${pool.id}: ${id} has no outline and is not in the catalog`);
    for (const req of pool.requirements ?? []) {
      if (req.courseIds.some(id => !pool.courseIds.includes(id))) problems.push(`${pool.id}: ${req.label} lists a course outside the area`);
      if (req.courseIds.length < req.minimum) problems.push(`${pool.id}: ${req.label} has fewer courses than its minimum`);
    }
    if (pool.defaults.some(id => !pool.courseIds.includes(id))) problems.push(`${pool.id}: a default is outside the area`);
    if (!poolStatus(pool, pool.defaults, new Set()).planned) problems.push(`${pool.id}: defaults do not meet the minimum`);
  }
  return problems;
}

export function plannedProgramCourse(id: string): ProgramCourse | undefined {
  return STUDY_PROGRAMS.flatMap(programCourses).find(course => course.courseId === id);
}

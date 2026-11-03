import type { LearningPathway } from "./learningPathways";
import { JD_PROGRAM } from "./jdProgram";

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

/** Editorial program definitions are separate from the signed, available-course catalog. */
export interface StudyProgram {
  id: string;
  version: number;
  title: string;
  description: string;
  notice: string;
  stages: ProgramStage[];
  sources: { title: string; url: string }[];
  reviewedOn: string;
}

export const STUDY_PROGRAMS: readonly StudyProgram[] = [JD_PROGRAM];

export function programCourses(program: StudyProgram): ProgramCourse[] {
  return program.stages.flatMap(stage => stage.courses);
}

/** Reuse existing profile-scoped pathway persistence and backup, without enrolling courses. */
export function programPathway(program: StudyProgram): LearningPathway {
  return { id: program.id, title: program.title, courseIds: programCourses(program).map(course => course.courseId) };
}

/** Never attach canonical stage progress to a learner's edited/reordered course sequence. */
export function matchingProgram(pathway: LearningPathway): StudyProgram | undefined {
  return STUDY_PROGRAMS.find(program => program.id === pathway.id
    && JSON.stringify(programPathway(program).courseIds) === JSON.stringify(pathway.courseIds));
}

export function plannedProgramCourse(id: string): ProgramCourse | undefined {
  return STUDY_PROGRAMS.flatMap(programCourses).find(course => course.courseId === id);
}

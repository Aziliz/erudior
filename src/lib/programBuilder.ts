import type { ProgramCourse, ProgramStage, StudyProgram } from "./studyPrograms";

/** A course outline; the assignment is the course's capstone. */
export const outline = (courseId: string, title: string, modules: string[], outcomes: string[], capstone: string, recommendedBefore: string[] = []): ProgramCourse =>
  ({ courseId, title, recommendedBefore, modules, outcomes, assignment: capstone });

export const stage = (id: string, title: string, summary: string, milestone: string, courses: ProgramCourse[]): ProgramStage =>
  ({ id, title, summary, milestone, courses });

export const STATE_NOTE = "Licensing rules differ by state; check your state's board for its exam, hours and fees.";

/** A license-preparation program: theory courses ending in exam preparation. */
export function licenseProgram(p: {
  id: string; title: string; description: string; notice: string;
  stages: ProgramStage[]; sources: { title: string; url: string }[];
}): StudyProgram {
  return { ...p, version: 1, reviewedOn: "2026-11-09" };
}

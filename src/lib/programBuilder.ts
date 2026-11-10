import type { ProgramCategory, ProgramCourse, ProgramStage, StudyProgram } from "./studyPrograms";

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

/** Compact outline: modules as one "; "-separated string. */
export const m = (courseId: string, title: string, modules: string, outcomes: [string, string], capstone: string, recommendedBefore: string[] = []): ProgramCourse =>
  outline(courseId, title, modules.split("; "), outcomes, capstone, recommendedBefore);

/** The one outline object another program already uses for a course. */
export function findOutline(programs: StudyProgram | readonly StudyProgram[], courseId: string): ProgramCourse {
  const list: readonly StudyProgram[] = Array.isArray(programs) ? programs : [programs as StudyProgram];
  const found = list.flatMap((program: StudyProgram) => program.stages.flatMap(item => item.courses)).find(item => item.courseId === courseId);
  if (!found) throw new Error(`No program outline for ${courseId}`);
  return found;
}

/** A college major: the major's own courses, staged like a degree sequence. No degree or credit. */
export function majorProgram(p: {
  id: string; title: string; category: ProgramCategory; description: string; extra?: string;
  stages: ProgramStage[]; sources: { title: string; url: string }[];
}): StudyProgram {
  const notice = `Independent study, not a degree. Courses follow a college major's sequence; each course ends with a capstone you keep.${p.extra ? " " + p.extra : ""}`;
  return { id: p.id, title: p.title, category: p.category, description: p.description, notice, stages: p.stages, sources: p.sources, version: 1, reviewedOn: "2026-11-10" };
}

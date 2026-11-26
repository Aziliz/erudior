import type { StudyProgram } from "./studyPrograms";

const object = (value: unknown): value is Record<string, unknown> => !!value && typeof value === "object" && !Array.isArray(value);
const text = (value: unknown): value is string => typeof value === "string" && !!value.trim();
const id = (value: unknown): value is string => typeof value === "string" && /^[a-z0-9][a-z0-9-]*$/.test(value);
const strings = (value: unknown): value is string[] => Array.isArray(value) && value.every(text);

/** The signed feed carries ordered, fully available stage programs. Pooled pathways are bundled separately. */
export function readPublishedPrograms(value: unknown, courseIds: ReadonlySet<string>, categories: readonly string[]): StudyProgram[] {
  if (!Array.isArray(value)) throw new Error("Invalid published program list.");
  const programIds = new Set<string>();
  for (const p of value) {
    if (!object(p) || !id(p.id) || programIds.has(p.id) || !text(p.title) || !text(p.description) ||
        !text(p.notice) || !text(p.reviewedOn) || !text(p.category) || !categories.includes(p.category) ||
        typeof p.version !== "number" || !Number.isSafeInteger(p.version) || p.version < 1 ||
        (p.practicalAssessment !== undefined && !text(p.practicalAssessment)) ||
        p.pools !== undefined || p.courseOutlines !== undefined || !Array.isArray(p.stages) || !p.stages.length ||
        !Array.isArray(p.sources) || !p.sources.every(s => object(s) && text(s.title) && typeof s.url === "string" && /^https:\/\//.test(s.url))) {
      throw new Error("Invalid published program.");
    }
    programIds.add(p.id);
    const seen = new Set<string>(), stages = new Set<string>();
    for (const s of p.stages) {
      if (!object(s) || !id(s.id) || stages.has(s.id) || !text(s.title) || !text(s.summary) ||
          !text(s.milestone) || !Array.isArray(s.courses) || !s.courses.length) throw new Error("Invalid stage in " + p.id);
      stages.add(s.id);
      for (const c of s.courses) {
        if (!object(c) || !id(c.courseId) || !courseIds.has(c.courseId) || seen.has(c.courseId) ||
            !text(c.title) || !strings(c.modules) || !c.modules.length || !strings(c.outcomes) || !c.outcomes.length ||
            !text(c.assignment) || !strings(c.recommendedBefore) || !c.recommendedBefore.every(ref => seen.has(ref))) {
          throw new Error("Invalid course outline in " + p.id);
        }
        seen.add(c.courseId);
      }
    }
  }
  return value as StudyProgram[];
}

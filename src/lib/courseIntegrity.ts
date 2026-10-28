import type { Course } from "./types";
import { localBankId } from "./course";

/** Structural issues that must be fixed before a course is approved for publication. */
export interface CourseIntegrityIssue {
  path: string;
  message: string;
}

/** Non-destructive validation: unlike normalization, this never silently changes course content. */
export function validateCourseIntegrity(course: Course): CourseIntegrityIssue[] {
  const issues: CourseIntegrityIssue[] = [];
  const report = (path: string, message: string) => issues.push({ path, message });
  const unique = (values: string[], path: string) => {
    const seen = new Set<string>();
    for (const [i, value] of values.entries()) {
      if (!value.trim()) report(`${path}[${i}]`, "Missing ID");
      else if (seen.has(value)) report(`${path}[${i}]`, `Duplicate ID: ${value}`);
      seen.add(value);
    }
  };

  unique(course.modules.map((m) => m.id), "modules");
  unique(course.lessons.map((l) => l.id), "lessons");
  unique(course.banks.map(localBankId), "banks");
  unique(course.decks.map((d) => d.id), "decks");
  unique(course.references.map((r) => r.id), "references");
  unique(course.drills.map((d) => d.id), "drills");
  if (course.texts) unique(course.texts.map((t) => t.id), "texts");

  const moduleIds = new Set(course.modules.map((m) => m.id));
  for (const [i, lesson] of course.lessons.entries())
    if (!moduleIds.has(lesson.module)) report(`lessons[${i}].module`, `Unknown module: ${lesson.module}`);

  const questionIds = new Set<string>();
  for (const [i, bank] of course.banks.entries()) {
    unique(bank.questions.map((q) => q.id), `banks[${i}].questions`);
    for (const question of bank.questions) questionIds.add(question.id);
  }
  const checkQuiz = (ids: string[] | undefined, path: string) => {
    if (!ids) return;
    for (const [i, id] of ids.entries())
      if (!questionIds.has(id)) report(`${path}[${i}]`, `Question not found in course banks: ${id}`);
  };
  for (const [i, module] of course.modules.entries()) checkQuiz(module.quiz, `modules[${i}].quiz`);
  for (const [i, lesson] of course.lessons.entries()) {
    checkQuiz(lesson.quiz, `lessons[${i}].quiz`);
    for (const [j, id] of (lesson.drills ?? []).entries())
      if (!course.drills.some((drill) => drill.id === id))
        report(`lessons[${i}].drills[${j}]`, `Unknown drill: ${id}`);
    for (const [j, id] of (lesson.refs ?? []).entries())
      if (!course.references.some((ref) => ref.id === id))
        report(`lessons[${i}].refs[${j}]`, `Unknown reference: ${id}`);
  }

  for (const [i, text] of (course.texts ?? []).entries()) {
    unique(text.sections.map((section) => section.id), `texts[${i}].sections`);
    for (const [j, section] of text.sections.entries())
      checkQuiz(section.questions, `texts[${i}].sections[${j}].questions`);
  }
  return issues;
}

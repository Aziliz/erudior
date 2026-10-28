import { validateReaderTexts } from "./readerContent";
import type { Course } from "./types";
import { importCourseSnapshot, localBankId } from "./course";
import { validateAssignment } from "./spreadsheetAssignments";
import { validateCourseWork, validateWorkLessonReferences } from "./courseWork";

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

  for (const message of validateCourseWork(course, { moduleIds: course.modules.map(m => m.id) })) report("work", message);
  for (const message of validateWorkLessonReferences(course, course.lessons)) report("work", message);

  unique(course.modules.map((m) => m.id), "modules");
  unique(course.lessons.map((l) => l.id), "lessons");
  unique(course.banks.map(localBankId), "banks");
  unique(course.decks.map((d) => d.id), "decks");
  unique(course.references.map((r) => r.id), "references");
  unique(course.drills.map((d) => d.id), "drills");
  for (const message of validateReaderTexts(course.texts, { questionIds: course.banks[0]?.questions.map(q => q.id) ?? [] })) report("texts", message);

  if (course.spreadsheetAssignments !== undefined && !Array.isArray(course.spreadsheetAssignments)) {
    report("spreadsheetAssignments", "Must be an array");
  } else {
    const seenAssignments = new Set<string>();
    for (const [i, candidate] of (course.spreadsheetAssignments ?? []).entries()) {
      for (const issue of validateAssignment(candidate)) report(`spreadsheetAssignments[${i}]`, issue);
      if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) continue;
      if (typeof candidate.id === "string") {
        if (seenAssignments.has(candidate.id)) report(`spreadsheetAssignments[${i}].id`, `Duplicate ID: ${candidate.id}`);
        seenAssignments.add(candidate.id);
      }
      if (!course.lessons.some(lesson => lesson.id === candidate.lessonId)) report(`spreadsheetAssignments[${i}].lessonId`, "Unknown lesson");
    }
  }
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

  return issues;
}

/** Import a portable course and reject dangling references before publishing/review. */
export function importValidatedCourseSnapshot(source: string): Course {
  const parsed: unknown = JSON.parse(source);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Course must be an object.");
  const raw = parsed as Record<string, unknown>;
  const readerErrors = validateReaderTexts(raw.texts, { legacy: true });
  if (readerErrors.length) throw Error("Invalid reading library: " + readerErrors.join("; "));
  // Detect invalid IDs and dangling references before normalization can repair or discard them.
  const rawModules = Array.isArray(raw.modules) ? raw.modules.filter((x): x is Record<string, unknown> => !!x && typeof x === "object" && !Array.isArray(x)) : [];
  const rawLessons = Array.isArray(raw.lessons) ? raw.lessons.filter((x): x is Record<string, unknown> => !!x && typeof x === "object" && !Array.isArray(x)) : [];
  const ids = new Set(rawModules.map(m => m.id));
  for (const [i, lesson] of rawLessons.entries()) {
    if (typeof lesson.module === "string" && !ids.has(lesson.module))
      throw new Error(`Invalid course references: lessons[${i}].module: ${lesson.module}`);
  }
  if (raw.spreadsheetAssignments !== undefined && !Array.isArray(raw.spreadsheetAssignments))
    throw new Error("Invalid spreadsheet assignments: expected an array.");
  if (Array.isArray(raw.spreadsheetAssignments)) {
    const seen = new Set<string>();
    for (const [i, candidate] of raw.spreadsheetAssignments.entries()) {
      if (!candidate || typeof candidate !== "object" || Array.isArray(candidate))
        throw new Error(`Invalid spreadsheet assignment at index ${i}`);
      const problems = validateAssignment(candidate);
      if (problems.length) throw new Error(`Invalid spreadsheet assignment at index ${i}: ${problems.join("; ")}`);
      const item = candidate as Record<string,unknown>;
      if (typeof item.id !== "string" || seen.has(item.id))
        throw new Error(`Duplicate or invalid spreadsheet assignment ID at index ${i}`);
      seen.add(item.id);
      if (typeof item.lessonId !== "string" || !rawLessons.some(l=>l.id===item.lessonId))
        throw new Error(`Invalid spreadsheet lesson reference at index ${i}`);
    }
  }
  const workErrors = validateCourseWork(raw, { legacy: true, moduleIds: rawModules.map(m => String(m.id)) });
  if (workErrors.length) throw new Error("Invalid course work: " + workErrors.join("; "));
  const course = importCourseSnapshot(source);
  const errors = validateCourseIntegrity(course);
  if (errors.length) {
    throw new Error("Invalid course references: " + errors.map((e) => `${e.path}: ${e.message}`).join("; "));
  }
  return course;
}

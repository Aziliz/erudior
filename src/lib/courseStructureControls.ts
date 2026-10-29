import type { Course } from "./types";

/** Stable-ID operations preserve every content/resource field outside the requested structure. */
export function reorderCourseItem(course: Course, kind: "modules" | "lessons", id: string, direction: -1 | 1): Course {
  const items = course[kind];
  const index = items.findIndex(item => item.id === id);
  const next = index + direction;
  if (index < 0 || next < 0 || next >= items.length) return course;
  const reordered = [...items];
  [reordered[index], reordered[next]] = [reordered[next], reordered[index]];
  return { ...course, [kind]: reordered };
}

export function courseModuleDeleteReason(course: Course, id: string): string | null {
  if (course.lessons.some(lesson => lesson.module === id)) return "Move or delete this module's lessons first.";
  if ([...(course.writing ?? []), ...(course.labs ?? [])].some(item => item.module === id)) return "Move this module's assessed work first.";
  return null;
}

export function courseLessonDeleteReason(course: Course, id: string): string | null {
  if ([...(course.spreadsheetAssignments ?? []), ...(course.branchingScenarios ?? []), ...(course.scientificWorkspaces ?? []), ...(course.advancedAssessments ?? [])].some(item => item.lessonId === id)) return "Move or remove linked workspaces and assignments first.";
  if (course.vocab?.some(word => word.lesson === id && (!word.from || word.from === course.id))) return "Move or remove vocabulary linked to this lesson first.";
  return null;
}

/** Confirmation authorizes only the exact displayed target, not a later edit or replacement. */
export function deleteCourseItem(course: Course, kind: "modules" | "lessons", id: string, snapshot: string): Course {
  const item = course[kind].find(item => item.id === id);
  if (!item || JSON.stringify(item) !== snapshot) return course;
  if (kind === "modules") {
    if (courseModuleDeleteReason(course, id)) return course;
    return { ...course, modules: course.modules.filter(item => item.id !== id) };
  }
  if (courseLessonDeleteReason(course, id)) return course;
  return { ...course, lessons: course.lessons.filter(item => item.id !== id) };
}

export function assignCourseLesson(course: Course, lessonId: string, moduleId: string): Course {
  if (!course.modules.some(module => module.id === moduleId)) return course;
  const lesson = course.lessons.find(lesson => lesson.id === lessonId);
  if (!lesson || lesson.module === moduleId) return course;
  return { ...course, lessons: course.lessons.map(item => item.id === lessonId ? { ...item, module: moduleId } : item) };
}

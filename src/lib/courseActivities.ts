import type { Course } from './types';

export const COURSE_ACTIVITY_KINDS = ['advanced', 'scientific', 'branching', 'spreadsheet'] as const;
export type CourseActivityKind = typeof COURSE_ACTIVITY_KINDS[number];
export type CourseActivity = {
  kind: CourseActivityKind;
  id: string;
  title: string;
  lessonId?: string;
  revision?: number;
};
export const activityLabels: Record<CourseActivityKind, string> = {
  advanced: 'Advanced assessment', scientific: 'Scientific workspace',
  branching: 'Branching scenario', spreadsheet: 'Spreadsheet assignment',
};
/** Discover authored links only. This does not assign work or confer approval. */
export function courseActivities(course: Course, lessonId?: string): CourseActivity[] {
  const groups = [
    ['advanced', course.advancedAssessments], ['scientific', course.scientificWorkspaces],
    ['branching', course.branchingScenarios], ['spreadsheet', course.spreadsheetAssignments],
  ] as const;
  return groups.flatMap(([kind, sources]) => (sources ?? []).map(source => ({
    kind, id: source.id, title: source.title, lessonId: source.lessonId,
    revision: 'revision' in source ? source.revision : course.revision,
  }))).filter(source => lessonId === undefined || source.lessonId === lessonId);
}

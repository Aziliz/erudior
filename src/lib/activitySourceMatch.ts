import { advancedAssessmentJSON } from './advancedAssessment';
import type { CourseActivityOrigin } from './courseActivityOrigin';

/** Complete portable instructional content; local review claims are not source identity. */
export function activitySourceIdentity(source: object): string {
  const { approval: _approval, lessonId: _lessonId, courseOrigin: _origin, ...portable } = source as Record<string, unknown>;
  return advancedAssessmentJSON(portable);
}

/** A local copy can have an independent identity but must still contain the exact source. */
export function activitySourceMatches(assigned: object, requested: object, courseId?: string, courseRevision?: number): boolean {
  const local = assigned as {courseOrigin?: CourseActivityOrigin};
  if (courseId !== undefined) {
    const origin = local.courseOrigin;
    const source = requested as {id: string; revision: number};
    if (!origin || origin.courseId !== courseId || origin.courseRevision !== (courseRevision ?? null) || origin.sourceId !== source.id || origin.sourceRevision !== source.revision) return false;
    return activitySourceIdentity({...assigned, id: origin.sourceId, revision: origin.sourceRevision}) === activitySourceIdentity(requested);
  }
  return activitySourceIdentity(assigned) === activitySourceIdentity(requested);
}

/** Navigation metadata only. Never grants source approval or learner assignment authority. */
export interface CourseActivityOrigin {
  courseId: string;
  courseRevision: number | null;
  sourceId: string;
  sourceRevision: number;
}
export function validateCourseActivityOrigin(value: unknown): void {
  if (value === undefined) return;
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw Error('Invalid course activity origin.');
  const v = value as Record<string, unknown>;
  if (Object.keys(v).sort().join(',') !== 'courseId,courseRevision,sourceId,sourceRevision') throw Error('Invalid course activity origin fields.');
  for (const key of ['courseId', 'sourceId']) if (typeof v[key] !== 'string' || !v[key] || v[key].length > 200 || /[\u0000-\u001f\u007f]/.test(v[key] as string)) throw Error('Invalid course activity origin identity.');
  if (!Number.isSafeInteger(v.sourceRevision) || (v.sourceRevision as number) < 0 || (v.courseRevision !== null && (!Number.isSafeInteger(v.courseRevision) || (v.courseRevision as number) < 0))) throw Error('Invalid course activity origin revision.');
}

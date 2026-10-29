import { mergeAssessedWorkSubmissions, validateAssessedWorkSubmission, type AssessedWorkSubmission, type AssessedWorkSubmissionMap } from "./assessedWorkEvidence";
const assessedWorkDraftKey = (studentId: string | null, courseId: string, assignmentId: string, kind: string) => JSON.stringify([studentId, courseId, kind, assignmentId]);

// Progress updates are optimistic. Failed and in-flight evidence must not appear
// confirmed or leave through a hand-in, even after its component unmounts.
// A full page reload instead loads authoritative persisted progress.
type Pending = { studentId: string | null; submission: AssessedWorkSubmission; saving: boolean; error: string };
const pending = new Map<string, Pending>();
const listeners = new Set<() => void>();
let version = 0;
function changed() { version++; for (const listener of listeners) listener(); }
export const assessedWorkSubmissionRegistryVersion = () => version;
export function subscribeAssessedWorkSubmissions(listener: () => void): () => void {
  listeners.add(listener); return () => { listeners.delete(listener); };
}
export function pendingAssessedWorkSubmission(studentId: string | null, courseId: string, assignmentId: string, kind?: AssessedWorkSubmission["kind"]): Readonly<Pending> | undefined {
  const matches = [...pending.values()].filter(item=>item.studentId===studentId&&item.submission.courseId===courseId&&item.submission.assignmentId===assignmentId&&(!kind||item.submission.kind===kind));
  const value = matches.length===1 ? matches[0] : undefined;
  return value ? structuredClone(value) : undefined;
}
/** Existing retry bodies win over new edits; never change their ID or timestamp. */
export function prepareAssessedWorkSubmission(studentId: string | null, submission: AssessedWorkSubmission): AssessedWorkSubmission {
  const key = assessedWorkDraftKey(studentId, submission.courseId, submission.assignmentId, submission.kind);
  const existing = pending.get(key);
  if (existing) return structuredClone(existing.submission);
  const errors = validateAssessedWorkSubmission(submission);
  if (errors.length) throw Error(errors.join("; "));
  if (pending.size >= 100) throw Error("Too many unconfirmed submissions. Retry pending saves before submitting more work.");
  pending.set(key, { studentId, submission: structuredClone(submission), saving: false, error: "" });
  changed();
  return structuredClone(submission);
}
export function beginAssessedWorkSubmissionSave(studentId: string | null, submission: AssessedWorkSubmission): boolean {
  const item = pending.get(assessedWorkDraftKey(studentId, submission.courseId, submission.assignmentId, submission.kind));
  if (!item || item.submission.id !== submission.id || item.saving) return false;
  item.saving = true; item.error = ""; changed(); return true;
}
export function failAssessedWorkSubmissionSave(studentId: string | null, submission: AssessedWorkSubmission): void {
  const item = pending.get(assessedWorkDraftKey(studentId, submission.courseId, submission.assignmentId, submission.kind));
  if (!item || item.submission.id !== submission.id) return;
  item.saving = false; item.error = "Not confirmed saved. Retry this exact snapshot."; changed();
}
export function confirmAssessedWorkSubmissionSave(studentId: string | null, submission: AssessedWorkSubmission): void {
  const key = assessedWorkDraftKey(studentId, submission.courseId, submission.assignmentId, submission.kind);
  const item = pending.get(key);
  if (!item || item.submission.id !== submission.id || !item.saving) return;
  pending.delete(key); changed();
}
/** For transport/review boundaries: never export optimistic, unconfirmed evidence. */
export function getConfirmedAssessedWorkSubmissions(progress: { assessedWorkSubmissions?: AssessedWorkSubmissionMap }, studentId: string | null): AssessedWorkSubmissionMap {
  const withheld = new Set([...pending.values()].filter(item => item.studentId === studentId).map(item => item.submission.id));
  return mergeAssessedWorkSubmissions({}, Object.fromEntries(Object.entries(progress.assessedWorkSubmissions ?? {}).filter(([id]) => !withheld.has(id))));
}
/** Also withhold optimistic legacy projections; evidence-only filtering is insufficient. */
export function getConfirmedAssessedWorkProgress<T extends { assessedWorkSubmissions?: AssessedWorkSubmissionMap; work?: Record<string, unknown> }>(progress: T, studentId: string | null): T {
  const withheld = new Set([...pending.values()].filter(item => item.studentId === studentId && item.submission.kind !== "log").map(item => item.submission.courseId + "/" + item.submission.assignmentId));
  return { ...progress, assessedWorkSubmissions: getConfirmedAssessedWorkSubmissions(progress, studentId), ...(progress.work ? { work: Object.fromEntries(Object.entries(progress.work).filter(([key]) => !withheld.has(key))) } : {}) };
}

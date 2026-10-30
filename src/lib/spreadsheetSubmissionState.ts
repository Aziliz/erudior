import { mergeSpreadsheetSubmissions, validateSpreadsheetSubmission, type SpreadsheetSubmission, type SpreadsheetSubmissionMap } from "./spreadsheetEvidence";
import { spreadsheetDraftKey } from "./spreadsheetLearnerState";

// Progress updates are optimistic. Failed and in-flight evidence must not appear
// confirmed or leave through a hand-in, even after its component unmounts.
// A full page reload instead loads authoritative persisted progress.
type Pending = { studentId: string | null; submission: SpreadsheetSubmission; saving: boolean; error: string };
const pending = new Map<string, Pending>();
const listeners = new Set<() => void>();
let version = 0;
function changed() { version++; for (const listener of listeners) listener(); }
export const spreadsheetSubmissionRegistryVersion = () => version;
export function subscribeSpreadsheetSubmissions(listener: () => void): () => void {
  listeners.add(listener); return () => { listeners.delete(listener); };
}
export function pendingSpreadsheetSubmission(studentId: string | null, courseId: string, assignmentId: string): Readonly<Pending> | undefined {
  const value = pending.get(spreadsheetDraftKey(studentId, courseId, assignmentId));
  return value ? structuredClone(value) : undefined;
}
/** Existing retry bodies win over new edits; never change their ID or timestamp. */
export function prepareSpreadsheetSubmission(studentId: string | null, submission: SpreadsheetSubmission): SpreadsheetSubmission {
  const key = spreadsheetDraftKey(studentId, submission.courseId, submission.assignmentId);
  const existing = pending.get(key);
  if (existing) return structuredClone(existing.submission);
  const errors = validateSpreadsheetSubmission(submission);
  if (errors.length) throw Error(errors.join("; "));
  if (pending.size >= 100) throw Error("Too many unconfirmed submissions. Retry pending saves before submitting more work.");
  pending.set(key, { studentId, submission: structuredClone(submission), saving: false, error: "" });
  changed();
  return structuredClone(submission);
}
export function beginSpreadsheetSubmissionSave(studentId: string | null, submission: SpreadsheetSubmission): boolean {
  const item = pending.get(spreadsheetDraftKey(studentId, submission.courseId, submission.assignmentId));
  if (!item || item.submission.id !== submission.id || item.saving) return false;
  item.saving = true; item.error = ""; changed(); return true;
}
export function failSpreadsheetSubmissionSave(studentId: string | null, submission: SpreadsheetSubmission): void {
  const item = pending.get(spreadsheetDraftKey(studentId, submission.courseId, submission.assignmentId));
  if (!item || item.submission.id !== submission.id) return;
  item.saving = false; item.error = "Not confirmed saved. Retry this exact snapshot."; changed();
}
export function confirmSpreadsheetSubmissionSave(studentId: string | null, submission: SpreadsheetSubmission): void {
  const key = spreadsheetDraftKey(studentId, submission.courseId, submission.assignmentId);
  const item = pending.get(key);
  if (!item || item.submission.id !== submission.id || !item.saving) return;
  pending.delete(key); changed();
}
/** For transport/review boundaries: never export optimistic, unconfirmed evidence. */
export function getConfirmedSpreadsheetSubmissions(progress: { spreadsheetSubmissions?: SpreadsheetSubmissionMap }, studentId: string | null): SpreadsheetSubmissionMap {
  const withheld = new Set([...pending.values()].filter(item => item.studentId === studentId).map(item => item.submission.id));
  return mergeSpreadsheetSubmissions({}, Object.fromEntries(Object.entries(progress.spreadsheetSubmissions ?? {}).filter(([id]) => !withheld.has(id))));
}

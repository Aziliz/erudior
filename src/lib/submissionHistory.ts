// Durable instructor-side history of verified classroom hand-ins.
// These helpers are pure; callers persist the returned record list alongside
// the teacher's classroom state after verifying the hand-in HMAC.
import type { HandIn } from "./classroom";

export type ReviewState = "pending" | "reviewed" | "needs_revision";
export interface SubmissionRecord {
  id: string; classId: string; studentId: string; studentName: string;
  submittedAt: string; receivedAt: string; courses: string[];
  attemptCount: number; status: ReviewState; reviewedAt?: string;
  reviewNote?: string;
}
const states: ReviewState[] = ["pending", "reviewed", "needs_revision"];
const validIso = (value: string) => Number.isFinite(Date.parse(value));

/** Record an already-verified hand-in. Identical signed files are idempotent. */
export function recordHandIn(
  history: readonly SubmissionRecord[], verified: HandIn, receivedAt: string,
): { records: SubmissionRecord[]; inserted: boolean } {
  if (!verified.mac || !verified.classId || !verified.studentId || !validIso(verified.created) || !validIso(receivedAt))
    throw new Error("A verified, dated hand-in is required.");
  const id = [verified.classId, verified.studentId, verified.mac].join(":");
  if (history.some(x => x.id === id)) return { records: [...history], inserted: false };
  const record: SubmissionRecord = {
    id, classId: verified.classId, studentId: verified.studentId,
    studentName: verified.studentName, submittedAt: verified.created, receivedAt,
    courses: [...new Set(verified.courses)], attemptCount: verified.progress.attempts.length,
    status: "pending",
  };
  return { records: [...history, record].sort((a, b) => b.receivedAt.localeCompare(a.receivedAt)), inserted: true };
}

/** Teacher decisions affect the chosen submission only, never prior reviews. */
export function reviewHandIn(
  history: readonly SubmissionRecord[], id: string,
  status: Exclude<ReviewState, "pending">, reviewedAt: string, note = "",
): SubmissionRecord[] {
  if (!states.includes(status) || status === "pending" || !validIso(reviewedAt))
    throw new Error("A valid instructor decision and review timestamp are required.");
  if (!history.some(x => x.id === id)) throw new Error("Submission not found.");
  if (note.length > 2000) throw new Error("Review note is too long.");
  return history.map(x => x.id === id ? { ...x, status, reviewedAt, reviewNote: note.trim() } : x);
}

/** Status per learner is derived from their newest received hand-in, not merged work. */
export function latestSubmissions(history: readonly SubmissionRecord[], classId: string): SubmissionRecord[] {
  const current = new Map<string, SubmissionRecord>();
  for (const record of history.filter(x => x.classId === classId).sort((a, b) => b.receivedAt.localeCompare(a.receivedAt)))
    if (!current.has(record.studentId)) current.set(record.studentId, record);
  return [...current.values()].sort((a, b) => a.studentName.localeCompare(b.studentName));
}

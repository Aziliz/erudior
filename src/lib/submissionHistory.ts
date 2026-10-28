// Durable instructor-side history of verified classroom hand-ins.
// These helpers are pure; callers persist the returned record list alongside
// the teacher's classroom state after verifying the hand-in HMAC.
import { parseHandIn, stableJson, type HandIn } from "./classroom";

export type ReviewState = "pending" | "reviewed" | "needs_revision";
export interface SubmissionReviewEvent {
  id: string; submissionId: string; status: Exclude<ReviewState, "pending">; reviewedAt: string; note: string;
}
export interface SubmissionRecord {
  /** Exact signed evidence, not normalized or merged student progress. */
  snapshot: HandIn; reviewEvents: SubmissionReviewEvent[];
  id: string; classId: string; studentId: string; studentName: string;
  submittedAt: string; receivedAt: string; courses: string[];
  attemptCount: number; status: ReviewState; reviewedAt?: string;
  reviewNote?: string;
}
export const SUBMISSION_LIMITS = { bytes: 32 * 1024 * 1024, nodes: 200000, depth: 32, attempts: 10000, courses: 500, files: 200, records: 1000, events: 200, historyBytes: 64 * 1024 * 1024 };
const plain = (value: unknown): value is Record<string, unknown> => !!value && typeof value === "object" && !Array.isArray(value) && [Object.prototype, null].includes(Object.getPrototypeOf(value));
const text = (value: unknown, max: number): value is string => typeof value === "string" && value.length > 0 && value.length <= max;
function timestamp(value: unknown): string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/.test(value) || !Number.isFinite(Date.parse(value)))
    throw Error("A valid dated ISO timestamp is required.");
  const [year, month, day] = value.slice(0, 10).split("-").map(Number);
  const days = new Date(Date.UTC(year, month, 0)).getUTCDate();
  if (month < 1 || month > 12 || day < 1 || day > days) throw Error("A valid calendar timestamp is required.");
  return new Date(value).toISOString();
}
/** HMAC authenticity is a separate prerequisite, not a substitute for shape checks. */
export function validateSubmissionHandIn(value: unknown): asserts value is HandIn {
  let nodes = 0;
  const seen = new Set<object>();
  const visit = (item: unknown, depth: number): void => {
    if (++nodes > SUBMISSION_LIMITS.nodes || depth > SUBMISSION_LIMITS.depth) throw Error("Hand-in exceeds structural limits.");
    if (item === null || typeof item === "string" || typeof item === "boolean" || typeof item === "number" && Number.isFinite(item)) return;
    if (!Array.isArray(item) && !plain(item)) throw Error("Hand-in must contain plain JSON data.");
    if (seen.has(item as object)) throw Error("Hand-in must not contain cycles.");
    seen.add(item as object);
    for (const [key, child] of Object.entries(item as object)) {
      if (["__proto__", "constructor", "prototype"].includes(key)) throw Error("Unsafe hand-in property.");
      visit(child, depth + 1);
    }
    seen.delete(item as object);
  };
  visit(value, 0);
  if (new TextEncoder().encode(JSON.stringify(value)).byteLength > SUBMISSION_LIMITS.bytes) throw Error("Hand-in exceeds byte limit.");
  if (!plain(value) || value.format !== "erudior-handin" || value.version !== 1 ||
      !text(value.mac, 128) || !text(value.classId, 200) || !text(value.studentId, 200) ||
      !text(value.studentName, 500) || !text(value.className, 500)) throw Error("A verified hand-in with valid identity fields is required.");
  timestamp(value.created);
  // Reuse the transport schema for nested work, file references and course scope.
  // This checks shape only; it never authenticates a persisted snapshot.
  parseHandIn(value);
  if (!Array.isArray(value.courses) || value.courses.length > SUBMISSION_LIMITS.courses || !value.courses.every(x => text(x, 200))) throw Error("Invalid hand-in courses.");
  const p = value.progress;
  if (!plain(p) || !Array.isArray(p.attempts) || p.attempts.length > SUBMISSION_LIMITS.attempts || !p.attempts.every(a => plain(a) && text(a.id, 200) && text(a.bankId, 400))) throw Error("Invalid hand-in attempts.");
  for (const field of ["lessonsDone", "modulesDone"])
    if ((field === "lessonsDone" || p[field] !== undefined) && (!plain(p[field]) || !Object.values(p[field]).every(v => text(v, 100)))) throw Error("Invalid hand-in completion data.");
  if (!plain(p.drills) || !Object.values(p.drills).every(v => plain(v) && Number.isSafeInteger(v.attempts) && Number(v.attempts) >= 0 && Number.isSafeInteger(v.correct) && Number(v.correct) >= 0)) throw Error("Invalid hand-in drill data.");
  if (p.work !== undefined && !plain(p.work) || p.logs !== undefined && (!Array.isArray(p.logs) || !p.logs.every(plain))) throw Error("Invalid hand-in work data.");
  if (value.files !== undefined && (!plain(value.files) || Object.keys(value.files).length > SUBMISSION_LIMITS.files || !Object.values(value.files).every(f => plain(f) && text(f.mime, 200) && typeof f.data === "string"))) throw Error("Invalid hand-in files.");
}
// Equal receipt instants have deterministic ordering, independent of import order.
const newest = (a: SubmissionRecord, b: SubmissionRecord) => Date.parse(b.receivedAt) - Date.parse(a.receivedAt) || Date.parse(b.submittedAt) - Date.parse(a.submittedAt) || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);

/** Record an already-verified hand-in. Identical signed files are idempotent. */
export function recordHandIn(
  history: readonly SubmissionRecord[], verified: HandIn, receivedAt: string,
): { records: SubmissionRecord[]; inserted: boolean } {
  history = parseSubmissionHistory(history);
  validateSubmissionHandIn(verified);
  receivedAt = timestamp(receivedAt);
  const id = JSON.stringify([verified.classId, verified.studentId, verified.mac]);
  const existing = history.find(x => x.id === id);
  if (existing) {
    if (stableJson(existing.snapshot) !== stableJson(verified)) throw Error("Conflicting content for an existing signed submission identity.");
    return { records: parseSubmissionHistory(history), inserted: false };
  }
  const record: SubmissionRecord = {
    snapshot: structuredClone(verified), reviewEvents: [],
    id, classId: verified.classId, studentId: verified.studentId,
    studentName: verified.studentName, submittedAt: timestamp(verified.created), receivedAt,
    courses: [...new Set(verified.courses)], attemptCount: verified.progress.attempts.length,
    status: "pending",
  };
  return { records: parseSubmissionHistory([...history, record].sort(newest)), inserted: true };
}

/** Teacher decisions affect the chosen submission only, never prior reviews. */
export function reviewHandIn(
  history: readonly SubmissionRecord[], id: string,
  status: Exclude<ReviewState, "pending">, reviewedAt: string, note = "", eventId: string = crypto.randomUUID(),
): SubmissionRecord[] {
  if (status !== "reviewed" && status !== "needs_revision")
    throw new Error("A valid instructor decision and review timestamp are required.");
  history = parseSubmissionHistory(history);
  reviewedAt = timestamp(reviewedAt);
  if (!history.some(x => x.id === id)) throw new Error("Submission not found.");
  if (typeof note !== "string" || note.length > 2000) throw new Error("Review note is too long.");
  if (!text(eventId, 200)) throw Error("Invalid review event ID.");
  const event: SubmissionReviewEvent = { id: eventId, submissionId: id, status, reviewedAt, note: note.trim() };
  const prior = history.flatMap(x => x.reviewEvents).find(e => e.id === eventId);
  if (prior) {
    if (stableJson(prior) !== stableJson(event)) throw Error("Review event ID already belongs to a different decision.");
    return parseSubmissionHistory(history);
  }
  return parseSubmissionHistory(history.map(x => x.id === id ? { ...x, status, reviewedAt, reviewNote: event.note, reviewEvents: [...x.reviewEvents, event] } : x));
}

/** Status per learner is derived from their newest received hand-in, not merged work. */
export function latestSubmissions(history: readonly SubmissionRecord[], classId: string): SubmissionRecord[] {
  history = parseSubmissionHistory(history);
  const current = new Map<string, SubmissionRecord>();
  for (const record of history.filter(x => x.classId === classId).sort(newest))
    if (!current.has(record.studentId)) current.set(record.studentId, record);
  return [...current.values()].sort((a, b) => a.studentName.localeCompare(b.studentName));
}

function freeze<T>(value: T): T {
  if (value && typeof value === "object") { Object.values(value).forEach(freeze); Object.freeze(value); }
  return value;
}
/** Validate persisted evidence and its derived summaries. This does not reverify HMACs. */
export function parseSubmissionHistory(raw: unknown): SubmissionRecord[] {
  if (!Array.isArray(raw) || raw.length > SUBMISSION_LIMITS.records) throw Error("Invalid or oversized submission history.");
  const ids = new Set<string>(), eventIds = new Set<string>();
  let bytes = 2;
  for (const record of raw) {
    if (!plain(record)) throw Error("Invalid submission record.");
    validateSubmissionHandIn(record.snapshot);
    const h = record.snapshot;
    const id = JSON.stringify([h.classId, h.studentId, h.mac]);
    const courses = [...new Set(h.courses)];
    if (record.id !== id || ids.has(id) || record.classId !== h.classId || record.studentId !== h.studentId || record.studentName !== h.studentName ||
        record.submittedAt !== timestamp(h.created) || record.receivedAt !== timestamp(record.receivedAt) ||
        JSON.stringify(record.courses) !== JSON.stringify(courses) || record.attemptCount !== h.progress.attempts.length)
      throw Error("Submission summary does not match its signed snapshot, or is duplicated.");
    ids.add(id);
    if (!Array.isArray(record.reviewEvents) || record.reviewEvents.length > SUBMISSION_LIMITS.events) throw Error("Invalid or oversized review history.");
    for (const event of record.reviewEvents) {
      if (!plain(event) || !text(event.id, 200) || eventIds.has(event.id) || event.submissionId !== id ||
          event.status !== "reviewed" && event.status !== "needs_revision" || event.reviewedAt !== timestamp(event.reviewedAt) ||
          typeof event.note !== "string" || event.note.length > 2000 || event.note !== event.note.trim()) throw Error("Invalid or duplicated review event.");
      eventIds.add(event.id);
    }
    const last = record.reviewEvents.at(-1);
    if (record.status !== (last?.status ?? "pending") || record.reviewedAt !== last?.reviewedAt || record.reviewNote !== last?.note)
      throw Error("Submission status does not match its review events.");
    // Unknown schema extensions need explicit migration, never silent evidence loss.
    const keys = ["snapshot", "reviewEvents", "id", "classId", "studentId", "studentName", "submittedAt", "receivedAt", "courses", "attemptCount", "status", "reviewedAt", "reviewNote"];
    if (Object.keys(record).some(k => !keys.includes(k)) || record.reviewEvents.some(e => Object.keys(e).some(k => !["id", "submissionId", "status", "reviewedAt", "note"].includes(k)))) throw Error("Unknown submission history fields.");
    bytes += new TextEncoder().encode(JSON.stringify(record)).byteLength + 1;
    if (bytes > SUBMISSION_LIMITS.historyBytes) throw Error("Submission history storage limit reached; no evidence was removed.");
  }
  return freeze(structuredClone(raw as SubmissionRecord[]));
}
export function serializeSubmissionHistory(history: readonly SubmissionRecord[]): string {
  return JSON.stringify(parseSubmissionHistory(history));
}

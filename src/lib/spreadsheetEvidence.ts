import type { SpreadsheetAssignment } from "./spreadsheetAssignments";
import { gradeAssignmentV1 as gradeAssignment, validateAssignmentV1 as validateAssignment, validateWorkbookV1 as validateWorkbook } from "./spreadsheetGradingV1";
import { isWorkbookRecord } from "./workbookTemplates";
import type { Workbook } from "./spreadsheet";

/** Learner evidence, not an instructor attestation or an authorization token. */
export interface SpreadsheetSubmission {
  version: 1;
  gradingVersion: 1;
  id: string;
  submittedAt: number;
  courseId: string;
  lessonId: string;
  assignmentId: string;
  assignment: SpreadsheetAssignment;
  workbook: Workbook;
  grade: ReturnType<typeof gradeAssignment>;
}
export type SpreadsheetSubmissionMap = Record<string, SpreadsheetSubmission>;
export const SPREADSHEET_EVIDENCE_LIMITS = { count: 100, submissionBytes: 256 * 1024, aggregateBytes: 2 * 1024 * 1024 } as const;

// Reject lossy JSON (including undefined, nonfinite numbers and custom prototypes),
// rather than silently changing the immutable evidence at an export boundary.
function stableJSON(value: unknown, ancestors = new Set<object>()): string {
  if (value === null || typeof value === "boolean" || typeof value === "string") return JSON.stringify(value);
  if (typeof value === "number" && Number.isFinite(value)) return JSON.stringify(value);
  if (typeof value !== "object" || ancestors.has(value)) throw Error("Evidence must be finite, acyclic JSON");
  if (!Array.isArray(value) && !isWorkbookRecord(value)) throw Error("Evidence must contain plain objects");
  ancestors.add(value);
  try {
    if (Array.isArray(value)) {
      const items: string[] = [];
      for (let i = 0; i < value.length; i++) items.push(stableJSON(value[i], ancestors));
      return `[${items.join(",")}]`;
    }
    return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stableJSON((value as Record<string, unknown>)[key], ancestors)}`).join(",")}}`;
  } finally { ancestors.delete(value); }
}
const bytes = (text: string) => new TextEncoder().encode(text).length;
const validId = (value: unknown) => typeof value === "string" && value.length > 0 && value.length <= 200 && value.trim() === value && !/[\u0000-\u001f]/.test(value) && !["__proto__", "prototype", "constructor"].includes(value);
function frozenClone<T>(value: T): T {
  const clone = structuredClone(value);
  const freeze = (item: unknown) => {
    if (item && typeof item === "object") { Object.values(item).forEach(freeze); Object.freeze(item); }
  };
  freeze(clone);
  return clone;
}

// The version gate dispatches only to the frozen V1 evaluator and validators.
// Future versions must dispatch separately, never replace historical semantics.
export function validateSpreadsheetSubmission(value: unknown): string[] {
  try {
    if (!isWorkbookRecord(value)) return ["Submission must be an object"];
    if (value.version !== 1) return ["Unsupported or missing submission schema version"];
    if (value.gradingVersion !== 1) return ["Unsupported or missing submission grading version"];
    if (bytes(stableJSON(value)) > SPREADSHEET_EVIDENCE_LIMITS.submissionBytes) return ["Submission exceeds byte limit"];
    const errors: string[] = [];
    for (const field of ["id", "courseId", "lessonId", "assignmentId"])
      if (!validId(value[field])) errors.push(`Invalid submission ${field}`);
    if (!Number.isSafeInteger(value.submittedAt) || (value.submittedAt as number) < 0) errors.push("Invalid submission time");
    const assignmentErrors = validateAssignment(value.assignment);
    errors.push(...assignmentErrors);
    if (isWorkbookRecord(value.assignment)) {
      if (value.assignment.id !== value.assignmentId) errors.push("Assignment ID does not match snapshot");
      if (value.assignment.lessonId !== undefined && value.assignment.lessonId !== value.lessonId) errors.push("Lesson ID does not match snapshot");
    }
    const workbookValid = validateWorkbook(value.workbook);
    if (!workbookValid) errors.push("Invalid submitted workbook");
    if (!assignmentErrors.length && workbookValid && stableJSON(value.grade) !== stableJSON(gradeAssignment(value.assignment as unknown as SpreadsheetAssignment, value.workbook as unknown as Workbook)))
      errors.push("Grade does not match submitted evidence");
    return errors;
  } catch { return ["Submission must be bounded, finite, acyclic JSON evidence"]; }
}

export function createSpreadsheetSubmission(input: Omit<SpreadsheetSubmission, "version" | "gradingVersion" | "assignmentId" | "grade">): SpreadsheetSubmission {
  // Validate JSON before cloning/grading so unsupported values are never dropped.
  if (bytes(stableJSON(input)) > SPREADSHEET_EVIDENCE_LIMITS.submissionBytes) throw Error("Submission exceeds byte limit");
  const assignmentErrors = validateAssignment(input.assignment);
  if (assignmentErrors.length) throw Error(assignmentErrors.join("; "));
  if (!validateWorkbook(input.workbook)) throw Error("Invalid submitted workbook");
  const result: SpreadsheetSubmission = { ...input, version: 1, gradingVersion: 1, assignmentId: input.assignment.id, grade: gradeAssignment(input.assignment, input.workbook) };
  const errors = validateSpreadsheetSubmission(result);
  if (errors.length) throw Error(errors.join("; "));
  return frozenClone(result);
}

function checkedMap(value: unknown): SpreadsheetSubmissionMap {
  if (!isWorkbookRecord(value)) throw Error("Submission ledger must be an object");
  if (Object.keys(value).length > SPREADSHEET_EVIDENCE_LIMITS.count) throw Error("Submission count limit exceeded; existing history was not removed");
  if (bytes(stableJSON(value)) > SPREADSHEET_EVIDENCE_LIMITS.aggregateBytes) throw Error("Submission ledger byte limit exceeded; existing history was not removed");
  for (const [id, submission] of Object.entries(value)) {
    const errors = validateSpreadsheetSubmission(submission);
    if (errors.length) throw Error(errors.join("; "));
    if (id !== (submission as SpreadsheetSubmission).id) throw Error("Submission map key does not match ID");
  }
  return value as SpreadsheetSubmissionMap;
}

export function mergeSpreadsheetSubmissions(left: SpreadsheetSubmissionMap, right: SpreadsheetSubmissionMap): SpreadsheetSubmissionMap {
  checkedMap(left); checkedMap(right);
  const merged = { ...left };
  for (const [id, submission] of Object.entries(right)) {
    if (Object.prototype.hasOwnProperty.call(merged, id) && stableJSON(merged[id]) !== stableJSON(submission)) throw Error(`Conflicting submission ID: ${id}`);
    merged[id] = submission;
  }
  checkedMap(merged);
  return frozenClone(merged);
}
export function appendSpreadsheetSubmission(ledger: SpreadsheetSubmissionMap, submission: SpreadsheetSubmission): SpreadsheetSubmissionMap {
  return mergeSpreadsheetSubmissions(ledger, { [submission.id]: submission });
}
export function spreadsheetSubmissionsForCourses(ledger: SpreadsheetSubmissionMap, courseIds: readonly string[]): SpreadsheetSubmissionMap {
  checkedMap(ledger);
  const allowed = new Set(courseIds);
  return frozenClone(Object.fromEntries(Object.entries(ledger).filter(([, entry]) => allowed.has(entry.courseId))));
}
export function submissionMatchesAssignment(submission: SpreadsheetSubmission, assignment: SpreadsheetAssignment): boolean {
  try { return !validateSpreadsheetSubmission(submission).length && stableJSON(submission.assignment) === stableJSON(assignment); }
  catch { return false; }
}

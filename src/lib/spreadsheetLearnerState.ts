import { type Workbook } from "./spreadsheet";
import { validateSpreadsheetMacroRuns } from "./spreadsheetEvidence";
import type { WorkbookMacroTrace } from "./spreadsheetMacros";
import { type SpreadsheetAssignment, canonicalAssignmentAddress, validateAssignment, workbookMetadataSnapshot } from "./spreadsheetAssignments";
import { isWorkbookCellAddress, validateWorkbook } from "./workbookTemplates";

export const SPREADSHEET_VIEW_ROWS = 10;
export const SPREADSHEET_VIEW_COLUMNS = 6;
const MAX_ROW = 1048576, MAX_COLUMN = 16384;

/** Stable exact identity, not a collision-prone short hash. Stored inside each draft. */
export function spreadsheetSnapshot(value: unknown): string {
  const stable = (input: unknown): unknown => {
    if (Array.isArray(input)) return input.map(stable);
    if (input && typeof input === "object") return Object.fromEntries(Object.entries(input).sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => [key, stable(item)]));
    return input;
  };
  return JSON.stringify(stable(value));
}

export function spreadsheetDraftKey(studentId: string | null, courseId: string, assignmentId: string): string {
  return "erudior.course.spreadsheet.v2:" + JSON.stringify([studentId === null ? { guest: true } : { student: studentId }, courseId, assignmentId]);
}

export function learnerWorkbookProblems(assignment: SpreadsheetAssignment, workbook: unknown): string[] {
  const problems = validateAssignment(assignment);
  if (problems.length) return problems;
  if (!validateWorkbook(workbook)) return ["Invalid learner workbook"];
  if (Object.keys(workbook.sheets).sort().join("\0") !== Object.keys(assignment.starter.sheets).sort().join("\0"))
    return ["The draft worksheets do not match this assignment"];
  if (workbookMetadataSnapshot(workbook) !== workbookMetadataSnapshot(assignment.starter)) problems.push("Instructor workbook metadata changed");
  for (const reference of assignment.protectedCells) {
    const canonical = canonicalAssignmentAddress(assignment.starter, reference);
    if (!canonical) return ["Invalid protected cell"];
    const [sheet, cell] = canonical.split("!");
    if (workbook.sheets[sheet]?.[cell] !== assignment.starter.sheets[sheet]?.[cell]) problems.push("Protected cell changed: " + canonical);
  }
  return problems;
}

export type SpreadsheetDraftResult = { workbook: Workbook; message: string; macroRuns?: WorkbookMacroTrace[] };
export function restoreSpreadsheetDraft(raw: string | null, assignment: SpreadsheetAssignment): SpreadsheetDraftResult {
  const starter = () => structuredClone(assignment.starter);
  if (!raw) return { workbook: starter(), message: "" };
  try {
    const draft = JSON.parse(raw);
    if (!draft || draft.version !== 2 || draft.assignmentSnapshot !== spreadsheetSnapshot(assignment))
      return { workbook: starter(), message: "This assignment changed. Started a fresh workbook; the earlier draft was not reused." };
    if (learnerWorkbookProblems(assignment, draft.workbook).length || validateSpreadsheetMacroRuns(assignment, draft.macroRuns).length)
      return { workbook: starter(), message: "The saved draft was invalid or changed protected cells. Started from the assignment instead." };
    return { workbook: structuredClone(draft.workbook), message: "Restored your saved workbook", ...(draft.macroRuns ? { macroRuns: structuredClone(draft.macroRuns) } : {}) };
  } catch {
    return { workbook: starter(), message: "The saved draft could not be read. Started from the assignment instead." };
  }
}

export function serializeSpreadsheetDraft(assignment: SpreadsheetAssignment, workbook: Workbook, macroRuns: WorkbookMacroTrace[] = []): string {
  const problems = [...learnerWorkbookProblems(assignment, workbook), ...validateSpreadsheetMacroRuns(assignment, macroRuns.length ? macroRuns : undefined)];
  if (problems.length) throw Error(problems.join("; "));
  return JSON.stringify({ version: 2, assignmentSnapshot: spreadsheetSnapshot(assignment), workbook, ...(macroRuns.length ? { macroRuns } : {}) });
}

export function spreadsheetColumnName(index: number): string {
  if (!Number.isInteger(index) || index < 1 || index > MAX_COLUMN) throw Error("Invalid column");
  let name = "";
  for (let value = index; value > 0; value = Math.floor((value - 1) / 26)) name = String.fromCharCode(65 + (value - 1) % 26) + name;
  return name;
}

export function spreadsheetCellPosition(input: string): { row: number; column: number } | null {
  const cell = input.trim().toUpperCase();
  if (!isWorkbookCellAddress(cell)) return null;
  const match = /^([A-Z]+)([1-9][0-9]*)$/.exec(cell)!;
  let column = 0;
  for (const char of match[1]) column = column * 26 + char.charCodeAt(0) - 64;
  return { column, row: Number(match[2]) };
}

export function spreadsheetViewport(row = 1, column = 1) {
  const safeRow = Math.min(MAX_ROW, Math.max(1, Number.isFinite(row) ? Math.floor(row) : 1));
  const safeColumn = Math.min(MAX_COLUMN, Math.max(1, Number.isFinite(column) ? Math.floor(column) : 1));
  return {
    row: safeRow, column: safeColumn,
    rows: Array.from({ length: Math.min(SPREADSHEET_VIEW_ROWS, MAX_ROW - safeRow + 1) }, (_, i) => safeRow + i),
    columns: Array.from({ length: Math.min(SPREADSHEET_VIEW_COLUMNS, MAX_COLUMN - safeColumn + 1) }, (_, i) => spreadsheetColumnName(safeColumn + i)),
    hasNextRows: safeRow + SPREADSHEET_VIEW_ROWS <= MAX_ROW,
    hasNextColumns: safeColumn + SPREADSHEET_VIEW_COLUMNS <= MAX_COLUMN,
  };
}

// App progress is optimistic: the shared object can change before disk persistence
// resolves. Keep unconfirmed submission identities outside component lifetimes.
// Reloading the page clears this registry and reloads the authoritative disk state.
const unconfirmedGrades = new Map<string, Set<string>>();
const gradeListeners = new Set<() => void>();
let submissionSequence = 0;
let gradeRegistryVersion = 0;
const notifyGradeListeners = () => { gradeRegistryVersion++; for (const listener of gradeListeners) listener(); };
export function beginSpreadsheetGrade(scope: string): string {
  const submissionId = `${Date.now().toString(36)}-${++submissionSequence}`;
  const submissions = unconfirmedGrades.get(scope) ?? new Set<string>();
  submissions.add(submissionId); unconfirmedGrades.set(scope, submissions);
  notifyGradeListeners();
  return submissionId;
}
export function confirmSpreadsheetGrade(scope: string, submissionId: string): void {
  const submissions = unconfirmedGrades.get(scope);
  if (!submissions?.delete(submissionId)) return;
  if (!submissions.size) unconfirmedGrades.delete(scope);
  notifyGradeListeners();
}
export function spreadsheetGradeUnconfirmed(scope: string, submissionId: string | undefined): boolean {
  return !!submissionId && !!unconfirmedGrades.get(scope)?.has(submissionId);
}
export const spreadsheetGradeRegistryVersion = () => gradeRegistryVersion;
export function subscribeSpreadsheetGrades(listener: () => void): () => void {
  gradeListeners.add(listener);
  return () => { gradeListeners.delete(listener); };
}

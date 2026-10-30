import { createWorkbookCalculator, validateWorkbookCellRules, type Workbook } from "./spreadsheet";
import { isWorkbookCellAddress, isWorkbookRecord, validateWorkbook } from "./workbookTemplates";

export interface SpreadsheetAssignment {
  id: string; title: string; starter: Workbook;
  protectedCells: string[]; answers: Record<string, number | string>;
  tolerance?: number;
}

/** Metadata is instructor-authored, not learner-editable. Exact content survives transport key order. */
export function workbookMetadataSnapshot(workbook: Workbook): string {
  const stable = (value: unknown): unknown => Array.isArray(value) ? value.map(stable)
    : value && typeof value === "object" ? Object.fromEntries(Object.keys(value).sort().map(key => [key, stable((value as Record<string, unknown>)[key])])) : value;
  const { sheets: _sheets, ...metadata } = workbook;
  return JSON.stringify(stable({ metadata, sheetNames: Object.keys(workbook.sheets).sort() }));
}

/** Resolve an authored address without changing the worksheet's display spelling. */
export function canonicalAssignmentAddress(workbook: Workbook, address: unknown): string | null {
  if (typeof address !== "string" || address.length > 51) return null;
  const match = /^([A-Za-z][A-Za-z0-9_ ]{0,39})!([A-Za-z]+[1-9][0-9]*)$/.exec(address);
  if (!match || !isWorkbookCellAddress(match[2].toUpperCase())) return null;
  const names = Object.keys(workbook.sheets).filter(name => name.toUpperCase() === match[1].toUpperCase());
  return names.length === 1 ? `${names[0]}!${match[2].toUpperCase()}` : null;
}

/** Accept unknown input at file/editor boundaries and return errors, never silently discard content. */
export function validateAssignment(value: unknown): string[] {
  if (!isWorkbookRecord(value)) return ["Assignment must be an object"];
  const errors: string[] = [];
  if (typeof value.id !== "string" || !/^[A-Za-z0-9_-]{1,100}$/.test(value.id)) errors.push("Invalid assignment ID");
  if (typeof value.title !== "string" || !value.title.trim()) errors.push("Assignment title required");
  const workbookValid = validateWorkbook(value.starter);
  if (!workbookValid) errors.push("Invalid assignment workbook");
  if (value.tolerance !== undefined && (typeof value.tolerance !== "number" || !Number.isFinite(value.tolerance) || value.tolerance < 0))
    errors.push("Invalid tolerance");
  const checkAddresses = (addresses: unknown[], kind: string) => {
    const seen = new Set<string>();
    for (const address of addresses) {
      const canonical = workbookValid ? canonicalAssignmentAddress(value.starter as Workbook, address) : null;
      if (!canonical) errors.push(`Invalid ${kind} cell ${typeof address === "string" ? address : "(not text)"}`);
      else if (seen.has(canonical)) errors.push(`Duplicate ${kind} cell ${canonical}`);
      else seen.add(canonical);
    }
  };
  if (!Array.isArray(value.protectedCells) || value.protectedCells.length > 20000) errors.push("Invalid protected cells");
  else checkAddresses(value.protectedCells, "protected");
  if (!isWorkbookRecord(value.answers)) errors.push("Invalid grading criteria");
  else {
    const entries = Object.entries(value.answers);
    if (!entries.length) errors.push("No grading criteria");
    if (entries.length > 20000) errors.push("Too many grading criteria");
    checkAddresses(entries.map(([cell]) => cell), "assignment");
    for (const [cell, expected] of entries)
      if (!(typeof expected === "number" && Number.isFinite(expected) || typeof expected === "string" && expected.length <= 2048))
        errors.push(`Invalid expected answer for ${cell}`);
  }
  return errors;
}

/** Canonical addresses, cloned content, and stable IDs for authoring/import/review. */
export function normalizeSpreadsheetAssignment(value: unknown): SpreadsheetAssignment {
  const errors = validateAssignment(value);
  if (errors.length) throw Error(errors.join("; "));
  const assignment = structuredClone(value as SpreadsheetAssignment);
  return {
    ...assignment,
    protectedCells: assignment.protectedCells.map(address => canonicalAssignmentAddress(assignment.starter, address)!),
    answers: Object.fromEntries(Object.entries(assignment.answers).map(([address, expected]) =>
      [canonicalAssignmentAddress(assignment.starter, address)!, expected])),
  };
}

export function gradeAssignment(value: SpreadsheetAssignment, learner: Workbook) {
  const assignment = normalizeSpreadsheetAssignment(value);
  if (!validateWorkbook(learner)) throw Error("Invalid learner workbook");
  if (learner.engineVersion !== assignment.starter.engineVersion || assignment.starter.engineVersion === 2 && workbookMetadataSnapshot(learner) !== workbookMetadataSnapshot(assignment.starter)) throw Error("Instructor workbook metadata changed");
  const validationIssues = assignment.starter.engineVersion === 2 ? validateWorkbookCellRules(learner) : [];
  const calculate = createWorkbookCalculator(learner);
  const feedback = Object.entries(assignment.answers).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0).map(([address, expected]) => {
    const cut = address.lastIndexOf("!"), sheet = address.slice(0, cut), cell = address.slice(cut + 1);
    let actual: number | string | undefined; let passed = false;
    try {
      actual = calculate(sheet, cell);
      passed = typeof expected === "number" && typeof actual === "number"
        ? Math.abs(expected - actual) <= (assignment.tolerance ?? 0) : actual === expected;
    } catch { /* Formula errors remain failed criteria, never a passing blank value. */ }
    return { address, expected, actual: actual ?? null, passed };
  });
  const locked = assignment.protectedCells.filter(address => {
    const cut = address.lastIndexOf("!"), sheet = address.slice(0, cut), cell = address.slice(cut + 1);
    const learnerAddress = canonicalAssignmentAddress(learner, address);
    if (!learnerAddress) return true;
    const learnerSheet = learnerAddress.slice(0, learnerAddress.lastIndexOf("!"));
    return learner.sheets[learnerSheet][cell] !== assignment.starter.sheets[sheet][cell];
  });
  return { score: locked.length || validationIssues.length ? 0 : feedback.filter(f => f.passed).length / feedback.length, feedback, protectedChanges: locked, ...(assignment.starter.engineVersion === 2 ? { validationIssues } : {}) };
}

export const SAMPLE_ASSIGNMENT: SpreadsheetAssignment = {
  id: "spreadsheet-budget-01", title: "Calculate a budget balance",
  starter: { sheets: { Budget: { A1: "Income", B1: 1200, A2: "Expenses", B2: 450, A3: "Remaining", B3: "" } } },
  protectedCells: ["Budget!A1", "Budget!A2", "Budget!A3", "Budget!B1", "Budget!B2"],
  answers: { "Budget!B3": 750 },
};

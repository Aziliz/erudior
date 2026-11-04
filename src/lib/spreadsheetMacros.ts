/** Declarative macro teaching: finite cell edits only, never JavaScript/VBA or external I/O. */
import { calculateCell, validateWorkbookCellRules, workbookAddress, type CellValue, type Workbook, type WorkbookMacro } from "./spreadsheet";
import { isWorkbookRecord, validateWorkbook } from "./workbookTemplates";
export interface WorkbookMacroChange { step: number; target: string; before: CellValue; after: CellValue }
export interface WorkbookMacroTrace { version: 1; macroId: string; definition: WorkbookMacro; before: Workbook; after: Workbook; changes: WorkbookMacroChange[] }
export interface WorkbookMacroPreview { workbook: Workbook; trace: WorkbookMacroTrace }
export const WORKBOOK_MACRO_TRACE_BYTES = 64 * 1024;
function stable(value: unknown, ancestors = new Set<object>()): string {
  if (value === null || typeof value === "boolean" || typeof value === "string" || typeof value === "number" && Number.isFinite(value)) return JSON.stringify(value);
  if (!value || typeof value !== "object" || ancestors.has(value) || !Array.isArray(value) && !isWorkbookRecord(value)) throw Error("Macro trace must contain plain finite JSON");
  ancestors.add(value);
  try { return Array.isArray(value) ? `[${Array.from(value, item => stable(item, ancestors)).join(",")}]` : `{${Object.keys(value).sort().map(key => JSON.stringify(key) + ":" + stable((value as Record<string, unknown>)[key], ancestors)).join(",")}}`; }
  finally { ancestors.delete(value); }
}
const bounded = (value: unknown) => {
  // Inspect incrementally before constructing canonical JSON; reject huge/cyclic
  // imported traces without allocating an unbounded intermediate string.
  let budget = 0;
  const ancestors = new Set<object>();
  const inspect = (item: unknown, depth: number) => {
    if (depth > 64) throw Error("Macro trace nesting limit exceeded");
    if (item && typeof item === "object") {
      if (ancestors.has(item) || !Array.isArray(item) && !isWorkbookRecord(item)) throw Error("Macro trace must contain plain finite JSON");
      ancestors.add(item); budget += 2;
      try {
        const keys = Object.keys(item); if (keys.length > 20000) throw Error("Macro trace exceeds 64 KiB limit");
        for (const key of keys) { budget += Array.isArray(item) ? 1 : key.length + 4; inspect((item as Record<string, unknown>)[key], depth + 1); }
      } finally { ancestors.delete(item); }
    } else if (typeof item === "string") budget += item.length + 2;
    else if (item === null || typeof item === "boolean" || typeof item === "number" && Number.isFinite(item)) budget += String(item).length;
    else throw Error("Macro trace must contain plain finite JSON");
    if (budget > WORKBOOK_MACRO_TRACE_BYTES) throw Error("Macro trace exceeds 64 KiB limit");
  };
  inspect(value, 0);
  const text = stable(value);
  if (new TextEncoder().encode(text).length > WORKBOOK_MACRO_TRACE_BYTES) throw Error("Macro trace exceeds 64 KiB limit");
  return text;
};
export function previewWorkbookMacro(book: Workbook, macroId: string, protectedCells: readonly string[] = []): WorkbookMacroPreview {
  if (!validateWorkbook(book) || book.engineVersion !== 2) throw Error("Macro simulation requires a valid version 2 workbook");
  // Check before copying: trace contains two exact snapshots plus the definition.
  bounded(book);
  const definition = book.macroDefinitions?.find(m => m.id === macroId);
  if (!definition) throw Error("Unknown simulated macro");
  const locked = new Set(protectedCells.map(address => { const a = workbookAddress(book, address); return a.sheet + "!" + a.cell; }));
  const result = structuredClone(book), changes: WorkbookMacroChange[] = [];
  for (const [index, step] of definition.steps.entries()) {
    const { sheet, cell } = workbookAddress(result, step.target), target = sheet + "!" + cell;
    if (locked.has(target)) throw Error("Simulated macro cannot change protected cell: " + target);
    const before = result.sheets[sheet][cell] ?? "";
    let after: CellValue;
    if (step.op === "set") after = step.value;
    else { const source = workbookAddress(result, step.source); after = result.sheets[source.sheet][source.cell] ?? ""; }
    // Copy is exact raw contents, not Excel's relative-reference translation.
    result.sheets[sheet][cell] = after;
    changes.push({ step: index + 1, target, before, after });
  }
  if (!validateWorkbook(result)) throw Error("Simulated macro exceeds workbook limits");
  // All writes are atomic; validation sees the final state, never partial steps.
  const problems = validateWorkbookCellRules(result);
  if (problems.length) throw Error(problems.join("; "));
  for (const change of changes) { const address = workbookAddress(result, change.target); calculateCell(result, address.sheet, address.cell); }
  const trace: WorkbookMacroTrace = { version: 1, macroId, definition: structuredClone(definition), before: structuredClone(book), after: structuredClone(result), changes };
  bounded(trace);
  return { workbook: result, trace };
}
export function validateWorkbookMacroTrace(value: unknown, protectedCells: readonly string[] = []): string[] {
  try {
    bounded(value);
    if (!isWorkbookRecord(value) || value.version !== 1 || typeof value.macroId !== "string" || !validateWorkbook(value.before) || !validateWorkbook(value.after)) return ["Invalid simulated macro trace"];
    const replay = previewWorkbookMacro(value.before, value.macroId, protectedCells);
    return stable(value) === stable(replay.trace) ? [] : ["Simulated macro trace does not match deterministic replay"];
  } catch (error) { return [error instanceof Error ? error.message : "Invalid simulated macro trace"]; }
}
/** Consent is local UI intent, not authenticated instructor or learner identity. */
export function applyWorkbookMacro(book: Workbook, preview: WorkbookMacroPreview, protectedCells: readonly string[] = [], consent = false): WorkbookMacroPreview {
  if (consent !== true) throw Error("Explicit consent is required to apply simulated macro changes");
  if (stable(book) !== stable(preview.trace.before)) throw Error("Workbook changed after preview; preview the macro again");
  const problems = validateWorkbookMacroTrace(preview.trace, protectedCells);
  if (problems.length || stable(preview.workbook) !== stable(preview.trace.after)) throw Error("Invalid or altered simulated macro preview");
  return previewWorkbookMacro(book, preview.trace.macroId, protectedCells);
}

/** Frozen grading-version-1 semantics for saved evidence and instructor review.
 * Deliberate compatibility copy: do not extend this evaluator when adding engine
 * formulas. Introduce a new grading version and dispatch explicitly instead.
 * Security fixes must preserve historical meaning, with migration if necessary.
 * Only type imports: mutable practice-engine helpers cannot reinterpret history.
 */
import type { Workbook, CellValue } from "./spreadsheet";
import type { SpreadsheetAssignment } from "./spreadsheetAssignments";

/** JSON-safe dictionaries only; inherited cells and prototype setters are not workbook data. */
function isWorkbookRecord(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}
/** Standard worksheet bounds; renderers must still use a bounded/sparse viewport. */
function isWorkbookCellAddress(value: unknown): value is string {
  if (typeof value !== "string" || value.length > 10) return false;
  const match = /^([A-Z]{1,3})([1-9][0-9]{0,6})$/.exec(value);
  if (!match || Number(match[2]) > 1048576) return false;
  let column = 0;
  for (const letter of match[1]) column = column * 26 + letter.charCodeAt(0) - 64;
  return column <= 16384; // XFD
}
export function validateWorkbookV1(value: unknown): value is Workbook {
  if (!isWorkbookRecord(value) || !Object.prototype.hasOwnProperty.call(value, "sheets")) return false;
  const sheets = value.sheets;
  if (!isWorkbookRecord(sheets)) return false;
  const names = Object.keys(sheets);
  if (!names.length || names.length > 20 || new Set(names.map(name => name.toUpperCase())).size !== names.length) return false;
  return names.every(name => {
    if (!/^[A-Za-z][A-Za-z0-9_ ]{0,39}$/.test(name) || name.trim() !== name ||
        ["constructor", "prototype", "__proto__"].includes(name.toLowerCase())) return false;
    const cells = sheets[name];
    return isWorkbookRecord(cells) && Object.keys(cells).length <= 1000 &&
      Object.entries(cells).every(([cell, raw]) => isWorkbookCellAddress(cell) &&
        (typeof raw === "string" && raw.length <= 2048 || typeof raw === "number" && Number.isFinite(raw)));
  });
}

const CELL=/^[A-Z]+[1-9][0-9]*$/;
export function calculateCellV1(book: Workbook, sheet: string, address: string): CellValue {
  const cache=new Map<string,CellValue>();
  const visiting=new Set<string>();
  function evaluate(tab:string, cell:string):CellValue {
    if(!CELL.test(cell))throw Error("Invalid cell reference");
    const actualTab=Object.keys(book.sheets).find(name=>name.toUpperCase()===tab.toUpperCase());
    if(!actualTab)throw Error("Unknown worksheet: "+tab);
    const key=actualTab+"!"+cell;
    if(cache.has(key))return cache.get(key)!;
    if(visiting.has(key))throw Error("Circular reference: "+key);
    const worksheet=book.sheets[actualTab];
    if(!worksheet)throw Error("Unknown worksheet: "+tab);
    visiting.add(key);
    try {
      const raw=worksheet[cell] ?? "";
      let result:CellValue;
      if(typeof raw==="number")result=raw;
      else if(!raw.startsWith("="))result=raw;
      else {
        const expression=raw.slice(1).replace(/\s+/g,"").toUpperCase();
        const tokens=expression.match(/(?:[A-Z][A-Z0-9_]*!)?[A-Z]+[1-9][0-9]*|\d+(?:\.\d+)?|[()+\-*/]/g) ?? [];
        if(tokens.join("")!==expression)throw Error("Unsupported formula");
        let position=0;
        const atom=():number=>{
          const token=tokens[position++];
          if(token===undefined)throw Error("Incomplete formula");
          if(token==="("){const value=add();if(tokens[position++]!==")")throw Error("Unclosed parenthesis");return value;}
          if(token==="-")return -atom();
          if(/^\d/.test(token))return Number(token);
          const match=token.match(/^(?:([A-Z][A-Z0-9_]*)!)?([A-Z]+[1-9][0-9]*)$/);
          if(!match)throw Error("Unsupported formula token");
          const value=evaluate(match[1] ?? actualTab,match[2]);
          if(typeof value!=="number" || !Number.isFinite(value))throw Error("Referenced cell is not numeric");
          return value;
        };
        const multiply=():number=>{let v=atom();while(tokens[position]==="*"||tokens[position]==="/"){const op=tokens[position++];const rhs=atom();if(op==="/"&&rhs===0)throw Error("Division by zero");v=op==="*"?v*rhs:v/rhs;}return v;};
        const add=():number=>{let v=multiply();while(tokens[position]==="+"||tokens[position]==="-"){const op=tokens[position++];const rhs=multiply();v=op==="+"?v+rhs:v-rhs;}return v;};
        result=add();if(position!==tokens.length||!Number.isFinite(result))throw Error("Invalid formula result");
      }
      cache.set(key,result);return result;
    } finally {visiting.delete(key);}
  }
  return evaluate(sheet,address);
}

/** Resolve an authored address without changing the worksheet's display spelling. */
function canonicalAssignmentAddress(workbook: Workbook, address: unknown): string | null {
  if (typeof address !== "string" || address.length > 51) return null;
  const match = /^([A-Za-z][A-Za-z0-9_ ]{0,39})!([A-Za-z]+[1-9][0-9]*)$/.exec(address);
  if (!match || !isWorkbookCellAddress(match[2].toUpperCase())) return null;
  const names = Object.keys(workbook.sheets).filter(name => name.toUpperCase() === match[1].toUpperCase());
  return names.length === 1 ? `${names[0]}!${match[2].toUpperCase()}` : null;
}

/** Accept unknown input at file/editor boundaries and return errors, never silently discard content. */
export function validateAssignmentV1(value: unknown): string[] {
  if (!isWorkbookRecord(value)) return ["Assignment must be an object"];
  const errors: string[] = [];
  if (typeof value.id !== "string" || !/^[A-Za-z0-9_-]{1,100}$/.test(value.id)) errors.push("Invalid assignment ID");
  if (typeof value.title !== "string" || !value.title.trim()) errors.push("Assignment title required");
  const workbookValid = validateWorkbookV1(value.starter);
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
function normalizeSpreadsheetAssignment(value: unknown): SpreadsheetAssignment {
  const errors = validateAssignmentV1(value);
  if (errors.length) throw Error(errors.join("; "));
  const assignment = structuredClone(value as SpreadsheetAssignment);
  return {
    ...assignment,
    protectedCells: assignment.protectedCells.map(address => canonicalAssignmentAddress(assignment.starter, address)!),
    answers: Object.fromEntries(Object.entries(assignment.answers).map(([address, expected]) =>
      [canonicalAssignmentAddress(assignment.starter, address)!, expected])),
  };
}

export function gradeAssignmentV1(value: SpreadsheetAssignment, learner: Workbook) {
  const assignment = normalizeSpreadsheetAssignment(value);
  if (!validateWorkbookV1(learner)) throw Error("Invalid learner workbook");
  // Canonical key order survives transport JSON canonicalization without changing feedback.
  const feedback = Object.entries(assignment.answers).sort(([left], [right]) => left < right ? -1 : left > right ? 1 : 0).map(([address, expected]) => {
    const cut = address.lastIndexOf("!"), sheet = address.slice(0, cut), cell = address.slice(cut + 1);
    let actual: number | string | undefined; let passed = false;
    try {
      actual = calculateCellV1(learner, sheet, cell);
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
  return { score: locked.length ? 0 : feedback.filter(f => f.passed).length / feedback.length, feedback, protectedChanges: locked };
}


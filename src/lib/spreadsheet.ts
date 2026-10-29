/** Versioned, deterministic spreadsheet runtime. No eval, external I/O or executable macros. */
import { calculateCellV1 } from "./spreadsheetGradingV1";
import { isWorkbookCellAddress, validateWorkbook } from "./workbookTemplates";
export type CellValue = number | string;
export interface NamedRange { sheet: string; range: string }
export interface WorkbookValidationRule extends NamedRange { kind: "number" | "integer" | "list"; min?: number; max?: number; values?: CellValue[]; allowBlank?: boolean }
export type WorkbookMacroStep = { op: "set"; target: string; value: CellValue } | { op: "copy"; source: string; target: string };
export interface WorkbookMacro { id: string; title: string; steps: WorkbookMacroStep[] }
export interface Workbook {
  sheets: Record<string, Record<string, CellValue>>;
  engineVersion?: 2;
  namedRanges?: Record<string, NamedRange>;
  validationRules?: WorkbookValidationRule[];
  cellExplanations?: Record<string, string>;
  macroDefinitions?: WorkbookMacro[];
}
export const SPREADSHEET_V2_LIMITS = { rangeCells: 1000, operations: 100000, depth: 64, tokens: 1024, metadataItems: 100, macroSteps: 50 } as const;
export const SPREADSHEET_FUNCTIONS = ["SUM", "AVERAGE", "MIN", "MAX", "COUNT", "IF", "AND", "OR", "NOT", "ROUND", "ABS", "SUMIF", "COUNTIF", "VLOOKUP"] as const;
/** A single-sheet rectangle. Reversed and huge ranges fail before allocation. */
export function workbookRangeCells(range: string): string[] {
  if (typeof range !== "string" || range.length > 25 || !/^\$?[A-Za-z]{1,3}\$?[1-9][0-9]*(?::\$?[A-Za-z]{1,3}\$?[1-9][0-9]*)?$/.test(range)) throw Error("Invalid cell range");
  const ends = range.toUpperCase().replace(/\$/g, "").split(":");
  if (ends.length > 2 || !ends.every(isWorkbookCellAddress)) throw Error("Invalid cell range");
  const position = (cell: string) => { const m = /^([A-Z]+)(\d+)$/.exec(cell)!; let col = 0; for (const c of m[1]) col = col * 26 + c.charCodeAt(0) - 64; return [col, Number(m[2])]; };
  const [c1, r1] = position(ends[0]), [c2, r2] = position(ends[1] ?? ends[0]);
  if (c2 < c1 || r2 < r1 || (c2 - c1 + 1) * (r2 - r1 + 1) > SPREADSHEET_V2_LIMITS.rangeCells) throw Error("Range exceeds 1000 cells or is reversed");
  const label = (c: number) => { let s = ""; for (; c; c = Math.floor((c - 1) / 26)) s = String.fromCharCode(65 + (c - 1) % 26) + s; return s; };
  const cells: string[] = [];
  for (let r = r1; r <= r2; r++) for (let c = c1; c <= c2; c++) cells.push(label(c) + r);
  return cells;
}
export function workbookAddress(book: Workbook, address: string): { sheet: string; cell: string } {
  const at = address.lastIndexOf("!");
  if (at < 1) throw Error("Use a worksheet and cell address");
  const sheet = Object.keys(book.sheets).find(s => s.toUpperCase() === address.slice(0, at).toUpperCase());
  const cell = address.slice(at + 1).toUpperCase();
  if (!sheet || !isWorkbookCellAddress(cell)) throw Error("Invalid workbook address");
  return { sheet, cell };
}
type Node = { kind: "literal"; value: CellValue } | { kind: "ref"; sheet?: string; range: string } | { kind: "name"; name: string } | { kind: "unary"; op: string; arg: Node } | { kind: "binary"; op: string; left: Node; right: Node } | { kind: "call"; name: string; args: Node[] };
type Value = CellValue | CellValue[];
function parseFormula(formula: string): Node {
  const source = formula.slice(1), tokens: string[] = [];
  const lexer = /\s+|"(?:[^"]|"")*"|'(?:[^']|'')*'|(?:\d+(?:\.\d*)?|\.\d+)(?:[Ee][+-]?\d+)?|\$?[A-Za-z_][A-Za-z0-9_$]*|<=|>=|<>|[()+\-*/^&=<>!:,]/gy;
  let offset = 0;
  while (offset < source.length) {
    lexer.lastIndex = offset; const m = lexer.exec(source);
    if (!m) throw Error("Unsupported formula syntax");
    offset = lexer.lastIndex;
    if (!/^\s+$/.test(m[0])) tokens.push(m[0]);
    if (tokens.length > SPREADSHEET_V2_LIMITS.tokens) throw Error("Formula token limit exceeded");
  }
  let pos = 0, depth = 0;
  const peek = () => tokens[pos];
  const take = () => tokens[pos++];
  const reference = (first: string, sheet?: string): Node => {
    if (!/^\$?[A-Za-z]{1,3}\$?[1-9]\d*$/.test(first) || !isWorkbookCellAddress(first.replace(/\$/g, "").toUpperCase())) throw Error("Invalid formula cell reference");
    let range = first;
    if (peek() === ":") { take(); const end = take(); if (!end || !/^\$?[A-Za-z]{1,3}\$?[1-9]\d*$/.test(end)) throw Error("Invalid range endpoint"); range += ":" + end; }
    workbookRangeCells(range);
    return { kind: "ref", sheet, range };
  };
  const atom = (): Node => {
    if (++depth > SPREADSHEET_V2_LIMITS.depth) throw Error("Formula nesting limit exceeded");
    try {
      const token = take(); if (!token) throw Error("Incomplete formula");
      if (token === "(" ) { const value = comparison(); if (take() !== ")") throw Error("Unclosed formula parenthesis"); return value; }
      if (token === "-" || token === "+") return { kind: "unary", op: token, arg: atom() };
      if (/^(?:\d|\.\d)/.test(token)) { const value = Number(token); if (!Number.isFinite(value)) throw Error("Nonfinite number"); return { kind: "literal", value }; }
      if (token.startsWith('"')) return { kind: "literal", value: token.slice(1, -1).replace(/""/g, '"') };
      if (peek() === "!") { take(); const cell = take(); if (!cell) throw Error("Missing worksheet cell"); return reference(cell, token.startsWith("'") ? token.slice(1, -1).replace(/''/g, "'") : token); }
      if (!/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(token)) throw Error("Unsupported formula token");
      if (peek() === "(") {
        take(); const name = token.toUpperCase();
        if (!(SPREADSHEET_FUNCTIONS as readonly string[]).includes(name)) throw Error("Unsupported function: " + name);
        const args: Node[] = [];
        if (peek() !== ")") { do { if (args.length) take(); args.push(comparison()); if (args.length > 100) throw Error("Function argument limit exceeded"); } while (peek() === ","); }
        if (take() !== ")") throw Error("Unclosed function call");
        return { kind: "call", name, args };
      }
      if (/^\$?[A-Za-z]{1,3}\$?[1-9]\d*$/.test(token)) return reference(token);
      if (token.toUpperCase() === "TRUE" || token.toUpperCase() === "FALSE") return { kind: "literal", value: token.toUpperCase() === "TRUE" ? 1 : 0 };
      return { kind: "name", name: token.toUpperCase() };
    } finally { depth--; }
  };
  const binary = (next: () => Node, operators: string[]): Node => { let left = next(); while (operators.includes(peek())) { const op = take(); left = { kind: "binary", op, left, right: next() }; } return left; };
  const power = (): Node => binary(atom, ["^"]);
  const multiply = (): Node => binary(power, ["*", "/"]);
  const add = (): Node => binary(multiply, ["+", "-"]);
  const concat = (): Node => binary(add, ["&"]);
  const comparison = (): Node => binary(concat, ["=", "<>", "<", ">", "<=", ">="]);
  const result = comparison(); if (pos !== tokens.length) throw Error("Unexpected formula token"); return result;
}
const scalar = (value: Value): CellValue => { if (Array.isArray(value)) { if (value.length !== 1) throw Error("Expected a scalar value"); return value[0]; } return value; };
const numeric = (value: Value): number => { const v = scalar(value); if (typeof v !== "number" || !Number.isFinite(v)) throw Error("Expected a numeric value"); return v; };
const finite = (value: number): number => { if (!Number.isFinite(value)) throw Error("Invalid formula result"); return value; };
function evaluator(book: Workbook) {
  if (!validateWorkbook(book)) throw Error("Invalid workbook");
  const cache = new Map<string, CellValue>(), visiting = new Set<string>(); let operations = 0;
  const spend = () => { if (++operations > SPREADSHEET_V2_LIMITS.operations) throw Error("Workbook calculation limit exceeded"); };
  function cell(sheet: string, address: string): CellValue {
    spend(); const actual = Object.keys(book.sheets).find(s => s.toUpperCase() === sheet.toUpperCase());
    address = address.toUpperCase().replace(/\$/g, "");
    if (!actual || !isWorkbookCellAddress(address)) throw Error("Invalid worksheet or cell reference");
    const key = actual + "!" + address;
    if (cache.has(key)) return cache.get(key)!;
    if (visiting.has(key)) throw Error("Circular reference: " + key);
    if (visiting.size >= SPREADSHEET_V2_LIMITS.depth) throw Error("Cell dependency depth limit exceeded");
    visiting.add(key);
    try {
      const raw = book.sheets[actual][address] ?? "";
      const value = typeof raw === "string" && raw.startsWith("=") ? scalar(run(parseFormula(raw), actual, 0)) : raw;
      if (typeof value === "number") finite(value);
      if (typeof value === "string" && value.length > 2048) throw Error("Formula text limit exceeded");
      cache.set(key, value); return value;
    } finally { visiting.delete(key); }
  }
  function run(node: Node, sheet: string, depth: number): Value {
    spend(); if (depth > SPREADSHEET_V2_LIMITS.depth) throw Error("Formula evaluation depth limit exceeded");
    const evaluate = (n: Node) => run(n, sheet, depth + 1);
    switch (node.kind) {
      case "literal": return node.value;
      case "ref": { const cells = workbookRangeCells(node.range), values = cells.map(c => cell(node.sheet ?? sheet, c)); return node.range.includes(":") ? values : values[0]; }
      case "name": { const name = Object.keys(book.namedRanges ?? {}).find(n => n.toUpperCase() === node.name); if (!name) throw Error("Unknown named range: " + node.name); const range = book.namedRanges![name]; const values = workbookRangeCells(range.range).map(c => cell(range.sheet, c)); return range.range.includes(":") ? values : values[0]; }
      case "unary": return node.op === "-" ? -numeric(evaluate(node.arg)) : numeric(evaluate(node.arg));
      case "binary": {
        const left = scalar(evaluate(node.left)), right = scalar(evaluate(node.right));
        if (node.op === "&") { const text = String(left) + String(right); if (text.length > 2048) throw Error("Formula text limit exceeded"); return text; }
        if (["=", "<>", "<", ">", "<=", ">="].includes(node.op)) {
          if (typeof left !== typeof right) return node.op === "<>" ? 1 : 0;
          return Number(node.op === "=" ? left === right : node.op === "<>" ? left !== right : node.op === "<" ? left < right : node.op === ">" ? left > right : node.op === "<=" ? left <= right : left >= right);
        }
        const a = numeric(left), b = numeric(right);
        if (node.op === "/" && b === 0) throw Error("Division by zero");
        return finite(node.op === "+" ? a + b : node.op === "-" ? a - b : node.op === "*" ? a * b : node.op === "/" ? a / b : a ** b);
      }
      case "call": {
        const { name, args } = node;
        const arity = (min: number, max = min) => { if (args.length < min || args.length > max) throw Error("Wrong argument count for " + name); };
        if (name === "IF") { arity(3); return evaluate(args[numeric(evaluate(args[0])) !== 0 ? 1 : 2]); }
        const values = args.map(evaluate), flat = values.flat();
        if (["SUM", "AVERAGE", "MIN", "MAX", "COUNT"].includes(name)) {
          arity(1, 100); const numbers = flat.filter((v): v is number => typeof v === "number");
          if (name === "COUNT") return numbers.length;
          if (!numbers.length && name !== "SUM") throw Error("No numeric values for " + name);
          if (name === "SUM" || name === "AVERAGE") { const sum = finite(numbers.reduce((s, v) => s + v, 0)); return name === "SUM" ? sum : finite(sum / numbers.length); }
          return name === "MIN" ? Math.min(...numbers) : Math.max(...numbers);
        }
        if (name === "AND" || name === "OR") { arity(1, 100); return Number(name === "AND" ? flat.every(v => numeric(v) !== 0) : flat.some(v => numeric(v) !== 0)); }
        if (name === "NOT" || name === "ABS") { arity(1); return name === "NOT" ? Number(numeric(values[0]) === 0) : Math.abs(numeric(values[0])); }
        if (name === "ROUND") { arity(2); const n = numeric(values[0]), digits = numeric(values[1]); if (!Number.isInteger(digits) || digits < -12 || digits > 12) throw Error("ROUND digits must be an integer from -12 to 12"); const scale = 10 ** digits; return finite(Math.sign(n) * Math.round(Math.abs(n) * scale) / scale); }
        if (name === "SUMIF" || name === "COUNTIF") {
          arity(name === "COUNTIF" ? 2 : 2, name === "COUNTIF" ? 2 : 3);
          const candidates = Array.isArray(values[0]) ? values[0] : [values[0]], criterion = scalar(values[1]);
          const totals = values[2] === undefined ? candidates : Array.isArray(values[2]) ? values[2] : [values[2]];
          if (totals.length !== candidates.length) throw Error("SUMIF ranges must have equal sizes");
          const match = (v: CellValue) => {
            if (typeof criterion !== "string") return v === criterion;
            const m = /^(<=|>=|<>|=|<|>)(.*)$/.exec(criterion);
            if (!m) return v === criterion;
            const number = m[2].trim() === "" ? NaN : Number(m[2]); const rhs: CellValue = Number.isFinite(number) ? number : m[2];
            if (typeof v !== typeof rhs) return m[1] === "<>";
            return m[1] === "=" ? v === rhs : m[1] === "<>" ? v !== rhs : m[1] === "<" ? v < rhs : m[1] === ">" ? v > rhs : m[1] === "<=" ? v <= rhs : v >= rhs;
          };
          let total = 0; candidates.forEach((v, i) => { spend(); if (match(v)) total += name === "COUNTIF" ? 1 : typeof totals[i] === "number" ? totals[i] as number : 0; }); return finite(total);
        }
        if (name === "VLOOKUP") {
          arity(4); if (numeric(values[3]) !== 0) throw Error("VLOOKUP supports exact matching only (fourth argument 0/FALSE)");
          let range: NamedRange;
          const arg = args[1];
          if (arg.kind === "ref") range = { sheet: arg.sheet ?? sheet, range: arg.range };
          else if (arg.kind === "name") { const key = Object.keys(book.namedRanges ?? {}).find(n => n.toUpperCase() === arg.name); if (!key) throw Error("Unknown lookup range"); range = book.namedRanges![key]; }
          else throw Error("VLOOKUP requires a rectangular range");
          const cells = workbookRangeCells(range.range), firstRow = /\d+$/.exec(cells[0])![0]; const width = cells.filter(c => /\d+$/.exec(c)![0] === firstRow).length;
          const column = numeric(values[2]); if (!Number.isInteger(column) || column < 1 || column > width) throw Error("Invalid lookup column");
          const lookup = scalar(values[0]), table = Array.isArray(values[1]) ? values[1] : [values[1]];
          for (let i = 0; i < table.length; i += width) if (table[i] === lookup) return table[i + column - 1];
          throw Error("Lookup value not found");
        }
        throw Error("Unsupported function");
      }
    }
  }
  return cell;
}
/** One bounded calculation pass across many requested cells. Do not retain across edits. */
export function createWorkbookCalculator(book: Workbook): (sheet: string, address: string) => CellValue {
  if (book.engineVersion === undefined) return (sheet, address) => calculateCellV1(book, sheet, address);
  if (book.engineVersion !== 2) throw Error("Unsupported workbook engine version");
  return evaluator(book);
}
export function calculateCell(book: Workbook, sheet: string, address: string): CellValue {
  return createWorkbookCalculator(book)(sheet, address);
}
export function evaluateWorkbook(book: Workbook): Record<string, Record<string, CellValue>> {
  const calculate = createWorkbookCalculator(book);
  return Object.fromEntries(Object.entries(book.sheets).map(([sheet, cells]) => [sheet, Object.fromEntries(Object.keys(cells).map(cell => [cell, calculate(sheet, cell)]))]));
}
/** Validation is evaluated against calculated values, not formula text. */
export function validateWorkbookCellRules(book: Workbook, addresses?: readonly string[]): string[] {
  if (!validateWorkbook(book)) return ["Invalid workbook"];
  const problems: string[] = [], calculate = book.engineVersion === 2 ? evaluator(book) : (sheet: string, cell: string) => calculateCell(book, sheet, cell);
  const selected = addresses === undefined ? null : new Set(addresses.map(address => { const a = workbookAddress(book, address); return a.sheet + "!" + a.cell; }));
  for (const rule of book.validationRules ?? []) for (const cell of workbookRangeCells(rule.range)) {
    if (selected && !selected.has(rule.sheet + "!" + cell)) continue;
    try {
      const value = calculate(rule.sheet, cell);
      const valid = value === "" && rule.allowBlank === true || (rule.kind === "list" ? rule.values!.includes(value) : typeof value === "number" && (rule.kind !== "integer" || Number.isInteger(value)) && (rule.min === undefined || value >= rule.min) && (rule.max === undefined || value <= rule.max));
      if (!valid) problems.push(`${rule.sheet}!${cell}: ${rule.kind} validation failed`);
    } catch { problems.push(`${rule.sheet}!${cell}: validation could not calculate the cell`); }
  }
  return problems;
}

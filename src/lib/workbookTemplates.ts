import { workbookRangeCells, type Workbook } from "./spreadsheet";
export const WORKBOOK_STORAGE_KEY="erudior.spreadsheet.practice.v1";
export const WORKBOOK_TEMPLATES:Record<string,Workbook>={
  Budget:{sheets:{Budget:{A1:"Item",B1:"Amount",A2:"Income",B2:1200,A3:"Costs",B3:450,A4:"Balance",B4:"=B2-B3"},Practice:{A1:"First value",B1:10,A2:"Second value",B2:5,A3:"Sum",B3:"=B1+B2"}}},
  "Closing worksheet":{sheets:{Closing:{A1:"Sale price",B1:250000,A2:"Credits",B2:1500,A3:"Closing charges",B3:3200,A4:"Net proceeds",B4:"=B1+B2-B3"}}},
  "Spreadsheet formulas":{sheets:{Practice:{A1:"Quantity",B1:6,A2:"Unit price",B2:12,A3:"Subtotal",B3:"=B1*B2",A4:"Discount",B4:5,A5:"Total",B5:"=B3-B4"}}}
};
/** JSON-safe dictionaries only; inherited cells and prototype setters are not workbook data. */
export function isWorkbookRecord(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}
/** Standard worksheet bounds; renderers must still use a bounded/sparse viewport. */
export function isWorkbookCellAddress(value: unknown): value is string {
  if (typeof value !== "string" || value.length > 10) return false;
  const match = /^([A-Z]{1,3})([1-9][0-9]{0,6})$/.exec(value);
  if (!match || Number(match[2]) > 1048576) return false;
  let column = 0;
  for (const letter of match[1]) column = column * 26 + letter.charCodeAt(0) - 64;
  return column <= 16384; // XFD
}
export function validateWorkbook(value: unknown): value is Workbook {
  if (!isWorkbookRecord(value) || !Object.prototype.hasOwnProperty.call(value, "sheets")) return false;
  const sheets = value.sheets;
  if (!isWorkbookRecord(sheets)) return false;
  const names = Object.keys(sheets);
  if (!names.length || names.length > 20 || new Set(names.map(name => name.toUpperCase())).size !== names.length) return false;
  if (!names.every(name => {
    if (!/^[A-Za-z][A-Za-z0-9_ ]{0,39}$/.test(name) || name.trim() !== name ||
        ["constructor", "prototype", "__proto__"].includes(name.toLowerCase())) return false;
    const cells = sheets[name];
    return isWorkbookRecord(cells) && Object.keys(cells).length <= 1000 &&
      Object.entries(cells).every(([cell, raw]) => isWorkbookCellAddress(cell) &&
        (typeof raw === "string" && raw.length <= 2048 || typeof raw === "number" && Number.isFinite(raw)));
  })) return false;
  return validateWorkbookMetadata(value);
}
export function cloneTemplate(name:string):Workbook{
  const workbook=WORKBOOK_TEMPLATES[name];if(!workbook)throw Error("Unknown workbook template");
  return structuredClone(workbook);
}

/** Metadata is declarative JSON, not an imported script or an authority receipt. */
function validateWorkbookMetadata(value: Record<string, unknown>): boolean {
  const fields = ["sheets", "engineVersion", "namedRanges", "validationRules", "cellExplanations", "macroDefinitions"];
  if (Object.keys(value).some(key => !fields.includes(key))) return false;
  const advanced = ["namedRanges", "validationRules", "cellExplanations", "macroDefinitions"].some(key => Object.prototype.hasOwnProperty.call(value, key));
  if (value.engineVersion !== undefined && value.engineVersion !== 2 || advanced && value.engineVersion !== 2) return false;
  if (value.engineVersion === undefined) return true;
  const book = value as unknown as Workbook;
  const exactKeys = (object: Record<string, unknown>, allowed: string[]) => Object.keys(object).every(key => allowed.includes(key));
  const ref = (sheet: unknown, range: unknown) => {
    if (typeof sheet !== "string" || !Object.prototype.hasOwnProperty.call(book.sheets, sheet) || typeof range !== "string" || range.length > 21 || !/^[A-Z]{1,3}[1-9][0-9]*(?::[A-Z]{1,3}[1-9][0-9]*)?$/.test(range)) return false;
    try { workbookRangeCells(range); return true; } catch { return false; }
  };
  const address = (input: unknown) => {
    if (typeof input !== "string" || input.length > 51) return false;
    const cut = input.lastIndexOf("!");
    return cut > 0 && ref(input.slice(0, cut), input.slice(cut + 1)) && !input.includes(":");
  };
  const cellValue = (raw: unknown) => typeof raw === "number" && Number.isFinite(raw) || typeof raw === "string" && raw.length <= 2048;
  if (value.namedRanges !== undefined) {
    if (!isWorkbookRecord(value.namedRanges)) return false;
    const names = Object.keys(value.namedRanges);
    if (names.length > 100 || new Set(names.map(name => name.toUpperCase())).size !== names.length) return false;
    for (const [name, range] of Object.entries(value.namedRanges)) {
      if (!/^[A-Za-z_][A-Za-z0-9_]{0,39}$/.test(name) || /^[A-Za-z]{1,3}[1-9][0-9]*$/.test(name) || ["TRUE", "FALSE", "CONSTRUCTOR", "PROTOTYPE", "__PROTO__"].includes(name.toUpperCase()) || !isWorkbookRecord(range) || !exactKeys(range, ["sheet", "range"]) || !ref(range.sheet, range.range)) return false;
    }
  }
  if (value.validationRules !== undefined) {
    if (!Array.isArray(value.validationRules) || value.validationRules.length > 100) return false;
    let cells = 0;
    for (const rule of value.validationRules) {
      if (!isWorkbookRecord(rule) || !exactKeys(rule, ["sheet", "range", "kind", "min", "max", "values", "allowBlank"]) || !ref(rule.sheet, rule.range) || !["number", "integer", "list"].includes(String(rule.kind))) return false;
      cells += workbookRangeCells(rule.range as string).length; if (cells > 10000) return false;
      if (rule.allowBlank !== undefined && typeof rule.allowBlank !== "boolean") return false;
      if (rule.kind === "list") {
        if (rule.min !== undefined || rule.max !== undefined || !Array.isArray(rule.values) || !rule.values.length || rule.values.length > 100 || !rule.values.every(cellValue)) return false;
      } else {
        if (rule.values !== undefined || rule.min !== undefined && (typeof rule.min !== "number" || !Number.isFinite(rule.min)) || rule.max !== undefined && (typeof rule.max !== "number" || !Number.isFinite(rule.max)) || typeof rule.min === "number" && typeof rule.max === "number" && rule.min > rule.max) return false;
      }
    }
  }
  if (value.cellExplanations !== undefined) {
    if (!isWorkbookRecord(value.cellExplanations) || Object.keys(value.cellExplanations).length > 1000 || !Object.entries(value.cellExplanations).every(([key, text]) => address(key) && typeof text === "string" && text.trim().length > 0 && text.length <= 2048)) return false;
  }
  if (value.macroDefinitions !== undefined) {
    if (!Array.isArray(value.macroDefinitions) || value.macroDefinitions.length > 20) return false;
    const ids = new Set<string>();
    for (const macro of value.macroDefinitions) {
      if (!isWorkbookRecord(macro) || !exactKeys(macro, ["id", "title", "steps"]) || typeof macro.id !== "string" || !/^[A-Za-z][A-Za-z0-9_-]{0,39}$/.test(macro.id) || ["constructor", "prototype"].includes(macro.id.toLowerCase()) || ids.has(macro.id) || typeof macro.title !== "string" || !macro.title.trim() || macro.title.length > 200 || !Array.isArray(macro.steps) || !macro.steps.length || macro.steps.length > 50) return false;
      ids.add(macro.id);
      for (const step of macro.steps) {
        if (!isWorkbookRecord(step) || !address(step.target)) return false;
        if (step.op === "set") { if (!exactKeys(step, ["op", "target", "value"]) || !cellValue(step.value)) return false; }
        else if (step.op === "copy") { if (!exactKeys(step, ["op", "source", "target"]) || !address(step.source)) return false; }
        else return false;
      }
    }
  }
  return true;
}

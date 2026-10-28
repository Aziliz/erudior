import type { Workbook } from "./spreadsheet";
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
  return names.every(name => {
    if (!/^[A-Za-z][A-Za-z0-9_ ]{0,39}$/.test(name) || name.trim() !== name ||
        ["constructor", "prototype", "__proto__"].includes(name.toLowerCase())) return false;
    const cells = sheets[name];
    return isWorkbookRecord(cells) && Object.keys(cells).length <= 1000 &&
      Object.entries(cells).every(([cell, raw]) => isWorkbookCellAddress(cell) &&
        (typeof raw === "string" && raw.length <= 2048 || typeof raw === "number" && Number.isFinite(raw)));
  });
}
export function cloneTemplate(name:string):Workbook{
  const workbook=WORKBOOK_TEMPLATES[name];if(!workbook)throw Error("Unknown workbook template");
  return structuredClone(workbook);
}

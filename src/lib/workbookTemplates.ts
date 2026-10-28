import type { Workbook } from "./spreadsheet";
export const WORKBOOK_STORAGE_KEY="erudior.spreadsheet.practice.v1";
export const WORKBOOK_TEMPLATES:Record<string,Workbook>={
  Budget:{sheets:{Budget:{A1:"Item",B1:"Amount",A2:"Income",B2:1200,A3:"Costs",B3:450,A4:"Balance",B4:"=B2-B3"},Practice:{A1:"First value",B1:10,A2:"Second value",B2:5,A3:"Sum",B3:"=B1+B2"}}},
  "Closing worksheet":{sheets:{Closing:{A1:"Sale price",B1:250000,A2:"Credits",B2:1500,A3:"Closing charges",B3:3200,A4:"Net proceeds",B4:"=B1+B2-B3"}}},
  "Spreadsheet formulas":{sheets:{Practice:{A1:"Quantity",B1:6,A2:"Unit price",B2:12,A3:"Subtotal",B3:"=B1*B2",A4:"Discount",B4:5,A5:"Total",B5:"=B3-B4"}}}
};
export function validateWorkbook(value:unknown):value is Workbook {
  if(!value||typeof value!=="object"||!Object.prototype.hasOwnProperty.call(value,"sheets"))return false;
  const sheets=(value as Workbook).sheets;
  if(!sheets||typeof sheets!=="object"||Array.isArray(sheets))return false;
  const names=Object.keys(sheets);
  if(!names.length||names.length>20)return false;
  return names.every(name=>/^[A-Za-z][A-Za-z0-9_ ]{0,39}$/.test(name) && sheets[name] && typeof sheets[name]==="object" && !Array.isArray(sheets[name]) &&
    Object.entries(sheets[name]).length<=1000 && Object.entries(sheets[name]).every(([cell,raw])=>
      /^[A-Z]+[1-9][0-9]*$/.test(cell) && (typeof raw==="string"&&raw.length<=2048||typeof raw==="number"&&Number.isFinite(raw))));
}
export function cloneTemplate(name:string):Workbook{
  const workbook=WORKBOOK_TEMPLATES[name];if(!workbook)throw Error("Unknown workbook template");
  return structuredClone(workbook);
}

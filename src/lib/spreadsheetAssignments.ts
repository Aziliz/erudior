import { calculateCell, type Workbook } from "./spreadsheet";
import { validateWorkbook } from "./workbookTemplates";
export interface SpreadsheetAssignment {
 id:string; title:string; starter:Workbook;
 protectedCells:string[]; answers:Record<string,number|string>;
 tolerance?:number;
}
const address=/^[A-Za-z][A-Za-z0-9_ ]{0,39}![A-Z]+[1-9][0-9]*$/;
export function validateAssignment(a:SpreadsheetAssignment):string[]{
 const errors:string[]=[];
 if(!a.id.trim()||!a.title.trim()||!validateWorkbook(a.starter))errors.push("Invalid assignment metadata or workbook");
 if(a.tolerance!==undefined&&(!Number.isFinite(a.tolerance)||a.tolerance<0))errors.push("Invalid tolerance");
 for(const cell of [...a.protectedCells,...Object.keys(a.answers)]){
  if(!address.test(cell)||!Object.prototype.hasOwnProperty.call(a.starter.sheets,cell.split("!")[0]))errors.push("Invalid assignment cell "+cell);
 }
 if(!Object.keys(a.answers).length)errors.push("No grading criteria");
 return errors;
}
export function gradeAssignment(a:SpreadsheetAssignment,learner:Workbook){
 const errors=validateAssignment(a);
 if(errors.length||!validateWorkbook(learner))throw Error(errors.join("; ")||"Invalid learner workbook");
 const feedback=Object.entries(a.answers).map(([address,expected])=>{
   const cut=address.lastIndexOf("!"),sheet=address.slice(0,cut),cell=address.slice(cut+1);
   let actual:number|string|undefined;let passed=false;
   try{actual=calculateCell(learner,sheet,cell);passed=typeof expected==="number"&&typeof actual==="number"
     ?Math.abs(expected-actual)<=(a.tolerance??0):actual===expected;}catch{}
   return {address,expected,actual:actual??null,passed};
 });
 const locked=a.protectedCells.filter(address=>{
  const cut=address.lastIndexOf("!"),sheet=address.slice(0,cut),cell=address.slice(cut+1);
  return learner.sheets[sheet]?.[cell]!==a.starter.sheets[sheet]?.[cell];
 });
 return {score:locked.length?0:feedback.filter(f=>f.passed).length/feedback.length,feedback,protectedChanges:locked};
}
export const SAMPLE_ASSIGNMENT:SpreadsheetAssignment={
 id:"spreadsheet-budget-01",title:"Calculate a budget balance",
 starter:{sheets:{Budget:{A1:"Income",B1:1200,A2:"Expenses",B2:450,A3:"Remaining",B3:""}}},
 protectedCells:["Budget!A1","Budget!A2","Budget!A3","Budget!B1","Budget!B2"],
 answers:{"Budget!B3":750},
};

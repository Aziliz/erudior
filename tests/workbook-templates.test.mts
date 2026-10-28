import { cloneTemplate,validateWorkbook,WORKBOOK_TEMPLATES } from "../src/lib/workbookTemplates.ts";
import { calculateCell } from "../src/lib/spreadsheet.ts";
const check=(name:string,valid:boolean)=>{if(!valid)throw Error(name);};
for(const name of Object.keys(WORKBOOK_TEMPLATES)){
 const book=cloneTemplate(name);
 check("template valid: "+name,validateWorkbook(book));
 check("all template formulas calculate: "+name,Object.entries(book.sheets).every(([sheet,cells])=>Object.keys(cells).every(cell=>{try{calculateCell(book,sheet,cell);return true;}catch{return false;}})));
}
const a=cloneTemplate("Budget");a.sheets.Budget.B2=999;
check("templates cloned without modifying source",cloneTemplate("Budget").sheets.Budget.B2===1200);
check("invalid stored workbook rejected",!validateWorkbook({sheets:{Bad:{"A1":{unsafe:true}}}}));
check("empty workbook rejected",!validateWorkbook({sheets:{}}));

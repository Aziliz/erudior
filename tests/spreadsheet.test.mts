import { calculateCell, evaluateWorkbook } from "../src/lib/spreadsheet.ts";
const check=(name:string,yes:boolean)=>{if(!yes)throw Error(name);console.log("PASS",name)};
const workbook={sheets:{Budget:{A1:100,B1:20,C1:"=A1+B1*2",D1:"=(A1+B1)/2",E1:"=A1/4",F1:"note"},Closing:{A1:"=BUDGET!C1",B1:"=A1-10"}}};
check("operator precedence",calculateCell(workbook,"Budget","C1")===140);
check("parentheses",calculateCell(workbook,"Budget","D1")===60);
check("division",calculateCell(workbook,"Budget","E1")===25);
check("cross-sheet reference",calculateCell(workbook,"Closing","B1")===130);
check("literal text",calculateCell(workbook,"Budget","F1")==="note");
check("whole workbook evaluation",evaluateWorkbook(workbook).Closing.A1===140);
const fails=(book:any,cell:string)=>{try{calculateCell(book,"Budget",cell);return false}catch{return true}};
check("circular reference rejected",fails({sheets:{Budget:{A1:"=B1",B1:"=A1"}}},"A1"));
check("injection rejected",fails({sheets:{Budget:{A1:"=EVAL(1)"}}},"A1"));
check("division by zero rejected",fails({sheets:{Budget:{A1:"=1/0"}}},"A1"));

check("cross-sheet references ignore worksheet capitalization",calculateCell(workbook,"Closing","A1")===140);

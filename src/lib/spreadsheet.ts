/** Safe, deterministic spreadsheet foundation: no eval, macros, or external I/O. */
export interface Workbook { sheets: Record<string, Record<string, string | number>> }
export type CellValue = number | string;
const CELL=/^[A-Z]+[1-9][0-9]*$/;
export function calculateCell(book: Workbook, sheet: string, address: string): CellValue {
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
export function evaluateWorkbook(book: Workbook):Record<string,Record<string,CellValue>> {
  const output:Record<string,Record<string,CellValue>>={};
  for(const [name,cells] of Object.entries(book.sheets)){
    output[name]={};
    for(const cell of Object.keys(cells))output[name][cell]=calculateCell(book,name,cell);
  }
  return output;
}

import { useState } from "react";
import type { Workbook } from "../lib/spreadsheet";
import { validateAssignment, type SpreadsheetAssignment } from "../lib/spreadsheetAssignments";
const KEY="erudior.spreadsheet.author.assignment.v1";
export function AssignmentEditor({workbook,onUse}:{workbook:Workbook;onUse:(assignment:SpreadsheetAssignment)=>void}){
 const [title,setTitle]=useState("My spreadsheet exercise");
 const [protectedText,setProtected]=useState("");
 const [address,setAddress]=useState("");
 const [expected,setExpected]=useState("");
 const [tolerance,setTolerance]=useState("0");
 const [checks,setChecks]=useState<Record<string,string>>({});
 const [message,setMessage]=useState("");
 const add=()=>{if(!address.trim()||!expected.trim())return;setChecks(c=>({...c,[address.trim().toUpperCase()]:expected}));setAddress("");setExpected("");};
 const create=():SpreadsheetAssignment=>({
  id:"local-spreadsheet-exercise",title,
  starter:structuredClone(workbook),
  protectedCells:protectedText.split(",").map(x=>x.trim().toUpperCase()).filter(Boolean),
  answers:Object.fromEntries(Object.entries(checks).map(([key,val])=>[key,/^-?(?:\d+\.?\d*|\.\d+)$/.test(val)?Number(val):val])),
  tolerance:Number(tolerance)
 });
 const use=()=>{
   const assignment=create(),errors=validateAssignment(assignment);
   if(errors.length){setMessage(errors.join("; "));return;}
   try{localStorage.setItem(KEY,JSON.stringify(assignment));setMessage("Assignment saved on this device.");onUse(assignment);}
   catch{setMessage("Unable to save assignment on this device.");}
 };
 return <section className="panel" aria-label="Spreadsheet assignment author">
   <h3>Author a spreadsheet assignment</h3>
   <p className="small muted">Start from the current workbook, lock input cells and specify expected calculated results. Assignments remain local until publishing is implemented.</p>
   <label>Assignment title <input className="input" value={title} onChange={e=>setTitle(e.target.value)} /></label>
   <label>Protected cells (comma-separated worksheet!cell references)
     <input className="input" placeholder="Budget!B1, Budget!B2" value={protectedText} onChange={e=>setProtected(e.target.value)}/>
   </label>
   <div className="row" style={{flexWrap:"wrap"}}>
     <label>Graded cell <input className="input" placeholder="Budget!B3" value={address} onChange={e=>setAddress(e.target.value)} /></label>
     <label>Expected result <input className="input" value={expected} onChange={e=>setExpected(e.target.value)}/></label>
     <button type="button" className="btn sm" onClick={add}>Add criterion</button>
   </div>
   {Object.entries(checks).map(([key,value])=><p className="small" key={key}>{key}: {value} <button className="linkish small" type="button" onClick={()=>setChecks(c=>{const next={...c};delete next[key];return next;})}>Remove</button></p>)}
   <label>Numeric tolerance <input className="input" inputMode="decimal" value={tolerance} onChange={e=>setTolerance(e.target.value)}/></label>
   <button type="button" className="btn primary sm" onClick={use}>Save and open assignment</button>
   {message&&<p role="status" className="small">{message}</p>}
 </section>;
}

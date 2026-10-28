import { useState } from "react";
import type { AppApi } from "../App";
import { calculateCell, type Workbook } from "../lib/spreadsheet";
import { gradeAssignment, validateAssignment, type SpreadsheetAssignment } from "../lib/spreadsheetAssignments";
import { validateWorkbook } from "../lib/workbookTemplates";

export default function SpreadsheetCourseAssignment({api,courseId,assignment}:{api:AppApi;courseId:string;assignment:SpreadsheetAssignment & {lessonId:string}}){
 const gradeKey=courseId+"/"+assignment.id;
 const existingGrade=api.progress.spreadsheetGrades?.[gradeKey];
 const key="erudior.course.spreadsheet."+courseId+"."+assignment.id;
 const [book,setBook]=useState<Workbook>(()=>{
   try{const raw=localStorage.getItem(key);if(raw){const value:unknown=JSON.parse(raw);if(validateWorkbook(value))return value;}}catch{}
   return structuredClone(assignment.starter);
 });
 const [status,setStatus]=useState("");
 const [sheet,setSheet]=useState(Object.keys(assignment.starter.sheets)[0]);
 const [grade,setGrade]=useState<ReturnType<typeof gradeAssignment>|null>(null);
 const protectedSet=new Set(assignment.protectedCells);
 const valid=validateAssignment(assignment).length===0;
 const columns=["A","B","C","D","E","F"];
 function change(cell:string,raw:string){
   if(protectedSet.has(sheet+"!"+cell))return;
   const value=raw&&!raw.startsWith("=")&&/^-?(?:\d+\.?\d*|\.\d+)$/.test(raw)?Number(raw):raw;
   const updated={...book,sheets:{...book.sheets,[sheet]:{...book.sheets[sheet],[cell]:value}}};
   setBook(updated);setGrade(null);
   try{localStorage.setItem(key,JSON.stringify(updated));setStatus("Saved locally");}catch{setStatus("Storage unavailable");}
 }
 return <div className="panel" aria-label={assignment.title}>
   <h3>{assignment.title}</h3>
   <p className="small muted">Lesson: {assignment.lessonId}. Edits save locally; protected cells are read-only.</p>
   {!valid?<p role="alert">This assignment has invalid authoring data and cannot be graded.</p>:<>
     <div className="row" role="group" aria-label="Assignment worksheets">
       {Object.keys(book.sheets).map(name=><button type="button" key={name} className={name===sheet?"btn primary sm":"btn sm"} onClick={()=>setSheet(name)}>{name}</button>)}
     </div>
     <div style={{overflowX:"auto"}}><table className="table"><thead><tr><th></th>{columns.map(c=><th key={c} scope="col">{c}</th>)}</tr></thead><tbody>
       {Array.from({length:10},(_,index)=>index+1).map(row=><tr key={row}><th scope="row">{row}</th>{columns.map(col=>{
         const cell=col+row, locked=protectedSet.has(sheet+"!"+cell), raw=book.sheets[sheet]?.[cell]??"";
         let calculated="";try{calculated=String(calculateCell(book,sheet,cell));}catch{calculated="#ERROR";}
         return <td key={cell}><label className="sr-only" htmlFor={"sheet-"+assignment.id+"-"+sheet+"-"+cell}>{sheet}!{cell}</label><input id={"sheet-"+assignment.id+"-"+sheet+"-"+cell} className="input" style={{minWidth:85,width:105}} value={String(raw)} readOnly={locked} aria-readonly={locked} title={calculated} onChange={e=>change(cell,e.target.value)}/></td>;
       })}</tr>)}
     </tbody></table></div>
     <p className="small muted">Formula cells display their calculated values on hover. Protected inputs cannot be edited.</p>
     <button className="btn sm" type="button" onClick={async()=>{
       const result=gradeAssignment(assignment,book);
       setGrade(result);
       await api.updateProgress(previous=>({...previous, spreadsheetGrades:{...previous.spreadsheetGrades,[gradeKey]:{score:result.score,gradedAt:new Date().toISOString(),revision:(previous.spreadsheetGrades?.[gradeKey]?.revision??0)+1}}}));
     }}>Grade assignment</button>
     {existingGrade&&<p className="small muted">Saved grade: {Math.round(existingGrade.score*100)}% · {existingGrade.revision} grading attempt(s)</p>}
     {grade ? (
       <div role="status">
         <strong>{Math.round(grade.score * 100)}% correct</strong>
         {grade.feedback.map(f => (
           <p className="small" key={f.address}>
             {f.address}: {f.passed ? "Correct" : "Revise"} (calculated {String(f.actual)})
           </p>
         ))}
       </div>
     ) : null}
     {status&&<p className="small muted" role="status">{status}</p>}
   </>}
 </div>;
}

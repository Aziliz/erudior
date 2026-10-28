import { useState } from "react";
import { WORKBOOK_STORAGE_KEY, WORKBOOK_TEMPLATES, cloneTemplate, validateWorkbook } from "../lib/workbookTemplates";
import { calculateCell, type Workbook } from "../lib/spreadsheet";
import { SAMPLE_ASSIGNMENT, gradeAssignment, type SpreadsheetAssignment } from "../lib/spreadsheetAssignments";
import { AssignmentEditor } from "./AssignmentEditor";

const COLS=["A","B","C","D","E","F"];
/** Small standalone spreadsheet training workspace using the same calculation engine as course templates. */
export default function SpreadsheetLab(){
  const [book,setBook]=useState<Workbook>(() => {
    try { const saved=localStorage.getItem(WORKBOOK_STORAGE_KEY);if(saved){const value:unknown=JSON.parse(saved);if(validateWorkbook(value))return value;} }catch {}
    return cloneTemplate("Budget");
  });
  const [notice,setNotice]=useState("");
  const [assignment,setAssignment]=useState(false);
  const [activeAssignment,setActiveAssignment]=useState<SpreadsheetAssignment>(SAMPLE_ASSIGNMENT);
  const [authoring,setAuthoring]=useState(false);
  const [grade,setGrade]=useState<ReturnType<typeof gradeAssignment>|null>(null);
  function save(workbook:Workbook){
    try { localStorage.setItem(WORKBOOK_STORAGE_KEY,JSON.stringify(workbook));setNotice("Saved on this device.");}
    catch {setNotice("Unable to save to device storage.");}
  }
  function loadTemplate(name:string){
    setAssignment(false);setGrade(null);
    const workbook=cloneTemplate(name);setBook(workbook);setSheet(Object.keys(workbook.sheets)[0]);setSelected("A1");
    setDraft(String(workbook.sheets[Object.keys(workbook.sheets)[0]]?.A1??""));setEditing(false);setError("");
    setNotice("Template loaded. Save to keep your changes.");
  }
  const [sheet,setSheet]=useState("Budget");
  const [selected,setSelected]=useState("B4");
  const [draft,setDraft]=useState("=B2-B3");
  const [editing,setEditing]=useState(false);
  const [error,setError]=useState("");
  function selectCell(address:string){
    setSelected(address);setDraft(String(book.sheets[sheet]?.[address]??""));setEditing(false);setError("");
  }
  function commit(){
    if(assignment && activeAssignment.protectedCells.includes(sheet+"!"+selected)){setError("Instructor-protected cell");return;}
    const value=draft.trim();
    const parsed=value && !value.startsWith("=")&&/^-?(?:\d+\.?\d*|\.\d+)$/.test(value)?Number(value):value;
    const updated={...book,sheets:{...book.sheets,[sheet]:{...book.sheets[sheet],[selected]:parsed}}};
    try { if(value.startsWith("="))calculateCell(updated,sheet,selected);setBook(updated);setError("");setEditing(false);save(updated); }
    catch(e){setError(String(e));}
  }
  return <section className="panel" aria-labelledby="spreadsheet-lab">
    <div className="panel-head"><h2 id="spreadsheet-lab">Spreadsheet practice lab</h2></div>
    <p className="muted small">Edit cells, calculate formulas, and switch worksheets. Changes can be saved locally on this device. Choose a reusable template or continue your saved workbook.</p>
    <button type="button" className="btn sm" onClick={()=>setAuthoring(a=>!a)}>{authoring?"Close assignment editor":"Create assignment"}</button>
    {authoring&&<AssignmentEditor workbook={book} onUse={created=>{
      setActiveAssignment(created);setBook(structuredClone(created.starter));setSheet(Object.keys(created.starter.sheets)[0]);
      setSelected("A1");setDraft(String(created.starter.sheets[Object.keys(created.starter.sheets)[0]]?.A1??""));
      setAssignment(true);setGrade(null);setEditing(false);setError("");setAuthoring(false);
      setNotice("Custom assignment saved and opened for practice.");
    }}/>}
    <div className="row" style={{flexWrap:"wrap",marginBottom:8}}>
      <button type="button" className="btn sm" onClick={() => {
        const starter=structuredClone(activeAssignment.starter);
        setBook(starter);setAssignment(true);setGrade(null);setSheet("Budget");setSelected("B3");setDraft("");setError("");setEditing(false);
        setNotice("Assignment opened: enter the balance formula in Budget!B3.");
      }}>Start graded assignment</button>
      {assignment && <button type="button" className="btn sm" onClick={() => {
        const result=gradeAssignment(activeAssignment,book);setGrade(result);
      }}>Grade assignment</button>}
    </div>
    {grade && <div role="status" className="small">Assignment score: {Math.round(grade.score*100)}%.
      {grade.feedback.map(f=><p key={f.address}>{f.address}: {f.passed?"Correct":"Needs revision"} (expected {f.expected}, got {String(f.actual)})</p>)}
      {grade.protectedChanges.length>0&&<p>Protected cells modified: {grade.protectedChanges.join(", ")}</p>}
    </div>}
    <div className="row" style={{flexWrap:"wrap",marginBottom:8}}>
      <label htmlFor="workbook-template">Template</label>
      <select id="workbook-template" className="select" defaultValue="" onChange={e=>{if(e.target.value)loadTemplate(e.target.value);e.target.value="";}}>
        <option value="">Choose a template</option>
        {Object.keys(WORKBOOK_TEMPLATES).map(name=><option key={name} value={name}>{name}</option>)}
      </select>
      <button type="button" className="btn sm" onClick={()=>save(book)}>Save workbook</button>
    </div>
    {notice && <p className="small muted" role="status">{notice}</p>}
    <div className="row" role="group" aria-label="Worksheets">
      {Object.keys(book.sheets).map(name=><button key={name} type="button" className={sheet===name?"btn primary sm":"btn sm"} onClick={()=>{setSheet(name);setSelected("A1");setDraft(String(book.sheets[name]?.A1??""));setEditing(false);setError("");}}>{name}</button>)}
    </div>
    <div className="row" style={{marginTop:12}}>
      <label htmlFor="spreadsheet-formula"><strong>{sheet}!{selected}</strong></label>
      <input id="spreadsheet-formula" className="input" style={{flex:1}} value={draft} onChange={e=>{setDraft(e.target.value);setEditing(true)}} onKeyDown={e=>{if(e.key==="Enter")commit();}} aria-label="Selected cell contents" />
      <button className="btn sm" type="button" onClick={commit} disabled={!editing}>Apply</button>
    </div>
    {error&&<p role="alert" className="small" style={{color:"var(--danger)"}}>{error}</p>}
    <div style={{overflowX:"auto",marginTop:12}}>
      <table className="table" aria-label={sheet+" worksheet"}>
        <thead><tr><th scope="col"></th>{COLS.map(c=><th scope="col" key={c}>{c}</th>)}</tr></thead>
        <tbody>{Array.from({length:10},(_,i)=>i+1).map(row=><tr key={row}><th scope="row">{row}</th>{COLS.map(col=>{
          const address=col+row;let display:string;
          try {display=String(calculateCell(book,sheet,address));} catch {display="#ERROR";}
          return <td key={address}><button type="button" onClick={()=>selectCell(address)} aria-label={address+": "+display} aria-pressed={selected===address} style={{width:"100%",minWidth:85,textAlign:"left",border:selected===address?"2px solid var(--accent)":"1px solid transparent",background:"transparent",color:"inherit",padding:"6px"}}>{display||"\u00a0"}</button></td>;
        })}</tr>)}</tbody>
      </table>
    </div>
    <p className="muted small">Try <code>=B2-B3</code> or <code>=PRACTICE!B3</code>. Unsupported formulas and circular references display an error.</p>
    <button type="button" className="btn sm" onClick={()=>{setBook(cloneTemplate("Budget"));setAssignment(false);setGrade(null);try{localStorage.removeItem(WORKBOOK_STORAGE_KEY);}catch{}setNotice("Saved workbook cleared.");setSheet("Budget");setSelected("B4");setDraft("=B2-B3");setEditing(false);setError("");}}>Reset workbook</button>
  </section>;
}

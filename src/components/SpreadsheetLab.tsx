import { useState } from "react";
import { WORKBOOK_STORAGE_KEY, WORKBOOK_TEMPLATES, cloneTemplate, validateWorkbook } from "../lib/workbookTemplates";
import { SpreadsheetFeaturesEditor, SpreadsheetFeatureSummary } from "./SpreadsheetFeaturesEditor";
import { SpreadsheetMacroPanel } from "./SpreadsheetMacroPanel";
import { validateWorkbookMacroTrace, type WorkbookMacroTrace } from "../lib/spreadsheetMacros";
import { validateWorkbookCellRules, calculateCell, type Workbook } from "../lib/spreadsheet";
import { SAMPLE_ASSIGNMENT, gradeAssignment, type SpreadsheetAssignment } from "../lib/spreadsheetAssignments";
import { AssignmentEditor } from "./AssignmentEditor";

const COLS=["A","B","C","D","E","F"];
/** Small standalone spreadsheet training workspace using the same calculation engine as course templates. */
export default function SpreadsheetLab(){
  const [book,setBook]=useState<Workbook>(() => {
    try { const saved=localStorage.getItem(WORKBOOK_STORAGE_KEY);if(saved){const value=JSON.parse(saved);if(value?.version===2&&validateWorkbook(value.workbook)&&Array.isArray(value.macroRuns)&&value.macroRuns.length<=5&&value.macroRuns.every((run:unknown)=>!validateWorkbookMacroTrace(run).length))return value.workbook;if(validateWorkbook(value))return value;} }catch {}
    return cloneTemplate("Budget");
  });
  const [macroRuns,setMacroRuns]=useState<WorkbookMacroTrace[]>(()=>{try{const value=JSON.parse(localStorage.getItem(WORKBOOK_STORAGE_KEY)??"null");return value?.version===2&&validateWorkbook(value.workbook)&&Array.isArray(value.macroRuns)&&value.macroRuns.length<=5&&value.macroRuns.every((run:unknown)=>!validateWorkbookMacroTrace(run).length)?value.macroRuns:[];}catch{return[];}});
  const [features,setFeatures]=useState(false);
  const [featurePending,setFeaturePending]=useState(false);
  const [featureKey,setFeatureKey]=useState(0);
  const [resetPending,setResetPending]=useState(false);
  const [notice,setNotice]=useState("");
  const [assignment,setAssignment]=useState(false);
  const [activeAssignment,setActiveAssignment]=useState<SpreadsheetAssignment>(SAMPLE_ASSIGNMENT);
  const [authorPending,setAuthorPending]=useState(false);
  const [authoring,setAuthoring]=useState(false);
  const [grade,setGrade]=useState<ReturnType<typeof gradeAssignment>|null>(null);
  function save(workbook:Workbook,runs=macroRuns){
    try { localStorage.setItem(WORKBOOK_STORAGE_KEY,JSON.stringify(workbook.engineVersion===2?{version:2,workbook,macroRuns:runs}:workbook));setNotice("Saved on this device.");}
    catch {setNotice("Unable to save to device storage.");}
  }
  function mayLeaveEdit(ignoreAuthor=false){if(editing||featurePending||(!ignoreAuthor&&authorPending)){setNotice("Apply or explicitly discard pending cell, feature and assignment edits first.");return false;}return true;}
  function loadTemplate(name:string){
    if(!mayLeaveEdit())return;
    setAssignment(false);setGrade(null);setMacroRuns([]);
    const workbook=cloneTemplate(name);setBook(workbook);setSheet(Object.keys(workbook.sheets)[0]);setSelected("A1");
    setDraft(String(workbook.sheets[Object.keys(workbook.sheets)[0]]?.A1??""));setEditing(false);setError("");
    setNotice("Template loaded. Save to keep your changes.");
  }
  const [sheet,setSheet]=useState(Object.keys(book.sheets)[0]);
  const [selected,setSelected]=useState("B4");
  const [draft,setDraft]=useState("=B2-B3");
  const [editing,setEditing]=useState(false);
  const [error,setError]=useState("");
  function selectCell(address:string){
    if(!mayLeaveEdit())return;
    setSelected(address);setDraft(String(book.sheets[sheet]?.[address]??""));setEditing(false);setError("");
  }
  function commit(){
    if(assignment && activeAssignment.protectedCells.includes(sheet+"!"+selected)){setError("Instructor-protected cell");return;}
    const value=draft.trim();
    const parsed=value && !value.startsWith("=")&&/^-?(?:\d+\.?\d*|\.\d+)$/.test(value)?Number(value):value;
    const updated={...book,sheets:{...book.sheets,[sheet]:{...book.sheets[sheet],[selected]:parsed}}};
    try { if(value.startsWith("="))calculateCell(updated,sheet,selected);const issues=validateWorkbookCellRules(updated);if(issues.length)throw Error(issues.join("; "));setBook(updated);setGrade(null);setError("");setEditing(false);save(updated); }
    catch(e){setError(String(e));}
  }
  return <section className="panel" aria-labelledby="spreadsheet-lab">
    <div className="panel-head"><h2 id="spreadsheet-lab">Spreadsheet practice lab</h2></div>
    <p className="muted small">Edit cells, calculate formulas, and switch worksheets. Changes can be saved locally on this device. Choose a reusable template or continue your saved workbook.</p>
    <button type="button" className="btn sm" onClick={()=>{if(mayLeaveEdit())setAuthoring(a=>!a);}}>{authoring?"Close assignment editor":"Create assignment"}</button>
    {authoring&&<AssignmentEditor onPendingChange={setAuthorPending} workbook={book} onUse={created=>{
      if(!mayLeaveEdit(true))throw Error("Apply or discard pending workbook edits first.");
      setAuthorPending(false);setActiveAssignment(created);setBook(structuredClone(created.starter));setSheet(Object.keys(created.starter.sheets)[0]);
      setSelected("A1");setDraft(String(created.starter.sheets[Object.keys(created.starter.sheets)[0]]?.A1??""));
      setAssignment(true);setMacroRuns([]);setGrade(null);setEditing(false);setError("");setAuthoring(false);
      setNotice("Custom assignment saved and opened for practice.");
    }}/>}
    <div className="row" style={{flexWrap:"wrap",marginBottom:8}}>
      <button type="button" className="btn sm" onClick={() => {
        if(!mayLeaveEdit())return;
        const starter=structuredClone(activeAssignment.starter);
        setBook(starter);setAssignment(true);setMacroRuns([]);setGrade(null);setSheet(Object.keys(starter.sheets)[0]);setSelected("A1");setDraft(String(starter.sheets[Object.keys(starter.sheets)[0]].A1??""));setError("");setEditing(false);
        setNotice("Assignment opened. Complete the unprotected cells and grade your work.");
      }}>Start graded assignment</button>
      {assignment && <button type="button" className="btn sm" onClick={() => {
        if(!mayLeaveEdit())return;
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
      <button type="button" className="btn sm" onClick={()=>{if(mayLeaveEdit())save(book);}}>Save workbook</button>
    </div>
    {notice && <p className="small muted" role="status">{notice}</p>}
    {!assignment&&<><button type="button" className="btn sm" onClick={()=>{if(mayLeaveEdit())setFeatures(!features);}}>{features?"Close workbook features":"Edit workbook features"}</button>{features&&<SpreadsheetFeaturesEditor key={featureKey} onPendingChange={setFeaturePending} book={book} onChange={next=>{setBook(next);setGrade(null);setMacroRuns([]);save(next,[]);}}/>}</>}
    <SpreadsheetFeatureSummary book={book}/>
    <SpreadsheetMacroPanel book={book} protectedCells={assignment?activeAssignment.protectedCells:[]} disabled={editing||featurePending||authorPending} runs={macroRuns} onApply={(next,trace)=>{setBook(next);setMacroRuns([...macroRuns,trace]);setGrade(null);save(next,[...macroRuns,trace]);setDraft(String(next.sheets[sheet]?.[selected]??""));}}/>
    <div className="row" style={{flexWrap:"wrap"}} role="group" aria-label="Worksheets">
      {Object.keys(book.sheets).map(name=><button key={name} type="button" className={sheet===name?"btn primary sm":"btn sm"} onClick={()=>{if(!mayLeaveEdit())return;setSheet(name);setSelected("A1");setDraft(String(book.sheets[name]?.A1??""));setEditing(false);setError("");}}>{name}</button>)}
    </div>
    <div className="row" style={{marginTop:12}}>
      <label htmlFor="spreadsheet-formula"><strong>{sheet}!{selected}</strong></label>
      <input id="spreadsheet-formula" className="input" style={{flex:1}} value={draft} onChange={e=>{setDraft(e.target.value);setEditing(true)}} onKeyDown={e=>{if(e.key==="Enter")commit();}} aria-label="Selected cell contents" />
      <button className="btn sm" type="button" onClick={commit} disabled={!editing}>Apply</button>
    </div>
    {(editing||featurePending||authorPending)&&<button type="button" className="btn sm" onClick={()=>{setDraft(String(book.sheets[sheet]?.[selected]??""));setEditing(false);setFeaturePending(false);setFeatureKey(x=>x+1);setAuthoring(false);setAuthorPending(false);setError("");setNotice("Pending cell and feature edits discarded; saved workbook unchanged.");}}>Discard pending workbook edits</button>}
    {error&&<p role="alert" className="small" style={{color:"var(--danger)"}}>{error}</p>}
    <div style={{overflowX:"auto",marginTop:12}} role="region" aria-label="Scrollable practice workbook" tabIndex={0}>
      <table className="table" style={{minWidth:720}} aria-label={sheet+" worksheet"}>
        <thead><tr><th scope="col"></th>{COLS.map(c=><th scope="col" key={c}>{c}</th>)}</tr></thead>
        <tbody>{Array.from({length:10},(_,i)=>i+1).map(row=><tr key={row}><th scope="row">{row}</th>{COLS.map(col=>{
          const address=col+row;let display:string;
          try {display=String(calculateCell(book,sheet,address));} catch {display="#ERROR";}
          return <td key={address}><button type="button" onClick={()=>selectCell(address)} aria-label={address+": "+display} aria-pressed={selected===address} style={{width:"100%",minWidth:85,textAlign:"left",border:selected===address?"2px solid var(--accent)":"1px solid transparent",background:"transparent",color:"inherit",padding:"6px"}}>{display||"\u00a0"}</button></td>;
        })}</tr>)}</tbody>
      </table>
    </div>
    <p className="muted small">Try <code>=B2-B3</code> or <code>=PRACTICE!B3</code>. Version 2 also supports functions and ranges such as <code>=SUM(B1:B3)</code>. Unsupported formulas and circular references display an error.</p>
    <button type="button" className="btn sm" onClick={()=>setResetPending(true)}>Reset workbook</button>
    {resetPending&&<div role="group" aria-label="Confirm practice workbook reset"><p>Discard this workbook, pending edits and local simulation traces? Course submissions are not changed.</p><button type="button" className="btn danger sm" onClick={()=>{setBook(cloneTemplate("Budget"));setAssignment(false);setGrade(null);setMacroRuns([]);try{localStorage.removeItem(WORKBOOK_STORAGE_KEY);}catch{}setNotice("Saved workbook cleared.");setSheet("Budget");setSelected("B4");setDraft("=B2-B3");setEditing(false);setFeaturePending(false);setFeatureKey(x=>x+1);setResetPending(false);setAuthoring(false);setAuthorPending(false);setError("");}}>Confirm reset workbook</button><button type="button" className="btn sm" onClick={()=>setResetPending(false)}>Keep workbook</button></div>}
  </section>;
}

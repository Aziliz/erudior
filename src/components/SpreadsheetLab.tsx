import { useState } from "react";
import { calculateCell, type Workbook } from "../lib/spreadsheet";

const INITIAL:Workbook={sheets:{Budget:{A1:"Item",B1:"Amount",A2:"Income",B2:1200,A3:"Costs",B3:450,A4:"Balance",B4:"=B2-B3"},Practice:{A1:"First value",B1:10,A2:"Second value",B2:5,A3:"Sum",B3:"=B1+B2"}}};
const COLS=["A","B","C","D","E","F"];
/** Small standalone spreadsheet training workspace using the same calculation engine as course templates. */
export default function SpreadsheetLab(){
  const [book,setBook]=useState<Workbook>(INITIAL);
  const [sheet,setSheet]=useState("Budget");
  const [selected,setSelected]=useState("B4");
  const [draft,setDraft]=useState("=B2-B3");
  const [editing,setEditing]=useState(false);
  const [error,setError]=useState("");
  function selectCell(address:string){
    setSelected(address);setDraft(String(book.sheets[sheet]?.[address]??""));setEditing(false);setError("");
  }
  function commit(){
    const value=draft.trim();
    const parsed=value && !value.startsWith("=")&&/^-?(?:\d+\.?\d*|\.\d+)$/.test(value)?Number(value):value;
    const updated={...book,sheets:{...book.sheets,[sheet]:{...book.sheets[sheet],[selected]:parsed}}};
    try { if(value.startsWith("="))calculateCell(updated,sheet,selected);setBook(updated);setError("");setEditing(false); }
    catch(e){setError(String(e));}
  }
  return <section className="panel" aria-labelledby="spreadsheet-lab">
    <div className="panel-head"><h2 id="spreadsheet-lab">Spreadsheet practice lab</h2></div>
    <p className="muted small">Edit cells, calculate formulas, and switch worksheets. This is a temporary practice workbook; changes are not yet saved.</p>
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
    <button type="button" className="btn sm" onClick={()=>{setBook(INITIAL);setSheet("Budget");setSelected("B4");setDraft("=B2-B3");setEditing(false);setError("");}}>Reset workbook</button>
  </section>;
}

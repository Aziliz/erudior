import { useState } from "react";
import type { Course } from "../lib/types";
import { spreadsheetReviewReport } from "../lib/spreadsheetReview";
import { exportCourseSnapshot } from "../lib/course";
import { sha256Hex } from "../lib/courseSign";
import type { SpreadsheetReleaseApproval } from "../lib/spreadsheetReleaseApproval";

/** Review preparation only. Final acceptance requires protected repository review controls. */
export default function SpreadsheetReviewPanel({course}:{course:Course}){
 const [reviewer,setReviewer]=useState("");
 const [receipt,setReceipt]=useState<SpreadsheetReleaseApproval|null>(null);
 const [error,setError]=useState("");
 const report=spreadsheetReviewReport(course);
 async function prepare(){
  setReceipt(null);
  if(!report.readyForHumanReview){setError("Fix validation errors before review.");return;}
  if(!reviewer.trim()){setError("Reviewer identity required.");return;}
  const snapshotSha256=await sha256Hex(new TextEncoder().encode(exportCourseSnapshot(course)));
  setReceipt({courseId:course.id,revision:course.revision??1,snapshotSha256,reviewer:reviewer.trim(),reviewedAt:new Date().toISOString()});
  setError("");
 }
 return <section className="panel" aria-label="Spreadsheet course release review">
  <h3>Spreadsheet review preparation</h3>
  <p className="small muted">This panel prepares a review record. It does not authorize or publish official course content. Protected repository review is still required.</p>
  {report.assignments.map(item=><div key={item.id} className="small">
    <strong>{item.title}</strong> — lesson {item.lessonId}; {item.gradedCells} graded cells, {item.protectedCells} protected cells.
    {item.issues.map(issue=><p role="alert" key={issue}>{issue}</p>)}
  </div>)}
  {report.issues.map(issue=><p role="alert" className="small" key={issue}>{issue}</p>)}
  <label>Reviewer <input className="input" value={reviewer} onChange={e=>setReviewer(e.target.value)}/></label>
  <button className="btn sm" type="button" disabled={!report.readyForHumanReview} onClick={prepare}>Prepare review record</button>
  {error&&<p role="alert">{error}</p>}
  {receipt&&<div><p className="small muted">Review record for course revision {receipt.revision}. Save the JSON for the protected review workflow.</p>
    <textarea className="input" aria-label="Review record JSON" readOnly rows={8} value={JSON.stringify(receipt,null,2)}/>
    <button type="button" className="btn sm" onClick={()=>navigator.clipboard.writeText(JSON.stringify(receipt,null,2))}>Copy review record</button>
  </div>}
 </section>;
}

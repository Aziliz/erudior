import { useEffect, useRef, useState } from "react";
import type { Course } from "../lib/types";
import { SpreadsheetFeatureSummary } from "./SpreadsheetFeaturesEditor";
import { spreadsheetReviewReport } from "../lib/spreadsheetReview";
import { exportCourseSnapshot } from "../lib/course";
import { sha256Hex } from "../lib/courseSign";
import type { SpreadsheetReleaseApproval } from "../lib/spreadsheetReleaseApproval";

type PreparedReview = { receipt: SpreadsheetReleaseApproval; snapshot: string };
/** Preparation is not approval: protected repository review still controls publication. */
export default function SpreadsheetReviewPanel({ course }: { course: Course }) {
  const [reviewer, setReviewer] = useState("");
  const [acknowledged, setAcknowledged] = useState(false);
  const [prepared, setPrepared] = useState<PreparedReview | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const report = spreadsheetReviewReport(course);
  const snapshot = exportCourseSnapshot(course);
  const currentSnapshot = useRef(snapshot);
  currentSnapshot.current = snapshot;
  const currentReviewer = useRef(reviewer);
  currentReviewer.current = reviewer;
  const active = prepared?.snapshot === snapshot && prepared.receipt.reviewer === reviewer.trim() && acknowledged ? prepared : null;
  useEffect(() => { setPrepared(null); setAcknowledged(false); setNotice(""); }, [snapshot, reviewer]);
  async function prepare() {
    setPrepared(null);
    if (!report.readyForHumanReview) return setNotice("Fix validation errors before review.");
    if (!reviewer.trim() || !acknowledged) return setNotice("Enter a reviewer identity and explicitly acknowledge inspection first.");
    const inspectedSnapshot = snapshot, inspectedReviewer = reviewer.trim();
    setBusy(true);
    try {
      const snapshotSha256 = await sha256Hex(new TextEncoder().encode(inspectedSnapshot));
      if (currentSnapshot.current !== inspectedSnapshot || currentReviewer.current.trim() !== inspectedReviewer) return;
      setPrepared({ snapshot: inspectedSnapshot, receipt: { courseId: course.id, revision: course.revision ?? 1, snapshotSha256, reviewer: inspectedReviewer, reviewedAt: new Date().toISOString() } });
      setNotice("Review record prepared for this exact snapshot. Official acceptance is still required.");
    } catch { setNotice("Unable to calculate the snapshot digest. No review record was created."); }
    finally { setBusy(false); }
  }
  async function copy(text: string) {
    try { await navigator.clipboard.writeText(text); setNotice("Copied."); }
    catch { setNotice("Clipboard is unavailable. Select and copy the text below instead."); }
  }
  function download(text: string, filename: string) {
    let url: string | undefined;
    try {
      url = URL.createObjectURL(new Blob([text], { type: "application/json" }));
      const link = document.createElement("a"); link.href = url; link.download = filename;
      document.body.appendChild(link); link.click(); link.remove();
      const savedUrl = url; setTimeout(() => URL.revokeObjectURL(savedUrl), 1000);
      setNotice("Download prepared. Keep the snapshot and record together for protected review.");
    } catch { if (url) URL.revokeObjectURL(url); setNotice("Download unavailable. Copy the JSON below instead."); }
  }
  return <section className="panel" aria-label="Spreadsheet course release review">
    <h3>Spreadsheet review preparation</h3>
    <p className="small muted">Inspect the starter, protected inputs and expected results. This does not authorize or publish official content. Protected repository review and the signed release pipeline are still required. Editing any course content invalidates this record.</p>
    {report.assignments.map(item => {
      const assignment = course.spreadsheetAssignments?.find(a => a.id === item.id);
      return <section key={item.id} className="panel">
        <h4>{item.title}</h4><p className="small">Lesson: {course.lessons.find(l => l.id === item.lessonId)?.title ?? item.lessonId} · {item.gradedCells} graded cells · {item.protectedCells} protected cells</p>
        {assignment && <>
          <SpreadsheetFeatureSummary book={assignment.starter}/>
          {(assignment.starter.macroDefinitions??[]).map(m=><section key={m.id}><h5>Simulated macro: {m.title}</h5><ol>{m.steps.map((step,i)=><li key={i}>{step.op} {step.target}: {step.op==="copy"?step.source:String(step.value)}</li>)}</ol></section>)}
          <p className="small">Numeric tolerance: {assignment.tolerance ?? 0}</p>
          <div style={{ maxHeight: 320, overflow: "auto" }}><table className="table" aria-label={item.title + " grading criteria"}><thead><tr><th>Cell</th><th>Expected result</th><th>Protected</th></tr></thead><tbody>{Object.entries(assignment.answers).map(([address, expected]) => <tr key={address}><th scope="row">{address}</th><td>{JSON.stringify(expected)} ({typeof expected})</td><td>{assignment.protectedCells.includes(address) ? "Yes" : "No"}</td></tr>)}</tbody></table></div>
          <p className="small">Protected cells: {assignment.protectedCells.join(", ") || "None"}</p>
          <details><summary>Inspect full starter workbook</summary><pre style={{ maxHeight: 320, overflow: "auto", whiteSpace: "pre-wrap" }}>{JSON.stringify(assignment.starter, null, 2)}</pre></details>
        </>}
        {item.issues.map(issue => <p role="alert" key={issue}>{issue}</p>)}
      </section>;
    })}
    {report.issues.map(issue => <p role="alert" className="small" key={issue}>{issue}</p>)}
    <label>Reviewer <input className="input" value={reviewer} onChange={e => setReviewer(e.target.value)} /></label>
    <label className="row"><input type="checkbox" checked={acknowledged} onChange={e => { setAcknowledged(e.target.checked); if (!e.target.checked) setPrepared(null); }} /> I inspected every starter, protected cell, expected result, lesson link, named range, validation rule and simulated macro definition in this course snapshot.</label>
    <button className="btn sm" type="button" disabled={!report.readyForHumanReview || !acknowledged || !reviewer.trim() || busy} onClick={prepare}>{busy ? "Preparing…" : "Prepare review record"}</button>
    {notice && <p role="status">{notice}</p>}
    {active && <div className="stack">
      <p className="small muted">Course revision {active.receipt.revision}. These exact snapshot bytes are bound to the record digest. Final protected approval is not supplied by this panel.</p>
      <label>Review record JSON<textarea className="input" readOnly rows={8} value={JSON.stringify(active.receipt, null, 2)} /></label>
      <div className="row" style={{flexWrap:"wrap"}}><button type="button" className="btn sm" onClick={() => copy(JSON.stringify(active.receipt, null, 2))}>Copy review record</button><button type="button" className="btn sm" onClick={() => download(JSON.stringify(active.receipt, null, 2), "spreadsheet-review.json")}>Download review record</button></div>
      <details><summary>Exact reviewed course snapshot</summary><textarea className="input" aria-label="Reviewed course snapshot JSON" readOnly rows={12} value={active.snapshot} /></details>
      <div className="row" style={{flexWrap:"wrap"}}><button type="button" className="btn sm" onClick={() => copy(active.snapshot)}>Copy reviewed snapshot</button><button type="button" className="btn sm" onClick={() => download(active.snapshot, "reviewed-course.json")}>Download reviewed snapshot</button></div>
    </div>}
  </section>;
}

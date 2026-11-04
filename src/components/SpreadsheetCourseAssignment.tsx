import { learningDraftStorage, TEMPORARY_GUEST } from "../lib/guestSession";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import type { AppApi } from "../App";
import { SpreadsheetFeatureSummary } from "./SpreadsheetFeaturesEditor";
import { SpreadsheetMacroPanel, SpreadsheetMacroTraceList } from "./SpreadsheetMacroPanel";
import type { WorkbookMacroTrace } from "../lib/spreadsheetMacros";
import { calculateCell, validateWorkbookCellRules, type Workbook } from "../lib/spreadsheet";
import { canonicalAssignmentAddress, gradeAssignment, validateAssignment, type SpreadsheetAssignment } from "../lib/spreadsheetAssignments";
import { registerNavigationGuard } from "../lib/navigationGuard";
import { activeStudent, confirmAction } from "../lib/storage";
import {
  beginSpreadsheetGrade, confirmSpreadsheetGrade, spreadsheetGradeUnconfirmed, spreadsheetGradeRegistryVersion, subscribeSpreadsheetGrades,
  learnerWorkbookProblems, restoreSpreadsheetDraft, serializeSpreadsheetDraft, spreadsheetCellPosition,
  spreadsheetDraftKey, spreadsheetSnapshot, spreadsheetViewport, SPREADSHEET_VIEW_COLUMNS, SPREADSHEET_VIEW_ROWS,
} from "../lib/spreadsheetLearnerState";

import { appendSpreadsheetSubmission, createSpreadsheetSubmission, submissionMatchesAssignment, type SpreadsheetSubmission } from "../lib/spreadsheetEvidence";
import { beginSpreadsheetSubmissionSave, confirmSpreadsheetSubmissionSave, failSpreadsheetSubmissionSave, getConfirmedSpreadsheetSubmissions,
  pendingSpreadsheetSubmission, prepareSpreadsheetSubmission, spreadsheetSubmissionRegistryVersion, subscribeSpreadsheetSubmissions } from "../lib/spreadsheetSubmissionState";

type Props = { api: AppApi; courseId: string; assignment: SpreadsheetAssignment & { lessonId: string } };

export default function SpreadsheetCourseAssignment(props: Props) {
  const problems = validateAssignment(props.assignment);
  if (problems.length) return <div className="panel" role="alert">This assignment has invalid authoring data and cannot be opened: {problems.join("; ")}</div>;
  // Remount synchronously rather than briefly exposing another child's previous session.
  const identity = spreadsheetDraftKey(props.api.student?.id ?? null, props.courseId, props.assignment.id) + spreadsheetSnapshot(props.assignment);
  return <LearnerSession key={identity} {...props} />;
}

function LearnerSession({ api, courseId, assignment }: Props) {
  const prefix = useId();
  const studentId = api.student?.id ?? null;
  const key = spreadsheetDraftKey(api.student?.id ?? null, courseId, assignment.id);
  const assignmentSnapshot = spreadsheetSnapshot(assignment);
  const [initial] = useState(() => {
    try { return restoreSpreadsheetDraft(learningDraftStorage.getItem(key), assignment); }
    catch { return { workbook: structuredClone(assignment.starter), message: "Storage unavailable. Changes can be practiced here but may not survive closing this page." }; }
  });
  const [book, setBook] = useState<Workbook>(initial.workbook);
  const [macroRuns,setMacroRuns]=useState<WorkbookMacroTrace[]>("macroRuns" in initial ? initial.macroRuns ?? [] : []);
  const [pendingCell,setPendingCell]=useState<{sheet:string;cell:string;raw:string}|null>(null);
  const [status, setStatus] = useState(initial.message);
  const [error, setError] = useState("");
  const [sheet, setSheet] = useState(Object.keys(assignment.starter.sheets)[0]);
  const [position, setPosition] = useState({ row: 1, column: 1 });
  const [target, setTarget] = useState("");
  const [grade, setGrade] = useState<ReturnType<typeof gradeAssignment> | null>(null);
  const [busy, setBusy] = useState(false);
  const [draftSaveFailed, setDraftSaveFailed] = useState(false);
  const [gradeSaveFailed, setGradeSaveFailed] = useState(false);
  const busyRef = useRef(false);
  const alive = useRef(true);
  useEffect(() => { alive.current = true; return () => { alive.current = false; }; }, []);
  const protectedSet = new Set(assignment.protectedCells.map(address => canonicalAssignmentAddress(assignment.starter, address)));
  const viewport = spreadsheetViewport(position.row, position.column);
  const gradeKey = courseId + "/" + assignment.id;
  useSyncExternalStore(subscribeSpreadsheetGrades, spreadsheetGradeRegistryVersion, spreadsheetGradeRegistryVersion);
  const savedGrade = api.progress.spreadsheetGrades?.[gradeKey];
  const unconfirmedGrade = spreadsheetGradeUnconfirmed(key, savedGrade?.submissionId);
  const currentGrade = savedGrade?.assignmentSnapshot === assignmentSnapshot ? savedGrade : undefined;
  const currentWorkbookSnapshot = spreadsheetSnapshot(book);
  useSyncExternalStore(subscribeSpreadsheetSubmissions, spreadsheetSubmissionRegistryVersion, spreadsheetSubmissionRegistryVersion);
  const pendingSubmission = pendingSpreadsheetSubmission(studentId, courseId, assignment.id);
  const submissionSaving = !!pendingSubmission?.saving;
  const leaveState = useRef({ pending: false, unsaved: false, saving: false });
  leaveState.current = { pending: !!pendingCell, unsaved: draftSaveFailed, saving: busy || submissionSaving };
  useEffect(() => {
    const unsafe = () => leaveState.current.pending || leaveState.current.unsaved;
    const off = registerNavigationGuard(() => {
      if (busyRef.current || leaveState.current.saving) return false;
      return !unsafe() || window.confirm('Leave this spreadsheet and discard unapplied or unsaved edits? Saved drafts and historical evidence stay unchanged.');
    });
    const before = (event: BeforeUnloadEvent) => {
      if (busyRef.current || leaveState.current.saving || unsafe()) { event.preventDefault(); event.returnValue = ''; }
    };
    window.addEventListener('beforeunload', before);
    return () => { off(); window.removeEventListener('beforeunload', before); };
  }, []);
  let history: SpreadsheetSubmission[] = [], historyError = "";
  try { history = Object.values(getConfirmedSpreadsheetSubmissions(api.progress, studentId)).filter(item => item.courseId === courseId && item.assignmentId === assignment.id).sort((a, b) => b.submittedAt - a.submittedAt); }
  catch { historyError = "Submission history could not be validated. Existing evidence was not changed."; }


  function saveDraft(next: Workbook, runs=macroRuns) {
    if(activeStudent()!==studentId){setError("The active learner changed. This draft was not saved.");return;}
    try { learningDraftStorage.setItem(key, serializeSpreadsheetDraft(assignment, next, runs)); setDraftSaveFailed(false); setStatus(TEMPORARY_GUEST ? "Kept for this temporary visit only" : "Saved locally for this learner"); }
    catch { setDraftSaveFailed(true); setStatus("Could not save this draft. Your current edits remain on screen; retry saving before leaving."); }
  }

  function change(cell: string, raw: string) {
    if(activeStudent()!==studentId){setError("The active learner changed. This edit was not applied.");return;}
    if (busyRef.current || submissionSaving || protectedSet.has(sheet + "!" + cell)) return;
    const value = raw && !raw.startsWith("=") && /^-?(?:\d+\.?\d*|\.\d+)$/.test(raw) ? Number(raw) : raw;
    const cells = { ...book.sheets[sheet], [cell]: value };
    if (raw === "" && !(cell in assignment.starter.sheets[sheet])) delete cells[cell];
    const next = { ...book, sheets: { ...book.sheets, [sheet]: cells } };
    const previousIssues=new Set(validateWorkbookCellRules(book));
    const problems = [...learnerWorkbookProblems(assignment, next),...validateWorkbookCellRules(next,[sheet+"!"+cell]),...validateWorkbookCellRules(next).filter(issue=>!previousIssues.has(issue))];
    if (problems.length) { setError(problems.join("; ")); return; }
    setError(""); setGrade(null); setBook(next); setPendingCell(null); saveDraft(next);
  }

  function goToCell(address: string) {
    if(pendingCell){setError("Apply or discard the pending cell edit first.");return;}
    const canonical = canonicalAssignmentAddress(assignment.starter, address.includes("!") ? address : sheet + "!" + address);
    const separator = canonical?.lastIndexOf("!") ?? -1;
    const next = canonical ? spreadsheetCellPosition(canonical.slice(separator + 1)) : null;
    if (!canonical || !next) { setError("Enter an existing worksheet and cell, such as Budget!AA12, or a cell on this worksheet."); return; }
    setSheet(canonical.slice(0, separator)); setPosition(next); setTarget(""); setError("");
  }

  async function gradePractice() {
    if(pendingCell){setError("Apply or discard the pending cell edit first.");return;}
    if (busyRef.current || submissionSaving) return;
    busyRef.current = true; setBusy(true); setError("");
    try {
      const problems = learnerWorkbookProblems(assignment, book);
      if (problems.length) throw Error(problems.join("; "));
      const result = gradeAssignment(assignment, book);
      // Invoke immediately: progress belongs to the active student's current store.
      if (activeStudent() !== (api.student?.id ?? null)) throw Error("The active learner is changing. Wait for the new learner to load.");
      const submissionId = beginSpreadsheetGrade(key);
      await api.updateProgress(previous => ({ ...previous, spreadsheetGrades: { ...previous.spreadsheetGrades, [gradeKey]: {
        score: result.score, gradedAt: new Date().toISOString(),
        revision: (previous.spreadsheetGrades?.[gradeKey]?.assignmentSnapshot === assignmentSnapshot ? previous.spreadsheetGrades[gradeKey].revision : 0) + 1,
        assignmentSnapshot, workbookSnapshot: currentWorkbookSnapshot, submissionId,
      } } }));
      confirmSpreadsheetGrade(key, submissionId);
      if (alive.current) { setGradeSaveFailed(false); setGrade(result); setStatus("Practice grade saved for this assignment version"); }
    } catch (failure) {
      if (alive.current) { setGradeSaveFailed(true); setError("Could not save the grade. Your workbook is unchanged; retry. " + (failure instanceof Error ? failure.message : "")); }
    } finally {
      busyRef.current = false;
      if (alive.current) setBusy(false);
    }
  }

  async function submitForReview() {
    if(pendingCell){setError("Apply or discard the pending cell edit first.");return;}
    if (busyRef.current || submissionSaving) return;
    let record: SpreadsheetSubmission | undefined;
    try {
      if (activeStudent() !== studentId) throw Error("The active learner is changing. Wait for the new learner to load.");
      const existing = pendingSpreadsheetSubmission(studentId, courseId, assignment.id);
      if (!existing) {
        const problems = learnerWorkbookProblems(assignment, book);
        if (problems.length) throw Error(problems.join("; "));
      }
      const candidate = existing?.submission ?? createSpreadsheetSubmission({ id: crypto.randomUUID(), submittedAt: Date.now(), courseId, lessonId: assignment.lessonId, assignment, workbook: book, ...(book.engineVersion===2?{macroRuns}: {}) });
      // Check limits/conflicts before retaining a new pending record. Never prune history.
      appendSpreadsheetSubmission(api.progress.spreadsheetSubmissions ?? {}, candidate);
      record = prepareSpreadsheetSubmission(studentId, candidate);
      if (!beginSpreadsheetSubmissionSave(studentId, record)) return;
      busyRef.current = true; setBusy(true); setError("");
      const captured = record;
      // No await may intervene between identity check and persistence invocation.
      if (activeStudent() !== studentId) throw Error("The active learner changed before saving.");
      await api.updateProgress(previous => ({ ...previous, spreadsheetSubmissions: appendSpreadsheetSubmission(previous.spreadsheetSubmissions ?? {}, captured) }));
      confirmSpreadsheetSubmissionSave(studentId, captured);
      if (alive.current) setStatus("Submission saved for instructor review. This is evidence, not an instructor decision.");
    } catch (failure) {
      if (record) failSpreadsheetSubmissionSave(studentId, record);
      if (alive.current) setError("Could not save the submission. Retry preserves its exact snapshot and ID. " + (failure instanceof Error ? failure.message : ""));
    } finally { busyRef.current = false; if (alive.current) setBusy(false); }
  }

  async function reset() {
    if (busyRef.current || submissionSaving) return;
    busyRef.current = true; setBusy(true);
    try {
      if (await confirmAction("Replace your current workbook with the assignment starter? Your saved grade is retained.", "Reset spreadsheet")) {
        if (!alive.current) return;
        if(activeStudent()!==studentId)throw Error("The active learner changed.");
        const next = structuredClone(assignment.starter);
        setBook(next); setMacroRuns([]);setPendingCell(null); setGrade(null); setError(""); setPosition({ row: 1, column: 1 }); saveDraft(next,[]);
      }
    } catch { if (alive.current) setError("Could not confirm reset. Your workbook was not changed."); }
    finally { busyRef.current = false; if (alive.current) setBusy(false); }
  }

  return <section className="panel" aria-label={assignment.title}>
    <h3>{assignment.title}</h3>
    <p className="small muted">Lesson: {assignment.lessonId}. This learner's edits save locally for this assignment version. Protected cells are read-only.</p>
    <SpreadsheetFeatureSummary book={book}/>
    {book.engineVersion===2&&<p className="small">Edit a cell, then press Enter or Apply cell edit. Escape discards the pending edit. Alt + arrow keys move between cells.</p>}
    {pendingCell&&<div role="group" aria-label="Pending cell edit"><p>Pending: {pendingCell.sheet}!{pendingCell.cell}</p><button type="button" className="btn sm" onClick={()=>change(pendingCell.cell,pendingCell.raw)}>Apply cell edit</button><button type="button" className="btn sm" onClick={()=>setPendingCell(null)}>Discard cell edit</button></div>}
    <div className="row" style={{flexWrap:"wrap"}} role="group" aria-label="Assignment worksheets">
      {Object.keys(book.sheets).map(name => <button type="button" key={name} disabled={!!pendingCell} aria-pressed={name === sheet} className={name === sheet ? "btn primary sm" : "btn sm"} onClick={() => { setSheet(name); setPosition({ row: 1, column: 1 }); }}>{name}</button>)}
    </div>
    <form className="row" style={{flexWrap:"wrap"}} onSubmit={event => { event.preventDefault(); goToCell(target); }}>
      <label htmlFor={prefix + "-jump"}>Go to cell</label>
      <input className="input" id={prefix + "-jump"} value={target} placeholder="AA12 or Budget!AA12" onChange={event => setTarget(event.target.value)} />
      <button className="btn sm" type="submit">Go</button>
    </form>
    <div className="row" style={{flexWrap:"wrap"}} role="group" aria-label="Spreadsheet viewport">
      <button className="btn sm" type="button" disabled={viewport.column === 1} onClick={() => setPosition(p => ({ ...p, column: Math.max(1, p.column - SPREADSHEET_VIEW_COLUMNS) }))}>Previous columns</button>
      <button className="btn sm" type="button" disabled={!viewport.hasNextColumns} onClick={() => setPosition(p => ({ ...p, column: p.column + SPREADSHEET_VIEW_COLUMNS }))}>Next columns</button>
      <button className="btn sm" type="button" disabled={viewport.row === 1} onClick={() => setPosition(p => ({ ...p, row: Math.max(1, p.row - SPREADSHEET_VIEW_ROWS) }))}>Previous rows</button>
      <button className="btn sm" type="button" disabled={!viewport.hasNextRows} onClick={() => setPosition(p => ({ ...p, row: p.row + SPREADSHEET_VIEW_ROWS }))}>Next rows</button>
      <span className="small">{sheet}!{viewport.columns[0]}{viewport.rows[0]}–{viewport.columns[viewport.columns.length - 1]}{viewport.rows[viewport.rows.length - 1]}</span>
    </div>
    <div style={{ overflowX: "auto", position: "relative" }} role="region" aria-label="Scrollable assignment workbook" tabIndex={0}><table className="table" style={{minWidth:820}}><caption className="sr-only">{sheet} assignment workbook</caption><thead><tr><th scope="col" style={{minWidth:40,whiteSpace:"nowrap"}}>Row</th>{viewport.columns.map(column => <th key={column} scope="col">{column}</th>)}</tr></thead><tbody>
      {viewport.rows.map(row => <tr key={row}><th scope="row" style={{whiteSpace:"nowrap"}}>{row}</th>{viewport.columns.map(column => {
        const cell = column + row, locked = protectedSet.has(sheet + "!" + cell), raw = book.sheets[sheet]?.[cell] ?? "";
        let calculated = ""; try { calculated = String(calculateCell(book, sheet, cell)); } catch { calculated = "Formula error"; }
        const inputId = prefix + "-" + cell;
        return <td key={cell} style={{position:"relative"}}><label className="sr-only" htmlFor={inputId}>{sheet}!{cell}{locked ? " (protected)" : ""}</label>
          <input id={inputId} className="input" style={{ minWidth: 85, width: 105 }} maxLength={2048} value={pendingCell?.sheet===sheet&&pendingCell.cell===cell?pendingCell.raw:String(raw)} readOnly={locked} disabled={busy || submissionSaving} aria-readonly={locked} aria-describedby={typeof raw === "string" && raw.startsWith("=") ? inputId + "-result" : undefined} onChange={event => {if(book.engineVersion===2){if(pendingCell&&pendingCell.cell!==cell){setError("Apply or discard the pending cell edit first.");return;}setPendingCell({sheet,cell,raw:event.target.value});setError("");}else change(cell,event.target.value);}} onKeyDown={event=>{if(event.key==="Enter"&&pendingCell?.cell===cell){event.preventDefault();change(cell,pendingCell.raw);}if(event.key==="Escape")setPendingCell(null);if(event.altKey&&["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(event.key)){event.preventDefault();const inputs=Array.from(event.currentTarget.closest("table")!.querySelectorAll<HTMLInputElement>("input"));const index=inputs.indexOf(event.currentTarget);const offset=event.key==="ArrowRight"?1:event.key==="ArrowLeft"?-1:event.key==="ArrowDown"?viewport.columns.length:-viewport.columns.length;inputs[index+offset]?.focus();}}} />
          {typeof raw === "string" && raw.startsWith("=") && <div id={inputId + "-result"} className="small">Result: {calculated}</div>}
        </td>;
      })}</tr>)}
    </tbody></table></div>
    <SpreadsheetMacroPanel book={book} protectedCells={assignment.protectedCells} disabled={busy||submissionSaving||!!pendingCell} runs={macroRuns} onApply={(next,trace)=>{if(activeStudent()!==studentId)throw Error("The active learner changed.");const problems=learnerWorkbookProblems(assignment,next);if(problems.length)throw Error(problems.join("; "));const runs=[...macroRuns,trace];serializeSpreadsheetDraft(assignment,next,runs);setBook(next);setMacroRuns(runs);setGrade(null);saveDraft(next,runs);}}/>
    <div className="row" style={{flexWrap:"wrap"}}>
      <button className="btn sm" type="button" disabled={busy || submissionSaving} onClick={gradePractice}>{busy ? "Please wait…" : "Grade assignment"}</button>
      <button className="btn primary sm" type="button" disabled={busy || submissionSaving || !!historyError} onClick={submitForReview}>{pendingSubmission ? "Retry submission save" : "Submit for instructor review"}</button>
      <button className="btn sm" type="button" disabled={busy || submissionSaving} onClick={() => saveDraft(book)}>Retry save</button>
      <button className="btn sm" type="button" disabled={busy || submissionSaving} onClick={reset}>Reset workbook</button>
    </div>
    {currentGrade && !busy && !gradeSaveFailed && !unconfirmedGrade && <p className="small muted">{currentGrade.workbookSnapshot === currentWorkbookSnapshot ? "Saved practice grade" : "Earlier practice grade"}: {Math.round(currentGrade.score * 100)}% · {currentGrade.revision} grading attempt(s). {currentGrade.workbookSnapshot !== currentWorkbookSnapshot && "Grade again to assess current edits."}</p>}
    {savedGrade && !currentGrade && !busy && !gradeSaveFailed && !unconfirmedGrade && <p className="small muted">An earlier grade belongs to an older or unverified assignment version and is not applied to this workbook.</p>}
    {unconfirmedGrade && !busy && !gradeSaveFailed && <p role="status">A grade submission has not been confirmed saved. Grade again to retry.</p>}
    {grade && <div role="status"><strong>{Math.round(grade.score * 100)}% correct</strong>
      {grade.feedback.map(feedback => <p className="small" key={feedback.address}><button className="btn ghost sm" type="button" onClick={() => goToCell(feedback.address)}>{feedback.address}</button>: {feedback.passed ? "Correct" : "Revise"} (calculated {String(feedback.actual)})</p>)}
    </div>}
    <section aria-label="Submission history">
      <h4>Submissions for instructor review</h4>
      <p className="small muted">Grading is practice. Submit explicitly to save immutable evidence for review. Later edits do not change an earlier submission.</p>
      {historyError && <p role="alert">{historyError}</p>}
      {!history.length && !pendingSubmission && <p>No submissions yet.</p>}
      {pendingSubmission && <SubmissionSnapshot submission={pendingSubmission.submission} current={submissionMatchesAssignment(pendingSubmission.submission, assignment)} status={pendingSubmission.saving ? "Saving — not yet confirmed" : "Not confirmed saved — retry this exact snapshot"} />}
      {history.map(item => <SubmissionSnapshot key={item.id} submission={item} current={submissionMatchesAssignment(item, assignment)} status="Saved for instructor review (not an instructor decision)" />)}
    </section>
    {error && <p role="alert">{error}</p>}
    {status && <p className="small muted" role="status">{status}</p>}
  </section>;
}

function SubmissionSnapshot({ submission, current, status }: { submission: SpreadsheetSubmission; current: boolean; status: string }) {
  return <details><summary>{new Date(submission.submittedAt).toLocaleString()} · {Math.round(submission.grade.score * 100)}% · {status}</summary>
    <p>{current ? "Current assignment snapshot" : "Historical assignment snapshot — the assignment has changed"}</p>
    <p className="small">Submission ID: {submission.id}</p>
    <p>Original lesson: {submission.lessonId}</p>
    <SpreadsheetFeatureSummary book={submission.workbook}/>
    <SpreadsheetMacroTraceList runs={submission.macroRuns??[]}/>
    <pre style={{whiteSpace:"pre-wrap",overflowWrap:"anywhere"}} aria-label="Submitted workbook snapshot">{JSON.stringify(submission.workbook, null, 2)}</pre>
    <pre style={{whiteSpace:"pre-wrap",overflowWrap:"anywhere"}} aria-label="Submitted assignment and criteria snapshot">{JSON.stringify(submission.assignment, null, 2)}</pre>
    <pre style={{whiteSpace:"pre-wrap",overflowWrap:"anywhere"}} aria-label="Submission grading evidence">{JSON.stringify(submission.grade, null, 2)}</pre>
  </details>;
}

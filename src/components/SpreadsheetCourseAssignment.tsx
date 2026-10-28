import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import type { AppApi } from "../App";
import { calculateCell, type Workbook } from "../lib/spreadsheet";
import { canonicalAssignmentAddress, gradeAssignment, validateAssignment, type SpreadsheetAssignment } from "../lib/spreadsheetAssignments";
import { activeStudent, confirmAction } from "../lib/storage";
import {
  beginSpreadsheetGrade, confirmSpreadsheetGrade, spreadsheetGradeUnconfirmed, spreadsheetGradeRegistryVersion, subscribeSpreadsheetGrades,
  learnerWorkbookProblems, restoreSpreadsheetDraft, serializeSpreadsheetDraft, spreadsheetCellPosition,
  spreadsheetDraftKey, spreadsheetSnapshot, spreadsheetViewport, SPREADSHEET_VIEW_COLUMNS, SPREADSHEET_VIEW_ROWS,
} from "../lib/spreadsheetLearnerState";

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
  const key = spreadsheetDraftKey(api.student?.id ?? null, courseId, assignment.id);
  const assignmentSnapshot = spreadsheetSnapshot(assignment);
  const [initial] = useState(() => {
    try { return restoreSpreadsheetDraft(localStorage.getItem(key), assignment); }
    catch { return { workbook: structuredClone(assignment.starter), message: "Storage unavailable. Changes can be practiced here but may not survive closing this page." }; }
  });
  const [book, setBook] = useState<Workbook>(initial.workbook);
  const [status, setStatus] = useState(initial.message);
  const [error, setError] = useState("");
  const [sheet, setSheet] = useState(Object.keys(assignment.starter.sheets)[0]);
  const [position, setPosition] = useState({ row: 1, column: 1 });
  const [target, setTarget] = useState("");
  const [grade, setGrade] = useState<ReturnType<typeof gradeAssignment> | null>(null);
  const [busy, setBusy] = useState(false);
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

  function saveDraft(next: Workbook) {
    try { localStorage.setItem(key, serializeSpreadsheetDraft(assignment, next)); setStatus("Saved locally for this learner"); }
    catch { setStatus("Could not save this draft. Your current edits remain on screen; retry saving before leaving."); }
  }

  function change(cell: string, raw: string) {
    if (busyRef.current || protectedSet.has(sheet + "!" + cell)) return;
    const value = raw && !raw.startsWith("=") && /^-?(?:\d+\.?\d*|\.\d+)$/.test(raw) ? Number(raw) : raw;
    const cells = { ...book.sheets[sheet], [cell]: value };
    if (raw === "" && !(cell in assignment.starter.sheets[sheet])) delete cells[cell];
    const next = { ...book, sheets: { ...book.sheets, [sheet]: cells } };
    const problems = learnerWorkbookProblems(assignment, next);
    if (problems.length) { setError(problems.join("; ")); return; }
    setError(""); setGrade(null); setBook(next); saveDraft(next);
  }

  function goToCell(address: string) {
    const canonical = canonicalAssignmentAddress(assignment.starter, address.includes("!") ? address : sheet + "!" + address);
    const separator = canonical?.lastIndexOf("!") ?? -1;
    const next = canonical ? spreadsheetCellPosition(canonical.slice(separator + 1)) : null;
    if (!canonical || !next) { setError("Enter an existing worksheet and cell, such as Budget!AA12, or a cell on this worksheet."); return; }
    setSheet(canonical.slice(0, separator)); setPosition(next); setTarget(""); setError("");
  }

  async function submit() {
    if (busyRef.current) return;
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
      if (alive.current) { setGradeSaveFailed(false); setGrade(result); setStatus("Grade saved for this assignment version"); }
    } catch (failure) {
      if (alive.current) { setGradeSaveFailed(true); setError("Could not save the grade. Your workbook is unchanged; retry. " + (failure instanceof Error ? failure.message : "")); }
    } finally {
      busyRef.current = false;
      if (alive.current) setBusy(false);
    }
  }

  async function reset() {
    if (busyRef.current) return;
    busyRef.current = true; setBusy(true);
    try {
      if (await confirmAction("Replace your current workbook with the assignment starter? Your saved grade is retained.", "Reset spreadsheet")) {
        if (!alive.current) return;
        const next = structuredClone(assignment.starter);
        setBook(next); setGrade(null); setError(""); setPosition({ row: 1, column: 1 }); saveDraft(next);
      }
    } catch { if (alive.current) setError("Could not confirm reset. Your workbook was not changed."); }
    finally { busyRef.current = false; if (alive.current) setBusy(false); }
  }

  return <section className="panel" aria-label={assignment.title}>
    <h3>{assignment.title}</h3>
    <p className="small muted">Lesson: {assignment.lessonId}. This learner's edits save locally for this assignment version. Protected cells are read-only.</p>
    <div className="row" role="group" aria-label="Assignment worksheets">
      {Object.keys(book.sheets).map(name => <button type="button" key={name} aria-pressed={name === sheet} className={name === sheet ? "btn primary sm" : "btn sm"} onClick={() => { setSheet(name); setPosition({ row: 1, column: 1 }); }}>{name}</button>)}
    </div>
    <form className="row" onSubmit={event => { event.preventDefault(); goToCell(target); }}>
      <label htmlFor={prefix + "-jump"}>Go to cell</label>
      <input className="input" id={prefix + "-jump"} value={target} placeholder="AA12 or Budget!AA12" onChange={event => setTarget(event.target.value)} />
      <button className="btn sm" type="submit">Go</button>
    </form>
    <div className="row" role="group" aria-label="Spreadsheet viewport">
      <button className="btn sm" type="button" disabled={viewport.column === 1} onClick={() => setPosition(p => ({ ...p, column: Math.max(1, p.column - SPREADSHEET_VIEW_COLUMNS) }))}>Previous columns</button>
      <button className="btn sm" type="button" disabled={!viewport.hasNextColumns} onClick={() => setPosition(p => ({ ...p, column: p.column + SPREADSHEET_VIEW_COLUMNS }))}>Next columns</button>
      <button className="btn sm" type="button" disabled={viewport.row === 1} onClick={() => setPosition(p => ({ ...p, row: Math.max(1, p.row - SPREADSHEET_VIEW_ROWS) }))}>Previous rows</button>
      <button className="btn sm" type="button" disabled={!viewport.hasNextRows} onClick={() => setPosition(p => ({ ...p, row: p.row + SPREADSHEET_VIEW_ROWS }))}>Next rows</button>
      <span className="small">{sheet}!{viewport.columns[0]}{viewport.rows[0]}–{viewport.columns[viewport.columns.length - 1]}{viewport.rows[viewport.rows.length - 1]}</span>
    </div>
    <div style={{ overflowX: "auto" }}><table className="table"><caption className="sr-only">{sheet} assignment workbook</caption><thead><tr><th scope="col">Row</th>{viewport.columns.map(column => <th key={column} scope="col">{column}</th>)}</tr></thead><tbody>
      {viewport.rows.map(row => <tr key={row}><th scope="row">{row}</th>{viewport.columns.map(column => {
        const cell = column + row, locked = protectedSet.has(sheet + "!" + cell), raw = book.sheets[sheet]?.[cell] ?? "";
        let calculated = ""; try { calculated = String(calculateCell(book, sheet, cell)); } catch { calculated = "Formula error"; }
        const inputId = prefix + "-" + cell;
        return <td key={cell}><label className="sr-only" htmlFor={inputId}>{sheet}!{cell}{locked ? " (protected)" : ""}</label>
          <input id={inputId} className="input" style={{ minWidth: 85, width: 105 }} maxLength={2048} value={String(raw)} readOnly={locked} disabled={busy} aria-readonly={locked} aria-describedby={typeof raw === "string" && raw.startsWith("=") ? inputId + "-result" : undefined} onChange={event => change(cell, event.target.value)} />
          {typeof raw === "string" && raw.startsWith("=") && <div id={inputId + "-result"} className="small">Result: {calculated}</div>}
        </td>;
      })}</tr>)}
    </tbody></table></div>
    <div className="row">
      <button className="btn sm" type="button" disabled={busy} onClick={submit}>{busy ? "Please wait…" : "Grade assignment"}</button>
      <button className="btn sm" type="button" disabled={busy} onClick={() => saveDraft(book)}>Retry save</button>
      <button className="btn sm" type="button" disabled={busy} onClick={reset}>Reset workbook</button>
    </div>
    {currentGrade && !busy && !gradeSaveFailed && !unconfirmedGrade && <p className="small muted">{currentGrade.workbookSnapshot === currentWorkbookSnapshot ? "Saved grade" : "Earlier saved submission"}: {Math.round(currentGrade.score * 100)}% · {currentGrade.revision} grading attempt(s). {currentGrade.workbookSnapshot !== currentWorkbookSnapshot && "Grade again to assess current edits."}</p>}
    {savedGrade && !currentGrade && !busy && !gradeSaveFailed && !unconfirmedGrade && <p className="small muted">An earlier grade belongs to an older or unverified assignment version and is not applied to this workbook.</p>}
    {unconfirmedGrade && !busy && !gradeSaveFailed && <p role="status">A grade submission has not been confirmed saved. Grade again to retry.</p>}
    {grade && <div role="status"><strong>{Math.round(grade.score * 100)}% correct</strong>
      {grade.feedback.map(feedback => <p className="small" key={feedback.address}><button className="btn ghost sm" type="button" onClick={() => goToCell(feedback.address)}>{feedback.address}</button>: {feedback.passed ? "Correct" : "Revise"} (calculated {String(feedback.actual)})</p>)}
    </div>}
    {error && <p role="alert">{error}</p>}
    {status && <p className="small muted" role="status">{status}</p>}
  </section>;
}

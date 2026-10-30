import { useEffect, useRef, useState, type ReactNode } from "react";
import type { AssessedWorkSubmission } from "../lib/assessedWorkEvidence";
import type { Lab, WritingTask, ActivityLogSpec, WorkRecord, LogEntry } from "../lib/work";
import { assessedReviewScore, type SubmissionAssessment } from "../lib/submissionHistory";
import type { Workbook } from "../lib/spreadsheet";
import { calculateCellV1 } from "../lib/spreadsheetGradingV1";
import type { SpreadsheetSubmission } from "../lib/spreadsheetEvidence";
import { missingHandInAttachments } from "../lib/classroom";
import type { Family } from "../lib/family";
import type { StoredSubmissionRecord } from "../lib/classroomSubmissionStore";
import * as ledger from "../lib/classroomSubmissionStore";
import { pickJsonFile } from "../lib/storage";

type Services = Pick<typeof ledger, "loadClassroomSubmissions" | "importClassroomSubmission" | "saveClassroomSubmissionReview"> & { pickJsonFile: typeof pickJsonFile };
const defaults: Services = { ...ledger, pickJsonFile };
const statusLabel = (status: string) => status === "needs_revision" ? "Needs revision" : status === "reviewed" ? "Reviewed" : "Pending";
const savedTime = (value: number) => Number.isFinite(new Date(value).getTime()) ? new Date(value).toISOString() : `Unrepresentable timestamp: ${value}`;
const when = (value: string) => new Date(value).toLocaleString();

/** Instructor-only host: all evidence here comes from signed immutable receipts, not merged progress. */
export default function ClassroomSubmissionReview({ family, services = defaults, onChanged }: { family: Family; services?: Services; onChanged?: () => Promise<unknown> }) {
  const [records, setRecords] = useState<StoredSubmissionRecord[]>([]);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [classId, setClassId] = useState("");
  const [studentId, setStudentId] = useState("");
  const [selected, setSelected] = useState("");
  const operation = useRef(false);
  const generation = useRef(0);
  useEffect(() => {
    const current = ++generation.current;
    setReady(false); setError("");
    services.loadClassroomSubmissions().then(data => {
      if (current === generation.current) { setRecords(data); setReady(true); }
    }, e => { if (current === generation.current) setError((e as Error).message); });
    return () => { generation.current++; };
  }, [services, family]);
  const run = async (action: () => Promise<void>) => {
    if (operation.current) return;
    operation.current = true; setBusy(true); setError(""); setMessage("");
    try { await action(); } catch (e) { setError((e as Error).message); }
    finally { operation.current = false; setBusy(false); }
  };
  const refreshHost = async () => {
    try { await onChanged?.(); } catch (e) { setError(`Receipt saved, but refreshing other views failed: ${(e as Error).message}. Reload those views.`); }
  };
  const importReceipt = async (raw: unknown) => {
    try {
      const result = await services.importClassroomSubmission(raw, family);
      setRecords(old => [result.record, ...old.filter(r => r.id !== result.record.id)]);
      setClassId(result.record.classId); setStudentId(result.record.studentId); setSelected(result.record.id);
      setMessage(result.inserted ? "Hand-in saved to submission history." : "This hand-in is already saved; no duplicate was created.");
      await refreshHost();
    } catch (e) {
      // Receipt persistence can succeed before file/progress projection fails. Expose
      // that durable receipt and let the instructor retry the exact saved snapshot.
      try { setRecords(await services.loadClassroomSubmissions()); setReady(true); }
      catch { setReady(false); }
      throw e;
    }
  };
  const eligible = records.filter(r => family.students.some(s => s.id === r.studentId) && family.classes?.some(c => c.id === r.classId && c.students.includes(r.studentId)));
  const visible = eligible.filter(r => (!classId || r.classId === classId) && (!studentId || r.studentId === studentId));
  const archived = records.filter(r => family.students.some(s => s.id === r.studentId) && !eligible.some(current => current.id === r.id));
  const chosen = visible.find(r => r.id === selected) ?? archived.find(r => r.id === selected);
  const canReview = !!chosen && eligible.some(r => r.id === chosen.id);
  return <>
    <section className="panel">
      <h2>Import hand-ins</h2>
      <p>Import students’ signed hand-in files. Each distinct submission keeps its own immutable evidence and review history; importing the same file again does not duplicate it.</p>
      <p className="muted small">The class file’s shared secret detects damage and mix-ups, not a determined student. Instructor review remains necessary.</p>
      <button className="btn primary" disabled={busy || !ready} onClick={() => run(async () => {
        const text = await services.pickJsonFile(); if (text === null) return;
        await importReceipt(JSON.parse(text));
      })}>Import a hand-in file…</button>
      <button className="btn" disabled={busy} onClick={() => run(async () => {
        setReady(false);
        const data = await services.loadClassroomSubmissions(); setRecords(data); setReady(true); setMessage("Submission history reloaded.");
      })}>Reload submission history</button>
      {busy && <p role="status">Saving or loading…</p>}
      {error && <p role="alert">{error} The operation did not finish. Check the receipt status below and retry; an incomplete import may already have durable evidence.</p>}
      {message && <p role="status">{message}</p>}
    </section>
    <section className="panel">
      <h2>Submission history</h2>
      <label className="field">Class<select value={classId} onChange={e => { setClassId(e.target.value); setStudentId(""); setSelected(""); }}><option value="">All classes</option>{family.classes?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
      <label className="field">Student<select value={studentId} onChange={e => { setStudentId(e.target.value); setSelected(""); }}><option value="">All rostered students</option>{family.students.filter(s => !classId || family.classes?.find(c => c.id === classId)?.students.includes(s.id)).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></label>
      {!ready ? <p>Submission history is not loaded. Use Reload to retry.</p> : !visible.length ? <p>No saved submissions for this roster selection.</p> : <table className="table"><thead><tr><th>Student / class</th><th>Submitted</th><th>Received</th><th>Import / review status</th><th>Evidence</th></tr></thead><tbody>{visible.map(r => <tr key={r.id}>
        <td>{r.studentName} / {family.classes?.find(c => c.id === r.classId)?.name}</td><td>{when(r.submittedAt)}</td><td>{when(r.receivedAt)}</td><td>{r.importComplete ? statusLabel(r.status) : "Received, import incomplete"}</td><td><button className="btn sm" disabled={busy} onClick={() => setSelected(r.id)}>Inspect submission<span className="sr-only"> from {r.studentName} at {r.submittedAt}</span></button></td>
      </tr>)}</tbody></table>}
    </section>
    {ready && archived.length > 0 && <section className="panel" aria-label="Archived receipts">
      <h2>Archived receipts</h2>
      <p>Read-only evidence for existing student profiles whose class or roster membership was removed. These receipts cannot receive new reviews or retry imports.</p>
      <ul>{archived.map(r => <li key={r.id}>{r.studentName} · {r.snapshot.className} · {when(r.submittedAt)} · {statusLabel(r.status)}
        <button className="btn sm" disabled={busy} onClick={() => setSelected(r.id)}>Inspect archived receipt<span className="sr-only"> from {r.studentName} at {r.submittedAt}</span></button>
      </li>)}</ul>
    </section>}
    {ready && chosen && <Receipt key={chosen.id} record={chosen} busy={busy} canReview={canReview} retryImport={() => run(() => importReceipt(chosen.snapshot))} save={(event) => run(async () => {
      const next = await services.saveClassroomSubmissionReview(event, family);
      setRecords(next); setMessage("Instructor review saved.");
    })} />}
  </>;
}

function Evidence({ title, value }: { title: string; value: unknown }) {
  return <section><h4>{title}</h4><pre style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{JSON.stringify(value ?? {}, null, 2)}</pre></section>;
}
function Receipt({ record, busy, save, retryImport, canReview }: { record: StoredSubmissionRecord; busy: boolean; canReview: boolean; retryImport: () => Promise<void>; save: (event: Parameters<Services["saveClassroomSubmissionReview"]>[0]) => Promise<void> }) {
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<"reviewed" | "needs_revision">("reviewed");
  const retry = useRef<Parameters<Services["saveClassroomSubmissionReview"]>[0] | null>(null);
  const snapshot = record.snapshot;
  const missing = missingHandInAttachments(snapshot);
  const reviewDisabled = busy || !record.importComplete || !canReview || missing.length > 0;
  return <section className="panel" aria-label="Immutable submission evidence">
    <h2>Submission from {snapshot.studentName}</h2>
    {!canReview && <p role="status">Archived receipt — read-only. Current class roster membership is required to add a review or retry an import.</p>}
    {missing.length > 0 && <p role="alert">Incomplete attachment evidence: {missing.join(", ")}. This signed receipt does not contain the referenced files. Neither Reviewed nor Needs revision can be saved. Ask the student for a new complete hand-in; the existing receipt cannot be changed.</p>}
    <p>Signed class: {snapshot.className} ({snapshot.classId}) · Student ID: {snapshot.studentId}</p>
    <p>Submitted: {snapshot.created} · Received: {record.receivedAt}</p>
    <p>This is the exact saved hand-in, not the student’s current or merged progress. Later imports do not change this evidence.</p>
    <p>Courses: {snapshot.courses.join(", ")}</p>
    <Evidence title="Quiz and exam attempts" value={snapshot.progress.attempts} />
    <AssessedWorkInspection record={record} disabled={reviewDisabled} save={save} />
    <LegacyWorkInspection work={snapshot.progress.work} logs={snapshot.progress.logs} />
    <SpreadsheetEvidence submissions={Object.values(snapshot.progress.spreadsheetSubmissions ?? {})} />
    <details><summary>All submitted progress (exact JSON)</summary><Evidence title="Submitted progress" value={snapshot.progress} /></details>

    <h3>Attached files from this receipt</h3>
    {Object.entries(snapshot.files ?? {}).map(([id, file]) => <div key={id}>
      <p>{id} · {file.mime}</p>
      {/^(image\/(png|jpeg|gif|webp))$/.test(file.mime) && /^[A-Za-z0-9+/]*={0,2}$/.test(file.data) && <img src={`data:${file.mime};base64,${file.data}`} alt={`Submitted attachment ${id}`} style={{ maxWidth: "100%", maxHeight: 480 }} />}
      <a href={`data:application/octet-stream;base64,${file.data}`} download={`${id}.bin`}>Download original attachment {id}</a>
    </div>)}
    <details><summary>Exact signed receipt JSON (including attachment payloads)</summary><Evidence title="Signed receipt" value={snapshot} /></details>
    <h3>Review history</h3>
    {!record.reviewEvents.length ? <p>No instructor reviews yet.</p> : <ol>{record.reviewEvents.map(event => <li key={event.id}><strong>{statusLabel(event.status)}</strong> · {event.assessment ? `Assessed work ${event.assessment.workSubmissionId}` : "Receipt-wide decision"} · {event.reviewedAt}<p style={{ whiteSpace: "pre-wrap" }}>{event.note || "No note."}</p></li>)}</ol>}
    {!record.importComplete && <div role="status"><p>Received, import incomplete. The signed receipt is saved, but its files or progress still need importing. Review is disabled until completion.</p><button className="btn" disabled={busy || !canReview} onClick={retryImport}>Retry saved import</button></div>}
    <h3>Add receipt-wide instructor review</h3>
    <p>This separate receipt decision is not a rubric assessment of every item and does not create an academic grade or activity credit.</p>
    <label className="field">Decision<select disabled={reviewDisabled} value={status} onChange={e => setStatus(e.target.value as typeof status)}><option value="reviewed">Reviewed</option><option value="needs_revision">Needs revision</option></select></label>
    <label className="field">Review note<textarea disabled={reviewDisabled} maxLength={2000} value={note} onChange={e => setNote(e.target.value)} /></label>
    <p className="muted small">Each saved decision is appended. Prior decisions and submitted work are never overwritten.</p>
    <button className="btn primary" disabled={reviewDisabled} onClick={() => {
      if (reviewDisabled) return;
      if (!retry.current || retry.current.status !== status || retry.current.note !== note || record.reviewEvents.some(e => e.id === retry.current!.eventId))
        retry.current = { submissionId: record.id, eventId: crypto.randomUUID(), status, reviewedAt: new Date().toISOString(), note };
      void save(retry.current);
    }}>Save instructor review</button>
  </section>;
}


/** Page rows before calculating cells: even very large sparse sheets have a bounded DOM. */
function PagedRows<T>({ title, rows, headers, render }: { title: string; rows: T[]; headers: string[]; render: (row: T) => ReactNode }) {
  const [page, setPage] = useState(0);
  const totalPages = Math.max(1, Math.ceil(rows.length / 50));
  const current = Math.min(page, totalPages - 1);
  return <section aria-label={title}>
    <h4>{title}</h4>
    <p>{rows.length} entries · Page {current + 1} of {totalPages} · Up to 50 entries per page</p>
    <table className="table"><thead><tr>{headers.map(h => <th key={h} scope="col">{h}</th>)}</tr></thead>
      <tbody>{rows.slice(current * 50, (current + 1) * 50).map((row, index) => <tr key={current * 50 + index}>{render(row)}</tr>)}</tbody>
    </table>
    {!rows.length && <p>No entries.</p>}
    <button className="btn sm" disabled={current === 0} onClick={() => setPage(current - 1)}>Previous {title} page</button>
    <button className="btn sm" disabled={current + 1 === totalPages} onClick={() => setPage(current + 1)}>Next {title} page</button>
  </section>;
}
function WorkbookInspection({ title, workbook }: { title: string; workbook: Workbook }) {
  const cells = Object.entries(workbook.sheets).flatMap(([sheet, entries]) => Object.entries(entries).map(([address, raw]) => ({ sheet, address, raw })));
  return <div><p>{title} worksheets: {Object.entries(workbook.sheets).map(([name, cells]) => `${name} (${Object.keys(cells).length} cells)`).join(", ")}</p>
    <PagedRows title={title} rows={cells} headers={["Cell", "Raw value / formula", "Calculated from saved workbook"]} render={({ sheet, address, raw }) => {
      let result: ReactNode;
      try { result = String(calculateCellV1(workbook, sheet, address)); }
      catch (error) { result = <span className="notice error">Formula error: {(error as Error).message}</span>; }
      return <><th scope="row">{sheet}!{address}</th><td><code>{String(raw)}</code></td><td>{result}</td></>;
    }} />
  </div>;
}
function SpreadsheetEvidence({ submissions }: { submissions: SpreadsheetSubmission[] }) {
  const [selection, setSelection] = useState("");
  const submission = submissions.find(s => s.id === selection) ?? submissions[0];
  if (!submission) return <section><h3>Spreadsheet submissions</h3><p>No spreadsheet submission evidence in this receipt.</p></section>;
  const assignment = submission.assignment;
  return <section aria-label="Spreadsheet submission inspection">
    <h3>Spreadsheet submissions ({submissions.length})</h3>
    <label className="field">Inspect spreadsheet submission<select value={submission.id} onChange={e => setSelection(e.target.value)}>{submissions.map(s => <option key={s.id} value={s.id}>{s.assignment.title} · {savedTime(s.submittedAt)} · {s.id}</option>)}</select></label>
    <article key={submission.id}>
      <h4>{assignment.title}</h4>
      <p>Assignment: {submission.assignmentId} · Course: {submission.courseId} · Lesson: {submission.lessonId}</p>
      <p>Submission: {submission.id} · Submitted: {savedTime(submission.submittedAt)}</p>
      <p><strong>Automatic evidence score: {Math.round(submission.grade.score * 10000) / 100}% — not an academic grade.</strong> This is the saved automatic result for this submitted workbook, not a new grade against the current course.</p>
      <p>Numeric tolerance: {assignment.tolerance ?? 0}</p>
      <p>Protected-cell changes detected: {submission.grade.protectedChanges.length ? submission.grade.protectedChanges.join(", ") : "None"}</p>
      <WorkbookInspection title="Original starter cells" workbook={assignment.starter} />
      <PagedRows title="Original protected cells" rows={assignment.protectedCells} headers={["Protected cell"]} render={address => <td>{address}</td>} />
      <PagedRows title="Original grading criteria" rows={Object.entries(assignment.answers)} headers={["Cell", "Expected value"]} render={([address, value]) => <><th scope="row">{address}</th><td>{String(value)}</td></>} />
      <WorkbookInspection title="Submitted cells" workbook={submission.workbook} />
      <PagedRows title="Saved automatic feedback" rows={submission.grade.feedback} headers={["Cell", "Expected", "Actual", "Result"]} render={f => <><th scope="row">{f.address}</th><td>{String(f.expected)}</td><td>{f.actual === null ? "Calculation failed" : String(f.actual)}</td><td>{f.passed ? "Passed" : "Not passed"}</td></>} />
    </article>
  </section>;
}

function LegacyWorkInspection({ work, logs }: { work?: Record<string, WorkRecord>; logs?: LogEntry[] }) {
  const [selected, setSelected] = useState("");
  const entries = Object.entries(work ?? {});
  const current = entries.find(([id]) => id === selected) ?? entries[0];
  if (!entries.length && !logs?.length) return null;
  return <section aria-label="Legacy or current work payloads"><h3>Writing, lab work, and submitted drafts</h3>
    <p>These ordinary progress payloads do not carry a verifiable original task or rubric. Original requirements are unknown; no rubric is inferred from the current course. Exact assessed submissions, when available, are shown separately above.</p>
    {!!entries.length && <label className="field">Inspect legacy work<select value={current?.[0] ?? ""} onChange={e => setSelected(e.target.value)}>{entries.map(([id]) => <option key={id} value={id}>{id}</option>)}</select></label>}
    {(current ? [current] : []).map(([key, response]) => <article key={key}><h4>{key}</h4>
      <p>Submitted: {response.submitted ?? "Draft — no submission timestamp"}</p>
      {response.text !== undefined && <p style={{ whiteSpace: "pre-wrap" }}>{response.text}</p>}
      {Object.entries(response.answers ?? {}).map(([id, answer]) => <p key={id}><strong>Answer {id} (original question unknown): </strong>{answer}</p>)}
      <LegacyTables tables={response.tables ?? {}} />
      <details><summary>Exact legacy work fields</summary><Evidence title={key} value={response} /></details>
    </article>)}
    {!!logs?.length && <PagedRows title="Activity logs (original task unknown)" rows={logs} headers={["Date", "Activity", "Minutes", "Note"]} render={entry => <><td>{entry.date}</td><td>{entry.type}</td><td>{entry.minutes}</td><td>{entry.note}</td></>} />}
  </section>;
}
function AssessedWorkInspection({ record, disabled, save }: { record: StoredSubmissionRecord; disabled: boolean; save: (event: ledger.ClassroomReviewInput) => Promise<void> }) {
  const entries = Object.values(record.snapshot.progress.assessedWorkSubmissions ?? {});
  const [selected, setSelected] = useState("");
  const entry = entries.find(e => e.id === selected) ?? entries[0];
  if (!entry) return <section><h3>Assessed writing, lab and activity submissions</h3><p>No original-task assessed submissions in this receipt. Legacy work is not silently promoted to verified task evidence.</p></section>;
  return <section aria-label="Assessed work inspection"><h3>Assessed writing, lab and activity submissions ({entries.length})</h3>
    <label className="field">Inspect assessed work<select value={entry.id} onChange={e => setSelected(e.target.value)}>{entries.map(e => <option key={e.id} value={e.id}>{e.task.title} · {savedTime(e.submittedAt)} · {e.id}</option>)}</select></label>
    <AssessedWorkItem key={entry.id} entry={entry} record={record} disabled={disabled} save={save} />
  </section>;
}
function AssessedWorkItem({ entry, record, disabled, save }: { entry: AssessedWorkSubmission; record: StoredSubmissionRecord; disabled: boolean; save: (event: ledger.ClassroomReviewInput) => Promise<void> }) {
  const [levels, setLevels] = useState<Record<string, number>>({});
  const [criterionNotes, setCriterionNotes] = useState<Record<string, string>>({});
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<"reviewed" | "needs_revision">("reviewed");
  const retry = useRef<ledger.ClassroomReviewInput | null>(null);
  const events = record.reviewEvents.filter(e => e.assessment?.workSubmissionId === entry.id);
  const criteria = entry.rubric?.criteria ?? [];
  const complete = criteria.every(c => Object.prototype.hasOwnProperty.call(levels, c.id));
  const assessment: SubmissionAssessment = { version: 1, workSubmissionId: entry.id, levels, criterionNotes };
  const score = assessedReviewScore(entry, assessment);
  return <article aria-label={`Original assessed submission ${entry.id}`}>
    <h4>{entry.task.title}</h4><p>Kind: {entry.kind} · Course: {entry.courseId} · Assignment: {entry.assignmentId}</p>
    <p>Evidence ID: {entry.id} · Submitted: {savedTime(entry.submittedAt)} · Receipt: {record.id}</p>
    <p>The following task, rubric, response and files are the exact saved snapshot. Changes to the installed course do not alter this evidence.</p>
    <AssessedTaskResponse entry={entry} />
    <h4>Original rubric</h4>
    {!criteria.length ? <p>No original rubric was supplied. Review may include a decision and feedback, but no rubric score can be invented.</p> : criteria.map(c => <section key={c.id}>
      <h5>{c.name} ({c.id})</h5>{c.description && <p>{c.description}</p>}
      <ul>{c.levels.map((level, i) => <li key={i}>{level.points} points — {level.label}{level.description && `: ${level.description}`}</li>)}</ul>
    </section>)}
    <h4>Files inside this assessed submission</h4>
    {!Object.keys(entry.files).length && <p>No attached files.</p>}
    {Object.entries(entry.files).map(([id, file]) => <p key={id}>{id} · {file.mime} <a href={`data:application/octet-stream;base64,${file.data}`} download={`${id}.bin`}>Download assessed attachment {id}</a></p>)}
    <details><summary>Exact assessed submission JSON</summary><Evidence title="Original assessed evidence" value={entry} /></details>
    <h4>Decisions for this exact assessed submission</h4>
    {!events.length ? <p>Not assessed yet.</p> : <ol>{events.map(event => {
      const savedScore = assessedReviewScore(entry, event.assessment!);
      return <li key={event.id}><strong>{statusLabel(event.status)}</strong> · {event.reviewedAt}
        <p>{event.note || "No overall feedback."}</p>
        {savedScore && <p>Original-rubric result: {savedScore.points} / {savedScore.outOf} ({Math.round(savedScore.percent * 100) / 100}%) — not an academic grade.</p>}
        <ul>{criteria.map(c => <li key={c.id}>{c.name}: {Object.prototype.hasOwnProperty.call(event.assessment!.levels, c.id) ? `${event.assessment!.levels[c.id]} points` : "Not assessed"}{event.assessment!.criterionNotes?.[c.id] && <p>{event.assessment!.criterionNotes[c.id]}</p>}</li>)}</ul>
      </li>;
    })}</ol>}
    <fieldset disabled={disabled} className="plain-fieldset"><legend>Add assessment for this saved item</legend>
      <label className="field">Assessed-work decision<select value={status} onChange={e => setStatus(e.target.value as typeof status)}><option value="reviewed">Reviewed</option><option value="needs_revision">Needs revision</option></select></label>
      {criteria.map(c => <div key={c.id}>
        <label className="field">Level for {c.name}<select value={Object.prototype.hasOwnProperty.call(levels, c.id) ? String(levels[c.id]) : ""} onChange={e => setLevels(old => { const next = { ...old }; if (e.target.value === "") delete next[c.id]; else next[c.id] = Number(e.target.value); return next; })}>
          <option value="">Not assessed</option>{c.levels.map((l, i) => <option key={i} value={l.points}>{l.label} — {l.points} points</option>)}
        </select></label>
        <label className="field">Feedback for {c.name}<textarea maxLength={2000} value={criterionNotes[c.id] ?? ""} onChange={e => setCriterionNotes(old => ({ ...old, [c.id]: e.target.value }))} /></label>
      </div>)}
      <label className="field">Assessed-work feedback<textarea maxLength={2000} value={note} onChange={e => setNote(e.target.value)} /></label>
      {score && <p>Preview: {score.points} / {score.outOf} ({Math.round(score.percent * 100) / 100}%). No academic grade or activity credit will be written.</p>}
      {status === "reviewed" && !complete && <p>Select a level for every original rubric criterion before marking this item reviewed.</p>}
      <button className="btn primary" disabled={disabled || status === "reviewed" && !complete} onClick={() => {
        if (disabled || status === "reviewed" && !complete) return;
        if (!retry.current || retry.current.status !== status || retry.current.note !== note || JSON.stringify(retry.current.assessment) !== JSON.stringify(assessment) || events.some(e => e.id === retry.current!.eventId))
          retry.current = { submissionId: record.id, eventId: crypto.randomUUID(), status, reviewedAt: new Date().toISOString(), note, assessment: structuredClone(assessment) };
        void save(retry.current);
      }}>Save assessed-work decision</button>
    </fieldset>
  </article>;
}
function AssessedTaskResponse({ entry }: { entry: AssessedWorkSubmission }) {
  if (entry.kind === "writing") {
    const task = entry.task as WritingTask, response = entry.response as WorkRecord;
    return <section><h4>Original writing prompt</h4><p style={{ whiteSpace: "pre-wrap" }}>{task.prompt}</p>
      <p>Format: {task.kind}{task.words && ` · Target words: ${task.words.min ?? "unspecified"}–${task.words.max ?? "unspecified"}`}</p>
      <h4>Submitted writing</h4><p style={{ whiteSpace: "pre-wrap" }}>{response.text || "No text supplied."}</p>
      <p>Self-check (learner claim, not instructor scoring): {JSON.stringify(response.self ?? {})}</p>
    </section>;
  }
  if (entry.kind === "lab") {
    const task = entry.task as Lab, response = entry.response as WorkRecord;
    return <section><h4>Original lab instructions</h4>{task.intro && <p style={{ whiteSpace: "pre-wrap" }}>{task.intro}</p>}
      <p>Adult supervision required: {task.adult ? "Yes" : "No"}</p><h5>Safety</h5><ul>{task.safety.map((line, i) => <li key={i}>{line}</li>)}</ul>
      <h5>Materials and learner checklist</h5><ul>{task.materials.map((line, i) => <li key={i}>{response.have?.includes(i) ? "Marked ready" : "Not marked ready"}: {line}</li>)}</ul>
      <h5>Steps and learner checklist</h5><ol>{task.steps.map((step, i) => <li key={i}>{step.text}{step.adult && " (adult)"} — {response.done?.includes(i) ? "Marked done" : "Not marked done"}</li>)}</ol>
      <LabResponseTables task={task} response={response} />
      <h5>Original questions and submitted answers</h5>{task.questions.map(q => <div key={q.id}><p><strong>{q.prompt}</strong> ({q.kind})</p><p style={{ whiteSpace: "pre-wrap" }}>{response.answers?.[q.id] || "No answer supplied."}</p></div>)}
      {task.photos && <p>Original photo request: {task.photos}</p>}
    </section>;
  }
  const task = entry.task as ActivityLogSpec, response = entry.response as LogEntry[];
  return <section><h4>Original activity specification</h4><p style={{ whiteSpace: "pre-wrap" }}>{task.prompt ?? "No original activity prompt supplied."}</p>
    <p>Activity choices: {task.types.join(", ")} · Weekly target: {task.weeklyMinutes ?? "unspecified"} minutes, {task.weeklyDays ?? "unspecified"} days</p>
    <PagedRows title="Submitted activity entries" rows={response} headers={["Date", "Activity", "Minutes", "Learner note"]} render={log => <><td>{log.date}</td><td>{log.type}</td><td>{log.minutes}</td><td>{log.note}</td></>} />
    <p>These entries are evidence only. This review does not add attendance minutes or duplicate credit.</p>
  </section>;
}

/** Select one table before paginating rows: many original tables never multiply the DOM. */
function LabResponseTables({ task, response }: { task: Lab; response: WorkRecord }) {
  const [selection, setSelection] = useState("");
  const table = task.tables.find(t => t.id === selection) ?? task.tables[0];
  if (!table) return <p>No original lab tables.</p>;
  return <section><label className="field">Inspect original lab table<select value={table.id} onChange={e => setSelection(e.target.value)}>{task.tables.map(t => <option key={t.id} value={t.id}>{t.title ?? t.id}</option>)}</select></label>
    <PagedRows key={table.id} title={table.title ?? table.id} rows={response.tables?.[table.id] ?? []} headers={table.columns} render={row => <>{row.map((cell, i) => <td key={i}>{cell}</td>)}</>} />
  </section>;
}
function LegacyTables({ tables }: { tables: Record<string, string[][]> }) {
  const [selection, setSelection] = useState("");
  const ids = Object.keys(tables), id = ids.includes(selection) ? selection : ids[0];
  if (!id) return null;
  return <section><label className="field">Inspect legacy table<select value={id} onChange={e => setSelection(e.target.value)}>{ids.map(key => <option key={key}>{key}</option>)}</select></label>
    <PagedRows key={id} title={`Legacy table ${id} (original columns unknown)`} rows={tables[id]} headers={["Submitted cells"]} render={row => <td>{row.join(" | ")}</td>} />
  </section>;
}

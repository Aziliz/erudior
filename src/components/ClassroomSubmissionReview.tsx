import { useEffect, useRef, useState } from "react";
import { missingHandInAttachments } from "../lib/classroom";
import type { Family } from "../lib/family";
import type { StoredSubmissionRecord } from "../lib/classroomSubmissionStore";
import * as ledger from "../lib/classroomSubmissionStore";
import { pickJsonFile } from "../lib/storage";

type Services = Pick<typeof ledger, "loadClassroomSubmissions" | "importClassroomSubmission" | "saveClassroomSubmissionReview"> & { pickJsonFile: typeof pickJsonFile };
const defaults: Services = { ...ledger, pickJsonFile };
const statusLabel = (status: string) => status === "needs_revision" ? "Needs revision" : status === "reviewed" ? "Reviewed" : "Pending";
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
    <Evidence title="Writing, lab work, and submitted drafts" value={snapshot.progress.work} />
    <Evidence title="Spreadsheet evidence (when present) and all submitted progress" value={snapshot.progress} />
    <Evidence title="Activity logs" value={snapshot.progress.logs} />
    <h3>Attached files from this receipt</h3>
    {Object.entries(snapshot.files ?? {}).map(([id, file]) => <div key={id}>
      <p>{id} · {file.mime}</p>
      {/^(image\/(png|jpeg|gif|webp))$/.test(file.mime) && /^[A-Za-z0-9+/]*={0,2}$/.test(file.data) && <img src={`data:${file.mime};base64,${file.data}`} alt={`Submitted attachment ${id}`} style={{ maxWidth: "100%", maxHeight: 480 }} />}
      <a href={`data:application/octet-stream;base64,${file.data}`} download={`${id}.bin`}>Download original attachment {id}</a>
    </div>)}
    <details><summary>Exact signed receipt JSON (including attachment payloads)</summary><Evidence title="Signed receipt" value={snapshot} /></details>
    <h3>Review history</h3>
    {!record.reviewEvents.length ? <p>No instructor reviews yet.</p> : <ol>{record.reviewEvents.map(event => <li key={event.id}><strong>{statusLabel(event.status)}</strong> · {event.reviewedAt}<p style={{ whiteSpace: "pre-wrap" }}>{event.note || "No note."}</p></li>)}</ol>}
    {!record.importComplete && <div role="status"><p>Received, import incomplete. The signed receipt is saved, but its files or progress still need importing. Review is disabled until completion.</p><button className="btn" disabled={busy || !canReview} onClick={retryImport}>Retry saved import</button></div>}
    <h3>Add instructor review</h3>
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

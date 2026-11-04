import { useEffect, useRef, useState } from "react";
import type { AppApi } from "../App";
import type { Family } from "../lib/family";
import { RecordsStatus, StudentPicker, useStudentData } from "../pages/ParentRecords";
import { coursesInYear, recordYears, type StudentData } from "../lib/reports";
import { ACADEMIC_NOTICE, MAX_ACADEMIC_BYTES, applyAcademicImport, applyAcademicRetention, auditAcademicRecords, exportAcademicRecords, parseAcademicRecords, parseGraduationPolicy, previewAcademicImport, previewAcademicRetention, removeCreditClaim, saveCreditClaim, type AcademicCandidate, type AcademicImportPreview, type AcademicRecords, type AcademicRetentionPreview, type CreditClaim } from "../lib/academicRecords";
import { exportText } from "../lib/storage";
import { uid } from "../lib/util";
import { registerNavigationGuard } from "../lib/navigationGuard";
import { today } from "../lib/srs";

export function academicCandidates(data: StudentData): AcademicCandidate[] {
  const courses = recordYears(data).flatMap(year => coursesInYear(data, year));
  return [
    ...courses.map(c => ({ key: `course:${c.courseId}`, title: c.title, subject: c.subject, credits: c.credits, date: c.finished, eligible: c.status === "finished" && c.percent !== undefined && c.letter !== "F", evidence: c.status === "finished" ? `Local course completion ${c.finished ?? ""}; ${c.parts.counts.lessons + c.parts.counts.modules + c.parts.counts.final} assessed observations${c.overridden ? "; parent grade override" : ""}` : "", provenance: "Existing local course record; not institution-verified" })),
    ...data.records.outside.map(c => ({ key: `outside:${c.id}`, title: c.title, subject: c.subject, credits: c.credits, date: c.yearStart, eligible: false, evidence: "", provenance: `Parent-entered outside course: ${c.where || "source unspecified"}; review needed for this plan` })),
  ];
}
const blankClaim = (): CreditClaim => ({ id: uid("credit"), title: "", subject: "", date: today(), credits: 0, evidence: "", note: "", sourceKey: "", origin: "local", reviewed: false, provenance: "Parent-entered local planning statement; not institution-verified", updatedAt: new Date().toISOString() });

export default function AcademicRecordsWorkspace({ api, family }: { api: AppApi; family: Family }) {
  const [sid, setSid] = useState(family.students[0]?.id ?? "");
  const { data, setRecords, error, retry } = useStudentData(api, family, sid);
  const [busy, setBusy] = useState(false), [message, setMessage] = useState("");
  const [policy, setPolicy] = useState<AcademicRecords["policy"] | null>(null);
  const [claim, setClaim] = useState<CreditClaim | null>(null);
  const [preview, setPreview] = useState<AcademicImportPreview | null>(null);
  const [cleanup, setCleanup] = useState<AcademicRetentionPreview | null>(null);
  const [remove, setRemove] = useState<string | null>(null);
  const [cutoff, setCutoff] = useState("");
  const [exportPreview, setExportPreview] = useState<string | null>(null);
  const dirty = useRef(false); dirty.current = Boolean(policy || claim || preview || cleanup || exportPreview);
  const busyRef = useRef(busy); busyRef.current = busy;
  const mayLeave = () => !busyRef.current && (!dirty.current || window.confirm("Discard the open academic records draft or preview? Saved records will stay."));
  useEffect(() => registerNavigationGuard(() => mayLeave()), []);
  useEffect(() => { const unload = (event: BeforeUnloadEvent) => { if (dirty.current || busyRef.current) { event.preventDefault(); event.returnValue = ""; } }; window.addEventListener("beforeunload", unload); return () => window.removeEventListener("beforeunload", unload); }, []);
  const selectLearner = (id: string) => { if (mayLeave()) setSid(id); };
  const scope = useRef(sid); scope.current = sid;
  const alive = useRef(true); const input = useRef<HTMLInputElement>(null);
  useEffect(() => { alive.current = true; return () => { alive.current = false; }; }, []);
  useEffect(() => { setClaim(null); setPolicy(null); setPreview(null); setCleanup(null); setRemove(null); setExportPreview(null); setMessage(""); setCutoff(""); }, [sid]);
  if (!data) return <><h2>Academic records and portability</h2><StudentPicker family={family} sid={sid} setSid={selectLearner} /><RecordsStatus api={api} error={error} retry={retry} sid={sid} /></>;
  const state = parseAcademicRecords(data.records.academic), candidates = academicCandidates(data), audit = auditAcademicRecords(state, candidates);
  const commit = async (next: AcademicRecords, success: string) => {
    setBusy(true);
    try { if (!await setRecords({ ...data.records, academic: next })) return false; setMessage(success); return true; }
    finally { if (alive.current) setBusy(false); }
  };
  const perform = async (work: () => void | Promise<void>) => { try { await work(); } catch (e) { if (alive.current) { setMessage((e as Error).message); api.toast((e as Error).message); } } };
  const summary = JSON.stringify({
    description: "Historical local statements only; not verified records or restored assessment authority. Attachment files and learner/account identifiers are excluded.",
    attendance: Object.entries(data.records.days).map(([date, status]) => ({ date, status })),
    learningTime: data.records.manual.map(({ date, minutes, subject, note }) => ({ date, minutes, subject, note })),
    courseStatements: candidates.map(({ title, subject, credits, date, provenance }) => ({ title, subject, credits, date, provenance })),
    parentGrades: data.records.grades.map(g => ({ date: g.date, course: data.courses.find(c => c.id === g.courseId)?.title ?? "Unavailable local course", title: g.title, percent: g.percent })),
    evaluations: data.records.tests.map(({ date, name, result, notes }) => ({ date, name, result, notes })),
    reading: data.records.reading.map(({ date, title, author, subject, note, minutes }) => ({ date, title, author, subject, note, minutes })),
    activities: data.records.activities.map(({ kind, name, role, from, to, hours, note }) => ({ kind, name, role, from, to, hours, note })),
    narratives: data.records.narratives,
    attachedDocumentCount: data.records.documents.length,
  }, null, 2);

  return <div className="academic-records" style={{ overflowWrap: "anywhere", minWidth: 0 }}>
    <h2>Academic records and portability</h2>
    <p className="notice">{ACADEMIC_NOTICE} Existing Reports remain available for attendance, report cards, transcripts and portfolios. This workspace is private to this local learner; no data is uploaded.</p>
    <StudentPicker family={family} sid={sid} setSid={selectLearner} />
    {error && <RecordsStatus api={api} error={error} retry={retry} sid={sid} />}
    <p role="status" aria-live="polite">{message}</p>
    <section className="panel" aria-labelledby="academic-policy">
      <h3 id="academic-policy">Graduation planning policy</h3>
      <p>{state.policy.name} · {audit.totalCredits.toFixed(2)} / {audit.requiredCredits.toFixed(2)} total planning credits · {audit.totalRemaining.toFixed(2)} remaining</p>
      <p>{!state.policy.totalCredits && !state.policy.requirements.length ? "No requirements configured. Add your own goals; no jurisdiction is assumed." : audit.planningRequirementsMet ? "Configured planning requirements met. This is not graduation approval." : "Configured planning requirements not yet met."}</p>
      {audit.requirements.map(r => <p key={r.id}>{r.subject}: {r.counted.toFixed(2)} / {r.credits} · {r.remaining.toFixed(2)} remaining{r.requireEvidence ? " · evidence reference required" : ""}</p>)}
      <button className="btn" disabled={busy} onClick={() => setPolicy(structuredClone(state.policy))}>Edit planning policy</button>
      {policy && <form onSubmit={e => { e.preventDefault(); void perform(async () => { if (await commit({ ...state, policy: parseGraduationPolicy(policy) }, "Planning policy saved.")) setPolicy(null); }); }}>
        <label className="field">Policy name<input className="input" required maxLength={200} value={policy.name} onChange={e => setPolicy({ ...policy, name: e.target.value })} /></label>
        <label className="field">Total credits required<input className="input" type="number" min="0" max="1000" step="0.01" required value={policy.totalCredits} onChange={e => setPolicy({ ...policy, totalCredits: e.target.valueAsNumber })} /></label>
        {policy.requirements.map((r, i) => <fieldset key={r.id}><legend>Subject requirement {i + 1}</legend>
          <label className="field">Subject<input className="input" required maxLength={100} value={r.subject} onChange={e => setPolicy({ ...policy, requirements: policy.requirements.map(x => x.id === r.id ? { ...x, subject: e.target.value } : x) })} /></label>
          <label className="field">Required credits<input className="input" type="number" required min="0" max="100" step="0.01" value={r.credits} onChange={e => setPolicy({ ...policy, requirements: policy.requirements.map(x => x.id === r.id ? { ...x, credits: e.target.valueAsNumber } : x) })} /></label>
          <label><input type="checkbox" checked={r.requireEvidence} onChange={e => setPolicy({ ...policy, requirements: policy.requirements.map(x => x.id === r.id ? { ...x, requireEvidence: e.target.checked } : x) })} /> Require evidence reference</label>
          <button className="btn" type="button" onClick={() => setPolicy({ ...policy, requirements: policy.requirements.filter(x => x.id !== r.id) })}>Remove requirement {i + 1}</button>
        </fieldset>)}
        <div className="row"><button type="button" className="btn" onClick={() => setPolicy({ ...policy, requirements: [...policy.requirements, { id: uid("requirement"), subject: "", credits: 0, requireEvidence: true }] })}>Add subject requirement</button><button className="btn primary" disabled={busy}>Save planning policy</button><button className="btn" type="button" onClick={() => setPolicy(null)}>Cancel policy changes</button></div>
      </form>}
    </section>
    <section className="panel" aria-labelledby="academic-credit"><h3 id="academic-credit">Credit and evidence audit</h3>
      <p>Each source counts at most once. A correction linked to an existing course replaces its planning contribution, not the transcript. Outside courses and imported statements require explicit parent review. Evidence references are descriptions, not proof of authenticity.</p>
      <button className="btn primary" disabled={busy} onClick={() => setClaim(blankClaim())}>Add transfer or local credit</button>
      {audit.entries.map((entry, i) => <article className="panel" key={`${entry.key}-${i}`} aria-label={`Credit: ${entry.title}`}>
        <h4>{entry.title}</h4><p>{entry.subject} · {entry.credits} credits · {entry.reason}</p><p>{entry.provenance}</p><p>Evidence: {entry.evidence || "Not recorded"}</p>
        <button className="btn" disabled={busy} onClick={() => { const existing = state.claims.find(c => c.id === entry.claimId); setClaim(existing ? { ...existing } : { ...blankClaim(), title: entry.title, subject: entry.subject, credits: entry.credits, date: entry.date ?? today(), sourceKey: entry.key, evidence: entry.evidence, provenance: entry.provenance }); }}>Review or correct {entry.title}</button>
        {state.claims.find(c => c.id === entry.claimId) && <button className="btn" disabled={busy} onClick={() => setRemove(state.claims.find(c => c.id === entry.claimId)!.id)}>Remove planning entry {entry.title}</button>}
      </article>)}
      {!audit.entries.length && <p>No credit entries yet.</p>}
      {claim && <form onSubmit={e => { e.preventDefault(); void perform(async () => { if (await commit(saveCreditClaim(state, { ...claim, updatedAt: new Date().toISOString() }), "Credit statement saved for this local plan.")) setClaim(null); }); }}>
        <h4>Review credit statement</h4><p>{claim.provenance}</p>
        <label className="field">Credit title<input className="input" required maxLength={300} value={claim.title} onChange={e => setClaim({ ...claim, title: e.target.value })} /></label>
        <label className="field">Credit subject<input className="input" required maxLength={100} value={claim.subject} onChange={e => setClaim({ ...claim, subject: e.target.value })} /></label>
        <label className="field">Completion date<input className="input" type="date" required value={claim.date} onChange={e => setClaim({ ...claim, date: e.target.value })} /></label>
        <label className="field">Planning credits<input className="input" type="number" required min="0" max="100" step="0.01" value={claim.credits} onChange={e => setClaim({ ...claim, credits: e.target.valueAsNumber })} /></label>
        <label className="field">Evidence reference<textarea aria-label="Evidence reference" className="input" maxLength={2000} value={claim.evidence} onChange={e => setClaim({ ...claim, evidence: e.target.value })} /></label>
        <label className="field">Correction or review note<textarea aria-label="Correction or review note" className="input" maxLength={4000} value={claim.note} onChange={e => setClaim({ ...claim, note: e.target.value })} /></label>
        <label><input type="checkbox" checked={claim.reviewed} onChange={e => setClaim({ ...claim, reviewed: e.target.checked })} /> I reviewed this statement for my local plan; this does not verify the issuer or award official credit.</label>
        <div className="row"><button className="btn primary" disabled={busy}>Save credit statement</button><button className="btn" type="button" onClick={() => setClaim(null)}>Cancel credit changes</button></div>
      </form>}
      {remove && <div className="notice" role="region" aria-label="Confirm planning entry removal"><p>Remove this planning entry? Existing course records remain and any linked course will reappear in the audit. Local mutation history remains.</p><button className="btn" disabled={busy} onClick={() => void perform(async () => { if (await commit(removeCreditClaim(state, remove), "Planning entry removed.")) setRemove(null); })}>Confirm removal</button><button className="btn" onClick={() => setRemove(null)}>Cancel removal</button></div>}
    </section>
    <section className="panel" aria-labelledby="academic-portable"><h3 id="academic-portable">Portable records</h3>
      <p>Export planning requirements, credit statements and a read-only historical summary. Automatic learner/account identity fields, assessment authority, raw learner answers and attachment files are excluded. Titles and free text may still contain names or other private information; inspect the preview before sharing. Use Settings and backup for a complete private device recovery, or Reports for printable records.</p>
      <button className="btn" disabled={busy} onClick={() => void perform(() => { setExportPreview(exportAcademicRecords(state, new Date().toISOString(), "Local academic planning records", candidates, summary)); })}>Preview records export</button>
      {exportPreview && <div className="notice"><h4>Export preview</h4><p>{new TextEncoder().encode(exportPreview).length.toLocaleString()} bytes. Contains private course titles, grades/evidence descriptions and parent statements. Share only with your intended recipient. Not signed or verified.</p><pre tabIndex={0} aria-label="Read-only academic record preview" style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere", maxHeight: 260, overflow: "auto" }}>{exportPreview}</pre><button className="btn primary" disabled={busy} onClick={() => void perform(async () => { setBusy(true); try { if (!api.authorizeAcademicRecords) throw Error("Academic records authorization is unavailable."); await api.authorizeAcademicRecords(sid); if (scope.current !== sid || !alive.current) throw Error("Learner changed. Preview export again."); if (await exportText(exportPreview, "academic-records.json", "Academic planning records")) { setMessage("Private records export saved."); setExportPreview(null); } } finally { setBusy(false); } })}>Save private records export</button><button className="btn" onClick={() => setExportPreview(null)}>Cancel export</button></div>}
      <label className="field">Choose academic records file<input ref={input} type="file" accept=".json,application/json" disabled={busy} onChange={e => { const file = e.target.files?.[0]; const captured = sid; e.target.value = ""; if (!file) return; setBusy(true); void perform(async () => { try { if (file.size > MAX_ACADEMIC_BYTES) throw Error("Academic import exceeds 2 MiB."); const parsed = await previewAcademicImport(await file.text()); if (alive.current && scope.current === captured) { setPreview(parsed); setMessage(""); } } finally { if (alive.current) setBusy(false); } }); }} /></label>
      {preview && <div className="notice"><h4>Review import before saving</h4><p>{preview.label} · {preview.claims.length} unverified statements · exported {preview.exportedAt}</p><p>All imported statements start unreviewed. No existing attendance, grades, identity, policy or official credit will be replaced. The exported policy is shown for reference only: {preview.policy.name}.</p><ul>{preview.claims.map(c => <li key={c.id}>{c.title} · {c.subject} · {c.credits} claimed credits · {c.provenance}</li>)}</ul><pre tabIndex={0} aria-label="Read-only academic record preview" style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{preview.summary}</pre>{preview.archives.map((a, i) => <details key={i}><summary>Prior unverified archive: {a.label}</summary><pre tabIndex={0} aria-label="Read-only academic record preview" style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{a.summary}</pre></details>)}<button className="btn primary" disabled={busy} onClick={() => void perform(async () => { if (await commit(applyAcademicImport(state, preview, new Date().toISOString(), () => uid("credit"), candidates), "Imported as unverified statements. Review each before counting it in this local plan.")) setPreview(null); })}>Import unverified statements</button><button className="btn" onClick={() => setPreview(null)}>Cancel import</button></div>}
      {state.imports.map(archive => <details key={archive.fingerprint}><summary>Imported historical summary: {archive.label} · {archive.importedAt}</summary><p>Unverified source statements; no grades or authority were restored.</p><pre tabIndex={0} aria-label="Read-only academic record preview" style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere", maxHeight: 300, overflow: "auto" }}>{archive.summary}</pre></details>)}
    </section>
    <section className="panel" aria-labelledby="academic-retention"><h3 id="academic-retention">Local retention and mutation history</h3>
      <p>No automatic deletion. Preview and explicitly confirm removal of old supplemental planning entries only. Attendance, transcripts, documents, import fingerprints and mutation history remain. Downloaded exports, backups and other devices are outside this cleanup.</p>
      <p>Last confirmed planning cutoff: {state.retention.before ?? "None"}. For wider learner-data deletion, use the existing Learner privacy workflow.</p>
      <label className="field">Remove planning entries before<input className="input" type="date" value={cutoff} onChange={e => { setCutoff(e.target.value); setCleanup(null); }} /></label>
      <button className="btn" disabled={!cutoff || busy} onClick={() => void perform(() => setCleanup(previewAcademicRetention(state, cutoff)))}>Preview local cleanup</button>
      {cleanup && <div className="notice"><p>{cleanup.ids.length} planning entries selected. {cleanup.notice}</p><ul>{state.claims.filter(c => cleanup.ids.includes(c.id)).map(c => <li key={c.id}>{c.title} · {c.date}</li>)}</ul><button className="btn" disabled={busy || !cleanup.ids.length} onClick={() => void perform(async () => { if (await commit(applyAcademicRetention(state, cleanup), "Selected local planning entries removed. Other records and external copies remain.")) setCleanup(null); })}>Confirm local cleanup</button><button className="btn" onClick={() => setCleanup(null)}>Cancel cleanup</button></div>}
      <p>Local mutation history is a bounded device log, not tamper-proof issuer evidence. Restored/imported history is historical, not new authorization.</p>
      <ol>{[...(data.records.audit ?? [])].reverse().slice(0,30).map((a, i) => <li key={i}>{a.at} · revision {a.revision} · {a.action} · {a.fields.join(", ")} · {a.origin}</li>)}</ol>
    </section>
  </div>;
}

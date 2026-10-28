import { useEffect, useRef, useState } from "react";
import type { AppApi } from "../App";
import type { Family } from "../lib/family";
import type { Progress } from "../lib/types";
import { FOUNDATION_COMPETENCIES } from "../lib/competencyCatalog";
import { competencyPath } from "../lib/competencyPath";
import type { CompetencyDecisionInput } from "../lib/competencyStore";
export type { CompetencyDecisionInput } from "../lib/competencyStore";
import { uid } from "../lib/util";

/** App supplies live authorization checks; merely mounting this view grants no write authority. */
export interface CompetencySupervisorAccess {
  load(studentId: string): Promise<Progress>;
  decide(studentId: string, input: CompetencyDecisionInput): Promise<Progress>;
}
const ACTION_LABELS = {
  ready: "Ready to learn (placement)",
  mastered: "Manually satisfied prerequisite (override)",
  "needs-practice": "Needs practice (override)",
  revoke: "Revoke manual decision (use assessment evidence)",
};

export default function CompetencySupervisor({ api, family }: { api: AppApi; family: Family }) {
  const [selected, setSelected] = useState(family.students[0]?.id ?? "");
  const learner = family.students.find(student => student.id === selected);
  return <section className="panel" aria-labelledby="supervisor-path-title">
    <div className="panel-head"><h2 id="supervisor-path-title">Learning paths</h2></div>
    <p className="small muted">Private learning guidance for each learner. Assessment estimates and adult decisions are separate; neither is a credential, certification or course grade. Decisions include who made them, when and why.</p>
    <label className="field"><span>Learner to review</span><select className="select" value={learner ? selected : ""} onChange={event => setSelected(event.target.value)}>
      {!learner && <option value="">Choose a learner</option>}
      {family.students.map(student => <option key={student.id} value={student.id}>{student.name}</option>)}
    </select></label>
    {!family.students.length ? <p>No learners are available.</p> : !learner ? <p role="status">The selected learner is no longer available. Choose another learner.</p> :
      <LearnerPath key={learner.id} api={api} studentId={learner.id} studentName={learner.name} />}
  </section>;
}

function LearnerPath({ api, studentId, studentName }: { api: AppApi; studentId: string; studentName: string }) {
  const access = api.competencySupervisor;
  const [progress, setProgress] = useState<Progress | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [skillId, setSkillId] = useState(FOUNDATION_COMPETENCIES[0]?.id ?? "");
  const [action, setAction] = useState<CompetencyDecisionInput["action"]>("ready");
  const [reason, setReason] = useState("");
  const [retry, setRetry] = useState(0);
  const generation = useRef(0);
  const pending = useRef(false);
  // Keep the same operation ID for an uncertain write retry; a successful decision is never duplicated.
  const intent = useRef<CompetencyDecisionInput | null>(null);
  useEffect(() => {
    const ticket = ++generation.current;
    setLoading(true); setProgress(null); setError("");
    if (!access) { setError("Adult learning-path access is not available. Lock and reopen the adult area."); setLoading(false); return; }
    access.load(studentId).then(value => {
      if (generation.current !== ticket) return;
      setProgress(value); setLoading(false);
    }, cause => {
      if (generation.current !== ticket) return;
      setError(`Could not load learning paths: ${cause instanceof Error ? cause.message : String(cause)}`); setLoading(false);
    });
    return () => { generation.current++; };
  }, [!!access, studentId, retry]);

  let measured: ReturnType<typeof competencyPath>["states"] = [];
  let modelError = "";
  if (progress) {
    try {
      measured = competencyPath(api.allCourses, progress, 100).states;
    } catch { modelError = "The installed course skill mappings could not be validated. No assessment estimate is shown. Restore or update the affected course before making decisions."; }
  }
  const decisions = modelError ? [] : progress?.competencies?.decisions ?? [];
  const selectedSkill = FOUNDATION_COMPETENCIES.find(skill => skill.id === skillId);
  const latest = [...decisions].reverse().find(decision => decision.skillId === skillId && !decision.imported);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (!access || !progress || pending.current || modelError || !reason.trim() || !selectedSkill) return;
    if (action === "revoke" && (!latest || latest.action === "revoke")) { setError("There is no active manual decision to revoke for this skill."); return; }
    const input = { skillId, action, reason: reason.trim() };
    if (!intent.current || intent.current.skillId !== input.skillId || intent.current.action !== input.action || intent.current.reason !== input.reason)
      intent.current = { id: uid("competency-decision"), ...input };
    const request = intent.current;
    const ticket = generation.current;
    pending.current = true; setBusy(true); setError(""); setNotice("");
    try {
      const next = await access.decide(studentId, request);
      if (generation.current !== ticket) return;
      setProgress(next); setReason(""); intent.current = null;
      setNotice(`Decision saved for ${studentName}: ${selectedSkill.title}. Assessment evidence was not changed.`);
    } catch (cause) {
      if (generation.current === ticket) setError(`Decision not confirmed: ${cause instanceof Error ? cause.message : String(cause)}. Retry with the same details to avoid a duplicate.`);
    } finally {
      if (generation.current === ticket) { pending.current = false; setBusy(false); }
    }
  }

  return <div aria-busy={loading || busy}>
    {loading && <p role="status">Loading learning paths for {studentName}…</p>}
    {error && <p className="notice error" role="alert">{error}</p>}
    {!loading && !progress && access && <button className="btn" type="button" onClick={() => setRetry(value => value + 1)}>Retry loading learning paths</button>}
    {notice && <p className="notice" role="status">{notice}</p>}
    {modelError && <p className="notice error" role="alert">{modelError}</p>}
    {progress && <>
      <h3>Skill progression for {studentName}</h3>
      <p className="small muted">Only explicitly linked assessment questions contribute to measured mastery. Unknown or unavailable evidence is never treated as mastered. Retained evidence remains visible when a course is uninstalled; its course must be installed for practice.</p>
      <div style={{ overflowX: "auto" }}><table className="table">
        <caption>Assessment estimates and adult decisions for {studentName}</caption>
        <thead><tr><th scope="col">Skill</th><th scope="col">Assessment evidence</th><th scope="col">Prerequisite guidance</th><th scope="col">Latest adult decision</th></tr></thead>
        <tbody>{FOUNDATION_COMPETENCIES.map(skill => {
          const state = measured.find(item => item.id === skill.id);
          const decision = [...decisions].reverse().find(item => item.skillId === skill.id && !item.imported);
          return <tr key={skill.id}>
            <th scope="row">{skill.title}</th>
            <td>{state?.mastery == null ? "Unknown — no current linked assessment evidence" : `${Math.round(state.mastery * 100)}% estimated mastery; ${Math.round(state.confidence * 100)}% confidence; ${state.attempts} answers`}</td>
            <td>{!state ? "Course or prerequisites not installed" : state.placement?.action === "ready" || state.placement?.action === "mastered" ? "Adult placement permits this skill" : state.blockedBy.length ? state.blockedBy.map(id => FOUNDATION_COMPETENCIES.find(item => item.id === id)?.title ?? id).join(", ") : "Prerequisites satisfied (assessment or explicit adult decision)"}</td>
            <td>{!decision || decision.action === "revoke" ? "Use assessment evidence" : ACTION_LABELS[decision.action]}</td>
          </tr>;
        })}</tbody>
      </table></div>
      <form onSubmit={save} style={{ marginTop: 20 }}>
        <fieldset disabled={busy || !!modelError || !access}>
          <legend>Record an adult placement or override for {studentName}</legend>
          <p className="small muted">An override changes learning recommendations, not the recorded assessment results. It does not create a grade or credential. Revoking it returns to assessment-based guidance.</p>
          <label className="field"><span>Skill for decision</span><select className="select" value={skillId} onChange={event => { setSkillId(event.target.value); setReason(""); setAction("ready"); setNotice(""); }}>
            {FOUNDATION_COMPETENCIES.map(skill => <option key={skill.id} value={skill.id}>{skill.title}</option>)}
          </select></label>
          <label className="field"><span>Adult decision</span><select className="select" value={action} onChange={event => setAction(event.target.value as CompetencyDecisionInput["action"])}>
            {Object.entries(ACTION_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select></label>
          <label className="field"><span>Reason and evidence for this decision</span><textarea className="input" required maxLength={1000} value={reason} onChange={event => setReason(event.target.value)} rows={3} /></label>
          <button className="btn primary" type="submit" disabled={!reason.trim() || (action === "revoke" && (!latest || latest.action === "revoke"))}>{busy ? "Saving decision…" : "Save adult decision"}</button>
        </fieldset>
      </form>
      <details style={{ marginTop: 16 }}><summary>Adult decision history ({decisions.length})</summary>
        {decisions.length ? <ol>{[...decisions].reverse().map(decision => <li key={decision.id}>
          <strong>{FOUNDATION_COMPETENCIES.find(skill => skill.id === decision.skillId)?.title ?? decision.skillId}</strong>: {ACTION_LABELS[decision.action]}.
          {decision.imported && <span className="small muted"> Imported history — adult reconfirmation required; not an active decision. </span>}
          <span> {decision.imported ? "Recorded name: " : ""}{decision.actorName} — <time dateTime={decision.at}>{new Date(decision.at).toLocaleString()}</time>. Reason: {decision.reason}</span>
        </li>)}</ol> : <p>No adult decisions have been recorded for {studentName}.</p>}
      </details>
    </>}
  </div>;
}

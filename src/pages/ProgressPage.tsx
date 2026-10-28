import { useEffect, useState } from "react";
import type { AppApi } from "../App";
import { topicStats, startPractice } from "../lib/session";
import { FOUNDATION_COMPETENCIES } from "../lib/competencyCatalog";
import { competencyImprovement } from "../lib/competencyImprovement";
import { interventionOutcome } from "../lib/interventionOutcome";
import { interventionNextAction } from "../lib/interventionNextAction";
import { availableCompetencySubset } from "../lib/competencyAvailability";
import { resolveCompetencyEvidence, competencyCoverage } from "../lib/competencyEvidence";
import { studentCompetencyPlacement, explainCompetencyBlock } from "../lib/competencyPlacement";
import * as store from "../lib/storage";
import { inApp } from "../lib/storage";
import { UPDATES_ENABLED, appVersion, checkForUpdate } from "../lib/updates";
import { formatDateTime, formatDuration, percent } from "../lib/util";
import { AccuracyBar, ScorePill } from "../components/Bars";

export default function ProgressPage({ api }: { api: AppApi }) {
  const { progress, banks } = api;
  const [bankFilter, setBankFilter] = useState<string>("");
  const [location, setLocation] = useState("");
  const [version, setVersion] = useState("");
  const [updateMsg, setUpdateMsg] = useState("");

  useEffect(() => {
    appVersion().then(setVersion, () => {});
  }, []);

  async function checkUpdates() {
    setUpdateMsg("Checking…");
    try {
      const u = await checkForUpdate();
      setUpdateMsg(
        u
          ? `Version ${u.version} is available. See the banner at the top to install it.`
          : inApp
            ? "You're on the latest version."
            : "Update checks only run in the desktop app.",
      );
      if (u) api.notifyUpdate(u);
    } catch {
      setUpdateMsg("Couldn't reach the update server. Check your connection and try again.");
    }
  }

  useEffect(() => {
    store.dataLocation().then(setLocation, () => setLocation(""));
  }, []);

  const attempts = progress.attempts.filter((a) => !bankFilter || a.bankId === bankFilter);
  const placement = (() => {
    const authored = availableCompetencySubset(FOUNDATION_COMPETENCIES, api.courses.map(c => c.id));
    if (!authored.length) return null;
    const graph = resolveCompetencyEvidence(authored, api.courses);
    return { ...studentCompetencyPlacement(graph, api.courses, progress), coverage: competencyCoverage(graph), graph };
  })();
  const exams = attempts.filter((a) => a.mode === "exam");
  const answeredTotal = attempts.reduce((s, a) => s + a.total, 0);
  const correctTotal = attempts.reduce((s, a) => s + a.correct, 0);
  const studySec = attempts.reduce((s, a) => s + a.durationSec, 0);

  // Weakest topics across the selected banks, needing at least 3 answers to count.
  const weak = banks
    .filter((b) => !bankFilter || b.id === bankFilter)
    .flatMap((b) => topicStats(b, progress).map((t) => ({ ...t, bank: b.title })))
    .filter((t) => t.attempts >= 3 && t.accuracy !== null && t.accuracy < 1)
    .sort((a, b) => (a.accuracy ?? 0) - (b.accuracy ?? 0))
    .slice(0, 8);

  async function backup() {
    try {
      const standalone = banks.filter((b) => !b.courseId);
      if (await store.exportBackup(api.courses, standalone, progress)) api.toast("Backup saved");
    } catch (e) {
      api.toast(`Backup failed: ${String(e)}`);
    }
  }

  async function restore() {
    try {
      const text = await store.pickJsonFile();
      if (text === null) return;
      const raw = JSON.parse(text);
      if (raw?.format !== "examiner-backup") return api.toast("That file isn't an Erudior backup.");
      const when = raw.createdAt ? new Date(raw.createdAt).toLocaleString() : "an unknown date";
      const ok = await store.confirmAction(
        `Restore the backup from ${when}? This replaces all your courses, question banks and progress on this computer with what's in the backup.`,
        "Restore backup",
      );
      if (!ok) return;
      const n = await store.restoreBackup(raw, { courses: api.courses, banks: banks.filter((b) => !b.courseId) });
      await api.reload();
      await api.setProgress(await store.loadProgress());
      api.toast(`Restored ${n.courses} course${n.courses === 1 ? "" : "s"} and ${n.banks} bank${n.banks === 1 ? "" : "s"}`);
    } catch (e) {
      api.toast(`Restore failed: ${(e as Error).message ?? String(e)}`);
    }
  }

  async function reset() {
    const scope = bankFilter ? banks.find((b) => b.id === bankFilter)?.title : "all banks";
    const ok = await store.confirmAction(`Erase all history and question stats for ${scope}? This can't be undone.`);
    if (!ok) return;
    if (bankFilter) {
      const stats = { ...progress.stats };
      delete stats[bankFilter];
      await api.setProgress({
        ...progress,
        attempts: progress.attempts.filter((a) => a.bankId !== bankFilter),
        stats,
      });
    } else {
      await api.setProgress({ ...progress, attempts: [], stats: {} });
    }
    api.toast("Progress erased");
  }

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Progress</h1>
          <p className="muted">Every finished exam and practice session, and where you're losing points.</p>
        </div>
        <div className="row">
          <select className="select" aria-label="Show results for" style={{ width: "auto" }} value={bankFilter} onChange={(e) => setBankFilter(e.target.value)}>
            <option value="">All banks</option>
            {banks.map((b) => (
              <option key={b.id} value={b.id}>
                {b.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="stats-strip">
        <div>
          <b>{exams.length}</b>
          <span>exams</span>
        </div>
        <div>
          <b>{attempts.length - exams.length}</b>
          <span>practice sessions</span>
        </div>
        <div>
          <b>{answeredTotal}</b>
          <span>questions answered</span>
        </div>
        <div>
          <b>{answeredTotal ? `${percent(correctTotal, answeredTotal)}%` : "None"}</b>
          <span>overall accuracy</span>
        </div>
        <div>
          <b>{formatDuration(studySec)}</b>
          <span>study time</span>
        </div>
      </div>

      <section className="panel" aria-labelledby="skill-path-title">
        <div className="panel-head"><h2 id="skill-path-title">Learning path</h2></div>
        <p className="muted small">Skills across your installed courses. Only linked assessments with saved answers count as mastery; this is a learning recommendation, not a certification.</p>
        {!placement ? (
          <p className="muted small">Install Pre-algebra, Algebra 1 or German A1 to see the initial skill pathways.</p>
        ) : (
          <>
            <p className="small muted">
              {placement.states.filter(s => s.mastered).length} mastered · {placement.states.filter(s => s.ready && !s.mastered).length} ready · {placement.states.filter(s => !s.ready).length} awaiting prerequisites
            </p>
            {placement.recommendations.length === 0 ? <p className="small muted">No new placement recommendations available yet.</p> : (
              <ul className="roadmap-list">
                {placement.recommendations.map(skill => (
                  <li key={skill.skillId}>
                    <span className="pill">Next</span>
                    <span>
                      <strong>{skill.title}</strong><span className="small muted"> — {skill.reason}</span>
                      {placement.states.filter(state=>state.id===skill.skillId).map(state=>{
                        const action=interventionNextAction(state,progress);
                        return <span key={state.id+"-next"} className="small muted">
                          Suggested next action: {action.action==="review"?"Review lesson":action.action==="practice"?"Practice again":action.action==="advance"?"Advance":"Assess"} — {action.reason}
                        </span>;
                      })}
                      {placement.states.filter(state=>state.id===skill.skillId).map(state=>{
                        const outcome=interventionOutcome(state,progress);
                        return outcome ? <span key={state.id + "-outcome"} className="small muted">
                          Reassessment: {outcome.baseline===null||outcome.current===null
                            ? "Comparable mastery evidence not yet available."
                            : `Mastery estimate ${Math.round(outcome.baseline*100)}% → ${Math.round(outcome.current*100)}% (${outcome.delta!>0?"+":""}${Math.round(outcome.delta!*100)} points).`}
                          {" "}{outcome.next}
                        </span> : null;
                      })}
                      {progress.attempts.filter(a=>a.intervention?.skillId===skill.skillId).slice(-3).reverse().map(a=>{
                        const baseline=a.intervention?.baseline;
                        const assessed=a.total>0?a.correct/a.total:null;
                        return <span key={a.id} className="small muted">
                          Focused practice {new Date(a.finishedAt).toLocaleDateString()}: {assessed===null?"No graded answers":Math.round(assessed*100)+"% on this session"}
                          {baseline===null||baseline===undefined||assessed===null?" (no comparable pre-practice mastery baseline)":` (starting mastery estimate ${Math.round(baseline*100)}%; these are different measures)`}
                        </span>;
                      })}
                      {placement.graph.filter(item=>item.id===skill.skillId).map(item=>{
                        const trend=competencyImprovement(item,api.banks,progress);
                        return trend ? <span key={item.id} className="small muted">
                          Recent assessment trend: {Math.round(trend.before*100)}% → {Math.round(trend.after*100)}%
                          ({trend.change>0?"+":""}{Math.round(trend.change*100)} points across {trend.sessions} assessed sessions).
                          {trend.change<0?" Performance declined; consider reviewing the linked lesson.":trend.change>0?" Performance improved; keep practicing to confirm mastery.":" Performance is unchanged."}
                        </span> : null;
                      })}
                      {skill.confidence > 0 && skill.reason.startsWith("Ready for practice") && (
                        <span className="small muted"> Targeted intervention: review a linked lesson, then repeat its practice quiz to check for improvement.</span>
                      )}
                      {FOUNDATION_COMPETENCIES.find(item => item.id === skill.skillId) &&
                        Object.entries(FOUNDATION_COMPETENCIES.find(item => item.id === skill.skillId)!.lessons)
                          .flatMap(([courseId, ids]) => ids.map(lessonId => ({courseId,lessonId})))
                          .filter(({courseId,lessonId}) => api.courses.some(c => c.id === courseId && c.lessons.some(l => l.id === lessonId)))
                          .slice(0, 2)
                          .map(({courseId,lessonId}) => {
                            const lesson = api.courses.find(c => c.id === courseId)?.lessons.find(l => l.id === lessonId);
                            return <button key={courseId + "/" + lessonId} type="button" className="linkish small"
                              onClick={() => api.go({name:"lesson",courseId,lessonId})}>
                              Study lesson: {lesson?.title ?? lessonId}
                            </button>;
                          })}
                      {placement.graph.filter(item => item.id === skill.skillId).flatMap(item =>
                        Object.entries(item.evidence).flatMap(([courseId, topics]) =>
                          api.banks.filter(bank => bank.courseId === courseId).flatMap(bank => {
                            const available = topics.filter(topic => bank.questions.some(q => q.topic === topic));
                            return available.length ? [{bank, topics:available}] : [];
                          })
                        )
                      ).slice(0,1).map(({bank,topics}) => (
                        <button key={bank.id + "-practice"} type="button" className="linkish small"
                          onClick={() => api.go({name:"run",session:{...startPractice(bank, progress, {
                            count:Math.min(10,bank.questions.filter(q=>topics.includes(q.topic)).length),
                            topics,sections:[],filter:"all",shuffleChoices:true,
                          }), intervention:{skillId:skill.skillId,baseline:placement.states.find(s=>s.id===skill.skillId)?.mastery ?? null}}})}>
                          {progress.attempts.some(a=>a.intervention?.skillId===skill.skillId) ? "Reassess competency" : "Start focused practice"} ({Math.min(10,bank.questions.filter(q=>topics.includes(q.topic)).length)} questions)
                        </button>
                      ))}
                      {skill.suggestedCourseIds.map(courseId => {
                        const course = api.courses.find(c => c.id === courseId);
                        return course ? (
                          <button key={courseId} type="button" className="linkish small"
                            onClick={() => api.go({ name: "course", courseId, tab: "lessons" })}>
                            Study in {course.title}
                          </button>
                        ) : null;
                      })}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            {placement.states.filter(state=>state.mastered && interventionOutcome(state,progress)).length > 0 && (
              <div>
                <h3>Ready to advance</h3>
                <ul className="roadmap-list">
                  {placement.states.filter(state=>state.mastered && interventionOutcome(state,progress)).map(state=>(
                    <li key={state.id}>{state.title} — mastered after recorded focused practice. Continue to a recommended prerequisite-unlocked skill.</li>
                  ))}
                </ul>
              </div>
            )}
            <details>
              <summary>All skills and prerequisites</summary>
              <ul className="roadmap-list">
                {placement.states.map(skill => (
                  <li key={skill.id}>
                    <span className={`pill ${skill.mastered ? "pass" : ""}`}>{skill.mastered ? "Mastered" : skill.ready ? "Ready" : "Locked"}</span>
                    <span>{skill.title}<span className="small muted"> — {explainCompetencyBlock(skill, placement.states)}</span></span>
                  </li>
                ))}
              </ul>
            </details>
            {placement.coverage.some(c => !c.assessed) && <p className="muted small">Some skills have no linked assessment yet. They remain unassessed rather than being treated as completed.</p>}
          </>
        )}
      </section>

      <div className="grid-2">
        <section className="panel">
          <div className="panel-head">
            <h2>Weakest topics</h2>
          </div>
          {weak.length === 0 ? (
            <p className="muted small">Topics show up here once you've answered at least 3 questions in them and missed at least one.</p>
          ) : (
            <table className="table">
              <tbody>
                {weak.map((t) => (
                  <tr key={t.bank + t.topic}>
                    <td>
                      {t.topic}
                      {!bankFilter && <div className="faint small">{t.bank}</div>}
                    </td>
                    <td style={{ width: "45%" }}>
                      <AccuracyBar value={t.accuracy} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="panel">
          <div className="panel-head">
            <h2>Exam scores</h2>
          </div>
          {exams.length === 0 ? (
            <p className="muted small">Take a timed exam to start a score trend.</p>
          ) : (
            <ScoreTrend points={exams.slice(0, 20).reverse().map((a) => ({ pct: percent(a.correct, a.total), pass: a.passingPercent }))} />
          )}
        </section>
      </div>

      <section className="panel" style={{ marginTop: 16 }}>
        <div className="panel-head">
          <h2>History</h2>
        </div>
        {attempts.length === 0 ? (
          <p className="muted small">No sessions yet.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>When</th>
                <th>Bank</th>
                <th>Mode</th>
                <th className="r">Score</th>
                <th className="r">Time</th>
                <th><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {attempts.map((a) => (
                <tr key={a.id} className="click" onClick={() => api.go({ name: "results", attemptId: a.id, back: { name: "progress" } })}>
                  <td>{formatDateTime(a.finishedAt)}</td>
                  <td>{a.bankTitle}</td>
                  <td>{a.mode === "exam" ? "Exam" : "Practice"}</td>
                  <td className="r">
                    {a.correct}/{a.total} ({percent(a.correct, a.total)}%)
                  </td>
                  <td className="r">{formatDuration(a.durationSec)}</td>
                  <td className="r">
                    <ScorePill attempt={a} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {api.family ? (
        <p className="muted small" style={{ marginTop: 16 }}>
          Backups of the whole family (every student's progress and records) are in the Parent area.
        </p>
      ) : (
      <section className="panel" style={{ marginTop: 16 }}>
        <div className="panel-head">
          <h2>Backup</h2>
        </div>
        <p className="muted small" style={{ marginBottom: 12 }}>
          Save all your courses, question banks, notes, flags, card schedules and history to one file. Restore it on
          another computer, or after reinstalling.
        </p>
        <div className="row">
          <button className="btn primary" onClick={backup}>
            Back up now
          </button>
          <button className="btn" onClick={restore}>
            Restore from backup
          </button>
        </div>
      </section>
      )}

      <div className="row" style={{ marginTop: 24, justifyContent: "space-between" }}>
        <span className="faint small">
          Erudior {version}. Data is stored in {location}.{" "}
          <button className="linkish" onClick={() => api.go({ name: "legal", page: "terms" })}>
            Terms of Use
          </button>{" "}
          {UPDATES_ENABLED && (
            <>
              <button className="linkish" onClick={checkUpdates}>
                Check for updates
              </button>{" "}
              {updateMsg}
            </>
          )}
        </span>
        <button className="btn danger ghost sm" onClick={reset} disabled={!attempts.length && !Object.keys(progress.stats).length}>
          Erase progress{bankFilter ? " for this bank" : ""}
        </button>
      </div>
    </div>
  );
}

/** Small line chart of exam scores, oldest to newest, with the passing line. */
function ScoreTrend({ points }: { points: { pct: number; pass?: number }[] }) {
  const W = 420;
  const H = 160;
  const pad = { l: 30, r: 10, t: 10, b: 20 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;
  const x = (i: number) => pad.l + (points.length === 1 ? iw / 2 : (i / (points.length - 1)) * iw);
  const y = (v: number) => pad.t + ih - (v / 100) * ih;
  const pass = points[points.length - 1]?.pass;
  const path = points.map((p, i) => `${i ? "L" : "M"}${x(i)},${y(p.pct)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Exam score trend">
      {[0, 50, 100].map((v) => (
        <g key={v}>
          <line x1={pad.l} x2={W - pad.r} y1={y(v)} y2={y(v)} stroke="var(--rule)" />
          <text x={pad.l - 6} y={y(v) + 4} textAnchor="end" fontSize="10" fill="var(--ink-3)">
            {v}
          </text>
        </g>
      ))}
      {pass !== undefined && (
        <g>
          <line x1={pad.l} x2={W - pad.r} y1={y(pass)} y2={y(pass)} stroke="var(--ok)" strokeDasharray="4 4" />
          <text x={W - pad.r} y={y(pass) - 4} textAnchor="end" fontSize="10" fill="var(--ok)">
            pass {pass}%
          </text>
        </g>
      )}
      <path d={path} fill="none" stroke="var(--accent)" strokeWidth="2" />
      {points.map((p, i) => (
        <circle key={i} cx={x(i)} cy={y(p.pct)} r="3.5" fill="var(--surface)" stroke="var(--accent)" strokeWidth="2">
          <title>{p.pct}%</title>
        </circle>
      ))}
      <text x={pad.l} y={H - 4} fontSize="10" fill="var(--ink-3)">
        oldest
      </text>
      <text x={W - pad.r} y={H - 4} fontSize="10" fill="var(--ink-3)" textAnchor="end">
        latest
      </text>
    </svg>
  );
}

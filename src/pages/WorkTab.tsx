// A course's Assignments tab: its writing assignments and labs with their status, and the
// course's activity log (PE, art, music practice) with weekly goals and totals.

import { useEffect, useRef, useState } from "react";
import type { AppApi } from "../App";
import type { Course } from "../lib/types";
import { isClassroom } from "../lib/family";
import { adjustLogged } from "../lib/timer";
import { deleteFile } from "../lib/documents";
import { addDays, today } from "../lib/srs";
import * as store from "../lib/storage";
import {
  courseLogs,
  fmtMinutes,
  logTotals,
  newLogEntry,
  statusLabel,
  thisWeek,
  weekStart,
  wordTarget,
  workKey,
  workStatus,
  type ActivityLogSpec,
  type LogEntry,
  type WorkFile,
} from "../lib/work";
import Markdown from "../components/Markdown";
import SpreadsheetCourseAssignment from "../components/SpreadsheetCourseAssignment";
import { StoredFile, sizeOf, storeWorkFile } from "../components/WorkParts";
import { useWorkContext } from "./WorkView";
import { uid } from "../lib/util";
import { AssessedWorkHistory, useAssessedWorkSubmission } from "../components/AssessedWorkSubmission";

const fmtDay = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });

export default function WorkTab({ api, course }: { api: AppApi; course: Course }) {
  const ctx = useWorkContext(api, course.id);
  const writing = course.writing ?? [];
  const labs = course.labs ?? [];
  const row = (id: string) => {
    const key = workKey(course.id, id);
    const s = workStatus(api.progress.work?.[key], ctx.reviews[key]);
    return { s, label: statusLabel(s, ctx.adult) };
  };
  const open = (itemId: string) => api.go({ name: "work", courseId: course.id, itemId });
  const moduleTitle = (id?: string) => course.modules.find((m) => m.id === id)?.title;

  return (
    <div className="work-tab">
      {!ctx.adult && (writing.length > 0 || labs.length > 0) && (
        <p className="notice small" style={{ marginBottom: 16 }}>
          Your work is saved on this device. When you finish a piece you can print it. If your teacher gave you a class file, join the class on the Courses page so
          you can hand work in.
        </p>
      )}
      {!!course.advancedAssessments?.length && <section className="panel" aria-labelledby="course-advanced-assessment-title">
        <h2 id="course-advanced-assessment-title">Advanced assessment and feedback</h2>
        <p>Step-by-step reasoning and oral evidence with explicit question variants and human rubric review. These educational records do not certify qualifications or authenticate examinations. A supervising adult reviews the exact source before assignment; your responses and feedback are saved on Progress.</p>
        <ul>{course.advancedAssessments.map(s => <li key={s.id}><strong>{s.title}</strong> · revision {s.revision}{s.lessonId && <button className="btn sm ghost" onClick={() => api.go({name:"lesson",courseId:course.id,lessonId:s.lessonId!})}>Open linked lesson</button>}</li>)}</ul>
        <button className="btn" onClick={() => api.go({name:"progress"})}>Open my advanced assessments</button>
      </section>}
      {!!course.scientificWorkspaces?.length && <section className="panel" aria-labelledby="course-scientific-title">
        <h2 id="course-scientific-title">Scientific and engineering workspaces</h2>
        <p>Guided educational investigations and simulated instruments, not real equipment control or validated engineering advice. A supervising adult reviews the exact source before assignment. Measurements, design iterations and human feedback are saved on Progress.</p>
        <ul>{course.scientificWorkspaces.map(s => <li key={s.id}><strong>{s.title}</strong> · revision {s.revision}{s.lessonId && <button className="btn sm ghost" onClick={() => api.go({name:"lesson",courseId:course.id,lessonId:s.lessonId!})}>Open linked lesson</button>}</li>)}</ul>
        <button className="btn" onClick={() => api.go({name:"progress"})}>Open my scientific workspaces</button>
      </section>}
      {!!course.branchingScenarios?.length && <section className="panel" aria-labelledby="course-branching-title">
        <h2 id="course-branching-title">Fictional branching scenarios</h2>
        <p>These reusable educational scenarios use simulated time, not real-world deadlines or professional advice. A supervising adult reviews the exact source and assigns your case; your saved decisions and feedback appear on Progress.</p>
        <ul>{course.branchingScenarios.map(s => <li key={s.id}><strong>{s.title}</strong> · revision {s.revision}{s.lessonId && <button className="btn sm ghost" onClick={() => api.go({name:"lesson",courseId:course.id,lessonId:s.lessonId!})}>Open linked lesson</button>}</li>)}</ul>
        <button className="btn" onClick={() => api.go({name:"progress"})}>Open my branching cases</button>
      </section>}
      {(course.spreadsheetAssignments?.length ?? 0) > 0 && <section className="panel"><h2>Spreadsheet assignments</h2>{course.spreadsheetAssignments?.map(a => <SpreadsheetCourseAssignment key={a.id} api={api} courseId={course.id} assignment={a} />)}</section>}
      {writing.length > 0 && (
        <section className="panel" aria-labelledby="wt-writing">
          <h2 id="wt-writing">Writing</h2>
          <ul className="work-list">
            {writing.map((w) => {
              const st = row(w.id);
              return (
                <li key={w.id} className="work-row">
                  <div>
                    <b>{w.title}</b>
                    <span className="small muted">
                      {[w.kind === "short" ? "Short response" : "Essay", moduleTitle(w.module), wordTarget(w.words).replace(/\.$/, "")].filter(Boolean).join(" · ")}
                    </span>
                  </div>
                  <span className={`pill work-pill is-${st.s}`}>{st.label}</span>
                  <button className="btn sm" onClick={() => open(w.id)}>
                    {st.s === "new" ? "Start" : "Open"}
                    <span className="sr-only"> {w.title}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      )}
      {labs.length > 0 && (
        <section className="panel" aria-labelledby="wt-labs">
          <h2 id="wt-labs">Labs</h2>
          <ul className="work-list">
            {labs.map((l) => {
              const st = row(l.id);
              return (
                <li key={l.id} className="work-row">
                  <div>
                    <b>{l.title}</b>
                    <span className="small muted">
                      {[moduleTitle(l.module), l.minutes ? `About ${l.minutes} min` : ""].filter(Boolean).join(" · ")}
                      {l.adult && <span className="assign-adult">Adult needed</span>}
                    </span>
                  </div>
                  <span className={`pill work-pill is-${st.s}`}>{st.label}</span>
                  <button className="btn sm" onClick={() => open(l.id)}>
                    {st.s === "new" ? "Start" : "Open"}
                    <span className="sr-only"> {l.title}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      )}
      {course.activityLog && <ActivityLog key={JSON.stringify([api.student?.id??null,course.id,course.activityLog])} api={api} course={course} spec={course.activityLog} />}
    </div>
  );
}

function Meter({ label, have, need, unit }: { label: string; have: number; need: number; unit: (n: number) => string }) {
  const pct = Math.min(100, Math.round((have / need) * 100));
  return (
    <div className="meter-block log-meter">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <span>
          <b>{unit(have)}</b> of {unit(need)} {label}
        </span>
        <span className="small muted">{have >= need ? "Goal reached" : `${unit(need - have)} to go`}</span>
      </div>
      <div className={`bar${have >= need ? "" : " mid"}`} role="img" aria-label={`${pct}% of this week's goal`}>
        <i style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function ActivityLog({ api, course, spec }: { api: AppApi; course: Course; spec: ActivityLogSpec }) {
  const studentId = api.student?.id ?? null;
  const alive = useRef(true);
  const adding = useRef(false);
  useEffect(() => { alive.current = true; return () => { alive.current = false; }; }, []);
  const sameLearner = () => alive.current && store.activeStudent() === studentId;
  const requireLearner = () => { if (!sameLearner()) throw Error("The active learner changed. No activity was written to the new profile."); };
  const types = [...spec.types, ...(spec.types.includes("Other") ? [] : ["Other"])];
  const blank = { date: today(), type: types[0], minutes: "", note: "" };
  const [f, setF] = useState(blank);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const entries = courseLogs(api.progress, course.id);
  const submission = useAssessedWorkSubmission(api,course.id,"activity-log","log");
  const week = thisWeek(entries);
  const all = logTotals(entries);
  // Minutes count toward the school-hours record in a homeschool family (not in a classroom, which keeps no hours).
  const creditTo = api.family && api.student && !isClassroom(api.family) ? api.student.id : undefined;
  const lastWeekFrom = addDays(weekStart(today()), -7);
  const lastWeek = logTotals(entries, lastWeekFrom, addDays(lastWeekFrom, 6));

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (adding.current || !sameLearner()) return;
    const minutes = Math.round(Number(f.minutes));
    if (!(minutes > 0 && minutes <= 24 * 60)) return api.toast("Enter how many minutes (1 to 1440).");
    if (f.date > today()) return api.toast("The date can't be in the future.");
    adding.current = true;setBusy(true);
    try {
      let stored: WorkFile | undefined;
      if (file) stored = await storeWorkFile(file, f.note.trim());
      requireLearner();
      const entry: LogEntry = newLogEntry({
        courseId: course.id,
        date: f.date,
        type: f.type,
        minutes,
        note: f.note.trim(),
        ...(stored ? { file: stored } : {}),
        ...(creditTo ? { credited: creditTo } : {}),
      });
      await api.updateProgress((p) => ({ ...p, logs: [...(p.logs ?? []), entry] }));
      // This write committed to the captured learner; finish their explicit-ID hours projection.
      if (creditTo) await adjustLogged(creditTo, course.id, entry.date, minutes * 60);
      if (!sameLearner()) return;
      setF({ ...blank, type: f.type });
      setFile(null);
      if (fileInput.current) fileInput.current.value = "";
      api.toast(`Logged ${fmtMinutes(minutes)} of ${f.type.toLowerCase()}`);
    } catch (err) {
      if (sameLearner()) api.toast((err as Error).message);
    } finally {
      adding.current = false;if (alive.current) setBusy(false);
    }
  }

  async function remove(e: LogEntry) {
    if (!(await store.confirmAction(`Delete ${fmtMinutes(e.minutes)} of ${e.type.toLowerCase()} on ${fmtDay(e.date)}?`))) return;
    if (!sameLearner()) return;
    await api.updateProgress((p) => ({ ...p, logs: (p.logs ?? []).filter((x) => x.id !== e.id) }));
    // The deletion committed to the captured learner; finish that learner's hours adjustment.
    if (e.credited) await adjustLogged(e.credited, e.courseId, e.date, -e.minutes * 60).catch(() => {});
    if (e.file) deleteFile(e.file.fileId).catch(() => {});
    if (sameLearner()) api.toast("Entry deleted");
  }

  return (
    <section className="panel activity-log" aria-labelledby="wt-log">
      <div className="panel-head">
        <h2 id="wt-log">{spec.title}</h2>
        {creditTo && <span className="small muted">Minutes you log count toward your school hours.</span>}
      </div>
      <AssessedWorkHistory entries={submission.history}/>
      {submission.error && <p role="alert">{submission.error}</p>}
      {submission.pending && <p role="status">Original activity snapshot not confirmed saved. Retry before exporting a hand-in.</p>}
      <button className="btn" disabled={busy||submission.busy||(!entries.length&&!submission.pending)} onClick={async()=>{
        const source=submission.pending?.submission ?? {id:uid("logwork"),submittedAt:Date.now(),courseId:course.id,assignmentId:"activity-log",kind:"log" as const,task:spec,response:entries};
        if(await submission.submit(source)) api.toast("Original activity log snapshot confirmed saved.");
      }}>{submission.busy?"Saving…":submission.pending?"Retry original activity submission":"Submit activity log snapshot"}</button>
      {spec.prompt && <Markdown source={spec.prompt} glossary={course.glossary} />}

      <div className="log-week" aria-labelledby="wt-week">
        <h3 id="wt-week">This week</h3>
        {spec.weeklyMinutes ? (
          <Meter label="minutes" have={week.minutes} need={spec.weeklyMinutes} unit={(n) => `${Math.round(n)}`} />
        ) : (
          <p>
            <b>{fmtMinutes(week.minutes)}</b> so far
          </p>
        )}
        {spec.weeklyDays && <Meter label="active days" have={week.days} need={spec.weeklyDays} unit={(n) => `${n}`} />}
        <p className="small muted">
          Last week: {fmtMinutes(lastWeek.minutes)} on {lastWeek.days} day{lastWeek.days === 1 ? "" : "s"}. All together: {fmtMinutes(all.minutes)} in {all.entries}{" "}
          entr{all.entries === 1 ? "y" : "ies"}.
        </p>
      </div>

      <form className="form-grid four log-form" onSubmit={add} aria-labelledby="wt-add">
        <h3 id="wt-add" className="span-all">
          Add to the log
        </h3>
        <label className="field">
          <span>Date</span>
          <input className="input" type="date" max={today()} value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} required />
        </label>
        <label className="field">
          <span>What you did</span>
          <select className="select" value={f.type} onChange={(e) => setF({ ...f, type: e.target.value })}>
            {types.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Minutes</span>
          <input className="input" type="number" inputMode="numeric" min={1} max={1440} value={f.minutes} onChange={(e) => setF({ ...f, minutes: e.target.value })} required />
        </label>
        <label className="field">
          <span>Notes (optional)</span>
          <input className="input" value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} placeholder="e.g. learned a new song" />
        </label>
        {spec.uploads && (
          <div className="field span-2">
            <span id="wt-file-l">Photo or file of your work (optional)</span>
            <div className="row">
              <input
                ref={fileInput}
                id="wt-file"
                type="file"
                aria-labelledby="wt-file-l"
                className="input"
                accept="image/*,audio/*,video/*,application/pdf"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
              {file && <span className="small muted">{sizeOf(file.size)}</span>}
            </div>
          </div>
        )}
        <div className="span-all">
          <button className="btn primary" disabled={busy}>
            {busy ? "Saving…" : "Add to the log"}
          </button>
        </div>
      </form>

      {all.byType.length > 0 && (
        <div className="log-types">
          <h3>Time by activity</h3>
          <ul className="small">
            {all.byType.map((t) => (
              <li key={t.type}>
                {t.type}: <b>{fmtMinutes(t.minutes)}</b>
              </li>
            ))}
          </ul>
        </div>
      )}

      <h3 className="log-h">Your entries</h3>
      {entries.length === 0 ? (
        <p className="muted small">Nothing logged yet.</p>
      ) : (
        <ul className="log-list">
          {entries.slice(0, 60).map((e) => (
            <li key={e.id} className="log-entry">
              <div className="log-main">
                <span className="log-date">{fmtDay(e.date)}</span>
                <b>{e.type}</b>
                <span>{fmtMinutes(e.minutes)}</span>
                {e.note && <span className="small muted">{e.note}</span>}
              </div>
              {e.file && (
                <div className="log-file">
                  <StoredFile file={e.file} onError={api.toast} />
                </div>
              )}
              <button className="btn sm ghost" onClick={() => remove(e)}>
                Delete<span className="sr-only"> {e.type} on {fmtDay(e.date)}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {entries.length > 60 && <p className="small muted">Showing the latest 60 entries.</p>}
    </section>
  );
}

// Parent / Teacher area → Student work: writing and labs handed in for review (grade with the
// course's rubric, comment, or send back for another draft), and activity logs with weekly
// goals and school-year totals by subject.

import { useEffect, useRef, useState } from "react";
import type { AppApi } from "../App";
import type { Course } from "../lib/types";
import { adultLabel, type Family } from "../lib/family";
import { loadRecords, subjectOf, type Records } from "../lib/records";
import {
  addReview,
  currentReview,
  fmtMinutes,
  logTotals,
  rubricOf,
  rubricScore,
  thisWeek,
  workKey,
  workStatus,
  type Lab,
  type LogEntry,
  type WorkRecord,
  type WorkReview,
  type WorkStatus,
  type WritingTask,
} from "../lib/work";
import { StudentPicker, useStudentData } from "./ParentRecords";
import { PromptText, ReviewNote, RubricPicker, StoredFile, WorkBody } from "../components/WorkParts";

const fmt = (iso: string) => new Date(iso.length > 10 ? iso : `${iso}T12:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

interface Piece {
  course: Course;
  kind: "writing" | "lab";
  item: WritingTask | Lab;
  key: string;
  w?: WorkRecord;
  status: WorkStatus;
  reviews: WorkReview[];
}

function piecesFor(courses: Course[], work: Record<string, WorkRecord>, reviews: Records["reviews"]): Piece[] {
  const out: Piece[] = [];
  for (const course of courses) {
    const items: [Piece["kind"], WritingTask | Lab][] = [...(course.writing ?? []).map((x) => ["writing", x] as [Piece["kind"], WritingTask]), ...(course.labs ?? []).map((x) => ["lab", x] as [Piece["kind"], Lab])];
    for (const [kind, item] of items) {
      const key = workKey(course.id, item.id);
      const w = work[key];
      if (!w) continue;
      const rv = reviews?.[key] ?? [];
      out.push({ course, kind, item, key, w, status: workStatus(w, rv), reviews: rv });
    }
  }
  return out;
}

export function StudentWorkTab({ api, family }: { api: AppApi; family: Family }) {
  const [sid, setSid] = useState(family.students[0].id);
  const { data, setRecords } = useStudentData(api, family, sid);
  const [open, setOpen] = useState<string | null>(null);
  const adult = adultLabel(family);
  if (!data) return <p className="muted">Loading…</p>;
  const pieces = piecesFor(api.allCourses, data.progress.work ?? {}, data.records.reviews);
  const piece = pieces.find((p) => p.key === open);

  if (piece)
    return (
      <ReviewScreen
        key={piece.key}
        piece={piece}
        student={data.student.name}
        adult={adult}
        onClose={() => setOpen(null)}
        onSave={async (review) => {
          // Read the records fresh: other tabs may have changed them since this one loaded.
          const fresh = await loadRecords(sid);
          await setRecords(addReview(fresh, piece.course.id, piece.item.id, `${piece.kind === "writing" ? "Writing" : "Lab"}: ${piece.item.title}`, review));
          api.toast(review.revise ? `Sent back to ${data.student.name} for another draft` : `Grade saved for ${piece.item.title}`);
          setOpen(null);
        }}
      />
    );

  const group = (title: string, list: Piece[], empty: string, verb: string) => (
    <section className="panel" aria-label={title}>
      <h2>{title}</h2>
      {list.length === 0 ? (
        <p className="small muted">{empty}</p>
      ) : (
        <ul className="work-list">
          {list.map((p) => {
            const r = currentReview(p.w, p.reviews);
            return (
              <li key={p.key} className="work-row">
                <div>
                  <b>{p.item.title}</b>
                  <span className="small muted">
                    {p.course.title} · {p.kind === "writing" ? "Writing" : "Lab"}
                    {p.w?.submitted ? ` · handed in ${fmt(p.w.submitted)}` : p.w ? ` · last changed ${fmt(p.w.updated)}` : ""}
                    {(p.w?.rounds ?? 0) > 1 ? ` · draft ${p.w!.rounds}` : ""}
                  </span>
                </div>
                {r?.percent !== undefined && !r.revise && <span className="pill pass">{Math.round(r.percent)}%</span>}
                <button className={`btn sm${verb === "Review" ? " primary" : ""}`} onClick={() => setOpen(p.key)}>
                  {verb}
                  <span className="sr-only"> {p.item.title}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );

  const waiting = pieces.filter((p) => p.status === "submitted");
  const reviewed = pieces.filter((p) => p.status === "reviewed");
  const working = pieces.filter((p) => p.status === "draft" || p.status === "revise");

  return (
    <>
      <div className="row" style={{ marginBottom: 16 }}>
        <StudentPicker family={family} sid={sid} setSid={setSid} />
      </div>
      {group("Waiting for you", waiting, `Nothing handed in. Writing and labs appear here when ${data.student.name} hands them in.`, "Review")}
      <Logs family={family} sid={sid} courses={api.allCourses} logs={data.progress.logs ?? []} onError={api.toast} />
      {group("Graded", reviewed, "Nothing graded yet.", "Open")}
      {working.length > 0 && group("Still being worked on", working, "", "View")}
      <p className="small muted" style={{ marginTop: 8 }}>
        Grades from rubrics count as graded work in the course grade (Settings: how grades are weighted). Writing and labs, with photos, print in the portfolio.
      </p>
    </>
  );
}

// ---------- activity logs ----------

function Logs({ family, sid, courses, logs, onError }: { family: Family; sid: string; courses: Course[]; logs: LogEntry[]; onError: (m: string) => void }) {
  const student = family.students.find((s) => s.id === sid);
  const withLog = courses.filter((c) => c.activityLog || logs.some((e) => e.courseId === c.id));
  if (!withLog.length) return null;
  const inYear = (e: LogEntry) => e.date >= family.year.start && e.date <= family.year.end;
  const bySubject = new Map<string, number>();
  for (const e of logs.filter(inYear)) {
    const s = subjectOf(e.courseId, student);
    bySubject.set(s, (bySubject.get(s) ?? 0) + e.minutes);
  }
  return (
    <section className="panel" aria-labelledby="sw-logs">
      <div className="panel-head">
        <h2 id="sw-logs">Activity logs</h2>
        <span className="small muted">Logged minutes are already in attendance and hours (as time on the course).</span>
      </div>
      {bySubject.size > 0 && (
        <p className="small">
          This school year by subject:{" "}
          {[...bySubject]
            .sort((a, b) => b[1] - a[1])
            .map(([s, m]) => `${s} ${fmtMinutes(m)}`)
            .join(" · ")}
        </p>
      )}
      <div className="table-wrap" tabIndex={0} role="region" aria-label="Activity log totals">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Course</th>
              <th scope="col" className="r">
                This week
              </th>
              <th scope="col" className="r">
                Weekly goal
              </th>
              <th scope="col" className="r">
                School year
              </th>
            </tr>
          </thead>
          <tbody>
            {withLog.map((c) => {
              const mine = logs.filter((e) => e.courseId === c.id);
              const week = thisWeek(mine);
              const year = logTotals(mine, family.year.start, family.year.end);
              const goal = c.activityLog?.weeklyMinutes;
              return (
                <tr key={c.id}>
                  <th scope="row">
                    {c.title}
                    {year.byType.length > 0 && <div className="small muted">{year.byType.map((t) => `${t.type} ${fmtMinutes(t.minutes)}`).join(", ")}</div>}
                  </th>
                  <td className="r">
                    {fmtMinutes(week.minutes)}
                    {goal ? (week.minutes >= goal ? " ✓" : "") : ""}
                  </td>
                  <td className="r">{goal ? fmtMinutes(goal) : "—"}</td>
                  <td className="r">
                    {fmtMinutes(year.minutes)} ({year.days} day{year.days === 1 ? "" : "s"})
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {logs.length > 0 && (
        <details className="log-recent">
          <summary>Recent entries</summary>
          <ul className="log-list">
            {[...logs]
              .sort((a, b) => b.date.localeCompare(a.date))
              .slice(0, 30)
              .map((e) => (
                <li key={e.id} className="log-entry">
                  <div className="log-main">
                    <span className="log-date">{fmt(e.date)}</span>
                    <b>{e.type}</b>
                    <span>{fmtMinutes(e.minutes)}</span>
                    <span className="small muted">{courses.find((c) => c.id === e.courseId)?.title}</span>
                    {e.note && <span className="small muted">{e.note}</span>}
                  </div>
                  {e.file && (
                    <div className="log-file">
                      <StoredFile file={e.file} onError={onError} />
                    </div>
                  )}
                </li>
              ))}
          </ul>
        </details>
      )}
    </section>
  );
}

// ---------- review ----------

function ReviewScreen({
  piece,
  student,
  adult,
  onClose,
  onSave,
}: {
  piece: Piece;
  student: string;
  adult: string;
  onClose: () => void;
  onSave: (r: WorkReview) => Promise<void>;
}) {
  const { course, item, kind, w } = piece;
  const rubric = rubricOf(course, item.rubric);
  const last = piece.reviews[piece.reviews.length - 1];
  const handedIn = !!w?.submitted;
  // Regrading starts from the current grade; a new draft starts empty.
  const start = handedIn && last && last.forSubmitted === w!.submitted && !last.revise ? last : undefined;
  const [levels, setLevels] = useState<Record<string, number>>(start?.levels ?? {});
  const [notes, setNotes] = useState<Record<string, string>>(start?.notes ?? {});
  const [comment, setComment] = useState(start?.comment ?? "");
  const [percent, setPercent] = useState(start?.percent !== undefined && !rubric ? String(Math.round(start.percent)) : "");
  const [problem, setProblem] = useState("");
  const [busy, setBusy] = useState(false);
  const head = useRef<HTMLHeadingElement>(null);
  useEffect(() => head.current?.focus(), []);
  const score = rubric ? rubricScore(rubric, levels) : undefined;

  async function save(revise: boolean) {
    setProblem("");
    let pct: number | undefined;
    if (rubric) {
      if (!revise && !score!.complete) return setProblem("Pick a level for every part of the rubric, or ask for another draft.");
      pct = score!.complete ? score!.percent : undefined;
    } else if (percent.trim()) {
      pct = Number(percent);
      if (!(pct >= 0 && pct <= 100)) return setProblem("Enter a percent from 0 to 100, or leave it blank.");
    }
    if (revise && !comment.trim()) return setProblem(`Tell ${student} what to work on in the comment.`);
    setBusy(true);
    try {
      await onSave({
        at: new Date().toISOString(),
        by: adult,
        forSubmitted: w!.submitted!,
        levels: rubric ? levels : {},
        ...(Object.values(notes).some((x) => x.trim()) ? { notes: Object.fromEntries(Object.entries(notes).filter(([, v]) => v.trim())) } : {}),
        comment: comment.trim(),
        ...(score ? { points: score.points, outOf: score.outOf } : {}),
        ...(pct !== undefined ? { percent: pct } : {}),
        ...(revise ? { revise: true } : {}),
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="review-screen">
      <button className="back" onClick={onClose}>
        ← Student work
      </button>
      <header className="work-head">
        <p className="work-kicker">
          {kind === "writing" ? "Writing" : "Lab"} · {course.title}
        </p>
        <h2 ref={head} tabIndex={-1} className="review-title">
          {student}: {item.title}
        </h2>
        <p className="small muted">
          {handedIn ? `Handed in ${fmt(w!.submitted!)}` : "Not handed in yet: you can read it, and grade it once it's handed in."}
          {(w?.rounds ?? 0) > 1 ? ` · draft ${w!.rounds}` : ""}
        </p>
      </header>

      <details className="panel review-prompt">
        <summary>The assignment</summary>
        {kind === "writing" ? <PromptText course={course} text={(item as WritingTask).prompt} /> : (item as Lab).intro && <PromptText course={course} text={(item as Lab).intro!} />}
      </details>

      <section className="panel" aria-label={`${student}'s work`}>
        {w && <WorkBody item={item} kind={kind} w={w} />}
      </section>

      {handedIn && (
        <section className="panel review-form" aria-labelledby="rv-h">
          <h3 id="rv-h">{rubric ? "Grade with the rubric" : "Grade"}</h3>
          {rubric ? (
            <>
              <p className="small muted" style={{ marginBottom: 8 }}>
                Pick the level the work reached for each part.{w?.self && Object.keys(w.self).length ? ` ${student}'s own check is marked "${student}'s pick".` : ""}
              </p>
              <RubricPicker
                rubric={rubric}
                name="review"
                value={levels}
                onChange={(v) => {
                  setLevels(v);
                  setProblem("");
                }}
                other={w?.self}
                otherLabel={`${student}'s pick`}
                notes={notes}
                onNote={(id, t) => setNotes({ ...notes, [id]: t })}
              />
              <p className="work-score" aria-live="polite">
                {score!.points} of {score!.outOf} points{score!.complete ? ` · ${Math.round(score!.percent)}%` : ""}
              </p>
            </>
          ) : (
            <label className="field" style={{ maxWidth: 200 }}>
              <span>Percent (optional)</span>
              <input className="input" type="number" min={0} max={100} value={percent} onChange={(e) => setPercent(e.target.value)} />
            </label>
          )}
          <label className="field" style={{ marginTop: 12 }}>
            <span>Comment for {student}</span>
            <textarea className="textarea" rows={4} value={comment} onChange={(e) => setComment(e.target.value)} />
          </label>
          {problem && (
            <p className="notice error" role="alert" style={{ marginTop: 10 }}>
              {problem}
            </p>
          )}
          <div className="row" style={{ marginTop: 12 }}>
            <button className="btn primary" disabled={busy} onClick={() => save(false)}>
              {start ? "Save new grade" : "Save grade"}
            </button>
            <button className="btn" disabled={busy} onClick={() => save(true)}>
              Ask for another draft
            </button>
          </div>
          <p className="small muted" style={{ marginTop: 6 }}>
            A grade counts in the course grade; another draft doesn't, and the work comes back here when it's handed in again.
          </p>
        </section>
      )}

      {piece.reviews.length > 0 && (
        <section aria-label="Earlier reviews">
          {[...piece.reviews].reverse().map((r) => (
            <ReviewNote key={r.at} forAdult review={r} rubric={rubric} title={`${r.revise ? "Sent back" : "Graded"} ${fmt(r.at)}`} />
          ))}
        </section>
      )}
    </div>
  );
}

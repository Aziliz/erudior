import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import type { Course } from "../lib/types";
import { confirmAction, exportText, pickJsonFile } from "../lib/storage";
import { reviewCourseDigest } from "../lib/reviewSnapshot";
import {
  newObjective, objectiveGaps, objectiveTasks, readObjectiveFile, recordObjective, reviewState,
  sourceLabels, type Objective, type ObjectiveFile,
} from "../lib/objectiveReview";

export default function ObjectiveReviewPanel({ course, active, onDirty }: {
  course: Course; active: boolean; onDirty: (dirty: boolean) => void;
}) {
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [selected, select] = useState("");
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const io = useRef(false);
  const [notice, setNotice] = useState("");
  const [snapshot, setSnapshot] = useState<{ course: Course; digest: string } | null>(null);
  const [onlyGaps, setOnlyGaps] = useState(false);
  const current = objectives.find(o => o.id === selected);
  const draftDecision = current?.draftDecision ?? { reviewer: "", findings: "", result: "reviewed" as const };
  const revision = course.revision ?? 1;
  const tasks = useMemo(() => objectiveTasks(course), [course]);
  const digest = snapshot?.course === course ? snapshot.digest : "";
  useEffect(() => {
    if (!active || snapshot?.course === course) return;
    let live = true;
    reviewCourseDigest(course).then(value => {
      if (live) setSnapshot({ course, digest: value });
    }).catch(() => { if (live) setNotice("The course snapshot could not be identified. Save a valid course before recording review."); });
    return () => { live = false; };
  }, [active, course, snapshot]);
  function change(list: Objective[]) {
    setObjectives(list);
    setDirty(true);
    onDirty(true);
    setNotice("");
  }
  function edit(fields: Partial<Objective>) {
    if (current) change(objectives.map(o => o.id === current.id ? { ...o, ...fields } : o));
  }
  const unmapped = course.lessons.filter(l => !objectives.some(o => o.lessonId === l.id && o.outcome.trim()));
  const rows = objectives.map(o => ({ o, gaps: objectiveGaps(course, tasks, o, digest) }));
  function add(lessonId: string) {
    const o = newObjective(lessonId, course.author);
    change([...objectives, o]);
    select(o.id);
  }
  async function fileAction(open: boolean) {
    if (io.current) return;
    io.current = true;
    setBusy(true);
    try {
      if (open) {
        const text = await pickJsonFile();
        if (text === null) return;
        const file = readObjectiveFile(text, course.id);
        if (dirty && !(await confirmAction("Replace your unsaved objective review with this file?", "Open review file"))) return;
        setObjectives(file.objectives);
        select(file.objectives[0]?.id ?? "");
        setNotice("Review file opened.");
      } else {
        const file: ObjectiveFile = { format: "erudior-objective-review", version: 1, courseId: course.id, objectives };
        if (!(await exportText(JSON.stringify(file, null, 2), course.id + ".objectives.json", "Course objective review"))) return;
        setNotice("Review file exported.");
      }
      setDirty(false);
      onDirty(false);
    } catch (e) { setNotice(e instanceof Error ? e.message : "Could not open or export the review file."); }
    finally { io.current = false; setBusy(false); }
  }
  async function remove() {
    if (!current || io.current) return;
    io.current = true;
    setBusy(true);
    try {
      if (await confirmAction("Remove this objective and its review record from the worksheet?", "Remove objective")) {
        const rest = objectives.filter(o => o.id !== current.id);
        change(rest);
        select(rest[0]?.id ?? "");
      }
    } catch (e) { setNotice(e instanceof Error ? e.message : "Could not remove the objective."); }
    finally { io.current = false; setBusy(false); }
  }
  function record(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!current) return;
    const form = event.currentTarget, data = new FormData(form);
    try {
      const result = data.get("result") === "changes" ? "changes" : "reviewed";
      const review = recordObjective(current, digest, revision, String(data.get("reviewer") ?? ""), result, String(data.get("findings") ?? ""));
      const previousReviews = current.review ? [...(current.previousReviews ?? []), current.review] : current.previousReviews;
      edit({ draftDecision: undefined, previousReviews, review });
      form.reset();
      setNotice("Independent review recorded. Export the worksheet to keep the record.");
    } catch (e) { setNotice((e as Error).message); }
  }
  const chosenTask = current ? tasks.get(current.task) : undefined;
  return <section aria-label="Course objective review" className="objective-review" hidden={!active}>
    <h3>Objective review</h3>
    <p className="small muted">Review files travel separately from the learner course. Export your worksheet to keep it or hand it to a reviewer.</p>
    <fieldset disabled={busy}>
      <legend>Review worksheet</legend>
      <div className="row wrap">
        <button className="btn sm" type="button" onClick={() => void fileAction(true)}>Open review file</button>
        <button className="btn sm" type="button" onClick={() => void fileAction(false)} disabled={!objectives.length && !dirty}>Export review file</button>
        {dirty && <span>Unexported changes</span>}
      </div>
      <p>Course revision {revision} · {rows.filter(r => !r.gaps.length).length} of {rows.length} objectives have all evidence recorded · {unmapped.length} lessons without a mapped objective</p>
      <button className="btn sm" type="button" onClick={() => add(unmapped[0]?.id ?? course.lessons[0]?.id ?? "")}>Add objective</button>
      {!!unmapped.length && <details><summary>Lessons without a mapped objective ({unmapped.length})</summary>
        <ul>{unmapped.map(l => <li key={l.id}><button className="btn sm" type="button" onClick={() => add(l.id)}>{l.title || l.id}</button></li>)}</ul>
      </details>}
      {!!rows.length && <>
        <label className="row"><input type="checkbox" checked={onlyGaps} onChange={e => setOnlyGaps(e.target.checked)} /> Show objectives with gaps only</label>
        <ul className="objective-list">{rows.filter(r => !onlyGaps || r.gaps.length).map(({ o, gaps }) => <li key={o.id}>
          <button className="btn sm" type="button" aria-current={o.id === selected ? "true" : undefined} onClick={() => select(o.id)}>{o.outcome || "Untitled objective"}</button>
          <span className="small">{gaps.length ? gaps.join(" · ") : "All evidence recorded"}</span>
        </li>)}</ul>
      </>}
      {current && <div key={current.id} className="objective-fields">
        <h4>Objective evidence</h4>
        <label>Learning objective<input className="input" value={current.outcome} onChange={e => edit({ outcome: e.target.value })} /></label>
        <label>Lesson<select className="select" value={current.lessonId} onChange={e => edit({ lessonId: e.target.value })}>
          <option value="">Choose a lesson</option>
          {current.lessonId && !course.lessons.some(l => l.id === current.lessonId) && <option value={current.lessonId}>Missing lesson · {current.lessonId}</option>}
          {course.lessons.map(l => <option key={l.id} value={l.id}>{l.title || l.id}</option>)}
        </select></label>
        <label>Independent task<select className="select" value={current.task} onChange={e => edit({ task: e.target.value, taskNote: "", rubric: "", rubricNote: "" })}>
          <option value="">Choose a task</option><option value="manual">Manual assignment or reference</option>
          {current.task && current.task !== "manual" && !chosenTask && <option value={current.task}>Missing task · {current.task}</option>}
          {[true, false].map(linked => <optgroup key={String(linked)} label={linked ? "Linked to this lesson" : "Other course tasks"}>
            {[...tasks.values()].filter(t => t.lessons.includes(current.lessonId) === linked).map(t => <option key={t.key} value={t.key}>{t.title} ({t.key})</option>)}
          </optgroup>)}
        </select></label>
        {current.task === "manual" && <label>Task location and learner deliverable<textarea className="textarea" value={current.taskNote} onChange={e => edit({ taskNote: e.target.value })} /></label>}
        {chosenTask?.rubric ? <p>Linked rubric · {chosenTask.rubric}</p> : <>
          <label>Rubric<select className="select" value={current.rubric} onChange={e => edit({ rubric: e.target.value, rubricNote: "" })}>
            <option value="">Choose a rubric</option><option value="#manual">Manual scoring guide</option>
            {current.rubric && current.rubric !== "#manual" && !course.rubrics?.some(r => r.id === current.rubric) && <option value={current.rubric}>Missing rubric · {current.rubric}</option>}
            {course.rubrics?.map(r => <option key={r.id} value={r.id}>{r.title || r.id}</option>)}
          </select></label>
          {current.rubric === "#manual" && <label>Scoring guide location and criteria<textarea className="textarea" value={current.rubricNote} onChange={e => edit({ rubricNote: e.target.value })} /></label>}
        </>}
        <h4>Source comparisons</h4>
        <p className="small muted">Record what each source confirms or disputes. Use two distinct .edu institutions and one additional official source. Check that each source is freely accessible.</p>
        {current.comparisons.map((s, i) => <fieldset key={i}><legend>{sourceLabels[i]}</legend>
          <label>Source URL<input className="input" type="url" value={s.url} onChange={e => edit({ comparisons: current.comparisons.map((x, j) => i === j ? { ...x, url: e.target.value } : x) })} /></label>
          <label>Comparison finding<textarea className="textarea" value={s.finding} onChange={e => edit({ comparisons: current.comparisons.map((x, j) => i === j ? { ...x, finding: e.target.value } : x) })} /></label>
        </fieldset>)}
        <label>Objective author<input className="input" value={current.author} onChange={e => edit({ author: e.target.value })} /></label>
        <h4>Independent review</h4>
        {current.review && <p><strong>{reviewState(current, digest, revision)}</strong> · {current.review.reviewer} · revision {current.review.revision} · {current.review.date.slice(0,10)}<br/>{current.review.note}</p>}
        {!!current.previousReviews?.length && <details><summary>Previous reviews ({current.previousReviews.length})</summary>
          <ol>{current.previousReviews.map((r, i) => <li key={i}>
            {r.result === "changes" ? "Changes requested" : "Reviewed"} · {r.reviewer} · revision {r.revision} · {r.date.slice(0, 10)}<br />{r.note}
          </li>)}</ol>
        </details>}
        <form onSubmit={record}>
          <label>Reviewer name<input className="input" name="reviewer" value={draftDecision.reviewer} onChange={e => edit({ draftDecision: { ...draftDecision, reviewer: e.target.value } })} required /></label>
          <label>Review result<select className="select" name="result" value={draftDecision.result} onChange={e => edit({ draftDecision: { ...draftDecision, result: e.target.value === "changes" ? "changes" : "reviewed" } })}><option value="reviewed">Reviewed</option><option value="changes">Changes requested</option></select></label>
          <label>Review findings<textarea className="textarea" name="findings" value={draftDecision.findings} onChange={e => edit({ draftDecision: { ...draftDecision, findings: e.target.value } })} required /></label>
          <label className="row"><input type="checkbox" required /> I independently checked the lesson, task, rubric and cited evidence.</label>
          <button className="btn primary" type="submit" disabled={!digest}>Record review for revision {revision}</button>
        </form>
        <button className="btn sm" type="button" onClick={() => void remove()}>Remove objective</button>
      </div>}
    </fieldset>
    <p role="status">{notice}</p>
  </section>;
}

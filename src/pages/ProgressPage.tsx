import { lazy, Suspense, useEffect, useRef, useState, type FormEvent } from "react";
import type { AppApi } from "../App";
import { CATALOG } from "../lib/catalog";
import { enrollmentProgress, type CourseProgressSummary } from "../lib/learningProgress";
import { LEARNING_PATHWAY_LIMITS, parseLearningPathways, pathwayProgress, starterPathways, type LearningPathway } from "../lib/learningPathways";

const ProgressTools = lazy(() => import("./ProgressTools"));
type PathDraft = { pathway: LearningPathway; original: string | null };

function ProgressMeter({ value, label }: { value: number | null; label: string }) {
  return <div className="learning-progress-meter">
    <progress max={100} value={value ?? 0} aria-label={label} />
    <strong className="num">{value === null ? "—" : `${value}%`}</strong>
  </div>;
}

function statusLabel(course: CourseProgressSummary): string {
  if (course.completionBasis === "exam") return "Completed by exam";
  return course.complete ? "Complete" : course.status === "in-progress" ? "In progress"
    : course.status === "no-checkpoints" ? "No lesson checkpoints" : "Not started";
}

export default function ProgressPage({ api, initialToolsOpen = false }: { api: AppApi; initialToolsOpen?: boolean }) {
  const summary = enrollmentProgress(api.courses, api.progress);
  const pathways = parseLearningPathways(api.progress.learningPathways);
  const [filter, setFilter] = useState("all");
  const [draft, setDraft] = useState<PathDraft | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [toolsOpen, setToolsOpen] = useState(initialToolsOpen);
  const scope = api.student ? `student:${api.student.id}` : "independent";
  const activeScope = useRef(scope);
  activeScope.current = scope;
  useEffect(() => { setDraft(null); setFilter("all"); setError(""); setToolsOpen(initialToolsOpen); setBusy(false); }, [scope, initialToolsOpen]);

  const options = new Map<string, { id: string; title: string }>();
  for (const entry of CATALOG) options.set(entry.id, entry);
  for (const course of api.courses) options.set(course.id, course);
  const suggestions = starterPathways(CATALOG).filter(path => !pathways.some(mine => mine.id === path.id));
  const visibleCourses = summary.courses.filter(course => filter === "all"
    || (filter === "complete" ? course.complete : !course.complete));

  async function savePathway(pathway: LearningPathway, original: string | null = null) {
    if (busy) return;
    const requestedScope = scope;
    setBusy(true); setError("");
    try {
      parseLearningPathways([pathway]);
      await api.updateLearningPathways(current => {
        if (activeScope.current !== requestedScope) throw Error("The learner changed. Open the pathway again.");
        const paths = parseLearningPathways(current);
        const existing = paths.find(path => path.id === pathway.id);
        if (original === null && existing) throw Error("You are already following this pathway.");
        if (original !== null && JSON.stringify(existing) !== original) throw Error("This pathway changed. Reopen it before saving.");
        const next = existing ? paths.map(path => path.id === pathway.id ? pathway : path) : [...paths, pathway];
        parseLearningPathways(next);
        return next;
      });
      if (activeScope.current === requestedScope) { setDraft(null); api.toast(original === null ? "Pathway added" : "Pathway updated"); }
    } catch (problem) {
      if (activeScope.current === requestedScope) setError(problem instanceof Error ? problem.message : String(problem));
    } finally { if (activeScope.current === requestedScope) setBusy(false); }
  }

  async function removePathway(pathway: LearningPathway) {
    if (busy) return;
    const requestedScope = scope;
    setBusy(true); setError("");
    try {
      await api.updateLearningPathways(current => {
        if (activeScope.current !== requestedScope) throw Error("The learner changed. Open the pathway again.");
        return parseLearningPathways(current).filter(path => path.id !== pathway.id);
      });
      if (activeScope.current === requestedScope) api.toast("Stopped following the pathway. Your courses and progress are kept.");
    } catch (problem) {
      if (activeScope.current === requestedScope) setError(problem instanceof Error ? problem.message : String(problem));
    } finally { if (activeScope.current === requestedScope) setBusy(false); }
  }

  function createPathway() {
    setError("");
    setDraft({ pathway: { id: `path-${crypto.randomUUID()}`, title: "", courseIds: [] }, original: null });
  }

  function continueCourse(course: CourseProgressSummary) {
    api.go(course.nextLessonId ? { name: "lesson", courseId: course.courseId, lessonId: course.nextLessonId }
      : { name: "course", courseId: course.courseId, tab: course.complete ? "progress" : "today" });
  }

  const viewStep = (courseId: string, enrolled: boolean) => {
    if (enrolled) api.go({ name: "course", courseId, tab: "progress" });
    else if (CATALOG.some(entry => entry.id === courseId)) api.go({ name: "overview", catalogId: courseId });
    else api.go({ name: "library" });
  };

  return <div className="page progress-overview">
    <header className="page-head">
      <div><p className="progress-eyebrow">{api.student ? `${api.student.name}'s learning` : "Your learning"}</p>
        <h1>Courses</h1><p className="muted">Your enrolled courses, the paths you're following, and what comes next.</p></div>
      <button className="btn" onClick={createPathway} disabled={busy || pathways.length >= LEARNING_PATHWAY_LIMITS.pathways}>Create a pathway</button>
    </header>

    <section className="progress-summary" aria-label="Enrollment overview">
      <div><span>Enrolled courses</span><strong className="num">{summary.enrolledCourses}</strong><small>{summary.inProgressCourses} in progress</small></div>
      <div><span>Completed courses</span><strong className="num">{summary.completedCourses}<small> / {summary.enrolledCourses}</small></strong><small>{summary.lessonsDone} core lessons completed</small></div>
      <div><span>Average course progress</span><strong className="num">{summary.percent === null ? "—" : `${summary.percent}%`}</strong><small>Each enrolled course has an equal share</small></div>
    </section>

    {error && <p role="alert" className="notice">{error}</p>}
    {draft && <PathwayEditor key={draft.pathway.id} draft={draft} options={[...options.values()]}
      busy={busy} onCancel={() => setDraft(null)} onSave={pathway => void savePathway(pathway, draft.original)} />}

    <section aria-labelledby="enrolled-courses-title" className="progress-section">
      <div className="progress-section-heading"><div><h2 id="enrolled-courses-title">Your courses</h2>
        <p className="muted small">Open a course's Progress tab for lessons, assessments, and session history.</p></div>
        {summary.enrolledCourses > 0 && <label className="progress-filter"><span className="small">Show</span><select className="select" aria-label="Filter enrolled courses" value={filter} onChange={event => setFilter(event.target.value)}>
          <option value="all">All enrolled ({summary.enrolledCourses})</option><option value="active">Still learning ({summary.enrolledCourses - summary.completedCourses})</option><option value="complete">Completed ({summary.completedCourses})</option>
        </select></label>}
      </div>
      {!summary.enrolledCourses ? <div className="panel progress-empty"><h3>Your learning starts with a course</h3><p className="muted">Start a course from the library to see its progress here. You can also follow a pathway to plan a sequence.</p><button className="btn primary" onClick={() => api.go({ name: "library" })}>Browse courses</button></div>
        : !visibleCourses.length ? <p className="panel muted">No courses match this filter yet.</p>
        : <div className="enrolled-course-list">{visibleCourses.map(course => <article key={course.courseId} className="enrolled-course-card" aria-label={`${course.title} progress`}>
          <div className="enrolled-course-title"><span className={`pill ${course.complete ? "pass" : "neutral"}`}>{statusLabel(course)}</span><h3>{course.title}</h3>
            <p className="small muted">{course.lessonsTotal ? `${course.lessonsDone} of ${course.lessonsTotal} core lessons` : "This course has no lesson checkpoints yet."}
              {course.moduleQuizzesTotal > 0 && ` · ${course.moduleQuizzesDone} of ${course.moduleQuizzesTotal} module quizzes passed`}</p></div>
          <div className="enrolled-course-meter"><ProgressMeter value={course.percent} label={`${course.title} course progress`} /></div>
          <div className="enrolled-course-actions"><button className="btn sm" onClick={() => api.go({ name: "course", courseId: course.courseId, tab: "progress" })}>Course progress</button>
            {!course.complete && <button className="btn sm primary" onClick={() => continueCourse(course)}>{course.status === "not-started" ? "Start learning" : "Continue"}</button>}</div>
        </article>)}</div>}
      {summary.enrolledCourses > 0 && <p className="small muted progress-measure-note">Progress follows core lessons or a passed full-course exam. Optional honors work is separate.
        {summary.unmeasuredCourses > 0 && ` ${summary.unmeasuredCourses} course${summary.unmeasuredCourses === 1 ? " has" : "s have"} no measurable lesson progress and contribute${summary.unmeasuredCourses === 1 ? "s" : ""} 0% to the average.`}</p>}
    </section>

    <section aria-labelledby="learning-pathways-title" className="progress-section">
      <div className="progress-section-heading"><div><h2 id="learning-pathways-title">Your learning pathways</h2><p className="muted small">Work toward a larger goal through an ordered set of courses.</p></div>
        <span className="pill neutral">{pathways.length} following</span></div>
      <div className="learning-pathway-list">{pathways.map(pathway => {
        const model = pathwayProgress(pathway, api.courses, api.progress, CATALOG);
        const next = model.steps.find(step => step.courseId === model.nextCourseId);
        return <article className="panel learning-pathway-card" key={pathway.id} aria-label={`${pathway.title} pathway`}>
          <div className="progress-section-heading"><div><h3>{pathway.title}</h3><p className="small muted">{model.completedCourses} of {model.totalCourses} courses completed</p></div>
            <div className="row"><button className="btn sm" disabled={busy} onClick={() => { setError(""); setDraft({ pathway: { ...pathway, courseIds: [...pathway.courseIds] }, original: JSON.stringify(pathway) }); }}>Edit pathway</button>
              <button className="btn sm ghost" disabled={busy} onClick={() => void removePathway(pathway)}>Stop following</button></div></div>
          <ProgressMeter value={model.percent} label={`${pathway.title} pathway progress`} />
          <div className="pathway-next"><span className="small"><strong>{next ? "Up next: " : "Pathway complete"}</strong>{next?.title}{next && !next.available && " · Course unavailable"}</span>
            {next?.available && <button className="btn sm primary" onClick={() => {
              const course = summary.courses.find(item => item.courseId === next.courseId);
              if (course) continueCourse(course); else viewStep(next.courseId, next.enrolled);
            }}>{next.enrolled ? "Continue course" : "View next course"}</button>}
          </div>
          <details className="pathway-sequence"><summary>View course sequence ({model.totalCourses})</summary><ol>{model.steps.map((step, index) => <li key={step.courseId} className={step.complete ? "pathway-step complete" : "pathway-step"}>
            <span className="pathway-step-number" aria-hidden="true">{step.complete ? "✓" : index + 1}</span><div><strong>{step.title}</strong><span className="small muted">{step.completionBasis === "exam" ? "Completed by exam" : step.complete ? "Complete" : !step.available ? "Course unavailable" : step.enrolled ? `${step.percent ?? 0}% complete` : step.percent ? `${step.percent}% saved · not enrolled` : "Not enrolled"}</span></div>
            {step.available && <button className="btn sm ghost" onClick={() => viewStep(step.courseId, step.enrolled)}>{step.enrolled ? "View progress" : "View course"}</button>}
          </li>)}</ol></details>
        </article>;
      })}</div>
      {!pathways.length && <p className="muted">Choose a starter pathway below, or create your own from available courses. Following a pathway saves your plan; you choose when to start each course.</p>}
      {suggestions.length > 0 && <div className="pathway-suggestions">{suggestions.map(pathway => <article className="pathway-suggestion" key={pathway.id}><div><h3>{pathway.title}</h3><p className="small muted">{pathway.courseIds.length} courses · {options.get(pathway.courseIds[0])?.title} to {options.get(pathway.courseIds.at(-1)!)?.title}</p></div><button className="btn sm" disabled={busy || pathways.length >= LEARNING_PATHWAY_LIMITS.pathways} onClick={() => void savePathway(pathway)}>Follow pathway<span className="sr-only">: {pathway.title}</span></button></article>)}</div>}
    </section>

    <details className="progress-tools-disclosure" open={toolsOpen} onToggle={event => setToolsOpen(event.currentTarget.open)}>
      <summary>Study tools, skill evidence, and data</summary>
      {toolsOpen && <Suspense fallback={<p role="status">Loading study tools…</p>}><ProgressTools api={api} /></Suspense>}
    </details>
  </div>;
}

function PathwayEditor({ draft, options, busy, onCancel, onSave }: {
  draft: PathDraft; options: { id: string; title: string }[]; busy: boolean;
  onCancel: () => void; onSave: (pathway: LearningPathway) => void;
}) {
  const [title, setTitle] = useState(draft.pathway.title);
  const [ids, setIds] = useState(draft.pathway.courseIds);
  const [selection, setSelection] = useState("");
  const [error, setError] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);
  useEffect(() => { nameRef.current?.focus(); }, []);
  const available = options.filter(course => !ids.includes(course.id));
  function move(index: number, delta: number) {
    setIds(current => { const next = [...current]; [next[index], next[index + delta]] = [next[index + delta], next[index]]; return next; });
  }
  function submit(event: FormEvent) {
    event.preventDefault(); setError("");
    const next = { ...draft.pathway, title: title.trim(), courseIds: ids };
    try { parseLearningPathways([next]); onSave(next); } catch (problem) { setError(problem instanceof Error ? problem.message : String(problem)); }
  }
  return <form className="panel pathway-editor" onSubmit={submit} aria-labelledby="pathway-editor-title">
    <h2 id="pathway-editor-title">{draft.original === null ? "Create a pathway" : "Edit pathway"}</h2>
    <p className="muted small">Choose courses in the order you want to study them. You can change the sequence later.</p>
    <fieldset disabled={busy}><label className="field"><span>Pathway name</span><input ref={nameRef} className="input" value={title} onChange={event => setTitle(event.target.value)} maxLength={LEARNING_PATHWAY_LIMITS.title} required placeholder="For example, Data science" /></label>
      <div className="pathway-add-course"><label className="field"><span>Add a course</span><select className="select" value={selection} onChange={event => setSelection(event.target.value)}><option value="">Choose a course</option>{available.map(course => <option key={course.id} value={course.id}>{course.title}</option>)}</select></label><button type="button" className="btn" disabled={!selection || ids.length >= LEARNING_PATHWAY_LIMITS.courses} onClick={() => { setIds(current => [...current, selection]); setSelection(""); }}>Add course</button></div>
      {ids.length ? <ol className="pathway-editor-list">{ids.map((id, index) => { const label = options.find(course => course.id === id)?.title ?? id; return <li key={id}><span>{index + 1}. {label}</span><div className="row"><button type="button" className="btn sm" aria-label={`Move ${label} up`} disabled={index === 0} onClick={() => move(index, -1)}>↑</button><button type="button" className="btn sm" aria-label={`Move ${label} down`} disabled={index === ids.length - 1} onClick={() => move(index, 1)}>↓</button><button type="button" className="btn sm ghost" aria-label={`Remove ${label} from pathway`} onClick={() => setIds(current => current.filter(courseId => courseId !== id))}>Remove</button></div></li>; })}</ol> : <p className="muted small">Add at least one course to your pathway.</p>}
      {error && <p role="alert">{error}</p>}
      <div className="row"><button className="btn primary" type="submit" disabled={!title.trim() || !ids.length}>{busy ? "Saving…" : "Save pathway"}</button><button className="btn" type="button" onClick={onCancel}>Cancel</button></div>
    </fieldset>
  </form>;
}

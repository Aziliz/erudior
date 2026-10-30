import { useEffect, useRef, useState, type FormEvent } from "react";
import type { AppApi, View } from "../App";
import type { Course } from "../lib/types";
import { TEMPORARY_GUEST } from "../lib/guestSession";
import { registerNavigationGuard } from "../lib/navigationGuard";
import { confirmAction } from "../lib/storage";
import { STUDENT_WORKSPACE_LIMITS, parseStudentWorkspace, removeWorkspaceEntry, upsertWorkspaceEntry, type WorkspaceEntry } from "../lib/studentWorkspace";
import StudentPortfolio from "../components/StudentPortfolio";

type Kind = WorkspaceEntry["kind"];
type Link = NonNullable<WorkspaceEntry["link"]>;
type Draft = { entry: WorkspaceEntry; original: string | null };
const SECTIONS: { kind: Kind; title: string; singular: string; help: string }[] = [
  { kind: "task", title: "Daily plan", singular: "task", help: "Plan your own day. These tasks are separate from assignments set by an adult." },
  { kind: "note", title: "Notebook", singular: "note", help: "Keep ideas, observations, questions and reflections, with or without a course." },
  { kind: "reading", title: "Reading shelf", singular: "reading", help: "Track books, offline reading and installed course texts. Add an author or your place in the notes." },
  { kind: "goal", title: "Goals", singular: "goal", help: "Describe what you want to learn, your next step and how you will know you have reached it." },
  { kind: "project", title: "Projects", singular: "project", help: "Plan your own projects. Use notes for steps, materials, discoveries and reflections." },
];
const STATUS: Record<WorkspaceEntry["status"], string> = { planned: "Planned", active: "In progress", done: "Done" };
const localDay = () => { const date = new Date(); return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`; };
const linkKey = (link: Link) => JSON.stringify(link);

/** Only installed source IDs become internal routes; user text is never a URL or HTML. */
function installedLinks(courses: Course[]): { link: Link; label: string; view: View }[] {
  return courses.flatMap(course => [
    { link: { courseId: course.id, kind: "course" as const }, label: course.title, view: { name: "course" as const, courseId: course.id } },
    ...course.lessons.map(item => ({ link: { courseId: course.id, kind: "lesson" as const, sourceId: item.id }, label: `${course.title} · Lesson: ${item.title}`, view: { name: "lesson" as const, courseId: course.id, lessonId: item.id } })),
    ...(course.texts ?? []).map(item => ({ link: { courseId: course.id, kind: "reading" as const, sourceId: item.id }, label: `${course.title} · Reading: ${item.title}`, view: { name: "read" as const, courseId: course.id, textId: item.id } })),
    ...course.references.map(item => ({ link: { courseId: course.id, kind: "reference" as const, sourceId: item.id }, label: `${course.title} · Reference: ${item.title}`, view: { name: "ref" as const, courseId: course.id, refId: item.id } })),
    ...[...(course.writing ?? []), ...(course.labs ?? [])].map(item => ({ link: { courseId: course.id, kind: "work" as const, sourceId: item.id }, label: `${course.title} · Work: ${item.title}`, view: { name: "work" as const, courseId: course.id, itemId: item.id } })),
  ]);
}

export default function StudentWorkspacePage({ api }: { api: AppApi }) {
  const scope = api.student ? `student:${api.student.id}` : "independent";
  const activeScope = useRef(scope); activeScope.current = scope;
  const [kind, setKind] = useState<Kind>("task");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [day, setDay] = useState(localDay);
  const [large, setLarge] = useState(false);
  const guard = useRef(false); guard.current = draft !== null || busy;
  const editorRef = useRef<HTMLInputElement>(null);
  const addRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { setDraft(null); setError(""); setBusy(false); busyRef.current = false; setQuery(""); setFilter("all"); setKind("task"); }, [scope]);
  useEffect(() => { if (draft) editorRef.current?.focus(); }, [draft?.entry.id]);
  useEffect(() => registerNavigationGuard(() => {
    if (!guard.current) return true;
    api.toast("Save or cancel your workspace edit before leaving."); return false;
  }), [api.toast]);
  useEffect(() => {
    const beforeUnload = (event: BeforeUnloadEvent) => { if (guard.current) { event.preventDefault(); event.returnValue = ""; } };
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, []);
  let workspace: ReturnType<typeof parseStudentWorkspace> = { version: 1, entries: [] };
  let loadError = "";
  try { workspace = parseStudentWorkspace(api.progress.studentWorkspace); }
  catch (problem) { loadError = problem instanceof Error ? problem.message : String(problem); }
  const section = SECTIONS.find(item => item.kind === kind)!;
  const links = installedLinks(api.courses);
  const entries = workspace.entries.filter(entry => entry.kind === kind
    && (!query.trim() || `${entry.title}\n${entry.body}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()))
    && (filter === "all" || filter === "unfinished" && entry.status !== "done" || filter === "done" && entry.status === "done"
      || filter === "day" && entry.dueDate === day || filter === "overdue" && !!entry.dueDate && entry.dueDate < localDay() && entry.status !== "done"))
    .sort((a, b) => (a.dueDate ?? "9999").localeCompare(b.dueDate ?? "9999") || b.updatedAt.localeCompare(a.updatedAt));

  function finishEdit() { setDraft(null); setError(""); guard.current = false; queueMicrotask(() => addRef.current?.focus()); }
  function addEntry() {
    if (busyRef.current || draft) return;
    const now = new Date().toISOString();
    setError("");
    setDraft({ original: null, entry: { id: `workspace-${crypto.randomUUID()}`, kind, title: "", body: "", status: "planned", createdAt: now, updatedAt: now, ...(kind === "task" ? { dueDate: day } : {}) } });
  }
  async function saveEntry(entry: WorkspaceEntry, original: string | null) {
    if (busyRef.current) return;
    const requestedScope = scope; busyRef.current = true; setBusy(true); setError("");
    try {
      const next = { ...entry, title: entry.title.trim(), updatedAt: new Date().toISOString() };
      await api.updateStudentWorkspace(current => {
        if (activeScope.current !== requestedScope) throw Error("The learner changed. Reopen the entry before saving.");
        return upsertWorkspaceEntry(current, next, original);
      });
      if (activeScope.current === requestedScope) { finishEdit(); api.toast(TEMPORARY_GUEST ? "Workspace kept for this temporary visit only" : "Workspace saved on this device"); }
    } catch (problem) { if (activeScope.current === requestedScope) setError(problem instanceof Error ? problem.message : String(problem)); }
    finally { if (activeScope.current === requestedScope) { busyRef.current = false; setBusy(false); } }
  }
  async function deleteEntry(entry: WorkspaceEntry) {
    if (busyRef.current || draft) return;
    const requestedScope = scope; busyRef.current = true; setBusy(true); setError("");
    try {
      if (!await confirmAction(`Delete “${entry.title}” from your workspace? This cannot be undone. Course work, assignments and grades are not changed.`, "Delete workspace entry")) return;
      if (activeScope.current !== requestedScope) return;
      await api.updateStudentWorkspace(current => {
        if (activeScope.current !== requestedScope) throw Error("The learner changed. Reopen the entry before deleting.");
        return removeWorkspaceEntry(current, entry.id, JSON.stringify(entry));
      });
      if (activeScope.current === requestedScope) api.toast("Workspace entry deleted");
    } catch (problem) { if (activeScope.current === requestedScope) setError(problem instanceof Error ? problem.message : String(problem)); }
    finally { if (activeScope.current === requestedScope) { busyRef.current = false; setBusy(false); } }
  }
  async function refresh() {
    if (busyRef.current || draft) return;
    const requestedScope = scope; busyRef.current = true; setBusy(true); setError("");
    try { await api.refreshStudentWorkspace(); }
    catch (problem) { if (activeScope.current === requestedScope) setError(problem instanceof Error ? problem.message : String(problem)); }
    finally { if (activeScope.current === requestedScope) { busyRef.current = false; setBusy(false); } }
  }
  function openLink(link: Link) {
    const current = installedLinks(api.courses).find(option => linkKey(option.link) === linkKey(link));
    if (!current) { setError("This linked resource is no longer installed. Your workspace entry is kept; edit it to choose another resource."); return; }
    api.go(current.view);
  }
  function editField(change: Partial<WorkspaceEntry>) { setDraft(value => value ? { ...value, entry: { ...value.entry, ...change } } : value); }
  function submit(event: FormEvent) { event.preventDefault(); if (draft) void saveEntry(draft.entry, draft.original); }

  return <div className={`page student-workspace${large ? " student-workspace-large" : ""}`}>
    <header className="page-head"><div><p className="muted small">{api.student ? `${api.student.name}'s workspace` : "Your workspace"}</p><h1>Student dashboard and notebook</h1><p className="muted">{TEMPORARY_GUEST ? "Temporary visit: your plans and ideas stay only in this page’s memory. Refreshing or closing the page loses them. Export a backup before leaving if you want to keep them." : "Your plans and ideas, saved on this device. Works offline with installed resources."}</p></div>
      <div className="row"><button className="btn" onClick={() => api.go({ name: "progress", tools: true })}>Courses, skills and progress</button><button className="btn" disabled={busy || !!draft} onClick={() => void refresh()}>Refresh saved workspace</button></div></header>
    <p className="notice small">This is your personal workspace, not an assignment or grading system. Marking an item done does not complete lessons, award credit or change an adult's assignments.</p>
    <div className="workspace-summary" aria-label="Workspace overview">{SECTIONS.map(item => <div key={item.kind}><strong>{workspace.entries.filter(entry => entry.kind === item.kind).length}</strong><span>{item.title}</span></div>)}</div>
    <div className="workspace-options"><label><input type="checkbox" checked={large} onChange={event => setLarge(event.target.checked)} /> Larger workspace text</label><p className="small muted">Use Courses, skills and progress → Backup to back up or restore this learner's workspace.</p></div>
    <nav className="workspace-sections" aria-label="Workspace sections">{SECTIONS.map(item => <button type="button" className={`btn${kind === item.kind ? " primary" : ""}`} aria-pressed={kind === item.kind} key={item.kind} disabled={busy || !!draft} onClick={() => { setKind(item.kind); setFilter("all"); setQuery(""); setError(""); }}>{item.title}</button>)}</nav>
    {(error || loadError) && <p className="notice" role="alert">{loadError || error}{loadError && " Your data has not been replaced. Restore a valid backup or contact support."}{!loadError && draft && " Your unsaved edit is kept. If another window changed this entry, copy any text you need, cancel the edit, then refresh the saved workspace before editing again."}</p>}
    <section aria-labelledby="workspace-section-heading">
      <div className="workspace-section-heading"><div><h2 id="workspace-section-heading">{section.title}</h2><p className="muted">{section.help}</p></div><button ref={addRef} className="btn primary" disabled={busy || !!draft || !!loadError || workspace.entries.length >= STUDENT_WORKSPACE_LIMITS.entries} onClick={addEntry}>Add {section.singular}</button></div>
      {workspace.entries.length >= STUDENT_WORKSPACE_LIMITS.entries && <p className="notice">The workspace has reached {STUDENT_WORKSPACE_LIMITS.entries} entries. Back up your work, then remove entries you no longer need.</p>}
      {draft && <form className="panel workspace-editor" onSubmit={submit} aria-label={`${draft.original === null ? "Add" : "Edit"} ${section.singular}`}>
        <h3>{draft.original === null ? "Add" : "Edit"} {section.singular}</h3>
        <label>Title<input ref={editorRef} className="input" required maxLength={STUDENT_WORKSPACE_LIMITS.title} value={draft.entry.title} onChange={event => editField({ title: event.target.value })} disabled={busy} /></label>
        <label>Notes<textarea aria-label="Notes" className="input" rows={kind === "note" ? 12 : 6} maxLength={STUDENT_WORKSPACE_LIMITS.body} value={draft.entry.body} onChange={event => editField({ body: event.target.value })} disabled={busy} /></label>
        <p className="small muted">Plain text · {draft.entry.body.length.toLocaleString()} / {STUDENT_WORKSPACE_LIMITS.body.toLocaleString()} characters. Avoid storing passwords or sensitive personal information.</p>
        <div className="workspace-fields"><label>Status<select aria-label="Status" className="select" value={draft.entry.status} onChange={event => editField({ status: event.target.value as WorkspaceEntry["status"] })} disabled={busy}>{Object.entries(STATUS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          <label>Date (optional)<input type="date" className="input" min="0001-01-01" max="9999-12-31" value={draft.entry.dueDate ?? ""} disabled={busy} onChange={event => { const dueDate = event.target.value; setDraft(value => { if (!value) return value; const entry = { ...value.entry }; if (dueDate) entry.dueDate = dueDate; else delete entry.dueDate; return { ...value, entry }; }); }} /></label></div>
        <label>Link installed resource (optional)<select aria-label="Link installed resource (optional)" className="select" value={draft.entry.link ? linkKey(draft.entry.link) : ""} disabled={busy} onChange={event => setDraft(value => { if (!value) return value; const entry = { ...value.entry }; const option = links.find(item => linkKey(item.link) === event.target.value); if (option) entry.link = option.link; else delete entry.link; return { ...value, entry }; })}>
          <option value="">No link — independent entry</option>{draft.entry.link && !links.some(item => linkKey(item.link) === linkKey(draft.entry.link!)) && <option value={linkKey(draft.entry.link)}>Previously linked resource (not installed)</option>}{links.map(option => <option key={linkKey(option.link)} value={linkKey(option.link)}>{option.label}</option>)}
        </select></label>
        <div className="row"><button type="submit" className="btn primary" disabled={busy}>{busy ? "Saving…" : "Save entry"}</button><button type="button" className="btn" disabled={busy} onClick={finishEdit}>Cancel edit</button></div>
      </form>}
      <div className="workspace-filters"><label>Search workspace entries<input type="search" className="input" maxLength={160} value={query} onChange={event => setQuery(event.target.value)} /></label><label>Show entries<select aria-label="Show entries" className="select" value={filter} onChange={event => setFilter(event.target.value)}><option value="all">All</option><option value="unfinished">Unfinished</option><option value="done">Done</option><option value="day">On selected date</option><option value="overdue">Overdue and unfinished</option></select></label><label>Selected date<input type="date" className="input" min="0001-01-01" max="9999-12-31" value={day} onChange={event => setDay(event.target.value || localDay())} /></label></div>
      <p className="small muted" role="status">{entries.length} {entries.length === 1 ? "entry" : "entries"} shown</p>
      {!entries.length && <p className="panel muted">No {section.title.toLowerCase()} entries match this view. Add your own {section.singular}, or change the filters.</p>}
      <div className="workspace-entries">{entries.map(entry => { const linked = entry.link ? links.find(option => linkKey(option.link) === linkKey(entry.link!)) : undefined; return <article className="panel workspace-entry" key={entry.id} aria-label={`${section.singular}: ${entry.title}`}>
        <div className="workspace-entry-heading"><h3>{entry.title}</h3><span className={`pill ${entry.status === "done" ? "pass" : "neutral"}`}>{STATUS[entry.status]}</span></div>
        {entry.dueDate && <p className="small muted">Date: <time dateTime={entry.dueDate}>{entry.dueDate}</time>{entry.dueDate < localDay() && entry.status !== "done" && " · Overdue"}</p>}
        {entry.body && <p className="workspace-entry-body" tabIndex={entry.body.length > 1000 ? 0 : undefined} aria-label="Entry notes">{entry.body}</p>}
        {entry.link && <p className="small">{linked ? <button type="button" className="btn sm" disabled={busy || !!draft} onClick={() => openLink(entry.link!)}>Open linked resource: {linked.label}</button> : <span className="muted">Linked resource is not installed. Your entry is kept.</span>}</p>}
        <div className="row"><button className="btn sm" disabled={busy || !!draft} onClick={() => { setError(""); setDraft({ entry: structuredClone(entry), original: JSON.stringify(entry) }); }}>Edit {section.singular}</button><button className="btn sm" disabled={busy || !!draft} onClick={() => void saveEntry({ ...entry, status: entry.status === "done" ? "planned" : "done" }, JSON.stringify(entry))}>{entry.status === "done" ? "Reopen" : "Mark done"}</button><button className="btn sm ghost" disabled={busy || !!draft} onClick={() => void deleteEntry(entry)}>Delete {section.singular}</button></div>
        <p className="small muted">Updated <time dateTime={entry.updatedAt}>{new Date(entry.updatedAt).toLocaleString()}</time></p>
      </article>; })}</div>
    </section>
    {!loadError && <StudentPortfolio api={api} />}
  </div>;
}

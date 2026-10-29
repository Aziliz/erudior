import { CourseMetadataEditor } from "../components/CourseMetadataEditor";
import { validateCourseAudioFields, validateVocabAudioFields } from "../lib/courseAudio";
import { useEffect, useRef, useState } from "react";
import { registerNavigationGuard, type NavigationTarget } from "../lib/navigationGuard";
import DrillFigure from "../components/DrillFigure";
import MathText from "../components/MathText";
import type { AppApi } from "../App";
import type { Course, Drill, GlossaryEntry, Lesson, RefSheet } from "../lib/types";
import { confirmAction } from "../lib/storage";
import { drillError, generate } from "../lib/drills";
import { uid } from "../lib/util";
import Markdown from "../components/Markdown";
import CourseBranchingEditor from "../components/CourseBranchingEditor";
import CourseAdvancedAssessmentEditor from "../components/CourseAdvancedAssessmentEditor";
import CourseScientificEditor from "../components/CourseScientificEditor";
import CourseSpreadsheetEditor from "../components/CourseSpreadsheetEditor";
import { spreadsheetReviewReport } from "../lib/spreadsheetReview";
import ReaderLibraryEditor from "../components/ReaderLibraryEditor";
import { validateReaderTexts } from "../lib/readerContent";
import WorkResourceEditor from "../components/WorkResourceEditor";
import { workProblems } from "../lib/work";
import { validateCourseWork, validateWorkLessonReferences } from "../lib/courseWork";
import SpreadsheetReviewPanel from "../components/SpreadsheetReviewPanel";

type Tab = "metadata" | "details" | "lessons" | "glossary" | "reference" | "drills" | "branching" | "scientific" | "advanced" | "spreadsheets" | "spreadsheetReview" | "work" | "reading";

export default function CourseEditor({ api, course, isNew, communityMode = false }: { api: AppApi; course: Course; isNew?: boolean; communityMode?: boolean }) {
  const [draft, setDraft] = useState<Course>(() => structuredClone(course));
  const [assignmentEditing, setAssignmentEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const savingRef = useRef(false);
  const draftVersion = useRef(0);
  const persistedVersion = useRef(0);
  const editingRef = useRef(false);
  const uploadPending = useRef(false);
  const closingRef = useRef(false);
  const discardTarget = useRef<NavigationTarget | null>(null);
  const hasPendingChanges = () => savingRef.current || editingRef.current || uploadPending.current || draftVersion.current !== persistedVersion.current;
  useEffect(() => {
    const unregister = registerNavigationGuard((kind, target) => {
      if (kind === "app" && target && discardTarget.current?.name === target.name && discardTarget.current.courseId === target.courseId) return true;
      if (!hasPendingChanges()) return true;
      api.toast("Save your course, or use Done to explicitly discard changes before leaving.");
      return false;
    });
    const beforeUnload = (event: BeforeUnloadEvent) => {
      if (hasPendingChanges()) { event.preventDefault(); event.returnValue = ""; }
    };
    window.addEventListener("beforeunload", beforeUnload);
    return () => { unregister(); window.removeEventListener("beforeunload", beforeUnload); };
  }, [api.toast]);
  const [dirty, setDirty] = useState(false);
  const [tab, setTab] = useState<Tab>("details");
  const update = (fn: (c: Course) => Course) => {
    draftVersion.current += 1;
    setDraft(fn);
    setDirty(true);
  };

  async function save() {
    if (savingRef.current) return;
    if (uploadPending.current) return api.toast("Finish or cancel the audio upload before saving.");
    if (assignmentEditing) return api.toast("Apply or cancel assignment changes before saving the course.");
    if (!draft.title.trim()) {
      setTab("details");
      return api.toast("Give the course a title.");
    }
    const audioErrors = [...validateCourseAudioFields(draft, "course", { mode: "source" }), ...(draft.vocab ?? []).flatMap((word, index) => validateVocabAudioFields(word, `vocabulary[${index}]`, { mode: "source" }))];
    if (audioErrors.length) { setTab("metadata"); return api.toast("Fix audio metadata before saving: " + audioErrors.join("; ")); }
    const bad = draft.drills.map((d) => drillError(d)).filter(Boolean);
    if (bad.length) {
      setTab("drills");
      return api.toast(`${bad.length} math drill${bad.length === 1 ? " has" : "s have"} errors.`);
    }
    if (draft.spreadsheetAssignments?.length) {
      const report = spreadsheetReviewReport(draft);
      if (!report.readyForHumanReview) { setTab("spreadsheets"); return api.toast("Fix spreadsheet assignment errors before saving: " + report.issues.join("; ")); }
    }
    const workErrors = [...validateCourseWork(draft, { strict: !communityMode, moduleIds: draft.modules.map(module => module.id) }), ...(communityMode ? validateWorkLessonReferences(draft, draft.lessons) : workProblems(draft))];
    if (workErrors.length) { setTab("work"); return api.toast("Fix work resource errors before saving: " + workErrors.join("; ")); }
    const latest = api.courses.find((c) => c.id === course.id) ?? course;
    const readingErrors = validateReaderTexts(draft.texts ?? [], { strict: !communityMode, questionIds: latest.banks[0]?.questions.map(question => question.id) ?? [] });
    if (readingErrors.length) { setTab("reading"); return api.toast("Fix reading library errors before saving: " + readingErrors.join("; ")); }
    // Banks and decks are edited in their own editors; keep whatever is stored now.
    const savedVersion = draftVersion.current;
    savingRef.current = true;
    setSaving(true);
    try {
      await api.saveCourse({ ...draft, banks: latest.banks, decks: latest.decks });
      persistedVersion.current = savedVersion;
      if (draftVersion.current === savedVersion) {
        setDirty(false);
        api.toast("Course saved");
      } else {
        api.toast("Earlier changes saved. Newer edits still need saving.");
      }
    } catch { api.toast("Course could not be saved. Your draft is still open."); }
    finally { savingRef.current = false; setSaving(false); }
  }

  async function close() {
    if (uploadPending.current) return api.toast("Finish or cancel the audio upload before leaving.");
    if (savingRef.current) return api.toast("Wait for the current save to finish before leaving the editor.");
    if (closingRef.current) return;
    closingRef.current = true;
    try {
      const version = draftVersion.current;
      const editing = editingRef.current;
      if (hasPendingChanges() && !(await confirmAction("Discard unsaved changes to this course?", "Unsaved changes"))) return;
      if (savingRef.current || version !== draftVersion.current || editing !== editingRef.current) {
        api.toast("The draft changed while confirming. Finish your changes before leaving.");
        return;
      }
      const target = { name: "course" as const, courseId: course.id };
      discardTarget.current = target;
      try { api.go(target); } finally { discardTarget.current = null; }
    } finally { closingRef.current = false; }
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        save();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div className="editor-main" style={{ height: "100%" }}>
      <div className="editor-bar">
        <button className="btn ghost sm" onClick={close}>
          ← Done
        </button>
        <strong>{draft.title || "Untitled course"}</strong>
        {dirty && (
          <span className="small muted row" style={{ gap: 6 }}>
            <span className="dirty-dot" /> Unsaved changes
          </span>
        )}
        <div className="spacer" />
        <span className="kbd">Ctrl+S</span>
        <button className="btn primary" onClick={save} disabled={!dirty || saving || assignmentEditing}>
          Save course
        </button>
      </div>
      <div className="inner">
        {isNew && tab === "details" && (
          <p className="notice" style={{ marginBottom: 16 }}>
            Name your course, then add lessons here. Question banks and notecard decks are added from the course page.
          </p>
        )}
        <nav className="tabs" aria-label="Course editor sections">
          {(
            [
              ["details", "Details"],
              ["metadata", "Metadata & audio"],
              ["lessons", `Lessons (${draft.lessons.length})`],
              ["glossary", `Glossary (${draft.glossary.length})`],
              ["reference", `Quick reference (${draft.references.length})`],
              ["drills", `Math drills (${draft.drills.length})`],
              ["reading", "Reading library"],
              ["work", "Writing, labs & activities"],
              ["branching", `Scenarios (${draft.branchingScenarios?.length ?? 0})`],
              ["scientific", `Science (${draft.scientificWorkspaces?.length ?? 0})`],
              ["advanced", `Assessment (${draft.advancedAssessments?.length ?? 0})`],
              ["spreadsheets", `Spreadsheets (${draft.spreadsheetAssignments?.length ?? 0})`],
              ...(!communityMode && draft.spreadsheetAssignments?.length ? [["spreadsheetReview", "Spreadsheet review"] as [Tab,string]] : []),
            ] as [Tab, string][]
          ).map(([id, label]) => (
            <button key={id} aria-current={tab === id ? "page" : undefined} onClick={() => { if ((assignmentEditing || uploadPending.current) && id !== tab) api.toast("Apply or cancel assignment changes before changing sections."); else setTab(id); }}>
              {label}
            </button>
          ))}
        </nav>
        {tab === "metadata" && <CourseMetadataEditor onPendingChange={value=>{uploadPending.current=value;}} key={draft.id} course={draft} onChange={next => update(() => next)} />}
        {tab === "details" && <Details draft={draft} update={update} />}
        {tab === "lessons" && <Lessons draft={draft} update={update} />}
        {tab === "glossary" && <Glossary draft={draft} update={update} />}
        {tab === "reference" && <References draft={draft} update={update} />}
        {tab === "drills" && <Drills draft={draft} update={update} />}
        {tab === "reading" && <ReaderLibraryEditor texts={draft.texts ?? []} questions={(api.courses.find(c => c.id === course.id) ?? course).banks[0]?.questions ?? []} onChange={texts => update(c => ({ ...c, texts }))} protectedTextIds={(draft.texts ?? []).filter(text => !!api.progress?.reading?.[course.id + "/" + text.id]).map(text => text.id)} protectedSectionIds={Object.fromEntries((draft.texts ?? []).map(text => { const reading = api.progress?.reading?.[course.id + "/" + text.id]; return [text.id, reading ? [...Object.keys(reading.read), reading.section] : []]; }))} />}
        {tab === "work" && <WorkResourceEditor work={{ rubrics: draft.rubrics, writing: draft.writing, labs: draft.labs, activityLog: draft.activityLog }} modules={draft.modules} lessons={draft.lessons} onChange={next => update(c => { const result = { ...c }; for (const field of ["rubrics", "writing", "labs", "activityLog"] as const) delete result[field]; return { ...result, ...next }; })} onLessonBodyChange={(id, body) => update(c => ({ ...c, lessons: c.lessons.map(lesson => lesson.id === id ? { ...lesson, body } : lesson) }))} />}
        {tab === "branching" && <CourseBranchingEditor course={draft} update={update} onEditingChange={value=>{editingRef.current=value;setAssignmentEditing(value);}} />}
        {tab === "scientific" && <CourseScientificEditor course={draft} update={update} onEditingChange={value=>{editingRef.current=value;setAssignmentEditing(value);}} />}
        {tab === "advanced" && <CourseAdvancedAssessmentEditor course={draft} update={update} onEditingChange={value=>{editingRef.current=value;setAssignmentEditing(value);}} />}
        {tab === "spreadsheets" && <CourseSpreadsheetEditor course={draft} update={update} onEditingChange={(value) => { editingRef.current = value; setAssignmentEditing(value); }} />}
        {!communityMode && tab === "spreadsheetReview" && <SpreadsheetReviewPanel course={draft} />}
      </div>
    </div>
  );
}

type EP = { draft: Course; update: (fn: (c: Course) => Course) => void };

function Details({ draft, update }: EP) {
  return (
    <div className="stack">
      <label className="field">
        <span>Title</span>
        <input className="input" value={draft.title} onChange={(e) => update((c) => ({ ...c, title: e.target.value }))} />
      </label>
      <label className="field">
        <span>Description</span>
        <textarea
          className="textarea"
          rows={3}
          value={draft.description ?? ""}
          onChange={(e) => update((c) => ({ ...c, description: e.target.value || undefined }))}
        />
      </label>
      <label className="field">
        <span>Author</span>
        <input
          className="input"
          value={draft.author ?? ""}
          onChange={(e) => update((c) => ({ ...c, author: e.target.value || undefined }))}
        />
      </label>
      <div className="panel">
        <div className="panel-head">
          <h3>Modules</h3>
          <button
            className="btn sm"
            onClick={() =>
              update((c) => ({ ...c, modules: [...c.modules, { id: `m-${uid()}`, title: `Module ${c.modules.length + 1}` }] }))
            }
          >
            Add module
          </button>
        </div>
        {draft.modules.map((m, i) => (
          <div key={m.id} className="row" style={{ flexWrap: "nowrap", marginBottom: 8 }}>
            <span className="faint num" style={{ width: 24 }}>
              {i + 1}.
            </span>
            <input
              className="input"
              value={m.title}
              onChange={(e) =>
                update((c) => ({ ...c, modules: c.modules.map((x) => (x.id === m.id ? { ...x, title: e.target.value } : x)) }))
              }
            />
            <button
              className="btn sm ghost"
              disabled={i === 0}
              aria-label="Move up"
              onClick={() =>
                update((c) => {
                  const ms = c.modules.slice();
                  [ms[i - 1], ms[i]] = [ms[i], ms[i - 1]];
                  return { ...c, modules: ms };
                })
              }
            >
              ↑
            </button>
            <button
              className="btn sm ghost danger"
              disabled={draft.lessons.some((l) => l.module === m.id) || [...(draft.writing ?? []), ...(draft.labs ?? [])].some(item => item.module === m.id)}
              title="Move or delete linked lessons and work resources first"
              onClick={() => update((c) => c.lessons.some(l => l.module === m.id) || [...(c.writing ?? []), ...(c.labs ?? [])].some(item => item.module === m.id) ? c : ({ ...c, modules: c.modules.filter((x) => x.id !== m.id) }))}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Generic two-pane list editor used by lessons and reference sheets. */
function useSelection<T extends { id: string }>(items: T[]) {
  const [sel, setSel] = useState<string | null>(items[0]?.id ?? null);
  const current = items.find((x) => x.id === sel) ?? null;
  return { sel, setSel, current };
}

function Lessons({ draft, update }: EP) {
  const { setSel, current } = useSelection(draft.lessons);
  const [preview, setPreview] = useState(false);
  const setLesson = (id: string, patch: Partial<Lesson>) =>
    update((c) => ({ ...c, lessons: c.lessons.map((l) => (l.id === id ? { ...l, ...patch } : l)) }));

  function add() {
    const l: Lesson = {
      id: `l-${uid()}`,
      module: current?.module ?? draft.modules[0]?.id ?? "m1",
      title: "New lesson",
      topics: [],
      body: "",
    };
    update((c) => ({
      ...c,
      modules: c.modules.length ? c.modules : [{ id: l.module, title: "Module 1" }],
      lessons: [...c.lessons, l],
    }));
    setSel(l.id);
  }

  return (
    <div className="split">
      <div className="split-list">
        <button className="btn sm primary" onClick={add} style={{ marginBottom: 8 }}>
          Add lesson
        </button>
        {draft.modules.map((m) => (
          <div key={m.id}>
            <div className="split-group">{m.title}</div>
            {draft.lessons
              .filter((l) => l.module === m.id)
              .map((l) => (
                <button key={l.id} className="q-item" aria-current={current?.id === l.id} onClick={() => setSel(l.id)}>
                  <span className="t">{l.title}</span>
                </button>
              ))}
          </div>
        ))}
      </div>
      <div className="split-main">
        {!current ? (
          <p className="muted">Add a lesson to start writing.</p>
        ) : (
          <div className="stack">
            <div className="form-grid" style={{ gridTemplateColumns: "2fr 1fr 100px", marginBottom: 0 }}>
              <label className="field">
                <span>Title</span>
                <input className="input" value={current.title} onChange={(e) => setLesson(current.id, { title: e.target.value })} />
              </label>
              <label className="field">
                <span>Module</span>
                <select className="select" value={current.module} onChange={(e) => setLesson(current.id, { module: e.target.value })}>
                  {draft.modules.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.title}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>Minutes</span>
                <input
                  className="input num"
                  type="number"
                  min={0}
                  value={current.minutes ?? ""}
                  onChange={(e) => setLesson(current.id, { minutes: Number(e.target.value) || undefined })}
                />
              </label>
            </div>
            <label className="field">
              <span>Topics (comma-separated; links the lesson to matching questions and notecards)</span>
              <input
                className="input"
                value={(current.topics ?? []).join(", ")}
                onChange={(e) =>
                  setLesson(current.id, {
                    topics: e.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean),
                  })
                }
              />
            </label>
            <div className="field">
              <span className="row" style={{ justifyContent: "space-between" }}>
                Lesson text (Markdown; [[term]] links to the glossary)
                <span className="seg">
                  <button aria-pressed={!preview} onClick={() => setPreview(false)}>
                    Write
                  </button>
                  <button aria-pressed={preview} onClick={() => setPreview(true)}>
                    Preview
                  </button>
                </span>
              </span>
              {preview ? (
                <div className="panel">
                  <Markdown source={current.body} glossary={draft.glossary} />
                </div>
              ) : (
                <textarea
                  className="textarea mono"
                  rows={24}
                  value={current.body}
                  onChange={(e) => setLesson(current.id, { body: e.target.value })}
                />
              )}
            </div>
            <div>
              <button
                className="btn sm ghost danger"
                disabled={(draft.spreadsheetAssignments?.some(item => item.lessonId === current.id) || draft.branchingScenarios?.some(item=>item.lessonId===current.id) || draft.scientificWorkspaces?.some(item=>item.lessonId===current.id) || draft.advancedAssessments?.some(item=>item.lessonId===current.id))}
                title="Detach lesson-linked workspaces and assignments before deleting"
                onClick={() => {
                  if ((draft.spreadsheetAssignments?.some(item => item.lessonId === current.id) || draft.branchingScenarios?.some(item=>item.lessonId===current.id) || draft.scientificWorkspaces?.some(item=>item.lessonId===current.id) || draft.advancedAssessments?.some(item=>item.lessonId===current.id))) return;
                  update((c) => ({ ...c, lessons: c.lessons.filter((l) => l.id !== current.id) }));
                  setSel(null);
                }}
              >
                Delete lesson
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function References({ draft, update }: EP) {
  const { setSel, current } = useSelection(draft.references);
  const [preview, setPreview] = useState(false);
  const setRef = (id: string, patch: Partial<RefSheet>) =>
    update((c) => ({ ...c, references: c.references.map((r) => (r.id === id ? { ...r, ...patch } : r)) }));
  return (
    <div className="split">
      <div className="split-list">
        <button
          className="btn sm primary"
          style={{ marginBottom: 8 }}
          onClick={() => {
            const r: RefSheet = { id: `r-${uid()}`, title: "New sheet", body: "" };
            update((c) => ({ ...c, references: [...c.references, r] }));
            setSel(r.id);
          }}
        >
          Add sheet
        </button>
        {draft.references.map((r) => (
          <button key={r.id} className="q-item" aria-current={current?.id === r.id} onClick={() => setSel(r.id)}>
            <span className="t">{r.title}</span>
          </button>
        ))}
      </div>
      <div className="split-main">
        {current ? (
          <div className="stack">
            <label className="field">
              <span>Title</span>
              <input className="input" value={current.title} onChange={(e) => setRef(current.id, { title: e.target.value })} />
            </label>
            <div className="field">
              <span className="row" style={{ justifyContent: "space-between" }}>
                Content (Markdown, tables welcome)
                <span className="seg">
                  <button aria-pressed={!preview} onClick={() => setPreview(false)}>
                    Write
                  </button>
                  <button aria-pressed={preview} onClick={() => setPreview(true)}>
                    Preview
                  </button>
                </span>
              </span>
              {preview ? (
                <div className="panel">
                  <Markdown source={current.body} glossary={draft.glossary} />
                </div>
              ) : (
                <textarea
                  className="textarea mono"
                  rows={24}
                  value={current.body}
                  onChange={(e) => setRef(current.id, { body: e.target.value })}
                />
              )}
            </div>
            <div>
              <button
                className="btn sm ghost danger"
                onClick={() => {
                  update((c) => ({ ...c, references: c.references.filter((r) => r.id !== current.id) }));
                  setSel(null);
                }}
              >
                Delete sheet
              </button>
            </div>
          </div>
        ) : (
          <p className="muted">Add a sheet for formulas, deadlines or anything you want on one page.</p>
        )}
      </div>
    </div>
  );
}

function Glossary({ draft, update }: EP) {
  const [q, setQ] = useState("");
  const set = (i: number, patch: Partial<GlossaryEntry>) =>
    update((c) => ({ ...c, glossary: c.glossary.map((g, j) => (j === i ? { ...g, ...patch } : g)) }));
  const s = q.trim().toLowerCase();
  return (
    <div className="stack">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <input className="input" style={{ maxWidth: 320 }} placeholder="Search terms" value={q} onChange={(e) => setQ(e.target.value)} />
        <button
          className="btn primary sm"
          onClick={() => {
            update((c) => ({ ...c, glossary: [{ term: "", definition: "" }, ...c.glossary] }));
            setQ("");
          }}
        >
          Add term
        </button>
      </div>
      <div className="panel">
        {draft.glossary.map((g, i) =>
          s && !g.term.toLowerCase().includes(s) ? null : (
            <div key={i} className="gl-edit">
              <input className="input" placeholder="Term" value={g.term} onChange={(e) => set(i, { term: e.target.value })} />
              <textarea
                className="textarea"
                style={{ minHeight: 44 }}
                rows={2}
                placeholder="Definition"
                value={g.definition}
                onChange={(e) => set(i, { definition: e.target.value })}
              />
              <input
                className="input"
                placeholder="Also called (comma-separated)"
                value={(g.aliases ?? []).join(", ")}
                onChange={(e) =>
                  set(i, {
                    aliases: e.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean),
                  })
                }
              />
              <button
                className="btn sm ghost danger"
                onClick={() => update((c) => ({ ...c, glossary: c.glossary.filter((_, j) => j !== i) }))}
              >
                Remove
              </button>
            </div>
          ),
        )}
        {draft.glossary.length === 0 && <p className="muted small">No terms yet.</p>}
      </div>
      <p className="faint small">Terms with an empty definition are dropped when the course is saved.</p>
    </div>
  );
}

const DRILL_TEMPLATE: Drill = {
  id: "",
  title: "Commission split",
  topic: "Math",
  vars: { price: { min: 250000, max: 900000, step: 5000 }, rate: { choices: [5, 5.5, 6] } },
  calc: { total: "price * rate / 100", half: "total / 2" },
  prompt: "A home sells for {price:money0} at a {rate}% commission, split evenly between the two brokerages. How much does the listing brokerage receive?",
  answer: "half",
  format: "money",
  solution: "{price:money0} × {rate}% = {total:money}. Half of that is **{half:money}**.",
};

function Drills({ draft, update }: EP) {
  const { setSel, current } = useSelection(draft.drills);
  const [text, setText] = useState("");
  const [parseErr, setParseErr] = useState<string | null>(null);

  useEffect(() => {
    if (current) {
      const { id: _id, ...rest } = current;
      setText(JSON.stringify(rest, null, 2));
      setParseErr(null);
    }
    // Only reload the text when switching drills.
  }, [current?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  function apply(t: string) {
    setText(t);
    if (!current) return;
    try {
      const obj = JSON.parse(t) as Omit<Drill, "id">;
      const d = { ...obj, id: current.id } as Drill;
      const err = drillError(d);
      setParseErr(err);
      update((c) => ({ ...c, drills: c.drills.map((x) => (x.id === current.id ? d : x)) }));
    } catch (e) {
      setParseErr(`Not valid JSON yet: ${(e as Error).message}`);
    }
  }

  let sample: ReturnType<typeof generate> | null = null;
  if (current && !parseErr) {
    try {
      sample = generate(current);
    } catch {
      sample = null;
    }
  }

  return (
    <div className="split">
      <div className="split-list">
        <button
          className="btn sm primary"
          style={{ marginBottom: 8 }}
          onClick={() => {
            const d = { ...DRILL_TEMPLATE, id: `x-${uid()}` };
            update((c) => ({ ...c, drills: [...c.drills, d] }));
            setSel(d.id);
          }}
        >
          Add drill
        </button>
        {draft.drills.map((d) => (
          <button key={d.id} className="q-item" aria-current={current?.id === d.id} onClick={() => setSel(d.id)}>
            <span className="t">{d.title}</span>
            <span className={`m ${drillError(d) ? "err" : ""}`}>{drillError(d) ? "Has errors" : d.topic}</span>
          </button>
        ))}
      </div>
      <div className="split-main">
        {current ? (
          <div className="stack">
            <p className="small muted">
              Drills are templates: <code>vars</code> are random inputs, <code>calc</code> derives values in order, and{" "}
              <code>{"{name:format}"}</code> fills them into the prompt and solution. Optional: <code>funcs</code> (f(x) to use
              with deriv/integ/solve/limit), <code>where</code> (re-roll rules), <code>answers</code> (multi-part, fraction,
              expression, units, sig figs) and <code>figure</code> (graphs and diagrams). Write math as $…$. See
              docs/COURSE_FORMAT.md.
            </p>
            <textarea className="textarea mono" rows={22} value={text} onChange={(e) => apply(e.target.value)} spellCheck={false} />
            {parseErr && <p className="notice error">{parseErr}</p>}
            {sample && (
              <div className="panel">
                <h3 style={{ marginBottom: 8 }}>Sample</h3>
                <Markdown source={sample.prompt} />
                <DrillFigure inst={sample} />
                <p className="small muted" style={{ marginTop: 8 }}>
                  Answer: <MathText text={sample.parts.map((x) => x.display).join("; ")} />
                </p>
                <p className="small muted" style={{ marginTop: 8 }}>
                  Solution:
                </p>
                <Markdown source={sample.solution} />
              </div>
            )}
            <div>
              <button
                className="btn sm ghost danger"
                onClick={() => {
                  update((c) => ({ ...c, drills: c.drills.filter((d) => d.id !== current.id) }));
                  setSel(null);
                }}
              >
                Delete drill
              </button>
            </div>
          </div>
        ) : (
          <p className="muted">Add a drill to make a math problem generator.</p>
        )}
      </div>
    </div>
  );
}

// Block editor for community courses (website only). Saves the draft as you type; Publish
// checks it and makes a new public version, tagged Not reviewed until a reviewer looks.

import { useEffect, useRef, useState } from "react";
import type { AppApi } from "../App";
import CanonicalCommunityEditor from "./CanonicalCommunityEditor";
import { confirmAction } from "../lib/storage";
import ReaderLibraryEditor from "../components/ReaderLibraryEditor";
import WorkResourceEditor from "../components/WorkResourceEditor";
import { validateCourseWork, type CourseWork } from "../lib/courseWork";
import CourseBranchingEditor from "../components/CourseBranchingEditor";
import CourseScientificEditor from "../components/CourseScientificEditor";
import CourseSpreadsheetEditor from "../components/CourseSpreadsheetEditor";
import { registerNavigationGuard } from "../lib/navigationGuard";
import type { Course } from "../lib/types";
import Markdown from "../components/Markdown";
import { ReviewPill } from "../components/CommunityCatalog";
import { API, api as community, imageUrl, type Editors, type Review } from "../lib/community";
import { CALCULATORS, LEVELS, LIMITS, SUBJECTS, TYPES, checkDoc, migrateCommunityDocToCanonical, communityReaderQuestions, checkCommunityReaderTexts, checkCommunitySpreadsheetAssignments, readFigure, toCourse, upgradeDoc, type Block, type CalcChoice, type CommunityDoc } from "../lib/communityFormat";
import { calculatorForSubject } from "../lib/taxonomy";
import { renderFigure } from "../lib/figure";
import { readSpec } from "../lib/manip";
import { ModelStartFields } from "../components/ManipEditor";
import { LessonManipulative } from "../components/Manipulative";
import { Drills, Glossary, Language, Modules, References, newId } from "./CommunityTabs";
import { ImagePicker, QuestionEditor, Q_KIND_LABEL, newQuestion } from "./CommunityQuestion";

type Save = "saved" | "saving" | "unsaved" | "error";
type Tab = "about" | "modules" | "lessons" | "cards" | "glossary" | "refs" | "drills" | "language" | "branching" | "scientific" | "spreadsheets" | "work" | "reader" | "publish";

const BLOCK_LABEL: Record<Block["type"], string> = {
  assignment: "Assessed work link",
  heading: "Heading",
  text: "Text",
  list: "List",
  image: "Image",
  question: "Question",
  callout: "Tip or rule box",
  example: "Worked example",
  math: "Formula",
  figure: "Graph or drawing",
  diagram: "Diagram",
  manipulative: "Math model to play with",
};
const ADDABLE: Block["type"][] = ["heading", "text", "list", "example", "callout", "math", "image", "figure", "diagram", "manipulative", "question"];

const CALC_LABEL: Record<CalcChoice, string> = { basic: "Basic", scientific: "Scientific", graphing: "Graphing", none: "No calculator" };

export default function CommunityEditor({ api, id }: { api: AppApi; id: string }) {
  return <CommunityEditorSession key={id} api={api} id={id} />;
}

/** A projection for the shared authoring UI, never a replacement for CommunityDoc. */
function spreadsheetCourse(doc: CommunityDoc, id: string): Course {
  const modules = doc.modules?.length ? doc.modules : [{ id: "m1", title: doc.title }];
  return {
    format: "examiner-course", version: 1, id, title: doc.title,
    modules: modules.map(m => ({ id: m.id, title: m.title })),
    lessons: doc.lessons.map(l => ({ id: l.id, module: l.module ?? modules[0].id, title: l.title, body: "" })),
    banks: [], decks: [], glossary: [], references: [], drills: [],
    branchingScenarios: structuredClone(doc.branchingScenarios ?? []),
    scientificWorkspaces: structuredClone(doc.scientificWorkspaces ?? []),
    spreadsheetAssignments: structuredClone(doc.spreadsheetAssignments ?? []),
  };
}

function CommunityEditorSession({ api, id }: { api: AppApi; id: string }) {
  const [doc, setDoc] = useState<CommunityDoc | null>(null);
  const [meta, setMeta] = useState<{ status: string; version: number; review: Review; reviewNote: string | null; role?: string } | null>(null);
  const [save, setSave] = useState<Save>("saved");
  const [saveError, setSaveError] = useState("");
  const [tab, setTab] = useState<Tab>("about");
  const [lessonIx, setLessonIx] = useState(0);
  const [loadError, setLoadError] = useState("");
  const timer = useRef<number>(undefined);
  const latest = useRef<CommunityDoc | null>(null);
  const persisted = useRef<CommunityDoc | null>(null);
  const inFlight = useRef<Promise<boolean> | null>(null);
  const assignmentEditing = useRef(false);
  const [pendingAssignment, setPendingAssignment] = useState(false);
  const publicationBusy = useRef(false);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    community.draft(id).then(
      (d) => {
        if (cancelled) return;
        const upgraded = upgradeDoc(d.doc);
        setDoc(upgraded);
        latest.current = upgraded;
        persisted.current = upgraded;
        setMeta({ status: d.status, version: d.version, review: d.review, reviewNote: d.reviewNote, role: d.role });
      },
      (e) => { if (!cancelled) setLoadError((e as Error).message); },
    );
    return () => { cancelled = true; };
  }, [id]);

  // One writer per editor session. A save that completes after newer edits cannot
  // mark those edits clean or overwrite a newer save with an older snapshot.
  const flush = (): Promise<boolean> => {
    window.clearTimeout(timer.current);
    if (assignmentEditing.current) {
      setSaveError("Apply or cancel assignment changes before saving.");
      return Promise.resolve(false);
    }
    if (inFlight.current) return inFlight.current;
    const task = (async () => {
      while (latest.current && latest.current !== persisted.current) {
        if (assignmentEditing.current) return false;
        const snapshot = latest.current;
        setSave("saving");
        try {
          await community.save(id, snapshot);
          persisted.current = snapshot;
          setSave(latest.current === snapshot ? "saved" : "unsaved");
          setSaveError("");
        } catch (e) {
          setSave("error");
          setSaveError((e as Error).message);
          return false;
        }
      }
      return !assignmentEditing.current;
    })();
    inFlight.current = task;
    void task.finally(() => { if (inFlight.current === task) inFlight.current = null; });
    return task;
  };

  const update = (fn: (d: CommunityDoc) => CommunityDoc) => {
    if (!latest.current || publicationBusy.current) return;
    const next = fn(latest.current);
    const previousQuestionIds = new Set(communityReaderQuestions(latest.current).map(q => q.id));
    const nextQuestionIds = new Set(communityReaderQuestions(next).map(q => q.id));
    if (next.texts?.some(text => text.sections.some(section => section.questions?.some(id => previousQuestionIds.has(id) && !nextQuestionIds.has(id))))) {
      api.toast("Unlink reading questions from the library before deleting their question, lesson, or module."); return;
    }
    const moduleIds = new Set((next.modules ?? []).map(m => m.id));
    if ([...(next.writing ?? []), ...(next.labs ?? [])].some(resource => resource.module && !moduleIds.has(resource.module))) {
      api.toast("Move assessed work to another module before deleting its module."); return;
    }
    latest.current = next;
    setDoc(next);
    setSave("unsaved");
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => void flush(), 1200);
  };
  function editingChanged(editing: boolean) {
    assignmentEditing.current = editing;
    setPendingAssignment(editing);
    window.clearTimeout(timer.current);
    if (!editing) {
      setSaveError("");
      if (latest.current !== persisted.current) timer.current = window.setTimeout(() => void flush(), 1200);
    }
  }
  function canNavigate() {
    if (assignmentEditing.current) { api.toast("Apply or cancel assignment changes before leaving this section."); return false; }
    if (publicationBusy.current) { api.toast("Wait for publication to finish before leaving the editor."); return false; }
    return true;
  }
  useEffect(() => registerNavigationGuard(() => {
    if (assignmentEditing.current) { api.toast("Apply or cancel assignment changes before navigating away."); return false; }
    if (publicationBusy.current) { api.toast("Wait for publication to finish before navigating away."); return false; }
    if (inFlight.current || latest.current !== persisted.current) { api.toast("Save the draft and wait for saving to finish before navigating away."); return false; }
    return true;
  }), [api.toast]);

  useEffect(() => {
    const beforeUnload = (event: BeforeUnloadEvent) => {
      if (assignmentEditing.current || inFlight.current || latest.current !== persisted.current || publicationBusy.current) {
        event.preventDefault(); event.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", beforeUnload);
    return () => { window.removeEventListener("beforeunload", beforeUnload); window.clearTimeout(timer.current); void flush(); };
  }, []); // Session is keyed by id; cleanup never writes a new document to an old id.

  if (loadError)
    return (
      <div className="page">
        <h1>Edit course</h1>
        <p className="notice error">{loadError}</p>
      </div>
    );
  if (!doc || !meta) return <div className="page muted">Loading…</div>;
  const readOnly = meta.status === "removed";

  if (doc.canonical) return <CanonicalCommunityEditor api={api} id={id} initialDoc={doc} initialMeta={meta} />;
  return (
    <div className="page community-editor">
      <button className="back" onClick={async () => { if (canNavigate() && await flush() && canNavigate()) api.go({ name: "create" }); }}>
        ← Your courses
      </button>
      <div className="page-head">
        <div>
          <h1>{doc.title || "Untitled course"}</h1>
          <p className="small muted">
            {meta.version > 0 ? `Published version ${meta.version}` : "Not published yet"}
            {meta.status === "published" && (
              <>
                {" · "}
                <ReviewPill review={meta.review} />
              </>
            )}
            {meta.status === "unpublished" && " · unpublished"}
          </p>
        </div>
        <p className="small muted save-state" role="status">
          {pendingAssignment ? "Unapplied assignment changes" : save === "saved" ? "All changes saved" : save === "saving" ? "Saving…" : save === "unsaved" ? "Unsaved changes" : `Not saved: ${saveError}`}
        </p>
        <button type="button" className="btn sm" disabled={readOnly || pendingAssignment || publishing || save === "saving"} onClick={async () => {
          if (!(await confirmAction("Migrate this draft to the full canonical editor? This is one-way for this draft; existing published versions remain unchanged. All authored lesson blocks and resources will be converted to their existing app representation."))) return;
          if (publicationBusy.current || !(await flush()) || !latest.current) return;
          publicationBusy.current = true; setPublishing(true);
          try {
            const canonicalDoc = migrateCommunityDocToCanonical(latest.current, id, imageUrl, API || undefined);
            await community.save(id, canonicalDoc);
            latest.current = canonicalDoc; persisted.current = canonicalDoc; setDoc(canonicalDoc); setSave("saved");
          } catch (error) { api.toast((error as Error).message); }
          finally { publicationBusy.current = false; setPublishing(false); }
        }}>Migrate to full canonical editor</button>
        <button type="button" className="btn sm" disabled={readOnly || pendingAssignment || publishing || save === "saving"} onClick={() => void flush()}>Save draft</button>
      </div>
      {readOnly && <p className="notice error">A reviewer took this course down: {meta.reviewNote}. It can't be edited or published again unless they restore it.</p>}
      {meta.reviewNote && !readOnly && <p className="notice">Reviewer's note: {meta.reviewNote}</p>}
      <p className="notice small" style={{ marginBottom: 16 }}>
        Don't put personal information in a course: no students' names, photos of students, addresses or phone numbers.
      </p>

      <nav className="tabs" aria-label="Course editor sections">
        {(
          [
            ["about", "About"],
            ["modules", `Modules (${doc.modules?.length || 1})`],
            ["lessons", `Lessons (${doc.lessons.length})`],
            ["cards", `Notecards (${doc.decks.reduce((s, k) => s + k.cards.length, 0)})`],
            ["glossary", `Glossary (${doc.glossary?.length ?? 0})`],
            ["refs", `Reference sheets (${doc.references?.length ?? 0})`],
            ["drills", `Drills (${doc.drills?.length ?? 0})`],
            ["language", "Language and reading"],
            ["reader", `Reading library (${doc.texts?.length ?? 0})`],
            ["work", "Writing, labs and activities"],
            ["branching", `Scenarios (${doc.branchingScenarios?.length ?? 0})`],
            ["scientific", `Science (${doc.scientificWorkspaces?.length ?? 0})`],
            ["spreadsheets", `Spreadsheets (${doc.spreadsheetAssignments?.length ?? 0})`],
            ["publish", "Publish"],
          ] as [Tab, string][]
        ).map(([t, label]) => (
          <button key={t} aria-current={tab === t ? "page" : undefined} onClick={() => { if (canNavigate()) setTab(t); }}>
            {label}
          </button>
        ))}
      </nav>

      <fieldset disabled={readOnly || publishing} className="plain-fieldset">
        {tab === "about" && <About doc={doc} update={update} />}
        {tab === "lessons" && <Lessons api={api} doc={doc} update={update} ix={Math.min(lessonIx, doc.lessons.length - 1)} setIx={setLessonIx} />}
        {tab === "modules" && <Modules api={api} doc={doc} update={update} />}
        {tab === "cards" && <Decks doc={doc} update={update} />}
        {tab === "glossary" && <Glossary doc={doc} update={update} />}
        {tab === "refs" && <References doc={doc} update={update} />}
        {tab === "drills" && <Drills doc={doc} update={update} />}
        {tab === "language" && <Language doc={doc} update={update} />}
        {tab === "reader" && <ReaderLibraryEditor texts={doc.texts ?? []} questions={communityReaderQuestions(doc)} onChange={texts => update(current => ({ ...current, texts: structuredClone(texts) }))} />}
        {tab === "work" && <WorkResourceEditor
          work={doc}
          modules={doc.modules ?? []}
          lessons={doc.lessons.map(lesson => ({ id: lesson.id, title: lesson.title, body: lesson.blocks.filter(b => b.type === "assignment").map(b => "```assignment\n" + (b.kind === "log" ? "log" : `${b.kind}: ${b.id}`) + "\n```").join("\n\n") }))}
          onChange={(work: CourseWork) => update(current => ({ ...current, rubrics: work.rubrics, writing: work.writing, labs: work.labs, activityLog: work.activityLog }))}
          onAssignmentAttachmentChange={(lessonId, reference, attached) => update(current => ({ ...current, lessons: current.lessons.map(lesson => {
            if (lesson.id !== lessonId) return lesson;
            const matches = (b: Block) => b.type === "assignment" && b.kind === reference.kind && (b.kind === "log" || b.id === reference.id);
            if (!attached) return { ...lesson, blocks: lesson.blocks.filter(b => !matches(b)) };
            if (lesson.blocks.some(matches)) return lesson;
            if (lesson.blocks.length >= LIMITS.blocksPerLesson) { api.toast("This lesson has reached its block limit."); return lesson; }
            const block: Block = reference.kind === "log" ? { type: "assignment", kind: "log" } : { type: "assignment", kind: reference.kind, id: reference.id! };
            return { ...lesson, blocks: [...lesson.blocks, block] };
          }) }))}
        />}
        {tab === "branching" && <CourseBranchingEditor course={spreadsheetCourse(doc,id)} onEditingChange={editingChanged} update={change=>update(current=>{
          const changed=change(spreadsheetCourse(current,id));
          const next={...current,branchingScenarios:structuredClone(changed.branchingScenarios??[])};
          if(new TextEncoder().encode(JSON.stringify(next)).length>LIMITS.docBytes)throw Error("Course exceeds community document size limit.");
          return next;
        })}/>}
        {tab === "scientific" && <CourseScientificEditor course={spreadsheetCourse(doc,id)} onEditingChange={editingChanged} update={change=>update(current=>{
          const changed=change(spreadsheetCourse(current,id));
          const next={...current,scientificWorkspaces:structuredClone(changed.scientificWorkspaces??[])};
          if(new TextEncoder().encode(JSON.stringify(next)).length>LIMITS.docBytes)throw Error("Course exceeds community document size limit.");
          return next;
        })}/>}
        {tab === "spreadsheets" && <CourseSpreadsheetEditor
          course={spreadsheetCourse(doc, id)}
          onEditingChange={editingChanged}
          update={change => update(current => {
            const changed = change(spreadsheetCourse(current, id));
            const errors = checkCommunitySpreadsheetAssignments(changed.spreadsheetAssignments, new Set(current.lessons.map(l => l.id)));
            if (errors.length) throw new Error(errors.join("; "));
            // Copy back only this capability. Rich blocks, media, quiz metadata,
            // vocabulary and future fields stay on the original document.
            const next = { ...current, spreadsheetAssignments: structuredClone(changed.spreadsheetAssignments ?? []) };
            if (new TextEncoder().encode(JSON.stringify(next)).length > LIMITS.docBytes) throw new Error("The course exceeds the community document size limit. Reduce workbook content before applying.");
            return next;
          })}
        />}
        {tab === "publish" && (
          <Publish
            api={api}
            id={id}
            doc={doc}
            meta={meta}
            flush={flush}
            onBusyChange={busy => { publicationBusy.current = busy; setPublishing(busy); }}
            onChange={(m) => setMeta({ ...meta, ...m })}
          />
        )}
        {tab === "publish" && <EditorsPanel api={api} id={id} canManage={meta.role !== "editor"} />}
      </fieldset>
    </div>
  );
}

type Update = (fn: (d: CommunityDoc) => CommunityDoc) => void;

function About({ doc, update }: { doc: CommunityDoc; update: Update }) {
  return (
    <section className="panel form-grid">
      <label className="field span-2">
        <span>Title</span>
        <input className="input" value={doc.title} maxLength={LIMITS.title} onChange={(e) => update((d) => ({ ...d, title: e.target.value }))} />
      </label>
      <label className="field span-2">
        <span>Description (what learners will get out of it)</span>
        <textarea className="textarea" value={doc.description} maxLength={LIMITS.description} onChange={(e) => update((d) => ({ ...d, description: e.target.value }))} />
      </label>
      <label className="field">
        <span>Subject</span>
        <select className="select" value={doc.subject} onChange={(e) => update((d) => ({ ...d, subject: e.target.value }))}>
          {SUBJECTS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>Level</span>
        <select className="select" value={doc.level} onChange={(e) => update((d) => ({ ...d, level: e.target.value }))}>
          {LEVELS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>Type</span>
        <select className="select" value={doc.type ?? "Course"} onChange={(e) => update((d) => ({ ...d, type: e.target.value }))}>
          {TYPES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>Calculator beside lessons, quizzes and drills</span>
        <select
          className="select"
          value={doc.calculator ?? ""}
          onChange={(e) => update((d) => ({ ...d, calculator: (e.target.value || undefined) as CalcChoice | undefined }))}
        >
          <option value="">Usual for {doc.subject} ({CALC_LABEL[calculatorForSubject(doc.subject)].toLowerCase()})</option>
          {CALCULATORS.map((c) => (
            <option key={c} value={c}>
              {CALC_LABEL[c]}
            </option>
          ))}
        </select>
      </label>
      <fieldset className="plain-fieldset span-2">
        <legend>Practice exam (drawn from all the questions in the course)</legend>
        <div className="row">
          {(
            [
              ["questionCount", "Questions", 300, "up to 50"],
              ["minutes", "Time limit (minutes)", 600, "1.5 per question"],
              ["passingPercent", "Passing score (%)", 100, "70"],
            ] as const
          ).map(([k, label, max, ph]) => (
            <label key={k} className="field">
              <span>{label}</span>
              <input
                className="input"
                type="number"
                min={1}
                max={max}
                placeholder={ph}
                value={doc.exam?.[k] ?? ""}
                onChange={(e) =>
                  update((d) => {
                    const exam = { ...d.exam, [k]: e.target.value === "" ? undefined : Math.round(Number(e.target.value)) };
                    return { ...d, exam: Object.values(exam).some((v) => v !== undefined) ? exam : undefined };
                  })
                }
              />
            </label>
          ))}
        </div>
      </fieldset>
    </section>
  );
}

function move<T>(xs: T[], i: number, d: number): T[] {
  const a = [...xs];
  const j = i + d;
  if (j < 0 || j >= a.length) return a;
  [a[i], a[j]] = [a[j], a[i]];
  return a;
}

function Lessons({ api, doc, update, ix, setIx }: { api: AppApi; doc: CommunityDoc; update: Update; ix: number; setIx: (n: number) => void }) {
  const [preview, setPreview] = useState(false);
  const lesson = doc.lessons[ix];
  const setLesson = (fn: (l: CommunityDoc["lessons"][number]) => CommunityDoc["lessons"][number]) =>
    update((d) => ({ ...d, lessons: d.lessons.map((l, i) => (i === ix ? fn(l) : l)) }));
  const setBlocks = (fn: (b: Block[]) => Block[]) => setLesson((l) => ({ ...l, blocks: fn(l.blocks) }));
  const addBlock = (type: Block["type"]) => {
    const qids = doc.lessons.flatMap((l) => l.blocks.flatMap((b) => (b.type === "question" ? [b.id] : [])));
    const blank: Record<Block["type"], () => Block> = {
      assignment: () => ({ type: "assignment", kind: "log" }),
      heading: () => ({ type: "heading", text: "" }),
      text: () => ({ type: "text", md: "" }),
      list: () => ({ type: "list", ordered: false, items: [""] }),
      image: () => ({ type: "image", imageId: "", alt: "", caption: "" }),
      question: () => ({ type: "question", ...newQuestion(newId("q", qids)) }),
      callout: () => ({ type: "callout", kind: "tip", title: "", md: "" }),
      example: () => ({ type: "example", title: "", md: "" }),
      math: () => ({ type: "math", tex: "" }),
      figure: () => ({ type: "figure", spec: FIGURE_START, caption: "" }),
      diagram: () => ({ type: "diagram", code: "flowchart LR\n  A[Start] --> B[Next step]", title: "", description: "" }),
      manipulative: () => ({ type: "manipulative", spec: { kind: "blocks" } }),
    };
    setBlocks((bs) => [...bs, blank[type]()]);
  };

  return (
    <div className="editor-grid">
      <nav className="panel lesson-list" aria-label="Lessons">
        <ol>
          {doc.lessons.map((l, i) => (
            <li key={l.id}>
              <button className="linkish" aria-current={i === ix ? "true" : undefined} onClick={() => setIx(i)}>
                {i + 1}. {l.title || "Untitled lesson"}
              </button>
            </li>
          ))}
        </ol>
        <button
          className="btn sm"
          disabled={doc.lessons.length >= LIMITS.lessons}
          onClick={() => {
            const lid = newId("l", doc.lessons.map((l) => l.id));
            update((d) => ({ ...d, lessons: [...d.lessons, { id: lid, title: `Lesson ${d.lessons.length + 1}`, blocks: [{ type: "text", md: "" }] }] }));
            setIx(doc.lessons.length);
          }}
        >
          Add lesson
        </button>
      </nav>

      {lesson ? (
        <section className="lesson-edit">
          <div className="panel">
            <div className="row" style={{ alignItems: "flex-end" }}>
              <label className="field grow">
                <span>Lesson title</span>
                <input className="input" value={lesson.title} maxLength={LIMITS.title} onChange={(e) => setLesson((l) => ({ ...l, title: e.target.value }))} />
              </label>
              <button className="btn sm ghost" disabled={ix === 0} onClick={() => (update((d) => ({ ...d, lessons: move(d.lessons, ix, -1) })), setIx(ix - 1))}>
                Move lesson up
              </button>
              <button
                className="btn sm ghost"
                disabled={ix === doc.lessons.length - 1}
                onClick={() => (update((d) => ({ ...d, lessons: move(d.lessons, ix, 1) })), setIx(ix + 1))}
              >
                Move lesson down
              </button>
              <button
                className="btn sm ghost danger"
                disabled={doc.lessons.length === 1 || (doc.spreadsheetAssignments?.some(a => a.lessonId === lesson.id) || doc.branchingScenarios?.some(a=>a.lessonId===lesson.id) || doc.scientificWorkspaces?.some(a=>a.lessonId===lesson.id))}
                title={(doc.spreadsheetAssignments?.some(a => a.lessonId === lesson.id) || doc.branchingScenarios?.some(a=>a.lessonId===lesson.id) || doc.scientificWorkspaces?.some(a=>a.lessonId===lesson.id)) ? "Move or remove workspaces and assignments linked to this lesson first." : undefined}
                onClick={() => {
                  if ((doc.spreadsheetAssignments?.some(a => a.lessonId === lesson.id) || doc.branchingScenarios?.some(a=>a.lessonId===lesson.id) || doc.scientificWorkspaces?.some(a=>a.lessonId===lesson.id))) { api.toast("Move or remove linked workspaces and assignments before deleting this lesson."); return; }
                  if (!window.confirm(`Delete the lesson "${lesson.title}"?`)) return;
                  update((d) => ({ ...d, lessons: d.lessons.filter((_, i) => i !== ix) }));
                  setIx(Math.max(0, ix - 1));
                }}
              >
                Delete lesson
              </button>
              <button className="btn sm" aria-pressed={preview} onClick={() => setPreview((p) => !p)}>
                {preview ? "Edit" : "Preview"}
              </button>
            </div>
            <LessonSettings doc={doc} lesson={lesson} setLesson={setLesson} />
          </div>

          {preview ? (
            <LessonPreview doc={doc} ix={ix} />
          ) : (
            <>
              {lesson.blocks.map((b, bi) => (
                <BlockEditor
                  key={bi}
                  api={api}
                  block={b}
                  n={bi + 1}
                  count={lesson.blocks.length}
                  onChange={(nb) => setBlocks((bs) => bs.map((x, i) => (i === bi ? nb : x)))}
                  onMove={(d) => setBlocks((bs) => move(bs, bi, d))}
                  onDelete={() => setBlocks((bs) => bs.filter((_, i) => i !== bi))}
                />
              ))}
              <div className="panel add-blocks">
                <span className="small muted">Add a block:</span>
                {ADDABLE.map((t) => (
                  <button key={t} className="btn sm" disabled={lesson.blocks.length >= LIMITS.blocksPerLesson} onClick={() => addBlock(t)}>
                    {BLOCK_LABEL[t]}
                  </button>
                ))}
              </div>
            </>
          )}
        </section>
      ) : null}
    </div>
  );
}

const FIGURE_START = JSON.stringify({ type: "plot", x: [-5, 5], y: [-5, 5], functions: ["x^2 - 2"], points: [{ at: [0, -2], label: "vertex" }] }, null, 2);

function LessonSettings({
  doc,
  lesson,
  setLesson,
}: {
  doc: CommunityDoc;
  lesson: CommunityDoc["lessons"][number];
  setLesson: (fn: (l: CommunityDoc["lessons"][number]) => CommunityDoc["lessons"][number]) => void;
}) {
  const modules = doc.modules ?? [];
  const toggle = (list: string[] | undefined, id: string, on: boolean) => {
    const next = on ? [...(list ?? []), id] : (list ?? []).filter((x) => x !== id);
    return next.length ? next : undefined;
  };
  return (
    <details className="lesson-settings">
      <summary>Lesson settings{lesson.honors ? " · honors" : ""}</summary>
      <div className="form-grid">
        {modules.length > 0 && (
          <label className="field">
            <span>Module</span>
            <select className="select" value={lesson.module ?? modules[0].id} onChange={(e) => setLesson((l) => ({ ...l, module: e.target.value }))}>
              {modules.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title}
                </option>
              ))}
            </select>
          </label>
        )}
        <label className="field">
          <span>About how many minutes (optional)</span>
          <input
            className="input"
            type="number"
            min={1}
            max={LIMITS.minutes}
            value={lesson.minutes ?? ""}
            onChange={(e) => setLesson((l) => ({ ...l, minutes: e.target.value === "" ? undefined : Math.max(1, Math.round(Number(e.target.value))) }))}
          />
        </label>
        <label className="check span-2">
          <input type="checkbox" checked={!!lesson.honors} onChange={(e) => setLesson((l) => ({ ...l, honors: e.target.checked || undefined }))} />
          Honors lesson: optional extra depth, not needed to finish the course
        </label>
        {(doc.drills?.length ?? 0) > 0 && (
          <fieldset className="plain-fieldset">
            <legend className="small">Drills offered with this lesson</legend>
            {doc.drills!.map((x) => (
              <label key={x.id} className="check">
                <input type="checkbox" checked={!!lesson.drills?.includes(x.id)} onChange={(e) => setLesson((l) => ({ ...l, drills: toggle(l.drills, x.id, e.target.checked) }))} />
                {x.title}
              </label>
            ))}
          </fieldset>
        )}
        {(doc.references?.length ?? 0) > 0 && (
          <fieldset className="plain-fieldset">
            <legend className="small">Reference sheets offered with this lesson</legend>
            {doc.references!.map((r) => (
              <label key={r.id} className="check">
                <input type="checkbox" checked={!!lesson.refs?.includes(r.id)} onChange={(e) => setLesson((l) => ({ ...l, refs: toggle(l.refs, r.id, e.target.checked) }))} />
                {r.title}
              </label>
            ))}
          </fieldset>
        )}
      </div>
    </details>
  );
}

function BlockEditor({
  api,
  block: b,
  n,
  count,
  onChange,
  onMove,
  onDelete,
}: {
  api: AppApi;
  block: Block;
  n: number;
  count: number;
  onChange: (b: Block) => void;
  onMove: (d: number) => void;
  onDelete: () => void;
}) {
  const label = `${b.type === "question" ? `Question: ${Q_KIND_LABEL[b.kind ?? "choice"]}` : BLOCK_LABEL[b.type]} (block ${n})`;
  return (
    <fieldset className={`panel block-edit block-${b.type}`}>
      <legend>{label}</legend>
      <div className="row block-tools">
        <button className="btn sm ghost" disabled={n === 1} onClick={() => onMove(-1)}>
          Up<span className="sr-only">: {label}</span>
        </button>
        <button className="btn sm ghost" disabled={n === count} onClick={() => onMove(1)}>
          Down<span className="sr-only">: {label}</span>
        </button>
        <button className="btn sm ghost danger" onClick={onDelete}>
          Delete<span className="sr-only">: {label}</span>
        </button>
      </div>
      {b.type === "assignment" && <p>Linked {b.kind}: {b.kind === "log" ? "Activity log" : b.id}. Edit the resource or its lesson attachments in Writing, labs and activities.</p>}
      {b.type === "heading" && (
        <div className="row" style={{ alignItems: "flex-end" }}>
          <label className="field grow">
            <span>Heading text ("Key points" and "Common mistakes" get their own colored box)</span>
            <input className="input" value={b.text} maxLength={LIMITS.short} onChange={(e) => onChange({ ...b, text: e.target.value })} />
          </label>
          <label className="field">
            <span>Size</span>
            <select className="select" value={b.level ?? 2} onChange={(e) => onChange({ ...b, level: Number(e.target.value) === 3 ? 3 : undefined })}>
              <option value={2}>Section</option>
              <option value={3}>Subsection</option>
            </select>
          </label>
        </div>
      )}
      {b.type === "text" && (
        <label className="field">
          <span>
            Text: **bold**, *italic*, [link](https://…), tables with | pipes |, math like $x^2$ or $$a^2 + b^2 = c^2$$, [[term]] links to the
            glossary. A blank line starts a new paragraph.
          </span>
          <textarea className="textarea" rows={6} value={b.md} maxLength={LIMITS.text} onChange={(e) => onChange({ ...b, md: e.target.value })} />
        </label>
      )}
      {b.type === "list" && (
        <>
          <label className="field">
            <span>Items, one per line</span>
            <textarea
              className="textarea"
              rows={4}
              value={b.items.join("\n")}
              onChange={(e) => onChange({ ...b, items: e.target.value.split("\n").slice(0, LIMITS.listItems) })}
            />
          </label>
          <label className="check" style={{ marginTop: 8 }}>
            <input type="checkbox" checked={b.ordered} onChange={(e) => onChange({ ...b, ordered: e.target.checked })} />
            Numbered list
          </label>
        </>
      )}
      {(b.type === "callout" || b.type === "example") && (
        <div className="form-grid">
          {b.type === "callout" && (
            <label className="field">
              <span>Kind of box</span>
              <select className="select" value={b.kind} onChange={(e) => onChange({ ...b, kind: e.target.value as typeof b.kind })}>
                <option value="tip">Tip</option>
                <option value="warning">Warning</option>
                <option value="rule">Rule or theorem</option>
              </select>
            </label>
          )}
          <label className="field">
            <span>{b.type === "example" ? "Example title (optional)" : "Title (like Exam tip or Pythagorean theorem)"}</span>
            <input className="input" value={b.title} maxLength={LIMITS.short} onChange={(e) => onChange({ ...b, title: e.target.value })} />
          </label>
          <label className="field span-2">
            <span>{b.type === "example" ? "The problem and its worked solution (Markdown and math)" : "Text (Markdown and math)"}</span>
            <textarea className="textarea" rows={5} value={b.md} maxLength={LIMITS.text} onChange={(e) => onChange({ ...b, md: e.target.value })} />
          </label>
        </div>
      )}
      {b.type === "math" && (
        <>
          <label className="field">
            <span>Formula in TeX, like \frac{'{a}'}{'{b}'} or x = \frac{'{-b \\pm \\sqrt{b^2 - 4ac}}'}{'{2a}'}</span>
            <input className="input code" value={b.tex} maxLength={LIMITS.short * 4} onChange={(e) => onChange({ ...b, tex: e.target.value })} />
          </label>
          {b.tex.trim() && <Markdown source={`$$${b.tex}$$`} />}
        </>
      )}
      {b.type === "figure" && <FigureFields b={b} onChange={onChange} />}
      {b.type === "manipulative" && (
        <div className="stack">
          <ModelStartFields
            spec={b.spec}
            idBase={`mb-${n}`}
            withCaption
            onSpec={(spec) => onChange({ ...b, spec })}
            onKind={(kind) => onChange({ ...b, spec: { kind } })}
          />
          {readSpec(b.spec).problems.map((p) => (
            <p key={p} className="notice error small">
              {p}
            </p>
          ))}
          <p className="small muted">Try it (this is what learners see):</p>
          <LessonManipulative spec={readSpec(b.spec).spec} />
        </div>
      )}
      {b.type === "diagram" && (
        <div className="form-grid">
          <label className="field span-2">
            <span>
              Mermaid diagram (flowchart, sequenceDiagram, timeline, pie, mindmap… see{" "}
              <a href="https://mermaid.js.org/intro/" target="_blank" rel="noreferrer">
                mermaid.js.org
              </a>
              )
            </span>
            <textarea className="textarea code" rows={6} value={b.code} maxLength={LIMITS.text} spellCheck={false} onChange={(e) => onChange({ ...b, code: e.target.value })} />
          </label>
          <label className="field">
            <span>Title</span>
            <input className="input" value={b.title} maxLength={LIMITS.short} onChange={(e) => onChange({ ...b, title: e.target.value })} />
          </label>
          <label className="field">
            <span>What it shows, for people who can't see it</span>
            <input className="input" value={b.description} maxLength={LIMITS.short * 2} onChange={(e) => onChange({ ...b, description: e.target.value })} />
          </label>
        </div>
      )}
      {b.type === "image" && (
        <div className="form-grid">
          <div className="span-2">
            {b.imageId ? (
              <img className="block-image" src={imageUrl(b.imageId)} alt={b.alt || "Image without a description yet"} />
            ) : (
              <p className="small muted">No image yet.</p>
            )}
          </div>
          <ImagePicker api={api} label={b.imageId ? "Replace image" : "Image"} onPicked={(id) => onChange({ ...b, imageId: id })} />
          <label className="field">
            <span>Description for people who can't see it (alt text)</span>
            <input className="input" value={b.alt} maxLength={LIMITS.short} onChange={(e) => onChange({ ...b, alt: e.target.value })} />
          </label>
          <label className="field span-2">
            <span>Caption (optional)</span>
            <input className="input" value={b.caption} maxLength={LIMITS.short} onChange={(e) => onChange({ ...b, caption: e.target.value })} />
          </label>
        </div>
      )}
      {b.type === "question" && <QuestionEditor api={api} q={b} onChange={(q) => onChange({ ...q, type: "question" })} />}
    </fieldset>
  );
}

/** A graph or drawing: the figure spec as JSON, drawn live as you type. */
function FigureFields({ b, onChange }: { b: Extract<Block, { type: "figure" }>; onChange: (b: Block) => void }) {
  let svg = "";
  let error = "";
  try {
    svg = renderFigure(readFigure(b.spec));
  } catch (e) {
    error = (e as Error).message;
  }
  return (
    <div className="form-grid">
      <label className="field">
        <span>
          Figure as JSON: "type" is plot, shape or numberline; add functions, points, segments, polygons, circles, labels, shading, bars… (the same
          figure format as official courses)
        </span>
        <textarea className="textarea code" rows={12} value={b.spec} maxLength={LIMITS.text} spellCheck={false} onChange={(e) => onChange({ ...b, spec: e.target.value })} />
      </label>
      <div>
        {error ? <p className="notice error small">{error}</p> : <div className="figure" dangerouslySetInnerHTML={{ __html: svg }} />}
        <label className="field">
          <span>Caption (optional)</span>
          <input className="input" value={b.caption} maxLength={LIMITS.short} onChange={(e) => onChange({ ...b, caption: e.target.value })} />
        </label>
      </div>
    </div>
  );
}

function LessonPreview({ doc, ix }: { doc: CommunityDoc; ix: number }) {
  const workProblems = [...validateCourseWork(doc, { moduleIds: doc.modules?.map(m => m.id) ?? [] }), ...checkCommunityReaderTexts(doc, true)];
  if (workProblems.length) return <p role="alert">Finish assessed work before previewing: {workProblems.join("; ")}</p>;
  const course = toCourse(doc, { id: "preview", version: 0, review: "not_reviewed", author: "" }, imageUrl) as {
    lessons: { body: string; title: string; quiz?: string[] }[];
    banks: { questions: { id: string; type?: string; stem: string; choices: string[]; answer: number[]; left?: string[]; accept?: string[][] }[] }[];
    glossary: { term: string; definition: string }[];
  };
  const l = course.lessons[ix];
  const qs = (course.banks[0]?.questions ?? []).filter((q) => l.quiz?.includes(q.id));
  return (
    <section className="panel" aria-label="Lesson preview">
      <h2>{l.title}</h2>
      <Markdown source={l.body} glossary={course.glossary} />
      {qs.length > 0 && (
        <>
          <h3>Lesson quiz</h3>
          <ol>
            {qs.map((q) => (
              <li key={q.id}>
                {q.stem}
                <ul>
                  {q.type === "text"
                    ? (q.accept ?? []).map((a, i) => <li key={i}>Accepted: {a.join(" / ")}</li>)
                    : q.type === "order"
                      ? q.choices.map((c, i) => (
                          <li key={i}>
                            {i + 1}. {c}
                          </li>
                        ))
                      : q.type === "match" || q.type === "label"
                        ? q.answer.map((a, i) => (
                            <li key={i}>
                              {q.left?.[i] ?? `Marker ${i + 1}`} → {q.choices[a]}
                            </li>
                          ))
                        : q.choices.map((c, i) => (
                            <li key={i}>
                              {c}
                              {q.answer.includes(i) && " (right)"}
                            </li>
                          ))}
                </ul>
              </li>
            ))}
          </ol>
          <p className="small muted">Learners need 70% on the quiz to finish the lesson.</p>
        </>
      )}
    </section>
  );
}

function Decks({ doc, update }: { doc: CommunityDoc; update: Update }) {
  const setDeck = (di: number, fn: (k: CommunityDoc["decks"][number]) => CommunityDoc["decks"][number]) =>
    update((d) => ({ ...d, decks: d.decks.map((k, i) => (i === di ? fn(k) : k)) }));
  return (
    <>
      <p className="muted small" style={{ marginBottom: 12 }}>
        Notecards are reviewed with spaced repetition: the front is the prompt, the back is the answer.
      </p>
      {doc.decks.map((k, di) => (
        <fieldset key={k.id} className="panel">
          <legend>Deck {di + 1}</legend>
          <div className="row" style={{ alignItems: "flex-end" }}>
            <label className="field grow">
              <span>Deck title</span>
              <input className="input" value={k.title} maxLength={LIMITS.title} onChange={(e) => setDeck(di, (x) => ({ ...x, title: e.target.value }))} />
            </label>
            <button
              className="btn sm ghost danger"
              onClick={() => window.confirm(`Delete the deck "${k.title}"?`) && update((d) => ({ ...d, decks: d.decks.filter((_, i) => i !== di) }))}
            >
              Delete deck
            </button>
          </div>
          <table className="table cards-edit">
            <caption className="sr-only">Cards in {k.title}</caption>
            <thead>
              <tr>
                <th scope="col">Front</th>
                <th scope="col">Back</th>
                <th scope="col">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {k.cards.map((c, ci) => (
                <tr key={c.id}>
                  <td>
                    <input
                      className="input"
                      aria-label={`Card ${ci + 1} front`}
                      value={c.front}
                      maxLength={LIMITS.short * 2}
                      onChange={(e) => setDeck(di, (x) => ({ ...x, cards: x.cards.map((y, i) => (i === ci ? { ...y, front: e.target.value } : y)) }))}
                    />
                  </td>
                  <td>
                    <input
                      className="input"
                      aria-label={`Card ${ci + 1} back`}
                      value={c.back}
                      maxLength={LIMITS.short * 2}
                      onChange={(e) => setDeck(di, (x) => ({ ...x, cards: x.cards.map((y, i) => (i === ci ? { ...y, back: e.target.value } : y)) }))}
                    />
                  </td>
                  <td>
                    <button className="btn sm ghost" onClick={() => setDeck(di, (x) => ({ ...x, cards: x.cards.filter((_, i) => i !== ci) }))}>
                      Remove<span className="sr-only"> card {ci + 1}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            className="btn sm"
            onClick={() => setDeck(di, (x) => ({ ...x, cards: [...x.cards, { id: newId("c", x.cards.map((y) => y.id)), front: "", back: "" }] }))}
          >
            Add card
          </button>
        </fieldset>
      ))}
      <button
        className="btn"
        disabled={doc.decks.length >= LIMITS.decks}
        onClick={() => update((d) => ({ ...d, decks: [...d.decks, { id: newId("d", d.decks.map((x) => x.id)), title: `Deck ${d.decks.length + 1}`, cards: [] }] }))}
      >
        Add a deck
      </button>
    </>
  );
}

function Publish({
  api,
  id,
  doc,
  meta,
  flush,
  onBusyChange,
  onChange,
}: {
  api: AppApi;
  id: string;
  doc: CommunityDoc;
  meta: { status: string; version: number; review: Review };
  flush: () => Promise<boolean>;
  onBusyChange: (busy: boolean) => void;
  onChange: (m: { status?: string; version?: number; review?: Review }) => void;
}) {
  const problems = checkDoc(doc, true, { communityImageOrigin: API || undefined });
  const [errors, setErrors] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);
  const shown = errors.length ? errors : problems;
  return (
    <section className="panel">
      <h2>Publish</h2>
      <p className="muted">
        Publishing makes this version available to everyone, tagged <b>Not reviewed</b> until a reviewer checks it. Later changes stay in your draft until you publish
        again; each new version is Not reviewed until it's checked.
      </p>
      {shown.length > 0 ? (
        <div className="notice error" role="alert" style={{ marginTop: 12 }}>
          <p>
            <b>Fix these first:</b>
          </p>
          <ul>
            {shown.slice(0, 15).map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
          {shown.length > 15 && <p>…and {shown.length - 15} more.</p>}
        </div>
      ) : (
        <p className="notice" style={{ marginTop: 12 }}>
          Ready to publish.
        </p>
      )}
      <div className="row" style={{ marginTop: 16 }}>
        <button
          className="btn primary"
          disabled={busy || problems.length > 0}
          onClick={async () => {
            if (busyRef.current) return;
            busyRef.current = true;
            onBusyChange(true);
            setBusy(true);
            setErrors([]);
            try {
              if (!(await flush())) throw new Error("Couldn't save the draft.");
              const r = await community.publish(id);
              onChange({ status: "published", version: r.version, review: "not_reviewed" });
              api.toast(`Published version ${r.version}`);
            } catch (e) {
              const err = e as Error & { errors?: string[] };
              setErrors(err.errors?.length ? err.errors : [err.message]);
            } finally {
              busyRef.current = false;
              onBusyChange(false);
              setBusy(false);
            }
          }}
        >
          {meta.version > 0 ? `Publish version ${meta.version + 1}` : "Publish"}
        </button>
        {meta.status === "published" && (
          <button
            className="btn ghost"
            onClick={async () => {
              if (!window.confirm("Unpublish? The course leaves the catalog; copies people already added stay on their devices.")) return;
              await community.unpublish(id).catch((e) => api.toast((e as Error).message));
              onChange({ status: "unpublished" });
            }}
          >
            Unpublish
          </button>
        )}
      </div>
    </section>
  );
}

/** Who may change this course besides its owner and Erudior's admins. Owners (and admins) add and remove editors; an editor can step down. */
function EditorsPanel({ api, id, canManage }: { api: AppApi; id: string; canManage: boolean }) {
  const [list, setList] = useState<Editors | null>(null);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const load = () => community.editors(id).then(setList, (e) => api.toast((e as Error).message));
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  return (
    <section className="panel" style={{ marginTop: 16 }}>
      <h2>Editors</h2>
      <p className="muted">
        Editors can change and publish this course but can't delete it or add other editors. Erudior's admins can also change it. If the owner doesn't
        sign in for a year, another author may take the course over.
      </p>
      {list && (
        <ul className="plain-list" style={{ marginTop: 8 }}>
          {list.owner && (
            <li>
              {list.owner.name} <span className="faint small">(owner)</span>
            </li>
          )}
          {list.editors.map((e) => (
            <li key={e.id} className="row" style={{ gap: 8 }}>
              <span>{e.name}</span>
              {canManage && (
                <button
                  className="btn sm ghost"
                  onClick={async () => {
                    if (!window.confirm(`Remove ${e.name} as an editor?`)) return;
                    await community.removeEditor(id, e.id).catch((err) => api.toast((err as Error).message));
                    load();
                  }}
                >
                  Remove<span className="sr-only"> {e.name}</span>
                </button>
              )}
            </li>
          ))}
          {list.editors.length === 0 && <li className="faint">No editors yet.</li>}
        </ul>
      )}
      {canManage && (
        <form
          className="row"
          style={{ marginTop: 12, alignItems: "flex-end" }}
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            try {
              await community.addEditor(id, email.trim());
              setEmail("");
              api.toast("Editor added.");
              load();
            } catch (err) {
              api.toast((err as Error).message);
            } finally {
              setBusy(false);
            }
          }}
        >
          <label className="field">
            <span>Add an editor by the email they sign in with</span>
            <input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="off" />
          </label>
          <button className="btn" type="submit" disabled={busy}>
            Add editor
          </button>
        </form>
      )}
    </section>
  );
}

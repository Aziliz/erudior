// The student's side of writing assignments and science labs: write (word count, simple
// formatting, autosave), do a lab (safety first, materials, steps to check off, data tables,
// questions, photos), check your own work against the rubric, and hand it in.
//
// Who reviews it depends on where Erudior runs: a homeschool parent or a teacher on the same
// computer (family set up), a teacher through a hand-in file (a class joined from a class file),
// or nobody (the website on its own: the student marks it finished and can print it).

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { AppApi } from "../App";
import type { Course } from "../lib/types";
import { adultLabel } from "../lib/family";
import { loadRecords } from "../lib/records";
import { loadJoined } from "../lib/classroom";
import * as store from "../lib/storage";
import { deleteFile } from "../lib/documents";
import {
  currentReview,
  editable,
  findWork,
  offersSelfCheck,
  reopenWork,
  rubricOf,
  rubricScore,
  statusLabel,
  submitWork,
  wordCount,
  wordTarget,
  workKey,
  workStatus,
  type BlockLink,
  type Lab,
  type LinkInfo,
  type WorkRecord,
  type WorkReview,
  type WorkStatus,
  type WorkFile,
  type WritingTask,
} from "../lib/work";
import Markdown from "../components/Markdown";
import { RubricPicker, RubricTable, ReviewNote, StoredFile, WritingText, sizeOf, storeWorkFile } from "../components/WorkParts";
import { studentHtml } from "../lib/work";

// ---------- who reviews, and their feedback ----------

export interface WorkContext {
  /** "Parent" / "Teacher" when someone reviews the work; null on its own (self-paced). */
  adult: "Parent" | "Teacher" | null;
  /** The work reaches the teacher through a hand-in file (a class joined on this device). */
  viaFile: boolean;
  reviews: Record<string, WorkReview[]>;
}

export function useWorkContext(api: AppApi, courseId: string): WorkContext {
  const [ctx, setCtx] = useState<WorkContext>(() => ({ adult: api.family ? (adultLabel(api.family) as "Parent" | "Teacher") : null, viaFile: false, reviews: {} }));
  const sid = api.student?.id;
  useEffect(() => {
    let live = true;
    (async () => {
      if (api.family && sid) {
        // Reviews are on the student's records (the parent's or teacher's side).
        const r = await loadRecords(sid);
        if (live) setCtx({ adult: adultLabel(api.family) as "Parent" | "Teacher", viaFile: false, reviews: r.reviews ?? {} });
        return;
      }
      const joined = await loadJoined().catch(() => []);
      const inClass = joined.some((j) => j.cls.assignments.some((a) => a.courseId === courseId));
      if (live) setCtx({ adult: inClass ? "Teacher" : null, viaFile: inClass, reviews: {} });
    })();
    return () => {
      live = false;
    };
  }, [api.family, sid, courseId]);
  return ctx;
}

/** What a lesson's assignment card says about each link (title, detail, status). */
export function useAssignmentLinks(api: AppApi, course: Course) {
  const ctx = useWorkContext(api, course.id);
  const work = api.progress.work;
  return useMemo(
    () => ({
      info: (l: BlockLink): LinkInfo | undefined => {
        if (l.kind === "log") {
          const a = course.activityLog;
          if (!a) return undefined;
          return { title: a.title, detail: a.weeklyMinutes ? `Goal: ${a.weeklyMinutes} minutes a week` : "Log what you do each day" };
        }
        const found = findWork(course, l.id);
        if (!found || found.kind !== l.kind) return undefined;
        const key = workKey(course.id, l.id);
        const s = workStatus(work?.[key], ctx.reviews[key]);
        if (found.kind === "writing") return { title: found.item.title, kicker: found.item.kind === "short" ? "Short response" : undefined, detail: wordTarget(found.item.words) || undefined, status: statusLabel(s, ctx.adult) };
        return { title: found.item.title, detail: found.item.minutes ? `About ${found.item.minutes} minutes` : undefined, status: statusLabel(s, ctx.adult), adult: found.item.adult };
      },
      open: (l: BlockLink) =>
        l.kind === "log" ? api.go({ name: "course", courseId: course.id, tab: "work" }) : api.go({ name: "work", courseId: course.id, itemId: l.id }),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [course, work, ctx],
  );
}

// ---------- autosave ----------

type SaveState = { at?: Date; saving: boolean; error?: string };

function useWorkRecord(api: AppApi, key: string, kind: WorkRecord["kind"]) {
  const [rec, setRec] = useState<WorkRecord | undefined>(api.progress.work?.[key]);
  const [save, setSave] = useState<SaveState>({ saving: false });
  const apiRef = useRef(api);
  apiRef.current = api;
  const pending = useRef<WorkRecord | null>(null);
  const recRef = useRef<WorkRecord | undefined>(rec);
  const timer = useRef<number | undefined>(undefined);

  const flush = useCallback(async () => {
    window.clearTimeout(timer.current);
    const r = pending.current;
    if (!r) return;
    pending.current = null;
    setSave({ saving: true });
    try {
      await apiRef.current.updateProgress((p) => ({ ...p, work: { ...(p.work ?? {}), [key]: r } }));
      setSave({ saving: false, at: new Date() });
    } catch (e) {
      setSave({ saving: false, error: `Couldn't save: ${(e as Error).message}` });
    }
  }, [key]);

  /** Change the record; saved after a short pause (or at once). */
  const change = useCallback(
    (fn: (w: WorkRecord) => WorkRecord, now = false) => {
      // Built from a ref, not inside a state updater, so the change is known at once (a hand-in
      // saves immediately) and two quick changes build on each other.
      const t = new Date().toISOString();
      const next = { ...fn(recRef.current ?? { kind, started: t, updated: t }), updated: t };
      recRef.current = next;
      pending.current = next;
      setRec(next);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(flush, now ? 0 : 800);
    },
    [kind, flush],
  );

  // Leaving the screen saves whatever is waiting.
  useEffect(() => () => void flush(), [flush]);
  return { rec, change, save, flush };
}

function SaveLine({ save }: { save: SaveState }) {
  // Not a live region: it changes on every pause in typing, which would be noisy for screen
  // reader users; errors go to the toast (which is live).
  return (
    <p className={`small save-state${save.error ? " is-error" : ""}`}>
      {save.error ?? (save.saving ? "Saving…" : save.at ? `Saved at ${save.at.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}` : "Your work saves by itself as you go.")}
    </p>
  );
}

// ---------- the screen ----------

export default function WorkView({ api, course, itemId }: { api: AppApi; course: Course; itemId: string }) {
  const found = findWork(course, itemId);
  if (!found)
    return (
      <div className="page">
        <button className="back" onClick={() => api.go({ name: "course", courseId: course.id, tab: "work" })}>
          ← {course.title}
        </button>
        <h1>Assignment not found</h1>
        <p className="muted">This course doesn't have that assignment any more.</p>
      </div>
    );
  return <WorkScreen key={itemId} api={api} course={course} kind={found.kind} item={found.item} />;
}

function WorkScreen({ api, course, kind, item }: { api: AppApi; course: Course; kind: "writing" | "lab"; item: WritingTask | Lab }) {
  const key = workKey(course.id, item.id);
  const ctx = useWorkContext(api, course.id);
  const { rec, change, save, flush } = useWorkRecord(api, key, kind);
  const reviews = ctx.reviews[key];
  const status = workStatus(rec, reviews);
  const review = currentReview(rec, reviews);
  const canEdit = editable(status);
  const rubric = rubricOf(course, item.rubric);
  const selfCheck = offersSelfCheck(course, item);
  const h1 = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (save.error) api.toast(save.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [save.error]);

  /** A content edit. Work sent back for another draft becomes a draft again on the first edit. */
  const edit = (fn: (w: WorkRecord) => WorkRecord) => change((w) => fn(w.submitted && status === "revise" ? reopenWork(w) : w));

  async function handIn() {
    if (kind === "writing") {
      const t = item as WritingTask;
      const n = wordCount(rec?.text ?? "");
      if (!n) return api.toast("Write something first.");
      if (t.words?.min && n < t.words.min && !(await store.confirmAction(`You have ${n} words, and the goal is at least ${t.words.min}. Hand it in anyway?`))) return;
    } else {
      const lab = item as Lab;
      if ((rec?.done?.length ?? 0) < lab.steps.length && !(await store.confirmAction("Some steps aren't checked off yet. Hand in the lab anyway?"))) return;
    }
    change((w) => submitWork(w), true);
    await flush();
    api.toast(
      ctx.viaFile
        ? "Handed in. Now choose Hand in work under your class on the Courses page, and give that file to your teacher."
        : ctx.adult
          ? `Handed in. Your ${ctx.adult.toLowerCase()} will look at it.`
          : "Marked as finished.",
    );
    h1.current?.focus();
  }

  function takeBack() {
    change((w) => reopenWork(w), true);
    api.toast("You can keep working on it.");
  }

  const kicker = kind === "writing" ? ((item as WritingTask).kind === "short" ? "Short response" : "Writing assignment") : "Science lab";
  const handLabel = ctx.adult ? `Hand in to your ${ctx.adult.toLowerCase()}` : "Mark as finished";

  return (
    <div className="page work-page">
      <button className="back no-print" onClick={() => api.go({ name: "course", courseId: course.id, tab: "work" })}>
        ← {course.title}: Assignments
      </button>
      <header className="work-head">
        <p className="work-kicker">
          {kicker}
          <span className={`pill work-pill is-${status}`}>{statusLabel(status, ctx.adult)}</span>
        </p>
        <h1 ref={h1} tabIndex={-1}>
          {item.title}
        </h1>
        <p className="muted small">
          {[kind === "writing" ? wordTarget((item as WritingTask).words) : "", item.minutes ? `About ${item.minutes} minutes.` : ""].filter(Boolean).join(" ")}
        </p>
      </header>

      {review && <ReviewNote review={review} rubric={rubric} title={review.revise ? "Feedback: make another draft" : "Your grade"} />}

      {kind === "writing" ? (
        <WritingPart course={course} task={item as WritingTask} rec={rec} edit={edit} canEdit={canEdit} />
      ) : (
        <LabPart api={api} course={course} lab={item as Lab} rec={rec} edit={edit} canEdit={canEdit} />
      )}

      {rubric && (
        <section className="panel work-rubric" aria-labelledby="rubric-h">
          <div className="panel-head">
            <h2 id="rubric-h">How it will be graded</h2>
            {selfCheck && rec?.self && Object.keys(rec.self).length > 0 && (
              <span className="small muted" aria-live="polite">
                Your check: {rubricScore(rubric, rec.self).points} of {rubricScore(rubric, rec.self).outOf} points
              </span>
            )}
          </div>
          {selfCheck && canEdit ? (
            <>
              <p className="small muted" style={{ marginBottom: 10 }}>
                Before you hand it in, read your work again and pick the level you think it reached for each part. Then fix anything you can. This is just for you{ctx.adult ? ` and your ${ctx.adult.toLowerCase()}` : ""}; it doesn't change your grade.
              </p>
              <RubricPicker rubric={rubric} name={`self-${item.id}`} value={rec?.self ?? {}} onChange={(v) => change((w) => ({ ...w, self: v }))} />
            </>
          ) : (
            <RubricTable rubric={rubric} chosen={selfCheck ? rec?.self : undefined} caption={`Rubric for ${item.title}${selfCheck && rec?.self ? " (your self-check marked)" : ""}`} />
          )}
        </section>
      )}

      <section className="panel work-actions no-print" aria-label="Hand in">
        <SaveLine save={save} />
        {canEdit && (
          <>
            {!ctx.adult && (
              <p className="small muted">
                Your work is saved on this device. Print it to share it, or join your class (Courses page) so you can hand it in to your teacher.
              </p>
            )}
            <div className="row">
              <button className="btn primary" onClick={handIn}>
                {handLabel}
              </button>
              <button className="btn" onClick={() => window.print()}>
                Print
              </button>
            </div>
          </>
        )}
        {status === "submitted" && (
          <div className="row">
            <button className="btn" onClick={takeBack}>
              Keep working on it
            </button>
            <button className="btn" onClick={() => window.print()}>
              Print
            </button>
          </div>
        )}
        {status === "reviewed" && (
          <button className="btn" onClick={() => window.print()}>
            Print
          </button>
        )}
      </section>
    </div>
  );
}

// ---------- writing ----------

function WritingPart({
  course,
  task,
  rec,
  edit,
  canEdit,
}: {
  course: Course;
  task: WritingTask;
  rec?: WorkRecord;
  edit: (fn: (w: WorkRecord) => WorkRecord) => void;
  canEdit: boolean;
}) {
  const text = rec?.text ?? "";
  const n = wordCount(text);
  const [preview, setPreview] = useState(false);
  const area = useRef<HTMLTextAreaElement>(null);
  const id = `wr-${task.id}`;
  const essay = task.kind === "essay";
  const min = task.words?.min;
  const max = task.words?.max;
  const fit = n === 0 ? "" : min && n < min ? "short" : max && n > max ? "long" : min || max ? "ok" : "";

  const setText = (t: string) => edit((w) => ({ ...w, text: t }));

  /** Wrap the selection in marks (or insert them around the cursor), keeping the selection. */
  function wrap(mark: string) {
    const el = area.current;
    if (!el) return;
    const { selectionStart: a, selectionEnd: b, value } = el;
    const sel = value.slice(a, b);
    const next = value.slice(0, a) + mark + sel + mark + value.slice(b);
    setText(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(a + mark.length, b + mark.length);
    });
  }
  /** Turn the selected lines into a bulleted list (or back). */
  function list() {
    const el = area.current;
    if (!el) return;
    const { selectionStart: a, selectionEnd: b, value } = el;
    const start = value.lastIndexOf("\n", a - 1) + 1;
    const endNl = value.indexOf("\n", b);
    const end = endNl === -1 ? value.length : endNl;
    const lines = value.slice(start, end).split("\n");
    const on = lines.every((l) => /^- /.test(l));
    const out = lines.map((l) => (on ? l.replace(/^- /, "") : l.trim() ? `- ${l}` : l)).join("\n");
    setText(value.slice(0, start) + out + value.slice(end));
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start, start + out.length);
    });
  }

  return (
    <>
      <section className="panel work-prompt" aria-labelledby={`${id}-p`}>
        <h2 id={`${id}-p`}>The assignment</h2>
        <Markdown source={task.prompt} glossary={course.glossary} />
      </section>

      <section className="panel work-writing" aria-labelledby={`${id}-h`}>
        <div className="panel-head">
          <h2 id={`${id}-h`}>Your writing</h2>
          {canEdit && (
            <div className="row no-print">
              {essay && (
                <div role="toolbar" aria-label="Formatting" aria-controls={id} className="row work-toolbar">
                  <button type="button" className="btn sm" onClick={() => wrap("**")} disabled={preview} title="Bold (Ctrl+B)">
                    <b>B</b>
                    <span className="sr-only">Bold</span>
                  </button>
                  <button type="button" className="btn sm" onClick={() => wrap("*")} disabled={preview} title="Italic (Ctrl+I)">
                    <i>I</i>
                    <span className="sr-only">Italic</span>
                  </button>
                  <button type="button" className="btn sm" onClick={list} disabled={preview}>
                    • List
                  </button>
                </div>
              )}
              <button type="button" className="btn sm" aria-pressed={preview} onClick={() => setPreview(!preview)}>
                Preview
              </button>
            </div>
          )}
        </div>
        {canEdit && !preview ? (
          <>
            <label htmlFor={id} className="sr-only">
              Your writing
            </label>
            <textarea
              id={id}
              ref={area}
              className="textarea serif work-editor"
              rows={essay ? 16 : 6}
              value={text}
              spellCheck
              aria-describedby={`${id}-wc ${id}-help`}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (!essay || !(e.ctrlKey || e.metaKey)) return;
                const k = e.key.toLowerCase();
                if (k === "b" || k === "i") {
                  e.preventDefault();
                  wrap(k === "b" ? "**" : "*");
                }
              }}
            />
            <p id={`${id}-help`} className="small muted no-print">
              {essay
                ? "Leave an empty line between paragraphs. Bold and italic marks (** and *) show as formatting in Preview."
                : "A few clear sentences are enough."}
            </p>
          </>
        ) : (
          <WritingText text={text} />
        )}
        {/* The printout shows the formatted text whatever is on screen. */}
        {canEdit && !preview && <div className="print-only student-text" dangerouslySetInnerHTML={{ __html: studentHtml(text) }} />}
        <p id={`${id}-wc`} className={`word-count${fit ? ` is-${fit}` : ""}`}>
          <b>
            {n} word{n === 1 ? "" : "s"}
          </b>
          {fit === "ok" && " · right on target"}
          {fit === "short" && ` · ${min! - n} more to reach ${min}`}
          {fit === "long" && ` · ${n - max!} over the limit of ${max}`}
        </p>
      </section>
    </>
  );
}

// ---------- lab ----------

function LabPart({
  api,
  course,
  lab,
  rec,
  edit,
  canEdit,
}: {
  api: AppApi;
  course: Course;
  lab: Lab;
  rec?: WorkRecord;
  edit: (fn: (w: WorkRecord) => WorkRecord) => void;
  canEdit: boolean;
}) {
  const id = `lab-${lab.id}`;
  const done = new Set(rec?.done ?? []);
  const have = new Set(rec?.have ?? []);
  const [caption, setCaption] = useState("");
  const [busy, setBusy] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const toggle = (field: "done" | "have", i: number) =>
    edit((w) => {
      const s = new Set(w[field] ?? []);
      if (s.has(i)) s.delete(i);
      else s.add(i);
      return { ...w, [field]: [...s].sort((a, b) => a - b) };
    });
  const rowsOf = (t: Lab["tables"][number]) => {
    const saved = rec?.tables?.[t.id] ?? [];
    const n = Math.max(t.rows, saved.length);
    return Array.from({ length: n }, (_, i) => t.columns.map((_, j) => saved[i]?.[j] ?? ""));
  };
  const setCell = (t: Lab["tables"][number], r: number, c: number, v: string) =>
    edit((w) => {
      const rows = rowsOf(t).map((row) => [...row]);
      rows[r][c] = v;
      return { ...w, tables: { ...(w.tables ?? {}), [t.id]: rows } };
    });
  const addRow = (t: Lab["tables"][number]) => edit((w) => ({ ...w, tables: { ...(w.tables ?? {}), [t.id]: [...rowsOf(t), t.columns.map(() => "")] } }));

  async function addPhotos(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    try {
      const added: WorkFile[] = [];
      for (const f of Array.from(files)) added.push(await storeWorkFile(f, caption.trim()));
      edit((w) => ({ ...w, photos: [...(w.photos ?? []), ...added] }));
      setCaption("");
      api.toast(`${added.length === 1 ? "Photo" : `${added.length} photos`} added`);
    } catch (e) {
      api.toast((e as Error).message);
    } finally {
      setBusy(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  const obs = lab.questions.filter((q) => q.kind === "observation");
  const concl = lab.questions.filter((q) => q.kind === "conclusion");
  const ro = !canEdit;

  return (
    <>
      <section className={`lab-safety${lab.adult ? " is-adult" : ""}`} aria-labelledby={`${id}-safe`}>
        <h2 id={`${id}-safe`}>
          <span aria-hidden="true" className="lab-safety-icon">
            !
          </span>
          Safety first
        </h2>
        {lab.adult && (
          <p className="lab-adult">
            <strong>An adult must be with you for this whole lab.</strong> Don't start until they're ready.
          </p>
        )}
        <ul>
          {lab.safety.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </section>

      {lab.intro && (
        <section className="panel" aria-labelledby={`${id}-intro`}>
          <h2 id={`${id}-intro`}>What you'll find out</h2>
          <Markdown source={lab.intro} glossary={course.glossary} />
        </section>
      )}

      <section className="panel" aria-labelledby={`${id}-mat`}>
        <h2 id={`${id}-mat`}>What you need</h2>
        <ul className="lab-checks">
          {lab.materials.map((m, i) => (
            <li key={i}>
              <label className="check">
                <input type="checkbox" checked={have.has(i)} disabled={ro} onChange={() => toggle("have", i)} />
                <span>{m}</span>
              </label>
            </li>
          ))}
        </ul>
      </section>

      <section className="panel" aria-labelledby={`${id}-steps`}>
        <div className="panel-head">
          <h2 id={`${id}-steps`}>What to do</h2>
          <span className="small muted">
            {done.size} of {lab.steps.length} done
          </span>
        </div>
        <ol className="lab-steps">
          {lab.steps.map((s, i) => (
            <li key={i} className={`lab-step${done.has(i) ? " is-done" : ""}${s.adult ? " is-adult" : ""}`}>
              <input
                type="checkbox"
                id={`${id}-s${i}`}
                checked={done.has(i)}
                disabled={ro}
                onChange={() => toggle("done", i)}
                aria-labelledby={`${id}-s${i}-n ${id}-s${i}-t`}
              />
              <div>
                <span id={`${id}-s${i}-n`} className="lab-step-n">
                  Step {i + 1}
                  {s.adult && <span className="assign-adult">Adult step</span>}
                </span>
                <div id={`${id}-s${i}-t`}>
                  <Markdown source={s.text} glossary={course.glossary} className="prose lab-step-text" />
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {lab.tables.map((t) => {
        const rows = rowsOf(t);
        return (
          <section key={t.id} className="panel" aria-labelledby={`${id}-t-${t.id}`}>
            <h2 id={`${id}-t-${t.id}`}>{t.title ?? "Your data"}</h2>
            <div className="table-wrap" tabIndex={0} role="region" aria-label={`${t.title ?? "Your data"}: table`}>
              <table className="table lab-table lab-input">
                <thead>
                  <tr>
                    {t.columns.map((c) => (
                      <th key={c} scope="col">
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, r) => (
                    <tr key={r}>
                      {t.columns.map((col, c) => {
                        const label = t.rowLabels?.[r];
                        if (c === 0 && label)
                          return (
                            <th key={c} scope="row">
                              {label}
                            </th>
                          );
                        return (
                          <td key={c}>
                            <input
                              className="input"
                              value={row[c]}
                              readOnly={ro}
                              aria-label={`${col}, ${label ?? `row ${r + 1}`}`}
                              onChange={(e) => setCell(t, r, c, e.target.value)}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!ro && !t.rowLabels && (
              <button type="button" className="btn sm" style={{ marginTop: 8 }} onClick={() => addRow(t)}>
                Add a row<span className="sr-only"> to {t.title ?? "the data table"}</span>
              </button>
            )}
          </section>
        );
      })}

      {[
        { qs: obs, title: "What did you notice?" },
        { qs: concl, title: "What did you find out?" },
      ]
        .filter((g) => g.qs.length)
        .map((g) => (
          <section key={g.title} className="panel" aria-label={g.title}>
            <h2>{g.title}</h2>
            {g.qs.map((q) => (
              <div key={q.id} className="field lab-q">
                <div id={`${id}-q-${q.id}`}>
                  <Markdown source={q.prompt} glossary={course.glossary} className="prose lab-q-text" />
                </div>
                <textarea
                  className="textarea"
                  rows={3}
                  aria-labelledby={`${id}-q-${q.id}`}
                  readOnly={ro}
                  value={rec?.answers?.[q.id] ?? ""}
                  onChange={(e) => edit((w) => ({ ...w, answers: { ...(w.answers ?? {}), [q.id]: e.target.value } }))}
                />
              </div>
            ))}
          </section>
        ))}

      {(lab.photos || (rec?.photos?.length ?? 0) > 0) && (
        <section className="panel" aria-labelledby={`${id}-ph`}>
          <div className="panel-head">
            <h2 id={`${id}-ph`}>Photos</h2>
            <span className="small muted">They go in your portfolio with the lab.</span>
          </div>
          {lab.photos && <p className="small">{lab.photos}</p>}
          {!ro && (
            <div className="row no-print" style={{ alignItems: "flex-end", margin: "10px 0" }}>
              <label className="field" style={{ flex: "1 1 220px" }}>
                <span>Caption (optional)</span>
                <input className="input" value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="e.g. My setup before starting" />
              </label>
              <input
                ref={fileInput}
                type="file"
                accept="image/*"
                capture="environment"
                multiple
                className="sr-only"
                id={`${id}-file`}
                aria-label="Choose photos"
                onChange={(e) => addPhotos(e.target.files)}
                tabIndex={-1}
              />
              <button type="button" className="btn" disabled={busy} onClick={() => fileInput.current?.click()}>
                {busy ? "Adding…" : "Add photos"}
              </button>
            </div>
          )}
          {(rec?.photos?.length ?? 0) > 0 ? (
            <ul className="work-photos">
              {rec!.photos!.map((f) => (
                <li key={f.id} className="work-photo">
                  <StoredFile file={f} onError={api.toast} />
                  <span className="small">
                    {f.caption || <span className="muted">No caption</span>} <span className="muted">({sizeOf(f.bytes)})</span>
                  </span>
                  {!ro && (
                    <button
                      type="button"
                      className="btn sm ghost no-print"
                      onClick={() => {
                        edit((w) => ({ ...w, photos: (w.photos ?? []).filter((x) => x.id !== f.id) }));
                        deleteFile(f.fileId).catch(() => {});
                      }}
                    >
                      Remove<span className="sr-only"> photo {f.caption}</span>
                    </button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="small muted">No photos yet.</p>
          )}
        </section>
      )}
    </>
  );
}

export type { WorkStatus };

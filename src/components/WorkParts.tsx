// Pieces shared by the student's work screens, the parent/teacher review screen and the
// printed portfolio: stored pictures, the rubric (pick a level per criterion, or read-only),
// a read-only view of a piece of writing or a finished lab, and the file store helpers.

import { useEffect, useState } from "react";
import type { Course } from "../lib/types";
import { loadFile, putFile, saveCopy, storeFile } from "../lib/documents";
import { shrinkImage } from "../lib/portfolio";
import { uid } from "../lib/util";
import { today } from "../lib/srs";
import {
  currentReview,
  fmtMinutes,
  logTotals,
  rubricOf,
  rubricScore,
  studentHtml,
  type LogEntry,
  type Lab,
  type Rubric,
  type WorkFile,
  type WorkRecord,
  type WorkReview,
  type WritingTask,
} from "../lib/work";
import Markdown from "./Markdown";

// ---------- files ----------

/**
 * Store a photo or file the student added. Pictures are shrunk to 1600 px JPEG first (as for
 * portfolio photos), so a phone photo doesn't fill the backup; other files (a drawing as PDF,
 * a practice recording) are kept as they are, up to the documents store's 15 MB limit.
 */
export async function storeWorkFile(file: File, caption = ""): Promise<WorkFile> {
  const base = { id: uid("w"), caption, date: today() };
  if (file.type.startsWith("image/") && file.type !== "image/svg+xml") {
    try {
      const url = await shrinkImage(file);
      const fileId = uid("f").toLowerCase();
      const data = url.slice(url.indexOf(",") + 1);
      await putFile(fileId, { mime: "image/jpeg", data });
      return { ...base, fileId, name: file.name.replace(/\.[^.]+$/, "") + ".jpg", mime: "image/jpeg", bytes: Math.round((data.length * 3) / 4) };
    } catch {
      // A picture the browser can't decode (e.g. HEIC) is kept as a plain file below.
    }
  }
  const s = await storeFile(file);
  return { ...base, fileId: s.fileId, name: s.name, mime: s.mime, bytes: s.bytes };
}

const cache = new Map<string, string>();

/** A data URL for a stored file (cached for the session). */
export function useStoredUrl(fileId: string | undefined): string | null | undefined {
  const [url, setUrl] = useState<string | null | undefined>(fileId ? cache.get(fileId) : null);
  useEffect(() => {
    if (!fileId) return setUrl(null);
    if (cache.has(fileId)) return setUrl(cache.get(fileId));
    let live = true;
    loadFile(fileId)
      .then((f) => {
        const u = f ? `data:${f.mime};base64,${f.data}` : null;
        if (u) cache.set(fileId, u);
        if (live) setUrl(u);
      })
      .catch(() => live && setUrl(null));
    return () => {
      live = false;
    };
  }, [fileId]);
  return url;
}

export const isImage = (f: Pick<WorkFile, "mime">) => f.mime.startsWith("image/") && f.mime !== "image/svg+xml";
export const sizeOf = (n: number) => (n >= 1e6 ? `${(n / 1e6).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1e3))} KB`);

/** A stored picture, or a "Save a copy" button for any other file. */
export function StoredFile({ file, onError }: { file: WorkFile; onError?: (msg: string) => void }) {
  const url = useStoredUrl(isImage(file) ? file.fileId : undefined);
  if (isImage(file)) {
    if (url === undefined) return <span className="small muted">Loading picture…</span>;
    if (url === null) return <span className="small muted">This picture isn't on this device.</span>;
    return <img className="work-img" src={url} alt={file.caption || `Picture added ${file.date}`} />;
  }
  return (
    <button
      type="button"
      className="btn sm"
      onClick={() =>
        saveCopy({ id: file.id, fileId: file.fileId, name: file.name, mime: file.mime, bytes: file.bytes, kind: "Student work", date: file.date, note: "" }).catch((e) =>
          onError?.((e as Error).message),
        )
      }
    >
      Save a copy<span className="sr-only">: {file.name}</span>
    </button>
  );
}

// ---------- rubric ----------

/**
 * One fieldset per criterion with a radio button per level, so the whole rubric works with
 * the keyboard (arrow keys move within a criterion) and reads well on a screen reader.
 * `other` marks the levels someone else picked (the student's self-check, on the review screen).
 */
export function RubricPicker({
  rubric,
  value,
  onChange,
  name,
  other,
  otherLabel,
  notes,
  onNote,
  disabled,
}: {
  rubric: Rubric;
  value: Record<string, number>;
  onChange: (v: Record<string, number>) => void;
  name: string;
  other?: Record<string, number>;
  otherLabel?: string;
  notes?: Record<string, string>;
  onNote?: (criterionId: string, text: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="rubric-pick">
      {rubric.criteria.map((c) => (
        <fieldset key={c.id} className="rubric-crit" disabled={disabled}>
          <legend>
            {c.name}
            {c.description && <span className="small muted"> · {c.description}</span>}
          </legend>
          <div className="rubric-levels">
            {c.levels.map((l) => {
              const id = `${name}-${c.id}-${l.points}`;
              const theirs = other?.[c.id] === l.points;
              return (
                <label key={l.points} htmlFor={id} className={`rubric-level${value[c.id] === l.points ? " is-on" : ""}`}>
                  <input id={id} type="radio" name={`${name}-${c.id}`} checked={value[c.id] === l.points} onChange={() => onChange({ ...value, [c.id]: l.points })} />
                  <span className="rubric-level-head">
                    <b>{l.label}</b> <span className="rubric-pts">{l.points} pt{l.points === 1 ? "" : "s"}</span>
                  </span>
                  {l.description && <span className="rubric-desc">{l.description}</span>}
                  {theirs && <span className="rubric-theirs">{otherLabel ?? "Picked"}</span>}
                </label>
              );
            })}
          </div>
          {onNote && (
            <label className="field rubric-note">
              <span>Note on {c.name.toLowerCase()} (optional)</span>
              <input className="input" value={notes?.[c.id] ?? ""} onChange={(e) => onNote(c.id, e.target.value)} />
            </label>
          )}
        </fieldset>
      ))}
    </div>
  );
}

/** The rubric as a plain table (what each level means), with the chosen levels marked. */
export function RubricTable({ rubric, chosen, caption }: { rubric: Rubric; chosen?: Record<string, number>; caption: string }) {
  return (
    <div className="table-wrap rubric-wrap" tabIndex={0} role="region" aria-label={caption}>
      <table className="table rubric-table">
        <caption className="sr-only">{caption}</caption>
        <tbody>
          {rubric.criteria.map((c) => (
            <tr key={c.id}>
              <th scope="row">{c.name}</th>
              {c.levels.map((l) => {
                const on = chosen?.[c.id] === l.points;
                return (
                  <td key={l.points} className={on ? "is-on" : undefined}>
                    <b>{l.label}</b> <span className="rubric-pts">({l.points})</span>
                    {on && <span className="sr-only"> (chosen)</span>}
                    {l.description && <div className="small">{l.description}</div>}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---------- feedback ----------

export function ReviewNote({ review, rubric, title, forAdult }: { review: WorkReview; rubric?: Rubric; title: string; forAdult?: boolean }) {
  const s = rubric && Object.keys(review.levels).length ? rubricScore(rubric, review.levels) : undefined;
  return (
    <section className={`panel work-feedback${review.revise ? " is-revise" : ""}`} aria-labelledby={`fb-${review.at}`}>
      <h2 id={`fb-${review.at}`}>{title}</h2>
      <p className="small muted">
        {forAdult ? `By the ${review.by.toLowerCase()}` : `From your ${review.by.toLowerCase()}`} on{" "}
        {new Date(review.at).toLocaleDateString(undefined, { month: "long", day: "numeric" })}
        {review.revise && !forAdult ? ": please make another draft." : "."}
      </p>
      {review.percent !== undefined && (
        <p className="work-score">
          {s ? `${s.points} of ${s.outOf} points · ` : ""}
          {Math.round(review.percent)}%
        </p>
      )}
      {review.comment && <p className="work-comment">{review.comment}</p>}
      {rubric && Object.keys(review.levels).length > 0 && <RubricTable rubric={rubric} chosen={review.levels} caption="Rubric levels your work reached" />}
      {review.notes && Object.entries(review.notes).some(([, v]) => v) && (
        <ul className="small">
          {rubric?.criteria
            .filter((c) => review.notes?.[c.id])
            .map((c) => (
              <li key={c.id}>
                <b>{c.name}:</b> {review.notes![c.id]}
              </li>
            ))}
        </ul>
      )}
    </section>
  );
}

// ---------- read-only work ----------

export function WritingText({ text }: { text: string }) {
  return text.trim() ? <div className="student-text" dangerouslySetInnerHTML={{ __html: studentHtml(text) }} /> : <p className="muted">(Nothing written yet.)</p>;
}

export function LabResults({ lab, w, onError }: { lab: Lab; w: WorkRecord; onError?: (m: string) => void }) {
  return (
    <div className="lab-results">
      <p className="small muted">
        {w.done?.length ?? 0} of {lab.steps.length} steps done
      </p>
      {lab.tables.map((t) => {
        const rows = w.tables?.[t.id] ?? [];
        return (
          <div key={t.id} className="table-wrap" tabIndex={0} role="region" aria-label={t.title ?? "Data table"}>
            <table className="table lab-table">
              <caption>{t.title ?? "Data"}</caption>
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
                {rows
                  .filter((r, i) => r.some((x) => x.trim()) || t.rowLabels?.[i])
                  .map((r, i) => (
                    <tr key={i}>
                      {t.columns.map((_, j) => (
                        <td key={j}>{(j === 0 && t.rowLabels?.[i]) || r[j] || ""}</td>
                      ))}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        );
      })}
      {lab.questions.map((q) => (
        <div key={q.id} className="lab-answer">
          <p>
            <b>{q.prompt}</b>
          </p>
          <p className="student-text">{w.answers?.[q.id]?.trim() || <span className="muted">(No answer.)</span>}</p>
        </div>
      ))}
      {(w.photos?.length ?? 0) > 0 && (
        <div className="work-photos">
          {w.photos!.map((f) => (
            <figure key={f.id} className="work-photo">
              <StoredFile file={f} onError={onError} />
              {f.caption && <figcaption className="small">{f.caption}</figcaption>}
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}

/** A piece of work as the reviewer and the portfolio show it. */
export function WorkBody({ item, kind, w, onError }: { item: WritingTask | Lab; kind: "writing" | "lab"; w: WorkRecord; onError?: (m: string) => void }) {
  if (kind === "writing") return <WritingText text={w.text ?? ""} />;
  return <LabResults lab={item as Lab} w={w} onError={onError} />;
}

export function PromptText({ course, text }: { course: Course; text: string }) {
  return <Markdown source={text} glossary={course.glossary} />;
}

export { rubricOf };

// ---------- portfolio ----------

/**
 * A course's student work for the printed portfolio: each piece of writing and each lab handed
 * in during the year (with its grade, rubric levels and comment, and the lab's photos), and the
 * activity log's totals with any pictures of work.
 */
export function PortfolioWork({
  course,
  work,
  reviews,
  logs,
  from,
  to,
}: {
  course: Course | undefined;
  work: Record<string, WorkRecord>;
  reviews: Record<string, WorkReview[]>;
  logs: LogEntry[];
  from: string;
  to: string;
}) {
  if (!course) return null;
  const inYear = (iso?: string) => !!iso && iso.slice(0, 10) >= from && iso.slice(0, 10) <= to;
  const pieces = [
    ...(course.writing ?? []).map((item) => ({ kind: "writing" as const, item: item as WritingTask | Lab })),
    ...(course.labs ?? []).map((item) => ({ kind: "lab" as const, item: item as WritingTask | Lab })),
  ]
    .map((p) => ({ ...p, key: `${course.id}/${p.item.id}`, w: work[`${course.id}/${p.item.id}`] }))
    .filter((p) => p.w && inYear(p.w.submitted));
  const mine = logs.filter((e) => e.courseId === course.id && e.date >= from && e.date <= to);
  const totals = logTotals(mine);
  if (!pieces.length && !mine.length) return null;
  const long = (iso: string) => new Date(iso).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });
  return (
    <>
      {pieces.map((p) => {
        const r = currentReview(p.w, reviews[p.key]);
        const graded = r && !r.revise ? r : undefined;
        const rubric = rubricOf(course, p.item.rubric);
        return (
          <div key={p.key} className="doc-sample doc-work">
            <p>
              <b>
                {p.kind === "writing" ? "Writing" : "Lab"}: {p.item.title}, handed in {long(p.w!.submitted!)}
                {graded?.percent !== undefined ? ` · ${graded.points !== undefined ? `${graded.points} of ${graded.outOf} points, ` : ""}${Math.round(graded.percent)}%` : ""}
              </b>
            </p>
            <WorkBody item={p.item} kind={p.kind} w={p.w!} />
            {graded && rubric && Object.keys(graded.levels).length > 0 && <RubricTable rubric={rubric} chosen={graded.levels} caption={`Rubric for ${p.item.title}`} />}
            {graded?.comment && <p className="doc-small">Comment: {graded.comment}</p>}
          </div>
        );
      })}
      {mine.length > 0 && (
        <div className="doc-sample doc-work">
          <p>
            <b>
              {course.activityLog?.title ?? "Activity log"}: {fmtMinutes(totals.minutes)} on {totals.days} day{totals.days === 1 ? "" : "s"}
            </b>
          </p>
          <p className="doc-small">{totals.byType.map((t) => `${t.type} ${fmtMinutes(t.minutes)}`).join("; ")}.</p>
          <div className="work-photos">
            {mine
              .filter((e) => e.file && isImage(e.file))
              .map((e) => (
                <figure key={e.id} className="work-photo">
                  <StoredFile file={e.file!} />
                  <figcaption className="doc-small">
                    {e.date}: {e.type}
                    {e.note && `, ${e.note}`}
                  </figcaption>
                </figure>
              ))}
          </div>
        </div>
      )}
    </>
  );
}

// Block editor for community courses (website only). Saves the draft as you type; Publish
// checks it and makes a new public version, tagged Not reviewed until a reviewer looks.

import { useEffect, useRef, useState } from "react";
import type { AppApi } from "../App";
import Markdown from "../components/Markdown";
import { ReviewPill } from "../components/CommunityCatalog";
import { api as community, imageUrl, type Review } from "../lib/community";
import { LEVELS, LIMITS, SUBJECTS, checkDoc, toCourse, type Block, type CommunityDoc } from "../lib/communityFormat";
import { shrinkImage } from "../lib/portfolio";

type Save = "saved" | "saving" | "unsaved" | "error";
type Tab = "about" | "lessons" | "cards" | "publish";

const newId = (prefix: string, taken: string[]) => {
  for (let i = 1; ; i++) if (!taken.includes(`${prefix}${i}`)) return `${prefix}${i}`;
};

const BLOCK_LABEL: Record<Block["type"], string> = { heading: "Heading", text: "Text", list: "List", image: "Image", question: "Question" };

export default function CommunityEditor({ api, id }: { api: AppApi; id: string }) {
  const [doc, setDoc] = useState<CommunityDoc | null>(null);
  const [meta, setMeta] = useState<{ status: string; version: number; review: Review; reviewNote: string | null } | null>(null);
  const [save, setSave] = useState<Save>("saved");
  const [saveError, setSaveError] = useState("");
  const [tab, setTab] = useState<Tab>("about");
  const [lessonIx, setLessonIx] = useState(0);
  const [loadError, setLoadError] = useState("");
  const timer = useRef<number>(undefined);
  const latest = useRef<CommunityDoc | null>(null);

  useEffect(() => {
    community.draft(id).then(
      (d) => {
        setDoc(d.doc);
        latest.current = d.doc;
        setMeta({ status: d.status, version: d.version, review: d.review, reviewNote: d.reviewNote });
      },
      (e) => setLoadError((e as Error).message),
    );
  }, [id]);

  const flush = async () => {
    window.clearTimeout(timer.current);
    if (!latest.current) return true;
    setSave("saving");
    try {
      await community.save(id, latest.current);
      setSave("saved");
      setSaveError("");
      return true;
    } catch (e) {
      setSave("error");
      setSaveError((e as Error).message);
      return false;
    }
  };

  // Save shortly after each change, and before leaving.
  const update = (fn: (d: CommunityDoc) => CommunityDoc) => {
    setDoc((d) => {
      const next = fn(d!);
      latest.current = next;
      return next;
    });
    setSave("unsaved");
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(flush, 1200);
  };
  useEffect(() => () => void flush(), []); // eslint-disable-line react-hooks/exhaustive-deps

  if (loadError)
    return (
      <div className="page">
        <h1>Edit course</h1>
        <p className="notice error">{loadError}</p>
      </div>
    );
  if (!doc || !meta) return <div className="page muted">Loading…</div>;
  const readOnly = meta.status === "removed";

  return (
    <div className="page community-editor">
      <button className="back" onClick={async () => (await flush(), api.go({ name: "create" }))}>
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
          {save === "saved" ? "All changes saved" : save === "saving" ? "Saving…" : save === "unsaved" ? "Unsaved changes" : `Not saved: ${saveError}`}
        </p>
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
            ["lessons", `Lessons (${doc.lessons.length})`],
            ["cards", `Notecards (${doc.decks.reduce((s, k) => s + k.cards.length, 0)})`],
            ["publish", "Publish"],
          ] as [Tab, string][]
        ).map(([t, label]) => (
          <button key={t} aria-current={tab === t ? "page" : undefined} onClick={() => setTab(t)}>
            {label}
          </button>
        ))}
      </nav>

      <fieldset disabled={readOnly} className="plain-fieldset">
        {tab === "about" && <About doc={doc} update={update} />}
        {tab === "lessons" && <Lessons api={api} doc={doc} update={update} ix={Math.min(lessonIx, doc.lessons.length - 1)} setIx={setLessonIx} />}
        {tab === "cards" && <Decks doc={doc} update={update} />}
        {tab === "publish" && (
          <Publish
            api={api}
            id={id}
            doc={doc}
            meta={meta}
            flush={flush}
            onChange={(m) => setMeta({ ...meta, ...m })}
          />
        )}
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
    const b: Block =
      type === "heading"
        ? { type, text: "" }
        : type === "text"
          ? { type, md: "" }
          : type === "list"
            ? { type, ordered: false, items: [""] }
            : type === "image"
              ? { type, imageId: "", alt: "", caption: "" }
              : { type, id: newId("q", qids), stem: "", choices: ["", ""], answer: [], explanation: "" };
    setBlocks((bs) => [...bs, b]);
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
                disabled={doc.lessons.length === 1}
                onClick={() => {
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
                {(["heading", "text", "list", "image", "question"] as Block["type"][]).map((t) => (
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
  const [busy, setBusy] = useState(false);
  const label = `${BLOCK_LABEL[b.type]} (block ${n})`;
  return (
    <fieldset className="panel block-edit">
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
      {b.type === "heading" && (
        <label className="field">
          <span>Heading text</span>
          <input className="input" value={b.text} maxLength={LIMITS.short} onChange={(e) => onChange({ ...b, text: e.target.value })} />
        </label>
      )}
      {b.type === "text" && (
        <label className="field">
          <span>Text (**bold**, *italic*, [link text](https://…); a blank line starts a new paragraph)</span>
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
      {b.type === "image" && (
        <div className="form-grid">
          <div className="span-2">
            {b.imageId ? (
              <img className="block-image" src={imageUrl(b.imageId)} alt={b.alt || "Image without a description yet"} />
            ) : (
              <p className="small muted">No image yet.</p>
            )}
          </div>
          <label className="field">
            <span>{b.imageId ? "Replace image" : "Image"} (PNG, JPEG, WebP or GIF)</span>
            <input
              className="input"
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              disabled={busy}
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                setBusy(true);
                try {
                  // Large photos are shrunk to 1,600 px first; small images go up as they are.
                  const blob = f.size > 1.5 * 1024 * 1024 || f.type === "image/jpeg" ? await (await fetch(await shrinkImage(f))).blob() : f;
                  const { id } = await community.upload(blob);
                  onChange({ ...b, imageId: id });
                } catch (err) {
                  api.toast((err as Error).message);
                } finally {
                  setBusy(false);
                  e.target.value = "";
                }
              }}
            />
          </label>
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
      {b.type === "question" && (
        <>
          <label className="field">
            <span>Question</span>
            <textarea className="textarea" rows={2} value={b.stem} maxLength={LIMITS.text} onChange={(e) => onChange({ ...b, stem: e.target.value })} />
          </label>
          <fieldset className="plain-fieldset choices-edit">
            <legend className="small">Choices (check the right answer; check more than one for "select all that apply")</legend>
            {b.choices.map((c, ci) => (
              <div key={ci} className="row">
                <label className="check">
                  <input
                    type="checkbox"
                    checked={b.answer.includes(ci)}
                    onChange={(e) => onChange({ ...b, answer: e.target.checked ? [...b.answer, ci].sort() : b.answer.filter((x) => x !== ci) })}
                  />
                  <span className="sr-only">Choice {ci + 1} is right</span>
                </label>
                <input
                  className="input grow"
                  aria-label={`Choice ${ci + 1}`}
                  value={c}
                  maxLength={LIMITS.short}
                  onChange={(e) => onChange({ ...b, choices: b.choices.map((x, i) => (i === ci ? e.target.value : x)) })}
                />
                <button
                  className="btn sm ghost"
                  disabled={b.choices.length <= 2}
                  onClick={() =>
                    onChange({
                      ...b,
                      choices: b.choices.filter((_, i) => i !== ci),
                      answer: b.answer.filter((x) => x !== ci).map((x) => (x > ci ? x - 1 : x)),
                    })
                  }
                >
                  Remove<span className="sr-only"> choice {ci + 1}</span>
                </button>
              </div>
            ))}
            <button className="btn sm" disabled={b.choices.length >= LIMITS.choices} onClick={() => onChange({ ...b, choices: [...b.choices, ""] })}>
              Add choice
            </button>
          </fieldset>
          <label className="field" style={{ marginTop: 8 }}>
            <span>Explanation shown after answering (optional)</span>
            <textarea className="textarea" rows={2} value={b.explanation} maxLength={LIMITS.text} onChange={(e) => onChange({ ...b, explanation: e.target.value })} />
          </label>
        </>
      )}
    </fieldset>
  );
}

function LessonPreview({ doc, ix }: { doc: CommunityDoc; ix: number }) {
  const course = toCourse(doc, { id: "preview", version: 0, review: "not_reviewed", author: "" }, imageUrl) as {
    lessons: { body: string; title: string; quiz?: string[] }[];
    banks: { questions: { id: string; stem: string; choices: string[]; answer: number[] }[] }[];
  };
  const l = course.lessons[ix];
  const qs = (course.banks[0]?.questions ?? []).filter((q) => l.quiz?.includes(q.id));
  return (
    <section className="panel" aria-label="Lesson preview">
      <h2>{l.title}</h2>
      <Markdown source={l.body} />
      {qs.length > 0 && (
        <>
          <h3>Lesson quiz</h3>
          <ol>
            {qs.map((q) => (
              <li key={q.id}>
                {q.stem}
                <ul>
                  {q.choices.map((c, i) => (
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
  onChange,
}: {
  api: AppApi;
  id: string;
  doc: CommunityDoc;
  meta: { status: string; version: number; review: Review };
  flush: () => Promise<boolean>;
  onChange: (m: { status?: string; version?: number; review?: Review }) => void;
}) {
  const problems = checkDoc(doc, true);
  const [errors, setErrors] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
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

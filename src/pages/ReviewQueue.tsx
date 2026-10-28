import { preparePromotionCandidate } from "../lib/promotionCandidate";
import { useEffect, useRef, useState } from "react";
import type { AppApi } from "../App";
import CanonicalCourseInspection from "../components/CanonicalCourseInspection";
import { exportText } from "../lib/storage";
import ReadingLibraryInspection from "../components/ReadingLibraryInspection";
import CourseWorkInspection from "../components/CourseWorkInspection";
import Markdown from "../components/Markdown";
import { API, api as community, imageUrl, resolveCommunityImageDataUrl, type CommunityEntry, type Me, type ReviewQueue as Queue } from "../lib/community";
import { checkDoc, communityReaderQuestions, upgradeDoc, toCourse, type CommunityDoc } from "../lib/communityFormat";

/** The hidden admin page (/admin, linked from nowhere): every community course with its
 * Reviewed / Not reviewed tag, courses waiting for review, open reports, taken-down courses;
 * admins also manage people. Reviewers and admins only (the API checks). */
export default function ReviewQueue({ api }: { api: AppApi }) {
  const [q, setQ] = useState<Queue | null>(null);
  const [me, setMe] = useState<Me | null>(null);
  const [error, setError] = useState("");
  const load = () =>
    Promise.all([community.queue(), community.me()]).then(
      ([queue, m]) => (setQ(queue), setMe(m)),
      (e) => setError((e as Error).message),
    );
  useEffect(() => {
    load();
  }, []);

  if (error)
    return (
      <div className="page">
        <h1>Admin</h1>
        <p className="notice error">{error}</p>
      </div>
    );
  if (!q) return <div className="page muted">Loading…</div>;

  return (
    <div className="page">
      <h1>Admin</h1>
      <p className="muted">
        Mark a version Reviewed once you've read it and checked it's accurate, suitable for students, and not copied. Take down anything that breaks the terms;
        the author sees your note.
      </p>

      <AllCourses api={api} onChange={load} />

      <h2 className="section-title">Waiting for review ({q.waiting.length})</h2>
      {q.waiting.length === 0 && <p className="muted small">Nothing waiting.</p>}
      {q.waiting.map((c) => (
        <ReviewItem key={c.id} api={api} c={c} onDone={load} />
      ))}

      <h2 className="section-title">Open reports ({q.reports.length})</h2>
      {q.reports.length === 0 && <p className="muted small">No open reports.</p>}
      <ul className="plain-list">
        {q.reports.map((r) => (
          <li key={r.id} className="panel">
            <p>
              <b>{r.title}</b> (version {r.version}): {r.reason}
            </p>
            {r.details && <p className="small">“{r.details}”</p>}
            <p className="small muted">{new Date(r.created_at).toLocaleString()}</p>
            <div className="row" style={{ marginTop: 8 }}>
              <button
                className="btn sm"
                onClick={async () => {
                  await community.resolve(r.id, "No action needed").catch((e) => api.toast((e as Error).message));
                  load();
                }}
              >
                Close, no action<span className="sr-only">: report on {r.title}</span>
              </button>
              <button
                className="btn sm"
                onClick={async () => {
                  await community.resolve(r.id, "Fixed or taken down").catch((e) => api.toast((e as Error).message));
                  load();
                }}
              >
                Close, handled<span className="sr-only">: report on {r.title}</span>
              </button>
            </div>
          </li>
        ))}
      </ul>

      {q.removed.length > 0 && (
        <>
          <h2 className="section-title">Taken down</h2>
          <ul className="plain-list">
            {q.removed.map((c) => (
              <li key={c.id} className="row" style={{ justifyContent: "space-between" }}>
                <span>
                  {c.title} <span className="muted">by {c.author}</span>
                </span>
                <button
                  className="btn sm"
                  onClick={async () => {
                    await community.review(c.id, "restore", "").catch((e) => api.toast((e as Error).message));
                    load();
                  }}
                >
                  Restore<span className="sr-only"> {c.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {me?.user?.role === "admin" && <Users api={api} />}
    </div>
  );
}

/** Every course: search, and flip its tag either way. */
function AllCourses({ api, onChange }: { api: AppApi; onChange: () => void }) {
  type Row = Awaited<ReturnType<typeof community.allCourses>>["courses"][number];
  const [inspection, setInspection] = useState<Row | null>(null);
  const [rows, setRows] = useState<Row[] | null>(null);
  const [q, setQ] = useState("");
  const [only, setOnly] = useState<"" | "reviewed" | "not_reviewed" | "removed">("");
  const [busy, setBusy] = useState<string | null>(null);
  const load = (text = q) => community.allCourses(text).then((r) => setRows(r.courses), (e) => api.toast((e as Error).message));
  useEffect(() => {
    const t = window.setTimeout(() => load(q), 250);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);
  const act = async (c: Row, action: "reviewed" | "not_reviewed") => {
    if (action === "reviewed") { setInspection(c); return; }
    setBusy(c.id);
    try {
      await community.review(c.id, action, "", c.version);
      api.toast(`"${c.title}" marked Not reviewed`);
      await load();
      onChange();
    } catch (e) {
      api.toast((e as Error).message);
    } finally {
      setBusy(null);
    }
  };
  const shown = (rows ?? []).filter((c) => (only === "removed" ? c.status === "removed" : only ? c.status === "published" && c.review === only : true));
  return (
    <section aria-labelledby="admin-all">
      <h2 id="admin-all" className="section-title">
        All community courses {rows && `(${shown.length})`}
      </h2>
      <div className="catalog-filters">
        <input className="input" type="search" placeholder="Search by title or author" aria-label="Search community courses" value={q} onChange={(e) => setQ(e.target.value)} />
        <label className="field inline-field">
          <span>Show</span>
          <select className="select" value={only} onChange={(e) => setOnly(e.target.value as typeof only)}>
            <option value="">All</option>
            <option value="reviewed">Reviewed</option>
            <option value="not_reviewed">Not reviewed</option>
            <option value="removed">Taken down</option>
          </select>
        </label>
      </div>
      {!rows ? (
        <p className="muted small">Loading…</p>
      ) : shown.length === 0 ? (
        <p className="muted small">No courses.</p>
      ) : (
        <table className="table admin-table">
          <thead>
            <tr>
              <th scope="col">Course</th>
              <th scope="col">Author</th>
              <th scope="col">Version</th>
              <th scope="col">Status</th>
              <th scope="col">Tag</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((c) => (
              <tr key={c.id}>
                <td>
                  <b>{c.title}</b>
                  <div className="small muted">
                    {c.subject} · {c.level}
                  </div>
                </td>
                <td>{c.author}</td>
                <td>{c.version}</td>
                <td>{c.status === "published" ? "Published" : c.status === "removed" ? "Taken down" : "Unpublished"}</td>
                <td>
                  {c.status === "published" ? (
                    <div className="seg" role="group" aria-label={`Tag for ${c.title}`}>
                      <button aria-pressed={c.review === "reviewed"} disabled={busy === c.id || c.review === "reviewed"} onClick={() => act(c, "reviewed")}>
                        Reviewed
                      </button>
                      <button aria-pressed={c.review !== "reviewed"} disabled={busy === c.id || c.review !== "reviewed"} onClick={() => act(c, "not_reviewed")}>
                        Not reviewed
                      </button>
                    </div>
                  ) : (
                    <span className="muted small">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {inspection && <ReviewItem api={api} c={rows?.find(c => c.id === inspection.id) ?? inspection} onDone={() => { setInspection(null); void load(); onChange(); }} />}
    </section>
  );
}

export function ReviewItem({ api, c, onDone }: { api: AppApi; c: CommunityEntry; onDone: () => void }) {
  return <ReviewItemSession key={JSON.stringify([c.id, c.version])} api={api} c={c} onDone={onDone} />;
}

function ReviewItemSession({ api, c, onDone }: { api: AppApi; c: CommunityEntry; onDone: () => void }) {
  const [doc, setDoc] = useState<CommunityDoc | null>(null);
  const [canonicalAcknowledged, setCanonicalAcknowledged] = useState(false);
  const [readerAcknowledged, setReaderAcknowledged] = useState(false);
  const [workAcknowledged, setWorkAcknowledged] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);
  const [busy, setBusy] = useState(false);
  const operation = useRef(false);
  const alive = useRef(true);
  useEffect(() => { alive.current = true; return () => { alive.current = false; }; }, []);
  const read = async () => {
    if (operation.current) return;
    operation.current = true; setBusy(true); setDoc(null); setReadVersion(null); setAcknowledged(false); setWorkAcknowledged(false); setReaderAcknowledged(false); setCanonicalAcknowledged(false);
    try {
      const r = await community.course(c.id);
      if (!alive.current) return;
      if (r.id !== c.id || r.version !== c.version) throw Error("The published version changed. Reload the review queue before reviewing.");
      const next = upgradeDoc(r.doc);
      if (checkDoc(next, true, { communityImageOrigin: API || undefined }).length) throw Error("This course contains invalid content and cannot be reviewed.");
      setDoc(next); setReadVersion(r.version);
    } catch (e) { if (alive.current) api.toast((e as Error).message); }
    finally { operation.current = false; if (alive.current) setBusy(false); }
  };
  const [readVersion, setReadVersion] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const act = async (action: "reviewed" | "remove") => {
    if (action === "reviewed" && (!doc || readVersion !== c.version)) return api.toast("Read the current published version first.");
    if (action === "reviewed" && doc?.spreadsheetAssignments?.length && !acknowledged) return api.toast("Inspect and acknowledge the spreadsheet assignments first.");
    if (action === "reviewed" && doc && hasAssessedWork(doc) && !workAcknowledged) return api.toast("Inspect and acknowledge assessed work first.");
    if (action === "reviewed" && doc?.texts?.length && !readerAcknowledged) return api.toast("Inspect and acknowledge the reading library first.");
    if (action === "reviewed" && doc?.canonical && !canonicalAcknowledged) return api.toast("Inspect and acknowledge the entire canonical publication first.");
    if (operation.current) return;
    if (action === "remove" && !note.trim()) return api.toast("Write a note saying why; the author sees it.");
    operation.current = true; setBusy(true);
    try {
      await community.review(c.id, action, note.trim(), readVersion ?? undefined);
      api.toast(action === "reviewed" ? "Marked reviewed" : "Taken down");
      onDone();
    } catch (e) {
      if (alive.current && action === "reviewed") {
        setDoc(null); setReadVersion(null); setAcknowledged(false); setWorkAcknowledged(false); setReaderAcknowledged(false); setCanonicalAcknowledged(false);
      }
      api.toast((e as Error).message);
    } finally { operation.current = false; if (alive.current) setBusy(false); }
  };
  const exportCandidate = async () => {
    if (operation.current || !doc?.canonical || readVersion !== c.version || !canonicalAcknowledged) return;
    operation.current = true; setBusy(true);
    try {
      const candidate = await preparePromotionCandidate({ payload: doc.canonical, communityId: c.id, publishedVersion: readVersion, communityImageOrigin: API || undefined }, resolveCommunityImageDataUrl);
      if (!alive.current) return;
      const exported = await exportText(JSON.stringify(candidate, null, 2), `${c.id}-v${readVersion}-unapproved-candidate.json`, "Unapproved promotion candidate");
      if (exported && alive.current) api.toast("Unapproved candidate exported. Official authorization, licensing, review, signing, and release integrity checks are still required.");
    } catch (error) { if (alive.current) api.toast((error as Error).message); }
    finally { operation.current = false; if (alive.current) setBusy(false); }
  };
  const course = doc && !doc.canonical ? (toCourse(doc, { id: c.id, version: c.version, review: c.review, author: c.author }, imageUrl, API || undefined) as { lessons: { title: string; body: string }[]; banks: { questions: { id: string; stem: string; choices: string[]; answer: number[] }[] }[]; decks: { title: string; cards: { front: string; back: string }[] }[] }) : null;
  return (
    <section className="panel review-item">
      <h3>
        {c.title} <span className="small muted">by {c.author} · version {c.version} · {c.subject}, {c.level}</span>
      </h3>
      <p className="small">{c.description}</p>
      {!doc || readVersion !== c.version ? (
        <button className="btn sm" disabled={busy} onClick={read}>
          Read the course<span className="sr-only">: {c.title}</span>
        </button>
      ) : (
        <div className="review-read" tabIndex={0} role="region" aria-label={`Contents of ${c.title}`}>
          {doc.canonical && <>
            <CanonicalCourseInspection course={doc.canonical.course} />
            <button onClick={() => exportText(JSON.stringify(doc.canonical, null, 2), `${c.id}-v${readVersion}-authoring.json`, "Published canonical authoring payload").catch(error => api.toast((error as Error).message))}>Download exact published authoring payload</button>
            <p>Promotion preparation creates an unapproved candidate only. It does not grant official approval or source rights, sign a release, or bypass licensing and integrity checks.</p>
            <button disabled={busy || !canonicalAcknowledged || readVersion !== c.version} onClick={exportCandidate}>Export unapproved promotion candidate</button>
            <label className="field"><input type="checkbox" checked={canonicalAcknowledged} onChange={e => setCanonicalAcknowledged(e.target.checked)} />I inspected all canonical lessons, question banks, exam rules, media, activities, references, metadata, and source rights for version {readVersion}.</label>
          </>}
          {!doc.canonical && course!.lessons.map((l, i) => (
            <article key={i}>
              <h4>
                Lesson {i + 1}: {l.title}
              </h4>
              <Markdown source={l.body} />
            </article>
          ))}
          {!!doc.texts?.length && <>
            <ReadingLibraryInspection texts={doc.texts} questions={communityReaderQuestions(doc)} />
            <label className="field"><input type="checkbox" checked={readerAcknowledged} onChange={e => setReaderAcknowledged(e.target.checked)} />
              I inspected every reading text, section, source/copyright attribution, glossary entry, and linked question for version {readVersion}.
            </label>
          </>}
          {hasAssessedWork(doc) && <>
            <CourseWorkInspection work={doc} />
            <h4>Assessed-work lesson links</h4>
            <ul>{doc.lessons.flatMap(lesson => lesson.blocks.filter(block => block.type === "assignment").map((block, index) => <li key={`${lesson.id}-${index}`}>{lesson.title} ({lesson.id}): {block.kind}{block.kind === "log" ? "" : ` — ${block.id}`}</li>))}</ul>
            <label className="field"><input type="checkbox" checked={workAcknowledged} onChange={e => setWorkAcknowledged(e.target.checked)} />
              I inspected every writing prompt, rubric level, lab safety instruction, activity log requirement, and lesson assignment link for version {readVersion}.
            </label>
          </>}
          {doc.spreadsheetAssignments?.map((assignment) => (
            <article key={assignment.id} aria-label={`Spreadsheet assignment: ${assignment.title}`}>
              <h4>Spreadsheet: {assignment.title}</h4>
              <p>Assignment ID: {assignment.id} · Linked lesson: {doc.lessons.find(l => l.id === assignment.lessonId)?.title} ({assignment.lessonId})</p>
              <p>Numeric tolerance: {assignment.tolerance ?? 0}</p>
              <h5>Starter workbook (raw values and formulas)</h5>
              {Object.entries(assignment.starter.sheets).map(([sheet, cells]) => (
                <div key={sheet}><h6>Worksheet: {sheet}</h6>
                  <table className="table"><thead><tr><th scope="col">Cell</th><th scope="col">Value / formula</th></tr></thead>
                    <tbody>{Object.entries(cells).map(([address, value]) => <tr key={address}><th scope="row">{sheet}!{address}</th><td><code>{JSON.stringify(value)}</code></td></tr>)}</tbody>
                  </table>
                  {!Object.keys(cells).length && <p>Empty worksheet</p>}
                </div>
              ))}
              <h5>Protected cells</h5>
              <p>{assignment.protectedCells.join(", ") || "None"}</p>
              <h5>Grading criteria (expected values)</h5>
              <ul>{Object.entries(assignment.answers).map(([address, value]) => <li key={address}>{address}: <code>{JSON.stringify(value)}</code></li>)}</ul>
            </article>
          ))}
          {!!doc.spreadsheetAssignments?.length && <label className="field">
            <input type="checkbox" checked={acknowledged} onChange={e => setAcknowledged(e.target.checked)} />
            I inspected every spreadsheet starter, formula, protected cell, lesson link, expected answer, and tolerance for version {readVersion}.
          </label>}
          <button className="btn sm" disabled={busy} onClick={read}>Reload course contents</button>
          {!doc.canonical && course!.banks[0] && (
            <>
              <h4>Questions</h4>
              <ol className="small">
                {course!.banks[0].questions.map((q) => (
                  <li key={q.id}>
                    {q.stem} — right answer: {q.answer.map((a) => q.choices[a]).join("; ")} (choices: {q.choices.join(" / ")})
                  </li>
                ))}
              </ol>
            </>
          )}
          {!doc.canonical && course!.decks.map((k, i) => (
            <div key={i}>
              <h4>Notecards: {k.title}</h4>
              <ul className="small">
                {k.cards.map((x, j) => (
                  <li key={j}>
                    {x.front} → {x.back}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
      <label className="field" style={{ marginTop: 12 }}>
        <span>Note to the author (required to take down)</span>
        <input className="input" value={note} onChange={(e) => setNote(e.target.value)} />
      </label>
      <div className="row" style={{ marginTop: 8 }}>
        <button className="btn sm primary" disabled={busy || !doc || readVersion !== c.version || (!!doc.spreadsheetAssignments?.length && !acknowledged) || (!!doc && hasAssessedWork(doc) && !workAcknowledged) || (!!doc?.texts?.length && !readerAcknowledged) || (!!doc?.canonical && !canonicalAcknowledged)} onClick={() => act("reviewed")} title={doc && readVersion === c.version ? undefined : "Read it first"}>
          Mark version {c.version} reviewed<span className="sr-only">: {c.title}</span>
        </button>
        <button className="btn sm danger ghost" disabled={busy} onClick={() => act("remove")}>
          Take down<span className="sr-only"> {c.title}</span>
        </button>
      </div>
    </section>
  );
}

function Users({ api }: { api: AppApi }) {
  const [q, setQ] = useState("");
  const [users, setUsers] = useState<Awaited<ReturnType<typeof community.users>>["users"]>([]);
  const search = () => community.users(q).then((r) => setUsers(r.users), (e) => api.toast((e as Error).message));
  return (
    <section className="panel" style={{ marginTop: 24 }}>
      <h2>People</h2>
      <form
        className="row"
        style={{ alignItems: "flex-end" }}
        onSubmit={(e) => {
          e.preventDefault();
          search();
        }}
      >
        <label className="field grow">
          <span>Name or email</span>
          <input className="input" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
        <button className="btn" type="submit">
          Find
        </button>
      </form>
      <ul className="plain-list">
        {users.map((u) => (
          <li key={u.id} className="row" style={{ justifyContent: "space-between" }}>
            <span>
              {u.display_name} <span className="muted small">({u.email ?? u.provider}){u.banned ? " · banned" : ""}</span>
            </span>
            <span className="row">
              <label className="field inline-field">
                <span className="sr-only">Role for {u.display_name}</span>
                <select
                  className="select"
                  value={u.role}
                  onChange={async (e) => {
                    await community.setUser(u.id, { role: e.target.value }).catch((err) => api.toast((err as Error).message));
                    search();
                  }}
                >
                  <option value="author">Author</option>
                  <option value="reviewer">Reviewer</option>
                  <option value="admin">Admin</option>
                </select>
              </label>
              <button
                className="btn sm ghost"
                onClick={async () => {
                  await community.setUser(u.id, { banned: !u.banned }).catch((err) => api.toast((err as Error).message));
                  search();
                }}
              >
                {u.banned ? "Unban" : "Ban"}
                <span className="sr-only"> {u.display_name}</span>
              </button>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function hasAssessedWork(doc: CommunityDoc) { return !!(doc.writing?.length || doc.labs?.length || doc.rubrics?.length || doc.activityLog); }

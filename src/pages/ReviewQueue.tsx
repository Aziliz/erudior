import { useEffect, useState } from "react";
import type { AppApi } from "../App";
import Markdown from "../components/Markdown";
import { api as community, imageUrl, type CommunityEntry, type Me, type ReviewQueue as Queue } from "../lib/community";
import { toCourse, type CommunityDoc } from "../lib/communityFormat";

/** Reviewers: courses waiting for review, open reports, taken-down courses; admins also manage users. */
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
        <h1>Review queue</h1>
        <p className="notice error">{error}</p>
      </div>
    );
  if (!q) return <div className="page muted">Loading…</div>;

  return (
    <div className="page">
      <button className="back" onClick={() => api.go({ name: "create" })}>
        ← Your courses
      </button>
      <h1>Review queue</h1>
      <p className="muted">
        Mark a version Reviewed once you've read it and checked it's accurate, suitable for students, and not copied. Take down anything that breaks the terms;
        the author sees your note.
      </p>

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

function ReviewItem({ api, c, onDone }: { api: AppApi; c: CommunityEntry; onDone: () => void }) {
  const [doc, setDoc] = useState<CommunityDoc | null>(null);
  const [note, setNote] = useState("");
  const act = async (action: "reviewed" | "remove") => {
    if (action === "remove" && !note.trim()) return api.toast("Write a note saying why; the author sees it.");
    try {
      await community.review(c.id, action, note.trim());
      api.toast(action === "reviewed" ? "Marked reviewed" : "Taken down");
      onDone();
    } catch (e) {
      api.toast((e as Error).message);
    }
  };
  const course = doc ? (toCourse(doc, { id: c.id, version: c.version, review: c.review, author: c.author }, imageUrl) as { lessons: { title: string; body: string }[]; banks: { questions: { id: string; stem: string; choices: string[]; answer: number[] }[] }[]; decks: { title: string; cards: { front: string; back: string }[] }[] }) : null;
  return (
    <section className="panel review-item">
      <h3>
        {c.title} <span className="small muted">by {c.author} · version {c.version} · {c.subject}, {c.level}</span>
      </h3>
      <p className="small">{c.description}</p>
      {!doc ? (
        <button className="btn sm" onClick={() => community.course(c.id).then((r) => setDoc(r.doc), (e) => api.toast((e as Error).message))}>
          Read the course<span className="sr-only">: {c.title}</span>
        </button>
      ) : (
        <div className="review-read" tabIndex={0} role="region" aria-label={`Contents of ${c.title}`}>
          {course!.lessons.map((l, i) => (
            <article key={i}>
              <h4>
                Lesson {i + 1}: {l.title}
              </h4>
              <Markdown source={l.body} />
            </article>
          ))}
          {course!.banks[0] && (
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
          {course!.decks.map((k, i) => (
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
        <button className="btn sm primary" disabled={!doc} onClick={() => act("reviewed")} title={doc ? undefined : "Read it first"}>
          Mark version {c.version} reviewed<span className="sr-only">: {c.title}</span>
        </button>
        <button className="btn sm danger ghost" onClick={() => act("remove")}>
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

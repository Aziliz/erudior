import { useEffect, useState } from "react";
import type { AppApi } from "../App";
import {
  ApiError,
  api as community,
  type Me,
  type MyCourse,
} from "../lib/community";
import { ReviewPill } from "../components/CommunityCatalog";

const STATUS: Record<MyCourse["status"], string> = {
  draft: "Draft (not published)",
  published: "Published",
  unpublished: "Unpublished",
  removed: "Taken down by a reviewer",
};

/** The website's "Create" area: sign in, accept the terms, list and start community courses. */
export default function CreateHome({ api }: { api: AppApi }) {
  const [me, setMe] = useState<Me | null>(null);
  const [mine, setMine] = useState<MyCourse[] | null>(null);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const m = await community.me();
      setMe(m);
      if (m.user?.accepted) setMine(await community.mine());
    } catch (e) {
      setError((e as Error).message);
    }
  };
  useEffect(() => {
    load();
  }, []);

  if (error)
    return (
      <div className="page">
        <h1>Create a course</h1>
        <p className="notice error">{error}</p>
      </div>
    );
  if (!me) return <div className="page muted">Loading…</div>;
  if (!me.user) return <SignIn me={me} />;
  if (!me.user.accepted)
    return <Accept api={api} onDone={load} changed={!!me.user.termsChanged} />;

  const u = me.user;
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Your community courses</h1>
          <p className="muted">
            Signed in as {u.name}
            {u.role !== "author" && ` (${u.role})`}. Courses you publish appear
            in everyone's Library tagged Not reviewed until a reviewer checks
            them.
          </p>
        </div>
        <div className="row">
          <button
            className="btn primary"
            onClick={async () => {
              try {
                const id = await community.create();
                api.go({ name: "communityEdit", id });
              } catch (e) {
                api.toast((e as Error).message);
              }
            }}
          >
            New course
          </button>
        </div>
      </div>

      {!mine ? (
        <p className="muted">Loading…</p>
      ) : mine.length === 0 ? (
        <div className="panel">
          <h2 style={{ fontSize: "1.0625rem" }}>No courses yet</h2>
          <p className="muted">
            Choose New course to start one. Lessons are built from blocks:
            headings, text, lists, images and questions, plus notecard decks.
          </p>
        </div>
      ) : (
        <ul className="plain-list my-courses">
          {mine.map((c) => (
            <li key={c.id} className="panel">
              <div className="row" style={{ justifyContent: "space-between" }}>
                <div>
                  <h2 style={{ fontSize: "1.0625rem" }}>{c.title}</h2>
                  <p className="small muted">
                    {STATUS[c.status]}
                    {c.version > 0 && ` · version ${c.version}`}{" "}
                    {c.status === "published" && (
                      <ReviewPill review={c.review} />
                    )}
                    {c.openReports > 0 &&
                      ` · ${c.openReports} open report${c.openReports === 1 ? "" : "s"}`}
                    {c.role === "editor" && " · you're an editor"}
                  </p>
                  {c.reviewNote && (
                    <p className="small">Reviewer's note: {c.reviewNote}</p>
                  )}
                </div>
                <div className="row">
                  <button
                    className="btn sm"
                    onClick={() => api.go({ name: "communityEdit", id: c.id })}
                  >
                    {c.status === "removed" ? "View" : "Edit"}
                    <span className="sr-only"> {c.title}</span>
                  </button>
                  {c.role !== "editor" && (
                    <button
                      className="btn sm ghost"
                      onClick={async () => {
                        if (
                          !window.confirm(
                            `Delete "${c.title}"? It disappears from everyone's catalog; copies people already added stay on their devices.`,
                          )
                        )
                          return;
                        await community
                          .remove(c.id)
                          .catch((e) => api.toast((e as Error).message));
                        load();
                      }}
                    >
                      Delete<span className="sr-only"> {c.title}</span>
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <NameForm api={api} name={u.name} onDone={load} />
      <button
        className="btn ghost"
        style={{ marginTop: 16 }}
        onClick={async () => {
          await community.logout().catch(() => {});
          load();
        }}
      >
        Sign out
      </button>
    </div>
  );
}

function SignIn({ me }: { me: Me }) {
  const ret = "/?create";
  const [name, setName] = useState("Test author");
  const [role, setRole] = useState("author");
  const any = me.providers.google || me.providers.github || me.providers.dev;
  return (
    <div className="page">
      <h1>Create a course</h1>
      <p className="muted">
        Anyone 18 or older can write a free course for the community. Sign in to
        start; we keep only your name, email and the courses you write.
      </p>
      <div className="row" style={{ marginTop: 16 }}>
        {me.providers.google && (
          <a className="btn primary" href={communityUrl("google", ret)}>
            Sign in with Google
          </a>
        )}
        {me.providers.github && (
          <a className="btn" href={communityUrl("github", ret)}>
            Sign in with GitHub
          </a>
        )}
      </div>
      {!any && (
        <p className="notice">Sign-in isn't set up on this server yet.</p>
      )}
      {me.providers.dev && (
        <form
          className="panel"
          style={{ marginTop: 24 }}
          onSubmit={(e) => {
            e.preventDefault();
            window.location.href = community.signInUrl("dev", ret, name, role);
          }}
        >
          <h2 style={{ fontSize: "1rem" }}>Development sign-in</h2>
          <p className="small muted">Only on a local test server.</p>
          <div className="row" style={{ alignItems: "flex-end" }}>
            <label className="field">
              <span>Name</span>
              <input
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label className="field">
              <span>Role</span>
              <select
                className="select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="author">Author</option>
                <option value="reviewer">Reviewer</option>
                <option value="admin">Admin</option>
              </select>
            </label>
            <button className="btn" type="submit">
              Sign in (dev)
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

const communityUrl = (p: "google" | "github", ret: string) =>
  community.signInUrl(p, ret);

function Accept({
  api,
  onDone,
  changed,
}: {
  api: AppApi;
  onDone: () => void;
  changed: boolean;
}) {
  const [adult, setAdult] = useState(false);
  const [terms, setTerms] = useState(false);
  const [msg, setMsg] = useState("");
  return (
    <form
      className="page"
      onSubmit={async (e) => {
        e.preventDefault();
        if (!adult || !terms) return setMsg("Check both boxes to continue.");
        try {
          await community.accept();
          onDone();
        } catch (err) {
          setMsg(err instanceof ApiError ? err.message : String(err));
        }
      }}
    >
      <h1>{changed ? "The community terms changed" : "Before you write"}</h1>
      {changed && (
        <p className="notice" style={{ marginBottom: 12 }}>
          Please read and accept the new terms to keep writing and editing. The
          main change: published community courses now belong to Erudior, and
          you, your editors and Erudior can keep them up to date.
        </p>
      )}
      <section className="panel terms">
        <h2>Community course terms</h2>
        <ul>
          <li>You're 18 or older.</li>
          <li>
            Courses teach real, factual subjects: school subjects, skills,
            languages, professions and exams, history, science and the like. Fan
            wikis, game guides and theories, fictional lore, opinion pieces and
            similar content aren't allowed here (share them elsewhere); they'll
            be removed.
          </li>
          <li>
            You wrote what you publish, or you have the right to share it.
            Credit sources; don't copy from textbooks or websites that don't
            allow it.
          </li>
          <li>
            When you publish a course, you transfer ownership of it (its
            copyright) to Erudior, so it can stay free for everyone and be kept
            up to date. Your name shows as its author while you look after it.
          </li>
          <li>
            You can keep changing your course, and you can add editors who may
            change it too. Erudior can also change it or take it down. If you
            don't sign in for a year, another author may take it over to keep it
            current; you stay on as an editor.
          </li>
          <li>
            No personal information: never put students' names, photos of
            students, addresses or similar in a course.
          </li>
          <li>
            Nothing hateful, sexual, violent, or unsuitable for students; no ads
            or spam.
          </li>
          <li>
            Courses go live tagged Not reviewed. Reviewers may mark them
            Reviewed, ask for changes, or take them down. Anyone can report a
            course.
          </li>
          <li>We can remove courses or accounts that break these terms.</li>
        </ul>
        <p className="small muted">
          These are in addition to Erudior's{" "}
          <button
            type="button"
            className="linkish"
            onClick={() => api.go({ name: "legal", page: "terms" })}
          >
            Terms of Use
          </button>
          .
        </p>
      </section>
      <label className="check" style={{ marginTop: 16 }}>
        <input
          type="checkbox"
          checked={adult}
          onChange={(e) => setAdult(e.target.checked)}
        />
        I'm 18 or older
      </label>
      <label className="check" style={{ marginTop: 8 }}>
        <input
          type="checkbox"
          checked={terms}
          onChange={(e) => setTerms(e.target.checked)}
        />
        I accept the community course terms
      </label>
      <p
        className={msg ? "notice error" : "sr-only"}
        role="alert"
        style={{ marginTop: 12 }}
      >
        {msg}
      </p>
      <div className="row" style={{ marginTop: 16 }}>
        <button className="btn primary" type="submit">
          Continue
        </button>
        <button
          className="btn ghost"
          type="button"
          onClick={() => api.go({ name: "library" })}
        >
          Not now
        </button>
      </div>
    </form>
  );
}

function NameForm({
  api,
  name,
  onDone,
}: {
  api: AppApi;
  name: string;
  onDone: () => void;
}) {
  const [v, setV] = useState(name);
  return (
    <form
      className="row"
      style={{ marginTop: 24, alignItems: "flex-end" }}
      onSubmit={async (e) => {
        e.preventDefault();
        try {
          await community.rename(v);
          api.toast("Name saved");
          onDone();
        } catch (err) {
          api.toast((err as Error).message);
        }
      }}
    >
      <label className="field">
        <span>Name shown on your courses</span>
        <input
          className="input"
          value={v}
          maxLength={60}
          onChange={(e) => setV(e.target.value)}
        />
      </label>
      <button className="btn" type="submit">
        Save name
      </button>
    </form>
  );
}

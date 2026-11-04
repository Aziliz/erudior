import { useState } from "react";
import type { AppApi } from "../App";
import { courseSlug } from "../lib/routes";
import { CATALOG, catalogEntry, prerequisites } from "../lib/catalog";

/** A catalog course before it's started: description, details and the lesson plan. */
export default function CourseOverview({ api, id, requestedPath }: { api: AppApi; id: string; requestedPath?: string }) {
  const e = catalogEntry(id);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  if (!e)
    return (
      <div className="page">
        <button className="back" onClick={() => api.go({ name: "library" })}>
          ← Library
        </button>
        <p className="muted">That course isn't in the catalog.</p>
      </div>
    );

  const started = api.courses.some((c) => c.id === e.id);
  const missing = prerequisites(e, api.progress).filter((r) => !r.done);
  const locked = !api.publicLearning && !started && missing.length > 0;
  async function start(path = requestedPath) {
    if (adding) return;
    setAdding(true); setError("");
    try { await api.addCourse(e!.id, path); }
    catch (err) { setError(`Could not open this course: ${String(err)}. Please retry.`); }
    finally { setAdding(false); }
  }
  const lessonCount = (e.outline ?? []).reduce((s, m) => s + m.lessons.length + (m.honors?.length ?? 0), 0);
  let n = 0;

  return (
    <div className="page overview">
      <button className="back" onClick={() => api.go({ name: "library" })}>
        ← Library
      </button>
      <div className="page-head">
        <div>
          <div className="catalog-tags" style={{ marginBottom: 8 }}>
            <span className="pill neutral">{e.subject}</span>
            {e.level.map((l) => (
              <span key={l} className="pill neutral">
                {l}
              </span>
            ))}
            {e.type.map((t) => (
              <span key={t} className="pill neutral">
                {t}
              </span>
            ))}
          </div>
          <h1>{e.title}</h1>
        </div>
        <div className="row">
          {started ? (
            <button className="btn primary" disabled={adding} onClick={() => requestedPath ? start() : api.go({ name: "course", courseId: e.id })}>
              Open course
            </button>
          ) : (
            <button className="btn primary" disabled={adding || locked} onClick={() => start()}>
              {locked ? "🔒 Locked" : adding ? "Opening…" : requestedPath ? "Open linked activity" : api.publicLearning ? "Open course" : "Start course"}
            </button>
          )}
        </div>
      </div>

      {error && <p className="notice error" role="alert">{error}</p>}
      {api.publicLearning && <section className="panel" aria-label="Public learning access">
        <h2 className="section-title">Read and practice freely</h2>
        <p>No account or prerequisite completion is needed for independent study. These practice results are not supervised credit or a certificate.</p>
        {missing.length > 0 && <p><b>Recommended background:</b> {missing.map(r => r.title).join(", ")}. You can review it first or explore this course now.</p>}
        <button className="btn" disabled={adding} onClick={() => start(`/${courseSlug(e.id, CATALOG)}/lessons`)}>Browse lessons</button>
      </section>}
      {locked && (
        <section className="panel locked-note" role="note">
          <h2 className="section-title">🔒 Finish {missing.map((r) => r.title).join(" and ")} first</h2>
          {missing.map((r) => (
            <p key={r.id}>
              {r.title}: {r.lessonsDone} of {r.lessons} lessons complete. Complete every lesson, or pass its full practice exam
              if you already know the material, to unlock this course.{" "}
              <button className="linklike" onClick={() => api.go({ name: "overview", catalogId: r.id })}>
                Go to {r.title}
              </button>
            </p>
          ))}
        </section>
      )}

      <section className="panel overview-about">
        <h2 className="section-title">Overview</h2>
        <p>{e.description}</p>
        {e.disclaimer && (
          <p className="notice course-disclaimer small">
            <b>Disclaimer:</b> {e.disclaimer}
          </p>
        )}
        <p className="meta small muted">
          {[
            e.lessons && `${e.lessons} lessons`,
            e.honors && `${e.honors} honors lessons`,
            e.questions && `${e.questions} questions`,
            e.words && (e.carried ? `${e.words} words (${e.words - e.carried} new, ${e.carried} carried over)` : `${e.words} words to learn`),
            e.cards && !e.words && `${e.cards} notecards`,
            e.drills && `${e.drills} practice drills`,
          ]
            .filter(Boolean)
            .join(", ")}
        </p>
      </section>

      <h2 className="section-title" style={{ marginTop: 28 }}>
        Lesson plan
      </h2>
      {lessonCount === 0 ? (
        <p className="muted small">No lesson plan listed for this course.</p>
      ) : (
        <ol className="lesson-plan">
          {(e.outline ?? []).map((m, i) => (
            <li key={i} className="lesson-plan-module">
              <h3>
                <span className="muted">Module {i + 1}.</span> {m.title} {m.isHonors && <span className="pill honors">Honors · optional</span>}
              </h3>
              {m.lessons.length > 0 && (
                <ol>
                  {m.lessons.map((t) => {
                    n += 1;
                    return (
                      <li key={n} value={n}>
                        {t}
                      </li>
                    );
                  })}
                </ol>
              )}
              {(m.honors?.length ?? 0) > 0 && (
                <ul className="honors-list">
                  {m.honors!.map((t) => (
                    <li key={t}>
                      {t} {!m.isHonors && <span className="pill honors">Honors</span>}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

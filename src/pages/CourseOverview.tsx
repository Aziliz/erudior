import { useState } from "react";
import type { AppApi } from "../App";
import { catalogEntry, prerequisites } from "../lib/catalog";

/** A catalog course before it's started: description, details and the lesson plan. */
export default function CourseOverview({ api, id }: { api: AppApi; id: string }) {
  const e = catalogEntry(id);
  const [adding, setAdding] = useState(false);
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
  const locked = !started && missing.length > 0;
  async function start() {
    setAdding(true);
    await api.addCourse(e!.id);
    setAdding(false);
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
            <button className="btn primary" onClick={() => api.go({ name: "course", courseId: e.id })}>
              Open course
            </button>
          ) : (
            <button className="btn primary" disabled={adding || locked} onClick={start}>
              {locked ? "🔒 Locked" : adding ? "Adding…" : "Start course"}
            </button>
          )}
        </div>
      </div>

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

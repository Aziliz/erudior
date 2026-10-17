import { useState } from "react";
import type { AppApi } from "../App";
import { catalogEntry } from "../lib/catalog";

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
  async function start() {
    setAdding(true);
    await api.addCourse(e!.id);
    setAdding(false);
  }
  const lessonCount = (e.outline ?? []).reduce((s, m) => s + m.lessons.length, 0);
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
            <button className="btn primary" disabled={adding} onClick={start}>
              {adding ? "Adding…" : "Start course"}
            </button>
          )}
        </div>
      </div>

      <section className="panel overview-about">
        <h2 className="section-title">Overview</h2>
        <p>{e.description}</p>
        <p className="meta small muted">
          {[
            e.lessons && `${e.lessons} lessons`,
            e.questions && `${e.questions} questions`,
            e.words && `${e.words} words to learn`,
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
                <span className="muted">Module {i + 1}.</span> {m.title}
              </h3>
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
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

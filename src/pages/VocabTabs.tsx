import { useMemo, useState } from "react";
import type { AppApi } from "../App";
import type { Course } from "../lib/types";
import { directions, stageLabel, stateOf, STAGES, vocabKey, vocabSummary } from "../lib/vocab";
import { lessonKey } from "../lib/planner";
import { SpeakButton } from "./VocabRunner";

export function VocabTab({ api, course }: { api: AppApi; course: Course }) {
  const { progress } = api;
  const lang = course.language;
  const s = vocabSummary(course, progress);
  const [filter, setFilter] = useState<"all" | "unlocked" | "learning" | "learned">("unlocked");
  const lessonTitle = useMemo(() => new Map(course.lessons.map((l) => [l.id, l.title])), [course]);
  const target = lang?.vocabTarget;

  const rows = (course.vocab ?? []).filter((v) => {
    const open = !!progress.lessonsDone[lessonKey(course.id, v.lesson)];
    const learned = directions(v).every((d) => stateOf(progress, vocabKey(course.id, v.id, d)).done);
    if (filter === "all") return true;
    if (filter === "unlocked") return open;
    if (filter === "learned") return open && learned;
    return open && !learned;
  });
  const groups = new Map<string, typeof rows>();
  for (const r of rows) groups.set(r.lesson, [...(groups.get(r.lesson) ?? []), r]);
  const lessonOrder = course.lessons.map((l) => l.id);
  const ordered = [...groups.entries()].sort((a, b) => lessonOrder.indexOf(a[0]) - lessonOrder.indexOf(b[0]));

  return (
    <div className="stack">
      <section className="panel review-banner">
        <div>
          <h2>Vocabulary reviews</h2>
          <p className="muted small" style={{ maxWidth: "62ch" }}>
            Words join your reviews when you finish the lesson that teaches them. Type each answer: 5 right in a row moves a word
            up a level (Novice, Beginner, Advanced, Expert), and a miss starts that level's count over. After Expert the word
            is learned. Each word counts once a day; extra practice never changes your levels.
          </p>
        </div>
        <div className="row">
          <button
            className="btn"
            disabled={!s.unlocked}
            onClick={() => api.go({ name: "vocab", courseId: course.id, mode: "practice", count: 20 })}
          >
            Extra practice
          </button>
          <button
            className="btn primary"
            disabled={!s.due}
            onClick={() => api.go({ name: "vocab", courseId: course.id, mode: "review" })}
          >
            {s.due ? `Review ${s.due} due` : "No reviews due"}
          </button>
        </div>
      </section>

      <section className="panel">
        <div className="vocab-stats">
          <div>
            <strong>{s.unlocked}</strong>
            <span className="muted">of {s.total} words unlocked</span>
          </div>
          <div>
            <strong>{s.learned}</strong>
            <span className="muted">words learned</span>
          </div>
          {STAGES.map((name, i) => (
            <div key={name}>
              <strong>{s.byStage[i]}</strong>
              <span className="muted">{name} cards</span>
            </div>
          ))}
        </div>
        {target && (
          <p className="muted small" style={{ marginTop: 12 }}>
            {lang?.level ? `${lang.level}: ` : ""}about {target.toLocaleString()} words is the recommended minimum for this level
            {lang?.vocabSource ? ` (${lang.vocabSource})` : ""}. This course teaches {s.total.toLocaleString()}.
          </p>
        )}
      </section>

      <section className="panel">
        <div className="row" style={{ justifyContent: "space-between", marginBottom: 12 }}>
          <h2 style={{ margin: 0 }}>Word list</h2>
          <select aria-label="Show words" value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)}>
            <option value="unlocked">Unlocked</option>
            <option value="learning">Still learning</option>
            <option value="learned">Learned</option>
            <option value="all">All, including locked</option>
          </select>
        </div>
        {!ordered.length && (
          <p className="muted">{filter === "unlocked" ? "Finish a lesson to unlock its words." : "Nothing here yet."}</p>
        )}
        {ordered.map(([lessonId, items]) => {
          const open = !!progress.lessonsDone[lessonKey(course.id, lessonId)];
          return (
            <div key={lessonId} className="vocab-group">
              <h3>
                {lessonTitle.get(lessonId) ?? lessonId}
                {!open && <span className="muted small"> · locked until you finish the lesson</span>}
              </h3>
              <table className="table vocab-table">
                <tbody>
                  {items.map((v) => (
                    <tr key={v.id}>
                      <td lang={lang?.code}>
                        <span className="vocab-term">{v.term}</span>
                        <SpeakButton text={v.term} lang={lang?.tts} />
                        {v.plural && <div className="muted small">pl. {v.plural}</div>}
                      </td>
                      <td>{v.meanings.join("; ")}</td>
                      <td className="muted small">
                        {open &&
                          directions(v).map((d) => (
                            <div key={d}>
                              {d === "meaning" ? "→ English" : `→ ${lang?.name ?? "word"}`}: {stageLabel(stateOf(progress, vocabKey(course.id, v.id, d)))}
                            </div>
                          ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </section>
    </div>
  );
}

export function ReadingTab({ course }: { course: Course }) {
  const list = course.readingList ?? [];
  return (
    <div className="stack">
      <section className="panel">
        <h2>Reading list</h2>
        <p className="muted small" style={{ maxWidth: "62ch" }}>
          Books and texts written for learners at this level. Try reading on your own: aim to follow the story, not every word.
        </p>
        <ul className="reading-list">
          {list.map((r, i) => (
            <li key={i}>
              <div>
                {r.url ? (
                  <a href={r.url} target="_blank" rel="noreferrer">
                    <strong>{r.title}</strong>
                  </a>
                ) : (
                  <strong>{r.title}</strong>
                )}
                {r.free && <span className="pill">Free</span>}
                {r.level && <span className="pill">{r.level}</span>}
              </div>
              <div className="muted small">
                {[r.author, r.publisher, r.isbn && `ISBN ${r.isbn}`].filter(Boolean).join(" · ")}
              </div>
              {r.note && <p className="small">{r.note}</p>}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

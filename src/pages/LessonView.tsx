import type { AppApi } from "../App";
import type { Course, Lesson } from "../lib/types";
import Markdown from "../components/Markdown";
import { lessonKey, logActivity, orderedLessons } from "../lib/planner";
import { today } from "../lib/srs";
import { startPractice } from "../lib/session";
import { mainBank } from "./CourseHome";

export default function LessonView({ api, course, lesson }: { api: AppApi; course: Course; lesson: Lesson }) {
  const key = lessonKey(course.id, lesson.id);
  const done = !!api.progress.lessonsDone[key];
  const ordered = orderedLessons(course);
  const i = ordered.findIndex((l) => l.id === lesson.id);
  const prev = ordered[i - 1];
  const next = ordered[i + 1];
  const moduleIdx = course.modules.findIndex((m) => m.id === lesson.module);
  const module = course.modules[moduleIdx];

  const topics = lesson.topics ?? [];
  const bank = mainBank(course);
  const topicQs = bank ? bank.questions.filter((q) => topics.includes(q.topic)).length : 0;
  const topicCards = course.decks.reduce((s, d) => s + d.cards.filter((c) => c.topic && topics.includes(c.topic)).length, 0);

  const goLesson = (id: string) => api.go({ name: "lesson", courseId: course.id, lessonId: id });

  async function toggleDone() {
    await api.updateProgress((p) => {
      const lessonsDone = { ...p.lessonsDone };
      if (lessonsDone[key]) {
        delete lessonsDone[key];
        return { ...p, lessonsDone };
      }
      lessonsDone[key] = today();
      return logActivity({ ...p, lessonsDone }, "lessons");
    });
  }

  async function completeAndNext() {
    if (!done) await toggleDone();
    if (next) goLesson(next.id);
    else api.go({ name: "course", courseId: course.id, tab: "lessons" });
  }

  return (
    <div className="page lesson-page">
      <button className="back" onClick={() => api.go({ name: "course", courseId: course.id, tab: "lessons" })}>
        ← {course.title}
      </button>
      <header className="lesson-head">
        <p className="muted small">
          {module && `Module ${moduleIdx + 1}: ${module.title}`}
          {lesson.minutes ? `, about ${lesson.minutes} min` : ""}
        </p>
        <h1>{lesson.title}</h1>
      </header>

      <article className="lesson-body">
        <Markdown source={lesson.body} glossary={course.glossary} />
      </article>

      {(topicQs > 0 || topicCards > 0) && (
        <section className="panel lesson-practice">
          <h2>Check yourself</h2>
          <div className="row" style={{ marginTop: 10 }}>
            {bank && topicQs > 0 && (
              <button
                className="btn"
                onClick={() =>
                  api.go({
                    name: "run",
                    session: startPractice(bank, api.progress, {
                      count: Math.min(10, topicQs),
                      topics,
                      sections: [],
                      filter: "all",
                      shuffleChoices: true,
                    }),
                  })
                }
              >
                Practice {Math.min(10, topicQs)} questions on this
              </button>
            )}
            {topicCards > 0 && (
              <button
                className="btn"
                onClick={() =>
                  api.go({ name: "cards", courseId: course.id, deckIds: course.decks.map((d) => d.id), mode: "cram", topics })
                }
              >
                Flip through {topicCards} related notecards
              </button>
            )}
          </div>
        </section>
      )}

      <footer className="lesson-foot">
        <button className="btn" disabled={!prev} onClick={() => prev && goLesson(prev.id)}>
          Previous
        </button>
        <label className="check">
          <input type="checkbox" checked={done} onChange={toggleDone} />
          Lesson complete
        </label>
        <button className="btn primary" onClick={completeAndNext}>
          {next ? (done ? "Next lesson" : "Complete and continue") : done ? "Back to lessons" : "Complete"}
        </button>
      </footer>
    </div>
  );
}

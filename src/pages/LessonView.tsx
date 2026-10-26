import type { AppApi } from "../App";
import { isHonorsLesson } from "../lib/course";
import type { Course, Lesson } from "../lib/types";
import Markdown from "../components/Markdown";
import { lessonKey, logActivity, orderedLessons } from "../lib/planner";
import { today } from "../lib/srs";
import { lessonQuizNeeded, lessonQuizQuestions, pretestQuestions, startLessonQuiz, startPretest } from "../lib/session";
import { useState } from "react";
import { bestQuizScore } from "../lib/quiz";
import { mainBank } from "./CourseHome";
import { SpeakButton } from "./VocabRunner";
import { CalcDock } from "../components/Calculator";
import { calcKind } from "../lib/calcKind";

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
  const words = (course.vocab ?? []).filter((v) => v.lesson === lesson.id && !v.from);
  const lang = course.language;
  const bank = mainBank(course);
  const lessonDrills = course.drills.filter((d) => lesson.drills?.includes(d.id));
  const lessonRefs = (lesson.refs ?? []).map((id) => course.references.find((r) => r.id === id)).filter((r) => !!r);
  const topicCards = course.decks.reduce((s, d) => s + d.cards.filter((c) => c.topic && topics.includes(c.topic)).length, 0);

  const goLesson = (id: string) => api.go({ name: "lesson", courseId: course.id, lessonId: id });

  // End-of-lesson quiz: when the lesson has one, passing it is how the lesson gets completed.
  const quizQs = lessonQuizQuestions(bank, lesson.quiz);
  const hasQuiz = !!bank && quizQs.length > 0;
  const needed = lessonQuizNeeded(quizQs.length);
  const best = bestQuizScore(api.progress, course.id, { lessonId: lesson.id });
  // Warm-up before a first read: offered once per lesson, picked when the lesson opens.
  const [warmup] = useState(() => {
    if (done || api.progress.pretests?.[key] || isHonorsLesson(course, lesson)) return [];
    // Questions outside the lesson's own quiz first; its quiz questions fill in (classic pretesting).
    const quizIds = new Set(lesson.quiz ?? []);
    return pretestQuestions(bank, quizIds, topics, api.progress);
  });
  const [warmupClosed, setWarmupClosed] = useState(false);
  const markWarmup = () => api.updateProgress((p) => ({ ...p, pretests: { ...(p.pretests ?? {}), [key]: today() } }));
  function startWarmup() {
    if (!bank) return;
    markWarmup();
    api.go({ name: "run", session: startPretest(bank, { courseId: course.id, lessonId: lesson.id }, warmup) });
  }
  function takeQuiz() {
    if (!bank) return;
    api.go({ name: "run", session: startLessonQuiz(bank, { courseId: course.id, lessonId: lesson.id }, lesson.quiz ?? []) });
  }

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
    if (!done && hasQuiz) return takeQuiz();
    if (!done) await toggleDone();
    if (next) goLesson(next.id);
    else api.go({ name: "course", courseId: course.id, tab: "lessons" });
  }

  return (
    <div className="page lesson-page">
      <CalcDock kind={calcKind(course)} />
      <button className="back" onClick={() => api.go({ name: "course", courseId: course.id, tab: "lessons" })}>
        ← {course.title}
      </button>
      <header className="lesson-head">
        <p className="muted small">
          {module && `Module ${moduleIdx + 1}: ${module.title}`}
          {lesson.minutes ? `, about ${lesson.minutes} min` : ""}
        </p>
        <h1>{lesson.title}</h1>
        {isHonorsLesson(course, lesson) && (
          <p className="small">
            <span className="pill honors">Honors · optional</span>{" "}
            <span className="muted">Extra depth for students ready for more. It isn't needed to finish the {module?.honors ? "course" : "module"}; study time still counts.</span>
          </p>
        )}
      </header>

      {warmup.length > 0 && !warmupClosed && (
        <section className="panel warmup" aria-labelledby="warmup-h">
          <h2 id="warmup-h">Warm up first</h2>
          <p className="small muted">
            {warmup.length} quick questions on what this lesson covers. You aren&rsquo;t expected to know them yet: trying first helps the lesson stick,
            even when you get them wrong. They don&rsquo;t count toward your scores.
          </p>
          <div className="row">
            <button className="btn primary sm" onClick={startWarmup}>
              Start the warm-up
            </button>
            <button
              className="btn sm ghost"
              onClick={() => {
                markWarmup();
                setWarmupClosed(true);
              }}
            >
              Skip
            </button>
          </div>
        </section>
      )}

      <article className="lesson-body">
        <Markdown source={lesson.body} glossary={course.glossary} foreignLang={course.language?.code} />
      </article>

      {words.length > 0 && (
        <section className="panel lesson-words">
          <h2>New words ({words.length})</h2>
          <p className="muted small" style={{ marginTop: 6 }}>
            These join your vocabulary reviews when you complete the lesson.
          </p>
          <table className="table vocab-table">
            <tbody>
              {words.map((v) => (
                <tr key={v.id}>
                  <td lang={lang?.code}>
                    <span className="vocab-term">{v.term}</span>
                    <SpeakButton text={v.term} lang={lang?.tts} />
                    {v.plural && <div className="muted small">pl. {v.plural}</div>}
                  </td>
                  <td>
                    {v.meanings.join("; ")}
                    {v.example && (
                      <div className="muted small">
                        <span lang={lang?.code}>{v.example}</span>
                        {v.exampleEn && ` — ${v.exampleEn}`}
                      </div>
                    )}
                  </td>
                  <td className="muted small">{v.pos}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="row" style={{ marginTop: 10 }}>
            <button
              className="btn"
              onClick={() => api.go({ name: "vocab", courseId: course.id, mode: "practice", lessonIds: [lesson.id] })}
            >
              Practice these words
            </button>
          </div>
        </section>
      )}

      {hasQuiz && (
        <section className="panel lesson-quiz">
          <h2>End-of-lesson quiz</h2>
          <p className="muted" style={{ marginTop: 6 }}>
            {quizQs.length} question{quizQs.length === 1 ? "" : "s"} on this lesson. Get {needed} right to complete it; you see
            the answer and explanation after each one.
            {best && ` Best so far: ${best.correct} of ${best.total}.`}
          </p>
          <div className="row" style={{ marginTop: 10 }}>
            <button className={done ? "btn" : "btn primary"} onClick={takeQuiz}>
              {best ? "Retake the quiz" : "Take the quiz"}
            </button>
            {done && <span className="pill pass">Complete</span>}
          </div>
        </section>
      )}

      {(topicCards > 0 || lessonDrills.length > 0 || lessonRefs.length > 0) && (
        <section className="panel lesson-practice">
          <h2>Study tools</h2>
          <div className="row" style={{ marginTop: 10 }}>
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
            {lessonDrills.length > 0 && (
              <button
                className="btn"
                onClick={() =>
                  api.go({ name: "drill", courseId: course.id, drillIds: lessonDrills.map((d) => d.id), count: 5 })
                }
              >
                Practice the math ({lessonDrills.length} drill{lessonDrills.length === 1 ? "" : "s"})
              </button>
            )}
            {lessonRefs.map((r) => (
              <button key={r.id} className="btn" onClick={() => api.go({ name: "ref", courseId: course.id, refId: r.id })}>
                Quick reference: {r.title}
              </button>
            ))}
          </div>
        </section>
      )}

      <footer className="lesson-foot">
        <button className="btn" disabled={!prev} onClick={() => prev && goLesson(prev.id)}>
          Previous
        </button>
        <label className="check" title={hasQuiz && !done ? "Pass the end-of-lesson quiz to complete this lesson" : undefined}>
          <input type="checkbox" checked={done} onChange={toggleDone} disabled={hasQuiz && !done} />
          Lesson complete
        </label>
        <button className="btn primary" onClick={completeAndNext}>
          {!done && hasQuiz
            ? "Take the quiz"
            : next
              ? done
                ? "Next lesson"
                : "Complete and continue"
              : done
                ? "Back to lessons"
                : "Complete"}
        </button>
      </footer>
    </div>
  );
}

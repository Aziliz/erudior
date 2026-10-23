import { useState } from "react";
import MathText from "../components/MathText";
import QuestionBody, { QuestionImage, QuestionStem } from "../components/QuestionBody";
import { isChoice, qtype } from "../lib/questions";
import type { AppApi, View } from "../App";
import type { Attempt, Bank } from "../lib/types";
import { lessonQuizNeeded, startLessonQuiz, startModuleQuiz, startPractice } from "../lib/session";
import { orderedLessons } from "../lib/planner";
import { LETTERS, formatDateTime, formatDuration, percent } from "../lib/util";
import { SectionTable, TallyTable } from "../components/Bars";
import { attemptPassed } from "../lib/session";

type Filter = "wrong" | "flagged" | "all";

export default function Results({
  api,
  attempt,
  bank,
  back,
}: {
  api: AppApi;
  attempt: Attempt;
  bank: Bank | undefined;
  back: View;
}) {
  const pct = percent(attempt.correct, attempt.total);
  const isExam = attempt.mode === "exam";
  const passed = attemptPassed(attempt);
  const marks = attempt.sectionPassing && Object.keys(attempt.sectionPassing).length ? attempt.sectionPassing : undefined;
  const wrong = attempt.answers.filter((a) => !a.correct);
  const flagged = attempt.answers.filter((a) => a.flagged);
  const [filter, setFilter] = useState<Filter>(wrong.length ? "wrong" : "all");

  const qById = new Map(bank?.questions.map((q) => [q.id, q]) ?? []);
  const course = bank?.courseId ? api.courses.find((c) => c.id === bank.courseId) : undefined;
  const [noteFor, setNoteFor] = useState<string | null>(null);
  const all = api.progress.qmeta ?? {};
  const meta = Object.fromEntries(attempt.answers.map((a) => [a.qid, all[`${attempt.bankId}/${a.qid}`]]));
  const setMeta = (qid: string, patch: { flag?: boolean; note?: string }) => {
    const key = `${attempt.bankId}/${qid}`;
    api.updateProgress((p) => ({ ...p, qmeta: { ...(p.qmeta ?? {}), [key]: { ...(p.qmeta?.[key] ?? {}), ...patch } } }));
  };
  const toggleFlag = (qid: string) => setMeta(qid, { flag: meta[qid]?.flag ? undefined : true });
  const editNote = (qid: string) => setNoteFor(noteFor === qid ? null : qid);
  const saveNote = (qid: string, text: string) => setMeta(qid, { note: text.trim() ? text : undefined });
  const shown = (filter === "wrong" ? wrong : filter === "flagged" ? flagged : attempt.answers).map((a) => ({
    rec: a,
    q: qById.get(a.qid),
    n: attempt.answers.indexOf(a) + 1,
  }));
  const missingQs = shown.filter((s) => !s.q).length;

  // End-of-lesson quiz context.
  const quizLesson = attempt.lesson && course?.lessons.find((l) => l.id === attempt.lesson!.lessonId);
  const lessonOrder = course ? orderedLessons(course) : [];
  const nextLesson = quizLesson ? lessonOrder[lessonOrder.findIndex((l) => l.id === quizLesson.id) + 1] : undefined;
  const goLesson = (id: string) => course && api.go({ name: "lesson", courseId: course.id, lessonId: id });
  // End-of-module quiz context.
  const quizModule = attempt.module && course?.modules.find((m) => m.id === attempt.module!.moduleId);
  // After a lesson quiz, the module quiz comes next when this was the module's last lesson.
  const lessonModule = quizLesson && course?.modules.find((m) => m.id === quizLesson.module);
  const moduleNext =
    lessonModule?.quiz?.length &&
    (!nextLesson || nextLesson.module !== lessonModule.id) &&
    course!.lessons.filter((l) => l.module === lessonModule.id).every((l) => api.progress.lessonsDone[`${course!.id}/${l.id}`])
      ? lessonModule
      : undefined;
  const afterModule = quizModule ? lessonOrder.find((l) => course!.modules.findIndex((m) => m.id === l.module) > course!.modules.findIndex((m) => m.id === quizModule.id)) : undefined;
  const toLessons = () => course && api.go({ name: "course", courseId: course.id, tab: "lessons" });
  function retakeQuiz() {
    if (!bank || !course) return;
    if (quizModule?.quiz) {
      api.go({ name: "run", session: startModuleQuiz(bank, { courseId: course.id, moduleId: quizModule.id }, quizModule.quiz) });
      return;
    }
    if (!quizLesson?.quiz) return;
    api.go({ name: "run", session: startLessonQuiz(bank, { courseId: course.id, lessonId: quizLesson.id }, quizLesson.quiz) });
  }
  function takeModuleQuiz() {
    if (!bank || !course || !moduleNext?.quiz) return;
    api.go({ name: "run", session: startModuleQuiz(bank, { courseId: course.id, moduleId: moduleNext.id }, moduleNext.quiz) });
  }

  function practiceMissed() {
    if (!bank) return;
    api.go({
      name: "run",
      session: startPractice(bank, api.progress, {
        count: wrong.length,
        topics: [],
        sections: [],
        filter: "all",
        shuffleChoices: true,
        questionIds: wrong.map((w) => w.qid),
      }),
    });
  }

  return (
    <div className="page">
      <button className="back" onClick={() => api.go(back)}>
        ← {back.name === "progress" ? "Progress" : back.name === "lesson" && quizLesson ? quizLesson.title : quizModule ? "Lessons" : attempt.bankTitle}
      </button>

      <div className="score-head">
        <div className="score-big">
          {pct}
          <small>%</small>
        </div>
        <div>
          <h1>
            {quizLesson || quizModule
              ? passed
                ? quizModule
                  ? "Module complete"
                  : "Lesson complete"
                : "Not passed yet"
              : isExam
              ? passed === undefined
                ? "Exam complete"
                : passed
                  ? "Passed"
                  : "Not passed yet"
              : "Practice complete"}
          </h1>
          <p className="muted" style={{ marginTop: 6 }}>
            {attempt.correct} of {attempt.total} correct
            {(quizLesson || quizModule) &&
              `, ${lessonQuizNeeded(attempt.total)} needed to complete “${(quizLesson ?? quizModule)!.title}”`}
            {isExam && !marks && attempt.passingPercent !== undefined && `, ${attempt.passingPercent}% needed to pass`}
            {isExam && marks && ". Each section must pass on its own"}.{" "}
            {formatDuration(attempt.durationSec)}
            {attempt.timeLimitSec ? ` of ${formatDuration(attempt.timeLimitSec)}` : ""} on{" "}
            {formatDateTime(attempt.finishedAt)}.
            {isExam && attempt.answered < attempt.total && ` ${attempt.total - attempt.answered} left blank.`}
          </p>
          {quizModule ? (
            <div className="row" style={{ marginTop: 14 }}>
              {passed ? (
                afterModule ? (
                  <button className="btn primary" onClick={() => goLesson(afterModule.id)}>
                    Next lesson: {afterModule.title}
                  </button>
                ) : (
                  <button className="btn primary" onClick={toLessons}>
                    Back to lessons
                  </button>
                )
              ) : (
                <button className="btn primary" onClick={retakeQuiz}>
                  Retake the module quiz
                </button>
              )}
              {!passed && (
                <button className="btn" onClick={toLessons}>
                  Review the lessons
                </button>
              )}
            </div>
          ) : quizLesson ? (
            <div className="row" style={{ marginTop: 14 }}>
              {passed ? (
                moduleNext ? (
                  <button className="btn primary" onClick={takeModuleQuiz}>
                    Module quiz: {moduleNext.title}
                  </button>
                ) : nextLesson ? (
                  <button className="btn primary" onClick={() => goLesson(nextLesson.id)}>
                    Next lesson: {nextLesson.title}
                  </button>
                ) : (
                  <button className="btn primary" onClick={() => course && api.go({ name: "course", courseId: course.id, tab: "lessons" })}>
                    Back to lessons
                  </button>
                )
              ) : (
                <button className="btn primary" onClick={retakeQuiz}>
                  Retake the quiz
                </button>
              )}
              <button className="btn" onClick={() => goLesson(quizLesson.id)}>
                {passed ? "Back to the lesson" : "Review the lesson"}
              </button>
            </div>
          ) : (
          <div className="row" style={{ marginTop: 14 }}>
            {bank && wrong.length > 0 && (
              <button className="btn primary" onClick={practiceMissed}>
                Practice the {wrong.length} I missed
              </button>
            )}
            {bank && (
              <button className="btn" onClick={() => api.go({ name: "bank", bankId: bank.id })}>
                Back to bank
              </button>
            )}
          </div>
          )}
        </div>
      </div>

      {(Object.keys(attempt.bySection).length > 0 || Object.keys(attempt.byTopic).length > 1) && (
        <div className="grid-2" style={{ marginBottom: 16 }}>
          {Object.keys(attempt.bySection).length > 0 && (
            <section className="panel">
              <SectionTable data={attempt.bySection} marks={marks} />
            </section>
          )}
          <section className="panel">
            <TallyTable title="Topic" data={attempt.byTopic} />
          </section>
        </div>
      )}

      <section className="panel">
        <div className="panel-head">
          <h2>Review answers</h2>
          <div className="seg" role="group" aria-label="Review filter">
            <button aria-pressed={filter === "wrong"} onClick={() => setFilter("wrong")}>
              Missed ({wrong.length})
            </button>
            <button aria-pressed={filter === "flagged"} onClick={() => setFilter("flagged")}>
              Flagged ({flagged.length})
            </button>
            <button aria-pressed={filter === "all"} onClick={() => setFilter("all")}>
              All ({attempt.answers.length})
            </button>
          </div>
        </div>
        {missingQs > 0 && (
          <p className="notice" style={{ marginBottom: 8 }}>
            {missingQs} question{missingQs === 1 ? " has" : "s have"} since been removed from the bank and can't be shown.
          </p>
        )}
        {shown.length === 0 && <p className="muted small">Nothing to show here.</p>}
        {shown.map(({ rec, q, n }) =>
          q ? (
            <article key={rec.qid} className="review-item">
              <div className="q-meta">
                <span className="qnum">Question {n}</span>
                <span>{q.topic}</span>
                <span className={`pill ${rec.correct ? "pass" : "fail"}`}>
                  {rec.correct ? "Correct" : rec.chosen.length ? "Incorrect" : "Blank"}
                </span>
                {rec.flagged && <span className="pill neutral">Flagged</span>}
              </div>
              <QuestionStem q={q} />
              {qtype(q) !== "label" && <QuestionImage q={q} />}
              {meta[q.id]?.note && <p className="note-show">Your note: {meta[q.id]?.note}</p>}
              {!isChoice(q) ? (
                <QuestionBody q={q} order={q.choices.map((_, i) => i)} chosen={rec.chosen} reveal review />
              ) : (
              <ul className="review-choices">
                {q.choices.map((c, i) => {
                  const picked = rec.chosen.includes(i);
                  const right = q.answer.includes(i);
                  const b = right ? (picked ? "bubble right" : "bubble should") : picked ? "bubble wrong" : "bubble";
                  return (
                    <li key={i}>
                      <span className={b}>{LETTERS[i]}</span>
                      <span>
                        <MathText text={c} />
                        {picked && <span className="faint small"> (your answer)</span>}
                      </span>
                    </li>
                  );
                })}
              </ul>
              )}
              {q.explanation && <MathText as="p" className="review-expl" text={q.explanation} />}
              <div className="row review-actions">
                <button className="btn sm ghost flag-btn" aria-pressed={!!meta[q.id]?.flag} onClick={() => toggleFlag(q.id)}>
                  {meta[q.id]?.flag ? "Flagged" : "Flag for later"}
                </button>
                <button className="btn sm ghost" onClick={() => editNote(q.id)}>
                  {meta[q.id]?.note ? "Edit note" : "Add note"}
                </button>
                {course &&
                  course.lessons
                    .filter((l) => l.topics?.includes(q.topic))
                    .slice(0, 2)
                    .map((l) => (
                      <button
                        key={l.id}
                        className="btn sm ghost"
                        onClick={() => api.go({ name: "lesson", courseId: course.id, lessonId: l.id })}
                      >
                        Review: {l.title}
                      </button>
                    ))}
              </div>
              {noteFor === q.id && (
                <div className="field note-field">
                  <textarea
                    className="textarea"
                    rows={3}
                    autoFocus
                    defaultValue={meta[q.id]?.note ?? ""}
                    onBlur={(e) => {
                      saveNote(q.id, e.target.value);
                      setNoteFor(null);
                    }}
                  />
                </div>
              )}
            </article>
          ) : null,
        )}
      </section>
    </div>
  );
}

import { useState } from "react";
import type { AppApi } from "../App";
import type { Attempt, Bank, Course, Lesson } from "../lib/types";
import { attemptPassed, isCorrect, lessonQuizNeeded, startLessonQuiz, startModuleQuiz, type Session } from "../lib/session";
import { bestQuizScore, moduleLessonsDone, recordSession } from "../lib/quiz";
import { orderedLessons } from "../lib/planner";
import { confirmAction } from "../lib/storage";
import { LETTERS } from "../lib/util";

/**
 * The end-of-lesson quiz, answered right on the lesson page. Each answer is checked as
 * soon as it's chosen (multi-answer questions get a Check button). Finishing records an
 * attempt like any practice session, and passing completes the lesson.
 */
export default function InlineQuiz({
  api,
  course,
  lesson,
  bank,
}: {
  api: AppApi;
  course: Course;
  lesson: Lesson;
  bank: Bank;
}) {
  const fresh = () => startLessonQuiz(bank, { courseId: course.id, lessonId: lesson.id }, lesson.quiz ?? []);
  const [session, setSession] = useState<Session>(fresh);
  const [answers, setAnswers] = useState<Record<string, number[]>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [result, setResult] = useState<Attempt | null>(null);
  const [saving, setSaving] = useState(false);

  const items = session.items;
  const total = items.length;
  const needed = lessonQuizNeeded(total);
  const answered = items.filter((it) => checked[it.q.id]).length;
  const right = items.filter((it) => checked[it.q.id] && isCorrect(it.q, answers[it.q.id])).length;
  const best = bestQuizScore(api.progress, course.id, { lessonId: lesson.id });

  const ordered = orderedLessons(course);
  const nextLesson = ordered[ordered.findIndex((l) => l.id === lesson.id) + 1];
  const module = course.modules.find((m) => m.id === lesson.module);
  const moduleReady =
    !!module?.quiz?.length &&
    (!nextLesson || nextLesson.module !== module.id) &&
    moduleLessonsDone(course, api.progress, module.id);

  function choose(qid: string, orig: number, multi: boolean) {
    if (checked[qid] || result) return;
    if (!multi) {
      setAnswers((a) => ({ ...a, [qid]: [orig] }));
      setChecked((c) => ({ ...c, [qid]: true }));
      return;
    }
    setAnswers((a) => {
      const cur = a[qid] ?? [];
      return { ...a, [qid]: cur.includes(orig) ? cur.filter((x) => x !== orig) : [...cur, orig] };
    });
  }

  async function finish() {
    if (answered < total) {
      const ok = await confirmAction(
        `You've answered ${answered} of ${total} questions. Unanswered questions count as wrong. Finish the quiz?`,
        "Finish quiz",
      );
      if (!ok) return;
    }
    if (answered === 0) return;
    setSaving(true);
    const graded = Object.fromEntries(Object.entries(answers).filter(([qid]) => checked[qid]));
    const preview = recordSession(api.progress, session, graded, {}, bank).attempt;
    await api.updateProgress((p) => recordSession(p, session, graded, {}, bank).progress);
    setResult(preview);
    setSaving(false);
  }

  function retake() {
    setSession(fresh());
    setAnswers({});
    setChecked({});
    setResult(null);
    document.getElementById("quiz")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const passed = result ? attemptPassed(result) : undefined;

  return (
    <section className="panel lesson-quiz" id="quiz">
      <div className="panel-head">
        <h2>End-of-lesson quiz</h2>
        <span className="small muted num">
          {total} question{total === 1 ? "" : "s"}, {needed} right to complete
          {best ? `; best ${best.correct}/${best.total}` : ""}
        </span>
      </div>
      <p className="muted small" style={{ marginTop: 4 }}>
        Every question is on this lesson. Each answer is checked as you pick it.
      </p>

      <ol className="iq-list">
        {items.map((it, n) => {
          const q = it.q;
          const multi = q.answer.length > 1;
          const chosen = answers[q.id] ?? [];
          const isChecked = !!checked[q.id];
          const ok = isChecked && isCorrect(q, chosen);
          return (
            <li key={q.id} className="iq-item">
              <p className="q-meta">
                <span className="qnum">
                  {n + 1} of {total}
                </span>
              </p>
              <p className="q-stem">{q.stem}</p>
              {multi && <p className="q-hint">Select {q.answer.length} answers, then check.</p>}
              <div className="choices" role={multi ? "group" : "radiogroup"} aria-label={`Question ${n + 1} choices`}>
                {it.order.map((orig, pos) => {
                  const selected = chosen.includes(orig);
                  const isAnswer = q.answer.includes(orig);
                  let cls = "choice";
                  let bubble = "bubble";
                  if (isChecked) {
                    if (isAnswer) {
                      cls += " is-right";
                      bubble += selected ? " right" : " should";
                    } else if (selected) {
                      cls += " is-wrong";
                      bubble += " wrong";
                    }
                  } else if (selected) {
                    cls += " selected";
                    bubble += " filled";
                  }
                  return (
                    <button
                      key={orig}
                      className={cls}
                      role={multi ? "checkbox" : "radio"}
                      aria-checked={selected}
                      disabled={isChecked || !!result}
                      onClick={() => choose(q.id, orig, multi)}
                    >
                      <span className={bubble}>{LETTERS[pos]}</span>
                      <span>{q.choices[orig]}</span>
                    </button>
                  );
                })}
              </div>
              {multi && !isChecked && !result && (
                <button
                  className="btn sm"
                  style={{ marginTop: 8 }}
                  disabled={!chosen.length}
                  onClick={() => setChecked((c) => ({ ...c, [q.id]: true }))}
                >
                  Check answer
                </button>
              )}
              {isChecked && (
                <div className="feedback" role="status">
                  <p className={`verdict ${ok ? "ok" : "bad"}`}>
                    {ok
                      ? "Correct"
                      : `Incorrect. The answer is ${it.order
                          .map((o, p) => (q.answer.includes(o) ? LETTERS[p] : null))
                          .filter(Boolean)
                          .join(" and ")}.`}
                  </p>
                  {q.explanation && <p className="expl">{q.explanation}</p>}
                </div>
              )}
            </li>
          );
        })}
      </ol>

      {!result ? (
        <div className="iq-foot">
          <span className="small muted num">
            {answered} of {total} answered, {right} right
          </span>
          <button className="btn primary" onClick={finish} disabled={saving || answered === 0}>
            Finish quiz
          </button>
        </div>
      ) : (
        <div className={`iq-result ${passed ? "pass" : "fail"}`} role="status">
          <h3>
            {result.correct} of {result.total} correct: {passed ? "lesson complete" : `not passed yet (${needed} needed)`}
          </h3>
          <div className="row" style={{ marginTop: 10 }}>
            {passed ? (
              moduleReady && module ? (
                <button
                  className="btn primary"
                  onClick={() =>
                    api.go({
                      name: "run",
                      session: startModuleQuiz(bank, { courseId: course.id, moduleId: module.id }, module.quiz!),
                    })
                  }
                >
                  Module quiz: {module.title}
                </button>
              ) : nextLesson ? (
                <button
                  className="btn primary"
                  onClick={() => api.go({ name: "lesson", courseId: course.id, lessonId: nextLesson.id })}
                >
                  Next lesson: {nextLesson.title}
                </button>
              ) : (
                <button className="btn primary" onClick={() => api.go({ name: "course", courseId: course.id, tab: "lessons" })}>
                  Back to lessons
                </button>
              )
            ) : (
              <button className="btn primary" onClick={retake}>
                Retake the quiz
              </button>
            )}
            {passed && (
              <button className="btn" onClick={retake}>
                Retake
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

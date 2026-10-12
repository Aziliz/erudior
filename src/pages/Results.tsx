import { useState } from "react";
import type { AppApi, View } from "../App";
import type { Attempt, Bank } from "../lib/types";
import { startPractice } from "../lib/session";
import { LETTERS, formatDateTime, formatDuration, percent } from "../lib/util";
import { TallyTable } from "../components/Bars";

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
  const passed = attempt.passingPercent !== undefined ? pct >= attempt.passingPercent : undefined;
  const wrong = attempt.answers.filter((a) => !a.correct);
  const flagged = attempt.answers.filter((a) => a.flagged);
  const [filter, setFilter] = useState<Filter>(wrong.length ? "wrong" : "all");

  const qById = new Map(bank?.questions.map((q) => [q.id, q]) ?? []);
  const shown = (filter === "wrong" ? wrong : filter === "flagged" ? flagged : attempt.answers).map((a) => ({
    rec: a,
    q: qById.get(a.qid),
    n: attempt.answers.indexOf(a) + 1,
  }));
  const missingQs = shown.filter((s) => !s.q).length;

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
        ← {back.name === "progress" ? "Progress" : attempt.bankTitle}
      </button>

      <div className="score-head">
        <div className="score-big">
          {pct}
          <small>%</small>
        </div>
        <div>
          <h1>
            {isExam
              ? passed === undefined
                ? "Exam complete"
                : passed
                  ? "Passed"
                  : "Not passed yet"
              : "Practice complete"}
          </h1>
          <p className="muted" style={{ marginTop: 6 }}>
            {attempt.correct} of {attempt.total} correct
            {isExam && attempt.passingPercent !== undefined && `, ${attempt.passingPercent}% needed to pass`}.{" "}
            {formatDuration(attempt.durationSec)}
            {attempt.timeLimitSec ? ` of ${formatDuration(attempt.timeLimitSec)}` : ""} on{" "}
            {formatDateTime(attempt.finishedAt)}.
            {isExam && attempt.answered < attempt.total && ` ${attempt.total - attempt.answered} left blank.`}
          </p>
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
        </div>
      </div>

      {(Object.keys(attempt.bySection).length > 0 || Object.keys(attempt.byTopic).length > 1) && (
        <div className="grid-2" style={{ marginBottom: 16 }}>
          {Object.keys(attempt.bySection).length > 0 && (
            <section className="panel">
              <TallyTable title="Section" data={attempt.bySection} />
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
              <p className="q-stem">{q.stem}</p>
              <ul className="review-choices">
                {q.choices.map((c, i) => {
                  const picked = rec.chosen.includes(i);
                  const right = q.answer.includes(i);
                  const b = right ? (picked ? "bubble right" : "bubble should") : picked ? "bubble wrong" : "bubble";
                  return (
                    <li key={i}>
                      <span className={b}>{LETTERS[i]}</span>
                      <span>
                        {c}
                        {picked && <span className="faint small"> (your answer)</span>}
                      </span>
                    </li>
                  );
                })}
              </ul>
              {q.explanation && <p className="review-expl">{q.explanation}</p>}
            </article>
          ) : null,
        )}
      </section>
    </div>
  );
}

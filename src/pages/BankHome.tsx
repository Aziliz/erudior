import { useMemo, useState } from "react";
import type { AppApi } from "../App";
import type { Bank } from "../lib/types";
import { isPublishedCourse } from "../lib/catalog";
import * as store from "../lib/storage";
import {
  bankCoverage,
  practicePool,
  startExam,
  startPractice,
  topicStats,
  type PracticeFilter,
} from "../lib/session";
import { formatDateTime, formatDuration, percent } from "../lib/util";
import { AccuracyBar, ScorePill } from "../components/Bars";
import { bankWarnings } from "../lib/validate";
import { isDue, isLearned } from "../lib/review";

const FILTERS: { id: PracticeFilter; label: string }[] = [
  { id: "smart", label: "Smart mix" },
  { id: "due", label: "Due for review" },
  { id: "all", label: "All" },
  { id: "unseen", label: "Not yet seen" },
  { id: "missed", label: "Last missed" },
  { id: "weak", label: "Under 70%" },
  { id: "flagged", label: "Flagged" },
];

export default function BankHome({ api, bank }: { api: AppApi; bank: Bank }) {
  const { progress } = api;
  const total = bank.questions.length;
  // Banks in Erudior's or community courses are read-only here (see isPublishedCourse).
  const locked = !!bank.courseId && isPublishedCourse(api.courses.find((c) => c.id === bank.courseId));

  // Exam settings start from the bank's defaults but can be changed per run.
  const [examCount, setExamCount] = useState(Math.min(bank.exam.questionCount, total));
  const [examMinutes, setExamMinutes] = useState(bank.exam.timeLimitMinutes);
  const splitSections = bank.exam.sectionTimeLimits
    ? bank.sections.filter((s) => bank.exam.sectionQuotas?.[s.id] && bank.exam.sectionTimeLimits?.[s.id])
    : [];
  const isSplit = splitSections.length > 1;
  const [sectionMinutes, setSectionMinutes] = useState<Record<string, number>>(bank.exam.sectionTimeLimits ?? {});
  const [shuffleChoices, setShuffleChoices] = useState(true);

  const topics = useMemo(() => [...new Set(bank.questions.map((q) => q.topic))].sort(), [bank]);
  const [pTopics, setPTopics] = useState<string[]>([]);
  const [pSections, setPSections] = useState<string[]>([]);
  const [pFilter, setPFilter] = useState<PracticeFilter>("smart");
  const [pCount, setPCount] = useState(20);
  const hasHonors = bank.questions.some((q) => q.honors);
  const [pHonors, setPHonors] = useState(false);

  const pool = practicePool(bank, progress, { topics: pTopics, sections: pSections, filter: pFilter, shuffleChoices, honors: pHonors });
  const cov = bankCoverage(bank, progress);
  const bstats = progress.stats[bank.id] ?? {};
  const dueCount = bank.questions.filter((q) => isDue(bstats[q.id])).length;
  const learnedCount = bank.questions.filter((q) => isLearned(bstats[q.id])).length;
  const tstats = topicStats(bank, progress).sort(
    (a, b) => (a.accuracy ?? 2) - (b.accuracy ?? 2) || a.topic.localeCompare(b.topic),
  );
  const attempts = progress.attempts.filter((a) => a.bankId === bank.id);
  const exams = attempts.filter((a) => a.mode === "exam");
  const best = exams.reduce((m, a) => Math.max(m, percent(a.correct, a.total)), 0);
  const warnings = bankWarnings(bank);

  const toggle = (list: string[], v: string) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  async function onDelete() {
    const ok = await store.confirmAction(
      `Delete "${bank.title}" and its ${total} questions? Your attempt history stays. This can't be undone.`,
    );
    if (!ok) return;
    await api.deleteBank(bank);
    api.go(api.bankBack(bank));
    api.toast(`Deleted "${bank.title}"`);
  }

  async function onExport() {
    try {
      if (await store.exportBankFile(bank)) api.toast("Bank exported");
    } catch (e) {
      api.toast(`Export failed: ${String(e)}`);
    }
  }

  return (
    <div className="page">
      <button className="back" onClick={() => api.go(api.bankBack(bank))}>
        ← {bank.courseId ? api.courses.find((c) => c.id === bank.courseId)?.title ?? "Course" : "Library"}
      </button>
      <div className="page-head">
        <div>
          <h1>{bank.title}</h1>
          {bank.description && <p className="muted">{bank.description}</p>}
        </div>
        <div className="row">
          {!locked && (
            <button className="btn" onClick={() => api.go({ name: "editor", bankId: bank.id })}>
              Edit questions
            </button>
          )}
          <button className="btn" onClick={onExport}>
            Export
          </button>
          {!locked && (
            <button className="btn danger ghost" onClick={onDelete}>
              Delete
            </button>
          )}
        </div>
      </div>

      <div className="stats-strip">
        <div>
          <b>{total}</b>
          <span>questions</span>
        </div>
        <div>
          <b>
            {cov.seen}/{total}
          </b>
          <span>studied</span>
        </div>
        <div>
          <b>{cov.missed}</b>
          <span>last answered wrong</span>
        </div>
        <div title="Right on three different days and not due for review">
          <b>{learnedCount}</b>
          <span>learned</span>
        </div>
        <div>
          <b>{exams.length}</b>
          <span>exams taken</span>
        </div>
        <div>
          <b>{exams.length ? `${best}%` : "None"}</b>
          <span>best exam</span>
        </div>
      </div>

      {warnings.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          {warnings.map((w) => (
            <p key={w} className="notice">
              {w}
            </p>
          ))}
        </div>
      )}

      <div className="grid-2">
        <section className="panel mode-panel">
          <h2>Timed exam</h2>
          <p className="desc">
            Questions are drawn at random from the bank. No feedback until you submit, then a full score report.
            {bank.exam.sectionQuotas && " Sections are kept in separate blocks, like the real exam."}
            {hasHonors && " The optional honors questions are left out."}
          </p>
          <div className="form-grid">
            {isSplit ? (
              splitSections.map((s) => (
                <label key={s.id} className="field">
                  <span>
                    {s.name}: {bank.exam.sectionQuotas![s.id]} questions, minutes
                  </span>
                  <input
                    className="input num"
                    type="number"
                    min={1}
                    value={sectionMinutes[s.id] ?? ""}
                    onChange={(e) => setSectionMinutes({ ...sectionMinutes, [s.id]: Math.max(1, Number(e.target.value) || 1) })}
                  />
                </label>
              ))
            ) : (
              <label className="field">
                <span>Questions</span>
                <input
                  className="input num"
                  type="number"
                  min={1}
                  max={total}
                  value={examCount}
                  onChange={(e) => setExamCount(Math.max(1, Math.min(total, Number(e.target.value) || 1)))}
                />
              </label>
            )}
            {!isSplit && (
            <label className="field">
              <span>Time limit (minutes)</span>
              <input
                className="input num"
                type="number"
                min={1}
                value={examMinutes}
                onChange={(e) => setExamMinutes(Math.max(1, Number(e.target.value) || 1))}
              />
            </label>
            )}
          </div>
          {isSplit && (
            <p className="small muted" style={{ marginBottom: 8 }}>
              Sections run one after the other, each on its own clock. Once you finish a section you can't go back to it.
            </p>
          )}
          <p className="small muted" style={{ marginBottom: 16 }}>
            {bank.exam.sectionPassing && bank.sections.some((s) => bank.exam.sectionPassing?.[s.id])
              ? `Each section is scored on its own: ${bank.sections
                  .filter((s) => bank.exam.sectionPassing?.[s.id])
                  .map((s) => `${s.name} ${bank.exam.sectionPassing![s.id]}%`)
                  .join(", ")}. You must pass every section.`
              : `Passing score ${bank.exam.passingPercent}%.`}
          </p>
          <button
            className="btn primary lg"
            disabled={!total}
            onClick={() =>
              api.go({
                name: "run",
                session: startExam(
                  bank,
                  isSplit
                    ? {
                        count: bank.exam.questionCount,
                        minutes: Object.values(sectionMinutes).reduce((a, b) => a + b, 0),
                        sectionMinutes,
                        shuffleChoices,
                      }
                    : { count: examCount, minutes: examMinutes, shuffleChoices },
                ),
              })
            }
          >
            Start exam
          </button>
        </section>

        <section className="panel mode-panel">
          <h2>Practice</h2>
          <p className="desc">Check each answer as you go and read the explanation. No timer.</p>
          <div className="stack" style={{ marginBottom: 16 }}>
            <div className="field">
              <span>Questions to include</span>
              <div className="seg" role="group" aria-label="Question filter">
                {FILTERS.map((f) => (
                  <button key={f.id} aria-pressed={pFilter === f.id} onClick={() => setPFilter(f.id)}>
                    {f.label}
                    {f.id === "due" && ` (${dueCount})`}
                  </button>
                ))}
              </div>
              {pFilter === "due" && (
                <span className="small muted">
                  Questions you got right a while ago, back on schedule so they stick. Each one counts as learned after you&rsquo;ve got it
                  right on three different days.
                </span>
              )}
              {pFilter === "smart" && (
                <span className="small muted">
                  More questions on your weaker topics and fewer on the ones you&rsquo;ve mastered. It keeps adjusting as you answer.
                </span>
              )}
            </div>
            {bank.sections.length > 1 && (
              <div className="field">
                <span>Sections</span>
                <div className="chips">
                  {bank.sections.map((s) => (
                    <button
                      key={s.id}
                      className="chip"
                      aria-pressed={pSections.includes(s.id)}
                      onClick={() => setPSections(toggle(pSections, s.id))}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {topics.length > 1 && (
              <div className="field">
                <span>Topics {pTopics.length === 0 && <span className="faint">(all)</span>}</span>
                <div className="chips">
                  {topics.map((t) => (
                    <button
                      key={t}
                      className="chip"
                      aria-pressed={pTopics.includes(t)}
                      onClick={() => setPTopics(toggle(pTopics, t))}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {hasHonors && (
              <label className="check small">
                <input type="checkbox" checked={pHonors} onChange={(e) => setPHonors(e.target.checked)} />
                Include honors questions (from the optional honors lessons)
              </label>
            )}
            <label className="field" style={{ maxWidth: 200 }}>
              <span>How many</span>
              <input
                className="input num"
                type="number"
                min={1}
                value={pCount}
                onChange={(e) => setPCount(Math.max(1, Number(e.target.value) || 1))}
              />
            </label>
          </div>
          <div className="row">
            <button
              className="btn primary lg"
              disabled={!pool.length}
              onClick={() =>
                api.go({
                  name: "run",
                  session: startPractice(bank, progress, {
                    count: pCount,
                    topics: pTopics,
                    sections: pSections,
                    filter: pFilter,
                    shuffleChoices,
                    honors: pHonors,
                  }),
                })
              }
            >
              Start practice
            </button>
            <span className="small muted">
              {pool.length
                ? `${Math.min(pCount, pool.length)} of ${pool.length} matching questions`
                : "No questions match these filters"}
            </span>
          </div>
        </section>
      </div>

      <p style={{ margin: "14px 2px 0" }}>
        <label className="check small muted">
          <input type="checkbox" checked={shuffleChoices} onChange={(e) => setShuffleChoices(e.target.checked)} />
          Shuffle answer choices
        </label>
      </p>
      <fieldset className="study-habits">
        <legend className="small muted">Study habits for practice and quizzes</legend>
        <label className="check small muted">
          <input
            type="checkbox"
            checked={progress.study?.explainFirst !== false}
            onChange={(e) => api.updateProgress((p) => ({ ...p, study: { ...(p.study ?? {}), explainFirst: e.target.checked } }))}
          />
          Explain it yourself first: after checking, try your own explanation before reading the app&rsquo;s
        </label>
        <label className="check small muted">
          <input
            type="checkbox"
            checked={!!progress.study?.recallFirst}
            onChange={(e) => api.updateProgress((p) => ({ ...p, study: { ...(p.study ?? {}), recallFirst: e.target.checked } }))}
          />
          Recall first: hide the answer choices until you&rsquo;ve thought of the answer
        </label>
      </fieldset>

      <div className="grid-2" style={{ marginTop: 24 }}>
        <section className="panel">
          <div className="panel-head">
            <h2>Topics</h2>
            <span className="small muted">Weakest first</span>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Topic</th>
                <th className="r">Seen</th>
                <th style={{ width: "42%" }}>Accuracy</th>
              </tr>
            </thead>
            <tbody>
              {tstats.map((t) => (
                <tr key={t.topic}>
                  <td>{t.topic}</td>
                  <td className="r">
                    {t.seen}/{t.questions}
                  </td>
                  <td>
                    <AccuracyBar value={t.accuracy} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="panel">
          <div className="panel-head">
            <h2>Recent sessions</h2>
          </div>
          {attempts.length === 0 ? (
            <p className="muted small">Finished exams and practice sessions show up here.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>When</th>
                  <th>Mode</th>
                  <th className="r">Score</th>
                  <th className="r">Time</th>
                  <th><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {attempts.slice(0, 12).map((a) => (
                  <tr
                    key={a.id}
                    className="click"
                    onClick={() =>
                      api.go({ name: "results", attemptId: a.id, back: { name: "bank", bankId: bank.id } })
                    }
                  >
                    <td>{formatDateTime(a.finishedAt)}</td>
                    <td>{a.mode === "exam" ? "Exam" : "Practice"}</td>
                    <td className="r">
                      {a.correct}/{a.total}
                    </td>
                    <td className="r">{formatDuration(a.durationSec)}</td>
                    <td className="r">
                      <ScorePill attempt={a} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </div>
  );
}

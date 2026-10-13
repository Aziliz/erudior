import { useMemo, useState } from "react";
import type { AppApi } from "../App";
import type { Bank, Course, Plan } from "../lib/types";
import * as store from "../lib/storage";
import { courseCounts, bankKey } from "../lib/course";
import { courseNumbers, lessonKey, orderedLessons, planToday, readiness, streak, type PlanTask } from "../lib/planner";
import { MISSED_DECK_ID, addDays, daysBetween, deckStatus, studyDecks, today } from "../lib/srs";
import {
  bankCoverage,
  defaultExamOptions,
  startExam,
  startPractice,
  practicePool,
  type PracticeOptions,
} from "../lib/session";
import { emptyBank } from "../lib/validate";
import { percent, uid } from "../lib/util";
import { AccuracyBar } from "../components/Bars";

export type CourseTab = "today" | "lessons" | "banks" | "cards" | "drills" | "glossary" | "reference";

const TABS: { id: CourseTab; label: string; show: (c: Course) => boolean }[] = [
  { id: "today", label: "Today", show: () => true },
  { id: "lessons", label: "Lessons", show: (c) => c.lessons.length > 0 },
  { id: "banks", label: "Questions", show: () => true },
  { id: "cards", label: "Notecards", show: () => true },
  { id: "drills", label: "Math drills", show: (c) => c.drills.length > 0 },
  { id: "glossary", label: "Glossary", show: (c) => c.glossary.length > 0 },
  { id: "reference", label: "Quick reference", show: (c) => c.references.length > 0 },
];

/** The bank used for planner tasks: the biggest one. */
export function mainBank(c: Course): Bank | undefined {
  return [...c.banks].sort((a, b) => b.questions.length - a.questions.length)[0];
}

export default function CourseHome({ api, course, tab }: { api: AppApi; course: Course; tab: CourseTab }) {
  const setTab = (t: CourseTab) => api.go({ name: "course", courseId: course.id, tab: t });

  async function onDelete() {
    const n = courseCounts(course);
    const ok = await store.confirmAction(
      `Delete "${course.title}" (${n.lessons} lessons, ${n.questions} questions, ${n.cards} cards)? Your history stays. This can't be undone.`,
    );
    if (!ok) return;
    await store.deleteCourse(course.id);
    await api.reload();
    api.go({ name: "library" });
    api.toast(`Deleted "${course.title}"`);
  }

  async function onExport() {
    try {
      if (await store.exportCourseFile(course)) api.toast("Course exported");
    } catch (e) {
      api.toast(`Export failed: ${String(e)}`);
    }
  }

  return (
    <div className="page">
      <button className="back" onClick={() => api.go({ name: "library" })}>
        ← Library
      </button>
      <div className="page-head">
        <div>
          <h1>{course.title}</h1>
          {course.description && <p className="muted">{course.description}</p>}
        </div>
        <div className="row">
          <button className="btn" onClick={() => api.go({ name: "courseEdit", courseId: course.id })}>
            Edit course
          </button>
          <button className="btn" onClick={onExport}>
            Export
          </button>
          <button className="btn danger ghost" onClick={onDelete}>
            Delete
          </button>
        </div>
      </div>

      <nav className="tabs" aria-label="Course sections">
        {TABS.filter((t) => t.show(course)).map((t) => (
          <button key={t.id} aria-current={tab === t.id ? "page" : undefined} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </nav>

      {tab === "today" && <TodayTab api={api} course={course} />}
      {tab === "lessons" && <LessonsTab api={api} course={course} />}
      {tab === "banks" && <BanksTab api={api} course={course} />}
      {tab === "cards" && <CardsTab api={api} course={course} />}
      {tab === "drills" && <DrillsTab api={api} course={course} />}
      {tab === "glossary" && <GlossaryTab course={course} />}
      {tab === "reference" && <ReferenceTab api={api} course={course} />}
    </div>
  );
}

// ---------------------------------------------------------------------------

function PlanForm({ api, course, plan, onDone }: { api: AppApi; course: Course; plan?: Plan; onDone?: () => void }) {
  const [examDate, setExamDate] = useState(plan?.examDate ?? addDays(today(), 42));
  const [days, setDays] = useState(plan?.daysPerWeek ?? 6);
  const [newCards, setNewCards] = useState(plan?.newCardsPerDay ?? 20);
  const valid = daysBetween(today(), examDate) >= 0;

  async function save() {
    await api.updateProgress((p) => ({
      ...p,
      plans: {
        ...p.plans,
        [course.id]: { examDate, daysPerWeek: days, newCardsPerDay: newCards, createdAt: plan?.createdAt ?? new Date().toISOString() },
      },
    }));
    onDone?.();
  }

  return (
    <div className="form-grid" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr)) auto", alignItems: "end" }}>
      <label className="field">
        <span>Exam date</span>
        <input className="input" type="date" value={examDate} min={today()} onChange={(e) => setExamDate(e.target.value)} />
      </label>
      <label className="field">
        <span>Study days per week</span>
        <select className="select" value={days} onChange={(e) => setDays(Number(e.target.value))}>
          {[1, 2, 3, 4, 5, 6, 7].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>New notecards per day</span>
        <input
          className="input num"
          type="number"
          min={0}
          max={200}
          value={newCards}
          onChange={(e) => setNewCards(Math.max(0, Math.min(200, Number(e.target.value) || 0)))}
        />
      </label>
      <button className="btn primary" disabled={!valid} onClick={save}>
        {plan ? "Update plan" : "Make my plan"}
      </button>
    </div>
  );
}

function TodayTab({ api, course }: { api: AppApi; course: Course }) {
  const { progress } = api;
  const plan = progress.plans[course.id];
  const [editing, setEditing] = useState(false);
  const n = courseNumbers(course, progress);
  const ready = readiness(n);
  const days = streak(progress);
  const bank = mainBank(course);

  function runTask(t: PlanTask) {
    switch (t.kind) {
      case "lesson":
        if (t.lessonIds?.[0]) api.go({ name: "lesson", courseId: course.id, lessonId: t.lessonIds[0] });
        break;
      case "cards":
        api.go({ name: "cards", courseId: course.id, deckIds: studyDecks(course, progress).map((d) => d.id), mode: "review" });
        break;
      case "drills":
        api.go({ name: "drill", courseId: course.id, drillIds: course.drills.map((d) => d.id), count: t.count ?? 5 });
        break;
      case "exam":
        if (bank)
          api.go({
            name: "run",
            session: startExam(bank, defaultExamOptions(bank)),
          });
        break;
      case "practice": {
        if (!bank) break;
        // Learning phase: topics from lessons already read. Review phase: weakest material first.
        const readTopics = [
          ...new Set(
            course.lessons
              .filter((l) => progress.lessonsDone[lessonKey(course.id, l.id)])
              .flatMap((l) => l.topics ?? []),
          ),
        ].filter((t) => bank.questions.some((q) => q.topic === t));
        const count = t.count ?? 20;
        const base = { sections: [] as string[], shuffleChoices: true, count };
        const candidates: PracticeOptions[] = [];
        if (plan && planToday(course, plan, progress).phase === "review") {
          candidates.push({ ...base, topics: [], filter: "missed" }, { ...base, topics: [], filter: "weak" });
        }
        if (readTopics.length) candidates.push({ ...base, topics: readTopics, filter: "all" });
        candidates.push({ ...base, topics: [], filter: "all" });
        const opts =
          candidates.find((o) => practicePool(bank, progress, o).length >= Math.min(10, count)) ??
          candidates[candidates.length - 1];
        api.go({ name: "run", session: startPractice(bank, progress, opts) });
        break;
      }
    }
  }

  if (!plan || editing) {
    return (
      <div className="stack">
        <section className="panel">
          <h2 style={{ marginBottom: 6 }}>{plan ? "Change your plan" : "Plan your study time"}</h2>
          <p className="muted" style={{ marginBottom: 18, maxWidth: "62ch" }}>
            Set your exam date and Examiner lays out a daily checklist: lessons spread over the time you have, notecard
            reviews, practice questions, and full timed exams in the last stretch.
          </p>
          <PlanForm api={api} course={course} plan={plan} onDone={() => setEditing(false)} />
          {plan && (
            <button className="btn ghost sm" style={{ marginTop: 10 }} onClick={() => setEditing(false)}>
              Cancel
            </button>
          )}
        </section>
        <Snapshot n={n} ready={ready} streakDays={days} />
      </div>
    );
  }

  const day = planToday(course, plan, progress);
  const done = day.tasks.filter((t) => t.done).length;

  return (
    <div className="stack">
      <section className="today-head">
        <div className="countdown">
          <b className="num">{day.daysLeft < 0 ? "Done" : day.daysLeft}</b>
          <span>{day.daysLeft < 0 ? "exam date has passed" : day.daysLeft === 1 ? "day to your exam" : "days to your exam"}</span>
        </div>
        <div className="today-meta">
          <p>
            {day.phase === "learn" &&
              `Learning phase: about ${day.lessonsPerDay} lesson${day.lessonsPerDay === 1 ? "" : "s"} per study day, then review.`}
            {day.phase === "review" && "Review phase: all lessons are done. Drill weak spots and take full exams."}
            {day.phase === "exam-day" && "Exam day. Keep it light."}
            {day.phase === "past" && "Set a new date if you're retaking the exam."}
          </p>
          <p className="muted small">
            Exam on{" "}
            {new Date(plan.examDate + "T12:00:00").toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
            , {plan.daysPerWeek} study days a week.{" "}
            <button className="linkish" onClick={() => setEditing(true)}>
              Change
            </button>
          </p>
        </div>
      </section>

      {day.tasks.length > 0 && (
        <section className="panel">
          <div className="panel-head">
            <h2>Today's checklist</h2>
            <span className="small muted num">
              {done} of {day.tasks.length} done
            </span>
          </div>
          <ul className="tasks">
            {day.tasks.map((t, i) => (
              <li key={i} className={t.done ? "done" : ""}>
                <span className={`bubble ${t.done ? "right" : ""}`} aria-hidden="true">
                  {t.done ? "✓" : ""}
                </span>
                <div className="task-text">
                  <b>{t.title}</b>
                  <span className="muted small">{t.detail}</span>
                </div>
                <button className={`btn sm ${t.done ? "" : "primary"}`} onClick={() => runTask(t)}>
                  {t.done ? "Do more" : "Start"}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <Snapshot n={n} ready={ready} streakDays={days} />
    </div>
  );
}

function Snapshot({
  n,
  ready,
  streakDays,
}: {
  n: ReturnType<typeof courseNumbers>;
  ready: ReturnType<typeof readiness>;
  streakDays: number;
}) {
  return (
    <div className="grid-2">
      <section className="panel">
        <div className="panel-head">
          <h2>Readiness estimate</h2>
          {ready && <span className="readiness num">{ready.score}</span>}
        </div>
        {ready ? (
          <>
            <table className="table">
              <tbody>
                {ready.parts.map((p) => (
                  <tr key={p.label}>
                    <td>{p.label}</td>
                    <td style={{ width: "45%" }}>
                      <AccuracyBar value={p.value} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="faint small" style={{ marginTop: 10 }}>
              A rough guide weighted toward your recent accuracy. Consistently scoring above the passing mark on full timed
              exams is the better signal.
            </p>
          </>
        ) : (
          <p className="muted small">Answer at least 20 practice questions to see an estimate.</p>
        )}
      </section>
      <section className="panel">
        <div className="panel-head">
          <h2>So far</h2>
        </div>
        <div className="mini-stats">
          <div>
            <b className="num">{streakDays}</b>
            <span>day streak</span>
          </div>
          <div>
            <b className="num">
              {n.lessonsDone}/{n.lessonsTotal}
            </b>
            <span>lessons</span>
          </div>
          <div>
            <b className="num">
              {n.questionsSeen}/{n.questionsTotal}
            </b>
            <span>questions seen</span>
          </div>
          <div>
            <b className="num">{n.recentAccuracy === null ? "None" : `${Math.round(n.recentAccuracy * 100)}%`}</b>
            <span>recent accuracy</span>
          </div>
          <div>
            <b className="num">
              {n.cardsLearned}/{n.cardsTotal}
            </b>
            <span>cards learned</span>
          </div>
          <div>
            <b className="num">{n.lastExamPct === null ? "None" : `${Math.round(n.lastExamPct * 100)}%`}</b>
            <span>last full exam</span>
          </div>
        </div>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------

function LessonsTab({ api, course }: { api: AppApi; course: Course }) {
  const { progress } = api;
  const ordered = orderedLessons(course);
  const next = ordered.find((l) => !progress.lessonsDone[lessonKey(course.id, l.id)]);
  return (
    <div className="stack">
      {next && (
        <div className="row" style={{ justifyContent: "space-between" }}>
          <p className="muted">
            Up next: <strong style={{ color: "var(--ink)" }}>{next.title}</strong>
          </p>
          <button className="btn primary" onClick={() => api.go({ name: "lesson", courseId: course.id, lessonId: next.id })}>
            Continue
          </button>
        </div>
      )}
      {course.modules.map((m, mi) => {
        const ls = course.lessons.filter((l) => l.module === m.id);
        if (!ls.length) return null;
        const done = ls.filter((l) => progress.lessonsDone[lessonKey(course.id, l.id)]).length;
        const mins = ls.reduce((s, l) => s + (l.minutes ?? 0), 0);
        return (
          <section key={m.id} className="panel module">
            <div className="panel-head">
              <h2>
                <span className="faint num">{mi + 1}.</span> {m.title}
              </h2>
              <span className="small muted num">
                {done}/{ls.length} done{mins ? `, about ${mins} min` : ""}
              </span>
            </div>
            <ol className="lesson-list">
              {ls.map((l) => {
                const isDone = !!progress.lessonsDone[lessonKey(course.id, l.id)];
                return (
                  <li key={l.id}>
                    <button onClick={() => api.go({ name: "lesson", courseId: course.id, lessonId: l.id })}>
                      <span className={`bubble ${isDone ? "right" : ""}`} aria-label={isDone ? "Done" : "Not done"}>
                        {isDone ? "✓" : ""}
                      </span>
                      <span className="lesson-title">{l.title}</span>
                      {l.minutes && <span className="faint small num">{l.minutes} min</span>}
                    </button>
                  </li>
                );
              })}
            </ol>
          </section>
        );
      })}
    </div>
  );
}

function BanksTab({ api, course }: { api: AppApi; course: Course }) {
  async function addBank() {
    const b = emptyBank("New question bank");
    const local = `bank-${uid()}`;
    const bank: Bank = { ...b, id: bankKey(course.id, local), courseId: course.id };
    await api.saveCourse({ ...course, banks: [...course.banks, bank] });
    api.go({ name: "editor", bankId: bank.id, isNew: true });
  }
  return (
    <div className="stack">
      {course.banks.length === 0 ? (
        <div className="panel empty">
          <h2>No question banks in this course</h2>
          <p className="muted">Add a bank and write questions, or import a course file that includes them.</p>
          <button className="btn primary" onClick={addBank}>
            Add question bank
          </button>
        </div>
      ) : (
        <>
          <div className="bank-list">
            {course.banks.map((b) => {
              const cov = bankCoverage(b, api.progress);
              const last = api.progress.attempts.find((a) => a.bankId === b.id && a.mode === "exam");
              return (
                <button key={b.id} className="bank-row" onClick={() => api.go({ name: "bank", bankId: b.id })}>
                  <div>
                    <h2>{b.title}</h2>
                    <div className="meta">
                      {b.questions.length} questions
                      {b.sections.length > 0 && <>, {b.sections.map((s) => s.name).join(" and ")}</>}
                      {`. Exams: ${Math.min(b.exam.questionCount, b.questions.length)} questions, ${b.exam.timeLimitMinutes} min`}
                    </div>
                  </div>
                  <div className="stat">
                    <b>{percent(cov.seen, cov.total)}%</b>
                    <span className="small muted">studied</span>
                  </div>
                  <div className="stat">
                    <b>{last ? `${percent(last.correct, last.total)}%` : "None"}</b>
                    <span className="small muted">last exam</span>
                  </div>
                </button>
              );
            })}
          </div>
          <div>
            <button className="btn sm" onClick={addBank}>
              Add question bank
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function CardsTab({ api, course }: { api: AppApi; course: Course }) {
  const { progress } = api;
  const plan = progress.plans[course.id];
  const all = studyDecks(course, progress).map((d) => d.id);
  const statuses = studyDecks(course, progress).map((d) => ({ d, s: deckStatus(course, d, progress) }));
  const totalDue = statuses.reduce((a, x) => a + x.s.due, 0);
  const totalNew = statuses.reduce((a, x) => a + x.s.fresh, 0);

  async function addDeck() {
    const deck = { id: `deck-${uid()}`, title: "New deck", cards: [] };
    await api.saveCourse({ ...course, decks: [...course.decks, deck] });
    api.go({ name: "deckEdit", courseId: course.id, deckId: deck.id });
  }

  return (
    <div className="stack">
      {statuses.length > 0 && (
        <section className="panel review-banner">
          <div>
            <h2>Spaced repetition</h2>
            <p className="muted small">
              {totalDue} due now, {totalNew} new. Up to {plan?.newCardsPerDay ?? 20} new cards are introduced per day. Rate
              each card and Examiner decides when you see it again.
            </p>
          </div>
          <div className="row">
            <button className="btn" onClick={() => api.go({ name: "cards", courseId: course.id, deckIds: all, mode: "cram" })}>
              Cram all
            </button>
            <button
              className="btn primary"
              disabled={!totalDue && !totalNew}
              onClick={() => api.go({ name: "cards", courseId: course.id, deckIds: all, mode: "review" })}
            >
              Review all decks
            </button>
          </div>
        </section>
      )}
      {statuses.length === 0 ? (
        <div className="panel empty">
          <h2>No notecard decks yet</h2>
          <p className="muted">Make a deck and add cards with a prompt on the front and the answer on the back.</p>
          <button className="btn primary" onClick={addDeck}>
            New deck
          </button>
        </div>
      ) : (
        <>
          <section className="panel">
            <table className="table">
              <thead>
                <tr>
                  <th>Deck</th>
                  <th className="r">Due</th>
                  <th className="r">New</th>
                  <th style={{ width: "26%" }}>Learned</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {statuses.map(({ d, s }) => (
                  <tr key={d.id}>
                    <td>
                      <strong>{d.title}</strong>
                      {d.description && <div className="faint small">{d.description}</div>}
                    </td>
                    <td className="r">{s.due}</td>
                    <td className="r">{s.fresh}</td>
                    <td>
                      <AccuracyBar value={s.total ? s.learned / s.total : null} />
                    </td>
                    <td className="r">
                      <div className="row" style={{ justifyContent: "flex-end", flexWrap: "nowrap" }}>
                        <button
                          className="btn sm"
                          disabled={!s.due && !s.fresh}
                          onClick={() => api.go({ name: "cards", courseId: course.id, deckIds: [d.id], mode: "review" })}
                        >
                          Review
                        </button>
                        <button
                          className="btn sm"
                          disabled={!s.total}
                          onClick={() => api.go({ name: "cards", courseId: course.id, deckIds: [d.id], mode: "cram" })}
                        >
                          Cram
                        </button>
                        {d.id !== MISSED_DECK_ID && (
                          <button
                            className="btn sm ghost"
                            onClick={() => api.go({ name: "deckEdit", courseId: course.id, deckId: d.id })}
                          >
                            Edit
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
          <div>
            <button className="btn sm" onClick={addDeck}>
              New deck
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function DrillsTab({ api, course }: { api: AppApi; course: Course }) {
  const { progress } = api;
  const topics = useMemo(() => [...new Set(course.drills.map((d) => d.topic ?? "General"))], [course]);
  const [picked, setPicked] = useState<string[]>([]);
  const [count, setCount] = useState(10);
  const chosen = course.drills.filter((d) => !picked.length || picked.includes(d.topic ?? "General"));

  return (
    <div className="stack">
      <section className="panel">
        <h2 style={{ marginBottom: 4 }}>Generate a problem set</h2>
        <p className="muted small" style={{ marginBottom: 14 }}>
          Every problem gets fresh numbers, so you can drill the same skill as often as you like. Type your answer; you'll
          see a worked solution either way.
        </p>
        <div className="field" style={{ marginBottom: 14 }}>
          <span>Topics {picked.length === 0 && <span className="faint">(all)</span>}</span>
          <div className="chips">
            {topics.map((t) => (
              <button
                key={t}
                className="chip"
                aria-pressed={picked.includes(t)}
                onClick={() => setPicked(picked.includes(t) ? picked.filter((x) => x !== t) : [...picked, t])}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="row">
          <label className="row small muted" style={{ gap: 6 }}>
            Problems
            <select className="select" style={{ width: "auto" }} value={count} onChange={(e) => setCount(Number(e.target.value))}>
              {[5, 10, 20, 30].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <button
            className="btn primary"
            disabled={!chosen.length}
            onClick={() => api.go({ name: "drill", courseId: course.id, drillIds: chosen.map((d) => d.id), count })}
          >
            Start drills
          </button>
        </div>
      </section>
      <section className="panel">
        <table className="table">
          <thead>
            <tr>
              <th>Problem type</th>
              <th>Topic</th>
              <th className="r">Tried</th>
              <th style={{ width: "28%" }}>Accuracy</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {course.drills.map((d) => {
              const st = progress.drills[`${course.id}/${d.id}`];
              return (
                <tr key={d.id}>
                  <td>{d.title}</td>
                  <td className="muted">{d.topic ?? "General"}</td>
                  <td className="r">{st?.attempts ?? 0}</td>
                  <td>
                    <AccuracyBar value={st?.attempts ? st.correct / st.attempts : null} />
                  </td>
                  <td className="r">
                    <button
                      className="btn sm"
                      onClick={() => api.go({ name: "drill", courseId: course.id, drillIds: [d.id], count: 5 })}
                    >
                      Drill
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function GlossaryTab({ course }: { course: Course }) {
  const [q, setQ] = useState("");
  const s = q.trim().toLowerCase();
  const list = course.glossary.filter(
    (g) =>
      !s ||
      g.term.toLowerCase().includes(s) ||
      g.aliases?.some((a) => a.toLowerCase().includes(s)) ||
      g.definition.toLowerCase().includes(s),
  );
  const groups = new Map<string, typeof list>();
  for (const g of list) {
    const k = /[a-z]/i.test(g.term[0]) ? g.term[0].toUpperCase() : "#";
    groups.set(k, [...(groups.get(k) ?? []), g]);
  }
  return (
    <div className="stack">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <input
          className="input"
          style={{ maxWidth: 360 }}
          placeholder={`Search ${course.glossary.length} terms`}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Search glossary"
        />
        {!s && (
          <div className="letters" aria-label="Jump to letter">
            {[...groups.keys()].map((k) => (
              <a key={k} href={`#gl-${k}`}>
                {k}
              </a>
            ))}
          </div>
        )}
      </div>
      {list.length === 0 && <p className="muted">No terms match "{q}".</p>}
      <section className="panel glossary">
        {[...groups.entries()].map(([k, items]) => (
          <div key={k} id={`gl-${k}`} className="gl-group">
            <h3 className="gl-letter">{k}</h3>
            <dl>
              {items.map((g) => (
                <div key={g.term} className="gl-entry">
                  <dt>
                    {g.term}
                    {g.aliases && g.aliases.length > 0 && <span className="faint small"> ({g.aliases.join(", ")})</span>}
                  </dt>
                  <dd>{g.definition}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </section>
    </div>
  );
}

function ReferenceTab({ api, course }: { api: AppApi; course: Course }) {
  return (
    <div className="ref-grid">
      {course.references.map((r) => (
        <button key={r.id} className="ref-tile" onClick={() => api.go({ name: "ref", courseId: course.id, refId: r.id })}>
          <b>{r.title}</b>
          <span className="muted small clamp2">{r.body.replace(/[#*|`>-]/g, " ").replace(/\s+/g, " ").trim().slice(0, 140)}</span>
        </button>
      ))}
    </div>
  );
}

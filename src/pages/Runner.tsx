import { useCallback, useEffect, useRef, useState } from "react";
import MathText from "../components/MathText";
import type { AppApi, View } from "../App";
import type { Bank, Lesson } from "../lib/types";
import { finishSession, isCorrect, isQuiz, serializeRun, type RunState, type Session } from "../lib/session";
import { confirmAction, saveSessionState } from "../lib/storage";
import { recordSession } from "../lib/quiz";
import { LETTERS, formatClock } from "../lib/util";

interface Props {
  api: AppApi;
  session: Session;
  bank: Bank | undefined;
  /** Present when resuming a saved session. */
  initial?: RunState;
}

export const metaKey = (bankId: string, qid: string) => `${bankId}/${qid}`;

export default function Runner({ api, session, bank, initial }: Props) {
  const isExam = session.mode === "exam";
  const items = session.items;
  // Lesson quizzes return to their lesson, module quizzes to the lesson list, everything else to the bank.
  const exitView: View = session.lesson
    ? { name: "lesson", courseId: session.lesson.courseId, lessonId: session.lesson.lessonId }
    : session.module
      ? { name: "course", courseId: session.module.courseId, tab: "lessons" }
      : { name: "bank", bankId: session.bankId };
  const blocks = session.blocks?.length ? session.blocks : [{ start: 0, end: items.length, timeLimitSec: session.timeLimitSec }];
  const qmeta = api.progress.qmeta ?? {};

  const [index, setIndex] = useState(initial?.index ?? 0);
  const [answers, setAnswers] = useState<Record<string, number[]>>(initial?.answers ?? {});
  // Flags persist across sessions: start from the saved ones for these questions.
  const [flags, setFlags] = useState<Record<string, boolean>>(
    () =>
      initial?.flags ??
      Object.fromEntries(items.filter((it) => qmeta[metaKey(session.bankId, it.q.id)]?.flag).map((it) => [it.q.id, true])),
  );
  const [checked, setChecked] = useState<Record<string, boolean>>(initial?.checked ?? {});
  const [blockIdx, setBlockIdx] = useState(initial?.blockIdx ?? 0);
  const [blockUsed, setBlockUsed] = useState<number[]>(initial?.blockUsed ?? blocks.map(() => 0));
  const [now, setNow] = useState(Date.now());
  const [noteOpen, setNoteOpen] = useState(false);
  // The clock only runs while this screen is open; time away isn't counted.
  const activeSince = useRef(Date.now());
  const finishing = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const block = blocks[blockIdx];
  const item = items[index];
  const q = item.q;
  const chosen = answers[q.id] ?? [];
  const multi = q.answer.length > 1;
  const isChecked = !isExam && !!checked[q.id];
  const answeredCount = items.filter((it) => (answers[it.q.id] ?? []).length > 0).length;
  const inBlock = (i: number) => i >= block.start && i < block.end;
  const blockItems = items.slice(block.start, block.end);
  const blockAnswered = blockItems.filter((it) => (answers[it.q.id] ?? []).length > 0).length;
  const blockFlagged = blockItems.filter((it) => flags[it.q.id]).length;
  const lastBlock = blockIdx === blocks.length - 1;

  const usedNow = Math.max(0, (now - activeSince.current) / 1000);
  const blockElapsed = Math.floor((blockUsed[blockIdx] ?? 0) + usedNow);
  const remaining = block.timeLimitSec !== undefined ? block.timeLimitSec - blockElapsed : undefined;
  const totalUsed = () =>
    Math.round(blockUsed.reduce((s, x) => s + x, 0) + Math.max(0, (Date.now() - activeSince.current) / 1000));

  // Lessons covering this question's topic, for "review this" links.
  const course = bank?.courseId ? api.courses.find((c) => c.id === bank.courseId) : undefined;
  const quizLesson = session.lesson ? course?.lessons.find((l) => l.id === session.lesson!.lessonId) : undefined;
  const quizModule = session.module ? course?.modules.find((m) => m.id === session.module!.moduleId) : undefined;
  const relatedLessons = (topic: string): Lesson[] =>
    course ? course.lessons.filter((l) => l.topics?.includes(topic)).slice(0, 3) : [];

  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(t);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
    setNoteOpen(!!qmeta[metaKey(session.bankId, q.id)]?.note);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  // ---- Autosave -----------------------------------------------------------
  const snapshot = useCallback((): RunState => {
    const used = blockUsed.slice();
    used[blockIdx] = (used[blockIdx] ?? 0) + Math.max(0, (Date.now() - activeSince.current) / 1000);
    return { index, answers, flags, checked, blockIdx, blockUsed: used };
  }, [index, answers, flags, checked, blockIdx, blockUsed]);

  const save = useCallback(() => {
    if (finishing.current) return;
    saveSessionState(serializeRun(session, snapshot())).catch(() => {});
  }, [session, snapshot]);

  // Save on every change, and every 15 seconds so the clock is kept.
  useEffect(() => {
    save();
  }, [save]);
  useEffect(() => {
    const t = window.setInterval(save, 15000);
    return () => window.clearInterval(t);
  }, [save]);
  const saveRef = useRef(save);
  saveRef.current = save;
  useEffect(() => () => saveRef.current(), []);

  // ---- Finishing ----------------------------------------------------------
  const finish = useCallback(async () => {
    if (finishing.current) return;
    finishing.current = true;
    await saveSessionState(null).catch(() => {});
    const used = totalUsed();
    const preview = finishSession(session, answers, flags, api.progress, bank, used);
    if (preview.attempt.total === 0 || (isQuiz(session) && preview.attempt.answered === 0)) {
      api.toast("Session ended. No questions were answered, so nothing was recorded.");
      api.go(exitView);
      return;
    }
    // Apply against the latest progress so flag/note writes made during the session aren't lost.
    await api.updateProgress((p) => recordSession(p, session, answers, flags, bank, used).progress);
    api.go({ name: "results", attemptId: preview.attempt.id, back: exitView });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, answers, flags, api, bank, blockUsed, blockIdx]);

  const nextBlock = useCallback(() => {
    if (lastBlock) return finish();
    setBlockUsed((u) => {
      const next = u.slice();
      next[blockIdx] = (next[blockIdx] ?? 0) + Math.max(0, (Date.now() - activeSince.current) / 1000);
      return next;
    });
    activeSince.current = Date.now();
    setBlockIdx(blockIdx + 1);
    setIndex(blocks[blockIdx + 1].start);
  }, [lastBlock, finish, blockIdx, blocks]);

  // Time's up for this block: move on, or submit if it was the last one.
  useEffect(() => {
    if (remaining !== undefined && remaining <= 0 && !finishing.current) {
      if (lastBlock) {
        api.toast("Time's up. Your exam was submitted.");
        finish();
      } else {
        api.toast(`Time's up for ${block.name ?? "this section"}. On to ${blocks[blockIdx + 1].name ?? "the next section"}.`);
        nextBlock();
      }
    }
  }, [remaining, lastBlock, finish, nextBlock, api, block, blocks, blockIdx]);

  // ---- Answering ----------------------------------------------------------
  const choose = useCallback(
    (original: number) => {
      if (isChecked) return;
      setAnswers((prev) => {
        const cur = prev[q.id] ?? [];
        let next: number[];
        if (multi) next = cur.includes(original) ? cur.filter((x) => x !== original) : [...cur, original];
        else next = cur[0] === original ? (isExam ? [] : cur) : [original];
        return { ...prev, [q.id]: next };
      });
    },
    [q.id, multi, isChecked, isExam],
  );

  const go = useCallback(
    (i: number) => setIndex(Math.max(block.start, Math.min(block.end - 1, i))),
    [block.start, block.end],
  );

  const check = useCallback(() => {
    if (!chosen.length) return;
    setChecked((c) => ({ ...c, [q.id]: true }));
  }, [chosen.length, q.id]);

  const toggleFlag = useCallback(() => {
    const on = !flags[q.id];
    setFlags((f) => ({ ...f, [q.id]: on }));
    const key = metaKey(session.bankId, q.id);
    api.updateProgress((p) => ({ ...p, qmeta: { ...(p.qmeta ?? {}), [key]: { ...(p.qmeta?.[key] ?? {}), flag: on || undefined } } }));
  }, [flags, q.id, session.bankId, api]);

  const setNote = (text: string) => {
    const key = metaKey(session.bankId, q.id);
    api.updateProgress((p) => ({
      ...p,
      qmeta: { ...(p.qmeta ?? {}), [key]: { ...(p.qmeta?.[key] ?? {}), note: text.trim() ? text : undefined } },
    }));
  };

  async function submitBlock() {
    const unanswered = blockItems.length - blockAnswered;
    const parts = [];
    if (unanswered) parts.push(`${unanswered} question${unanswered === 1 ? " is" : "s are"} unanswered and will be marked wrong.`);
    if (blockFlagged) parts.push(`${blockFlagged} question${blockFlagged === 1 ? " is" : "s are"} flagged.`);
    const what = lastBlock
      ? "Submit your exam now?"
      : `Finish ${block.name ?? "this section"}? You can't come back to it after you move on.`;
    const ok = await confirmAction([...parts, what].join("\n\n"), lastBlock ? "Submit exam" : "Finish section");
    if (ok) nextBlock();
  }

  async function endPractice() {
    const n = Object.keys(checked).length;
    if (n < items.length) {
      const ok = await confirmAction(
        isQuiz(session)
          ? `You've answered ${n} of ${items.length} questions. Unanswered questions count as wrong. Finish the quiz?`
          : `You've checked ${n} of ${items.length} questions. End the session and see your results?`,
        isQuiz(session) ? "Finish quiz" : "End practice",
      );
      if (!ok) return;
    }
    finish();
  }

  function saveAndExit() {
    save();
    api.toast(isExam ? "Exam saved. Resume it from the banner when you're ready." : "Session saved.");
    api.go(exitView);
  }

  // Keyboard: letters/numbers pick, arrows move, F flags, Enter checks/advances.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key.toLowerCase();
      const n = item.order.length;
      let pos = -1;
      if (/^[1-9]$/.test(k)) pos = Number(k) - 1;
      else if (k.length === 1 && LETTERS.toLowerCase().indexOf(k) > -1 && k !== "f") pos = LETTERS.toLowerCase().indexOf(k);
      if (pos >= 0 && pos < n) {
        e.preventDefault();
        choose(item.order[pos]);
      } else if (k === "arrowright") {
        go(index + 1);
      } else if (k === "arrowleft") {
        go(index - 1);
      } else if (k === "f") {
        toggleFlag();
      } else if (k === "enter" && !isExam) {
        e.preventDefault();
        if (!isChecked) check();
        else if (index < items.length - 1) go(index + 1);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [item, index, items.length, choose, go, check, isChecked, isExam, toggleFlag]);

  const sectionName = q.section ? (bank?.sections.find((s) => s.id === q.section)?.name ?? q.section) : undefined;
  const clockClass =
    remaining === undefined ? "clock" : remaining <= 60 ? "clock crit" : remaining <= 300 ? "clock warn" : "clock";
  const correctNow = isChecked && isCorrect(q, chosen);
  const note = qmeta[metaKey(session.bankId, q.id)]?.note ?? "";
  const lessons = isChecked ? relatedLessons(q.topic) : [];
  const atBlockEnd = index === block.end - 1;

  return (
    <div className="runner">
      <div className="runner-main">
        <div className="runner-bar">
          <button className="btn ghost sm" onClick={saveAndExit} title="Your place and time are saved">
            Save &amp; exit
          </button>
          <div className="title">{quizLesson?.title ?? quizModule?.title ?? session.bankTitle}</div>
          <span className="pill neutral">{isExam ? "Exam" : quizLesson ? "Lesson quiz" : quizModule ? "Module quiz" : "Practice"}</span>
          {blocks.length > 1 && (
            <span className="small muted">
              Part {blockIdx + 1} of {blocks.length}: {block.name}
            </span>
          )}
          <div className="spacer" />
          <span className="small muted num">
            {blocks.length > 1 ? `${blockAnswered}/${blockItems.length}` : `${answeredCount}/${items.length}`} answered
          </span>
          <span className={clockClass} aria-label={remaining !== undefined ? "Time remaining" : "Time elapsed"}>
            {formatClock(remaining ?? blockElapsed)}
          </span>
        </div>
        <div className="progress-line">
          <i style={{ width: `${((index - block.start + 1) / blockItems.length) * 100}%` }} />
        </div>

        <div className="q-scroll" ref={scrollRef}>
          <div className="q-wrap">
            <div className="q-meta">
              <span className="qnum">
                Question {index - block.start + 1} of {blockItems.length}
              </span>
              {sectionName && blocks.length === 1 && <span>{sectionName}</span>}
              {!isExam && <span>{q.topic}</span>}
            </div>
            <MathText as="p" className="q-stem" text={q.stem} />
            {multi && <p className="q-hint">Select {q.answer.length} answers.</p>}

            <div className="choices" role={multi ? "group" : "radiogroup"} aria-label="Answer choices">
              {item.order.map((orig, pos) => {
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
                    disabled={isChecked}
                    onClick={() => choose(orig)}
                  >
                    <span className={bubble}>{LETTERS[pos]}</span>
                    <MathText text={q.choices[orig]} />
                  </button>
                );
              })}
            </div>

            {isChecked && (
              <div className="feedback" role="status">
                <p className={`verdict ${correctNow ? "ok" : "bad"}`}>
                  {correctNow
                    ? "Correct"
                    : `Incorrect. The answer is ${item.order
                        .map((o, p) => (q.answer.includes(o) ? LETTERS[p] : null))
                        .filter(Boolean)
                        .join(" and ")}.`}
                </p>
                {q.explanation ? (
                  <MathText as="p" className="expl" text={q.explanation} />
                ) : (
                  <p className="small muted">No explanation for this question.</p>
                )}
                {lessons.length > 0 && (
                  <p className="review-links small">
                    Review:{" "}
                    {lessons.map((l, i) => (
                      <span key={l.id}>
                        {i > 0 && ", "}
                        <button
                          className="linkish"
                          onClick={() => {
                            save();
                            api.go({ name: "lesson", courseId: course!.id, lessonId: l.id });
                          }}
                        >
                          {l.title}
                        </button>
                      </span>
                    ))}
                  </p>
                )}
              </div>
            )}

            {noteOpen && (
              <label className="field note-field">
                <span>Your note on this question</span>
                <textarea
                  className="textarea"
                  rows={3}
                  defaultValue={note}
                  key={q.id}
                  placeholder="Saved with the question and shown whenever it comes up again"
                  onBlur={(e) => setNote(e.target.value)}
                />
              </label>
            )}
          </div>
        </div>

        <div className="runner-foot">
          <button className="btn" onClick={() => go(index - 1)} disabled={index === block.start}>
            Previous
          </button>
          <button className="btn flag-btn" aria-pressed={!!flags[q.id]} onClick={toggleFlag}>
            {flags[q.id] ? "Flagged" : "Flag"}
          </button>
          <button className="btn ghost" aria-pressed={noteOpen} onClick={() => setNoteOpen((o) => !o)}>
            {note ? "Note ✎" : "Add note"}
          </button>
          <div className="spacer" />
          <span className="kbd">A–{LETTERS[item.order.length - 1]} choose, ← → move, F flag{!isExam && ", Enter check"}</span>
          {!isExam && !isChecked ? (
            <button className="btn primary" onClick={check} disabled={!chosen.length}>
              Check answer
            </button>
          ) : !atBlockEnd ? (
            <button className="btn primary" onClick={() => go(index + 1)}>
              Next
            </button>
          ) : isExam ? (
            <button className="btn primary" onClick={submitBlock}>
              {lastBlock ? "Submit exam" : "Finish section"}
            </button>
          ) : (
            <button className="btn primary" onClick={finish}>
              See results
            </button>
          )}
        </div>
      </div>

      <aside className="sheet-side" aria-label="Answer sheet">
        <div className="sheet-head">
          <h3>{blocks.length > 1 ? block.name : "Answer sheet"}</h3>
          <div className="legend">
            {isExam ? (
              <>
                <span>
                  <i className="f" /> Answered
                </span>
                <span>
                  <i /> Blank
                </span>
              </>
            ) : (
              <>
                <span>
                  <i className="ok" /> Right
                </span>
                <span>
                  <i className="no" /> Wrong
                </span>
              </>
            )}
            <span>
              <i className="fl" /> Flagged
            </span>
          </div>
          {blocks.length > 1 && (
            <p className="small muted" style={{ marginTop: 8 }}>
              {blocks.map((b, i) => (
                <span key={i} className={i === blockIdx ? "" : "faint"}>
                  {i > 0 && " → "}
                  {b.name} {b.timeLimitSec ? `(${Math.round(b.timeLimitSec / 60)} min)` : ""}
                  {i < blockIdx && " ✓"}
                </span>
              ))}
            </p>
          )}
        </div>
        <div className="sheet-grid">
          {blockItems.map((it, k) => {
            const i = block.start + k;
            const a = answers[it.q.id] ?? [];
            let cls = "cell";
            if (!isExam && checked[it.q.id]) cls += isCorrect(it.q, a) ? " right" : " wrong";
            else if (a.length) cls += " answered";
            if (flags[it.q.id]) cls += " flagged";
            if (i === index) cls += " current";
            return (
              <button
                key={it.q.id}
                className={cls}
                onClick={() => inBlock(i) && go(i)}
                aria-label={`Question ${k + 1}${a.length ? ", answered" : ""}${flags[it.q.id] ? ", flagged" : ""}`}
              >
                <span className="oval" />
                <small>{k + 1}</small>
              </button>
            );
          })}
        </div>
        <div className="sheet-foot">
          {isExam ? (
            <button className="btn primary" onClick={submitBlock}>
              {lastBlock ? "Submit exam" : `Finish ${block.name ?? "section"}`}
            </button>
          ) : (
            <button className="btn" onClick={endPractice}>
              {isQuiz(session) ? "Finish quiz" : "End session"}
            </button>
          )}
          {blockFlagged > 0 && (
            <button
              className="btn sm ghost"
              onClick={() => {
                const rel = blockItems.findIndex((it, k) => block.start + k > index && flags[it.q.id]);
                const k = rel >= 0 ? rel : blockItems.findIndex((it) => flags[it.q.id]);
                go(block.start + k);
              }}
            >
              Next flagged ({blockFlagged})
            </button>
          )}
        </div>
      </aside>
    </div>
  );
}

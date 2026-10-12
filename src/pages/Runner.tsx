import { useCallback, useEffect, useRef, useState } from "react";
import type { AppApi } from "../App";
import type { Bank } from "../lib/types";
import { finishSession, isCorrect, type Session } from "../lib/session";
import { confirmAction } from "../lib/storage";
import { logActivity } from "../lib/planner";
import { LETTERS, formatClock } from "../lib/util";

interface Props {
  api: AppApi;
  session: Session;
  bank: Bank | undefined;
}

export default function Runner({ api, session, bank }: Props) {
  const isExam = session.mode === "exam";
  const items = session.items;
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number[]>>({});
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [now, setNow] = useState(Date.now());
  const finishing = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const item = items[index];
  const q = item.q;
  const chosen = answers[q.id] ?? [];
  const multi = q.answer.length > 1;
  const isChecked = !isExam && !!checked[q.id];
  const answeredCount = items.filter((it) => (answers[it.q.id] ?? []).length > 0).length;
  const flaggedCount = Object.values(flags).filter(Boolean).length;

  const remaining = session.timeLimitSec
    ? session.timeLimitSec - Math.floor((now - session.startedAt) / 1000)
    : undefined;
  const elapsed = Math.floor((now - session.startedAt) / 1000);

  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(t);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [index]);

  const finish = useCallback(async () => {
    if (finishing.current) return;
    finishing.current = true;
    const { attempt, progress } = finishSession(session, answers, flags, api.progress, bank);
    if (attempt.total === 0) {
      api.toast("Session ended. No questions were answered, so nothing was recorded.");
      api.go({ name: "bank", bankId: session.bankId });
      return;
    }
    await api.setProgress(logActivity(progress, "questions", attempt.answered));
    api.go({ name: "results", attemptId: attempt.id, back: { name: "bank", bankId: session.bankId } });
  }, [session, answers, flags, api, bank]);

  // Time's up: submit automatically.
  useEffect(() => {
    if (remaining !== undefined && remaining <= 0) {
      api.toast("Time's up. Your exam was submitted.");
      finish();
    }
  }, [remaining, finish, api]);

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

  const go = useCallback((i: number) => setIndex(Math.max(0, Math.min(items.length - 1, i))), [items.length]);

  const check = useCallback(() => {
    if (!chosen.length) return;
    setChecked((c) => ({ ...c, [q.id]: true }));
  }, [chosen.length, q.id]);

  async function submitExam() {
    const unanswered = items.length - answeredCount;
    const parts = [];
    if (unanswered) parts.push(`${unanswered} question${unanswered === 1 ? " is" : "s are"} unanswered and will be marked wrong.`);
    if (flaggedCount) parts.push(`${flaggedCount} question${flaggedCount === 1 ? " is" : "s are"} flagged for review.`);
    const ok = await confirmAction([...parts, "Submit your exam now?"].join("\n\n"), "Submit exam");
    if (ok) finish();
  }

  async function endPractice() {
    const n = Object.keys(checked).length;
    if (n < items.length) {
      const ok = await confirmAction(
        `You've checked ${n} of ${items.length} questions. End the session and see your results?`,
        "End practice",
      );
      if (!ok) return;
    }
    finish();
  }

  async function quit() {
    const ok = await confirmAction(
      isExam ? "Quit this exam? Your answers won't be saved or scored." : "Quit this practice session without saving it?",
      "Quit",
    );
    if (ok) api.go({ name: "bank", bankId: session.bankId });
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
        setFlags((f) => ({ ...f, [q.id]: !f[q.id] }));
      } else if (k === "enter" && !isExam) {
        e.preventDefault();
        if (!isChecked) check();
        else if (index < items.length - 1) go(index + 1);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [item, index, items.length, choose, go, check, isChecked, isExam, q.id]);

  const sectionName = q.section ? bank?.sections.find((s) => s.id === q.section)?.name ?? q.section : undefined;
  const clockClass =
    remaining === undefined ? "clock" : remaining <= 60 ? "clock crit" : remaining <= 300 ? "clock warn" : "clock";
  const correctNow = isChecked && isCorrect(q, chosen);

  return (
    <div className="runner">
      <div className="runner-main">
        <div className="runner-bar">
          <button className="btn ghost sm" onClick={quit}>
            Quit
          </button>
          <div className="title">{session.bankTitle}</div>
          <span className="pill neutral">{isExam ? "Exam" : "Practice"}</span>
          <div className="spacer" />
          <span className="small muted num">
            {answeredCount}/{items.length} answered
          </span>
          <span className={clockClass} aria-label={remaining !== undefined ? "Time remaining" : "Time elapsed"}>
            {formatClock(remaining ?? elapsed)}
          </span>
        </div>
        <div className="progress-line">
          <i style={{ width: `${((index + 1) / items.length) * 100}%` }} />
        </div>

        <div className="q-scroll" ref={scrollRef}>
          <div className="q-wrap">
            <div className="q-meta">
              <span className="qnum">
                Question {index + 1} of {items.length}
              </span>
              {sectionName && <span>{sectionName}</span>}
              {!isExam && <span>{q.topic}</span>}
            </div>
            <p className="q-stem">{q.stem}</p>
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
                    <span>{q.choices[orig]}</span>
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
                  <p className="expl">{q.explanation}</p>
                ) : (
                  <p className="small muted">No explanation for this question.</p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="runner-foot">
          <button className="btn" onClick={() => go(index - 1)} disabled={index === 0}>
            Previous
          </button>
          <button
            className="btn flag-btn"
            aria-pressed={!!flags[q.id]}
            onClick={() => setFlags((f) => ({ ...f, [q.id]: !f[q.id] }))}
          >
            {flags[q.id] ? "Flagged" : "Flag for review"}
          </button>
          <div className="spacer" />
          <span className="kbd">Keys: A–{LETTERS[item.order.length - 1]} choose, ← → move, F flag{!isExam && ", Enter check"}</span>
          {!isExam && !isChecked ? (
            <button className="btn primary" onClick={check} disabled={!chosen.length}>
              Check answer
            </button>
          ) : index < items.length - 1 ? (
            <button className="btn primary" onClick={() => go(index + 1)}>
              Next
            </button>
          ) : isExam ? (
            <button className="btn primary" onClick={submitExam}>
              Submit exam
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
          <h3>Answer sheet</h3>
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
        </div>
        <div className="sheet-grid">
          {items.map((it, i) => {
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
                onClick={() => go(i)}
                aria-label={`Question ${i + 1}${a.length ? ", answered" : ""}${flags[it.q.id] ? ", flagged" : ""}`}
              >
                <span className="oval" />
                <small>{i + 1}</small>
              </button>
            );
          })}
        </div>
        <div className="sheet-foot">
          {isExam ? (
            <button className="btn primary" onClick={submitExam}>
              Submit exam
            </button>
          ) : (
            <button className="btn" onClick={endPractice}>
              End session
            </button>
          )}
          {flaggedCount > 0 && (
            <button
              className="btn sm ghost"
              onClick={() => {
                const next = items.findIndex((it, i) => i > index && flags[it.q.id]);
                go(next >= 0 ? next : items.findIndex((it) => flags[it.q.id]));
              }}
            >
              Next flagged ({flaggedCount})
            </button>
          )}
        </div>
      </aside>
    </div>
  );
}

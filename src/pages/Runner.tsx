import { useCallback, useEffect, useRef, useState } from "react";
import MathText from "../components/MathText";
import QuestionBody, { QuestionAudio, QuestionImage, QuestionStem } from "../components/QuestionBody";
import type { AppApi, View } from "../App";
import type { Bank, Chosen, Lesson } from "../lib/types";
import { isAnswered, isChoice, isComplete, qtype, typeLabel } from "../lib/questions";
import { finishSession, isCorrect, isQuiz, serializeRun, type RunState, type Session } from "../lib/session";
import { confirmAction, saveSessionState } from "../lib/storage";
import { recordSession } from "../lib/quiz";
import { adaptAfterCheck, topicMastery } from "../lib/mastery";
import type { Confidence } from "../lib/review";
import { LETTERS, formatClock } from "../lib/util";
import { CalcDock } from "../components/Calculator";
import { calcKind } from "../lib/calcKind";

interface Props {
  api: AppApi;
  session: Session;
  bank: Bank | undefined;
  /** Present when resuming a saved session. */
  initial?: RunState;
}

const CONFIDENCE: { id: Confidence; label: string }[] = [
  { id: "sure", label: "Sure" },
  { id: "unsure", label: "Unsure" },
  { id: "guess", label: "Guess" },
];

export const metaKey = (bankId: string, qid: string) => `${bankId}/${qid}`;

export default function Runner({ api, session: started, bank, initial }: Props) {
  // Smart practice can swap upcoming questions, so the session lives in state.
  const [session, setSession] = useState<Session>(started);
  const [adaptNote, setAdaptNote] = useState<{ qid: string; text: string } | null>(null);
  const isExam = session.mode === "exam";
  const items = session.items;
  // Lesson quizzes return to their lesson, module quizzes to the lesson list, everything else to the bank.
  const backLesson = session.lesson ?? session.pretestLesson;
  const exitView: View = backLesson
    ? { name: "lesson", courseId: backLesson.courseId, lessonId: backLesson.lessonId }
    : session.reading
      ? { name: "read", courseId: session.reading.courseId, textId: session.reading.textId }
      : session.module
      ? { name: "course", courseId: session.module.courseId, tab: "lessons" }
      : { name: "bank", bankId: session.bankId };
  const blocks = session.blocks?.length ? session.blocks : [{ start: 0, end: items.length, timeLimitSec: session.timeLimitSec }];
  const qmeta = api.progress.qmeta ?? {};

  const [index, setIndex] = useState(initial?.index ?? 0);
  const [answers, setAnswers] = useState<Record<string, Chosen>>(initial?.answers ?? {});
  // Flags persist across sessions: start from the saved ones for these questions.
  const [flags, setFlags] = useState<Record<string, boolean>>(
    () =>
      initial?.flags ??
      Object.fromEntries(items.filter((it) => qmeta[metaKey(session.bankId, it.q.id)]?.flag).map((it) => [it.q.id, true])),
  );
  const [checked, setChecked] = useState<Record<string, boolean>>(initial?.checked ?? {});
  const [confidence, setConfidence] = useState<Record<string, Confidence>>(initial?.confidence ?? {});
  // Confidence is asked in practice and quizzes, not exams or warm-ups (those are guesses by design).
  const askConfidence = !isExam && session.kind !== "pretest";
  // Study habits (BankHome): explain it yourself before reading the explanation; recall before seeing choices.
  const study = api.progress.study ?? {};
  const explainFirst = !isExam && session.kind !== "pretest" && study.explainFirst !== false;
  const recallFirst = !isExam && !!study.recallFirst;
  const [shownExpl, setShownExpl] = useState<Record<string, boolean>>({});
  const [shownChoices, setShownChoices] = useState<Record<string, boolean>>({});
  const [ownWords, setOwnWords] = useState<Record<string, string>>({});
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
  const choiceQ = isChoice(q);
  const multi = choiceQ && q.answer.length > 1;
  const answeredNow = isAnswered(q, chosen);
  const isChecked = !isExam && !!checked[q.id];
  const choicesHidden = recallFirst && choiceQ && !shownChoices[q.id] && !isChecked && !isAnswered(q, answers[q.id]);
  const explHidden = explainFirst && isChecked && !!q.explanation && !shownExpl[q.id];
  const answeredCount = items.filter((it) => isAnswered(it.q, answers[it.q.id])).length;
  const inBlock = (i: number) => i >= block.start && i < block.end;
  const blockItems = items.slice(block.start, block.end);
  const blockAnswered = blockItems.filter((it) => isAnswered(it.q, answers[it.q.id])).length;
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
    return { index, answers, flags, checked, blockIdx, blockUsed: used, confidence };
  }, [index, answers, flags, checked, blockIdx, blockUsed, confidence]);

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
    const preview = finishSession(session, answers, flags, api.progress, bank, used, confidence);
    if (preview.attempt.total === 0 || (isQuiz(session) && preview.attempt.answered === 0)) {
      api.toast("Session ended. No questions were answered, so nothing was recorded.");
      api.go(exitView);
      return;
    }
    // Apply against the latest progress so flag/note writes made during the session aren't lost.
    await api.updateProgress((p) => recordSession(p, session, answers, flags, bank, used, confidence).progress);
    if (session.kind === "pretest") {
      api.toast("Now read the lesson. The answers to the warm-up are in it.");
      api.go(exitView);
      return;
    }
    api.go({ name: "results", attemptId: preview.attempt.id, back: exitView });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, answers, flags, api, bank, blockUsed, blockIdx, confidence]);

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
        const cur = (prev[q.id] ?? []) as number[];
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

  const setAnswer = useCallback(
    (next: Chosen) => {
      if (isChecked) return;
      setAnswers((prev) => ({ ...prev, [q.id]: next }));
    },
    [q.id, isChecked],
  );

  const check = useCallback(async () => {
    if (!answeredNow) return;
    if (!isComplete(q, chosen) && !(await confirmAction("Some parts are still empty and will count as wrong. Check your answer anyway?", "Check answer")))
      return;
    const nowChecked = { ...checked, [q.id]: true };
    setChecked(nowChecked);
    if (session.adaptive && bank) {
      const prior = topicMastery(api.progress, [bank]);
      const r = adaptAfterCheck(session, bank, index, answers, nowChecked, prior, confidence);
      if (r) {
        setSession((s) => ({ ...s, items: r.items, adaptive: { ...s.adaptive!, reserve: r.reserve } }));
        setAdaptNote({ qid: q.id, text: r.note });
      }
    }
  }, [answeredNow, q, chosen, checked, session, bank, index, answers, api.progress, confidence]);

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
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key.toLowerCase();
      const n = item.order.length;
      let pos = -1;
      if (/^[1-9]$/.test(k)) pos = Number(k) - 1;
      else if (k.length === 1 && LETTERS.toLowerCase().indexOf(k) > -1 && k !== "f") pos = LETTERS.toLowerCase().indexOf(k);
      if (choicesHidden && (k === "enter" || k === " ")) {
        e.preventDefault();
        setShownChoices((m) => ({ ...m, [q.id]: true }));
        return;
      }
      if (choiceQ && pos >= 0 && pos < n && !choicesHidden) {
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
        else if (explHidden) setShownExpl((m) => ({ ...m, [q.id]: true }));
        else if (index < items.length - 1) go(index + 1);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [item, index, items.length, choose, go, check, isChecked, isExam, toggleFlag, choiceQ, choicesHidden, explHidden, q.id]);

  const sectionName = q.section ? (bank?.sections.find((s) => s.id === q.section)?.name ?? q.section) : undefined;
  const clockClass =
    remaining === undefined ? "clock" : remaining <= 60 ? "clock crit" : remaining <= 300 ? "clock warn" : "clock";
  const correctNow = isChecked && isCorrect(q, chosen);
  const note = qmeta[metaKey(session.bankId, q.id)]?.note ?? "";
  const lessons = isChecked ? relatedLessons(q.topic) : [];
  const atBlockEnd = index === block.end - 1;

  return (
    <div className="runner">
      <CalcDock kind={calcKind(course)} />
      <div className="runner-main">
        <div className="runner-bar">
          <button className="btn ghost sm" onClick={saveAndExit} title="Your place and time are saved">
            Save &amp; exit
          </button>
          <h1 className="title">{quizLesson?.title ?? quizModule?.title ?? session.bankTitle}</h1>
          <span className="pill neutral">{isExam ? "Exam" : quizLesson ? "Lesson quiz" : quizModule ? "Module quiz" : session.kind === "pretest" ? "Warm-up" : session.kind === "weekly" ? "Weekly review" : session.reading ? "Reading questions" : session.adaptive ? "Smart practice" : "Practice"}</span>
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
            <QuestionStem q={q} />
            {qtype(q) !== "label" && <QuestionImage q={q} />}
            <QuestionAudio q={q} revealed={isChecked} />
            {multi && <p className="q-hint">Select {q.answer.length} answers.</p>}
            {!choiceQ && <p className="q-type small muted">{typeLabel(q)}</p>}

            {choicesHidden ? (
              <div className="recall-cover">
                <p>Think of the answer before you look at the choices.</p>
                <button className="btn primary" autoFocus onClick={() => setShownChoices((m) => ({ ...m, [q.id]: true }))}>
                  Show choices
                </button>
              </div>
            ) : (
            <QuestionBody
              key={q.id}
              q={q}
              order={item.order}
              chosen={chosen}
              onChoose={choose}
              onChange={setAnswer}
              onEnter={() => (!isExam && !isChecked ? check() : undefined)}
              reveal={isChecked}
            />
            )}

            {askConfidence && !isChecked && answeredNow && (
              <div className="confidence" role="group" aria-label="How sure are you? (optional)">
                <span className="small muted">How sure are you?</span>
                {CONFIDENCE.map((c) => (
                  <button
                    key={c.id}
                    className="btn sm ghost"
                    aria-pressed={confidence[q.id] === c.id}
                    onClick={() =>
                      setConfidence((m) => {
                        const next = { ...m };
                        if (next[q.id] === c.id) delete next[q.id];
                        else next[q.id] = c.id;
                        return next;
                      })
                    }
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            )}

            {isChecked && (
              <div className="feedback" role="status">
                <p className={`verdict ${correctNow ? "ok" : "bad"}`}>
                  {correctNow
                    ? "Correct"
                    : choiceQ
                      ? `Incorrect. The answer is ${item.order
                          .map((o, p) => (q.answer.includes(o) ? LETTERS[p] : null))
                          .filter(Boolean)
                          .join(" and ")}.`
                      : "Not quite. The marks above show which parts were right."}
                </p>
                {!correctNow && confidence[q.id] === "sure" && (
                  <p className="conf-note sure-miss">You were sure about this one, so it&rsquo;s worth a careful read. It&rsquo;ll come back tomorrow.</p>
                )}
                {correctNow && confidence[q.id] === "guess" && (
                  <p className="conf-note small muted">Right, but you guessed, so it doesn&rsquo;t count as learned yet. It&rsquo;ll come back tomorrow.</p>
                )}
                {explHidden ? (
                  <div className="explain-first">
                    <label className="field">
                      <span>Why is the answer what it is? Explain it in your own words first (optional).</span>
                      <textarea
                        className="input"
                        rows={2}
                        value={ownWords[q.id] ?? ""}
                        onChange={(e) => setOwnWords((m) => ({ ...m, [q.id]: e.target.value }))}
                      />
                    </label>
                    <button className="btn sm" onClick={() => setShownExpl((m) => ({ ...m, [q.id]: true }))}>
                      Show explanation
                    </button>
                  </div>
                ) : q.explanation ? (
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
                {adaptNote?.qid === q.id && <p className="adapt-note small muted">{adaptNote.text}.</p>}
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
          <span className="kbd">
            {choiceQ ? `A–${LETTERS[item.order.length - 1]} choose, ` : ""}← → move, F flag{!isExam && ", Enter check"}
          </span>
          {!isExam && !isChecked ? (
            <button className="btn primary" onClick={check} disabled={!answeredNow}>
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
          <h2 className="sheet-title">{blocks.length > 1 ? block.name : "Answer sheet"}</h2>
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
            const did = isAnswered(it.q, a);
            let cls = "cell";
            if (!isExam && checked[it.q.id]) cls += isCorrect(it.q, a) ? " right" : " wrong";
            else if (did) cls += " answered";
            if (flags[it.q.id]) cls += " flagged";
            if (i === index) cls += " current";
            return (
              <button
                key={it.q.id}
                className={cls}
                onClick={() => inBlock(i) && go(i)}
                aria-label={`Question ${k + 1}${did ? ", answered" : ""}${flags[it.q.id] ? ", flagged" : ""}`}
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

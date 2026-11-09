import { useEffect, useMemo, useRef, useState } from "react";
import type { AppApi } from "../App";
import type { Course } from "../lib/types";
import { buildRound, checkConj, conjKey, deNoun, formName, recordConj, type ConjPrompt } from "../lib/conjugation";
import type { Verdict } from "../lib/vocab";
import { logActivity } from "../lib/planner";
import { composing, imeFor } from "../lib/ime";
import { JapaneseToggles, RubyText } from "../components/Ruby";
import { confirmAction } from "../lib/storage";
import { SpeakButton } from "./VocabRunner";

interface QItem {
  prompt: ConjPrompt;
  /** Counts toward the form's accuracy (the first answer in the round). */
  counted: boolean;
  n: number;
}

/**
 * A round of conjugation prompts: a word the learner has unlocked and a target form; type the
 * form, check it, see the right answer and the rule. The first answer to each prompt counts
 * toward that form's accuracy; misses come back later in the round as practice.
 */
export default function ConjugationRunner({ api, course }: { api: AppApi; course: Course }) {
  const lang = course.language;
  const code = lang?.code ?? "";
  const ja = code === "ja";
  const ime = imeFor(lang);
  const initial = useMemo<QItem[]>(() => buildRound(course, api.progress).map((prompt, n) => ({ prompt, counted: true, n })), []);
  const [queue, setQueue] = useState(initial);
  const [typed, setTyped] = useState("");
  const [hint, setHint] = useState<string>();
  const [shown, setShown] = useState<{ verdict: Verdict; typed: string }>();
  const [tally, setTally] = useState<Record<string, { right: number; wrong: number }>>({});
  const input = useRef<HTMLInputElement>(null);
  const current = queue[0];
  const back = () => api.go({ name: "course", courseId: course.id, tab: "vocab" });

  useEffect(() => {
    input.current?.focus();
  }, [current, shown]);

  async function submit() {
    if (!current || shown) return;
    const finalTyped = ime ? ime(typed, { final: true }) : typed;
    if (finalTyped !== typed) setTyped(finalTyped);
    const v = checkConj(current.prompt, finalTyped, code);
    if (!v.ok && v.retry) {
      setHint(v.note);
      return;
    }
    setHint(undefined);
    if (current.counted) {
      const form = current.prompt.form;
      setTally((t) => ({ ...t, [form]: { right: (t[form]?.right ?? 0) + (v.ok ? 1 : 0), wrong: (t[form]?.wrong ?? 0) + (v.ok ? 0 : 1) } }));
      await api.updateProgress((p) => logActivity(recordConj(p, conjKey(course, form), v.ok), "cards"));
    }
    setShown({ verdict: v, typed: finalTyped });
  }

  function next() {
    if (!current || !shown) return;
    const rest = queue.slice(1);
    if (!shown.verdict.ok) rest.splice(Math.min(rest.length, 3 + Math.floor(Math.random() * 3)), 0, { ...current, counted: false });
    setQueue(rest);
    setShown(undefined);
    setTyped("");
  }

  function insert(ch: string) {
    const el = input.current;
    const start = el?.selectionStart ?? typed.length;
    const end = el?.selectionEnd ?? typed.length;
    setTyped(typed.slice(0, start) + ch + typed.slice(end));
    requestAnimationFrame(() => {
      el?.focus();
      el?.setSelectionRange(start + ch.length, start + ch.length);
    });
  }

  async function quit() {
    if (queue.length && Object.keys(tally).length && !(await confirmAction("End this round? Answers so far are saved."))) return;
    back();
  }

  if (!initial.length)
    return (
      <div className="page">
        <button className="back" onClick={back}>
          ← {course.title}
        </button>
        <section className="panel">
          <h1 className="h2">Nothing to conjugate yet</h1>
          <p className="muted">Verbs and adjectives join conjugation practice when you finish their lessons, and each form unlocks with the lesson that teaches it.</p>
        </section>
      </div>
    );

  if (!current) {
    const rows = Object.entries(tally);
    const right = rows.reduce((n, [, t]) => n + t.right, 0);
    return (
      <div className="page">
        <section className="panel">
          <h1 className="h2">Round done</h1>
          <p>
            {right} of {initial.length} right the first time.
          </p>
          <table className="table conj-table">
            <caption className="sr-only">This round by form</caption>
            <thead>
              <tr>
                <th scope="col">Form</th>
                <th scope="col">Right</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([form, t]) => (
                <tr key={form}>
                  <td>{formName(code, form)}</td>
                  <td>
                    {t.right} of {t.right + t.wrong}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="row" style={{ marginTop: 12 }}>
            <button className="btn primary" onClick={() => api.go({ name: "vocab", courseId: course.id, mode: "conjugation", batch: Date.now() })}>
              Another round
            </button>
            <button className="btn" onClick={back}>
              Back to vocabulary
            </button>
          </div>
        </section>
      </div>
    );
  }

  const { prompt } = current;
  const { item } = prompt;
  const done = initial.length - queue.filter((q) => q.counted).length;
  const ok = shown?.verdict.ok;
  const noun = prompt.noun ? deNoun(prompt.noun) : undefined;
  const nounWord = noun && (prompt.slot?.gender === "pl" ? noun.plural : noun.noun);
  const answerLabel = `${prompt.label} of ${item.term}`;

  return (
    <div className="page vocab-run conj-run">
      <h1 className="sr-only">Conjugation practice: {course.title}</h1>
      <div className="run-head">
        <button className="back" onClick={quit}>
          ← End
        </button>
        {ja && <JapaneseToggles />}
        <span className="muted">
          Conjugation · {Math.min(done + 1, initial.length)}/{initial.length}
          {queue.length > initial.length - done ? ` (+${queue.length - (initial.length - done)} again)` : ""}
        </span>
      </div>

      <section className="panel vocab-card conj-card" aria-live="polite">
        <div className="vocab-meta muted">
          <span>{formName(code, prompt.form)}</span>
          <span>{current.counted ? "Counts toward this form" : "Practice (already counted)"}</span>
        </div>
        <div className="vocab-prompt" lang={code}>
          <span>
            <RubyText text={item.term} reading={item.reading} lang={code} pitch={item.pitch} />
          </span>
          <SpeakButton text={item.term} lang={lang?.tts} audio={item.audio} />
        </div>
        <div className="vocab-sub muted">{item.meanings[0]}</div>
        <p className="conj-target">
          <span className="muted">{ja ? "Type the " : "Form: "}</span>
          <strong>{prompt.label}</strong>
          {prompt.noun && (
            <>
              <br />
              <span className="muted">Noun: </span>
              <span lang={code}>{prompt.slot?.gender === "pl" ? prompt.noun.plural : prompt.noun.term}</span>
              <span className="muted"> ({prompt.noun.meanings[0]}). Type the {prompt.slot?.article === "none" ? "adjective" : "article and adjective"}.</span>
            </>
          )}
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (shown) next();
            else void submit();
          }}
        >
          <label className="sr-only" htmlFor="conj-answer">
            {answerLabel}
          </label>
          <input
            id="conj-answer"
            ref={input}
            className={`vocab-input ${shown ? (ok ? "right" : "wrong") : ""}`}
            value={typed}
            readOnly={!!shown}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            lang={code}
            placeholder={`Type it in ${lang?.name ?? "the language"}`}
            onChange={(e) => {
              setHint(undefined);
              setTyped(ime && !composing(e) ? ime(e.target.value) : e.target.value);
            }}
            onCompositionEnd={(e) => {
              if (ime) setTyped(ime(e.currentTarget.value));
            }}
          />
          {ja && !shown && (
            <p className="ime-help small muted">
              Type romaji: <code>tabemasu</code> → たべます. Kana or kanji are both fine.
            </p>
          )}
          {!!lang?.keys?.length && !shown && (
            <div className="char-keys" aria-label="Special characters">
              {lang.keys.map((k) => (
                <button key={k} type="button" className="btn" onMouseDown={(e) => e.preventDefault()} onClick={() => insert(k)}>
                  {k}
                </button>
              ))}
            </div>
          )}
          {hint && (
            <p className="vocab-hint" role="status">
              {hint}
            </p>
          )}
          <div className="row" style={{ marginTop: 12 }}>
            <button className="btn primary" type="submit">
              {shown ? "Next" : "Check"}
            </button>
          </div>
        </form>

        {shown && (
          <div className={`vocab-result ${ok ? "right" : "wrong"}`}>
            <p>
              <strong>{ok ? "Right." : "Not quite."}</strong> {shown.verdict.note}
            </p>
            <p className="vocab-answer" lang={code}>
              <span>
                <RubyText text={prompt.answers[0]} reading={prompt.readings?.[0]} lang={code} />
              </span>
              {ja && prompt.readings?.[0] && prompt.readings[0] !== prompt.answers[0] && <span className="muted"> ({prompt.readings[0]})</span>}
              {nounWord && <span className="muted"> ({nounWord})</span>}
              <SpeakButton text={prompt.readings?.[0] ?? prompt.answers[0]} lang={lang?.tts} label="Play this form" />
            </p>
            {prompt.also.length > 0 && (
              <p className="muted small">
                Also right: <span lang={code}>{prompt.also.join(", ")}</span>
              </p>
            )}
            <p className="conj-rule">{prompt.rule}</p>
          </div>
        )}
      </section>
    </div>
  );
}

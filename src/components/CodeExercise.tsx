// A code exercise (question type "code"): editor, Run tests / Run code, results per test,
// hints, and the model solution after checking. The answer is `[code, stamp]` (see makeStamp in
// lib/code.ts): running the tests stamps the code, and the Runner's Check answer hands it in.
import { useEffect, useId, useMemo, useRef, useState } from "react";
import CodeEditor from "./CodeEditor";
import Markdown from "./Markdown";
import type { Chosen, Question } from "../lib/types";
import {
  DEFAULT_TIME_LIMIT,
  LANG_NAMES,
  errorHeadline,
  errorTip,
  judge,
  literal,
  callLabel,
  makeStamp,
  normalizeOutput,
  readStamp,
  readsInput,
  testCall,
  timeoutText,
  type CodeError,
  type CodeSpec,
  type TestOutcome,
} from "../lib/code";
import { LOAD_TEXT, PythonLoadError, preloadPython, runCode, statusLine } from "../lib/codeRun";
import { loadDraft, saveDraft } from "../lib/codeDrafts";
import { confirmAction } from "../lib/storage";

interface Props {
  q: Question;
  chosen: Chosen;
  onChange?: (next: Chosen) => void;
  /** Checked: show results and the solution, no more editing. */
  reveal?: boolean;
  /** Results screen: read-only. */
  review?: boolean;
  disabled?: boolean;
  /** Timed exam: no hints or solution. */
  exam?: boolean;
  /** Where to keep the draft on this device (bank/question). */
  draftKey?: string;
}

const statusText = statusLine;
const LOAD_FAILED = LOAD_TEXT;

/** An error, explained: the headline, a plain-language tip, and the student's own lines. */
export function ErrorBox({ error, lang }: { error: CodeError; lang: CodeSpec["language"] }) {
  const tip = errorTip(lang, error.type);
  return (
    <div className="code-err">
      <p className="code-err-head">{errorHeadline(error)}</p>
      {tip && <p className="small">{tip}</p>}
      {error.trace && error.trace.length > 1 && (
        <pre className="code-trace" aria-label="Where it happened, innermost last">
          {error.trace.join("\n")}
        </pre>
      )}
    </div>
  );
}

function OutPre({ label, text }: { label: string; text: string }) {
  return (
    <div className="code-io">
      <span className="code-io-label">{label}</span>
      <pre className="code-out">{text === "" ? <span className="muted">(nothing)</span> : text}</pre>
    </div>
  );
}

export default function CodeExercise({ q, chosen, onChange, reveal, review, disabled, exam, draftKey }: Props) {
  const spec = q.code!;
  const lang = spec.language;
  const locked = !!(reveal || review || disabled);
  const uid = useId();
  const keysId = `${uid}-keys`;

  const initial = useMemo(() => {
    if (typeof chosen[0] === "string") return chosen[0];
    return (draftKey && loadDraft(draftKey)) ?? spec.starter;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q.id]);
  const [code, setCode] = useState(initial);
  const [outcomes, setOutcomes] = useState<TestOutcome[] | null>(null);
  const [ran, setRan] = useState<{ stdout: string; error?: CodeError; timedOut?: boolean } | null>(null);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [hints, setHints] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const firstInput = spec.tests.find((t) => !t.hidden && t.stdin !== undefined)?.stdin ?? "";
  const [stdin, setStdin] = useState(firstInput);
  const draftTimer = useRef<number>(undefined);

  // A restored answer (resume) or a draft counts as the starting point.
  useEffect(() => {
    if (!locked && typeof chosen[0] !== "string" && initial !== spec.starter) onChange?.([initial]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q.id]);

  // Start fetching Python as soon as a Python exercise opens, so the first run doesn't wait as long.
  useEffect(() => {
    if (lang !== "python" || locked) return;
    let alive = true;
    preloadPython((s) => alive && setStatus(statusText(s, lang)))
      .then(() => alive && setStatus((s) => (s.startsWith("Loading") || s.startsWith("Restarting") ? "Python is ready." : s)))
      .catch(() => alive && setStatus(LOAD_FAILED));
    return () => {
      alive = false;
    };
  }, [lang, locked]);

  useEffect(() => () => window.clearTimeout(draftTimer.current), []);

  const stamp = readStamp([code, ...chosen.slice(1)]);
  const errorLine = (ran?.error?.line ?? outcomes?.find((o) => o.error?.line)?.error?.line) || null;

  function edit(next: string) {
    setCode(next);
    // Any edit means the last test run no longer describes this code.
    onChange?.([next]);
    if (draftKey) {
      window.clearTimeout(draftTimer.current);
      draftTimer.current = window.setTimeout(() => saveDraft(draftKey, next), 500);
    }
  }

  async function runTests() {
    if (busy) return;
    setBusy(true);
    setRan(null);
    const current = code;
    try {
      const jobs = spec.tests.map((t) => ({ stdin: t.stdin, call: testCall(spec, t), args: t.args }));
      const raw = await runCode(lang, current, jobs, { timeLimitSec: spec.timeLimit ?? DEFAULT_TIME_LIMIT, onStatus: (s) => setStatus(statusText(s, lang)) });
      const res = spec.tests.map((t, i) => judge(spec, t, raw[i]));
      const passed = res.filter((r) => r.ok).length;
      setOutcomes(res);
      onChange?.([current, makeStamp(current, passed, res.length)]);
      if (draftKey) saveDraft(draftKey, current);
      setStatus(
        passed === res.length
          ? `All ${res.length} tests passed.${exam ? "" : " Press Check answer to hand it in."}`
          : `${passed} of ${res.length} tests passed.`,
      );
    } catch (e) {
      setStatus(e instanceof PythonLoadError ? LOAD_FAILED : `Couldn't run the code: ${(e as Error).message}`);
    } finally {
      setBusy(false);
    }
  }

  async function runProgram() {
    if (busy) return;
    setBusy(true);
    try {
      const [r] = await runCode(lang, code, [{ stdin }], { timeLimitSec: spec.timeLimit ?? DEFAULT_TIME_LIMIT, onStatus: (s) => setStatus(statusText(s, lang)) });
      setRan(r);
      setStatus(r.timedOut ? "Your program was stopped." : r.error ? "Your program stopped with an error." : "Your program finished.");
    } catch (e) {
      setStatus(e instanceof PythonLoadError ? LOAD_FAILED : `Couldn't run the code: ${(e as Error).message}`);
    } finally {
      setBusy(false);
    }
  }

  async function startOver() {
    if (code !== spec.starter && !(await confirmAction("Replace your code with the starting code? Your changes will be lost.", "Start over"))) return;
    setOutcomes(null);
    setRan(null);
    edit(spec.starter);
  }

  const visible = spec.tests.map((t, i) => ({ t, o: outcomes?.[i] })).filter(({ t }) => !t.hidden);
  const hidden = outcomes?.filter((o) => o.hidden) ?? [];
  const hiddenCount = spec.tests.filter((t) => t.hidden).length;
  const hiddenFailed = hidden.filter((o) => !o.ok).length;
  const usesInput = readsInput(code, lang);
  const passedNow = !!stamp?.pass;
  const solutionOpen = !exam && !!spec.solution && (passedNow || showSolution) && (reveal || review);

  return (
    <div className="code-ex" data-lang={lang}>
      <div className="code-ex-head">
        <span className="code-lang">{LANG_NAMES[lang]}</span>
        {spec.function && <span className="small muted">Your code needs a function named <code>{spec.function}</code>.</span>}
      </div>

      <CodeEditor
        value={code}
        language={lang}
        label={`Your code (${LANG_NAMES[lang]})`}
        readOnly={locked}
        describedBy={locked ? undefined : keysId}
        errorLine={errorLine}
        onChange={locked ? undefined : edit}
      />
      {!locked && (
        <p id={keysId} className="code-keys small muted">
          Tab indents a line. To leave the editor with the keyboard, press Esc, then Tab.
        </p>
      )}

      {!locked && usesInput && (
        <label className="field code-stdin">
          <span>Typed input for Run code (one line for each time your program asks)</span>
          <textarea className="textarea code-input" rows={2} spellCheck={false} value={stdin} onChange={(e) => setStdin(e.target.value)} />
        </label>
      )}

      {!locked && (
        <div className="code-ex-actions">
          <button className="btn primary" onClick={runTests} disabled={busy}>
            Run tests
          </button>
          <button className="btn" onClick={runProgram} disabled={busy}>
            Run code
          </button>
          <button className="btn ghost" onClick={startOver} disabled={busy}>
            Start over
          </button>
          {!exam && !!spec.hints?.length && (
            <button className="btn ghost" onClick={() => setHints((h) => Math.min(spec.hints!.length, h + 1))} disabled={hints >= spec.hints.length}>
              {hints >= spec.hints.length ? "No more hints" : `Show a hint (${hints + 1} of ${spec.hints.length})`}
            </button>
          )}
        </div>
      )}

      <p className="code-status small" role="status" aria-live="polite">
        {busy && <span className="code-spinner" aria-hidden="true" />}
        {status}
      </p>

      {!exam && hints > 0 && (
        <ol className="code-hints" aria-label="Hints">
          {spec.hints!.slice(0, hints).map((h, i) => (
            <li key={i}>
              <Markdown source={h} className="code-hint" />
            </li>
          ))}
        </ol>
      )}

      {ran && (
        <div className="code-run">
          <OutPre label="Output" text={normalizeOutput(ran.stdout)} />
          {ran.timedOut && <p className="code-err-head">{timeoutText(spec.timeLimit ?? DEFAULT_TIME_LIMIT)}</p>}
          {ran.error && <ErrorBox error={ran.error} lang={lang} />}
        </div>
      )}

      <div className="code-tests-box">
        <h2 className="code-tests-title">{outcomes ? "Test results" : "Tests your code must pass"}</h2>
        <ul className="code-tests">
          {visible.map(({ t, o }, i) => {
            const call = testCall(spec, t);
            const label = o?.label ?? t.name ?? (call ? callLabel(call, t.args ?? [], lang) : "Output");
            return (
              <li key={i} className={`code-test ${o ? (o.ok ? "is-right" : "is-wrong") : ""}`}>
                <div className="code-test-line">
                  {o && <span className={`code-mark ${o.ok ? "ok" : "bad"}`}>{o.ok ? "✓ Passed" : "✗ Failed"}</span>}
                  <code className="code-test-label">{label}</code>
                  {"expect" in t && (
                    <span className="small">
                      {" "}
                      should give <code>{literal(t.expect, lang)}</code>
                      {o && !o.ok && o.actual !== undefined && !o.problem && (
                        <>
                          , got <code>{o.actual}</code>
                        </>
                      )}
                    </span>
                  )}
                </div>
                {t.stdin !== undefined && (!o || !o.ok || t.stdout !== undefined) && <OutPre label="Typed input" text={normalizeOutput(t.stdin)} />}
                {t.stdout !== undefined && (!o || !o.ok) && <OutPre label="Should print" text={normalizeOutput(t.stdout)} />}
                {o && !o.ok && t.stdout !== undefined && !o.problem && <OutPre label="Your code printed" text={o.actualOut ?? ""} />}
                {o?.error ? <ErrorBox error={o.error} lang={lang} /> : o?.problem && <p className="code-err-head">{o.problem}</p>}
              </li>
            );
          })}
        </ul>
        {hiddenCount > 0 && (
          <p className="code-hidden small">
            {!outcomes
              ? `Plus ${hiddenCount} hidden test${hiddenCount === 1 ? "" : "s"} with other inputs.`
              : hiddenFailed === 0
                ? `Hidden tests: all ${hiddenCount} passed.`
                : `Hidden tests: ${hiddenFailed} of ${hiddenCount} failed. They use inputs you can't see, so think about other cases (like 0, a negative number or an empty list).`}
          </p>
        )}
        {!outcomes && stamp && (
          <p className="small">
            Last test run: {stamp.passed} of {stamp.total} tests passed.
          </p>
        )}
        {!outcomes && !stamp && review && typeof chosen[0] === "string" && <p className="small muted">The tests weren't run on this code.</p>}
        {!locked && !stamp && (
          <p className="small muted">{exam ? "Run the tests to hand in your code. Your last test run counts." : "Run the tests, then press Check answer to hand in your code."}</p>
        )}
      </div>

      {(reveal || review) && !exam && spec.solution && (
        <div className="code-solution">
          {solutionOpen ? (
            <>
              <h2 className="code-tests-title">{passedNow ? "Compare with a model solution" : "A model solution"}</h2>
              <CodeEditor value={spec.solution} language={lang} label={`Model solution (${LANG_NAMES[lang]})`} readOnly />
            </>
          ) : (
            <button className="btn sm" onClick={() => setShowSolution(true)}>
              Show a model solution
            </button>
          )}
        </div>
      )}
    </div>
  );
}

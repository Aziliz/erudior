import { useRef, useState } from "react";
import type { AppApi } from "../App";
import type { Course, Drill } from "../lib/types";
import { checkAll, generate, type DrillInstance } from "../lib/drills";
import { canCheck, readAnswer, type PartInstance } from "../lib/answers";
import DrillFigure from "../components/DrillFigure";
import { simplify, toTex } from "../lib/expr";
import { renderMathText } from "../lib/math";
import DOMPurify from "dompurify";
import MathText from "../components/MathText";
import { logActivity } from "../lib/planner";
import { shuffle } from "../lib/util";
import Markdown from "../components/Markdown";

interface Result {
  inst: DrillInstance;
  /** What was typed in each box. */
  given: string[];
  /** Right or wrong per box. */
  parts: boolean[];
  ok: boolean;
}

/** Live preview of typed math (expression answers and anything beyond a plain number). */
function previewTex(part: PartInstance, text: string): string | null {
  const t = text.trim();
  if (!t || /^-?[\d.,$%\s]+$/.test(t)) return null;
  try {
    const r = readAnswer(part, t);
    if (r.node) return toTex(simplify(r.node));
    return null;
  } catch {
    return null;
  }
}


/** Spread problems across the chosen drill types instead of repeating one. */
function makeSet(drills: Drill[], count: number): { list: DrillInstance[]; errors: string[] } {
  const list: DrillInstance[] = [];
  const errors: string[] = [];
  let pool: Drill[] = [];
  let guard = 0;
  while (list.length < count && guard++ < count * 4) {
    if (!pool.length) pool = shuffle(drills);
    const d = pool.pop()!;
    try {
      list.push(generate(d));
    } catch (e) {
      errors.push((e as Error).message);
      drills = drills.filter((x) => x !== d);
      if (!drills.length) break;
      pool = pool.filter((x) => x !== d);
    }
  }
  return { list, errors: [...new Set(errors)] };
}

export default function DrillRunner({ api, course, drills, count }: { api: AppApi; course: Course; drills: Drill[]; count: number }) {
  // Generated once per set; `drills` is a fresh array on every app render.
  const [set, setSet] = useState(() => makeSet(drills, count));
  const { list, errors } = set;
  const [i, setI] = useState(0);
  const [texts, setTexts] = useState<string[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [showSolution, setShowSolution] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const back = () => api.go({ name: "course", courseId: course.id, tab: "drills" });

  const inst = list[i];
  const answered = results.length > i;
  const res = results[i];
  const ready = !!inst && inst.parts.every((p, k) => canCheck(p, texts[k] ?? ""));

  async function check() {
    if (!inst || answered || !ready) return;
    const per = checkAll(inst, texts);
    const ok = per.every((r) => r.ok);
    setResults((r) => [...r, { inst, given: inst.parts.map((_, k) => (texts[k] ?? "").trim()), parts: per.map((x) => x.ok), ok }]);
    setShowSolution(true);
    const key = `${course.id}/${inst.drill.id}`;
    await api.updateProgress((p) => {
      const cur = p.drills[key] ?? { attempts: 0, correct: 0 };
      return logActivity({ ...p, drills: { ...p.drills, [key]: { attempts: cur.attempts + 1, correct: cur.correct + (ok ? 1 : 0) } } }, "drills");
    });
  }

  function next() {
    setI((n) => n + 1);
    setTexts([]);
    setShowSolution(false);
    setTimeout(() => inputRef.current?.focus(), 30);
  }

  if (!list.length) {
    return (
      <div className="page">
        <h1>These drills couldn't be generated</h1>
        {errors.map((e) => (
          <p key={e} className="notice error" style={{ marginTop: 10 }}>
            {e}
          </p>
        ))}
        <button className="btn" style={{ marginTop: 16 }} onClick={back}>
          Back
        </button>
      </div>
    );
  }

  if (i >= list.length) {
    const right = results.filter((r) => r.ok).length;
    return (
      <div className="page" style={{ maxWidth: 760 }}>
        <div className="score-head">
          <div className="score-big">
            {right}
            <small>/{results.length}</small>
          </div>
          <div>
            <h1>Drill set complete</h1>
            <p className="muted" style={{ marginTop: 6 }}>
              Each set uses new numbers, so run it again until the method is automatic.
            </p>
            <div className="row" style={{ marginTop: 14 }}>
              <button
                className="btn primary"
                onClick={() => {
                  setSet(makeSet(drills, count));
                  setI(0);
                  setTexts([]);
                  setResults([]);
                  setShowSolution(false);
                }}
              >
                New set
              </button>
              <button className="btn" onClick={back}>
                Back to drills
              </button>
            </div>
          </div>
        </div>
        <section className="panel">
          <table className="table">
            <thead>
              <tr>
                <th>Problem</th>
                <th className="r">Your answer</th>
                <th className="r">Correct answer</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, k) => (
                <tr key={k}>
                  <td>
                    <span className={`pill ${r.ok ? "pass" : "fail"}`}>{r.ok ? "Right" : "Wrong"}</span> {r.inst.drill.title}
                  </td>
                  <td className="r">
                    <MathText text={r.given.join("; ")} />
                  </td>
                  <td className="r">
                    <MathText text={r.inst.parts.map((p) => p.display).join("; ")} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    );
  }

  return (
    <div className="runner-main" style={{ height: "100%" }}>
      <div className="runner-bar">
        <button className="btn ghost sm" onClick={back}>
          Quit
        </button>
        <div className="title">Math drills</div>
        <span className="pill neutral">{inst.drill.topic ?? "Math"}</span>
        <div className="spacer" />
        <span className="small muted num">
          {i + 1} of {list.length}, {results.filter((r) => r.ok).length} right
        </span>
      </div>
      <div className="progress-line">
        <i style={{ width: `${((i + (answered ? 1 : 0)) / list.length) * 100}%` }} />
      </div>
      <div className="q-scroll">
        <div className="q-wrap">
          <div className="q-meta">
            <span className="qnum">{inst.drill.title}</span>
          </div>
          <div className="q-stem">
            <Markdown source={inst.prompt} glossary={course.glossary} className="prose drill-prompt" />
          </div>
          <DrillFigure inst={inst} />
          <form
            className="drill-answer"
            onSubmit={(e) => {
              e.preventDefault();
              if (answered) next();
              else check();
            }}
          >
            <div className="drill-boxes">
              {inst.parts.map((part, k) => {
                const spec = part.spec;
                const kind = spec.kind ?? "number";
                const unit = spec.units ? Object.keys(spec.units)[0] : "";
                const fmt = spec.format;
                const hint =
                  kind === "expression"
                    ? `in terms of ${(spec.variables ?? ["x"]).join(", ")}`
                    : kind === "fraction"
                      ? "fraction, e.g. 7/4"
                      : fmt === "percent"
                        ? "percent"
                        : fmt?.startsWith("money")
                          ? "dollars"
                          : unit
                            ? unit
                            : "";
                const text = texts[k] ?? "";
                const tex = previewTex(part, text);
                const right = answered ? res.parts[k] : undefined;
                return (
                  <div key={k} className="drill-box">
                    <label className="field">
                      <span>
                        {spec.label ? <MathText text={spec.label} /> : inst.parts.length > 1 ? `Answer ${k + 1}` : "Your answer"}
                        {hint && <span className="faint"> ({hint})</span>}
                      </span>
                      <input
                        ref={k === 0 ? inputRef : undefined}
                        autoFocus={k === 0}
                        className={`input answer-input ${kind === "expression" ? "" : "num"} ${answered ? (right ? "ok" : "bad") : ""}`}
                        inputMode={kind === "expression" ? "text" : "decimal"}
                        autoComplete="off"
                        spellCheck={false}
                        value={text}
                        disabled={answered}
                        onChange={(e) => setTexts((t) => Object.assign([...t], { [k]: e.target.value }))}
                        placeholder={kind === "expression" ? "e.g. 3x^2 - 2" : fmt?.startsWith("money") ? "$0.00" : "0"}
                      />
                    </label>
                    {tex && (
                      <div
                        className="answer-preview"
                        aria-label="How your answer reads"
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(renderMathText(`$${tex}$`)) }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
            {!answered ? (
              <button className="btn primary" type="submit" disabled={!ready}>
                Check
              </button>
            ) : (
              <button className="btn primary" type="submit">
                {i + 1 < list.length ? "Next problem" : "See results"}
              </button>
            )}
          </form>
          {answered && (
            <div className="feedback" role="status">
              <p className={`verdict ${res.ok ? "ok" : "bad"}`}>
                {res.ok ? "Correct" : "Not quite. "}
                {!res.ok && <MathText text={`The answer is ${inst.parts.map((p) => (inst.parts.length > 1 && p.spec.label ? `${p.spec.label} ${p.display}` : p.display)).join(", ")}.`} />}
              </p>
              {showSolution && <Markdown source={inst.solution} glossary={course.glossary} className="prose expl" />}
            </div>
          )}
          {!answered && (
            <p className="faint small" style={{ marginTop: 12 }}>
              {inst.parts.some((p) => (p.spec.kind ?? "number") !== "number" || !p.spec.format?.startsWith("money"))
                ? "You can type math: 3/4, sqrt(2), 2pi, x^2, 6.02e23. "
                : ""}
              {inst.parts.some((p) => p.spec.format?.startsWith("money")) ? "Round money to the cent unless the problem says otherwise. You can type $ and commas." : ""}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

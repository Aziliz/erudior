import { useRef, useState } from "react";
import type { AppApi } from "../App";
import type { Course, Drill } from "../lib/types";
import { checkAnswer, formatNum, generate, parseAnswer, type DrillInstance } from "../lib/drills";
import { logActivity } from "../lib/planner";
import { shuffle } from "../lib/util";
import Markdown from "../components/Markdown";

interface Result {
  inst: DrillInstance;
  given: number;
  ok: boolean;
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
  const [text, setText] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [showSolution, setShowSolution] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const back = () => api.go({ name: "course", courseId: course.id, tab: "drills" });

  const inst = list[i];
  const answered = results.length > i;
  const res = results[i];
  const parsed = parseAnswer(text);

  async function check() {
    if (!inst || answered || parsed === null) return;
    const ok = checkAnswer(inst, parsed);
    setResults((r) => [...r, { inst, given: parsed, ok }]);
    setShowSolution(true);
    const key = `${course.id}/${inst.drill.id}`;
    await api.updateProgress((p) => {
      const cur = p.drills[key] ?? { attempts: 0, correct: 0 };
      return logActivity({ ...p, drills: { ...p.drills, [key]: { attempts: cur.attempts + 1, correct: cur.correct + (ok ? 1 : 0) } } }, "drills");
    });
  }

  function next() {
    setI((n) => n + 1);
    setText("");
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
                  setText("");
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
                  <td className="r">{formatNum(r.given, r.inst.drill.format)}</td>
                  <td className="r">{formatNum(r.inst.answer, r.inst.drill.format)}</td>
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
          <form
            className="drill-answer"
            onSubmit={(e) => {
              e.preventDefault();
              if (answered) next();
              else check();
            }}
          >
            <label className="field" style={{ flex: 1, maxWidth: 280 }}>
              <span>
                Your answer
                {inst.drill.format === "percent" ? " (percent)" : inst.drill.format.startsWith("money") ? " (dollars)" : ""}
              </span>
              <input
                ref={inputRef}
                autoFocus
                className={`input num answer-input ${answered ? (res.ok ? "ok" : "bad") : ""}`}
                inputMode="decimal"
                value={text}
                disabled={answered}
                onChange={(e) => setText(e.target.value)}
                placeholder={inst.drill.format.startsWith("money") ? "$0.00" : "0"}
              />
            </label>
            {!answered ? (
              <button className="btn primary" type="submit" disabled={parsed === null}>
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
                {res.ok ? "Correct" : `Not quite. The answer is ${formatNum(inst.answer, inst.drill.format)}.`}
              </p>
              {showSolution && <Markdown source={inst.solution} glossary={course.glossary} className="prose expl" />}
            </div>
          )}
          {!answered && (
            <p className="faint small" style={{ marginTop: 12 }}>
              Round money to the cent unless the problem says otherwise. You can type $ and commas.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

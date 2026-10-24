// A calculator docked on the left of practice, quiz, exam, drill and lesson screens.
// Three kinds: basic (what a licensing exam like PSI allows), scientific, and graphing
// (scientific plus a graph). Expressions run on the app's own math engine (lib/expr.ts):
// no eval, works offline.
import { useEffect, useMemo, useRef, useState } from "react";
import { evalNode, evaluate, parse, type Node } from "../lib/expr";

export type CalcKind = "basic" | "scientific" | "graphing";

const KIND_LABEL: Record<CalcKind, string> = { basic: "Basic calculator", scientific: "Scientific calculator", graphing: "Graphing calculator" };

/** Calculator-style input → the engine's syntax. */
export function toEngine(src: string, deg: boolean): string {
  let s = src
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/[−–]/g, "-")
    .replace(/π/g, "pi")
    .replace(/\bAns\b/g, "ans")
    .replace(/√/g, "sqrt")
    .replace(/∛/g, "cbrt")
    .replace(/²/g, "^2")
    .replace(/³/g, "^3")
    // 50% → (50/100); "200 × 15%" works the way people expect.
    .replace(/(\d+(?:\.\d+)?)%/g, "($1/100)");
  if (deg) s = s.replace(/\b(a?(?:sin|cos|tan|sec|csc|cot))\s*\(/g, (_m, f: string) => `${f}d(`);
  return s;
}

/** Up to 12 significant digits; scientific notation for very large or small numbers. */
export function formatResult(v: number): string {
  if (!Number.isFinite(v)) return "Error";
  if (v === 0) return "0";
  const a = Math.abs(v);
  if (a >= 1e12 || a < 1e-9) {
    const [m, e] = v.toExponential(9).split("e");
    return `${m.replace(/\.?0+$/, "")} × 10^${Number(e)}`;
  }
  return String(Number(v.toPrecision(12)));
}

interface Line {
  expr: string;
  result: string;
}

/** History lives while the calculator is open, even when you move to another question or
 * screen; closing the calculator clears it. */
let openHistory: Line[] = [];

const BASIC_KEYS = [
  ["MC", "MR", "M−", "M+"],
  ["C", "⌫", "%", "÷"],
  ["7", "8", "9", "×"],
  ["4", "5", "6", "−"],
  ["1", "2", "3", "+"],
  ["±", "0", ".", "="],
  ["√", "(", ")", "x²"],
];
const SCI_KEYS = [
  ["sin", "cos", "tan", "DEG"],
  ["asin", "acos", "atan", "π"],
  ["ln", "log", "eˣ", "e"],
  ["x²", "xʸ", "√", "∛"],
  ["x!", "1/x", "|x|", "EE"],
  ["nCr", "nPr", ",", "Ans"],
  ["C", "⌫", "(", ")"],
  ["7", "8", "9", "÷"],
  ["4", "5", "6", "×"],
  ["1", "2", "3", "−"],
  ["0", ".", "=", "+"],
];

const COLORS = ["var(--calc-1)", "var(--calc-2)", "var(--calc-3)", "var(--calc-4)"];

export function Calculator({ kind, onClose }: { kind: CalcKind; onClose: () => void }) {
  const [tab, setTab] = useState<"calc" | "graph">("calc");
  return (
    <aside className="calc-panel" aria-label={KIND_LABEL[kind]}>
      <div className="calc-head">
        <h2>{KIND_LABEL[kind]}</h2>
        <button className="btn ghost sm" onClick={onClose} aria-label="Close calculator">
          ✕
        </button>
      </div>
      {kind === "graphing" && (
        <div className="calc-tabs" role="tablist" aria-label="Calculator mode">
          <button role="tab" aria-selected={tab === "calc"} onClick={() => setTab("calc")}>
            Calculate
          </button>
          <button role="tab" aria-selected={tab === "graph"} onClick={() => setTab("graph")}>
            Graph
          </button>
        </div>
      )}
      {/* Both stay mounted so switching tabs keeps the entry, memory and history. */}
      <div className="calc-pane" hidden={kind === "graphing" && tab === "graph"}>
        <Keypad kind={kind} />
      </div>
      {kind === "graphing" && (
        <div className="calc-pane graph" hidden={tab !== "graph"}>
          <Grapher />
        </div>
      )}
    </aside>
  );
}

function Keypad({ kind }: { kind: CalcKind }) {
  const basic = kind === "basic";
  const [expr, setExpr] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [ans, setAns] = useState(0);
  const [memory, setMemory] = useState(0);
  const [deg, setDeg] = useState(false);
  const [history, setHistoryState] = useState<Line[]>(() => openHistory);
  const setHistory = (fn: Line[] | ((h: Line[]) => Line[])) =>
    setHistoryState((h) => (openHistory = typeof fn === "function" ? fn(h) : fn));
  const input = useRef<HTMLInputElement>(null);
  // After "=", typing an operator continues from the answer; typing a number starts over.
  const fresh = useRef(false);

  const calc = (src: string): number => evaluate(toEngine(src, deg), { ans }, undefined, { implicit: true });

  const equals = () => {
    if (!expr.trim()) return;
    try {
      const v = calc(expr);
      const r = formatResult(v);
      setResult(r);
      setError("");
      setAns(v);
      setHistory((h) => [{ expr, result: r }, ...h].slice(0, 100));
      fresh.current = true;
    } catch (e) {
      setError(friendly((e as Error).message));
      setResult(null);
    }
  };

  const insert = (text: string, opts: { wrap?: string; op?: boolean } = {}) => {
    const el = input.current;
    let cur = expr;
    if (fresh.current) {
      cur = opts.op ? "Ans" : "";
      fresh.current = false;
    }
    if (opts.wrap) {
      // Apply a function to the whole entry (basic √, x², ±, 1/x …) or to what's typed so far.
      const body = cur.trim() || (result !== null ? "Ans" : "");
      setExpr(opts.wrap.replace("#", body ? `(${body})` : "("));
    } else {
      const start = el && document.activeElement === el ? (el.selectionStart ?? cur.length) : cur.length;
      const end = el && document.activeElement === el ? (el.selectionEnd ?? cur.length) : cur.length;
      setExpr(cur.slice(0, start) + text + cur.slice(end));
      requestAnimationFrame(() => el?.setSelectionRange(start + text.length, start + text.length));
    }
    setError("");
  };

  const memValue = (): number | null => {
    try {
      return expr.trim() ? calc(expr) : ans;
    } catch {
      return null;
    }
  };

  const press = (k: string) => {
    switch (k) {
      case "=":
        return equals();
      case "C":
        setExpr("");
        setResult(null);
        setError("");
        fresh.current = false;
        return;
      case "⌫":
        fresh.current = false;
        return setExpr((e) => e.slice(0, -1));
      case "DEG":
        return setDeg((d) => !d);
      case "MC":
        return setMemory(0);
      case "MR":
        return insert(formatResult(memory).replace(" × 10^", "e"));
      case "M+":
      case "M−": {
        const v = memValue();
        if (v !== null) setMemory((m) => (k === "M+" ? m + v : m - v));
        return;
      }
      case "±":
        return insert("", { wrap: "−#" });
      case "√":
        return basic ? insert("", { wrap: "√#" }) : insert("√(");
      case "∛":
        return insert("∛(");
      case "x²":
        return basic ? insert("", { wrap: "#²" }) : insert("²", { op: true });
      case "xʸ":
        return insert("^", { op: true });
      case "eˣ":
        return insert("e^(");
      case "x!":
        return insert("!", { op: true });
      case "1/x":
        return insert("", { wrap: "1/#" });
      case "|x|":
        return insert("abs(");
      case "EE":
        return insert("×10^", { op: true });
      case "Ans":
        return insert("Ans");
      case "nCr":
      case "nPr":
        return insert(`${k}(`);
      case "sin":
      case "cos":
      case "tan":
      case "asin":
      case "acos":
      case "atan":
      case "ln":
      case "log":
        return insert(`${k}(`);
      case "+":
      case "−":
      case "×":
      case "÷":
      case "%":
        return insert(k, { op: true });
      default:
        return insert(k);
    }
  };

  const keys = basic ? BASIC_KEYS : SCI_KEYS;
  return (
    <div className="calc-body">
      <div className="calc-screen">
        <input
          ref={input}
          className="calc-input"
          value={expr}
          onChange={(e) => {
            fresh.current = false;
            setExpr(e.target.value.replace(/\*/g, "×").replace(/\//g, "÷"));
            setError("");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              equals();
            } else if (e.key === "Escape") {
              setExpr("");
              setResult(null);
            }
            e.stopPropagation(); // keep the runner's keyboard shortcuts out of the calculator
          }}
          aria-label="Expression"
          inputMode={basic ? "decimal" : "text"}
          autoComplete="off"
          spellCheck={false}
        />
        <div className="calc-result" aria-live="polite">
          {error ? <span className="calc-error">{error}</span> : result !== null ? <>= {result}</> : " "}
        </div>
        <div className="calc-flags small muted">
          {!basic && <span>{deg ? "DEG" : "RAD"}</span>}
          {memory !== 0 && <span>M = {formatResult(memory)}</span>}
        </div>
      </div>
      <div className={`calc-keys ${basic ? "basic" : "sci"}`}>
        {keys.flat().map((k) => (
          <button
            key={k}
            className={`calc-key${k === "=" ? " eq" : /^[0-9.]$/.test(k) ? " num" : /^[+−×÷]$/.test(k) ? " op" : ""}${k === "DEG" && deg ? " on" : ""}`}
            onClick={() => press(k)}
            aria-label={KEY_NAMES[k] ?? k}
            aria-pressed={k === "DEG" ? deg : undefined}
          >
            {k === "DEG" ? (deg ? "DEG" : "RAD") : k}
          </button>
        ))}
      </div>
      <section className="calc-history" aria-labelledby="calc-history-h">
        <div className="calc-history-head">
          <h3 id="calc-history-h">History</h3>
          {history.length > 0 && (
            <button className="btn ghost sm" onClick={() => setHistory([])}>
              Clear
            </button>
          )}
        </div>
        {history.length === 0 ? (
          <p className="small muted">Your calculations show here. History clears when you close the calculator.</p>
        ) : (
          <ol aria-label="Earlier calculations, newest first">
            {history.map((h, i) => (
              <li key={history.length - i}>
                <button onClick={() => setExpr(h.expr)} title="Use this expression again" aria-label={`Use again: ${h.expr}`}>
                  {h.expr}
                </button>
                <button className="calc-history-result" onClick={() => insert(h.result.replace(" × 10^", "e"))} title="Insert this result" aria-label={`Insert result ${h.result}`}>
                  = {h.result}
                </button>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}

const KEY_NAMES: Record<string, string> = {
  "⌫": "Backspace",
  C: "Clear",
  "÷": "Divide",
  "×": "Times",
  "−": "Minus",
  "+": "Plus",
  "=": "Equals",
  "±": "Change sign",
  "√": "Square root",
  "∛": "Cube root",
  "x²": "Square",
  xʸ: "Power",
  "eˣ": "e to the power",
  "x!": "Factorial",
  "1/x": "Reciprocal",
  "|x|": "Absolute value",
  EE: "Times ten to the power",
  DEG: "Angle unit: switch between degrees and radians",
  MC: "Memory clear",
  MR: "Memory recall",
  "M+": "Memory add",
  "M−": "Memory subtract",
  "%": "Percent",
  π: "Pi",
};

function friendly(msg: string): string {
  if (/Unknown/.test(msg)) return msg.replace(/"/g, "");
  if (/finite/.test(msg)) return "That's undefined (division by zero or out of range).";
  return "Check the expression: " + msg.replace(/^.*?: /, "");
}

// ---------------------------------------------------------------------------
// Graphing

interface Win {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
}
const START: Win = { x0: -10, x1: 10, y0: -10, y1: 10 };
const W = 300;
const H = 300;

/** A "nice" grid step (1, 2 or 5 × 10^n) for a span. */
function niceStep(span: number): number {
  const raw = span / 8;
  const p = 10 ** Math.floor(Math.log10(raw));
  const m = raw / p;
  return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * p;
}

function Grapher() {
  const [fns, setFns] = useState(["x^2 - 3", "", "", ""]);
  const [win, setWin] = useState<Win>(START);
  const [deg, setDeg] = useState(false);
  const [trace, setTrace] = useState<number | null>(null);
  const svg = useRef<SVGSVGElement>(null);
  const drag = useRef<{ x: number; y: number; win: Win } | null>(null);

  const compiled = useMemo(
    () =>
      fns.map((f): { node: Node | null; error: string } => {
        if (!f.trim()) return { node: null, error: "" };
        try {
          const src = toEngine(f.replace(/^\s*y\s*=/, ""), deg);
          return { node: parse(src, { implicit: true, vars: ["x"] }), error: "" };
        } catch (e) {
          return { node: null, error: (e as Error).message };
        }
      }),
    [fns, deg],
  );

  const sx = (x: number) => ((x - win.x0) / (win.x1 - win.x0)) * W;
  const sy = (y: number) => H - ((y - win.y0) / (win.y1 - win.y0)) * H;
  const at = (n: Node, x: number): number => {
    try {
      return evalNode(n, { scope: { x } });
    } catch {
      return NaN;
    }
  };

  const paths = compiled.map(({ node }) => {
    if (!node) return "";
    let d = "";
    let pen = false;
    let prev = NaN;
    const steps = 600;
    for (let i = 0; i <= steps; i++) {
      const x = win.x0 + ((win.x1 - win.x0) * i) / steps;
      const y = at(node, x);
      const ok = Number.isFinite(y) && Math.abs(sy(y)) < 1e5;
      // Break the line at jumps (asymptotes) as well as gaps.
      const jump = Number.isFinite(prev) && Math.abs(y - prev) > (win.y1 - win.y0) * 2;
      if (ok && pen && !jump) d += `L${sx(x).toFixed(1)},${sy(y).toFixed(1)}`;
      else if (ok) d += `M${sx(x).toFixed(1)},${sy(y).toFixed(1)}`;
      pen = ok;
      prev = y;
    }
    return d;
  });

  const step = niceStep(win.x1 - win.x0);
  const stepY = niceStep(win.y1 - win.y0);
  const ticks = (a: number, b: number, s: number) => {
    const out: number[] = [];
    for (let v = Math.ceil(a / s) * s; v <= b + 1e-9; v += s) out.push(Number(v.toPrecision(10)));
    return out;
  };

  const zoom = (f: number, cx = (win.x0 + win.x1) / 2, cy = (win.y0 + win.y1) / 2) =>
    setWin({ x0: cx - (cx - win.x0) * f, x1: cx + (win.x1 - cx) * f, y0: cy - (cy - win.y0) * f, y1: cy + (win.y1 - cy) * f });
  const pan = (dx: number, dy: number) => {
    const ex = (win.x1 - win.x0) * dx;
    const ey = (win.y1 - win.y0) * dy;
    setWin({ x0: win.x0 + ex, x1: win.x1 + ex, y0: win.y0 + ey, y1: win.y1 + ey });
  };
  const toWorld = (clientX: number, clientY: number) => {
    const r = svg.current!.getBoundingClientRect();
    return { x: win.x0 + ((clientX - r.left) / r.width) * (win.x1 - win.x0), y: win.y1 - ((clientY - r.top) / r.height) * (win.y1 - win.y0) };
  };

  useEffect(() => {
    const el = svg.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const p = toWorld(e.clientX, e.clientY);
      zoom(e.deltaY > 0 ? 1.2 : 1 / 1.2, p.x, p.y);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  });

  const first = compiled.findIndex((c) => c.node);
  const traceY = trace !== null && first >= 0 ? at(compiled[first].node!, trace) : NaN;

  return (
    <div className="calc-body">
      <div className="graph-fns">
        {fns.map((f, i) => (
          <label key={i} className="graph-fn">
            <span className="graph-swatch" style={{ background: COLORS[i] }} aria-hidden="true" />
            <span>
              y<sub>{i + 1}</sub> =
            </span>
            <input
              className="calc-input"
              value={f}
              placeholder={i === 0 ? "e.g. 2x + 1" : ""}
              onChange={(e) => setFns((all) => all.map((g, j) => (j === i ? e.target.value : g)))}
              onKeyDown={(e) => e.stopPropagation()}
              aria-label={`Function ${i + 1}`}
              aria-invalid={!!compiled[i].error}
              spellCheck={false}
              autoComplete="off"
            />
          </label>
        ))}
        {compiled.some((c) => c.error) && <p className="calc-error small">{compiled.find((c) => c.error)!.error}</p>}
      </div>
      <svg
        ref={svg}
        className="graph"
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Graph of ${fns.filter((f) => f.trim()).map((f, i) => `y${i + 1} = ${f}`).join("; ") || "nothing yet"}, x from ${formatResult(win.x0)} to ${formatResult(win.x1)}`}
        onPointerDown={(e) => {
          (e.target as Element).setPointerCapture?.(e.pointerId);
          drag.current = { x: e.clientX, y: e.clientY, win };
        }}
        onPointerMove={(e) => {
          const p = toWorld(e.clientX, e.clientY);
          setTrace(p.x);
          const d = drag.current;
          if (d) {
            const r = svg.current!.getBoundingClientRect();
            const ex = ((e.clientX - d.x) / r.width) * (d.win.x1 - d.win.x0);
            const ey = ((e.clientY - d.y) / r.height) * (d.win.y1 - d.win.y0);
            setWin({ x0: d.win.x0 - ex, x1: d.win.x1 - ex, y0: d.win.y0 + ey, y1: d.win.y1 + ey });
          }
        }}
        onPointerUp={() => (drag.current = null)}
        onPointerLeave={() => {
          drag.current = null;
          setTrace(null);
        }}
      >
        <rect width={W} height={H} className="graph-bg" />
        {ticks(win.x0, win.x1, step).map((v) => (
          <line key={`x${v}`} x1={sx(v)} x2={sx(v)} y1={0} y2={H} className="graph-grid" />
        ))}
        {ticks(win.y0, win.y1, stepY).map((v) => (
          <line key={`y${v}`} y1={sy(v)} y2={sy(v)} x1={0} x2={W} className="graph-grid" />
        ))}
        {win.y0 <= 0 && win.y1 >= 0 && <line x1={0} x2={W} y1={sy(0)} y2={sy(0)} className="graph-axis" />}
        {win.x0 <= 0 && win.x1 >= 0 && <line y1={0} y2={H} x1={sx(0)} x2={sx(0)} className="graph-axis" />}
        {ticks(win.x0, win.x1, step)
          .filter((v) => v !== 0)
          .map((v) => (
            <text key={`tx${v}`} x={sx(v)} y={Math.min(H - 3, Math.max(10, sy(0) + 11))} className="graph-tick" textAnchor="middle">
              {formatResult(v)}
            </text>
          ))}
        {ticks(win.y0, win.y1, stepY)
          .filter((v) => v !== 0)
          .map((v) => (
            <text key={`ty${v}`} x={Math.min(W - 3, Math.max(3, sx(0) + 3))} y={sy(v) + 3} className="graph-tick">
              {formatResult(v)}
            </text>
          ))}
        {paths.map((d, i) => d && <path key={i} d={d} fill="none" stroke={COLORS[i]} strokeWidth={2.2} />)}
        {trace !== null && Number.isFinite(traceY) && (
          <circle cx={sx(trace)} cy={sy(traceY)} r={4} fill={COLORS[first]} stroke="var(--surface)" strokeWidth={1.5} />
        )}
      </svg>
      <p className="small muted graph-readout" aria-live="polite">
        {trace !== null && Number.isFinite(traceY)
          ? `y${first + 1}(${formatResult(Number(trace.toPrecision(4)))}) = ${formatResult(Number(traceY.toPrecision(6)))}`
          : "Drag to move, scroll to zoom; point at the graph to read values."}
      </p>
      <div className="row graph-controls">
        <button className="btn sm" onClick={() => zoom(1 / 1.5)} aria-label="Zoom in">
          +
        </button>
        <button className="btn sm" onClick={() => zoom(1.5)} aria-label="Zoom out">
          −
        </button>
        <button className="btn sm" onClick={() => pan(-0.25, 0)} aria-label="Move left">
          ←
        </button>
        <button className="btn sm" onClick={() => pan(0.25, 0)} aria-label="Move right">
          →
        </button>
        <button className="btn sm" onClick={() => pan(0, 0.25)} aria-label="Move up">
          ↑
        </button>
        <button className="btn sm" onClick={() => pan(0, -0.25)} aria-label="Move down">
          ↓
        </button>
        <button className="btn sm" onClick={() => setWin(START)}>
          Reset
        </button>
        <button className={`btn sm${deg ? " primary" : ""}`} onClick={() => setDeg((d) => !d)} aria-pressed={deg}>
          {deg ? "DEG" : "RAD"}
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// The dock: a toggle on the left edge and the panel. Open/closed is remembered per device.

const OPEN_KEY = "erudior.calculator";

function readOpen(): boolean {
  try {
    return localStorage.getItem(OPEN_KEY) === "open";
  } catch {
    return false;
  }
}

export function CalcDock({ kind }: { kind: CalcKind | null }) {
  const [open, setOpen] = useState(readOpen);
  const set = (o: boolean) => {
    setOpen(o);
    try {
      localStorage.setItem(OPEN_KEY, o ? "open" : "closed");
    } catch {
      /* not remembered */
    }
  };
  useEffect(() => {
    const on = !!kind && open;
    document.documentElement.classList.toggle("calc-open", on);
    return () => document.documentElement.classList.remove("calc-open");
  }, [kind, open]);
  if (!kind) return null;
  return open ? (
    <Calculator
      kind={kind}
      onClose={() => {
        openHistory = [];
        set(false);
      }}
    />
  ) : (
    <button className="calc-toggle" onClick={() => set(true)} aria-label={`Open the ${KIND_LABEL[kind].toLowerCase()}`} title={KIND_LABEL[kind]}>
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        <rect x="4" y="2.5" width="16" height="19" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <rect x="7" y="5.5" width="10" height="4" rx="1" fill="currentColor" />
        <circle cx="8.5" cy="13" r="1.2" fill="currentColor" />
        <circle cx="12" cy="13" r="1.2" fill="currentColor" />
        <circle cx="15.5" cy="13" r="1.2" fill="currentColor" />
        <circle cx="8.5" cy="17" r="1.2" fill="currentColor" />
        <circle cx="12" cy="17" r="1.2" fill="currentColor" />
        <circle cx="15.5" cy="17" r="1.2" fill="currentColor" />
      </svg>
      <span>Calculator</span>
    </button>
  );
}

// The screen for a lesson's ```sim block: settings (sliders and choices), Play/Pause, Step,
// Reset, live readouts, a picture of what's happening and a simple graph. Lazy-loaded by
// LessonWidgets. Nothing moves until the learner presses Play; with "reduce motion" turned on
// in the system, Play becomes Run (jumps ahead and draws the whole graph at once) and the
// circuit and gas pictures stay still. Screen readers hear a one-sentence summary when a run
// ends, pauses, steps or a setting changes (not on every frame).

import { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState } from "react";
import { fmtNum, parseSim, SIM_KINDS, simValues, unitText, type SimParam } from "../lib/sims";
import { circuitFacts, gasPressure, MODELS, projectileFacts, type Model, type Values } from "../lib/simModels";

function useReducedMotion(): boolean {
  const q = typeof window !== "undefined" ? window.matchMedia?.("(prefers-reduced-motion: reduce)") : undefined;
  const [r, setR] = useState(!!q?.matches);
  useEffect(() => {
    if (!q) return;
    const f = () => setR(q.matches);
    q.addEventListener?.("change", f);
    return () => q.removeEventListener?.("change", f);
  }, [q]);
  return r;
}

type S = { t: number } & Record<string, unknown>;
const STEP: Record<string, number> = { projectile: 0.1, pendulum: 0.1, population: 0.5 };

export default function SimView({ kind, body }: { kind: string; body: string }) {
  const spec = useMemo(() => parseSim(kind, body), [kind, body]);
  const meta = SIM_KINDS[spec.kind];
  const model = MODELS[spec.kind] as unknown as Model<S> | undefined;
  const reduced = useReducedMotion();
  const [vals, setVals] = useState<Values>(() => simValues(spec));
  const state = useRef<S>(model ? model.init(vals) : { t: 0 });
  const hist = useRef<number[][]>([]);
  const [, setTick] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [say, setSay] = useState("");
  const raf = useRef(0);
  const sayTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const timeless = !!model?.graph.curve;
  // Graphs get a narrower drawing on small screens, so their text stays readable.
  const root = useRef<HTMLDivElement>(null);
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const el = root.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => setNarrow(el.clientWidth < 480));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const redraw = () => setTick((t) => t + 1);
  const record = useCallback(
    (s: S, v: Values) => {
      const smp = model?.graph.sample?.(s, v);
      if (!smp) return;
      const h = hist.current;
      const last = h[h.length - 1];
      if (!last || smp[0] - last[0] >= 1 / 30 || s === state.current) h.push(smp);
      if (h.length > 3000) h.splice(0, h.length - 3000);
    },
    [model],
  );
  const announce = (text: string, delay = 0) => {
    clearTimeout(sayTimer.current);
    sayTimer.current = setTimeout(() => setSay(text), delay);
  };

  const reset = useCallback(
    (v: Values) => {
      if (!model) return;
      state.current = model.init(v);
      hist.current = [];
      record(state.current, v);
      redraw();
    },
    [model, record],
  );

  useEffect(() => () => (cancelAnimationFrame(raf.current), clearTimeout(sayTimer.current)), []);
  useEffect(() => reset(vals), []); // eslint-disable-line react-hooks/exhaustive-deps

  // The animation loop (only while playing).
  useEffect(() => {
    if (!playing || !model) return;
    let last = performance.now();
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000) * model.speed;
      last = now;
      if (!timeless) {
        let s = state.current;
        // Small steps so the graph gets enough points.
        for (let left = dt; left > 1e-9; left -= 1 / 60) {
          s = model.step(s, Math.min(left, 1 / 60), vals);
          record(s, vals);
        }
        state.current = s;
        if (model.done?.(s, vals)) {
          setPlaying(false);
          announce(model.status?.(s, vals) ?? "Finished.");
          redraw();
          return;
        }
      } else state.current = model.step(state.current, dt, vals);
      redraw();
      raf.current = requestAnimationFrame(frame);
    };
    raf.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf.current);
  }, [playing, model, vals, timeless, record]);

  if (!meta || !model) return <p className="notice">This simulation can't be shown: {spec.problems[0] ?? "unknown kind"}.</p>;

  const s = state.current;
  const done = !!model.done?.(s, vals);
  const shown = (p: SimParam) => !spec.fixed.includes(p.key) && (!p.when || vals[p.when[0]] === p.when[1]);
  const setVal = (k: string, v: number | string) => {
    const next = { ...vals, [k]: v };
    setVals(next);
    if (!timeless) {
      setPlaying(false);
      reset(next);
      announce(`${model.status?.(model.init(next), next) ?? ""} Press ${reduced ? "Run" : "Play"} to start.`.trim(), 700);
    } else announce(model.status?.(state.current, next) ?? "", 700);
  };

  const play = () => {
    if (timeless) {
      setPlaying((p) => !p);
      return;
    }
    if (reduced) {
      // Jump ahead instead of animating.
      let st = done ? model.init(vals) : state.current;
      if (done) hist.current = [];
      const end = st.t + model.runFor;
      for (let i = 0; i < 200000 && st.t < end - 1e-9 && !model.done?.(st, vals); i++) {
        st = model.step(st, Math.min(1 / 60, end - st.t), vals);
        record(st, vals);
      }
      state.current = st;
      redraw();
      announce(model.status?.(st, vals) ?? "");
      return;
    }
    if (playing) {
      setPlaying(false);
      announce(`Paused. ${model.status?.(state.current, vals) ?? ""}`);
      return;
    }
    if (done) reset(vals);
    setPlaying(true);
  };
  const step = () => {
    setPlaying(false);
    if (done) return;
    let st = state.current;
    const end = st.t + (STEP[spec.kind] ?? 0.1);
    while (st.t < end - 1e-9 && !model.done?.(st, vals)) {
      st = model.step(st, Math.min(1 / 60, end - st.t), vals);
      record(st, vals);
    }
    state.current = st;
    redraw();
    announce(model.status?.(st, vals) ?? "");
  };

  const playLabel = timeless ? (playing ? "Stop the motion" : "Show the motion") : reduced ? (done ? "Run again" : "Run") : playing ? "Pause" : done ? "Play again" : "Play";

  return (
    <Dims.Provider value={narrow ? NARROW : WIDE}>
    <div className="sim-ui" ref={root}>
      <div className="sim-controls">
        {(meta.choices ?? [])
          .filter((c) => !spec.fixed.includes(c.key))
          .map((c) => (
            <label key={c.key} className="field sim-field is-choice">
              <span>{c.label}</span>
              <select className="input" value={String(vals[c.key])} onChange={(e) => setVal(c.key, e.target.value)}>
                {c.options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
          ))}
        {meta.params.filter(shown).map((p) => {
          const [lo, hi] = spec.ranges[p.key] ?? [p.min, p.max];
          const v = Number(vals[p.key]);
          const text = `${fmtNum(v, p.step)}${unitText(p.unit)}`;
          return (
            <label key={p.key} className="field sim-field">
              <span className="sim-label">
                <span>{p.label}</span>
                <b className="num">{text}</b>
              </span>
              <input type="range" min={lo} max={hi} step={p.step} value={v} aria-valuetext={text} onChange={(e) => setVal(p.key, Number(e.target.value))} />
            </label>
          );
        })}
      </div>
      <div className="sim-buttons" role="group" aria-label="Simulation controls">
        <button type="button" className="btn sm primary" onClick={play} aria-pressed={timeless ? playing : undefined}>
          {playLabel}
        </button>
        {!timeless && (
          <button type="button" className="btn sm" onClick={step} disabled={done}>
            Step
          </button>
        )}
        {!timeless && (
          <button
            type="button"
            className="btn sm ghost"
            onClick={() => {
              setPlaying(false);
              reset(vals);
              announce("Back to the start.");
            }}
          >
            Reset
          </button>
        )}
      </div>
      <div className="sim-stage">
        <div className="sim-scene">
          <Scene kind={spec.kind} s={s} v={vals} hist={hist.current} moving={playing && !reduced} />
        </div>
        <dl className="sim-readouts" aria-label="Readouts">
          {model.readouts(s, vals).map((r) => (
            <div key={r.label}>
              <dt>{r.label}</dt>
              <dd className="num">{r.value}</dd>
            </div>
          ))}
        </dl>
      </div>
      {spec.kind !== "projectile" && <SimGraph model={model} v={vals} hist={hist.current} />}
      <p className="sr-only" aria-live="polite">
        {say}
      </p>
    </div>
    </Dims.Provider>
  );
}

// --- Graph ----------------------------------------------------------------------------

function niceStep(span: number, target = 5) {
  const raw = span / target;
  const p = 10 ** Math.floor(Math.log10(raw || 1));
  return [1, 2, 2.5, 5, 10].map((m) => m * p).find((x) => x >= raw) ?? raw;
}
const tickText = (v: number, step: number) => (Math.abs(v) < step / 1e6 ? "0" : Math.abs(step) >= 1 ? String(Math.round(v)) : v.toFixed(Math.min(3, Math.ceil(-Math.log10(step)))));

const ML = 52, MR = 14, MT = 12, MB = 40;
const WIDE = { W: 420, H: 250 }, NARROW = { W: 310, H: 230 };
const Dims = createContext(WIDE);

function Axes({ xr, yr, xLabel, yLabel, children }: { xr: [number, number]; yr: [number, number]; xLabel: string; yLabel: string; children: React.ReactNode }) {
  const { W, H } = useContext(Dims);
  const X = (x: number) => ML + ((x - xr[0]) / (xr[1] - xr[0] || 1)) * (W - ML - MR);
  const Y = (y: number) => H - MB - ((y - yr[0]) / (yr[1] - yr[0] || 1)) * (H - MT - MB);
  const xs = niceStep(xr[1] - xr[0]), ys = niceStep(yr[1] - yr[0]);
  const ticks = (r: [number, number], st: number) => {
    const out: number[] = [];
    for (let v = Math.ceil(r[0] / st) * st; v <= r[1] + st * 1e-9; v += st) out.push(v);
    return out;
  };
  const clip = useId().replace(/:/g, "");
  return (
    <>
      <defs>
        <clipPath id={clip}>
          <rect x={ML} y={MT} width={W - ML - MR} height={H - MT - MB} />
        </clipPath>
      </defs>
      {ticks(xr, xs).map((v) => (
        <g key={`x${v}`}>
          <line x1={X(v)} x2={X(v)} y1={MT} y2={H - MB} className="sim-grid" />
          <text x={X(v)} y={H - MB + 15} className="sim-tick" textAnchor="middle">
            {tickText(v, xs)}
          </text>
        </g>
      ))}
      {ticks(yr, ys).map((v) => (
        <g key={`y${v}`}>
          <line x1={ML} x2={W - MR} y1={Y(v)} y2={Y(v)} className="sim-grid" />
          <text x={ML - 6} y={Y(v) + 4} className="sim-tick" textAnchor="end">
            {tickText(v, ys)}
          </text>
        </g>
      ))}
      <line x1={ML} x2={W - MR} y1={Y(Math.max(yr[0], Math.min(yr[1], 0)))} y2={Y(Math.max(yr[0], Math.min(yr[1], 0)))} className="sim-axis" />
      <line x1={ML} x2={ML} y1={MT} y2={H - MB} className="sim-axis" />
      <text x={(ML + W - MR) / 2} y={H - 6} className="sim-axis-label" textAnchor="middle">
        {xLabel}
      </text>
      <text x={12} y={(MT + H - MB) / 2} className="sim-axis-label" textAnchor="middle" transform={`rotate(-90 12 ${(MT + H - MB) / 2})`}>
        {yLabel}
      </text>
      <g clipPath={`url(#${clip})`}>{children}</g>
    </>
  );
}

const toXY = (xr: [number, number], yr: [number, number], { W, H }: typeof WIDE) => ({
  X: (x: number) => ML + ((x - xr[0]) / (xr[1] - xr[0] || 1)) * (W - ML - MR),
  Y: (y: number) => H - MB - ((y - yr[0]) / (yr[1] - yr[0] || 1)) * (H - MT - MB),
});
const pathOf = (pts: [number, number][], X: (x: number) => number, Y: (y: number) => number) =>
  pts.length ? "M" + pts.map(([x, y]) => `${X(x).toFixed(1)},${Y(y).toFixed(1)}`).join("L") : "";

function SimGraph({ model, v, hist }: { model: Model<S>; v: Values; hist: number[][] }) {
  const g = model.graph;
  const dims = useContext(Dims);
  const { W, H } = dims;
  const isTemp = v.graph === "temperature";
  const xLabel = g.curve && isTemp ? "Temperature (K)" : g.x;
  const yLabel = v.model === "logistic" ? "Population" : g.y;
  let { x: xr, y: yr } = g.range?.(v) ?? { x: [0, 1] as [number, number], y: [0, 1] as [number, number] };
  // History graphs scroll: show the last stretch of time.
  if (g.sample && hist.length) {
    const t = hist[hist.length - 1][0];
    const span = xr[1] - xr[0];
    if (t > xr[1]) xr = [t - span, t];
    if (yr[1] === 0) yr = [0, Math.max(10, ...hist.flatMap((h) => h.slice(1))) * 1.1];
  }
  const { X, Y } = toXY(xr, yr, dims);
  const lines = g.sample ? (hist[0]?.length ?? 2) - 1 : 0;
  const pt = g.point?.(v);
  const names = v.model === "logistic" ? ["Population"] : (g.lines ?? []);
  const desc = `Graph of ${yLabel.toLowerCase()} against ${xLabel.toLowerCase()}${pt ? `; you are at ${tickText(pt[0], 0.1)}, ${tickText(pt[1], 0.01)}` : ""}.`;
  return (
    <figure className="sim-graph">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={desc}>
        <Axes xr={xr} yr={yr} xLabel={xLabel} yLabel={yLabel}>
          {g.curve && <path d={pathOf(g.curve(v), X, Y)} className="sim-line k0" />}
          {pt && <circle cx={X(pt[0])} cy={Y(pt[1])} r={5} className="sim-dot" />}
          {Array.from({ length: lines }, (_, k) => (
            <path key={k} d={pathOf(hist.filter((h) => h[0] >= xr[0]).map((h) => [h[0], h[k + 1]]), X, Y)} className={`sim-line k${k}`} />
          ))}
        </Axes>
      </svg>
      {names.length > 1 && lines > 1 && (
        <figcaption className="sim-legend small" aria-hidden="true">
          {names.map((n, k) => (
            <span key={n}>
              <i className={`sim-swatch k${k}`} /> {n}
            </span>
          ))}
        </figcaption>
      )}
    </figure>
  );
}

// --- Pictures ---------------------------------------------------------------------------

function Scene({ kind, s, v, hist, moving }: { kind: string; s: S; v: Values; hist: number[][]; moving: boolean }) {
  const dims = useContext(Dims);
  const { W, H } = dims;
  if (kind === "projectile") {
    const f = projectileFacts(v);
    const xr: [number, number] = [0, Math.max(5, f.range * 1.05)];
    const yr: [number, number] = [0, Math.max(5, f.top * 1.15)];
    const { X, Y } = toXY(xr, yr, dims);
    const ang = (Number(v.angle) * Math.PI) / 180;
    return (
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`The ball's path: height against distance. It is ${(s.x as number).toFixed(1)} meters along and ${(s.y as number).toFixed(1)} meters up.`}>
        <Axes xr={xr} yr={yr} xLabel="Distance (m)" yLabel="Height (m)">
          <line x1={X(0)} y1={Y(f.h)} x2={X(0) + 34 * Math.cos(ang)} y2={Y(f.h) - 34 * Math.sin(ang)} className="sim-launch" />
          <path d={pathOf(hist.map((h) => [h[0], h[1]]), X, Y)} className="sim-line k0" />
          <circle cx={X(s.x as number)} cy={Y(s.y as number)} r={6} className="sim-ball" />
        </Axes>
      </svg>
    );
  }
  if (kind === "pendulum") {
    const L = Number(v.length);
    // Pivot at the top unless it starts above horizontal; the drawn length grows with the real one.
    const high = Number(v.angle) > 85;
    const len = (high ? 105 : 205) * Math.sqrt(L / 5);
    const px = 210, py = high ? 125 : 22;
    const th = s.th as number;
    const bx = px + Math.sin(th) * len, by = py + Math.cos(th) * len;
    return (
      <svg viewBox="0 0 420 250" role="img" aria-label={`A pendulum ${L} meters long, now at ${((th * 180) / Math.PI).toFixed(0)} degrees.`}>
        <line x1={px} y1={py} x2={px} y2={py + len + 14} className="sim-grid" strokeDasharray="4 4" />
        <line x1={px} y1={py} x2={bx} y2={by} className="sim-string" />
        <circle cx={px} cy={py} r={4} className="sim-pivot" />
        <circle cx={bx} cy={by} r={10} className="sim-ball" />
      </svg>
    );
  }
  if (kind === "circuit") return <CircuitScene v={v} t={s.t} moving={moving} />;
  if (kind === "gas") return <GasScene v={v} t={s.t} moving={moving} />;
  // Populations: current numbers as bars.
  const logistic = v.model === "logistic";
  const rows = logistic ? [["Population", s.a as number, Number(v.capacity)]] : [["Rabbits", s.a as number, 0], ["Foxes", s.b as number, 0]];
  const max = Math.max(10, ...rows.map((r) => Math.max(r[1] as number, r[2] as number))) * 1.15;
  return (
    <svg viewBox="0 0 420 130" role="img" aria-label={rows.map((r) => `${r[0]}: ${Math.round(r[1] as number)}`).join(", ")}>
      {rows.map(([name, val, cap], i) => (
        <g key={name as string} transform={`translate(0 ${20 + i * 50})`}>
          <text x={8} y={22} className="sim-axis-label">
            {name}
          </text>
          <rect x={90} y={6} width={Math.max(1, ((val as number) / max) * 300)} height={24} className={`sim-bar k${i}`} />
          <text x={96 + ((val as number) / max) * 300} y={23} className="sim-tick">
            {Math.round(val as number)}
          </text>
          {(cap as number) > 0 && <line x1={90 + ((cap as number) / max) * 300} x2={90 + ((cap as number) / max) * 300} y1={0} y2={36} className="sim-cap" />}
        </g>
      ))}
      {logistic && (
        <text x={90 + (Number(v.capacity) / max) * 300} y={124} className="sim-tick" textAnchor="middle">
          capacity
        </text>
      )}
    </svg>
  );
}

function Resistor({ x, y, vertical, label }: { x: number; y: number; vertical?: boolean; label: string }) {
  const zig = "l4,-7 l8,14 l8,-14 l8,14 l8,-14 l8,14 l4,-7";
  return (
    <g transform={`translate(${x} ${y})${vertical ? " rotate(90)" : ""}`}>
      <rect x={-2} y={-12} width={52} height={24} className="sim-erase" />
      <path d={`M0,0 ${zig}`} className="sim-wire" />
      <text x={24} y={vertical ? 26 : -16} className="sim-tick" textAnchor="middle" transform={vertical ? "rotate(-90 24 26) translate(-14 -10)" : undefined}>
        {label}
      </text>
    </g>
  );
}

function CircuitScene({ v, t, moving }: { v: Values; t: number; moving: boolean }) {
  const f = circuitFacts(v);
  const n = f.each.length;
  // Charges move at a speed that grows with the current (drawn, not to scale).
  const shift = moving ? (t * Math.min(3, f.I) * 60) % 40 : 0;
  const loop = "M60,200 L60,40 L360,40 L360,200 Z";
  return (
    <svg viewBox="0 0 420 250" role="img" aria-label={`${f.series ? "Series" : "Parallel"} circuit: a ${f.V} volt battery and ${n} resistor${n === 1 ? "" : "s"}; ${f.I.toFixed(3)} amps from the battery.`}>
      {f.series ? (
        <>
          <path d={loop} className="sim-wire" />
          <path d={loop} className="sim-flow" strokeDashoffset={-shift} />
          {f.each.map((e, i) => (
            <Resistor key={i} x={110 + i * 85} y={40} label={`R${i + 1} ${e.R} Ω`} />
          ))}
        </>
      ) : (
        <>
          <path d="M60,200 L60,40 L360,40 M60,200 L360,200" className="sim-wire" />
          {f.each.map((e, i) => {
            const x = 160 + i * 90;
            return (
              <g key={i}>
                <path d={`M${x},40 L${x},200`} className="sim-wire" />
                <path d={`M${x},40 L${x},200`} className="sim-flow" strokeDashoffset={-shift * Math.min(3, e.I) / Math.max(0.01, Math.min(3, f.I))} />
                <Resistor x={x} y={95} vertical label={`R${i + 1} ${e.R} Ω`} />
              </g>
            );
          })}
          <path d="M60,200 L60,40 L360,40 M60,200 L360,200" className="sim-flow" strokeDashoffset={-shift} />
        </>
      )}
      {/* Battery: long line is +. */}
      <rect x={45} y={105} width={30} height={30} className="sim-erase" />
      <line x1={44} x2={76} y1={112} y2={112} className="sim-wire" />
      <line x1={52} x2={68} y1={126} y2={126} className="sim-wire thick" />
      <text x={86} y={124} className="sim-tick">
        {f.V} V
      </text>
      <text x={210} y={232} className="sim-tick" textAnchor="middle">
        Current {f.I.toFixed(3)} A
      </text>
    </svg>
  );
}

function GasScene({ v, t, moving }: { v: Values; t: number; moving: boolean }) {
  const V = Number(v.volume), T = Number(v.temperature), nMol = Number(v.amount);
  const w = 60 + (V / 50) * 300;
  const count = Math.round(nMol * 20);
  const sp = Math.sqrt(T / 300) * 40;
  const P = gasPressure(nMol, T, V);
  // Each particle bounces in the box; positions come from time, so there's no state to keep.
  const tri = (u: number) => {
    const m = ((u % 2) + 2) % 2;
    return m < 1 ? m : 2 - m;
  };
  const dots = Array.from({ length: count }, (_, i) => {
    const a = (i * 0.618034) % 1, b = (i * 0.414214 + 0.3) % 1, ang = i * 2.399963;
    const tt = moving ? t : 0;
    return [20 + 6 + tri(a * 2 + (Math.cos(ang) * sp * tt) / (w - 12)) * (w - 12), 30 + 6 + tri(b * 2 + (Math.sin(ang) * sp * tt) / 168) * 168];
  });
  const hot = Math.min(1, Math.max(0, (T - 50) / 950));
  return (
    <svg viewBox="0 0 420 250" role="img" aria-label={`A box of gas: ${nMol} moles at ${T} kelvin in ${V} liters; pressure ${P.toFixed(1)} kilopascals.`}>
      <rect x={20} y={30} width={w} height={180} className="sim-box" />
      <rect x={20 + w} y={24} width={8} height={192} className="sim-piston" />
      {dots.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={3.5} className="sim-particle" style={{ opacity: 0.55 + hot * 0.45 }} />
      ))}
      <text x={20} y={232} className="sim-tick">
        {V} L · {T} K · {P.toFixed(0)} kPa
      </text>
    </svg>
  );
}

// The science behind each simulation (pure functions, tested in tests/sims.test.mts).
// Readouts are rounded for students; the state keeps full precision.

export type Values = Record<string, number | string>;
const n = (v: Values, k: string) => Number(v[k]);
const rad = (d: number) => (d * Math.PI) / 180;

export interface Readout {
  label: string;
  value: string;
}

export interface Model<S> {
  init(v: Values): S;
  /** Advance by dt seconds of simulated time. */
  step(s: S, dt: number, v: Values): S;
  time(s: S): number;
  readouts(s: S, v: Values): Readout[];
  /** A finished run (the ball landed) stops playing. */
  done?(s: S, v: Values): boolean;
  /** One sentence for the end of a run or for a pause, read out to screen readers. */
  status?(s: S, v: Values): string;
  graph: {
    x: string;
    y: string;
    /** Names of the lines, when there is more than one. */
    lines?: string[];
    /** History graphs: one point per sample (x, then each line's y). */
    sample?(s: S, v: Values): number[];
    /** Graphs of the settings themselves (no history): the curve and where you are on it. */
    curve?(v: Values): [number, number][];
    point?(v: Values): [number, number];
    /** Fixed axis ranges, so the picture doesn't jump while it runs. */
    range?(v: Values): { x: [number, number]; y: [number, number] };
  };
  /** Reduced motion: "Run" jumps this far ahead instead of animating. */
  runFor: number;
  /** Simulated seconds per real second while playing. */
  speed: number;
}

const fix = (x: number, d = 1) => (Math.abs(x) < 0.5 * 10 ** -d ? 0 : x).toFixed(d);

// --- Projectile -----------------------------------------------------------------------

export interface ProjectileState {
  t: number;
  x: number;
  y: number;
  landed: boolean;
}

export function projectileFacts(v: Values) {
  const s = n(v, "speed"), a = rad(n(v, "angle")), h = n(v, "height"), g = n(v, "gravity");
  const vx = s * Math.cos(a), vy = s * Math.sin(a);
  // Time to come back down to the ground: solve h + vy t − g t²/2 = 0.
  const flight = (vy + Math.sqrt(vy * vy + 2 * g * h)) / g;
  return { vx, vy, flight, range: vx * flight, top: h + (vy * vy) / (2 * g), g, h };
}

export const projectile: Model<ProjectileState> = {
  init: (v) => ({ t: 0, x: 0, y: n(v, "height"), landed: false }),
  step(s, dt, v) {
    const f = projectileFacts(v);
    const t = Math.min(s.t + dt, f.flight);
    const landed = t >= f.flight - 1e-9;
    return { t, x: f.vx * t, y: landed ? 0 : Math.max(0, f.h + f.vy * t - (f.g * t * t) / 2), landed };
  },
  time: (s) => s.t,
  done: (s) => s.landed,
  readouts(s, v) {
    const f = projectileFacts(v);
    const vy = f.vy - f.g * s.t;
    return [
      { label: "Time", value: `${fix(s.t, 2)} s` },
      { label: "Distance", value: `${fix(s.x)} m` },
      { label: "Height", value: `${fix(s.y)} m` },
      { label: "Speed", value: `${fix(Math.hypot(f.vx, vy))} m/s` },
      { label: "Highest point", value: `${fix(f.top)} m` },
      { label: "Lands at", value: `${fix(f.range)} m` },
    ];
  },
  status: (s, v) => {
    const f = projectileFacts(v);
    return s.landed ? `The ball landed ${fix(f.range)} meters away after ${fix(f.flight, 2)} seconds. Its highest point was ${fix(f.top)} meters.` : `The ball is ${fix(s.x)} meters along and ${fix(s.y)} meters up.`;
  },
  graph: {
    x: "Distance (m)",
    y: "Height (m)",
    sample: (s) => [s.x, s.y],
    range: (v) => {
      const f = projectileFacts(v);
      return { x: [0, Math.max(5, f.range * 1.05)], y: [0, Math.max(5, f.top * 1.15)] };
    },
  },
  runFor: 1e6,
  speed: 1,
};

// --- Pendulum ---------------------------------------------------------------------

export interface PendulumState {
  t: number;
  /** Angle from straight down (radians) and its rate. */
  th: number;
  w: number;
  /** Times the bob crossed the bottom moving right, to measure the period. */
  crossings: number[];
}

function pendAccel(th: number, w: number, v: Values) {
  return -(n(v, "gravity") / n(v, "length")) * Math.sin(th) - n(v, "damping") * w;
}

export const pendulum: Model<PendulumState> = {
  init: (v) => ({ t: 0, th: rad(n(v, "angle")), w: 0, crossings: [] }),
  step(s, dt, v) {
    let { t, th, w } = s;
    const crossings = s.crossings.slice();
    // RK4 in small steps: accurate for big swings, where the simple period formula isn't.
    const steps = Math.max(1, Math.ceil(dt / 0.002));
    const h = dt / steps;
    for (let i = 0; i < steps; i++) {
      const k1t = w, k1w = pendAccel(th, w, v);
      const k2t = w + (h / 2) * k1w, k2w = pendAccel(th + (h / 2) * k1t, w + (h / 2) * k1w, v);
      const k3t = w + (h / 2) * k2w, k3w = pendAccel(th + (h / 2) * k2t, w + (h / 2) * k2w, v);
      const k4t = w + h * k3w, k4w = pendAccel(th + h * k3t, w + h * k3w, v);
      const nth = th + (h / 6) * (k1t + 2 * k2t + 2 * k3t + k4t);
      const nw = w + (h / 6) * (k1w + 2 * k2w + 2 * k3w + k4w);
      if (th < 0 && nth >= 0) crossings.push(t + h * (-th / (nth - th)));
      th = nth;
      w = nw;
      t += h;
    }
    return { t, th, w, crossings: crossings.slice(-3) };
  },
  time: (s) => s.t,
  readouts(s, v) {
    const L = n(v, "length");
    const c = s.crossings;
    return [
      { label: "Time", value: `${fix(s.t, 2)} s` },
      { label: "Angle", value: `${fix((s.th * 180) / Math.PI)}°` },
      { label: "Speed", value: `${fix(Math.abs(s.w) * L, 2)} m/s` },
      { label: "Period (formula 2π√(L/g))", value: `${fix(2 * Math.PI * Math.sqrt(L / n(v, "gravity")), 2)} s` },
      { label: "Period (measured)", value: c.length >= 2 ? `${fix(c[c.length - 1] - c[c.length - 2], 2)} s` : "swing to measure" },
    ];
  },
  status(s, v) {
    const c = s.crossings;
    const formula = 2 * Math.PI * Math.sqrt(n(v, "length") / n(v, "gravity"));
    return c.length >= 2 ? `Measured period ${fix(c[c.length - 1] - c[c.length - 2], 2)} seconds; the formula gives ${fix(formula, 2)} seconds.` : `The formula gives a period of ${fix(formula, 2)} seconds.`;
  },
  graph: {
    x: "Time (s)",
    y: "Angle (°)",
    sample: (s) => [s.t, (s.th * 180) / Math.PI],
    range: (v) => ({ x: [0, 10], y: [-Math.max(10, n(v, "angle")), Math.max(10, n(v, "angle"))] }),
  },
  runFor: 10,
  speed: 1,
};

// --- Circuit ------------------------------------------------------------------------

export function circuitFacts(v: Values) {
  const V = n(v, "voltage");
  const rs = [n(v, "r1"), n(v, "r2"), n(v, "r3")].filter((r) => r > 0);
  const series = v.layout !== "parallel";
  const total = series ? rs.reduce((a, b) => a + b, 0) : 1 / rs.reduce((a, b) => a + 1 / b, 0);
  const I = V / total;
  const each = rs.map((R) => (series ? { R, I, V: I * R } : { R, I: V / R, V }));
  return { V, total, I, each, series, power: V * I };
}

export interface CircuitState {
  t: number;
}

export const circuit: Model<CircuitState> = {
  init: () => ({ t: 0 }),
  step: (s, dt) => ({ t: s.t + dt }),
  time: (s) => s.t,
  readouts(_s, v) {
    const f = circuitFacts(v);
    return [
      { label: "Total resistance", value: `${fix(f.total, 2)} Ω` },
      { label: "Current from the battery", value: `${fix(f.I, 3)} A` },
      ...f.each.map((e, i) => ({ label: `Resistor ${i + 1} (${e.R} Ω)`, value: `${fix(e.I, 3)} A, ${fix(e.V, 2)} V` })),
      { label: "Power", value: `${fix(f.power, 2)} W` },
    ];
  },
  status(_s, v) {
    const f = circuitFacts(v);
    return `${f.series ? "Series" : "Parallel"}: total resistance ${fix(f.total, 2)} ohms, current ${fix(f.I, 3)} amps.`;
  },
  graph: {
    x: "Battery voltage (V)",
    y: "Current (A)",
    curve: (v) => {
      const f = circuitFacts(v);
      return [
        [0, 0],
        [24, 24 / f.total],
      ];
    },
    point: (v) => {
      const f = circuitFacts(v);
      return [f.V, f.I];
    },
    range: (v) => ({ x: [0, 24], y: [0, Math.max(0.1, (24 / circuitFacts(v).total) * 1.05)] }),
  },
  runFor: 0,
  speed: 1,
};

// --- Gas ---------------------------------------------------------------------------

export const R_GAS = 8.314; // J/(mol·K)

/** Pressure in kPa for n mol at T kelvin in V liters. */
export const gasPressure = (nMol: number, T: number, VL: number) => (nMol * R_GAS * T) / VL;

export interface GasState {
  t: number;
}

export const gas: Model<GasState> = {
  init: () => ({ t: 0 }),
  step: (s, dt) => ({ t: s.t + dt }),
  time: (s) => s.t,
  readouts(_s, v) {
    const P = gasPressure(n(v, "amount"), n(v, "temperature"), n(v, "volume"));
    return [
      { label: "Pressure", value: `${fix(P)} kPa` },
      { label: "Pressure in atmospheres", value: `${fix(P / 101.325, 2)} atm` },
      { label: "Temperature", value: `${fix(n(v, "temperature"), 0)} K (${fix(n(v, "temperature") - 273.15, 0)} °C)` },
    ];
  },
  status(_s, v) {
    return `Pressure ${fix(gasPressure(n(v, "amount"), n(v, "temperature"), n(v, "volume")))} kilopascals.`;
  },
  graph: {
    x: "Volume (L)",
    y: "Pressure (kPa)",
    curve: (v) => {
      const pts: [number, number][] = [];
      if (v.graph === "temperature") for (let T = 0; T <= 1000; T += 50) pts.push([T, gasPressure(n(v, "amount"), T, n(v, "volume"))]);
      else for (let V = 1; V <= 50; V += 0.5) pts.push([V, gasPressure(n(v, "amount"), n(v, "temperature"), V)]);
      return pts;
    },
    point: (v) => [v.graph === "temperature" ? n(v, "temperature") : n(v, "volume"), gasPressure(n(v, "amount"), n(v, "temperature"), n(v, "volume"))],
    range: (v) =>
      v.graph === "temperature"
        ? { x: [0, 1000], y: [0, Math.max(10, gasPressure(n(v, "amount"), 1000, n(v, "volume")) * 1.05)] }
        : { x: [0, 50], y: [0, Math.min(gasPressure(n(v, "amount"), n(v, "temperature"), 1), Math.max(50, gasPressure(n(v, "amount"), n(v, "temperature"), n(v, "volume")) * 2.5))] },
  },
  runFor: 0,
  speed: 1,
};

// --- Populations ------------------------------------------------------------------------

export interface PopState {
  t: number;
  /** Prey (or the single population) and predators. */
  a: number;
  b: number;
}

function popRates(a: number, b: number, v: Values): [number, number] {
  if (v.model === "logistic") return [n(v, "rate") * a * (1 - a / n(v, "capacity")), 0];
  // Lotka–Volterra: rabbits are born and eaten; foxes are born from rabbits eaten and die.
  return [n(v, "birth") * a - n(v, "catch") * a * b, n(v, "gain") * a * b - n(v, "death") * b];
}

export const population: Model<PopState> = {
  init: (v) => (v.model === "logistic" ? { t: 0, a: n(v, "start"), b: 0 } : { t: 0, a: n(v, "prey"), b: n(v, "predators") }),
  step(s, dt, v) {
    let { t, a, b } = s;
    const steps = Math.max(1, Math.ceil(dt / 0.01));
    const h = dt / steps;
    for (let i = 0; i < steps; i++) {
      const [k1a, k1b] = popRates(a, b, v);
      const [k2a, k2b] = popRates(a + (h / 2) * k1a, b + (h / 2) * k1b, v);
      const [k3a, k3b] = popRates(a + (h / 2) * k2a, b + (h / 2) * k2b, v);
      const [k4a, k4b] = popRates(a + h * k3a, b + h * k3b, v);
      a = Math.max(0, a + (h / 6) * (k1a + 2 * k2a + 2 * k3a + k4a));
      b = Math.max(0, b + (h / 6) * (k1b + 2 * k2b + 2 * k3b + k4b));
      t += h;
    }
    return { t, a, b };
  },
  time: (s) => s.t,
  readouts(s, v) {
    if (v.model === "logistic")
      return [
        { label: "Year", value: fix(s.t, 1) },
        { label: "Population", value: fix(s.a, 0) },
        { label: "Carrying capacity", value: fix(n(v, "capacity"), 0) },
      ];
    return [
      { label: "Year", value: fix(s.t, 1) },
      { label: "Rabbits", value: fix(s.a, 0) },
      { label: "Foxes", value: fix(s.b, 0) },
    ];
  },
  status: (s, v) => (v.model === "logistic" ? `Year ${fix(s.t, 0)}: population ${fix(s.a, 0)}.` : `Year ${fix(s.t, 0)}: ${fix(s.a, 0)} rabbits and ${fix(s.b, 0)} foxes.`),
  graph: {
    x: "Years",
    y: "Number of animals",
    lines: ["Rabbits", "Foxes"],
    sample: (s, v) => (v.model === "logistic" ? [s.t, s.a] : [s.t, s.a, s.b]),
    range: (v) => (v.model === "logistic" ? { x: [0, 30], y: [0, Math.max(n(v, "capacity"), n(v, "start")) * 1.1] } : { x: [0, 40], y: [0, 0] }),
  },
  runFor: 20,
  speed: 2,
};

export const MODELS: Record<string, Model<never>> = { projectile, pendulum, circuit, gas, population } as unknown as Record<string, Model<never>>;

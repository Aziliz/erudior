// Math manipulatives: ten-frame counters, base-ten blocks, number lines, fraction bars, an
// analog clock and US coins. Used two ways:
//
// - In lessons, a ```manipulative block shows a model the student can play with:
//
//     ```manipulative blocks
//     value: 124
//     caption: Build 124, then trade a ten for ten ones.
//     ```
//
// - In practice, a question with `type: "model"` is answered by changing the model; `target`
//   says what counts as right ("show 347", "make 68¢ with the fewest coins", "set 2:45").
//
// This file is the DOM-free part (the API worker bundles the community format, which uses
// it): reading specs, the state of each model as a list of numbers (that list is the saved
// answer, `Chosen`), moves, checking, descriptions for screen readers, and the pictures as
// SVG strings. The pictures are strings so lessons keep a picture without JavaScript (and in
// prerendered pages); components/Manipulative.tsx adds the controls.

export type ManipKind = "counters" | "blocks" | "numberline" | "fractions" | "clock" | "coins";
export const MANIP_KINDS: ManipKind[] = ["counters", "blocks", "numberline", "fractions", "clock", "coins"];

export const MANIP_NAMES: Record<ManipKind, string> = {
  counters: "Counters in a ten-frame",
  blocks: "Base-ten blocks",
  numberline: "Number line",
  fractions: "Fraction bars",
  clock: "Clock",
  coins: "Coins",
};

/** A model as written in a course: the kind and its starting state (every field optional). */
export interface ManipSpec {
  kind: ManipKind;
  /** Lessons: a line shown above the model. */
  caption?: string;
  /** Show the total (count, number, amount, time, fraction) beside the model. Default true. */
  readout?: boolean;
  /** counters: 1 or 2 ten-frames. */
  frames?: number;
  /** counters: 1 color, or 2 (red and yellow, for adding two groups). */
  colors?: number;
  /** counters: red counters at the start. */
  count?: number;
  /** counters: yellow counters at the start. */
  count2?: number;
  /** blocks: 1–4 places (ones, tens, hundreds, thousands). Default 3. */
  places?: number;
  /** blocks: the number built at the start. */
  value?: number;
  /** numberline: the ends (numbers or fractions like "3/2"). */
  min?: number | string;
  max?: number | string;
  /** numberline: the space between ticks (1, 0.5, "1/4"); clock: minutes per press (default 5). */
  step?: number | string;
  /** numberline: where the marker starts. */
  at?: number | string;
  /** numberline: hop sizes offered as buttons (default: one step). */
  hops?: (number | string)[];
  /** fractions: one starting fraction per bar, as "shaded/parts" ("0/4", "1/2"). */
  bars?: string[];
  /** fractions: the number of parts can't be changed (only shading). */
  fixed?: boolean;
  /** clock: the starting time, "h:mm". */
  time?: string;
  /** coins: the coins offered (default penny, nickel, dime, quarter). */
  coins?: string[];
  /** coins: coins already on the mat. */
  start?: string[];
}

/** What a model question accepts. Which fields apply depends on the model's kind. */
export interface ManipTarget {
  /** counters: the number of counters. */
  count?: number;
  /** counters with 2 colors: exactly this many red and yellow. */
  colors?: number[];
  /** blocks: the number shown. */
  value?: number;
  /** blocks: no place may have 10 or more (no regrouping left); coins: the fewest coins. */
  fewest?: boolean;
  /** numberline: where the marker must end up. */
  at?: number | string;
  /** fractions: one fraction per bar ("3/4"); any equal fraction counts unless `exact`. */
  values?: string[];
  /** fractions: the bar must have exactly that many parts, too. */
  exact?: boolean;
  /** clock: "h:mm". */
  time?: string;
  /** coins: the amount in cents. */
  cents?: number;
}

/** A spec with every default filled in (what the code works from). */
export interface Model {
  kind: ManipKind;
  caption: string;
  readout: boolean;
  frames: number;
  colors: number;
  count: number;
  count2: number;
  places: number;
  value: number;
  min: number;
  max: number;
  step: number;
  /** numberline: label ticks as fractions over this denominator (0 = decimals). */
  den: number;
  at: number;
  hops: number[];
  bars: [number, number][];
  fixed: boolean;
  time: [number, number];
  minuteStep: number;
  /** coins: indices into COINS that are offered. */
  coins: number[];
  start: number[];
}

/** The answer state: a list of numbers whose meaning depends on the kind (see stateOf…). */
export type ManipState = number[];

export const COINS = [
  { id: "penny", name: "penny", plural: "pennies", cents: 1, label: "1¢", mm: 19.05, metal: "copper" },
  { id: "nickel", name: "nickel", plural: "nickels", cents: 5, label: "5¢", mm: 21.21, metal: "silver" },
  { id: "dime", name: "dime", plural: "dimes", cents: 10, label: "10¢", mm: 17.91, metal: "silver" },
  { id: "quarter", name: "quarter", plural: "quarters", cents: 25, label: "25¢", mm: 24.26, metal: "silver" },
  { id: "half", name: "half dollar", plural: "half dollars", cents: 50, label: "50¢", mm: 30.61, metal: "silver" },
  { id: "dollar", name: "dollar coin", plural: "dollar coins", cents: 100, label: "$1", mm: 26.49, metal: "gold" },
] as const;

export const PLACES = [
  { name: "one", plural: "ones" },
  { name: "ten", plural: "tens" },
  { name: "hundred", plural: "hundreds" },
  { name: "thousand", plural: "thousands" },
];

/** Most blocks in one place, coins of one kind, and parts in a fraction bar. */
export const MAX_BLOCKS = 20;
export const MAX_COINS = 20;
export const MAX_PARTS = 12;
export const MAX_BARS = 4;
const MAX_TICKS = 100;

// --- Numbers -----------------------------------------------------------------------

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));
const tidy = (x: number) => Math.round(x * 1e9) / 1e9;
const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;
const MINUS = "−";

/** A number or a fraction "a/b", "-a/b", "1 1/2"; null if it isn't one. */
export function readNumber(x: unknown): number | null {
  if (typeof x === "number") return Number.isFinite(x) ? x : null;
  if (typeof x !== "string") return null;
  const t = x.trim().replace(/[−–]/g, "-");
  if (/^[-+]?(\d+(\.\d*)?|\.\d+)$/.test(t)) return Number(t);
  let m = /^([-+]?)(\d+)\/(\d+)$/.exec(t);
  if (m && Number(m[3])) return (m[1] === "-" ? -1 : 1) * (Number(m[2]) / Number(m[3]));
  m = /^([-+]?)(\d+) (\d+)\/(\d+)$/.exec(t);
  if (m && Number(m[4])) return (m[1] === "-" ? -1 : 1) * (Number(m[2]) + Number(m[3]) / Number(m[4]));
  return null;
}

/** "3/4" → [3, 4] (numerator, denominator; no reducing). */
export function readFraction(x: unknown): [number, number] | null {
  if (typeof x === "number" && Number.isInteger(x) && x >= 0) return [x, 1];
  if (typeof x !== "string") return null;
  const m = /^\s*(\d+)\s*\/\s*(\d+)\s*$/.exec(x);
  if (m && Number(m[2]) > 0) return [Number(m[1]), Number(m[2])];
  if (/^\s*\d+\s*$/.test(x)) return [Number(x), 1];
  return null;
}

/** "2:45" → [2, 45] with the hour 1–12. */
export function readTime(x: unknown): [number, number] | null {
  if (typeof x !== "string") return null;
  const m = /^\s*(\d{1,2}):(\d{2})\s*$/.exec(x);
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 12 || min > 59) return null;
  return [h === 0 ? 12 : h, min];
}

const timeText = ([h, m]: [number, number] | number[]) => `${h}:${String(m).padStart(2, "0")}`;

/** A number for showing: "−3", "2.5", or with a denominator, "3/4", "1 1/4", "−1/2". */
export function numberText(v: number, den = 0): string {
  const sign = v < 0 ? MINUS : "";
  const a = Math.abs(v);
  if (!den || Number.isInteger(tidy(a))) return sign + String(tidy(a));
  const n = Math.round(a * den);
  const whole = Math.floor(n / den);
  const rest = n % den;
  return sign + (whole ? `${whole} ${rest}/${den}` : `${rest}/${den}`);
}

export function centsText(c: number): string {
  return c >= 100 ? `$${(c / 100).toFixed(2)}` : `${c}¢`;
}

// --- Reading specs -------------------------------------------------------------------

/** Fields each kind understands (besides kind, caption and readout). */
const KIND_KEYS: Record<ManipKind, (keyof ManipSpec)[]> = {
  counters: ["frames", "colors", "count", "count2"],
  blocks: ["places", "value"],
  numberline: ["min", "max", "step", "at", "hops"],
  fractions: ["bars", "fixed"],
  clock: ["time", "step"],
  coins: ["coins", "start"],
};
const TARGET_KEYS: Record<ManipKind, (keyof ManipTarget)[]> = {
  counters: ["count", "colors"],
  blocks: ["value", "fewest"],
  numberline: ["at"],
  fractions: ["values", "exact"],
  clock: ["time"],
  coins: ["cents", "fewest"],
};

const coinIndex = (name: unknown): number => {
  const t = String(name).trim().toLowerCase().replace(/s$/, "").replace(/pennie$/, "penny");
  return COINS.findIndex((c) => c.id === t || c.name === t || (c.id === "half" && t === "half-dollar") || (c.id === "dollar" && t === "dollar coin"));
};

/**
 * Read a spec from a course (JSON or a lesson block). Returns the cleaned spec (only fields
 * that apply, so it can be saved back), the model with defaults, and authoring problems.
 */
export function readSpec(raw: unknown): { spec: ManipSpec; model: Model; problems: string[] } {
  const problems: string[] = [];
  const r = (typeof raw === "object" && raw !== null && !Array.isArray(raw) ? raw : {}) as Record<string, unknown>;
  const kind = (MANIP_KINDS as string[]).includes(String(r.kind)) ? (r.kind as ManipKind) : null;
  if (!kind) problems.push(r.kind === undefined ? "no kind (counters, blocks, numberline, fractions, clock or coins)" : `unknown kind "${String(r.kind)}"`);
  const k: ManipKind = kind ?? "counters";
  const spec: ManipSpec = { kind: k };
  const allowed = new Set<string>(["kind", "caption", "readout", ...KIND_KEYS[k]]);
  for (const key of Object.keys(r)) if (!allowed.has(key) && kind) problems.push(`"${key}" doesn't apply to ${MANIP_NAMES[k].toLowerCase()}`);
  if (typeof r.caption === "string" && r.caption.trim()) spec.caption = r.caption.trim();
  if (r.readout !== undefined) {
    if (typeof r.readout === "boolean") spec.readout = r.readout;
    else problems.push("readout must be true or false");
  }
  const int = (key: keyof ManipSpec, lo: number, hi: number): number | undefined => {
    const v = r[key];
    if (v === undefined) return undefined;
    if (typeof v !== "number" || !Number.isInteger(v) || v < lo || v > hi) {
      problems.push(`${key} must be a whole number from ${lo} to ${hi}`);
      return undefined;
    }
    (spec as unknown as Record<string, unknown>)[key] = v;
    return v;
  };

  const m: Model = {
    kind: k,
    caption: spec.caption ?? "",
    readout: true,
    frames: 1,
    colors: 1,
    count: 0,
    count2: 0,
    places: 3,
    value: 0,
    min: 0,
    max: 10,
    step: 1,
    den: 0,
    at: 0,
    hops: [],
    bars: [[0, 1]],
    fixed: false,
    time: [12, 0],
    minuteStep: 5,
    coins: [0, 1, 2, 3],
    start: COINS.map(() => 0),
  };
  if (spec.readout !== undefined) m.readout = spec.readout;

  switch (k) {
    case "counters": {
      m.frames = int("frames", 1, 2) ?? 1;
      m.colors = int("colors", 1, 2) ?? 1;
      m.count = int("count", 0, 20) ?? 0;
      m.count2 = int("count2", 0, 20) ?? 0;
      if (m.count2 && m.colors < 2) problems.push("count2 needs colors: 2");
      if (m.count + m.count2 > m.frames * 10) problems.push(`${m.count + m.count2} counters don't fit in ${m.frames === 1 ? "one ten-frame" : "two ten-frames"}`);
      break;
    }
    case "blocks": {
      m.places = int("places", 1, 4) ?? 3;
      m.value = int("value", 0, 9999) ?? 0;
      if (blocksOf(m.value, m.places).some((n) => n > MAX_BLOCKS)) problems.push(`value ${m.value} needs too many blocks for ${m.places} place${m.places === 1 ? "" : "s"}`);
      break;
    }
    case "numberline": {
      const num = (key: "min" | "max" | "step" | "at"): number | undefined => {
        if (r[key] === undefined) return undefined;
        const v = readNumber(r[key]);
        if (v === null) problems.push(`${key} must be a number or a fraction like 3/4`);
        else (spec as unknown as Record<string, unknown>)[key] = r[key];
        return v ?? undefined;
      };
      const step = num("step");
      if (step !== undefined && step <= 0) problems.push("step must be more than 0");
      else if (step !== undefined) m.step = step;
      // A step written as a fraction ("1/4") labels the ticks as fractions.
      if (typeof r.step === "string" && r.step.includes("/") && readFraction(r.step)) m.den = readFraction(r.step)![1];
      m.min = num("min") ?? 0;
      m.max = num("max") ?? m.min + 10 * m.step;
      if (m.max <= m.min) {
        problems.push("max must be more than min");
        m.max = m.min + 10 * m.step;
      }
      if ((m.max - m.min) / m.step > MAX_TICKS) {
        problems.push(`too many ticks (${Math.round((m.max - m.min) / m.step)}); use a bigger step or a shorter line (at most ${MAX_TICKS})`);
        m.step = (m.max - m.min) / MAX_TICKS;
      }
      if (!onTick(m, m.max)) problems.push("max isn't on a tick (min plus a whole number of steps)");
      const at = num("at");
      m.at = at ?? (m.min <= 0 && m.max >= 0 && onTick(m, 0) ? 0 : m.min);
      if (at !== undefined && (at < m.min || at > m.max || !onTick(m, at))) problems.push(`at ${String(r.at)} isn't a tick on the line`);
      m.at = snap(m, m.at);
      if (r.hops !== undefined) {
        const hops = Array.isArray(r.hops) ? r.hops.map(readNumber) : [null];
        if (hops.some((h) => h === null || h <= 0) || !hops.length || hops.length > 4) problems.push("hops must be 1 to 4 sizes greater than 0");
        else {
          spec.hops = r.hops as (number | string)[];
          m.hops = hops as number[];
          if (m.hops.some((h) => !Number.isInteger(tidy(h / m.step)))) problems.push("each hop must be a whole number of steps");
        }
      }
      if (!m.hops.length) m.hops = [m.step];
      break;
    }
    case "fractions": {
      if (r.bars !== undefined) {
        const bars = Array.isArray(r.bars) ? r.bars.map(readFraction) : [null];
        if (!bars.length || bars.length > MAX_BARS || bars.some((b) => !b || b[1] > MAX_PARTS || b[0] > b[1]))
          problems.push(`bars must be 1 to ${MAX_BARS} fractions like 0/4 or 1/2 (at most ${MAX_PARTS} parts, no more shaded than parts)`);
        else {
          spec.bars = (r.bars as unknown[]).map(String);
          m.bars = bars as [number, number][];
        }
      }
      m.bars = m.bars.map(([n, d]) => [d, n]); // stored as [parts, shaded]
      if (r.fixed !== undefined) {
        if (typeof r.fixed === "boolean") m.fixed = spec.fixed = r.fixed;
        else problems.push("fixed must be true or false");
      }
      break;
    }
    case "clock": {
      if (r.time !== undefined) {
        const t = readTime(r.time);
        if (!t) problems.push(`time must look like 3:15 (not "${String(r.time)}")`);
        else {
          spec.time = String(r.time).trim();
          m.time = t;
        }
      }
      if (r.step !== undefined) {
        if (![1, 5, 15, 30, 60].includes(Number(r.step))) problems.push("a clock's step must be 1, 5, 15, 30 or 60 minutes");
        else spec.step = m.minuteStep = Number(r.step);
      }
      if (m.time[1] % m.minuteStep && m.minuteStep < 60) problems.push(`the starting time isn't on a ${m.minuteStep}-minute step`);
      break;
    }
    case "coins": {
      if (r.coins !== undefined) {
        const cs = Array.isArray(r.coins) ? r.coins.map(coinIndex) : [-1];
        if (!cs.length || cs.some((c) => c < 0)) problems.push("coins must list penny, nickel, dime, quarter, half or dollar");
        else {
          m.coins = [...new Set(cs)].sort((a, b) => a - b);
          spec.coins = m.coins.map((c) => COINS[c].id);
        }
      }
      if (r.start !== undefined) {
        const cs = Array.isArray(r.start) ? r.start.map(coinIndex) : [-1];
        if (cs.some((c) => c < 0)) problems.push("start must list coins (penny, nickel, dime, quarter, half, dollar)");
        else {
          spec.start = cs.map((c) => COINS[c].id);
          for (const c of cs) m.start[c]++;
          if (cs.some((c) => !m.coins.includes(c))) problems.push("start has a coin that isn't in coins");
          if (m.start.some((n) => n > MAX_COINS)) problems.push(`at most ${MAX_COINS} of one coin`);
        }
      }
      break;
    }
  }
  return { spec, model: m, problems };
}

/** The model for a spec (problems ignored). */
export const modelOf = (spec: unknown): Model => readSpec(spec).model;

// --- State -----------------------------------------------------------------------------

/** Blocks for a number in standard form, ones first; the top place takes any overflow. */
export function blocksOf(value: number, places: number): number[] {
  const out: number[] = [];
  let v = value;
  for (let i = 0; i < places; i++) {
    if (i === places - 1) out.push(v);
    else {
      out.push(v % 10);
      v = Math.floor(v / 10);
    }
  }
  return out;
}

const onTick = (m: Model, v: number) => Math.abs((v - m.min) / m.step - Math.round((v - m.min) / m.step)) < 1e-6;
export const snap = (m: Model, v: number) => tidy(Math.min(m.max, Math.max(m.min, m.min + Math.round((v - m.min) / m.step) * m.step)));

/**
 * The starting state. Its numbers mean:
 * counters: one entry per box (0 empty, 1 red, 2 yellow); blocks: counts, ones first;
 * numberline: [position]; fractions: [parts, shaded] per bar, one after another;
 * clock: [hour 1–12, minute]; coins: a count for each of COINS (penny … dollar).
 */
export function startState(m: Model): ManipState {
  switch (m.kind) {
    case "counters": {
      const cells = Array.from({ length: m.frames * 10 }, () => 0);
      for (let i = 0; i < m.count + m.count2 && i < cells.length; i++) cells[i] = i < m.count ? 1 : 2;
      return cells;
    }
    case "blocks":
      return blocksOf(m.value, m.places);
    case "numberline":
      return [m.at];
    case "fractions":
      return m.bars.flat();
    case "clock":
      return [...m.time];
    case "coins":
      return [...m.start];
  }
}

/** True when a saved state fits the model (an old save may not, after a course update). */
export function validState(m: Model, s: unknown): s is ManipState {
  if (!Array.isArray(s) || !s.every((x) => typeof x === "number" && Number.isFinite(x))) return false;
  const n = s as number[];
  const ints = n.every((x) => Number.isInteger(x) && x >= 0);
  switch (m.kind) {
    case "counters":
      return ints && n.length === m.frames * 10 && n.every((x) => x <= m.colors);
    case "blocks":
      return ints && n.length === m.places && n.every((x) => x <= MAX_BLOCKS);
    case "numberline":
      return n.length === 1 && n[0] >= m.min - 1e-9 && n[0] <= m.max + 1e-9;
    case "fractions":
      return ints && n.length === m.bars.length * 2 && m.bars.every((_, i) => n[2 * i] >= 1 && n[2 * i] <= MAX_PARTS && n[2 * i + 1] <= n[2 * i]);
    case "clock":
      return ints && n.length === 2 && n[0] >= 1 && n[0] <= 12 && n[1] <= 59;
    case "coins":
      return ints && n.length === COINS.length && n.every((x) => x <= MAX_COINS);
  }
}

/** The state to show: the saved one if it fits, else the start. */
export const stateOr = (m: Model, s: unknown): ManipState => (validState(m, s) ? s : startState(m));

// --- Moves (each returns a new state, unchanged when the move isn't possible) ---------------

export function counterAdd(m: Model, s: ManipState, color: number): ManipState {
  const i = s.indexOf(0);
  if (i < 0) return s;
  const out = s.slice();
  out[i] = Math.min(color, m.colors);
  return out;
}
export function counterRemove(s: ManipState, color: number): ManipState {
  const i = s.lastIndexOf(color);
  if (i < 0) return s;
  const out = s.slice();
  out[i] = 0;
  return out;
}
/** Tapping a box: empty → red → yellow (with two colors) → empty. */
export function counterToggle(m: Model, s: ManipState, cell: number): ManipState {
  const out = s.slice();
  out[cell] = (s[cell] + 1) % (m.colors + 1);
  return out;
}

export function blockAdd(s: ManipState, place: number, by: number): ManipState {
  const n = s[place] + by;
  if (n < 0 || n > MAX_BLOCKS) return s;
  const out = s.slice();
  out[place] = n;
  return out;
}
/** Break one block into ten of the next smaller place (a ten into ten ones). */
export function blockBreak(s: ManipState, place: number): ManipState {
  if (place < 1 || s[place] < 1 || s[place - 1] + 10 > MAX_BLOCKS) return s;
  const out = s.slice();
  out[place]--;
  out[place - 1] += 10;
  return out;
}
/** Trade ten blocks for one of the next bigger place (ten ones for a ten). */
export function blockTrade(s: ManipState, place: number): ManipState {
  if (place >= s.length - 1 || s[place] < 10 || s[place + 1] >= MAX_BLOCKS) return s;
  const out = s.slice();
  out[place] -= 10;
  out[place + 1]++;
  return out;
}
export const blocksValue = (s: ManipState) => s.reduce((sum, n, i) => sum + n * 10 ** i, 0);

export const lineMove = (m: Model, v: number): ManipState => [snap(m, v)];

export function fracParts(s: ManipState, bar: number, parts: number): ManipState {
  if (parts < 1 || parts > MAX_PARTS) return s;
  const out = s.slice();
  out[2 * bar] = parts;
  out[2 * bar + 1] = Math.min(out[2 * bar + 1], parts);
  return out;
}
/** Cut every part in two: the same amount stays shaded (1/2 becomes 2/4). */
export function fracSplit(s: ManipState, bar: number): ManipState {
  if (s[2 * bar] * 2 > MAX_PARTS) return s;
  const out = s.slice();
  out[2 * bar] *= 2;
  out[2 * bar + 1] *= 2;
  return out;
}
export function fracShade(s: ManipState, bar: number, shaded: number): ManipState {
  if (shaded < 0 || shaded > s[2 * bar]) return s;
  const out = s.slice();
  out[2 * bar + 1] = shaded;
  return out;
}

/** Turn the clock by some minutes (the hour hand moves along, as on a real clock). */
export function clockAdd(s: ManipState, minutes: number): ManipState {
  const total = (((s[0] % 12) * 60 + s[1] + minutes) % 720 + 720) % 720;
  const h = Math.floor(total / 60);
  return [h === 0 ? 12 : h, total % 60];
}

export function coinAdd(s: ManipState, coin: number, by: number): ManipState {
  const n = s[coin] + by;
  if (n < 0 || n > MAX_COINS) return s;
  const out = s.slice();
  out[coin] = n;
  return out;
}
export const coinsValue = (s: ManipState) => s.reduce((sum, n, i) => sum + n * COINS[i].cents, 0);
const coinCount = (s: ManipState) => s.reduce((a, b) => a + b, 0);

/** The target a state shows (the editors set the right answer by changing the model). */
export function targetFromState(m: Model, s: ManipState, opts: { fewest?: boolean; exact?: boolean; colors?: boolean } = {}): ManipTarget {
  switch (m.kind) {
    case "counters": {
      const red = s.filter((x) => x === 1).length;
      const yellow = s.filter((x) => x === 2).length;
      return opts.colors && m.colors === 2 ? { colors: [red, yellow] } : { count: red + yellow };
    }
    case "blocks":
      return { value: blocksValue(s), ...(opts.fewest ? { fewest: true } : {}) };
    case "numberline":
      return { at: m.den && !Number.isInteger(s[0]) ? `${Math.round(s[0] * m.den)}/${m.den}` : s[0] };
    case "fractions":
      return { values: m.bars.map((_, i) => `${s[2 * i + 1]}/${s[2 * i]}`), ...(opts.exact ? { exact: true } : {}) };
    case "clock":
      return { time: timeText(s) };
    case "coins":
      return { cents: coinsValue(s), ...(opts.fewest ? { fewest: true } : {}) };
  }
}

/** The fewest coins (from those offered) that make an amount, as counts; null if none do. */
export function fewestCoins(offered: number[], cents: number): ManipState | null {
  const best: (number[] | null)[] = Array.from({ length: cents + 1 }, () => null);
  best[0] = COINS.map(() => 0);
  for (let c = 1; c <= cents; c++)
    for (const i of offered) {
      const prev = c >= COINS[i].cents ? best[c - COINS[i].cents] : null;
      if (prev && prev[i] < MAX_COINS && (!best[c] || coinCount(prev) + 1 < coinCount(best[c]!))) {
        best[c] = prev.slice();
        best[c]![i]++;
      }
    }
  return best[cents];
}

// --- Checking ------------------------------------------------------------------------

/** Problems with a question's target for its model (empty = fine). */
export function targetProblems(m: Model, raw: unknown): string[] {
  const t = (typeof raw === "object" && raw !== null && !Array.isArray(raw) ? raw : null) as Record<string, unknown> | null;
  if (!t) return ['needs a "target" saying what the right answer is'];
  const out: string[] = [];
  for (const key of Object.keys(t)) if (!(TARGET_KEYS[m.kind] as string[]).includes(key)) out.push(`target "${key}" doesn't apply to ${MANIP_NAMES[m.kind].toLowerCase()}`);
  const isInt = (v: unknown) => typeof v === "number" && Number.isInteger(v) && v >= 0;
  switch (m.kind) {
    case "counters":
      if (t.colors !== undefined) {
        if (m.colors < 2) out.push("target colors needs a model with colors: 2");
        if (!Array.isArray(t.colors) || t.colors.length !== 2 || !t.colors.every(isInt)) out.push("target colors must be [red, yellow] counts");
      } else if (!isInt(t.count)) out.push("target needs count (how many counters)");
      break;
    case "blocks":
      if (!isInt(t.value)) out.push("target needs value (the number to show)");
      break;
    case "numberline":
      if (readNumber(t.at) === null) out.push("target needs at (where the marker must end up)");
      else {
        const at = readNumber(t.at)!;
        if (at < m.min - 1e-9 || at > m.max + 1e-9 || !onTick(m, at)) out.push(`target at ${String(t.at)} isn't a tick on the line`);
      }
      break;
    case "fractions": {
      const vs = Array.isArray(t.values) ? t.values.map(readFraction) : [];
      if (!vs.length || vs.some((v) => !v || v[0] > v[1]) || vs.length > m.bars.length) out.push(`target values must be fractions like "3/4", at most one per bar (${m.bars.length})`);
      else if (m.fixed)
        vs.forEach((v, i) => {
          const parts = m.bars[i][0];
          if (t.exact ? v![1] !== parts : (v![0] * parts) % v![1] !== 0) out.push(`bar ${i + 1} has ${parts} parts, which can't show ${v![0]}/${v![1]}${t.exact ? " exactly" : ""}`);
        });
      else vs.forEach((v, i) => v![1] > MAX_PARTS && out.push(`bar ${i + 1}: at most ${MAX_PARTS} parts`));
      break;
    }
    case "clock": {
      const tm = readTime(t.time);
      if (!tm) out.push('target needs time, like "2:45"');
      else if (tm[1] % m.minuteStep) out.push(`target time ${t.time} isn't on a ${m.minuteStep}-minute step (set the model's step)`);
      break;
    }
    case "coins":
      if (!isInt(t.cents) || (t.cents as number) < 1) out.push("target needs cents (the amount, in cents)");
      else if (!fewestCoins(m.coins, t.cents as number)) out.push(`${t.cents}¢ can't be made with ${m.coins.map((c) => COINS[c].plural).join(", ")}`);
      break;
  }
  if (t.fewest !== undefined && typeof t.fewest !== "boolean") out.push("target fewest must be true or false");
  if (t.exact !== undefined && typeof t.exact !== "boolean") out.push("target exact must be true or false");
  if (out.length) return out;
  const target = t as ManipTarget;
  const sol = solution(m, target);
  if (!sol || !manipCorrect(m, target, sol)) out.push("the model can't show this answer");
  else if (manipCorrect(m, target, startState(m))) out.push("the model already shows the answer at the start");
  return out;
}

/** A correct state for a target (for review screens and the checker); null if none. */
export function solution(m: Model, t: ManipTarget): ManipState | null {
  switch (m.kind) {
    case "counters": {
      const [a, b] = t.colors ?? [t.count ?? 0, 0];
      if (a + b > m.frames * 10) return null;
      return Array.from({ length: m.frames * 10 }, (_, i) => (i < a ? 1 : i < a + b ? 2 : 0));
    }
    case "blocks": {
      const s = blocksOf(t.value ?? 0, m.places);
      return s.every((n) => n <= MAX_BLOCKS) ? s : null;
    }
    case "numberline": {
      const at = readNumber(t.at);
      return at === null ? null : [snap(m, at)];
    }
    case "fractions": {
      const s = m.bars.flat();
      for (const [i, v] of (t.values ?? []).map(readFraction).entries()) {
        if (!v) return null;
        const parts = m.fixed ? m.bars[i][0] : v[1];
        if ((v[0] * parts) % v[1]) return null;
        s[2 * i] = parts;
        s[2 * i + 1] = (v[0] * parts) / v[1];
      }
      return s;
    }
    case "clock":
      return readTime(t.time);
    case "coins":
      return fewestCoins(m.coins, t.cents ?? 0);
  }
}

export function manipCorrect(m: Model, t: ManipTarget, raw: unknown): boolean {
  if (!validState(m, raw)) return false;
  const s = raw;
  switch (m.kind) {
    case "counters": {
      const red = s.filter((x) => x === 1).length;
      const yellow = s.filter((x) => x === 2).length;
      return t.colors ? red === t.colors[0] && yellow === t.colors[1] : red + yellow === t.count;
    }
    case "blocks":
      return blocksValue(s) === t.value && (!t.fewest || s.slice(0, -1).every((n) => n < 10));
    case "numberline": {
      const at = readNumber(t.at);
      return at !== null && Math.abs(s[0] - at) < 1e-6;
    }
    case "fractions":
      return (t.values ?? []).every((v, i) => {
        const f = readFraction(v);
        if (!f) return false;
        const [parts, shaded] = [s[2 * i], s[2 * i + 1]];
        return t.exact ? parts === f[1] && shaded === f[0] : shaded * f[1] === f[0] * parts;
      });
    case "clock": {
      const tm = readTime(t.time);
      return !!tm && s[0] === tm[0] && s[1] === tm[1];
    }
    case "coins":
      return coinsValue(s) === t.cents && (!t.fewest || coinCount(s) === coinCount(fewestCoins(m.coins, t.cents!) ?? []));
  }
}

// --- Words -----------------------------------------------------------------------------

const fracText = (shaded: number, parts: number) => `${shaded}/${parts}`;

function compareWords(a: [number, number], b: [number, number]): string {
  const x = a[1] * b[0];
  const y = b[1] * a[0];
  const rel = x === y ? "is equal to" : x > y ? "is greater than" : "is less than";
  return `${fracText(a[1], a[0])} ${rel} ${fracText(b[1], b[0])}`;
}

/** Where the clock's hands point, in words (for when the time itself isn't shown). */
function handsText(h: number, min: number): string {
  const next = (h % 12) + 1;
  const hour = min === 0 ? `the hour hand points at ${h}` : `the hour hand is between ${h} and ${next}`;
  const mark = Math.floor(min / 5) || 12;
  const extra = min % 5;
  const minute = extra === 0 ? `the minute hand points at ${mark}` : `the minute hand is ${plural(extra, "mark", "marks")} past ${mark}`;
  return `${hour}; ${minute}`;
}

/** The state in words, for screen readers and review screens: "3 hundreds, 4 tens, 7 ones: 347". */
export function describe(m: Model, raw: ManipState, withTotal = m.readout): string {
  const s = stateOr(m, raw);
  switch (m.kind) {
    case "counters": {
      const red = s.filter((x) => x === 1).length;
      const yellow = s.filter((x) => x === 2).length;
      const total = red + yellow;
      if (m.colors === 1) return plural(total, "counter", "counters");
      return `${red} red and ${yellow} yellow${withTotal ? `: ${plural(total, "counter", "counters")} in all` : ""}`;
    }
    case "blocks": {
      const parts = s
        .map((n, i) => plural(n, PLACES[i].name, PLACES[i].plural))
        .reverse()
        .join(", ");
      return withTotal ? `${parts}: ${blocksValue(s)}` : parts;
    }
    case "numberline":
      return `The marker is at ${numberText(s[0], m.den)}`;
    case "fractions": {
      const bars = m.bars.map((_, i) => {
        const [p, sh] = [s[2 * i], s[2 * i + 1]];
        const what = `${sh} of ${plural(p, "part", "parts")} shaded`;
        return `${m.bars.length > 1 ? `Bar ${i + 1}: ` : ""}${what}${withTotal ? ` (${fracText(sh, p)})` : ""}`;
      });
      if (withTotal && m.bars.length === 2) bars.push(compareWords([s[0], s[1]], [s[2], s[3]]));
      return bars.join(". ");
    }
    case "clock":
      return withTotal ? `The clock shows ${timeText(s)}` : `On the clock, ${handsText(s[0], s[1])}`;
    case "coins": {
      const list = s
        .map((n, i) => (n ? plural(n, COINS[i].name, COINS[i].plural) : ""))
        .filter(Boolean)
        .reverse();
      const words = list.length ? list.join(", ") : "No coins";
      return withTotal ? `${words}: ${centsText(coinsValue(s))}` : words;
    }
  }
}

/** The short total shown beside the model ("347", "68¢", "2:45"). */
export function readoutText(m: Model, s: ManipState): string {
  switch (m.kind) {
    case "counters": {
      const red = s.filter((x) => x === 1).length;
      const yellow = s.filter((x) => x === 2).length;
      return m.colors === 2 ? `${red} + ${yellow} = ${red + yellow}` : String(red + yellow);
    }
    case "blocks":
      return String(blocksValue(s));
    case "numberline":
      return numberText(s[0], m.den);
    case "fractions":
      return m.bars.length === 2
        ? `${fracText(s[1], s[0])} ${s[0] * s[3] === s[2] * s[1] ? "=" : s[1] * s[2] > s[3] * s[0] ? ">" : "<"} ${fracText(s[3], s[2])}`
        : m.bars.map((_, i) => fracText(s[2 * i + 1], s[2 * i])).join(", ");
    case "clock":
      return timeText(s);
    case "coins":
      return centsText(coinsValue(s));
  }
}

/** The right answer in words ("347 with the fewest blocks", "68¢ with the fewest coins"). */
export function targetText(m: Model, t: ManipTarget): string {
  switch (m.kind) {
    case "counters":
      return t.colors ? `${t.colors[0]} red and ${t.colors[1]} yellow counters` : plural(t.count ?? 0, "counter", "counters");
    case "blocks": {
      const sol = solution(m, t);
      return `${t.value}${t.fewest ? " with no place over 9" : ""}${sol ? ` (for example ${describe(m, sol, false)})` : ""}`;
    }
    case "numberline":
      return `The marker at ${numberText(readNumber(t.at) ?? 0, m.den)}`;
    case "fractions":
      return (t.values ?? []).map((v, i) => `${m.bars.length > 1 ? `bar ${i + 1}: ` : ""}${v}${t.exact ? "" : " (or an equal fraction)"}`).join("; ");
    case "clock":
      return t.time ?? "";
    case "coins": {
      const sol = solution(m, t);
      return `${centsText(t.cents ?? 0)}${t.fewest ? " with the fewest coins" : ""}${sol ? ` (for example ${describe(m, sol, false)})` : ""}`;
    }
  }
}

/** What a model question asks the learner to do. */
export function actionLabel(kind: ManipKind): string {
  return {
    counters: "Use the counters",
    blocks: "Build it with blocks",
    numberline: "Move on the number line",
    fractions: "Shade the fraction bars",
    clock: "Set the clock",
    coins: "Make the amount with coins",
  }[kind];
}

// --- Lesson blocks -------------------------------------------------------------------

/** A whole ```manipulative block at the start of a line; group 1 is the info string, 2 the body. */
export const MANIP_BLOCK = /^```manipulative\b([^\n]*)\r?\n([\s\S]*?)^```[ \t]*$/gm;

const LIST_KEYS = new Set(["hops", "bars", "coins", "start"]);
const BOOL_KEYS = new Set(["readout", "fixed"]);
const NUM_KEYS = new Set(["frames", "colors", "count", "count2", "places", "value"]);

/**
 * A lesson block: the info string names the kind (```manipulative clock), and each body line is
 * `key: value` (lists split on commas or spaces). A body starting with { is read as JSON.
 */
export function parseManipBlock(info: string, body: string): { spec: ManipSpec; model: Model; problems: string[] } {
  const problems: string[] = [];
  const raw: Record<string, unknown> = {};
  const words = info.trim().split(/\s+/).filter(Boolean);
  if (words[0]) raw.kind = words[0];
  if (words.length > 1) problems.push(`unexpected "${words.slice(1).join(" ")}" after the kind`);
  const text = body.trim();
  if (text.startsWith("{")) {
    try {
      Object.assign(raw, JSON.parse(text));
    } catch (e) {
      problems.push(`JSON error: ${(e as Error).message}`);
    }
  } else
    for (const line of body.replace(/\r\n?/g, "\n").split("\n")) {
      if (!line.trim()) continue;
      const m = /^\s*([A-Za-z][A-Za-z0-9]*)\s*:\s*(.*)$/.exec(line);
      if (!m) {
        problems.push(`can't read "${line.trim().slice(0, 40)}" (write key: value)`);
        continue;
      }
      const [, key, val] = m;
      const v = val.trim();
      if (key in raw) problems.push(`${key} is given twice`);
      if (LIST_KEYS.has(key)) raw[key] = v.split(/[\s,]+/).filter(Boolean).map((x) => (key === "hops" && /^[\d.]+$/.test(x) ? Number(x) : x));
      else if (BOOL_KEYS.has(key)) raw[key] = /^(true|yes|on)$/i.test(v) ? true : /^(false|no|off)$/i.test(v) ? false : v;
      else if (NUM_KEYS.has(key) && /^-?\d+$/.test(v)) raw[key] = Number(v);
      else if ((key === "min" || key === "max" || key === "at" || key === "step") && /^-?[\d.]+$/.test(v)) raw[key] = Number(v);
      else raw[key] = v;
    }
  const r = readSpec(raw);
  return { ...r, problems: [...problems, ...r.problems] };
}

/** Authoring problems for every manipulative block in a Markdown text. */
export function manipProblems(md: string): string[] {
  const found = [...md.matchAll(MANIP_BLOCK)];
  const out = found.flatMap((m, i) => parseManipBlock(m[1], m[2]).problems.map((p) => `manipulative ${i + 1}: ${p}`));
  if ((md.match(/^```manipulative\b/gm) ?? []).length > found.length) out.push("a ```manipulative block is never closed with ```");
  return out;
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/**
 * The block's HTML: the picture of the starting state with its description (complete without
 * JavaScript), in a box carrying the spec, where the Markdown component mounts the controls.
 */
export function renderManipBlock(spec: ManipSpec, model: Model): string {
  const s = startState(model);
  return (
    `<figure class="manip" data-manip="${esc(JSON.stringify(spec))}">` +
    (model.caption ? `<figcaption class="manip-caption">${esc(model.caption)}</figcaption>` : "") +
    `<div class="manip-static">${drawModel(model, s)}<p class="manip-desc">${esc(describe(model, s))}</p></div>` +
    `</figure>`
  );
}

/** Swap manipulative blocks for placeholders before Markdown runs; `restore` puts them back. */
export function protectManipulatives(src: string): { text: string; restore: (html: string) => string } {
  if (!src.includes("```manipulative")) return { text: src, restore: (h) => h };
  const out: string[] = [];
  const text = src.replace(MANIP_BLOCK, (_whole, info: string, body: string) => {
    const r = parseManipBlock(info, body);
    out.push(renderManipBlock(r.spec, r.model));
    return `\n\nXMANIPX${out.length - 1}XMANIPX\n\n`;
  });
  return {
    text,
    restore: (html) => html.replace(/<p>XMANIPX(\d+)XMANIPX<\/p>/g, (_m, n) => out[Number(n)]).replace(/XMANIPX(\d+)XMANIPX/g, (_m, n) => out[Number(n)]),
  };
}

// --- Pictures (SVG strings; colors come from CSS classes so every theme works) ----------------

const svg = (w: number, h: number, body: string, cls = "") =>
  `<svg class="mp-svg${cls ? ` ${cls}` : ""}" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" aria-hidden="true" focusable="false">${body}</svg>`;

/** Ten-frames: 2 rows of 5 boxes each; red counters are plain, yellow ones have a ring (not color alone). */
export function drawCounters(m: Model, s: ManipState): string {
  const c = 44;
  const gap = 10;
  let body = "";
  for (let f = 0; f < m.frames; f++) {
    const y0 = f * (2 * c + gap) + 2;
    body += `<rect class="mp-frame" x="2" y="${y0}" width="${5 * c}" height="${2 * c}" rx="4"/>`;
    for (let i = 0; i < 10; i++) {
      const cell = f * 10 + i;
      const x = 2 + (i % 5) * c;
      const y = y0 + Math.floor(i / 5) * c;
      body += `<rect class="mp-cell" data-cell="${cell}" x="${x}" y="${y}" width="${c}" height="${c}"/>`;
      if (s[cell])
        body +=
          `<circle class="mp-counter mp-c${s[cell]}" data-cell="${cell}" cx="${x + c / 2}" cy="${y + c / 2}" r="${c / 2 - 6}"/>` +
          (s[cell] === 2 ? `<circle class="mp-counter-ring" cx="${x + c / 2}" cy="${y + c / 2}" r="${c / 4 - 3}"/>` : "");
    }
  }
  return svg(5 * c + 4, m.frames * 2 * c + (m.frames - 1) * gap + 4, body, "mp-counters");
}

/** One place's blocks (ones as small cubes, tens as rods, hundreds as flats, thousands as cubes). */
export function drawPlace(place: number, n: number): string {
  const W = 104;
  let body = "";
  let h = 0;
  if (place === 0) {
    // Ones in rows of five, so a group of five is easy to see.
    const u = 16;
    for (let i = 0; i < n; i++) {
      const x = 2 + (i % 5) * (u + 4);
      const y = 2 + Math.floor(i / 5) * (u + 4);
      body += `<rect class="mp-block mp-unit" x="${x}" y="${y}" width="${u}" height="${u}" rx="2"/>`;
      h = y + u + 2;
    }
  } else if (place === 1) {
    const rw = 8;
    const rh = 100;
    for (let i = 0; i < n; i++) {
      const x = 2 + (i % 10) * (rw + 2);
      const y = 2 + Math.floor(i / 10) * (rh + 6);
      body += `<rect class="mp-block mp-rod" x="${x}" y="${y}" width="${rw}" height="${rh}" rx="1"/>`;
      for (let k = 1; k < 10; k++) body += `<line class="mp-grid" x1="${x}" x2="${x + rw}" y1="${y + k * 10}" y2="${y + k * 10}"/>`;
      h = y + rh + 2;
    }
  } else if (place === 2) {
    const f = 48;
    for (let i = 0; i < n; i++) {
      const x = 2 + (i % 2) * (f + 4);
      const y = 2 + Math.floor(i / 2) * (f + 4);
      body += `<rect class="mp-block mp-flat" x="${x}" y="${y}" width="${f}" height="${f}" rx="1"/>`;
      for (let k = 1; k < 10; k++) {
        const d = (k * f) / 10;
        body += `<line class="mp-grid" x1="${x + d}" x2="${x + d}" y1="${y}" y2="${y + f}"/><line class="mp-grid" x1="${x}" x2="${x + f}" y1="${y + d}" y2="${y + d}"/>`;
      }
      h = y + f + 2;
    }
  } else {
    const f = 36;
    const o = 12;
    for (let i = 0; i < n; i++) {
      const x = 2 + (i % 2) * (f + o + 4);
      const y = 2 + o + Math.floor(i / 2) * (f + o + 4);
      body +=
        `<path class="mp-block mp-cube-top" d="M${x} ${y} l${o} ${-o} h${f} l${-o} ${o} z"/>` +
        `<path class="mp-block mp-cube-side" d="M${x + f} ${y} l${o} ${-o} v${f} l${-o} ${o} z"/>` +
        `<rect class="mp-block mp-cube" x="${x}" y="${y}" width="${f}" height="${f}"/>`;
      for (let k = 1; k < 10; k++) {
        const d = (k * f) / 10;
        body += `<line class="mp-grid" x1="${x + d}" x2="${x + d}" y1="${y}" y2="${y + f}"/><line class="mp-grid" x1="${x}" x2="${x + f}" y1="${y + d}" y2="${y + d}"/>`;
      }
      h = y + f + 2;
    }
  }
  return svg(W, Math.max(h, 4), body, "mp-place");
}

/** All places side by side, biggest first (the static lesson picture). */
export function drawBlocks(_m: Model, s: ManipState): string {
  return `<div class="mp-places">${s
    .map((n, i) => `<div class="mp-place-col"><span class="mp-place-name">${PLACES[i].plural}: <b>${n}</b></span>${drawPlace(i, n)}</div>`)
    .reverse()
    .join("")}</div>`;
}

/** A number line `width` pixels wide; `trail` lists earlier positions, drawn as hops. */
export function drawNumberline(m: Model, s: ManipState, width = 560, trail: number[] = []): string {
  const pad = 22;
  const ticks = Math.round((m.max - m.min) / m.step);
  const x = (v: number) => pad + ((v - m.min) / (m.max - m.min)) * (width - 2 * pad);
  const y = 72;
  const sample = numberText(m.max, m.den).length > numberText(m.min, m.den).length ? numberText(m.max, m.den) : numberText(m.min, m.den);
  const labelW = Math.max(18, sample.length * 8 + 8);
  const room = (width - 2 * pad) / Math.max(1, ticks);
  const every = [1, 2, 5, 10, 20, 25, 50].find((k) => k * room >= labelW) ?? Math.ceil(labelW / room);
  // Labels count from 0 when 0 is on the line (−10, −5, 0, 5, 10), else from the left end.
  const origin = m.min <= 0 && m.max >= 0 && onTick(m, 0) ? Math.round(-m.min / m.step) : 0;
  const labelled = (i: number) => (((i - origin) % every) + every) % every === 0;
  let body = `<line class="mp-axis" x1="${pad - 14}" x2="${width - pad + 14}" y1="${y}" y2="${y}"/>`;
  body += `<path class="mp-arrowhead" d="M${pad - 16} ${y} l8 -5 v10 z"/><path class="mp-arrowhead" d="M${width - pad + 16} ${y} l-8 -5 v10 z"/>`;
  for (let i = 0; i <= ticks; i++) {
    const v = tidy(m.min + i * m.step);
    const big = labelled(i);
    body += `<line class="mp-tick${big ? " is-major" : ""}" data-v="${v}" x1="${x(v)}" x2="${x(v)}" y1="${y - (big ? 8 : 5)}" y2="${y + (big ? 8 : 5)}"/>`;
    if (big) body += `<text class="mp-label" x="${x(v)}" y="${y + 26}" text-anchor="middle">${esc(numberText(v, m.den))}</text>`;
  }
  // Hops: arcs from each earlier position to the next, newest last.
  const path = [...trail, s[0]];
  for (let i = 1; i < path.length; i++) {
    const [a, b] = [x(path[i - 1]), x(path[i])];
    if (Math.abs(a - b) < 1) continue;
    const top = Math.max(16, y - 14 - Math.min(40, Math.abs(b - a) / 2));
    const d = path[i] - path[i - 1];
    body += `<path class="mp-hop" d="M${a} ${y - 6} Q${(a + b) / 2} ${top - 14} ${b} ${y - 6}"/>`;
    body += `<text class="mp-hop-label" x="${(a + b) / 2}" y="${top - 4}" text-anchor="middle">${d > 0 ? "+" : MINUS}${esc(numberText(Math.abs(d), m.den))}</text>`;
  }
  const px = x(s[0]);
  body += `<path class="mp-token" d="M${px} ${y - 4} l-9 -14 a10 10 0 1 1 18 0 z"/>`;
  return svg(width, 108, body, "mp-line");
}

/** Fraction bars stacked, all the same length so they can be compared. */
export function drawFractions(m: Model, s: ManipState, width = 560): string {
  const pad = 2;
  const h = 44;
  const gap = 14;
  const w = width - 2 * pad;
  let body = "";
  m.bars.forEach((_, b) => {
    const [parts, shaded] = [s[2 * b], s[2 * b + 1]];
    const y = pad + b * (h + gap);
    for (let i = 0; i < parts; i++) {
      const x = pad + (i * w) / parts;
      const pw = w / parts;
      body += `<rect class="mp-part${i < shaded ? " is-shaded" : ""}" data-bar="${b}" data-part="${i}" x="${x}" y="${y}" width="${pw}" height="${h}"/>`;
      if (pw >= 30) body += `<text class="mp-part-label${i < shaded ? " is-shaded" : ""}" x="${x + pw / 2}" y="${y + h / 2 + 5}" text-anchor="middle">1/${parts}</text>`;
    }
    body += `<rect class="mp-bar-outline" x="${pad}" y="${y}" width="${w}" height="${h}"/>`;
  });
  return svg(width, m.bars.length * (h + gap) - gap + 2 * pad, body, "mp-fractions");
}

/** An analog clock face; the hour hand sits between numbers as the minutes go by. */
export function drawClock(_m: Model, s: ManipState): string {
  const c = 110;
  const r = 100;
  const pt = (deg: number, len: number) => [c + len * Math.sin((deg * Math.PI) / 180), c - len * Math.cos((deg * Math.PI) / 180)].map((v) => Math.round(v * 100) / 100);
  let body = `<circle class="mp-face" cx="${c}" cy="${c}" r="${r}"/>`;
  for (let i = 0; i < 60; i++) {
    const big = i % 5 === 0;
    const [x1, y1] = pt(i * 6, r - (big ? 12 : 6));
    const [x2, y2] = pt(i * 6, r - 2);
    body += `<line class="mp-mark${big ? " is-hour" : ""}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
  }
  for (let n = 1; n <= 12; n++) {
    const [x, y] = pt(n * 30, r - 27);
    body += `<text class="mp-num" x="${x}" y="${y + 7}" text-anchor="middle">${n}</text>`;
  }
  const [h, min] = s;
  const [hx, hy] = pt(((h % 12) + min / 60) * 30, 52);
  const [mx, my] = pt(min * 6, 80);
  body += `<line class="mp-hand mp-hand-h" data-hand="h" x1="${c}" y1="${c}" x2="${hx}" y2="${hy}"/>`;
  body += `<line class="mp-hand mp-hand-m" data-hand="m" x1="${c}" y1="${c}" x2="${mx}" y2="${my}"/>`;
  body += `<circle class="mp-hub" cx="${c}" cy="${c}" r="6"/>`;
  return svg(2 * c, 2 * c, body, "mp-clock");
}

/** One coin drawn at (cx, cy) with diameter d: a plain labeled circle. */
function coinShape(i: number, cx: number, cy: number, d: number): string {
  const coin = COINS[i];
  const fs = Math.min(13, Math.round(d * 0.32));
  return (
    `<circle class="mp-coin mp-${coin.metal}" cx="${cx}" cy="${cy}" r="${d / 2}"/>` +
    `<circle class="mp-coin-rim" cx="${cx}" cy="${cy}" r="${d / 2 - 3}"/>` +
    `<text class="mp-coin-label" x="${cx}" y="${cy + fs * 0.36}" font-size="${fs}" text-anchor="middle">${coin.label}</text>`
  );
}

/** One coin on its own (sizes follow the real coins). */
export function coinSvg(i: number, scale = 2): string {
  const d = COINS[i].mm * scale;
  const size = Math.ceil(d + 4);
  return svg(size, size, coinShape(i, size / 2, size / 2, d), "mp-coin-svg");
}

/** The coins on the mat, biggest value first, wrapped to `width`; each row centered on one line. */
export function drawCoins(_m: Model, s: ManipState, width = 560): string {
  const scale = 2;
  const gap = 6;
  const rowH = Math.max(0, ...s.map((n, i) => (n ? COINS[i].mm * scale : 0)));
  let x = 4;
  let y = 4;
  let body = "";
  for (let i = COINS.length - 1; i >= 0; i--)
    for (let k = 0; k < s[i]; k++) {
      const d = COINS[i].mm * scale;
      if (x + d > width - 4) {
        x = 4;
        y += rowH + gap;
      }
      body += `<g class="mp-placed" data-coin="${i}">${coinShape(i, x + d / 2, y + rowH / 2, d)}</g>`;
      x += d + gap;
    }
  if (!body) body = `<text class="mp-empty" x="${width / 2}" y="34" text-anchor="middle">No coins yet</text>`;
  return svg(width, Math.max(56, y + rowH + 4), body, "mp-mat");
}

/** The picture for any model (lessons' static view, review screens). */
export function drawModel(m: Model, s: ManipState, width = 560): string {
  switch (m.kind) {
    case "counters":
      return drawCounters(m, s);
    case "blocks":
      return drawBlocks(m, s);
    case "numberline":
      return drawNumberline(m, s, width);
    case "fractions":
      return drawFractions(m, s, width);
    case "clock":
      return drawClock(m, s);
    case "coins":
      return drawCoins(m, s, width);
  }
}

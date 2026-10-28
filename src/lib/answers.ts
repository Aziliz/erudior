// Answer boxes for math drills: what's correct, how to read what was typed, and how
// to check it. Numbers can be typed as math (3/4, sqrt(3)/2, 2pi, 6.02e23), with units
// where the drill allows them; fractions can be required exactly; expressions like
// 6x^2 - 2 are checked by plugging in values.

import type { AnswerPart, Drill, NumFormat } from "./exerciseTypes";
import { collectVars, evalNode, parse, simplify, substitute, toTex, type Node, type UserFn } from "./expr";

export interface PartInstance {
  spec: AnswerPart;
  /** Number kinds: the correct value (in the first unit when units are given). */
  target?: number;
  /** Expression kind: the correct expression with this problem's values filled in. */
  expr?: Node;
  /** Scope for evaluating the correct expression (drill values). */
  scope: Record<string, number>;
  funcs: Record<string, UserFn>;
  /** The correct answer, ready to show (may contain $math$). */
  display: string;
  /** Number kinds: the shown answer as a number (it may be rounded more than the tolerance), so typing exactly what's shown is always accepted. */
  shownValue?: number;
}

export interface PartResult {
  ok: boolean;
  /** What the person typed, tidied for the results table. */
  shown: string;
}

const THOUSANDS = /(\d),(?=\d{3}(?!\d))/g;

export function defaultTolerance(fmt: NumFormat | undefined): number {
  switch (fmt) {
    case "money":
      return 0.01;
    case "money0":
      return 1;
    case "integer":
      return 0;
    default:
      return 0.01;
  }
}

/** The answer boxes for a drill: its `answers` list, or the classic single answer. */
export function partSpecs(drill: Drill): AnswerPart[] {
  if (drill.answers?.length) return drill.answers;
  return [{ name: drill.answer, format: drill.format, tolerance: drill.tolerance }];
}

// --- Fractions ---------------------------------------------------------------

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a;
}

/** Best fraction for a decimal, e.g. 0.75 -> [3, 4]. */
export function toFraction(x: number, maxDen = 10000): [number, number] {
  if (Number.isInteger(x)) return [x, 1];
  let [h0, h1, k0, k1] = [0, 1, 1, 0];
  let v = x;
  for (let i = 0; i < 40; i++) {
    const a = Math.floor(v);
    [h0, h1] = [h1, a * h1 + h0];
    [k0, k1] = [k1, a * k1 + k0];
    if (k1 > maxDen) {
      [h1, k1] = [h0, k0];
      break;
    }
    if (Math.abs(x - h1 / k1) < 1e-12) break;
    v = 1 / (v - a);
  }
  const g = gcd(h1, k1) || 1;
  return k1 < 0 ? [-h1 / g, -k1 / g] : [h1 / g, k1 / g];
}

export function fractionText(x: number): string {
  const [n, d] = toFraction(x);
  return d === 1 ? String(n) : `${n}/${d}`;
}

export function fractionTex(x: number): string {
  const [n, d] = toFraction(x);
  if (d === 1) return String(n);
  return `${n < 0 ? "-" : ""}\\frac{${Math.abs(n)}}{${d}}`;
}

/** Read "7/4", "-3", or a mixed number "1 3/4". Null if it isn't in that form. */
function readFraction(text: string): { value: number; lowest: boolean } | null {
  const t = text.trim();
  let m = /^(-?)(\d+)\s+(\d+)\/(\d+)$/.exec(t);
  if (m) {
    const [whole, n, d] = [Number(m[2]), Number(m[3]), Number(m[4])];
    if (!d) return null;
    const v = whole + n / d;
    return { value: m[1] ? -v : v, lowest: gcd(n, d) === 1 && n < d };
  }
  m = /^(-?)(\d+)(?:\/(\d+))?$/.exec(t);
  if (!m) return null;
  const n = Number(m[2]);
  const d = m[3] ? Number(m[3]) : 1;
  if (!d) return null;
  return { value: (m[1] ? -1 : 1) * (n / d), lowest: gcd(n, d) === 1 };
}

// --- Number formats ------------------------------------------------------------

export function sciText(x: number, digits = 3): string {
  if (x === 0) return "0";
  const [m, e] = x.toExponential(digits - 1).split("e");
  return `${Number(m)} × 10^${Number(e)}`;
}

export function sciTex(x: number, digits = 3): string {
  if (x === 0) return "0";
  const [m, e] = x.toExponential(digits - 1).split("e");
  return `${Number(m)} \\times 10^{${Number(e)}}`;
}

// --- Building and checking ---------------------------------------------------

/** Resolve a drill's answer boxes for one generated problem. */
export function resolveParts(
  drill: Drill,
  values: Record<string, number | string>,
  funcs: Record<string, UserFn>,
  show: (text: string) => string,
  format: (v: number, fmt?: string) => string,
): PartInstance[] {
  const scope = Object.fromEntries(Object.entries(values).filter(([, v]) => typeof v === "number")) as Record<
    string,
    number
  >;
  return partSpecs(drill).map((spec, i) => {
    const kind = spec.kind ?? "number";
    const unit = spec.units ? Object.keys(spec.units)[0] : "";
    if (kind === "expression") {
      if (!spec.expression) throw new Error(`${drill.title}: answer ${i + 1} needs an "expression"`);
      const vars = spec.variables ?? ["x"];
      let node: Node;
      try {
        node = parse(spec.expression, { funcNames: Object.keys(funcs) });
      } catch (e) {
        throw new Error(`${drill.title}: answer expression "${spec.expression}": ${(e as Error).message}`);
      }
      // Plug this problem's numbers in (but never the answer's own variables).
      const fixed = Object.fromEntries(Object.entries(scope).filter(([k]) => !vars.includes(k)));
      const expr = substitute(node, fixed);
      const usesHigher = /\b(deriv|integ|solve|limit|extremum|sum|prod)\s*\(/.test(spec.expression) || Object.keys(funcs).some((f) => new RegExp(`\\b${f}\\s*\\(`).test(spec.expression!));
      const display = spec.show
        ? show(spec.show)
        : usesHigher
          ? "(see the solution)"
          : `$${toTex(simplify(expr))}$${spec.plusC ? " $+ C$" : ""}`;
      return { spec, expr, scope: fixed, funcs, display };
    }
    const name = spec.name ?? drill.answer;
    const target = values[name];
    if (typeof target !== "number") throw new Error(`${drill.title}: answer "${name}" is not a number`);
    const fmt = spec.format ?? (kind === "fraction" ? "fraction" : "number");
    const shown =
      kind === "fraction" || fmt === "fraction"
        ? `$${fractionTex(target)}$`
        : fmt === "sci"
          ? `$${sciTex(target, spec.sigfigs ?? 3)}$`
          : spec.sigfigs && !spec.format
            ? format(target, `sig${spec.sigfigs}`)
            : format(target, fmt);
    const display = shown + (unit ? ` ${unit}` : "");
    let shownValue: number | undefined;
    if (!shown.includes("$")) {
      const n = Number(shown.replace(/[$,%\s]/g, "").replace(/[^0-9.eE+-]+$/, ""));
      if (Number.isFinite(n) && shown.trim() !== "") shownValue = n;
    }
    return { spec, target, scope, funcs, display, shownValue };
  });
}

/** True if typed text can be checked yet (not empty, and parses). */
export function canCheck(part: PartInstance, text: string): boolean {
  if (!text.trim()) return false;
  try {
    readAnswer(part, text);
    return true;
  } catch {
    return false;
  }
}

/** Parse what was typed into a number (number kinds) or an expression (expression kind). */
export function readAnswer(part: PartInstance, text: string): { value?: number; node?: Node; lowest?: boolean } {
  const spec = part.spec;
  const kind = spec.kind ?? "number";
  if (kind === "expression") {
    const vars = spec.variables ?? ["x"];
    const node = parse(text, { implicit: true, vars });
    const extra = [...collectVars(node)].filter((v) => !vars.includes(v));
    if (extra.length) throw new Error(`Use only ${vars.join(", ")} (found ${extra.join(", ")})`);
    return { node };
  }
  let t = text.trim().replace(/\$/g, "").replace(THOUSANDS, "$1").replace(/%\s*$/, "");
  // Units at the end, e.g. "25 km/h".
  let factor = 1;
  if (spec.units) {
    const units = Object.keys(spec.units).sort((a, b) => b.length - a.length);
    for (const u of units) {
      if (t.toLowerCase().endsWith(u.toLowerCase())) {
        factor = Number(spec.units[u]);
        t = t.slice(0, t.length - u.length).trim();
        break;
      }
    }
  }
  if (kind === "fraction") {
    const f = readFraction(t);
    if (!f) throw new Error("Type a whole number or a fraction like 7/4");
    return { value: f.value * factor, lowest: f.lowest };
  }
  // A mixed number like "1 3/4" would otherwise read as 1 × 3/4.
  const mixed = /^-?\d+\s+\d+\/\d+$/.test(t) ? readFraction(t) : null;
  if (mixed) return { value: mixed.value * factor };
  const node = parse(t, { implicit: true, vars: [] });
  const value = evalNode(node, { scope: {} });
  if (!Number.isFinite(value)) throw new Error("Not a number");
  return { value: value * factor };
}

function closeEnough(given: number, target: number, spec: AnswerPart, exact = false): boolean {
  if (spec.sigfigs) {
    if (target === 0) return Math.abs(given) < 1e-12;
    const unit = 10 ** (Math.floor(Math.log10(Math.abs(target))) - spec.sigfigs + 1);
    return Math.abs(given - target) <= unit / 2 + 1e-12 * Math.abs(target);
  }
  if (spec.relTolerance !== undefined) return Math.abs(given - target) <= spec.relTolerance * Math.abs(target) * (1 + 1e-9) + Number.MIN_VALUE;
  if (spec.tolerance === undefined && spec.format === "sci") return Math.abs(given - target) <= 1e-3 * Math.abs(target);
  // Very small answers (e.g. 2.4e-12 C·m) with no explicit tolerance: compare relatively (0.5%),
  // since the default absolute tolerance would accept almost anything.
  if (spec.tolerance === undefined && target !== 0 && Math.abs(target) < 1e-3) return Math.abs(given - target) <= 5e-3 * Math.abs(target);
  // Fractions are exact unless the drill gives a tolerance: 89/100 is not 89/99.
  if (exact && spec.tolerance === undefined) return Math.abs(given - target) <= 1e-9 * Math.max(1, Math.abs(target));
  let t = target;
  if (spec.format === "money") t = Math.round(t * 100) / 100;
  if (spec.format === "money0" || spec.format === "integer") t = Math.round(t);
  const tol = spec.tolerance ?? defaultTolerance(spec.format);
  return Math.abs(given - t) <= tol + 1e-9;
}

/** Sample points for comparing expressions: spread out, avoiding 0 and ±1 to catch sign/power slips. */
const SAMPLES = [0.37, -1.29, 1.83, 2.41, -0.62, 3.07, -2.53, 0.91, 1.47, -1.77];

export function checkPart(part: PartInstance, text: string): PartResult {
  const spec = part.spec;
  const kind = spec.kind ?? "number";
  let read: ReturnType<typeof readAnswer>;
  try {
    read = readAnswer(part, text);
  } catch {
    return { ok: false, shown: text.trim() };
  }
  if (kind === "expression") {
    const vars = spec.variables ?? ["x"];
    const diffs: number[] = [];
    let compared = 0;
    for (let i = 0; i < SAMPLES.length && compared < 6; i++) {
      const pt = Object.fromEntries(vars.map((v, j) => [v, SAMPLES[(i + j * 3) % SAMPLES.length]]));
      let want: number;
      let got: number;
      try {
        want = evalNode(part.expr!, { scope: { ...part.scope, ...pt }, funcs: part.funcs });
        got = evalNode(read.node!, { scope: pt });
      } catch {
        continue;
      }
      if (!Number.isFinite(want)) continue;
      if (!Number.isFinite(got)) return { ok: false, shown: text.trim() };
      diffs.push(got - want);
      const scale = Math.max(1, Math.abs(want));
      if (!spec.plusC && Math.abs(got - want) > 1e-6 * scale) return { ok: false, shown: text.trim() };
      compared++;
    }
    if (compared < 3) return { ok: false, shown: text.trim() };
    if (spec.plusC) {
      const ok = diffs.every((d) => Math.abs(d - diffs[0]) < 1e-5 * Math.max(1, Math.abs(diffs[0])));
      return { ok, shown: text.trim() };
    }
    return { ok: true, shown: text.trim() };
  }
  if (kind === "fraction" && spec.lowestTerms && !read.lowest) return { ok: false, shown: text.trim() };
  const v = read.value!;
  const asShown = part.shownValue !== undefined && Math.abs(v - part.shownValue) <= 1e-9 * Math.max(1, Math.abs(part.shownValue));
  return { ok: asShown || closeEnough(v, part.target!, spec, kind === "fraction" || spec.format === "fraction"), shown: text.trim() };
}

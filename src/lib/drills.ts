import type { Drill, FigureSpec, NumFormat } from "./exerciseTypes";
import { fillFigureText } from "./figure";
import { compileFuncs, evaluate, type UserFn } from "./expr";
import {
  checkPart,
  defaultTolerance as tol0,
  fractionTex,
  fractionText,
  readAnswer,
  resolveParts,
  sciTex,
  sciText,
  type PartInstance,
} from "./answers";

export interface DrillInstance {
  drill: Drill;
  values: Record<string, number | string>;
  /** Compiled drill functions, bound to this problem's values. */
  funcs: Record<string, UserFn>;
  /** The answer boxes for this problem. */
  parts: PartInstance[];
  /** The drill's figures with {placeholders} in their labels filled in. */
  figures: FigureSpec[];
  prompt: string;
  solution: string;
  answer: number;
}

function pick(v: Drill["vars"][string]): number | string | { label: string; value: number } {
  if ("choices" in v) return v.choices[Math.floor(Math.random() * v.choices.length)];
  const step = v.step && v.step > 0 ? v.step : 1;
  const n = Math.floor((v.max - v.min) / step);
  const raw = v.min + Math.floor(Math.random() * (n + 1)) * step;
  // Avoid float noise like 0.30000000000000004 from fractional steps.
  const dec = (String(step).split(".")[1] ?? "").length;
  return Number(raw.toFixed(dec));
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function formatNum(v: number | string, fmt?: string): string {
  if (typeof v === "string") return v;
  // A value that rounds to zero shouldn't print as "-0" or "-0.00".
  return formatRaw(v, fmt).replace(/^(\$?)-(?=\$?0(?:\.0+)?(?![\d.]))/, "$1").replace(/^-\$(?=0(?:\.0+)?(?![\d.]))/, "$");
}

function formatRaw(v: number, fmt?: string): string {
  switch (fmt) {
    case "money":
      return v.toLocaleString("en-US", { style: "currency", currency: "USD" });
    case "money0":
      return v.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
    case "percent":
      return `${Number(v.toFixed(3))}%`;
    case "pct1":
      return `${v.toFixed(1)}%`;
    case "integer":
    case "int":
      return Math.round(v).toLocaleString("en-US");
    case "num1":
      return v.toLocaleString("en-US", { maximumFractionDigits: 1 });
    case "num2":
      return v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    case "num4":
      return v.toLocaleString("en-US", { maximumFractionDigits: 4 });
    case "month":
      return MONTHS[Math.round(v) - 1] ?? String(v);
    case "fraction":
    case "frac":
      return fractionText(v);
    case "texfrac":
      return fractionTex(v);
    case "sci":
      return sciText(v);
    case "texsci":
      return sciTex(v);
    case "deg":
      return `${Number(v.toFixed(2))}°`;
    case "coef":
      // Coefficient in front of a variable: 1 -> "", -1 -> "-", 3 -> "3".
      return v === 1 ? "" : v === -1 ? "-" : String(Number(v.toFixed(4)));
    case "signed":
      // A term after another: "+ 3" or "- 3" (the sign becomes the operator).
      return `${v < 0 ? "-" : "+"} ${Number(Math.abs(v).toFixed(4))}`;
    case "signedcoef":
      return `${v < 0 ? "-" : "+"} ${Math.abs(v) === 1 ? "" : Number(Math.abs(v).toFixed(4))}`;
    default: {
      const sig = /^sig(\d)$/.exec(fmt ?? "");
      if (sig) {
        // Keep trailing zeros (1.80 to 3 s.f.); big numbers fall back to plain digits (12300, not 1.23e+4).
        const p = v.toPrecision(Number(sig[1]));
        return p.includes("e") ? String(Number(p)) : p;
      }
      const dp = /^dp(\d)$/.exec(fmt ?? "");
      if (dp) return v.toFixed(Number(dp[1]));
      return v.toLocaleString("en-US", { maximumFractionDigits: 2 });
    }
  }
}

function fill(text: string, values: Record<string, number | string>, labels: Record<string, string>): string {
  const val = (name: string, fmt?: string) => (name in values ? formatNum(values[name], fmt) : null);
  // Tidy math that a value of 1 or 2 makes awkward: b^{1} -> b, \sqrt[2]{x} -> \sqrt{x}.
  text = text
    .replace(/\^\{\{([A-Za-z_][A-Za-z0-9_]*)(?::([a-z0-9]+))?\}\}/g, (m, name: string, fmt?: string) => (val(name, fmt) === "1" ? "" : m))
    .replace(/\\sqrt\[\{([A-Za-z_][A-Za-z0-9_]*)(?::([a-z0-9]+))?\}\]/g, (m, name: string, fmt?: string) => (val(name, fmt) === "2" ? "\\sqrt" : m));
  const math = mathMask(text);
  return text.replace(/\{([A-Za-z_][A-Za-z0-9_]*)(?::([a-z0-9]+))?\}/g, (m, name: string, fmt: string | undefined, at: number) => {
    if (!fmt && name in labels) return labels[name];
    if (!(name in values)) return m;
    const out = formatNum(values[name], fmt);
    if (!math[at]) return out;
    // A coefficient of 1 or -1 right before a letter reads "x" or "-x", not "1x" or "-1x".
    if (!fmt && (out === "1" || out === "-1") && /^[A-Za-z]/.test(text.slice(at + m.length)) && !/[\d.^_{}\\A-Za-z]$/.test(text.slice(0, at)))
      return out === "1" ? "" : "-";
    // Inside TeX a bare comma adds a space ("5, 000"); {,} keeps the thousands separator tight.
    return out.replace(/(\d),(?=\d)/g, "$1{,}");
  });
}

/** For each character of `text`, whether it sits inside $…$ or $$…$$ (escaped \$ doesn't count). */
function mathMask(text: string): boolean[] {
  const mask: boolean[] = new Array(text.length).fill(false);
  let on = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === "\\") {
      mask[i] = on;
      if (i + 1 < text.length) mask[i + 1] = on;
      i++;
      continue;
    }
    if (c === "$") {
      if (text[i + 1] === "$") i++;
      on = !on;
      continue;
    }
    mask[i] = on;
  }
  return mask;
}

export function defaultTolerance(fmt: NumFormat): number {
  return tol0(fmt);
}

/** How many times to re-roll inputs looking for a problem that meets `where`. */
const MAX_TRIES = 500;

/** Generate one problem. Throws if the template is broken. */
export function generate(drill: Drill): DrillInstance {
  let funcs: Record<string, UserFn>;
  try {
    funcs = compileFuncs(drill.funcs);
  } catch (e) {
    throw new Error(`${drill.title}: ${(e as Error).message}`);
  }
  let values: Record<string, number | string> = {};
  let labels: Record<string, string> = {};
  const numeric = () =>
    Object.fromEntries(Object.entries(values).filter(([, v]) => typeof v === "number")) as Record<string, number>;
  let ok = false;
  for (let attempt = 0; attempt < MAX_TRIES && !ok; attempt++) {
    values = {};
    labels = {};
    for (const [k, v] of Object.entries(drill.vars)) {
      const got = pick(v);
      if (typeof got === "object") {
        values[k] = got.value;
        labels[k] = got.label;
      } else values[k] = got;
    }
    let calcFailed = false;
    for (const [k, ex] of Object.entries(drill.calc ?? {})) {
      try {
        // A bare number (YAML `mt: 938.3`) is fine as is; anything else is an expression.
        values[k] = typeof ex === "number" ? ex : evaluate(String(ex), numeric(), funcs);
      } catch (e) {
        // With constraints, a bad roll (say, sqrt of a negative) just means try again.
        if (drill.where?.length) {
          calcFailed = true;
          break;
        }
        throw new Error(`${drill.title}: ${k} = ${ex}: ${(e as Error).message}`);
      }
    }
    if (calcFailed) continue;
    ok = (drill.where ?? []).every((cond) => {
      try {
        return evaluate(cond, numeric(), funcs) !== 0;
      } catch (e) {
        if (/Unknown|Expected|Unexpected|Bad/.test((e as Error).message))
          throw new Error(`${drill.title}: where "${cond}": ${(e as Error).message}`);
        return false;
      }
    });
  }
  if (!ok) throw new Error(`${drill.title}: no inputs met the "where" conditions after ${MAX_TRIES} tries`);
  const parts = resolveParts(drill, values, funcs, (t) => fill(t, values, labels), formatNum).map((p) =>
    // Answer-box labels can use {placeholders} too, e.g. "f({a})".
    p.spec.label?.includes("{") ? { ...p, spec: { ...p.spec, label: fill(p.spec.label, values, labels) } } : p,
  );
  return {
    drill,
    values,
    funcs,
    parts,
    figures: (drill.figure ? (Array.isArray(drill.figure) ? drill.figure : [drill.figure]) : []).map((f) =>
      fillFigureText(f, (t) => fill(t, values, labels)),
    ),
    prompt: fill(drill.prompt, values, labels),
    solution: fill(drill.solution, values, labels),
    answer: parts[0].target ?? NaN,
  };
}

/** Parse a typed number for the first answer box: allows $, commas, %, and math like 3/4. */
export function parseAnswer(text: string, inst?: DrillInstance): number | null {
  try {
    const part = inst?.parts[0] ?? ({ spec: {}, scope: {}, funcs: {}, display: "" } as PartInstance);
    return readAnswer(part, text).value ?? null;
  } catch {
    return null;
  }
}

/** Check a typed answer against the first answer box (single-answer drills). */
export function checkAnswer(inst: DrillInstance, given: number | string): boolean {
  return checkPart(inst.parts[0], String(given)).ok;
}

/** Check every answer box; texts are in part order. */
export function checkAll(inst: DrillInstance, texts: string[]) {
  return inst.parts.map((p, i) => checkPart(p, texts[i] ?? ""));
}

/** Validate a drill by generating several samples. Returns an error message or null. */
export function drillError(drill: Drill): string | null {
  try {
    for (let i = 0; i < 5; i++) generate(drill);
    return null;
  } catch (e) {
    return (e as Error).message;
  }
}

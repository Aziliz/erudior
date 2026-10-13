import type { Drill, FigureSpec, NumFormat } from "./types";
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
      if (sig) return String(Number(v.toPrecision(Number(sig[1]))));
      const dp = /^dp(\d)$/.exec(fmt ?? "");
      if (dp) return v.toFixed(Number(dp[1]));
      return v.toLocaleString("en-US", { maximumFractionDigits: 2 });
    }
  }
}

function fill(text: string, values: Record<string, number | string>, labels: Record<string, string>): string {
  return text.replace(/\{([A-Za-z_][A-Za-z0-9_]*)(?::([a-z0-9]+))?\}/g, (m, name: string, fmt?: string) => {
    if (!fmt && name in labels) return labels[name];
    return name in values ? formatNum(values[name], fmt) : m;
  });
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
        values[k] = evaluate(ex, numeric(), funcs);
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
  const parts = resolveParts(drill, values, funcs, (t) => fill(t, values, labels), formatNum);
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

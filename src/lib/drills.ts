import type { Drill, NumFormat } from "./types";
import { evaluate } from "./expr";

export interface DrillInstance {
  drill: Drill;
  values: Record<string, number | string>;
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
    default:
      return v.toLocaleString("en-US", { maximumFractionDigits: 2 });
  }
}

function fill(text: string, values: Record<string, number | string>, labels: Record<string, string>): string {
  return text.replace(/\{([A-Za-z_][A-Za-z0-9_]*)(?::([a-z0-9]+))?\}/g, (m, name: string, fmt?: string) => {
    if (!fmt && name in labels) return labels[name];
    return name in values ? formatNum(values[name], fmt) : m;
  });
}

export function defaultTolerance(fmt: NumFormat): number {
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

/** Generate one problem. Throws if the template is broken. */
export function generate(drill: Drill): DrillInstance {
  const values: Record<string, number | string> = {};
  const labels: Record<string, string> = {};
  for (const [k, v] of Object.entries(drill.vars)) {
    const got = pick(v);
    if (typeof got === "object") {
      values[k] = got.value;
      labels[k] = got.label;
    } else values[k] = got;
  }
  const numeric = () =>
    Object.fromEntries(Object.entries(values).filter(([, v]) => typeof v === "number")) as Record<string, number>;
  for (const [k, ex] of Object.entries(drill.calc ?? {})) {
    try {
      values[k] = evaluate(ex, numeric());
    } catch (e) {
      throw new Error(`${drill.title}: ${k} = ${ex}: ${(e as Error).message}`);
    }
  }
  const ans = values[drill.answer];
  if (typeof ans !== "number") throw new Error(`${drill.title}: answer "${drill.answer}" is not a number`);
  return {
    drill,
    values,
    prompt: fill(drill.prompt, values, labels),
    solution: fill(drill.solution, values, labels),
    answer: ans,
  };
}

/** Parse what the user typed: allows $, commas, %, spaces. */
export function parseAnswer(text: string): number | null {
  const clean = text.replace(/[$,%\s]/g, "");
  if (!clean || !/^-?\d*\.?\d+$/.test(clean)) return null;
  return Number(clean);
}

export function checkAnswer(inst: DrillInstance, given: number): boolean {
  const fmt = inst.drill.format;
  const tol = inst.drill.tolerance ?? defaultTolerance(fmt);
  let target = inst.answer;
  if (fmt === "money") target = Math.round(target * 100) / 100;
  if (fmt === "money0" || fmt === "integer") target = Math.round(target);
  return Math.abs(given - target) <= tol + 1e-9;
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

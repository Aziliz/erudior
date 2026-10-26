// Science simulations in lessons: the ```sim block, the kinds and their settings.
//
//   ```sim projectile
//   title: How far does it go?
//   speed: 20
//   angle: 45 [10, 80]
//   fixed: gravity
//   caption: Try to find the angle that sends the ball farthest.
//   ```
//
// The info string names the kind. Each other line sets a slider's starting value (optionally
// with its own [min, max]) or a choice (layout: parallel). `fixed:` hides sliders the lesson
// doesn't want changed. The models are in simModels.ts and the screen in components/SimView.tsx
// (lazy-loaded); this module is light so the lesson renderer and the course checker can use it.

import { escapeHtml, readFields, unwrap } from "./blockUtil";

export interface SimParam {
  key: string;
  label: string;
  unit?: string;
  min: number;
  max: number;
  step: number;
  value: number;
  /** Only shown for this choice (e.g. the predator–prey settings). */
  when?: [string, string];
}

export interface SimChoice {
  key: string;
  label: string;
  options: { value: string; label: string }[];
  value: string;
}

export interface SimKindInfo {
  title: string;
  /** One line under the title saying what to try. */
  intro: string;
  params: SimParam[];
  choices?: SimChoice[];
}

const g = (value = 9.8): SimParam => ({ key: "gravity", label: "Gravity", unit: "m/s²", min: 1, max: 25, step: 0.1, value });

export const SIM_KINDS: Record<string, SimKindInfo> = {
  projectile: {
    title: "Projectile motion",
    intro: "Set the launch speed, angle and height, then launch the ball and watch its path.",
    params: [
      { key: "speed", label: "Launch speed", unit: "m/s", min: 1, max: 50, step: 1, value: 20 },
      { key: "angle", label: "Launch angle", unit: "°", min: 0, max: 90, step: 1, value: 45 },
      { key: "height", label: "Launch height", unit: "m", min: 0, max: 50, step: 1, value: 0 },
      g(),
    ],
  },
  pendulum: {
    title: "Pendulum",
    intro: "Change the length, starting angle and gravity, then let it swing and compare the period.",
    params: [
      { key: "length", label: "String length", unit: "m", min: 0.1, max: 5, step: 0.1, value: 1 },
      { key: "angle", label: "Starting angle", unit: "°", min: 1, max: 170, step: 1, value: 20 },
      g(),
      { key: "damping", label: "Air resistance", unit: "per s", min: 0, max: 1, step: 0.05, value: 0 },
    ],
  },
  circuit: {
    title: "Simple circuit",
    intro: "Change the battery and the resistors, and switch between series and parallel. Watch the current and voltages.",
    params: [
      { key: "voltage", label: "Battery voltage", unit: "V", min: 1, max: 24, step: 0.5, value: 9 },
      { key: "r1", label: "Resistor 1", unit: "Ω", min: 1, max: 100, step: 1, value: 10 },
      { key: "r2", label: "Resistor 2", unit: "Ω", min: 1, max: 100, step: 1, value: 20 },
      { key: "r3", label: "Resistor 3 (0 = none)", unit: "Ω", min: 0, max: 100, step: 1, value: 0 },
    ],
    choices: [
      {
        key: "layout",
        label: "Wiring",
        options: [
          { value: "series", label: "Series (one path)" },
          { value: "parallel", label: "Parallel (separate paths)" },
        ],
        value: "series",
      },
    ],
  },
  gas: {
    title: "Gas laws",
    intro: "Heat the gas, squeeze it or add more, and watch the pressure (an ideal gas: PV = nRT).",
    params: [
      { key: "temperature", label: "Temperature", unit: "K", min: 50, max: 1000, step: 10, value: 300 },
      { key: "volume", label: "Volume", unit: "L", min: 1, max: 50, step: 1, value: 25 },
      { key: "amount", label: "Amount of gas", unit: "mol", min: 0.1, max: 3, step: 0.1, value: 1 },
    ],
    choices: [
      {
        key: "graph",
        label: "Graph",
        options: [
          { value: "volume", label: "Pressure against volume (Boyle's law)" },
          { value: "temperature", label: "Pressure against temperature (Gay-Lussac's law)" },
        ],
        value: "volume",
      },
    ],
  },
  population: {
    title: "Populations",
    intro: "Watch how populations grow and shrink over time. Change the rates and run it again.",
    params: [
      { key: "prey", label: "Rabbits at the start", min: 1, max: 200, step: 1, value: 40, when: ["model", "predator-prey"] },
      { key: "predators", label: "Foxes at the start", min: 1, max: 60, step: 1, value: 9, when: ["model", "predator-prey"] },
      { key: "birth", label: "Rabbit birth rate", unit: "per year", min: 0.1, max: 1.5, step: 0.05, value: 0.6, when: ["model", "predator-prey"] },
      { key: "catch", label: "How often foxes catch rabbits", min: 0.005, max: 0.06, step: 0.005, value: 0.025, when: ["model", "predator-prey"] },
      { key: "gain", label: "New foxes per rabbit eaten", min: 0.002, max: 0.03, step: 0.001, value: 0.01, when: ["model", "predator-prey"] },
      { key: "death", label: "Fox death rate", unit: "per year", min: 0.1, max: 1.5, step: 0.05, value: 0.5, when: ["model", "predator-prey"] },
      { key: "start", label: "Population at the start", min: 1, max: 500, step: 1, value: 10, when: ["model", "logistic"] },
      { key: "rate", label: "Growth rate", unit: "per year", min: 0.05, max: 2, step: 0.05, value: 0.5, when: ["model", "logistic"] },
      { key: "capacity", label: "Carrying capacity", min: 10, max: 1000, step: 10, value: 500, when: ["model", "logistic"] },
    ],
    choices: [
      {
        key: "model",
        label: "Model",
        options: [
          { value: "predator-prey", label: "Foxes and rabbits (predator and prey)" },
          { value: "logistic", label: "One population with limited food (logistic growth)" },
        ],
        value: "predator-prey",
      },
    ],
  },
};

export interface SimSpec {
  kind: string;
  title?: string;
  caption?: string;
  /** Starting values (sliders) and choices. */
  values: Record<string, number | string>;
  /** Slider ranges the block narrowed. */
  ranges: Record<string, [number, number]>;
  /** Settings the learner can't change. */
  fixed: string[];
  problems: string[];
}

export const SIM_BLOCK = /^```sim\b([^\n]*)\r?\n([\s\S]*?)^```[ \t]*$/gm;

export function parseSim(info: string, body: string): SimSpec {
  const kind = info.trim().split(/\s+/)[0] ?? "";
  const meta = SIM_KINDS[kind];
  const problems: string[] = [];
  const spec: SimSpec = { kind, values: {}, ranges: {}, fixed: [], problems };
  if (!kind) problems.push(`name the kind after \`\`\`sim (${Object.keys(SIM_KINDS).join(", ")})`);
  else if (!meta) problems.push(`unknown kind "${kind}" (${Object.keys(SIM_KINDS).join(", ")})`);
  if (info.trim().split(/\s+/).length > 1) problems.push(`only the kind goes after \`\`\`sim`);
  const keys = ["title", "caption", "fixed", ...(meta?.params.map((p) => p.key) ?? []), ...(meta?.choices?.map((c) => c.key) ?? [])];
  const { fields, problems: lineProblems } = readFields(body, keys, ["caption"]);
  problems.push(...lineProblems);
  for (const f of fields) {
    const at = `line ${f.line}`;
    if (f.key === "title" || f.key === "caption") {
      if (!f.value) problems.push(`${at}: empty ${f.key}:`);
      else spec[f.key] = f.value;
      continue;
    }
    if (f.key === "fixed") {
      for (const k of f.value.split(",").map((s) => s.trim()).filter(Boolean)) {
        if (!keys.includes(k) || ["title", "caption", "fixed"].includes(k)) problems.push(`${at}: fixed: "${k}" isn't a setting of ${kind}`);
        else spec.fixed.push(k);
      }
      continue;
    }
    const choice = meta?.choices?.find((c) => c.key === f.key);
    if (choice) {
      if (!choice.options.some((o) => o.value === f.value)) problems.push(`${at}: ${f.key} must be ${choice.options.map((o) => o.value).join(" or ")}`);
      else spec.values[f.key] = f.value;
      continue;
    }
    const p = meta?.params.find((x) => x.key === f.key);
    if (!p) continue;
    const m = /^(-?[\d.]+)\s*(?:\[\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*\])?$/.exec(f.value);
    if (!m || !Number.isFinite(Number(m[1]))) {
      problems.push(`${at}: ${f.key} must be a number, optionally with a range: ${p.value} [${p.min}, ${p.max}]`);
      continue;
    }
    const v = Number(m[1]);
    let [lo, hi] = [p.min, p.max];
    if (m[2] !== undefined) {
      const [a, b] = [Number(m[2]), Number(m[3])];
      if (!(a < b) || a < p.min || b > p.max) problems.push(`${at}: ${f.key} range must be inside ${p.min} to ${p.max}, smallest first`);
      else [lo, hi] = spec.ranges[f.key] = [a, b];
    }
    if (v < lo || v > hi) problems.push(`${at}: ${f.key} ${v} is outside ${lo} to ${hi}`);
    else spec.values[f.key] = v;
  }
  return spec;
}

/** Starting values with the kind's defaults filled in. */
export function simValues(spec: SimSpec): Record<string, number | string> {
  const meta = SIM_KINDS[spec.kind];
  const out: Record<string, number | string> = {};
  for (const p of meta?.params ?? []) out[p.key] = spec.values[p.key] ?? p.value;
  for (const c of meta?.choices ?? []) out[c.key] = spec.values[c.key] ?? c.value;
  return out;
}

export function simProblems(md: string): string[] {
  const blocks = [...md.matchAll(SIM_BLOCK)];
  const out = blocks.flatMap((m, i) => parseSim(m[1], m[2]).problems.map((p) => `sim ${i + 1} (${m[1].trim() || "no kind"}): ${p}`));
  if ((md.match(/^```sim\b/gm) ?? []).length > blocks.length) out.push("a ```sim block is never closed with ```");
  return out;
}

export const fmtNum = (v: number, step = 1) => {
  const d = step >= 1 ? 0 : Math.min(3, Math.ceil(-Math.log10(step) - 1e-9));
  return v.toFixed(d);
};

/** A unit after a number: " m/s", but "°" with no space. */
export const unitText = (unit?: string) => (!unit ? "" : unit === "°" ? unit : ` ${unit}`);

/** Static HTML: title, what to try, the starting settings (shown before the widget loads and in print). */
export function renderSim(info: string, body: string, md: (src: string) => string, key: string): string {
  const spec = parseSim(info, body);
  const meta = SIM_KINDS[spec.kind];
  const id = `sim-${key}`;
  if (!meta) return `<p class="notice">This simulation can't be shown (${escapeHtml(spec.problems[0] ?? "unknown kind")}).</p>`;
  const vals = simValues(spec);
  const shown = (p: SimParam) => !p.when || vals[p.when[0]] === p.when[1];
  const settings = [
    ...(meta.choices ?? []).map((c) => `<li>${escapeHtml(c.label)}: ${escapeHtml(c.options.find((o) => o.value === vals[c.key])?.label ?? String(vals[c.key]))}</li>`),
    ...meta.params.filter(shown).map((p) => `<li>${escapeHtml(p.label)}: ${fmtNum(Number(vals[p.key]), p.step)}${escapeHtml(unitText(p.unit))}</li>`),
  ].join("");
  return (
    `<figure class="sim" aria-labelledby="${id}-t" data-sim="${escapeHtml(spec.kind)}" data-sim-body="${escapeHtml(body)}">` +
    `<p class="sim-head" id="${id}-t"><span class="sim-kicker">Simulation</span><span class="sim-title">${spec.title ? unwrap(md(spec.title)) : escapeHtml(meta.title)}</span></p>` +
    `<p class="sim-intro">${escapeHtml(meta.intro)}</p>` +
    `<div class="sim-mount"><ul class="sim-start small">${settings}</ul></div>` +
    (spec.caption ? `<figcaption class="sim-caption">${md(spec.caption)}</figcaption>` : "") +
    `</figure>`
  );
}

// Worked examples with fading (```example fenced blocks in lessons and reference sheets).
//
//   ```example fade=1
//   title: Prorating property taxes
//   problem: Annual taxes are $3,650 …
//   step: Daily rate = $3,650 / 365 = $10/day
//   step: Seller's days = 120
//   step: Seller owes 120 × $10 = $1,200
//   answer: $1,200
//   ```
//
// Each line starting with `title:`, `problem:`, `step:` or `answer:` starts a field; any other
// line continues the field above it (so a step can hold several lines, a list or display math).
// `fade=N` hides the last N steps: the learner works them out and reveals each in turn, and the
// answer stays hidden until every step is shown. Every field is Markdown with math, rendered by
// the same pipeline as the lesson text. The HTML is complete without JavaScript (hidden parts
// use the `hidden` attribute, and print shows everything); the Markdown component wires up the
// buttons.

export interface WorkedExample {
  title?: string;
  problem?: string;
  steps: string[];
  answer?: string;
  /** Steps hidden from the end, clamped to the number of steps. */
  fade: number;
  /** Authoring problems (the block still renders). */
  problems: string[];
}

/** A whole ```example block at the start of a line; group 1 is the info string, 2 the body. */
export const EXAMPLE_BLOCK = /^```example\b([^\n]*)\r?\n([\s\S]*?)^```[ \t]*$/gm;

const FIELD = /^(title|problem|step|answer)\s*:[ \t]?(.*)$/i;

export function parseExample(info: string, body: string): WorkedExample {
  const problems: string[] = [];
  const ex: WorkedExample = { steps: [], fade: 0, problems };

  // Info string: fade=N; nothing else is defined yet.
  let fade = 0;
  for (const tok of info.trim().split(/\s+/).filter(Boolean)) {
    const m = /^fade=(.*)$/i.exec(tok);
    if (!m) problems.push(`unknown option "${tok}" (only fade=N is understood)`);
    else if (!/^\d+$/.test(m[1])) problems.push(`fade must be a whole number of steps, not "${m[1]}"`);
    else fade = Number(m[1]);
  }

  type Key = "title" | "problem" | "step" | "answer";
  let cur: { key: Key; lines: string[] } | null = null;
  const fields: { key: Key; lines: string[] }[] = [];
  let stray = false;
  for (const line of body.replace(/\r\n?/g, "\n").split("\n")) {
    const m = FIELD.exec(line);
    if (m) {
      cur = { key: m[1].toLowerCase() as Key, lines: [m[2]] };
      fields.push(cur);
    } else if (cur) cur.lines.push(line);
    else if (line.trim()) stray = true;
  }
  if (stray) problems.push("text before the first field (start lines with title:, problem:, step: or answer:)");

  for (const f of fields) {
    const text = f.lines.join("\n").trim();
    if (!text) {
      problems.push(`empty ${f.key}: line`);
      continue;
    }
    if (f.key === "step") ex.steps.push(text);
    else if (ex[f.key] !== undefined) problems.push(`more than one ${f.key}: line`);
    else ex[f.key] = text;
  }
  if (!ex.problem) problems.push("no problem: line");
  if (!ex.steps.length) problems.push("no step: lines");
  if (fade > ex.steps.length) problems.push(`fade=${fade} but there ${ex.steps.length === 1 ? "is 1 step" : `are ${ex.steps.length} steps`}`);
  ex.fade = Math.min(fade, ex.steps.length);
  return ex;
}

/** Every example block in a Markdown text, with its authoring problems. */
export function findExamples(md: string): WorkedExample[] {
  return [...md.matchAll(EXAMPLE_BLOCK)].map((m) => parseExample(m[1], m[2]));
}

/** Authoring problems for a Markdown text, one message per problem ("example 2: no step: lines"). */
export function exampleProblems(md: string): string[] {
  const exs = findExamples(md);
  const unclosed = (md.match(/^```example\b/gm) ?? []).length - exs.length;
  const out = exs.flatMap((ex, i) => ex.problems.map((p) => `example ${i + 1}${ex.title ? ` ("${ex.title.slice(0, 40)}")` : ""}: ${p}`));
  if (unclosed > 0) out.push("an ```example block is never closed with ```");
  return out;
}

/** One short paragraph's HTML without its <p> wrapper (for titles). */
const unwrap = (html: string) => {
  const m = /^\s*<p>([\s\S]*)<\/p>\s*$/.exec(html);
  return m && !m[1].includes("<p>") ? m[1] : html;
};

function hash(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0;
  return h.toString(36);
}

/**
 * The example as HTML. `md` renders one field's Markdown (the lesson pipeline: math, glossary
 * links, images; already sanitized). `key` makes the ids unique on the page.
 */
export function renderExample(ex: WorkedExample, md: (src: string) => string, key: string): string {
  const id = `wx-${key}`;
  const firstHidden = ex.steps.length - ex.fade;
  const kicker = ex.fade === 0 ? "Worked example" : ex.fade >= ex.steps.length ? "Practice problem" : "Worked example: your turn";
  const note =
    ex.fade === 0
      ? ""
      : `<p class="wx-note">${ex.fade >= ex.steps.length ? "Work out every step yourself" : `Work out the last ${ex.fade === 1 ? "step" : `${ex.fade} steps`} yourself`}, then check each one.</p>`;
  const steps = ex.steps
    .map((s, i) => {
      const body = md(s);
      if (i < firstHidden) return `<li class="wx-step"><div class="wx-body">${body}</div></li>`;
      return (
        `<li class="wx-step is-faded">` +
        `<div class="wx-turn"><span class="wx-prompt">Your turn: work out this step.</span>` +
        `<button type="button" class="btn sm wx-show" data-wx="step"${i === firstHidden ? "" : " hidden"}>Show step ${i + 1}</button></div>` +
        `<div class="wx-body" id="${id}-s${i + 1}" tabindex="-1" role="group" aria-label="Step ${i + 1}" hidden>${body}</div>` +
        `</li>`
      );
    })
    .join("");
  const answer = ex.answer
    ? ex.fade
      ? `<div class="wx-answer">` +
        `<button type="button" class="btn sm wx-show" data-wx="answer" hidden>Show answer</button>` +
        `<div class="wx-answer-body" id="${id}-a" tabindex="-1" hidden><strong class="wx-label">Answer</strong>${md(ex.answer)}</div>` +
        `</div>`
      : `<div class="wx-answer"><div class="wx-answer-body"><strong class="wx-label">Answer</strong>${md(ex.answer)}</div></div>`
    : "";
  return (
    `<section class="wx${ex.fade ? " is-fading" : ""}" aria-labelledby="${id}-t">` +
    `<p class="wx-head" id="${id}-t"><span class="wx-kicker">${kicker}</span>${ex.title ? `<span class="wx-title">${unwrap(md(ex.title))}</span>` : ""}</p>` +
    (ex.problem ? `<div class="wx-problem">${md(ex.problem)}</div>` : "") +
    note +
    (ex.steps.length ? `<ol class="wx-steps">${steps}</ol>` : "") +
    answer +
    `</section>`
  );
}

/**
 * Swap example blocks for placeholders before Markdown runs; `restore` puts the rendered
 * examples back (after sanitizing: each field was sanitized by `md` already, and the frame is
 * built here from escaped text).
 */
export function protectExamples(src: string, md: (src: string) => string): { text: string; restore: (html: string) => string } {
  if (!src.includes("```example")) return { text: src, restore: (h) => h };
  const out: string[] = [];
  const text = src.replace(EXAMPLE_BLOCK, (whole, info: string, body: string) => {
    out.push(renderExample(parseExample(info, body), md, `${out.length + 1}-${hash(whole)}`));
    return `\n\nXEXAMPLEX${out.length - 1}XEXAMPLEX\n\n`;
  });
  if (!out.length) return { text: src, restore: (h) => h };
  return {
    text,
    restore: (html) =>
      html.replace(/<p>XEXAMPLEX(\d+)XEXAMPLEX<\/p>/g, (_m, n) => out[Number(n)]).replace(/XEXAMPLEX(\d+)XEXAMPLEX/g, (_m, n) => out[Number(n)]),
  };
}

/**
 * Click handling for a rendered example's "Show step" / "Show answer" buttons (event
 * delegation from the Markdown component). Returns true when it handled the click. Reveals in
 * order, moves focus to what was revealed (so screen readers read it), and offers the next.
 */
export function revealExample(target: Element): boolean {
  const btn = target.closest<HTMLButtonElement>("button.wx-show");
  const box = btn?.closest<HTMLElement>(".wx");
  if (!btn || !box) return false;
  let shown: HTMLElement | null = null;
  if (btn.dataset.wx === "step") {
    const li = btn.closest<HTMLElement>(".wx-step");
    shown = li?.querySelector<HTMLElement>(".wx-body") ?? null;
    li?.querySelector(".wx-turn")?.remove();
    li?.classList.replace("is-faded", "is-revealed");
    const next = box.querySelector<HTMLButtonElement>(".wx-step.is-faded button.wx-show");
    if (next) next.hidden = false;
    else {
      const ans = box.querySelector<HTMLButtonElement>(".wx-answer button.wx-show");
      if (ans) ans.hidden = false;
    }
  } else {
    shown = box.querySelector<HTMLElement>(".wx-answer-body");
    btn.remove();
  }
  if (shown) {
    shown.hidden = false;
    shown.focus();
  }
  return true;
}

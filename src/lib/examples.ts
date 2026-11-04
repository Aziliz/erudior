import { EXAMPLE_BLOCK, parseExample, type WorkedExample } from "./exampleSpec";
export * from "./exampleSpec";

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

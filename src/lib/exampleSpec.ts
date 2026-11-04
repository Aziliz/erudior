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

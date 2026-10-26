// Checks a course file thoroughly: every drill generates, accepts its own correct
// answer and rejects a wrong one, figures render, all math notation parses in KaTeX,
// and no TeX leaks outside $…$. Lessons' quizzes and drills must point at real items.
//
//   npx tsx tests/check-course.mts samples/math/algebra.json [more files…]
//
// Exits non-zero and lists every problem found. Also used by tests/drills.test.mts.
import { readFileSync } from "node:fs";
import katex from "katex";
import { normalizeCourse } from "../src/lib/course.ts";
import { generate, checkAll } from "../src/lib/drills.ts";
import { renderFigure } from "../src/lib/figure.ts";
import { fractionText } from "../src/lib/answers.ts";
import { splitMath } from "../src/lib/math.ts";
import type { FigureSpec } from "../src/lib/types.ts";
import { blankCount, isCorrect, qtype } from "../src/lib/questions.ts";
import { MERMAID_BLOCK, mermaidA11y } from "../src/lib/diagram.ts";
import { EXAMPLE_BLOCK, exampleProblems, parseExample } from "../src/lib/examples.ts";
import { MANIP_BLOCK, manipProblems, readSpec, solution, startState, targetProblems } from "../src/lib/manip.ts";

let mermaidParse: ((src: string) => Promise<unknown>) | null = null;
async function parseMermaid(src: string): Promise<void> {
  if (!mermaidParse) {
    const { JSDOM } = await import("jsdom");
    const dom = new JSDOM("<!doctype html><html><body></body></html>");
    const g = globalThis as Record<string, unknown>;
    g.window ??= dom.window;
    g.document ??= dom.window.document;
    const { default: mermaid } = await import("mermaid");
    mermaid.initialize({ startOnLoad: false, securityLevel: "strict" });
    mermaidParse = (s) => mermaid.parse(s);
  }
  await mermaidParse(src);
}

export async function checkCourse(file: string, opts: { runs?: number; money?: boolean } = {}): Promise<string[]> {
  const problems: string[] = [];
  const say = (s: string) => problems.push(s);
  const c = normalizeCourse(JSON.parse(readFileSync(file, "utf8")));
  const runs = opts.runs ?? 40;
  const diagrams: { where: string; src: string }[] = [];

  // --- Notation -----------------------------------------------------------------
  const checkText = (where: string, text: string | undefined, allowFigures = false) => {
    if (!text) return;
    let t = text;
    if (allowFigures) {
      // Worked examples: report malformed blocks, then check their fields like the lesson text.
      for (const p of exampleProblems(t)) say(`${where}: ${p}`);
      t = t.replace(EXAMPLE_BLOCK, (_m, info: string, body: string) => {
        const ex = parseExample(info, body);
        return ["", ex.title, ex.problem, ...ex.steps, ex.answer, ""].filter((x) => x !== undefined).join("\n\n");
      });
      // Manipulatives: options and starting state must make sense.
      for (const p of manipProblems(t)) say(`${where}: ${p}`);
      t = t.replace(MANIP_BLOCK, "");
      t = t.replace(/```(plot|figure|shape|numberline)\s*\n([\s\S]*?)```/g, (_m, kind: string, body: string) => {
        try {
          const spec = JSON.parse(body) as FigureSpec;
          if (!spec.type) spec.type = kind === "shape" ? "shape" : kind === "numberline" ? "numberline" : "plot";
          renderFigure(spec);
        } catch (e) {
          say(`${where}: figure block: ${(e as Error).message}`);
        }
        return "";
      });
      t = t.replace(MERMAID_BLOCK, (_m, body: string) => {
        diagrams.push({ where, src: body });
        return "";
      });
      // Images: alt text required; only embedded (data:) images load in the desktop app.
      for (const m of t.matchAll(/!\[([^\]]*)\]\(([^)\s]+)[^)]*\)/g)) {
        if (!m[1].trim()) say(`${where}: image without alt text (![alt](…))`);
        if (!m[2].startsWith("data:")) say(`${where}: image "${m[2].slice(0, 60)}" isn't embedded; put it in the course's images/ folder`);
      }
      t = t.replace(/!\[[^\]]*\]\([^)]*\)/g, "");
      // Code spans and blocks aren't math.
      t = t.replace(/```[\s\S]*?```/g, "").replace(/`[^`\n]*`/g, "");
    }
    for (const seg of splitMath(t)) {
      if (seg.math) {
        try {
          katex.renderToString(seg.text, { displayMode: !!seg.display, throwOnError: true, strict: "ignore" });
        } catch (e) {
          say(`${where}: TeX error in "${seg.text.slice(0, 80)}": ${(e as Error).message.split("\n")[0]}`);
        }
      } else if (!opts.money) {
        const m = /\\[A-Za-z]{2,}|\$(?![\d\s.,])|\^\{|_\{/.exec(seg.text);
        if (m) {
          const at = Math.max(0, m.index - 30);
          say(`${where}: TeX outside $…$ near "${seg.text.slice(at, m.index + 30).replace(/\n/g, " ")}"`);
        }
      }
    }
  };

  for (const l of c.lessons) checkText(`lesson ${l.id}`, l.body, true);
  for (const r of c.references) checkText(`reference ${r.id}`, r.body, true);
  for (const b of c.banks)
    for (const q of b.questions) {
      const kind = qtype(q);
      const parts: [string, string | undefined][] = [
        ["stem", q.stem],
        ["explanation", q.explanation],
        ...q.choices.map((ch, i): [string, string] => [kind === "order" ? `item ${i + 1}` : `choice ${i + 1}`, ch]),
        ...(q.left ?? []).map((l, i): [string, string] => [`left ${i + 1}`, l]),
        ...(q.accept ?? []).flatMap((a, i) => a.map((x, j): [string, string] => [`blank ${i + 1} answer ${j + 1}`, x])),
        ...(q.image?.caption ? [["image caption", q.image.caption] as [string, string]] : []),
      ];
      for (const [what, t] of parts) checkText(`question ${q.id} ${what}`, t);
      // Questions render as plain text with math, not Markdown.
      for (const [what, t] of parts)
        if (t && (/^\s*\|.*\|\s*$/m.test(t) || /\*\*[^*]+\*\*|(^|[\s(])\*[^*\s][^*\n]*?[^*\s]\*(?=$|[\s.,;:)])|(^|[\s(])_[^_\s][^_\n]*?_(?=$|[\s.,;:)])|`/.test(t.replace(/\$[^$]*\$/g, "").replace(/_{3,}/g, ""))))
          say(`question ${q.id} ${what}: uses Markdown (tables, bold, italics, backticks), which questions don't render`);
      if (q.image && !q.image.alt.trim()) say(`question ${q.id}: image without alt text`);
      if (q.image && !q.image.src.startsWith("data:")) say(`question ${q.id}: image isn't embedded (put it in the course's images/ folder)`);
      if (kind === "text") {
        if ((q.accept ?? []).length !== blankCount(q)) say(`question ${q.id}: blanks and accept lists don't match`);
        if (!isCorrect(q, (q.accept ?? []).map((a) => a[0]))) say(`question ${q.id}: its own first accepted answer is rejected`);
        if (isCorrect(q, (q.accept ?? []).map(() => "zzqx"))) say(`question ${q.id}: a nonsense answer is accepted`);
      }
      if (kind === "match" || kind === "label") {
        if (new Set(q.choices).size !== q.choices.length) say(`question ${q.id}: the same choice is listed twice`);
        if (q.choices.some((ch) => ch.includes("$"))) say(`question ${q.id}: ${kind} answers are shown in a drop-down list, which can't show math; use plain text (math is fine on the left side)`);
        if (!isCorrect(q, q.answer)) say(`question ${q.id}: its own answer is rejected`);
      }
      if (kind === "order" && !isCorrect(q, q.choices.map((_, i) => i))) say(`question ${q.id}: the correct order is rejected`);
      if (kind === "model") {
        const r = readSpec(q.model);
        for (const p of [...r.problems, ...targetProblems(r.model, q.target)]) say(`question ${q.id}: model: ${p}`);
        const sol = q.target ? solution(r.model, q.target) : null;
        if (!sol || !isCorrect(q, sol)) say(`question ${q.id}: model: its own answer is rejected`);
        if (isCorrect(q, startState(r.model))) say(`question ${q.id}: model: the starting model is already right`);
      }
    }
  // Cards are Markdown like lessons (pictures, figures, diagrams and examples all render).
  for (const d of c.decks) for (const k of d.cards) (checkText(`card ${k.id} front`, k.front, true), checkText(`card ${k.id} back`, k.back, true));
  for (const g of c.glossary) checkText(`glossary ${g.term}`, g.definition);

  // --- References between parts ---------------------------------------------------
  const qids = new Set(c.banks.flatMap((b) => b.questions.map((q) => q.id)));
  const dids = new Set(c.drills.map((d) => d.id));
  const rids = new Set(c.references.map((r) => r.id));
  for (const l of c.lessons) {
    l.quiz?.forEach((q) => qids.has(q) || say(`lesson ${l.id}: quiz question ${q} missing`));
    l.drills?.forEach((d) => dids.has(d) || say(`lesson ${l.id}: drill ${d} missing`));
    l.refs?.forEach((r) => rids.has(r) || say(`lesson ${l.id}: reference ${r} missing`));
  }
  for (const m of c.modules) m.quiz?.forEach((q) => qids.has(q) || say(`module ${m.id}: quiz question ${q} missing`));

  // --- Drills ------------------------------------------------------------------------
  for (const d of c.drills) {
    // A TeX group like \frac{dz}{dt} gets filled in if a drill value is named dz.
    const names = new Set([...Object.keys(d.vars ?? {}), ...Object.keys(d.calc ?? {})]);
    for (const [what, text] of [["prompt", d.prompt], ["solution", d.solution]] as const)
      for (const m of text.matchAll(/\\(?:[dt]?frac|text|textrm|mathrm|operatorname|mathbf|mathit|boldsymbol)\{(\w+)\}/g))
        if (names.has(m[1])) say(`drill ${d.id} ${what}: TeX "${m[0]}" clashes with the drill value {${m[1]}} (rename the value)`);
    for (let i = 0; i < runs; i++) {
      let g;
      try {
        g = generate(d);
      } catch (e) {
        say(`drill ${d.id}: can't generate: ${String(e)}`);
        break;
      }
      checkText(`drill ${d.id} prompt`, g.prompt);
      checkText(`drill ${d.id} solution`, g.solution);
      g.parts.forEach((p, j) => {
        checkText(`drill ${d.id} answer ${j + 1}`, p.display);
        if (p.spec.label) checkText(`drill ${d.id} label ${j + 1}`, p.spec.label);
      });
      for (const [what, text] of [["prompt", g.prompt], ["solution", g.solution], ...g.parts.map((p, j) => [`label ${j + 1}`, p.spec.label ?? ""] as const)] as const) {
        const m = /\{[A-Za-z_]\w*:\w+\}/.exec(text);
        if (m) say(`drill ${d.id}: unfilled placeholder ${m[0]} in ${what} (unknown name or format)`);
      }
      if (/NaN|Infinity|undefined/.test(g.prompt + g.solution)) say(`drill ${d.id}: NaN/Infinity/undefined in text: ${(g.prompt + " | " + g.solution).slice(0, 160)}`);
      const scope = Object.fromEntries(Object.entries(g.values).filter(([, v]) => typeof v === "number")) as Record<string, number>;
      for (const f of g.figures) {
        try {
          renderFigure(f, scope, g.funcs);
        } catch (e) {
          say(`drill ${d.id}: figure: ${String(e)}`);
        }
      }
      const usesHigher = g.parts.some(
        (p) => p.spec.kind === "expression" && (/\b(deriv|integ|solve|limit|extremum|sum|prod)\(/.test(p.spec.expression!) || Object.keys(g.funcs).some((f) => new RegExp(`\\b${f}\\s*\\(`).test(p.spec.expression!))),
      );
      if (!usesHigher) {
        const typed = g.parts.map((p) => {
          if (p.spec.kind === "expression") {
            const vars = p.spec.variables ?? ["x"];
            return p.spec.expression!.replace(/\b([A-Za-z_]\w*)\b(?!\s*\()/g, (m) =>
              m in g.values && !vars.includes(m) ? `(${g.values[m]})` : m,
            );
          }
          if (p.spec.kind === "fraction") return fractionText(p.target!);
          const t = p.target!;
          return p.spec.format === "money" ? t.toFixed(2) : p.spec.format === "money0" || p.spec.format === "integer" ? String(Math.round(t)) : String(t);
        });
        const ok = checkAll(g, typed);
        if (!ok.every((r) => r.ok)) {
          say(`drill ${d.id}: correct answer rejected: typed ${JSON.stringify(typed)}, expected ${g.parts.map((p) => p.display).join(" / ")}`);
          break;
        }
      }
      const wrong = checkAll(g, g.parts.map((p) => (p.spec.kind === "expression" ? "x^7 + 13" : String((p.target ?? 0) + 1.37 + 0.6 * Math.abs(p.target ?? 0)))));
      if (wrong.some((r) => r.ok)) {
        say(`drill ${d.id}: wrong answer accepted`);
        break;
      }
    }
  }
  // --- Diagrams ------------------------------------------------------------------
  for (const d of diagrams) {
    const a11y = mermaidA11y(d.src);
    if (!a11y.title || !a11y.description) say(`${d.where}: mermaid diagram needs accTitle: and accDescr: lines (what it shows, for screen readers)`);
    try {
      await parseMermaid(d.src);
    } catch (e) {
      say(`${d.where}: mermaid error: ${String((e as Error).message ?? e).split("\n").slice(0, 3).join(" ")}`);
    }
  }

  // --- Honors -------------------------------------------------------------------------
  const honorsLesson = new Set(c.lessons.filter((l) => l.honors || c.modules.find((m) => m.id === l.module)?.honors).map((l) => l.id));
  for (const m of c.modules.filter((m) => !m.honors)) {
    const core = c.lessons.filter((l) => l.module === m.id && !honorsLesson.has(l.id));
    if (!core.length) say(`module ${m.id}: has only honors lessons (mark the module honors: true)`);
    const honorsQs = new Set(c.lessons.filter((l) => l.module === m.id && honorsLesson.has(l.id)).flatMap((l) => l.quiz ?? []));
    if (m.quiz?.some((q) => honorsQs.has(q))) say(`module ${m.id}: its module quiz uses honors questions`);
  }

  // One message per distinct problem.
  return [...new Set(problems)];
}

if (process.argv[1]?.endsWith("check-course.mts")) {
  let total = 0;
  for (const f of process.argv.slice(2)) {
    const p = await checkCourse(f);
    total += p.length;
    console.log(p.length ? `${f}: ${p.length} problem(s)\n  ${p.join("\n  ")}` : `${f}: OK`);
  }
  if (total) process.exit(1);
}

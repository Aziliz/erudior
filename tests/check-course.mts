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

export function checkCourse(file: string, opts: { runs?: number; money?: boolean } = {}): string[] {
  const problems: string[] = [];
  const say = (s: string) => problems.push(s);
  const c = normalizeCourse(JSON.parse(readFileSync(file, "utf8")));
  const runs = opts.runs ?? 40;

  // --- Notation -----------------------------------------------------------------
  const checkText = (where: string, text: string | undefined, allowFigures = false) => {
    if (!text) return;
    let t = text;
    if (allowFigures) {
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
      checkText(`question ${q.id} stem`, q.stem);
      q.choices.forEach((ch, i) => checkText(`question ${q.id} choice ${i + 1}`, ch));
      checkText(`question ${q.id} explanation`, q.explanation);
      // Questions render as plain text with math, not Markdown.
      for (const [what, t] of [["stem", q.stem], ["explanation", q.explanation], ...q.choices.map((ch, i) => [`choice ${i + 1}`, ch])])
        if (/^\s*\|.*\|\s*$/m.test(t) || /\*\*[^*]+\*\*/.test(t.replace(/\$[^$]*\$/g, "")))
          say(`question ${q.id} ${what}: uses Markdown (tables/bold), which questions don't render`);
    }
  for (const d of c.decks) for (const k of d.cards) (checkText(`card ${k.id} front`, k.front), checkText(`card ${k.id} back`, k.back));
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
  // One message per distinct problem.
  return [...new Set(problems)];
}

if (process.argv[1]?.endsWith("check-course.mts")) {
  let total = 0;
  for (const f of process.argv.slice(2)) {
    const p = checkCourse(f);
    total += p.length;
    console.log(p.length ? `${f}: ${p.length} problem(s)\n  ${p.join("\n  ")}` : `${f}: OK`);
  }
  if (total) process.exit(1);
}

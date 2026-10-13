// Every drill in the bundled courses must generate, accept its own correct answer,
// reject a wrong one, and draw its figures. Run: npm test
import { readFileSync } from "node:fs";
import { normalizeCourse } from "../src/lib/course.ts";
import { generate, checkAll } from "../src/lib/drills.ts";
import { renderFigure } from "../src/lib/figure.ts";
import { fractionText } from "../src/lib/answers.ts";
import { splitMath } from "../src/lib/math.ts";

let bad = 0;
for (const file of ["samples/colorado-broker-course.json", "samples/math-sampler-course.json"]) {
  const c = normalizeCourse(JSON.parse(readFileSync(file, "utf8")));
  for (const d of c.drills) {
    for (let i = 0; i < 60; i++) {
      let g;
      try {
        g = generate(d);
      } catch (e) {
        bad++;
        console.log("GENERATE", file, d.id, String(e));
        break;
      }
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
      // Expression answers that use drill functions can't be typed literally; skip those.
      if (g.parts.some((p) => p.spec.kind === "expression" && /\b(deriv|integ|solve|limit)\(/.test(p.spec.expression!))) continue;
      const ok = checkAll(g, typed);
      if (!ok.every((r) => r.ok)) {
        bad++;
        console.log("RIGHT ANSWER REJECTED", d.id, typed, g.parts.map((p) => p.display));
        break;
      }
      const wrong = checkAll(g, g.parts.map((p) => (p.spec.kind === "expression" ? "x^7 + 13" : String((p.target ?? 0) * 1.5 + 7.77))));
      if (wrong.some((r) => r.ok)) {
        bad++;
        console.log("WRONG ANSWER ACCEPTED", d.id);
        break;
      }
      const scope = Object.fromEntries(Object.entries(g.values).filter(([, v]) => typeof v === "number")) as Record<string, number>;
      for (const f of g.figures) {
        try {
          renderFigure(f, scope, g.funcs);
        } catch (e) {
          bad++;
          console.log("FIGURE", d.id, String(e));
        }
      }
    }
  }
  // Dollar amounts in the real estate course must never be read as math.
  if (file.includes("colorado")) {
    const texts: string[] = [];
    for (const l of c.lessons) texts.push(l.body);
    for (const q of c.banks[0].questions) texts.push(q.stem, ...q.choices, q.explanation ?? "");
    for (const dk of c.decks) for (const k of dk.cards) texts.push(k.front, k.back);
    const hits = texts.flatMap((t) => splitMath(t).filter((s) => s.math));
    if (hits.length) {
      bad++;
      console.log("MONEY READ AS MATH", hits.slice(0, 5));
    }
  }
}
console.log(bad ? `${bad} drill problems` : "all drills pass");
if (bad) process.exit(1);

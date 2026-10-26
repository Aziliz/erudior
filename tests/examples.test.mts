// Worked examples (```example blocks): parsing, authoring checks, rendering and reveal order.
// Run: npx tsx tests/examples.test.mts
import { JSDOM } from "jsdom";
import { exampleProblems, findExamples, parseExample, protectExamples, renderExample, revealExample } from "../src/lib/examples.ts";

let fails = 0;
const ok = (name: string, cond: boolean, extra?: unknown) => {
  if (!cond) {
    fails++;
    console.log("FAIL", name, extra ?? "");
  }
};

const block = (info: string, body: string) => "```example" + info + "\n" + body + "\n```";
const taxes = block(
  " fade=1",
  `title: Prorating property taxes
problem: Annual taxes are $3,650. The seller owns the home for 120 days.
step: Daily rate = $3,650 / 365 = $10/day
step: Seller's days = 120
step: Seller owes 120 × $10 = $1,200
answer: $1,200`,
);

// --- Parsing ---------------------------------------------------------------------
let ex = findExamples(`Intro\n\n${taxes}\n\nAfter`)[0];
ok("found", !!ex);
ok("title", ex.title === "Prorating property taxes", ex.title);
ok("problem", ex.problem?.startsWith("Annual taxes") === true);
ok("three steps", ex.steps.length === 3, ex.steps);
ok("answer", ex.answer === "$1,200");
ok("fade 1", ex.fade === 1);
ok("no problems", ex.problems.length === 0, ex.problems);

ex = parseExample("", "problem: Solve $2x + 1 = 7$.\nstep: Subtract 1:\n\n$$2x = 6$$\nstep: Divide by 2: $x = 3$\nanswer: $x = 3$");
ok("no fade = fully worked", ex.fade === 0);
ok("multi-line step kept", ex.steps[0].includes("$$2x = 6$$") && ex.steps.length === 2, ex.steps);
ok("keys case-insensitive", parseExample("", "Problem: p\nSTEP: s").steps[0] === "s");

ex = parseExample(" fade=5", "problem: p\nstep: a\nstep: b");
ok("fade clamped", ex.fade === 2);
ok("fade > steps warned", ex.problems.some((p) => p.includes("fade=5")), ex.problems);
ok("no steps warned", parseExample("", "problem: p\nanswer: a").problems.includes("no step: lines"));
ok("no problem warned", parseExample("", "step: s").problems.includes("no problem: line"));
ok("bad fade warned", parseExample(" fade=two", "problem: p\nstep: s").problems.some((p) => p.includes("whole number")));
ok("unknown option warned", parseExample(" hide=1", "problem: p\nstep: s").problems.some((p) => p.includes("unknown option")));
ok("stray text warned", parseExample("", "oops\nproblem: p\nstep: s").problems.some((p) => p.includes("before the first field")));
ok("duplicate answer warned", parseExample("", "problem: p\nstep: s\nanswer: a\nanswer: b").problems.some((p) => p.includes("more than one answer")));
ok("empty step warned", parseExample("", "problem: p\nstep:\nstep: s").problems.some((p) => p.includes("empty step")));

ok("clean text has no problems", exampleProblems(`# Hi\n\n${taxes}`).length === 0);
const probs = exampleProblems(`${taxes}\n\n${block(" fade=3", "title: Broken\nproblem: p\nstep: only")}`);
ok("problems name the example", probs.length === 1 && probs[0].startsWith('example 2 ("Broken")') && probs[0].includes("fade=3"), probs);
ok("unclosed block", exampleProblems("```example\nproblem: p\nstep: s\n").some((p) => p.includes("never closed")));
ok("other fences ignored", findExamples("```examples\nx\n```\n```mermaid\ny\n```").length === 0);

// --- Rendering -----------------------------------------------------------------------
const md = (s: string) => `<p>${s}</p>`;
let html = renderExample(parseExample(" fade=1", "title: T\nproblem: P\nstep: A\nstep: B\nanswer: Z"), md, "k");
ok("fading: one prompt", (html.match(/Your turn: work out this step/g) ?? []).length === 1);
ok("fading: real buttons", html.includes('<button type="button" class="btn sm wx-show" data-wx="step">Show step 2</button>'));
ok("fading: answer hidden", /data-wx="answer" hidden>Show answer/.test(html) && /class="wx-answer-body"[^>]* hidden>/.test(html));
ok("fading: worked step visible", /<li class="wx-step"><div class="wx-body"><p>A<\/p>/.test(html));
ok("labelled section", html.includes('aria-labelledby="wx-k-t"') && html.includes('id="wx-k-t"'));
html = renderExample(parseExample("", "problem: P\nstep: A\nanswer: Z"), md, "k");
ok("worked: nothing hidden", !html.includes("hidden") && !html.includes("<button") && html.includes("Worked example"));
html = renderExample(parseExample(" fade=2", "problem: P\nstep: A\nstep: B"), md, "k");
ok("all faded: practice problem", html.includes("Practice problem") && (html.match(/Your turn/g) ?? []).length === 2);

const prot = protectExamples(`Before\n\n${taxes}\n\nAfter`, md);
ok("placeholder in text", /XEXAMPLEX0XEXAMPLEX/.test(prot.text) && !prot.text.includes("```example"));
ok("restore replaces paragraph", prot.restore("<p>Before</p><p>XEXAMPLEX0XEXAMPLEX</p>").includes('<section class="wx is-fading"'));
ok("no blocks: untouched", protectExamples("plain $x$", md).text === "plain $x$");

// --- Reveal order in a DOM -------------------------------------------------------------
const dom = new JSDOM(`<!doctype html><body>${renderExample(parseExample(" fade=2", "problem: P\nstep: A\nstep: B\nstep: C\nanswer: Z"), md, "d")}</body>`);
const doc = dom.window.document;
const btns = () => [...doc.querySelectorAll<HTMLButtonElement>("button.wx-show")].filter((b) => !b.hidden).map((b) => b.textContent);
ok("only next step offered", JSON.stringify(btns()) === '["Show step 2"]', btns());
revealExample(doc.querySelector("button.wx-show")!);
ok("step 2 shown and focused", !doc.getElementById("wx-d-s2")!.hidden && doc.activeElement?.id === "wx-d-s2");
ok("then step 3 offered", JSON.stringify(btns()) === '["Show step 3"]', btns());
ok("answer still hidden", (doc.querySelector(".wx-answer-body") as HTMLElement).hidden);
revealExample(doc.querySelector("button.wx-show:not([hidden])")!);
ok("then answer offered", JSON.stringify(btns()) === '["Show answer"]', btns());
revealExample(doc.querySelector("button.wx-show:not([hidden])")!);
ok("answer shown and focused", !(doc.querySelector(".wx-answer-body") as HTMLElement).hidden && doc.activeElement?.id === "wx-d-a");
ok("no buttons left", btns().length === 0 && doc.querySelectorAll(".wx-turn").length === 0);
ok("other clicks ignored", revealExample(doc.body) === false);

// --- Full Markdown pipeline (math, sanitizing, decorateLesson) ----------------------------
{
  const g = globalThis as Record<string, unknown>;
  const win = new JSDOM("<!doctype html><body></body>").window;
  g.window ??= win;
  g.document ??= win.document;
  try {
    const { renderMarkdown, decorateLesson } = await import("../src/components/Markdown.tsx");
    const out = decorateLesson(
      renderMarkdown(`### Example 1\n\nText\n\n${block(" fade=1", "title: Solve $2x = 6$\nproblem: Find $x$ when $2x = 6$. See [[slope]].\nstep: Divide by 2.\nstep: $x = 3$\nanswer: $x = 3$")}\n\nAfter <script>alert(1)</script>`),
    );
    ok("pipeline: math in fields", (out.match(/class="katex"/g) ?? []).length >= 4, out.slice(0, 300));
    ok("pipeline: glossary link in field", out.includes('class="gloss"'));
    ok("pipeline: buttons survive", out.includes('data-wx="step"') && out.includes("hidden"));
    ok("pipeline: still sanitized", !out.includes("<script"));
    ok("pipeline: example outside example-heading box", /<\/section>\s*<section class="wx/.test(out), out.replace(/<span class="katex[\s\S]*?<\/span><\/span><\/span>/g, "M").slice(0, 400));
  } catch (e) {
    ok("pipeline import", false, e);
  }
}

if (fails) {
  console.log(`${fails} examples test(s) failed`);
  process.exit(1);
}
console.log("examples tests passed");

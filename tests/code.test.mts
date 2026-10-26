// Code exercises: the format, judging runs, the answer stamp, ```code lesson blocks, the
// JavaScript harness (in a worker thread, with a time limit), the Python harness (system python3,
// skipped without it) and the course checker's exercise checks.
// Run: npx tsx tests/code.test.mts
import { readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { JSDOM } from "jsdom";
import {
  codeBlockProblems,
  codeHash,
  findCodeBlocks,
  judge,
  literal,
  makeStamp,
  normalizeCodeSpec,
  normalizeOutput,
  protectCode,
  readStamp,
  sameValue,
  testCall,
  type CodeSpec,
} from "../src/lib/code.ts";
import { answerText, chosenText, isAnswered, isComplete, isCorrect, normalizeQuestionKind, typeLabel } from "../src/lib/questions.ts";
import { inspect, plain } from "../src/lib/codeJs.ts";
import type { Question } from "../src/lib/types.ts";
import { pythonPath, runJsNode, runPythonNode } from "./code-node.mts";
import { checkCourse } from "./check-course.mts";

let fails = 0;
const ok = (name: string, cond: boolean, extra?: unknown) => {
  if (!cond) {
    fails++;
    console.log("FAIL", name, extra ?? "");
  }
};
const throws = (name: string, f: () => unknown, re: RegExp) => {
  try {
    f();
    ok(name, false, "did not throw");
  } catch (e) {
    ok(name, re.test((e as Error).message), (e as Error).message);
  }
};

// --- Format -----------------------------------------------------------------------------
const spec = normalizeCodeSpec({
  language: "py",
  function: "double",
  starter: "def double(n):\n    pass\n",
  solution: "def double(n):\n    return n * 2\n",
  tests: [{ args: [4], expect: 8 }, { args: [-3], expect: -6, hidden: true }, { stdin: ["Ada", "12"], stdout: "Hi Ada\n" }],
  hints: ["Multiply", " "],
});
ok("language alias", spec.language === "python");
ok("call test keeps args/expect", spec.tests[0].args?.[0] === 4 && spec.tests[0].expect === 8);
ok("stdin list joined", spec.tests[2].stdin === "Ada\n12\n", spec.tests[2].stdin);
ok("output test calls nothing", testCall(spec, spec.tests[2]) === undefined && testCall(spec, spec.tests[0]) === "double");
ok("empty hints dropped", spec.hints?.length === 1);
ok("expect null kept", "expect" in normalizeCodeSpec({ language: "python", function: "f", tests: [{ args: [], expect: null }] }).tests[0]);
throws("no language", () => normalizeCodeSpec({ tests: [{ stdout: "x" }] }), /language/);
throws("no tests", () => normalizeCodeSpec({ language: "js", tests: [] }), /tests/);
throws("test checks nothing", () => normalizeCodeSpec({ language: "js", tests: [{ stdin: "x" }] }), /checks nothing/);
throws("call without function", () => normalizeCodeSpec({ language: "js", tests: [{ args: [1], expect: 1 }] }), /names it/);
throws("bad function name", () => normalizeCodeSpec({ language: "python", function: "my-fn", tests: [{ args: [], expect: 1 }] }), /valid Python name/);
throws("args not a list", () => normalizeCodeSpec({ language: "js", function: "f", tests: [{ args: 3, expect: 1 }] }), /isn't a list/);
throws("all hidden", () => normalizeCodeSpec({ language: "js", tests: [{ stdout: "x", hidden: true }] }), /isn't hidden/);
throws("time limit", () => normalizeCodeSpec({ language: "js", timeLimit: 99, tests: [{ stdout: "x" }] }), /timeLimit/);
throws("question without code", () => normalizeQuestionKind({ type: "code", stem: "x" }), /code/);
const kind = normalizeQuestionKind({ type: "code", stem: "x", code: { language: "js", tests: [{ stdout: "1" }] } });
ok("question kind", kind.type === "code" && kind.code?.language === "javascript" && kind.choices.length === 0);

// --- Judging ------------------------------------------------------------------------------
ok("output: trailing space and blank lines ignored", normalizeOutput("a  \r\nb\n\n") === "a\nb");
ok("numbers within tolerance", sameValue(0.1 + 0.2, 0.3) && !sameValue(1, 1.01) && sameValue(1, 1.01, 0.05));
ok("deep values", sameValue({ a: [1, { b: "x" }] }, { a: [1, { b: "x" }] }) && !sameValue([1, 2], [2, 1]));
ok("python literal", literal({ a: [true, null, "it's"] }, "python") === `{'a': [True, None, 'it\\'s']}`, literal({ a: [true, null, "it's"] }, "python"));
ok("js literal", literal({ a: [true, null, "x"] }, "javascript") === `{ a: [true, null, "x"] }`, literal({ a: [true, null, "x"] }, "javascript"));
let o = judge(spec, spec.tests[0], { stdout: "", hasValue: true, value: 8, repr: "8" });
ok("pass", o.ok && o.label === "double(4)" && o.expected === "8", o);
o = judge(spec, spec.tests[0], { stdout: "", hasValue: true, value: null, repr: "None" });
ok("returned None", !o.ok && o.actual === "None");
o = judge(spec, spec.tests[2], { stdout: "Hi Ada  \n\n" });
ok("stdout pass", o.ok, o);
o = judge(spec, spec.tests[2], { stdout: "Hi Bob\n" });
ok("stdout fail", !o.ok && o.actualOut === "Hi Bob" && o.expectedOut === "Hi Ada");
o = judge(spec, spec.tests[0], { stdout: "", error: { type: "NameError", message: "name 'x' is not defined", line: 2 } });
ok("error", !o.ok && o.problem === "Line 2: NameError: name 'x' is not defined", o.problem);
ok("timeout", /Stopped after 5 seconds/.test(judge(spec, spec.tests[0], { stdout: "", timedOut: true }).problem ?? ""));
ok("skipped", /earlier/.test(judge(spec, spec.tests[0], { stdout: "", skipped: true }).problem ?? ""));
ok("hidden flag", judge(spec, spec.tests[1], { stdout: "" }).hidden);

// --- Stamp and grading ------------------------------------------------------------------
const q: Question = { id: "q1", topic: "T", type: "code", stem: "Write double", choices: [], answer: [], code: spec };
const code = "def double(n):\n    return n * 2\n";
ok("hash ignores trailing space", codeHash(code) === codeHash("def double(n):   \n    return n * 2"));
ok("not run = not answered", !isAnswered(q, [code]) && !isComplete(q, [code]) && !isCorrect(q, [code]));
ok("passing stamp", isAnswered(q, [code, makeStamp(code, 3, 3)]) && isCorrect(q, [code, makeStamp(code, 3, 3)]));
ok("failing stamp is answered but wrong", isAnswered(q, [code, makeStamp(code, 1, 3)]) && !isCorrect(q, [code, makeStamp(code, 1, 3)]));
ok("stale stamp", !isAnswered(q, [code + "x = 1\n", makeStamp(code, 3, 3)]));
ok("forged stamp shape", readStamp([code, "pass:zzz:1/1"]) === null);
ok("stamp reads", readStamp([code, makeStamp(code, 2, 3)])?.passed === 2);
ok("texts", typeLabel(q) === "Write code" && answerText(q) === code.trim() && /2 of 3/.test(chosenText(q, [code, makeStamp(code, 2, 3)])));

// --- Lesson blocks ------------------------------------------------------------------------
const md = "Intro `x = $5` and $y$.\n\n```code python\nname = input()\nprint('Hi', name)\n--- input ---\nAda\n```\n\n```code js readonly\nconsole.log(`${1 + 1}`)\n```\n\n```code ruby\nputs 1\n```\n\n```code python fast\n\n```\n";
const blocks = findCodeBlocks(md);
ok("four blocks", blocks.length === 4, blocks.length);
ok("input split off", blocks[0].stdin === "Ada\n" && blocks[0].source === "name = input()\nprint('Hi', name)\n", blocks[0]);
ok("readonly js", blocks[1].language === "javascript" && blocks[1].readonly);
const probs = codeBlockProblems(md + "```code js\nnever closed\n");
ok("problems: language, option, empty, unclosed", probs.some((p) => /unknown language "ruby"/.test(p)) && probs.some((p) => /unknown option "fast"/.test(p)) && probs.some((p) => /no code/.test(p)) && probs.some((p) => /never closed/.test(p)), probs);
const prot = protectCode(md);
ok("blocks and spans protected", !prot.text.includes("print(") && !prot.text.includes("$5") && prot.text.includes("$y$"), prot.text);
const restored = prot.restore(`<p>${prot.text}</p>`);
ok("static html escaped", restored.includes('data-code-lang="python"') && restored.includes("print(&#39;Hi&#39;, name)") && restored.includes('data-code-stdin="Ada\n"') && restored.includes("data-code-readonly"), restored.slice(0, 400));
ok("span restored", restored.includes("<code>x = $5</code>"));

{
  const g = globalThis as Record<string, unknown>;
  const win = new JSDOM("<!doctype html><body></body>").window;
  g.window ??= win;
  g.document ??= win.document;
  const { renderMarkdown } = await import("../src/components/Markdown.tsx");
  const out = renderMarkdown("Costs `$x$` and $y$.\n\n```code js\nconst s = `$a$ and $b$`;\nconsole.log(s)\n```\n\n```python\nprint('$1 and $2')\n```\n\n<script>alert(1)</script>");
  ok("pipeline: code span isn't math", out.includes("<code>$x$</code>") && (out.match(/class="katex"/g) ?? []).length === 1, out);
  ok("pipeline: code block kept as text", out.includes('<figure class="code-block" data-code-lang="javascript"') && out.includes("const s = `$a$ and $b$`;"), out);
  ok("pipeline: plain fence kept", out.includes('<pre><code class="language-python">print(\'$1 and $2\')'), out);
  ok("pipeline: still sanitized", !out.includes("<script"));
}

// --- JavaScript harness (worker thread) -------------------------------------------------
ok("inspect", inspect([1, "a", { b: null }, new Map([["k", 1]])]) === `[1, "a", { b: null }, Map(1) { "k" => 1 }]`, inspect([1, "a", { b: null }, new Map([["k", 1]])]));
ok("plain", JSON.stringify(plain([1, undefined, NaN])) === `[1,null,{"$repr":"NaN"}]`);
let r = await runJsNode("function isEven(n) {\n  return n % 2 === 0\n}\nconsole.log('loaded')", [{ call: "isEven", args: [4] }, { call: "isEven", args: [3] }, { call: "nope", args: [] }], 2);
ok("js values", r[0].value === true && r[1].value === false && r[0].stdout === "loaded\n", r);
ok("js missing function", r[2].error?.type === "MissingFunction", r[2]);
r = await runJsNode("const a = input('Name? ');\nconst b = prompt();\nconsole.log(a, b, prompt())", [{ stdin: "Ada\n7\n" }], 2);
ok("js input/prompt", r[0].stdout === "Name? Ada 7 null\n", r[0]);
r = await runJsNode("let x = 1;\n\nundefinedThing();", [{}], 2);
ok("js runtime error line", r[0].error?.type === "ReferenceError" && r[0].error.line === 3, r[0]);
r = await runJsNode("let x = (1;\nconsole.log(x)", [{}], 2);
ok("js syntax error line", r[0].error?.type === "SyntaxError" && r[0].error.line === 1, r[0]);
r = await runJsNode("async function f(n) { await null; return n + 1 }", [{ call: "f", args: [1] }], 2);
ok("js async function awaited", r[0].value === 2, r[0]);
r = await runJsNode("function f() { while (true) {} }", [{ call: "f", args: [] }, { call: "f", args: [] }], 1);
ok("js endless loop stopped", r[0].timedOut === true && r[1].skipped === true, r);

// --- Python harness (system python3) ------------------------------------------------------
if (pythonPath()) {
  const p = runPythonNode(
    "def double(n):\n    return n * 2\n\ndef pair():\n    return (1, {'a': None}, {3, 1})\nname = input('Name? ')\nprint('Hi', name)",
    [{ call: "double", args: [4], stdin: "Ada\n" }, { call: "pair", args: [], stdin: "x\n" }],
    5,
  )!;
  ok("py value + stdout", p[0].value === 8 && p[0].stdout === "Name? Hi Ada\n", p[0]);
  ok("py tuples/sets/None", JSON.stringify(p[1].value) === `[1,{"a":null},[1,3]]` && p[1].repr === "(1, {'a': None}, {1, 3})", p[1]);
  const e = runPythonNode("def f(n):\n    return g(n)\n\ndef g(n):\n    return n / 0\n", [{ call: "f", args: [1] }], 5)!;
  ok("py traceback trimmed to student lines", e[0].error?.type === "ZeroDivisionError" && e[0].error.line === 5 && e[0].error.trace?.length === 2 && e[0].error.trace[1] === "Line 5, in g: return n / 0", e[0]);
  const s = runPythonNode("x = (1\nprint(x)", [{}], 5)!;
  ok("py syntax error", s[0].error?.type === "SyntaxError" && s[0].error.line === 1, s[0]);
  const eof = runPythonNode("a = input()\nb = input()", [{ stdin: "1\n" }], 5)!;
  ok("py EOF", eof[0].error?.type === "EOFError" && eof[0].error.line === 2, eof[0]);
  const loop = runPythonNode("while True:\n    pass", [{}, {}], 1)!;
  ok("py endless loop", loop[0].timedOut === true && loop[1].skipped === true, loop);
} else console.log("(python3 not found: Python harness tests skipped)");

// --- Desktop CSP allows exactly the pinned Pyodide -----------------------------------------
{
  const { PYODIDE_URL, PYODIDE_VERSION } = await import("../src/lib/codeRun.ts");
  const csp: string = JSON.parse(readFileSync("src-tauri/tauri.conf.json", "utf8")).app.security.csp;
  const src = (d: string) => csp.split(";").map((s) => s.trim()).find((s) => s.startsWith(d + " ")) ?? "";
  ok("pyodide url pinned", PYODIDE_URL === `https://cdn.jsdelivr.net/npm/pyodide@${PYODIDE_VERSION}/`, PYODIDE_URL);
  ok("csp script-src", src("script-src").includes(PYODIDE_URL) && src("script-src").includes("'wasm-unsafe-eval'") && !src("script-src").includes("'unsafe-eval'"), csp);
  ok("csp connect-src", src("connect-src").includes(PYODIDE_URL), csp);
  ok("csp worker-src", src("worker-src") === "worker-src 'self'", csp);
}

// --- Course checker ---------------------------------------------------------------------
{
  const bad: CodeSpec = {
    language: "javascript",
    function: "add",
    starter: "function add(a, b) { return a + b }",
    solution: "function add(a, b) { return a - b }",
    tests: [{ args: [1, 2], expect: 3 }],
  };
  const course = {
    format: "examiner-course",
    version: 1,
    id: "t",
    title: "T",
    lessons: [{ id: "l1", title: "L", body: "```code js\nlet x = (1;\n```\n\n```code python\nprint('ok')\n```" }],
    banks: [{ id: "b", title: "B", questions: [{ id: "c1", type: "code", topic: "T", stem: "Add `a` and `b`.", code: bad }] }],
  };
  const dir = mkdtempSync(join(tmpdir(), "erudior-code-"));
  const file = join(dir, "course.json");
  writeFileSync(file, JSON.stringify(course));
  const problems = await checkCourse(file);
  ok("checker: solution fails", problems.some((p) => /model solution fails test 1/.test(p)), problems);
  ok("checker: starter already passes", problems.some((p) => /starter code already passes/.test(p)), problems);
  ok("checker: block doesn't compile", problems.some((p) => /lesson l1: code block doesn't compile/.test(p)), problems);
  ok("checker: good python block passes", problems.length === 3, problems);
  const demo = await checkCourse("samples/demo-code-course.json");
  ok("demo course is clean", demo.length === 0, demo);
}

if (fails) {
  console.log(`${fails} code test(s) failed`);
  process.exit(1);
}
console.log("code tests passed");

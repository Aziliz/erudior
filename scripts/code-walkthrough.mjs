// End-to-end check of code exercises: runnable ```code blocks in a lesson (Python and
// JavaScript, typed input, read-only), the keyboard (Tab indents, Esc then Tab leaves), and the
// four exercises of samples/demo-code-course.json in a lesson quiz (failing and passing tests,
// an endless loop being stopped, hints, Check answer, the model solution, results review), with
// axe audits and an overflow check.
//   npm run build && npx vite preview --port 5191
//   PYODIDE_DIR=<folder with the pyodide npm package's files> node scripts/code-walkthrough.mjs [light|dark] [width] [shots dir]
// PYODIDE_DIR serves Pyodide locally in place of jsDelivr (for machines without access to it).
const pw = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright");
const { chromium } = pw.chromium ? pw : pw.default;
import fs from "node:fs";
import path from "node:path";
const axeSrc = fs.readFileSync(new URL("../node_modules/axe-core/axe.min.js", import.meta.url), "utf8");
const course = new URL("../samples/demo-code-course.json", import.meta.url).pathname;
const scheme = process.argv[2] || "light";
const width = Number(process.argv[3] || 1280);
const shots = process.argv[4];
const B = process.env.BASE ?? "http://localhost:5191/";
const b = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const ctx = await b.newContext({ viewport: { width, height: 900 }, colorScheme: scheme });
if (process.env.PYODIDE_DIR) {
  await ctx.route(/^https:\/\/cdn\.jsdelivr\.net\/npm\/pyodide@[^/]+\/(.*)$/, (route) => {
    const name = /pyodide@[^/]+\/([^?]*)/.exec(route.request().url())[1];
    const file = path.join(process.env.PYODIDE_DIR, name);
    if (!fs.existsSync(file)) return route.fulfill({ status: 404 });
    const type = name.endsWith(".wasm") ? "application/wasm" : name.endsWith(".mjs") || name.endsWith(".js") ? "text/javascript" : name.endsWith(".json") ? "application/json" : "application/zip";
    route.fulfill({ path: file, contentType: type, headers: { "Access-Control-Allow-Origin": "*" } });
  });
}
// THEME=sepia|dim|contrast|light|dark picks the app's theme (default: follow the color scheme).
if (process.env.THEME) await ctx.addInitScript((t) => localStorage.setItem("examiner.theme", t), process.env.THEME);
const pg = await ctx.newPage();
pg.on("dialog", (d) => d.accept());
pg.on("pageerror", (e) => console.log("PAGE ERROR", e.message));
pg.on("console", (m) => m.type() === "error" && console.log("CONSOLE", m.text()));
const problems = [];
const check = (name, cond, extra) => {
  if (!cond) problems.push(extra === undefined ? name : `${name}: ${extra}`);
};
async function audit(name) {
  await pg.waitForTimeout(300);
  const ov = await pg.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const scrolls = (e) => {
      for (let p = e.parentElement; p && p !== document.body; p = p.parentElement) {
        const o = getComputedStyle(p).overflowX;
        if (o === "auto" || o === "scroll" || o === "hidden") return p.clientWidth < p.scrollWidth || o === "hidden";
      }
      return false;
    };
    let worst = 0,
      what = "";
    for (const e of document.querySelectorAll("body *")) {
      const r = e.getBoundingClientRect();
      if (r.width && r.right - vw > worst && !scrolls(e)) {
        worst = r.right - vw;
        what = `${e.tagName.toLowerCase()}.${e.className}`;
      }
    }
    return worst > 1 ? `${Math.round(worst)}px (${what})` : "";
  });
  if (ov) problems.push(`${name}: sticks out of the window by ${ov}`);
  await pg.addScriptTag({ content: axeSrc });
  const r = await pg.evaluate(async () => await window.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "wcag2aaa", "best-practice"] } }));
  for (const v of r.violations) problems.push(`${name}: ${v.id} — ${v.nodes.slice(0, 2).map((n) => n.target.join(" ") + " :: " + (n.failureSummary || "").split("\n")[1]).join(" | ")}`);
  if (shots) await pg.screenshot({ path: `${shots}/code-${process.env.THEME ?? scheme}-${width}-${name}.png`, fullPage: true });
}
const btn = (name, scope = pg) => scope.getByRole("button", { name }).first();
const waitText = async (loc, re, ms = 60000) => {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    const t = (await loc.textContent().catch(() => "")) ?? "";
    if (re.test(t)) return t;
    await pg.waitForTimeout(150);
  }
  return (await loc.textContent().catch(() => "")) ?? "";
};
/** Replace the code in an editor (insertText skips auto-indent and bracket closing). */
async function setCode(editor, code) {
  await editor.locator(".cm-content").click();
  await pg.keyboard.press("ControlOrMeta+a");
  await pg.keyboard.press("Delete");
  await pg.keyboard.insertText(code);
}

await pg.goto(B);
await pg.waitForTimeout(1500);
const [chooser] = await Promise.all([pg.waitForEvent("filechooser"), btn(/^Import$/).click()]);
await chooser.setFiles(course);
await pg.waitForTimeout(1200);
await pg.getByRole("button", { name: /^Code exercises demo/ }).first().click();
await pg.waitForTimeout(800);
await btn(/^Lessons$/).click();
await pg.waitForTimeout(400);
await pg.getByRole("button", { name: /First programs/ }).first().click();
await pg.waitForTimeout(2500);

// ---- Lesson code blocks -------------------------------------------------------------------
const blocks = pg.locator("figure.code-block");
check("four code blocks", (await blocks.count()) === 4, await blocks.count());
check("editors mounted", (await pg.locator("figure.code-block .cm-editor").count()) === 4, await pg.locator("figure.code-block .cm-editor").count());
check("python highlighted", (await blocks.nth(0).locator(".cm-line span").count()) > 0);
check("readonly block isn't editable", (await blocks.nth(3).locator(".cm-content").getAttribute("contenteditable")) === "false");
check("input box prefilled", (await blocks.nth(2).locator("textarea").inputValue()) .trim() === "Ada\n11", JSON.stringify(await blocks.nth(2).locator("textarea").inputValue()));
await audit("lesson");

await btn(/^Run$/, blocks.nth(0)).click();
const st0 = await waitText(blocks.nth(0).locator(".code-status"), /Loading Python|finished/, 5000);
check("loading message names the download", /Loading Python \(one-time download, about \d+ MB\)|finished/.test(st0), st0);
await waitText(blocks.nth(0).locator(".code-status"), /finished|error|couldn't/i, 90000);
check("python block output", (await blocks.nth(0).locator(".code-out").textContent())?.includes("Hello, world!\nCounting: 1"), await blocks.nth(0).locator(".code-run").textContent().catch(() => "-"));
await btn(/^Run$/, blocks.nth(1)).click();
await waitText(blocks.nth(1).locator(".code-status"), /finished|error/, 20000);
check("js block output", (await blocks.nth(1).locator(".code-out").textContent()) === "Hello, Ada!\nCounting: 1\nCounting: 2\nCounting: 3", await blocks.nth(1).locator(".code-out").textContent());
await btn(/^Run$/, blocks.nth(2)).click();
await waitText(blocks.nth(2).locator(".code-status"), /finished|error/, 20000);
check("typed input used", (await blocks.nth(2).locator(".code-out").textContent())?.includes("Next year you will be 12"), await blocks.nth(2).locator(".code-out").textContent());
// An error marks its line.
await setCode(blocks.nth(1), "const x = 1;\nconsole.log(y);\n");
await btn(/^Run$/, blocks.nth(1)).click();
await waitText(blocks.nth(1).locator(".code-status"), /finished|error/, 20000);
check("js error with line", /Line 2: ReferenceError/.test((await blocks.nth(1).locator(".code-err").textContent()) ?? ""), await blocks.nth(1).locator(".code-run").textContent());
check("error line marked", (await blocks.nth(1).locator(".cm-error-line").count()) === 1);
check("start over offered after an edit", await btn(/Start over/, blocks.nth(1)).isVisible());
await audit("lesson-ran");
// Keyboard: Tab indents inside the editor; Esc then Tab leaves it.
await blocks.nth(0).locator(".cm-content").click();
await pg.keyboard.press("ControlOrMeta+Home");
await pg.keyboard.press("Tab");
check("tab indents", (await blocks.nth(0).locator(".cm-line").first().textContent())?.startsWith("    print"), await blocks.nth(0).locator(".cm-line").first().textContent());
await pg.keyboard.press("Escape");
await pg.keyboard.press("Tab");
const inEditor = await pg.evaluate(() => !!document.activeElement?.closest(".cm-editor"));
check("Esc then Tab leaves the editor", !inEditor, await pg.evaluate(() => document.activeElement?.outerHTML.slice(0, 120)));
// Drafts survive leaving the lesson.
await pg.goBack().catch(() => {});

// ---- Exercises in the lesson quiz -----------------------------------------------------------
await pg.goto(B);
await pg.waitForTimeout(1200);
await pg.getByRole("button", { name: /^Code exercises demo/ }).first().click();
await pg.waitForTimeout(600);
await btn(/^Lessons$/).click();
await pg.getByRole("button", { name: /First programs/ }).first().click();
await pg.waitForTimeout(2000);
check("lesson draft restored", (await pg.locator("figure.code-block").nth(0).locator(".cm-line").first().textContent())?.startsWith("    print"));
await btn(/Take the quiz/).click();
await pg.waitForTimeout(1500);

const ex = pg.locator(".code-ex");
const statusOf = () => ex.locator(".code-status");
async function runTests() {
  await btn(/^Run tests$/, ex).click();
  return waitText(statusOf(), /tests passed|couldn't|Couldn't/, 90000);
}
const seen = new Set();
for (let i = 0; i < 4; i++) {
  await pg.waitForTimeout(600);
  const stem = (await pg.locator(".q-stem").first().textContent()) ?? "";
  const editor = ex.locator(".code-editor").first();
  if (/double\(n\)/.test(stem)) {
    seen.add("py-double");
    check("check disabled before running", await btn(/^Check answer$/).isDisabled());
    let s = await runTests();
    check("starter fails", /0 of 4 tests passed/.test(s), s);
    check("expected vs got shown", /should give 8, got None/.test((await ex.locator(".code-test").first().textContent()) ?? ""), await ex.locator(".code-test").first().textContent());
    await btn(/Show a hint/, ex).click();
    check("hint shown", (await ex.locator(".code-hints li").count()) === 1);
    await setCode(editor, "def double(n):\n    while True:\n        pass\n");
    s = await runTests();
    check("python endless loop stopped", /Stopped after 5 seconds/.test((await ex.locator(".code-tests").textContent()) ?? ""), await ex.locator(".code-tests").textContent());
    await audit("exercise-failing");
    await setCode(editor, "def double(n):\n    return n * 2\n");
    s = await runTests();
    check("python passes after restart", /All 4 tests passed/.test(s), s);
    await btn(/^Check answer$/).click();
    await pg.waitForTimeout(500);
    check("correct verdict", /Correct/.test((await pg.locator(".verdict").textContent()) ?? ""));
    check("model solution shown after success", (await ex.locator(".code-solution .cm-editor").count()) === 1);
    await audit("exercise-correct");
  } else if (/reads a name/.test(stem)) {
    seen.add("py-greet");
    await setCode(editor, 'name = input()\nprint("Hi " + name)\n');
    const s = await runTests();
    check("greet wrong output fails", /0 of 2 tests passed/.test(s), s);
    check("printed output compared", /Your code printed/.test((await ex.locator(".code-tests").textContent()) ?? ""), await ex.locator(".code-tests").textContent());
    check("hidden test summary", /Hidden tests: 1 of 1 failed/.test((await ex.locator(".code-hidden").textContent()) ?? ""), await ex.locator(".code-hidden").textContent());
    await btn(/^Check answer$/).click();
    await pg.waitForTimeout(500);
    check("wrong verdict", /some tests didn't pass/.test((await pg.locator(".verdict").textContent()) ?? ""));
    await btn(/Show a model solution/, ex).click();
    await pg.waitForTimeout(500);
    check("solution on request", (await ex.locator(".code-solution .cm-editor").count()) === 1);
    await audit("exercise-wrong");
  } else if (/isEven/.test(stem)) {
    seen.add("js-even");
    await setCode(editor, "function isEven(n) {\n  while (true) {}\n}\n");
    let s = await runTests();
    check("js endless loop stopped", /Stopped after 5 seconds/.test((await ex.locator(".code-tests").textContent()) ?? ""), s);
    await setCode(editor, "function isEven(n) {\n  return n % 2 === 0;\n}\n");
    s = await runTests();
    check("js passes", /All 4 tests passed/.test(s), s);
    // Editing after a run means it has to be run again.
    await editor.locator(".cm-content").click();
    await pg.keyboard.press("ControlOrMeta+End");
    await pg.keyboard.insertText("\n// done\n");
    check("edit needs a new run", await btn(/^Check answer$/).isDisabled());
    s = await runTests();
    await btn(/^Check answer$/).click();
    await pg.waitForTimeout(400);
  } else if (/countdown/.test(stem)) {
    seen.add("js-countdown");
    await setCode(editor, 'function countdown(n) {\n  for (let i = n; i >= 1; i--) {\n    console.log(i);\n  }\n  console.log("Liftoff!");\n}\n');
    const s = await runTests();
    check("countdown passes", /All 3 tests passed/.test(s), s);
    await btn(/^Check answer$/).click();
    await pg.waitForTimeout(400);
  } else problems.push(`unexpected question: ${stem.slice(0, 60)}`);
  if (i < 3) await btn(/^Next$/).click();
}
check("all four exercises seen", seen.size === 4, [...seen].join(","));
await btn(/See results|Finish quiz/).click();
await pg.waitForTimeout(1500);
check("results score", /75%|3 of 4|3\/4/.test((await pg.locator("main, body").first().textContent()) ?? ""));
check("results show code read-only", (await pg.locator(".review-item .code-ex .cm-editor").count()) >= 1);
await audit("results");

await b.close();
if (problems.length) {
  console.log(`${problems.length} problem(s):\n  ${problems.join("\n  ")}`);
  process.exit(1);
}
console.log(`code walkthrough clean (${scheme}, ${width}px)`);

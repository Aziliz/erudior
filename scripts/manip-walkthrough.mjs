// End-to-end check of math manipulatives: lesson blocks, model questions answered with buttons
// and keys only, feedback, results review, resuming a run, and the bank editor, with axe
// audits. Build and serve first:
//   npm run build && npx vite preview --port 5293
//   node scripts/manip-walkthrough.mjs samples/manipulatives-demo.json [light|dark] [width] [shots dir]
const pw = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright");
const { chromium } = pw.chromium ? pw : pw.default;
import fs from "node:fs";
import { createRequire } from "node:module";
const axeSrc = fs.readFileSync(createRequire(import.meta.url).resolve("axe-core/axe.min.js"), "utf8");
const file = process.argv[2];
const scheme = process.argv[3] || "light";
const width = Number(process.argv[4] || 1280);
const shots = process.argv[5];
const B = process.env.BASE ?? "http://localhost:5293/";
const b = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const ctx = await b.newContext({ viewport: { width, height: 900 }, colorScheme: scheme });
const pg = await ctx.newPage();
pg.on("dialog", (d) => d.accept());
pg.on("pageerror", (e) => problems.push(`PAGE ERROR ${e.message}`));
const problems = [];
const check = (name, cond) => {
  if (!cond) problems.push(name);
};
async function audit(name) {
  await pg.waitForTimeout(400);
  const ov = await pg.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const scrolls = (e) => {
      for (let p = e.parentElement; p && p !== document.body; p = p.parentElement) {
        const o = getComputedStyle(p).overflowX;
        if (o === "auto" || o === "scroll" || o === "hidden") return p.clientWidth < p.scrollWidth || o === "hidden";
      }
      return false;
    };
    let worst = 0, what = "";
    for (const e of document.querySelectorAll("body *")) {
      const r = e.getBoundingClientRect();
      if (r.width && r.right - vw > worst && !scrolls(e)) {
        worst = r.right - vw;
        what = `${e.tagName.toLowerCase()}.${e.className?.baseVal ?? e.className}`;
      }
    }
    return worst > 1 ? `${Math.round(worst)}px (${what})` : "";
  });
  if (ov) problems.push(`${name}: sticks out of the window by ${ov}`);
  await pg.addScriptTag({ content: axeSrc });
  const r = await pg.evaluate(async () => await window.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"] } }));
  for (const v of r.violations) problems.push(`${name}: ${v.id} — ${v.nodes.slice(0, 2).map((n) => n.target.join(" ") + " :: " + (n.failureSummary || "").split("\n")[1]).join(" | ")}`);
  if (shots) await pg.screenshot({ path: `${shots}/m-${scheme}-${width}-${name}.png`, fullPage: true });
}
const btn = (name) => pg.getByRole("button", { name }).first();
const press = async (name, times = 1) => {
  for (let i = 0; i < times; i++) await pg.getByRole("button", { name, exact: true }).first().click();
};
const live = () => pg.locator(".mp [aria-live]").first().textContent();

await pg.goto(B);
await pg.waitForTimeout(1500);
const [chooser] = await Promise.all([pg.waitForEvent("filechooser"), btn(/^Import$/).click()]);
await chooser.setFiles(file);
await pg.waitForTimeout(1200);
await pg.getByRole("button", { name: /^Demo: Math models/ }).first().click();
await pg.waitForTimeout(800);
await btn(/^Lessons$/).click();
await pg.waitForTimeout(400);

// Lesson 1: counters, blocks, number lines.
await pg.getByRole("button", { name: /Counters, blocks and number lines/ }).first().click();
await pg.waitForTimeout(1500);
check("six models in lesson 1", (await pg.locator("figure.manip .mp").count()) === 6);
check("static pictures hidden once mounted", (await pg.locator("figure.manip .manip-static:visible").count()) === 0);
const first = pg.locator("figure.manip").first();
await first.getByRole("button", { name: "Add a counter" }).click();
check("lesson counter added", (await first.locator("[aria-live]").textContent()) === "4 counters");
const line = pg.locator("figure.manip [role=slider]").first();
await line.focus();
await pg.keyboard.press("ArrowRight");
await pg.keyboard.press("PageDown");
check("lesson number line keys", (await line.getAttribute("aria-valuenow")) === "-2");
check("hop arcs drawn", (await pg.locator("figure.manip .mp-hop").count()) === 2);
await audit("lesson1");
await btn(/Take the quiz/).click();
await pg.waitForTimeout(800);

async function answer(stem) {
  if (stem.startsWith("Put 5 counters")) await press("Add a counter", 5);
  else if (stem.startsWith("Show 6 + 3")) {
    await press("Add a red counter", 6);
    await press("Add a yellow counter", 3);
  } else if (stem.startsWith("Show 347")) {
    await press("Add a hundred", 3);
    await press("Add a ten", 4);
    await press("Add a one", 7);
    check("blocks announced", (await live()) === "3 hundreds, 4 tens, 7 ones: 347");
    await audit("q-blocks");
  } else if (stem.startsWith("The blocks show 28")) {
    await press("Add a ten");
    await press("Add a one", 5);
    await press("Trade 10 ones for a ten");
  } else if (stem.startsWith("Move the marker to -3")) {
    await pg.getByRole("slider").focus();
    for (let i = 0; i < 3; i++) await pg.keyboard.press("ArrowLeft");
    await audit("q-line");
  } else if (stem.startsWith("Move the marker to 3/4")) await press("Hop forward 1/4", 3);
  else if (stem.startsWith("Shade the bar to show 3/4")) {
    await press("Shade one more part of the bar", 3);
    await audit("q-fraction");
  } else if (stem.startsWith("Shade the second bar")) await press("Shade one more part of bar 2", 3); // wrong on purpose: 3/6
  else if (stem.startsWith("Set the clock")) {
    await pg.getByRole("slider").focus();
    await pg.keyboard.press("PageUp");
    await pg.keyboard.press("PageUp");
    for (let i = 0; i < 9; i++) await pg.keyboard.press("ArrowRight");
    await audit("q-clock");
  } else if (stem.startsWith("Make 68")) {
    await press("Add a quarter", 2);
    await press("Add a dime");
    await press("Add a nickel");
    await press("Add a penny", 3);
    await audit("q-coins");
  } else if (stem.startsWith("Make 41")) await press("Add a dime", 4); // wrong on purpose: 40¢
  else problems.push(`unknown question: ${stem}`);
}

async function quiz(n, wrong) {
  for (let i = 0; i < n; i++) {
    const stem = (await pg.locator(".q-stem").first().textContent()) ?? "";
    check(`check waits for an answer: ${stem.slice(0, 20)}`, await btn("Check answer").isDisabled().catch(() => true));
    await answer(stem);
    await btn("Check answer").click();
    await pg.waitForTimeout(400);
    const verdict = (await pg.locator(".verdict").textContent()) ?? "";
    const shouldFail = wrong.some((w) => stem.startsWith(w));
    check(`${shouldFail ? "wrong" : "right"}: ${stem.slice(0, 30)} (${verdict})`, shouldFail ? verdict.startsWith("Not quite") : verdict === "Correct");
    if (shouldFail) {
      check("solution drawn", (await pg.locator(".model-solution svg").count()) === 1);
      await audit(`feedback-${i}`);
    }
    if (i < n - 1) {
      await btn(/^Next$/).click();
      await pg.waitForTimeout(300);
    }
  }
  await btn("See results").click();
  await pg.waitForTimeout(800);
}
await quiz(6, []);
await audit("results1");

// Lesson 2: fractions, clock, coins; two wrong answers to see the review.
await pg.goto(B);
await pg.waitForTimeout(1200);
await pg.getByRole("button", { name: /^Demo: Math models/ }).first().click();
await pg.waitForTimeout(600);
await btn(/^Lessons$/).click();
await pg.getByRole("button", { name: /Fractions, time and money/ }).first().click();
await pg.waitForTimeout(1500);
check("four models in lesson 2", (await pg.locator("figure.manip .mp").count()) === 4);
const bars = pg.locator("figure.manip").first();
await bars.getByRole("button", { name: "Shade one more part of bar 2" }).click();
await bars.getByRole("button", { name: "Shade one more part of bar 2" }).click();
check("compare announced", ((await bars.locator("[aria-live]").textContent()) ?? "").endsWith("1/2 is equal to 2/4"));
await audit("lesson2");
await btn(/Take the quiz/).click();
await pg.waitForTimeout(800);
await quiz(5, ["Shade the second bar", "Make 41"]);
const res = (await pg.locator("body").innerText()).replace(/\s+/g, " ");
check(`results 3 of 5: ${res.slice(0, 160)}`, res.includes("3 of 5") || res.includes("60%"));
check("review shows learner's coins", res.includes("4 dimes: 40¢") || res.includes("4 dimes"));
await audit("results2");

// Resume: an answer given before leaving comes back.
await pg.goto(B);
await pg.waitForTimeout(1200);
await pg.getByRole("button", { name: /^Demo: Math models/ }).first().click();
await pg.waitForTimeout(600);
await btn(/^Lessons$/).click();
await pg.getByRole("button", { name: /Fractions, time and money/ }).first().click();
await pg.waitForTimeout(1000);
await btn(/Take the quiz|Retake/).click();
await pg.waitForTimeout(800);
const stem0 = (await pg.locator(".q-stem").first().textContent()) ?? "";
await answer(stem0);
const said = await live();
await pg.waitForTimeout(1200);
await pg.goto(B);
await pg.waitForTimeout(1500);
const resume = pg.getByRole("button", { name: /^Resume/ });
if (await resume.count()) {
  await resume.first().click();
  await pg.waitForTimeout(1000);
  check(`resumed answer (${said})`, (await live()) === said && !(await btn("Check answer").isDisabled()));
} else problems.push("no Resume offered");

// Bank editor: a model question written by changing the model.
await pg.goto(B);
await pg.waitForTimeout(1200);
const newBank = pg.getByRole("button", { name: /New (question )?bank/ });
if (await newBank.count()) {
  await newBank.first().click();
  await pg.waitForTimeout(800);
  await pg.getByLabel(/^Title/).first().fill("Models test");
  await btn(/^Add$/).click();
  await pg.waitForTimeout(300);
  await pg.getByLabel("Question type").selectOption({ label: "Use a math model (blocks, clock, coins…)" });
  await pg.getByLabel("Question", { exact: true }).fill("Make 30¢ with the fewest coins.");
  await pg.locator(".model-fields select").first().selectOption({ label: "Coins" });
  await pg.waitForTimeout(200);
  const fields = pg.locator(".model-fields");
  await fields.getByRole("button", { name: "Take away a quarter" }).click();
  await fields.getByRole("button", { name: "Add a dime" }).click();
  await fields.getByRole("button", { name: "Add a dime" }).click();
  await fields.getByRole("button", { name: "Add a dime" }).click();
  await fields.getByLabel("Must use the fewest coins").check();
  check("editor target text", ((await fields.innerText()) ?? "").includes("30¢ with the fewest coins"));
  await audit("editor-model");
  await btn("Save bank").click();
  await pg.waitForTimeout(600);
  check("bank saved", (await pg.locator("body").textContent()).includes("Bank saved"));
} else problems.push("no New bank button");

console.log(problems.length ? `${problems.length} problem(s):\n  ${problems.join("\n  ")}` : "manipulative walkthrough OK");
await b.close();
process.exit(problems.length ? 1 : 0);

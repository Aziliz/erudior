// End-to-end check of the question kinds, pictures, Mermaid diagrams and honors lessons, with
// axe audits. Build the demo course first (see tests/fixtures/demo-course), then:
//   npx vite --port 5182
//   node scripts/questions-walkthrough.mjs <course.json> [light|dark] [width] [shots dir]
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright");
import fs from "node:fs";
const axeSrc = fs.readFileSync(new URL("../node_modules/axe-core/axe.min.js", import.meta.url), "utf8");
const file = process.argv[2];
const scheme = process.argv[3] || "light";
const width = Number(process.argv[4] || 1280);
const shots = process.argv[5];
const b = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const ctx = await b.newContext({ viewport: { width, height: 900 }, colorScheme: scheme });
const pg = await ctx.newPage();
pg.on("dialog", (d) => d.accept());
pg.on("pageerror", (e) => console.log("PAGE ERROR", e.message));
const B = "http://localhost:5182/";
const problems = [];
const check = (name, cond) => { if (!cond) problems.push(name); };
async function audit(name) {
  await pg.waitForTimeout(400);
  // Anything sticking out past the window, outside a deliberately scrollable box.
  const ov = await pg.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const scrolls = (e) => { for (let p = e.parentElement; p && p !== document.body; p = p.parentElement) { const o = getComputedStyle(p).overflowX; if (o === "auto" || o === "scroll" || o === "hidden") return p.clientWidth < p.scrollWidth || o === "hidden"; } return false; };
    let worst = 0, what = "";
    for (const e of document.querySelectorAll("body *")) { const r = e.getBoundingClientRect(); if (r.width && r.right - vw > worst && !scrolls(e)) { worst = r.right - vw; what = `${e.tagName.toLowerCase()}.${e.className}`; } }
    return worst > 1 ? `${Math.round(worst)}px (${what})` : "";
  });
  if (ov) problems.push(`${name}: sticks out of the window by ${ov}`);
  await pg.addScriptTag({ content: axeSrc });
  const r = await pg.evaluate(async () => await window.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a","wcag2aa","wcag21a","wcag21aa","wcag22aa","wcag2aaa","best-practice"] } }));
  for (const v of r.violations) problems.push(`${name}: ${v.id} — ${v.nodes.slice(0, 2).map((n) => n.target.join(" ") + " :: " + (n.failureSummary || "").split("\n")[1]).join(" | ")}`);
  if (shots) await pg.screenshot({ path: `${shots}/q-${scheme}-${width}-${name}.png`, fullPage: true });
}
const btn = (name) => pg.getByRole("button", { name }).first();

await pg.goto(B); await pg.waitForTimeout(1500);
const [chooser] = await Promise.all([pg.waitForEvent("filechooser"), btn(/^Import$/).click()]);
await chooser.setFiles(file); await pg.waitForTimeout(1200);
await pg.getByRole("button", { name: /^Demo/ }).first().click(); await pg.waitForTimeout(800);
await btn(/^Lessons$/).click(); await pg.waitForTimeout(400);
check("core module counts core lessons only", (await pg.locator(".module").first().textContent()).includes("0/1 done"));
check("optional honors noted", (await pg.locator(".module").first().textContent()).includes("plus 1 optional honors lesson"));
check("honors module pill", await pg.locator(".module").nth(1).locator(".pill.honors").count() === 1);
await audit("lessons");

await pg.getByRole("button", { name: /Core lesson/ }).first().click(); await pg.waitForTimeout(2500);
check("lesson image shown", await pg.locator(".lesson-body img[alt^='A round cell']").count() === 1);
check("diagram drawn", await pg.locator("figure.diagram.drawn svg").count() === 1);
check("diagram has accessible title", (await pg.locator("figure.diagram svg title").textContent().catch(() => "")) === "Light to sugar");
await audit("lesson");
// Theme change redraws the diagram in the new colors.
const fill1 = await pg.locator("figure.diagram svg .node rect, figure.diagram svg .node polygon").first().evaluate((e) => getComputedStyle(e).fill);
await pg.evaluate((t) => document.documentElement.setAttribute("data-theme", t), scheme === "dark" ? "light" : "dark");
await pg.waitForTimeout(1500);
const fill2 = await pg.locator("figure.diagram svg .node rect, figure.diagram svg .node polygon").first().evaluate((e) => getComputedStyle(e).fill);
check(`diagram redrawn for theme (${fill1} -> ${fill2})`, fill1 !== fill2);
await pg.evaluate(() => document.documentElement.removeAttribute("data-theme"));
await pg.waitForTimeout(1200);

await btn(/Take the quiz/).click(); await pg.waitForTimeout(800);
const seen = new Set();
for (let i = 0; i < 6; i++) {
  const stem = (await pg.locator(".q-stem").first().textContent()) ?? "";
  if (stem.startsWith("Which are organelles")) {
    seen.add("multi");
    await pg.getByRole("checkbox", { name: /Nucleus/ }).click();
    await pg.getByRole("checkbox", { name: /Mitochondrion/ }).click();
  } else if (stem.startsWith("The powerhouse")) {
    seen.add("text1");
    await pg.getByRole("textbox", { name: "Your answer" }).fill("Mitochondria.");
  } else if (stem.startsWith("DNA is made")) {
    seen.add("text2");
    await pg.getByRole("textbox", { name: "Blank 1" }).fill("nucleotides");
    await pg.getByRole("textbox", { name: "Blank 2" }).fill("Thymine");
    await audit("text-question");
  } else if (stem.startsWith("Match each")) {
    seen.add("match");
    await pg.getByLabel("Ribosome").selectOption({ label: "Builds proteins" });
    await pg.getByLabel("Mitochondrion").selectOption({ label: "Releases energy from food" });
    await pg.getByLabel("Nucleus").selectOption({ label: "Stores DNA" });
    await audit("match-question");
  } else if (stem.startsWith("Put the phases")) {
    seen.add("order");
    const want = ["Prophase", "Metaphase", "Anaphase", "Telophase"];
    for (let guard = 0; guard < 20; guard++) {
      const cur = await pg.locator(".order-text").allTextContents();
      const k = cur.findIndex((x, j) => x !== want[j]);
      if (k < 0) break;
      const at = cur.indexOf(want[k]);
      await pg.getByRole("button", { name: `Move "${want[k]}" up` }).click();
      await pg.waitForTimeout(60);
      const focused = await pg.evaluate(() => document.activeElement?.getAttribute("aria-label") ?? "");
      if (at - 1 > 0) check(`focus stays on the moved item (${focused})`, focused.includes(want[k]));
    }
    await audit("order-question");
  } else if (stem.startsWith("Label the parts")) {
    seen.add("label");
    check("label markers shown", await pg.locator(".q-image .q-marker").count() === 2);
    await pg.getByLabel("Part 1").selectOption({ label: "Nucleus" });
    await pg.getByLabel("Part 2").selectOption({ label: "Mitochondrion" });
    await audit("label-question");
  }
  await btn("Check answer").click(); await pg.waitForTimeout(400);
  const verdict = (await pg.locator(".verdict").textContent()) ?? "";
  if (stem.startsWith("DNA is made")) {
    check("text: wrong blank marked", verdict.startsWith("Not quite") && (await pg.locator(".text-answer.is-wrong").count()) === 1);
    await audit("text-feedback");
  } else check(`correct: ${stem.slice(0, 30)} (${verdict})`, verdict === "Correct");
  if (stem.startsWith("Put the phases")) await audit("order-feedback");
  if (i < 5) { await btn(/^Next$/).click(); await pg.waitForTimeout(300); }
}
check(`all kinds seen (${[...seen]})`, seen.size === 6);
await btn("See results").click(); await pg.waitForTimeout(800);
const resText = (await pg.locator("body").innerText()).replace(/\s+/g, " ");
check(`results 5 of 6: ${resText.slice(0, 200)}`, resText.includes("5 of 6") || resText.includes("83%"));
await audit("results");

// Bank editor: write a match question and an order question.
await pg.goto(B); await pg.waitForTimeout(1200);
const newBank = pg.getByRole("button", { name: /New (question )?bank/ });
if (await newBank.count()) {
  await newBank.first().click(); await pg.waitForTimeout(800);
  await pg.getByLabel(/^Title/).first().fill("Kinds test");
  await btn(/^Add$/).click(); await pg.waitForTimeout(300);
  await pg.getByLabel("Question type").selectOption({ label: "Match" });
  await pg.getByLabel("Question", { exact: true }).fill("Match the organelle");
  await pg.getByLabel("Pair 1 left").fill("Ribosome");
  await pg.getByLabel("Pair 1 match").fill("Proteins");
  await pg.getByLabel("Pair 2 left").fill("Nucleus");
  await pg.getByLabel("Pair 2 match").fill("DNA");
  await audit("editor-match");
  await btn(/^Add$/).click(); await pg.waitForTimeout(300);
  await pg.getByLabel("Question type").selectOption({ label: "Put in order" });
  await pg.getByLabel("Question", { exact: true }).fill("Order these");
  for (const [k, v] of [["Item 1", "One"], ["Item 2", "Two"], ["Item 3", "Three"]]) await pg.getByRole("textbox", { name: k, exact: true }).fill(v);
  await btn("Save bank").click(); await pg.waitForTimeout(600);
  check("bank saved", (await pg.locator("body").textContent()).includes("Bank saved"));
  await audit("editor-order");
} else problems.push("no New bank button found (editor not tested)");

console.log(problems.length ? problems.join("\n") : `questions walkthrough OK (${scheme}, ${width}px)`);
await b.close();
process.exit(problems.length ? 1 : 0);

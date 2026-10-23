// Visits every lesson of a catalog course and checks it: axe (WCAG 2.2 AA + AAA + best
// practice), nothing sticking out of the window, every picture loaded, every Mermaid diagram
// drawn. Then opens a few lesson quizzes and audits each question shown.
//   npx vite --port 5182
//   node scripts/course-audit.mjs "Biology" [light|dark] [width] [quizzes=4]
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright");
import fs from "node:fs";
const axeSrc = fs.readFileSync(new URL("../node_modules/axe-core/axe.min.js", import.meta.url), "utf8");
const title = process.argv[2];
const scheme = process.argv[3] || "light";
const width = Number(process.argv[4] || 1280);
const quizzes = Number(process.argv[5] || 4);
const b = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const ctx = await b.newContext({ viewport: { width, height: 900 }, colorScheme: scheme });
const pg = await ctx.newPage();
pg.on("dialog", (d) => d.accept());
pg.on("pageerror", (e) => problems.push(`page error: ${e.message}`));
const B = "http://localhost:5182/";
const problems = [];
async function audit(name) {
  await pg.waitForTimeout(300);
  const ov = await pg.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const scrolls = (e) => { for (let p = e.parentElement; p && p !== document.body; p = p.parentElement) { const o = getComputedStyle(p).overflowX; if (o === "auto" || o === "scroll" || o === "hidden") return true; } return false; };
    let worst = 0, what = "";
    for (const e of document.querySelectorAll("body *")) { const r = e.getBoundingClientRect(); if (r.width && r.right - vw > worst && !scrolls(e)) { worst = r.right - vw; what = `${e.tagName.toLowerCase()}.${e.className}`; } }
    return worst > 1 ? `${Math.round(worst)}px (${what})` : "";
  });
  if (ov) problems.push(`${name}: sticks out by ${ov}`);
  await pg.addScriptTag({ content: axeSrc });
  const r = await pg.evaluate(async () => await window.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a","wcag2aa","wcag21a","wcag21aa","wcag22aa","wcag2aaa","best-practice"] } }));
  for (const v of r.violations) problems.push(`${name}: ${v.id} — ${v.nodes.slice(0, 2).map((n) => n.target.join(" ") + " :: " + (n.failureSummary || "").split("\n")[1]).join(" | ")}`);
}

await pg.goto(B); await pg.waitForTimeout(1500);
await pg.fill('[aria-label="Search courses"]', title); await pg.waitForTimeout(300);
await pg.getByRole("button", { name: new RegExp(`^${title}\\b.*view overview`) }).first().click(); await pg.waitForTimeout(500);
await audit("overview");
await pg.getByRole("button", { name: "Start course" }).first().click(); await pg.waitForTimeout(2000);
await pg.getByRole("button", { name: /^Lessons$/ }).first().click(); await pg.waitForTimeout(500);
await audit("lessons-tab");
const n = await pg.locator(".lesson-row > button:first-child").count();
let diagrams = 0, images = 0;
for (let i = 0; i < n; i++) {
  if (!(await pg.getByRole("button", { name: /^Lessons$/ }).count())) { await pg.locator("button.back").first().click(); await pg.waitForTimeout(500); }
  await pg.getByRole("button", { name: /^Lessons$/ }).first().click(); await pg.waitForTimeout(300);
  const row = pg.locator(".lesson-row > button:first-child").nth(i);
  const name = ((await row.locator(".lesson-title").textContent()) ?? `lesson ${i + 1}`).trim();
  await row.click(); await pg.waitForTimeout(600);
  const want = await pg.locator("figure.diagram").count();
  if (want) await pg.waitForFunction((k) => document.querySelectorAll("figure.diagram.drawn, figure.diagram.failed").length >= k, want, { timeout: 20000 }).catch(() => {});
  const st = await pg.evaluate(() => ({
    failed: document.querySelectorAll("figure.diagram.failed").length,
    drawn: document.querySelectorAll("figure.diagram.drawn").length,
    imgs: [...document.querySelectorAll(".lesson-body img")].map((i) => i.complete && i.naturalWidth > 0),
  }));
  diagrams += st.drawn; images += st.imgs.length;
  if (st.failed || st.drawn < want) problems.push(`${name}: ${want - st.drawn} diagram(s) not drawn`);
  if (st.imgs.some((x) => !x)) problems.push(`${name}: a picture didn't load`);
  await audit(name.slice(0, 40));
  const step = Math.max(1, Math.floor(n / Math.max(1, quizzes)));
  if (quizzes > 0 && i % step === 0 && i / step < quizzes) {
    const take = pg.getByRole("button", { name: /Take the quiz|Retake the quiz/ });
    if (await take.count()) {
      await take.first().click(); await pg.waitForTimeout(600);
      const total = await pg.locator(".sheet-grid .cell").count();
      for (let k = 0; k < total; k++) {
        const kind = (await pg.locator(".q-type").textContent().catch(() => "")) || "choice";
        await audit(`${name.slice(0, 24)} q${k + 1} (${kind.trim()})`);
        if (k < total - 1) await pg.keyboard.press("ArrowRight");
        await pg.waitForTimeout(150);
      }
      await pg.getByRole("button", { name: /Save & exit/ }).click(); await pg.waitForTimeout(400);
    }
  }
}
console.log(`${n} lessons, ${diagrams} diagrams drawn, ${images} pictures (${scheme}, ${width}px)`);
console.log(problems.length ? [...new Set(problems)].join("\n") : "no problems");
await b.close();
process.exit(problems.length ? 1 : 0);

// Accessibility audit: runs axe-core (WCAG 2.2 A/AA, WCAG 2 AAA, best practice) on the main screens
// and reports horizontal overflow (reflow). Needs the dev server (npx vite --port 5179) and Playwright.
//   node scripts/a11y-audit.mjs [light|dark] [viewport width]
// PLAYWRIGHT_MODULE / CHROMIUM_PATH override where Playwright and Chromium are found.
const pw = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright");
const { chromium } = pw.chromium ? pw : pw.default;
import fs from "node:fs";
const axeSrc = fs.readFileSync(new URL("../node_modules/axe-core/axe.min.js", import.meta.url), "utf8");
const scheme = process.argv[2] || "light";
const width = Number(process.argv[3] || 1280);
const b = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const ctx = await b.newContext({ viewport: { width, height: 900 }, colorScheme: scheme });
const pg = await ctx.newPage();
pg.on("dialog", (d) => d.accept());
const B = "http://localhost:5179/";
const results = {};
async function audit(name) {
  await pg.waitForTimeout(500);
  const ov = await pg.evaluate(() => { const m = document.querySelector(".main") || document.scrollingElement; return m.scrollWidth - m.clientWidth; });
  if (ov > 1) { results[`reflow-overflow`] ??= { help: "horizontal scroll", pages: new Set(), samples: [] }; results["reflow-overflow"].pages.add(`${name} (+${ov}px)`); }
  await pg.addScriptTag({ content: axeSrc });
  const r = await pg.evaluate(async () => await window.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a","wcag2aa","wcag21a","wcag21aa","wcag22aa","wcag2aaa","best-practice"] } }));
  for (const v of r.violations) {
    const k = `${v.id} [${v.impact}]`;
    results[k] ??= { help: v.help, pages: new Set(), samples: [] };
    results[k].pages.add(name);
    for (const n of v.nodes.slice(0, 3)) if (results[k].samples.length < 6) results[k].samples.push(`${name}: ${n.target.join(" ")} :: ${(n.failureSummary||"").split("\n").slice(1,2).join(" ").slice(0,160)}`);
  }
}
const click = async (role, name) => { await pg.getByRole(role, { name }).first().click(); await pg.waitForTimeout(400); };
await pg.goto(B); await pg.waitForTimeout(1500);
await audit("library");
// Start German A1 and Algebra 1
for (const t of ["German A1", "Algebra 1"]) {
  await pg.fill('[aria-label="Search courses"]', t); await pg.waitForTimeout(300);
  await pg.getByRole("button", { name: new RegExp("^" + t + "\\b.*view overview") }).first().click(); await pg.waitForTimeout(400);
  if (t === "German A1") await audit("overview");
  await click("button", "Start course"); await pg.waitForTimeout(1200);
  await pg.goto(B); await pg.waitForTimeout(1200);
}
await audit("library-with-courses");
await click("button", "Display"); await audit("display-menu"); await pg.keyboard.press("Escape");
// German course tabs
await pg.fill('[aria-label="Search courses"]', "German A1"); await pg.waitForTimeout(300);
await pg.getByRole("button", { name: /German A1\b.*open course/ }).first().click(); await pg.waitForTimeout(800);
for (const tab of ["Today", "Lessons", "Questions", "Vocabulary", "Glossary", "Quick reference", "Reading list"]) { await click("button", tab); await audit(`de-${tab}`); }
await click("button", "Lessons"); await pg.locator("text=Greetings and introductions").last().click(); await audit("lesson");
await click("button", "Practice these words"); await audit("vocab-runner");
await pg.fill("#vocab-answer", "x"); await pg.keyboard.press("Enter"); await audit("vocab-result");
await pg.goto(B); await pg.waitForTimeout(1200);
await pg.fill('[aria-label="Search courses"]', "Algebra 1"); await pg.waitForTimeout(300);
await pg.getByRole("button", { name: /Algebra 1\b.*open course/ }).first().click(); await pg.waitForTimeout(800);
await click("button", "Math drills"); await audit("drills-tab");
await pg.getByRole("button", { name: /Practice|Start/ }).first().click().catch(()=>{}); await audit("drill-runner");
await pg.goto(B); await pg.waitForTimeout(1200);
await pg.fill('[aria-label="Search courses"]', "Algebra 1"); await pg.waitForTimeout(300);
await pg.getByRole("button", { name: /Algebra 1\b.*open course/ }).first().click(); await pg.waitForTimeout(800);
await click("button", "Questions"); await audit("questions-tab");
await pg.getByRole("button", { name: /Practice|Start practice/ }).first().click().catch(()=>{}); await audit("practice-runner");
await click("button", "Notecards"); await audit("cards-tab").catch(()=>{});
await pg.goto(B); await pg.waitForTimeout(1200);
await click("button", "Progress"); await audit("progress");
await pg.fill('[aria-label="Search everything"]', "slope"); await pg.keyboard.press("Enter"); await audit("search");
const out = Object.entries(results).map(([k, v]) => `${k} — ${v.help}\n  pages: ${[...v.pages].join(", ")}\n  ${v.samples.join("\n  ")}`).join("\n\n");
console.log(out || "no violations");
await b.close();

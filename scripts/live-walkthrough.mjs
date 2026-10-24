// End-to-end check of the Live room: a parent hosts from the desktop app, two students join in
// their browsers. Needs the API (cd worker && npm run dev) and
//   VITE_HOMESCHOOL=1 VITE_COMMUNITY_API=http://localhost:8787 npx vite --port 5181
//   node scripts/live-walkthrough.mjs [light|dark] [width] [shots dir]
const pw = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright");
const { chromium } = pw.chromium ? pw : pw.default;
import fs from "node:fs";
const axeSrc = fs.readFileSync(new URL("../node_modules/axe-core/axe.min.js", import.meta.url), "utf8");
const scheme = process.argv[2] || "light";
const width = Number(process.argv[3] || 1280);
const shots = process.argv[4];
const b = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const B = "http://localhost:5181/";
const problems = [];
const check = (name, cond) => { if (!cond) problems.push(name); };
async function page(w = width) {
  const ctx = await b.newContext({ viewport: { width: w, height: 900 }, colorScheme: scheme });
  const pg = await ctx.newPage();
  pg.on("dialog", (d) => d.accept());
  pg.on("pageerror", (e) => console.log("PAGE ERROR", e.message));
  return pg;
}
async function audit(pg, name) {
  await pg.waitForTimeout(400);
  const ov = await pg.evaluate(() => { const m = document.querySelector(".main") || document.scrollingElement; return m.scrollWidth - m.clientWidth; });
  if (ov > 1) problems.push(`${name}: horizontal overflow ${ov}px`);
  await pg.addScriptTag({ content: axeSrc });
  const r = await pg.evaluate(async () => await window.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a","wcag2aa","wcag21a","wcag21aa","wcag22aa","wcag2aaa","best-practice"] } }));
  for (const v of r.violations) problems.push(`${name}: ${v.id} — ${v.nodes.slice(0, 2).map((n) => n.target.join(" ")).join(" | ")}`);
  if (shots) await pg.screenshot({ path: `${shots}/l-${scheme}-${width}-${name}.png`, fullPage: true });
}
const btn = (pg, name) => pg.getByRole("button", { name }).first();

// Host: a homeschool family with a course started.
const h = await page();
await h.goto(B); await h.waitForTimeout(1500);
await btn(h, "Homeschool or classroom").click(); await h.waitForTimeout(300);
await h.getByRole("combobox", { name: /^State/ }).selectOption("CO");
await h.getByLabel("Name").first().fill("Ada");
await h.getByLabel("Password (8 characters or more)").fill("parent pass");
await h.getByLabel("Type it again").fill("parent pass");
await btn(h, "Set up homeschool").click(); await h.waitForTimeout(2500);
await btn(h, "I've written it down").click(); await h.waitForTimeout(1000);
await h.fill('[aria-label="Search courses"]', "Algebra 1"); await h.waitForTimeout(300);
await h.getByRole("button", { name: /Algebra 1\b.*view overview/ }).first().click(); await h.waitForTimeout(300);
await btn(h, "Start course").click(); await h.waitForTimeout(1500);
await btn(h, /^Parent$/).click(); await h.waitForTimeout(300);
await h.getByLabel("Parent password").fill("parent pass"); await btn(h, /^Open$/).click(); await h.waitForTimeout(1200);
await btn(h, /^Live room$/).click(); await h.waitForTimeout(500);
await h.getByLabel(/^How many/).fill("2");
await audit(h, "host-setup");
await btn(h, "Open the room").click(); await h.waitForTimeout(1500);
const code = (await h.locator(".live-code").textContent())?.trim();
check("room code shown", /^[A-Z0-9]{6}$/.test(code ?? ""));
await audit(h, "host-lobby-empty");

// Two students.
const p1 = await page(390);
const p2 = await page(390);
await p1.goto(`${B}?live=${code}`); await p1.waitForTimeout(1200);
check("code prefilled", (await p1.getByLabel("Room code").inputValue()) === code);
await audit(p1, "player-join");
await p1.getByLabel("Nickname").fill("Ana"); await btn(p1, /^Join$/).click(); await p1.waitForTimeout(800);
await p2.goto(B); await p2.waitForTimeout(1200);
await btn(p2, "Join a live room").click(); await p2.waitForTimeout(300);
await p2.getByLabel("Room code").fill(code.toLowerCase());
await p2.getByLabel("Nickname").fill("ana"); await btn(p2, /^Join$/).click(); await p2.waitForTimeout(800);
check("duplicate nickname refused", (await p2.getByRole("alert").textContent())?.includes("taken"));
await p2.getByLabel("Nickname").fill("Ben"); await btn(p2, /^Join$/).click(); await p2.waitForTimeout(800);
check("players in lobby", (await p1.locator(".live-big").textContent())?.includes("Waiting for the host"));
await h.waitForTimeout(500);
check("host sees both", (await h.locator(".live-players li").count()) === 2);
await audit(h, "host-lobby");

for (let q = 0; q < 2; q++) {
  await btn(h, q === 0 ? /Start with question 1/ : /Next question/).click(); await h.waitForTimeout(800);
  check(`q${q + 1} shown to player`, (await p1.locator(".live-stem").count()) === 1);
  if (q === 0) { await audit(p1, "player-question"); await audit(h, "host-question"); }
  // Single-answer questions are buttons; multi-answer ones are checkboxes plus Send.
  for (const [pg, pick] of [[p1, 0], [p2, 1]]) {
    const boxes = pg.locator(".live-choice input[type=checkbox]");
    if (await boxes.count()) { await boxes.nth(pick).check(); await btn(pg, "Send answer").click(); }
    else await pg.locator("button.live-choice").nth(pick).click();
    await pg.waitForTimeout(300);
  }
  await h.waitForTimeout(800);
  check(`q${q + 1} revealed when all answered`, (await p1.locator(".live-totals").count()) === 1 && (await h.locator(".live-totals").count()) === 1);
  const txt = await p1.locator(".live-stage").textContent();
  check(`q${q + 1} no names on player screen`, !txt?.includes("Ben"));
  if (q === 0) { await audit(p1, "player-reveal"); await audit(h, "host-reveal"); }
}
await btn(h, "Finish the quiz").click(); await h.waitForTimeout(800);
check("players see their result", (await p2.locator(".live-big").textContent())?.startsWith("Finished!"));
check("host summary", (await h.getByRole("heading", { name: "Finished" }).count()) === 1 && (await h.locator("table").nth(1).textContent())?.includes("Ana"));
await audit(h, "host-summary");
await btn(h, "Close room").click(); await h.waitForTimeout(1000);
check("players told the room closed", (await p1.getByRole("status").first().textContent())?.includes("closed"));
check("host back to setup", (await btn(h, "Open the room").count()) === 1);

console.log(problems.length ? problems.join("\n") : `live walkthrough ${scheme} ${width}: all good`);
await b.close();

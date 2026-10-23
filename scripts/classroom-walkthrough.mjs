// End-to-end check of Classroom mode: a teacher's computer and a student's own device.
//   VITE_HOMESCHOOL=1 npx vite --port 5181
//   node scripts/classroom-walkthrough.mjs [light|dark] [width] [shots dir]
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright");
import fs from "node:fs";
const axeSrc = fs.readFileSync(new URL("../node_modules/axe-core/axe.min.js", import.meta.url), "utf8");
const scheme = process.argv[2] || "light";
const width = Number(process.argv[3] || 1280);
const shots = process.argv[4];
const b = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const B = "http://localhost:5181/";
const problems = [];
const check = (name, cond) => { if (!cond) problems.push(name); };
async function page() {
  const ctx = await b.newContext({ viewport: { width, height: 900 }, colorScheme: scheme, acceptDownloads: true });
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
  if (shots) await pg.screenshot({ path: `${shots}/k-${scheme}-${width}-${name}.png`, fullPage: true });
}
const btn = (pg, name) => pg.getByRole("button", { name }).first();
async function takeEmptyQuiz(pg) {
  await btn(pg, /^Lessons/).click(); await pg.waitForTimeout(300);
  await pg.locator(".lesson-row button").first().click(); await pg.waitForTimeout(600);
  await btn(pg, /Take the quiz/).click(); await pg.waitForTimeout(600);
  await pg.locator(".choices .choice").first().click(); await pg.waitForTimeout(200);
  const check = pg.getByRole("button", { name: /Check answer/ });
  if (await check.count()) { await check.first().click(); await pg.waitForTimeout(200); }
  await btn(pg, /Finish quiz/).click(); await pg.waitForTimeout(1200);
  if (shots) await pg.screenshot({ path: `${shots}/k-quiz-result.png` });
}

// ---------- teacher ----------
const t = await page();
await t.goto(B); await t.waitForTimeout(1500);
await btn(t, "Homeschool or classroom").click(); await t.waitForTimeout(300);
await t.getByLabel(/^Classroom/).check();
await t.getByLabel(/^Your name/).fill("Ms. Ruiz");
await t.getByLabel(/^School/).fill("Lincoln Middle School");
await t.getByLabel("First class name").fill("Period 3 Algebra");
await t.getByRole("combobox", { name: /^Grade/ }).selectOption("8");
await t.getByLabel(/^Students, one name per line/).fill("Ana\nBen");
await t.getByLabel("Password (8 characters or more)").fill("teacher pass");
await t.getByLabel("Type it again").fill("teacher pass");
await audit(t, "setup");
await btn(t, "Set up the classroom").click(); await t.waitForTimeout(2500);
await btn(t, "I've written it down").click(); await t.waitForTimeout(1000);
check("teacher area opens on Classes", (await t.getByRole("heading", { name: "Teacher area" }).count()) === 1);
await t.getByRole("combobox", { name: /^Course/ }).selectOption("math-algebra1");
await t.getByLabel(/^Due/).fill("2026-10-20");
await btn(t, /^Assign$/).click(); await t.waitForTimeout(400);
await audit(t, "classes");
const dlClass = t.waitForEvent("download");
await btn(t, "Save class file for students' devices").click();
const classPath = await (await dlClass).path();
const classJson = JSON.parse(fs.readFileSync(classPath, "utf8"));
check("class file has roster + assignment", classJson.format === "erudior-class" && classJson.students.length === 2 && classJson.assignments[0].due === "2026-10-20");
await btn(t, /^Lock$/).click(); await t.waitForTimeout(500);
check("picker grouped by class", (await t.getByRole("heading", { name: "Period 3 Algebra" }).count()) === 1);
await audit(t, "who");
await t.getByRole("button", { name: "Ana", exact: true }).click(); await t.waitForTimeout(800);
check("Ana sees assignment, past due", (await t.locator(".assigned-row").first().textContent())?.includes("Was due"));
await t.fill('[aria-label="Search courses"]', "German A1"); await t.waitForTimeout(300);
check("unassigned locked", (await t.getByRole("button", { name: /Not assigned in your class/ }).count()) === 1);
await t.fill('[aria-label="Search courses"]', ""); await t.waitForTimeout(200);
await audit(t, "library-ana");
await t.locator(".assigned-row").first().getByRole("button", { name: /Start/ }).click(); await t.waitForTimeout(1500);
await takeEmptyQuiz(t);

// ---------- student on their own device ----------
const s = await page();
await s.goto(B); await s.waitForTimeout(1500);
// A device without a family shows "Join a class" in the Library.
const fc = s.waitForEvent("filechooser");
await btn(s, "Join a class").click();
await (await fc).setFiles(classPath); await s.waitForTimeout(500);
await s.getByRole("combobox", { name: /Which one is you/ }).selectOption({ label: "Ben" });
await btn(s, "Join class").click(); await s.waitForTimeout(500);
check("joined", (await s.getByRole("heading", { name: /Period 3 Algebra/ }).count()) === 1);
await audit(s, "student-device");
await s.locator(".assigned-row").first().getByRole("button", { name: /Start/ }).click(); await s.waitForTimeout(2000);
await takeEmptyQuiz(s);
await btn(s, /^Library$/).click(); await s.waitForTimeout(800);
const dlHand = s.waitForEvent("download");
await btn(s, /Hand in work/).click();
const handPath = await (await dlHand).path();
const hand = JSON.parse(fs.readFileSync(handPath, "utf8"));
check("hand-in has Ben's quiz", hand.format === "erudior-handin" && hand.studentName === "Ben" && hand.progress.attempts.length === 1);
// A tampered copy.
const bad = { ...hand, progress: { ...hand.progress, attempts: hand.progress.attempts.map((a) => ({ ...a, correct: a.total })) } };
const badPath = `${handPath}.bad.json`;
fs.writeFileSync(badPath, JSON.stringify(bad));

// ---------- teacher imports ----------
await btn(t, /^Teacher$/).click(); await t.waitForTimeout(300);
await t.getByLabel("Teacher password").fill("teacher pass"); await btn(t, /^Open$/).click(); await t.waitForTimeout(1200);
await btn(t, /^Hand-ins$/).click(); await t.waitForTimeout(300);
for (const p of [badPath, handPath]) {
  const fc2 = t.waitForEvent("filechooser");
  await btn(t, /Import a hand-in file/).click();
  await (await fc2).setFiles(p); await t.waitForTimeout(1200);
}
const logText = await t.locator("main section[aria-live='polite']").textContent();
check("tampered refused, real one imported", logText?.includes("Refused") && logText?.includes("Imported: Ben"));
await audit(t, "handins");
await btn(t, /^Gradebook$/).click(); await t.waitForTimeout(1000);
const gb = await t.locator("table.gradebook").textContent();
check("gradebook shows both students with grades and past due", gb?.includes("Ana") && gb?.includes("Ben") && (gb?.match(/\d+% [A-F][+-]?/g) ?? []).length === 2 && gb?.includes("past due"));
await audit(t, "gradebook");
const dlCsv = t.waitForEvent("download");
await btn(t, /Download gradebook/).click();
check("gradebook csv", fs.readFileSync(await (await dlCsv).path(), "utf8").startsWith('"Student","Algebra 1 %"'));
await btn(t, /^Overview$/).click(); await t.waitForTimeout(800);
await audit(t, "overview");
await btn(t, /^Reports$/).click(); await t.waitForTimeout(800);
check("classroom reports limited", (await t.getByRole("combobox", { name: /^Report/ }).locator("option").count()) === 2);
check("report card signed by teacher", (await t.locator("article.doc").textContent())?.includes("Ms. Ruiz, teacher"));

console.log(problems.length ? problems.join("\n") : `classroom walkthrough ${scheme} ${width}: all good`);
await b.close();

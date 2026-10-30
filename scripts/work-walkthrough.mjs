// End-to-end check of writing assignments, labs and activity logs, with axe on each screen.
//   web:  npm run build && npx vite preview --port 5291   →  node scripts/work-walkthrough.mjs web [light|dark] [width] [shots dir]
//   home: VITE_HOMESCHOOL=1 npx vite --port 5292          →  node scripts/work-walkthrough.mjs home [light|dark] [width] [shots dir]
// "web" is the website on its own (no family: Mark as finished); "home" sets up a homeschool
// family, hands work in, grades it in the Parent area and checks grades, hours and the portfolio.
const pw = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright");
const { chromium } = pw.chromium ? pw : pw.default;
import fs from "node:fs";
import { createRequire } from "node:module";
const axeSrc = fs.readFileSync(createRequire(import.meta.url).resolve("axe-core/axe.min.js"), "utf8");
const mode = process.argv[2] || "web";
const scheme = process.argv[3] || "light";
const width = Number(process.argv[4] || 1280);
const shots = process.argv[5];
const B = mode === "home" ? "http://localhost:5292/" : "http://localhost:5291/";
const demo = new URL("../samples/demo-student-work.json", import.meta.url).pathname;

const b = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const ctx = await b.newContext({ viewport: { width, height: 900 }, colorScheme: scheme, acceptDownloads: true });
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
    const m = document.querySelector(".main") || document.scrollingElement;
    return m.scrollWidth - m.clientWidth;
  });
  if (ov > 1) problems.push(`${name}: horizontal overflow ${ov}px`);
  await pg.addScriptTag({ content: axeSrc });
  const r = await pg.evaluate(async () => await window.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "wcag2aaa", "best-practice"] } }));
  for (const v of r.violations) problems.push(`${name}: ${v.id} — ${v.nodes.slice(0, 2).map((n) => n.target.join(" ") + " :: " + (n.failureSummary || "").split("\n")[1]).join(" | ")}`);
  if (shots) {
    // The app scrolls inside .main; let the page grow so the full-page shot shows everything.
    await pg.addStyleTag({ content: "html,body,#root,.shell,.main{height:auto!important;overflow:visible!important}" });
    await pg.screenshot({ path: `${shots}/work-${mode}-${scheme}-${width}-${name}.png`, fullPage: true });
  }
}
const btn = (name) => pg.getByRole("button", { name }).first();
const main = () => pg.locator("main");

process.on("uncaughtException", (e) => {
  console.log(`STOPPED: ${e.message.split("\n")[0]}\n  ${problems.join("\n  ")}`);
  process.exit(1);
});
await pg.goto(B);
await pg.waitForTimeout(1500);

if (mode === "home") {
  await btn(/^Homeschool or classroom$/).click();
  await pg.waitForTimeout(300);
  await pg.getByLabel(/^State/).selectOption("CO");
  await pg.getByLabel("Name").first().fill("Ada");
  await pg.getByLabel(/^Grade/).first().selectOption("4");
  await pg.getByLabel("Password (8 characters or more)").fill("correct horse");
  await pg.getByLabel("Type it again").fill("correct horse");
  await btn("Set up homeschool").click();
  await pg.waitForTimeout(3000);
  await btn("I've written it down").click();
  await pg.waitForTimeout(1000);
}

// Import the demo course.
const [chooser] = await Promise.all([pg.waitForEvent("filechooser"), btn(/^Import$/).click()]);
await chooser.setFiles(demo);
await pg.waitForTimeout(1200);
await pg.getByRole("button", { name: /^Demo: writing/ }).first().click();
await pg.waitForTimeout(800);
check("Assignments tab", (await pg.getByRole("button", { name: "Assignments" }).count()) === 1);

// Lesson cards.
await btn(/^Lessons$/).click();
await pg.waitForTimeout(400);
await main().getByRole("button", { name: /Writing a persuasive paragraph/ }).first().click();
await pg.waitForTimeout(800);
check("two writing cards", (await pg.locator(".assign-card").count()) === 2);
check("card status", (await pg.locator(".assign-card").first().textContent()).includes("Not started"));
await audit("lesson-cards");

// Essay: type, bold via the toolbar, autosave, self-check, hand in.
await pg.getByRole("button", { name: /Open writing assignment: Should our class/ }).click();
await pg.waitForTimeout(800);
const essay =
  "Our class should get a pet fish. First, a fish teaches us responsibility because we would take turns feeding it and cleaning the tank every week. Second, watching fish is calming, and studies show that an aquarium can help people relax before a test. Third, a fish is cheap and quiet, so it would not bother other classes or cost the school much money. For all these reasons, a pet fish would make our classroom a better place to learn.";
await pg.getByRole("textbox", { name: "Your writing" }).fill(essay);
await pg.getByRole("textbox", { name: "Your writing" }).evaluate((el) => el.setSelectionRange(4, 9));
await btn(/^B Bold$|Bold/).click();
await pg.waitForTimeout(1200);
check("bold inserted", (await pg.getByRole("textbox", { name: "Your writing" }).inputValue()).startsWith("Our **class**"));
check("word count on target", (await pg.locator(".word-count").textContent()).includes("right on target"));
check("autosaved", /Saved at/.test(await pg.locator(".save-state").textContent()));
await btn("Preview").click();
check("preview shows bold", (await pg.locator(".work-writing .student-text strong").count()) === 1);
await btn("Preview").click();
await pg.locator(".rubric-pick label").filter({ hasText: /^Excellent/ }).first().click();
await pg.locator(".rubric-pick fieldset").nth(1).locator("label").filter({ hasText: /^Excellent/ }).click();
await pg.locator(".rubric-pick fieldset").nth(2).locator("label").filter({ hasText: /^Good/ }).click();
check("self-check score", (await pg.locator(".work-rubric .panel-head").textContent()).includes("11 of 12"));
await audit("essay");
const hand = mode === "home" ? /Hand in to your parent/ : /Mark as finished/;
await btn(hand).click();
await pg.waitForTimeout(800);
check("handed in", (await pg.locator(".work-pill").textContent()).match(mode === "home" ? /waiting for your parent/ : /Finished/));
check("text locked", (await pg.getByRole("textbox", { name: "Your writing" }).count()) === 0);
await audit("essay-done");

// Lab.
await pg.goto(B);
await pg.waitForTimeout(800);
if (mode === "web") {
  await pg.getByRole("button", { name: /^Demo: writing/ }).first().click();
} else await pg.locator(".course-row").filter({ hasText: "Demo: writing" }).click();
await pg.waitForTimeout(600);
await btn("Assignments").click();
await pg.waitForTimeout(500);
await audit("assignments-tab");
await pg.getByRole("button", { name: /Start Does salt make ice/ }).click();
await pg.waitForTimeout(800);
check("safety first", (await pg.locator(".lab-safety").textContent()).includes("An adult must be with you"));
check("adult step tag", (await pg.locator(".lab-step.is-adult").count()) === 1);
for (let i = 0; i < 6; i++) await pg.locator(".lab-step input").nth(i).check();
await pg.getByLabel("Plain cube, Start").fill("Square, wet on top");
await pg.getByLabel("Salted cube, Start").fill("Square, salt sparkles");
await pg.getByLabel("Salted cube, 20 minutes").fill("Tiny, lots of water");
await pg.locator(".lab-q textarea").nth(0).fill("I guessed the salted one would melt first.");
await pg.locator(".lab-q textarea").nth(2).fill("Yes. At 20 minutes the salted cube was tiny but the plain one was still big.");
const photo = await pg.screenshot({ clip: { x: 0, y: 0, width: 400, height: 300 } });
await pg.locator('input[type="file"]').setInputFiles({ name: "plates.png", mimeType: "image/png", buffer: photo });
await pg.waitForTimeout(1500);
check("photo shown", (await pg.locator(".work-photo img").count()) === 1);
await audit("lab");
await btn(hand).click();
await pg.waitForTimeout(800);
check("lab handed in", (await pg.locator(".lab-step input:disabled").count()) === 6);

// Activity log with a picture.
await pg.goto(B);
await pg.waitForTimeout(800);
if (mode === "web") await pg.getByRole("button", { name: /^Demo: writing/ }).first().click();
else await pg.locator(".course-row").filter({ hasText: "Demo: writing" }).click();
await pg.waitForTimeout(600);
await btn("Assignments").click();
await pg.waitForTimeout(500);
await pg.getByLabel("What you did").selectOption("Biking");
await pg.getByLabel("Minutes").fill("45");
await pg.getByLabel("Notes (optional)").fill("Rode to the park");
await pg.locator("#wt-file").setInputFiles({ name: "ride.png", mimeType: "image/png", buffer: photo });
await btn("Add to the log").click();
await pg.waitForTimeout(1200);
await pg.getByLabel("Minutes").fill("20");
await btn("Add to the log").click();
await pg.waitForTimeout(1000);
check("week total", (await pg.locator(".log-week").textContent()).includes("65 of 150"));
check("entries listed", (await pg.locator(".activity-log .log-entry").count()) === 2);
await audit("log");

if (mode === "home") {
  // Hours: the log's minutes are on the student's records.
  await btn(/^Family$/).click();
  await pg.waitForTimeout(300);
  await pg.getByLabel(/password/i).first().fill("correct horse");
  await btn(/^Open$/).click();
  await pg.waitForTimeout(1200);
  await btn("Student work").click();
  await pg.waitForTimeout(800);
  check("two waiting", (await pg.locator("section").filter({ hasText: "Waiting for you" }).locator(".work-row").count()) === 2);
  check("log totals", (await pg.locator("#sw-logs").locator("..").locator("..").textContent()).includes("1 h 5 min"));
  await audit("parent-work");
  await pg.getByRole("button", { name: /Review Should our class/ }).click();
  await pg.waitForTimeout(800);
  check("student's pick marked", (await pg.locator(".rubric-theirs").count()) === 3);
  await btn("Save grade").click();
  check("needs every criterion", (await pg.getByRole("alert").textContent()).includes("every part"));
  const sets = pg.locator(".review-form fieldset");
  await sets.nth(0).locator("label").filter({ hasText: /^Excellent/ }).click();
  await sets.nth(1).locator("label").filter({ hasText: /^Good/ }).click();
  await sets.nth(2).locator("label").filter({ hasText: /^Good/ }).click();
  check("live score", (await pg.locator(".review-form .work-score").textContent()).includes("10 of 12"));
  await pg.getByLabel("Comment for Ada").fill("Strong reasons. Check your commas.");
  await audit("review");
  await btn("Save grade").click();
  await pg.waitForTimeout(1000);
  check("graded listed", (await pg.locator("section").filter({ hasText: "Graded" }).locator(".pill.pass").first().textContent()).includes("83%"));
  // Send the lab back for another draft.
  await pg.getByRole("button", { name: /Review Does salt/ }).click();
  await pg.waitForTimeout(600);
  await pg.getByLabel("Comment for Ada").fill("Please fill in the 5, 10 and 15 minute rows.");
  await btn("Ask for another draft").click();
  await pg.waitForTimeout(800);
  check("lab in progress again", (await pg.locator("section").filter({ hasText: "Still being worked on" }).count()) === 1);

  await btn("Grades").click();
  await pg.waitForTimeout(800);
  check("grade reaches course", (await main().textContent()).includes("Demo: writing"));
  await btn("Attendance and hours").click();
  await pg.waitForTimeout(800);
  check("hours include the log", /1 h 5 min|1\.1/.test(await main().textContent()));
  await btn("Reports").click();
  await pg.waitForTimeout(600);
  await pg.getByLabel(/Report/).first().selectOption("portfolio").catch(() => {});
  await pg.waitForTimeout(1500);
  const doc = await pg.locator("article.doc").textContent().catch(() => "");
  check("portfolio has the essay", doc.includes("Our class should get a pet fish") || doc.includes("pet fish"));
  check("portfolio has the log", doc.includes("Movement log"));
  await audit("portfolio");

  // The student sees the grade and the request for another draft.
  await btn("Lock").click();
  await pg.waitForTimeout(500);
  await pg.locator(".course-row").filter({ hasText: "Demo: writing" }).click();
  await pg.waitForTimeout(600);
  await btn("Assignments").click();
  await pg.waitForTimeout(600);
  check("student sees graded", (await main().textContent()).includes("Graded"));
  check("student sees revise", (await main().textContent()).includes("Needs another draft"));
  await pg.getByRole("button", { name: /Open Does salt/ }).click();
  await pg.waitForTimeout(800);
  check("feedback shown", (await pg.locator(".work-feedback").textContent()).includes("fill in the 5, 10"));
  check("editable again", (await pg.locator(".lab-step input:not(:disabled)").count()) === 6);
  await audit("revise");
}

await b.close();
console.log(problems.length ? `${problems.length} problem(s):\n  ${problems.join("\n  ")}` : `work walkthrough (${mode}, ${scheme}, ${width}) clean`);
process.exit(problems.length ? 1 : 0);

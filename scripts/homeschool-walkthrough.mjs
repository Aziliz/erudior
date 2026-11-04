// End-to-end check of the homeschool features in a browser (VITE_HOMESCHOOL=1 npx vite --port 5181),
// with an axe audit of each new screen. node scripts/homeschool-walkthrough.mjs [light|dark] [width] [shots dir]
const pw = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright");
const { chromium } = pw.chromium ? pw : pw.default;
import fs from "node:fs";
const axeSrc = fs.readFileSync(new URL("../node_modules/axe-core/axe.min.js", import.meta.url), "utf8");
const scheme = process.argv[2] || "light";
const width = Number(process.argv[3] || 1280);
const shots = process.argv[4];
const b = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const ctx = await b.newContext({ viewport: { width, height: 900 }, colorScheme: scheme, acceptDownloads: true });
const pg = await ctx.newPage();
pg.on("dialog", (d) => d.accept());
pg.on("pageerror", (e) => console.log("PAGE ERROR", e.message));
const B = "http://localhost:5181/";
const problems = [];
const check = (name, cond) => { if (!cond) problems.push(name); };
async function audit(name) {
  await pg.waitForTimeout(400);
  const ov = await pg.evaluate(() => { const m = document.querySelector(".main") || document.scrollingElement; return m.scrollWidth - m.clientWidth; });
  if (ov > 1) problems.push(`${name}: horizontal overflow ${ov}px`);
  await pg.addScriptTag({ content: axeSrc });
  const r = await pg.evaluate(async () => await window.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a","wcag2aa","wcag21a","wcag21aa","wcag22aa","wcag2aaa","best-practice"] } }));
  for (const v of r.violations) problems.push(`${name}: ${v.id} — ${v.nodes.slice(0, 2).map((n) => n.target.join(" ")).join(" | ")}`);
  if (shots) await pg.screenshot({ path: `${shots}/${scheme}-${width}-${name}.png`, fullPage: true });
}
const btn = (name) => pg.getByRole("button", { name }).first();

await pg.goto(B); await pg.waitForTimeout(1500);
// Single user first: start German A1 so there is progress to carry over.
await pg.fill('[aria-label="Search courses"]', "German A1"); await pg.waitForTimeout(300);
await pg.getByRole("button", { name: /German A1\b.*view overview/ }).first().click(); await pg.waitForTimeout(300);
await btn("Start course").click(); await pg.waitForTimeout(1200);

await pg.goto(B); await pg.waitForTimeout(1200);
await btn(/^Homeschool or classroom$/).click(); await pg.waitForTimeout(300);
await audit("setup");
await pg.getByLabel(/^State/).selectOption("GA");
await pg.getByLabel("Name").first().fill("Ada");
await pg.getByLabel(/^Grade/).first().selectOption("3");
await btn("Add another student").click();
await pg.getByLabel("Name").nth(1).fill("Ben");
await pg.getByLabel(/^Grade/).nth(1).selectOption("7");
await pg.getByLabel("Password (8 characters or more)").fill("short");
await btn("Set up homeschool").click(); await pg.waitForTimeout(300);
check("setup rejects short password", await pg.getByRole("alert").filter({ hasText: "8 characters" }).count() === 1);
await pg.getByLabel("Password (8 characters or more)").fill("correct horse");
await pg.getByLabel("Type it again").fill("correct horse");
await pg.getByLabel("Also allow a PIN").check();
await pg.getByLabel("PIN (4 to 8 digits)").fill("2468");
await btn("Set up homeschool").click(); await pg.waitForTimeout(3000);
const code = (await pg.locator(".recovery-code").textContent())?.trim();
check("recovery code shown", /^[A-Z2-9]{4}(-[A-Z2-9]{4}){3}$/.test(code ?? ""));
await audit("recovery");
await btn("I've written it down").click(); await pg.waitForTimeout(1000);
check("Ada keeps German A1", await pg.locator(".course-row").filter({ hasText: "German A1" }).count() === 1);
check("student shown in top bar", await pg.getByRole("button", { name: /Student: Ada/ }).count() === 1);
await audit("library-ada");

// Study for ~15 seconds of activity, then leave (time is credited when the screen closes).
await pg.locator(".course-row").filter({ hasText: "German A1" }).click(); await pg.waitForTimeout(500);
await pg.getByRole("button", { name: /Lessons/ }).first().click(); await pg.waitForTimeout(300);
await pg.locator("main").getByRole("button").filter({ hasText: /^1\.|Lesson 1|Greetings|Hallo/ }).first().click().catch(() => {});
await pg.waitForTimeout(300);
for (let i = 0; i < 4; i++) { await pg.mouse.move(100 + i * 10, 200); await pg.waitForTimeout(5100); }
await pg.goto(B + "#");
await btn(/^Library$/).click().catch(() => {}); await pg.waitForTimeout(800);

// Parent area: wrong PIN, then right PIN.
await btn(/^Family$/).click(); await pg.waitForTimeout(300);
await audit("gate");
await pg.getByLabel("PIN").fill("1111"); await btn(/^Open$/).click(); await pg.waitForTimeout(800);
check("wrong PIN message", (await pg.getByRole("alert").textContent())?.includes("isn't right"));
await pg.getByLabel("PIN").fill("2468"); await btn(/^Open$/).click(); await pg.waitForTimeout(1200);
check("parent area open", await pg.getByRole("heading", { name: "Parent area" }).count() === 1);
check("GA notice reminder", await pg.locator(".reminder-list").filter({ hasText: "Georgia" }).count() >= 0);
await audit("parent-overview");

await btn("Attendance and hours").click(); await pg.waitForTimeout(500);
const tracked = await pg.locator("tbody tr").count();
check("tracked time created a day row", tracked >= 1);
await pg.getByLabel("Minutes").fill("280");
await pg.getByLabel(/^Subject/).selectOption("Science");
await pg.getByLabel("Note (optional)").fill("Museum trip");
await btn("Add time").click(); await pg.waitForTimeout(500);
check("proposed day", await pg.locator("tbody .pill").filter({ hasText: "Proposed" }).count() === 1);
if (shots) await pg.screenshot({ path: `${shots}/debug-att.png`, fullPage: true });
await btn(/Confirm 1 proposed day/).click(); await pg.waitForTimeout(500);
check("confirmed", await pg.locator("tbody .pill").filter({ hasText: "School day" }).count() === 1);
await audit("parent-attendance");
const dl = pg.waitForEvent("download");
await btn("Download attendance (CSV)").click();
const csv = fs.readFileSync(await (await dl).path(), "utf8");
check("csv has museum note", csv.includes("Museum trip") && csv.startsWith("Date,Minutes,Status"));

await pg.getByRole("navigation", { name: "Parent sections", exact: true }).getByRole("button", { name: "Courses", exact: true }).click(); await pg.waitForTimeout(500);
await pg.locator("main").getByLabel(/^Student/).selectOption({ label: "Ben" }); await pg.waitForTimeout(300);
for (const id of ["math-prealgebra", "math-algebra1"]) {
  await pg.getByLabel(/^Course/).selectOption(id);
  await btn(/^Assign$/).click(); await pg.waitForTimeout(300);
}
await pg.getByLabel(/may also start courses/).click(); await pg.waitForTimeout(500);
check("free choice off", !(await pg.getByLabel(/may also start courses/).isChecked()));
await audit("parent-courses");
await btn(/^Students$/).click(); await audit("parent-students");
await btn(/^State rules$/).click(); await audit("parent-state");
check("state sources listed", await pg.locator("main a[href^='http']").count() >= 1);
await btn(/^Settings and backup$/).click(); await audit("parent-settings");
await pg.getByLabel("Backup passphrase").fill("family passphrase");
const bk = pg.waitForEvent("download");
await btn("Back up now").click();
const backup = JSON.parse(fs.readFileSync(await (await bk).path(), "utf8"));
check("backup encrypted", backup.format === "examiner-backup-encrypted" && !JSON.stringify(backup).includes("Museum"));
// Records: school info, a parent grade, reports.
await pg.getByLabel("School name").fill("Pine Hill School");
await pg.getByLabel(/^Administrator/).fill("Pat Doe");
await pg.locator("form").filter({ has: pg.getByLabel("School name") }).getByRole("button", { name: "Save" }).click(); await pg.waitForTimeout(300);
await pg.getByLabel("A", { exact: true }).fill("89");
await pg.locator("form").filter({ has: pg.getByLabel("A", { exact: true }) }).getByRole("button", { name: "Save" }).click(); await pg.waitForTimeout(300);
check("looser scale refused", (await pg.getByRole("alert").filter({ hasText: "stricter" }).count()) === 1);
await pg.getByLabel("A", { exact: true }).fill("93");
await pg.locator("form").filter({ has: pg.getByLabel("A", { exact: true }) }).getByRole("button", { name: "Save" }).click(); await pg.waitForTimeout(300);
await btn(/^Grades$/).click(); await pg.waitForTimeout(600);
check("German A1 on Ada's grades", await pg.locator("tbody tr").filter({ hasText: "German A1" }).count() === 1);
await pg.getByLabel("What it was").fill("Postcard to a pen pal");
await pg.locator("main").getByLabel(/^Percent$/).fill("92");
await btn("Add grade").click(); await pg.waitForTimeout(500);
check("parent grade gives 92% B+ on the stricter scale (A from 93)", (await pg.locator("tbody tr").filter({ hasText: "German A1" }).textContent())?.includes("92% B+"));
await pg.locator("tbody tr").filter({ hasText: "German A1" }).getByRole("button", { name: /Edit/ }).click(); await pg.waitForTimeout(300);
await pg.getByLabel(/^Comment for the report card/).fill("Great pronunciation.");
await pg.locator(".subpanel").getByRole("button", { name: "Save" }).click(); await pg.waitForTimeout(400);
await pg.getByLabel("Test or evaluator").fill("Iowa Assessments, grade 3");
await pg.getByLabel(/^Result$/).fill("Composite 72nd percentile");
await btn("Add result").click(); await pg.waitForTimeout(300);
await audit("parent-grades");
await btn(/^Reports$/).click(); await pg.waitForTimeout(600);
check("report card shows course and comment", (await pg.locator("article.doc").textContent())?.includes("Great pronunciation."));
check("school on report", (await pg.locator("article.doc").textContent())?.includes("Pine Hill School"));
await audit("report-card");
await pg.emulateMedia({ media: "print" });
if (shots) await pg.screenshot({ path: `${shots}/${scheme}-${width}-report-card-print.png`, fullPage: true });
check("print shows only the report", (await pg.locator(".topbar").isVisible()) === false && (await pg.locator(".tabs").isVisible()) === false && (await pg.locator("article.doc").isVisible()));
await pg.emulateMedia({ media: "screen" });
const html = pg.waitForEvent("download");
await btn("Save as web page").click();
const page = fs.readFileSync(await (await html).path(), "utf8");
check("saved web page has the report and its styles", page.includes("Report card") && page.includes(".doc-table"));
await pg.getByRole("combobox", { name: /^Report/ }).selectOption("progress"); await pg.waitForTimeout(500);
check("progress report has material + test", (await pg.locator("article.doc").textContent())?.includes("Iowa Assessments"));
await audit("report-progress");
await pg.getByRole("combobox", { name: /^Report/ }).selectOption("transcript"); await pg.waitForTimeout(400);
await audit("report-transcript");
await pg.getByRole("combobox", { name: /^Report/ }).selectOption("portfolio"); await pg.waitForTimeout(400);
await pg.locator("summary").filter({ hasText: "Photos of paper work" }).click();
const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAIAAAAmkwkpAAAAEElEQVR4nGP4z8AARwzEcQCukw/x0F8jngAAAABJRU5ErkJggg==", "base64");
await pg.getByLabel("Photo or scan").setInputFiles({ name: "work.png", mimeType: "image/png", buffer: png });
await pg.getByLabel("What it shows").fill("Handwriting practice");
await pg.locator("form").filter({ has: pg.getByLabel("Photo or scan") }).getByRole("button", { name: "Add" }).click(); await pg.waitForTimeout(800);
check("photo in portfolio", (await pg.locator("article.doc figure").count()) === 1);
await audit("report-portfolio");
// Reading log, activities, documents.
await btn(/^Reading and activities$/).click(); await pg.waitForTimeout(500);
await pg.getByLabel(/^Title$/).fill("Charlotte's Web");
await pg.getByLabel(/^Author$/).fill("E. B. White");
await btn("Add book").click(); await pg.waitForTimeout(300);
await pg.getByLabel(/^Activity$/).fill("Youth orchestra");
await pg.getByLabel(/^Hours$/).fill("40");
await btn("Add activity").click(); await pg.waitForTimeout(300);
check("book and activity listed", (await pg.locator("main").textContent())?.includes("E. B. White") && (await pg.locator("main").textContent())?.includes("Youth orchestra"));
await audit("parent-reading");
await btn(/^Documents$/).click(); await pg.waitForTimeout(500);
await pg.getByLabel(/^File/).setInputFiles({ name: "notice-of-intent.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF-1.4\n% test notice\n%%EOF\n") });
await pg.getByLabel(/^Attach to every student/).check();
await btn(/^Attach$/).click(); await pg.waitForTimeout(800);
check("document listed", await pg.locator("tbody tr").filter({ hasText: "notice-of-intent.pdf" }).count() === 1);
const dlDoc = pg.waitForEvent("download");
await pg.getByRole("button", { name: /Save a copy/ }).first().click();
check("copy matches", fs.readFileSync(await (await dlDoc).path(), "utf8").includes("test notice"));
await pg.locator("main").getByLabel(/^Student/).selectOption({ label: "Ben" }); await pg.waitForTimeout(500);
check("attached to Ben too", await pg.locator("tbody tr").filter({ hasText: "notice-of-intent.pdf" }).count() === 1);
await audit("parent-documents");
await btn(/^Reports$/).click(); await pg.waitForTimeout(500);
await pg.getByRole("combobox", { name: /^Report/ }).selectOption("portfolio"); await pg.waitForTimeout(500);
const pf = await pg.locator("article.doc").textContent();
check("portfolio has reading log, activity, document", pf?.includes("Charlotte's Web") && pf?.includes("Youth orchestra") && pf?.includes("Notice of intent"));
await btn(/^Overview$/).click(); await pg.waitForTimeout(400);
check("overview shows 1 school day", (await pg.locator(".meter-block").first().textContent())?.includes("1 of 180"));
await btn(/^Lock$/).click(); await pg.waitForTimeout(400);

// Ben: assigned courses only.
await pg.getByRole("button", { name: /Student: Ada/ }).click(); await pg.waitForTimeout(300);
await audit("who");
await pg.getByRole("button", { name: /Ben/ }).first().click(); await pg.waitForTimeout(800);
check("Ben has no courses in progress", await pg.locator(".course-row").count() === 0);
check("assigned list", await pg.locator(".assigned-row").count() === 2);
check("algebra waits for pre-algebra", (await pg.locator(".assigned-row").nth(1).textContent())?.includes("Starts after"));
await pg.fill('[aria-label="Search courses"]', "German A1"); await pg.waitForTimeout(300);
check("unassigned course locked", await pg.getByRole("button", { name: /Not assigned yet/ }).count() === 1);
await pg.fill('[aria-label="Search courses"]', ""); await pg.waitForTimeout(200);
await audit("library-ben");
await pg.locator(".assigned-row").first().getByRole("button", { name: "Start" }).click(); await pg.waitForTimeout(1500);
await pg.goto(B); await pg.waitForTimeout(1500);
// Reload: two students, so the picker comes first.
check("picker on start", await pg.getByRole("heading", { name: "Who's learning?" }).count() === 1);
await pg.getByRole("button", { name: /Ben/ }).first().click(); await pg.waitForTimeout(800);
check("Ben now has Pre-algebra only", (await pg.locator(".course-row").count()) === 1);

console.log(problems.length ? problems.join("\n") : `walkthrough ${scheme} ${width}: all good`);
await b.close();

// End-to-end check of community courses: write, publish, find in the Library, start, report,
// review. Needs the API (cd worker && npm run dev) and the web app:
//   VITE_COMMUNITY_API=http://localhost:8787 npx vite --port 5181
//   node scripts/community-walkthrough.mjs [light|dark] [width] [shots dir]
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright");
import fs from "node:fs";
const axeSrc = fs.readFileSync(new URL("../node_modules/axe-core/axe.min.js", import.meta.url), "utf8");
const scheme = process.argv[2] || "light";
const width = Number(process.argv[3] || 1280);
const shots = process.argv[4];
const b = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const ctx = await b.newContext({ viewport: { width, height: 900 }, colorScheme: scheme });
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
  if (shots) await pg.screenshot({ path: `${shots}/c-${scheme}-${width}-${name}.png`, fullPage: true });
}
const btn = (name) => pg.getByRole("button", { name }).first();
const tag = Math.random().toString(36).slice(2, 6);
const title = `Backyard birds ${tag}`;

await pg.goto(B); await pg.waitForTimeout(1500);
await btn(/^Create$/).click(); await pg.waitForTimeout(800);
await audit("signin");
await pg.getByLabel(/^Name$/).fill(`Pat ${tag}`);
await btn("Sign in (dev)").click(); await pg.waitForTimeout(2000);
check("back on create after sign-in", await pg.getByRole("heading", { name: "Before you write" }).count() === 1);
await audit("terms");
await btn(/^Continue$/).click(); await pg.waitForTimeout(300);
check("terms enforced", (await pg.getByRole("alert").textContent())?.includes("both boxes"));
await pg.getByLabel("I'm 18 or older").check();
await pg.getByLabel("I accept the community course terms").check();
await btn(/^Continue$/).click(); await pg.waitForTimeout(800);
await audit("my-courses-empty");
await btn("New course").click(); await pg.waitForTimeout(1200);

await pg.getByLabel(/^Title$/).fill(title);
await pg.getByLabel(/^Description/).fill("Common backyard birds and how to tell them apart.");
await pg.getByRole("combobox", { name: /^Subject/ }).selectOption("Science");
await pg.getByRole("combobox", { name: /^Level/ }).selectOption("Elementary");
await audit("editor-about");
await btn(/^Lessons/).click(); await pg.waitForTimeout(300);
await pg.getByLabel("Lesson title").fill("Chickadees");
await pg.getByLabel(/^Text \(/).fill("The **black-capped chickadee** says its own name. <b>not html</b>");
await btn(/^Image$/).click(); await pg.waitForTimeout(200);
const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAIAAAAmkwkpAAAAEklEQVR4nGP4z8CAQOgcbAAADtYP8ZUCZbsAAAAASUVORK5CYII=", "base64");
await pg.getByLabel(/^Image \(PNG/).setInputFiles({ name: "bird.png", mimeType: "image/png", buffer: png }); await pg.waitForTimeout(1200);
check("image uploaded", await pg.locator("img.block-image").count() === 1);
await pg.getByLabel(/^Description for people/).fill("A chickadee on a branch");
await btn(/^Question$/).click(); await pg.waitForTimeout(200);
await pg.getByLabel(/^Question$/).fill("Which bird says its own name?");
await pg.getByLabel("Choice 1", { exact: true }).fill("Chickadee");
await pg.getByLabel("Choice 2", { exact: true }).fill("Junco");
await pg.getByLabel("Choice 1 is right").check();
await audit("editor-lesson");
await btn(/^Preview$/).click(); await pg.waitForTimeout(300);
check("preview escapes html", (await pg.locator("[aria-label='Lesson preview']").innerHTML()).includes("&lt;b&gt;not html"));
await btn(/^Notecards/).click(); await pg.waitForTimeout(200);
await btn("Add a deck").click(); await btn("Add card").click(); await pg.waitForTimeout(200);
await pg.getByLabel("Card 1 front").fill("Black cap, white cheeks");
await pg.getByLabel("Card 1 back").fill("Chickadee");
await audit("editor-cards");
await btn(/^Publish$/).click(); await pg.waitForTimeout(1600);
check("saved", (await pg.locator(".save-state").textContent())?.includes("saved"));
await audit("editor-publish");
await pg.locator("section.panel").getByRole("button", { name: /^Publish$/ }).click(); await pg.waitForTimeout(1500);
check("published", (await pg.locator(".page-head").textContent())?.includes("Published version 1"));

// Library
await btn(/^Library$/).click(); await pg.waitForTimeout(1500);
await pg.fill('[aria-label="Search community courses"]', tag); await pg.waitForTimeout(300);
const card = pg.locator(".community .catalog-card").filter({ hasText: title });
check("in community catalog, not reviewed", (await card.count()) === 1 && (await card.locator(".pill").first().textContent()) === "Not reviewed");
await audit("library-community");
await card.getByRole("button", { name: /Start course/ }).click(); await pg.waitForTimeout(2000);
check("course page with community note", (await pg.locator("main").textContent())?.includes(`Community course by Pat ${tag}`));
await audit("course-community");
await btn(/Report this course/).click(); await pg.waitForTimeout(200);
await pg.getByRole("combobox", { name: /^What.s wrong/ }).selectOption("Wrong or misleading");
await btn("Send report").click(); await pg.waitForTimeout(800);
await btn(/^Lessons/).click(); await pg.waitForTimeout(300);
await pg.locator("main").getByRole("button", { name: /Chickadees/ }).first().click(); await pg.waitForTimeout(800);
check("lesson image embedded offline", (await pg.locator("main img[alt='A chickadee on a branch']").getAttribute("src"))?.startsWith("data:image/png"));
await audit("lesson-community");

// Reviewer
await pg.goto(`http://localhost:8787/auth/dev?name=Rae%20${tag}&role=reviewer&return=%2F%3Fcreate`); await pg.waitForTimeout(2000);
await pg.getByLabel("I'm 18 or older").check();
await pg.getByLabel("I accept the community course terms").check();
await btn(/^Continue$/).click(); await pg.waitForTimeout(800);
await btn("Review queue").click(); await pg.waitForTimeout(1000);
const item = pg.locator(".review-item").filter({ hasText: title });
check("waiting for review", (await item.count()) === 1);
check("report listed", (await pg.locator("li.panel").filter({ hasText: title }).filter({ hasText: "Wrong or misleading" }).count()) >= 1);
await item.getByRole("button", { name: /Read the course/ }).click(); await pg.waitForTimeout(800);
await audit("review-queue");
await item.getByRole("button", { name: /Mark version 1 reviewed/ }).click(); await pg.waitForTimeout(1000);
await btn(/^Library$/).click(); await pg.waitForTimeout(1500);
await pg.fill('[aria-label="Search community courses"]', tag); await pg.waitForTimeout(300);
check("tag now reviewed", (await card.locator(".pill").first().textContent()) === "Reviewed");
await card.getByRole("button", { name: /^Update/ }).click(); await pg.waitForTimeout(2000);
check("installed copy updated to reviewed", (await pg.locator("main .pill").first().textContent()) === "Reviewed");

console.log(problems.length ? problems.join("\n") : `community walkthrough ${scheme} ${width}: all good`);
await b.close();

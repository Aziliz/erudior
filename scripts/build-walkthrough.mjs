// End-to-end check of sentence-builder questions (type "build") with the keyboard only:
// samples/demo-japanese.json (furigana tiles, no spaces, an alternative order) and
// samples/demo-listening.json (German, spaces, distractors, a wrong answer and its marks),
// then the results review. axe audits and an overflow check at each step.
//   npm run build && npx vite preview --port 5298
//   node scripts/build-walkthrough.mjs [light|dark] [width] [shots dir]
const pw = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright");
const { chromium } = pw.chromium ? pw : pw.default;
import fs from "node:fs";
const axeSrc = fs.readFileSync(new URL("../node_modules/axe-core/axe.min.js", import.meta.url), "utf8");
const scheme = process.argv[2] || "light";
const width = Number(process.argv[3] || 1280);
const shots = process.argv[4];
const B = process.env.BASE ?? "http://localhost:5298/";
const b = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const ctx = await b.newContext({ viewport: { width, height: 900 }, colorScheme: scheme, locale: "en-US" });
const pg = await ctx.newPage();
const problems = [];
pg.on("dialog", (d) => d.accept());
pg.on("pageerror", (e) => problems.push(`PAGE ERROR ${e.message}`));
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
        what = `${e.tagName.toLowerCase()}.${e.className}`;
      }
    }
    return worst > 1 ? `${Math.round(worst)}px (${what})` : "";
  });
  if (ov) problems.push(`${name}: sticks out of the window by ${ov}`);
  await pg.addScriptTag({ content: axeSrc });
  const r = await pg.evaluate(async () => await window.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"] } }));
  for (const v of r.violations) problems.push(`${name}: ${v.id} — ${v.nodes.slice(0, 2).map((n) => n.target.join(" ") + " :: " + (n.failureSummary || "").split("\n")[1]).join(" | ")}`);
  if (shots) await pg.screenshot({ path: `${shots}/build-${scheme}-${width}-${name}.png`, fullPage: true });
}
const btn = (name) => pg.getByRole("button", { name }).first();
const stopped = async (e) => {
  console.log("STOPPED:", String(e).split("\n")[0], problems.length ? `\nproblems so far:\n  ${problems.join("\n  ")}` : "");
  if (shots) await pg.screenshot({ path: `${shots}/build-${scheme}-${width}-stopped.png` }).catch(() => {});
  process.exit(1);
};
process.on("uncaughtException", stopped);
process.on("unhandledRejection", stopped);

const focused = () => pg.evaluate(() => document.activeElement?.getAttribute("aria-label") ?? document.activeElement?.textContent?.trim() ?? "");
const live = () => pg.evaluate(() => document.querySelector(".build [aria-live]")?.textContent ?? "");
const placed = () => pg.evaluate(() => [...document.querySelectorAll(".build-sentence button")].map((e) => e.getAttribute("aria-label").replace(/, \d+ of \d+$/, "")));

/** Place a tile from the bank with the keyboard: Home, then Right arrow until it's focused, then Enter. */
async function place(label) {
  await pg.locator(".build-bank button").first().focus();
  await pg.keyboard.press("Home");
  for (let i = 0; i < 12 && (await focused()) !== label; i++) await pg.keyboard.press("ArrowRight");
  if ((await focused()) !== label) throw new Error(`tile ${label} not found in the bank`);
  await pg.keyboard.press("Enter");
  await pg.waitForTimeout(120);
  check(`announced ${label} (${await live()})`, (await live()).includes(`Added “${label}”`));
}
/** Check the answer with the keyboard. */
async function checkAnswer() {
  await btn(/Check answer/).focus();
  await pg.keyboard.press("Enter");
  await pg.waitForTimeout(300);
}

async function importCourse(file, title) {
  await pg.goto(B);
  await pg.waitForTimeout(1500);
  const [chooser] = await Promise.all([pg.waitForEvent("filechooser"), btn(/^Import$/).click()]);
  await chooser.setFiles(file);
  await pg.waitForTimeout(1200);
  await btn(title).click();
  await pg.waitForTimeout(800);
}
async function openQuiz(lesson, skip) {
  await btn(/^Lessons$/).click();
  await pg.waitForTimeout(300);
  await btn(lesson).click();
  await pg.waitForTimeout(800);
  if (await btn(/^Skip$/).count()) await btn(/^Skip$/).click();
  await btn(/Take the quiz/).click();
  await pg.waitForTimeout(800);
  // Right arrow (outside the tiles) goes to the next question.
  await pg.locator(".q-stem").first().click();
  for (let i = 0; i < skip; i++) {
    await pg.keyboard.press("ArrowRight");
    await pg.waitForTimeout(150);
  }
  await pg.waitForTimeout(300);
}

// ---------------- Japanese: furigana tiles, no spaces, built by keyboard ----------------
await importCourse("samples/demo-japanese.json", /^Japanese demo/);
await openQuiz(/Cats and tea/, 3);
check("on the build question", (await pg.locator(".build-bank").count()) === 1);
check("prompt under the stem", ((await pg.locator(".q-prompt").textContent()) ?? "").includes("I drink tea every morning"));
check("type label", ((await pg.locator(".q-type").textContent()) ?? "").includes("Build the sentence"));
check(`five tiles (${await pg.locator(".build-bank button").count()})`, (await pg.locator(".build-bank button").count()) === 5);
check("furigana on tiles", (await pg.locator(".build-bank button ruby").count()) >= 4);
check("tiles marked Japanese", (await pg.locator(".build-bank[lang=ja]").count()) === 1);
const startOrder = await pg.evaluate(() => [...document.querySelectorAll(".build-bank button")].map((e) => e.getAttribute("aria-label")));
check(`bank not already solved (${startOrder.join(" ")})`, startOrder.filter((t) => t !== "水を").join("") !== "私は毎朝お茶を飲みます" && startOrder.filter((t) => t !== "水を").join("") !== "毎朝私はお茶を飲みます");
await audit("ja-empty");
for (const t of ["お茶を", "私は", "毎朝", "飲みます"]) await place(t);
check(`placed in that order (${await placed()})`, (await placed()).join("") === "お茶を私は毎朝飲みます");
// Move お茶を two places right with the arrow keys.
await pg.locator(".build-sentence button").first().focus();
await pg.keyboard.press("ArrowRight");
await pg.keyboard.press("ArrowRight");
await pg.waitForTimeout(150);
check(`moved with arrows (${await placed()})`, (await placed()).join("") === "私は毎朝お茶を飲みます");
check(`focus follows the moved tile (${await focused()})`, (await focused()) === "お茶を, 3 of 4");
check(`still on the build question after arrows`, (await pg.locator(".build-bank").count()) === 1);
check(`sentence announced (${await live()})`, (await live()).includes("Sentence: 私は毎朝お茶を飲みます。"));
// Delete sends a tile back; then put it back.
await pg.keyboard.press("Delete");
await pg.waitForTimeout(150);
check(`deleted (${await placed()})`, (await placed()).join("") === "私は毎朝飲みます");
await place("お茶を");
await pg.locator(".build-sentence button").nth(3).focus();
await pg.keyboard.press("ArrowLeft");
await pg.waitForTimeout(150);
check(`fixed again (${await placed()})`, (await placed()).join("") === "私は毎朝お茶を飲みます");
await audit("ja-built");
await checkAnswer();
check("Japanese sentence right", (await pg.locator(".build .part-mark.ok").count()) === 1);
check("joined without spaces", ((await pg.locator(".build-sentence.is-shown").textContent()) ?? "").replace(/[ぁ-ゖ]+(?=[^ぁ-ゖ]|$)/g, "").length > 0);
await audit("ja-checked");

// ---------------- German: spaces, a distractor, a wrong answer and its marks ----------------
await importCourse("samples/demo-listening.json", /^Listening and speaking demo/);
await openQuiz(/Im Café: listen and speak/, 4);
check("German build question", (await pg.locator(".build-bank[lang=de]").count()) === 1);
check(`six tiles (${await pg.locator(".build-bank button").count()})`, (await pg.locator(".build-bank button").count()) === 6);
await audit("de-empty");
for (const t of ["Ich", "möchte", "ein", "Kaffee"]) await place(t);
check(`German sentence announced with spaces (${await live()})`, (await live()).includes("Sentence: Ich möchte ein Kaffee."));
await audit("de-built");
await checkAnswer();
check("the distractor is marked wrong", (await pg.locator(".build-tile.is-wrong").count()) === 1);
check("right tiles marked", (await pg.locator(".build-tile.is-right").count()) === 3);
check("correct sentence shown", ((await pg.locator(".build-answer").textContent()) ?? "").includes("Ich möchte einen Kaffee."));
await audit("de-checked");

// Results review shows the built sentence and the answer.
await btn(/Finish|See results|Done/).click();
await pg.waitForTimeout(900);
if (await btn(/Finish|Submit/).count()) await btn(/Finish|Submit/).click().catch(() => {});
await pg.waitForTimeout(900);
if (await btn(/^All \(/).count()) await btn(/^All \(/).click();
await pg.waitForTimeout(300);
const review = pg.locator(".review-item .build");
check(`review shows the build question (${await review.count()})`, (await review.count()) === 1);
check("review shows the right sentence", ((await review.first().textContent()) ?? "").includes("Ich möchte einen Kaffee."));
await audit("de-results");

await b.close();
if (problems.length) {
  console.log(`${problems.length} problem(s):\n  ${problems.join("\n  ")}`);
  process.exit(1);
}
console.log(`build walkthrough ${scheme} ${width}: clean`);

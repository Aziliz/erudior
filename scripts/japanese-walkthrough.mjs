// End-to-end check of Japanese support with samples/demo-japanese.json: furigana in a lesson,
// the furigana switch, romaji → kana typing in quiz text answers (hiragana, CAPITALS → katakana),
// and typed vocabulary practice in both directions. axe audits and an overflow check.
//   npm run build && npx vite preview --port 5298
//   node scripts/japanese-walkthrough.mjs [light|dark] [width] [shots dir]
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
  if (shots) await pg.screenshot({ path: `${shots}/ja-${scheme}-${width}-${name}.png`, fullPage: false });
}
const btn = (name) => pg.getByRole("button", { name }).first();
const stopped = async (e) => {
  console.log("STOPPED:", String(e).split("\n")[0], problems.length ? `\nproblems so far:\n  ${problems.join("\n  ")}` : "");
  if (shots) await pg.screenshot({ path: `${shots}/ja-${scheme}-${width}-stopped.png` }).catch(() => {});
  process.exit(1);
};
process.on("uncaughtException", stopped);
process.on("unhandledRejection", stopped);

// Import the demo course.
await pg.goto(B);
await pg.waitForTimeout(1500);
const [chooser] = await Promise.all([pg.waitForEvent("filechooser"), btn(/^Import$/).click()]);
await chooser.setFiles("samples/demo-japanese.json");
await pg.waitForTimeout(1200);
await btn(/^Japanese demo/).click();
await pg.waitForTimeout(800);

// Lesson: furigana, toggle.
await btn(/^Lessons$/).click();
await pg.waitForTimeout(300);
await btn(/Cats and tea/).click();
await pg.waitForTimeout(800);
const rubies = await pg.locator(".prose ruby").count();
check(`lesson has furigana (${rubies})`, rubies >= 6);
check("ruby over 猫", ((await pg.locator(".prose ruby").first().textContent()) ?? "").includes("猫"));
check("okurigana split: 食 has た, べる outside", await pg.locator(".prose td ruby", { hasText: "食" }).count() === 1);
const rtVisible = () => pg.evaluate(() => getComputedStyle(document.querySelector(".prose rt")).visibility);
check("furigana shown", (await rtVisible()) === "visible");
await audit("lesson");
await btn(/Furigana on/).click();
await pg.waitForTimeout(200);
check("furigana hidden after toggle", (await rtVisible()) === "hidden");
await btn(/Furigana off/).click();
await pg.waitForTimeout(200);
check("furigana back", (await rtVisible()) === "visible");

// Quiz: choice + typed kana answers.
await btn(/Take the quiz/).click();
await pg.waitForTimeout(800);
check("stem furigana", (await pg.locator(".q-stem ruby").count()) === 1);
await pg.getByRole("radio", { name: /cat/ }).first().click();
await btn(/Check answer/).click();
await pg.waitForTimeout(300);
await audit("quiz-choice");
await btn(/^Next/).click();
await pg.waitForTimeout(500);
const box = pg.locator(".text-answer input").first();
await box.click();
await box.pressSequentially("mizu", { delay: 30 });
check(`romaji becomes kana (${await box.inputValue()})`, (await box.inputValue()) === "みず");
await btn(/Check answer/).click();
await pg.waitForTimeout(300);
check("みず accepted", (await pg.locator(".text-answer.is-right").count()) === 1);
await audit("quiz-text");
await btn(/^Next/).click();
await pg.waitForTimeout(500);
const box2 = pg.locator(".text-answer input").first();
await box2.click();
await box2.pressSequentially("TAKUSHI-", { delay: 30 });
check(`capitals give katakana (${await box2.inputValue()})`, (await box2.inputValue()) === "タクシー");
await btn(/Check answer/).click();
await pg.waitForTimeout(300);
check("タクシー accepted", (await pg.locator(".text-answer.is-right").count()) === 1);
await btn(/Finish|See results|Done/).click().catch(() => {});
await pg.waitForTimeout(800);

// Vocabulary: practice both directions.
await pg.goto(B);
await pg.waitForTimeout(1200);
await btn(/^Japanese demo/).click();
await pg.waitForTimeout(600);
await btn(/^Vocabulary$/).click();
await pg.waitForTimeout(400);
await btn(/Extra practice/).click();
await pg.waitForTimeout(800);
const words = { cat: ["neko", "猫"], tea: ["ocha", "お茶"], "to eat": ["taberu", "食べる"], taxi: ["TAKUSHI-", "タクシー"] };
const meanings = { 猫: "cat", お茶: "tea", 食べる: "to eat", タクシー: "taxi" };
let sawRecall = false, sawMeaning = false, sawKanjiNote = false, prompts = 0;
for (let i = 0; i < 12; i++) {
  if (!(await pg.locator(".vocab-prompt").count())) break;
  // The prompt's text without furigana (<rt>/<rp>).
  const prompt = await pg.evaluate(() => {
    const el = document.querySelector(".vocab-prompt span").cloneNode(true);
    el.querySelectorAll("rt, rp").forEach((n) => n.remove());
    return el.textContent.trim();
  });
  const input = pg.locator("#vocab-answer");
  const isRecall = (await input.getAttribute("lang")) === "ja";
  if (isRecall) {
    sawRecall = true;
    if (!sawMeaning && prompts === 0) await audit("vocab-recall");
    const w = words[prompt];
    if (!w) throw new Error(`unknown recall prompt ${prompt}`);
    await input.pressSequentially(w[0], { delay: 25 });
  } else {
    sawMeaning = true;
    const base = Object.keys(meanings).find((k) => prompt.includes(k));
    if (!base) throw new Error(`unknown word prompt ${prompt}`);
    if (base === "猫") check("word prompt has furigana", (await pg.locator(".vocab-prompt ruby").count()) === 1);
    await input.fill(meanings[base]);
  }
  await btn(/^Check$/).click();
  await pg.waitForTimeout(300);
  const result = (await pg.locator(".vocab-result").textContent()) ?? "";
  check(`vocab "${prompt}" right (${result.slice(0, 60)})`, result.startsWith("Right"));
  if (/Written with kanji/.test(result)) sawKanjiNote = true;
  prompts++;
  await btn(/^Next$/).click();
  await pg.waitForTimeout(300);
}
check("saw recall cards", sawRecall);
check("saw meaning cards", sawMeaning);
check("kana answer for a kanji word gets the kanji note", sawKanjiNote);
check(`answered all 8 cards (${prompts})`, prompts === 8);

await b.close();
if (problems.length) {
  console.log(`${problems.length} problem(s):\n  ${problems.join("\n  ")}`);
  process.exit(1);
}
console.log(`japanese walkthrough ${scheme} ${width}: clean`);

// End-to-end check of Latin and Greek support with samples/demo-classical.json: the pronunciation
// switch (with its "approximate" line) and ```pron blocks and inline marks following it, lang
// attributes on Latin, Greek and transliterated italics, polytonic Greek in the bundled Greek fonts,
// Beta Code typing and the Greek mark keys in quiz text answers, diacritic-optional grading with its
// note, and the vocabulary card back with the dictionary entry. axe audits and an overflow check.
//   npm run build && npx vite preview --port 5298
//   node scripts/classical-walkthrough.mjs [light|dark] [width] [shots dir]
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
const fontFetches = [];
pg.on("request", (r) => {
  if (/noto-(serif|sans)-greek/.test(r.url())) fontFetches.push(r.url().split("/").pop());
});
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
  if (shots) await pg.screenshot({ path: `${shots}/classical-${scheme}-${width}-${name}.png`, fullPage: false });
}
const btn = (name) => pg.getByRole("button", { name }).first();
const stopped = async (e) => {
  console.log("STOPPED:", String(e).split("\n")[0], problems.length ? `\nproblems so far:\n  ${problems.join("\n  ")}` : "");
  if (shots) await pg.screenshot({ path: `${shots}/classical-${scheme}-${width}-stopped.png` }).catch(() => {});
  process.exit(1);
};
process.on("uncaughtException", stopped);
process.on("unhandledRejection", stopped);
const shown = (sel) => pg.evaluate((s) => [...document.querySelectorAll(s)].map((e) => e.getClientRects().length > 0), sel);

// Import the demo course.
await pg.goto(B);
await pg.waitForTimeout(1500);
const [chooser] = await Promise.all([pg.waitForEvent("filechooser"), btn(/^Import$/).click()]);
await chooser.setFiles("samples/demo-classical.json");
await pg.waitForTimeout(1200);
await btn(/^Latin and Greek demo/).click();
await pg.waitForTimeout(800);

// Latin lesson: the switch, pron blocks, inline marks, lang attributes.
await btn(/^Lessons$/).click();
await pg.waitForTimeout(300);
await btn(/Latin: girls and water/).click();
await pg.waitForTimeout(800);
const select = pg.getByLabel("Pronunciation").first();
check("pronunciation switch shown", (await select.count()) === 1);
check(`switch default restored (${await select.inputValue()})`, (await select.inputValue()) === "restored");
const note = (await pg.locator(".pron-audio-note").first().textContent()) ?? "";
check(`approximate-audio line (${note})`, /approximate/.test(note) && /Italian voice/.test(note));
let bodies = await shown(".pron-blk > .pron-body");
check(`restored block shown, ecclesiastical hidden (${bodies})`, bodies[0] === true && bodies[1] === false);
check("hidden block note", await pg.locator(".pron-blk[data-pron=ecclesiastical] .pron-off").isVisible());
check(`hidden note text`, ((await pg.locator(".pron-blk[data-pron=ecclesiastical] .pron-off").textContent()) ?? "").includes("Shown for Ecclesiastical pronunciation"));
let inl = await shown(".pron-inl");
check(`inline marks follow (${inl})`, inl[0] === true && inl[1] === false);
check("no raw pron markup", !(await pg.evaluate(() => /```pron|\{pron=|\{\/pron\}/.test(document.querySelector(".prose").textContent))));
check("Latin italics lang=la", (await pg.locator('.prose em[lang="la"]').count()) > 3);
check("Latin blockquote lang=la", (await pg.locator('.prose blockquote[lang="la"]').count()) === 1);
await audit("lesson-latin");
await select.selectOption("ecclesiastical");
await pg.waitForTimeout(300);
bodies = await shown(".pron-blk > .pron-body");
check(`switched: ecclesiastical shown (${bodies})`, bodies[0] === false && bodies[1] === true);
inl = await shown(".pron-inl");
check(`switched inline (${inl})`, inl[0] === false && inl[1] === true);
check("switch saved per language", (await pg.evaluate(() => localStorage.getItem("erudior.pron.la"))) === "ecclesiastical");
const note2 = (await pg.locator(".pron-audio-note").first().textContent()) ?? "";
check(`note follows the switch (${note2})`, /approximate/.test(note2));
// "Switch to …" in the hidden block's note switches back.
await pg.locator(".pron-blk[data-pron=restored] .pron-switch").click();
await pg.waitForTimeout(300);
check("note button switches", (await select.inputValue()) === "restored");
await audit("lesson-latin-switched");
// Print shows every scheme.
await pg.emulateMedia({ media: "print" });
bodies = await shown(".pron-blk > .pron-body");
check(`print shows all schemes (${bodies})`, bodies.every(Boolean));
await pg.emulateMedia({ media: "screen" });

// Greek lesson: lang attributes and polytonic fonts.
await pg.goBack();
await pg.waitForTimeout(500);
await btn(/Greek: first words/).click();
await pg.waitForTimeout(1000);
check("Greek italics lang=grc", (await pg.locator('.prose em[lang="grc"]').count()) >= 6);
const fonts = await pg.evaluate(async () => {
  await document.fonts.ready;
  const sample = "ἀνήρ ᾠδή Ἑλλάς ῥήτωρ τῷ ἀνθρώπῳ";
  const el = document.createElement("p");
  el.className = "prose";
  el.lang = "grc";
  el.id = "greek-sample";
  el.style.fontSize = "40px";
  el.textContent = sample;
  document.querySelector(".lesson-body").prepend(el);
  await document.fonts.load('40px "Erudior Greek Serif"', sample);
  await document.fonts.load('40px "Erudior Greek Sans"', sample);
  const loaded = [...document.fonts].filter((f) => f.family.replace(/"/g, "") === "Erudior Greek Serif" && f.status === "loaded").map((f) => f.unicodeRange);
  return { loaded, checkSerif: document.fonts.check('40px "Erudior Greek Serif"', sample), stack: getComputedStyle(el).fontFamily };
});
check(`Greek serif faces loaded (${JSON.stringify(fonts.loaded)})`, fonts.loaded.some((r) => /1F00/i.test(r)) && fonts.loaded.some((r) => /370/.test(r)));
check(`Greek font first in the stack (${fonts.stack})`, /^"?Erudior Greek Serif/.test(fonts.stack));
if (shots) await pg.locator("#greek-sample").screenshot({ path: `${shots}/classical-${scheme}-${width}-greek-sample.png` });
await pg.evaluate(() => document.getElementById("greek-sample")?.remove());
await audit("lesson-greek");

// Quiz: Beta Code typing, a mark key, grading with diacritics optional.
await btn(/Take the quiz/).click();
await pg.waitForTimeout(800);
let notes = 0;
for (let i = 0; i < 3; i++) {
  const stem = (await pg.locator(".q-stem").first().textContent()) ?? "";
  const box = pg.locator(".text-answer input").first();
  await box.click();
  if (/genitive/.test(stem)) {
    await box.pressSequentially("a)nqrw/pou", { delay: 20 });
    check(`Beta Code typed (${await box.inputValue()})`, (await box.inputValue()) === "ἀνθρώπου");
    check("Greek box lang=grc", (await box.getAttribute("lang")) === "grc");
    if (i === 0) await audit("quiz-greek-typing");
  } else if (/man/.test(stem) && !/to the man/.test(stem)) {
    // Unaccented: a, a smooth-breathing key, then the rest without marks.
    await box.pressSequentially("a", { delay: 20 });
    await btn(/^Smooth breathing$/).click();
    await pg.waitForTimeout(150);
    await box.pressSequentially("nhr", { delay: 20 });
    check(`mark key combines (${await box.inputValue()})`, (await box.inputValue()) === "ἀνηρ");
  } else {
    await box.pressSequentially("tw=| a)nqrw/pw|", { delay: 15 });
    check(`iota subscript typed (${await box.inputValue()})`, (await box.inputValue()) === "τῷ ἀνθρώπῳ");
  }
  await btn(/Check answer/).click();
  await pg.waitForTimeout(300);
  check(`answer ${i + 1} right (${stem})`, (await pg.locator(".text-answer.is-right").count()) === 1);
  const n = (await pg.locator(".q-note").textContent().catch(() => "")) ?? "";
  if (n) {
    notes++;
    check(`note text (${n})`, n === "With accents: ἀνήρ");
    await audit("quiz-note");
  }
  await btn(/^Next|Finish|See results/).click().catch(() => {});
  await pg.waitForTimeout(500);
}
check(`one diacritic note (${notes})`, notes === 1);

// Vocabulary practice: the card back shows the dictionary entry; macrons optional with a note.
await pg.goto(B);
await pg.waitForTimeout(1200);
await btn(/^Latin and Greek demo/).click();
await pg.waitForTimeout(600);
await btn(/^Lessons$/).click();
await pg.waitForTimeout(300);
await btn(/Latin: girls and water/).click();
await pg.waitForTimeout(800);
await btn(/Practice these words/).click();
await pg.waitForTimeout(800);
const recall = { girl: "puella", love: "amo", big: "magnus" };
const meaning = { puella: "girl", amō: "love", magnus: "big" };
let sawDict = false, sawMacronNote = false, cards = 0;
for (let i = 0; i < 8; i++) {
  if (!(await pg.locator(".vocab-prompt").count())) break;
  const prompt = ((await pg.locator(".vocab-prompt span").first().textContent()) ?? "").trim();
  const input = pg.locator("#vocab-answer");
  if ((await input.getAttribute("lang")) === "la") {
    await input.pressSequentially(recall[prompt], { delay: 20 });
  } else {
    await input.fill(meaning[prompt]);
  }
  await btn(/^Check$/).click();
  await pg.waitForTimeout(300);
  const result = (await pg.locator(".vocab-result").textContent()) ?? "";
  check(`card "${prompt}" right (${result.slice(0, 70)})`, result.startsWith("Right"));
  if (/With macrons: amō/.test(result)) sawMacronNote = true;
  const dict = (await pg.locator(".vocab-result .vocab-dict").textContent().catch(() => "")) ?? "";
  if (/amō, amāre, amāvī, amātum|puella, puellae, f\.|magnus, -a, -um/.test(dict)) sawDict = true;
  if (cards === 0) await audit("vocab-back");
  cards++;
  await btn(/^Next$/).click();
  await pg.waitForTimeout(300);
}
check(`answered 6 cards (${cards})`, cards === 6);
check("card back shows dict", sawDict);
check("macron note on a recall card", sawMacronNote);

// Vocabulary tab: the switch and the entries.
await pg.goto(B);
await pg.waitForTimeout(1200);
await btn(/^Latin and Greek demo/).click();
await pg.waitForTimeout(600);
await btn(/^Vocabulary$/).click();
await pg.waitForTimeout(400);
await pg.getByLabel("Show words").selectOption("all");
await pg.waitForTimeout(300);
check("vocab tab switch", (await pg.getByLabel("Pronunciation").count()) === 1);
check("vocab tab entries", (await pg.locator(".vocab-table .vocab-dict").count()) === 6);
await audit("vocab-tab");
check(`Greek font files fetched on demand (${[...new Set(fontFetches)].length})`, fontFetches.length > 0);

await b.close();
if (problems.length) {
  console.log(`${problems.length} problem(s):\n  ${problems.join("\n  ")}`);
  process.exit(1);
}
console.log(`classical walkthrough ${scheme} ${width}: clean`);

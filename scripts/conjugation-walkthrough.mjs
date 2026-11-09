// End-to-end check of conjugation drills: one round in Japanese (samples/demo-japanese.json,
// romaji typed through the kana converter) and one in German (samples/demo-listening.json,
// verbs and adjective endings). Finishes the lesson that unlocks the forms, checks the
// Vocabulary tab's Conjugation panel, answers a round (one deliberate miss that comes back),
// and checks per-form accuracy afterwards. axe audits and an overflow check throughout.
//   npm run build && npx vite preview --port 5298
//   node scripts/conjugation-walkthrough.mjs [light|dark] [width] [shots dir]
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
  if (shots) await pg.screenshot({ path: `${shots}/conj-${scheme}-${width}-${name}.png`, fullPage: false });
}
const btn = (name) => pg.getByRole("button", { name }).first();
const stopped = async (e) => {
  console.log("STOPPED:", String(e).split("\n")[0], problems.length ? `\nproblems so far:\n  ${problems.join("\n  ")}` : "");
  if (shots) await pg.screenshot({ path: `${shots}/conj-${scheme}-${width}-stopped.png` }).catch(() => {});
  process.exit(1);
};
process.on("uncaughtException", stopped);
process.on("unhandledRejection", stopped);

async function importCourse(file, title) {
  await pg.goto(B);
  await pg.waitForTimeout(1500);
  const [chooser] = await Promise.all([pg.waitForEvent("filechooser"), btn(/^Import$/).click()]);
  await chooser.setFiles(file);
  await pg.waitForTimeout(1200);
  await btn(title).click();
  await pg.waitForTimeout(800);
}

async function openVocab(title) {
  await pg.goto(B);
  await pg.waitForTimeout(1200);
  await btn(title).click();
  await pg.waitForTimeout(600);
  await btn(/^Vocabulary$/).click();
  await pg.waitForTimeout(500);
}

/** Finish a lesson without a quiz with its Complete button. */
async function finishLesson(lessonTitle) {
  await btn(/^Lessons$/).click();
  await pg.waitForTimeout(300);
  await btn(lessonTitle).click();
  await pg.waitForTimeout(800);
  if (await btn(/^Skip$/).count()) await btn(/^Skip$/).click();
  await btn(/^Complete( and continue)?$/).click();
  await pg.waitForTimeout(600);
}

/** The prompt word without furigana, and the target label. */
const promptInfo = () =>
  pg.evaluate(() => {
    const el = document.querySelector(".vocab-prompt span").cloneNode(true);
    el.querySelectorAll("rt, rp").forEach((n) => n.remove());
    const target = document.querySelector(".conj-target");
    return { word: el.textContent.trim(), label: target.querySelector("strong").textContent.trim(), noun: target.querySelector("[lang]")?.textContent.trim() ?? "" };
  });

/** Answer every prompt of a round with `answer(info)`; the first gets a deliberate miss. */
async function playRound(lang, answer, wrong) {
  const panel = pg.locator(".conj-panel");
  check(`${lang}: Conjugation panel on the Vocabulary tab`, (await panel.count()) === 1);
  check(`${lang}: Practice conjugation enabled`, await btn(/^Practice conjugation$/).isEnabled());
  await audit(`${lang}-vocab-tab`);
  await btn(/^Practice conjugation$/).click();
  await pg.waitForTimeout(800);
  const total = Number(((await pg.locator(".conj-run .run-head .muted").textContent()) ?? "").match(/\/(\d+)/)?.[1] ?? 0);
  check(`${lang}: round of 6 (${total})`, total === 6);
  let answered = 0, missed = false, missRecovered = false, sawRule = false, missedKey = "";
  for (let i = 0; i < 12; i++) {
    if (!(await pg.locator(".conj-card").count())) break;
    const info = await promptInfo();
    const input = pg.locator("#conj-answer");
    check(`${lang}: answer box labeled`, (await pg.locator("label[for=conj-answer]").count()) === 1);
    if (i === 0) await audit(`${lang}-prompt`);
    const key = `${info.word}|${info.label}|${info.noun}`;
    const right = answer(info);
    if (!right) throw new Error(`${lang}: no expected answer for ${key}`);
    const miss = !missed;
    await input.click();
    await input.pressSequentially(miss ? wrong : right, { delay: 20 });
    await pg.keyboard.press("Enter");
    await pg.waitForTimeout(300);
    const result = (await pg.locator(".vocab-result").textContent()) ?? "";
    if (miss) {
      missed = true;
      missedKey = key;
      check(`${lang}: deliberate miss marked (${result.slice(0, 50)})`, result.startsWith("Not quite"));
      await audit(`${lang}-miss`);
    } else {
      check(`${lang}: "${key}" right (${result.slice(0, 80)})`, result.startsWith("Right"));
      if (key === missedKey) missRecovered = true;
    }
    if ((await pg.locator(".conj-rule").textContent())?.trim()) sawRule = true;
    answered++;
    await pg.keyboard.press("Enter");
    await pg.waitForTimeout(300);
  }
  check(`${lang}: rule shown`, sawRule);
  check(`${lang}: missed prompt came back and was answered`, missRecovered);
  check(`${lang}: 7 answers (6 + the repeat) (${answered})`, answered === 7);
  const summary = (await pg.locator(".panel").first().textContent()) ?? "";
  check(`${lang}: summary 5 of 6 (${summary.slice(0, 60)})`, summary.includes("5 of 6 right the first time"));
  await audit(`${lang}-summary`);
  await btn(/^Back to vocabulary$/).click();
  await pg.waitForTimeout(500);
  const acc = (await pg.locator(".conj-table").textContent()) ?? "";
  check(`${lang}: accuracy saved (${acc.slice(0, 120)})`, /of \d+ right/.test(acc));
}

// ---------------- Japanese ----------------
const ja = {
  食べる: { "polite present": "tabemasu", "plain negative": "tabenai", "て form": "tabete", "plain past": "tabeta" },
  書く: { "polite present": "kakimasu", "plain negative": "kakanai", "て form": "kaite", "plain past": "kaita" },
  行く: { "polite present": "ikimasu", "plain negative": "ikanai", "て form": "itte", "plain past": "itta" },
  する: { "polite present": "shimasu", "plain negative": "shinai", "て form": "shite", "plain past": "shita" },
  来る: { "polite present": "kimasu", "plain negative": "konai", "て form": "kite", "plain past": "kita" },
  高い: { negative: "takakunai", past: "takakatta" },
  いい: { negative: "yokunai", past: "yokatta" },
  静か: { negative: "shizukajanai", past: "shizukadatta" },
};
await importCourse("samples/demo-japanese.json", /^Japanese demo/);
await btn(/^Vocabulary$/).click();
await pg.waitForTimeout(400);
check("ja: practice disabled before the lesson", await btn(/^Practice conjugation$/).isDisabled());
check("ja: locked forms name their lesson", ((await pg.locator(".conj-table").textContent()) ?? "").includes("Unlocks with “Verbs and adjectives”"));
await finishLesson(/Verbs and adjectives/);
await openVocab(/^Japanese demo/);
// Kana typed for a kanji word: right, with a "Written with kanji" note; furigana on the prompt.
await playRound("ja", (info) => ja[info.word]?.[info.label], "baka");

// ---------------- German ----------------
const de = {
  machen: { present: ["mache", "machst", "macht", "machen", "macht", "machen"], perfect: ["habe gemacht", "hast gemacht", "hat gemacht", "haben gemacht", "habt gemacht", "haben gemacht"], imperative: { du: "mach", ihr: "macht", Sie: "machen Sie" } },
  fahren: { present: ["fahre", "fährst", "fährt", "fahren", "fahrt", "fahren"], perfect: ["bin gefahren", "bist gefahren", "ist gefahren", "sind gefahren", "seid gefahren", "sind gefahren"], imperative: { du: "fahr", ihr: "fahrt", Sie: "fahren Sie" } },
  sein: { present: ["bin", "bist", "ist", "sind", "seid", "sind"], perfect: ["bin gewesen", "bist gewesen", "ist gewesen", "sind gewesen", "seid gewesen", "sind gewesen"], imperative: { du: "sei", ihr: "seid", Sie: "seien Sie" } },
};
const persons = ["ich", "du", "er/sie/es", "wir", "ihr", "sie/Sie"];
const ARTICLE = { der: [["der", "die", "das", "die"], ["den", "die", "das", "die"], ["dem", "der", "dem", "den"]], ein: [["ein", "eine", "ein", "keine"], ["einen", "eine", "ein", "keine"], ["einem", "einer", "einem", "keinen"]] };
const ENDING = {
  der: [["e", "e", "e", "en"], ["en", "e", "e", "en"], ["en", "en", "en", "en"]],
  ein: [["er", "e", "es", "en"], ["en", "e", "es", "en"], ["en", "en", "en", "en"]],
  none: [["er", "e", "es", "e"], ["en", "e", "es", "e"], ["em", "er", "em", "en"]],
};
function deAnswer({ word, label, noun }) {
  if (word === "klein") {
    const c = ["nominative", "accusative", "dative"].findIndex((x) => label.startsWith(x));
    const g = label.includes("plural") ? 3 : { der: 0, die: 1, das: 2 }[noun.split(" ")[0]];
    const art = label.includes("no article") ? "none" : /with (ein|kein)/.test(label) ? "ein" : "der";
    const adj = "klein" + ENDING[art][c][g];
    return art === "none" ? adj : `${ARTICLE[art][c][g]} ${adj}`;
  }
  const v = de[word];
  if (!v) return undefined;
  let m = /^(.+), present$/.exec(label);
  if (m) return v.present[persons.indexOf(m[1])];
  m = /^Perfekt, (.+)$/.exec(label);
  if (m) return v.perfect[persons.indexOf(m[1])];
  m = /^imperative, (.+)$/.exec(label);
  if (m) return v.imperative[m[1]];
  return undefined;
}
await importCourse("samples/demo-listening.json", /^Listening and speaking demo/);
await finishLesson(/Verbs and adjective endings/);
await openVocab(/^Listening and speaking demo/);
await playRound("de", deAnswer, "falsch");

// Umlaut buttons under the box type into it.
await btn(/^Practice conjugation$/).click();
await pg.waitForTimeout(800);
check("de: umlaut keys shown", (await pg.locator(".conj-card .char-keys button").count()) >= 3);
await pg.locator(".conj-card .char-keys button", { hasText: "ä" }).first().click();
check("de: ä key types ä", (await pg.locator("#conj-answer").inputValue()) === "ä");

await b.close();
if (problems.length) {
  console.log(`${problems.length} problem(s):\n  ${problems.join("\n  ")}`);
  process.exit(1);
}
console.log(`conjugation walkthrough ${scheme} ${width}: clean`);

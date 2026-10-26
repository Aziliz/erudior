// End-to-end check of the built-in reader and listening/speaking practice, with axe audits
// and an overflow check. Uses the demo courses samples/demo-reader.json and
// samples/demo-listening.json. Chromium gets a fake microphone, so recording really runs.
//   npm run build && npx vite preview --port 5297
//   node scripts/reader-walkthrough.mjs [light|dark] [width] [shots dir]
const pw = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright");
const { chromium } = pw.chromium ? pw : pw.default;
import fs from "node:fs";
const axeSrc = fs.readFileSync(new URL("../node_modules/axe-core/axe.min.js", import.meta.url), "utf8");
const scheme = process.argv[2] || "light";
const width = Number(process.argv[3] || 1280);
const shots = process.argv[4];
const B = process.env.BASE ?? "http://localhost:5297/";
const b = await chromium.launch({
  ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}),
  args: ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream", "--autoplay-policy=no-user-gesture-required"],
});
const ctx = await b.newContext({ viewport: { width, height: 900 }, colorScheme: scheme });
await ctx.grantPermissions(["microphone"], { origin: new URL(B).origin });
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
  const r = await pg.evaluate(async () => await window.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "wcag2aaa", "best-practice"] } }));
  for (const v of r.violations) problems.push(`${name}: ${v.id} — ${v.nodes.slice(0, 2).map((n) => n.target.join(" ") + " :: " + (n.failureSummary || "").split("\n")[1]).join(" | ")}`);
  if (shots) await pg.screenshot({ path: `${shots}/r-${scheme}-${width}-${name}.png`, fullPage: false });
}
const btn = (name) => pg.getByRole("button", { name }).first();
async function importCourse(file, title) {
  await pg.goto(B);
  await pg.waitForTimeout(1500);
  const [chooser] = await Promise.all([pg.waitForEvent("filechooser"), btn(/^Import$/).click()]);
  await chooser.setFiles(file);
  await pg.waitForTimeout(1200);
  await pg.getByRole("button", { name: title }).first().click();
  await pg.waitForTimeout(800);
}
// A step that can't continue: keep a picture of where it stopped.
const stopped = async (e) => {
  console.log("STOPPED:", String(e).split("\n")[0], problems.length ? `\nproblems so far:\n  ${problems.join("\n  ")}` : "");
  if (shots) await pg.screenshot({ path: `${shots}/r-${scheme}-${width}-stopped.png` }).catch(() => {});
  process.exit(1);
};
process.on("uncaughtException", stopped);
process.on("unhandledRejection", stopped);

// ---------------- Reader ----------------
await importCourse("samples/demo-reader.json", /^Reader demo/);
await btn(/^Reading$/).click();
await pg.waitForTimeout(400);
check("library lists four texts", (await pg.locator(".library-item").count()) === 4);
await audit("library");

await btn(/Start reading.*Lamplighter/).click();
await pg.waitForTimeout(800);
check("reader title", (await pg.locator("h1").textContent()) === "The Lamplighter's Last Round");
check("section heading", (await pg.locator("h2.reader-section").textContent()) === "The Ladder");
check("paragraphs", (await pg.locator(".reader-text > p").count()) >= 8);
check("text glossary link", (await pg.locator(".reader-text button.gloss").count()) >= 2);
check("footnote listed", (await pg.locator(".reader-notes li").count()) === 1);
await audit("reader");
await pg.locator("button.fn-ref").first().click();
await pg.waitForTimeout(200);
check("footnote opens", ((await pg.locator(".gloss-pop").textContent()) ?? "").includes("Before electric street lights"));
await pg.locator(".gloss-pop button").click();
await pg.locator(".reader-text button.gloss").first().click();
await pg.waitForTimeout(200);
check("text glossary pop-up", ((await pg.locator(".gloss-pop").textContent()) ?? "").includes("light the gas street lamps"));
await pg.locator(".gloss-pop button").click();

// Scroll partway, leave, come back: the place is kept.
await pg.evaluate(() => {
  const m = document.querySelector(".main");
  m.scrollTop = 1500;
  m.dispatchEvent(new Event("scroll"));
});
await pg.waitForTimeout(1800);
await btn(/Reading$/).click(); // the back button "← Reader demo: Reading"
await pg.waitForTimeout(400);
check("library shows it's started", ((await pg.locator(".library-item").first().textContent()) ?? "").includes("0 of 3 parts read"));
await btn(/Continue reading.*Lamplighter/).click();
await pg.waitForTimeout(900);
const top = await pg.evaluate(() => document.querySelector(".main").scrollTop);
check(`place restored (scrollTop ${top})`, top > 300);

await btn(/I've read this part: next/).click();
await pg.waitForTimeout(700);
check("next part opens", (await pg.locator("h2.reader-section").textContent()) === "The Wires");
check("focus moves to the new part's heading", await pg.evaluate(() => document.activeElement?.classList.contains("reader-section")));
check("contents marks the read part", ((await pg.locator(".reader-toc option").first().textContent()) ?? "").startsWith("✓"));
await btn(/Answer the questions/).click();
await pg.waitForTimeout(700);
check("reading questions open in practice", ((await pg.locator(".pill.neutral").first().textContent()) ?? "") === "Reading questions");
await pg.goBack();
await pg.waitForTimeout(800);

// Poem and play: line numbers, speakers, stage directions.
await pg.goto(B + "reader-demo/read/winter-orchard");
await pg.waitForTimeout(1500);
check("poem lines", (await pg.locator(".verse .vl").count()) === 16);
check("poem numbers every 5 lines", (await pg.locator(".verse .ln").allTextContents()).join() === "5,10,15");
check("poem stanzas", (await pg.locator(".verse .stanza").count()) === 4);
await audit("poem");
await pg.goto(B + "reader-demo/read/borrowed-ladder");
await pg.waitForTimeout(1500);
check("play speakers", (await pg.locator(".verse .speaker").count()) === 11);
check("play stage directions", (await pg.locator(".verse .stage").count()) === 3);
await audit("play");
await pg.goto(B + "reader-demo/read/canal-letter");
await pg.waitForTimeout(1500);
await audit("document");

// ---------------- Listening and speaking ----------------
await importCourse("samples/demo-listening.json", /^Listening and speaking demo/);
await btn(/^Lessons$/).click();
await pg.waitForTimeout(300);
await pg.getByRole("button", { name: /Im Café: listen and speak/ }).first().click();
await pg.waitForTimeout(900);
if (await btn(/^Skip$/).count()) await btn(/^Skip$/).click();
check("dialogue lines", (await pg.locator(".dlg-line").count()) === 4);
check("two recorded lines", (await pg.locator(".dlg-line[data-audio]").count()) === 2);
check("dialogue text marked German", (await pg.locator(".dlg-text[lang=de]").count()) === 4);
await audit("lesson");
await pg.locator(".dlg-play").first().click();
await pg.waitForTimeout(300);
check("a recorded line plays", (await pg.locator(".dlg-line.is-playing").count()) === 1);
await btn(/^Hide the words$/).click();
check("words hidden", await pg.locator(".dlg").evaluate((e) => e.classList.contains("hide-words") && getComputedStyle(e.querySelector(".dlg-text")).display === "none"));
await btn(/^Show the words$/).click();
await btn(/^Translations$/).click();
check("translations hidden", await pg.locator(".dlg").evaluate((e) => getComputedStyle(e.querySelector(".dlg-tr")).display === "none"));
await btn(/^Translations$/).click();

const item = pg.locator(".spk-item").first();
await item.getByRole("button", { name: /Record yourself/ }).click();
await pg.waitForTimeout(1500);
check("recording starts", ((await item.locator(".media-status").textContent()) ?? "").startsWith("Recording"));
if (shots) await pg.screenshot({ path: `${shots}/r-${scheme}-${width}-recording.png` });
await item.getByRole("button", { name: /Stop recording/ }).click();
await pg.waitForTimeout(800);
check("recorded", ((await item.locator(".media-status").textContent()) ?? "").startsWith("Recorded"));
check("your recording can be played", await item.getByRole("button", { name: /Your recording/ }).isVisible());
await audit("recorded");
await item.getByRole("button", { name: /Compare/ }).click();
await pg.waitForTimeout(300);
await item.getByRole("button", { name: /Delete recording/ }).click();
await pg.waitForTimeout(200);
check("deleted", !(await item.getByRole("button", { name: /Your recording/ }).isVisible()));
check("focus back on Record", await pg.evaluate(() => document.activeElement?.textContent?.includes("Record yourself")));

// Listening question in the lesson quiz.
await btn(/Take the quiz/).click();
await pg.waitForTimeout(900);
check("listen button", await btn(/Listen$/).isVisible());
check("no transcript before answering", (await pg.locator(".q-transcript").count()) === 0);
await audit("question");
await pg.getByText("What would you like to drink?", { exact: true }).first().click();
await btn(/^Check/).click();
await pg.waitForTimeout(400);
check("transcript after checking", ((await pg.locator(".q-transcript").textContent()) ?? "").includes("Was möchten Sie trinken?"));
if (shots) await pg.screenshot({ path: `${shots}/r-${scheme}-${width}-question-checked.png` });

console.log(problems.length ? `${problems.length} problem(s):\n  ${problems.join("\n  ")}` : `reader walkthrough clean (${scheme}, ${width}px)`);
await b.close();
process.exit(problems.length ? 1 : 0);

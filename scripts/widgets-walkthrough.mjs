// End-to-end check of maps, timelines and simulations (lesson blocks and question kinds) with
// axe audits. Build the demo course (python3 scripts/build-demo-widgets.py) and the app, then:
//   npx vite preview --port 5293
//   node scripts/widgets-walkthrough.mjs [light|dark] [width] [shots dir]
const pw = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright");
const { chromium } = pw.chromium ? pw : pw.default;
import fs from "node:fs";
const axeSrc = fs.readFileSync(new URL("../node_modules/axe-core/axe.min.js", import.meta.url), "utf8");
const file = new URL("../samples/demo-maps-timelines-sims.json", import.meta.url).pathname;
const scheme = process.argv[2] || "light";
const width = Number(process.argv[3] || 1280);
const shots = process.argv[4];
const port = process.env.PORT || 5293;
const b = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const ctx = await b.newContext({ viewport: { width, height: 900 }, colorScheme: scheme, reducedMotion: process.env.REDUCED ? "reduce" : "no-preference" });
const pg = await ctx.newPage();
pg.on("dialog", (d) => d.accept());
pg.on("pageerror", (e) => problems.push(`PAGE ERROR ${e.message}`));
pg.on("console", (m) => m.type() === "error" && problems.push(`console: ${m.text().slice(0, 200)}`));
const B = `http://localhost:${port}/`;
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
        what = `${e.tagName.toLowerCase()}.${e.className?.baseVal ?? e.className}`;
      }
    }
    return worst > 1 ? `${Math.round(worst)}px (${what})` : "";
  });
  if (ov) problems.push(`${name}: sticks out of the window by ${ov}`);
  await pg.addScriptTag({ content: axeSrc });
  const r = await pg.evaluate(async () => await window.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "wcag2aaa", "best-practice"] } }));
  for (const v of r.violations) problems.push(`${name}: ${v.id} — ${v.nodes.slice(0, 2).map((n) => n.target.join(" ") + " :: " + (n.failureSummary || "").split("\n")[1]).join(" | ")}`);
  if (shots) await pg.screenshot({ path: `${shots}/w-${scheme}-${width}-${name}.png`, fullPage: true });
}
const btn = (name) => pg.getByRole("button", { name }).first();
const openLesson = async (name) => {
  await btn(/^Lessons$/).click();
  await pg.waitForTimeout(400);
  await pg.locator("button, a").filter({ hasText: name }).first().click();
  await pg.waitForTimeout(1800);
};

await pg.goto(B);
await pg.waitForTimeout(1500);
const [chooser] = await Promise.all([pg.waitForEvent("filechooser"), btn(/^Import$/).click()]);
await chooser.setFiles(file);
await pg.waitForTimeout(1200);
await pg.getByRole("button", { name: /^Demo: maps/ }).first().click();
await pg.waitForTimeout(800);
const courseUrl = pg.url();

// --- Maps lesson ---
await openLesson(/^Maps\b/);
check("four maps drawn", (await pg.locator(".map-svg").count()) === 4);
check("US map has 51 regions", (await pg.locator(".map-svg").first().locator("path.rg").count()) === 51);
check("shaded groups", (await pg.locator(".map-svg").first().locator("path.rg.g0").count()) === 6);
check("map key lists the groups", ((await pg.locator(".map-key").first().textContent()) ?? "").includes("All of the state"));
check("route drawn", (await pg.locator(".map-svg").first().locator(".map-route").count()) === 1);
check("svg map regions", (await pg.locator(".map-svg").nth(2).locator("path.rg").count()) === 4);
check("geojson map regions", (await pg.locator(".map-svg").nth(3).locator("path.rg").count()) === 2);
// Keyboard: focus the first map and move with the arrows; the name shows under the map.
const first = pg.locator(".map-svg").first().locator('[tabindex="0"]');
await first.focus();
const info1 = await pg.locator(".map-info").first().textContent();
await pg.keyboard.press("ArrowRight");
await pg.waitForTimeout(150);
const info2 = await pg.locator(".map-info").first().textContent();
check(`arrow keys move between places (${info1} -> ${info2})`, info1 !== info2 && !/Point at/.test(info2 ?? ""));
const vb1 = await pg.locator(".map-svg").first().getAttribute("viewBox");
await pg.locator(".geo-map").first().getByRole("button", { name: "Zoom in" }).click();
const vb2 = await pg.locator(".map-svg").first().getAttribute("viewBox");
check("zoom changes the view", vb1 !== vb2);
await audit("maps");
await pg.goto(courseUrl);
await pg.waitForTimeout(1200);

// --- Timelines lesson ---
await openLesson(/^Timelines\b/);
const live = await pg.locator("figure.tl.tl-live").count();
if (width >= 600) {
  check(`timelines horizontal (${live})`, live === 3);
  const w1 = await pg.locator(".tl-track").first().evaluate((e) => e.offsetWidth);
  await pg.locator("figure.tl").first().getByRole("button", { name: "Zoom in" }).click();
  await pg.waitForTimeout(200);
  const w2 = await pg.locator(".tl-track").first().evaluate((e) => e.offsetWidth);
  check(`timeline zooms (${w1} -> ${w2})`, w2 > w1 * 1.3);
  // Labels in the same lane never overlap.
  const overlap = await pg.evaluate(() => {
    for (const tr of document.querySelectorAll(".tl-track")) {
      const r = [...tr.querySelectorAll(".tl-ev")].map((e) => [e.getBoundingClientRect(), getComputedStyle(e).getPropertyValue("--lane")]);
      for (let i = 0; i < r.length; i++) for (let j = i + 1; j < r.length; j++) if (r[i][1] === r[j][1] && r[i][0].right > r[j][0].left && r[j][0].right > r[i][0].left) return true;
    }
    return false;
  });
  check("timeline labels don't overlap", !overlap);
} else check(`narrow timelines stay lists (${live})`, live === 0);
check("events listed oldest first", ((await pg.locator(".tl-events").first().locator(".tl-date").first().textContent()) ?? "").includes("753"));
await audit("timelines");
await pg.goto(courseUrl);
await pg.waitForTimeout(1200);

// --- Simulations ---
await openLesson(/^Simulations: motion/);
check("two sims", (await pg.locator(".sim-ui").count()) === 2);
const sim1 = pg.locator(".sim").first();
await sim1.getByRole("button", { name: /^(Play|Run)$/ }).click();
await pg.waitForTimeout(3500);
const said = (await sim1.locator("[aria-live]").textContent()) ?? "";
check(`projectile lands and is announced (${said})`, /landed 35\.3 meters/.test(said));
const pend = pg.locator(".sim").nth(1);
await pend.getByRole("button", { name: "Step" }).click();
await pend.getByRole("button", { name: "Step" }).click();
check("pendulum steps", ((await pend.locator(".sim-readouts").textContent()) ?? "").includes("0.20 s"));
// Sliders work from the keyboard.
await pend.getByRole("slider", { name: /String length/ }).focus();
await pg.keyboard.press("ArrowRight");
check("slider moves with arrow keys", (await pend.getByRole("slider", { name: /String length/ }).getAttribute("aria-valuetext")) === "1.1 m");
check("new length resets the run and updates the period", ((await pend.locator(".sim-readouts").textContent()) ?? "").includes("0.00 s") && ((await pend.locator(".sim-readouts").textContent()) ?? "").includes("2.1"));
await audit("sims-motion");
await pg.goto(courseUrl);
await pg.waitForTimeout(1200);
await openLesson(/^Simulations: circuits/);
const circ = pg.locator(".sim").first();
check("series total", ((await circ.locator(".sim-readouts").textContent()) ?? "").includes("30.00 Ω"));
await circ.getByRole("combobox", { name: "Wiring" }).selectOption("parallel");
check("parallel total", ((await circ.locator(".sim-readouts").textContent()) ?? "").includes("6.67 Ω"));
const gasSim = pg.locator(".sim").nth(1);
check("gas pressure", ((await gasSim.locator(".sim-readouts").textContent()) ?? "").includes("99.8 kPa"));
await pg.locator(".sim").nth(2).getByRole("button", { name: /^(Play|Run)$/ }).click();
await pg.waitForTimeout(1500);
await audit("sims-systems");
await pg.goto(courseUrl);
await pg.waitForTimeout(1200);

// --- Map questions ---
await openLesson(/^Maps\b/);
await btn(/Take the quiz/).click();
await pg.waitForTimeout(1500);
for (let i = 0; i < 4; i++) {
  await pg.waitForTimeout(800);
  const stem = (await pg.locator(".q-stem").first().textContent()) ?? "";
  if (stem.startsWith("Click Colorado")) {
    // A click on the map picks a place without naming it.
    await pg.locator(".map-svg path.rg").nth(10).click();
    check("map click picks", ((await pg.locator(".map-q").textContent()) ?? "").includes("1 place picked"));
    await btn("Choose from a list instead").click();
    await pg.getByLabel("Your answer").selectOption("Colorado");
    await audit("q-map-find");
  } else if (stem.startsWith("Pick the two")) {
    await btn("Choose from a list instead").click();
    await pg.getByRole("checkbox", { name: "Spain" }).check();
    await pg.getByRole("checkbox", { name: "Portugal" }).check();
  } else if (stem.startsWith("Name each")) {
    check("numbered marks on the map", (await pg.locator(".map-mark").count()) === 3);
    await pg.getByLabel("Place 1").selectOption({ label: "Brazil" });
    await pg.getByLabel("Place 2").selectOption({ label: "Argentina" });
    await pg.getByLabel("Place 3").selectOption({ label: "Peru" });
    await audit("q-map-label");
  } else if (stem.startsWith("Which dot")) {
    await btn("Choose from a list instead").click();
    await pg.getByLabel("Your answer").selectOption("St. Louis");
  }
  await btn("Check answer").click();
  await pg.waitForTimeout(500);
  const verdict = (await pg.locator(".verdict").textContent()) ?? "";
  check(`correct: ${stem.slice(0, 30)} (${verdict})`, verdict === "Correct");
  if (stem.startsWith("Click Colorado")) await audit("q-map-feedback");
  if (i < 3) await btn(/^Next$/).click();
}
await btn(/See results/).click();
await pg.waitForTimeout(1500);
await audit("map-results");
await pg.goto(courseUrl);
await pg.waitForTimeout(1200);

// --- Timeline questions ---
await openLesson(/^Timelines\b/);
await btn(/Take the quiz/).click();
await pg.waitForTimeout(1200);
for (let i = 0; i < 2; i++) {
  const stem = (await pg.locator(".q-stem").first().textContent()) ?? "";
  if (stem.startsWith("Place each")) {
    check("timeline strip", (await pg.locator(".tl-strip-slot").count()) === 3);
    await pg.getByLabel("Slot 1: 44 BCE").selectOption({ label: "Julius Caesar is killed" });
    await pg.getByLabel("Slot 2: 79 CE").selectOption({ label: "Mount Vesuvius buries Pompeii" });
    await pg.getByLabel("Slot 3: 476 CE").selectOption({ label: "The last emperor in the west is removed" });
    await audit("q-timeline");
  } else {
    const want = ["Sputnik 1, the first satellite", "Yuri Gagarin is the first person in space", "John Glenn orbits Earth", "Apollo 11 lands on the Moon"];
    for (let guard = 0; guard < 20; guard++) {
      const cur = await pg.locator(".order-text").allTextContents();
      const k = cur.findIndex((x, j) => x !== want[j]);
      if (k < 0) break;
      await pg.getByRole("button", { name: `Move "${want[k]}" up` }).click();
      await pg.waitForTimeout(60);
    }
  }
  await btn("Check answer").click();
  await pg.waitForTimeout(400);
  const verdict = (await pg.locator(".verdict").textContent()) ?? "";
  check(`correct: ${stem.slice(0, 30)} (${verdict})`, verdict === "Correct");
  if (!stem.startsWith("Place each")) {
    check("dates shown after checking", ((await pg.locator(".q-parts").textContent()) ?? "").includes("October 4, 1957"));
    await audit("q-order-dates");
  }
  if (i < 1) await btn(/^Next$/).click();
  await pg.waitForTimeout(300);
}

// --- Bank editor: write a map question and a timeline question ---
await pg.goto(B);
await pg.waitForTimeout(1200);
const newBank = pg.getByRole("button", { name: /New (question )?bank/ });
if (await newBank.count()) {
  await newBank.first().click();
  await pg.waitForTimeout(800);
  await pg.getByLabel(/^Title/).first().fill("Widgets test");
  await btn(/^Add$/).click();
  await pg.waitForTimeout(300);
  await pg.getByLabel("Question type").selectOption({ label: "Map: find or label places" });
  await pg.getByLabel("Question", { exact: true }).fill("Click Colorado");
  await pg.getByLabel(/^Places to click/).fill("Colorado");
  await audit("editor-map");
  await btn(/^Add$/).click();
  await pg.waitForTimeout(300);
  await pg.getByLabel("Question type").selectOption({ label: "Place events on a timeline" });
  await pg.getByLabel("Question", { exact: true }).fill("Place them");
  await pg.getByLabel("Slot 1 date").fill("1776");
  await pg.getByLabel("Slot 1 event").fill("Declaration of Independence");
  await pg.getByLabel("Slot 2 date").fill("1861–1865");
  await pg.getByLabel("Slot 2 event").fill("Civil War");
  await audit("editor-timeline");
  await btn("Save bank").click();
  await pg.waitForTimeout(600);
  check("bank with map and timeline questions saved", ((await pg.locator("body").textContent()) ?? "").includes("Bank saved"));
} else problems.push("no New bank button (editor not checked)");

await b.close();
console.log(problems.length ? `${problems.length} problem(s):\n  ${problems.join("\n  ")}` : `widgets walkthrough clean (${scheme}, ${width}px)`);
process.exit(problems.length ? 1 : 0);

// Kanji tracing: the generated KanjiVG data (all jōyō kanji, stroke counts, order and
// direction), lazy loading (before and after the data arrives), trace blocks with kanji, the
// pads, and the tracing check on dense kanji (every stroke of every kanji).
// Run: npx tsx tests/kanji.test.mts
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { JSDOM } from "jsdom";

let fails = 0;
const ok = (name: string, cond: boolean, extra?: unknown) => {
  if (!cond) {
    fails++;
    if (fails < 60) console.log("FAIL", name, extra ?? "");
  }
};
type Pt = [number, number];

const dom = new JSDOM("<!doctype html><html><body></body></html>");
const gl = globalThis as Record<string, unknown>;
gl.window = dom.window;
gl.document = dom.window.document;

const { TRACE_KANJI, KANJIVG_VERSION } = await import("../src/lib/kanjiList.ts");
const { addKanjiStrokes, expandStroke, isTraceKanji, kanjiStrokes, kanjiStrokesLoaded } = await import("../src/lib/kanjiStrokes.ts");
const { needsKanjiStrokes } = await import("../src/lib/kanjiLoad.ts");
const { letterGuide, checkStroke, pathLength, TOLERANCE, strokePoints } = await import("../src/lib/handwriting.ts");
const { parseTrace, phonicsProblems, renderTrace, renderPad, letterName, hydratePhonics } = await import("../src/lib/phonics.ts");

// --- The list ---------------------------------------------------------------------------------
const listFile = readFileSync("scripts/data/joyo-kanji.txt", "utf8");
const joyo = [...listFile.split("\n").filter((l) => !l.startsWith("#")).join("").replace(/\s+/g, "")];
ok("2,136 jōyō kanji in the checked list", joyo.length === 2136 && new Set(joyo).size === 2136, joyo.length);
const traceable = [...TRACE_KANJI];
ok("every jōyō kanji traceable", joyo.every(isTraceKanji), joyo.filter((c) => !isTraceKanji(c)));
ok("plus the four alternate forms", traceable.length === 2140 && [..."叱填剥頬𠮟塡剝頰"].every(isTraceKanji), traceable.length);
ok("version recorded", /^r\d{8}$/.test(KANJIVG_VERSION));
ok("kana aren't kanji", !isTraceKanji("あ") && !isTraceKanji("ア") && !isTraceKanji("a"));
ok("non-jōyō kanji not traceable", !isTraceKanji("鰯") && !isTraceKanji("々"));

// --- Before the data loads --------------------------------------------------------------------
ok("not loaded yet", !kanjiStrokesLoaded() && !letterGuide("日"));
const before = parseTrace("", "日 本");
ok("trace block accepts kanji before the data loads", before.letters.join("") === "日本" && !before.problems.length, before);
ok("needs the data", needsKanjiStrokes("Intro\n\n```trace\n日\n```\n") && !needsKanjiStrokes("```trace\nあ a\n```\n") && !needsKanjiStrokes("日本\n\n```trace\na\n```"));
const pending = renderPad("日", TOLERANCE.normal);
ok("pending pad: an empty square box", pending.includes("is-pending") && pending.includes("is-kanji") && pending.includes("loading its strokes") && !pending.includes("tr-road"), pending);
const host0 = document.createElement("div");
host0.innerHTML = renderTrace(before);
hydratePhonics(host0, { lang: "en-US" });
ok("pending pads aren't made live", !host0.querySelector(".trace-pad.is-live") && host0.querySelector(".tr-actions")!.hasAttribute("hidden"));

// --- Errors ------------------------------------------------------------------------------------
const bad = parseTrace("", "鰯");
ok("other kanji: a clear error", bad.problems.length === 2 && bad.problems[0].includes("jōyō") && bad.problems[0].includes("鰯"), bad.problems);
ok("small kana error unchanged", parseTrace("", "ゃ").problems.some((x) => x.includes("not small kana")));
ok("course checker problems", phonicsProblems("```trace\n日鰯\n```").length === 1 && !phonicsProblems("```trace\n日本語\n```").length, phonicsProblems("```trace\n日鰯\n```"));

// --- The data -------------------------------------------------------------------------------
const { default: DATA } = await import("../src/lib/kanjiStrokes.data.ts");
const header = readFileSync("src/lib/kanjiStrokes.data.ts", "utf8").slice(0, 1500);
ok("data header: source, version, license, attribution", header.includes("KanjiVG " + KANJIVG_VERSION) && header.includes("Ulrich Apel") && header.includes("CC BY-SA 3.0") && header.includes("https://github.com/KanjiVG/kanjivg"));
ok("data covers exactly the list", Object.keys(DATA).length === traceable.length && traceable.every((c) => typeof DATA[c] === "string"));
ok("expand", expandStroke("31 24 1 1 2 3 2 5") === "M 31 24 C 32 25 33 27 33 29" && expandStroke("10 10 1 0 2 0 3 0 1 1 2 2 3 3") === "M 10 10 C 11 10 12 10 13 10 C 14 11 15 12 16 13");
let threw = false;
try {
  expandStroke("1 2 3");
} catch {
  threw = true;
}
ok("bad compact stroke throws", threw);
addKanjiStrokes(DATA);
ok("loaded", kanjiStrokesLoaded() && !needsKanjiStrokes("```trace\n日\n```") && !!letterGuide("日")?.kanji);

// Stroke counts (school dictionaries; the 2010 table's forms).
const COUNTS: Record<string, number> = {
  一: 1, 二: 2, 三: 3, 日: 4, 月: 4, 木: 4, 水: 4, 火: 4, 人: 2, 口: 3, 山: 3, 川: 3, 田: 5, 目: 5, 本: 5, 学: 8, 書: 10,
  語: 14, 曜: 18, 鬱: 29, 必: 5, 飛: 9, 馬: 10, 糸: 6, 遡: 14, 𠮟: 5, 叱: 5, 剝: 10, 頰: 16, 箸: 15, 九: 2, 力: 2, 女: 3, 母: 5,
};
for (const [ch, n] of Object.entries(COUNTS)) ok(`${ch}: ${n} strokes`, kanjiStrokes(ch)?.length === n, kanjiStrokes(ch)?.length);

// Order and direction kept from KanjiVG.
const ends = (ch: string, i: number) => {
  const s = letterGuide(ch)!.strokes[i];
  return { a: s[0], z: s[s.length - 1] };
};
const dir = (ch: string, i: number) => {
  const { a, z } = ends(ch, i);
  return [z[0] - a[0], z[1] - a[1]];
};
ok("一 goes left to right", dir("一", 0)[0] > 40);
ok("三 top to bottom, each left to right", [0, 1, 2].every((i) => dir("三", i)[0] > 20) && ends("三", 0).a[1] < ends("三", 1).a[1] && ends("三", 1).a[1] < ends("三", 2).a[1]);
ok("日: left side down first, then the top-right corner, then the bars", dir("日", 0)[1] > 40 && dir("日", 1)[0] > 20 && dir("日", 1)[1] > 40 && ends("日", 2).a[1] < ends("日", 3).a[1]);
ok("川: left to right strokes, each downward", [0, 1, 2].every((i) => dir("川", i)[1] > 20) && ends("川", 0).a[0] < ends("川", 1).a[0] && ends("川", 1).a[0] < ends("川", 2).a[0]);
ok("人: the left-falling stroke first", dir("人", 0)[0] < -10 && dir("人", 1)[0] > 10);
ok("木: horizontal, vertical, left sweep, right sweep", dir("木", 0)[0] > 30 && dir("木", 1)[1] > 40 && dir("木", 2)[0] < -10 && dir("木", 3)[0] > 10);
ok("口: the last stroke is the bottom, left to right", dir("口", 2)[0] > 20 && ends("口", 2).a[1] > 60);

// --- Pads ---------------------------------------------------------------------------------------
ok("kanji name", letterName("日") === "kanji 日" && letterName("𠮟") === "kanji 𠮟" && letterName("ね") === "hiragana ne");
const pad = renderPad("日", TOLERANCE.normal);
ok("kanji pad: square box with a dashed cross", pad.includes('class="trace-pad is-kanji"') && pad.includes('viewBox="-12 -12 124 124"') && (pad.match(/tr-line mid/g) ?? []).length === 2, pad.slice(0, 300));
ok("kanji pad label", pad.includes('aria-label="Trace the kanji 日: 4 strokes. Start at number 1'), pad.slice(0, 200));
ok("numbered starts", (pad.match(/class="tr-start"/g) ?? []).length === 4 && pad.includes(">4</text>"));
ok("kana pad unchanged", renderPad("ね", TOLERANCE.normal).includes('class="trace-pad is-kana"') && !!letterGuide("ね")?.kana && !letterGuide("ね")?.kanji);
const kt = renderTrace(parseTrace("", "日本"));
ok("kanji kicker and nav", kt.includes("Trace the kanji ") && kt.includes('aria-label="Kanji tracing"') && kt.includes("Kanji 1 of 2") && kt.includes("Next kanji"), kt.slice(0, 400));
ok("kanji label marked Japanese", kt.includes('<span class="tr-label">kanji <span lang="ja">日</span></span>') && kt.includes('class="tr-glyph" aria-hidden="true" lang="ja"'));
const mixed = renderTrace(parseTrace("", "日ね"));
ok("kana and kanji: characters", mixed.includes("Trace the characters") && mixed.includes("Next character"));
// Numbers stay inside (or just around) the box on the densest kanji, and don't pile up.
for (const ch of ["鬱", "響", "曜", "議", "臓", "驚"]) {
  const svg = renderPad(ch, TOLERANCE.normal);
  const spots = [...svg.matchAll(/<circle cx="([-\d.]+)" cy="([-\d.]+)" r="5.5"\/>/g)].map((m) => [Number(m[1]), Number(m[2])]);
  ok(`${ch}: a number per stroke`, spots.length === kanjiStrokes(ch)!.length);
  ok(`${ch}: numbers on the pad`, spots.every(([x, y]) => x >= -6 && x <= 106 && y >= -6 && y <= 106));
  const overlaps = spots.filter((p, i) => spots.some((q, j) => j < i && Math.hypot(p[0] - q[0], p[1] - q[1]) < 10)).length;
  ok(`${ch}: numbers mostly apart (${overlaps} overlap)`, overlaps <= 2, overlaps);
}
const host = document.createElement("div");
host.innerHTML = renderTrace(parseTrace("", "日"));
hydratePhonics(host, { lang: "en-US" });
ok("loaded pads are live", !!host.querySelector(".trace-pad.is-live.is-kanji") && !host.querySelector(".tr-actions")!.hasAttribute("hidden"));

// --- The tracing check on every stroke of every kanji ---------------------------------------
// As for kana: short strokes (dots, hooks of 心) are mostly inside the tolerance from either end,
// so backwards and part-way checks only apply to strokes long enough to tell.
const T = TOLERANCE.normal;
let strokes = 0;
let longOnes = 0;
let nextAccepts = 0;
for (const ch of traceable) {
  const g = letterGuide(ch);
  if (!g?.kanji) {
    ok(`kanji ${ch}`, false);
    continue;
  }
  ok(`${ch}: inside the box`, g.strokes.flat().every(([x, y]) => x >= 0 && x <= 100 && y >= 0 && y <= 100));
  for (const [i, st] of g.strokes.entries()) {
    strokes++;
    const name = `${ch} stroke ${i + 1}`;
    const L = pathLength(st);
    ok(`${name}: tracing the guide passes`, checkStroke(st, st).ok);
    const a = st[0];
    const z = st[st.length - 1];
    // A slightly wobbly tracing. On short strokes the wobble is smaller (4 units across a dot of
    // 12 is a scribble, not a wobble), and on strokes that end where they began (the checker
    // treats them as loops, like the zigzag of 緊's 糸).
    const amp = L > 3 * T && Math.hypot(z[0] - a[0], z[1] - a[1]) > T ? 4 : 2;
    const wobble = st.map(([x, y], k): Pt => [x + amp * Math.sin(k / 4), y + (amp * 3) / 4]);
    ok(`${name}: a wobbly tracing within tolerance passes`, checkStroke(st, wobble).ok, { L });
    if (st.length > 2 && L > 3 * T && Math.hypot(z[0] - a[0], z[1] - a[1]) > 10) {
      longOnes++;
      ok(`${name}: backwards fails`, !checkStroke(st, st.slice().reverse()).ok);
      // Part way along (a third, and not yet near the end: strokes that fold back, like the
      // top of 子, come back near their end early on): keep going.
      let k = Math.floor(st.length / 3);
      while (k > 3 && st.slice(0, k).some((p) => Math.hypot(p[0] - z[0], p[1] - z[1]) <= T * 1.2)) k--;
      if (k > 3) {
        const part = checkStroke(st, st.slice(0, k));
        ok(`${name}: part way is "keep going", not done`, !part.ok && part.partial, part);
      }
    }
    // The pad only ever checks the stroke being traced; record how often a stroke's own tracing
    // would also pass for the next one (close parallel strokes), so a change here is noticed.
    if (i + 1 < g.strokes.length && checkStroke(g.strokes[i + 1], st).ok) nextAccepts++;
  }
}
ok("22,000+ strokes checked", strokes > 22000, strokes);
ok("8,000+ long strokes", longOnes > 8000, longOnes);
ok(`stroke N's tracing passing as stroke N+1 stays rare (${nextAccepts})`, nextAccepts < 0.12 * strokes, nextAccepts);

// Dense kanji: the next stroke is only accepted when it's that stroke, not the one beside it.
const ri = letterGuide("三")!.strokes;
ok("三: tracing stroke 1 again isn't stroke 3", !checkStroke(ri[2], ri[0]).ok);
// Tight tolerance still lets an exact tracing through on the smallest strokes.
const smallest = traceable.flatMap((c) => letterGuide(c)!.strokes).sort((p, q) => pathLength(p) - pathLength(q))[0];
ok("smallest stroke traceable at tight", checkStroke(smallest, smallest, TOLERANCE.tight).ok && pathLength(smallest) > 3);
ok("strokePoints round trip", strokePoints(kanjiStrokes("一")![0]).length > 10);

// --- Bundles: the data stays out of the community API worker and the main code ---------------
const seen = new Set<string>();
const visit = (file: string) => {
  file = path.resolve(file);
  if (seen.has(file) || !existsSync(file)) return;
  seen.add(file);
  const src = readFileSync(file, "utf8");
  for (const m of src.matchAll(/(?:from\s*|import\s*\(?\s*)["'](\.[^"']+)["']/g)) {
    let t = path.resolve(path.dirname(file), m[1]);
    if (!path.extname(t)) t += existsSync(t + ".ts") ? ".ts" : ".tsx";
    visit(t);
  }
};
visit("worker/src/index.ts");
const rel = [...seen].map((f) => path.relative(process.cwd(), f));
ok("worker validates kanji (list) but never loads the data", rel.includes("src/lib/kanjiList.ts") && !rel.some((f) => /kanjiStrokes\.data|kanjiLoad/.test(f)), rel.filter((f) => /kanji/.test(f)));
const staticImports = (f: string) => [...readFileSync(f, "utf8").matchAll(/^import[^;]*from\s*["']([^"']+)["']/gm)].map((m) => m[1]);
ok("nothing imports the data statically", ["src/lib/kanjiLoad.ts", "src/lib/kanjiStrokes.ts", "src/lib/handwriting.ts", "src/lib/phonics.ts", "src/lib/phonicsSpec.ts", "src/components/Markdown.tsx"].every((f) => !staticImports(f).some((s) => s.includes("kanjiStrokes.data"))));

if (fails) {
  console.log(`${fails} kanji test(s) failed`);
  process.exit(1);
}
console.log(`kanji tests passed (${traceable.length} kanji, ${strokes} strokes; ${nextAccepts} strokes whose tracing would also pass the next one)`);

// Hanzi tracing (Chinese courses): the generated Make Me a Hanzi subset (HSK 1–3 and Taiwan
// forms), its licence notice, lazy loading, trace blocks in "zh" courses (outlines shown, medians
// checked, spoken in Chinese), a whole character traced on a live pad, and that kanji and kana
// tracing in Japanese courses is unchanged (KanjiVG even for characters both datasets have).
// Run: npx tsx tests/hanzi.test.mts
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

// A DOM with one Chinese voice, so a finished hanzi is spoken.
const dom = new JSDOM("<!doctype html><html><body></body></html>");
const spoken: { text: string; lang: string }[] = [];
const fakeSynth = {
  getVoices: () => [{ lang: "zh-CN", name: "Test" }],
  speak(u: { text: string; lang: string; onend?: () => void }) {
    spoken.push({ text: u.text, lang: u.lang });
    setTimeout(() => u.onend?.(), 1);
  },
  cancel() {},
  addEventListener() {},
  removeEventListener() {},
};
Object.assign(dom.window, { speechSynthesis: fakeSynth });
const gl = globalThis as Record<string, unknown>;
gl.window = dom.window;
gl.document = dom.window.document;
gl.HTMLElement = dom.window.HTMLElement;
gl.SpeechSynthesisUtterance = class {
  lang = "";
  voice: unknown;
  rate = 1;
  constructor(public text: string) {}
};
// Pad coordinates = client coordinates (jsdom has no layout).
gl.DOMPoint = class {
  constructor(
    public x: number,
    public y: number,
  ) {}
  matrixTransform() {
    return this;
  }
};

const { TRACE_HANZI, MAKEMEAHANZI_COMMIT } = await import("../src/lib/hanziList.ts");
const { addHanziStrokes, hanziStrokes, hanziStrokesLoaded, isTraceHanzi, medianCommands, HANZI_OUTLINE_TRANSFORM } = await import("../src/lib/hanziStrokes.ts");
const { needsHanziStrokes } = await import("../src/lib/hanziLoad.ts");
const { addKanjiStrokes } = await import("../src/lib/kanjiStrokes.ts");
const { letterGuide, checkStroke, pathLength, TOLERANCE } = await import("../src/lib/handwriting.ts");
const { parseTrace, phonicsProblems, protectPhonics, renderTrace, renderPad, letterName, hydratePhonics, handlePhonicsClick } = await import("../src/lib/phonics.ts");
const { validateLessonSource } = await import("../src/lib/lessonSource.ts");

// --- The list -------------------------------------------------------------------------------
const listFile = readFileSync("scripts/data/hsk-hanzi.txt", "utf8");
const hsk = [...listFile.split("\n").filter((l) => !l.startsWith("#")).join("").replace(/\s+/g, "")];
ok("655 HSK 1–3 characters in the list", hsk.length === 655 && new Set(hsk).size === 655, hsk.length);
ok("every HSK 1–3 character traceable", hsk.every(isTraceHanzi), hsk.filter((c) => !isTraceHanzi(c)));
const traceable = [...TRACE_HANZI];
ok("923 hanzi with their traditional forms", traceable.length === 923 && new Set(traceable).size === 923, traceable.length);
ok("Taiwan forms, including one-to-many ones", [..."學語東們這發髮麵乾幹鐘鍾隻係週複"].every(isTraceHanzi), [..."學語東們這發髮麵乾幹鐘鍾隻係週複"].filter((c) => !isTraceHanzi(c)));
ok("not beyond the subset", !isTraceHanzi("鰯") && !isTraceHanzi("a") && !isTraceHanzi("あ"));
ok("source commit recorded", /^[0-9a-f]{40}$/.test(MAKEMEAHANZI_COMMIT));

// --- Licence: the Arphic Public License travels with the data ---------------------------------
const dataSrc = readFileSync("src/lib/hanziStrokes.data.ts", "utf8");
ok("data file carries the notice of modification", /NOTICE OF MODIFICATION \(Arphic Public License, section 2a\)/.test(dataSrc) && dataSrc.includes(MAKEMEAHANZI_COMMIT) && /changed from graphics\.txt on\s*\/\/ \d{4}-\d{2}-\d{2}/.test(dataSrc));
const apl = readFileSync("scripts/licenses/makemeahanzi-ARPHICPL-COPYING.txt", "utf8").trim();
const third = readFileSync("public/third-party-licenses.txt", "utf8");
ok("licence text is the Arphic Public License", apl.startsWith("ARPHIC PUBLIC LICENSE") && apl.includes("You must insert a prominent notice in each modified file"));
ok("third-party-licenses.txt has the notice and the full licence", third.includes(readFileSync("scripts/licenses/makemeahanzi-NOTICE.txt", "utf8").trim()) && third.includes(apl));

// --- Before the data loads ----------------------------------------------------------------------
ok("not loaded yet", !hanziStrokesLoaded() && !letterGuide("们", "zh"));
ok("needs the data", needsHanziStrokes("```trace\n们\n```") && !needsHanziStrokes("```trace\na\n```") && !needsHanziStrokes("们\n\n```trace\na\n```"));
const before = parseTrace("", "们 学 學", "zh");
ok("zh trace parses hanzi before loading", before.letters.join("") === "们学學" && !before.problems.length && before.script === "zh", before);
const pending = renderTrace(before);
ok("pending hanzi pads", (pending.match(/is-hanzi is-pending/g) ?? []).length === 3 && pending.includes("Trace the hanzi 们: loading its strokes."), pending.slice(0, 500));
ok("unknown hanzi refused in zh", parseTrace("", "鰯", "zh").problems.some((p) => p.includes("hanzi tracing covers the characters of HSK 1–3")));
ok("zh course problems", phonicsProblems("```trace\n们鰯\n```", "zh").length === 1 && !phonicsProblems("```trace\n们學\n```", "zh").length);
// Without "zh" (Japanese and other courses) Han characters stay kanji: 们 is not a jōyō kanji.
ok("without zh, 们 is no kanji", parseTrace("", "们").problems.some((p) => p.includes("jōyō")) && !parseTrace("", "学").problems.length && parseTrace("", "学").script === undefined);
ok("canonical lesson source: zh courses accept hanzi", !validateLessonSource("```trace\n们\n```", { traceScript: "zh" }).length && validateLessonSource("```trace\n们\n```").length > 0);

// --- Loaded: guides from the medians, outlines for display ---------------------------------------
const HANZI = (await import("../src/lib/hanziStrokes.data.ts")).default as Record<string, string>;
const KANJI = (await import("../src/lib/kanjiStrokes.data.ts")).default as Record<string, string>;
ok("data covers the list exactly", Object.keys(HANZI).join("") === TRACE_HANZI);
addHanziStrokes(HANZI);
addKanjiStrokes(KANJI);
ok("loaded", hanziStrokesLoaded() && !needsHanziStrokes("```trace\n们\n```") && !!letterGuide("们", "zh")?.hanzi);
ok("median commands", medianCommands("1 2 3.5 4") === "M 1 2 L 3.5 4");
const COUNTS: Record<string, number> = { 一: 1, 十: 2, 人: 2, 三: 3, 口: 3, 们: 5, 你: 7, 好: 6, 学: 8, 學: 16, 語: 14, 东: 5, 東: 8, 发: 5, 髮: 15, 马: 3, 馬: 10 };
for (const [ch, n] of Object.entries(COUNTS)) ok(`${ch}: ${n} strokes`, hanziStrokes(ch)?.outlines.length === n && letterGuide(ch, "zh")?.strokes.length === n, hanziStrokes(ch)?.outlines.length);
const ends = (ch: string, i: number) => {
  const s = letterGuide(ch, "zh")!.strokes[i];
  return { a: s[0], z: s[s.length - 1] };
};
const dir = (ch: string, i: number) => {
  const { a, z } = ends(ch, i);
  return [z[0] - a[0], z[1] - a[1]];
};
ok("一 left to right", dir("一", 0)[0] > 40);
ok("十 horizontal, then vertical downward", dir("十", 0)[0] > 40 && dir("十", 1)[1] > 40);
ok("三 top to bottom", ends("三", 0).a[1] < ends("三", 1).a[1] && ends("三", 1).a[1] < ends("三", 2).a[1]);
ok("人: left-falling first", dir("人", 0)[0] < -10 && dir("人", 1)[0] > 10);

// Japanese courses keep KanjiVG for characters both datasets have.
const jp = letterGuide("学")!;
const zh = letterGuide("学", "zh")!;
ok("学 without zh is the KanjiVG kanji", !!jp.kanji && !jp.hanzi && !jp.outlines && jp !== zh);
ok("学 in zh is the Make Me a Hanzi hanzi", !!zh.hanzi && !zh.kanji && zh.outlines!.length === 8);
ok("kana unaffected by zh", !!letterGuide("ね", "zh")?.kana && !!letterGuide("a", "zh") && letterGuide("ね", "zh") === letterGuide("ね"));
ok("kanji pad unchanged", renderPad("学", TOLERANCE.normal).includes('class="trace-pad is-kanji"') && !renderPad("学", TOLERANCE.normal).includes("tr-outline"));
ok("kanji label unchanged", letterName("学") === "kanji 学" && renderTrace(parseTrace("", "学")).includes('kanji <span lang="ja">学</span>'));
ok("protectPhonics without zh keeps kanji", protectPhonics("```trace\n学\n```").restore("<p>XPHONICSX0XPHONICSX</p>").includes("is-kanji\"") && protectPhonics("```trace\n学\n```", "zh").restore("XPHONICSX0XPHONICSX").includes("is-hanzi"));

// --- Pads -------------------------------------------------------------------------------------------
ok("hanzi name", letterName("学", "zh") === "hanzi 学" && letterName("ね", "zh") === "hiragana ne");
const pad = renderPad("学", TOLERANCE.normal, "zh");
ok("hanzi pad: the kanji square box", pad.includes('class="trace-pad is-kanji is-hanzi"') && pad.includes('viewBox="-12 -12 124 124"') && (pad.match(/tr-line mid/g) ?? []).length === 2, pad.slice(0, 300));
ok("hanzi pad label", pad.includes('aria-label="Trace the hanzi 学: 8 strokes. Start at number 1'), pad.slice(0, 300));
ok("outlines drawn in the 1024 box", pad.includes(`<g transform="${HANZI_OUTLINE_TRANSFORM}">`) && (pad.match(/class="tr-outline/g) ?? []).length === 8 && pad.includes('class="tr-outline is-current" data-s="0"'));
ok("no lanes, but centres, arrows and numbers", !/class="tr-road[ "]/.test(pad) && (pad.match(/class="tr-center"/g) ?? []).length === 8 && (pad.match(/class="tr-start"/g) ?? []).length === 8 && (pad.match(/class="tr-arrow"/g) ?? []).length === 8);
ok("outline paths are only path data", [...pad.matchAll(/ d="([^"]*)"/g)].every((m) => /^[MLQCZ0-9 .-]+$/.test(m[1])));
const t = renderTrace(parseTrace("", "你好", "zh"));
ok("hanzi kicker and nav", t.includes("Trace the hanzi ") && t.includes('aria-label="Hanzi tracing"') && t.includes("Hanzi 1 of 2") && t.includes("Next hanzi") && t.includes('data-script="zh"'), t.slice(0, 400));
ok("hanzi label marked Chinese", t.includes('<span class="tr-label">hanzi <span lang="zh">你</span></span>') && t.includes('class="tr-glyph" aria-hidden="true" lang="zh"') && !t.includes('lang="ja"'));
// Medians stay in the square; checking each stroke against its own median passes, backwards fails.
const T = TOLERANCE.normal;
let strokes = 0;
let longOnes = 0;
for (const ch of traceable) {
  const g = letterGuide(ch, "zh");
  if (!g?.hanzi) {
    ok(`hanzi ${ch}`, false);
    continue;
  }
  ok(`${ch}: inside the box`, g.strokes.flat().every(([x, y]) => x >= -2 && x <= 102 && y >= -2 && y <= 102), ch);
  for (const st of g.strokes) {
    strokes++;
    ok(`${ch}: tracing the median passes`, checkStroke(st, st).ok);
    const a = st[0];
    const z = st[st.length - 1];
    if (pathLength(st) > 3 * T && Math.hypot(z[0] - a[0], z[1] - a[1]) > 10) {
      longOnes++;
      ok(`${ch}: backwards fails`, !checkStroke(st, st.slice().reverse()).ok);
    }
  }
}
ok("8,000+ strokes checked", strokes > 8000, strokes);
ok("3,000+ long strokes", longOnes > 3000, longOnes);

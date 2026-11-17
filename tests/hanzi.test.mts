// Hanzi tracing (Chinese courses): the generated Make Me a Hanzi subset (HSK 1–9 and Taiwan
// forms, one chunk per band), its licence notice, lazy loading chunk by chunk, trace blocks in "zh" courses (outlines shown, medians
// checked, spoken in Chinese), a whole character traced on a live pad, and that kanji and kana
// tracing in Japanese courses is unchanged (KanjiVG even for characters both datasets have).
// Run: npx tsx tests/hanzi.test.mts
import { readFileSync, readdirSync, existsSync } from "node:fs";
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

const { TRACE_HANZI, HANZI_CHUNKS, HANZI_NO_STROKES, MAKEMEAHANZI_COMMIT } = await import("../src/lib/hanziList.ts");
const { hanziChunk, hanziStrokes, hanziStrokesLoaded, isTraceHanzi, medianCommands, HANZI_OUTLINE_TRANSFORM } = await import("../src/lib/hanziStrokes.ts");
const { loadHanziStrokes, needsHanziStrokes, tracedHanzi } = await import("../src/lib/hanziLoad.ts");
const { addKanjiStrokes } = await import("../src/lib/kanjiStrokes.ts");
const { letterGuide, checkStroke, pathLength, TOLERANCE } = await import("../src/lib/handwriting.ts");
const { parseTrace, phonicsProblems, protectPhonics, renderTrace, renderPad, letterName, hydratePhonics, handlePhonicsClick } = await import("../src/lib/phonics.ts");
const { validateLessonSource } = await import("../src/lib/lessonSource.ts");

// --- The list -------------------------------------------------------------------------------
// scripts/data/hsk-hanzi.txt: "## <level> (<count>)", then that level's new characters.
const levels = new Map<string, string[]>();
let level = "";
for (const l of readFileSync("scripts/data/hsk-hanzi.txt", "utf8").split("\n")) {
  const h = /^## (\S+) \((\d+)\)$/.exec(l);
  if (h) levels.set((level = h[1]), []);
  else if (!l.startsWith("#") && level) levels.get(level)!.push(...l.replace(/\s+/g, ""));
}
const SYLLABUS: Record<string, number> = { 1: 246, 2: 125, 3: 284, 4: 441, 5: 431, 6: 413, "7-9": 1148 };
ok("syllabus levels and counts", [...levels].map(([k, v]) => `${k}:${v.length}`).join(" ") === Object.entries(SYLLABUS).map(([k, n]) => `${k}:${n}`).join(" "), [...levels].map(([k, v]) => `${k}:${v.length}`));
const hsk = [...levels.values()].flat();
ok("3,088 distinct HSK 1–9 characters in the list", hsk.length === 3088 && new Set(hsk).size === 3088, hsk.length);
ok("every HSK 1–9 character traceable", hsk.every(isTraceHanzi), hsk.filter((c) => !isTraceHanzi(c)));
const traceable = [...TRACE_HANZI];
ok("4,337 hanzi with their traditional forms", traceable.length === 4337 && new Set(traceable).size === 4337, traceable.length);
const chunkIds = Object.keys(HANZI_CHUNKS);
ok("chunks: HSK 1–3, 4, 5, 6 and 7–9 in three parts", chunkIds.join(" ") === "hsk1-3 hsk4 hsk5 hsk6 hsk7-9a hsk7-9b hsk7-9c", chunkIds);
ok("HSK 1–3 chunk unchanged: the 923 characters it had", [...HANZI_CHUNKS["hsk1-3"]].length === 923 && [...levels.get("1")!, ...levels.get("2")!, ...levels.get("3")!].every((c) => hanziChunk(c) === "hsk1-3"));
// A band's characters are in its own chunk, or a lower one when a lower character has them as a
// traditional form (座 for 坐, 覆 for 复, 俱 for 具).
const lowerOrOwn = (lv: string, own: string[]) => levels.get(lv)!.filter((c) => !own.includes(hanziChunk(c)!));
ok("each band's characters in its own chunk", !lowerOrOwn("4", ["hsk4", "hsk1-3"]).length && !lowerOrOwn("6", ["hsk1-3", "hsk4", "hsk5", "hsk6"]).length && !lowerOrOwn("7-9", ["hsk7-9a", "hsk7-9b", "hsk7-9c"]).length && levels.get("5")!.filter((c) => hanziChunk(c) !== "hsk5").length === 0 && hanziChunk("座") === "hsk1-3" && hanziChunk("俱") === "hsk4");
ok("traditional forms in the lowest band that needs them", hanziChunk("學") === "hsk1-3" && hanziChunk("驟") === "hsk6" && hanziChunk("髮") === "hsk1-3");
// Syllabus forms Make Me a Hanzi lacks (s2tw of 污 湿 哗): not traceable, and the checker says why.
// Each has another Taiwan form with strokes (濕 污 嘩), traceable with trad=.
ok("no strokes for 汙 溼 譁", JSON.stringify(HANZI_NO_STROKES) === '{"汙":"污","溼":"濕","譁":"嘩"}' && ![..."汙溼譁"].some(isTraceHanzi) && [..."污濕嘩"].every(isTraceHanzi), HANZI_NO_STROKES);
ok("missing ones reported as untraceable", parseTrace("", "溼", "zh").problems[0] === `"溼" can't be traced: the hanzi stroke data (Make Me a Hanzi) has no strokes for it; trace 濕 instead (trad=濕)` && parseTrace("", "toString", "zh").problems.every((p) => !p.includes("instead")), parseTrace("", "溼", "zh").problems);
// The Chinese track's traditional overrides (erudior-courses chinese-scripts/traditional.yaml): 台 stays
// 台 (and 臺 颱 檯 are kept), 別著急, 了解, 胡同.
ok("the track's override characters are traceable", [..."台臺颱檯別著了解胡同"].every(isTraceHanzi), [..."台臺颱檯別著了解胡同"].filter((c) => !isTraceHanzi(c)));
ok("Taiwan forms, including one-to-many ones", [..."學語東們這發髮麵乾幹鐘鍾隻係週複"].every(isTraceHanzi), [..."學語東們這發髮麵乾幹鐘鍾隻係週複"].filter((c) => !isTraceHanzi(c)));
ok("not beyond the subset", !isTraceHanzi("鰯") && !isTraceHanzi("a") && !isTraceHanzi("あ"));
ok("source commit recorded", /^[0-9a-f]{40}$/.test(MAKEMEAHANZI_COMMIT));

// --- Licence: the Arphic Public License travels with the data ---------------------------------
const dataFiles = readdirSync("src/lib").filter((f) => /^hanziStrokes\..*data\.ts$/.test(f));
ok("one data file per chunk", dataFiles.sort().join(" ") === chunkIds.map((id) => `hanziStrokes.${id}.data.ts`).sort().join(" "), dataFiles);
for (const f of dataFiles) {
  const dataSrc = readFileSync(`src/lib/${f}`, "utf8");
  ok(`${f} carries the notice of modification`, /NOTICE OF MODIFICATION \(Arphic Public License, section 2a\)/.test(dataSrc) && dataSrc.includes(MAKEMEAHANZI_COMMIT) && /changed from graphics\.txt on\s*\/\/ \d{4}-\d{2}-\d{2}/.test(dataSrc));
}
const apl = readFileSync("scripts/licenses/makemeahanzi-ARPHICPL-COPYING.txt", "utf8").trim();
const third = readFileSync("public/third-party-licenses.txt", "utf8");
ok("licence text is the Arphic Public License", apl.startsWith("ARPHIC PUBLIC LICENSE") && apl.includes("You must insert a prominent notice in each modified file"));
ok("third-party-licenses.txt has the notice and the full licence", third.includes(readFileSync("scripts/licenses/makemeahanzi-NOTICE.txt", "utf8").trim()) && third.includes(apl));

// --- Before the data loads ----------------------------------------------------------------------
ok("not loaded yet", !hanziStrokesLoaded("们") && !letterGuide("们", "zh"));
ok("traced hanzi", tracedHanzi("学\n\n```trace\n们 學 a 鰯 们\n```\n\n```trace\n嚼\n```").join("") === "们學嚼" && !tracedHanzi("们学").length);
ok("needs the data", needsHanziStrokes("```trace\n们\n```") && !needsHanziStrokes("```trace\na\n```") && !needsHanziStrokes("们\n\n```trace\na\n```"));
const before = parseTrace("", "们 学 學", "zh");
ok("zh trace parses hanzi before loading", before.letters.join("") === "们学學" && !before.problems.length && before.script === "zh", before);
const pending = renderTrace(before);
ok("pending hanzi pads", (pending.match(/is-hanzi is-pending/g) ?? []).length === 3 && pending.includes("Trace the hanzi 们: loading its strokes."), pending.slice(0, 500));
ok("unknown hanzi refused in zh", parseTrace("", "鰯", "zh").problems.some((p) => p.includes("hanzi tracing covers the characters of HSK 1–9")));
ok("zh course problems", phonicsProblems("```trace\n们鰯\n```", "zh").length === 1 && !phonicsProblems("```trace\n们學\n```", "zh").length);
// Without "zh" (Japanese and other courses) Han characters stay kanji: 们 is not a jōyō kanji.
ok("without zh, 们 is no kanji", parseTrace("", "们").problems.some((p) => p.includes("jōyō")) && !parseTrace("", "学").problems.length && parseTrace("", "学").script === undefined);
ok("canonical lesson source: zh courses accept hanzi", !validateLessonSource("```trace\n们\n```", { traceScript: "zh" }).length && validateLessonSource("```trace\n们\n```").length > 0);

// --- Loaded: chunk by chunk, guides from the medians, outlines for display ---------------------------
for (const id of chunkIds) {
  const data = (await import(`../src/lib/hanziStrokes.${id}.data.ts`)).default as Record<string, string>;
  ok(`chunk ${id} holds its list exactly`, Object.keys(data).join("") === HANZI_CHUNKS[id as keyof typeof HANZI_CHUNKS], id);
}
await loadHanziStrokes("们");
ok("a lesson loads only its chunks", hanziStrokesLoaded("们") && hanziStrokesLoaded("學") && !hanziStrokesLoaded("鼻") && !hanziStrokesLoaded("嚼") && !needsHanziStrokes("```trace\n们\n```") && needsHanziStrokes("```trace\n们嚼\n```"));
await loadHanziStrokes("嚼");
ok("HSK 7–9 part loads alone", hanziStrokesLoaded("嚼") && !hanziStrokesLoaded("鼻") && !needsHanziStrokes("```trace\n们嚼\n```"));
await loadHanziStrokes(TRACE_HANZI);
ok("every chunk loads", traceable.every(hanziStrokesLoaded));
const KANJI = (await import("../src/lib/kanjiStrokes.data.ts")).default as Record<string, string>;
addKanjiStrokes(KANJI);
ok("loaded", hanziStrokesLoaded("们") && !needsHanziStrokes("```trace\n们\n```") && !!letterGuide("们", "zh")?.hanzi);
ok("median commands", medianCommands("1 2 3.5 4") === "M 1 2 L 3.5 4");
const COUNTS: Record<string, number> = { 一: 1, 十: 2, 人: 2, 三: 3, 口: 3, 们: 5, 你: 7, 好: 6, 学: 8, 學: 16, 語: 14, 东: 5, 東: 8, 发: 5, 髮: 15, 马: 3, 馬: 10, 鼻: 14, 龄: 13, 骤: 17, 驟: 24, 嚼: 20, 攀: 19 };
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
ok("45,000+ strokes checked", strokes > 45000, strokes);
ok("15,000+ long strokes", longOnes > 15000, longOnes);

// --- A live pad: trace 十 stroke by stroke ----------------------------------------------------------
const host = document.createElement("div");
document.body.append(host);
host.innerHTML = renderTrace(parseTrace("", "十", "zh"));
const svg = host.querySelector<SVGSVGElement>("svg.trace-pad")!;
(svg as unknown as { getScreenCTM: () => unknown }).getScreenCTM = () => ({ inverse: () => ({}) });
hydratePhonics(host, { lang: "en-US" });
ok("hanzi pad is live", svg.classList.contains("is-live") && !host.querySelector(".tr-actions")!.hasAttribute("hidden"));
const fire = (type: string, [x, y]: Pt) => {
  const e = new dom.window.MouseEvent(type, { clientX: x, clientY: y, bubbles: true, cancelable: true });
  Object.defineProperty(e, "pointerId", { value: 1 });
  svg.dispatchEvent(e);
};
const draw = (pts: Pt[]) => {
  fire("pointerdown", pts[0]);
  for (const p of pts.slice(1)) fire("pointermove", p);
  fire("pointerup", pts[pts.length - 1]);
};
const status = () => host.querySelector(".tr-status")!.textContent ?? "";
const shi = letterGuide("十", "zh")!.strokes;
draw(shi[0].slice().reverse());
ok("backwards: follow the arrow", /Follow the arrow on stroke 1|Start at number 1/.test(status()), status());
draw(shi[0]);
ok("stroke 1 done", status().startsWith("Stroke 1 done") && host.querySelector('.tr-outline[data-s="0"]')!.classList.contains("is-done") && host.querySelector('.tr-outline[data-s="1"]')!.classList.contains("is-current"), status());
ok("hanzi pads say nothing until the end", spoken.length === 0, spoken);
draw(shi[1]);
ok("finished: written in English", status() === "You traced the hanzi 十. Great job!" && host.querySelector(".ph-trace-item")!.classList.contains("is-done"), status());
ok("finished: the character spoken in Chinese", spoken.length === 1 && spoken[0].text === "十" && spoken[0].lang === "zh-CN", spoken);
handlePhonicsClick(host.querySelector('[data-tr="clear"]')!, { lang: "en-US" });
ok("start over", status() === "" && host.querySelector('.tr-outline[data-s="0"]')!.classList.contains("is-current"));

// --- The course checker: Chinese courses check hanzi, Japanese ones kanji -----------------------------
const { checkCourse } = await import("./check-course.mts");
ok("Chinese demo traces hanzi and is clean", (await checkCourse("samples/demo-chinese.json", { runs: 1 })).length === 0 && readFileSync("samples/demo-chinese.json", "utf8").includes("```trace\\n人 你 好 们 学 學\\n```"));
ok("Japanese demo still clean", (await checkCourse("samples/demo-japanese.json", { runs: 1 })).length === 0);

// --- Bundles: the data stays out of the community API worker and the main code ---------------
const seen = new Set<string>();
const visit = (file: string) => {
  file = path.resolve(file);
  if (seen.has(file) || !existsSync(file)) return;
  seen.add(file);
  for (const m of readFileSync(file, "utf8").matchAll(/(?:from\s*|import\s*\(?\s*)["'](\.[^"']+)["']/g)) {
    let f = path.resolve(path.dirname(file), m[1]);
    if (!path.extname(f)) f += existsSync(f + ".ts") ? ".ts" : ".tsx";
    visit(f);
  }
};
visit("worker/src/index.ts");
const rel = [...seen].map((f) => path.relative(process.cwd(), f));
ok("worker validates hanzi (list) but never loads the data", rel.includes("src/lib/hanziList.ts") && !rel.some((f) => /hanziStrokes\..*data|hanziLoad/.test(f)), rel.filter((f) => /hanzi/.test(f)));
const staticImports = (f: string) => [...readFileSync(f, "utf8").matchAll(/^import[^;]*from\s*["']([^"']+)["']/gm)].map((m) => m[1]);
ok("nothing imports the data statically", ["src/lib/hanziLoad.ts", "src/lib/hanziStrokes.ts", "src/lib/handwriting.ts", "src/lib/phonics.ts", "src/lib/phonicsSpec.ts", "src/components/Markdown.tsx"].every((f) => !staticImports(f).some((s) => /hanziStrokes\..*data/.test(s))));

if (fails) {
  console.log(`${fails} hanzi test(s) failed`);
  process.exit(1);
}
console.log("hanzi tests passed");

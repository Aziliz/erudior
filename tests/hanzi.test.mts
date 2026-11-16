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
ok("Taiwan forms, including one-to-many ones", [..."學語東們這發髮麵乾幹鐘鍾隻係週複颱"].every(isTraceHanzi), [..."學語東們這發髮麵乾幹鐘鍾隻係週複颱"].filter((c) => !isTraceHanzi(c)));
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

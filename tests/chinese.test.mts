// Chinese support, feature 1: pinyin markup {汉字|hàn zì} as ruby, the Pinyin and Tone colours
// switches, checker rules, answer checking without markup, read-aloud of the characters.
// Run: npx tsx tests/chinese.test.mts
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { JSDOM } from "jsdom";
import { normJa, rubyHtml, rubyReading, rubySearchText, stripRuby } from "../src/lib/kana.ts";
import { pinyinPairs, pinyinProblems, pinyinReadingProblem, pinyinRubyHtml, toneWord } from "../src/lib/pinyin.ts";
import { textMatches } from "../src/lib/questions.ts";
import { mathTextSpeech } from "../src/lib/readAloud.ts";
import { exportCourseSnapshot, normalizeCourse } from "../src/lib/course.ts";
import { canonicalAuthoringFromCourse, validateCanonicalAuthoring } from "../src/lib/canonicalAuthoring.ts";

// --- Pairing characters with syllables ---------------------------------------------------------
const pairs = (b: string, r: string, other = false) => pinyinPairs(b, r, other)?.map((p) => `${p.base}:${p.syl}:${p.tone}`).join(" ") ?? null;
assert.equal(pairs("汉字", "hàn zì"), "汉:hàn:4 字:zì:4");
assert.equal(pairs("谢谢", "xiè xie"), "谢:xiè:4 谢:xie:0", "neutral tone = no mark");
assert.equal(pairs("女儿", "nǚ ér"), "女:nǚ:3 儿:ér:2", "儿 read as its own syllable");
assert.equal(pairs("一点儿", "yì diǎnr"), "一:yì:4 点儿:diǎnr:3", "erhua syllable covers 儿");
assert.equal(pairs("西安", "Xī'ān"), "西:Xī:1 安:ān:1", "apostrophe separates syllables");
assert.equal(pairs("中国", "Zhōng guó"), "中:Zhōng:1 国:guó:2", "capitals allowed");
assert.equal(pairs("你好", "nǐhǎo"), null, "syllables must be separated");
assert.equal(pairs("你好", "ni3 hao3"), null, "tone numbers rejected");
assert.equal(pairs("你好", "nǐ"), null, "count must match");
assert.equal(pairs("你", "nǐ hǎo"), null);
assert.equal(pairs("3个", "sān gè"), null, "markup base is Han only");
assert.equal(pairs("卡拉OK", "kǎ lā", true), "卡:kǎ:3 拉:lā:1 O::-1 K::-1", "vocab terms may hold other characters");
assert.equal(pairs("猫", "ねこ"), null);
assert.equal(toneWord(3), "tone 3");
assert.equal(toneWord(0), "neutral tone");

// --- Ruby HTML --------------------------------------------------------------------------------
const html = rubyHtml("我说{你好|nǐ hǎo}。");
assert.ok(html.startsWith('我说<ruby class="py" lang="zh">'), html);
assert.ok(html.includes('<span class="tn t3">你</span>'), html);
assert.ok(html.includes('<rt class="tn t3" lang="zh-Latn">nǐ</rt>'), html);
assert.ok(html.includes('<span class="sr-only tone-sr" lang="en"> (tone 3)</span>'), html);
assert.equal((html.match(/<rt /g) ?? []).length, 2, "one syllable over each character");
assert.ok(rubyHtml("{a|b} and {x|x>0}").includes("{a|b}"), "braces without Han stay");
assert.ok(rubyHtml("{猫|ねこ}").startsWith("<ruby>猫<rp>"), "furigana unchanged");
assert.ok(rubyHtml("{你好|ni3 hao3}") === "{你好|ni3 hao3}", "bad markup is left as written");
assert.ok(pinyinRubyHtml(pinyinPairs("<好", "hǎo", true)!).includes("&lt;"), "escapes");

// --- Markup reduced for answers, search and speech ----------------------------------------------
assert.equal(stripRuby("{你好|nǐ hǎo}，{一点儿|yì diǎnr}"), "你好，一点儿");
assert.equal(rubyReading("{你好|nǐ hǎo}"), "nǐ hǎo");
assert.equal(rubySearchText("{你好|nǐ hǎo}"), "你好 nǐ hǎo");
assert.equal(normJa("{你好|nǐ hǎo}！"), "你好");
assert.ok(textMatches("中国", ["{中国|Zhōng guó}"]), "accepted answer with markup");
assert.ok(textMatches("{中国|Zhōng guó}", ["中国"]), "typed markup ignored");
assert.equal(mathTextSpeech("{你好|nǐ hǎo}！"), "你好！", "read-aloud reads the characters");

// --- Checker messages ---------------------------------------------------------------------------
const probs = (t: string) => pinyinProblems(t).map((p) => p.problem);
assert.deepEqual(probs("{你好|nǐ hǎo} {一点儿|yì diǎnr} {x|x>0} {女儿|nǚ ér}"), []);
assert.match(probs("{你好|ni3 hao3}")[0], /tone marks, not tone numbers \("nǐ hǎo"\)/);
assert.match(probs("{你好|nǐhǎo}")[0], /more than one tone mark/);
assert.match(probs("{你好|nǐ}")[0], /2 characters but 1 syllable/);
assert.match(probs("{3个|sān gè}")[0], /keep "3" outside/);
assert.match(probs("{好|はい}")[0], /must be pinyin/);
assert.match(probs("{绿|lv}")[0], /isn't a pinyin syllable/);
assert.match(probs("{abc|nǐ}")[0], /base must be Han/);
assert.equal(pinyinReadingProblem("卡拉OK", "kǎ lā", true), undefined);

// --- Course checker and canonical schema -------------------------------------------------------
const { checkCourse } = await import("./check-course.mts");
assert.deepEqual(await checkCourse("samples/demo-chinese.json", { runs: 1 }), [], "demo course is clean");
const demo = JSON.parse(readFileSync("samples/demo-chinese.json", "utf8"));
const portable = JSON.parse(exportCourseSnapshot(normalizeCourse(demo)));
const payload = canonicalAuthoringFromCourse(portable, { mode: "source", maxBytes: Number.MAX_SAFE_INTEGER });
assert.deepEqual(validateCanonicalAuthoring(payload, { mode: "source" }), [], "zh language config and vocab accepted");
assert.deepEqual(payload.course.language, { code: "zh", name: "Chinese", tts: "zh-CN", ime: "zh", level: "HSK 1" });
{
  const dir = mkdtempSync(join(tmpdir(), "zh-check-"));
  try {
    const bad = structuredClone(demo);
    bad.lessons[0].body = "{你好|ni3 hao3} {你好|nǐ} {3个|sān gè}";
    bad.vocab = [
      { id: "a", lesson: "zh-l1", term: "你好", meanings: ["hello"] },
      { id: "b", lesson: "zh-l1", term: "你好", reading: "nǐhǎo", meanings: ["hello"] },
      { id: "c", lesson: "zh-l1", term: "你好", reading: "ni3 hao3", meanings: ["hello"] },
      { id: "d", lesson: "zh-l1", term: "{你好|nǐ hǎo}", reading: "nǐ hǎo", meanings: ["hello"] },
      { id: "e", lesson: "zh-l1", term: "nihao", reading: "nǐ hǎo", meanings: ["hello"] },
      { id: "f", lesson: "zh-l1", term: "谢谢", reading: "xiè", meanings: ["thanks"], example: "{谢谢|xie4 xie}" },
    ];
    const f = join(dir, "bad.json");
    writeFileSync(f, JSON.stringify(bad));
    const got = (await checkCourse(f, { runs: 1 })).join("\n");
    for (const want of [
      /lesson zh-l1.*\{你好\|ni3 hao3\}: use tone marks/,
      /\{你好\|nǐ\}: 2 characters but 1 syllable/,
      /\{3个\|sān gè\}: the base must be Han characters only/,
      /word a: "你好" needs a "reading"/,
      /word b: "reading" "nǐhǎo": "nǐhǎo" has more than one tone mark/,
      /word c: "reading" "ni3 hao3": use tone marks/,
      /word d: "term" must be plain text/,
      /word e: "term" must be written in Chinese characters/,
      /word f: "reading" "xiè": 2 characters but 1 syllable/,
      /word f: \{谢谢\|xie4 xie\}: use tone marks/,
    ])
      assert.match(got, want);
    // The same markup in a Japanese course isn't checked as pinyin.
    bad.language = { code: "ja", name: "Japanese" };
    bad.vocab = [];
    bad.lessons[0].body = "{猫|ねこ}";
    writeFileSync(f, JSON.stringify(bad));
    assert.ok(!(await checkCourse(f, { runs: 1 })).some((p) => /tone marks|syllable|Han characters/.test(p)));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

// --- Rendering in the page ---------------------------------------------------------------------
const dom = new JSDOM("<!doctype html><html><body></body></html>", { url: "https://example.test", pretendToBeVisual: true });
Object.assign(globalThis, { window: dom.window, document: dom.window.document, HTMLElement: dom.window.HTMLElement, localStorage: dom.window.localStorage });
Object.defineProperty(globalThis, "navigator", { configurable: true, value: dom.window.navigator });
const { renderMarkdown } = await import("../src/components/Markdown.tsx");
const { speechText } = await import("../src/lib/readAloud.ts");
const md = renderMarkdown("{我|wǒ}{喜欢|xǐ huan}\n{喝|hē}{茶|chá}。\n中文\n{你好|nǐ hǎo}");
assert.ok(!/\n/.test(md.replace(/\n$/, "")), `soft breaks joined: ${md}`);
const p = dom.window.document.createElement("p");
p.innerHTML = md;
assert.equal(p.querySelectorAll("ruby.py rt").length, 7);
assert.equal(speechText(p).replace(/\.$/, ""), "我喜欢喝茶。中文你好", "speech reads characters, no pinyin or tone words");
assert.equal(p.querySelector("ruby.py")?.getAttribute("lang"), "zh");

// --- Switches (per device) and RubyText --------------------------------------------------------
const Ruby = await import("../src/components/Ruby.tsx");
const root = dom.window.document.documentElement;
localStorage.clear();
assert.equal(Ruby.pinyinOn(), true, "pinyin on by default");
assert.equal(Ruby.toneColoursOn(), false, "tone colours off by default");
Ruby.applyPinyin();
Ruby.applyToneColours();
assert.ok(!root.classList.contains("pinyin-off") && !root.classList.contains("tones-on"));
Ruby.setPinyin(false);
Ruby.setToneColours(true);
assert.ok(root.classList.contains("pinyin-off") && root.classList.contains("tones-on"));
assert.equal(localStorage.getItem("erudior.pinyin"), "off");
assert.equal(localStorage.getItem("erudior.tones"), "on");
assert.equal(Ruby.pinyinOn(), false);
assert.equal(Ruby.toneColoursOn(), true);
Ruby.setPinyin(true);
Ruby.setToneColours(false);
assert.ok(!root.classList.contains("pinyin-off") && !root.classList.contains("tones-on"));
Ruby.setFurigana(false);
assert.ok(root.classList.contains("furigana-off") && !root.classList.contains("pinyin-off"), "furigana switch is separate");
Ruby.setFurigana(true);

const { createElement: h } = await import("react");
const { renderToStaticMarkup } = await import("react-dom/server");
const term = renderToStaticMarkup(h(Ruby.RubyText, { text: "一点儿", reading: "yì diǎnr", lang: "zh" }));
assert.ok(term.includes('<ruby class="py" lang="zh">') && term.includes(">diǎnr</rt>") && term.includes("点儿"), term);
assert.equal(renderToStaticMarkup(h(Ruby.RubyText, { text: "你好", reading: "nǐ", lang: "zh" })), "你好", "a reading that doesn't fit shows plain");
assert.ok(renderToStaticMarkup(h(Ruby.RubyText, { text: "{你好|nǐ hǎo}！", lang: "zh" })).includes("</ruby>！"));
const toggles = renderToStaticMarkup(h(Ruby.LanguageToggles, { code: "zh" }));
assert.ok(toggles.includes("Pinyin on") && toggles.includes("Tone colours off") && toggles.includes('aria-pressed="false"'), toggles);
assert.equal(renderToStaticMarkup(h(Ruby.LanguageToggles, { code: "de" })), "");
assert.ok(renderToStaticMarkup(h(Ruby.LanguageToggles, { code: "ja" })).includes("Furigana"));

// --- Tone colours: contrast in every theme -----------------------------------------------------
const css = readFileSync("src/styles.css", "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
const vars = (selector: string, need: string) => {
  const blocks = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].filter((m) => m[1].split(";").pop()!.trim().split(/\s*,\s*/).includes(selector) && m[2].includes(need));
  assert.ok(blocks.length, `${selector} with ${need}`);
  const out: Record<string, string> = {};
  for (const [, name, value] of blocks[0][2].matchAll(/--([\w-]+):\s*(#[0-9a-f]{6})/gi)) out[name] = value;
  return out;
};
const lum = (hex: string) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((x) => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a: string, b: string) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};
const themes: [string, string, string, number][] = [
  ["light", ":root", ":root", 4.5],
  ["sepia", ':root[data-theme="sepia"]', ":root", 4.5],
  ["dark", ':root[data-theme="dark"]', ':root[data-theme="dark"]', 4.5],
  ["dim", ':root[data-theme="dim"]', ':root[data-theme="dim"]', 4.5],
  ["contrast", ':root[data-theme="contrast"]', ':root[data-theme="contrast"]', 7],
];
for (const [name, bgSel, toneSel, need] of themes) {
  const bg = vars(bgSel, "--paper:");
  const tones = vars(toneSel, "--tone-1:");
  for (const t of ["1", "2", "3", "4", "0"])
    for (const b of ["paper", "surface", "sheet"]) {
      assert.ok(tones[`tone-${t}`] && bg[b], `${name}: tone-${t} / ${b} missing ${JSON.stringify([tones, bg])}`);
      const r = ratio(tones[`tone-${t}`], bg[b]);
      assert.ok(r >= need, `${name} tone ${t} on ${b}: ${r.toFixed(2)} < ${need}`);
    }
}
const darkAuto = vars(":root:not([data-theme])", "--tone-1:");
assert.deepEqual(darkAuto, vars(':root[data-theme="dark"]', "--tone-1:"), "system dark mode uses the dark tone colours");

console.log("chinese: pinyin pairing, ruby, markup stripping, checker, rendering, switches and tone contrast passed");

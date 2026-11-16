// Chinese support, feature 2: pinyin typing (tone numbers → marks) and grading of pinyin
// answers in vocab recall and text questions.
// Run: npx tsx tests/pinyin-typing.test.mts
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import type { Question, VocabItem } from "../src/lib/types.ts";

// A DOM before the components load (DOMPurify binds to window when imported).
const dom = new JSDOM("<!doctype html><html><body></body></html>", { url: "https://example.test" });
Object.assign(globalThis, { window: dom.window, document: dom.window.document, HTMLElement: dom.window.HTMLElement, localStorage: dom.window.localStorage });
Object.defineProperty(globalThis, "navigator", { configurable: true, value: dom.window.navigator });
const React = await import("react");
const { renderToStaticMarkup } = await import("react-dom/server");
const { default: QuestionBody } = await import("../src/components/QuestionBody.tsx");
const { imeFor } = await import("../src/lib/ime.ts");
const { isPinyinAnswer, normPinyin, onlyTonesDiffer, splitsIntoPinyin } = await import("../src/lib/pinyin.ts");
const { checkAnswer, checkRecall } = await import("../src/lib/vocab.ts");
const { isCorrect, pinyinBlank, textMatches, toneMissOf } = await import("../src/lib/questions.ts");

// --- The zh IME ----------------------------------------------------------------------------------
const ime = imeFor({ code: "zh", ime: "zh" } as never)!;
assert.ok(ime, "zh IME registered");
const typing: [string, string][] = [
  ["ni3hao3", "nǐhǎo"],
  ["ni3 hao3", "nǐ hǎo"],
  ["lv4", "lǜ"],
  ["lu:4", "lǜ"],
  ["nv3", "nǚ"],
  ["lve4", "lüè"],
  ["ma5", "ma"],
  ["ma0", "ma"],
  ["xie4xie5", "xièxie"],
  ["liu2", "liú"],
  ["gui4", "guì"],
  ["dou1", "dōu"],
  ["xiong2", "xióng"],
  ["zhuang1", "zhuāng"],
  ["Bei3jing1", "Běijīng"],
  ["er4", "èr"],
  ["nǐhǎo", "nǐhǎo"],
  ["你好", "你好"],
  ["我是", "我是"],
  ["你hao3", "你hǎo"],
  ["ni", "ni"],
];
for (const [typed, want] of typing) assert.equal(ime(typed), want, typed);
// Run on the whole value after every keystroke: converted text stays put.
let box = "";
for (const ch of "ni3hao3") box = ime(box + ch);
assert.equal(box, "nǐhǎo");
assert.equal(ime(ime("lv4")), "lǜ");
assert.equal(ime("hao3", { final: true }), "hǎo", "final changes nothing extra");

// --- Normalising and detecting pinyin ------------------------------------------------------------
assert.equal(normPinyin("Nǐ Hǎo"), normPinyin("nǐhǎo"), "case and spaces ignored");
assert.equal(normPinyin("Xī'ān"), normPinyin("xī ān"), "apostrophes ignored");
assert.equal(normPinyin("lv4"), normPinyin("lǜ"), "v and tone digits");
assert.equal(normPinyin("qü"), normPinyin("qu"), "ü after j q x y is u");
assert.equal(normPinyin("xǘe"), normPinyin("xúe"));
assert.notEqual(normPinyin("lù"), normPinyin("lǜ"), "lu and lü stay different");
assert.notEqual(normPinyin("mā"), normPinyin("mǎ"), "tones kept");
assert.ok(splitsIntoPinyin("nǐhǎo"));
assert.ok(splitsIntoPinyin("zhōngguó"));
assert.ok(!splitsIntoPinyin("mǎǐ"), "one tone mark per syllable");
assert.ok(!splitsIntoPinyin("está"));
assert.ok(isPinyinAnswer("nǐ hǎo"));
assert.ok(isPinyinAnswer("Běijīng"));
assert.ok(isPinyinAnswer("nǐ hǎo!"));
assert.ok(isPinyinAnswer("Xī'ān"));
assert.ok(!isPinyinAnswer("ni hao"), "no tone mark: not treated as pinyin");
assert.ok(!isPinyinAnswer("你好"));
assert.ok(!isPinyinAnswer("está"), "Spanish isn't pinyin");
// Pinyin-shaped words in other languages ("père") take the pinyin comparison, which still needs the accent.
assert.ok(!textMatches("pere", ["père"]) && textMatches("Père", ["père"]));
assert.ok(onlyTonesDiffer("ni hao", "nǐ hǎo"));
assert.ok(onlyTonesDiffer("ni2hao3", "nǐ hǎo"));
assert.ok(!onlyTonesDiffer("ni3hao3", "nǐ hǎo"), "right tones");
assert.ok(!onlyTonesDiffer("ni3 men5", "nǐ hǎo"), "different syllables");
assert.ok(!onlyTonesDiffer("你好", "nǐ hǎo"));

// --- Vocab recall (English → Chinese) ------------------------------------------------------------
const nihao: VocabItem = { id: "nihao", term: "你好", reading: "nǐ hǎo", meanings: ["hello"], lesson: "l1" } as VocabItem;
const lv: VocabItem = { id: "lv", term: "绿", reading: "lǜ", meanings: ["green"], lesson: "l1" } as VocabItem;
const xian: VocabItem = { id: "xian", term: "西安", reading: "Xī'ān", meanings: ["Xi'an"], lesson: "l1" } as VocabItem;
const zh = (item: VocabItem, typed: string, tonesHinted = false) => checkRecall(item, typed, "zh", { tonesHinted });
for (const t of ["你好", " 你好 ", "你好！", "nǐ hǎo", "nǐhǎo", "Nǐ Hǎo", "ni3hao3", "ni3 hao3", "NI3HAO3"]) assert.equal(zh(nihao, t).ok, true, t);
for (const t of ["lǜ", "lv4", "lu:4", "LV4", "lǜ "]) assert.equal(zh(lv, t).ok, true, t);
for (const t of ["xī'ān", "xi1an1", "Xi1'an1", "xī ān"]) assert.equal(zh(xian, t).ok, true, t);
assert.equal(zh(nihao, "我好").ok, false, "wrong characters");
assert.equal(zh(nihao, "我好").retry, undefined, "wrong characters: a miss");
assert.equal(zh(nihao, "妳好").ok, false, "traditional variant not in term");
{
  const v = zh(nihao, "ni hao");
  assert.equal(v.ok, false);
  assert.equal(v.ok === false && v.retry, true, "missing tones: one more try");
  assert.match(v.note ?? "", /Add the tones/);
  const w = zh(nihao, "ni2 hao3");
  assert.equal(w.ok === false && w.retry, true, "wrong tone: one more try");
  assert.match(w.note ?? "", /Check the tones/);
  assert.ok(!(w.note ?? "").includes("nǐ"), "the retry doesn't give the answer away");
  const x = zh(nihao, "ni2 hao3", true);
  assert.equal(x.ok, false);
  assert.ok(!(x.ok === false && x.retry), "second time: a miss");
  assert.equal(x.note, "Check the tones: nǐ hǎo");
  assert.equal(zh(lv, "lu4").ok, false, "lu ≠ lü");
  assert.ok(!(zh(lv, "lu4") as { retry?: boolean }).retry, "lu4 is another word: a miss, not a tone retry");
}
assert.match(zh(nihao, "ni3 3").note ?? "", /tone number/, "stray digit: retry");
assert.equal(zh(nihao, "  ").ok === false && zh(nihao, "  ").retry, true);
assert.equal(checkAnswer({ item: nihao, dir: "recall", key: "k" } as never, "ni3hao3", "zh").ok, true);
assert.equal(checkAnswer({ item: nihao, dir: "meaning", key: "k" } as never, "hello", "zh").ok, true);

// --- Text questions ------------------------------------------------------------------------------
assert.ok(textMatches("ni3hao3", ["nǐ hǎo"]));
assert.ok(textMatches("Nǐhǎo", ["nǐ hǎo"]));
assert.ok(textMatches("nǐ hǎo", ["nǐ hǎo"]));
assert.ok(!textMatches("ni hao", ["nǐ hǎo"]), "tones required");
assert.ok(!textMatches("ni2 hao3", ["nǐ hǎo"]));
assert.ok(textMatches("lv4", ["lǜ"]));
assert.ok(textMatches("你好", ["你好"]), "characters still compare as before");
assert.ok(textMatches("你 好。", ["你好"]));
assert.ok(textMatches("esta", ["esta"]) && !textMatches("esta", ["está"]), "accented Latin answers unchanged");
assert.ok(!textMatches("Nǐ hǎo", ["nǐ hǎo"], true), "caseSensitive keeps plain comparison");
assert.equal(toneMissOf("ni hao", ["nǐ hǎo"]), "nǐ hǎo");
assert.equal(toneMissOf("ni3 hao3", ["nǐ hǎo"]), undefined);
assert.equal(toneMissOf("ta1", ["nǐ hǎo"]), undefined);
assert.ok(pinyinBlank(["nǐ hǎo"]) && !pinyinBlank(["你好"]) && !pinyinBlank(undefined));

const q = {
  id: "q1",
  type: "text",
  stem: "How do you say hello? ___ (pinyin) ___ (characters)",
  choices: [],
  answer: [],
  accept: [["nǐ hǎo"], ["你好"]],
} as unknown as Question;
assert.ok(isCorrect(q, ["ni3hao3", "你好"]));
assert.ok(!isCorrect(q, ["ni hao", "你好"]));

// Rendering: the pinyin blank is typed as pinyin (zh-Latn), the character blank isn't.
const render = (props: Record<string, unknown>) => renderToStaticMarkup(React.createElement(QuestionBody as never, { q, order: [], chosen: [], ...props }));
{
  const html = render({ ime, lang: "zh" });
  const langs = [...html.matchAll(/<input[^>]*lang="([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(langs, ["zh-Latn", "zh"]);
  const shown = render({ ime, lang: "zh", reveal: true, chosen: ["ni2 hao3", "你好"] });
  assert.match(shown, /Check the tones: <span lang="zh-Latn">nǐ hǎo<\/span>/);
  const right = render({ ime, lang: "zh", reveal: true, chosen: ["ni3 hao3", "你好"] });
  assert.ok(!right.includes("Check the tones"));
  // Japanese courses keep their IME in every blank.
  const ja = render({ ime: imeFor({ code: "ja", ime: "ja" } as never), lang: "ja" });
  assert.deepEqual([...ja.matchAll(/<input[^>]*lang="([^"]+)"/g)].map((m) => m[1]), ["ja", "ja"]);
}

console.log("pinyin-typing tests passed");

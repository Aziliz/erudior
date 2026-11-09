// Japanese support: romaji → kana input, furigana markup, answer checking.
import {
  accentWords, autoRuby, isKanaOnly, moraCount, morae, normJa, pitchHtml, pitchLabel, pitchPattern, romajiToKana, rubyHtml,
  rubyProblems, rubyReading, rubySearchText, splitReading, stripRuby, toHiragana, toKatakana, validAccent,
} from "../src/lib/kana.ts";
import { mathTextSpeech, speechText } from "../src/lib/readAloud.ts";
import { normalizeCourse } from "../src/lib/course.ts";
import { validateCanonicalAuthoring } from "../src/lib/canonicalAuthoring.ts";
import { checkCourse } from "./check-course.mts";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { checkRecall } from "../src/lib/vocab.ts";
import { textMatches } from "../src/lib/questions.ts";
import { renderMathText } from "../src/lib/math.ts";
import { imeFor } from "../src/lib/ime.ts";
import type { VocabItem } from "../src/lib/types.ts";

let fails = 0;
const ok = (name: string, cond: boolean, extra?: unknown) => {
  if (!cond) {
    fails++;
    console.log("FAIL", name, extra ?? "");
  }
};
const eq = (name: string, got: unknown, want: unknown) => ok(name, got === want, { got, want });

// --- Converter ------------------------------------------------------------------------------
const conv: [string, string, { katakana?: boolean; final?: boolean }?][] = [
  ["konnichiha", "こんにちは"], ["onna", "おんな"], ["annai", "あんない"], ["kon'ya", "こんや"], ["konya", "こにゃ"],
  ["kippu", "きっぷ"], ["gakkou", "がっこう"], ["matcha", "まっちゃ"], ["kyou", "きょう"], ["ryokou", "りょこう"],
  ["shinbun", "しんぶん", { final: true }], ["shinbu", "しんぶ"], ["hon", "ほn"], ["hon", "ほん", { final: true }],
  ["nn", "ん"], ["kanji", "かんじ"], ["shi si chi ti tsu tu fu hu ji zi", "し し ち ち つ つ ふ ふ じ じ"],
  ["wo", "を"], ["denwa", "でんわ"], ["xtu ltu xya", "っ っ ゃ"], ["ky", "ky"],
  ["TAKUSHI-", "タクシー"], ["TESUTO", "テスト"], ["Sensei desu.", "せんせい です。"], ["A", "あ"],
  ["ko-hi-", "コーヒー", { katakana: true }], ["koohii", "こおひい"], ["pa-thi-", "パーティー", { katakana: true }],
  ["fairu", "ファイル", { katakana: true }], ["ve", "ゔぇ"], ["ねこga", "ねこが"], ["日本go", "日本ご"],
];
for (const [i, o, opt] of conv) eq(`romaji ${i}${opt ? JSON.stringify(opt) : ""}`, romajiToKana(i, opt), o);
for (const done of ["こんにちは", "日本語", "タクシー", "ねこ。"]) eq(`idempotent ${done}`, romajiToKana(done), done);
eq("ime registered", imeFor({ code: "ja", name: "Japanese", ime: "ja" })?.("neko"), "ねこ");
eq("katakana", toKatakana("ひらがなー"), "ヒラガナー");
eq("hiragana", toHiragana("カタカナ"), "かたかな");
ok("kana only", isKanaOnly("コーヒー") && isKanaOnly("ねこ") && !isKanaOnly("猫") && !isKanaOnly("neko"));

// --- Furigana -------------------------------------------------------------------------------
eq("autoRuby okurigana", autoRuby("食べる", "たべる"), "{食|た}べる");
eq("autoRuby prefix", autoRuby("お茶", "おちゃ"), "お{茶|ちゃ}");
eq("autoRuby whole", autoRuby("日本語", "にほんご"), "{日本語|にほんご}");
eq("autoRuby kana word", autoRuby("ねこ", "ねこ"), "ねこ");
eq("rubyHtml", rubyHtml("{日本|にほん}"), "<ruby>日本<rp>(</rp><rt>にほん</rt><rp>)</rp></ruby>");
eq("rubyHtml leaves other braces", rubyHtml("set {a|b} and \\{x | x>0\\}"), "set {a|b} and \\{x | x>0\\}");
eq("strip", stripRuby("{日本|にほん}に行く"), "日本に行く");
eq("reading", rubyReading("{日本|にほん}に{行|い}く"), "にほんにいく");
ok("ruby problems", rubyProblems("{ねこ|ねこ} {猫|neko}").length === 2 && rubyProblems("{猫|ねこ}").length === 0);
ok("math text renders furigana", renderMathText("{猫|ねこ}は $x$").includes("<rt>ねこ</rt>"));
ok("math text escapes", !renderMathText("<b>{猫|ねこ}</b>").includes("<b>"));

// --- Pitch accent ---------------------------------------------------------------------------
const moraCases: [string, string[]][] = [
  ["はし", ["は", "し"]], ["きょう", ["きょ", "う"]], ["がっこう", ["が", "っ", "こ", "う"]], ["しんぶん", ["し", "ん", "ぶ", "ん"]],
  ["コーヒー", ["コ", "ー", "ヒ", "ー"]], ["パーティー", ["パ", "ー", "ティ", "ー"]], ["ファイル", ["ファ", "イ", "ル"]],
  ["おかあさん", ["お", "か", "あ", "さ", "ん"]], ["りょこう", ["りょ", "こ", "う"]], ["ぎゅうにゅう", ["ぎゅ", "う", "にゅ", "う"]],
  ["きゃっきゃ", ["きゃ", "っ", "きゃ"]], ["ヴァ", ["ヴァ"]], ["コーヒー・ショップ", ["コ", "ー", "ヒ", "ー", "ショ", "ッ", "プ"]],
];
for (const [w, ms] of moraCases) eq(`morae ${w}`, morae(w).join("・"), ms.join("・"));
eq("moraCount とうきょう", moraCount("とうきょう"), 4);
eq("moraCount empty", moraCount(""), 0);
const pat = (n: number, a: number) => pitchPattern(n, a).join("");
eq("heiban はし(0) + particle high", pat(2, 0), "LHH");
eq("atamadaka はし(1)", pat(2, 1), "HLL");
eq("odaka はし(2): particle low", pat(2, 2), "LHL");
eq("nakadaka たべる(2)", pat(3, 2), "LHLL");
eq("nakadaka 4 morae (3)", pat(4, 3), "LHHLL");
eq("heiban 1 mora ひ(0)", pat(1, 0), "LH");
eq("atamadaka 1 mora き(1)", pat(1, 1), "HL");
eq("heiban long", pat(5, 0), "LHHHHH");
ok("validAccent", validAccent(0, 2) && validAccent(2, 2) && !validAccent(3, 2) && !validAccent(-1, 2) && !validAccent(1.5, 2) && !validAccent("1", 2) && !validAccent(0, 0));
eq("accent words flat", accentWords(0, 2), "flat");
eq("accent words 2nd", accentWords(2, 3), "drop after the 2nd mora");
eq("accent words odaka", accentWords(2, 2), "drop after the 2nd and last mora");
eq("accent words 1st/3rd/11th", [1, 3, 11].map((a) => accentWords(a, 20)).join("|"), "drop after the 1st mora|drop after the 3rd mora|drop after the 11th mora");
eq("label, several", pitchLabel([0, 2], 3), "pitch: flat, or drop after the 2nd mora");

// HTML: one span per mora, high/low and the drop; screen-reader words; nothing for bad accents.
const morasOf = (html: string) => [...html.matchAll(/<span class="pa-m pa-([hl])( pa-d)?">([^<]+)<\/span>/g)].map((m) => `${m[3]}${m[1].toUpperCase()}${m[2] ? "↓" : ""}`).join(" ");
const hashi2 = pitchHtml("はし", 2);
eq("html odaka", morasOf(hashi2), "はL しH↓");
ok("html sr words", hashi2.includes('<span class="sr-only pa-sr" lang="en"> (pitch: drop after the 2nd and last mora)</span>'), hashi2);
ok("html data-pitch", hashi2.includes('data-pitch="2"'));
eq("html heiban: no drop", morasOf(pitchHtml("おちゃ", 0)), "おL ちゃH");
eq("html atamadaka", morasOf(pitchHtml("ねこ", 1)), "ねH↓ こL");
eq("html nakadaka with small kana", morasOf(pitchHtml("きょうと", 1)), "きょH↓ うL とL");
eq("html katakana long vowel", morasOf(pitchHtml("コーヒー", 3)), "コL ーH ヒH↓ ーL");
eq("html middle dot kept unmarked", morasOf(pitchHtml("ア・イ", 1)), "アH↓ イL");
ok("html middle dot present", pitchHtml("ア・イ", 1).includes("</span>・<span"));
const several = pitchHtml("はし", [0, 2]);
ok("html several: alt copy + both in words", several.includes('class="pa-alt"') && several.includes("pitch: flat, or drop after the 2nd and last mora"), several);
eq("html bad accent → plain kana", pitchHtml("はし", 3), "はし");
eq("html no accent → plain", pitchHtml("<はし>", undefined), "&lt;はし&gt;");
ok("html escapes", !pitchHtml("は<b>", 1).includes("<b>"));

// Markup: {漢字|かな:n} (accent over the furigana) and [かな:n]; plain furigana unchanged.
eq("splitReading", JSON.stringify(splitReading("はし:2")), JSON.stringify({ reading: "はし", accentText: "2", accent: 2 }));
eq("splitReading full-width colon", splitReading("はし：0").accent, 0);
eq("splitReading plain", JSON.stringify(splitReading(" はし ")), JSON.stringify({ reading: "はし" }));
const bridge = rubyHtml("{橋|はし:2}を わたる");
ok("ruby + pitch: accent inside rt", /^<ruby>橋<rp>\(<\/rp><rt><span class="pa"><span class="pa-w" data-pitch="2">.*<\/rt><rp>\)<\/rp><\/ruby>を わたる$/.test(bridge), bridge);
eq("ruby + pitch morae", morasOf(bridge), "はL しH↓");
eq("plain furigana unchanged", rubyHtml("{日本|にほん}"), "<ruby>日本<rp>(</rp><rt>にほん</rt><rp>)</rp></ruby>");
eq("kana pitch markup", morasOf(rubyHtml("[ねこ:1]が")), "ねH↓ こL");
ok("kana pitch markup replaced", !rubyHtml("[ねこ:1]が").includes("[") && rubyHtml("[ねこ:1]が").endsWith("</span></span>が"));
eq("bad kana accent left as typed", rubyHtml("[ねこ:5]"), "[ねこ:5]");
ok("bad ruby accent: furigana without accent", rubyHtml("{橋|はし:9}") === "<ruby>橋<rp>(</rp><rt>はし</rt><rp>)</rp></ruby>");
eq("not glossary links", rubyHtml("[[ねこ:1]]"), "[[ねこ:1]]");
eq("not Markdown links", rubyHtml("[ねこ:1](https://x)"), "[ねこ:1](https://x)");
eq("not escaped brackets", rubyHtml("\\[ねこ:1\\]"), "\\[ねこ:1\\]");
eq("not English brackets", rubyHtml("[note: 2]"), "[note: 2]");
eq("strip pitch", stripRuby("{橋|はし:2}を [わたる:0]"), "橋を わたる");
eq("reading pitch", rubyReading("{橋|はし:2}を [わたる:0]"), "はしを わたる");
eq("search text", rubySearchText("{橋|はし:2}を [わたる:0] {日本|にほん}"), "橋 はしを わたる 日本 にほん");
eq("normJa drops pitch markup", normJa("[ねこ:1]が {橋|はし:2}"), "ねこが橋");
ok("speech text drops pitch markup", mathTextSpeech("[ねこ:1]が {橋|はし:2}を") === "ねこが 橋を", mathTextSpeech("[ねこ:1]が {橋|はし:2}を"));
ok("math text renders pitch", renderMathText("[ねこ:1] $x$").includes('class="pa-m pa-h pa-d"'));
const probs = (t: string) => rubyProblems(t).map((p) => p.problem);
eq("problems: good pitch markup", probs("{橋|はし:2} [ねこ:0] [タクシー:4] {日本|にほん}").length, 0);
ok("problems: ruby accent too big", probs("{橋|はし:3}")[0]?.includes("from 0 to 2"), probs("{橋|はし:3}"));
ok("problems: ruby accent not a number", probs("{橋|はし:x}")[0]?.includes("from 0 to 2"));
ok("problems: kana accent too big", probs("[ねこ:3]")[0]?.includes("from 0 to 2"), probs("[ねこ:3]"));
ok("problems: kanji in kana markup", probs("[橋:2]")[0]?.includes("{漢字|かな:n}"), probs("[橋:2]"));
ok("problems: English brackets ignored", probs("[note: 2] [x:1]").length === 0);
ok("problems: reading still checked", probs("{橋|hashi:2}")[0] === "furigana reading must be kana only");

// Speech for the rendered page skips the accent words and extra forms.
{
  const { JSDOM } = await import("jsdom");
  const dom = new JSDOM(`<p>${rubyHtml("[はし:0]と {橋|はし:2}")} ${pitchHtml("はし", [1, 0])}</p>`);
  const p = dom.window.document.querySelector("p")!;
  eq("speechText skips pitch words", speechText(p), "はしと 橋 はし");
  ok("dom: accent words present for screen readers", p.querySelectorAll(".pa-sr").length === 3);
}

// Course data: normalized pitch, checker validation.
{
  const base = (vocab: unknown[], code = "ja") => ({
    format: "examiner-course", version: 1, id: "pt", title: "Pitch test", language: { code, name: "X" },
    modules: [{ id: "m", title: "M" }], lessons: [{ id: "l", module: "m", title: "L", body: "Hi" }],
    banks: [], decks: [], glossary: [], references: [], drills: [], vocab,
  });
  const w = (id: string, extra: Record<string, unknown>) => ({ id, lesson: "l", term: "橋", reading: "はし", meanings: ["bridge"], ...extra });
  const c = normalizeCourse(base([w("a", { pitch: 2 }), w("b", { pitch: [0, 2, 2] }), w("c", { pitch: 7 }), w("d", { pitch: "2" }), { id: "e", lesson: "l", term: "ねこ", meanings: ["cat"], pitch: 1 }]));
  eq("normalize number", JSON.stringify(c.vocab?.[0].pitch), "2");
  eq("normalize list (deduped)", JSON.stringify(c.vocab?.[1].pitch), "[0,2]");
  eq("normalize out of range dropped", c.vocab?.[2].pitch, undefined);
  eq("normalize string dropped", c.vocab?.[3].pitch, undefined);
  eq("normalize kana term", JSON.stringify(c.vocab?.[4].pitch), "1");
  eq("normalize non-Japanese ignored", normalizeCourse(base([w("a", { pitch: 2 })], "de")).vocab?.[0].pitch, undefined);
  const canon = (course: unknown) =>
    validateCanonicalAuthoring({ format: "erudior-canonical-authoring", version: 1, course }, { strict: false }).filter((e) => e.includes("pitch"));
  eq("canonical: good pitch", canon(base([w("a", { pitch: 2 }), w("b", { pitch: [0, 2] })])).length, 0);
  const cbad = canon(base([w("a", { pitch: 3 }), w("b", { pitch: [1, 1] }), w("c", { pitch: "2" }), w("d", { pitch: [] })]));
  ok("canonical: bad pitch", cbad.length === 4 && cbad.every((e) => /vocab\[\d\]\.pitch/.test(e)), cbad);
  ok("canonical: non-Japanese pitch", canon(base([w("a", { pitch: 2 })], "de")).some((e) => e.includes("only for Japanese")));
  const dir = mkdtempSync(join(tmpdir(), "pitch-"));
  const run = async (course: unknown) => {
    const f = join(dir, `c${Math.random().toString(36).slice(2)}.json`);
    writeFileSync(f, JSON.stringify(course));
    return (await checkCourse(f, { runs: 1 })).filter((p) => /pitch/i.test(p));
  };
  eq("checker: good", (await run(base([w("a", { pitch: 2 }), w("b", { pitch: [0, 2] }), { id: "e", lesson: "l", term: "ねこ", meanings: ["cat"], pitch: 0 }]))).length, 0);
  const bad = await run(base([w("a", { pitch: 3 }), w("b", { pitch: -1 }), w("c", { pitch: 1.5 }), w("d", { pitch: "2" }), w("e", { pitch: [] }), w("f", { pitch: [1, 1] })]));
  ok("checker: 3 too big", bad.some((p) => p.startsWith("word a:") && p.includes("0 (flat) to 2") && p.includes("は・し")), bad);
  ok("checker: negative", bad.some((p) => p.startsWith("word b:")), bad);
  ok("checker: fraction", bad.some((p) => p.startsWith("word c:")), bad);
  ok("checker: string", bad.some((p) => p.startsWith("word d:")), bad);
  ok("checker: empty list", bad.some((p) => p.startsWith("word e:") && p.includes("empty")), bad);
  ok("checker: duplicate", bad.some((p) => p.startsWith("word f:") && p.includes("twice")), bad);
  const de = await run(base([w("a", { pitch: 2 })], "de"));
  ok("checker: non-Japanese course", de.some((p) => p.includes("only for Japanese courses")), de);
  const lesson = base([]);
  (lesson.lessons[0] as Record<string, unknown>).body = "{橋|はし:5} [ねこ:1] [橋:2]";
  const lp = await run(lesson);
  ok("checker: lesson markup", lp.length === 2 && lp.some((p) => p.includes("{橋|はし:5}")) && lp.some((p) => p.includes("[橋:2]")), lp);
  rmSync(dir, { recursive: true, force: true });
}

// --- Answers --------------------------------------------------------------------------------
const neko: VocabItem = { id: "neko", lesson: "l1", term: "猫", reading: "ねこ", meanings: ["cat"] };
const taxi: VocabItem = { id: "taxi", lesson: "l1", term: "タクシー", meanings: ["taxi"] };
const sushi: VocabItem = { id: "sushi", lesson: "l1", term: "すし", meanings: ["sushi"] };
ok("kanji answer", checkRecall(neko, "猫", "ja").ok);
const byReading = checkRecall(neko, "ねこ", "ja");
ok("kana reading accepted with note", byReading.ok && !!byReading.note?.includes("猫"), byReading);
ok("wrong word", !checkRecall(neko, "いぬ", "ja").ok);
const hira = checkRecall(taxi, "たくしー", "ja");
ok("hiragana for katakana word: retry", !hira.ok && "retry" in hira && hira.retry === true, hira);
const kata = checkRecall(sushi, "スシ", "ja");
ok("katakana for hiragana word: retry", !kata.ok && "retry" in kata && kata.retry === true, kata);
const romaji = checkRecall(sushi, "susi x", "ja");
ok("leftover romaji: retry", !romaji.ok && "retry" in romaji && romaji.retry === true, romaji);
ok("spaces/punctuation ignored", checkRecall(sushi, " す し。", "ja").ok);
eq("normJa", normJa("わたし は 「がくせい」です。"), "わたしはがくせいです");
ok("text question: spaces", textMatches("わたし は がくせい です", ["わたしはがくせいです"]));
ok("text question: punctuation", textMatches("はい、そうです。", ["はいそうです"]));
ok("text question: different", !textMatches("いいえ", ["はい"]));
ok("German unaffected", checkRecall({ id: "h", lesson: "l", term: "der Hund", meanings: ["dog"], pos: "noun" }, "Hund", "de").ok === false);

if (fails) {
  console.log(`${fails} failed`);
  process.exit(1);
}
console.log("japanese: all passed");

// Japanese support: romaji → kana input, furigana markup, answer checking.
import { autoRuby, isKanaOnly, normJa, romajiToKana, rubyHtml, rubyProblems, rubyReading, stripRuby, toHiragana, toKatakana } from "../src/lib/kana.ts";
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

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

console.log("chinese: pinyin pairing, ruby, markup stripping and checker messages passed");

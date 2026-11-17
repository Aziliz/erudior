// Chinese support, feature 3: the Simplified/Traditional script switch (lib/zhScript).
// Run: npx tsx tests/zh-script.test.mts
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import * as OpenCC from "opencc-js";
import {
  expectedTraditional,
  otherScriptForms,
  rawCourse,
  scriptBank,
  scriptCourse,
  scriptMarkupProblem,
  scriptProblems,
  scriptSession,
  toSimplified,
  toTraditional,
  traceTradProblem,
  withTraces,
  aloneTraditional,
  type ZhTable,
} from "../src/lib/zhScript.ts";
import { checkRecallZh } from "../src/lib/vocab.ts";
import { textMatches } from "../src/lib/questions.ts";
import { normalizeCourse } from "../src/lib/course.ts";
import type { Course } from "../src/lib/types.ts";

const s2tw = OpenCC.Converter({ from: "cn", to: "tw" });

// --- Runtime conversion: longest phrase, then a lone character, then the character ----------
const t: ZhTable = { chars: { 头: "頭", 发: "髮", 只: "隻", 钟: "鐘", 里: "裡", 这: "這" }, phrases: { 出发: "出發", 只有: "只有" }, alone: { 钟: "鍾" } };
assert.equal(toTraditional("头发", t), "頭髮");
assert.equal(toTraditional("出发", t), "出發", "phrase beats the character");
assert.equal(toTraditional("只有一只", t), "只有一隻");
assert.equal(toTraditional("钟", t), "鍾", "alone: no Han character next to it");
assert.equal(toTraditional("钟。这里", t), "鍾。這裡", "punctuation ends a run");
assert.equal(toTraditional("{头|tóu}{发|fà}", t), "{頭|tóu}{髮|fà}", "pinyin untouched; markup doesn't split the word");
assert.equal(toTraditional("{出|chū}{发|fā}", t), "{出|chū}{發|fā}", "phrases match across ruby markup");
assert.equal(toTraditional("hello", t), "hello");

// --- Markup: {=…=} never converts, {+…+} always does; both lose their markers ---------------
assert.equal(toTraditional("简体{=发=}，繁体{+发+}", t), "简体发，繁体髮".replace("简体", "简体"));
assert.equal(toSimplified("简体{=发=}，繁体{+发+}", t), "简体发，繁体髮", "the pair reads the same in both scripts");
assert.equal(toTraditional("a{=\n### 发\n\n头发\n=}b头", t), "a\n### 发\n\n头发\nb頭", "a whole section stays simplified");
assert.equal(scriptMarkupProblem("{=发"), "unbalanced {=…=} or {+…+} (they can't nest)");
assert.equal(scriptMarkupProblem("{={=发=}=}") !== undefined, true, "nesting is reported");
assert.equal(scriptMarkupProblem("{=发=} {+发+}"), undefined);

// --- Trace blocks follow the learner's script, even inside {=…=} ----------------------------
const one = aloneTraditional(t);
const body = "{=\n头\n```trace\n钟发\n```\n=}\n```trace trad=鐘髮 tolerance=loose\n钟发\n```\n";
const shownT = withTraces(body, true, one, (s) => toTraditional(s, t));
assert.match(shownT, /^\n头\n```trace\n鍾髮\n```\n/, "trace inside a no-convert section converts (each character alone)");
assert.match(shownT, /```trace tolerance=loose\n鐘髮\n```/, "trad= gives the block's characters; it's dropped from the fence");
const shownS = withTraces(body, false, one, (s) => toSimplified(s, t));
assert.match(shownS, /```trace\n钟发\n```[\s\S]*```trace tolerance=loose\n钟发\n```/);
assert.match(traceTradProblem("钟发", " trad=鐘")!, /one traditional character for each/);

// --- The expectation the checker uses: OpenCC s2tw plus overrides -----------------------------
assert.equal(expectedTraditional("台湾的头发", s2tw, { forms: { 臺: "台" } }), "台灣的頭髮");
assert.equal(expectedTraditional("一只钟", s2tw, { alone: { 钟: "鐘" } }), "一隻鍾", "alone only for a lone character");
assert.equal(expectedTraditional("钟", s2tw, { alone: { 钟: "鐘" } }), "鐘");
assert.equal(expectedTraditional("衣服干了", s2tw, { words: { 干了: "乾了" } }), "衣服乾了");
assert.equal(expectedTraditional("系", s2tw, { chars: { 系: "係" } }), "係");
assert.equal(expectedTraditional("{=发=}{+发+}", s2tw, {}, true), "发發", "simplified view: only {+…+} converts");

// --- The demo course in each script ---------------------------------------------------------
const demo = normalizeCourse(JSON.parse(readFileSync("samples/demo-chinese.json", "utf8")));
assert.ok(demo.language?.traditional, "import keeps the table");
assert.deepEqual(scriptProblems(demo, s2tw), [], "runtime conversion = OpenCC s2tw + overrides for every text");
const trad = scriptCourse(demo, true);
const simp = scriptCourse(demo, false);
assert.equal(scriptCourse(demo, true), trad, "cached");
assert.equal(rawCourse(trad), demo);
const l2 = (c: Course) => c.lessons.find((l) => l.id === "zh-l2")!.body;
assert.match(l2(trad), /\{頭髮\|tóu fa\}/);
assert.match(l2(trad), /\{台灣\|Tái wān\}/, "台 stays 台");
assert.match(l2(trad), /simplified \{学\|xué\} · traditional \{學\|xué\}/);
assert.match(l2(simp), /simplified \{学\|xué\} · traditional \{學\|xué\}/, "the pair is right in Simplified too");
assert.match(l2(trad), /学 has 8 strokes/, "no-convert section stays simplified");
assert.match(l2(trad), /```trace\n學國\n```/, "its trace block follows the script");
assert.match(l2(simp), /```trace\n学国\n```/);
assert.ok(!/\{[=+]|[=+]\}/.test(l2(simp)), "markers removed");
assert.equal(trad.lessons[0].topics?.[0], demo.lessons[0].topics?.[0], "ids and topics aren't converted");
assert.equal(trad.language, demo.language);
// Vocab: trad shown; either script accepted when typed.
const word = (c: Course, id: string) => c.vocab!.find((v) => v.id === id)!;
assert.equal(word(trad, "zhong").term, "鐘", "vocab trad");
assert.equal(word(trad, "toufa").term, "頭髮");
assert.equal(word(simp, "toufa").term, "头发");
assert.deepEqual(checkRecallZh(word(trad, "toufa"), "头发"), { ok: true }, "simplified typed with Traditional on");
assert.deepEqual(checkRecallZh(word(simp, "toufa"), "頭髮"), { ok: true }, "traditional typed with Simplified on");
assert.deepEqual(checkRecallZh(word(simp, "zhong"), "鐘"), { ok: true }, "trad accepted");
assert.deepEqual(checkRecallZh(word(trad, "toufa"), "頭發"), { ok: false });
assert.ok(otherScriptForms(word(trad, "toufa")).includes("头发"));
// Cards: their own trad, not converted.
const card = (c: Course) => c.decks[0].cards.find((k) => k.id === "c1")!;
assert.deepEqual([card(trad).front, card(trad).back], ["鐘", "clock, bell · radical 金 · 20 strokes"]);
assert.deepEqual([card(simp).front, card(simp).back], ["钟", "clock, bell · radical 钅 · 9 strokes"]);
assert.equal(trad.decks[0].cards[1].front, "{麵條|miàn tiáo}", "cards without trad convert");
// Questions: text answers in either script; choices in no-convert stay.
const q = (c: Course, id: string) => c.banks[0].questions.find((x) => x.id === id)!;
assert.ok(textMatches("头发", q(trad, "q6").accept![0]) && textMatches("頭髮", q(trad, "q6").accept![0]));
assert.ok(textMatches("頭髮", q(simp, "q6").accept![0]), "traditional typed with Simplified on");
assert.equal(q(trad, "q6").accept![0][0], "頭髮", "the shown answer is in the learner's script");
assert.deepEqual(q(trad, "q7").choices, ["髮", "發"]);
assert.match(q(trad, "q7").stem, /does 发 take in 头发/);
// Banks and sessions follow the course.
const bank = scriptBank({ ...demo.banks[0], courseId: demo.id }, trad);
assert.equal((bank as { courseId?: string }).courseId, demo.id);
assert.equal(bank.questions, trad.banks[0].questions);
assert.equal(rawCourse(bank).questions, demo.banks[0].questions);
const session = { items: [{ q: demo.banks[0].questions.find((x) => x.id === "q6")!, order: [] }] };
assert.equal(scriptSession(session, bank).items[0].q.accept![0][0], "頭髮");
assert.equal(scriptSession(session, bank), scriptSession(session, bank), "cached");
// Other languages pass through untouched.
const de = { ...demo, language: { code: "de", name: "German" } } as Course;
assert.equal(scriptCourse(de, true), de);

// --- The checker catches a table that disagrees with OpenCC -------------------------------
{
  const broken = structuredClone(demo);
  delete broken.language!.traditional!.chars["头"];
  const p = scriptProblems(broken, s2tw);
  assert.ok(p.some((x) => /Traditional shows "[^"]*头髮/.test(x)), p.join("\n"));
  const none = structuredClone(demo);
  delete none.language!.traditional;
  assert.match(scriptProblems(none, s2tw)[0], /language.traditional is missing/);
  const nested = structuredClone(demo);
  nested.lessons[0].body += "{={=发=}=}";
  assert.ok(scriptProblems(nested, s2tw).some((x) => /can't nest/.test(x)));
}

console.log("zh-script: conversion, markup, trace blocks, overrides, course views, either-script answers and checker passed");

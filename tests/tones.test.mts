// Chinese support, feature 5: tone questions (type "tone") and tone practice (language.tones).
// Helpers, grading (incl. third-tone sandhi), Mandarin voice matching, the answer UI with the
// keyboard and without a voice (jsdom), practice rounds, the checker and the canonical schema.
// Run: npx tsx tests/tones.test.mts
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { JSDOM } from "jsdom";
import type { Chosen, Course, Question } from "../src/lib/types.ts";

// A DOM and a fake speech engine before the app modules load (speech.ts reads voices on import).
const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: "https://example.test" });
let voiceList: { lang: string; name: string }[] = [];
/** The device's voices change (fires "voiceschanged" like a browser). */
const setVoices = (v: { lang: string; name: string }[]) => {
  voiceList = v;
  voiceListeners.forEach((f) => f());
};
const spoken: { text: string; lang: string; voice?: string }[] = [];
const voiceListeners = new Set<() => void>();
const synth = {
  getVoices: () => voiceList,
  addEventListener(_t: string, f: () => void) {
    voiceListeners.add(f);
  },
  removeEventListener(_t: string, f: () => void) {
    voiceListeners.delete(f);
  },
  cancel() {},
  speaking: false,
  pending: false,
  speak(u: { text: string; lang: string; voice?: { name: string }; onend?: () => void }) {
    spoken.push({ text: u.text, lang: u.lang, voice: u.voice?.name });
    setTimeout(() => u.onend?.(), 1);
  },
};
Object.defineProperty(dom.window, "speechSynthesis", { configurable: true, value: synth });
class Utterance {
  lang = "";
  rate = 1;
  voice?: unknown;
  onstart?: () => void;
  onend?: () => void;
  onerror?: () => void;
  constructor(public text: string) {}
}
Object.assign(globalThis, {
  window: dom.window,
  document: dom.window.document,
  Element: dom.window.Element,
  HTMLElement: dom.window.HTMLElement,
  localStorage: dom.window.localStorage,
  SpeechSynthesisUtterance: Utterance,
  IS_REACT_ACT_ENVIRONMENT: true,
});
Object.defineProperty(globalThis, "navigator", { configurable: true, value: dom.window.navigator });

const tones = await import("../src/lib/tones.ts");
const { acceptedPatterns, heardTones, toneItemProblem, toneSyllables, toneCorrect, toneParts, toneFeedback, toneLabel, toneFromKey, normalizeToneSettings, toneSettingsProblems, riskySingle } = tones;
const { normalizeQuestionKind, isCorrect, isAnswered, isComplete, partsCorrect, answerText, chosenText, typeLabel } = await import("../src/lib/questions.ts");
const speech = await import("../src/lib/speech.ts");

// --- Items and tones -------------------------------------------------------------------------
assert.equal(toneItemProblem("妈", "mā"), undefined);
assert.equal(toneItemProblem("一点儿", "yì diǎnr"), undefined, "erhua rides on its syllable");
assert.match(toneItemProblem("你好", "nǐ")!, /2 characters but 1 syllable/);
assert.match(toneItemProblem("妈", "ma1")!, /tone marks, not tone numbers/);
assert.match(toneItemProblem("ma", "mā")!, /Chinese characters/);
assert.match(toneItemProblem("妈!", "mā")!, /Han characters only/);
assert.match(toneItemProblem("妈", "")!, /needs "reading"/);
assert.match(toneItemProblem("中华人民共和", "zhōng huá rén mín gòng hé")!, /6 syllables/);
assert.deepEqual(toneSyllables("谢谢", "xiè xie").map((s) => [s.chars, s.plain, s.tone]), [["谢", "xie", 4], ["谢", "xie", 0]]);
assert.deepEqual(heardTones([3, 3]), [2, 3]);
assert.deepEqual(heardTones([3, 3, 3]), [2, 2, 3]);
assert.deepEqual(acceptedPatterns([3, 4]), [[3, 4]]);
assert.deepEqual(acceptedPatterns([3, 3]), [[3, 3], [2, 3]]);
assert.deepEqual(acceptedPatterns([3, 3, 3]), [[3, 3, 3], [2, 2, 3], [3, 2, 3]], "a run of three third tones: 2+2+3 or 3+2+3 (小老虎)");
assert.ok(toneCorrect([3, 3, 3], [3, 2, 3]) && !toneCorrect([3, 3, 3], [2, 3, 3]));
assert.ok(toneCorrect([3, 3, 3, 3], [2, 3, 2, 3]) && toneCorrect([3, 3, 3, 3], [2, 2, 2, 3]) && !toneCorrect([3, 3, 3, 3], [2, 3, 3, 3]), "我也很好: 2+3+2+3");
assert.ok(toneCorrect([3, 3], [3, 3]) && toneCorrect([3, 3], [2, 3]) && !toneCorrect([3, 3], [3, 2]));
assert.ok(!toneCorrect([4, 0], [4, -1]), "every syllable needs a pick");
assert.deepEqual(toneParts([3, 3], [2, 2]), [true, false], "closest accepted pattern");
assert.equal(toneLabel(3), "tone 3, falling-rising");
assert.equal(toneLabel(0), "neutral tone");
assert.equal(toneFromKey("5"), 0);
assert.equal(toneFromKey("0"), 0);
assert.equal(toneFromKey("4"), 4);
assert.equal(toneFromKey("6"), undefined);
assert.match(toneFeedback(toneSyllables("你好", "nǐ hǎo")), /nǐ hǎo: tones 3\+3\. Third-tone sandhi: you hear 2\+3/);
assert.equal(toneFeedback(toneSyllables("马", "mǎ")), "mǎ: tone 3, falling-rising.");
assert.match(riskySingle(toneSyllables("好", "hǎo"))!, /more than one reading/);
assert.match(riskySingle(toneSyllables("吗", "ma"))!, /neutral-tone/);
assert.equal(riskySingle(toneSyllables("马", "mǎ")), undefined);

// --- The question kind -----------------------------------------------------------------------
const q = { id: "t1", topic: "Tones", stem: "Listen.", ...normalizeQuestionKind({ type: "tone", text: " 你好 ", reading: "nǐ hǎo" }) } as Question;
assert.equal(q.type, "tone");
assert.equal(q.text, "你好");
assert.deepEqual([q.choices, q.answer], [[], []]);
assert.throws(() => normalizeQuestionKind({ type: "tone", text: "你好", reading: "nǐ" }), /\(tone\).*1 syllable/);
assert.throws(() => normalizeQuestionKind({ type: "tone", text: "ni", reading: "nǐ" }), /\(tone\)/);
assert.throws(() => normalizeQuestionKind({ type: "tone", text: "马", reading: "mǎ", choices: ["a", "b"], answer: [0] }), /leave out "choices"/);
assert.ok(!isAnswered(q, []) && isAnswered(q, [3, -1]) && !isComplete(q, [3, -1]) && isComplete(q, [3, 3]));
assert.ok(isCorrect(q, [3, 3]) && isCorrect(q, [2, 3]) && !isCorrect(q, [3, 4]));
assert.deepEqual(partsCorrect(q, [3, 4]), [true, false]);
assert.equal(answerText(q), "nǐ hǎo (tones 3+3)");
assert.equal(chosenText(q, [4, 0]), "tones 4+neutral");
assert.equal(typeLabel(q), "Pick the tones");

// --- Mandarin voices: zh-CN first, other Mandarin regions next, never Cantonese ---------------
setVoices([{ lang: "zh-HK", name: "Sinji" }, { lang: "en-US", name: "Samantha" }]);
assert.ok(!speech.canSpeak("zh-CN"), "a Cantonese voice isn't Mandarin");
assert.ok(speech.canSpeak("zh-HK"), "Cantonese courses can use it");
setVoices([{ lang: "zh-HK", name: "Sinji" }, { lang: "zh_TW", name: "Meijia" }]);
assert.equal(speech.voiceFor("zh-CN")?.name, "Meijia", "Taiwan Mandarin stands in");
setVoices([{ lang: "cmn-CN", name: "Google 普通话" }, { lang: "zh-TW", name: "Meijia" }]);
assert.equal(speech.voiceFor("zh-CN")?.name, "Google 普通话", "cmn = zh, exact region wins");
setVoices([{ lang: "de-DE", name: "Anna" }, { lang: "de-AT", name: "x" }]);
assert.equal(speech.voiceFor("de-CH")?.name, "Anna", "other languages unchanged");

// --- The answer UI ---------------------------------------------------------------------------
const { act, createElement, useState } = await import("react");
const { createRoot } = await import("react-dom/client");
const { default: QuestionBody } = await import("../src/components/QuestionBody.tsx");
const host = document.getElementById("root")!;
const root = createRoot(host);
let latest: Chosen = [];
let entered = 0;
function Harness({ question, reveal = false, start = [] as Chosen }: { question: Question; reveal?: boolean; start?: Chosen }) {
  const [chosen, setChosen] = useState<Chosen>(start);
  latest = chosen;
  return createElement(QuestionBody, { q: question, order: [], chosen, onChange: setChosen, onEnter: () => entered++, reveal, lang: "zh", tts: "zh-CN" });
}
const key = async (k: string, el: Element = document.body) =>
  act(async () => {
    el.dispatchEvent(new dom.window.KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true }));
  });
const text = () => host.textContent ?? "";

// With a Mandarin voice: listen buttons, toneless pinyin per syllable, characters hidden.
setVoices([{ lang: "zh-CN", name: "Tingting" }]);
await act(async () => root.render(createElement(Harness, { question: q })));
const groups = [...host.querySelectorAll('[role="radiogroup"]')];
assert.equal(groups.length, 2, "one tone group per syllable");
assert.equal(host.querySelectorAll('input[type="radio"]').length, 10);
assert.ok(host.querySelector('input[aria-label="tone 3, falling-rising"]') && host.querySelector('input[aria-label="neutral tone"]'), "screen reader labels");
assert.ok(text().includes("Syllable 1 of 2: ni"), "groups are named by toneless syllable");
assert.ok(!text().includes("你好") && !text().includes("nǐ"), "listening: no characters or marks before checking");
assert.ok(host.querySelector(".tone-glyph.tn.t3"), "tone glyphs take the Tone colours classes");
const listen = [...host.querySelectorAll("button")].find((b) => b.textContent?.includes("Listen"))!;
await act(async () => listen.click());
await act(async () => new Promise((r) => setTimeout(r, 10)));
assert.deepEqual(spoken.at(-1), { text: "你好", lang: "zh-CN", voice: "Tingting" }, "the voice reads the characters, never pinyin");

// Keys 1–5 pick tones syllable by syllable; Enter on a tone checks.
await key("3");
assert.deepEqual(latest, [3, -1]);
await key("5");
assert.deepEqual(latest, [3, 0], "5 = neutral, second syllable");
await key("4");
assert.deepEqual(latest, [3, 4], "the last syllable takes further keys");
assert.ok(host.querySelector('[aria-live="polite"]')?.textContent?.includes("Syllable 2: tone 4, falling"));
const radio = host.querySelector<HTMLInputElement>('input[aria-label="tone 2, rising"]')!;
await act(async () => radio.click());
assert.deepEqual(latest, [2, 4], "clicking a tone picks it");
await key("Enter", radio);
assert.equal(entered, 1, "Enter on a tone checks the answer");

// Revealed: marks, the answer pinyin and the sandhi note.
await act(async () => root.render(createElement(Harness, { key: "t1r", question: { ...q, id: "t1r" }, reveal: true, start: [2, 3] })));
assert.ok(text().includes("nǐ hǎo: tones 3+3") && text().includes("you hear 2+3"), text());
assert.ok(host.querySelectorAll(".part-mark.ok").length === 2, "2+3 is right");
assert.ok(host.querySelector(".tone-answer ruby.py"), "characters with pinyin after checking");
await key("1");
assert.deepEqual(latest, [2, 3], "no picking once checked");

// No Mandarin voice: labelled "from memory", characters and toneless pinyin shown.
await act(async () => setVoices([{ lang: "zh-HK", name: "Sinji" }]));
await act(async () => root.render(createElement(Harness, { key: "t2", question: { ...q, id: "t2" } })));
assert.ok(text().includes("From memory") && text().includes("no Mandarin voice"), text());
assert.ok(!host.querySelector(".tone-listen"), "no listen buttons");
assert.ok(text().includes("你好") && text().includes("ni hao") && !text().includes("nǐ"));
// A recording plays even without a voice.
await act(async () => root.render(createElement(Harness, { key: "t3", question: { ...q, id: "t3", audio: { src: "data:audio/mpeg;base64,AAAA" } } })));
assert.ok(host.querySelector(".tone-listen") && !text().includes("From memory"));
await act(async () => root.unmount());

// --- Settings and practice rounds ------------------------------------------------------------
assert.deepEqual(normalizeToneSettings(true), {});
assert.deepEqual(normalizeToneSettings({ lesson: "l2", max: 3, round: 5, junk: 1 }), { lesson: "l2", max: 3, round: 5 });
assert.equal(normalizeToneSettings(false), undefined);
assert.deepEqual(toneSettingsProblems({ tones: { max: 9, extra: 1 } }).map(([p]) => p), ["language.tones.extra", "language.tones.max"]);
const { normalizeCourse } = await import("../src/lib/course.ts");
const { buildToneRound, recordTones, toneOpen, toneSummary, toneWords } = await import("../src/lib/toneDrills.ts");
const demo = JSON.parse(readFileSync("samples/demo-chinese.json", "utf8"));
const course = normalizeCourse(demo) as Course;
assert.deepEqual(course.language?.tones, { max: 2, round: 8 });
assert.deepEqual(normalizeCourse({ ...demo, language: { ...demo.language, code: "ja" } }).language?.tones, undefined, "Chinese only");
const words = toneWords(course).map((w) => w.item.term);
assert.ok(words.includes("妈") && words.includes("你好") && words.includes("一点儿") && !words.includes("中国人"), words.join());
const fresh = { lessonsDone: {}, vocab: {}, conj: {}, attempts: [], cards: {}, stats: {}, plans: {}, activity: {}, drills: {} } as never;
assert.ok(toneOpen(course, fresh));
assert.equal(buildToneRound(course, fresh).length, 0, "nothing until a lesson is done");
assert.equal(buildToneRound(course, fresh, { lessonIds: ["zh-l1"] }).length, toneWords(course).filter((w) => w.item.lesson === "zh-l1").length, "a lesson's own words any time");
const done = { ...(fresh as object), lessonsDone: { "demo-chinese/zh-l1": "2026-11-16" } } as never;
const round = buildToneRound(course, done, { n: 3 });
assert.equal(round.length, 3);
assert.equal(new Set(round.map((r) => r.item.id)).size, 3, "no repeats");
const locked = normalizeCourse({ ...demo, language: { ...demo.language, tones: { lesson: "zh-l1" } } }) as Course;
assert.ok(!toneOpen(locked, fresh) && buildToneRound(locked, fresh, { lessonIds: ["zh-l1"] }).length === 0, "an unlocking lesson closes practice");
const p2 = recordTones(fresh, toneSyllables("你好", "nǐ hǎo"), [true, false], "2026-11-17");
assert.deepEqual(toneSummary(p2).find((r) => r.tone === 3), { tone: 3, right: 1, wrong: 1, last: "2026-11-17" });

// --- Checker and canonical schema ------------------------------------------------------------
const { checkCourse } = await import("./check-course.mts");
assert.deepEqual(await checkCourse("samples/demo-chinese.json", { runs: 1 }), [], "demo course is clean");
const dir = mkdtempSync(join(tmpdir(), "zh-tones-"));
try {
  const bad = structuredClone(demo);
  bad.language.tones = { lesson: "nope", max: 7 };
  bad.banks[0].questions.push(
    { id: "risky", topic: "T", type: "tone", stem: "s", text: "好", reading: "hǎo" },
  );
  const file = join(dir, "bad.json");
  writeFileSync(file, JSON.stringify(bad));
  const warnings: string[] = [];
  const p = await checkCourse(file, { runs: 1, warnings });
  const has = (s: string) => assert.ok(p.some((x) => x.includes(s)), `${s}\n${p.join("\n")}`);
  has("language.tones.max: must be an integer from 1 to 4");
  has('language.tones.lesson: no lesson "nope"');
  assert.ok(warnings.some((w) => w.startsWith("question risky:") && w.includes("more than one reading")), warnings.join("\n"));
  // An invalid reading stops the course from loading with a readable message.
  bad.banks[0].questions = [{ id: "n", topic: "T", type: "tone", stem: "s", text: "你好", reading: "ni3 hao3" }];
  writeFileSync(file, JSON.stringify(bad));
  await assert.rejects(checkCourse(file, { runs: 1 }), /tone marks, not tone numbers/);
  // Tone settings outside Chinese courses.
  const ja = structuredClone(demo);
  ja.language = { code: "ja", name: "Japanese", tones: true };
  ja.lessons[0].body = "x";
  ja.vocab = [];
  ja.banks[0].questions = [{ id: "q1", topic: "T", type: "tone", stem: "s", text: "马", reading: "mǎ" }];
  ja.lessons[0].quiz = ["q1"];
  writeFileSync(file, JSON.stringify(ja));
  const pj = await checkCourse(file, { runs: 1 });
  assert.ok(pj.some((x) => x.includes("language.tones: tone drills are for Chinese courses")), pj.join("\n"));
  assert.ok(pj.some((x) => x.includes("question q1: tone questions are for Chinese courses")), pj.join("\n"));
} finally {
  rmSync(dir, { recursive: true, force: true });
}
{
  const { migrateLegacyCourseToCanonical, validateCanonicalAuthoring } = await import("../src/lib/canonicalAuthoring.ts");
  const { payload } = migrateLegacyCourseToCanonical(structuredClone(demo));
  assert.deepEqual(validateCanonicalAuthoring(payload, { strict: true }), [], "tone questions and language.tones accepted");
  const tq = payload.course.banks[0].questions.find((x: Question) => x.type === "tone");
  assert.ok(tq?.text && tq.reading);
  const bad = structuredClone(payload);
  bad.course.banks[0].questions.find((x: Question) => x.type === "tone").reading = "mā mā";
  assert.ok(validateCanonicalAuthoring(bad).some((e: string) => e.includes("tone:") && e.includes("syllables")), "syllable count checked");
  const bad2 = structuredClone(payload);
  bad2.course.language.tones = { round: 0 };
  assert.ok(validateCanonicalAuthoring(bad2).some((e: string) => e.includes("language.tones.round")));
}

console.log("tones: all checks passed");

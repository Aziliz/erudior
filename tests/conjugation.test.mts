// Conjugation drills: generated Japanese and German forms against standard tables, the data
// checks, answer checking, rounds and progress. Run: npx tsx tests/conjugation.test.mts
import {
  buildRound,
  checkConj,
  conjForms,
  conjKey,
  conjWordProblem,
  conjWordWarnings,
  deAdjForm,
  deVerbForm,
  jaForm,
  promptsFor,
  recordConj,
  type DeArticle,
  type DeCase,
  type DeGender,
} from "../src/lib/conjugation.ts";
import { JA_ADJ_FORMS, JA_VERB_FORMS, normalizeConjugationSettings } from "../src/lib/courseConjugation.ts";
import { exportCourseSnapshot, normalizeCourse } from "../src/lib/course.ts";
import { validateCanonicalAuthoring } from "../src/lib/canonicalAuthoring.ts";
import { parseAnonymousProgress } from "../src/lib/anonymousPrivacy.ts";
import { emptyProgress } from "../src/lib/storage.ts";
import type { VocabItem } from "../src/lib/types.ts";
import { readFileSync } from "node:fs";
import { isDeepStrictEqual } from "node:util";

let fails = 0;
let checks = 0;
const ok = (name: string, cond: boolean, extra?: unknown) => {
  checks++;
  if (!cond) {
    fails++;
    console.log("FAIL", name, extra === undefined ? "" : JSON.stringify(extra));
  }
};
const eq = (name: string, got: unknown, want: unknown) => ok(name, JSON.stringify(got) === JSON.stringify(want), { got, want });

const word = (term: string, conj: string, extra: Partial<VocabItem> = {}): VocabItem =>
  ({ id: term, lesson: "l1", term, meanings: ["x"], conj, ...extra }) as VocabItem;

// --- Japanese verbs: every class × every form ------------------------------------------------
// Columns follow JA_VERB_FORMS: polite, polite-negative, polite-past, polite-past-negative,
// negative, past, past-negative, te, volitional, potential, conditional, passive, causative, imperative.
const jaVerbs: [string, string, string, (string | null)[]][] = [
  ["書く", "かく", "godan", ["書きます", "書きません", "書きました", "書きませんでした", "書かない", "書いた", "書かなかった", "書いて", "書こう", "書ける", "書けば", "書かれる", "書かせる", "書け"]],
  ["泳ぐ", "およぐ", "godan", ["泳ぎます", "泳ぎません", "泳ぎました", "泳ぎませんでした", "泳がない", "泳いだ", "泳がなかった", "泳いで", "泳ごう", "泳げる", "泳げば", "泳がれる", "泳がせる", "泳げ"]],
  ["話す", "はなす", "godan", ["話します", "話しません", "話しました", "話しませんでした", "話さない", "話した", "話さなかった", "話して", "話そう", "話せる", "話せば", "話される", "話させる", "話せ"]],
  ["待つ", "まつ", "godan", ["待ちます", "待ちません", "待ちました", "待ちませんでした", "待たない", "待った", "待たなかった", "待って", "待とう", "待てる", "待てば", "待たれる", "待たせる", "待て"]],
  ["死ぬ", "しぬ", "godan", ["死にます", "死にません", "死にました", "死にませんでした", "死なない", "死んだ", "死ななかった", "死んで", "死のう", "死ねる", "死ねば", "死なれる", "死なせる", "死ね"]],
  ["遊ぶ", "あそぶ", "godan", ["遊びます", "遊びません", "遊びました", "遊びませんでした", "遊ばない", "遊んだ", "遊ばなかった", "遊んで", "遊ぼう", "遊べる", "遊べば", "遊ばれる", "遊ばせる", "遊べ"]],
  ["読む", "よむ", "godan", ["読みます", "読みません", "読みました", "読みませんでした", "読まない", "読んだ", "読まなかった", "読んで", "読もう", "読める", "読めば", "読まれる", "読ませる", "読め"]],
  ["帰る", "かえる", "godan", ["帰ります", "帰りません", "帰りました", "帰りませんでした", "帰らない", "帰った", "帰らなかった", "帰って", "帰ろう", "帰れる", "帰れば", "帰られる", "帰らせる", "帰れ"]],
  ["買う", "かう", "godan", ["買います", "買いません", "買いました", "買いませんでした", "買わない", "買った", "買わなかった", "買って", "買おう", "買える", "買えば", "買われる", "買わせる", "買え"]],
  ["行く", "いく", "godan", ["行きます", "行きません", "行きました", "行きませんでした", "行かない", "行った", "行かなかった", "行って", "行こう", "行ける", "行けば", "行かれる", "行かせる", "行け"]],
  ["食べる", "たべる", "ichidan", ["食べます", "食べません", "食べました", "食べませんでした", "食べない", "食べた", "食べなかった", "食べて", "食べよう", "食べられる", "食べれば", "食べられる", "食べさせる", "食べろ"]],
  ["見る", "みる", "ichidan", ["見ます", "見ません", "見ました", "見ませんでした", "見ない", "見た", "見なかった", "見て", "見よう", "見られる", "見れば", "見られる", "見させる", "見ろ"]],
  ["する", "する", "suru", ["します", "しません", "しました", "しませんでした", "しない", "した", "しなかった", "して", "しよう", "できる", "すれば", "される", "させる", "しろ"]],
  ["来る", "くる", "kuru", ["来ます", "来ません", "来ました", "来ませんでした", "来ない", "来た", "来なかった", "来て", "来よう", "来られる", "来れば", "来られる", "来させる", "来い"]],
  ["くる", "くる", "kuru", ["きます", "きません", "きました", "きませんでした", "こない", "きた", "こなかった", "きて", "こよう", "こられる", "くれば", "こられる", "こさせる", "こい"]],
  ["勉強する", "べんきょうする", "suru", ["勉強します", "勉強しません", "勉強しました", "勉強しませんでした", "勉強しない", "勉強した", "勉強しなかった", "勉強して", "勉強しよう", "勉強できる", "勉強すれば", "勉強される", "勉強させる", "勉強しろ"]],
  ["ある", "ある", "godan", ["あります", "ありません", "ありました", "ありませんでした", "ない", "あった", "なかった", "あって", "あろう", null, "あれば", null, null, null]],
  ["持って来る", "もってくる", "kuru", ["持って来ます", "持って来ません", "持って来ました", "持って来ませんでした", "持って来ない", "持って来た", "持って来なかった", "持って来て", "持って来よう", "持って来られる", "持って来れば", "持って来られる", "持って来させる", "持って来い"]],
];
for (const [term, reading, cls, want] of jaVerbs) {
  const item = word(term, cls, { reading });
  ok(`${term}: no data problem`, !conjWordProblem("ja", item), conjWordProblem("ja", item));
  JA_VERB_FORMS.forEach((form, i) => eq(`${term} ${form}`, jaForm(item, form)?.answers[0] ?? null, want[i]));
}
// Readings: kana throughout, with 来る's changing stem vowel.
const kuruReadings = ["きます", "きません", "きました", "きませんでした", "こない", "きた", "こなかった", "きて", "こよう", "こられる", "くれば", "こられる", "こさせる", "こい"];
JA_VERB_FORMS.forEach((form, i) => eq(`来る reading ${form}`, jaForm(word("来る", "kuru", { reading: "くる" }), form)?.readings?.[0], kuruReadings[i]));
eq("書く reading te", jaForm(word("書く", "godan", { reading: "かく" }), "te")?.readings, ["かいて"]);
eq("行く reading past", jaForm(word("行く", "godan", { reading: "いく" }), "past")?.readings, ["いった"]);
eq("食べる reading potential", jaForm(word("食べる", "ichidan", { reading: "たべる" }), "potential")?.readings, ["たべられる"]);
eq("勉強する reading potential", jaForm(word("勉強する", "suru", { reading: "べんきょうする" }), "potential")?.readings, ["べんきょうできる"]);
eq("kana-only verb", jaForm(word("のむ", "godan"), "polite-past-negative")?.answers, ["のみませんでした"]);
eq("する imperative alternatives", jaForm(word("する", "suru"), "imperative")?.answers, ["しろ", "せよ"]);
eq("くれる has no generated imperative", jaForm(word("くれる", "ichidan"), "imperative"), undefined);
// Rules shown after answering.
eq("rule: く → いて", jaForm(word("書く", "godan", { reading: "かく" }), "te")?.rule, "Group 1 (う-verb) て form: く → いて");
eq("rule: 行く exception", jaForm(word("行く", "godan", { reading: "いく" }), "te")?.rule, "行く is the exception: いって (not いいて)");
ok("rule: う becomes わ", /わ, not あ/.test(jaForm(word("買う", "godan", { reading: "かう" }), "negative")!.rule));
ok("rule: ichidan drop る", /drop る, add ない/.test(jaForm(word("食べる", "ichidan", { reading: "たべる" }), "negative")!.rule));
ok("rule: ある", /ある is irregular/.test(jaForm(word("ある", "godan"), "negative")!.rule));

// --- Japanese adjectives ---------------------------------------------------------------------
// adj-negative, adj-past, adj-past-negative, adj-te, adverb
const jaAdjs: [string, string, string, string[], string[]?][] = [
  ["高い", "たかい", "i-adj", ["高くない", "高かった", "高くなかった", "高くて", "高く"], ["たかくない", "たかかった", "たかくなかった", "たかくて", "たかく"]],
  ["いい", "いい", "i-adj", ["よくない", "よかった", "よくなかった", "よくて", "よく"], ["よくない", "よかった", "よくなかった", "よくて", "よく"]],
  ["良い", "いい", "i-adj", ["良くない", "良かった", "良くなかった", "良くて", "良く"], ["よくない", "よかった", "よくなかった", "よくて", "よく"]],
  ["良い", "よい", "i-adj", ["良くない", "良かった", "良くなかった", "良くて", "良く"], ["よくない", "よかった", "よくなかった", "よくて", "よく"]],
  ["かっこいい", "かっこいい", "ii-adj", ["かっこよくない", "かっこよかった", "かっこよくなかった", "かっこよくて", "かっこよく"]],
  ["かわいい", "かわいい", "i-adj", ["かわいくない", "かわいかった", "かわいくなかった", "かわいくて", "かわいく"]],
  ["静か", "しずか", "na-adj", ["静かじゃない", "静かだった", "静かじゃなかった", "静かで", "静かに"], ["しずかじゃない", "しずかだった", "しずかじゃなかった", "しずかで", "しずかに"]],
  ["きれい", "きれい", "na-adj", ["きれいじゃない", "きれいだった", "きれいじゃなかった", "きれいで", "きれいに"]],
];
for (const [term, reading, cls, want, readings] of jaAdjs) {
  const item = word(term, cls, { reading });
  ok(`${term}/${reading}: no data problem`, !conjWordProblem("ja", item), conjWordProblem("ja", item));
  JA_ADJ_FORMS.forEach((form, i) => {
    eq(`${term}/${reading} ${form}`, jaForm(item, form)?.answers[0], want[i]);
    if (readings) eq(`${term}/${reading} ${form} reading`, jaForm(item, form)?.readings?.[0], readings[i]);
  });
}
eq("na-adj ではない accepted too", jaForm(word("静か", "na-adj", { reading: "しずか" }), "adj-negative")?.answers, ["静かじゃない", "静かではない"]);
ok("verb forms don't apply to adjectives", jaForm(word("高い", "i-adj", { reading: "たかい" }), "te") === undefined);
ok("adjective forms don't apply to verbs", jaForm(word("書く", "godan", { reading: "かく" }), "adj-te") === undefined);
ok("いい rule", /いい is irregular/.test(jaForm(word("いい", "i-adj"), "adj-past")!.rule));

// --- Japanese data checks -------------------------------------------------------------------
const jp = (term: string, cls: string, reading?: string) => conjWordProblem("ja", word(term, cls, reading ? { reading } : {}));
const jw = (term: string, cls: string, reading?: string) => conjWordWarnings("ja", word(term, cls, reading ? { reading } : {}));
ok("ichidan needs る", !!jp("書く", "ichidan", "かく"));
ok("ichidan needs e/i row before る", !!jp("取る", "ichidan", "とる"));
ok("godan needs a godan ending", !!jp("食べ", "godan", "たべ"));
ok("kanji without reading", !!jp("書く", "godan"));
ok("term and reading disagree", !!jp("書く", "godan", "かう"));
ok("くださる refused", !!jp("くださる", "godan"));
ok("問う refused", !!jp("問う", "godan", "とう"));
ok("na-adj with な", !!jp("静かな", "na-adj", "しずかな"));
ok("i-adj needs い", !!jp("静か", "i-adj", "しずか"));
ok("unknown class", !!jp("書く", "verb", "かく"));
ok("German forms on Japanese", !!conjWordProblem("ja", word("書く", "godan", { reading: "かく", forms: { present3: "x" } })));
ok("warn: godan 帰る looks ichidan", jw("帰る", "godan", "かえる").length >= 1);
ok("warn: ichidan かえる homophone", jw("変える", "ichidan", "かえる").some((w) => w.includes("帰る")));
ok("warn: ichidan きる homophone", jw("着る", "ichidan", "きる").some((w) => w.includes("切る")));
ok("warn: はいる", jw("入る", "godan", "はいる").length >= 1);
ok("warn: しる", jw("知る", "godan", "しる").length >= 1);
ok("no warning for 書く", jw("書く", "godan", "かく").length === 0);
ok("no warning for 食べる", jw("食べる", "ichidan", "たべる").length === 0);
ok("warn: きれい as i-adj", jw("きれい", "i-adj").length === 1);
ok("warn: かっこいい as i-adj", jw("かっこいい", "i-adj").some((w) => w.includes("ii-adj")));
ok("warn: one-kanji する", jw("愛する", "suru", "あいする").length === 1);

// --- Japanese answer checking ---------------------------------------------------------------
const jaCourse = normalizeCourse({
  format: "examiner-course",
  version: 1,
  id: "ja-test",
  title: "JA",
  language: { code: "ja", name: "Japanese", ime: "ja", conjugation: { forms: [{ form: "polite" }, { form: "te", lesson: "l2" }, { form: "adj-negative" }, { form: "bogus" }] } },
  lessons: [
    { id: "l1", title: "One", body: "x" },
    { id: "l2", title: "Two", body: "x" },
  ],
  vocab: [
    { id: "kaku", lesson: "l1", term: "書く", reading: "かく", meanings: ["to write"], pos: "verb", conj: "godan" },
    { id: "shizuka", lesson: "l1", term: "静か", reading: "しずか", meanings: ["quiet"], conj: "na-adj" },
    { id: "neko", lesson: "l1", term: "猫", reading: "ねこ", meanings: ["cat"] },
    { id: "late", lesson: "l2", term: "見る", reading: "みる", meanings: ["to see"], conj: "ichidan" },
  ],
});
eq("settings: unknown form dropped", jaCourse.language?.conjugation?.forms.map((f) => f.form), ["polite", "te", "adj-negative"]);
const [kakuTe] = promptsFor(jaCourse, jaCourse.vocab![0], "te");
eq("prompt label", kakuTe.label, "て form");
ok("kanji answer", checkConj(kakuTe, "書いて", "ja").ok);
const kana = checkConj(kakuTe, "かいて", "ja");
ok("kana answer, with the kanji note", kana.ok && /書いて/.test(kana.note ?? ""), kana);
ok("wrong answer", !checkConj(kakuTe, "かきて", "ja").ok);
const romaji = checkConj(kakuTe, "かいte", "ja");
ok("leftover romaji: try again", !romaji.ok && romaji.retry === true);
const [shizukaNeg] = promptsFor(jaCourse, jaCourse.vocab![1], "adj-negative");
ok("ではない accepted", checkConj(shizukaNeg, "しずかではない", "ja").ok && checkConj(shizukaNeg, "静かではない", "ja").ok);

// Rounds: unlocked words × unlocked forms only.
let p = { ...emptyProgress(), lessonsDone: { "ja-test/l1": "2026-01-01" } };
eq("forms unlocked", conjForms(jaCourse, p).map((f) => `${f.setting.form}:${f.open}`), ["polite:true", "te:false", "adj-negative:true"]);
let round = buildRound(jaCourse, p, 10);
eq("round size", round.length, 10);
ok("round: only open forms", round.every((r) => ["polite", "adj-negative"].includes(r.form)), round.map((r) => r.form));
ok("round: only unlocked conjugatable words", round.every((r) => ["kaku", "shizuka"].includes(r.item.id)));
ok("round: no immediate repeats", round.every((r, i) => i === 0 || r.item.id !== round[i - 1].item.id || r.form !== round[i - 1].form));
p = { ...p, lessonsDone: { ...p.lessonsDone, "ja-test/l2": "2026-01-02" } };
round = buildRound(jaCourse, p, 40);
ok("round: te unlocked", round.some((r) => r.form === "te"));
ok("round: 見る unlocked", round.some((r) => r.item.id === "late"));
eq("no forms, no round", buildRound(normalizeCourse({ ...JSON.parse(JSON.stringify(jaCourse)), language: { code: "ja", name: "Japanese" } }), p).length, 0);

// Progress: per language and form, carried like vocabulary; survives the strict progress parser.
const key = conjKey(jaCourse, "te");
eq("key", key, "ja:te");
let q = recordConj(p, key, true, "2026-01-03");
q = recordConj(q, key, false, "2026-01-04");
eq("tally", q.conj?.[key], { right: 1, wrong: 1, last: "2026-01-04" });
ok("anonymous progress parser keeps conj", isDeepStrictEqual(parseAnonymousProgress(JSON.parse(JSON.stringify(q))).conj, q.conj));
let rejected = false;
try {
  parseAnonymousProgress({ ...q, conj: { [key]: { right: -1, wrong: 0 } } });
} catch {
  rejected = true;
}
ok("anonymous progress parser rejects a bad tally", rejected);

// --- German verbs ------------------------------------------------------------------------------
const P = ["ich", "du", "er", "wir", "ihr", "sie"];
type DeRow = { term: string; conj: string; forms?: Record<string, string>; present: string[]; preterite: string[]; perfect: string[]; imperative: (string | null)[]; subjunctive?: string[] };
const deVerbs: DeRow[] = [
  {
    term: "machen",
    conj: "weak",
    present: ["mache", "machst", "macht", "machen", "macht", "machen"],
    preterite: ["machte", "machtest", "machte", "machten", "machtet", "machten"],
    perfect: ["habe gemacht", "hast gemacht", "hat gemacht", "haben gemacht", "habt gemacht", "haben gemacht"],
    imperative: ["mach", "macht", "machen Sie"],
  },
  {
    term: "arbeiten",
    conj: "weak",
    present: ["arbeite", "arbeitest", "arbeitet", "arbeiten", "arbeitet", "arbeiten"],
    preterite: ["arbeitete", "arbeitetest", "arbeitete", "arbeiteten", "arbeitetet", "arbeiteten"],
    perfect: ["habe gearbeitet", "hast gearbeitet", "hat gearbeitet", "haben gearbeitet", "habt gearbeitet", "haben gearbeitet"],
    imperative: ["arbeite", "arbeitet", "arbeiten Sie"],
  },
  {
    term: "fahren",
    conj: "strong",
    forms: { present2: "fährst", present3: "fährt", preterite: "fuhr", perfect: "ist gefahren" },
    present: ["fahre", "fährst", "fährt", "fahren", "fahrt", "fahren"],
    preterite: ["fuhr", "fuhrst", "fuhr", "fuhren", "fuhrt", "fuhren"],
    perfect: ["bin gefahren", "bist gefahren", "ist gefahren", "sind gefahren", "seid gefahren", "sind gefahren"],
    imperative: ["fahr", "fahrt", "fahren Sie"],
  },
  {
    term: "lesen",
    conj: "strong",
    forms: { present2: "liest", present3: "liest", preterite: "las", perfect: "hat gelesen", imperative: "lies" },
    present: ["lese", "liest", "liest", "lesen", "lest", "lesen"],
    preterite: ["las", "lasest", "las", "lasen", "last", "lasen"],
    perfect: ["habe gelesen", "hast gelesen", "hat gelesen", "haben gelesen", "habt gelesen", "haben gelesen"],
    imperative: ["lies", "lest", "lesen Sie"],
  },
  {
    term: "sein",
    conj: "strong",
    forms: { present1: "bin", present2: "bist", present3: "ist", present1pl: "sind", present2pl: "seid", preterite: "war", perfect: "ist gewesen", imperative: "sei", imperativeSie: "seien Sie", subjunctive: "wäre" },
    present: ["bin", "bist", "ist", "sind", "seid", "sind"],
    preterite: ["war", "warst", "war", "waren", "wart", "waren"],
    perfect: ["bin gewesen", "bist gewesen", "ist gewesen", "sind gewesen", "seid gewesen", "sind gewesen"],
    imperative: ["sei", "seid", "seien Sie"],
    subjunctive: ["wäre", "wärest", "wäre", "wären", "wäret", "wären"],
  },
  {
    term: "haben",
    conj: "mixed",
    forms: { present2: "hast", present3: "hat", preterite: "hatte", perfect: "hat gehabt", subjunctive: "hätte" },
    present: ["habe", "hast", "hat", "haben", "habt", "haben"],
    preterite: ["hatte", "hattest", "hatte", "hatten", "hattet", "hatten"],
    perfect: ["habe gehabt", "hast gehabt", "hat gehabt", "haben gehabt", "habt gehabt", "haben gehabt"],
    imperative: ["hab", "habt", "haben Sie"],
    subjunctive: ["hätte", "hättest", "hätte", "hätten", "hättet", "hätten"],
  },
  {
    term: "werden",
    conj: "strong",
    forms: { present2: "wirst", present3: "wird", preterite: "wurde", perfect: "ist geworden", imperative: "werde", subjunctive: "würde" },
    present: ["werde", "wirst", "wird", "werden", "werdet", "werden"],
    preterite: ["wurde", "wurdest", "wurde", "wurden", "wurdet", "wurden"],
    perfect: ["bin geworden", "bist geworden", "ist geworden", "sind geworden", "seid geworden", "sind geworden"],
    imperative: ["werde", "werdet", "werden Sie"],
    subjunctive: ["würde", "würdest", "würde", "würden", "würdet", "würden"],
  },
  {
    term: "gehen",
    conj: "strong",
    forms: { present2: "gehst", present3: "geht", preterite: "ging", perfect: "ist gegangen" },
    present: ["gehe", "gehst", "geht", "gehen", "geht", "gehen"],
    preterite: ["ging", "gingst", "ging", "gingen", "gingt", "gingen"],
    perfect: ["bin gegangen", "bist gegangen", "ist gegangen", "sind gegangen", "seid gegangen", "sind gegangen"],
    imperative: ["geh", "geht", "gehen Sie"],
  },
  {
    term: "kommen",
    conj: "strong",
    forms: { present2: "kommst", present3: "kommt", preterite: "kam", perfect: "ist gekommen", subjunctive: "käme" },
    present: ["komme", "kommst", "kommt", "kommen", "kommt", "kommen"],
    preterite: ["kam", "kamst", "kam", "kamen", "kamt", "kamen"],
    perfect: ["bin gekommen", "bist gekommen", "ist gekommen", "sind gekommen", "seid gekommen", "sind gekommen"],
    imperative: ["komm", "kommt", "kommen Sie"],
    subjunctive: ["käme", "kämest", "käme", "kämen", "kämet", "kämen"],
  },
  {
    term: "wissen",
    conj: "modal",
    forms: { present1: "weiß", preterite: "wusste", perfect: "hat gewusst" },
    present: ["weiß", "weißt", "weiß", "wissen", "wisst", "wissen"],
    preterite: ["wusste", "wusstest", "wusste", "wussten", "wusstet", "wussten"],
    perfect: ["habe gewusst", "hast gewusst", "hat gewusst", "haben gewusst", "habt gewusst", "haben gewusst"],
    imperative: [null, null, null],
  },
  {
    term: "können",
    conj: "modal",
    forms: { present1: "kann", preterite: "konnte", perfect: "hat gekonnt", subjunctive: "könnte" },
    present: ["kann", "kannst", "kann", "können", "könnt", "können"],
    preterite: ["konnte", "konntest", "konnte", "konnten", "konntet", "konnten"],
    perfect: ["habe gekonnt", "hast gekonnt", "hat gekonnt", "haben gekonnt", "habt gekonnt", "haben gekonnt"],
    imperative: [null, null, null],
    subjunctive: ["könnte", "könntest", "könnte", "könnten", "könntet", "könnten"],
  },
  {
    term: "aufmachen",
    conj: "weak",
    forms: { sep: "auf" },
    present: ["mache auf", "machst auf", "macht auf", "machen auf", "macht auf", "machen auf"],
    preterite: ["machte auf", "machtest auf", "machte auf", "machten auf", "machtet auf", "machten auf"],
    perfect: ["habe aufgemacht", "hast aufgemacht", "hat aufgemacht", "haben aufgemacht", "habt aufgemacht", "haben aufgemacht"],
    imperative: ["mach auf", "macht auf", "machen Sie auf"],
  },
  {
    term: "anrufen",
    conj: "strong",
    forms: { sep: "an", present2: "rufst an", present3: "ruft an", preterite: "rief an", perfect: "hat angerufen" },
    present: ["rufe an", "rufst an", "ruft an", "rufen an", "ruft an", "rufen an"],
    preterite: ["rief an", "riefst an", "rief an", "riefen an", "rieft an", "riefen an"],
    perfect: ["habe angerufen", "hast angerufen", "hat angerufen", "haben angerufen", "habt angerufen", "haben angerufen"],
    imperative: ["ruf an", "ruft an", "rufen Sie an"],
  },
  {
    term: "besuchen",
    conj: "weak",
    forms: { perfect: "hat besucht" },
    present: ["besuche", "besuchst", "besucht", "besuchen", "besucht", "besuchen"],
    preterite: ["besuchte", "besuchtest", "besuchte", "besuchten", "besuchtet", "besuchten"],
    perfect: ["habe besucht", "hast besucht", "hat besucht", "haben besucht", "habt besucht", "haben besucht"],
    imperative: ["besuch", "besucht", "besuchen Sie"],
  },
  {
    term: "studieren",
    conj: "weak",
    present: ["studiere", "studierst", "studiert", "studieren", "studiert", "studieren"],
    preterite: ["studierte", "studiertest", "studierte", "studierten", "studiertet", "studierten"],
    perfect: ["habe studiert", "hast studiert", "hat studiert", "haben studiert", "habt studiert", "haben studiert"],
    imperative: ["studier", "studiert", "studieren Sie"],
  },
  {
    term: "sammeln",
    conj: "weak",
    present: ["sammle", "sammelst", "sammelt", "sammeln", "sammelt", "sammeln"],
    preterite: ["sammelte", "sammeltest", "sammelte", "sammelten", "sammeltet", "sammelten"],
    perfect: ["habe gesammelt", "hast gesammelt", "hat gesammelt", "haben gesammelt", "habt gesammelt", "haben gesammelt"],
    imperative: ["sammle", "sammelt", "sammeln Sie"],
  },
  {
    term: "öffnen",
    conj: "weak",
    present: ["öffne", "öffnest", "öffnet", "öffnen", "öffnet", "öffnen"],
    preterite: ["öffnete", "öffnetest", "öffnete", "öffneten", "öffnetet", "öffneten"],
    perfect: ["habe geöffnet", "hast geöffnet", "hat geöffnet", "haben geöffnet", "habt geöffnet", "haben geöffnet"],
    imperative: ["öffne", "öffnet", "öffnen Sie"],
  },
  {
    term: "tanzen",
    conj: "weak",
    present: ["tanze", "tanzt", "tanzt", "tanzen", "tanzt", "tanzen"],
    preterite: ["tanzte", "tanztest", "tanzte", "tanzten", "tanztet", "tanzten"],
    perfect: ["habe getanzt", "hast getanzt", "hat getanzt", "haben getanzt", "habt getanzt", "haben getanzt"],
    imperative: ["tanz", "tanzt", "tanzen Sie"],
  },
  {
    term: "wohnen",
    conj: "weak",
    present: ["wohne", "wohnst", "wohnt", "wohnen", "wohnt", "wohnen"],
    preterite: ["wohnte", "wohntest", "wohnte", "wohnten", "wohntet", "wohnten"],
    perfect: ["habe gewohnt", "hast gewohnt", "hat gewohnt", "haben gewohnt", "habt gewohnt", "haben gewohnt"],
    imperative: ["wohn", "wohnt", "wohnen Sie"],
  },
  {
    term: "rechnen",
    conj: "weak",
    present: ["rechne", "rechnest", "rechnet", "rechnen", "rechnet", "rechnen"],
    preterite: ["rechnete", "rechnetest", "rechnete", "rechneten", "rechnetet", "rechneten"],
    perfect: ["habe gerechnet", "hast gerechnet", "hat gerechnet", "haben gerechnet", "habt gerechnet", "haben gerechnet"],
    imperative: ["rechne", "rechnet", "rechnen Sie"],
  },
];
for (const r of deVerbs) {
  const item = word(r.term, r.conj, r.forms ? { forms: r.forms } : {});
  ok(`${r.term}: no data problem`, !conjWordProblem("de", item), conjWordProblem("de", item));
  P.forEach((pers, i) => {
    eq(`${r.term} present ${pers}`, deVerbForm(item, "present", pers)?.answers[0], r.present[i]);
    eq(`${r.term} preterite ${pers}`, deVerbForm(item, "preterite", pers)?.answers[0], r.preterite[i]);
    eq(`${r.term} perfect ${pers}`, deVerbForm(item, "perfect", pers)?.answers[0], r.perfect[i]);
    eq(`${r.term} subjunctive ${pers}`, deVerbForm(item, "subjunctive", pers)?.answers[0], r.subjunctive?.[i]);
  });
  ["du", "ihr", "Sie"].forEach((pers, i) => eq(`${r.term} imperative ${pers}`, deVerbForm(item, "imperative", pers)?.answers[0] ?? null, r.imperative[i]));
}
// Alternatives that are also standard.
const lesen = word("lesen", "strong", { forms: deVerbs[3].forms });
ok("du last (lasest) accepted", deVerbForm(lesen, "preterite", "du")!.answers.includes("last"));
const sein = word("sein", "strong", { forms: deVerbs[4].forms });
ok("wärst accepted", deVerbForm(sein, "subjunctive", "du")!.answers.includes("wärst"));
ok("hättst not accepted", !deVerbForm(word("haben", "mixed", { forms: deVerbs[5].forms }), "subjunctive", "du")!.answers.includes("hättst"));
ok("mache! accepted for mach!", deVerbForm(word("machen", "weak"), "imperative", "du")!.answers.includes("mache"));
ok("e→i imperative not guessed", deVerbForm(word("geben", "strong", { forms: { present2: "gibst", present3: "gibt", preterite: "gab", perfect: "hat gegeben" } }), "imperative", "du") === undefined);
ok("no Konjunktiv II unless given", deVerbForm(word("machen", "weak"), "subjunctive", "ich") === undefined);
// Rules.
ok("rule: stem change", /changes its stem/.test(deVerbForm(word("fahren", "strong", { forms: deVerbs[2].forms }), "present", "du")!.rule));
ok("rule: -e- insertion", /add -e-/.test(deVerbForm(word("arbeiten", "weak"), "present", "du")!.rule));
ok("rule: sein auxiliary", /sein/.test(deVerbForm(word("fahren", "strong", { forms: deVerbs[2].forms }), "perfect", "ich")!.rule));
ok("rule: -ieren", /-ieren/.test(deVerbForm(word("studieren", "weak"), "perfect", "ich")!.rule));

// German data checks.
const dp = (term: string, conj: string, forms?: Record<string, string>) => conjWordProblem("de", word(term, conj, forms ? { forms } : {}));
ok("strong needs present2/3, preterite, perfect", !!dp("fahren", "strong"));
ok("strong needs present3", !!dp("fahren", "strong", { present2: "fährst", preterite: "fuhr", perfect: "ist gefahren" }));
ok("mixed needs preterite", !!dp("bringen", "mixed", { perfect: "hat gebracht" }));
ok("modal needs present1", !!dp("können", "modal", { preterite: "konnte", perfect: "hat gekonnt" }));
ok("prefix-looking weak verb needs perfect", !!dp("besuchen", "weak"));
ok("separable-looking perfect needs sep", !!dp("einkaufen", "weak", { perfect: "hat eingekauft" }));
ok("antworten with perfect is fine", !dp("antworten", "weak", { perfect: "hat geantwortet" }));
ok("weak sein-verb needs perfect", !!dp("reisen", "weak"));
ok("reisen with perfect", !dp("reisen", "weak", { perfect: "ist gereist" }));
ok("bad perfect", !!dp("machen", "weak", { perfect: "gemacht" }));
ok("sep forms must end with prefix", !!dp("anrufen", "strong", { sep: "an", present2: "rufst", present3: "ruft", preterite: "rief", perfect: "hat angerufen" }));
ok("reflexive not drilled", !!dp("sich freuen", "weak"));
ok("not an infinitive", !!dp("macht", "weak"));
ok("unknown German class", !!dp("machen", "godan"));
ok("warn: weak verb with strong preterite", conjWordWarnings("de", word("machen", "weak", { forms: { preterite: "mach" } })).length === 1);
ok("warn: e→i without imperative", conjWordWarnings("de", word("geben", "strong", { forms: { present2: "gibst", present3: "gibt", preterite: "gab", perfect: "hat gegeben" } })).length === 1);

// --- German adjective endings --------------------------------------------------------------
const klein = word("klein", "adj");
const nouns = { m: { noun: "Hund", plural: "Hunde" }, f: { noun: "Katze", plural: "Katzen" }, n: { noun: "Kind", plural: "Kinder" }, pl: { noun: "Hund", plural: "Hunde" } };
const table: Record<DeArticle, Record<DeCase, string[]>> = {
  der: {
    nom: ["der kleine", "die kleine", "das kleine", "die kleinen"],
    acc: ["den kleinen", "die kleine", "das kleine", "die kleinen"],
    dat: ["dem kleinen", "der kleinen", "dem kleinen", "den kleinen"],
    gen: ["des kleinen", "der kleinen", "des kleinen", "der kleinen"],
  },
  ein: {
    nom: ["ein kleiner", "eine kleine", "ein kleines", "keine kleinen"],
    acc: ["einen kleinen", "eine kleine", "ein kleines", "keine kleinen"],
    dat: ["einem kleinen", "einer kleinen", "einem kleinen", "keinen kleinen"],
    gen: ["eines kleinen", "einer kleinen", "eines kleinen", "keiner kleinen"],
  },
  none: {
    nom: ["kleiner", "kleine", "kleines", "kleine"],
    acc: ["kleinen", "kleine", "kleines", "kleine"],
    dat: ["kleinem", "kleiner", "kleinem", "kleinen"],
    gen: [],
  },
};
for (const article of ["der", "ein", "none"] as DeArticle[])
  for (const c of ["nom", "acc", "dat", "gen"] as DeCase[])
    (["m", "f", "n", "pl"] as DeGender[]).forEach((gender, i) =>
      eq(`klein ${article} ${c} ${gender}`, deAdjForm(klein, { case: c, gender, article }, nouns[gender])?.answers[0], table[article][c][i]),
    );
ok("noun typed too", deAdjForm(klein, { case: "dat", gender: "pl", article: "der" }, nouns.pl)!.answers.includes("den kleinen Hunden"));
eq("dunkel → dunkle", deAdjForm(word("dunkel", "adj"), { case: "nom", gender: "f", article: "der" })?.answers[0], "die dunkle");
eq("teuer → teures", deAdjForm(word("teuer", "adj"), { case: "nom", gender: "n", article: "ein" })?.answers[0], "ein teures");
eq("müde → müder", deAdjForm(word("müde", "adj"), { case: "nom", gender: "m", article: "ein" })?.answers[0], "ein müder");
eq("sauber keeps e", deAdjForm(word("sauber", "adj"), { case: "nom", gender: "m", article: "der" })?.answers[0], "der saubere");
ok("hoch needs a stem", !!conjWordProblem("de", word("hoch", "adj")) && !deAdjForm(word("hoch", "adj"), { case: "nom", gender: "m", article: "der" }));
eq("hoch with stem", deAdjForm(word("hoch", "adj", { forms: { stem: "hoh" } }), { case: "nom", gender: "m", article: "der" })?.answers[0], "der hohe");
ok("lila refused", !!conjWordProblem("de", word("lila", "adj")));
ok("rule: mixed endings", /ein\/kein/.test(deAdjForm(klein, { case: "nom", gender: "m", article: "ein" })!.rule));

// --- German course: prompts, checking, rounds ----------------------------------------------------
const deCourse = normalizeCourse({
  format: "examiner-course",
  version: 1,
  id: "de-test",
  title: "DE",
  language: { code: "de", name: "German", conjugation: { forms: [{ form: "present" }, { form: "perfect" }, { form: "imperative" }, { form: "adj-dat" }], round: 6 } },
  lessons: [{ id: "l1", title: "One", body: "x" }],
  vocab: [
    { id: "fahren", lesson: "l1", term: "fahren", meanings: ["to drive"], pos: "verb", conj: "strong", forms: { present2: "fährst", present3: "fährt", preterite: "fuhr", perfect: "ist gefahren" } },
    { id: "klein", lesson: "l1", term: "klein", meanings: ["small"], pos: "adjective", conj: "adj" },
    { id: "hund", lesson: "l1", term: "der Hund", plural: "die Hunde", meanings: ["dog"], pos: "noun" },
    { id: "katze", lesson: "l1", term: "die Katze", plural: "die Katzen", meanings: ["cat"], pos: "noun" },
    { id: "kind", lesson: "l1", term: "das Kind", plural: "die Kinder", meanings: ["child"], pos: "noun" },
  ],
});
const fahrenPrompts = promptsFor(deCourse, deCourse.vocab![0], "present");
eq("one prompt per person", fahrenPrompts.map((x) => x.label), ["ich, present", "du, present", "er/sie/es, present", "wir, present", "ihr, present", "sie/Sie, present"]);
const er = fahrenPrompts[2];
ok("er form", checkConj(er, "fährt").ok);
ok("with a pronoun", checkConj(er, "sie fährt").ok && checkConj(er, "Es fährt").ok);
const caps = checkConj(er, "Fährt");
ok("capitals: right with a note", caps.ok && /capitals/.test(caps.note ?? ""));
const dig = checkConj(er, "faehrt");
ok("ae for ä: try again", !dig.ok && dig.retry === true);
ok("wrong", !checkConj(er, "fahrt").ok);
const [perfIch] = promptsFor(deCourse, deCourse.vocab![0], "perfect");
eq("perfect label", perfIch.label, "Perfekt, ich");
ok("perfect with ich", checkConj(perfIch, "ich bin gefahren").ok && checkConj(perfIch, "bin gefahren").ok && !checkConj(perfIch, "habe gefahren").ok);
const adjPrompts = promptsFor(deCourse, deCourse.vocab![1], "adj-dat", deCourse.vocab!.slice(2));
eq("adjective slots: 4 genders × 3 article types", adjPrompts.length, 12);
const em = adjPrompts.find((x) => x.slot?.gender === "m" && x.slot.article === "ein")!;
eq("adjective label", em.label, "dative singular, with ein");
ok("einem kleinen", checkConj(em, "einem kleinen").ok && checkConj(em, "einem kleinen Hund").ok && !checkConj(em, "einem kleinem").ok);
const dm = adjPrompts.find((x) => x.slot?.gender === "f" && x.slot.article === "der")!;
const wrongArticle = checkConj(dm, "die kleinen");
ok("adjective wrong article is a miss", !wrongArticle.ok);
const pde = { ...emptyProgress(), lessonsDone: { "de-test/l1": "2026-01-01" } };
const deRound = buildRound(deCourse, pde);
eq("round size from settings", deRound.length, 6);
ok("German round: only words with conj", deRound.every((r) => ["fahren", "klein"].includes(r.item.id)));

// --- Course data: normalization, canonical validation, samples -----------------------------------
eq("settings normalize", normalizeConjugationSettings({ forms: [{ form: "te", lesson: "l1" }, { form: "te" }, { form: "x" }], round: 500 }), { forms: [{ form: "te", lesson: "l1" }] });
eq("settings: nothing usable", normalizeConjugationSettings({ forms: [] }), undefined);
const rawJa = JSON.parse(readFileSync("samples/demo-japanese.json", "utf8"));
const demo = normalizeCourse(rawJa);
ok("demo has conjugation settings", (demo.language?.conjugation?.forms.length ?? 0) >= 3);
ok("demo words conjugate", (demo.vocab ?? []).filter((v) => v.conj).every((v) => !conjWordProblem("ja", v)));
const payload = { format: "erudior-canonical-authoring", version: 1, course: JSON.parse(exportCourseSnapshot(demo)) };
eq("canonical validator accepts the fields", validateCanonicalAuthoring(payload), []);
const bad = structuredClone(payload) as any;
bad.course.vocab[0].conj = "verb";
bad.course.vocab[0].forms = { nonsense: "x" };
bad.course.language.conjugation = { forms: [{ form: "nope" }], extra: 1 };
const errs = validateCanonicalAuthoring(bad);
ok("canonical validator rejects bad fields", ["conj", "forms.nonsense", "conjugation.extra", "forms[0].form"].every((k) => errs.some((e) => e.includes(k))), errs);

// --- Course checker ----------------------------------------------------------------------------
{
  const { checkCourse } = await import("./check-course.mts");
  const { mkdtempSync, writeFileSync } = await import("node:fs");
  const { tmpdir } = await import("node:os");
  const { join } = await import("node:path");
  const dir = mkdtempSync(join(tmpdir(), "conj-"));
  for (const f of ["samples/demo-japanese.json", "samples/demo-listening.json"]) {
    const warnings: string[] = [];
    eq(`${f} passes the checker`, await checkCourse(f, { runs: 1, warnings }), []);
    eq(`${f} has nothing to review`, warnings, []);
  }
  const ja = {
    format: "examiner-course",
    version: 1,
    id: "bad-ja",
    title: "Bad",
    language: { code: "ja", name: "Japanese", ime: "ja", conjugation: { forms: [{ form: "te", lesson: "nope" }, { form: "present" }, { form: "zzz" }] } },
    lessons: [{ id: "l1", title: "L", body: "x" }],
    vocab: [
      { id: "a", lesson: "l1", term: "書く", reading: "かく", meanings: ["write"], conj: "ichidan" },
      { id: "b", lesson: "l1", term: "帰る", reading: "かえる", meanings: ["go home"], pos: "verb", conj: "godan" },
      { id: "c", lesson: "l1", term: "くださる", meanings: ["give"], conj: "godan" },
      { id: "d", lesson: "l1", term: "見る", reading: "みる", meanings: ["see"], conj: "verb" },
      { id: "e", lesson: "l1", term: "高い", reading: "たかい", meanings: ["high"], pos: "verb", conj: "i-adj" },
    ],
  };
  writeFileSync(join(dir, "ja.json"), JSON.stringify(ja));
  const warnings: string[] = [];
  const probs = await checkCourse(join(dir, "ja.json"), { runs: 1, warnings });
  const has = (xs: string[], s: string) => xs.some((x) => x.includes(s));
  ok("checker: ichidan without e/i row", has(probs, "word a: ichidan verbs end in る"), probs);
  ok("checker: unsupported honorific", has(probs, "word c:"), probs);
  ok("checker: unknown class", has(probs, `word d: unknown "conj"`), probs);
  ok("checker: unknown lesson", has(probs, `unknown lesson "nope"`), probs);
  ok("checker: German form in a Japanese course", has(probs, `"present" isn't a Japanese form`), probs);
  ok("checker: unknown form", has(probs, `unknown form "zzz"`), probs);
  ok("checker warns: 帰る look-alike", has(warnings, "word b:"), warnings);
  ok("checker warns: pos mismatch", has(warnings, "word e:"), warnings);
  ok("warnings aren't problems", !has(probs, "word b:"), probs);
  const de = {
    format: "examiner-course",
    version: 1,
    id: "bad-de",
    title: "Bad",
    language: { code: "de", name: "German", conjugation: { forms: [{ form: "present" }, { form: "adj-nom" }] } },
    lessons: [{ id: "l1", title: "L", body: "x" }],
    vocab: [
      { id: "fahren", lesson: "l1", term: "fahren", meanings: ["drive"], conj: "strong", forms: { present2: "fährst", preterite: "fuhr", perfect: "ist gefahren" } },
      { id: "besuchen", lesson: "l1", term: "besuchen", meanings: ["visit"], conj: "weak" },
      { id: "klein", lesson: "l1", term: "klein", meanings: ["small"], conj: "adj", forms: { plural: "x" } },
    ],
  };
  writeFileSync(join(dir, "de.json"), JSON.stringify(de));
  const dprobs = await checkCourse(join(dir, "de.json"), { runs: 1 });
  ok("checker: strong verb needs present3", has(dprobs, "word fahren: strong verbs need forms.present3"), dprobs);
  ok("checker: prefix-looking verb", has(dprobs, "word besuchen:"), dprobs);
  ok("checker: unknown forms key", has(dprobs, "unknown forms.plural"), dprobs);
  ok("checker: adjective endings need nouns", has(dprobs, "need nouns"), dprobs);
}

console.log(fails ? `${fails} of ${checks} conjugation checks FAILED` : `conjugation tests passed (${checks} checks)`);
if (fails) process.exit(1);

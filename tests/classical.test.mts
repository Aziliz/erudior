// Latin and Ancient Greek: Beta Code typing, diacritic-optional grading (vocabulary, text and
// dictation questions, drills), dict recall, voice respelling and transliteration, pron blocks,
// lang attributes, checker rules, and the demo course.
import { JSDOM } from "jsdom";
const dom = new JSDOM("<!doctype html><html><head></head><body></body></html>", { url: "https://example.test", pretendToBeVisual: true });
Object.assign(globalThis, { window: dom.window, document: dom.window.document, HTMLElement: dom.window.HTMLElement, localStorage: dom.window.localStorage });
Object.defineProperty(globalThis, "navigator", { configurable: true, value: dom.window.navigator });

const { betaToGreek, insertGreekMark, toMonotonic } = await import("../src/lib/greek.ts");
const { compareClassical, marksNote, isClassical, entryKey } = await import("../src/lib/classical.ts");
const { latinRestored, latinEcclesiastical, greekRestored } = await import("../src/lib/classicalSpeech.ts");
const { imeFor, imeForAnswer, latinTyping } = await import("../src/lib/ime.ts");
const { checkAnswer, checkMeaning, checkRecall, genderLabel } = await import("../src/lib/vocab.ts");
const { isCorrect, partNotes, partsCorrect, textMatches, textVerdict } = await import("../src/lib/questions.ts");
const { normalizeCourse } = await import("../src/lib/course.ts");
const { normalizeBank } = await import("../src/lib/validate.ts");
const { checkConj } = await import("../src/lib/conjugation.ts");
const { pronProblems, protectPron, pronInlineHtml } = await import("../src/lib/pronBlocks.ts");
const { activeScheme, applyPronStyle, pickClip, registerSchemes, routeSpeech, setScheme, wordClip } = await import("../src/lib/pronunciation.ts");
const { renderMarkdown, markEmphasis } = await import("../src/components/Markdown.tsx");
const { classicalCourseProblems, classicalTextProblems } = await import("../src/lib/classicalCheck.ts");
const { validateCanonicalAuthoring } = await import("../src/lib/canonicalAuthoring.ts");
const { validateLessonSource } = await import("../src/lib/lessonSource.ts");
const { validateAudioClip } = await import("../src/lib/courseAudio.ts");
const { parseMedia } = await import("../src/lib/dialogueContent.ts");
const { checkCourse } = await import("./check-course.mts");
import { readFileSync } from "node:fs";
import type { Question, VocabItem } from "../src/lib/types.ts";

let fails = 0;
const ok = (name: string, cond: boolean, extra?: unknown) => {
  if (!cond) {
    fails++;
    console.log("FAIL", name, extra ?? "");
  }
};
const eq = (name: string, got: unknown, want: unknown) => ok(name, got === want, { got, want });

// --- Beta Code converter --------------------------------------------------------------------
const conv: [string, string][] = [
  // every mark
  ["a)", "ἀ"], ["a(", "ἁ"], ["a/", "ά"], ["a\\", "ὰ"], ["a=", "ᾶ"], ["a|", "ᾳ"], ["i+", "ϊ"], ["u+", "ϋ"],
  // marks in any order
  ["a)/", "ἄ"], ["a/)", "ἄ"], ["a(=|", "ᾇ"], ["a|=(", "ᾇ"], ["i+/", "ΐ"], ["i/+", "ΐ"],
  // words
  ["a)nh/r", "ἀνήρ"], ["w)|dh/", "ᾠδή"], ["r(h/twr", "ῥήτωρ"], ["tw=| a)nqrw/pw|", "τῷ ἀνθρώπῳ"], ["oi( a)/nqrwpoi", "οἱ ἄνθρωποι"],
  // every letter, and j = ξ
  ["abgdezhqiklmncoprstufxyw", "αβγδεζηθικλμνξοπρστυφχψω"], ["jenos", "ξενος"],
  // capitals: typed as capitals, with * (TLG), marks before (TLG) or after
  ["*(ella/s", "Ἑλλάς"], ["E(lla/s", "Ἑλλάς"], ["*e(lla/s", "Ἑλλάς"], [")Anh/r", "Ἀνήρ"], ["*)/a", "Ἄ"], ["A)/", "Ἄ"], ["*a|", "ᾼ"],
  // final sigma: word end, before punctuation, medial stays σ; TLG s1/s2
  ["lo/gos", "λόγος"], ["lo/gos, lo/gou", "λόγος, λόγου"], ["sofo/s", "σοφός"], ["bi/os1", "βίος"], ["s2ofos", "σοφος"],
  // TLG colon = raised dot; marks that don't belong stay as typed
  ["ou) ga/r:", "οὐ γάρ·"], ["k)", "κ)"],
];
for (const [t, want] of conv) eq(`beta ${t}`, betaToGreek(t), want);
// NFC output
for (const [t] of conv) ok(`NFC ${t}`, betaToGreek(t) === betaToGreek(t).normalize("NFC"));
// idempotence: the converter's own output, and Greek typed on a device keyboard, pass through
for (const [t] of conv) eq(`idempotent ${t}`, betaToGreek(betaToGreek(t)), betaToGreek(t));
for (const g of ["ἀνήρ", "ᾠδή", "Ἑλλάς", "ῥήτωρ", "τῷ ἀνθρώπῳ", "ΐ", "λόγος λόγου", "Ὅμηρος"]) eq(`pasted ${g}`, betaToGreek(g), g);
eq("pasted NFD", betaToGreek("ἀνήρ".normalize("NFD")), "ἀνήρ");
eq("pasted oxia → tonos (NFC)", betaToGreek("ά"), "ά");
eq("typed medial ς fixed", betaToGreek("λόγοςα"), "λόγοσα");
// combining with the letter before: typed mark after converted Greek, and a second accent replaces the first
eq("mark after Greek", betaToGreek("ἀ/"), "ἄ");
eq("accent replaced", betaToGreek("ά\\"), "ὰ");
eq("breathing replaced", betaToGreek("ἀ("), "ἁ");
// the ime registry and `final`
eq("ime grc", imeFor({ code: "grc", name: "Greek", ime: "grc" })!("a)nh/r", { final: true }), "ἀνήρ");
eq("ime grc final sigma", imeFor({ code: "grc", name: "Greek", ime: "grc" })!("lo/gos", { final: true }), "λόγος");
// mark buttons (insertGreekMark): combine with the letter before the caret
eq("key smooth", insertGreekMark("a", 1, "̓").text, "ἀ");
eq("key acute after breathing", insertGreekMark("ἀνη", 1, "́").text, "ἄνη");
eq("key caret", insertGreekMark("ἀνη", 3, "́").caret, 3);
eq("key iota sub", insertGreekMark("τω", 2, "ͅ").text, "τῳ");
eq("key ς", insertGreekMark("λογο", 4, "ς").text, "λογος");
// Latin a_ → ā
eq("latin macron typing", latinTyping("puella_ ama_re"), "puellā amāre");
eq("latin idempotent", latinTyping(latinTyping("puella_")), "puellā");
// converter by answer script (Latin course quoting Greek; English answer in a Greek course)
const la = { code: "la", name: "Latin", ime: "la" };
const grc = { code: "grc", name: "Greek", ime: "grc" };
eq("la course, Greek answer → Beta Code", imeForAnswer(la, ["ἀνήρ"])!("a)nh/r"), "ἀνήρ");
eq("la course, Latin answer → a_", imeForAnswer(la, ["puellā"])!("puella_"), "puellā");
ok("grc course, English answer → none", imeForAnswer(grc, ["man"]) === undefined);

// --- Matching ---------------------------------------------------------------------------------
ok("isClassical", isClassical("la") && isClassical("grc") && isClassical("la-x-eccl") && !isClassical("de") && !isClassical(undefined));
eq("compare exact", compareClassical("Puellā", "puellā"), "exact");
eq("compare missing macron", compareClassical("puella", "puellā"), "marks");
eq("compare wrong macron", compareClassical("pūella", "puellā"), "marks");
eq("compare wrong letter", compareClassical("puellam", "puellā"), false);
eq("compare ς/σ unified", compareClassical("λογοσ", "λογος"), "exact");
eq("compare oxia/tonos", compareClassical("ά", "ά"), "exact");
eq("compare NFD", compareClassical("ἀνήρ".normalize("NFD"), "ἀνήρ"), "exact");
eq("compare breathing", compareClassical("ἁνήρ", "ἀνήρ"), "marks");
eq("compare iota sub", compareClassical("τω", "τῷ"), "marks");
eq("compare diaeresis", compareClassical("Τροια", "Τροΐα"), "marks");
eq("note macron", marksNote("puella", "puellā"), "With macrons: puellā");
eq("note accents", marksNote("ἀνθρῶπου", "ἀνθρώπου"), "With accents: ἀνθρώπου");
eq("note accents+breathings", marksNote("ανηρ", "ἀνήρ"), "With accents and breathings: ἀνήρ");
eq("note iota", marksNote("τῶ", "τῷ"), "With iota subscript: τῷ");
eq("entry key", entryKey("amō, amāre,  amāvī, amātum"), "amō amāre amāvī amātum");
eq("entry key hyphens", entryKey("magnus, -a, -um"), "magnus a um");

// --- Vocabulary recall and meaning cards -------------------------------------------------------
const puella: VocabItem = { id: "puella", lesson: "l1", term: "puella", dict: "puella, puellae, f.", gender: "f", meanings: ["girl"], pos: "noun" };
const amo: VocabItem = { id: "amo", lesson: "l1", term: "amō", dict: "amō, amāre, amāvī, amātum", meanings: ["love", "like"], pos: "verb" };
const magnus: VocabItem = { id: "magnus", lesson: "l1", term: "magnus", dict: "magnus, -a, -um", meanings: ["big"] };
const aner: VocabItem = { id: "aner", lesson: "l2", term: "ἀνήρ", dict: "ἀνήρ, ἀνδρός, ὁ", gender: "m", meanings: ["man"] };
const roma: VocabItem = { id: "roma", lesson: "l1", term: "Rōma", meanings: ["Rome"] };
ok("recall exact", checkRecall(amo, "amō", "la").ok && !checkRecall(amo, "amō", "la").note);
const noMac = checkRecall(amo, "amo", "la");
ok("recall no macron: right with note", noMac.ok && noMac.note === "With macrons: amō", noMac);
const wrongMac = checkRecall(amo, "āmo", "la");
ok("recall wrong macron: right with note", wrongMac.ok && wrongMac.note === "With macrons: amō", wrongMac);
ok("recall wrong letters wrong", !checkRecall(amo, "ama", "la").ok && !checkRecall(amo, "amō", "la").note);
ok("recall capitals", checkRecall(roma, "roma", "la").ok && checkRecall(roma, "ROMA", "la").ok);
const grcNo = checkRecall(aner, "ανηρ", "grc");
ok("recall Greek unaccented", grcNo.ok && grcNo.note === "With accents and breathings: ἀνήρ", grcNo);
ok("recall Greek wrong accent", checkRecall(aner, "ἀνὴρ", "grc").ok);
ok("recall Greek wrong letter", !checkRecall(aner, "ἀνέρ", "grc").ok);
// dict: the full entry, punctuation and spacing ignored
ok("dict exact", checkRecall(amo, "amō, amāre, amāvī, amātum", "la").ok);
const dictLoose = checkRecall(amo, "amo amare amavi amatum", "la");
ok("dict loose", dictLoose.ok && dictLoose.note === "With macrons: amō, amāre, amāvī, amātum", dictLoose);
ok("dict spacing", checkRecall(puella, "puella,puellae , f", "la").ok);
ok("dict hyphens", checkRecall(magnus, "magnus a um", "la").ok && checkRecall(magnus, "magnus -a -um", "la").ok);
ok("dict Greek", checkRecall(aner, "ανηρ ανδρος ο", "grc").ok);
ok("dict wrong part", !checkRecall(amo, "amo amare amavi amatus", "la").ok);
// meaning cards (English) unchanged, and a Latin name in a gloss ignores macrons
ok("meaning", checkMeaning(amo, "to love", "la").ok && !checkMeaning(amo, "hate", "la").ok);
const rome: VocabItem = { id: "x", lesson: "l1", term: "urbs", meanings: ["the city (Rōma)", "Rōma's city"] };
ok("meaning with macron name", checkMeaning(rome, "Roma's city", "la").ok);
ok("checkAnswer recall", checkAnswer({ item: amo, dir: "recall", key: "k" }, "amo", "la").ok);
// German unchanged: accents/umlauts still matter
ok("German unchanged", !checkRecall({ id: "h", lesson: "l", term: "die Tür", meanings: ["door"] }, "die Tur", "de").ok);

// --- Text and dictation questions ---------------------------------------------------------------
const tq = (accept: string[][], lang?: string, extra: Partial<Question> = {}): Question =>
  ({ id: "t", topic: "x", type: "text", stem: "___", choices: [], answer: [], accept, ...(lang ? { lang } : {}), ...extra }) as Question;
ok("text exact", isCorrect(tq([["puellā"]], "la"), ["puellā"]));
ok("text no macron", isCorrect(tq([["puellā"]], "la"), ["puella"]));
eq("text note", partNotes(tq([["puellā"]], "la"), ["puella"])[0], "With macrons: puellā");
ok("text wrong letter", !isCorrect(tq([["puellā"]], "la"), ["puellam"]));
ok("text Greek inferred without lang", isCorrect(tq([["ἀνθρώπου"]]), ["ανθρωπου"]));
eq("text Greek note", partNotes(tq([["ἀνθρώπου"]], "grc"), ["ἀνθρῶπου"])[0], "With accents: ἀνθρώπου");
ok("text Greek NFD typed", isCorrect(tq([["ἀνθρώπου"]], "grc"), ["ἀνθρώπου".normalize("NFD")]));
ok("text Greek final punctuation", textMatches("τῷ ἀνθρώπῳ.", ["τῷ ἀνθρώπῳ"], false, false, "grc"));
ok("text Latin unmacronized key, stray macron typed", isCorrect(tq([["est"]], "la"), ["ēst"]));
ok("text non-classical unchanged", !textMatches("canción", ["cancion"]) && !textMatches("cancion", ["canción"], false, false, "es"));
ok("text case-insensitive", isCorrect(tq([["Rōma"]], "la"), ["roma"]));
ok("text caseSensitive kept", !isCorrect(tq([["Rōma"]], "la", { caseSensitive: true }), ["roma"]) && isCorrect(tq([["Rōma"]], "la", { caseSensitive: true }), ["Roma"]));
ok("text parts", JSON.stringify(partsCorrect(tq([["puellā"], ["ἀνήρ"]], "la", { stem: "___ ___" }), ["puella", "ανηρ"])) === "[true,true]");
ok("textVerdict exact no note", textVerdict("puellā", ["puellā"], false, false, "la").ok && !textVerdict("puellā", ["puellā"], false, false, "la").note);
// dictation: a text question with audio, same grading
const dict = tq([["Puella aquam portat"]], "la", { audio: { text: "Puella aquam portat.", lang: "la" } });
ok("dictation", isCorrect(dict, ["puella aquam portat."]));
// questions in a Latin course carry lang; bank normalization keeps an authored lang
const course = normalizeCourse(JSON.parse(readFileSync("samples/demo-classical.json", "utf8")));
ok("course stamps lang", course.banks[0].questions.every((q) => q.lang === "la"));
const bank = normalizeBank({ format: "examiner-bank", version: 1, title: "b", questions: [{ id: "a", stem: "___", type: "text", accept: [["puellā"]], lang: "la" }] });
eq("bank keeps lang", bank.questions[0].lang, "la");
ok("course pronunciations", course.language?.pronunciations?.length === 2 && course.language.pronunciations[0].id === "restored");
ok("course dict/gender", course.vocab?.find((v) => v.id === "puella")?.dict === "puella, puellae, f." && course.vocab?.find((v) => v.id === "puella")?.gender === "f");
// drills: conjugation answers go through checkRecall, so diacritics are optional there too
const prompt = { item: amo, form: "pres-3sg", label: "3rd sg. present", answers: ["amat"], rule: "" } as unknown as Parameters<typeof checkConj>[0];
ok("drill exact", checkConj(prompt, "amat", "la").ok);
const promptG = { item: aner, form: "gen-sg", label: "genitive singular", answers: ["ἀνδρός"], rule: "" } as unknown as Parameters<typeof checkConj>[0];
const dv = checkConj(promptG, "ανδρος", "grc");
ok("drill Greek no accent", dv.ok && dv.note === "With accents and breathings: ἀνδρός", dv);
ok("drill wrong ending", !checkConj(promptG, "ανδρι", "grc").ok);
// build questions: tiles are picked, not typed, so there's nothing to strip (sentenceBuild unchanged)

// elision apostrophes: ’ ʼ ' ᾽ (U+1FBD) and U+02BC all match, typed or accepted
for (const ap of ["’", "ʼ", "'", "᾽", "\u02bc", "\u1fbf"]) {
  ok(`text apostrophe ${JSON.stringify(ap)}`, isCorrect(tq([["ἀλλ’ ἐγώ"]], "grc"), [`ἀλλ${ap} ἐγώ`]));
  ok(`text apostrophe key ${JSON.stringify(ap)}`, isCorrect(tq([[`δι${ap} αὐτοῦ`]], "grc"), ["δι' αυτου"]));
  ok(`recall apostrophe ${JSON.stringify(ap)}`, checkRecall({ id: "x", lesson: "l", term: "ἀλλ’", meanings: ["but"] }, `ἀλλ${ap}`, "grc").ok);
}
// genders: m/f and "m, f" (normalized)
const g2 = normalizeCourse({ ...JSON.parse(readFileSync("samples/demo-classical.json", "utf8")), vocab: [{ id: "civis", lesson: "la-l1", term: "cīvis", dict: "cīvis, cīvis, m./f.", gender: "m, f", meanings: ["citizen"] }] });
eq("gender m, f normalized", g2.vocab?.[0].gender, "m/f");
ok("gender checker accepts m, f", !classicalCourseProblems({ vocab: [{ id: "a", term: "cīvis", gender: "m, f" }] }, "la").length);
eq("gender label", genderLabel("m, f"), "masculine or feminine");

// --- Respelling and transliteration --------------------------------------------------------------
const lr: [string, string][] = [
  ["Cicerō", "Chichero"], ["Caesar", "Caisar"], ["vīnum", "uinum"], ["caelum", "cailum"], ["poena", "poina"], ["gēns", "ghens"],
  ["scīre", "schire"], ["magnus", "mangnus"], ["philosophia", "pilosopia"], ["nihil", "niil"], ["quae", "quai"], ["grātia", "gratia"],
  ["Achillēs", "Achilles"], ["annus", "annus"],
];
for (const [t, w] of lr) eq(`restored ${t}`, latinRestored(t), w);
const le: [string, string][] = [["Cicerō", "Cicero"], ["caelum", "celum"], ["grātia", "grazia"], ["hostia", "hostia"], ["philosophia", "filosofia"], ["vīnum", "vinum"]];
for (const [t, w] of le) eq(`ecclesiastical ${t}`, latinEcclesiastical(t), w);
const gr: [string, string][] = [
  ["ἀνήρ", "anèr"], ["ᾠδή", "odè"], ["Ἑλλάς", "Hellas"], ["ῥήτωρ", "rètor"], ["τῷ ἀνθρώπῳ", "to antropo"], ["φιλοσοφία", "pilosopia"],
  ["οἱ ἄνθρωποι", "hoi antropoi"], ["εἰμί", "emi"], ["ἄγγελος", "anghelos"], ["θεός", "teos"], ["ψυχή", "psuchè"], ["Ζεύς", "Sdeus"], ["καί", "cai"],
];
for (const [t, w] of gr) eq(`greek restored ${t}`, greekRestored(t), w);
eq("monotonic", toMonotonic("τῷ ἀνθρώπῳ ὁ λόγος ἐστὶ"), "τώ ανθρώπω ο λόγος εστί");
eq("monotonic circumflex", toMonotonic("ψυχῆς"), "ψυχής");

// --- Pronunciation switch: routing, clips -------------------------------------------------------
localStorage.clear();
registerSchemes("la", course.language!.pronunciations);
eq("default scheme", activeScheme("la"), "restored");
let r = routeSpeech("Cicerō", "la");
ok("route la restored", r.lang === "it-IT" && r.text === "Chichero", r);
setScheme("la", "ecclesiastical");
eq("scheme saved per language", localStorage.getItem("erudior.pron.la"), "ecclesiastical");
r = routeSpeech("Cicerō", "la");
ok("route la ecclesiastical", r.lang === "it-IT" && r.text === "Cicero", r);
eq("grc unaffected by la", activeScheme("grc"), "restored");
r = routeSpeech("τῷ ἀνθρώπῳ", "grc");
ok("route grc restored", r.lang === "it-IT" && r.text === "to antropo", r);
setScheme("grc", "modern");
r = routeSpeech("τῷ ἀνθρώπῳ", "grc");
ok("route grc modern", r.lang === "el-GR" && r.text === "τώ ανθρώπω", r);
r = routeSpeech("ἀνήρ", "la");
ok("Greek in a Latin course read as Greek", r.lang === "el-GR", r);
r = routeSpeech("Hallo", "de-DE");
ok("other languages pass through", r.lang === "de-DE" && r.text === "Hallo");
const A = "data:audio/mpeg;base64,AAAA", B = "data:audio/mpeg;base64,BBBB";
eq("clip without srcs", pickClip({ src: A }, "la"), A);
eq("clip for scheme", pickClip({ src: A, srcs: { ecclesiastical: B }, text: "x" }, "la"), B);
setScheme("la", "restored");
eq("clip missing for scheme → voice", pickClip({ srcs: { ecclesiastical: B }, text: "x" }, "la"), undefined);
eq("clip missing, no text → src", pickClip({ src: A, srcs: { ecclesiastical: B } }, "la"), A);
eq("word clip default scheme", wordClip(A, "la"), A);
setScheme("la", "ecclesiastical");
eq("word clip other scheme → voice", wordClip(A, "la"), undefined);
ok("audio srcs validate", validateAudioClip({ srcs: { ecclesiastical: "data:audio/mpeg;base64,AAAA" }, text: "x" }).length === 0);
ok("audio srcs bad id", validateAudioClip({ srcs: { "Bad Id": "data:audio/mpeg;base64,AAAA" } }).length > 0);
const media = parseMedia("speak", "", "Salvē.\naudio: data:audio/mpeg;base64,AAAA\naudio ecclesiastical: data:audio/mpeg;base64,BBBB\n");
ok("speak per-scheme audio", !media.problems.length && media.lines[0].audio === A && media.lines[0].audios?.ecclesiastical === B, media);

// --- pron blocks ---------------------------------------------------------------------------------
const md = "Intro.\n\n```pron restored\n*c* is hard: *Cicerō*.\n```\n\n```pron ecclesiastical\n*c* is soft.\n```\n\nThe ending {pron=restored}[aɪ̯]{/pron}{pron=ecclesiastical}[e]{/pron}.";
const ctx = { lang: "la", schemes: course.language!.pronunciations };
const html = renderMarkdown(md, undefined, undefined, undefined, ctx);
ok("pron block rendered", html.includes('class="pron-blk" data-pron-lang="la" data-pron="restored"') && html.includes('data-pron="ecclesiastical"'), html);
ok("pron body is Markdown", /<div class="pron-body"><p><em>c<\/em> is hard/.test(html), html);
ok("pron note label", html.includes("Shown for Ecclesiastical pronunciation") && html.includes("Restored classical pronunciation"), html);
ok("pron inline", html.includes('<span class="pron-inl" data-pron-lang="la" data-pron="restored">'), html);
ok("pron no leftover markup", !html.includes("```pron") && !html.includes("{pron="), html);
ok("pron protect skips bad id", protectPron("```pron Bad\nx\n```", (b) => b, ctx).text.includes("```pron Bad"));
eq("pron inline helper", pronInlineHtml("a {pron=restored}b{/pron}", ctx), 'a <span class="pron-inl" data-pron-lang="la" data-pron="restored"><span class="pron-inl-tag">Restored classical: </span>b</span>');
ok("pron problems ok", pronProblems(md, ["restored", "ecclesiastical"]).length === 0, pronProblems(md, ["restored", "ecclesiastical"]));
ok("pron problems undeclared", pronProblems("```pron erasmian\nx\n```", ["restored"]).some((p) => p.includes('"erasmian" isn\'t in language.pronunciations')));
ok("pron problems unclosed inline", pronProblems("{pron=restored}x", ["restored"]).length > 0);
ok("pron problems empty", pronProblems("```pron restored\n\n```", ["restored"]).some((p) => p.includes("empty")));
// the rule that hides the other scheme on screen, and shows all in print
setScheme("la", "restored");
applyPronStyle();
const css = document.getElementById("pron-style")?.textContent ?? "";
ok("pron style hides others", css.includes('@media screen') && css.includes('.pron-blk[data-pron-lang="la"]:not([data-pron="restored"]) > .pron-body'), css);
setScheme("la", "ecclesiastical");
ok("pron style follows switch", (document.getElementById("pron-style")?.textContent ?? "").includes(':not([data-pron="ecclesiastical"])'));
// lesson source validation knows pron
ok("lesson source pron ok", validateLessonSource(md, { course: { language: { pronunciations: [{ id: "restored" }, { id: "ecclesiastical" }] } } }).length === 0, validateLessonSource(md, { course: { language: { pronunciations: [{ id: "restored" }, { id: "ecclesiastical" }] } } }));
ok("lesson source pron undeclared", validateLessonSource("```pron modern\nx\n```", { course: { language: { pronunciations: [{ id: "restored" }] } } }).length > 0);

// --- lang attributes ----------------------------------------------------------------------------
eq("em la", markEmphasis("<em>puella</em>", "la"), '<em lang="la">puella</em>');
eq("em Greek in Latin course", markEmphasis("<em>λόγος</em>", "la"), '<em lang="grc">λόγος</em>');
eq("em grc", markEmphasis("<em>ἀνήρ</em>", "grc"), '<em lang="grc">ἀνήρ</em>');
eq("em transliteration", markEmphasis("<em>anēr</em>", "grc"), '<em lang="grc-Latn">anēr</em>');
eq("blockquote grc", markEmphasis("<blockquote><p>x</p></blockquote>", "grc"), '<blockquote lang="grc"><p>x</p></blockquote>');
eq("em de unchanged", markEmphasis("<em>Hund</em>", "de"), '<em lang="de">Hund</em>');

// --- Checker rules -------------------------------------------------------------------------------
ok("check clean word", classicalTextProblems("ἀνήρ λόγος").length === 0);
ok("check NFC", classicalTextProblems("ἀνήρ".normalize("NFD")).some((p) => p.includes("NFC")));
ok("check Latin look-alike in Greek", classicalTextProblems("λoγος").some((p) => p.includes("Latin")));
ok("check Cyrillic look-alike in Greek", classicalTextProblems("λоγος").some((p) => p.includes("Cyrillic")));
ok("check Greek in Latin word", classicalTextProblems("Rοma").some((p) => p.includes("mixes Greek")));
ok("check medial ς", classicalTextProblems("λόςγος").some((p) => p.includes("inside")));
ok("check final σ", classicalTextProblems("λόγοσ").some((p) => p.includes("ends in σ")));
ok("check lone σ ok", classicalTextProblems("the letter σ").length === 0);
const rawBad = {
  language: { code: "grc", name: "Greek", tts: "el-GR" },
  vocab: [{ id: "a", term: "ἀνήρ", dict: "ἀνδρός, ὁ", gender: "x" }],
};
const bad = classicalCourseProblems(rawBad, "grc");
ok("check dict headword", bad.some((p) => p.includes("must start with the headword")), bad);
ok("check gender", bad.some((p) => p.includes('"gender"')), bad);
ok("check tts bypass", bad.some((p) => p.includes("language.tts")), bad);
// canonical model accepts the new fields
const canon = validateCanonicalAuthoring({ format: "erudior-canonical-authoring", version: 1, course: JSON.parse(readFileSync("samples/demo-classical.json", "utf8")) });
ok("canonical accepts demo", canon.length === 0, canon);
const canonBad = validateCanonicalAuthoring({
  format: "erudior-canonical-authoring",
  version: 1,
  course: { ...JSON.parse(readFileSync("samples/demo-classical.json", "utf8")), language: { code: "la", name: "Latin", pronunciations: [{ id: "Restored", label: "x" }] } },
});
ok("canonical rejects bad scheme id", canonBad.some((e) => e.includes("pronunciations")), canonBad);
// the demo course passes the full checker
const demo = await checkCourse("samples/demo-classical.json", { runs: 1 });
ok("demo course clean", demo.length === 0, demo);

if (fails) {
  console.log(`${fails} failed`);
  process.exit(1);
}
console.log("classical: all passed");

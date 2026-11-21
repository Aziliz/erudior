// Latin and Ancient Greek inflection drills. Every expected paradigm below is written out by hand
// from Allen & Greenough's New Latin Grammar (Latin) and Smyth's Greek Grammar (Greek), with
// macrons, accents and breathings exactly as there; none is derived from the generator.
import assert from "node:assert/strict";
import { checkConj, conjMissing, conjWordProblem, conjWordWarnings, formName, formsForClass, promptsFor, classicalWord } from "../src/lib/conjugation.ts";
import { normalizeConjFields, normalizeConjugationSettings } from "../src/lib/courseConjugation.ts";
import { slotsOfForm } from "../src/lib/conjugationClassical.ts";
import type { Course, VocabItem } from "../src/lib/types.ts";

const word = (term: string, conj: string, dict: string, forms?: Record<string, string>, extra: Partial<VocabItem> = {}): VocabItem =>
  ({ id: term, lesson: "l1", term, meanings: ["x"], conj, dict, ...(forms ? { forms } : {}), ...extra }) as VocabItem;
const course = (code: string, vocab: VocabItem[], forms: string[] = []): Course =>
  ({ id: `c-${code}`, title: "t", lessons: [], vocab, language: { code, name: code, conjugation: { forms: forms.map((form) => ({ form })) } } }) as unknown as Course;

/** The usual form of every slot under a row ("sg", "pres-act-ind", "sg.nom"), "—" for none. */
function row(lang: string, item: VocabItem, key: string): string {
  const w = classicalWord(lang, item);
  if (typeof w === "string") throw new Error(`${item.term}: ${w}`);
  let under = w.slots.filter((s) => s === key || s.startsWith(key + "."));
  under = under.filter((s) => s.split(".")[1] !== "loc" || key.endsWith("loc"));
  return under.map((s) => w.cells.get(s)?.forms[0] ?? "—").join(", ");
}
/** Check rows of a word: { "sg": "puella, puellae, …" }. */
function paradigm(lang: string, item: VocabItem, rows: Record<string, string>) {
  const p = conjWordProblem(lang, item);
  assert.equal(p, undefined, `${item.term}: ${p}`);
  for (const [k, want] of Object.entries(rows)) assert.equal(row(lang, item, k), want.normalize("NFC"), `${item.term} ${k}`);
}
const cell = (lang: string, item: VocabItem, slot: string) => {
  const w = classicalWord(lang, item);
  if (typeof w === "string") throw new Error(w);
  return w.cells.get(slot);
};
const la = (term: string, conj: string, dict: string, forms?: Record<string, string>) => word(term, conj, dict, forms);
const gr = (term: string, conj: string, dict: string, forms?: Record<string, string>) => word(term, conj, dict, forms);

// =============================================================================================
// Latin nouns (A&G 37–98). Rows: nom, gen, dat, acc, abl, voc.

paradigm("la", la("puella", "decl1", "puella, puellae, f."), {
  sg: "puella, puellae, puellae, puellam, puellā, puella",
  pl: "puellae, puellārum, puellīs, puellās, puellīs, puellae",
});
paradigm("la", la("puella", "decl1", "puella, -ae, f."), { "sg.gen": "puellae" });
paradigm("la", la("servus", "decl2", "servus, servī, m."), {
  sg: "servus, servī, servō, servum, servō, serve",
  pl: "servī, servōrum, servīs, servōs, servīs, servī",
});
paradigm("la", la("puer", "decl2", "puer, puerī, m."), {
  sg: "puer, puerī, puerō, puerum, puerō, puer",
  pl: "puerī, puerōrum, puerīs, puerōs, puerīs, puerī",
});
paradigm("la", la("ager", "decl2", "ager, agrī, m."), {
  sg: "ager, agrī, agrō, agrum, agrō, ager",
  pl: "agrī, agrōrum, agrīs, agrōs, agrīs, agrī",
});
paradigm("la", la("bellum", "decl2", "bellum, bellī, n."), {
  sg: "bellum, bellī, bellō, bellum, bellō, bellum",
  pl: "bella, bellōrum, bellīs, bella, bellīs, bella",
});
const filius = la("fīlius", "decl2", "fīlius, fīliī, m.");
paradigm("la", filius, {
  sg: "fīlius, fīliī, fīliō, fīlium, fīliō, fīlī",
  pl: "fīliī, fīliōrum, fīliīs, fīliōs, fīliīs, fīliī",
});
assert.deepEqual(cell("la", filius, "sg.gen")!.forms, ["fīliī", "fīlī"], "-ius genitive: -iī or the older -ī (A&G 49 b)");
paradigm("la", la("deus", "decl2", "deus, deī, m."), {
  sg: "deus, deī, deō, deum, deō, deus",
  pl: "deī, deōrum, deīs, deōs, deīs, deī",
});
assert.deepEqual(cell("la", la("deus", "decl2", "deus, deī, m."), "pl.nom")!.forms, ["deī", "diī", "dī"]);
paradigm("la", la("rēx", "decl3", "rēx, rēgis, m."), {
  sg: "rēx, rēgis, rēgī, rēgem, rēge, rēx",
  pl: "rēgēs, rēgum, rēgibus, rēgēs, rēgibus, rēgēs",
});
paradigm("la", la("corpus", "decl3", "corpus, corporis, n."), {
  sg: "corpus, corporis, corporī, corpus, corpore, corpus",
  pl: "corpora, corporum, corporibus, corpora, corporibus, corpora",
});
const civis = la("cīvis", "decl3-i", "cīvis, cīvis, m.");
paradigm("la", civis, {
  sg: "cīvis, cīvis, cīvī, cīvem, cīve, cīvis",
  pl: "cīvēs, cīvium, cīvibus, cīvēs, cīvibus, cīvēs",
});
assert.deepEqual(cell("la", civis, "pl.acc")!.forms, ["cīvēs", "cīvīs"], "i-stem accusative plural -ēs or -īs (A&G 77)");
paradigm("la", la("mare", "decl3-i", "mare, maris, n."), {
  sg: "mare, maris, marī, mare, marī, mare",
  pl: "maria, —, maribus, maria, maribus, maria",
});
paradigm("la", la("manus", "decl4", "manus, manūs, f."), {
  sg: "manus, manūs, manuī, manum, manū, manus",
  pl: "manūs, manuum, manibus, manūs, manibus, manūs",
});
paradigm("la", la("cornū", "decl4", "cornū, cornūs, n."), {
  sg: "cornū, cornūs, cornū, cornū, cornū, cornū",
  pl: "cornua, cornuum, cornibus, cornua, cornibus, cornua",
});
paradigm("la", la("diēs", "decl5", "diēs, diēī, m."), {
  sg: "diēs, diēī, diēī, diem, diē, diēs",
  pl: "diēs, diērum, diēbus, diēs, diēbus, diēs",
});
paradigm("la", la("rēs", "decl5", "rēs, reī, f."), {
  sg: "rēs, reī, reī, rem, rē, rēs",
  pl: "rēs, rērum, rēbus, rēs, rēbus, rēs",
});
paradigm("la", la("domus", "decl4", "domus, domūs, f."), {
  sg: "domus, domūs, domuī, domum, domō, domus",
  pl: "domūs, domuum, domibus, domōs, domibus, domūs",
  "sg.loc": "domī",
});
paradigm("la", la("vīs", "decl3-i", "vīs, vīs, f."), {
  sg: "vīs, vīs, vī, vim, vī, vīs",
  pl: "vīrēs, vīrium, vīribus, vīrēs, vīribus, vīrēs",
});
assert.match(conjWordProblem("la", la("rēx", "decl1", "rēx, rēgis, m."))!, /doesn't fit 1st declension/);
assert.match(conjWordProblem("la", la("rēx", "decl3", "rēx, rēgis"))!, /gender/);
assert.match(conjWordProblem("la", la("rēx", "decl3", ""))!, /dict/);
assert.match(conjWordProblem("la", la("corpus", "decl3", "corpus, -oris, n."))!, /in full/);

// =============================================================================================
// Latin adjectives (A&G 110–131). Rows: sg.nom … pl.voc, each masculine, feminine, neuter.

paradigm("la", la("magnus", "adj12", "magnus, -a, -um"), {
  "sg.nom": "magnus, magna, magnum", "sg.gen": "magnī, magnae, magnī", "sg.dat": "magnō, magnae, magnō",
  "sg.acc": "magnum, magnam, magnum", "sg.abl": "magnō, magnā, magnō", "sg.voc": "magne, magna, magnum",
  "pl.nom": "magnī, magnae, magna", "pl.gen": "magnōrum, magnārum, magnōrum", "pl.dat": "magnīs, magnīs, magnīs",
  "pl.acc": "magnōs, magnās, magna", "pl.abl": "magnīs, magnīs, magnīs", "pl.voc": "magnī, magnae, magna",
  comparative: "maior, maior, maius", superlative: "maximus, maxima, maximum",
});
paradigm("la", la("miser", "adj12", "miser, -era, -erum"), {
  "sg.nom": "miser, misera, miserum", "sg.gen": "miserī, miserae, miserī", "sg.dat": "miserō, miserae, miserō",
  "sg.acc": "miserum, miseram, miserum", "sg.abl": "miserō, miserā, miserō", "sg.voc": "miser, misera, miserum",
  "pl.nom": "miserī, miserae, misera", "pl.gen": "miserōrum, miserārum, miserōrum", "pl.dat": "miserīs, miserīs, miserīs",
  "pl.acc": "miserōs, miserās, misera", "pl.abl": "miserīs, miserīs, miserīs", "pl.voc": "miserī, miserae, misera",
  comparative: "miserior, miserior, miserius", superlative: "miserrimus, miserrima, miserrimum",
});
paradigm("la", la("pulcher", "adj12", "pulcher, -chra, -chrum"), {
  "sg.nom": "pulcher, pulchra, pulchrum", "sg.gen": "pulchrī, pulchrae, pulchrī", "sg.dat": "pulchrō, pulchrae, pulchrō",
  "sg.acc": "pulchrum, pulchram, pulchrum", "sg.abl": "pulchrō, pulchrā, pulchrō", "sg.voc": "pulcher, pulchra, pulchrum",
  "pl.nom": "pulchrī, pulchrae, pulchra", "pl.gen": "pulchrōrum, pulchrārum, pulchrōrum", "pl.dat": "pulchrīs, pulchrīs, pulchrīs",
  "pl.acc": "pulchrōs, pulchrās, pulchra", "pl.abl": "pulchrīs, pulchrīs, pulchrīs", "pl.voc": "pulchrī, pulchrae, pulchra",
  comparative: "pulchrior, pulchrior, pulchrius", superlative: "pulcherrimus, pulcherrima, pulcherrimum",
});
paradigm("la", la("pulcher", "adj12", "pulcher, pulchra, pulchrum"), { "sg.gen": "pulchrī, pulchrae, pulchrī" });
const omnis = la("omnis", "adj3", "omnis, -e");
paradigm("la", omnis, {
  "sg.nom": "omnis, omnis, omne", "sg.gen": "omnis, omnis, omnis", "sg.dat": "omnī, omnī, omnī",
  "sg.acc": "omnem, omnem, omne", "sg.abl": "omnī, omnī, omnī", "sg.voc": "omnis, omnis, omne",
  "pl.nom": "omnēs, omnēs, omnia", "pl.gen": "omnium, omnium, omnium", "pl.dat": "omnibus, omnibus, omnibus",
  "pl.acc": "omnēs, omnēs, omnia", "pl.abl": "omnibus, omnibus, omnibus", "pl.voc": "omnēs, omnēs, omnia",
  comparative: "—, —, —", superlative: "—, —, —",
});
assert(!formsForClass("la", omnis).includes("comparative"), "omnis has no comparison");
paradigm("la", la("ācer", "adj3", "ācer, ācris, ācre"), {
  "sg.nom": "ācer, ācris, ācre", "sg.gen": "ācris, ācris, ācris", "sg.dat": "ācrī, ācrī, ācrī",
  "sg.acc": "ācrem, ācrem, ācre", "sg.abl": "ācrī, ācrī, ācrī", "sg.voc": "ācer, ācris, ācre",
  "pl.nom": "ācrēs, ācrēs, ācria", "pl.gen": "ācrium, ācrium, ācrium", "pl.dat": "ācribus, ācribus, ācribus",
  "pl.acc": "ācrēs, ācrēs, ācria", "pl.abl": "ācribus, ācribus, ācribus", "pl.voc": "ācrēs, ācrēs, ācria",
  comparative: "ācrior, ācrior, ācrius", superlative: "ācerrimus, ācerrima, ācerrimum",
});
paradigm("la", la("fēlīx", "adj3", "fēlīx, fēlīcis"), {
  "sg.nom": "fēlīx, fēlīx, fēlīx", "sg.gen": "fēlīcis, fēlīcis, fēlīcis", "sg.dat": "fēlīcī, fēlīcī, fēlīcī",
  "sg.acc": "fēlīcem, fēlīcem, fēlīx", "sg.abl": "fēlīcī, fēlīcī, fēlīcī", "sg.voc": "fēlīx, fēlīx, fēlīx",
  "pl.nom": "fēlīcēs, fēlīcēs, fēlīcia", "pl.gen": "fēlīcium, fēlīcium, fēlīcium", "pl.dat": "fēlīcibus, fēlīcibus, fēlīcibus",
  "pl.acc": "fēlīcēs, fēlīcēs, fēlīcia", "pl.abl": "fēlīcibus, fēlīcibus, fēlīcibus", "pl.voc": "fēlīcēs, fēlīcēs, fēlīcia",
  comparative: "fēlīcior, fēlīcior, fēlīcius", superlative: "fēlīcissimus, fēlīcissima, fēlīcissimum",
});
const ingens = la("ingēns", "adj3", "ingēns, ingentis");
paradigm("la", ingens, {
  "sg.nom": "ingēns, ingēns, ingēns", "sg.gen": "ingentis, ingentis, ingentis", "sg.dat": "ingentī, ingentī, ingentī",
  "sg.acc": "ingentem, ingentem, ingēns", "sg.abl": "ingentī, ingentī, ingentī", "sg.voc": "ingēns, ingēns, ingēns",
  "pl.nom": "ingentēs, ingentēs, ingentia", "pl.gen": "ingentium, ingentium, ingentium", "pl.dat": "ingentibus, ingentibus, ingentibus",
  "pl.acc": "ingentēs, ingentēs, ingentia", "pl.abl": "ingentibus, ingentibus, ingentibus", "pl.voc": "ingentēs, ingentēs, ingentia",
  comparative: "ingentior, ingentior, ingentius", superlative: "ingentissimus, ingentissima, ingentissimum",
});
assert.deepEqual(cell("la", ingens, "sg.abl.m")!.forms, ["ingentī", "ingente"], "-ns: ablative -ī, -e as a participle (A&G 121)");
paradigm("la", la("meus", "adj12", "meus, -a, -um"), { "sg.voc": "mī, mea, meum" });
paradigm("la", la("facilis", "adj3", "facilis, -e"), { superlative: "facillimus, facillima, facillimum" });
assert.match(conjWordProblem("la", la("ūnus", "adj12", "ūnus, -a, -um"))!, /pronominal/);
assert.match(conjWordProblem("la", la("vetus", "adj3", "vetus, veteris"))!, /consonant-stem/);
// -quus is a consonant + -us: aequus, antīquus, propinquus compare normally (A&G 124, 128).
paradigm("la", la("aequus", "adj12", "aequus, -a, -um"), { comparative: "aequior, aequior, aequius", superlative: "aequissimus, aequissima, aequissimum" });
paradigm("la", la("antīquus", "adj12", "antīquus, -a, -um"), { comparative: "antīquior, antīquior, antīquius", superlative: "antīquissimus, antīquissima, antīquissimum" });
paradigm("la", la("propinquus", "adj12", "propinquus, -a, -um"), { comparative: "propinquior, propinquior, propinquius" });
assert.deepEqual(conjMissing("la", la("idōneus", "adj12", "idōneus, -a, -um"), "comparative").length, 3, "idōneus compares with magis: forms or noForms (A&G 128)");
// memor: ablative memorī but genitive plural memorum and no neuter plural (A&G 121; L&S): a table.
assert.match(conjWordProblem("la", la("memor", "adj3", "memor, memoris"))!, /consonant-stem/);
const memorTable = {
  sg: "memor, memor, memor, memoris, memoris, memoris, memorī, memorī, memorī, memorem, memorem, memor, memorī, memorī, memorī, memor, memor, memor",
  pl: "memorēs, memorēs, —, memorum, memorum, memorum, memoribus, memoribus, memoribus, memorēs, memorēs, —, memoribus, memoribus, memoribus, memorēs, memorēs, —",
};
paradigm("la", la("memor", "adj3", "memor, memoris", memorTable), { "pl.gen": "memorum, memorum, memorum", "pl.nom": "memorēs, memorēs, —", "sg.abl": "memorī, memorī, memorī" });
assert(conjWordWarnings("la", la("hebes", "adj3", "hebes, hebetis")).some((x) => /consonant-stem/.test(x)), "one ending not in -x, -ns, -rs: warned");
assert.deepEqual(conjWordWarnings("la", la("audāx", "adj3", "audāx, audācis")), []);

// =============================================================================================
// Latin verbs (A&G 184–204). Rows are 1st, 2nd, 3rd singular, 1st, 2nd, 3rd plural.

const amo = la("amō", "v1", "amō, amāre, amāvī, amātum");
paradigm("la", amo, {
  "pres-act-ind": "amō, amās, amat, amāmus, amātis, amant",
  "impf-act-ind": "amābam, amābās, amābat, amābāmus, amābātis, amābant",
  "fut-act-ind": "amābō, amābis, amābit, amābimus, amābitis, amābunt",
  "perf-act-ind": "amāvī, amāvistī, amāvit, amāvimus, amāvistis, amāvērunt",
  "plpf-act-ind": "amāveram, amāverās, amāverat, amāverāmus, amāverātis, amāverant",
  "futp-act-ind": "amāverō, amāveris, amāverit, amāverimus, amāveritis, amāverint",
  "pres-act-subj": "amem, amēs, amet, amēmus, amētis, ament",
  "impf-act-subj": "amārem, amārēs, amāret, amārēmus, amārētis, amārent",
  "perf-act-subj": "amāverim, amāverīs, amāverit, amāverīmus, amāverītis, amāverint",
  "plpf-act-subj": "amāvissem, amāvissēs, amāvisset, amāvissēmus, amāvissētis, amāvissent",
  "pres-pass-ind": "amor, amāris, amātur, amāmur, amāminī, amantur",
  "impf-pass-ind": "amābar, amābāris, amābātur, amābāmur, amābāminī, amābantur",
  "fut-pass-ind": "amābor, amāberis, amābitur, amābimur, amābiminī, amābuntur",
  "perf-pass-ind": "amātus sum, amātus es, amātus est, amātī sumus, amātī estis, amātī sunt",
  "plpf-pass-ind": "amātus eram, amātus erās, amātus erat, amātī erāmus, amātī erātis, amātī erant",
  "futp-pass-ind": "amātus erō, amātus eris, amātus erit, amātī erimus, amātī eritis, amātī erunt",
  "pres-pass-subj": "amer, amēris, amētur, amēmur, amēminī, amentur",
  "impf-pass-subj": "amārer, amārēris, amārētur, amārēmur, amārēminī, amārentur",
  "perf-pass-subj": "amātus sim, amātus sīs, amātus sit, amātī sīmus, amātī sītis, amātī sint",
  "plpf-pass-subj": "amātus essem, amātus essēs, amātus esset, amātī essēmus, amātī essētis, amātī essent",
  "pres-act-imp": "amā, amāte",
  "pres-pass-imp": "amāre, amāminī",
  "fut-act-imp": "amātō, amātō, amātōte, amantō",
  "pres-act-inf": "amāre", "pres-pass-inf": "amārī", "perf-act-inf": "amāvisse", "perf-pass-inf": "amātus esse", "fut-act-inf": "amātūrus esse", "fut-pass-inf": "amātum īrī",
  "pres-act-ptc": "amāns, amāns, amāns", "perf-pass-ptc": "amātus, amāta, amātum", "fut-act-ptc": "amātūrus, amātūra, amātūrum", gerundive: "amandus, amanda, amandum",
  gerund: "amandī, amandō, amandum, amandō",
});
assert.deepEqual(cell("la", amo, "pres-pass-ind.2sg")!.forms, ["amāris", "amāre"]);
assert.deepEqual(cell("la", amo, "perf-act-ind.3pl")!.forms, ["amāvērunt", "amāvēre"]);
const moneo = la("moneō", "v2", "moneō, monēre, monuī, monitum");
paradigm("la", moneo, {
  "pres-act-ind": "moneō, monēs, monet, monēmus, monētis, monent",
  "impf-act-ind": "monēbam, monēbās, monēbat, monēbāmus, monēbātis, monēbant",
  "fut-act-ind": "monēbō, monēbis, monēbit, monēbimus, monēbitis, monēbunt",
  "perf-act-ind": "monuī, monuistī, monuit, monuimus, monuistis, monuērunt",
  "pres-act-subj": "moneam, moneās, moneat, moneāmus, moneātis, moneant",
  "impf-act-subj": "monērem, monērēs, monēret, monērēmus, monērētis, monērent",
  "pres-pass-ind": "moneor, monēris, monētur, monēmur, monēminī, monentur",
  "fut-pass-ind": "monēbor, monēberis, monēbitur, monēbimur, monēbiminī, monēbuntur",
  "pres-pass-subj": "monear, moneāris, moneātur, moneāmur, moneāminī, moneantur",
  "perf-pass-ind": "monitus sum, monitus es, monitus est, monitī sumus, monitī estis, monitī sunt",
  "pres-act-imp": "monē, monēte", "pres-pass-imp": "monēre, monēminī", "fut-act-imp": "monētō, monētō, monētōte, monentō",
  "pres-act-inf": "monēre", "pres-pass-inf": "monērī", "perf-act-inf": "monuisse", "perf-pass-inf": "monitus esse", "fut-act-inf": "monitūrus esse", "fut-pass-inf": "monitum īrī",
  "pres-act-ptc": "monēns, monēns, monēns", "perf-pass-ptc": "monitus, monita, monitum", "fut-act-ptc": "monitūrus, monitūra, monitūrum", gerundive: "monendus, monenda, monendum",
  gerund: "monendī, monendō, monendum, monendō",
});
paradigm("la", la("regō", "v3", "regō, regere, rēxī, rēctum"), {
  "pres-act-ind": "regō, regis, regit, regimus, regitis, regunt",
  "impf-act-ind": "regēbam, regēbās, regēbat, regēbāmus, regēbātis, regēbant",
  "fut-act-ind": "regam, regēs, reget, regēmus, regētis, regent",
  "perf-act-ind": "rēxī, rēxistī, rēxit, rēximus, rēxistis, rēxērunt",
  "plpf-act-ind": "rēxeram, rēxerās, rēxerat, rēxerāmus, rēxerātis, rēxerant",
  "pres-act-subj": "regam, regās, regat, regāmus, regātis, regant",
  "impf-act-subj": "regerem, regerēs, regeret, regerēmus, regerētis, regerent",
  "pres-pass-ind": "regor, regeris, regitur, regimur, regiminī, reguntur",
  "fut-pass-ind": "regar, regēris, regētur, regēmur, regēminī, regentur",
  "pres-pass-subj": "regar, regāris, regātur, regāmur, regāminī, regantur",
  "impf-pass-subj": "regerer, regerēris, regerētur, regerēmur, regerēminī, regerentur",
  "perf-pass-ind": "rēctus sum, rēctus es, rēctus est, rēctī sumus, rēctī estis, rēctī sunt",
  "pres-act-imp": "rege, regite", "pres-pass-imp": "regere, regiminī", "fut-act-imp": "regitō, regitō, regitōte, reguntō",
  "pres-act-inf": "regere", "pres-pass-inf": "regī", "perf-act-inf": "rēxisse", "perf-pass-inf": "rēctus esse", "fut-act-inf": "rēctūrus esse", "fut-pass-inf": "rēctum īrī",
  "pres-act-ptc": "regēns, regēns, regēns", "perf-pass-ptc": "rēctus, rēcta, rēctum", "fut-act-ptc": "rēctūrus, rēctūra, rēctūrum", gerundive: "regendus, regenda, regendum",
  gerund: "regendī, regendō, regendum, regendō",
});
const capio = la("capiō", "v3-io", "capiō, capere, cēpī, captum");
paradigm("la", capio, {
  "pres-act-ind": "capiō, capis, capit, capimus, capitis, capiunt",
  "impf-act-ind": "capiēbam, capiēbās, capiēbat, capiēbāmus, capiēbātis, capiēbant",
  "fut-act-ind": "capiam, capiēs, capiet, capiēmus, capiētis, capient",
  "perf-act-ind": "cēpī, cēpistī, cēpit, cēpimus, cēpistis, cēpērunt",
  "futp-act-ind": "cēperō, cēperis, cēperit, cēperimus, cēperitis, cēperint",
  "pres-act-subj": "capiam, capiās, capiat, capiāmus, capiātis, capiant",
  "impf-act-subj": "caperem, caperēs, caperet, caperēmus, caperētis, caperent",
  "plpf-act-subj": "cēpissem, cēpissēs, cēpisset, cēpissēmus, cēpissētis, cēpissent",
  "pres-pass-ind": "capior, caperis, capitur, capimur, capiminī, capiuntur",
  "impf-pass-ind": "capiēbar, capiēbāris, capiēbātur, capiēbāmur, capiēbāminī, capiēbantur",
  "fut-pass-ind": "capiar, capiēris, capiētur, capiēmur, capiēminī, capientur",
  "pres-pass-subj": "capiar, capiāris, capiātur, capiāmur, capiāminī, capiantur",
  "impf-pass-subj": "caperer, caperēris, caperētur, caperēmur, caperēminī, caperentur",
  "perf-pass-ind": "captus sum, captus es, captus est, captī sumus, captī estis, captī sunt",
  "pres-act-imp": "cape, capite", "pres-pass-imp": "capere, capiminī", "fut-act-imp": "capitō, capitō, capitōte, capiuntō",
  "pres-act-inf": "capere", "pres-pass-inf": "capī", "perf-act-inf": "cēpisse", "perf-pass-inf": "captus esse", "fut-act-inf": "captūrus esse", "fut-pass-inf": "captum īrī",
  "pres-act-ptc": "capiēns, capiēns, capiēns", "perf-pass-ptc": "captus, capta, captum", "fut-act-ptc": "captūrus, captūra, captūrum", gerundive: "capiendus, capienda, capiendum",
  gerund: "capiendī, capiendō, capiendum, capiendō",
});
paradigm("la", la("audiō", "v4", "audiō, audīre, audīvī, audītum"), {
  "pres-act-ind": "audiō, audīs, audit, audīmus, audītis, audiunt",
  "impf-act-ind": "audiēbam, audiēbās, audiēbat, audiēbāmus, audiēbātis, audiēbant",
  "fut-act-ind": "audiam, audiēs, audiet, audiēmus, audiētis, audient",
  "perf-act-ind": "audīvī, audīvistī, audīvit, audīvimus, audīvistis, audīvērunt",
  "pres-act-subj": "audiam, audiās, audiat, audiāmus, audiātis, audiant",
  "impf-act-subj": "audīrem, audīrēs, audīret, audīrēmus, audīrētis, audīrent",
  "pres-pass-ind": "audior, audīris, audītur, audīmur, audīminī, audiuntur",
  "impf-pass-ind": "audiēbar, audiēbāris, audiēbātur, audiēbāmur, audiēbāminī, audiēbantur",
  "fut-pass-ind": "audiar, audiēris, audiētur, audiēmur, audiēminī, audientur",
  "pres-pass-subj": "audiar, audiāris, audiātur, audiāmur, audiāminī, audiantur",
  "impf-pass-subj": "audīrer, audīrēris, audīrētur, audīrēmur, audīrēminī, audīrentur",
  "perf-pass-ind": "audītus sum, audītus es, audītus est, audītī sumus, audītī estis, audītī sunt",
  "pres-act-imp": "audī, audīte", "pres-pass-imp": "audīre, audīminī", "fut-act-imp": "audītō, audītō, audītōte, audiuntō",
  "pres-act-inf": "audīre", "pres-pass-inf": "audīrī", "perf-act-inf": "audīvisse", "perf-pass-inf": "audītus esse", "fut-act-inf": "audītūrus esse", "fut-pass-inf": "audītum īrī",
  "pres-act-ptc": "audiēns, audiēns, audiēns", "perf-pass-ptc": "audītus, audīta, audītum", "fut-act-ptc": "audītūrus, audītūra, audītūrum", gerundive: "audiendus, audienda, audiendum",
  gerund: "audiendī, audiendō, audiendum, audiendō",
});
// Deponents (A&G 190): passive forms, active meaning, drilled under the active ids.
const hortor = la("hortor", "v1", "hortor, hortārī, hortātus sum");
paradigm("la", hortor, {
  "pres-act-ind": "hortor, hortāris, hortātur, hortāmur, hortāminī, hortantur",
  "impf-act-ind": "hortābar, hortābāris, hortābātur, hortābāmur, hortābāminī, hortābantur",
  "fut-act-ind": "hortābor, hortāberis, hortābitur, hortābimur, hortābiminī, hortābuntur",
  "perf-act-ind": "hortātus sum, hortātus es, hortātus est, hortātī sumus, hortātī estis, hortātī sunt",
  "plpf-act-ind": "hortātus eram, hortātus erās, hortātus erat, hortātī erāmus, hortātī erātis, hortātī erant",
  "pres-act-subj": "horter, hortēris, hortētur, hortēmur, hortēminī, hortentur",
  "impf-act-subj": "hortārer, hortārēris, hortārētur, hortārēmur, hortārēminī, hortārentur",
  "perf-act-subj": "hortātus sim, hortātus sīs, hortātus sit, hortātī sīmus, hortātī sītis, hortātī sint",
  "pres-act-imp": "hortāre, hortāminī",
  "pres-act-inf": "hortārī", "perf-act-inf": "hortātus esse", "fut-act-inf": "hortātūrus esse",
  "pres-act-ptc": "hortāns, hortāns, hortāns", "perf-pass-ptc": "hortātus, hortāta, hortātum", "fut-act-ptc": "hortātūrus, hortātūra, hortātūrum", gerundive: "hortandus, hortanda, hortandum",
  gerund: "hortandī, hortandō, hortandum, hortandō",
  "pres-pass-ind": "—, —, —, —, —, —", "pres-pass-inf": "—",
});
assert.equal(promptsFor(course("la", [hortor]), hortor, "pres-act-ind")[5].label, "3rd person plural, present indicative", "deponents drop 'active'");
paradigm("la", la("sequor", "v3", "sequor, sequī, secūtus sum"), {
  "pres-act-ind": "sequor, sequeris, sequitur, sequimur, sequiminī, sequuntur",
  "impf-act-ind": "sequēbar, sequēbāris, sequēbātur, sequēbāmur, sequēbāminī, sequēbantur",
  "fut-act-ind": "sequar, sequēris, sequētur, sequēmur, sequēminī, sequentur",
  "perf-act-ind": "secūtus sum, secūtus es, secūtus est, secūtī sumus, secūtī estis, secūtī sunt",
  "pres-act-subj": "sequar, sequāris, sequātur, sequāmur, sequāminī, sequantur",
  "impf-act-subj": "sequerer, sequerēris, sequerētur, sequerēmur, sequerēminī, sequerentur",
  "pres-act-imp": "sequere, sequiminī",
  "pres-act-inf": "sequī", "perf-act-inf": "secūtus esse", "fut-act-inf": "secūtūrus esse",
  "pres-act-ptc": "sequēns, sequēns, sequēns", "perf-pass-ptc": "secūtus, secūta, secūtum", "fut-act-ptc": "secūtūrus, secūtūra, secūtūrum", gerundive: "sequendus, sequenda, sequendum",
  gerund: "sequendī, sequendō, sequendum, sequendō",
});
paradigm("la", la("patior", "v3-io", "patior, patī, passus sum"), {
  "pres-act-ind": "patior, pateris, patitur, patimur, patiminī, patiuntur",
  "impf-act-ind": "patiēbar, patiēbāris, patiēbātur, patiēbāmur, patiēbāminī, patiēbantur",
  "fut-act-ind": "patiar, patiēris, patiētur, patiēmur, patiēminī, patientur",
  "perf-act-ind": "passus sum, passus es, passus est, passī sumus, passī estis, passī sunt",
  "pres-act-subj": "patiar, patiāris, patiātur, patiāmur, patiāminī, patiantur",
  "impf-act-subj": "paterer, paterēris, paterētur, paterēmur, paterēminī, paterentur",
  "pres-act-imp": "patere, patiminī",
  "pres-act-inf": "patī", "perf-act-inf": "passus esse", "fut-act-inf": "passūrus esse",
  "pres-act-ptc": "patiēns, patiēns, patiēns", "perf-pass-ptc": "passus, passa, passum", "fut-act-ptc": "passūrus, passūra, passūrum", gerundive: "patiendus, patienda, patiendum",
  gerund: "patiendī, patiendō, patiendum, patiendō",
});
// Irregular verbs (A&G 170, 137 b, 199–203): built-in tables, the perfect system from dict.
paradigm("la", la("sum", "irr", "sum, esse, fuī, futūrus"), {
  "pres-act-ind": "sum, es, est, sumus, estis, sunt",
  "impf-act-ind": "eram, erās, erat, erāmus, erātis, erant",
  "fut-act-ind": "erō, eris, erit, erimus, eritis, erunt",
  "perf-act-ind": "fuī, fuistī, fuit, fuimus, fuistis, fuērunt",
  "plpf-act-ind": "fueram, fuerās, fuerat, fuerāmus, fuerātis, fuerant",
  "futp-act-ind": "fuerō, fueris, fuerit, fuerimus, fueritis, fuerint",
  "pres-act-subj": "sim, sīs, sit, sīmus, sītis, sint",
  "impf-act-subj": "essem, essēs, esset, essēmus, essētis, essent",
  "perf-act-subj": "fuerim, fuerīs, fuerit, fuerīmus, fuerītis, fuerint",
  "plpf-act-subj": "fuissem, fuissēs, fuisset, fuissēmus, fuissētis, fuissent",
  "pres-act-imp": "es, este", "fut-act-imp": "estō, estō, estōte, suntō",
  "pres-act-inf": "esse", "perf-act-inf": "fuisse", "fut-act-inf": "futūrus esse",
  "fut-act-ptc": "futūrus, futūra, futūrum",
  "pres-pass-ind": "—, —, —, —, —, —", "pres-act-ptc": "—, —, —", gerund: "—, —, —, —",
});
paradigm("la", la("possum", "irr", "possum, posse, potuī"), {
  "pres-act-ind": "possum, potes, potest, possumus, potestis, possunt",
  "impf-act-ind": "poteram, poterās, poterat, poterāmus, poterātis, poterant",
  "fut-act-ind": "poterō, poteris, poterit, poterimus, poteritis, poterunt",
  "perf-act-ind": "potuī, potuistī, potuit, potuimus, potuistis, potuērunt",
  "plpf-act-ind": "potueram, potuerās, potuerat, potuerāmus, potuerātis, potuerant",
  "pres-act-subj": "possim, possīs, possit, possīmus, possītis, possint",
  "impf-act-subj": "possem, possēs, posset, possēmus, possētis, possent",
  "plpf-act-subj": "potuissem, potuissēs, potuisset, potuissēmus, potuissētis, potuissent",
  "pres-act-inf": "posse", "perf-act-inf": "potuisse", "pres-act-imp": "—, —",
});
paradigm("la", la("eō", "irr", "eō, īre, iī, itum"), {
  "pres-act-ind": "eō, īs, it, īmus, ītis, eunt",
  "impf-act-ind": "ībam, ībās, ībat, ībāmus, ībātis, ībant",
  "fut-act-ind": "ībō, ībis, ībit, ībimus, ībitis, ībunt",
  "perf-act-ind": "iī, īstī, iit, iimus, īstis, iērunt",
  "plpf-act-ind": "ieram, ierās, ierat, ierāmus, ierātis, ierant",
  "futp-act-ind": "ierō, ieris, ierit, ierimus, ieritis, ierint",
  "pres-act-subj": "eam, eās, eat, eāmus, eātis, eant",
  "impf-act-subj": "īrem, īrēs, īret, īrēmus, īrētis, īrent",
  "perf-act-subj": "ierim, ierīs, ierit, ierīmus, ierītis, ierint",
  "plpf-act-subj": "īssem, īssēs, īsset, īssēmus, īssētis, īssent",
  "pres-act-imp": "ī, īte", "fut-act-imp": "ītō, ītō, ītōte, euntō",
  "pres-act-inf": "īre", "perf-act-inf": "īsse", "fut-act-inf": "itūrus esse",
  "pres-act-ptc": "iēns, iēns, iēns", "fut-act-ptc": "itūrus, itūra, itūrum", gerund: "eundī, eundō, eundum, eundō",
});
paradigm("la", la("ferō", "irr", "ferō, ferre, tulī, lātum"), {
  "pres-act-ind": "ferō, fers, fert, ferimus, fertis, ferunt",
  "impf-act-ind": "ferēbam, ferēbās, ferēbat, ferēbāmus, ferēbātis, ferēbant",
  "fut-act-ind": "feram, ferēs, feret, ferēmus, ferētis, ferent",
  "perf-act-ind": "tulī, tulistī, tulit, tulimus, tulistis, tulērunt",
  "pres-act-subj": "feram, ferās, ferat, ferāmus, ferātis, ferant",
  "impf-act-subj": "ferrem, ferrēs, ferret, ferrēmus, ferrētis, ferrent",
  "pres-pass-ind": "feror, ferris, fertur, ferimur, feriminī, feruntur",
  "impf-pass-ind": "ferēbar, ferēbāris, ferēbātur, ferēbāmur, ferēbāminī, ferēbantur",
  "fut-pass-ind": "ferar, ferēris, ferētur, ferēmur, ferēminī, ferentur",
  "pres-pass-subj": "ferar, ferāris, ferātur, ferāmur, ferāminī, ferantur",
  "impf-pass-subj": "ferrer, ferrēris, ferrētur, ferrēmur, ferrēminī, ferrentur",
  "perf-pass-ind": "lātus sum, lātus es, lātus est, lātī sumus, lātī estis, lātī sunt",
  "pres-act-imp": "fer, ferte", "pres-pass-imp": "ferre, feriminī", "fut-act-imp": "fertō, fertō, fertōte, feruntō",
  "pres-act-inf": "ferre", "pres-pass-inf": "ferrī", "perf-act-inf": "tulisse", "perf-pass-inf": "lātus esse", "fut-act-inf": "lātūrus esse", "fut-pass-inf": "lātum īrī",
  "pres-act-ptc": "ferēns, ferēns, ferēns", "perf-pass-ptc": "lātus, lāta, lātum", "fut-act-ptc": "lātūrus, lātūra, lātūrum", gerundive: "ferendus, ferenda, ferendum",
  gerund: "ferendī, ferendō, ferendum, ferendō",
});
paradigm("la", la("volō", "irr", "volō, velle, voluī"), {
  "pres-act-ind": "volō, vīs, vult, volumus, vultis, volunt",
  "impf-act-ind": "volēbam, volēbās, volēbat, volēbāmus, volēbātis, volēbant",
  "fut-act-ind": "volam, volēs, volet, volēmus, volētis, volent",
  "perf-act-ind": "voluī, voluistī, voluit, voluimus, voluistis, voluērunt",
  "pres-act-subj": "velim, velīs, velit, velīmus, velītis, velint",
  "impf-act-subj": "vellem, vellēs, vellet, vellēmus, vellētis, vellent",
  "plpf-act-subj": "voluissem, voluissēs, voluisset, voluissēmus, voluissētis, voluissent",
  "pres-act-inf": "velle", "perf-act-inf": "voluisse", "pres-act-ptc": "volēns, volēns, volēns",
  "pres-act-imp": "—, —", "pres-pass-ind": "—, —, —, —, —, —", gerund: "—, —, —, —",
});
// Compounds of sum, eō and ferō (A&G 170, 198, 200, 203): forms.prefix, written as in the first
// principal part. The present system is the simplex's with the prefix; the perfect system is from dict.
const PASSIVE_NONE = {
  "pres-pass-ind": "—, —, —, —, —, —", "impf-pass-ind": "—, —, —, —, —, —", "fut-pass-ind": "—, —, —, —, —, —",
  "perf-pass-ind": "—, —, —, —, —, —", "plpf-pass-ind": "—, —, —, —, —, —", "futp-pass-ind": "—, —, —, —, —, —",
  "pres-pass-subj": "—, —, —, —, —, —", "impf-pass-subj": "—, —, —, —, —, —", "perf-pass-subj": "—, —, —, —, —, —", "plpf-pass-subj": "—, —, —, —, —, —",
  "pres-pass-imp": "—, —", "pres-pass-inf": "—", "perf-pass-inf": "—", "fut-pass-inf": "—", "perf-pass-ptc": "—, —, —", gerundive: "—, —, —",
};
const adsum = la("adsum", "irr", "adsum, adesse, adfuī, adfutūrus", { prefix: "ad" });
paradigm("la", adsum, {
  "pres-act-ind": "adsum, ades, adest, adsumus, adestis, adsunt",
  "impf-act-ind": "aderam, aderās, aderat, aderāmus, aderātis, aderant",
  "fut-act-ind": "aderō, aderis, aderit, aderimus, aderitis, aderunt",
  "perf-act-ind": "adfuī, adfuistī, adfuit, adfuimus, adfuistis, adfuērunt",
  "plpf-act-ind": "adfueram, adfuerās, adfuerat, adfuerāmus, adfuerātis, adfuerant",
  "futp-act-ind": "adfuerō, adfueris, adfuerit, adfuerimus, adfueritis, adfuerint",
  "pres-act-subj": "adsim, adsīs, adsit, adsīmus, adsītis, adsint",
  "impf-act-subj": "adessem, adessēs, adesset, adessēmus, adessētis, adessent",
  "perf-act-subj": "adfuerim, adfuerīs, adfuerit, adfuerīmus, adfuerītis, adfuerint",
  "plpf-act-subj": "adfuissem, adfuissēs, adfuisset, adfuissēmus, adfuissētis, adfuissent",
  "pres-act-imp": "ades, adeste", "fut-act-imp": "adestō, adestō, adestōte, adsuntō",
  "pres-act-inf": "adesse", "perf-act-inf": "adfuisse", "fut-act-inf": "adfutūrus esse",
  "pres-act-ptc": "—, —, —", "fut-act-ptc": "adfutūrus, adfutūra, adfutūrum", gerund: "—, —, —, —",
  ...PASSIVE_NONE,
});
assert.deepEqual(cell("la", adsum, "impf-act-subj.1sg")!.forms, ["adessem", "adforem"], "adforem for adessem (L&S)");
assert.deepEqual(cell("la", adsum, "fut-act-inf")!.forms, ["adfutūrus esse", "adfore"], "adfore (A&G 170 a; L&S)");
const absum = la("absum", "irr", "absum, abesse, āfuī, āfutūrus", { prefix: "ab" });
paradigm("la", absum, {
  "pres-act-ind": "absum, abes, abest, absumus, abestis, absunt", "perf-act-ind": "āfuī, āfuistī, āfuit, āfuimus, āfuistis, āfuērunt",
  "pres-act-ptc": "absēns, absēns, absēns", "fut-act-inf": "āfutūrus esse", "impf-act-subj": "abessem, abessēs, abesset, abessēmus, abessētis, abessent",
});
assert.deepEqual(cell("la", absum, "fut-act-inf")!.forms, ["āfutūrus esse", "āfore"]);
paradigm("la", la("prōsum", "irr", "prōsum, prōdesse, prōfuī, prōfutūrus", { prefix: "prō" }), {
  "pres-act-ind": "prōsum, prōdes, prōdest, prōsumus, prōdestis, prōsunt", "impf-act-ind": "prōderam, prōderās, prōderat, prōderāmus, prōderātis, prōderant",
  "pres-act-subj": "prōsim, prōsīs, prōsit, prōsīmus, prōsītis, prōsint", "impf-act-subj": "prōdessem, prōdessēs, prōdesset, prōdessēmus, prōdessētis, prōdessent",
  "pres-act-inf": "prōdesse", "pres-act-ptc": "—, —, —",
});
paradigm("la", la("dēsum", "irr", "dēsum, dēesse, dēfuī, dēfutūrus", { prefix: "dē" }), { "pres-act-ind": "dēsum, dēes, dēest, dēsumus, dēestis, dēsunt", "pres-act-inf": "dēesse" });
paradigm("la", la("praesum", "irr", "praesum, praeesse, praefuī, praefutūrus", { prefix: "prae" }), { "pres-act-ind": "praesum, praees, praeest, praesumus, praeestis, praesunt", "pres-act-ptc": "praesēns, praesēns, praesēns" });
const abeo = la("abeō", "irr", "abeō, abīre, abiī, abitum", { prefix: "ab" });
paradigm("la", abeo, {
  "pres-act-ind": "abeō, abīs, abit, abīmus, abītis, abeunt",
  "impf-act-ind": "abībam, abībās, abībat, abībāmus, abībātis, abībant",
  "fut-act-ind": "abībō, abībis, abībit, abībimus, abībitis, abībunt",
  "perf-act-ind": "abiī, abīstī, abiit, abiimus, abīstis, abiērunt",
  "plpf-act-ind": "abieram, abierās, abierat, abierāmus, abierātis, abierant",
  "futp-act-ind": "abierō, abieris, abierit, abierimus, abieritis, abierint",
  "pres-act-subj": "abeam, abeās, abeat, abeāmus, abeātis, abeant",
  "impf-act-subj": "abīrem, abīrēs, abīret, abīrēmus, abīrētis, abīrent",
  "perf-act-subj": "abierim, abierīs, abierit, abierīmus, abierītis, abierint",
  "plpf-act-subj": "abīssem, abīssēs, abīsset, abīssēmus, abīssētis, abīssent",
  "pres-act-imp": "abī, abīte", "fut-act-imp": "abītō, abītō, abītōte, abeuntō",
  "pres-act-inf": "abīre", "perf-act-inf": "abīsse", "fut-act-inf": "abitūrus esse",
  "pres-act-ptc": "abiēns, abiēns, abiēns", "fut-act-ptc": "abitūrus, abitūra, abitūrum",
  gerund: "abeundī, abeundō, abeundum, abeundō",
  ...PASSIVE_NONE,
});
assert.deepEqual(cell("la", abeo, "perf-act-ind.2sg")!.extra, ["abiistī"], "ii before s contracts, the full form accepted (A&G 203 c)");
assert(promptsFor(course("la", [abeo], ["pres-act-ptc"]), abeo, "pres-act-ptc")[0].answers.includes("abiēns, abeuntis"), "abiēns, abeuntis (A&G 203)");
// Transitive compounds of eō have a personal passive (A&G 203 a: adeor, adīris…).
paradigm("la", la("adeō", "irr", "adeō, adīre, adiī, aditum", { prefix: "ad" }), {
  "pres-pass-ind": "adeor, adīris, adītur, adīmur, adīminī, adeuntur",
  "impf-pass-ind": "adībar, adībāris, adībātur, adībāmur, adībāminī, adībantur",
  "fut-pass-ind": "adībor, adīberis, adībitur, adībimur, adībiminī, adībuntur",
  "pres-pass-subj": "adear, adeāris, adeātur, adeāmur, adeāminī, adeantur",
  "impf-pass-subj": "adīrer, adīrēris, adīrētur, adīrēmur, adīrēminī, adīrentur",
  "perf-pass-ind": "aditus sum, aditus es, aditus est, aditī sumus, aditī estis, aditī sunt",
  "pres-pass-inf": "adīrī", "perf-pass-inf": "aditus esse", "fut-pass-inf": "aditum īrī",
  "perf-pass-ptc": "aditus, adita, aditum", gerundive: "adeundus, adeunda, adeundum",
});
paradigm("la", la("trānseō", "irr", "trānseō, trānsīre, trānsiī, trānsitum", { prefix: "trāns" }), { "pres-pass-ind": "trānseor, trānsīris, trānsītur, trānsīmur, trānsīminī, trānseuntur", gerundive: "trānseundus, trānseunda, trānseundum" });
// red- and prōd- before a vowel: "re" and "red", "prō" and "prōd" both work (A&G 203 e).
for (const p of ["re", "red"]) paradigm("la", la("redeō", "irr", "redeō, redīre, rediī, reditum", { prefix: p }), { "pres-act-ind": "redeō, redīs, redit, redīmus, redītis, redeunt", "perf-act-ind": "rediī, redīstī, rediit, rediimus, redīstis, rediērunt", "pres-pass-ind": "—, —, —, —, —, —" });
paradigm("la", la("prōdeō", "irr", "prōdeō, prōdīre, prōdiī, prōditum", { prefix: "prō" }), { "pres-act-ind": "prōdeō, prōdīs, prōdit, prōdīmus, prōdītis, prōdeunt" });
const refero = la("referō", "irr", "referō, referre, rettulī, relātum", { prefix: "re" });
paradigm("la", refero, {
  "pres-act-ind": "referō, refers, refert, referimus, refertis, referunt",
  "impf-act-ind": "referēbam, referēbās, referēbat, referēbāmus, referēbātis, referēbant",
  "fut-act-ind": "referam, referēs, referet, referēmus, referētis, referent",
  "perf-act-ind": "rettulī, rettulistī, rettulit, rettulimus, rettulistis, rettulērunt",
  "plpf-act-ind": "rettuleram, rettulerās, rettulerat, rettulerāmus, rettulerātis, rettulerant",
  "futp-act-ind": "rettulerō, rettuleris, rettulerit, rettulerimus, rettuleritis, rettulerint",
  "pres-act-subj": "referam, referās, referat, referāmus, referātis, referant",
  "impf-act-subj": "referrem, referrēs, referret, referrēmus, referrētis, referrent",
  "perf-act-subj": "rettulerim, rettulerīs, rettulerit, rettulerīmus, rettulerītis, rettulerint",
  "plpf-act-subj": "rettulissem, rettulissēs, rettulisset, rettulissēmus, rettulissētis, rettulissent",
  "pres-pass-ind": "referor, referris, refertur, referimur, referiminī, referuntur",
  "impf-pass-ind": "referēbar, referēbāris, referēbātur, referēbāmur, referēbāminī, referēbantur",
  "fut-pass-ind": "referar, referēris, referētur, referēmur, referēminī, referentur",
  "perf-pass-ind": "relātus sum, relātus es, relātus est, relātī sumus, relātī estis, relātī sunt",
  "plpf-pass-ind": "relātus eram, relātus erās, relātus erat, relātī erāmus, relātī erātis, relātī erant",
  "futp-pass-ind": "relātus erō, relātus eris, relātus erit, relātī erimus, relātī eritis, relātī erunt",
  "pres-pass-subj": "referar, referāris, referātur, referāmur, referāminī, referantur",
  "impf-pass-subj": "referrer, referrēris, referrētur, referrēmur, referrēminī, referrentur",
  "perf-pass-subj": "relātus sim, relātus sīs, relātus sit, relātī sīmus, relātī sītis, relātī sint",
  "plpf-pass-subj": "relātus essem, relātus essēs, relātus esset, relātī essēmus, relātī essētis, relātī essent",
  "pres-act-imp": "refer, referte", "pres-pass-imp": "referre, referiminī", "fut-act-imp": "refertō, refertō, refertōte, referuntō",
  "pres-act-inf": "referre", "pres-pass-inf": "referrī", "perf-act-inf": "rettulisse", "perf-pass-inf": "relātus esse", "fut-act-inf": "relātūrus esse", "fut-pass-inf": "relātum īrī",
  "pres-act-ptc": "referēns, referēns, referēns", "perf-pass-ptc": "relātus, relāta, relātum", "fut-act-ptc": "relātūrus, relātūra, relātūrum", gerundive: "referendus, referenda, referendum",
  gerund: "referendī, referendō, referendum, referendō",
});
assert.deepEqual(cell("la", refero, "pres-pass-ind.2sg")!.forms, ["referris", "referre"]);
const affero = la("afferō", "irr", "afferō, afferre, attulī, allātum", { prefix: "af" });
paradigm("la", affero, {
  "pres-act-ind": "afferō, affers, affert, afferimus, affertis, afferunt",
  "impf-act-ind": "afferēbam, afferēbās, afferēbat, afferēbāmus, afferēbātis, afferēbant",
  "fut-act-ind": "afferam, afferēs, afferet, afferēmus, afferētis, afferent",
  "perf-act-ind": "attulī, attulistī, attulit, attulimus, attulistis, attulērunt",
  "plpf-act-ind": "attuleram, attulerās, attulerat, attulerāmus, attulerātis, attulerant",
  "futp-act-ind": "attulerō, attuleris, attulerit, attulerimus, attuleritis, attulerint",
  "pres-act-subj": "afferam, afferās, afferat, afferāmus, afferātis, afferant",
  "impf-act-subj": "afferrem, afferrēs, afferret, afferrēmus, afferrētis, afferrent",
  "perf-act-subj": "attulerim, attulerīs, attulerit, attulerīmus, attulerītis, attulerint",
  "plpf-act-subj": "attulissem, attulissēs, attulisset, attulissēmus, attulissētis, attulissent",
  "pres-pass-ind": "afferor, afferris, affertur, afferimur, afferiminī, afferuntur",
  "impf-pass-ind": "afferēbar, afferēbāris, afferēbātur, afferēbāmur, afferēbāminī, afferēbantur",
  "fut-pass-ind": "afferar, afferēris, afferētur, afferēmur, afferēminī, afferentur",
  "perf-pass-ind": "allātus sum, allātus es, allātus est, allātī sumus, allātī estis, allātī sunt",
  "plpf-pass-ind": "allātus eram, allātus erās, allātus erat, allātī erāmus, allātī erātis, allātī erant",
  "futp-pass-ind": "allātus erō, allātus eris, allātus erit, allātī erimus, allātī eritis, allātī erunt",
  "pres-pass-subj": "afferar, afferāris, afferātur, afferāmur, afferāminī, afferantur",
  "impf-pass-subj": "afferrer, afferrēris, afferrētur, afferrēmur, afferrēminī, afferrentur",
  "perf-pass-subj": "allātus sim, allātus sīs, allātus sit, allātī sīmus, allātī sītis, allātī sint",
  "plpf-pass-subj": "allātus essem, allātus essēs, allātus esset, allātī essēmus, allātī essētis, allātī essent",
  "pres-act-imp": "affer, afferte", "pres-pass-imp": "afferre, afferiminī", "fut-act-imp": "affertō, affertō, affertōte, afferuntō",
  "pres-act-inf": "afferre", "pres-pass-inf": "afferrī", "perf-act-inf": "attulisse", "perf-pass-inf": "allātus esse", "fut-act-inf": "allātūrus esse", "fut-pass-inf": "allātum īrī",
  "pres-act-ptc": "afferēns, afferēns, afferēns", "perf-pass-ptc": "allātus, allāta, allātum", "fut-act-ptc": "allātūrus, allātūra, allātūrum", gerundive: "afferendus, afferenda, afferendum",
  gerund: "afferendī, afferendō, afferendum, afferendō",
});
paradigm("la", la("auferō", "irr", "auferō, auferre, abstulī, ablātum", { prefix: "au" }), { "pres-act-ind": "auferō, aufers, aufert, auferimus, aufertis, auferunt", "perf-act-ind": "abstulī, abstulistī, abstulit, abstulimus, abstulistis, abstulērunt", "perf-pass-ptc": "ablātus, ablāta, ablātum" });
// A table still overrides one cell of a compound (adsum's assum).
assert.deepEqual(cell("la", la("adsum", "irr", "adsum, adesse, adfuī, adfutūrus", { prefix: "ad", "pres-act-ind.1sg": "adsum/assum" }), "pres-act-ind.1sg")!.forms, ["adsum", "assum"]);
assert.match(conjWordProblem("la", la("afferō", "irr", "afferō, afferre, attulī, allātum", { prefix: "ad" }))!, /isn't ad- \+ sum, eō or ferō/);
assert.match(conjWordProblem("la", la("afferō", "irr", "afferō, adferre, attulī, allātum", { prefix: "af" }))!, /should be afferre/);
assert.match(conjWordProblem("la", la("dēdūcō", "v3", "dēdūcō, dēdūcere, dēdūxī, dēductum", { prefix: "dē" }))!, /compounds of sum, eō and ferō/);
assert.match(conjMissing("la", la("exeō", "irr", "exeō, exīre, exiī, exitum"), "pres-act-subj")[0].why!, /forms\.prefix/);
assert(conjWordWarnings("la", la("exeō", "irr", "exeō, exīre, exiī, exitum")).some((x) => /compound of eō/.test(x)));
// Deponents with an irregular future participle give it as a fourth part (L&S moritūrus, oritūrus…).
const morior = la("morior", "v3-io", "morior, morī, mortuus sum, moritūrus");
paradigm("la", morior, { "perf-act-ind": "mortuus sum, mortuus es, mortuus est, mortuī sumus, mortuī estis, mortuī sunt", "fut-act-ptc": "moritūrus, moritūra, moritūrum", "fut-act-inf": "moritūrus esse", "perf-pass-ptc": "mortuus, mortua, mortuum" });
paradigm("la", la("fruor", "v3", "fruor, fruī, frūctus sum, fruitūrus"), { "fut-act-ptc": "fruitūrus, fruitūra, fruitūrum" });
paradigm("la", la("gaudeō", "v2", "gaudeō, gaudēre, gāvīsus sum, gāvīsūrus"), { "fut-act-ptc": "gāvīsūrus, gāvīsūra, gāvīsūrum", "perf-act-ind.1sg": "gāvīsus sum" });
paradigm("la", la("reor", "v2", "reor, rērī, ratus sum, —"), { "fut-act-ptc": "—, —, —", "fut-act-inf": "—" });
assert.match(conjWordProblem("la", la("morior", "v3-io", "morior, morī, mortuus sum, moritum"))!, /future participle in -ūrus/);
// dīc, dūc, fac, fer (A&G 182) and compounds; cōnficiō keeps -e.
assert.equal(row("la", la("dūcō", "v3", "dūcō, dūcere, dūxī, ductum"), "pres-act-imp"), "dūc, dūcite");
assert.equal(row("la", la("dīcō", "v3", "dīcō, dīcere, dīxī, dictum"), "pres-act-imp"), "dīc, dīcite");
assert.equal(row("la", la("faciō", "v3-io", "faciō, facere, fēcī, factum"), "pres-act-imp"), "fac, facite");
assert.equal(row("la", la("ēdūcō", "v3", "ēdūcō, ēdūcere, ēdūxī, ēductum"), "pres-act-imp"), "ēdūc, ēdūcite");
assert.equal(row("la", la("cōnficiō", "v3-io", "cōnficiō, cōnficere, cōnfēcī, cōnfectum"), "pres-act-imp"), "cōnfice, cōnficite");
// Semi-deponent: active present system, passive-form perfect.
const audeo = la("audeō", "v2", "audeō, audēre, ausus sum");
assert.equal(row("la", audeo, "pres-act-ind"), "audeō, audēs, audet, audēmus, audētis, audent");
assert.equal(row("la", audeo, "perf-act-ind"), "ausus sum, ausus es, ausus est, ausī sumus, ausī estis, ausī sunt");
assert.equal(row("la", audeo, "pres-pass-ind"), "—, —, —, —, —, —", "semi-deponents have no passive");
// Missing parts: a three-part dict leaves the supine forms to the writer; "—" says the verb lacks them.
const timeo = la("timeō", "v2", "timeō, timēre, timuī");
assert.deepEqual(conjMissing("la", timeo, "perf-pass-ind").map((m) => m.slot).slice(0, 2), ["perf-pass-ind.1sg", "perf-pass-ind.2sg"]);
assert.match(conjMissing("la", timeo, "perf-pass-ind")[0].why!, /supine/);
assert.deepEqual(conjMissing("la", la("timeō", "v2", "timeō, timēre, timuī, —"), "perf-pass-ind"), []);
assert.match(conjWordProblem("la", la("amō", "v2", "amō, amāre, amāvī, amātum"))!, /doesn't fit the 2nd conjugation/);
assert.match(conjWordProblem("la", la("capiō", "v3", "capiō, capere, cēpī, captum"))!, /v3-io/);
// A table overrides one cell or a row; a wrong count is a problem.
const override = la("amō", "v1", "amō, amāre, amāvī, amātum", { "perf-act-ind.2sg": "amāvistī/amāstī" });
assert.deepEqual(cell("la", override, "perf-act-ind.2sg")!.forms, ["amāvistī", "amāstī"]);
assert.match(conjWordProblem("la", la("amō", "v1", "amō, amāre, amāvī, amātum", { "pres-act-ind": "amō, amās" }))!, /needs 6/);
assert.match(conjWordProblem("la", la("amō", "v1", "amō, amāre, amāvī, amātum", { "pres-xyz": "amō" }))!, /unknown forms.pres-xyz/);
// Pronouns: tables only, with or without genders; the vocative may be left out.
const ego = la("ego", "pron", "ego, meī", { sg: "ego, meī, mihi, mē, mē", pl: "nōs, nostrum/nostrī, nōbīs, nōs, nōbīs" });
assert.equal(conjWordProblem("la", ego), undefined);
assert.equal(row("la", ego, "sg"), "ego, meī, mihi, mē, mē, —");
const hic = la("hic", "pron", "hic, haec, hoc", {
  sg: "hic, haec, hoc, huius, huius, huius, huic, huic, huic, hunc, hanc, hoc, hōc, hāc, hōc",
  pl: "hī, hae, haec, hōrum, hārum, hōrum, hīs, hīs, hīs, hōs, hās, haec, hīs, hīs, hīs",
});
assert.equal(conjWordProblem("la", hic), undefined);
assert.equal(promptsFor(course("la", [hic]), hic, "gen").find((p) => p.person === "pl.gen.f")!.answers[0], "hārum");
assert.match(conjWordProblem("la", la("is", "pron", "is, ea, id"))!, /table/);

// Prompts, labels and answers.
const puella = la("puella", "decl1", "puella, puellae, f.");
const pc = course("la", [puella, amo, capio], ["gen", "perf-act-ind", "perf-pass-ind", "perf-pass-ptc"]);
const genPl = promptsFor(pc, puella, "gen").find((p) => p.person === "pl.gen")!;
assert.equal(genPl.label, "genitive plural");
assert.equal(genPl.answers[0], "puellārum");
assert.equal(promptsFor(pc, capio, "perf-act-ind").find((p) => p.person === "perf-act-ind.3pl")!.label, "3rd person plural, perfect active indicative");
const perfPass = promptsFor(pc, amo, "perf-pass-ind").find((p) => p.person === "perf-pass-ind.3sg")!;
assert(checkConj(perfPass, "amātus est", "la").ok && checkConj(perfPass, "amāta est", "la").ok && checkConj(perfPass, "amātum est", "la").ok, "any gender");
assert(!checkConj(perfPass, "amātus sum", "la").ok);
const ptcM = promptsFor(pc, amo, "perf-pass-ptc").find((p) => p.person === "perf-pass-ptc.m")!;
assert.equal(ptcM.label, "perfect passive participle, masculine");
assert(checkConj(ptcM, "amātus", "la").ok && checkConj(ptcM, "amātus, -a, -um", "la").ok);
assert.equal(formName("la", "gen"), "genitive");
assert.equal(formName("la", "fut-act-inf"), "future active infinitive");
assert.equal(formName("la", "adj-abl"), "adjectives: ablative");
// noForms and recognition-only words.
assert(!formsForClass("la", { ...puella, noForms: ["voc"] }).includes("voc"));
assert.deepEqual(formsForClass("la", { ...puella, directions: ["meaning"] }), []);

// =============================================================================================
// Greek nouns (Smyth 211–275). Rows: nom, gen, dat, acc, voc.

paradigm("grc", gr("τιμή", "decl1", "τιμή, τιμῆς, ἡ"), { sg: "τιμή, τιμῆς, τιμῇ, τιμήν, τιμή", pl: "τιμαί, τιμῶν, τιμαῖς, τιμάς, τιμαί" });
paradigm("grc", gr("τιμή", "decl1", "τιμή, -ῆς, ἡ"), { "sg.gen": "τιμῆς" });
paradigm("grc", gr("χώρα", "decl1", "χώρα, χώρας, ἡ"), { sg: "χώρα, χώρας, χώρᾳ, χώραν, χώρα", pl: "χῶραι, χωρῶν, χώραις, χώρας, χῶραι" });
paradigm("grc", gr("θάλαττα", "decl1", "θάλαττα, θαλάττης, ἡ"), { sg: "θάλαττα, θαλάττης, θαλάττῃ, θάλατταν, θάλαττα", pl: "θάλατται, θαλαττῶν, θαλάτταις, θαλάττας, θάλατται" });
paradigm("grc", gr("μοῖρα", "decl1", "μοῖρα, μοίρας, ἡ"), { sg: "μοῖρα, μοίρας, μοίρᾳ, μοῖραν, μοῖρα" });
paradigm("grc", gr("πολίτης", "decl1", "πολίτης, πολίτου, ὁ", { long: "ι" }), { sg: "πολίτης, πολίτου, πολίτῃ, πολίτην, πολῖτα", pl: "πολῖται, πολιτῶν, πολίταις, πολίτας, πολῖται" });
paradigm("grc", gr("νεανίας", "decl1", "νεανίας, νεανίου, ὁ", { short: "ι" }), { sg: "νεανίας, νεανίου, νεανίᾳ, νεανίαν, νεανία", pl: "νεανίαι, νεανιῶν, νεανίαις, νεανίας, νεανίαι" });
// Without the vowel's length the forms that depend on it are refused, not guessed.
const politesBare = gr("πολίτης", "decl1", "πολίτης, πολίτου, ὁ");
assert.equal(conjWordProblem("grc", politesBare), undefined);
assert.deepEqual(conjMissing("grc", politesBare, "voc").map((m) => m.slot), ["sg.voc", "pl.voc"]);
assert.match(conjMissing("grc", politesBare, "voc")[0].why!, /forms.long or forms.short/);
assert.equal(row("grc", politesBare, "sg.gen"), "πολίτου");
paradigm("grc", gr("λόγος", "decl2", "λόγος, λόγου, ὁ"), { sg: "λόγος, λόγου, λόγῳ, λόγον, λόγε", pl: "λόγοι, λόγων, λόγοις, λόγους, λόγοι" });
paradigm("grc", gr("ἄνθρωπος", "decl2", "ἄνθρωπος, ἀνθρώπου, ὁ"), { sg: "ἄνθρωπος, ἀνθρώπου, ἀνθρώπῳ, ἄνθρωπον, ἄνθρωπε", pl: "ἄνθρωποι, ἀνθρώπων, ἀνθρώποις, ἀνθρώπους, ἄνθρωποι" });
paradigm("grc", gr("δῶρον", "decl2", "δῶρον, δώρου, τό"), { sg: "δῶρον, δώρου, δώρῳ, δῶρον, δῶρον", pl: "δῶρα, δώρων, δώροις, δῶρα, δῶρα" });
paradigm("grc", gr("ὁδός", "decl2", "ὁδός, ὁδοῦ, ἡ"), { sg: "ὁδός, ὁδοῦ, ὁδῷ, ὁδόν, ὁδέ", pl: "ὁδοί, ὁδῶν, ὁδοῖς, ὁδούς, ὁδοί" });
const phylax = gr("φύλαξ", "decl3", "φύλαξ, φύλακος, ὁ");
paradigm("grc", phylax, { sg: "φύλαξ, φύλακος, φύλακι, φύλακα, φύλαξ", pl: "φύλακες, φυλάκων, φύλαξι(ν), φύλακας, φύλακες" });
assert.deepEqual(promptsFor(course("grc", [phylax]), phylax, "dat").find((p) => p.person === "pl.dat")!.answers, ["φύλαξι(ν)", "φύλαξι", "φύλαξιν"], "movable ν either way");
paradigm("grc", gr("σῶμα", "decl3", "σῶμα, σώματος, τό"), { sg: "σῶμα, σώματος, σώματι, σῶμα, σῶμα", pl: "σώματα, σωμάτων, σώμασι(ν), σώματα, σώματα" });
paradigm("grc", gr("ἐλπίς", "decl3", "ἐλπίς, ἐλπίδος, ἡ"), { sg: "ἐλπίς, ἐλπίδος, ἐλπίδι, ἐλπίδα, ἐλπί", pl: "ἐλπίδες, ἐλπίδων, ἐλπίσι(ν), ἐλπίδας, ἐλπίδες" });
paradigm("grc", gr("χάρις", "decl3", "χάρις, χάριτος, ἡ"), { sg: "χάρις, χάριτος, χάριτι, χάριν, χάρι", pl: "χάριτες, χαρίτων, χάρισι(ν), χάριτας, χάριτες" });
paradigm("grc", gr("γέρων", "decl3", "γέρων, γέροντος, ὁ"), { sg: "γέρων, γέροντος, γέροντι, γέροντα, γέρον", pl: "γέροντες, γερόντων, γέρουσι(ν), γέροντας, γέροντες" });
paradigm("grc", gr("δαίμων", "decl3", "δαίμων, δαίμονος, ὁ"), { "sg.voc": "δαῖμον", "pl.dat": "δαίμοσι(ν)" });
// One-syllable stems accent the ending in the genitive and dative (Smyth 252).
paradigm("grc", gr("θήρ", "decl3", "θήρ, θηρός, ὁ"), { sg: "θήρ, θηρός, θηρί, θῆρα, θήρ", pl: "θῆρες, θηρῶν, θηρσί(ν), θῆρας, θῆρες" });
paradigm("grc", gr("παῖς", "decl3", "παῖς, παιδός, ὁ"), { "pl.gen": "παίδων", "pl.dat": "παισί(ν)", "sg.voc": "παῖ" });
paradigm("grc", gr("πόλις", "decl3-i", "πόλις, πόλεως, ἡ"), { sg: "πόλις, πόλεως, πόλει, πόλιν, πόλι", pl: "πόλεις, πόλεων, πόλεσι(ν), πόλεις, πόλεις" });
const basileus = gr("βασιλεύς", "decl3-eu", "βασιλεύς, βασιλέως, ὁ");
paradigm("grc", basileus, { sg: "βασιλεύς, βασιλέως, βασιλεῖ, βασιλέα, βασιλεῦ", pl: "βασιλῆς, βασιλέων, βασιλεῦσι(ν), βασιλέας, βασιλῆς" });
assert.deepEqual(cell("grc", basileus, "pl.nom")!.forms, ["βασιλῆς", "βασιλεῖς"], "older βασιλῆς, later βασιλεῖς (Smyth 275)");
paradigm("grc", gr("γένος", "decl3-s", "γένος, γένους, τό"), { sg: "γένος, γένους, γένει, γένος, γένος", pl: "γένη, γενῶν, γένεσι(ν), γένη, γένη" });
assert.match(conjWordProblem("grc", gr("φύλαξ", "decl3", "φύλαξ, φυλάκος, ὁ"))!, /doesn't match the rules/);
assert.match(conjWordProblem("grc", gr("λόγος", "decl2", "λόγος, λόγου"))!, /article/);

// Greek adjectives (Smyth 286–293). Rows: sg.nom … pl.voc, masculine, feminine, neuter.
paradigm("grc", gr("ἀγαθός", "adj12", "ἀγαθός, -ή, -όν"), {
  "sg.nom": "ἀγαθός, ἀγαθή, ἀγαθόν", "sg.gen": "ἀγαθοῦ, ἀγαθῆς, ἀγαθοῦ", "sg.dat": "ἀγαθῷ, ἀγαθῇ, ἀγαθῷ", "sg.acc": "ἀγαθόν, ἀγαθήν, ἀγαθόν", "sg.voc": "ἀγαθέ, ἀγαθή, ἀγαθόν",
  "pl.nom": "ἀγαθοί, ἀγαθαί, ἀγαθά", "pl.gen": "ἀγαθῶν, ἀγαθῶν, ἀγαθῶν", "pl.dat": "ἀγαθοῖς, ἀγαθαῖς, ἀγαθοῖς", "pl.acc": "ἀγαθούς, ἀγαθάς, ἀγαθά", "pl.voc": "ἀγαθοί, ἀγαθαί, ἀγαθά",
});
paradigm("grc", gr("ἄξιος", "adj12", "ἄξιος, -α, -ον"), {
  "sg.nom": "ἄξιος, ἀξία, ἄξιον", "sg.gen": "ἀξίου, ἀξίας, ἀξίου", "sg.dat": "ἀξίῳ, ἀξίᾳ, ἀξίῳ", "sg.acc": "ἄξιον, ἀξίαν, ἄξιον", "sg.voc": "ἄξιε, ἀξία, ἄξιον",
  "pl.nom": "ἄξιοι, ἄξιαι, ἄξια", "pl.gen": "ἀξίων, ἀξίων, ἀξίων", "pl.dat": "ἀξίοις, ἀξίαις, ἀξίοις", "pl.acc": "ἀξίους, ἀξίας, ἄξια", "pl.voc": "ἄξιοι, ἄξιαι, ἄξια",
});
paradigm("grc", gr("ἄδικος", "adj12", "ἄδικος, -ον"), { "sg.nom": "ἄδικος, ἄδικος, ἄδικον", "pl.gen": "ἀδίκων, ἀδίκων, ἀδίκων" });
paradigm("grc", gr("ἀληθής", "adj3", "ἀληθής, -ές"), {
  "sg.nom": "ἀληθής, ἀληθής, ἀληθές", "sg.gen": "ἀληθοῦς, ἀληθοῦς, ἀληθοῦς", "sg.dat": "ἀληθεῖ, ἀληθεῖ, ἀληθεῖ", "sg.acc": "ἀληθῆ, ἀληθῆ, ἀληθές", "sg.voc": "ἀληθές, ἀληθές, ἀληθές",
  "pl.nom": "ἀληθεῖς, ἀληθεῖς, ἀληθῆ", "pl.gen": "ἀληθῶν, ἀληθῶν, ἀληθῶν", "pl.dat": "ἀληθέσι(ν), ἀληθέσι(ν), ἀληθέσι(ν)", "pl.acc": "ἀληθεῖς, ἀληθεῖς, ἀληθῆ", "pl.voc": "ἀληθεῖς, ἀληθεῖς, ἀληθῆ",
});
paradigm("grc", gr("σώφρων", "adj3", "σώφρων, -ον"), {
  "sg.nom": "σώφρων, σώφρων, σῶφρον", "sg.gen": "σώφρονος, σώφρονος, σώφρονος", "sg.dat": "σώφρονι, σώφρονι, σώφρονι", "sg.acc": "σώφρονα, σώφρονα, σῶφρον", "sg.voc": "σῶφρον, σῶφρον, σῶφρον",
  "pl.nom": "σώφρονες, σώφρονες, σώφρονα", "pl.gen": "σωφρόνων, σωφρόνων, σωφρόνων", "pl.dat": "σώφροσι(ν), σώφροσι(ν), σώφροσι(ν)", "pl.acc": "σώφρονας, σώφρονας, σώφρονα", "pl.voc": "σώφρονες, σώφρονες, σώφρονα",
});
// The article: built in.
paradigm("grc", gr("ὁ", "pron", "ὁ, ἡ, τό"), {
  "sg.nom": "ὁ, ἡ, τό", "sg.gen": "τοῦ, τῆς, τοῦ", "sg.dat": "τῷ, τῇ, τῷ", "sg.acc": "τόν, τήν, τό", "sg.voc": "—, —, —",
  "pl.nom": "οἱ, αἱ, τά", "pl.gen": "τῶν, τῶν, τῶν", "pl.dat": "τοῖς, ταῖς, τοῖς", "pl.acc": "τούς, τάς, τά",
});

// =============================================================================================
// Greek verbs (Smyth 383–385, 392–395). Rows: 1st, 2nd, 3rd singular, 1st, 2nd, 3rd plural;
// imperatives 2nd and 3rd singular, 2nd and 3rd plural; participles masculine, feminine, neuter.

const luo = gr("λύω", "omega", "λύω, λύσω, ἔλυσα, λέλυκα, λέλυμαι, ἐλύθην", { long: "present future aorist", short: "perfect" });
const LUO: Record<string, string> = {
  "pres-act-ind": "λύω, λύεις, λύει, λύομεν, λύετε, λύουσι(ν)",
  "pres-act-subj": "λύω, λύῃς, λύῃ, λύωμεν, λύητε, λύωσι(ν)",
  "pres-act-opt": "λύοιμι, λύοις, λύοι, λύοιμεν, λύοιτε, λύοιεν",
  "pres-act-imp": "λῦε, λυέτω, λύετε, λυόντων",
  "pres-act-inf": "λύειν",
  "pres-act-ptc": "λύων, λύουσα, λῦον",
  "impf-act-ind": "ἔλυον, ἔλυες, ἔλυε(ν), ἐλύομεν, ἐλύετε, ἔλυον",
  "fut-act-ind": "λύσω, λύσεις, λύσει, λύσομεν, λύσετε, λύσουσι(ν)",
  "fut-act-opt": "λύσοιμι, λύσοις, λύσοι, λύσοιμεν, λύσοιτε, λύσοιεν",
  "fut-act-inf": "λύσειν",
  "fut-act-ptc": "λύσων, λύσουσα, λῦσον",
  "aor-act-ind": "ἔλυσα, ἔλυσας, ἔλυσε(ν), ἐλύσαμεν, ἐλύσατε, ἔλυσαν",
  "aor-act-subj": "λύσω, λύσῃς, λύσῃ, λύσωμεν, λύσητε, λύσωσι(ν)",
  "aor-act-opt": "λύσαιμι, λύσαις, λύσαι, λύσαιμεν, λύσαιτε, λύσαιεν",
  "aor-act-imp": "λῦσον, λυσάτω, λύσατε, λυσάντων",
  "aor-act-inf": "λῦσαι",
  "aor-act-ptc": "λύσας, λύσασα, λῦσαν",
  "perf-act-ind": "λέλυκα, λέλυκας, λέλυκε(ν), λελύκαμεν, λελύκατε, λελύκασι(ν)",
  "perf-act-inf": "λελυκέναι",
  "perf-act-ptc": "λελυκώς, λελυκυῖα, λελυκός",
  "plpf-act-ind": "ἐλελύκη, ἐλελύκης, ἐλελύκει(ν), ἐλελύκεμεν, ἐλελύκετε, ἐλελύκεσαν",
  "pres-mp-ind": "λύομαι, λύῃ, λύεται, λυόμεθα, λύεσθε, λύονται",
  "pres-mp-subj": "λύωμαι, λύῃ, λύηται, λυώμεθα, λύησθε, λύωνται",
  "pres-mp-opt": "λυοίμην, λύοιο, λύοιτο, λυοίμεθα, λύοισθε, λύοιντο",
  "pres-mp-imp": "λύου, λυέσθω, λύεσθε, λυέσθων",
  "pres-mp-inf": "λύεσθαι",
  "pres-mp-ptc": "λυόμενος, λυομένη, λυόμενον",
  "impf-mp-ind": "ἐλυόμην, ἐλύου, ἐλύετο, ἐλυόμεθα, ἐλύεσθε, ἐλύοντο",
  "fut-mid-ind": "λύσομαι, λύσῃ, λύσεται, λυσόμεθα, λύσεσθε, λύσονται",
  "fut-mid-opt": "λυσοίμην, λύσοιο, λύσοιτο, λυσοίμεθα, λύσοισθε, λύσοιντο",
  "fut-mid-inf": "λύσεσθαι",
  "fut-mid-ptc": "λυσόμενος, λυσομένη, λυσόμενον",
  "aor-mid-ind": "ἐλυσάμην, ἐλύσω, ἐλύσατο, ἐλυσάμεθα, ἐλύσασθε, ἐλύσαντο",
  "aor-mid-subj": "λύσωμαι, λύσῃ, λύσηται, λυσώμεθα, λύσησθε, λύσωνται",
  "aor-mid-opt": "λυσαίμην, λύσαιο, λύσαιτο, λυσαίμεθα, λύσαισθε, λύσαιντο",
  "aor-mid-imp": "λῦσαι, λυσάσθω, λύσασθε, λυσάσθων",
  "aor-mid-inf": "λύσασθαι",
  "aor-mid-ptc": "λυσάμενος, λυσαμένη, λυσάμενον",
  "perf-mp-ind": "λέλυμαι, λέλυσαι, λέλυται, λελύμεθα, λέλυσθε, λέλυνται",
  "perf-mp-inf": "λελύσθαι",
  "perf-mp-ptc": "λελυμένος, λελυμένη, λελυμένον",
  "plpf-mp-ind": "ἐλελύμην, ἐλέλυσο, ἐλέλυτο, ἐλελύμεθα, ἐλέλυσθε, ἐλέλυντο",
  "aor-pass-ind": "ἐλύθην, ἐλύθης, ἐλύθη, ἐλύθημεν, ἐλύθητε, ἐλύθησαν",
  "aor-pass-subj": "λυθῶ, λυθῇς, λυθῇ, λυθῶμεν, λυθῆτε, λυθῶσι(ν)",
  "aor-pass-opt": "λυθείην, λυθείης, λυθείη, λυθεῖμεν, λυθεῖτε, λυθεῖεν",
  "aor-pass-imp": "λύθητι, λυθήτω, λύθητε, λυθέντων",
  "aor-pass-inf": "λυθῆναι",
  "aor-pass-ptc": "λυθείς, λυθεῖσα, λυθέν",
  "fut-pass-ind": "λυθήσομαι, λυθήσῃ, λυθήσεται, λυθησόμεθα, λυθήσεσθε, λυθήσονται",
  "fut-pass-opt": "λυθησοίμην, λυθήσοιο, λυθήσοιτο, λυθησοίμεθα, λυθήσοισθε, λυθήσοιντο",
  "fut-pass-inf": "λυθήσεσθαι",
  "fut-pass-ptc": "λυθησόμενος, λυθησομένη, λυθησόμενον",
};
paradigm("grc", luo, LUO);
// Every generated form of λύω is checked above.
{
  const w = classicalWord("grc", luo);
  if (typeof w === "string") throw new Error(w);
  const covered = new Set(Object.keys(LUO).flatMap((k) => w.slots.filter((s) => s === k || s.startsWith(k + "."))));
  for (const s of w.cells.keys()) assert(covered.has(s), `λύω ${s} is generated but not checked`);
  assert.equal(w.cells.size, covered.size, "λύω: every slot generates");
}
assert.deepEqual(cell("grc", luo, "pres-mp-ind.2sg")!.forms, ["λύῃ", "λύει"]);
assert.deepEqual(cell("grc", luo, "aor-act-opt.3sg")!.forms, ["λύσαι", "λύσειε(ν)"], "the Aeolic optative accepted (Smyth 668)");
assert.deepEqual(cell("grc", luo, "aor-pass-opt.1pl")!.forms, ["λυθεῖμεν", "λυθείημεν"]);
assert.deepEqual(cell("grc", luo, "plpf-act-ind.1sg")!.forms, ["ἐλελύκη", "ἐλελύκειν"]);
// Without the stem's quantity, the forms that hang on it are refused.
const luoBare = gr("λύω", "omega", "λύω, λύσω, ἔλυσα, λέλυκα, λέλυμαι, ἐλύθην");
assert.deepEqual(conjMissing("grc", luoBare, "aor-act-inf").map((m) => m.slot), ["aor-act-inf"]);
assert.match(conjMissing("grc", luoBare, "aor-act-inf")[0].why!, /forms.long or forms.short "aorist"/);
assert.deepEqual(conjMissing("grc", luoBare, "pres-act-ind"), []);

paradigm("grc", gr("παιδεύω", "omega", "παιδεύω, παιδεύσω, ἐπαίδευσα, πεπαίδευκα, πεπαίδευμαι, ἐπαιδεύθην"), {
  "pres-act-ind": "παιδεύω, παιδεύεις, παιδεύει, παιδεύομεν, παιδεύετε, παιδεύουσι(ν)",
  "pres-act-imp": "παίδευε, παιδευέτω, παιδεύετε, παιδευόντων",
  "pres-act-ptc": "παιδεύων, παιδεύουσα, παιδεῦον",
  "impf-act-ind": "ἐπαίδευον, ἐπαίδευες, ἐπαίδευε(ν), ἐπαιδεύομεν, ἐπαιδεύετε, ἐπαίδευον",
  "fut-act-ind": "παιδεύσω, παιδεύσεις, παιδεύσει, παιδεύσομεν, παιδεύσετε, παιδεύσουσι(ν)",
  "aor-act-ind": "ἐπαίδευσα, ἐπαίδευσας, ἐπαίδευσε(ν), ἐπαιδεύσαμεν, ἐπαιδεύσατε, ἐπαίδευσαν",
  "aor-act-imp": "παίδευσον, παιδευσάτω, παιδεύσατε, παιδευσάντων",
  "aor-act-inf": "παιδεῦσαι",
  "aor-act-ptc": "παιδεύσας, παιδεύσασα, παιδεῦσαν",
  "aor-mid-imp": "παίδευσαι, παιδευσάσθω, παιδεύσασθε, παιδευσάσθων",
  "perf-act-ind": "πεπαίδευκα, πεπαίδευκας, πεπαίδευκε(ν), πεπαιδεύκαμεν, πεπαιδεύκατε, πεπαιδεύκασι(ν)",
  "plpf-act-ind": "ἐπεπαιδεύκη, ἐπεπαιδεύκης, ἐπεπαιδεύκει(ν), ἐπεπαιδεύκεμεν, ἐπεπαιδεύκετε, ἐπεπαιδεύκεσαν",
  "perf-mp-ind": "πεπαίδευμαι, πεπαίδευσαι, πεπαίδευται, πεπαιδεύμεθα, πεπαίδευσθε, πεπαίδευνται",
  "perf-mp-inf": "πεπαιδεῦσθαι",
  "aor-pass-ind": "ἐπαιδεύθην, ἐπαιδεύθης, ἐπαιδεύθη, ἐπαιδεύθημεν, ἐπαιδεύθητε, ἐπαιδεύθησαν",
  "aor-pass-imp": "παιδεύθητι, παιδευθήτω, παιδεύθητε, παιδευθέντων",
  "fut-pass-ind": "παιδευθήσομαι, παιδευθήσῃ, παιδευθήσεται, παιδευθησόμεθα, παιδευθήσεσθε, παιδευθήσονται",
});
// Second aorist (Smyth 384): λείπω.
const leipo = gr("λείπω", "omega", "λείπω, λείψω, ἔλιπον, λέλοιπα, λέλειμμαι, ἐλείφθην", { short: "aorist" });
paradigm("grc", leipo, {
  "pres-act-ind": "λείπω, λείπεις, λείπει, λείπομεν, λείπετε, λείπουσι(ν)",
  "pres-act-imp": "λεῖπε, λειπέτω, λείπετε, λειπόντων",
  "pres-act-ptc": "λείπων, λείπουσα, λεῖπον",
  "impf-act-ind": "ἔλειπον, ἔλειπες, ἔλειπε(ν), ἐλείπομεν, ἐλείπετε, ἔλειπον",
  "fut-act-ind": "λείψω, λείψεις, λείψει, λείψομεν, λείψετε, λείψουσι(ν)",
  "aor-act-ind": "ἔλιπον, ἔλιπες, ἔλιπε(ν), ἐλίπομεν, ἐλίπετε, ἔλιπον",
  "aor-act-subj": "λίπω, λίπῃς, λίπῃ, λίπωμεν, λίπητε, λίπωσι(ν)",
  "aor-act-opt": "λίποιμι, λίποις, λίποι, λίποιμεν, λίποιτε, λίποιεν",
  "aor-act-imp": "λίπε, λιπέτω, λίπετε, λιπόντων",
  "aor-act-inf": "λιπεῖν",
  "aor-act-ptc": "λιπών, λιποῦσα, λιπόν",
  "aor-mid-ind": "ἐλιπόμην, ἐλίπου, ἐλίπετο, ἐλιπόμεθα, ἐλίπεσθε, ἐλίποντο",
  "aor-mid-subj": "λίπωμαι, λίπῃ, λίπηται, λιπώμεθα, λίπησθε, λίπωνται",
  "aor-mid-opt": "λιποίμην, λίποιο, λίποιτο, λιποίμεθα, λίποισθε, λίποιντο",
  "aor-mid-imp": "λιποῦ, λιπέσθω, λίπεσθε, λιπέσθων",
  "aor-mid-inf": "λιπέσθαι",
  "aor-mid-ptc": "λιπόμενος, λιπομένη, λιπόμενον",
  "perf-act-ind": "λέλοιπα, λέλοιπας, λέλοιπε(ν), λελοίπαμεν, λελοίπατε, λελοίπασι(ν)",
  "perf-act-inf": "λελοιπέναι",
  "perf-act-ptc": "λελοιπώς, λελοιπυῖα, λελοιπός",
  "plpf-act-ind": "ἐλελοίπη, ἐλελοίπης, ἐλελοίπει(ν), ἐλελοίπεμεν, ἐλελοίπετε, ἐλελοίπεσαν",
  "aor-pass-ind": "ἐλείφθην, ἐλείφθης, ἐλείφθη, ἐλείφθημεν, ἐλείφθητε, ἐλείφθησαν",
  "aor-pass-imp": "λείφθητι, λειφθήτω, λείφθητε, λειφθέντων",
  "aor-pass-inf": "λειφθῆναι",
  "fut-pass-ind": "λειφθήσομαι, λειφθήσῃ, λειφθήσεται, λειφθησόμεθα, λειφθήσεσθε, λειφθήσονται",
});
// λέλειμμαι: consonant stem, so the perfect middle needs a table.
assert.match(conjMissing("grc", leipo, "perf-mp-ind")[0].why!, /consonant stem/);
// Contract verbs (Smyth 385).
paradigm("grc", gr("τιμάω", "contract", "τιμάω, τιμήσω, ἐτίμησα, τετίμηκα, τετίμημαι, ἐτιμήθην"), {
  "pres-act-ind": "τιμῶ, τιμᾷς, τιμᾷ, τιμῶμεν, τιμᾶτε, τιμῶσι(ν)",
  "pres-act-subj": "τιμῶ, τιμᾷς, τιμᾷ, τιμῶμεν, τιμᾶτε, τιμῶσι(ν)",
  "pres-act-opt": "τιμῴην, τιμῴης, τιμῴη, τιμῷμεν, τιμῷτε, τιμῷεν",
  "pres-act-imp": "τίμα, τιμάτω, τιμᾶτε, τιμώντων",
  "pres-act-inf": "τιμᾶν",
  "pres-act-ptc": "τιμῶν, τιμῶσα, τιμῶν",
  "impf-act-ind": "ἐτίμων, ἐτίμας, ἐτίμα, ἐτιμῶμεν, ἐτιμᾶτε, ἐτίμων",
  "pres-mp-ind": "τιμῶμαι, τιμᾷ, τιμᾶται, τιμώμεθα, τιμᾶσθε, τιμῶνται",
  "pres-mp-subj": "τιμῶμαι, τιμᾷ, τιμᾶται, τιμώμεθα, τιμᾶσθε, τιμῶνται",
  "pres-mp-opt": "τιμῴμην, τιμῷο, τιμῷτο, τιμῴμεθα, τιμῷσθε, τιμῷντο",
  "pres-mp-imp": "τιμῶ, τιμάσθω, τιμᾶσθε, τιμάσθων",
  "pres-mp-inf": "τιμᾶσθαι",
  "pres-mp-ptc": "τιμώμενος, τιμωμένη, τιμώμενον",
  "impf-mp-ind": "ἐτιμώμην, ἐτιμῶ, ἐτιμᾶτο, ἐτιμώμεθα, ἐτιμᾶσθε, ἐτιμῶντο",
  "fut-act-ind": "τιμήσω, τιμήσεις, τιμήσει, τιμήσομεν, τιμήσετε, τιμήσουσι(ν)",
  "aor-act-ind": "ἐτίμησα, ἐτίμησας, ἐτίμησε(ν), ἐτιμήσαμεν, ἐτιμήσατε, ἐτίμησαν",
  "aor-act-inf": "τιμῆσαι",
  "perf-act-ind": "τετίμηκα, τετίμηκας, τετίμηκε(ν), τετιμήκαμεν, τετιμήκατε, τετιμήκασι(ν)",
  "perf-mp-ind": "τετίμημαι, τετίμησαι, τετίμηται, τετιμήμεθα, τετίμησθε, τετίμηνται",
  "perf-mp-inf": "τετιμῆσθαι",
  "aor-pass-ind": "ἐτιμήθην, ἐτιμήθης, ἐτιμήθη, ἐτιμήθημεν, ἐτιμήθητε, ἐτιμήθησαν",
});
paradigm("grc", gr("ποιέω", "contract", "ποιέω, ποιήσω, ἐποίησα, πεποίηκα, πεποίημαι, ἐποιήθην"), {
  "pres-act-ind": "ποιῶ, ποιεῖς, ποιεῖ, ποιοῦμεν, ποιεῖτε, ποιοῦσι(ν)",
  "pres-act-subj": "ποιῶ, ποιῇς, ποιῇ, ποιῶμεν, ποιῆτε, ποιῶσι(ν)",
  "pres-act-opt": "ποιοίην, ποιοίης, ποιοίη, ποιοῖμεν, ποιοῖτε, ποιοῖεν",
  "pres-act-imp": "ποίει, ποιείτω, ποιεῖτε, ποιούντων",
  "pres-act-inf": "ποιεῖν",
  "pres-act-ptc": "ποιῶν, ποιοῦσα, ποιοῦν",
  "impf-act-ind": "ἐποίουν, ἐποίεις, ἐποίει, ἐποιοῦμεν, ἐποιεῖτε, ἐποίουν",
  "pres-mp-ind": "ποιοῦμαι, ποιῇ, ποιεῖται, ποιούμεθα, ποιεῖσθε, ποιοῦνται",
  "pres-mp-subj": "ποιῶμαι, ποιῇ, ποιῆται, ποιώμεθα, ποιῆσθε, ποιῶνται",
  "pres-mp-opt": "ποιοίμην, ποιοῖο, ποιοῖτο, ποιοίμεθα, ποιοῖσθε, ποιοῖντο",
  "pres-mp-imp": "ποιοῦ, ποιείσθω, ποιεῖσθε, ποιείσθων",
  "pres-mp-inf": "ποιεῖσθαι",
  "pres-mp-ptc": "ποιούμενος, ποιουμένη, ποιούμενον",
  "impf-mp-ind": "ἐποιούμην, ἐποιοῦ, ἐποιεῖτο, ἐποιούμεθα, ἐποιεῖσθε, ἐποιοῦντο",
  "aor-act-inf": "ποιῆσαι",
});
assert.deepEqual(cell("grc", gr("ποιέω", "contract", "ποιέω, ποιήσω, ἐποίησα, πεποίηκα, πεποίημαι, ἐποιήθην"), "pres-mp-ind.2sg")!.forms, ["ποιῇ", "ποιεῖ"]);
paradigm("grc", gr("δηλόω", "contract", "δηλόω, δηλώσω, ἐδήλωσα, δεδήλωκα, δεδήλωμαι, ἐδηλώθην"), {
  "pres-act-ind": "δηλῶ, δηλοῖς, δηλοῖ, δηλοῦμεν, δηλοῦτε, δηλοῦσι(ν)",
  "pres-act-subj": "δηλῶ, δηλοῖς, δηλοῖ, δηλῶμεν, δηλῶτε, δηλῶσι(ν)",
  "pres-act-opt": "δηλοίην, δηλοίης, δηλοίη, δηλοῖμεν, δηλοῖτε, δηλοῖεν",
  "pres-act-imp": "δήλου, δηλούτω, δηλοῦτε, δηλούντων",
  "pres-act-inf": "δηλοῦν",
  "pres-act-ptc": "δηλῶν, δηλοῦσα, δηλοῦν",
  "impf-act-ind": "ἐδήλουν, ἐδήλους, ἐδήλου, ἐδηλοῦμεν, ἐδηλοῦτε, ἐδήλουν",
  "pres-mp-ind": "δηλοῦμαι, δηλοῖ, δηλοῦται, δηλούμεθα, δηλοῦσθε, δηλοῦνται",
  "pres-mp-subj": "δηλῶμαι, δηλοῖ, δηλῶται, δηλώμεθα, δηλῶσθε, δηλῶνται",
  "pres-mp-opt": "δηλοίμην, δηλοῖο, δηλοῖτο, δηλοίμεθα, δηλοῖσθε, δηλοῖντο",
  "pres-mp-imp": "δηλοῦ, δηλούσθω, δηλοῦσθε, δηλούσθων",
  "pres-mp-inf": "δηλοῦσθαι",
  "pres-mp-ptc": "δηλούμενος, δηλουμένη, δηλούμενον",
  "impf-mp-ind": "ἐδηλούμην, ἐδηλοῦ, ἐδηλοῦτο, ἐδηλούμεθα, ἐδηλοῦσθε, ἐδηλοῦντο",
  "aor-act-inf": "δηλῶσαι",
});
// Deponent with a middle future and a passive aorist (Smyth 811): βούλομαι.
const boulomai = gr("βούλομαι", "omega", "βούλομαι, βουλήσομαι, —, —, βεβούλημαι, ἐβουλήθην");
paradigm("grc", boulomai, {
  "pres-mp-ind": "βούλομαι, βούλει, βούλεται, βουλόμεθα, βούλεσθε, βούλονται",
  "pres-mp-subj": "βούλωμαι, βούλῃ, βούληται, βουλώμεθα, βούλησθε, βούλωνται",
  "pres-mp-inf": "βούλεσθαι",
  "pres-mp-ptc": "βουλόμενος, βουλομένη, βουλόμενον",
  "impf-mp-ind": "ἐβουλόμην, ἐβούλου, ἐβούλετο, ἐβουλόμεθα, ἐβούλεσθε, ἐβούλοντο",
  "fut-mid-ind": "βουλήσομαι, βουλήσῃ, βουλήσεται, βουλησόμεθα, βουλήσεσθε, βουλήσονται",
  "perf-mp-ind": "βεβούλημαι, βεβούλησαι, βεβούληται, βεβουλήμεθα, βεβούλησθε, βεβούληνται",
  "aor-pass-ind": "ἐβουλήθην, ἐβουλήθης, ἐβουλήθη, ἐβουλήθημεν, ἐβουλήθητε, ἐβουλήθησαν",
  "aor-pass-inf": "βουληθῆναι",
  "pres-act-ind": "—, —, —, —, —, —", "aor-act-ind": "—, —, —, —, —, —", "fut-pass-ind": "—, —, —, —, —, —",
});
assert.deepEqual(cell("grc", boulomai, "impf-mp-ind.1sg")!.forms, ["ἐβουλόμην", "ἠβουλόμην"], "βούλομαι also takes ἠ- (Smyth 430)");
assert.deepEqual(conjMissing("grc", boulomai, "pres-act-ind"), [], "a deponent has no active: nothing to give");
// ἔρχομαι is suppletive (ἦλθον, ἐλήλυθα; the future is εἶμι): a table.
const erchomai = gr("ἔρχομαι", "irr", "ἔρχομαι, εἶμι, ἦλθον, ἐλήλυθα, —, —", {
  "pres-mp-ind": "ἔρχομαι, ἔρχει, ἔρχεται, ἐρχόμεθα, ἔρχεσθε, ἔρχονται",
  "aor-act-ind": "ἦλθον, ἦλθες, ἦλθε(ν), ἤλθομεν, ἤλθετε, ἦλθον",
  "aor-act-subj": "ἔλθω, ἔλθῃς, ἔλθῃ, ἔλθωμεν, ἔλθητε, ἔλθωσι(ν)",
  "aor-act-imp": "ἐλθέ, ἐλθέτω, ἔλθετε, ἐλθόντων",
  "aor-act-inf": "ἐλθεῖν",
  "aor-act-ptc": "ἐλθών, ἐλθοῦσα, ἐλθόν",
  "perf-act-ind": "ἐλήλυθα, ἐλήλυθας, ἐλήλυθε(ν), ἐληλύθαμεν, ἐληλύθατε, ἐληλύθασι(ν)",
});
const ec = course("grc", [erchomai], ["pres-mp-ind", "aor-act-ind", "aor-act-imp", "aor-act-opt"]);
assert.equal(conjWordProblem("grc", erchomai), undefined);
paradigm("grc", erchomai, { "aor-act-imp": "ἐλθέ, ἐλθέτω, ἔλθετε, ἐλθόντων", "aor-act-inf": "ἐλθεῖν" });
assert.equal(promptsFor(ec, erchomai, "aor-act-ind")[0].answers[0], "ἦλθον");
assert.match(conjMissing("grc", erchomai, "aor-act-opt")[0].why!, /table/);
assert.match(conjWordProblem("grc", gr("ἔρχομαι", "irr", "ἔρχομαι, εἶμι, ἦλθον, ἐλήλυθα, —, —"))!, /table/);
// The irregular aorist augment of λέγω isn't guessed: its aorist and imperfect need tables.
const lego = gr("λέγω", "omega", "λέγω, ἐρῶ, εἶπον, εἴρηκα, εἴρημαι, ἐλέχθην");
assert.match(conjMissing("grc", lego, "aor-act-subj")[0].why!, /augmented/);
assert.match(conjMissing("grc", lego, "impf-act-ind")[0].why!, /imperfect/);
assert.equal(row("grc", lego, "pres-act-ind"), "λέγω, λέγεις, λέγει, λέγομεν, λέγετε, λέγουσι(ν)");
// A contract future (ἐρῶ) inflects like -έω.
assert.equal(row("grc", lego, "fut-act-ind"), "ἐρῶ, ἐρεῖς, ἐρεῖ, ἐροῦμεν, ἐρεῖτε, ἐροῦσι(ν)");
assert.match(conjWordProblem("grc", gr("δίδωμι", "omega", "δίδωμι, δώσω, ἔδωκα, δέδωκα, δέδομαι, ἐδόθην"))!, /-μι verbs need a table/);
assert.match(conjWordProblem("grc", gr("τιμάω", "omega", "τιμάω, τιμήσω, ἐτίμησα, τετίμηκα, τετίμημαι, ἐτιμήθην"))!, /contract/);
assert.match(conjWordProblem("grc", gr("λύω", "omega", "λύω, λύσω, ἔλυσα"))!, /six principal parts/);

// Compound verbs (forms.prefix): augment after the prefix, elision, accent limits (Smyth 426, 450).
const prosballo = gr("προσβάλλω", "omega", "προσβάλλω, προσβαλῶ, προσέβαλον, προσβέβληκα, προσβέβλημαι, προσεβλήθην", { prefix: "προσ", short: "aorist" });
paradigm("grc", prosballo, {
  "pres-act-ind": "προσβάλλω, προσβάλλεις, προσβάλλει, προσβάλλομεν, προσβάλλετε, προσβάλλουσι(ν)",
  "impf-act-ind": "προσέβαλλον, προσέβαλλες, προσέβαλλε(ν), προσεβάλλομεν, προσεβάλλετε, προσέβαλλον",
  "pres-act-imp": "πρόσβαλλε, προσβαλλέτω, προσβάλλετε, προσβαλλόντων",
  "fut-act-ind": "προσβαλῶ, προσβαλεῖς, προσβαλεῖ, προσβαλοῦμεν, προσβαλεῖτε, προσβαλοῦσι(ν)",
  "aor-act-ind": "προσέβαλον, προσέβαλες, προσέβαλε(ν), προσεβάλομεν, προσεβάλετε, προσέβαλον",
  "aor-act-imp": "πρόσβαλε, προσβαλέτω, προσβάλετε, προσβαλόντων",
  "aor-act-inf": "προσβαλεῖν",
  "plpf-act-ind": "προσεβεβλήκη, προσεβεβλήκης, προσεβεβλήκει(ν), προσεβεβλήκεμεν, προσεβεβλήκετε, προσεβεβλήκεσαν",
  "aor-pass-ind": "προσεβλήθην, προσεβλήθης, προσεβλήθη, προσεβλήθημεν, προσεβλήθητε, προσεβλήθησαν",
});
const apoluo = gr("ἀπολύω", "omega", "ἀπολύω, ἀπολύσω, ἀπέλυσα, ἀπολέλυκα, ἀπολέλυμαι, ἀπελύθην", { prefix: "ἀπο", long: "present future aorist", short: "perfect" });
paradigm("grc", apoluo, {
  "impf-act-ind": "ἀπέλυον, ἀπέλυες, ἀπέλυε(ν), ἀπελύομεν, ἀπελύετε, ἀπέλυον",
  "pres-act-imp": "ἀπόλυε, ἀπολυέτω, ἀπολύετε, ἀπολυόντων",
  "aor-act-ind": "ἀπέλυσα, ἀπέλυσας, ἀπέλυσε(ν), ἀπελύσαμεν, ἀπελύσατε, ἀπέλυσαν",
  "aor-act-imp": "ἀπόλυσον, ἀπολυσάτω, ἀπολύσατε, ἀπολυσάντων",
  "aor-act-inf": "ἀπολῦσαι",
  "plpf-act-ind": "ἀπελελύκη, ἀπελελύκης, ἀπελελύκει(ν), ἀπελελύκεμεν, ἀπελελύκετε, ἀπελελύκεσαν",
});
assert.match(conjWordProblem("grc", gr("ἀπολύω", "omega", "ἀπολύω, ἀπολύσω, ἀπέλυσα, ἀπολέλυκα, ἀπολέλυμαι, ἀπελύθην", { prefix: "κατα" }))!, /doesn't start with it/);
// Irregular augments: ἔχω → εἶχον (Smyth 431); ἐθέλω → ἤθελον; the aorist ἔσχον needs a table.
const echo = gr("ἔχω", "omega", "ἔχω, ἕξω, ἔσχον, ἔσχηκα, —, —");
assert.equal(row("grc", echo, "impf-act-ind"), "εἶχον, εἶχες, εἶχε(ν), εἴχομεν, εἴχετε, εἶχον");
assert.match(conjMissing("grc", echo, "aor-act-subj")[0].why!, /augmented/);
assert.equal(row("grc", gr("παρέχω", "omega", "παρέχω, παρέξω, παρέσχον, παρέσχηκα, —, —", { prefix: "παρα" }), "impf-act-ind"), "παρεῖχον, παρεῖχες, παρεῖχε(ν), παρείχομεν, παρείχετε, παρεῖχον");
assert.equal(row("grc", gr("ἐθέλω", "omega", "ἐθέλω, ἐθελήσω, ἠθέλησα, ἠθέληκα, —, —"), "impf-act-ind"), "ἤθελον, ἤθελες, ἤθελε(ν), ἠθέλομεν, ἠθέλετε, ἤθελον");
// εἰμί, syncopated and irregular nouns, μέγας and πολύς: built in (Smyth 262, 278, 284, 311, 768).
const eimi = gr("εἰμί", "irr", "εἰμί, ἔσομαι, —, —, —, —");
paradigm("grc", eimi, {
  "pres-act-ind": "εἰμί, εἶ, ἐστί(ν), ἐσμέν, ἐστέ, εἰσί(ν)",
  "impf-act-ind": "ἦ, ἦσθα, ἦν, ἦμεν, ἦτε, ἦσαν",
  "pres-act-imp": "ἴσθι, ἔστω, ἔστε, ἔστων",
  "pres-act-inf": "εἶναι",
  "pres-act-ptc": "ὤν, οὖσα, ὄν",
  "fut-mid-ind": "ἔσομαι, ἔσει, ἔσται, ἐσόμεθα, ἔσεσθε, ἔσονται",
});
assert.deepEqual(conjMissing("grc", eimi, "aor-act-ind"), [], "εἰμί has no aorist");
paradigm("grc", gr("πατήρ", "decl3", "πατήρ, πατρός, ὁ"), { sg: "πατήρ, πατρός, πατρί, πατέρα, πάτερ", pl: "πατέρες, πατέρων, πατράσι(ν), πατέρας, πατέρες" });
paradigm("grc", gr("μήτηρ", "decl3", "μήτηρ, μητρός, ἡ"), { sg: "μήτηρ, μητρός, μητρί, μητέρα, μῆτερ" });
paradigm("grc", gr("ἀνήρ", "decl3", "ἀνήρ, ἀνδρός, ὁ"), { sg: "ἀνήρ, ἀνδρός, ἀνδρί, ἄνδρα, ἄνερ", pl: "ἄνδρες, ἀνδρῶν, ἀνδράσι(ν), ἄνδρας, ἄνδρες" });
paradigm("grc", gr("ναῦς", "decl3", "ναῦς, νεώς, ἡ"), { sg: "ναῦς, νεώς, νηΐ, ναῦν, ναῦ", pl: "νῆες, νεῶν, ναυσί(ν), ναῦς, νῆες" });
paradigm("grc", gr("μέγας", "adj12", "μέγας, μεγάλη, μέγα"), { "sg.nom": "μέγας, μεγάλη, μέγα", "sg.acc": "μέγαν, μεγάλην, μέγα", "pl.gen": "μεγάλων, μεγάλων, μεγάλων" });
paradigm("grc", gr("πολύς", "adj12", "πολύς, πολλή, πολύ"), { "sg.acc": "πολύν, πολλήν, πολύ", "pl.nom": "πολλοί, πολλαί, πολλά" });
// Table-only adjectives and gendered pronoun tables.
assert.match(conjWordProblem("grc", gr("πᾶς", "adj", "πᾶς, πᾶσα, πᾶν"))!, /table/);
const autos = gr("αὐτός", "pron", "αὐτός, αὐτή, αὐτό", {
  sg: "αὐτός, αὐτή, αὐτό, αὐτοῦ, αὐτῆς, αὐτοῦ, αὐτῷ, αὐτῇ, αὐτῷ, αὐτόν, αὐτήν, αὐτό",
  pl: "αὐτοί, αὐταί, αὐτά, αὐτῶν, αὐτῶν, αὐτῶν, αὐτοῖς, αὐταῖς, αὐτοῖς, αὐτούς, αὐτάς, αὐτά",
});
assert.equal(conjWordProblem("grc", autos), undefined);
assert.equal(row("grc", autos, "pl.dat"), "αὐτοῖς, αὐταῖς, αὐτοῖς");

// Greek prompts and labels.
const gc = course("grc", [luo], ["aor-mid-opt"]);
const opt3pl = promptsFor(gc, luo, "aor-mid-opt").find((p) => p.person === "aor-mid-opt.3pl")!;
assert.equal(opt3pl.label, "3rd person plural, aorist middle optative");
assert.equal(opt3pl.answers[0], "λύσαιντο");
assert(checkConj(opt3pl, "λύσαιντο", "grc").ok);
assert(checkConj(opt3pl, "λύσαιντο".normalize("NFD"), "grc").ok, "NFD typing is fine");
assert(!checkConj(opt3pl, "λύσαιτο", "grc").ok);
assert.equal(formName("grc", "pres-mp-ind"), "present middle/passive indicative");
assert.equal(promptsFor(gc, luo, "aor-mid-opt").length, 6);
// Every generated Greek form is NFC.
for (const item of [luo, leipo, boulomai, phylax, basileus])
  for (const f of formsForClass("grc", item)) for (const p of promptsFor(course("grc", [item]), item, f)) for (const a of p.answers) assert.equal(a, a.normalize("NFC"));

// =============================================================================================
// Course data: settings, forms keys, dict and gender survive normalization.

assert.deepEqual(normalizeConjugationSettings({ forms: [{ form: "gen", lesson: "l3" }, { form: "aor-mid-opt" }, { form: "nope" }] }), { forms: [{ form: "gen", lesson: "l3" }, { form: "aor-mid-opt" }] });
assert.deepEqual(normalizeConjFields({ conj: "decl3", forms: { "sg.voc": "deus", "pres-act-ind": "a, b", long: "ι", "Bad Key": "x" } }).forms, { "sg.voc": "deus", "pres-act-ind": "a, b", long: "ι" });
assert.equal(normalizeConjFields({ conj: "v3-io" }).conj, "v3-io");
assert.deepEqual(slotsOfForm(classicalWord("la", puella) as never, "gen"), ["sg.gen", "pl.gen"]);

// =============================================================================================
// Class-specific unlocks: a form entry with "conj" opens the form only for those classes.

{
  const raw = {
    forms: [
      { form: "pres-act-ind", lesson: "l2" },
      { form: "pres-act-ind", lesson: "l9", conj: ["v3"] },
      { form: "pres-act-ind", lesson: "l2", conj: ["v1", "v2"] },
      { form: "gen", lesson: "l6", conj: ["decl2"] },
      { form: "gen", lesson: "l9", conj: ["decl1-eta", "decl1-alpha"] },
      { form: "gen", lesson: "l10", conj: ["decl1-short", "decl1-masc"] },
      { form: "gen", conj: ["nope"] },
      { form: "gen", lesson: "l6", conj: ["decl2"] },
    ],
  };
  const s = normalizeConjugationSettings(raw)!;
  assert.equal(s.forms.length, 6, "same form + same classes only once; unknown classes drop the entry");
  assert.deepEqual(s.forms[1], { form: "pres-act-ind", conj: ["v3"], lesson: "l9" });
  const { conjugationShapeProblems } = await import("../src/lib/courseConjugation.ts");
  assert.deepEqual(conjugationShapeProblems({ code: "grc", conjugation: { forms: [{ form: "gen", conj: ["decl1-eta"] }] } }, []), []);
  assert.equal(conjugationShapeProblems({ code: "la", conjugation: { forms: [{ form: "gen", conj: ["decl1-eta"] }] } }, [])[0][0], "language.conjugation.forms[0].conj[0]");
  assert.equal(conjugationShapeProblems({ code: "la", conjugation: { forms: [{ form: "gen", conj: [] }] } }, [])[0][0], "language.conjugation.forms[0].conj");

  const { buildRound, openFormsFor, conjSummary } = await import("../src/lib/conjugation.ts");
  const regoW = la("regō", "v3", "regō, regere, rēxī, rēctum");
  const amoW = { ...la("amō", "v1", "amō, amāre, amāvī, amātum"), id: "amo" };
  const lc = {
    id: "c-la", title: "t", lessons: [{ id: "l1" }, { id: "l2" }, { id: "l9" }], vocab: [amoW, { ...regoW, id: "rego" }],
    language: { code: "la", name: "Latin", conjugation: { forms: [{ form: "pres-act-ind", lesson: "l2", conj: ["v1", "v2"] }, { form: "pres-act-ind", lesson: "l9", conj: ["v3", "v3-io", "v4"] }] } },
  } as unknown as Course;
  const prog = (done: string[]) => ({ lessonsDone: Object.fromEntries(done.map((l) => [`c-la/${l}`, "2026-01-01"])), vocab: {}, conj: {} }) as never;
  assert.deepEqual(openFormsFor(lc, prog(["l1", "l2"]), amoW), ["pres-act-ind"]);
  assert.deepEqual(openFormsFor(lc, prog(["l1", "l2"]), lc.vocab![1]), [], "the 3rd conjugation waits for its lesson");
  assert.deepEqual(openFormsFor(lc, prog(["l1", "l2", "l9"]), lc.vocab![1]), ["pres-act-ind"]);
  const summary = conjSummary(lc, prog(["l2"]));
  assert.equal(summary.length, 1, "one row per form");
  assert.equal(summary[0].open, true);
  const round = buildRound(lc, prog(["l1", "l2"]), 20);
  assert(round.length > 0 && round.every((q) => q.item.id === "amo"), "a round before lesson 9 drills only the 1st conjugation");

  // Greek 1st declension groups come from dict.
  const g1 = (term: string, dict: string, forms?: Record<string, string>) => ({ ...gr(term, "decl1", dict, forms), id: term }) as VocabItem;
  const gc1 = {
    id: "c-gr", title: "t", lessons: [], vocab: [],
    language: { code: "grc", name: "Greek", conjugation: { forms: [{ form: "gen", lesson: "l9", conj: ["decl1-eta", "decl1-alpha"] }, { form: "gen", lesson: "l10", conj: ["decl1-short", "decl1-masc"] }] } },
  } as unknown as Course;
  const gprog = (done: string[]) => ({ lessonsDone: Object.fromEntries(done.map((l) => [`c-gr/${l}`, "2026-01-01"])), vocab: {}, conj: {} }) as never;
  const at9 = gprog(["l9"]);
  assert.deepEqual(openFormsFor(gc1, at9, g1("τιμή", "τιμή, τιμῆς, ἡ")), ["gen"]);
  assert.deepEqual(openFormsFor(gc1, at9, g1("χώρα", "χώρα, χώρας, ἡ")), ["gen"]);
  assert.deepEqual(openFormsFor(gc1, at9, g1("θάλαττα", "θάλαττα, θαλάττης, ἡ")), []);
  assert.deepEqual(openFormsFor(gc1, at9, g1("μοῖρα", "μοῖρα, μοίρας, ἡ")), [], "short α shown by the accent");
  assert.deepEqual(openFormsFor(gc1, at9, g1("πολίτης", "πολίτης, πολίτου, ὁ")), []);
  assert.deepEqual(openFormsFor(gc1, gprog(["l9", "l10"]), g1("πολίτης", "πολίτης, πολίτου, ὁ")), ["gen"]);
}

console.log("conjugation-classical: ok");

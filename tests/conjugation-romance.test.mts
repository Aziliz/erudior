// Spanish and French: conjugation drills and vocabulary recall.
import assert from "node:assert/strict";
import { conjWordProblem, conjWordWarnings, promptsFor, checkConj } from "../src/lib/conjugation.ts";
import { checkRecall } from "../src/lib/vocab.ts";
import type { Course, VocabItem } from "../src/lib/types.ts";

const w = (term: string, conj: string, forms?: Record<string, string>, extra: Partial<VocabItem> = {}): VocabItem =>
  ({ id: term, lesson: "l1", term, pos: "verb", meanings: ["x"], conj, ...(forms ? { forms } : {}), ...extra }) as VocabItem;
const course = (code: string, vocab: VocabItem[]): Course =>
  ({ id: `c-${code}`, title: "t", lessons: [], vocab, language: { code, name: code, conjugation: { forms: [{ form: "present" }, { form: "perfect" }, { form: "preterite" }, { form: "imperative" }] } } }) as unknown as Course;
const answers = (code: string, item: VocabItem, form: string) => {
  const ps = promptsFor(course(code, [item]), item, form);
  return Object.fromEntries(ps.map((p) => [p.person!, p.answers[0]]));
};
const ok = (code: string, item: VocabItem, form: string, person: string, typed: string) => {
  const p = promptsFor(course(code, [item]), item, form).find((x) => x.person === person)!;
  return checkConj(p, typed, code).ok;
};

// --- Spanish ---
const hablar = w("hablar", "ar");
assert.deepEqual(answers("es", hablar, "present"), { 0: "hablo", 1: "hablas", 2: "habla", 3: "hablamos", 5: "hablan" }, "no vosotros");
assert.deepEqual(answers("es", w("comer", "er"), "preterite"), { 0: "comí", 1: "comiste", 2: "comió", 3: "comimos", 5: "comieron" });
assert.deepEqual(answers("es", w("vivir", "ir"), "perfect"), { 0: "he vivido", 1: "has vivido", 2: "ha vivido", 3: "hemos vivido", 5: "han vivido" });
assert.equal(answers("es", w("leer", "er"), "perfect")[2], "ha leído");
assert.equal(answers("es", w("hablar", "ar"), "imperative")["tú"], "habla");
assert.equal(answers("es", w("hablar", "ar"), "imperative")["usted"], "hable");
assert.equal(answers("es", w("buscar", "ar"), "imperative")["usted"], "busque");
assert.equal(answers("es", w("llegar", "ar"), "imperative")["usted"], "llegue");
assert.equal(answers("es", w("buscar", "ar"), "preterite")[0], undefined, "busqué must be given");
const tener = w("tener", "er", { present: "tengo, tienes, tiene, tenemos, tenéis, tienen", preterite: "tuve, tuviste, tuvo, tuvimos, tuvisteis, tuvieron", imperative: "ten" });
assert.equal(answers("es", tener, "present")[0], "tengo");
assert.equal(answers("es", tener, "imperative")["tú"], "ten");
assert.equal(answers("es", tener, "imperative")["usted"], "tenga");
assert.equal(answers("es", tener, "preterite")[2], "tuvo");
const pedir = w("pedir", "ir", { present: "pido, pides, pide, pedimos, pedís, piden" });
assert.equal(answers("es", pedir, "preterite")[2], undefined, "stem-changing -ir preterite isn't guessed");
const levantarse = w("levantarse", "ar");
assert.equal(answers("es", levantarse, "present")[0], "me levanto");
assert.equal(answers("es", levantarse, "perfect")[2], "se ha levantado");
assert.equal(answers("es", levantarse, "imperative")["tú"], undefined, "levántate must be given");
assert(ok("es", hablar, "present", "0", "yo hablo") && ok("es", hablar, "present", "2", "Usted habla"));
assert.equal(checkConj(promptsFor(course("es", [hablar]), hablar, "preterite").find((p) => p.person === "2")!, "hablo", "es").ok, false);
const noAccent = checkConj(promptsFor(course("es", [w("comer", "er")]), w("comer", "er"), "preterite").find((p) => p.person === "2")!, "comio", "es");
assert(!noAccent.ok && "retry" in noAccent && noAccent.retry, "a missing accent gets another try");
assert.match(conjWordProblem("es", w("conocer", "er"))!, /forms.present/);
assert.match(conjWordProblem("es", w("ir", "ir"))!, /irregular/);
assert.match(conjWordProblem("es", w("comer", "ar"))!, /not -ar/);
assert.equal(conjWordProblem("es", w("ser", "er", { present: "soy, eres, es, somos, sois, son" })), undefined);
assert(conjWordWarnings("es", w("pensar", "ar")).some((x) => /irregular/.test(x)));
assert(conjWordWarnings("es", w("escribir", "ir")).some((x) => /participle/.test(x)));

// --- French ---
const parler = w("parler", "er");
assert.deepEqual(answers("fr", parler, "present"), { 0: "parle", 1: "parles", 2: "parle", 3: "parlons", 4: "parlez", 5: "parlent" });
assert.deepEqual(answers("fr", w("finir", "ir"), "present"), { 0: "finis", 1: "finis", 2: "finit", 3: "finissons", 4: "finissez", 5: "finissent" });
assert.equal(answers("fr", w("vendre", "re"), "present")[2], "vend");
assert.equal(answers("fr", parler, "perfect")[0], "ai parlé");
assert.equal(answers("fr", w("vendre", "re"), "perfect")[2], "a vendu");
assert.deepEqual(answers("fr", parler, "imperative"), { tu: "parle", nous: "parlons", vous: "parlez" });
assert(ok("fr", w("aimer", "er"), "present", "0", "j'aime") && ok("fr", w("aimer", "er"), "present", "0", "J’aime") && ok("fr", w("aimer", "er"), "present", "0", "j' aime"));
assert(ok("fr", parler, "perfect", "0", "j'ai parlé"));
const aller = w("aller", "irr", { present: "vais, vas, va, allons, allez, vont", participle: "allé", aux: "être", imperative: "va, allons, allez" });
assert(ok("fr", aller, "perfect", "2", "elle est allée") && ok("fr", aller, "perfect", "2", "il est allé"));
assert(ok("fr", aller, "perfect", "5", "ils sont allés") && !ok("fr", aller, "perfect", "5", "ils sont allé"));
assert(ok("fr", aller, "perfect", "0", "je suis allée"));
assert.equal(answers("fr", aller, "imperative").tu, "va");
const seLever = w("se lever", "er", { present: "me lève, te lèves, se lève, nous levons, vous levez, se lèvent" });
assert.equal(answers("fr", seLever, "perfect")[2], "s'est levé");
assert.equal(answers("fr", seLever, "perfect")[0], "me suis levé");
assert.deepEqual(answers("fr", seLever, "imperative"), { tu: "lève-toi", nous: "levons-nous", vous: "levez-vous" });
const sAppeler = w("s'appeler", "er", { present: "m'appelle, t'appelles, s'appelle, nous appelons, vous appelez, s'appellent" });
assert(ok("fr", sAppeler, "present", "0", "je m'appelle"));
assert.equal(conjWordProblem("fr", sAppeler), undefined);
assert.match(conjWordProblem("fr", w("manger", "er"))!, /forms.present/);
assert.match(conjWordProblem("fr", w("acheter", "er"))!, /forms.present/);
assert.equal(conjWordProblem("fr", w("fermer", "er")), undefined, "fermer is regular");
assert.equal(conjWordProblem("fr", w("chercher", "er")), undefined, "chercher is regular");
assert.match(conjWordProblem("fr", w("faire", "irr"))!, /forms.present and forms.participle/);
assert.match(conjWordProblem("fr", w("aller", "er"))!, /irregular/);
assert(conjWordWarnings("fr", w("partir", "ir")).some((x) => /irr/.test(x)));
assert(conjWordWarnings("fr", w("arriver", "er")).some((x) => /être/.test(x)));
const payer = w("payer", "er", { present: "paie/paye, paies/payes, paie/paye, payons, payez, paient/payent" });
assert(ok("fr", payer, "present", "0", "je paie") && ok("fr", payer, "present", "0", "je paye"), "both spellings count");
assert.equal(answers("fr", payer, "present")[0], "paie");
assert(ok("fr", payer, "imperative", "tu", "paye") && ok("fr", payer, "imperative", "tu", "paie"));
assert.match(conjWordProblem("es", w("hablar", "re"))!, /isn't a Spanish verb class/);

// --- Vocabulary recall ---
const noun = (term: string, extra: Partial<VocabItem> = {}): VocabItem => ({ id: term, lesson: "l1", term, pos: "noun", meanings: ["x"], ...extra }) as VocabItem;
assert.equal(checkRecall(noun("el perro"), "el perro", "es").ok, true);
let r = checkRecall(noun("el perro"), "perro", "es");
assert(!r.ok && "retry" in r && r.retry && /article/.test(r.note), "missing Spanish article: try again");
r = checkRecall(noun("el perro"), "la perro", "es");
assert(!r.ok && !("retry" in r && r.retry) && /Wrong article/.test(r.note!), "wrong article is wrong");
r = checkRecall(noun("la canción"), "la cancion", "es");
assert(!r.ok && "retry" in r && r.retry && /accents/.test(r.note), "missing accent: try again");
r = checkRecall(noun("el niño"), "el nino", "es");
assert(!r.ok && "retry" in r && r.retry, "n for ñ: try again");
assert.equal(checkRecall({ id: "q", lesson: "l1", term: "¿Cómo estás?", meanings: ["x"] } as VocabItem, "Cómo estás", "es").ok, true, "¿ ? not needed");
assert.equal(checkRecall(noun("l'école"), "l'école", "fr").ok, true);
assert.equal(checkRecall(noun("l'école"), "l’école", "fr").ok, true);
assert.equal(checkRecall(noun("l'école"), "l' école", "fr").ok, true);
r = checkRecall(noun("l'école"), "la école", "fr");
assert(!r.ok && "retry" in r && r.retry && /l'/.test(r.note), "la école: use l'");
r = checkRecall(noun("le chien"), "la chien", "fr");
assert(!r.ok && /Wrong article/.test(r.note!));
r = checkRecall(noun("le chien"), "chien", "fr");
assert(!r.ok && "retry" in r && r.retry);
r = checkRecall(noun("la fenêtre"), "la fenetre", "fr");
assert(!r.ok && "retry" in r && r.retry && /accents/.test(r.note));
r = checkRecall(noun("le cœur"), "le coeur", "fr");
assert(!r.ok && "retry" in r && r.retry, "oe for œ: try again");
assert.equal(checkRecall(noun("le chien"), "le chat", "fr").ok, false);
assert.equal(checkRecall(noun("der Hund"), "Hund", "de").ok, false, "German unchanged");

console.log("Spanish and French conjugation and recall passed.");

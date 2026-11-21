// Conjugation drill data: the vocabulary fields and course settings, shared by course
// normalization, the canonical validator and the drill generator (lib/conjugation.ts).
// No imports, so the worker and course tools can use it without pulling in the app.
//
// Vocabulary items opt in with `conj` (the word's class) and, for German, `forms` (principal
// parts and other irregular forms the generator must not guess). Latin and Greek words also give
// `dict` (the dictionary entry their forms are made from) and may give `forms` slot tables. The
// course picks the forms it drills with `language.conjugation.forms`, each unlocked by a lesson.

/** Japanese word classes. Forms are generated from the dictionary form (`term` and `reading`). */
export const JA_CLASSES = ["godan", "ichidan", "suru", "kuru", "i-adj", "ii-adj", "na-adj"] as const;
/** German word classes. Strong, mixed and modal verbs carry their irregular forms in `forms`. */
export const DE_CLASSES = ["weak", "strong", "mixed", "modal", "adj"] as const;
/** Spanish verb classes: regular by ending; irregular forms given in `forms` (docs/COURSE_FORMAT.md). */
export const ES_CLASSES = ["ar", "er", "ir"] as const;
/** French verb classes: regular -er, finir-type -ir, vendre-type -re, and irregular (`irr`, forms given). */
export const FR_CLASSES = ["er", "ir", "re", "irr"] as const;
/** Latin classes: declensions, adjectives, pronouns (tables), conjugations; irregular verbs (`irr`). */
export const LA_CLASSES = ["decl1", "decl2", "decl3", "decl3-i", "decl4", "decl5", "adj12", "adj3", "pron", "v1", "v2", "v3", "v3-io", "v4", "irr"] as const;
/** Ancient Greek classes: declensions, adjectives, the article and pronouns (tables), ω-verbs, contract verbs, irregular verbs (`irr`, tables). */
export const GRC_CLASSES = ["decl1", "decl2", "decl3", "decl3-i", "decl3-eu", "decl3-s", "adj12", "adj3", "pron", "omega", "contract", "irr"] as const;
export type JaClass = (typeof JA_CLASSES)[number];
export type DeClass = (typeof DE_CLASSES)[number];
export type EsClass = (typeof ES_CLASSES)[number];
export type FrClass = (typeof FR_CLASSES)[number];
export type LaClass = (typeof LA_CLASSES)[number];
export type GrcClass = (typeof GRC_CLASSES)[number];
export type ConjClass = JaClass | DeClass | EsClass | FrClass | LaClass | GrcClass;
/** Every class of every language (the checker matches a class to the course's language). */
export const ALL_CLASSES: readonly string[] = [...new Set<string>([...JA_CLASSES, ...DE_CLASSES, ...ES_CLASSES, ...FR_CLASSES, ...LA_CLASSES, ...GRC_CLASSES])];

export const JA_VERB_FORMS = [
  "polite",
  "polite-negative",
  "polite-past",
  "polite-past-negative",
  "negative",
  "past",
  "past-negative",
  "te",
  "volitional",
  "potential",
  "conditional",
  "passive",
  "causative",
  "imperative",
] as const;
export const JA_ADJ_FORMS = ["adj-negative", "adj-past", "adj-past-negative", "adj-te", "adverb"] as const;
export const DE_VERB_FORMS = ["present", "preterite", "perfect", "imperative", "subjunctive"] as const;
export const DE_ADJ_FORMS = ["adj-nom", "adj-acc", "adj-dat", "adj-gen"] as const;
export const ES_VERB_FORMS = ["present", "preterite", "perfect", "imperative", "imperfect", "future", "conditional", "gerund", "subjunctive", "imperfectSubjunctive", "pluperfect", "futurePerfect", "conditionalPerfect", "perfectSubjunctive", "pluperfectSubjunctive"] as const;
export const FR_VERB_FORMS = ["present", "perfect", "imperative", "imperfect", "future", "conditional", "subjunctive", "pluperfect", "futurePerfect", "conditionalPerfect", "perfectSubjunctive"] as const;
/** Latin: noun and pronoun cases, adjective cases and comparison, verb tense-voice-mood ids. */
export const LA_CASE_FORMS = ["nom", "gen", "dat", "acc", "abl", "voc", "loc"] as const;
export const LA_ADJ_FORMS = ["adj-nom", "adj-gen", "adj-dat", "adj-acc", "adj-abl", "adj-voc", "comparative", "superlative"] as const;
export const LA_VERB_FORMS: readonly string[] = [
  ...["pres", "impf", "fut", "perf", "plpf", "futp"].flatMap((t) => [`${t}-act-ind`, `${t}-pass-ind`]),
  ...["pres", "impf", "perf", "plpf"].flatMap((t) => [`${t}-act-subj`, `${t}-pass-subj`]),
  "pres-act-imp", "pres-pass-imp", "fut-act-imp",
  "pres-act-inf", "pres-pass-inf", "perf-act-inf", "perf-pass-inf", "fut-act-inf", "fut-pass-inf",
  "pres-act-ptc", "perf-pass-ptc", "fut-act-ptc", "gerundive", "gerund",
];
/** Greek: cases, adjective cases, verb tense-voice-mood ids (mp = middle/passive). */
export const GRC_CASE_FORMS = ["nom", "gen", "dat", "acc", "voc"] as const;
export const GRC_ADJ_FORMS = ["adj-nom", "adj-gen", "adj-dat", "adj-acc", "adj-voc"] as const;
export const GRC_VERB_FORMS: readonly string[] = [
  ...["act", "mp"].flatMap((v) => ["ind", "subj", "opt", "imp", "inf", "ptc"].map((m) => `pres-${v}-${m}`)),
  "impf-act-ind", "impf-mp-ind",
  ...["act", "mid", "pass"].flatMap((v) => ["ind", "opt", "inf", "ptc"].map((m) => `fut-${v}-${m}`)),
  ...["act", "mid", "pass"].flatMap((v) => ["ind", "subj", "opt", "imp", "inf", "ptc"].map((m) => `aor-${v}-${m}`)),
  ...["act", "mp"].flatMap((v) => ["ind", "inf", "ptc"].map((m) => `perf-${v}-${m}`)),
  "plpf-act-ind", "plpf-mp-ind",
];
export const LA_FORMS: readonly string[] = [...LA_CASE_FORMS, ...LA_ADJ_FORMS, ...LA_VERB_FORMS];
export const GRC_FORMS: readonly string[] = [...GRC_CASE_FORMS, ...GRC_ADJ_FORMS, ...GRC_VERB_FORMS];
export const CONJ_FORMS: readonly string[] = [...new Set<string>([...JA_VERB_FORMS, ...JA_ADJ_FORMS, ...DE_VERB_FORMS, ...DE_ADJ_FORMS, ...ES_VERB_FORMS, ...FR_VERB_FORMS, ...LA_FORMS, ...GRC_FORMS])];
/** Latin and Greek: inflection drills with dictionary entries and slot tables. */
export const isClassical = (lang: string) => lang === "la" || lang === "grc";
/** The forms a language's courses can drill. */
export function languageForms(lang: string): readonly string[] {
  if (lang === "la") return LA_FORMS;
  if (lang === "grc") return GRC_FORMS;
  return lang === "ja" ? [...JA_VERB_FORMS, ...JA_ADJ_FORMS] : lang === "de" ? [...DE_VERB_FORMS, ...DE_ADJ_FORMS] : lang === "es" ? ES_VERB_FORMS : lang === "fr" ? FR_VERB_FORMS : [];
}
/** The classes a language's words can use. */
export function languageClasses(lang: string): readonly string[] {
  if (lang === "la") return LA_CLASSES;
  if (lang === "grc") return GRC_CLASSES;
  return lang === "ja" ? JA_CLASSES : lang === "de" ? DE_CLASSES : lang === "es" ? ES_CLASSES : lang === "fr" ? FR_CLASSES : [];
}

/**
 * German `forms` keys. Verb forms are written as in a main clause, third person singular
 * unless named otherwise, with a separable prefix at the end ("ruft an", "rief an",
 * "hat angerufen").
 */
export const DE_FORM_KEYS = [
  "present1", // ich, when irregular (bin, kann, weiß)
  "present2", // du (fährst)
  "present3", // er/sie/es (fährt)
  "present1pl", // wir and sie/Sie, when not the infinitive (sind)
  "present2pl", // ihr, when irregular (seid)
  "preterite", // er/sie/es Präteritum (fuhr, machte)
  "perfect", // er/sie/es Perfekt with its auxiliary (ist gefahren)
  "imperative", // du imperative, when not the plain stem (gib, lies, sei)
  "imperativeSie", // Sie imperative, when not "<infinitive> Sie" (seien Sie)
  "subjunctive", // er/sie/es Konjunktiv II (wäre, hätte, würde), when drilled
  "sep", // separable prefix (auf for aufmachen)
  "stem", // adjectives: the stem the endings go on, when irregular (hoh for hoch)
] as const;
export type DeFormKey = (typeof DE_FORM_KEYS)[number];
/**
 * Spanish and French `forms` keys. Tables are six comma-separated persons (es: yo, tú, él,
 * nosotros, vosotros, ellos; fr: je, tu, il, nous, vous, ils), verb only.
 */
export const ROMANCE_FORM_KEYS = [
  "present", // six-person present table, when any person is irregular
  "preterite", // es: six-person pretérito indefinido table, when irregular or spelled differently
  "participle", // past participle, when irregular (hecho; fait, pris)
  "imperative", // es: tú affirmative (ten); fr: tu, nous, vous (sois, soyons, soyez)
  "imperativeUsted", // es: usted affirmative, when not from the yo present (sea, vaya)
  "aux", // fr: "être" for verbs conjugated with être
  "imperfect", // es: six-person imperfect table (ser, ir, ver)
  "futureStem", // irregular future/conditional stem (tendr; ser, aur)
  "gerund", // es: irregular gerund (durmiendo, diciendo)
  "imperfectStem", // fr: être only (ét)
  "subjunctive", // six-person present subjunctive table, when irregular
  "agreement", // fr: "none" for pronominal verbs whose se is indirect (se parler: ils se sont parlé)
] as const;
export type RomanceFormKey = (typeof ROMANCE_FORM_KEYS)[number];
export const FORM_KEYS: readonly string[] = [...new Set<string>([...DE_FORM_KEYS, ...ROMANCE_FORM_KEYS])];
/**
 * Latin and Greek `forms` keys are slots or rows of slots ("pl.gen", "sg", "pres-act-ind",
 * "perf-pass-ptc.m"), checked against the word's class by the generator, plus the Greek
 * quantity hints `long` and `short`.
 */
export const CLASSICAL_FORM_KEY = /^[a-z0-9]+(?:[.-][a-z0-9]+)*$/;
/** The `forms` keys a language's words can use (Latin and Greek: slots of the word's class, checked by the generator). */
export function languageFormKeys(lang: string): readonly string[] {
  return lang === "es" || lang === "fr" ? ROMANCE_FORM_KEYS : DE_FORM_KEYS;
}
export type DeForms = Partial<Record<DeFormKey | RomanceFormKey, string>>;
/** A word's `forms`: the German/Romance keys, or Latin/Greek slot tables. */
export type WordForms = DeForms & { [key: string]: string | undefined };

/** Greek 1st-declension groups, from the word's dict: -η, long -ᾱ, short -ᾰ, masculine -ης/-ᾱς. */
export const GRC_DECL1_GROUPS = ["decl1-eta", "decl1-alpha", "decl1-short", "decl1-masc"] as const;
/** What a `language.conjugation.forms` entry's `conj` may name: the language's classes (Greek: and the 1st-declension groups). */
export function settingClasses(lang: string): readonly string[] {
  return lang === "grc" ? [...GRC_CLASSES, ...GRC_DECL1_GROUPS] : languageClasses(lang);
}
const SETTING_CLASSES: readonly string[] = [...ALL_CLASSES, ...GRC_DECL1_GROUPS];

export interface ConjugationFormSetting {
  /** A form id from CONJ_FORMS. */
  form: string;
  /** The word classes this entry applies to (none: every class). The same form may have several entries. */
  conj?: string[];
  /** The lesson that teaches it; the form joins drills when that lesson is done. None: always on. */
  lesson?: string;
  /** The earlier course the lesson is in (as on carried-over vocabulary). */
  from?: string;
}

export interface ConjugationSettings {
  /** The forms drilled, in teaching order. */
  forms: ConjugationFormSetting[];
  /** Prompts per round (default 10). */
  round?: number;
}

const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);
const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const ID = /^[A-Za-z0-9_-]+$/;

/** Course setting from raw JSON: unknown forms and repeats dropped. Undefined when nothing's left. */
export function normalizeConjugationSettings(raw: unknown): ConjugationSettings | undefined {
  if (!isObj(raw) || !Array.isArray(raw.forms)) return undefined;
  const seen = new Set<string>();
  const forms: ConjugationFormSetting[] = [];
  for (const f of raw.forms) {
    if (!isObj(f)) continue;
    const form = str(f.form);
    let conj: string[] | undefined;
    if (Array.isArray(f.conj)) {
      conj = [...new Set(f.conj.map(str).filter((c) => SETTING_CLASSES.includes(c)))];
      // Classes given but none known: drop the entry rather than open the form for every class.
      if (!conj.length) continue;
    }
    const key = `${form}|${conj ? [...conj].sort().join(",") : "*"}`;
    if (!CONJ_FORMS.includes(form) || seen.has(key)) continue;
    seen.add(key);
    const lesson = str(f.lesson);
    const from = str(f.from);
    forms.push({ form, ...(conj ? { conj } : {}), ...(lesson ? { lesson } : {}), ...(from && ID.test(from) ? { from } : {}) });
  }
  if (!forms.length) return undefined;
  const round = Number(raw.round);
  return { forms, ...(Number.isInteger(round) && round >= 1 && round <= 100 ? { round } : {}) };
}

/** A vocabulary item's conjugation fields from raw JSON (only known classes and keys). */
export function normalizeConjFields(v: Record<string, unknown>): { conj?: ConjClass; forms?: WordForms; noForms?: string[] } {
  const out: { conj?: ConjClass; forms?: WordForms; noForms?: string[] } = {};
  const conj = str(v.conj);
  if (ALL_CLASSES.includes(conj)) out.conj = conj as ConjClass;
  if (isObj(v.forms)) {
    const forms: WordForms = {};
    for (const k of FORM_KEYS) if (str(v.forms[k])) forms[k as keyof DeForms] = str(v.forms[k]);
    // Latin and Greek slot tables (the generator checks the keys against the word's class).
    for (const [k, x] of Object.entries(v.forms)) if (!FORM_KEYS.includes(k) && CLASSICAL_FORM_KEY.test(k) && str(x)) forms[k] = str(x).normalize("NFC");
    if (Object.keys(forms).length) out.forms = forms;
  }
  if (Array.isArray(v.noForms)) {
    const no = v.noForms.filter((f): f is string => typeof f === "string" && CONJ_FORMS.includes(f));
    if (no.length) out.noForms = [...new Set(no)];
  }
  return out;
}

/** Shape problems for the canonical validator ([path, message] pairs). */
export function conjugationShapeProblems(language: Record<string, unknown> | undefined, vocab: unknown[]): [string, string][] {
  const out: [string, string][] = [];
  const c = language?.conjugation;
  if (c !== undefined) {
    if (!isObj(c) || !Array.isArray(c.forms)) out.push(["language.conjugation", "needs a forms array"]);
    else {
      for (const k of Object.keys(c)) if (k !== "forms" && k !== "round") out.push([`language.conjugation.${k}`, "unsupported or authority/runtime field"]);
      if (c.round !== undefined && (typeof c.round !== "number" || !Number.isInteger(c.round) || c.round < 1 || c.round > 100))
        out.push(["language.conjugation.round", "must be an integer from 1 to 100"]);
      c.forms.forEach((f, i) => {
        const p = `language.conjugation.forms[${i}]`;
        if (!isObj(f)) return out.push([p, "must be an object"]);
        for (const k of Object.keys(f)) if (!["form", "lesson", "from", "conj"].includes(k)) out.push([`${p}.${k}`, "unsupported or authority/runtime field"]);
        if (f.conj !== undefined) {
          const known = settingClasses(String(language?.code ?? ""));
          if (!Array.isArray(f.conj) || !f.conj.length) out.push([`${p}.conj`, "must be a non-empty list of word classes"]);
          else f.conj.forEach((x, j) => {
            if (typeof x !== "string" || !known.includes(x)) out.push([`${p}.conj[${j}]`, "unknown word class for this language"]);
          });
        }
        if (typeof f.form !== "string" || !CONJ_FORMS.includes(f.form)) out.push([`${p}.form`, "unknown conjugation form"]);
        for (const k of ["lesson", "from"]) if (f[k] !== undefined && (typeof f[k] !== "string" || !ID.test(f[k] as string))) out.push([`${p}.${k}`, "invalid stable ID"]);
      });
    }
  }
  vocab.forEach((v, i) => {
    if (!isObj(v)) return;
    const p = `vocab[${i}]`;
    if (v.conj !== undefined && (typeof v.conj !== "string" || !ALL_CLASSES.includes(v.conj)))
      out.push([`${p}.conj`, "unknown conjugation class"]);
    if (v.noForms !== undefined) {
      if (!Array.isArray(v.noForms) || !v.noForms.length) out.push([`${p}.noForms`, "must be a non-empty list of forms"]);
      else v.noForms.forEach((f, j) => {
        if (typeof f !== "string" || !CONJ_FORMS.includes(f)) out.push([`${p}.noForms[${j}]`, "unknown conjugation form"]);
      });
    }
    if (v.forms !== undefined) {
      if (!isObj(v.forms)) out.push([`${p}.forms`, "must be an object"]);
      else
        for (const [k, x] of Object.entries(v.forms)) {
          if (!FORM_KEYS.includes(k) && !(isClassical(String(language?.code ?? "")) && CLASSICAL_FORM_KEY.test(k))) out.push([`${p}.forms.${k}`, "unsupported or authority/runtime field"]);
          else if (typeof x !== "string" || !x.trim()) out.push([`${p}.forms.${k}`, "must be non-empty text"]);
        }
    }
  });
  return out;
}

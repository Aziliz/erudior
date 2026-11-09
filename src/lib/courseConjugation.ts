// Conjugation drill data: the vocabulary fields and course settings, shared by course
// normalization, the canonical validator and the drill generator (lib/conjugation.ts).
// No imports, so the worker and course tools can use it without pulling in the app.
//
// Vocabulary items opt in with `conj` (the word's class) and, for German, `forms` (principal
// parts and other irregular forms the generator must not guess). The course picks the forms it
// drills with `language.conjugation.forms`, each unlocked by a lesson.

/** Japanese word classes. Forms are generated from the dictionary form (`term` and `reading`). */
export const JA_CLASSES = ["godan", "ichidan", "suru", "kuru", "i-adj", "ii-adj", "na-adj"] as const;
/** German word classes. Strong, mixed and modal verbs carry their irregular forms in `forms`. */
export const DE_CLASSES = ["weak", "strong", "mixed", "modal", "adj"] as const;
export type JaClass = (typeof JA_CLASSES)[number];
export type DeClass = (typeof DE_CLASSES)[number];
export type ConjClass = JaClass | DeClass;

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
export const CONJ_FORMS: readonly string[] = [...new Set<string>([...JA_VERB_FORMS, ...JA_ADJ_FORMS, ...DE_VERB_FORMS, ...DE_ADJ_FORMS])];

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
export type DeForms = Partial<Record<DeFormKey, string>>;

export interface ConjugationFormSetting {
  /** A form id from CONJ_FORMS. */
  form: string;
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
    if (!CONJ_FORMS.includes(form) || seen.has(form)) continue;
    seen.add(form);
    const lesson = str(f.lesson);
    const from = str(f.from);
    forms.push({ form, ...(lesson ? { lesson } : {}), ...(from && ID.test(from) ? { from } : {}) });
  }
  if (!forms.length) return undefined;
  const round = Number(raw.round);
  return { forms, ...(Number.isInteger(round) && round >= 1 && round <= 100 ? { round } : {}) };
}

/** A vocabulary item's conjugation fields from raw JSON (only known classes and keys). */
export function normalizeConjFields(v: Record<string, unknown>): { conj?: ConjClass; forms?: DeForms } {
  const out: { conj?: ConjClass; forms?: DeForms } = {};
  const conj = str(v.conj);
  if ((JA_CLASSES as readonly string[]).includes(conj) || (DE_CLASSES as readonly string[]).includes(conj)) out.conj = conj as ConjClass;
  if (isObj(v.forms)) {
    const forms: DeForms = {};
    for (const k of DE_FORM_KEYS) if (str(v.forms[k])) forms[k] = str(v.forms[k]);
    if (Object.keys(forms).length) out.forms = forms;
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
        for (const k of Object.keys(f)) if (!["form", "lesson", "from"].includes(k)) out.push([`${p}.${k}`, "unsupported or authority/runtime field"]);
        if (typeof f.form !== "string" || !CONJ_FORMS.includes(f.form)) out.push([`${p}.form`, "unknown conjugation form"]);
        for (const k of ["lesson", "from"]) if (f[k] !== undefined && (typeof f[k] !== "string" || !ID.test(f[k] as string))) out.push([`${p}.${k}`, "invalid stable ID"]);
      });
    }
  }
  vocab.forEach((v, i) => {
    if (!isObj(v)) return;
    const p = `vocab[${i}]`;
    if (v.conj !== undefined && (typeof v.conj !== "string" || ![...JA_CLASSES, ...DE_CLASSES].includes(v.conj as never)))
      out.push([`${p}.conj`, "unknown conjugation class"]);
    if (v.forms !== undefined) {
      if (!isObj(v.forms)) out.push([`${p}.forms`, "must be an object"]);
      else
        for (const [k, x] of Object.entries(v.forms)) {
          if (!(DE_FORM_KEYS as readonly string[]).includes(k)) out.push([`${p}.forms.${k}`, "unsupported or authority/runtime field"]);
          else if (typeof x !== "string" || !x.trim()) out.push([`${p}.forms.${k}`, "must be non-empty text"]);
        }
    }
  });
  return out;
}

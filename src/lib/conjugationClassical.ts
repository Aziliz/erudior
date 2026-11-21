// Latin and Ancient Greek inflection drills: what the two generators share. Every form of a
// word is a "slot" with a dotted id ("pl.gen", "sg.nom.f", "perf-act-ind.3pl", "aor-act-inf");
// a course drills "forms" (case or tense-voice-mood ids) and each prompt is one slot. Words
// opt in with `conj` (their class) and `dict` (the dictionary entry the forms are made from);
// `forms` tables give irregular words and override single cells.
// Data format: docs/COURSE_FORMAT.md, "Latin and Greek inflection".

import type { VocabItem } from "./types";

/** One generated (or given) form. */
export interface Cell {
  /** The usual form first, then other forms that are also standard (shown as "also right"). */
  forms: string[];
  /** Further accepted answers not worth showing (gender variants of amātus est, movable ν). */
  extra?: string[];
  /** One line: how the form is made. */
  rule: string;
}
export type Cells = Map<string, Cell>;

export type WordKind = "noun" | "adj" | "pron" | "verb";

export interface ClassicalWord {
  kind: WordKind;
  /** Every slot the word's class has, in table order. */
  slots: string[];
  /** Slots drilled only when the data gives them (the locative). */
  optional: Set<string>;
  /** The forms that exist. A slot missing here can't be generated: its table must give it. */
  cells: Cells;
  /** Latin deponents and fīō: active-meaning forms are drilled under the active ids. */
  deponent?: boolean;
  /** Why some slots can't be generated (shown by the checker), by slot prefix. */
  missing: Map<string, string>;
}

export const PERSONS = ["1sg", "2sg", "3sg", "1pl", "2pl", "3pl"] as const;
export const IMP_LA = ["2sg", "2pl"] as const;
export const IMP_FUT_LA = ["2sg", "3sg", "2pl", "3pl"] as const;
export const IMP_GRC = ["2sg", "3sg", "2pl", "3pl"] as const;
export const GENDERS = ["m", "f", "n"] as const;
export const NUMBERS = ["sg", "pl"] as const;
export const LA_CASES = ["nom", "gen", "dat", "acc", "abl", "voc"] as const;
export const GRC_CASES = ["nom", "gen", "dat", "acc", "voc"] as const;
export const GERUND_CASES = ["gen", "dat", "acc", "abl"] as const;

/** `forms` keys that aren't table rows: quantity hints (Greek) and the Greek prefix. */
export const HINT_KEYS = ["long", "short", "prefix"] as const;

export const nfc = (s: string) => s.normalize("NFC").trim();

/** Noun slots ("sg.nom" …) for a case list, plus the optional locative. */
export function nounSlots(cases: readonly string[], loc: boolean): string[] {
  const out: string[] = [];
  for (const n of NUMBERS) for (const c of cases) out.push(`${n}.${c}`);
  if (loc) out.push("sg.loc", "pl.loc");
  return out;
}

/** Adjective slots ("sg.nom.m" …). */
export function adjSlots(cases: readonly string[]): string[] {
  const out: string[] = [];
  for (const n of NUMBERS) for (const c of cases) for (const g of GENDERS) out.push(`${n}.${c}.${g}`);
  return out;
}

/** The slots a drilled form covers for this word. */
export function slotsOfForm(w: ClassicalWord, form: string): string[] {
  if (w.kind === "noun" || w.kind === "pron") return w.slots.filter((s) => s.split(".")[1] === form);
  if (w.kind === "adj") {
    if (form.startsWith("adj-")) return w.slots.filter((s) => s.split(".")[1] === form.slice(4));
    return w.slots.filter((s) => s.split(".")[0] === form);
  }
  return w.slots.filter((s) => s === form || s.startsWith(form + "."));
}

/** The form ids a word's slots belong to, in slot order. */
export function formsOfWord(w: ClassicalWord): string[] {
  const out = new Set<string>();
  for (const s of w.slots) {
    const parts = s.split(".");
    if (w.kind === "noun" || w.kind === "pron") out.add(parts[1]);
    else if (w.kind === "adj") out.add(parts.length === 3 ? `adj-${parts[1]}` : parts[0]);
    else out.add(parts[0]);
  }
  return [...out];
}

// ---------------------------------------------------------------------------------------------
// Tables

/** "a/b" → ["a", "b"]; "—" or "-" → [] (the word has no such form). */
export function cellForms(text: string): string[] {
  const t = nfc(text);
  if (t === "—" || t === "-" || t === "–") return [];
  return t.split("/").map(nfc).filter(Boolean);
}

/**
 * Lay a word's `forms` table over its generated cells. A key is a slot ("pl.gen") or a row
 * ("pl", "pres-act-ind", "sg.nom"): its value lists every slot under it, comma-separated, in
 * table order. Longer keys win over the rows they're in. Returns problems ([] when fine).
 */
export function applyTable(w: ClassicalWord, forms: Record<string, string | undefined> | undefined, term: string, extraKeys: readonly string[] = HINT_KEYS): string[] {
  const problems: string[] = [];
  if (!forms) return problems;
  const keys = Object.keys(forms).filter((k) => !extraKeys.includes(k) && typeof forms[k] === "string");
  keys.sort((a, b) => a.split(".").length - b.split(".").length || a.length - b.length);
  for (const key of keys) {
    let under = w.slots.filter((s) => s === key || s.startsWith(key + "."));
    if (!under.length) {
      problems.push(`unknown forms.${key} (a slot such as ${w.slots[0]}, or a row such as ${w.slots[0].split(".")[0]}; see docs/COURSE_FORMAT.md)`);
      continue;
    }
    const cells = forms[key]!.split(",").map((x) => x.trim());
    // A row of a noun's cases leaves out the locative (given as "sg.loc"); a pronoun's may leave out the vocative.
    if (cells.length !== under.length && under.some((s) => s.split(".")[1] === "loc")) under = under.filter((s) => s.split(".")[1] !== "loc");
    if (cells.length !== under.length && w.kind === "pron") {
      const noVoc = under.filter((s) => s.split(".")[1] !== "voc");
      if (cells.length === noVoc.length) under = noVoc;
    }
    if (cells.length !== under.length) {
      problems.push(`forms.${key} needs ${under.length} comma-separated forms (${under.join(", ")}), not ${cells.length}`);
      continue;
    }
    under.forEach((slot, i) => {
      if (!cells[i]) return problems.push(`forms.${key}: form ${i + 1} (${slot}) is empty; write — for a form the word doesn't have`);
      const f = cellForms(cells[i]);
      if (!f.length) {
        w.cells.delete(slot);
        w.optional.add(slot);
        w.missing.delete(slot);
        return;
      }
      w.cells.set(slot, { forms: f, rule: `${term}: ${slotLabel(slot, w)} is ${f.join(" or ")} (from its table)` });
      w.optional.delete(slot);
    });
  }
  return problems;
}

/** Slots of a drilled form that neither generate nor come from the table. */
export function missingSlots(w: ClassicalWord, form: string): string[] {
  return slotsOfForm(w, form).filter((s) => !w.cells.has(s) && !w.optional.has(s));
}

/** The reason a slot can't be generated, if the generator gave one. */
export function missingReason(w: ClassicalWord, slot: string): string | undefined {
  for (const [k, why] of w.missing) if (slot.startsWith(k)) return why;
  return undefined;
}

// ---------------------------------------------------------------------------------------------
// Names

export const CASE_NAME: Record<string, string> = { nom: "nominative", gen: "genitive", dat: "dative", acc: "accusative", abl: "ablative", voc: "vocative", loc: "locative" };
const NUMBER_NAME: Record<string, string> = { sg: "singular", pl: "plural" };
const GENDER_NAME: Record<string, string> = { m: "masculine", f: "feminine", n: "neuter" };
const TENSE_NAME: Record<string, string> = { pres: "present", impf: "imperfect", fut: "future", perf: "perfect", plpf: "pluperfect", futp: "future perfect", aor: "aorist" };
const VOICE_NAME: Record<string, string> = { act: "active", pass: "passive", mid: "middle", mp: "middle/passive" };
const MOOD_NAME: Record<string, string> = { ind: "indicative", subj: "subjunctive", opt: "optative", imp: "imperative", inf: "infinitive", ptc: "participle" };
export const PERSON_NAME: Record<string, string> = {
  "1sg": "1st person singular",
  "2sg": "2nd person singular",
  "3sg": "3rd person singular",
  "1pl": "1st person plural",
  "2pl": "2nd person plural",
  "3pl": "3rd person plural",
};

/** A verb form id in words: "perf-act-ind" → "perfect active indicative". Deponents drop "active". */
export function verbFormName(form: string, deponent = false): string {
  if (form === "gerund") return "gerund";
  if (form === "gerundive") return "gerundive";
  const [t, v, m] = form.split("-");
  if (!TENSE_NAME[t] || !VOICE_NAME[v] || !MOOD_NAME[m]) return form;
  const voice = deponent && v === "act" && m !== "ptc" ? "" : ` ${VOICE_NAME[v]}`;
  return `${TENSE_NAME[t]}${voice} ${MOOD_NAME[m]}`;
}

/** A form id for lists and progress: "genitive", "adjectives: dative", "aorist middle optative". */
export function classicalFormName(form: string): string {
  if (CASE_NAME[form]) return CASE_NAME[form];
  if (form.startsWith("adj-") && CASE_NAME[form.slice(4)]) return `adjectives: ${CASE_NAME[form.slice(4)]}`;
  if (form === "comparative" || form === "superlative") return `adjectives: ${form}`;
  return verbFormName(form);
}

/** One slot in words, e.g. "genitive plural", "3rd person plural, perfect active indicative". */
export function slotLabel(slot: string, w: Pick<ClassicalWord, "kind" | "deponent">): string {
  const p = slot.split(".");
  if (w.kind === "noun" || w.kind === "pron") {
    const base = `${CASE_NAME[p[1]]} ${NUMBER_NAME[p[0]]}`;
    return p[2] ? `${base}, ${GENDER_NAME[p[2]]}` : base;
  }
  if (w.kind === "adj") {
    if (p.length === 3) return `${CASE_NAME[p[1]]} ${NUMBER_NAME[p[0]]}, ${GENDER_NAME[p[2]]}`;
    return `${p[0]}, ${GENDER_NAME[p[1]]}`;
  }
  const name = verbFormName(p[0], w.deponent);
  if (p.length === 1) return name;
  if (GENDER_NAME[p[1]]) return `${name}, ${GENDER_NAME[p[1]]}`;
  if (CASE_NAME[p[1]]) return `${name}, ${CASE_NAME[p[1]]}`;
  return `${PERSON_NAME[p[1]] ?? p[1]}, ${name}`;
}

/** A word's dictionary entry split at commas (empty parts dropped). */
export function dictParts(item: VocabItem): string[] {
  return (item.dict ?? "").split(",").map(nfc).filter(Boolean);
}

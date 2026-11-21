// Latin inflection: nouns, adjectives and verbs generated from the dictionary entry (`dict`)
// and class (`conj`), with macrons. Irregular words come from built-in tables (sum, possum, eō,
// ferō, volō, nōlō, mālō, fīō; deus, domus, vīs…) or the word's own `forms` table. A word the
// rules can't settle is refused, never guessed. Paradigms follow Allen & Greenough.
// Data format: docs/COURSE_FORMAT.md, "Latin and Greek inflection".

import type { VocabItem } from "./types";
import {
  GERUND_CASES,
  GENDERS,
  IMP_FUT_LA,
  IMP_LA,
  LA_CASES,
  PERSONS,
  adjSlots,
  applyTable,
  dictParts,
  nfc,
  nounSlots,
  type Cell,
  type ClassicalWord,
} from "./conjugationClassical";

export const LA_NOUN_CLASSES = ["decl1", "decl2", "decl3", "decl3-i", "decl4", "decl5"];
export const LA_ADJ_CLASSES = ["adj12", "adj3"];
export const LA_VERB_CLASSES = ["v1", "v2", "v3", "v3-io", "v4", "irr"];

const cell = (forms: string | string[], rule: string, extra?: string[]): Cell => {
  const f = (Array.isArray(forms) ? forms : forms.split("/")).map(nfc).filter(Boolean);
  return { forms: [...new Set(f)], rule, ...(extra?.length ? { extra } : {}) };
};

/** Gender from a dict token ("m.", "f.", "n.", "c.", "m./f.") or the `gender` field. */
function genderOf(token: string | undefined, field: string | undefined): string | undefined {
  const t = (token ?? field ?? "").toLowerCase().replace(/\s+/g, "").replace(/\.$/, "");
  if (/^(m|masc|masculine)$/.test(t)) return "m";
  if (/^(f|fem|feminine)$/.test(t)) return "f";
  if (/^(n|neut|neuter)$/.test(t)) return "n";
  if (/^(c|common|m\.?\/f|m\.?andf|f\.?\/m)$/.test(t)) return "c";
  return undefined;
}
const GENDER_TOKEN = /^(m|f|n|c|masc|fem|neut|m\.\/f|f\.\/m|m\. ?and f)\.?$/i;

// ---------------------------------------------------------------------------------------------
// Nouns

interface NounData {
  cls: string;
  nom: string;
  gen: string;
  gender: string;
}

/** Expand an abbreviated genitive ("puella, -ae") or return it unchanged. */
function fullGenitive(cls: string, nom: string, gen: string): string | undefined {
  if (!gen.startsWith("-")) return gen;
  const a = gen.slice(1);
  if (cls === "decl1" && a === "ae" && nom.endsWith("a")) return nom.slice(0, -1) + "ae";
  if (cls === "decl2") {
    if ((a === "ī" || a === "iī") && /(us|um)$/.test(nom)) return nom.slice(0, -2) + (a === "iī" && !/i(us|um)$/.test(nom) ? "iī" : a);
    if (a === "ī" && /(er|ir)$/.test(nom)) return nom + "ī";
  }
  if (cls === "decl3" || cls === "decl3-i") {
    if (a === "is" && /(is|ēs)$/.test(nom)) return nom.slice(0, -2) + "is";
    if (a === "is" && /e$/.test(nom)) return nom.slice(0, -1) + "is";
    return undefined;
  }
  if (cls === "decl4" && a === "ūs") return /us$/.test(nom) ? nom.slice(0, -2) + "ūs" : /ū$/.test(nom) ? nom.slice(0, -1) + "ūs" : undefined;
  if (cls === "decl5" && (a === "ēī" || a === "eī") && nom.endsWith("ēs")) return nom.slice(0, -2) + a;
  // "ager, -grī": the ending replaces the nominative from the last occurrence of its first letter.
  const k = nom.lastIndexOf(a[0]);
  return k > 0 ? nom.slice(0, k) + a : undefined;
}

const GEN_ENDING: Record<string, RegExp> = { decl1: /ae$/, decl2: /ī$/, decl3: /is$/, "decl3-i": /is$/, decl4: /ūs$/, decl5: /[eē]ī$/ };
const GEN_NAME: Record<string, string> = { decl1: "-ae", decl2: "-ī", decl3: "-is", "decl3-i": "-is", decl4: "-ūs", decl5: "-ēī or -eī" };
const DECL_NAME: Record<string, string> = { decl1: "1st declension", decl2: "2nd declension", decl3: "3rd declension", "decl3-i": "3rd declension i-stem", decl4: "4th declension", decl5: "5th declension" };

function laNounData(item: VocabItem): NounData | string {
  const cls = item.conj ?? "";
  const parts = dictParts(item);
  if (!item.dict) return `give "dict", the dictionary entry: nominative, genitive and gender ("rēx, rēgis, m.")`;
  if (parts.length < 2) return `dict "${item.dict}" needs the nominative and genitive ("rēx, rēgis, m.")`;
  const [nom, genRaw, gTok] = parts;
  if (nfc(item.term) !== nom) return `the term "${item.term}" should be the nominative in dict ("${nom}")`;
  const gen = fullGenitive(cls, nom, genRaw);
  if (!gen) return `can't expand the genitive "${genRaw}": write it in full ("corpus, corporis, n.")`;
  if (!GEN_ENDING[cls].test(gen)) return `the genitive "${gen}" doesn't fit ${DECL_NAME[cls]} (${GEN_NAME[cls]})`;
  const gender = genderOf(gTok && GENDER_TOKEN.test(gTok) ? gTok : undefined, item.gender);
  if (gTok && !GENDER_TOKEN.test(gTok)) return `dict "${item.dict}": "${gTok}" isn't a gender (m., f., n. or c.)`;
  if (gTok && item.gender && genderOf(gTok, undefined) !== genderOf(undefined, item.gender)) return `dict gives the gender ${gTok} but "gender" is "${item.gender}"`;
  if (!gender) return `give the gender: "m.", "f.", "n." or "c." at the end of dict ("${nom}, ${gen}, m.")`;
  return { cls, nom, gen, gender };
}

/** The six-case singular and plural endings (nominative and vocative singular aside). */
function laNounCells(d: NounData, w: ClassicalWord): string | undefined {
  const { cls, nom, gen, gender } = d;
  const n = gender === "n";
  const set = (slot: string, forms: string | string[], rule: string) => w.cells.set(slot, cell(forms, rule));
  const decl = DECL_NAME[cls];
  const row = (stem: string, num: "sg" | "pl", ends: (string | null)[], what = decl) =>
    LA_CASES.forEach((c, i) => {
      const e = ends[i];
      if (e === null) return;
      set(`${num}.${c}`, e.split("/").map((x) => stem + x), `${what}: stem ${stem}- + -${e.split("/").join(" or -")}`);
    });
  const nomRule = "the nominative, as in the dictionary entry";
  set("sg.nom", nom, nomRule);
  switch (cls) {
    case "decl1": {
      if (!nom.endsWith("a")) return `1st declension nouns end in -a ("${nom}"): Greek-type nouns need a table`;
      const s = gen.slice(0, -2);
      row(s, "sg", [null, "ae", "ae", "am", "ā", "a"]);
      row(s, "pl", ["ae", "ārum", "īs", "ās", "īs", "ae"]);
      return;
    }
    case "decl2": {
      const ius = /i(us|um)$/.test(nom);
      const s = ius ? nom.slice(0, -2) : gen.slice(0, -1);
      if (n) {
        if (!nom.endsWith("um")) return `2nd declension neuters end in -um ("${nom}"); neuters in -us (vulgus, vīrus) need a table`;
        row(s, "sg", [null, "ī", "ō", "um", "ō", "um"]);
        row(s, "pl", ["a", "ōrum", "īs", "a", "īs", "a"]);
      } else {
        if (nom.endsWith("um")) return `"${nom}" ends in -um: give the gender n.`;
        if (!/(us|er|ir)$/.test(nom)) return `2nd declension masculines and feminines end in -us, -er or -ir ("${nom}")`;
        row(s, "sg", [null, "ī", "ō", "um", "ō", null]);
        row(s, "pl", ["ī", "ōrum", "īs", "ōs", "īs", "ī"]);
        if (nom.endsWith("us")) {
          if (ius) set("sg.voc", s.slice(0, -1) + "ī", `Nouns in -ius have the vocative in -ī (fīlī, Vergilī)`);
          else set("sg.voc", s + "e", `${decl}: nouns in -us have the vocative in -e`);
        } else set("sg.voc", nom, `${decl}: the vocative of -er/-ir nouns is the nominative`);
      }
      // -ius/-ium: genitive in -ī (older) or -iī; both accepted, the dictionary's first.
      if (ius) {
        const other = gen.endsWith("iī") ? s.slice(0, -1) + "ī" : s + "ī";
        set("sg.gen", [gen, other], `Nouns in -ius/-ium have the genitive in -iī or (older) -ī: ${gen}, ${other}`);
      }
      return;
    }
    case "decl3":
    case "decl3-i": {
      const s = gen.slice(0, -2);
      const i = cls === "decl3-i";
      const what = i ? "3rd declension i-stem" : "3rd declension";
      if (n) {
        if (i && !/(e|al|ar)$/.test(nom)) return `neuter i-stems end in -e, -al or -ar ("${nom}")`;
        row(s, "sg", [null, "is", "ī", null, i ? "ī" : "e", null], what);
        set("sg.acc", nom, `Neuters: the accusative is the nominative`);
        set("sg.voc", nom, `the vocative is the nominative`);
        row(s, "pl", i ? ["ia", "ium", "ibus", "ia", "ibus", "ia"] : ["a", "um", "ibus", "a", "ibus", "a"], what);
      } else {
        row(s, "sg", [null, "is", "ī", "em", "e", null], what);
        set("sg.voc", nom, `the vocative is the nominative`);
        row(s, "pl", i ? ["ēs", "ium", "ibus", "ēs/īs", "ibus", "ēs"] : ["ēs", "um", "ibus", "ēs", "ibus", "ēs"], what);
      }
      return;
    }
    case "decl4": {
      const s = gen.slice(0, -2);
      if (n) {
        if (!nom.endsWith("ū")) return `4th declension neuters end in -ū ("${nom}")`;
        row(s, "sg", [null, "ūs", "ū", "ū", "ū", "ū"]);
        row(s, "pl", ["ua", "uum", "ibus", "ua", "ibus", "ua"]);
      } else {
        if (!nom.endsWith("us")) return `4th declension masculines and feminines end in -us ("${nom}")`;
        row(s, "sg", [null, "ūs", "uī", "um", "ū", "us"]);
        row(s, "pl", ["ūs", "uum", "ibus", "ūs", "ibus", "ūs"]);
      }
      return;
    }
    case "decl5": {
      if (!nom.endsWith("ēs")) return `5th declension nouns end in -ēs ("${nom}")`;
      const s = nom.slice(0, -2);
      const g = gen.slice(s.length);
      row(s, "sg", [null, g, g, "em", "ē", "ēs"]);
      row(s, "pl", ["ēs", "ērum", "ēbus", "ēs", "ēbus", "ēs"]);
      return;
    }
  }
  return `"${cls}" isn't a Latin noun class`;
}

/** Built-in tables and corrections for common irregular nouns (A&G 49 g, 79, 93). */
const LA_NOUN_TABLES: Record<string, { dict: RegExp; forms: Record<string, string>; note: string }> = {
  deus: {
    dict: /^deus\b/,
    forms: { "sg.voc": "deus", "pl.nom": "deī/diī/dī", "pl.gen": "deōrum/deum", "pl.dat": "deīs/diīs/dīs", "pl.abl": "deīs/diīs/dīs", "pl.voc": "deī/diī/dī" },
    note: "deus is irregular: vocative deus, plural deī/diī/dī (A&G 49 g)",
  },
  domus: {
    dict: /^domus\b/,
    forms: { sg: "domus, domūs, domuī/domō, domum, domō/domū, domus", pl: "domūs, domuum/domōrum, domibus, domōs/domūs, domibus, domūs", "sg.loc": "domī" },
    note: "domus mixes the 4th and 2nd declensions; locative domī (A&G 93)",
  },
  vīs: {
    dict: /^vīs\b/,
    forms: { sg: "vīs, vīs, vī, vim, vī, vīs", pl: "vīrēs, vīrium, vīribus, vīrēs/vīrīs, vīribus, vīrēs" },
    note: "vīs is irregular: plural vīrēs (A&G 79)",
  },
  mare: {
    dict: /^mare\b/,
    forms: { "sg.abl": "marī/mare", "pl.gen": "—" },
    note: "mare: ablative marī (rarely mare); the genitive plural is wanting (A&G 76, 78)",
  },
};

function laNoun(item: VocabItem): ClassicalWord | string {
  const w: ClassicalWord = { kind: "noun", slots: nounSlots(LA_CASES, true), optional: new Set(["sg.loc", "pl.loc"]), cells: new Map(), missing: new Map() };
  const builtin = LA_NOUN_TABLES[nfc(item.term)];
  const full = builtin && builtin.forms.sg && builtin.forms.pl && builtin.dict.test(nfc(item.dict ?? item.term));
  if (!full) {
    const d = laNounData(item);
    if (typeof d === "string") return d;
    const p = laNounCells(d, w);
    if (p) return p;
  } else if (!item.dict) return `give "dict", the dictionary entry ("domus, domūs, f.")`;
  if (builtin && builtin.dict.test(nfc(item.dict ?? ""))) {
    applyTable(w, builtin.forms, item.term);
    for (const k of Object.keys(builtin.forms)) for (const s of w.slots) if ((s === k || s.startsWith(k + ".")) && w.cells.has(s)) w.cells.get(s)!.rule = builtin.note;
  }
  return w;
}

// ---------------------------------------------------------------------------------------------
// Adjectives

/** Pronominal adjectives (genitive -īus, dative -ī): UNUS NAUTA (A&G 113). */
const LA_PRONOMINAL = ["ūnus", "ūllus", "nūllus", "sōlus", "neuter", "alius", "uter", "tōtus", "alter", "uterque"];
/** 3rd-declension adjectives of one ending declined as consonant stems (A&G 121 b). */
const LA_CONSONANT_ADJ = ["vetus", "dīves", "pauper", "prīnceps", "particeps", "compos", "sōspes", "superstes", "caelebs", "dēses", "reses", "inops", "pūbēs", "impūbēs"];
/** No comparison (A&G 131). */
const LA_NO_COMPARISON = ["omnis", "cūnctus", "tōtus", "sōlus", "ūnus", "nūllus", "ūllus", "medius", "mortuus", "aureus", "argenteus", "ferreus", "meus", "tuus", "suus", "noster", "vester"];
/** Irregular comparison (A&G 129). */
const LA_COMPARISON: Record<string, [string, string, string]> = {
  bonus: ["melior", "melius", "optimus"],
  malus: ["peior", "peius", "pessimus"],
  magnus: ["maior", "maius", "maximus"],
  parvus: ["minor", "minus", "minimus"],
  multus: ["—", "plūs", "plūrimus"],
};
const LA_ILIS = ["facilis", "difficilis", "similis", "dissimilis", "gracilis", "humilis"];

interface AdjData {
  cls: string;
  m: string;
  f: string;
  n: string;
  stem: string;
  terminations: 1 | 2 | 3;
}

function expandAbbrev(base: string, abbr: string): string | undefined {
  if (!abbr.startsWith("-")) return abbr;
  const a = abbr.slice(1);
  if (base.endsWith("us") && (a === "a" || a === "um")) return base.slice(0, -2) + a;
  if (/(er|ur)$/.test(base) && (a === "a" || a === "um")) return base + a;
  if (base.endsWith("is") && a === "e") return base.slice(0, -2) + "e";
  const k = base.lastIndexOf(a[0]);
  return k > 0 ? base.slice(0, k) + a : undefined;
}

function laAdjData(item: VocabItem): AdjData | string {
  const cls = item.conj ?? "";
  if (!item.dict) return cls === "adj12" ? `give "dict", the dictionary entry ("magnus, -a, -um")` : `give "dict", the dictionary entry ("omnis, -e"; "ācer, ācris, ācre"; "fēlīx, fēlīcis")`;
  const parts = dictParts(item).map((p) => p.replace(/\s*\(?gen\.?\)?$/, "").trim()).filter((p) => p && !/^(adj|gen)\.?$/.test(p));
  const m = parts[0];
  if (nfc(item.term) !== m) return `the term "${item.term}" should be the masculine nominative in dict ("${m}")`;
  if (cls === "adj12") {
    if (parts.length !== 3) return `dict "${item.dict}" needs the three nominatives ("magnus, -a, -um"; "pulcher, -chra, -chrum")`;
    const f = expandAbbrev(m, parts[1]);
    if (!f || !f.endsWith("a")) return `can't read the feminine "${parts[1]}": write it in full ("pulcher, pulchra, pulchrum")`;
    const n = parts[2].startsWith("-") ? f.slice(0, -1) + "um" : parts[2];
    if (n !== f.slice(0, -1) + "um") return `the neuter "${parts[2]}" doesn't fit the feminine ${f}`;
    if (!/(us|er|ur)$/.test(m)) return `1st/2nd declension adjectives end in -us or -er ("${m}")`;
    return { cls, m, f, n, stem: f.slice(0, -1), terminations: 3 };
  }
  if (parts.length === 3) {
    const f = expandAbbrev(m, parts[1]);
    const n = f && expandAbbrev(f, parts[2]);
    if (!f || !n || !f.endsWith("is") || !n.endsWith("e")) return `dict "${item.dict}": three endings are written "ācer, ācris, ācre"`;
    return { cls, m, f, n, stem: f.slice(0, -2), terminations: 3 };
  }
  if (parts.length === 2) {
    const second = expandAbbrev(m, parts[1]);
    if (!second) return `can't read "${parts[1]}": write it in full ("omnis, omne"; "fēlīx, fēlīcis")`;
    if (m.endsWith("is") && second.endsWith("e") && second === m.slice(0, -2) + "e") return { cls, m, f: m, n: second, stem: m.slice(0, -2), terminations: 2 };
    if (second.endsWith("is")) return { cls, m, f: m, n: m, stem: second.slice(0, -2), terminations: 1 };
  }
  return `dict "${item.dict}" should be "omnis, -e" (two endings), "ācer, ācris, ācre" (three) or "fēlīx, fēlīcis" (one ending and the genitive)`;
}

function laAdj(item: VocabItem): ClassicalWord | string {
  const w: ClassicalWord = { kind: "adj", slots: [...adjSlots(LA_CASES), "comparative.m", "comparative.f", "comparative.n", "superlative.m", "superlative.f", "superlative.n"], optional: new Set(), cells: new Map(), missing: new Map() };
  const d = laAdjData(item);
  if (typeof d === "string") return d;
  const { m, f, n, stem } = d;
  const set = (slot: string, forms: string | string[], rule: string, extra?: string[]) => w.cells.set(slot, cell(forms, rule, extra));
  const term = nfc(item.term);
  if (d.cls === "adj12") {
    if (LA_PRONOMINAL.includes(term) && !(item.forms?.["sg.gen"] && item.forms?.["sg.dat"]) && !item.forms?.sg)
      return `${term} is a pronominal adjective (genitive -īus, dative -ī; A&G 113): give its forms ("sg" or at least "sg.gen" and "sg.dat")`;
    const rule = (g: string, e: string) => `1st/2nd declension adjective, ${g}: stem ${stem}- + -${e}`;
    const masc = ["", "ī", "ō", "um", "ō", ""];
    const fem = ["a", "ae", "ae", "am", "ā", "a"];
    const neut = ["um", "ī", "ō", "um", "ō", "um"];
    LA_CASES.forEach((c, i) => {
      if (masc[i]) set(`sg.${c}.m`, stem + masc[i], rule("masculine", masc[i]));
      set(`sg.${c}.f`, stem + fem[i], rule("feminine", fem[i]));
      set(`sg.${c}.n`, stem + neut[i], rule("neuter", neut[i]));
    });
    set("sg.nom.m", m, "the masculine nominative, as in the dictionary entry");
    if (term === "meus") set("sg.voc.m", "mī", "meus has the vocative mī (A&G 145)");
    else if (m.endsWith("us")) set("sg.voc.m", stem + "e", `masculine vocative: -us → -e (${stem}e)`);
    else set("sg.voc.m", m, "masculine vocative: the nominative");
    const pm = ["ī", "ōrum", "īs", "ōs", "īs", "ī"];
    const pf = ["ae", "ārum", "īs", "ās", "īs", "ae"];
    const pn = ["a", "ōrum", "īs", "a", "īs", "a"];
    LA_CASES.forEach((c, i) => {
      set(`pl.${c}.m`, stem + pm[i], rule("masculine", pm[i]));
      set(`pl.${c}.f`, stem + pf[i], rule("feminine", pf[i]));
      set(`pl.${c}.n`, stem + pn[i], rule("neuter", pn[i]));
    });
  } else {
    if (LA_CONSONANT_ADJ.includes(term)) return `${term} is declined as a consonant stem (ablative -e, genitive plural -um; A&G 121 b): give its forms`;
    const ns = /ns$/.test(m) && d.terminations === 1;
    const what = `3rd declension adjective (i-stem)`;
    const sgMF = ["", "is", "ī", "em", ns ? "ī/e" : "ī", ""];
    const plMF = ["ēs", "ium", "ibus", "ēs/īs", "ibus", "ēs"];
    const plN = ["ia", "ium", "ibus", "ia", "ibus", "ia"];
    const forms = (e: string) => e.split("/").map((x) => stem + x);
    LA_CASES.forEach((c, i) => {
      for (const g of GENDERS) {
        if (g === "n" && (c === "nom" || c === "acc" || c === "voc")) set(`sg.${c}.n`, n, `neuter ${c === "nom" ? "nominative" : c === "acc" ? "accusative (the nominative)" : "vocative (the nominative)"}: ${n}`);
        else if (c === "nom" || c === "voc") set(`sg.${c}.${g}`, g === "m" ? m : f, c === "nom" ? "the nominative, as in the dictionary entry" : "the vocative is the nominative");
        else set(`sg.${c}.${g}`, forms(sgMF[i]), `${what}: stem ${stem}- + -${sgMF[i].split("/").join(" (or -")}${sgMF[i].includes("/") ? ")" : ""}${ns && c === "abl" ? "; -e when used as a participle" : ""}`);
        const pe = g === "n" ? plN[i] : plMF[i];
        set(`pl.${c}.${g}`, forms(pe), `${what}: stem ${stem}- + -${pe.split("/").join(" (or -")}${pe.includes("/") ? ")" : ""}`);
      }
    });
    if (term === "celer") for (const g of GENDERS) set(`pl.gen.${g}`, "celerum", "celer has the genitive plural celerum (A&G 115 a)");
  }
  // Comparison (nominative singular of the comparative and superlative).
  const irr = LA_COMPARISON[term];
  if (irr) {
    const [cmf, cn, sup] = irr;
    if (cmf !== "—") for (const g of ["m", "f"]) set(`comparative.${g}`, cmf, `${term} has an irregular comparative: ${cmf}, ${cn}`);
    else w.optional.add("comparative.m").add("comparative.f");
    set("comparative.n", cn, `${term} has an irregular comparative: ${cmf === "—" ? "" : cmf + ", "}${cn}`);
    const sstem = sup.slice(0, -2);
    set("superlative.m", sup, `${term} has an irregular superlative: ${sup}`);
    set("superlative.f", sstem + "a", `${term} has an irregular superlative: ${sup}, ${sstem}a, ${sstem}um`);
    set("superlative.n", sstem + "um", `${term} has an irregular superlative: ${sup}, ${sstem}a, ${sstem}um`);
  } else if (LA_NO_COMPARISON.includes(term) || LA_PRONOMINAL.includes(term)) {
    for (const s of w.slots.filter((x) => /^(comparative|superlative)\./.test(x))) w.optional.add(s);
  } else if (/[eiu]us$/.test(m) && d.cls === "adj12") {
    w.missing.set("comparative", `${term} ends in a vowel + -us: it compares with magis and maximē (A&G 128); give its forms or noForms`);
    w.missing.set("superlative", `${term} ends in a vowel + -us: it compares with magis and maximē (A&G 128); give its forms or noForms`);
  } else {
    set("comparative.m", stem + "ior", `Comparative: the stem ${stem}- + -ior (neuter -ius)`);
    set("comparative.f", stem + "ior", `Comparative: the stem ${stem}- + -ior (neuter -ius)`);
    set("comparative.n", stem + "ius", `Comparative neuter: the stem ${stem}- + -ius`);
    let sup: string;
    let how: string;
    if (m.endsWith("er")) {
      sup = m + "rimus";
      how = `adjectives in -er add -rimus to the masculine nominative (${sup})`;
    } else if (LA_ILIS.includes(term)) {
      sup = stem + "limus";
      how = `facilis, difficilis, similis, dissimilis, gracilis and humilis take -limus (${sup})`;
    } else {
      sup = stem + "issimus";
      how = `the stem ${stem}- + -issimus`;
    }
    const s = sup.slice(0, -2);
    set("superlative.m", sup, `Superlative: ${how}`);
    set("superlative.f", s + "a", `Superlative: ${how}; feminine ${s}a`);
    set("superlative.n", s + "um", `Superlative: ${how}; neuter ${s}um`);
  }
  return w;
}

// ---------------------------------------------------------------------------------------------
// Verbs

type Six = readonly string[];
interface Endings {
  infAct: string;
  infPass: string;
  pres: [Six, Six];
  impf: [Six, Six];
  fut: [Six, Six];
  presSubj: [Six, Six];
  impfSubj: [Six, Six];
  imp: [readonly string[], readonly string[]];
  futImp: readonly string[];
  ptc: string;
  gerund: string;
  pp1: [string, string];
}
const E = (s: string) => s.split(" ");
const ENDINGS: Record<string, Endings> = {
  v1: {
    infAct: "āre", infPass: "ārī",
    pres: [E("ō ās at āmus ātis ant"), E("or āris/āre ātur āmur āminī antur")],
    impf: [E("ābam ābās ābat ābāmus ābātis ābant"), E("ābar ābāris/ābāre ābātur ābāmur ābāminī ābantur")],
    fut: [E("ābō ābis ābit ābimus ābitis ābunt"), E("ābor āberis/ābere ābitur ābimur ābiminī ābuntur")],
    presSubj: [E("em ēs et ēmus ētis ent"), E("er ēris/ēre ētur ēmur ēminī entur")],
    impfSubj: [E("ārem ārēs āret ārēmus ārētis ārent"), E("ārer ārēris/ārēre ārētur ārēmur ārēminī ārentur")],
    imp: [E("ā āte"), E("āre āminī")], futImp: E("ātō ātō ātōte antō"),
    ptc: "āns", gerund: "and", pp1: ["ō", "or"],
  },
  v2: {
    infAct: "ēre", infPass: "ērī",
    pres: [E("eō ēs et ēmus ētis ent"), E("eor ēris/ēre ētur ēmur ēminī entur")],
    impf: [E("ēbam ēbās ēbat ēbāmus ēbātis ēbant"), E("ēbar ēbāris/ēbāre ēbātur ēbāmur ēbāminī ēbantur")],
    fut: [E("ēbō ēbis ēbit ēbimus ēbitis ēbunt"), E("ēbor ēberis/ēbere ēbitur ēbimur ēbiminī ēbuntur")],
    presSubj: [E("eam eās eat eāmus eātis eant"), E("ear eāris/eāre eātur eāmur eāminī eantur")],
    impfSubj: [E("ērem ērēs ēret ērēmus ērētis ērent"), E("ērer ērēris/ērēre ērētur ērēmur ērēminī ērentur")],
    imp: [E("ē ēte"), E("ēre ēminī")], futImp: E("ētō ētō ētōte entō"),
    ptc: "ēns", gerund: "end", pp1: ["eō", "eor"],
  },
  v3: {
    infAct: "ere", infPass: "ī",
    pres: [E("ō is it imus itis unt"), E("or eris/ere itur imur iminī untur")],
    impf: [E("ēbam ēbās ēbat ēbāmus ēbātis ēbant"), E("ēbar ēbāris/ēbāre ēbātur ēbāmur ēbāminī ēbantur")],
    fut: [E("am ēs et ēmus ētis ent"), E("ar ēris/ēre ētur ēmur ēminī entur")],
    presSubj: [E("am ās at āmus ātis ant"), E("ar āris/āre ātur āmur āminī antur")],
    impfSubj: [E("erem erēs eret erēmus erētis erent"), E("erer erēris/erēre erētur erēmur erēminī erentur")],
    imp: [E("e ite"), E("ere iminī")], futImp: E("itō itō itōte untō"),
    ptc: "ēns", gerund: "end", pp1: ["ō", "or"],
  },
  "v3-io": {
    infAct: "ere", infPass: "ī",
    pres: [E("iō is it imus itis iunt"), E("ior eris/ere itur imur iminī iuntur")],
    impf: [E("iēbam iēbās iēbat iēbāmus iēbātis iēbant"), E("iēbar iēbāris/iēbāre iēbātur iēbāmur iēbāminī iēbantur")],
    fut: [E("iam iēs iet iēmus iētis ient"), E("iar iēris/iēre iētur iēmur iēminī ientur")],
    presSubj: [E("iam iās iat iāmus iātis iant"), E("iar iāris/iāre iātur iāmur iāminī iantur")],
    impfSubj: [E("erem erēs eret erēmus erētis erent"), E("erer erēris/erēre erētur erēmur erēminī erentur")],
    imp: [E("e ite"), E("ere iminī")], futImp: E("itō itō itōte iuntō"),
    ptc: "iēns", gerund: "iend", pp1: ["iō", "ior"],
  },
  v4: {
    infAct: "īre", infPass: "īrī",
    pres: [E("iō īs it īmus ītis iunt"), E("ior īris/īre ītur īmur īminī iuntur")],
    impf: [E("iēbam iēbās iēbat iēbāmus iēbātis iēbant"), E("iēbar iēbāris/iēbāre iēbātur iēbāmur iēbāminī iēbantur")],
    fut: [E("iam iēs iet iēmus iētis ient"), E("iar iēris/iēre iētur iēmur iēminī ientur")],
    presSubj: [E("iam iās iat iāmus iātis iant"), E("iar iāris/iāre iātur iāmur iāminī iantur")],
    impfSubj: [E("īrem īrēs īret īrēmus īrētis īrent"), E("īrer īrēris/īrēre īrētur īrēmur īrēminī īrentur")],
    imp: [E("ī īte"), E("īre īminī")], futImp: E("ītō ītō ītōte iuntō"),
    ptc: "iēns", gerund: "iend", pp1: ["iō", "ior"],
  },
};
const CONJ_NAME: Record<string, string> = { v1: "1st conjugation", v2: "2nd conjugation", v3: "3rd conjugation", "v3-io": "3rd conjugation -iō", v4: "4th conjugation" };

const PERF = { ind: E("ī istī it imus istis ērunt/ēre"), plpf: E("eram erās erat erāmus erātis erant"), futp: E("erō eris erit erimus eritis erint"), subj: E("erim erīs erit erīmus erītis erint"), plpfSubj: E("issem issēs isset issēmus issētis issent") };
const SUM = {
  perf: E("sum es est sumus estis sunt"),
  plpf: E("eram erās erat erāmus erātis erant"),
  futp: E("erō eris erit erimus eritis erunt"),
  subj: E("sim sīs sit sīmus sītis sint"),
  plpfSubj: E("essem essēs esset essēmus essētis essent"),
};

export const LA_FINITE = [
  ...["pres", "impf", "fut", "perf", "plpf", "futp"].flatMap((t) => [`${t}-act-ind`, `${t}-pass-ind`]),
  ...["pres", "impf", "perf", "plpf"].flatMap((t) => [`${t}-act-subj`, `${t}-pass-subj`]),
];
export const LA_VERB_SLOTS: string[] = [
  ...LA_FINITE.flatMap((f) => PERSONS.map((p) => `${f}.${p}`)),
  ...IMP_LA.map((p) => `pres-act-imp.${p}`),
  ...IMP_LA.map((p) => `pres-pass-imp.${p}`),
  ...IMP_FUT_LA.map((p) => `fut-act-imp.${p}`),
  "pres-act-inf", "pres-pass-inf", "perf-act-inf", "perf-pass-inf", "fut-act-inf", "fut-pass-inf",
  ...["pres-act-ptc", "perf-pass-ptc", "fut-act-ptc", "gerundive"].flatMap((f) => GENDERS.map((g) => `${f}.${g}`)),
  ...GERUND_CASES.map((c) => `gerund.${c}`),
];

interface VerbParts {
  cls: string;
  /** Present root: am-, mon-, reg-, cap-, aud-. */
  root?: string;
  /** Perfect stem (amāv-), or the perfect participle for deponents' perfect system. */
  perf?: string;
  /** Perfect passive participle (amātus), deponents' perfect participle (hortātus). */
  ppp?: string;
  /** Future active participle (amātūrus). */
  futPtc?: string;
  /** Supine in -um (amātum), for the future passive infinitive. */
  supine?: string;
  deponent: boolean;
  /** Present system active, perfect system passive in form (audeō, ausus sum). */
  semi: boolean;
  term: string;
  /** dict writes "—" for the perfect or the supine: the verb has none (not drilled, not missing). */
  noPerf?: boolean;
  noSupine?: boolean;
}

/** The six persons of a periphrastic form: participle + a form of sum, with every gender accepted. */
function periphrastic(ppp: string, aux: Six, rule: string): Cell[] {
  const s = ppp.slice(0, -2);
  const sg = [`${s}us`, `${s}a`, `${s}um`];
  const pl = [`${s}ī`, `${s}ae`, `${s}a`];
  return aux.map((a, i) => {
    const g = i < 3 ? sg : pl;
    return { forms: [`${g[0]} ${a}`], extra: g.slice(1).map((x) => `${x} ${a}`), rule };
  });
}
/** Participle + esse: amātus esse, with every gender, number and the accusative (amātum esse). */
function withEsse(ptc: string, rule: string): Cell {
  const s = ptc.slice(0, -2);
  const all = ["us", "a", "um", "am", "ī", "ae", "ōs", "ās"].map((e) => `${s}${e} esse`);
  return { forms: [`${ptc} esse`], extra: all.filter((x) => x !== `${ptc} esse`), rule };
}
const ptcCells = (w: ClassicalWord, form: string, ptc: string, rule: string) => {
  const s = ptc.slice(0, -2);
  const forms = { m: ptc, f: s + "a", n: s + "um" };
  for (const g of GENDERS) w.cells.set(`${form}.${g}`, { forms: [forms[g]], extra: g === "m" ? [`${ptc}, -a, -um`, `${ptc} ${s}a ${s}um`, `${ptc}, ${s}a, ${s}um`] : undefined, rule });
};

function laVerbParts(item: VocabItem, cls: string): VerbParts | string {
  const parts = dictParts(item);
  const term = nfc(item.term);
  if (!item.dict) return `give "dict", the principal parts ("amō, amāre, amāvī, amātum"; "hortor, hortārī, hortātus sum")`;
  if (parts[0] !== term) return `the term "${item.term}" should be the first principal part in dict ("${parts[0]}")`;
  const deponent = /or$/.test(term);
  const e = ENDINGS[cls];
  if (!e) return `"${cls}" isn't a Latin verb class (v1, v2, v3, v3-io, v4, irr)`;
  const inf = parts[1] ?? "";
  const wantInf = deponent ? e.infPass : e.infAct;
  if (!inf.endsWith(wantInf)) return `the infinitive "${inf}" doesn't fit the ${CONJ_NAME[cls]} (-${wantInf})`;
  const root = inf.slice(0, -wantInf.length);
  const want1 = root + e.pp1[deponent ? 1 : 0];
  if (term !== want1) return `"${term}" and "${inf}" don't fit the ${CONJ_NAME[cls]} (expected ${want1}${cls === "v3" && /i[oō]r?$/.test(term) ? `; -iō verbs are v3-io` : ""})`;
  return verbTail({ cls, root, deponent, semi: false, term }, parts.slice(2), deponent);
}

/** The perfect parts of a dict: "amāvī, amātum", "hortātus sum", "ausus sum", "fuī, futūrus". */
function verbTail(v: VerbParts, rest: string[], deponent: boolean): VerbParts | string {
  const dash = (s: string | undefined) => !s || /^[—–-]+$/.test(s);
  if (deponent) {
    const p3 = rest[0];
    if (dash(p3)) return v;
    const m = /^(\S+us) sum$/.exec(p3);
    if (!m) return `a deponent's third principal part is the perfect participle with sum ("hortātus sum"), not "${p3}"`;
    v.ppp = m[1];
    v.futPtc = m[1].slice(0, -2) + "ūrus";
    return v;
  }
  const p3 = rest[0];
  if (p3 && dash(p3)) v.noPerf = true;
  if (rest[1] && dash(rest[1])) v.noSupine = true;
  if (!dash(p3)) {
    const semi = /^(\S+us) sum$/.exec(p3);
    if (semi) {
      v.semi = true;
      v.deponent = false;
      v.ppp = semi[1];
      v.futPtc = semi[1].slice(0, -2) + "ūrus";
      return v;
    }
    if (!p3.endsWith("ī")) return `the perfect "${p3}" should end in -ī`;
    v.perf = p3.slice(0, -1);
  }
  const p4 = rest[1];
  if (!dash(p4)) {
    if (/ūrus$/.test(p4)) v.futPtc = p4;
    else if (/(um|us)$/.test(p4)) {
      v.supine = p4.slice(0, -2) + "um";
      v.ppp = p4.slice(0, -2) + "us";
      v.futPtc = p4.slice(0, -2) + "ūrus";
    } else return `the fourth principal part "${p4}" should be the supine in -um (or the participle in -us, or -ūrus)`;
  }
  return v;
}

/** Fill a verb's cells from its parts. Deponents (and fīō) put passive forms under active ids. */
function laVerbCells(v: VerbParts, w: ClassicalWord, opts: { noPassive?: boolean } = {}) {
  const e = ENDINGS[v.cls];
  const dep = v.deponent;
  const set = (slot: string, c: Cell) => w.cells.set(slot, c);
  const name = CONJ_NAME[v.cls];
  if (v.root !== undefined && e) {
    const r = v.root;
    const finite = (form: string, ends: Six, what: string) =>
      PERSONS.forEach((p, i) => {
        const alts = ends[i].split("/");
        set(`${form}.${p}`, { forms: alts.map((x) => r + x), rule: `${name}${what}: ${r}- + -${alts.join(" (or -")}${alts.length > 1 ? ")" : ""}` });
      });
    const voice = dep ? 1 : 0;
    const tenses: [string, keyof Endings, string][] = [
      ["pres", "pres", " present"],
      ["impf", "impf", " imperfect"],
      ["fut", "fut", " future"],
    ];
    for (const [t, k, what] of tenses) {
      finite(`${t}-act-ind`, (e[k] as [Six, Six])[voice], what + (dep ? " (deponent: passive endings)" : ""));
      if (!dep && !opts.noPassive) finite(`${t}-pass-ind`, (e[k] as [Six, Six])[1], what + " passive");
    }
    finite("pres-act-subj", e.presSubj[voice], ` present subjunctive${dep ? " (deponent: passive endings)" : ""}`);
    finite("impf-act-subj", e.impfSubj[voice], ` imperfect subjunctive: the present infinitive + endings${dep ? " (passive)" : ""}`);
    if (!dep && !opts.noPassive) {
      finite("pres-pass-subj", e.presSubj[1], " present subjunctive passive");
      finite("impf-pass-subj", e.impfSubj[1], " imperfect subjunctive passive");
    }
    const imp = e.imp[voice];
    IMP_LA.forEach((p, i) => {
      let f = r + imp[i];
      let rule = `${name} imperative: ${r}- + -${imp[i]}`;
      // dīc, dūc, fac, fer (A&G 182): dīcō, dūcō and their compounds, faciō (and calefaciō…).
      if (!dep && p === "2sg" && (/(dīc|dūc)ō$/.test(v.term) || /faciō$/.test(v.term))) {
        f = r;
        rule = `dīcō, dūcō and faciō drop the -e of the imperative: ${r}`;
      }
      set(`pres-act-imp.${p}`, { forms: [f], rule });
      if (!dep && !opts.noPassive) set(`pres-pass-imp.${p}`, { forms: [r + e.imp[1][i]], rule: `${name} passive imperative: ${r}- + -${e.imp[1][i]}` });
    });
    if (!dep) IMP_FUT_LA.forEach((p, i) => set(`fut-act-imp.${p}`, { forms: [r + e.futImp[i]], rule: `${name} future imperative: ${r}- + -${e.futImp[i]}` }));
    set("pres-act-inf", { forms: [r + (dep ? e.infPass : e.infAct)], rule: `${name} present infinitive${dep ? " (deponent: passive form)" : ""}: -${dep ? e.infPass : e.infAct}` });
    if (!dep && !opts.noPassive) set("pres-pass-inf", { forms: [r + e.infPass], rule: `${name} present passive infinitive: -${e.infPass}` });
    const ptc = r + e.ptc;
    const ptcStem = r + e.ptc.replace(/ēns$|āns$/, (x) => (x === "āns" ? "ant" : "ent")).replace(/^iēns$/, "ient");
    for (const g of GENDERS) set(`pres-act-ptc.${g}`, { forms: [ptc], extra: g === "m" ? [`${ptc}, ${ptcStem.replace(/iēns$/, "ient")}is`] : undefined, rule: `Present participle: ${r}- + -${e.ptc} (genitive ${ptc.replace(/āns$/, "antis").replace(/ēns$/, "entis")}); the same in every gender` });
    const ger = r + e.gerund;
    GERUND_CASES.forEach((c, i) => set(`gerund.${c}`, { forms: [ger + ["ī", "ō", "um", "ō"][i]], rule: `Gerund: ${ger}- + 2nd declension endings (-ī, -ō, -um, -ō)` }));
    ptcCells(w, "gerundive", ger + "us", `Gerundive: ${ger}- + -us, -a, -um`);
  }
  // Perfect system.
  if (v.perf !== undefined) {
    const s = v.perf;
    const row = (form: string, ends: Six, what: string) => PERSONS.forEach((p, i) => {
      const alts = ends[i].split("/");
      set(`${form}.${p}`, { forms: alts.map((x) => s + x), rule: `${what}: the perfect stem ${s}- + -${alts.join(" (or -")}${alts.length > 1 ? ")" : ""}` });
    });
    row("perf-act-ind", PERF.ind, "Perfect");
    row("plpf-act-ind", PERF.plpf, "Pluperfect");
    row("futp-act-ind", PERF.futp, "Future perfect");
    row("perf-act-subj", PERF.subj, "Perfect subjunctive");
    row("plpf-act-subj", PERF.plpfSubj, "Pluperfect subjunctive");
    set("perf-act-inf", { forms: [s + "isse"], rule: `Perfect infinitive: the perfect stem ${s}- + -isse` });
  }
  if (v.ppp) {
    const p = v.ppp;
    const activeIds = dep || v.semi;
    const vo = activeIds ? "act" : "pass";
    const label = activeIds ? `${dep ? "Deponent" : "Semi-deponent"} perfect system: the participle ${p} + sum` : `Perfect passive system: the participle ${p} + sum`;
    if (activeIds || !opts.noPassive) {
      const rows: [string, Six, string][] = [
        [`perf-${vo}-ind`, SUM.perf, "sum"],
        [`plpf-${vo}-ind`, SUM.plpf, "eram"],
        [`futp-${vo}-ind`, SUM.futp, "erō"],
        [`perf-${vo}-subj`, SUM.subj, "sim"],
        [`plpf-${vo}-subj`, SUM.plpfSubj, "essem"],
      ];
      for (const [form, aux, a] of rows) periphrastic(p, aux, label.replace("+ sum", `+ ${a} (agreeing with the subject)`)).forEach((c, i) => set(`${form}.${PERSONS[i]}`, c));
      set(`perf-${vo}-inf`, withEsse(p, `Perfect ${activeIds ? "" : "passive "}infinitive: the participle + esse (${p} esse)`));
    }
    ptcCells(w, "perf-pass-ptc", p, `Perfect ${dep ? "" : "passive "}participle: from the ${dep || v.semi ? "third" : "fourth"} principal part (${p}, -a, -um)`);
  }
  if (v.futPtc) {
    ptcCells(w, "fut-act-ptc", v.futPtc, `Future active participle: the participle stem + -ūrus (${v.futPtc})`);
    set("fut-act-inf", withEsse(v.futPtc, `Future active infinitive: the future participle + esse (${v.futPtc} esse)`));
  }
  if (v.supine && !dep && !opts.noPassive) set("fut-pass-inf", { forms: [`${v.supine} īrī`], rule: `Future passive infinitive: the supine + īrī (${v.supine} īrī)` });
  // Why the rest is missing.
  // Deponents and semi-deponents have no passive (their passive-looking forms are drilled as active).
  if (dep || v.semi) for (const sl of w.slots) if (/-pass-(ind|subj|imp|inf)/.test(sl)) w.optional.add(sl);
  const lacks = (prefixes: string[]) => w.slots.filter((s) => prefixes.some((k) => s.startsWith(k)) && !w.cells.has(s)).forEach((s) => w.optional.add(s));
  if (v.perf === undefined && !v.semi && !dep) {
    if (v.noPerf) lacks(["perf-act", "plpf-act", "futp-act"]);
    else w.missing.set("perf-act", `no perfect in dict: give the third principal part (or "—"), or the forms`).set("plpf-act", "no perfect in dict").set("futp-act", "no perfect in dict");
  }
  if (!v.ppp && !dep) {
    const keys = ["perf-pass", "plpf-pass", "futp-pass", "fut-pass-inf"];
    if (v.noSupine) lacks([...keys, "fut-act"]);
    else for (const k of keys) w.missing.set(k, `no fourth principal part (supine) in dict: give it (or "—" if the verb has none), the forms, or noForms`);
  }
  if (!v.futPtc && !v.noSupine) w.missing.set("fut-act", `no future participle: give the fourth principal part (or "—"), the forms, or noForms`);
}

/**
 * Irregular verbs (A&G 170, 199–204). Each is the regular model with its irregular cells; the
 * perfect system comes from the dict as usual. `none`: forms the verb doesn't have.
 */
const LA_IRREGULAR: Record<string, { model: Omit<VerbParts, "term">; forms: Record<string, string>; none: string[]; note: string }> = {
  sum: {
    model: { cls: "v3", perf: "fu", futPtc: "futūrus", deponent: false, semi: false },
    forms: {
      "pres-act-ind": "sum, es, est, sumus, estis, sunt",
      "impf-act-ind": "eram, erās, erat, erāmus, erātis, erant",
      "fut-act-ind": "erō, eris, erit, erimus, eritis, erunt",
      "pres-act-subj": "sim, sīs, sit, sīmus, sītis, sint",
      "impf-act-subj": "essem/forem, essēs/forēs, esset/foret, essēmus, essētis, essent/forent",
      "pres-act-imp": "es, este",
      "fut-act-imp": "estō, estō, estōte, suntō",
      "pres-act-inf": "esse",
      "fut-act-inf": "futūrus esse/fore",
    },
    none: ["pass", "pres-act-ptc", "gerund", "gerundive", "perf-pass-ptc"],
    note: "sum is irregular (A&G 170)",
  },
  possum: {
    model: { cls: "v3", perf: "potu", deponent: false, semi: false },
    forms: {
      "pres-act-ind": "possum, potes, potest, possumus, potestis, possunt",
      "impf-act-ind": "poteram, poterās, poterat, poterāmus, poterātis, poterant",
      "fut-act-ind": "poterō, poteris, poterit, poterimus, poteritis, poterunt",
      "pres-act-subj": "possim, possīs, possit, possīmus, possītis, possint",
      "impf-act-subj": "possem, possēs, posset, possēmus, possētis, possent",
      "pres-act-inf": "posse",
    },
    none: ["pass", "imp", "ptc", "gerund", "gerundive", "fut-act-inf"],
    note: "possum (pot- + sum) is irregular (A&G 137 b)",
  },
  eō: {
    model: { cls: "v4", perf: "i", supine: "itum", futPtc: "itūrus", deponent: false, semi: false },
    forms: {
      "pres-act-ind": "eō, īs, it, īmus, ītis, eunt",
      "impf-act-ind": "ībam, ībās, ībat, ībāmus, ībātis, ībant",
      "fut-act-ind": "ībō, ībis, ībit, ībimus, ībitis, ībunt",
      "pres-act-subj": "eam, eās, eat, eāmus, eātis, eant",
      "impf-act-subj": "īrem, īrēs, īret, īrēmus, īrētis, īrent",
      "perf-act-ind": "iī/īvī, īstī/īvistī, iit/īvit, iimus/īvimus, īstis/īvistis, iērunt/iēre/īvērunt",
      "plpf-act-subj": "īssem, īssēs, īsset, īssēmus, īssētis, īssent",
      "perf-act-inf": "īsse",
      "pres-act-imp": "ī, īte",
      "fut-act-imp": "ītō, ītō, ītōte, euntō",
      "pres-act-inf": "īre",
      "pres-act-ptc": "iēns, iēns, iēns",
      gerund: "eundī, eundō, eundum, eundō",
    },
    none: ["pass", "gerundive", "perf-pass-ptc"],
    note: "eō is irregular (A&G 203)",
  },
  ferō: {
    model: { cls: "v3", root: "fer", perf: "tul", ppp: "lātus", supine: "lātum", futPtc: "lātūrus", deponent: false, semi: false },
    forms: {
      "pres-act-ind": "ferō, fers, fert, ferimus, fertis, ferunt",
      "pres-pass-ind": "feror, ferris/ferre, fertur, ferimur, feriminī, feruntur",
      "impf-act-subj": "ferrem, ferrēs, ferret, ferrēmus, ferrētis, ferrent",
      "impf-pass-subj": "ferrer, ferrēris/ferrēre, ferrētur, ferrēmur, ferrēminī, ferrentur",
      "pres-act-imp": "fer, ferte",
      "pres-pass-imp": "ferre, feriminī",
      "fut-act-imp": "fertō, fertō, fertōte, feruntō",
      "pres-act-inf": "ferre",
      "pres-pass-inf": "ferrī",
    },
    none: [],
    note: "ferō is irregular in the present system (A&G 200)",
  },
  volō: {
    model: { cls: "v3", root: "vol", perf: "volu", deponent: false, semi: false },
    forms: {
      "pres-act-ind": "volō, vīs, vult/volt, volumus, vultis/voltis, volunt",
      "pres-act-subj": "velim, velīs, velit, velīmus, velītis, velint",
      "impf-act-subj": "vellem, vellēs, vellet, vellēmus, vellētis, vellent",
      "pres-act-inf": "velle",
    },
    none: ["pass", "imp", "gerund", "gerundive", "fut-act-inf", "fut-act-ptc", "perf-pass-ptc"],
    note: "volō is irregular (A&G 199)",
  },
  nōlō: {
    model: { cls: "v3", root: "nōl", perf: "nōlu", deponent: false, semi: false },
    forms: {
      "pres-act-ind": "nōlō, nōn vīs, nōn vult, nōlumus, nōn vultis, nōlunt",
      "pres-act-subj": "nōlim, nōlīs, nōlit, nōlīmus, nōlītis, nōlint",
      "impf-act-subj": "nōllem, nōllēs, nōllet, nōllēmus, nōllētis, nōllent",
      "pres-act-imp": "nōlī, nōlīte",
      "fut-act-imp": "nōlītō, nōlītō, nōlītōte, nōluntō",
      "pres-act-inf": "nōlle",
    },
    none: ["pass", "gerund", "gerundive", "fut-act-inf", "fut-act-ptc", "perf-pass-ptc"],
    note: "nōlō (nē + volō) is irregular (A&G 199)",
  },
  mālō: {
    model: { cls: "v3", root: "māl", perf: "mālu", deponent: false, semi: false },
    forms: {
      "pres-act-ind": "mālō, māvīs, māvult, mālumus, māvultis, mālunt",
      "pres-act-subj": "mālim, mālīs, mālit, mālīmus, mālītis, mālint",
      "impf-act-subj": "māllem, māllēs, māllet, māllēmus, māllētis, māllent",
      "pres-act-inf": "mālle",
    },
    none: ["pass", "imp", "ptc", "gerund", "gerundive", "fut-act-inf"],
    note: "mālō (magis + volō) is irregular (A&G 199)",
  },
  fīō: {
    model: { cls: "v4", ppp: "factus", supine: "factum", deponent: true, semi: false },
    forms: {
      "pres-act-ind": "fīō, fīs, fit, fīmus, fītis, fīunt",
      "impf-act-ind": "fīēbam, fīēbās, fīēbat, fīēbāmus, fīēbātis, fīēbant",
      "fut-act-ind": "fīam, fīēs, fīet, fīēmus, fīētis, fīent",
      "pres-act-subj": "fīam, fīās, fīat, fīāmus, fīātis, fīant",
      "impf-act-subj": "fierem, fierēs, fieret, fierēmus, fierētis, fierent",
      "pres-act-imp": "fī, fīte",
      "pres-act-inf": "fierī",
      "fut-act-inf": "factum īrī",
      gerundive: "faciendus, facienda, faciendum",
    },
    none: ["pres-act-ptc", "gerund", "fut-act-ptc"],
    note: "fīō, the passive of faciō, is irregular (A&G 204)",
  },
};

function laVerb(item: VocabItem): ClassicalWord | string {
  const cls = item.conj ?? "";
  const term = nfc(item.term);
  const w: ClassicalWord = { kind: "verb", slots: LA_VERB_SLOTS, optional: new Set(), cells: new Map(), missing: new Map() };
  if (cls === "irr") {
    const irr = LA_IRREGULAR[term];
    if (!item.dict) return `give "dict", the principal parts ("${irr ? { sum: "sum, esse, fuī, futūrus", possum: "possum, posse, potuī", eō: "eō, īre, iī, itum", ferō: "ferō, ferre, tulī, lātum", volō: "volō, velle, voluī", nōlō: "nōlō, nōlle, nōluī", mālō: "mālō, mālle, māluī", fīō: "fīō, fierī, factus sum" }[term] : "…"}")`;
    const parts = dictParts(item);
    if (parts[0] !== term) return `the term "${item.term}" should be the first principal part in dict ("${parts[0]}")`;
    if (irr) {
      const v: VerbParts = { ...irr.model, term };
      w.deponent = v.deponent;
      laVerbCells(v, w);
      for (const none of irr.none)
        for (const s of w.slots) {
          const f = s.split(".")[0];
          if (f === none || f.startsWith(none + "-") || f.split("-").includes(none)) w.cells.delete(s), w.optional.add(s);
        }
      applyTable(w, irr.forms, term);
      for (const k of Object.keys(irr.forms)) for (const s of w.slots) if ((s === k || s.startsWith(k + ".")) && w.cells.has(s)) w.cells.get(s)!.rule = `${irr.note}: ${w.cells.get(s)!.forms.join(" or ")}`;
      return w;
    }
    // Any other irregular verb: the table gives the present system; the perfect system comes from dict.
    const deponent = /or$/.test(term);
    const v = verbTail({ cls: "irr", deponent, semi: false, term }, parts.slice(2), deponent);
    if (typeof v === "string") return v;
    w.deponent = deponent;
    laVerbCells(v, w);
    for (const s of w.slots) if (!w.cells.has(s) && !w.missing.has(s.split(".")[0])) w.missing.set(s.split(".")[0], `an irregular verb's present system comes from its table: give forms.${s.split(".")[0]}`);
    return w;
  }
  const v = laVerbParts(item, cls);
  if (typeof v === "string") return v;
  w.deponent = v.deponent;
  laVerbCells(v, w, { noPassive: v.semi });
  return w;
}

// ---------------------------------------------------------------------------------------------
// Pronouns: tables only.

function laPron(item: VocabItem): ClassicalWord | string {
  const f = item.forms ?? {};
  const gendered = Object.keys(f).some((k) => k.split(".").length === 3) || ["sg.nom", "sg", "pl"].some((k) => typeof f[k] === "string" && (k === "sg.nom" ? [3] : [15, 18]).includes(f[k]!.split(",").length));
  const slots = gendered ? adjSlots(LA_CASES) : nounSlots(LA_CASES, false);
  // The vocative is rare for pronouns: drilled only when the table gives it.
  const w: ClassicalWord = { kind: "pron", slots, optional: new Set(slots.filter((s) => s.split(".")[1] === "voc")), cells: new Map(), missing: new Map() };
  if (!Object.keys(f).length) return `pronouns come from their table: give forms ("sg": "ego, meī, mihi, mē, mē", "pl": …; see docs/COURSE_FORMAT.md)`;
  for (const s of slots) w.missing.set(s, `pronouns come from their table: give forms.${s.split(".")[0]}`);
  return w;
}

// ---------------------------------------------------------------------------------------------
// Entry points

const cache = new WeakMap<VocabItem, ClassicalWord | string>();

/** A Latin word's forms, or why it can't be inflected. */
export function laWord(item: VocabItem): ClassicalWord | string {
  const hit = cache.get(item);
  if (hit) return hit;
  const cls = item.conj ?? "";
  let w: ClassicalWord | string;
  if (LA_NOUN_CLASSES.includes(cls)) {
    w = laNoun(item);
    // A noun the rules can't make (plural-only arma, paterfamiliās…) can still be drilled from
    // its table; slots the table leaves out stay missing with the reason, or `—` marks them absent.
    if (typeof w === "string" && item.forms && Object.keys(item.forms).length) {
      const why = w;
      const ww: ClassicalWord = { kind: "noun", slots: nounSlots(LA_CASES, true), optional: new Set(), cells: new Map(), missing: new Map() };
      for (const sl of ww.slots) ww.missing.set(sl, why);
      w = ww;
    }
  }
  else if (LA_ADJ_CLASSES.includes(cls)) {
    w = laAdj(item);
    // An adjective the rules can't make (vetus, veteris…) can be drilled from its table.
    if (typeof w === "string" && item.forms && Object.keys(item.forms).length) {
      const why = w;
      const ww: ClassicalWord = { kind: "adj", slots: [...adjSlots(LA_CASES), "comparative.m", "comparative.f", "comparative.n", "superlative.m", "superlative.f", "superlative.n"], optional: new Set(["comparative.m", "comparative.f", "comparative.n", "superlative.m", "superlative.f", "superlative.n"]), cells: new Map(), missing: new Map() };
      for (const sl of ww.slots) if (!ww.optional.has(sl)) ww.missing.set(sl, why);
      w = ww;
    }
  }
  else if (LA_VERB_CLASSES.includes(cls)) w = laVerb(item);
  else if (cls === "pron") w = laPron(item);
  else w = `"${cls}" isn't a Latin class (${[...LA_NOUN_CLASSES, ...LA_ADJ_CLASSES, "pron", ...LA_VERB_CLASSES].join(", ")})`;
  if (typeof w !== "string" && item.forms) {
    const table = item.forms;
    for (const k of Object.keys(table)) if (k === "long" || k === "short" || k === "prefix") return (cache.set(item, `forms.${k} is for Greek`), `forms.${k} is for Greek`);
    const problems = applyTable(w, table, item.term, []);
    if (problems.length) w = problems[0];
  }
  cache.set(item, w);
  return w;
}

/** Warnings for a Latin word to look at again (not errors). */
export function laWordWarnings(item: VocabItem): string[] {
  const out: string[] = [];
  const cls = item.conj ?? "";
  const parts = dictParts(item);
  const [nom, gen] = parts;
  if (cls === "decl3" && nom && gen && /(is|ēs)$/.test(nom) && gen.split(/[aeiouāēīōū]+/).length === nom.split(/[aeiouāēīōū]+/).length)
    out.push(`"${nom}, ${gen}" has as many syllables in the nominative as the genitive: most such nouns are i-stems (decl3-i), except canis, iuvenis, pater, māter, frāter, senex`);
  if (cls === "decl3" && nom && gen && /^[^aeiouāēīōū]*[aeiouāēīōū][^aeiouāēīōū]*(s|x)$/.test(nom) && /[^aeiouāēīōū]{2}is$/.test(gen))
    out.push(`"${nom}, ${gen}": a one-syllable nominative with a stem in two consonants is usually an i-stem (urbs, mōns, nox): check decl3-i`);
  if (cls === "decl3-i" && nom && /(is)$/.test(nom) && ["turris", "puppis", "febris", "secūris", "sitis", "tussis", "vīs", "Tiberis", "nāvis", "ignis", "clāvis", "messis", "restis"].includes(nom) && !item.forms)
    out.push(`"${nom}" has an accusative in -im and/or ablative in -ī (A&G 75, 76): give forms "sg.acc"/"sg.abl"`);
  if (cls === "decl4" && nom && ["artus", "tribus", "lacus", "partus", "specus", "portus", "genū", "verū", "quercus", "arcus"].includes(nom) && !item.forms)
    out.push(`"${nom}" may have the dative and ablative plural in -ubus (A&G 92 c): check its forms`);
  if (cls === "decl5" && nom && !["diēs", "rēs"].includes(nom)) out.push(`only diēs and rēs have a full plural (A&G 98): give forms "pl" or noForms for the plural cases`);
  if (cls === "decl2" && nom && /ius$/.test(nom) && !["fīlius", "genius"].includes(nom) && !/^[A-Z]/.test(nom)) out.push(`"${nom}": the vocative in -ī is for proper names, fīlius and genius (A&G 49 c): check sg.voc`);
  if (["v1", "v2", "v3", "v3-io", "v4"].includes(cls) && parts.length === 3 && !/or$/.test(item.term) && !/ sum$/.test(parts[2])) out.push(`"${item.term}" has no supine in dict: its perfect passive and participles aren't drilled`);
  if (cls === "v3" && /^(dīcō|dūcō|faciō)$/.test(nfc(item.term)) === false && /(dīc|dūc)ō$/.test(nfc(item.term))) out.push(`compound of dīcō/dūcō: imperative ${nfc(item.term).slice(0, -1)} by rule; check it`);
  if (cls === "v3-io" && /ficiō$/.test(nfc(item.term))) out.push(`compounds of faciō with -ficiō keep -e in the imperative (cōnfice)`);
  return out;
}

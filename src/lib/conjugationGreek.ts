// Ancient Greek (Attic) inflection: nouns, adjectives and verbs generated from the dictionary
// entry (`dict`: "ἀνήρ, ἀνδρός, ὁ"; six principal parts for verbs) with full polytonic accents,
// breathings and iota subscripts, NFC. Accents follow the rules (Smyth): recessive for finite
// verbs, persistent for nouns and adjectives, with the contraction, genitive -ῶν, oxytone
// genitive/dative, monosyllabic-stem and -αι/-οι (optative) rules. When a form's accent hangs on
// a vowel of unknown length the word must say (`forms.long`/`forms.short`); anything the rules
// can't settle (-μι verbs, irregular augments, consonant-stem perfect middles) needs a table.
// Data format: docs/COURSE_FORMAT.md, "Latin and Greek inflection".

import type { VocabItem } from "./types";
import {
  GENDERS,
  GRC_CASES,
  IMP_GRC,
  PERSONS,
  adjSlots,
  applyTable,
  dictParts,
  nfc,
  nounSlots,
  type Cell,
  type ClassicalWord,
} from "./conjugationClassical";
import {
  ACUTE,
  CIRC,
  ISUB,
  MACRON,
  BREVE,
  ROUGH,
  SMOOTH,
  accentOf,
  bare,
  concat,
  contractAt,
  copy,
  isVowel,
  markLengths,
  markSyllable,
  notation,
  nuclei,
  parse,
  penult,
  persistent,
  recessive,
  render,
  stripAccents,
  type L,
} from "./greekAccent";

export const GRC_NOUN_CLASSES = ["decl1", "decl2", "decl3", "decl3-i", "decl3-eu", "decl3-s"];
export const GRC_ADJ_CLASSES = ["adj12", "adj3", "adj"];
export const GRC_VERB_CLASSES = ["omega", "contract", "irr"];

/** A form with movable ν (λύουσι(ν)): shown with (ν), typed either way. */
function nuCell(ls: L[], nu: boolean, rule: string, alts: string[] = []): Cell {
  const f = render(ls);
  if (!nu) return { forms: [f, ...alts], rule };
  return { forms: [`${f}(ν)`, ...alts], extra: [f, `${f}ν`], rule };
}

const ARTICLE: Record<string, string> = { ὁ: "m", ἡ: "f", τό: "n", "ὁ/ἡ": "c", "ὁ, ἡ": "c", "ἡ/ὁ": "c" };

// ---------------------------------------------------------------------------------------------
// Nouns

interface GNoun {
  cls: string;
  nom: L[];
  gen: L[];
  gender: string;
  hintLong?: string;
  hintShort?: string;
}

/** Endings: `|` separates cases (nom gen dat acc voc), "*" marks the 1st-declension genitive plural -ῶν. */
interface Shape {
  sg: (string | null)[];
  pl: (string | null)[];
}

function genderOfArticle(tok: string | undefined, field: string | undefined): string | undefined {
  if (tok && ARTICLE[nfc(tok)]) return ARTICLE[nfc(tok)];
  const t = (field ?? "").toLowerCase().replace(/\.$/, "");
  return ({ m: "m", masc: "m", masculine: "m", f: "f", fem: "f", feminine: "f", n: "n", neut: "n", neuter: "n", c: "c" } as Record<string, string>)[t];
}

/** Apply hints (forms.long / forms.short: the vowel letters, e.g. "ι") to a stem. */
function hinted(ls: L[], long?: string, short?: string): L[] {
  const out = copy(ls);
  for (const n of nuclei(out)) {
    if (n.diph || n.len !== "?") continue;
    const v = out[n.i].b.toLowerCase();
    if (long?.includes(v)) out[n.i].m.add(MACRON);
    else if (short?.includes(v)) out[n.i].m.add(BREVE);
  }
  return out;
}

/** "-ου" → the full genitive from the nominative (1st and 2nd declension only). */
function fullGenitive(cls: string, nom: string, gen: string): string | undefined {
  if (!gen.startsWith("-")) return gen;
  const e = bare(gen.slice(1));
  const n = bare(nom);
  if (cls === "decl2" && e === "ου" && /(ος|ον)$/.test(n)) return n.slice(0, -2) + "ου";
  if (cls === "decl1") {
    if (e === "ης" && /(η|α)$/.test(n)) return n.slice(0, -1) + "ης";
    if (e === "ας" && /α$/.test(n)) return n.slice(0, -1) + "ας";
    if (e === "ου" && /(ης|ας)$/.test(n)) return n.slice(0, -2) + "ου";
  }
  return undefined;
}

function gNounData(item: VocabItem): GNoun | string {
  const cls = item.conj ?? "";
  if (!item.dict) return `give "dict", the dictionary entry: nominative, genitive and article ("ἀνήρ, ἀνδρός, ὁ")`;
  const parts = dictParts(item);
  if (parts.length < 2) return `dict "${item.dict}" needs the nominative, genitive and article ("λόγος, λόγου, ὁ")`;
  const [nomS, genRaw, art] = parts;
  if (nfc(item.term) !== nomS) return `the term "${item.term}" should be the nominative in dict ("${nomS}")`;
  const gender = genderOfArticle(art, item.gender);
  if (art && !ARTICLE[nfc(art)]) return `dict "${item.dict}": the third part should be the article ὁ, ἡ or τό`;
  if (!gender) return `give the article (ὁ, ἡ or τό) at the end of dict ("${nomS}, ${genRaw}, ὁ")`;
  const genS = fullGenitive(cls, nomS, genRaw);
  if (!genS) return `can't expand the genitive "${genRaw}": write it in full ("φύλαξ, φύλακος, ὁ")`;
  const f = item.forms ?? {};
  const nom = parse(nomS);
  if (!accentOf(nom) && nuclei(nom).length) return `the nominative "${nomS}" needs its accent`;
  // An abbreviated genitive carries no accent: it is placed by rule below.
  const gen = parse(genS);
  return { cls, nom, gen, gender, hintLong: f.long, hintShort: f.short };
}

/** Built-in tables: syncopated and irregular nouns (Smyth 262, 284, 285). */
const GRC_NOUN_TABLES: Record<string, { sg: string; pl: string; note: string }> = {
  πατήρ: { sg: "πατήρ, πατρός, πατρί, πατέρα, πάτερ", pl: "πατέρες, πατέρων, πατράσι(ν), πατέρας, πατέρες", note: "πατήρ is a syncopated stem (Smyth 262)" },
  μήτηρ: { sg: "μήτηρ, μητρός, μητρί, μητέρα, μῆτερ", pl: "μητέρες, μητέρων, μητράσι(ν), μητέρας, μητέρες", note: "μήτηρ is a syncopated stem (Smyth 262)" },
  θυγάτηρ: { sg: "θυγάτηρ, θυγατρός, θυγατρί, θυγατέρα, θύγατερ", pl: "θυγατέρες, θυγατέρων, θυγατράσι(ν), θυγατέρας, θυγατέρες", note: "θυγάτηρ is a syncopated stem (Smyth 262)" },
  ἀνήρ: { sg: "ἀνήρ, ἀνδρός, ἀνδρί, ἄνδρα, ἄνερ", pl: "ἄνδρες, ἀνδρῶν, ἀνδράσι(ν), ἄνδρας, ἄνδρες", note: "ἀνήρ is irregular (Smyth 262 a)" },
  γυνή: { sg: "γυνή, γυναικός, γυναικί, γυναῖκα, γύναι", pl: "γυναῖκες, γυναικῶν, γυναιξί(ν), γυναῖκας, γυναῖκες", note: "γυνή is irregular (Smyth 284)" },
  ναῦς: { sg: "ναῦς, νεώς, νηΐ, ναῦν, ναῦ", pl: "νῆες, νεῶν, ναυσί(ν), ναῦς, νῆες", note: "ναῦς is irregular (Smyth 278)" },
};
/** Built-in adjective tables (Smyth 311). */
const GRC_ADJ_TABLES: Record<string, { forms: Record<string, string>; note: string }> = {
  μέγας: {
    forms: {
      sg: "μέγας, μεγάλη, μέγα, μεγάλου, μεγάλης, μεγάλου, μεγάλῳ, μεγάλῃ, μεγάλῳ, μέγαν, μεγάλην, μέγα, μεγάλε/μέγας, μεγάλη, μέγα",
      pl: "μεγάλοι, μεγάλαι, μεγάλα, μεγάλων, μεγάλων, μεγάλων, μεγάλοις, μεγάλαις, μεγάλοις, μεγάλους, μεγάλας, μεγάλα, μεγάλοι, μεγάλαι, μεγάλα",
    },
    note: "μέγας: μεγα- in the masculine and neuter nominative and accusative singular, μεγαλ- elsewhere (Smyth 311)",
  },
  πολύς: {
    forms: {
      sg: "πολύς, πολλή, πολύ, πολλοῦ, πολλῆς, πολλοῦ, πολλῷ, πολλῇ, πολλῷ, πολύν, πολλήν, πολύ, —, —, —",
      pl: "πολλοί, πολλαί, πολλά, πολλῶν, πολλῶν, πολλῶν, πολλοῖς, πολλαῖς, πολλοῖς, πολλούς, πολλάς, πολλά, —, —, —",
    },
    note: "πολύς: πολυ- in the masculine and neuter nominative and accusative singular, πολλ- elsewhere (Smyth 311)",
  },
};

/** A 1st-declension noun's group, for class-specific unlocks: decl1-eta (τιμή), decl1-alpha (χώρα),
 *  decl1-short (θάλαττα, μοῖρα), decl1-masc (πολίτης, νεανίας). Undefined when dict doesn't parse. */
export function grcDecl1Group(item: VocabItem): string | undefined {
  const d = gNounData({ ...item, conj: "decl1" });
  if (typeof d === "string") return undefined;
  if (d.gender === "m") return "decl1-masc";
  const nb = bare(d.nom);
  if (nb.endsWith("η")) return "decl1-eta";
  if (!nb.endsWith("α")) return undefined;
  if (bare(d.gen).endsWith("ης")) return "decl1-short";
  const acc = accentOf(d.nom);
  const n = nuclei(d.nom).length;
  return acc && (acc.pos === n - 3 || (acc.pos === n - 2 && acc.accent === CIRC)) ? "decl1-short" : "decl1-alpha";
}

/** Third-declension nouns whose genitive plural doesn't accent the ending (Smyth 252 a). */
const MONO_EXCEPT = ["παῖς", "δμώς", "θώς", "Τρώς", "δᾴς", "οὖς", "φῶς"];

function gNoun(item: VocabItem): ClassicalWord | string {
  const builtin = GRC_NOUN_TABLES[nfc(item.term)];
  if (builtin && dictParts(item)[0] === nfc(item.term)) {
    const w: ClassicalWord = { kind: "noun", slots: nounSlots(GRC_CASES, false), optional: new Set(), cells: new Map(), missing: new Map() };
    applyTable(w, { sg: builtin.sg, pl: builtin.pl }, item.term);
    for (const c of w.cells.values()) c.rule = builtin.note;
    return w;
  }
  const d = gNounData(item);
  if (typeof d === "string") return d;
  const w: ClassicalWord = { kind: "noun", slots: nounSlots(GRC_CASES, false), optional: new Set(), cells: new Map(), missing: new Map() };
  const p = gNounCells(d, w, item);
  return p ?? w;
}

function lengthReason(word: string, hint?: string) {
  return `the accent of some forms depends on the length of a vowel in "${word}": give forms.long or forms.short with the vowel (α, ι or υ)${hint ? ` (${hint})` : ""}`;
}

function gNounCells(d: GNoun, w: ClassicalWord, item: VocabItem): string | undefined {
  const { cls, nom, gender } = d;
  const nomS = render(nom);
  const nb = bare(nom);
  const set = (slot: string, ls: L[] | null, rule: string, nu = false) => {
    if (!ls) {
      w.missing.set(slot, lengthReason(nomS));
      return;
    }
    w.cells.set(slot, nuCell(ls, nu, rule));
  };
  const acc = accentOf(nom);
  if (!acc) return `the nominative "${nomS}" needs its accent`;
  const target = acc.pos;
  const oxytone = acc.pos === nuclei(nom).length - 1;
  w.cells.set("sg.nom", { forms: [nomS], rule: "the nominative, as in the dictionary entry" });

  if (cls === "decl1" || cls === "decl2") {
    const genB = bare(d.gen);
    let endN: string; // the nominative ending removed to get the stem
    let shape: Shape;
    let what: string;
    let stemLen: "L" | "S" | undefined; // 1st declension -α: long or short
    if (cls === "decl2") {
      if (!genB.endsWith("ου")) return `2nd declension nouns have the genitive in -ου ("${render(d.gen)}")`;
      if (gender === "n") {
        if (!nb.endsWith("ον")) return `2nd declension neuters end in -ον ("${nomS}")`;
        endN = "ον";
        shape = { sg: [null, "ου", "ῳ", "ον", "ον"], pl: ["α", "ων", "οις", "α", "α"] };
      } else {
        if (!nb.endsWith("ος")) return `2nd declension masculines and feminines end in -ος ("${nomS}"); contracted nouns (νοῦς) need a table`;
        endN = "ος";
        shape = { sg: [null, "ου", "ῳ", "ον", "ε"], pl: ["οι", "ων", "οις", "ους", "οι"] };
      }
      what = "2nd declension";
    } else {
      what = "1st declension";
      if (gender === "m") {
        if (!genB.endsWith("ου")) return `1st declension masculines have the genitive in -ου ("${render(d.gen)}")`;
        if (nb.endsWith("ης")) {
          endN = "ης";
          shape = { sg: [null, "ου", "ῃ", "ην", nb.endsWith("της") ? "α" : "η"], pl: ["αι", "*", "αις", "α:ς", "αι"] };
        } else if (nb.endsWith("ας")) {
          endN = "ας";
          shape = { sg: [null, "ου", "ᾳ", "α:ν", "α:"], pl: ["αι", "*", "αις", "α:ς", "αι"] };
        } else return `1st declension masculines end in -ης or -ας ("${nomS}")`;
      } else {
        if (nb.endsWith("η")) {
          if (!genB.endsWith("ης")) return `"${nomS}": a 1st declension noun in -η has the genitive in -ης`;
          endN = "η";
          shape = { sg: [null, "ης", "ῃ", "ην", "η"], pl: ["αι", "*", "αις", "α:ς", "αι"] };
        } else if (nb.endsWith("α")) {
          endN = "α";
          const n = nuclei(nom).length;
          // The length of the final α: shown by the accent where it can be (Smyth 216–219).
          const shortByAccent = acc.pos === n - 3 || (acc.pos === n - 2 && acc.accent === CIRC);
          const pen = nuclei(nom)[n - 2];
          const longByAccent = acc.pos === n - 2 && acc.accent === ACUTE && pen?.len === "L";
          if (genB.endsWith("ης")) {
            if (longByAccent) return `"${nomS}" with the genitive in -ης should have a short α, but its accent shows a long one`;
            stemLen = "S";
            shape = { sg: [null, "ης", "ῃ", "αν", "α"], pl: ["αι", "*", "αις", "α:ς", "αι"] };
          } else if (genB.endsWith("ας")) {
            if (!/[ειρ]α$/.test(nb)) return `"${nomS}": -α with the genitive -ας comes after ε, ι or ρ; check the genitive`;
            stemLen = shortByAccent ? "S" : "L";
            shape = stemLen === "L" ? { sg: [null, "α:ς", "ᾳ", "α:ν", "α:"], pl: ["αι", "*", "αις", "α:ς", "αι"] } : { sg: [null, "α:ς", "ᾳ", "αν", "α"], pl: ["αι", "*", "αις", "α:ς", "αι"] };
          } else return `"${nomS}": the genitive of a 1st declension noun in -α ends in -ας or -ης`;
        } else return `1st declension feminines end in -η or -α ("${nomS}")`;
      }
    }
    const stem = hinted(stripAccents(nom).slice(0, nom.length - [...endN].length), d.hintLong, d.hintShort);
    // A circumflex in the nominative shows a long vowel there.
    const stemMarked = acc.accent === CIRC ? markSyllable(stem, target, "L") : stem;
    const forms = (num: "sg" | "pl") => (num === "sg" ? shape.sg : shape.pl);
    for (const num of ["sg", "pl"] as const)
      GRC_CASES.forEach((c, i) => {
        let e = forms(num)[i];
        if (e === null) return;
        const slot = `${num}.${c}`;
        if (e === "*") {
          // 1st declension genitive plural: always -ῶν (Smyth 214 b).
          const ls = persistent(concat(stemMarked, notation("ων")), target, { onUltima: true, ultimaCirc: true });
          return set(slot, ls, `${what}: the genitive plural is always -ῶν`);
        }
        const gd = c === "gen" || c === "dat";
        const ls = persistent(concat(stemMarked, notation(e)), target, { ultimaCirc: oxytone && gd });
        set(slot, ls, `${what}: -${render(notation(e))}${oxytone && gd ? "; an oxytone takes a circumflex in the genitive and dative" : ""}; the accent stays on the syllable of the nominative as far as the ultima allows`);
      });
    return checkGen(w, item);
  }

  if (cls === "decl3") {
    const genB = bare(d.gen);
    if (!genB.endsWith("ος")) return `3rd declension nouns have the genitive in -ος ("${render(d.gen)}"); πόλις-type nouns are decl3-i, βασιλεύς decl3-eu, γένος decl3-s`;
    const gacc = accentOf(d.gen);
    if (!gacc) return `the genitive "${render(d.gen)}" needs its accent`;
    let stem = stripAccents(d.gen).slice(0, d.gen.length - 2);
    if (isVowel(stem[stem.length - 1])) return `"${nomS}" has a vowel stem (${render(stem)}-): use decl3-i or decl3-eu, or give a table`;
    // The genitive shows the length of its accented penult: acute = short, circumflex = long.
    const gns = nuclei(d.gen);
    if (gacc.pos === gns.length - 2) stem = markSyllable(stem, gacc.pos, gacc.accent === CIRC ? "L" : "S");
    if (acc.accent === CIRC && nuclei(stem)[target]) stem = markSyllable(stem, target, "L");
    stem = hinted(stem, d.hintLong, d.hintShort);
    const mono = nuclei(nom).length === 1;
    if (!mono && gacc.pos !== acc.pos)
      return `the genitive "${render(d.gen)}" in dict doesn't match the rules for ${cls}: the accent should stay on the syllable it has in "${nomS}" (persistent accent); check the accents, or give a table`;
    // One-syllable stems keep the nominative's accent outside the genitive and dative (θήρ, θῆρα).
    const gt = mono ? acc.pos : gacc.pos;
    const neut = gender === "n";
    const rule = (e: string, extra = "") => `3rd declension: stem ${render(stem)}- + -${e}${extra}`;
    const form = (e: string, gd: boolean) => persistent(concat(stem, notation(e)), gt, mono && gd ? { onUltima: true, ultimaCirc: true } : {});
    const monoNote = (gd: boolean) => (mono && gd ? "; one-syllable stems accent the ending in the genitive and dative" : "");
    set("sg.gen", form("ος", true), rule("ος", monoNote(true)));
    set("sg.dat", form("ι", true), rule("ι", monoNote(true)));
    // Dative plural: the stem's last consonant meets σ (Smyth 250).
    const dp = datPlural(stem);
    const dls = persistent(concat(dp.stem, notation(dp.end ?? "σι")), gt, mono ? { onUltima: true, ultimaCirc: true } : {});
    set("pl.dat", dls, `3rd declension dative plural: ${dp.how} + -σι(ν)${monoNote(true)}`, true);
    const monoGenPl = mono && !MONO_EXCEPT.includes(nomS);
    set("pl.gen", persistent(concat(stem, notation("ων")), gt, monoGenPl ? { onUltima: true, ultimaCirc: true } : {}), rule("ων", monoGenPl ? monoNote(true) : mono ? `; ${nomS} is an exception: the genitive plural keeps the stem accent` : ""));
    if (neut) {
      for (const c of ["acc", "voc"]) w.cells.set(`sg.${c}`, { forms: [nomS], rule: `Neuters: the ${c === "acc" ? "accusative" : "vocative"} is the nominative` });
      for (const c of ["nom", "acc", "voc"]) set(`pl.${c}`, form("α", false), rule("α", " (neuter plural)"));
    } else {
      const dental = /[τδθ]$/.test(bare(stem));
      // Barytone -ις/-υς with a dental stem: accusative in -ν (χάριν; Smyth 247).
      if (dental && /(ις|υς)$/.test(nb) && !oxytone) w.cells.set("sg.acc", { forms: [render(nom).replace(/ς$/, "ν")], rule: `Barytone nouns in -ις/-υς with a dental stem take -ν in the accusative (χάριν)` });
      else set("sg.acc", form("α", false), rule("α"));
      for (const c of ["nom", "voc"]) set(`pl.${c}`, form("ες", false), rule("ες"));
      set("pl.acc", form("ας", false), rule("ας"));
      // Vocative singular (Smyth 248, 249).
      const sb = bare(stem);
      if (/ι[τδθ]$/.test(sb)) w.cells.set("sg.voc", { forms: [render(nom).replace(/ς$/, "")], rule: `Stems in -ιδ/-ιτ drop the dental in the vocative (${render(nom).replace(/ς$/, "")})` });
      else if (/ντ$/.test(sb)) set("sg.voc", recessive(stem.slice(0, -1)), `Stems in -ντ drop the τ in the vocative`);
      else if (/[νρλ]$/.test(sb) && !oxytone) set("sg.voc", recessive(stem), `Barytone stems in ν or ρ use the bare stem as the vocative, with recessive accent`);
      else w.cells.set("sg.voc", { forms: [nomS], rule: "the vocative is the nominative" });
    }
    return checkGen(w, item);
  }

  if (cls === "decl3-i") {
    if (!nb.endsWith("ις") || bare(d.gen) !== nb.slice(0, -2) + "εως") return `decl3-i is for nouns like πόλις, πόλεως ("${nomS}, ${render(d.gen)}")`;
    const stem = stripAccents(nom).slice(0, nom.length - 2);
    const e = (x: string, o: { shortUltima?: boolean } = {}) => persistent(concat(stem, notation(x)), target, o);
    const r = "3rd declension ι-stem (πόλις): the accent stays on the syllable of the nominative; -εως and -εων count as short (Smyth 163 a, 268)";
    set("sg.gen", e("εως", { shortUltima: true }), r);
    set("sg.dat", e("ει"), r);
    set("sg.acc", e("ιν"), r);
    set("sg.voc", e("ι"), r);
    for (const c of ["nom", "acc", "voc"]) set(`pl.${c}`, e("εις"), r);
    set("pl.gen", e("εων", { shortUltima: true }), r);
    set("pl.dat", e("εσι"), r, true);
    return;
  }

  if (cls === "decl3-eu") {
    if (!nb.endsWith("ευς") || !oxytone) return `decl3-eu is for nouns like βασιλεύς, βασιλέως ("${nomS}")`;
    const stem = stripAccents(nom).slice(0, nom.length - 3);
    const r = "3rd declension ευ-stem (βασιλεύς), Smyth 275";
    const fx = (x: string) => concat(stem, notation(x));
    set("sg.gen", fx("έως"), r);
    set("sg.dat", fx("εῖ"), r);
    set("sg.acc", fx("έα:"), r);
    set("sg.voc", fx("εῦ"), r);
    for (const c of ["nom", "voc"]) w.cells.set(`pl.${c}`, { forms: [render(fx("ῆς")), render(fx("εῖς"))], rule: `${r}: -ῆς, later -εῖς` });
    set("pl.gen", fx("έων"), r);
    set("pl.dat", fx("εῦσι"), r, true);
    set("pl.acc", fx("έα:ς"), r);
    return;
  }

  if (cls === "decl3-s") {
    if (gender !== "n" || !nb.endsWith("ος") || bare(d.gen) !== nb.slice(0, -2) + "ους") return `decl3-s is for neuters like γένος, γένους ("${nomS}"); masculine sigma stems (Σωκράτης) need a table`;
    let stem = stripAccents(nom).slice(0, nom.length - 2);
    if (acc.accent === CIRC) stem = markSyllable(stem, target, "L");
    stem = hinted(stem, d.hintLong, d.hintShort);
    const e = (x: string, o = {}) => persistent(concat(stem, notation(x)), target, o);
    const r = "3rd declension σ-stem neuter (γένος < γενεσ-): ε contracts with the ending";
    set("sg.gen", e("ους"), r);
    set("sg.dat", e("ει"), r);
    for (const c of ["acc", "voc"]) w.cells.set(`sg.${c}`, { forms: [nomS], rule: `Neuters: the ${c === "acc" ? "accusative" : "vocative"} is the nominative` });
    for (const c of ["nom", "acc", "voc"]) set(`pl.${c}`, e("η"), `${r} (-εα → -η)`);
    set("pl.gen", e("ων", { onUltima: true, ultimaCirc: true }), `${r}: -έων → -ῶν`);
    set("pl.dat", e("εσι"), r, true);
    return;
  }
  return `"${cls}" isn't a Greek noun class`;
}

/** A dictionary genitive that the rules don't reproduce is reported (wrong accent or class). */
function checkGen(w: ClassicalWord, item: VocabItem): string | undefined {
  const made = w.cells.get("sg.gen")?.forms[0];
  const given = nfc(dictParts(item)[1] ?? "");
  if (made && !given.startsWith("-") && made !== given) return `the genitive "${given}" in dict doesn't match the rules for ${item.conj} (${made}): check its accent and the class, or give a table`;
  return undefined;
}

/** Dative plural stems (Smyth 250, 209). */
function datPlural(stem: L[]): { stem: L[]; how: string; end?: string } {
  const b = bare(stem);
  let s = copy(stem);
  const last = b.slice(-1);
  if (/ντ$/.test(b)) {
    s = s.slice(0, -2);
    const v = s[s.length - 1];
    const lv = v.b.toLowerCase();
    if (lv === "ο") s.push({ b: "υ", m: new Set() });
    else if (lv === "ε") s.push({ b: "ι", m: new Set() });
    else if (lv === "α" || lv === "ι" || lv === "υ") (v.m.delete(BREVE), v.m.add(MACRON));
    return { stem: s, how: "ντ drops before σ and the vowel lengthens" };
  }
  if (/[τδθ]$/.test(b)) {
    s = s.slice(0, -1);
    const b2 = bare(s);
    if (/[κγχ]$/.test(b2)) return { stem: [...s.slice(0, -1), { b: "ξ", m: new Set() }], how: "the dental drops and κ, γ, χ + σ → ξ", end: "ι" };
    return { stem: s, how: "τ, δ, θ drop before σ" };
  }
  if (last === "ν") return { stem: s.slice(0, -1), how: "ν drops before σ" };
  if (/[κγχ]/.test(last)) return { stem: [...s.slice(0, -1), { b: "ξ", m: new Set() }], how: "κ, γ, χ + σ → ξ", end: "ι" };
  if (/[πβφ]/.test(last)) return { stem: [...s.slice(0, -1), { b: "ψ", m: new Set() }], how: "π, β, φ + σ → ψ", end: "ι" };
  if (last === "σ") return { stem: s.slice(0, -1), how: "σσ → σ" };
  return { stem: s, how: `the stem ${render(stem)}-` };
}

// ---------------------------------------------------------------------------------------------
// Adjectives

function gAdj(item: VocabItem): ClassicalWord | string {
  const cls = item.conj ?? "";
  const w: ClassicalWord = { kind: "adj", slots: adjSlots(GRC_CASES), optional: new Set(), cells: new Map(), missing: new Map() };
  if (!item.dict) return cls === "adj12" ? `give "dict", the dictionary entry ("ἀγαθός, -ή, -όν"; "ἄξιος, -α, -ον"; "ἄδικος, -ον")` : `give "dict", the dictionary entry ("ἀληθής, -ές"; "σώφρων, -ον")`;
  const parts = dictParts(item);
  const m = parts[0];
  if (nfc(item.term) !== m) return `the term "${item.term}" should be the masculine nominative in dict ("${m}")`;
  const builtin = GRC_ADJ_TABLES[m];
  if (builtin) {
    applyTable(w, builtin.forms, item.term);
    for (const c of w.cells.values()) c.rule = builtin.note;
    return w;
  }
  if (cls === "adj") {
    // Table-only adjectives (πᾶς, ἡδύς, numerals with genders…).
    for (const s of w.slots) w.missing.set(s, `"adj" adjectives come from their table: give forms ("sg": the 15 forms, nominative to vocative, each masculine, feminine, neuter; "pl": the same)`);
    if (!item.forms) return `"adj" adjectives come from their table: give forms ("sg", "pl"; see docs/COURSE_FORMAT.md)`;
    return w;
  }
  const mL = parse(m);
  const acc = accentOf(mL);
  if (!acc) return `"${m}" needs its accent`;
  const target = acc.pos;
  const oxy = acc.pos === nuclei(mL).length - 1;
  const f = item.forms ?? {};
  const set = (slot: string, ls: L[] | null, rule: string, nu = false) => {
    if (!ls) return void w.missing.set(slot, lengthReason(m));
    w.cells.set(slot, nuCell(ls, nu, rule));
  };
  if (cls === "adj12") {
    if (!bare(m).endsWith("ος")) return `1st/2nd declension adjectives end in -ος ("${m}")`;
    let fem: "η" | "α:" | null;
    if (parts.length === 2) fem = null;
    else if (parts.length === 3) {
      const fb = bare(parts[1].replace(/^-/, ""));
      fem = fb.endsWith("η") ? "η" : fb.endsWith("α") ? "α:" : (undefined as never);
      if (fem === undefined) return `the feminine "${parts[1]}" should end in -η or -α`;
    } else return `dict "${item.dict}" needs the nominatives ("ἀγαθός, -ή, -όν"; two endings: "ἄδικος, -ον")`;
    let stem = hinted(stripAccents(mL).slice(0, mL.length - 2), f.long, f.short);
    if (acc.accent === CIRC) stem = markSyllable(stem, target, "L");
    if (fem === "α:" && !/[ειρ]$/.test(bare(stem))) return `"${m}": a feminine in -α comes after ε, ι or ρ; otherwise it's -η`;
    const masc = { sg: ["ος", "ου", "ῳ", "ον", "ε"], pl: ["οι", "ων", "οις", "ους", "οι"] };
    const neut = { sg: ["ον", "ου", "ῳ", "ον", "ον"], pl: ["α", "ων", "οις", "α", "α"] };
    const feminine = fem && { sg: [fem, fem + "ς", fem === "η" ? "ῃ" : "ᾳ", fem + "ν", fem], pl: ["αι", "ων", "αις", "α:ς", "αι"] };
    for (const num of ["sg", "pl"] as const)
      GRC_CASES.forEach((c, i) => {
        const gd = c === "gen" || c === "dat";
        for (const g of GENDERS) {
          const tab = g === "m" ? masc : g === "n" ? neut : feminine ?? masc;
          const e = tab[num][i];
          const rule = `${fem ? "1st/2nd" : "2nd"} declension adjective${!fem && g === "f" ? " of two endings (the feminine is like the masculine)" : ""}: -${render(notation(e))}${oxy && gd ? "; an oxytone takes a circumflex in the genitive and dative" : ""}${g === "f" && c === "gen" && num === "pl" && fem ? "; the feminine genitive plural is accented like the masculine" : ""}`;
          set(`${num}.${c}.${g}`, persistent(concat(stem, notation(e)), target, { ultimaCirc: oxy && gd }), rule);
        }
      });
    w.cells.set("sg.nom.m", { forms: [m], rule: "the masculine nominative, as in the dictionary entry" });
    return w;
  }
  if (cls === "adj3") {
    const mb = bare(m);
    if (mb.endsWith("ης")) {
      if (!oxy) return `"${m}": only oxytone adjectives in -ης (ἀληθής) are generated; give a table`;
      const stem = stripAccents(mL).slice(0, mL.length - 2);
      const r = "3rd declension σ-stem adjective (ἀληθής < ἀληθεσ-): ε contracts with the ending (Smyth 292)";
      const mf = { sg: ["ής", "οῦς", "εῖ", "ῆ", "ές"], pl: ["εῖς", "ῶν", "έσι", "εῖς", "εῖς"] };
      const n = { sg: ["ές", "οῦς", "εῖ", "ές", "ές"], pl: ["ῆ", "ῶν", "έσι", "ῆ", "ῆ"] };
      for (const num of ["sg", "pl"] as const)
        GRC_CASES.forEach((c, i) => {
          for (const g of GENDERS) {
            const e = (g === "n" ? n : mf)[num][i];
            set(`${num}.${c}.${g}`, concat(stem, notation(e)), r, e === "έσι");
          }
        });
      return w;
    }
    if (mb.endsWith("ων")) {
      const stem = hinted(stripAccents(mL).slice(0, mL.length - 2), f.long, f.short);
      const r = "3rd declension ν-stem adjective (σώφρων, σῶφρον): recessive accent (Smyth 290)";
      const mf = { sg: ["ων", "ονος", "ονι", "ονα", "ον"], pl: ["ονες", "ονων", "οσι", "ονας", "ονες"] };
      const n = { sg: ["ον", "ονος", "ονι", "ον", "ον"], pl: ["ονα", "ονων", "οσι", "ονα", "ονα"] };
      for (const num of ["sg", "pl"] as const)
        GRC_CASES.forEach((c, i) => {
          for (const g of GENDERS) {
            const e = (g === "n" ? n : mf)[num][i];
            set(`${num}.${c}.${g}`, recessive(concat(stem, notation(e))), r, e === "οσι");
          }
        });
      return w;
    }
    return `generated 3rd declension adjectives end in -ης (ἀληθής) or -ων (σώφρων); "${m}" needs a table`;
  }
  return `"${cls}" isn't a Greek adjective class`;
}

// ---------------------------------------------------------------------------------------------
// Verbs

const SIX = (s: string) => s.split(" ");
const T = {
  act: { ind: SIX("ω εις ει ομεν ετε ουσι(ν)"), subj: SIX("ω ῃς ῃ ωμεν ητε ωσι(ν)"), opt: SIX("οιμι οις οι^ οιμεν οιτε οιεν"), imp: SIX("ε ετω ετε οντων"), inf: "ειν", ptc: SIX("ων ουσα ον") },
  mp: { ind: SIX("ομαι ῃ/ει εται ομεθα εσθε ονται"), subj: SIX("ωμαι ῃ ηται ωμεθα ησθε ωνται"), opt: SIX("οιμην οιο οιτο οιμεθα οισθε οιντο"), imp: SIX("ου εσθω εσθε εσθων"), inf: "εσθαι", ptc: SIX("ομενος ομενη ομενον") },
  impfAct: SIX("ον ες ε(ν) ομεν ετε ον"),
  impfMp: SIX("ομην ου ετο ομεθα εσθε οντο"),
  aor1: { ind: SIX("α ας ε(ν) αμεν ατε αν"), opt: SIX("αιμι αις/ειας αι^/ειε(ν) αιμεν αιτε αιεν/ειαν"), imp: SIX("ον ατω ατε αντων"), ptc: SIX("α:ς α:σα αν") },
  aor1Mid: { ind: SIX("αμην ω ατο αμεθα ασθε αντο"), opt: SIX("αιμην αιο αιτο αιμεθα αισθε αιντο"), imp: SIX("αι ασθω ασθε ασθων"), inf: "ασθαι", ptc: SIX("αμενος αμενη αμενον") },
  pass: { ind: SIX("ην ης η ημεν ητε ησαν"), subj: SIX("ῶ ῇς ῇ ῶμεν ῆτε ῶσι(ν)"), opt: SIX("είην είης είη εῖμεν/είημεν εῖτε/είητε εῖεν/είησαν"), imp: SIX("ητι ητω ητε εντων"), inf: "ῆναι", ptc: SIX("είς εῖσα έν") },
  perfAct: { ind: SIX("α ας ε(ν) αμεν ατε α:σι(ν)"), inf: "έναι", ptc: SIX("ώς υῖα ός") },
  plpfAct: SIX("η/ειν ης/εις ει(ν) εμεν ετε εσαν"),
  perfMp: { ind: SIX("μαι σαι ται μεθα σθε νται"), inf: "σθαι", ptc: SIX("μένος μένη μένον") },
  plpfMp: SIX("μην σο το μεθα σθε ντο"),
  /** Attic contract optative, active singular (τιμῴην, ποιοίην, δηλοίην; Smyth 393). */
  contractOpt: SIX("οιην/οιμι οιης/οις οιη/οι^ οιμεν οιτε οιεν"),
};

const FINITE_MOODS = ["ind", "subj", "opt"];
export const GRC_VERB_FORMS: string[] = [
  ...["act", "mp"].flatMap((v) => ["ind", "subj", "opt", "imp", "inf", "ptc"].map((m) => `pres-${v}-${m}`)),
  "impf-act-ind",
  "impf-mp-ind",
  ...["act", "mid", "pass"].flatMap((v) => ["ind", "opt", "inf", "ptc"].map((m) => `fut-${v}-${m}`)),
  ...["act", "mid", "pass"].flatMap((v) => ["ind", "subj", "opt", "imp", "inf", "ptc"].map((m) => `aor-${v}-${m}`)),
  ...["act", "mp"].flatMap((v) => ["ind", "inf", "ptc"].map((m) => `perf-${v}-${m}`)),
  "plpf-act-ind",
  "plpf-mp-ind",
];
export const GRC_VERB_SLOTS: string[] = GRC_VERB_FORMS.flatMap((f) => {
  const m = f.split("-")[2];
  if (FINITE_MOODS.includes(m)) return PERSONS.map((p) => `${f}.${p}`);
  if (m === "imp") return IMP_GRC.map((p) => `${f}.${p}`);
  if (m === "ptc") return GENDERS.map((g) => `${f}.${g}`);
  return [f];
});

/** Verbs whose imperfect augment is ει- (Smyth 431). */
const EI_AUGMENT = ["ἔχω", "ἕπομαι", "ἐργάζομαι", "ἐάω", "ἐθίζω", "ἕλκω", "ἕρπω", "ἑστιάω", "ἑλίσσω", "ἕλκω"];
/** Verbs that also take ἠ- (Smyth 430). */
const ETA_AUGMENT = ["βούλομαι", "δύναμαι", "μέλλω"];
/** Second aorist imperatives accented on the ending (Smyth 424 b). */
const OXYTONE_IMP: Record<string, true> = { εὑρίσκω: true, λαμβάνω: true, λέγω: true, ἔρχομαι: true, ὁράω: true };
/** 2nd singular middle in -ει only (Smyth 628). */
const EI_ONLY = ["βούλομαι", "οἴομαι", "ὄψομαι"];

const TEMPORAL: Record<string, string> = { α: "η", ε: "η", ο: "ω", ι: "ι:", υ: "υ:", αι: "ῃ", ει: "ῃ", οι: "ῳ", αυ: "ηυ", ευ: "ηυ", ου: "ου", η: "η", ω: "ω", ᾳ: "ᾳ", ῃ: "ῃ", ῳ: "ῳ" };

/** The augmented forms of a stem (no accents), the usual first (Smyth 428–437). */
function augments(stem: L[], term: string): L[][] {
  const st = stripAccents(stem);
  const first = st[0];
  if (!first) return [];
  if (!isVowel(first)) {
    if (first.b === "ρ") {
      const rest = copy(st.slice(1));
      return [[{ b: "ἐ".normalize("NFD")[0], m: new Set([SMOOTH]) }, { b: "ρ", m: new Set() }, { b: "ρ", m: new Set() }, ...rest]];
    }
    const out = [[{ b: "ε", m: new Set([SMOOTH]) }, ...copy(st)]];
    if (ETA_AUGMENT.includes(term)) out.push([{ b: "η", m: new Set([SMOOTH]) }, ...copy(st)]);
    return out;
  }
  const n0 = nuclei(st)[0];
  const init = render(stripAccents(st.slice(n0.i, n0.j + 1)).map((l) => ({ b: l.b, m: new Set([...l.m].filter((x) => x === ISUB)) })));
  const breathing = [SMOOTH, ROUGH].find((x) => st.slice(n0.i, n0.j + 1).some((l) => l.m.has(x))) ?? SMOOTH;
  const rest = copy(st.slice(n0.j + 1));
  const make = (v: string) => {
    const ls = notation(v);
    ls[ls.length - 1].m.add(breathing);
    return [...ls, ...rest];
  };
  const alts: string[] = [];
  if (EI_AUGMENT.includes(term) && init === "ε") alts.push("ει");
  if (TEMPORAL[init]) alts.push(TEMPORAL[init]);
  if (init === "ει" || init === "ευ") alts.push(init);
  return [...new Set(alts)].map(make);
}

/** Remove the augment of a principal part, given the unaugmented present stem. */
function unaugment(part: L[], present: L[], term: string): L[] | null {
  const pres = stripAccents(present);
  const p = bare(part);
  const vowel = isVowel(pres[0]);
  const presInit = vowel ? pres.slice(0, nuclei(pres)[0].j + 1) : pres[0].b === "ρ" ? [{ b: "ρ", m: new Set([ROUGH]) }] : [];
  for (const a of augments(pres, term)) {
    const n = vowel ? nuclei(a)[0].j + 1 : pres[0].b === "ρ" ? 3 : 1;
    const augInit = bare(a.slice(0, n));
    const next = vowel ? "" : pres[0].b === "ρ" ? "" : bare(pres.slice(0, 1));
    if (p.startsWith(augInit + next)) return [...copy(presInit), ...stripAccents(part).slice(n)];
  }
  return null;
}

// --- Compound verbs: forms.prefix ("προσ" for προσβάλλω). The simplex is generated and the
// prefix attached: augment after the prefix, a final vowel elided before a vowel (not περί,
// πρό), aspirated before a rough breathing (ἀφ-, καθ-), ἐκ → ἐξ, assimilated συλ-/συμ-/ἐμ- → συν-,
// ἐν- before a vowel. The accent doesn't go back past the augment or the prefix's last syllable.

const NO_ELISION = ["περι", "προ"];
const ASSIMILATED: Record<string, string> = { συλ: "συν", συμ: "συν", συγ: "συν", συρ: "συν", συσ: "συν", συ: "συν", ἐμ: "ἐν", ἐγ: "ἐν", ἐλ: "ἐν", ἐρ: "ἐν" };
const ASPIRATE: Record<string, string> = { π: "φ", τ: "θ", κ: "χ" };

/** The prefix as it stands before a vowel (with a rough breathing or not). */
function prefixBeforeVowel(p: string, rough: boolean): string {
  let b = bare(p);
  if (ASSIMILATED[b]) return ASSIMILATED[b];
  if (b === "ἐκ") return "ἐξ";
  if (/[αεηιουω]$/.test(b) && !NO_ELISION.includes(b)) b = b.slice(0, -1);
  if (rough && ASPIRATE[b.slice(-1)]) b = b.slice(0, -1) + ASPIRATE[b.slice(-1)];
  return b;
}

/** Strip the prefix from a principal part: the simplex form, or null. */
function stripPrefix(part: string, p: string): string | null {
  const word = bare(part);
  const ls = parse(part);
  const tries: [string, boolean][] = [[bare(p), false], [prefixBeforeVowel(p, false), false], [prefixBeforeVowel(p, true), true]];
  if (bare(p) === "ἐξ") tries.push(["ἐκ", false]);
  for (const [cand, rough] of tries.sort((a, b) => b[0].length - a[0].length)) {
    if (!word.startsWith(cand)) continue;
    const n = [...cand.normalize("NFD")].filter((c) => !/\p{M}/u.test(c)).length;
    const rest = copy(ls.slice(n));
    if (!rest.length) continue;
    if (isVowel(rest[0])) {
      const n0 = nuclei(rest)[0];
      const has = rest.slice(n0.i, n0.j + 1).some((l) => l.m.has(SMOOTH) || l.m.has(ROUGH));
      if (!has) rest[n0.j].m.add(rough ? ROUGH : SMOOTH);
    }
    return render(rest);
  }
  return null;
}

/** Put the prefix back on a (simplex) stem. */
function attach(p: string, stem: L[]): L[] {
  if (!stem.length || !isVowel(stem[0])) return [...parse(bare(p)), ...copy(stem)];
  const out = copy(stem);
  const n0 = nuclei(out)[0];
  const rough = out.slice(n0.i, n0.j + 1).some((l) => l.m.has(ROUGH));
  for (let k = n0.i; k <= n0.j; k++) out[k].m.delete(SMOOTH), out[k].m.delete(ROUGH);
  return [...parse(prefixBeforeVowel(p, rough)), ...out];
}

interface Stem {
  ls: L[];
  /** Name for hints and messages. */
  name: "present" | "future" | "aorist" | "perfect";
}

interface GVerb {
  term: string;
  deponent: boolean;
  contract?: "α" | "ε" | "ο";
  pres: L[];
  impf?: L[][];
  impfWhy?: string;
  fut?: { ls: L[]; contract: boolean; middle: boolean };
  aor?: { ls: L[]; aug: L[]; second: boolean; middle: boolean };
  aorWhy?: string;
  perfAct?: { ls: L[] };
  perfMp?: { ls: L[] };
  perfMpWhy?: string;
  aorPass?: { ls: L[]; aug: L[]; second: boolean };
  aorPassWhy?: string;
  long: string[];
  short: string[];
  dash: Set<number>;
  /** Compound verbs: the prefix (forms.prefix); the stems above are the simplex's. */
  prefix?: string;
}

const isDash = (s: string | undefined) => !!s && /^[—–-]+$/.test(s.trim());

function gVerbData(item: VocabItem): GVerb | string {
  const cls = item.conj ?? "";
  const term = nfc(item.term);
  if (!item.dict) return `give "dict", the six principal parts ("λύω, λύσω, ἔλυσα, λέλυκα, λέλυμαι, ἐλύθην"; — for a missing part)`;
  const parts = dictParts(item);
  if (parts.length !== 6) return `dict "${item.dict}" needs all six principal parts, with — for a part the verb lacks (it has ${parts.length})`;
  if (parts[0] !== term) return `the term "${item.term}" should be the first principal part in dict ("${parts[0]}")`;
  const f = item.forms ?? {};
  const prefix = f.prefix ? nfc(f.prefix).replace(/-$/, "") : undefined;
  if (prefix) {
    for (let i = 0; i < parts.length; i++) {
      if (isDash(parts[i])) continue;
      const simple = stripPrefix(parts[i], prefix);
      if (!simple) return `forms.prefix "${prefix}": the principal part "${parts[i]}" doesn't start with it (or its elided form)`;
      parts[i] = simple;
    }
    return gVerbSimplex(cls, parts, f, prefix);
  }
  return gVerbSimplex(cls, parts, f, undefined);
}

function gVerbSimplex(cls: string, parts: string[], f: NonNullable<VocabItem["forms"]>, prefix: string | undefined): GVerb | string {
  const term = parts[0];
  const words = (s: string | undefined) => (s ?? "").split(/[\s,]+/).filter(Boolean);
  const long = words(f.long);
  const short = words(f.short);
  for (const k of [...long, ...short]) if (!["present", "future", "aorist", "perfect"].includes(k)) return `forms.long and forms.short name verb stems: present, future, aorist or perfect ("${k}")`;
  const p1 = parse(term);
  const b1 = bare(p1);
  const deponent = b1.endsWith("ομαι");
  if (!deponent && !b1.endsWith("ω")) return `"${term}" should end in -ω or -ομαι; -μι verbs need a table (conj "irr")`;
  let pres = stripAccents(p1).slice(0, p1.length - (deponent ? 4 : 1));
  let contract: GVerb["contract"];
  if (cls === "contract") {
    const v = bare(pres).slice(-1);
    if (!["α", "ε", "ο"].includes(v)) return `contract verbs are written uncontracted, ending in -άω, -έω or -όω ("${term}")`;
    contract = v as GVerb["contract"];
    pres = [...pres.slice(0, -1), { ...pres[pres.length - 1], m: new Set([...pres[pres.length - 1].m, ...(v === "α" ? [BREVE] : [])]) }];
  } else if (/[αεο]$/.test(bare(pres)) && cls === "omega") return `"${term}" ends in -${bare(pres).slice(-1)}ω: use conj "contract"`;
  const mark = (ls: L[], name: Stem["name"]) => (long.includes(name) ? markLengths(ls, "L") : short.includes(name) ? markLengths(ls, "S") : ls);
  pres = mark(pres, "present");
  const v: GVerb = { term, deponent, contract, pres, long, short, dash: new Set(), prefix };
  parts.forEach((p, i) => isDash(p) && v.dash.add(i + 1));
  // Future.
  if (!isDash(parts[1])) {
    const p = parse(parts[1]);
    const b = bare(p);
    const circ = accentOf(p)?.accent === CIRC;
    if (b.endsWith("ομαι")) {
      const c = b.endsWith("ουμαι") && circ;
      v.fut = { ls: mark(stripAccents(p).slice(0, p.length - (c ? 5 : 4)), "future"), contract: c, middle: true };
      if (c) v.fut.ls.push({ b: "ε", m: new Set() });
    } else if (b.endsWith("ω")) {
      v.fut = { ls: mark(stripAccents(p).slice(0, p.length - 1), "future"), contract: circ, middle: false };
      if (circ) v.fut.ls.push({ b: "ε", m: new Set() });
    } else return `the future "${parts[1]}" should end in -ω or -ομαι`;
  }
  // Aorist.
  if (!isDash(parts[2])) {
    const p = parse(parts[2]);
    const b = bare(p);
    let end: number;
    let second: boolean;
    let middle = false;
    if (b.endsWith("αμην")) (end = 4), (second = false), (middle = true);
    else if (b.endsWith("ομην")) (end = 4), (second = true), (middle = true);
    else if (b.endsWith("ον")) (end = 2), (second = true);
    else if (b.endsWith("α")) (end = 1), (second = false);
    else return `the aorist "${parts[2]}" should end in -α, -ον, -άμην or -όμην (-μι aorists need a table)`;
    const aug = stripAccents(p).slice(0, p.length - end);
    const un = unaugment(aug, stripAccents(p1), term);
    if (!un) v.aorWhy = `the aorist ${parts[2]} isn't the augmented stem of ${term}: give the aorist forms (and the imperfect)`;
    else v.aor = { ls: mark(un, "aorist"), aug: mark(aug, "aorist"), second, middle };
  }
  if (!isDash(parts[3])) {
    const p = parse(parts[3]);
    if (!bare(p).endsWith("α")) return `the perfect "${parts[3]}" should end in -α`;
    v.perfAct = { ls: stripAccents(p).slice(0, p.length - 1) };
  }
  if (!isDash(parts[4])) {
    const p = parse(parts[4]);
    const b = bare(p);
    if (!b.endsWith("μαι")) return `the perfect middle "${parts[4]}" should end in -μαι`;
    const st = stripAccents(p).slice(0, p.length - 3);
    if (!isVowel(st[st.length - 1])) v.perfMpWhy = `${parts[4]} has a consonant stem (assimilation, periphrastic 3rd plural): give the perfect and pluperfect middle forms`;
    else v.perfMp = { ls: mark(st, "perfect") };
  }
  if (!isDash(parts[5])) {
    const p = parse(parts[5]);
    if (!bare(p).endsWith("ην")) return `the aorist passive "${parts[5]}" should end in -ην`;
    const aug = stripAccents(p).slice(0, p.length - 2);
    const un = unaugment(aug, stripAccents(p1), term);
    if (!un) v.aorPassWhy = `the aorist passive ${parts[5]} isn't the augmented stem of ${term}: give its forms`;
    else v.aorPass = { ls: un, aug, second: !bare(un).endsWith("θ") };
  }
  // The imperfect's augment: checked against the aorist's where there is one (ει-verbs are known).
  if ((v.aorWhy || v.aorPassWhy) && !EI_AUGMENT.includes(term)) v.impfWhy = `the aorist's augment isn't regular, so the imperfect isn't guessed: give forms.impf-act-ind${deponent ? "" : " / impf-mp-ind"}`;
  else v.impf = augments(pres, term).map((a) => (long.includes("present") ? markLengths(a, "L") : short.includes("present") ? markLengths(a, "S") : a));
  return v;
}

/** The kinds of accent an ending takes. */
type Acc = "rec" | "pen" | "fixed";
const hasAccent = (s: string) => /[́͂̀]/.test(s.normalize("NFD"));

interface Made {
  ls: L[] | null;
  nu: boolean;
}

/** Stem + ending with its accent; contract verbs contract at the stem's last vowel. */
function make(stem: L[], ending: string, acc: Acc, o: { contract?: boolean; min?: number; spurious?: boolean } = {}): Made {
  // A contracted -ε(ν) has no movable ν (ἐτίμαε → ἐτίμα).
  const nu = ending.endsWith("(ν)") && !(o.contract && ending === "ε(ν)");
  const e = notation(ending.replace("(ν)", ""));
  let ls = concat(stem, e);
  const fixed = hasAccent(ending);
  if (fixed) ls = concat(stripAccents(stem), e);
  else if (acc === "rec") ls = recessive(ls, o.min) as L[];
  else if (acc === "pen") ls = penult(ls) as L[];
  if (!ls) return { ls: null, nu };
  if (o.contract) ls = contractAt(ls, stem.length - 1, o.spurious) as L[];
  return { ls, nu };
}

function gVerb(item: VocabItem): ClassicalWord | string {
  const v = gVerbData(item);
  if (typeof v === "string") return v;
  // A compound: put the prefix on every stem; the accent stays at or after the prefix's last
  // syllable, and at or after the augment in augmented forms (Smyth 426).
  // Syllables before the simplex: the accent may go back to the last of them, or (augmented) not past the augment.
  const pre0 = v.prefix;
  const pn = (stem: L[]) => (pre0 ? nuclei(stem).length - nuclei(parse(stripPrefix(render(stem), pre0) ?? render(stem))).length : 0);
  const minFor = (stem: L[], augmented: boolean) => (pre0 ? Math.max(0, augmented ? pn(stem) : pn(stem) - 1) : 0);
  if (v.prefix) {
    const pre = v.prefix;
    const at = (ls: L[]) => attach(pre, ls);
    v.pres = at(v.pres);
    if (v.impf) v.impf = v.impf.map(at);
    if (v.fut) v.fut.ls = at(v.fut.ls);
    if (v.aor) (v.aor.ls = at(v.aor.ls)), (v.aor.aug = at(v.aor.aug));
    if (v.aorPass) (v.aorPass.ls = at(v.aorPass.ls)), (v.aorPass.aug = at(v.aorPass.aug));
    if (v.perfAct) v.perfAct.ls = at(v.perfAct.ls);
    if (v.perfMp) v.perfMp.ls = at(v.perfMp.ls);
  }
  const w: ClassicalWord = { kind: "verb", slots: GRC_VERB_SLOTS, optional: new Set(), cells: new Map(), missing: new Map() };
  const why = (stem: string) => `the accent of some ${stem} forms depends on the length of the ${stem} stem's vowel (α, ι or υ): give forms.long or forms.short "${stem}"`;
  const put = (slot: string, m: Made | Made[], rule: string, stemName: string) => {
    const ms = Array.isArray(m) ? m : [m];
    if (ms.some((x) => !x.ls)) return void w.missing.set(slot, why(stemName));
    const forms: string[] = [];
    const extra: string[] = [];
    for (const x of ms) {
      const r = render(x.ls!);
      if (x.nu) forms.push(`${r}(ν)`), extra.push(r, `${r}ν`);
      else forms.push(r);
    }
    w.cells.set(slot, { forms: [...new Set(forms)], ...(extra.length ? { extra } : {}), rule });
  };
  const alts = (cellEnd: string) => cellEnd.split("/");
  const absent = (prefix: string) => w.slots.filter((s) => s.startsWith(prefix)).forEach((s) => w.optional.add(s));
  const row = (form: string, stem: L[], ends: string[], persons: readonly string[], rule: string, stemName: string, o: { contract?: boolean; acc?: Acc; min?: number } = {}) =>
    persons.forEach((p, i) => put(`${form}.${p}`, alts(ends[i]).map((e) => make(stem, e, o.acc ?? "rec", { min: minFor(stem, /^(impf|plpf)|^aor-(act|mid|pass)-ind/.test(form)), ...o })), rule, stemName));
  const ptc = (form: string, stem: L[], ends: string[], rule: string, stemName: string, o: { contract?: boolean } = {}) => {
    // The masculine is recessive (or fixed); the feminine and neuter keep its syllable (Smyth 425).
    let target = 0;
    if (!hasAccent(ends[0])) {
      const m = recessive(concat(stem, notation(ends[0])));
      if (!m) return GENDERS.forEach((g) => w.missing.set(`${form}.${g}`, why(stemName)));
      target = accentOf(m)!.pos;
    }
    GENDERS.forEach((g, i) => {
      let ls: L[] | null = hasAccent(ends[i]) ? concat(stripAccents(stem), notation(ends[i])) : persistent(concat(stem, notation(ends[i])), target);
      if (ls && o.contract) ls = contractAt(ls, stem.length - 1);
      put(`${form}.${g}`, { ls, nu: false }, rule, stemName);
    });
  };
  const c = !!v.contract;
  const cname = v.contract ? `-${v.contract}ω contract verb` : "";
  // --- Present system.
  const P = v.pres;
  const voices: ("act" | "mp")[] = v.deponent ? ["mp"] : ["act", "mp"];
  if (v.deponent) absent("pres-act"), absent("impf-act");
  for (const vo of voices) {
    const t = T[vo];
    const what = `${c ? cname + ": " : "Thematic verb: "}present stem ${render(P)}- + ${vo === "act" ? "active" : "middle/passive"} endings${c ? ", then contraction (the accent follows the contracted syllable)" : ", recessive accent"}`;
    const ind = vo === "mp" && EI_ONLY.includes(v.term) ? t.ind.map((e, i) => (i === 1 ? "ει" : e)) : t.ind;
    row(`pres-${vo}-ind`, P, ind, PERSONS, what, "present", { contract: c });
    row(`pres-${vo}-subj`, P, t.subj, PERSONS, what, "present", { contract: c });
    row(`pres-${vo}-opt`, P, vo === "act" && c ? T.contractOpt : t.opt, PERSONS, `${what}${vo === "act" && c ? "; Attic -οίην in the singular" : "; final -οι counts as long in the optative"}`, "present", { contract: c });
    row(`pres-${vo}-imp`, P, t.imp, IMP_GRC, what, "present", { contract: c });
    put(`pres-${vo}-inf`, make(P, t.inf, "rec", { contract: c, spurious: vo === "act" }), `${what}${c && vo === "act" ? " (-ειν is a spurious diphthong: -άειν → -ᾶν, -όειν → -οῦν)" : ""}`, "present");
    ptc(`pres-${vo}-ptc`, P, t.ptc, `${what}; participles keep the accent of the masculine`, "present", { contract: c });
    if (v.impf) {
      const ends = vo === "act" ? T.impfAct : T.impfMp;
      const augRule = `Imperfect: augment + present stem (${v.impf.map((a) => render(a)).join(" or ")}-) + secondary endings${c ? ", contracted" : ""}`;
      PERSONS.forEach((p, i) => put(`impf-${vo}-ind.${p}`, v.impf!.flatMap((a) => alts(ends[i]).map((e) => make(a, e, "rec", { contract: c, min: minFor(a, true) }))), augRule, "present"));
    } else for (const s of w.slots.filter((x) => x.startsWith(`impf-${vo}`))) w.missing.set(s, v.impfWhy!);
  }
  // --- Future.
  if (v.fut) {
    const F = v.fut.ls;
    const fc = v.fut.contract;
    const fv: ("act" | "mid")[] = v.fut.middle ? ["mid"] : ["act", "mid"];
    if (v.fut.middle) absent("fut-act");
    for (const vo of fv) {
      const t = T[vo === "act" ? "act" : "mp"];
      const what = `Future: ${render(F)}- (from the second principal part) + ${vo === "act" ? "active" : "middle"} endings${fc ? ", contracted like -έω" : ""}`;
      row(`fut-${vo}-ind`, F, t.ind, PERSONS, what, "future", { contract: fc });
      row(`fut-${vo}-opt`, F, fc && vo === "act" ? T.contractOpt : t.opt, PERSONS, what, "future", { contract: fc });
      put(`fut-${vo}-inf`, make(F, t.inf, "rec", { contract: fc, spurious: vo === "act" }), what, "future");
      ptc(`fut-${vo}-ptc`, F, t.ptc, `${what}; participles keep the accent of the masculine`, "future", { contract: fc });
    }
  } else if (v.dash.has(2)) absent("fut-act"), absent("fut-mid");
  // --- Aorist active and middle.
  if (v.aor) {
    const A = v.aor.ls;
    const AG = v.aor.aug;
    const two = v.aor.second;
    const name = two ? "Second aorist" : "First aorist";
    const avs: ("act" | "mid")[] = v.aor.middle ? ["mid"] : v.deponent ? ["mid"] : ["act", "mid"];
    if (v.aor.middle || v.deponent) absent("aor-act");
    for (const vo of avs) {
      const what = `${name} ${vo === "act" ? "active" : "middle"}: ${render(A)}-`;
      if (two) {
        const t = T[vo === "act" ? "act" : "mp"];
        row(`aor-${vo}-ind`, AG, vo === "act" ? T.impfAct : T.impfMp, PERSONS, `${what}, augmented ${render(AG)}-, with the imperfect's endings`, "aorist");
        row(`aor-${vo}-subj`, A, t.subj, PERSONS, `${what} + subjunctive endings`, "aorist");
        row(`aor-${vo}-opt`, A, t.opt, PERSONS, `${what} + optative endings`, "aorist");
        const imp = vo === "act" ? [OXYTONE_IMP[v.term] ? "έ" : "ε", "ετω", "ετε", "οντων"] : ["οῦ", "εσθω", "εσθε", "εσθων"];
        row(`aor-${vo}-imp`, A, imp, IMP_GRC, `${what} + imperative endings${vo === "mid" ? " (2nd singular -οῦ)" : OXYTONE_IMP[v.term] ? " (this verb's 2nd singular is oxytone)" : ""}`, "aorist");
        put(`aor-${vo}-inf`, make(A, vo === "act" ? "εῖν" : "έσθαι", "fixed"), `${what}: the second aorist infinitive is accented ${vo === "act" ? "-εῖν" : "-έσθαι"}`, "aorist");
        ptc(`aor-${vo}-ptc`, A, vo === "act" ? ["ών", "οῦσα", "όν"] : T.mp.ptc, `${what}${vo === "act" ? ": the participle is oxytone (-ών, -οῦσα, -όν)" : ""}`, "aorist");
      } else {
        const t = vo === "act" ? T.aor1 : T.aor1Mid;
        row(`aor-${vo}-ind`, AG, t.ind, PERSONS, `${what}, augmented ${render(AG)}-`, "aorist");
        row(`aor-${vo}-subj`, A, vo === "act" ? T.act.subj : T.mp.subj, PERSONS, `${what} + subjunctive endings`, "aorist");
        row(`aor-${vo}-opt`, A, t.opt, PERSONS, `${what} + optative endings (final -αι counts as long in the optative)`, "aorist");
        row(`aor-${vo}-imp`, A, t.imp, IMP_GRC, `${what} + imperative endings${vo === "mid" ? " (2nd singular -αι, short for the accent)" : ""}`, "aorist");
        put(`aor-${vo}-inf`, vo === "act" ? make(A, "αι", "pen") : make(A, T.aor1Mid.inf, "rec"), vo === "act" ? `${what}: the infinitive -αι is accented on the penult` : `${what} + -ασθαι`, "aorist");
        ptc(`aor-${vo}-ptc`, A, t.ptc, `${what}; participles keep the accent of the masculine`, "aorist");
      }
    }
  } else if (v.aorWhy) for (const s of w.slots.filter((x) => /^aor-(act|mid)/.test(x))) w.missing.set(s, v.aorWhy);
  else if (v.dash.has(3)) absent("aor-act"), absent("aor-mid");
  // --- Perfect and pluperfect active.
  if (v.perfAct && !v.deponent) {
    const K = v.perfAct.ls;
    const what = `Perfect active: the reduplicated stem ${render(K)}- (fourth principal part)`;
    row("perf-act-ind", K, T.perfAct.ind, PERSONS, what, "perfect");
    put("perf-act-inf", make(K, T.perfAct.inf, "fixed"), `${what}: the infinitive is accented -έναι`, "perfect");
    ptc("perf-act-ptc", K, T.perfAct.ptc, `${what}: the participle is oxytone (-ώς, -υῖα, -ός)`, "perfect");
    const aug = plpfStem(K, v.prefix);
    row("plpf-act-ind", aug, T.plpfAct, PERSONS, `Pluperfect active: ${isVowel(K[0]) ? "" : "augment + "}the perfect stem ${render(aug)}-`, "perfect");
  } else if (v.dash.has(4) || v.deponent) absent("perf-act"), absent("plpf-act");
  // --- Perfect and pluperfect middle/passive.
  if (v.perfMp) {
    const M = v.perfMp.ls;
    const what = `Perfect middle/passive: ${render(M)}- (fifth principal part) + endings without a thematic vowel`;
    row("perf-mp-ind", M, T.perfMp.ind, PERSONS, what, "perfect");
    put("perf-mp-inf", make(M, T.perfMp.inf, "pen"), `${what}: the infinitive -σθαι is accented on the penult`, "perfect");
    ptc("perf-mp-ptc", M, T.perfMp.ptc, `${what}: the participle is accented -μένος`, "perfect");
    const aug = plpfStem(M, v.prefix);
    row("plpf-mp-ind", aug, T.plpfMp, PERSONS, `Pluperfect middle/passive: ${isVowel(M[0]) ? "" : "augment + "}${render(aug)}-`, "perfect");
  } else if (v.perfMpWhy) for (const s of w.slots.filter((x) => /^(perf|plpf)-mp/.test(x))) w.missing.set(s, v.perfMpWhy);
  else if (v.dash.has(5)) absent("perf-mp"), absent("plpf-mp");
  // --- Aorist and future passive.
  if (v.aorPass) {
    const Q = v.aorPass.ls;
    const name = v.aorPass.second ? "Second aorist passive" : "Aorist passive";
    const what = `${name}: ${render(Q)}- (sixth principal part)`;
    row("aor-pass-ind", v.aorPass.aug, T.pass.ind, PERSONS, `${what}, augmented ${render(v.aorPass.aug)}-`, "aorist");
    row("aor-pass-subj", Q, T.pass.subj, PERSONS, `${what}: the subjunctive is contracted (-ῶ, -ῇς…)`, "aorist");
    row("aor-pass-opt", Q, T.pass.opt, PERSONS, `${what}: optative -είην…`, "aorist");
    const imp = [v.aorPass.second ? "ηθι" : "ητι", ...T.pass.imp.slice(1)];
    row("aor-pass-imp", Q, imp, IMP_GRC, `${what}${v.aorPass.second ? "" : ": 2nd singular -ητι (θ…θ → θ…τ)"}`, "aorist");
    put("aor-pass-inf", make(Q, T.pass.inf, "fixed"), `${what}: the infinitive is accented -ῆναι`, "aorist");
    ptc("aor-pass-ptc", Q, T.pass.ptc, `${what}: the participle is oxytone (-είς, -εῖσα, -έν)`, "aorist");
    // Future passive: aorist passive stem + -ησ- + middle endings; deponents whose future is middle have none.
    if (v.deponent && v.fut?.middle) absent("fut-pass");
    else {
      const FP = concat(Q, notation("ησ"));
      const wf = `Future passive: the aorist passive stem ${render(Q)}- + -ησ- + middle endings`;
      row("fut-pass-ind", FP, T.mp.ind, PERSONS, wf, "aorist");
      row("fut-pass-opt", FP, T.mp.opt, PERSONS, wf, "aorist");
      put("fut-pass-inf", make(FP, T.mp.inf, "rec"), wf, "aorist");
      ptc("fut-pass-ptc", FP, T.mp.ptc, wf, "aorist");
    }
  } else if (v.aorPassWhy) for (const s of w.slots.filter((x) => /^(aor|fut)-pass/.test(x))) w.missing.set(s, v.aorPassWhy);
  else if (v.dash.has(6)) absent("aor-pass"), absent("fut-pass");
  return w;
}

/** Built-in irregular verbs (Smyth 768). Slots they don't give don't exist. */
const GRC_IRREGULAR: Record<string, { forms: Record<string, string>; note: string }> = {
  εἰμί: {
    forms: {
      "pres-act-ind": "εἰμί, εἶ, ἐστί(ν), ἐσμέν, ἐστέ, εἰσί(ν)",
      "pres-act-subj": "ὦ, ᾖς, ᾖ, ὦμεν, ἦτε, ὦσι(ν)",
      "pres-act-opt": "εἴην, εἴης, εἴη, εἶμεν/εἴημεν, εἶτε/εἴητε, εἶεν/εἴησαν",
      "pres-act-imp": "ἴσθι, ἔστω, ἔστε, ἔστων/ὄντων",
      "pres-act-inf": "εἶναι",
      "pres-act-ptc": "ὤν, οὖσα, ὄν",
      "impf-act-ind": "ἦ/ἦν, ἦσθα, ἦν, ἦμεν, ἦτε, ἦσαν",
      "fut-mid-ind": "ἔσομαι, ἔσει/ἔσῃ, ἔσται, ἐσόμεθα, ἔσεσθε, ἔσονται",
      "fut-mid-opt": "ἐσοίμην, ἔσοιο, ἔσοιτο, ἐσοίμεθα, ἔσοισθε, ἔσοιντο",
      "fut-mid-inf": "ἔσεσθαι",
      "fut-mid-ptc": "ἐσόμενος, ἐσομένη, ἐσόμενον",
    },
    note: "εἰμί is irregular (Smyth 768); the present indicative is enclitic except εἶ",
  },
};

/** The pluperfect stem: ἐ- before a consonant-reduplicated perfect, after the prefix of a compound. */
function plpfStem(perf: L[], prefix?: string): L[] {
  if (!prefix) return isVowel(perf[0]) ? perf : [{ b: "ε", m: new Set([SMOOTH]) }, ...copy(perf)];
  const simplex = parse(stripPrefix(render(perf), prefix) ?? render(perf));
  return attach(prefix, isVowel(simplex[0]) ? simplex : [{ b: "ε", m: new Set([SMOOTH]) }, ...simplex]);
}

// ---------------------------------------------------------------------------------------------
// The article and pronouns: tables.

const ARTICLE_TABLE: Record<string, string> = {
  sg: "ὁ, ἡ, τό, τοῦ, τῆς, τοῦ, τῷ, τῇ, τῷ, τόν, τήν, τό, —, —, —",
  pl: "οἱ, αἱ, τά, τῶν, τῶν, τῶν, τοῖς, ταῖς, τοῖς, τούς, τάς, τά, —, —, —",
};

function gPron(item: VocabItem): ClassicalWord | string {
  const term = nfc(item.term);
  const f: Record<string, string | undefined> = term === "ὁ" && !item.forms ? ARTICLE_TABLE : (item.forms ?? {});
  if (!Object.keys(f).length) return `pronouns come from their table: give forms ("sg": "ἐγώ, ἐμοῦ/μου, ἐμοί/μοι, ἐμέ/με, —", "pl": …; see docs/COURSE_FORMAT.md)`;
  const gendered = Object.keys(f).some((k) => k.split(".").length === 3) || ["sg", "pl"].some((k) => typeof f[k] === "string" && [12, 15].includes(f[k]!.split(",").length)) || (typeof f["sg.nom"] === "string" && f["sg.nom"]!.split(",").length === 3);
  const slots = gendered ? adjSlots(GRC_CASES) : nounSlots(GRC_CASES, false);
  return { kind: "pron", slots, optional: new Set(slots.filter((s) => s.split(".")[1] === "voc")), cells: new Map(), missing: new Map(slots.map((s) => [s, `pronouns come from their table: give forms.${s.split(".")[0]}`])) };
}

// ---------------------------------------------------------------------------------------------
// Entry points

const cache = new WeakMap<VocabItem, ClassicalWord | string>();

/** A Greek word's forms, or why it can't be inflected. */
export function grcWord(item: VocabItem): ClassicalWord | string {
  const hit = cache.get(item);
  if (hit) return hit;
  const cls = item.conj ?? "";
  let w: ClassicalWord | string;
  if (GRC_NOUN_CLASSES.includes(cls)) w = gNoun(item);
  else if (GRC_ADJ_CLASSES.includes(cls)) w = gAdj(item);
  else if (cls === "omega" || cls === "contract") w = gVerb(item);
  else if (cls === "irr" && GRC_IRREGULAR[nfc(item.term)]) {
    const b = GRC_IRREGULAR[nfc(item.term)];
    const ww: ClassicalWord = { kind: "verb", slots: GRC_VERB_SLOTS, optional: new Set(GRC_VERB_SLOTS), cells: new Map(), missing: new Map() };
    applyTable(ww, b.forms, item.term);
    for (const c of ww.cells.values()) c.rule = b.note;
    w = ww;
  } else if (cls === "irr") {
    if (!item.forms || !Object.keys(item.forms).length) w = `irregular verbs come from their table: give forms ("pres-act-ind": "δίδωμι, δίδως, δίδωσι(ν), δίδομεν, δίδοτε, διδόᾱσι(ν)", …)`;
    else {
      const ww: ClassicalWord = { kind: "verb", slots: GRC_VERB_SLOTS, optional: new Set(), cells: new Map(), missing: new Map() };
      for (const s of GRC_VERB_SLOTS) ww.missing.set(s, `irregular verbs come from their table: give forms.${s.split(".")[0]}`);
      w = ww;
    }
  } else if (cls === "pron") w = gPron(item);
  else w = `"${cls}" isn't a Greek class (${[...GRC_NOUN_CLASSES, ...GRC_ADJ_CLASSES, "pron", ...GRC_VERB_CLASSES].join(", ")})`;
  if (typeof w !== "string") {
    const table = cls === "pron" && nfc(item.term) === "ὁ" && !item.forms ? ARTICLE_TABLE : item.forms;
    if (table) {
      const problems = applyTable(w, table, item.term);
      if (problems.length) w = problems[0];
    }
  }
  if (typeof w !== "string") for (const c of w.cells.values()) c.forms = c.forms.map(nfc);
  cache.set(item, w);
  return w;
}

/** Warnings for a Greek word to look at again (not errors). */
export function grcWordWarnings(item: VocabItem): string[] {
  const out: string[] = [];
  const term = nfc(item.term);
  const cls = item.conj ?? "";
  if ((cls === "omega" || cls === "contract") && /^(ἀπο|ἀπ|ἀφ|ἐπι|ἐπ|ἐφ|κατα|κατ|καθ|μετα|μετ|μεθ|παρα|παρ|ἀνα|δια|ὑπο|ὑπ|ὑφ|ἀντι|ἀμφι|περι|προσ|προ|συν|συλ|συμ|συγ|ἐκ|ἐξ|εἰσ|ὑπερ|ἐμ|ἐγ)/.test(bare(term)))
    out.push(`"${term}" may be a compound: the augment goes after the prefix (ἀπέλυον). If the aorist shows that, the augmented forms are refused; give them as tables`);
  if (cls === "decl1" && /της$/.test(bare(term)) && term === "δεσπότης") out.push(`δεσπότης has the vocative δέσποτα: give forms "sg.voc"`);
  if (cls === "decl2" && term === "ἀδελφός") out.push(`ἀδελφός has the vocative ἄδελφε: give forms "sg.voc"`);
  if (cls === "decl3" && ["ἀνήρ", "πατήρ", "μήτηρ", "θυγάτηρ", "γυνή", "κύων", "ναῦς", "βοῦς", "Ζεύς"].includes(term)) out.push(`${term} is irregular: give its table`);
  return out;
}

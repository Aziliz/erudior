// Polytonic Greek letters, syllables and accent rules (Smyth 149–175, 424–426), for the
// inflection generator (conjugationGreek.ts). Words are arrays of letters with their marks.
// Ambiguous vowels (α, ι, υ) carry a macron or breve internally when their length is known;
// the marks are removed when a word is written out. Output is NFC.

export const ACUTE = "́";
export const GRAVE = "̀";
export const CIRC = "͂";
export const SMOOTH = "̓";
export const ROUGH = "̔";
export const ISUB = "ͅ";
export const DIAER = "̈";
export const MACRON = "̄";
export const BREVE = "̆";
/** Internal mark: a final -αι/-οι that counts as long (optative endings). */
const OPT = "^";
const ACCENTS = [ACUTE, GRAVE, CIRC];
const ORDER = [DIAER, MACRON, BREVE, SMOOTH, ROUGH, ACUTE, GRAVE, CIRC, ISUB];

export interface L {
  b: string;
  m: Set<string>;
}

const VOWELS = "αεηιουω";
const DIPHTHONGS = new Set(["αι", "ει", "οι", "υι", "αυ", "ευ", "ηυ", "ου"]);
const low = (c: string) => c.toLowerCase();
export const isVowel = (l: L | undefined) => !!l && VOWELS.includes(low(l.b));

/** Letters of a Greek word (any normalization). */
export function parse(s: string): L[] {
  const out: L[] = [];
  for (const ch of s.normalize("NFD")) {
    if (/\p{M}/u.test(ch)) {
      if (out.length) out[out.length - 1].m.add(ch === "̀" ? GRAVE : ch === "́" ? ACUTE : ch === "̓" ? SMOOTH : ch);
      continue;
    }
    out.push({ b: ch, m: new Set() });
  }
  return out;
}

/**
 * Letters from the ending notation used in the generator's tables: ":" after a vowel makes it
 * long, "^" after -αι/-οι makes it count as long (optative). Unmarked α, ι, υ are short.
 */
export function notation(s: string): L[] {
  const out: L[] = [];
  for (const ch of s.normalize("NFD")) {
    if (ch === ":") out[out.length - 1].m.add(MACRON);
    else if (ch === "^") out[out.length - 1].m.add(OPT);
    else if (/\p{M}/u.test(ch)) out[out.length - 1].m.add(ch);
    else out.push({ b: ch, m: new Set() });
  }
  // Unmarked ambiguous vowels that stand alone are short.
  for (const n of nuclei(out)) if (!n.diph && n.len === "?") out[n.i].m.add(BREVE);
  return out;
}

export const copy = (ls: L[]): L[] => ls.map((l) => ({ b: l.b, m: new Set(l.m) }));
export const stripAccents = (ls: L[]): L[] => copy(ls).map((l) => (ACCENTS.forEach((a) => l.m.delete(a)), l));

/** Write letters out: internal length marks dropped, marks in canonical order, NFC. */
export function render(ls: L[]): string {
  return ls
    .map((l) => l.b + [...l.m].filter((x) => x !== MACRON && x !== BREVE && x !== OPT).sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b)).join(""))
    .join("")
    .normalize("NFC");
}
/** A word without accents or length marks (for comparing stems). */
export const bare = (s: string | L[]) => render(stripAccents(typeof s === "string" ? parse(s) : s));

export interface Nuc {
  i: number;
  j: number;
  diph: boolean;
  /** L long, S short, ? an α, ι or υ of unknown length. */
  len: "L" | "S" | "?";
}

/** The vowel nuclei (syllables) of a word, with their natural length. */
export function nuclei(ls: L[]): Nuc[] {
  const out: Nuc[] = [];
  for (let k = 0; k < ls.length; k++) {
    const l = ls[k];
    if (!isVowel(l)) continue;
    const nx = ls[k + 1];
    const plain = !l.m.has(ISUB) && !l.m.has(MACRON) && !l.m.has(BREVE) && !l.m.has(DIAER) && !ACCENTS.some((a) => l.m.has(a)) && !l.m.has(SMOOTH) && !l.m.has(ROUGH);
    if (nx && isVowel(nx) && plain && !nx.m.has(DIAER) && !nx.m.has(MACRON) && !nx.m.has(BREVE) && DIPHTHONGS.has(low(l.b) + low(nx.b))) {
      out.push({ i: k, j: k + 1, diph: true, len: "L" });
      k++;
      continue;
    }
    const b = low(l.b);
    let len: Nuc["len"] = b === "η" || b === "ω" ? "L" : b === "ε" || b === "ο" ? "S" : "?";
    if (len === "?") len = l.m.has(MACRON) || l.m.has(CIRC) || l.m.has(ISUB) ? "L" : l.m.has(BREVE) ? "S" : "?";
    out.push({ i: k, j: k, diph: false, len });
  }
  return out;
}

/** The length of the last syllable for accent: final -αι and -οι are short, except optatives. */
export function ultimaLength(ls: L[], ns = nuclei(ls)): Nuc["len"] {
  const u = ns[ns.length - 1];
  if (!u) return "?";
  if (u.diph && u.j === ls.length - 1 && ["αι", "οι"].includes(low(ls[u.i].b) + low(ls[u.j].b)) && !ls[u.j].m.has(OPT)) return "S";
  return u.len;
}

/** Put an accent on syllable `pos` (others cleared). */
export function place(ls: L[], pos: number, accent: string): L[] {
  const out = stripAccents(ls);
  const n = nuclei(out)[pos];
  out[n.j].m.add(accent);
  return out;
}

/** Where a word's accent is: syllable index from the start, and the mark. */
export function accentOf(ls: L[]): { pos: number; accent: string } | undefined {
  const ns = nuclei(ls);
  for (let k = 0; k < ns.length; k++)
    for (let x = ns[k].i; x <= ns[k].j; x++) for (const a of ACCENTS) if (ls[x].m.has(a)) return { pos: k, accent: a === GRAVE ? ACUTE : a };
  return undefined;
}

/** Recessive accent (verbs): as far back as the ultima allows. `min`: not before this syllable. */
export function recessive(ls: L[], min = 0): L[] | null {
  const ns = nuclei(ls);
  const n = ns.length;
  if (!n) return null;
  const u = ultimaLength(ls, ns);
  if (u === "?") return null;
  let pos: number;
  if (n === 1) pos = 0;
  else if (u === "L") pos = n - 2;
  else pos = n >= 3 ? n - 3 : n - 2;
  if (pos < min) pos = Math.min(min, n - 1);
  return accentAt(ls, ns, pos, u);
}

/** Accent on syllable `pos`, acute or circumflex by the lengths (Smyth 163, 165). */
function accentAt(ls: L[], ns: Nuc[], pos: number, u: Nuc["len"], ultimaCirc = false): L[] | null {
  const n = ns.length;
  if (pos === n - 1) {
    if (n === 1 && !ultimaCirc) {
      if (ns[0].len === "?") return null;
      return place(ls, pos, ns[0].len === "L" ? CIRC : ACUTE);
    }
    return place(ls, pos, ultimaCirc && ns[pos].len === "L" ? CIRC : ACUTE);
  }
  if (pos === n - 2 && u === "S") {
    const p = ns[pos].len;
    if (p === "?") return null;
    return place(ls, pos, p === "L" ? CIRC : ACUTE);
  }
  return place(ls, pos, ACUTE);
}

/** Accent on the penult (aorist active and perfect middle infinitives). */
export function penult(ls: L[]): L[] | null {
  const ns = nuclei(ls);
  if (ns.length < 2) return null;
  const u = ultimaLength(ls, ns);
  if (u === "?") return null;
  return accentAt(ls, ns, ns.length - 2, u);
}

export interface PersistentOpts {
  /** The ultima takes a circumflex when long (genitive and dative of oxytones; contractions). */
  ultimaCirc?: boolean;
  /** Treat the ultima as short (-εως, -εων of πόλις: Smyth 163 a). */
  shortUltima?: boolean;
  /** Put the accent on the ultima whatever the target (monosyllabic stems, Smyth 252). */
  onUltima?: boolean;
}

/** Persistent accent (nouns, adjectives): on syllable `target` as far as the ultima allows. */
export function persistent(ls: L[], target: number, o: PersistentOpts = {}): L[] | null {
  const ns = nuclei(ls);
  const n = ns.length;
  if (!n) return null;
  const u = o.shortUltima ? "S" : ultimaLength(ls, ns);
  let pos = o.onUltima ? n - 1 : Math.min(target, n - 1);
  if (pos < n - 3) pos = n - 3;
  if (pos === n - 3 && u !== "S") {
    if (u === "?") return null;
    pos = n - 2;
  }
  if (pos === n - 2 && u === "?") return null;
  return accentAt(ls, ns, pos, u, o.ultimaCirc);
}

/** Mark the stem's unknown α, ι, υ as long or short. */
export function markLengths(ls: L[], len: "L" | "S"): L[] {
  const out = copy(ls);
  for (const n of nuclei(out)) if (!n.diph && n.len === "?") out[n.i].m.add(len === "L" ? MACRON : BREVE);
  return out;
}

/** Mark one syllable's vowel as long or short (when it's an α, ι or υ of unknown length). */
export function markSyllable(ls: L[], pos: number, len: "L" | "S"): L[] {
  const out = copy(ls);
  const n = nuclei(out)[pos];
  if (n && !n.diph && n.len === "?") out[n.i].m.add(len === "L" ? MACRON : BREVE);
  return out;
}

/** The unknown-length vowels of a word, as letters (for messages). */
export function unknownVowels(ls: L[]): string[] {
  return nuclei(ls).filter((n) => n.len === "?").map((n) => low(ls[n.i].b));
}

export const concat = (...parts: L[][]): L[] => parts.flatMap((p) => copy(p));
export const endsWith = (ls: L[], s: string) => bare(ls).endsWith(s.normalize("NFC"));
export const dropEnd = (ls: L[], count: number) => copy(ls).slice(0, ls.length - count);
export const lettersOf = (s: string) => [...s.normalize("NFD")].filter((c) => !/\p{M}/u.test(c)).length;

// ---------------------------------------------------------------------------------------------
// Contraction (Smyth 48–59) for -άω, -έω, -όω verbs and contract futures.

const CONTRACT: Record<string, Record<string, string>> = {
  α: { ε: "α:", ει: "ᾳ", η: "α:", ῃ: "ᾳ", ο: "ω", ου: "ω", ω: "ω", οι: "ῳ" },
  ε: { ε: "ει", ει: "ει", η: "η", ῃ: "ῃ", ο: "ου", ου: "ου", ω: "ω", οι: "οι" },
  ο: { ε: "ου", ει: "οι", η: "ω", ῃ: "οι", ο: "ου", ου: "ου", ω: "ω", οι: "οι" },
};
const SPURIOUS: Record<string, string> = { α: "α:", ε: "ει", ο: "ου" };

/**
 * Contract the vowel at letter `k` with the syllable after it. The accent follows Smyth 171: on
 * the first vowel it becomes a circumflex, on the second an acute; elsewhere it stays.
 * `spurious`: the following ει is the spurious diphthong of the infinitive (-ειν < -εεν).
 */
export function contractAt(ls: L[], k: number, spurious = false): L[] | null {
  const a = ls[k];
  const v = low(a.b);
  if (!CONTRACT[v]) return null;
  const ns = nuclei(ls);
  const second = ns.find((n) => n.i === k + 1);
  if (!second) return null;
  const key = render(stripAccents(ls.slice(second.i, second.j + 1))).normalize("NFC");
  const result = spurious && key === "ει" ? SPURIOUS[v] : CONTRACT[v][key];
  if (!result) return null;
  const onFirst = ACCENTS.some((x) => a.m.has(x));
  const onSecond = ls.slice(second.i, second.j + 1).some((l) => ACCENTS.some((x) => l.m.has(x)));
  const merged = notation(result);
  if (onFirst || onSecond) merged[merged.length - 1].m.add(onFirst ? CIRC : ACUTE);
  // Keep the breathing of the first vowel (initial ἐ-, ὀ- don't contract in verbs, but be safe).
  for (const br of [SMOOTH, ROUGH]) if (a.m.has(br)) merged[merged.length - 1].m.add(br);
  return [...copy(ls.slice(0, k)), ...merged, ...copy(ls.slice(second.j + 1))];
}

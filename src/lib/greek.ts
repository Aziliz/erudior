// Ancient Greek: Beta Code-style typing (ime "grc"), the marks it handles, and polytonic →
// monotonic reduction (for Greek voices). Pure functions, no DOM; tests/classical.test.mts.
//
// Typing scheme (docs/COURSE_FORMAT.md, "Latin and Greek"): TLG Beta Code letters
//   a b g d e z h q i k l m n c o p r s t u f x y w → α β γ δ ε ζ η θ ι κ λ μ ν ξ ο π ρ σ τ υ φ χ ψ ω
// plus j = ξ (as on a Greek keyboard). TLG's v (digamma ϝ) is not converted: Attic courses don't
// use it, and a learner who types v almost always means ν. Marks go after the letter in any
// order: ) smooth breathing, ( rough breathing, / acute, \ grave, = circumflex, | iota subscript,
// + diaeresis. Capitals: a capital letter, or * before the letter (TLG), with the marks before the
// letter (TLG, *)a or )A) or after it (A)). Final sigma is chosen by position. s1/s2/s3 are taken
// for TLG compatibility and give the sigma the position calls for (no lunate sigma).
// Greek typed on a device keyboard, and the converter's own output, pass through unchanged.

/** Beta Code letter → lower-case Greek letter. */
export const BETA_LETTERS: Record<string, string> = {
  a: "α", b: "β", g: "γ", d: "δ", e: "ε", z: "ζ", h: "η", q: "θ", i: "ι", k: "κ", l: "λ", m: "μ", n: "ν",
  c: "ξ", j: "ξ", o: "ο", p: "π", r: "ρ", s: "σ", t: "τ", u: "υ", f: "φ", x: "χ", y: "ψ", w: "ω",
};

/** Beta Code mark → combining character. */
export const BETA_MARKS: Record<string, string> = {
  ")": "̓", // smooth breathing (psili)
  "(": "̔", // rough breathing (dasia)
  "/": "́", // acute (oxia = tonos)
  "\\": "̀", // grave (varia)
  "=": "͂", // circumflex (perispomeni)
  "|": "ͅ", // iota subscript (ypogegrammeni)
  "+": "̈", // diaeresis (dialytika)
};

type Slot = "length" | "diaeresis" | "breathing" | "accent" | "iota";
/** The order marks are written in, so NFC composes them (ἄ = α + ̓ + ́, ΐ = ι + ̈ + ́). */
const SLOT_ORDER: Slot[] = ["length", "diaeresis", "breathing", "accent", "iota"];
const SLOT_OF: Record<string, Slot> = {
  "̄": "length", "̆": "length",
  "̈": "diaeresis",
  "̓": "breathing", "̔": "breathing", "̓": "breathing",
  "́": "accent", "̀": "accent", "͂": "accent", "́": "accent", "̀": "accent",
  "ͅ": "iota",
};

const GREEK_LETTER = /[Ͱ-Ͽἀ-῿]/;
const GREEK_BASE = /^[α-ωΑ-ΩϝϜ]$/;
const VOWEL = /^[αεηιουωΑΕΗΙΟΥΩ]$/;

/** Greek letters anywhere in the text (Greek and Coptic, Greek Extended). */
export const hasGreek = (s: string) => GREEK_LETTER.test(s);

function takes(base: string, slot: Slot): boolean {
  if (slot === "breathing") return VOWEL.test(base) || base === "ρ" || base === "Ρ";
  if (slot === "diaeresis") return /^[ιυΙΥ]$/.test(base);
  if (slot === "iota") return /^[αηωΑΗΩ]$/.test(base);
  return VOWEL.test(base);
}

interface Cluster {
  base: string;
  greek: boolean;
  marks: Partial<Record<Slot, string>>;
  /** What was typed for a cluster that isn't a letter (kept as typed). */
  raw?: string;
}

const render = (c: Cluster) => (c.raw !== undefined ? c.raw : c.base + SLOT_ORDER.map((s) => c.marks[s] ?? "").join(""));

export interface GreekTypingOptions {
  /** The learner submitted (kept for the ime interface; final sigma is already positional). */
  final?: boolean;
}

/**
 * Beta Code → polytonic Greek (NFC). Run on the whole box after every change: already-converted
 * Greek is left alone, and a mark typed (or inserted by a button, as a combining character) after
 * a Greek letter is added to it, replacing a mark of the same kind (a second accent replaces the first).
 */
export function betaToGreek(typed: string, _opts: GreekTypingOptions = {}): string {
  const chars = [...typed.normalize("NFD")];
  const out: Cluster[] = [];
  // Pending: a * and/or marks waiting for the letter they belong to (TLG: *)a, or )A).
  let cap = false;
  let pendingMarks: string[] = [];
  let pendingRaw = "";
  const flush = () => {
    if (pendingRaw) out.push({ base: "", greek: false, marks: {}, raw: pendingRaw });
    cap = false;
    pendingMarks = [];
    pendingRaw = "";
  };
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    if (ch === "*") {
      if (cap) flush();
      cap = true;
      pendingRaw += ch;
      continue;
    }
    const mark = BETA_MARKS[ch] ?? (SLOT_OF[ch] ? ch : undefined);
    if (mark) {
      const slot = SLOT_OF[mark];
      const last = out[out.length - 1];
      if (!cap && !pendingMarks.length && last?.greek && takes(last.base, slot)) {
        last.marks[slot] = mark;
        continue;
      }
      pendingMarks.push(mark);
      pendingRaw += ch;
      continue;
    }
    const lower = ch.toLowerCase();
    const latin = BETA_LETTERS[lower];
    if (latin || GREEK_BASE.test(ch)) {
      let base = latin ?? ch;
      // TLG sigma variants s1 (medial), s2 (final), s3 (lunate): the position decides.
      if (latin && lower === "s" && /^[123]$/.test(chars[i + 1] ?? "")) i++;
      const upper = cap || (latin ? ch !== lower : ch !== ch.toLowerCase());
      // Marks before a lower-case letter without * aren't Beta Code: keep them as typed.
      if (pendingMarks.length && !cap && !upper) flush();
      base = upper ? base.toUpperCase() : base.toLowerCase();
      const c: Cluster = { base, greek: true, marks: {} };
      for (const m of pendingMarks) if (takes(base, SLOT_OF[m])) c.marks[SLOT_OF[m]] = m;
      cap = false;
      pendingMarks = [];
      pendingRaw = "";
      out.push(c);
      continue;
    }
    flush();
    // TLG punctuation: a colon is the raised dot (ano teleia).
    out.push({ base: "", greek: false, marks: {}, raw: ch === ":" ? "·" : ch === "·" ? "·" : ch });
  }
  flush();
  // Final sigma: ς at the end of a word (before a non-letter or at the end of the box), σ inside.
  for (let i = 0; i < out.length; i++) {
    const c = out[i];
    if (!c.greek || (c.base !== "σ" && c.base !== "ς")) continue;
    const next = out[i + 1];
    c.base = next && next.greek ? "σ" : "ς";
  }
  return out.map(render).join("").normalize("NFC");
}

/** The ime: Beta Code typing for Ancient Greek. */
export const greekTyping = (typed: string, opts?: GreekTypingOptions) => betaToGreek(typed, opts);

/**
 * Add a mark to the letter before `at` (the character buttons under the box): returns the new
 * text and caret. `mark` is a combining character or ς (inserted as a letter).
 */
export function insertGreekMark(text: string, at: number, mark: string): { text: string; caret: number } {
  const before = text.slice(0, at);
  const after = text.slice(at);
  const head = betaToGreek(before + mark);
  return { text: betaToGreek(head + after), caret: head.length };
}

/**
 * Polytonic → monotonic (for Greek voices, which read monotonic text more reliably): breathings,
 * iota subscripts and vowel-length marks go, the grave and circumflex become the acute (tonos).
 */
export function toMonotonic(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̓̔̓̄̆ͅ]/g, "")
    .replace(/[̀͂̀́]/g, "́")
    .replace(/́+/g, "́")
    .normalize("NFC");
}

/** Text helpers for Greek words: letters with their marks. */
export const GREEK_WORD = /[Ͱ-Ͽἀ-῿̀-ͯ]+/g;

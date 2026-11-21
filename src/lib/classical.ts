// Latin and Ancient Greek answers: diacritics are optional (Jon's decision, CLASSICAL.md).
// Macrons, breves, accents, breathings, iota subscript and diaeresis are ignored when comparing;
// a match that needs that is right, with a note giving the full spelling ("With macrons: puellā").
// A mark typed wrongly (present but wrong) counts the same way. Wrong letters stay wrong.
// Pure functions; tests/classical.test.mts.

/** Language codes whose answers ignore diacritics. */
export const CLASSICAL_CODES = ["la", "grc"] as const;

/** "la", "la-x-…", "grc" → true. */
export const isClassical = (lang?: string): boolean => !!lang && (CLASSICAL_CODES as readonly string[]).includes(lang.split(/[-_]/)[0].toLowerCase());

type MarkKind = "macron" | "accent" | "breathing" | "iota" | "diaeresis";
const KIND_OF: Record<string, MarkKind> = {
  "̄": "macron", "̆": "macron",
  "̀": "accent", "́": "accent", "͂": "accent", "̀": "accent", "́": "accent", "̂": "accent",
  "̓": "breathing", "̔": "breathing", "̓": "breathing",
  "ͅ": "iota",
  "̈": "diaeresis",
};

/**
 * One spelling for comparing: NFC (which also maps oxia to tonos), look-alike Greek letter forms
 * (ϐ ϑ ϲ, the Greek question mark and raised dot, apostrophe variants) unified, final sigma as σ, lower case.
 */
export function unifyClassical(s: string): string {
  return s
    .normalize("NFC")
    .replace(/[’‘ʼ᾽᾿]/g, "'")
    .replace(/·/g, "·")
    .replace(/;/g, ";")
    .replace(/ϐ/g, "β")
    .replace(/ϑ/g, "θ")
    .replace(/[ςϲ]/g, "σ")
    .replace(/Ϲ/g, "Σ")
    .toLowerCase()
    .normalize("NFC");
}

/** Keep only the marks of `keep` (all marks stripped when `keep` is empty). */
function onlyMarks(s: string, keep: MarkKind[] = []): string {
  return unifyClassical(s)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, (m) => (keep.includes(KIND_OF[m]) ? m : ""))
    .normalize("NFC");
}

/** The letters alone: every diacritic removed (and ς/σ, case and variant forms unified). */
export const bareClassical = (s: string) => onlyMarks(s);

/** "exact": the same (ignoring case, ς/σ and NFC/NFD); "marks": the same letters, other diacritics; false: different. */
export function compareClassical(typed: string, want: string): "exact" | "marks" | false {
  if (unifyClassical(typed) === unifyClassical(want)) return "exact";
  return bareClassical(typed) === bareClassical(want) ? "marks" : false;
}

const KIND_WORDS: Record<MarkKind, [string, string]> = {
  macron: ["macrons", "vowel lengths"],
  accent: ["accents", "accents"],
  breathing: ["breathings", "breathings"],
  iota: ["iota subscript", "iota subscript"],
  diaeresis: ["the diaeresis", "the diaeresis"],
};

const list = (xs: string[]) => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`);

/**
 * The note for a match that needed its diacritics: "With macrons: puellā", "With accents and
 * breathings: ἀνήρ". Names the kinds of mark that differ (Latin macrons/breves are "macrons";
 * in Greek they're "vowel lengths").
 */
export function marksNote(typed: string, want: string): string {
  const greek = /[Ͱ-Ͽἀ-῿]/.test(want);
  const kinds = (Object.keys(KIND_WORDS) as MarkKind[]).filter((k) => onlyMarks(typed, [k]) !== onlyMarks(want, [k]));
  const words = kinds.map((k) => KIND_WORDS[k][greek ? 1 : 0]);
  const what = words.length ? list(words) : greek ? "accents" : "macrons";
  return `With ${what}: ${want.normalize("NFC")}`;
}

/**
 * Typed answer against accepted spellings: the first exact match, else the first that matches
 * once diacritics are ignored (with the note). `norm` tidies both sides first (spacing, punctuation).
 */
export function matchClassical(typed: string, accepted: string[], norm: (s: string) => string = (s) => s): { ok: boolean; note?: string; matched?: string } {
  const t = norm(typed);
  if (!t) return { ok: false };
  for (const a of accepted) if (compareClassical(t, norm(a)) === "exact") return { ok: true, matched: a };
  for (const a of accepted) if (compareClassical(t, norm(a)) === "marks") return { ok: true, note: marksNote(t, norm(a)), matched: a };
  return { ok: false };
}

/** A dictionary entry compared loosely: punctuation, hyphens and spacing don't matter ("amo amare amavi amatum"). */
export const entryKey = (s: string) =>
  s
    .normalize("NFC")
    .replace(/[,.;:·()[\]’'"!?·;-]+/g, " ")
    .replace(/[‐‑‒–—…]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

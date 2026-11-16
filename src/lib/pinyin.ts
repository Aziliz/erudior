// Hanyu Pinyin helpers for Chinese courses: tone numbers → tone marks while typing,
// syllable parsing and validation, tone extraction, and answer normalization.
// Syllable validity is checked structurally (initial + final + a few combination rules)
// rather than against a full syllable table.

const MARKS: Record<string, string> = {
  a: "āáǎà", e: "ēéěè", i: "īíǐì", o: "ōóǒò", u: "ūúǔù", "ü": "ǖǘǚǜ",
  A: "ĀÁǍÀ", E: "ĒÉĚÈ", I: "ĪÍǏÌ", O: "ŌÓǑÒ", U: "ŪÚǓÙ", "Ü": "ǕǗǙǛ",
};

/** Marked vowel → [plain vowel, tone 1–4]. */
const UNMARK: Record<string, [string, number]> = {};
for (const [v, row] of Object.entries(MARKS))
  [...row].forEach((m, i) => { UNMARK[m] = [v, i + 1]; });

const VOWEL = /[aeiouüAEIOUÜ]/;

/** Put tone `tone` (1–4; 0/5 = neutral) on a plain syllable such as "hao", "lü", "gui". */
export function markSyllable(plain: string, tone: number): string {
  const s = plain.replace(/u:|v/g, "ü").replace(/U:|V/g, "Ü");
  if (tone < 1 || tone > 4) return s;
  const lower = s.toLowerCase();
  let at = -1;
  if (/[ae]/.test(lower)) at = lower.search(/[ae]/);
  else if (lower.includes("ou")) at = lower.indexOf("o");
  else for (let i = lower.length - 1; i >= 0; i--) if (VOWEL.test(lower[i])) { at = i; break; }
  if (at < 0) return s; // e.g. "m", "ng", "hm": no vowel to mark
  const v = s[at];
  return s.slice(0, at) + MARKS[v][tone - 1] + s.slice(at + 1);
}

/** Remove tone marks: "nǚ" → { plain: "nü", tone: 3 }. Tone 0 = neutral (no mark). */
export function splitTone(syl: string): { plain: string; tone: number } {
  let tone = 0;
  let plain = "";
  for (const ch of syl.normalize("NFC")) {
    const u = UNMARK[ch];
    if (u) { plain += u[0]; tone = u[1]; } else plain += ch;
  }
  return { plain, tone };
}

/** Strip all tone marks from a string (keeps ü). */
export const stripTones = (s: string) => [...s.normalize("NFC")].map(c => UNMARK[c]?.[0] ?? c).join("");

/**
 * Typing converter: a syllable followed by a tone digit becomes a marked syllable.
 * "ni3hao3" → "nǐhǎo", "lv4" → "lǜ", "ma5" / "ma0" → "ma". "v" and "u:" become ü
 * after n, l, j, q, x, y (and on their own when followed by a tone digit).
 */
export function pinyinTyping(typed: string): string {
  let out = typed.replace(/([nljqxyNLJQXY])(?:v|u:)/g, (_, c) => c + "ü")
    .replace(/([nljqxyNLJQXY])(?:V|U:)/g, (_, c) => c + "Ü");
  out = out.replace(/([a-zA-ZüÜ:]+?)([0-5])/g, (whole, letters: string, d: string) => {
    // Only the last syllable-ish run before the digit takes the tone.
    const m = /([bpmfdtnlgkhjqxrzcswy]?h?(?:[aeiouüvAEIOUÜV:]+)(?:ng|n|r)?|[mn]g?|hm|er)$/i.exec(letters);
    if (!m) return whole;
    const head = letters.slice(0, letters.length - m[1].length);
    return head + markSyllable(m[1], Number(d));
  });
  return out;
}

const INITIALS = ["zh", "ch", "sh", "b", "p", "m", "f", "d", "t", "n", "l", "g", "k", "h", "j", "q", "x", "r", "z", "c", "s", "y", "w"];
const FINALS = new Set([
  "a", "o", "e", "ai", "ei", "ao", "ou", "an", "en", "ang", "eng", "ong", "er",
  "i", "ia", "ie", "iao", "iu", "ian", "in", "iang", "ing", "iong",
  "u", "ua", "uo", "uai", "ui", "uan", "un", "uang", "ueng",
  "ü", "üe", "üan", "ün", "ue", "uan", "un", // ue/uan/un after j q x y spell ü
]);

/** Structural check of one toneless, lower-case syllable (erhua "r" allowed at the end). */
export function validSyllable(plain: string): boolean {
  let s = plain.toLowerCase();
  if (!s) return false;
  if (/^(m|n|ng|hm|hng|ê)$/.test(s)) return true; // interjections
  if (s.length > 1 && s.endsWith("r") && s !== "er") s = s.slice(0, -1);
  const init = INITIALS.find(i => s.startsWith(i) && s.length > i.length) ?? "";
  const fin = s.slice(init.length);
  if (!FINALS.has(fin)) return false;
  if (fin === "er" || fin === "ueng") return init === "" || (fin === "ueng" && init === "w");
  // j q x y: only i-finals and ü-finals (ü written u: ju, que, xuan, yun)
  if (["j", "q", "x"].includes(init)) return /^(i|ia|ie|iao|iu|ian|in|iang|ing|iong|u|ue|uan|un)$/.test(fin);
  if (init === "y") return /^(a|o|e|ai|ao|ou|an|ang|i|in|ing|ong|u|ue|uan|un)$/.test(fin);
  if (init === "w") return /^(a|o|ai|ei|an|en|ang|eng|u)$/.test(fin);
  if (init === "") return /^(a|o|e|ai|ei|ao|ou|an|en|ang|eng)$/.test(fin); // i/u/ü finals take y/w
  if (fin.startsWith("ü")) return ["n", "l"].includes(init) && /^(ü|üe)$/.test(fin);
  if (fin === "ue") return false; // only after j q x y (and nüe/lüe)
  if (["zh", "ch", "sh", "r", "z", "c", "s"].includes(init) && /^i./.test(fin)) return false;
  if (["g", "k", "h"].includes(init) && /^i/.test(fin)) return false;
  if (["b", "p", "m", "f"].includes(init) && /^(u.|ong)/.test(fin)) return false;
  if (["d", "t", "n", "l"].includes(init) && /^(ua|uai|uang)$/.test(fin)) return false;
  return true;
}

const SYL_CHARS = /[a-zA-ZüÜāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜĀÁǍÀĒÉĚÈĪÍǏÌŌÓǑÒŪÚǓÙǕǗǙǛêÊ]+/g;

/** Split pinyin text on spaces, apostrophes and hyphens into syllable tokens. */
export function pinyinTokens(text: string): string[] {
  return text.normalize("NFC").split(/[\s'’\-·]+/).filter(Boolean);
}

/** A token is valid pinyin: one marked syllable (at most one tone mark). */
export function validPinyinSyllable(tok: string): boolean {
  if (!new RegExp(`^${SYL_CHARS.source}$`).test(tok)) return false;
  const marks = [...tok].filter(c => UNMARK[c]).length;
  if (marks > 1) return false;
  return validSyllable(splitTone(tok).plain);
}

/** Tone of each syllable in a space-separated reading ("nǐ hǎo" → [3, 3]). */
export const tonesOf = (reading: string) => pinyinTokens(reading).map(t => splitTone(t).tone);

/**
 * Normalize pinyin for answer comparison: NFC, lower case, v/u: → ü, tone digits → marks,
 * spaces, apostrophes and hyphens removed. Tones are kept, so "ma1" ≠ "ma3".
 */
export function normPinyin(s: string): string {
  return pinyinTyping(s.normalize("NFC").toLowerCase().replace(/u:|v/g, "ü"))
    .replace(/[\s'’\-·.,!?。，！？]/g, "");
}

/** Same as normPinyin but with tones removed (to tell "wrong tone" from "wrong word"). */
export const normPinyinToneless = (s: string) => stripTones(normPinyin(s));

export const HAN = /[㐀-䶿一-鿿豈-﫿\u{20000}-\u{2ebef}]/u;
export const isHan = (c: string) => HAN.test(c);
export const hasHan = (s: string) => HAN.test(s);
/** Looks like pinyin (Latin letters, maybe with tone marks or digits), no Han characters. */
export const looksPinyin = (s: string) => !hasHan(s) && /[a-zA-ZüÜ]/.test(stripTones(s));

// ---------------------------------------------------------------------------
// Pinyin over characters: {汉字|hàn zì} in course text becomes ruby with one syllable over
// each character. Syllables are separated by spaces (apostrophes and hyphens also separate).
// A syllable ending in erhua -r also covers a following 儿: {一点儿|yì diǎnr}.

export interface PinyinPair {
  /** One character (or a character + 儿 for erhua). */
  base: string;
  /** Its syllable with tone mark; "" for a non-Han character in a vocabulary term. */
  syl: string;
  /** 1–4, 0 = neutral; -1 = no syllable. */
  tone: number;
}

/**
 * Pair the Han characters of `base` with the syllables of `reading`. Returns null unless every
 * syllable is valid marked pinyin and there is exactly one per character. `allowOther` lets
 * non-Han characters (vocabulary terms such as 卡拉OK) pass through without a syllable.
 */
export function pinyinPairs(base: string, reading: string, allowOther = false): PinyinPair[] | null {
  const syls = pinyinTokens(reading);
  if (!syls.length || !syls.every(validPinyinSyllable)) return null;
  const chars = [...base.normalize("NFC")];
  const out: PinyinPair[] = [];
  let i = 0;
  for (let c = 0; c < chars.length; c++) {
    const ch = chars[c];
    if (!isHan(ch)) {
      if (!allowOther) return null;
      out.push({ base: ch, syl: "", tone: -1 });
      continue;
    }
    const syl = syls[i++];
    if (syl === undefined) return null;
    const { plain, tone } = splitTone(syl);
    let b = ch;
    if (chars[c + 1] === "儿" && /r$/i.test(plain) && plain.toLowerCase() !== "er") {
      b += "儿";
      c++;
    }
    out.push({ base: b, syl, tone });
  }
  return i === syls.length && out.some(p => p.syl) ? out : null;
}

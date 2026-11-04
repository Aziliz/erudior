// Japanese text helpers: a romaji → kana input converter (so learners can type Japanese on any
// keyboard), hiragana ↔ katakana, script tests, and furigana markup.
//
// The converter works on the whole string each time the box changes (the IME registry contract),
// so it must leave text that is already kana alone and only turn finished romaji syllables into
// kana. Half-typed syllables ("k", "ky", a trailing "n") stay as letters until they're complete,
// or until `final` (on submit), when a lone trailing "n" becomes ん.
//
// Conventions follow common Japanese IMEs (wāpuro romaji, with Hepburn spellings too):
//   shi/si し, chi/ti ち, tsu/tu つ, fu/hu ふ, ji/zi じ, di ぢ, du づ, wo を
//   double consonant → っ (kka っか, tcha っちゃ), nn / n' / n+consonant → ん
//   x- or l- prefix → small kana (xa ぁ, xtu/ltu っ, xya ゃ), "-" → ー, "," → 、, "." → 。
//   UPPERCASE letters give katakana for that syllable (TAKUSHI- → タクシー), or pass
//   `katakana: true` to convert everything to katakana.

const VOWELS = "aiueo";

// Base syllables. Built once into a map; longer keys win (we try 4, 3, 2, 1 letters).
const TABLE: Record<string, string> = {
  a: "あ", i: "い", u: "う", e: "え", o: "お",
  ka: "か", ki: "き", ku: "く", ke: "け", ko: "こ",
  ga: "が", gi: "ぎ", gu: "ぐ", ge: "げ", go: "ご",
  sa: "さ", si: "し", shi: "し", su: "す", se: "せ", so: "そ",
  za: "ざ", zi: "じ", ji: "じ", zu: "ず", ze: "ぜ", zo: "ぞ",
  ta: "た", ti: "ち", chi: "ち", tu: "つ", tsu: "つ", te: "て", to: "と",
  da: "だ", di: "ぢ", du: "づ", de: "で", do: "ど",
  na: "な", ni: "に", nu: "ぬ", ne: "ね", no: "の",
  ha: "は", hi: "ひ", hu: "ふ", fu: "ふ", he: "へ", ho: "ほ",
  ba: "ば", bi: "び", bu: "ぶ", be: "べ", bo: "ぼ",
  pa: "ぱ", pi: "ぴ", pu: "ぷ", pe: "ぺ", po: "ぽ",
  ma: "ま", mi: "み", mu: "む", me: "め", mo: "も",
  ya: "や", yu: "ゆ", yo: "よ", ye: "いぇ",
  ra: "ら", ri: "り", ru: "る", re: "れ", ro: "ろ",
  la: "ぁ", li: "ぃ", lu: "ぅ", le: "ぇ", lo: "ぉ",
  wa: "わ", wi: "うぃ", we: "うぇ", wo: "を", wu: "う",
  // Small kana.
  xa: "ぁ", xi: "ぃ", xu: "ぅ", xe: "ぇ", xo: "ぉ",
  xya: "ゃ", xyu: "ゅ", xyo: "ょ", lya: "ゃ", lyu: "ゅ", lyo: "ょ",
  xtu: "っ", ltu: "っ", xtsu: "っ", ltsu: "っ", xwa: "ゎ", lwa: "ゎ",
  xka: "ゕ", xke: "ゖ",
  // Combinations (yōon).
  kya: "きゃ", kyu: "きゅ", kyo: "きょ", kye: "きぇ", kyi: "きぃ",
  gya: "ぎゃ", gyu: "ぎゅ", gyo: "ぎょ", gye: "ぎぇ", gyi: "ぎぃ",
  sha: "しゃ", shu: "しゅ", sho: "しょ", she: "しぇ",
  sya: "しゃ", syu: "しゅ", syo: "しょ", sye: "しぇ", syi: "しぃ",
  ja: "じゃ", ju: "じゅ", jo: "じょ", je: "じぇ",
  jya: "じゃ", jyu: "じゅ", jyo: "じょ", jye: "じぇ", jyi: "じぃ",
  zya: "じゃ", zyu: "じゅ", zyo: "じょ", zye: "じぇ", zyi: "じぃ",
  cha: "ちゃ", chu: "ちゅ", cho: "ちょ", che: "ちぇ",
  tya: "ちゃ", tyu: "ちゅ", tyo: "ちょ", tye: "ちぇ", tyi: "ちぃ",
  cya: "ちゃ", cyu: "ちゅ", cyo: "ちょ", cye: "ちぇ", cyi: "ちぃ",
  dya: "ぢゃ", dyu: "ぢゅ", dyo: "ぢょ", dye: "ぢぇ", dyi: "ぢぃ",
  nya: "にゃ", nyu: "にゅ", nyo: "にょ", nye: "にぇ", nyi: "にぃ",
  hya: "ひゃ", hyu: "ひゅ", hyo: "ひょ", hye: "ひぇ", hyi: "ひぃ",
  bya: "びゃ", byu: "びゅ", byo: "びょ", bye: "びぇ", byi: "びぃ",
  pya: "ぴゃ", pyu: "ぴゅ", pyo: "ぴょ", pye: "ぴぇ", pyi: "ぴぃ",
  mya: "みゃ", myu: "みゅ", myo: "みょ", mye: "みぇ", myi: "みぃ",
  rya: "りゃ", ryu: "りゅ", ryo: "りょ", rye: "りぇ", ryi: "りぃ",
  // Sounds mostly used in katakana loanwords.
  fa: "ふぁ", fi: "ふぃ", fe: "ふぇ", fo: "ふぉ", fyu: "ふゅ",
  va: "ゔぁ", vi: "ゔぃ", vu: "ゔ", ve: "ゔぇ", vo: "ゔぉ",
  tsa: "つぁ", tsi: "つぃ", tse: "つぇ", tso: "つぉ",
  thi: "てぃ", thu: "てゅ", dhi: "でぃ", dhu: "でゅ",
  twu: "とぅ", dwu: "どぅ",
  kwa: "くぁ", gwa: "ぐぁ",
  // Punctuation.
  "-": "ー", ",": "、", ".": "。", "[": "「", "]": "」", "~": "〜",
};

const MAX_KEY = 4;

/** Letters that can start a syllable we don't know is finished yet (a prefix of some key). */
const PREFIXES = new Set<string>();
for (const k of Object.keys(TABLE)) for (let i = 1; i < k.length; i++) PREFIXES.add(k.slice(0, i));

const isLetter = (c: string) => /[a-zA-Z]/.test(c);
const isConsonant = (c: string) => /[b-df-hj-np-tv-z]/i.test(c);

// Hepburn spellings where the table lists a Kunrei-style key first.
const HEPBURN: Record<string, string> = { し: "shi", じ: "ji", ち: "chi", つ: "tsu", ふ: "fu", ぢ: "ji", づ: "zu", ん: "n", っ: "small tsu", ー: "long vowel mark" };
const ROMAJI = new Map<string, string>();
for (const [k, v] of Object.entries(TABLE)) if (/^[a-z]+$/.test(k) && !/^[xl]/.test(k) && !ROMAJI.has(v)) ROMAJI.set(v, k);

/** The Hepburn romaji for one kana (hiragana or katakana): "shi" for し or シ, "ga" for が.
 * Small kana are "small ya" and so on. Undefined if it isn't a kana. */
export function kanaRomaji(ch: string): string | undefined {
  const h = toHiragana(ch);
  if (HEPBURN[h]) return HEPBURN[h];
  if (ROMAJI.has(h)) return ROMAJI.get(h);
  const big = "ぁぃぅぇぉゃゅょゎゕゖ".indexOf(h);
  if (big >= 0) return `small ${ROMAJI.get("あいうえおやゆよわかけ"[big])}`;
  return undefined;
}

/** Katakana for hiragana (other characters unchanged). */
export function toKatakana(s: string): string {
  return s.replace(/[ぁ-ゖゝゞ]/g, (c) => String.fromCharCode(c.charCodeAt(0) + 0x60));
}

/** Hiragana for katakana (other characters unchanged; ー stays). */
export function toHiragana(s: string): string {
  return s.replace(/[ァ-ヶヽヾ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60));
}

export interface KanaOptions {
  /** Convert everything to katakana. */
  katakana?: boolean;
  /** The learner is done typing: a lone trailing "n" becomes ん. */
  final?: boolean;
}

/**
 * Romaji → kana. Kana, kanji and anything that isn't a romaji letter or the punctuation above
 * pass through untouched, so running it again on its own output changes nothing.
 */
export function romajiToKana(input: string, opts: KanaOptions = {}): string {
  let out = "";
  let i = 0;
  const s = input;
  const emit = (kana: string, upper: boolean) => {
    out += opts.katakana || upper ? toKatakana(kana) : kana;
  };
  // Katakana by capitals only inside an all-caps run of 2+ letters, so a capitalized first
  // letter ("Sensei") doesn't flip one syllable to katakana.
  const isUp = (j: number) => isLetter(s[j] ?? "") && s[j] !== s[j].toLowerCase();
  const capsRun = (start: number, len: number) => {
    for (let j = start; j < start + len; j++) if (isLetter(s[j]) && !isUp(j)) return false;
    return isUp(start - 1) || isUp(start + len) || (len > 1 && isUp(start) && isUp(start + 1));
  };
  while (i < s.length) {
    const c = s[i];
    const lc = c.toLowerCase();
    const upper = isUp(i) && capsRun(i, 1);

    // ん: "nn", "n'", or n before a consonant other than y (and not another n starting "nn").
    if (lc === "n") {
      const next = s[i + 1]?.toLowerCase();
      if (next === "n") {
        // Like Google's Japanese input: "nn" before a vowel or y is ん + the n-syllable
        // (konnichiha → こんにちは, onna → おんな); otherwise "nn" is just ん.
        const after = s[i + 2]?.toLowerCase();
        emit("ん", upper);
        i += after !== undefined && (VOWELS.includes(after) || after === "y") ? 1 : 2;
        continue;
      }
      if (next === "'") {
        emit("ん", upper);
        i += 2;
        continue;
      }
      if (next !== undefined && isLetter(next) && isConsonant(next) && next !== "y") {
        emit("ん", upper);
        i += 1;
        continue;
      }
      if (next === undefined) {
        if (opts.final) emit("ん", upper);
        else out += c;
        i += 1;
        continue;
      }
      if (next !== undefined && !isLetter(next) && next !== "-" && !VOWELS.includes(next)) {
        // n before a space, digit, kana… is ん.
        emit("ん", upper);
        i += 1;
        continue;
      }
    }

    // Double consonant → っ (not for n, handled above).
    if (isLetter(c) && isConsonant(c) && lc !== "n") {
      const next = s[i + 1];
      if (next && next.toLowerCase() === lc) {
        emit("っ", upper);
        i += 1;
        continue;
      }
      // "tch" (as in Hepburn "matcha") → っち.
      if (lc === "t" && s.slice(i + 1, i + 3).toLowerCase() === "ch") {
        emit("っ", upper);
        i += 1;
        continue;
      }
    }

    // Longest table match.
    let matched = false;
    for (let len = Math.min(MAX_KEY, s.length - i); len >= 1; len--) {
      const chunk = s.slice(i, i + len);
      const key = chunk.toLowerCase();
      const kana = TABLE[key];
      if (kana === undefined) continue;
      // Punctuation keys are single characters with no case; letters decide case.
      const isUpper = isLetter(chunk[0]) ? capsRun(i, len) : false;
      emit(kana, isUpper);
      i += len;
      matched = true;
      break;
    }
    if (matched) continue;

    // An unfinished syllable at the end stays as typed; anything else passes through.
    out += c;
    i += 1;
  }
  return out;
}

/** True if the text still has romaji letters in it (an unfinished or invalid syllable). */
export function hasRomaji(s: string): boolean {
  return /[a-zA-Z]/.test(s);
}

// ---------------------------------------------------------------------------
// Scripts

const HIRA = /[ぁ-ゖゝゞ]/;
const KATA = /[ァ-ヺヽヾㇰ-ㇿ]/;
/** CJK unified ideographs (+ extension A and the iteration mark 々). */
const KANJI = /[㐀-䶿一-鿿々]/;

export const isKanji = (c: string) => KANJI.test(c);
export const hasKanji = (s: string) => KANJI.test(s);
/** Kana (either script), the long mark and middle dot only. */
export const isKanaOnly = (s: string) => /^[ぁ-ゖゝゞァ-ヺーヽヾ・]+$/.test(s);
export const hasJapanese = (s: string) => HIRA.test(s) || KATA.test(s) || KANJI.test(s);

// ---------------------------------------------------------------------------
// Furigana: {漢字|かんじ} in course text becomes <ruby>漢字<rt>かんじ</rt></ruby>.

/** `{base|reading}` where base has a kanji and reading is kana. */
export const RUBY_RE = /\{([^{}|\n]+)\|([^{}|\n]+)\}/g;

export interface RubyProblem {
  match: string;
  problem: string;
}

/** Problems with furigana markup in a piece of course text (for the course checker). */
export function rubyProblems(text: string): RubyProblem[] {
  const out: RubyProblem[] = [];
  for (const m of text.matchAll(RUBY_RE)) {
    const [whole, base, reading] = m;
    if (!hasKanji(base)) out.push({ match: whole, problem: "furigana base has no kanji" });
    if (!isKanaOnly(reading.trim())) out.push({ match: whole, problem: "furigana reading must be kana only" });
  }
  return out;
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/**
 * Replace furigana markup with <ruby>. Only markup whose base has a kanji is converted, so
 * braces elsewhere (math, code, set notation) are left alone. `escape` escapes the base and
 * reading (for plain-text callers; Markdown callers pass false since Markdown escapes later).
 */
export function rubyHtml(text: string, escape = true): string {
  if (!text.includes("|")) return text;
  return text.replace(RUBY_RE, (whole, base: string, reading: string) => {
    if (!hasKanji(base) || !isKanaOnly(reading.trim())) return whole;
    const b = escape ? escapeHtml(base) : base;
    const r = escape ? escapeHtml(reading.trim()) : reading.trim();
    return `<ruby>${b}<rp>(</rp><rt>${r}</rt><rp>)</rp></ruby>`;
  });
}

/** The text with furigana markup reduced to the base ({漢字|かんじ} → 漢字). */
export function stripRuby(text: string): string {
  return text.replace(RUBY_RE, (whole, base: string, reading: string) =>
    hasKanji(base) && isKanaOnly(reading.trim()) ? base : whole,
  );
}

/** The text with furigana markup reduced to the reading ({漢字|かんじ} → かんじ). */
export function rubyReading(text: string): string {
  return text.replace(RUBY_RE, (whole, base: string, reading: string) =>
    hasKanji(base) && isKanaOnly(reading.trim()) ? reading.trim() : whole,
  );
}

/**
 * Furigana markup for a word from its written form and kana reading, putting the reading only
 * over the kanji: 食べる + たべる → {食|た}べる, お茶 + おちゃ → お{茶|ちゃ}. Kana shared at the
 * start and end are left bare. Words with kana between kanji (e.g. 引き出し) get one reading
 * over the whole middle span; give them explicit markup in the course when that's not wanted.
 */
export function autoRuby(term: string, reading?: string): string {
  if (!reading || !hasKanji(term) || term.includes("{")) return term;
  const r = reading.trim();
  if (!isKanaOnly(r)) return term;
  let start = 0;
  while (start < term.length && start < r.length && !isKanji(term[start]) && sameKana(term[start], r[start])) start++;
  let endT = term.length;
  let endR = r.length;
  while (endT > start && endR > start && !isKanji(term[endT - 1]) && sameKana(term[endT - 1], r[endR - 1])) {
    endT--;
    endR--;
  }
  const base = term.slice(start, endT);
  const read = r.slice(start, endR);
  if (!base || !read || !hasKanji(base)) return term;
  return `${term.slice(0, start)}{${base}|${read}}${term.slice(endT)}`;
}

const sameKana = (a: string, b: string) => toHiragana(a) === toHiragana(b);

/** Japanese text for comparing answers: no spaces or Japanese/ASCII punctuation, widths folded, furigana dropped. */
export function normJa(s: string): string {
  return stripRuby(s).normalize("NFKC").replace(/[\s。、．，・「」『』!?！？.,~〜]/g, "");
}

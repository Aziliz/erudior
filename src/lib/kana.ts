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
// Pitch accent (standard Tokyo): a word's accent is the mora after which the pitch drops.
//   0 heiban (flat): low, then high to the end and onto a following particle
//   1 atamadaka: high on the first mora, low after
//   n nakadaka: low, high up to mora n, low after
//   n = mora count odaka: like heiban inside the word, but a following particle is low

/** Small kana that belong to the mora before them (きゃ, ふぁ, ティ). っ, ん and ー are morae of their own. */
const SMALL = /[ぁぃぅぇぉゃゅょゎァィゥェォャュョヮ]/;
const KANA_CHAR = /[ぁ-ゖゝゞァ-ヺーヽヾ]/;

/** The morae of a kana string: きょうと → きょ・う・と. Characters that aren't kana are skipped. */
export function morae(kana: string): string[] {
  const out: string[] = [];
  for (const c of kana) {
    if (!KANA_CHAR.test(c)) continue;
    if (SMALL.test(c) && out.length) out[out.length - 1] += c;
    else out.push(c);
  }
  return out;
}

export const moraCount = (kana: string) => morae(kana).length;

/** A word's accents as a list (a vocabulary `pitch` is one number or a list of them). */
export const accentList = (pitch: number | number[] | undefined): number[] =>
  pitch === undefined ? [] : Array.isArray(pitch) ? pitch : [pitch];

/** True if `accent` is a valid accent position for a word of `count` morae. */
export const validAccent = (accent: unknown, count: number): accent is number =>
  typeof accent === "number" && Number.isInteger(accent) && accent >= 0 && accent <= count && count > 0;

/**
 * High (H) or low (L) for each mora, plus one more for a following particle (e.g. が).
 * pitchPattern(2, 0) → ["L","H","H"] (はし, 端: flat, particle high); (2, 2) → ["L","H","L"] (橋).
 */
export function pitchPattern(count: number, accent: number): ("H" | "L")[] {
  const out: ("H" | "L")[] = [];
  for (let i = 1; i <= count + 1; i++) {
    if (accent === 1) out.push(i === 1 ? "H" : "L");
    else if (i === 1) out.push("L");
    else out.push(accent === 0 || i <= accent ? "H" : "L");
  }
  return out;
}

const ordinal = (n: number) => {
  const s = n % 100 >= 11 && n % 100 <= 13 ? "th" : ({ 1: "st", 2: "nd", 3: "rd" } as Record<number, string>)[n % 10] ?? "th";
  return `${n}${s}`;
};

/** Words for one accent: "flat", "drop after the 2nd mora", "drop after the 3rd and last mora". */
export function accentWords(accent: number, count: number): string {
  if (accent === 0) return "flat";
  return `drop after the ${ordinal(accent)}${accent === count && count > 1 ? " and last" : ""} mora`;
}

/** The screen-reader text for a word's accents: "pitch: flat, or drop after the 2nd mora". */
export function pitchLabel(accents: number[], count: number): string {
  return `pitch: ${accents.map((a) => accentWords(a, count)).join(", or ")}`;
}

/**
 * HTML for kana with its pitch accent: each mora is a span (.pa-h high, .pa-l low, .pa-d where
 * the pitch drops after it). The line and tick are drawn by CSS (::before/::after, so assistive
 * tech never sees them); the accent in words is visually hidden text (.pa-sr) for screen readers.
 * Extra accents (several standard ones) follow the first as further marked copies.
 * Returns the kana escaped and unmarked when no accent fits the word.
 */
export function pitchHtml(kana: string, accents: number | number[] | undefined, escape = true): string {
  const esc = (s: string) => (escape ? escapeHtml(s) : s);
  const count = moraCount(kana);
  const list = accentList(accents).filter((a) => validAccent(a, count));
  if (!list.length) return esc(kana);
  // Morae, with anything else (・, spaces) kept in place unmarked.
  const segs: { text: string; mora: boolean }[] = [];
  for (const c of kana) {
    const last = segs[segs.length - 1];
    if (KANA_CHAR.test(c) && SMALL.test(c) && last?.mora) last.text += c;
    else segs.push({ text: c, mora: KANA_CHAR.test(c) });
  }
  const word = (accent: number) => {
    const pat = pitchPattern(count, accent);
    let i = 0;
    const spans = segs
      .map((s) => {
        if (!s.mora) return esc(s.text);
        const hi = pat[i] === "H";
        const drop = hi && pat[i + 1] === "L";
        i++;
        return `<span class="pa-m pa-${hi ? "h" : "l"}${drop ? " pa-d" : ""}">${esc(s.text)}</span>`;
      })
      .join("");
    return `<span class="pa-w" data-pitch="${accent}">${spans}</span>`;
  };
  const alts = list.slice(1).map((a) => `<span class="pa-alt"><span class="pa-or" aria-hidden="true">・</span>${word(a)}</span>`).join("");
  return `<span class="pa">${word(list[0])}${alts}<span class="sr-only pa-sr" lang="en"> (${pitchLabel(list, count)})</span></span>`;
}

// ---------------------------------------------------------------------------
// Furigana: {漢字|かんじ} in course text becomes <ruby>漢字<rt>かんじ</rt></ruby>.
// Pitch accent rides along after a colon: {橋|はし:2} (accent over the furigana), and kana-only
// words take [はし:2]. The plain {漢字|かんじ} form is unchanged.

/** `{base|reading}` or `{base|reading:accent}` where base has a kanji and reading is kana. */
export const RUBY_RE = /\{([^{}|\n]+)\|([^{}|\n]+)\}/g;
/** `[kana:accent]`: a kana-only word with its pitch accent. Not `[[…]]` glossary links, `\[` math or `[…](link)`. */
export const PITCH_RE = /(?<![\\[])\[([ぁ-ゖゝゞァ-ヺーヽヾ]+)[:：](\d{1,2})\](?![\](])/g;
/** Anything shaped like pitch markup, for the checker to report what PITCH_RE won't take. */
const PITCH_LIKE = /(?<![\\[])\[([^[\]\n:：]+)[:：]\s*([^[\]\n]*)\](?![\](])/g;

/** A furigana reading, split from its accent: "はし:2" → { reading: "はし", accent: 2 }. */
export function splitReading(raw: string): { reading: string; accent?: number; accentText?: string } {
  const r = raw.trim();
  const m = /^(.*?)\s*[:：]\s*(\S*)$/.exec(r);
  if (!m) return { reading: r };
  return { reading: m[1], accentText: m[2], accent: /^\d{1,2}$/.test(m[2]) ? Number(m[2]) : undefined };
}

/** A furigana match that renders: kanji in the base, kana reading, and (if given) an accent that fits. */
function rubyParts(base: string, rawReading: string) {
  if (!hasKanji(base)) return null;
  const { reading, accent, accentText } = splitReading(rawReading);
  if (!isKanaOnly(reading)) return null;
  // A bad accent ({橋|はし:9}) still shows the furigana, just without the accent (the checker reports it).
  return { reading, accent: accentText !== undefined && validAccent(accent, moraCount(reading)) ? accent : undefined };
}

export interface RubyProblem {
  match: string;
  problem: string;
}

/** Problems with furigana and pitch-accent markup in a piece of course text (for the course checker). */
export function rubyProblems(text: string): RubyProblem[] {
  const out: RubyProblem[] = [];
  for (const m of text.matchAll(RUBY_RE)) {
    const [whole, base, raw] = m;
    const { reading, accent, accentText } = splitReading(raw);
    if (!hasKanji(base)) out.push({ match: whole, problem: "furigana base has no kanji" });
    if (!isKanaOnly(reading)) out.push({ match: whole, problem: "furigana reading must be kana only" });
    else if (accentText !== undefined && !validAccent(accent, moraCount(reading)))
      out.push({ match: whole, problem: `pitch accent must be a whole number from 0 to ${moraCount(reading)} (the reading's morae)` });
  }
  for (const m of text.matchAll(PITCH_LIKE)) {
    const [whole, word, n] = m;
    if (!hasJapanese(word)) continue;
    if (!isKanaOnly(word)) out.push({ match: whole, problem: hasKanji(word) ? "pitch markup [かな:n] is for kana; write {漢字|かな:n} for a word with kanji" : "pitch markup word must be kana only" });
    else if (!/^\d{1,2}$/.test(n) || !validAccent(Number(n), moraCount(word)))
      out.push({ match: whole, problem: `pitch accent must be a whole number from 0 to ${moraCount(word)} (the word's morae)` });
  }
  return out;
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/**
 * Replace furigana markup with <ruby> and pitch markup with marked kana. Only furigana markup
 * whose base has a kanji is converted, so braces elsewhere (math, code, set notation) are left
 * alone. `escape` escapes the base and reading (for plain-text callers; Markdown callers pass
 * false since Markdown escapes later).
 */
export function rubyHtml(text: string, escape = true): string {
  if (!text.includes("|") && !text.includes("[")) return text;
  return text
    .replace(RUBY_RE, (whole, base: string, raw: string) => {
      const p = rubyParts(base, raw);
      if (!p) return whole;
      const b = escape ? escapeHtml(base) : base;
      const r = p.accent !== undefined ? pitchHtml(p.reading, p.accent, escape) : escape ? escapeHtml(p.reading) : p.reading;
      return `<ruby>${b}<rp>(</rp><rt>${r}</rt><rp>)</rp></ruby>`;
    })
    .replace(PITCH_RE, (whole, kana: string, n: string) =>
      validAccent(Number(n), moraCount(kana)) ? pitchHtml(kana, Number(n), escape) : whole,
    );
}

/** The text with furigana and pitch markup reduced to what's written ({漢字|かんじ} → 漢字, [はし:2] → はし). */
export function stripRuby(text: string): string {
  return text
    .replace(RUBY_RE, (whole, base: string, raw: string) => (rubyParts(base, raw) ? base : whole))
    .replace(PITCH_RE, (_whole, kana: string) => kana);
}

/** The text with furigana markup reduced to the reading ({漢字|かんじ} → かんじ, [はし:2] → はし). */
export function rubyReading(text: string): string {
  return text
    .replace(RUBY_RE, (whole, base: string, raw: string) => rubyParts(base, raw)?.reading ?? whole)
    .replace(PITCH_RE, (_whole, kana: string) => kana);
}

/** Text for search: furigana markup keeps both the kanji and its reading ({漢字|かんじ} → 漢字 かんじ). */
export function rubySearchText(text: string): string {
  return text
    .replace(RUBY_RE, (whole, base: string, raw: string) => {
      const p = rubyParts(base, raw);
      return p ? `${base} ${p.reading}` : whole;
    })
    .replace(PITCH_RE, (_whole, kana: string) => kana);
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

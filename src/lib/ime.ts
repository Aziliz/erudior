// Input converters for languages that aren't typed directly on an English keyboard.
// Each converter turns what's been typed so far into the text to show in the box; it's run on
// the whole value after every change, so it must leave already-converted text alone.
// German and other Roman-script languages need none (they use character buttons).
// Chinese: tone numbers → tone marks (pinyin); characters come from the device keyboard.
// Ancient Greek: Beta Code (grc). Latin: a_ → ā (la).

import type { LanguageInfo } from "./types";
import { romajiToKana } from "./kana";
import { pinyinTyping } from "./pinyin";
import { greekTyping, hasGreek } from "./greek";
import { isClassical } from "./classical";

/** Latin: an underscore after a vowel gives its macron (a_ → ā). Idempotent; nothing pending. */
export function latinTyping(typed: string): string {
  const MAC: Record<string, string> = { a: "ā", e: "ē", i: "ī", o: "ō", u: "ū", y: "ȳ", A: "Ā", E: "Ē", I: "Ī", O: "Ō", U: "Ū", Y: "Ȳ" };
  return typed.normalize("NFC").replace(/([aeiouyAEIOUY])_/g, (_m, v: string) => MAC[v]);
}

export interface ImeOptions {
  /** The learner submitted: finish anything left pending (a trailing "n" → ん). */
  final?: boolean;
  /** Japanese: write katakana instead of hiragana. */
  katakana?: boolean;
}

export type Ime = (typed: string, opts?: ImeOptions) => string;

const registry: Record<string, Ime> = {
  // Japanese: romaji → kana. Kanji come from the learner's own Japanese keyboard, if any;
  // answers are accepted in kana, so none is needed.
  ja: (typed, opts) => romajiToKana(typed, opts),
  // Chinese: pinyin with tone numbers becomes tone marks as it's typed ("ni3hao3" → "nǐhǎo",
  // "lv4" / "lu:4" → "lǜ", 5 or 0 = neutral). Han characters from a Chinese keyboard and tone
  // marks typed directly pass through unchanged; nothing is left pending, so `final` is a no-op.
  zh: (typed) => pinyinTyping(typed),
  // Ancient Greek: Beta Code → polytonic (a)nh/r → ἀνήρ), final sigma by position. Greek from a
  // device keyboard passes through. See lib/greek.ts.
  grc: (typed, opts) => greekTyping(typed, opts),
  // Latin: a_ → ā (optional; the macron buttons do the same). See docs/COURSE_FORMAT.md.
  la: (typed) => latinTyping(typed),
};

export function registerIme(name: string, ime: Ime) {
  registry[name] = ime;
}

export function imeFor(lang?: LanguageInfo): Ime | undefined {
  return lang?.ime ? registry[lang.ime] : undefined;
}

/**
 * The converter for a box whose expected answers are `answers`. Latin and Greek courses follow the
 * answer's script: Greek answers get Beta Code typing (a Latin course quoting Greek too), other
 * answers the course's converter unless that's the Greek one (an English or Latin answer in a
 * Greek course stays as typed). Other courses: the course's converter.
 */
export function imeForAnswer(lang: LanguageInfo | undefined, answers: string[] | undefined): Ime | undefined {
  if (!lang || !isClassical(lang.code)) return imeFor(lang);
  if (answers?.some(hasGreek)) return registry.grc;
  return lang.ime === "grc" ? undefined : imeFor(lang);
}

/** True when `answers` call for the Greek keys (breathings, accents…) under the box. */
export const greekAnswer = (lang: LanguageInfo | undefined, answers: string[] | undefined) => !!lang && isClassical(lang.code) && !!answers?.some(hasGreek);

/** True while an OS input method is composing (don't rewrite the box under it). */
export function composing(e: { nativeEvent: Event }): boolean {
  return !!(e.nativeEvent as InputEvent).isComposing;
}

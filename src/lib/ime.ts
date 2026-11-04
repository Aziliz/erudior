// Input converters for languages that aren't typed directly on an English keyboard.
// Each converter turns what's been typed so far into the text to show in the box; it's run on
// the whole value after every change, so it must leave already-converted text alone.
// German and other Roman-script languages need none (they use character buttons).
// Chinese (pinyin -> hanzi) can plug in here later.

import type { LanguageInfo } from "./types";
import { romajiToKana } from "./kana";

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
};

export function registerIme(name: string, ime: Ime) {
  registry[name] = ime;
}

export function imeFor(lang?: LanguageInfo): Ime | undefined {
  return lang?.ime ? registry[lang.ime] : undefined;
}

/** True while an OS input method is composing (don't rewrite the box under it). */
export function composing(e: { nativeEvent: Event }): boolean {
  return !!(e.nativeEvent as InputEvent).isComposing;
}

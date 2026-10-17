// Input converters for languages that aren't typed directly on an English keyboard.
// Each converter turns what's been typed so far into the text to show in the box.
// German and other Roman-script languages need none (they use character buttons).
// Japanese (romaji -> kana -> kanji) and Chinese (pinyin -> hanzi) plug in here later.

import type { LanguageInfo } from "./types";

export type Ime = (typed: string) => string;

const registry: Record<string, Ime> = {};

export function registerIme(name: string, ime: Ime) {
  registry[name] = ime;
}

export function imeFor(lang?: LanguageInfo): Ime | undefined {
  return lang?.ime ? registry[lang.ime] : undefined;
}

// The learner's pronunciation for a language (Latin: restored or ecclesiastical; Greek: restored
// or modern), kept per language code on this device like the furigana and script switches.
// It decides which ```pron blocks show (a <style> rule written here) and how text is spoken:
// speech.ts sends every utterance in "la" or "grc" through routeSpeech, which picks the real
// voice language and respells the text (lib/classicalSpeech.ts). Recorded clips can be given per
// scheme (pickClip). No device has a Latin or Ancient Greek voice, so all of it is approximate.

import type { PronScheme } from "./pronBlocks";
import { greekRestored, latinEcclesiastical, latinRestored } from "./classicalSpeech";
import { toMonotonic } from "./greek";
export type { PronScheme } from "./pronBlocks";

/** The schemes the engine knows how to voice, by language (a course lists its own in language.pronunciations). */
export const KNOWN_SCHEMES: Record<string, PronScheme[]> = {
  la: [
    { id: "restored", label: "Restored classical" },
    { id: "ecclesiastical", label: "Ecclesiastical" },
  ],
  grc: [
    { id: "restored", label: "Restored Attic" },
    { id: "modern", label: "Modern Greek" },
  ],
};

const baseOf = (lang?: string) => (lang ?? "").toLowerCase().replace(/_/g, "-").split("-")[0];

const registered: Record<string, PronScheme[]> = {};
/** Choices made where storage is unavailable (they last for this page view). */
const memory: Record<string, string> = {};
const listeners = new Set<() => void>();
const key = (code: string) => `erudior.pron.${code}`;

/** Record a course's schemes (the first is the default). Safe to call on every render. */
export function registerSchemes(code: string | undefined, schemes: PronScheme[] | undefined) {
  if (!code || !schemes?.length) return;
  const prev = registered[code];
  if (prev && prev.length === schemes.length && prev.every((s, i) => s.id === schemes[i].id && s.label === schemes[i].label)) return;
  registered[code] = schemes;
  applyPronStyle();
}

/** The schemes for a language: the course's, else the built-in ones (empty for other languages). */
export const schemesFor = (code?: string): PronScheme[] => (code ? registered[code] ?? KNOWN_SCHEMES[code] ?? [] : []);

/** The learner's scheme for a language (the first scheme when nothing is saved, or the saved one isn't offered). */
export function activeScheme(code?: string): string | undefined {
  const list = schemesFor(code);
  if (!code || !list.length) return undefined;
  let saved: string | null = memory[code] ?? null;
  if (!saved) try {
    saved = typeof localStorage === "undefined" ? null : localStorage.getItem(key(code));
  } catch {
    saved = null;
  }
  return saved && list.some((s) => s.id === saved) ? saved : list[0].id;
}

export function setScheme(code: string, id: string) {
  memory[code] = id;
  try {
    localStorage.setItem(key(code), id);
  } catch {
    /* storage unavailable: lasts for this page view */
  }
  applyPronStyle();
  listeners.forEach((f) => f());
}

export function onPronChange(cb: () => void): () => void {
  listeners.add(cb);
  return () => void listeners.delete(cb);
}

/** One line for the learner: what the audio is, and that it's approximate. */
export function audioNote(code: string | undefined, scheme: string | undefined): string {
  const b = baseOf(code);
  if (b === "la")
    return scheme === "restored"
      ? "Audio: an Italian voice reading respelled text, so it's only approximate."
      : "Audio: an Italian voice, so it's approximate.";
  if (b === "grc")
    return scheme === "modern"
      ? "Audio: a Greek voice reading the text without breathings, so it's approximate."
      : scheme === "restored"
        ? "Audio: an Italian voice reading a transliteration, so it's only approximate."
        : "Audio is approximate.";
  return "Audio is approximate.";
}

/**
 * The voice and text to use for something said in `lang`: Latin goes to an Italian voice
 * (respelled for restored), Greek to a Greek voice (monotonic) for modern or an Italian voice
 * (transliterated) for restored. Other languages pass through.
 */
export function routeSpeech(text: string, lang: string): { text: string; lang: string } {
  const b = baseOf(lang);
  if (b === "la") {
    const s = activeScheme("la");
    return { lang: "it-IT", text: s === "restored" ? latinRestored(text) : s === "ecclesiastical" ? latinEcclesiastical(text) : text };
  }
  if (b === "grc") {
    const s = activeScheme("grc");
    return s === "restored" ? { lang: "it-IT", text: greekRestored(text) } : { lang: "el-GR", text: toMonotonic(text) };
  }
  return { text, lang };
}

/** The voice language alone (for "is there a voice?"). */
export const routeLang = (lang: string) => routeSpeech("", lang).lang;

/**
 * A recorded clip for the learner's scheme: `srcs[scheme]`; with `srcs` but none for this scheme,
 * the voice reads `text` (undefined is returned) unless there's no text, when `src` plays. Without
 * `srcs`, `src` plays for every scheme.
 */
export function pickClip(c: { src?: string; srcs?: Record<string, string>; text?: string }, lang?: string): string | undefined {
  if (!c.srcs || !Object.keys(c.srcs).length) return c.src;
  const scheme = activeScheme(baseOf(lang)) ?? Object.keys(c.srcs)[0];
  return c.srcs[scheme] ?? (c.text?.trim() ? undefined : c.src);
}

/**
 * A vocabulary word's recording (one per word, no scheme): played for the course's default
 * pronunciation only; for another scheme the voice reads the word instead.
 */
export function wordClip(audio: string | undefined, lang?: string): string | undefined {
  if (!audio) return undefined;
  const code = baseOf(lang);
  const list = schemesFor(code);
  if (!list.length) return audio;
  return activeScheme(code) === list[0].id ? audio : undefined;
}

const cssStr = (s: string) => s.replace(/["\\]/g, "");

/** Write the rule that hides other schemes' blocks on screen (print shows them all). */
export function applyPronStyle() {
  if (typeof document === "undefined") return;
  const codes = new Set([...Object.keys(KNOWN_SCHEMES), ...Object.keys(registered)]);
  const rules: string[] = [];
  for (const code of codes) {
    const on = activeScheme(code);
    if (!on) continue;
    const other = `[data-pron-lang="${cssStr(code)}"]:not([data-pron="${cssStr(on)}"])`;
    const mine = `[data-pron-lang="${cssStr(code)}"][data-pron="${cssStr(on)}"]`;
    rules.push(
      `.pron-blk${other} > .pron-body, .pron-blk${other} .pron-on, .pron-inl${other} { display: none; }`,
      `.pron-blk${other} .pron-off { display: inline; }`,
      `.pron-blk${mine} .pron-off { display: none; }`,
    );
  }
  let el = document.getElementById("pron-style") as HTMLStyleElement | null;
  if (!el) {
    el = document.createElement("style");
    el.id = "pron-style";
    document.head.appendChild(el);
  }
  el.textContent = `@media screen {\n${rules.join("\n")}\n}`;
}

// Tone drills for Chinese courses: "tone" questions (hear a syllable or word, pick its tone or
// tones) and the course setting `language.tones` that generates them from the vocabulary.
// Pure helpers only (no app imports beyond pinyin.ts), so the canonical validator, the course
// checker and the drill runner share them. See docs/BANK_FORMAT.md and COURSE_FORMAT.md.

import { hasHan, isHan, pinyinPairs, pinyinReadingProblem, stripTones } from "./pinyin";

/** Tones in answer order: 1–4, then neutral. Internally neutral is 0 (as in tonesOf); key 5 or 0 picks it. */
export const TONES = [1, 2, 3, 4, 0] as const;
export type Tone = (typeof TONES)[number];

/** The longest word a tone question may ask about. */
export const MAX_TONE_SYLLABLES = 4;

const NAMES: Record<number, string> = { 1: "high level", 2: "rising", 3: "falling-rising", 4: "falling", 0: "neutral" };
/** The tone's mark on a bare vowel, for the answer buttons. */
export const TONE_GLYPH: Record<number, string> = { 1: "ā", 2: "á", 3: "ǎ", 4: "à", 0: "a" };

/** The key that picks a tone (5 for neutral). */
export const toneKey = (t: number) => (t === 0 ? 5 : t);
/** The tone a key picks: "1"–"4", "5" or "0" for neutral; undefined for other keys. */
export const toneFromKey = (k: string): Tone | undefined => (/^[1-4]$/.test(k) ? (Number(k) as Tone) : k === "5" || k === "0" ? 0 : undefined);

/** For screen readers and labels: "tone 3, falling-rising", "neutral tone". */
export const toneLabel = (t: number) => (t >= 1 && t <= 4 ? `tone ${t}, ${NAMES[t]}` : "neutral tone");
/** Short form for patterns: "3", "neutral". */
export const toneShort = (t: number) => (t >= 1 && t <= 4 ? String(t) : "neutral");
/** A pattern as text: "3+4", "4+neutral". */
export const patternText = (tones: number[]) => tones.map(toneShort).join("+");

export interface ToneSyllable {
  /** The character(s) for this syllable (a character + 儿 for erhua). */
  chars: string;
  /** Marked syllable, e.g. "mǎ". */
  marked: string;
  /** Without the tone mark, e.g. "ma". */
  plain: string;
  /** 1–4, 0 = neutral. */
  tone: Tone;
}

/** What's wrong with a tone item (characters + pinyin), or undefined when it can be drilled. */
export function toneItemProblem(text: string, reading: string): string | undefined {
  const t = text.trim();
  if (!t) return `needs "text": the characters to say`;
  if (!hasHan(t)) return `"text" must be Chinese characters (the voice reads characters, never pinyin)`;
  const other = [...t].filter((c) => !isHan(c));
  if (other.length) return `"text" must be Han characters only (remove "${other.join("")}")`;
  if (!reading.trim()) return `needs "reading": the pinyin with tone marks, e.g. "mā"`;
  const p = pinyinReadingProblem(t, reading);
  if (p) return `"reading": ${p}`;
  const n = pinyinPairs(t, reading)!.length;
  if (n > MAX_TONE_SYLLABLES) return `has ${n} syllables; tone questions take 1 to ${MAX_TONE_SYLLABLES}`;
  return undefined;
}

/** The syllables of a valid tone item (empty when the item isn't valid). */
export function toneSyllables(text: string, reading: string): ToneSyllable[] {
  if (toneItemProblem(text, reading)) return [];
  return pinyinPairs(text.trim(), reading.trim())!.map((p) => ({
    chars: p.base,
    marked: p.syl,
    plain: stripTones(p.syl).toLowerCase(),
    tone: (p.tone >= 1 && p.tone <= 4 ? p.tone : 0) as Tone,
  }));
}

/**
 * Third-tone sandhi as it is heard: a third tone before another third tone is said as a second
 * tone (你好 nǐ hǎo sounds ní hǎo; 3+3+3 sounds 2+2+3). 一 and 不 are already written with their
 * changes in our courses, so nothing else changes.
 */
export function heardTones(tones: number[]): number[] {
  return tones.map((t, i) => (t === 3 && tones[i + 1] === 3 ? 2 : t));
}

/** The patterns graded right: the written tones, and the heard ones when sandhi changes them. */
export function acceptedPatterns(tones: number[]): number[][] {
  const heard = heardTones(tones);
  return heard.some((t, i) => t !== tones[i]) ? [tones, heard] : [tones];
}

/** The learner's picks as tones (-1 = not picked yet), one per syllable. */
export function picksOf(chosen: readonly unknown[] | undefined, n: number): number[] {
  return Array.from({ length: n }, (_, i) => {
    const c = Number(chosen?.[i]);
    return Number.isInteger(c) && c >= 0 && c <= 4 ? c : -1;
  });
}

export const toneAnswered = (picks: number[]) => picks.some((t) => t >= 0);
export const toneComplete = (picks: number[]) => picks.length > 0 && picks.every((t) => t >= 0);

/** Right when the picks equal the written tones or, for 3+3, the tones as heard. */
export function toneCorrect(tones: number[], picks: number[]): boolean {
  return toneComplete(picks) && acceptedPatterns(tones).some((a) => a.length === picks.length && a.every((t, i) => t === picks[i]));
}

/** Per syllable right/wrong against the accepted pattern that's closest to the picks. */
export function toneParts(tones: number[], picks: number[]): boolean[] {
  const scored = acceptedPatterns(tones).map((a) => a.map((t, i) => t === picks[i]));
  return scored.reduce((best, s) => (s.filter(Boolean).length > best.filter(Boolean).length ? s : best));
}

/** Feedback for a checked answer: the marked pinyin, the pattern and a sandhi note when it applies. */
export function toneFeedback(syls: ToneSyllable[]): string {
  const tones = syls.map((s) => s.tone);
  const heard = heardTones(tones);
  const marked = syls.map((s) => s.marked).join(" ");
  const what = syls.length === 1 ? toneLabel(tones[0]) : `tones ${patternText(tones)}`;
  const sandhi = heard.some((t, i) => t !== tones[i])
    ? ` Third-tone sandhi: you hear ${patternText(heard)}; both answers count.`
    : "";
  return `${marked}: ${what}.${sandhi}`;
}

/**
 * Single characters a voice often says with the wrong tone in isolation: polyphones (好 hǎo/hào,
 * 了, 行…) and characters engines are known to misread. Fine inside words; the checker warns on
 * one-character tone questions with these, and generated drills skip them.
 */
export const RISKY_SINGLE = new Set([..."好了行乐长还得的地着都和只发重为便觉教会少种中数要看假处差当分干相应调朝空传落血薄降率说耳"]);

/** A one-character item the voice may say with the wrong tone (see RISKY_SINGLE), or neutral alone. */
export function riskySingle(syls: ToneSyllable[]): string | undefined {
  if (syls.length !== 1) return undefined;
  if (syls[0].tone === 0) return "a neutral-tone syllable said on its own is usually read with a full tone; drill it inside a word";
  if (RISKY_SINGLE.has(syls[0].chars)) return `${syls[0].chars} has more than one reading or is often misread alone; use an unambiguous character (妈 mā, 麻 má, 马 mǎ, 骂 mà) or a recording`;
  return undefined;
}

// ---------------------------------------------------------------------------------------------
// Course setting: `language.tones` turns on tone practice made from the vocabulary.

export interface ToneSettings {
  /** The lesson that opens tone practice (none: open from the start). */
  lesson?: string;
  /** The earlier course that lesson is in. */
  from?: string;
  /** Longest word drilled, in syllables (1–4, default 2: single syllables and tone pairs). */
  max?: number;
  /** Prompts per round (default 10). */
  round?: number;
}

const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);
const ID = /^[A-Za-z0-9_-]+$/;
const intIn = (v: unknown, lo: number, hi: number) => typeof v === "number" && Number.isInteger(v) && v >= lo && v <= hi;

/** `language.tones` from raw JSON: `true` or an object turns tone practice on; anything else is off. */
export function normalizeToneSettings(raw: unknown): ToneSettings | undefined {
  if (raw === true) return {};
  if (!isObj(raw)) return undefined;
  const out: ToneSettings = {};
  for (const k of ["lesson", "from"] as const) if (typeof raw[k] === "string" && ID.test(raw[k] as string)) out[k] = raw[k] as string;
  if (intIn(raw.max, 1, MAX_TONE_SYLLABLES)) out.max = raw.max as number;
  if (intIn(raw.round, 1, 100)) out.round = raw.round as number;
  return out;
}

/** Shape problems for the canonical validator ([path, message] pairs). */
export function toneSettingsProblems(language: Record<string, unknown> | undefined): [string, string][] {
  const t = language?.tones;
  if (t === undefined || t === true) return [];
  if (!isObj(t)) return [["language.tones", "must be true or an object"]];
  const out: [string, string][] = [];
  for (const k of Object.keys(t)) if (!["lesson", "from", "max", "round"].includes(k)) out.push([`language.tones.${k}`, "unsupported or authority/runtime field"]);
  for (const k of ["lesson", "from"]) if (t[k] !== undefined && (typeof t[k] !== "string" || !ID.test(t[k] as string))) out.push([`language.tones.${k}`, "invalid stable ID"]);
  if (t.max !== undefined && !intIn(t.max, 1, MAX_TONE_SYLLABLES)) out.push(["language.tones.max", `must be an integer from 1 to ${MAX_TONE_SYLLABLES}`]);
  if (t.round !== undefined && !intIn(t.round, 1, 100)) out.push(["language.tones.round", "must be an integer from 1 to 100"]);
  return out;
}

/** Can this vocabulary word be a generated tone prompt? (Only whole words, as the voice says them.) */
export function drillableWord(term: string, reading: string | undefined, max = 2): ToneSyllable[] | undefined {
  if (!reading) return undefined;
  const syls = toneSyllables(term, reading);
  if (!syls.length || syls.length > max || riskySingle(syls)) return undefined;
  return syls;
}

// Tone practice rounds for Chinese courses with `language.tones` (lib/tones.ts): prompts made from
// vocabulary words of one to `max` syllables (default 2: single syllables and tone pairs). A word
// joins practice when its lesson is done; a lesson's own button practises that lesson's words.
// Accuracy is kept per tone (written tones; heard-as sandhi counts as right) in progress.conj
// under "zh:tone-1"… "zh:tone-0", next to the conjugation tallies.

import type { ConjTally, Course, Progress, VocabItem } from "./types";
import { drillableWord, TONES, type ToneSettings, type ToneSyllable } from "./tones";
import { unlockedItems } from "./vocab";
import { today } from "./srs";

export const TONE_ROUND = 10;

export interface TonePrompt {
  item: VocabItem;
  syls: ToneSyllable[];
}

/** The course's tone practice setting (Chinese courses only). */
export const toneSettings = (course: Course): ToneSettings | undefined => (course.language?.code === "zh" ? course.language.tones : undefined);

/** Tone practice is open: no unlocking lesson, or it's done. */
export function toneOpen(course: Course, p: Progress): boolean {
  const s = toneSettings(course);
  return !!s && (!s.lesson || !!p.lessonsDone[`${s.from ?? course.id}/${s.lesson}`]);
}

/** Every vocabulary word that can be a tone prompt, whatever is unlocked. */
export function toneWords(course: Course, items = course.vocab ?? []): TonePrompt[] {
  const max = toneSettings(course)?.max ?? 2;
  return items.flatMap((item) => {
    const syls = drillableWord(item.term, item.reading, max);
    return syls ? [{ item, syls }] : [];
  });
}

export const toneTallyKey = (tone: number) => `zh:tone-${tone}`;
const tally = (p: Progress, tone: number): ConjTally => p.conj?.[toneTallyKey(tone)] ?? { right: 0, wrong: 0 };

/** Record one counted answer: each syllable's written tone gets right or wrong. */
export function recordTones(p: Progress, syls: ToneSyllable[], parts: boolean[], now = today()): Progress {
  const conj = { ...p.conj };
  syls.forEach((s, i) => {
    const t = conj[toneTallyKey(s.tone)] ?? { right: 0, wrong: 0 };
    conj[toneTallyKey(s.tone)] = { right: t.right + (parts[i] ? 1 : 0), wrong: t.wrong + (parts[i] ? 0 : 1), last: now };
  });
  return { ...p, conj };
}

/** Accuracy for each tone, for the Vocabulary tab. */
export function toneSummary(p: Progress) {
  return TONES.map((tone) => ({ tone, ...tally(p, tone) }));
}

/**
 * One round. `lessonIds`: that lesson's own words (from its "Practise the tones" button);
 * otherwise every unlocked word. Words with the tones the learner misses most come first more
 * often; no word repeats within a round.
 */
export function buildToneRound(course: Course, p: Progress, opts: { lessonIds?: string[]; n?: number; rand?: () => number; now?: string } = {}): TonePrompt[] {
  const s = toneSettings(course);
  if (!s || !toneOpen(course, p)) return [];
  const n = opts.n ?? s.round ?? TONE_ROUND;
  const rand = opts.rand ?? Math.random;
  const pool = opts.lessonIds?.length
    ? (course.vocab ?? []).filter((v) => !v.from && opts.lessonIds!.includes(v.lesson))
    : unlockedItems(course, p, opts.now ?? today());
  const miss = (t: number) => {
    const x = tally(p, t);
    return (x.wrong + 1) / (x.right + x.wrong + 2);
  };
  const weighted = toneWords(course, pool).map((w) => ({ w, k: rand() ** (1 / Math.max(...w.syls.map((y) => miss(y.tone)))) }));
  const round = weighted.sort((a, b) => b.k - a.k).slice(0, n).map((x) => x.w);
  for (let i = round.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [round[i], round[j]] = [round[j], round[i]];
  }
  return round;
}

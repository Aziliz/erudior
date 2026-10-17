// Vocabulary reviews for language courses, in the style of WaniKani.
//
// Each word gets typed cards: "meaning" (see the word, type the English) and "recall"
// (see the English, type the word). A card climbs four stages — Novice, Beginner,
// Advanced, Expert — and needs 5 correct answers in a row to leave each one. A wrong
// answer resets the count within the current stage (Advanced 4/5 -> Advanced 0/5);
// it never drops a stage. After Expert the card is learned and leaves the rotation.
//
// Only the first answer to a card each day counts. Wrong cards come back later in
// the same session as practice, and "extra practice" never changes anything.

import type { Course, Progress, VocabDirection, VocabItem, VocabState } from "./types";
import { today } from "./srs";

export const STAGES = ["Novice", "Beginner", "Advanced", "Expert"] as const;
export const PER_STAGE = 5;

export interface VocabCard {
  item: VocabItem;
  dir: VocabDirection;
  key: string;
}

/**
 * Progress key for one card. Keys are per language, not per course, so a word's level carries
 * from German A1 into German A2 (whose list includes A1's words).
 */
export const vocabKey = (course: Course, itemId: string, dir: VocabDirection) =>
  `${course.language?.code ?? course.id}:${itemId}/${dir}`;

export const directions = (item: VocabItem): VocabDirection[] => item.directions ?? ["meaning", "recall"];

export function stateOf(p: Progress, key: string): VocabState {
  return p.vocab?.[key] ?? { stage: 0, streak: 0 };
}

/** Carried-over words (from an earlier course) that haven't been reviewed yet join this many per day. */
export const CARRY_PER_DAY = 20;

const started = (course: Course, p: Progress, it: VocabItem) =>
  directions(it).some((d) => !!p.vocab?.[vocabKey(course, it.id, d)]);

/** A word's own lesson is done (in this course, or in the earlier course it came from). */
const lessonDone = (course: Course, p: Progress, it: VocabItem) => !!p.lessonsDone[`${it.from ?? course.id}/${it.lesson}`];

/**
 * Words in the review rotation: this course's words whose lesson is done, plus carried-over
 * words that are already started or whose lesson was done in the earlier course. Carried-over
 * words not yet seen join CARRY_PER_DAY a day (counting the ones first reviewed today).
 */
export function unlockedItems(course: Course, p: Progress, now = today()): VocabItem[] {
  const items = course.vocab ?? [];
  const introducedToday = items.filter(
    (it) => it.from && !lessonDone(course, p, it) && directions(it).some((d) => p.vocab?.[vocabKey(course, it.id, d)]?.intro === now),
  ).length;
  let room = Math.max(0, CARRY_PER_DAY - introducedToday);
  return items.filter((it) => {
    if (!it.from) return lessonDone(course, p, it);
    if (lessonDone(course, p, it) || started(course, p, it)) return true;
    if (room > 0) {
      room--;
      return true;
    }
    return false;
  });
}

export function cardsFor(course: Course, items: VocabItem[]): VocabCard[] {
  return items.flatMap((item) => directions(item).map((dir) => ({ item, dir, key: vocabKey(course, item.id, dir) })));
}

/** Cards that can be reviewed (counted) today. */
export function dueCards(course: Course, p: Progress, now = today()): VocabCard[] {
  return cardsFor(course, unlockedItems(course, p, now)).filter((c) => {
    const s = stateOf(p, c.key);
    return !s.done && s.last !== now;
  });
}

/** Most cards one review session holds; the rest wait for the next session. */
export const REVIEW_CAP = 100;

/**
 * One review session: up to REVIEW_CAP due cards, in a shuffled order. Cards already in
 * progress come first (lowest level, longest unseen), then cards not yet started, in course order.
 */
export function reviewBatch(course: Course, p: Progress, now = today(), cap = REVIEW_CAP): VocabCard[] {
  const due = dueCards(course, p, now);
  const rank = (c: VocabCard) => {
    const st = p.vocab?.[c.key];
    return st ? [0, st.stage, st.last ?? ""] : [1, 0, ""];
  };
  const order = due.map((c, i) => ({ c, i, r: rank(c) }));
  order.sort((a, b) => {
    for (let k = 0; k < 3; k++) if (a.r[k] !== b.r[k]) return a.r[k] < b.r[k] ? -1 : 1;
    return a.i - b.i;
  });
  return shuffled(order.slice(0, cap).map((x) => x.c));
}

/**
 * Move vocabulary progress saved under the old per-course keys (`courseId/itemId/dir`) to the
 * per-language keys. Returns the same object when there's nothing to move.
 */
export function migrateVocabKeys(p: Progress, courses: Course[]): Progress {
  if (!p.vocab) return p;
  const lang = new Map(courses.filter((c) => c.language).map((c) => [c.id, c.language!.code]));
  let changed = false;
  const out: Record<string, VocabState> = {};
  for (const [k, v] of Object.entries(p.vocab)) {
    const m = /^(.+)\/([^/]+)\/(meaning|recall)$/.exec(k);
    const code = m && lang.get(m[1]);
    if (m && code) {
      const nk = `${code}:${m[2]}/${m[3]}`;
      if (!p.vocab[nk] && !out[nk]) out[nk] = v;
      changed = true;
    } else out[k] = v;
  }
  return changed ? { ...p, vocab: out } : p;
}

export interface VocabSummary {
  total: number;
  unlocked: number;
  /** Words with every card past Expert. */
  learned: number;
  due: number;
  /** Cards per stage, plus learned cards. */
  byStage: number[];
  learnedCards: number;
}

export function vocabSummary(course: Course, p: Progress, now = today()): VocabSummary {
  const items = course.vocab ?? [];
  const unlocked = unlockedItems(course, p, now);
  const byStage = [0, 0, 0, 0];
  let learnedCards = 0;
  for (const c of cardsFor(course, unlocked)) {
    const s = stateOf(p, c.key);
    if (s.done) learnedCards++;
    else byStage[s.stage]++;
  }
  const learned = unlocked.filter((it) => directions(it).every((d) => stateOf(p, vocabKey(course, it.id, d)).done)).length;
  return { total: items.length, unlocked: unlocked.length, learned, due: dueCards(course, p, now).length, byStage, learnedCards };
}

/** Apply one counted answer. Returns the new state and what happened. */
export function applyAnswer(s: VocabState, correct: boolean, now = today()): { next: VocabState; event: "up" | "learned" | "step" | "reset" } {
  s = { ...s, intro: s.intro ?? now };
  if (!correct) return { next: { ...s, streak: 0, last: now, wrong: (s.wrong ?? 0) + 1 }, event: "reset" };
  const right = (s.right ?? 0) + 1;
  if (s.streak + 1 < PER_STAGE) return { next: { ...s, streak: s.streak + 1, last: now, right }, event: "step" };
  if (s.stage + 1 < STAGES.length) return { next: { ...s, stage: s.stage + 1, streak: 0, last: now, right }, event: "up" };
  return { next: { ...s, stage: STAGES.length - 1, streak: PER_STAGE, done: true, last: now, right }, event: "learned" };
}

export function stageLabel(s: VocabState): string {
  return s.done ? "Learned" : `${STAGES[s.stage]} ${s.streak}/${PER_STAGE}`;
}

// --- Checking typed answers ---------------------------------------------------

export type Verdict =
  | { ok: true; note?: string }
  | { ok: false; retry: true; note: string } // try again, not counted (missing article, digraph for umlaut…)
  | { ok: false; retry?: false; note?: string };

const ARTICLES = ["der", "die", "das"];

/** Edit distance where swapping two neighboring letters counts as one typo. */
export function typoDistance(a: string, b: string): number {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++) {
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
    }
  return d[a.length][b.length];
}

/** Normalize an English meaning for comparison: case, punctuation, "to"/"a"/"the", parentheses. */
export function normMeaning(s: string): string {
  return s
    .toLowerCase()
    .replace(/\([^)]*\)/g, " ")
    .replace(/[’']/g, "'")
    .replace(/[.,!?;:"]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^(to|a|an|the) /, "")
    .trim();
}

function normTerm(s: string): string {
  return s.normalize("NFC").replace(/[.,!?;:"„“”]/g, " ").replace(/\s+/g, " ").trim();
}

const DIGRAPHS: [RegExp, string][] = [
  [/ä/g, "ae"],
  [/ö/g, "oe"],
  [/ü/g, "ue"],
  [/Ä/g, "Ae"],
  [/Ö/g, "Oe"],
  [/Ü/g, "Ue"],
  [/ß/g, "ss"],
];
const undigraph = (s: string) => DIGRAPHS.reduce((t, [re, r]) => t.replace(re, r), s);

/** Typed English for a word: any listed meaning, small typos forgiven on longer words. */
export function checkMeaning(item: VocabItem, typed: string): Verdict {
  const t = normMeaning(typed);
  if (!t) return { ok: false, retry: true, note: "Type an answer." };
  const wants = item.meanings.flatMap((m) => [m, ...m.split(/\s*[/;]\s*/)]).map(normMeaning).filter(Boolean);
  if (wants.includes(t)) return { ok: true };
  for (const w of wants) {
    const allowed = w.length >= 8 ? 2 : w.length >= 4 ? 1 : 0;
    if (allowed && typoDistance(t, w) <= allowed) return { ok: true, note: `Close enough: “${item.meanings[0]}”` };
  }
  return { ok: false };
}

/** Typed word for an English prompt: exact spelling; nouns need their article. */
export function checkRecall(item: VocabItem, typed: string, lang = "de"): Verdict {
  const t = normTerm(typed);
  if (!t) return { ok: false, retry: true, note: "Type an answer." };
  const wants = [item.term, ...(item.alt ?? [])].map(normTerm);
  if (wants.includes(t)) return { ok: true };
  const lower = t.toLowerCase();
  const ci = wants.find((w) => w.toLowerCase() === lower);
  if (ci) return { ok: true, note: lang === "de" ? `Watch the capitals: ${ci}` : `Spelled ${ci}` };

  if (lang === "de") {
    const isNoun = item.pos === "noun" || ARTICLES.includes(item.term.split(" ")[0]);
    if (isNoun) {
      const [art, ...rest] = item.term.split(" ");
      const bare = rest.join(" ");
      if (lower === bare.toLowerCase()) return { ok: false, retry: true, note: "Include the article: der, die or das." };
      const [tArt, ...tRest] = t.split(" ");
      if (ARTICLES.includes(tArt.toLowerCase()) && tRest.join(" ").toLowerCase() === bare.toLowerCase() && tArt.toLowerCase() !== art)
        return { ok: false, note: `Wrong article: it's ${art} ${bare}.` };
    }
    // Typed ae/oe/ue/ss instead of ä/ö/ü/ß: ask for the real letter, no penalty.
    if (wants.some((w) => undigraph(w).toLowerCase() === lower && undigraph(w) !== w))
      return { ok: false, retry: true, note: "Use the special letters (ä, ö, ü, ß); the buttons below the box type them." };
  }
  return { ok: false };
}

export function checkAnswer(card: VocabCard, typed: string, lang?: string): Verdict {
  return card.dir === "meaning" ? checkMeaning(card.item, typed) : checkRecall(card.item, typed, lang);
}

/** Fisher–Yates shuffle (copy). */
export function shuffled<T>(xs: T[]): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

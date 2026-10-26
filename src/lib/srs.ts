// Spaced repetition: FSRS-5 (the scheduler modern Anki uses). Day-granular.

import { courseMastery, isWeak } from "./mastery";
import { answerText, isChoice } from "./questions";
import type { Card, CardState, Course, Deck, Progress } from "./types";
import { shuffle } from "./util";

export type Rating = "again" | "hard" | "good" | "easy";

export const cardKey = (courseId: string, deckId: string, cardId: string) => `${courseId}/${deckId}/${cardId}`;

export function today(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function addDays(iso: string, n: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  return today(new Date(y, m - 1, d + n));
}

export function daysBetween(a: string, b: string): number {
  const [y1, m1, d1] = a.split("-").map(Number);
  const [y2, m2, d2] = b.split("-").map(Number);
  return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 86400000);
}

// ---------------------------------------------------------------------------
// FSRS-5 (Free Spaced Repetition Scheduler) with the published default weights.

/** FSRS-5 default parameters w0..w18. */
export const FSRS_W = [
  0.40255, 1.18385, 3.173, 15.69105, 7.1949, 0.5345, 1.4604, 0.0046, 1.54575, 0.1192, 1.01925, 1.9395, 0.11,
  0.29605, 2.2698, 0.2315, 2.9898, 0.51655, 0.6621,
] as const;
const DECAY = -0.5;
const FACTOR = 19 / 81; // makes R(S, S) = 0.9
export const TARGET_RETENTION = 0.9;
export const MAX_INTERVAL = 365;
const MIN_STABILITY = 0.01;
const GRADE: Record<Rating, number> = { again: 1, hard: 2, good: 3, easy: 4 };

const clamp = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, x));
const clampD = (d: number) => clamp(d, 1, 10);

/** Probability of recall after `t` days at stability `s`. */
export const retrievability = (t: number, s: number) => Math.pow(1 + (FACTOR * t) / s, DECAY);
const initStability = (g: number) => FSRS_W[g - 1];
const initDifficulty = (g: number) => clampD(FSRS_W[4] - Math.exp(FSRS_W[5] * (g - 1)) + 1);

function nextDifficulty(d: number, g: number): number {
  const delta = -FSRS_W[6] * (g - 3);
  const damped = d + (delta * (10 - d)) / 9; // linear damping
  return clampD(FSRS_W[7] * initDifficulty(4) + (1 - FSRS_W[7]) * damped); // mean reversion
}

function recallStability(d: number, s: number, r: number, g: number): number {
  const hard = g === 2 ? FSRS_W[15] : 1;
  const easy = g === 4 ? FSRS_W[16] : 1;
  const inc =
    Math.exp(FSRS_W[8]) * (11 - d) * Math.pow(s, -FSRS_W[9]) * (Math.exp(FSRS_W[10] * (1 - r)) - 1) * hard * easy;
  return s * (inc + 1);
}

function forgetStability(d: number, s: number, r: number): number {
  const sf =
    FSRS_W[11] * Math.pow(d, -FSRS_W[12]) * (Math.pow(s + 1, FSRS_W[13]) - 1) * Math.exp(FSRS_W[14] * (1 - r));
  return Math.min(sf, s);
}

/** Same-day review (FSRS-5 short-term stability). */
const shortTermStability = (s: number, g: number) => s * Math.exp(FSRS_W[17] * (g - 3 + FSRS_W[18]));

/** Days until recall probability drops to TARGET_RETENTION, capped. */
function intervalFor(s: number): number {
  const raw = (s / FACTOR) * (Math.pow(TARGET_RETENTION, 1 / DECAY) - 1);
  return clamp(Math.round(raw), 1, MAX_INTERVAL);
}

/**
 * Memory state (stability, difficulty) to update from. Legacy SM-2 cards have
 * none: stability ≈ their current interval, difficulty mapped linearly from
 * ease (2.5 → 5, 1.3 → 10, ≥3.7 → 1). Returns null for a never-rated card.
 */
function memoryOf(prev: CardState | undefined): { s: number; d: number } | null {
  if (!prev) return null;
  if (prev.stability != null && prev.difficulty != null)
    return { s: Math.max(MIN_STABILITY, prev.stability), d: clampD(prev.difficulty) };
  if (prev.reps === 0) return null; // only ever pressed "again" under SM-2: start fresh
  const s = clamp(prev.ivl > 0 ? prev.ivl : FSRS_W[0], FSRS_W[0], MAX_INTERVAL);
  const d = clampD(5 + ((2.5 - (prev.ease ?? 2.5)) * 25) / 6);
  return { s, d };
}

function nextMemory(prev: CardState | undefined, g: number, now: string): { s: number; d: number } {
  const m = memoryOf(prev);
  if (!m) return { s: initStability(g), d: initDifficulty(g) };
  const t = Math.max(0, daysBetween(prev!.last, now));
  const d = nextDifficulty(m.d, g);
  let s: number;
  if (t === 0) s = shortTermStability(m.s, g);
  else {
    const r = retrievability(t, m.s);
    s = g === 1 ? forgetStability(m.d, m.s, r) : recallStability(m.d, m.s, r, g);
  }
  return { s: Math.max(MIN_STABILITY, s), d };
}

/**
 * Next state after a rating, scheduled with FSRS-5 (default weights, 90% target
 * retention, max 365 days, day granularity). Each rating updates the card's
 * stability/difficulty and the interval is the time until predicted recall
 * falls to 90%, kept so hard < good < easy. "again" keeps the card in today's
 * session (ivl 0). Old SM-2 cards are converted on their next rating.
 */
export function schedule(prev: CardState | undefined, r: Rating, now = today()): CardState {
  const s: CardState = prev
    ? { ...prev }
    : { due: now, ivl: 0, ease: 2.5, reps: 0, lapses: 0, last: now, first: now };
  const isNew = !prev || prev.reps === 0;
  const mem = nextMemory(prev, GRADE[r], now);
  let ivl: number;
  if (r === "again") {
    if (!isNew) s.lapses++;
    ivl = 0;
  } else {
    let hard = intervalFor(nextMemory(prev, 2, now).s);
    let good = intervalFor(nextMemory(prev, 3, now).s);
    let easy = intervalFor(nextMemory(prev, 4, now).s);
    hard = Math.min(hard, good);
    good = Math.min(MAX_INTERVAL, Math.max(good, hard + 1));
    easy = Math.min(MAX_INTERVAL, Math.max(easy, good + 1));
    ivl = r === "hard" ? hard : r === "good" ? good : easy;
  }
  s.stability = mem.s;
  s.difficulty = mem.d;
  s.ivl = ivl;
  s.reps = r === "again" ? s.reps : s.reps + 1;
  s.due = addDays(now, s.ivl);
  s.last = now;
  return s;
}

/** Short label of the interval a rating would give, for the buttons. */
export function previewInterval(prev: CardState | undefined, r: Rating): string {
  const n = schedule(prev, r).ivl;
  if (n === 0) return "now";
  if (n < 30) return `${n}d`;
  if (n < 365) return `${Math.round(n / 30)}mo`;
  return "1y";
}

export interface QueueItem {
  key: string;
  deck: Deck;
  card: Card;
}

export interface DeckStatus {
  due: number;
  fresh: number; // never studied
  learned: number;
  mature: number; // interval >= 21 days
  total: number;
}

export function deckStatus(course: Course, deck: Deck, progress: Progress, now = today()): DeckStatus {
  const st: DeckStatus = { due: 0, fresh: 0, learned: 0, mature: 0, total: deck.cards.length };
  for (const c of deck.cards) {
    const s = progress.cards[cardKey(course.id, deck.id, c.id)];
    if (!s) st.fresh++;
    else {
      st.learned++;
      if (s.due <= now) st.due++;
      if (s.ivl >= 21) st.mature++;
    }
  }
  return st;
}

/** How many new cards have already been introduced today in this course. */
export function newIntroducedToday(course: Course, progress: Progress, now = today()): number {
  const prefix = `${course.id}/`;
  return Object.entries(progress.cards).filter(([k, s]) => k.startsWith(prefix) && s.first === now).length;
}

/** Due reviews first (oldest due first), then up to `newLimit` new cards. */
export function buildReviewQueue(
  course: Course,
  decks: Deck[],
  progress: Progress,
  newLimit: number,
  now = today(),
): QueueItem[] {
  const due: (QueueItem & { dueOn: string })[] = [];
  const fresh: QueueItem[] = [];
  for (const deck of decks) {
    for (const card of deck.cards) {
      const key = cardKey(course.id, deck.id, card.id);
      const s = progress.cards[key];
      if (!s) fresh.push({ key, deck, card });
      else if (s.due <= now) due.push({ key, deck, card, dueOn: s.due });
    }
  }
  due.sort((a, b) => a.dueOn.localeCompare(b.dueOn));
  const room = Math.max(0, newLimit - newIntroducedToday(course, progress, now));
  // New cards on topics you're weak in come first; the rest keep their deck order.
  const mastery = courseMastery(course, progress);
  const weakFirst = [...fresh.filter((f) => isWeak(mastery.get(f.card.topic ?? ""))), ...fresh.filter((f) => !isWeak(mastery.get(f.card.topic ?? "")))];
  return [...due, ...weakFirst.slice(0, room)];
}

export function cramQueue(course: Course, decks: Deck[], topics: string[] = []): QueueItem[] {
  const items: QueueItem[] = [];
  for (const deck of decks)
    for (const card of deck.cards)
      if (!topics.length || (card.topic && topics.includes(card.topic)))
        items.push({ key: cardKey(course.id, deck.id, card.id), deck, card });
  return shuffle(items);
}

// ---------------------------------------------------------------------------
// The "Missed questions" deck: built at runtime from questions you've gotten
// wrong in this course's banks, so they come back on a spaced schedule.

export const MISSED_DECK_ID = "missed";

export function missedDeck(course: Course, progress: Progress): Deck | null {
  const cards: Card[] = [];
  for (const bank of course.banks) {
    const stats = progress.stats[bank.id] ?? {};
    const local = bank.id.slice(course.id.length + 2) || bank.id;
    for (const q of bank.questions) {
      const s = stats[q.id];
      if (!s || s.correct >= s.seen) continue; // never missed
      if (q.type === "code") continue; // writing code doesn't fit on a flash card
      const letters = "ABCDEFGH";
      const choice = isChoice(q);
      const front = choice ? `${q.stem}\n\n${q.choices.map((c, i) => `${letters[i]}. ${c}`).join("  \n")}` : q.stem;
      const right = choice ? q.answer.map((i) => `**${letters[i]}. ${q.choices[i]}**`).join("  \n") : `**${answerText(q)}**`;
      cards.push({
        id: `${local}--${q.id}`,
        front,
        back: q.explanation ? `${right}\n\n${q.explanation}` : right,
        topic: q.topic,
      });
    }
  }
  if (!cards.length) return null;
  return {
    id: MISSED_DECK_ID,
    title: "Missed questions",
    description: "Built automatically from questions you've answered wrong",
    cards,
  };
}

/** The course's own decks plus the automatic missed-questions deck. */
export function studyDecks(course: Course, progress: Progress): Deck[] {
  const m = missedDeck(course, progress);
  return m ? [...course.decks, m] : course.decks;
}

// Spaced repetition: a simplified SM-2 (the family Anki uses). Day-granular.

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

/** Next state after a rating. "again" keeps the card in today's session. */
export function schedule(prev: CardState | undefined, r: Rating, now = today()): CardState {
  const s: CardState = prev
    ? { ...prev }
    : { due: now, ivl: 0, ease: 2.5, reps: 0, lapses: 0, last: now, first: now };
  const isNew = !prev || prev.reps === 0;
  let ivl: number;
  if (r === "again") {
    if (!isNew) s.lapses++;
    s.ease = Math.max(1.3, s.ease - 0.2);
    ivl = 0;
  } else if (isNew) {
    ivl = r === "hard" ? 1 : r === "good" ? 1 : 4;
    if (r === "easy") s.ease += 0.15;
  } else if (r === "hard") {
    ivl = Math.max(1, Math.round(s.ivl * 1.2));
    s.ease = Math.max(1.3, s.ease - 0.15);
  } else if (r === "good") {
    ivl = Math.max(s.ivl + 1, Math.round(s.ivl * s.ease));
  } else {
    ivl = Math.max(s.ivl + 2, Math.round(s.ivl * s.ease * 1.3));
    s.ease += 0.15;
  }
  s.ivl = Math.min(ivl, 365);
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
  return [...due, ...fresh.slice(0, room)];
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
      const letters = "ABCDEFGH";
      const front = `${q.stem}\n\n${q.choices.map((c, i) => `${letters[i]}. ${c}`).join("  \n")}`;
      const right = q.answer.map((i) => `**${letters[i]}. ${q.choices[i]}**`).join("  \n");
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

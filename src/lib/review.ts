// Spaced reviews for practice questions (successive relearning): a question you get right comes
// back after a growing gap, and only counts as learned after you've got it right on three
// different days. A miss starts it over and brings it back tomorrow. A lucky guess doesn't move
// it forward. Notecards have their own scheduler (srs.ts); this is for bank questions.
import type { QuestionStat } from "./types";

export type Confidence = "sure" | "unsure" | "guess";

/** Days until the next review after the 1st, 2nd, 3rd... right answer on separate days. */
export const GAPS = [1, 3, 7, 21, 60];
/** Right answers on separate days before a question counts as learned. */
export const LEARNED_STREAK = 3;

export function localDay(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function plusDays(day: string, n: number): string {
  const [y, m, d] = day.split("-").map(Number);
  return localDay(new Date(y, m - 1, d + n));
}

/** The review fields of a question's stat after one answer on `day`. */
export function nextReview(
  prev: Pick<QuestionStat, "streak" | "due" | "rightDay"> | undefined,
  ok: boolean,
  confidence: Confidence | undefined,
  day: string,
): Pick<QuestionStat, "streak" | "due" | "rightDay"> {
  const streak = prev?.streak ?? 0;
  if (!ok) return { streak: 0, due: plusDays(day, 1), rightDay: prev?.rightDay };
  // Right by guessing: not evidence you know it; see it again soon.
  if (confidence === "guess") return { streak, due: plusDays(day, 1), rightDay: prev?.rightDay };
  // A second right answer on the same day doesn't count again.
  if (prev?.rightDay === day) return { streak, due: prev.due ?? plusDays(day, GAPS[0]), rightDay: day };
  const next = streak + 1;
  // Unsure: it counts, but the next gap is one step shorter.
  const step = Math.max(0, Math.min(GAPS.length - 1, next - 1 - (confidence === "unsure" ? 1 : 0)));
  return { streak: next, due: plusDays(day, GAPS[step]), rightDay: day };
}

/** Due for review today (or overdue). Questions never answered aren't "due". */
export const isDue = (s: QuestionStat | undefined, day = localDay()) => !!s?.due && s.due <= day;

/** Learned: right on enough separate days and not currently due. */
export const isLearned = (s: QuestionStat | undefined, day = localDay()) => (s?.streak ?? 0) >= LEARNED_STREAK && !isDue(s, day);

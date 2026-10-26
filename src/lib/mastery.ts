// The adaptive engine: how well you know each topic, and which questions, cards and drills to
// give you next. Mastery comes from your own answers, newest counting most, so a topic you've
// been getting right lately asks for less time and a topic you keep missing asks for more.
// Exams and lesson/module quizzes never use this; their questions stay fixed.
import type { Bank, Chosen, Course, Progress, Question } from "./types";
import { makeItems, type Session, type SessionItem } from "./session";
import { isCorrect } from "./questions";

export interface TopicMastery {
  topic: string;
  /** Estimated chance of answering a question on this topic right, 0 to 1. */
  mastery: number;
  /** Answers behind the estimate. */
  n: number;
  /** 0 (no evidence) to nearly 1 (plenty of recent answers). */
  confidence: number;
}

/** Each older answer counts this much less than the one after it. */
const DECAY = 0.85;
/** Answers kept per topic; older ones barely count anyway. */
const KEEP = 30;
/** A starting guess of 50%, worth this many answers, so two lucky answers don't read as mastery. */
const PRIOR = 1.5;
/** Mastery at or above this is "strong"; below WEAK is a focus area. */
export const STRONG = 0.8;
export const WEAK = 0.7;

/** Mastery from a topic's answers, newest first. */
export function masteryFrom(history: boolean[], extra?: { seen: number; correct: number }): { mastery: number; n: number; confidence: number } {
  let w = 1;
  let sw = 0;
  let sc = 0;
  for (const ok of history.slice(0, KEEP)) {
    sw += w;
    if (ok) sc += w;
    w *= DECAY;
  }
  let n = Math.min(history.length, KEEP);
  // Older totals (history trimmed away, or drills) count like old answers: a little each.
  if (extra && extra.seen > 0) {
    const ew = Math.min(extra.seen, 10) * 0.25;
    sw += ew;
    sc += (ew * extra.correct) / extra.seen;
    n += extra.seen;
  }
  const mastery = (sc + 0.5 * PRIOR) / (sw + PRIOR);
  return { mastery, n, confidence: 1 - Math.exp(-n / 6) };
}

/** Topic answer history (newest first) across these banks, from saved attempts. */
function histories(progress: Progress, banks: Bank[]): { hist: Map<string, boolean[]>; topicOf: Map<string, string> } {
  const topicOf = new Map<string, string>();
  for (const b of banks) for (const q of b.questions) topicOf.set(`${b.id}/${q.id}`, q.topic);
  const ids = new Set(banks.map((b) => b.id));
  const hist = new Map<string, boolean[]>();
  for (const a of progress.attempts) {
    // Attempts are newest first; answers inside one are in the order given.
    if (!ids.has(a.bankId)) continue;
    for (let i = a.answers.length - 1; i >= 0; i--) {
      const r = a.answers[i];
      const t = topicOf.get(`${a.bankId}/${r.qid}`);
      if (!t) continue;
      const h = hist.get(t) ?? [];
      if (h.length < KEEP) h.push(r.correct);
      hist.set(t, h);
    }
  }
  return { hist, topicOf };
}

/**
 * Mastery for every topic in these banks (and the course's drills, when given). Topics with no
 * attempt history fall back to the per-question totals, which outlive trimmed attempts.
 */
export function topicMastery(progress: Progress, banks: Bank[], course?: Course): Map<string, TopicMastery> {
  const { hist } = histories(progress, banks);
  const totals = new Map<string, { seen: number; correct: number }>();
  const add = (t: string, seen: number, correct: number) => {
    const x = totals.get(t) ?? { seen: 0, correct: 0 };
    totals.set(t, { seen: x.seen + seen, correct: x.correct + correct });
  };
  for (const b of banks) {
    const stats = progress.stats[b.id] ?? {};
    for (const q of b.questions) {
      const s = stats[q.id];
      if (!hist.has(q.topic)) {
        if (s) add(q.topic, s.seen, s.correct);
        else totals.set(q.topic, totals.get(q.topic) ?? { seen: 0, correct: 0 });
      }
    }
  }
  if (course)
    for (const d of course.drills) {
      if (!d.topic) continue;
      const s = progress.drills[`${course.id}/${d.id}`];
      if (s) add(d.topic, s.attempts, s.correct);
      else if (!hist.has(d.topic)) totals.set(d.topic, totals.get(d.topic) ?? { seen: 0, correct: 0 });
    }
  const out = new Map<string, TopicMastery>();
  for (const t of new Set([...hist.keys(), ...totals.keys()])) {
    out.set(t, { topic: t, ...masteryFrom(hist.get(t) ?? [], totals.get(t)) });
  }
  return out;
}

/** Course-wide mastery: every bank and drill in the course. */
export function courseMastery(course: Course, progress: Progress): Map<string, TopicMastery> {
  return topicMastery(progress, course.banks, course);
}

/**
 * How much practice a topic should get. Weak topics get the most, topics with little evidence get
 * a fair share so they're measured, and strong topics keep a small floor so they stay fresh.
 */
export function topicPriority(m: TopicMastery | undefined): number {
  if (!m) return 0.75;
  return 0.15 + (1 - m.mastery) * (0.5 + 0.5 * m.confidence) + 0.35 * (1 - m.confidence);
}

/** True when there's enough evidence to call this topic weak. */
export const isWeak = (m: TopicMastery | undefined) => !!m && m.confidence >= 0.3 && m.mastery < WEAK;

/** Weakest topics first (only those with enough evidence to say so). */
export function weakTopics(mastery: Map<string, TopicMastery>, limit = 5): TopicMastery[] {
  return [...mastery.values()]
    .filter(isWeak)
    .sort((a, b) => a.mastery - b.mastery || a.topic.localeCompare(b.topic))
    .slice(0, limit);
}

/** How much a single question is worth asking now: unseen and recently missed ones first. */
export function questionWeight(stat: { seen: number; correct: number; lastCorrect: boolean } | undefined): number {
  if (!stat || !stat.seen) return 1;
  const miss = 1 - stat.correct / stat.seen;
  return 0.25 + miss * 1.2 + (stat.lastCorrect ? 0 : 0.8);
}

function pickWeighted<T>(list: T[], weight: (x: T) => number, rand: () => number): number {
  let total = 0;
  for (const x of list) total += Math.max(0, weight(x));
  if (total <= 0) return Math.floor(rand() * list.length);
  let r = rand() * total;
  for (let i = 0; i < list.length; i++) {
    r -= Math.max(0, weight(list[i]));
    if (r <= 0) return i;
  }
  return list.length - 1;
}

/**
 * Orders a question pool for adaptive practice: each pick chooses a topic by priority (each topic's
 * share shrinks a little every time it's picked, so one weak topic doesn't take every slot), then
 * a question within it by questionWeight. Returns the whole pool in that order.
 */
export function adaptiveOrder(
  pool: Question[],
  bank: Bank,
  progress: Progress,
  mastery = topicMastery(progress, [bank]),
  rand: () => number = Math.random,
): Question[] {
  const stats = progress.stats[bank.id] ?? {};
  const byTopic = new Map<string, Question[]>();
  for (const q of pool) byTopic.set(q.topic, [...(byTopic.get(q.topic) ?? []), q]);
  const picked = new Map<string, number>();
  const out: Question[] = [];
  while (byTopic.size) {
    const topics = [...byTopic.keys()];
    const t = topics[pickWeighted(topics, (x) => topicPriority(mastery.get(x)) * 0.7 ** (picked.get(x) ?? 0), rand)];
    const qs = byTopic.get(t)!;
    const i = pickWeighted(qs, (q) => questionWeight(stats[q.id]), rand);
    out.push(qs[i]);
    qs.splice(i, 1);
    if (!qs.length) byTopic.delete(t);
    picked.set(t, (picked.get(t) ?? 0) + 1);
  }
  return out;
}

// ---------------------------------------------------------------------------
// Adapting during a practice session.

/** How many spare questions a smart session keeps for swapping in. */
export const RESERVE = 60;

export interface AdaptResult {
  items: SessionItem[];
  reserve: string[];
  /** What changed, in words, for a quiet status line. */
  note: string;
}

/**
 * After a practice answer is checked: a miss brings another question on that topic up soon (in
 * place of an upcoming question on a stronger topic); three right in a row on a strong topic swaps
 * an upcoming question on it for one on the weakest topic. The session length never changes.
 * Returns null when nothing changes.
 */
export function adaptAfterCheck(
  session: Session,
  bank: Bank,
  index: number,
  answers: Record<string, Chosen>,
  checked: Record<string, boolean>,
  prior: Map<string, TopicMastery>,
): AdaptResult | null {
  const reserveIds = session.adaptive?.reserve ?? [];
  if (!session.adaptive || !reserveIds.length) return null;
  const items = session.items;
  const cur = items[index];
  if (!cur) return null;
  const T = cur.q.topic;
  const ok = isCorrect(cur.q, answers[cur.q.id]);

  // This session's results, newest first, per topic, on top of the saved history.
  const sessionHist = new Map<string, boolean[]>();
  for (let i = items.length - 1; i >= 0; i--) {
    const it = items[i];
    if (!checked[it.q.id]) continue;
    sessionHist.set(it.q.topic, [...(sessionHist.get(it.q.topic) ?? []), isCorrect(it.q, answers[it.q.id])]);
  }
  // Session answers already in `prior` (from finished attempts) aren't double-counted: prior holds
  // only finished sessions, and this one isn't finished.
  const now = (t: string): TopicMastery => {
    const p = prior.get(t);
    const h = sessionHist.get(t) ?? [];
    if (!p) return { topic: t, ...masteryFrom(h) };
    // Treat the earlier estimate as a few older answers behind this session's.
    const pseudo = Math.round(Math.min(p.n, 8));
    const older = Array.from({ length: pseudo }, (_, i) => i < Math.round(pseudo * p.mastery));
    return { topic: t, ...masteryFrom([...h, ...older]) };
  };

  const byId = new Map(bank.questions.map((q) => [q.id, q]));
  const inSession = new Set(items.map((it) => it.q.id));
  const reserve = reserveIds.filter((id) => byId.has(id) && !inSession.has(id));
  const upcoming = (from: number) => items.map((it, i) => ({ it, i })).filter((x) => x.i >= from && !checked[x.it.q.id]);
  const shuffleChoices = session.adaptive.shuffleChoices;
  // Never swap the very next question (it may already be on screen after a quick "Next").
  const first = index + 2;

  if (!ok) {
    // One topic can't take over the session: at most 30% of it (and at least 3 questions).
    const cap = Math.max(3, Math.ceil(items.length * 0.3));
    if (items.filter((it) => it.q.topic === T).length >= cap) return null;
    const extraId = reserve.find((id) => byId.get(id)!.topic === T);
    if (!extraId) return null;
    const mT = now(T).mastery;
    // Swap out the upcoming question on the strongest other topic, if it's stronger than this one.
    const cands = upcoming(first).filter((x) => x.it.q.topic !== T);
    if (!cands.length) return null;
    const best = cands.reduce((a, b) => (now(b.it.q.topic).mastery > now(a.it.q.topic).mastery ? b : a));
    if (now(best.it.q.topic).mastery <= mT) return null;
    const next = items.slice();
    next.splice(best.i, 1);
    next.splice(Math.min(first, next.length), 0, makeItems([byId.get(extraId)!], shuffleChoices)[0]);
    return {
      items: next,
      reserve: [...reserve.filter((id) => id !== extraId), best.it.q.id],
      note: `Adding another question on ${T} soon`,
    };
  }

  const recent = sessionHist.get(T) ?? [];
  if (recent.length < 3 || !recent.slice(0, 3).every(Boolean) || now(T).mastery < STRONG) return null;
  const sameTopic = upcoming(first).find((x) => x.it.q.topic === T);
  if (!sameTopic) return null;
  // The weakest other topic that still has spare questions.
  const reserveTopics = [...new Set(reserve.map((id) => byId.get(id)!.topic))].filter((t) => t !== T);
  if (!reserveTopics.length) return null;
  const target = reserveTopics.reduce((a, b) => (topicPriority(now(b)) > topicPriority(now(a)) ? b : a));
  if (topicPriority(now(target)) <= topicPriority(now(T))) return null;
  const swapId = reserve.find((id) => byId.get(id)!.topic === target)!;
  const next = items.slice();
  next[sameTopic.i] = makeItems([byId.get(swapId)!], shuffleChoices)[0];
  return {
    items: next,
    reserve: [...reserve.filter((id) => id !== swapId), sameTopic.it.q.id],
    note: `You've got ${T} down. Switching a question to ${target}`,
  };
}

// ---------------------------------------------------------------------------
// After an exam: the topics to study next.

export interface FocusArea {
  topic: string;
  /** Right and total on this attempt. */
  correct: number;
  total: number;
  /** Overall mastery across your recent work, when there's enough of it. */
  mastery?: number;
}

/**
 * Weak topics from one attempt, judged by this attempt's score on the topic together with your
 * history on it (so one unlucky question doesn't make a focus area, and a topic you've missed for
 * weeks does). `mastery` should include the attempt itself (it's already recorded); only answers
 * beyond it count as history. Weakest first.
 */
export function focusAreas(
  byTopic: Record<string, { total: number; correct: number }>,
  mastery: Map<string, TopicMastery>,
  limit = 5,
): FocusArea[] {
  const rows = Object.entries(byTopic)
    .filter(([, t]) => t.total > 0)
    .map(([topic, t]) => {
      const m = mastery.get(topic);
      // This attempt alone, pulled toward 75% so a single miss isn't treated like a pattern.
      const here = (t.correct + 1.5) / (t.total + 2);
      const other = m ? Math.max(0, m.n - t.total) : 0;
      const conf = 1 - Math.exp(-other / 6);
      // With plenty of other history, lean on it; with little, lean on this attempt.
      const score = m ? here * (1 - 0.5 * conf) + m.mastery * 0.5 * conf : here;
      return { topic, correct: t.correct, total: t.total, mastery: m && other >= 3 ? m.mastery : undefined, score };
    })
    .filter((r) => r.score < WEAK && r.correct < r.total)
    .sort((a, b) => a.score - b.score || b.total - a.total || a.topic.localeCompare(b.topic));
  return rows.slice(0, limit).map(({ score: _s, ...r }) => r);
}

/** Orders items by priority with a little randomness (drills, new cards). */
export function weightedOrder<T>(list: T[], weight: (x: T) => number, rand: () => number = Math.random): T[] {
  const rest = list.slice();
  const out: T[] = [];
  while (rest.length) {
    const i = pickWeighted(rest, weight, rand);
    out.push(rest[i]);
    rest.splice(i, 1);
  }
  return out;
}

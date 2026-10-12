import type { Attempt, Bank, Mode, Progress, Question, Tally } from "./types";
import { sameSet, shuffle, uid } from "./util";

export interface SessionItem {
  q: Question;
  /** Display order: order[displayIndex] = original choice index. */
  order: number[];
}

export interface Session {
  id: string;
  bankId: string;
  bankTitle: string;
  mode: Mode;
  items: SessionItem[];
  startedAt: number;
  timeLimitSec?: number;
  passingPercent?: number;
}

export type PracticeFilter = "all" | "missed" | "unseen" | "weak";

export interface ExamOptions {
  count: number;
  minutes: number;
  shuffleChoices: boolean;
}

export interface PracticeOptions {
  count: number;
  topics: string[]; // empty = all
  sections: string[]; // empty = all
  filter: PracticeFilter;
  shuffleChoices: boolean;
  /** Explicit question ids (e.g. "retake missed"); overrides filters. */
  questionIds?: string[];
}

function makeItems(questions: Question[], shuffleChoices: boolean): SessionItem[] {
  return questions.map((q) => {
    const idx = q.choices.map((_, i) => i);
    return { q, order: shuffleChoices ? shuffle(idx) : idx };
  });
}

/** Draw exam questions, honoring per-section quotas when the bank sets them. */
export function drawExamQuestions(bank: Bank, count: number): Question[] {
  const n = Math.min(count, bank.questions.length);
  const quotas = bank.exam.sectionQuotas ?? {};
  const picked: Question[] = [];
  const used = new Set<string>();
  for (const [sid, want] of Object.entries(quotas)) {
    const pool = shuffle(bank.questions.filter((q) => q.section === sid));
    for (const q of pool.slice(0, Math.min(want, n - picked.length))) {
      picked.push(q);
      used.add(q.id);
    }
  }
  const rest = shuffle(bank.questions.filter((q) => !used.has(q.id)));
  picked.push(...rest.slice(0, n - picked.length));
  // Keep sections grouped in quota order (like a real two-part exam), shuffled within.
  if (Object.keys(quotas).length) {
    const rank = (q: Question) => {
      const i = Object.keys(quotas).indexOf(q.section ?? "");
      return i === -1 ? 999 : i;
    };
    return picked.sort((a, b) => rank(a) - rank(b));
  }
  return shuffle(picked);
}

export function startExam(bank: Bank, opts: ExamOptions): Session {
  return {
    id: uid("s"),
    bankId: bank.id,
    bankTitle: bank.title,
    mode: "exam",
    items: makeItems(drawExamQuestions(bank, opts.count), opts.shuffleChoices),
    startedAt: Date.now(),
    timeLimitSec: Math.round(opts.minutes * 60),
    passingPercent: bank.exam.passingPercent,
  };
}

export function practicePool(bank: Bank, progress: Progress, opts: Omit<PracticeOptions, "count">): Question[] {
  if (opts.questionIds?.length) {
    const ids = new Set(opts.questionIds);
    return bank.questions.filter((q) => ids.has(q.id));
  }
  const stats = progress.stats[bank.id] ?? {};
  return bank.questions.filter((q) => {
    if (opts.topics.length && !opts.topics.includes(q.topic)) return false;
    if (opts.sections.length && !opts.sections.includes(q.section ?? "")) return false;
    const s = stats[q.id];
    switch (opts.filter) {
      case "missed":
        return !!s && !s.lastCorrect;
      case "unseen":
        return !s;
      case "weak":
        return !!s && s.correct / s.seen < 0.7;
      default:
        return true;
    }
  });
}

export function startPractice(bank: Bank, progress: Progress, opts: PracticeOptions): Session {
  const pool = shuffle(practicePool(bank, progress, opts));
  return {
    id: uid("s"),
    bankId: bank.id,
    bankTitle: bank.title,
    mode: "practice",
    items: makeItems(pool.slice(0, Math.max(1, opts.count)), opts.shuffleChoices),
    startedAt: Date.now(),
  };
}

export function isCorrect(q: Question, chosen: number[] | undefined): boolean {
  return !!chosen && chosen.length > 0 && sameSet(q.answer, chosen);
}

/** Turn a finished session into an Attempt and fold it into progress. */
export function finishSession(
  session: Session,
  answers: Record<string, number[]>,
  flags: Record<string, boolean>,
  progress: Progress,
  bank: Bank | undefined,
): { attempt: Attempt; progress: Progress } {
  const now = new Date();
  const byTopic: Record<string, Tally> = {};
  const bySection: Record<string, Tally> = {};
  const bump = (m: Record<string, Tally>, k: string, ok: boolean) => {
    m[k] ??= { total: 0, correct: 0 };
    m[k].total++;
    if (ok) m[k].correct++;
  };
  const sectionName = (sid?: string) =>
    (sid && bank?.sections.find((s) => s.id === sid)?.name) || sid || "Unsectioned";

  // Practice sessions only count questions the user actually got to.
  const items =
    session.mode === "practice" ? session.items.filter((it) => answers[it.q.id]?.length) : session.items;

  let correct = 0;
  let answered = 0;
  const records = items.map((it) => {
    const chosen = answers[it.q.id] ?? [];
    const ok = isCorrect(it.q, chosen);
    if (chosen.length) answered++;
    if (ok) correct++;
    bump(byTopic, it.q.topic, ok);
    if (bank?.sections.length) bump(bySection, sectionName(it.q.section), ok);
    return { qid: it.q.id, chosen, correct: ok, flagged: flags[it.q.id] || undefined };
  });

  const attempt: Attempt = {
    id: session.id,
    bankId: session.bankId,
    bankTitle: session.bankTitle,
    mode: session.mode,
    startedAt: new Date(session.startedAt).toISOString(),
    finishedAt: now.toISOString(),
    durationSec: Math.round((now.getTime() - session.startedAt) / 1000),
    timeLimitSec: session.timeLimitSec,
    total: items.length,
    answered,
    correct,
    passingPercent: session.passingPercent,
    byTopic,
    bySection,
    answers: records,
  };

  const stats = { ...(progress.stats[session.bankId] ?? {}) };
  for (const r of records) {
    if (!r.chosen.length) continue; // skipped questions don't count as seen
    const s = stats[r.qid] ?? { seen: 0, correct: 0, lastCorrect: false, lastSeen: "" };
    stats[r.qid] = {
      seen: s.seen + 1,
      correct: s.correct + (r.correct ? 1 : 0),
      lastCorrect: r.correct,
      lastSeen: attempt.finishedAt,
    };
  }

  return {
    attempt,
    progress: {
      ...progress,
      attempts: [attempt, ...progress.attempts].slice(0, 500),
      stats: { ...progress.stats, [session.bankId]: stats },
    },
  };
}

export interface TopicStat {
  topic: string;
  questions: number;
  seen: number;
  attempts: number;
  correct: number;
  accuracy: number | null;
}

/** Per-topic accuracy for a bank from cumulative question stats. */
export function topicStats(bank: Bank, progress: Progress): TopicStat[] {
  const stats = progress.stats[bank.id] ?? {};
  const map = new Map<string, TopicStat>();
  for (const q of bank.questions) {
    const t = map.get(q.topic) ?? {
      topic: q.topic,
      questions: 0,
      seen: 0,
      attempts: 0,
      correct: 0,
      accuracy: null,
    };
    t.questions++;
    const s = stats[q.id];
    if (s) {
      t.seen++;
      t.attempts += s.seen;
      t.correct += s.correct;
    }
    map.set(q.topic, t);
  }
  return [...map.values()].map((t) => ({ ...t, accuracy: t.attempts ? t.correct / t.attempts : null }));
}

export function bankCoverage(bank: Bank, progress: Progress) {
  const stats = progress.stats[bank.id] ?? {};
  let seen = 0;
  let missed = 0;
  for (const q of bank.questions) {
    const s = stats[q.id];
    if (s) {
      seen++;
      if (!s.lastCorrect) missed++;
    }
  }
  return { seen, missed, total: bank.questions.length };
}

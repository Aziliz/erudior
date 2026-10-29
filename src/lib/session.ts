import nacl from 'tweetnacl';
import {learnerCanonical} from './learnerPrivacy';
import type { Attempt, Bank, Chosen, LessonRef, ModuleRef, Mode, Progress, Question, Tally } from "./types";
import { shuffle, uid } from "./util";
import { isAnswered, isCorrect, qtype } from "./questions";
import { RESERVE, adaptiveOrder, interleave } from "./mastery";
import { isDue, localDay, nextReview, type Confidence } from "./review";

export { isCorrect };

export interface SessionItem {
  q: Question;
  /** Display order: order[displayIndex] = original choice index. */
  order: number[];
}

/** A timed stretch of the session. Exams with split timers have one per section. */
export interface Block {
  name?: string;
  start: number; // first item index
  end: number; // one past the last item index
  timeLimitSec?: number;
}

export interface Session {
  /** Local anonymous recovery source guard, not authentication or grading authority.
   * Persisted by serializeRun and rechecked at every actual resume. Legacy sessions omit it. */
  anonymousRecoverySourceDigest?: string;
  intervention?: { skillId: string; baseline: number | null };
  id: string;
  bankId: string;
  bankTitle: string;
  mode: Mode;
  items: SessionItem[];
  blocks: Block[];
  startedAt: number;
  timeLimitSec?: number;
  passingPercent?: number;
  sectionPassing?: Record<string, number>;
  /** Set for an end-of-lesson quiz. */
  lesson?: LessonRef;
  /** Set for an end-of-module quiz. */
  module?: ModuleRef;
  /** A special practice session: warm-up before a lesson (not recorded), or the weekly cumulative review. */
  kind?: "pretest" | "weekly";
  /** For a warm-up: the lesson to go back to. */
  pretestLesson?: LessonRef;
  /** Questions about a section of a text in the reader: go back to the text afterwards. */
  reading?: { courseId: string; textId: string; sectionId: string };
  /** Smart practice: spare question ids the session can swap in as it adapts (lib/mastery). */
  adaptive?: { reserve: string[]; shuffleChoices: boolean };
}

/** True for lesson and module quizzes: every question is scored and there's a pass mark. */
export const isQuiz = (s: { lesson?: LessonRef; module?: ModuleRef }) => !!(s.lesson || s.module);

/** Percent needed on an end-of-lesson quiz to complete the lesson. */
export const LESSON_QUIZ_PASS = 70;

/** "smart": every matching question, weighted toward your weak topics, and adapting as you go. */
export type PracticeFilter = "smart" | "due" | "all" | "missed" | "unseen" | "weak" | "flagged";

export interface ExamOptions {
  count: number;
  minutes: number;
  shuffleChoices: boolean;
  /** Section id -> minutes. When given for every quota section, each section gets its own clock. */
  sectionMinutes?: Record<string, number>;
}

export interface PracticeOptions {
  count: number;
  topics: string[]; // empty = all
  sections: string[]; // empty = all
  filter: PracticeFilter;
  shuffleChoices: boolean;
  /** Explicit question ids (e.g. "retake missed"); overrides filters. */
  questionIds?: string[];
  /** false: leave out honors questions, except on topics picked in `topics`. Default: include. */
  honors?: boolean;
}

export function makeItems(questions: Question[], shuffleChoices: boolean): SessionItem[] {
  return questions.map((q) => {
    const idx = q.choices.map((_, i) => i);
    if (qtype(q) === "order") {
      // Always shown out of order (never already solved).
      let o = shuffle(idx);
      for (let t = 0; t < 20 && o.every((x, i) => x === i); t++) o = shuffle(idx);
      if (o.every((x, i) => x === i)) o = idx.slice().reverse();
      return { q, order: o };
    }
    return { q, order: shuffleChoices ? shuffle(idx) : idx };
  });
}

/** Draw exam questions, honoring per-section quotas when the bank sets them. */
export function drawExamQuestions(bank: Bank, count: number): Question[] {
  // Full exams cover the core course; honors questions are optional extra depth.
  const core = bank.questions.filter((q) => !q.honors);
  if (core.length && core.length < bank.questions.length) bank = { ...bank, questions: core };
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

/** One block per quota section when every drawn question belongs to a timed section. */
function examBlocks(bank: Bank, items: SessionItem[], opts: ExamOptions): Block[] {
  const quotas = Object.entries(bank.exam.sectionQuotas ?? {}).filter(([, count]) => count > 0).map(([id]) => id);
  const mins = positiveSectionMinutes(opts.sectionMinutes);
  const split =
    mins && quotas.length > 1 && quotas.every((s) => mins[s] > 0) && items.every((it) => quotas.includes(it.q.section ?? ""));
  if (!split) return [{ start: 0, end: items.length, timeLimitSec: Math.round(opts.minutes * 60) }];
  const blocks: Block[] = [];
  for (const sid of quotas) {
    const start = items.findIndex((it) => it.q.section === sid);
    if (start === -1) continue;
    let end = start;
    while (end < items.length && items[end].q.section === sid) end++;
    blocks.push({
      name: bank.sections.find((s) => s.id === sid)?.name ?? sid,
      start,
      end,
      timeLimitSec: Math.round(mins![sid] * 60),
    });
  }
  return blocks;
}

/** Empty/zero authored timing maps mean no section override, without rewriting source. */
export function positiveSectionMinutes(value?: Record<string, number>): Record<string, number> | undefined {
  const entries = Object.entries(value ?? {}).filter(([, minutes]) => Number.isFinite(minutes) && minutes > 0);
  return entries.length ? Object.fromEntries(entries) : undefined;
}

/** The bank's default exam settings, including split timers when it has them. */
export function defaultExamOptions(bank: Bank): ExamOptions {
  const split = positiveSectionMinutes(bank.exam.sectionTimeLimits);
  const minutes = split ? Object.values(split).reduce((a, b) => a + b, 0) : bank.exam.timeLimitMinutes;
  return { count: bank.exam.questionCount, minutes, shuffleChoices: true, sectionMinutes: split };
}

export function startExam(bank: Bank, opts: ExamOptions): Session {
  const items = makeItems(drawExamQuestions(bank, opts.count), opts.shuffleChoices);
  const blocks = examBlocks(bank, items, opts);
  return {
    id: uid("s"),
    bankId: bank.id,
    bankTitle: bank.title,
    mode: "exam",
    items,
    blocks,
    startedAt: Date.now(),
    timeLimitSec: blocks.reduce((s, b) => s + (b.timeLimitSec ?? 0), 0),
    passingPercent: bank.exam.passingPercent,
    sectionPassing: bank.exam.sectionPassing
      ? Object.fromEntries(
          Object.entries(bank.exam.sectionPassing).map(([sid, pct]) => [
            bank.sections.find((s) => s.id === sid)?.name ?? sid,
            pct,
          ]),
        )
      : undefined,
  };
}

/** Pass/fail for an exam attempt; undefined for practice. */
export function attemptPassed(a: Attempt): boolean | undefined {
  if (isQuiz(a) && a.passingPercent !== undefined) return (a.correct / Math.max(1, a.total)) * 100 >= a.passingPercent - 1e-9;
  if (a.mode !== "exam") return undefined;
  if (a.sectionPassing && Object.keys(a.sectionPassing).length) {
    return Object.entries(a.sectionPassing).every(([name, pct]) => {
      const t = a.bySection[name];
      return !!t && (t.correct / t.total) * 100 >= pct - 1e-9;
    });
  }
  if (a.passingPercent === undefined) return undefined;
  return (a.correct / Math.max(1, a.total)) * 100 >= a.passingPercent;
}

export function practicePool(bank: Bank, progress: Progress, opts: Omit<PracticeOptions, "count">): Question[] {
  if (opts.questionIds?.length) {
    const ids = new Set(opts.questionIds);
    return bank.questions.filter((q) => ids.has(q.id));
  }
  const stats = progress.stats[bank.id] ?? {};
  return bank.questions.filter((q) => {
    if (opts.topics.length && !opts.topics.includes(q.topic)) return false;
    if (opts.honors === false && q.honors && !opts.topics.includes(q.topic)) return false;
    if (opts.sections.length && !opts.sections.includes(q.section ?? "")) return false;
    const s = stats[q.id];
    switch (opts.filter) {
      case "missed":
        return !!s && !s.lastCorrect;
      case "unseen":
        return !s;
      case "due":
        return isDue(s);
      case "weak":
        return !!s && s.correct / s.seen < 0.7;
      case "flagged":
        return !!progress.qmeta?.[`${bank.id}/${q.id}`]?.flag;
      default:
        return true;
    }
  });
}

export function startPractice(bank: Bank, progress: Progress, opts: PracticeOptions): Session {
  const smart = opts.filter === "smart" && !opts.questionIds?.length;
  const pool = smart ? interleave(adaptiveOrder(practicePool(bank, progress, opts), bank, progress)) : shuffle(practicePool(bank, progress, opts));
  const n = Math.max(1, opts.count);
  const items = makeItems(pool.slice(0, n), opts.shuffleChoices);
  return {
    ...(smart ? { adaptive: { reserve: pool.slice(n, n + RESERVE).map((q) => q.id), shuffleChoices: opts.shuffleChoices } } : {}),
    id: uid("s"),
    bankId: bank.id,
    bankTitle: bank.title,
    mode: "practice",
    items,
    blocks: [{ start: 0, end: items.length }],
    startedAt: Date.now(),
  };
}

/** The quiz questions for a lesson that still exist in the bank, in the lesson's order. */
export function lessonQuizQuestions(bank: Bank | undefined, quiz: string[] | undefined): Question[] {
  if (!bank || !quiz?.length) return [];
  const byId = new Map(bank.questions.map((q) => [q.id, q]));
  return quiz.map((id) => byId.get(id)).filter((q): q is Question => !!q);
}

/** Correct answers needed to pass a quiz of n questions. */
export function lessonQuizNeeded(n: number): number {
  return Math.ceil((n * LESSON_QUIZ_PASS) / 100 - 1e-9);
}

/**
 * Warm-up questions before reading a lesson (pretesting: trying first helps the lesson stick,
 * even when you get them wrong). Bank questions on the lesson's topics, no honors questions.
 * Questions outside `quizIds` (the lesson's own quiz) come first, then quiz questions; unseen
 * before seen. Empty when there aren't at least two.
 */
export function pretestQuestions(bank: Bank | undefined, quizIds: Set<string>, topics: string[], progress: Progress, n = 3): Question[] {
  if (!bank || !topics.length) return [];
  const stats = progress.stats[bank.id] ?? {};
  // Code exercises take too long for a quick warm-up.
  const cands = bank.questions.filter((q) => topics.includes(q.topic) && !q.honors && qtype(q) !== "code");
  const group = (inQuiz: boolean, seen: boolean) => shuffle(cands.filter((q) => quizIds.has(q.id) === inQuiz && !!stats[q.id] === seen));
  const out = [...group(false, false), ...group(false, true), ...group(true, false), ...group(true, true)].slice(0, n);
  return out.length >= 2 ? out : [];
}

export function startPretest(bank: Bank, lesson: LessonRef, questions: Question[]): Session {
  const items = makeItems(questions, true);
  return {
    id: uid("s"),
    bankId: bank.id,
    bankTitle: bank.title,
    mode: "practice",
    kind: "pretest",
    pretestLesson: lesson,
    items,
    blocks: [{ start: 0, end: items.length }],
    startedAt: Date.now(),
  };
}

/** Reading questions after a section in the reader: practice-style, recorded like any practice. */
export function startReadingQuestions(bank: Bank, reading: NonNullable<Session["reading"]>, ids: string[]): Session {
  const items = makeItems(lessonQuizQuestions(bank, ids), true);
  return {
    id: uid("s"),
    bankId: bank.id,
    bankTitle: bank.title,
    mode: "practice",
    reading,
    items,
    blocks: [{ start: 0, end: items.length }],
    startedAt: Date.now(),
  };
}

/** An end-of-module quiz: same style as a lesson quiz, over the module's quiz list. */
export function startModuleQuiz(bank: Bank, module: ModuleRef, quiz: string[]): Session {
  return { ...startLessonQuiz(bank, undefined, quiz), module };
}

/** An end-of-lesson quiz: practice-style (answer and explanation shown), every question scored. */
export function startLessonQuiz(bank: Bank, lesson: LessonRef | undefined, quiz: string[]): Session {
  const items = makeItems(lessonQuizQuestions(bank, quiz), true);
  return {
    id: uid("s"),
    bankId: bank.id,
    bankTitle: bank.title,
    mode: "practice",
    items,
    blocks: [{ start: 0, end: items.length }],
    startedAt: Date.now(),
    passingPercent: LESSON_QUIZ_PASS,
    lesson,
  };
}

/** Turn a finished session into an Attempt and fold it into progress. */
export function finishSession(
  session: Session,
  answers: Record<string, Chosen>,
  flags: Record<string, boolean>,
  progress: Progress,
  bank: Bank | undefined,
  usedSec?: number,
  confidence: Record<string, Confidence> = {},
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

  // Practice sessions only count questions the user actually got to. Lesson quizzes
  // score every question, so skipping one can't help you pass.
  const items =
    session.mode === "practice" && !isQuiz(session)
      ? session.items.filter((it) => isAnswered(it.q, answers[it.q.id]))
      : session.items;

  let correct = 0;
  let answered = 0;
  const records = items.map((it) => {
    const chosen = answers[it.q.id] ?? [];
    const ok = isCorrect(it.q, chosen);
    const did = isAnswered(it.q, chosen);
    if (did) answered++;
    if (ok) correct++;
    bump(byTopic, it.q.topic, ok);
    if (bank?.sections.length) bump(bySection, sectionName(it.q.section), ok);
    return {
      qid: it.q.id,
      chosen: did ? chosen : [],
      correct: ok,
      flagged: flags[it.q.id] || undefined,
      ...(did && confidence[it.q.id] ? { confidence: confidence[it.q.id] } : {}),
    };
  });

  const attempt: Attempt = {
    id: session.id,
    bankId: session.bankId,
    bankTitle: session.bankTitle,
    mode: session.mode,
    startedAt: new Date(session.startedAt).toISOString(),
    finishedAt: now.toISOString(),
    durationSec: usedSec ?? Math.round((now.getTime() - session.startedAt) / 1000),
    timeLimitSec: session.timeLimitSec,
    total: items.length,
    answered,
    correct,
    passingPercent: session.passingPercent,
    sectionPassing: session.sectionPassing,
    lesson: session.lesson,
    module: session.module,
    ...(session.kind ? { kind: session.kind } : {}),
    ...(session.intervention ? { intervention: session.intervention } : {}),
    byTopic,
    bySection,
    answers: records,
  };

  // Warm-up questions before a lesson are guesses by design: they don't touch stats or history.
  if (session.kind === "pretest") return { attempt, progress };

  const stats = { ...(progress.stats[session.bankId] ?? {}) };
  const day = localDay(now);
  for (const r of records) {
    if (!r.chosen.length) continue; // skipped questions don't count as seen
    const s = stats[r.qid] ?? { seen: 0, correct: 0, lastCorrect: false, lastSeen: "" };
    stats[r.qid] = {
      seen: s.seen + 1,
      correct: s.correct + (r.correct ? 1 : 0),
      lastCorrect: r.correct,
      lastSeen: attempt.finishedAt,
      ...nextReview(s, r.correct, r.confidence, day),
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

// ---------------------------------------------------------------------------
// Saving and resuming an unfinished session

export interface RunState {
  index: number;
  answers: Record<string, Chosen>;
  flags: Record<string, boolean>;
  checked: Record<string, boolean>;
  blockIdx: number;
  /** Seconds used in each block so far. */
  blockUsed: number[];
  /** How sure the student said they were, per question (optional). */
  confidence?: Record<string, Confidence>;
}

interface SavedSession {
  version: 1;
  savedAt: string;
  session: Omit<Session, "items"> & { items: { qid: string; order: number[] }[] };
  state: RunState;
}

export function serializeRun(session: Session, state: RunState): string {
  const saved: SavedSession = {
    version: 1,
    savedAt: new Date().toISOString(),
    session: { ...session, items: session.items.map((it) => ({ qid: it.q.id, order: it.order })) },
    state,
  };
  return JSON.stringify(saved);
}

export interface Resumable {
  session: Session;
  state: RunState;
  savedAt: string;
}

/** Synchronous exact-source guard for recovered sessions. No signature/identity claim. */
export function anonymousRecoveryBankDigest(bank: Bank): string {
  return Array.from(nacl.hash(new TextEncoder().encode(learnerCanonical(bank))), byte => byte.toString(16).padStart(2, '0')).join('');
}

/** Rebuild a saved session against the current bank. Null if it can't be restored. */
export function restoreRun(text: string, banks: Bank[]): Resumable | null {
  try {
    const saved = JSON.parse(text) as SavedSession;
    if (saved.version !== 1) return null;
    const bank = banks.find((b) => b.id === saved.session.bankId);
    if (!bank) return null;
    const recoveredDigest = saved.session.anonymousRecoverySourceDigest;
    if (recoveredDigest !== undefined && (typeof recoveredDigest !== 'string' || !/^[a-f0-9]{128}$/.test(recoveredDigest)
      || banks.filter(candidate => candidate.id === bank.id).some(candidate => anonymousRecoveryBankDigest(candidate) !== recoveredDigest))) return null;
    const byId = new Map(bank.questions.map((q) => [q.id, q]));
    const items: SessionItem[] = [];
    for (const it of saved.session.items) {
      const q = byId.get(it.qid);
      // Drop questions that were deleted or whose choices changed shape since saving.
      if (!q || it.order.length !== q.choices.length) return null;
      items.push({ q, order: it.order });
    }
    return { session: { ...saved.session, items }, state: saved.state, savedAt: saved.savedAt };
  } catch {
    return null;
  }
}

export function runSummary(r: Resumable) {
  const answered = r.session.items.filter((it) => isAnswered(it.q, r.state.answers[it.q.id])).length;
  const b = r.session.blocks[r.state.blockIdx];
  const left = b?.timeLimitSec !== undefined ? b.timeLimitSec - (r.state.blockUsed[r.state.blockIdx] ?? 0) : undefined;
  return { answered, total: r.session.items.length, left, blockName: b?.name };
}

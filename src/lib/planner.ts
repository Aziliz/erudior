// Study planner: turns an exam date into today's checklist, plus streaks and
// a rough readiness estimate. All heuristics are deliberately simple and shown
// to the user as estimates.

import type { Course, DayActivity, Lesson, Plan, Progress } from "./types";
import { dueCards } from "./vocab";
import { MISSED_DECK_ID, cardKey, daysBetween, deckStatus, studyDecks, today } from "./srs";
import { coreLessons, isHonorsLesson } from "./course";

export function emptyDay(): DayActivity {
  return { questions: 0, cards: 0, lessons: 0, drills: 0 };
}

/** Return progress with today's activity counter bumped. */
export function logActivity(p: Progress, kind: keyof DayActivity, n = 1, day = today()): Progress {
  const cur = p.activity[day] ?? emptyDay();
  return { ...p, activity: { ...p.activity, [day]: { ...cur, [kind]: cur[kind] + n } } };
}

const active = (a?: DayActivity) => !!a && a.questions + a.cards + a.lessons + a.drills > 0;

/** Consecutive days with any study, ending today (or yesterday if today is still empty). */
export function streak(p: Progress, now = today()): number {
  const [y, m, d] = now.split("-").map(Number);
  let day = new Date(y, m - 1, d);
  if (!active(p.activity[today(day)])) day = new Date(y, m - 1, d - 1);
  let n = 0;
  while (active(p.activity[today(day)])) {
    n++;
    day = new Date(day.getFullYear(), day.getMonth(), day.getDate() - 1);
  }
  return n;
}

export const lessonKey = (courseId: string, lessonId: string) => `${courseId}/${lessonId}`;

export function orderedLessons(course: Course): Lesson[] {
  const order = new Map(course.modules.map((m, i) => [m.id, i]));
  return course.lessons
    .map((l, i) => ({ l, i }))
    .sort((a, b) => (order.get(a.l.module) ?? 999) - (order.get(b.l.module) ?? 999) || a.i - b.i)
    .map((x) => x.l);
}

export interface CourseNumbers {
  /** Core lessons (honors lessons are counted separately). */
  lessonsDone: number;
  lessonsTotal: number;
  honorsDone: number;
  honorsTotal: number;
  questionsSeen: number;
  questionsTotal: number;
  recentAccuracy: number | null; // last ~150 answers in this course
  recentAnswered: number;
  cardsLearned: number;
  cardsMature: number;
  cardsTotal: number;
  cardsDue: number;
  lastExamPct: number | null;
}

export function courseNumbers(course: Course, p: Progress, now = today()): CourseNumbers {
  const core = coreLessons(course);
  const lessonsDone = core.filter((l) => p.lessonsDone[lessonKey(course.id, l.id)]).length;
  const honors = course.lessons.filter((l) => isHonorsLesson(course, l));
  const honorsDone = honors.filter((l) => p.lessonsDone[lessonKey(course.id, l.id)]).length;
  let questionsSeen = 0;
  let questionsTotal = 0;
  for (const b of course.banks) {
    const st = p.stats[b.id] ?? {};
    questionsTotal += b.questions.length;
    questionsSeen += b.questions.filter((q) => st[q.id]).length;
  }
  const bankIds = new Set(course.banks.map((b) => b.id));
  const recent = p.attempts.filter((a) => bankIds.has(a.bankId));
  let ans = 0;
  let cor = 0;
  for (const a of recent) {
    if (ans >= 150) break;
    ans += a.answered;
    cor += a.answers.filter((r) => r.correct).length;
  }
  const exams = recent.filter((a) => a.mode === "exam");
  let learned = 0;
  let mature = 0;
  let total = 0;
  let due = 0;
  for (const d of studyDecks(course, p)) {
    const s = deckStatus(course, d, p, now);
    due += s.due;
    if (d.id === MISSED_DECK_ID) continue; // the missed deck grows as you study; keep it out of "learned"
    learned += s.learned;
    mature += s.mature;
    total += s.total;
  }
  return {
    lessonsDone,
    lessonsTotal: core.length,
    honorsDone,
    honorsTotal: honors.length,
    questionsSeen,
    questionsTotal,
    recentAccuracy: ans ? cor / ans : null,
    recentAnswered: ans,
    cardsLearned: learned,
    cardsMature: mature,
    cardsTotal: total,
    cardsDue: due,
    lastExamPct: exams.length ? exams[0].correct / Math.max(1, exams[0].total) : null,
  };
}

/**
 * Readiness 0-100. Mostly recent accuracy, tempered by how much of the
 * material has been covered. Null until there's enough data to say anything.
 */
export function readiness(n: CourseNumbers): { score: number; parts: { label: string; value: number; weight: number }[] } | null {
  if (n.recentAnswered < 20) return null;
  const parts = [
    { label: "Recent question accuracy", value: n.recentAccuracy ?? 0, weight: 0.5 },
    { label: "Question bank covered", value: n.questionsTotal ? n.questionsSeen / n.questionsTotal : 0, weight: 0.2 },
    { label: "Lessons completed", value: n.lessonsTotal ? n.lessonsDone / n.lessonsTotal : 1, weight: 0.15 },
    { label: "Notecards learned", value: n.cardsTotal ? n.cardsLearned / n.cardsTotal : 1, weight: 0.15 },
  ];
  const score = Math.round(parts.reduce((s, p) => s + p.value * p.weight, 0) * 100);
  return { score, parts };
}

export type TaskKind = "lesson" | "cards" | "vocab" | "practice" | "drills" | "exam";

export interface PlanTask {
  kind: TaskKind;
  title: string;
  detail: string;
  done: boolean;
  lessonIds?: string[];
  count?: number;
}

export interface DayPlan {
  daysLeft: number;
  studyDaysLeft: number;
  phase: "learn" | "review" | "exam-day" | "past";
  lessonsPerDay: number;
  tasks: PlanTask[];
}

/** Build today's checklist from the plan and current progress. */
export function planToday(course: Course, plan: Plan, p: Progress, now = today()): DayPlan {
  const daysLeft = daysBetween(now, plan.examDate);
  const todayAct = p.activity[now] ?? emptyDay();
  if (daysLeft < 0) return { daysLeft, studyDaysLeft: 0, phase: "past", lessonsPerDay: 0, tasks: [] };

  const studyDaysLeft = Math.max(1, Math.round((daysLeft * plan.daysPerWeek) / 7));
  const reviewDays = Math.min(14, Math.max(2, Math.round(studyDaysLeft * 0.25)));
  const learnDays = Math.max(1, studyDaysLeft - reviewDays);
  // Honors lessons are optional, so the plan paces the core lessons only.
  const remaining = orderedLessons(course).filter((l) => !isHonorsLesson(course, l) && !p.lessonsDone[lessonKey(course.id, l.id)]);
  const doneToday = coreLessons(course).filter((l) => p.lessonsDone[lessonKey(course.id, l.id)] === now).length;
  const lessonsPerDay = remaining.length ? Math.ceil((remaining.length + doneToday) / learnDays) : 0;
  const phase: DayPlan["phase"] = daysLeft === 0 ? "exam-day" : remaining.length ? "learn" : "review";

  const tasks: PlanTask[] = [];
  const n = courseNumbers(course, p, now);

  if (daysLeft === 0) {
    tasks.push({
      kind: "cards",
      title: "Light review only",
      detail: "Skim your quick-reference sheets and do any due cards. Rest beats cramming today.",
      done: n.cardsDue === 0,
    });
    return { daysLeft, studyDaysLeft, phase, lessonsPerDay, tasks };
  }

  const wantLessons = Math.max(0, lessonsPerDay - doneToday);
  if (remaining.length) {
    const next = remaining.slice(0, Math.max(1, wantLessons));
    tasks.push({
      kind: "lesson",
      title: wantLessons > 1 ? `Read ${wantLessons} lessons` : "Read the next lesson",
      detail: next.map((l) => l.title).join(", "),
      done: wantLessons === 0,
      lessonIds: next.map((l) => l.id),
    });
  }

  if (course.vocab?.length) {
    const due = dueCards(course, p, now).length;
    tasks.push({
      kind: "vocab",
      title: "Vocabulary reviews",
      detail: due ? `${due} due` : "All caught up",
      done: due === 0,
    });
  }

  if (n.cardsTotal) {
    const target = n.cardsDue + Math.min(plan.newCardsPerDay, n.cardsTotal - n.cardsLearned);
    tasks.push({
      kind: "cards",
      title: "Notecard review",
      detail: target
        ? `${n.cardsDue} due${n.cardsTotal - n.cardsLearned ? `, plus up to ${Math.min(plan.newCardsPerDay, n.cardsTotal - n.cardsLearned)} new` : ""}`
        : "All caught up",
      done: target === 0 || (todayAct.cards > 0 && n.cardsDue === 0),
    });
  }

  if (course.banks.some((b) => b.questions.length)) {
    const q = phase === "review" ? 40 : 20;
    tasks.push({
      kind: "practice",
      title: `Practice ${q} questions`,
      detail: phase === "review" ? "Focus on missed and weak questions" : "On topics from lessons you've read",
      done: todayAct.questions >= q,
      count: q,
    });
  }

  if (course.drills.length && (phase === "review" || new Date().getDay() % 2 === 1)) {
    tasks.push({
      kind: "drills",
      title: "Math drills",
      detail: "5 generated problems",
      done: todayAct.drills >= 5,
      count: 5,
    });
  }

  if (phase === "review" && daysLeft % 3 === 0 && daysLeft > 1) {
    tasks.push({
      kind: "exam",
      title: "Full timed practice exam",
      detail: "Simulate test conditions, then review every miss",
      done: p.attempts.some((a) => a.mode === "exam" && today(new Date(a.finishedAt)) === now && course.banks.some((b) => b.id === a.bankId)),
    });
  }

  return { daysLeft, studyDaysLeft, phase, lessonsPerDay, tasks };
}

export { cardKey };

// The adaptive engine (src/lib/mastery.ts): topic mastery, smart practice ordering, in-session
// swaps and the "what to study next" list after an exam.
import { adaptAfterCheck, adaptiveOrder, focusAreas, masteryFrom, topicMastery, topicPriority, weakTopics } from "../src/lib/mastery.ts";
import { startPractice } from "../src/lib/session.ts";
import { interleave } from "../src/lib/mastery.ts";
import { nextReview, isDue, isLearned, plusDays } from "../src/lib/review.ts";
import { spacingNudge, weeklyReview } from "../src/lib/planner.ts";
import { pretestQuestions } from "../src/lib/session.ts";

let fails = 0;
const ok = (name: string, cond: boolean, ...info: unknown[]) => {
  if (!cond) {
    fails++;
    console.log("FAIL", name, ...info);
  }
};

// A seeded random source so the sampling checks are steady.
function rng(seed: number) {
  return () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32);
}

const topics = ["Alpha", "Beta", "Gamma"];
const questions = topics.flatMap((t) =>
  Array.from({ length: 20 }, (_, i) => ({ id: `${t[0]}${i}`, topic: t, stem: "?", choices: ["a", "b"], answer: [0] })),
);
const bank: any = { id: "b", title: "Bank", questions, sections: [], exam: { questionCount: 10, timeLimitMinutes: 10 } };

function progressWith(results: Record<string, boolean[]>): any {
  // Answers spread over three finished practice attempts on separate days, oldest answers first.
  const all = Object.entries(results).flatMap(([t, rs]) => rs.map((c, i) => ({ qid: `${t[0]}${i}`, chosen: [c ? 0 : 1], correct: c })));
  const stats: any = {};
  for (const a of all) stats[a.qid] = { seen: 1, correct: a.correct ? 1 : 0, lastCorrect: a.correct, lastSeen: "2026-10-01" };
  const days = ["2026-10-03T18:00:00", "2026-10-02T18:00:00", "2026-10-01T18:00:00"];
  const attempts = days.map((d, k) => ({
    id: `a${k}`, bankId: "b", mode: "practice", finishedAt: new Date(d).toISOString(), byTopic: {}, bySection: {},
    answers: all.filter((_, i) => i % 3 === k),
  }));
  return { attempts, stats: { b: stats }, drills: {}, cards: {}, qmeta: {} };
}

// masteryFrom: recent answers count most; no evidence stays at 50% with no confidence.
const none = masteryFrom([]);
ok("no evidence", none.mastery === 0.5 && none.confidence === 0, none);
ok("all right high", masteryFrom(Array(10).fill(true)).mastery > 0.85);
ok("all wrong low", masteryFrom(Array(10).fill(false)).mastery < 0.15);
ok("recent counts more", masteryFrom([true, true, true, false, false, false]).mastery > masteryFrom([false, false, false, true, true, true]).mastery);

// Strong needs right answers on three separate days.
const oneDay = progressWith({ Alpha: Array(10).fill(true) });
oneDay.attempts = [{ ...oneDay.attempts[0], answers: oneDay.attempts.flatMap((a: any) => a.answers) }];
ok("one day caps mastery", topicMastery(oneDay, [bank]).get("Alpha")!.mastery < 0.8, topicMastery(oneDay, [bank]).get("Alpha"));
// A right guess counts half.
ok("guess counts half", masteryFrom([0.5, 0.5, 0.5, 0.5]).mastery < masteryFrom([true, true, true, true]).mastery);

// Priority: weak > unseen > strong, and strong keeps a floor.
const p = progressWith({ Alpha: Array(10).fill(true), Beta: Array(10).fill(false) });
const m = topicMastery(p, [bank]);
const pa = topicPriority(m.get("Alpha")), pb = topicPriority(m.get("Beta")), pg = topicPriority(m.get("Gamma"));
ok("weak beats strong", pb > pa * 3, pa, pb);
ok("unseen between", pg > pa && pg < pb + 0.1, pa, pg, pb);
ok("strong floor", pa >= 0.15, pa);
ok("weakTopics", weakTopics(m).map((x) => x.topic).join() === "Beta", weakTopics(m));

// adaptiveOrder: weak topic gets the most of the first 20 picks, strong topic the fewest.
let counts = { Alpha: 0, Beta: 0, Gamma: 0 } as Record<string, number>;
for (let s = 1; s <= 30; s++) for (const q of adaptiveOrder(questions as any, bank, p, m, rng(s)).slice(0, 20)) counts[q.topic]++;
ok("smart order favors weak", counts.Beta > counts.Gamma && counts.Gamma > counts.Alpha, counts);
ok("strong still asked", counts.Alpha > 0, counts);
ok("order keeps every question", adaptiveOrder(questions as any, bank, p, m).length === questions.length);

// startPractice smart: reserve holds the rest, no overlap with items.
const sess = startPractice(bank, p, { count: 10, topics: [], sections: [], filter: "smart", shuffleChoices: false });
ok("smart session", !!sess.adaptive && sess.items.length === 10 && sess.adaptive.reserve.length === 50);
ok("reserve disjoint", !sess.adaptive!.reserve.some((id) => sess.items.some((it) => it.q.id === id)));
const plain = startPractice(bank, p, { count: 10, topics: [], sections: [], filter: "all", shuffleChoices: false });
ok("plain session not adaptive", !plain.adaptive);

// adaptAfterCheck: a miss brings another question on that topic up two places later.
const byT = (t: string) => questions.filter((q) => q.topic === t);
const mk = (qs: any[]) => qs.map((q) => ({ q, order: [0, 1] }));
const s2: any = {
  id: "s", bankId: "b", bankTitle: "Bank", mode: "practice", blocks: [{ start: 0, end: 6 }], startedAt: 0,
  items: mk([byT("Beta")[10], byT("Alpha")[10], byT("Gamma")[10], byT("Alpha")[11], byT("Alpha")[12], byT("Gamma")[11]]),
  adaptive: { reserve: ["B11", "B12", "G12", "A13"], shuffleChoices: false },
};
const miss = adaptAfterCheck(s2, bank, 0, { B10: [1] }, { B10: true }, m);
ok("miss adapts", !!miss && miss.items[2].q.id === "B11" && miss.items.length === 6, miss?.items.map((i) => i.q.id));
ok("miss drops a strong-topic question", !!miss && miss.items.filter((i) => i.q.topic === "Alpha").length === 2 && miss.reserve.some((id) => id.startsWith("A")), miss?.reserve);

// Three right in a row on a strong topic swaps an upcoming one for the weakest topic.
const s3: any = {
  ...s2,
  items: mk([byT("Alpha")[10], byT("Alpha")[11], byT("Alpha")[12], byT("Gamma")[10], byT("Alpha")[13], byT("Gamma")[11]]),
  adaptive: { reserve: ["B11", "G12"], shuffleChoices: false },
};
const right = adaptAfterCheck(s3, bank, 2, { A10: [0], A11: [0], A12: [0] }, { A10: true, A11: true, A12: true }, m);
ok("streak adapts", !!right && right.items[4].q.id === "B11", right?.items.map((i) => i.q.id));
const one = adaptAfterCheck(s3, bank, 0, { A10: [0] }, { A10: true }, m);
ok("one right doesn't adapt", one === null);
ok("no adaptive field, no change", adaptAfterCheck({ ...s3, adaptive: undefined }, bank, 2, { A10: [0], A11: [0], A12: [0] }, { A10: true, A11: true, A12: true }, m) === null);

// focusAreas: the weak topics from the exam, weakest first; strong history softens one miss.
const f = focusAreas({ Alpha: { total: 5, correct: 4 }, Beta: { total: 5, correct: 1 }, Gamma: { total: 4, correct: 2 } }, m);
ok("focus weakest first", f.map((x) => x.topic).join() === "Beta,Gamma", f);
ok("focus has mastery", f[0].mastery !== undefined && f[0].mastery < 0.3, f[0]);
ok("one miss on a strong topic isn't a focus area", focusAreas({ Alpha: { total: 3, correct: 2 } }, m).length === 0);
ok("single miss ranks below a clear pattern", focusAreas({ Gamma: { total: 1, correct: 0 }, Beta: { total: 6, correct: 2 } }, m).map((x) => x.topic).join() === "Beta,Gamma");
ok("no history shown from this attempt alone", focusAreas({ Gamma: { total: 4, correct: 0 } }, new Map([["Gamma", { topic: "Gamma", ...masteryFrom([false, false, false, false]) }]]))[0].mastery === undefined);
ok("perfect topic never a focus area", focusAreas({ Beta: { total: 2, correct: 2 } }, m).length === 0);

// Spaced question reviews.
const d0 = "2026-10-01";
let r = nextReview(undefined, true, undefined, d0);
ok("first right: 1 day", r.streak === 1 && r.due === "2026-10-02", r);
ok("same day doesn't count twice", nextReview(r, true, undefined, d0).streak === 1);
r = nextReview(r, true, undefined, "2026-10-02");
ok("second right: 3 days", r.streak === 2 && r.due === "2026-10-05", r);
r = nextReview(r, true, "unsure", "2026-10-05");
ok("unsure: shorter gap", r.streak === 3 && r.due === "2026-10-08", r);
ok("learned after 3 days", isLearned({ seen: 3, correct: 3, lastCorrect: true, lastSeen: "", ...r } as any, "2026-10-06"));
ok("due on its day", isDue({ seen: 3, correct: 3, lastCorrect: true, lastSeen: "", ...r } as any, "2026-10-08"));
ok("guess doesn't advance", nextReview(r, true, "guess", "2026-10-08").streak === 3 && nextReview(r, true, "guess", "2026-10-08").due === "2026-10-09");
ok("miss resets", nextReview(r, false, "sure", "2026-10-08").streak === 0);
ok("plusDays month end", plusDays("2026-10-31", 1) === "2026-11-01");
// Interleave: no same topic twice in a row when avoidable.
const il = interleave([{ topic: "A" }, { topic: "A" }, { topic: "A" }, { topic: "B" }, { topic: "B" }, { topic: "C" }]).map((x) => x.topic).join("");
ok("interleave", !/(.)\1/.test(il.slice(0, 5)), il);

// Weekly review: needs 3 finished lessons; due again 7 days after the last one.
const course: any = {
  id: "c", banks: [bank], drills: [], decks: [], modules: [],
  lessons: topics.map((t, i) => ({ id: `l${i}`, title: t, topics: [t], body: "" })),
};
const pw: any = { ...p, lessonsDone: { "c/l0": "2026-10-01", "c/l1": "2026-10-01" }, activity: {} };
ok("weekly needs 3 lessons", !weeklyReview(course, pw, "2026-10-20").due);
pw.lessonsDone["c/l2"] = "2026-10-02";
ok("weekly due", weeklyReview(course, pw, "2026-10-20").due && weeklyReview(course, pw, "2026-10-20").topics.length === 3);
pw.attempts = [{ ...pw.attempts[0], id: "w", kind: "weekly", finishedAt: new Date("2026-10-16T12:00:00").toISOString() }, ...pw.attempts];
ok("weekly not due within 7 days", !weeklyReview(course, pw, "2026-10-20").due);
ok("weekly due after 7 days", weeklyReview(course, pw, "2026-10-23").due);
// Spacing nudge: lots of work crammed into one day.
ok("nudge when crammed", !!spacingNudge({ activity: { "2026-10-20": { questions: 120, cards: 0, lessons: 0, drills: 0 } } } as any, "2026-10-21"));
ok("no nudge when spread", spacingNudge({ activity: Object.fromEntries(["15", "17", "19", "21"].map((d) => [`2026-10-${d}`, { questions: 40, cards: 0, lessons: 0, drills: 0 }])) } as any, "2026-10-21") === null);
// Warm-up questions never come from a quiz.
const quizIds = new Set(["A0", "A1", "A2"]);
const wq = pretestQuestions(bank, quizIds, ["Alpha"], p);
ok("warm-up avoids quiz questions", wq.length === 3 && wq.every((q) => !quizIds.has(q.id) && q.topic === "Alpha"), wq.map((q) => q.id));
ok("warm-up needs 2", pretestQuestions(bank, new Set(questions.filter((q) => q.id !== "A5").map((q) => q.id)), ["Alpha"], p).length === 0);

if (fails) {
  console.log(`${fails} mastery test(s) failed`);
  process.exit(1);
}
console.log("mastery tests passed");

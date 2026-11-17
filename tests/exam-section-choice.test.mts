// Timed exam: take one section or both, with a question count per section and PSI-paced minutes.
import assert from "node:assert/strict";
import { attemptPassed, drawExamQuestions, sectionPaceMinutes, startExam } from "../src/lib/session.ts";
import type { Bank, Question } from "../src/lib/types.ts";

const qs = (sec: string, n: number): Question[] =>
  Array.from({ length: n }, (_, i) => ({ id: `${sec}${i}`, topic: "T", section: sec, stem: "?", choices: ["a", "b"], answer: [0] }) as Question);
const bank = {
  id: "b", title: "B", sections: [{ id: "nat", name: "National" }, { id: "st", name: "Colorado" }],
  questions: [...qs("nat", 100), ...qs("st", 90)],
  exam: { questionCount: 154, timeLimitMinutes: 230, passingPercent: 75, sectionQuotas: { nat: 80, st: 74 }, sectionTimeLimits: { nat: 120, st: 110 }, sectionPassing: { nat: 75, st: 71.6 } },
} as unknown as Bank;

// Pace follows the bank: 120 min / 80 national, 110 min / 74 state.
assert.equal(sectionPaceMinutes(bank, "nat", 80), 120);
assert.equal(sectionPaceMinutes(bank, "nat", 40), 60);
assert.equal(sectionPaceMinutes(bank, "st", 37), 55);

// Colorado only: 30 state questions, one clock, only the state pass mark.
const s1 = startExam(bank, { count: 30, minutes: 45, shuffleChoices: false, sectionCounts: { st: 30 }, sectionMinutes: { st: 45 } });
assert.equal(s1.items.length, 30);
assert.ok(s1.items.every((it) => it.q.section === "st"));
assert.equal(s1.blocks.length, 1);
assert.equal(s1.blocks[0].timeLimitSec, 45 * 60);
assert.equal(s1.blocks[0].name, "Colorado");
assert.deepEqual(s1.sectionPassing, { Colorado: 71.6 });
const att = (bySection: Record<string, { correct: number; total: number }>) =>
  ({ mode: "exam", correct: 0, total: 30, bySection, sectionPassing: s1.sectionPassing }) as never;
assert.equal(attemptPassed(att({ Colorado: { correct: 22, total: 30 } })), true);
assert.equal(attemptPassed(att({ Colorado: { correct: 21, total: 30 } })), false);

// Both, custom counts: two blocks in order, each on its own clock; 0 or missing sections skipped.
const s2 = startExam(bank, { count: 0, minutes: 0, shuffleChoices: false, sectionCounts: { nat: 10, st: 5 }, sectionMinutes: { nat: 15, st: 7 } });
assert.equal(s2.items.length, 15);
assert.deepEqual(s2.blocks.map((b) => [b.name, b.end - b.start, b.timeLimitSec]), [["National", 10, 900], ["Colorado", 5, 420]]);
assert.deepEqual(s2.sectionPassing, { National: 75, Colorado: 71.6 });

// More than a section holds: capped, never topped up from the other section.
assert.ok(drawExamQuestions(bank, 0, { st: 500 }).every((q) => q.section === "st"));
assert.equal(drawExamQuestions(bank, 0, { st: 500 }).length, 90);

// No choice given: the bank's quotas, as before.
const full = drawExamQuestions(bank, 154);
assert.equal(full.filter((q) => q.section === "nat").length, 80);
assert.equal(full.filter((q) => q.section === "st").length, 74);
console.log("exam section choice: ok");

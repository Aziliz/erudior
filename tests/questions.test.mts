// Question kinds: grading, answered checks, validation; honors handling. Run: npm test
import assert from "node:assert/strict";
import { answerText, blankCount, chosenText, isAnswered, isComplete, isCorrect, normText, normalizeQuestionKind, partsCorrect, textMatches } from "../src/lib/questions.ts";
import { normalizeBank } from "../src/lib/validate.ts";
import { drawExamQuestions, finishSession, practicePool, startPractice } from "../src/lib/session.ts";
import { coreLessons, isHonorsLesson, moduleCoreLessons, normalizeCourse } from "../src/lib/course.ts";
import { moduleLessonsDone } from "../src/lib/quiz.ts";
import { courseNumbers, planToday } from "../src/lib/planner.ts";
import { protectDiagrams, mermaidA11y } from "../src/lib/diagram.ts";
import { emptyProgress } from "../src/lib/storage.ts";
import type { Question } from "../src/lib/types.ts";

let n = 0;
const t = (name: string, f: () => void) => {
  try {
    f();
    n++;
  } catch (e) {
    console.error("FAIL", name);
    throw e;
  }
};

const text: Question = { id: "t", topic: "x", type: "text", stem: "DNA uses ___; RNA uses ___.", choices: [], answer: [], accept: [["thymine", "T"], ["uracil", "U"]] };
const match: Question = { id: "m", topic: "x", type: "match", stem: "Match", left: ["Ribosome", "Nucleus", "Chloroplast"], choices: ["Proteins", "DNA", "Photosynthesis", "Digestion"], answer: [0, 1, 2] };
const order: Question = { id: "o", topic: "x", type: "order", stem: "Order", choices: ["P", "M", "A", "T"], answer: [] };
const label: Question = { id: "l", topic: "x", type: "label", stem: "Label", image: { src: "data:image/svg+xml;base64,AA==", alt: "cell" }, markers: [{ x: 1, y: 2 }, { x: 3, y: 4 }], choices: ["Nucleus", "Wall", "Extra"], answer: [0, 1] };
const multi: Question = { id: "c", topic: "x", stem: "Pick", choices: ["a", "b", "c"], answer: [0, 2] };

t("text normalization", () => {
  assert.equal(normText("  The  Mitochondrion. "), "the mitochondrion");
  assert.equal(normText("“ATP”"), '"atp"');
  assert.equal(normText("X – linked"), "x-linked");
  assert.ok(textMatches("Mitochondria", ["mitochondrion", "mitochondria"]));
  assert.ok(!textMatches("mitochondrium", ["mitochondrion"]));
  assert.ok(textMatches("0.50", ["0.5"]));
  assert.ok(textMatches("1,000", ["1000"]));
  assert.ok(textMatches("1/2", ["0.5"]));
  assert.ok(textMatches(".5", ["1/2"]));
  assert.ok(textMatches("-3/4", ["-0.75"]));
  assert.ok(textMatches("x + 3", ["x+3"]));
  assert.ok(!textMatches("1/3", ["0.33"]));
  assert.ok(!textMatches("2/4x", ["0.5x"]));
  assert.ok(!textMatches("", ["x"]));
  assert.ok(!textMatches("tt", ["Tt"], true));
  assert.ok(textMatches("Tt", ["Tt"], true));
});

t("text questions", () => {
  assert.equal(blankCount(text), 2);
  assert.ok(isCorrect(text, ["Thymine", "u"]));
  assert.ok(!isCorrect(text, ["thymine", "thymine"]));
  assert.ok(isAnswered(text, ["", "x"]));
  assert.ok(!isAnswered(text, ["", " "]));
  assert.ok(!isComplete(text, ["thymine", ""]));
  assert.deepEqual(partsCorrect(text, ["T", "x"]), [true, false]);
  assert.equal(answerText(text), "thymine; uracil");
});

t("match and label", () => {
  assert.ok(isCorrect(match, [0, 1, 2]));
  assert.ok(!isCorrect(match, [0, 2, 1]));
  assert.ok(!isAnswered(match, [-1, -1, -1]));
  assert.ok(isAnswered(match, [-1, 3, -1]));
  assert.ok(!isComplete(match, [0, -1, 2]));
  assert.equal(chosenText(match, [0, 3, -1]), "Ribosome → Proteins; Nucleus → Digestion; Chloroplast → (none)");
  assert.ok(isCorrect(label, [0, 1]));
  assert.ok(!isCorrect(label, [0, 2]));
  assert.equal(answerText(label), "1: Nucleus; 2: Wall");
});

t("order", () => {
  assert.ok(isCorrect(order, [0, 1, 2, 3]));
  assert.ok(!isCorrect(order, [1, 0, 2, 3]));
  assert.deepEqual(partsCorrect(order, [1, 0, 2, 3]), [false, false, true, true]);
  assert.equal(answerText(order), "P → M → A → T");
});

t("choice and select-all", () => {
  assert.ok(isCorrect(multi, [2, 0]));
  assert.ok(!isCorrect(multi, [0]));
  assert.ok(!isCorrect(multi, []));
});

t("validation", () => {
  assert.throws(() => normalizeQuestionKind({ type: "text", stem: "a ___ b ___", accept: [["x"]] }), /2 blanks/);
  assert.throws(() => normalizeQuestionKind({ type: "label", choices: ["a", "b"], answer: [0, 1], markers: [{ x: 1, y: 1 }, { x: 2, y: 2 }] }), /image/);
  assert.throws(() => normalizeQuestionKind({ type: "match", left: ["a"], choices: ["x", "y"], answer: [0] }), /left/);
  assert.throws(() => normalizeQuestionKind({ type: "order", choices: ["a", "a"] }), /same item/);
  assert.throws(() => normalizeQuestionKind({ type: "choice", choices: ["a", "b"], answer: [0], image: { src: "x" } }), /alt/);
  assert.throws(() => normalizeQuestionKind({ type: "bogus" }), /unknown/);
  const bank = normalizeBank({ title: "B", questions: [text, match, order, label, multi, { ...multi, id: "h", honors: true }] });
  assert.equal(bank.questions[0].type, "text");
  assert.deepEqual(bank.questions[0].accept, text.accept);
  assert.deepEqual(bank.questions[1].left, match.left);
  assert.equal(bank.questions[3].markers?.length, 2);
  assert.equal(bank.questions[4].type, undefined);
  assert.equal(bank.questions[5].honors, true);
});

t("sessions grade every kind", () => {
  const bank = normalizeBank({ title: "B", questions: [text, match, order, label, multi] });
  const p = emptyProgress();
  const s = startPractice(bank, p, { count: 10, topics: [], sections: [], filter: "all", shuffleChoices: true });
  const ord = s.items.find((it) => it.q.id === "o")!;
  assert.notDeepEqual(ord.order, [0, 1, 2, 3], "order questions never start solved");
  const answers = { t: ["thymine", "U"], m: [0, 1, 3], o: [0, 1, 2, 3], l: [0, 1], c: [] };
  const { attempt, progress } = finishSession(s, answers, {}, p, bank);
  assert.equal(attempt.total, 4, "practice counts answered questions only");
  assert.equal(attempt.correct, 3);
  assert.equal(progress.stats[bank.id].m.lastCorrect, false);
  assert.equal(progress.stats[bank.id].c, undefined);
});

t("honors", () => {
  const course = normalizeCourse({
    format: "examiner-course",
    id: "hc",
    title: "H",
    modules: [{ id: "m1", title: "Core", quiz: ["q1"] }, { id: "h1", title: "Extra", honors: true, quiz: ["q3"] }],
    lessons: [
      { id: "a", module: "m1", title: "A", body: "x" },
      { id: "b", module: "m1", title: "B", body: "x", honors: true },
      { id: "c", module: "h1", title: "C", body: "x" },
    ],
    banks: [{ id: "bk", title: "Q", questions: [
      { id: "q1", topic: "A", stem: "s", choices: ["a", "b"], answer: 0 },
      { id: "q2", topic: "B", stem: "s", choices: ["a", "b"], answer: 0, honors: true },
      { id: "q3", topic: "C", stem: "s", choices: ["a", "b"], answer: 0, honors: true },
    ] }],
  });
  assert.deepEqual(coreLessons(course).map((l) => l.id), ["a"]);
  assert.ok(isHonorsLesson(course, course.lessons[2]));
  assert.deepEqual(moduleCoreLessons(course, "h1").map((l) => l.id), ["c"]);
  const p = { ...emptyProgress(), lessonsDone: { "hc/a": "2026-01-01" } };
  assert.ok(moduleLessonsDone(course, p, "m1"), "honors lesson not needed to finish the module");
  assert.ok(!moduleLessonsDone(course, p, "h1"));
  const nums = courseNumbers(course, p);
  assert.equal(nums.lessonsTotal, 1);
  assert.equal(nums.honorsTotal, 2);
  const bank = course.banks[0];
  for (let i = 0; i < 10; i++) assert.deepEqual(drawExamQuestions(bank, 3).map((q) => q.id), ["q1"]);
  assert.deepEqual(practicePool(bank, p, { topics: [], sections: [], filter: "all", honors: false }).map((q) => q.id), ["q1"]);
  assert.deepEqual(practicePool(bank, p, { topics: ["B"], sections: [], filter: "all", honors: false }).map((q) => q.id), ["q2"]);
  assert.equal(practicePool(bank, p, { topics: [], sections: [], filter: "all" }).length, 3);
  const plan = planToday(course, { examDate: "2099-01-01", daysPerWeek: 5, newCardsPerDay: 10, createdAt: "" }, p);
  assert.equal(plan.phase, "review", "the core is done; honors lessons don't keep the plan in 'learn'");
});

t("diagrams", () => {
  const src = "flowchart LR\n  accTitle: Flow\n  accDescr: A goes to B.\n  A --> B\n";
  assert.deepEqual(mermaidA11y(src), { title: "Flow", description: "A goes to B." });
  assert.equal(mermaidA11y("flowchart LR\n accDescr {\n  long\n  text\n }\n").description, "long text");
  const d = protectDiagrams("Before\n\n```mermaid\n" + src + "```\n\nAfter");
  const html = d.restore(d.text.replace(/(XDIAGX\d+XDIAGX)/, "<p>$1</p>"));
  assert.match(html, /<figure class="diagram" data-src="[^"]+"><div class="diagram-fallback"><strong>Flow<\/strong><span>A goes to B.<\/span>/);
  assert.equal(decodeURIComponent(/data-src="([^"]+)"/.exec(html)![1].replace(/&amp;/g, "&")), src);
});

console.log(`questions: ${n} groups passed`);

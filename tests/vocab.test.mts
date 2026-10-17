import { applyAnswer, checkMeaning, checkRecall, dueCards, vocabSummary } from "../src/lib/vocab.ts";
import { normalizeCourse } from "../src/lib/course.ts";
let fails = 0;
const ok = (name: string, cond: boolean, extra?: unknown) => {
  if (!cond) { fails++; console.log("FAIL", name, extra ?? ""); }
};

// Stage ladder: 5 right in a row per stage, wrong resets within the stage, Expert -> learned.
let s = { stage: 0, streak: 0 };
for (let i = 0; i < 4; i++) s = applyAnswer(s, true, `d${i}`).next;
ok("novice 4/5", s.stage === 0 && s.streak === 4);
let r = applyAnswer(s, true, "d5");
ok("up to beginner", r.event === "up" && r.next.stage === 1 && r.next.streak === 0);
s = r.next;
for (let i = 0; i < 10; i++) s = applyAnswer(s, true).next;
ok("advanced reached", s.stage === 3 && s.streak === 0, s);
s = { stage: 2, streak: 4 };
r = applyAnswer(s, false, "x");
ok("reset in stage", r.event === "reset" && r.next.stage === 2 && r.next.streak === 0 && r.next.last === "x");
s = { stage: 3, streak: 4 };
r = applyAnswer(s, true);
ok("learned", r.event === "learned" && r.next.done === true);

// Meaning checks
const hund = { id: "hund", lesson: "l1", term: "der Hund", meanings: ["dog"], pos: "noun", plural: "die Hunde" };
const gehen = { id: "gehen", lesson: "l1", term: "gehen", meanings: ["to go", "to walk"], pos: "verb" };
const bruder = { id: "b", lesson: "l1", term: "der Bruder", meanings: ["brother"], pos: "noun" };
const strasse = { id: "s", lesson: "l1", term: "die Straße", meanings: ["street"], pos: "noun", alt: ["die Strasse"] };
const mueller = { id: "m", lesson: "l1", term: "müde", meanings: ["tired"], pos: "adjective" };
ok("meaning exact", checkMeaning(hund, "Dog").ok);
ok("meaning article", checkMeaning(hund, "a dog").ok);
ok("meaning to", checkMeaning(gehen, "walk").ok && checkMeaning(gehen, "to go").ok);
ok("meaning wrong", !checkMeaning(hund, "cat").ok);
ok("meaning typo short no", !checkMeaning(hund, "dug").ok);
ok("meaning typo long", checkMeaning(bruder, "brothr").ok);
ok("meaning transposition", checkMeaning(mueller, "tierd").ok);
const empty = checkMeaning(hund, "  ");
ok("meaning empty retry", !empty.ok && (empty as any).retry === true);

// Recall checks
ok("recall exact", checkRecall(hund, "der Hund").ok);
const noArt = checkRecall(hund, "Hund");
ok("recall missing article retry", !noArt.ok && (noArt as any).retry === true);
const wrongArt = checkRecall(hund, "die Hund");
ok("recall wrong article", !wrongArt.ok && !(wrongArt as any).retry);
const caps = checkRecall(hund, "der hund");
ok("recall caps ok with note", caps.ok && !!(caps as any).note);
ok("recall alt", checkRecall(strasse, "die Strasse").ok);
const dig = checkRecall(mueller, "muede");
ok("recall digraph retry", !dig.ok && (dig as any).retry === true);
ok("recall wrong", !checkRecall(gehen, "kommen").ok);

// Course normalization, unlocking, once a day
const c = normalizeCourse({
  id: "de-a1", title: "German A1",
  language: { code: "de", name: "German", tts: "de-DE", keys: ["ä", "ö", "ü", "ß"], vocabTarget: 650 },
  modules: [{ id: "m1", title: "M" }],
  lessons: [{ id: "l1", module: "m1", title: "One", body: "" }, { id: "l2", module: "m1", title: "Two", body: "" }],
  vocab: [hund, { ...gehen, lesson: "l2" }, { id: "bad", lesson: "l1", term: "", meanings: ["x"] }],
  readingList: [{ title: "A reader", url: "javascript:alert(1)" }],
});
ok("norm vocab", c.vocab?.length === 2 && c.language?.keys?.length === 4);
ok("norm reading url dropped", c.readingList?.[0].url === undefined);
const p: any = { lessonsDone: { "de-a1/l1": "2026-10-01" }, vocab: {} };
ok("due unlocked only", dueCards(c, p, "2026-10-02").length === 2);
p.vocab["de:hund/meaning"] = { stage: 0, streak: 1, last: "2026-10-02" };
ok("once a day", dueCards(c, p, "2026-10-02").length === 1 && dueCards(c, p, "2026-10-03").length === 2);
ok("summary", vocabSummary(c, p, "2026-10-02").unlocked === 1);

console.log(fails ? `${fails} FAILURES` : "all vocab tests passed");
if (fails) process.exit(1);

// Carried-over words (A1 inside A2), shared keys and pacing.
{
  const { unlockedItems, migrateVocabKeys, vocabKey, CARRY_PER_DAY, applyAnswer } = await import("../src/lib/vocab.ts");
  const a1 = Array.from({ length: 30 }, (_, i) => ({ id: `w${i}`, lesson: i < 5 ? "a1l1" : "a1l2", term: `wort${i}`, meanings: [`word ${i}`], from: "de-a1" }));
  const c2 = normalizeCourse({
    id: "de-a2", title: "German A2", language: { code: "de", name: "German" },
    modules: [{ id: "m", title: "M" }], lessons: [{ id: "b1", module: "m", title: "B", body: "" }],
    vocab: [...a1, { id: "neu", lesson: "b1", term: "neu", meanings: ["new"] }],
  });
  ok("from kept", c2.vocab?.[0].from === "de-a1");
  ok("shared key", vocabKey(c2, "w1", "meaning") === "de:w1/meaning");
  const q: any = { lessonsDone: { "de-a1/a1l1": "2026-01-01" }, vocab: {} };
  let u = unlockedItems(c2, q, "2026-10-17");
  ok("a1 lesson words + drip", u.length === 5 + CARRY_PER_DAY, u.length);
  ok("own lesson locked", !u.some((v) => v.id === "neu"));
  // Introduce 20 today: no more room until tomorrow.
  for (const v of u.filter((v) => !["w0","w1","w2","w3","w4"].includes(v.id)))
    q.vocab[vocabKey(c2, v.id, "meaning")] = applyAnswer({ stage: 0, streak: 0 }, true, "2026-10-17").next;
  u = unlockedItems(c2, q, "2026-10-17");
  ok("drip capped per day", u.length === 25, u.length);
  u = unlockedItems(c2, q, "2026-10-18");
  ok("drip resumes next day", u.length === 30, u.length);
  const old: any = { lessonsDone: {}, vocab: { "de-a1/w1/meaning": { stage: 2, streak: 1 }, "other/x": { stage: 0, streak: 0 } } };
  const c1 = normalizeCourse({ id: "de-a1", title: "A1", language: { code: "de", name: "German" }, modules: [], lessons: [], vocab: [] });
  const m = migrateVocabKeys(old, [c1]);
  ok("migrated", m.vocab?.["de:w1/meaning"]?.stage === 2 && !m.vocab?.["de-a1/w1/meaning"] && !!m.vocab?.["other/x"]);
  ok("migrate idempotent", migrateVocabKeys(m, [c1]) === m);
}
console.log(fails ? `${fails} FAILURES` : "carry tests passed");
if (fails) process.exit(1);

{
  const { reviewBatch, vocabKey } = await import("../src/lib/vocab.ts");
  const many = Array.from({ length: 150 }, (_, i) => ({ id: `x${i}`, lesson: "l1", term: `x${i}`, meanings: [`x ${i}`] }));
  const c = normalizeCourse({ id: "cap", title: "Cap", language: { code: "xx", name: "X" }, modules: [{ id: "m", title: "M" }], lessons: [{ id: "l1", module: "m", title: "L", body: "" }], vocab: many });
  const p: any = { lessonsDone: { "cap/l1": "2026-01-01" }, vocab: { [vocabKey(c, "x149", "recall")]: { stage: 1, streak: 0, last: "2026-10-01" } } };
  const b = reviewBatch(c, p, "2026-10-17");
  ok("cap 100", b.length === 100, b.length);
  ok("in-progress first", b.some((x) => x.key === vocabKey(c, "x149", "recall")));
}
console.log(fails ? `${fails} FAILURES` : "cap tests passed");
if (fails) process.exit(1);

import assert from "node:assert/strict";
import { compareWithLessonMoves } from "../scripts/lib/lessonModuleMoves.ts";
import { emptyCourse } from "../src/lib/course.ts";
import { compareCourseRevisions } from "../src/lib/courseRevision.ts";
const original = emptyCourse("Versioned test");
original.revision = 1;
original.lessons = [{ id: "intro", module: "m1", title: "Introduction", topics: [], body: "Start" }];
const next = structuredClone(original);
next.revision = 2;
function check(label: string, pass: boolean) { if (!pass) throw new Error(label); console.log("PASS", label); }
check("safe revision", compareCourseRevisions(original, next).length === 0);
check("revision must increase", compareCourseRevisions(original, original).some((i) => i.path === "revision" && i.severity === "blocking"));
check("course ID immutable", compareCourseRevisions(original, { ...next, id: "different" }).some((i) => i.path === "id"));
check("old lesson cannot vanish", compareCourseRevisions(original, { ...next, lessons: [] }).some((i) => i.path === "lessons.intro" && i.severity === "blocking"));
check("moved lesson warns", compareCourseRevisions(original, { ...next, modules: [...next.modules, { id: "m2", title: "Second" }], lessons: [{ ...next.lessons[0], module: "m2" }] }).some((i) => i.path === "lessons.intro" && i.severity === "warning"));
check("new lesson permitted", compareCourseRevisions(original, { ...next, lessons: [...next.lessons, { id: "next", module: "m1", title: "Next", topics: [], body: "Next" }] }).length === 0);

const oldWithDrill = structuredClone(original);
oldWithDrill.drills = [{ id: "drill1", title: "Practice", vars: {}, prompt: "2+2", answer: "4", format: "number", solution: "4" }];
const newWithoutDrill = { ...oldWithDrill, revision: 2, drills: [] };
check("removed drill blocks revision", compareCourseRevisions(oldWithDrill, newWithoutDrill).some((i) => i.path === "drills.drill1" && i.severity === "blocking"));
const oldWithReader = structuredClone(original);
oldWithReader.texts = [{ id: "reader1", title: "Text", sections: [{ id: "section1", title: "Chapter", body: "Text" }] }];
const newWithoutSection = { ...oldWithReader, revision: 2, texts: [{ id: "reader1", title: "Text", sections: [] }] };
check("removed reader section blocks revision", compareCourseRevisions(oldWithReader, newWithoutSection).some((i) => i.path === "texts.reader1.sections.section1" && i.severity === "blocking"));

const withCards = structuredClone(original);
withCards.decks = [{ id: "deck1", title: "Key ideas", cards: [{ id: "card1", front: "Term", back: "Meaning" }] }];
check("removed flashcard blocks revision", compareCourseRevisions(withCards, { ...withCards, revision: 2, decks: [{ id: "deck1", title: "Key ideas", cards: [] }] }).some(i => i.path === "decks.deck1.cards.card1" && i.severity === "blocking"));
check("new flashcards permitted", compareCourseRevisions(withCards, { ...withCards, revision: 2, decks: [{ id: "deck1", title: "Key ideas", cards: [...withCards.decks[0].cards, { id: "card2", front: "New", back: "Answer" }] }] }).length === 0);
const withVocab = structuredClone(original);
withVocab.vocab = [{ id: "word1", lesson: "intro", term: "bonjour", meanings: ["hello"] }];
check("removed vocabulary ID blocks revision", compareCourseRevisions(withVocab, { ...withVocab, revision: 2, vocab: [] }).some(i => i.path === "vocab.word1" && i.severity === "blocking"));
check("reassigned vocabulary warns", compareCourseRevisions(withVocab, { ...withVocab, revision: 2, lessons: [...withVocab.lessons, { ...withVocab.lessons[0], id: "newlesson" }], vocab: [{ ...withVocab.vocab[0], lesson: "newlesson" }] }).some(i => i.path === "vocab.word1" && i.severity === "warning"));
check("vocabulary cannot reference unknown lesson", compareCourseRevisions(withVocab, { ...withVocab, revision: 2, vocab: [{ ...withVocab.vocab[0], lesson: "no-such-lesson" }] }).some(i => i.path === "vocab[0].lesson" && i.severity === "blocking"));
const carriedWord = { id: "carried", lesson: "earlier-intro", from: "earlier-course", term: "salut", meanings: ["hi"] };
check("carried vocabulary uses the earlier course lesson namespace", compareCourseRevisions(withVocab, { ...withVocab, revision: 2, vocab: [...withVocab.vocab, carriedWord] }).length === 0);
check("an explicit same-course vocabulary source still requires a local lesson", compareCourseRevisions(withVocab, { ...withVocab, revision: 2, vocab: [...withVocab.vocab, { ...carriedWord, from: withVocab.id }] }).some(i => i.path === "vocab[1].lesson" && i.severity === "blocking"));

// An explicit module relocation cannot authorize replacing a lesson, a VM scenario or another release.
const relocated = structuredClone(next);
relocated.modules.push({ id: "m2", title: "Second" });
relocated.lessons[0].module = "m2";
const fromHash = "a".repeat(64), toHash = "b".repeat(64);
const receipt = { courseId: original.id, fromRevision: 1, toRevision: 2, fromSha256: fromHash, toSha256: toHash,
  moves: [{ lesson: "intro", from: "m1", to: "m2" }] };
assert.deepEqual(compareWithLessonMoves(original, relocated, receipt, fromHash, toHash), []);
assert.equal(original.lessons[0].module, "m1");
for (const invalid of [{ ...receipt, toSha256: fromHash }, { ...receipt, fromRevision: 2 },
  { ...receipt, moves: [] }, { ...receipt, moves: [{ lesson: "intro", from: "m1", to: "another" }] }])
  assert.throws(() => compareWithLessonMoves(original, relocated, invalid, fromHash, toHash), /Lesson moves/);
const oldLab = structuredClone(original);
oldLab.lessons[0].vmLab = "linux-nfs-autofs-v1";
assert(compareWithLessonMoves(oldLab, relocated, receipt, fromHash, toHash).some(i => i.path === "lessons.intro.vmLab"));
const removed = structuredClone(original);
removed.lessons.push({ id: "retained", module: "m1", title: "Existing", topics: [], body: "Existing" });
assert(compareWithLessonMoves(removed, relocated, receipt, fromHash, toHash).some(i => i.path === "lessons.retained"));
console.log("PASS lesson relocations are bound to both release digests and preserve other compatibility checks");

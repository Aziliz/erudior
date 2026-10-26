// The built-in reader (lib/reader.ts): reading the `texts` field, footnotes, verse layout,
// the student's place and reading time, the reading log, and the authoring checks.
// Run: npx tsx tests/reader.test.mts
import { readFileSync } from "node:fs";
import { normalizeCourse } from "../src/lib/course.ts";
import {
  addReadingTime,
  footnotes,
  markSectionRead,
  normalizeTexts,
  readingKey,
  readingState,
  readingTime,
  renderVerse,
  savePlace,
  sectionsRead,
  textProblems,
  verseLines,
} from "../src/lib/reader.ts";
import { ActiveClock } from "../src/lib/timer.ts";
import { emptyRecords, logBook } from "../src/lib/records.ts";
import { streak } from "../src/lib/planner.ts";
import { emptyProgress } from "../src/lib/storage.ts";

let fails = 0;
const ok = (name: string, cond: boolean, extra?: unknown) => {
  if (!cond) {
    fails++;
    console.log("FAIL", name, extra ?? "");
  }
};

// --- Course format ----------------------------------------------------------------------
const texts = normalizeTexts([
  { id: "book", title: "Book", kind: "novel", sections: [{ id: "c1", title: "One", body: "Text." }, { id: "c1", title: "Dup", body: "More." }, { title: "Empty", body: " " }] },
  { id: "book", title: "Same id", sections: [{ id: "a", title: "A", body: "x" }] },
  { id: "nothing", title: "No sections" },
  { id: "poem", title: "Poem", kind: "poem", lang: "de-DE", lineNumbers: 0, sections: [{ id: "p", title: "P", body: "a\nb", questions: ["q1"] }] },
]);
ok("texts without sections and repeated ids are dropped", texts.map((t) => t.id).join() === "book,poem", texts.map((t) => t.id));
ok("unknown kind reads as prose", texts[0].kind === undefined);
ok("empty sections dropped, repeated section ids made unique", texts[0].sections.map((s) => s.id).join() === "c1,c1-2", texts[0].sections);
ok("poem keeps kind, lang, lineNumbers 0, questions", texts[1].kind === "poem" && texts[1].lang === "de-DE" && texts[1].lineNumbers === 0 && texts[1].sections[0].questions?.[0] === "q1");

const demo = normalizeCourse(JSON.parse(readFileSync("samples/demo-reader.json", "utf8")));
ok("demo course has four texts", demo.texts?.length === 4, demo.texts?.length);

// --- Footnotes ----------------------------------------------------------------------------
const fn = footnotes("A claim.[^b] Another.[^a] Again.[^b] Missing.[^zz]\n\n[^a]: First note,\n  continued.\n[^b]: Second note.");
ok("notes numbered in order of first reference", fn.notes.map((n) => `${n.n}:${n.id}`).join() === "1:b,2:a", fn.notes);
ok("indented lines continue a note", fn.notes[1].text === "First note, continued.", fn.notes[1]);
ok("definitions removed from the text", !fn.text.includes("[^a]:") && !fn.text.includes("Second note"), fn.text);
ok("references become note buttons", (fn.text.match(/class="fn-ref"/g) ?? []).length === 3 && fn.text.includes('aria-label="Note 1"'));
ok("an undefined reference stays as written", fn.text.includes("[^zz]"));
ok("no footnotes: text unchanged", footnotes("plain [text]").text === "plain [text]");

// --- Verse --------------------------------------------------------------------------------
const lines = verseLines("# Act I\n\n*Enter A.*\nHAMLET.\nTo be, or not to be,\n  that is the question.\n\n\nSecond stanza\n\n", "play");
ok(
  "play: heading, stage, speaker, numbered lines",
  lines.map((l) => l.kind + (l.n ?? "")).join() === "heading,gap,stage,speaker,line1,line2,gap,line3",
  lines.map((l) => l.kind + (l.n ?? "")),
);
ok("leading spaces kept as indentation", lines[5].text.startsWith("  that"));
ok("a capitalized line is plain text in a poem", verseLines("HAMLET.", "poem")[0].kind === "line");
const html = renderVerse(verseLines("one\ntwo\nthree\nfour\nfive\nsix", "poem"), 5, (s) => s);
ok("every 5th line numbered, hidden from screen readers", (html.match(/class="ln"/g) ?? []).length === 1 && html.includes('<span class="ln" aria-hidden="true">5</span>'), html);
ok("every block indexed", (html.match(/data-b="/g) ?? []).length === 6 && html.includes('data-b="5"'));
ok("lineNumbers 0: no numbers", !renderVerse(verseLines("a\nb\nc\nd\ne", "poem"), 0, (s) => s).includes('class="ln"'));

// --- Place, time, finishing ---------------------------------------------------------------
const book = demo.texts![0];
let p = emptyProgress();
ok("new text starts at its first section", readingState(p, demo.id, book).section === "ch1");
p = savePlace(p, demo.id, book, "ch2", 7, "2026-10-01");
ok("place saved", readingState(p, demo.id, book).section === "ch2" && readingState(p, demo.id, book).at === 7);
ok("saving the same place again changes nothing", savePlace(p, demo.id, book, "ch2", 7, "2026-10-01") === p);
p = addReadingTime(p, demo.id, book, 125.4, "2026-10-01");
p = addReadingTime(p, demo.id, book, 0.4, "2026-10-01");
ok("reading time adds up (whole seconds)", readingState(p, demo.id, book).seconds === 125, readingState(p, demo.id, book));
ok("reading time goes into the day's activity", p.activity["2026-10-01"]?.readingSec === 125, p.activity);
ok("a day with a minute of reading counts for the streak", streak(p, "2026-10-01") === 1);
p = markSectionRead(p, demo.id, book, "ch1", "2026-10-01");
p = markSectionRead(p, demo.id, book, "ch3", "2026-10-02");
ok("not finished until every section is read", !readingState(p, demo.id, book).finished && sectionsRead(p, demo.id, book) === 2);
p = markSectionRead(p, demo.id, book, "ch2", "2026-10-03");
ok("finished the day the last section is read", readingState(p, demo.id, book).finished === "2026-10-03");
p = markSectionRead(p, demo.id, book, "ch2", "2026-10-09");
ok("reading again keeps the first dates", readingState(p, demo.id, book).read.ch2 === "2026-10-03" && readingState(p, demo.id, book).finished === "2026-10-03");
ok("progress key", Object.keys(p.reading ?? {})[0] === readingKey(demo.id, book.id));
ok("time wording", readingTime(30) === "less than a minute" && readingTime(720) === "12 min" && readingTime(3900) === "1 h 5 min" && readingTime(7200) === "2 h");

// --- Active time (shared with the homeschool timer) ----------------------------------------
const clock = new ActiveClock(0, 4 * 60_000);
clock.tick(5_000, true);
clock.tick(10_000, false);
ok("hidden window doesn't count", clock.take() === 5, clock);
clock.tick(4 * 60_000 + 5_000, true);
ok("idle after four minutes stops counting", !clock.counting(4 * 60_000 + 5_000, true));
clock.input(4 * 60_000 + 6_000);
clock.tick(4 * 60_000 + 11_000, true);
ok("input starts it again (from the last tick)", clock.take() === 6);

// --- Reading log --------------------------------------------------------------------------
let r = logBook(emptyRecords(), { date: "2026-10-03", title: "Book", author: "A", subject: "English language arts", note: "", minutes: 40, textKey: "c/t" });
r = { ...r, reading: r.reading.map((b) => ({ ...b, subject: "Reading", note: "Parent's note" })) };
r = logBook(r, { date: "2026-10-09", title: "Book", author: "A", subject: "English language arts", note: "", minutes: 55, textKey: "c/t" });
ok("finishing again updates the minutes, not a second entry", r.reading.length === 1 && r.reading[0].minutes === 55, r.reading);
ok("the parent's edits are kept", r.reading[0].subject === "Reading" && r.reading[0].note === "Parent's note" && r.reading[0].date === "2026-10-03");
ok("same minutes: records unchanged", logBook(r, { ...r.reading[0], minutes: 55 }) === r);

// --- Authoring checks ---------------------------------------------------------------------
const raw = [
  { id: "t", title: "T", kind: "novel", sections: [{ id: "a", title: "A", body: "x[^1] y[^2]\n\n[^1]: one\n[^3]: three", questions: ["q-1", "nope"] }, { id: "a", title: "", body: "" }] },
  { title: "No id", sections: [] },
];
const probs = textProblems(normalizeTexts(raw), new Set(["q-1"]), raw);
const has = (s: string) => probs.some((p) => p.includes(s));
ok("unknown kind reported", has('unknown kind "novel"'), probs);
ok("repeated section id reported", has('section id "a" is used twice'), probs);
ok("empty section reported", has("is empty"), probs);
ok("missing section title reported", has('needs a "title"'), probs);
ok("missing text id reported", has('needs an "id"'), probs);
ok("no sections reported", has("has no sections"), probs);
ok("missing reading question reported", has("reading question nope missing") && !has("question q-1 missing"), probs);
ok("footnote without a note reported", has("footnote [^2] has no"), probs);
ok("note never used reported", has("footnote 3 is never referred to"), probs);
ok("the demo course has no problems", textProblems(demo.texts!, new Set(demo.banks[0].questions.map((q) => q.id)), JSON.parse(readFileSync("samples/demo-reader.json", "utf8")).texts).length === 0);

if (fails) {
  console.log(`${fails} reader test(s) failed`);
  process.exit(1);
}
console.log("reader tests passed");

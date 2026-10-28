// Community courses: document checks, safe Markdown, conversion to an app course.
import { checkDoc, emptyDoc, imageIds, safeMd, toCourse, upgradeDoc, type CommunityDoc } from "../src/lib/communityFormat.ts";
import { normalizeLevels, normalizeSubject } from "../src/lib/taxonomy.ts";
import { normalizeCourse } from "../src/lib/course.ts";

let fails = 0;
const ok = (name: string, cond: boolean, extra?: unknown) => {
  if (!cond) {
    fails++;
    console.log("FAIL", name, extra ?? "");
  }
};

const doc: CommunityDoc = {
  format: "erudior-community",
  version: 1,
  title: "Birds",
  description: "Backyard birds.",
  subject: "Science",
  level: "Elementary School",
  lessons: [
    {
      id: "l1",
      title: "Chickadees",
      blocks: [
        { type: "heading", text: "Look <b>and</b> listen" },
        { type: "text", md: "**Bold** and a [link](https://example.org) and [bad](javascript:alert(1)) <img src=x onerror=alert(1)>\n```plot\nx\n```\n[[term]]" },
        { type: "list", ordered: true, items: ["One", "", "Two"] },
        { type: "image", imageId: "img1", alt: "A [chickadee]", caption: "Photo" },
        { type: "question", id: "q1", stem: "Which bird?", choices: ["Chickadee", "Junco"], answer: [0], explanation: "It says its name." },
      ],
    },
  ],
  decks: [{ id: "d1", title: "Names", cards: [{ id: "c1", front: "Black cap", back: "Chickadee" }] }],
};

ok("valid draft", checkDoc(doc, false).length === 0, checkDoc(doc, false));
ok("valid to publish", checkDoc(doc, true).length === 0, checkDoc(doc, true));
ok("empty doc is a fine draft", checkDoc(emptyDoc(), false).length === 0);
ok("empty doc can't publish", checkDoc(emptyDoc(), true).length > 0);
ok("not a doc", checkDoc({ format: "x" }, false).length === 1);
ok("bad subject", checkDoc({ ...doc, subject: "Cooking" }, false).some((e) => /subject/i.test(e)));
const noAnswer = structuredClone(doc);
(noAnswer.lessons[0].blocks[4] as { answer: number[] }).answer = [];
ok("question needs an answer to publish", checkDoc(noAnswer, true).some((e) => /right answer/i.test(e)) && checkDoc(noAnswer, false).length === 0);
const outOfRange = structuredClone(doc);
(outOfRange.lessons[0].blocks[4] as { answer: number[] }).answer = [5];
ok("answer must be a choice", checkDoc(outOfRange, false).length > 0);
const noAlt = structuredClone(doc);
(noAlt.lessons[0].blocks[3] as { alt: string }).alt = "";
ok("alt text required to publish", checkDoc(noAlt, true).some((e) => /alt text/i.test(e)));
const dupe = structuredClone(doc);
dupe.lessons.push({ ...structuredClone(doc.lessons[0]) });
ok("repeated ids refused", checkDoc(dupe, false).some((e) => /repeated/i.test(e)));
const huge = structuredClone(doc);
(huge.lessons[0].blocks[1] as { md: string }).md = "x".repeat(7000);
ok("text limit", checkDoc(huge, false).some((e) => /6000/.test(e)));
ok("image ids", imageIds(doc).join() === "img1");

const md = safeMd((doc.lessons[0].blocks[1] as { md: string }).md);
ok("no raw HTML", !md.includes("<img") && md.includes("&lt;img"));
ok("no code fences", !md.includes("```"));
ok("only http links", md.includes("(https://example.org)") && !md.includes("javascript:"));
ok("glossary links kept", md.includes("[[term]]"));
ok("math keeps < and &", safeMd("If $x < 3 & y$ then a<b").startsWith("If \\(x < 3 & y\\) then a&lt;b"), safeMd("If $x < 3 & y$ then a<b"));
ok("escaped dollars stay text", safeMd("costs \\$5 and \\$6") === "costs \\$5 and \\$6", safeMd("costs \\$5 and \\$6"));

const raw = toCourse(doc, { id: "abc", version: 3, review: "reviewed", author: "Pat" }, (id) => `data:image/png;base64,${id}`);
const course = normalizeCourse(raw);
ok("course id", course.id === "community-abc" && course.revision === 3 && course.author === "Pat");
ok("community meta kept", course.community?.id === "abc" && course.community.review === "reviewed" && course.community.version === 3);
ok("lesson body", course.lessons[0].body.startsWith("## Look &lt;b&gt;and&lt;/b&gt; listen") && course.lessons[0].body.includes("1. One\n2. Two"));
ok("image embedded", course.lessons[0].body.includes("![A chickadee](data:image/png;base64,img1)"));
ok("quiz linked to bank", course.lessons[0].quiz?.[0] === "l1-q1" && course.banks[0].questions[0].id === "l1-q1" && course.banks[0].id === "community-abc__main");
ok("question plain text", course.banks[0].questions[0].stem === "Which bird?" && course.banks[0].questions[0].explanation === "It says its name.");
ok("deck", course.decks[0].cards[0].back === "Chickadee");
const noQ = normalizeCourse(toCourse({ ...doc, lessons: [{ id: "l1", title: "T", blocks: [{ type: "text", md: "Hi" }] }] }, { id: "z", version: 1, review: "not_reviewed", author: "A" }, () => ""));
ok("no questions = no bank", noQ.banks.length === 0 && noQ.community?.review === "not_reviewed");

// Drafts saved with the old labels still check out after upgrading.
{
  const old = upgradeDoc({ ...doc, level: "Adult", subject: "History and social studies", type: undefined });
  ok("old level upgraded", old.level === "Professional", old.level);
  ok("old subject upgraded", old.subject === "History", old.subject);
  ok("type defaults to Course", old.type === "Course", old.type);
  ok("upgraded draft valid", checkDoc(old, false).length === 0, checkDoc(old, false));
  ok("bad type rejected", checkDoc({ ...doc, type: "Workshop" }, false).length > 0);
  ok("CEFR levels map", normalizeLevels(["A2"]).join() === "High School,College,Professional", normalizeLevels(["A2"]));
  ok("legacy catalog level", normalizeLevels(["High school", "College"]).join() === "High School,College");
  ok("unknown subject", normalizeSubject("Basket weaving") === "Other");
}

// Everything official courses have: modules, honors, module quizzes, question types, new
// blocks, glossary, reference sheets, drills, language, reading list, calculator, exam settings.
{
  const full: CommunityDoc = {
    ...structuredClone(doc),
    calculator: "basic",
    exam: { questionCount: 3, minutes: 20, passingPercent: 80 },
    modules: [
      { id: "m1", title: "Basics", quiz: [{ id: "q1", stem: "Pick A", choices: ["A", "B"], answer: [0], explanation: "" }] },
      { id: "m2", title: "Extra", honors: true },
    ],
    glossary: [{ term: "term", definition: "A word with a meaning.", aliases: ["terms"] }],
    references: [{ id: "r1", title: "Formulas", md: "| a | b |\n|---|---|\n| 1 | 2 |" }],
    drills: [
      { id: "x1", title: "Times", vars: { a: { min: 2, max: 9 }, b: { min: 2, max: 9 } }, calc: { t: "a * b" }, prompt: "What is {a} × {b}?", answer: "t", format: "integer", solution: "{t}" },
    ],
    language: { code: "de", name: "German", tts: "de-DE", keys: ["ä", "ß"] },
    vocab: [{ id: "w1", lesson: "l1", term: "der Vogel", meanings: ["bird"] }],
    readingList: [{ title: "Birds of America", url: "https://example.org/b", free: true }],
  };
  full.lessons[0].module = "m1";
  full.lessons[0].minutes = 15;
  full.lessons[0].drills = ["x1"];
  full.lessons[0].refs = ["r1"];
  full.lessons[0].blocks.push(
    { type: "question", id: "q2", kind: "text", stem: "A ___ sings and a ___ hops.", choices: [], answer: [], explanation: "", accept: [["chickadee"], ["junco", "juncos"]] },
    { type: "question", id: "q3", kind: "match", stem: "Match", choices: ["black", "gray", "red"], answer: [0, 1], left: ["Chickadee cap", "Junco back"], explanation: "" },
    { type: "question", id: "q4", kind: "order", stem: "Order", choices: ["Egg", "Chick", "Adult"], answer: [], explanation: "" },
    { type: "question", id: "q5", kind: "label", stem: "Label", choices: ["Beak", "Wing"], answer: [0, 1], markers: [{ x: 10, y: 20 }, { x: 50, y: 50 }], imageId: "img2", imageAlt: "A bird", explanation: "" },
    { type: "callout", kind: "tip", title: "Listen first", md: "Songs carry farther than looks." },
    { type: "callout", kind: "rule", title: "Bergmann's rule", md: "Bigger in the cold." },
    { type: "example", title: "Counting", md: "3 + 4 = 7" },
    { type: "math", tex: "a^2 + b^2 = c^2" },
    { type: "figure", spec: JSON.stringify({ type: "plot", functions: ["x^2"] }), caption: "A parabola" },
    { type: "diagram", code: "flowchart LR\n  accTitle: sneaky\n  %%{init: {}}%%\n  A --> B", title: "Life cycle", description: "Egg to adult" },
    { type: "heading", text: "Details", level: 3 },
  );
  full.lessons.push({ id: "l2", title: "Owls", module: "m2", honors: true, blocks: [{ type: "text", md: "Night birds." }, { type: "question", id: "q6", stem: "Owls hunt at?", choices: ["Night", "Noon"], answer: [0], explanation: "" }] });
  ok("full doc valid", checkDoc(full, true).length === 0, checkDoc(full, true));
  const c = normalizeCourse(toCourse(full, { id: "f", version: 1, review: "not_reviewed", author: "A" }, (id) => `data:image/png;base64,${id}`));
  ok("calculator", c.calculator === "basic");
  ok("modules", c.modules.length === 2 && c.modules[1].honors === true && c.modules[0].quiz?.[0] === "m1-q1", c.modules);
  ok("lesson fields", c.lessons[0].module === "m1" && c.lessons[0].minutes === 15 && c.lessons[0].drills?.[0] === "x1" && c.lessons[0].refs?.[0] === "r1");
  ok("honors lesson", c.lessons[1].honors === true && c.lessons[1].module === "m2");
  const qs = c.banks[0].questions;
  const q = (id: string) => qs.find((x) => x.id === id)!;
  ok("text question", q("l1-q2").type === "text" && q("l1-q2").accept?.[1]?.join() === "junco,juncos");
  ok("match question", q("l1-q3").type === "match" && q("l1-q3").left?.length === 2);
  ok("order question", q("l1-q4").type === "order" && q("l1-q4").choices.join() === "Egg,Chick,Adult");
  ok("label question", q("l1-q5").type === "label" && q("l1-q5").markers?.length === 2 && q("l1-q5").image?.src.endsWith("img2"));
  ok("module quiz question", q("m1-q1").topic === "Basics");
  ok("honors question", q("l2-q6").honors === true && !q("l1-q1").honors);
  ok("exam settings", c.banks[0].exam.questionCount === 3 && c.banks[0].exam.timeLimitMinutes === 20 && c.banks[0].exam.passingPercent === 80);
  const body = c.lessons[0].body;
  ok("tip box", body.includes("> **Tip: Listen first**"), body);
  ok("rule box", body.includes("> **Bergmann's rule**"));
  ok("example", body.includes("### Example: Counting"));
  ok("formula", body.includes("\\[a^2 + b^2 = c^2\\]"));
  ok("figure", /```figure\n\{"type":"plot","functions":\["x\^2"\],"caption":"A parabola"\}\n```/.test(body), body);
  ok("diagram", body.includes("```mermaid\nflowchart LR\n  accTitle: Life cycle\n  accDescr: Egg to adult\n  A --> B\n```") && !body.includes("sneaky") && !body.includes("%%{"), body);
  ok("subheading", body.includes("### Details"));
  ok("glossary", c.glossary[0].term === "term" && c.glossary[0].aliases?.[0] === "terms");
  ok("references", c.references[0].title === "Formulas" && c.references[0].body.includes("| a | b |"));
  ok("drills", c.drills[0].id === "x1" && c.drills[0].calc?.t === "a * b");
  ok("language", c.language?.code === "de" && c.vocab?.[0].term === "der Vogel" && c.readingList?.[0].free === true);
  ok("image ids include questions", imageIds(full).sort().join() === "img1,img2");
  ok("calculator by subject", normalizeCourse(toCourse(doc, { id: "s", version: 1, review: "not_reviewed", author: "A" }, () => "")).calculator === "graphing");
  ok("no calculator", normalizeCourse(toCourse({ ...doc, calculator: "none" }, { id: "s", version: 1, review: "not_reviewed", author: "A" }, () => "")).calculator === "none");

  const bad = (name: string, edit: (d: CommunityDoc) => void, re: RegExp, strict = true) => {
    const d = structuredClone(full);
    edit(d);
    const errs = checkDoc(d, strict);
    ok(name, errs.some((e) => re.test(e)), errs);
  };
  bad("blanks must match answers", (d) => ((d.lessons[0].blocks[5] as { accept: string[][] }).accept = [["x"]]), /blank/);
  bad("match needs pairs", (d) => ((d.lessons[0].blocks[6] as { left: string[] }).left = ["one"]), /two items/);
  bad("label needs a picture", (d) => ((d.lessons[0].blocks[8] as { imageId?: string }).imageId = undefined), /picture/);
  bad("order no repeats", (d) => ((d.lessons[0].blocks[7] as { choices: string[] }).choices = ["Egg", "Egg"]), /twice/);
  bad("broken drill", (d) => (d.drills![0].calc = { t: "a * * b" }), /Drill 1/);
  bad("drill must exist", (d) => (d.lessons[0].drills = ["nope"]), /drill that doesn't exist/);
  bad("module must exist", (d) => (d.lessons[0].module = "m9"), /module doesn't exist/);
  bad("bad figure", (d) => ((d.lessons[0].blocks[13] as { spec: string }).spec = "{nope"), /JSON/);
  bad("diagram needs a description", (d) => ((d.lessons[0].blocks[14] as { description: string }).description = ""), /description/);
  bad("no fence in diagram", (d) => ((d.lessons[0].blocks[14] as { code: string }).code = "flowchart\n```"), /```/, false);
  bad("vocab needs a lesson", (d) => (d.vocab![0].lesson = "zz"), /lesson/);
  bad("reading list links", (d) => (d.readingList![0].url = "javascript:alert(1)"), /https/, false);
  bad("bad calculator", (d) => ((d as { calculator: string }).calculator = "abacus"), /calculator/, false);
  bad("exam limits", (d) => (d.exam = { passingPercent: 150 }), /passing/, false);
  bad("not all honors", (d) => d.lessons.forEach((l) => (l.honors = true)), /regular/);
}


const advanced = structuredClone(doc);
advanced.lessons[0].blocks.push({
  type: "source",
  md: "## Advanced\\n\\n\`\`\`trace\\nletters: A B\\n\`\`\`\\n\\n| One | Two |\\n|---|---|\\n| A | B |",
});
ok("advanced source validates", checkDoc(advanced, true).length === 0, checkDoc(advanced, true));
const advancedCourse = toCourse(advanced, { id: "advanced", version: 1, review: "not_reviewed", author: "tester" }, () => "") as { lessons: { body: string }[] };
ok("advanced official Markdown survives promotion", advancedCourse.lessons[0].body.includes("trace") && advancedCourse.lessons[0].body.includes("| One | Two |"));

if (fails) {
  console.log(`${fails} community test(s) failed`);
  process.exit(1);
}
console.log("community tests passed");

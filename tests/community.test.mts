// Community courses: document checks, safe Markdown, conversion to an app course.
import { checkDoc, emptyDoc, imageIds, safeMd, toCourse, type CommunityDoc } from "../src/lib/communityFormat.ts";
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
  level: "Elementary",
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
ok("no glossary syntax", !md.includes("[[term]]"));

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

if (fails) {
  console.log(`${fails} community test(s) failed`);
  process.exit(1);
}
console.log("community tests passed");

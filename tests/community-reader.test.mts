import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { checkDoc, toCourse, communityReaderQuestions, communityWorkRevisionProblems, type CommunityDoc } from "../src/lib/communityFormat.ts";
import { normalizeCourse, exportCourseSnapshot } from "../src/lib/course.ts";
import { importValidatedCourseSnapshot } from "../src/lib/courseIntegrity.ts";
import { downloadCommunityCourse } from "../src/lib/community.ts";
const texts = JSON.parse(readFileSync(new URL("./fixtures/community-reader.json", import.meta.url), "utf8"));
const question = { stem: "What was observed?", choices: ["A bird", "A fish"], answer: [0], explanation: "The text names a bird." };
const doc: CommunityDoc = { format: "erudior-community", version: 1, title: "Read observations", description: "Read and reflect.", subject: "Reading and literature", level: "Middle School", modules: [{ id: "m1", title: "Reading", quiz: [{ ...question, id: "mq1" }] }], lessons: [{ id: "l1", module: "m1", title: "Observe", blocks: [{ type: "text", md: "Read the library text." }, { ...question, type: "question", id: "q1" }] }], decks: [], texts };
assert.deepEqual(checkDoc(doc, true), []);
assert.deepEqual(communityReaderQuestions(doc).map(q => q.id), ["l1-q1", "m1-mq1"]);
const meta = { id: "reading", version: 3, review: "not_reviewed" as const, author: "Author" };
const converted = toCourse(doc, meta, () => "unused");
assert.deepEqual(converted.texts, texts);
assert.deepEqual((converted.banks as any[])[0].questions.map(q => q.id), ["l1-q1", "m1-mq1"]);
(converted.texts as any[])[0].sections[0].body = "Local edit";
assert.equal(doc.texts![0].sections[0].body, texts[0].sections[0].body);
for (const change of [
  null,
  [{ ...texts[0], sections: [{ ...texts[0].sections[0], questions: ["q1"] }] }],
  [{ ...texts[0], sections: [{ ...texts[0].sections[0], questions: ["l2-q1"] }] }],
  [{ ...texts[0], lang: 5 }],
  [{ ...texts[0], sections: [...texts[0].sections, texts[0].sections[0]] }],
  [{ ...texts[0], source: { script: "no" } }],
]) {
  assert(checkDoc({ ...doc, texts: change } as never, false).length);
  assert.throws(() => toCourse({ ...doc, texts: change } as never, meta, () => ""));
}
const collision = { ...doc, lessons: [{ ...doc.lessons[0], id: "a-b", blocks: [{ type: "question", id: "c", ...question }] }, { ...doc.lessons[0], id: "a", blocks: [{ type: "question", id: "b-c", ...question }] }], texts: [{ ...texts[0], sections: [{ ...texts[0].sections[0], questions: ["a-b-c"] }] }] };
assert(checkDoc(collision as CommunityDoc, true).some(e => /ambiguous/.test(e)));
for (const nextTexts of [[], [{ ...texts[0], sections: [texts[0].sections[0]] }], [{ ...texts[0], sections: [{ ...texts[0].sections[0], questions: [] }, texts[0].sections[1]] }]])
  assert(communityWorkRevisionProblems(doc, { ...doc, texts: nextTexts }).length);
assert.deepEqual(communityWorkRevisionProblems(doc, { ...doc, texts: [{ ...texts[0], title: "Clarified title" }] }), []);
const savedFetch = globalThis.fetch;
try {
  globalThis.fetch = async () => Response.json({ ...meta, doc });
  const installed = normalizeCourse(await downloadCommunityCourse(meta.id));
  assert.deepEqual(installed.texts, texts);
  assert.deepEqual(importValidatedCourseSnapshot(exportCourseSnapshot(installed)).texts, texts);
  assert.equal(installed.community?.review, "not_reviewed");
} finally { globalThis.fetch = savedFetch; }
console.log("community reader: full-field install/export preservation, exact first-bank question links, malformed bounds and publication identity guards passed");

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { checkDoc, toCourse, communityWorkRevisionProblems, type CommunityDoc } from "../src/lib/communityFormat.ts";
import { downloadCommunityCourse } from "../src/lib/community.ts";
import { normalizeCourse, exportCourseSnapshot } from "../src/lib/course.ts";
import { importValidatedCourseSnapshot } from "../src/lib/courseIntegrity.ts";
const work = JSON.parse(readFileSync(new URL("./fixtures/community-assessed-work.json", import.meta.url), "utf8"));
const links = [{ type: "assignment", kind: "writing", id: "bird-report" }, { type: "assignment", kind: "lab", id: "bird-observation" }, { type: "assignment", kind: "log" }];
const doc = { ...work, format: "erudior-community", version: 1, title: "Observation course", description: "Practice evidence-based explanations.", subject: "Science", level: "Elementary School", lessons: [{ id: "l1", title: "Observe and explain", blocks: [{ type: "text", md: "Keep **rich content** unchanged." }, ...links] }], decks: [] } as CommunityDoc;
assert.deepEqual(checkDoc(doc, true), []);
const longId = "writing-" + "x".repeat(80);
assert.deepEqual(checkDoc({ ...doc, writing: [{ ...work.writing[0], id: longId }], lessons: [{ ...doc.lessons[0], blocks: [{ type: "assignment", kind: "writing", id: longId }] }] }, true), [], "canonical stable IDs are not truncated to legacy community IDs");
const original = structuredClone(doc);
const course = toCourse(doc, { id: "observations", version: 7, review: "not_reviewed", author: "Author" }, () => "unused");
for (const key of Object.keys(work)) assert.deepEqual(course[key], work[key]);
for (const directive of ["writing: bird-report", "lab: bird-observation", "log"]) assert((course.lessons as any[])[0].body.includes("```assignment\n" + directive + "\n```"));
assert.deepEqual(doc, original);
(course.writing as any[])[0].prompt = "Changed local copy"; assert.deepEqual(doc, original);
for (const change of [
  { writing: [{ ...work.writing[0], rubric: "missing" }] },
  { labs: [{ ...work.labs[0], adult: "yes" }] },
  { activityLog: { ...work.activityLog, weeklyDays: 8 } },
  { lessons: [{ ...doc.lessons[0], blocks: [{ type: "assignment", kind: "writing", id: "bird-report\n```\nmalicious" }] }] },
  { lessons: [{ ...doc.lessons[0], blocks: [{ type: "assignment", kind: "log", source: "arbitrary" }] }] },
]) {
  assert(checkDoc({ ...doc, ...change }, false).length, "invalid canonical references/types rejected even in drafts");
  assert.throws(() => toCourse({ ...doc, ...change } as CommunityDoc, { id: "bad", version: 1, review: "not_reviewed", author: "" }, () => ""));
}
assert(communityWorkRevisionProblems(doc, { ...doc, lessons: [{ ...doc.lessons[0], blocks: [] }] }).length);
assert(communityWorkRevisionProblems(doc, { ...doc, writing: [] }).length);
assert.deepEqual(communityWorkRevisionProblems(doc, { ...doc, description: "Clarification" }), []);
const originalFetch = globalThis.fetch;
try {
  globalThis.fetch = async () => Response.json({ id: "observations", version: 7, review: "not_reviewed", author: "Author", doc });
  const installed = normalizeCourse(await downloadCommunityCourse("observations"));
  const reimported = importValidatedCourseSnapshot(exportCourseSnapshot(installed));
  for (const key of Object.keys(work)) {
    assert.deepEqual((installed as any)[key], work[key], `installed ${key}`);
    assert.deepEqual((reimported as any)[key], work[key], `reimported ${key}`);
  }
  assert.equal(installed.community?.review, "not_reviewed");
} finally { globalThis.fetch = originalFetch; }
console.log("community assessed work: typed links, strict references, publication continuity, canonical install/export parity passed");

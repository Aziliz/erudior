import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { checkDoc, toCourse, imageIds, migrateCommunityDocToCanonical, communityWorkRevisionProblems, type CommunityDoc } from "../src/lib/communityFormat.ts";
import { courseFromCanonicalAuthoring } from "../src/lib/canonicalAuthoring.ts";
import { normalizeCourse, exportCourseSnapshot } from "../src/lib/course.ts";
import { importValidatedCourseSnapshot } from "../src/lib/courseIntegrity.ts";
import { downloadCommunityCourse } from "../src/lib/community.ts";
const payload = JSON.parse(readFileSync(new URL("./fixtures/community-canonical.json", import.meta.url), "utf8"));
const doc: CommunityDoc = { format: "erudior-community", version: 1, title: payload.course.title, description: "Public listing", subject: "Science", level: "Middle School", type: "Course", lessons: [], decks: [], canonical: payload };
assert.deepEqual(checkDoc(doc, true), []);
const before = structuredClone(doc);
const meta = { id: "complete", version: 5, author: "Community publisher", review: "not_reviewed" as const };
const installed = toCourse(doc, meta, () => "unused") as any;
assert.equal(installed.id, "community-complete"); assert.equal(installed.revision, 5); assert.equal(installed.author, "Original source author");
assert.deepEqual(installed.community, meta); assert.deepEqual(installed.banks.map((b: any) => b.id), ["community-complete__first-bank", "community-complete__second-bank"]);
for (const [key, value] of Object.entries(payload.course)) if (!["id", "revision", "banks"].includes(key)) assert.deepEqual(installed[key], value, key);
assert.deepEqual(installed.banks.map(({courseId, id, ...bank}: any, i: number) => ({ ...bank, id: payload.course.banks[i].id })), payload.course.banks);
assert.deepEqual(doc, before);
for (const mutate of [
  (d: any) => d.canonical.course.community = { review: "reviewed" },
  (d: any) => d.canonical.course.banks[0].courseId = "forged",
  (d: any) => d.canonical.course.banks[0].questions[0].unknownField = true,
  (d: any) => d.canonical.course.lessons[0].body = '```sim\nunsafe\n```',
  (d: any) => d.canonical.course.audio.Bird = 'https://example.test/a.mp3',
  (d: any) => d.canonical.course.texts[0].sections[0].questions = ['other-question'],
  (d: any) => d.title = "Conflicting title",
  (d: any) => d.lessons = [{ id: "mirror", title: "Unrelated", blocks: [] }],
  (d: any) => d.rubrics = [],
]) { const bad = structuredClone(doc); mutate(bad); assert(checkDoc(bad, false).length); assert.throws(() => toCourse(bad, meta, () => "")); }
const mediaDoc = structuredClone(doc);
mediaDoc.canonical!.course.banks[0].questions[0].image = { src: 'https://community.example/images/owned', alt: 'Observation image' };
mediaDoc.canonical!.course.lessons[0].body += '\n\n![Picture](https://community.example/images/owned)';
assert.deepEqual(imageIds(mediaDoc, 'https://community.example'), ['owned']);
assert.deepEqual(checkDoc(mediaDoc, true, { communityImageOrigin: 'https://community.example' }), []);
assert(checkDoc(mediaDoc, true).length, 'community origin is trusted configuration, never inferred from payload');
const mediaSource = structuredClone(mediaDoc);
const png = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
const mediaInstalled = toCourse(mediaDoc, meta, id => { assert.equal(id, 'owned'); return png; }, 'https://community.example') as any;
assert.equal(mediaInstalled.banks[0].questions[0].image.src, png);
assert(mediaInstalled.lessons[0].body.includes(png));
assert.deepEqual(mediaDoc, mediaSource, 'runtime embedding never modifies downloadable authoring source');
const externalMedia = structuredClone(mediaDoc); externalMedia.canonical!.course.lessons[0].body += '\n![External](https://external.example/image.png)';
assert(checkDoc(externalMedia, true, { communityImageOrigin: 'https://community.example' }).length);
const legacy: CommunityDoc = { format:'erudior-community',version:1,title:'Legacy',description:'Description',subject:'Science',level:'Middle School',lessons:[{id:'l1',title:'Lesson',blocks:[{type:'text',md:'Original **content**.'}]}],decks:[] };
const migrated = migrateCommunityDocToCanonical(legacy, 'legacy');
assert(migrated.canonical); assert.deepEqual(migrated.lessons, []); assert.match(migrated.canonical.course.lessons[0].body, /Original \*\*content\*\*/);
assert.deepEqual(communityWorkRevisionProblems(legacy, migrated, 'legacy'), []);
assert(communityWorkRevisionProblems(migrated, legacy, 'legacy').length);
const removed = structuredClone(doc); removed.canonical!.course.banks.pop(); assert(communityWorkRevisionProblems(doc, removed, 'complete').length);
assert.deepEqual(courseFromCanonicalAuthoring(JSON.parse(JSON.stringify(doc.canonical))), payload.course, 'downloadable authoring source retains original ID/revision/all metadata');
const fetchBefore = globalThis.fetch;
try {
  globalThis.fetch = async () => Response.json({ ...meta, doc });
  const normalized = normalizeCourse(await downloadCommunityCourse('complete'));
  const roundtrip = importValidatedCourseSnapshot(exportCourseSnapshot(normalized));
  for (const key of ['author','updated','changelog','disclaimer','readAloud','audio','language','vocab','readingList','texts','rubrics','writing','labs','activityLog','spreadsheetAssignments']) {
    assert.deepEqual((normalized as any)[key], payload.course[key], key);
    assert.deepEqual((roundtrip as any)[key], payload.course[key], `portable installed ${key}`);
  }
} finally { globalThis.fetch = fetchBefore; }
console.log('canonical community: all-family golden payload, authority/ref rejection, explicit migration/namespace, source export and offline runtime image embedding passed');

// A real legacy upgrade retains authored media references and generated bank schemas.
const legacyRich = structuredClone(legacy);
legacyRich.lessons[0].blocks.push({ type: 'question', id: 'q1', kind: 'choice', stem: 'Which?', choices: ['A', 'B'], answer: [0], explanation: '' });
legacyRich.texts = [{ id: 'reading', title: 'Reading', kind: 'prose', sections: [{ id: 's1', title: 'Section', body: 'Text[^1]\n\n[^1]: ![Owned](https://community.example/images/owned)', questions: ['l1-q1'] }] }];
legacyRich.spreadsheetAssignments = [{ id: 'sheet', title: 'Sheet', lessonId: 'l1', starter: { sheets: { Sheet1: { A1: 1 } } }, protectedCells: [], answers: { 'Sheet1!A1': 1 }, tolerance: 0 }];
const richBefore = structuredClone(legacyRich);
const rich = migrateCommunityDocToCanonical(legacyRich, 'rich', id => `https://community.example/images/${id}`, 'https://community.example');
assert.deepEqual(checkDoc(rich, true, { communityImageOrigin: 'https://community.example' }), []);
assert.deepEqual(rich.canonical!.course.texts, legacyRich.texts);
assert.deepEqual(rich.canonical!.course.spreadsheetAssignments, legacyRich.spreadsheetAssignments);
assert.equal(rich.canonical!.course.banks[0].format, 'examiner-bank');
assert.equal(rich.canonical!.course.banks[0].version, 1);
assert.equal(rich.canonical!.course.banks[0].questions[0].id, 'l1-q1');
assert.deepEqual(communityWorkRevisionProblems(legacyRich, rich, 'rich', 'https://community.example'), []);
assert.deepEqual(legacyRich, richBefore);
const missingSheet = structuredClone(rich); missingSheet.canonical!.course.spreadsheetAssignments = [];
assert(communityWorkRevisionProblems(legacyRich, missingSheet, 'rich', 'https://community.example').some(e => e.includes('sheet')));
assert.throws(() => toCourse(legacyRich, meta, id => `https://community.example/images/${id}`, 'https://community.example'), /downloaded community reader image is invalid/, 'installation still requires validated embedded media');
assert.throws(() => migrateCommunityDocToCanonical(legacyRich, 'rich'), /image asset/, 'migration never trusts an origin inferred from source');
console.log('legacy canonical upgrade: reader source URLs, generated question bank schema, spreadsheet identities, and strict installation boundary preserved');

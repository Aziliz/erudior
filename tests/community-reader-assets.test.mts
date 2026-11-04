import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { checkDoc, imageIds, toCourse, type CommunityDoc } from '../src/lib/communityFormat.ts';
const origin = 'https://community.example';
const image = `${origin}/images/owned`;
const png = 'data:image/png;base64,AA==';
const texts = JSON.parse(readFileSync(new URL('./fixtures/community-reader.json', import.meta.url), 'utf8'));
for (const text of texts) text.kind = "prose";
for (const text of texts) for (const section of text.sections) delete section.questions;
const doc: CommunityDoc = { format: 'erudior-community', version: 1, title: 'Reader assets', description: 'Offline reader media.', subject: 'Reading and literature', level: 'Middle School', lessons: [{ id: 'l1', title: 'Read', blocks: [{ type: 'text', md: 'Read.' }] }], decks: [], texts };
const meta = { id: 'reader-assets', version: 1, author: 'Author', review: 'not_reviewed' as const };
const fields = [
  (d: CommunityDoc) => [d.texts![0], 'about'] as const,
  (d: CommunityDoc) => [d.texts![0].sections[0], 'body'] as const,
];
for (const field of fields) {
  for (const md of [`![escaped\\] alt](${image})`, `![picture][asset]\n\n[asset]: ${image}`, `<img alt="marker >" src="${image}">`]) {
    const input = structuredClone(doc); const [owner, key] = field(input); (owner as any)[key] = md;
    const before = structuredClone(input);
    assert.deepEqual(checkDoc(input, true, { communityImageOrigin: origin }), []);
    assert.deepEqual(imageIds(input, origin), ['owned']);
    const installed = toCourse(input, meta, id => { assert.equal(id, 'owned'); return png; }, origin) as any;
    const [result, resultKey] = field(installed);
    assert((result as any)[resultKey].includes(png));
    assert.deepEqual(input, before, 'installation never changes authored bytes');
    assert.throws(() => toCourse(input, meta, () => '', origin), /required community reader image/);
    assert.throws(() => toCourse(input, meta, () => 'https://evil.test/image.png', origin), /invalid/);
    assert(checkDoc(input, true).length, 'no untrusted origin inferred');
  }
  for (const bad of ['https://evil.test/a.png', `${origin}/images/owned?spoof=1`, `${origin}/images/owned#spoof`]) {
    const input = structuredClone(doc); const [owner, key] = field(input); (owner as any)[key] = `![image](${bad})`;
    assert(checkDoc(input, false, { communityImageOrigin: origin }).length, 'draft fails closed too');
    assert.throws(() => toCourse(input, meta, () => png, origin), /Cannot install reading library/);
  }
  const input = structuredClone(doc); const [owner, key] = field(input);
  const literal = `An ordinary [link](${image}) and literal ${image}.\n\n\`![image](${image})\`\n\n\`\`\`text\n![image](${image})\n\`\`\``;
  (owner as any)[key] = literal;
  assert.deepEqual(checkDoc(input, true), []);
  assert.deepEqual(imageIds(input, origin), []);
  const installed = toCourse(input, meta, () => { throw Error('inert image fetched'); }, origin) as any;
  const [result, resultKey] = field(installed); assert.equal((result as any)[resultKey], literal);
}
console.log('legacy reader assets: all rendered fields validated, ownership IDs collected, offline embedding immutable, missing/unsafe images rejected, inert code and prose preserved');

// The reader extracts definition lines before Markdown parses them. A plain Markdown
// lexer would silently treat a first-line note image as a link definition instead.
for (const note of [
  `Text[^1]\n\n[^1]: ![first](${image})`,
  `Text[^1]\r\n\r\n[^1]: An image\r\n  ![continued](${image})`,
  `Text[^1]\n\n[^1]: ![wrapped](\n  ${image})`,
]) {
  const input = structuredClone(doc); input.texts![0].sections[0].body = note;
  assert.deepEqual(checkDoc(input, true, { communityImageOrigin: origin }), []);
  assert.deepEqual(imageIds(input, origin), ['owned']);
  const installed = toCourse(input, meta, () => png, origin) as any;
  assert(installed.texts[0].sections[0].body.includes(png));
  assert.equal(installed.texts[0].sections[0].body.split(png).length, 2);
  assert.equal(input.texts![0].sections[0].body, note);
  input.texts![0].sections[0].body = note.replace(image, 'https://evil.test/image.png');
  assert(checkDoc(input, true, { communityImageOrigin: origin }).length);
}
console.log('reader footnote assets: first-line, continued, multiline-image and CRLF mapping validated and embedded losslessly');
for (const kind of ['poem', 'play'] as const) {
  for (const body of [`\`\`\`text\n![image](${image})\n\`\`\``, `# ![heading](${image})`, `    ![indent](${image})`, ...(kind === 'play' ? [`[![stage](${image})]`, `*![stage](${image})*`] : [])]) {
    const input = structuredClone(doc); input.texts![0].kind = kind; input.texts![0].sections[0].body = body;
    assert.deepEqual(checkDoc(input, true, { communityImageOrigin: origin }), []);
    assert.deepEqual(imageIds(input, origin), ['owned']);
    const installed = toCourse(input, meta, () => png, origin) as any;
    assert.equal(installed.texts[0].sections[0].body, body.replace(image, png));
    input.texts![0].sections[0].body = body.replace(image, 'https://evil.test/image.png');
    assert(checkDoc(input, true, { communityImageOrigin: origin }).length);
  }
}
console.log('reader verse assets: per-line rendering, indentation, headings, play stage directions, and non-shielding fences covered');

const inertGlossary = structuredClone(doc);
inertGlossary.texts![0].glossary![0].definition = 'Literal ![image](https://evil.test/image.png)';
assert.deepEqual(checkDoc(inertGlossary, true), []);
assert.deepEqual(imageIds(inertGlossary, origin), []);
assert.deepEqual((toCourse(inertGlossary, meta, () => { throw Error('inert glossary fetched'); }, origin) as any).texts[0].glossary, inertGlossary.texts![0].glossary);

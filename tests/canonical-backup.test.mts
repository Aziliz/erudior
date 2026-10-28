import assert from 'node:assert/strict';
// Production collect/restore and installed-course serialization at an isolated native
// boundary. No real profiles, credentials, filesystem, or network are used.
const state = new Map<string, string>();
const items = new Map<string, string>();
const mutations: string[] = [];
(globalThis as any).isTauri = true;
(globalThis as any).window = { __TAURI_INTERNALS__: { invoke: async (command: string, args: any) => {
  if (command === 'load_state') return state.get(args.name) ?? null;
  if (command === 'save_state') { mutations.push(args.name); args.content === null ? state.delete(args.name) : state.set(args.name, args.content); return; }
  if (command === 'load_progress') return state.get('progress') ?? null;
  if (command === 'save_progress') { mutations.push('progress'); state.set('progress', args.content); return; }
  if (command === 'save_item') { mutations.push(`save:${args.kind}:${args.id}`); items.set(`${args.kind}:${args.id}`, args.content); return; }
  if (command === 'delete_item') { mutations.push(`delete:${args.kind}:${args.id}`); items.delete(`${args.kind}:${args.id}`); return; }
  if (command === 'list_items') return [...items].filter(([key]) => key.startsWith(args.kind + ':')).map(([, value]) => value);
  throw Error('Unexpected native command: ' + command);
} } };
const { collect, restoreContents, encryptText, decryptText } = await import('../src/lib/backup.ts');
const { emptyCourse, normalizeCourse, exportCourseSnapshot } = await import('../src/lib/course.ts');
const { canonicalAuthoringFromCourse } = await import('../src/lib/canonicalAuthoring.ts');
const { emptyProgress, useStudentFiles, listCourses, restoreBackup } = await import('../src/lib/storage.ts');
const { emptyRecords } = await import('../src/lib/records.ts');
const { readerRevision, applyReaderWrite, reconcileReaderState } = await import('../src/lib/readerPersistence.ts');

const text = { id: 'book', title: 'Original book', author: 'Original author', lang: 'fr', sections: [{ id: 'first', title: 'First', body: 'Original words.' }, { id: 'second', title: 'Second', body: 'Unchanged words.' }] };
const source = { ...emptyCourse(' Exact authored title '), id: 'reading-course', author: 'Author', updated: '2024-02-03', revision: 7, changelog: 'Original changelog', disclaimer: 'Original disclaimer', description: ' Exact description ', texts: [text] };
const course = normalizeCourse(source);
const originalRevision = await readerRevision(text as any, () => []);
let alice = applyReaderWrite(emptyProgress(), 'reading-course', text as any, originalRevision, { writer: 'writer-a', time: { '2026-10-27': 85 }, read: { first: '2026-10-27', second: '2026-10-27' }, place: { section: 'second', at: 1 } });
const originalFinished = alice.reading!['reading-course/book'].finished;
assert.ok(originalFinished);
const changedText = { ...text, sections: [{ ...text.sections[0], body: 'Revised words.' }, text.sections[1]] };
const changedRevision = await readerRevision(changedText as any, () => []);
// Keep completed original evidence and current unfinished revised reading together.
alice = { ...alice, reading: { ...alice.reading, 'reading-course/book': reconcileReaderState(alice.reading!['reading-course/book'], changedText as any, changedRevision) } };
assert.equal(alice.reading!['reading-course/book'].finished, undefined);
assert.equal(alice.reading!['reading-course/book'].completedRevisions![originalRevision.revision], originalFinished);
assert.equal(alice.reading!['reading-course/book'].priorRead!['first:' + originalRevision.sections.first], '2026-10-27');
assert.equal(alice.reading!['reading-course/book'].at, 1);
const bob = applyReaderWrite(emptyProgress(), 'reading-course', text as any, originalRevision, { writer: 'writer-b', time: { '2026-10-28': 12 }, read: {}, place: { section: 'first', at: 0 } });
const base = emptyProgress();
const family = { format: 'erudior-family', version: 1, students: [{ id: 'alice', name: 'Alice', grade: 5, assigned: [], freeChoice: false }, { id: 'bob', name: 'Bob', grade: 7, assigned: [], freeChoice: true }] };
state.set('family', JSON.stringify(family));
state.set('progress', JSON.stringify(base));
for (const [id, progress] of [['alice', alice], ['bob', bob]] as const) {
  state.set(`progress-${id}`, JSON.stringify(progress));
  state.set(`records-${id}`, JSON.stringify({ ...emptyRecords(), reading: id === 'alice' ? [{ id: 'original-book-record', title: 'Original book', author: 'Original author', finished: '2026-10-27', minutes: 1 }] : [] }));
}
useStudentFiles('bob');
const backup = await collect([course], []);
assert.deepEqual(backup.courses, [source], 'collect preserves exact author metadata, not current time or runtime bank IDs');
assert.deepEqual(backup.students.alice.progress, alice);
assert.deepEqual(backup.students.bob.progress, bob);
assert.deepEqual(backup.progress, base, 'active learner does not replace base progress');
const encrypted = await encryptText(JSON.stringify(backup), 'test-only backup password');
await assert.rejects(decryptText(JSON.parse(encrypted), 'incorrect'), /Wrong passphrase/);
state.clear(); items.clear();
await restoreContents(await decryptText(JSON.parse(encrypted), 'test-only backup password'), { courses: [], banks: [] });
assert.deepEqual(JSON.parse(state.get('progress-alice')!), alice);
assert.deepEqual(JSON.parse(state.get('progress-bob')!), bob);
const restoredAlice = JSON.parse(state.get('progress-alice')!);
const replayed = applyReaderWrite(restoredAlice, 'reading-course', changedText as any, changedRevision, { writer: 'writer-a', time: { '2026-10-27': 85 }, read: {} });
assert.equal(replayed.reading!['reading-course/book'].seconds, 85, 'restored receipts suppress replay credit');
assert.equal(replayed.activity['2026-10-27'].readingSec, 85);
assert.deepEqual(JSON.parse(state.get('records-alice')!), backup.students.alice.records);
assert.deepEqual(JSON.parse(state.get('records-bob')!), backup.students.bob.records);
assert.deepEqual(JSON.parse(state.get('family')!), backup.family);
const installed = await listCourses();
assert.deepEqual(installed.broken, []);
assert.deepEqual(JSON.parse(exportCourseSnapshot(installed.courses[0])), source);
assert.deepEqual((await collect(installed.courses, [])).students, backup.students, 'second collect retains distinct histories and counter receipts exactly');

const envelope = canonicalAuthoringFromCourse(source as any);
await restoreContents(JSON.stringify({ ...backup, courses: [envelope] }), { courses: [], banks: [] });
assert.deepEqual(JSON.parse(items.get('courses:reading-course')!), source, 'canonical envelope unwrapped before persistence');
const plain = { format: 'erudior-backup', version: 1, progress: alice, courses: [envelope], banks: [] };
await restoreBackup(plain, { courses: [], banks: [] });
assert.deepEqual(JSON.parse(state.get('progress')!).reading, alice.reading);
assert.deepEqual(JSON.parse(items.get('courses:reading-course')!), source);
for (const damage of [
  (x: any) => { x.version = 99; },
  (x: any) => { x.course.texts = [null]; },
  (x: any) => { x.course.texts[0].sections[0].questions = ['missing-question']; },
  (x: any) => { x.course.community = { review: 'reviewed' }; },
  (x: any) => { x.course.authority = 'official'; },
]) {
  const bad = structuredClone(envelope); damage(bad);
  for (const restore of [
    () => restoreContents(JSON.stringify({ ...backup, courses: [envelope, bad] }), { courses: [{ id: 'must-not-delete' } as any], banks: [] }),
    () => restoreBackup({ ...plain, courses: [envelope, bad] }, { courses: [{ id: 'must-not-delete' } as any], banks: [] }),
  ]) {
    const beforeState = [...state], beforeItems = [...items]; mutations.length = 0;
    await assert.rejects(restore());
    assert.deepEqual(mutations, [], 'all course envelopes validated before first deletion or write');
    assert.deepEqual([...state], beforeState); assert.deepEqual([...items], beforeItems);
  }
}
console.log('canonical backup: exact metadata, encrypted two-profile revision history/counter recovery, envelope restore, and malformed envelope zero-write preflight passed');

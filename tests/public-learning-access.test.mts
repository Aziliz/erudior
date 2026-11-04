import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { pathToView, viewToPath, pageKey } from '../src/lib/routes.ts';
import { CATALOG, setCatalog, type CatalogEntry } from '../src/lib/catalog.ts';

const catalog: CatalogEntry[] = [
  { id: 'foundation', title: 'Foundation fixture', file: 'synthetic/foundation.json', revision: 1, order: 1, description: 'Synthetic foundation', subject: 'Math', level: ['High school'], type: ['Course'], lessons: 1, questions: 1, cards: 0, drills: 0, lessonIds: ['foundation-lesson'] },
  { id: 'synthetic-public-course', title: 'Public learning fixture', file: 'synthetic/public.json', revision: 1, order: 2, description: 'Synthetic advanced course', subject: 'Math', level: ['High school'], type: ['Course'], lessons: 1, questions: 1, cards: 0, drills: 0, lessonIds: ['lesson one'], requires: ['foundation'], outline: [{ title: 'Public module', lessons: ['Public lesson'] }] },
];
for (const name of ['lesson', 'read', 'ref'] as const) {
  const keyName = name === 'lesson' ? 'lessonId' : name === 'read' ? 'textId' : 'refId';
  const one = { name, courseId: 'course', [keyName]: 'first' } as any;
  const two = { name, courseId: 'course', [keyName]: 'second' } as any;
  assert.notEqual(pageKey(one), pageKey(two), `${name} history distinguishes the exact source ID`);
  assert.equal(pageKey(one), pageKey({ ...one }), `${name} same source has stable history identity`);
}
const entry = catalog[1];
const slug = '/public-learning-fixture';
for (const suffix of ['/lessons/lesson%20one', '/lessons', '/read/text', '/reference/formula', '/activities/advanced/source']) {
  const path = slug + suffix;
  const pending = pathToView(path, '', [], catalog);
  assert.deepEqual(pending, { name: 'overview', catalogId: entry.id, requestedPath: path }, `fresh deep link retains ${suffix}`);
  assert.equal(viewToPath(pending!, catalog, () => undefined), path, 'pending destination survives address rendering');
}
assert.deepEqual(pathToView(slug, '', [], catalog), { name: 'overview', catalogId: entry.id });
assert.deepEqual(pathToView(slug + '/lessons/lesson%20one', '', [entry], catalog), { name: 'lesson', courseId: entry.id, lessonId: 'lesson one' });
for (const path of ['/%ZZ', '/%E0%A4', slug + '/lessons/%ZZ', slug + '/read/%E0%A4', slug + '/activities/advanced/%ZZ', '/not-a-course/lessons/lesson']) {
  assert.doesNotThrow(() => pathToView(path, '', [], catalog), `uninstalled malformed route does not throw: ${path}`);
  assert.equal(pathToView(path, '', [], catalog), null, `invalid route fails closed: ${path}`);
  assert.doesNotThrow(() => pathToView(path, '', [entry], catalog), `installed malformed route does not throw: ${path}`);
  assert.equal(pathToView(path, '', [entry], catalog), null, `installed invalid route fails closed: ${path}`);
}
// Duplicate titles must not turn an intended ID into a different catalog identity.
assert.deepEqual(pathToView('/synthetic-public-course/lessons/lesson%20one', '', [], [...catalog, { ...entry, id: 'different-id' }]), {
  name: 'overview', catalogId: entry.id, requestedPath: '/synthetic-public-course/lessons/lesson%20one',
});

const originalCatalog = [...CATALOG];
setCatalog(catalog);
const dom = new JSDOM('<!doctype html><body><div id="root"></div></body>', { url: 'https://example.test' });
Object.assign(globalThis, { window: dom.window, document: dom.window.document, HTMLElement: dom.window.HTMLElement, localStorage: dom.window.localStorage, IS_REACT_ACT_ENVIRONMENT: true });
Object.defineProperty(globalThis, 'navigator', { value: dom.window.navigator, configurable: true });
const { createElement, act } = await import('react');
const { createRoot } = await import('react-dom/client');
const { default: Overview } = await import('../src/pages/CourseOverview.tsx');
const root = createRoot(document.getElementById('root')!);
const calls: unknown[][] = [], navigations: unknown[] = [];
const progress = { lessonsDone: {}, attempts: [] };
const initialProgress = JSON.stringify(progress);
let release: (() => void) | undefined;
const api: any = {
  publicLearning: true, family: null, student: null, courses: [], progress,
  addCourse: (...args: unknown[]) => { calls.push(args); return new Promise<void>(resolve => { release = resolve; }); },
  go: (view: unknown) => navigations.push(view),
  assignmentBlock: () => null,
};
let renderKey = 0;
const render = async (changes: Record<string, unknown> = {}, requestedPath?: string) => {
  await act(async () => root.render(createElement(Overview, { key: ++renderKey, api: { ...api, ...changes }, id: entry.id, requestedPath } as any)));
};
const button = (label: string) => {
  const found = [...document.querySelectorAll('button')].find(b => b.textContent?.trim() === label);
  assert(found, `button ${label}`);
  return found;
};
await render();
assert.match(document.body.textContent!, /recommend|background/i, 'public prerequisites remain useful preparation advice');
assert.equal(button('Open course').disabled, false, 'guest start is available despite incomplete prerequisite');
assert.equal(button('Browse lessons').disabled, false);
await act(async () => button('Browse lessons').click());
assert.deepEqual(calls.pop(), [entry.id, slug + '/lessons']);
assert([...document.querySelectorAll('button')].filter(b => /Adding|Opening|Open course|Browse lessons/.test(b.textContent ?? '')).every(b => b.disabled), 'pending download disables repeat starts');
assert(release);
await act(async () => release!());
assert.equal(button('Browse lessons').disabled, false, 'finished request restores controls');

const linked = slug + '/lessons/lesson%20one';
await render({}, linked);
await act(async () => button('Open linked activity').click());
assert.deepEqual(calls.pop(), [entry.id, linked], 'linked launch passes the exact original destination');
await act(async () => release!());

setCatalog([...catalog, { ...entry, id: 'different-id' }]);
await render();
await act(async () => button('Browse lessons').click());
assert.deepEqual(calls.pop(), [entry.id, '/synthetic-public-course/lessons'], 'duplicate titles use the stable catalog identity');
await act(async () => release!());
setCatalog(catalog);

await render({ addCourse: async () => { throw Error('Synthetic download failure'); } });
await act(async () => button('Open course').click());
assert.match(document.body.textContent!, /Synthetic download failure/);
assert.equal(button('Open course').disabled, false, 'failed launch permits an explicit retry');
assert.equal(button('Browse lessons').disabled, false);

for (const publicLearning of [false, undefined]) {
  await render({ publicLearning });
  assert.match(document.body.textContent!, /Finish Foundation fixture/);
  const lock = [...document.querySelectorAll('button')].find(b => /Locked/.test(b.textContent ?? ''));
  assert(lock?.disabled, 'managed/default API retains prerequisite lock');
  assert(![...document.querySelectorAll('button')].some(b => b.textContent === 'Browse lessons'), 'public exploration is not exposed by a missing permission flag');
}
assert.equal(JSON.stringify(progress), initialProgress, 'rendering/public launch does not manufacture completion evidence');
assert.equal(calls.length, 0);
assert.equal(navigations.length, 0);
await act(async () => root.unmount());
dom.window.close();
setCatalog(originalCatalog);
console.log('Public course access recommendations, managed prerequisite locks, deep-link retention and malformed route safety passed');

import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import type { AppApi, View } from '../src/App';
import type { Progress } from '../src/lib/types';
import type { StudentWorkspace } from '../src/lib/studentWorkspace';

// Real component, synthetic profile store implementing the persisted AppApi contract.
const dom = new JSDOM('<!doctype html><div id="root"></div>', { url: 'https://example.test/workspace' });
Object.assign(globalThis, { window: dom.window, document: dom.window.document, HTMLElement: dom.window.HTMLElement,
  HTMLInputElement: dom.window.HTMLInputElement, HTMLSelectElement: dom.window.HTMLSelectElement,
  HTMLTextAreaElement: dom.window.HTMLTextAreaElement, localStorage: dom.window.localStorage,
  IS_REACT_ACT_ENVIRONMENT: true });
Object.defineProperty(globalThis, 'navigator', { configurable: true, value: dom.window.navigator });
let confirm = true;
dom.window.confirm = () => confirm;
const React = await import('react');
const { createRoot } = await import('react-dom/client');
const { default: StudentWorkspacePage } = await import('../src/pages/StudentWorkspacePage');
const { emptyProgress } = await import('../src/lib/storage');
const { emptyCourse } = await import('../src/lib/course');
const { parseStudentWorkspace } = await import('../src/lib/studentWorkspace');
const { requestNavigation } = await import('../src/lib/navigationGuard');
const course = { ...emptyCourse('Synthetic course'), id: 'course', modules: [{ id: 'unit', title: 'Unit' }], lessons: [{ id: 'lesson', module: 'unit', title: 'Synthetic lesson', body: 'Synthetic lesson only.' }] };
const initial = { ...emptyProgress(), enrolled: ['course'], lessonsDone: { 'course/completed': '2026-10-30' } };
const stored = new Map<string, Progress>([['alice', structuredClone(initial)], ['bob', emptyProgress()]]);
let selected = 'alice', generation = 0;
let pauseWrite: Promise<void> | null = null;
let failure: Error | null = null;
let api: AppApi;
const routes: View[] = [], notices: string[] = [];
const root = createRoot(document.getElementById('root')!);
const render = () => root.render(React.createElement(StudentWorkspacePage, { api }));
const mount = () => React.act(async () => render());
function makeApi(id: string): AppApi {
  const captured = generation;
  return {
    progress: structuredClone(stored.get(id)!), student: { id, name: id }, courses: [course], allCourses: [course], banks: [],
    family: {}, go: (target: View) => routes.push(target), toast: (message: string) => notices.push(message),
    refreshStudentWorkspace: async () => { api = { ...api, progress: structuredClone(stored.get(id)!) }; render(); },
    updateProgress: () => { throw Error('Workspace edits must not mutate general progress'); },
    updateStudentWorkspace: async (change: (value: StudentWorkspace) => StudentWorkspace) => {
      const gate = pauseWrite; pauseWrite = null; if (gate) await gate;
      if (failure) { const problem = failure; failure = null; throw problem; }
      if (selected !== id || generation !== captured) throw Error('The learner changed. Reopen the workspace.');
      const current = stored.get(id)!;
      const next = parseStudentWorkspace(change(parseStudentWorkspace(current.studentWorkspace)));
      stored.set(id, { ...current, studentWorkspace: next });
      if (selected === id && captured === generation) { api = { ...api, progress: { ...api.progress, studentWorkspace: structuredClone(next) } }; render(); }
    },
  } as unknown as AppApi;
}
api = makeApi('alice');
function button(label: string, scope: ParentNode = document): HTMLButtonElement {
  const result = [...scope.querySelectorAll<HTMLButtonElement>('button')].find(node => node.textContent?.trim() === label || node.getAttribute('aria-label') === label);
  assert(result, `Missing button: ${label}`); return result;
}
const click = (target: string | HTMLElement, scope: ParentNode = document) => React.act(async () => (typeof target === 'string' ? button(target, scope) : target).click());
function field(label: string): HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement {
  const labelled = document.querySelector<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(`[aria-label="${label}"]`);
  if (labelled) return labelled;
  const wrapper = [...document.querySelectorAll('label')].find(node => node.textContent?.trim().startsWith(label));
  const result = wrapper?.querySelector<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>('input,textarea,select');
  assert(result, `Missing field: ${label}`); return result;
}
async function fill(label: string, value: string) {
  const input = field(label);
  const proto = input.tagName === 'SELECT' ? dom.window.HTMLSelectElement.prototype : input.tagName === 'TEXTAREA' ? dom.window.HTMLTextAreaElement.prototype : dom.window.HTMLInputElement.prototype;
  await React.act(async () => { Object.getOwnPropertyDescriptor(proto, 'value')!.set!.call(input, value); input.dispatchEvent(new dom.window.Event(input.tagName === 'SELECT' ? 'change' : 'input', { bubbles: true })); });
}
function entry(title: string): HTMLElement {
  const result = [...document.querySelectorAll<HTMLElement>('article')].find(node => node.getAttribute('aria-label')?.endsWith(': ' + title));
  assert(result, `Missing entry ${title}`); return result;
}
const entries = () => stored.get(selected)!.studentWorkspace?.entries ?? [];
await mount();
assert.equal(document.querySelector('h1')?.textContent, 'Student dashboard and notebook');

assert.match(document.body.textContent!, /does not complete lessons, award credit/);
const preserved = structuredClone(initial);
const kinds = [ ['task', 'Daily plan'], ['note', 'Notebook'], ['reading', 'Reading shelf'], ['goal', 'Goals'], ['project', 'Projects'] ];
for (const [kind, section] of kinds) {
  await click(section);
  await click(`Add ${kind}`);
  assert.equal(document.activeElement, field('Title'), 'new editor focuses title');
  assert.equal(field('Title').maxLength, 160);
  for (const name of ['Status', 'Link installed resource (optional)', 'Show entries']) {
    assert.equal(field(name).getAttribute('aria-label'), name, 'select name stays concise rather than including every option');
  }
  assert.equal(field('Notes').getAttribute('aria-label'), 'Notes', 'textarea name stays independent of saved contents');
  await fill('Title', `Synthetic ${kind}`);
  await fill('Notes', `First line\nSecond line <img src=x onerror="globalThis.injected=1">`);
  await fill('Status', 'active');
  await fill('Date (optional)', '2026-11-01');
  assert.equal(requestNavigation('app', { name: 'progress' }), false, 'unsaved edit blocks app navigation');
  assert.equal(requestNavigation('history'), false, 'unsaved edit blocks Back/Forward');
  await click('Save entry');
  assert.equal(entries().find(item => item.kind === kind)!.status, 'active');
  assert.equal(entries().find(item => item.kind === kind)!.dueDate, '2026-11-01');
  assert.equal(entry(`Synthetic ${kind}`).querySelector('img'), null, 'notes are plain text, not executable HTML');
  assert.equal(requestNavigation('app', { name: 'progress' }), true);
  await click('Mark done', entry(`Synthetic ${kind}`));
  assert.equal(entries().find(item => item.kind === kind)!.status, 'done');
  await fill('Show entries', 'unfinished');
  assert.equal(document.querySelectorAll('.workspace-entry').length, 0);
  await fill('Show entries', 'all');
  await click('Reopen', entry(`Synthetic ${kind}`));
  await click(`Edit ${kind}`, entry(`Synthetic ${kind}`));
  await fill('Title', `Canceled ${kind}`); await click('Cancel edit');
  assert.equal(entries().find(item => item.kind === kind)!.title, `Synthetic ${kind}`);
  assert.equal(document.activeElement, button(`Add ${kind}`), 'cancel returns focus to add');
}
const {studentWorkspace: _, ...withoutWorkspace} = stored.get('alice')!;
assert.deepEqual(withoutWorkspace, preserved, 'self-planning cannot alter enrollment, lessons, assignments or grades');
await click('Notebook');
await fill('Search workspace entries', 'not present'); assert.equal(document.querySelectorAll('.workspace-entry').length, 0);
await fill('Search workspace entries', 'SECOND LINE'); assert.equal(document.querySelectorAll('.workspace-entry').length, 1);
await fill('Search workspace entries', '');
await fill('Show entries', 'day'); await fill('Selected date', '2026-11-02');
assert.equal(document.querySelectorAll('.workspace-entry').length, 0);
await fill('Selected date', '2026-11-01'); assert.equal(document.querySelectorAll('.workspace-entry').length, 1);
await fill('Show entries', 'all');
await click('Edit note', entry('Synthetic note'));
await fill('Link installed resource (optional)', JSON.stringify({courseId:'course',kind:'lesson',sourceId:'lesson'}));
await click('Save entry');
await click('Open linked resource: Synthetic course · Lesson: Synthetic lesson');
assert.deepEqual(routes.pop(), { name:'lesson',courseId:'course',lessonId:'lesson' });
api = {...api, courses: []}; await mount();
assert.match(entry('Synthetic note').textContent!, /Linked resource is not installed/);
assert.equal(entry('Synthetic note').querySelectorAll('button').length, 3);
api = {...api, courses: [course]}; await mount();

// A stale editor must not overwrite another window's latest entry.
await click('Edit note', entry('Synthetic note'));
await fill('Notes', 'Stale local changes');
const note = stored.get('alice')!.studentWorkspace!.entries.find(item => item.kind === 'note')!;
note.body = 'Other window saved first';
await click('Save entry');
assert.match(document.querySelector('[role=alert]')!.textContent!, /changed/);
assert.equal(stored.get('alice')!.studentWorkspace!.entries.find(item=>item.kind==='note')!.body, 'Other window saved first');
assert.equal(field('Notes').value, 'Stale local changes', 'failed save retains draft for copying');
await click('Cancel edit');
await click('Refresh saved workspace');
assert.match(entry('Synthetic note').textContent!, /Other window saved first/);

// Storage errors retain edits and allow retry, without a false success notification.
await click('Edit note', entry('Synthetic note')); await fill('Notes', 'Retry safely');
failure = Error('Storage unavailable'); const noticesBefore = notices.length;
await click('Save entry'); assert.match(document.querySelector('[role=alert]')!.textContent!, /Storage unavailable/);
assert.equal(notices.length, noticesBefore); assert.equal(field('Notes').value, 'Retry safely');
await click('Save entry'); assert.equal(entries().find(item=>item.kind==='note')!.body, 'Retry safely');

// Delete cancel and repeat are non-destructive until explicitly confirmed.
confirm = false; await click('Delete note', entry('Synthetic note')); assert(entries().some(item=>item.kind==='note'));
confirm = true; await click('Delete note', entry('Synthetic note')); assert(!entries().some(item=>item.kind==='note'));

// A delayed write from Alice cannot become Bob's write after a profile switch.
await click('Add note'); await fill('Title', 'Old profile pending note');
let release!: () => void;
pauseWrite = new Promise<void>(resolve => { release = resolve; });
await React.act(async () => { button('Save entry').click(); });
selected = 'bob'; generation++; api = makeApi('bob'); await mount();
await React.act(async () => release());
assert.equal(entries().length, 0);
assert.equal(document.querySelector('.workspace-editor'), null);
assert.doesNotMatch(document.body.textContent!, /Old profile pending note|Synthetic project/);
assert(!stored.get('alice')!.studentWorkspace!.entries.some(item=>item.title==='Old profile pending note'));
await click('Add task'); await fill('Title', 'Bob only'); await click('Save entry');
assert.equal(entries()[0].title, 'Bob only');
selected = 'alice'; generation++; api = makeApi('alice'); await mount();
assert.doesNotMatch(document.body.textContent!, /Bob only/);
assert.equal(entries().length, 4);

await React.act(async () => root.unmount());
dom.window.close();
console.log('Student workspace UI tests passed');

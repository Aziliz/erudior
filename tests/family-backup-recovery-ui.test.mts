import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
const dom = new JSDOM('<!doctype html><div id="root"></div>', { url: 'https://example.test/', pretendToBeVisual: true });
Object.assign(globalThis, { window: dom.window, document: dom.window.document, HTMLElement: dom.window.HTMLElement, localStorage: dom.window.localStorage, IS_REACT_ACT_ENVIRONMENT: true });
Object.defineProperty(globalThis, 'navigator', { configurable: true, value: dom.window.navigator });
// Isolate only native persistence. The final case uses the actual component,
// AES-GCM decryption, read-only preflight and prepared restore together.
const storedStates = new Map<string, string>(), storedItems = new Map<string, string>(), nativeWrites: string[] = [];
(globalThis as any).isTauri = true;
(window as any).__TAURI_INTERNALS__ = { invoke: async (command: string, args: any) => {
  if (command === 'load_state') return storedStates.get(args.name) ?? null;
  if (command === 'list_items') return [...storedItems].filter(([key]) => key.startsWith(args.kind + ':')).map(([, value]) => value);
  if (command === 'load_item') return storedItems.get(args.kind + ':' + args.id) ?? null;
  if (command === 'save_state') { nativeWrites.push(args.name); args.content === null ? storedStates.delete(args.name) : storedStates.set(args.name, args.content); return; }
  if (command === 'compare_and_swap_state') { if ((storedStates.get(args.name) ?? null) !== args.expected) return false; nativeWrites.push(args.name); storedStates.set(args.name, args.content); return true; }
  if (command === 'save_item') { const key = args.kind + ':' + args.id; nativeWrites.push(key); storedItems.set(key, args.content); return; }
  if (command === 'delete_item') { const key = args.kind + ':' + args.id; nativeWrites.push(key); storedItems.delete(key); return; }
  throw Error('Unexpected synthetic native action: ' + command);
} };
const React = await import('react');
const { createRoot } = await import('react-dom/client');
const { default: Recovery } = await import('../src/components/FamilyBackupRecovery.tsx');
const { FamilyRestoreError, MAX_ENCRYPTED_BACKUP_BYTES } = await import('../src/lib/backup.ts');
const { configureLocalSession, lockLocalSession, unlockLocalAdult, captureLocalSession } = await import('../src/lib/localSession.ts');
const wait = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms));
const prepared = Object.freeze({
  createdAt: '2026-11-01T12:00:00Z', digest: 'a'.repeat(64),
  inventory: Object.freeze({ students: 2, courses: 1, banks: 1, records: 3, photos: 2, files: 4, missingFiles: 1, studentNames: ['Synthetic Alice', '<img src=x onerror=evil()>'], courseTitles: ['Synthetic course'], libraries: ['Academic planning'], truncated: false }),
  currentInventory: { students: 1, courses: 2, banks: 1 },
  changes: { studentsAdded: 1, studentsRemoved: 0, coursesAdded: 0, coursesRemoved: 1, banksAdded: 0, banksRemoved: 0 },
  warnings: ['Parent course reviews must be repeated.', 'One referenced attachment is missing.'],
});
function deferred<T>() { let resolve!: (value: T) => void; const promise = new Promise<T>(r => resolve = r); return { resolve, promise }; }
let root: ReturnType<typeof createRoot>;
let props: any, verifies: number, restores: number, discards: number, auths: number, reloads: number, completed: number;
let verifyImpl: (...args: any[]) => Promise<any>, restoreImpl: (...args: any[]) => Promise<any>, authorizeImpl: () => Promise<(() => void) | null>;
const button = (name: string) => { const value = [...document.querySelectorAll<HTMLButtonElement>('button')].find(b => b.textContent === name); assert(value, `Missing button: ${name}\n${document.body.textContent}`); return value; };
const exists = (name: string) => [...document.querySelectorAll('button')].some(b => b.textContent === name);
const click = async (name: string) => React.act(async () => { button(name).click(); await wait(); });
const render = async () => React.act(async () => { root.render(React.createElement(React.StrictMode, null, React.createElement(Recovery, props))); await wait(); });
async function setup() {
  if (root!) await React.act(async () => root.unmount());
  root = createRoot(document.getElementById('root')!);
  configureLocalSession(true); unlockLocalAdult();
  verifies = 0; restores = 0; discards = 0; auths = 0; reloads = 0; completed = 0;
  verifyImpl = async (_raw, _pass, _current, authorize) => { authorize(); return prepared; };
  restoreImpl = async (_prepared, _current, authorize) => { authorize(); return { students: 2, courses: 1 }; };
  authorizeImpl = async () => { lockLocalSession(); await wait(); unlockLocalAdult(); return captureLocalSession(); };
  props = { contextKey: 'family-a', current: { courses: [], banks: [] }, reauthenticateAdult: async () => { auths++; return authorizeImpl(); }, service: {
    verify: async (...args: any[]) => { verifies++; return verifyImpl(...args); },
    restore: async (...args: any[]) => { restores++; return restoreImpl(...args); },
    discard: () => { discards++; },
  }, onRestored: () => { completed++; }, onReload: () => { reloads++; } };
  await render();
}
async function password(value = 'synthetic backup password') {
  await React.act(async () => {
    const el = document.querySelector<HTMLInputElement>('[aria-label="Backup passphrase to verify"]'); assert(el);
    Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype, 'value')!.set!.call(el, value);
    el.dispatchEvent(new dom.window.Event('input', { bubbles: true })); await wait();
  });
}
async function choose(text: () => Promise<string> = async () => 'synthetic encrypted fixture') {
  await React.act(async () => {
    const el = document.querySelector<HTMLInputElement>('[aria-label="Encrypted Family backup file"]'); assert(el);
    Object.defineProperty(el, 'files', { configurable: true, value: [{ name: 'synthetic-family.json', text }] });
    el.dispatchEvent(new dom.window.Event('change', { bubbles: true })); await wait();
  });
}
async function start(text?: () => Promise<string>) { await click('Verify an encrypted backup'); await choose(text); await password(); }
async function verify() { await start(); await click('Verify selected backup'); }
async function acknowledge() { await React.act(async () => { document.querySelector<HTMLInputElement>('input[type=checkbox]')!.click(); await wait(); }); }
const cases: string[] = [];
async function test(name: string, action: () => Promise<void>) { await setup(); await action(); cases.push(name); }

await test('fresh auth precedes inputs; inspect-only finish clears without restoring', async () => {
  assert.equal(document.querySelector('input[type=password]'), null);
  await verify(); assert.equal(auths, 1); assert.equal(verifies, 1); assert.equal(restores, 0);
  assert(document.querySelector('[aria-label="Verified Family backup"]'));
  assert.match(document.body.textContent!, /1 currently, 2 in backup/);
  assert.match(document.body.textContent!, /Missing referenced files/);
  assert.match(document.body.textContent!, /not an all-or-nothing transaction/);
  assert.equal(document.querySelector('img'), null, 'untrusted labels are rendered as text');
  await click('Finish verification without restoring');
  assert.equal(restores, 0); assert(discards >= 1); assert.match(document.body.textContent!, /recovery drill succeeded/);
  assert.equal(document.querySelector('[aria-label="Verified Family backup"]'), null);
  assert(!Object.values(localStorage).join('').includes('synthetic backup password'));
});
await test('cancelled authentication never reads a file or exposes inputs', async () => {
  authorizeImpl = async () => null;
  await click('Verify an encrypted backup'); assert.match(document.body.textContent!, /Authentication canceled/);
  assert.equal(document.querySelector('input'), null); assert.equal(verifies, 0);
});
await test('cancelled restore review requires acknowledgement again', async () => {
  await verify(); await click('Review restore'); assert(button('Restore this verified backup').disabled);
  await acknowledge(); assert(!button('Restore this verified backup').disabled);
  await click('Cancel restore review'); await click('Review restore'); assert(button('Restore this verified backup').disabled);
  await click('Discard verified backup'); assert.equal(restores, 0); assert.equal(document.querySelector('[aria-label="Verified Family backup"]'), null);
});
await test('wrong passphrase clears file and passphrase and requires fresh auth', async () => {
  verifyImpl = async () => { throw Error('The passphrase is incorrect or the file is damaged.'); };
  await verify(); assert.match(document.querySelector('[role=alert]')!.textContent!, /incorrect/);
  assert.equal(document.querySelector('input'), null); assert(exists('Verify an encrypted backup')); assert.equal(restores, 0);
});
await test('duplicate verification and canceled late file read never decrypt', async () => {
  const fileRead = deferred<string>(); await start(() => fileRead.promise); await click('Verify selected backup');
  const form = document.querySelector('form')!;
  await React.act(async () => { form.dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true })); await wait(); });
  await click('Cancel verification');
  await React.act(async () => { fileRead.resolve('late encrypted file'); await wait(); });
  assert.equal(verifies, 0); assert.equal(document.querySelector('[aria-label="Verified Family backup"]'), null);
});
await test('canceled late decrypted result is discarded and never shown', async () => {
  const decrypted = deferred<any>(); verifyImpl = async () => decrypted.promise;
  await start(); await click('Verify selected backup'); assert.equal(verifies, 1);
  await React.act(async () => { document.querySelector('form')!.dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true })); await wait(); });
  assert.equal(verifies, 1); await click('Cancel verification');
  await React.act(async () => { decrypted.resolve(prepared); await wait(); });
  assert(discards >= 1); assert.equal(document.querySelector('[aria-label="Verified Family backup"]'), null);
});
await test('profile change invalidates a late decrypted result', async () => {
  const decrypted = deferred<any>(); verifyImpl = async () => decrypted.promise;
  await start(); await click('Verify selected backup'); props = { ...props, contextKey: 'family-b' }; await render();
  await React.act(async () => { decrypted.resolve(prepared); await wait(); });
  assert.equal(document.querySelector('[aria-label="Verified Family backup"]'), null); assert(discards >= 1);
});
await test('lock-away-and-back invalidates exact session even without parent render', async () => {
  await verify(); await React.act(async () => { lockLocalSession(); unlockLocalAdult(); await wait(300); });
  assert.equal(document.querySelector('[aria-label="Verified Family backup"]'), null); assert(discards >= 1); assert.equal(restores, 0);
});
await test('hidden page and blur immediately clear private review', async () => {
  await verify(); await React.act(async () => { window.dispatchEvent(new dom.window.Event('blur')); await wait(); });
  assert.equal(document.querySelector('[aria-label="Verified Family backup"]'), null);
  await start(); await React.act(async () => { Object.defineProperty(document, 'hidden', { configurable: true, value: true }); document.dispatchEvent(new dom.window.Event('visibilitychange')); await wait(); });
  assert.equal(document.querySelector('input[type=password]'), null);
  Object.defineProperty(document, 'hidden', { configurable: true, value: false });
});
await test('native file selection can blur before secrets are entered', async () => {
  await click('Verify an encrypted backup');
  await React.act(async () => { window.dispatchEvent(new dom.window.Event('blur')); await wait(); });
  await choose(); await password(); await click('Verify selected backup'); assert(document.querySelector('[aria-label="Verified Family backup"]'));
});
await test('oversized file rejected before its text is allocated', async () => {
  await click('Verify an encrypted backup'); let reads = 0;
  await React.act(async () => {
    const el = document.querySelector<HTMLInputElement>('[aria-label="Encrypted Family backup file"]')!;
    Object.defineProperty(el, 'files', { configurable: true, value: [{ name: 'oversized.json', size: MAX_ENCRYPTED_BACKUP_BYTES + 1, text: async () => { reads++; return 'never'; } }] });
    el.dispatchEvent(new dom.window.Event('change', { bubbles: true })); await wait();
  });
  await password(); await click('Verify selected backup');
  assert.equal(reads, 0); assert.equal(verifies, 0); assert.match(document.body.textContent!, /MiB limit/);
});
await test('native pause clears preview without DOM hidden and does not acknowledge delivery', async () => {
  await verify(); assert.equal(document.hidden, false);
  const event = new dom.window.CustomEvent('erudior-native-lifecycle', { cancelable: true, detail: { bridgeId: 'test-bridge', sequence: 1, revocation: 0, paused: true, backgroundMs: 0 } });
  await React.act(async () => { window.dispatchEvent(event); await wait(); });
  assert.equal(event.defaultPrevented, false); assert.equal(document.querySelector('[aria-label="Verified Family backup"]'), null);
});
await test('native pause fences a late decrypted result', async () => {
  const decrypted = deferred<any>(); verifyImpl = async () => decrypted.promise;
  await start(); await click('Verify selected backup');
  await React.act(async () => {
    window.dispatchEvent(new dom.window.CustomEvent('erudior-native-lifecycle', { cancelable: true, detail: { bridgeId: 'test-bridge', sequence: 1, revocation: 0, paused: true, backgroundMs: 0 } }));
    decrypted.resolve(prepared); await wait();
  });
  assert.equal(document.querySelector('[aria-label="Verified Family backup"]'), null); assert(discards >= 1);
});
await test('single explicit apply, no duplicate submits, terminal success', async () => {
  const done = deferred<void>(); restoreImpl = async (_p, _c, authorize) => { authorize(); await done.promise; authorize(); return { students: 2, courses: 1 }; };
  await verify(); await click('Review restore'); await acknowledge(); const form = document.querySelector('form')!;
  await React.act(async () => { form.dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true })); form.dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true })); await wait(); });
  assert.equal(restores, 1);
  await React.act(async () => { done.resolve(); await wait(); });
  assert.equal(completed, 1); assert(!exists('Verify an encrypted backup')); await click('Reload saved Family'); assert.equal(reloads, 1);
});
await test('pre-write rejection clears review, never reuses stale confirmation', async () => {
  restoreImpl = async () => { throw new FamilyRestoreError('Local data changed after verification.', false); };
  await verify(); await click('Review restore'); await acknowledge(); await click('Restore this verified backup');
  assert.match(document.querySelector('[role=alert]')!.textContent!, /No restore writes were started/);
  assert(exists('Verify an encrypted backup')); assert.equal(completed, 0); assert.equal(restores, 1);
});
await test('partial failure keeps honest reload-only outcome across hide', async () => {
  restoreImpl = async () => { throw new FamilyRestoreError('Synthetic interrupted file write', true); };
  await verify(); await click('Review restore'); await acknowledge(); await click('Restore this verified backup');
  assert.match(document.body.textContent!, /some files may already have changed/); assert(!exists('Verify an encrypted backup'));
  await React.act(async () => { window.dispatchEvent(new dom.window.Event('pagehide')); await wait(); });
  assert.match(document.body.textContent!, /some files may already have changed/); assert(!exists('Verify an encrypted backup'));
  await click('Reload saved Family'); assert.equal(restores, 1); assert.equal(reloads, 1);
});
await test('hide during apply fences later writes and remains reload-only', async () => {
  const gate = deferred<void>(); let writes = 0;
  restoreImpl = async (_p, _c, authorize) => { authorize(); writes++; await gate.promise; try { authorize(); } catch { throw new FamilyRestoreError('Interrupted', true); } writes++; return { students: 2, courses: 1 }; };
  await verify(); await click('Review restore'); await acknowledge(); await click('Restore this verified backup');
  await React.act(async () => { window.dispatchEvent(new dom.window.Event('pagehide')); gate.resolve(); await wait(); });
  assert.equal(writes, 1); assert.match(document.body.textContent!, /some files may already have changed/); assert(!exists('Verify an encrypted backup'));
});
await test('actual encrypted pipeline: component verifies without writes then explicitly restores exact data', async () => {
  const actual = await import('../src/lib/backup.ts');
  const store = await import('../src/lib/storage.ts');
  const { emptyRecords } = await import('../src/lib/records.ts');
  const { bindLocalSessionCredential } = await import('../src/lib/localSession.ts');
  const { makeSecret } = await import('../src/lib/family.ts');
  const parent = { password: await makeSecret('Synthetic adult password for isolated integration'), recovery: await makeSecret('Synthetic recovery key for isolated integration') };
  const family = { format: 'erudior-family', version: 1, parent, students: [{ id: 'alice', name: 'Synthetic encrypted Alice', grade: 5, assigned: [], freeChoice: false }], year: { start: '2026-08-01', end: '2027-07-31' }, state: '', route: '', dailyMinutes: 180, reminders: [], done: [] };
  const progress = { ...store.emptyProgress(), seeded: true };
  const records = { ...emptyRecords(), reading: [{ id: 'book1', title: 'Synthetic restored book', author: 'Synthetic', date: '2026-11-01', subject: 'Reading', note: 'Private synthetic note' }] };
  const plaintext = JSON.stringify({ format: 'examiner-family-backup', version: 1, createdAt: '2026-11-01T12:00:00Z', family, students: { alice: { progress, records, photos: [] } }, progress: store.emptyProgress(), courses: [], banks: [] });
  const encrypted = await actual.encryptText(plaintext, 'synthetic backup password', 1000);
  assert(!encrypted.includes('Synthetic encrypted Alice'));
  storedStates.clear(); storedItems.clear(); nativeWrites.length = 0;
  storedStates.set('family', JSON.stringify(family)); storedStates.set('progress-alice', JSON.stringify(store.emptyProgress()));
  store.useStudentFiles('alice'); bindLocalSessionCredential(parent);
  props = { ...props, service: undefined }; await render();
  const before = JSON.stringify([...storedStates]);
  await start(async () => encrypted); await click('Verify selected backup');
  for (let i = 0; i < 100 && !document.querySelector('[aria-label="Verified Family backup"]'); i++) await React.act(async () => { await wait(10); });
  assert(document.querySelector('[aria-label="Verified Family backup"]'), document.body.textContent!);
  assert.match(document.body.textContent!, /Synthetic encrypted Alice/);
  assert(!document.body.textContent!.includes('Private synthetic note'));
  assert.deepEqual(nativeWrites, []); assert.equal(JSON.stringify([...storedStates]), before);
  await click('Finish verification without restoring'); assert.deepEqual(nativeWrites, []);
  await start(async () => encrypted); await click('Verify selected backup');
  for (let i = 0; i < 100 && !document.querySelector('[aria-label="Verified Family backup"]'); i++) await React.act(async () => { await wait(10); });
  await click('Review restore'); await acknowledge(); await click('Restore this verified backup');
  for (let i = 0; i < 100 && completed === 0; i++) await React.act(async () => { await wait(10); });
  assert.equal(completed, 1, document.body.textContent!);
  assert.equal(JSON.parse(storedStates.get('progress-alice')!).seeded, true);
  assert.equal(JSON.parse(storedStates.get('records-alice')!).reading[0].title, 'Synthetic restored book');
  assert(nativeWrites.includes('family')); assert.equal(document.querySelector('[aria-label="Verified Family backup"]'), null);
});
await test('unmount disposes the late result without publishing', async () => {
  const decrypted = deferred<any>(); verifyImpl = async () => decrypted.promise;
  await start(); await click('Verify selected backup');
  await React.act(async () => root.unmount());
  await React.act(async () => { decrypted.resolve(prepared); await wait(); }); assert(discards >= 1);
  // setup expects a live root to dispose; replace it with a fresh, empty root.
  root = createRoot(document.getElementById('root')!);
});
await React.act(async () => root.unmount()); configureLocalSession(false);
console.log(`Encrypted Family recovery real-component acceptance: ${cases.length} cases passed.\n${cases.map(name => ' - ' + name).join('\n')}`);

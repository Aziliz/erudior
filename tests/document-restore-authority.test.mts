import assert from 'node:assert/strict';
import {
  assertLocalAdult, bindLocalSessionCredential, captureLocalSession,
  configureLocalSession, lockLocalSession, unlockLocalAdult,
} from '../src/lib/localSession.ts';

// Exercise only synthetic documents through the production Tauri-command seam.
// No real files, credentials, or browser storage are read or written.
const parent = {
  password: { salt: 'synthetic', hash: 'password', iterations: 1 },
  recovery: { salt: 'synthetic', hash: 'recovery', iterations: 1 },
};
const family = JSON.stringify({ format: 'erudior-family', version: 1, parent, students: [{ id: 'alice' }] });
const writes: string[] = [];
let readFamily: () => Promise<string> = async () => family;
(globalThis as any).isTauri = true;
(globalThis as any).window = { __TAURI_INTERNALS__: { invoke: async (command: string, args: any) => {
  if (command === 'load_state') return args.name === 'family' ? readFamily() : null;
  if (command === 'save_item') { writes.push(args.id); return; }
  throw Error('Unexpected storage command: ' + command);
} } };

// Same-realm queuing is deterministic; cross-view Web Locks are tested separately.
const navigatorDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
Object.defineProperty(globalThis, 'navigator', { value: undefined, configurable: true });
const { documentTransactions, putFile } = await import('../src/lib/documents.ts');
const { useStudentFiles } = await import('../src/lib/storage.ts');
const deferred = () => {
  let resolve!: () => void;
  const promise = new Promise<void>(done => { resolve = done; });
  return { promise, resolve };
};
const file = { mime: 'text/plain', data: 'YQ==' };
const freshAuthority = () => {
  unlockLocalAdult(); bindLocalSessionCredential(parent);
  const session = captureLocalSession();
  return () => { session(); assertLocalAdult(); };
};

try {
  configureLocalSession(true);
  useStudentFiles('alice');

  // A restore's outer pre-call check is not enough: another writer can already
  // own this ID's lock when the restore is queued.
  const entered = deferred(), release = deferred();
  const holder = documentTransactions({
    read: async () => null,
    write: async () => { entered.resolve(); await release.promise; },
    remove: async () => {},
  });
  const holding = holder.put('queued-document', file);
  await entered.promise;
  const authorize = freshAuthority(); authorize();
  const queued = putFile('queued-document', file, authorize);
  const rejected = assert.rejects(queued, /session|locked/i);
  lockLocalSession(); unlockLocalAdult();
  release.resolve();
  await holding; await rejected;
  assert.deepEqual(writes, [], 'queued restore must not borrow a later adult session');

  // The raw backend awaits the anonymous/family scope lookup after acquiring
  // the document lock. Recheck the guard after that await, before save_item.
  const lookupEntered = deferred(), lookupRelease = deferred();
  readFamily = async () => { lookupEntered.resolve(); await lookupRelease.promise; return family; };
  useStudentFiles(null);
  const lookupAuthority = freshAuthority();
  const pending = putFile('lookup-document', file, lookupAuthority);
  const lookupRejected = assert.rejects(pending, /session|locked/i);
  await lookupEntered.promise;
  lockLocalSession(); unlockLocalAdult();
  lookupRelease.resolve();
  await lookupRejected;
  assert.deepEqual(writes, [], 'revocation during scope lookup must stop the actual document write');

  // View dismissal can revoke a restore even when the global adult epoch did
  // not change. Its explicit callback must survive every asynchronous boundary.
  const contextEntered = deferred(), contextRelease = deferred();
  readFamily = async () => { contextEntered.resolve(); await contextRelease.promise; return family; };
  const sessionAuthority = freshAuthority();
  let live = true;
  const contextAuthority = () => { sessionAuthority(); if (!live) throw Error('Backup review was discarded.'); };
  const contextPending = putFile('discarded-document', file, contextAuthority);
  const contextRejected = assert.rejects(contextPending, /discarded/);
  await contextEntered.promise;
  live = false; contextRelease.resolve();
  await contextRejected;
  assert.deepEqual(writes, [], 'discarded review must not write after its scope lookup');

  readFamily = async () => family;
  await putFile('fresh-document', file, freshAuthority());
  assert.deepEqual(writes, ['fresh-document'], 'current explicit authority still permits the requested replacement');

  console.log('document restore authority: queued lock/reauth, async scope revocation, review discard and fresh success passed');
} finally {
  configureLocalSession(false);
  useStudentFiles(null);
  if (navigatorDescriptor) Object.defineProperty(globalThis, 'navigator', navigatorDescriptor);
  else Reflect.deleteProperty(globalThis, 'navigator');
}

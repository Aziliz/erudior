import test from 'node:test';
import assert from 'node:assert/strict';
import { bounded, disconnected, readOperation, cleanupStep } from './harness.mjs';
const pending = () => new Promise(() => {});
const page = value => ({ evaluate: async () => value });
test('bounded successful result', async () => assert.equal(await bounded(() => 42, 20, 'ok'), 42));
test('bounded hung operation', async () => await assert.rejects(bounded(pending, 10, 'hung'), /hung timed out/));
test('bounded preserves original error', async () => await assert.rejects(bounded(() => { throw Error('original'); }, 20, 'x'), /original/));
test('transport classification does not treat app errors as disconnects', () => {
  assert.ok(disconnected(Error('Target page, context or browser has been closed')));
  assert.ok(disconnected(Error('Target disconnected')));
  assert.equal(disconnected(Error('Unauthorized native operation')), false);
});
test('returns cancellation without retry', async () => {
  let attached = 0;
  const result = await readOperation({ getPage: () => page({ token: 'a', pending: false, value: null }), token: 'a', reattach: () => attached++ });
  assert.equal(result.value, null); assert.equal(attached, 0);
});
test('reattaches existing operation without restarting it', async () => {
  let current = { evaluate: async () => { throw Error('Target closed'); } }, attached = 0;
  const result = await readOperation({ getPage: () => current, token: 'a', reattach: async () => { attached++; current = page({ token: 'a', pending: false, value: 'retained' }); } });
  assert.equal(result.value, 'retained'); assert.equal(attached, 1);
});
test('rejects missing or replaced operation rather than accepting new app context', async () => {
  for (const state of [undefined, { token: 'other', pending: false, value: null }]) {
    await assert.rejects(readOperation({ getPage: () => page(state), token: 'a', reattach: async () => {} }), /token missing/);
  }
});
test('pending and hung reads are bounded', async () => {
  await assert.rejects(readOperation({ getPage: () => page({ token: 'a', pending: true }), token: 'a', reattach: async () => {}, timeout: 15, poll: 1 }), /deadline/);
  await assert.rejects(readOperation({ getPage: () => ({ evaluate: pending }), token: 'a', reattach: async () => {}, timeout: 10 }), /timed out/);
});
test('reattachment itself is bounded', async () => {
  await assert.rejects(readOperation({ getPage: () => ({ evaluate: async () => { throw Error('Target closed'); } }), token: 'a', reattach: pending, timeout: 10 }), /timed out/);
});
test('cleanup continues after rejection or hang and reports', async () => {
  const messages = [];
  await cleanupStep(pending, 'hung close', x => messages.push(x), 10);
  await cleanupStep(() => { throw Error('closed'); }, 'close', x => messages.push(x), 10);
  assert.equal(messages.length, 2); assert.match(messages[0], /timed out/);
});
test('non-transport read errors are not hidden by recovery', async () => {
  let attached = 0;
  await assert.rejects(readOperation({ getPage: () => ({ evaluate: async () => { throw Error('Fixture application failure'); } }), token: 'a', reattach: () => attached++ }), /Fixture application failure/);
  assert.equal(attached, 0);
});
test('cleanup failures preserve an existing primary failure', async () => {
  const primary = Error('primary assertion');
  await assert.rejects(async () => {
    try { throw primary; }
    finally { await cleanupStep(pending, 'hung cleanup', () => {}, 10); }
  }, error => error === primary);
});
test('disconnected start dismisses picker before reattachment and never repeats mutation', async () => {
  const { verifyPortableFiles } = await import('./portable-files.mjs');
  let calls = 0, token;
  const events = [];
  const current = { evaluate: async (_fn, args) => {
    calls++;
    if (calls === 1) return { content: '{}' };
    if (calls === 2) { token = args.token; events.push('start'); throw Error('Target disconnected'); }
    if (calls === 3) throw Error('Target closed');
    if (calls === 4) return { token, pending: false, value: null };
    throw Error('Stop at next distinct operation');
  } };
  await assert.rejects(verifyPortableFiles({
    getPage: () => current,
    reattach: async () => { assert.deepEqual(events, ['start', 'dismiss']); events.push('reattach'); },
    adb: (...args) => { assert.deepEqual(args, ['shell', 'input', 'keyevent', 'KEYCODE_BACK']); events.push('dismiss'); },
    nodes: () => [{ package: 'com.android.documentsui' }],
    until: async fn => assert.ok(await fn()),
  }), /Stop at next distinct operation/);
  assert.deepEqual(events, ['start', 'dismiss', 'reattach']);
});

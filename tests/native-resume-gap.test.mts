import assert from 'node:assert/strict';
import test from 'node:test';
import { createNativeLifecycleConsumer } from '../src/lib/nativeLifecycle.ts';

// Unknown elapsed time stays zero in telemetry; the native revocation token,
// rather than an invented duration, requires a lock before the reveal commit.
const returned = { bridgeId: 'synthetic-native-gap', sequence: 3, revocation: 3, paused: false, backgroundMs: 0 };

test('an unmeasured native absence revokes before reveal and can be safely replayed', () => {
  const consume = createNativeLifecycleConsumer();
  const calls: string[] = [];
  const handlers = { lock: () => calls.push('lock'), conceal: () => calls.push('conceal'), reveal: () => calls.push('reveal') };
  const commit = (work: () => void) => { calls.push('commit-start'); work(); calls.push('commit-end'); };
  assert.equal(consume(returned, handlers, commit), true);
  assert.deepEqual(calls, ['commit-start', 'lock', 'reveal', 'commit-end']);
  calls.length = 0;
  assert.equal(consume(returned, handlers, commit), true);
  assert.deepEqual(calls, [], 'same delivery does not relock a freshly authenticated session');
  assert.equal(consume({ ...returned, sequence: 4 }, handlers, commit), true);
  assert.deepEqual(calls, ['commit-start', 'reveal', 'commit-end'], 'an already-consumed obligation is not a new one');
  calls.length = 0;
  assert.equal(consume({ ...returned, sequence: 5, revocation: 5 }, handlers, commit), true);
  assert.deepEqual(calls, ['commit-start', 'lock', 'reveal', 'commit-end'], 'another unpaired native return has new authority to revoke, never to unlock');
});

test('a failed revocation commit is not acknowledged and a new document still consumes owed debt', () => {
  const consume = createNativeLifecycleConsumer();
  const calls: string[] = [];
  const handlers = { lock: () => calls.push('lock'), conceal: () => calls.push('conceal'), reveal: () => calls.push('reveal') };
  assert.throws(() => consume(returned, handlers, () => { throw Error('synthetic failed commit'); }));
  assert.deepEqual(calls, []);
  assert.equal(consume(returned, handlers, work => work()), true);
  assert.deepEqual(calls, ['lock', 'reveal']);
  calls.length = 0;
  assert.equal(createNativeLifecycleConsumer()(returned, handlers, work => work()), true);
  assert.deepEqual(calls, ['lock', 'reveal'], 'a reloaded document cannot assume an older document performed its lock');
  calls.length = 0;
  assert.equal(consume({ ...returned, bridgeId: 'unrelated-bridge', sequence: 6, revocation: 6 }, handlers, work => work()), false);
  assert.deepEqual(calls, [], 'another bridge cannot authorize visibility');
});

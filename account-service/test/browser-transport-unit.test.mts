import assert from 'node:assert/strict';
import { test } from 'node:test';
import { browserCancellationObservation } from './browser-transport.mts';

await test('browser cancellation observation preserves terminal events across fulfillment ordering', async t => {
  await t.test('cancellation before fulfillment is retained', async () => {
    const observation = browserCancellationObservation();
    observation.complete(true);
    assert.equal(await observation.wait(100), true);
  });
  await t.test('cancellation after fulfillment/wait begins is observed', async () => {
    const observation = browserCancellationObservation();
    const result = observation.wait(100);
    await Promise.resolve(); // Simulate fulfilled CDP command before network event.
    observation.complete(true);
    assert.equal(await result, true);
  });
  await t.test('non-cancelled failure or successful completion cannot excuse an error', async () => {
    const observation = browserCancellationObservation();
    observation.complete(false);
    assert.equal(await observation.wait(100), false);
    observation.complete(true); // A different/duplicate terminal event cannot rewrite it.
    assert.equal(await observation.wait(100), false);
  });
  await t.test('missing terminal evidence fails closed after a bounded wait', async () => {
    assert.equal(await browserCancellationObservation().wait(5), false);
  });
  await t.test('a cancellation of another request does not count', async () => {
    const expected = browserCancellationObservation(), unrelated = browserCancellationObservation();
    unrelated.complete(true);
    assert.equal(await expected.wait(5), false);
    assert.equal(await unrelated.wait(100), true);
  });
});

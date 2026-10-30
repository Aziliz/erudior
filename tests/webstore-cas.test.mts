import assert from "node:assert/strict";

// Minimal asynchronous IndexedDB model: readwrite transactions queue globally,
// requests run within their transaction, and staged writes commit only at end.
// No Web Locks or shared application-level mutex is provided in this test.
const values = new Map<string, string>();
const traces: string[][] = [];
let tail = Promise.resolve();
let failNext: "get" | "put" | "commit" | "put-sync" | undefined;
const db = {
  transaction(_store: string, mode: string) {
    assert.equal(mode, "readwrite");
    const trace = [mode]; traces.push(trace);
    const requests: Array<() => void> = [];
    let staged: Map<string, string>;
    let aborted = false;
    const failure = failNext; failNext = undefined;
    const tx: any = {
      error: null,
      abort() { aborted = true; },
      objectStore() {
        return {
          get(key: string) {
            const req: any = {};
            requests.push(() => {
              trace.push("get:" + key);
              if (failure === "get") { tx.error = Error("read failed"); tx.abort(); return; }
              req.result = staged.get(key); req.onsuccess?.();
            });
            return req;
          },
          put(value: string, key: string) {
            if (failure === "put-sync") throw Error("synchronous put failed");
            const req: any = {};
            requests.push(() => {
              trace.push("put:" + key);
              if (failure === "put") { tx.error = Error("write failed"); tx.abort(); return; }
              staged.set(key, value); req.onsuccess?.();
            });
            return req;
          },
        };
      },
    };
    tail = tail.then(async () => {
      staged = new Map(values);
      // Allow callback installation before any request fires.
      await new Promise(resolve => setImmediate(resolve));
      while (requests.length && !aborted) requests.shift()!();
      if (failure === "commit") { tx.error = Error("commit failed"); tx.abort(); }
      if (aborted) { trace.push("abort"); tx.onabort?.(); return; }
      values.clear(); for (const [key, value] of staged) values.set(key, value);
      trace.push("commit"); tx.oncomplete?.();
    });
    return tx;
  },
};
Object.defineProperty(globalThis, "indexedDB", { configurable: true, value: {
  open() {
    const request: any = { result: db };
    queueMicrotask(() => request.onsuccess?.());
    return request;
  },
} });
const { webCompareAndSwap } = await import("../src/lib/webstore.ts");
assert.equal(await webCompareAndSwap("ledger", null, "first"), true);
assert.equal(values.get("ledger"), "first");
assert.deepEqual(traces.at(-1), ["readwrite", "get:ledger", "put:ledger", "commit"]);
assert.equal(await webCompareAndSwap("ledger", null, "wrong"), false);
assert.deepEqual(traces.at(-1), ["readwrite", "get:ledger", "commit"]);
assert.equal(values.get("ledger"), "first");
const competing = await Promise.all(Array.from({ length: 12 }, (_, i) => webCompareAndSwap("ledger", "first", `winner-${i}`)));
assert.equal(competing.filter(Boolean).length, 1, "only one transaction can replace the same expected bytes");
assert.equal(values.get("ledger"), "winner-0");
for (const failure of ["get", "put", "commit", "put-sync"] as const) {
  failNext = failure;
  await assert.rejects(webCompareAndSwap("ledger", "winner-0", "lost"), /failed/);
  assert.equal(values.get("ledger"), "winner-0", "failed transactions leave committed bytes intact");
}
assert.equal(await webCompareAndSwap("ledger", "winner-0", "recovered"), true);
assert.equal(values.get("ledger"), "recovered", "later transactions recover after errors");
assert.equal(await webCompareAndSwap("other", null, "isolated"), true);
assert.equal(values.get("ledger"), "recovered");
console.log("browser CAS: single readwrite transaction, commit-only result, mismatch, competing writers, rollback and recovery passed");

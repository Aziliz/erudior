import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { stateTransactions, validStateName } from "../src/lib/stateLock.ts";
const delay = () => new Promise<void>(resolve => setTimeout(resolve, 2));
const values = new Map<string, string>();
const backend = { read: async (name: string) => values.get(name) ?? null, write: async (name: string, value: string | null) => { await delay(); if (value === null) values.delete(name); else values.set(name, value); } };
const a = stateTransactions(backend), b = stateTransactions(backend);
await Promise.all(Array.from({ length: 30 }, (_, index) => (index % 2 ? a : b).update("family", async old => { await delay(); return String(Number(old ?? "0") + 1); })));
assert.equal(values.get("family"), "30", "all cooperating updates see the latest committed state");
let unlock!: () => void;
const gate = new Promise<void>(resolve => { unlock = resolve; });
let started!: () => void; const beginning = new Promise<void>(resolve => { started = resolve; });
const update = a.update("classes", async () => { started(); await gate; return "updated"; });
await beginning;
const save = b.save("classes", "saved");
await a.save("session", "independent");
assert.equal(values.get("session"), "independent", "other names are not blocked");
assert.equal(values.has("classes"), false);
unlock(); await update; await save;
assert.equal(values.get("classes"), "saved", "plain save joins update lock rather than racing its read/write");
await assert.rejects(a.update("family", () => { throw Error("failed updater"); }), /failed updater/);
await a.save("family", "after failure"); assert.equal(values.get("family"), "after failure");
const failing = stateTransactions({ ...backend, write: async () => { throw Error("disk full"); } });
await assert.rejects(failing.save("classes", "not saved"), /disk full/);
await a.save("classes", null); assert.equal(values.has("classes"), false, "failed writes release lock; delete participates");
for (const name of ["progress", "session", "classes", "family", "classroom-submissions", "progress-a1", "records-a1", "session-a1", "portfolio-a1"]) assert.ok(validStateName(name));
for (const name of ["classroom-submissions-other", "classroom-other", "../family", "progress-", "progress-A", "progress-a/b", "progress/other", `records-${"a".repeat(25)}`]) {
  assert.equal(validStateName(name), false);
  await assert.rejects(a.save(name, "bad"), /Unknown state/);
  await assert.rejects(a.update(name, () => "bad"), /Unknown state/);
}
let current: string | null = "1", comparisons = 0, transformations = 0;
const native = stateTransactions({ read: async () => current, write: async () => {}, compareAndSwap: async (_name, expected, value) => {
  comparisons++;
  if (comparisons === 1) { current = "7"; return false; }
  if (current !== expected) return false;
  current = value; return true;
} });
assert.equal(await native.update("family", old => { transformations++; return String(Number(old) + 1); }), "8");
assert.equal(transformations, 2, "native conflicts recompute against fresh state");
const busy = stateTransactions({ ...backend, compareAndSwap: async () => false });
await assert.rejects(busy.update("family", () => "value"), /changed repeatedly/);
await a.save("family", "released");
let lockName = "", lockMode = "";
const original = Object.getOwnPropertyDescriptor(globalThis, "navigator");
Object.defineProperty(globalThis, "navigator", { configurable: true, value: { locks: { request: async (name: string, options: { mode: string }, fn: () => Promise<unknown>) => { lockName = name; lockMode = options.mode; return fn(); } } } });
try { await a.update("classroom-submissions", old => old ?? "ledger"); } finally {
  if (original) Object.defineProperty(globalThis, "navigator", original); else Reflect.deleteProperty(globalThis, "navigator");
}
assert.equal(lockName, "erudior.state.classroom-submissions"); assert.equal(lockMode, "exclusive");
// Source integration guard supplements, but does not replace, native Rust tests.
const rust = await readFile(new URL("../src-tauri/src/lib.rs", import.meta.url), "utf8");
assert.match(rust, /name == "classroom-submissions"/);
assert.match(rust, /fn save_progress[\s\S]*?NAMED_STATE_LOCK\.lock\(\)/);
assert.match(rust, /fn save_state[\s\S]*?NAMED_STATE_LOCK\.lock\(\)/);
assert.match(rust, /fn compare_and_swap_state[\s\S]*?NAMED_STATE_LOCK\.lock\(\)/);
assert.match(rust, /save_state,\s+compare_and_swap_state,/);
const storage = await readFile(new URL("../src/lib/storage.ts", import.meta.url), "utf8");
const saveBoundary = storage.match(/export const saveState = [\s\S]*?\n};/)?.[0] ?? "";
assert.match(saveBoundary, /namedState\.save\(name, content, \(\) => assertStoredSession\(lease\)\)/);
assert.match(saveBoundary, /captureLocalSession\(\)/);
const updateBoundary = storage.match(/export const updateState = [\s\S]*?\n};/)?.[0] ?? "";
assert.match(updateBoundary, /namedState\.update\(name,guarded,lease\)/);
assert.match(updateBoundary, /await assertStoredSession\(lease\)/);
console.log("named state serialization, CAS, allowlist and lock tests passed");

await Promise.all(Array.from({length:8},()=>a.update("progress",old=>String(Number(old??"0")+1))));
assert.equal(values.get("progress"),"8","single-user progress joins named-state transaction boundary");

import assert from "node:assert/strict";
import { documentTransactions } from "../src/lib/documents.ts";
const files = new Map<string, string>(); let writes = 0;
const backend = {
  read: async (id: string) => files.get(id) ?? null,
  write: async (id: string, content: string) => { writes++; files.set(id, content); },
  remove: async (id: string) => { files.delete(id); },
};
const a = documentTransactions(backend), b = documentTransactions(backend);
const original = { mime: "text/plain", data: "eA==" }, changed = { mime: "text/plain", data: "eQ==" };
await Promise.all([a.preserve("file1", original), b.preserve("file1", original)]);
assert.equal(writes, 1, "same bytes idempotent across concurrent import callers");
await assert.rejects(b.preserve("file1", changed), /not replaced/);
assert.deepEqual(JSON.parse(files.get("file1")!), original);
files.set("reordered", JSON.stringify({ data: original.data, mime: original.mime }));
await a.preserve("reordered", original); assert.equal(writes, 1, "object property order is not a content conflict");
files.set("damaged", "not json");
await assert.rejects(a.preserve("damaged", original), /not replaced/);
assert.equal(files.get("damaged"), "not json");
const competing = await Promise.allSettled([a.preserve("race", original), b.preserve("race", changed)]);
assert.deepEqual(competing.map(r => r.status), ["fulfilled", "rejected"]);
let release!: () => void, started!: () => void;
const gate = new Promise<void>(resolve => { release = resolve; });
const beginning = new Promise<void>(resolve => { started = resolve; });
const slow = documentTransactions({ ...backend, read: async id => { started(); await gate; return backend.read(id); } });
const importing = slow.preserve("ordered", original); await beginning;
const replacement = b.put("ordered", changed);
await a.preserve("independent", original); // other IDs don't wait
assert.equal(files.has("ordered"), false);
release(); await importing; await replacement;
assert.deepEqual(JSON.parse(files.get("ordered")!), changed, "explicit replacement waits, retaining intentional backup semantics");
await Promise.all([a.put("deleted", original), b.remove("deleted")]); assert.equal(files.has("deleted"), false);
const failing = documentTransactions({ ...backend, write: async () => { throw Error("disk full"); } });
await assert.rejects(failing.preserve("retry", original), /disk full/);
await a.preserve("retry", original); assert.ok(files.has("retry"), "failure releases ID lock");
await assert.rejects(a.preserve("../escape", original), /Invalid document ID/);
assert.throws(() => a.preserve("bad", { mime: "text/plain", data: "%%%=" }), /Invalid document data/);
let lock = "";
const saved = Object.getOwnPropertyDescriptor(globalThis, "navigator");
Object.defineProperty(globalThis, "navigator", { configurable: true, value: { locks: { request: async (name: string, options: { mode: string }, run: () => Promise<unknown>) => { lock = name; assert.equal(options.mode, "exclusive"); return run(); } } } });
try { await a.preserve("web-lock", original); } finally { if (saved) Object.defineProperty(globalThis, "navigator", saved); else Reflect.deleteProperty(globalThis, "navigator"); }
assert.equal(lock, "erudior.document.web-lock");
console.log("document preserving import, replacement/delete ordering and recovery tests passed");

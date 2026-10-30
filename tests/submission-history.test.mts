import { strict as assert } from "node:assert";
import { recordHandIn, reviewHandIn, latestSubmissions } from "../src/lib/submissionHistory.ts";
import type { HandIn } from "../src/lib/classroom.ts";

const handIn = (mac: string, studentId = "s1"): HandIn => ({
  format: "erudior-handin", version: 1, classId: "c1", className: "Class",
  studentId, studentName: studentId, created: "2026-10-28T08:00:00Z",
  courses: ["math"], progress: { attempts: [], lessonsDone: {}, drills: {} }, mac: mac ? btoa(mac.padEnd(32, "_").slice(0, 32)) : "",
});
const first = recordHandIn([], handIn("sig1"), "2026-10-28T09:00:00Z");
assert.equal(first.inserted, true);
assert.deepEqual(first.records[0].courses, ["math"]);
assert.equal(recordHandIn(first.records, handIn("sig1"), "2026-10-28T10:00:00Z").inserted, false);
const reviewed = reviewHandIn(first.records, first.records[0].id, "reviewed", "2026-10-28T11:00:00Z", "Good work");
assert.equal(reviewed[0].status, "reviewed");
assert.equal(first.records[0].status, "pending");
const second = recordHandIn(reviewed, handIn("sig2"), "2026-10-28T12:00:00Z").records;
assert.equal(latestSubmissions(second, "c1")[0].status, "pending");
assert.equal(second.find(x => x.id === reviewed[0].id)?.status, "reviewed");
assert.throws(() => reviewHandIn(second, "unknown", "reviewed", "2026-10-28T12:00:00Z"), /not found/);
assert.throws(() => recordHandIn([], handIn(""), "2026-10-28T12:00:00Z"), /verified/);
console.log("classroom submission history tests passed");

// UTC ordering is by instants, with deterministic ties independent of arrival order.
const offset = recordHandIn([], handIn("offset"), "2026-10-28T10:00:00+02:00").records;
const later = recordHandIn(offset, handIn("later"), "2026-10-28T09:00:00Z").records;
assert.equal(latestSubmissions(later, "c1")[0].snapshot.mac, handIn("later").mac);
assert.equal(offset[0].receivedAt, "2026-10-28T08:00:00.000Z");
const tieA = recordHandIn(recordHandIn([], handIn("a"), "2026-10-28T09:00:00Z").records, handIn("b"), "2026-10-28T09:00:00Z").records;
const tieB = recordHandIn(recordHandIn([], handIn("b"), "2026-10-28T09:00:00Z").records, handIn("a"), "2026-10-28T09:00:00Z").records;
assert.deepEqual(tieA, tieB);
assert.throws(() => recordHandIn([], handIn("a"), "2026-10-28"), /timestamp/);
assert.throws(() => reviewHandIn(first.records, first.records[0].id, "pending" as never, "2026-10-28T12:00:00Z"), /decision/);

// A genuine HMAC only establishes origin/integrity, not trusted structure.
const { stableJson } = await import("../src/lib/classroom.ts");
const key = await crypto.subtle.importKey("raw", new TextEncoder().encode("x".repeat(32)), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
async function sign(body: Record<string, unknown>) {
  const { mac: _mac, ...content } = body;
  const signature = new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(stableJson(content))));
  return { ...content, mac: btoa(String.fromCharCode(...signature)) };
}
for (const broken of [
  { courses: "math" }, { courses: [2] }, { studentName: null },
  { progress: { attempts: "garbage", lessonsDone: {}, drills: {} } },
  { progress: { attempts: [null], lessonsDone: {}, drills: {} } },
  { progress: { attempts: [], lessonsDone: [], drills: {} } },
  { progress: { attempts: [], lessonsDone: {}, drills: { math: { attempts: -1, correct: 2 } } } },
  { files: { item: { mime: "image/png", data: 2 } } },
]) {
  const signed = await sign({ ...handIn("ignored"), ...broken });
  const { mac, ...body } = signed;
  assert(await crypto.subtle.verify("HMAC", key, Uint8Array.from(atob(mac), c => c.charCodeAt(0)), new TextEncoder().encode(stableJson(body))), "malformed fixture has genuine HMAC");
  assert.throws(() => recordHandIn([], signed as unknown as HandIn, "2026-10-28T09:00:00Z"), /hand-in/);
}

const { SUBMISSION_LIMITS, parseSubmissionHistory, serializeSubmissionHistory } = await import("../src/lib/submissionHistory.ts");
const original = handIn("evidence"); original.created = "2026-10-28T08:00:00Z";
const evidence = recordHandIn([], original, "2026-10-28T09:00:00Z").records;
original.courses.push("changed");
assert.equal(evidence[0].snapshot.created, "2026-10-28T08:00:00Z", "never normalize signed evidence");
assert.deepEqual(evidence[0].snapshot.courses, ["math"], "retain exact signed courses");
assert.throws(() => evidence[0].snapshot.courses.push("mutated"), TypeError);
const decision = reviewHandIn(evidence, evidence[0].id, "reviewed", "2026-10-28T11:00:00Z", " Good work ", "event1");
const revision = reviewHandIn(decision, evidence[0].id, "needs_revision", "2026-10-28T12:00:00Z", "Recheck", "event2");
assert.equal(revision[0].reviewEvents.length, 2);
assert.equal(revision[0].reviewEvents[0].note, "Good work");
assert.equal(decision[0].reviewEvents.length, 1);
assert.deepEqual(reviewHandIn(revision, evidence[0].id, "needs_revision", "2026-10-28T12:00:00Z", "Recheck", "event2"), revision);
assert.throws(() => reviewHandIn(revision, evidence[0].id, "reviewed", "2026-10-28T12:00:00Z", "Changed", "event2"), /different/);
assert.deepEqual(parseSubmissionHistory(JSON.parse(serializeSubmissionHistory(revision))), revision);
assert.throws(() => parseSubmissionHistory([{ ...revision[0], attemptCount: 999 }]), /summary/);
assert.throws(() => parseSubmissionHistory([{ ...revision[0], status: "pending" }]), /status/);
assert.throws(() => parseSubmissionHistory([{ ...revision[0], snapshot: undefined }]), /JSON/);
assert.throws(() => recordHandIn([], { ...handIn("large"), courses: Array(SUBMISSION_LIMITS.courses + 1).fill("math") }, "2026-10-28T09:00:00Z"), /courses/);
assert.throws(() => recordHandIn([], { ...handIn("bad"), extra: JSON.parse('{"__proto__":{"polluted":true}}') } as never, "2026-10-28T09:00:00Z"), /Unsafe/);
const circular = handIn("cycle") as HandIn & { self?: unknown }; circular.self = circular;
assert.throws(() => recordHandIn([], circular, "2026-10-28T09:00:00Z"), /cycles/);
// Exercise bounded rejection without allocating hundreds of megabytes.
const beforeBudget = SUBMISSION_LIMITS.historyBytes;
SUBMISSION_LIMITS.historyBytes = 10;
try { assert.throws(() => recordHandIn([], handIn("budget"), "2026-10-28T09:00:00Z"), /storage limit/); }
finally { SUBMISSION_LIMITS.historyBytes = beforeBudget; }
const beforeEvents = SUBMISSION_LIMITS.events; SUBMISSION_LIMITS.events = 1;
try { assert.throws(() => reviewHandIn(decision, evidence[0].id, "reviewed", "2026-10-28T12:00:00Z", "", "event3"), /review history/); }
finally { SUBMISSION_LIMITS.events = beforeEvents; }
console.log("classroom history: signed malformed inputs, UTC/ties, immutable evidence, append-only review events, retries and budgets passed");

assert.throws(() => recordHandIn(evidence, { ...evidence[0].snapshot, studentName: "Changed" }, "2026-10-28T12:00:00Z"), /Conflicting/);
assert.throws(() => recordHandIn([], handIn("date"), "2026-02-30T09:00:00Z"), /calendar/);

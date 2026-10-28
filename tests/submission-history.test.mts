import { strict as assert } from "node:assert";
import { recordHandIn, reviewHandIn, latestSubmissions } from "../src/lib/submissionHistory.ts";
import type { HandIn } from "../src/lib/classroom.ts";

const handIn = (mac: string, studentId = "s1"): HandIn => ({
  format: "erudior-handin", version: 1, classId: "c1", className: "Class",
  studentId, studentName: studentId, created: "2026-10-28T08:00:00Z",
  courses: ["math", "math"], progress: { attempts: [], lessonsDone: {}, drills: {} }, mac,
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

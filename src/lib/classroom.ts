// Classroom mode, for students on their own devices: the teacher exports a class file
// (class, roster, assignments); a student's Erudior opens it, picks their name, and later saves
// a hand-in file with their work on the assigned courses; the teacher imports hand-ins.
//
// Files carry an HMAC made with the class's secret, so a hand-in can't be for another class
// and a damaged or hand-edited file is refused. The secret travels inside the class file, so this
// stops mix-ups and casual edits, not a determined student; the teacher stays the judge.

import type { ClassInfo, Family } from "./family";
import type { Attempt, Progress } from "./types";
import { loadState, saveState } from "./storage";
import { mergeStudentWork, workFileIds, workForCourses } from "./work";
import { mergeSpreadsheetSubmissions, spreadsheetSubmissionsForCourses, type SpreadsheetSubmissionMap } from "./spreadsheetEvidence";
import { mergeAssessedWorkSubmissions, assessedWorkSubmissionsForCourses, type AssessedWorkSubmissionMap } from "./assessedWorkEvidence";

export interface ClassFile {
  format: "erudior-class";
  version: 1;
  classId: string;
  name: string;
  teacher: string;
  school: string;
  secret: string;
  students: { id: string; name: string }[];
  assignments: { courseId: string; title: string; due?: string }[];
  exported: string;
}

export interface HandIn {
  format: "erudior-handin";
  version: 1;
  classId: string;
  className: string;
  studentId: string;
  studentName: string;
  created: string;
  courses: string[];
  progress: Pick<Progress, "attempts" | "lessonsDone" | "modulesDone" | "drills" | "work" | "logs"> & { spreadsheetSubmissions?: SpreadsheetSubmissionMap; assessedWorkSubmissions?: AssessedWorkSubmissionMap };
  /** Photos and files attached to writing, labs and activity logs, by file id. */
  files?: Record<string, { mime: string; data: string }>;
  mac: string;
}

// HMAC authenticates bytes, not their schema, ownership or academic authority.
export const HANDIN_LIMITS = { bytes: 64 * 1024 * 1024, courses: 500, entries: 20000, text: 500000, files: 200, fileBytes: 15 * 1024 * 1024 };
const bad = (at: string): never => { throw new Error(`Invalid hand-in: ${at}.`); };
const object = (v: unknown, at: string): Record<string, any> => {
  if (!v || typeof v !== "object" || Array.isArray(v) || ![Object.prototype, null].includes(Object.getPrototypeOf(v))) bad(at);
  const o = v as Record<string, any>;
  if (Object.keys(o).some(k => ["__proto__", "prototype", "constructor"].includes(k))) bad(at + " unsafe key");
  return o;
};
const keys = (v: Record<string, any>, allowed: string[], at: string) => { if (Object.keys(v).some(k => !allowed.includes(k))) bad(at + " unsupported field"); };
const text = (v: unknown, at: string, max = HANDIN_LIMITS.text) => { if (typeof v !== "string" || v.length > max) bad(at); };
const id = (v: unknown, at: string) => { if (typeof v !== "string" || !/^[A-Za-z0-9_-]{1,200}$/.test(v) || ["__proto__", "prototype", "constructor"].includes(v)) bad(at); };
const number = (v: unknown, at: string, max = 1e9, integer = true) => { if (typeof v !== "number" || !Number.isFinite(v) || v < 0 || v > max || (integer && !Number.isSafeInteger(v))) bad(at); };
const date = (v: unknown, at: string) => { if (typeof v !== "string" || !/^\d{4}-\d\d-\d\d(?:T\d\d:\d\d:\d\d(?:\.\d{1,3})?Z)?$/.test(v) || !Number.isFinite(Date.parse(v)) || new Date(v).toISOString().slice(0, 10) !== v.slice(0, 10)) bad(at); };
const list = (v: unknown, at: string, max = HANDIN_LIMITS.entries): any[] => { if (!Array.isArray(v) || v.length > max) bad(at); return v as any[]; };
const entries = (v: unknown, at: string) => { const o = object(v, at); if (Object.keys(o).length > HANDIN_LIMITS.entries) bad(at + " too many entries"); return Object.entries(o); };
const optional = (o: Record<string, any>, k: string, check: (v: any, at: string) => void, at: string) => { if (o[k] !== undefined) check(o[k], `${at}.${k}`); };
function scope(k: string, courses: string[], sep = "/") {
  // Course IDs can contain underscores, including '__': require an exact prefix
  // and nonempty local ID, with all candidate matches belonging to this scope.
  const course = courses.find(c => k.startsWith(c + sep) && k.length > c.length + sep.length);
  if (!course) return bad("unassigned course data");
  id(k.slice(course.length + sep.length), "local item ID");
  return course;
}
function courseList(raw: unknown): string[] {
  const courses = list(raw, "courses", HANDIN_LIMITS.courses);
  courses.forEach(c => id(c, "course ID"));
  if (new Set(courses).size !== courses.length) bad("duplicate courses");
  return courses;
}
function fileRef(raw: unknown, at: string) {
  const f = object(raw, at); keys(f, ["id", "fileId", "name", "mime", "bytes", "caption", "date"], at);
  id(f.id, at); if (typeof f.fileId !== "string" || !/^[a-z0-9]{1,64}$/.test(f.fileId)) bad(at + " file ID");
  text(f.name, at, 1000); text(f.caption, at, 10000); mime(f.mime, at); number(f.bytes, at, HANDIN_LIMITS.fileBytes); date(f.date, at);
}
function mime(v: unknown, at: string) { if (typeof v !== "string" || !/^[a-zA-Z0-9!#$&^_.+-]+\/[a-zA-Z0-9!#$&^_.+-]+$/.test(v) || v.length > 200) bad(at + " MIME type"); }

/** Validate without normalizing/discarding content; safe for independently used merge APIs. */
export function validateHandInProgress(raw: unknown, allowedCourses: string[]): asserts raw is HandIn["progress"] {
  const courses = courseList(allowedCourses), p = object(raw, "progress");
  keys(p, ["attempts", "lessonsDone", "modulesDone", "drills", "work", "logs", "spreadsheetSubmissions", "assessedWorkSubmissions"], "progress");
  if (p.spreadsheetSubmissions !== undefined) {
    const submissions = mergeSpreadsheetSubmissions({}, p.spreadsheetSubmissions);
    if (Object.values(submissions).some(item => !courses.includes(item.courseId))) bad("unassigned spreadsheet course");
  }
  if (p.assessedWorkSubmissions !== undefined) {
    const submissions = mergeAssessedWorkSubmissions({}, p.assessedWorkSubmissions);
    if (Object.values(submissions).some(item => !courses.includes(item.courseId))) bad("unassigned assessed-work course");
  }
  const seen = new Set<string>();
  for (const rawAttempt of list(p.attempts, "attempts")) {
    const a = object(rawAttempt, "attempt");
    keys(a, ["id", "bankId", "bankTitle", "mode", "startedAt", "finishedAt", "durationSec", "timeLimitSec", "total", "answered", "correct", "passingPercent", "sectionPassing", "lesson", "module", "kind", "byTopic", "bySection", "answers", "intervention"], "attempt");
    id(a.id, "attempt ID"); if (seen.has(a.id)) bad("duplicate attempt ID"); seen.add(a.id);
    text(a.bankId, "bank ID", 402); const course = scope(a.bankId, courses, "__"); text(a.bankTitle, "bank title", 2000);
    if (!["exam", "practice"].includes(a.mode)) bad("attempt mode");
    date(a.startedAt, "attempt start"); date(a.finishedAt, "attempt finish"); if (a.finishedAt < a.startedAt) bad("attempt chronology");
    for (const k of ["durationSec", "total", "answered", "correct"]) number(a[k], k);
    if (a.correct > a.answered || a.answered > a.total) bad("attempt score bounds");
    optional(a, "timeLimitSec", number, "attempt"); optional(a, "passingPercent", (v, at) => number(v, at, 100, false), "attempt");
    if (a.kind !== undefined && !["pretest", "weekly"].includes(a.kind)) bad("attempt kind");
    for (const k of ["lesson", "module"]) if (a[k] !== undefined) {
      const r = object(a[k], k); keys(r, ["courseId", k + "Id"], k); if (r.courseId !== course) bad("attempt course reference"); id(r[k + "Id"], k);
    }
    for (const k of ["byTopic", "bySection"]) for (const [name, rawTally] of entries(a[k], k)) {
      text(name, k, 2000); const t = object(rawTally, k); keys(t, ["total", "correct"], k); number(t.total, k); number(t.correct, k); if (t.correct > t.total) bad(k + " score bounds");
    }
    if (a.sectionPassing !== undefined) for (const [name, value] of entries(a.sectionPassing, "sectionPassing")) { text(name, "section", 2000); number(value, "section pass", 100, false); }
    if (a.intervention !== undefined) { const i = object(a.intervention, "intervention"); keys(i, ["skillId", "baseline"], "intervention"); if (typeof i.skillId !== "string" || !/^[A-Za-z0-9_.-]{1,200}$/.test(i.skillId)) bad("skill ID"); if (i.baseline !== null) number(i.baseline, "baseline", 1, false); }
    const answerIds = new Set();
    for (const rawAnswer of list(a.answers, "answers")) {
      const r = object(rawAnswer, "answer"); keys(r, ["qid", "chosen", "correct", "flagged", "confidence"], "answer"); id(r.qid, "question ID");
      if (answerIds.has(r.qid)) bad("duplicate answer ID"); answerIds.add(r.qid);
      if (typeof r.correct !== "boolean" || (r.flagged !== undefined && typeof r.flagged !== "boolean")) bad("answer boolean");
      if (r.confidence !== undefined && !["sure", "unsure", "guess"].includes(r.confidence)) bad("confidence");
      for (const v of list(r.chosen, "chosen", 2000)) if (typeof v === "string") text(v, "chosen"); else if (typeof v !== "number" || !Number.isFinite(v) || v < -1 || v > 1e9) bad("chosen");
    }
  }
  for (const k of ["lessonsDone", "modulesDone"]) if (p[k] !== undefined) for (const [key, value] of entries(p[k], k)) { scope(key, courses); date(value, k); }
  if (!p.lessonsDone) bad("lessonsDone");
  if (p.drills !== undefined) for (const [key, rawDrill] of entries(p.drills, "drills")) {
    scope(key, courses); const d = object(rawDrill, "drill"); keys(d, ["attempts", "correct"], "drill"); number(d.attempts, "drill attempts"); number(d.correct, "drill correct"); if (d.correct > d.attempts) bad("drill score bounds");
  }
  if (p.work !== undefined) for (const [key, rawWork] of entries(p.work, "work")) {
    scope(key, courses); const w = object(rawWork, "work");
    keys(w, ["kind", "started", "updated", "text", "have", "done", "tables", "answers", "photos", "self", "submitted", "rounds"], "work");
    if (!["writing", "lab"].includes(w.kind)) bad("work kind"); date(w.started, "work start"); date(w.updated, "work update"); if (w.updated < w.started) bad("work chronology");
    optional(w, "submitted", date, "work"); optional(w, "text", text, "work"); optional(w, "rounds", number, "work");
    for (const k of ["have", "done"]) if (w[k] !== undefined) for (const v of list(w[k], k, 2000)) number(v, k, 10000);
    if (w.tables !== undefined) for (const [key, rows] of entries(w.tables, "tables")) { id(key, "table ID"); for (const row of list(rows, "rows", 2000)) for (const cell of list(row, "row", 200)) text(cell, "table cell", 10000); }
    if (w.answers !== undefined) for (const [key, value] of entries(w.answers, "work answers")) { id(key, "answer ID"); text(value, "work answer"); }
    if (w.self !== undefined) for (const [key, value] of entries(w.self, "self assessment")) { id(key, "criterion ID"); number(value, "self points", 100000, false); }
    if (w.photos !== undefined) list(w.photos, "photos", HANDIN_LIMITS.files).forEach(v => fileRef(v, "photo"));
  }
  const logs = new Set<string>();
  if (p.logs !== undefined) for (const rawLog of list(p.logs, "logs")) {
    const l = object(rawLog, "log"); keys(l, ["id", "courseId", "date", "type", "minutes", "note", "file", "credited"], "log"); id(l.id, "log ID");
    if (logs.has(l.id)) bad("duplicate log ID"); logs.add(l.id);
    if (!courses.includes(l.courseId)) bad("unassigned log course"); date(l.date, "log date"); text(l.type, "log type", 1000); number(l.minutes, "log minutes", 1440, false); text(l.note, "log note");
    optional(l, "credited", id, "log"); optional(l, "file", fileRef, "log");
  }
}

/** Parse a bounded, data-only v1 hand-in. Unknown authority-bearing fields fail closed. */
export function parseHandIn(raw: unknown): HandIn {
  // Bound depth/count before serialization: cyclic or excessively nested objects fail visibly.
  let nodes = 0, characters = 0;
  const walk = (v: unknown, depth: number, ancestors: Set<object>) => {
    if (++nodes > 1000000) bad("too many values");
    if (typeof v === "string" && (characters += v.length) > HANDIN_LIMITS.bytes) bad("file too large");
    if (depth > 16) bad("nesting");
    if (v && typeof v === "object") {
      if (ancestors.has(v)) bad("cyclic data"); ancestors.add(v);
      if (!Array.isArray(v)) object(v, "object");
      if (Object.keys(v).length > HANDIN_LIMITS.entries) bad("too many entries");
      for (const value of Object.values(v)) walk(value, depth + 1, ancestors);
      ancestors.delete(v);
    } else if (v !== undefined && v !== null && !["string", "number", "boolean"].includes(typeof v)) bad("non-JSON data");
  };
  walk(raw, 0, new Set());
  if (new TextEncoder().encode(JSON.stringify(raw) ?? "").byteLength > HANDIN_LIMITS.bytes) bad("file too large");
  const h = object(raw, "hand-in"); keys(h, ["format", "version", "classId", "className", "studentId", "studentName", "created", "courses", "progress", "files", "mac"], "hand-in");
  if (h.format !== "erudior-handin" || h.version !== 1) bad("format/version");
  id(h.classId, "class ID"); id(h.studentId, "student ID"); text(h.className, "class name", 2000); text(h.studentName, "student name", 2000); date(h.created, "created");
  if (typeof h.mac !== "string" || !/^[A-Za-z0-9+/]{43}=$/.test(h.mac)) bad("MAC");
  validateHandInProgress(h.progress, courseList(h.courses));
  const referenced = new Set(workFileIds(h.progress));
  const metadata = new Map<string, { mime: string; bytes: number }>();
  const refs = [...Object.values(h.progress.work ?? {}).flatMap((w: any) => w.photos ?? []), ...(h.progress.logs ?? []).flatMap((l: any) => l.file ? [l.file] : [])];
  for (const ref of refs) {
    const old = metadata.get(ref.fileId);
    if (old && (old.mime !== ref.mime || old.bytes !== ref.bytes)) bad("conflicting file metadata");
    metadata.set(ref.fileId, { mime: ref.mime, bytes: ref.bytes });
  }
  if (h.files !== undefined) {
    const files = entries(h.files, "files"); if (files.length > HANDIN_LIMITS.files) bad("too many files");
    for (const [key, rawFile] of files) {
      if (!referenced.has(key) || !/^[a-z0-9]{1,64}$/.test(key)) bad("unreferenced file");
      const f = object(rawFile, "file"); keys(f, ["mime", "data"], "file"); mime(f.mime, "file");
      if (typeof f.data !== "string" || f.data.length > Math.ceil(HANDIN_LIMITS.fileBytes / 3) * 4 || (f.data.length % 4 !== 0 || /[^A-Za-z0-9+/=]/.test(f.data) || !/^[^=]*={0,2}$/.test(f.data))) bad("file base64");
      const byteLength = f.data.length / 4 * 3 - (f.data.endsWith("==") ? 2 : f.data.endsWith("=") ? 1 : 0);
      if (metadata.get(key)?.mime !== f.mime || metadata.get(key)?.bytes !== byteLength) bad("attachment metadata mismatch");
    }
  }
  return structuredClone(h) as HandIn;
}
export function validateHandIn(raw: unknown): string[] {
  try { parseHandIn(raw); return []; } catch (error) { return [error instanceof Error ? error.message : "Invalid hand-in"]; }
}

// ---------- HMAC over a stable JSON form ----------

export function stableJson(v: unknown): string {
  if (Array.isArray(v)) return `[${v.map(stableJson).join(",")}]`;
  if (v && typeof v === "object")
    return `{${Object.keys(v as object)
      .filter((k) => (v as Record<string, unknown>)[k] !== undefined)
      .sort()
      .map((k) => `${JSON.stringify(k)}:${stableJson((v as Record<string, unknown>)[k])}`)
      .join(",")}}`;
  return JSON.stringify(v);
}

async function hmac(secretB64: string, text: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", Uint8Array.from(atob(secretB64), (c) => c.charCodeAt(0)), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(text)));
  return btoa(String.fromCharCode(...sig));
}

// ---------- teacher: class file ----------

export function classFile(f: Family, c: ClassInfo, title: (courseId: string) => string): ClassFile {
  return {
    format: "erudior-class",
    version: 1,
    classId: c.id,
    name: c.name,
    teacher: f.school?.administrator ?? "",
    school: f.school?.name ?? "",
    secret: c.secret,
    students: c.students.map((id) => ({ id, name: f.students.find((s) => s.id === id)?.name ?? "Student" })).sort((a, b) => a.name.localeCompare(b.name)),
    assignments: c.assignments.map((a) => ({ courseId: a.courseId, title: title(a.courseId), due: a.due })),
    exported: new Date().toISOString(),
  };
}

export function parseClassFile(raw: unknown): ClassFile {
  const c = raw as ClassFile;
  if (!c || c.format !== "erudior-class" || !c.classId || !c.secret || !Array.isArray(c.students) || !Array.isArray(c.assignments))
    throw new Error("This isn't an Erudior class file.");
  return c;
}

// ---------- student: hand-in ----------

/** The student's work on the given courses, from their progress. */
export function workFor(p: Progress, courses: string[]): HandIn["progress"] {
  const mine = (k: string, sep: string) => courses.some((c) => k.startsWith(`${c}${sep}`));
  const pick = <T,>(o: Record<string, T> | undefined) => Object.fromEntries(Object.entries(o ?? {}).filter(([k]) => mine(k, "/")));
  return {
    attempts: p.attempts.filter((a) => mine(a.bankId, "__")),
    lessonsDone: pick(p.lessonsDone),
    modulesDone: pick(p.modulesDone),
    drills: pick(p.drills),
    ...workForCourses(p, courses),
    ...(p.spreadsheetSubmissions ? { spreadsheetSubmissions: spreadsheetSubmissionsForCourses(p.spreadsheetSubmissions, courses) } : {}),
    ...(p.assessedWorkSubmissions ? { assessedWorkSubmissions: assessedWorkSubmissionsForCourses(p.assessedWorkSubmissions, courses) } : {}),
  };
}

/** Older v1 receipts may omit attachments. Surface this explicitly before review;
 * it is not a reason to fabricate missing evidence or trust a local same-ID file. */
export function missingHandInAttachments(handIn: Pick<HandIn, "progress" | "files">): string[] {
  return workFileIds(handIn.progress).filter(id => !Object.prototype.hasOwnProperty.call(handIn.files ?? {}, id));
}

/** `loadFile` reads a stored photo or file (documents.ts) so it travels with the work.
 * Legacy callers may omit attachments; user-facing exports requireAttachments. */
export async function makeHandIn(
  c: ClassFile,
  studentId: string,
  p: Progress,
  loadFile?: (fileId: string) => Promise<{ mime: string; data: string } | null>,
  options: { requireAttachments?: boolean } = {},
): Promise<HandIn> {
  const student = c.students.find((s) => s.id === studentId);
  if (!student) throw new Error("Pick your name in the class first.");
  const courses = c.assignments.map((a) => a.courseId);
  const progress = structuredClone(workFor(p, courses));
  validateHandInProgress(progress, courses);
  const files: NonNullable<HandIn["files"]> = {};
  const required = workFileIds(progress);
  if (options.requireAttachments && required.length && !loadFile) throw Error("Attachment storage is unavailable; the hand-in was not exported.");
  if (loadFile)
    for (const id of required) {
      // In strict mode, storage errors and learner-switch cancellation must not
      // be swallowed. Legacy generation retains its documented optional files.
      const f = options.requireAttachments ? await loadFile(id) : await loadFile(id).catch(() => null);
      if (f) files[id] = f;
      else if (options.requireAttachments) throw Error(`Attachment ${id} is missing; restore it before exporting this hand-in.`);
    }
  const body = {
    format: "erudior-handin" as const,
    version: 1 as const,
    classId: c.classId,
    className: c.name,
    studentId,
    studentName: student.name,
    created: new Date().toISOString(),
    courses,
    progress,
    ...(Object.keys(files).length ? { files } : {}),
  };
  return parseHandIn({ ...body, mac: await hmac(c.secret, stableJson(body)) });
}

/** Check a hand-in against the teacher's classes. Returns the class it belongs to. */
export async function verifyHandIn(raw: unknown, f: Family): Promise<{ h: HandIn; cls: ClassInfo }> {
  const h = parseHandIn(raw);
  const cls = (f.classes ?? []).find((c) => c.id === h.classId);
  if (!cls) throw new Error(`This hand-in is for a class that isn't on this computer (${h.className}).`);
  if (!f.students.some(student => student.id === h.studentId)) throw new Error("This student profile no longer exists in the teacher household or classroom.");
  if (!cls.students.includes(h.studentId)) throw new Error(`${h.studentName} isn't on the roster of ${cls.name}.`);
  if (h.courses.some(id => !cls.assignments.some(a => a.courseId === id))) throw new Error("This hand-in contains a course not assigned in this class.");
  const { mac, ...body } = h;
  if ((await hmac(cls.secret, stableJson(body))) !== mac) throw new Error("This hand-in was changed after it was saved, or it's for an older copy of the class. Ask the student to save it again.");
  return { h, cls };
}

/** Add a hand-in's work to the teacher's copy of the student's progress (nothing is lost). */
export function mergeWork(p: Progress, w: HandIn["progress"], courses: string[]): Progress {
  validateHandInProgress(w, courses);
  w = structuredClone(w);
  const prior = new Map(p.attempts.map(a => [a.id, a]));
  for (const a of w.attempts) if (prior.has(a.id) && stableJson(prior.get(a.id)) !== stableJson(a)) bad("conflicting attempt ID");
  for (const [key, value] of Object.entries(w.work ?? {})) {
    const old = p.work?.[key];
    if (old && old.updated === value.updated && stableJson(old) !== stableJson(value)) bad("conflicting work revision");
  }
  const oldLogs = new Map((p.logs ?? []).map(l => [l.id, l]));
  for (const log of w.logs ?? []) if (oldLogs.has(log.id) && stableJson(oldLogs.get(log.id)) !== stableJson(log)) bad("conflicting log ID");
  const seen = new Set(p.attempts.map((a) => a.id));
  const attempts: Attempt[] = [...p.attempts, ...w.attempts.filter((a) => !seen.has(a.id))].sort((a, b) => b.finishedAt.localeCompare(a.finishedAt));
  const earliest = (a: Record<string, string> = {}, b: Record<string, string> = {}) => {
    const out = { ...a };
    for (const [k, v] of Object.entries(b)) if (!out[k] || v < out[k]) out[k] = v;
    return out;
  };
  const drills = { ...p.drills };
  for (const [k, v] of Object.entries(w.drills ?? {})) if (!drills[k] || v.attempts > drills[k].attempts) drills[k] = v;
  const enrolled = [...new Set([...(p.enrolled ?? []), ...courses])];
  const spreadsheetSubmissions = mergeSpreadsheetSubmissions(p.spreadsheetSubmissions ?? {}, w.spreadsheetSubmissions ?? {});
  const assessedWorkSubmissions = mergeAssessedWorkSubmissions(p.assessedWorkSubmissions ?? {}, w.assessedWorkSubmissions ?? {});
  return { ...mergeStudentWork(p, w), ...(Object.keys(assessedWorkSubmissions).length ? { assessedWorkSubmissions } : {}), ...(Object.keys(spreadsheetSubmissions).length ? { spreadsheetSubmissions } : {}), attempts, lessonsDone: earliest(p.lessonsDone, w.lessonsDone), modulesDone: earliest(p.modulesDone, w.modulesDone), drills, enrolled };
}

// ---------- student device: joined classes ----------

export interface Joined {
  cls: ClassFile;
  studentId: string;
}

export async function loadJoined(): Promise<Joined[]> {
  try {
    return (JSON.parse((await loadState("classes")) ?? "[]") as Joined[]).filter((j) => j?.cls?.format === "erudior-class");
  } catch {
    return [];
  }
}

export async function saveJoined(list: Joined[]): Promise<void> {
  await saveState("classes", list.length ? JSON.stringify(list) : null);
}

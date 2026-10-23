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
  progress: Pick<Progress, "attempts" | "lessonsDone" | "modulesDone" | "drills">;
  mac: string;
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
  };
}

export async function makeHandIn(c: ClassFile, studentId: string, p: Progress): Promise<HandIn> {
  const student = c.students.find((s) => s.id === studentId);
  if (!student) throw new Error("Pick your name in the class first.");
  const courses = c.assignments.map((a) => a.courseId);
  const body = {
    format: "erudior-handin" as const,
    version: 1 as const,
    classId: c.classId,
    className: c.name,
    studentId,
    studentName: student.name,
    created: new Date().toISOString(),
    courses,
    progress: workFor(p, courses),
  };
  return { ...body, mac: await hmac(c.secret, stableJson(body)) };
}

/** Check a hand-in against the teacher's classes. Returns the class it belongs to. */
export async function verifyHandIn(raw: unknown, f: Family): Promise<{ h: HandIn; cls: ClassInfo }> {
  const h = raw as HandIn;
  if (!h || h.format !== "erudior-handin" || !h.mac || !h.progress) throw new Error("This isn't an Erudior hand-in file.");
  const cls = (f.classes ?? []).find((c) => c.id === h.classId);
  if (!cls) throw new Error(`This hand-in is for a class that isn't on this computer (${h.className}).`);
  if (!cls.students.includes(h.studentId)) throw new Error(`${h.studentName} isn't on the roster of ${cls.name}.`);
  const { mac, ...body } = h;
  if ((await hmac(cls.secret, stableJson(body))) !== mac) throw new Error("This hand-in was changed after it was saved, or it's for an older copy of the class. Ask the student to save it again.");
  return { h, cls };
}

/** Add a hand-in's work to the teacher's copy of the student's progress (nothing is lost). */
export function mergeWork(p: Progress, w: HandIn["progress"], courses: string[]): Progress {
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
  return { ...p, attempts, lessonsDone: earliest(p.lessonsDone, w.lessonsDone), modulesDone: earliest(p.modulesDone, w.modulesDone), drills, enrolled };
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

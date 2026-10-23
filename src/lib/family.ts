// Homeschool family: state and school year, the parent's password (and optional PIN), and the
// students. Stored in family.json next to the courses; each student's progress and records are
// separate files (see storage.ts). Everything stays on this computer.

import { inApp, loadBaseProgress, loadState, saveState, loadSessionState } from "./storage";
import { uid } from "./util";
import { DEFAULT_WEIGHTS, MIN_CUTOFFS, type Cutoffs, type Weights } from "./grades";

/** Homeschool features are for the desktop app (VITE_HOMESCHOOL=1 turns them on in a browser for testing). */
export const HOMESCHOOL = inApp || import.meta.env?.VITE_HOMESCHOOL === "1";

export const SUBJECTS = [
  "Math",
  "English language arts",
  "Science",
  "Social studies",
  "World languages",
  "Arts",
  "Health and PE",
  "Other",
] as const;

export const GRADES = ["K", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
export const gradeLabel = (g: number) => (g === 0 ? "Kindergarten" : `Grade ${g}`);

export interface Assignment {
  /** Catalog id (or a course id from the library). */
  courseId: string;
  subject: string;
}

export interface Student {
  id: string;
  name: string;
  /** K = 0 … 12. Moves up with "Start a new school year". */
  grade: number;
  /** Courses the parent chose, in order. In each subject the first unfinished one is current. */
  assigned: Assignment[];
  /** May the student start courses that aren't assigned? */
  freeChoice: boolean;
  /** Optional, printed on the transcript. YYYY-MM-DD. */
  birthDate?: string;
  /** Expected or actual graduation date, for the transcript. YYYY-MM-DD. */
  graduation?: string;
}

export interface Secret {
  salt: string;
  hash: string;
  iterations: number;
}

export interface CustomReminder {
  id: string;
  /** YYYY-MM-DD */
  date: string;
  text: string;
}

/** A class in Classroom mode. Students can be in several classes. */
export interface ClassInfo {
  id: string;
  name: string;
  /** Shared with students' own devices in the class file; checks hand-in files. Base64, 32 bytes. */
  secret: string;
  students: string[];
  assignments: ClassAssignment[];
  /** May students start courses that aren't assigned? */
  freeChoice: boolean;
  /** Last hand-in imported per student (ISO time of the file). */
  handins: Record<string, string>;
}

export interface ClassAssignment {
  courseId: string;
  /** YYYY-MM-DD, optional. */
  due?: string;
  /** YYYY-MM-DD it was assigned. */
  assigned: string;
}

export interface Family {
  format: "examiner-family";
  version: 1;
  /** Homeschool (the default) or Classroom (a teacher's computer). */
  mode?: "homeschool" | "classroom";
  /** Classroom mode: the teacher's classes. */
  classes?: ClassInfo[];
  /** Two-letter code from the state rules file. */
  state: string;
  /** "Home education law" or another route from the state's rules. */
  route: string;
  year: { start: string; end: string };
  /** A day with at least this much learning is proposed as a school day. */
  dailyMinutes: number;
  parent: {
    password: Secret;
    pin?: Secret;
    recovery: Secret;
    failures?: number;
    lockedUntil?: number;
  };
  students: Student[];
  reminders: CustomReminder[];
  /** Reminder keys the parent marked done. */
  done: string[];
  /** Printed on reports. */
  school?: { name: string; administrator: string; address: string };
  /** Letter-grade cutoffs (never looser than MIN_CUTOFFS) and how course percents are weighted. */
  grading?: { cutoffs: Cutoffs; weights: Weights };
}

export const isClassroom = (f: Family | null | undefined) => f?.mode === "classroom";
/** "Parent" or "Teacher", for labels. */
export const adultLabel = (f: Family | null | undefined) => (isClassroom(f) ? "Teacher" : "Parent");
export const classesOf = (f: Family, studentId: string) => (f.classes ?? []).filter((c) => c.students.includes(studentId));

export function newClass(name: string, studentIds: string[] = []): ClassInfo {
  const secret = crypto.getRandomValues(new Uint8Array(32));
  return {
    id: uid("c").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 16),
    name: name.trim(),
    secret: btoa(String.fromCharCode(...secret)),
    students: studentIds,
    assignments: [],
    freeChoice: false,
    handins: {},
  };
}

export const gradingOf = (f: Family) => ({ cutoffs: f.grading?.cutoffs ?? MIN_CUTOFFS, weights: f.grading?.weights ?? DEFAULT_WEIGHTS });

// ---------- storage ----------

export async function loadFamily(): Promise<Family | null> {
  const text = await loadState("family");
  if (!text) return null;
  const f = JSON.parse(text) as Family;
  if (f.format !== "examiner-family") throw new Error("family.json isn't an Erudior family file.");
  return { ...f, reminders: f.reminders ?? [], done: f.done ?? [] };
}

export async function saveFamily(f: Family): Promise<void> {
  await saveState("family", JSON.stringify(f));
}

export function newStudent(name: string, grade: number): Student {
  return { id: uid().toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 16) || "s" + Date.now(), name: name.trim(), grade, assigned: [], freeChoice: true };
}

/**
 * Create the family. The first student takes over the progress and unfinished session that were
 * already on this computer (the old files stay as they were, as a fallback).
 */
export async function createFamily(input: {
  mode?: "homeschool" | "classroom";
  /** Classroom: the first class's name (all students go in it). */
  className?: string;
  school?: { name: string; administrator: string; address: string };
  state: string;
  route: string;
  year: { start: string; end: string };
  dailyMinutes: number;
  password: string;
  pin?: string;
  students: { name: string; grade: number }[];
}): Promise<{ family: Family; recoveryCode: string }> {
  const students = input.students.map((s) => newStudent(s.name, s.grade));
  if (!students.length) throw new Error("Add at least one student.");
  const recoveryCode = makeRecoveryCode();
  const classroom = input.mode === "classroom";
  const family: Family = {
    format: "examiner-family",
    version: 1,
    ...(classroom ? { mode: "classroom" as const, classes: [newClass(input.className || "My class", students.map((s) => s.id))] } : {}),
    ...(input.school ? { school: input.school } : {}),
    state: input.state,
    route: input.route,
    year: input.year,
    dailyMinutes: input.dailyMinutes,
    parent: {
      password: await makeSecret(input.password),
      pin: input.pin ? await makeSecret(input.pin) : undefined,
      recovery: await makeSecret(normalizeRecovery(recoveryCode)),
    },
    students,
    reminders: [],
    done: [],
  };
  if (classroom) {
    // Students start fresh; whatever was on this computer stays as the teacher's own progress file.
    for (const st of students) await saveState(`progress-${st.id}`, JSON.stringify({ catalogV1: true, enrolled: [] }));
    await saveFamily(family);
    return { family, recoveryCode };
  }
  const first = students[0].id;
  const existing = await loadBaseProgress();
  await saveState(`progress-${first}`, JSON.stringify(existing));
  const session = await loadSessionState();
  if (session) await saveState(`session-${first}`, session);
  await saveFamily(family);
  return { family, recoveryCode };
}

// ---------- parent password / PIN ----------

const ITERATIONS = 310_000;
const enc = new TextEncoder();

function toB64(bytes: Uint8Array): string {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s);
}

function fromB64(s: string): Uint8Array {
  return Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
}

async function derive(secret: string, salt: Uint8Array, iterations: number): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret.normalize("NFC")), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: salt as BufferSource, iterations }, key, 256);
  return new Uint8Array(bits);
}

export async function makeSecret(secret: string, iterations = ITERATIONS): Promise<Secret> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  return { salt: toB64(salt), hash: toB64(await derive(secret, salt, iterations)), iterations };
}

export async function checkSecret(secret: string, s: Secret): Promise<boolean> {
  const got = await derive(secret, fromB64(s.salt), s.iterations);
  const want = fromB64(s.hash);
  if (got.length !== want.length) return false;
  let diff = 0;
  for (let i = 0; i < got.length; i++) diff |= got[i] ^ want[i];
  return diff === 0;
}

export const passwordProblem = (pw: string): string | null =>
  pw.length < 8 ? "Use at least 8 characters." : null;

export const pinProblem = (pin: string): string | null =>
  /^\d{4,8}$/.test(pin) ? null : "A PIN is 4 to 8 digits.";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function makeRecoveryCode(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  const chars = Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
  return chars.match(/.{4}/g)!.join("-");
}
const normalizeRecovery = (code: string) => code.toUpperCase().replace(/[^A-Z0-9]/g, "");

/** Wrong tries before the lock starts; then it doubles from 1 minute, up to an hour. */
const FREE_TRIES = 5;

export function lockedFor(f: Family, now = Date.now()): number {
  return Math.max(0, (f.parent.lockedUntil ?? 0) - now);
}

/**
 * Check the parent's password or PIN. Returns the updated family (failure count) and whether it
 * matched. Wrong answers past FREE_TRIES lock sign-in for a while.
 */
export async function unlockParent(f: Family, kind: "password" | "pin", value: string, now = Date.now()): Promise<{ ok: boolean; family: Family }> {
  if (lockedFor(f, now) > 0) return { ok: false, family: f };
  const secret = kind === "pin" ? f.parent.pin : f.parent.password;
  const ok = !!secret && (await checkSecret(value, secret));
  if (ok) return { ok, family: { ...f, parent: { ...f.parent, failures: 0, lockedUntil: undefined } } };
  const failures = (f.parent.failures ?? 0) + 1;
  const over = failures - FREE_TRIES;
  const lockedUntil = over >= 0 ? now + Math.min(60, 2 ** over) * 60_000 : undefined;
  return { ok, family: { ...f, parent: { ...f.parent, failures, lockedUntil } } };
}

/** Reset the password with the recovery code shown at setup. Returns a new recovery code too. */
export async function resetWithRecovery(f: Family, code: string, newPassword: string): Promise<{ family: Family; recoveryCode: string } | null> {
  if (!(await checkSecret(normalizeRecovery(code), f.parent.recovery))) return null;
  const recoveryCode = makeRecoveryCode();
  return {
    recoveryCode,
    family: {
      ...f,
      parent: {
        password: await makeSecret(newPassword),
        pin: undefined,
        recovery: await makeSecret(normalizeRecovery(recoveryCode)),
      },
    },
  };
}

// ---------- school year ----------

/** A school year from Aug 1 to Jul 31 containing `day` (YYYY-MM-DD). */
export function defaultYear(day: string): { start: string; end: string } {
  const [y, m] = day.split("-").map(Number);
  const startYear = m >= 8 ? y : y - 1;
  return { start: `${startYear}-08-01`, end: `${startYear + 1}-07-31` };
}

/** Courses a student is currently on: per subject, the first assignment not yet finished. */
export function currentAssignments(s: Student, isDone: (courseId: string) => boolean): Set<string> {
  const current = new Set<string>();
  const seen = new Set<string>();
  for (const a of s.assigned) {
    if (seen.has(a.subject)) continue;
    if (!isDone(a.courseId)) {
      current.add(a.courseId);
      seen.add(a.subject);
    }
  }
  return current;
}

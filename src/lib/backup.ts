import { assertCourseImportPreservesFields } from "./courseImport";
import { courseFromCanonicalAuthoring } from "./canonicalAuthoring";
// Encrypted family backup: everything on this computer (family settings, every student's
// progress and records, courses, banks) in one file, encrypted with AES-256-GCM under a key
// derived from a passphrase (PBKDF2-SHA-256). Restoring needs the same passphrase.

import type { Bank, Course, Progress } from "./types";
import { loadFamily, saveFamily, type Family } from "./family";
import { loadRecords, saveRecords, type Records } from "./records";
import { loadPhotos, savePhotos } from "./portfolio";
import { loadFile, putFile } from "./documents";
import type { PortfolioPhoto } from "./reports";
import * as store from "./storage";
import { workFileIds } from "./work";
import { serializeCourse, normalizeCourse } from "./course";
import { parseBank, serializeBank } from "./validate";
import { validateClassroomSubmissionState } from "./classroomSubmissionStore";
import { mergeAssessedWorkSubmissions } from "./assessedWorkEvidence";
import { validateCourseWork, validateWorkLessonReferences } from "./courseWork";
import { validateReaderTexts } from "./readerContent";
import { mergeSpreadsheetSubmissions } from "./spreadsheetEvidence";

interface Envelope {
  format: "examiner-backup-encrypted";
  version: 1;
  kdf: { name: "PBKDF2-SHA-256"; iterations: number; salt: string };
  iv: string;
  data: string;
}

interface Contents {
  format: "examiner-family-backup";
  version: 1;
  createdAt: string;
  family: Family | null;
  students: Record<string, { progress: Progress; records: Records; photos?: PortfolioPhoto[] }>;
  progress: Progress;
  courses: unknown[];
  banks: unknown[];
  /** Instructor-only receipt/review ledger, including pending import markers. */
  classroomSubmissions?: ReturnType<typeof validateClassroomSubmissionState>;
  /** Attached documents by file id. */
  files?: Record<string, { mime: string; data: string }>;
}

const ITERATIONS = 600_000;

function toB64(bytes: Uint8Array): string {
  let s = "";
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s);
}
const fromB64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

async function keyFor(passphrase: string, salt: Uint8Array, iterations: number): Promise<CryptoKey> {
  const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(passphrase.normalize("NFC")), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", hash: "SHA-256", salt: salt as BufferSource, iterations },
    base,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

export async function encryptText(text: string, passphrase: string, iterations = ITERATIONS): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await keyFor(passphrase, salt, iterations);
  const data = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(text)));
  const env: Envelope = {
    format: "examiner-backup-encrypted",
    version: 1,
    kdf: { name: "PBKDF2-SHA-256", iterations, salt: toB64(salt) },
    iv: toB64(iv),
    data: toB64(data),
  };
  return JSON.stringify(env);
}

export const isEncryptedBackup = (raw: unknown): boolean => (raw as Envelope | null)?.format === "examiner-backup-encrypted";

export async function decryptText(raw: unknown, passphrase: string): Promise<string> {
  const env = raw as Envelope;
  if (!isEncryptedBackup(env)) throw new Error("This isn't an encrypted Erudior backup.");
  const key = await keyFor(passphrase, fromB64(env.kdf.salt), env.kdf.iterations);
  try {
    const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: fromB64(env.iv) as BufferSource }, key, fromB64(env.data) as BufferSource);
    return new TextDecoder().decode(plain);
  } catch {
    throw new Error("Wrong passphrase, or the file is damaged.");
  }
}

/** Historical evidence is optional for legacy progress, but never silently repaired. */
function validateProgressEvidence(progress: Progress): Progress {
  if (progress.assessedWorkSubmissions !== undefined) mergeAssessedWorkSubmissions({}, progress.assessedWorkSubmissions);
  if (progress.spreadsheetSubmissions !== undefined) mergeSpreadsheetSubmissions({}, progress.spreadsheetSubmissions);
  return progress;
}

/** Gather everything stored on this computer. */
export async function collect(courses: Course[], banks: Bank[]): Promise<Contents> {
  const family = await loadFamily();
  const classroomText = await store.loadState("classroom-submissions");
  const classroomSubmissions = classroomText === null ? undefined : validateClassroomSubmissionState(classroomText);
  const students: Contents["students"] = {};
  for (const s of family?.students ?? []) {
    const progressText = await store.loadState(`progress-${s.id}`);
    students[s.id] = {
      progress: validateProgressEvidence(progressText ? (JSON.parse(progressText) as Progress) : store.emptyProgress()),
      records: await loadRecords(s.id),
      photos: await loadPhotos(s.id),
    };
  }
  const baseProgress = validateProgressEvidence(await store.loadBaseProgress());
  return {
    format: "examiner-family-backup",
    version: 1,
    createdAt: new Date().toISOString(),
    family,
    students,
    ...(classroomSubmissions === undefined ? {} : { classroomSubmissions }),
    progress: baseProgress,
    courses: courses.map((c) => JSON.parse(serializeCourse(c))),
    banks: banks.filter((b) => !b.courseId).map((b) => JSON.parse(serializeBank(b))),
    files: await gatherFiles(students, baseProgress),
  };
}

async function gatherFiles(students: Contents["students"], base: Progress): Promise<Contents["files"]> {
  const files: NonNullable<Contents["files"]> = {};
  // Documents on record, plus photos and files attached to students' writing, labs and logs.
  const ids = [
    ...Object.values(students).flatMap((s) => [...(s.records.documents ?? []).map((d) => d.fileId), ...workFileIds(s.progress)]),
    ...workFileIds(base),
  ];
  for (const id of ids) {
    if (files[id]) continue;
    const f = await loadFile(id);
    if (f) files[id] = f;
  }
  return files;
}

export async function exportEncrypted(courses: Course[], banks: Bank[], passphrase: string): Promise<boolean> {
  const text = await encryptText(JSON.stringify(await collect(courses, banks)), passphrase);
  const day = new Date().toISOString().slice(0, 10);
  return store.exportText(text, `erudior-family-backup-${day}.json`, "Erudior encrypted backup");
}

/** Replace everything on this computer with a decrypted backup. */
export async function restoreContents(
  text: string,
  current: { courses: Course[]; banks: Bank[] },
): Promise<{ students: number; courses: number }> {
  const b = JSON.parse(text) as Contents;
  if (b.format !== "examiner-family-backup") throw new Error("This backup's contents weren't recognized.");
  // Validate evidence before deleting/replacing any existing family data. Legacy full
  // backups clear the ledger: retaining it would mix another family's evidence.
  const classroomSubmissions = b.classroomSubmissions === undefined ? null
    : JSON.stringify(validateClassroomSubmissionState(JSON.stringify(b.classroomSubmissions)));
  validateProgressEvidence(b.progress);
  for (const student of Object.values(b.students)) validateProgressEvidence(student.progress);
  const courses = b.courses.map((c) => {
    const source = (c as { format?: string } | null)?.format === "erudior-canonical-authoring"
      ? courseFromCanonicalAuthoring(c, { mode: "source", maxBytes: Number.MAX_SAFE_INTEGER }) : c;
    const errors = [...validateCourseWork(source, { legacy: true }), ...validateReaderTexts((source as { texts?: unknown } | null)?.texts, { legacy: true })];
    if (errors.length) throw Error(`Invalid backup course work: ${errors.join("; ")}`);
    try { assertCourseImportPreservesFields(c); } catch (error) { throw new Error("Invalid backup course work: " + (error as Error).message); }
    const course = normalizeCourse(c);
    const canonicalErrors = [...validateCourseWork(course, { moduleIds: course.modules.map(module => module.id) }), ...validateWorkLessonReferences(course, course.lessons), ...validateReaderTexts(course.texts, { questionIds: course.banks[0]?.questions.map(question => question.id) ?? [] })];
    if (canonicalErrors.length) throw Error(`Invalid backup course work: ${canonicalErrors.join("; ")}`);
    return course;
  });
  const banks = b.banks.map((x) => parseBank(JSON.stringify(x)));
  for (const c of current.courses) if (!courses.some((x) => x.id === c.id)) await store.deleteCourse(c.id);
  for (const x of current.banks.filter((y) => !y.courseId)) if (!banks.some((y) => y.id === x.id)) await store.deleteBank(x.id);
  for (const c of courses) await store.saveCourse(c);
  for (const x of banks) await store.saveBank(x);
  for (const [id, s] of Object.entries(b.students)) {
    await store.saveState(`progress-${id}`, JSON.stringify(s.progress));
    await saveRecords(id, s.records);
    await savePhotos(id, s.photos ?? []);
  }
  for (const [fileId, f] of Object.entries(b.files ?? {})) await putFile(fileId, f);
  store.useStudentFiles(null);
  await store.saveProgress({ ...store.emptyProgress(), ...b.progress, seeded: true });
  if (b.family) await saveFamily(b.family);
  else await store.saveState("family", null);
  await store.saveState("classroom-submissions", classroomSubmissions);
  return { students: Object.keys(b.students).length, courses: courses.length };
}

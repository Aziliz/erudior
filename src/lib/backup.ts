import { cutoffProblem } from "./grades";
import { invoke } from "@tauri-apps/api/core";
import { webList, webGet } from "./webstore";
import { parseClassroomWorkflowState, restoreClassroomWorkflowState, validateClassroomWorkflowFamily } from "./classroomWorkflows";
import { assertLocalAdult, captureLocalSession, assertLocalSessionCredential, localSessionEnabled } from "./localSession";
import { parseLearnerPrivacyLibrary, restoreLearnerPrivacyLibrary, type LearnerPrivacyLibrary } from "./learnerPrivacyStore";
import { parseAdvancedAssessmentLibrary, type AdvancedAssessmentLibrary } from './advancedAssessment';
import { parseScientificLibrary, type ScientificLibrary } from './scientificWorkspace';
import { parseBranchingLibrary, type BranchingLibrary } from './branchingEngine';
import { parseInstructionalLibrary, type InstructionalLibrary } from './instructionalEvidence';
import { parseTransactionLibrary, type TransactionLibrary } from './transactionEngine';
import { parseDocumentLibrary, type DocumentLibrary } from './documentEngine';
import { parseInterventionTasks } from './interventionTasks';
import { parseStudentWorkspace } from './studentWorkspace';
import { parseLearningPathways } from './learningPathways';
import { parseInterventionState, type InterventionState } from './interventions';
import { parsePresentationLibrary, type PresentationLibrary } from "./presentations";
import { parseCompetencyLedger } from "./competencyState";
import { assertCourseImportPreservesFields } from "./courseImport";
import { courseFromCanonicalAuthoring } from "./canonicalAuthoring";
// Encrypted family backup: everything on this computer (family settings, every student's
// progress and records, courses, banks) in one file, encrypted with AES-256-GCM under a key
// derived from a passphrase (PBKDF2-SHA-256). Restoring needs the same passphrase.

import type { Bank, Course, Progress } from "./types";
import { loadFamily, type Family } from "./family";
import { withoutParentCourseReviews } from "./parentCourseReview";
import { loadRecords, parseRecords, restoredRecords, type Records } from "./records";
import { loadPhotos, savePhotos } from "./portfolio";
import { loadFile, putFile, MAX_DOC_BYTES } from "./documents";
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
  /** Private local classroom collaboration; restored sharing always needs fresh teacher release. */
  classroomWorkflows?: ReturnType<typeof parseClassroomWorkflowState>;
  /** Adult-authored reusable teaching resources; never learner responses. */
  presentations?: PresentationLibrary;
  /** Private adult-authored educational plans, observations and reviews. */
  interventions?: InterventionState;
  /** Same-device educational sources and immutable learner evidence. */
  documentEngine?: DocumentLibrary;
  /** Private educational transaction sources, sessions and immutable evidence. */
  transactionEngine?: TransactionLibrary;
  /** Private fictional scenario sources, decision timelines and immutable evidence. */
  branchingEngine?: BranchingLibrary;
  /** Private guided labs, measurements, design iterations and immutable evidence. */
  advancedAssessment?: AdvancedAssessmentLibrary;
  /** Local opt-in metadata; restore never activates consent, bindings or queued transfers. */
  learnerPrivacy?: LearnerPrivacyLibrary;
  scientificWorkspace?: ScientificLibrary;
  /** Private requirement mappings, captured evidence and human credit review history. */
  instructionalEvidence?: InstructionalLibrary;
  /** Attached documents by file id. */
  files?: Record<string, { mime: string; data: string }>;
}

const ITERATIONS = 600_000;

/** Bounded local files, never a remote upload. Limits apply before expensive KDF work. */
export const MAX_BACKUP_PLAINTEXT_BYTES = 128 * 1024 * 1024;
export const MAX_ENCRYPTED_BACKUP_BYTES = 180 * 1024 * 1024;
const MAX_BACKUP_NODES = 2_000_000;
const idPattern = /^[A-Za-z0-9_-]{1,100}$/;
const learnerIdPattern = /^[a-z0-9]{1,24}$/;
function object(value: unknown, label: string): Record<string, any> {
  if (!value || typeof value !== "object" || Array.isArray(value) || ![Object.prototype, null].includes(Object.getPrototypeOf(value))) throw Error(`Invalid ${label} in backup.`);
  return value as Record<string, any>;
}
function boundedText(value: unknown, max: number, label: string): string {
  if (typeof value !== "string" || value.length > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value)) throw Error(`Invalid ${label} in backup.`);
  return value;
}
function safeTree(value: unknown, depth = 0, budget = { nodes: 0 }): void {
  if (++budget.nodes > MAX_BACKUP_NODES || depth > 100) throw Error("Backup structure is too large or deeply nested.");
  if (typeof value === "number" && !Number.isFinite(value)) throw Error("Backup contains a nonfinite number.");
  if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      if (["__proto__", "prototype", "constructor"].includes(key)) throw Error("Unsafe backup field.");
      safeTree(child, depth + 1, budget);
    }
  }
}
/** JSON.parse alone silently accepts duplicate keys and overflowing numbers. */
function parseBackupJson(text: string, maxBytes: number): unknown {
  if (typeof text !== "string" || text.length > maxBytes || new TextEncoder().encode(text).length > maxBytes) throw Error("Backup exceeds the supported size limit.");
  const frames: { object: boolean; key: boolean; keys: Set<string> }[] = [];
  let at = 0, count = 0;
  while (at < text.length) {
    const char = text[at];
    if (/\s/.test(char)) { at++; continue; }
    if (++count > MAX_BACKUP_NODES * 4) throw Error("Backup has too many fields.");
    const frame = frames.at(-1);
    if (char === '"') {
      const start = at++;
      let closed = false;
      while (at < text.length) {
        const c = text[at++];
        if (c === "\\") { at++; continue; }
        if (c === '"') { closed = true; break; }
      }
      if (!closed) throw Error("Backup is not valid JSON.");
      if (frame?.object && frame.key) {
        const key = JSON.parse(text.slice(start, at)) as string;
        if (frame.keys.has(key)) throw Error("Backup contains a duplicate object key.");
        frame.keys.add(key); frame.key = false;
      }
    } else if (char === "{" || char === "[") {
      frames.push({ object: char === "{", key: char === "{", keys: new Set() }); at++;
      if (frames.length > 100) throw Error("Backup is too deeply nested.");
    } else if (char === "}" || char === "]") { frames.pop(); at++; }
    else if (char === ",") { if (frame?.object) frame.key = true; at++; }
    else if (char === ":") at++;
    else {
      const start = at;
      while (at < text.length && !/[\s,}\]]/.test(text[at])) at++;
      if (start === at) throw Error("Backup is not valid JSON.");
    }
  }
  let value: unknown;
  try { value = JSON.parse(text); } catch { throw Error("Backup is not valid JSON."); }
  safeTree(value);
  return value;
}
function strictBase64(value: unknown, maxBytes: number, label: string): string {
  if (typeof value !== "string" || value.length > Math.ceil(maxBytes / 3) * 4 || value.length % 4 !== 0
    || /[^A-Za-z0-9+/=]/.test(value) || !/^[^=]*={0,2}$/.test(value)) throw Error(`Invalid ${label} in backup.`);
  // Canonical pad bits, without allocating decoded attachment buffers.
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  if (value.endsWith("==") && (alphabet.indexOf(value.at(-3)!) & 15) !== 0 || value.endsWith("=") && !value.endsWith("==") && (alphabet.indexOf(value.at(-2)!) & 3) !== 0) throw Error(`Invalid ${label} in backup.`);
  const bytes = value.length / 4 * 3 - (value.endsWith("==") ? 2 : value.endsWith("=") ? 1 : 0);
  if (bytes > maxBytes) throw Error(`Oversized ${label} in backup.`);
  return value;
}
function uniqueIds(values: { id: string }[], label: string): void {
  const ids = new Set<string>();
  for (const value of values) {
    if (!value || typeof value.id !== "string" || !idPattern.test(value.id) || ids.has(value.id)) throw Error(`${label.startsWith("course ") ? "Invalid backup course work: " : ""}Invalid or duplicate ${label} ID in backup.`);
    ids.add(value.id);
  }
}
function validateBankIdentities(raw: unknown): void {
  const b = object(raw, "bank");
  if (b.id !== undefined && (typeof b.id !== "string" || !idPattern.test(b.id))) throw Error("Invalid bank ID in backup.");
  for (const field of ["sections", "questions"] as const) {
    if (b[field] !== undefined) {
      if (!Array.isArray(b[field])) throw Error(`Invalid bank ${field} in backup.`);
      const ids = b[field].filter((row: any) => row?.id !== undefined);
      uniqueIds(ids, `bank ${field}`);
    }
  }
}
function parseContents(text: string): Contents {
  const b = object(parseBackupJson(text, MAX_BACKUP_PLAINTEXT_BYTES), "contents");
  if (b.format !== "examiner-family-backup" || b.version !== 1) throw Error("This backup's contents or version weren't recognized.");
  if (b.createdAt !== undefined && (typeof b.createdAt !== "string" || b.createdAt.length > 50 || !Number.isFinite(Date.parse(b.createdAt)))) throw Error("Invalid backup creation date.");
  object(b.students, "student records");
  if (!Array.isArray(b.courses) || !Array.isArray(b.banks)) throw Error("Invalid backup courses or banks.");
  if (b.family !== null) {
    const f = object(b.family, "family");
    if (f.format !== "erudior-family" || f.version !== 1 || !Array.isArray(f.students)) throw Error("Invalid family in backup.");
    uniqueIds(f.students, "learner");
    for (const student of f.students) {
      if (!learnerIdPattern.test(student.id)) throw Error("Invalid learner ID in backup.");
      boundedText(student.name, 1000, "learner name");
      if (student.grade !== undefined && (!Number.isFinite(student.grade) || student.grade < -1 || student.grade > 20)) throw Error("Invalid learner grade in backup.");
      if (student.freeChoice !== undefined && typeof student.freeChoice !== "boolean") throw Error("Invalid learner choice in backup.");
      if (!Object.prototype.hasOwnProperty.call(b.students, student.id)) throw Error("Backup is missing a learner's progress and records.");
    }
    // Historical minimal Family fixtures are supported, but fields that are present cannot be malformed.
    if (f.mode !== undefined && !["homeschool", "classroom"].includes(f.mode)) throw Error("Invalid Family mode in backup.");
    for (const field of ["state", "route"]) if (f[field] !== undefined) boundedText(f[field], 1000, `family ${field}`);
    if (f.dailyMinutes !== undefined && (!Number.isFinite(f.dailyMinutes) || f.dailyMinutes < 0 || f.dailyMinutes > 1440)) throw Error("Invalid Family daily minutes.");
    if (f.year !== undefined) { object(f.year, "school year"); for (const key of ["start", "end"]) if (typeof f.year[key] !== "string" || !Number.isFinite(Date.parse(f.year[key]))) throw Error("Invalid Family school year."); }
    if (f.parent !== undefined) {
      object(f.parent, "parent credentials");
      for (const field of ["password", "pin", "recovery"]) {
        if (field === "pin" && f.parent[field] === undefined) continue;
        const secret = object(f.parent[field], "parent credential");
        for (const key of ["salt", "hash"]) if (!boundedText(secret[key], 1000, "parent credential")) throw Error("Invalid parent credential.");
        if (!Number.isSafeInteger(secret.iterations) || secret.iterations < 1 || secret.iterations > 2_000_000) throw Error("Invalid parent credential work factor.");
      }
    }
    for (const key of ["reminders", "done", "classes"]) if (f[key] !== undefined && !Array.isArray(f[key])) throw Error(`Invalid Family ${key}.`);
    if (f.classes) {
      uniqueIds(f.classes, "class");
      for (const c of f.classes) {
        if (!Array.isArray(c.students) || c.students.some((id: unknown) => !f.students.some((s: any) => s.id === id)) || new Set(c.students).size !== c.students.length) throw Error("Class refers to an unknown or duplicate learner.");
        if (!Array.isArray(c.assignments)) throw Error("Invalid class assignments.");
      }
    }
  }
  for (const [id, entry] of Object.entries(b.students)) {
    if (!learnerIdPattern.test(id)) throw Error("Invalid learner ID in backup.");
    const student = object(entry, "learner record");
    if (student.photos !== undefined) {
      if (!Array.isArray(student.photos)) throw Error("Invalid portfolio photos.");
      uniqueIds(student.photos, "portfolio photo");
      for (const photo of student.photos) {
        for (const key of ["date", "subject", "caption"]) boundedText(photo[key], 10000, "portfolio photo");
        if (typeof photo.image !== "string" || !/^data:image\/(?:jpeg|png|webp);base64,/.test(photo.image)) throw Error("Invalid portfolio image.");
        strictBase64(photo.image.slice(photo.image.indexOf(",") + 1), MAX_DOC_BYTES, "portfolio image");
      }
    }
  }
  if (b.files !== undefined) {
    for (const [id, entry] of Object.entries(object(b.files, "attachments"))) {
      if (!idPattern.test(id)) throw Error("Invalid attachment ID in backup.");
      const file = object(entry, "attachment");
      if (Object.keys(file).some(k => k !== "mime" && k !== "data") || typeof file.mime !== "string" || file.mime.length > 200 || !/^[a-zA-Z0-9!#$&^_.+-]+\/[a-zA-Z0-9!#$&^_.+-]+$/.test(file.mime)) throw Error("Invalid attachment type in backup.");
      strictBase64(file.data, MAX_DOC_BYTES, "attachment data");
    }
  }
  for (const raw of b.banks) validateBankIdentities(raw);
  for (const raw of b.courses) {
    const source = object(raw, "course");
    const c = source.format === "erudior-canonical-authoring" ? object(source.course, "canonical course") : source;
    if (c.id !== undefined && (typeof c.id !== "string" || !idPattern.test(c.id))) throw Error("Invalid course ID in backup.");
    if (c.bank !== undefined) validateBankIdentities(c.bank);
    if (c.banks !== undefined) { if (!Array.isArray(c.banks)) throw Error("Invalid course banks."); for (const bank of c.banks) validateBankIdentities(bank); }
    for (const key of ["modules", "lessons", "decks", "drills", "texts"]) if (c[key] !== undefined) {
      if (!Array.isArray(c[key])) throw Error(`Invalid course ${key}.`);
      uniqueIds(c[key], `course ${key}`);
    }
  }
  return b as Contents;
}

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
  // Export and import share limits: never offer a download this version cannot open.
  if (typeof text !== "string" || text.length > MAX_BACKUP_PLAINTEXT_BYTES) throw Error("Backup exceeds the supported size limit.");
  const bytes = new TextEncoder().encode(text);
  if (bytes.length > MAX_BACKUP_PLAINTEXT_BYTES) throw Error("Backup exceeds the supported size limit.");
  if (typeof passphrase !== "string" || passphrase.length > 4096) throw Error("Invalid backup passphrase.");
  if (!Number.isSafeInteger(iterations) || iterations < 1000 || iterations > 2_000_000) throw Error("Unsupported backup key derivation or work factor.");
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await keyFor(passphrase, salt, iterations);
  const data = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, bytes));
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
  // Capture every scalar before the first await; caller mutations cannot swap the ciphertext.
  const env = object(typeof raw === "string" ? parseBackupJson(raw, MAX_ENCRYPTED_BACKUP_BYTES) : raw, "encrypted envelope");
  if (!isEncryptedBackup(env)) throw new Error("This isn't an encrypted Erudior backup.");
  if (env.version !== 1 || Object.keys(env).some(key => !["format", "version", "kdf", "iv", "data"].includes(key))) throw Error("Unsupported encrypted backup version or fields.");
  const kdf = object(env.kdf, "key derivation");
  if (kdf.name !== "PBKDF2-SHA-256" || Object.keys(kdf).some(key => !["name", "iterations", "salt"].includes(key)) || !Number.isSafeInteger(kdf.iterations) || kdf.iterations < 1000 || kdf.iterations > 2_000_000) throw Error("Unsupported backup key derivation or work factor.");
  if (typeof passphrase !== "string" || passphrase.length > 4096) throw Error("Invalid backup passphrase.");
  const iterations = kdf.iterations;
  const salt = fromB64(strictBase64(kdf.salt, 16, "salt")), iv = fromB64(strictBase64(env.iv, 12, "initialization vector"));
  if (salt.length !== 16 || iv.length !== 12) throw Error("Invalid encrypted backup salt or initialization vector.");
  const data = fromB64(strictBase64(env.data, MAX_BACKUP_PLAINTEXT_BYTES + 16, "encrypted data"));
  if (data.length < 16) throw Error("Invalid encrypted backup authentication tag.");
  const key = await keyFor(passphrase, salt, iterations);
  try {
    const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: iv as BufferSource }, key, data as BufferSource);
    return new TextDecoder("utf-8", { fatal: true, ignoreBOM: true }).decode(plain);
  } catch {
    throw new Error("Wrong passphrase, or the file is damaged.");
  }
}

/** Historical evidence is optional for legacy progress, but never silently repaired. */
function validateProgressEvidence(progress: Progress): Progress {
  object(progress, "progress");
  // Newly created Classroom learners intentionally start with only catalogV1/enrolled.
  // Missing legacy fields stay missing; present malformed fields fail closed.
  if (progress.version !== undefined && progress.version !== 1 || progress.seeded !== undefined && typeof progress.seeded !== "boolean" || progress.attempts !== undefined && !Array.isArray(progress.attempts)) throw Error("Invalid progress in backup.");
  for (const key of ["stats", "cards", "lessonsDone", "plans", "activity", "drills"] as const) if (progress[key] !== undefined) object(progress[key], "progress " + key);
  for (const key of ["modulesDone", "vocab", "qmeta", "pretests", "work", "reading", "spreadsheetGrades"] as const) if (progress[key] !== undefined) object(progress[key], "progress " + key);
  if (progress.logs !== undefined && !Array.isArray(progress.logs)) throw Error("Invalid progress activity logs.");
  for (const key of ["enrolled", "seededCourses"] as const) if (progress[key] !== undefined && (!Array.isArray(progress[key]) || progress[key]!.some(id => typeof id !== "string"))) throw Error("Invalid progress course references.");
  if (progress.interventionTasks !== undefined) parseInterventionTasks(progress.interventionTasks);
  if (progress.learningPathways !== undefined) parseLearningPathways(progress.learningPathways);
  if (progress.studentWorkspace !== undefined) parseStudentWorkspace(progress.studentWorkspace);
  if (progress.competencies !== undefined) parseCompetencyLedger(progress.competencies);
  if (progress.assessedWorkSubmissions !== undefined) mergeAssessedWorkSubmissions({}, progress.assessedWorkSubmissions);
  if (progress.spreadsheetSubmissions !== undefined) mergeSpreadsheetSubmissions({}, progress.spreadsheetSubmissions);
  return progress;
}

function validateInterventionFamily(state: InterventionState, family: Family | null) {
  const students = new Set(family?.students.map(student => student.id) ?? []);
  if (state.plans.some(plan => !students.has(plan.studentId))) throw Error("Intervention history refers to a learner outside this family.");
}

function validateDocumentFamily(state: DocumentLibrary, family: Family | null) {
  const students = new Set(family?.students.map(student => student.id) ?? []);
  if (state.assignments.some(a => !students.has(a.studentId))) throw Error("Document history refers to a learner outside this family.");
}

function validateBranchingFamily(state: BranchingLibrary, family: Family | null) {
  const students = new Set(family?.students.map(student => student.id) ?? []);
  if (state.assignments.some(a => !students.has(a.studentId))) throw Error("Branching scenario history refers to a learner outside this family.");
}

function validateLearnerPrivacyFamily(state: LearnerPrivacyLibrary, family: Family | null) {
  const students = new Set(family?.students.map(student => student.id) ?? []);
  if (state.profiles.some(profile => profile.studentId !== null && !students.has(profile.studentId))) throw Error("Learner privacy state refers to a learner outside this family.");
}

function validateAdvancedAssessmentFamily(state: AdvancedAssessmentLibrary, family: Family | null) {
  const students = new Set(family?.students.map(student => student.id) ?? []);
  if (state.assignments.some(a => !students.has(a.studentId))) throw Error("Advanced assessment history refers to a learner outside this family.");
}

function validateScientificFamily(state: ScientificLibrary, family: Family | null) {
  const students = new Set(family?.students.map(student => student.id) ?? []);
  if (state.assignments.some(a => !students.has(a.studentId))) throw Error("Scientific workspace history refers to a learner outside this family.");
}

function validateTransactionFamily(state: TransactionLibrary, family: Family | null) {
  const students = new Set(family?.students.map(student => student.id) ?? []);
  if (state.assignments.some(a => !students.has(a.studentId))) throw Error("Transaction history refers to a learner outside this family.");
}

function validateInstructionalFamily(state: InstructionalLibrary, family: Family | null) {
  const students = new Set(family?.students.map(student => student.id) ?? []);
  if (state.assignments.some(a => !students.has(a.studentId))) throw Error("Instructional evidence refers to a learner outside this family.");
}

/** Gather everything stored on this computer. */
export async function collect(courses: Course[], banks: Bank[]): Promise<Contents> {
  const family = await loadFamily();
  const branchingText = await store.loadState("branching-engine");
  const branchingEngine = branchingText === null ? undefined : parseBranchingLibrary(branchingText);
  if (branchingEngine) validateBranchingFamily(branchingEngine, family);
  const privacyText = await store.loadState("learner-privacy");
  const learnerPrivacy = privacyText === null ? undefined : parseLearnerPrivacyLibrary(privacyText);
  if (learnerPrivacy) validateLearnerPrivacyFamily(learnerPrivacy, family);
  const advancedText = await store.loadState("advanced-assessment");
  const advancedAssessment = advancedText === null ? undefined : parseAdvancedAssessmentLibrary(advancedText);
  if (advancedAssessment) validateAdvancedAssessmentFamily(advancedAssessment, family);
  const scientificText = await store.loadState("scientific-workspace");
  const scientificWorkspace = scientificText === null ? undefined : parseScientificLibrary(scientificText);
  if (scientificWorkspace) validateScientificFamily(scientificWorkspace, family);
  const instructionalText = await store.loadState("instructional-evidence");
  const instructionalEvidence = instructionalText === null ? undefined : parseInstructionalLibrary(instructionalText);
  if (instructionalEvidence) validateInstructionalFamily(instructionalEvidence, family);
  const transactionText = await store.loadState("transaction-engine");
  const transactionEngine = transactionText === null ? undefined : parseTransactionLibrary(transactionText);
  if (transactionEngine) validateTransactionFamily(transactionEngine, family);
  const documentText = await store.loadState("document-engine");
  const documentEngine = documentText === null ? undefined : parseDocumentLibrary(documentText);
  if (documentEngine) validateDocumentFamily(documentEngine, family);
  const workflowText = await store.loadState("classroom-workflows");
  const classroomWorkflows = workflowText === null ? undefined : parseClassroomWorkflowState(workflowText);
  if (classroomWorkflows) validateClassroomWorkflowFamily(classroomWorkflows, family ?? {students:[]});
  const classroomText = await store.loadState("classroom-submissions");
  const classroomSubmissions = classroomText === null ? undefined : validateClassroomSubmissionState(classroomText);
  const interventionText = await store.loadState("interventions");
  const interventions = interventionText === null ? undefined : parseInterventionState(interventionText);
  if (interventions) validateInterventionFamily(interventions, family);
  const presentationText = await store.loadState("presentations");
  const presentations = presentationText === null ? undefined : parsePresentationLibrary(presentationText);
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
    ...(classroomWorkflows === undefined ? {} : { classroomWorkflows }),
    ...(presentations === undefined ? {} : { presentations }),
    ...(interventions === undefined ? {} : { interventions }),
    ...(documentEngine === undefined ? {} : { documentEngine }),
    ...(branchingEngine === undefined ? {} : { branchingEngine }),
    ...(learnerPrivacy === undefined ? {} : { learnerPrivacy }),
    ...(advancedAssessment === undefined ? {} : { advancedAssessment }),
    ...(scientificWorkspace === undefined ? {} : { scientificWorkspace }),
    ...(transactionEngine === undefined ? {} : { transactionEngine }),
    ...(instructionalEvidence === undefined ? {} : { instructionalEvidence }),
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

export async function exportEncrypted(courses: Course[], banks: Bank[], passphrase: string, authorization: () => void = () => {}): Promise<boolean> {
  const session = captureLocalSession();
  const authorize = () => { session(); assertLocalAdult(); authorization(); };
  authorize();
  const contents = await collect(courses, banks);
  authorize();
  const text = await encryptText(JSON.stringify(contents), passphrase);
  authorize();
  const day = new Date().toISOString().slice(0, 10);
  return store.exportText(text, `erudior-family-backup-${day}.json`, "Erudior encrypted backup");
}

/** Shared read-only validation, used by verification and every restore entry point. */
async function validateRestoreContents(text: string) {
  const b = parseContents(text);
  if (b.format !== "examiner-family-backup") throw new Error("This backup's contents weren't recognized.");
  if (!b.students || typeof b.students !== "object" || Array.isArray(b.students)) throw Error("Invalid student records in backup.");
  // Validate and strip imported parental authority before any restore mutation.
  const restoredFamily = b.family ? withoutParentCourseReviews(b.family) : null;
  const currentWorkflow = parseClassroomWorkflowState(await store.loadState("classroom-workflows"));
  const currentDeletedIds = [...new Set([...(validateClassroomSubmissionState(await store.loadState("classroom-submissions")).deletedStudentIds ?? []), ...currentWorkflow.deletedStudentIds])];
  if (b.classroomWorkflows === null) throw Error("Invalid classroom workflows in backup.");
  const importedWorkflow = parseClassroomWorkflowState(b.classroomWorkflows === undefined ? null : JSON.stringify(b.classroomWorkflows));
  validateClassroomWorkflowFamily(importedWorkflow, b.family ?? {students:[]});
  const workflowDeletedIds = [...new Set([...currentDeletedIds, ...importedWorkflow.deletedStudentIds])];
  if (workflowDeletedIds.some(id => b.family?.students.some(s => s.id === id) || b.students[id])) throw Error("This backup contains a deleted learner. Erased learner records cannot be restored to their old identity.");
  const workflowPreflight = restoreClassroomWorkflowState(importedWorkflow, workflowDeletedIds);
  // Bound the invalidating revision before any destructive recovery writes.
  parseClassroomWorkflowState({...workflowPreflight, revision: Math.max(workflowPreflight.revision, currentWorkflow.revision + 1)});
  for (const [id, student] of Object.entries(b.students)) {
    if (!/^[a-z0-9]{1,24}$/.test(id) || !b.family?.students.some(s => s.id === id)) throw Error("Backup records do not belong to a learner in this family.");
    if (currentDeletedIds.includes(id)) throw Error("This backup contains a deleted learner. Erased learner records cannot be restored to their old identity.");
    student.records = restoredRecords(student.records);
  }
  // Validate evidence before deleting/replacing any existing family data. Legacy full
  // backups clear the ledger: retaining it would mix another family's evidence.
  const importedClassroom = b.classroomSubmissions === undefined ? null : validateClassroomSubmissionState(JSON.stringify(b.classroomSubmissions));
  const deletedIds = [...new Set([...workflowDeletedIds, ...(importedClassroom?.deletedStudentIds ?? [])])];
  if (deletedIds.some(id => b.family?.students.some(s => s.id === id) || b.students[id])) throw Error("Backup contains records for a deleted learner.");
  const classroomSubmissions = importedClassroom === null && deletedIds.length === 0 ? null
    : JSON.stringify(validateClassroomSubmissionState(JSON.stringify({...importedClassroom ?? {version:1,records:[],complete:[]}, ...(deletedIds.length ? {deletedStudentIds:deletedIds} : {})})));
  if (b.presentations === null) throw Error("Invalid presentation library in backup.");
  const presentations = b.presentations === undefined ? null : JSON.stringify(parsePresentationLibrary(b.presentations));
  if (b.interventions === null) throw Error("Invalid intervention history in backup.");
  const interventionState = b.interventions === undefined ? undefined : parseInterventionState(b.interventions);
  if (interventionState) validateInterventionFamily(interventionState, b.family);
  const interventions = interventionState === undefined ? null : JSON.stringify(interventionState);
  if (b.instructionalEvidence === null) throw Error("Invalid instructional evidence history in backup.");
  const instructionalState = b.instructionalEvidence === undefined ? undefined : parseInstructionalLibrary(b.instructionalEvidence);
  if (instructionalState) validateInstructionalFamily(instructionalState, b.family);
  // A backup preserves recorded history, not the authenticity of imported authority.
  // Re-reviewing a requirement pack alone must not activate fabricated credit decisions.
  const instructionalEvidence = instructionalState === undefined ? null : JSON.stringify(parseInstructionalLibrary({
    ...instructionalState, restoredAt: new Date().toISOString(),
    pendingApproval: instructionalState.packs.map(pack => pack.id + "@" + pack.revision),
    pendingDecisionIds: instructionalState.decisions.map(decision => decision.id),
  }));
  if (b.branchingEngine === null) throw Error("Invalid branching scenario history in backup.");
  const branchingState = b.branchingEngine === undefined ? undefined : parseBranchingLibrary(b.branchingEngine);
  if (branchingState) validateBranchingFamily(branchingState, b.family);
  // Imported receipts remain historical records, never current local approval.
  const branchingEngine = branchingState === undefined ? null : JSON.stringify(parseBranchingLibrary({
    ...branchingState, restoredAt: new Date().toISOString(),
    pendingApproval: branchingState.packs.map(pack => pack.id + "@" + pack.revision),
  }));
  if (b.learnerPrivacy === null) throw Error("Invalid learner privacy state in backup.");
  const privacyState = parseLearnerPrivacyLibrary(b.learnerPrivacy ?? null);
  validateLearnerPrivacyFamily(privacyState, b.family);
  // Validate current state before any writes; re-read under the write lock below.
  restoreLearnerPrivacyLibrary(privacyState, parseLearnerPrivacyLibrary(await store.loadState("learner-privacy")));
  if (b.advancedAssessment === null) throw Error("Invalid advanced assessment history in backup.");
  const advancedState = b.advancedAssessment === undefined ? undefined : parseAdvancedAssessmentLibrary(b.advancedAssessment);
  if (advancedState) validateAdvancedAssessmentFamily(advancedState, b.family);
  // Imported receipts remain historical records, never current local approval.
  const advancedAssessment = advancedState === undefined ? null : JSON.stringify(parseAdvancedAssessmentLibrary({
    ...advancedState, restoredAt: new Date().toISOString(),
    pendingApproval: advancedState.packs.map(pack => pack.id + "@" + pack.revision),
    pendingReviewIds: advancedState.feedback.map(review => review.id),
  }));
  if (b.scientificWorkspace === null) throw Error("Invalid scientific workspace history in backup.");
  const scientificState = b.scientificWorkspace === undefined ? undefined : parseScientificLibrary(b.scientificWorkspace);
  if (scientificState) validateScientificFamily(scientificState, b.family);
  // Imported receipts remain historical records, never current local approval.
  const scientificWorkspace = scientificState === undefined ? null : JSON.stringify(parseScientificLibrary({
    ...scientificState, restoredAt: new Date().toISOString(),
    pendingApproval: scientificState.packs.map(pack => pack.id + "@" + pack.revision),
  }));
  if (b.transactionEngine === null) throw Error("Invalid transaction history in backup.");
  const transactionState = b.transactionEngine === undefined ? undefined : parseTransactionLibrary(b.transactionEngine);
  if (transactionState) validateTransactionFamily(transactionState, b.family);
  // Recovery preserves history, not imported claims of current local authority.
  const transactionEngine = transactionState === undefined ? null : JSON.stringify(parseTransactionLibrary({
    ...transactionState, restoredAt: new Date().toISOString(),
    pendingApproval: transactionState.packs.map(pack => pack.id + "@" + pack.revision),
  }));
  if (b.documentEngine === null) throw Error("Invalid document history in backup.");
  const documentState = b.documentEngine === undefined ? undefined : parseDocumentLibrary(b.documentEngine);
  if (documentState) validateDocumentFamily(documentState, b.family);
  // Plaintext legacy restore is an import, not authentication of approval or feedback.
  // Preserve exact historical snapshots, but revoke their authority for new work.
  const documentEngine = documentState === undefined ? null : JSON.stringify(parseDocumentLibrary({
    ...documentState, restoredAt: new Date().toISOString(),
    pendingApproval: documentState.templates.map(t => t.id + "@" + t.revision),
  }));
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
  attachmentIds(b);
  uniqueIds(courses, "course"); uniqueIds(banks, "bank");
  for (const bank of banks) if (courses.some(course => course.banks.some(embedded => embedded.id === bank.id))) throw Error("A standalone bank conflicts with an embedded course bank.");
  // Record revision increment must also be valid before destructive writes.
  for (const [id, student] of Object.entries(b.students)) {
    const old = await store.loadState(`records-${id}`);
    let previousRevision = 0;
    if (old !== null) { try { previousRevision = parseRecords(old).revision ?? 0; } catch { /* explicit recovery may repair damaged records */ } }
    parseRecords({...student.records, revision: Math.max(previousRevision, student.records.revision ?? 0) + 1});
  }
  return { b, restoredFamily, importedWorkflow, deletedIds, classroomSubmissions, presentations, interventions, instructionalEvidence, branchingEngine, privacyState, advancedAssessment, scientificWorkspace, transactionEngine, documentEngine, courses, banks };
}

export interface FamilyBackupInventory {
  readonly students: number; readonly courses: number; readonly banks: number; readonly records: number;
  readonly photos: number; readonly files: number; readonly missingFiles: number;
  readonly studentNames: readonly string[]; readonly courseTitles: readonly string[];
  readonly libraries: readonly string[]; readonly truncated: boolean;
}
export interface PreparedFamilyRestore {
  readonly createdAt: string | null;
  /** SHA-256 of the exact authenticated, decrypted UTF-8 bytes, before normalization. */
  readonly digest: string;
  readonly inventory: FamilyBackupInventory;
  readonly currentInventory: Readonly<{ students: number; courses: number; banks: number }>;
  readonly changes: Readonly<{ studentsAdded: number; studentsRemoved: number; coursesAdded: number; coursesRemoved: number; banksAdded: number; banksRemoved: number }>;
  readonly warnings: readonly string[];
}
export class FamilyRestoreError extends Error {
  constructor(message: string, public readonly partial: boolean) { super(message); this.name = "FamilyRestoreError"; }
}
type CurrentLibrary = { courses: Course[]; banks: Bank[] };
type PreparedPrivate = { text: string; baseline: string; current: string; authorize: () => void };
const preparedRestores = new WeakMap<PreparedFamilyRestore, PreparedPrivate>();
const globalStateNames = ["family", "progress", "session", "classes", "classroom-submissions", "classroom-workflows", "presentations", "interventions", "document-engine", "transaction-engine", "instructional-evidence", "branching-engine", "scientific-workspace", "advanced-assessment", "learner-privacy"] as const;
const libraryLabels = {
  classroomSubmissions: "Instructor submissions", classroomWorkflows: "Classroom collaboration", presentations: "Teaching presentations",
  interventions: "Educational interventions", documentEngine: "Document activities", transactionEngine: "Transaction activities",
  branchingEngine: "Branching scenarios", scientificWorkspace: "Scientific workspaces", advancedAssessment: "Advanced assessments",
  instructionalEvidence: "Instructional evidence", learnerPrivacy: "Learner privacy metadata",
} as const;
const digestText = async (text: string): Promise<string> => Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text))), byte => byte.toString(16).padStart(2, "0")).join("");
/** Read exact persisted bytes. Does not collect(), acquire an anonymous write lease,
 * select a profile, export, repair, update a revision, or save any state. */
async function currentStateBinding(importedIds: string[], authorize: () => void, fileIds: string[] = []): Promise<{ digest: string; studentIds: string[]; courseIds: string[]; bankIds: string[] }> {
  authorize();
  const familyRaw = await store.loadState("family"); authorize();
  const family = familyRaw === null ? null : object(parseBackupJson(familyRaw, MAX_BACKUP_PLAINTEXT_BYTES), "current Family");
  if (localSessionEnabled()) {
    if (!family) throw Error("Family was removed. Reopen and authenticate again.");
    assertLocalSessionCredential(family.parent);
  }
  const studentIds: string[] = family?.students?.map((s: {id: string}) => s.id) ?? [];
  if (!Array.isArray(studentIds) || studentIds.some(id => !learnerIdPattern.test(id))) throw Error("Current Family has invalid learner identities.");
  const names = [...globalStateNames, ...[...new Set([...studentIds, ...importedIds])].sort().flatMap(id => ["progress", "records", "portfolio", "session"].map(prefix => `${prefix}-${id}`))];
  const state: [string, string | null][] = [];
  for (const name of names) { authorize(); const raw = name === "family" ? familyRaw : await store.loadState(name); authorize(); state.push([name, raw]); }
  // Read raw item bytes rather than normalized courses, whose migration may hide a change.
  const items: [string, string[]][] = [];
  for (const kind of ["courses", "banks", "documents"] as const) {
    authorize();
    const raw = store.inApp ? await invoke<string[]>("list_items", { kind }) : await webList(`erudior.${kind === "courses" ? "course" : kind === "banks" ? "bank" : "document"}.`);
    authorize(); items.push([kind, raw.slice().sort()]);
  }
  const persistedIds = (kind: "courses" | "banks") => {
    const values = items.find(([name]) => name === kind)![1].map(raw => {
      const parsed = object(parseBackupJson(raw, MAX_BACKUP_PLAINTEXT_BYTES), `current ${kind}`);
      return parsed.format === "erudior-canonical-authoring" ? object(parsed.course, "current canonical course") : parsed;
    }).filter(value => kind !== "banks" || !value.courseId);
    uniqueIds(values as {id: string}[], `current ${kind}`);
    return values.map(value => value.id as string).sort();
  };
  const courseIds = persistedIds("courses"), bankIds = persistedIds("banks");
  const files: [string, unknown][] = [];
  for (const id of [...new Set(fileIds)].sort()) {
    authorize();
    const raw = store.inApp ? await invoke<string | null>("load_item", { kind: "documents", id }) : await webGet(`erudior.document.${id}`);
    files.push([id, raw]); authorize();
  }
  const digest = await digestText(JSON.stringify({ state, items, files })); authorize();
  return { digest, studentIds, courseIds, bankIds };
}
function attachmentIds(b: Contents): Set<string> {
  const ids = new Set([...Object.values(b.students).flatMap(s => [...s.records.documents.map(d => d.fileId), ...workFileIds(s.progress)]), ...workFileIds(b.progress)]);
  for (const id of ids) if (typeof id !== "string" || !idPattern.test(id)) throw Error("Invalid attachment dependency in backup.");
  return ids;
}
function summarizeBackup(plan: Awaited<ReturnType<typeof validateRestoreContents>>): { inventory: FamilyBackupInventory; warnings: string[] } {
  const { b, courses, banks } = plan;
  const students = Object.values(b.students);
  const referenced = attachmentIds(b);
  const missingFiles = [...referenced].filter(id => !Object.prototype.hasOwnProperty.call(b.files ?? {}, id)).length;
  const knownCourses = new Set(courses.map(c => c.id));
  const absentCourses = new Set((b.family?.students ?? []).flatMap(s => s.assigned ?? []).map(a => a.courseId).filter(id => !knownCourses.has(id)));
  const records = students.reduce((sum, s) => sum + [s.records.manual, s.records.grades, s.records.outside, s.records.tests, s.records.documents, s.records.reading, s.records.activities, s.records.academic?.claims ?? []].reduce((n, rows) => n + rows.length, 0), 0);
  const label = (value: string) => value.replace(/[\u0000-\u001f\u007f\u202a-\u202e\u2066-\u2069]/g, " ").slice(0, 120);
  const inventory: FamilyBackupInventory = Object.freeze({
    students: students.length, courses: courses.length, banks: banks.length, records,
    photos: students.reduce((n, s) => n + (s.photos?.length ?? 0), 0), files: Object.keys(b.files ?? {}).length, missingFiles,
    studentNames: Object.freeze((b.family?.students ?? []).slice(0, 20).map(s => label(s.name))),
    courseTitles: Object.freeze(courses.slice(0, 20).map(c => label(c.title))),
    libraries: Object.freeze(Object.entries(libraryLabels).filter(([key]) => b[key as keyof typeof libraryLabels] !== undefined).map(([, title]) => title)),
    truncated: students.length > 20 || courses.length > 20,
  });
  const warnings = [
    "Verification only reads this device. It does not restore, export, upload, or send any data.",
    "Restore replaces Family settings, included learner records, base progress, courses, banks and supported libraries. It is not a merge or secure erasure of older local files.",
    "Parent course reviews, imported instructional credit decisions and activity approvals require fresh local review. Classroom sharing is held for teacher release; records are marked imported.",
    "This restores historical evidence, including competency history. Existing base-profile competencies may be retained under the current recovery rules; verification does not certify academic authority.",
    "Existing unfinished sessions and older profile files are not erased by this recovery. Reload and inspect the restored Family before resuming activities.",
    "Learner privacy consent, account bindings and queued transfers are removed. Deleted-learner safeguards are retained.",
    "The passphrase authenticates the encrypted file, not its author or the truth of its records. The digest identifies the exact verified contents.",
    "Close other Family windows before restoring. Recovery writes several local files, not one atomic transaction. A storage error or revoked access can leave a partial restore; do not automatically retry.",
  ];
  if (missingFiles) warnings.push(`${missingFiles} referenced attachment${missingFiles === 1 ? " is" : "s are"} missing from this backup. Verification cannot recover missing bytes.`);
  if (absentCourses.size) warnings.push(`${absentCourses.size} assigned course${absentCourses.size === 1 ? " is" : "s are"} not included. Historical references are retained, but those courses will remain unavailable.`);
  if (!b.createdAt) warnings.push("This legacy backup has no creation date.");
  return { inventory, warnings };
}
/** The staged UI must not install a Family that cannot open Settings or authenticate.
 * Raw legacy recovery keeps its existing contract; missing reminder/done arrays are
 * supported because loadFamily supplies those defaults. */
function validateVerifiedFamily(family: Family | null): void {
  if (!family) return;
  const text = (value: unknown, label: string, max = 1000) => boundedText(value, max, label);
  const day = (value: unknown, label: string) => {
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(Date.parse(value)) || new Date(value).toISOString().slice(0, 10) !== value) throw Error(`Invalid Family ${label}.`);
    return value;
  };
  const finite = (value: unknown, label: string, max = Number.MAX_SAFE_INTEGER) => {
    if (typeof value !== "number" || !Number.isFinite(value) || value < 0 || value > max) throw Error(`Invalid Family ${label}.`);
    return value;
  };
  text(family.state, "state"); text(family.route, "route");
  object(family.year, "required school year");
  const start = day(family.year.start, "year start"), end = day(family.year.end, "year end");
  if (start >= end) throw Error("Invalid Family school year order.");
  finite(family.dailyMinutes, "daily minutes", 1440);
  const parent = object(family.parent, "required parent credentials");
  for (const key of ["password", "pin", "recovery"] as const) {
    if (key === "pin" && parent.pin === undefined) continue;
    const secret = object(parent[key], "required parent credential");
    if (fromB64(strictBase64(secret.salt, 16, "parent credential salt")).length !== 16
      || fromB64(strictBase64(secret.hash, 32, "parent credential hash")).length !== 32) throw Error("Invalid parent credential lengths in backup.");
  }
  if (parent.failures !== undefined && !Number.isSafeInteger(finite(parent.failures, "failed attempts"))) throw Error("Invalid Family failed attempts.");
  if (parent.lockedUntil !== undefined) finite(parent.lockedUntil, "lock time");
  if (!family.students.length) throw Error("A verified Family needs at least one learner.");
  for (const student of family.students) {
    if (!student.name.trim() || !Number.isSafeInteger(student.grade) || student.grade < 0 || student.grade > 12 || typeof student.freeChoice !== "boolean") throw Error("Invalid Family learner settings.");
    for (const assignment of student.assigned ?? []) {
      if (!text(assignment.courseId, "assigned course ID", 200) || !text(assignment.subject, "assigned subject")) throw Error("Invalid Family assignment.");
    }
    if (student.birthDate !== undefined) day(student.birthDate, "birth date");
    if (student.graduation !== undefined) day(student.graduation, "graduation date");
  }
  if (family.reminders !== undefined) {
    uniqueIds(family.reminders, "reminder");
    for (const reminder of family.reminders) { day(reminder.date, "reminder date"); text(reminder.text, "reminder text", 10000); }
  }
  if (family.done !== undefined) for (const key of family.done) text(key, "completed reminder", 1000);
  if (family.school !== undefined) {
    object(family.school, "school details");
    for (const key of ["name", "administrator", "address"] as const) text(family.school[key], "school " + key, 10000);
  }
  if (family.grading !== undefined) {
    object(family.grading, "grading"); object(family.grading.cutoffs, "grade cutoffs"); object(family.grading.weights, "grade weights");
    const problem = cutoffProblem(family.grading.cutoffs);
    if (problem) throw Error("Invalid Family grading: " + problem);
    const weights = ["lessons", "modules", "final", "parent"].map(key => finite(family.grading!.weights[key as keyof typeof family.grading.weights], "grade weight", 100));
    if (!weights.some(weight => weight > 0)) throw Error("Invalid Family grading weights.");
  }
  for (const classroom of family.classes ?? []) {
    if (!text(classroom.name, "class name").trim()) throw Error("Invalid Family class name.");
    if (fromB64(strictBase64(classroom.secret, 32, "class secret")).length !== 32 || typeof classroom.freeChoice !== "boolean") throw Error("Invalid Family classroom settings.");
    for (const assignment of classroom.assignments) {
      object(assignment, "class assignment");
      if (!text(assignment.courseId, "class course ID", 200)) throw Error("Invalid Family class course ID.");
      day(assignment.assigned, "class assignment date");
      if (assignment.due !== undefined) day(assignment.due, "class assignment due date");
    }
    for (const [id, timestamp] of Object.entries(object(classroom.handins, "class hand-ins"))) {
      if (!learnerIdPattern.test(id) || typeof timestamp !== "string" || timestamp.length > 50 || !Number.isFinite(Date.parse(timestamp))) throw Error("Invalid Family hand-in history.");
    }
  }
}

/** Authenticate and validate an encrypted Family backup without changing any store.
 * Only a private immutable string is retained; callers receive bounded, frozen metadata. */
export async function verifyEncryptedBackup(raw: unknown, passphrase: string, current: CurrentLibrary, authorization: () => void = () => {}): Promise<PreparedFamilyRestore> {
  const session = captureLocalSession();
  const authorize = () => { session(); assertLocalAdult(); authorization(); };
  authorize();
  const currentText = JSON.stringify(current);
  const text = await decryptText(raw, passphrase); authorize();
  // Parse once to scope the snapshot, then run the same full validation used by raw restore.
  const b = parseContents(text);
  validateVerifiedFamily(b.family);
  const before = await currentStateBinding(Object.keys(b.students), authorize, Object.keys(b.files ?? {}));
  const currentSnapshot: CurrentLibrary = JSON.parse(currentText);
  uniqueIds(currentSnapshot.courses, "current course");
  uniqueIds(currentSnapshot.banks.filter(bank => !bank.courseId), "current bank");
  if (JSON.stringify(currentSnapshot.courses.map(course => course.id).sort()) !== JSON.stringify(before.courseIds)
    || JSON.stringify(currentSnapshot.banks.filter(bank => !bank.courseId).map(bank => bank.id).sort()) !== JSON.stringify(before.bankIds)) throw Error("The course library changed before verification. Reload this view and verify again.");
  const plan = await validateRestoreContents(text); authorize();
  const { inventory, warnings } = summarizeBackup(plan);
  const digest = await digestText(text); authorize();
  const after = await currentStateBinding(Object.keys(b.students), authorize, Object.keys(b.files ?? {}));
  if (after.digest !== before.digest || JSON.stringify(current) !== currentText) throw Error("Local data changed during verification. Verify the backup again before restoring.");
  const oldStudents = new Set(before.studentIds), newStudents = new Set(Object.keys(b.students));
  const oldCourses = new Set(currentSnapshot.courses.map(c => c.id)), newCourses = new Set(plan.courses.map(c => c.id));
  const oldBanks = new Set(currentSnapshot.banks.filter(b => !b.courseId).map(b => b.id)), newBanks = new Set(plan.banks.map(b => b.id));
  const added = (a: Set<string>, b: Set<string>) => [...a].filter(id => !b.has(id)).length;
  const prepared: PreparedFamilyRestore = Object.freeze({
    createdAt: b.createdAt ?? null, digest, inventory,
    currentInventory: Object.freeze({students: oldStudents.size, courses: oldCourses.size, banks: oldBanks.size}),
    changes: Object.freeze({ studentsAdded: added(newStudents, oldStudents), studentsRemoved: added(oldStudents, newStudents), coursesAdded: added(newCourses, oldCourses), coursesRemoved: added(oldCourses, newCourses), banksAdded: added(newBanks, oldBanks), banksRemoved: added(oldBanks, newBanks) }),
    warnings: Object.freeze(warnings),
  });
  preparedRestores.set(prepared, { text, current: currentText, baseline: before.digest, authorize });
  return prepared;
}
/** Cancel, finish inspect-only, or dismiss a review. No storage calls. */
export function discardPreparedBackup(prepared: PreparedFamilyRestore): void { preparedRestores.delete(prepared); }
/** Explicit, one-shot apply of the exact verified bytes. Stale reviews never refresh
 * their own baseline or silently retry. A new verification is needed after any failure. */
export async function restorePreparedBackup(prepared: PreparedFamilyRestore, current: CurrentLibrary, authorization: () => void = () => {}): Promise<{students: number; courses: number}> {
  const saved = preparedRestores.get(prepared);
  preparedRestores.delete(prepared); // synchronous, before the first await: double clicks cannot replay
  if (!saved) throw new FamilyRestoreError("This backup review was discarded or already used. Verify the file again.", false);
  const authorize = () => { saved.authorize(); assertLocalAdult(); authorization(); };
  try {
    authorize();
    if (JSON.stringify(current) !== saved.current) throw new FamilyRestoreError("The course library changed. Verify the backup again.", false);
    const currentSnapshot: CurrentLibrary = JSON.parse(saved.current);
    const contents = parseContents(saved.text);
    const ids = Object.keys(contents.students), fileIds = Object.keys(contents.files ?? {});
    const freshness = async () => {
      authorize();
      if ((await currentStateBinding(ids, authorize, fileIds)).digest !== saved.baseline) throw new FamilyRestoreError("Local data changed after verification. Nothing was restored; verify the backup again.", false);
      authorize();
    };
    await freshness();
    return await applyContents(saved.text, currentSnapshot, authorize, freshness);
  } catch (error) {
    if (error instanceof FamilyRestoreError) throw error;
    throw new FamilyRestoreError(error instanceof Error ? error.message : "Backup verification expired.", false);
  }
}

/** Replace everything on this computer with a decrypted backup. */
export async function restoreContents(text: string, current: CurrentLibrary, authorization: () => void = () => {}): Promise<{ students: number; courses: number }> {
  return applyContents(text, current, authorization);
}
async function applyContents(
  text: string,
  current: CurrentLibrary,
  authorization: () => void,
  beforeMutations: () => Promise<void> = async () => {},
): Promise<{ students: number; courses: number }> {
  let writeStarted = false;
  try {
    const session = captureLocalSession();
    const authorize = () => { session(); assertLocalAdult(); authorization(); };
    // Recovery spans several files, not one database transaction. Stop on revoked
    // authority; callers must report a partial restore and allow explicit retry.
    const checked = async <T,>(operation: () => Promise<T>): Promise<T> => {
      authorize();
      writeStarted = true;
      const result = await operation();
      authorize();
      return result;
    };
    authorize();
    const writeState = (...args: Parameters<typeof store.saveState>) => checked(() => store.saveState(...args));
    const updateState: typeof store.updateState = (name, updater) => checked(() => store.updateState(name, async old => {
      authorize();
      const next = await updater(old);
      authorize();
      return next;
    }));
    const originalFamily = await store.loadState("family");
    const { b, restoredFamily, importedWorkflow, deletedIds, classroomSubmissions, presentations, interventions, instructionalEvidence, branchingEngine, privacyState, advancedAssessment, scientificWorkspace, transactionEngine, documentEngine, courses, banks } = await validateRestoreContents(text);
    const anonymousGeneration = await store.assertAnonymousWriteLease();
    await beforeMutations();
    authorize();
    for (const c of current.courses) if (!courses.some((x) => x.id === c.id)) await checked(() => store.deleteCourse(c.id));
    for (const x of current.banks.filter((y) => !y.courseId)) if (!banks.some((y) => y.id === x.id)) await checked(() => store.deleteBank(x.id));
    for (const c of courses) await checked(() => store.saveCourse(c));
    for (const x of banks) await checked(() => store.saveBank(x));
    for (const [id, s] of Object.entries(b.students)) {
      await writeState(`progress-${id}`, JSON.stringify(s.progress));
      await updateState(`records-${id}`, async old => {
        const deleted = validateClassroomSubmissionState(await store.loadState("classroom-submissions")).deletedStudentIds ?? [];
        if (deleted.includes(id)) throw Error("A learner was deleted during backup restore; their records were not restored.");
        // Explicit backup recovery may repair quarantined records, but must invalidate open editors.
        let previousRevision = 0;
        if (old !== null) { try { previousRevision = parseRecords(old).revision ?? 0; } catch { /* explicit recovery */ } }
        return JSON.stringify(parseRecords({...s.records, revision: Math.max(previousRevision, s.records.revision ?? 0) + 1}));
      });
      if ((validateClassroomSubmissionState(await store.loadState("classroom-submissions")).deletedStudentIds ?? []).includes(id)) {
        await writeState(`records-${id}`, null);
        throw Error("A learner was deleted during backup restore; their records were removed.");
      }
      await checked(() => savePhotos(id, s.photos ?? []));
    }
    for (const [fileId, f] of Object.entries(b.files ?? {})) await checked(() => putFile(fileId, f, authorize));
    authorize();
    // Explicit profile target prevents an interrupted restore from redirecting later learner saves.
    // Preserve the existing recovery rule: a current base competency ledger wins.
    await checked(() => store.updateProfileProgress(null, current => {
      authorize();
      return { ...store.emptyProgress(), ...b.progress, anonymousGeneration, seeded: true,
        ...(current.competencies === undefined ? {} : { competencies: current.competencies }) };
    }));
    await writeState("presentations", presentations);
    await writeState("interventions", interventions);
    await writeState("document-engine", documentEngine);
    await writeState("transaction-engine", transactionEngine);
    await writeState("branching-engine", branchingEngine);
    await updateState("learner-privacy", current => JSON.stringify(restoreLearnerPrivacyLibrary(privacyState, parseLearnerPrivacyLibrary(current))));
    await writeState("advanced-assessment", advancedAssessment);
    await writeState("scientific-workspace", scientificWorkspace);
    await writeState("instructional-evidence", instructionalEvidence);
    // Always merge under CAS, including the first concurrent erasure marker.
    // A read-then-replacement-save could otherwise erase a tombstone written after
    // an empty preflight read. Legacy backups clear evidence, not erasure history.
    await updateState("classroom-submissions", old => {
      const current = validateClassroomSubmissionState(old), imported = validateClassroomSubmissionState(classroomSubmissions);
      const deletedStudentIds = [...new Set([...(current.deletedStudentIds ?? []), ...deletedIds])];
      if (deletedStudentIds.some(id => b.family?.students.some(s => s.id === id) || b.students[id]))
        throw Error("This backup contains a deleted learner. Erased learner records cannot be restored to their old identity.");
      return JSON.stringify(validateClassroomSubmissionState(JSON.stringify({...imported, ...(deletedStudentIds.length ? {deletedStudentIds} : {})})));
    });
    // Even legacy backups clear unrelated classroom content without erasing deletion markers.
    // Re-read the shared deletion ledger inside CAS so an intervening erasure cannot resurrect data.
    await updateState("classroom-workflows", async old => {
      const currentWorkflows = parseClassroomWorkflowState(old);
      const latestDeleted = validateClassroomSubmissionState(await store.loadState("classroom-submissions")).deletedStudentIds ?? [];
      const deleted = [...new Set([...deletedIds, ...currentWorkflows.deletedStudentIds, ...latestDeleted])];
      if (deleted.some(id => b.family?.students.some(s => s.id === id) || b.students[id])) throw Error("A learner was deleted during restore; classroom data was not restored.");
      const restored = restoreClassroomWorkflowState(importedWorkflow, deleted);
      return JSON.stringify(parseClassroomWorkflowState({...restored, revision: Math.max(restored.revision, currentWorkflows.revision + 1)}));
    });
    // Install credentials last. Every earlier restore write is authorized against
    // the currently authenticated Family, never credentials imported by a backup.
    // The caller reloads immediately after success; imported bytes grant no session.
    if (restoredFamily) await updateState("family", async old => {
      if (old !== originalFamily) throw Error("Family changed during restore. Reload and inspect local data.");
      const latestDeleted = validateClassroomSubmissionState(await store.loadState("classroom-submissions")).deletedStudentIds ?? [];
      const workflowDeleted = parseClassroomWorkflowState(await store.loadState("classroom-workflows")).deletedStudentIds;
      if ([...latestDeleted, ...workflowDeleted].some(id => restoredFamily.students.some(s => s.id === id))) throw Error("A learner was deleted during restore; Family was not restored.");
      authorize(); return JSON.stringify(restoredFamily);
    });
    else await writeState("family", null);
    authorize();
    store.useStudentFiles(null); // retain successful recovery's existing reload contract
    return { students: Object.keys(b.students).length, courses: courses.length };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Backup recovery failed.";
    throw new FamilyRestoreError(message, writeStarted);
  }
}

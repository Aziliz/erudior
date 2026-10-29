import { parseAdvancedAssessmentLibrary, type AdvancedAssessmentLibrary } from './advancedAssessment';
import { parseScientificLibrary, type ScientificLibrary } from './scientificWorkspace';
import { parseBranchingLibrary, type BranchingLibrary } from './branchingEngine';
import { parseInstructionalLibrary, type InstructionalLibrary } from './instructionalEvidence';
import { parseTransactionLibrary, type TransactionLibrary } from './transactionEngine';
import { parseDocumentLibrary, type DocumentLibrary } from './documentEngine';
import { parseInterventionTasks } from './interventionTasks';
import { parseInterventionState, type InterventionState } from './interventions';
import { parsePresentationLibrary, type PresentationLibrary } from "./presentations";
import { parseCompetencyLedger } from "./competencyState";
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
  scientificWorkspace?: ScientificLibrary;
  /** Private requirement mappings, captured evidence and human credit review history. */
  instructionalEvidence?: InstructionalLibrary;
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
  if (progress.interventionTasks !== undefined) parseInterventionTasks(progress.interventionTasks);
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
    ...(presentations === undefined ? {} : { presentations }),
    ...(interventions === undefined ? {} : { interventions }),
    ...(documentEngine === undefined ? {} : { documentEngine }),
    ...(branchingEngine === undefined ? {} : { branchingEngine }),
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
  await store.saveProgress({ ...store.emptyProgress(), ...b.progress, seeded: true }, { replaceInterventionTasks: true });
  if (b.family) await saveFamily(b.family);
  else await store.saveState("family", null);
  await store.saveState("presentations", presentations);
  await store.saveState("interventions", interventions);
  await store.saveState("document-engine", documentEngine);
  await store.saveState("transaction-engine", transactionEngine);
  await store.saveState("branching-engine", branchingEngine);
  await store.saveState("advanced-assessment", advancedAssessment);
  await store.saveState("scientific-workspace", scientificWorkspace);
  await store.saveState("instructional-evidence", instructionalEvidence);
  await store.saveState("classroom-submissions", classroomSubmissions);
  return { students: Object.keys(b.students).length, courses: courses.length };
}

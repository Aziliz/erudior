import { TEMPORARY_GUEST } from "./guestSession";
import { parseInterventionTasks } from "./interventionTasks";
import { parseStudentWorkspace } from "./studentWorkspace";
import { parseLearningPathways } from "./learningPathways";
import { assertCourseImportPreservesFields } from "./courseImport";
import { courseFromCanonicalAuthoring } from "./canonicalAuthoring";
// Storage layer. Inside the desktop app everything goes through Rust commands
// (files in the per-user app data dir). In a plain browser (the web version, or
// `npm run dev` without Tauri) it uses IndexedDB (see webstore.ts).

import { invoke, isTauri } from "@tauri-apps/api/core";
import type { Bank, Course, Progress } from "./types";
import { parseBank, serializeBank } from "./validate";
import { normalizeCourse, serializeCourse } from "./course";
import { webReplaceAnonymous, webCompareAndSwap, webDelete, webGet, webList, webSet } from "./webstore";
import { validateCourseWork, validateWorkLessonReferences } from "./courseWork";
import { validateReaderTexts } from "./readerContent";
import { stateTransactions, validStateName } from "./stateLock";
import { parseCompetencyLedger, captureCompetencyEvidence, syncCompetencyLedger, importCompetencyHistory } from "./competencyState";
import type { Competency } from "./competencies";

export const inApp = isTauri();

const LS_BANK = "erudior.bank.";
const LS_COURSE = "erudior.course.";

export function emptyProgress(): Progress {
  return {
    version: 1,
    seeded: false,
    attempts: [],
    stats: {},
    cards: {},
    lessonsDone: {},
    plans: {},
    activity: {},
    drills: {},
  };
}

async function listRaw(kind: "banks" | "courses"): Promise<string[]> {
  if (inApp) return invoke<string[]>("list_items", { kind });
  return webList(kind === "banks" ? LS_BANK : LS_COURSE);
}

export async function listCourses(): Promise<{ courses: Course[]; broken: string[] }> {
  const courses: Course[] = [];
  const broken: string[] = [];
  for (const t of await listRaw("courses")) {
    try {
      courses.push(normalizeCourse(JSON.parse(t)));
    } catch (e) {
      broken.push(`Course: ${(e as Error).message}`);
    }
  }
  courses.sort((a, b) => a.title.localeCompare(b.title));
  return { courses, broken };
}

export async function saveCourse(course: Course): Promise<void> {
  const content = serializeCourse(course);
  if (inApp) await invoke("save_item", { kind: "courses", id: course.id, content });
  else await webSet(LS_COURSE + course.id, content);
}

export async function deleteCourse(id: string): Promise<void> {
  if (inApp) await invoke("delete_item", { kind: "courses", id });
  else await webDelete(LS_COURSE + id);
}

export async function exportCourseFile(course: Course): Promise<boolean> {
  return exportText(serializeCourse(course), `${course.id}.json`, "Erudior course");
}

export async function listBanks(): Promise<{ banks: Bank[]; broken: string[] }> {
  const texts = await listRaw("banks");
  const banks: Bank[] = [];
  const broken: string[] = [];
  for (const t of texts) {
    try {
      banks.push(parseBank(t));
    } catch (e) {
      broken.push((e as Error).message);
    }
  }
  banks.sort((a, b) => a.title.localeCompare(b.title));
  return { banks, broken };
}

export async function saveBank(bank: Bank): Promise<void> {
  const content = serializeBank(bank);
  if (inApp) await invoke("save_item", { kind: "banks", id: bank.id, content });
  else await webSet(LS_BANK + bank.id, content);
}

export async function deleteBank(id: string): Promise<void> {
  if (inApp) await invoke("delete_item", { kind: "banks", id });
  else await webDelete(LS_BANK + id);
}

// Homeschool families keep separate progress per student: progress-<id>, session-<id> and
// records-<id> next to family.json. Without a family (or before one is set up) the original
// progress.json / session.json are used.
let student: string | null = null;
let anonymousLease: number | null = null;
function anonymousGeneration(raw: string | null): number {
  const value = raw === null ? 0 : (JSON.parse(raw).anonymousGeneration ?? 0);
  if (!Number.isSafeInteger(value) || value < 0 || value >= Number.MAX_SAFE_INTEGER) throw Error("Invalid anonymous generation.");
  return value;
}
export async function anonymousDocumentGeneration():Promise<number|undefined>{
 // A later family/profile switch cannot authorize an old anonymous callback after erasure.
 if(anonymousLease!==null)await anonymousEpoch();
 if(student!==null||await loadState("family")!==null)return undefined;
 return anonymousEpoch();
}
export async function assertAnonymousWriteLease():Promise<number>{ return anonymousEpoch(); }
async function anonymousEpoch(): Promise<number> {
  const current = anonymousGeneration(await loadState("progress"));
  if (anonymousLease === null) anonymousLease = current;
  if (anonymousLease !== current) throw Error("Anonymous data was erased or recovered. Reload this view before saving.");
  return current;
}
async function guardedAnonymousCas(name: "progress" | "session", expected: string | null, content: string, generation: number): Promise<boolean> {
  return inApp ? invoke<boolean>("compare_and_swap_state", {name, expected, content, anonymousGeneration:generation})
    : webCompareAndSwap(`erudior.${name}`, expected, content, generation);
}


/** Point progress and session storage at a student's files (null = the single-user files). */
export function useStudentFiles(id: string | null): void {
  student = id;
}

/** The student whose files are in use (null = the single-user files). */
export const activeStudent = (): string | null => student;

/** Read a named state file (same exact allowlist as native valid_state_name). */
export async function loadState(name: string): Promise<string | null> {
  if (!validStateName(name)) throw Error("Unknown state file: " + name);
  if (inApp) return invoke<string | null>("load_state", { name });
  return webGet(`erudior.${name}`);
}

// This backend must remain unlocked: stateTransactions owns the lock for the
// whole read-modify-write, and saveState joins that same serialization boundary.
const namedState = stateTransactions({
  read: loadState,
  async write(name, content) {
    if (inApp) return invoke<void>("save_state", { name, content });
    if (content === null) await webDelete(`erudior.${name}`);
    else await webSet(`erudior.${name}`, content);
  },
  compareAndSwap: (name: string, expected: string | null, content: string) => inApp
    ? invoke<boolean>("compare_and_swap_state", { name, expected, content })
    : webCompareAndSwap(`erudior.${name}`, expected, content),
});

/** Write/delete a named state file, serialized with updateState callers. */
export const saveState = (name: string, content: string | null): Promise<void> => name === "progress" || name === "session" ? saveAnonymousState(name, content) : namedState.save(name, content);
async function saveAnonymousState(name:"progress"|"session",content:string|null):Promise<void>{
  if(name === "session")return saveAnonymousSession(content);
  await updateState(name,()=>content??JSON.stringify(emptyProgress()));
}

/** Atomically read/transform/write one named state. The updater must be pure,
 * may be retried on contention, and must not call saveState/updateState.
 * Browser CAS uses one IndexedDB transaction across tabs, even without Web Locks.
 * Native CAS protects webviews in one app process, not separate app processes. */
export const updateState = (name: string, updater: (old: string | null) => string | Promise<string>): Promise<string> => name === "progress" || name === "session" ? updateAnonymousState(name,updater) : namedState.update(name,updater);
async function updateAnonymousState(name:"progress"|"session",updater:(old:string|null)=>string|Promise<string>):Promise<string>{
  const epoch = await anonymousEpoch();
  for (let retry=0;retry<16;retry++) {
    const old = await loadState(name), content = await updater(old);
    if (name === "progress" && anonymousGeneration(content) !== epoch) throw Error("Stale anonymous progress cannot replace erased data.");
    if (await guardedAnonymousCas(name,old,content,epoch)) return content;
  }
  throw Error("Anonymous data changed repeatedly; reload before retrying.");
}

function parseProgress(text: string | null): Progress {
  if (!text) return emptyProgress();
  let p: Progress;
  try { p = JSON.parse(text) as Progress; } catch { return emptyProgress(); }
  if (p.competencies !== undefined) parseCompetencyLedger(p.competencies);
  if (p.interventionTasks !== undefined) parseInterventionTasks(p.interventionTasks);
  if (p.learningPathways !== undefined) parseLearningPathways(p.learningPathways);
  if (p.studentWorkspace !== undefined) parseStudentWorkspace(p.studentWorkspace);
  if (p.anonymousGeneration !== undefined) anonymousGeneration(text);
  return { ...emptyProgress(), ...p };
}
function profileName(id: string | null): string {
  if (id !== null && !/^[a-z0-9]{1,24}$/.test(id)) throw Error("Invalid learner profile.");
  return id === null ? "progress" : `progress-${id}`;
}
/** Explicit profile scope never follows a later active-student switch. */
export async function loadProfileProgress(id: string | null): Promise<Progress> {
  const raw = await loadState(profileName(id));
  if (id === null && anonymousLease === null) anonymousLease = anonymousGeneration(raw);
  return parseProgress(raw);
}
export async function updateProfileProgress(id: string | null, change: (current: Progress) => Progress | Promise<Progress>): Promise<Progress> {
  const name = profileName(id);
  const text = await updateState(name, async old => {
    // Refuse damaged JSON rather than overwriting it through an empty fallback.
    if (old !== null) JSON.parse(old);
    const next = await change(parseProgress(old));
    if (next.competencies !== undefined) parseCompetencyLedger(next.competencies);
    if (next.interventionTasks !== undefined) parseInterventionTasks(next.interventionTasks);
    if (next.learningPathways !== undefined) parseLearningPathways(next.learningPathways);
    if (next.studentWorkspace !== undefined) parseStudentWorkspace(next.studentWorkspace);
    return JSON.stringify(next);
  });
  return parseProgress(text);
}
export const loadBaseProgress = (): Promise<Progress> => loadProfileProgress(null);
export const loadProgress = (): Promise<Progress> => loadProfileProgress(student);
/** Read/capture/merge runs against current storage under the profile CAS boundary. */
export async function competencyProfileExists(id: string): Promise<boolean> {
  if (!/^[a-z0-9]{1,24}$/.test(id)) return false;
  const tombstones = await loadState("classroom-submissions");
  if (tombstones && JSON.parse(tombstones).deletedStudentIds?.includes(id)) return false;
  const text = await loadState("family"), family = text ? JSON.parse(text) : null;
  return Array.isArray(family?.students) && family.students.some((s: {id?:unknown}) => s.id === id);
}
export async function syncCompetencyState(id: string | null, graph: Competency[], courses: Course[]): Promise<Progress> {
  const exists = async () => { if (id !== null && !await competencyProfileExists(id)) throw Error("This learner profile was deleted or no longer exists."); };
  await exists();
  return updateProfileProgress(id, async current => {
    await exists(); const capture = await captureCompetencyEvidence(graph,courses,current); await exists();
    return syncCompetencyLedger(current,capture);
  });
}
/** Other learner writes must not erase newer durable evidence or adult decisions. */
interface SaveProgressOptions {
  replaceCompetencies?: boolean;
  replaceInterventionTasks?: boolean;
  replaceLearningPathways?: boolean;
  replaceStudentWorkspace?: boolean;
}

function mergeSavedProgress(p: Progress, current: Progress, options: SaveProgressOptions): Progress {
  return { ...p,
    ...(!options.replaceCompetencies && current.competencies !== undefined ? { competencies: current.competencies } : {}),
    ...(!options.replaceInterventionTasks && current.interventionTasks !== undefined ? { interventionTasks: current.interventionTasks } : {}),
    // Pathway edits use the profile CAS updater. Unrelated activity saves cannot erase a
    // newer plan or resurrect one that the learner has removed, including absent legacy state.
    ...(!options.replaceLearningPathways ? { learningPathways: current.learningPathways } : {}),
    ...(!options.replaceStudentWorkspace ? { studentWorkspace: current.studentWorkspace } : {}),
  };
}

export async function saveProgress(p: Progress, options: SaveProgressOptions = {}): Promise<void> {
  if (p.competencies !== undefined) parseCompetencyLedger(p.competencies);
  if (p.interventionTasks !== undefined) parseInterventionTasks(p.interventionTasks);
  if (p.learningPathways !== undefined) parseLearningPathways(p.learningPathways);
  if (p.studentWorkspace !== undefined) parseStudentWorkspace(p.studentWorkspace);
  const selected = student;
  await updateProfileProgress(selected, current => mergeSavedProgress(p, current, options));
}

/** Ask the user for a bank or course file. Returns its text, or null if cancelled. */
export async function pickJsonFile(): Promise<string | null> {
  if (inApp) {
    const { open } = await import("@tauri-apps/plugin-dialog");
    const path = await open({
      multiple: false,
      directory: false,
      filters: [{ name: "Erudior course or question bank", extensions: ["json"] }],
    });
    if (!path || Array.isArray(path)) return null;
    return invoke<string>("read_text_file", { path });
  }
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,application/json";
    // Closing a picker must release callers' busy/navigation guards as well.
    input.addEventListener("cancel", () => resolve(null), { once: true });
    input.onchange = () => {
      const f = input.files?.[0];
      if (!f) return resolve(null);
      f.text().then(resolve, () => resolve(null));
    };
    input.click();
  });
}

/** Save a bank to a file the user chooses. Returns false if cancelled. */
export async function exportBankFile(bank: Bank): Promise<boolean> {
  return exportText(serializeBank(bank), `${bank.id}.json`, "Erudior question bank");
}

export async function exportText(content: string, name: string, label: string, ext = "json"): Promise<boolean> {
  if (inApp) {
    const { save } = await import("@tauri-apps/plugin-dialog");
    const path = await save({ defaultPath: name, filters: [{ name: label, extensions: [ext] }] });
    if (!path) return false;
    await invoke("write_text_file", { path, content });
    return true;
  }
  const url = URL.createObjectURL(new Blob([content], { type: ext === "csv" ? "text/csv" : "application/json" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
  return true;
}

/** Save binary data (e.g. a speaking-practice recording) to a file the user chooses. */
export async function saveBlob(blob: Blob, name: string, label: string, ext: string): Promise<boolean> {
  if (inApp) {
    const { save } = await import("@tauri-apps/plugin-dialog");
    const path = await save({ defaultPath: name, filters: [{ name: label, extensions: [ext] }] });
    if (!path) return false;
    const bytes = new Uint8Array(await blob.arrayBuffer());
    let bin = "";
    for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    await invoke("write_base64_file", { path, data: btoa(bin) });
    return true;
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
  return true;
}

export interface Backup {
  format: "erudior-backup";
  version: 1;
  createdAt: string;
  progress: Progress;
  courses: unknown[];
  banks: unknown[];
  /** Photos and files attached to writing, labs and activity logs, by file id. */
  files?: Record<string, { mime: string; data: string }>;
}

/** Save everything (courses, banks, progress) to one file the user picks. */
export async function exportBackup(courses: Course[], banks: Bank[], progress: Progress): Promise<boolean> {
  if (progress.competencies !== undefined) parseCompetencyLedger(progress.competencies);
  if (progress.interventionTasks !== undefined) parseInterventionTasks(progress.interventionTasks);
  if (progress.learningPathways !== undefined) parseLearningPathways(progress.learningPathways);
  if (progress.studentWorkspace !== undefined) parseStudentWorkspace(progress.studentWorkspace);
  const backup: Backup = {
    format: "erudior-backup",
    version: 1,
    createdAt: new Date().toISOString(),
    progress,
    courses: courses.map((c) => JSON.parse(serializeCourse(c))),
    banks: banks.map((b) => JSON.parse(serializeBank(b))),
  };
  // Loaded on demand: documents.ts and work.ts import this module.
  const [{ loadFile }, { workFileIds }] = await Promise.all([import("./documents"), import("./work")]);
  const files: NonNullable<Backup["files"]> = {};
  for (const id of workFileIds(progress)) {
    const f = await loadFile(id).catch(() => null);
    if (f) files[id] = f;
  }
  if (Object.keys(files).length) backup.files = files;
  const day = new Date().toISOString().slice(0, 10);
  return exportText(JSON.stringify(backup), `erudior-backup-${day}.json`, "Erudior backup");
}

/** Replace all stored data with a backup. Returns counts restored. */
export async function restoreBackup(
  raw: unknown,
  current: { courses: Course[]; banks: Bank[] },
): Promise<{ courses: number; banks: number }> {
  const targetStudent = student;
  if(targetStudent===null)await assertAnonymousWriteLease();
  const b = raw as Backup;
  if (!b || b.format !== "erudior-backup" || !b.progress) throw new Error("This isn't an Erudior backup file.");
  if (b.progress.competencies !== undefined) parseCompetencyLedger(b.progress.competencies);
  if (b.progress.interventionTasks !== undefined) parseInterventionTasks(b.progress.interventionTasks);
  if (b.progress.learningPathways !== undefined) parseLearningPathways(b.progress.learningPathways);
  if (b.progress.studentWorkspace !== undefined) parseStudentWorkspace(b.progress.studentWorkspace);
  const currentProgress = await loadProfileProgress(targetStudent);
  const importedCompetencies = importCompetencyHistory(b.progress.competencies,currentProgress.competencies);
  // Historical evidence must remain independently verifiable, including legacy
  // unencrypted backups. Preflight both ledgers before touching stored state.
  const [{ mergeAssessedWorkSubmissions }, { mergeSpreadsheetSubmissions }] = await Promise.all([
    import("./assessedWorkEvidence"), import("./spreadsheetEvidence"),
  ]);
  if (b.progress.assessedWorkSubmissions !== undefined) mergeAssessedWorkSubmissions({}, b.progress.assessedWorkSubmissions);
  if (b.progress.spreadsheetSubmissions !== undefined) mergeSpreadsheetSubmissions({}, b.progress.spreadsheetSubmissions);
  // Validate every raw work collection before normalization or any deletion/write.
  const courses = b.courses.map(rawCourse => {
    const source = (rawCourse as { format?: string } | null)?.format === "erudior-canonical-authoring"
      ? courseFromCanonicalAuthoring(rawCourse, { mode: "source", maxBytes: Number.MAX_SAFE_INTEGER }) : rawCourse;
    const rawErrors = [...validateCourseWork(source, { legacy: true }), ...validateReaderTexts((source as { texts?: unknown } | null)?.texts, { legacy: true })];
    if (rawErrors.length) throw Error("Invalid backup course work: " + rawErrors.join("; "));
    try { assertCourseImportPreservesFields(rawCourse); } catch (error) { throw new Error("Invalid backup course work: " + (error as Error).message); }
    const course = normalizeCourse(rawCourse);
    const errors = [...validateCourseWork(course, { moduleIds: course.modules.map(module => module.id) }), ...validateWorkLessonReferences(course, course.lessons), ...validateReaderTexts(course.texts, { questionIds: course.banks[0]?.questions.map(question => question.id) ?? [] })];
    if (errors.length) throw Error("Invalid backup course work: " + errors.join("; "));
    return course;
  });
  const banks = b.banks.map((x) => parseBank(JSON.stringify(x)));
  for (const c of current.courses) if (!courses.some((x) => x.id === c.id)) await deleteCourse(c.id);
  for (const x of current.banks) if (!banks.some((y) => y.id === x.id)) await deleteBank(x.id);
  for (const c of courses) await saveCourse(c);
  for (const x of banks) await saveBank(x);
  if (b.files) {
    const { putFile } = await import("./documents");
    for (const [id, file] of Object.entries(b.files)) if (/^[a-z0-9]{1,64}$/.test(id) && file?.data) await putFile(id, file);
  }
  await updateProfileProgress(targetStudent, async current => {
    if(targetStudent !== null && !await competencyProfileExists(targetStudent))throw Error("This learner profile no longer exists.");
    return mergeSavedProgress(
      {...emptyProgress(), ...b.progress, ...(targetStudent===null?{anonymousGeneration:current.anonymousGeneration??0}:{}), competencies:importCompetencyHistory(importedCompetencies,current.competencies), seeded:true},
      current,
      {replaceCompetencies:true, replaceInterventionTasks:true, replaceLearningPathways:true, replaceStudentWorkspace:true},
    );
  });
  return { courses: courses.length, banks: banks.length };
}

/** The in-progress session (exam or practice), or null. */
export async function loadSessionState(): Promise<string | null> {
  if (student) return loadState(`session-${student}`);
  const epoch = await anonymousEpoch();
  return unwrapAnonymousSession(await loadState("session"),epoch);
}
function unwrapAnonymousSession(raw:string|null,epoch:number):string|null {
  if (raw === null) return null;
  const value=JSON.parse(raw);
  if (value?.format === "erudior-anonymous-session") return value.generation === epoch && (value.content === null || typeof value.content === "string") ? value.content : null;
  return epoch === 0 ? raw : null;
}
async function saveAnonymousSession(content:string|null):Promise<void> {
  const epoch=await anonymousEpoch(), wrapped=JSON.stringify({format:"erudior-anonymous-session",version:1,generation:epoch,content});
  for(let retry=0;retry<16;retry++) { const old=await loadState("session"); if(await guardedAnonymousCas("session",old,wrapped,epoch)) return; }
  throw Error("Anonymous session changed repeatedly.");
}

export async function saveSessionState(content: string | null): Promise<void> {
  return saveState(student ? `session-${student}` : "session", content);
}

export async function confirmAction(message: string, title = "Erudior"): Promise<boolean> {
  if (inApp) {
    const { ask } = await import("@tauri-apps/plugin-dialog");
    return ask(message, { title, kind: "warning" });
  }
  return window.confirm(message);
}

export async function dataLocation(): Promise<string> {
  return inApp ? invoke<string>("data_location") : TEMPORARY_GUEST ? "this temporary page's memory (lost on refresh or close; saved device progress is untouched)" : "this browser's storage (web version; not synced with the desktop app)";
}

export interface AnonymousPrivacySnapshot {
 progress:Progress;session:string|null;files:Record<string,import('./documents').StoredDocument>;missingFiles:string[];
 generation:number;progressDigest:string;sessionDigest:string;privacyDigest:string;anonymousAssociation:boolean;anonymousPending:boolean;
}
export type AnonymousPrivacyExpected=Pick<AnonymousPrivacySnapshot,'generation'|'progressDigest'|'sessionDigest'|'privacyDigest'>;
async function anonymousDigest(raw:string|null):Promise<string>{const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(raw??'null'));return Array.from(new Uint8Array(bytes),x=>x.toString(16).padStart(2,'0')).join('');}
async function requireAnonymous():Promise<void>{if(student!==null||await loadState('family')!==null)throw Error('This action is only available for anonymous local data without a family.');}
async function anonymousRaw(){await requireAnonymous();const progress=await loadState('progress'),session=await loadState('session');await requireAnonymous();return {progress,session};}
export async function readAnonymousPrivacy():Promise<AnonymousPrivacySnapshot>{
 const raw=await anonymousRaw(),progress=parseProgress(raw.progress),generation=anonymousGeneration(raw.progress);
 if(anonymousLease===null)anonymousLease=generation;
 const {anonymousFileIds,parseAnonymousProgress,parseAnonymousSession}=await import('./anonymousPrivacy');parseAnonymousProgress(progress);parseAnonymousSession(unwrapAnonymousSession(raw.session,generation));
 const {loadFile}=await import('./documents');const files:AnonymousPrivacySnapshot['files']={},missingFiles:string[]=[];
 for(const id of anonymousFileIds(progress)){const file=await loadFile(id);if(file)files[id]=file;else missingFiles.push(id);}
 const privacyRaw=await loadState('learner-privacy');const {parseLearnerPrivacyLibrary}=await import('./learnerPrivacyStore');const profile=parseLearnerPrivacyLibrary(privacyRaw).profiles.find(p=>p.studentId===null);
 const latest=await anonymousRaw();if(latest.progress!==raw.progress||latest.session!==raw.session)throw Error('Anonymous data changed during inventory. Inspect again.');
 return {progress,session:unwrapAnonymousSession(raw.session,generation),files,missingFiles,generation,progressDigest:await anonymousDigest(raw.progress),sessionDigest:await anonymousDigest(raw.session),privacyDigest:await anonymousDigest(privacyRaw),anonymousAssociation:!!profile?.consent,anonymousPending:!!profile?.pending};
}
async function replaceAnonymous(expected:AnonymousPrivacyExpected,next:Progress,session:string|null,fileIds:string[],guard?:()=>void|Promise<void>,files:Record<string,import('./documents').StoredDocument>={}):Promise<{progress:Progress;retainedFileIds:string[]}>{
 const raw=await anonymousRaw();if(anonymousGeneration(raw.progress)!==expected.generation||await anonymousDigest(raw.progress)!==expected.progressDigest||await anonymousDigest(raw.session)!==expected.sessionDigest)throw Error('Anonymous data changed. Inspect again before replacing it.');
 const expectedPrivacy=await loadState('learner-privacy');if(await anonymousDigest(expectedPrivacy)!==expected.privacyDigest)throw Error('Anonymous privacy settings changed. Inspect again.');const {parseLearnerPrivacyLibrary}=await import('./learnerPrivacyStore');const privacy=parseLearnerPrivacyLibrary(expectedPrivacy);const privacyContent=JSON.stringify(parseLearnerPrivacyLibrary({...privacy,revision:privacy.revision+1,profiles:privacy.profiles.filter(p=>p.studentId!==null)}));
 const progress={...next,anonymousGeneration:expected.generation+1},content=JSON.stringify(progress),wrapped=JSON.stringify({format:'erudior-anonymous-session',version:1,generation:expected.generation+1,content:session});
 await requireAnonymous();await guard?.();
 const retainedFileIds=inApp?await invoke<string[]>('replace_anonymous_state',{expectedProgress:raw.progress,expectedSession:raw.session,progress:content,session:wrapped,fileIds,files,expectedPrivacy,privacy:privacyContent}):(await webReplaceAnonymous(raw.progress,raw.session,content,wrapped,fileIds,files,expectedPrivacy,privacyContent)).retainedFileIds;
 // Intentionally do not advance this realm's write lease: stale timers/components must reload.
 return {progress,retainedFileIds};
}
export async function eraseAnonymousPrivacy(expected:AnonymousPrivacyExpected,guard?:()=>void|Promise<void>):Promise<{progress:Progress;retainedFileIds:string[]}>{
 const snapshot=await readAnonymousPrivacy();const {anonymousFileIds}=await import('./anonymousPrivacy');
 const p=snapshot.progress;return replaceAnonymous(expected,{...emptyProgress(),seeded:p.seeded,...(p.seededCourses?{seededCourses:p.seededCourses}:{}),...(p.catalogV1===undefined?{}:{catalogV1:p.catalogV1}),...(p.theme?{theme:p.theme}:{})},null,anonymousFileIds(p),guard);
}
export async function recoverAnonymousPrivacy(expected:AnonymousPrivacyExpected,progress:Progress,session:string|null,files:Record<string,import('./documents').StoredDocument>,guard?:()=>void|Promise<void>):Promise<{progress:Progress;retainedFileIds:string[]}>{
 await requireAnonymous();const current=await readAnonymousPrivacy();if(current.generation!==expected.generation||current.progressDigest!==expected.progressDigest||current.sessionDigest!==expected.sessionDigest||current.privacyDigest!==expected.privacyDigest)throw Error('Anonymous data changed. Preview recovery again.');
 const {parseAnonymousProgress,anonymousFileIds,inventoryAnonymousData}=await import('./anonymousPrivacy');parseAnonymousProgress(progress);inventoryAnonymousData(progress,session,files);
 const ids=new Set(anonymousFileIds(progress));if(Object.keys(files).some(id=>!ids.has(id)))throw Error('Recovery contains unrelated attachments.');
 // The backend preflights every attachment and commits bytes with the scoped replacement.
 return replaceAnonymous(expected,progress,session,anonymousFileIds(current.progress).filter(id=>!ids.has(id)),guard,files);
}

/** User-picked course files only; Android uses scoped ContentResolver rather than filesystem URI guessing. */
export async function pickPortableCourseFile(): Promise<string | null> {
  if (inApp) return invoke<string | null>('pick_portable_course');
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = '.json,application/json';
    input.addEventListener('cancel', () => resolve(null), { once: true });
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return resolve(null);
      if (file.size > 24 * 1024 * 1024) return reject(Error('Course file exceeds the 24 MiB limit.'));
      file.arrayBuffer().then(buffer => {
        try { resolve(new TextDecoder('utf-8', { fatal: true }).decode(buffer)); }
        catch { reject(Error('Course file must be valid UTF-8.')); }
      }, reject);
    };
    input.click();
  });
}
export async function exportPortableCourseText(content: string, name: string, _label = 'Erudior offline course'): Promise<boolean> {
  if (new TextEncoder().encode(content).length > 24 * 1024 * 1024) throw Error('Course package exceeds the 24 MiB limit.');
  if (inApp) return invoke<boolean>('export_portable_course', { content, name });
  return exportText(content, name, 'Erudior offline course');
}

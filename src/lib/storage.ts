// Storage layer. Inside the desktop app everything goes through Rust commands
// (files in the per-user app data dir). In a plain browser (the web version, or
// `npm run dev` without Tauri) it uses IndexedDB (see webstore.ts).

import { invoke, isTauri } from "@tauri-apps/api/core";
import type { Bank, Course, Progress } from "./types";
import { parseBank, serializeBank } from "./validate";
import { normalizeCourse, serializeCourse } from "./course";
import { webDelete, webGet, webList, webSet } from "./webstore";

export const inApp = isTauri();

const LS_BANK = "examiner.bank.";
const LS_COURSE = "examiner.course.";
const LS_PROGRESS = "examiner.progress";

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

/** Point progress and session storage at a student's files (null = the single-user files). */
export function useStudentFiles(id: string | null): void {
  student = id;
}

/** Read a named state file (see valid_state_name in lib.rs). */
export async function loadState(name: string): Promise<string | null> {
  if (inApp) return invoke<string | null>("load_state", { name });
  return webGet(`examiner.${name}`);
}

/** Write a named state file, or delete it when content is null. */
export async function saveState(name: string, content: string | null): Promise<void> {
  if (inApp) return invoke("save_state", { name, content });
  if (content === null) await webDelete(`examiner.${name}`);
  else await webSet(`examiner.${name}`, content);
}

function parseProgress(text: string | null): Progress {
  if (!text) return emptyProgress();
  try {
    const p = JSON.parse(text) as Progress;
    return { ...emptyProgress(), ...p };
  } catch {
    return emptyProgress();
  }
}

/** The single-user progress file (progress.json), whatever student is active. */
export async function loadBaseProgress(): Promise<Progress> {
  return parseProgress(inApp ? await invoke<string | null>("load_progress") : await webGet(LS_PROGRESS));
}

export async function loadProgress(): Promise<Progress> {
  if (student) return parseProgress(await loadState(`progress-${student}`));
  return loadBaseProgress();
}

export async function saveProgress(p: Progress): Promise<void> {
  const content = JSON.stringify(p);
  if (student) await saveState(`progress-${student}`, content);
  else if (inApp) await invoke("save_progress", { content });
  else await webSet(LS_PROGRESS, content);
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
  format: "examiner-backup";
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
  const backup: Backup = {
    format: "examiner-backup",
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
  const b = raw as Backup;
  if (!b || b.format !== "examiner-backup" || !b.progress) throw new Error("This isn't an Erudior backup file.");
  const courses = b.courses.map((c) => normalizeCourse(c));
  const banks = b.banks.map((x) => parseBank(JSON.stringify(x)));
  for (const c of current.courses) if (!courses.some((x) => x.id === c.id)) await deleteCourse(c.id);
  for (const x of current.banks) if (!banks.some((y) => y.id === x.id)) await deleteBank(x.id);
  for (const c of courses) await saveCourse(c);
  for (const x of banks) await saveBank(x);
  if (b.files) {
    const { putFile } = await import("./documents");
    for (const [id, file] of Object.entries(b.files)) if (/^[a-z0-9]{1,64}$/.test(id) && file?.data) await putFile(id, file);
  }
  await saveProgress({ ...emptyProgress(), ...b.progress, seeded: true });
  return { courses: courses.length, banks: banks.length };
}

/** The in-progress session (exam or practice), or null. */
export async function loadSessionState(): Promise<string | null> {
  return loadState(student ? `session-${student}` : "session");
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
  return inApp ? invoke<string>("data_location") : "this browser's storage (web version; not synced with the desktop app)";
}

// Attached documents for homeschool records (notice of intent, test reports, immunization or
// exemption forms, approval letters…). The file itself is stored once as base64 in
// documents/<fileId>.json; each student's records list the documents that apply to them.

import { invoke } from "@tauri-apps/api/core";
import { inApp } from "./storage";
import { webDelete, webGet, webSet } from "./webstore";
import { uid } from "./util";

export const DOC_KINDS = [
  "Notice of intent or affidavit",
  "Approval or acknowledgment letter",
  "Test results",
  "Evaluation or assessment",
  "Immunization record or exemption",
  "Instruction plan (e.g. IHIP)",
  "Quarterly or progress report",
  "Other",
] as const;

/** Files bigger than this aren't accepted (they'd make backups unwieldy). */
export const MAX_DOC_BYTES = 15 * 1024 * 1024;

export interface DocumentRef {
  id: string;
  /** Shared by students when one file is attached to several. */
  fileId: string;
  name: string;
  mime: string;
  bytes: number;
  kind: string;
  /** Date on the document (filed, received, tested). */
  date: string;
  note: string;
}

const WEB_KEY = "erudior.document.";

function toB64(bytes: Uint8Array): string {
  let s = "";
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s);
}

export interface StoredDocument { mime: string; data: string }
export interface DocumentBackend {
  read(id: string): Promise<string | null>;
  write(id: string, content: string): Promise<void>;
  remove(id: string): Promise<void>;
}
const documentTails = new Map<string, Promise<void>>();
const checkFileId = (id: string) => {
  if (!/^[A-Za-z0-9_-]{1,100}$/.test(id)) throw Error("Invalid document ID");
};
function documentContent(file: StoredDocument): string {
  if (!file || typeof file.mime !== "string" || typeof file.data !== "string"
      || Object.keys(file).some(key => key !== "mime" && key !== "data")
      || !/^[a-zA-Z0-9!#$&^_.+-]+\/[a-zA-Z0-9!#$&^_.+-]+$/.test(file.mime) || file.mime.length > 200
      || file.data.length > Math.ceil(MAX_DOC_BYTES / 3) * 4 || file.data.length % 4 !== 0
      || /[^A-Za-z0-9+/=]/.test(file.data) || !/^[^=]*={0,2}$/.test(file.data)) throw Error("Invalid document data");
  return JSON.stringify({ mime: file.mime, data: file.data });
}
/** All replacement, preserving-import and deletion paths share this boundary.
 * Web Locks serialize cooperating tabs/webviews where available. Without them,
 * including native webviews without Web Locks, protection is same-JS-realm only;
 * this is not an inter-process or native-backend compare-and-swap guarantee. */
async function withDocumentLock<T>(id: string, run: () => Promise<T>): Promise<T> {
  checkFileId(id);
  const previous = documentTails.get(id) ?? Promise.resolve();
  let release!: () => void;
  const next = new Promise<void>(resolve => { release = resolve; });
  documentTails.set(id, next);
  await previous;
  try {
    return typeof navigator !== "undefined" && navigator.locks?.request
      ? await navigator.locks.request(`erudior.document.${id}`, { mode: "exclusive" }, run)
      : await run();
  } finally {
    release();
    if (documentTails.get(id) === next) documentTails.delete(id);
  }
}

/** Injectable backend keeps race/error tests independent of IndexedDB and Tauri. */
export function documentTransactions(backend: DocumentBackend) {
  return {
    put(id: string, file: StoredDocument): Promise<void> {
      const content = documentContent(file); // capture before any await
      return withDocumentLock(id, () => backend.write(id, content));
    },
    preserve(id: string, file: StoredDocument): Promise<void> {
      const content = documentContent(file);
      return withDocumentLock(id, async () => {
        const existing = await backend.read(id);
        if (existing !== null) {
          let same = false;
          try { same = documentContent(JSON.parse(existing)) === content; } catch { /* corrupt originals are retained */ }
          if (!same) throw Error("A different document already uses this ID. Existing evidence was not replaced.");
          return;
        }
        await backend.write(id, content);
      });
    },
    remove(id: string): Promise<void> { return withDocumentLock(id, () => backend.remove(id)); },
  };
}
const rawDocumentBackend: DocumentBackend = {
  read: id => inApp ? invoke<string | null>("load_item", { kind: "documents", id }) : webGet(WEB_KEY + id),
  async write(id, content) {
    if (inApp) await invoke("save_item", { kind: "documents", id, content });
    else await webSet(WEB_KEY + id, content);
  },
  async remove(id) {
    if (inApp) await invoke("delete_item", { kind: "documents", id });
    else await webDelete(WEB_KEY + id);
  },
};
const documentStore = documentTransactions(rawDocumentBackend);

export async function storeFile(file: File): Promise<{ fileId: string; mime: string; bytes: number; name: string }> {
  if (file.size > MAX_DOC_BYTES) throw new Error(`${file.name} is over 15 MB. Scan at a lower resolution or save as PDF.`);
  const fileId = uid("f").toLowerCase();
  const mime = file.type || "application/octet-stream";
  await putFilePreserving(fileId, { mime, data: toB64(new Uint8Array(await file.arrayBuffer())) });
  return { fileId, mime, bytes: file.size, name: file.name };
}

export async function loadFile(fileId: string): Promise<StoredDocument | null> {
  checkFileId(fileId);
  const text = await rawDocumentBackend.read(fileId);
  return text ? (JSON.parse(text) as StoredDocument) : null;
}

export const deleteFile = (fileId: string): Promise<void> => documentStore.remove(fileId);

/** Explicit backup restore retains replacement semantics, under the same ID lock. */
export const putFile = (fileId: string, file: StoredDocument): Promise<void> => documentStore.put(fileId, file);

/** Classroom import: identical content is idempotent; conflicting evidence fails closed. */
export const putFilePreserving = (fileId: string, file: StoredDocument): Promise<void> => documentStore.preserve(fileId, file);

/** Save a copy where the parent chooses. Returns false if cancelled. */
export async function saveCopy(ref: DocumentRef): Promise<boolean> {
  const f = await loadFile(ref.fileId);
  if (!f) throw new Error("This file is missing from the computer.");
  if (inApp) {
    const { save } = await import("@tauri-apps/plugin-dialog");
    const ext = ref.name.includes(".") ? ref.name.split(".").pop()! : "bin";
    const path = await save({ defaultPath: ref.name, filters: [{ name: ref.kind, extensions: [ext] }] });
    if (!path) return false;
    await invoke("write_base64_file", { path, data: f.data });
    return true;
  }
  const a = document.createElement("a");
  a.href = `data:${f.mime};base64,${f.data}`;
  a.download = ref.name;
  a.click();
  return true;
}

export const newDocRef = (r: Omit<DocumentRef, "id">): DocumentRef => ({ ...r, id: uid("d") });

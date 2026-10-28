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

export async function storeFile(file: File): Promise<{ fileId: string; mime: string; bytes: number; name: string }> {
  if (file.size > MAX_DOC_BYTES) throw new Error(`${file.name} is over 15 MB. Scan at a lower resolution or save as PDF.`);
  const fileId = uid("f").toLowerCase();
  const mime = file.type || "application/octet-stream";
  const content = JSON.stringify({ mime, data: toB64(new Uint8Array(await file.arrayBuffer())) });
  if (inApp) await invoke("save_item", { kind: "documents", id: fileId, content });
  else await webSet(WEB_KEY + fileId, content);
  return { fileId, mime, bytes: file.size, name: file.name };
}

export async function loadFile(fileId: string): Promise<{ mime: string; data: string } | null> {
  const text = inApp ? await invoke<string | null>("load_item", { kind: "documents", id: fileId }) : await webGet(WEB_KEY + fileId);
  return text ? (JSON.parse(text) as { mime: string; data: string }) : null;
}

export async function deleteFile(fileId: string): Promise<void> {
  if (inApp) await invoke("delete_item", { kind: "documents", id: fileId });
  else await webDelete(WEB_KEY + fileId);
}

/** Restore a file from a backup under its original id. */
export async function putFile(fileId: string, file: { mime: string; data: string }): Promise<void> {
  const content = JSON.stringify(file);
  if (inApp) await invoke("save_item", { kind: "documents", id: fileId, content });
  else await webSet(WEB_KEY + fileId, content);
}

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

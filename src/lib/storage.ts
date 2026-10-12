// Storage layer. Inside the desktop app everything goes through Rust commands
// (files in the per-user app data dir). In a plain browser (`npm run dev`
// without Tauri) it falls back to localStorage so the UI can be worked on.

import { invoke, isTauri } from "@tauri-apps/api/core";
import type { Bank, Progress } from "./types";
import { parseBank, serializeBank } from "./validate";

export const inApp = isTauri();

const LS_BANK = "examiner.bank.";
const LS_PROGRESS = "examiner.progress";

export function emptyProgress(): Progress {
  return { version: 1, seeded: false, attempts: [], stats: {} };
}

export async function listBanks(): Promise<{ banks: Bank[]; broken: string[] }> {
  const texts: string[] = inApp
    ? await invoke<string[]>("list_banks")
    : Object.keys(localStorage)
        .filter((k) => k.startsWith(LS_BANK))
        .map((k) => localStorage.getItem(k) ?? "");
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
  if (inApp) await invoke("save_bank", { id: bank.id, content });
  else localStorage.setItem(LS_BANK + bank.id, content);
}

export async function deleteBank(id: string): Promise<void> {
  if (inApp) await invoke("delete_bank", { id });
  else localStorage.removeItem(LS_BANK + id);
}

export async function loadProgress(): Promise<Progress> {
  const text = inApp ? await invoke<string | null>("load_progress") : localStorage.getItem(LS_PROGRESS);
  if (!text) return emptyProgress();
  try {
    const p = JSON.parse(text) as Progress;
    return { ...emptyProgress(), ...p };
  } catch {
    return emptyProgress();
  }
}

export async function saveProgress(p: Progress): Promise<void> {
  const content = JSON.stringify(p);
  if (inApp) await invoke("save_progress", { content });
  else localStorage.setItem(LS_PROGRESS, content);
}

/** Ask the user for a bank file. Returns its text, or null if cancelled. */
export async function pickBankFile(): Promise<string | null> {
  if (inApp) {
    const { open } = await import("@tauri-apps/plugin-dialog");
    const path = await open({
      multiple: false,
      directory: false,
      filters: [{ name: "Examiner question bank", extensions: ["json"] }],
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
  const content = serializeBank(bank);
  const name = `${bank.id}.json`;
  if (inApp) {
    const { save } = await import("@tauri-apps/plugin-dialog");
    const path = await save({
      defaultPath: name,
      filters: [{ name: "Examiner question bank", extensions: ["json"] }],
    });
    if (!path) return false;
    await invoke("write_text_file", { path, content });
    return true;
  }
  const url = URL.createObjectURL(new Blob([content], { type: "application/json" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
  return true;
}

export async function confirmAction(message: string, title = "Examiner"): Promise<boolean> {
  if (inApp) {
    const { ask } = await import("@tauri-apps/plugin-dialog");
    return ask(message, { title, kind: "warning" });
  }
  return window.confirm(message);
}

export async function dataLocation(): Promise<string> {
  return inApp ? invoke<string>("data_location") : "browser localStorage (dev mode)";
}

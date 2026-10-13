// App self-updates. Installs on Windows and AppImage; .deb/.rpm installs get a
// notice with a link to the release page, since the system package manager
// owns those files.

import { invoke } from "@tauri-apps/api/core";
import { inApp } from "./storage";

export const RELEASES_URL = "https://github.com/Aziliz/examiner/releases/latest";

/**
 * Off: the repo is private, so its releases (and latest.json) can't be fetched
 * by installed copies. To turn updates back on, publish releases somewhere
 * public, set this to true, set bundle.createUpdaterArtifacts in
 * tauri.conf.json, and add the signing secret to CI.
 */
export const UPDATES_ENABLED = false;

export type InstallKind = "windows" | "appimage" | "linux-package" | "other";

export interface AvailableUpdate {
  version: string;
  notes?: string;
  canInstall: boolean;
  install: (onProgress: (pct: number | null) => void) => Promise<void>;
}

export async function appVersion(): Promise<string> {
  if (!inApp) return "dev";
  const { getVersion } = await import("@tauri-apps/api/app");
  return getVersion();
}

export async function checkForUpdate(): Promise<AvailableUpdate | null> {
  if (!inApp || !UPDATES_ENABLED) return null;
  const { check } = await import("@tauri-apps/plugin-updater");
  const update = await check();
  if (!update) return null;
  const kind = await invoke<InstallKind>("install_kind");
  return {
    version: update.version,
    notes: update.body ?? undefined,
    canInstall: kind === "windows" || kind === "appimage",
    install: async (onProgress) => {
      let total = 0;
      let got = 0;
      await update.downloadAndInstall((e) => {
        if (e.event === "Started") total = e.data.contentLength ?? 0;
        else if (e.event === "Progress") {
          got += e.data.chunkLength;
          onProgress(total ? Math.round((got / total) * 100) : null);
        }
      });
      const { relaunch } = await import("@tauri-apps/plugin-process");
      await relaunch();
    },
  };
}

export async function openReleasesPage(): Promise<void> {
  if (!inApp) {
    window.open(RELEASES_URL, "_blank");
    return;
  }
  const { openUrl } = await import("@tauri-apps/plugin-opener");
  await openUrl(RELEASES_URL);
}

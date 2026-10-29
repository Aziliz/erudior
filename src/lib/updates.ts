// App self-updates. Installs on Windows, macOS and AppImage; .deb/.rpm installs get a
// notice with a link to the release page, since the system package manager
// owns those files. Releases (Build installers, on a v* tag) publish latest.json, signed
// with the TAURI_SIGNING_PRIVATE_KEY secret; the public key is in tauri.conf.json.

import { invoke } from "@tauri-apps/api/core";
import { inApp } from "./storage";
import { fetchAndroidRelease, verifyAndroidApk } from "./androidUpdates";

export const RELEASES_URL = "https://github.com/Aziliz/erudior/releases/latest";

/** On since v0.24.0 (the repo and its releases are public). */
export const UPDATES_ENABLED = true;

export type InstallKind = "windows" | "macos" | "appimage" | "linux-package" | "android" | "other";

export interface AvailableUpdate {
  version: string;
  notes?: string;
  canInstall: boolean;
  actionLabel?: string;
  guidance?: string;
  install: (onProgress: (pct: number | null) => void) => Promise<void>;
}

export async function appVersion(): Promise<string> {
  if (!inApp) return "dev";
  const { getVersion } = await import("@tauri-apps/api/app");
  return getVersion();
}

export async function checkForUpdate(): Promise<AvailableUpdate | null> {
  if (!inApp || !UPDATES_ENABLED) return null;
  const kind = await invoke<InstallKind>("install_kind");
  if (kind === "android") {
    const release = await fetchAndroidRelease();
    const currentBuild = import.meta.env.VITE_ANDROID_BUILD_SHA || "";
    const currentVersion = await appVersion();
    const parts = (v: string) => v.split(".").slice(0, 3).map((n) => Number.parseInt(n, 10) || 0);
    const next = parts(release.version);
    const now = parts(currentVersion);
    if (release.build === currentBuild || next.some((v, i) => v !== now[i] && next.slice(0, i).every((x, j) => x === now[j]) && v < now[i])) return null;
    return {
      version: release.version,
      notes: release.notes,
      canInstall: true,
      actionLabel: "Verify and open installer",
      guidance: "Android asks you to approve the installation. Updates signed with the same certificate retain app data.",
      install: async (progress) => {
        await verifyAndroidApk(release, progress);
        const { openUrl } = await import("@tauri-apps/plugin-opener");
        await openUrl(release.apk);
      },
    };
  }
  const { check } = await import("@tauri-apps/plugin-updater");
  const update = await check();
  if (!update) return null;
  return {
    version: update.version,
    notes: update.body ?? undefined,
    canInstall: kind === "windows" || kind === "macos" || kind === "appimage",
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

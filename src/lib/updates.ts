import { Channel, invoke } from "@tauri-apps/api/core";
import type { Release } from "./appUpdateController";
import { inApp } from "./storage";
import { validateAndroidRelease, shouldOfferAndroidUpdate } from "./androidUpdates";

export const RELEASES_URL = "https://github.com/Aziliz/erudior/releases/latest";

/** On since v0.24.0 (the repo and its releases are public). */
export const UPDATES_ENABLED = true;

export type InstallKind = "windows" | "macos" | "appimage" | "deb" | "rpm" | "linux-package" | "android" | "other";

export async function appVersion(): Promise<string> {
  if (!inApp) return "dev";
  const { getVersion } = await import("@tauri-apps/api/app");
  return getVersion();
}

export async function checkForUpdate(): Promise<Release | null> {
  if (!inApp || !UPDATES_ENABLED) return null;
  const kind = await invoke<InstallKind>("install_kind");
  if (kind === "android") {
    const release = validateAndroidRelease(JSON.parse(await invoke<string>("android_fetch_manifest")));
    const currentBuild = import.meta.env.VITE_ANDROID_BUILD_SHA || "";
    const currentVersion = await appVersion();
    if (!shouldOfferAndroidUpdate(release, currentVersion, currentBuild)) return null;
    return {
      version: release.version,
      kind: "android",
      install: async () => {
        const verified = await invoke<string>("android_download_verified_apk", { expectedSha256: release.sha256, bytes: release.bytes });
        if (verified.toLowerCase() !== release.sha256.toLowerCase()) throw new Error("Native APK checksum mismatch");
        const launched = await invoke<boolean>("launch_android_installer", { expectedSha256: release.sha256 });
        if (!launched) throw new Error("Android installer was not launched.");
      },
    };
  }
  const { check } = await import("@tauri-apps/plugin-updater");
  const update = await check({ timeout: 30_000 });
  if (!update) {
    await invoke("desktop_update_cached", { rid: null });
    return null;
  }
  const version = update.version;
  if (!["windows", "macos", "appimage", "deb", "rpm"].includes(kind)) {
    await update.close();
    return { kind: "external", version };
  }
  const rid = update.rid;
  let cached: boolean;
  try { cached = await invoke<boolean>("desktop_update_cached", { rid }); }
  catch (error) { await update.close(); throw error; }
  return {
    kind: "desktop", version, cached,
    download: async onProgress => {
      const progress = new Channel<number | null>(onProgress);
      await invoke("desktop_update_download", { rid, progress });
    },
    install: () => invoke<boolean>("desktop_update_install", { rid }),
    // Windows hands off to a native installer that exits and relaunches the app.
    restart: async () => {
      if (kind !== "windows") await (await import("@tauri-apps/plugin-process")).relaunch();
    },
    close: () => update.close(),
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

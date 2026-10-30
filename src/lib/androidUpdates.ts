// Android previews are intentionally independent of the desktop Tauri updater.
// A release manifest identifies the exact build rather than relying on the
// unchanged app version number of preview builds.
export interface AndroidReleaseManifest {
  schema: 1;
  version: string;
  build: string;
  apk: string;
  sha256: string;
  bytes: number;
  notes?: string;
}
export const ANDROID_MANIFEST_URL = "https://github.com/Aziliz/erudior/releases/download/android-preview/android-update.json";
const ALLOWED_APK = "https://github.com/Aziliz/erudior/releases/download/android-preview/Erudior-Android-arm64.apk";

export function validateAndroidRelease(value: unknown): AndroidReleaseManifest {
  if (!value || typeof value !== "object") throw new Error("Invalid Android release manifest");
  const m = value as Partial<AndroidReleaseManifest>;
  if (m.schema !== 1 || typeof m.version !== "string" || !/^\d+\.\d+\.\d+/.test(m.version) ||
      typeof m.build !== "string" || !/^[a-f0-9]{40}$/i.test(m.build) ||
      m.apk !== ALLOWED_APK || typeof m.sha256 !== "string" || !/^[a-f0-9]{64}$/i.test(m.sha256) ||
      typeof m.bytes !== "number" || !Number.isSafeInteger(m.bytes) || m.bytes < 1 || m.bytes > 41943040)
    throw new Error("Untrusted Android update manifest");
  return m as AndroidReleaseManifest;
}

export async function fetchAndroidRelease(): Promise<AndroidReleaseManifest> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(ANDROID_MANIFEST_URL, { cache: "no-store", signal: controller.signal });
    if (!response.ok) throw new Error("Android release metadata unavailable");
    return validateAndroidRelease(await response.json());
  } finally {
    clearTimeout(timeout);
  }
}

export async function verifyAndroidApk(m: AndroidReleaseManifest, progress: (pct: number | null) => void): Promise<Uint8Array> {
  const response = await fetch(m.apk, { cache: "no-store" });
  if (!response.ok || !response.body) throw new Error("Cannot download Android update");
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let received = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    received += value.byteLength;
    if (received > m.bytes) { await reader.cancel(); throw new Error("APK larger than signed release metadata"); }
    chunks.push(value);
    progress(Math.min(100, Math.floor(received * 100 / m.bytes)));
  }
  if (received !== m.bytes) throw new Error("Incomplete APK download");
  const bytes = new Uint8Array(received);
  let offset = 0;
  for (const part of chunks) { bytes.set(part, offset); offset += part.byteLength; }
  const hash = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", bytes)))
    .map(n => n.toString(16).padStart(2, "0")).join("");
  if (hash !== m.sha256.toLowerCase()) throw new Error("APK checksum verification failed");
  progress(100);
  return bytes;
}

/** Compare numeric version components, ignoring cosmetic suffixes. */
export function compareAndroidVersions(left: string, right: string): number {
  const parts = (v: string) => v.split(".").slice(0, 3).map((n) => Number.parseInt(n, 10) || 0);
  const a = parts(left);
  const b = parts(right);
  for (let i = 0; i < 3; i++) if (a[i] !== b[i]) return a[i] > b[i] ? 1 : -1;
  return 0;
}

/** Same-version preview builds may differ by source commit. */
export function shouldOfferAndroidUpdate(
  release: AndroidReleaseManifest, installedVersion: string, installedBuild: string,
): boolean {
  const comparison = compareAndroidVersions(release.version, installedVersion);
  if (comparison < 0) return false;
  if (comparison > 0) return true;
  // Without an embedded build ID, do not repeatedly prompt an existing install.
  if (!installedBuild) return false;
  return release.build !== installedBuild;
}

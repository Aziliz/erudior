import { isTauri } from "@tauri-apps/api/core";

/** Explicit, per-page temporary learning. A query string never grants a desktop
 * or supervised profile permission to bypass its persisted storage. */
export function isTemporaryGuestContext(context: {
  browser: boolean; native: boolean; desktop: boolean; homeschool: boolean; search: string;
}): boolean {
  return context.browser && !context.native && !context.desktop && !context.homeschool
    && new URLSearchParams(context.search).get("guest") === "1";
}

export const TEMPORARY_GUEST = isTemporaryGuestContext({
  browser: typeof window !== "undefined",
  native: isTauri(),
  desktop: import.meta.env?.VITE_AS_DESKTOP === "1",
  homeschool: import.meta.env?.VITE_HOMESCHOOL === "1",
  search: typeof window === "undefined" ? "" : window.location?.search ?? "",
});

/** Keep the temporary mode in app-owned history entries, including reloads.
 * External/absolute URLs are refused so this helper cannot rewrite a destination. */
export function withGuestSession(path: string, temporary = TEMPORARY_GUEST): string {
  if (!temporary) return path;
  if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) throw Error("Expected an app-relative path.");
  const url = new URL(path, "https://erudior.invalid");
  if (url.origin !== "https://erudior.invalid") throw Error("Expected an app-relative path.");
  url.searchParams.set("guest", "1");
  return url.pathname + url.search + url.hash;
}

// Synchronous legacy learning drafts use localStorage outside a temporary visit.
// Keep their temporary copy separate from both persistent drafts and IDB records.
const temporaryDrafts = new Map<string, string>();
export const learningDraftStorage = {
  getItem(key: string): string | null {
    return TEMPORARY_GUEST ? temporaryDrafts.get(key) ?? null : localStorage.getItem(key);
  },
  setItem(key: string, value: string): void {
    if (TEMPORARY_GUEST) temporaryDrafts.set(key, value);
    else localStorage.setItem(key, value);
  },
  removeItem(key: string): void {
    if (TEMPORARY_GUEST) temporaryDrafts.delete(key);
    else localStorage.removeItem(key);
  },
  keys(): string[] {
    return TEMPORARY_GUEST ? [...temporaryDrafts.keys()] : Object.keys(localStorage);
  },
};

// A tab opened before a website deploy still points at the previous build's hashed
// chunks, which the new deploy no longer serves. Reloading picks up the new build.
const KEY = "erudior.staleBuildReload";
const WINDOW_MS = 30_000;

export function isStaleChunkError(error: unknown): boolean {
  return /Failed to fetch dynamically imported module|error loading dynamically imported module|Importing a module script failed|is not a valid JavaScript MIME type|Unable to preload CSS/i
    .test(String((error as { message?: unknown })?.message ?? error));
}

/** Reload once to load the current build; false when a reload just happened (avoid loops). */
export function reloadForNewBuild(storage: Pick<Storage, "getItem" | "setItem"> | null = safeSession(), now = Date.now(),
  reload: () => void = () => window.location.reload()): boolean {
  try {
    const last = Number(storage?.getItem(KEY) ?? 0);
    if (now - last < WINDOW_MS) return false;
    storage?.setItem(KEY, String(now));
  } catch { /* Private modes may refuse storage; still try once. */ }
  reload();
  return true;
}

function safeSession(): Storage | null {
  try { return window.sessionStorage; } catch { return null; }
}

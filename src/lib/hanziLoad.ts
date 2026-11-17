// Loads the hanzi stroke data (a separate chunk of about 2.2 MB, 0.95 MB compressed) the first time
// a Chinese lesson traces a character. Only the app's lesson view imports this file: the community
// API worker and the shared validators never load the data.

import { PHONICS_BLOCK } from "./phonicsSpec";
import { addHanziStrokes, hanziStrokesLoaded, isTraceHanzi } from "./hanziStrokes";

let pending: Promise<void> | null = null;

/** Loads the hanzi strokes once; later calls share the same load. A failed load can be retried. */
export function loadHanziStrokes(): Promise<void> {
  if (hanziStrokesLoaded()) return Promise.resolve();
  pending ??= import("./hanziStrokes.data").then(
    (m) => addHanziStrokes(m.default),
    (e) => {
      pending = null;
      throw e;
    },
  );
  return pending;
}

/** Whether a Chinese lesson's Markdown has a ```trace block with a hanzi whose strokes aren't loaded yet. */
export function needsHanziStrokes(md: string): boolean {
  if (hanziStrokesLoaded() || !md.includes("```trace")) return false;
  for (const m of md.matchAll(PHONICS_BLOCK)) if (m[1] === "trace" && [...m[3]].some(isTraceHanzi)) return true;
  return false;
}

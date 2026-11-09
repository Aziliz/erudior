// Loads the kanji stroke data (a separate chunk of about 0.9 MB, 260 KB compressed) the first time
// a lesson traces a kanji. Only the app's lesson view imports this file: the community API worker
// and the shared validators never load the data.

import { PHONICS_BLOCK } from "./phonicsSpec";
import { addKanjiStrokes, isTraceKanji, kanjiStrokesLoaded } from "./kanjiStrokes";

let pending: Promise<void> | null = null;

/** Loads the kanji strokes once; later calls share the same load. A failed load can be retried. */
export function loadKanjiStrokes(): Promise<void> {
  if (kanjiStrokesLoaded()) return Promise.resolve();
  pending ??= import("./kanjiStrokes.data").then(
    (m) => addKanjiStrokes(m.default),
    (e) => {
      pending = null;
      throw e;
    },
  );
  return pending;
}

/** Whether Markdown text has a ```trace block with a kanji whose strokes aren't loaded yet. */
export function needsKanjiStrokes(md: string): boolean {
  if (kanjiStrokesLoaded() || !md.includes("```trace")) return false;
  for (const m of md.matchAll(PHONICS_BLOCK)) if (m[1] === "trace" && [...m[3]].some(isTraceKanji)) return true;
  return false;
}

// Loads hanzi stroke data the first time a Chinese lesson traces a character, one chunk per HSK band
// (HSK 1–3 about 2.2 MB, 0.95 MB compressed; HSK 4, 5 and 6 and the three parts of 7–9 about
// 1.3–1.9 MB each, 0.55–0.8 MB compressed): only the chunks that hold the lesson's characters load.
// Only the app's lesson view (and the course checker) imports this file: the community API worker
// and the shared validators never load the data.

import type { HanziChunk } from "./hanziList";
import { PHONICS_BLOCK } from "./phonicsSpec";
import { addHanziStrokes, hanziChunk, hanziStrokesLoaded, isTraceHanzi } from "./hanziStrokes";

type Data = Promise<{ default: Record<string, string> }>;

/** Every chunk's loader (each its own file in the build). */
const CHUNKS: Record<HanziChunk, () => Data> = {
  "hsk1-3": () => import("./hanziStrokes.hsk1-3.data"),
  hsk4: () => import("./hanziStrokes.hsk4.data"),
  hsk5: () => import("./hanziStrokes.hsk5.data"),
  hsk6: () => import("./hanziStrokes.hsk6.data"),
  "hsk7-9a": () => import("./hanziStrokes.hsk7-9a.data"),
  "hsk7-9b": () => import("./hanziStrokes.hsk7-9b.data"),
  "hsk7-9c": () => import("./hanziStrokes.hsk7-9c.data"),
};

const pending = new Map<HanziChunk, Promise<void>>();

/** Loads one chunk once; later calls share the same load. A failed load can be retried. */
function loadChunk(id: HanziChunk): Promise<void> {
  let p = pending.get(id);
  if (!p) {
    p = CHUNKS[id]().then(
      (m) => addHanziStrokes(m.default),
      (e) => {
        pending.delete(id);
        throw e;
      },
    );
    pending.set(id, p);
  }
  return p;
}

/** Loads the strokes of these hanzi (the chunks that hold them; characters without data are skipped). */
export function loadHanziStrokes(chars: Iterable<string>): Promise<void> {
  const ids = new Set<HanziChunk>();
  for (const ch of chars) {
    const id = hanziChunk(ch);
    if (id && !hanziStrokesLoaded(ch)) ids.add(id);
  }
  return Promise.all([...ids].map(loadChunk)).then(() => undefined);
}

/** The traceable hanzi in a Chinese lesson's ```trace blocks, each once. */
export function tracedHanzi(md: string): string[] {
  if (!md.includes("```trace")) return [];
  const out = new Set<string>();
  for (const m of md.matchAll(PHONICS_BLOCK)) if (m[1] === "trace") for (const ch of m[3]) if (isTraceHanzi(ch)) out.add(ch);
  return [...out];
}

/** Whether a Chinese lesson's Markdown has a ```trace block with a hanzi whose strokes aren't loaded yet. */
export const needsHanziStrokes = (md: string): boolean => tracedHanzi(md).some((ch) => !hanziStrokesLoaded(ch));

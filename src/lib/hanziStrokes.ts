// Hanzi tracing strokes for Chinese courses, from Make Me a Hanzi (graphics.txt, Arphic Public
// License; see hanziStrokes.data.ts and public/third-party-licenses.txt). Like the kanji data, the
// strokes are big and load on first use, one chunk per HSK band (hanziLoad.ts), and which characters
// can be traced, and in which chunk, is known without them (hanziList.ts). Each stroke has an outline (what the pad shows, an SVG path in Make
// Me a Hanzi's 1024 box with y up) and a median (the line it follows from where it starts, in the
// 0–100 square): the median is what a traced stroke is checked against.

import { HANZI_CHUNKS, HANZI_NO_STROKES, type HanziChunk } from "./hanziList";

const loaded = new Map<string, string>();
const chunkOf = new Map<string, HanziChunk>();

/** The chunk that holds `ch`'s strokes, or undefined (not a traceable hanzi). */
export function hanziChunk(ch: string): HanziChunk | undefined {
  if (!chunkOf.size) for (const [id, chars] of Object.entries(HANZI_CHUNKS)) for (const c of chars) chunkOf.set(c, id as HanziChunk);
  return chunkOf.get(ch);
}

/** Whether `ch` is a hanzi that has tracing data (loaded or not). */
export const isTraceHanzi = (ch: string): boolean => hanziChunk(ch) !== undefined;

/** For a Taiwan form of an HSK character that has no stroke data (溼), the form to trace instead (濕). */
export const hanziInstead = (ch: string): string | undefined => (Object.prototype.hasOwnProperty.call(HANZI_NO_STROKES, ch) ? HANZI_NO_STROKES[ch] : undefined);

/** Makes hanzi data (one chunk, or several merged) available to letterGuide(ch, "zh"). */
export function addHanziStrokes(data: Record<string, string>): void {
  for (const [ch, s] of Object.entries(data)) loaded.set(ch, s);
}

/** Whether `ch`'s strokes have loaded. */
export const hanziStrokesLoaded = (ch: string): boolean => loaded.has(ch);

/** Draws an outline (1024 box, y up, baseline at 900) in the pad's 0–100 square. */
export const HANZI_OUTLINE_TRANSFORM = "matrix(0.09765625 0 0 -0.09765625 0 87.890625)";

/** Outline paths may hold only these (the build script writes nothing else). */
const SAFE_OUTLINE = /^[MLQCZ0-9 .-]+$/;

/** One median ("x y x y …") as app commands: M x y L x y … */
export function medianCommands(median: string): string {
  const n = median.trim().split(/\s+/).map(Number);
  if (n.length < 4 || n.length % 2 || n.some((v) => !Number.isFinite(v))) throw new Error(`bad hanzi median "${median.slice(0, 20)}"`);
  const out = [`M ${n[0]} ${n[1]}`];
  for (let i = 2; i < n.length; i += 2) out.push(`L ${n[i]} ${n[i + 1]}`);
  return out.join(" ");
}

export interface HanziStrokes {
  /** SVG outline per stroke, drawn with HANZI_OUTLINE_TRANSFORM. */
  outlines: string[];
  /** App commands per stroke (the median), in writing order. */
  medians: string[];
}

/** A hanzi's strokes, or undefined (no data, or not loaded yet). */
export function hanziStrokes(ch: string): HanziStrokes | undefined {
  const s = loaded.get(ch);
  if (!s) return undefined;
  const [o, m] = s.split("|");
  const outlines = o.split(";");
  const medians = m.split(";").map(medianCommands);
  if (outlines.length !== medians.length || !outlines.every((d) => SAFE_OUTLINE.test(d))) throw new Error(`bad hanzi data for ${ch}`);
  return { outlines, medians };
}

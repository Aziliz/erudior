// Hanzi tracing strokes for Chinese courses, from Make Me a Hanzi (graphics.txt, Arphic Public
// License; see hanziStrokes.data.ts and public/third-party-licenses.txt). Like the kanji data, the
// strokes are big and load on first use (hanziLoad.ts), and which characters can be traced is known
// without them (hanziList.ts). Each stroke has an outline (what the pad shows, an SVG path in Make
// Me a Hanzi's 1024 box with y up) and a median (the line it follows from where it starts, in the
// 0–100 square): the median is what a traced stroke is checked against.

import { TRACE_HANZI } from "./hanziList";

let loaded: Record<string, string> | null = null;
const known = new Set<string>();

/** Whether `ch` is a hanzi that has tracing data (loaded or not). */
export function isTraceHanzi(ch: string): boolean {
  if (!known.size) for (const c of TRACE_HANZI) known.add(c);
  return known.has(ch);
}

/** Makes the hanzi data available to letterGuide(ch, "zh"). */
export function addHanziStrokes(data: Record<string, string>): void {
  loaded = data;
}

export const hanziStrokesLoaded = () => loaded !== null;

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
  const s = loaded?.[ch];
  if (!s) return undefined;
  const [o, m] = s.split("|");
  const outlines = o.split(";");
  const medians = m.split(";").map(medianCommands);
  if (outlines.length !== medians.length || !outlines.every((d) => SAFE_OUTLINE.test(d))) throw new Error(`bad hanzi data for ${ch}`);
  return { outlines, medians };
}

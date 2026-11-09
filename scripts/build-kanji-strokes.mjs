// Builds the kanji tracing data from KanjiVG (https://github.com/KanjiVG/kanjivg,
// © Ulrich Apel, CC BY-SA 3.0): src/lib/kanjiStrokes.data.ts (stroke commands, loaded lazily)
// and src/lib/kanjiList.ts (which characters have data, for the course checker and parsers).
//
//   node scripts/build-kanji-strokes.mjs <kanjivg kanji/ folder> <release tag> [commit]
//
// The folder is the kanji/ directory of an unpacked KanjiVG release (kanjivg-YYYYMMDD-main.zip)
// or of a checkout of the release tag (e.g. r20260714). Treat it as untrusted data: this script
// only reads the SVG files as text, takes each stroke's path data, checks it strictly and
// converts it; nothing in the folder is run.
//
// Kept: the 2,136 jōyō kanji (scripts/data/joyo-kanji.txt, the official 2010 forms) and the
// widely used alternate forms the 2010 list allows (叱 填 剥 頬). Each stroke keeps KanjiVG's order
// and direction exactly; its SVG path (M/m, C/c, S/s, L/l, H/h, V/v) becomes absolute cubic
// curves, scaled from KanjiVG's 109×109 box into the app's 0–100 square and rounded to whole
// units. The data file stores each curve as small offsets (compactStroke) to stay small; at load
// they expand to this app's absolute commands (M x y C x1 y1 x2 y2 x y — see handwriting.ts).
// Kana keep their hand-drawn shapes in kanaStrokes.ts.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const [dir, tag, commit = ""] = process.argv.slice(2);
if (!dir || !/^r\d{8}$/.test(tag ?? "")) {
  console.error("usage: node scripts/build-kanji-strokes.mjs <kanjivg kanji/ folder> <release tag like r20260714> [commit]");
  process.exit(2);
}
if (commit && !/^[0-9a-f]{40}$/.test(commit)) throw new Error("commit must be a 40-character hash");

// --- The character list ----------------------------------------------------------------------
const listText = readFileSync(path.join(root, "scripts/data/joyo-kanji.txt"), "utf8");
const joyo = [...listText.split("\n").filter((l) => !l.startsWith("#")).join("").replace(/\s+/g, "")];
const isKanji = (c) => /^[㐀-䶿一-鿿豈-﫿\u{20000}-\u{3134f}]$/u.test(c);
if (joyo.length !== 2136 || new Set(joyo).size !== 2136 || !joyo.every(isKanji)) throw new Error(`joyo-kanji.txt must hold 2,136 distinct kanji (has ${joyo.length})`);
const ALTERNATES = ["叱", "填", "剥", "頬"]; // for 𠮟 塡 剝 頰
const wanted = [...joyo, ...ALTERNATES.filter((c) => !joyo.includes(c))];

// --- SVG path data -> absolute app commands ---------------------------------------------------
const SCALE = 100 / 109;
const NUM = /^[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?/;

/** Splits path data into commands and numbers, refusing anything else. */
function tokenize(d) {
  const out = [];
  let s = d.trim();
  while (s.length) {
    s = s.replace(/^[\s,]+/, "");
    if (!s.length) break;
    if (/^[MmCcSsLlHhVvZz]/.test(s)) {
      out.push(s[0]);
      s = s.slice(1);
      continue;
    }
    const m = NUM.exec(s);
    if (!m) throw new Error(`bad path data near "${s.slice(0, 12)}"`);
    out.push(Number(m[0]));
    s = s.slice(m[0].length);
  }
  return out;
}

/** One KanjiVG stroke path as absolute segments in KanjiVG units: a start and cubic curves. */
export function strokeSegments(d) {
  const t = tokenize(d);
  let i = 0;
  let cmd = "";
  let x = 0;
  let y = 0;
  let start = null;
  let lastC2 = null; // second control point of the previous cubic, for S
  const segs = [];
  const nums = (n) => {
    const v = t.slice(i, i + n);
    if (v.length !== n || v.some((q) => typeof q !== "number" || !Number.isFinite(q))) throw new Error(`"${cmd}" needs ${n} numbers`);
    i += n;
    return v;
  };
  while (i < t.length) {
    if (typeof t[i] === "string") cmd = t[i++];
    else if (!cmd) throw new Error("path data starts with a number");
    const rel = cmd === cmd.toLowerCase();
    const C = cmd.toUpperCase();
    if (C === "Z") throw new Error("closed paths aren't strokes");
    if (C === "M") {
      if (start) throw new Error("a stroke has one start (one M)");
      const [a, b] = nums(2);
      x = rel ? x + a : a;
      y = rel ? y + b : b;
      start = [x, y];
      lastC2 = null;
      // Numbers after an M are line-tos.
      cmd = rel ? "l" : "L";
      continue;
    }
    if (!start) throw new Error("a stroke must start with M");
    if (C === "C") {
      const [x1, y1, x2, y2, ex, ey] = nums(6);
      const o = rel ? [x, y] : [0, 0];
      const seg = [x1 + o[0], y1 + o[1], x2 + o[0], y2 + o[1], ex + o[0], ey + o[1]];
      segs.push(["C", ...seg]);
      lastC2 = [seg[2], seg[3]];
      [x, y] = [seg[4], seg[5]];
    } else if (C === "S") {
      const [x2, y2, ex, ey] = nums(4);
      const o = rel ? [x, y] : [0, 0];
      // The first control point mirrors the previous curve's second one (or is the current point).
      const c1 = lastC2 ? [2 * x - lastC2[0], 2 * y - lastC2[1]] : [x, y];
      const seg = [c1[0], c1[1], x2 + o[0], y2 + o[1], ex + o[0], ey + o[1]];
      segs.push(["C", ...seg]);
      lastC2 = [seg[2], seg[3]];
      [x, y] = [seg[4], seg[5]];
    } else if (C === "L" || C === "H" || C === "V") {
      let ex = x;
      let ey = y;
      if (C === "L") {
        const [a, b] = nums(2);
        ex = rel ? x + a : a;
        ey = rel ? y + b : b;
      } else if (C === "H") {
        const [a] = nums(1);
        ex = rel ? x + a : a;
      } else {
        const [b] = nums(1);
        ey = rel ? y + b : b;
      }
      segs.push(["L", ex, ey]);
      lastC2 = null;
      [x, y] = [ex, ey];
    } else throw new Error(`unsupported path command "${cmd}"`);
  }
  if (!start || !segs.length) throw new Error("empty stroke");
  return { start, segs };
}

const r = (v) => {
  const n = Math.round(v * SCALE);
  if (n < -5 || n > 105) throw new Error(`point ${v} is outside the box`);
  return Math.min(100, Math.max(0, n));
};

/** One stroke, compact: "x y" (the start), then each cubic as six offsets from the point it
 * starts at ("dx1 dy1 dx2 dy2 dx dy"), all in whole units of the 0–100 square. A line becomes a
 * cubic with its control points at its ends. src/lib/kanjiStrokes.ts expandStroke() turns it
 * back into the absolute commands "M x y C x1 y1 x2 y2 x y …" (as appCommands below does). */
export function compactStroke(d) {
  const { start, segs } = strokeSegments(d);
  let [x, y] = [r(start[0]), r(start[1])];
  const out = [x, y];
  for (const [c, ...v] of segs) {
    const q = v.map(r);
    const cubic = c === "C" ? q : [x, y, q[0], q[1], q[0], q[1]];
    out.push(cubic[0] - x, cubic[1] - y, cubic[2] - x, cubic[3] - y, cubic[4] - x, cubic[5] - y);
    [x, y] = [cubic[4], cubic[5]];
  }
  return out.join(" ");
}

/** The absolute app commands for a compact stroke (the same as kanjiStrokes.ts expandStroke). */
export function appCommands(compact) {
  const n = compact.split(" ").map(Number);
  let [x, y] = n;
  const out = [`M ${x} ${y}`];
  for (let i = 2; i < n.length; i += 6) {
    out.push(`C ${x + n[i]} ${y + n[i + 1]} ${x + n[i + 2]} ${y + n[i + 3]} ${x + n[i + 4]} ${y + n[i + 5]}`);
    [x, y] = [x + n[i + 4], y + n[i + 5]];
  }
  return out.join(" ");
}

// --- Read the SVGs --------------------------------------------------------------------------
const files = new Set(readdirSync(dir));
const data = {};
let strokes = 0;
for (const ch of wanted) {
  const hex = ch.codePointAt(0).toString(16).padStart(5, "0");
  const name = `${hex}.svg`;
  if (!files.has(name)) throw new Error(`KanjiVG has no ${name} for ${ch}`);
  const svg = readFileSync(path.join(dir, name), "utf8");
  if (svg.length > 200_000) throw new Error(`${name} is unexpectedly large`);
  if (!/viewBox="0 0 109 109"/.test(svg)) throw new Error(`${name}: not a 109×109 KanjiVG drawing`);
  const group = new RegExp(`<g id="kvg:StrokePaths_${hex}"[\\s\\S]*?<g id="kvg:StrokeNumbers_${hex}"`).exec(svg);
  if (!group) throw new Error(`${name}: no stroke paths group`);
  const paths = [...group[0].matchAll(/<path\b([^>]*)\/?>/g)].map((m) => {
    const id = /\bid="kvg:([0-9a-f]{5})-s(\d+)"/.exec(m[1]);
    const d = /\bd="([^"]*)"/.exec(m[1]);
    if (!id || !d || id[1] !== hex) throw new Error(`${name}: stroke without a proper id or path`);
    return { n: Number(id[2]), d: d[1] };
  });
  // Document order is the stroke order; the ids must count 1, 2, 3… in that same order.
  paths.forEach((p, k) => {
    if (p.n !== k + 1) throw new Error(`${name}: stroke ${k + 1} is numbered s${p.n}`);
  });
  if (!paths.length || paths.length > 40) throw new Error(`${name}: ${paths.length} strokes`);
  try {
    data[ch] = paths.map((p) => compactStroke(p.d)).join(";");
  } catch (e) {
    throw new Error(`${name}: ${e.message}`);
  }
  strokes += paths.length;
}

// --- Write ----------------------------------------------------------------------------------
const source = [
  `// Source: KanjiVG ${tag}${commit ? ` (commit ${commit})` : ""}, https://github.com/KanjiVG/kanjivg`,
  `// (website https://kanjivg.tagaini.net). KanjiVG is copyright Ulrich Apel and released under the`,
  `// Creative Commons Attribution-Share Alike 3.0 licence (https://creativecommons.org/licenses/by-sa/3.0/).`,
];
const header = (what) =>
  [
    `// GENERATED by scripts/build-kanji-strokes.mjs: do not edit. ${what}`,
    `//`,
    ...source,
    `//`,
    `// This file is an adaptation of KanjiVG: the stroke paths of ${wanted.length} kanji were converted to`,
    `// Erudior's stroke format, scaled from 109×109 to a 0–100 square and rounded to whole units;`,
    `// stroke order and direction are unchanged. As a derivative of KanjiVG, this file is licensed`,
    `// under CC BY-SA 3.0 too, with the attribution above. (Erudior's own code is not.)`,
  ].join("\n");
const listHeader = [
  `// GENERATED by scripts/build-kanji-strokes.mjs: do not edit. Which kanji have tracing data; the`,
  `// strokes themselves (adapted from KanjiVG, CC BY-SA 3.0) are in kanjiStrokes.data.ts.`,
  `//`,
  ...source,
].join("\n");

const dataOut =
  header("Kanji stroke commands, loaded only when a lesson traces kanji (src/lib/kanjiLoad.ts).") +
  `\n\n/** Kanji → its strokes in writing order, separated by ";". Each stroke is "x y" (where it\n` +
  ` * starts), then its cubic curves as six offsets each from the point the curve starts at\n` +
  ` * ("dx1 dy1 dx2 dy2 dx dy"), in whole units of the 0–100 square. kanjiStrokes.ts expandStroke()\n` +
  ` * turns a stroke into absolute app commands (M x y C x1 y1 x2 y2 x y …). */\n` +
  `const KANJI_STROKES: Record<string, string> = ${JSON.stringify(data).replace(/","/g, '",\n"')};\nexport default KANJI_STROKES;\n`;
writeFileSync(path.join(root, "src/lib/kanjiStrokes.data.ts"), dataOut);

const listOut =
  listHeader +
  `\n\n/** Every kanji that can be traced: the 2,136 jōyō kanji and the alternate forms 叱 填 剥 頬. */\n` +
  `export const TRACE_KANJI = ${JSON.stringify(wanted.join(""))};\n` +
  `\nexport const KANJIVG_VERSION = ${JSON.stringify(tag)};\n`;
writeFileSync(path.join(root, "src/lib/kanjiList.ts"), listOut);

console.log(`${wanted.length} kanji, ${strokes} strokes from KanjiVG ${tag} -> src/lib/kanjiStrokes.data.ts (${dataOut.length} bytes), src/lib/kanjiList.ts`);

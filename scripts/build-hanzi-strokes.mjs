// Builds the hanzi tracing data from Make Me a Hanzi (https://github.com/skishore/makemeahanzi,
// graphics.txt, Arphic Public License): src/lib/hanziStrokes.data.ts (outlines and medians, loaded
// lazily) and src/lib/hanziList.ts (which characters have data, for the checkers and parsers).
//
//   node scripts/build-hanzi-strokes.mjs <graphics.txt> <makemeahanzi commit> <opencc-js package dir> <STCharacters.txt> <YYYY-MM-DD>
//
// graphics.txt is the file at that commit (raw.githubusercontent.com/skishore/makemeahanzi/<commit>/graphics.txt).
// The opencc-js folder is an installed npm package (npm install opencc-js@1.4.2 in a scratch folder);
// its s2tw converter and TWVariants table are imported. STCharacters.txt is OpenCC's own character
// table at the matching tag (raw.githubusercontent.com/BYVoid/OpenCC/ver.1.4.2/data/dictionary/STCharacters.txt),
// which lists every traditional candidate (opencc-js keeps only the first). The date is the day the subset was made,
// for the change notice the licence asks for. Treat graphics.txt as untrusted data: each line is
// parsed as JSON and every path is checked strictly and rewritten; nothing in it is run.
//
// Kept: the 655 characters of HSK 1–3 (scripts/data/hsk-hanzi.txt) and their Taiwan traditional
// forms: OpenCC s2tw of each character, plus every other traditional candidate OpenCC lists for it
// (发 → 發 and 髮) when Make Me a Hanzi has it. Stroke order is Make Me a Hanzi's (PRC order) for
// both scripts. Per stroke: the outline (an SVG path in Make Me a Hanzi's 1024 box, y up, drawn
// with the transform in hanziStrokes.ts) with its spaces after commands dropped, and the median
// (the line the stroke follows, in writing order) converted to the app's 0–100 square, y down.
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = path.resolve(import.meta.dirname, "..");
const [graphics, commit, occDir, stFile, date] = process.argv.slice(2);
if (!graphics || !/^[0-9a-f]{40}$/.test(commit ?? "") || !occDir || !stFile || !/^\d{4}-\d{2}-\d{2}$/.test(date ?? "")) {
  console.error("usage: node scripts/build-hanzi-strokes.mjs <graphics.txt> <40-character commit> <opencc-js package dir> <STCharacters.txt> <YYYY-MM-DD>");
  process.exit(2);
}

// --- The character list ----------------------------------------------------------------------
const isHan = (c) => /^\p{Script=Han}$/u.test(c);
const listText = readFileSync(path.join(root, "scripts/data/hsk-hanzi.txt"), "utf8");
const simplified = [...listText.split("\n").filter((l) => !l.startsWith("#")).join("").replace(/\s+/g, "")];
if (simplified.length !== 655 || new Set(simplified).size !== 655 || !simplified.every(isHan)) throw new Error(`hsk-hanzi.txt must hold 655 distinct characters (has ${simplified.length})`);

// --- Traditional forms (OpenCC s2tw) -----------------------------------------------------------
const occPkg = JSON.parse(readFileSync(path.join(occDir, "package.json"), "utf8"));
if (occPkg.name !== "opencc-js") throw new Error(`${occDir} is not the opencc-js package`);
const occ = (f) => import(pathToFileURL(path.join(occDir, f)).href);
const OpenCC = await occ("dist/esm/full.js");
const s2tw = OpenCC.Converter({ from: "cn", to: "tw" });
/** An OpenCC dictionary table ("a b c|d e") as key → candidates. */
const table = (text) => new Map(text.split("|").map((e) => e.split(" ")).map(([k, ...v]) => [k, v]));
/** OpenCC's STCharacters.txt: "简\t簡 …" per line. */
const ST = new Map(
  readFileSync(stFile, "utf8")
    .split("\n")
    .filter((l) => l.includes("\t"))
    .map((l) => l.trim().split(/\s+/))
    .map(([k, ...v]) => [k, v]),
);
if (ST.size < 3000 || ST.get("发")?.join(" ") !== "發 髮") throw new Error(`${stFile} is not OpenCC's STCharacters.txt`);
const TWV = table((await occ("dist/esm-lib/dict/TWVariants.js")).default);
const tw = (c) => TWV.get(c)?.[0] ?? c;

// --- Read graphics.txt ------------------------------------------------------------------------
const records = new Map();
for (const line of readFileSync(graphics, "utf8").split("\n")) {
  if (!line.trim()) continue;
  if (line.length > 100_000) throw new Error("a graphics.txt line is unexpectedly long");
  const r = JSON.parse(line);
  if (typeof r?.character === "string") records.set(r.character, r);
}
if (records.size < 9000) throw new Error(`graphics.txt has only ${records.size} characters`);

const required = new Set(simplified);
const optional = new Set();
for (const c of simplified) {
  const main = s2tw(c);
  if ([...main].length !== 1 || !isHan(main)) throw new Error(`s2tw(${c}) = "${main}"`);
  required.add(main);
  for (const t of ST.get(c) ?? []) if (!required.has(tw(t))) optional.add(tw(t));
}
const missing = [...required].filter((c) => !records.has(c));
if (missing.length) throw new Error(`Make Me a Hanzi has no data for ${missing.join(" ")}`);
const skipped = [...optional].filter((c) => !required.has(c) && !records.has(c));
const wanted = [...new Set([...required, ...optional].filter((c) => records.has(c)))].sort((a, b) => a.codePointAt(0) - b.codePointAt(0));

// --- Paths --------------------------------------------------------------------------------------
const NUM = /^-?(?:\d+\.?\d*|\.\d+)/;
const ARGS = { M: 2, L: 2, Q: 4, C: 6, Z: 0 };

/** One outline (closed subpaths of M, L, Q, C and Z, absolute) rewritten compactly: no space
 * after a command letter. Anything else is refused. */
export function compactOutline(d) {
  const out = [];
  let s = d.trim();
  let cmd = "";
  let open = false;
  while (s.length) {
    s = s.replace(/^[\s,]+/, "");
    if (!s.length) break;
    const c = s[0];
    if (!(c in ARGS)) throw new Error(`unsupported outline command near "${s.slice(0, 12)}"`);
    s = s.slice(1);
    if (c === "M") open = true;
    else if (!open) throw new Error("outline doesn't start with M");
    const nums = [];
    for (let k = 0; k < ARGS[c]; k++) {
      s = s.replace(/^[\s,]+/, "");
      const m = NUM.exec(s);
      if (!m) throw new Error(`"${c}" needs ${ARGS[c]} numbers`);
      const v = Number(m[0]);
      if (!Number.isFinite(v) || v < -300 || v > 1324) throw new Error(`outline point ${v} is outside the box`);
      nums.push(String(v));
      s = s.slice(m[0].length);
    }
    if (c === "Z") open = false;
    cmd = c;
    out.push(c + nums.join(" "));
  }
  if (cmd !== "Z") throw new Error("outline isn't closed");
  return out.join("");
}

/** 1024 box, y up (Make Me a Hanzi) → 0–100 square, y down, one decimal. */
const ax = (x) => Math.round((x / 10.24) * 10) / 10;
const ay = (y) => Math.round(((900 - y) / 10.24) * 10) / 10;

/** One median as "x y x y …" in the app's square (consecutive repeats dropped). */
export function compactMedian(m) {
  if (!Array.isArray(m) || m.length < 2 || m.length > 200) throw new Error("a median needs 2–200 points");
  const out = [];
  for (const p of m) {
    if (!Array.isArray(p) || p.length !== 2 || !p.every((v) => typeof v === "number" && Number.isFinite(v))) throw new Error("bad median point");
    const q = [ax(p[0]), ay(p[1])];
    if (q.some((v) => v < -15 || v > 115)) throw new Error(`median point ${p} is outside the box`);
    const last = out[out.length - 1];
    if (!last || last[0] !== q[0] || last[1] !== q[1]) out.push(q);
  }
  if (out.length < 2) out.push(out[0]);
  return out.map((q) => q.join(" ")).join(" ");
}

const data = {};
let strokes = 0;
for (const ch of wanted) {
  const r = records.get(ch);
  if (!Array.isArray(r.strokes) || !Array.isArray(r.medians) || r.strokes.length !== r.medians.length) throw new Error(`${ch}: strokes and medians don't match`);
  if (!r.strokes.length || r.strokes.length > 40) throw new Error(`${ch}: ${r.strokes.length} strokes`);
  try {
    const outlines = r.strokes.map((d) => {
      if (typeof d !== "string" || d.length > 20_000) throw new Error("bad outline");
      return compactOutline(d);
    });
    data[ch] = outlines.join(";") + "|" + r.medians.map(compactMedian).join(";");
  } catch (e) {
    throw new Error(`${ch}: ${e.message}`);
  }
  strokes += r.strokes.length;
}

// --- Write ----------------------------------------------------------------------------------
const source = [
  `// Source: Make Me a Hanzi graphics.txt, commit ${commit},`,
  `// https://github.com/skishore/makemeahanzi. graphics.txt is derived from the fonts Arphic PL KaitiM GB and`,
  `// Arphic PL UKai (© 1999 Arphic Technology Co., Ltd.) and is distributed under the Arphic Public License; the`,
  `// licence text (ARPHICPL.TXT) is in public/third-party-licenses.txt and scripts/licenses/makemeahanzi-ARPHICPL-COPYING.txt.`,
];
const notice = [
  `// NOTICE OF MODIFICATION (Arphic Public License, section 2a): this file was changed from graphics.txt on`,
  `// ${date} by scripts/build-hanzi-strokes.mjs (Erudior). It keeps only ${wanted.length} characters (HSK 1–3 and their`,
  `// Taiwan traditional forms from OpenCC); each stroke's outline path is kept with the spaces after its`,
  `// command letters removed, and each stroke's median is converted from the 1024 box (y up) to a 0–100 square`,
  `// (y down) and rounded to 0.1. Stroke order and shapes are otherwise unchanged. This file is distributed`,
  `// under the Arphic Public License, like graphics.txt; Erudior's own code is not covered by it. The script`,
  `// that makes this file from graphics.txt is public in the same repository (scripts/build-hanzi-strokes.mjs).`,
];
const dataOut =
  [`// GENERATED by scripts/build-hanzi-strokes.mjs: do not edit. Hanzi strokes, loaded only when a Chinese`, `// lesson traces a character (src/lib/hanziLoad.ts).`, `//`, ...source, `//`, ...notice].join("\n") +
  `\n\n/** Character → "outline;outline;…|median;median;…", one of each per stroke in writing order (PRC order).\n` +
  ` * An outline is an SVG path in Make Me a Hanzi's 1024 box with y up; a median is "x y x y …" in the\n` +
  ` * 0–100 square with y down: the line the stroke follows, from where it starts. See hanziStrokes.ts. */\n` +
  `const HANZI_STROKES: Record<string, string> = ${JSON.stringify(data).replace(/","/g, '",\n"')};\nexport default HANZI_STROKES;\n`;
writeFileSync(path.join(root, "src/lib/hanziStrokes.data.ts"), dataOut);

const listOut =
  [
    `// GENERATED by scripts/build-hanzi-strokes.mjs: do not edit. Which hanzi have tracing data; the strokes`,
    `// themselves (from Make Me a Hanzi, Arphic Public License) are in hanziStrokes.data.ts.`,
  ].join("\n") +
  `\n\n/** Every hanzi that can be traced in a Chinese course: the 655 characters of HSK 1–3 and their Taiwan\n` +
  ` * traditional forms (OpenCC s2tw and the other traditional candidates OpenCC lists), by code point. */\n` +
  `export const TRACE_HANZI = ${JSON.stringify(wanted.join(""))};\n` +
  `\nexport const MAKEMEAHANZI_COMMIT = ${JSON.stringify(commit)};\n`;
writeFileSync(path.join(root, "src/lib/hanziList.ts"), listOut);

console.log(
  `${wanted.length} hanzi (${simplified.length} simplified, ${wanted.length - simplified.length} more traditional forms), ${strokes} strokes, opencc-js ${occPkg.version} -> ` +
    `src/lib/hanziStrokes.data.ts (${Buffer.byteLength(dataOut)} bytes), src/lib/hanziList.ts` +
    (skipped.length ? `\nOpenCC candidates without Make Me a Hanzi data (left out): ${skipped.join(" ")}` : ""),
);

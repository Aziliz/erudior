// Builds the hanzi tracing data from Make Me a Hanzi (https://github.com/skishore/makemeahanzi,
// graphics.txt, Arphic Public License): one data file per HSK band, src/lib/hanziStrokes.<chunk>.data.ts
// (outlines and medians, each loaded only when a lesson traces one of its characters), and
// src/lib/hanziList.ts (which characters have data and in which chunk, for the checkers and parsers),
// plus scripts/data/hsk-hanzi.txt (the syllabus characters by level).
//
//   node scripts/build-hanzi-strokes.mjs <scratch dir> <YYYY-MM-DD> [--fetch]
//
// The scratch dir holds the pinned inputs below; --fetch downloads whichever are missing (curl and
// npm) into it. Every input is checked against its pinned SHA-256 (opencc-js: its version):
//   graphics.txt          raw.githubusercontent.com/skishore/makemeahanzi/<MAKEMEAHANZI>/graphics.txt
//   dictionaryZhHans.txt  raw.githubusercontent.com/parsimonhi/animCJK/<ANIMCJK>/dictionaryZhHans.txt
//   STCharacters.txt      raw.githubusercontent.com/BYVoid/OpenCC/<OPENCC>/data/dictionary/STCharacters.txt
//   node_modules/opencc-js  npm install --prefix <scratch dir> opencc-js@<OPENCC_JS>
// The date is the day the subset was made, for the change notice the licence asks for. Treat the
// downloads as untrusted data: each line of graphics.txt and dictionaryZhHans.txt is parsed as JSON
// and every path is checked strictly and rewritten; nothing in them is run (opencc-js is run: it is
// the pinned npm package).
//
// The characters: the 3,088 reading characters (认读字) of the HSK exam syllabus (2025, in force July
// 2026), levels 1–9, simplified. They are read from AnimCJK's dictionaryZhHans.txt, whose "hsk1" …
// "hsk789" sets match the syllabus exactly (246, 125, 284, 441, 431, 413 and 1,148 new characters);
// only each character's level is taken from that file. To these come their Taiwan traditional forms:
// OpenCC s2tw of each character, plus every other traditional candidate OpenCC lists for it
// (发 → 發 and 髮) when Make Me a Hanzi has it. A syllabus character or s2tw form that Make Me a
// Hanzi lacks is listed in HANZI_NO_STROKES (the course checker says it can't be traced).
//
// Chunks: each character goes into the chunk of the lowest band that needs it (HSK 1–3, 4, 5, 6,
// 7–9), so the HSK 1–3 chunk is the same as before the other bands came. Stroke order is Make Me a
// Hanzi's (PRC order) for both scripts. Per stroke: the outline (an SVG path in Make Me a Hanzi's
// 1024 box, y up, drawn with the transform in hanziStrokes.ts) with its spaces after commands
// dropped, and the median (the line the stroke follows, in writing order) converted to the app's
// 0–100 square, y down.
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const MAKEMEAHANZI = "bddc96d41bef78427ed0e034e9f7e31d71fd1b92";
const ANIMCJK = "c63765b150cbd567c71d05cf4a4f8d00b57045c9";
const OPENCC = "ver.1.4.2";
const OPENCC_JS = "1.4.2";
const INPUTS = {
  "graphics.txt": [
    `https://raw.githubusercontent.com/skishore/makemeahanzi/${MAKEMEAHANZI}/graphics.txt`,
    "a28c478b5178e98f67f510b2d52fde08a69dc664654ef43498253b9b764d46ee",
  ],
  "dictionaryZhHans.txt": [
    `https://raw.githubusercontent.com/parsimonhi/animCJK/${ANIMCJK}/dictionaryZhHans.txt`,
    "045076a0c94b593aabbe70c23015cb3959e959fe8cc2765845e774137c0db993",
  ],
  "STCharacters.txt": [
    `https://raw.githubusercontent.com/BYVoid/OpenCC/${OPENCC}/data/dictionary/STCharacters.txt`,
    "a0ca1601c70648cf48b33c3c6210ccbecc5c7eead4b4c3daf76587ba2c03582b",
  ],
};

/** The syllabus levels (AnimCJK set → level label, new characters) and the chunks they go in. */
const LEVELS = [
  ["hsk1", "1", 246],
  ["hsk2", "2", 125],
  ["hsk3", "3", 284],
  ["hsk4", "4", 441],
  ["hsk5", "5", 431],
  ["hsk6", "6", 413],
  ["hsk789", "7-9", 1148],
];
/** Chunk id, its levels, and into how many parts (consecutive runs by code point) it is split: HSK 7–9
 * has as many characters as 4–6 together, so it comes in three files of about their size. */
const BANDS = [
  ["hsk1-3", ["1", "2", "3"], 1],
  ["hsk4", ["4"], 1],
  ["hsk5", ["5"], 1],
  ["hsk6", ["6"], 1],
  ["hsk7-9", ["7-9"], 3],
];
/** Characters the Chinese track's traditional overrides write (erudior-courses
 * content/languages/chinese-scripts/traditional.yaml: 台 stays 台; 颱風 and 檯燈 are kept; 別著急,
 * 了解, 胡同): they must be traceable. Add new override characters here. */
const TRACK_FORMS = "台臺颱檯別著了解胡同";

const root = path.resolve(import.meta.dirname, "..");
const args = process.argv.slice(2);
const fetch = args.includes("--fetch");
const [dir, date] = args.filter((a) => a !== "--fetch");
if (!dir || !/^\d{4}-\d{2}-\d{2}$/.test(date ?? "")) {
  console.error(
    "usage: node scripts/build-hanzi-strokes.mjs <scratch dir> <YYYY-MM-DD> [--fetch]",
  );
  process.exit(2);
}

// --- Inputs -------------------------------------------------------------------------------------
const run = (cmd, argv) => {
  const r = spawnSync(cmd, argv, { stdio: "inherit" });
  if (r.status !== 0) throw new Error(`${cmd} ${argv.join(" ")} failed`);
};
if (fetch) {
  mkdirSync(dir, { recursive: true });
  for (const [name, [url]] of Object.entries(INPUTS))
    if (!existsSync(path.join(dir, name)))
      run("curl", ["-fsSL", "-o", path.join(dir, name), url]);
  if (!existsSync(path.join(dir, "node_modules/opencc-js")))
    run("npm", [
      "install",
      "--prefix",
      dir,
      "--no-save",
      "--ignore-scripts",
      "--no-audit",
      "--no-fund",
      `opencc-js@${OPENCC_JS}`,
    ]);
}
const input = (name) => {
  const buf = readFileSync(path.join(dir, name));
  const sum = createHash("sha256").update(buf).digest("hex");
  if (sum !== INPUTS[name][1])
    throw new Error(
      `${name}: SHA-256 ${sum}, expected ${INPUTS[name][1]} (${INPUTS[name][0]})`,
    );
  return buf.toString("utf8");
};

// --- The syllabus characters ----------------------------------------------------------------------
const isHan = (c) => /^\p{Script=Han}$/u.test(c);
const byCode = (a, b) => a.codePointAt(0) - b.codePointAt(0);
const levelOf = new Map(); // character → level label
for (const line of input("dictionaryZhHans.txt").split("\n")) {
  if (!line.trim()) continue;
  const r = JSON.parse(line);
  const sets = Array.isArray(r?.set)
    ? r.set.filter((s) => typeof s === "string" && /^hsk/.test(s))
    : [];
  if (!sets.length) continue;
  const lv = LEVELS.find(([s]) => s === sets[0]);
  if (
    sets.length !== 1 ||
    !lv ||
    typeof r.character !== "string" ||
    !isHan(r.character)
  )
    throw new Error(
      `dictionaryZhHans.txt: unexpected HSK entry ${line.slice(0, 80)}`,
    );
  levelOf.set(r.character, lv[1]);
}
const syllabus = new Map(LEVELS.map(([, label]) => [label, []]));
for (const [c, label] of levelOf) syllabus.get(label).push(c);
for (const [set, label, n] of LEVELS) {
  syllabus.get(label).sort(byCode);
  if (syllabus.get(label).length !== n)
    throw new Error(
      `AnimCJK ${set}: ${syllabus.get(label).length} characters, the syllabus has ${n}`,
    );
}
const simplified = [...levelOf.keys()];
if (simplified.length !== 3088)
  throw new Error(`${simplified.length} syllabus characters, expected 3,088`);

// --- Traditional forms (OpenCC s2tw) -----------------------------------------------------------
const occDir = path.join(dir, "node_modules/opencc-js");
const occPkg = JSON.parse(
  readFileSync(path.join(occDir, "package.json"), "utf8"),
);
if (occPkg.name !== "opencc-js" || occPkg.version !== OPENCC_JS)
  throw new Error(`${occDir} is not opencc-js ${OPENCC_JS}`);
const occ = (f) => import(pathToFileURL(path.join(occDir, f)).href);
const OpenCC = await occ("dist/esm/full.js");
const s2tw = OpenCC.Converter({ from: "cn", to: "tw" });
/** An OpenCC dictionary table ("a b c|d e") as key → candidates. */
const table = (text) =>
  new Map(
    text
      .split("|")
      .map((e) => e.split(" "))
      .map(([k, ...v]) => [k, v]),
  );
/** OpenCC's STCharacters.txt: "简\t簡 …" per line. */
const ST = new Map(
  input("STCharacters.txt")
    .split("\n")
    .filter((l) => l.includes("\t"))
    .map((l) => l.trim().split(/\s+/))
    .map(([k, ...v]) => [k, v]),
);
if (ST.get("发")?.join(" ") !== "發 髮")
  throw new Error("STCharacters.txt is not OpenCC's character table");
const TWV = table((await occ("dist/esm-lib/dict/TWVariants.js")).default);
const tw = (c) => TWV.get(c)?.[0] ?? c;

// --- Read graphics.txt ------------------------------------------------------------------------
const records = new Map();
for (const line of input("graphics.txt").split("\n")) {
  if (!line.trim()) continue;
  if (line.length > 100_000)
    throw new Error("a graphics.txt line is unexpectedly long");
  const r = JSON.parse(line);
  if (typeof r?.character === "string") records.set(r.character, r);
}
if (records.size < 9000)
  throw new Error(`graphics.txt has only ${records.size} characters`);

// --- Which characters go in which chunk ---------------------------------------------------------
/** [chunk id, band name, its simplified syllabus characters]: a band, or one part of it. */
const CHUNKS = [];
for (const [id, labels, parts] of BANDS) {
  const band =
    `HSK ${labels.length > 1 ? `${labels[0]}–${labels[labels.length - 1]}` : labels[0]}`.replace(
      "7-9",
      "7–9",
    );
  const chars = labels.flatMap((l) => syllabus.get(l));
  const size = Math.ceil(chars.length / parts);
  for (let p = 0; p < parts; p++)
    CHUNKS.push([
      parts > 1 ? id + "abcdefgh"[p] : id,
      parts > 1 ? `${band}, part ${p + 1} of ${parts}` : band,
      chars.slice(p * size, (p + 1) * size),
    ]);
}
const chunkOf = new Map(); // character → chunk id (the lowest band that needs it)
const noStrokes = new Set();
const skipped = new Set();
const keep = (ch, id) => chunkOf.has(ch) || chunkOf.set(ch, id);
for (const [id, , chars] of CHUNKS) {
  for (const c of chars) {
    const main = s2tw(c);
    if ([...main].length !== 1 || !isHan(main))
      throw new Error(`s2tw(${c}) = "${main}"`);
    for (const r of [c, main]) {
      if (records.has(r)) keep(r, id);
      else noStrokes.add(r);
    }
    for (const t of (ST.get(c) ?? []).map(tw)) {
      if (records.has(t)) keep(t, id);
      else if (t !== main) skipped.add(t);
    }
  }
}
const lacking = [...TRACK_FORMS].filter((c) => !chunkOf.has(c));
if (lacking.length)
  throw new Error(
    `the track's traditional forms ${lacking.join(" ")} have no data`,
  );

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
    if (!(c in ARGS))
      throw new Error(`unsupported outline command near "${s.slice(0, 12)}"`);
    s = s.slice(1);
    if (c === "M") open = true;
    else if (!open) throw new Error("outline doesn't start with M");
    const nums = [];
    for (let k = 0; k < ARGS[c]; k++) {
      s = s.replace(/^[\s,]+/, "");
      const m = NUM.exec(s);
      if (!m) throw new Error(`"${c}" needs ${ARGS[c]} numbers`);
      const v = Number(m[0]);
      if (!Number.isFinite(v) || v < -300 || v > 1324)
        throw new Error(`outline point ${v} is outside the box`);
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
  if (!Array.isArray(m) || m.length < 2 || m.length > 200)
    throw new Error("a median needs 2–200 points");
  const out = [];
  for (const p of m) {
    if (
      !Array.isArray(p) ||
      p.length !== 2 ||
      !p.every((v) => typeof v === "number" && Number.isFinite(v))
    )
      throw new Error("bad median point");
    const q = [ax(p[0]), ay(p[1])];
    if (q.some((v) => v < -15 || v > 115))
      throw new Error(`median point ${p} is outside the box`);
    const last = out[out.length - 1];
    if (!last || last[0] !== q[0] || last[1] !== q[1]) out.push(q);
  }
  if (out.length < 2) out.push(out[0]);
  return out.map((q) => q.join(" ")).join(" ");
}

/** A character's strokes as "outline;outline;…|median;median;…". */
function strokesOf(ch) {
  const r = records.get(ch);
  if (
    !Array.isArray(r.strokes) ||
    !Array.isArray(r.medians) ||
    r.strokes.length !== r.medians.length
  )
    throw new Error(`${ch}: strokes and medians don't match`);
  if (!r.strokes.length || r.strokes.length > 40)
    throw new Error(`${ch}: ${r.strokes.length} strokes`);
  try {
    const outlines = r.strokes.map((d) => {
      if (typeof d !== "string" || d.length > 20_000)
        throw new Error("bad outline");
      return compactOutline(d);
    });
    return outlines.join(";") + "|" + r.medians.map(compactMedian).join(";");
  } catch (e) {
    throw new Error(`${ch}: ${e.message}`);
  }
}

// --- Write the chunks ------------------------------------------------------------------------------
const source = [
  `// Source: Make Me a Hanzi graphics.txt, commit ${MAKEMEAHANZI},`,
  `// https://github.com/skishore/makemeahanzi. graphics.txt is derived from the fonts Arphic PL KaitiM GB and`,
  `// Arphic PL UKai (© 1999 Arphic Technology Co., Ltd.) and is distributed under the Arphic Public License; the`,
  `// licence text (ARPHICPL.TXT) is in public/third-party-licenses.txt and scripts/licenses/makemeahanzi-ARPHICPL-COPYING.txt.`,
];
const lib = path.join(root, "src/lib");
const written = new Set();
const chunkChars = {};
const report = [];
let strokes = 0;
for (const [id, band, own] of CHUNKS) {
  const chars = [...chunkOf]
    .filter(([, c]) => c === id)
    .map(([ch]) => ch)
    .sort(byCode);
  const news = own.length;
  chunkChars[id] = chars.join("");
  const data = {};
  for (const ch of chars) {
    data[ch] = strokesOf(ch);
    strokes += data[ch].split("|")[0].split(";").length;
  }
  const notice = [
    `// NOTICE OF MODIFICATION (Arphic Public License, section 2a): this file was changed from graphics.txt on`,
    `// ${date} by scripts/build-hanzi-strokes.mjs (Erudior). It keeps only ${chars.length} characters (the ${news} new characters`,
    `// of ${band} and their Taiwan traditional forms from OpenCC not in an earlier file); each stroke's`,
    `// outline path is kept with the spaces after its command letters removed, and each stroke's median is converted`,
    `// from the 1024 box (y up) to a 0–100 square (y down) and rounded to 0.1. Stroke order and shapes are otherwise`,
    `// unchanged. This file is distributed under the Arphic Public License, like graphics.txt; Erudior's own code is`,
    `// not covered by it. The script that makes this file from graphics.txt is public in the same repository`,
    `// (scripts/build-hanzi-strokes.mjs).`,
  ];
  const out =
    [
      `// GENERATED by scripts/build-hanzi-strokes.mjs: do not edit. Hanzi strokes for ${band}, loaded only when a`,
      `// Chinese lesson traces one of these characters (src/lib/hanziLoad.ts).`,
      `//`,
      ...source,
      `//`,
      ...notice,
    ].join("\n") +
    `\n\n/** Character → "outline;outline;…|median;median;…", one of each per stroke in writing order (PRC order).\n` +
    ` * An outline is an SVG path in Make Me a Hanzi's 1024 box with y up; a median is "x y x y …" in the\n` +
    ` * 0–100 square with y down: the line the stroke follows, from where it starts. See hanziStrokes.ts. */\n` +
    `const HANZI_STROKES: Record<string, string> = ${JSON.stringify(data).replace(/","/g, '",\n"')};\nexport default HANZI_STROKES;\n`;
  const file = `hanziStrokes.${id}.data.ts`;
  writeFileSync(path.join(lib, file), out);
  written.add(file);
  report.push(
    `  ${file}: ${chars.length} hanzi (${news} new syllabus characters), ${Buffer.byteLength(out)} bytes`,
  );
}
// Chunk files this run didn't make (an older split) go.
for (const f of readdirSync(lib))
  if (/^hanziStrokes\..*data\.ts$/.test(f) && !written.has(f))
    unlinkSync(path.join(lib, f));

// --- The list ----------------------------------------------------------------------------------
const listOut =
  [
    `// GENERATED by scripts/build-hanzi-strokes.mjs: do not edit. Which hanzi have tracing data and which chunk`,
    `// holds their strokes (hanziStrokes.<chunk>.data.ts, from Make Me a Hanzi, Arphic Public License).`,
  ].join("\n") +
  `\n\n/** The hanzi of each stroke-data chunk, by code point: the new characters of an HSK band (2025 exam syllabus)\n` +
  ` * and their Taiwan traditional forms (OpenCC s2tw and the other traditional candidates OpenCC lists) that\n` +
  ` * no lower band has. */\n` +
  `export const HANZI_CHUNKS = {\n${CHUNKS.map(([id]) => `  ${JSON.stringify(id)}: ${JSON.stringify(chunkChars[id])},`).join("\n")}\n};\n` +
  `\nexport type HanziChunk = keyof typeof HANZI_CHUNKS;\n` +
  `\n/** Every hanzi that can be traced in a Chinese course (${chunkOf.size}: HSK 1–9 and their traditional forms). */\n` +
  `export const TRACE_HANZI = Object.values(HANZI_CHUNKS).join("");\n` +
  `\n/** Syllabus characters (or their s2tw forms) that Make Me a Hanzi has no strokes for: they can't be traced. */\n` +
  `export const HANZI_NO_STROKES = ${JSON.stringify([...noStrokes].sort(byCode).join(""))};\n` +
  `\nexport const MAKEMEAHANZI_COMMIT = ${JSON.stringify(MAKEMEAHANZI)};\n`;
writeFileSync(path.join(lib, "hanziList.ts"), listOut);

const wrap = (s) =>
  [...s]
    .join("")
    .match(/.{1,60}/gu)
    .join("\n");
const hskOut =
  [
    `# GENERATED by scripts/build-hanzi-strokes.mjs: do not edit. The 3,088 reading characters (认读字) of the HSK`,
    `# exam syllabus (2025, in force July 2026), levels 1-9, simplified: the new characters of each level, by code`,
    `# point (not in syllabus order). Read from AnimCJK dictionaryZhHans.txt (commit ${ANIMCJK}),`,
    `# whose sets hsk1 ... hsk789 match the syllabus counts. "## <level>" starts a level.`,
  ].join("\n") +
  "\n" +
  LEVELS.map(
    ([, label, n]) =>
      `## ${label} (${n})\n${wrap(syllabus.get(label).join(""))}\n`,
  ).join("");
writeFileSync(path.join(root, "scripts/data/hsk-hanzi.txt"), hskOut);

console.log(
  `${chunkOf.size} hanzi (${simplified.length - [...noStrokes].filter((c) => levelOf.has(c)).length} syllabus characters, the rest traditional forms), ${strokes} strokes, opencc-js ${occPkg.version}\n` +
    report.join("\n") +
    `\n  src/lib/hanziList.ts, scripts/data/hsk-hanzi.txt` +
    (noStrokes.size
      ? `\nNo Make Me a Hanzi data (can't be traced): ${[...noStrokes].map((c) => `${c}${levelOf.has(c) ? ` (HSK ${levelOf.get(c)})` : " (s2tw form)"}`).join(" ")}`
      : "") +
    (skipped.size
      ? `\nOther OpenCC candidates without Make Me a Hanzi data (left out): ${[...skipped].join(" ")}`
      : ""),
);

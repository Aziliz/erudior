// Pure phonics parsers shared by runtime and worker-side canonical authoring validation.
import { letterGuide, TOLERANCE, type Tolerance } from "./handwriting";

export const PHONICS_BLOCK = /^```(sounds|blend|trace)\b([^\n]*)\r?\n([\s\S]*?)^```[ \t]*$/gm;


/** Splits a line into bare tokens and key=value options ("quoted values" may hold spaces). */
function tokens(line: string): { bare: string[]; opts: Record<string, string> } {
  const bare: string[] = [];
  const opts: Record<string, string> = {};
  for (const m of line.matchAll(/([A-Za-z]+)=(?:"([^"]*)"|(\S+))|"([^"]*)"|(\S+)/g)) {
    if (m[1]) opts[m[1].toLowerCase()] = m[2] ?? m[3] ?? "";
    else bare.push(m[4] ?? m[5]);
  }
  return { bare, opts };
}

const lines = (body: string) =>
  body
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"));

/** The library key for a letter's sound: "Mm" and "m" both use sound:m. */
export function soundKey(show: string): string {
  const s = show.trim();
  if (s.length === 2 && s[0] !== s[1] && s[0].toLowerCase() === s[1]) return `sound:${s[1]}`;
  return `sound:${s.toLowerCase()}`;
}

// --- sounds -----------------------------------------------------------------------------

export interface SoundTile {
  show: string;
  word?: string;
  /** Library key or data:audio URL for the sound. */
  sound: string;
  /** Text-to-speech stand-in when there's no recording. */
  say?: string;
}

export function parseSounds(info: string, body: string): { tiles: SoundTile[]; problems: string[] } {
  const problems: string[] = [];
  if (info.trim()) problems.push(`unknown option "${info.trim()}" (sounds blocks take none)`);
  const tiles: SoundTile[] = [];
  for (const l of lines(body)) {
    const { bare, opts } = tokens(l);
    if (!bare.length) {
      problems.push(`line "${l}" has no letters to show`);
      continue;
    }
    if (bare.length > 1) problems.push(`line "${l}": write extras as word=…, sound=… or say=…`);
    for (const k of Object.keys(opts)) if (!["word", "sound", "say"].includes(k)) problems.push(`line "${l}": unknown option ${k}=`);
    tiles.push({ show: bare[0], word: opts.word || undefined, sound: opts.sound || soundKey(bare[0]), say: opts.say || undefined });
  }
  if (!tiles.length) problems.push("no letters");
  return { tiles, problems };
}


export interface BlendUnit {
  show: string;
  sound: string;
}
export interface BlendWord {
  word: string;
  units: BlendUnit[];
}

export function parseUnits(text: string): BlendUnit[] {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((u) => {
      const m = /^(.+?)\[(.+)\]$/.exec(u);
      if (!m) return { show: u, sound: soundKey(u) };
      return { show: m[1], sound: /^data:/i.test(m[2]) || m[2].includes(":") ? m[2] : soundKey(m[2]) };
    });
}

export function parseBlend(info: string, body: string): { words: BlendWord[]; problems: string[] } {
  const problems: string[] = [];
  if (info.trim()) problems.push(`unknown option "${info.trim()}" (blend blocks take none)`);
  const words: BlendWord[] = [];
  for (const l of lines(body)) {
    const m = /^(.+?)\s*=\s*(.+)$/.exec(l);
    if (!m) {
      problems.push(`line "${l}" should look like "cat = c a t"`);
      continue;
    }
    const units = parseUnits(m[2]);
    if (units.length < 2) problems.push(`"${m[1]}" needs at least two sounds`);
    if (units.map((u) => u.show).join("").toLowerCase() !== m[1].trim().toLowerCase())
      problems.push(`the sounds "${units.map((u) => u.show).join(" ")}" don't spell "${m[1].trim()}"`);
    words.push({ word: m[1].trim(), units });
  }
  if (!words.length) problems.push("no words");
  return { words, problems };
}


export interface TraceSpec {
  letters: string[];
  tolerance: Tolerance;
  problems: string[];
}

export function parseTrace(info: string, body: string): TraceSpec {
  const problems: string[] = [];
  let tolerance: Tolerance = "normal";
  for (const tok of info.trim().split(/\s+/).filter(Boolean)) {
    const m = /^tolerance=(.*)$/i.exec(tok);
    if (m && m[1] in TOLERANCE) tolerance = m[1] as Tolerance;
    else problems.push(m ? `tolerance must be loose, normal or tight, not "${m[1]}"` : `unknown option "${tok}" (only tolerance=loose|normal|tight)`);
  }
  const letters: string[] = [];
  for (const ch of body.replace(/\s+/g, "")) {
    if (letterGuide(ch)) letters.push(ch);
    else problems.push(`"${ch}" can't be traced (letters a–z and A–Z only)`);
  }
  if (!letters.length) problems.push("no letters to trace");
  return { letters, tolerance, problems };
}


/** Authoring problems for a Markdown text ("blend 1: the sounds … don't spell …"). */
export function phonicsProblems(md: string): string[] {
  const out: string[] = [];
  const count: Record<string, number> = {};
  for (const m of md.matchAll(PHONICS_BLOCK)) {
    const kind = m[1];
    count[kind] = (count[kind] ?? 0) + 1;
    const p = kind === "sounds" ? parseSounds(m[2], m[3]).problems : kind === "blend" ? parseBlend(m[2], m[3]).problems : parseTrace(m[2], m[3]).problems;
    out.push(...p.map((x) => `${kind} ${count[kind]}: ${x}`));
  }
  const opened = (md.match(/^```(sounds|blend|trace)\b/gm) ?? []).length;
  if (opened > [...md.matchAll(PHONICS_BLOCK)].length) out.push("a ```sounds, ```blend or ```trace block is never closed with ```");
  return out;
}

// Worker-safe listening source parser; original Markdown remains the canonical source.
import { validateEmbeddedAudio, type AudioValidationOptions } from "./courseAudio";

export interface MediaLine {
  /** Dialogue: who says it. */
  speaker?: string;
  text: string;
  translation?: string;
  audio?: string;
}

export interface MediaBlock {
  kind: "dialogue" | "speak";
  title?: string;
  /** Voice language from the info string (lang=de-DE); else the course's. */
  lang?: string;
  lines: MediaLine[];
  problems: string[];
}

/** A whole ```dialogue or ```speak block at the start of a line. */
export const MEDIA_BLOCK = /^```(dialogue|speak)\b([^\n]*)\r?\n([\s\S]*?)^```[ \t]*$/gm;

const SPEAKER = /^([^\s:=#][^:=]{0,39}?):\s+(.+)$/;
const AUDIO = /^audio:\s*(.*)$/i;
const LANG = /^[A-Za-z]{2,3}([-_][A-Za-z0-9]{2,8})*$/;

export function parseMedia(kind: "dialogue" | "speak", info: string, body: string, options: AudioValidationOptions = {}): MediaBlock {
  const problems: string[] = [];
  const b: MediaBlock = { kind, lines: [], problems };
  for (const tok of info.trim().split(/\s+/).filter(Boolean)) {
    const m = /^lang=(.*)$/i.exec(tok);
    if (!m) problems.push(`unknown option "${tok}" (only lang=… is understood)`);
    else if (!LANG.test(m[1])) problems.push(`lang must be a language code like de-DE, not "${m[1]}"`);
    else b.lang = m[1];
  }
  // The field the next plain line continues.
  let last: "text" | "translation" | null = null;
  for (const raw of body.replace(/\r\n?/g, "\n").split("\n")) {
    const line = raw.trim();
    const cur = b.lines[b.lines.length - 1];
    if (!line) {
      last = null;
      continue;
    }
    if (line.startsWith("#") && !b.lines.length && b.title === undefined) {
      b.title = line.replace(/^#+\s*/, "");
      continue;
    }
    const audio = AUDIO.exec(line);
    if (audio) {
      if (!cur) problems.push("audio: before the first line");
      else if (cur.audio) problems.push(`line ${b.lines.length}: more than one audio:`);
      else if (validateEmbeddedAudio(audio[1], "audio", options).length > 0) problems.push(`line ${b.lines.length}: audio must be a data:audio/…;base64 URL: ${validateEmbeddedAudio(audio[1], "audio", options).join("; ")}`);
      else cur.audio = audio[1];
      last = null;
      continue;
    }
    if (line.startsWith("=")) {
      const tr = line.slice(1).trim();
      if (!cur) problems.push("a translation (=) before the first line");
      else if (cur.translation !== undefined) problems.push(`line ${b.lines.length}: more than one translation (=)`);
      else if (!tr) problems.push(`line ${b.lines.length}: empty translation`);
      else {
        cur.translation = tr;
        last = "translation";
      }
      continue;
    }
    if (kind === "dialogue") {
      const m = SPEAKER.exec(line);
      if (m) {
        b.lines.push({ speaker: m[1].trim(), text: m[2].trim() });
        last = "text";
      } else if (cur && last) cur[last] = `${cur[last]} ${line}`;
      else problems.push(`"${line.slice(0, 40)}" has no speaker (write "Name: what they say")`);
    } else {
      // In a speak block every line is a new phrase.
      b.lines.push({ text: line });
      last = "text";
    }
  }
  if (!b.lines.length) problems.push(kind === "dialogue" ? 'no lines (write "Name: what they say")' : "no phrases to say");
  return b;
}

export function findMedia(md: string, options: AudioValidationOptions = {}): MediaBlock[] {
  return [...md.matchAll(MEDIA_BLOCK)].map((m) => parseMedia(m[1] as "dialogue" | "speak", m[2], m[3], options));
}

/** Authoring problems ("dialogue 1 ("Im Café"): line 2: …"). */
export function mediaProblems(md: string, options: AudioValidationOptions = {}): string[] {
  const blocks = findMedia(md, options);
  const out = blocks.flatMap((b, i) => b.problems.map((p) => `${b.kind} ${i + 1}${b.title ? ` ("${b.title.slice(0, 40)}")` : ""}: ${p}`));
  const opened = (md.match(/^```(dialogue|speak)\b/gm) ?? []).length;
  if (opened > blocks.length) out.push("a ```dialogue or ```speak block is never closed with ```");
  return out;
}

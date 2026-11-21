// Course-checker rules for Latin and Ancient Greek courses (tests/check-course.mts). Pure.
//
// - Greek text is NFC.
// - A Greek word has no Latin or Cyrillic letters (look-alikes: o/ο, a/α, v/ν, k/κ, p/ρ…), no ς
//   inside it and no σ at its end. A Latin word has no Greek or Cyrillic letters.
// - A vocabulary `dict` starts with the headword; `gender` is m, f, n or a combination.
// - ```pron blocks and {pron=…} marks name a declared scheme (pronBlocks.pronProblems).

import { GENDER } from "./course";
import { pronProblems } from "./pronBlocks";

const GREEK = /[Ͱ-Ͽἀ-῿]/;
const LATIN = /[A-Za-zÀ-ɏ]/;
const CYRILLIC = /[Ѐ-ӿ]/;
const WORD = /[\p{L}\p{M}]+/gu;
const BASE_SIGMA = /[σς]/;

/** Keys whose values aren't text a reader sees (ids, embedded media). */
const SKIP_KEYS = new Set(["id", "lesson", "from", "module", "src", "srcs", "audio", "image", "format", "version", "conj", "type", "section", "topic", "tts", "ime", "code"]);

/** Every string in the course with a readable path ("vocab[3].dict", "lessons[0].body"). */
function walk(v: unknown, path: string, out: { path: string; text: string }[]) {
  if (typeof v === "string") {
    if (!/^data:/.test(v)) out.push({ path, text: v });
    return;
  }
  if (Array.isArray(v)) return v.forEach((x, i) => walk(x, `${path}[${i}]`, out));
  if (v && typeof v === "object")
    for (const [k, x] of Object.entries(v)) {
      if (SKIP_KEYS.has(k) && typeof x !== "object") continue;
      if (k === "audio" && typeof x === "string") continue;
      walk(x, path ? `${path}.${k}` : k, out);
    }
}

/** Problems with one piece of text (mixed scripts and sigma inside a word, NFC). */
export function classicalTextProblems(text: string): string[] {
  const out: string[] = [];
  if (GREEK.test(text) && text !== text.normalize("NFC")) out.push("Greek text isn't NFC (normalize it, e.g. with .normalize('NFC'))");
  for (const m of text.matchAll(WORD)) {
    const w = m[0];
    const greek = GREEK.test(w);
    const latin = LATIN.test(w);
    const cyr = CYRILLIC.test(w);
    if (greek && (latin || cyr)) out.push(`"${w}" mixes Greek with ${latin ? "Latin" : "Cyrillic"} letters (a look-alike such as o/ο, a/α, v/ν, k/κ?)`);
    else if (latin && cyr) out.push(`"${w}" mixes Latin and Cyrillic letters`);
    if (greek && !latin && !cyr) {
      const letters = [...w.normalize("NFD").replace(/[̀-ͯ]/g, "")];
      if (letters.length > 1) {
        letters.forEach((ch, i) => {
          if (ch === "ς" && i < letters.length - 1) out.push(`"${w}" has final sigma ς inside the word (write σ)`);
          if (ch === "σ" && i === letters.length - 1 && BASE_SIGMA.test(ch)) out.push(`"${w}" ends in σ (write final ς)`);
          if (ch === "ϲ" || ch === "Ϲ") out.push(`"${w}" has a lunate sigma (write σ/ς)`);
        });
      }
    }
  }
  return out;
}

interface RawVocab {
  id?: unknown;
  term?: unknown;
  dict?: unknown;
  gender?: unknown;
}

/** Every Latin/Greek rule for a raw course file (`code` is its language code). */
export function classicalCourseProblems(raw: Record<string, unknown>, code: string): string[] {
  const out: string[] = [];
  const strings: { path: string; text: string }[] = [];
  walk(raw, "", strings);
  for (const s of strings) for (const p of classicalTextProblems(s.text)) out.push(`${s.path}: ${p}`);
  const vocab = Array.isArray(raw.vocab) ? (raw.vocab as RawVocab[]) : [];
  vocab.forEach((v, i) => {
    const where = `vocab ${typeof v?.id === "string" ? v.id : i}`;
    if (v?.dict !== undefined) {
      if (typeof v.dict !== "string" || !v.dict.trim()) out.push(`${where}: "dict" must be text`);
      else if (typeof v.term === "string" && !v.dict.normalize("NFC").trim().startsWith(v.term.normalize("NFC").trim()))
        out.push(`${where}: "dict" (${v.dict}) must start with the headword "${v.term}"`);
    }
    if (v?.gender !== undefined && (typeof v.gender !== "string" || !GENDER.test(v.gender.trim())))
      out.push(`${where}: "gender" must be m, f, n or a combination such as m/f (got ${JSON.stringify(v.gender)})`);
  });
  const lang = (raw.language ?? {}) as Record<string, unknown>;
  if (lang.tts !== undefined && typeof lang.tts === "string" && lang.tts.split(/[-_]/)[0] !== code)
    out.push(`language.tts: leave it out (or "${code}") so the audio follows the pronunciation switch; "${lang.tts}" bypasses it`);
  return out;
}

/** pron block and inline mark problems in one Markdown text (any course). */
export function pronTextProblems(text: string, declared: string[]): string[] {
  return text.includes("pron") ? pronProblems(text, declared) : [];
}

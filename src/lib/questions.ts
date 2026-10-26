// Question kinds beyond plain multiple choice: grading, "answered" checks and validation.
// See QuestionType in types.ts for how each kind stores its answer.

import type { AudioClip, Chosen, Question, QuestionImage, QuestionType } from "./types";
import { sameSet } from "./util";
import { isAudioSrc } from "./audio";

export const QUESTION_TYPES: QuestionType[] = ["choice", "text", "match", "label", "order"];

export const qtype = (q: Pick<Question, "type">): QuestionType => q.type ?? "choice";

/** Choice questions with one answer or several (the only kind live rooms and community courses use). */
export const isChoice = (q: Pick<Question, "type">) => qtype(q) === "choice";

/** A blank in a fill-in-the-blank stem: three or more underscores. */
export const BLANK = /_{3,}/g;

/** Number of answer boxes for a text question. */
export function blankCount(q: Pick<Question, "stem" | "accept">): number {
  return Math.max(1, (q.stem.match(BLANK) ?? []).length, q.accept?.length ?? 0);
}

/** Text answers compare without regard to spacing, curly quotes, dashes or a final period. */
export function normText(s: string, caseSensitive = false): string {
  let t = s
    .normalize("NFKC")
    .replace(/[‘’ʼ]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[‐‑‒–—−]/g, "-")
    .replace(/\s+/g, " ")
    .replace(/\s*-\s*/g, "-")
    .trim()
    .replace(/[.!?;:]+$/, "")
    .trim();
  if (!caseSensitive) t = t.toLowerCase();
  return t;
}

const NUM = /^[-+]?(\d+(\.\d*)?|\.\d+)(e[-+]?\d+)?$/i;
const FRAC = /^([-+]?)(\d+)\/(\d+)$/;
const MIXED = /^([-+]?)(\d+) (\d+)\/(\d+)$/;

/** Drops spaces, except one between two digits ("1 1/2" stays a mixed number, not "11/2"). */
function compact(s: string): string {
  return s.replace(/\s+/g, " ").replace(/ (?!\d)|(?<!\d) /g, "");
}

/** The value of a plain number or simple fraction ("0.5", ".5", "1/2", "-3/4"), else null. */
function numValue(s: string): number | null {
  let t = s.replace(/,/g, "");
  if (/^[-+]?\d{1,3}( \d{3})+(\.\d*)?$/.test(t)) t = t.replace(/ /g, ""); // "1 000 000"
  if (NUM.test(t)) return Number(t);
  const f = FRAC.exec(t);
  if (f && Number(f[3]) !== 0) return (f[1] === "-" ? -1 : 1) * (Number(f[2]) / Number(f[3]));
  const m = MIXED.exec(t);
  if (m && Number(m[4]) !== 0) return (m[1] === "-" ? -1 : 1) * (Number(m[2]) + Number(m[3]) / Number(m[4]));
  return null;
}

/**
 * True if a typed answer matches one of the accepted ones. Spaces don't matter ("x + 3" = "x+3"),
 * and numbers compare by value, fractions and mixed numbers included ("1/2" = "0.5" = ".5",
 * "1 1/2" = "3/2" = "1.5"). A space between two digits is kept, so "1 1/2" never reads as "11/2".
 */
export function textMatches(typed: string, accepted: string[], caseSensitive = false, lowestTerms = false): boolean {
  const t = normText(typed, caseSensitive);
  if (!t) return false;
  const tc = compact(t);
  if (lowestTerms && !isLowest(tc)) return false;
  const tv = numValue(tc);
  return accepted.some((a) => {
    const n = normText(a, caseSensitive);
    const nc = compact(n);
    if (n === t || nc === tc) return true;
    const av = numValue(nc);
    return tv !== null && av !== null && Math.abs(tv - av) <= 1e-9 * Math.max(1, Math.abs(av));
  });
}

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);

/** False for a fraction that can be reduced ("6/8", "1 2/4", "4/2"); anything else passes. */
export function isLowest(s: string): boolean {
  const f = FRAC.exec(s) ?? (() => { const m = MIXED.exec(s); return m ? [m[0], m[1], m[3], m[4]] : null; })();
  if (!f) return true;
  const n = Number(f[2]), d = Number(f[3]);
  return d > 1 && gcd(n, d) === 1;
}

/** Has the learner given an answer (all of it, for kinds with several parts)? */
export function isAnswered(q: Question, chosen: Chosen | undefined): boolean {
  if (!chosen?.length) return false;
  switch (qtype(q)) {
    case "text":
      return chosen.some((c) => String(c).trim() !== "");
    case "match":
    case "label":
      return chosen.some((c) => typeof c === "number" && c >= 0);
    default:
      return true;
  }
}

/** True when every part is filled in (used to warn before checking a half-done answer). */
export function isComplete(q: Question, chosen: Chosen | undefined): boolean {
  if (!isAnswered(q, chosen)) return false;
  switch (qtype(q)) {
    case "text":
      return Array.from({ length: blankCount(q) }, (_, i) => String(chosen![i] ?? "").trim() !== "").every(Boolean);
    case "match":
    case "label":
      return q.answer.every((_, i) => typeof chosen![i] === "number" && (chosen![i] as number) >= 0);
    default:
      return true;
  }
}

export function isCorrect(q: Question, chosen: Chosen | undefined): boolean {
  if (!chosen || !isAnswered(q, chosen)) return false;
  switch (qtype(q)) {
    case "text":
      return (q.accept ?? []).every((acc, i) => textMatches(String(chosen[i] ?? ""), acc, q.caseSensitive, q.lowestTerms));
    case "match":
    case "label":
      return q.answer.length > 0 && q.answer.every((a, i) => chosen[i] === a);
    case "order":
      return chosen.length === q.choices.length && chosen.every((c, i) => c === i);
    default:
      return sameSet(
        q.answer,
        chosen.filter((c): c is number => typeof c === "number"),
      );
  }
}

/** Per-part right/wrong (blanks, matches, labels, order positions); empty for choice questions. */
export function partsCorrect(q: Question, chosen: Chosen): boolean[] {
  switch (qtype(q)) {
    case "text":
      return (q.accept ?? []).map((acc, i) => textMatches(String(chosen[i] ?? ""), acc, q.caseSensitive, q.lowestTerms));
    case "match":
    case "label":
      return q.answer.map((a, i) => chosen[i] === a);
    case "order":
      return q.choices.map((_, i) => chosen[i] === i);
    default:
      return [];
  }
}

/** Plain-text description of the correct answer (for review screens and reports). */
export function answerText(q: Question): string {
  switch (qtype(q)) {
    case "text":
      return (q.accept ?? []).map((a) => a[0]).join("; ");
    case "match":
      return (q.left ?? []).map((l, i) => `${l} → ${q.choices[q.answer[i]]}`).join("; ");
    case "label":
      return q.answer.map((a, i) => `${i + 1}: ${q.choices[a]}`).join("; ");
    case "order":
      return q.choices.join(" → ");
    default:
      return q.answer.map((a) => q.choices[a]).join("; ");
  }
}

/** Plain-text description of a learner's answer. */
export function chosenText(q: Question, chosen: Chosen): string {
  if (!isAnswered(q, chosen)) return "";
  switch (qtype(q)) {
    case "text":
      return chosen.map((c) => String(c).trim() || "(blank)").join("; ");
    case "match":
      return (q.left ?? [])
        .map((l, i) => `${l} → ${typeof chosen[i] === "number" && (chosen[i] as number) >= 0 ? q.choices[chosen[i] as number] : "(none)"}`)
        .join("; ");
    case "label":
      return q.answer
        .map((_, i) => `${i + 1}: ${typeof chosen[i] === "number" && (chosen[i] as number) >= 0 ? q.choices[chosen[i] as number] : "(none)"}`)
        .join("; ");
    case "order":
      return chosen.map((c) => q.choices[c as number]).join(" → ");
    default:
      return chosen.map((c) => q.choices[c as number]).join("; ");
  }
}

/** How a question is described to learners ("Fill in the blank", …). */
export function typeLabel(q: Question): string {
  switch (qtype(q)) {
    case "text":
      return blankCount(q) > 1 ? "Fill in the blanks" : "Type the answer";
    case "match":
      return "Match";
    case "label":
      return "Label the picture";
    case "order":
      return "Put in order";
    default:
      return q.answer.length > 1 ? "Select all that apply" : "Multiple choice";
  }
}

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);

function readImage(v: unknown): QuestionImage | undefined {
  if (!isObj(v) || typeof v.src !== "string" || !v.src) return undefined;
  return {
    src: v.src,
    alt: typeof v.alt === "string" ? v.alt : "",
    ...(typeof v.caption === "string" && v.caption ? { caption: v.caption } : {}),
  };
}

/** A listening question's sound: a data:audio URL and/or text for the device's voice. */
function readAudio(v: unknown): AudioClip | undefined {
  if (!isObj(v)) return undefined;
  const src = isAudioSrc(v.src) ? v.src : undefined;
  const text = typeof v.text === "string" && v.text.trim() ? v.text.trim() : undefined;
  if (!src && !text) return undefined;
  const lang = typeof v.lang === "string" && /^[A-Za-z]{2,3}([-_][A-Za-z0-9]{2,8})*$/.test(v.lang) ? v.lang : undefined;
  return { ...(src ? { src } : {}), ...(text ? { text } : {}), ...(lang ? { lang } : {}) };
}

/**
 * Check and tidy the type-specific fields of a question read from a file. Returns the
 * fields to merge into the question, or throws an Error with a readable message.
 */
export function normalizeQuestionKind(q: Record<string, unknown>): Partial<Question> & { choices: string[]; answer: number[] } {
  const type = (typeof q.type === "string" ? q.type : "choice") as QuestionType;
  if (!QUESTION_TYPES.includes(type)) throw new Error(`has an unknown "type" ("${String(q.type)}").`);
  const image = readImage(q.image);
  if (q.image !== undefined && !image) throw new Error(`has an "image" without a "src".`);
  if (image && !image.alt.trim()) throw new Error(`has an image without "alt" text (describe the picture).`);
  const audio = readAudio(q.audio);
  if (q.audio !== undefined && !audio) throw new Error(`has "audio" without a data:audio "src" or a "text" to speak.`);
  const choices = Array.isArray(q.choices) ? q.choices.map((c) => String(c)) : [];
  const base = {
    ...(type !== "choice" ? { type } : {}),
    ...(image ? { image } : {}),
    ...(audio ? { audio } : {}),
  };
  const indices = (v: unknown) => (Array.isArray(v) ? v : v === undefined ? [] : [v]).map((a) => Number(a));
  const inRange = (a: number) => Number.isInteger(a) && a >= 0 && a < choices.length;
  switch (type) {
    case "choice": {
      if (choices.length < 2) throw new Error(`needs at least two "choices".`);
      const answer = indices(q.answer);
      if (!answer.length || !answer.every(inRange))
        throw new Error(`has an invalid "answer". Use zero-based choice indices, e.g. 0 for the first choice.`);
      return {
        ...base,
        choices,
        answer: Array.from(new Set(answer)).sort((a, b) => a - b),
      };
    }
    case "text": {
      const accept = Array.isArray(q.accept) ? q.accept.map((a) => (Array.isArray(a) ? a : [a]).map((x) => String(x)).filter((x) => x.trim())) : [];
      const blanks = (String(q.stem ?? "").match(BLANK) ?? []).length;
      if (!accept.length || accept.some((a) => !a.length)) throw new Error(`needs "accept": a list of accepted answers for each blank.`);
      if (blanks > 1 && blanks !== accept.length) throw new Error(`has ${blanks} blanks but ${accept.length} "accept" lists.`);
      if (blanks <= 1 && accept.length > 1) throw new Error(`has ${accept.length} "accept" lists but only one blank (mark blanks with ___).`);
      return {
        ...base,
        choices: [],
        answer: [],
        accept,
        ...(q.caseSensitive ? { caseSensitive: true } : {}),
        ...(q.lowestTerms ? { lowestTerms: true } : {}),
      };
    }
    case "match":
    case "label": {
      const answer = indices(q.answer);
      if (choices.length < 2) throw new Error(`needs at least two "choices" to pick from.`);
      if (!answer.length || !answer.every(inRange)) throw new Error(`has an invalid "answer" (one choice index per item).`);
      if (type === "match") {
        const left = Array.isArray(q.left) ? q.left.map((l) => String(l)) : [];
        if (left.length < 2 || left.length !== answer.length) throw new Error(`needs "left" items, one per "answer" entry (at least two).`);
        return { ...base, choices, answer, left };
      }
      if (!image) throw new Error(`(label) needs an "image".`);
      const markers = Array.isArray(q.markers) ? q.markers.filter(isObj).map((m) => ({ x: Number(m.x), y: Number(m.y) })) : [];
      if (markers.length !== answer.length || markers.some((m) => !(m.x >= 0 && m.x <= 100 && m.y >= 0 && m.y <= 100)))
        throw new Error(`needs "markers" (x and y in percent, 0–100), one per "answer" entry.`);
      return { ...base, choices, answer, markers };
    }
    case "order": {
      if (choices.length < 2) throw new Error(`needs at least two items in "choices" (in the correct order).`);
      if (new Set(choices).size !== choices.length) throw new Error(`has the same item twice.`);
      return { ...base, choices, answer: [] };
    }
  }
}

// Question kinds beyond plain multiple choice: grading, "answered" checks and validation.
// See QuestionType in types.ts for how each kind stores its answer.

import type { AudioClip, Chosen, Question, QuestionImage, QuestionType } from "./types";
import { sameSet } from "./util";
import { actionLabel, describe, manipCorrect, readSpec, stateOr, targetProblems, targetText, validState } from "./manip";
import { isAudioSrc } from "./audio";
import { parseMapSpec } from "./mapSpec";
import { samePlace } from "./mapNames";
import { parseSpan, parseTimeline } from "./timeline";
import { normalizeCodeSpec, readStamp } from "./code";

export const QUESTION_TYPES: QuestionType[] = ["choice", "text", "match", "label", "order", "model", "map", "timeline", "code"];

export const qtype = (q: Pick<Question, "type">): QuestionType => q.type ?? "choice";

/** Map questions where the learner picks the named place(s) on the map (answers are names). */
export const isMapFind = (q: Pick<Question, "type" | "targets">) => qtype(q) === "map" && !!q.targets?.length;

/** The base map a map question uses (for matching place names like "CO" = "Colorado"). */
export const mapBaseOf = (q: Pick<Question, "map">) => parseMapSpec(q.map ?? "").base;

const picksOf = (chosen: Chosen) => chosen.filter((c): c is string => typeof c === "string" && c.trim() !== "");

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
    case "map":
      if (isMapFind(q)) return picksOf(chosen).length > 0;
      return chosen.some((c) => typeof c === "number" && c >= 0);
    case "match":
    case "label":
    case "timeline":
      return chosen.some((c) => typeof c === "number" && c >= 0);
    case "model":
      // The state is saved only once the learner changes the model.
      return validState(readSpec(q.model).model, chosen);
    case "code":
      // Handed in = the tests ran on the code as it is now.
      return readStamp(chosen) !== null;
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
    case "map":
      if (isMapFind(q)) return picksOf(chosen!).length >= q.targets!.length;
      return q.answer.every((_, i) => typeof chosen![i] === "number" && (chosen![i] as number) >= 0);
    case "match":
    case "label":
    case "timeline":
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
    case "map":
      if (isMapFind(q)) {
        // Every target picked and nothing else (names compare like "CO" = "Colorado").
        const base = mapBaseOf(q);
        const picks = picksOf(chosen);
        return q.targets!.every((t) => picks.some((p) => samePlace(base, p, t))) && picks.every((p) => q.targets!.some((t) => samePlace(base, p, t)));
      }
      return q.answer.length > 0 && q.answer.every((a, i) => chosen[i] === a);
    case "match":
    case "label":
    case "timeline":
      return q.answer.length > 0 && q.answer.every((a, i) => chosen[i] === a);
    case "order":
      return chosen.length === q.choices.length && chosen.every((c, i) => c === i);
    case "model":
      return !!q.target && manipCorrect(readSpec(q.model).model, q.target, chosen);
    case "code":
      return !!readStamp(chosen)?.pass;
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
    case "map":
      if (isMapFind(q)) {
        const base = mapBaseOf(q);
        const picks = picksOf(chosen);
        return q.targets!.map((t) => picks.some((p) => samePlace(base, p, t)));
      }
      return q.answer.map((a, i) => chosen[i] === a);
    case "match":
    case "label":
    case "timeline":
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
    case "map":
      if (isMapFind(q)) return q.targets!.join("; ");
      return q.answer.map((a, i) => `${i + 1}: ${q.choices[a]}`).join("; ");
    case "timeline":
      return q.answer.map((a, i) => `${q.slots?.[i] ?? i + 1}: ${q.choices[a]}`).join("; ");
    case "order":
      return q.dates?.length === q.choices.length ? q.choices.map((c, i) => `${c} (${q.dates![i]})`).join(" → ") : q.choices.join(" → ");
    case "model":
      return q.target ? targetText(readSpec(q.model).model, q.target) : "";
    case "code":
      return q.code?.solution?.trim() ?? "Code that passes every test";
    default:
      return q.answer.map((a) => q.choices[a]).join("; ");
  }
}

/** Plain-text description of a learner's answer. */
export function chosenText(q: Question, chosen: Chosen): string {
  if (!isAnswered(q, chosen)) return "";
  const kind = qtype(q);
  switch (kind) {
    case "text":
      return chosen.map((c) => String(c).trim() || "(blank)").join("; ");
    case "match":
      return (q.left ?? [])
        .map((l, i) => `${l} → ${typeof chosen[i] === "number" && (chosen[i] as number) >= 0 ? q.choices[chosen[i] as number] : "(none)"}`)
        .join("; ");
    case "label":
    case "timeline":
      return q.answer
        .map((_, i) => `${kind === "timeline" ? (q.slots?.[i] ?? i + 1) : i + 1}: ${typeof chosen[i] === "number" && (chosen[i] as number) >= 0 ? q.choices[chosen[i] as number] : "(none)"}`)
        .join("; ");
    case "map":
      if (isMapFind(q)) return picksOf(chosen).join("; ");
      return q.answer
        .map((_, i) => `${i + 1}: ${typeof chosen[i] === "number" && (chosen[i] as number) >= 0 ? q.choices[chosen[i] as number] : "(none)"}`)
        .join("; ");
    case "order":
      return chosen.map((c) => q.choices[c as number]).join(" → ");
    case "model": {
      const m = readSpec(q.model).model;
      return describe(m, stateOr(m, chosen), true);
    }
    case "code": {
      const s = readStamp(chosen);
      return s ? `Code that passed ${s.passed} of ${s.total} tests` : "Code (tests not run)";
    }
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
    case "map":
      return isMapFind(q) ? ((q.targets?.length ?? 0) > 1 ? "Find the places on the map" : "Find it on the map") : "Label the map";
    case "timeline":
      return "Place the events on the timeline";
    case "order":
      return q.dates?.length ? "Put in time order" : "Put in order";
    case "model":
      return actionLabel(readSpec(q.model).model.kind);
    case "code":
      return "Write code";
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
      let dates: string[] | undefined;
      if (q.dates !== undefined) {
        dates = Array.isArray(q.dates) ? q.dates.map((d) => String(d)) : [];
        if (dates.length !== choices.length) throw new Error(`needs one entry in "dates" per item.`);
        const bad = dates.find((d) => !parseSpan(d));
        if (bad !== undefined) throw new Error(`has a date that can't be read ("${bad}").`);
      }
      return { ...base, choices, answer: [], ...(dates ? { dates } : {}) };
    }
    case "map": {
      const map = typeof q.map === "string" ? q.map : "";
      if (!map.trim()) throw new Error(`(map) needs a "map" (the map in map block syntax, e.g. "base: us").`);
      const problem = parseMapSpec(map).problems[0];
      if (problem) throw new Error(`has a problem in its "map": ${problem}.`);
      const strs = (v: unknown) => (Array.isArray(v) ? v.map((x) => String(x).trim()).filter(Boolean) : []);
      const targets = strs(q.targets);
      const marks = strs(q.marks);
      if (targets.length && marks.length) throw new Error(`has both "targets" and "marks"; use one.`);
      if (targets.length) return { ...base, map, targets, choices: [], answer: [] };
      if (marks.length < 2) throw new Error(`(map) needs "targets" (places to find) or at least two "marks" (places to label).`);
      // Choices default to the marked names, in order.
      const ch = choices.length ? choices : marks;
      const answer = !choices.length && q.answer === undefined ? marks.map((_, i) => i) : indices(q.answer);
      if (answer.length !== marks.length || !answer.every((a) => Number.isInteger(a) && a >= 0 && a < ch.length)) throw new Error(`has an invalid "answer" (one choice index per mark).`);
      if (new Set(ch).size !== ch.length) throw new Error(`has the same choice twice.`);
      return { ...base, map, marks, choices: ch, answer };
    }
    case "timeline": {
      const slots = Array.isArray(q.slots) ? q.slots.map((s) => String(s).trim()) : [];
      if (slots.length < 2) throw new Error(`(timeline) needs at least two "slots" (dates).`);
      const bad = slots.find((s) => !parseSpan(s));
      if (bad !== undefined) throw new Error(`has a slot date that can't be read ("${bad}").`);
      if (choices.length < 2) throw new Error(`needs at least two "choices" (the events).`);
      const answer = indices(q.answer);
      if (answer.length !== slots.length || !answer.every(inRange)) throw new Error(`has an invalid "answer" (one choice index per slot).`);
      const timeline = typeof q.timeline === "string" && q.timeline.trim() ? q.timeline : undefined;
      if (timeline) {
        const problem = parseTimeline(timeline).problems.find((p) => !p.startsWith("no event"));
        if (problem) throw new Error(`has a problem in its "timeline": ${problem}.`);
      }
      return { ...base, slots, choices, answer, ...(timeline ? { timeline } : {}) };
    }
    case "model": {
      if (!isObj(q.model)) throw new Error(`(model) needs a "model": the manipulative, e.g. { "kind": "blocks" }.`);
      const { spec, model, problems } = readSpec(q.model);
      if (problems.length) throw new Error(`has a model problem: ${problems[0]}.`);
      const tp = targetProblems(model, q.target);
      if (tp.length) throw new Error(`has a target problem: ${tp[0]}.`);
      return { ...base, choices: [], answer: [], model: spec, target: q.target as Question["target"] };
    }
    case "code":
      return { ...base, choices: [], answer: [], code: normalizeCodeSpec(q.code) };
  }
}

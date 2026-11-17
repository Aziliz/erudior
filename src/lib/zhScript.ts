/**
 * Chinese script switch: courses are written in simplified characters and carry a compact
 * conversion table (`language.traditional`, made by the courses build from OpenCC s2tw plus the
 * course's hand-checked overrides). The app converts displayed text with it when the learner
 * picks Traditional. Text inside `{=…=}` is never converted (it talks about the simplified forms
 * themselves) and `{+…+}` is always shown converted (a character's traditional form beside it);
 * the markers are removed in both scripts.
 *
 * Conversion works on Han runs: maximal stretches of Han characters as the learner sees them,
 * so pinyin markup in between ({头|tóu}{发|fà}) doesn't split a word. In each run the longest
 * `phrases` entry wins, then `alone` (a run of one character), then `chars`.
 * The same algorithm is in the courses repo (content/languages/zh_script.py); the course checker
 * compares it with OpenCC for every text.
 */
import { HAN } from "./pinyin";

export interface ZhOverrides {
  /** A traditional form OpenCC gives, replaced everywhere first (臺 → 台). */
  forms?: Record<string, string>;
  /** In this word or phrase, wherever it appears (longest match first). */
  words?: Record<string, string>;
  /** This character when it stands alone (no Han character next to it). */
  alone?: Record<string, string>;
  /** This character everywhere a word entry doesn't cover it. */
  chars?: Record<string, string>;
}

export interface ZhTable {
  chars: Record<string, string>;
  phrases?: Record<string, string>;
  alone?: Record<string, string>;
  /** The course's overrides as written (for the checker; already folded into the table). */
  overrides?: ZhOverrides;
}

/** `{=…=}`: text that is never converted (shown simplified); `{+…+}`: always shown traditional. */
export const SCRIPT_RE = /\{=([\s\S]*?)=\}|\{\+([\s\S]*?)\+\}/g;
/** Pinyin ruby markup; its reading is skipped, its base belongs to the visible text. */
const RUBY_RE = /\{([^{}|\n]+)\|([^{}|\n]+)\}/g;

/** The characters of `s` the learner sees (pinyin readings skipped), with their offsets in `s`. */
export function visibleChars(s: string): { ch: string; at: number }[] {
  const skip: [number, number][] = [];
  for (const m of s.matchAll(RUBY_RE)) {
    if (HAN.test(m[2])) continue;
    const i = m.index!;
    skip.push([i, i + 1], [i + 1 + m[1].length, i + m[0].length]);
  }
  const out: { ch: string; at: number }[] = [];
  let k = 0;
  for (let i = 0; i < s.length; ) {
    const ch = String.fromCodePoint(s.codePointAt(i)!);
    while (k < skip.length && skip[k][1] <= i) k++;
    if (!(k < skip.length && skip[k][0] <= i && i < skip[k][1])) out.push({ ch, at: i });
    i += ch.length;
  }
  return out;
}

/** Split a string of visible characters into Han runs: [start, end) indices. */
export function hanRuns(chars: string[]): [number, number][] {
  const runs: [number, number][] = [];
  for (let i = 0; i < chars.length; ) {
    if (!HAN.test(chars[i])) {
      i++;
      continue;
    }
    let j = i;
    while (j < chars.length && HAN.test(chars[j])) j++;
    runs.push([i, j]);
    i = j;
  }
  return runs;
}

/** Convert one Han run (an array of characters) with the table; same length out. */
export function convertRun(run: string[], t: ZhTable, maxPhrase = phraseMax(t)): string[] {
  const out: string[] = [];
  for (let i = 0; i < run.length; ) {
    let hit: string | undefined;
    for (let n = Math.min(maxPhrase, run.length - i); n >= 2 && !hit; n--) {
      const p = t.phrases?.[run.slice(i, i + n).join("")];
      if (p) hit = p;
    }
    if (hit) {
      const cs = [...hit];
      out.push(...cs);
      i += cs.length;
      continue;
    }
    const c = run[i];
    out.push((run.length === 1 ? t.alone?.[c] : undefined) ?? t.chars[c] ?? c);
    i++;
  }
  return out;
}

const maxLens = new WeakMap<ZhTable, number>();
function phraseMax(t: ZhTable): number {
  let n = maxLens.get(t);
  if (n === undefined) {
    n = Math.max(0, ...Object.keys(t.phrases ?? {}).map((p) => [...p].length));
    maxLens.set(t, n);
  }
  return n;
}

/** Replace visible Han characters of a convertible segment with `convert`'s output per run. */
export function mapRuns(s: string, convert: (run: string[], start: number, visible: string[]) => string[]): string {
  if (!HAN.test(s)) return s;
  const vis = visibleChars(s);
  const chars = vis.map((v) => v.ch);
  const repl = new Map<number, string>();
  for (const [a, b] of hanRuns(chars)) {
    const conv = convert(chars.slice(a, b), a, chars);
    for (let i = a; i < b; i++) if (conv[i - a] !== chars[i]) repl.set(vis[i].at, conv[i - a]);
  }
  if (!repl.size) return s;
  let out = "";
  for (let i = 0; i < s.length; ) {
    const ch = String.fromCodePoint(s.codePointAt(i)!);
    out += repl.get(i) ?? ch;
    i += ch.length;
  }
  return out;
}

/**
 * Rebuild `text` without its script markers: `auto` maps the ordinary parts, `trad` the
 * `{+…+}` parts; `{=…=}` parts stay as written. Each part converts on its own.
 */
export function eachConvertible(text: string, auto: (s: string) => string, trad: (s: string) => string = auto): string {
  if (!text.includes("{=") && !text.includes("{+")) return auto(text);
  let out = "";
  let last = 0;
  for (const m of text.matchAll(SCRIPT_RE)) {
    out += auto(text.slice(last, m.index)) + (m[1] ?? trad(m[2]));
    last = m.index! + m[0].length;
  }
  return out + auto(text.slice(last));
}

const convertAll = (t: ZhTable) => {
  const max = phraseMax(t);
  return (s: string) => mapRuns(s, (run) => convertRun(run, t, max));
};

/** Course text as shown in Traditional (Taiwan forms), with the course's table. */
export function toTraditional(text: string, t: ZhTable): string {
  if (!HAN.test(text)) return toSimplified(text);
  const f = convertAll(t);
  return eachConvertible(text, f, f);
}

/** Course text as shown in Simplified: markers removed, `{+…+}` converted (with a table). */
export function toSimplified(text: string, t?: ZhTable): string {
  if (!text.includes("{=") && !text.includes("{+")) return text;
  return eachConvertible(text, (s) => s, t ? convertAll(t) : (s) => s);
}

/** `{=…=}` / `{+…+}` markers that don't pair up (nested or unclosed), for the checker. */
export function scriptMarkupProblem(text: string): string | undefined {
  const rest = text.replace(SCRIPT_RE, "");
  if (/\{[=+]|[=+]\}/.test(rest)) return "unbalanced {=…=} or {+…+} (they can't nest)";
}

/** Apply override words, `alone` and `chars` to one run; `base` gives the rest (OpenCC's output). */
export function overrideRun(run: string[], o: ZhOverrides, base: (i: number) => string): string[] {
  const words = Object.keys(o.words ?? {});
  const out: string[] = [];
  for (let i = 0; i < run.length; ) {
    const rest = run.slice(i).join("");
    const w = words.filter((x) => rest.startsWith(x)).sort((a, b) => [...b].length - [...a].length)[0];
    if (w) {
      const cs = [...o.words![w]];
      out.push(...cs);
      i += cs.length;
      continue;
    }
    const c = run[i];
    out.push((run.length === 1 ? o.alone?.[c] : undefined) ?? o.chars?.[c] ?? base(i));
    i++;
  }
  return out;
}

/**
 * What a text should read in Traditional: OpenCC s2tw (`s2tw`, run on each convertible part as
 * the learner sees it) with the course's overrides on top. Null when OpenCC changes the length.
 */
export function expectedTraditional(text: string, s2tw: (s: string) => string, o: ZhOverrides = {}, simplified = false): string | null {
  let bad = false;
  const f = (s: string) => {
    let conv: string[] | undefined;
    return mapRuns(s, (run, start, visible) => {
      if (!conv) {
        conv = [...s2tw(visible.join(""))].map((c) => o.forms?.[c] ?? c);
        if (conv.length !== visible.length) bad = true;
      }
      const cv = conv;
      return overrideRun(run, o, (i) => cv[start + i] ?? run[i]);
    });
  };
  const out = eachConvertible(text, simplified ? (s) => s : f, f);
  return bad ? null : out;
}

// --- Trace blocks follow the learner's script, even inside {=…=} --------------------------

const TRACE_RE = /^```trace([^\n]*)\n([\s\S]*?)^```/gm;
const TRACE_TRAD = /(^|\s)trad=(\S+)/;

/** A trace block's characters in Traditional: its `trad=` (character for character), else each on its own. */
export function traceTraditional(content: string, info: string, one: (c: string) => string): string {
  const given = info.match(TRACE_TRAD)?.[2];
  const forms = given ? [...given].filter((c) => HAN.test(c)) : undefined;
  let k = 0;
  return [...content].map((c) => (HAN.test(c) ? (forms ? (forms[k++] ?? c) : one(c)) : c)).join("");
}

/** Problem with a trace block's `trad=` (its Han characters must match the block's one for one). */
export function traceTradProblem(content: string, info: string): string | undefined {
  const given = info.match(TRACE_TRAD)?.[2];
  if (!given) return;
  const n = (s: string) => [...s].filter((c) => HAN.test(c)).length;
  if (n(given) !== n(content)) return `trace trad=${given}: give one traditional character for each of ${content.trim()}`;
}

/**
 * Apply `f` to text outside trace blocks; the blocks' characters are shown in Traditional
 * (`one` per character, or the block's `trad=`) when `traditional`, and `trad=` is dropped.
 */
export function withTraces(text: string, traditional: boolean, one: (c: string) => string, f: (s: string) => string): string {
  if (!text.includes("```trace")) return f(text);
  const blocks: string[] = [];
  const held = text.replace(TRACE_RE, (_w, info: string, content: string) => {
    const shown = traditional ? traceTraditional(content, info, one) : content;
    blocks.push("```trace" + info.replace(TRACE_TRAD, "$1").trimEnd() + "\n" + shown + "```");
    return `\uE000${blocks.length - 1}\uE001`;
  });
  return f(held).replace(/\uE000(\d+)\uE001/g, (_w, i: string) => blocks[Number(i)]);
}

/** One character as the table converts it standing alone. */
export const aloneTraditional = (t: ZhTable | undefined) => (c: string) => (t ? (t.alone?.[c] ?? t.chars[c] ?? c) : c);

// --- The course as the learner sees it in the chosen script -------------------------------

/** Keys whose text isn't converted: ids and keys the app matches on (same list as zh_script.py). */
export const SKIP_KEYS = new Set(["language", "trad", "id", "topic", "topics", "lesson", "module", "section", "refs", "drills", "quiz", "requires", "from", "audio"]);

/** Every string the script switch converts, with where it is (for the checker). */
export function* scriptTexts(node: unknown, where = "course"): Generator<[string, string]> {
  if (typeof node === "string") yield [where, node];
  else if (Array.isArray(node)) for (let i = 0; i < node.length; i++) yield* scriptTexts(node[i], `${where}[${i}]`);
  else if (node && typeof node === "object") {
    const o = node as Record<string, unknown>;
    const name = typeof o.id === "string" ? o.id : where;
    for (const [k, v] of Object.entries(o)) if (!SKIP_KEYS.has(k)) yield* scriptTexts(v, `${name}.${k}`);
  }
}

function mapStrings(node: unknown, f: (s: string) => string): unknown {
  if (typeof node === "string") return f(node);
  if (Array.isArray(node)) return node.map((x) => mapStrings(x, f));
  if (node && typeof node === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(node)) out[k] = SKIP_KEYS.has(k) ? v : mapStrings(v, f);
    return out;
  }
  return node;
}

const raws = new WeakMap<object, object>();
const others = new WeakMap<object, string[]>();
const cache = new WeakMap<object, Partial<Record<"simp" | "trad", object>>>();

/** The course as stored, for a course shown in a script (export, save). */
export const rawCourse = <T extends object>(c: T): T => (raws.get(c) as T | undefined) ?? c;

/** A vocab item's term and alternatives in the other script (accepted when typed). */
export const otherScriptForms = (item: object): string[] => others.get(item) ?? [];

interface ScriptableCourse {
  language?: { code: string; traditional?: ZhTable };
  vocab?: { term: string; trad?: string; alt?: string[] }[];
  decks?: { cards: { front: string; back: string; trad?: { front?: string; back?: string } }[] }[];
  banks: { questions: { accept?: string[][] }[] }[];
}

/**
 * A Chinese course in the learner's script: every displayed text converted (Traditional) or
 * with its `{=…=}` markers removed (Simplified). Typed answers count in either script: vocab
 * items remember the other script's forms, and `text` answers list them too. Other courses
 * come back unchanged. Cached per course object.
 */
export function scriptCourse<T extends object>(course: T, traditional: boolean): T {
  const c = course as unknown as ScriptableCourse;
  if (c.language?.code !== "zh") return course;
  const key = traditional ? "trad" : "simp";
  const hit = cache.get(course)?.[key];
  if (hit) return hit as T;
  const table = c.language.traditional;
  const toTrad = (s: string) => (table ? toTraditional(s, table) : toSimplified(s));
  const toSimp = (s: string) => toSimplified(s, table);
  const one = aloneTraditional(table);
  const show = (s: string) => withTraces(s, traditional, one, traditional ? toTrad : toSimp);
  const other = (s: string) => withTraces(s, !traditional, one, traditional ? toSimp : toTrad);
  const out = mapStrings(course, show) as ScriptableCourse;
  // A card with its own `trad` shows it in Traditional, and isn't converted.
  out.decks?.forEach((d, di) =>
    d.cards.forEach((card, ki) => {
      const src = c.decks![di].cards[ki];
      if (!traditional || !src.trad) return;
      card.front = toSimplified(src.trad.front ?? src.front);
      card.back = toSimplified(src.trad.back ?? src.back);
    }),
  );
  out.vocab = c.vocab?.map((v, i) => {
    const d = { ...out.vocab![i], term: traditional ? (v.trad ?? show(v.term)) : show(v.term) };
    const forms = [traditional ? toSimp(v.term) : (v.trad ?? other(v.term)), ...(v.alt ?? []).map(other)];
    others.set(d, [...new Set(forms)].filter((x) => x !== d.term));
    return d;
  });
  if (!out.vocab) delete out.vocab;
  out.banks.forEach((b, bi) =>
    b.questions.forEach((q, qi) => {
      const src = c.banks[bi].questions[qi].accept;
      if (q.accept && src) q.accept = q.accept.map((list, li) => [...new Set([...list, ...src[li].map(other)])]);
    }),
  );
  raws.set(out, rawCourse(course));
  cache.set(course, { ...cache.get(course), [key]: out });
  return out as unknown as T;
}

// --- Checker: the runtime conversion against OpenCC + overrides ---------------------------

/**
 * Problems with a Chinese course's script switch: markup that doesn't pair up, trace `trad=`
 * of the wrong length, a missing table, and every text whose runtime conversion (in either
 * script) differs from OpenCC s2tw plus the course's overrides. `s2tw` is OpenCC's converter.
 */
export function scriptProblems(course: object, s2tw: (s: string) => string): string[] {
  const c = course as ScriptableCourse;
  if (c.language?.code !== "zh") return [];
  const t = c.language.traditional;
  const out: string[] = [];
  if (!t) return ["language.traditional is missing (the courses build makes it): the script switch won't convert"];
  const o = t.overrides ?? {};
  const one = aloneTraditional(t);
  const exp = (s: string, simp = false) => expectedTraditional(s, s2tw, o, simp);
  for (const [where, text] of scriptTexts(course)) {
    const bad = scriptMarkupProblem(text);
    if (bad) out.push(`${where}: ${bad}`);
    for (const m of text.matchAll(TRACE_RE)) {
      const p = traceTradProblem(m[2], m[1]);
      if (p) out.push(`${where}: ${p}`);
    }
    if (!HAN.test(text) || bad) continue;
    let lost = false;
    const e = (s: string, simp = false) => exp(s, simp) ?? ((lost = true), s);
    const wantT = withTraces(text, true, (ch) => e(ch), (s) => e(s));
    const wantS = withTraces(text, false, (ch) => e(ch), (s) => e(s, true));
    if (lost) out.push(`${where}: OpenCC changes the length of this text`);
    const gotT = withTraces(text, true, one, (s) => toTraditional(s, t));
    const gotS = withTraces(text, false, one, (s) => toSimplified(s, t));
    if (gotT !== wantT) out.push(`${where}: Traditional shows ${diffAt(gotT, wantT)}`);
    if (gotS !== wantS) out.push(`${where}: Simplified shows ${diffAt(gotS, wantS)}`);
  }
  return out;
}

function diffAt(got: string, want: string): string {
  const g = [...got], w = [...want];
  let i = 0;
  while (i < g.length && g[i] === w[i]) i++;
  const a = Math.max(0, i - 6);
  return `"${g.slice(a, i + 6).join("")}" where OpenCC + overrides give "${w.slice(a, i + 6).join("")}"`;
}

// --- Import: keep only well-formed tables ------------------------------------------------

const strMap = (v: unknown, one: boolean): Record<string, string> | undefined => {
  if (!v || typeof v !== "object" || Array.isArray(v)) return undefined;
  const out: Record<string, string> = {};
  for (const [k, x] of Object.entries(v)) {
    if (typeof x !== "string" || !HAN.test(k) || [...k].length !== [...x].length || (one && [...k].length !== 1)) continue;
    out[k] = x;
  }
  return Object.keys(out).length ? out : undefined;
};

/** A course file's `language.traditional`, with malformed entries dropped. */
export function normalizeZhTable(v: unknown): ZhTable | undefined {
  if (!v || typeof v !== "object") return undefined;
  const r = v as Record<string, unknown>;
  const chars = strMap(r.chars, true) ?? {};
  const phrases = strMap(r.phrases, false);
  const alone = strMap(r.alone, true);
  const o = r.overrides && typeof r.overrides === "object" ? (r.overrides as Record<string, unknown>) : undefined;
  const overrides: ZhOverrides = {};
  if (o)
    for (const k of ["forms", "words", "alone", "chars"] as const) {
      const m = strMap(o[k], k !== "words");
      if (m) overrides[k] = m;
    }
  return { chars, ...(phrases ? { phrases } : {}), ...(alone ? { alone } : {}), ...(Object.keys(overrides).length ? { overrides } : {}) };
}

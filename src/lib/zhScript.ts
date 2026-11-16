/**
 * Chinese script switch: courses are written in simplified characters and carry a compact
 * conversion table (`language.traditional`, made by the courses build from OpenCC s2tw plus the
 * course's hand-checked overrides). The app converts displayed text with it when the learner
 * picks Traditional. Text inside `{=…=}` is never converted (it talks about the simplified forms
 * themselves); the markers are removed in both scripts.
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

/** `{=…=}`: text that is never converted. */
export const NO_CONVERT_RE = /\{=([\s\S]*?)=\}/g;
/** Pinyin ruby markup; its reading is skipped, its base belongs to the visible text. */
const RUBY_RE = /\{([^{}|\n]+)\|([^{}|\n]+)\}/g;

export const stripNoConvert = (text: string) => (text.includes("{=") ? text.replace(NO_CONVERT_RE, "$1") : text);

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

/** Apply `f` to the convertible parts of `text` (outside `{=…=}`), dropping the markers. */
export function eachConvertible(text: string, f: (s: string) => string): string {
  let out = "";
  let last = 0;
  for (const m of text.matchAll(NO_CONVERT_RE)) {
    out += f(text.slice(last, m.index)) + m[1];
    last = m.index! + m[0].length;
  }
  return out + f(text.slice(last));
}

/** Simplified course text → Traditional (Taiwan forms) with the course's table. */
export function toTraditional(text: string, t: ZhTable): string {
  if (!HAN.test(text)) return text;
  const max = phraseMax(t);
  return eachConvertible(text, (s) => mapRuns(s, (run) => convertRun(run, t, max)));
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
export function expectedTraditional(text: string, s2tw: (s: string) => string, o: ZhOverrides = {}): string | null {
  let bad = false;
  const out = eachConvertible(text, (s) => {
    let conv: string[] | undefined;
    return mapRuns(s, (run, start, visible) => {
      if (!conv) {
        conv = [...s2tw(visible.join(""))].map((c) => o.forms?.[c] ?? c);
        if (conv.length !== visible.length) bad = true;
      }
      const cv = conv;
      return overrideRun(run, o, (i) => cv[start + i] ?? run[i]);
    });
  });
  return bad ? null : out;
}

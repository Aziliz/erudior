// Sentence-builder questions (type "build"): the learner puts word tiles in order to make a
// sentence. Pure helpers shared by grading (questions.ts), the answer UI, the bank editor,
// the canonical validator and the course checker.
//
// The saved answer (`Chosen`) is the list of placed tiles as indices into the pool
// (`tiles` followed by `distractors`), in sentence order. Grading compares the placed tiles'
// text, so tiles with the same text are interchangeable.

import { hasJapanese, stripRuby } from "./kana";

export interface BuildFields {
  id?: string;
  tiles?: string[];
  distractors?: string[];
  accept?: string[][];
  joiner?: string;
  punctuation?: string;
}

export const BUILD_LIMITS = { tiles: 30, distractors: 20, accept: 20, tile: 200, punctuation: 4, prompt: 2000 };

/** Languages written without spaces between words: tiles join with "" by default. */
const NO_SPACE = new Set(["ja", "zh", "yue", "th", "lo", "km", "my", "bo"]);

/** Every tile the learner can pick: the sentence's tiles, then the distractors. */
export const buildPool = (q: BuildFields): string[] => [...(q.tiles ?? []), ...(q.distractors ?? [])];

/** Tile text for comparing: furigana dropped, widths folded, spacing tidied. */
export const tileKey = (s: string): string => stripRuby(String(s)).normalize("NFKC").replace(/\s+/g, " ").trim();

/**
 * A sentence starts with a capital, wherever its first tile came from: "bis Ende Mai" placed
 * first reads "Bis Ende Mai". Authors write tiles in their mid-sentence case (nouns and names
 * keep their capital), so sentences that start with a different phrase can be accepted.
 * Leading quote marks are skipped; text without cased letters (Japanese) is unchanged.
 */
export function startCase(s: string): string {
  const m = /^([„“"'‚‘«»(\[¿¡\s]*)(\p{Ll})/u.exec(s);
  return m ? m[1] + m[2].toLocaleUpperCase() + s.slice(m[0].length) : s;
}

/** Comparison keys for a tile sequence: like `tileKey`, with the first tile sentence-cased. */
const seqKeys = (tiles: readonly string[]): string[] => tiles.map((t, i) => (i === 0 ? startCase(tileKey(t)) : tileKey(t)));

/** Tile text for showing as plain text (reports, screen readers): furigana dropped. */
export const tilePlain = (s: string): string => stripRuby(String(s)).trim();

/** Every correct sentence as a tile list: `tiles` first, then the `accept` alternatives. */
export const buildAnswers = (q: BuildFields): string[][] => [q.tiles ?? [], ...(q.accept ?? [])];

/**
 * What goes between tiles: the question's `joiner`, else "" for languages written without
 * spaces (the course language, or Japanese/Chinese text in the tiles), else one space.
 */
export function buildJoiner(q: BuildFields, lang?: string): string {
  if (typeof q.joiner === "string") return q.joiner;
  const base = lang?.toLowerCase().split(/[-_]/)[0];
  if (base && NO_SPACE.has(base)) return "";
  return (q.tiles ?? []).some((t) => hasJapanese(t)) ? "" : " ";
}

/** The placed tiles: valid pool indices, each used once, in sentence order. */
export function placedTiles(q: BuildFields, chosen: readonly unknown[] | undefined): number[] {
  const n = buildPool(q).length;
  const seen = new Set<number>();
  const out: number[] = [];
  for (const c of chosen ?? []) {
    if (typeof c !== "number" || !Number.isInteger(c) || c < 0 || c >= n || seen.has(c)) continue;
    seen.add(c);
    out.push(c);
  }
  return out;
}

const sameKeys = (a: string[], b: string[]) => a.length === b.length && a.every((x, i) => x === b[i]);

/** True when the placed tiles spell one of the correct sentences (all or nothing). */
export function buildCorrect(q: BuildFields, chosen: readonly unknown[] | undefined): boolean {
  const pool = buildPool(q);
  const got = seqKeys(placedTiles(q, chosen).map((i) => pool[i]));
  return got.length > 0 && buildAnswers(q).some((a) => a.length > 0 && sameKeys(got, seqKeys(a)));
}

/** The correct sentence closest to the learner's (most tiles in the right place; first on a tie). */
export function closestAnswer(q: BuildFields, chosen: readonly unknown[] | undefined): string[] {
  const pool = buildPool(q);
  const got = seqKeys(placedTiles(q, chosen).map((i) => pool[i]));
  let best = q.tiles ?? [];
  let score = -1;
  for (const a of buildAnswers(q)) {
    const keys = seqKeys(a);
    if (sameKeys(got, keys)) return a;
    const s = keys.reduce((n, k, i) => n + (got[i] === k ? 1 : 0), 0) - Math.abs(keys.length - got.length) / 100;
    if (s > score) {
      score = s;
      best = a;
    }
  }
  return best;
}

/**
 * Right or wrong for each position of the closest correct sentence (a missing tile is wrong).
 * Placed tiles past the end of that sentence are extra, and wrong: see `extraPlaced`.
 */
export function buildParts(q: BuildFields, chosen: readonly unknown[]): boolean[] {
  const pool = buildPool(q);
  const got = seqKeys(placedTiles(q, chosen).map((i) => pool[i]));
  const want = seqKeys(closestAnswer(q, chosen));
  return want.map((k, i) => got[i] === k);
}

/** The sentence as plain text, with the joiner and the final punctuation. */
export function sentenceText(q: BuildFields, tiles: string[], lang?: string): string {
  const s = startCase(tiles.map(tilePlain).join(buildJoiner(q, lang)));
  return tiles.length ? s + (q.punctuation ?? "") : s;
}

// --- The bank's starting order ---------------------------------------------------------------

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rng(seed: number) {
  let a = seed || 1;
  return () => {
    // mulberry32
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Does `keys` contain `answer` in order (other tiles may come between)? */
function readsInOrder(keys: string[], answer: string[]): boolean {
  let j = 0;
  for (const k of keys) if (j < answer.length && k === answer[j]) j++;
  return j === answer.length;
}

/** True when the tiles in this bank order read as a correct sentence (skipping other tiles). */
export function readsAsAnswer(q: BuildFields, order: number[]): boolean {
  const keys = buildPool(q).map(tileKey);
  const seq = order.map((i) => keys[i]);
  return buildAnswers(q).some((a) => a.length > 0 && readsInOrder(seq, a.map(tileKey)));
}

/**
 * The order tiles start in the bank: a shuffle that depends only on the question (and an
 * optional seed such as the session id), so it is the same after resuming. It never reads
 * as a correct sentence from left to right, even skipping distractors, when that's possible.
 */
export function bankOrder(q: BuildFields, seed = ""): number[] {
  const pool = buildPool(q);
  const ok = (o: number[]) => !readsAsAnswer(q, o);
  const idx = pool.map((_, i) => i);
  for (let attempt = 0; attempt < 40; attempt++) {
    const r = rng(hash(`${seed}|${q.id ?? ""}|${attempt}`));
    const o = idx.slice();
    for (let i = o.length - 1; i > 0; i--) {
      const j = Math.floor(r() * (i + 1));
      [o[i], o[j]] = [o[j], o[i]];
    }
    if (ok(o)) return o;
  }
  const rev = idx.slice().reverse();
  return ok(rev) ? rev : idx.length > 1 ? [...idx.slice(1), idx[0]] : idx;
}

// --- Validation -------------------------------------------------------------------------------

/** Pool indices that spell `answer` (each pool tile used once), or null if it can't be built. */
export function indicesFor(q: BuildFields, answer: string[]): number[] | null {
  const keys = buildPool(q).map(tileKey);
  const used = new Set<number>();
  const out: number[] = [];
  for (const t of answer) {
    const k = tileKey(t);
    const i = keys.findIndex((x, j) => x === k && !used.has(j));
    if (i < 0) return null;
    used.add(i);
    out.push(i);
  }
  return out;
}

const strList = (v: unknown): string[] | null => (Array.isArray(v) && v.every((x) => typeof x === "string" || typeof x === "number") ? v.map((x) => String(x).trim()) : null);

/**
 * Check and tidy a build question's fields from a file. Throws an Error with a readable
 * message (it follows "Question N ") for anything that makes the question unanswerable.
 */
export function normalizeBuild(q: Record<string, unknown>): Required<Pick<BuildFields, "tiles">> & BuildFields & { prompt?: string } {
  const tiles = strList(q.tiles);
  if (!tiles || tiles.length < 2) throw new Error(`(build) needs "tiles": at least two word tiles, in the correct order.`);
  if (tiles.length > BUILD_LIMITS.tiles) throw new Error(`has more than ${BUILD_LIMITS.tiles} "tiles".`);
  if (tiles.some((t) => !tileKey(t))) throw new Error(`has an empty tile.`);
  if (tiles.some((t) => t.length > BUILD_LIMITS.tile)) throw new Error(`has a tile over ${BUILD_LIMITS.tile} characters.`);
  if (new Set(tiles.map(tileKey)).size < 2) throw new Error(`needs at least two different tiles (otherwise every order is right).`);
  let distractors: string[] | undefined;
  if (q.distractors !== undefined) {
    distractors = strList(q.distractors) ?? undefined;
    if (!distractors) throw new Error(`has "distractors" that aren't a list of tiles.`);
    if (distractors.length > BUILD_LIMITS.distractors) throw new Error(`has more than ${BUILD_LIMITS.distractors} "distractors".`);
    if (distractors.some((t) => !tileKey(t) || t.length > BUILD_LIMITS.tile)) throw new Error(`has an empty or overlong distractor.`);
    if (!distractors.length) distractors = undefined;
  }
  let accept: string[][] | undefined;
  if (q.accept !== undefined) {
    if (!Array.isArray(q.accept) || q.accept.length > BUILD_LIMITS.accept) throw new Error(`has "accept" that isn't a list of other correct orders (each a list of tiles).`);
    accept = q.accept.map((a, i) => {
      const list = strList(a);
      if (!list || list.length < 2) throw new Error(`has "accept" entry ${i + 1} that isn't a list of at least two tiles.`);
      if (!indicesFor({ tiles, distractors }, list)) throw new Error(`has "accept" entry ${i + 1} that uses a tile not in "tiles" or "distractors" (or uses one too often).`);
      return list;
    });
    if (!accept.length) accept = undefined;
  }
  let joiner: string | undefined;
  if (q.joiner !== undefined) {
    if (q.joiner !== "" && q.joiner !== " ") throw new Error(`has a "joiner" that isn't "" (no spaces, e.g. Japanese) or " " (one space).`);
    joiner = q.joiner;
  }
  let punctuation: string | undefined;
  if (q.punctuation !== undefined) {
    if (typeof q.punctuation !== "string" || q.punctuation.length > BUILD_LIMITS.punctuation || /\s/.test(q.punctuation))
      throw new Error(`has a "punctuation" that isn't a short mark like "." or "。".`);
    punctuation = q.punctuation || undefined;
  }
  let prompt: string | undefined;
  if (q.prompt !== undefined) {
    if (typeof q.prompt !== "string" || q.prompt.length > BUILD_LIMITS.prompt) throw new Error(`has a "prompt" that isn't text.`);
    prompt = q.prompt.trim() || undefined;
  }
  return {
    tiles,
    ...(distractors ? { distractors } : {}),
    ...(accept ? { accept } : {}),
    ...(joiner !== undefined ? { joiner } : {}),
    ...(punctuation ? { punctuation } : {}),
    ...(prompt ? { prompt } : {}),
  };
}

/** Authoring problems that don't stop the question working (course checker, bank editor). */
export function buildWarnings(q: BuildFields): string[] {
  const out: string[] = [];
  const answers = buildAnswers(q);
  const seq = answers.map((a) => a.map(tileKey).join("\u0000"));
  seq.forEach((s, i) => {
    const first = seq.indexOf(s);
    if (i > 0 && first < i) out.push(first === 0 ? `"accept" entry ${i} is the same as "tiles"` : `"accept" entry ${i} repeats "accept" entry ${first}`);
  });
  const tileKeys = new Set((q.tiles ?? []).map(tileKey));
  for (const d of q.distractors ?? []) if (tileKeys.has(tileKey(d))) out.push(`distractor "${tilePlain(d)}" is also a tile, so it is interchangeable with it and not a distractor`);
  if (q.punctuation && (q.tiles ?? []).some((t) => t.trim().endsWith(q.punctuation!))) out.push(`a tile ends with the "punctuation" mark ("${q.punctuation}"), which is added after the sentence`);
  return out;
}

// The built-in reader: a course's library of texts (novels, poems, plays, primary sources),
// read one section at a time. This module is the pure part: reading the `texts` field of a
// course file, footnotes, line-numbered verse, the student's place and reading time, and the
// authoring checks. The screen is pages/Reader.tsx.
//
// Texts live inside the course file, like lessons, so a course stays one signed, offline file.
// Only the open section is rendered, so a long book costs memory but not rendering time. A very
// large library belongs in a course of its own (a course is already the unit of download).

import type { GlossaryEntry, Progress, ReaderSection, ReaderText, ReadingState } from "./types";
import { today } from "./srs";
import { validateReaderTexts, normalizeValidatedReaderTexts } from "./readerContent";
export { validateReaderTexts, normalizeValidatedReaderTexts, readerRevisionProblems, READER_LIMITS } from "./readerContent";

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const str = (v: unknown) => (typeof v === "string" ? v : "");
const arr = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const ID = /^[A-Za-z0-9_-]{1,100}$/;
const KINDS = ["prose", "poem", "play", "document"] as const;

/** Read the `texts` field of a course file. Texts without sections are dropped. */
export function normalizeTexts(raw: unknown): ReaderText[] {
  // Valid canonical data is lossless. Legacy recovery remains for old local data;
  // public import/publication boundaries must call the strict raw validator first.
  if (!validateReaderTexts(raw, { strict: false }).length) return normalizeValidatedReaderTexts(raw, { strict: false });
  if (!validateReaderTexts(raw, { strict: false, legacy: true }).length) return normalizeValidatedReaderTexts(raw, { strict: false, legacy: true });
  const seen = new Set<string>();
  return arr(raw)
    .filter(isObj)
    .map((t, i): ReaderText => {
      const secIds = new Set<string>();
      const sections = arr(t.sections)
        .filter(isObj)
        .map((s, j): ReaderSection => {
          let id = ID.test(str(s.id)) ? str(s.id) : `s${j + 1}`;
          if (secIds.has(id)) id = `${id}-${j + 1}`;
          secIds.add(id);
          const questions = arr(s.questions).map(String).filter(Boolean);
          return { id, title: str(s.title).trim() || `Part ${j + 1}`, body: str(s.body), ...(questions.length ? { questions } : {}) };
        })
        .filter((s) => s.body.trim());
      const kind = KINDS.find((k) => k === t.kind);
      const glossary: GlossaryEntry[] = arr(t.glossary)
        .filter(isObj)
        .map((g) => ({ term: str(g.term).trim(), definition: str(g.definition).trim(), aliases: arr(g.aliases).map(String).filter(Boolean) }))
        .filter((g) => g.term && g.definition);
      const ln = Number(t.lineNumbers);
      return {
        id: ID.test(str(t.id)) ? str(t.id) : `t${i + 1}`,
        title: str(t.title).trim() || `Text ${i + 1}`,
        ...(str(t.author).trim() ? { author: str(t.author).trim() } : {}),
        ...(str(t.date).trim() ? { date: str(t.date).trim() } : {}),
        ...(kind && kind !== "prose" ? { kind } : {}),
        ...(/^[A-Za-z]{2,3}([-_][A-Za-z0-9]{2,8})*$/.test(str(t.lang)) ? { lang: str(t.lang) } : {}),
        ...(str(t.subject).trim() ? { subject: str(t.subject).trim() } : {}),
        ...(str(t.about).trim() ? { about: str(t.about).trim() } : {}),
        ...(str(t.source).trim() ? { source: str(t.source).trim() } : {}),
        ...(t.lineNumbers !== undefined && Number.isInteger(ln) && ln >= 0 ? { lineNumbers: ln } : {}),
        ...(glossary.length ? { glossary } : {}),
        sections,
      };
    })
    .filter((t) => t.sections.length && !seen.has(t.id) && !!seen.add(t.id));
}

export const isVerse = (t: Pick<ReaderText, "kind">) => t.kind === "poem" || t.kind === "play";

// ---------- footnotes ----------

const NOTE_DEF = /^\[\^([A-Za-z0-9_-]{1,20})\]:[ \t]?(.*)$/;
const NOTE_REF = /\[\^([A-Za-z0-9_-]{1,20})\]/g;

/**
 * Pull `[^id]: note` lines out of a section and turn each `[^id]` into a numbered note button
 * (raw HTML, which the Markdown pipeline keeps). A definition continues on indented lines.
 * Returns the text and the notes in the order they're first referred to.
 */
export function footnotes(body: string): { text: string; notes: { id: string; n: number; text: string }[] } {
  if (!body.includes("[^")) return { text: body, notes: [] };
  const defs = new Map<string, string>();
  const keep: string[] = [];
  let cur: string | null = null;
  for (const line of body.replace(/\r\n?/g, "\n").split("\n")) {
    const m = NOTE_DEF.exec(line);
    if (m) {
      cur = m[1];
      defs.set(cur, m[2]);
    } else if (cur && /^( {2,}|\t)\S/.test(line)) defs.set(cur, `${defs.get(cur)} ${line.trim()}`);
    else {
      cur = null;
      keep.push(line);
    }
  }
  const order: string[] = [];
  const text = keep.join("\n").replace(NOTE_REF, (whole, id: string) => {
    if (!defs.has(id)) return whole;
    if (!order.includes(id)) order.push(id);
    const n = order.indexOf(id) + 1;
    return `<sup class="fn"><button type="button" class="fn-ref" data-fn="${id}" aria-label="Note ${n}">${n}</button></sup>`;
  });
  return { text, notes: order.map((id, i) => ({ id, n: i + 1, text: defs.get(id)!.trim() })) };
}

// ---------- poems and plays ----------

export interface VerseLine {
  kind: "line" | "speaker" | "stage" | "heading" | "gap";
  text: string;
  /** Line number in the section (counted lines only: not speakers, stage directions or headings). */
  n?: number;
}

/**
 * Split a poem or play into lines. A blank line separates stanzas (or speeches). In plays, a
 * line in capitals ending in a period ("HAMLET.") is a speaker and a line wrapped in *…* or
 * [ … ] is a stage direction; neither is counted, as in printed editions. `#` lines are headings.
 */
export function verseLines(body: string, kind: ReaderText["kind"]): VerseLine[] {
  const out: VerseLine[] = [];
  let n = 0;
  for (const raw of body.replace(/\r\n?/g, "\n").split("\n")) {
    const line = raw.replace(/\s+$/, "");
    if (!line.trim()) {
      if (out.length && out[out.length - 1].kind !== "gap") out.push({ kind: "gap", text: "" });
      continue;
    }
    if (/^#{1,4}\s/.test(line)) out.push({ kind: "heading", text: line.replace(/^#+\s*/, "") });
    else if (kind === "play" && /^[\p{Lu}][\p{Lu}\s.'’-]*\.$/u.test(line.trim()) && line.trim().length <= 40)
      out.push({ kind: "speaker", text: line.trim().replace(/\.$/, "") });
    else if (kind === "play" && (/^\s*\*[^*].*\*\s*$/.test(line) || /^\s*\[.*\]\s*$/.test(line)))
      out.push({ kind: "stage", text: line.trim().replace(/^\*(.*)\*$/, "$1").replace(/^\[(.*)\]$/, "$1") });
    else out.push({ kind: "line", text: line.replace(/^\s+/, (s) => " ".repeat(s.replace(/\t/g, "  ").length)), n: ++n });
  }
  while (out.length && out[out.length - 1].kind === "gap") out.pop();
  return out;
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/**
 * Verse as HTML. `inline` renders one line's Markdown (sanitized, no <p> wrapper). Every block
 * gets `data-b` (its index), which the reader uses to remember the place and for read-aloud.
 * Line numbers are hidden from screen readers (they'd be read before every fifth line).
 */
export function renderVerse(lines: VerseLine[], every: number, inline: (md: string) => string): string {
  let html = `<div class="verse">`;
  let open = false;
  let b = 0;
  const stanza = () => {
    if (!open) html += `<div class="stanza">`;
    open = true;
  };
  const close = () => {
    if (open) html += `</div>`;
    open = false;
  };
  for (const l of lines) {
    if (l.kind === "gap") close();
    else if (l.kind === "heading") {
      close();
      html += `<h3 class="verse-head" data-b="${b++}">${inline(l.text)}</h3>`;
    } else if (l.kind === "speaker") {
      close();
      html += `<p class="speaker" data-b="${b++}">${escapeHtml(l.text)}</p>`;
    } else if (l.kind === "stage") {
      stanza();
      html += `<p class="stage" data-b="${b++}"><em>${inline(l.text)}</em></p>`;
    } else {
      stanza();
      const num = every > 0 && l.n! % every === 0 ? `<span class="ln" aria-hidden="true">${l.n}</span>` : "";
      html += `<p class="vl" data-b="${b++}" data-n="${l.n}">${num}<span class="vt">${inline(l.text)}</span></p>`;
    }
  }
  close();
  return html + `</div>`;
}

// ---------- the student's place and time ----------

export const readingKey = (courseId: string, textId: string) => `${courseId}/${textId}`;

export function readingState(p: Progress, courseId: string, text: ReaderText): ReadingState {
  return p.reading?.[readingKey(courseId, text.id)] ?? { section: text.sections[0].id, at: 0, seconds: 0, read: {}, last: today() };
}

function put(p: Progress, key: string, s: ReadingState): Progress {
  return { ...p, reading: { ...(p.reading ?? {}), [key]: s } };
}

/** Remember the open section and the block at the top of the screen. */
export function savePlace(p: Progress, courseId: string, text: ReaderText, section: string, at: number, day = today()): Progress {
  const s = readingState(p, courseId, text);
  if (s.section === section && s.at === at && s.last === day) return p;
  return put(p, readingKey(courseId, text.id), { ...s, section, at, last: day });
}

/** Add reading time to the text and to the day's activity (streaks, the Progress page). */
export function addReadingTime(p: Progress, courseId: string, text: ReaderText, seconds: number, day = today()): Progress {
  if (seconds < 1) return p;
  const s = readingState(p, courseId, text);
  const next = put(p, readingKey(courseId, text.id), { ...s, seconds: Math.round(s.seconds + seconds), last: day });
  const act = next.activity[day] ?? { questions: 0, cards: 0, lessons: 0, drills: 0 };
  return { ...next, activity: { ...next.activity, [day]: { ...act, readingSec: Math.round((act.readingSec ?? 0) + seconds) } } };
}

/** Mark a section read; the text is finished the first day every section has been read. */
export function markSectionRead(p: Progress, courseId: string, text: ReaderText, section: string, day = today()): Progress {
  const s = readingState(p, courseId, text);
  const read = { ...s.read, [section]: s.read[section] ?? day };
  const finished = s.finished ?? (text.sections.every((x) => read[x.id]) ? day : undefined);
  return put(p, readingKey(courseId, text.id), { ...s, read, ...(finished ? { finished } : {}), last: day });
}

export function sectionsRead(p: Progress, courseId: string, text: ReaderText): number {
  const s = p.reading?.[readingKey(courseId, text.id)];
  return s ? text.sections.filter((x) => s.read[x.id]).length : 0;
}

/** "1 h 5 min", "12 min", "less than a minute". */
export function readingTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  if (m < 1) return "less than a minute";
  const h = Math.floor(m / 60);
  return h ? `${h} h${m % 60 ? ` ${m % 60} min` : ""}` : `${m} min`;
}

/** Subject for the homeschool reading log. */
export const readingSubject = (text: ReaderText, courseLanguage?: string) =>
  text.subject ?? (courseLanguage ? "World languages" : "English language arts");

// ---------- authoring checks ----------

/** Problems with a course's texts, for tests/check-course.mts. `qids`: question ids in the first bank. */
export function textProblems(texts: ReaderText[], qids: Set<string>, rawTexts?: unknown): string[] {
  const out: string[] = [];
  const raw = arr(rawTexts).filter(isObj);
  raw.forEach((t, i) => {
    const where = `text ${str(t.id) || i + 1}`;
    if (!ID.test(str(t.id))) out.push(`${where}: needs an "id" (letters, numbers, - and _)`);
    if (!str(t.title).trim()) out.push(`${where}: needs a "title"`);
    if (t.kind !== undefined && !KINDS.includes(t.kind as (typeof KINDS)[number])) out.push(`${where}: unknown kind "${String(t.kind)}" (prose, poem, play or document)`);
    if (!arr(t.sections).length) out.push(`${where}: has no sections`);
    const ids = arr(t.sections).filter(isObj).map((s) => str(s.id));
    ids.forEach((id, j) => {
      if (!ID.test(id)) out.push(`${where}: section ${j + 1} needs an "id"`);
      else if (ids.indexOf(id) !== j) out.push(`${where}: section id "${id}" is used twice`);
    });
    arr(t.sections)
      .filter(isObj)
      .forEach((s, j) => {
        if (!str(s.body).trim()) out.push(`${where}: section ${str(s.id) || j + 1} is empty`);
        if (!str(s.title).trim()) out.push(`${where}: section ${str(s.id) || j + 1} needs a "title"`);
      });
  });
  const ids = raw.map((t) => str(t.id));
  ids.forEach((id, i) => id && ids.indexOf(id) !== i && out.push(`text ${id}: the id is used twice`));
  for (const t of texts)
    for (const s of t.sections) {
      const where = `text ${t.id} section ${s.id}`;
      s.questions?.forEach((q) => qids.has(q) || out.push(`${where}: reading question ${q} missing`));
      const defs = new Set([...s.body.matchAll(/^\[\^([A-Za-z0-9_-]{1,20})\]:/gm)].map((m) => m[1]));
      const refs = new Set([...s.body.replace(/^\[\^[^\]]*\]:/gm, "").matchAll(NOTE_REF)].map((m) => m[1]));
      for (const r of refs) if (!defs.has(r)) out.push(`${where}: footnote [^${r}] has no "[^${r}]: …" line`);
      for (const d of defs) if (!refs.has(d)) out.push(`${where}: footnote ${d} is never referred to`);
    }
  return out;
}

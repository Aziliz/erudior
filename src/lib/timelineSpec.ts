// Timelines: dates (BCE/CE, months and days, centuries, "million years ago"), the ```timeline
// lesson block, and its layout.
//
//   ```timeline
//   title: Ancient Rome
//   era: 753–509 BCE | Kingdom
//   era: 509–27 BCE | Republic
//   event: 44 BCE | Julius Caesar is killed | Politics
//   event: 27 BCE – 14 CE | Augustus rules | Politics
//   ```
//
// The static HTML is an ordered list of periods and one of events, oldest first: it reads
// as a list without JavaScript, in print, on narrow screens and to screen readers.
// `hydrateTimelines` turns wide enough ones into a horizontal, zoomable, scrollable timeline
// (positions come from data attributes; labels are stacked into lanes after measuring them).

import { readFields } from "./blockUtil";

export interface TDate {
  /** Astronomical year with a fraction for month/day (1 BCE = 0, 44 BCE = -43). */
  y: number;
  /** Fuzzy dates ("c. 3000 BCE"). */
  approx?: boolean;
}

export interface TSpan {
  a: TDate;
  /** The end of a range ("1861–1865", a century). */
  b?: TDate;
}

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
const monthOf = (s: string) => MONTHS.indexOf(s.slice(0, 3).toLowerCase());
const ERA = /\s*(BCE|BC|CE|AD|B\.C\.E\.|B\.C\.|C\.E\.|A\.D\.)\s*$/i;
const isBce = (e: string | undefined) => !!e && /^b/i.test(e.replace(/\./g, ""));

/**
 * One date, or null if it can't be read. `era` applies when the text has none of its own (so
 * "753–509 BCE" makes both ends BCE).
 */
export function parseDate(s: string, era?: string): TDate | null {
  let t = s.trim().replace(/\s+/g, " ");
  let approx = false;
  const c = /^(c\.|ca\.|circa|about|around|~)\s*/i.exec(t);
  if (c) {
    approx = true;
    t = t.slice(c[0].length);
  }
  // "65 million years ago", "3.5 billion years ago", "10,000 years ago", "65 mya"
  const ago = /^([\d,.]+)\s*(thousand|million|billion)?\s*(years ago|yrs ago|ya|mya|bya)$/i.exec(t);
  if (ago) {
    const n = Number(ago[1].replace(/,/g, ""));
    const unit = /mya/i.test(ago[3]) ? 1e6 : /bya/i.test(ago[3]) ? 1e9 : ago[2] ? { thousand: 1e3, million: 1e6, billion: 1e9 }[ago[2].toLowerCase() as "million"] : 1;
    if (!Number.isFinite(n)) return null;
    return { y: 2000 - n * unit, approx: true };
  }
  // "AD 476"
  const lead = /^(AD|A\.D\.|CE)\s+/i.exec(t);
  if (lead) t = t.slice(lead[0].length) + " CE";
  const em = ERA.exec(t);
  const e = em ? em[1] : era;
  if (em) t = t.slice(0, em.index).trim();
  const year = (n: number) => (isBce(e) ? 1 - n : n);
  // "5th century", "1st century BCE": the whole century as a range is handled in parseSpan.
  let m: RegExpExecArray | null;
  if ((m = /^(-?\d{1,9})$/.exec(t))) return { y: year(Number(m[1])), approx };
  if ((m = /^(\d{1,4})s$/.exec(t))) return { y: year(Number(m[1])), approx }; // "1960s"
  if ((m = /^(-?\d{1,4})-(\d{1,2})(?:-(\d{1,2}))?$/.exec(t))) return withMd(year(Number(m[1])), Number(m[2]), Number(m[3] ?? 1), approx);
  if ((m = /^([A-Za-z]{3,9})\.? (\d{1,2}),? (\d{1,9})$/.exec(t)) && monthOf(m[1]) >= 0) return withMd(year(Number(m[3])), monthOf(m[1]) + 1, Number(m[2]), approx);
  if ((m = /^(\d{1,2}) ([A-Za-z]{3,9})\.? (\d{1,9})$/.exec(t)) && monthOf(m[2]) >= 0) return withMd(year(Number(m[3])), monthOf(m[2]) + 1, Number(m[1]), approx);
  if ((m = /^([A-Za-z]{3,9})\.? (\d{1,9})$/.exec(t)) && monthOf(m[1]) >= 0) return withMd(year(Number(m[2])), monthOf(m[1]) + 1, 1, approx);
  return null;
}

function withMd(y: number, month: number, day: number, approx: boolean): TDate | null {
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  return { y: y + (month - 1) / 12 + (day - 1) / 365, approx };
}

/** A date or a range ("1861–1865", "27 BCE – 14 CE", "753–509 BCE", "15th century"). */
export function parseSpan(s: string): TSpan | null {
  const t = s.trim();
  const cent = /^(c\.\s*)?(\d{1,2})(st|nd|rd|th) century\s*(BCE|BC|CE|AD)?$/i.exec(t);
  if (cent) {
    const n = Number(cent[2]);
    const bce = isBce(cent[4]);
    // 15th century = 1401–1500; 5th century BCE = 500–401 BCE.
    return bce ? { a: { y: 1 - n * 100 }, b: { y: 1 - (n * 100 - 99) } } : { a: { y: n * 100 - 99 }, b: { y: n * 100 } };
  }
  const plainRange = /^(\d{3,4})-(\d{3,4})$/.exec(t);
  if (plainRange) return { a: { y: Number(plainRange[1]) }, b: { y: Number(plainRange[2]) } };
  const parts = t.split(/\s*[–—]\s*|\s+-\s+|\s+to\s+/i).filter(Boolean);
  if (parts.length === 1) {
    // "1960s" as a range of ten years.
    const dec = /^(\d{1,4})0s$/.exec(t);
    if (dec) return { a: { y: Number(dec[1]) * 10 }, b: { y: Number(dec[1]) * 10 + 9 } };
    const a = parseDate(t);
    return a ? { a } : null;
  }
  if (parts.length !== 2) return null;
  // Era written only at the end applies to both ends.
  const endEra = ERA.exec(parts[1])?.[1];
  const startEra = ERA.exec(parts[0])?.[1];
  const a = parseDate(parts[0], startEra ? undefined : endEra);
  const b = parseDate(parts[1]);
  if (!a || !b) return null;
  return { a, b };
}

/** A year for axis labels and readouts: "44 BCE", "1776", "65 million years ago". */
export function yearLabel(y: number, bceMode: boolean): string {
  if (y < -100000) {
    const ago = 2000 - y;
    return ago >= 1e9 ? `${trim(ago / 1e9)} billion years ago` : ago >= 1e6 ? `${trim(ago / 1e6)} million years ago` : `${trim(ago / 1e3)},000 years ago`;
  }
  const r = Math.round(y);
  if (r <= 0) return `${1 - r} BCE`;
  return bceMode ? `${r} CE` : String(r);
}
const trim = (n: number) => String(Math.round(n * 10) / 10);

export interface TimelineSpec {
  title?: string;
  caption?: string;
  eras: { span: TSpan; when: string; text: string; cat?: string }[];
  events: { span: TSpan; when: string; text: string; cat?: string }[];
  cats: string[];
  problems: string[];
}

export const TIMELINE_BLOCK = /^```timeline\b([^\n]*)\r?\n([\s\S]*?)^```[ \t]*$/gm;

export function parseTimeline(body: string): TimelineSpec {
  const { fields, problems } = readFields(body, ["title", "caption", "era", "event"], ["caption"]);
  const spec: TimelineSpec = { eras: [], events: [], cats: [], problems };
  for (const f of fields) {
    const at = `line ${f.line}`;
    if (f.key === "title" || f.key === "caption") {
      if (spec[f.key] !== undefined) problems.push(`${at}: more than one ${f.key}: line`);
      else if (!f.value) problems.push(`${at}: empty ${f.key}:`);
      else spec[f.key] = f.value;
      continue;
    }
    const [when = "", text = "", cat = "", ...rest] = f.value.split("|").map((p) => p.trim());
    const span = parseSpan(when);
    if (!span) {
      problems.push(`${at}: can't read the date "${when}" (examples: 1776, July 4, 1776, 44 BCE, c. 3000 BCE, 1861–1865, 15th century, 65 million years ago)`);
      continue;
    }
    if (span.b && span.b.y < span.a.y) problems.push(`${at}: "${when}" ends before it starts`);
    if (!text) problems.push(`${at}: ${f.key}: needs text after the date ("date | what happened")`);
    if (rest.length) problems.push(`${at}: too many | parts (date | text | category)`);
    if (f.key === "era" && !span.b) problems.push(`${at}: an era needs a range ("509–27 BCE")`);
    if (cat && !spec.cats.includes(cat)) spec.cats.push(cat);
    (f.key === "era" ? spec.eras : spec.events).push({ span, when, text, cat: cat || undefined });
  }
  if (!spec.events.length && !spec.eras.length) problems.push("no event: or era: lines");
  if (spec.cats.length > 6) problems.push(`${spec.cats.length} categories; only 6 colors can be told apart`);
  // Oldest first (a stable sort keeps the author's order for the same date).
  const by = (x: { span: TSpan }, y: { span: TSpan }) => x.span.a.y - y.span.a.y;
  spec.events.sort(by);
  spec.eras.sort(by);
  return spec;
}

/** Authoring problems for every timeline block in a Markdown text. */
export function timelineProblems(md: string): string[] {
  const blocks = [...md.matchAll(TIMELINE_BLOCK)];
  const out = blocks.flatMap((m, i) => {
    const spec = parseTimeline(m[2]);
    return [...(m[1].trim() ? [`unknown option "${m[1].trim()}"`] : []), ...spec.problems].map((p) => `timeline ${i + 1}${spec.title ? ` ("${spec.title.slice(0, 40)}")` : ""}: ${p}`);
  });
  if ((md.match(/^```timeline\b/gm) ?? []).length > blocks.length) out.push("a ```timeline block is never closed with ```");
  return out;
}

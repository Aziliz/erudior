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

import { escapeHtml, readFields, unwrap } from "./blockUtil";

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

const r3 = (n: number) => Math.round(n * 1000) / 1000;

export function renderTimeline(body: string, md: (src: string) => string, key: string): string {
  const spec = parseTimeline(body);
  const id = `tl-${key}`;
  const cat = (c?: string) => (c ? ` k${spec.cats.indexOf(c) % 6}` : "");
  const item = (cls: string, x: TimelineSpec["events"][number]) =>
    `<li class="${cls}${cat(x.cat)}${x.span.b ? " is-range" : ""}" data-a="${r3(x.span.a.y)}"${x.span.b ? ` data-b="${r3(x.span.b.y)}"` : ""}>` +
    `<span class="tl-date">${escapeHtml(x.when)}</span> <span class="tl-text">${unwrap(md(x.text))}</span>` +
    (x.cat ? ` <span class="tl-cat">(${escapeHtml(x.cat)})</span>` : "") +
    `</li>`;
  const eras = spec.eras.length ? `<ol class="tl-eras" aria-label="Periods">${spec.eras.map((e) => item("tl-era", e)).join("")}</ol>` : "";
  const events = spec.events.length ? `<ol class="tl-events" aria-label="Events, oldest first">${spec.events.map((e) => item("tl-ev", e)).join("")}</ol>` : "";
  const key2 = spec.cats.length
    ? `<ul class="tl-key" aria-label="Key">${spec.cats.map((c, i) => `<li><span class="tl-swatch k${i % 6}" aria-hidden="true"></span>${escapeHtml(c)}</li>`).join("")}</ul>`
    : "";
  return (
    `<figure class="tl" aria-labelledby="${id}-t">` +
    `<p class="tl-head" id="${id}-t"><span class="tl-kicker">Timeline</span>${spec.title ? `<span class="tl-title">${unwrap(md(spec.title))}</span>` : ""}</p>` +
    `<div class="tl-view">${eras}${events}</div>` +
    key2 +
    (spec.caption ? `<figcaption class="tl-caption">${md(spec.caption)}</figcaption>` : "") +
    `</figure>`
  );
}


// --- Layout (browser only) -----------------------------------------------------------

/** Nice tick step for a span of years. */
function tickStep(span: number, target: number): number {
  const raw = span / target;
  const p = 10 ** Math.floor(Math.log10(raw));
  return [1, 2, 5, 10].map((m) => m * p).find((s) => s >= raw) ?? raw;
}

const ZOOMS = [1, 1.5, 2.25, 3.5, 5, 8, 12];

/**
 * Make the timelines inside `root` interactive: horizontal with zoom buttons when there's room
 * (at least 520px), the plain list otherwise. Returns a cleanup function.
 */
export function hydrateTimelines(root: HTMLElement): () => void {
  const figs = [...root.querySelectorAll<HTMLElement>("figure.tl")];
  const cleanups = figs.map(hydrateOne);
  return () => cleanups.forEach((c) => c());
}

function hydrateOne(fig: HTMLElement): () => void {
  const view = fig.querySelector<HTMLElement>(".tl-view");
  if (!view || fig.dataset.live) return () => {};
  fig.dataset.live = "1";
  const items = [...view.querySelectorAll<HTMLElement>("li[data-a]")];
  const ys = items.flatMap((li) => [Number(li.dataset.a), Number(li.dataset.b ?? li.dataset.a)]);
  let lo = Math.min(...ys), hi = Math.max(...ys);
  const pad = Math.max((hi - lo) * 0.04, 0.5);
  lo -= pad;
  hi += pad;
  const bceMode = lo < 1;
  let zi = 0;

  const tools = document.createElement("div");
  tools.className = "tl-tools";
  tools.setAttribute("role", "group");
  tools.setAttribute("aria-label", "Zoom the timeline");
  const mk = (text: string, label: string, fn: () => void) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "btn sm ghost";
    b.textContent = text;
    b.setAttribute("aria-label", label);
    b.addEventListener("click", fn);
    tools.appendChild(b);
    return b;
  };
  const zin = mk("+", "Zoom in", () => setZoom(zi + 1));
  const zout = mk("−", "Zoom out", () => setZoom(zi - 1));
  const fit = mk("Fit", "Show the whole timeline", () => setZoom(0));
  const track = document.createElement("div");
  track.className = "tl-track";
  const axis = document.createElement("div");
  axis.className = "tl-axis";
  axis.setAttribute("aria-hidden", "true");

  let live = false;
  const setLive = (on: boolean) => {
    if (on === live) return;
    live = on;
    fig.classList.toggle("tl-live", on);
    if (on) {
      fig.insertBefore(tools, view);
      while (view.firstChild) track.appendChild(view.firstChild);
      track.insertBefore(axis, track.firstChild);
      view.appendChild(track);
      view.tabIndex = 0;
      view.setAttribute("role", "group");
      view.setAttribute("aria-label", "Timeline (scroll sideways to see all of it)");
    } else {
      tools.remove();
      axis.remove();
      while (track.firstChild) view.appendChild(track.firstChild);
      track.remove();
      view.removeAttribute("tabindex");
      view.removeAttribute("role");
      view.removeAttribute("aria-label");
      items.forEach((li) => li.removeAttribute("style"));
    }
  };

  const layout = () => {
    setLive(fig.clientWidth >= 520);
    if (!live) return;
    const width = view.clientWidth * ZOOMS[zi];
    track.style.width = `${width}px`;
    const x = (y: number) => ((y - lo) / (hi - lo)) * width;
    // Axis ticks.
    const step = tickStep(hi - lo, Math.max(3, Math.round(width / 120)));
    axis.textContent = "";
    // Ticks on round historical years (500 BCE, not astronomical -500 = 501 BCE); there's no year 0.
    const hist = (a: number) => (a <= 0 && a > -100000 ? a - 1 : a);
    for (let d = Math.ceil(hist(lo) / step) * step; d <= hist(hi); d += step) {
      if (d === 0 && bceMode && hi > -100000) continue;
      const t = d < 0 && d > -100000 ? d + 1 : d;
      // Labels too close to an end would be cut off.
      if (x(t) < 36 || x(t) > width - 36) continue;
      const tick = document.createElement("span");
      tick.className = "tl-tick";
      tick.style.left = `${x(t)}px`;
      tick.textContent = yearLabel(t, bceMode);
      axis.appendChild(tick);
    }
    // Eras: one row of bands.
    for (const li of items.filter((l) => l.classList.contains("tl-era"))) {
      const a = x(Number(li.dataset.a)), b = x(Number(li.dataset.b ?? li.dataset.a));
      li.style.left = `${a}px`;
      li.style.width = `${Math.max(4, b - a)}px`;
    }
    // Events: greedy lanes so labels never overlap. A label that would run past the right end
    // hangs to the left of its date instead. Each lane is as tall as its tallest label.
    const lanes: [number, number][][] = [];
    const laneOf: { li: HTMLElement; lane: number }[] = [];
    for (const li of items.filter((l) => l.classList.contains("tl-ev"))) {
      const a = x(Number(li.dataset.a));
      const b = li.dataset.b ? x(Number(li.dataset.b)) : a;
      li.style.left = `${a}px`;
      li.style.setProperty("--span", `${Math.max(0, b - a)}px`);
      li.style.maxWidth = `${Math.min(240, Math.max(150, width - 8))}px`;
      li.classList.remove("is-flip");
      const w = li.offsetWidth + 12;
      const flip = a + w > width && b - a < w && a - w >= 0;
      li.classList.toggle("is-flip", flip);
      const span: [number, number] = flip ? [a - w, a + 4] : [a - 4, a + Math.max(w, b - a + 12)];
      let lane = lanes.findIndex((occ) => occ.every(([s, e]) => e <= span[0] || s >= span[1]));
      if (lane < 0) lane = lanes.push([]) - 1;
      lanes[lane].push(span);
      laneOf.push({ li, lane });
      li.style.setProperty("--lane", String(lane));
    }
    const heights = lanes.map((_, l) => Math.max(36, ...laneOf.filter((o) => o.lane === l).map((o) => o.li.offsetHeight)) + 12);
    const tops = heights.map((_, l) => 10 + heights.slice(0, l).reduce((s, h) => s + h, 0));
    for (const { li, lane } of laneOf) li.style.setProperty("--y", `${tops[lane]}px`);
    track.style.setProperty("--events-h", `${10 + heights.reduce((s, h) => s + h, 0)}px`);
    zin.disabled = zi >= ZOOMS.length - 1;
    zout.disabled = fit.disabled = zi === 0;
  };

  const setZoom = (n: number) => {
    const next = Math.max(0, Math.min(ZOOMS.length - 1, n));
    if (next === zi) return;
    // Keep the middle of what's shown in the middle.
    const mid = (view.scrollLeft + view.clientWidth / 2) / Math.max(1, track.offsetWidth);
    zi = next;
    layout();
    view.scrollLeft = mid * track.offsetWidth - view.clientWidth / 2;
  };

  layout();
  let w = fig.clientWidth;
  const ro = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(() => {
    if (Math.abs(fig.clientWidth - w) < 2) return;
    w = fig.clientWidth;
    layout();
  });
  ro?.observe(fig);
  // Labels change size when the fonts arrive.
  let alive = true;
  document.fonts?.ready.then(() => alive && layout());
  return () => {
    // Back to the plain list, so hydrating again (same page, Strict Mode) starts clean.
    alive = false;
    ro?.disconnect();
    setLive(false);
    delete fig.dataset.live;
  };
}

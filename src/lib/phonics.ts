// Phonics and handwriting lesson blocks for early readers:
//
//   ```sounds              letter-sound tiles: tap a letter to hear its sound, then a word
//   m word=moon
//   s word=sun say="sss"
//   sh word=ship sound=data:audio/mpeg;base64,…
//   ```
//
//   ```blend               blending: tap each sound in turn, then blend them into the word
//   cat = c a t
//   ship = sh i p
//   ```
//
//   ```trace tolerance=loose      letter tracing on a writing pad (mouse, touch or pen)
//   a b c A B C
//   ```
//
// Sounds come from the course's audio library (lib/readAloud.ts): the sound of "m" is the
// clip under the key `sound:m` unless the line names another (`sound=` a key or a data:audio
// URL; in a blend, `c[k]` plays sound:k for the letter c). Text-to-speech can say words and
// letter names but not a lone sound reliably, so a sound with no recording falls back to its
// `say=` text, or the letter name and the word ("m, as in moon").
//
// Like worked examples, blocks are swapped for finished HTML before Markdown runs. The HTML
// works without JavaScript as far as it can (letters, words and tracing guides show and print);
// the Markdown component wires up the buttons (click delegation) and the tracing pads.

import { PHONICS_BLOCK, parseSounds, parseBlend, parseTrace, type SoundTile, type BlendWord, type TraceSpec } from "./phonicsSpec";
export { PHONICS_BLOCK, soundKey, parseSounds, parseUnits, parseBlend, parseTrace, phonicsProblems, type SoundTile, type BlendUnit, type BlendWord, type TraceSpec } from "./phonicsSpec";
const esc = (s: string) => s.replace(/[&<>"\']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;", "\'":"&#39;"})[c]!);

import { arrowAt, checkStroke, letterGuide, TOLERANCE, type Pt } from "./handwriting";
import { resolveAudio, sayItem, SPEAKER_ICON, type AudioLib } from "./readAloud";
import { canSpeak, speaker, type SayItem } from "./speech";

/** The text-to-speech stand-in for a sound with no recording. */
const soundFallback = (t: SoundTile) => t.say ?? (t.word ? `${t.show.slice(-1)}, as in ${t.word}` : t.show);

function sayBtn(cls: string, ph: string, key: string, text: string, inner: string, label?: string) {
  return `<button type="button" class="${cls}" data-ph="${ph}" data-key="${esc(key)}" data-text="${esc(text)}"${label ? ` aria-label="${esc(label)}"` : ""}>${inner}</button>`;
}

export function renderSounds(tiles: SoundTile[]): string {
  return (
    `<section class="ph ph-sounds" data-noread aria-label="Letter sounds">` +
    `<p class="ph-kicker">Letter sounds <span class="ph-hint">Tap a letter to hear its sound.</span></p>` +
    `<ul class="ph-tiles">` +
    tiles
      .map(
        (t) =>
          `<li class="ph-tile">` +
          sayBtn("ph-letter", "say", t.sound, soundFallback(t), `<span class="ph-glyph">${esc(t.show)}</span>`, `${t.show}: hear the sound`) +
          (t.word ? sayBtn("ph-word", "say", t.word, t.word, `${SPEAKER_ICON}<span>${esc(t.word)}</span>`, `Hear the word ${t.word}`) : "") +
          `</li>`,
      )
      .join("") +
    `</ul><p class="ph-nosound" hidden>Sound isn't available on this device, so the letters are shown without it.</p></section>`
  );
}

// --- blend ------------------------------------------------------------------------------

/** One word's sound tiles. In a question (`quiz`) the blended word isn't shown or said. */
export function renderBlendWord(w: BlendWord, i: number, opts: { quiz?: boolean; hidden?: boolean } = {}): string {
  return (
    `<div class="ph-bw" data-i="${i}"${opts.hidden ? " hidden" : ""}>` +
    `<ol class="ph-units" aria-label="Sounds">` +
    w.units
      .map((u, k) => `<li${k ? " hidden" : ""}>${sayBtn("ph-unit", "unit", u.sound, u.show, esc(u.show), `Sound ${k + 1} of ${w.units.length}: ${u.show}`)}</li>`)
      .join("") +
    `</ol>` +
    `<p class="ph-hint">Tap each sound, one at a time.</p>` +
    `<button type="button" class="btn primary ph-go" data-ph="blend" hidden>${SPEAKER_ICON}<span>${opts.quiz ? "Say the sounds fast" : "Blend the sounds"}</span></button>` +
    (opts.quiz ? "" : `<p class="ph-whole" hidden>${sayBtn("ph-word big", "say", w.word, w.word, `${SPEAKER_ICON}<span>${esc(w.word)}</span>`, `Hear the word ${w.word}`)}</p>`) +
    `</div>`
  );
}

export function renderBlend(words: BlendWord[]): string {
  const many = words.length > 1;
  return (
    `<section class="ph ph-blend" data-noread aria-label="Blending practice">` +
    `<p class="ph-kicker">Blend the sounds</p>` +
    words.map((w, i) => renderBlendWord(w, i, { hidden: i > 0 })).join("") +
    (many
      ? `<div class="ph-nav" hidden><button type="button" class="btn sm" data-ph="prev" disabled>Back</button>` +
        `<span class="ph-count" role="status">Word 1 of ${words.length}</span>` +
        `<button type="button" class="btn sm" data-ph="next">Next word</button></div>`
      : "") +
    `<p class="ph-nosound" hidden>Sound isn't available on this device.</p></section>`
  );
}

// --- trace ------------------------------------------------------------------------------

const fmt = (n: number) => String(Math.round(n * 10) / 10);
const pts = (p: Pt[]) => p.map(([x, y]) => `${fmt(x)},${fmt(y)}`).join(" ");
export const letterName = (ch: string) => (ch === ch.toUpperCase() ? `capital letter ${ch}` : `small letter ${ch}`);

/** The writing pad for one letter: writing lines, the letter as a lane to trace with a dashed
 * center line, an arrow on each stroke and a numbered dot where each stroke starts. */
export function renderPad(ch: string, tol: number): string {
  const g = letterGuide(ch)!;
  // Every pad is at least as wide as a capital, so thin letters (l, i) aren't drawn huge.
  const w = Math.max(g.width + 36, 130);
  const x0 = -(w - g.width) / 2;
  const lane = fmt(tol * 1.6);
  const line = (y: number, cls: string) => `<line class="tr-line ${cls}" x1="${x0}" x2="${fmt(x0 + w)}" y1="${y}" y2="${y}"/>`;
  const placed: Pt[] = [];
  const badges = g.strokes.map((s, i) => {
    let [x, y] = s[0];
    // Strokes that start at the same spot (E, B) get their numbers side by side.
    while (placed.some(([px, py]) => Math.hypot(px - x, py - y) < 15)) x -= 16;
    placed.push([x, y]);
    return `<g class="tr-start" data-s="${i}"><circle cx="${fmt(x)}" cy="${fmt(y)}" r="8"/><text x="${fmt(x)}" y="${fmt(y)}" dy="0.35em">${i + 1}</text></g>`;
  });
  const roads = g.strokes
    .map((s, i) =>
      s.length === 1
        ? `<circle class="tr-road tr-dot${i ? "" : " is-current"}" data-s="${i}" cx="${fmt(s[0][0])}" cy="${fmt(s[0][1])}" r="${fmt(tol * 0.8)}"/>`
        : `<polyline class="tr-road${i ? "" : " is-current"}" data-s="${i}" points="${pts(s)}" stroke-width="${lane}"/>`,
    )
    .join("");
  const centers = g.strokes.map((s) => (s.length > 1 ? `<polyline class="tr-center" points="${pts(s)}"/>` : "")).join("");
  const arrows = g.strokes
    .map((s, i) => {
      const a = arrowAt(s);
      return a ? `<path class="tr-arrow" data-s="${i}" d="M -6 -5 L 4 0 L -6 5 Z" transform="translate(${fmt(a.at[0])} ${fmt(a.at[1])}) rotate(${fmt(a.angle)})"/>` : "";
    })
    .join("");
  const n = g.strokes.length;
  return (
    `<svg class="trace-pad" viewBox="${fmt(x0)} -16 ${fmt(w)} 182" role="img" aria-label="Trace the ${esc(letterName(ch))}: ${n} stroke${n === 1 ? "" : "s"}. Start at number 1 and follow the arrow.">` +
    line(0, "top") +
    line(50, "mid") +
    line(100, "base") +
    line(150, "desc") +
    `<g class="tr-roads">${roads}</g><g class="tr-centers">${centers}</g><g class="tr-arrows">${arrows}</g><g class="tr-starts">${badges.join("")}</g><g class="tr-ink"></g>` +
    `</svg>`
  );
}

export function renderTrace(spec: TraceSpec): string {
  const tol = TOLERANCE[spec.tolerance];
  const many = spec.letters.length > 1;
  return (
    `<section class="ph ph-trace" data-noread data-tol="${tol}" aria-label="Letter tracing">` +
    `<p class="ph-kicker">Trace the letter${many ? "s" : ""} <span class="ph-hint">Start at number 1 and follow the arrows with your finger, pen or mouse.</span></p>` +
    `<ol class="ph-trace-list">` +
    spec.letters
      .map(
        (ch, i) =>
          `<li class="ph-trace-item" data-char="${esc(ch)}"${i ? " hidden" : ""}>` +
          `<p class="tr-name"><span class="tr-glyph" aria-hidden="true">${esc(ch)}</span><span class="tr-label">${esc(letterName(ch))}</span></p>` +
          renderPad(ch, tol) +
          `<p class="tr-status" role="status"></p>` +
          `<div class="tr-actions" hidden><button type="button" class="btn sm" data-tr="show">Show me</button><button type="button" class="btn sm ghost" data-tr="clear">Start over</button></div>` +
          `</li>`,
      )
      .join("") +
    `</ol>` +
    (many
      ? `<div class="ph-nav" hidden><button type="button" class="btn sm" data-ph="prev" disabled>Back</button>` +
        `<span class="ph-count" role="status">Letter 1 of ${spec.letters.length}</span>` +
        `<button type="button" class="btn sm" data-ph="next">Next letter</button></div>`
      : "") +
    `</section>`
  );
}

// --- Markdown pipeline ------------------------------------------------------------------

export function renderPhonicsBlock(kind: string, info: string, body: string): string {
  if (kind === "sounds") return renderSounds(parseSounds(info, body).tiles);
  if (kind === "blend") return renderBlend(parseBlend(info, body).words);
  return renderTrace(parseTrace(info, body));
}

/** Every sound/word key a Markdown text's phonics blocks play (for the course checker). */
export function phonicsKeys(md: string): string[] {
  const keys: string[] = [];
  for (const m of md.matchAll(PHONICS_BLOCK)) {
    if (m[1] === "sounds") for (const t of parseSounds(m[2], m[3]).tiles) keys.push(t.sound);
    if (m[1] === "blend") for (const w of parseBlend(m[2], m[3]).words) keys.push(...w.units.map((u) => u.sound));
  }
  return keys;
}

/** Swap phonics blocks for placeholders before Markdown runs; `restore` puts the HTML back (it
 * is built here from escaped text, so it goes in after sanitizing). */
export function protectPhonics(src: string): { text: string; restore: (html: string) => string } {
  if (!/```(sounds|blend|trace)\b/.test(src)) return { text: src, restore: (h) => h };
  const out: string[] = [];
  const text = src.replace(PHONICS_BLOCK, (_w, kind: string, info: string, body: string) => {
    out.push(renderPhonicsBlock(kind, info, body));
    return `\n\nXPHONICSX${out.length - 1}XPHONICSX\n\n`;
  });
  return {
    text,
    restore: (html) =>
      html.replace(/<p>XPHONICSX(\d+)XPHONICSX<\/p>/g, (_m, n) => out[Number(n)]).replace(/XPHONICSX(\d+)XPHONICSX/g, (_m, n) => out[Number(n)]),
  };
}

// --- Behavior ---------------------------------------------------------------------------

export interface PhonicsCtx {
  lib?: AudioLib;
  lang: string;
}

const itemFor = (btn: HTMLElement, ctx: PhonicsCtx, extra: Partial<SayItem> = {}): SayItem => ({
  ...sayItem(ctx.lib, btn.dataset.text ?? btn.textContent ?? "", { key: btn.dataset.key, el: btn }),
  ...extra,
});

function showSlide(box: HTMLElement, sel: string, i: number, noun: string) {
  const slides = [...box.querySelectorAll<HTMLElement>(sel)];
  if (i < 0 || i >= slides.length) return;
  speaker.stop();
  slides.forEach((s, k) => (s.hidden = k !== i));
  const nav = box.querySelector<HTMLElement>(".ph-nav");
  if (nav) {
    nav.querySelector<HTMLButtonElement>('[data-ph="prev"]')!.disabled = i === 0;
    nav.querySelector<HTMLButtonElement>('[data-ph="next"]')!.disabled = i === slides.length - 1;
    nav.querySelector(".ph-count")!.textContent = `${noun} ${i + 1} of ${slides.length}`;
  }
  box.dataset.at = String(i);
  slides[i].querySelector<HTMLElement>("button:not([hidden]), .trace-pad")?.focus?.();
}

/** Click delegation for sounds, blend and trace blocks (and question listen/blend prompts). */
export function handlePhonicsClick(target: Element, ctx: PhonicsCtx): boolean {
  const btn = target.closest<HTMLElement>("[data-ph], [data-tr]");
  if (!btn || !btn.closest(".ph")) return false;
  const box = btn.closest<HTMLElement>(".ph")!;
  const act = btn.dataset.ph ?? "";
  if (act === "say") {
    speaker.play([itemFor(btn, ctx)], { lang: ctx.lang, owner: "phonics" });
    return true;
  }
  if (act === "unit") {
    const li = btn.closest("li")!;
    const next = li.nextElementSibling as HTMLElement | null;
    if (next?.hidden) {
      next.hidden = false;
      next.querySelector<HTMLElement>("button")?.focus();
    } else if (!next) {
      const go = btn.closest(".ph-bw")?.querySelector<HTMLButtonElement>(".ph-go");
      if (go?.hidden) {
        go.hidden = false;
        go.focus();
      }
    }
    // Revealed first, so a speech engine that fails can't stop the child moving on.
    speaker.play([itemFor(btn, ctx)], { lang: ctx.lang, owner: "phonics" });
    return true;
  }
  if (act === "blend") {
    const bw = btn.closest<HTMLElement>(".ph-bw")!;
    const units = [...bw.querySelectorAll<HTMLElement>(".ph-unit")];
    const items = units.map((u, k) => itemFor(u, ctx, k ? { pause: 120 } : {}));
    const whole = bw.querySelector<HTMLElement>(".ph-whole");
    bw.querySelector(".ph-units")?.classList.add("is-blended");
    if (whole) {
      whole.hidden = false;
      const wb = whole.querySelector<HTMLElement>("button")!;
      items.push(itemFor(wb, ctx, { pause: 450 }));
    }
    speaker.play(items, { lang: ctx.lang, owner: "phonics" });
    return true;
  }
  if (act === "next" || act === "prev") {
    const at = Number(box.dataset.at ?? 0) + (act === "next" ? 1 : -1);
    if (box.classList.contains("ph-blend")) showSlide(box, ".ph-bw", at, "Word");
    else showSlide(box, ".ph-trace-item", at, "Letter");
    return true;
  }
  const tr = btn.dataset.tr;
  if (tr) {
    const item = btn.closest<HTMLElement>(".ph-trace-item");
    const pad = item ? tracers.get(item) : undefined;
    if (pad && tr === "clear") pad.reset();
    if (pad && tr === "show") pad.demo();
    return true;
  }
  return false;
}

/** Hides sound buttons that can't make a sound here (no voice and no recording) and turns on
 * the parts that need JavaScript (navigation, tracing pads). Safe to call again. */
export function hydratePhonics(root: HTMLElement, ctx: PhonicsCtx): void {
  const tts = canSpeak(ctx.lang);
  for (const box of root.querySelectorAll<HTMLElement>(".ph")) {
    let silent = 0;
    for (const b of box.querySelectorAll<HTMLElement>('[data-ph="say"], [data-ph="unit"]')) {
      const ok = tts || !!resolveAudio(ctx.lib, b.dataset.key).clip;
      // Silent buttons stay (the letters and words still teach); only their speaker icon goes.
      b.classList.toggle("is-silent", !ok);
      if (!ok) silent++;
    }
    const note = box.querySelector<HTMLElement>(".ph-nosound");
    if (note) note.hidden = silent === 0;
    const nav = box.querySelector<HTMLElement>(".ph-nav");
    if (nav) nav.hidden = false;
    if (box.classList.contains("ph-trace"))
      for (const item of box.querySelectorAll<HTMLElement>(".ph-trace-item")) if (!tracers.has(item)) tracers.set(item, new Tracer(item, Number(box.dataset.tol) || TOLERANCE.normal, ctx));
  }
}

// --- Tracing pad ------------------------------------------------------------------------

const tracers = new WeakMap<HTMLElement, Tracer>();
const SVGNS = "http://www.w3.org/2000/svg";

class Tracer {
  private svg: SVGSVGElement;
  private ink: SVGGElement;
  private status: HTMLElement;
  private guide: Pt[][];
  private stroke = 0;
  /** Points of a stroke traced in more than one go (lifted the pen part way). */
  private pending: Pt[] = [];
  private pendingEls: SVGPolylineElement[] = [];
  private cur: Pt[] | null = null;
  private curEl: SVGPolylineElement | null = null;
  private pointer: number | null = null;

  constructor(
    private item: HTMLElement,
    private tol: number,
    private ctx: PhonicsCtx,
  ) {
    this.svg = item.querySelector("svg.trace-pad")!;
    this.ink = this.svg.querySelector(".tr-ink")!;
    this.status = item.querySelector(".tr-status")!;
    this.guide = letterGuide(item.dataset.char ?? "")?.strokes ?? [];
    const actions = item.querySelector<HTMLElement>(".tr-actions");
    if (actions) actions.hidden = false;
    this.svg.classList.add("is-live");
    this.svg.addEventListener("pointerdown", this.down);
    this.svg.addEventListener("pointermove", this.move);
    this.svg.addEventListener("pointerup", this.up);
    this.svg.addEventListener("pointercancel", this.up);
    this.mark();
  }

  private toPad(e: PointerEvent): Pt {
    const m = this.svg.getScreenCTM?.();
    if (!m) return [0, 0];
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
    return [p.x, p.y];
  }

  private poly(cls: string): SVGPolylineElement {
    const el = document.createElementNS(SVGNS, "polyline") as SVGPolylineElement;
    el.setAttribute("class", cls);
    this.ink.append(el);
    return el;
  }

  private down = (e: PointerEvent) => {
    if (this.pointer !== null || this.stroke >= this.guide.length) return;
    e.preventDefault();
    this.pointer = e.pointerId;
    try {
      this.svg.setPointerCapture(e.pointerId);
    } catch {
      /* synthetic events */
    }
    this.cur = [this.toPad(e)];
    this.curEl = this.poly("tr-ink-line");
    this.curEl.setAttribute("points", pts(this.cur));
  };

  private move = (e: PointerEvent) => {
    if (e.pointerId !== this.pointer || !this.cur) return;
    e.preventDefault();
    const evs = typeof e.getCoalescedEvents === "function" ? e.getCoalescedEvents() : [];
    for (const ev of evs.length ? evs : [e]) {
      const p = this.toPad(ev);
      const last = this.cur[this.cur.length - 1];
      if (Math.hypot(p[0] - last[0], p[1] - last[1]) >= 0.8) this.cur.push(p);
    }
    this.curEl!.setAttribute("points", pts(this.cur));
  };

  private up = (e: PointerEvent) => {
    if (e.pointerId !== this.pointer || !this.cur) return;
    this.pointer = null;
    const drawn = this.cur;
    const el = this.curEl!;
    this.cur = null;
    this.curEl = null;
    this.judge(drawn, el);
  };

  /** Check what was just drawn against the stroke being traced. */
  judge(drawn: Pt[], el: SVGPolylineElement | null) {
    const guide = this.guide[this.stroke];
    if (!guide) return;
    const all = this.pending.concat(drawn);
    const r = checkStroke(guide, all, this.tol);
    if (r.ok) {
      for (const p of [...this.pendingEls, el]) p?.setAttribute("class", "tr-ink-line is-ok");
      this.pending = [];
      this.pendingEls = [];
      this.stroke++;
      this.mark();
      if (this.stroke >= this.guide.length) {
        this.item.classList.add("is-done");
        this.say(`You traced the ${letterName(this.item.dataset.char ?? "")}. Great job!`, "Great job!");
        this.item.closest(".ph")?.querySelector<HTMLButtonElement>('[data-ph="next"]:not(:disabled)')?.focus();
      } else this.say(`Stroke ${this.stroke} done. Now start at number ${this.stroke + 1}.`);
      return;
    }
    if (r.partial) {
      this.pending = all;
      if (el) this.pendingEls.push(el);
      this.say("Good. Keep going along the path.");
      return;
    }
    // Off the path: clear this try and say what to fix.
    for (const p of [...this.pendingEls, el]) p?.remove();
    this.pending = [];
    this.pendingEls = [];
    this.svg.classList.remove("is-shake");
    void this.svg.getBoundingClientRect?.();
    this.svg.classList.add("is-shake");
    const n = this.stroke + 1;
    this.say(
      !r.startOk ? `Start at number ${n}, then try again.` : !r.directionOk ? `Follow the arrow on stroke ${n}. Try again.` : `Stay inside the path. Try stroke ${n} again.`,
      "Try again.",
    );
  }

  /** Highlight the stroke to trace now; finished strokes turn solid. */
  private mark() {
    for (const el of this.svg.querySelectorAll<SVGElement>("[data-s]")) {
      const s = Number(el.dataset.s);
      el.classList.toggle("is-done", s < this.stroke);
      el.classList.toggle("is-current", s === this.stroke);
      el.classList.toggle("is-later", s > this.stroke);
    }
    if (this.stroke === 0 && !this.status.textContent) this.status.textContent = "";
  }

  /** Written feedback, and spoken when the device can (children may not read it yet). */
  private say(text: string, spoken?: string) {
    this.status.textContent = text;
    if (canSpeak(this.ctx.lang)) speaker.play([{ text: spoken ?? text }], { lang: this.ctx.lang, owner: "phonics" });
  }

  reset() {
    this.ink.replaceChildren();
    this.pending = [];
    this.pendingEls = [];
    this.stroke = 0;
    this.item.classList.remove("is-done");
    this.status.textContent = "";
    this.mark();
  }

  /** Shows the stroke being traced: a dot travels along it from its start. */
  demo() {
    const s = this.guide[Math.min(this.stroke, this.guide.length - 1)];
    if (!s) return;
    this.svg.querySelector(".tr-demo")?.remove();
    const dot = document.createElementNS(SVGNS, "circle");
    dot.setAttribute("class", "tr-demo");
    dot.setAttribute("r", "7");
    this.svg.append(dot);
    const place = (p: Pt) => (dot.setAttribute("cx", fmt(p[0])), dot.setAttribute("cy", fmt(p[1])));
    const still = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    this.status.textContent = `Watch: stroke ${Math.min(this.stroke, this.guide.length - 1) + 1} starts here and goes this way.`;
    if (still || s.length === 1) {
      place(s[0]);
      setTimeout(() => place(s[s.length - 1]), 700);
      setTimeout(() => dot.remove(), 1600);
      return;
    }
    const t0 = performance.now();
    const dur = Math.min(2200, 500 + s.length * 8);
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / dur);
      place(s[Math.round(k * (s.length - 1))]);
      if (k < 1) requestAnimationFrame(step);
      else setTimeout(() => dot.remove(), 400);
    };
    requestAnimationFrame(step);
  }
}

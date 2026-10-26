// Read-aloud for lessons and questions (early readers): what to say for a piece of the page,
// how math is spoken, recorded clips that replace text-to-speech, and the read buttons added
// to lesson text.
//
// Course audio library (`audio` in the course file): { key: value }.
// - Keys are either the words exactly as they're read aloud (compared ignoring case, spacing
//   and punctuation, so "The cat sat." matches a paragraph reading "The cat sat"), or names
//   that other features refer to, like `sound:m` for the sound of the letter m.
// - Values are a recorded clip (`data:audio/mpeg;base64,…`, any data:audio type) or
//   `say:<text>`, which speaks that text instead (a pronunciation fix: "say:Saint Louis").

import type { Course } from "./types";
import type { SayItem } from "./speech";
import { splitMath } from "./mathSplit";

export type AudioLib = Map<string, string>;

/** Language for read-aloud voices. Lessons are written in English (language courses too). */
export const READ_LANG = "en-US";

/** How a clip key or a piece of text is compared: letters and digits only, lower case. */
export const clipKey = (s: string) =>
  s
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}:]+/gu, " ")
    .replace(/(^|\s):|:(\s|$)/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/** A usable clip value: a data:audio URL, an app-relative path to an audio file, or say:text. */
export function isAudioValue(v: string): boolean {
  return /^data:audio\/[\w.+-]+[;,]/i.test(v) || /^say:\s*\S/i.test(v) || /^(?!\w+:|\/\/)[\w./-]+\.(mp3|m4a|ogg|oga|opus|wav|webm|aac)$/i.test(v);
}

/** The course's audio library with normalized keys. */
export function audioLibrary(course: Pick<Course, "audio"> | undefined): AudioLib {
  const lib: AudioLib = new Map();
  for (const [k, v] of Object.entries(course?.audio ?? {})) if (isAudioValue(v)) lib.set(clipKey(k), v);
  return lib;
}

/**
 * What to play for a reference: an inline data:audio URL is used as is; otherwise it's looked
 * up in the library (exact key, then normalized). Returns a clip, a replacement text, or neither.
 */
export function resolveAudio(lib: AudioLib | undefined, ref: string | undefined): { clip?: string; say?: string } {
  if (!ref) return {};
  if (/^data:audio\//i.test(ref)) return { clip: ref };
  const v = lib?.get(clipKey(ref));
  if (!v) return {};
  const m = /^say:\s*([\s\S]*)$/i.exec(v);
  return m ? { say: m[1].trim() } : { clip: v };
}

/** A SayItem for some text, using a recording from the library when one matches. */
export function sayItem(lib: AudioLib | undefined, text: string, opts: { key?: string; el?: HTMLElement | null; pause?: number } = {}): SayItem {
  const a = resolveAudio(lib, opts.key ?? text);
  return { text: a.say ?? text, ...(a.clip ? { clip: a.clip } : {}), ...(opts.el ? { el: opts.el } : {}), ...(opts.pause ? { pause: opts.pause } : {}) };
}

// ---------------------------------------------------------------------------------------
// Math to words. KaTeX keeps the TeX source in an <annotation>; reading that aloud gives
// "x squared plus 1" instead of the garbage a screen's glyphs would produce.

const WORDS: Record<string, string> = {
  times: " times ", cdot: " times ", div: " divided by ", pm: " plus or minus ", mp: " minus or plus ",
  le: " is less than or equal to ", leq: " is less than or equal to ", ge: " is greater than or equal to ",
  geq: " is greater than or equal to ", ne: " is not equal to ", neq: " is not equal to ", approx: " is about ",
  lt: " is less than ", gt: " is greater than ", to: " to ", rightarrow: " gives ", Rightarrow: " implies ",
  infty: " infinity ", degree: " degrees ", circ: " degrees ", percent: " percent ", ldots: " and so on ",
  cdots: " and so on ", dots: " and so on ", angle: " angle ", triangle: " triangle ", perp: " is perpendicular to ",
  parallel: " is parallel to ", cong: " is congruent to ", sim: " is similar to ", in: " in ", cup: " union ",
  cap: " intersect ", sin: " sine ", cos: " cosine ", tan: " tangent ", log: " log ", ln: " natural log ",
  sum: " the sum of ", int: " the integral of ", lim: " the limit ", prime: " prime ", Delta: " delta ",
};
const GREEK = "alpha beta gamma delta epsilon varepsilon zeta eta theta vartheta iota kappa lambda mu nu xi pi rho sigma tau upsilon phi varphi chi psi omega Gamma Theta Lambda Xi Pi Sigma Phi Psi Omega".split(" ");
const TEXTISH = new Set(["text", "textrm", "mathrm", "textbf", "mathbf", "textit", "mathit", "operatorname", "mbox", "boldsymbol", "mathsf", "mathbb", "mathcal", "bar", "overline", "vec", "hat", "underline"]);
const SKIP = new Set(["left", "right", "displaystyle", "big", "Big", "bigg", "Bigg", "quad", "qquad", "limits", "nolimits"]);
const ORD: Record<string, string> = { "2": "half", "3": "third", "4": "fourth", "5": "fifth", "6": "sixth", "8": "eighth", "10": "tenth" };

/** TeX to words, for reading aloud: `\frac{3}{4}` → "3 fourths", `x^2` → "x squared". */
export function texToSpeech(tex: string): string {
  let i = 0;
  const src = tex.replace(/(\d)\{,\}(\d)/g, "$1$2").replace(/\\[,;:! ]/g, " ");

  function group(): string {
    while (src[i] === " ") i++;
    if (src[i] === "{") {
      i++;
      const s = seq("}");
      i++;
      return s;
    }
    return atom();
  }
  function rawGroup(): string {
    while (src[i] === " ") i++;
    if (src[i] !== "{") return src[i++] ?? "";
    let depth = 0;
    const start = ++i;
    while (i < src.length && (src[i] !== "}" || depth)) {
      if (src[i] === "{") depth++;
      if (src[i] === "}") depth--;
      i++;
    }
    return src.slice(start, i++);
  }
  function atom(): string {
    const c = src[i];
    if (c === undefined) return "";
    if (c === "\\") {
      const m = /^\\([A-Za-z]+|.)/.exec(src.slice(i))!;
      i += m[0].length;
      const name = m[1];
      if (name === "frac" || name === "dfrac" || name === "tfrac") {
        const a = group().trim();
        const b = group().trim();
        // Small simple fractions read the way children hear them: "3 fourths", "1 half".
        if (/^\d$/.test(a) && ORD[b]) return ` ${a} ${ORD[b]}${a === "1" ? "" : "s"} `;
        return ` ${a} over ${b} `;
      }
      if (name === "sqrt") {
        let n = "";
        if (src[i] === "[") {
          const end = src.indexOf("]", i);
          n = src.slice(i + 1, end);
          i = end + 1;
        }
        const x = group();
        return n ? ` the ${n === "3" ? "cube" : `${n}th`} root of ${x} ` : ` the square root of ${x} `;
      }
      if (TEXTISH.has(name)) return ` ${name.startsWith("text") || name === "mbox" || name === "operatorname" ? rawGroup() : group()} `;
      if (SKIP.has(name)) return " ";
      if (name === "%" || name === "$" || name === "&" || name === "#" || name === "_") return name === "%" ? " percent " : ` ${name} `;
      if (name === "\\") return ", ";
      if (WORDS[name]) return WORDS[name];
      if (GREEK.includes(name)) return ` ${name.replace(/^var/, "")} `;
      return ` ${name} `;
    }
    i++;
    if (c === "^") {
      const p = group().trim();
      if (p === "2") return " squared ";
      if (p === "3") return " cubed ";
      if (/^(degrees|\\circ)$/.test(p) || p === "degrees") return " degrees ";
      return ` to the power ${p} `;
    }
    if (c === "_") return ` sub ${group()} `;
    if (c === "{") {
      const s = seq("}");
      i++;
      return s;
    }
    if (c === "=") return " equals ";
    if (c === "+") return " plus ";
    if (c === "<") return " is less than ";
    if (c === ">") return " is greater than ";
    if (c === "×" || c === "*") return " times ";
    if (c === "÷") return " divided by ";
    if (c === "/") return " over ";
    if (c === "%") return " percent ";
    if (c === "&" || c === "~") return " ";
    if (c === "-" || c === "−") {
      // A minus sign at the start, or after an operator or bracket, is "negative".
      const before = src.slice(0, i - 1).trimEnd();
      return !before || /[=+\-−(\[{,<>]$|\\(times|cdot|div|le|ge|leq|geq|ne|neq|left[([])$/.test(before) ? " negative " : " minus ";
    }
    if (c === "(" || c === ")" || c === "[" || c === "]" || c === "|") return " ";
    return c;
  }
  function seq(close?: string): string {
    let out = "";
    while (i < src.length && src[i] !== close) out += atom();
    return out;
  }
  return seq()
    .replace(/\s+/g, " ")
    .replace(/ ,/g, ",")
    .trim();
}

/** Words for a plain string that may hold $math$ (question stems, choices, explanations). */
export function mathTextSpeech(s: string): string {
  return splitMath(s)
    .map((seg) => (seg.math ? ` ${texToSpeech(seg.text)} ` : seg.text))
    .join("")
    .replace(/_{3,}/g, " blank ")
    .replace(/\s+/g, " ")
    .trim();
}

// ---------------------------------------------------------------------------------------
// Page text to words.

const BLOCKS = new Set(["P", "LI", "DIV", "H1", "H2", "H3", "H4", "H5", "H6", "TR", "FIGCAPTION", "BLOCKQUOTE", "SECTION", "UL", "OL", "TABLE", "FIGURE", "DT", "DD"]);

function skipEl(el: Element): boolean {
  if (el.matches("script, style, template, .ra-btn, .ra-skip, button.wx-show, select")) return true;
  if ((el as HTMLElement).hidden) return true;
  return el.getAttribute("aria-hidden") === "true" && !el.classList.contains("katex");
}

/**
 * What to say for an element: its text, math as words (or as TeX when `tex`, for matching
 * clip keys), pictures by their alt text; read buttons, hidden parts and decorations skipped.
 */
export function speechText(root: Element, opts: { tex?: boolean } = {}): string {
  const out: string[] = [];
  const end = () => {
    const last = out.join("").trimEnd();
    if (last && !/[.!?:;]$/.test(last)) out.push(". ");
    else out.push(" ");
  };
  const walk = (n: Node) => {
    if (n.nodeType === 3) {
      out.push((n as Text).data);
      return;
    }
    if (n.nodeType !== 1) return;
    const el = n as Element;
    if (el !== root && skipEl(el)) return;
    if (el.classList.contains("katex")) {
      const tex = el.getAttribute("data-tex") ?? el.querySelector("annotation")?.textContent ?? "";
      out.push(` ${opts.tex ? tex : texToSpeech(tex)} `);
      return;
    }
    if (el.tagName === "IMG") {
      const alt = el.getAttribute("alt")?.trim();
      if (alt) out.push(` ${alt} `);
      return;
    }
    if (el.getAttribute("role") === "img" || el.tagName.toLowerCase() === "svg") {
      const label = el.getAttribute("aria-label") ?? el.querySelector("title")?.textContent ?? "";
      if (label.trim()) out.push(` ${label.trim()} `);
      return;
    }
    if (el.tagName === "BR") {
      out.push(" ");
      return;
    }
    const cell = el.tagName === "TD" || el.tagName === "TH";
    for (const c of el.childNodes) walk(c);
    if (cell) out.push(", ");
    else if (BLOCKS.has(el.tagName) && el !== root) end();
  };
  walk(root);
  return out
    .join("")
    .replace(/\s+/g, " ")
    .replace(/\s+([.,!?;:])/g, "$1")
    .replace(/,\./g, ".")
    .replace(/([.,!?;:])[.,]+/g, "$1")
    .replace(/,\s*$/, "")
    .trim();
}

/** The SayItem for an element on the page (a recording replaces it when its words match a library key). */
export function elementItem(el: HTMLElement, lib?: AudioLib): SayItem {
  const ref = el.dataset.raKey ?? speechText(el, { tex: true });
  return sayItem(lib, speechText(el), { key: ref, el });
}

// ---------------------------------------------------------------------------------------
// Lesson text: every paragraph, list item, heading, table and equation is a "read unit"
// (data-ra="n"). Read-aloud courses also get a read button on each.

const UNIT = "h1, h2, h3, h4, h5, h6, p, li, .math-display, table, pre, figure";

export const SPEAKER_ICON =
  '<svg class="ra-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16 8.5a4.5 4.5 0 0 1 0 7M18.5 6a8 8 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

/** Marks the read units in rendered lesson HTML; with `buttons`, adds a read button to each. */
export function markReadUnits(html: string, buttons: boolean): string {
  if (typeof document === "undefined" || !html.trim()) return html;
  const t = document.createElement("template");
  t.innerHTML = html;
  let n = 0;
  const units: Element[] = [];
  for (const el of t.content.querySelectorAll(UNIT)) {
    if (el.closest("[data-noread], .wx-turn, .ra-skip")) continue;
    if (units.some((u) => u.contains(el))) continue;
    if (el.tagName === "LI" && el.querySelector("p")) continue;
    if (el.tagName === "FIGURE" && el.closest("p")) continue;
    if (!el.textContent?.trim() && !el.querySelector("img[alt], [role=img], .katex")) continue;
    units.push(el);
  }
  for (const el of units) {
    const id = String(++n);
    el.setAttribute("data-ra", id);
    if (!buttons) continue;
    const head = /^H[1-6]$/.test(el.tagName);
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = head ? "ra-btn ra-section" : "ra-btn";
    btn.dataset.raBtn = id;
    if (head) {
      btn.dataset.raScope = "section";
      btn.innerHTML = `${SPEAKER_ICON}<span>Read this part</span>`;
      el.after(btn);
    } else {
      btn.setAttribute("aria-label", "Read this aloud");
      btn.title = "Read this aloud";
      btn.innerHTML = SPEAKER_ICON;
      if (el.tagName === "P" || el.tagName === "LI") el.prepend(btn);
      else el.before(btn);
    }
  }
  return t.innerHTML;
}

/** Read units under a root that are showing now (hidden worked-example steps are skipped). */
export function readUnits(root: ParentNode): HTMLElement[] {
  return [...root.querySelectorAll<HTMLElement>("[data-ra]")].filter((el) => !el.closest("[hidden]"));
}

/** A heading's section: the heading and every unit after it up to the next heading of the same or higher level. */
export function sectionUnits(all: HTMLElement[], head: HTMLElement): HTMLElement[] {
  const start = all.indexOf(head);
  if (start < 0) return [head];
  const level = Number(head.tagName.slice(1)) || 6;
  const out = [head];
  for (const el of all.slice(start + 1)) {
    const h = /^H([1-6])$/.exec(el.tagName);
    if (h && Number(h[1]) <= level) break;
    out.push(el);
  }
  return out;
}

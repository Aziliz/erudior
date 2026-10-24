// Math notation: find TeX in text and render it with KaTeX.
//
// Delimiters: $$…$$ and \[…\] for display math; \(…\) and $…$ for inline math.
// Inline $…$ follows Pandoc's rules so prices aren't mistaken for math: the opening $
// must be followed by a non-space, the closing $ preceded by a non-space and not
// followed by a digit. "$250,000 and $3,000" stays text; "$2x + 1$" is math.

import katex from "katex";

export interface MathSeg {
  math: boolean;
  display?: boolean;
  text: string;
}

export function splitMath(src: string): MathSeg[] {
  const out: MathSeg[] = [];
  let buf = "";
  let i = 0;
  const push = (seg: MathSeg) => {
    if (buf) out.push({ math: false, text: buf });
    buf = "";
    out.push(seg);
  };
  while (i < src.length) {
    const c = src[i];
    // Escaped dollar sign.
    if (c === "\\" && src[i + 1] === "$") {
      buf += "$";
      i += 2;
      continue;
    }
    if (src.startsWith("$$", i)) {
      const end = src.indexOf("$$", i + 2);
      if (end > i + 2) {
        push({ math: true, display: true, text: src.slice(i + 2, end) });
        i = end + 2;
        continue;
      }
    }
    if (src.startsWith("\\[", i)) {
      const end = src.indexOf("\\]", i + 2);
      if (end > 0) {
        push({ math: true, display: true, text: src.slice(i + 2, end) });
        i = end + 2;
        continue;
      }
    }
    if (src.startsWith("\\(", i)) {
      const end = src.indexOf("\\)", i + 2);
      if (end > 0) {
        push({ math: true, text: src.slice(i + 2, end) });
        i = end + 2;
        continue;
      }
    }
    if (c === "$" && src[i + 1] && !/\s/.test(src[i + 1])) {
      // Find a valid closing $ on the same paragraph.
      let j = i + 1;
      let found = -1;
      while (j < src.length) {
        if (src[j] === "\n" && src[j + 1] === "\n") break;
        if (src[j] === "\\" ) {
          j += 2;
          continue;
        }
        if (src[j] === "$") {
          if (!/\s/.test(src[j - 1]) && !/\d/.test(src[j + 1] ?? "")) found = j;
          break;
        }
        j++;
      }
      if (found > i + 1) {
        push({ math: true, text: src.slice(i + 1, found) });
        i = found + 1;
        continue;
      }
    }
    buf += c;
    i++;
  }
  if (buf) out.push({ math: false, text: buf });
  return out;
}

export function hasMath(src: string): boolean {
  return splitMath(src).some((s) => s.math);
}

export function renderTex(tex: string, display = false): string {
  // Thousands separators: in TeX "1,000" renders as "1, 000"; "1{,}000" keeps it tight.
  tex = tex.replace(/(\d),(?=\d{3}(?![\d.]))/g, "$1{,}");
  return katex.renderToString(tex, { displayMode: display, throwOnError: false, strict: "ignore", output: "htmlAndMathml" });
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Plain text with math rendered (for question stems, choices and other non-Markdown text). */
export function renderMathText(src: string): string {
  return splitMath(src)
    .map((s) => (s.math ? (s.display ? renderTex(s.text, true) : `<span class="math-inline">${renderTex(s.text, false)}</span>`) : escapeHtml(s.text)))
    .join("");
}

/**
 * For Markdown: swap math out for placeholders before Markdown runs (so _ and * inside
 * math aren't treated as emphasis), then swap the rendered math back in afterwards.
 */
export function protectMath(src: string): { text: string; restore: (html: string) => string } {
  const segs = splitMath(src);
  if (!segs.some((s) => s.math)) return { text: src, restore: (h) => h };
  const rendered: string[] = [];
  const text = segs
    .map((s) => {
      if (!s.math) return s.text;
      rendered.push(s.display ? renderTex(s.text, true) : `<span class="math-inline">${renderTex(s.text, false)}</span>`);
      const tag = `XMATHX${rendered.length - 1}XMATHX`;
      return s.display ? `\n\n${tag}\n\n` : tag;
    })
    .join("");
  return {
    text,
    restore: (html) =>
      html
        .replace(/<p>XMATHX(\d+)XMATHX<\/p>/g, (_m, n) => `<div class="math-display">${rendered[Number(n)]}</div>`)
        .replace(/XMATHX(\d+)XMATHX/g, (_m, n) => rendered[Number(n)]),
  };
}

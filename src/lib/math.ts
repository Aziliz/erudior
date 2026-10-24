// Math notation: find TeX in text and render it with KaTeX.
//
// Delimiters: $$…$$ and \[…\] for display math; \(…\) and $…$ for inline math.
// Inline $…$ follows Pandoc's rules so prices aren't mistaken for math: the opening $
// must be followed by a non-space, the closing $ preceded by a non-space and not
// followed by a digit. "$250,000 and $3,000" stays text; "$2x + 1$" is math.

import katex from "katex";

import { splitMath } from "./mathSplit";
export { splitMath, type MathSeg } from "./mathSplit";

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

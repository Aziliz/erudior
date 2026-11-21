// Pronunciation-specific lesson text (Latin and Greek courses teach two pronunciations):
//
//   ```pron ecclesiastical
//   In church Latin, *c* before *e* or *i* sounds like English *ch*: *Cicerō* [ˈtʃitʃero].
//   ```
//
// and, for a few words inside a sentence, {pron=restored}[ˈkikeroː]{/pron}. The body is Markdown.
// On screen only the blocks for the learner's pronunciation show (lib/pronunciation.ts writes the
// rule); the others shrink to a "Shown for … pronunciation" note. Print shows every scheme.
// Worker-safe: no DOM here.

import type { PronScheme } from "./courseContentTypes";
export type { PronScheme } from "./courseContentTypes";

/** A whole ```pron <scheme> block at the start of a line. */
export const PRON_BLOCK = /^```pron\b([^\n]*)\r?\n([\s\S]*?)^```[ \t]*$/gm;
/** A scheme id: lower-case letters, digits and hyphens. */
export const PRON_ID = /^[a-z][a-z0-9-]{0,39}$/;
/** Inline: {pron=restored}text{/pron}. */
export const PRON_INLINE = /\{pron=([a-z][a-z0-9-]{0,39})\}([\s\S]*?)\{\/pron\}/g;

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** The scheme's label, or its id with a capital letter. */
export function schemeLabel(schemes: PronScheme[] | undefined, id: string): string {
  return schemes?.find((s) => s.id === id)?.label ?? id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, " ");
}

/** Problems in a text's pron blocks and inline marks ("pron block 2: scheme "x" isn't declared"). */
export function pronProblems(md: string, declared?: string[]): string[] {
  const out: string[] = [];
  const check = (where: string, id: string) => {
    if (!PRON_ID.test(id)) out.push(`${where}: "${id}" isn't a scheme id (lower-case letters, digits, hyphens)`);
    else if (declared && !declared.includes(id))
      out.push(`${where}: scheme "${id}" isn't in language.pronunciations${declared.length ? ` (${declared.join(", ")})` : " (the course declares none)"}`);
  };
  let n = 0;
  for (const m of md.matchAll(PRON_BLOCK)) {
    n++;
    const info = m[1].trim();
    if (!info) out.push(`pron block ${n}: name the scheme (\`\`\`pron restored)`);
    else if (/\s/.test(info)) out.push(`pron block ${n}: one scheme per block ("${info}")`);
    else check(`pron block ${n}`, info);
    if (!m[2].trim()) out.push(`pron block ${n}: empty`);
    if (/^```/m.test(m[2])) out.push(`pron block ${n}: can't hold another fenced block`);
  }
  const opened = (md.match(/^```pron\b/gm) ?? []).length;
  if (opened > n) out.push("a ```pron block is never closed with ```");
  let k = 0;
  for (const m of md.matchAll(PRON_INLINE)) {
    k++;
    check(`inline pron ${k}`, m[1]);
    if (m[2].includes("{pron=")) out.push(`inline pron ${k}: can't hold another {pron=…}`);
  }
  const opens = (md.match(/\{pron=/g) ?? []).length;
  const closes = (md.match(/\{\/pron\}/g) ?? []).length;
  if (opens !== k || closes !== k) out.push("an inline {pron=…} isn't closed with {/pron} (or a {/pron} has no opening)");
  return out;
}

export interface PronContext {
  /** The course language code (the switch is per language). */
  lang?: string;
  schemes?: PronScheme[];
}

const langAttr = (ctx: PronContext) => esc((ctx.lang ?? "x").replace(/[^A-Za-z0-9-]/g, ""));

/** The HTML for one block (body already rendered and sanitized). */
export function pronBlockHtml(id: string, bodyHtml: string, ctx: PronContext): string {
  const label = esc(schemeLabel(ctx.schemes, id));
  return (
    `<section class="pron-blk" data-pron-lang="${langAttr(ctx)}" data-pron="${esc(id)}">` +
    `<p class="pron-tag"><span class="pron-on">${label} pronunciation</span>` +
    `<span class="pron-off">Shown for ${label} pronunciation. <button type="button" class="linkish pron-switch" data-pron-set="${esc(id)}" data-pron-lang="${langAttr(ctx)}">Switch to ${label}</button></span></p>` +
    `<div class="pron-body">${bodyHtml}</div>` +
    `</section>`
  );
}

/** Swap pron blocks for placeholders before Markdown runs; `restore` puts their HTML back after sanitizing. */
export function protectPron(md: string, render: (body: string) => string, ctx: PronContext): { text: string; restore: (html: string) => string } {
  if (!md.includes("```pron")) return { text: md, restore: (h) => h };
  const out: string[] = [];
  const text = md.replace(PRON_BLOCK, (_whole, info: string, body: string) => {
    const id = info.trim();
    if (!PRON_ID.test(id)) return _whole;
    out.push(pronBlockHtml(id, render(body), ctx));
    return `\n\nXPRONX${out.length - 1}XPRONX\n\n`;
  });
  if (!out.length) return { text: md, restore: (h) => h };
  return {
    text,
    restore: (html) => html.replace(/<p>XPRONX(\d+)XPRONX<\/p>/g, (_m, n) => out[Number(n)]).replace(/XPRONX(\d+)XPRONX/g, (_m, n) => out[Number(n)]),
  };
}

/** Inline {pron=id}…{/pron} in rendered HTML → spans (the label shows only in print). */
export function pronInlineHtml(html: string, ctx: PronContext): string {
  if (!html.includes("{pron=")) return html;
  return html.replace(PRON_INLINE, (_m, id: string, inner: string) =>
    `<span class="pron-inl" data-pron-lang="${langAttr(ctx)}" data-pron="${esc(id)}"><span class="pron-inl-tag">${esc(schemeLabel(ctx.schemes, id))}: </span>${inner}</span>`,
  );
}

/** Plain text of a source with the markup gone and every scheme's text kept (search, read-aloud). */
export const stripPronMarkup = (md: string) => md.replace(/^```pron\b[^\n]*\r?\n/gm, "").replace(/\{pron=[a-z][a-z0-9-]*\}|\{\/pron\}/g, "");

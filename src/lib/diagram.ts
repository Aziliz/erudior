// Mermaid diagrams in lessons and reference sheets (```mermaid fenced blocks). The Markdown
// renderer swaps each block for a placeholder that shows the diagram's title and description;
// the Markdown component then draws it with mermaid (loaded only when a page has one), in the
// app's colors for the current theme.

export const MERMAID_BLOCK = /^```mermaid[ \t]*\r?\n([\s\S]*?)^```[ \t]*$/gm;

/** The diagram's accTitle and accDescr (single-line or { … } block). */
export function mermaidA11y(src: string): {
  title: string;
  description: string;
} {
  const title = /^\s*accTitle\s*:\s*(.+)$/m.exec(src)?.[1]?.trim() ?? "";
  const block = /^\s*accDescr\s*\{([\s\S]*?)\}/m.exec(src)?.[1];
  const line = /^\s*accDescr\s*:\s*(.+)$/m.exec(src)?.[1];
  return {
    title,
    description: (block ?? line ?? "").replace(/\s+/g, " ").trim(),
  };
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Replace mermaid blocks with placeholders before Markdown runs. */
export function protectDiagrams(md: string): {
  text: string;
  restore: (html: string) => string;
} {
  const out: string[] = [];
  const text = md.replace(MERMAID_BLOCK, (_m, body: string) => {
    const { title, description } = mermaidA11y(body);
    out.push(
      `<figure class="diagram" data-src="${esc(encodeURIComponent(body))}">` +
        `<div class="diagram-fallback"><strong>${esc(title || "Diagram")}</strong>${description ? `<span>${esc(description)}</span>` : ""}</div>` +
        `</figure>`,
    );
    return `\n\nXDIAGX${out.length - 1}XDIAGX\n\n`;
  });
  if (!out.length) return { text: md, restore: (h) => h };
  return {
    text,
    restore: (html) => html.replace(/<p>XDIAGX(\d+)XDIAGX<\/p>/g, (_m, n) => out[Number(n)]).replace(/XDIAGX(\d+)XDIAGX/g, (_m, n) => out[Number(n)]),
  };
}

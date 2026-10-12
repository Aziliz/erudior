import { useMemo, useRef, useState } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import type { GlossaryEntry } from "../lib/types";

marked.setOptions({ gfm: true, breaks: false });

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** [[term]] / [[term|shown]] → a button that opens the glossary entry. */
function linkTerms(md: string): string {
  return md.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_m, term: string, shown?: string) => {
    const t = term.trim();
    return `<button type="button" class="gloss" data-term="${escapeHtml(t)}">${escapeHtml((shown ?? t).trim())}</button>`;
  });
}

export function findTerm(glossary: GlossaryEntry[], term: string): GlossaryEntry | undefined {
  const t = term.toLowerCase();
  return glossary.find(
    (g) => g.term.toLowerCase() === t || g.aliases?.some((a) => a.toLowerCase() === t),
  );
}

export function renderMarkdown(md: string): string {
  const html = marked.parse(linkTerms(md), { async: false }) as string;
  return DOMPurify.sanitize(html, { ADD_ATTR: ["data-term", "type"] });
}

interface Pop {
  entry?: GlossaryEntry;
  term: string;
  x: number;
  y: number;
}

export default function Markdown({
  source,
  glossary = [],
  className = "prose",
}: {
  source: string;
  glossary?: GlossaryEntry[];
  className?: string;
}) {
  const html = useMemo(() => renderMarkdown(source), [source]);
  const [pop, setPop] = useState<Pop | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  function onClick(e: React.MouseEvent) {
    const el = (e.target as HTMLElement).closest<HTMLElement>("button.gloss");
    if (!el) return;
    const term = el.dataset.term ?? "";
    const box = el.getBoundingClientRect();
    const host = ref.current!.getBoundingClientRect();
    setPop({
      term,
      entry: findTerm(glossary, term),
      x: Math.min(box.left - host.left, host.width - 340),
      y: box.bottom - host.top + 6,
    });
  }

  return (
    <div className="md-host" ref={ref}>
      <div className={className} onClick={onClick} dangerouslySetInnerHTML={{ __html: html }} />
      {pop && (
        <>
          <div className="pop-scrim" onClick={() => setPop(null)} />
          <div className="gloss-pop" style={{ left: Math.max(0, pop.x), top: pop.y }} role="dialog" aria-label={pop.term}>
            <div className="row" style={{ justifyContent: "space-between", flexWrap: "nowrap" }}>
              <strong>{pop.entry?.term ?? pop.term}</strong>
              <button className="btn ghost sm" onClick={() => setPop(null)} aria-label="Close">
                ✕
              </button>
            </div>
            <p>{pop.entry ? pop.entry.definition : "This term isn't in the glossary yet."}</p>
          </div>
        </>
      )}
    </div>
  );
}

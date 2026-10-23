import { useMemo, useRef, useState } from "react";
import MathText from "./MathText";
import { marked } from "marked";
import DOMPurify from "dompurify";
import type { GlossaryEntry } from "../lib/types";
import { protectMath } from "../lib/math";
import { protectFigures } from "../lib/figure";

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

export function renderMarkdown(md: string, scope?: Record<string, number>): string {
  // Figures (```plot / ```figure blocks) and math are rendered separately and slotted
  // back in after Markdown, so Markdown never mangles their contents.
  const figs = protectFigures(md, scope);
  const math = protectMath(figs.text);
  const html = math.restore(figs.restore(marked.parse(linkTerms(math.text), { async: false }) as string));
  // An empty corner header cell is announced as a blank header; make it a plain cell.
  return DOMPurify.sanitize(html.replace(/<th([^>]*)>\s*<\/th>/g, "<td$1></td>"), {
    ADD_TAGS: ["marker", "clipPath"],
    ADD_ATTR: ["data-term", "type", "marker-end", "marker-start", "clip-path", "refX", "refY", "orient", "markerWidth", "markerHeight"],
  });
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
  scope,
  foreignLang,
}: {
  source: string;
  /** Language courses: italic text is the target language (authoring convention), so mark it
   * with lang="…" for screen readers and the browser's hyphenation (WCAG 3.1.2). */
  foreignLang?: string;
  glossary?: GlossaryEntry[];
  className?: string;
  /** Values for expressions inside figures (drills). */
  scope?: Record<string, number>;
}) {
  const html = useMemo(() => {
    const out = renderMarkdown(source, scope);
    if (!foreignLang) return out;
    const code = foreignLang.replace(/[^A-Za-z-]/g, "");
    // Dialogues and reading texts are blockquotes in the target language, too.
    return out.replace(/<em>/g, `<em lang="${code}">`).replace(/<blockquote>/g, `<blockquote lang="${code}">`);
  }, [source, scope, foreignLang]);
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
            <p>{pop.entry ? <MathText text={pop.entry.definition} /> : "This term isn't in the glossary yet."}</p>
          </div>
        </>
      )}
    </div>
  );
}

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import MathText from "./MathText";
import { marked } from "marked";
import DOMPurify from "dompurify";
import type { GlossaryEntry } from "../lib/types";
import { protectMath } from "../lib/math";
import { protectFigures } from "../lib/figure";
import { protectDiagrams } from "../lib/diagram";
import { protectExamples, revealExample } from "../lib/examples";
import { protectManipulatives, type ManipSpec } from "../lib/manip";
import { LessonManipulative } from "./Manipulative";

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
  // Exact spelling first, so symbols that differ only in case (N newton, n refractive index;
  // H henry, h Planck's constant) find the right entry; then ignore case.
  const exact = glossary.find((g) => g.term === term || g.aliases?.includes(term));
  if (exact) return exact;
  const t = term.toLowerCase();
  return glossary.find(
    (g) => g.term.toLowerCase() === t || g.aliases?.some((a) => a.toLowerCase() === t),
  );
}

export function renderMarkdown(md: string, scope?: Record<string, number>): string {
  // Figures (```plot / ```figure blocks) and math are rendered separately and slotted
  // back in after Markdown, so Markdown never mangles their contents.
  // Worked examples (```example blocks): each field goes through this same pipeline.
  const examples = protectExamples(md, (field) => renderMarkdown(field, scope));
  md = examples.text;
  // Manipulatives (```manipulative blocks): a static picture here; the component mounts controls.
  const manips = protectManipulatives(md);
  md = manips.text;
  const diags = protectDiagrams(md);
  const figs = protectFigures(diags.text, scope);
  const math = protectMath(figs.text);
  const html = diags.restore(math.restore(figs.restore(marked.parse(linkTerms(math.text), { async: false }) as string)));
  // An empty corner header cell is announced as a blank header; make it a plain cell.
  const tidy = html.replace(/<th([^>]*)>\s*<\/th>/g, "<td$1></td>");
  const clean = DOMPurify.sanitize(tidy, {
    ADD_TAGS: ["marker", "clipPath"],
    ADD_ATTR: ["data-term", "type", "marker-end", "marker-start", "clip-path", "refX", "refY", "orient", "markerWidth", "markerHeight"],
  });
  return examples.restore(manips.restore(mathHeaders(clean)));
}

/** A table header holding only math gets plain text for screen readers too (KaTeX's MathML
 * alone doesn't count as header text for every screen reader). */
function mathHeaders(html: string): string {
  if (!html.includes("<th") || !html.includes("katex") || typeof document === "undefined") return html;
  const t = document.createElement("template");
  t.innerHTML = html;
  let changed = false;
  for (const th of t.content.querySelectorAll("th")) {
    if (!th.querySelector(".katex")) continue;
    const rest = th.cloneNode(true) as HTMLElement;
    rest.querySelectorAll(".katex").forEach((k) => k.remove());
    if (rest.textContent?.trim()) continue;
    const tex = [...th.querySelectorAll(".katex")]
      .map((k) => (k.querySelector("annotation")?.textContent || k.querySelector(".katex-html")?.textContent || "").trim())
      .join(" ");
    const sr = document.createElement("span");
    sr.className = "sr-only";
    sr.textContent = tex;
    th.append(sr);
    changed = true;
  }
  return changed ? t.innerHTML : html;
}

/** Section headings that get their own color (every math/science lesson ends with these). */
const SECTION_KINDS: [RegExp, string][] = [
  [/^key points$|^quick review$|^summary$|^in short$/i, "sec-key"],
  [/^common mistakes$|^watch out$|^pitfalls$/i, "sec-mistakes"],
];
const CALLOUTS: [RegExp, string][] = [
  [/^(exam tip|tip|strategy|remember|hint)\b/i, "callout-tip"],
  [/^(warning|caution|watch out|careful|note)\b/i, "callout-warn"],
];

/**
 * Lessons get color for structure (website and app alike): "Key points" and "Common mistakes"
 * sections, worked examples, tips and named rules or theorems each get a tinted box, so a long
 * lesson isn't a wall of the same gray. Dialogue and reading texts in language courses stay plain.
 */
export function decorateLesson(html: string, opts: { foreign?: boolean } = {}): string {
  if (typeof document === "undefined" || (!html.includes("<h2") && !html.includes("<h3") && !html.includes("<blockquote"))) return html;
  const root = document.createElement("div");
  root.innerHTML = html;
  // Wrap "## Key points" / "## Common mistakes" sections and "### Example …" blocks.
  const wrap = (head: Element, cls: string, stop: (el: Element) => boolean) => {
    const box = document.createElement("section");
    box.className = `lesson-box ${cls}`;
    head.before(box);
    let el: Element | null = head;
    while (el && (el === head || !stop(el))) {
      const next: Element | null = el.nextElementSibling;
      box.append(el);
      el = next;
    }
  };
  for (const h of [...root.querySelectorAll(":scope > h2")]) {
    const kind = SECTION_KINDS.find(([re]) => re.test(h.textContent?.trim() ?? ""))?.[1];
    if (kind) wrap(h, kind, (el) => /^H[12]$/.test(el.tagName));
  }
  for (const h of [...root.querySelectorAll(":scope > h3, :scope > h4")]) {
    if (/^(worked )?example\b/i.test(h.textContent?.trim() ?? "")) wrap(h, "sec-example", (el) => /^H[1-4]$/.test(el.tagName) || el.tagName === "SECTION");
  }
  if (!opts.foreign)
    for (const q of [...root.querySelectorAll("blockquote")]) {
      const lead = q.firstElementChild?.firstElementChild;
      if (!lead || lead.tagName !== "STRONG" || q.firstElementChild?.firstChild !== lead) continue;
      const label = lead.textContent?.trim() ?? "";
      q.classList.add(CALLOUTS.find(([re]) => re.test(label))?.[1] ?? "callout-rule");
    }
  return root.innerHTML;
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
    const plain = renderMarkdown(source, scope);
    const out = className.includes("prose") ? decorateLesson(plain, { foreign: !!foreignLang }) : plain;
    if (!foreignLang) return out;
    const code = foreignLang.replace(/[^A-Za-z-]/g, "");
    // Dialogues and reading texts are blockquotes in the target language, too.
    return out.replace(/<em>/g, `<em lang="${code}">`).replace(/<blockquote>/g, `<blockquote lang="${code}">`);
  }, [source, scope, foreignLang, className]);
  const [pop, setPop] = useState<Pop | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLDivElement>(null);
  // Manipulative blocks get their controls here, rendered into each block's box.
  const [manips, setManips] = useState<{ el: HTMLElement; spec: ManipSpec }[]>([]);
  useLayoutEffect(() => {
    const found: { el: HTMLElement; spec: ManipSpec }[] = [];
    body.current?.querySelectorAll<HTMLElement>("figure.manip[data-manip]").forEach((el) => {
      try {
        found.push({ el, spec: JSON.parse(el.dataset.manip ?? "") as ManipSpec });
        el.querySelector(".manip-static")?.setAttribute("hidden", "");
      } catch {
        // Keep the static picture.
      }
    });
    setManips(found);
  }, [html]);

  // Wide display math scrolls sideways in its box; such a box must be reachable by keyboard.
  useEffect(() => {
    const el = body.current;
    if (!el) return;
    const mark = () =>
      el.querySelectorAll<HTMLElement>(".math-display").forEach((m) => {
        if (m.scrollWidth > m.clientWidth + 1) {
          m.tabIndex = 0;
          m.setAttribute("role", "group");
          m.setAttribute("aria-label", "Equation (scroll sideways to see all of it)");
        } else if (m.hasAttribute("tabindex")) {
          m.removeAttribute("tabindex");
          m.removeAttribute("role");
          m.removeAttribute("aria-label");
        }
      });
    mark();
    // Equations widen once KaTeX's fonts load, and when the column changes width.
    let alive = true;
    document.fonts?.ready.then(() => alive && mark());
    const ro = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(() => mark());
    ro?.observe(el);
    window.addEventListener("resize", mark);
    return () => {
      alive = false;
      ro?.disconnect();
      window.removeEventListener("resize", mark);
    };
  }, [html]);

  // Mermaid diagrams: drawn after render, and redrawn in the new colors when the theme changes.
  useEffect(() => {
    const el = body.current;
    if (!el || !el.querySelector("figure.diagram")) return;
    let alive = true;
    const draw = () => {
      if (alive) import("../lib/mermaidRender").then((m) => (alive ? m.renderDiagrams(el) : undefined));
    };
    draw();
    const obs = new MutationObserver(draw);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    mq?.addEventListener?.("change", draw);
    return () => {
      alive = false;
      obs.disconnect();
      mq?.removeEventListener?.("change", draw);
    };
  }, [html]);

  function onClick(e: React.MouseEvent) {
    if (revealExample(e.target as Element)) return;
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
      <div ref={body} className={className} onClick={onClick} dangerouslySetInnerHTML={{ __html: html }} />
      {manips.map((m, i) => createPortal(<LessonManipulative spec={m.spec} />, m.el, `manip-${i}-${html.length}`))}
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

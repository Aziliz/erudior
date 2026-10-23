// Draws the diagram placeholders made by protectDiagrams (see diagram.ts). Mermaid is large,
// so it's loaded the first time a page has a diagram.

import DOMPurify from "dompurify";

type Mermaid = typeof import("mermaid").default;
let loading: Promise<Mermaid> | null = null;
let counter = 0;

const load = () => (loading ??= import("mermaid").then((m) => m.default));

function themeVars(): Record<string, string> {
  const css = getComputedStyle(document.documentElement);
  const v = (name: string) => css.getPropertyValue(name).trim();
  const ink = v("--ink") || "#1c2833";
  const surface = v("--surface") || "#ffffff";
  const soft = v("--accent-soft") || "#dde8f3";
  const line = v("--ink-2") || "#3e4c58";
  return {
    fontFamily: v("--sans") || "sans-serif",
    fontSize: "15px",
    background: surface,
    primaryColor: soft,
    primaryTextColor: ink,
    primaryBorderColor: v("--accent") || line,
    secondaryColor: v("--ok-soft") || soft,
    secondaryTextColor: ink,
    secondaryBorderColor: v("--ok") || line,
    tertiaryColor: v("--study-soft") || soft,
    tertiaryTextColor: ink,
    tertiaryBorderColor: v("--study") || line,
    lineColor: line,
    textColor: ink,
    mainBkg: soft,
    nodeBorder: v("--accent") || line,
    nodeTextColor: ink,
    clusterBkg: v("--sheet") || surface,
    clusterBorder: v("--rule") || line,
    titleColor: ink,
    edgeLabelBackground: surface,
    labelBackground: surface,
    actorBkg: soft,
    actorTextColor: ink,
    actorBorder: v("--accent") || line,
    signalColor: ink,
    signalTextColor: ink,
    noteBkgColor: v("--flag-soft") || soft,
    noteTextColor: ink,
    noteBorderColor: v("--flag") || line,
    pie1: v("--fig-0"),
    pie2: v("--fig-1"),
    pie3: v("--fig-2"),
    pie4: v("--fig-3"),
    pie5: v("--fig-4"),
    pie6: v("--fig-5"),
    pieTitleTextColor: ink,
    pieSectionTextColor: ink,
    pieLegendTextColor: ink,
    pieStrokeColor: surface,
    cScale0: soft,
    cScaleLabel0: ink,
    git0: v("--fig-0"),
  };
}

/** Draw every diagram placeholder under `root` (again, when the theme changes). */
export async function renderDiagrams(root: HTMLElement): Promise<void> {
  const els = [...root.querySelectorAll<HTMLElement>("figure.diagram[data-src]")];
  if (!els.length) return;
  const mermaid = await load();
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: "strict",
    theme: "base",
    themeVariables: themeVars(),
    htmlLabels: false,
    flowchart: { htmlLabels: false, useMaxWidth: true },
    sequence: { useMaxWidth: true },
  });
  for (const el of els) {
    if (!el.isConnected) continue;
    const src = decodeURIComponent(el.dataset.src ?? "");
    try {
      const { svg } = await mermaid.render(`erudior-diagram-${++counter}`, src);
      const clean = DOMPurify.sanitize(svg, {
        USE_PROFILES: { svg: true, svgFilters: true },
        ADD_TAGS: ["style"],
      });
      const holder = el.querySelector(".diagram-svg") ?? document.createElement("div");
      holder.className = "diagram-svg";
      holder.innerHTML = clean;
      if (!holder.isConnected) el.prepend(holder);
      el.classList.add("drawn");
      fitDiagram(el, holder as HTMLElement);
    } catch (e) {
      el.classList.add("failed");
      console.warn("diagram", e);
    }
  }
}

/**
 * Wide diagrams shrink to fit, but not below about 70% of their natural size (smaller text is
 * hard to read on a phone); past that the diagram scrolls sideways in its own box.
 */
function fitDiagram(fig: HTMLElement, holder: HTMLElement) {
  const svg = holder.querySelector("svg");
  if (!svg) return;
  const natural = svg.viewBox?.baseVal?.width || svg.getBoundingClientRect().width;
  if (!natural) return;
  const room = fig.clientWidth - 24;
  const width = Math.min(natural, Math.max(room, natural * 0.7));
  svg.style.maxWidth = "none";
  svg.style.width = `${Math.round(width)}px`;
  svg.removeAttribute("height");
  const scrolls = width > room + 1;
  holder.classList.toggle("scrolls", scrolls);
  if (scrolls) {
    holder.tabIndex = 0;
    holder.setAttribute("role", "region");
    holder.setAttribute("aria-label", "Diagram (scroll sideways to see all of it)");
  } else {
    holder.removeAttribute("tabindex");
    holder.removeAttribute("role");
    holder.removeAttribute("aria-label");
  }
}

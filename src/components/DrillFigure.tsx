import DOMPurify from "dompurify";
import type { DrillInstance } from "../lib/drills";
import { renderFigure } from "../lib/figure";

/** A generated problem's figures (graphs and diagrams) as sanitized SVG. */
export function drillFigureHtml(inst: DrillInstance): string {
  if (!inst.figures.length) return "";
  const scope = Object.fromEntries(Object.entries(inst.values).filter(([, v]) => typeof v === "number")) as Record<string, number>;
  try {
    return DOMPurify.sanitize(inst.figures.map((f) => renderFigure(f, scope, inst.funcs)).join(""), {
      ADD_TAGS: ["marker", "clipPath"],
      ADD_ATTR: ["marker-end", "marker-start", "clip-path", "refX", "refY", "orient", "markerWidth", "markerHeight"],
    });
  } catch (e) {
    return `<p class="notice error">Figure error: ${String((e as Error).message).replace(/[<>&]/g, "")}</p>`;
  }
}

export default function DrillFigure({ inst }: { inst: DrillInstance }) {
  if (!inst.figures.length) return null;
  return <div className="drill-figure" dangerouslySetInnerHTML={{ __html: drillFigureHtml(inst) }} />;
}

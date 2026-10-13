// Graphs and diagrams as SVG strings, from a small JSON spec (FigureSpec). Used by math
// drills (the drill's `figure`) and lessons (```plot or ```figure code blocks).
// Any number in a spec may be an expression using the drill's values and functions.

import type { FigureSpec } from "./types";
import { derivAt as deriv1, evalNode, parse, type UserFn } from "./expr";


type Pt = [number | string, number | string];

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
const PALETTE = 6;
let figureCount = 0;

interface Ctx {
  scope: Record<string, number>;
  funcs: Record<string, UserFn>;
}

function num(v: number | string | undefined, ctx: Ctx, fallback?: number): number {
  if (v === undefined) {
    if (fallback === undefined) throw new Error("Missing number in figure");
    return fallback;
  }
  if (typeof v === "number") return v;
  const r = evalNode(parse(v, { implicit: true, funcNames: Object.keys(ctx.funcs), vars: Object.keys(ctx.scope) }), ctx);
  if (!Number.isFinite(r)) throw new Error(`Figure value "${v}" isn't a number`);
  return r;
}

/** A one-variable function from a drill function name or an expression in x. */
function fnOf(f: string, ctx: Ctx): (x: number) => number {
  const uf = ctx.funcs[f.trim()];
  if (uf && uf.params.length === 1) {
    const p = uf.params[0];
    return (x) => evalNode(uf.body, { scope: { ...ctx.scope, [p]: x }, funcs: ctx.funcs });
  }
  const node = parse(f, { implicit: true, funcNames: Object.keys(ctx.funcs), vars: [...Object.keys(ctx.scope), "x"] });
  return (x) => evalNode(node, { scope: { ...ctx.scope, x }, funcs: ctx.funcs });
}

const safe = (f: (x: number) => number) => (x: number) => {
  try {
    const y = f(x);
    return Number.isFinite(y) ? y : NaN;
  } catch {
    return NaN;
  }
};

/** Nice tick step for a range (1, 2, 5 × 10^n). */
function tickStep(span: number, target = 8): number {
  const raw = span / target;
  const p = 10 ** Math.floor(Math.log10(raw));
  const m = raw / p;
  return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * p;
}

const fmtTick = (v: number) => String(Number(v.toPrecision(6)));

export function renderFigure(spec: FigureSpec, scope: Record<string, number> = {}, funcs: Record<string, UserFn> = {}): string {
  const ctx: Ctx = { scope, funcs };
  const isPlot = spec.type !== "shape";
  const W = spec.width ?? 420;

  // Ranges: given, or (shapes) fitted around every coordinate.
  let [x0, x1] = spec.x ? [num(spec.x[0], ctx), num(spec.x[1], ctx)] : [-10, 10];
  let [y0, y1] = spec.y ? [num(spec.y[0], ctx), num(spec.y[1], ctx)] : [-10, 10];
  if (!isPlot && (!spec.x || !spec.y)) {
    const pts: [number, number][] = [];
    const add = (p: Pt) => pts.push([num(p[0], ctx), num(p[1], ctx)]);
    spec.points?.forEach((p) => add(Array.isArray(p) ? p : p.at));
    spec.segments?.forEach((s) => (add(s.from), add(s.to)));
    spec.polygons?.forEach((g) => g.points.forEach(add));
    spec.labels?.forEach((l) => add(l.at));
    spec.circles?.forEach((c) => {
      const [cx, cy, r] = [num(c.center[0], ctx), num(c.center[1], ctx), num(c.r, ctx)];
      pts.push([cx - r, cy - r], [cx + r, cy + r]);
    });
    if (pts.length) {
      const xs = pts.map((p) => p[0]);
      const ys = pts.map((p) => p[1]);
      const pad = 0.12 * Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys), 1);
      if (!spec.x) [x0, x1] = [Math.min(...xs) - pad, Math.max(...xs) + pad];
      if (!spec.y) [y0, y1] = [Math.min(...ys) - pad, Math.max(...ys) + pad];
    }
  }
  if (!(x1 > x0) || !(y1 > y0)) throw new Error("Figure ranges must go from low to high");
  // Shapes keep true proportions; plots use a 4:3 frame.
  const H = isPlot ? Math.round(W * 0.75) : Math.round(Math.min(W * 1.2, (W * (y1 - y0)) / (x1 - x0)));
  const pad = isPlot ? 28 : 16;
  const sx = (x: number) => pad + ((x - x0) / (x1 - x0)) * (W - 2 * pad);
  const sy = (y: number) => H - pad - ((y - y0) / (y1 - y0)) * (H - 2 * pad);
  const P = (p: Pt) => [sx(num(p[0], ctx)), sy(num(p[1], ctx))] as const;
  const out: string[] = [];
  const cls = (base: string, color?: string, i = 0) => `${base} c${color ? "" : i % PALETTE}`;
  // Shapes and lines are drawn in ink unless a color is given; curves cycle the palette.
  const ink = (base: string) => base;
  const id = `fig${++figureCount}`;
  const clip = isPlot ? ` clip-path="url(#${id}-clip)"` : "";
  const sty = (color?: string) => (color ? ` style="stroke:${esc(color)};fill:${esc(color)}"` : "");

  out.push(
    `<defs><marker id="${id}-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="fig-arrowhead"/></marker>` +
      `<clipPath id="${id}-clip"><rect x="${sx(x0)}" y="${sy(y1)}" width="${sx(x1) - sx(x0)}" height="${sy(y0) - sy(y1)}"/></clipPath></defs>`,
  );

  if (isPlot && spec.grid !== false) {
    const tx = tickStep(x1 - x0);
    const ty = tickStep(y1 - y0);
    for (let v = Math.ceil(x0 / tx) * tx; v <= x1 + 1e-9; v += tx)
      out.push(`<line class="fig-grid" x1="${sx(v)}" y1="${sy(y0)}" x2="${sx(v)}" y2="${sy(y1)}"/>`);
    for (let v = Math.ceil(y0 / ty) * ty; v <= y1 + 1e-9; v += ty)
      out.push(`<line class="fig-grid" x1="${sx(x0)}" y1="${sy(v)}" x2="${sx(x1)}" y2="${sy(v)}"/>`);
    // Axes, at zero when visible, else along the edge.
    const ax = y0 <= 0 && y1 >= 0 ? 0 : y0;
    const ay = x0 <= 0 && x1 >= 0 ? 0 : x0;
    out.push(`<line class="fig-axis" x1="${sx(x0)}" y1="${sy(ax)}" x2="${sx(x1)}" y2="${sy(ax)}"/>`);
    out.push(`<line class="fig-axis" x1="${sx(ay)}" y1="${sy(y0)}" x2="${sx(ay)}" y2="${sy(y1)}"/>`);
    for (let v = Math.ceil(x0 / tx) * tx; v <= x1 + 1e-9; v += tx)
      if (Math.abs(v) > 1e-9) out.push(`<text class="fig-tick" x="${sx(v)}" y="${sy(ax) + 13}" text-anchor="middle">${fmtTick(v)}</text>`);
    for (let v = Math.ceil(y0 / ty) * ty; v <= y1 + 1e-9; v += ty)
      if (Math.abs(v) > 1e-9) out.push(`<text class="fig-tick" x="${sx(ay) - 5}" y="${sy(v) + 4}" text-anchor="end">${fmtTick(v)}</text>`);
    out.push(`<text class="fig-tick" x="${sx(x1) - 4}" y="${sy(ax) - 6}" text-anchor="end">x</text>`);
    out.push(`<text class="fig-tick" x="${sx(ay) + 6}" y="${sy(y1) + 12}">y</text>`);
  }

  // Shaded areas first so curves draw on top.
  spec.shade?.forEach((s, i) => {
    const f = safe(fnOf(s.f, ctx));
    const g = s.g ? safe(fnOf(s.g, ctx)) : () => 0;
    const a = num(s.from, ctx);
    const b = num(s.to, ctx);
    const n = 120;
    const top: string[] = [];
    const bot: string[] = [];
    for (let k = 0; k <= n; k++) {
      const x = a + ((b - a) * k) / n;
      const fy = f(x);
      const gy = g(x);
      if (Number.isNaN(fy) || Number.isNaN(gy)) continue;
      top.push(`${sx(x)},${sy(Math.max(y0, Math.min(y1, fy)))}`);
      bot.unshift(`${sx(x)},${sy(Math.max(y0, Math.min(y1, gy)))}`);
    }
    out.push(`<polygon${clip} class="${cls("fig-shade", s.color, i)}"${sty(s.color)} points="${[...top, ...bot].join(" ")}"/>`);
  });

  spec.functions?.forEach((fs, i) => {
    const def = typeof fs === "string" ? { f: fs } : fs;
    const f = safe(fnOf(def.f, ctx));
    const a = def.from !== undefined ? num(def.from, ctx) : x0;
    const b = def.to !== undefined ? num(def.to, ctx) : x1;
    const n = 600;
    const span = y1 - y0;
    let d = "";
    let prev: number | null = null;
    for (let k = 0; k <= n; k++) {
      const x = a + ((b - a) * k) / n;
      const y = f(x);
      // Break the line off-screen and across jumps (asymptotes).
      if (Number.isNaN(y) || y < y0 - 2 * span || y > y1 + 2 * span || (prev !== null && Math.abs(y - prev) > span)) {
        prev = Number.isNaN(y) ? null : y;
        if (!Number.isNaN(y) && y >= y0 - 2 * span && y <= y1 + 2 * span) d += `M${sx(x)},${sy(y)}`;
        continue;
      }
      d += `${prev === null ? "M" : "L"}${sx(x).toFixed(1)},${sy(y).toFixed(1)}`;
      prev = y;
    }
    out.push(`<path${clip} class="${cls("fig-curve", def.color, i)}${def.dashed ? " dashed" : ""}"${def.color ? ` style="stroke:${esc(def.color)}"` : ""} d="${d}"/>`);
    if (def.label) {
      // Label near the right end of the visible curve.
      for (let k = n; k >= 0; k--) {
        const x = a + ((b - a) * k) / n;
        const y = f(x);
        if (!Number.isNaN(y) && y >= y0 && y <= y1) {
          out.push(`<text class="${cls("fig-label", def.color, i)} fig-curve-label" x="${sx(x) - 4}" y="${sy(y) - 6}" text-anchor="end">${esc(def.label)}</text>`);
          break;
        }
      }
    }
  });

  spec.tangents?.forEach((t, i) => {
    const f = safe(fnOf(t.f, ctx));
    const a = num(t.at, ctx);
    const m = deriv1(f, a);
    const y = (x: number) => f(a) + m * (x - a);
    out.push(`<line${clip} class="${cls("fig-curve", t.color, i + 3)} dashed"${t.color ? ` style="stroke:${esc(t.color)}"` : ""} x1="${sx(x0)}" y1="${sy(y(x0))}" x2="${sx(x1)}" y2="${sy(y(x1))}"/>`);
  });

  spec.polygons?.forEach((g, i) => {
    const pts = g.points.map((p) => P(p).join(",")).join(" ");
    out.push(`<polygon class="${g.color || g.fill ? cls(g.fill ? "fig-poly filled" : "fig-poly", g.color, i) : ink("fig-poly")}"${sty(g.color)} points="${pts}"/>`);
  });

  spec.circles?.forEach((c, i) => {
    const [cx, cy] = P(c.center);
    const r = Math.abs(sx(num(c.r, ctx)) - sx(0));
    out.push(`<circle class="${c.color || c.fill ? cls(c.fill ? "fig-poly filled" : "fig-poly", c.color, i) : ink("fig-poly")}"${sty(c.color)} cx="${cx}" cy="${cy}" r="${r}"/>`);
  });

  spec.rightAngles?.forEach(([v, a, b]) => {
    const [vx, vy] = P(v);
    const unit = (p: Pt) => {
      const [px, py] = P(p);
      const len = Math.hypot(px - vx, py - vy) || 1;
      return [(px - vx) / len, (py - vy) / len];
    };
    const [ux, uy] = unit(a);
    const [wx, wy] = unit(b);
    const s = 10;
    out.push(
      `<path class="fig-poly" d="M${vx + ux * s},${vy + uy * s} L${vx + (ux + wx) * s},${vy + (uy + wy) * s} L${vx + wx * s},${vy + wy * s}"/>`,
    );
  });

  spec.segments?.forEach((s) => {
    const [ax, ay] = P(s.from);
    const [bx, by] = P(s.to);
    out.push(
      `<line class="fig-seg${s.dashed ? " dashed" : ""}"${s.color ? ` style="stroke:${esc(s.color)}"` : ""} x1="${ax}" y1="${ay}" x2="${bx}" y2="${by}"${s.arrow ? ` marker-end="url(#${id}-arrow)"` : ""}/>`,
    );
    if (s.label) {
      // Label at the midpoint, nudged off the line.
      const mx = (ax + bx) / 2;
      const my = (ay + by) / 2;
      const len = Math.hypot(bx - ax, by - ay) || 1;
      const nx = (-(by - ay) / len) * 12;
      const ny = ((bx - ax) / len) * 12;
      out.push(`<text class="fig-label" x="${mx + nx}" y="${my + ny + 4}" text-anchor="middle">${esc(s.label)}</text>`);
    }
  });

  spec.points?.forEach((p, i) => {
    const def = Array.isArray(p) ? { at: p } : p;
    const [px, py] = P(def.at);
    out.push(`<circle class="${cls(def.open ? "fig-pt open" : "fig-pt", def.color, i)}"${sty(def.color)} cx="${px}" cy="${py}" r="4"/>`);
    if (def.label) out.push(`<text class="fig-label" x="${px + 7}" y="${py - 7}">${esc(def.label)}</text>`);
  });

  spec.labels?.forEach((l) => {
    const [lx, ly] = P(l.at);
    out.push(`<text class="fig-label" x="${lx}" y="${ly}" text-anchor="middle">${esc(l.text)}</text>`);
  });

  const svg = `<svg class="figure-svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(spec.caption ?? (isPlot ? "Graph" : "Diagram"))}">${out.join("")}</svg>`;
  return `<figure class="figure">${svg}${spec.caption ? `<figcaption>${esc(spec.caption)}</figcaption>` : ""}</figure>`;
}

/** Fill {placeholders} in a figure's text fields (labels, captions) using the drill's filler. */
export function fillFigureText(spec: FigureSpec, fill: (s: string) => string): FigureSpec {
  return JSON.parse(
    JSON.stringify(spec, (k, v) => (typeof v === "string" && ["label", "text", "caption"].includes(k) ? fill(v) : v)),
  ) as FigureSpec;
}

/** For Markdown: render ```plot / ```figure JSON blocks as SVG, slotted back in after Markdown. */
export function protectFigures(md: string, scope: Record<string, number> = {}): { text: string; restore: (html: string) => string } {
  const rendered: string[] = [];
  const text = md.replace(/```(plot|figure|shape)\s*\n([\s\S]*?)```/g, (_m, kind: string, body: string) => {
    let html: string;
    try {
      const spec = JSON.parse(body) as FigureSpec;
      if (!spec.type) spec.type = kind === "shape" ? "shape" : "plot";
      html = renderFigure(spec, scope);
    } catch (e) {
      html = `<p class="notice error">Figure error: ${esc((e as Error).message)}</p>`;
    }
    rendered.push(html);
    return `\n\nXFIGX${rendered.length - 1}XFIGX\n\n`;
  });
  if (!rendered.length) return { text: md, restore: (h) => h };
  return {
    text,
    restore: (html) =>
      html
        .replace(/<p>XFIGX(\d+)XFIGX<\/p>/g, (_m, n) => rendered[Number(n)])
        .replace(/XFIGX(\d+)XFIGX/g, (_m, n) => rendered[Number(n)]),
  };
}

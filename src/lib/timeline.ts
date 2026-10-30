import { escapeHtml, unwrap } from "./blockUtil";
import { parseTimeline, yearLabel, type TimelineSpec } from "./timelineSpec";
export * from "./timelineSpec";

const r3 = (n: number) => Math.round(n * 1000) / 1000;

export function renderTimeline(body: string, md: (src: string) => string, key: string): string {
  const spec = parseTimeline(body);
  const id = `tl-${key}`;
  const cat = (c?: string) => (c ? ` k${spec.cats.indexOf(c) % 6}` : "");
  const item = (cls: string, x: TimelineSpec["events"][number]) =>
    `<li class="${cls}${cat(x.cat)}${x.span.b ? " is-range" : ""}" data-a="${r3(x.span.a.y)}"${x.span.b ? ` data-b="${r3(x.span.b.y)}"` : ""}>` +
    `<span class="tl-date">${escapeHtml(x.when)}</span> <span class="tl-text">${unwrap(md(x.text))}</span>` +
    (x.cat ? ` <span class="tl-cat">(${escapeHtml(x.cat)})</span>` : "") +
    `</li>`;
  const eras = spec.eras.length ? `<ol class="tl-eras" aria-label="Periods">${spec.eras.map((e) => item("tl-era", e)).join("")}</ol>` : "";
  const events = spec.events.length ? `<ol class="tl-events" aria-label="Events, oldest first">${spec.events.map((e) => item("tl-ev", e)).join("")}</ol>` : "";
  const key2 = spec.cats.length
    ? `<ul class="tl-key" aria-label="Key">${spec.cats.map((c, i) => `<li><span class="tl-swatch k${i % 6}" aria-hidden="true"></span>${escapeHtml(c)}</li>`).join("")}</ul>`
    : "";
  return (
    `<figure class="tl" aria-labelledby="${id}-t">` +
    `<p class="tl-head" id="${id}-t"><span class="tl-kicker">Timeline</span>${spec.title ? `<span class="tl-title">${unwrap(md(spec.title))}</span>` : ""}</p>` +
    `<div class="tl-view">${eras}${events}</div>` +
    key2 +
    (spec.caption ? `<figcaption class="tl-caption">${md(spec.caption)}</figcaption>` : "") +
    `</figure>`
  );
}


// --- Layout (browser only) -----------------------------------------------------------

/** Nice tick step for a span of years. */
function tickStep(span: number, target: number): number {
  const raw = span / target;
  const p = 10 ** Math.floor(Math.log10(raw));
  return [1, 2, 5, 10].map((m) => m * p).find((s) => s >= raw) ?? raw;
}

const ZOOMS = [1, 1.5, 2.25, 3.5, 5, 8, 12];

/**
 * Make the timelines inside `root` interactive: horizontal with zoom buttons when there's room
 * (at least 520px), the plain list otherwise. Returns a cleanup function.
 */
export function hydrateTimelines(root: HTMLElement): () => void {
  const figs = [...root.querySelectorAll<HTMLElement>("figure.tl")];
  const cleanups = figs.map(hydrateOne);
  return () => cleanups.forEach((c) => c());
}

function hydrateOne(fig: HTMLElement): () => void {
  const view = fig.querySelector<HTMLElement>(".tl-view");
  if (!view || fig.dataset.live) return () => {};
  fig.dataset.live = "1";
  const items = [...view.querySelectorAll<HTMLElement>("li[data-a]")];
  const ys = items.flatMap((li) => [Number(li.dataset.a), Number(li.dataset.b ?? li.dataset.a)]);
  let lo = Math.min(...ys), hi = Math.max(...ys);
  const pad = Math.max((hi - lo) * 0.04, 0.5);
  lo -= pad;
  hi += pad;
  const bceMode = lo < 1;
  let zi = 0;

  const tools = document.createElement("div");
  tools.className = "tl-tools";
  tools.setAttribute("role", "group");
  tools.setAttribute("aria-label", "Zoom the timeline");
  const mk = (text: string, label: string, fn: () => void) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "btn sm ghost";
    b.textContent = text;
    b.setAttribute("aria-label", label);
    b.addEventListener("click", fn);
    tools.append(b);
    return b;
  };
  const zin = mk("+", "Zoom in", () => setZoom(zi + 1));
  const zout = mk("−", "Zoom out", () => setZoom(zi - 1));
  const fit = mk("Fit", "Show the whole timeline", () => setZoom(0));
  const track = document.createElement("div");
  track.className = "tl-track";
  const axis = document.createElement("div");
  axis.className = "tl-axis";
  axis.setAttribute("aria-hidden", "true");

  let live = false;
  const setLive = (on: boolean) => {
    if (on === live) return;
    live = on;
    fig.classList.toggle("tl-live", on);
    if (on) {
      fig.insertBefore(tools, view);
      while (view.firstChild) track.append(view.firstChild);
      track.prepend(axis);
      view.append(track);
      view.tabIndex = 0;
      view.setAttribute("role", "group");
      view.setAttribute("aria-label", "Timeline (scroll sideways to see all of it)");
    } else {
      tools.remove();
      axis.remove();
      while (track.firstChild) view.append(track.firstChild);
      track.remove();
      view.removeAttribute("tabindex");
      view.removeAttribute("role");
      view.removeAttribute("aria-label");
      items.forEach((li) => li.removeAttribute("style"));
    }
  };

  const layout = () => {
    setLive(fig.clientWidth >= 520);
    if (!live) return;
    const width = view.clientWidth * ZOOMS[zi];
    track.style.width = `${width}px`;
    const x = (y: number) => ((y - lo) / (hi - lo)) * width;
    // Axis ticks.
    const step = tickStep(hi - lo, Math.max(3, Math.round(width / 120)));
    axis.textContent = "";
    // Ticks on round historical years (500 BCE, not astronomical -500 = 501 BCE); there's no year 0.
    const hist = (a: number) => (a <= 0 && a > -100000 ? a - 1 : a);
    for (let d = Math.ceil(hist(lo) / step) * step; d <= hist(hi); d += step) {
      if (d === 0 && bceMode && hi > -100000) continue;
      const t = d < 0 && d > -100000 ? d + 1 : d;
      // Labels too close to an end would be cut off.
      if (x(t) < 36 || x(t) > width - 36) continue;
      const tick = document.createElement("span");
      tick.className = "tl-tick";
      tick.style.left = `${x(t)}px`;
      tick.textContent = yearLabel(t, bceMode);
      axis.append(tick);
    }
    // Eras: one row of bands.
    for (const li of items.filter((l) => l.classList.contains("tl-era"))) {
      const a = x(Number(li.dataset.a)), b = x(Number(li.dataset.b ?? li.dataset.a));
      li.style.left = `${a}px`;
      li.style.width = `${Math.max(4, b - a)}px`;
    }
    // Events: greedy lanes so labels never overlap. A label that would run past the right end
    // hangs to the left of its date instead. Each lane is as tall as its tallest label.
    const lanes: [number, number][][] = [];
    const laneOf: { li: HTMLElement; lane: number }[] = [];
    for (const li of items.filter((l) => l.classList.contains("tl-ev"))) {
      const a = x(Number(li.dataset.a));
      const b = li.dataset.b ? x(Number(li.dataset.b)) : a;
      li.style.left = `${a}px`;
      li.style.setProperty("--span", `${Math.max(0, b - a)}px`);
      li.style.maxWidth = `${Math.min(240, Math.max(150, width - 8))}px`;
      li.classList.remove("is-flip");
      const w = li.offsetWidth + 12;
      const flip = a + w > width && b - a < w && a - w >= 0;
      li.classList.toggle("is-flip", flip);
      const span: [number, number] = flip ? [a - w, a + 4] : [a - 4, a + Math.max(w, b - a + 12)];
      let lane = lanes.findIndex((occ) => occ.every(([s, e]) => e <= span[0] || s >= span[1]));
      if (lane < 0) lane = lanes.push([]) - 1;
      lanes[lane].push(span);
      laneOf.push({ li, lane });
      li.style.setProperty("--lane", String(lane));
    }
    const heights = lanes.map((_, l) => Math.max(36, ...laneOf.filter((o) => o.lane === l).map((o) => o.li.offsetHeight)) + 12);
    const tops = heights.map((_, l) => 10 + heights.slice(0, l).reduce((s, h) => s + h, 0));
    for (const { li, lane } of laneOf) li.style.setProperty("--y", `${tops[lane]}px`);
    track.style.setProperty("--events-h", `${10 + heights.reduce((s, h) => s + h, 0)}px`);
    zin.disabled = zi >= ZOOMS.length - 1;
    zout.disabled = fit.disabled = zi === 0;
  };

  const setZoom = (n: number) => {
    const next = Math.max(0, Math.min(ZOOMS.length - 1, n));
    if (next === zi) return;
    // Keep the middle of what's shown in the middle.
    const mid = (view.scrollLeft + view.clientWidth / 2) / Math.max(1, track.offsetWidth);
    zi = next;
    layout();
    view.scrollLeft = mid * track.offsetWidth - view.clientWidth / 2;
  };

  layout();
  let w = fig.clientWidth;
  const ro = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(() => {
    if (Math.abs(fig.clientWidth - w) < 2) return;
    w = fig.clientWidth;
    layout();
  });
  ro?.observe(fig);
  // Labels change size when the fonts arrive.
  let alive = true;
  document.fonts?.ready.then(() => alive && layout());
  return () => {
    // Back to the plain list, so hydrating again (same page, Strict Mode) starts clean.
    alive = false;
    ro?.disconnect();
    setLive(false);
    delete fig.dataset.live;
  };
}

// Interactive maps: lesson ```map blocks (MapFigure) and map questions (MapFind, MapMarks).
// Lazy-loaded with d3-geo; the base map's shapes load on top of that (lib/mapGeo.ts).
//
// Keyboard: the map is one Tab stop. Arrow keys move to the nearest place in that direction,
// Home/End jump to the first/last, Enter or Space picks (map questions). Zoom with the + / −
// buttons (or the + and - keys); drag to pan when zoomed in; focus moving to a place out of
// view pans to it. Names show on hover/focus in lessons, but never in questions before
// checking (that would give the answer away).

import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { Chosen, Question } from "../lib/types";
import { parseMapSpec, type MapSpec } from "../lib/mapSpec";
import { buildMap, sortedNames, type BuiltMap } from "../lib/mapGeo";
import { placeKey, samePlace } from "../lib/mapNames";

export function useBuiltMap(spec: MapSpec | null): { map?: BuiltMap; error?: string } {
  const [state, setState] = useState<{ map?: BuiltMap; error?: string }>({});
  useEffect(() => {
    if (!spec) return;
    let alive = true;
    buildMap(spec).then(
      (map) => alive && setState({ map }),
      (e) => alive && setState({ error: String((e as Error).message ?? e) }),
    );
    return () => {
      alive = false;
    };
  }, [spec]);
  return state;
}

type Item = { kind: "region" | "point"; name: string; x: number; y: number; i: number };

interface CanvasProps {
  map: BuiltMap;
  spec: MapSpec;
  title: string;
  mode: "view" | "find" | "label";
  picked?: string[];
  onPick?: (name: string) => void;
  /** Numbered markers (label questions). */
  marks?: string[];
  /** After checking a find question: the right places and the wrong picks. */
  right?: string[];
  wrong?: string[];
  disabled?: boolean;
  /** Names may be shown (lessons, or questions after checking). */
  names: boolean;
}

const sameAny = (spec: MapSpec, list: string[] | undefined, name: string) => !!list?.some((n) => samePlace(spec.base, n, name));

export function MapCanvas({ map, spec, title, mode, picked, onPick, marks, right, wrong, disabled, names }: CanvasProps) {
  const uid = useId().replace(/:/g, "");
  const [vb, setVb] = useState<[number, number, number, number]>(map.view);
  const [px, setPx] = useState(600);
  const [active, setActive] = useState(0);
  const [hover, setHover] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);
  const svg = useRef<SVGSVGElement>(null);
  const drag = useRef<{ x: number; y: number; vb: number[]; moved: boolean } | null>(null);
  const moved = useRef(false);

  useEffect(() => setVb(map.view), [map]);
  useEffect(() => {
    const el = svg.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    // The drawing is scaled to fit both ways (max-height can make it narrower than the box).
    const ro = new ResizeObserver(() => setPx(Math.min(el.clientWidth || 600, ((el.clientHeight || 1e6) * map.view[2]) / map.view[3])));
    ro.observe(el);
    return () => ro.disconnect();
  }, [map]);

  // Everything you can move to: regions, then points, in reading order (top to bottom, left to right).
  const items: Item[] = useMemo(() => {
    const regs = map.regions.map((r, i) => ({ kind: "region" as const, name: r.name, x: r.c[0], y: r.c[1], i }));
    const pts = map.points.map((p, i) => ({ kind: "point" as const, name: p.name, x: p.x, y: p.y, i }));
    return [...regs, ...pts].sort((a, b) => Math.round(a.y / 40) - Math.round(b.y / 40) || a.x - b.x);
  }, [map]);

  // Start on the first marked place in lessons, so Tab lands somewhere meaningful.
  useEffect(() => {
    const first = items.findIndex((it) => (it.kind === "region" ? map.regions[it.i].group !== undefined : true));
    setActive(mode === "view" && first >= 0 ? first : 0);
  }, [items, map, mode]);

  const upp = vb[2] / Math.max(1, px); // map units per screen pixel
  const full = map.width * 1.05;
  const zoom = (f: number, cx = vb[0] + vb[2] / 2, cy = vb[1] + vb[3] / 2) => {
    const w = Math.min(full, Math.max(map.width / 40, vb[2] * f));
    const h = (w / vb[2]) * vb[3];
    setVb([cx - w / 2, cy - h / 2, w, h]);
  };
  const zoomed = vb[2] < map.view[2] * 0.98;

  const focusItem = (n: number) => {
    setActive(n);
    const it = items[n];
    if (!it) return;
    // Keep the focused place in view.
    if (it.x < vb[0] || it.x > vb[0] + vb[2] || it.y < vb[1] || it.y > vb[1] + vb[3]) setVb([it.x - vb[2] / 2, it.y - vb[3] / 2, vb[2], vb[3]]);
    requestAnimationFrame(() => svg.current?.querySelector<SVGElement>(`[data-k="${n}"]`)?.focus());
  };

  function onKey(e: React.KeyboardEvent) {
    const k = e.key;
    const dirs: Record<string, [number, number]> = { ArrowRight: [1, 0], ArrowLeft: [-1, 0], ArrowDown: [0, 1], ArrowUp: [0, -1] };
    const cur = items[active];
    if (dirs[k] && cur) {
      const [dx, dy] = dirs[k];
      let best = -1;
      let score = Infinity;
      items.forEach((it, n) => {
        const ax = it.x - cur.x, ay = it.y - cur.y;
        const along = ax * dx + ay * dy;
        const across = Math.abs(ax * dy - ay * dx);
        if (along <= 1 || across > along * 2) return;
        const s = along + across * 2;
        if (s < score) [score, best] = [s, n];
      });
      if (best >= 0) focusItem(best);
    } else if (k === "Home") focusItem(0);
    else if (k === "End") focusItem(items.length - 1);
    else if ((k === "Enter" || k === " ") && mode === "find" && cur && !disabled) onPick?.(cur.name);
    else if (k === "+" || k === "=") zoom(0.7);
    else if (k === "-" || k === "_") zoom(1 / 0.7);
    else return;
    // Arrow keys, Enter and letters would otherwise also drive the quiz screen.
    e.preventDefault();
    e.stopPropagation();
  }

  function down(e: React.PointerEvent) {
    moved.current = false;
    if (!zoomed) return;
    drag.current = { x: e.clientX, y: e.clientY, vb: vb.slice(), moved: false };
  }
  function move(e: React.PointerEvent) {
    const d = drag.current;
    if (!d) return;
    const dx = (e.clientX - d.x) * upp, dy = (e.clientY - d.y) * upp;
    if (!d.moved && Math.hypot(e.clientX - d.x, e.clientY - d.y) < 5) return;
    if (!d.moved) (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
    d.moved = moved.current = true;
    setVb([d.vb[0] - dx, d.vb[1] - dy, d.vb[2], d.vb[3]]);
  }
  const up = () => (drag.current = null);

  const label = (name: string, i: number) => (names ? name : `Place ${i + 1}`);
  const pick = (name: string) => {
    if (moved.current || disabled || mode !== "find") return;
    onPick?.(name);
  };
  const groupClass = (g: number | undefined) => (g === undefined ? "" : g < 0 ? " hi" : ` g${g % 6}`);
  const stateClass = (name: string) =>
    (sameAny(spec, right, name) ? " is-right" : sameAny(spec, wrong, name) ? " is-wrong" : "") + (!right && sameAny(spec, picked, name) ? " is-picked" : "");
  const markAt = (name: string): [number, number] | null => {
    const p = map.points.find((p) => placeKey(p.name) === placeKey(name));
    if (p) return [p.x, p.y];
    const r = map.regions.find((r) => samePlace(spec.base, r.name, name));
    return r ? r.c : null;
  };
  const isMark = (name: string) => !!marks?.some((m) => samePlace(spec.base, m, name));
  const itemIndex = new Map(items.map((it, n) => [`${it.kind}:${it.i}`, n]));
  const shownName = hover ?? (focused ? items[active]?.name : null);
  const describe = (name: string) => {
    const r = map.regions.find((x) => x.name === name);
    const g = r?.group ?? map.points.find((p) => p.name === name)?.group;
    return g !== undefined && g >= 0 && spec.groups[g] ? `${name} (${spec.groups[g]})` : name;
  };
  const role = mode === "find" ? "button" : "img";

  return (
    <div className={`map-canvas mode-${mode}${zoomed ? " is-zoomed" : ""}`}>
      <div className="map-tools" role="group" aria-label="Zoom">
        <button type="button" className="btn sm ghost" onClick={() => zoom(0.7)} aria-label="Zoom in">
          +
        </button>
        <button type="button" className="btn sm ghost" onClick={() => zoom(1 / 0.7)} aria-label="Zoom out" disabled={vb[2] >= full - 1}>
          −
        </button>
        <button type="button" className="btn sm ghost" onClick={() => setVb(map.view)} disabled={vb.join() === map.view.join()}>
          Reset view
        </button>
      </div>
      <svg
        ref={svg}
        className="map-svg"
        viewBox={vb.map((v) => v.toFixed(1)).join(" ")}
        role="group"
        aria-label={`${title}. ${mode === "find" ? "Use the arrow keys to move between places and Enter to pick one." : mode === "view" ? "Use the arrow keys to move between places." : "Numbered places are marked."}`}
        onKeyDown={onKey}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onPointerLeave={() => setHover(null)}
      >
        <defs>
          <marker id={`${uid}-arrow`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse" markerUnits="strokeWidth">
            <path d="M0,0 L10,5 L0,10 z" className="map-arrowhead" />
          </marker>
        </defs>
        <rect className="map-water" x={-map.width} y={-map.height} width={map.width * 3} height={map.height * 3} />
        {map.decor.map((d, i) => (
          <path key={`d${i}`} d={d} className="map-decor" />
        ))}
        {map.regions.map((r, i) => {
          const n = itemIndex.get(`region:${i}`)!;
          const interactive = mode !== "label";
          return (
            <path
              key={r.name + i}
              d={r.d}
              data-k={n}
              className={`rg${groupClass(r.group)}${stateClass(r.name)}${mode === "find" && !disabled ? " is-pickable" : ""}`}
              tabIndex={interactive ? (n === active ? 0 : -1) : undefined}
              role={interactive ? role : undefined}
              aria-label={interactive ? label(r.name, n) : undefined}
              aria-pressed={mode === "find" ? sameAny(spec, picked, r.name) : undefined}
              aria-disabled={mode === "find" && disabled ? true : undefined}
              onFocus={() => setActive(n)}
              onClick={() => pick(r.name)}
              onPointerEnter={() => names && setHover(r.name)}
            />
          );
        })}
        {map.routes.map((r, i) => (
          <path
            key={`r${i}`}
            d={r.d}
            className={`map-route${r.group !== undefined ? ` g${r.group % 6}` : ""}${r.arrow ? "" : " is-line"}`}
            markerEnd={r.arrow ? `url(#${uid}-arrow)` : undefined}
            style={{ strokeWidth: 2.5 * upp }}
          />
        ))}
        {names &&
          spec.showLabels &&
          map.regions
            .filter((r) => spec.showLabels === "all" || r.group !== undefined)
            .map((r) => (
              <text key={`l${r.name}`} x={r.c[0]} y={r.c[1]} className="map-text region-text" style={{ fontSize: 12 * upp, strokeWidth: 3 * upp }} aria-hidden="true">
                {r.name}
              </text>
            ))}
        {map.points.map((p, i) => {
          const n = itemIndex.get(`point:${i}`)!;
          const hidden = isMark(p.name) || (!names && mode !== "view");
          return (
            <g key={`p${i}`} className={`map-point${p.group !== undefined ? ` g${p.group % 6}` : ""}${stateClass(p.name)}`}>
              <circle
                cx={p.x}
                cy={p.y}
                r={(mode === "find" ? 7 : 5) * upp}
                data-k={n}
                tabIndex={mode !== "label" ? (n === active ? 0 : -1) : undefined}
                role={mode !== "label" ? role : undefined}
                aria-label={mode !== "label" ? label(p.name, n) : undefined}
                aria-pressed={mode === "find" ? sameAny(spec, picked, p.name) : undefined}
                className={mode === "find" && !disabled ? "is-pickable" : undefined}
                style={{ strokeWidth: 1.5 * upp }}
                onFocus={() => setActive(n)}
                onClick={() => pick(p.name)}
                onPointerEnter={() => names && setHover(p.name)}
              />
              {!hidden && (
                <text x={p.x + 8 * upp} y={p.y + 4 * upp} className="map-text" style={{ fontSize: 13 * upp, strokeWidth: 3 * upp }} aria-hidden="true">
                  {p.name}
                </text>
              )}
            </g>
          );
        })}
        {map.labels.map((l, i) => (
          <text key={`t${i}`} x={l.x} y={l.y} className="map-text free-text" style={{ fontSize: 13 * upp, strokeWidth: 3 * upp }} aria-hidden="true">
            {l.text}
          </text>
        ))}
        {marks?.map((m, i) => {
          const at = markAt(m);
          if (!at) return null;
          return (
            <g key={`m${i}`} className="map-mark" aria-hidden="true">
              <circle cx={at[0]} cy={at[1]} r={11 * upp} style={{ strokeWidth: 2 * upp }} />
              <text x={at[0]} y={at[1] + 4.5 * upp} style={{ fontSize: 13 * upp }}>
                {i + 1}
              </text>
            </g>
          );
        })}
      </svg>
      {mode === "view" && (
        <p className="map-info small" aria-hidden="true">
          {shownName ? describe(shownName) : "Point at a place or use the arrow keys to see its name."}
        </p>
      )}
    </div>
  );
}

/** A lesson's ```map block (mounted into its static HTML by LessonWidgets). */
export function MapFigure({ source, title }: { source: string; title: string }) {
  const spec = useMemo(() => parseMapSpec(source), [source]);
  const { map, error } = useBuiltMap(spec);
  if (error) return <p className="small muted">The map couldn't be drawn: {error}</p>;
  if (!map) return <p className="map-wait small muted">Loading the map…</p>;
  return <MapCanvas map={map} spec={spec} title={`Map: ${title}`} mode="view" names />;
}

/** Map questions, "find" kind: pick the place(s) named in the question on the map or from a list. */
export function MapFind({
  q,
  chosen,
  onChange,
  reveal,
  review,
  disabled,
}: {
  q: Question;
  chosen: Chosen;
  onChange?: (next: Chosen) => void;
  reveal?: boolean;
  review?: boolean;
  disabled?: boolean;
}) {
  const spec = useMemo(() => parseMapSpec(q.map ?? ""), [q.map]);
  const { map, error } = useBuiltMap(spec);
  const [listOpen, setListOpen] = useState(false);
  const targets = q.targets ?? [];
  const multi = targets.length > 1;
  const picks = chosen.filter((c): c is string => typeof c === "string" && c !== "");
  const off = disabled || reveal || review;
  const toggle = (name: string) => {
    if (off) return;
    const has = picks.some((p) => samePlace(spec.base, p, name));
    const next = multi ? (has ? picks.filter((p) => !samePlace(spec.base, p, name)) : [...picks, name]) : has ? [] : [name];
    onChange?.(next);
  };
  const names = useMemo(() => (map ? [...sortedNames(map), ...map.points.map((p) => p.name).sort((a, b) => a.localeCompare(b))] : []), [map]);
  const listId = useId();
  if (error) return <p className="small muted">The map couldn't be drawn: {error}</p>;
  const right = reveal || review ? targets : undefined;
  const wrong = reveal || review ? picks.filter((p) => !targets.some((t) => samePlace(spec.base, t, p))) : undefined;
  return (
    <div className="q-parts map-q">
      {!off && (
        <p className="q-hint">
          {multi ? `Pick ${targets.length} places on the map (pick again to undo).` : "Pick the place on the map."}{" "}
          <button type="button" className="btn sm ghost" aria-expanded={listOpen} aria-controls={listId} onClick={() => setListOpen((o) => !o)}>
            {listOpen ? "Hide the list" : "Choose from a list instead"}
          </button>
        </p>
      )}
      {!off && listOpen && map && (
        <div id={listId} className="map-list">
          {multi ? (
            <fieldset className="map-checks">
              <legend className="small">Places on the map</legend>
              {names.map((n) => (
                <label key={n} className="check small">
                  <input type="checkbox" checked={picks.some((p) => samePlace(spec.base, p, n))} onChange={() => toggle(n)} />
                  {n}
                </label>
              ))}
            </fieldset>
          ) : (
            <label className="field">
              <span>Your answer</span>
              <select className="input" value={picks[0] && names.find((n) => samePlace(spec.base, n, picks[0])) ? names.find((n) => samePlace(spec.base, n, picks[0])) : ""} onChange={(e) => onChange?.(e.target.value ? [e.target.value] : [])}>
                <option value="">Choose…</option>
                {names.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
      )}
      {map ? (
        <MapCanvas map={map} spec={spec} title="Map question" mode="find" picked={picks} onPick={toggle} right={right} wrong={wrong} disabled={off} names={!!(reveal || review)} />
      ) : (
        <p className="map-wait small muted">Loading the map…</p>
      )}
      {!off && (
        <p className="small muted" aria-live="polite">
          {picks.length ? `${picks.length} place${picks.length === 1 ? "" : "s"} picked.` : "Nothing picked yet."}
        </p>
      )}
      {(reveal || review) && (
        <ul className="map-marks-list">
          {targets.map((t) => {
            const ok = picks.some((p) => samePlace(spec.base, p, t));
            return (
              <li key={t} className={ok ? "is-right" : "is-wrong"}>
                {t}: {ok ? <span className="part-mark ok">✓ Right</span> : <span className="part-mark bad">✗ Not picked</span>}
              </li>
            );
          })}
          {wrong?.map((w) => (
            <li key={`w${w}`} className="is-wrong">
              {w}: <span className="part-mark bad">✗ Not one of the answers</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Map questions, "label" kind: the map with numbered markers (the answer rows are in QuestionBody). */
export function MapMarks({ q, reveal }: { q: Question; reveal?: boolean }) {
  const spec = useMemo(() => parseMapSpec(q.map ?? ""), [q.map]);
  const { map, error } = useBuiltMap(spec);
  if (error) return <p className="small muted">The map couldn't be drawn: {error}</p>;
  if (!map) return <p className="map-wait small muted">Loading the map…</p>;
  return <MapCanvas map={map} spec={spec} title="Map with numbered places" mode="label" marks={q.marks} names={!!reveal} />;
}

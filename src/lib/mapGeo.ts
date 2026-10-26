// Map geometry: loads a base map's shapes, projects them with d3-geo and works out what the
// map should show. Loaded lazily (with d3-geo and the shapes) only when a map is on screen;
// it also runs in Node for the course checker.
//
// Base maps (both public domain data, packaged under the ISC license):
// - world: Natural Earth 1:110m countries (world-atlas), Equal Earth projection. Antarctica is
//   left off unless a map mentions it, so the inhabited world gets the room.
// - us: US Census 1:10m states (us-atlas), Albers USA (Alaska and Hawaii as insets).
// Each base's TopoJSON is its own chunk of about 40 KB gzipped.

import { geoAlbersUsa, geoArea, geoEqualEarth, geoIdentity, geoMercator, geoPath, type GeoProjection } from "d3-geo";
import { feature } from "topojson-client";
import type { Feature, FeatureCollection, Geometry, MultiPolygon, Polygon, Position } from "geojson";
import type { Topology } from "topojson-specification";
import { canonicalPlace, placeKey, US_STATES, WORLD_RENAME } from "./mapNames";
import type { Coord, MapSpec } from "./mapSpec";

export interface BuiltRegion {
  name: string;
  d: string;
  /** Label spot: the centroid of the largest piece (France's label sits in France, not in French Guiana). */
  c: [number, number];
  /** Bounds of the main pieces, for fitting the view. */
  box: [number, number, number, number];
  /** Legend group index, -1 = shaded without a group, undefined = not marked. */
  group?: number;
}

export interface BuiltMap {
  width: number;
  height: number;
  regions: BuiltRegion[];
  /** Unnamed shapes from a course-supplied SVG (drawn, not interactive). */
  decor: string[];
  points: { name: string; x: number; y: number; group?: number }[];
  routes: { name: string; d: string; group?: number; arrow: boolean; end: [number, number] }[];
  labels: { text: string; x: number; y: number }[];
  /** The opening view: x, y, width, height in map units. */
  view: [number, number, number, number];
  /** Names the spec uses that aren't on the map, and other problems found while drawing. */
  missing: string[];
  problems: string[];
}

type Box = [number, number, number, number];
const WIDTH = 960;

const cache = new Map<string, Promise<{ name: string; geom: Geometry }[]>>();

async function topo(base: "world" | "us"): Promise<{ name: string; geom: Geometry }[]> {
  if (!cache.has(base))
    cache.set(
      base,
      (async () => {
        if (base === "world") {
          const t = ((await import("world-atlas/countries-110m.json")) as unknown as { default: Topology }).default;
          const fc = feature(t, t.objects.countries) as FeatureCollection<Geometry, { name: string }>;
          return fc.features.map((f) => ({ name: WORLD_RENAME[f.properties.name] ?? f.properties.name, geom: f.geometry }));
        }
        const t = ((await import("us-atlas/states-10m.json")) as unknown as { default: Topology }).default;
        const fc = feature(t, t.objects.states) as FeatureCollection<Geometry, { name: string }>;
        const states = new Set(Object.values(US_STATES));
        return fc.features.filter((f) => states.has(f.properties.name)).map((f) => ({ name: f.properties.name, geom: f.geometry }));
      })(),
    );
  return cache.get(base)!;
}

/** The region names on a built-in base map, for checks (no projection needed). */
export async function baseNames(base: "world" | "us"): Promise<string[]> {
  return (await topo(base)).map((f) => f.name);
}

// --- Course-supplied shapes ------------------------------------------------------

function decodeData(s: string): string {
  const m = /^data:[^,]*?(;base64)?,([\s\S]*)$/.exec(s.trim());
  if (!m) return s;
  if (!m[1]) return decodeURIComponent(m[2]);
  const bin = atob(m[2].replace(/\s+/g, ""));
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
}

/** GeoJSON polygons wound "inside out" (RFC 7946 order) would fill the whole globe in d3; flip them. */
function rewind(g: Geometry): Geometry {
  const fix = (rings: Position[][]): Position[][] => (geoArea({ type: "Polygon", coordinates: rings }) > 2 * Math.PI ? rings.map((r) => r.slice().reverse()) : rings);
  if (g.type === "Polygon") return { ...g, coordinates: fix(g.coordinates) };
  if (g.type === "MultiPolygon") return { ...g, coordinates: g.coordinates.map(fix) };
  if (g.type === "GeometryCollection") return { ...g, geometries: g.geometries.map(rewind) };
  return g;
}

function readGeoJson(text: string, spherical: boolean): { name: string; geom: Geometry }[] {
  const raw = JSON.parse(decodeData(text)) as { type?: string; features?: Feature[]; geometry?: Geometry; properties?: Record<string, unknown>; id?: unknown };
  const feats: Feature[] = raw.type === "FeatureCollection" ? (raw.features ?? []) : raw.type === "Feature" ? [raw as Feature] : [{ type: "Feature", properties: {}, geometry: raw as Geometry }];
  return feats
    .filter((f) => f && f.geometry)
    .map((f, i) => {
      const p = (f.properties ?? {}) as Record<string, unknown>;
      const name = String(p.name ?? p.NAME ?? p.Name ?? f.id ?? "").trim();
      return { name: name || `#${i + 1}`, geom: spherical ? rewind(f.geometry) : f.geometry };
    });
}

interface SvgShapes {
  box: Box;
  named: { name: string; d: string }[];
  decor: string[];
}

const SAFE_D = /^[MmLlHhVvCcSsQqTtAaZz0-9.,\s+eE-]*$/;
const num = (attrs: string, k: string) => {
  const m = new RegExp(`(?:^|\\s)${k}\\s*=\\s*["']\\s*(-?[\\d.]+(?:e-?\\d+)?)`, "i").exec(attrs);
  return m ? Number(m[1]) : NaN;
};
const attr = (attrs: string, k: string) => new RegExp(`(?:^|\\s)${k}\\s*=\\s*(["'])([\\s\\S]*?)\\1`, "i").exec(attrs)?.[2];

/**
 * Shapes from a course-supplied SVG, read as data: only path/polygon/rect/circle/ellipse
 * geometry is taken (never markup, scripts or styles), so nothing in the file runs or shows
 * as-is. A shape with an id, data-name, aria-label or <title> is a named region.
 */
export function readSvg(text: string): SvgShapes {
  const src = decodeData(text);
  const vb = attr(/<svg\b([^>]*)>/i.exec(src)?.[1] ?? "", "viewBox")?.trim().split(/[\s,]+/).map(Number);
  const svgAttrs = /<svg\b([^>]*)>/i.exec(src)?.[1] ?? "";
  const box: Box = vb && vb.length === 4 && vb.every(Number.isFinite) ? [vb[0], vb[1], vb[2], vb[3]] : [0, 0, num(svgAttrs, "width") || 100, num(svgAttrs, "height") || 100];
  const named: SvgShapes["named"] = [];
  const decor: string[] = [];
  const el = /<(path|polygon|polyline|rect|circle|ellipse)\b([^>]*?)(?:\/>|>([\s\S]*?)<\/\1\s*>)/gi;
  for (const m of src.matchAll(el)) {
    const [, tagRaw, attrs, inner] = m;
    const tag = tagRaw.toLowerCase();
    let d = "";
    if (tag === "path") d = attr(attrs, "d") ?? "";
    else if (tag === "polygon" || tag === "polyline") {
      const pts = (attr(attrs, "points") ?? "").trim().split(/[\s,]+/).map(Number);
      if (pts.length >= 4 && pts.every(Number.isFinite)) d = "M" + pts.reduce<string[]>((a, v, i) => (i % 2 ? (a[a.length - 1] += `,${v}`, a) : [...a, String(v)]), []).join("L") + (tag === "polygon" ? "Z" : "");
    } else if (tag === "rect") {
      const [x, y, w, h] = ["x", "y", "width", "height"].map((k) => num(attrs, k) || 0);
      if (w > 0 && h > 0) d = `M${x},${y}h${w}v${h}h${-w}Z`;
    } else {
      const cx = num(attrs, "cx") || 0, cy = num(attrs, "cy") || 0;
      const rx = tag === "circle" ? num(attrs, "r") : num(attrs, "rx");
      const ry = tag === "circle" ? rx : num(attrs, "ry");
      if (rx > 0 && ry > 0) d = `M${cx - rx},${cy}a${rx},${ry} 0 1,0 ${2 * rx},0a${rx},${ry} 0 1,0 ${-2 * rx},0Z`;
    }
    if (!d || !SAFE_D.test(d)) continue;
    const title = inner ? /<title>([\s\S]*?)<\/title>/i.exec(inner)?.[1] : undefined;
    const name = (attr(attrs, "data-name") ?? attr(attrs, "aria-label") ?? title ?? attr(attrs, "id") ?? "").replace(/<[^>]*>/g, "").trim();
    if (name) named.push({ name, d });
    else decor.push(d);
  }
  return { box, named, decor };
}

// --- Building ---------------------------------------------------------------------

function union(boxes: Box[]): Box | null {
  if (!boxes.length) return null;
  return [Math.min(...boxes.map((b) => b[0])), Math.min(...boxes.map((b) => b[1])), Math.max(...boxes.map((b) => b[2])), Math.max(...boxes.map((b) => b[3]))];
}

/** Pad a box and keep a sensible shape and size, so one small state still shows its neighbors. */
function frame(b: Box, full: Box): [number, number, number, number] {
  const fw = full[2] - full[0], fh = full[3] - full[1];
  let [x0, y0, x1, y1] = b;
  let w = Math.max(x1 - x0, fw * 0.12), h = Math.max(y1 - y0, fh * 0.12);
  let cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  w *= 1.16;
  h *= 1.16;
  // Between square and 2.2:1, like the base maps.
  if (w / h > 2.2) h = w / 2.2;
  if (w / h < 1) w = h;
  w = Math.min(w, fw * 1.04);
  h = Math.min(h, fh * 1.04);
  cx = Math.min(Math.max(cx, full[0] + w / 2 - fw * 0.02), full[2] - w / 2 + fw * 0.02);
  cy = Math.min(Math.max(cy, full[1] + h / 2 - fh * 0.02), full[3] - h / 2 + fh * 0.02);
  return [cx - w / 2, cy - h / 2, w, h];
}

export async function buildMap(spec: MapSpec): Promise<BuiltMap> {
  const problems: string[] = [];
  const missing: string[] = [];
  const geographic = !spec.svg && spec.projection !== "plain";
  const mentions = new Set([...spec.regions.flatMap((r) => r.names), ...(spec.view && "places" in spec.view ? spec.view.places : [])].map(placeKey));

  let feats: { name: string; geom: Geometry }[] = [];
  let svg: SvgShapes | undefined;
  if (spec.base === "world" || spec.base === "us") {
    feats = await topo(spec.base);
    if (spec.base === "world" && !mentions.has("antarctica")) feats = feats.filter((f) => f.name !== "Antarctica");
  } else if (spec.geojson) {
    try {
      feats = readGeoJson(spec.geojson, geographic);
    } catch (e) {
      problems.push(`geojson: isn't valid GeoJSON (${(e as Error).message})`);
    }
  } else if (spec.svg) {
    svg = readSvg(spec.svg);
    if (!svg.named.length) problems.push("svg: has no named shapes (give regions an id, data-name or <title>)");
  }

  const fc: FeatureCollection = { type: "FeatureCollection", features: feats.map((f) => ({ type: "Feature", properties: {}, geometry: f.geom })) };
  let project: (c: Coord) => [number, number] | null;
  let path: ReturnType<typeof geoPath> | null = null;
  let height: number;
  if (svg) {
    const [x, y, w, h] = svg.box;
    // Scale the SVG's own units to the common width so point and label sizes match other maps.
    const k = WIDTH / w;
    height = h * k;
    const tx = (v: number) => (v - x) * k, ty = (v: number) => (v - y) * k;
    project = (c) => [tx(c[0]), ty(c[1])];
    svg = {
      box: [0, 0, WIDTH, height],
      named: svg.named.map((s) => ({ name: s.name, d: scaleD(s.d, k, -x * k, -y * k) })),
      decor: svg.decor.map((d) => scaleD(d, k, -x * k, -y * k)),
    };
  } else {
    const kind = spec.projection ?? (spec.base === "us" ? "albers-usa" : spec.base === "world" ? "equal-earth" : "mercator");
    const proj: GeoProjection =
      kind === "albers-usa" ? geoAlbersUsa() : kind === "mercator" ? geoMercator() : kind === "plain" ? (geoIdentity().reflectY(true) as unknown as GeoProjection) : geoEqualEarth();
    if (kind === "equal-earth" && spec.base === "world") proj.fitWidth(WIDTH, { type: "Sphere" });
    else if (feats.length) proj.fitWidth(WIDTH, fc);
    path = geoPath(proj).digits(1);
    const b = path.bounds(kind === "equal-earth" && spec.base === "world" ? { type: "Sphere" } : fc);
    height = Math.max(1, b[1][1] - Math.min(0, b[0][1]));
    project = (c) => {
      const p = proj(kind === "plain" ? [c[0], c[1]] : [c[1], c[0]]);
      return p ? [p[0], p[1]] : null;
    };
  }

  // Regions.
  const regions: BuiltRegion[] = [];
  const wholes: Box[] = [];
  if (svg) {
    for (const s of svg.named) {
      const b = dBox(s.d);
      regions.push({ name: s.name, d: s.d, c: [(b[0] + b[2]) / 2, (b[1] + b[3]) / 2], box: b });
      wholes.push(b);
    }
  } else if (path) {
    for (const f of feats) {
      const d = path(f.geom);
      if (!d) continue;
      const pieces: Polygon[] = f.geom.type === "MultiPolygon" ? (f.geom as MultiPolygon).coordinates.map((c) => ({ type: "Polygon", coordinates: c })) : [f.geom as Polygon];
      const sized = pieces.map((p) => ({ p, a: path!.area(p) })).sort((a, b) => b.a - a.a);
      const main = sized[0]?.p ?? f.geom;
      const big = sized.filter((s) => s.a >= (sized[0]?.a ?? 0) * 0.25).map((s) => path!.bounds(s.p));
      const box = union(big.map((b) => [b[0][0], b[0][1], b[1][0], b[1][1]] as Box)) ?? flat(path.bounds(f.geom));
      const c = path.centroid(main);
      wholes.push(flat(path.bounds(f.geom)));
      regions.push({ name: f.name, d, c: Number.isFinite(c[0]) ? [c[0], c[1]] : [(box[0] + box[2]) / 2, (box[1] + box[3]) / 2], box });
    }
  }
  const byKey = new Map(regions.map((r) => [placeKey(r.name), r]));
  const find = (name: string) => byKey.get(placeKey(canonicalPlace(spec.base, name)));

  spec.regions.forEach((r) => {
    for (const n of r.names) {
      const hit = find(n);
      if (!hit) missing.push(n);
      else hit.group = r.group ? spec.groups.indexOf(r.group) : -1;
    }
  });

  const gi = (g?: string) => (g ? spec.groups.indexOf(g) : undefined);
  const points: BuiltMap["points"] = [];
  for (const p of spec.points) {
    const xy = project(p.at);
    if (!xy) problems.push(`point "${p.name}" is outside the map`);
    else points.push({ name: p.name, x: xy[0], y: xy[1], group: gi(p.group) });
  }
  const routes: BuiltMap["routes"] = [];
  for (const r of spec.routes) {
    const xy = r.path.map(project);
    if (xy.some((p) => !p)) {
      problems.push(`${r.arrow ? "route" : "line"} "${r.name}" goes outside the map`);
      continue;
    }
    const d = geographic && path ? path({ type: "LineString", coordinates: r.path.map((c) => [c[1], c[0]]) }) : null;
    routes.push({ name: r.name, d: d ?? "M" + (xy as [number, number][]).map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join("L"), group: gi(r.group), arrow: r.arrow, end: xy[xy.length - 1]! });
  }
  const labels: BuiltMap["labels"] = [];
  for (const l of spec.labels) {
    const xy = project(l.at);
    if (!xy) problems.push(`label "${l.text}" is outside the map`);
    else labels.push({ text: l.text, x: xy[0], y: xy[1] });
  }

  // The opening view.
  const full: Box = svg ? [0, 0, WIDTH, height] : (union(wholes) ?? [0, 0, WIDTH, height]);
  const ptBox = (x: number, y: number): Box => [x, y, x, y];
  let target: Box | null = null;
  const v = spec.view;
  if (v && "fit" in v) {
    target = union([
      ...regions.filter((r) => r.group !== undefined).map((r) => r.box),
      ...points.map((p) => ptBox(p.x, p.y)),
      ...routes.flatMap((r) => [dBox(r.d)]),
      ...labels.map((l) => ptBox(l.x, l.y)),
    ]);
  } else if (v && "places" in v) {
    const boxes: Box[] = [];
    for (const n of v.places) {
      const r = find(n);
      const p = points.find((p) => placeKey(p.name) === placeKey(n));
      if (r) boxes.push(r.box);
      else if (p) boxes.push(ptBox(p.x, p.y));
      else missing.push(n);
    }
    target = union(boxes);
  } else if (v && "corners" in v) {
    const [[a0, b0], [a1, b1]] = v.corners;
    const pts: [number, number][] = [];
    for (let i = 0; i <= 6; i++)
      for (let j = 0; j <= 6; j++) {
        const xy = project([a0 + ((a1 - a0) * i) / 6, b0 + ((b1 - b0) * j) / 6]);
        if (xy) pts.push(xy);
      }
    target = union(pts.map((p) => ptBox(p[0], p[1])));
    if (!target) problems.push("view: corners are outside the map");
  }
  const view = target ? frame(target, full) : frame(full, full);
  return { width: WIDTH, height, regions, decor: svg?.decor ?? [], points, routes, labels, view, missing: [...new Set(missing)], problems };
}

const flat = (b: [[number, number], [number, number]]): Box => [b[0][0], b[0][1], b[1][0], b[1][1]];

/** Rough bounds of an SVG path (its coordinates' extent; good enough for fitting a view). */
function dBox(d: string): Box {
  const nums = absolutePoints(d);
  if (!nums.length) return [0, 0, 0, 0];
  return [Math.min(...nums.map((p) => p[0])), Math.min(...nums.map((p) => p[1])), Math.max(...nums.map((p) => p[0])), Math.max(...nums.map((p) => p[1]))];
}

/** The end points of each command in a path, in absolute coordinates. */
function absolutePoints(d: string): [number, number][] {
  const out: [number, number][] = [];
  let x = 0, y = 0, sx = 0, sy = 0;
  for (const m of d.matchAll(/([MmLlHhVvCcSsQqTtAaZz])([^MmLlHhVvCcSsQqTtAaZz]*)/g)) {
    const cmd = m[1];
    const a = (m[2].match(/-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/gi) ?? []).map(Number);
    const rel = cmd === cmd.toLowerCase();
    const size = { m: 2, l: 2, h: 1, v: 1, c: 6, s: 4, q: 4, t: 2, a: 7, z: 0 }[cmd.toLowerCase() as "m"];
    if (!size) {
      x = sx;
      y = sy;
      continue;
    }
    for (let i = 0; i + size <= a.length; i += size) {
      const c = cmd.toLowerCase();
      if (c === "h") x = rel ? x + a[i] : a[i];
      else if (c === "v") y = rel ? y + a[i] : a[i];
      else {
        const nx = a[i + size - 2], ny = a[i + size - 1];
        x = rel ? x + nx : nx;
        y = rel ? y + ny : ny;
      }
      if (c === "m" && i === 0) [sx, sy] = [x, y];
      out.push([x, y]);
    }
  }
  return out;
}

/** Scale and shift a path (absolute and relative coordinates alike) by rewriting its numbers. */
function scaleD(d: string, k: number, dx: number, dy: number): string {
  let out = "";
  for (const m of d.matchAll(/([MmLlHhVvCcSsQqTtAaZz])([^MmLlHhVvCcSsQqTtAaZz]*)/g)) {
    const cmd = m[1];
    const c = cmd.toLowerCase();
    const rel = cmd !== cmd.toUpperCase();
    const a = (m[2].match(/-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/gi) ?? []).map(Number);
    const r = (v: number) => Math.round(v * 10) / 10;
    const mapped = a.map((v, i) => {
      if (c === "a") {
        const j = i % 7;
        if (j < 2) return r(v * k); // radii
        if (j < 5) return v; // rotation and flags
        return rel ? r(v * k) : r(v * k + (j === 5 ? dx : dy));
      }
      if (c === "h") return rel ? r(v * k) : r(v * k + dx);
      if (c === "v") return rel ? r(v * k) : r(v * k + dy);
      return rel ? r(v * k) : r(v * k + (i % 2 ? dy : dx));
    });
    out += cmd + mapped.join(" ");
  }
  return out;
}

/** Region names sorted for a pick list (points are added by the caller). */
export const sortedNames = (m: BuiltMap) => m.regions.map((r) => r.name).sort((a, b) => a.localeCompare(b));

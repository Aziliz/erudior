// Interactive maps: the ```map lesson block and the map spec that map questions use.
//
//   ```map
//   base: us
//   title: The Louisiana Purchase
//   view: fit
//   region: Louisiana, Arkansas, Missouri, Iowa | Louisiana Purchase
//   point: St. Louis | 38.63, -90.20
//   route: Lewis and Clark | 38.8, -90.1; 46.9, -96.8; 46.2, -123.9 | Expedition
//   caption: The purchase doubled the size of the country in 1803.
//   ```
//
// This module only parses and writes the static HTML (a heading, the key and the caption, which
// read fine without JavaScript, in print and to screen readers). The drawing itself is made by
// components/GeoMap.tsx, which lazy-loads d3-geo and the base map's shapes (lib/mapGeo.ts) only
// when a map is on screen.

import { escapeHtml, plain, readFields, unwrap } from "./blockUtil";
import type { BaseMap } from "./mapNames";

export type Projection = "equal-earth" | "mercator" | "albers-usa" | "plain";

/** [lat, lon] on geographic maps; [x, y] with the plain projection (custom SVG/GeoJSON in its own units). */
export type Coord = [number, number];

export interface MapSpec {
  base: BaseMap;
  title?: string;
  caption?: string;
  projection?: Projection;
  /** What the map opens on: everything marked, some places, or a box between two corners. */
  view?: { fit: true } | { places: string[] } | { corners: [Coord, Coord] };
  regions: { names: string[]; group?: string }[];
  points: { name: string; at: Coord; group?: string }[];
  routes: { name: string; path: Coord[]; group?: string; arrow: boolean }[];
  labels: { text: string; at: Coord }[];
  /** Course-supplied shapes: GeoJSON text (or a data: URL), or SVG markup (or a data: URL). */
  geojson?: string;
  svg?: string;
  /** Write region names on the map: the marked ones, or all (points are always labeled). */
  showLabels: false | "marked" | "all";
  /** Legend groups in order of first use; group i gets color i (mod 6). */
  groups: string[];
  problems: string[];
}

export const MAP_BLOCK = /^```map\b([^\n]*)\r?\n([\s\S]*?)^```[ \t]*$/gm;

const KEYS = ["base", "title", "caption", "view", "projection", "region", "regions", "point", "route", "line", "label", "labels", "geojson", "svg"];
const PROJECTIONS: Projection[] = ["equal-earth", "mercator", "albers-usa", "plain"];

/** "39.74, -104.99", "39.74N, 104.99W" (lat, lon) or "x, y" (plain). */
export function parseCoord(s: string, plainXY = false): Coord | null {
  const m = /^\s*(-?\d+(?:\.\d+)?)\s*°?\s*([NSns])?\s*,\s*(-?\d+(?:\.\d+)?)\s*°?\s*([EWew])?\s*$/.exec(s);
  if (!m) return null;
  let a = Number(m[1]);
  let b = Number(m[3]);
  if (plainXY) return m[2] || m[4] ? null : [a, b];
  if (m[2] && /s/i.test(m[2])) a = -Math.abs(a);
  if (m[4] && /w/i.test(m[4])) b = -Math.abs(b);
  if (Math.abs(a) > 90 || Math.abs(b) > 180) return null;
  return [a, b];
}

const list = (s: string) =>
  s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);

export function parseMapSpec(body: string): MapSpec {
  const { fields, problems } = readFields(body, KEYS, ["geojson", "svg", "caption"]);
  const spec: MapSpec = { base: "world", regions: [], points: [], routes: [], labels: [], showLabels: false, groups: [], problems };
  let baseSet = false;
  const group = (g: string | undefined) => {
    const t = g?.trim();
    if (!t) return undefined;
    if (!spec.groups.includes(t)) spec.groups.push(t);
    return t;
  };
  const pending: { key: string; value: string; line: number }[] = [];
  for (const f of fields) {
    const v = f.value;
    const at = `line ${f.line}`;
    switch (f.key) {
      case "base":
        if (baseSet) problems.push(`${at}: more than one base: line`);
        baseSet = true;
        if (v === "world" || v === "us" || v === "none") spec.base = v;
        else problems.push(`${at}: base must be world, us or none (for your own geojson: or svg:), not "${v}"`);
        break;
      case "title":
      case "caption":
        if (spec[f.key] !== undefined) problems.push(`${at}: more than one ${f.key}: line`);
        if (!v) problems.push(`${at}: empty ${f.key}:`);
        else spec[f.key] = v;
        break;
      case "projection":
        if (PROJECTIONS.includes(v as Projection)) spec.projection = v as Projection;
        else problems.push(`${at}: projection must be one of ${PROJECTIONS.join(", ")}`);
        break;
      case "labels":
        if (/^(on|yes|true)$/i.test(v)) spec.showLabels = "marked";
        else if (/^all$/i.test(v)) spec.showLabels = "all";
        else if (!/^(off|no|false)$/i.test(v)) problems.push(`${at}: labels: must be on (marked regions), all or off`);
        break;
      case "geojson":
      case "svg":
        if (!v) problems.push(`${at}: empty ${f.key}:`);
        else spec[f.key] = v;
        break;
      default:
        // Places need the projection (plain = x, y), so they're read after every other line.
        pending.push(f);
    }
  }
  if ((spec.geojson || spec.svg) && !baseSet) spec.base = "none";
  if (spec.geojson && spec.svg) problems.push("use geojson: or svg:, not both");
  if (spec.base === "none" && !spec.geojson && !spec.svg) problems.push("base: none needs your own shapes in a geojson: or svg: field");
  if (spec.base !== "none" && (spec.geojson || spec.svg)) problems.push(`base: ${spec.base} can't be combined with ${spec.geojson ? "geojson:" : "svg:"} (use base: none)`);
  if (spec.svg && spec.projection && spec.projection !== "plain") problems.push("an svg: map uses its own x, y coordinates (leave out projection:)");
  const plainXY = !!spec.svg || spec.projection === "plain";
  const coordHelp = plainXY ? "x, y" : "latitude, longitude (e.g. 39.74, -104.99)";

  for (const f of pending) {
    const at = `line ${f.line}`;
    const parts = f.value.split("|").map((p) => p.trim());
    switch (f.key) {
      case "region":
      case "regions": {
        const names = list(parts[0] ?? "");
        if (!names.length) problems.push(`${at}: region: needs at least one place name`);
        else spec.regions.push({ names, group: group(parts[1]) });
        if (parts.length > 2) problems.push(`${at}: region: has more than "names | group"`);
        break;
      }
      case "point": {
        const c = parseCoord(parts[1] ?? "", plainXY);
        if (!parts[0]) problems.push(`${at}: point: needs a name`);
        else if (!c) problems.push(`${at}: point "${parts[0]}" needs a position (${coordHelp})`);
        else spec.points.push({ name: parts[0], at: c, group: group(parts[2]) });
        break;
      }
      case "route":
      case "line": {
        const path = (parts[1] ?? "").split(";").map((p) => parseCoord(p, plainXY));
        if (!parts[0]) problems.push(`${at}: ${f.key}: needs a name`);
        else if (path.length < 2 || path.some((p) => !p)) problems.push(`${at}: ${f.key} "${parts[0]}" needs two or more positions separated by ; (${coordHelp})`);
        else spec.routes.push({ name: parts[0], path: path as Coord[], group: group(parts[2]), arrow: f.key === "route" });
        break;
      }
      case "label": {
        const c = parseCoord(parts[1] ?? "", plainXY);
        if (!parts[0] || !c) problems.push(`${at}: label: needs text and a position (${coordHelp})`);
        else spec.labels.push({ text: parts[0], at: c });
        break;
      }
      case "view": {
        const v = f.value;
        if (/^fit$/i.test(v)) spec.view = { fit: true };
        else if (/\bto\b/i.test(v)) {
          const [a, b] = v.split(/\bto\b/i).map((p) => parseCoord(p, plainXY));
          if (!a || !b) problems.push(`${at}: view: corners must be "${coordHelp} to ${coordHelp}"`);
          else spec.view = { corners: [a, b] };
        } else if (v) spec.view = { places: list(v) };
        break;
      }
    }
  }
  if (spec.groups.length > 6) problems.push(`${spec.groups.length} groups; only 6 colors can be told apart (some will repeat)`);
  return spec;
}

/** Every name a map spec marks (regions and points), for checks. */
export const markedRegionNames = (spec: MapSpec) => spec.regions.flatMap((r) => r.names);

/** Plain-text summary of what a map shows (its text alternative). */
export function describeMap(spec: MapSpec): string {
  const parts: string[] = [];
  const byGroup = new Map<string, string[]>();
  for (const r of spec.regions) byGroup.set(r.group ?? "", [...(byGroup.get(r.group ?? "") ?? []), ...r.names]);
  for (const [g, names] of byGroup) parts.push(`${g ? `${g}: ` : "Shaded: "}${names.join(", ")}.`);
  if (spec.points.length) parts.push(`Places: ${spec.points.map((p) => p.name).join(", ")}.`);
  if (spec.routes.length) parts.push(`${spec.routes.some((r) => r.arrow) ? "Routes" : "Lines"}: ${spec.routes.map((r) => r.name).join(", ")}.`);
  return parts.join(" ");
}

/**
 * The static HTML for a ```map block: title, a mount point for the interactive map, the key
 * (each group with its color and places, then places and routes) and the caption. `md` renders
 * a short Markdown field (sanitized). The spec text travels in data-geo-map for the widget.
 */
export function renderMapBlock(body: string, md: (src: string) => string, key: string): string {
  const spec = parseMapSpec(body);
  const id = `map-${key}`;
  const title = spec.title ? unwrap(md(spec.title)) : "Map";
  const items: string[] = [];
  const byGroup = new Map<string, string[]>();
  for (const r of spec.regions) byGroup.set(r.group ?? "", [...(byGroup.get(r.group ?? "") ?? []), ...r.names]);
  for (const g of spec.groups) {
    const regions = byGroup.get(g) ?? [];
    const pts = spec.points.filter((p) => p.group === g).map((p) => p.name);
    const routes = spec.routes.filter((r) => r.group === g).map((r) => r.name);
    const what = [...regions, ...pts, ...routes];
    items.push(
      `<li><span class="map-swatch g${spec.groups.indexOf(g) % 6}" aria-hidden="true"></span><span><strong>${escapeHtml(g)}</strong>${what.length ? `: ${escapeHtml(what.join(", "))}` : ""}</span></li>`,
    );
  }
  const loose = byGroup.get("") ?? [];
  if (loose.length) items.push(`<li><span class="map-swatch hi" aria-hidden="true"></span><span><strong>Shaded</strong>: ${escapeHtml(loose.join(", "))}</span></li>`);
  const pts = spec.points.filter((p) => !p.group);
  if (pts.length) items.push(`<li><span class="map-swatch pt" aria-hidden="true"></span><span><strong>Places</strong>: ${escapeHtml(pts.map((p) => p.name).join(", "))}</span></li>`);
  const routes = spec.routes.filter((r) => !r.group);
  if (routes.length)
    items.push(`<li><span class="map-swatch rt" aria-hidden="true"></span><span><strong>${routes.every((r) => r.arrow) ? "Routes" : "Lines"}</strong>: ${escapeHtml(routes.map((r) => r.name).join(", "))}</span></li>`);
  return (
    `<figure class="geo-map" aria-labelledby="${id}-t" data-geo-map="${escapeHtml(body)}" data-map-title="${escapeHtml(plain(spec.title ?? "Map"))}">` +
    `<p class="map-head" id="${id}-t"><span class="map-kicker">Map</span><span class="map-title">${title}</span></p>` +
    `<div class="map-mount"><p class="map-wait small muted">The map appears here.</p></div>` +
    (items.length ? `<ul class="map-key" aria-label="Map key">${items.join("")}</ul>` : "") +
    (spec.caption ? `<figcaption class="map-caption">${md(spec.caption)}</figcaption>` : "") +
    `</figure>`
  );
}

/** Authoring problems for a Markdown text's map blocks (without looking up place names). */
export function mapBlockProblems(md: string): string[] {
  const blocks = [...md.matchAll(MAP_BLOCK)];
  const out = blocks.flatMap((m, i) => {
    const spec = parseMapSpec(m[2]);
    const opts = m[1].trim();
    return [...(opts ? [`unknown option "${opts}" after \`\`\`map`] : []), ...spec.problems].map((p) => `map ${i + 1}${spec.title ? ` ("${spec.title.slice(0, 40)}")` : ""}: ${p}`);
  });
  if ((md.match(/^```map\b/gm) ?? []).length > blocks.length) out.push("a ```map block is never closed with ```");
  return out;
}


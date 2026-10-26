// Letter tracing: stroke data for the 52 manuscript (print, ball-and-stick) letters, and the
// check of a traced stroke against its guide.
//
// Coordinates: y = 0 is the top line, 50 the dashed midline, 100 the baseline, 150 the
// descender line; x runs right from about 0 to 100. Each letter is a list of strokes in the
// order they're written; each stroke runs in the direction it's written. Commands:
//   M x y        start (move) here
//   L x y        straight line to here
//   E cx cy rx ry a0 a1   an elliptical arc from angle a0 to a1 in degrees (0 = right,
//                90 = down, -90 = up). Rising angles turn clockwise on screen, falling
//                angles counterclockwise ("circle back" letters such as c, a, o).
//   D x y        a dot (i, j): a tap
// An E that starts a stroke starts at its own first point.

export type Pt = [number, number];

const S: Record<string, string[]> = {
  // Capitals: top line to baseline.
  A: ["M 50 0 L 12 100", "M 50 0 L 88 100", "M 27 62 L 73 62"],
  B: ["M 15 0 L 15 100", "M 15 0 L 55 0 E 55 25 25 25 -90 90 L 15 50", "M 15 50 L 60 50 E 60 75 25 25 -90 90 L 15 100"],
  C: ["E 55 50 42 50 -40 -320"],
  D: ["M 15 0 L 15 100", "M 15 0 L 40 0 E 40 50 45 50 -90 90 L 15 100"],
  E: ["M 15 0 L 15 100", "M 15 0 L 80 0", "M 15 50 L 70 50", "M 15 100 L 80 100"],
  F: ["M 15 0 L 15 100", "M 15 0 L 80 0", "M 15 50 L 70 50"],
  G: ["E 55 50 42 50 -40 -360 L 68 50"],
  H: ["M 15 0 L 15 100", "M 85 0 L 85 100", "M 15 50 L 85 50"],
  I: ["M 50 0 L 50 100", "M 25 0 L 75 0", "M 25 100 L 75 100"],
  J: ["M 70 0 L 70 75 E 45 75 25 25 0 180"],
  K: ["M 15 0 L 15 100", "M 80 0 L 15 58", "M 33 42 L 85 100"],
  L: ["M 15 0 L 15 100 L 75 100"],
  M: ["M 12 0 L 12 100", "M 12 0 L 50 70 L 88 0 L 88 100"],
  N: ["M 15 0 L 15 100", "M 15 0 L 85 100 L 85 0"],
  O: ["E 50 50 40 50 -90 -450"],
  P: ["M 15 0 L 15 100", "M 15 0 L 55 0 E 55 25 25 25 -90 90 L 15 50"],
  Q: ["E 50 50 40 50 -90 -450", "M 60 75 L 92 105"],
  R: ["M 15 0 L 15 100", "M 15 0 L 55 0 E 55 25 25 25 -90 90 L 15 50", "M 45 50 L 85 100"],
  S: ["E 50 25 32 25 -20 -270 E 50 75 35 25 -90 160"],
  T: ["M 50 0 L 50 100", "M 12 0 L 88 0"],
  U: ["M 15 0 L 15 65 E 50 65 35 35 180 0 L 85 0"],
  V: ["M 12 0 L 50 100 L 88 0"],
  W: ["M 5 0 L 27 100 L 50 30 L 73 100 L 95 0"],
  X: ["M 15 0 L 85 100", "M 85 0 L 15 100"],
  Y: ["M 15 0 L 50 50", "M 85 0 L 50 50 L 50 100"],
  Z: ["M 15 0 L 85 0 L 15 100 L 85 100"],
  // Small letters: midline to baseline; tall ones from the top line, tails to the descender line.
  a: ["E 40 75 25 25 -10 -370", "M 65 50 L 65 100"],
  b: ["M 15 0 L 15 100", "E 40 75 25 25 180 540"],
  c: ["E 40 75 25 25 -40 -320"],
  d: ["E 40 75 25 25 -10 -370", "M 65 0 L 65 100"],
  e: ["M 15 75 L 65 75 E 40 75 25 25 0 -320"],
  f: ["E 45 20 18 18 -30 -180 L 27 100", "M 10 50 L 48 50"],
  g: ["E 40 75 25 25 -10 -370", "M 65 50 L 65 130 E 42 130 23 20 0 160"],
  h: ["M 15 0 L 15 100", "E 38 72 23 22 180 360 L 61 100"],
  i: ["M 25 50 L 25 100", "D 25 28"],
  j: ["M 45 50 L 45 130 E 25 130 20 20 0 160", "D 45 28"],
  k: ["M 15 0 L 15 100", "M 55 50 L 15 82", "M 28 72 L 60 100"],
  l: ["M 20 0 L 20 100"],
  m: ["M 12 50 L 12 100", "E 28 70 16 18 180 360 L 44 100", "E 60 70 16 18 180 360 L 76 100"],
  n: ["M 15 50 L 15 100", "E 38 72 23 22 180 360 L 61 100"],
  o: ["E 40 75 25 25 -90 -450"],
  p: ["M 15 50 L 15 150", "E 40 75 25 25 180 540"],
  q: ["E 40 75 25 25 -10 -370", "M 65 50 L 65 150"],
  r: ["M 15 50 L 15 100", "E 38 70 23 20 180 300"],
  s: ["E 40 62.5 20 12.5 -20 -270 E 40 87.5 22 12.5 -90 160"],
  t: ["M 30 10 L 30 100", "M 12 50 L 50 50"],
  u: ["M 15 50 L 15 78 E 38 78 23 22 180 0 L 61 50", "M 61 50 L 61 100"],
  v: ["M 12 50 L 40 100 L 68 50"],
  w: ["M 5 50 L 22 100 L 40 62 L 58 100 L 75 50"],
  x: ["M 15 50 L 65 100", "M 65 50 L 15 100"],
  y: ["M 15 50 L 42 100", "M 70 50 L 30 150"],
  z: ["M 15 50 L 65 50 L 15 100 L 65 100"],
};

/** Letters that have stroke data. */
export const TRACE_LETTERS = Object.keys(S).join("");

/** Turns one stroke's commands into points about one unit apart. */
export function strokePoints(cmds: string): Pt[] {
  const tok = cmds.trim().split(/\s+/);
  const pts: Pt[] = [];
  const lineTo = (x: number, y: number) => {
    const last = pts[pts.length - 1];
    if (!last) return void pts.push([x, y]);
    const n = Math.max(1, Math.ceil(Math.hypot(x - last[0], y - last[1])));
    for (let k = 1; k <= n; k++) pts.push([last[0] + ((x - last[0]) * k) / n, last[1] + ((y - last[1]) * k) / n]);
  };
  for (let i = 0; i < tok.length; ) {
    const c = tok[i++];
    const num = () => Number(tok[i++]);
    if (c === "M" || c === "D") pts.push([num(), num()]);
    else if (c === "L") lineTo(num(), num());
    else if (c === "E") {
      const [cx, cy, rx, ry, a0, a1] = [num(), num(), num(), num(), num(), num()];
      const at = (a: number): Pt => [cx + rx * Math.cos((a * Math.PI) / 180), cy + ry * Math.sin((a * Math.PI) / 180)];
      const steps = Math.max(2, Math.ceil((Math.abs(a1 - a0) / 360) * 2 * Math.PI * Math.max(rx, ry)));
      if (!pts.length) pts.push(at(a0));
      else lineTo(...at(a0));
      for (let k = 1; k <= steps; k++) pts.push(at(a0 + ((a1 - a0) * k) / steps));
    } else throw new Error(`unknown stroke command "${c}"`);
  }
  return pts;
}

export interface LetterGuide {
  char: string;
  /** Strokes in writing order, shifted so the letter starts at x = 0. */
  strokes: Pt[][];
  width: number;
}

const cache = new Map<string, LetterGuide>();

export function letterGuide(ch: string): LetterGuide | undefined {
  if (!S[ch]) return undefined;
  const hit = cache.get(ch);
  if (hit) return hit;
  const raw = S[ch].map(strokePoints);
  const xs = raw.flat().map((p) => p[0]);
  const min = Math.min(...xs);
  const strokes = raw.map((s) => s.map(([x, y]): Pt => [x - min, y]));
  const g = { char: ch, strokes, width: Math.max(...xs) - min };
  cache.set(ch, g);
  return g;
}

// ---------------------------------------------------------------------------------------
// Checking a traced stroke.

export const TOLERANCE = { loose: 18, normal: 13, tight: 9 } as const;
export type Tolerance = keyof typeof TOLERANCE;

const dist = (a: Pt, b: Pt) => Math.hypot(a[0] - b[0], a[1] - b[1]);

export function pathLength(p: Pt[]): number {
  let s = 0;
  for (let i = 1; i < p.length; i++) s += dist(p[i - 1], p[i]);
  return s;
}

/** n points spread evenly along a path. */
export function resample(p: Pt[], n: number): Pt[] {
  if (p.length < 2) return p.length ? Array.from({ length: n }, () => p[0]) : [];
  const total = pathLength(p);
  if (total === 0) return Array.from({ length: n }, () => p[0]);
  const out: Pt[] = [p[0]];
  const step = total / (n - 1);
  let acc = 0;
  let i = 1;
  let prev = p[0];
  while (out.length < n - 1 && i < p.length) {
    const d = dist(prev, p[i]);
    if (acc + d >= step) {
      const t = (step - acc) / d;
      const q: Pt = [prev[0] + (p[i][0] - prev[0]) * t, prev[1] + (p[i][1] - prev[1]) * t];
      out.push(q);
      prev = q;
      acc = 0;
    } else {
      acc += d;
      prev = p[i++];
    }
  }
  while (out.length < n) out.push(p[p.length - 1]);
  return out;
}

function segDist(q: Pt, a: Pt, b: Pt): number {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = dx * dx + dy * dy;
  const t = len ? Math.max(0, Math.min(1, ((q[0] - a[0]) * dx + (q[1] - a[1]) * dy) / len)) : 0;
  return Math.hypot(q[0] - a[0] - t * dx, q[1] - a[1] - t * dy);
}

function distToPath(q: Pt, p: Pt[]): number {
  if (p.length === 1) return dist(q, p[0]);
  let m = Infinity;
  for (let i = 1; i < p.length; i++) m = Math.min(m, segDist(q, p[i - 1], p[i]));
  return m;
}

export interface StrokeCheck {
  ok: boolean;
  /** Share of the guide the tracing covered (0–1). */
  coverage: number;
  /** Share of the tracing that stayed on the guide (0–1). */
  accuracy: number;
  /** Started near the numbered start point. */
  startOk: boolean;
  /** Went the way the arrow points. */
  directionOk: boolean;
  /** On the path and the right way, but not all of it yet: keep going. */
  partial: boolean;
}

/**
 * How well `user` (one or more pen strokes run together, in drawing order) traces `guide`.
 * It must start near the guide's start, stay within `tol` of the path, cover at least 75%
 * of it, and move along it in the written direction.
 */
export function checkStroke(guide: Pt[], user: Pt[], tol: number = TOLERANCE.normal): StrokeCheck {
  const none = { ok: false, coverage: 0, accuracy: 0, startOk: false, directionOk: false, partial: false };
  if (!user.length || !guide.length) return none;
  const glen = pathLength(guide);
  // A dot: any tap or short scribble on it.
  if (glen < 1) {
    const near = user.filter((u) => dist(u, guide[0]) <= tol * 1.5).length / user.length;
    const ok = near >= 0.6 && pathLength(user) < tol * 4;
    return { ok, coverage: ok ? 1 : 0, accuracy: near, startOk: dist(user[0], guide[0]) <= tol * 1.5, directionOk: true, partial: false };
  }
  const n = Math.max(12, Math.min(80, Math.round(glen / 3)));
  const g = resample(guide, n);
  const u = resample(user, Math.max(8, Math.min(80, Math.round(pathLength(user) / 3) || 8)));
  const coverage = g.filter((p) => distToPath(p, user) <= tol).length / g.length;
  const accuracy = u.filter((p) => distToPath(p, guide) <= tol * 1.25).length / u.length;
  const startOk = dist(user[0], g[0]) <= tol * 2.2;

  // Direction: follow where along the guide each traced point lies; it should mostly move
  // forward. On a closed loop (o, O) the start and end meet, so jumps across the seam are unwrapped.
  const closed = dist(g[0], g[g.length - 1]) <= tol;
  const nearestT = (p: Pt) => {
    let best = 0;
    let bd = Infinity;
    g.forEach((q, k) => {
      const d = dist(p, q);
      if (d < bd) {
        bd = d;
        best = k;
      }
    });
    return best / (g.length - 1);
  };
  let prev = nearestT(u[0]);
  if (closed && prev > 0.5) prev -= 1;
  let fwd = 0;
  let back = 0;
  for (const p of u.slice(1)) {
    let t = nearestT(p);
    if (closed) while (t - prev > 0.5) t -= 1;
    if (closed) while (prev - t > 0.5) t += 1;
    if (t > prev + 0.004) fwd++;
    else if (t < prev - 0.004) back++;
    prev = t;
  }
  const directionOk = fwd + back === 0 ? coverage < 0.3 : fwd / (fwd + back) >= 0.65;
  const onPath = accuracy >= 0.7 && startOk && directionOk;
  // Short strokes (a crossbar) are mostly inside the tolerance from either end, so an open
  // stroke must also reach its end.
  const endOk = closed || user.some((p) => dist(p, g[g.length - 1]) <= tol);
  const ok = onPath && coverage >= 0.75 && endOk;
  return { ok, coverage, accuracy, startOk, directionOk, partial: onPath && !ok };
}

/** Where a small arrow on the guide should sit and point (about a fifth of the way along). */
export function arrowAt(stroke: Pt[]): { at: Pt; angle: number } | undefined {
  if (pathLength(stroke) < 8) return undefined;
  const r = resample(stroke, 21);
  const a = r[Math.min(5, r.length - 2)];
  const b = r[Math.min(6, r.length - 1)];
  return { at: a, angle: (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI };
}

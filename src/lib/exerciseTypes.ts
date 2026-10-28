// Canonical math exercise data shared by browser and Worker validation.
// Keep this module dependency-free; browser-only application types re-export it.

/** A choice can be a number, text, or a label shown in text with a number used in math. */
export type DrillChoice = number | string | { label: string; value: number };

export type DrillVar = { min: number; max: number; step?: number } | { choices: DrillChoice[] };

export type NumFormat = "money" | "money0" | "percent" | "number" | "integer" | "fraction" | "sci";

/**
 * One answer box. A drill has either the classic single `answer` + `format`, or a list
 * of `answers` (multi-part, e.g. x and y).
 */
export interface AnswerPart {
  /** Name of the calc/var value that's correct (number kinds). */
  name?: string;
  /** Label next to the box, e.g. "x =" or "Speed". Markdown/math allowed. */
  label?: string;
  /**
   * number (default): any equivalent value, typed as a number or math like 3/4, sqrt(3)/2, 2pi.
   * fraction: must be typed as a whole number or fraction (no decimals), e.g. -7/4.
   * expression: an algebraic answer in the listed variables, e.g. 6x^2 - 2, checked by
   *   plugging values in. `expression` is the correct one, written with drill values/functions.
   */
  kind?: "number" | "fraction" | "expression";
  format?: NumFormat;
  /** Absolute tolerance (number kinds). */
  tolerance?: number;
  /** Relative tolerance, e.g. 0.01 for 1%. */
  relTolerance?: number;
  /** Accept anything that rounds to the same value at this many significant figures. */
  sigfigs?: number;
  /** Fractions must be in lowest terms. */
  lowestTerms?: boolean;
  /** Accepted units and their factor to the answer's unit: { "m/s": 1, "km/h": 0.27778 }. The first is shown. */
  units?: Record<string, number>;
  /** Expression kind: the correct expression, e.g. "3*a*x^2 - 2" or "deriv(f, x)". */
  expression?: string;
  /** Expression kind: the variables the answer may use. Default ["x"]. */
  variables?: string[];
  /** Expression kind: accept answers that differ by a constant (antiderivatives, "+ C"). */
  plusC?: boolean;
  /** Expression kind: how to show the correct answer (placeholders and $math$ allowed). */
  show?: string;
}

export interface Drill {
  id: string;
  title: string;
  topic?: string;
  /** Random inputs. */
  vars: Record<string, DrillVar>;
  /**
   * Functions usable in calc, where and answers: { "f(x)": "a*x^2 + b*x" }. They can use
   * the drill's values, and deriv(f, x), integ(f, a, b), solve(f, lo, hi), limit(f, a)
   * and extremum(f, lo, hi, ±1) work on them.
   */
  funcs?: Record<string, string>;
  /** Derived values, evaluated in order. See docs/COURSE_FORMAT.md for operators and functions. */
  calc?: Record<string, string>;
  /** Conditions every problem must meet (e.g. "b^2 - 4*a*c > 0"); the inputs are re-rolled until they do. */
  where?: string[];
  /** Text with {name} or {name:format} placeholders. */
  prompt: string;
  /** Name of the var/calc value that is the answer (single-answer drills). */
  answer: string;
  format: NumFormat;
  /** Accepted absolute difference. Defaults by format. */
  tolerance?: number;
  /** Multi-part or non-numeric answers. When present, `answer`/`format`/`tolerance` are ignored. */
  answers?: AnswerPart[];
  /** A graph or diagram shown with the problem (see Figure in docs/COURSE_FORMAT.md). */
  figure?: FigureSpec | FigureSpec[];
  /** Worked solution, same placeholder syntax. */
  solution: string;
}

/** Graph or diagram spec. Numbers anywhere may be expressions using the drill's values. */
export interface FigureSpec {
  /**
   * "plot" draws on coordinate axes; "shape" draws a plain diagram (geometry);
   * "numberline" draws a single horizontal number line (use y = 0 for points and segments).
   */
  type: "plot" | "shape" | "numberline";
  /** Plot only: same scale on both axes (circles look round). Height follows the ranges. */
  equal?: boolean;
  /** Axis titles (plot only). */
  xLabel?: string;
  yLabel?: string;
  /** Visible range; plot defaults to [-10, 10] both ways. */
  x?: [number | string, number | string];
  y?: [number | string, number | string];
  /** Grid and axes (plot only). Default true. */
  grid?: boolean;
  /** Where the y-axis (and its numbers) sits: at x = 0 when visible (default) or along the left edge. */
  yAxisAt?: "zero" | "left";
  /** Where the x-axis (and its numbers) sits: at y = 0 when visible (default) or along the bottom edge. */
  xAxisAt?: "zero" | "bottom";
  /** Functions to graph: "f" (a drill function), or an expression in x like "2x + 1". */
  functions?: (string | { f: string; label?: string; color?: string; dashed?: boolean; from?: number | string; to?: number | string })[];
  /** Points: [x, y] or { at: [x, y], label?, open? }. */
  points?: ([number | string, number | string] | { at: [number | string, number | string]; label?: string; open?: boolean; color?: string })[];
  /** Line segments and arrows. */
  segments?: { from: [number | string, number | string]; to: [number | string, number | string]; label?: string; arrow?: boolean; dashed?: boolean; color?: string }[];
  /** Polygons (triangles, etc.). */
  polygons?: { points: [number | string, number | string][]; fill?: boolean; color?: string }[];
  circles?: { center: [number | string, number | string]; r: number | string; fill?: boolean; color?: string }[];
  /** Text labels at a point. */
  labels?: { at: [number | string, number | string]; text: string }[];
  /** Shade between a function and the x-axis (or another function) from a to b. */
  shade?: { f: string; g?: string; from: number | string; to: number | string; color?: string }[];
  /** Tangent line to a function at x. */
  tangents?: { f: string; at: number | string; color?: string }[];
  /** Right-angle marks: the corner vertex and its two neighbors. */
  rightAngles?: [[number | string, number | string], [number | string, number | string], [number | string, number | string]][];
  /** Parametric curves (x(t), y(t)) for t in [from, to]; also polar curves via r(t)cos t, r(t)sin t. */
  curves?: { x: string; y: string; t: [number | string, number | string]; label?: string; color?: string; dashed?: boolean }[];
  /** Slope field for dy/dx = f(x, y): short segments on a grid (step defaults to a 20×15 grid). */
  slopeField?: { f: string; step?: number | string };
  /** Vector field (u(x, y), v(x, y)): arrows on a grid, scaled to fit. */
  vectorField?: { u: string; v: string; step?: number | string };
  /** Bars (histograms, bar charts): each bar is centered at x with the given height. */
  bars?: { x: number | string; height: number | string; width?: number | string; label?: string; color?: string }[];
  /** Drawing size in px (width); height follows the aspect of the ranges for shapes. Default 420. */
  width?: number;
  caption?: string;
}


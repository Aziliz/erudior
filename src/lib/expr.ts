// Math expression engine for drill templates and typed answers. The app's content
// security policy forbids eval/new Function, and course files are user-supplied,
// so expressions are parsed here into a small tree and can only do math.
//
// Grammar (lowest to highest precedence):
//   or      := and ("or" and)*                      also "||"
//   and     := not ("and" not)*                     also "&&"
//   not     := "not" not | compare
//   compare := sum (("<"|"<="|">"|">="|"=="|"!=") sum)?
//   sum     := product (("+"|"-") product)*
//   product := unary (("*"|"/"|implicit) unary)*    implicit only when enabled (typed answers)
//   unary   := ("-"|"+") unary | power
//   power   := postfix ("^" unary)?                  right-associative; -2^2 = -4
//   postfix := primary "!"*                          factorial
//   primary := number | name | name "(" args ")" | "(" expr ")" | "|" expr "|"
//
// Booleans are 1 and 0. Angles for sin/cos/tan are radians; sind/cosd/tand use degrees.

export type Node =
  | { k: "num"; v: number }
  | { k: "var"; name: string }
  | { k: "call"; name: string; args: Node[] }
  | { k: "un"; op: string; a: Node }
  | { k: "bin"; op: string; a: Node; b: Node };

/** A function defined in a drill, e.g. "f(x)": "a*x^2 + b". */
export interface UserFn {
  params: string[];
  body: Node;
}

export interface EvalEnv {
  /** Variable values. */
  scope: Record<string, number>;
  /** Drill-defined functions. */
  funcs?: Record<string, UserFn>;
}

const CONSTS: Record<string, number> = { pi: Math.PI, e: Math.E, tau: 2 * Math.PI };

import { STATS_FUNCS } from "./stats";

const RAD = Math.PI / 180;
function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) [a, b] = [b, a % b];
  return a;
}
function fact(n: number): number {
  if (n < 0 || !Number.isInteger(n)) throw new Error(`Factorial needs a whole number ≥ 0, got ${n}`);
  if (n > 170) throw new Error("Factorial too large");
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}
const nCr = (n: number, r: number) => (r < 0 || r > n ? 0 : Math.round(fact(n) / (fact(r) * fact(n - r))));

const FUNCS: Record<string, (...a: number[]) => number> = {
  round: (x, d = 0) => {
    const f = 10 ** d;
    return Math.round((x + Math.sign(x) * Number.EPSILON) * f) / f;
  },
  floor: Math.floor,
  ceil: Math.ceil,
  trunc: Math.trunc,
  abs: Math.abs,
  sign: Math.sign,
  min: Math.min,
  max: Math.max,
  clamp: (x, lo, hi) => Math.min(hi, Math.max(lo, x)),
  mod: (a, b) => ((a % b) + b) % b,
  sqrt: Math.sqrt,
  cbrt: Math.cbrt,
  root: (x, n) => (x < 0 && n % 2 === 1 ? -((-x) ** (1 / n)) : x ** (1 / n)),
  exp: Math.exp,
  ln: Math.log,
  log: (x, b) => (b === undefined ? Math.log10(x) : Math.log(x) / Math.log(b)),
  log10: Math.log10,
  log2: Math.log2,
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  asin: Math.asin,
  acos: Math.acos,
  atan: Math.atan,
  atan2: Math.atan2,
  sinh: Math.sinh,
  cosh: Math.cosh,
  tanh: Math.tanh,
  sind: (x) => Math.sin(x * RAD),
  cosd: (x) => Math.cos(x * RAD),
  tand: (x) => Math.tan(x * RAD),
  asind: (x) => Math.asin(x) / RAD,
  acosd: (x) => Math.acos(x) / RAD,
  atand: (x) => Math.atan(x) / RAD,
  atan2d: (y, x) => Math.atan2(y, x) / RAD,
  deg: (r) => r / RAD,
  rad: (d) => d * RAD,
  hypot: Math.hypot,
  gcd,
  lcm: (a, b) => Math.abs(Math.round(a) * Math.round(b)) / gcd(a, b),
  fact,
  nCr,
  nPr: (n, r) => (r < 0 || r > n ? 0 : Math.round(fact(n) / fact(n - r))),
  if: (c, a, b) => (c ? a : b),
  sec: (x) => 1 / Math.cos(x),
  csc: (x) => 1 / Math.sin(x),
  cot: (x) => 1 / Math.tan(x),
  secd: (x) => 1 / Math.cos(x * RAD),
  cscd: (x) => 1 / Math.sin(x * RAD),
  cotd: (x) => 1 / Math.tan(x * RAD),
  asinh: Math.asinh,
  acosh: Math.acosh,
  atanh: Math.atanh,
  ...STATS_FUNCS,
};

/** Built-ins whose first argument is a function name: deriv(f, x), integ(f, a, b), ... */
const HIGHER = new Set(["deriv", "integ", "solve", "limit", "sum", "prod", "extremum"]);

/** Every name a course author can call, for docs and error messages. */
export const FUNCTION_NAMES = [...Object.keys(FUNCS), ...HIGHER].sort();

// ---------------------------------------------------------------------------
// Tokenizer

type Tok = { t: "num"; v: number } | { t: "id"; v: string } | { t: "op"; v: string };

const OPS2 = ["<=", ">=", "==", "!=", "&&", "||", "**"];

function tokenize(src: string): Tok[] {
  const out: Tok[] = [];
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (/\s/.test(c)) {
      i++;
      continue;
    }
    if (/[0-9.]/.test(c)) {
      let j = i;
      while (j < src.length && /[0-9._]/.test(src[j])) j++;
      // Scientific notation: 6.02e23, 1.6e-19 (only when digits follow the e).
      const m = /^[eE][+-]?\d+/.exec(src.slice(j));
      if (m) j += m[0].length;
      const text = src.slice(i, j).replace(/_/g, "");
      const n = Number(text);
      if (Number.isNaN(n) || text === ".") throw new Error(`Bad number "${src.slice(i, j)}"`);
      out.push({ t: "num", v: n });
      i = j;
      continue;
    }
    if (/[A-Za-z_]/.test(c)) {
      let j = i;
      while (j < src.length && /[A-Za-z0-9_]/.test(src[j])) j++;
      out.push({ t: "id", v: src.slice(i, j) });
      i = j;
      continue;
    }
    if (c === "π") {
      out.push({ t: "id", v: "pi" });
      i++;
      continue;
    }
    const two = src.slice(i, i + 2);
    if (OPS2.includes(two)) {
      out.push({ t: "op", v: two === "**" ? "^" : two === "&&" ? "and" : two === "||" ? "or" : two });
      i += 2;
      continue;
    }
    const map: Record<string, string> = { "×": "*", "·": "*", "÷": "/", "−": "-", "√": "sqrt" };
    if (c in map) {
      out.push(map[c] === "sqrt" ? { t: "id", v: "sqrt" } : { t: "op", v: map[c] });
      i++;
      continue;
    }
    if ("+-*/^(),<>!|".includes(c)) {
      out.push({ t: "op", v: c });
      i++;
      continue;
    }
    throw new Error(`Unexpected "${c}"`);
  }
  return out;
}

// ---------------------------------------------------------------------------
// Parser

export interface ParseOptions {
  /** Allow "2x", "3(x+1)", "2pi", "x y" (for answers people type). */
  implicit?: boolean;
  /** Names that are functions in this context (drill-defined), so "f(2)" isn't f*(2). */
  funcNames?: Iterable<string>;
  /** With implicit: known single-letter variables, so typed "xy" means x*y. */
  vars?: Iterable<string>;
}

export function parse(src: string, opts: ParseOptions = {}): Node {
  const toks = tokenize(src);
  const userFns = new Set(opts.funcNames ?? []);
  const vars = new Set(opts.vars ?? []);
  const isFn = (name: string) => name in FUNCS || HIGHER.has(name) || userFns.has(name);
  let p = 0;
  let absDepth = 0;
  const peek = () => toks[p];
  const isOp = (v: string) => peek()?.t === "op" && peek().v === v;
  const isWord = (v: string) => peek()?.t === "id" && peek().v === v;
  const expect = (v: string) => {
    if (!isOp(v)) throw new Error(`Expected "${v}" in "${src}"`);
    p++;
  };

  function or(): Node {
    let a = and();
    while (isOp("or") || isWord("or")) {
      p++;
      a = { k: "bin", op: "or", a, b: and() };
    }
    return a;
  }
  function and(): Node {
    let a = not();
    while (isOp("and") || isWord("and")) {
      p++;
      a = { k: "bin", op: "and", a, b: not() };
    }
    return a;
  }
  function not(): Node {
    if (isWord("not")) {
      p++;
      return { k: "un", op: "not", a: not() };
    }
    return compare();
  }
  function compare(): Node {
    const a = sum();
    for (const op of ["<=", ">=", "==", "!=", "<", ">"]) {
      if (isOp(op)) {
        p++;
        return { k: "bin", op, a, b: sum() };
      }
    }
    return a;
  }
  function sum(): Node {
    let a = product();
    while (isOp("+") || isOp("-")) {
      const op = String(toks[p++].v);
      a = { k: "bin", op, a, b: product() };
    }
    return a;
  }
  // Can the current token start a factor that's implicitly multiplied?
  function startsImplicit(): boolean {
    const t = peek();
    if (!t) return false;
    if (t.t === "num") return true;
    if (t.t === "id") return !["and", "or", "not"].includes(t.v);
    return t.v === "(" || (t.v === "|" && absDepth === 0);
  }
  function product(): Node {
    let a = unary();
    for (;;) {
      if (isOp("*") || isOp("/")) {
        const op = String(toks[p++].v);
        a = { k: "bin", op, a, b: unary() };
      } else if (opts.implicit && startsImplicit()) {
        a = { k: "bin", op: "*", a, b: power() };
      } else return a;
    }
  }
  function unary(): Node {
    if (isOp("-")) {
      p++;
      return { k: "un", op: "-", a: unary() };
    }
    if (isOp("+")) {
      p++;
      return unary();
    }
    return power();
  }
  function power(): Node {
    const b = postfix();
    if (isOp("^")) {
      p++;
      return { k: "bin", op: "^", a: b, b: unary() };
    }
    return b;
  }
  function postfix(): Node {
    let a = primary();
    while (isOp("!")) {
      p++;
      a = { k: "call", name: "fact", args: [a] };
    }
    return a;
  }
  function primary(): Node {
    const t = peek();
    if (!t) throw new Error(`Unexpected end of "${src}"`);
    if (t.t === "num") {
      p++;
      return { k: "num", v: t.v };
    }
    if (t.t === "id") {
      p++;
      if (isOp("(") && isFn(t.v)) {
        p++;
        const args: Node[] = [];
        if (!isOp(")")) {
          args.push(or());
          while (isOp(",")) {
            p++;
            args.push(or());
          }
        }
        expect(")");
        return { k: "call", name: t.v, args };
      }
      if (isOp("(") && !opts.implicit) throw new Error(`Unknown function "${t.v}"`);
      // Typed answers: "xy" or "2xpi" means a product of known names.
      if (opts.implicit && t.v.length > 1 && !vars.has(t.v) && !(t.v in CONSTS)) {
        const parts = splitName(t.v, vars);
        if (parts) return parts.map((name): Node => ({ k: "var", name })).reduce((a, b) => ({ k: "bin", op: "*", a, b }));
      }
      return { k: "var", name: t.v };
    }
    if (isOp("(")) {
      p++;
      const v = or();
      expect(")");
      return v;
    }
    if (isOp("|")) {
      p++;
      absDepth++;
      const v = or();
      absDepth--;
      expect("|");
      return { k: "call", name: "abs", args: [v] };
    }
    throw new Error(`Unexpected "${t.v}" in "${src}"`);
  }

  const node = or();
  if (p < toks.length) throw new Error(`Unexpected "${toks[p].v}" in "${src}"`);
  return node;
}

/** Split "xypi" into known names ["x", "y", "pi"]; null if it can't be. */
function splitName(s: string, vars: Set<string>): string[] | null {
  if (!s) return [];
  for (const cand of [...vars, ...Object.keys(CONSTS)].sort((a, b) => b.length - a.length)) {
    if (s.startsWith(cand)) {
      const rest = splitName(s.slice(cand.length), vars);
      if (rest) return [cand, ...rest];
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Evaluator

type Fn1 = (x: number) => number;

function asFunction(n: Node, env: EvalEnv, what: string): Fn1 {
  if (n.k !== "var") throw new Error(`${what} needs a function name first, like ${what}(f, …)`);
  const uf = env.funcs?.[n.name];
  if (uf) {
    if (uf.params.length !== 1) throw new Error(`${what} needs a one-variable function; ${n.name} has ${uf.params.length}`);
    return (x) => run(uf.body, { ...env, scope: { ...env.scope, [uf.params[0]]: x } });
  }
  const bf = FUNCS[n.name];
  if (bf) return (x) => bf(x);
  throw new Error(`Unknown function "${n.name}" in ${what}`);
}

function deriv(f: Fn1, x: number, order = 1): number {
  // Central differences; step scaled to x so large and small inputs both work.
  const h = 1e-3 * Math.max(1, Math.abs(x));
  if (order === 1) return (f(x - 2 * h) - 8 * f(x - h) + 8 * f(x + h) - f(x + 2 * h)) / (12 * h);
  if (order === 2) return (-f(x - 2 * h) + 16 * f(x - h) - 30 * f(x) + 16 * f(x + h) - f(x + 2 * h)) / (12 * h * h);
  throw new Error("deriv supports order 1 or 2");
}

function integ(f: Fn1, a: number, b: number): number {
  // Composite Simpson's rule with 2000 panels.
  const n = 2000;
  const h = (b - a) / n;
  let s = f(a) + f(b);
  for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2);
  return (s * h) / 3;
}

function solve(f: Fn1, lo: number, hi: number): number {
  let flo = f(lo);
  const fhi = f(hi);
  if (flo === 0) return lo;
  if (fhi === 0) return hi;
  if (Math.sign(flo) === Math.sign(fhi)) throw new Error(`solve: no sign change between ${lo} and ${hi}`);
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    const fm = f(mid);
    if (fm === 0 || (hi - lo) / 2 < 1e-12) return mid;
    if (Math.sign(fm) === Math.sign(flo)) {
      lo = mid;
      flo = fm;
    } else hi = mid;
  }
  return (lo + hi) / 2;
}

function limit(f: Fn1, a: number, side = 0): number {
  // Approach a from one or both sides and extrapolate; good for removable discontinuities.
  const approach = (dir: number) => {
    // Richardson extrapolation on two step sizes cancels the first-order error.
    const f1 = f(a + dir * 1e-4);
    const f2 = f(a + dir * 1e-5);
    return (10 * f2 - f1) / 9;
  };
  if (side > 0) return approach(1);
  if (side < 0) return approach(-1);
  const l = approach(-1);
  const r = approach(1);
  if (Math.abs(l - r) > 1e-4 * Math.max(1, Math.abs(l))) throw new Error(`limit at ${a} differs from left and right`);
  return (l + r) / 2;
}

function extremum(f: Fn1, lo: number, hi: number, kind: number): number {
  // Golden-section search for the x of a minimum (kind < 0) or maximum (kind > 0).
  const g = (Math.sqrt(5) - 1) / 2;
  const s = kind > 0 ? -1 : 1;
  let a = lo;
  let b = hi;
  for (let i = 0; i < 200; i++) {
    const c = b - g * (b - a);
    const d = a + g * (b - a);
    if (s * f(c) < s * f(d)) b = d;
    else a = c;
  }
  return (a + b) / 2;
}

function run(n: Node, env: EvalEnv): number {
  switch (n.k) {
    case "num":
      return n.v;
    case "var":
      if (n.name in env.scope) return env.scope[n.name];
      if (n.name in CONSTS) return CONSTS[n.name];
      throw new Error(`Unknown name "${n.name}"`);
    case "un": {
      const a = run(n.a, env);
      return n.op === "-" ? -a : a ? 0 : 1;
    }
    case "bin": {
      if (n.op === "and") return run(n.a, env) && run(n.b, env) ? 1 : 0;
      if (n.op === "or") return run(n.a, env) || run(n.b, env) ? 1 : 0;
      const a = run(n.a, env);
      const b = run(n.b, env);
      switch (n.op) {
        case "+":
          return a + b;
        case "-":
          return a - b;
        case "*":
          return a * b;
        case "/":
          return a / b;
        case "^":
          if (a < 0 && !Number.isInteger(b)) {
            // Real odd roots of negatives: (-8)^(1/3) = -2.
            const n = 1 / b;
            if (Math.abs(n - Math.round(n)) < 1e-9 && Math.round(n) % 2 !== 0) return FUNCS.root(a, Math.round(n));
          }
          return a ** b;
        case "<":
          return a < b ? 1 : 0;
        case "<=":
          return a <= b ? 1 : 0;
        case ">":
          return a > b ? 1 : 0;
        case ">=":
          return a >= b ? 1 : 0;
        case "==":
          return Math.abs(a - b) < 1e-9 * Math.max(1, Math.abs(a), Math.abs(b)) ? 1 : 0;
        case "!=":
          return Math.abs(a - b) < 1e-9 * Math.max(1, Math.abs(a), Math.abs(b)) ? 0 : 1;
      }
      throw new Error(`Bad operator ${n.op}`);
    }
    case "call": {
      if (HIGHER.has(n.name)) {
        const f = asFunction(n.args[0], env, n.name);
        const a = n.args.slice(1).map((x) => run(x, env));
        switch (n.name) {
          case "deriv":
            return deriv(f, a[0], a[1] ?? 1);
          case "integ":
            return integ(f, a[0], a[1]);
          case "solve":
            return solve(f, a[0], a[1]);
          case "limit":
            return limit(f, a[0], a[1] ?? 0);
          case "extremum":
            return extremum(f, a[0], a[1], a[2] ?? -1);
          case "sum":
          case "prod": {
            let acc = n.name === "sum" ? 0 : 1;
            for (let i = Math.round(a[0]); i <= Math.round(a[1]); i++) acc = n.name === "sum" ? acc + f(i) : acc * f(i);
            return acc;
          }
        }
      }
      const uf = env.funcs?.[n.name];
      if (uf) {
        if (n.args.length !== uf.params.length)
          throw new Error(`${n.name} takes ${uf.params.length} argument(s), got ${n.args.length}`);
        const local = { ...env.scope };
        uf.params.forEach((pn, i) => (local[pn] = run(n.args[i], env)));
        return run(uf.body, { ...env, scope: local });
      }
      const fn = FUNCS[n.name];
      if (!fn) throw new Error(`Unknown function "${n.name}"`);
      return fn(...n.args.map((x) => run(x, env)));
    }
  }
}

export function evalNode(n: Node, env: EvalEnv): number {
  return run(n, env);
}

/** Parse "f(x, y)" into a name and parameter list. */
export function parseSignature(sig: string): { name: string; params: string[] } {
  const m = /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*\(\s*([A-Za-z_][A-Za-z0-9_]*(?:\s*,\s*[A-Za-z_][A-Za-z0-9_]*)*)?\s*\)\s*$/.exec(sig);
  if (!m) throw new Error(`Function names look like "f(x)"; got "${sig}"`);
  return { name: m[1], params: m[2] ? m[2].split(",").map((s) => s.trim()) : [] };
}

/** Compile a drill's function table, e.g. { "f(x)": "a*x^2", "g(t)": "f(t) + 1" }. */
export function compileFuncs(defs: Record<string, string> | undefined): Record<string, UserFn> {
  const out: Record<string, UserFn> = {};
  const names = Object.keys(defs ?? {}).map((s) => parseSignature(s).name);
  for (const [sig, body] of Object.entries(defs ?? {})) {
    const { name, params } = parseSignature(sig);
    if (name in FUNCS || HIGHER.has(name)) throw new Error(`"${name}" is a built-in function; pick another name`);
    try {
      out[name] = { params, body: parse(body, { funcNames: names }) };
    } catch (e) {
      throw new Error(`${sig} = ${body}: ${(e as Error).message}`);
    }
  }
  return out;
}

/** Evaluate an expression. Throws on bad syntax, unknown names, or a non-finite result. */
export function evaluate(
  src: string,
  scope: Record<string, number>,
  funcs?: Record<string, UserFn>,
  opts: { implicit?: boolean } = {},
): number {
  const node = parse(src, { implicit: opts.implicit, funcNames: Object.keys(funcs ?? {}), vars: Object.keys(scope) });
  const v = run(node, { scope, funcs });
  if (!Number.isFinite(v)) throw new Error(`"${src}" is not a finite number`);
  return v;
}

// ---------------------------------------------------------------------------
// Inspection and display

/** Every variable name used in an expression (constants excluded). */
export function collectVars(n: Node, out = new Set<string>()): Set<string> {
  if (n.k === "var" && !(n.name in CONSTS)) out.add(n.name);
  else if (n.k === "un") collectVars(n.a, out);
  else if (n.k === "bin") {
    collectVars(n.a, out);
    collectVars(n.b, out);
  } else if (n.k === "call") {
    // The first argument of deriv/integ/... names a function, not a variable.
    n.args.forEach((a, i) => (HIGHER.has(n.name) && i === 0 ? null : collectVars(a, out)));
  }
  return out;
}

/** Replace known variables with their numbers (used to show an answer with this problem's values). */
export function substitute(n: Node, scope: Record<string, number>): Node {
  switch (n.k) {
    case "var":
      return n.name in scope ? { k: "num", v: scope[n.name] } : n;
    case "un":
      return { ...n, a: substitute(n.a, scope) };
    case "bin":
      return { ...n, a: substitute(n.a, scope), b: substitute(n.b, scope) };
    case "call":
      return { ...n, args: n.args.map((a, i) => (HIGHER.has(n.name) && i === 0 ? a : substitute(a, scope))) };
    default:
      return n;
  }
}

const PREC: Record<string, number> = { or: 1, and: 2, "<": 4, "<=": 4, ">": 4, ">=": 4, "==": 4, "!=": 4, "+": 5, "-": 5, "*": 6, "/": 6, "^": 8 };
const TEX_FN: Record<string, string> = {
  sin: "\\sin", cos: "\\cos", tan: "\\tan", asin: "\\arcsin", acos: "\\arccos", atan: "\\arctan",
  sinh: "\\sinh", cosh: "\\cosh", tanh: "\\tanh", sec: "\\sec", csc: "\\csc", cot: "\\cot", ln: "\\ln", log: "\\log", exp: "\\exp",
};

function numTex(v: number): string {
  if (Number.isInteger(v)) return String(v);
  const r = Number(v.toPrecision(6));
  if (Math.abs(r) >= 1e-4 && Math.abs(r) < 1e7) return String(r);
  const [m, ex] = r.toExponential(4).split("e");
  return `${Number(m)} \\times 10^{${Number(ex)}}`;
}

/** Render an expression tree as TeX for KaTeX. */
export function toTex(n: Node, parent = 0): string {
  const wrap = (s: string, prec: number) => (prec < parent ? `\\left(${s}\\right)` : s);
  switch (n.k) {
    case "num":
      return n.v < 0 ? wrap(numTex(n.v), 5) : numTex(n.v);
    case "var":
      if (n.name === "pi") return "\\pi";
      if (n.name === "tau") return "\\tau";
      return n.name.length > 1 ? `\\mathit{${n.name}}` : n.name;
    case "un":
      if (n.op === "-") return wrap(`-${toTex(n.a, 7)}`, 7);
      return wrap(`\\lnot ${toTex(n.a, 3)}`, 3);
    case "bin": {
      const p = PREC[n.op] ?? 5;
      if (n.op === "/") return `\\frac{${toTex(n.a)}}{${toTex(n.b)}}`;
      if (n.op === "^") return wrap(`{${toTex(n.a, 9)}}^{${toTex(n.b)}}`, p);
      if (n.op === "*") {
        const a = toTex(n.a, p);
        const b = toTex(n.b, p + 1);
        // 3x, 2\pi, x y read naturally; two numbers need a dot.
        const needDot = /\d$/.test(a) && /^[\d-]/.test(b);
        return wrap(`${a}${needDot ? " \\cdot " : " "}${b}`, p);
      }
      const sym: Record<string, string> = { "<=": "\\le", ">=": "\\ge", "!=": "\\ne", "==": "=", and: "\\land", or: "\\lor" };
      const right = toTex(n.b, n.op === "-" ? p + 1 : p);
      if (n.op === "+" && right.startsWith("-")) return wrap(`${toTex(n.a, p)} - ${right.slice(1)}`, p);
      return wrap(`${toTex(n.a, p)} ${sym[n.op] ?? n.op} ${right}`, p);
    }
    case "call": {
      const a = n.args.map((x) => toTex(x));
      switch (n.name) {
        case "sqrt":
          return `\\sqrt{${a[0]}}`;
        case "cbrt":
          return `\\sqrt[3]{${a[0]}}`;
        case "root":
          return `\\sqrt[${a[1]}]{${a[0]}}`;
        case "abs":
          return `\\left|${a[0]}\\right|`;
        case "fact":
          return `${toTex(n.args[0], 10)}!`;
        case "nCr":
          return `\\binom{${a[0]}}{${a[1]}}`;
        case "log":
          return n.args.length > 1 ? `\\log_{${a[1]}}\\left(${a[0]}\\right)` : `\\log\\left(${a[0]}\\right)`;
        case "deriv":
          return `${toTex(n.args[0])}'\\left(${a[1]}\\right)`;
        case "integ":
          return `\\int_{${a[1]}}^{${a[2]}} ${toTex(n.args[0])}\\,dx`;
      }
      const fn = TEX_FN[n.name] ?? (n.name.length > 1 ? `\\operatorname{${n.name}}` : n.name);
      return `${fn}\\left(${a.join(", ")}\\right)`;
    }
  }
}

/** Light tidy-up for display: fold number arithmetic and drop ×1, +0, ^1. */
export function simplify(n: Node): Node {
  if (n.k === "un") {
    const a = simplify(n.a);
    if (n.op === "-" && a.k === "num") return { k: "num", v: -a.v };
    if (n.op === "-" && a.k === "un" && a.op === "-") return a.a;
    return { ...n, a };
  }
  if (n.k === "call") return { ...n, args: n.args.map((x, i) => (HIGHER.has(n.name) && i === 0 ? x : simplify(x))) };
  if (n.k !== "bin") return n;
  const a = simplify(n.a);
  const b = simplify(n.b);
  const num = (x: Node, v?: number) => x.k === "num" && (v === undefined || x.v === v);
  if (a.k === "num" && b.k === "num") {
    const v = run({ ...n, a, b }, { scope: {} });
    // Keep non-terminating divisions as fractions.
    if (n.op !== "/" || Number.isInteger(v)) return { k: "num", v };
  }
  switch (n.op) {
    case "*":
      if (num(a, 0) || num(b, 0)) return { k: "num", v: 0 };
      if (num(a, 1)) return b;
      if (num(b, 1)) return a;
      if (num(a, -1)) return simplify({ k: "un", op: "-", a: b });
      // 2 * (3 * x) -> 6x
      if (a.k === "num" && b.k === "bin" && b.op === "*" && b.a.k === "num")
        return simplify({ k: "bin", op: "*", a: { k: "num", v: a.v * b.a.v }, b: b.b });
      break;
    case "+":
      if (num(a, 0)) return b;
      if (num(b, 0)) return a;
      if (b.k === "num" && b.v < 0) return { k: "bin", op: "-", a, b: { k: "num", v: -b.v } };
      break;
    case "-":
      if (num(b, 0)) return a;
      if (num(a, 0)) return simplify({ k: "un", op: "-", a: b });
      if (b.k === "num" && b.v < 0) return { k: "bin", op: "+", a, b: { k: "num", v: -b.v } };
      break;
    case "^":
      if (num(b, 1)) return a;
      if (num(b, 0)) return { k: "num", v: 1 };
      break;
    case "/":
      if (num(b, 1)) return a;
      break;
  }
  return { ...n, a, b };
}

/** Numerical derivative of a one-variable function at x (used for tangent lines). */
export function derivAt(f: (x: number) => number, x: number): number {
  return deriv(f, x, 1);
}

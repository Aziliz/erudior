// Tiny arithmetic evaluator for drill templates. The app's content security
// policy forbids eval/new Function, and course files are user-supplied, so
// expressions are parsed here and can only do arithmetic.
//
// Grammar:  expr   := term (("+" | "-") term)*
//           term   := factor (("*" | "/") factor)*
//           factor := unary ("^" factor)?
//           unary  := "-" unary | primary
//           primary:= number | name | name "(" args ")" | "(" expr ")"

type Tok = { t: "num"; v: number } | { t: "id"; v: string } | { t: "op"; v: string };

const FUNCS: Record<string, (...a: number[]) => number> = {
  round: (x, d = 0) => {
    const f = 10 ** d;
    return Math.round((x + Number.EPSILON) * f) / f;
  },
  floor: Math.floor,
  ceil: Math.ceil,
  abs: Math.abs,
  min: Math.min,
  max: Math.max,
  sqrt: Math.sqrt,
};

function tokenize(src: string): Tok[] {
  const out: Tok[] = [];
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (/\s/.test(c)) {
      i++;
    } else if (/[0-9.]/.test(c)) {
      let j = i;
      while (j < src.length && /[0-9._]/.test(src[j])) j++;
      const n = Number(src.slice(i, j).replace(/_/g, ""));
      if (Number.isNaN(n)) throw new Error(`Bad number "${src.slice(i, j)}"`);
      out.push({ t: "num", v: n });
      i = j;
    } else if (/[A-Za-z_]/.test(c)) {
      let j = i;
      while (j < src.length && /[A-Za-z0-9_]/.test(src[j])) j++;
      out.push({ t: "id", v: src.slice(i, j) });
      i = j;
    } else if ("+-*/^(),".includes(c)) {
      out.push({ t: "op", v: c });
      i++;
    } else {
      throw new Error(`Unexpected "${c}"`);
    }
  }
  return out;
}

export function evaluate(src: string, scope: Record<string, number>): number {
  const toks = tokenize(src);
  let p = 0;
  const peek = () => toks[p];
  const isOp = (v: string) => peek()?.t === "op" && peek().v === v;
  const expect = (v: string) => {
    if (!isOp(v)) throw new Error(`Expected "${v}" in "${src}"`);
    p++;
  };

  function expr(): number {
    let v = term();
    while (isOp("+") || isOp("-")) {
      const op = toks[p++].v;
      const r = term();
      v = op === "+" ? v + r : v - r;
    }
    return v;
  }
  function term(): number {
    let v = factor();
    while (isOp("*") || isOp("/")) {
      const op = toks[p++].v;
      const r = factor();
      v = op === "*" ? v * r : v / r;
    }
    return v;
  }
  function factor(): number {
    const b = unary();
    if (isOp("^")) {
      p++;
      return b ** factor();
    }
    return b;
  }
  function unary(): number {
    if (isOp("-")) {
      p++;
      return -unary();
    }
    return primary();
  }
  function primary(): number {
    const t = peek();
    if (!t) throw new Error(`Unexpected end of "${src}"`);
    if (t.t === "num") {
      p++;
      return t.v;
    }
    if (t.t === "id") {
      p++;
      if (isOp("(")) {
        p++;
        const fn = FUNCS[t.v];
        if (!fn) throw new Error(`Unknown function "${t.v}"`);
        const args: number[] = [];
        if (!isOp(")")) {
          args.push(expr());
          while (isOp(",")) {
            p++;
            args.push(expr());
          }
        }
        expect(")");
        return fn(...args);
      }
      if (!(t.v in scope)) throw new Error(`Unknown name "${t.v}"`);
      return scope[t.v];
    }
    if (isOp("(")) {
      p++;
      const v = expr();
      expect(")");
      return v;
    }
    throw new Error(`Unexpected "${t.v}" in "${src}"`);
  }

  const v = expr();
  if (p < toks.length) throw new Error(`Unexpected "${toks[p].v}" in "${src}"`);
  if (!Number.isFinite(v)) throw new Error(`"${src}" is not a finite number`);
  return v;
}

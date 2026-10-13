// Probability and statistics functions for math drills: distributions (normal, t,
// chi-square, F, binomial, Poisson, geometric) and summary statistics of a list.
// Accuracy is about 1e-10 for the CDFs, far beyond what any course asks for.

const LANCZOS = [
  0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059,
  12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
];

export function lgamma(x: number): number {
  if (x < 0.5) return Math.log(Math.PI / Math.abs(Math.sin(Math.PI * x))) - lgamma(1 - x);
  x -= 1;
  let a = LANCZOS[0];
  const t = x + 7.5;
  for (let i = 1; i < 9; i++) a += LANCZOS[i] / (x + i);
  return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
}

export function gamma(x: number): number {
  if (Number.isInteger(x) && x <= 0) return NaN;
  if (x < 0.5) return Math.PI / (Math.sin(Math.PI * x) * gamma(1 - x));
  return Math.exp(lgamma(x));
}

/** Regularized lower incomplete gamma P(a, x). */
export function gammaP(a: number, x: number): number {
  if (x <= 0) return 0;
  if (x < a + 1) {
    let sum = 1 / a;
    let term = sum;
    for (let n = 1; n < 500; n++) {
      term *= x / (a + n);
      sum += term;
      if (Math.abs(term) < Math.abs(sum) * 1e-15) break;
    }
    return sum * Math.exp(-x + a * Math.log(x) - lgamma(a));
  }
  // Continued fraction for Q, then P = 1 - Q.
  let b = x + 1 - a;
  let c = 1e300;
  let d = 1 / b;
  let h = d;
  for (let i = 1; i < 500; i++) {
    const an = -i * (i - a);
    b += 2;
    d = an * d + b;
    if (Math.abs(d) < 1e-300) d = 1e-300;
    c = b + an / c;
    if (Math.abs(c) < 1e-300) c = 1e-300;
    d = 1 / d;
    const del = d * c;
    h *= del;
    if (Math.abs(del - 1) < 1e-15) break;
  }
  return 1 - Math.exp(-x + a * Math.log(x) - lgamma(a)) * h;
}

function betacf(a: number, b: number, x: number): number {
  const qab = a + b;
  const qap = a + 1;
  const qam = a - 1;
  let c = 1;
  let d = 1 - (qab * x) / qap;
  if (Math.abs(d) < 1e-300) d = 1e-300;
  d = 1 / d;
  let h = d;
  for (let m = 1; m < 500; m++) {
    const m2 = 2 * m;
    let aa = (m * (b - m) * x) / ((qam + m2) * (a + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < 1e-300) d = 1e-300;
    c = 1 + aa / c;
    if (Math.abs(c) < 1e-300) c = 1e-300;
    d = 1 / d;
    h *= d * c;
    aa = (-(a + m) * (qab + m) * x) / ((a + m2) * (qap + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < 1e-300) d = 1e-300;
    c = 1 + aa / c;
    if (Math.abs(c) < 1e-300) c = 1e-300;
    d = 1 / d;
    const del = d * c;
    h *= del;
    if (Math.abs(del - 1) < 1e-15) break;
  }
  return h;
}

/** Regularized incomplete beta I_x(a, b). */
export function betaI(a: number, b: number, x: number): number {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const bt = Math.exp(lgamma(a + b) - lgamma(a) - lgamma(b) + a * Math.log(x) + b * Math.log(1 - x));
  return x < (a + 1) / (a + b + 2) ? (bt * betacf(a, b, x)) / a : 1 - (bt * betacf(b, a, 1 - x)) / b;
}

export function erf(x: number): number {
  return x >= 0 ? gammaP(0.5, x * x) : -gammaP(0.5, x * x);
}

export const normpdf = (x: number, mu = 0, sd = 1) => Math.exp(-0.5 * ((x - mu) / sd) ** 2) / (sd * Math.sqrt(2 * Math.PI));

export function normcdf(x: number, mu = 0, sd = 1): number {
  const z = (x - mu) / sd;
  return 0.5 * (1 + erf(z / Math.SQRT2));
}

/** Inverse normal CDF (Acklam's approximation polished with Newton steps). */
export function invnorm(p: number, mu = 0, sd = 1): number {
  if (!(p > 0 && p < 1)) throw new Error("invnorm needs a probability between 0 and 1");
  const a = [-39.69683028665376, 220.9460984245205, -275.9285104469687, 138.357751867269, -30.66479806614716, 2.506628277459239];
  const b = [-54.47609879822406, 161.5858368580409, -155.6989798598866, 66.80131188771972, -13.28068155288572];
  const c = [-0.007784894002430293, -0.3223964580411365, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
  const d = [0.007784695709041462, 0.3224671290700398, 2.445134137142996, 3.754408661907416];
  const pl = 0.02425;
  let z: number;
  if (p < pl) {
    const q = Math.sqrt(-2 * Math.log(p));
    z = (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  } else if (p <= 1 - pl) {
    const q = p - 0.5;
    const r = q * q;
    z = ((((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q) / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
  } else {
    const q = Math.sqrt(-2 * Math.log(1 - p));
    z = -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
  for (let i = 0; i < 3; i++) z -= (normcdf(z) - p) / normpdf(z);
  return mu + sd * z;
}

export function tcdf(t: number, df: number): number {
  const x = df / (df + t * t);
  const tail = 0.5 * betaI(df / 2, 0.5, x);
  return t >= 0 ? 1 - tail : tail;
}

export const tpdf = (t: number, df: number) =>
  Math.exp(lgamma((df + 1) / 2) - lgamma(df / 2) - 0.5 * Math.log(df * Math.PI) - ((df + 1) / 2) * Math.log(1 + (t * t) / df));

export const chi2cdf = (x: number, df: number) => (x <= 0 ? 0 : gammaP(df / 2, x / 2));
export const chi2pdf = (x: number, df: number) =>
  x <= 0 ? 0 : Math.exp((df / 2 - 1) * Math.log(x) - x / 2 - (df / 2) * Math.LN2 - lgamma(df / 2));
export const fcdf = (x: number, d1: number, d2: number) => (x <= 0 ? 0 : betaI(d1 / 2, d2 / 2, (d1 * x) / (d1 * x + d2)));

/** Invert an increasing CDF on (lo, hi) by bisection. */
function invert(cdf: (x: number) => number, p: number, lo: number, hi: number): number {
  if (!(p > 0 && p < 1)) throw new Error("Inverse CDFs need a probability between 0 and 1");
  while (cdf(hi) < p) hi *= 2;
  while (cdf(lo) > p) lo = lo < 0 ? lo * 2 : lo / 2 - 1;
  for (let i = 0; i < 200; i++) {
    const m = (lo + hi) / 2;
    if (cdf(m) < p) lo = m;
    else hi = m;
    if (hi - lo < 1e-12 * Math.max(1, Math.abs(m))) break;
  }
  return (lo + hi) / 2;
}

export const invt = (p: number, df: number) => invert((t) => tcdf(t, df), p, -50, 50);
export const invchi2 = (p: number, df: number) => invert((x) => chi2cdf(x, df), p, 0, Math.max(10, df * 4));

const lchoose = (n: number, k: number) => lgamma(n + 1) - lgamma(k + 1) - lgamma(n - k + 1);

export function binompdf(n: number, p: number, k: number): number {
  if (!Number.isInteger(k) || k < 0 || k > n) return 0;
  if (p === 0) return k === 0 ? 1 : 0;
  if (p === 1) return k === n ? 1 : 0;
  return Math.exp(lchoose(n, k) + k * Math.log(p) + (n - k) * Math.log(1 - p));
}

export function binomcdf(n: number, p: number, k: number): number {
  let s = 0;
  for (let i = 0; i <= Math.min(n, Math.floor(k)); i++) s += binompdf(n, p, i);
  return Math.min(1, s);
}

export function poissonpdf(lambda: number, k: number): number {
  if (!Number.isInteger(k) || k < 0) return 0;
  return Math.exp(-lambda + k * Math.log(lambda) - lgamma(k + 1));
}

export function poissoncdf(lambda: number, k: number): number {
  let s = 0;
  for (let i = 0; i <= Math.floor(k); i++) s += poissonpdf(lambda, i);
  return Math.min(1, s);
}

/** P(first success on trial k). */
export const geompdf = (p: number, k: number) => (k >= 1 && Number.isInteger(k) ? (1 - p) ** (k - 1) * p : 0);
export const geomcdf = (p: number, k: number) => (k >= 1 ? 1 - (1 - p) ** Math.floor(k) : 0);

// --- Summary statistics of a list of numbers -------------------------------------

const need = (xs: number[], n: number, name: string) => {
  if (xs.length < n) throw new Error(`${name} needs at least ${n} number(s)`);
};
export const mean = (...xs: number[]) => (need(xs, 1, "mean"), xs.reduce((s, x) => s + x, 0) / xs.length);
export function median(...xs: number[]): number {
  need(xs, 1, "median");
  const s = [...xs].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}
/** Sample variance (n - 1). */
export function variance(...xs: number[]): number {
  need(xs, 2, "variance");
  const m = mean(...xs);
  return xs.reduce((s, x) => s + (x - m) ** 2, 0) / (xs.length - 1);
}
/** Population variance (n). */
export function pvariance(...xs: number[]): number {
  need(xs, 1, "pvariance");
  const m = mean(...xs);
  return xs.reduce((s, x) => s + (x - m) ** 2, 0) / xs.length;
}
export const stdev = (...xs: number[]) => Math.sqrt(variance(...xs));
export const pstdev = (...xs: number[]) => Math.sqrt(pvariance(...xs));
export const total = (...xs: number[]) => xs.reduce((s, x) => s + x, 0);

/** Quartile k (0–4) by the median-of-halves method taught in most intro courses. */
export function quartile(k: number, ...xs: number[]): number {
  need(xs, 1, "quartile");
  const s = [...xs].sort((a, b) => a - b);
  if (k === 0) return s[0];
  if (k === 4) return s[s.length - 1];
  if (k === 2) return median(...s);
  const h = s.length >> 1;
  const lower = s.slice(0, h);
  const upper = s.slice(s.length % 2 ? h + 1 : h);
  if (!lower.length) return s[0];
  return k === 1 ? median(...lower) : median(...upper);
}

export function isprime(n: number): number {
  if (!Number.isInteger(n) || n < 2) return 0;
  for (let i = 2; i * i <= n; i++) if (n % i === 0) return 0;
  return 1;
}

export const STATS_FUNCS: Record<string, (...a: number[]) => number> = {
  gamma,
  lgamma,
  erf,
  normpdf,
  normcdf,
  invnorm,
  tpdf,
  tcdf,
  invt,
  chi2pdf,
  chi2cdf,
  invchi2,
  fcdf,
  binompdf,
  binomcdf,
  poissonpdf,
  poissoncdf,
  geompdf,
  geomcdf,
  mean,
  median,
  variance,
  pvariance,
  stdev,
  pstdev,
  total,
  quartile,
  isprime,
};

import { evaluate, compileFuncs } from "../src/lib/expr.ts";
import { generate, checkAll, formatNum } from "../src/lib/drills.ts";
import { renderFigure } from "../src/lib/figure.ts";
let fails = 0;
const eq = (name: string, got: number, want: number, tol = 1e-6) => {
  const ok = Math.abs(got - want) <= tol * Math.max(1, Math.abs(want));
  if (!ok) { fails++; console.log("FAIL", name, got, "want", want); }
};
const E = (s: string, sc: Record<string, number> = {}, f?: any, o?: any) => evaluate(s, sc, f, o);
eq("prec", E("2+3*4^2"), 50);
eq("neg pow", E("-2^2"), -4);
eq("pow right", E("2^3^2"), 512);
eq("neg exp", E("(1+0.01)^(-360)"), 1.01 ** -360);
eq("sci", E("6.02e23 * 2"), 1.204e24);
eq("trig", E("sin(pi/6)"), 0.5);
eq("trigd", E("cosd(60)"), 0.5);
eq("atand", E("atand(1)"), 45);
eq("log", E("log(1000)"), 3); eq("ln", E("ln(e^2)"), 2); eq("logb", E("log(8, 2)"), 3);
eq("fact", E("5!"), 120); eq("nCr", E("nCr(10,3)"), 120); eq("nPr", E("nPr(5,2)"), 20);
eq("cbrt neg", E("(-8)^(1/3)"), -2);
eq("cmp", E("3 > 2 and 1 == 1"), 1); eq("if", E("if(2 < 1, 5, 7)"), 7); eq("not", E("not (2 > 1)"), 0);
eq("abs bars", E("|3 - 10|"), 7);
eq("unicode", E("2×3 − 1 ÷ 2 + √(16) + π - pi"), 9.5);
eq("old drill", E("round(1000 * 0.005 / (1 - (1 + 0.005) ^ (-360)), 2)"), 6);
// statistics and distributions
eq("normcdf", E("normcdf(1.96)"), 0.9750021048517795, 1e-9);
eq("normcdf mu sd", E("normcdf(130, 100, 15)"), 0.9772498680518208, 1e-9);
eq("invnorm", E("invnorm(0.975)"), 1.959963984540054, 1e-9);
eq("tcdf", E("tcdf(2.228138851986, 10)"), 0.975, 1e-9);
eq("invt", E("invt(0.95, 5)"), 2.015048372669157, 1e-9);
eq("chi2cdf", E("chi2cdf(3.841458820694124, 1)"), 0.95, 1e-9);
eq("binompdf", E("binompdf(10, 0.5, 5)"), 0.24609375, 1e-9);
eq("binomcdf", E("binomcdf(10, 0.3, 3)"), 0.6496107184, 1e-9);
eq("poisson", E("poissonpdf(3, 2)"), 4.5 * Math.exp(-3), 1e-9);
eq("geom", E("geompdf(0.2, 3)"), 0.128, 1e-9);
eq("mean", E("mean(1, 2, 3, 4)"), 2.5);
eq("median", E("median(5, 1, 3, 2)"), 2.5);
eq("stdev", E("stdev(2, 4, 4, 4, 5, 5, 7, 9)"), Math.sqrt(32 / 7));
eq("pstdev", E("pstdev(2, 4, 4, 4, 5, 5, 7, 9)"), 2);
eq("quartile", E("quartile(1, 1, 2, 3, 4, 5, 6, 7, 8)"), 2.5);
eq("sec", E("sec(pi/3)"), 2); eq("cotd", E("cotd(45)"), 1);
eq("isprime", E("isprime(91) + isprime(97)"), 1);
eq("name as var", E("mean * 2 + total", { mean: 3, total: 1 }), 7);
// implicit (typed answers)
eq("impl 2x", E("2x", { x: 3 }, undefined, { implicit: true }), 6);
eq("impl 3(x+1)", E("3(x+1)", { x: 3 }, undefined, { implicit: true }), 12);
eq("impl 2pi", E("2pi", {}, undefined, { implicit: true }), 2 * Math.PI);
eq("impl xy", E("xy + 2x^2y", { x: 2, y: 3 }, undefined, { implicit: true }), 6 + 24);
eq("impl sqrt3/2", E("sqrt(3)/2", {}, undefined, { implicit: true }), Math.sqrt(3) / 2);
eq("impl sin x", E("3sin(x)", { x: 1 }, undefined, { implicit: true }), 3 * Math.sin(1));
// user functions + calculus
const F = compileFuncs({ "f(x)": "a*x^3 - 2*x", "g(t)": "f(t) + 1", "h(x,y)": "x^2 + y^2" });
const sc = { a: 2 };
eq("uf", E("f(2)", sc, F), 12);
eq("uf nested", E("g(1)", sc, F), 1);
eq("uf 2arg", E("h(3,4)", sc, F), 25);
eq("deriv", E("deriv(f, 2)", sc, F), 22, 1e-6);
eq("deriv2", E("deriv(f, 2, 2)", sc, F), 24, 1e-4);
eq("integ", E("integ(f, 0, 2)", sc, F), 2 * 16 / 4 - 4, 1e-8);
eq("integ sin", E("integ(sin, 0, pi)"), 2, 1e-8);
eq("solve", E("solve(f, 0.5, 2)", sc, F), 1, 1e-9);
const L = compileFuncs({ "q(x)": "(x^2 - 9)/(x - 3)", "s(x)": "sin(x)/x" });
eq("limit", E("limit(q, 3)", {}, L), 6, 1e-6);
eq("limit sinx/x", E("limit(s, 0)", {}, L), 1, 1e-6);
const P = compileFuncs({ "p(x)": "-(x-3)^2 + 5", "t(k)": "1/k^2" });
eq("extremum max", E("extremum(p, 0, 10, 1)", {}, P), 3, 1e-6);
eq("sum", E("sum(t, 1, 3)", {}, P), 1 + 1 / 4 + 1 / 9);
// errors
for (const bad of ["2 +", "foo(2)", "2 $ 3", "sqrt(-1)", "1/0"]) {
  try { E(bad); fails++; console.log("FAIL no error for", bad); } catch {}
}
// where re-roll
const quad = { id: "q", title: "Quadratic", vars: { a: { min: 1, max: 3 }, b: { min: -10, max: 10 }, c: { min: -10, max: 10 } },
  calc: { disc: "b^2 - 4*a*c", root: "(-b + sqrt(disc)) / (2*a)" }, where: ["disc > 0", "root == round(root)"],
  prompt: "", answer: "root", format: "number" as const, solution: "" };
for (let i = 0; i < 200; i++) { const g = generate(quad as any); const r = g.answer as number; if (Math.round(r) !== r) { fails++; console.log("FAIL where", g.values); break; } }
// Typed answers with run-together names
const I = (src: string, sc: Record<string, number>) => evaluate(src, sc, undefined, { implicit: true });
eq("te^t", I("5te^(2t)", { t: 1.3 }), 5 * 1.3 * Math.exp(2.6), 1e-9);
eq("tsin(t)", I("tsin(t)", { t: 0.7 }), 0.7 * Math.sin(0.7), 1e-12);
eq("xe^x", I("xe^x", { x: 2 }), 2 * Math.exp(2), 1e-9);
eq("2xpi", I("2xpi", { x: 3 }), 6 * Math.PI, 1e-12);
eq("xy^2", I("xy^2", { x: 2, y: 3 }), 18, 1e-12);
eq("e^(-t)cos(2t)", I("e^(-t)cos(2t)", { t: 0.5 }), Math.exp(-0.5) * Math.cos(1), 1e-12);
// No negative zero in formatted numbers.
for (const [v, f, want] of [[-0.0004, "num2", "0.00"], [-0, undefined, "0"], [-0.3, "dp0", "0"], [-0.5, "num1", "-0.5"], [-0.001, "money", "$0.00"]] as const) {
  const got = formatNum(v, f as string | undefined);
  if (got !== want) { fails++; console.log("FAIL -0 format", v, f, got); }
}
// Typing exactly the shown (rounded) answer is accepted, even with a tight tolerance.
const third = { id: "t", title: "Third", vars: { a: { choices: [7] } }, calc: { r: "a/3" }, prompt: "", answer: "r",
  answers: [{ name: "r", format: "num2", tolerance: 0.0001 }], solution: "" };
{ const g = generate(third as any); const ok = checkAll(g, ["2.33"])[0].ok, bad = checkAll(g, ["2.34"])[0].ok;
  if (!ok || bad) { fails++; console.log("FAIL shown value", g.parts[0].display, ok, bad); } }
// Exact fraction cancellation must not be confused with intentionally tiny values.
// This fixed tuple reproduces the former random precalculus recurrence failure.
{
  const recurrence = { id: "fraction-zero", title: "Exact recurrence", vars: { rat: { choices: [-2] }, add: { choices: [8] }, st: { choices: [3] }, m: { choices: [3] } },
    calc: { fix: "add/(1-rat)", gap: "st-fix", am: "fix+gap*rat^m" }, prompt: "", answer: "am", format: "number", solution: "",
    answers: [{ name: "fix", kind: "fraction" }, { name: "am", kind: "fraction" }] };
  const authoredBefore = JSON.stringify(recurrence);
  const g = generate(recurrence as any);
  if (JSON.stringify(recurrence) !== authoredBefore) { fails++; console.log("FAIL zero proof changed authored drill"); }
  if (g.values.am === 0 || g.parts[1].target !== 0 || !checkAll(g, ["8/3", "0"]).every(r => r.ok) || checkAll(g, ["8/3", "1/1000000"])[1].ok) {
    fails++; console.log("FAIL exact cancellation proof", g.values, g.parts, checkAll(g, ["8/3", "0"]));
  }
  for (const [label, calc, answers, vars] of [
    ["tiny fraction", { am: "1e-20" }, [{ name: "am", kind: "fraction" }], {}],
    ["tiny numeric", { am: "1e-20" }, [{ name: "am", kind: "number", format: "sci" }], {}],
    ["unsupported function", { am: "sin(pi)" }, [{ name: "am", kind: "fraction" }], {}],
    ["overwritten sampled input", { am: "am/3" }, [{ name: "am", kind: "fraction" }], { am: { choices: [1e-20] } }],
    ["explicit relative tolerance", { am: "1e-20" }, [{ name: "am", kind: "fraction", relTolerance: 0.01 }], {}],
    ["bounded large power", { am: "2^-80" }, [{ name: "am", kind: "fraction" }], {}],
  ] as const) {
    const tiny = generate({ ...recurrence, vars, calc, answers } as any);
    if (tiny.parts[0].target === 0 || checkAll(tiny, ["0"])[0].ok) { fails++; console.log("FAIL zero proof refuses " + label, tiny.parts[0]); }
  }
  // Proof bounds are conservative: exceeding them never snaps an unproven float.
  const oversized = generate({ ...recurrence, calc: { ...Object.fromEntries(Array.from({ length: 129 }, (_, i) => [`extra${i}`, i])), ...recurrence.calc } } as any);
  if (oversized.parts[1].target === 0 || checkAll(oversized, ["8/3", "0"])[1].ok) { fails++; console.log("FAIL bounded zero proof"); }
  const exhausted = generate({ ...recurrence, calc: { ...Object.fromEntries(Array.from({ length: 64 }, (_, i) => [`extra${i}`, "1+2+3"])), ...recurrence.calc } } as any);
  if (exhausted.parts[1].target === 0 || checkAll(exhausted, ["8/3", "0"])[1].ok) { fails++; console.log("FAIL zero proof operation budget"); }
  const permissive = generate({ ...recurrence, vars: {}, calc: { am: "1e-20" }, answers: [{ name: "am", kind: "fraction", tolerance: 1e-10 }] } as any);
  if (!checkAll(permissive, ["0"])[0].ok) { fails++; console.log("FAIL explicit fraction tolerance preserved"); }
}
// Numbers filled into TeX keep a tight thousands separator; plain text keeps the comma.
{ const d = { id: "c", title: "Commas", vars: { n: { choices: [5000] } }, calc: {}, prompt: "Text {n} and $x = {n}$ and $$y={n:int}$$ then {n}", answer: "n", format: "number", solution: "" };
  const g = generate(d as any);
  if (g.prompt !== "Text 5,000 and $x = 5{,}000$ and $$y=5{,}000$$ then 5,000") { fails++; console.log("FAIL math commas", g.prompt); } }
for (const [v, f, want] of [[1.8, "sig3", "1.80"], [12345, "sig3", "12300"], [0.000123, "sig2", "0.00012"]] as const) {
  const got = formatNum(v, f);
  if (got !== want) { fails++; console.log("FAIL sig format", v, f, got); }
}
// Figures: field grids land exactly on the singularity (skipped), outlier arrows are capped,
// fully labelled bars drop the x numbers, and the y-axis can sit on the left edge.
{ const svg = renderFigure({ type: "plot", x: [-2, 2], y: [-2, 2], vectorField: { u: "x/(x^2+y^2)^1.5", v: "y/(x^2+y^2)^1.5", step: 0.4 } } as any);
  const lens = [...svg.matchAll(/class="fig-field" x1="([\d.]+)" y1="([\d.]+)" x2="([\d.]+)" y2="([\d.]+)"/g)].map((m) => Math.hypot(+m[3] - +m[1], +m[4] - +m[2]));
  const sorted = [...lens].sort((a, b) => a - b);
  if (!lens.length || svg.includes("NaN") || sorted[Math.floor(lens.length / 2)] < 1 || sorted[lens.length - 1] > 40) { fails++; console.log("FAIL vector field scaling", sorted[Math.floor(lens.length / 2)], sorted[lens.length - 1]); } }
{ const bars = renderFigure({ type: "plot", x: [0, 3], y: [0, 5], bars: [{ x: 1, height: 2, label: "A" }, { x: 2, height: 3, label: "B" }] } as any);
  if (/>1<\/text>/.test(bars.replace(/text-anchor="end">\d/g, "")) || !bars.includes(">A<")) { fails++; console.log("FAIL bar labels vs ticks"); }
  const left = renderFigure({ type: "plot", x: [-4, 4], y: [-2, 6], yAxisAt: "left" } as any);
  if (!left.includes(">0</text>")) { fails++; console.log("FAIL yAxisAt left keeps the 0 tick"); } }
// A filled coefficient of 1 or -1 before a letter drops the 1 (inside math only, default format).
{ const d = { id: "k", title: "Coef", vars: { a: { choices: [1] }, b: { choices: [-1] } }, calc: {}, prompt: "$y = {a}x + {b}t$, $2^{a}x$, ${a}(3)$, {a}x", answer: "a", format: "number", solution: "" };
  const g = generate(d as any);
  if (g.prompt !== "$y = x + -t$, $2^1x$, $1(3)$, 1x") { fails++; console.log("FAIL coef 1", g.prompt); } }
console.log(fails ? `${fails} FAILURES` : "all engine tests passed");

if (fails) process.exitCode = 1;

import { evaluate, compileFuncs } from "../src/lib/expr.ts";
import { generate, checkAll } from "../src/lib/drills.ts";
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
// Typing exactly the shown (rounded) answer is accepted, even with a tight tolerance.
const third = { id: "t", title: "Third", vars: { a: { choices: [7] } }, calc: { r: "a/3" }, prompt: "", answer: "r",
  answers: [{ name: "r", format: "num2", tolerance: 0.0001 }], solution: "" };
{ const g = generate(third as any); const ok = checkAll(g, ["2.33"])[0].ok, bad = checkAll(g, ["2.34"])[0].ok;
  if (!ok || bad) { fails++; console.log("FAIL shown value", g.parts[0].display, ok, bad); } }
console.log(fails ? `${fails} FAILURES` : "all engine tests passed");

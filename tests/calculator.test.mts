import { evaluate } from "../src/lib/expr.ts";
import { formatResult, toEngine } from "../src/components/Calculator.tsx";
import { calcKind } from "../src/lib/calcKind.ts";

let fails = 0;
const ok = (name: string, cond: boolean, extra?: unknown) => {
  if (!cond) {
    fails++;
    console.log("FAIL", name, extra ?? "");
  }
};
const calc = (s: string, deg = false, ans = 0) => evaluate(toEngine(s, deg), { ans }, undefined, { implicit: true });

ok("precedence", calc("2+3×4") === 14);
ok("percent of", Math.abs(calc("200×15%") - 30) < 1e-12, calc("200×15%"));
ok("divide sign", calc("10÷4") === 2.5);
ok("unicode minus", calc("5−7") === -2);
ok("pi and implicit", Math.abs(calc("2π") - 2 * Math.PI) < 1e-12);
ok("sqrt symbol", calc("√(16)") === 4);
ok("square", calc("3²") === 9);
ok("degrees", Math.abs(calc("sin(30)", true) - 0.5) < 1e-12, calc("sin(30)", true));
ok("radians", Math.abs(calc("sin(pi/2)")) - 1 < 1e-12);
ok("inverse in degrees", Math.abs(calc("asin(0.5)", true) - 30) < 1e-9);
ok("Ans", calc("Ans×2", false, 21) === 42);
ok("EE", calc("3×10^4") === 30000);
ok("factorial", calc("5!") === 120);
ok("nCr", calc("nCr(6,2)") === 15);
ok("format big", formatResult(1.234e15) === "1.234 × 10^15", formatResult(1.234e15));
ok("format rounding", formatResult(0.1 + 0.2) === "0.3", formatResult(0.1 + 0.2));
ok("format int", formatResult(42) === "42");
ok("no course: scientific", calcKind(undefined) === "scientific");
ok("real estate: basic", calcKind({ id: "colorado-broker" } as never) === "basic");
ok("algebra: graphing", calcKind({ id: "math-algebra1" } as never) === "graphing");
ok("course override", calcKind({ calculator: "basic" } as never) === "basic");

if (fails) {
  console.log(`${fails} calculator test(s) failed`);
  process.exit(1);
}
console.log("calculator tests passed");

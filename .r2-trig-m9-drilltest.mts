import { generate, checkAll } from "./src/lib/drills.ts";
import fs from "fs";
const drills = JSON.parse(fs.readFileSync("/tmp/r2-trig-m9/dt/drills.json", "utf8"));
const rad = (d: number) => (d * Math.PI) / 180;
const own: Record<string, (v: any) => number[]> = {
  "trig-m9-r2-polar-conic": (v) => [v.m / v.c, v.sg * v.dd],
  "trig-m9-r2-orbit": (v) => [v.a * (1 - v.ecc), v.a * (1 + v.ecc), v.a * (1 - v.ecc ** 2)],
  "trig-m9-r2-cycloid-point": (v) => { const t = rad(v.deg); return [v.a * (t - Math.sin(t)), v.a * (1 - Math.cos(t))]; },
  "trig-m9-r2-roulette": (v) => {
    const a = v.k * v.b, b = v.b, t = rad(v.deg);
    if (v.kind === 0) return [v.k, (a + b) * Math.cos(t) - b * Math.cos(((a + b) / b) * t), (a + b) * Math.sin(t) - b * Math.sin(((a + b) / b) * t)];
    return [v.k, (a - b) * Math.cos(t) + b * Math.cos(((a - b) / b) * t), (a - b) * Math.sin(t) - b * Math.sin(((a - b) / b) * t)];
  },
  "trig-m9-r2-five-angle": (v) => { const c = v.p / v.q; return [16 * c ** 5 - 20 * c ** 3 + 5 * c]; },
  "trig-m9-r2-unity-factor": (v) => [(360 * v.k) / v.n, -2 * Math.cos(rad((360 * v.k) / v.n))],
};
const dec: Record<string, number[]> = {
  "trig-m9-r2-polar-conic": [-1, -1], "trig-m9-r2-orbit": [2, 2, 2], "trig-m9-r2-cycloid-point": [2, 2],
  "trig-m9-r2-roulette": [0, 2, 2], "trig-m9-r2-five-angle": [-1], "trig-m9-r2-unity-factor": [2, 4],
};
for (const d of drills) {
  let bad = 0;
  for (let i = 0; i < 400; i++) {
    const inst = generate(d);
    const want = own[d.id](inst.values);
    // typed answers: correctly rounded values (or exact fraction strings)
    const typed = want.map((w, j) => {
      if (d.id === "trig-m9-r2-five-angle") { const v: any = inst.values; return `${v.n2}/${v.d2}`; }
      if (d.id === "trig-m9-r2-polar-conic" && j === 0) { const v: any = inst.values; return `${v.m}/${v.c}`; }
      return dec[d.id][j] >= 0 ? w.toFixed(dec[d.id][j]) : String(w);
    });
    const res = checkAll(inst, typed);
    const shown = checkAll(inst, inst.parts.map((p: any) => String(p.shownValue ?? p.target)));
    const wrong = checkAll(inst, want.map((w) => String(w + 1)));
    const mism = inst.parts.some((p: any, j: number) => Math.abs((p.target ?? NaN) - want[j]) > 1e-9);
    if (mism || !res.every((r) => r.ok) || !shown.every((r) => r.ok) || wrong.every((r) => r.ok)) {
      bad++;
      if (bad < 4) console.log(d.id, JSON.stringify(inst.values), typed, res.map((r) => r.ok), shown.map((r) => r.ok), mism);
    }
    if (i === 0) console.log("\n==", d.id, "\n", inst.prompt, "\n", inst.solution, "\n", inst.parts.map((p: any) => p.display + " | " + (p.spec.label ?? "")).join(" ; "));
  }
  console.log(d.id, "bad", bad);
}

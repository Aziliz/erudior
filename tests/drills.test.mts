// Every bundled course must pass the full course check (drills, figures, notation),
// and dollar amounts in the real estate course must never be read as math. Run: npm test
import "./drill-tex-boundaries.test.mts";
import { readFileSync, readdirSync } from "node:fs";
import { normalizeCourse } from "../src/lib/course.ts";
import { splitMath } from "../src/lib/math.ts";
import { checkCourse } from "./check-course.mts";

let bad = 0;
const files = [
  "samples/math-sampler-course.json",
  ...readdirSync("samples/math").filter((f) => f.endsWith(".json")).map((f) => `samples/math/${f}`),
];
for (const file of files) {
  const p = await checkCourse(file, { runs: 20 });
  if (p.length) console.log(`${file}: ${p.length} problem(s)\n  ${p.slice(0, 30).join("\n  ")}`);
  bad += p.length;
}

// The real estate course: drills only (its text has prices, not math).
const co = "samples/colorado-broker-course.json";
const p = await checkCourse(co, { runs: 40, money: true });
if (p.length) console.log(`${co}: ${p.length} problem(s)\n  ${p.slice(0, 30).join("\n  ")}`);
bad += p.length;
const c = normalizeCourse(JSON.parse(readFileSync(co, "utf8")));
const texts: string[] = [];
for (const l of c.lessons) texts.push(l.body);
for (const q of c.banks[0].questions) texts.push(q.stem, ...q.choices, q.explanation ?? "");
for (const dk of c.decks) for (const k of dk.cards) texts.push(k.front, k.back);
const hits = texts.flatMap((t) => splitMath(t).filter((s) => s.math));
if (hits.length) {
  bad++;
  console.log("MONEY READ AS MATH", hits.slice(0, 5));
}
console.log(bad ? `${bad} course problems` : `all courses pass (${files.length + 1} files)`);
if (bad) process.exit(1);

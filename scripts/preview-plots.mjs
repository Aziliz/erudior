// Render every ```plot / ```figure / ```shape / ```numberline block in a lesson to PNG, with the
// app's own figure code and stylesheet, so label placement can be checked by eye.
//   node scripts/preview-plots.mjs content/math/calculus/lessons/25h2-sums.md /tmp/me/plots [--dark] [--width 680]
// Writes <outdir>/<lesson>-fig<N>.png for each block (N counts from 1 in file order) and prints
// the paths. --width sets the lesson column width in px (default 680, about the app's column).
// PLAYWRIGHT_MODULE overrides where Playwright is found (e.g. a global install).
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright");
import { build } from "esbuild";
import { mkdirSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const args = process.argv.slice(2);
const dark = args.includes("--dark");
const wi = args.indexOf("--width");
const width = wi >= 0 ? Number(args[wi + 1]) : 680;
const files = args.filter((a, i) => !a.startsWith("--") && (wi < 0 || i !== wi + 1));
const [input, outDir = path.join(tmpdir(), "plots")] = files;
if (!input) {
  console.error("usage: node scripts/preview-plots.mjs <lesson.md> [outdir] [--dark] [--width 680]");
  process.exit(2);
}
mkdirSync(outDir, { recursive: true });

const bundle = path.join(tmpdir(), `figure-bundle-${process.pid}.mjs`);
await build({ entryPoints: [path.resolve("src/lib/figure.ts")], bundle: true, format: "esm", platform: "node", outfile: bundle, logLevel: "error" });
const { renderFigure } = await import(bundle);

const md = readFileSync(input, "utf8");
const blocks = [...md.matchAll(/```(plot|figure|shape|numberline)\s*\n([\s\S]*?)```/g)];
if (!blocks.length) {
  console.log("no figure blocks in", input);
  process.exit(0);
}
const css = readFileSync(path.resolve("src/styles.css"), "utf8");
const html = blocks.map(([, kind, body], i) => {
  try {
    const spec = JSON.parse(body);
    if (!spec.type) spec.type = kind === "shape" ? "shape" : kind === "numberline" ? "numberline" : "plot";
    return `<div class="one" id="f${i}">${renderFigure(spec, {})}</div>`;
  } catch (e) {
    return `<div class="one" id="f${i}"><p style="color:red">Figure ${i + 1} error: ${String(e.message ?? e)}</p></div>`;
  }
});

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: width + 40, height: 2000 }, deviceScaleFactor: 1 });
await page.setContent(
  `<html data-theme="${dark ? "dark" : "light"}"><head><style>${css}</style><style>body{margin:0;padding:16px} .one{width:${width}px;margin-bottom:24px}</style></head><body><div class="prose">${html.join("")}</div></body></html>`,
);
await page.waitForTimeout(200);
const base = path.basename(input, ".md");
for (let i = 0; i < blocks.length; i++) {
  const out = path.join(outDir, `${base}-fig${i + 1}.png`);
  await page.locator(`#f${i}`).screenshot({ path: out });
  console.log(out);
}
await browser.close();

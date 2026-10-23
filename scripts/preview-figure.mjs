// Render a course picture or diagram to PNG so you can look at it before using it.
//   node scripts/preview-figure.mjs content/math/biology/images/cell.svg  [out.png]
//   node scripts/preview-figure.mjs diagram.mmd [out.png] [--dark]
// .svg files are drawn as an <img> (the way lessons show them); .mmd files hold mermaid
// source and are drawn with the app's light (or --dark) colors. Labels for a label question
// can be checked with --markers '[{"x":30,"y":40},…]' (percent positions, numbered 1, 2, …).
// PLAYWRIGHT_MODULE overrides where Playwright is found (e.g. a global install).
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright");
import { readFileSync } from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const dark = args.includes("--dark");
const mi = args.indexOf("--markers");
const markers = mi >= 0 ? JSON.parse(args[mi + 1]) : [];
const files = args.filter((a, i) => !a.startsWith("--") && (mi < 0 || i !== mi + 1));
const [input, out = input.replace(/\.(svg|mmd|png|jpg)$/i, "") + ".preview.png"] = files;
const LIGHT = { bg: "#ffffff", ink: "#1c2833", soft: "#dde8f3", line: "#3e4c58", accent: "#244d76" };
const DARK = { bg: "#182126", ink: "#e4ebe7", soft: "#1f3245", line: "#b4c1ba", accent: "#99c3ea" };
const c = dark ? DARK : LIGHT;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 900, height: 4000 }, deviceScaleFactor: 1 });
if (/\.mmd$/i.test(input)) {
  await page.setContent(`<html><body style="margin:0;padding:16px;background:${c.bg};font-family:sans-serif"><div id="d"></div></body></html>`);
  await page.addScriptTag({ path: path.resolve("node_modules/mermaid/dist/mermaid.min.js") });
  const err = await page.evaluate(
    async ({ src, c }) => {
      try {
        // eslint-disable-next-line no-undef
        mermaid.initialize({ startOnLoad: false, securityLevel: "strict", theme: "base", htmlLabels: false, flowchart: { htmlLabels: false },
          themeVariables: { background: c.bg, primaryColor: c.soft, primaryTextColor: c.ink, primaryBorderColor: c.accent, lineColor: c.line, textColor: c.ink, edgeLabelBackground: c.bg, fontSize: "15px" } });
        // eslint-disable-next-line no-undef
        const { svg } = await mermaid.render("d1", src);
        document.getElementById("d").innerHTML = svg;
        return "";
      } catch (e) {
        return String(e.message ?? e);
      }
    },
    { src: readFileSync(input, "utf8"), c },
  );
  if (err) {
    console.error("mermaid error:", err);
    process.exit(1);
  }
} else {
  const type = input.endsWith(".svg") ? "image/svg+xml" : input.endsWith(".png") ? "image/png" : "image/jpeg";
  const src = `data:${type};base64,${readFileSync(input).toString("base64")}`;
  const dots = markers
    .map((m, i) => `<span style="position:absolute;left:${m.x}%;top:${m.y}%;transform:translate(-50%,-50%);background:#244d76;color:#fff;border:2px solid #fff;border-radius:50%;width:26px;height:26px;display:grid;place-items:center;font:bold 14px sans-serif">${i + 1}</span>`)
    .join("");
  await page.setContent(`<html><body style="margin:0;padding:16px;background:${c.bg}"><div style="position:relative;display:inline-block;max-width:860px"><img src="${src}" style="max-width:860px;display:block">${dots}</div></body></html>`);
}
await page.waitForTimeout(200);
const box = await page.locator("body > *").first().boundingBox();
await page.screenshot({ path: out, clip: { x: 0, y: 0, width: Math.ceil(Math.min(900, box.width + 32)), height: Math.ceil(box.height + 32) } });
await browser.close();
console.log(out);

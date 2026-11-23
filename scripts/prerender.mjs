// Saves rendered HTML of the public pages so search engines and link previews see real content
// without running JavaScript: erudior.com's pages into dist/__site/ and the app's library and
// library into dist/__app/. The Pages middleware renders individual course previews from GitHub;
// the app then starts as usual and redraws the page. Run after `npm run build` (website deploys
// only; the desktop app doesn't need it):
//   node scripts/prerender.mjs
// PLAYWRIGHT_MODULE overrides where Playwright is found.
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const pw = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright");
const { chromium } = pw.chromium ? pw : pw.default;
const root = path.resolve(import.meta.dirname, "..");
const dist = path.join(root, "dist");
const PORT = 4174;
const LOCAL = `http://localhost:${PORT}`;

const pages = [
  ...["/", "/programs", "/community", "/roadmap", "/download", "/engine-license", "/terms", "/privacy", "/licenses"].map((p) => ({ url: `https://erudior.com${p}`, out: `__site${p}`, wait: "main h1" })),
  { url: "https://app.erudior.com/", out: "__app/", wait: ".catalog" },
];

const server = spawn("npx", ["vite", "preview", "--port", String(PORT), "--strictPort"], { cwd: root, stdio: "ignore" });
const up = async () => {
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(LOCAL)).ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error("vite preview didn't start");
};

let failed = 0;
try {
  await up();
  const browser = await chromium.launch();
  for (const p of pages) {
    // A fresh context per page: no stored progress or settings.
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    // Serve erudior.com / app.erudior.com from the local build so the pages see their real host names.
    await ctx.route(/^https:\/\/(www\.|app\.)?erudior\.com\//, async (route) => {
      const u = new URL(route.request().url());
      const res = await fetch(LOCAL + u.pathname + u.search);
      await route.fulfill({ status: res.status, headers: Object.fromEntries(res.headers), body: Buffer.from(await res.arrayBuffer()) });
    });
    const page = await ctx.newPage();
    try {
      await page.goto(p.url, { waitUntil: "networkidle", timeout: 60000 });
      await page.waitForSelector(p.wait, { timeout: 30000 });
      if (p.url.endsWith("/engine-license")) await page.waitForSelector('pre[aria-label="Nonbinding proposed license text"]', { timeout: 30000 });
      await page.waitForTimeout(500);
      const html = await page.evaluate(() => {
        // Runtime-only bits that shouldn't be frozen into the file.
        document.querySelectorAll("[data-prerender-skip], .erudior-splash, .toast").forEach((el) => el.remove());
        return "<!doctype html>\n" + document.documentElement.outerHTML;
      });
      const file = path.join(dist, p.out.endsWith("/") ? p.out : p.out + "/", "index.html");
      mkdirSync(path.dirname(file), { recursive: true });
      writeFileSync(file, html);
      console.log(`${p.url} -> ${path.relative(root, file)} (${Math.round(html.length / 1024)} KB)`);
    } catch (e) {
      failed++;
      console.error(`FAILED ${p.url}: ${e.message.split("\n")[0]}`);
    }
    await ctx.close();
  }
  await browser.close();
} finally {
  server.kill();
}
// Public discovery snapshots are part of website release validation.
if (failed) {
  console.error(`${failed} page(s) not prerendered`);
  process.exitCode = 1;
}

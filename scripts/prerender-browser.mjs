// Exercise the generated HTML through the actual production host-routing middleware.
// Read-only synthetic browser contexts: no accounts or production data are changed.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { onRequest } from '../functions/_middleware.js';
const pw = await import(process.env.PLAYWRIGHT_MODULE ?? 'playwright');
const { chromium } = pw.chromium ? pw : pw.default;
const root = path.resolve(import.meta.dirname, '..');
const evidence = path.join(root, 'artifacts/prerender-browser');
mkdirSync(evidence, { recursive: true });
const local = 'http://127.0.0.1:4175';
const server = spawn('npx', ['vite', 'preview', '--host', '127.0.0.1', '--port', '4175', '--strictPort'], { cwd: root, stdio: 'ignore' });
const results = [];
let browser;
try {
  let ready = false;
  for (let i=0; i<60; i++) {
    try { if ((await fetch(local)).ok) { ready=true; break; } } catch {}
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  assert.ok(ready, 'preview server starts');
  browser = await chromium.launch();
  for (const width of [1280, 320]) {
    for (const pagePath of ['/', '/roadmap', '/download', '/terms', '/privacy', '/licenses']) {
      const snapshot = readFileSync(path.join(root, 'dist/__site', pagePath, 'index.html'), 'utf8');
      assert.ok(!/class="[^"]*\berudior-splash\b/.test(snapshot), `${pagePath}: snapshot contains no startup overlay`);
      const context = await browser.newContext({ viewport: { width, height: 800 } });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await context.route(/^https:\/\/(www\.|app\.)?erudior\.com\//, async route => {
        const request = new Request(route.request().url());
        const asset = req => { const url = new URL(req.url); return fetch(local + url.pathname + url.search); };
        const response = await onRequest({ request, env: { ASSETS: { fetch: asset } }, next: () => asset(request) });
        await route.fulfill({ status: response.status, headers: Object.fromEntries(response.headers), body: Buffer.from(await response.arrayBuffer()) });
      });
      const label = `${width}-${pagePath.slice(1) || 'home'}`;
      try {
        await page.goto(`https://erudior.com${pagePath}`, { waitUntil: 'networkidle' });
        await page.locator('main h1').waitFor({ state: 'visible' });
        await page.locator('.erudior-splash').waitFor({ state: 'detached', timeout: 6000 });
        assert.equal(await page.locator('.erudior-splash').count(), 0, 'fresh startup clears all overlays');
        await page.screenshot({ path: path.join(evidence, `${label}-fresh.png`) });
        await page.reload({ waitUntil: 'networkidle' });
        await page.locator('main h1').waitFor({ state: 'visible' });
        assert.equal(await page.locator('.erudior-splash').count(), 0, 'repeat visit has no startup overlay');
        await page.screenshot({ path: path.join(evidence, `${label}-repeat.png`) });
        assert.deepEqual(errors, [], 'no page errors');
        results.push({ label, fresh: true, repeat: true });
      } catch (error) {
        await page.screenshot({ path: path.join(evidence, `${label}-failure.png`) });
        throw error;
      } finally { await context.close(); }
    }
  }
  // A cached pre-fix snapshot must also recover when it loads the current entry bundle.
  const context = await browser.newContext();
  const page = await context.newPage();
  await context.route(/^https:\/\/erudior\.com\//, async route => {
    const url = new URL(route.request().url());
    if (url.pathname === '/') {
      const html = readFileSync(path.join(root, 'dist/__site/index.html'), 'utf8').replace('</body>', '<div class="erudior-splash" role="status">Stale snapshot splash</div></body>');
      return route.fulfill({ status: 200, contentType: 'text/html', body: html });
    }
    const response = await fetch(local + url.pathname + url.search);
    await route.fulfill({ status: response.status, headers: Object.fromEntries(response.headers), body: Buffer.from(await response.arrayBuffer()) });
  });
  await page.goto('https://erudior.com/', { waitUntil: 'networkidle' });
  await page.locator('main h1').waitFor({ state: 'visible' });
  await page.locator('.erudior-splash').waitFor({ state: 'detached', timeout: 6000 });
  await page.reload({ waitUntil: 'networkidle' });
  assert.equal(await page.locator('.erudior-splash').count(), 0, 'cached orphan removed even when first-visit splash is skipped');
  results.push({ label: 'cached-legacy-overlay', fresh: true, repeat: true });
  await page.screenshot({ path: path.join(evidence, 'cached-legacy-recovered.png') });
  await context.close();
  writeFileSync(path.join(evidence, 'results.json'), JSON.stringify({ ok: true, results }, null, 2));
  console.log(`Served snapshot overlay checks passed: ${results.length} cases, fresh and repeat loads.`);
} catch (error) {
  writeFileSync(path.join(evidence, 'results.json'), JSON.stringify({ ok: false, results, error: String(error) }, null, 2));
  throw error;
} finally {
  await browser?.close();
  server.kill();
}

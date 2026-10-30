// Exercise the generated HTML through the actual production host-routing middleware.
// Read-only synthetic browser contexts: no accounts or production data are changed.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { onRequest } from '../functions/_middleware.js';
import { validateWebsiteCommunityOrigin } from './check-website-community-env.mjs';
const pw = await import(process.env.PLAYWRIGHT_MODULE ?? 'playwright');
const { chromium } = pw.chromium ? pw : pw.default;
const root = path.resolve(import.meta.dirname, '..');
const evidence = path.join(root, 'artifacts/prerender-browser');
mkdirSync(evidence, { recursive: true });
const local = 'http://127.0.0.1:4175';
// This is the expected deployment origin, not a source/dev-build override. Missing or
// incorrectly compiled configuration must fail the actual dist browser flow below.
const communityApi = new URL(validateWebsiteCommunityOrigin(process.env.VITE_COMMUNITY_API));
const fixture = { id: 'served-public-fixture', title: 'Synthetic served Community course', description: 'Synthetic production-bundle acceptance fixture.', subject: 'Science', level: 'Elementary School', type: 'Course', author: 'Synthetic creator', version: 1, review: 'not_reviewed', counts: { lessons: 1, questions: 1, cards: 0 }, updated: '2026-01-01T00:00:00Z' };
const fixtureDoc = { format: 'erudior-community', version: 1, title: fixture.title, description: fixture.description, subject: fixture.subject, level: fixture.level, type: fixture.type, lessons: [{ id: 'read', title: 'Synthetic served lesson', blocks: [{ type: 'text', md: 'Synthetic read-only lesson preview.' }, { type: 'question', id: 'q1', stem: 'Choose one.', choices: ['One', 'Two'], answer: [0], explanation: 'One.' }] }], decks: [] };
async function mockCommunity(context, requests = []) {
  await context.route(url => url.origin === communityApi.origin, async route => {
    const request = route.request(), url = new URL(request.url());
    const headers = await request.allHeaders();
    requests.push({ method: request.method(), path: url.pathname, cookie: headers.cookie || '', authorization: headers.authorization || '' });
    const publicRead = request.method() === 'GET' && ['/catalog', `/courses/${fixture.id}`].includes(url.pathname);
    await route.fulfill({ status: publicRead ? 200 : 403, contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify(!publicRead ? { error: 'Only synthetic public reads are allowed.' } : url.pathname === '/catalog' ? { format: 'erudior-community-catalog', version: 1, courses: [fixture] } : { ...fixture, doc: fixtureDoc }) });
  });
}
const server = spawn('npx', ['vite', 'preview', '--host', '127.0.0.1', '--port', '4175', '--strictPort'], { cwd: root, stdio: 'ignore' });
const results = [];
// Word boundaries also match hyphens: erudior-splash-polished is not the
// erudior-splash overlay. Keep the static safety check aligned with classList.
function hasStartupOverlay(html) {
  return [...html.matchAll(/\bclass\s*=\s*(["'])(.*?)\1/gs)]
    .some(match => match[2].split(/\s+/).includes('erudior-splash'));
}
assert.ok(hasStartupOverlay('<div class="erudior-splash erudior-splash-polished"></div>'));
assert.ok(hasStartupOverlay("<div class='extra erudior-splash'></div>"));
assert.ok(!hasStartupOverlay('<div class="erudior-brand-preview erudior-splash-polished"><div class="erudior-splash-book"></div></div>'));
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
    for (const pagePath of ['/', '/community', '/roadmap', '/download', '/terms', '/privacy', '/licenses']) {
      const snapshot = readFileSync(path.join(root, 'dist/__site', pagePath, 'index.html'), 'utf8');
      assert.ok(!hasStartupOverlay(snapshot), `${pagePath}: snapshot contains no startup overlay`);
      const context = await browser.newContext({ viewport: { width, height: 800 } });
      await mockCommunity(context);
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
  // Exercise the production bundle, middleware and real host selection. No Vite
  // define overrides, source imports, course installation or identity APIs.
  for (const colorScheme of ['light', 'dark']) for (const width of [1280, 320]) {
    const label = `community-served-${colorScheme}-${width}`;
    const context = await browser.newContext({ viewport: { width, height: 900 }, colorScheme });
    const requests = [], errors = [], unexpected = [];
    await context.addCookies([{ name: 'synthetic-author-cookie', value: 'must-not-send', domain: communityApi.hostname, path: '/', secure: true, sameSite: 'None' }]);
    await context.route('**/*', async route => {
      const request = route.request(), url = new URL(request.url());
      if (['erudior.com', 'www.erudior.com', 'app.erudior.com'].includes(url.hostname)) {
        if (request.method() !== 'GET' || ['/catalog', '/me'].includes(url.pathname) || url.pathname.startsWith('/courses/')) {
          unexpected.push(`${request.method()} ${url.href}`);
          return route.fulfill({ status: 403, body: 'Unexpected relative API or mutation.' });
        }
        const source = new Request(url.href);
        const asset = req => { const u = new URL(req.url); return fetch(local + u.pathname + u.search); };
        const response = await onRequest({ request: source, env: { ASSETS: { fetch: asset } }, next: () => asset(source) });
        return route.fulfill({ status: response.status, headers: Object.fromEntries(response.headers), body: Buffer.from(await response.arrayBuffer()) });
      }
      // Official catalog bootstrap is not needed for a read-only Community
      // preview. Do not contact live external services during fixture tests.
      return route.abort();
    });
    await mockCommunity(context, requests);
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    const heading = title => page.getByRole('heading', { name: title, exact: true });
    async function capture(state, target) {
      await page.locator('.erudior-splash').waitFor({ state: 'detached', timeout: 10000 });
      await page.evaluate(() => document.fonts.ready);
      if (target) await target.scrollIntoViewIfNeeded();
      assert.equal(await page.getByRole('alert').count(), 0, `${label}-${state}: no error alert`);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${label}-${state}: no page overflow`);
      await page.screenshot({ path: path.join(evidence, `${label}-${state}.png`), fullPage: false });
    }
    try {
      await page.goto('https://erudior.com/community', { waitUntil: 'networkidle' });
      await heading(fixture.title).waitFor();
      assert.ok(requests.some(request => request.path === '/catalog'), 'built bundle must request configured HTTPS API catalog');
      await capture('catalog-fresh', heading(fixture.title));
      await page.reload({ waitUntil: 'networkidle' });
      await heading(fixture.title).waitFor();
      await capture('catalog-reload', heading(fixture.title));
      await page.getByRole('link', { name: `View course: ${fixture.title}`, exact: true }).click();
      assert.equal(new URL(page.url()).pathname, `/community/${fixture.id}`);
      await heading(fixture.title).waitFor();
      await page.getByText('Synthetic served lesson', { exact: true }).waitFor();
      const learn = page.getByRole('link', { name: 'Learn in web app', exact: true });
      assert.equal(await learn.getAttribute('href'), `https://app.erudior.com/community/${fixture.id}`);
      await capture('detail', learn);
      await page.reload({ waitUntil: 'networkidle' });
      await page.getByText('Synthetic served lesson', { exact: true }).waitFor();
      await capture('detail-reload', learn);
      await page.goBack({ waitUntil: 'networkidle' });
      await heading('Community courses').waitFor();
      await heading(fixture.title).waitFor();
      await page.goForward({ waitUntil: 'networkidle' });
      await page.getByText('Synthetic served lesson', { exact: true }).waitFor();
      await capture('detail-history', learn);
      await learn.click();
      await page.waitForURL(`https://app.erudior.com/community/${fixture.id}`);
      await heading(fixture.title).waitFor();
      const start = page.getByRole('button', { name: 'Start or open course', exact: true });
      await start.waitFor();
      await capture('app-preview', start);
      await page.reload({ waitUntil: 'networkidle' });
      await start.waitFor();
      await capture('app-preview-reload', start);
      // Course storage is IndexedDB; inspect without writing or importing source.
      const installed = await page.evaluate(async () => {
        const names = await indexedDB.databases();
        const found = [];
        for (const { name } of names) {
          if (!name) continue;
          const db = await new Promise((resolve, reject) => { const request = indexedDB.open(name); request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error); });
          try {
            for (const store of db.objectStoreNames) {
              const keys = await new Promise((resolve, reject) => { const request = db.transaction(store, 'readonly').objectStore(store).getAllKeys(); request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error); });
              found.push(...keys.filter(key => String(key).includes('community-served-public-fixture')));
            }
          } finally { db.close(); }
        }
        return found;
      });
      assert.deepEqual(installed, [], 'read-only app preview must not install fixture course');
      assert.ok(requests.some(request => request.path === `/courses/${fixture.id}`), 'built bundle must request exact configured API detail');
      assert.ok(requests.every(request => request.method === 'GET' && ['/catalog', `/courses/${fixture.id}`].includes(request.path) && !request.cookie && !request.authorization), 'only cookie-free public GETs; no identity or author APIs');
      assert.deepEqual(unexpected, [], 'no relative fallback API requests or mutations');
      assert.deepEqual(errors, [], 'no uncaught production-bundle errors');
      results.push({ label, fresh: true, repeat: true, publicApiOrigin: communityApi.origin, requests, exactAppPreview: true, installed: false });
    } catch (error) {
      await page.screenshot({ path: path.join(evidence, `${label}-failure.png`) }).catch(() => {});
      writeFileSync(path.join(evidence, `${label}-failure.json`), JSON.stringify({ error: String(error), requests, errors, unexpected, url: page.url() }, null, 2));
      throw error;
    } finally { await context.close(); }
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

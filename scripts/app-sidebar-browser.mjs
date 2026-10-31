// Real App shell; isolated synthetic local profiles, no production API requests.
import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import react from '@vitejs/plugin-react';
const pw = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const chromium = pw.chromium || pw.default.chromium;
const root = fileURLToPath(new URL('../', import.meta.url));
const out = process.env.BROWSER_ARTIFACTS || path.join(root, 'test-results/app-sidebar');
await mkdir(out, { recursive: true });
const axe = await readFile(path.join(root, 'node_modules/axe-core/axe.min.js'), 'utf8');
const password = 'Synthetic sidebar password 2026';
const screenshots = [], checks = [], errors = [];
let server, browser, page, current = 'startup';
async function startServer(nativeLook) {
  server = await createServer({ root, configFile: false, plugins: [react()], server: { host: '127.0.0.1', port: 0 }, define: {
    __DEV_COURSE_KEY__: JSON.stringify(''),
    'import.meta.env.VITE_HOMESCHOOL': JSON.stringify(nativeLook ? '1' : ''),
    'import.meta.env.VITE_AS_DESKTOP': JSON.stringify(nativeLook ? '1' : ''),
    'import.meta.env.VITE_COURSES_URL': JSON.stringify(''),
    'import.meta.env.VITE_COMMUNITY_API': JSON.stringify('/test-community'),
  }, logLevel: 'warn' });
  await server.listen();
  return `http://127.0.0.1:${server.httpServer.address().port}`;
}
async function contextFor(origin, width) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: width === 320 ? 'dark' : 'light', reducedMotion: 'reduce' });
  await context.route('**/*', route => {
    const url = new URL(route.request().url());
    if (url.origin !== origin) return route.abort();
    if (url.pathname.startsWith('/test-community/')) return route.fulfill({ contentType: 'application/json', body: JSON.stringify(url.pathname.endsWith('/me') ? { user: null, providers: { google: false, github: false, dev: false } } : { courses: [] }) });
    return route.continue();
  });
  page = await context.newPage();
  page.setDefaultTimeout(20000);
  page.on('pageerror', error => errors.push({ current, message: error.message }));
  return context;
}
const logo = () => page.getByRole('button', { name: 'Open Erudior navigation', exact: true });
const drawer = () => page.getByRole('dialog');
const heading = text => page.getByRole('heading', { name: text, exact: true });
async function openMenu() { await logo().click(); await drawer().waitFor(); }
async function clickMenu(name) { await drawer().getByRole('button', { name, exact: true }).click(); }
async function seed(mode) {
  if (mode === 'solo') return;
  await page.evaluate(async ({ mode, password }) => {
    const { createFamily } = await import('/src/lib/family.ts');
    await createFamily({ mode, className: 'Synthetic classroom', state: mode === 'homeschool' ? 'GA' : '', route: 'Home education law', year: { start: '2026-08-01', end: '2027-07-31' }, dailyMinutes: 180, password, students: [{ name: 'Demo learner', grade: 8 }, { name: 'Other private learner', grade: 6 }] });
  }, { mode, password });
  await page.reload();
  await heading("Who's learning?").waitFor();
  await page.locator('.who-card').filter({ hasText: 'Demo learner' }).click();
  await page.getByLabel(`${mode === 'classroom' ? 'Teacher' : 'Parent'} password`, { exact: true }).fill(password);
  await page.getByRole('button', { name: 'Open', exact: true }).click();
  await heading('Library').waitFor();
}
async function audit(name) {
  current = name;
  await page.evaluate(() => document.fonts.ready);
  assert(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth) <= 1, 'No horizontal body overflow');
  assert(await drawer().evaluate(node => node.scrollWidth <= node.clientWidth + 1), 'No horizontal drawer overflow');
  await page.addScriptTag({ content: axe });
  const violations = await page.evaluate(async () => (await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] } })).violations.map(v => ({ id: v.id, targets: v.nodes.map(n => n.target) })));
  assert.deepEqual(violations, [], name + ': accessibility');
  await page.screenshot({ path: path.join(out, name + '.png') });
  screenshots.push(name + '.png');
}
try {
  browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH, args: ['--no-sandbox'] } : {});
  const origin = await startServer(true);
  for (const mode of ['solo', 'homeschool', 'classroom']) {
    for (const width of [1280, 320]) {
      current = `${mode}-${width}`;
      const context = await contextFor(origin, width);
      await page.goto(origin + '/?app');
      await heading('Library').waitFor();
      await seed(mode);
      await openMenu();
      const label = mode === 'homeschool' ? 'Family' : mode === 'classroom' ? 'Classroom' : null;
      const labels = await drawer().getByRole('navigation', { name: 'Sidebar learning' }).getByRole('button').allTextContents();
      for (const name of ['Courses','Notebook','Library','Community','Search']) assert(labels.some(text => text.startsWith(name)), name + ' available');
      assert.equal(labels.some(text => text.startsWith('Family')), label === 'Family');
      assert.equal(labels.some(text => text.startsWith('Classroom')), label === 'Classroom');
      await audit(`${mode}-${width}-navigation`);
      // The modal owns keyboard focus; underlying page navigation cannot receive Tab.
      for (let i = 0; i < 18; i++) {
        await page.keyboard.press(i % 2 ? 'Tab' : 'Shift+Tab');
        assert(await page.evaluate(() => !!document.activeElement?.closest('dialog')), 'Keyboard stays in modal');
      }
      await page.keyboard.press('Escape');
      await drawer().waitFor({ state: 'hidden' });
      assert(await logo().evaluate(node => node === document.activeElement), 'Escape restores logo focus');
      await openMenu();
      await page.mouse.click(width - 4, 450);
      await drawer().waitFor({ state: 'hidden' });
      await openMenu();
      await drawer().getByRole('button', { name: /^Courses/ }).click();
      await heading('Courses').waitFor();
      await drawer().waitFor({ state: 'hidden' });
      await openMenu();
      assert.equal(await drawer().getByRole('button', { name: /^Courses/ }).getAttribute('aria-current'), 'page');
      // Logo is now a menu, not a route change back to Library.
      assert.equal(await page.locator('main h1').textContent(), 'Courses');
      await page.keyboard.press('Escape');
      await page.evaluate(async () => { const mod = await import('/src/lib/navigationGuard.ts'); window.sidebarGuardOff = mod.registerNavigationGuard(() => false); });
      await openMenu();
      await drawer().getByRole('button', { name: /^Library/ }).click();
      await heading('Courses').waitFor();
      assert.equal(await page.locator('main h1').textContent(), 'Courses', 'Draft veto is respected');
      await page.evaluate(() => { window.sidebarGuardOff(); delete window.sidebarGuardOff; });
      await openMenu();
      await drawer().getByRole('button', { name: /^Account management/ }).click();
      await heading('Account management').waitFor();
      assert.equal(await drawer().getByText('Other private learner', { exact: true }).count(), 0, 'No sibling roster in menu');
      assert(await drawer().textContent().then(text => text.includes('not available yet')), 'No online-account claim');
      await audit(`${mode}-${width}-account`);
      await clickMenu('← All navigation');
      await drawer().getByRole('button', { name: /^Display settings/ }).click();
      await drawer().getByLabel('Theme', { exact: true }).selectOption('sepia');
      await drawer().getByLabel('Text size', { exact: true }).selectOption('130');
      await drawer().getByLabel('Reading width', { exact: true }).selectOption('comfortable');
      assert.equal(await page.locator('html').getAttribute('data-theme'), 'sepia');
      assert.equal(await page.locator('html').getAttribute('data-width'), 'comfortable');
      await audit(`${mode}-${width}-display-large`);
      await drawer().getByLabel('Text size', { exact: true }).selectOption('100');
      await drawer().getByLabel('Theme', { exact: true }).selectOption('system');
      await page.keyboard.press('Escape');
      if (label) {
        const adult = mode === 'classroom' ? 'Teacher' : 'Parent';
        await openMenu();
        await drawer().getByRole('button', { name: /^Account management/ }).click();
        await drawer().getByRole('button', { name: /^Manage learner profiles/ }).click();
        await page.getByLabel(`${adult} password`, { exact: true }).waitFor();
        const sections = page.getByRole('navigation', { name: `${adult} sections`, exact: true });
        assert.equal(await sections.count(), 0, 'Menu does not unlock adult records');
        await page.getByLabel(`${adult} password`, { exact: true }).fill(password);
        await page.getByRole('button', { name: 'Open', exact: true }).click();
        await sections.waitFor();
        await openMenu();
        await clickMenu('Lock device');
        await heading('Shared device locked').waitFor();
        assert.equal(await drawer().count(), 0, 'No stale top-layer dialog over locked shared device');
      } else {
        await openMenu();
        await drawer().getByRole('button', { name: /^Account management/ }).click();
        await clickMenu('Set up Family or Classroom');
        await heading('Set up homeschool or a classroom').waitFor();
      }
      checks.push({ mode, width, status: 'passed', keyboard: 'contained', dismissal: 'Escape, button, backdrop', routeGuard: 'veto retained', managedAuthority: label ? 'adult gate and lock verified' : 'local setup only' });
      await context.close();
    }
  }
  await server.close(); server = null;
  const publicOrigin = await startServer(false);
  const context = await contextFor(publicOrigin, 1280);
  await page.goto(publicOrigin + '/?app&guest=1');
  await heading('Library').waitFor();
  assert.equal(await logo().count(), 0, 'Public account-free website gets no account sidebar');
  await page.getByRole('link', { name: 'Erudior home page', exact: true }).waitFor();
  await context.close();
  assert.deepEqual(errors, [], 'No page errors');
  await writeFile(path.join(out, 'result.json'), JSON.stringify({ passed: true, scope: 'actual App in browser native-look harness; synthetic local profiles, not physical Android acceptance', checks, screenshots, errors, publicWebsite: 'unchanged account-free brand link' }, null, 2));
} catch (error) {
  await writeFile(path.join(out, 'failure.json'), JSON.stringify({ current, error: String(error), checks, screenshots, errors }, null, 2));
  await page?.screenshot({ path: path.join(out, 'failure.png') }).catch(() => {});
  throw error;
} finally { await browser?.close(); await server?.close(); }

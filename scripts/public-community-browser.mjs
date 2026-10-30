// Actual public Site/App acceptance. All courses, API responses and browser storage are synthetic.
// Public browsing never uses author cookies, identity APIs, uploads or production course data.
import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import react from '@vitejs/plugin-react';
import nacl from 'tweetnacl';
const pw = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const chromium = pw.chromium || pw.default.chromium;
const root = fileURLToPath(new URL('../', import.meta.url));
const out = process.env.BROWSER_ARTIFACTS || path.join(root, 'test-results', 'public-community-browser');
await mkdir(out, { recursive: true });
const axe = await readFile(new URL('../node_modules/axe-core/axe.min.js', import.meta.url), 'utf8');
const apiOrigin = 'https://api.community.test';
const first = { id: 'public-one', title: 'Synthetic public community', description: 'Synthetic published example, not curriculum.', subject: 'Science', level: 'Elementary School', type: 'Course', author: 'Synthetic creator', version: 1, review: 'not_reviewed', counts: { lessons: 1, questions: 1, cards: 0 }, updated: '2026-01-01T00:00:00Z' };
const second = { ...first, id: 'public-two', title: 'Synthetic second community', subject: 'Math', level: 'High School', review: 'reviewed' };
const hostile = { ...first, id: 'public-safe', title: '<img src=x onerror="window.__injected=1">', description: '<script>window.__injected=1</script>', author: '<b>Synthetic creator</b>' };
const makeDoc = entry => ({ format: 'erudior-community', version: 1, title: entry.title, description: entry.description, subject: entry.subject, level: entry.level, type: entry.type, lessons: [{ id: 'read', title: 'Synthetic community lesson', blocks: [{ type: 'text', md: '## Synthetic learning\nThis synthetic community lesson is readable without an author account.' }, { type: 'question', id: 'q1', stem: 'Choose the synthetic answer.', choices: ['One', 'Two'], answer: [0], explanation: 'One is the synthetic answer.' }] }], decks: [] });
const docs = Object.fromEntries([first, second, hostile].map(entry => [entry.id, { ...entry, doc: makeDoc(entry) }]));
const catalogBytes = Buffer.from(JSON.stringify({ format: 'examiner-catalog', version: 1, courses: [] }));
const keys = nacl.sign.keyPair();
const signature = Buffer.from(nacl.sign.detached(catalogBytes, keys.secretKey)).toString('base64');
const errors = [], screenshots = [], observations = [];
let server, browser, page, current = 'startup';
try {
  server = await createServer({ root, configFile: false, plugins: [react()], server: { host: '127.0.0.1', port: 0 }, define: {
    __DEV_COURSE_KEY__: JSON.stringify(Buffer.from(keys.publicKey).toString('base64')),
    'import.meta.env.VITE_COURSES_URL': JSON.stringify('/test-courses/'),
    'import.meta.env.VITE_HOMESCHOOL': JSON.stringify(''),
    'import.meta.env.VITE_AS_DESKTOP': JSON.stringify(''),
    'import.meta.env.VITE_COMMUNITY_API': JSON.stringify(apiOrigin),
  }, logLevel: 'warn' });
  await server.listen();
  const origin = `http://127.0.0.1:${server.httpServer.address().port}`;
  browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  const heading = name => page.getByRole('heading', { name, exact: true });
  const button = name => page.getByRole('button', { name, exact: true });
  const link = name => page.getByRole('link', { name, exact: true });
  async function audit(name, target) {
    current = name;
    // Audit the usable page, after the real startup lifecycle (never hide its overlay).
    await page.waitForFunction(() => document.querySelectorAll('.erudior-splash').length === 0, null, { timeout: 10000 });
    assert.equal(await page.locator('.erudior-splash').count(), 0, `${name}: no persistent startup overlay`);
    await page.evaluate(() => { window.scrollTo(0, 0); const main = document.querySelector('.main'); if (main) main.scrollTop = 0; });
    if (target) await target.evaluate(el => el.scrollIntoView({ block: 'start', inline: 'nearest' }));
    await page.evaluate(() => document.fonts.ready);
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${name}: no horizontal page overflow`);
    assert(await page.evaluate(() => [...document.querySelectorAll('.public-community h1, .public-community h2')].every(heading => {
      const range = document.createRange(); range.selectNodeContents(heading);
      return [...range.getClientRects()].every(rect => rect.left >= -1 && rect.right <= innerWidth + 1);
    })), `${name}: complete community headings stay visible without clipping`);
    await page.addScriptTag({ content: axe });
    const result = await page.evaluate(() => window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] } }));
    assert.deepEqual(result.violations.map(v => ({ id: v.id, targets: v.nodes.map(n => n.target) })), [], `${name}: accessibility`);
    await page.screenshot({ path: path.join(out, `${name}.png`), fullPage: false });
    screenshots.push(`${name}.png`);
  }
  for (const colorScheme of ['light', 'dark']) for (const width of [1280, 320]) {
    const prefix = `${colorScheme}-${width}`;
    const context = await browser.newContext({ viewport: { width, height: 900 }, colorScheme });
    await context.addCookies([{ name: 'synthetic-author-cookie', value: 'never-send-to-public', domain: 'api.community.test', path: '/', secure: true, sameSite: 'None' }]);
    let catalogMode = 'normal', detailMode = 'normal', releaseDetail, delayedStart;
    const requests = [], unexpected = [];
    await context.route('**/*', async route => {
      const request = route.request(), url = new URL(request.url());
      if (url.origin === apiOrigin) {
        requests.push({ method: request.method(), path: url.pathname, cookie: request.headers().cookie || '' });
        if (request.method() !== 'GET' || !['/catalog', '/courses/public-one', '/courses/public-two', '/courses/public-safe'].includes(url.pathname)) {
          unexpected.push(`${request.method()} ${url.pathname}`);
          return route.fulfill({ status: 403, contentType: 'application/json', body: JSON.stringify({ error: 'Synthetic test forbids account or mutation APIs.' }) });
        }
        const send = (status, body) => route.fulfill({ status, contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify(body) });
        if (url.pathname === '/catalog') {
          if (catalogMode === 'error') return send(503, { error: 'Synthetic catalog unavailable.' });
          if (catalogMode === 'malformed') return send(200, { courses: [{ id: '../escape', title: 'Invalid listing' }] });
          return send(200, { courses: catalogMode === 'empty' ? [] : [first, second, hostile] });
        }
        const id = url.pathname.split('/').at(-1);
        if (detailMode === 'delayed' && id === first.id) return new Promise(resolve => {
          releaseDetail = async () => { await send(200, docs[id]).catch(() => {}); resolve(); };
          delayedStart?.();
        });
        if (detailMode === 'removed' && id === first.id) return send(410, { error: 'Synthetic course removed.' });
        if (detailMode === 'malformed' && id === first.id) return send(200, { ...docs[id], doc: { format: 'invalid' } });
        return send(200, docs[id]);
      }
      if (url.origin !== origin && !['data:', 'blob:'].includes(url.protocol)) { unexpected.push(url.href); return route.abort(); }
      if (url.pathname.startsWith('/test-courses/')) {
        if (url.pathname.endsWith('catalog.json')) return route.fulfill({ status: 200, contentType: 'application/json', body: catalogBytes });
        if (url.pathname.endsWith('catalog.json.sig')) return route.fulfill({ status: 200, contentType: 'text/plain', body: signature });
        return route.fulfill({ status: 404, body: 'Synthetic catalog has no official courses.' });
      }
      return route.continue();
    });
    page = await context.newPage();
    page.setDefaultTimeout(30000);
    page.on('pageerror', error => errors.push(`${current}: ${error.message}`));
    await page.goto(origin + '/?site');
    const nav = page.getByRole('navigation', { name: 'Main', exact: true });
    await nav.getByRole('link', { name: 'Community', exact: true }).focus();
    await page.keyboard.press('Enter');
    await heading('Community courses').waitFor();
    await heading(first.title).waitFor();
    assert.equal(new URL(page.url()).pathname, '/community');
    assert.equal(await nav.getByRole('link', { name: 'Community', exact: true }).getAttribute('aria-current'), 'page');
    assert.equal(await page.locator('input[type=password]').count(), 0);
    assert.equal(await page.getByRole('button', { name: /Create a course|Take over|Sign in/ }).count(), 0);
    await audit(prefix + '-public-list');

    const search = page.getByRole('searchbox', { name: 'Search community courses', exact: true });
    await search.fill('second');
    await heading(second.title).waitFor();
    assert.equal(await heading(first.title).count(), 0);
    await audit(prefix + '-search');
    await search.fill('no-synthetic-match');
    await page.getByText(/No courses match/).waitFor();
    await audit(prefix + '-no-results');
    await button('Clear filters').click();
    assert.equal(await search.inputValue(), '');
    await page.getByLabel('Subject', { exact: true }).selectOption('Science');
    await heading(first.title).waitFor();
    assert.equal(await heading(second.title).count(), 0);
    await page.getByLabel('Subject', { exact: true }).selectOption('');
    await page.getByLabel('Level', { exact: true }).selectOption('High School');
    await heading(second.title).waitFor();
    assert.equal(await heading(first.title).count(), 0);
    await page.getByLabel('Level', { exact: true }).selectOption('');
    await page.getByLabel('Reviewed only', { exact: true }).check();
    await heading(second.title).waitFor();
    assert.equal(await heading(first.title).count(), 0);
    await audit(prefix + '-review-filter');
    await page.getByLabel('Reviewed only', { exact: true }).uncheck();
    await link(`View course: ${first.title}`).click();
    await heading(first.title).waitFor();
    await page.getByText('Synthetic community lesson', { exact: true }).waitFor();
    assert.equal(new URL(page.url()).pathname, '/community/public-one');
    assert.equal(new URL(await link('Learn in web app').getAttribute('href'), origin).pathname, '/community/public-one');
    await audit(prefix + '-detail');
    await page.reload();
    await heading(first.title).waitFor();
    await audit(prefix + '-detail-reload');
    await page.goBack();
    await heading('Community courses').waitFor();
    await page.goForward();
    await heading(first.title).waitFor();
    await audit(prefix + '-detail-history');

    // A stale detail response cannot replace a newer navigation target.
    detailMode = 'delayed';
    let started;
    const startedPromise = new Promise(resolve => { started = resolve; });
    delayedStart = started;
    await page.goto(origin + '/community/public-one?site', { waitUntil: 'domcontentloaded' });
    await startedPromise;
    await page.evaluate(() => { history.pushState(null, '', '/community/public-two'); dispatchEvent(new PopStateEvent('popstate')); });
    await heading(second.title).waitFor();
    await releaseDetail();
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    assert.equal(await heading(first.title).count(), 0, 'late response cannot replace selected course');
    await audit(prefix + '-stale-detail-ignored');
    detailMode = 'removed';
    await page.goto(origin + '/community/public-one?site');
    await page.getByRole('alert').waitFor();
    assert.equal(await link('Learn in web app').count(), 0, 'removed course has no learning action');
    await audit(prefix + '-removed-detail');
    detailMode = 'malformed';
    await button('Retry loading courses').click();
    await page.getByText('This published course could not be validated. Please try again later.', { exact: true }).waitFor();
    assert.equal(await link('Learn in web app').count(), 0, 'malformed course has no learning action');
    await audit(prefix + '-malformed-detail');
    detailMode = 'normal';
    await button('Retry loading courses').click();
    await heading(first.title).waitFor();
    await audit(prefix + '-detail-recovered');
    await page.goto(origin + '/community/public-safe?site');
    await heading(hostile.title).waitFor();
    assert.equal(await page.evaluate(() => window.__injected), undefined);
    assert.equal(await page.locator('main img[src="x"], main script').count(), 0, 'hostile catalog text stays text');
    await audit(prefix + '-escaped-metadata');

    catalogMode = 'empty';
    await page.goto(origin + '/community?site');
    await page.getByText('No community courses have been published yet. Please check back later.', { exact: true }).waitFor();
    await audit(prefix + '-empty-catalog');
    catalogMode = 'error';
    await page.reload();
    await page.getByRole('alert').waitFor();
    await audit(prefix + '-catalog-error');
    catalogMode = 'malformed';
    await button('Retry loading courses').click();
    await page.getByText('The community service returned invalid course information. Please retry later.', { exact: true }).waitFor();
    assert.equal(await heading('Invalid listing').count(), 0, 'invalid metadata cannot become a catalog link');
    await audit(prefix + '-invalid-catalog');
    catalogMode = 'normal';
    await button('Retry loading courses').click();
    await heading(first.title).waitFor();
    await audit(prefix + '-catalog-recovered');

    // Exact-course handoff does not install automatically. Only an explicit app Start saves it.
    await link(`View course: ${first.title}`).click();
    await heading(first.title).waitFor();
    await link('Learn in web app').click();
    await heading(first.title).waitFor();
    const installed = () => page.evaluate(async () => (await (await import('/src/lib/webstore.ts')).webGet('erudior.course.community-public-one')));
    assert.equal(await installed(), null, 'read-only detail does not install');
    await button('Start or open course').waitFor();
    await audit(prefix + '-app-handoff');
    detailMode = 'delayed';
    const startDownload = new Promise(resolve => { delayedStart = resolve; });
    await button('Start or open course').click();
    await startDownload;
    await button('Courses').click();
    await heading('Courses').waitFor();
    const downloadFinished = page.waitForEvent('requestfinished', request => request.url() === apiOrigin + '/courses/public-one');
    await releaseDetail();
    await downloadFinished;
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    assert.equal(await installed(), null, 'abandoned community download cannot install');
    assert.equal(new URL(page.url()).pathname, '/', 'late download cannot navigate back');
    await audit(prefix + '-abandoned-app-start');
    detailMode = 'normal';
    await page.goto(origin + '/community/public-one?app');
    await heading(first.title).waitFor();
    detailMode = 'removed';
    await button('Start or open course').click();
    await page.getByText("Couldn't add the course: Synthetic course removed.", { exact: true }).waitFor();
    assert.equal(await installed(), null, 'failed community start does not install');
    await audit(prefix + '-app-start-error');
    detailMode = 'normal';
    const readsBeforeStart = requests.filter(request => request.path === '/courses/public-one').length;
    await button('Start or open course').evaluate(element => { element.click(); element.click(); });
    await heading(first.title).waitFor();
    await page.getByRole('navigation', { name: 'Course sections' }).getByRole('button', { name: 'Lessons', exact: true }).click();
    await page.getByRole('button', { name: /Synthetic community lesson/ }).waitFor();
    assert(await installed(), 'explicit Start installed selected synthetic course');
    assert.equal(requests.filter(request => request.path === '/courses/public-one').length, readsBeforeStart + 1, 'repeated Start downloads once');
    await page.getByRole('button', { name: /Synthetic community lesson/ }).click();
    await heading('Synthetic community lesson').waitFor();
    await page.getByText('This synthetic community lesson is readable without an author account.', { exact: true }).waitFor();
    await audit(prefix + '-app-lesson');
    assert.deepEqual(unexpected, [], 'no unexpected API, author identity or external calls');
    assert(requests.length > 0);
    assert(requests.every(request => request.method === 'GET' && request.cookie === ''), 'all community reads omit authentication cookies');
    observations.push({ prefix, communityRequests: requests.length, writeRequests: 0, accountRequests: 0, cookieFreeReads: true, explicitStart: true });
    await context.close();
  }
  assert.deepEqual(errors, [], 'no uncaught runtime errors');
  await writeFile(path.join(out, 'result.json'), JSON.stringify({ passed: true, screenshots, observations, errors, capture: 'Viewport states, desktop/mobile, light/dark; synthetic API only.' }, null, 2));
  console.log('Public Community discovery, read-only details, error/stale safety, exact app handoff and explicit synthetic learning passed.');
} catch (error) {
  const layout = page ? await page.evaluate(() => ({
    viewport: { width: innerWidth, height: innerHeight },
    documentWidth: document.documentElement.scrollWidth,
    bodyWidth: document.body.scrollWidth,
    splashCount: document.querySelectorAll('.erudior-splash').length,
    overflowElements: Array.from(document.querySelectorAll('body *')).flatMap(element => {
      const rect = element.getBoundingClientRect(), style = getComputedStyle(element);
      if (!rect.width || !rect.height || style.display === 'none' || style.visibility === 'hidden' || (rect.left >= -1 && rect.right <= innerWidth + 1)) return [];
      return [{ tag: element.tagName, id: element.id, className: element.getAttribute('class'), role: element.getAttribute('role'), text: element.textContent?.trim().slice(0, 120), rect: { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom, width: rect.width, height: rect.height }, position: style.position, overflowX: style.overflowX, transform: style.transform }];
    }).slice(0, 100),
  })).catch(error => ({ diagnosticError: String(error) })) : null;
  await writeFile(path.join(out, 'failure-diagnostics.json'), JSON.stringify({ current, error: String(error), errors, layout }, null, 2));
  if (page) await page.screenshot({ path: path.join(out, 'failure.png'), fullPage: false }).catch(() => {});
  throw error;
} finally { await browser?.close(); await server?.close(); }

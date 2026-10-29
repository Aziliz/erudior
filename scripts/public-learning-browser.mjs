// Real public Site/App regression using only synthetic, freshly signed course bytes.
// The ephemeral public key is accepted by Vite DEV only; no production key or server is changed.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import react from '@vitejs/plugin-react';
import nacl from 'tweetnacl';
const pw = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const chromium = pw.chromium || pw.default.chromium;
const root = fileURLToPath(new URL('../', import.meta.url));
const out = process.env.BROWSER_ARTIFACTS || path.join(root, 'test-results', 'public-learning-browser');
await mkdir(out, { recursive: true });
const axe = await readFile(new URL('../node_modules/axe-core/axe.min.js', import.meta.url), 'utf8');
const course = {
  format: 'examiner-course', version: 1, id: 'synthetic-public-course', title: 'Synthetic public learning', revision: 1,
  description: 'Synthetic learning access regression, not an actual course.',
  modules: [{ id: 'module', title: 'Synthetic module' }],
  lessons: [
    { id: 'read', title: 'Synthetic reading lesson', module: 'module', body: '## Read freely\nThis original synthetic text is publicly readable.', topics: ['Reading'] },
    { id: 'practice', title: 'Synthetic practice lesson', module: 'module', body: '## Practice freely\nOne plus one is two. This is synthetic practice, not supervised credit.', quiz: ['q1'], topics: ['Addition'] },
  ],
  banks: [{ id: 'questions', title: 'Synthetic questions', sections: [{ id: 'module', name: 'Synthetic module' }], questions: [
    { id: 'q1', section: 'module', topic: 'Addition', stem: 'What is one plus one?', choices: ['Two', 'Three'], answer: [0], explanation: 'One plus one equals two.' },
  ], exam: { questionCount: 1, timeLimitMinutes: 10, passingPercent: 100 } }],
  decks: [], drills: [], references: [], glossary: [],
};
const bytes = Buffer.from(JSON.stringify(course));
const catalog = { format: 'examiner-catalog', version: 1, courses: [
  { id: 'synthetic-foundation', title: 'Synthetic foundation', file: 'foundation.r1.json', revision: 1, order: 1, description: 'Synthetic prerequisite recommendation', subject: 'Math', level: ['High school'], type: ['Course'], lessons: 1, lessonIds: ['foundation'], questions: 0, cards: 0, drills: 0, bytes: 1, sha256: createHash('sha256').update('x').digest('hex') },
  { id: course.id, title: course.title, file: 'public.r1.json', revision: 1, order: 2, description: course.description, subject: 'Math', level: ['High school'], type: ['Course'], lessons: 2, lessonIds: ['read', 'practice'], questions: 1, cards: 0, drills: 0, requires: ['synthetic-foundation'], outline: [{ title: 'Synthetic module', lessons: course.lessons.map(l => l.title) }], bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') },
] };
const catalogBytes = Buffer.from(JSON.stringify(catalog));
const key = nacl.sign.keyPair();
const signature = Buffer.from(nacl.sign.detached(catalogBytes, key.secretKey)).toString('base64');
const slug = '/synthetic-public-learning';
const lessonPath = slug + '/lessons/practice';
let server, browser, page, current = 'startup';
const errors = [], screenshots = [], observations = [];
try {
  server = await createServer({ root, configFile: false, plugins: [react()], server: { host: '127.0.0.1', port: 0 }, define: {
    __DEV_COURSE_KEY__: JSON.stringify(Buffer.from(key.publicKey).toString('base64')),
    'import.meta.env.VITE_COURSES_URL': JSON.stringify('/test-courses/'),
    'import.meta.env.VITE_HOMESCHOOL': JSON.stringify(''),
    'import.meta.env.VITE_AS_DESKTOP': JSON.stringify(''),
    'import.meta.env.VITE_COMMUNITY_API': JSON.stringify(''),
  }, logLevel: 'warn' });
  await server.listen();
  const origin = `http://127.0.0.1:${server.httpServer.address().port}`;
  browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  const button = name => page.getByRole('button', { name, exact: true });
  const heading = name => page.getByRole('heading', { name, exact: true });
  async function audit(name, target = null) {
    current = name;
    // The application scrolls .main, not the document. Capture an explicit viewport
    // instead of a misleading fullPage image with a giant blank nested-scroll tail.
    await page.evaluate(() => { window.scrollTo(0, 0); const main = document.querySelector('.main'); if (main) main.scrollTop = 0; });
    if (target) {
      await target.evaluate(element => element.scrollIntoView({ block: 'start', inline: 'nearest' }));
      const bounds = await target.boundingBox();
      assert(bounds && bounds.y >= -1 && bounds.y < 900 && bounds.width > 0, name + ': intended state is in the captured viewport');
    }
    await page.evaluate(() => document.fonts.ready);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    if (overflow > 1) {
      const layout = await page.evaluate(() => {
        const describe = element => {
          const r = element.getBoundingClientRect(), style = getComputedStyle(element);
          return { tag: element.tagName, id: element.id, class: typeof element.className === 'string' ? element.className : '', role: element.getAttribute('role'), label: element.getAttribute('aria-label'), x: r.x, y: r.y, width: r.width, right: r.right, height: r.height, clientWidth: element.clientWidth, scrollWidth: element.scrollWidth, scrollLeft: element.scrollLeft, position: style.position, overflowX: style.overflowX, overflowY: style.overflowY, minWidth: style.minWidth, maxWidth: style.maxWidth, display: style.display, whiteSpace: style.whiteSpace, overflowWrap: style.overflowWrap };
        };
        const outside = [...document.querySelectorAll('*')].filter(element => {
          const r = element.getBoundingClientRect();
          return r.width > 0 && (r.right > innerWidth + 1 || r.left < -1);
        }).map(element => {
          const ancestors = []; let parent = element.parentElement;
          while (parent && ancestors.length < 8) { ancestors.push(describe(parent)); parent = parent.parentElement; }
          return { element: describe(element), text: element.textContent?.trim().slice(0, 120), ancestors };
        }).sort((a, b) => b.element.right - a.element.right).slice(0, 60);
        return { viewport: { width: innerWidth, height: innerHeight }, document: describe(document.documentElement), body: describe(document.body), regions: [...document.querySelectorAll('.shell,.main,.page,.learning-history')].map(describe), outside };
      });
      await writeFile(path.join(out, name + '-layout-overflow.json'), JSON.stringify(layout, null, 2));
    }
    assert(overflow <= 1, name + ': body overflow');
    await page.addScriptTag({ content: axe });
    const result = await page.evaluate(() => window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] } }));
    assert.deepEqual(result.violations.map(v => ({ id: v.id, targets: v.nodes.map(n => n.target) })), [], name + ': accessibility');
    await page.screenshot({ path: path.join(out, name + '.png'), fullPage: false });
    screenshots.push(name + '.png');
  }
  const storage = () => page.evaluate(async () => (await import('/src/lib/webstore.ts')).webList(''));
  const progress = () => page.evaluate(async () => JSON.parse((await (await import('/src/lib/webstore.ts')).webGet('erudior.progress')) || '{}'));
  const installed = () => page.evaluate(async () => (await (await import('/src/lib/webstore.ts')).webGet('erudior.course.synthetic-public-course')));
  async function launchLinked() {
    await button('Open linked activity').waitFor();
    await button('Open linked activity').click();
    await heading('Synthetic practice lesson').waitFor();
  }
  async function quiz() {
    await button('Take the quiz').first().click();
    await page.getByRole('radiogroup', { name: 'Answer choices' }).waitFor();
    await page.locator('[role="radio"][data-choice="0"]').click();
    if (new URL(page.url()).searchParams.get('guest') === '1') {
      const state = await page.evaluate(() => window.history.state);
      assert.deepEqual(Object.keys(state || {}), ['erudiorNavigationPosition'], 'temporary quiz history retains navigation position only, not session/questions/answers');
    }
    await button('Check answer').click();
    await button('See results').click();
    await heading('Lesson complete').waitFor();
    const p = await progress();
    assert.equal(p.attempts.length, 1);
    assert.equal(p.attempts[0].correct, 1);
    assert(p.lessonsDone['synthetic-public-course/practice']);
    assert.equal(p.lessonsDone['synthetic-foundation/foundation'], undefined, 'public practice never fabricates prerequisite completion');
  }
  async function exportBackup(name) {
    await button('Progress and export').click();
    await heading('Progress').waitFor();
    await audit(name + '-progress-top');
    const history = page.getByRole('region', { name: 'Learning session history', exact: true });
    await history.waitFor();
    assert.equal(await history.getAttribute('tabindex'), '0', 'history scrolling is keyboard accessible');
    await history.evaluate(element => { element.scrollLeft = 0; });
    await audit(name + '-history-left', history);
    if (page.viewportSize().width < 600) {
      const sizes = await history.evaluate(element => ({ available: element.clientWidth, content: element.scrollWidth, table: element.querySelector('table').getBoundingClientRect().width }));
      assert(sizes.table >= 600 && sizes.content > sizes.available, 'narrow history preserves readable table columns inside its own scroll region');
      await history.focus();
      await page.keyboard.press('ArrowRight');
      await page.waitForFunction(() => document.querySelector('[aria-label="Learning session history"]').scrollLeft > 0);
      await history.evaluate(element => { element.scrollLeft = element.scrollWidth; });
      await audit(name + '-history-right', history);
    }
    await button('View result').focus();
    await page.keyboard.press('Enter');
    await heading('Lesson complete').waitFor();
    await button('← Progress').click();
    await heading('Progress').waitFor();
    const waiting = page.waitForEvent('download');
    await button('Back up now').click();
    const download = await waiting;
    const file = path.join(out, name + '-backup.json');
    await download.saveAs(file);
    const backup = JSON.parse(await readFile(file, 'utf8'));
    assert.equal(backup.format, 'erudior-backup');
    assert.equal(backup.progress.attempts.length, 1);
    assert(backup.courses.some(c => c.id === course.id));
    assert.equal(backup.progress.enrolled, undefined, 'anonymous export is not managed enrollment');
    return backup;
  }
  for (const colorScheme of ['light', 'dark']) for (const width of [1280, 320]) {
    const name = `${colorScheme}-${width}`;
    current = name;
    const context = await browser.newContext({ viewport: { width, height: 900 }, colorScheme, acceptDownloads: true });
    let fetchMode = 'ok', courseRequests = 0, releaseDownload, delayedStarted;
    const downloadStarted = new Promise(resolve => { delayedStarted = resolve; });
    await context.route('**/*', async route => {
      const u = new URL(route.request().url());
      if (u.origin !== origin && !['data:', 'blob:'].includes(u.protocol)) return route.abort();
      if (u.pathname.startsWith('/test-courses/')) {
        if (fetchMode === 'offline') return route.abort();
        if (u.pathname.endsWith('/catalog.json')) return route.fulfill({ status: 200, contentType: 'application/json', body: catalogBytes });
        if (u.pathname.endsWith('/catalog.json.sig')) return route.fulfill({ status: 200, contentType: 'text/plain', body: signature });
        if (u.pathname.endsWith('/public.r1.json')) {
          courseRequests++;
          if (fetchMode === 'delayed') {
            return new Promise(resolve => {
              releaseDownload = async () => { await route.fulfill({ status: 200, contentType: 'application/json', body: bytes }); resolve(); };
              delayedStarted();
            });
          }
          if (fetchMode === 'failure') return route.fulfill({ status: 503, body: 'Synthetic unavailable' });
          return route.fulfill({ status: 200, contentType: 'application/json', body: fetchMode === 'tampered' ? Buffer.from(JSON.stringify({ ...course, title: 'Tampered untrusted title' })) : bytes });
        }
        return route.fulfill({ status: 404, body: 'Synthetic file not present' });
      }
      return route.continue();
    });
    page = await context.newPage();
    page.setDefaultTimeout(30000);
    page.on('pageerror', error => errors.push(`${current}: ${error.message}`));

    // Exercise public website discovery into the actual web app, without author identity.
    await page.goto(origin + '/?site');
    await page.getByRole('link', { name: 'Study in your browser', exact: true }).waitFor();
    await page.getByRole('link', { name: 'Study in your browser', exact: true }).click();
    await page.getByRole('button', { name: /Synthetic public learning.*view overview/ }).waitFor();
    await page.getByRole('button', { name: /Synthetic public learning.*view overview/ }).click();
    await heading(course.title).waitFor();
    await page.getByText('Recommended background:', { exact: true }).waitFor();
    assert.equal(await button('Open course').isEnabled(), true);
    assert.equal(await page.locator('input[type="password"]').count(), 0, 'public discovery requests no login');
    await audit(name + '-public-overview');
    await audit(name + '-overview-reading-access', page.getByRole('region', { name: 'Public learning access', exact: true }));

    // Fresh deep-link destination survives signed catalog retrieval and failed downloads.
    await page.goto(origin + lessonPath + '?app');
    await button('Open linked activity').waitFor();
    assert.equal(new URL(page.url()).pathname, lessonPath);
    fetchMode = 'delayed';
    const requestsBefore = courseRequests;
    await button('Open linked activity').evaluate(element => { element.click(); element.click(); });
    await downloadStarted;
    assert.equal(courseRequests, requestsBefore + 1, 'repeated start produces one in-flight download');
    await button('Courses').click();
    await heading('Courses').waitFor();
    const finished = page.waitForEvent('requestfinished', request => request.url().endsWith('/test-courses/public.r1.json'));
    await releaseDownload();
    await finished;
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    assert.equal(new URL(page.url()).pathname, '/');
    assert.equal(await installed(), null, 'abandoned download does not install or enroll');
    assert.equal((await progress()).attempts.length, 0);
    await audit(name + '-abandoned-download');
    await page.goto(origin + lessonPath);
    await button('Open linked activity').waitFor();
    fetchMode = 'failure';
    await button('Open linked activity').click();
    await page.getByRole('alert').filter({ hasText: 'HTTP 503' }).waitFor();
    assert.equal(await installed(), null);
    await audit(name + '-download-error');
    fetchMode = 'tampered';
    await button('Open linked activity').click();
    await page.getByRole('alert').filter({ hasText: "didn't match the catalog" }).waitFor();
    assert.equal(await installed(), null, 'hash-invalid bytes are never installed');
    assert.equal(await heading('Tampered untrusted title').count(), 0);
    await audit(name + '-integrity-error');
    fetchMode = 'ok';
    await launchLinked();
    assert.equal(new URL(page.url()).pathname, lessonPath);
    await audit(name + '-public-lesson');
    await audit(name + '-lesson-quiz', page.locator('.lesson-quiz'));
    await quiz();
    await audit(name + '-practice-result', page.locator('.score-head'));
    await exportBackup(name + '-saved');
    await audit(name + '-saved-export', page.locator('section').filter({ has: heading('Backup') }));

    // Saved course and results remain available with the remote course service offline.
    fetchMode = 'offline';
    await page.goto(origin + lessonPath);
    await heading('Synthetic practice lesson').waitFor();
    assert.equal(await page.getByRole('checkbox', { name: 'Lesson complete', exact: true }).isChecked(), true);
    assert.equal((await progress()).attempts.length, 1);
    await audit(name + '-saved-offline');
    fetchMode = 'ok';
    await button('Progress and export').click();
    await heading('Progress').waitFor();
    await page.getByRole('status').filter({ hasText: 'Updating the private learning path' }).waitFor({ state: 'hidden' });
    await page.goBack();
    await heading('Synthetic practice lesson').waitFor();
    const baseline = await storage();

    // Temporary session cannot read existing device results, and can export its own work.
    await button('Start temporary session').click();
    await page.getByText('Temporary guest session', { exact: true }).waitFor();
    await button('Open linked activity').waitFor();
    assert.equal((await progress()).attempts.length, 0);
    assert.equal(await installed(), null);
    await launchLinked();
    await quiz();
    await exportBackup(name + '-temporary');
    await audit(name + '-temporary-export', page.locator('section').filter({ has: heading('Backup') }));
    assert.equal(new URL(page.url()).searchParams.get('guest'), '1', 'navigation retains temporary context');

    // Reload discards memory-only practice, without carrying a completion into device data.
    await page.goto(origin + lessonPath + '?guest=1');
    await button('Open linked activity').waitFor();
    assert.equal((await progress()).attempts.length, 0);
    assert.equal(await installed(), null);
    await audit(name + '-temporary-reload');
    page.once('dialog', dialog => dialog.dismiss());
    await button('Use saved device progress').click();
    assert.equal(new URL(page.url()).searchParams.get('guest'), '1', 'cancel leaves temporary session in place');
    page.once('dialog', dialog => dialog.accept());
    await button('Use saved device progress').click();
    await heading('Synthetic practice lesson').waitFor();
    assert.equal(new URL(page.url()).searchParams.has('guest'), false);
    await button('Progress and export').click();
    await heading('Progress').waitFor();
    await page.getByRole('status').filter({ hasText: 'Updating the private learning path' }).waitFor({ state: 'hidden' });
    await page.goBack();
    await heading('Synthetic practice lesson').waitFor();
    assert.deepEqual(await storage(), baseline, 'temporary exploration preserved every existing device value');
    await audit(name + '-return-saved');

    // Read another direct lesson, then browser Back/Forward returns to exact lesson identities.
    await button('Previous').click();
    await heading('Synthetic reading lesson').waitFor();
    await page.goBack();
    await heading('Synthetic practice lesson').waitFor();
    await page.goForward();
    await heading('Synthetic reading lesson').waitFor();
    await audit(name + '-history-reading');
    await audit(name + '-reading-controls', page.locator('.lesson-foot'));
    observations.push({ name, courseRequests, savedAttemptCount: (await progress()).attempts.length, temporaryIsolated: true });

    // A denied browser learning store must offer a non-destructive temporary fallback.
    await context.addInitScript(() => Object.defineProperty(window, 'indexedDB', { configurable: true, get() { throw Error('Synthetic device learning storage unavailable'); } }));
    page = await context.newPage();
    page.setDefaultTimeout(30000);
    page.on('pageerror', error => errors.push(`${current}: ${error.message}`));
    await page.goto(origin + lessonPath);
    await heading("Erudior couldn't load your data").waitFor();
    await audit(name + '-storage-unavailable');
    await page.getByRole('link', { name: 'Continue in a temporary guest session', exact: true }).click();
    await launchLinked();
    await page.getByText('Temporary guest session', { exact: true }).waitFor();
    assert.equal((await progress()).attempts.length, 0);
    await audit(name + '-storage-free-temporary');
    await context.close();
  }
  assert.deepEqual(errors, []);
  await writeFile(path.join(out, 'result.json'), JSON.stringify({ passed: true, viewports: [320, 1280], themes: ['light', 'dark'], capture: 'Explicit viewport states within the main scroll container; not full-page coverage', screenshots, observations, errors }, null, 2));
  console.log('Public Site/App discovery, signed deep-link access, failed/hash-invalid retry, practice/export, offline saved progress and isolated temporary sessions passed.');
} catch (error) {
  await writeFile(path.join(out, 'failure-diagnostics.json'), JSON.stringify({ current, errors, error: String(error) }, null, 2));
  if (page) await page.screenshot({ path: path.join(out, 'failure.png'), fullPage: false }).catch(() => {});
  throw error;
} finally { await browser?.close(); await server?.close(); }

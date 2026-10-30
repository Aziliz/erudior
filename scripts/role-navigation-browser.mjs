// Actual App UI with isolated synthetic local workspaces. No production requests or accounts.
import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import react from '@vitejs/plugin-react';
const pw = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const chromium = pw.chromium || pw.default.chromium;
const root = fileURLToPath(new URL('../', import.meta.url));
const out = process.env.BROWSER_ARTIFACTS || path.join(root, 'test-results', 'role-navigation-browser');
await mkdir(out, { recursive: true });
const axe = await readFile(new URL('../node_modules/axe-core/axe.min.js', import.meta.url), 'utf8');
const password = 'Synthetic navigation password 2026';
const checks = [], screenshots = [], errors = [];
let server, browser, page, current = 'startup';

async function startServer(managed) {
  server = await createServer({ root, configFile: false, plugins: [react()], server: { host: '127.0.0.1', port: 0 }, define: {
    __DEV_COURSE_KEY__: JSON.stringify(''),
    'import.meta.env.VITE_HOMESCHOOL': JSON.stringify(managed ? '1' : ''),
    'import.meta.env.VITE_AS_DESKTOP': JSON.stringify(managed ? '1' : ''),
    'import.meta.env.VITE_COURSES_URL': JSON.stringify(''),
    'import.meta.env.VITE_COMMUNITY_API': JSON.stringify('/test-community'),
  }, logLevel: 'warn' });
  await server.listen();
  return `http://127.0.0.1:${server.httpServer.address().port}`;
}
async function newContext(origin, viewport, colorScheme) {
  const context = await browser.newContext({ viewport, colorScheme, reducedMotion: 'reduce' });
  await context.route('**/*', route => {
    const url = new URL(route.request().url());
    if (url.origin !== origin) return route.abort();
    if (url.pathname.startsWith('/test-community/')) return route.fulfill({ contentType: 'application/json', body: JSON.stringify(url.pathname.endsWith('/me')
      ? { user: null, providers: { google: false, github: false, dev: false } } : { courses: [] }) });
    return route.continue();
  });
  page = await context.newPage();
  page.setDefaultTimeout(15000);
  page.on('pageerror', error => errors.push({ current, message: error.message }));
  return context;
}
const mainNav = () => page.getByRole('navigation', { name: 'Main', exact: true });
const navButton = label => mainNav().getByRole('button', { name: label, exact: true });
const heading = label => page.getByRole('heading', { name: label, exact: true });
async function checkNavigation(label) {
  assert.deepEqual(await mainNav().getByRole('button').allTextContents(), ['Library', 'Community', 'Courses', ...(label ? [label] : [])]);
  assert.equal(await mainNav().getByText('Progress', { exact: true }).count(), 0);
  assert.equal(await page.locator('header.topbar').getByRole('button', { name: 'Homeschool or classroom', exact: true }).count(), 0);
  assert.equal(await mainNav().getByRole('link', { name: 'Download', exact: true }).count(), 0, 'Download remains a utility rather than a fourth learning destination');
}
async function seed(mode) {
  return page.evaluate(async ({ mode, password }) => {
    const store = await import('/src/lib/storage.ts');
    const { createFamily } = await import('/src/lib/family.ts');
    const { CATALOG, loadCatalogCourse } = await import('/src/lib/catalog.ts');
    const { normalizeCourse, coreLessons } = await import('/src/lib/course.ts');
    const { starterPathways } = await import('/src/lib/learningPathways.ts');
    let student = null;
    if (mode !== 'solo') {
      const created = await createFamily({ mode, className: 'Demo mathematics', state: mode === 'homeschool' ? 'GA' : '', route: 'Home education law', year: { start: '2026-08-01', end: '2027-07-31' }, dailyMinutes: 180, password, students: [{ name: 'Demo learner', grade: 8 }] });
      student = created.family.students[0].id;
    }
    const progress = store.emptyProgress();
    progress.catalogV1 = true;
    progress.enrolled = ['math-prealgebra', 'math-algebra1', 'science-biology'];
    progress.learningPathways = [starterPathways(CATALOG).find(item => item.id === 'math-foundations')];
    for (const [id, fraction] of [['math-prealgebra', 1], ['math-algebra1', .4], ['science-biology', .2]]) {
      const course = normalizeCourse(await loadCatalogCourse(CATALOG.find(item => item.id === id)));
      await store.saveCourse(course);
      const lessons = coreLessons(course);
      for (const lesson of lessons.slice(0, Math.floor(lessons.length * fraction))) progress.lessonsDone[`${id}/${lesson.id}`] = '2026-10-30';
    }
    await store.updateProfileProgress(student, () => progress);
    return student;
  }, { mode, password });
}
async function audit(name) {
  current = name;
  await page.evaluate(() => { window.scrollTo(0, 0); const main = document.querySelector('.main'); if (main) main.scrollTop = 0; });
  await page.evaluate(() => document.fonts.ready);
  assert(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth) <= 1, `${name}: no horizontal body overflow`);
  await page.addScriptTag({ content: axe });
  const violations = await page.evaluate(async () => (await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] } })).violations.map(item => ({ id: item.id, targets: item.nodes.map(node => node.target) })));
  assert.deepEqual(violations, [], `${name}: accessibility`);
  await page.screenshot({ path: path.join(out, name + '.png'), fullPage: false });
  screenshots.push(name + '.png');
  console.log(`Verified and captured ${name}`);
}

try {
  browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH, args: ['--no-sandbox'] } : {});
  const origin = await startServer(true);
  for (const [mode, label, adult] of [['solo', null, null], ['homeschool', 'Family', 'Parent'], ['classroom', 'Classroom', 'Teacher']]) {
    for (const viewport of [{ width: 1280, height: 1000 }, { width: 390, height: 844 }]) {
      const context = await newContext(origin, viewport, 'light');
      current = `${mode}-${viewport.width}`;
      await page.goto(origin + '/?app');
      await heading('Library').waitFor();
      await seed(mode);
      await page.reload();
      await heading('Library').waitFor();
      await checkNavigation(label);
      if (!label) {
        await page.getByRole('button', { name: 'Homeschool or classroom', exact: true }).click();
        await heading('Set up homeschool or a classroom').waitFor();
        await page.getByRole('button', { name: '← Library', exact: true }).click();
      } else assert.equal(await page.getByRole('button', { name: 'Homeschool or classroom', exact: true }).count(), 0);
      await navButton('Courses').click();
      await heading('Courses').waitFor();
      assert.equal(await navButton('Courses').getAttribute('aria-current'), 'page');
      assert.equal(await page.locator('.enrolled-course-card').count(), 3);
      await audit(`${mode}-${viewport.width}-courses-light`);
      if (viewport.width === 390) {
        await page.emulateMedia({ colorScheme: 'dark' });
        await audit(`${mode}-${viewport.width}-courses-dark`);
        await page.emulateMedia({ colorScheme: 'light' });
        await page.setViewportSize({ width: 320, height: 900 });
        assert(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth) <= 1, `${mode}: 320px overflow`);
        await page.setViewportSize(viewport);
      }
      // Courses is global; Progress remains an exact per-course tab and destination.
      await page.getByRole('article', { name: 'Algebra 1 progress', exact: true }).getByRole('button', { name: 'Course progress', exact: true }).click();
      await heading('Course progress').waitFor();
      const tab = page.getByRole('navigation', { name: 'Course sections', exact: true }).getByRole('button', { name: 'Progress', exact: true });
      assert.equal(await tab.getAttribute('aria-current'), 'page');
      await page.getByRole('button', { name: 'All enrolled courses', exact: true }).click();
      await heading('Courses').waitFor();
      if (label) {
        await navButton(label).click();
        await heading(`${adult} area`).waitFor();
        await page.getByLabel(`${adult} password`, { exact: true }).waitFor();
        assert.equal(await page.getByRole('navigation', { name: `${adult} sections`, exact: true }).count(), 0, 'Workspace label never bypasses the adult gate');
        if (viewport.width === 1280) await audit(`${mode}-1280-adult-gate`);
        await page.getByLabel(`${adult} password`, { exact: true }).fill('Deliberately incorrect synthetic password');
        await page.getByRole('button', { name: 'Open', exact: true }).click();
        await page.getByRole('alert').filter({ hasText: "That password isn't right." }).waitFor();
        assert.equal(await page.getByRole('navigation', { name: `${adult} sections`, exact: true }).count(), 0);
        await page.getByLabel(`${adult} password`, { exact: true }).fill(password);
        await page.getByRole('button', { name: 'Open', exact: true }).click();
        const sections = page.getByRole('navigation', { name: `${adult} sections`, exact: true });
        await sections.waitFor();
        if (mode === 'classroom') {
          await sections.getByRole('button', { name: 'Gradebook', exact: true }).waitFor();
          await sections.getByRole('button', { name: 'Classes', exact: true }).waitFor();
        } else await sections.getByRole('button', { name: 'Attendance and hours', exact: true }).waitFor();
        await navButton('Courses').click();
        await heading('Courses').waitFor();
        await navButton(label).click();
        await page.getByLabel(`${adult} password`, { exact: true }).waitFor();
        assert.equal(await sections.count(), 0, 'Leaving the adult area relocks it');
      }
      checks.push({ mode, viewport, navigation: label ? ['Library', 'Community', 'Courses', label] : ['Library', 'Community', 'Courses'], courseTab: 'Progress', adultGate: label ? 'wrong password rejected; unlock succeeds; leaving relocks' : 'no management destination; setup remains in Library' });
      await context.close();
    }
  }
  await server.close();
  server = null;
  const webOrigin = await startServer(false);
  const context = await newContext(webOrigin, { width: 1280, height: 1000 }, 'light');
  current = 'public-web';
  await page.goto(webOrigin + '/progress?app');
  await heading('Courses').waitFor();
  await checkNavigation(null);
  assert.equal(new URL(page.url()).pathname, '/progress', 'Existing global URL stays compatible');
  await page.locator('header.topbar').getByRole('link', { name: 'Download', exact: true }).waitFor();
  await page.getByRole('searchbox', { name: 'Search everything', exact: true }).waitFor();
  await audit('public-web-1280-courses');
  await page.reload();
  await heading('Courses').waitFor();
  await navButton('Library').click();
  await heading('Library').waitFor();
  assert.equal(await page.getByRole('button', { name: 'Homeschool or classroom', exact: true }).count(), 0, 'Public web does not invent managed account setup');
  checks.push({ mode: 'public-web', route: '/progress', heading: 'Courses', reload: 'passed', utilityLinks: ['Download', 'Search'], accountSetup: 'absent' });
  await context.close();
  assert.deepEqual(errors, [], 'No page errors');
  await writeFile(path.join(out, 'result.json'), JSON.stringify({ passed: true, scope: 'actual App browser UI; synthetic isolated local workspace modes, not authenticated account roles or native Android', checks, screenshots, errors }, null, 2));
  console.log('Role navigation browser: global Courses, per-course Progress, solo/family/classroom navigation, existing adult gates, reload compatibility, utilities, responsive layouts and axe passed.');
} catch (error) {
  await writeFile(path.join(out, 'failure.json'), JSON.stringify({ current, error: String(error), checks, screenshots, errors }, null, 2));
  await page?.screenshot({ path: path.join(out, 'failure.png'), fullPage: false }).catch(() => {});
  throw error;
} finally {
  await browser?.close();
  await server?.close();
}

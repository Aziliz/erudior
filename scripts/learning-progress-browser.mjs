// Real app views with real bundled courses and synthetic local learner activity.
// No accounts, production requests, or real learner records are used by this regression.
import assert from 'node:assert/strict';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import react from '@vitejs/plugin-react';

const pw = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const chromium = pw.chromium || pw.default.chromium;
const root = fileURLToPath(new URL('../', import.meta.url));
const out = process.env.BROWSER_ARTIFACTS || path.join(root, 'test-results', 'learning-progress-browser');
await mkdir(out, { recursive: true });
await rm(path.join(out, 'failure-diagnostics.json'), { force: true });
await rm(path.join(out, 'failure.png'), { force: true });
const axe = await readFile(new URL('../node_modules/axe-core/axe.min.js', import.meta.url), 'utf8');
let server, browser, page, current = 'startup';
const errors = [], screenshots = [], checks = [];

try {
  server = await createServer({ root, configFile: false, plugins: [react()], server: { host: '127.0.0.1', port: 0 }, define: {
    __DEV_COURSE_KEY__: JSON.stringify(''),
    'import.meta.env.VITE_HOMESCHOOL': JSON.stringify('1'),
    'import.meta.env.VITE_AS_DESKTOP': JSON.stringify('1'),
    'import.meta.env.VITE_COURSES_URL': JSON.stringify(''),
    'import.meta.env.VITE_COMMUNITY_API': JSON.stringify(''),
  }, logLevel: 'warn' });
  await server.listen();
  const origin = `http://127.0.0.1:${server.httpServer.address().port}`;
  browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH, args: ['--no-sandbox'] } : {});
  const button = name => page.getByRole('button', { name, exact: true });
  const heading = name => page.getByRole('heading', { name, exact: true });
  const readProgress = () => page.evaluate(async () => (await import('/src/lib/storage.ts')).loadProgress());
  const navigateProgress = async () => {
    await page.locator('header.topbar').getByRole('button', { name: 'Courses', exact: true }).click();
    await heading('Your courses').waitFor();
  };
  const waitForPathway = title => page.getByRole('article', { name: `${title} pathway`, exact: true }).waitFor();

  async function audit(name, target = null) {
    current = name;
    await page.evaluate(() => {
      window.scrollTo(0, 0);
      for (const element of document.querySelectorAll('.main,.inner')) { element.scrollTop = 0; element.scrollLeft = 0; }
    });
    if (target) await target.evaluate(element => {
      const main = element.closest('.main');
      if (main) main.scrollTop += element.getBoundingClientRect().top - main.getBoundingClientRect().top;
      else element.scrollIntoView({ block: 'start', inline: 'nearest' });
      window.scrollTo(0, 0);
    });
    await page.evaluate(() => document.fonts.ready);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    if (overflow > 1) await writeFile(path.join(out, name + '-overflow.json'), JSON.stringify(await page.evaluate(() => {
      const describe = element => {
        const bounds = element.getBoundingClientRect(), style = getComputedStyle(element);
        return { tag: element.tagName, className: typeof element.className === 'string' ? element.className : '', label: element.getAttribute('aria-label'), left: bounds.left, right: bounds.right, width: bounds.width, scrollWidth: element.scrollWidth, clientWidth: element.clientWidth, minWidth: style.minWidth, overflowX: style.overflowX, display: style.display };
      };
      return { viewport: { width: innerWidth, height: innerHeight }, document: describe(document.documentElement), elements: [...document.querySelectorAll('*')].filter(element => { const r = element.getBoundingClientRect(); return r.width && (r.right > innerWidth + 1 || r.left < -1); }).map(element => ({ ...describe(element), text: element.textContent?.slice(0, 100) })) };
    }), null, 2));
    assert(overflow <= 1, name + ': body overflow');
    await page.addScriptTag({ content: axe });
    const result = await page.evaluate(() => window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] } }));
    const violations = result.violations.map(value => ({ id: value.id, targets: value.nodes.map(node => node.target) }));
    if (violations.length) await writeFile(path.join(out, name + '-accessibility.json'), JSON.stringify(result.violations, null, 2));
    assert.deepEqual(violations, [], name + ': accessibility');
    await page.screenshot({ path: path.join(out, name + '.png'), fullPage: false });
    screenshots.push(name + '.png');
    console.log(`Verified and captured ${name}`);
  }

  async function seedSyntheticProgress() {
    return page.evaluate(async () => {
      const store = await import('/src/lib/storage.ts');
      const { CATALOG, loadCatalogCourse } = await import('/src/lib/catalog.ts');
      const { normalizeCourse, coreLessons } = await import('/src/lib/course.ts');
      const { starterPathways } = await import('/src/lib/learningPathways.ts');
      const progress = store.emptyProgress();
      progress.catalogV1 = true;
      progress.enrolled = ['math-prealgebra', 'math-algebra1', 'science-biology'];
      progress.learningPathways = [starterPathways(CATALOG).find(path => path.id === 'math-foundations')];
      const descriptions = [];
      for (const [id, fraction] of [['math-prealgebra', 1], ['math-algebra1', .4], ['science-biology', .2]]) {
        const entry = CATALOG.find(course => course.id === id);
        if (!entry) throw Error(`Missing real bundled course: ${id}`);
        const course = normalizeCourse(await loadCatalogCourse(entry));
        await store.saveCourse(course);
        const lessons = coreLessons(course), completed = Math.floor(lessons.length * fraction);
        for (const lesson of lessons.slice(0, completed)) progress.lessonsDone[`${id}/${lesson.id}`] = '2026-10-28';
        if (fraction === 1) for (const module of course.modules.filter(module => !module.honors && module.quiz?.length)) {
          (progress.modulesDone ??= {})[`${id}/${module.id}`] = '2026-10-28';
        }
        const bank = [...course.banks].sort((a, b) => b.questions.length - a.questions.length)[0];
        if (bank) {
          const questions = bank.questions.filter(question => !question.honors && (!question.type || question.type === 'choice')).slice(0, 5);
          for (let session = 0; session < 2; session++) {
            const correct = Math.min(questions.length, session === 0 ? 3 : 4);
            const byTopic = {}, bySection = {};
            questions.forEach((question, index) => {
              const topic = byTopic[question.topic] ??= { total: 0, correct: 0 };
              topic.total++; if (index < correct) topic.correct++;
              if (question.section) { const section = bySection[question.section] ??= { total: 0, correct: 0 }; section.total++; if (index < correct) section.correct++; }
            });
            progress.attempts.push({ id: `demo-${id}-${session}`, bankId: bank.id, bankTitle: bank.title, mode: 'practice',
              startedAt: `2026-10-${27 + session}T15:00:00.000Z`, finishedAt: `2026-10-${27 + session}T15:12:00.000Z`, durationSec: 720,
              total: questions.length, answered: questions.length, correct, byTopic, bySection,
              answers: questions.map((question, index) => ({ qid: question.id, chosen: index < correct ? question.answer : [(Number(question.answer[0]) + 1) % question.choices.length], correct: index < correct })),
            });
          }
          progress.stats[bank.id] = Object.fromEntries(questions.map(question => [question.id, { seen: 4, correct: 3, lastCorrect: true, lastSeen: '2026-10-28T15:12:00.000Z' }]));
        }
        descriptions.push({ id, title: course.title, completedLessons: completed, coreLessons: lessons.length });
      }
      await store.updateProfileProgress(null, () => progress);
      return { descriptions, pathway: progress.learningPathways[0] };
    });
  }

  for (const { theme, ...viewport } of [
    { width: 1280, height: 1000, theme: 'light' }, { width: 390, height: 844, theme: 'light' }, { width: 320, height: 900, theme: 'light' },
    { width: 1280, height: 1000, theme: 'dark' }, { width: 390, height: 844, theme: 'dark' },
  ]) {
    const name = `${theme}-${viewport.width}`;
    current = name + '-launch';
    const context = await browser.newContext({ viewport, colorScheme: theme, reducedMotion: 'reduce', deviceScaleFactor: 1 });
    await context.route('**/*', route => {
      const url = new URL(route.request().url());
      return url.origin === origin || ['data:', 'blob:'].includes(url.protocol) ? route.continue() : route.abort();
    });
    page = await context.newPage();
    page.setDefaultTimeout(15000);
    page.on('pageerror', error => errors.push(`${current}: ${error.message}`));
    await page.goto(origin + '/?app');
    await heading('Library').waitFor();
    const seeded = await seedSyntheticProgress();
    await page.reload();
    await heading('Library').waitFor();
    await navigateProgress();
    const courses = page.locator('.enrolled-course-card');
    assert.equal(await courses.count(), 3);
    const expectedAverage = Math.floor(seeded.descriptions.reduce((sum, course) => sum + course.completedLessons / course.coreLessons, 0) / seeded.descriptions.length * 100);
    assert.equal(await page.locator('.progress-summary').getByText(`${expectedAverage}%`, { exact: true }).count(), 1, 'equal-course average includes one complete and two partial courses');
    const algebra = page.getByRole('article', { name: 'Algebra 1 progress', exact: true });
    await algebra.getByRole('progressbar').waitFor();
    assert.equal(Number(await algebra.getByRole('progressbar').getAttribute('value')), Math.floor(seeded.descriptions[1].completedLessons / seeded.descriptions[1].coreLessons * 100));
    await audit(name + '-overview');
    const math = page.getByRole('article', { name: 'Math foundations pathway', exact: true });
    await math.getByText('View course sequence (7)', { exact: true }).click();
    assert.equal(await math.locator('.pathway-step').count(), 7);
    assert.equal(await math.getByText('Not enrolled', { exact: true }).count(), 5);
    await audit(name + '-pathway', math);

    await algebra.getByRole('button', { name: 'Course progress', exact: true }).click();
    await heading('Course progress').waitFor();
    assert.equal(await page.locator('[aria-label="Course sections"] [aria-current="page"]').innerText(), 'Progress');
    assert.equal(await page.locator('[aria-label="Course session history"] tbody tr').count(), 2);
    assert.equal(await page.locator('[aria-label="Course session history"]').getByText('Biology', { exact: true }).count(), 0);
    await audit(name + '-course-progress', viewport.width < 600 ? page.locator('.course-progress') : null);
    await page.locator('[aria-label="Course session history"]').getByRole('button', { name: /^View result for/ }).first().click();
    await heading('Practice complete').waitFor();
    await page.locator('main .back').click();
    await heading('Course progress').waitFor();
    await button('All enrolled courses').click();
    await heading('Your courses').waitFor();
    checks.push({ viewport, theme, courses: seeded.descriptions, navigation: 'overview → course Progress → result → course Progress → overview' });

    if (viewport.width === 1280 && theme === 'light') {
      // Exercise actual updateProgress persistence instead of a fixture's in-memory callback.
      await page.locator('.pathway-suggestion').filter({ has: heading('German A1 to B1') }).getByRole('button', { name: /^Follow pathway/ }).click();
      await waitForPathway('German A1 to B1');
      assert.equal((await readProgress()).learningPathways.length, 2);
      assert.equal((await readProgress()).enrolled.length, 3, 'following a plan does not enroll its courses');
      await page.getByRole('article', { name: 'German A1 to B1 pathway', exact: true }).getByRole('button', { name: 'Stop following', exact: true }).click();
      await page.getByRole('article', { name: 'German A1 to B1 pathway', exact: true }).waitFor({ state: 'detached' });
      assert.equal((await readProgress()).learningPathways.length, 1);
      await button('Create a pathway').click();
      await page.getByLabel('Pathway name', { exact: true }).fill('Science and mathematics');
      for (const id of ['science-biology', 'math-algebra1']) {
        await page.locator('.pathway-add-course select').selectOption(id);
        await button('Add course').click();
      }
      await page.getByRole('button', { name: 'Move Algebra 1 up', exact: true }).click();
      await button('Save pathway').click();
      await waitForPathway('Science and mathematics');
      const customId = (await readProgress()).learningPathways.find(path => path.title === 'Science and mathematics').id;
      assert.deepEqual((await readProgress()).learningPathways.find(path => path.id === customId).courseIds, ['math-algebra1', 'science-biology']);
      await page.getByRole('article', { name: 'Science and mathematics pathway', exact: true }).getByRole('button', { name: 'Edit pathway', exact: true }).click();
      await page.getByLabel('Pathway name', { exact: true }).fill('My science pathway');
      await page.getByRole('button', { name: 'Move Biology up', exact: true }).click();
      await audit(name + '-pathway-editor', page.getByRole('form', { name: 'Edit pathway', exact: true }));
      await button('Save pathway').click();
      await waitForPathway('My science pathway');
      await page.reload();
      await heading('Library').waitFor();
      await navigateProgress();
      await waitForPathway('My science pathway');
      assert.deepEqual((await readProgress()).learningPathways.find(path => path.id === customId).courseIds, ['science-biology', 'math-algebra1']);
      await page.getByRole('article', { name: 'My science pathway pathway', exact: true }).getByRole('button', { name: 'Stop following', exact: true }).click();
      await page.getByRole('article', { name: 'My science pathway pathway', exact: true }).waitFor({ state: 'detached' });
      assert.equal((await readProgress()).learningPathways.some(path => path.id === customId), false);
      assert.equal((await readProgress()).lessonsDone['math-prealgebra/pre-place-value'], '2026-10-28', 'removing pathway preserves learning history');
      checks.push({ persistence: 'follow, create, reorder, edit, save, reload, remove', preserved: 'course enrollment and lesson history' });
    }
    await context.close();
  }

  // A new local learner has an honest empty state, not demo totals or automatic enrollment.
  const emptyContext = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: 'light', reducedMotion: 'reduce' });
  await emptyContext.route('**/*', route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
  page = await emptyContext.newPage();
  page.on('pageerror', error => errors.push(`${current}: ${error.message}`));
  await page.goto(origin + '/?app');
  await heading('Library').waitFor();
  await navigateProgress();
  await heading('Your learning starts with a course').waitFor();
  assert.equal(await page.locator('.enrolled-course-card').count(), 0);
  assert.equal(await page.locator('.learning-pathway-card').count(), 0);
  await audit('light-390-empty');
  await emptyContext.close();
  assert.deepEqual(errors, []);
  await rm(path.join(out, 'failure-diagnostics.json'), { force: true });
  await rm(path.join(out, 'failure.png'), { force: true });
  await writeFile(path.join(out, 'result.json'), JSON.stringify({ passed: true, app: 'actual App in desktop preview mode', data: 'real bundled course content with synthetic local demo progress', externalNetwork: 'blocked', screenshots, checks, errors }, null, 2));
  console.log('Learning progress browser: enrollment rollups, course details/results return, seven-course pathway, real persistence, responsive layouts, empty state and axe passed.');
} catch (error) {
  await writeFile(path.join(out, 'failure-diagnostics.json'), JSON.stringify({ current, error: String(error), errors, screenshots, checks }, null, 2));
  if (page) await page.screenshot({ path: path.join(out, 'failure.png'), fullPage: false }).catch(() => {});
  throw error;
} finally {
  await browser?.close();
  await server?.close();
}

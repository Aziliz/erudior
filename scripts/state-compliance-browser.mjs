// Real App/IndexedDB check of the state-compliance additions: subject check, plan, low score, daily minimum, FL notice date.
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import react from '@vitejs/plugin-react';
const pw = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const chromium = pw.chromium || pw.default.chromium;
const root = fileURLToPath(new URL('../', import.meta.url));
const out = process.env.BROWSER_ARTIFACTS || path.join(root, 'test-results', 'state-compliance-browser');
await mkdir(out, { recursive: true });
const password = 'Synthetic compliance password 2026';
let server, browser;
const errors = [];
try {
  server = await createServer({ root, configFile: false, plugins: [react()], server: { host: '127.0.0.1', port: 0 }, define: { __DEV_COURSE_KEY__: JSON.stringify(''), 'import.meta.env.VITE_HOMESCHOOL': JSON.stringify('1'), 'import.meta.env.VITE_AS_DESKTOP': JSON.stringify(''), 'import.meta.env.VITE_COURSES_URL': JSON.stringify('') }, logLevel: 'warn' });
  await server.listen();
  const origin = `http://127.0.0.1:${server.httpServer.address().port}`;
  browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH, args: ['--no-sandbox'] } : {});
  const context = await browser.newContext({ viewport: { width: 1280, height: 1000 } });
  await context.route('**/*', route => { const u = new URL(route.request().url()); return u.origin === origin || ['data:', 'blob:'].includes(u.protocol) ? route.continue() : route.abort(); });
  const page = await context.newPage(); page.setDefaultTimeout(20000);
  page.on('pageerror', e => errors.push(e.message)); page.on('dialog', d => d.accept());
  const heading = name => page.getByRole('heading', { name, exact: true });
  const tab = async name => { await page.getByRole('navigation', { name: 'Parent sections', exact: true }).getByRole('button', { name, exact: true }).click(); };
  const unlock = async () => {
    await heading("Who's learning?").or(heading('Parent area')).first().waitFor();
    if (await heading("Who's learning?").isVisible()) await page.getByRole('button', { name: 'Parent area', exact: true }).click();
    await page.getByLabel('Parent password', { exact: true }).fill(password);
    await page.getByRole('button', { name: 'Open', exact: true }).click();
    await page.getByRole('navigation', { name: 'Parent sections', exact: true }).waitFor();
  };
  const shot = async (name, target) => { await target.scrollIntoViewIfNeeded(); await page.screenshot({ path: path.join(out, name + '.png') }); };
  await page.goto(origin + '/');
  await page.waitForLoadState('networkidle');
  const ids = await page.evaluate(async password => {
    const store = await import('/src/lib/storage.ts'), fam = await import('/src/lib/family.ts'), r = await import('/src/lib/records.ts');
    const { family } = await fam.createFamily({ mode: 'homeschool', state: 'NY', route: 'Home education law', year: { start: '2026-08-01', end: '2027-07-31' }, dailyMinutes: 180, password, students: [{ name: 'Synthetic Ada', grade: 3 }] });
    const s = family.students[0];
    await fam.saveFamily({ ...family, students: [{ ...s, assigned: [{ courseId: 'math-6', subject: 'Math', assigned: '2026-08-01' }] }] });
    await store.updateProfileProgress(s.id, () => ({ ...store.emptyProgress(), catalogV1: true, enrolled: [] }));
    let rec = r.addTime(r.emptyRecords(), '2026-09-01', 'math-6', 3600);
    rec = { ...rec, tests: [{ id: 't1', date: '2026-09-15', name: 'Synthetic CAT', result: 'Composite 30th percentile', notes: '', percentile: 30 }] };
    await r.saveRecords(s.id, rec);
    return { ada: s.id };
  }, password);
  await page.goto(origin + '/parent');
  await unlock();
  // Overview: subject check (NY areas without hours)
  await tab('Overview');
  const check = page.locator('.subject-check').first();
  await check.getByText(/No hours yet in:/).waitFor();
  assert.match(await check.innerText(), /English language arts, Science, Social studies, Arts, Health and PE/);
  await shot('overview-subject-check', check);
  // Grades: low score flag (NY: at or below 33rd)
  await tab('Grades');
  const flag = page.locator('.pill.fail').filter({ hasText: 'at or below the 33rd percentile' });
  await flag.waitFor();
  await shot('grades-low-score', flag);
  // Reports: IHIP
  await tab('Reports');
  await page.locator('label.field').filter({ has: page.locator('span', { hasText: /^Report$/ }) }).locator('select').selectOption('plan');
  const doc = page.getByRole('article', { name: 'Individualized Home Instruction Plan (IHIP)' });
  await doc.waitFor();
  const text = await doc.innerText();
  assert.match(text, /Math/); assert.match(text, /Quarterly report dates/); assert.match(text, /November 15, 2026/); assert.match(text, /Not planned yet: English language arts/);
  await page.getByText('Edit the plan', { exact: true }).click();
  const sci = page.locator('fieldset').filter({ hasText: 'Science' }).getByLabel('Objectives or syllabus');
  await sci.fill('Plants and seeds\nWeather');
  await sci.blur();
  await doc.getByText('Plants and seeds', { exact: true }).waitFor();
  await doc.screenshot({ path: path.join(out, 'reports-ihip.png') });
  const saved = await page.evaluate(async id => (await (await import('/src/lib/records.ts')).loadRecords(id)).narratives['plan:2026-08-01'], ids.ada);
  assert.equal(saved['objectives:Science'], 'Plants and seeds\nWeather');
  // GA: daily minimum warning in Settings
  await page.evaluate(async () => { const fam = await import('/src/lib/family.ts'); const f = await fam.loadFamily(); await fam.saveFamily({ ...f, state: 'GA' }); });
  await page.reload(); await unlock();
  await tab('Settings and backup');
  const warn = page.getByText(/Georgia expects 4.5 hours of instruction per school day/);
  await warn.waitFor();
  await shot('settings-daily-minimum', warn);
  // FL: notice date drives the evaluation reminder
  await page.evaluate(async () => { const fam = await import('/src/lib/family.ts'); const f = await fam.loadFamily(); await fam.saveFamily({ ...f, state: 'FL' }); });
  await page.reload(); await unlock();
  await tab('State rules');
  const date = page.getByLabel('Date you filed your first notice of intent');
  await date.fill('2025-09-10');
  await page.waitForFunction(async () => (await (await import('/src/lib/family.ts')).loadFamily())?.noticeFiled === '2025-09-10');
  await shot('state-rules-fl', date);
  // PA: qualification note
  await page.evaluate(async () => { const fam = await import('/src/lib/family.ts'); const f = await fam.loadFamily(); await fam.saveFamily({ ...f, state: 'PA' }); });
  await page.reload(); await unlock();
  await tab('State rules');
  const qual = page.getByText(/Pennsylvania sets a parent qualification/);
  await qual.waitFor();
  await shot('state-rules-pa', qual);
  assert.deepEqual(errors, []);
  console.log('state compliance browser checks passed');
} finally {
  await browser?.close(); await server?.close();
}

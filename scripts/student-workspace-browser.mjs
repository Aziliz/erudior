// Production App routes and IndexedDB with isolated synthetic learners only.
// No identity provider, production API, or real learner records are contacted.
import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import react from '@vitejs/plugin-react';
const pw = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const chromium = pw.chromium || pw.default.chromium;
const root = fileURLToPath(new URL('../', import.meta.url));
const out = process.env.BROWSER_ARTIFACTS || path.join(root, 'test-results', 'student-workspace-browser');
await mkdir(out, { recursive: true });
const axe = await readFile(new URL('../node_modules/axe-core/axe.min.js', import.meta.url), 'utf8');
let server, browser, page, current = 'startup';
const checks = [], screenshots = [], errors = [];
const heading = text => page.getByRole('heading', { name: text, exact: true });
const button = text => page.getByRole('button', { name: text, exact: true });
const entry = title => page.getByRole('article', { name: new RegExp(': ' + title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$') });
const readProgress = () => page.evaluate(async () => (await import('/src/lib/storage.ts')).loadProgress());
// Learner grants are explicit, memory-only and require the actual supervising-adult gate.
async function unlockSelectedLearner() {
  await page.getByLabel('Parent password', {exact:true}).fill('Synthetic test password only');
  await page.getByRole('button', {name:'Open',exact:true}).click();
  await page.getByRole('heading', {name:'Shared device locked',exact:true}).waitFor({state:'hidden'});
}
async function workspace() {
  await page.locator('header.topbar').getByRole('button', { name: 'Courses', exact: true }).click();
  await heading('Courses').waitFor();
  await button('Open student workspace').click();
  await heading('Student dashboard and notebook').waitFor();
}
async function audit(name) {
  current = name;
  await page.evaluate(() => document.fonts.ready);
  assert(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth) <= 1, `${name}: horizontal body overflow`);
  await page.addScriptTag({ content: axe });
  const violations = await page.evaluate(async () => (await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] } })).violations.map(v => ({ id: v.id, targets: v.nodes.map(n => n.target) })));
  assert.deepEqual(violations, [], `${name}: accessibility`);
  const file = name + '.png';
  await page.screenshot({ path: path.join(out, file), fullPage: false });
  screenshots.push(file);
}
async function seed() {
  return page.evaluate(async () => {
    const store = await import('/src/lib/storage.ts');
    const { emptyCourse } = await import('/src/lib/course.ts');
    const { createFamily } = await import('/src/lib/family.ts');
    const { family } = await createFamily({ mode: 'homeschool', state: '', route: 'Synthetic local demo', year: { start: '2026-08-01', end: '2027-07-31' }, dailyMinutes: 180, password: 'Synthetic test password only', students: [{ name: 'Synthetic Alice', grade: 8 }, { name: 'Synthetic Bob', grade: 6 }] });
    const course = { ...emptyCourse('Synthetic installed course'), id: 'synthetic-workspace-course', modules: [{ id: 'unit', title: 'Synthetic unit' }], lessons: [{ id: 'lesson', module: 'unit', title: 'Synthetic linked lesson', body: 'This lesson exists only in isolated test storage.' }], texts: [{ id: 'reading', title: 'Synthetic linked reading', sections: [{ id: 'section', title: 'Synthetic section', body: 'Synthetic reading text.' }] }] };
    await store.saveCourse(course);
    for (const learner of family.students) await store.updateProfileProgress(learner.id, () => ({ ...store.emptyProgress(), catalogV1: true, enrolled: [course.id] }));

    const { savePhotos } = await import('/src/lib/portfolio.ts');
    const photo = { id:'synthetic-photo', caption:'Synthetic work photo', subject:'Synthetic subject', date:'2026-10-30', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l9sAAAAASUVORK5CYII=' };
    await savePhotos(family.students[0].id,[photo]);
    await savePhotos(family.students[1].id,[{...photo,image:'https://untrusted.invalid/private-photo.png'}]);
    return { alice: family.students[0].id, bob: family.students[1].id, courseId: course.id };
  });
}
try {
  server = await createServer({ root, configFile: false, plugins: [react()], server: { host: '127.0.0.1', port: 0 }, define: {
    __DEV_COURSE_KEY__: JSON.stringify(''), 'import.meta.env.VITE_HOMESCHOOL': JSON.stringify('1'),
    'import.meta.env.VITE_AS_DESKTOP': JSON.stringify(''), 'import.meta.env.VITE_COURSES_URL': JSON.stringify(''),
    'import.meta.env.VITE_COMMUNITY_API': JSON.stringify(''),
  }, logLevel: 'warn' });
  await server.listen();
  const origin = `http://127.0.0.1:${server.httpServer.address().port}`;
  browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH, args: ['--no-sandbox'] } : {});
  for (const { width, theme } of [{ width: 1280, theme: 'light' }, { width: 320, theme: 'dark' }]) {
    current = `${theme}-${width}`;
    const context = await browser.newContext({ viewport: { width, height: 1000 }, colorScheme: theme, reducedMotion: 'reduce' });
    await context.route('**/*', route => {
      const url = new URL(route.request().url());
      return url.origin === origin || ['data:', 'blob:'].includes(url.protocol) ? route.continue() : route.abort();
    });
    page = await context.newPage(); page.setDefaultTimeout(15000);
    page.on('pageerror', error => errors.push(`${current}: ${error.message}`));
    await page.goto(origin + '/?app'); await heading('Library').waitFor();
    const ids = await seed();
    await page.reload(); await heading("Who's learning?").waitFor();
    await page.locator('.who-card').filter({ hasText: 'Synthetic Alice' }).click();await unlockSelectedLearner(); await heading('Library').waitFor();
    await workspace();
    assert.equal(new URL(page.url()).pathname, '/workspace');

    const photo = page.getByRole('img',{name:'Synthetic work photo',exact:true});
    await photo.waitFor(); await photo.scrollIntoViewIfNeeded();
    await page.waitForFunction(()=>{const image=document.querySelector('section[aria-labelledby="student-portfolio-title"] img');return image?.complete&&image.naturalWidth>0;});
    assert.equal(await page.locator('section[aria-labelledby="student-portfolio-title"]').getByRole('button',{name:/delete|edit|grade|award/i}).count(),0,'learner portfolio has no adult edit or assessment authority');
    await audit(`${theme}-${width}-empty`);

    const original = await readProgress();
    for (const [kind, section] of [['task','Daily plan'],['note','Notebook'],['reading','Reading shelf'],['goal','Goals'],['project','Projects']]) {
      await page.getByRole('navigation', { name: 'Workspace sections', exact: true }).getByRole('button', { name: section, exact: true }).click();
      await button(`Add ${kind}`).click();
      const form = page.getByRole('form', {name:`Add ${kind}`,exact:true});
      assert(await form.getByLabel('Title',{exact:true}).evaluate(node=>node===document.activeElement), 'editor focuses title');
      await form.getByLabel('Title',{exact:true}).fill(`Synthetic ${kind}`);
      await form.getByLabel('Notes',{exact:true}).fill('Private synthetic ideas\n<img src=x onerror="window.injected=1">');
      await form.getByLabel('Status',{exact:true}).selectOption('active');
      await form.getByLabel('Date (optional)',{exact:true}).fill('2026-11-01');
      if (kind === 'note') await form.getByLabel('Link installed resource (optional)',{exact:true}).selectOption(JSON.stringify({courseId:ids.courseId,kind:'lesson',sourceId:'lesson'}));
      if (kind === 'project') await audit(`${theme}-${width}-editor`);
      // Keyboard submission, not a custom fixture callback.
      await form.getByRole('button',{name:'Save entry',exact:true}).focus(); await page.keyboard.press('Enter');
      await entry(`Synthetic ${kind}`).waitFor();
      assert.equal(await entry(`Synthetic ${kind}`).locator('img').count(),0,'plain text never becomes executable markup');
      assert.equal(await page.evaluate(()=>window.injected),undefined);
      await entry(`Synthetic ${kind}`).getByRole('button',{name:'Mark done',exact:true}).click();
      await entry(`Synthetic ${kind}`).getByRole('button',{name:'Reopen',exact:true}).waitFor();
      await page.getByLabel('Show entries',{exact:true}).selectOption('unfinished');
      assert.equal(await page.locator('.workspace-entry').count(),0);
      await page.getByLabel('Show entries',{exact:true}).selectOption('all');
      await entry(`Synthetic ${kind}`).getByRole('button',{name:'Reopen',exact:true}).click();
      await entry(`Synthetic ${kind}`).getByRole('button',{name:`Edit ${kind}`,exact:true}).click();
      await page.getByLabel('Title',{exact:true}).fill('Canceled title');
      await button('Cancel edit').click(); await entry(`Synthetic ${kind}`).waitFor();
    }
    const after = await readProgress();
    const {studentWorkspace: ignored, ...unchanged} = after;
    assert.deepEqual(unchanged, original, 'personal planning does not mutate learning progress or authority');
    assert.equal(after.studentWorkspace.entries.length,5);
    await entry('Synthetic project').getByRole('button',{name:'Mark done',exact:true}).click();
    const completedProject = page.locator('section[aria-labelledby="student-portfolio-title"]').getByText('Synthetic project',{exact:true});
    await completedProject.waitFor();
    assert.equal(await completedProject.count(),1);
    await audit(`${theme}-${width}-projects-and-portfolio`);
    await button('Notebook').click();
    await entry('Synthetic note').getByRole('button',{name:'Edit note',exact:true}).click();
    await page.getByLabel('Notes',{exact:true}).fill('Unsaved text preserved across blocked navigation');
    await page.locator('header.topbar').getByRole('button',{name:'Courses',exact:true}).click();
    await heading('Student dashboard and notebook').waitFor();
    assert.equal(await page.getByLabel('Notes',{exact:true}).inputValue(),'Unsaved text preserved across blocked navigation');
    await button('Cancel edit').click();
    await page.locator('header.topbar').getByRole('button',{name:'Courses',exact:true}).click();
    await heading('Courses').waitFor(); await page.goBack(); await heading('Student dashboard and notebook').waitFor();
    await page.goForward(); await heading('Courses').waitFor(); await button('Open student workspace').click();
    await heading('Student dashboard and notebook').waitFor();
    await button('Notebook').click();
    await entry('Synthetic note').getByRole('button',{name:/^Open linked resource:/}).click();
    await heading('Synthetic linked lesson').waitFor();
    await page.goBack(); await heading('Student dashboard and notebook').waitFor(); await button('Notebook').click();

    // Actual CAS conflict: the open editor is stale relative to another saved change.
    await entry('Synthetic note').getByRole('button',{name:'Edit note',exact:true}).click();
    await page.getByLabel('Notes',{exact:true}).fill('Stale browser draft');
    await page.evaluate(async () => {
      const store=await import('/src/lib/storage.ts');
      await store.updateProfileProgress(store.activeStudent(),current=>({...current,studentWorkspace:{...current.studentWorkspace,entries:current.studentWorkspace.entries.map(e=>e.kind==='note'?{...e,body:'Other writer saved first'}:e)}}));
    });
    await button('Save entry').click(); await page.getByRole('alert').filter({hasText:/changed/}).waitFor();
    assert.equal(await page.getByLabel('Notes',{exact:true}).inputValue(),'Stale browser draft');
    assert.equal((await readProgress()).studentWorkspace.entries.find(e=>e.kind==='note').body,'Other writer saved first');
    await button('Cancel edit').click(); await button('Refresh saved workspace').click();
    await entry('Synthetic note').getByText('Other writer saved first',{exact:true}).waitFor();

    // Saving requires no network. Reload is verified after reconnecting the app shell.
    await context.setOffline(true);
    await entry('Synthetic note').getByRole('button',{name:'Edit note',exact:true}).click();
    await page.getByLabel('Notes',{exact:true}).fill('Offline persisted note'); await button('Save entry').click();
    await entry('Synthetic note').getByText('Offline persisted note',{exact:true}).waitFor();
    await context.setOffline(false); await page.reload();
    await heading("Who's learning?").waitFor(); await page.locator('.who-card').filter({hasText:'Synthetic Alice'}).click();await unlockSelectedLearner();
    await heading('Library').waitFor(); await workspace(); await button('Notebook').click();
    await entry('Synthetic note').getByText('Offline persisted note',{exact:true}).waitFor();
    await audit(`${theme}-${width}-notebook-reloaded`);

    // Link targets can disappear, but the student's independent note remains useful.
    await page.evaluate(async id => (await import('/src/lib/storage.ts')).deleteCourse(id),ids.courseId);
    await page.reload(); await heading("Who's learning?").waitFor();
    await page.locator('.who-card').filter({hasText:'Synthetic Alice'}).click();await unlockSelectedLearner(); await heading('Library').waitFor();
    await workspace(); await button('Notebook').click();
    await entry('Synthetic note').getByText('Linked resource is not installed. Your entry is kept.',{exact:true}).waitFor();
    assert.equal(await entry('Synthetic note').getByRole('button',{name:/^Open linked resource:/}).count(),0);
    // Switching local profiles never displays or carries Alice's notebook into Bob's.
    await page.getByRole('button',{name:'Student: Synthetic Alice. Switch student',exact:true}).click();
    await heading("Who's learning?").waitFor(); await page.locator('.who-card').filter({hasText:'Synthetic Bob'}).click();await unlockSelectedLearner();
    await heading('Library').waitFor(); await workspace();

    await page.getByRole('alert').filter({hasText:/unsupported format/}).waitFor();
    assert.equal(await page.locator('section[aria-labelledby="student-portfolio-title"]').getByRole('img').count(),0,'remote or malformed saved image is not rendered');
    assert.equal((await readProgress()).studentWorkspace,undefined);
    assert.equal(await page.locator('.workspace-entry').count(),0);
    await button('Add task').click(); await page.getByLabel('Title',{exact:true}).fill('Bob private task'); await button('Save entry').click();
    await entry('Bob private task').waitFor();
    const deletion=page.waitForEvent('dialog').then(dialog=>dialog.dismiss());
    await entry('Bob private task').getByRole('button',{name:'Delete task',exact:true}).click(); await deletion;
    await entry('Bob private task').waitFor();
    const confirmed=page.waitForEvent('dialog').then(dialog=>dialog.accept());
    await entry('Bob private task').getByRole('button',{name:'Delete task',exact:true}).click(); await confirmed;
    await entry('Bob private task').waitFor({state:'detached'});
    assert.equal((await readProgress()).studentWorkspace.entries.length,0);
    await page.getByRole('button',{name:'Student: Synthetic Bob. Switch student',exact:true}).click();
    await heading("Who's learning?").waitFor(); await page.locator('.who-card').filter({hasText:'Synthetic Alice'}).click();await unlockSelectedLearner();
    await heading('Library').waitFor(); await workspace();
    assert.equal((await readProgress()).studentWorkspace.entries.length,5,'Alice workspace preserved across Bob edits');
    checks.push({workflow:'create/edit/cancel/status/delete; keyboard; Back/Forward; real CAS conflict; offline save/reload; missing resource; profile isolation', entries:5});

    checks.push({ viewport: width, theme, profiles: ids });
    await context.close();
  }
  assert.deepEqual(errors, [], 'No browser runtime errors');
  await writeFile(path.join(out, 'result.json'), JSON.stringify({ passed: true, data: 'synthetic isolated local learners', externalNetwork: 'blocked', checks, screenshots, errors }, null, 2));
  console.log('Student workspace browser acceptance passed.');
} catch (error) {
  await writeFile(path.join(out, 'failure.json'), JSON.stringify({ current, error: String(error), checks, screenshots, errors }, null, 2));
  if (page) await page.screenshot({ path: path.join(out, 'failure.png'), fullPage: false }).catch(() => {});
  throw error;
} finally { await browser?.close(); await server?.close(); }

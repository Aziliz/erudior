// Actual App + production FamilyBackupRecovery + real WebCrypto + IndexedDB.
// Only synthetic local Family data. Every external request is blocked. No success mocks.
import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import react from '@vitejs/plugin-react';
import { seedFamilyRecovery, corruptEncryptedBackup, decryptDownloadedBackup } from './fixtures/family-recovery-fixture.mjs';

const pw = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const chromium = pw.chromium || pw.default.chromium;
const root = fileURLToPath(new URL('../', import.meta.url));
const out = process.env.BROWSER_ARTIFACTS || path.join(root, 'test-results', 'family-recovery-browser');
const password = 'Synthetic adult recovery password 2026';
const passphrase = 'Synthetic encrypted Family recovery passphrase 2026';
const axe = await readFile(new URL('../node_modules/axe-core/axe.min.js', import.meta.url), 'utf8');
await mkdir(out, { recursive: true });
let server, browser, page, origin, current = 'browser-startup';
const checks = [], screenshots = [], errors = [], externalRequests = [];
let writes = [];
const button = name => page.getByRole('button', { name, exact: true });
const label = name => page.getByLabel(name, { exact: true });
const heading = name => page.getByRole('heading', { name, exact: true });
const verified = () => page.getByRole('region', { name: 'Verified Family backup', exact: true });
const visibleAlert = pattern => page.getByRole('alert').filter({ hasText: pattern }).first();

async function authenticate() {
  const credential = page.getByLabel(/^(Parent password|Teacher password|PIN)$/).filter({ visible: true });
  await credential.first().waitFor();
  const form = credential.first().locator('xpath=ancestor::form[1]');
  const fallback = form.getByRole('button', { name: 'Use password instead', exact: true });
  if (await fallback.isVisible()) await fallback.click();
  await form.getByLabel(/^(Parent|Teacher) password$/).fill(password);
  await form.getByRole('button', { name: 'Open', exact: true }).click();
}
async function openSettings() {
  // Full reload is intentional: startup must require real adult authentication.
  await page.goto(origin + '/parent/planning');
  await heading('Parent area').waitFor();
  await authenticate();
  await page.getByRole('navigation', { name: 'Parent sections', exact: true }).getByRole('button', { name: 'Settings and backup', exact: true }).click();
  await button('Verify an encrypted backup').waitFor();
  const authority = await page.evaluate(async () => {
    const session = await import('/src/lib/localSession.ts');
    session.assertLocalAdult();
    return { enabled: session.localSessionEnabled(), locked: session.localSessionLocked() };
  });
  assert.deepEqual(authority, { enabled: true, locked: false }, 'Real adult gate remains enabled throughout the suite');
}
async function snapshot() {
  return page.evaluate(async () => {
    // Read every persisted Erudior key directly. No injected storage implementation.
    const persisted = await new Promise((resolve, reject) => {
      const request = indexedDB.open('erudior', 1);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const db = request.result, tx = db.transaction('kv', 'readonly'), store = tx.objectStore('kv');
        const keys = store.getAllKeys(), values = store.getAll();
        tx.oncomplete = () => { resolve(keys.result.map((key, index) => [String(key), values.result[index]]).sort(([a], [b]) => a.localeCompare(b))); db.close(); };
        tx.onerror = () => reject(tx.error);
      };
    });
    const entries = storage => Object.keys(storage).sort().map(key => [key, storage.getItem(key)]);
    return { indexedDB: persisted, localStorage: entries(localStorage), sessionStorage: entries(sessionStorage) };
  });
}
async function unchanged(before, reason) {
  assert.deepEqual(await snapshot(), before, reason);
  assert.deepEqual(writes, [], reason + ': no attempted persistent writes');
}
async function readRecovered(ids) {
  return page.evaluate(async ids => {
    const store = await import('/src/lib/storage.ts');
    return {
      records: await (await import('/src/lib/records.ts')).loadRecords(ids.alice),
      progress: JSON.parse(await store.loadState('progress-' + ids.alice)),
      course: (await store.listCourses()).courses.find(course => course.id === ids.courseId),
      attachment: await (await import('/src/lib/documents.ts')).loadFile(ids.fileId),
    };
  }, ids);
}
async function modifyCurrentData(ids, marker) {
  await page.evaluate(async ({ ids, marker }) => {
    const records = await import('/src/lib/records.ts');
    await records.updateRecordsAtomic(ids.alice, old => ({ ...old, manual: [...old.manual, { id: marker, date: '2026-11-02', minutes: 7, subject: 'Science', note: marker }] }));
  }, { ids, marker });
}
async function beginVerification(file, secret = passphrase) {
  await button('Verify an encrypted backup').click();
  await authenticate();
  await label('Encrypted Family backup file').setInputFiles(file);
  await label('Backup passphrase to verify').fill(secret);
  const before = await snapshot(); writes = [];
  return before;
}
async function verifyFile(file) {
  const before = await beginVerification(file);
  await button('Verify selected backup').click();
  await heading('Backup verified').waitFor();
  await unchanged(before, 'Decrypt/verify is read-only');
  return before;
}
async function finishVerification(before) {
  await button('Finish verification without restoring').focus();
  await page.keyboard.press('Enter');
  await verified().waitFor({ state: 'hidden' });
  await button('Verify an encrypted backup').waitFor();
  await unchanged(before, 'Finishing the verification drill writes no Family data');
}
async function confirmRestore({ duplicate = false } = {}) {
  await button('Review restore').click();
  assert.equal(await button('Restore this verified backup').isDisabled(), true, 'Restore requires a separate explicit acknowledgement');
  await label('I understand this replaces local Family data').check();
  await button('Restore this verified backup').focus();
  if (duplicate) await button('Restore this verified backup').evaluate(element => { element.click(); element.click(); });
  else await page.keyboard.press('Enter');
}
// The app deliberately scrolls inside .main. Capture real visible viewports,
// paging through a tall review instead of enlarging the page beyond its scroller.
async function captureReviewViewports(name, target) {
  await target.waitFor({ state: 'visible' });
  let offset = 0, previousScroll = null;
  for (let part = 1; part <= 12; part++) {
    const frame = await target.evaluate((element, offset) => {
      let scroller = element.parentElement;
      while (scroller && !(scroller.scrollHeight > scroller.clientHeight + 1 && /auto|scroll/.test(getComputedStyle(scroller).overflowY))) scroller = scroller.parentElement;
      const headerBottom = Math.max(0, document.querySelector('header.topbar')?.getBoundingClientRect().bottom ?? 0);
      const clip = scroller?.getBoundingClientRect();
      const top = Math.max(0, headerBottom, clip?.top ?? 0) + 12;
      const bottom = Math.min(innerHeight, clip?.bottom ?? innerHeight) - 12;
      const adjustment = element.getBoundingClientRect().top - (top - offset);
      if (scroller) scroller.scrollTop += adjustment;
      else window.scrollBy({ top: adjustment, behavior: 'instant' });
      const rect = element.getBoundingClientRect();
      return { top, bottom, targetTop: rect.top, targetBottom: rect.bottom,
        visibleHeight: Math.min(rect.bottom, bottom) - Math.max(rect.top, top),
        scroll: scroller ? scroller.scrollTop : window.scrollY };
    }, offset);
    assert(frame.visibleHeight > 0, `${name}: intended review content must be visible (${JSON.stringify(frame)})`);
    if (part === 1) assert(frame.targetTop >= frame.top - 1, `${name}: review starts below the app header`);
    if (previousScroll !== null) assert(frame.scroll > previousScroll, `${name}: review screenshots must advance through the actual scroller`);
    const filename = name + (part === 1 ? '' : `-part-${part}`) + '.png';
    await page.screenshot({ path: path.join(out, filename), fullPage: false });
    screenshots.push(filename);
    if (frame.targetBottom <= frame.bottom + 1) return;
    // Overlap makes the inventory, warnings and final action sequence readable.
    offset += Math.max(1, frame.visibleHeight - 96);
    previousScroll = frame.scroll;
  }
  assert.fail(`${name}: review exceeds the bounded screenshot sequence`);
}
async function audit(name, target = verified()) {
  current = name;
  await page.evaluate(() => document.fonts.ready);
  assert(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth) <= 1, `${name}: horizontal overflow`);
  await page.addScriptTag({ content: axe });
  const violations = await page.evaluate(async () => (await window.axe.run(document, {
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] },
  })).violations.map(v => ({ id: v.id, targets: v.nodes.map(node => node.target) })));
  assert.deepEqual(violations, [], `${name}: accessibility`);
  await captureReviewViewports(name, target);
}
async function installProbes() {
  await page.exposeFunction('__familyRecoveryWrite', entry => writes.push(entry));
  await page.addInitScript(() => {
    const originalPut = IDBObjectStore.prototype.put, originalDelete = IDBObjectStore.prototype.delete;
    IDBObjectStore.prototype.put = function (value, key) {
      const fault = window.__familyRecoveryFault;
      if (fault && String(key) === fault.key) { window.__familyRecoveryFault = null; throw new DOMException('Synthetic disk write failure after earlier restore writes', 'QuotaExceededError'); }
      if (this.name === 'kv') window.__familyRecoveryWrite({ operation: 'put', key: String(key) });
      return originalPut.call(this, value, key);
    };
    IDBObjectStore.prototype.delete = function (key) {
      if (this.name === 'kv') window.__familyRecoveryWrite({ operation: 'delete', key: String(key) });
      return originalDelete.call(this, key);
    };
    // Delay a real WebCrypto result, never substitute its value or grant access.
    const decrypt = crypto.subtle.decrypt.bind(crypto.subtle);
    crypto.subtle.decrypt = async (...args) => {
      const result = await decrypt(...args), hold = window.__familyRecoveryDecrypt;
      if (hold?.enabled) { hold.calls++; hold.entered = true; await new Promise(resolve => { hold.release = resolve; }); }
      return result;
    };
  });
}
async function holdDecryption() {
  await page.evaluate(() => { window.__familyRecoveryDecrypt = { enabled: true, entered: false, calls: 0 }; });
}
async function waitForHeldDecryption() {
  await page.waitForFunction(() => window.__familyRecoveryDecrypt?.entered === true);
}
async function releaseDecryption() {
  await page.evaluate(() => { const hold = window.__familyRecoveryDecrypt; if (hold) { hold.enabled = false; hold.release?.(); } });
}

try {
  // Fail closed on unavailable Chromium. Do not convert missing browser coverage
  // into a pass or add sandbox/security bypasses to work around executor denials.
  browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  server = await createServer({
    root, configFile: false, plugins: [react()], server: { host: '127.0.0.1', port: 0 },
    define: { __DEV_COURSE_KEY__: JSON.stringify(''), 'import.meta.env.VITE_HOMESCHOOL': JSON.stringify('1'), 'import.meta.env.VITE_AS_DESKTOP': JSON.stringify(''), 'import.meta.env.VITE_COURSES_URL': JSON.stringify(''), 'import.meta.env.VITE_COMMUNITY_API': JSON.stringify('') }, logLevel: 'warn',
  });
  await server.listen(); origin = `http://127.0.0.1:${server.httpServer.address().port}`;
  for (const { width, theme } of [{ width: 1280, theme: 'light' }, { width: 1280, theme: 'dark' }, { width: 320, theme: 'light' }, { width: 320, theme: 'dark' }]) {
    const prefix = `${theme}-${width}`;
    current = prefix + '-seed';
    const context = await browser.newContext({ viewport: { width, height: 1000 }, colorScheme: theme, reducedMotion: 'reduce', acceptDownloads: true });
    await context.route('**/*', route => {
      const url = new URL(route.request().url());
      if (url.origin === origin || ['data:', 'blob:'].includes(url.protocol)) return route.continue();
      externalRequests.push({ method: route.request().method(), origin: url.origin, path: url.pathname });
      return route.abort();
    });
    page = await context.newPage(); page.setDefaultTimeout(20_000);
    page.on('pageerror', error => errors.push(`${current}: ${error.message}`));
    page.on('dialog', dialog => dialog.dismiss());
    await installProbes();
    await page.goto(origin); await heading('Library').waitFor();
    const ids = await page.evaluate(seedFamilyRecovery, { password });
    await openSettings();
    const backupPath = path.join(out, prefix + '-synthetic-encrypted-backup.json');
    await label('Backup passphrase').fill(passphrase);
    const downloading = page.waitForEvent('download');
    await button('Back up now').click(); await authenticate();
    await (await downloading).saveAs(backupPath);
    const encrypted = await readFile(backupPath, 'utf8'), envelope = JSON.parse(encrypted);
    assert.equal(envelope.format, 'examiner-backup-encrypted');
    assert.equal(envelope.kdf.iterations, 600_000, 'Actual production encryption settings');
    assert(!encrypted.includes('Synthetic Recovery Alice'), 'No clear learner inventory in encrypted download');
    const contents = await decryptDownloadedBackup(encrypted, passphrase);
    assert.equal(contents.students[ids.alice].records.manual[0].note, 'Synthetic original backup record');
    assert.equal(contents.files[ids.fileId].data, Buffer.from(ids.attachmentText).toString('base64'));
    assert.equal(contents.files['synthetic-recovery-missing'], undefined);
    const corruptedPath = path.join(out, prefix + '-synthetic-corrupt-backup.json');
    await writeFile(corruptedPath, corruptEncryptedBackup(encrypted));
    await modifyCurrentData(ids, 'synthetic-post-export-change');

    current = prefix + '-read-only-verification';
    let before = await verifyFile(backupPath);
    await verified().getByText('Synthetic Recovery Alice', { exact: false }).first().waitFor();
    await verified().getByText('AAA Synthetic recovered science', { exact: false }).first().waitFor();
    await verified().getByText(/missing/i).first().waitFor();
    await verified().getByText(/attachment|file/i).first().waitFor();
    assert.match(await verified().innerText(), /2/);
    assert.equal(await page.locator('input[type="password"]').filter({ visible: true }).evaluateAll((inputs, expectedPassphrase) => inputs.some(input => input.value === expectedPassphrase), passphrase), false, 'Verification clears the passphrase field');
    await audit(prefix + '-verified-inventory');
    await finishVerification(before);
    await audit(prefix + '-finished-without-restoring', button('Verify an encrypted backup'));

    before = await verifyFile(backupPath);
    await button('Review restore').click();
    await audit(prefix + '-explicit-restore-review');
    await button('Cancel restore review').click();
    await unchanged(before, 'Cancel restore review changes no persisted bytes');
    await button('Cancel verification').click();
    await button('Verify an encrypted backup').waitFor();
    await unchanged(before, 'Cancel verification changes no persisted bytes');

    for (const [name, file, secret] of [['wrong-passphrase', backupPath, 'Definitely wrong synthetic secret'], ['corruption', corruptedPath, passphrase]]) {
      current = prefix + '-' + name;
      before = await beginVerification(file, secret);
      await button('Verify selected backup').click();
      await visibleAlert(/passphrase|damaged|decrypt|corrupt/i).waitFor();
      assert.equal(await heading('Backup verified').count(), 0);
      await unchanged(before, name + ' is rejected before any writes');
      await audit(prefix + '-' + name, visibleAlert(/passphrase|damaged|decrypt|corrupt/i));
      await button('Verify an encrypted backup').waitFor();
    }

    current = prefix + '-stale-current-state';
    await verifyFile(backupPath);
    await modifyCurrentData(ids, 'synthetic-concurrent-edit-after-verification');
    before = await snapshot(); writes = [];
    await confirmRestore();
    await visibleAlert(/changed|verify again|verification.*again|stale/i).waitFor();
    await unchanged(before, 'Current state changed after preview: restore refuses without overwriting it');
    await openSettings();

    current = prefix + '-real-restore';
    await verifyFile(backupPath); writes = [];
    const reloaded = page.waitForEvent('load');
    await confirmRestore({ duplicate: true });
    await reloaded;
    assert.equal(writes.filter(write => write.operation === 'put' && write.key === 'erudior.records-' + ids.alice).length, 1, 'Repeated confirmation runs actual restore only once');
    await heading('Parent area').or(heading("Who's learning?")).waitFor();
    assert.equal(await verified().count(), 0, 'Reload does not retain decrypted preview');
    await openSettings();
    const recovered = await readRecovered(ids);
    assert.deepEqual(recovered.records.manual.map(record => record.id), ['synthetic-original']);
    assert.equal(recovered.records.planning.origin, 'imported', 'Restore retains planning as historical claims');
    assert.equal(recovered.progress.lessonsDone[ids.courseId + '/synthetic-lesson'], '2026-11-01');
    assert.equal(recovered.course.title, 'AAA Synthetic recovered science');
    assert.equal(recovered.attachment.data, Buffer.from(ids.attachmentText).toString('base64'));
    await audit(prefix + '-reloaded-after-real-restore', button('Verify an encrypted backup'));
    checks.push({ width, theme, workflow: 'real encrypted download; independent authenticated byte check; real adult gates; verify zero writes; readable inventory/missing attachment warning; keyboard finish; explicit restore review/cancel; wrong passphrase/ciphertext corruption; stale-current-data rejection; duplicate final confirm; actual production restore; reload persistence' });

    if (width === 1280 && theme === 'light') {
      for (const race of ['cancel', 'lock', 'hide', 'profile', 'native-lifecycle', 'pagehide', 'navigation']) {
        current = prefix + '-late-decrypt-' + race;
        await openSettings();
        before = await beginVerification(backupPath); await holdDecryption();
        await button('Verify selected backup').evaluate(element => { element.click(); element.click(); });
        await waitForHeldDecryption();
        assert.equal(await page.evaluate(() => window.__familyRecoveryDecrypt.calls), 1, 'Repeated Verify submits start one real decryption');
        if (race === 'cancel') await button('Cancel verification').click();
        if (race === 'lock') {
          // A direct Parent-route reload has no selected learner, so its header
          // has no learner toolbar. Use the real app-wide navigation command.
          await button('Open Erudior navigation').click();
          const navigation = page.getByRole('dialog', { name: 'Navigation', exact: true });
          await navigation.getByRole('button', { name: 'Lock device', exact: true }).click();
          await page.getByRole('region', { name: 'Locked shared device', exact: true }).waitFor();
          assert.equal(await page.evaluate(async () => (await import('/src/lib/localSession.ts')).localSessionLocked()), true, 'Navigation command actually revokes the adult session');
        }
        if (race === 'hide') await page.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, value: true }); document.dispatchEvent(new Event('visibilitychange')); });
        if (race === 'profile') {
          // Use the explicit learner-switch action rather than depending on
          // Library redirecting a Parent session without a selected learner.
          await button('Open Erudior navigation').click();
          await page.getByRole('dialog', { name: 'Navigation', exact: true }).getByRole('button', { name: /^Account management/ }).click();
          await page.getByRole('dialog', { name: 'Account management', exact: true }).getByRole('navigation', { name: 'Account actions', exact: true }).getByRole('button', { name: /^Switch learner/ }).click();
          await heading("Who's learning?").waitFor();
          await page.getByRole('button', { name: /^Synthetic Recovery Bob\b/ }).click();
          const lock = page.getByRole('region', { name: 'Locked shared device', exact: true });
          await lock.getByRole('status').filter({ hasText: 'Authorize Synthetic Recovery Bob to learn' }).waitFor();
          await lock.getByLabel('Parent password', { exact: true }).waitFor();
          assert.equal(await page.evaluate(async () => (await import('/src/lib/localSession.ts')).localSessionLocked()), true, 'Choosing another learner still requires the real adult gate');
        }
        if (race === 'native-lifecycle') await page.evaluate(() => window.dispatchEvent(new CustomEvent('erudior-native-lifecycle', { cancelable: true, detail: { bridgeId: 'synthetic-recovery-probe', sequence: 1, revocation: 1, paused: true, backgroundMs: 32_000 } })));
        if (race === 'pagehide') await page.evaluate(() => window.dispatchEvent(new Event('pagehide')));
        if (race === 'navigation') {
          const students = page.getByRole('navigation', { name: 'Parent sections', exact: true }).getByRole('button', { name: 'Students', exact: true });
          await students.click();
          await heading('Students').waitFor();
          assert.equal(await students.getAttribute('aria-current'), 'page', 'Navigation really reaches the Students section');
        }
        await releaseDecryption();
        if (race === 'hide') await page.evaluate(() => { delete document.hidden; document.dispatchEvent(new Event('visibilitychange')); });
        // Wait until the underlying real crypto promise has had a chance to settle.
        await page.waitForTimeout(300);
        assert.equal(await verified().isVisible(), false, race + ': late completion cannot republish private inventory');
        assert.equal(await button('Restore this verified backup').isVisible(), false, race + ': no restored authority');
        await unchanged(before, race + ': interrupted verification writes no data');
        checks.push({ race, workflow: 'held real decrypt completion; duplicate submission suppressed; authority/lifecycle change; late response discarded; zero writes' });
      }

      current = prefix + '-newer-verification-wins';
      await openSettings();
      const newerPath = path.join(out, prefix + '-synthetic-newer-encrypted-backup.json');
      const newerDate = '2026-11-08T12:34:56.000Z';
      // Derive a second authenticated file from the actual export, using the
      // production encryptor and changing only its synthetic creation timestamp.
      const newerBytes = await page.evaluate(async ({ contents, passphrase, newerDate }) =>
        (await import('/src/lib/backup.ts')).encryptText(JSON.stringify({ ...contents, createdAt: newerDate }), passphrase), { contents, passphrase, newerDate });
      await writeFile(newerPath, newerBytes);
      await beginVerification(backupPath); await holdDecryption();
      await button('Verify selected backup').click(); await waitForHeldDecryption();
      await button('Cancel verification').click();
      // Stop holding NEW calls, but keep the old operation's real result pending.
      await page.evaluate(() => { window.__familyRecoveryDecrypt.enabled = false; });
      before = await verifyFile(newerPath);
      await verified().getByText('Backup created: ' + newerDate, { exact: false }).waitFor();
      await releaseDecryption(); await page.waitForTimeout(300);
      await heading('Backup verified').waitFor();
      await verified().getByText('Backup created: ' + newerDate, { exact: false }).waitFor();
      await unchanged(before, 'An older canceled response neither replaces nor clears the newer verified backup');
      await finishVerification(before);
      checks.push({ workflow: 'cancel pending real decrypt; fresh gate and second real encrypted fixture; newer review survives late old response; zero writes' });

      current = prefix + '-partial-real-storage-failure';
      await openSettings();
      await modifyCurrentData(ids, 'synthetic-record-before-partial-restore');
      await page.evaluate(async ids => {
        const store = await import('/src/lib/storage.ts'), course = (await store.listCourses()).courses.find(course => course.id === ids.courseId);
        await store.saveCourse({ ...course, title: 'Synthetic changed course before partial failure' });
      }, ids);
      // Reload to bring the App's course inventory in line with persisted state.
      await openSettings();
      await verifyFile(backupPath);
      await page.evaluate(id => { window.__familyRecoveryFault = { key: 'erudior.records-' + id }; }, ids.alice);
      await confirmRestore();
      await visibleAlert(/some.*changed|partial|did not finish/i).waitFor();
      assert.equal(await heading('Backup verified').count(), 0, 'Failed restore clears the single-use decrypted review');
      assert.equal(await button('Restore this verified backup').count(), 0, 'No implicit retry after partial mutation');
      const partial = await readRecovered(ids);
      assert.equal(partial.course.title, 'AAA Synthetic recovered science', 'A real course write completed before the injected disk failure');
      assert(partial.records.manual.some(record => record.id === 'synthetic-record-before-partial-restore'), 'The failed record write did not pretend to complete');
      await audit(prefix + '-honest-partial-recovery', visibleAlert(/some.*changed|partial|did not finish/i));
      await button('Reload saved Family').click();
      await heading('Parent area').or(heading("Who's learning?")).waitFor();
      await openSettings();
      assert((await readRecovered(ids)).records.manual.some(record => record.id === 'synthetic-record-before-partial-restore'), 'Reload alone does not retry restoration');
      await verifyFile(backupPath);
      const finalReload = page.waitForEvent('load'); await confirmRestore(); await finalReload;
      await openSettings();
      assert.deepEqual((await readRecovered(ids)).records.manual.map(record => record.id), ['synthetic-original'], 'Explicit new verification and confirmation recovers after honest partial failure');
      checks.push({ workflow: 'actual IndexedDB failure after earlier course writes; partial result exposed honestly; no fake success/no automatic retry; reload original gate; explicit reverify and successful production recovery' });
    }
    await context.close(); page = undefined;
  }
  assert.deepEqual(errors, [], 'No browser runtime errors');
  assert.deepEqual(externalRequests, [], 'No external transfers attempted by local recovery');
  await writeFile(path.join(out, 'result.json'), JSON.stringify({ passed: true, data: 'synthetic isolated local Families only', component: 'Actual App and production FamilyBackupRecovery', cryptography: 'real PBKDF2/AES-GCM exports, verifier and restorer', externalNetwork: 'blocked', checks, screenshots, errors }, null, 2));
  console.log('Family recovery real-App browser acceptance passed.');
} catch (error) {
  const diagnostic = page ? await page.evaluate(() => ({ url: location.href, headings: [...document.querySelectorAll('h1,h2,h3')].map(node => node.textContent), notices: [...document.querySelectorAll('[role=alert],[role=status]')].map(node => node.textContent) })).catch(() => null) : null;
  await writeFile(path.join(out, 'failure.json'), JSON.stringify({ passed: false, current, error: String(error), checks, screenshots, errors, externalRequests, diagnostic }, null, 2));
  if (page) {
    // Frame the failed recovery state if it exists; otherwise keep the actual
    // viewport. Never expand the screenshot outside production scroll bounds.
    try {
      const target = await verified().isVisible() ? verified() : page.getByRole('region', { name: 'Encrypted Family backup recovery', exact: true });
      if (await target.isVisible()) await captureReviewViewports('failure', target);
      else await page.screenshot({ path: path.join(out, 'failure.png'), fullPage: false });
    } catch { await page.screenshot({ path: path.join(out, 'failure.png'), fullPage: false }).catch(() => {}); }
  }
  throw error;
} finally {
  await browser?.close(); await server?.close();
}

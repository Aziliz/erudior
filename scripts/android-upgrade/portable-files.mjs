// Real Android DocumentsUI round trip on the existing disposable emulator.
// No private data, arbitrary URI bridge, additional grants, or ADB app-state writes.
import assert from 'node:assert/strict';

export async function verifyPortableFiles({ page, adb, nodes, tapNative, until, screenshot, passed }) {
  const fixture = await page.evaluate(() => window.__erudiorUpgradeE2E.portableFixture());
  const { content } = fixture;
  const importedIds = new Set();
  async function start(kind, name) {
    await page.evaluate(({ kind, content, name }) => {
      window.__portableResult = { pending: true };
      const fixture = window.__erudiorUpgradeE2E;
      (kind === 'export' ? fixture.exportPortable(content, name) : fixture.pickPortable()).then(
        value => { window.__portableResult = { value }; },
        error => { window.__portableResult = { error: String(error) }; });
    }, { kind, content, name });
  }
  async function result() {
    await until(() => page.evaluate(() => !window.__portableResult.pending), 'Native file operation did not settle');
    const value = await page.evaluate(() => window.__portableResult);
    assert.equal(value.error, undefined, `Native transfer error: ${value.error}`);
    return value.value;
  }
  async function downloads() {
    await tapNative(n => /Show roots|Open navigation drawer/i.test(n['content-desc'] ?? ''), 'Document locations');
    await tapNative(n => n.text === 'Downloads' && /title/.test(n['resource-id'] ?? ''), 'Downloads location');
  }
  // Cancellation and immediate retry must release the single-operation guard.
  await start('import');
  await until(() => nodes().some(n => /documentsui/.test(n.package ?? '')), 'Open document picker');
  adb('shell', 'input', 'keyevent', 'KEYCODE_BACK');
  assert.equal(await result(), null);
  await start('export', 'erudior-offline-proof.json');
  await until(() => nodes().some(n => /documentsui/.test(n.package ?? '')), 'Create document picker');
  adb('shell', 'input', 'keyevent', 'KEYCODE_BACK');
  assert.equal(await result(), false);
  // Provider length metadata is not trusted: actual bounded read must reject.
  adb('shell', 'mkdir', '-p', '/sdcard/Download');
  adb('shell', 'dd if=/dev/zero of=/sdcard/Download/erudior-too-large.json bs=1048576 count=25');
  adb('shell', "printf '\\377' > /sdcard/Download/erudior-invalid-utf8.json");
  adb('shell', 'touch', '/sdcard/Download/erudior-empty.json');
  for (const [filename, expected] of [
    ['erudior-too-large.json', /24 MiB/],
    ['erudior-invalid-utf8.json', /UTF-8/],
    ['erudior-empty.json', /empty/],
  ]) {
    await start('import');
    await downloads();
    await tapNative(n => n.text === filename, 'Invalid course fixture');
    await until(() => page.evaluate(() => !window.__portableResult.pending), 'Invalid course rejection');
    const rejected = await page.evaluate(() => window.__portableResult);
    assert.match(rejected.error ?? '', expected);
    assert.equal(rejected.value, undefined);
  }
  for (const filename of ['erudior-offline-proof.json', 'erudior-offline-proof-repeat.json']) {
    await start('export', filename);
    await downloads();
    screenshot('portable-save-picker');
    await tapNative(n => /^(save)$/i.test(n.text ?? '') && /button/.test(n['resource-id'] ?? ''), 'Save course document');
    assert.equal(await result(), true);
    await start('import');
    await downloads();
    await tapNative(n => n.text === filename, 'Saved course document');
    const returned = await result();
    assert.equal(returned, content, 'UTF-8 JSON and embedded asset bytes survive SAF export/import');
    const parsed = await page.evaluate(text => window.__erudiorUpgradeE2E.parsePortable(text), returned);
    assert.notEqual(parsed.id, fixture.sourceId, 'Private imports do not overwrite the original course');
    assert.ok(!importedIds.has(parsed.id), 'Repeated imports are isolated local copies');
    importedIds.add(parsed.id);
    assert.deepEqual(parsed.lessons[0], fixture.lesson, 'Authored lesson IDs/body and inline image survive');
    assert.ok(parsed.lessons[0].body.includes(fixture.image));
    assert.equal(parsed.official, undefined);
    assert.equal(parsed.signature, undefined);
    assert.equal(parsed.community, undefined);
    const dimensions = await page.evaluate(async source => {
      const image = new Image(); image.src = source; await image.decode();
      return [image.naturalWidth, image.naturalHeight];
    }, fixture.image);
    assert.deepEqual(dimensions, [1, 1], 'Embedded media actually decodes in the Android WebView without a URL fetch');
  }
  passed('Android SAF portable course model export/import, isolated IDs, UTF-8 and inline asset round trip, cancel/repeat, oversized/empty/invalid UTF-8 rejection');
}

// Real Android DocumentsUI round trip on the existing disposable emulator.
// No private data, arbitrary URI bridge, additional grants, or ADB app-state writes.
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { bounded, disconnected, readOperation } from './harness.mjs';

export async function verifyPortableFiles({ getPage, reattach, adb, nodes, tapNative, until, screenshot, passed }) {
  const fixture = await bounded(() => getPage().evaluate(() => window.__erudiorUpgradeE2E.portableFixture()), 20000, 'Read portable fixture');
  const { content } = fixture;
  const importedIds = new Set();
  let token;
  async function start(kind, name) {
    token = randomUUID();
    try {
      await bounded(() => getPage().evaluate(({ kind, content, name, token }) => {
        window.__portableResult = { token, pending: true };
        const fixture = window.__erudiorUpgradeE2E;
        (kind === 'export' ? fixture.exportPortable(content, name) : fixture.pickPortable()).then(
          value => { window.__portableResult = { token, pending: false, value }; },
          error => { window.__portableResult = { token, pending: false, error: String(error) }; });
      }, { kind, content, name, token }), 20000, 'Start native operation');
    } catch (error) {
      // Never repeat the mutation after an ambiguous transport failure.
      if (!disconnected(error)) throw error;
      // The picker may own the foreground and hide the CDP target. Finish only
      // the expected native picker interaction, then settled() reconnects and
      // requires this exact token. A missing operation fails rather than retries.
    }
  }
  async function settled() { return readOperation({ getPage, reattach, token }); }
  async function result() {
    const value = await settled();
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
  // Create each fixture through SAF so Downloads has a provider entry. Raw ADB
  // writes alone can leave DocumentsUI empty until a later indexing pass.
  // Then overwrite only these disposable files; bounded reads must inspect the
  // actual contents even if the provider still reports the original length.
  for (const [filename, expected] of [
    ['erudior-too-large.json', /24 MiB/],
    ['erudior-invalid-utf8.json', /UTF-8/],
    ['erudior-empty.json', /empty/],
  ]) {
    await start('export', filename);
    await downloads();
    await tapNative(n => /^(save)$/i.test(n.text ?? '') && /button/.test(n['resource-id'] ?? ''), 'Save rejection fixture');
    assert.equal(await result(), true, `Create provider-backed fixture: ${filename}`);
    const file = `/sdcard/Download/${filename}`;
    adb('shell', 'test', '-f', file);
    if (filename === 'erudior-too-large.json') {
      adb('shell', 'dd', 'if=/dev/zero', `of=${file}`, 'bs=1048576', 'count=25');
    } else if (filename === 'erudior-invalid-utf8.json') {
      adb('shell', `printf '\\377' > ${file}`);
    } else {
      adb('shell', `: > ${file}`);
    }
    await start('import');
    await downloads();
    await tapNative(n => n.text === filename, `Invalid course fixture: ${filename}`);
    const rejected = await settled();
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
    const parsed = await bounded(() => getPage().evaluate(text => window.__erudiorUpgradeE2E.parsePortable(text), returned), 20000, 'Parse portable course');
    assert.notEqual(parsed.id, fixture.sourceId, 'Private imports do not overwrite the original course');
    assert.ok(!importedIds.has(parsed.id), 'Repeated imports are isolated local copies');
    importedIds.add(parsed.id);
    assert.deepEqual(parsed.lessons[0], fixture.lesson, 'Authored lesson IDs/body and inline image survive');
    assert.ok(parsed.lessons[0].body.includes(fixture.image));
    assert.equal(parsed.official, undefined);
    assert.equal(parsed.signature, undefined);
    assert.equal(parsed.community, undefined);
    const dimensions = await bounded(() => getPage().evaluate(async source => {
      const image = new Image(); image.src = source; await image.decode();
      return [image.naturalWidth, image.naturalHeight];
    }, fixture.image), 20000, 'Decode portable image');
    assert.deepEqual(dimensions, [1, 1], 'Embedded media actually decodes in the Android WebView without a URL fetch');
  }
  passed('Android SAF portable course model export/import, isolated IDs, UTF-8 and inline asset round trip, cancel/repeat, oversized/empty/invalid UTF-8 rejection');
}

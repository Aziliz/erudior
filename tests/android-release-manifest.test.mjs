// Execute the publisher's real manifest-writing expression, not a duplicate implementation.
import assert from 'node:assert/strict';
import test from 'node:test';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

test('release workflow writes parseable JSON bound to the signed APK bytes', () => {
  const workflow = readFileSync('.github/workflows/android.yml', 'utf8');
  const commands = [...workflow.matchAll(/^\s+node -e '([^'\n]+)'\s*$/gm)]
    .map(match => match[1]).filter(js => js.includes('fs.writeFileSync("android-update.json"'));
  assert.equal(commands.length, 1, 'Exactly one production manifest writer must be exercised');
  const dir = mkdtempSync(path.join(tmpdir(), 'erudior-manifest-test-'));
  try {
    const apk = Buffer.from('PK\x03\x04disposable-signed-APK-fixture');
    const build = 'a'.repeat(40);
    writeFileSync(path.join(dir, 'package.json'), JSON.stringify({version:'0.25.1'}));
    writeFileSync(path.join(dir, 'Erudior-Android-arm64.apk'), apk);
    execFileSync(process.execPath, ['-e',commands[0]], {cwd:dir,env:{...process.env,GITHUB_SHA:build}});
    const bytes = readFileSync(path.join(dir, 'android-update.json'));
    const manifest = JSON.parse(bytes.toString('utf8'));
    assert.equal(bytes.at(-1), 10, 'Trailing terminator is a newline byte, not literal backslash-n');
    assert.equal(manifest.schema, 1);
    assert.equal(manifest.version, '0.25.1');
    assert.equal(manifest.build, build);
    assert.equal(manifest.bytes, apk.length);
    assert.equal(manifest.sha256, createHash('sha256').update(apk).digest('hex'));
    assert.equal(manifest.apk, 'https://github.com/Aziliz/erudior/releases/download/android-preview/Erudior-Android-arm64.apk');
  } finally { rmSync(dir,{recursive:true,force:true}); }
});

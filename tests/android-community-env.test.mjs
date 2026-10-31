import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { ANDROID_COMMUNITY_ORIGIN as origin, validateAndroidCommunityEnvironment,
  compiledOriginLiterals, verifyCompiledCommunityOrigin } from '../scripts/check-android-community-env.mjs';

const csp = `default-src 'self'; connect-src 'self' ${origin}; img-src 'self' data:`;

test('accepts only the approved public Community origin with explicit native CSP permission', () => {
  for (const value of [origin, origin + '/', ' ' + origin + ' ', ' ' + origin + '/ ']) {
    assert.equal(validateAndroidCommunityEnvironment(value, csp), origin);
  }
});

test('rejects absent, insecure, relative, credential-bearing and wrong API origins', () => {
  for (const value of [undefined, null, 7, 42, '', ' ', '/api', 'http://api.erudior.com',
    'https://localhost', 'https://other.example',
    'https://api.erudior.com.evil.test', 'https://u:p@api.erudior.com',
    origin + '/catalog', origin + '?x=1', origin + '#fragment']) {
    assert.throws(() => validateAndroidCommunityEnvironment(value, csp));
  }
});

test('requires connect-src rather than accepting broad or unrelated CSP directives', () => {
  for (const value of [undefined, {}, '', "default-src *", `default-src ${origin}`, `img-src ${origin}`,
    "connect-src *", "connect-src 'self'", 'connect-src https://api.erudior.com.evil.example']) {
    assert.throws(() => validateAndroidCommunityEnvironment(origin, value));
  }
});

test('parses quoted, static-template and escaped values without evaluating generated code', () => {
  const cases = [
    [`const api="${origin}";`, 'string'],
    [`const api='${origin}';`, 'string'],
    ['const api=`' + origin + '`;', 'static-template'],
    [String.raw`const api="https:\/\/api.erudior.com";`, 'string'],
    [String.raw`const api="https://api.erudior.\u0063om";`, 'string'],
  ];
  for (const [source, kind] of cases) assert.deepEqual(compiledOriginLiterals(source, 'compiled.js', origin), [kind]);
  assert.deepEqual(compiledOriginLiterals(`throw Error('MUST NOT EXECUTE'); const api="${origin}";`, 'compiled.js', origin), ['string']);
});

test('rejects comments, regexp text, larger URLs and dynamic or tagged templates', () => {
  for (const source of [
    `// "${origin}"\nexport const api='';`,
    `/* '${origin}' */ export const api='';`,
    String.raw`const pattern=/"https:\/\/api.erudior.com"/;`,
    `const note='API ${origin}';`, `const api='${origin}.evil.test';`,
    'const api=`' + origin + '${suffix}`;', 'const api=tag`' + origin + '`;',
  ]) assert.deepEqual(compiledOriginLiterals(source, 'compiled.js', origin), []);
  assert.throws(() => compiledOriginLiterals('const api="unterminated;', 'broken.js', origin), /Invalid compiled JavaScript/);
  assert.throws(() => compiledOriginLiterals('', 'compiled.js', 'https://wrong.test'), /Unapproved/);
});

test('compiled check fails closed for absent assets and records minifier-independent evidence', async () => {
  const dist = await mkdtemp(path.join(os.tmpdir(), 'erudior-community-'));
  try {
    await assert.rejects(verifyCompiledCommunityOrigin(dist, origin));
    await mkdir(path.join(dist, 'assets'));
    await assert.rejects(verifyCompiledCommunityOrigin(dist, origin), /No compiled/);
    await writeFile(path.join(dist, 'assets/notes.txt'), origin);
    await writeFile(path.join(dist, 'assets/app.js'), `// "${origin}"\nexport const api='';`);
    await assert.rejects(verifyCompiledCommunityOrigin(dist, origin), /missing/);
    await writeFile(path.join(dist, 'assets/community.js'), 'export const api=`' + origin + '`;');
    const result = await verifyCompiledCommunityOrigin(dist, origin);
    assert.deepEqual(result.assets, ['community.js']);
    assert.deepEqual(result.evidence, [{ asset: 'community.js', literalKinds: ['static-template'], legacyQuotedMatch: false }]);
    assert.match(result.scope, /not device\/network acceptance/);
    await writeFile(path.join(dist, 'assets/community.js'), `const api=${JSON.stringify(origin)};`);
    const quoted = await verifyCompiledCommunityOrigin(dist, origin);
    assert.deepEqual(quoted.assets, ['community.js']);
    assert.equal(quoted.evidence[0].legacyQuotedMatch, true);
    await assert.rejects(verifyCompiledCommunityOrigin(dist, 'https://wrong.test'), /Unapproved/);
  } finally { await rm(dist, { recursive: true, force: true }); }
});

test('release compiles the real frontend on PRs and verifies again before signing', async () => {
  const workflow = await readFile(new URL('../.github/workflows/android-preview-publish.yml', import.meta.url), 'utf8');
  const contract = workflow.split('  release-contract:')[1].split('  upgrade-acceptance:')[0];
  assert.match(contract, /run: npm ci/);
  assert.match(contract, /VITE_COMMUNITY_API: https:\/\/api\.erudior\.com/);
  assert.match(contract, /VITE_COURSES_URL: https:\/\/courses\.erudior\.com\/v1\//);
  assert.match(contract, /npm run build/);
  assert.match(contract, /node scripts\/check-android-community-env\.mjs --dist dist/);
  const signed = workflow.split('  signed-arm64:')[1].split('  publish-preview:')[0];
  assert.match(signed, /VITE_COMMUNITY_API: https:\/\/api\.erudior\.com/);
  const preflight = signed.indexOf('node scripts/check-android-community-env.mjs\n');
  const build = signed.indexOf('npm run tauri android build -- --apk --ci --target aarch64');
  const compiled = signed.indexOf('node scripts/check-android-community-env.mjs --dist dist');
  const sign = signed.indexOf('name: Sign with persistent release identity');
  assert.ok(preflight >= 0 && preflight < build && build < compiled && compiled < sign);
  assert.match(workflow, /node --test tests\/android-community-env\.test\.mjs/);
  assert.match(workflow, /'scripts\/check-android-community-env\.mjs'/);
  assert.match(workflow, /'tests\/android-community-env\.test\.mjs'/);
});

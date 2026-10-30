import assert from 'node:assert/strict';
import test from 'node:test';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { ANDROID_COMMUNITY_ORIGIN, validateAndroidCommunityEnvironment, verifyCompiledCommunityOrigin } from '../scripts/check-android-community-env.mjs';

const csp = "default-src 'self'; connect-src 'self' https://api.erudior.com";

test('accepts only the approved public Community origin with explicit native CSP permission', () => {
  assert.equal(validateAndroidCommunityEnvironment(' https://api.erudior.com/ ', csp), ANDROID_COMMUNITY_ORIGIN);
  assert.equal(validateAndroidCommunityEnvironment(ANDROID_COMMUNITY_ORIGIN, csp), ANDROID_COMMUNITY_ORIGIN);
});

test('rejects absent, insecure, relative, credential-bearing and wrong API origins', () => {
  for (const value of [undefined, null, 42, '', ' ', '/api', 'http://api.erudior.com',
    'https://localhost', 'https://other.example', 'https://api.erudior.com.evil.example',
    'https://user:password@api.erudior.com', 'https://api.erudior.com/catalog',
    'https://api.erudior.com?token=x', 'https://api.erudior.com#token']) {
    assert.throws(() => validateAndroidCommunityEnvironment(value, csp), String(value));
  }
});

test('requires connect-src rather than accepting broad or unrelated CSP directives', () => {
  for (const policy of [undefined, {}, '', "default-src *", "connect-src *",
    'img-src https://api.erudior.com', 'connect-src https://api.erudior.com.evil.example']) {
    assert.throws(() => validateAndroidCommunityEnvironment(ANDROID_COMMUNITY_ORIGIN, policy));
  }
});

test('compiled check fails for missing assets and for an endpoint present only in unrelated text', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'erudior-android-env-'));
  try {
    await assert.rejects(verifyCompiledCommunityOrigin(dir, ANDROID_COMMUNITY_ORIGIN));
    await mkdir(path.join(dir, 'assets'));
    await assert.rejects(verifyCompiledCommunityOrigin(dir, ANDROID_COMMUNITY_ORIGIN), /No compiled/);
    await writeFile(path.join(dir, 'assets', 'notes.txt'), JSON.stringify(ANDROID_COMMUNITY_ORIGIN));
    await writeFile(path.join(dir, 'assets', 'app.js'), 'const api="";const unrelated="https://other.example";');
    await assert.rejects(verifyCompiledCommunityOrigin(dir, ANDROID_COMMUNITY_ORIGIN), /missing from/);
    await writeFile(path.join(dir, 'assets', 'community.js'), `const api=${JSON.stringify(ANDROID_COMMUNITY_ORIGIN)};`);
    const result = await verifyCompiledCommunityOrigin(dir, ANDROID_COMMUNITY_ORIGIN);
    assert.deepEqual(result.assets, ['community.js']);
    assert.match(result.scope, /not device\/network acceptance/);
    await assert.rejects(verifyCompiledCommunityOrigin(dir, 'https://other.example'), /Unapproved/);
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test('release job sets Community before compilation and verifies compiled assets before signing', async () => {
  const workflow = await readFile(new URL('../.github/workflows/android-preview-publish.yml', import.meta.url), 'utf8');
  const job = workflow.split('\n  signed-arm64:\n')[1]?.split('\n  publish-preview:\n')[0];
  assert.ok(job, 'signed ARM64 job exists');
  assert.match(job, /VITE_COMMUNITY_API: https:\/\/api\.erudior\.com/);
  const preflight = job.indexOf('node scripts/check-android-community-env.mjs\n');
  const build = job.indexOf('npm run tauri android build -- --apk --ci --target aarch64');
  const compiled = job.indexOf('node scripts/check-android-community-env.mjs --dist dist');
  const sign = job.indexOf('Sign with persistent release identity');
  assert.ok(preflight >= 0 && preflight < build && build < compiled && compiled < sign);
  assert.match(workflow, /node --test tests\/android-community-env\.test\.mjs/);
  assert.match(workflow, /'scripts\/check-android-community-env\.mjs'/);
  assert.match(workflow, /'tests\/android-community-env\.test\.mjs'/);
});

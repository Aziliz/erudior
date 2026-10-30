// Actual isolated D1/R2 with deterministic interleavings at the commit boundary.
// No Cloudflare account, remote binding, repository secrets, or production mutation.
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { Miniflare } from 'miniflare';
import worker, { type Env } from '../src/index.ts';
import { emptyDoc } from '../../src/lib/communityFormat.ts';

const mf = new Miniflare({ modules: true, script: 'export default { fetch() { return new Response("isolated"); } }',
  compatibilityDate: '2025-02-01', host: '127.0.0.1', d1Databases: ['DB'], r2Buckets: ['FILES'] });
const app = 'https://app.example', api = 'https://api.example';
const token = 'synthetic-draft-race-session';
const tokenHash = Buffer.from(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token))).toString('hex');
const timestamp = () => new Date().toISOString();
const doc = { ...emptyDoc(), title: 'Before' };
const nextDoc = { ...doc, title: 'After' };
const png = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 0]);
let assertions = 0;
try {
  const db = await mf.getD1Database('DB');
  const files = await mf.getR2Bucket('FILES');
  for (const name of (await readdir(new URL('../migrations/', import.meta.url))).filter(n => n.endsWith('.sql')).sort()) {
    const sql = (await readFile(new URL('../migrations/' + name, import.meta.url), 'utf8')).replace(/--[^\n]*/g, '');
    for (const statement of sql.split(';').filter(s => s.trim())) await db.prepare(statement).run();
  }
  let hook: ((sql: string) => Promise<void>) | undefined;
  let putHook: (() => Promise<void>) | undefined;
  let afterRun: ((sql: string) => Promise<void>) | undefined;
  let failCleanup = false;
  let uploadedKey = '';
  const wrappedDB = { prepare(sql: string) {
    let statement = db.prepare(sql);
    const wrapped = {
      bind(...values: any[]) { statement = statement.bind(...values); return wrapped; },
      first: (...args: any[]) => (statement.first as any)(...args),
      all: (...args: any[]) => (statement.all as any)(...args),
      raw: (...args: any[]) => (statement.raw as any)(...args),
      async run() { if (hook) await hook(sql); const result = await statement.run(); if (afterRun) await afterRun(sql); return result; },
    };
    return wrapped;
  } };
  const wrappedFiles = {
    async put(key: string, value: any, options: any) {
      uploadedKey = key;
      // Miniflare's proxy cannot serialize Node's native Headers; preserve the R2 condition as its object equivalent.
      if (options?.onlyIf instanceof Headers) {
        assert.equal(options.onlyIf.get('If-None-Match'), '*');
        options = { ...options, onlyIf: { etagDoesNotMatch: '*' } };
      }
      const result = await files.put(key, value, options);
      if (putHook) { const action = putHook; putHook = undefined; await action(); }
      return result;
    },
    get: (key: string) => files.get(key),
    async delete(key: string) { if (failCleanup) throw Error('Injected orphan cleanup failure'); await files.delete(key); },
  };
  const env = { DB: wrappedDB, FILES: wrappedFiles, APP_ORIGIN: app, API_ORIGIN: api, ALLOWED_ORIGINS: '' } as unknown as Env;
  const call = (method: string, path: string, body?: any, signedIn = true) => worker.fetch(new Request(api + path, {
    method, headers: { Origin: app, ...(signedIn ? { Cookie: `erudior_session=${token}` } : {}), ...(body && !(body instanceof Uint8Array) ? { 'Content-Type': 'application/json' } : {}) },
    ...(body === undefined ? {} : { body: body instanceof Uint8Array ? body : JSON.stringify(body) }),
  }), env);
  const run = async (sql: string, ...values: any[]) => db.prepare(sql).bind(...values).run();
  const count = async (table: 'courses' | 'images') => (await db.prepare(`SELECT COUNT(*) AS n FROM ${table}`).first<{ n: number }>())!.n;
  async function reset(role: 'owner' | 'editor' | 'admin' = 'owner') {
    hook = undefined; putHook = undefined; afterRun = undefined; failCleanup = false; uploadedKey = '';
    for (const table of ['course_editors', 'sessions', 'reports', 'courses', 'images', 'users']) await db.prepare(`DELETE FROM ${table}`).run();
    for (const id of ['actor', 'other']) await run('INSERT INTO users (id, provider, provider_id, display_name, role, accepted_at, terms_version, created_at, last_seen_at) VALUES (?, ?, ?, ?, ?, ?, 2, ?, ?)', id, 'dev', id, id, role === 'admin' && id === 'actor' ? 'admin' : 'author', timestamp(), timestamp(), timestamp());
    await run('INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)', tokenHash, 'actor', new Date(Date.now() + 3600000).toISOString());
    await run('INSERT INTO courses (id, owner_id, draft, title, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)', 'course', role === 'owner' ? 'actor' : 'other', JSON.stringify(doc), doc.title, timestamp(), timestamp());
    if (role === 'editor') await run('INSERT INTO course_editors (course_id, user_id, added_by, created_at) VALUES (?, ?, ?, ?)', 'course', 'actor', 'other', timestamp());
  }
  function beforeCommit(pattern: RegExp, change: () => Promise<unknown>) {
    hook = async sql => { if (pattern.test(sql)) { hook = undefined; await change(); } };
  }
  async function denied(response: Response, label: string) {
    assert.ok([401, 403, 404, 409, 429].includes(response.status), `${label}: expected guarded rejection, got ${response.status}: ${await response.text()}`);
    assertions++;
  }
  const actorRaces: [string, () => Promise<unknown>][] = [
    ['revoked session', () => run('DELETE FROM sessions')],
    ['expired session', () => run("UPDATE sessions SET expires_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now', '-1 second')")],
    ['banned actor', () => run("UPDATE users SET banned = 1 WHERE id = 'actor'")],
    ['cleared acceptance', () => run("UPDATE users SET accepted_at = NULL WHERE id = 'actor'")],
    ['empty acceptance', () => run("UPDATE users SET accepted_at = '' WHERE id = 'actor'")],
    ['outdated terms', () => run("UPDATE users SET terms_version = 1 WHERE id = 'actor'")],
  ];
  for (const [label, change] of actorRaces) {
    console.log('Actor race:', label);
    await reset(); beforeCommit(/INSERT INTO courses/i, change);
    await denied(await call('POST', '/drafts'), 'create: ' + label); assert.equal(await count('courses'), 1);
    await reset(); beforeCommit(/UPDATE courses SET draft/i, change);
    await denied(await call('PUT', '/drafts/course', nextDoc), 'save: ' + label);
    assert.equal((await db.prepare("SELECT draft FROM courses WHERE id = 'course'").first<any>()).draft, JSON.stringify(doc));
    await reset(); putHook = async () => { await change(); };
    await denied(await call('POST', '/images', png), 'image: ' + label); assert.equal(await count('images'), 0);
    assert.equal((await call('GET', '/' + uploadedKey, undefined, false)).status, 404);
    assert.equal(await files.get(uploadedKey), null, 'definite rejected upload cleans up its R2 object');
  }
  const saveRaces: [string, 'owner' | 'editor' | 'admin', () => Promise<unknown>][] = [
    ['ownership transfer', 'owner', () => run("UPDATE courses SET owner_id = 'other' WHERE id = 'course'")],
    ['editor revoked', 'editor', () => run('DELETE FROM course_editors')],
    ['admin demoted', 'admin', () => run("UPDATE users SET role = 'author' WHERE id = 'actor'")],
    ['removed by moderation', 'owner', () => run("UPDATE courses SET status = 'removed' WHERE id = 'course'")],
    ['deleted course', 'owner', () => run("DELETE FROM courses WHERE id = 'course'")],
    ['published version changed', 'owner', () => run("UPDATE courses SET version = 1 WHERE id = 'course'")],
    ['competing draft', 'owner', () => run("UPDATE courses SET draft = ? WHERE id = 'course'", JSON.stringify({ ...doc, title: 'Other save' }))],
  ];
  for (const [label, role, change] of saveRaces) {
    console.log('Course race:', label);
    await reset(role); beforeCommit(/UPDATE courses SET draft/i, change);
    await denied(await call('PUT', '/drafts/course', nextDoc), label);
    const row = await db.prepare("SELECT draft FROM courses WHERE id = 'course'").first<any>();
    assert.notEqual(row?.draft, JSON.stringify(nextDoc), label + ' must not save');
  }
  for (const role of ['owner', 'editor', 'admin'] as const) {
    await reset(role); assert.equal((await call('PUT', '/drafts/course', nextDoc)).status, 200, role + ' positive save'); assertions++;
  }
  // Expiry is fixed before preflight; only elapsed DB queue time changes authorization.
  await reset();
  await run('UPDATE sessions SET expires_at = ?', new Date(Date.now() + 3000).toISOString());
  let reachedCommit = false;
  beforeCommit(/INSERT INTO courses/i, async () => {
    reachedCommit = true;
    await new Promise(resolve => setTimeout(resolve, 3200));
  });
  const queuedExpiry = await call('POST', '/drafts');
  assert.equal(reachedCommit, true, 'expiry test must pass preflight and reach the commit queue');
  assert.equal(queuedExpiry.status, 409, 'expiry must be rejected at commit, not merely at preflight');
  await denied(queuedExpiry, 'session expires while commit is queued');
  assert.equal(await count('courses'), 1);
  await reset(); await run("UPDATE users SET accepted_at = NULL, terms_version = 0 WHERE id = 'actor'");
  assert.equal((await call('POST', '/drafts')).status, 403, 'no adult/current-terms attestation cannot create');
  assert.equal((await call('POST', '/images', png)).status, 403, 'no attestation cannot upload');
  // Both callers complete their preflight counts before either commit; SQL quota is authoritative.
  function simultaneous(pattern: RegExp) {
    let arrivals = 0; let release!: () => void;
    const barrier = new Promise<void>(resolve => { release = resolve; });
    hook = async sql => { if (pattern.test(sql)) { if (++arrivals === 2) { hook = undefined; release(); } let timer: ReturnType<typeof setTimeout> | undefined; try { await Promise.race([barrier, new Promise<never>((_, reject) => { timer = setTimeout(() => reject(Error('Concurrent commit barrier timed out')), 15000); })]); } finally { clearTimeout(timer); } } };
  }
  await reset();
  for (let i = 0; i < 48; i++) await run('INSERT INTO courses (id, owner_id, draft, title, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)', `existing-${i}`, 'actor', '{}', 'quota', timestamp(), timestamp());
  simultaneous(/INSERT INTO courses/i);
  const creates = await Promise.all([call('POST', '/drafts'), call('POST', '/drafts')]);
  assert.equal(creates.filter(r => r.status === 201).length, 1); assert.equal(await count('courses'), 50); await denied(creates.find(r => r.status !== 201)!, 'course quota race');
  await reset();
  await db.batch(Array.from({ length: 499 }, (_, i) => db.prepare('INSERT INTO images (id, owner_id, mime, bytes, created_at) VALUES (?, ?, ?, ?, ?)').bind(`existing-${i}`, 'actor', 'image/png', 12, timestamp())));
  simultaneous(/INSERT INTO images/i);
  const uploads = await Promise.all([call('POST', '/images', png), call('POST', '/images', png)]);
  assert.equal(uploads.filter(r => r.status === 201).length, 1); assert.equal(await count('images'), 500); await denied(uploads.find(r => r.status !== 201)!, 'image quota race');
  // Concurrent same-snapshot saves may not both overwrite one another.
  await reset(); simultaneous(/UPDATE courses SET draft/i);
  const saves = await Promise.all([call('PUT', '/drafts/course', nextDoc), call('PUT', '/drafts/course', { ...nextDoc, title: 'Second' })]);
  assert.equal(saves.filter(r => r.status === 200).length, 1); await denied(saves.find(r => r.status !== 200)!, 'concurrent draft save');
  // A failed R2 cleanup must never make uncommitted uploads publicly readable.
  await reset(); failCleanup = true; putHook = async () => { await run('DELETE FROM sessions'); };
  await denied(await call('POST', '/images', png), 'cleanup failure');
  assert.ok(await files.get(uploadedKey), 'injected cleanup failure leaves a real R2 orphan');
  assert.equal((await call('GET', '/' + uploadedKey, undefined, false)).status, 404);
  // A failed D1 acknowledgement is ambiguous: never delete a potentially committed image.
  await reset();
  beforeCommit(/INSERT INTO images/i, async () => { throw Error('Injected D1 unavailable before commit'); });
  assert.equal((await call('POST', '/images', png)).status, 500);
  assert.equal(await count('images'), 0);
  assert.ok(await files.get(uploadedKey), 'uncertain write is not destructively cleaned up');
  assert.equal((await call('GET', '/' + uploadedKey, undefined, false)).status, 404, 'uncommitted orphan is private');
  await reset();
  afterRun = async sql => { if (/INSERT INTO images/i.test(sql)) { afterRun = undefined; throw Error('Injected lost D1 acknowledgement after commit'); } };
  assert.equal((await call('POST', '/images', png)).status, 500);
  assert.equal(await count('images'), 1);
  assert.ok(await files.get(uploadedKey), 'committed image survives lost acknowledgement');
  assert.equal((await call('GET', '/' + uploadedKey, undefined, false)).status, 200);
  // Public reads remain account/age independent, but only committed images are available.
  await reset();
  const upload = await call('POST', '/images', png); assert.equal(upload.status, 201);
  const image = await upload.json() as { url: string };
  assert.equal((await call('GET', new URL(image.url).pathname, undefined, false)).status, 200);
  await run("UPDATE courses SET status = 'published', version = 1 WHERE id = 'course'");
  await files.put('courses/course.v1.json', JSON.stringify(doc));
  assert.equal((await call('GET', '/catalog', undefined, false)).status, 200);
  assert.equal((await call('GET', '/courses/course', undefined, false)).status, 200);
  assert.equal((await call('POST', '/drafts', undefined, false)).status, 401);
  console.log(`Isolated actual D1/R2 draft authorization passed: ${assertions} guarded cases plus public reads, concurrent quotas, snapshot conflicts and orphan safety.`);
} finally { await mf.dispose(); }

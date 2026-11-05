import assert from 'node:assert/strict';
import { createHash, randomBytes } from 'node:crypto';
import { test } from 'node:test';
import { accountFixture, accountFixtureIds as ids } from './fixtures.mts';
import { createPostgresHarness } from './postgres-harness.mts';
import { PostgresAccountStore, type RecordExportRequest, type StoreProviderPolicy } from '../src/store.ts';
const hash = (s: string) => createHash('sha256').update(s).digest('hex');
const credential = () => ({ tokenHash: hash(randomBytes(32).toString('hex')), csrfHash: hash(randomBytes(32).toString('hex')) });
const now = () => Math.floor(Date.now() / 1000);
await test('durable explicit private record exports on real PostgreSQL', async t => {
  const h = await createPostgresHarness();
  const provider: StoreProviderPolicy = { id: 'personal', version: 1, configurationHash: hash('export-provider'), issuer: 'https://personal.example', trust: 'personal', schoolId: null };
  const options = { providers: () => [provider], exports: { artifactTtlSeconds: 120 } };
  const store = new PostgresAccountStore(h.runtime, options);
  const reset = async () => {
    await h.admin.query('TRUNCATE erudior_private.record_exports, erudior_private.record_payloads, erudior_private.device_sessions, erudior_private.authority_graph');
    const graph = accountFixture(now()); graph.sessions = [];
    return h.seed(graph, Object.fromEntries(graph.records.map(r => [r.id, { synthetic: true, record: r.id, unicode: 'é漢字' }])));
  };
  const signIn = async () => {
    const secret = credential();
    assert.ok(await store.establishSession({ ...secret, configurationHash: provider.configurationHash, workspaceId: ids.family, identity: { providerId: provider.id, providerVersion: provider.version, configurationHash: provider.configurationHash, issuer: provider.issuer, subject: 'synthetic-person', authenticatedAt: now() - 10, assurance: 'mfa' } }));
    return secret;
  };
  const input = (requestId = 'request_' + randomBytes(16).toString('hex')): RecordExportRequest => ({ workspaceId: ids.family, requestId, records: [{ id: ids.familyRecord, version: 1 }, { id: ids.familyNote, version: 1 }] });
  try {
    await reset(); await store.ready();
    await t.test('disabled by default; invalid explicit lifetimes rejected', async () => {
      const a = await signIn();
      assert.equal(await new PostgresAccountStore(h.runtime, { providers: options.providers }).requestRecordExport(a.tokenHash, a.csrfHash, input()), null);
      for (const ttl of [0, -1, Infinity, 86401, 1.5]) assert.throws(() => new PostgresAccountStore(h.runtime, { ...options, exports: { artifactTtlSeconds: ttl } }), /configuration/);
    });
    await t.test('exact output survives store restart; concurrent retry returns the same artifact', async () => {
      await reset(); const a = await signIn(), request = input();
      const jobs = await Promise.all([store.requestRecordExport(a.tokenHash, a.csrfHash, request), store.requestRecordExport(a.tokenHash, a.csrfHash, { ...request, records: [...request.records].reverse() })]);
      assert.ok(jobs[0]); assert.deepEqual(jobs[0], jobs[1]);
      assert.equal(jobs[0].expiresAt - jobs[0].createdAt, 120);
      const restarted = new PostgresAccountStore(h.runtime, options);
      assert.deepEqual(await restarted.getRecordExport(a.tokenHash, jobs[0].id), jobs[0]);
      const download = await restarted.downloadRecordExport(a.tokenHash, jobs[0].id); assert.ok(download);
      assert.equal(download.artifact.format, 'erudior-record-export-v1');
      assert.equal(download.artifact.workspaceId, ids.family);
      assert.deepEqual(download.artifact.records, [...request.records].sort((a,b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0).map(r => ({ ...r, category: r.id === ids.familyNote ? 'family-note' : 'practice', visibility: r.id === ids.familyNote ? 'private' : 'released', payload: { synthetic: true, record: r.id, unicode: 'é漢字' } })));
      assert.equal(await store.requestRecordExport(a.tokenHash, a.csrfHash, { ...request, records: [request.records[0]!] }), null);
      assert.equal(Number((await h.admin.query('SELECT count(*) FROM erudior_private.record_exports')).rows[0].count), 1);
    });
    await t.test('mixed-case opaque IDs use locale-independent ordinal order across retry and restart', async () => {
      const graph = await reset();
      const template = graph.records.find(r => r.id === ids.familyRecord)!;
      const upper = 'Z_record____________________', lower = 'a_record____________________';
      graph.records.push({ ...template, id: upper }, { ...template, id: lower });
      await h.replaceGraph(graph, { [upper]: { synthetic: upper }, [lower]: { synthetic: lower } });
      const a = await signIn(), request = { ...input(), records: [{ id: lower, version: 1 }, { id: upper, version: 1 }] };
      const job = await store.requestRecordExport(a.tokenHash, a.csrfHash, request); assert.ok(job);
      const restarted = new PostgresAccountStore(h.runtime, options);
      assert.deepEqual(await restarted.requestRecordExport(a.tokenHash, a.csrfHash, { ...request, records: [...request.records].reverse() }), job);
      const download = await restarted.downloadRecordExport(a.tokenHash, job.id); assert.ok(download);
      assert.deepEqual(download.artifact.records.map(r => r.id), [upper, lower]);
      assert.deepEqual((await h.admin.query('SELECT scope FROM erudior_private.record_exports WHERE export_id=$1', [job.id])).rows[0].scope,
        [{ id: upper, version: 1 }, { id: lower, version: 1 }]);
    });
    await t.test('RLS denies unscoped and wrong owner/session/workspace access and source writes', async () => {
      await reset(); const a = await signIn(), b = await signIn(); const job = await store.requestRecordExport(a.tokenHash, a.csrfHash, input()); assert.ok(job);
      assert.deepEqual((await h.runtime.query('SELECT * FROM erudior_private.record_exports')).rows, []);
      assert.equal(await store.getRecordExport(b.tokenHash, job.id), null);
      assert.equal(await store.downloadRecordExport(b.tokenHash, job.id), null);
      assert.equal(await store.cancelRecordExport(b.tokenHash, b.csrfHash, job.id), null);
      const flags = (await h.admin.query("SELECT relrowsecurity,relforcerowsecurity FROM pg_class WHERE oid='erudior_private.record_exports'::regclass")).rows[0];
      assert.deepEqual(flags, { relrowsecurity: true, relforcerowsecurity: true });
      await assert.rejects(h.runtime.query('DELETE FROM erudior_private.record_payloads'), { code: '42501' });
      await assert.rejects(h.runtime.query('UPDATE erudior_private.authority_graph SET revision=revision+1'), { code: '42501' });
      await assert.rejects(h.runtime.query('TRUNCATE erudior_private.record_exports'), { code: '42501' });
    });
    await t.test('exact validated scope; no wildcard/extra authority/cross-workspace/duplicate/stale versions', async () => {
      await reset(); const a = await signIn(); const request = input();
      for (const bad of [
        { ...request, records: [] }, { ...request, records: [request.records[0], request.records[0]] },
        { ...request, records: [{ id: '*', version: 1 }] }, { ...request, records: [{ id: ids.familyRecord, version: 2 }] },
        { ...request, records: [{ id: ids.grade, version: 1 }] }, { ...request, records: [{ id: ids.familyRecord, version: 1, payload: {} }] },
        { ...request, authority: {} }, { ...request, workspaceId: ids.personal },
      ]) assert.equal(await store.requestRecordExport(a.tokenHash, a.csrfHash, bad as RecordExportRequest), null);
      assert.equal(await store.requestRecordExport(a.tokenHash, hash('wrong-csrf'), request), null);
      assert.equal(Number((await h.admin.query('SELECT count(*) FROM erudior_private.record_exports')).rows[0].count), 0);
    });
    await t.test('cancel scrubs only export bytes, is idempotent, and never resurrects on retry', async () => {
      await reset(); const a = await signIn(), request = input(); const job = await store.requestRecordExport(a.tokenHash, a.csrfHash, request); assert.ok(job);
      assert.equal(await store.cancelRecordExport(a.tokenHash, hash('wrong-csrf'), job.id), null);
      const cancelled = await store.cancelRecordExport(a.tokenHash, a.csrfHash, job.id); assert.equal(cancelled?.state, 'cancelled');
      assert.deepEqual(await store.cancelRecordExport(a.tokenHash, a.csrfHash, job.id), cancelled);
      assert.deepEqual(await store.requestRecordExport(a.tokenHash, a.csrfHash, request), cancelled);
      assert.equal(await store.downloadRecordExport(a.tokenHash, job.id), null);
      assert.equal((await h.admin.query('SELECT artifact FROM erudior_private.record_exports WHERE export_id=$1', [job.id])).rows[0].artifact, null);
      assert.ok(await store.readRecord({ tokenHash: a.tokenHash, workspaceId: ids.family, recordId: ids.familyRecord }));
    });
    await t.test('canceled tombstones count against per-session cap', async () => {
      await reset(); const a = await signIn();
      for (let i = 0; i < 16; i++) { const job = await store.requestRecordExport(a.tokenHash, a.csrfHash, input()); assert.ok(job); assert.ok(await store.cancelRecordExport(a.tokenHash, a.csrfHash, job.id)); }
      assert.equal(await store.requestRecordExport(a.tokenHash, a.csrfHash, input()), null);
      assert.equal(Number((await h.admin.query('SELECT count(*) FROM erudior_private.record_exports')).rows[0].count), 16);
    });
    await t.test('oversized exact multi-record artifact creates no job and leaves sources intact', async () => {
      let graph = await reset();
      const template = graph.records.find(r => r.id === ids.familyRecord)!;
      const records = Array.from({ length: 5 }, (_, i) => ({ ...template, id: ('large_record_' + i).padEnd(28, '_') }));
      graph.records.push(...records);
      graph = await h.replaceGraph(graph, Object.fromEntries(records.map(r => [r.id, { synthetic: 'x'.repeat(220_000) }])));
      const a = await signIn();
      assert.equal(await store.requestRecordExport(a.tokenHash, a.csrfHash, { ...input(), records: records.map(r => ({ id: r.id, version: r.version })) }), null);
      assert.equal(Number((await h.admin.query('SELECT count(*) FROM erudior_private.record_exports')).rows[0].count), 0);
      assert.equal((await store.readRecord({ tokenHash: a.tokenHash, workspaceId: ids.family, recordId: records[0]!.id }))?.id, records[0]!.id);
    });
    await t.test('database independently rejects an artifact over its byte cap', async () => {
      await reset(); const a = await signIn(); const job = await store.requestRecordExport(a.tokenHash, a.csrfHash, input()); assert.ok(job);
      const before = await store.downloadRecordExport(a.tokenHash, job.id);
      await assert.rejects(h.admin.query('UPDATE erudior_private.record_exports SET artifact=$1::jsonb WHERE export_id=$2', [JSON.stringify({ synthetic: 'x'.repeat(2 * 1024 * 1024) }), job.id]), { code: '23514' });
      assert.deepEqual(await store.downloadRecordExport(a.tokenHash, job.id), before);
    });
    await t.test('concurrent creators share the final global capacity slot', async () => {
      await reset(); const a = await signIn(), b = await signIn();
      // Synthetic terminal metadata deliberately fills global capacity without
      // artifact bytes or active credentials. It remains subject to the cap.
      await h.admin.query(`INSERT INTO erudior_private.record_exports
        (export_id,session_id,session_version,delete_after,owner_account_id,workspace_id,request_id,scope,state,created_at,expires_at,artifact)
        SELECT 'seed_export_' || i, 'seed_session_' || i, 1, $1::bigint + 600, $2, $3, 'seed_request_' || i, $4::jsonb, 'cancelled', $1::bigint, $1::bigint + 120, NULL
        FROM generate_series(1,255) AS i`, [now(), ids.adult, ids.family, JSON.stringify(input().records)]);
      const jobs = await Promise.all([store.requestRecordExport(a.tokenHash, a.csrfHash, input()), store.requestRecordExport(b.tokenHash, b.csrfHash, input())]);
      assert.equal(jobs.filter(Boolean).length, 1);
      assert.equal(Number((await h.admin.query('SELECT count(*) FROM erudior_private.record_exports')).rows[0].count), 256);
      assert.equal(await store.requestRecordExport(a.tokenHash, a.csrfHash, input()), null);
    });
    await t.test('validated TTL is immutable and artifacts cannot outlive the original session', async () => {
      await reset(); const a = await signIn();
      const mutable = { providers: options.providers, exports: { artifactTtlSeconds: 60 } };
      const fixed = new PostgresAccountStore(h.runtime, mutable);
      mutable.exports.artifactTtlSeconds = 86401;
      const job = await fixed.requestRecordExport(a.tokenHash, a.csrfHash, input()); assert.ok(job);
      assert.equal(job.expiresAt - job.createdAt, 60);
      const short = new PostgresAccountStore(h.runtime, { ...options, sessionSeconds: 60, idleSeconds: 30 });
      const secret = credential();
      const session = await short.establishSession({ ...secret, configurationHash: provider.configurationHash, workspaceId: ids.family, identity: { providerId: provider.id, providerVersion: provider.version, configurationHash: provider.configurationHash, issuer: provider.issuer, subject: 'synthetic-person', authenticatedAt: now() - 10, assurance: 'mfa' } });
      assert.ok(session);
      const clipped = await short.requestRecordExport(secret.tokenHash, secret.csrfHash, input()); assert.ok(clipped);
      assert.equal(clipped.expiresAt, session.session.expiresAt);
      assert.ok(clipped.expiresAt - clipped.createdAt <= 60);
      assert.equal(Number((await h.admin.query('SELECT delete_after FROM erudior_private.record_exports WHERE export_id=$1', [clipped.id])).rows[0].delete_after), session.session.expiresAt);
    });
  } finally { await h.close(); }
});

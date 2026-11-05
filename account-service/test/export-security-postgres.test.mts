import assert from 'node:assert/strict';
import { createHash, randomBytes } from 'node:crypto';
import { setTimeout as delay } from 'node:timers/promises';
import { test } from 'node:test';
import { accountFixture, accountFixtureIds as ids } from './fixtures.mts';
import { createPostgresHarness } from './postgres-harness.mts';
import { PostgresAccountStore, type StoreProviderPolicy } from '../src/store.ts';
import type { VerifiedOidcIdentity } from '../src/oidc.ts';

const hash = (s: string) => createHash('sha256').update(s).digest('hex');
const secret = () => ({ tokenHash: hash(randomBytes(32).toString('hex')), csrfHash: hash(randomBytes(32).toString('hex')) });
const now = () => Math.floor(Date.now() / 1000);

await test('independent private export security acceptance against PostgreSQL', async t => {
  const h = await createPostgresHarness();
  const providers: StoreProviderPolicy[] = [
    { id: 'personal', version: 1, configurationHash: hash('personal'), issuer: 'https://personal.example', trust: 'personal', schoolId: null },
    { id: 'school', version: 1, configurationHash: hash('school'), issuer: 'https://school.example', trust: 'school', schoolId: ids.school },
  ];
  let graph = accountFixture(now());
  const store = new PostgresAccountStore(h.runtime, { providers: () => providers, exports: { artifactTtlSeconds: 60 } });
  const reset = async () => {
    await h.admin.query('TRUNCATE erudior_private.record_exports, erudior_private.record_payloads, erudior_private.device_sessions, erudior_private.oidc_flows, erudior_private.authority_graph');
    graph = accountFixture(now()); graph.sessions = [];
    graph = await h.seed(graph, Object.fromEntries(graph.records.map(r => [r.id, { synthetic: true, record: r.id }])));
  };
  const signIn = async (workspaceId = ids.family, providerId = 'personal', subject?: string) => {
    const p = providers.find(p => p.id === providerId)!;
    const identity: VerifiedOidcIdentity = { providerId, providerVersion: p.version, configurationHash: p.configurationHash, issuer: p.issuer, subject: subject ?? (providerId === 'school' ? 'synthetic-staff' : 'synthetic-person'), authenticatedAt: now() - 10, assurance: 'mfa' };
    const credentials = secret();
    assert.ok(await store.establishSession({ identity, configurationHash: p.configurationHash, workspaceId, ...credentials }));
    return credentials;
  };
  const request = (recordId = ids.familyRecord, workspaceId = ids.family) => ({ workspaceId, requestId: 'request_' + randomBytes(16).toString('hex'), records: [{ id: recordId, version: 1 }] });
  const blocked = async (query: string, user = h.runtimeRole) => {
    for (let n = 0; n < 150; n++) {
      const result = await h.admin.query<{ blocked: boolean }>("SELECT EXISTS(SELECT FROM pg_stat_activity WHERE datname=$1 AND usename=$2 AND wait_event_type='Lock' AND query LIKE $3) AS blocked", [h.databaseName, user, '%' + query + '%']);
      if (result.rows[0]!.blocked) return;
      await delay(20);
    }
    throw new Error('Expected real PostgreSQL lock wait for ' + query);
  };
  try {
    await reset();
    await t.test('read access does not imply export and session/tenant/RLS boundaries remain closed', async () => {
      const a = await signIn(), b = await signIn(), other = await signIn(ids.otherPersonal, 'personal', 'synthetic-other');
      assert.ok(await store.readRecord({ tokenHash: a.tokenHash, workspaceId: ids.family, recordId: ids.grade }));
      assert.equal(await store.requestRecordExport(a.tokenHash, a.csrfHash, request(ids.grade)), null);
      assert.equal(await store.requestRecordExport(a.tokenHash, a.csrfHash, request(ids.foreignGrade)), null);
      const job = await store.requestRecordExport(a.tokenHash, a.csrfHash, request()); assert.ok(job);
      for (const c of [b, other]) {
        assert.equal(await store.getRecordExport(c.tokenHash, job.id), null);
        assert.equal(await store.downloadRecordExport(c.tokenHash, job.id), null);
        assert.equal(await store.cancelRecordExport(c.tokenHash, c.csrfHash, job.id), null);
      }
      assert.deepEqual((await h.runtime.query('SELECT * FROM erudior_private.record_exports')).rows, []);
      await assert.rejects(h.runtime.query("UPDATE erudior_private.record_payloads SET payload='{}'"), { code: '42501' });
      await assert.rejects(h.runtime.query("UPDATE erudior_private.authority_graph SET revision=revision+1"), { code: '42501' });
    });
    await t.test('stale source versions cannot release cached artifact or silently regenerate request', async () => {
      await reset(); const a = await signIn(), input = request();
      const job = await store.requestRecordExport(a.tokenHash, a.csrfHash, input); assert.ok(job);
      graph.records.find(r => r.id === ids.familyRecord)!.version++;
      graph = await h.replaceGraph(graph, { [ids.familyRecord]: { synthetic: 'updated' } });
      assert.equal(await store.getRecordExport(a.tokenHash, job.id), null);
      assert.equal(await store.downloadRecordExport(a.tokenHash, job.id), null);
      assert.equal(await store.requestRecordExport(a.tokenHash, a.csrfHash, input), null);
      assert.equal(await store.requestRecordExport(a.tokenHash, a.csrfHash, { ...input, records: [{ id: ids.familyRecord, version: 2 }] }), null);
    });
    await t.test('context rotation cannot revive an old artifact after switching back', async () => {
      await reset(); const a = await signIn();
      const job = await store.requestRecordExport(a.tokenHash, a.csrfHash, request()); assert.ok(job);
      const b = secret(), c = secret();
      assert.ok(await store.switchContext({ ...a, workspaceId: ids.personal, newTokenHash: b.tokenHash, newCsrfHash: b.csrfHash }));
      assert.equal(await store.downloadRecordExport(a.tokenHash, job.id), null);
      assert.equal(await store.downloadRecordExport(b.tokenHash, job.id), null);
      assert.ok(await store.switchContext({ ...b, workspaceId: ids.family, newTokenHash: c.tokenHash, newCsrfHash: c.csrfHash }));
      assert.equal(await store.downloadRecordExport(c.tokenHash, job.id), null);
    });
    await t.test('cancel and expiry preserve retry tombstones and erase artifact bytes', async () => {
      await reset(); const a = await signIn(), input = request();
      const job = await store.requestRecordExport(a.tokenHash, a.csrfHash, input); assert.ok(job);
      assert.equal((await store.cancelRecordExport(a.tokenHash, a.csrfHash, job.id))?.state, 'cancelled');
      assert.equal((await store.requestRecordExport(a.tokenHash, a.csrfHash, input))?.id, job.id);
      assert.equal(await store.downloadRecordExport(a.tokenHash, job.id), null);
      const expires = request(); const expiring = await store.requestRecordExport(a.tokenHash, a.csrfHash, expires); assert.ok(expiring);
      await h.admin.query('UPDATE erudior_private.record_exports SET created_at=$1, expires_at=$2 WHERE export_id=$3', [now()-10, now()-1, expiring.id]);
      await store.purgeExpired();
      const retry = await store.requestRecordExport(a.tokenHash, a.csrfHash, expires);
      assert.ok(retry === null || retry.id === expiring.id && retry.state === 'expired');
      assert.equal(await store.downloadRecordExport(a.tokenHash, expiring.id), null);
      assert.equal((await h.admin.query('SELECT count(*)::int AS count FROM erudior_private.record_exports WHERE export_id=$1 AND artifact IS NOT NULL', [expiring.id])).rows[0].count, 0);
    });
    await t.test('acknowledged authority revocation wins over a blocked download', async () => {
      await reset(); const a = await signIn(); const job = await store.requestRecordExport(a.tokenHash, a.csrfHash, request()); assert.ok(job);
      const admin = await h.admin.connect();
      try {
        await admin.query('BEGIN');
        const next = structuredClone(graph); next.revision++;
        const authority = next.authorities.find(v => v.id === ids.guardianAuthority)!; authority.version++; authority.status = 'withdrawn';
        await admin.query('UPDATE erudior_private.authority_graph SET revision=$1,graph=$2 WHERE singleton', [next.revision, JSON.stringify(next)]);
        const pending = store.downloadRecordExport(a.tokenHash, job.id); await blocked('lock_graph');
        await admin.query('COMMIT'); assert.equal(await pending, null);
      } finally { await admin.query('ROLLBACK'); admin.release(); }
    });
    await t.test('session revocation serializes behind a protected download and blocks every later read', async () => {
      await reset(); const a = await signIn(); const job = await store.requestRecordExport(a.tokenHash, a.csrfHash, request()); assert.ok(job);
      const admin = await h.admin.connect();
      try {
        await admin.query('BEGIN'); await admin.query('SELECT * FROM erudior_private.record_exports WHERE export_id=$1 FOR UPDATE', [job.id]);
        const reading = store.downloadRecordExport(a.tokenHash, job.id); await blocked('record_exports');
        let revoked = false;
        const revoking = store.revokeSession(a).then(result => { revoked = true; return result; });
        await blocked('FROM erudior_private.device_sessions'); assert.equal(revoked, false);
        await admin.query('COMMIT'); assert.ok(await reading); assert.equal(await revoking, true);
        assert.equal(await store.downloadRecordExport(a.tokenHash, job.id), null);
        assert.equal(await store.getRecordExport(a.tokenHash, job.id), null);
      } finally { await admin.query('ROLLBACK'); admin.release(); }
    });
    await t.test('authority expiry during artifact wait denies bytes despite initially valid decision', async () => {
      await reset(); const a = await signIn(); const job = await store.requestRecordExport(a.tokenHash, a.csrfHash, request()); assert.ok(job);
      const authority = graph.authorities.find(v => v.id === ids.guardianAuthority)!; authority.version++; authority.expiresAt = now()+2;
      graph = await h.replaceGraph(graph);
      const admin = await h.admin.connect();
      try {
        await admin.query('BEGIN'); await admin.query('SELECT * FROM erudior_private.record_exports WHERE export_id=$1 FOR UPDATE', [job.id]);
        const pending = store.downloadRecordExport(a.tokenHash, job.id); await blocked('record_exports');
        while (now() < authority.expiresAt) await delay(50);
        await admin.query('COMMIT'); assert.equal(await pending, null);
      } finally { await admin.query('ROLLBACK'); admin.release(); }
    });
    await t.test('authority expiry during export creation rolls back durable bytes', async () => {
      await reset(); const a = await signIn();
      const authority = graph.authorities.find(v => v.id === ids.guardianAuthority)!; authority.version++; authority.expiresAt = now()+2;
      graph = await h.replaceGraph(graph);
      const admin = await h.admin.connect();
      try {
        await admin.query('BEGIN'); await admin.query('LOCK TABLE erudior_private.record_payloads IN ACCESS EXCLUSIVE MODE');
        const pending = store.requestRecordExport(a.tokenHash, a.csrfHash, request()); await blocked('SELECT payload');
        while (now() < authority.expiresAt) await delay(50);
        await admin.query('COMMIT'); assert.equal(await pending, null);
        assert.equal((await h.admin.query('SELECT count(*)::int AS count FROM erudior_private.record_exports')).rows[0].count, 0);
      } finally { await admin.query('ROLLBACK'); admin.release(); }
    });
  } finally { await h.close(); }
});

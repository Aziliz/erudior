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

await test('private export discovery acceptance against PostgreSQL', async t => {
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
    await t.test('minimal authorized inventory; bounded opaque pagination and tampering', async () => {
      const a = await signIn(), b = await signIn();
      const first = await store.listExportableRecords(a.tokenHash, { workspaceId: ids.family, limit: 1 }); assert.ok(first); assert.equal(first.records.length, 1); assert.ok(first.nextCursor);
      assert.deepEqual(Object.keys(first.records[0]).sort(), ['category','id','version','visibility']);
      assert.ok(!JSON.stringify(first).includes(ids.grade));
      const second = await store.listExportableRecords(a.tokenHash, { workspaceId: ids.family, limit: 1, cursor: first.nextCursor }); assert.ok(second); assert.equal(second.records.length, 1); assert.notEqual(second.records[0].id, first.records[0].id); assert.equal(second.nextCursor, null);
      for (const tokenHash of [b.tokenHash, hash('invalid')]) assert.equal(await store.listExportableRecords(tokenHash, { workspaceId: ids.family, cursor: first.nextCursor }), null);
      assert.equal(await store.listExportableRecords(a.tokenHash, { workspaceId: ids.family, cursor: first.nextCursor + '0' }), null);
      assert.equal(await store.listRecordExports(a.tokenHash, { workspaceId: ids.family, cursor: first.nextCursor }), null);
      assert.equal(await store.listExportableRecords(a.tokenHash, { workspaceId: ids.personal }), null);
      for (const limit of [0, -1, 33, 1.5, Infinity]) assert.equal(await store.listExportableRecords(a.tokenHash, { workspaceId: ids.family, limit }), null);
      const unsafe = new PostgresAccountStore(h.admin, { providers: () => providers, exports: { artifactTtlSeconds: 60 } });
      await assert.rejects(unsafe.listExportableRecords(a.tokenHash, { workspaceId: ids.family }), /Unsafe private account database role/);
      await assert.rejects(unsafe.listRecordExports(a.tokenHash, { workspaceId: ids.family }), /Unsafe private account database role/);
      const disabled = new PostgresAccountStore(h.runtime, { providers: () => providers });
      assert.equal(await disabled.listExportableRecords(a.tokenHash, { workspaceId: ids.family }), null);
      assert.equal(await disabled.listRecordExports(a.tokenHash, { workspaceId: ids.family }), null);
      graph.records.find(r => r.id === ids.familyRecord)!.version++;
      graph = await h.replaceGraph(graph);
      assert.equal(await store.listExportableRecords(a.tokenHash, { workspaceId: ids.family, cursor: first.nextCursor }), null);
    });
    await t.test('same-session statuses, current authorization, expiry and context isolation', async () => {
      await reset(); const a = await signIn(), b = await signIn();
      const one = await store.requestRecordExport(a.tokenHash, a.csrfHash, request()); const two = await store.requestRecordExport(a.tokenHash, a.csrfHash, request(ids.familyNote)); assert.ok(one && two);
      assert.deepEqual(await store.listRecordExports(b.tokenHash, { workspaceId: ids.family }), { exports: [], nextCursor: null });
      const first = await store.listRecordExports(a.tokenHash, { workspaceId: ids.family, limit: 1 }); assert.ok(first?.nextCursor);
      const second = await store.listRecordExports(a.tokenHash, { workspaceId: ids.family, limit: 1, cursor: first.nextCursor }); assert.equal(second?.exports.length, 1); assert.equal(second.nextCursor, null);
      assert.notEqual(first.exports[0].id, second.exports[0].id);
      await store.cancelRecordExport(a.tokenHash, a.csrfHash, one.id);
      await h.admin.query('UPDATE erudior_private.record_exports SET created_at=$1,expires_at=$2 WHERE export_id=$3', [now()-10,now()-1,two.id]);
      const listed = await store.listRecordExports(a.tokenHash, { workspaceId: ids.family }); assert.ok(listed);
      assert.deepEqual(listed.exports.map(j => j.state).sort(), ['cancelled','expired']);
      assert.equal((await h.admin.query('SELECT artifact FROM erudior_private.record_exports WHERE export_id=$1', [two.id])).rows[0].artifact, null);
      graph.records.find(r => r.id === ids.familyRecord)!.version++; graph = await h.replaceGraph(graph);
      assert.equal((await store.listRecordExports(a.tokenHash, { workspaceId: ids.family }))?.exports.length, 1);
      const c = secret(), d = secret();
      assert.ok(await store.switchContext({ ...a, workspaceId: ids.personal, newTokenHash: c.tokenHash, newCsrfHash: c.csrfHash }));
      assert.ok(await store.switchContext({ ...c, workspaceId: ids.family, newTokenHash: d.tokenHash, newCsrfHash: d.csrfHash }));
      assert.deepEqual(await store.listRecordExports(d.tokenHash, { workspaceId: ids.family }), { exports: [], nextCursor: null });
      assert.equal(await store.listExportableRecords(a.tokenHash, { workspaceId: ids.family }), null);
      assert.deepEqual((await h.runtime.query('SELECT * FROM erudior_private.record_exports')).rows, []);
    });
    await t.test('acknowledged authority revocation wins over both blocked listings', async () => {
      for (const kind of ['records', 'exports']) {
        await reset(); const a = await signIn(); assert.ok(await store.requestRecordExport(a.tokenHash, a.csrfHash, request()));
        const admin = await h.admin.connect();
        try {
          await admin.query('BEGIN');
          const next = structuredClone(graph); next.revision++; const authority = next.authorities.find(v => v.id === ids.guardianAuthority)!; authority.version++; authority.status = 'withdrawn';
          await admin.query('UPDATE erudior_private.authority_graph SET revision=$1,graph=$2', [next.revision, next]);
          const pending = kind === 'records' ? store.listExportableRecords(a.tokenHash, { workspaceId: ids.family }) : store.listRecordExports(a.tokenHash, { workspaceId: ids.family });
          await blocked('lock_graph'); await admin.query('COMMIT');
          const result = await pending;
          assert.ok(result === null || ('records' in result ? result.records : result.exports).length === 0);
        } finally { await admin.query('ROLLBACK'); admin.release(); }
      }
    });
    await t.test('both listing final-time checks roll back idle touch on authority expiry', async () => {
      for (const kind of ['records', 'exports']) {
        await reset(); const a = await signIn(); assert.ok(await store.requestRecordExport(a.tokenHash, a.csrfHash, request()));
        const authority = graph.authorities.find(v => v.id === ids.guardianAuthority)!; authority.version++; authority.expiresAt = now()+2; graph = await h.replaceGraph(graph);
        const blocker = await h.admin.connect(), before = now()-20;
        await h.admin.query('UPDATE erudior_private.device_sessions SET last_used_at=$1 WHERE token_hash=$2', [before, a.tokenHash]);
        await h.admin.query(`CREATE FUNCTION erudior_private.test_delay_touch() RETURNS trigger LANGUAGE plpgsql SET search_path=pg_catalog,pg_temp AS $$ BEGIN PERFORM pg_advisory_xact_lock(192735,1); RETURN NEW; END $$`);
        await h.admin.query('CREATE TRIGGER test_delay_touch BEFORE UPDATE OF last_used_at ON erudior_private.device_sessions FOR EACH ROW EXECUTE FUNCTION erudior_private.test_delay_touch()');
        try {
          await blocker.query('BEGIN'); await blocker.query('SELECT pg_advisory_xact_lock(192735,1)');
          const pending = kind === 'records' ? store.listExportableRecords(a.tokenHash, { workspaceId: ids.family, limit: 1 }) : store.listRecordExports(a.tokenHash, { workspaceId: ids.family, limit: 1 });
          await blocked('UPDATE erudior_private.device_sessions SET last_used_at');
          while (now() < authority.expiresAt) await delay(30);
          await blocker.query('COMMIT'); assert.equal(await pending, null);
          assert.equal(Number((await h.admin.query('SELECT last_used_at FROM erudior_private.device_sessions WHERE token_hash=$1', [a.tokenHash])).rows[0].last_used_at), before);
        } finally {
          await blocker.query('ROLLBACK'); blocker.release();
          await h.admin.query('DROP TRIGGER test_delay_touch ON erudior_private.device_sessions');
          await h.admin.query('DROP FUNCTION erudior_private.test_delay_touch()');
        }
      }
    });
    await t.test('authority expiry while status listing waits cannot expose job metadata', async () => {
      await reset(); const a = await signIn(); const job = await store.requestRecordExport(a.tokenHash, a.csrfHash, request()); assert.ok(job);
      const authority = graph.authorities.find(v => v.id === ids.guardianAuthority)!; authority.version++; authority.expiresAt = now()+2; graph = await h.replaceGraph(graph);
      const admin = await h.admin.connect();
      try {
        await admin.query('BEGIN'); await admin.query('SELECT * FROM erudior_private.record_exports WHERE export_id=$1 FOR UPDATE', [job.id]);
        const pending = store.listRecordExports(a.tokenHash, { workspaceId: ids.family }); await blocked('record_exports');
        while (now() < authority.expiresAt) await delay(50);
        await admin.query('COMMIT'); const result = await pending; assert.ok(result === null || result.exports.length === 0);
      } finally { await admin.query('ROLLBACK'); admin.release(); }
    });
  } finally { await h.close(); }
});

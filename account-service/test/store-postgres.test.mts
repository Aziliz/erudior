import assert from 'node:assert/strict';
import { createHash, randomBytes } from 'node:crypto';
import { setTimeout as delay } from 'node:timers/promises';
import { test } from 'node:test';
import { accountFixture, accountFixtureIds as ids } from './fixtures.mts';
import { createPostgresHarness } from './postgres-harness.mts';
import { PostgresAccountStore, type StoreProviderPolicy } from '../src/store.ts';
import type { OidcTransaction, VerifiedOidcIdentity } from '../src/oidc.ts';

const hash = (value: string) => createHash('sha256').update(value).digest('hex');
const credential = () => ({ tokenHash: hash(randomBytes(32).toString('hex')), csrfHash: hash(randomBytes(32).toString('hex')) });
const now = () => Math.floor(Date.now() / 1000);

await test('real PostgreSQL private account boundary', async t => {
  const h = await createPostgresHarness();
  let graph = accountFixture(now()); graph.sessions = [];
  let providers: StoreProviderPolicy[] = [];
  const reset = async () => {
    await h.admin.query('TRUNCATE erudior_private.record_payloads, erudior_private.device_sessions, erudior_private.oidc_flows, erudior_private.authority_graph');
    graph = accountFixture(now()); graph.sessions = [];
    providers = [
      { id: 'personal', version: 1, configurationHash: hash('personal-registration'), issuer: 'https://personal.example', trust: 'personal', schoolId: null },
      { id: 'school', version: 1, configurationHash: hash('school-registration'), issuer: 'https://school.example', trust: 'school', schoolId: ids.school },
    ];
    graph = await h.seed(graph, Object.fromEntries(graph.records.map(r => [r.id, { synthetic: true, record: r.id }])));
  };
  const store = new PostgresAccountStore(h.runtime, { providers: () => providers });
  const proof = (providerId = 'personal'): VerifiedOidcIdentity => {
    const p = providers.find(p => p.id === providerId)!;
    return { providerId, providerVersion: p.version, configurationHash: p.configurationHash, issuer: p.issuer, subject: providerId === 'school' ? 'synthetic-staff' : 'synthetic-person', authenticatedAt: now() - 10, assurance: 'mfa' };
  };
  const signIn = async (workspaceId = ids.family, providerId = 'personal') => {
    const auth = proof(providerId), secret = credential();
    const issued = await store.establishSession({ identity: auth, configurationHash: auth.configurationHash, workspaceId, ...secret });
    assert.ok(issued); return { ...secret, ...issued };
  };
  const read = (tokenHash: string, recordId = ids.familyRecord, workspaceId = ids.family) => store.readRecord({ tokenHash, recordId, workspaceId });
  const blocked = async (query: string, user = h.runtimeRole) => {
    for (let n = 0; n < 150; n++) {
      const row = (await h.admin.query<{ blocked: boolean }>("SELECT EXISTS(SELECT FROM pg_stat_activity WHERE datname=$1 AND usename=$2 AND wait_event_type='Lock' AND query LIKE $3) AS blocked", [h.databaseName, user, '%' + query + '%'])).rows[0]!;
      if (row.blocked) return;
      await delay(20);
    }
    throw new Error('Expected the real PostgreSQL lock wait');
  };
  const revokeGraph = () => {
    const next = structuredClone(graph); next.revision++;
    const authority = next.authorities.find(a => a.id === ids.guardianAuthority)!; authority.status = 'withdrawn'; authority.version++;
    return next;
  };
  try {
    await reset(); await store.ready();
    await t.test('runtime cannot own/bypass RLS, mutate payloads/authority, or read an unscoped payload', async () => {
      await assert.rejects(new PostgresAccountStore(h.admin, { providers: () => providers }).ready(), /Unsafe private account database role/);
      const identity = (await h.runtime.query<{ current_user: string; session_user: string }>('SELECT current_user, session_user')).rows[0]!;
      assert.equal(identity.current_user, h.runtimeRole); assert.equal(identity.session_user, h.runtimeRole);
      assert.deepEqual((await h.runtime.query('SELECT * FROM erudior_private.record_payloads')).rows, []);
      await assert.rejects(h.runtime.query('UPDATE erudior_private.record_payloads SET payload=\'{}\''), { code: '42501' });
      await assert.rejects(h.runtime.query('SELECT * FROM erudior_private.authority_graph'), { code: '42501' });
      await assert.rejects(h.runtime.query('CREATE TABLE erudior_private.forbidden(id int)'), { code: '42501' });
      const flags = (await h.admin.query<{ relrowsecurity: boolean; relforcerowsecurity: boolean }>("SELECT relrowsecurity,relforcerowsecurity FROM pg_class WHERE oid='erudior_private.record_payloads'::regclass")).rows[0]!;
      assert.deepEqual(flags, { relrowsecurity: true, relforcerowsecurity: true });
      const helpers = await h.admin.query<{ proname: string; public_execute: boolean }>("SELECT p.proname, EXISTS(SELECT FROM aclexplode(p.proacl) a WHERE a.grantee=0 AND a.privilege_type='EXECUTE') AS public_execute FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace WHERE n.nspname='erudior_private'");
      assert.ok(helpers.rows.length); assert.ok(helpers.rows.every(r => !r.public_execute));
    });
    await t.test('one-use flow claim is browser-bound and atomic across two connections', async () => {
      const tx: OidcTransaction = { providerId: 'personal', providerVersion: 1, configurationHash: providers[0]!.configurationHash, state: randomBytes(32).toString('base64url'), nonce: randomBytes(32).toString('base64url'), codeVerifier: randomBytes(32).toString('base64url'), createdAt: now(), expiresAt: now() + 120 };
      const stateHash = hash(tx.state), bindingHash = hash('browser-binding'), previous = credential();
      await store.beginLogin({ stateHash, bindingHash, transaction: tx, workspaceId: ids.family, replacesTokenHash: previous.tokenHash, replacesCsrfHash: previous.csrfHash });
      assert.equal(await store.consumeLogin({ stateHash, bindingHash: hash('wrong-browser') }), null);
      const claims = await Promise.all([store.consumeLogin({ stateHash, bindingHash }), store.consumeLogin({ stateHash, bindingHash })]);
      assert.equal(claims.filter(Boolean).length, 1);
      assert.deepEqual(claims.find(Boolean), { transaction: tx, workspaceId: ids.family, replacesTokenHash: previous.tokenHash, replacesCsrfHash: previous.csrfHash });
      assert.equal(await store.consumeLogin({ stateHash, bindingHash }), null);
    });
    await t.test('exact identity, workspace and current authorization gate payload reads', async () => {
      const a = await signIn();
      assert.equal((await read(a.tokenHash))?.id, ids.familyRecord);
      assert.equal((await read(a.tokenHash, ids.grade))?.category, 'grade');
      assert.equal(await read(a.tokenHash, ids.foreignGrade), null);
      assert.equal(await read(a.tokenHash, 'nonexistent_record________'), null);
      assert.equal(await read(a.tokenHash, ids.familyRecord, ids.personal), null);
      const unknown = { ...proof(), subject: 'not-preprovisioned' };
      assert.equal(await store.establishSession({ identity: unknown, configurationHash: unknown.configurationHash, workspaceId: ids.family, ...credential() }), null);
      graph.authorities.find(a => a.id === ids.guardianAuthority)!.status = 'withdrawn'; graph.authorities.find(a => a.id === ids.guardianAuthority)!.version++;
      graph = await h.replaceGraph(graph);
      assert.equal(await read(a.tokenHash), null);
      assert.ok(await store.getSession(a.tokenHash), 'Withdrawing learning authority does not silently erase the verified adult session');
      assert.deepEqual((await h.runtime.query('SELECT * FROM erudior_private.record_payloads')).rows, []);
      await reset();
    });
    await t.test('context switches rotate credentials and preserve verified authentication time/source', async () => {
      const a = await signIn(ids.personal), next = credential();
      const switched = await store.switchContext({ tokenHash: a.tokenHash, csrfHash: a.csrfHash, workspaceId: ids.family, newTokenHash: next.tokenHash, newCsrfHash: next.csrfHash });
      assert.ok(switched); assert.equal(switched.session.version, a.session.version + 1);
      assert.deepEqual(switched.session.authentication, a.session.authentication);
      assert.equal(await store.getSession(a.tokenHash), null);
      assert.equal((await read(next.tokenHash))?.id, ids.familyRecord);
      const school = await signIn(ids.school, 'school'), other = credential();
      assert.equal(await store.switchContext({ tokenHash: school.tokenHash, csrfHash: school.csrfHash, workspaceId: ids.family, newTokenHash: other.tokenHash, newCsrfHash: other.csrfHash }), null);
      assert.equal((await read(school.tokenHash, ids.grade, ids.school))?.id, ids.grade);
      assert.equal(await read(school.tokenHash, ids.familyRecord, ids.school), null);
    });
    await t.test('successful relogin revokes just the prior browser session atomically', async () => {
      await reset();
      const current = await signIn(), otherDevice = await signIn(), replacement = credential();
      const verified = proof();
      const result = await store.establishSession({ identity: verified, configurationHash: verified.configurationHash, workspaceId: ids.family, ...replacement, replacesTokenHash: current.tokenHash, replacesCsrfHash: current.csrfHash });
      assert.ok(result); assert.equal(await read(current.tokenHash), null); assert.ok(await read(otherDevice.tokenHash)); assert.ok(await read(replacement.tokenHash));
      const rejected = await store.establishSession({ identity: { ...verified, subject: 'unbound' }, configurationHash: verified.configurationHash, workspaceId: ids.family, ...credential(), replacesTokenHash: replacement.tokenHash, replacesCsrfHash: replacement.csrfHash });
      assert.equal(rejected, null); assert.ok(await read(replacement.tokenHash));
    });
    await t.test('acknowledged graph revocation wins over a read waiting on the current graph', async () => {
      await reset(); const a = await signIn(), admin = await h.admin.connect();
      try {
        await admin.query('BEGIN'); const next = revokeGraph();
        await admin.query('UPDATE erudior_private.authority_graph SET revision=$1,graph=$2 WHERE singleton', [next.revision, JSON.stringify(next)]);
        let resolved = false; const pending = read(a.tokenHash).then(v => { resolved = true; return v; });
        await blocked('lock_graph'); assert.equal(resolved, false);
        await admin.query('COMMIT'); assert.equal(await pending, null); graph = next;
      } finally { await admin.query('ROLLBACK'); admin.release(); }
    });
    await t.test('an earlier read holds graph authority until it commits; revocation then denies all later reads', async () => {
      await reset(); const a = await signIn();
      const blocker = await h.admin.connect(), revoke = await h.admin.connect();
      try {
        await blocker.query('BEGIN'); await blocker.query('LOCK TABLE erudior_private.record_payloads IN ACCESS EXCLUSIVE MODE');
        const reading = read(a.tokenHash); await blocked('SELECT payload');
        await revoke.query('BEGIN'); const next = revokeGraph(); let changed = false;
        const replacing = revoke.query('UPDATE erudior_private.authority_graph SET revision=$1,graph=$2 WHERE singleton', [next.revision, JSON.stringify(next)]).then(() => { changed = true; });
        await blocked('UPDATE erudior_private.authority_graph', new URL(h.adminUrl).username); assert.equal(changed, false);
        await blocker.query('COMMIT'); assert.ok(await reading);
        await replacing; await revoke.query('COMMIT'); graph = next;
        assert.equal(await read(a.tokenHash), null);
      } finally { await blocker.query('ROLLBACK'); await revoke.query('ROLLBACK'); blocker.release(); revoke.release(); }
    });
    await t.test('session revocation serializes with protected reads on another connection', async () => {
      await reset(); const a = await signIn(), admin = await h.admin.connect();
      try {
        await admin.query('BEGIN');
        await admin.query("UPDATE erudior_private.device_sessions SET body=jsonb_set(jsonb_set(body,'{status}','\"revoked\"'),'{version}',to_jsonb((body->>'version')::int+1)) WHERE token_hash=$1", [a.tokenHash]);
        const pending = read(a.tokenHash); await blocked('FROM erudior_private.device_sessions');
        await admin.query('COMMIT'); assert.equal(await pending, null);
      } finally { await admin.query('ROLLBACK'); admin.release(); }
    });
    await t.test('session issue rechecks policy expiry after a blocking advisory lock', async () => {
      await reset(); const admin = await h.admin.connect();
      graph.workspaces.find(w => w.id === ids.school)!.schoolPolicy!.maxAuthenticationAgeSeconds = 12;
      graph.workspaces.find(w => w.id === ids.school)!.schoolPolicy!.version++;
      graph.workspaces.find(w => w.id === ids.school)!.version++;
      graph = await h.replaceGraph(graph);
      try {
        await admin.query('BEGIN'); await admin.query('SELECT pg_advisory_xact_lock(192733, 2)');
        const verified = proof('school'); const secret = credential();
        const pending = store.establishSession({ identity: verified, configurationHash: verified.configurationHash, workspaceId: ids.school, ...secret });
        await blocked('pg_advisory_xact_lock');
        while (now() < verified.authenticatedAt + 12) await delay(30);
        await admin.query('COMMIT'); assert.equal(await pending, null);
        assert.equal(Number((await h.admin.query('SELECT count(*) AS n FROM erudior_private.device_sessions WHERE token_hash=$1', [secret.tokenHash])).rows[0]!.n), 0);
      } finally { await admin.query('ROLLBACK'); admin.release(); }
    });
    await t.test('protected read does not release payload when authority expires during its database wait', async () => {
      await reset();
      const authority = graph.authorities.find(a => a.id === ids.guardianAuthority)!;
      authority.expiresAt = now() + 2; authority.version++;
      graph = await h.replaceGraph(graph);
      const a = await signIn(), blocker = await h.admin.connect();
      try {
        await blocker.query('BEGIN'); await blocker.query('LOCK TABLE erudior_private.record_payloads IN ACCESS EXCLUSIVE MODE');
        const reading = read(a.tokenHash); await blocked('SELECT payload');
        while (now() < authority.expiresAt) await delay(30);
        await blocker.query('COMMIT'); assert.equal(await reading, null);
        assert.equal(Number((await h.admin.query('SELECT count(*) AS n FROM erudior_private.record_payloads')).rows[0]!.n), graph.records.length);
      } finally { await blocker.query('ROLLBACK'); blocker.release(); }
    });
    await t.test('authority expiry during the final idle touch denies payload and rolls back that touch', async () => {
      await reset();
      const authority = graph.authorities.find(a => a.id === ids.guardianAuthority)!;
      authority.expiresAt = now() + 2; authority.version++;
      graph = await h.replaceGraph(graph);
      const a = await signIn(), blocker = await h.admin.connect(), before = now() - 20;
      await h.admin.query('UPDATE erudior_private.device_sessions SET last_used_at=$1 WHERE token_hash=$2', [before, a.tokenHash]);
      await h.admin.query(`CREATE FUNCTION erudior_private.test_delay_touch() RETURNS trigger LANGUAGE plpgsql SET search_path=pg_catalog,pg_temp AS $$ BEGIN PERFORM pg_advisory_xact_lock(192734,1); RETURN NEW; END $$`);
      await h.admin.query('CREATE TRIGGER test_delay_touch BEFORE UPDATE OF last_used_at ON erudior_private.device_sessions FOR EACH ROW EXECUTE FUNCTION erudior_private.test_delay_touch()');
      try {
        await blocker.query('BEGIN'); await blocker.query('SELECT pg_advisory_xact_lock(192734,1)');
        const reading = read(a.tokenHash); await blocked('UPDATE erudior_private.device_sessions SET last_used_at');
        while (now() < authority.expiresAt) await delay(30);
        await blocker.query('COMMIT'); assert.equal(await reading, null);
        assert.equal(Number((await h.admin.query('SELECT last_used_at FROM erudior_private.device_sessions WHERE token_hash=$1', [a.tokenHash])).rows[0]!.last_used_at), before);
      } finally {
        await blocker.query('ROLLBACK'); blocker.release();
        await h.admin.query('DROP TRIGGER test_delay_touch ON erudior_private.device_sessions');
        await h.admin.query('DROP FUNCTION erudior_private.test_delay_touch()');
      }
    });
    await t.test('RLS selects only the exact scoped row and clears all scope on rollback and commit', async () => {
      await reset(); const a = await signIn(), raw = await h.runtime.connect();
      const scope = { token_hash: a.tokenHash, next_token_hash: '', record_id: ids.familyRecord, record_version: '1', workspace_id: ids.family, learner_id: ids.child, graph_revision: String(graph.revision), session_id: a.session.id, session_version: '1' };
      try {
        for (const finish of ['ROLLBACK', 'COMMIT']) {
          await raw.query('BEGIN');
          for (const [key, value] of Object.entries(scope)) await raw.query('SELECT set_config($1,$2,true)', ['erudior_account.' + key, value]);
          assert.deepEqual((await raw.query('SELECT record_id FROM erudior_private.record_payloads')).rows, [{ record_id: ids.familyRecord }]);
          await raw.query("SELECT set_config('erudior_account.record_version','2',true)");
          assert.deepEqual((await raw.query('SELECT record_id FROM erudior_private.record_payloads')).rows, []);
          await raw.query(finish);
          assert.deepEqual((await raw.query('SELECT record_id FROM erudior_private.record_payloads')).rows, []);
          const value = (await raw.query("SELECT current_setting('erudior_account.token_hash',true) AS token")).rows[0]!.token;
          assert.ok(value === null || value === '');
        }
      } finally { await raw.query('ROLLBACK'); raw.release(); }
    });
    await t.test('expired/revoked credential cleanup preserves authority and payload records', async () => {
      await reset(); const a = await signIn(), b = await signIn();
      const tx: OidcTransaction = { providerId: 'personal', providerVersion: 1, configurationHash: providers[0]!.configurationHash, state: randomBytes(32).toString('base64url'), nonce: randomBytes(32).toString('base64url'), codeVerifier: randomBytes(32).toString('base64url'), createdAt: now(), expiresAt: now() + 120 };
      await store.beginLogin({ stateHash: hash(tx.state), bindingHash: hash('expired-browser'), transaction: tx, workspaceId: null });
      assert.equal(await store.revokeSession({ tokenHash: a.tokenHash, csrfHash: a.csrfHash }), true);
      await h.admin.query('UPDATE erudior_private.device_sessions SET last_used_at=last_used_at-1801 WHERE token_hash=$1', [b.tokenHash]);
      assert.equal(await store.getSession(b.tokenHash), null);
      await h.admin.query('UPDATE erudior_private.oidc_flows SET expires_at=0');
      assert.deepEqual(await store.purgeExpired(), { flows: 1, sessions: 2 });
      assert.equal(Number((await h.admin.query('SELECT count(*) AS n FROM erudior_private.record_payloads')).rows[0]!.n), graph.records.length);
      assert.equal(Number((await h.admin.query('SELECT count(*) AS n FROM erudior_private.authority_graph')).rows[0]!.n), 1);
    });
    await t.test('concurrent issuance cannot exceed the per-account session cap and replacement retains other devices', async () => {
      await reset(); const verified = proof();
      const credentials = Array.from({ length: 34 }, credential);
      const results = await Promise.all(credentials.map(secret => store.establishSession({ identity: verified, configurationHash: verified.configurationHash, workspaceId: ids.family, ...secret })));
      assert.equal(results.filter(Boolean).length, 32);
      const first = credentials[results.findIndex(Boolean)]!, last = credential();
      assert.ok(await store.establishSession({ identity: verified, configurationHash: verified.configurationHash, workspaceId: ids.family, ...last, replacesTokenHash: first.tokenHash, replacesCsrfHash: first.csrfHash }));
      assert.equal(await read(first.tokenHash), null); assert.ok(await read(last.tokenHash));
      assert.equal(Number((await h.admin.query("SELECT count(*) AS n FROM erudior_private.device_sessions WHERE body->>'status'='active'")).rows[0]!.n), 32);
    });
    await t.test('provider configuration changes invalidate existing credential use without trusting prior decisions', async () => {
      await reset(); const a = await signIn(); assert.ok(await read(a.tokenHash));
      providers = providers.map(p => p.id === 'personal' ? { ...p, configurationHash: hash('rotated-policy') } : p);
      assert.equal(await store.getSession(a.tokenHash), null); assert.equal(await read(a.tokenHash), null);
    });
  } finally { await h.close(); }
});

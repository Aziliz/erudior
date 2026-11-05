import assert from 'node:assert/strict';
import { createHash, randomBytes } from 'node:crypto';
import { test } from 'node:test';
import { setTimeout as delay } from 'node:timers/promises';
import { ACCOUNT_POLICY } from '../src/model.ts';
import { PostgresAccountStore, type StoreProviderPolicy } from '../src/store.ts';
import { accountFixture, accountFixtureIds as ids } from './fixtures.mts';
import { createPostgresHarness } from './postgres-harness.mts';

const hash = (value: string) => createHash('sha256').update(value).digest('hex');
const credentials = () => ({ tokenHash: hash(randomBytes(32).toString('hex')), csrfHash: hash(randomBytes(32).toString('hex')) });
const now = () => Math.floor(Date.now() / 1000);

await test('private owned-device management on real PostgreSQL', async t => {
  const h = await createPostgresHarness();
  const personal: StoreProviderPolicy = { id: 'personal', version: 1, configurationHash: hash('device-personal'), issuer: 'https://personal.example', trust: 'personal', schoolId: null };
  const school: StoreProviderPolicy = { id: 'school', version: 1, configurationHash: hash('device-school'), issuer: 'https://school.example', trust: 'school', schoolId: ids.school };
  let providers = [personal, school];
  const options = { providers: () => providers, devices: true };
  const store = new PostgresAccountStore(h.runtime, options);
  const reset = async () => {
    providers = [personal, school];
    await h.admin.query('TRUNCATE erudior_private.record_exports, erudior_private.record_payloads, erudior_private.device_sessions, erudior_private.authority_graph');
    const graph = accountFixture(now()); graph.sessions = [];
    return h.seed(graph);
  };
  const signIn = async (kind: 'personal' | 'other' | 'school' = 'personal', age = 10, assurance: 'mfa' | 'single-factor' = 'mfa') => {
    const secret = credentials(), provider = kind === 'school' ? school : personal;
    const session = await store.establishSession({ ...secret, configurationHash: provider.configurationHash,
      workspaceId: kind === 'school' ? ids.school : kind === 'other' ? ids.otherPersonal : ids.personal,
      identity: { providerId: provider.id, providerVersion: provider.version, configurationHash: provider.configurationHash, issuer: provider.issuer,
        subject: kind === 'school' ? 'synthetic-staff' : kind === 'other' ? 'synthetic-other' : 'synthetic-person', authenticatedAt: now() - age, assurance } });
    assert.ok(session);
    return { ...secret, id: session.session.id };
  };
  try {
    await reset(); await store.ready();
    await t.test('explicit opt-in is required for reads and revocations', async () => {
      const actor = await signIn();
      const disabled = new PostgresAccountStore(h.runtime, { providers: options.providers });
      assert.equal(await disabled.listDeviceSessions(actor.tokenHash), null);
      assert.equal(await disabled.revokeDeviceSessions(actor), null);
      assert.ok(await store.getSession(actor.tokenHash));
    });
    await t.test('only minimal owned session metadata is returned, including the current session', async () => {
      await reset(); const actor = await signIn(), sibling = await signIn(), foreign = await signIn('other');
      const list = await store.listDeviceSessions(actor.tokenHash); assert.ok(list);
      assert.deepEqual(new Set(list.map(s => s.id)), new Set([actor.id, sibling.id]));
      for (const summary of list) {
        assert.deepEqual(Object.keys(summary).sort(), ['current', 'expiresAt', 'id', 'issuedAt', 'lastUsedAt']);
        assert.equal(summary.current, summary.id === actor.id);
        assert.ok(Number.isSafeInteger(summary.issuedAt) && Number.isSafeInteger(summary.lastUsedAt) && summary.expiresAt > summary.issuedAt);
      }
      assert.ok(!JSON.stringify(list).includes(actor.tokenHash));
      assert.ok(!JSON.stringify(list).includes(actor.csrfHash));
      assert.ok(!JSON.stringify(list).includes(foreign.id));
      // Transaction-local authorization must not leak into pooled connections.
      assert.equal((await h.runtime.query('SELECT session_id FROM erudior_private.device_sessions')).rowCount, 0);
    });
    await t.test('foreign or unknown targets and wrong CSRF fail without revoking anything', async () => {
      await reset(); const actor = await signIn(), sibling = await signIn(), foreign = await signIn('other');
      assert.equal(await store.revokeDeviceSessions({ ...actor, sessionId: foreign.id }), null);
      assert.equal(await store.revokeDeviceSessions({ ...actor, sessionId: 'session_missing____________________' }), null);
      assert.equal(await store.revokeDeviceSessions({ ...actor, csrfHash: hash('wrong'), sessionId: sibling.id }), null);
      for (const session of [actor, sibling, foreign]) assert.ok(await store.getSession(session.tokenHash));
    });
    await t.test('selected revocation persists across restart and leaves other sessions working', async () => {
      await reset(); const actor = await signIn(), sibling = await signIn(), foreign = await signIn('other');
      assert.deepEqual(await store.revokeDeviceSessions({ ...actor, sessionId: sibling.id }), { revoked: 1, currentRevoked: false });
      const restarted = new PostgresAccountStore(h.runtime, options);
      assert.equal(await restarted.getSession(sibling.tokenHash), null);
      assert.ok(await restarted.getSession(actor.tokenHash)); assert.ok(await restarted.getSession(foreign.tokenHash));
      const row = (await h.admin.query('SELECT body FROM erudior_private.device_sessions WHERE session_id=$1', [sibling.id])).rows[0];
      assert.equal(row.body.status, 'revoked'); assert.equal(row.body.version, 2);
    });
    await t.test('self and all-device revocation report current-session invalidation', async () => {
      await reset(); const actor = await signIn(), sibling = await signIn(), foreign = await signIn('other');
      const schoolSession = await signIn('school');
      assert.deepEqual(await store.revokeDeviceSessions({ ...actor, sessionId: actor.id }), { revoked: 1, currentRevoked: true });
      assert.equal(await store.getSession(actor.tokenHash), null);
      const third = await signIn();
      assert.deepEqual(await store.revokeDeviceSessions(sibling), { revoked: 3, currentRevoked: true });
      assert.equal(await store.getSession(sibling.tokenHash), null); assert.equal(await store.getSession(third.tokenHash), null);
      assert.equal(await store.getSession(schoolSession.tokenHash), null);
      assert.ok(await store.getSession(foreign.tokenHash));
    });
    await t.test('school authentication, weak assurance, and stale authentication cannot manage devices', async () => {
      await reset(); const schoolActor = await signIn('school'), weak = await signIn('personal', 10, 'single-factor');
      const stale = await signIn('personal', ACCOUNT_POLICY.sensitiveAuthenticationAgeSeconds + 1), fresh = await signIn();
      for (const actor of [schoolActor, weak, stale]) {
        assert.equal(await store.listDeviceSessions(actor.tokenHash), null);
        assert.equal(await store.revokeDeviceSessions({ ...actor, sessionId: fresh.id }), null);
      }
      assert.ok(await store.getSession(fresh.tokenHash));
    });
    await t.test('current provider and account authority are rechecked', async () => {
      const graph = await reset(); const actor = await signIn(), target = await signIn();
      providers = [{ ...personal, version: 2 }, school];
      assert.equal(await store.listDeviceSessions(actor.tokenHash), null);
      assert.equal(await store.revokeDeviceSessions({ ...actor, sessionId: target.id }), null);
      providers = [personal, school];
      const account = graph.accounts.find(a => a.id === ids.adult)!; account.version++; account.status = 'suspended';
      await h.replaceGraph(graph);
      assert.equal(await store.listDeviceSessions(actor.tokenHash), null);
      assert.equal(await store.revokeDeviceSessions({ ...actor, sessionId: target.id }), null);
      assert.equal((await h.admin.query('SELECT body->>\'status\' AS status FROM erudior_private.device_sessions WHERE session_id=$1', [target.id])).rows[0].status, 'active');
    });
    await t.test('expired or idle sessions do not appear as active devices', async () => {
      await reset(); const actor = await signIn(), idle = await signIn();
      await h.admin.query('UPDATE erudior_private.device_sessions SET last_used_at=$1 WHERE session_id=$2', [now() - 5000, idle.id]);
      const list = await store.listDeviceSessions(actor.tokenHash); assert.ok(list);
      assert.deepEqual(list.map(s => s.id), [actor.id]);
    });
    await t.test('concurrent all-device revocations serialize without a deadlock or surviving authority', async () => {
      await reset(); const a = await signIn(), b = await signIn();
      const outcomes = await Promise.all([store.revokeDeviceSessions(a), store.revokeDeviceSessions(b)]);
      assert.equal(outcomes.filter(Boolean).length, 1);
      assert.deepEqual(outcomes.find(Boolean), { revoked: 2, currentRevoked: true });
      assert.equal(await store.getSession(a.tokenHash), null); assert.equal(await store.getSession(b.tokenHash), null);
    });
    await t.test('fresh-auth expiry during a target lock wait rolls back every revocation', async () => {
      await reset(); const actor = await signIn('personal', ACCOUNT_POLICY.sensitiveAuthenticationAgeSeconds - 3), target = await signIn();
      const actorRow = (await h.admin.query('SELECT body FROM erudior_private.device_sessions WHERE session_id=$1', [actor.id])).rows[0];
      const expires = actorRow.body.authentication.authenticatedAt + ACCOUNT_POLICY.sensitiveAuthenticationAgeSeconds;
      const lock = await h.admin.connect();
      try {
        await lock.query('BEGIN');
        await lock.query('SELECT session_id FROM erudior_private.device_sessions WHERE session_id=$1 FOR UPDATE', [target.id]);
        const pending = store.revokeDeviceSessions({ ...actor, sessionId: target.id });
        let waiting = false;
        for (let attempt = 0; attempt < 100; attempt++) {
          const result = await h.admin.query("SELECT EXISTS(SELECT FROM pg_stat_activity WHERE datname=$1 AND usename=$2 AND wait_event_type='Lock' AND query LIKE '%ORDER BY session_id FOR UPDATE%') AS blocked", [h.databaseName, h.runtimeRole]);
          if (result.rows[0].blocked) { waiting = true; break; }
          await delay(20);
        }
        assert.equal(waiting, true, 'revocation reached the target row lock');
        while (now() < expires) await delay(25);
        await lock.query('COMMIT');
        assert.equal(await pending, null);
        assert.ok(await store.getSession(actor.tokenHash)); assert.ok(await store.getSession(target.tokenHash));
      } finally { await lock.query('ROLLBACK'); lock.release(); }
    });
    await t.test('unscoped runtime cannot enumerate or revoke device rows', async () => {
      await reset(); const actor = await signIn();
      assert.equal((await h.runtime.query('SELECT session_id FROM erudior_private.device_sessions')).rowCount, 0);
      assert.equal((await h.runtime.query("UPDATE erudior_private.device_sessions SET body=jsonb_set(body, '{status}', '\"revoked\"')")).rowCount, 0);
      assert.ok(await store.getSession(actor.tokenHash));
    });
  } finally { await h.close(); }
});

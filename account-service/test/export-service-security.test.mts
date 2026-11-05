import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import test from 'node:test';
import { createPrivateAccountHandler, PRIVATE_ACCOUNT_LOGIN_COOKIE, PRIVATE_ACCOUNT_SESSION_COOKIE, type PrivateAccountAuditEvent } from '../src/http.ts';
import { createOidcClient } from '../src/oidc.ts';
import { PostgresAccountStore, type RecordExportStatus } from '../src/store.ts';
import { accountFixture, accountFixtureIds as ids } from './fixtures.mts';
import { createPostgresHarness } from './postgres-harness.mts';
import { createSyntheticOidcProvider } from './oidc-fixture.mts';

const origin = 'https://private.erudior.test';
interface Browser { cookie: string; csrfToken: string }
function request(path: string, browser?: Browser, body?: unknown, extra: Record<string, string> = {}): Request {
  const headers = new Headers({ 'X-Erudior-Request': '1', 'Sec-Fetch-Site': 'same-origin', ...extra });
  if (browser) { headers.set('Cookie', browser.cookie); headers.set('X-Erudior-CSRF', browser.csrfToken); }
  if (body !== undefined) { headers.set('Origin', origin); headers.set('Content-Type', 'application/json'); }
  return new Request(origin + path, { method: body === undefined ? 'GET' : 'POST', headers, ...(body !== undefined ? { body: JSON.stringify(body) } : {}) });
}
function cookie(response: Response, name: string): string {
  const values = response.headers.getSetCookie().filter(value => value.startsWith(name + '='));
  assert.equal(values.length, 1);
  return values[0].split(';')[0];
}
function privateResponse(response: Response, status: number): void {
  assert.equal(response.status, status);
  assert.equal(response.headers.get('cache-control'), 'no-store, max-age=0');
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
  assert.equal(response.headers.get('access-control-allow-origin'), null);
  assert.equal(response.headers.get('referrer-policy'), 'no-referrer');
}
async function denied(response: Response, status = 404): Promise<void> {
  privateResponse(response, status);
  assert.deepEqual(await response.json(), { error: status === 401 ? 'authentication_required' : 'not_found' });
}

await test('private exports through signed synthetic OIDC, HTTP and real PostgreSQL', async suite => {
  const database = await createPostgresHarness();
  suite.after(() => database.close());
  const provider = await createSyntheticOidcProvider({ id: 'export-personal' });
  suite.after(() => provider.close());
  const client = createOidcClient(provider.config, { transport: provider.transport });
  const policies = [{ id: client.providerId, version: client.providerVersion, configurationHash: client.configurationHash, issuer: provider.config.issuer, trust: 'personal' as const, schoolId: null }];
  const store = new PostgresAccountStore(database.runtime, { providers: () => policies, exports: { artifactTtlSeconds: 600 } });
  await store.ready();
  const audit: PrivateAccountAuditEvent[] = [];
  const handle = createPrivateAccountHandler({ origin, returnPath: '/account', providers: [client], store, exports: store, csrfKey: randomBytes(32), audit: entry => audit.push(entry) });
  let graph = accountFixture(Math.floor(Date.now() / 1000));
  graph.sessions = [];
  for (const identity of graph.identities) if (identity.trust === 'personal') identity.issuer = provider.config.issuer;
  graph = await database.seed(graph, Object.fromEntries(graph.records.map(record => [record.id, { synthetic: true, key: record.id }])));

  async function login(): Promise<Browser> {
    const begun = await handle(request('/v1/auth/start', undefined, { providerId: provider.config.id, workspaceId: ids.personal }));
    privateResponse(begun, 200);
    const start = await begun.json() as { authorizationUrl: string };
    const callback = await provider.authorize(start.authorizationUrl, { subject: 'synthetic-person' });
    const completed = await handle(new Request(callback, { headers: { Cookie: cookie(begun, PRIVATE_ACCOUNT_LOGIN_COOKIE), 'Sec-Fetch-Site': 'cross-site' } }));
    privateResponse(completed, 303);
    const value = cookie(completed, PRIVATE_ACCOUNT_SESSION_COOKIE);
    const session = await handle(request('/v1/session', { cookie: value, csrfToken: '' }));
    privateResponse(session, 200);
    const current = await session.json() as { csrfToken: string };
    return { cookie: value, csrfToken: current.csrfToken };
  }
  const selection = { workspaceId: ids.personal, records: [{ id: ids.personalRecord, version: 1 }], requestId: 'http-export-retry-' + '1'.repeat(24) };
  const first = await login(), second = await login();
  let exported: RecordExportStatus;
  await suite.test('create, exact retry, metadata and download share a durable private artifact', async () => {
    const created = await handle(request('/v1/exports', first, selection));
    privateResponse(created, 200);
    exported = (await created.json() as { export: RecordExportStatus }).export;
    assert.equal(exported.state, 'ready'); assert.equal(exported.recordCount, 1);
    assert.equal(exported.workspaceId, ids.personal);
    const retry = await handle(request('/v1/exports', first, selection));
    privateResponse(retry, 200);
    assert.deepEqual(await retry.json(), { export: exported });
    assert.equal((await database.admin.query('SELECT count(*) FROM erudior_private.record_exports')).rows[0].count, '1');
    const metadata = await handle(request('/v1/exports/' + exported.id, first));
    privateResponse(metadata, 200);
    assert.deepEqual(await metadata.json(), { export: exported });
    const download = await handle(request('/v1/exports/' + exported.id + '/download', first));
    privateResponse(download, 200);
    assert.equal(download.headers.get('content-disposition'), 'attachment; filename="erudior-record-export.json"');
    assert.equal(download.headers.get('content-type'), 'application/json; charset=utf-8');
    assert.equal(download.headers.get('location'), null);
    assert.deepEqual(await download.json(), { format: 'erudior-record-export-v1', workspaceId: ids.personal, records: [{ id: ids.personalRecord, version: 1, category: 'practice', visibility: 'released', payload: { synthetic: true, key: ids.personalRecord } }] });
    assert.deepEqual((await database.runtime.query('SELECT export_id FROM erudior_private.record_exports')).rows, [], 'RLS scope does not survive pool return');
  });
  await suite.test('another authenticated session cannot retrieve or cancel an artifact', async () => {
    for (const suffix of ['', '/download']) await denied(await handle(request('/v1/exports/' + exported.id + suffix, second)));
    await denied(await handle(request('/v1/exports/' + exported.id + '/cancel', second, {})));
    await denied(await handle(request('/v1/exports/' + 'missing_' + '1'.repeat(32), first)));
    await denied(await handle(request('/v1/exports', first, { ...selection, records: [{ id: ids.familyRecord, version: 1 }] })));
    await denied(await handle(request('/v1/exports', first, { ...selection, records: [{ id: ids.personalRecord, version: 2 }] })));
  });
  await suite.test('cancel is durable and idempotent; retry never resurrects the artifact', async () => {
    for (let attempt = 0; attempt < 2; attempt++) {
      const cancelled = await handle(request('/v1/exports/' + exported.id + '/cancel', first, {}));
      privateResponse(cancelled, 200);
      assert.equal((await cancelled.json() as { export: RecordExportStatus }).export.state, 'cancelled');
    }
    const retry = await handle(request('/v1/exports', first, selection));
    privateResponse(retry, 200);
    assert.equal((await retry.json() as { export: RecordExportStatus }).export.state, 'cancelled');
    await denied(await handle(request('/v1/exports/' + exported.id + '/download', first)));
    assert.equal((await database.admin.query('SELECT artifact FROM erudior_private.record_exports WHERE export_id=$1', [exported.id])).rows[0].artifact, null);
  });
  await suite.test('withdrawn record authority blocks access while the same session may dispose of bytes', async () => {
    const selection2 = { ...selection, requestId: 'http-export-revoke-' + '2'.repeat(24) };
    const created = await handle(request('/v1/exports', first, selection2));
    privateResponse(created, 200);
    const result = (await created.json() as { export: RecordExportStatus }).export;
    const authority = graph.authorities.find(value => value.id === ids.personalAuthority)!;
    authority.version++; authority.status = 'withdrawn';
    graph = await database.replaceGraph(graph);
    for (const suffix of ['', '/download']) await denied(await handle(request('/v1/exports/' + result.id + suffix, first)));
    await denied(await handle(request('/v1/exports', first, selection2)));
    // Disposal is intentionally allowed to the original current session with
    // CSRF even after source authority is revoked. It does not return bytes.
    const disposed = await handle(request('/v1/exports/' + result.id + '/cancel', first, {}));
    privateResponse(disposed, 200);
    assert.equal((await disposed.json() as { export: RecordExportStatus }).export.state, 'cancelled');
    assert.equal((await database.admin.query('SELECT artifact FROM erudior_private.record_exports WHERE export_id=$1', [result.id])).rows[0].artifact, null);
    assert.equal((await handle(request('/v1/session', first))).status, 200, 'record authority denial does not rely on a missing login');
  });
  await suite.test('audit events do not contain records, cookies or provider claims', async () => {
    const encoded = JSON.stringify(audit);
    assert.ok(audit.some(event => event.operation === 'export.download'));
    for (const event of audit) assert.deepEqual(Object.keys(event).sort(), ['operation', 'outcome', 'requestId']);
    for (const secret of [ids.personalRecord, ids.personal, exported.id, first.cookie, first.csrfToken, 'synthetic-person', 'payload', provider.config.clientSecret]) assert.equal(encoded.includes(secret), false);
    assert.equal(provider.stats.outsideRequests, 0);
  });
});

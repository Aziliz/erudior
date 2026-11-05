import assert from 'node:assert/strict';
import { createHash, createHmac } from 'node:crypto';
import { createPrivateAccountHandler, PRIVATE_ACCOUNT_SESSION_COOKIE, type PrivateAccountAuditEvent, type PrivateAccountStore, type PrivateAccountExportStore } from '../src/http.ts';
import { createOidcClient } from '../src/oidc.ts';
import { accountFixture, accountFixtureIds as ids } from './fixtures.mts';

// Synthetic transport contract only. Durable authorization/races are exercised
// separately against PostgreSQL; this fake is not an authorization implementation.
const origin = 'https://app.example.test', raw = 'a'.repeat(43), csrfKey = new Uint8Array(32).fill(9);
const hash = (value: string) => createHash('sha256').update(value).digest('hex');
const csrf = createHmac('sha256', csrfKey).update(`erudior-private-account-csrf:v1:${raw}`).digest('base64url');
const provider = createOidcClient({
  id: 'personal-provider', version: 1, issuer: 'https://identity.example.test',
  authorizationEndpoint: 'https://identity.example.test/authorize', tokenEndpoint: 'https://identity.example.test/token',
  jwksUri: 'https://identity.example.test/jwks', clientId: 'synthetic-private-client',
  clientSecret: 'synthetic-server-secret-for-transport-tests-only',
  redirectUri: origin + '/v1/auth/callback/personal-provider', signingAlgorithm: 'RS256', mfaAcrValues: ['synthetic-mfa'],
});
const fixture = accountFixture();
let sessionValid = true, permitted = true, fail = false, calls = 0;
const unexpected = async (): Promise<never> => { throw new Error('Unexpected store operation'); };
const store: PrivateAccountStore = {
  beginLogin: unexpected, consumeLogin: unexpected, establishSession: unexpected, switchContext: unexpected,
  revokeSession: unexpected, readRecord: unexpected,
  getSession: async tokenHash => tokenHash === hash(raw) && sessionValid ? {
    session: fixture.sessions[0], csrfHash: hash(csrf), availableContexts: [{ workspaceId: ids.personal, kind: 'personal' }],
  } : null,
};
const status = { id: 'export_' + '1'.repeat(48), workspaceId: ids.personal, state: 'ready' as 'ready' | 'cancelled' | 'expired', createdAt: 1800000000, expiresAt: 1800000600, recordCount: 1 };
const payload = { content: 'synthetic-private-content' };
const artifact = { format: 'erudior-record-export-v1' as const, workspaceId: ids.personal, records: [{ id: ids.personalRecord, version: 1, category: 'practice' as const, visibility: 'private' as const, payload }] };
const body = { workspaceId: ids.personal, records: [{ id: ids.personalRecord, version: 1 }], requestId: 'retry_' + '2'.repeat(32) };
function available(tokenHash: string, exportId: string): boolean {
  calls++;
  assert.equal(tokenHash, hash(raw));
  if (fail) throw new Error('secret-database-connection provider-subject');
  return permitted && exportId === status.id;
}
const exports: PrivateAccountExportStore = {
  requestRecordExport: async (tokenHash, csrfHash, input) => {
    const allowed = available(tokenHash, status.id);
    assert.equal(csrfHash, hash(csrf));
    assert.deepEqual(input, body);
    return allowed ? { ...status } : null;
  },
  getRecordExport: async (tokenHash, exportId) => available(tokenHash, exportId) ? { ...status } : null,
  downloadRecordExport: async (tokenHash, exportId) => available(tokenHash, exportId) && status.state === 'ready' ? { export: { ...status }, artifact } : null,
  cancelRecordExport: async (tokenHash, csrfHash, exportId) => {
    assert.equal(csrfHash, hash(csrf));
    if (!available(tokenHash, exportId)) return null;
    status.state = 'cancelled';
    return { ...status };
  },
};
const audit: PrivateAccountAuditEvent[] = [];
const config = { origin, returnPath: '/account', providers: [provider], store, csrfKey, audit: (event: PrivateAccountAuditEvent) => audit.push(event) };
const handler = createPrivateAccountHandler({ ...config, exports });
const headers = { Origin: origin, 'X-Erudior-Request': '1', 'X-Erudior-CSRF': csrf, Cookie: `${PRIVATE_ACCOUNT_SESSION_COOKIE}=${raw}`, 'Content-Type': 'application/json' };
let cases = 0;
async function send(path: string, expected: number, data?: unknown, overrides: Record<string, string | null> = {}, method = data === undefined ? 'GET' : 'POST', active = handler): Promise<Response> {
  const h = new Headers(headers);
  for (const [name, value] of Object.entries(overrides)) value === null ? h.delete(name) : h.set(name, value);
  const response = await active(new Request(origin + path, { method, headers: h, ...(data !== undefined ? { body: JSON.stringify(data) } : {}) }));
  assert.equal(response.status, expected, path);
  assert.equal(response.headers.get('cache-control'), 'no-store, max-age=0');
  assert.equal(response.headers.get('referrer-policy'), 'no-referrer');
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
  assert.equal(response.headers.get('access-control-allow-origin'), null);
  assert.equal(response.headers.get('location'), null);
  cases++;
  return response;
}
const base = '/v1/exports', item = base + '/' + status.id;
const disabled = createPrivateAccountHandler(config);
for (const [path, data] of [[base, body], [item, undefined], [item + '/download', undefined], [item + '/cancel', {}]] as const) {
  await send(path, 404, data, {}, data === undefined ? 'GET' : 'POST', disabled);
}
assert.equal(calls, 0);
await send(item, 404, {}, {}, 'POST', disabled);
await send(base + '/short', 404, undefined, {}, 'GET', disabled);
for (const overrides of ([{ Origin: 'https://evil.example' }, { Origin: 'null' }, { Origin: null }, { 'X-Erudior-Request': null }, { 'Sec-Fetch-Site': 'same-site' }, { 'X-Erudior-CSRF': null }, { 'X-Erudior-CSRF': 'b'.repeat(43) }] as Record<string, string | null>[])) await send(base, 403, body, overrides);
await send(base, 401, body, { Cookie: null });
await send(base, 400, body, { Cookie: headers.Cookie + '; ' + headers.Cookie });
await send(base, 400, body, { Authorization: 'Bearer private-token' });
await send(base, 400, body, { 'X-HTTP-Method-Override': 'GET' });
await send(base, 400, body, { 'Content-Encoding': 'gzip' });
await send(base, 400, body, { 'Content-Type': 'text/plain' });
await send(base, 400, body, { 'Content-Length': '9999' });
await send(base + '?token=private-token', 400, body);
await send(base + '/' + 'x'.repeat(8192), 400);
await send(base, 405);
await send(item + '/download', 405, {});
await send(base, 400, { ...body, authority: fixture });
await send(base, 400, { ...body, ttl: 9999 });
await send(base, 400, { ...body, records: [] });
await send(base, 400, { ...body, records: 'all' });
await send(base, 400, { ...body, records: [body.records[0], body.records[0]] });
await send(base, 400, { ...body, records: [body.records[0], { ...body.records[0], version: 2 }] });
await send(base, 400, { ...body, records: [{ ...body.records[0], payload }] });
for (const version of [0, -1, 1.5, Number.MAX_SAFE_INTEGER + 1, '1', null]) await send(base, 400, { ...body, records: [{ id: ids.personalRecord, version }] });
await send(base, 400, { ...body, records: Array.from({ length: 33 }, (_, n) => ({ id: 'record_' + String(n).padStart(20, '0'), version: 1 })) });
await send(base, 400, { ...body, requestId: 'x' });
await send(base, 400, { ...body, workspaceId: 'x' });
await send(base, 400, { ...body, requestId: 'x'.repeat(4100) });
await send(item + '/cancel', 400, { authority: fixture });
await send(base + '/short', 400);
assert.equal(calls, 0, 'malformed transport must not invoke export capabilities');
assert.deepEqual(await (await send(base, 200, body)).json(), { export: status });
assert.deepEqual(await (await send(base, 200, body)).json(), { export: status }, 'idempotency request remains unchanged');
const metadata = await (await send(item, 200)).text();
assert.doesNotMatch(metadata, /synthetic-private-content|payload|provider|csrf/);
const download = await send(item + '/download', 200);
assert.equal(download.headers.get('content-disposition'), 'attachment; filename="erudior-record-export.json"');
assert.equal(download.headers.get('content-type'), 'application/json; charset=utf-8');
assert.deepEqual(await download.json(), artifact);
await send(item, 403, undefined, { Origin: 'https://evil.example' });
await send(item + '/download', 403, undefined, { 'X-Erudior-Request': null });
await send(item + '/cancel', 403, {}, { 'X-Erudior-CSRF': null });
assert.deepEqual(await (await send(item + '/cancel', 200, {})).json(), { export: status });
assert.equal(status.state, 'cancelled');
await send(item + '/cancel', 200, {});
await send(item, 200);
await send(item + '/download', 404);
status.state = 'expired';
assert.deepEqual(await (await send(item, 200)).json(), { export: status });
await send(item + '/download', 404);
permitted = false;
for (const path of [item, item + '/download', base + '/' + 'foreign_' + '3'.repeat(32)]) {
  assert.deepEqual(await (await send(path, 404)).json(), { error: 'not_found' });
}
await send(base, 404, body);
await send(item + '/cancel', 404, {});
sessionValid = false;
await send(item + '/download', 401);
sessionValid = true; permitted = true; fail = true;
const unavailable = await send(item, 503);
assert.deepEqual(await unavailable.json(), { error: 'service_unavailable' });
assert.ok(audit.every(event => Object.keys(event).sort().join(',') === 'operation,outcome,requestId'));
assert.doesNotMatch(JSON.stringify(audit), /synthetic-private|private-token|provider-subject|secret-database|retry_|export_|workspaceId|payload/);
assert.ok(audit.some(event => event.operation === 'export.download'));
console.log(`Private export HTTP: ${cases} synthetic contract/security cases passed.`);

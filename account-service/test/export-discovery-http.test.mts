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

const inventory = [{ id: ids.personalRecord, version: 1, category: 'practice' as const, visibility: 'private' as const }];
exports.listExportableRecords = async (tokenHash, input) => {
  assert.equal(tokenHash, hash(raw)); calls++;
  if (fail) throw new Error('private database secret');
  assert.deepEqual(input, { workspaceId: ids.personal, limit: 1 });
  return permitted ? { records: inventory, nextCursor: null } : null;
};
exports.listRecordExports = async (tokenHash, input) => {
  assert.equal(tokenHash, hash(raw)); calls++;
  assert.deepEqual(input, { workspaceId: ids.personal, limit: 1 });
  return permitted ? { exports: [status], nextCursor: null } : null;
};
const enabled = createPrivateAccountHandler({ ...config, exports });
const query = '?workspaceId=' + ids.personal + '&limit=1';
for (const path of ['/v1/exports/records', '/v1/exports']) {
  const result = await send(path + query, 200, undefined, {}, 'GET', enabled);
  assert.deepEqual(await result.json(), path.endsWith('/records') ? { records: inventory, nextCursor: null } : { exports: [status], nextCursor: null });
  const before = calls;
  for (const suffix of ['', '?workspaceId=short', query + '&limit=2', query + '&payload=true', query + '&cursor=bad', '?workspaceId=' + ids.personal + '&limit=33', '?workspaceId=' + ids.personal + '&limit=01']) await send(path + suffix, 400, undefined, {}, 'GET', enabled);
  await send(path + query, 403, undefined, { Origin: 'https://evil.test' }, 'GET', enabled);
  await send(path + query, 403, undefined, { 'X-Erudior-Request': null }, 'GET', enabled);
  await send(path + query, 401, undefined, { Cookie: null }, 'GET', enabled);
  assert.equal(calls, before);
  permitted = false; await send(path + query, 404, undefined, {}, 'GET', enabled); permitted = true;
}
fail = true; await send('/v1/exports/records' + query, 503, undefined, {}, 'GET', enabled); fail = false;
const disabled = createPrivateAccountHandler(config);
await send('/v1/exports/records', 404, undefined, {}, 'GET', disabled);
await send('/v1/exports', 404, undefined, {}, 'GET', disabled);
console.log(`Private export discovery HTTP: ${cases} cases passed.`);

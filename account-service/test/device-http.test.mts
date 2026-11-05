import assert from 'node:assert/strict';
import { createHash, createHmac } from 'node:crypto';
import { createPrivateAccountHandler, PRIVATE_ACCOUNT_SESSION_COOKIE, type PrivateAccountAuditEvent, type PrivateAccountStore, type PrivateAccountDeviceStore } from '../src/http.ts';
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
const devices = [{ id: 'session_' + '1'.repeat(48), current: true, issuedAt: 1800000000, lastUsedAt: 1800000300, expiresAt: 1800000600 }];
let requested: string | undefined;
const deviceStore: PrivateAccountDeviceStore = {
  listDeviceSessions: async tokenHash => {
    calls++;
    assert.equal(tokenHash, hash(raw));
    if (fail) throw new Error('secret-database provider-subject');
    return permitted ? devices : null;
  },
  revokeDeviceSessions: async input => {
    calls++;
    assert.equal(input.tokenHash, hash(raw));
    assert.equal(input.csrfHash, hash(csrf));
    requested = input.sessionId;
    if (fail) throw new Error('secret-database provider-subject');
    return permitted ? { revoked: 1, currentRevoked: !input.sessionId || input.sessionId === devices[0].id } : null;
  },
};
const audit: PrivateAccountAuditEvent[] = [];
const config = { origin, returnPath: '/account', providers: [provider], store, csrfKey, audit: (event: PrivateAccountAuditEvent) => audit.push(event) };
const handler = createPrivateAccountHandler({ ...config, devices: deviceStore });
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
const base = '/v1/devices', revoke = base + '/revoke';
const disabled = createPrivateAccountHandler(config);
await send(base, 404, undefined, {}, 'GET', disabled);
await send(revoke, 404, {}, {}, 'POST', disabled);
assert.equal(calls, 0);
await send(base, 405, {});
await send(revoke, 405);
for (const overrides of ([{ Origin: 'https://evil.example' }, { Origin: 'null' }, { Origin: null }, { 'X-Erudior-Request': null }, { 'Sec-Fetch-Site': 'same-site' }, { 'X-Erudior-CSRF': null }, { 'X-Erudior-CSRF': 'b'.repeat(43) }] as Record<string, string | null>[])) await send(revoke, 403, {}, overrides);
await send(base, 403, undefined, { Origin: 'https://evil.example' });
await send(base, 403, undefined, { 'X-Erudior-Request': null });
await send(revoke, 401, {}, { Cookie: null });
await send(revoke, 400, {}, { Cookie: headers.Cookie + '; ' + headers.Cookie });
await send(revoke, 400, {}, { Authorization: 'Bearer private-token' });
await send(revoke, 400, {}, { 'X-HTTP-Method-Override': 'GET' });
await send(revoke, 400, {}, { 'Content-Encoding': 'gzip' });
await send(revoke, 400, {}, { 'Content-Type': 'text/plain' });
await send(revoke, 400, {}, { 'Content-Length': '9999' });
await send(base + '?token=private-token', 400);
await send(revoke, 400, { accountId: ids.personal });
await send(revoke, 400, { all: true });
for (const sessionId of [null, 0, [], {}, '', 'short', 'x'.repeat(4100)]) await send(revoke, 400, { sessionId });
assert.equal(calls, 0, 'malformed requests must not invoke device capabilities');
assert.deepEqual(await (await send(base, 200)).json(), { devices });
const listed = await (await send(base, 200)).text();
assert.doesNotMatch(listed, /token|csrf|provider|subject|workspace|principal/);
let result = await send(revoke, 200, { sessionId: 'session_' + '2'.repeat(48) });
assert.equal(requested, 'session_' + '2'.repeat(48));
assert.deepEqual(await result.json(), { revoked: 1, currentRevoked: false });
assert.equal(result.headers.get('set-cookie'), null);
result = await send(revoke, 200, { sessionId: devices[0].id });
assert.equal(requested, devices[0].id);
assert.deepEqual(await result.json(), { revoked: 1, currentRevoked: true });
assert.match(result.headers.get('set-cookie')!, /__Host-erudior-account=; Path=\/; Max-Age=0; Secure; HttpOnly; SameSite=Strict/);
result = await send(revoke, 200, {});
assert.equal(requested, undefined);
assert.deepEqual(await result.json(), { revoked: 1, currentRevoked: true });
assert.match(result.headers.get('set-cookie')!, /Max-Age=0/);
permitted = false;
assert.deepEqual(await (await send(base, 404)).json(), { error: 'not_found' });
assert.deepEqual(await (await send(revoke, 404, { sessionId: 'foreign_' + '3'.repeat(32) })).json(), { error: 'not_found' });
await send(revoke, 404, {});
sessionValid = false;
await send(base, 401);
await send(revoke, 401, {});
sessionValid = true; permitted = true; fail = true;
assert.deepEqual(await (await send(base, 503)).json(), { error: 'service_unavailable' });
assert.deepEqual(await (await send(revoke, 503, {})).json(), { error: 'service_unavailable' });
assert.ok(audit.every(event => Object.keys(event).sort().join(',') === 'operation,outcome,requestId'));
assert.doesNotMatch(JSON.stringify(audit), /private-token|provider-subject|secret-database|session_|accountId/);
assert.ok(audit.some(event => event.operation === 'devices.list'));
assert.ok(audit.some(event => event.operation === 'devices.revoke'));
console.log(`Private device HTTP: ${cases} synthetic contract/security cases passed.`);

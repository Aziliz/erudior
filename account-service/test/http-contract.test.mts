import assert from 'node:assert/strict';
import { createPrivateAccountHandler, PRIVATE_ACCOUNT_LOGIN_COOKIE, PRIVATE_ACCOUNT_SESSION_COOKIE, type PrivateAccountAuditEvent, type PrivateAccountStore } from '../src/http.ts';
import { createOidcClient } from '../src/oidc.ts';

// Transport rejection tests deliberately have no database or provider network.
// Successful authentication/access is covered separately against actual PostgreSQL.
const origin = 'https://app.example.test';
const provider = createOidcClient({
  id: 'personal-provider', version: 1, issuer: 'https://identity.example.test',
  authorizationEndpoint: 'https://identity.example.test/authorize', tokenEndpoint: 'https://identity.example.test/token',
  jwksUri: 'https://identity.example.test/jwks', clientId: 'synthetic-private-client',
  clientSecret: 'synthetic-server-secret-for-transport-tests-only',
  redirectUri: origin + '/v1/auth/callback/personal-provider', signingAlgorithm: 'RS256', mfaAcrValues: ['synthetic-mfa'],
});
let calls = 0;
const failure = async (): Promise<never> => { calls++; throw new Error('postgresql://private-user:do-not-disclose@private-host/internals provider-subject secret-token'); };
const store: PrivateAccountStore = { beginLogin: failure, consumeLogin: failure, establishSession: failure, getSession: failure, switchContext: failure, revokeSession: failure, readRecord: failure };
const audit: PrivateAccountAuditEvent[] = [];
const config = { origin, returnPath: '/account', providers: [provider], store, csrfKey: new Uint8Array(32).fill(7), audit: (entry: PrivateAccountAuditEvent) => audit.push(entry) };
const handler = createPrivateAccountHandler(config);
const headers = { Origin: origin, 'X-Erudior-Request': '1', 'Content-Type': 'application/json' };
let cases = 0;
async function reject(path: string, init: RequestInit, status: number): Promise<void> {
  const previous = calls;
  const response = await handler(new Request(origin + path, init));
  assert.equal(response.status, status, path);
  assert.equal(calls, previous, 'untrusted transport reached trusted store');
  assert.equal(response.headers.get('cache-control'), 'no-store, max-age=0');
  assert.equal(response.headers.get('referrer-policy'), 'no-referrer');
  assert.equal(response.headers.get('access-control-allow-origin'), null);
  const text = await response.text();
  assert.doesNotMatch(text, /private-user|private-host|secret-token|provider-subject/);
  cases++;
}
await reject('/v1/auth/start', { method: 'POST', headers: { ...headers, Origin: 'https://unrelated.example.test' }, body: '{"providerId":"personal-provider"}' }, 403);
await reject('/v1/auth/start', { method: 'POST', headers: { 'X-Erudior-Request': '1', 'Content-Type': 'application/json' }, body: '{"providerId":"personal-provider"}' }, 403);
await reject('/v1/auth/start', { method: 'POST', headers: { ...headers, Origin: 'null' }, body: '{"providerId":"personal-provider"}' }, 403);
await reject('/v1/auth/start', { method: 'POST', headers: { ...headers, 'Sec-Fetch-Site': 'same-site' }, body: '{"providerId":"personal-provider"}' }, 403);
await reject('/v1/auth/start', { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: '{"providerId":"personal-provider"}' }, 403);
await reject('/v1/auth/start', { method: 'POST', headers: { ...headers, 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'providerId=personal-provider' }, 400);
await reject('/v1/auth/start', { method: 'POST', headers, body: '{"providerId":"personal-provider","role":"administrator"}' }, 400);
await reject('/v1/auth/start', { method: 'POST', headers, body: '{"providerId":"personal-provider","workspaceId":"untrusted"}' }, 400);
await reject('/v1/auth/start', { method: 'POST', headers, body: '{"providerId":"missing-provider"}' }, 400);
await reject('/v1/auth/start', { method: 'POST', headers, body: 'x'.repeat(4097) }, 400);
await reject('/v1/auth/start', { method: 'POST', headers: { ...headers, 'Content-Length': '9' }, body: '{}' }, 400);
await reject('/v1/auth/start', { method: 'POST', headers: { ...headers, 'Content-Encoding': 'gzip' }, body: '{}' }, 400);
await reject('/v1/auth/start', { method: 'POST', headers, body: 'null' }, 400);
await reject('/v1/auth/start', { method: 'POST', headers, body: '["personal-provider"]' }, 400);
await reject('/v1/session', { headers: { 'X-Erudior-Request': '1', Authorization: 'Bearer secret-token' } }, 400);
await reject('/v1/session?token=secret-token', { headers: { 'X-Erudior-Request': '1' } }, 400);
await reject('/v1/session', { headers: { 'X-Erudior-Request': '1', Cookie: `${PRIVATE_ACCOUNT_SESSION_COOKIE}=${'a'.repeat(43)}; ${PRIVATE_ACCOUNT_SESSION_COOKIE}=${'b'.repeat(43)}` } }, 400);
await reject('/v1/session', { headers: { 'X-Erudior-Request': '1', Cookie: `${PRIVATE_ACCOUNT_SESSION_COOKIE}=%61` } }, 400);
await reject('/v1/session', {}, 403);
await reject('/v1/session', { headers: { 'X-Erudior-Request': '1' } }, 401);
await reject('/v1/session', { method: 'POST', headers, body: '{}' }, 405);
await reject('/v1/session', { headers: { 'X-HTTP-Method-Override': 'POST' } }, 400);
await reject('/v1/workspaces%2fanything/records/anything', {}, 400);
await reject('/v1/signup', { method: 'POST', headers, body: '{}' }, 404);
await reject('/v1/records', { method: 'PUT', headers, body: '{}' }, 404);
await reject('/v1/auth/callback/personal-provider?state=short&code=do-not-disclose', {}, 400);
await reject(`/v1/auth/callback/personal-provider?state=${'a'.repeat(43)}&state=${'b'.repeat(43)}&code=do-not-disclose`, { headers: { Cookie: `${PRIVATE_ACCOUNT_LOGIN_COOKIE}=${'c'.repeat(43)}` } }, 400);
await reject(`/v1/auth/callback/missing-provider?state=${'a'.repeat(43)}&code=do-not-disclose`, { headers: { Cookie: `${PRIVATE_ACCOUNT_LOGIN_COOKIE}=${'c'.repeat(43)}` } }, 400);

const badOrigin = await handler(new Request('https://public.example.test/health'));
assert.equal(badOrigin.status, 400); cases++;
const health = await handler(new Request(origin + '/health'));
assert.equal(health.status, 200);
assert.deepEqual(await health.json(), { service: 'erudior-private-accounts', status: 'ready' }); cases++;
const unavailable = await handler(new Request(origin + '/v1/auth/start', { method: 'POST', headers, body: '{"providerId":"personal-provider"}' }));
assert.equal(calls, 1);
assert.equal(unavailable.status, 503);
assert.deepEqual(await unavailable.json(), { error: 'service_unavailable' });
assert.doesNotMatch(JSON.stringify(audit), /private-user|private-host|secret-token|provider-subject|postgresql|personal-provider/);
assert.ok(audit.every(entry => Object.keys(entry).sort().join(',') === 'operation,outcome,requestId'));
cases++;
assert.throws(() => createPrivateAccountHandler({ ...config, origin: 'http://app.example.test' }));
assert.throws(() => createPrivateAccountHandler({ ...config, returnPath: '//unrelated.example.test' }));
assert.throws(() => createPrivateAccountHandler({ ...config, returnPath: '/account?token=leak' }));
assert.throws(() => createPrivateAccountHandler({ ...config, csrfKey: new Uint8Array(8) }));
assert.throws(() => createPrivateAccountHandler({ ...config, providers: [provider, provider] }));
cases += 5;
console.log(`Private account HTTP transport: ${cases} rejection, isolation, configuration and redaction cases passed.`);

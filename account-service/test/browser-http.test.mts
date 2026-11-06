import assert from 'node:assert/strict';
import { createPrivateAccountHandler, PRIVATE_ACCOUNT_LOGIN_COOKIE, type PrivateAccountStore } from '../src/http.ts';
import { createOidcClient } from '../src/oidc.ts';
const origin = 'https://private.example.test';
const endpoint = 'https://id.example.test/authorize';
const provider = createOidcClient({ id: 'personal', version: 1, issuer: 'https://id.example.test', authorizationEndpoint: endpoint,
  tokenEndpoint: 'https://id.example.test/token', jwksUri: 'https://id.example.test/jwks', clientId: 'private-client', clientSecret: 'never-disclose-secret-synthetic-32-characters',
  redirectUri: origin + '/v1/auth/callback/personal', signingAlgorithm: 'RS256', mfaAcrValues: ['private-acr'] });
let calls = 0;
const failure = async (): Promise<never> => { calls++; throw new Error('never-disclose-database-secret'); };
const store: PrivateAccountStore = { beginLogin: failure, consumeLogin: failure, establishSession: failure, getSession: failure, switchContext: failure, revokeSession: failure, readRecord: failure };
const browserUI = { providers: [{ id: 'personal', label: '<script>alert(1)</script>', authorizationEndpoint: endpoint }] };
const config = { origin, returnPath: '/private/settings', providers: [provider], store, csrfKey: new Uint8Array(32).fill(9) };
const disabled = createPrivateAccountHandler(config);
const handler = createPrivateAccountHandler({ ...config, browserUI });
const request = (path: string, init: RequestInit = {}) => handler(new Request(origin + path, init));
const headers = { 'X-Erudior-Request': '1', Origin: origin, 'Sec-Fetch-Site': 'same-origin' };
for (const path of [config.returnPath, '/v1/ui/settings.js', '/v1/ui/settings.css', '/v1/ui/config']) {
  assert.equal((await disabled(new Request(origin + path, { headers }))).status, 404);
}
const shell = await request(config.returnPath, { headers: { 'Sec-Fetch-Site': 'cross-site', 'Sec-Fetch-Mode': 'navigate', 'Sec-Fetch-Dest': 'document' } });
assert.equal(shell.status, 200);
assert.equal(shell.headers.get('content-type'), 'text/html; charset=utf-8');
assert.equal(shell.headers.get('cache-control'), 'no-store, max-age=0');
assert.equal(shell.headers.get('referrer-policy'), 'no-referrer');
assert.equal(shell.headers.get('x-frame-options'), 'DENY');
assert.equal(shell.headers.get('access-control-allow-origin'), null);
assert.match(shell.headers.get('content-security-policy')!, /default-src 'none'.*frame-ancestors 'none'/);
const html = await shell.text();
assert.match(html, /id="account-app"/);
assert.doesNotMatch(html, /alert\(1\)|never-disclose|private-client|private-acr/);
for (const [path, type] of [['/v1/ui/settings.js', 'text/javascript'], ['/v1/ui/settings.css', 'text/css']]) {
  const asset = await request(path, { headers: { 'Sec-Fetch-Site': 'same-origin' } });
  assert.equal(asset.status, 200); assert.ok(asset.headers.get('content-type')?.startsWith(type)); assert.ok((await asset.text()).length > 0);
  assert.equal((await request(path, { headers: { 'Sec-Fetch-Site': 'same-site' } })).status, 403);
}
const bootstrap = await request('/v1/ui/config', { headers });
assert.equal(bootstrap.status, 200);
assert.deepEqual(await bootstrap.json(), { providers: browserUI.providers, devicesEnabled: false });
for (const path of [config.returnPath, '/v1/ui/settings.js', '/v1/ui/config']) {
  assert.equal((await request(path + '?code=secret')).status, 400);
  assert.equal((await request(path, { method: 'POST' })).status, 405);
  assert.equal((await request(path, { headers: { Origin: 'https://public.example.test' } })).status, 403);
}
for (const path of ['/v1/ui/config', '/v1/session', '/v1/auth/start']) {
  const init = path === '/v1/auth/start' ? { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: '{"providerId":"personal"}' } : {};
  assert.equal((await request(path, init)).status, 403);
}
assert.equal((await request('/v1/ui/config', { headers: { ...headers, 'Sec-Fetch-Site': 'cross-site' } })).status, 403);
assert.equal((await request(config.returnPath, { headers: { 'Sec-Fetch-Mode': 'no-cors', 'Sec-Fetch-Dest': 'iframe' } })).status, 403);
for (const path of ['/v1/ui/missing.js', '/browser/settings.js', '/account-service/src/http.ts', '/v1/signup']) assert.equal((await request(path)).status, 404);
assert.equal((await request('/v1/ui/%2e%2e%2fsettings.js')).status, 400);
assert.equal(calls, 0);
for (const query of ['state=bad&code=provider-secret', `state=${'a'.repeat(43)}&error=access_denied&error_description=provider-secret`]) {
  const path = '/v1/auth/callback/personal?' + query;
  const result = await request(path, { headers: { Cookie: `${PRIVATE_ACCOUNT_LOGIN_COOKIE}=${'b'.repeat(43)}` } });
  assert.equal(result.status, 303);
  assert.equal(result.headers.get('location'), origin + config.returnPath + '#sign-in-failed');
  assert.match(result.headers.get('set-cookie')!, /Max-Age=0/);
  assert.equal(await result.text(), '');
  assert.doesNotMatch([...result.headers].flat().join(' '), /provider-secret|never-disclose/);
  const old = await disabled(new Request(origin + path));
  assert.equal(old.status, 400); assert.deepEqual(await old.json(), { error: 'invalid_request' });
}
for (const init of [{ method: 'POST' }, { headers: { Cookie: `${PRIVATE_ACCOUNT_LOGIN_COOKIE}=invalid` } }]) {
  const response = await request('/v1/auth/callback/personal?code=provider-secret', init);
  assert.equal(response.status, 303);
  assert.equal(response.headers.get('location'), origin + config.returnPath + '#sign-in-failed');
  assert.match(response.headers.get('set-cookie')!, /Max-Age=0/);
}
const oversized = await request('/v1/auth/callback/personal?code=' + 'x'.repeat(9000));
assert.equal(oversized.status, 303);
assert.equal(oversized.headers.get('location'), origin + config.returnPath + '#sign-in-failed');
for (const returnPath of ['/health', '/health/ready', '/v1', '/v1/session', '/v1/ui/settings.js', '/private//settings']) assert.throws(() => createPrivateAccountHandler({ ...config, returnPath, browserUI }));
for (const authorizationEndpoint of ['http://id.example.test/authorize', 'https://user:pass@id.example.test/authorize', endpoint + '?secret=yes', endpoint + '#fragment']) {
  assert.throws(() => createPrivateAccountHandler({ ...config, browserUI: { providers: [{ ...browserUI.providers[0], authorizationEndpoint }] } }));
}
assert.throws(() => createPrivateAccountHandler({ ...config, browserUI: { providers: [] } }));
assert.throws(() => createPrivateAccountHandler({ ...config, browserUI: { providers: [{ ...browserUI.providers[0], id: 'other' }] } }));
assert.throws(() => createPrivateAccountHandler({ ...config, browserUI: { providers: [{ ...browserUI.providers[0], label: '\nunsafe' }] } }));
console.log('Private browser host: opt-in, fixed routes/assets, sanitized config, headers, unchanged API protections and safe callback failures passed.');

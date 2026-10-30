import assert from 'node:assert/strict';
import { createHash, randomBytes } from 'node:crypto';
import test from 'node:test';
import { createPrivateAccountHandler, PRIVATE_ACCOUNT_LOGIN_COOKIE, PRIVATE_ACCOUNT_SESSION_COOKIE, type PrivateAccountAuditEvent } from '../src/http.ts';
import { createOidcClient } from '../src/oidc.ts';
import { PostgresAccountStore, type StoreProviderPolicy } from '../src/store.ts';
import type { AccountSnapshot } from '../src/model.ts';
import { accountFixture, accountFixtureIds as ids } from './fixtures.mts';
import { createPostgresHarness } from './postgres-harness.mts';
import { createSyntheticOidcProvider, type SyntheticAuthorizationOptions } from './oidc-fixture.mts';

// Independent acceptance tests: every permitted session originates in a real
// code/PKCE/signature exchange, and every protected request reaches PostgreSQL
// through the non-owner runtime role. No authorizer or session mock is an oracle.
const ORIGIN = 'https://private.erudior.test';
const hash = (value: string) => createHash('sha256').update(value).digest('hex');
const opaqueId = (name: string) => name.padEnd(30, '_');
const recordPath = (workspaceId: string, recordId: string) => `/v1/workspaces/${workspaceId}/records/${recordId}`;
type Provider = Awaited<ReturnType<typeof createSyntheticOidcProvider>>;
interface PublicSession {
  session: { id: string; version: number; accountId: string; activeWorkspaceId: string; expiresAt: number; contexts: { workspaceId: string; kind: string }[] };
  csrfToken: string;
}
interface BrowserSession extends PublicSession { cookie: string }
interface RequestOptions {
  method?: string; body?: unknown; rawBody?: string; cookie?: string; csrf?: string;
  headers?: Record<string, string | null>;
}
function request(path: string, options: RequestOptions = {}): Request {
  const method = options.method ?? 'GET';
  const headers = new Headers({ 'X-Erudior-Request': '1', 'Sec-Fetch-Site': 'same-origin' });
  if (method !== 'GET') { headers.set('Origin', ORIGIN); headers.set('Content-Type', 'application/json'); }
  if (options.cookie) headers.set('Cookie', options.cookie);
  if (options.csrf) headers.set('X-Erudior-CSRF', options.csrf);
  for (const [name, value] of Object.entries(options.headers ?? {})) {
    if (value === null) headers.delete(name); else headers.set(name, value);
  }
  const body = options.rawBody ?? (options.body !== undefined ? JSON.stringify(options.body) : undefined);
  return new Request(new URL(path, ORIGIN), { method, headers, body });
}
function cookie(response: Response, name: string): string {
  const values = response.headers.getSetCookie().filter(value => value.startsWith(`${name}=`));
  assert.equal(values.length, 1, `exactly one ${name} cookie`);
  return values[0]!.split(';')[0]!;
}
function assertCookie(response: Response, name: string, sameSite: 'Lax' | 'Strict', clear = false): void {
  const line = response.headers.getSetCookie().find(value => value.startsWith(`${name}=`));
  assert.ok(line);
  for (const attribute of ['Path=/', 'Secure', 'HttpOnly', `SameSite=${sameSite}`]) assert.ok(line.split('; ').includes(attribute), attribute);
  assert.doesNotMatch(line, /Domain=/i);
  assert.match(line, clear ? /Max-Age=0(?:;|$)/ : /Max-Age=[1-9][0-9]*(?:;|$)/);
  if (!clear) assert.match(cookie(response, name).split('=')[1]!, /^[A-Za-z0-9_-]{43}$/);
}
function assertPrivateResponse(response: Response): void {
  assert.match(response.headers.get('Cache-Control') ?? '', /no-store/);
  assert.equal(response.headers.get('Referrer-Policy'), 'no-referrer');
  assert.equal(response.headers.get('X-Content-Type-Options'), 'nosniff');
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), null);
  assert.equal(response.headers.get('Access-Control-Allow-Credentials'), null);
  assert.match(response.headers.get('X-Request-Id') ?? '', /^[a-f0-9]{32}$/);
}
async function assertError(response: Response, status: number, error: string): Promise<void> {
  assert.equal(response.status, status);
  assertPrivateResponse(response);
  assert.deepEqual(await response.json(), { error });
}

await test('private account HTTP security with signed OIDC and real PostgreSQL', async suite => {
  const database = await createPostgresHarness();
  suite.after(() => database.close());
  const personal = await createSyntheticOidcProvider({ id: 'security-personal' });
  suite.after(() => personal.close());
  const school = await createSyntheticOidcProvider({ id: 'security-school' });
  suite.after(() => school.close());
  const personalClient = createOidcClient(personal.config, { transport: personal.transport });
  const schoolClient = createOidcClient(school.config, { transport: school.transport });
  const csrfKey = randomBytes(32);
  const defaultPolicies: StoreProviderPolicy[] = [
    { id: personalClient.providerId, version: personalClient.providerVersion, configurationHash: personalClient.configurationHash, issuer: personal.config.issuer, trust: 'personal', schoolId: null },
    { id: schoolClient.providerId, version: schoolClient.providerVersion, configurationHash: schoolClient.configurationHash, issuer: school.config.issuer, trust: 'school', schoolId: ids.school },
  ];
  let policies = structuredClone(defaultPolicies);
  const store = new PostgresAccountStore(database.runtime, { providers: () => policies });
  await store.ready();
  const audit: PrivateAccountAuditEvent[] = [];
  const configuration = { origin: ORIGIN, returnPath: '/account', providers: [personalClient, schoolClient], store, csrfKey, audit: (event: PrivateAccountAuditEvent) => audit.push(event) };
  const handle = createPrivateAccountHandler(configuration);
  let graph: AccountSnapshot;

  async function reset(customize?: (snapshot: AccountSnapshot) => void) {
    await database.admin.query('TRUNCATE erudior_private.authority_graph, erudior_private.record_payloads, erudior_private.device_sessions, erudior_private.oidc_flows');
    graph = accountFixture(Math.floor(Date.now() / 1000));
    graph.sessions = [];
    for (const identity of graph.identities) {
      identity.issuer = identity.trust === 'personal' ? personal.config.issuer : school.config.issuer;
    }
    customize?.(graph);
    graph = await database.seed(graph, Object.fromEntries(graph.records.map(record => [record.id, { synthetic: true, key: record.id }])));
    policies = structuredClone(defaultPolicies);
    audit.length = 0;
  }
  async function changeGraph(edit: (snapshot: AccountSnapshot) => void) {
    const next = structuredClone(graph); edit(next); graph = await database.replaceGraph(next);
  }
  async function start(provider: Provider, workspaceId?: string, previous?: BrowserSession) {
    const response = await handle(request('/v1/auth/start', {
      method: 'POST', body: { providerId: provider.config.id, ...(workspaceId ? { workspaceId } : {}) }, cookie: previous?.cookie,
    }));
    assert.equal(response.status, 200);
    assertPrivateResponse(response); assertCookie(response, PRIVATE_ACCOUNT_LOGIN_COOKIE, 'Lax');
    const body = await response.json() as { authorizationUrl: string; expiresAt: number };
    assert.deepEqual(Object.keys(body).sort(), ['authorizationUrl', 'expiresAt']);
    return { loginCookie: cookie(response, PRIVATE_ACCOUNT_LOGIN_COOKIE), ...body };
  }
  // On a real cross-site IdP redirect the Strict session cookie is withheld.
  // Deliberately send only the Lax login binding, including during re-login.
  const callback = (url: string, loginCookie?: string) => handle(new Request(url, {
    headers: { 'Sec-Fetch-Site': 'cross-site', ...(loginCookie ? { Cookie: loginCookie } : {}) },
  }));
  async function authenticate(provider = personal, workspaceId?: string, options: SyntheticAuthorizationOptions = {}, previous?: BrowserSession): Promise<BrowserSession> {
    const begun = await start(provider, workspaceId, previous);
    const url = await provider.authorize(begun.authorizationUrl, { subject: provider === personal ? 'synthetic-person' : 'synthetic-staff', ...options });
    const response = await callback(url, begun.loginCookie);
    assert.equal(response.status, 303, await response.clone().text());
    assert.equal(response.headers.get('Location'), `${ORIGIN}/account`);
    assert.equal(await response.text(), '');
    assertPrivateResponse(response);
    assertCookie(response, PRIVATE_ACCOUNT_LOGIN_COOKIE, 'Lax', true);
    assertCookie(response, PRIVATE_ACCOUNT_SESSION_COOKIE, 'Strict');
    const value = cookie(response, PRIVATE_ACCOUNT_SESSION_COOKIE);
    const current = await handle(request('/v1/session', { cookie: value }));
    assert.equal(current.status, 200);
    return { ...await current.json() as PublicSession, cookie: value };
  }
  async function read(browser: BrowserSession, workspaceId: string, recordId: string) {
    return handle(request(recordPath(workspaceId, recordId), { cookie: browser.cookie }));
  }
  async function switchContext(browser: BrowserSession, workspaceId: string): Promise<BrowserSession> {
    const response = await handle(request('/v1/session/context', { method: 'POST', cookie: browser.cookie, csrf: browser.csrfToken, body: { workspaceId } }));
    assert.equal(response.status, 200, await response.clone().text());
    assertCookie(response, PRIVATE_ACCOUNT_SESSION_COOKIE, 'Strict');
    return { ...await response.json() as PublicSession, cookie: cookie(response, PRIVATE_ACCOUNT_SESSION_COOKIE) };
  }

  await suite.test('trusted configuration and exact request boundaries fail closed', async () => {
    await reset();
    assert.throws(() => createPrivateAccountHandler({ ...configuration, csrfKey: randomBytes(16) }));
    assert.throws(() => createPrivateAccountHandler({ ...configuration, origin: 'http://private.erudior.test' }));
    assert.throws(() => createPrivateAccountHandler({ ...configuration, returnPath: '//outside.invalid' }));
    assert.throws(() => createPrivateAccountHandler({ ...configuration, providers: [personalClient, personalClient] }));
    assert.throws(() => createPrivateAccountHandler({ ...configuration, origin: 'https://other.erudior.test' }));
    const body = { providerId: personal.config.id };
    const deniedHeaders: Record<string, string | null>[] = [
      { 'X-Erudior-Request': null }, { Origin: null }, { Origin: 'null' },
      { Origin: 'https://hostile.invalid' }, { Origin: 'https://public.erudior.test' },
      { 'Sec-Fetch-Site': 'same-site' }, { 'Sec-Fetch-Site': 'cross-site' },
    ];
    for (const headers of deniedHeaders) await assertError(await handle(request('/v1/auth/start', { method: 'POST', body, headers })), 403, 'request_denied');
    for (const body of [
      { providerId: personal.config.id, roles: ['administrator'] },
      { providerId: personal.config.id, graph },
      { providerId: personal.config.id, accessToken: 'synthetic-token' },
      { providerId: personal.config.id, returnTo: 'https://hostile.invalid' },
      { providerId: 'not-registered' }, { providerId: personal.config.id, workspaceId: 'short' },
    ]) await assertError(await handle(request('/v1/auth/start', { method: 'POST', body })), 400, 'invalid_request');
    for (const headers of [
      { Authorization: 'Bearer synthetic-personal-snapshot' }, { 'X-HTTP-Method-Override': 'GET' },
      { 'Content-Type': 'text/plain' }, { 'Content-Encoding': 'gzip' }, { 'Content-Length': '99999' },
    ] as Record<string, string | null>[]) await assertError(await handle(request('/v1/auth/start', { method: 'POST', body, headers })), 400, 'invalid_request');
    await assertError(await handle(request('/v1/auth/start', { method: 'POST', rawBody: '{"providerId":"' + 'x'.repeat(5000) + '"}' })), 400, 'invalid_request');
    await assertError(await handle(request('/v1/auth/start?providerId=security-personal', { method: 'POST', body })), 400, 'invalid_request');
    await assertError(await handle(request('/v1/%73ession')), 400, 'invalid_request');
    await assertError(await handle(request('/v1/session', { headers: { Cookie: `${PRIVATE_ACCOUNT_SESSION_COOKIE}=${'a'.repeat(43)}; ${PRIVATE_ACCOUNT_SESSION_COOKIE}=${'b'.repeat(43)}` } })), 400, 'invalid_request');
    const wrongMethod = await handle(request('/v1/auth/start'));
    await assertError(wrongMethod, 405, 'invalid_request'); assert.equal(wrongMethod.headers.get('Allow'), 'POST');
    assert.equal((await database.admin.query('SELECT count(*) FROM erudior_private.oidc_flows')).rows[0].count, '0');
  });

  await suite.test('signed personal login returns only server-derived contexts and exact record data', async () => {
    await reset();
    const browser = await authenticate();
    assert.equal(browser.session.accountId, ids.adult);
    assert.equal(browser.session.activeWorkspaceId, ids.personal);
    assert.deepEqual(browser.session.contexts, [{ workspaceId: ids.personal, kind: 'personal' }, { workspaceId: ids.family, kind: 'family' }]);
    assert.deepEqual(Object.keys(browser.session).sort(), ['accountId', 'activeWorkspaceId', 'contexts', 'expiresAt', 'id', 'version']);
    const response = await read(browser, ids.personal, ids.personalRecord);
    assert.equal(response.status, 200); assertPrivateResponse(response);
    assert.deepEqual(await response.json(), { record: { id: ids.personalRecord, version: 1, category: 'practice', visibility: 'released', payload: { synthetic: true, key: ids.personalRecord } } });
    for (const [workspaceId, recordId] of [[ids.personal, ids.familyRecord], [ids.otherPersonal, ids.personalRecord], [ids.personal, opaqueId('missing-record')]]) {
      await assertError(await read(browser, workspaceId!, recordId!), 404, 'not_found');
    }
    const rows = (await database.admin.query('SELECT token_hash, csrf_hash, body FROM erudior_private.device_sessions')).rows;
    assert.equal(rows.length, 1);
    assert.equal(rows[0].token_hash, hash(browser.cookie.split('=')[1]!));
    assert.equal(rows[0].csrf_hash, hash(browser.csrfToken));
    assert.doesNotMatch(JSON.stringify(rows), /synthetic-access-token|synthetic-refresh-token|id_token|client_secret/);
    assert.doesNotMatch(JSON.stringify(browser.session), /issuer|subject|authorit|identity|authenticatedAt|assurance/);
  });

  await suite.test('context switch rotates token and CSRF while preserving authentication time and custody', async () => {
    await reset();
    const authenticatedAt = Math.floor(Date.now() / 1000) - 120;
    const initial = await authenticate(personal, undefined, { authenticatedAt });
    const family = await switchContext(initial, ids.family);
    assert.equal(family.session.id, initial.session.id); assert.equal(family.session.version, initial.session.version + 1);
    assert.notEqual(family.cookie, initial.cookie); assert.notEqual(family.csrfToken, initial.csrfToken);
    await assertError(await handle(request('/v1/session', { cookie: initial.cookie })), 401, 'authentication_required');
    await assertError(await handle(request('/v1/session/context', { method: 'POST', cookie: family.cookie, csrf: initial.csrfToken, body: { workspaceId: ids.personal } })), 403, 'request_denied');
    assert.equal((await database.admin.query('SELECT body FROM erudior_private.device_sessions')).rows[0].body.authentication.authenticatedAt, authenticatedAt);
    for (const recordId of [ids.familyRecord, ids.familyNote, ids.grade]) assert.equal((await read(family, ids.family, recordId)).status, 200);
    for (const recordId of [ids.schoolAssignment, ids.submission, ids.foreignGrade, ids.personalRecord]) await assertError(await read(family, ids.family, recordId), 404, 'not_found');
    await assertError(await read(family, ids.school, ids.grade), 404, 'not_found');
  });

  await suite.test('school sign-in is isolated from personal and family roles and unassigned classrooms', async () => {
    const unassigned = opaqueId('unassigned-class-grade');
    await reset(snapshot => {
      snapshot.enrollments.push({ ...snapshot.enrollments[0]!, id: opaqueId('parallel-enrollment'), classId: ids.otherClassroom });
      snapshot.records.push({ ...snapshot.records.find(record => record.id === ids.grade)!, id: unassigned, classId: ids.otherClassroom });
    });
    const teacher = await authenticate(school);
    assert.equal(teacher.session.accountId, ids.adult);
    assert.deepEqual(teacher.session.contexts, [{ workspaceId: ids.school, kind: 'school' }]);
    for (const recordId of [ids.grade, ids.schoolAssignment, ids.submission]) assert.equal((await read(teacher, ids.school, recordId)).status, 200);
    for (const [workspaceId, recordId] of [[ids.school, unassigned], [ids.school, ids.foreignGrade], [ids.family, ids.familyNote], [ids.personal, ids.personalRecord]]) await assertError(await read(teacher, workspaceId!, recordId!), 404, 'not_found');
    await assertError(await handle(request('/v1/session/context', { method: 'POST', cookie: teacher.cookie, csrf: teacher.csrfToken, body: { workspaceId: ids.family } })), 403, 'request_denied');
    const begun = await start(school, ids.family);
    const url = await school.authorize(begun.authorizationUrl, { subject: 'synthetic-staff' });
    await assertError(await callback(url, begun.loginCookie), 400, 'invalid_request');
  });

  await suite.test('unregistered subjects and provider role/email claims cannot link or provision accounts', async () => {
    await reset();
    const begun = await start(personal);
    const url = await personal.authorize(begun.authorizationUrl, { subject: 'not-preprovisioned', claims: {
      email: 'existing-person@synthetic.invalid', email_verified: true, accountId: ids.adult,
      roles: ['owner', 'administrator', 'guardian'], groups: [ids.family, ids.school], schoolId: ids.school, age: 40,
    } });
    const response = await callback(url, begun.loginCookie);
    await assertError(response, 400, 'invalid_request');
    assertCookie(response, PRIVATE_ACCOUNT_LOGIN_COOKIE, 'Lax', true);
    assert.equal(response.headers.getSetCookie().some(line => line.startsWith(`${PRIVATE_ACCOUNT_SESSION_COOKIE}=`)), false);
    assert.equal((await database.admin.query('SELECT count(*) FROM erudior_private.device_sessions')).rows[0].count, '0');
    assert.deepEqual((await database.admin.query('SELECT graph FROM erudior_private.authority_graph')).rows[0].graph.identities, graph.identities);
  });

  await suite.test('MFA and authentication freshness come from validated configured claims', async () => {
    await reset();
    const weak = await authenticate(personal, undefined, { acr: 'unrecognized-mfa', claims: { amr: ['mfa', 'otp'], roles: ['guardian'] } });
    assert.deepEqual(weak.session.contexts, [{ workspaceId: ids.personal, kind: 'personal' }]);
    await assertError(await handle(request('/v1/session/context', { method: 'POST', cookie: weak.cookie, csrf: weak.csrfToken, body: { workspaceId: ids.family } })), 403, 'request_denied');
    for (const [provider, options] of [
      [school, { subject: 'synthetic-staff', acr: null, claims: { amr: ['mfa'], roles: ['administrator'] } }],
      [personal, { subject: 'synthetic-person', authenticatedAt: Math.floor(Date.now() / 1000) - 301 }],
    ] as [Provider, SyntheticAuthorizationOptions][]) {
      const begun = await start(provider), url = await provider.authorize(begun.authorizationUrl, options);
      await assertError(await callback(url, begun.loginCookie), 400, 'invalid_request');
    }
  });

  await suite.test('browser binding and one-use state defeat stolen and concurrent callback replay', async () => {
    await reset();
    const first = await start(personal), other = await start(personal);
    const url = await personal.authorize(first.authorizationUrl, { subject: 'synthetic-person' });
    const initialExchanges = personal.stats.tokenRequests;
    await assertError(await callback(url), 400, 'invalid_request');
    await assertError(await callback(url, other.loginCookie), 400, 'invalid_request');
    assert.equal(personal.stats.tokenRequests, initialExchanges, 'wrong browser binding never redeems the provider code');
    const success = await callback(url, first.loginCookie); assert.equal(success.status, 303);
    await assertError(await callback(url, first.loginCookie), 400, 'invalid_request');
    assert.equal(personal.stats.tokenRequests, initialExchanges + 1);
    const concurrent = await start(personal), concurrentUrl = await personal.authorize(concurrent.authorizationUrl, { subject: 'synthetic-person' });
    const outcomes = await Promise.all([callback(concurrentUrl, concurrent.loginCookie), callback(concurrentUrl, concurrent.loginCookie)]);
    assert.deepEqual(outcomes.map(response => response.status).sort(), [303, 400]);
    assert.equal(personal.stats.tokenRequests, initialExchanges + 2, 'one code exchange for two simultaneous callbacks');
  });

  await suite.test('CSRF, Origin and custom-header defenses apply to every authenticated mutation', async () => {
    await reset();
    const browser = await authenticate();
    for (const path of ['/v1/session/context', '/v1/session/logout']) {
      const body = path.endsWith('context') ? { workspaceId: ids.family } : {};
      for (const headers of [
        { 'X-Erudior-CSRF': null }, { 'X-Erudior-CSRF': 'a'.repeat(43) }, { Origin: null }, { Origin: 'null' },
        { Origin: 'https://hostile.invalid' }, { 'X-Erudior-Request': null }, { 'Sec-Fetch-Site': 'same-site' },
      ] as Record<string, string | null>[]) await assertError(await handle(request(path, { method: 'POST', body, cookie: browser.cookie, csrf: browser.csrfToken, headers })), 403, 'request_denied');
    }
    await assertError(await handle(request('/v1/session/logout', { method: 'POST', body: { accountId: ids.otherAdult }, cookie: browser.cookie, csrf: browser.csrfToken })), 400, 'invalid_request');
    assert.equal((await read(browser, ids.personal, ids.personalRecord)).status, 200);
    const concurrent = await Promise.all([ids.family, ids.family].map(workspaceId => handle(request('/v1/session/context', { method: 'POST', cookie: browser.cookie, csrf: browser.csrfToken, body: { workspaceId } }))));
    assert.equal(concurrent.filter(response => response.status === 200).length, 1);
    assert.ok(concurrent.filter(response => response.status !== 200).every(response => [401, 403].includes(response.status)));
    await assertError(await handle(request('/v1/session', { cookie: browser.cookie })), 401, 'authentication_required');
  });

  await suite.test('devices have independent sessions; logout and same-browser re-login revoke the exact credential', async () => {
    await reset();
    const first = await authenticate(), second = await authenticate();
    assert.notEqual(first.session.id, second.session.id); assert.notEqual(first.cookie, second.cookie);
    const replacement = await authenticate(personal, undefined, {}, first);
    assert.notEqual(replacement.cookie, first.cookie);
    await assertError(await handle(request('/v1/session', { cookie: first.cookie })), 401, 'authentication_required');
    assert.equal((await read(second, ids.personal, ids.personalRecord)).status, 200);
    const failed = await start(personal, undefined, second);
    await assertError(await callback(await personal.authorize(failed.authorizationUrl, { subject: 'unregistered' }), failed.loginCookie), 400, 'invalid_request');
    assert.equal((await read(second, ids.personal, ids.personalRecord)).status, 200, 'failed replacement never signs out the previous session');
    const logout = await handle(request('/v1/session/logout', { method: 'POST', cookie: replacement.cookie, csrf: replacement.csrfToken, body: {} }));
    assert.equal(logout.status, 204); assertCookie(logout, PRIVATE_ACCOUNT_SESSION_COOKIE, 'Strict', true);
    await assertError(await read(replacement, ids.personal, ids.personalRecord), 401, 'authentication_required');
    await assertError(await handle(request('/v1/session/logout', { method: 'POST', cookie: replacement.cookie, csrf: replacement.csrfToken, body: {} })), 401, 'authentication_required');
    assert.equal((await read(second, ids.personal, ids.personalRecord)).status, 200);
  });

  await suite.test('current family sharing, guardian authority and membership are rechecked on every read', async () => {
    await reset();
    const family = await authenticate(personal, ids.family);
    assert.equal((await read(family, ids.family, ids.grade)).status, 200);
    await changeGraph(snapshot => { const authority = snapshot.authorities.find(item => item.id === ids.sharingAuthority)!; authority.status = 'withdrawn'; authority.version++; });
    await assertError(await read(family, ids.family, ids.grade), 404, 'not_found');
    assert.equal((await read(family, ids.family, ids.familyRecord)).status, 200);
    await changeGraph(snapshot => { const authority = snapshot.authorities.find(item => item.id === ids.guardianAuthority)!; authority.status = 'withdrawn'; authority.version++; });
    await assertError(await read(family, ids.family, ids.familyRecord), 404, 'not_found');
    assert.equal((await handle(request('/v1/session', { cookie: family.cookie }))).status, 200);
    await changeGraph(snapshot => { const member = snapshot.familyMemberships[0]!; member.status = 'revoked'; member.version++; });
    await assertError(await read(family, ids.family, ids.familyRecord), 401, 'authentication_required');
  });

  await suite.test('teacher assignment removal immediately removes records and staff removal removes the context', async () => {
    await reset();
    const teacher = await authenticate(school);
    assert.equal((await read(teacher, ids.school, ids.grade)).status, 200);
    await changeGraph(snapshot => { const assignment = snapshot.teachingAssignments[0]!; assignment.status = 'revoked'; assignment.version++; });
    await assertError(await read(teacher, ids.school, ids.grade), 404, 'not_found');
    assert.equal((await handle(request('/v1/session', { cookie: teacher.cookie }))).status, 200);
    await changeGraph(snapshot => { const member = snapshot.schoolMemberships[0]!; member.status = 'revoked'; member.version++; });
    await assertError(await read(teacher, ids.school, ids.grade), 401, 'authentication_required');
  });

  await suite.test('account, identity, provider configuration and school policy changes invalidate old sessions', async () => {
    for (const scenario of ['account', 'identity', 'provider-removal', 'provider-config', 'provider-duplicate', 'school-policy']) {
      await reset();
      const browser = await authenticate(scenario === 'school-policy' ? school : personal);
      if (scenario === 'account') await changeGraph(snapshot => { const account = snapshot.accounts.find(item => item.id === ids.adult)!; account.status = 'suspended'; account.version++; });
      if (scenario === 'identity') await changeGraph(snapshot => { const identity = snapshot.identities.find(item => item.id === ids.personalIdentity)!; identity.status = 'revoked'; identity.version++; });
      if (scenario === 'provider-removal') policies = policies.filter(item => item.trust !== 'personal');
      if (scenario === 'provider-config') policies[0]!.configurationHash = 'a'.repeat(64);
      if (scenario === 'provider-duplicate') policies.push({ ...policies[0]! });
      if (scenario === 'school-policy') await changeGraph(snapshot => { const workspace = snapshot.workspaces.find(item => item.id === ids.school)!; workspace.version++; workspace.schoolPolicy!.version++; });
      const response = await handle(request('/v1/session', { cookie: browser.cookie }));
      await assertError(response, 401, 'authentication_required'); assertCookie(response, PRIVATE_ACCOUNT_SESSION_COOKIE, 'Strict', true);
    }
  });

  await suite.test('preprovisioned child logins stay school-bound; teen credentials do not change guardian authority', async () => {
    const childAccount = opaqueId('child-account'), childWorkspace = opaqueId('child-personal-workspace');
    const childPersonalIdentity = opaqueId('child-personal-identity'), childSchoolIdentity = opaqueId('child-school-identity');
    function provision(snapshot: AccountSnapshot, ageBand: 'under-13' | '13-17' | 'unresolved') {
      const learner = snapshot.learners.find(item => item.id === ids.child)!; learner.accountId = childAccount; learner.ageBand = ageBand;
      snapshot.accounts.push({ id: childAccount, version: 1, status: 'active', ageClass: 'minor' });
      snapshot.identities.push(
        { id: childPersonalIdentity, version: 1, status: 'active', accountId: childAccount, issuer: personal.config.issuer, subject: 'synthetic-child-personal', trust: 'personal', schoolId: null },
        { id: childSchoolIdentity, version: 1, status: 'active', accountId: childAccount, issuer: school.config.issuer, subject: 'synthetic-child-school', trust: 'school', schoolId: ids.school },
      );
      snapshot.workspaces.push({ id: childWorkspace, version: 1, status: 'active', verified: true, kind: 'personal', ownerAccountId: childAccount, schoolPolicy: null });
    }
    await reset(snapshot => provision(snapshot, 'under-13'));
    const child = await authenticate(school, undefined, { subject: 'synthetic-child-school' });
    assert.deepEqual(child.session.contexts, [{ workspaceId: ids.school, kind: 'school' }]);
    assert.equal((await read(child, ids.school, ids.grade)).status, 200);
    await assertError(await read(child, ids.school, ids.schoolAssignment), 404, 'not_found');
    await assertError(await read(child, ids.family, ids.familyRecord), 404, 'not_found');
    for (const ageBand of ['under-13', 'unresolved'] as const) {
      await reset(snapshot => provision(snapshot, ageBand));
      const begun = await start(personal), url = await personal.authorize(begun.authorizationUrl, { subject: 'synthetic-child-personal' });
      await assertError(await callback(url, begun.loginCookie), 400, 'invalid_request');
    }
    await reset(snapshot => provision(snapshot, '13-17'));
    const teen = await authenticate(personal, undefined, { subject: 'synthetic-child-personal' });
    assert.deepEqual(teen.session.contexts, [{ workspaceId: childWorkspace, kind: 'personal' }]);
    const stored = (await database.admin.query('SELECT graph FROM erudior_private.authority_graph')).rows[0].graph as AccountSnapshot;
    assert.equal(stored.learners.find(item => item.id === ids.child)!.guardianAccess, 'guardian-managed');
    assert.deepEqual(stored.guardians, graph.guardians);
    const guardian = await authenticate(personal, ids.family);
    assert.equal((await read(guardian, ids.family, ids.familyRecord)).status, 200);
  });

  await suite.test('record absence, unauthorized ownership and mismatched payload versions share one response', async () => {
    await reset();
    const browser = await authenticate();
    assert.equal((await read(browser, ids.personal, ids.personalRecord)).status, 200);
    assert.deepEqual((await database.runtime.query('SELECT record_id FROM erudior_private.record_payloads')).rows, [], 'transaction scope never survives pool return');
    await database.admin.query('UPDATE erudior_private.record_payloads SET record_version=2 WHERE record_id=$1', [ids.personalRecord]);
    for (const recordId of [ids.personalRecord, ids.familyRecord, opaqueId('nonexistent-record')]) await assertError(await read(browser, ids.personal, recordId), 404, 'not_found');
    assert.deepEqual((await database.runtime.query('SELECT record_id FROM erudior_private.record_payloads')).rows, []);
    await assert.rejects(database.runtime.query('UPDATE erudior_private.record_payloads SET payload=$1::jsonb', ['{"injected":true}']));
  });

  await suite.test('idle expiry, absolute expiry and CSRF key rotation cannot extend old credentials', async () => {
    for (const scenario of ['idle', 'absolute', 'csrf-key']) {
      await reset();
      const browser = await authenticate();
      let active = handle;
      if (scenario === 'idle') await database.admin.query('UPDATE erudior_private.device_sessions SET last_used_at=erudior_private.now_seconds()-idle_seconds');
      if (scenario === 'absolute') await database.admin.query("UPDATE erudior_private.device_sessions SET expires_at=erudior_private.now_seconds()-1, body=jsonb_set(body,'{expiresAt}',to_jsonb(erudior_private.now_seconds()-1))");
      if (scenario === 'csrf-key') active = createPrivateAccountHandler({ ...configuration, csrfKey: randomBytes(32) });
      const response = await active(request(recordPath(ids.personal, ids.personalRecord), { cookie: browser.cookie }));
      await assertError(response, 401, 'authentication_required'); assertCookie(response, PRIVATE_ACCOUNT_SESSION_COOKIE, 'Strict', true);
    }
  });

  await suite.test('unsupported account and record mutations stay unreachable, with no bearer or query fallback', async () => {
    await reset();
    const browser = await authenticate();
    for (const path of ['/v1/accounts', '/v1/signup', '/v1/identity/link', '/v1/recovery', '/v1/consents', '/v1/native/login']) await assertError(await handle(request(path, { method: 'POST', body: {}, cookie: browser.cookie, csrf: browser.csrfToken })), 404, 'not_found');
    for (const method of ['POST', 'PUT', 'PATCH', 'DELETE']) await assertError(await handle(request(recordPath(ids.personal, ids.personalRecord), { method, body: { payload: 'synthetic replacement' }, cookie: browser.cookie, csrf: browser.csrfToken })), 405, 'invalid_request');
    await assertError(await handle(request('/v1/session', { headers: { Authorization: `Bearer ${browser.cookie.split('=')[1]}` } })), 400, 'invalid_request');
    await assertError(await handle(request(`/v1/session?token=${browser.cookie.split('=')[1]}`)), 400, 'invalid_request');
    await assertError(await handle(request('/v1/session')), 401, 'authentication_required');
    assert.equal((await read(browser, ids.personal, ids.personalRecord)).status, 200);
  });

  await suite.test('operational errors and audit records never disclose credentials, claims or private records', async () => {
    await reset();
    const browser = await authenticate();
    const noDiagnostics = createPrivateAccountHandler({ ...configuration, audit: () => { throw new Error('synthetic private diagnostic'); } });
    assert.equal((await noDiagnostics(request(recordPath(ids.personal, ids.personalRecord), { cookie: browser.cookie }))).status, 200);
    await database.admin.query('REVOKE SELECT ON erudior_private.record_payloads FROM erudior_account_runtime');
    try {
      await assertError(await read(browser, ids.personal, ids.personalRecord), 503, 'service_unavailable');
    } finally {
      await database.admin.query('GRANT SELECT ON erudior_private.record_payloads TO erudior_account_runtime');
    }
    assert.ok(audit.some(event => event.outcome === 'error'));
    for (const event of audit) {
      assert.deepEqual(Object.keys(event).sort(), ['operation', 'outcome', 'requestId']);
      assert.match(event.requestId, /^[a-f0-9]{32}$/);
    }
    const encoded = JSON.stringify(audit);
    for (const forbidden of [ids.adult, ids.personalRecord, personal.config.issuer, 'synthetic-person', browser.cookie.split('=')[1]!, browser.csrfToken, personal.config.clientSecret]) assert.equal(encoded.includes(forbidden), false);
    assert.equal(personal.stats.outsideRequests, 0); assert.equal(school.stats.outsideRequests, 0);
  });
});

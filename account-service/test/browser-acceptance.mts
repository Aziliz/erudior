import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { chromium, type BrowserContext, type Page } from 'playwright';
import { createPrivateAccountHandler, PRIVATE_ACCOUNT_LOGIN_COOKIE, PRIVATE_ACCOUNT_SESSION_COOKIE } from '../src/http.ts';
import { createOidcClient } from '../src/oidc.ts';
import { PostgresAccountStore, type StoreProviderPolicy } from '../src/store.ts';
import { accountFixture, accountFixtureIds as ids } from './fixtures.mts';
import { createPostgresHarness } from './postgres-harness.mts';
import { createSyntheticOidcProvider, type SyntheticAuthorizationOptions } from './oidc-fixture.mts';
import { installTransport, listenHttp, type ObservedRequest, type ForwardedResponse } from './browser-transport.mts';

// This suite cannot skip: a real browser and disposable PostgreSQL are mandatory.
// HTTPS URLs use different registrable sites. Narrow transport forwarding runs
// the actual HTTP handler and signed PKCE provider, not an authorization mock.
// Production DNS/certificate/TLS termination is deliberately outside this proof.
const ORIGIN = 'https://private.erudior.test';
const OUT = process.env.ERUDIOR_BROWSER_ARTIFACT_DIR ?? 'artifacts/private-account-browser';
const require = createRequire(import.meta.url);
const axeSource = await readFile(require.resolve('axe-core/axe.min.js'), 'utf8');
const completed: string[] = [];
const transportFailures: string[] = [];
const consoleCategories: { actor: number; category: string }[] = [];
const exchangeSummary: { path: string; method: string; status: number; cookieNames: string[]; setCookieNames: string[]; fetchSite: string | null }[] = [];
const cookieNames = (header: string | undefined) => (header ?? '').split(';').map(part => part.trim().split('=')[0]!).filter(name => name.startsWith('__Host-erudior-'));
let currentCase = 'initialization';
let freshCrossSiteCallbacks = 0;
await mkdir(OUT, { recursive: true });
const browser = await chromium.launch({ headless: true,
  ...(process.env.ERUDIOR_BROWSER_EXECUTABLE ? { executablePath: process.env.ERUDIOR_BROWSER_EXECUTABLE } : {}) });
const database = await createPostgresHarness().catch(async error => { await browser.close(); throw error; });
const personal = await createSyntheticOidcProvider({ browserInteraction: true, id: 'browser-personal', issuer: 'https://personal.identity.invalid', redirectUri: ORIGIN + '/v1/auth/callback/browser-personal' });
const school = await createSyntheticOidcProvider({ browserInteraction: true, id: 'browser-school', issuer: 'https://school.identity.invalid', redirectUri: ORIGIN + '/v1/auth/callback/browser-school' });
const providers = [personal, school];
const clients = providers.map(provider => createOidcClient(provider.config, { transport: provider.transport }));
const policies: StoreProviderPolicy[] = clients.map((client, index) => ({ id: client.providerId, version: client.providerVersion,
  configurationHash: client.configurationHash, issuer: providers[index]!.config.issuer, trust: index ? 'school' : 'personal', schoolId: index ? ids.school : null }));
const store = new PostgresAccountStore(database.runtime, { providers: () => policies, devices: true, exports: { artifactTtlSeconds: 120 } });
await store.ready();
let graph = accountFixture(Math.floor(Date.now() / 1000)); graph.sessions = [];
for (const identity of graph.identities) identity.issuer = identity.trust === 'personal' ? personal.config.issuer : school.config.issuer;
graph = await database.seed(graph, Object.fromEntries(graph.records.map(record => [record.id, { synthetic: true, record: record.id, unicode: 'é漢字' }])));
const handle = createPrivateAccountHandler({ origin: ORIGIN, returnPath: '/account', store, devices: store, exports: store, providers: clients,
  csrfKey: randomBytes(32), browserUI: { providers: providers.map((provider, index) => ({ id: provider.config.id, label: index ? 'School test provider' : 'Personal test provider', authorizationEndpoint: provider.config.authorizationEndpoint })) } });
const server = await listenHttp(handle, ORIGIN);
const origins = new Map([[ORIGIN, server.origin], ...providers.map(provider => [new URL(provider.config.issuer).origin, provider.networkOrigin] as [string, string])]);
interface Actor { expectedCancellation?: (request: ObservedRequest) => boolean; cancelled?: (request: ObservedRequest) => void; attach?: (page: Page) => Promise<void>; context: BrowserContext; page: Page; choice: SyntheticAuthorizationOptions; callbacks: ObservedRequest[];
  before?: (request: ObservedRequest) => Promise<'abort' | void>; after?: (request: ObservedRequest, response: ForwardedResponse) => Promise<'abort' | void> }
const actors: Actor[] = [];
async function actor() {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, serviceWorkers: 'block' });
  const page = await context.newPage();
  const value: Actor = { context, page, choice: {}, callbacks: [] }; actors.push(value);
  const actorIndex = actors.length - 1;
  page.on('console', message => {
    if (message.type() !== 'error' && message.type() !== 'warning') return;
    const text = message.text();
    // Classify locally; never retain raw console text or credential-bearing URLs.
    const category = /form-action/i.test(text) ? 'csp-form-action' : /content security policy/i.test(text) ? 'csp-other' : /cors/i.test(text) ? 'cors' : 'browser-warning-or-error';
    consoleCategories.push({ actor: actorIndex, category });
  });
  value.attach = await installTransport(context, origins, {
    failure: path => { transportFailures.push(path); },
    expectedCancellation: request => value.expectedCancellation?.(request) === true,
    cancelled: request => value.cancelled?.(request),
    before: async request => {
      const provider = providers.find(provider => request.url.origin === new URL(provider.config.issuer).origin);
      if (provider) assert.equal(request.headers.cookie, undefined, 'Erudior cookies must never reach the provider site');
      if (provider && request.url.pathname === '/authorize') {
        assert.equal(request.method, 'GET');
        assert.equal(request.headers.cookie, undefined, 'Erudior cookies must not reach the external provider');
        provider.chooseAuthorization(request.url.searchParams.get('state')!, { subject: provider === personal ? 'synthetic-person' : 'synthetic-staff', ...value.choice });
        value.choice = {};
      }
      if (request.url.pathname.startsWith('/v1/auth/callback/')) value.callbacks.push(request);
      return value.before?.(request);
    },
    after: async (request, response) => {
      exchangeSummary.push({ path: request.url.pathname, method: request.method, status: response.status, cookieNames: cookieNames(request.headers.cookie),
        setCookieNames: (response.headers['set-cookie'] ?? '').split('\n').map(line => line.split('=')[0]!).filter(Boolean), fetchSite: request.headers['sec-fetch-site'] ?? null });
      if (request.url.origin === ORIGIN) assert.match(response.headers['cache-control'] ?? '', /no-store/);
      return value.after?.(request, response);
    },
  });
  await page.goto(ORIGIN + '/account');
  await page.getByRole('button', { name: 'Sign in with Personal test provider', exact: true }).waitFor();
  return value;
}
async function continueAtProvider(a: Actor) {
  await a.page.getByRole('heading', { name: 'Synthetic identity provider', exact: true }).waitFor();
  assert.ok(providers.some(provider => new URL(provider.config.issuer).origin === new URL(a.page.url()).origin), 'a cross-site provider document must be committed before returning');
  await a.page.getByRole('button', { name: 'Continue to Erudior', exact: true }).click();
}
async function signIn(a: Actor, kind: 'Personal' | 'School' = 'Personal', choice: SyntheticAuthorizationOptions = {}) {
  const hadSessionCookie = (await a.context.cookies(ORIGIN)).some(cookie => cookie.name === PRIVATE_ACCOUNT_SESSION_COOKIE);
  a.choice = choice;
  const name = new RegExp(`^(?:Fresh sign-in|Sign in) with ${kind} test provider$`);
  await a.page.getByRole('button', { name }).click();
  await continueAtProvider(a);
  await a.page.getByRole('region', { name: 'Current session', exact: true }).waitFor();
  assert.equal(new URL(a.page.url()).pathname, '/account');
  const callback = a.callbacks.at(-1)!;
  assert.match(callback.headers.cookie ?? '', new RegExp(PRIVATE_ACCOUNT_LOGIN_COOKIE + '='));
  assert.equal(callback.headers.referer, undefined, 'callback navigation must not disclose a referrer');
  assert.ok(!(callback.headers.cookie ?? '').includes(PRIVATE_ACCOUNT_SESSION_COOKIE + '='), 'Strict session cookie must be withheld on cross-site callback');
  if (hadSessionCookie) freshCrossSiteCallbacks++;
  const cookies = await a.context.cookies(ORIGIN);
  const session = cookies.find(cookie => cookie.name === PRIVATE_ACCOUNT_SESSION_COOKIE)!;
  assert.ok(session?.secure && session.httpOnly); assert.equal(session.sameSite, 'Strict'); assert.equal(session.path, '/');
  assert.ok(!cookies.some(cookie => cookie.name === PRIVATE_ACCOUNT_LOGIN_COOKIE));
  assert.equal(await a.page.evaluate('document.cookie'), '');
}
async function session(a: Actor): Promise<{ session: { id: string; version: number; activeWorkspaceId: string }; csrfToken: string }> {
  return a.page.evaluate(`fetch('/v1/session',{headers:{'X-Erudior-Request':'1'},cache:'no-store'}).then(r=>r.json())`);
}
async function refresh(a: Actor) {
  await a.page.getByRole('button', { name: 'Refresh session', exact: true }).click();
  await a.page.getByRole('status').filter({ hasText: /Signed in\.|signed out\.|unavailable/ }).waitFor();
}
async function signedOut(a: Actor) {
  await a.page.getByRole('button', { name: 'Sign in with Personal test provider', exact: true }).waitFor();
  assert.equal(await a.page.getByRole('region', { name: 'Current session', exact: true }).count(), 0);
  assert.equal(await a.page.getByRole('button', { name: 'Revoke all browser sessions', exact: true }).count(), 0);
}
async function revoke(a: Actor, name: string) {
  await a.page.getByRole('button', { name, exact: true }).click();
  await a.page.getByRole('button', { name: 'Confirm revocation', exact: true }).click();
  await a.page.getByRole('status').filter({ hasText: /completed|could not be confirmed/ }).waitFor();
}
async function test(name: string, run: () => Promise<void>) { currentCase = name; await run(); assert.deepEqual(transportFailures, [], 'synthetic transport must complete every paused request'); completed.push(name); console.log('PASS ' + name); }
try {
  const a = await actor(), b = await actor();
  await test('real cross-site OIDC navigation, PKCE/signatures and browser-managed Secure cookies', async () => {
    let sawLax = false;
    a.before = async request => {
      if (request.url.pathname === '/authorize') {
        const cookie = (await a.context.cookies(ORIGIN)).find(cookie => cookie.name === PRIVATE_ACCOUNT_LOGIN_COOKIE)!;
        assert.ok(cookie?.secure && cookie.httpOnly); assert.equal(cookie.sameSite, 'Lax'); sawLax = true;
      }
    };
    await signIn(a); a.before = undefined;
    assert.ok(sawLax); assert.equal(personal.stats.rejectedPkce, 0); assert.ok(personal.stats.tokenRequests > 0 && personal.stats.jwksRequests > 0);
    assert.equal((await database.runtime.query('SELECT session_id FROM erudior_private.device_sessions')).rowCount, 0, 'runtime RLS remains closed outside scoped transactions');
    await signIn(b);
  });
  await test('context switching rotates session, survives reload/back and fresh personal MFA', async () => {
    const old = await session(a);
    const oldCookie = (await a.context.cookies(ORIGIN)).find(cookie => cookie.name === PRIVATE_ACCOUNT_SESSION_COOKIE)!.value;
    await a.page.getByLabel('Active context', { exact: true }).selectOption(ids.family);
    await a.page.getByRole('button', { name: 'Switch context', exact: true }).click();
    await a.page.getByRole('status').filter({ hasText: 'Context request completed.' }).waitFor();
    assert.equal((await session(a)).session.activeWorkspaceId, ids.family);
    assert.equal((await session(a)).session.id, old.session.id);
    assert.ok((await session(a)).session.version > old.session.version);
    assert.notEqual((await a.context.cookies(ORIGIN)).find(cookie => cookie.name === PRIVATE_ACCOUNT_SESSION_COOKIE)!.value, oldCookie);
    await a.page.reload(); await a.page.getByLabel('Active context', { exact: true }).waitFor();
    assert.equal(await a.page.getByLabel('Active context', { exact: true }).inputValue(), ids.family);
    await a.page.goto(ORIGIN + '/account#history'); await a.page.goBack();
    await a.page.getByLabel('Active context', { exact: true }).waitFor();
    assert.equal(await a.page.getByLabel('Active context', { exact: true }).inputValue(), ids.family);
    await signIn(a);
    assert.ok(freshCrossSiteCallbacks > 0, 'Strict withholding must be proven with an existing account cookie');
  });
  await test('confirmation cancel, remote revocation and current revocation across two browser contexts', async () => {
    await refresh(a);
    const remote = (await session(b)).session.id;
    const name = 'Revoke session ' + remote;
    await a.page.getByRole('button', { name, exact: true }).click();
    await a.page.getByRole('button', { name: 'Cancel revocation', exact: true }).click();
    assert.equal((await session(b)).session.id, remote);
    await revoke(a, name); await refresh(b); await signedOut(b);
    assert.ok((await session(a)).session.id);
    await signIn(b);
    await revoke(a, 'Revoke this browser session'); await signedOut(a);
    assert.ok((await session(b)).session.id);
    await signIn(a);
  });
  await test('all-session revocation invalidates both real browser sessions', async () => {
    await revoke(a, 'Revoke all browser sessions'); await signedOut(a); await refresh(b); await signedOut(b);
    await signIn(a);
  });
  await test('cancellation, invalid signatures and callback replay do not mint sessions', async () => {
    const c = await actor();
    for (const choice of [{ error: 'access_denied' }, { tokenMode: 'wrong-signature' as const }]) {
      c.choice = choice;
      await c.page.getByRole('button', { name: 'Sign in with Personal test provider', exact: true }).click();
      await continueAtProvider(c);
      await c.page.getByRole('status').filter({ hasText: 'Sign-in was not completed.' }).waitFor(); await signedOut(c);
      assert.equal(c.page.url(), ORIGIN + '/account');
      assert.doesNotMatch(await c.page.locator('body').innerText(), /[?&](?:code|state|iss)=/);
      assert.ok(!(await c.context.cookies(ORIGIN)).some(cookie => cookie.name === PRIVATE_ACCOUNT_SESSION_COOKIE));
      await c.page.goto(ORIGIN + '/account'); await signedOut(c);
    }
    await signIn(c);
    const callback = c.callbacks.at(-1)!.url.href;
    await revoke(c, 'Revoke this browser session'); await c.page.goto(callback);
    await c.page.getByRole('status').filter({ hasText: 'Sign-in was not completed.' }).waitFor(); await signedOut(c);
      assert.equal(c.page.url(), ORIGIN + '/account');
      assert.doesNotMatch(await c.page.locator('body').innerText(), /[?&](?:code|state|iss)=/);
  });
  await test('CSRF and foreign-origin requests are denied by actual HTTP service', async () => {
    assert.equal(await a.page.evaluate(`fetch('/v1/devices/revoke',{method:'POST',headers:{'Content-Type':'application/json','X-Erudior-Request':'1'},body:'{}'}).then(r=>r.status)`), 403);
    // Cross-origin browser fetch has no Strict session cookie and its Origin is
    // generated by Chromium. A real provider page is not needed to forge it.
    let foreignDenied = false;
    a.after = async (request, response) => { if (request.url.pathname === '/v1/devices/revoke' && request.headers.origin !== ORIGIN) {
      assert.equal(response.status, 403); assert.ok(!(request.headers.cookie ?? '').includes(PRIVATE_ACCOUNT_SESSION_COOKIE)); foreignDenied = true;
    } };
    const foreign = await a.context.newPage();
    await a.attach!(foreign);
    await foreign.goto(personal.config.issuer + '/jwks');
    const failure = await foreign.evaluate(`fetch('${ORIGIN}/v1/devices/revoke',{method:'POST',credentials:'include',headers:{'Content-Type':'text/plain'},body:'{}'}).then(r=>r.status).catch(()=>0)`);
    assert.equal(failure, 0, 'no cross-origin response is exposed');
    assert.ok(foreignDenied); a.after = undefined;
    await foreign.close(); await a.page.bringToFront(); await refresh(a);
    assert.ok((await session(a)).session.id);
  });
  await test('school sign-in and weak personal assurance cannot manage devices; fresh personal MFA restores access', async () => {
    const c = await actor(); await signIn(c, 'School');
    assert.equal(await c.page.getByRole('button', { name: 'Revoke all browser sessions', exact: true }).count(), 0);
    assert.match(await c.page.getByRole('region', { name: 'Browser sessions', exact: true }).innerText(), /recent MFA/);
    await signIn(c, 'Personal', { acr: null });
    assert.equal(await c.page.getByRole('button', { name: 'Revoke all browser sessions', exact: true }).count(), 0);
    await signIn(c); await c.page.getByRole('button', { name: 'Revoke all browser sessions', exact: true }).waitFor();
    const fresh = (await session(c)).session.id;
    // Age an already verified session in the synthetic database. No session is
    // created or authenticated by this fixture adjustment.
    await database.admin.query("UPDATE erudior_private.device_sessions SET body=jsonb_set(body,'{authentication,authenticatedAt}',to_jsonb($1::bigint)) WHERE session_id=$2", [Math.floor(Date.now() / 1000) - 301, fresh]);
    await refresh(c);
    assert.equal(await c.page.getByRole('button', { name: 'Revoke all browser sessions', exact: true }).count(), 0);
    await signIn(c); await c.page.getByRole('button', { name: 'Revoke all browser sessions', exact: true }).waitFor();
  });
  await test('expired and stale server sessions clear private DOM on refresh', async () => {
    const c = await actor(); await signIn(c); const current = (await session(c)).session.id;
    // Age the already authenticated synthetic session consistently. The physical
    // expires_at column must equal body.expiresAt; issuance/authentication stay
    // before last use and expiry, so this proves expiry rather than malformed data.
    const expiredAt = Math.floor(Date.now() / 1000) - 1;
    const expired = await database.admin.query(`UPDATE erudior_private.device_sessions
      SET expires_at=$1::bigint, last_used_at=$1::bigint-60,
          body=body || jsonb_build_object('issuedAt',$1::bigint-120,'expiresAt',$1::bigint,
            'authentication',(body->'authentication') || jsonb_build_object('authenticatedAt',$1::bigint-120))
      WHERE session_id=$2 RETURNING expires_at=(body->>'expiresAt')::bigint AS consistent,
        (body->>'issuedAt')::bigint < expires_at AS ordered,
        last_used_at+idle_seconds > erudior_private.now_seconds() AS not_idle`, [expiredAt, current]);
    assert.deepEqual(expired.rows, [{ consistent: true, ordered: true, not_idle: true }]);
    await refresh(c); await signedOut(c);
    await signIn(c); const second = (await session(c)).session.id;
    const idle = await database.admin.query(`UPDATE erudior_private.device_sessions
      SET last_used_at=$1::bigint-idle_seconds-1,
          body=body || jsonb_build_object('issuedAt',$1::bigint-idle_seconds-61,
            'authentication',(body->'authentication') || jsonb_build_object('authenticatedAt',$1::bigint-idle_seconds-61))
      WHERE session_id=$2 RETURNING expires_at=(body->>'expiresAt')::bigint AS consistent,
        (body->>'issuedAt')::bigint <= last_used_at AS ordered,
        expires_at > erudior_private.now_seconds() AS not_expired,
        last_used_at+idle_seconds <= erudior_private.now_seconds() AS idle`, [Math.floor(Date.now() / 1000), second]);
    assert.deepEqual(idle.rows, [{ consistent: true, ordered: true, not_expired: true, idle: true }]);
    await refresh(c); await signedOut(c);
  });
  await test('interrupted and lost mutation responses reconcile without retry or stale success', async () => {
    await refresh(a);
    let mutations = 0;
    a.before = async request => { if (request.url.pathname === '/v1/session/context') { mutations++; return 'abort'; } };
    const previous = (await session(a)).session.id;
    await a.page.getByLabel('Active context', { exact: true }).selectOption(ids.family);
    await a.page.getByRole('button', { name: 'Switch context', exact: true }).click();
    await a.page.getByRole('status').filter({ hasText: 'could not be confirmed' }).waitFor();
    assert.equal((await session(a)).session.id, previous); assert.equal(mutations, 1); a.before = undefined;
    a.after = async request => { if (request.url.pathname === '/v1/session/context') { mutations++; return 'abort'; } };
    await a.page.getByLabel('Active context', { exact: true }).selectOption(ids.family);
    await a.page.getByRole('button', { name: 'Switch context', exact: true }).click();
    await a.page.getByRole('status').filter({ hasText: 'could not be confirmed' }).waitFor();
    assert.equal(mutations, 2); a.after = undefined;
    await signedOut(a); // server rotated the credential, but the response was lost
    await signIn(a);
  });
  await test('delayed real responses cannot restore private DOM after lifecycle concealment', async () => {
    // Dispatch real PageTransitionEvent objects through the mounted client. This
    // is event-driven lifecycle coverage, not proof of physical tab occlusion.
    let release!: () => void, entered!: () => void;
    let gate = new Promise<void>(resolve => { release = resolve; });
    let reached = new Promise<void>(resolve => { entered = resolve; });
    a.after = async request => { if (request.url.pathname === '/v1/devices') { entered(); await gate; } };
    await a.page.getByRole('button', { name: 'Refresh session', exact: true }).click();
    await reached;
    await a.page.evaluate("dispatchEvent(new PageTransitionEvent('pagehide',{persisted:true}))");
    assert.equal(await a.page.getByRole('region', { name: 'Current session', exact: true }).count(), 0);
    assert.doesNotMatch(await a.page.locator('body').innerText(), /session_[a-f0-9]|Account:/);
    release(); a.after = undefined;
    await a.page.evaluate("dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true}))");
    await a.page.getByRole('region', { name: 'Current session', exact: true }).waitFor();
    let mutations = 0;
    gate = new Promise<void>(resolve => { release = resolve; });
    reached = new Promise<void>(resolve => { entered = resolve; });
    a.after = async request => { if (request.url.pathname === '/v1/session/context') { mutations++; entered(); await gate; } };
    await a.page.getByLabel('Active context', { exact: true }).selectOption(ids.family);
    await a.page.getByRole('button', { name: 'Switch context', exact: true }).click();
    await reached;
    await a.page.evaluate("dispatchEvent(new PageTransitionEvent('pagehide',{persisted:true})); dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true}))");
    assert.equal(await a.page.getByRole('region', { name: 'Current session', exact: true }).count(), 0);
    assert.equal(await a.page.getByRole('button', { name: 'Switch context', exact: true }).count(), 0);
    assert.equal(mutations, 1);
    release(); a.after = undefined;
    await a.page.getByRole('region', { name: 'Current session', exact: true }).waitFor();
    assert.equal((await session(a)).session.activeWorkspaceId, ids.family);
  });
  // Exports remain opt-in only in this synthetic host, with a fixed 120-second
  // artifact lifetime. All credentials still originate in real OIDC navigation.
  const e = await actor(); await signIn(e);
  async function familyContext() {
    await e.page.getByLabel('Active context', { exact: true }).selectOption(ids.family);
    await e.page.getByRole('button', { name: 'Switch context', exact: true }).click();
    await e.page.getByRole('status').filter({ hasText: 'Context request completed.' }).waitFor();
  }
  await familyContext();
  async function browserRead(path: string, who = e): Promise<{ status: number; body: any }> {
    return who.page.evaluate(`(async()=>{const response=await fetch(${JSON.stringify(path)},{headers:{'X-Erudior-Request':'1'},cache:'no-store'});return {status:response.status,body:await response.json()};})()`);
  }
  const exportList = () => browserRead('/v1/exports?workspaceId=' + ids.family + '&limit=32');
  async function reviewExport(recordIds = [ids.familyRecord]) {
    for (const id of recordIds) await e.page.getByRole('checkbox', { name: new RegExp('^' + id + ' · version ') }).check();
    await e.page.getByRole('button', { name: 'Review selected versions', exact: true }).click();
    await e.page.getByRole('button', { name: 'Confirm create export', exact: true }).waitFor();
  }
  async function createExport(recordIds = [ids.familyRecord]) {
    const before = new Set((await exportList()).body.exports.map((job: any) => job.id));
    await reviewExport(recordIds);
    await e.page.getByRole('button', { name: 'Confirm create export', exact: true }).click();
    await e.page.getByRole('status').filter({ hasText: 'Export created.' }).waitFor();
    const jobs = (await exportList()).body.exports.filter((job: any) => !before.has(job.id));
    assert.equal(jobs.length, 1, 'one explicit confirmation must create exactly one artifact');
    return jobs[0] as { id: string; state: string };
  }
  await test('export discovery exposes only authorized metadata and exact reviewed download bytes', async () => {
    const discovery = await browserRead('/v1/exports/records?workspaceId=' + ids.family + '&limit=32');
    assert.equal(discovery.status, 200);
    assert.deepEqual(discovery.body.records.map((record: any) => record.id).sort(), [ids.familyNote, ids.familyRecord].sort());
    for (const record of discovery.body.records) assert.deepEqual(Object.keys(record).sort(), ['category', 'id', 'version', 'visibility']);
    assert.doesNotMatch(JSON.stringify(discovery.body), /synthetic|unicode|learnerId|authorityId/);
    const region = e.page.getByRole('region', { name: 'Private record exports', exact: true });
    assert.doesNotMatch(await region.innerText(), new RegExp([ids.personalRecord, ids.grade, ids.foreignGrade, ids.schoolAssignment].join('|')));
    const job = await createExport([ids.familyRecord]);
    await e.page.getByRole('button', { name: 'Check export ' + job.id, exact: true }).click();
    await e.page.getByRole('status').filter({ hasText: 'Export status checked.' }).waitFor();
    await e.page.getByRole('button', { name: 'Prepare download ' + job.id, exact: true }).click();
    const downloadEvent = e.page.waitForEvent('download');
    await e.page.getByRole('link', { name: 'Save private export JSON', exact: true }).click();
    const download = await downloadEvent;
    assert.equal(download.suggestedFilename(), 'erudior-record-export.json');
    const path = await download.path(); assert.ok(path);
    const artifact = JSON.parse(await readFile(path, 'utf8'));
    assert.equal(artifact.format, 'erudior-record-export-v1'); assert.equal(artifact.workspaceId, ids.family);
    assert.deepEqual(artifact.records, [ids.familyRecord].map(id => ({ id, version: 1,
      category: id === ids.familyNote ? 'family-note' : 'practice', visibility: id === ids.familyNote ? 'private' : 'released',
      payload: { synthetic: true, record: id, unicode: 'é漢字' } })));
    assert.equal((await database.runtime.query('SELECT export_id FROM erudior_private.record_exports')).rowCount, 0);
    assert.equal((await database.runtime.query('SELECT record_id FROM erudior_private.record_payloads')).rowCount, 0);
    await download.delete();
  });
  await test('same-session reload resumes exports and cancellation scrubs service bytes only', async () => {
    const previousSession = (await session(e)).session.id;
    const jobs = (await exportList()).body.exports; assert.equal(jobs.length, 1); const job = jobs[0];
    await e.page.reload();
    await e.page.getByRole('button', { name: 'Prepare download ' + job.id, exact: true }).waitFor();
    assert.equal((await session(e)).session.id, previousSession);
    await e.page.getByRole('button', { name: 'Cancel export ' + job.id, exact: true }).click();
    await e.page.getByRole('button', { name: 'Confirm cancel export', exact: true }).click();
    await e.page.getByRole('status').filter({ hasText: /cancel/i }).waitFor();
    const result = await browserRead('/v1/exports/' + job.id); assert.equal(result.body.export.state, 'cancelled');
    assert.equal((await browserRead('/v1/exports/' + job.id + '/download')).status, 404);
    assert.equal((await database.admin.query('SELECT artifact FROM erudior_private.record_exports WHERE export_id=$1', [job.id])).rows[0].artifact, null);
    const payloads = (await database.admin.query('SELECT record_id,payload FROM erudior_private.record_payloads WHERE record_id=ANY($1::text[]) ORDER BY record_id', [[ids.familyRecord, ids.familyNote]])).rows;
    assert.equal(payloads.length, 2);
    for (const row of payloads) assert.deepEqual(row.payload, { synthetic: true, record: row.record_id, unicode: 'é漢字' });
  });
  await test('lost export create response is reconciled read-only without duplicate submission', async () => {
    const before = new Set((await exportList()).body.exports.map((job: any) => job.id));
    let writes = 0;
    e.after = async request => { if (request.url.pathname === '/v1/exports' && request.method === 'POST') { writes++; return 'abort'; } };
    await reviewExport();
    await e.page.getByRole('button', { name: 'Confirm create export', exact: true }).click();
    await e.page.getByRole('status').filter({ hasText: /could not be confirmed/ }).waitFor();
    e.after = undefined;
    const jobs = (await exportList()).body.exports.filter((job: any) => !before.has(job.id)); assert.equal(jobs.length, 1);
    e.before = async request => { if (request.url.pathname === '/v1/exports' && request.method === 'POST') writes++; };
    await e.page.reload();
    await e.page.getByRole('button', { name: 'Prepare download ' + jobs[0].id, exact: true }).waitFor();
    await refresh(e); await refresh(e);
    assert.equal(writes, 1); e.before = undefined;
    assert.equal((await exportList()).body.exports.filter((job: any) => !before.has(job.id)).length, 1);
  });
  await test('interrupted export create never silently retries or invents success', async () => {
    const before = (await exportList()).body.exports.length; let writes = 0;
    e.before = async request => { if (request.url.pathname === '/v1/exports' && request.method === 'POST') { writes++; return 'abort'; } };
    await reviewExport(); await e.page.getByRole('button', { name: 'Confirm create export', exact: true }).click();
    await e.page.getByRole('status').filter({ hasText: /could not be confirmed/ }).waitFor();
    e.before = undefined;
    await e.page.getByRole('button', { name: 'Refresh saved exports', exact: true }).click();
    await e.page.getByRole('status').filter({ hasText: 'Saved exports refreshed.' }).waitFor();
    assert.equal(writes, 1); assert.equal((await exportList()).body.exports.length, before);
    assert.equal(await e.page.getByRole('link', { name: 'Save private export JSON', exact: true }).count(), 0);
  });
  await test('expired artifacts remain unavailable and service bytes are cleared', async () => {
    const job = await createExport(); const expiredAt = Math.floor(Date.now() / 1000) - 1;
    await database.admin.query('UPDATE erudior_private.record_exports SET created_at=$1::bigint-120,expires_at=$1::bigint WHERE export_id=$2', [expiredAt, job.id]);
    await e.page.reload(); await e.page.getByRole('region', { name: 'Private record exports', exact: true }).waitFor();
    assert.equal((await browserRead('/v1/exports/' + job.id + '/download')).status, 404);
    assert.equal((await browserRead('/v1/exports/' + job.id)).body.export.state, 'expired');
    assert.equal((await database.admin.query('SELECT artifact FROM erudior_private.record_exports WHERE export_id=$1', [job.id])).rows[0].artifact, null);
    assert.equal(await e.page.getByRole('button', { name: 'Prepare download ' + job.id, exact: true }).count(), 0);
  });
  await test('changed record versions and authority deny export metadata and bytes', async () => {
    const versionJob = await createExport();
    const record = graph.records.find(record => record.id === ids.familyRecord)!; record.version++;
    graph = await database.replaceGraph(graph, { [record.id]: { synthetic: true, record: record.id, unicode: 'é漢字' } });
    assert.equal((await browserRead('/v1/exports/' + versionJob.id)).status, 404);
    assert.equal((await browserRead('/v1/exports/' + versionJob.id + '/download')).status, 404);
    await refresh(e);
    const authorityJob = await createExport();
    const guardian = graph.guardians.find(guardian => guardian.id === ids.guardian)!;
    guardian.version++; guardian.status = 'revoked'; graph = await database.replaceGraph(graph);
    assert.equal((await browserRead('/v1/exports/' + authorityJob.id)).status, 404);
    assert.equal((await browserRead('/v1/exports/' + authorityJob.id + '/download')).status, 404);
    const denied = await browserRead('/v1/exports/records?workspaceId=' + ids.family + '&limit=32');
    assert.equal(denied.status, 200); assert.deepEqual(denied.body.records, []);
    const restoredGuardian = graph.guardians.find(guardian => guardian.id === ids.guardian)!;
    restoredGuardian.version++; restoredGuardian.status = 'active'; graph = await database.replaceGraph(graph);
    await refresh(e);
  });
  await test('context rotation and fresh session cannot resume prior export artifacts', async () => {
    const job = await createExport();
    await e.page.getByLabel('Active context', { exact: true }).selectOption(ids.personal);
    await e.page.getByRole('button', { name: 'Switch context', exact: true }).click();
    await e.page.getByRole('status').filter({ hasText: 'Context request completed.' }).waitFor();
    assert.equal((await browserRead('/v1/exports/' + job.id)).status, 404);
    assert.equal((await browserRead('/v1/exports/' + job.id + '/download')).status, 404);
    await familyContext();
    assert.equal((await browserRead('/v1/exports/' + job.id)).status, 404, 'switching back does not restore the old session version');
    const own = await createExport(); const oldSession = (await session(e)).session.id;
    await signIn(e); await familyContext();
    assert.notEqual((await session(e)).session.id, oldSession);
    assert.equal((await browserRead('/v1/exports/' + own.id)).status, 404);
    assert.equal((await browserRead('/v1/exports/' + own.id + '/download')).status, 404);
    assert.ok(!(await exportList()).body.exports.some((item: any) => item.id === own.id));
  });
  await test('delayed export download is suppressed after lifecycle concealment', async () => {
    const job = await createExport(); let downloads = 0, concealmentRequested = false;
    let markCancelled!: () => void;
    const cancelled = new Promise<void>(resolve => { markCancelled = resolve; });
    e.expectedCancellation = request => concealmentRequested && request.method === 'GET' && request.url.pathname === '/v1/exports/' + job.id + '/download';
    e.cancelled = () => { markCancelled(); };
    e.page.on('download', () => { downloads++; });
    let release!: () => void, entered!: () => void;
    const gate = new Promise<void>(resolve => { release = resolve; });
    const reached = new Promise<void>(resolve => { entered = resolve; });
    e.after = async request => { if (request.url.pathname === '/v1/exports/' + job.id + '/download') { entered(); await gate; } };
    await e.page.getByRole('button', { name: 'Prepare download ' + job.id, exact: true }).click(); await reached;
    concealmentRequested = true;
    await e.page.evaluate("dispatchEvent(new PageTransitionEvent('pagehide',{persisted:true}))");
    assert.equal(await e.page.getByRole('region', { name: 'Private record exports', exact: true }).count(), 0);
    release(); e.after = undefined;
    await e.page.evaluate("dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true}))");
    await e.page.getByRole('region', { name: 'Private record exports', exact: true }).waitFor();
    // Chromium must confirm cancellation of this exact fetch; unrelated
    // transport failures remain fatal. Bound the wait so a missing event fails.
    let timeout!: ReturnType<typeof setTimeout>;
    try { await Promise.race([cancelled, new Promise<never>((_, reject) => { timeout = setTimeout(() => reject(new Error('Expected browser cancellation was not observed')), 5000); })]); }
    finally { clearTimeout(timeout); e.expectedCancellation = undefined; e.cancelled = undefined; }
    assert.equal(downloads, 0, 'a concealed in-flight result must not trigger a browser download');
    assert.equal(await e.page.getByRole('link', { name: 'Save private export JSON', exact: true }).count(), 0, 'late bytes must not restore a Blob download link');
  });
  await test('delayed export discovery cannot restore metadata after lifecycle concealment', async () => {
    let release!: () => void, entered!: () => void;
    const gate = new Promise<void>(resolve => { release = resolve; });
    const reached = new Promise<void>(resolve => { entered = resolve; });
    e.after = async request => { if (request.url.pathname === '/v1/exports/records') { entered(); await gate; } };
    await e.page.getByRole('button', { name: 'Refresh available records', exact: true }).click(); await reached;
    await e.page.evaluate("dispatchEvent(new PageTransitionEvent('pagehide',{persisted:true}))");
    assert.equal(await e.page.getByRole('region', { name: 'Private record exports', exact: true }).count(), 0);
    assert.doesNotMatch(await e.page.locator('body').innerText(), new RegExp(ids.familyRecord));
    release(); e.after = undefined;
    // A real browser turn after releasing the response must still leave the
    // hidden page empty. This is an event-driven lifecycle proof, not OS hiding.
    await e.page.evaluate('new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))');
    assert.equal(await e.page.getByRole('region', { name: 'Private record exports', exact: true }).count(), 0);
    await e.page.evaluate("dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true}))");
    await e.page.getByRole('region', { name: 'Private record exports', exact: true }).waitFor();
  });
  await test('exports leave no persistent browser data and pass responsive accessible review', async () => {
    assert.deepEqual(await e.page.evaluate(`(async()=>({local:localStorage.length,session:sessionStorage.length,databases:(await indexedDB.databases()).length,workers:(await navigator.serviceWorker.getRegistrations()).length,cookie:document.cookie}))()`), { local: 0, session: 0, databases: 0, workers: 0, cookie: '' });
    for (const width of [1280, 320]) for (const colorScheme of ['light', 'dark'] as const) {
      await e.page.setViewportSize({ width, height: 900 }); await e.page.emulateMedia({ colorScheme }); await refresh(e);
      await reviewExport(); await e.page.evaluate(axeSource);
      const violations = await e.page.evaluate(`axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}).then(r=>r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.length})))`);
      assert.deepEqual(violations, [], `export review axe ${width} ${colorScheme}`);
      assert.equal(await e.page.evaluate('document.documentElement.scrollWidth <= innerWidth'), true);
      await e.page.screenshot({ path: `${OUT}/export-review-${width}-${colorScheme}.png`, fullPage: true });
      await e.page.reload(); await e.page.getByRole('region', { name: 'Private record exports', exact: true }).waitFor();
    }
  });
  await test('no local/session storage, IndexedDB, service worker or script-readable credentials', async () => {
    assert.deepEqual(await a.page.evaluate(`(async()=>({local:localStorage.length,session:sessionStorage.length,databases:(await indexedDB.databases()).length,workers:(await navigator.serviceWorker.getRegistrations()).length,cookie:document.cookie}))()`), { local: 0, session: 0, databases: 0, workers: 0, cookie: '' });
    const source = await readFile(new URL('../browser/settings.js', import.meta.url), 'utf8');
    assert.doesNotMatch(source, /localStorage|sessionStorage|indexedDB|clientSecret|tokenHash/);
  });
  await test('desktop/mobile light/dark accessibility and screenshot evidence', async () => {
    for (const width of [1280, 320]) for (const colorScheme of ['light', 'dark'] as const) {
      await a.page.setViewportSize({ width, height: 900 }); await a.page.emulateMedia({ colorScheme }); await refresh(a);
      await a.page.evaluate(axeSource);
      const violations = await a.page.evaluate(`axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}).then(r=>r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.length})))`);
      assert.deepEqual(violations, [], `axe ${width} ${colorScheme}`);
      assert.equal(await a.page.evaluate('document.documentElement.scrollWidth <= innerWidth'), true, 'no horizontal overflow');
      await a.page.screenshot({ path: `${OUT}/settings-${width}-${colorScheme}.png`, fullPage: true });
      await a.page.getByRole('button', { name: 'Revoke this browser session', exact: true }).click();
      await a.page.screenshot({ path: `${OUT}/confirmation-${width}-${colorScheme}.png`, fullPage: true });
      await a.page.getByRole('button', { name: 'Cancel revocation', exact: true }).click();
    }
  });
} catch (error) {
  const locations = error instanceof Error ? [...(error.stack ?? '').matchAll(/(?:browser-acceptance|browser-transport)\.mts:\d+:\d+/g)].map(match => match[0]) : [];
  const safeLabels = ['synthetic transport must complete every paused request', 'a concealed in-flight result must not trigger a browser download', 'late bytes must not restore a Blob download link', 'Expected browser cancellation was not observed'];
  const assertionLabel = error instanceof Error ? safeLabels.find(label => error.message.startsWith(label)) ?? null : null;
  const diagnostic = { locations: [...new Set(locations)], assertionLabel };
  const states = [];
  for (const [index, actor] of actors.entries()) {
    states.push({ actor: index, pathname: new URL(actor.page.url()).pathname,
      cookies: (await actor.context.cookies(ORIGIN)).map(({ name, secure, httpOnly, sameSite }) => ({ name, secure, httpOnly, sameSite })) });
    // Screenshots show document content only, never the browser address bar.
    await actor.page.screenshot({ path: `${OUT}/failure-${index}.png`, fullPage: true, timeout: 5000 }).catch(() => {});
  }
  await writeFile(OUT + '/failure.json', JSON.stringify({ currentCase, diagnostic, states, exchanges: exchangeSummary, transportFailures, consoleCategories }, null, 2));
  console.error(JSON.stringify({ failedCase: currentCase, diagnostic, states, exchanges: exchangeSummary.slice(-20), transportFailures, consoleCategories }));
  // Playwright errors can include full callback URLs. Keep the original error
  // class but do not print the credential-bearing navigation log.
  throw new Error(`Browser acceptance failed in ${currentCase} (${error instanceof Error ? error.name : 'unknown error'}; ${diagnostic.locations.join(', ') || 'location unavailable'}${assertionLabel ? '; ' + assertionLabel : ''}); see sanitized failure.json and screenshots`);
} finally {
  await writeFile(OUT + '/summary.json', JSON.stringify({ completed, passed: completed.length, freshCrossSiteCallbacks, transport: 'Synthetic HTTPS origins forwarded to real loopback HTTP. No production DNS/TLS proof.', browserCookieInjection: false, authorizationMocks: false }, null, 2));
  for (const actor of actors) await actor.context.close();
  await browser.close(); await server.close(); await personal.close(); await school.close(); await database.close();
}

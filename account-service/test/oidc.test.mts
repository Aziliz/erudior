import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { createOidcClient, OidcError, OIDC_LIMITS, type OidcProviderConfig, type OidcTransaction } from '../src/oidc';
import { createSyntheticOidcProvider, type SyntheticAuthorizationOptions } from './oidc-fixture.mts';

let passed = 0;
async function check(name: string, work: () => Promise<void> | void) {
  try { await work(); passed++; }
  catch (error) { console.error('OIDC case failed:', name); throw error; }
}
const now = () => Math.floor(Date.now() / 1_000);
const provider = await createSyntheticOidcProvider();
const client = createOidcClient(provider.config, { transport: provider.transport });

function generic(error: unknown): boolean {
  assert.ok(error instanceof OidcError);
  assert.equal(error.message, 'Private sign-in could not be completed');
  assert.equal(Object.hasOwn(error, 'cause'), false, 'provider body/claims must not survive as a cause');
  return true;
}
async function flow(choice: SyntheticAuthorizationOptions = {}, selected = client) {
  const started = await selected.begin(now());
  return { ...started, callback: await provider.authorize(started.authorizationUrl, choice) };
}
async function denyClaims(name: string, choice: () => SyntheticAuthorizationOptions) {
  await check(name, async () => {
    const started = await flow(choice());
    await assert.rejects(client.complete(started.callback, started.transaction, now()), generic);
  });
}

try {
  await check('confidential code+PKCE+signed JWKS identity; no provider token or role leakage', async () => {
    const started = await flow({ claims: { email: 'admin@example.invalid', email_verified: true, roles: ['administrator'], school: 'other-school' } });
    const url = new URL(started.authorizationUrl);
    assert.equal(url.searchParams.get('response_type'), 'code');
    assert.equal(url.searchParams.get('code_challenge_method'), 'S256');
    assert.equal(url.searchParams.get('scope'), 'openid');
    assert.equal(url.searchParams.get('prompt'), 'login');
    assert.equal(url.searchParams.get('max_age'), '300');
    assert.equal(url.searchParams.has('client_secret'), false);
    assert.equal(url.searchParams.has('code_verifier'), false);
    const verified = await client.complete(started.callback, started.transaction, now());
    assert.deepEqual(Object.keys(verified).sort(), ['providerId', 'providerVersion', 'configurationHash', 'issuer', 'subject', 'authenticatedAt', 'assurance'].sort());
    assert.equal(verified.subject, 'synthetic-user');
    assert.equal(verified.issuer, provider.config.issuer);
    assert.equal(verified.assurance, 'mfa');
    assert.equal(verified.configurationHash, client.configurationHash);
    assert.equal(provider.stats.rejectedClientAuthentication, 0);
    assert.equal(provider.stats.rejectedPkce, 0);
    assert.equal(provider.stats.jwksRequests, 1);
  });
  for (const acr of [null, 'unreviewed-provider-context']) await check('only explicit reviewed acr grants MFA: ' + String(acr), async () => {
    const started = await flow({ acr, claims: { amr: ['mfa', 'pwd', 'otp'] } });
    const verified = await client.complete(started.callback, started.transaction, now());
    assert.equal(verified.assurance, 'single-factor');
  });

  const claimCases: [string, () => SyntheticAuthorizationOptions][] = [
    ['wrong ID token issuer', () => ({ claims: { iss: 'https://attacker.invalid' } })],
    ['wrong ID token audience', () => ({ claims: { aud: 'another-client' } })],
    ['multiple audiences require correct authorized party', () => ({ claims: { aud: [provider.config.clientId, 'another-client'] } })],
    ['wrong authorized party also denied with one audience', () => ({ claims: { azp: 'another-client' } })],
    ['wrong nonce', () => ({ claims: { nonce: 'attacker-nonce' } })],
    ['missing nonce', () => ({ claims: { nonce: undefined } })],
    ['missing authentication time', () => ({ authenticatedAt: null })],
    ['stale authentication time', () => ({ authenticatedAt: now() - 301 })],
    ['authentication freshness is an exclusive deadline', () => ({ authenticatedAt: now() - 300 })],
    ['future authentication time', () => ({ authenticatedAt: now() + 60 })],
    ['fractional authentication time', () => ({ authenticatedAt: now() - 0.5 })],
    ['future issued-at', () => ({ claims: { iat: now() + 60 } })],
    ['missing issued-at', () => ({ claims: { iat: undefined } })],
    ['expired token', () => ({ claims: { exp: now() - 1 } })],
    ['missing expiration', () => ({ claims: { exp: undefined } })],
    ['empty subject', () => ({ subject: '' })],
    ['oversized subject', () => ({ subject: 's'.repeat(256) })],
    ['subject with control characters', () => ({ subject: 'subject\nother' })],
    ['malformed assurance context', () => ({ claims: { acr: ['urn:erudior:test:mfa'] } })],
    ['signature from an unadvertised key', () => ({ tokenMode: 'wrong-signature' })],
    ['unmatched signing key ID', () => ({ keyId: 'unknown-key' })],
    ['unconfigured signing algorithm', () => ({ tokenMode: 'wrong-algorithm' })],
    ['unsigned ID token', () => ({ tokenMode: 'unsigned' })],
    ['missing ID token', () => ({ tokenMode: 'missing-id-token' })],
    ['unsupported token type', () => ({ tokenMode: 'wrong-token-type' })],
    ['malformed provider JSON', () => ({ tokenMode: 'malformed-json' })],
    ['otherwise valid oversized token response', () => ({ tokenMode: 'oversize' })],
    ['token endpoint redirects are not followed', () => ({ tokenMode: 'redirect' })],
  ];
  for (const [name, choice] of claimCases) await denyClaims(name, choice);

  await check('standards-valid multiple audiences with explicit correct azp', async () => {
    const started = await flow({ claims: { aud: [provider.config.clientId, 'related-service'], azp: provider.config.clientId } });
    assert.equal((await client.complete(started.callback, started.transaction, now())).subject, 'synthetic-user');
  });

  const callbacks: [string, (url: URL) => void][] = [
    ['missing callback state', url => url.searchParams.delete('state')],
    ['wrong callback state', url => url.searchParams.set('state', randomBytes(32).toString('base64url'))],
    ['duplicate callback state', url => url.searchParams.append('state', url.searchParams.get('state')!)],
    ['missing callback issuer', url => url.searchParams.delete('iss')],
    ['wrong callback issuer', url => url.searchParams.set('iss', 'https://other-issuer.invalid')],
    ['duplicate callback issuer', url => url.searchParams.append('iss', url.searchParams.get('iss')!)],
    ['missing code', url => url.searchParams.delete('code')],
    ['duplicate code', url => url.searchParams.append('code', url.searchParams.get('code')!)],
    ['mixed successful/error response', url => url.searchParams.set('error', 'access_denied')],
    ['unknown callback parameter', url => url.searchParams.set('returnTo', 'https://attacker.invalid')],
    ['callback fragment', url => { url.hash = 'code=attacker'; }],
    ['different callback origin', url => { url.hostname = 'attacker.invalid'; }],
    ['different callback path', url => { url.pathname += '/other'; }],
    ['callback credentials', url => { url.username = 'attacker'; }],
  ];
  for (const [name, change] of callbacks) await check(name + ' fails before code/verifier transmission', async () => {
    const started = await flow();
    const url = new URL(started.callback); change(url);
    const before = provider.stats.tokenRequests;
    await assert.rejects(client.complete(url, started.transaction, now()), generic);
    assert.equal(provider.stats.tokenRequests, before);
  });
  await check('authorization rejection is generic and not exchanged', async () => {
    const started = await flow({ error: 'access_denied' });
    const before = provider.stats.tokenRequests;
    await assert.rejects(client.complete(started.callback, started.transaction, now()), generic);
    assert.equal(provider.stats.tokenRequests, before);
  });

  const transactions: [string, (t: OidcTransaction) => unknown][] = [
    ['different provider', t => ({ ...t, providerId: 'other-provider' })],
    ['different provider revision', t => ({ ...t, providerVersion: t.providerVersion + 1 })],
    ['different config hash', t => ({ ...t, configurationHash: 'a'.repeat(64) })],
    ['malformed nonce', t => ({ ...t, nonce: 'short' })],
    ['malformed verifier', t => ({ ...t, codeVerifier: 'short' })],
    ['extra untrusted authority field', t => ({ ...t, role: 'administrator' })],
    ['expired pending transaction', t => ({ ...t, createdAt: now() - 301, expiresAt: now() - 1 })],
    ['future pending transaction', t => ({ ...t, createdAt: now() + 60, expiresAt: now() + 360 })],
    ['extended pending lifetime', t => ({ ...t, expiresAt: t.expiresAt + 1 })],
  ];
  for (const [name, change] of transactions) await check(name + ' denied before network', async () => {
    const started = await flow(), before = provider.stats.tokenRequests;
    await assert.rejects(client.complete(started.callback, change(started.transaction), now()), generic);
    assert.equal(provider.stats.tokenRequests, before);
  });
  await check('actual provider enforces the PKCE verifier', async () => {
    const started = await flow(), before = provider.stats.rejectedPkce;
    await assert.rejects(client.complete(started.callback, { ...started.transaction, codeVerifier: randomBytes(32).toString('base64url') }, now()), generic);
    assert.equal(provider.stats.rejectedPkce, before + 1);
  });
  await check('actual provider burns an authorization code after redemption', async () => {
    const started = await flow();
    await client.complete(started.callback, started.transaction, now());
    await assert.rejects(client.complete(started.callback, started.transaction, now()), generic);
  });
  await check('changed registration invalidates pending state even if provider version was reused', async () => {
    const started = await flow(), before = provider.stats.tokenRequests;
    const changed = createOidcClient({ ...provider.config, mfaAcrValues: [] }, { transport: provider.transport });
    assert.notEqual(changed.configurationHash, client.configurationHash);
    await assert.rejects(changed.complete(started.callback, started.transaction, now()), generic);
    assert.equal(provider.stats.tokenRequests, before);
  });
  await check('confidential client credentials are required by token endpoint', async () => {
    const wrong = createOidcClient({ ...provider.config, clientSecret: 'incorrect-confidential-secret-'.repeat(2) }, { transport: provider.transport });
    const started = await flow({}, wrong), before = provider.stats.rejectedClientAuthentication;
    await assert.rejects(wrong.complete(started.callback, started.transaction, now()), generic);
    assert.equal(provider.stats.rejectedClientAuthentication, before + 1);
  });

  for (const mode of ['redirect', 'oversize', 'malformed-json', 'slow-body'] as const) await check('JWKS ' + mode + ' fails closed', async () => {
    const selected = createOidcClient(provider.config, { transport: provider.transport, requestTimeoutMs: 100 });
    const started = await flow({}, selected);
    provider.setJwksMode(mode);
    try { await assert.rejects(selected.complete(started.callback, started.transaction, now()), generic); }
    finally { provider.setJwksMode('valid'); }
  });
  await check('token body timeout remains bounded after response headers', async () => {
    const selected = createOidcClient(provider.config, { transport: provider.transport, requestTimeoutMs: 100 });
    const started = await flow({ tokenMode: 'slow-body' }, selected), before = Date.now();
    await assert.rejects(selected.complete(started.callback, started.transaction, now()), generic);
    assert.ok(Date.now() - before < 1_000);
  });
  await check('invalid response cleanup cannot wait indefinitely for stream cancellation', async () => {
    const invalidHeaders: Record<string, string>[] = [{ 'content-type': 'text/html' }, { 'content-type': 'application/json', 'content-length': '999999' }];
    for (const headers of invalidHeaders) {
      let cancelled = false;
      const selected = createOidcClient(provider.config, {
        requestTimeoutMs: 100,
        transport: async () => new Response(new ReadableStream({
          cancel() { cancelled = true; return new Promise<void>(() => undefined); },
        }), { status: 200, headers }),
      });
      const started = await flow({}, selected);
      let timer: ReturnType<typeof setTimeout> | undefined;
      try {
        await Promise.race([
          assert.rejects(selected.complete(started.callback, started.transaction, now()), generic),
          new Promise<never>((_, reject) => { timer = setTimeout(() => reject(new Error('Unbounded response cancellation')), 1_000); }),
        ]);
        assert.equal(cancelled, true);
      } finally { if (timer) clearTimeout(timer); }
    }
  });
  await check('transaction expiring during network verification cannot complete', async () => {
    const selected = createOidcClient(provider.config, { transport: async (url, init) => {
      const response = await provider.transport(url, init);
      if (String(url) === provider.config.tokenEndpoint) await new Promise(resolve => setTimeout(resolve, 1_100));
      return response;
    } });
    const started = await selected.begin(now() - OIDC_LIMITS.transactionSeconds + 1);
    const callback = await provider.authorize(started.authorizationUrl);
    await assert.rejects(selected.complete(callback, started.transaction, now()), generic);
  });
  await check('key rotation is observed without cached-key grace or retry', async () => {
    const first = await flow(); await client.complete(first.callback, first.transaction, now());
    const before = provider.stats.jwksRequests;
    await provider.rotateSigningKey();
    const second = await flow();
    assert.equal((await client.complete(second.callback, second.transaction, now())).subject, 'synthetic-user');
    assert.equal(provider.stats.jwksRequests, before + 1);
  });
  await check('configuration is copied and cannot be changed through caller-owned arrays', async () => {
    const config = structuredClone(provider.config);
    const fixed = createOidcClient(config, { transport: provider.transport });
    const hash = fixed.configurationHash;
    config.mfaAcrValues.splice(0); config.clientSecret = 'changed-secret';
    assert.equal(fixed.configurationHash, hash);
    const started = await flow({}, fixed);
    assert.equal((await fixed.complete(started.callback, started.transaction, now())).assurance, 'mfa');
  });

  const invalidConfig: Partial<OidcProviderConfig>[] = [
    { id: 'UPPERCASE' }, { id: 'x'.repeat(49) }, { version: 0 }, { clientSecret: 'short' },
    { issuer: 'http://issuer.invalid' }, { tokenEndpoint: 'http://issuer.invalid/token' },
    { jwksUri: 'https://user:password@issuer.invalid/jwks' }, { authorizationEndpoint: 'https://issuer.invalid/auth?redirect=other' },
    { redirectUri: 'https://private.erudior.test/v1/auth/callback' },
    { redirectUri: 'https://private.erudior.test/v1/auth/callback/' + provider.config.id + '#fragment' },
    { signingAlgorithm: 'HS256' as OidcProviderConfig['signingAlgorithm'] },
    { mfaAcrValues: ['duplicate', 'duplicate'] },
  ];
  for (const change of invalidConfig) await check('reject unsafe OIDC configuration ' + Object.keys(change)[0], () => {
    assert.throws(() => createOidcClient({ ...provider.config, ...change }), generic);
  });
  await check('transport never attempted an unpinned URL', () => { assert.equal(provider.stats.outsideRequests, 0); });

  await check('RS256 uses the same strict confidential signed flow', async () => {
    const rsa = await createSyntheticOidcProvider({ id: 'rsa-provider', signingAlgorithm: 'RS256' });
    try {
      const selected = createOidcClient(rsa.config, { transport: rsa.transport });
      const started = await selected.begin(now()), callback = await rsa.authorize(started.authorizationUrl);
      assert.equal((await selected.complete(callback, started.transaction, now())).issuer, rsa.config.issuer);
    } finally { await rsa.close(); }
  });
} finally { await provider.close(); }

console.log(`Private OIDC: ${passed} signed-provider code/PKCE, identity, claim, callback, network and rotation cases passed.`);

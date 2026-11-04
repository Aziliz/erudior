import { createHash, randomBytes } from 'node:crypto';
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import type { AddressInfo } from 'node:net';
import { exportJWK, generateKeyPair, SignJWT, UnsecuredJWT, type JWK, type JWTPayload } from 'jose';
import type { OidcProviderConfig } from '../src/oidc';

export interface SyntheticAuthorizationOptions {
  subject?: string;
  acr?: string | null;
  authenticatedAt?: number | null;
  claims?: Record<string, unknown>;
  error?: string;
  tokenMode?: 'valid' | 'wrong-signature' | 'wrong-algorithm' | 'unsigned' | 'missing-id-token' | 'wrong-token-type' | 'malformed-json' | 'oversize' | 'redirect' | 'slow-body';
  keyId?: string;
}

export interface SyntheticProviderOptions {
  id?: string;
  issuer?: string;
  redirectUri?: string;
  signingAlgorithm?: 'RS256' | 'ES256';
}

/**
 * Synthetic-only OIDC provider. Real code/PKCE redemption and signed tokens/JWKS run
 * over an isolated loopback HTTP server. The explicitly injected test transport maps
 * pinned synthetic HTTPS URLs to it; no production TLS behavior is changed.
 */
export async function createSyntheticOidcProvider(options: SyntheticProviderOptions = {}) {
  const id = options.id ?? 'synthetic-provider';
  const issuer = options.issuer ?? `https://${id}.oidc.invalid`;
  const base = issuer.replace(/\/$/, '');
  const config: OidcProviderConfig = {
    id, version: 1, issuer,
    authorizationEndpoint: base + '/authorize', tokenEndpoint: base + '/token', jwksUri: base + '/jwks',
    clientId: id + '-client', clientSecret: 'synthetic-client-secret-' + randomBytes(32).toString('base64url'),
    redirectUri: options.redirectUri ?? `https://private.erudior.test/v1/auth/callback/${id}`,
    signingAlgorithm: options.signingAlgorithm ?? 'ES256', mfaAcrValues: ['urn:erudior:test:mfa'],
  };
  type Key = { privateKey: Awaited<ReturnType<typeof generateKeyPair>>['privateKey']; jwk: JWK; kid: string };
  async function key(algorithm = config.signingAlgorithm): Promise<Key> {
    const pair = await generateKeyPair(algorithm, { extractable: true });
    const kid = randomBytes(12).toString('base64url');
    return { privateKey: pair.privateKey, kid, jwk: { ...await exportJWK(pair.publicKey), kid, alg: algorithm, use: 'sig' } };
  }
  let signer = await key();
  const attacker = await key();
  let keys = [signer.jwk];
  let jwksMode: 'valid' | 'redirect' | 'oversize' | 'malformed-json' | 'slow-body' = 'valid';
  const choices = new Map<string, SyntheticAuthorizationOptions>();
  const codes = new Map<string, { nonce: string; challenge: string; options: SyntheticAuthorizationOptions }>();
  const timers = new Set<ReturnType<typeof setTimeout>>();
  const stats = { authorizationRequests: 0, tokenRequests: 0, jwksRequests: 0, rejectedPkce: 0, rejectedClientAuthentication: 0, outsideRequests: 0 };
  const paths = {
    authorize: new URL(config.authorizationEndpoint).pathname,
    token: new URL(config.tokenEndpoint).pathname,
    jwks: new URL(config.jwksUri).pathname,
  };
  function json(response: ServerResponse, body: unknown, status = 200) {
    response.writeHead(status, { 'content-type': 'application/json', 'cache-control': 'no-store' });
    response.end(JSON.stringify(body));
  }
  function slow(response: ServerResponse) {
    response.writeHead(200, { 'content-type': 'application/json' });
    response.write('{');
    const timer = setTimeout(() => { timers.delete(timer); response.end('}'); }, 2_000);
    timers.add(timer);
  }
  async function body(request: IncomingMessage) {
    const chunks: Buffer[] = [];
    let length = 0;
    for await (const chunk of request) {
      length += chunk.length;
      if (length > 16_384) throw new Error('Synthetic request too large');
      chunks.push(Buffer.from(chunk));
    }
    return new URLSearchParams(Buffer.concat(chunks).toString('utf8'));
  }
  const server = createServer((request, response) => {
    void (async () => {
      const url = new URL(request.url ?? '/', 'http://127.0.0.1');
      if (url.pathname === paths.authorize && request.method === 'GET') {
        stats.authorizationRequests++;
        const q = url.searchParams;
        const state = q.get('state') ?? '';
        const choice = choices.get(state) ?? {};
        choices.delete(state);
        if (q.get('client_id') !== config.clientId || q.get('redirect_uri') !== config.redirectUri ||
            q.get('response_type') !== 'code' || q.get('response_mode') !== 'query' || q.get('scope') !== 'openid' ||
            q.get('code_challenge_method') !== 'S256' || !q.get('nonce') || !q.get('code_challenge')) {
          json(response, { error: 'invalid_request' }, 400); return;
        }
        const callback = new URL(config.redirectUri);
        callback.searchParams.set('state', state);
        callback.searchParams.set('iss', config.issuer);
        if (choice.error) callback.searchParams.set('error', choice.error);
        else {
          const code = randomBytes(32).toString('base64url');
          codes.set(code, { nonce: q.get('nonce')!, challenge: q.get('code_challenge')!, options: choice });
          callback.searchParams.set('code', code);
        }
        response.writeHead(302, { location: callback.href, 'cache-control': 'no-store' });
        response.end(); return;
      }
      if (url.pathname === paths.token && request.method === 'POST') {
        stats.tokenRequests++;
        const basic = /^Basic ([A-Za-z0-9+/=]+)$/.exec(request.headers.authorization ?? '');
        const pair = basic ? Buffer.from(basic[1], 'base64').toString('utf8').split(':') : [];
        const decode = (value: string) => decodeURIComponent(value.replace(/\+/g, ' '));
        if (pair.length !== 2 || decode(pair[0]) !== config.clientId || decode(pair[1]) !== config.clientSecret) {
          stats.rejectedClientAuthentication++; json(response, { error: 'invalid_client' }, 401); return;
        }
        const form = await body(request);
        const entry = codes.get(form.get('code') ?? '');
        codes.delete(form.get('code') ?? '');
        if (!entry || form.get('grant_type') !== 'authorization_code' || form.get('redirect_uri') !== config.redirectUri) {
          json(response, { error: 'invalid_grant' }, 400); return;
        }
        const challenge = createHash('sha256').update(form.get('code_verifier') ?? '').digest('base64url');
        if (challenge !== entry.challenge) {
          stats.rejectedPkce++; json(response, { error: 'invalid_grant' }, 400); return;
        }
        const choice = entry.options;
        if (choice.tokenMode === 'redirect') { response.writeHead(302, { location: 'https://untrusted.invalid/token' }); response.end(); return; }
        if (choice.tokenMode === 'slow-body') { slow(response); return; }
        if (choice.tokenMode === 'malformed-json') { response.writeHead(200, { 'content-type': 'application/json' }); response.end('{'); return; }
        const now = Math.floor(Date.now() / 1_000);
        const claims: JWTPayload = {
          iss: config.issuer, sub: choice.subject ?? 'synthetic-user', aud: config.clientId,
          iat: now, exp: now + 120, nonce: entry.nonce,
          ...(choice.authenticatedAt === null ? {} : { auth_time: choice.authenticatedAt ?? now }),
          ...(choice.acr === null ? {} : { acr: choice.acr ?? config.mfaAcrValues[0] }),
          ...choice.claims,
        };
        let actualSigner = choice.tokenMode === 'wrong-signature' ? attacker : signer;
        let alg: 'RS256' | 'ES256' = config.signingAlgorithm;
        if (choice.tokenMode === 'wrong-algorithm') { alg = alg === 'ES256' ? 'RS256' : 'ES256'; actualSigner = await key(alg); }
        const idToken = choice.tokenMode === 'unsigned' ? new UnsecuredJWT(claims).encode()
          : await new SignJWT(claims).setProtectedHeader({ alg, kid: choice.keyId ?? signer.kid }).sign(actualSigner.privateKey);
        json(response, {
          access_token: 'synthetic-access-token-' + randomBytes(20).toString('base64url'),
          token_type: choice.tokenMode === 'wrong-token-type' ? 'unsupported' : 'Bearer',
          expires_in: 120,
          ...(choice.tokenMode === 'missing-id-token' ? {} : { id_token: idToken }),
          // Deliberately supplied even though offline_access wasn't requested: client must discard it.
          refresh_token: 'synthetic-refresh-token-' + randomBytes(20).toString('base64url'),
          ...(choice.tokenMode === 'oversize' ? { padding: 'x'.repeat(70_000) } : {}),
        }); return;
      }
      if (url.pathname === paths.jwks && request.method === 'GET') {
        stats.jwksRequests++;
        if (jwksMode === 'redirect') { response.writeHead(302, { location: 'https://untrusted.invalid/jwks' }); response.end(); return; }
        if (jwksMode === 'slow-body') { slow(response); return; }
        if (jwksMode === 'malformed-json') { response.writeHead(200, { 'content-type': 'application/json' }); response.end('{'); return; }
        json(response, { keys, ...(jwksMode === 'oversize' ? { padding: 'x'.repeat(140_000) } : {}) }); return;
      }
      json(response, { error: 'not_found' }, 404);
    })().catch(() => { if (!response.headersSent) json(response, { error: 'synthetic_provider_error' }, 500); else response.destroy(); });
  });
  await new Promise<void>((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
  const address = server.address() as AddressInfo;
  const networkOrigin = `http://127.0.0.1:${address.port}`;
  const allowed = new Set([config.authorizationEndpoint, config.tokenEndpoint, config.jwksUri].map(value => new URL(value).origin + new URL(value).pathname));
  const transport: typeof fetch = async (input, init) => {
    const url = new URL(typeof input === 'string' ? input : input instanceof URL ? input.href : input.url);
    if (!allowed.has(url.origin + url.pathname)) { stats.outsideRequests++; throw new Error('Synthetic transport rejected unpinned endpoint'); }
    if (init?.redirect !== 'manual') throw new Error('Synthetic transport requires no-redirect requests');
    return fetch(networkOrigin + url.pathname + url.search, { ...init, redirect: 'manual' });
  };
  return {
    config, transport, stats,
    async authorize(authorizationUrl: string, choice: SyntheticAuthorizationOptions = {}): Promise<string> {
      const url = new URL(authorizationUrl);
      choices.set(url.searchParams.get('state') ?? '', structuredClone(choice));
      const response = await transport(url, { method: 'GET', redirect: 'manual' });
      const callback = response.headers.get('location');
      if (response.status !== 302 || !callback) throw new Error('Synthetic authorization failed');
      await response.body?.cancel();
      return callback;
    },
    async rotateSigningKey() { signer = await key(); keys = [signer.jwk]; },
    setJwksMode(mode: typeof jwksMode) { jwksMode = mode; },
    async close() {
      for (const timer of timers) clearTimeout(timer);
      timers.clear(); server.closeAllConnections();
      await new Promise<void>(resolve => server.close(() => resolve()));
    },
  };
}

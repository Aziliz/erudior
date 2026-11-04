import { createHash, timingSafeEqual } from 'node:crypto';
import * as oauth from 'oauth4webapi';
import type { Assurance } from './model';

/** A server-owned, reviewed OIDC registration. Never construct this from a request. */
export interface OidcProviderConfig {
  id: string;
  version: number;
  issuer: string;
  authorizationEndpoint: string;
  tokenEndpoint: string;
  jwksUri: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  signingAlgorithm: 'RS256' | 'ES256';
  /** Exact provider assurance-context values independently approved to mean MFA. */
  mfaAcrValues: string[];
}

/** Server-only pending state; the API/store also binds it to a browser cookie. */
export interface OidcTransaction {
  providerId: string;
  providerVersion: number;
  configurationHash: string;
  state: string;
  nonce: string;
  codeVerifier: string;
  createdAt: number;
  expiresAt: number;
}

/** Authenticated identity evidence, not account, guardian, class, or school authority. */
export interface VerifiedOidcIdentity {
  providerId: string;
  providerVersion: number;
  configurationHash: string;
  issuer: string;
  subject: string;
  authenticatedAt: number;
  assurance: Assurance;
}

export interface OidcClient {
  readonly providerId: string;
  readonly providerVersion: number;
  readonly configurationHash: string;
  readonly issuer: string;
  readonly redirectUri: string;
  begin(now: number): Promise<{ authorizationUrl: string; transaction: OidcTransaction }>;
  complete(callbackUrl: string | URL, transaction: unknown, now: number): Promise<VerifiedOidcIdentity>;
}

export interface OidcClientOptions {
  /** Trusted transport injection for isolated tests; production uses HTTPS fetch. */
  transport?: typeof fetch;
  /** Bounded independently of the provider; 100–5000 milliseconds per request. */
  requestTimeoutMs?: number;
}

export class OidcError extends Error {
  constructor(readonly code: 'invalid-configuration' | 'invalid-transaction' | 'authentication-failed') {
    // Do not attach provider errors/causes: they can contain tokens, codes or claims.
    super('Private sign-in could not be completed');
    this.name = 'OidcError';
  }
}

export const OIDC_LIMITS = Object.freeze({
  transactionSeconds: 300,
  authenticationMaxAgeSeconds: 300,
  tokenResponseBytes: 65_536,
  jwksResponseBytes: 131_072,
  callbackUrlCharacters: 8_192,
  requestTimeoutMs: 5_000,
});

const RANDOM = /^[A-Za-z0-9_-]{43}$/;
const PROVIDER_ID = /^[a-z][a-z0-9_-]{0,47}$/;
const CALLBACK_FIELDS = new Set(['code', 'state', 'iss', 'error', 'error_description', 'error_uri', 'session_state']);
const TRANSACTION_FIELDS = ['providerId', 'providerVersion', 'configurationHash', 'state', 'nonce', 'codeVerifier', 'createdAt', 'expiresAt'];

function integer(value: unknown): value is number {
  return Number.isSafeInteger(value) && (value as number) >= 0 && (value as number) <= 253_402_300_799;
}

function text(value: unknown, min: number, max: number): value is string {
  return typeof value === 'string' && value.length >= min && value.length <= max && !/[\u0000-\u0020\u007f]/.test(value);
}

function endpoint(value: unknown): URL {
  if (!text(value, 1, 2_048)) throw new OidcError('invalid-configuration');
  const result = new URL(value);
  if (result.protocol !== 'https:' || result.username || result.password || result.search || result.hash) {
    throw new OidcError('invalid-configuration');
  }
  return result;
}

function equal(left: string, right: string): boolean {
  const a = Buffer.from(left), b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

function pending(value: unknown, config: OidcProviderConfig, hash: string, now: number): OidcTransaction {
  if (!integer(now) || !value || typeof value !== 'object' || Array.isArray(value)) throw new OidcError('invalid-transaction');
  const t = value as Record<string, unknown>;
  if (Object.keys(t).length !== TRANSACTION_FIELDS.length || TRANSACTION_FIELDS.some(key => !Object.hasOwn(t, key)) ||
      t.providerId !== config.id || t.providerVersion !== config.version || t.configurationHash !== hash ||
      typeof t.state !== 'string' || !RANDOM.test(t.state) || typeof t.nonce !== 'string' || !RANDOM.test(t.nonce) ||
      typeof t.codeVerifier !== 'string' || !RANDOM.test(t.codeVerifier) ||
      !integer(t.createdAt) || !integer(t.expiresAt) || t.createdAt > now || t.expiresAt <= now ||
      t.expiresAt !== t.createdAt + OIDC_LIMITS.transactionSeconds) {
    throw new OidcError('invalid-transaction');
  }
  return { ...t } as unknown as OidcTransaction;
}

/**
 * Confidential browser authorization-code client. It never links/creates an account,
 * reads UserInfo, requests offline access, or returns provider tokens. Native redirects
 * are deliberately unsupported here. Its caller MUST atomically consume a browser-bound
 * pending transaction before calling complete(), and recheck current provider and exact
 * issuer/subject identity state in the same transaction that creates the app session.
 */
export function createOidcClient(input: OidcProviderConfig, options: OidcClientOptions = {}): OidcClient {
  let config: OidcProviderConfig;
  let tokenUrl: URL, jwksUrl: URL, callback: URL;
  let timeout: number;
  try {
    if (!input || !PROVIDER_ID.test(input.id) || !integer(input.version) || input.version < 1 ||
        !text(input.clientId, 1, 256) || !text(input.clientSecret, 32, 4_096) ||
        !['RS256', 'ES256'].includes(input.signingAlgorithm) || !Array.isArray(input.mfaAcrValues) ||
        input.mfaAcrValues.length > 16 || input.mfaAcrValues.some(v => !text(v, 1, 256)) ||
        new Set(input.mfaAcrValues).size !== input.mfaAcrValues.length) throw new OidcError('invalid-configuration');
    endpoint(input.issuer);
    endpoint(input.authorizationEndpoint);
    tokenUrl = endpoint(input.tokenEndpoint);
    jwksUrl = endpoint(input.jwksUri);
    callback = endpoint(input.redirectUri);
    if (!callback.pathname.endsWith('/' + input.id)) throw new OidcError('invalid-configuration');
    timeout = options.requestTimeoutMs ?? OIDC_LIMITS.requestTimeoutMs;
    if (!Number.isInteger(timeout) || timeout < 100 || timeout > OIDC_LIMITS.requestTimeoutMs) throw new OidcError('invalid-configuration');
    config = Object.freeze({ ...input, mfaAcrValues: Object.freeze([...input.mfaAcrValues].sort()) as unknown as string[] });
  } catch { throw new OidcError('invalid-configuration'); }

  // This hash stays server-side; it also invalidates flows/sessions on secret rotation.
  const configurationHash = createHash('sha256').update(JSON.stringify([
    config.id, config.version, config.issuer, config.authorizationEndpoint, config.tokenEndpoint,
    config.jwksUri, config.clientId, config.clientSecret, config.redirectUri,
    config.signingAlgorithm, config.mfaAcrValues,
  ])).digest('hex');
  const transport = options.transport ?? fetch;

  async function boundedFetch(url: string, init: RequestInit): Promise<Response> {
    const target = new URL(url);
    const isToken = target.href === tokenUrl.href && init.method === 'POST';
    const isKeys = target.href === jwksUrl.href && init.method === 'GET';
    if (!isToken && !isKeys) throw new OidcError('authentication-failed');
    const maxBytes = isToken ? OIDC_LIMITS.tokenResponseBytes : OIDC_LIMITS.jwksResponseBytes;
    const controller = new AbortController();
    const signal = init.signal ? AbortSignal.any([init.signal, controller.signal]) : controller.signal;
    const timer = setTimeout(() => controller.abort(), timeout);
    let rejectAbort: (() => void) | undefined;
    const aborted = new Promise<never>((_resolve, reject) => {
      rejectAbort = () => reject(new OidcError('authentication-failed'));
      signal.addEventListener('abort', rejectAbort, { once: true });
      if (signal.aborted) rejectAbort();
    });
    let reader: ReadableStreamDefaultReader<Uint8Array> | undefined;
    try {
      const response = await Promise.race([transport(url, { ...init, redirect: 'manual', signal }), aborted]);
      const contentType = response.headers.get('content-type')?.split(';')[0].trim().toLowerCase();
      if (response.status !== 200 || response.redirected ||
          !(contentType === 'application/json' || isKeys && contentType === 'application/jwk-set+json') || !response.body) {
        void response.body?.cancel().catch(() => undefined);
        throw new OidcError('authentication-failed');
      }
      const length = response.headers.get('content-length');
      if (length !== null && (!/^\d+$/.test(length) || Number(length) > maxBytes)) {
        void response.body.cancel().catch(() => undefined);
        throw new OidcError('authentication-failed');
      }
      reader = response.body.getReader();
      const chunks: Uint8Array[] = [];
      let total = 0;
      for (;;) {
        const { done, value } = await Promise.race([reader.read(), aborted]);
        if (done) break;
        total += value.byteLength;
        if (total > maxBytes) throw new OidcError('authentication-failed');
        chunks.push(value);
      }
      const body = Buffer.concat(chunks);
      const headers = new Headers(response.headers);
      headers.delete('content-length');
      headers.delete('content-encoding');
      return new Response(body, { status: 200, headers });
    } finally {
      clearTimeout(timer);
      if (rejectAbort) signal.removeEventListener('abort', rejectAbort);
      // Cancel on oversize/timeouts without waiting on a hostile endless response body.
      if (reader) { void reader.cancel().catch(() => undefined); reader.releaseLock(); }
      controller.abort();
    }
  }

  return Object.freeze({
    providerId: config.id,
    providerVersion: config.version,
    configurationHash,
    issuer: config.issuer,
    redirectUri: config.redirectUri,
    async begin(now: number) {
      if (!integer(now) || !integer(now + OIDC_LIMITS.transactionSeconds)) throw new OidcError('invalid-transaction');
      const transaction: OidcTransaction = {
        providerId: config.id, providerVersion: config.version, configurationHash,
        state: oauth.generateRandomState(), nonce: oauth.generateRandomNonce(),
        codeVerifier: oauth.generateRandomCodeVerifier(), createdAt: now, expiresAt: now + OIDC_LIMITS.transactionSeconds,
      };
      const authorizationUrl = new URL(config.authorizationEndpoint);
      authorizationUrl.searchParams.set('client_id', config.clientId);
      authorizationUrl.searchParams.set('redirect_uri', config.redirectUri);
      authorizationUrl.searchParams.set('response_type', 'code');
      authorizationUrl.searchParams.set('response_mode', 'query');
      authorizationUrl.searchParams.set('scope', 'openid');
      authorizationUrl.searchParams.set('state', transaction.state);
      authorizationUrl.searchParams.set('nonce', transaction.nonce);
      authorizationUrl.searchParams.set('code_challenge', await oauth.calculatePKCECodeChallenge(transaction.codeVerifier));
      authorizationUrl.searchParams.set('code_challenge_method', 'S256');
      authorizationUrl.searchParams.set('max_age', String(OIDC_LIMITS.authenticationMaxAgeSeconds));
      authorizationUrl.searchParams.set('prompt', 'login');
      if (config.mfaAcrValues.length) authorizationUrl.searchParams.set('acr_values', config.mfaAcrValues.join(' '));
      return { authorizationUrl: authorizationUrl.href, transaction };
    },
    async complete(callbackUrl: string | URL, transaction: unknown, now: number): Promise<VerifiedOidcIdentity> {
      try {
        const wallStart = Math.floor(Date.now() / 1_000);
        const t = pending(transaction, config, configurationHash, now);
        const current = new URL(callbackUrl);
        if (current.href.length > OIDC_LIMITS.callbackUrlCharacters || current.origin !== callback.origin ||
            current.pathname !== callback.pathname || current.username || current.password || current.hash) throw new OidcError('authentication-failed');
        for (const [key, value] of current.searchParams) {
          if (!CALLBACK_FIELDS.has(key) || current.searchParams.getAll(key).length !== 1 || value.length > 2_048 || /[\u0000-\u001f\u007f]/.test(value)) {
            throw new OidcError('authentication-failed');
          }
        }
        if (!equal(current.searchParams.get('state') ?? '', t.state) || current.searchParams.get('iss') !== config.issuer) throw new OidcError('authentication-failed');
        const code = current.searchParams.get('code');
        if (!text(code, 1, 2_048) || current.searchParams.has('error')) throw new OidcError('authentication-failed');

        // A new metadata object intentionally obtains current JWKS for each login.
        // There is no stale-key fallback; provider key rotation/removal is immediately observed.
        const as: oauth.AuthorizationServer = {
          issuer: config.issuer, authorization_endpoint: config.authorizationEndpoint,
          token_endpoint: config.tokenEndpoint, jwks_uri: config.jwksUri,
          authorization_response_iss_parameter_supported: true,
          id_token_signing_alg_values_supported: [config.signingAlgorithm],
          code_challenge_methods_supported: ['S256'],
        };
        const client: oauth.Client = {
          client_id: config.clientId, id_token_signed_response_alg: config.signingAlgorithm,
          require_auth_time: true, default_max_age: OIDC_LIMITS.authenticationMaxAgeSeconds,
          [oauth.clockTolerance]: 0, [oauth.clockSkew]: now - wallStart,
        };
        const params = oauth.validateAuthResponse(as, client, current, t.state);
        const response = await oauth.authorizationCodeGrantRequest(as, client,
          oauth.ClientSecretBasic(config.clientSecret), params, config.redirectUri, t.codeVerifier,
          { [oauth.customFetch]: boundedFetch });
        const result = await oauth.processAuthorizationCodeResponse(as, client, response,
          { expectedNonce: t.nonce, maxAge: OIDC_LIMITS.authenticationMaxAgeSeconds, requireIdToken: true });
        await oauth.validateApplicationLevelSignature(as, response, { [oauth.customFetch]: boundedFetch });
        const claims = oauth.getValidatedIdTokenClaims(result);
        const verifiedAt = now + Math.max(0, Math.floor(Date.now() / 1_000) - wallStart);
        if (!claims || result.token_type !== 'bearer' || !text(claims.sub, 1, 255) || claims.iss !== config.issuer ||
            !integer(claims.iat) || !integer(claims.exp) || !integer(claims.auth_time) ||
            t.expiresAt <= verifiedAt || claims.iat > verifiedAt || claims.iat < t.createdAt || claims.exp <= verifiedAt || claims.exp <= claims.iat ||
            claims.auth_time > verifiedAt || claims.auth_time > claims.iat ||
            claims.auth_time + OIDC_LIMITS.authenticationMaxAgeSeconds <= verifiedAt ||
            claims.azp !== undefined && claims.azp !== config.clientId ||
            claims.acr !== undefined && typeof claims.acr !== 'string') {
          throw new OidcError('authentication-failed');
        }
        // Ignore names, email/email_verified, groups, roles, ages, schools and amr.
        // Only an explicitly reviewed provider acr mapping can elevate assurance.
        const assurance: Assurance = typeof claims.acr === 'string' && config.mfaAcrValues.includes(claims.acr) ? 'mfa' : 'single-factor';
        return {
          providerId: config.id, providerVersion: config.version, configurationHash,
          issuer: config.issuer, subject: claims.sub, authenticatedAt: claims.auth_time, assurance,
        };
      } catch { throw new OidcError('authentication-failed'); }
    },
  });
}

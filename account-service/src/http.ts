import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { createPrivateAccountBrowserUi, PRIVATE_ACCOUNT_UI_CONFIG_PATH, PRIVATE_ACCOUNT_UI_CSP, type PrivateAccountBrowserUiConfig } from './browserUi.ts';
import { isAccountId, isAccountTimestamp } from './model.ts';
import type { OidcClient } from './oidc.ts';
import type { PostgresAccountStore, StoredSession } from './store.ts';

/** Private browser BFF boundary. This handler has no deployment or signup route. */
export type PrivateAccountStore = Pick<PostgresAccountStore,
  'beginLogin' | 'consumeLogin' | 'establishSession' | 'getSession' | 'switchContext' | 'revokeSession' | 'readRecord'>;

/** Opt-in capability; omitting it leaves every export route unavailable. */
export type PrivateAccountExportStore = Pick<PostgresAccountStore,
  'requestRecordExport' | 'getRecordExport' | 'downloadRecordExport' | 'cancelRecordExport'> & Partial<Pick<PostgresAccountStore, 'listExportableRecords' | 'listRecordExports'>>;

/** Explicit private host capability; absent means device management is unavailable. */
export type PrivateAccountDeviceStore = Pick<PostgresAccountStore,
  'listDeviceSessions' | 'revokeDeviceSessions'>;

export interface PrivateAccountAuditEvent {
  requestId: string;
  operation: 'login.start' | 'login.complete' | 'session.read' | 'session.switch' | 'session.logout' | 'record.read' | 'export.request' | 'export.status' | 'export.download' | 'export.cancel' | 'export.records' | 'export.list' | 'devices.list' | 'devices.revoke' | 'request';
  outcome: 'success' | 'denied' | 'error';
}
export interface PrivateAccountHttpConfig {
  /** One exact HTTPS application origin. Public-site and community origins are not inferred. */
  origin: string;
  /** Fixed application landing path; never supplied by the login request or provider. */
  returnPath: string;
  providers: readonly OidcClient[];
  store: PrivateAccountStore;
  /** Explicit host opt-in, separate from session/read access. No public export endpoints. */
  exports?: PrivateAccountExportStore;
  /** Separate opt-in; never mounted by the public application. */
  devices?: PrivateAccountDeviceStore;
  /** Separate, server-owned secret. Rotation requires session invalidation/relogin. */
  csrfKey: Uint8Array;
  /** Explicit private-only UI opt-in. Omitted by default; no public host wiring. */
  browserUI?: PrivateAccountBrowserUiConfig;
  /** Trusted server clock, injectable only by the host/test harness. Never request data. */
  clock?: () => number;
  /** Deliberately excludes URLs, cookies, provider claims, identifiers and record content. */
  audit?: (event: PrivateAccountAuditEvent) => void;
}

export const PRIVATE_ACCOUNT_SESSION_COOKIE = '__Host-erudior-account';
export const PRIVATE_ACCOUNT_LOGIN_COOKIE = '__Host-erudior-login';
const TOKEN = /^[A-Za-z0-9_-]{43}$/;
const PROVIDER_ID = /^[a-z][a-z0-9_-]{0,47}$/;
const MAX_BODY_BYTES = 4096;
const MAX_URL_LENGTH = 8192;
const REQUEST_HEADER = 'x-erudior-request';
const CSRF_HEADER = 'x-erudior-csrf';
type PublicError = 'invalid_request' | 'authentication_required' | 'request_denied' | 'not_found' | 'service_unavailable';
class HttpFailure extends Error {
  constructor(readonly status: number, readonly code: PublicError) { super(code); }
}
function bad(): never { throw new HttpFailure(400, 'invalid_request'); }
function denied(): never { throw new HttpFailure(403, 'request_denied'); }
const digest = (value: string): string => createHash('sha256').update(value).digest('hex');
const token = (): string => randomBytes(32).toString('base64url');
const equal = (left: string, right: string): boolean => {
  const a = Buffer.from(left), b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
};

function cookies(request: Request): Map<string, string> {
  const header = request.headers.get('cookie') ?? '';
  if (Buffer.byteLength(header) > 8192 || /[\r\n\0]/.test(header)) bad();
  const result = new Map<string, string>();
  for (const part of header.split(';')) {
    const item = part.trim();
    if (!item) continue;
    const split = item.indexOf('=');
    if (split < 1) bad();
    const name = item.slice(0, split), value = item.slice(split + 1);
    if (name !== PRIVATE_ACCOUNT_SESSION_COOKIE && name !== PRIVATE_ACCOUNT_LOGIN_COOKIE) continue;
    if (result.has(name) || !TOKEN.test(value)) bad();
    result.set(name, value);
  }
  return result;
}

function setCookie(name: string, value: string, maxAge: number, sameSite: 'Strict' | 'Lax'): string {
  return `${name}=${value}; Path=/; Max-Age=${maxAge}; Secure; HttpOnly; SameSite=${sameSite}`;
}
const clearLoginCookie = (): string => setCookie(PRIVATE_ACCOUNT_LOGIN_COOKIE, '', 0, 'Lax');
const clearSessionCookie = (): string => setCookie(PRIVATE_ACCOUNT_SESSION_COOKIE, '', 0, 'Strict');

async function jsonBody(request: Request, required: string[], optional: string[] = []): Promise<Record<string, unknown>> {
  if (!/^application\/json(?:\s*;\s*charset=utf-8)?$/i.test(request.headers.get('content-type') ?? '')) bad();
  if (request.headers.has('content-encoding')) bad();
  const length = request.headers.get('content-length');
  if (length !== null && (!/^\d{1,6}$/.test(length) || Number(length) > MAX_BODY_BYTES)) bad();
  if (!request.body) bad();
  const reader = request.body.getReader();
  const parts: Uint8Array[] = [];
  let bytes = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new HttpFailure(400, 'invalid_request')), 5000);
  });
  try {
    for (;;) {
      const next = await Promise.race([reader.read(), timeout]);
      if (next.done) break;
      bytes += next.value.byteLength;
      if (bytes > MAX_BODY_BYTES) bad();
      parts.push(next.value);
    }
    if (length !== null && Number(length) !== bytes) bad();
    const decoded = new TextDecoder('utf-8', { fatal: true }).decode(Buffer.concat(parts));
    const value: unknown = JSON.parse(decoded);
    if (!value || typeof value !== 'object' || Array.isArray(value)) bad();
    const object = value as Record<string, unknown>;
    if (required.some(key => !Object.hasOwn(object, key)) || Object.keys(object).some(key => ![...required, ...optional].includes(key))) bad();
    return object;
  } catch (error) {
    void reader.cancel().catch(() => undefined);
    if (error instanceof HttpFailure) throw error;
    return bad();
  } finally {
    if (timer) clearTimeout(timer);
    try { reader.releaseLock(); } catch { /* cancelled pending body read */ }
  }
}

/**
 * A Fetch Request/Response adapter for a separate private service. The application
 * must route it at its own configured origin; there is intentionally no CORS,
 * public-website login, production binding, native credential bridge or graph API.
 * All identity and authority resolution occurs in the store, never in request JSON.
 */
export function createPrivateAccountHandler(config: PrivateAccountHttpConfig): (request: Request) => Promise<Response> {
  const parsedOrigin = new URL(config.origin);
  if (parsedOrigin.protocol !== 'https:' || parsedOrigin.origin !== config.origin || parsedOrigin.username || parsedOrigin.password || parsedOrigin.pathname !== '/' || parsedOrigin.search || parsedOrigin.hash) throw new Error('Invalid private account origin');
  if (!/^\/[A-Za-z0-9/_-]*$/.test(config.returnPath) || config.returnPath.startsWith('//')) throw new Error('Invalid private account return path');
  if (!(config.csrfKey instanceof Uint8Array) || config.csrfKey.byteLength < 32 || config.csrfKey.byteLength > 128) throw new Error('Invalid private account CSRF key');
  const key = Buffer.from(config.csrfKey);
  const origin = config.origin, returnPath = config.returnPath, returnUrl = new URL(returnPath, origin).href;
  const providers = new Map<string, OidcClient>();
  for (const client of config.providers) {
    if (!PROVIDER_ID.test(client.providerId) || providers.has(client.providerId) || client.redirectUri !== `${origin}/v1/auth/callback/${client.providerId}`) throw new Error('Invalid private account provider registration');
    providers.set(client.providerId, client);
  }
  if (!providers.size) throw new Error('Private account provider required');
  const browserUI = config.browserUI ? createPrivateAccountBrowserUi(config.browserUI, [...providers.keys()], returnPath, !!config.devices, !!config.exports && ['requestRecordExport', 'getRecordExport', 'downloadRecordExport', 'cancelRecordExport', 'listExportableRecords', 'listRecordExports'].every(name => typeof (config.exports as unknown as Record<string, unknown>)[name] === 'function')) : null;
  const now = (): number => {
    const value = config.clock ? config.clock() : Math.floor(Date.now() / 1000);
    if (!isAccountTimestamp(value)) throw new Error('Invalid private account clock');
    return value;
  };
  const csrf = (rawToken: string): string => createHmac('sha256', key).update(`erudior-private-account-csrf:v1:${rawToken}`).digest('base64url');
  const publicSession = (stored: StoredSession, rawToken: string) => ({
    session: {
      id: stored.session.id, version: stored.session.version, accountId: stored.session.principal.id,
      activeWorkspaceId: stored.session.activeWorkspaceId, expiresAt: stored.session.expiresAt,
      contexts: stored.availableContexts.map(context => ({ workspaceId: context.workspaceId, kind: context.kind })),
    },
    csrfToken: csrf(rawToken),
  });
  const requireBrowserRequest = (request: Request, mutation = false): void => {
    if (request.headers.get(REQUEST_HEADER) !== '1') denied();
    const source = request.headers.get('origin');
    if (source !== null && source !== origin || mutation && source !== origin) denied();
    const site = request.headers.get('sec-fetch-site');
    if (site !== null && site !== 'same-origin') denied();
  };

  return async (request: Request): Promise<Response> => {
    const requestId = randomBytes(16).toString('hex');
    let operation: PrivateAccountAuditEvent['operation'] = 'request';
    let callback = false;
    const response = (status: number, value: unknown = null, additions: [string, string][] = [], rawType?: string): Response => {
      const headers = new Headers({
        'Cache-Control': 'no-store, max-age=0', Pragma: 'no-cache', 'Referrer-Policy': 'no-referrer',
        'X-Content-Type-Options': 'nosniff', 'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'",
        'X-Frame-Options': 'DENY', 'X-Request-Id': requestId,
      });
      for (const [name, item] of additions) headers.append(name, item);
      if (callback && !additions.some(([name, item]) => name.toLowerCase() === 'set-cookie' && item.startsWith(`${PRIVATE_ACCOUNT_LOGIN_COOKIE}=`))) headers.append('Set-Cookie', clearLoginCookie());
      try { config.audit?.({ requestId, operation, outcome: status < 400 ? 'success' : status >= 500 ? 'error' : 'denied' }); } catch { /* diagnostics cannot alter access decisions */ }
      if (callback && browserUI && status >= 400) {
        headers.set('Location', `${returnUrl}#sign-in-failed`);
        return new Response(null, { status: 303, headers });
      }
      if (rawType) {
        headers.set('Content-Type', rawType);
        headers.set('Content-Security-Policy', PRIVATE_ACCOUNT_UI_CSP);
        return new Response(String(value), { status, headers });
      }
      if (status === 204 || status === 303) return new Response(null, { status, headers });
      headers.set('Content-Type', 'application/json; charset=utf-8');
      return new Response(JSON.stringify(value), { status, headers });
    };
    try {
      const url = new URL(request.url);
      if (url.origin !== origin || url.username || url.password || url.hash) bad();
      const path = url.pathname;
      if (/%|\\|\/\//.test(path)) bad();
      const callbackMatch = /^\/v1\/auth\/callback\/([a-z][a-z0-9_-]{0,47})$/.exec(path);
      // Identify only a validated exact-origin callback route before rejecting malformed input.
      // Opt-in failures then leave no provider values on the private landing URL.
      if (callbackMatch && browserUI) { callback = true; operation = 'login.complete'; }
      if (request.url.length > MAX_URL_LENGTH) bad();
      if (request.headers.has('authorization') || request.headers.has('x-http-method-override')) bad();
      const jar = cookies(request);
      const recordMatch = /^\/v1\/workspaces\/([A-Za-z0-9_-]+)\/records\/([A-Za-z0-9_-]+)$/.exec(path);
      const exportRecords = typeof config.exports?.listExportableRecords === 'function' && path === '/v1/exports/records';
      const exportList = typeof config.exports?.listRecordExports === 'function' && path === '/v1/exports' && request.method === 'GET';
      const exportMatch = config.exports && path !== '/v1/exports/records' ? /^\/v1\/exports\/([A-Za-z0-9_-]+)(?:\/(download|cancel))?$/.exec(path) : null;
      const exportCreate = !!config.exports && path === '/v1/exports' && !exportList;
      const devicesList = !!config.devices && path === '/v1/devices';
      const devicesRevoke = !!config.devices && path === '/v1/devices/revoke';
      if (!callbackMatch && !exportRecords && !exportList && url.search) bad();
      if (browserUI && (browserUI.matches(path) || path === PRIVATE_ACCOUNT_UI_CONFIG_PATH)) {
        if (request.method !== 'GET') return response(405, { error: 'invalid_request' }, [['Allow', 'GET']]);
        if (request.body !== null || request.headers.has('content-length') && request.headers.get('content-length') !== '0') bad();
        if (path === PRIVATE_ACCOUNT_UI_CONFIG_PATH) {
          requireBrowserRequest(request);
          return response(200, JSON.parse(browserUI.config()));
        }
        const source = request.headers.get('origin');
        if (source !== null && source !== origin) denied();
        const site = request.headers.get('sec-fetch-site');
        const mode = request.headers.get('sec-fetch-mode');
        const destination = request.headers.get('sec-fetch-dest');
        if (path === returnPath) {
          // Top-level navigation is allowed after an external IdP redirect. No account data is in the shell.
          if (mode !== null && mode !== 'navigate' || destination !== null && destination !== 'document') denied();
          if (site !== null && !['same-origin', 'none', 'cross-site', 'same-site'].includes(site)) denied();
        } else if (site !== null && site !== 'same-origin') denied();
        const content = browserUI.content(path);
        return response(200, content.body, [], content.type);
      }
      const method = exportRecords || exportList ? 'GET' : devicesRevoke || exportCreate || exportMatch?.[2] === 'cancel' ? 'POST' : devicesList || exportMatch ? 'GET' : path === '/health' || path === '/v1/session' || callbackMatch || recordMatch ? 'GET'
        : ['/v1/auth/start', '/v1/session/context', '/v1/session/logout'].includes(path) ? 'POST' : null;
      if (!method) return response(404, { error: 'not_found' });
      if (request.method !== method) return response(405, { error: 'invalid_request' }, [['Allow', method]]);
      if (method === 'GET' && (request.body !== null || request.headers.has('content-length') && request.headers.get('content-length') !== '0')) bad();
      if (path === '/health') return response(200, { service: 'erudior-private-accounts', status: 'ready' });

      if (path === '/v1/auth/start') {
        operation = 'login.start';
        requireBrowserRequest(request, true);
        const body = await jsonBody(request, ['providerId'], ['workspaceId']);
        if (typeof body.providerId !== 'string' || !PROVIDER_ID.test(body.providerId) || body.workspaceId !== undefined && !isAccountId(body.workspaceId)) bad();
        const provider = providers.get(body.providerId);
        if (!provider) bad();
        const started = await provider.begin(now());
        const binding = token();
        // The Strict account cookie is available here, but normally absent on
        // the cross-site provider callback. Bind replacement to the server flow.
        const previous = jar.get(PRIVATE_ACCOUNT_SESSION_COOKIE);
        await config.store.beginLogin({
          stateHash: digest(started.transaction.state), bindingHash: digest(binding),
          transaction: started.transaction, workspaceId: body.workspaceId as string | undefined ?? null,
          ...(previous ? { replacesTokenHash: digest(previous), replacesCsrfHash: digest(csrf(previous)) } : {}),
        });
        return response(200, { authorizationUrl: started.authorizationUrl, expiresAt: started.transaction.expiresAt }, [
          ['Set-Cookie', setCookie(PRIVATE_ACCOUNT_LOGIN_COOKIE, binding, Math.max(1, started.transaction.expiresAt - now()), 'Lax')],
        ]);
      }

      if (callbackMatch) {
        callback = true;
        operation = 'login.complete';
        const allowed = new Set(['code', 'state', 'iss', 'error', 'error_description', 'error_uri', 'session_state']);
        const seen = new Set<string>();
        for (const [name, value] of url.searchParams) {
          if (!allowed.has(name) || seen.has(name) || !value || value.length > 4096) bad();
          seen.add(name);
        }
        const state = url.searchParams.get('state'), binding = jar.get(PRIVATE_ACCOUNT_LOGIN_COOKIE);
        if (!state || !TOKEN.test(state) || !binding) bad();
        const provider = providers.get(callbackMatch[1]);
        if (!provider) bad();
        const pending = await config.store.consumeLogin({ stateHash: digest(state), bindingHash: digest(binding) });
        if (!pending || pending.transaction.providerId !== provider.providerId || pending.transaction.providerVersion !== provider.providerVersion || pending.transaction.configurationHash !== provider.configurationHash) bad();
        let identity;
        try { identity = await provider.complete(url, pending.transaction, now()); } catch { return response(400, { error: 'invalid_request' }); }
        const opaque = token(), csrfToken = csrf(opaque);
        const stored = await config.store.establishSession({
          identity, configurationHash: provider.configurationHash, workspaceId: pending.workspaceId,
          tokenHash: digest(opaque), csrfHash: digest(csrfToken),
          ...(pending.replacesTokenHash ? { replacesTokenHash: pending.replacesTokenHash, replacesCsrfHash: pending.replacesCsrfHash } : {}),
        });
        if (!stored) return response(400, { error: 'invalid_request' });
        return response(303, null, [
          ['Location', returnUrl], ['Set-Cookie', clearLoginCookie()],
          ['Set-Cookie', setCookie(PRIVATE_ACCOUNT_SESSION_COOKIE, opaque, Math.max(1, stored.session.expiresAt - now()), 'Strict')],
        ]);
      }

      requireBrowserRequest(request, method === 'POST');
      const opaque = jar.get(PRIVATE_ACCOUNT_SESSION_COOKIE);
      if (!opaque) throw new HttpFailure(401, 'authentication_required');
      const stored = await config.store.getSession(digest(opaque));
      if (!stored || !equal(stored.csrfHash, digest(csrf(opaque)))) return response(401, { error: 'authentication_required' }, [['Set-Cookie', clearSessionCookie()]]);
      if (method === 'POST') {
        const supplied = request.headers.get(CSRF_HEADER);
        if (!supplied || !TOKEN.test(supplied) || !equal(supplied, csrf(opaque))) denied();
      }
      if (devicesList) {
        operation = 'devices.list';
        const devices = await config.devices!.listDeviceSessions(digest(opaque));
        if (!devices) return response(404, { error: 'not_found' });
        return response(200, { devices });
      }
      if (devicesRevoke) {
        operation = 'devices.revoke';
        const body = await jsonBody(request, [], ['sessionId']);
        if (Object.hasOwn(body, 'sessionId') && !isAccountId(body.sessionId)) bad();
        const result = await config.devices!.revokeDeviceSessions({
          tokenHash: digest(opaque), csrfHash: digest(csrf(opaque)),
          ...(typeof body.sessionId === 'string' ? { sessionId: body.sessionId } : {}),
        });
        if (!result) return response(404, { error: 'not_found' });
        return response(200, result, result.currentRevoked ? [['Set-Cookie', clearSessionCookie()]] : []);
      }
      if (exportRecords || exportList) {
        operation = exportRecords ? 'export.records' : 'export.list';
        const params = url.searchParams;
        if ([...params.keys()].some(k => !['workspaceId', 'limit', 'cursor'].includes(k) || params.getAll(k).length !== 1)) bad();
        const workspaceId = params.get('workspaceId'), limitText = params.get('limit'), cursor = params.get('cursor');
        if (!isAccountId(workspaceId) || limitText !== null && (!/^[1-9][0-9]?$/.test(limitText) || Number(limitText) > 32) || cursor !== null && (cursor.length > 2048 || !/^[A-Za-z0-9_-]+\.[a-f0-9]{64}$/.test(cursor))) bad();
        const input = { workspaceId, ...(limitText === null ? {} : { limit: Number(limitText) }), ...(cursor === null ? {} : { cursor }) };
        const result = exportRecords ? await config.exports!.listExportableRecords!(digest(opaque), input) : await config.exports!.listRecordExports!(digest(opaque), input);
        if (!result) return response(404, { error: 'not_found' });
        return response(200, result);
      }
      if (exportCreate) {
        operation = 'export.request';
        const body = await jsonBody(request, ['workspaceId', 'records', 'requestId']);
        if (!isAccountId(body.workspaceId) || !isAccountId(body.requestId) || !Array.isArray(body.records) || body.records.length < 1 || body.records.length > 32) bad();
        const records: { id: string; version: number }[] = [];
        const seen = new Set<string>();
        for (const item of body.records) {
          if (!item || typeof item !== 'object' || Array.isArray(item) || Object.keys(item).sort().join(',') !== 'id,version') bad();
          const record = item as Record<string, unknown>;
          if (!isAccountId(record.id) || typeof record.version !== 'number' || !Number.isSafeInteger(record.version) || record.version < 1 || seen.has(record.id)) bad();
          seen.add(record.id);
          records.push({ id: record.id, version: record.version });
        }
        const result = await config.exports!.requestRecordExport(digest(opaque), digest(csrf(opaque)), {
          workspaceId: body.workspaceId, requestId: body.requestId, records,
        });
        if (!result) return response(404, { error: 'not_found' });
        return response(200, { export: result });
      }
      if (exportMatch) {
        const exportId = exportMatch[1], action = exportMatch[2];
        if (!isAccountId(exportId)) bad();
        if (action === 'download') {
          operation = 'export.download';
          const result = await config.exports!.downloadRecordExport(digest(opaque), exportId);
          if (!result) return response(404, { error: 'not_found' });
          return response(200, result.artifact, [['Content-Disposition', 'attachment; filename="erudior-record-export.json"']]);
        }
        if (action === 'cancel') {
          operation = 'export.cancel';
          await jsonBody(request, []);
          const result = await config.exports!.cancelRecordExport(digest(opaque), digest(csrf(opaque)), exportId);
          if (!result) return response(404, { error: 'not_found' });
          return response(200, { export: result });
        }
        operation = 'export.status';
        const result = await config.exports!.getRecordExport(digest(opaque), exportId);
        if (!result) return response(404, { error: 'not_found' });
        return response(200, { export: result });
      }
      if (path === '/v1/session') {
        operation = 'session.read';
        return response(200, publicSession(stored, opaque));
      }
      if (path === '/v1/session/context') {
        operation = 'session.switch';
        const body = await jsonBody(request, ['workspaceId']);
        if (!isAccountId(body.workspaceId)) bad();
        const next = token(), nextCsrf = csrf(next);
        const switched = await config.store.switchContext({ tokenHash: digest(opaque), csrfHash: digest(csrf(opaque)), workspaceId: body.workspaceId, newTokenHash: digest(next), newCsrfHash: digest(nextCsrf) });
        if (!switched) denied();
        return response(200, publicSession(switched, next), [['Set-Cookie', setCookie(PRIVATE_ACCOUNT_SESSION_COOKIE, next, Math.max(1, switched.session.expiresAt - now()), 'Strict')]]);
      }
      if (path === '/v1/session/logout') {
        operation = 'session.logout';
        await jsonBody(request, []);
        if (!await config.store.revokeSession({ tokenHash: digest(opaque), csrfHash: digest(csrf(opaque)) })) denied();
        return response(204, null, [['Set-Cookie', clearSessionCookie()]]);
      }
      if (recordMatch) {
        operation = 'record.read';
        if (!isAccountId(recordMatch[1]) || !isAccountId(recordMatch[2])) bad();
        const record = await config.store.readRecord({ tokenHash: digest(opaque), workspaceId: recordMatch[1], recordId: recordMatch[2] });
        if (!record) return response(404, { error: 'not_found' });
        return response(200, { record }, [['ETag', `"${record.version}"`]]);
      }
      return response(404, { error: 'not_found' });
    } catch (error) {
      if (error instanceof HttpFailure) return response(error.status, { error: error.code });
      return response(503, { error: 'service_unavailable' });
    }
  };
}

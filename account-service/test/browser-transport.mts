/** Test-only synthetic HTTPS transport. Chromium still owns site isolation,
 * navigation, Origin/Fetch-Metadata and its cookie jar. No injected cookies,
 * TLS-warning bypass, browser trust changes, or authorization mocks. This is
 * deliberately NOT evidence for production DNS, certificates or TLS ingress. */
import { createServer, request as httpRequest } from 'node:http';
import type { AddressInfo } from 'node:net';
import type { BrowserContext, Page } from 'playwright';

export async function listenHttp(handler: (request: Request) => Promise<Response>, origin: string) {
  const server = createServer((incoming, outgoing) => {
    void (async () => {
      const chunks: Buffer[] = [];
      for await (const chunk of incoming) chunks.push(Buffer.from(chunk));
      const headers = new Headers();
      for (let i = 0; i < incoming.rawHeaders.length; i += 2) headers.append(incoming.rawHeaders[i]!, incoming.rawHeaders[i + 1]!);
      const method = incoming.method ?? 'GET';
      const response = await handler(new Request(origin + incoming.url, { method, headers,
        ...(!['GET', 'HEAD'].includes(method) ? { body: Buffer.concat(chunks) } : {}) }));
      outgoing.statusCode = response.status;
      response.headers.forEach((value, key) => { if (key !== 'set-cookie') outgoing.setHeader(key, value); });
      const cookies = response.headers.getSetCookie();
      if (cookies.length) outgoing.setHeader('set-cookie', cookies);
      outgoing.end(Buffer.from(await response.arrayBuffer()));
    })().catch(() => { outgoing.statusCode = 500; outgoing.end('synthetic transport failed'); });
  });
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
  return { origin: `http://127.0.0.1:${(server.address() as AddressInfo).port}`,
    close: async () => { server.closeAllConnections(); await new Promise<void>(resolve => server.close(() => resolve())); } };
}

/** A network terminal event may arrive before or after Fetch fulfillment.
 * Keep the observation alive until that event, not just until CDP send resolves.
 * Exported only for deterministic test-helper ordering tests. */
export function browserCancellationObservation() {
  let complete!: (cancelled: boolean) => void;
  const terminal = new Promise<boolean>(resolve => { complete = resolve; });
  return {
    complete,
    async wait(timeoutMs = 5000): Promise<boolean> {
      let timeout!: ReturnType<typeof setTimeout>;
      try {
        return await Promise.race([terminal, new Promise<boolean>(resolve => { timeout = setTimeout(() => resolve(false), timeoutMs); })]);
      } finally { clearTimeout(timeout); }
    },
  };
}

export interface ObservedRequest { url: URL; method: string; headers: Record<string, string>; body: Buffer | null }
export interface ForwardedResponse { status: number; headers: Record<string, string>; body: Buffer }
export async function installTransport(context: BrowserContext, origins: ReadonlyMap<string, string>, hooks: {
  before?: (request: ObservedRequest) => Promise<'abort' | void>;
  after?: (request: ObservedRequest, response: ForwardedResponse) => Promise<'abort' | void>;
  failure?: (path: string) => void;
  // Opt-in per-request expectation; only Chromium-confirmed cancellation counts.
  expectedCancellation?: (request: ObservedRequest) => boolean;
  cancelled?: (request: ObservedRequest) => void;
} = {}) {
  // Playwright's high-level route handler deliberately skips redirect hops.
  // Intercept with the public Chromium CDP session API instead so every hop is
  // forwarded, with its own browser-computed SameSite cookie/header decisions.
  const attached = new Map<Page, Promise<void>>();
  const attach = (page: Page): Promise<void> => {
    const existing = attached.get(page); if (existing) return existing;
    const ready = (async () => {
      const cdp = await context.newCDPSession(page);
      const pending = new Map<string, ReturnType<typeof browserCancellationObservation>>();
      cdp.on('Network.loadingFailed', event => {
        pending.get(event.requestId)?.complete(event.canceled === true);
      });
      cdp.on('Network.loadingFinished', event => { pending.get(event.requestId)?.complete(false); });
      await cdp.send('Network.enable');
      cdp.on('Fetch.requestPaused', event => {
        const observation = browserCancellationObservation();
        const state: { request?: ObservedRequest; fulfilling: boolean } = { fulfilling: false };
        if (event.networkId) pending.set(event.networkId, observation);
        void (async () => {
          const url = new URL(event.request.url), target = origins.get(url.origin);
          if (!target) { await cdp.send('Fetch.failRequest', { requestId: event.requestId, errorReason: 'BlockedByClient' }); return; }
          const headers = Object.fromEntries(Object.entries(event.request.headers).map(([key, value]) => [key.toLowerCase(), String(value)]));
          const observed: ObservedRequest = { url, method: event.request.method, headers,
            body: event.request.postData === undefined ? null : Buffer.from(event.request.postData) };
          state.request = observed;
          const abort = () => cdp.send('Fetch.failRequest', { requestId: event.requestId, errorReason: 'Failed' });
          if (await hooks.before?.(observed) === 'abort') { await abort(); return; }
          const forwarded = await new Promise<ForwardedResponse>((resolve, reject) => {
            const upstream = httpRequest(target + url.pathname + url.search, { method: observed.method, headers: observed.headers }, response => {
              const chunks: Buffer[] = [];
              response.on('data', chunk => chunks.push(Buffer.from(chunk)));
              response.on('error', reject);
              response.on('end', () => {
                const headers: Record<string, string> = {};
                for (const [key, value] of Object.entries(response.headers)) if (value !== undefined && !['transfer-encoding', 'connection', 'keep-alive'].includes(key)) headers[key] = Array.isArray(value) ? value.join('\n') : value;
                resolve({ status: response.statusCode!, headers, body: Buffer.concat(chunks) });
              });
            });
            upstream.setTimeout(15_000, () => upstream.destroy(new Error('Synthetic upstream timeout')));
            upstream.on('error', reject);
            upstream.end(observed.body ?? undefined);
          });
          if (await hooks.after?.(observed, forwarded) === 'abort') { await abort(); return; }
          state.fulfilling = true;
          await cdp.send('Fetch.fulfillRequest', { requestId: event.requestId, responseCode: forwarded.status,
            responseHeaders: Object.entries(forwarded.headers).flatMap(([name, value]) => value.split('\n').map(value => ({ name, value }))),
            body: forwarded.body.toString('base64') });
          // Keep this exact network ID registered until its terminal event,
          // even when CDP fulfillment succeeds before cancellation is reported.
          if (hooks.expectedCancellation?.(observed) && await observation.wait()) hooks.cancelled?.(observed);
        })().catch(async () => {
          // Do not serialize an exception that may contain a callback URL or
          // request credentials. The acceptance test records only this path.
          // Concealment may abort an in-flight fetch while its real response is
          // deliberately held by a test. Never infer cancellation from an error
          // string: require Chromium's matching network ID/canceled event AND
          // an explicit expectation for this one request.
          if (state.fulfilling && state.request && hooks.expectedCancellation?.(state.request) && await observation.wait()) {
            hooks.cancelled?.(state.request); return;
          }
          hooks.failure?.(new URL(event.request.url).pathname);
          await cdp.send('Fetch.failRequest', { requestId: event.requestId, errorReason: 'Failed' }).catch(() => {});
        }).finally(() => { if (event.networkId) pending.delete(event.networkId); });
      });
      await cdp.send('Fetch.enable', { patterns: [{ urlPattern: '*', requestStage: 'Request' }] });
    })();
    attached.set(page, ready); return ready;
  };
  context.on('page', page => { void attach(page).catch(() => hooks.failure?.('page-attach')); });
  await Promise.all(context.pages().map(attach));
  return attach;
}

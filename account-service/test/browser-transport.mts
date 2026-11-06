/** Test-only synthetic HTTPS transport. Chromium still owns site isolation,
 * navigation, Origin/Fetch-Metadata and its cookie jar. No injected cookies,
 * TLS-warning bypass, browser trust changes, or authorization mocks. This is
 * deliberately NOT evidence for production DNS, certificates or TLS ingress. */
import { createServer, request as httpRequest } from 'node:http';
import type { AddressInfo } from 'node:net';
import type { BrowserContext, Route } from 'playwright';

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

export interface ObservedRequest { url: URL; method: string; headers: Record<string, string>; body: Buffer | null }
export interface ForwardedResponse { status: number; headers: Record<string, string>; body: Buffer }
export async function installTransport(context: BrowserContext, origins: ReadonlyMap<string, string>, hooks: {
  before?: (request: ObservedRequest) => Promise<'abort' | void>;
  after?: (request: ObservedRequest, response: ForwardedResponse) => Promise<'abort' | void>;
} = {}) {
  await context.route('**/*', async (route: Route) => {
    const request = route.request(), url = new URL(request.url());
    const target = origins.get(url.origin);
    if (!target) { await route.abort('blockedbyclient'); return; }
    const observed = { url, method: request.method(), headers: await request.allHeaders(), body: request.postDataBuffer() };
    if (await hooks.before?.(observed) === 'abort') { await route.abort('failed'); return; }
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
      upstream.on('error', reject);
      upstream.end(observed.body ?? undefined);
    });
    if (await hooks.after?.(observed, forwarded) === 'abort') { await route.abort('failed'); return; }
    await route.fulfill(forwarded);
  });
}

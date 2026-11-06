import assert from 'node:assert/strict';
// @ts-ignore jsdom is a test-only dependency.
import { JSDOM } from 'jsdom';
// @ts-expect-error Private-host JavaScript deliberately stays outside server compilation.
import { mountAccountSettings } from '../browser/settings.js';
const now = Math.floor(Date.now() / 1000), origin = 'https://accounts.example.test';
const session = { session: { id: 'session_a', accountId: 'account_a', activeWorkspaceId: 'workspace_a', expiresAt: now + 600, contexts: [{ workspaceId: 'workspace_a', kind: 'personal' }] }, csrfToken: 'csrf' };
const record = { id: 'record_a', version: 3, category: 'assessment', visibility: 'private' };
const job = { id: 'export_a', workspaceId: 'workspace_a', state: 'ready', recordCount: 1, createdAt: now, expiresAt: now + 300 };
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
const tick = () => new Promise(resolve => setTimeout(resolve, 10));
async function fixture(enabled = true) {
  const dom = new JSDOM('<main id="root"></main>', { url: origin + '/settings', pretendToBeVisual: true });
  const root = dom.window.document.getElementById('root')!;
  const calls: { url: URL; init: RequestInit }[] = [], created: Blob[] = [], revoked: string[] = [];
  let saved: typeof job[] = [], intercept: ((url: URL, init: RequestInit) => Promise<Response> | undefined) | undefined;
  dom.window.URL.createObjectURL = (blob: Blob) => { created.push(blob); return 'blob:https://accounts.example.test/private'; };
  dom.window.URL.revokeObjectURL = (url: string) => { revoked.push(url); };
  const ui = mountAccountSettings({ root, window: dom.window, fetch: async (raw: string, init: RequestInit) => {
    const url = new URL(raw); calls.push({ url, init });
    assert.equal(url.origin, origin); assert.equal(init.credentials, 'same-origin'); assert.equal((init as RequestInit & { cache: string }).cache, 'no-store'); assert.equal(init.redirect, 'error');
    const result = intercept?.(url, init); if (result) return result;
    if (url.pathname === '/v1/ui/config') return json({ providers: [], devicesEnabled: false, exportsEnabled: enabled });
    if (url.pathname === '/v1/session') return json(session);
    if (url.pathname === '/v1/exports/records') return json({ records: [record], nextCursor: null });
    if (url.pathname === '/v1/exports' && init.method === 'GET') return json({ exports: saved, nextCursor: null });
    if (url.pathname === '/v1/exports') { saved = [job]; return json({ export: job }); }
    if (url.pathname.endsWith('/download')) return json({ format: 'erudior-record-export-v1', workspaceId: 'workspace_a', records: [{ ...record, payload: { private: 'secret payload' } }] });
    if (url.pathname.endsWith('/cancel')) { saved = [{ ...job, state: 'cancelled' }]; return json({ export: saved[0] }); }
    if (url.pathname === '/v1/exports/export_a') return json({ export: job });
    throw new Error('Unexpected endpoint');
  } });
  await ui.ready;
  const button = (name: string) => { const b = [...root.querySelectorAll('button')].find(n => n.textContent === name); assert(b, name); return b; };
  const select = () => { const input = root.querySelector('.record-choice input'); assert(input); input.click(); };
  return { dom, root, ui, calls, created, revoked, button, select, intercept(fn: typeof intercept) { intercept = fn; }, save() { saved = [job]; }, close() { ui.dispose(); dom.window.close(); } };
}
{
  const f = await fixture(false); assert.equal(f.root.querySelector('[aria-label="Private record exports"]'), null); assert(!f.calls.some(c => c.url.pathname.startsWith('/v1/exports'))); f.close();
}
{
  const f = await fixture(); f.select(); f.button('Review selected versions').click();
  assert.match(f.root.querySelector('[data-export-review]')!.textContent!, /record_a · version 3/);
  assert.equal(f.calls.filter(c => c.init.method === 'POST').length, 0);
  f.button('Confirm create export').click(); await tick();
  const create = f.calls.find(c => c.init.method === 'POST')!;
  const body = JSON.parse(create.init.body as string); assert.match(body.requestId, /^request_[a-f0-9]{32}$/);
  assert.deepEqual(body.records, [{ id: 'record_a', version: 3 }]); assert.equal((create.init.headers as Record<string, string>)['X-Erudior-CSRF'], 'csrf');
  assert.equal(f.created.length, 0); f.button('Prepare download export_a').click(); await tick();
  assert.equal(f.created.length, 1); assert.equal(f.root.querySelector('a[download]')?.getAttribute('href'), 'blob:https://accounts.example.test/private');
  assert.doesNotMatch(f.root.textContent!, /secret payload/);
  f.button('Cancel export export_a').click(); assert.match(f.root.textContent!, /Source records and files already downloaded remain/);
  assert.equal(f.calls.filter(c => c.url.pathname.endsWith('/cancel')).length, 0);
  f.button('Confirm cancel export').click(); await tick(); assert.match(f.root.textContent!, /cancellation confirmed/); assert.equal(f.revoked.length, 1);
  assert.equal(f.dom.window.localStorage.length, 0); assert.equal(f.dom.window.sessionStorage.length, 0); f.close();
}
{
  const f = await fixture(); f.intercept((url, init) => url.pathname === '/v1/exports' && init.method === 'POST' ? (f.save(), Promise.reject(new Error('lost response'))) : undefined);
  f.select(); f.button('Review selected versions').click(); f.button('Confirm create export').click(); await tick();
  assert.match(f.root.textContent!, /outcome could not be confirmed/); assert.equal(f.calls.filter(c => c.init.method === 'POST').length, 1);
  f.button('Refresh saved exports').click(); await tick(); assert.match(f.root.textContent!, /export_a/); assert.equal(f.calls.filter(c => c.init.method === 'POST').length, 1);
  await f.ui.refresh(); assert.match(f.root.textContent!, /export_a/); assert.equal(f.root.querySelector('input')?.checked, false); f.close();
}
{
  const f = await fixture(); f.save(); await f.ui.refresh();
  let resolve!: (r: Response) => void;
  f.intercept(url => url.pathname.endsWith('/download') ? new Promise(r => { resolve = r; }) : undefined);
  f.button('Prepare download export_a').click(); await tick();
  f.dom.window.dispatchEvent(new f.dom.window.Event('pagehide'));
  resolve(json({ format: 'erudior-record-export-v1', workspaceId: 'workspace_a', records: [record] })); await tick();
  assert.equal(f.created.length, 0); assert.doesNotMatch(f.root.textContent!, /record_a|export_a|workspace_a/); f.close();
}
{
  const f = await fixture(); f.save(); await f.ui.refresh();
  f.intercept(url => url.pathname.endsWith('/download') ? Promise.resolve(new Response('x'.repeat(2 * 1024 * 1024 + 1), { headers: { 'Content-Type': 'application/json' } })) : undefined);
  f.button('Prepare download export_a').click(); await tick(); assert.equal(f.created.length, 0); assert.match(f.root.textContent!, /could not be confirmed/); f.close();
}
{
  const f = await fixture();
  f.intercept(url => url.pathname === '/v1/exports/records' ? Promise.resolve(json({ records: [{ ...record, version: 0 }], nextCursor: null })) : undefined);
  await f.ui.refresh(); assert.match(f.root.textContent!, /Export discovery is unavailable/); assert.equal(f.root.querySelector('input'), null); f.close();
}
{
  const f = await fixture();
  f.intercept(url => url.pathname === '/v1/exports/records' ? Promise.resolve(json(url.searchParams.get('cursor') === 'opaque_next'
    ? { records: [{ ...record, id: 'record_33' }], nextCursor: null }
    : { records: Array.from({ length: 32 }, (_, i) => ({ ...record, id: `record_${i}` })), nextCursor: 'opaque_next' })) : undefined);
  await f.ui.refresh();
  for (let i = 0; i < 32; i++) f.root.querySelectorAll('.record-choice input')[i].click();
  assert.match(f.root.textContent!, /32 of 32 records selected/);
  f.button('Next records page').click(); await tick();
  assert.equal(f.root.querySelector('.record-choice input').disabled, true);
  f.button('Review selected versions').click();
  assert.equal(f.root.querySelectorAll('[data-export-review] li').length, 32);
  assert.doesNotMatch(f.root.querySelector('[data-export-review]')!.textContent!, /record_33/);
  f.button('Back to selection').click(); f.button('Refresh available records').click(); await tick();
  assert.match(f.root.textContent!, /0 of 32 records selected/); f.close();
}
{
  const f = await fixture(); f.save(); await f.ui.refresh();
  f.button('Prepare download export_a').click(); await tick(); assert.equal(f.created.length, 1);
  f.dom.window.dispatchEvent(new f.dom.window.Event('pagehide'));
  assert.equal(f.revoked.length, 1); assert.equal(f.root.querySelector('a[download]'), null); f.close();
}
{
  const f = await fixture(); let resolve!: (r: Response) => void;
  f.intercept(url => url.pathname === '/v1/exports/records' ? new Promise(r => { resolve = r; }) : undefined);
  f.button('Refresh available records').click(); await tick();
  f.dom.window.dispatchEvent(new f.dom.window.Event('pagehide'));
  resolve(json({ records: [{ ...record, id: 'record_late' }], nextCursor: null })); await tick();
  assert.doesNotMatch(f.root.textContent!, /record_late|workspace_a/); f.close();
}
console.log('Private export UI: capability gate, exact-version review, create, read-only reconciliation, session resume, bounded Blob download, cancellation and stale lifecycle suppression passed');

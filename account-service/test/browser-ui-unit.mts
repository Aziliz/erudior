import assert from 'node:assert/strict';
// @ts-ignore jsdom test helper has no declarations in this repository.
import { JSDOM } from 'jsdom';
// Plain JS deliberately ships only from the private host, never through Vite.
// @ts-expect-error Browser module is intentionally outside the server TypeScript project.
import { mountAccountSettings } from '../browser/settings.js';

const origin = 'https://accounts.example.test';
const config = { providers: [{ id: 'personal', label: 'Personal provider', authorizationEndpoint: 'https://identity.example.test/authorize' }], devicesEnabled: true };
const now = Math.floor(Date.now() / 1000);
const signedIn = { session: { id: 'session_current', accountId: '<img src=x onerror=alert(1)>', activeWorkspaceId: 'personal_context', expiresAt: now + 600, contexts: [{ workspaceId: 'personal_context', kind: 'personal' }, { workspaceId: 'family_context', kind: 'family' }] }, csrfToken: 'c'.repeat(43) };
const inventory = { devices: [{ id: 'session_current', current: true, issuedAt: now, lastUsedAt: now, expiresAt: now + 600 }, { id: 'session_other', current: false, issuedAt: now, lastUsedAt: now, expiresAt: now + 600 }] };
const tick = () => new Promise(resolve => setTimeout(resolve, 5));
function deferred() { let resolve!: (r: Response) => void; const promise = new Promise<Response>(r => { resolve = r; }); return { promise, resolve }; }
const json = (value: unknown, status = 200) => new Response(JSON.stringify(value), { status });
async function fixture() {
  const dom = new JSDOM('<main id="account-app"></main>', { url: origin + '/settings', pretendToBeVisual: true });
  const root = dom.window.document.getElementById('account-app')!;
  let valid = true, unavailable = false;
  let intercept: ((path: string, init: RequestInit) => Promise<Response> | undefined) | undefined;
  const calls: { path: string; init: RequestInit }[] = [], navigations: string[] = [];
  const ui = mountAccountSettings({ root, window: dom.window, navigate: (url: string) => navigations.push(url), fetch: async (url: string, init: RequestInit) => {
    const path = new URL(url).pathname; calls.push({ path, init });
    assert.equal(new URL(url).origin, origin); assert.equal(init.credentials, 'same-origin'); assert.equal(init.mode, 'same-origin'); assert.equal(init.redirect, 'error'); assert.equal((init as RequestInit & { cache: string }).cache, 'no-store');
    assert.equal((init.headers as Record<string, string>)['X-Erudior-Request'], '1');
    const intercepted = intercept?.(path, init); if (intercepted) return intercepted;
    if (path === '/v1/ui/config') return json(config);
    if (path === '/v1/session') return valid ? json(signedIn) : json({}, 401);
    if (path === '/v1/devices') return unavailable ? json({}, 404) : json(inventory);
    if (path === '/v1/session/logout') { valid = false; return new Response(null, { status: 204 }); }
    if (path === '/v1/session/context') return json(signedIn);
    if (path === '/v1/devices/revoke') return json({ revoked: 1, currentRevoked: false });
    if (path === '/v1/auth/start') return json({ authorizationUrl: 'https://identity.example.test/authorize?state=synthetic' });
    throw new Error('Unexpected route');
  } });
  await ui.ready;
  const button = (name: string) => {
    const matches = [...root.querySelectorAll('button')].filter(n => n.textContent === name);
    assert.equal(matches.length, 1, `exact button role/name ${name}`); return matches[0];
  };
  return { dom, root, ui, calls, button, navigations, setValid(value: boolean) { valid = value; }, setUnavailable(value: boolean) { unavailable = value; }, intercept(value: typeof intercept) { intercept = value; }, close() { ui.dispose(); dom.window.close(); } };
}
{
  const f = await fixture();
  assert.match(f.root.textContent!, /<img src=x onerror=alert\(1\)>/); assert.equal(f.root.querySelector('img'), null);
  assert.equal(f.dom.window.localStorage.length, 0); assert.equal(f.dom.window.sessionStorage.length, 0);
  f.button('Revoke session session_other').click(); assert.equal(f.calls.filter(c => c.path.endsWith('/revoke')).length, 0);
  assert.equal(f.root.querySelector('[aria-label="Confirm session revocation"] h2'), f.dom.window.document.activeElement);
  f.button('Cancel revocation').click(); assert.equal(f.root.querySelector('[aria-label="Confirm session revocation"]'), null);
  f.button('Revoke all browser sessions').click(); f.button('Confirm revocation').click(); await tick();
  const revoke = f.calls.find(c => c.path.endsWith('/revoke'))!;
  assert.equal(revoke.init.body, '{}'); assert.equal((revoke.init.headers as Record<string, string>)['X-Erudior-CSRF'], signedIn.csrfToken);
  f.setUnavailable(true); await f.ui.refresh(); assert.match(f.root.textContent!, /Session management is unavailable/); assert.doesNotMatch(f.root.textContent!, /MFA expired/);
  f.close();
}
{
  const f = await fixture(), pending = deferred();
  f.intercept(path => path === '/v1/devices' ? pending.promise : undefined);
  const refresh = f.ui.refresh(); await tick();
  f.dom.window.dispatchEvent(new f.dom.window.Event('pagehide'));
  assert.doesNotMatch(f.root.textContent!, /session_current|personal_context|Account:/);
  pending.resolve(json(inventory)); await refresh;
  assert.doesNotMatch(f.root.textContent!, /session_current|personal_context|Account:/);
  f.intercept(undefined); f.setValid(false); f.dom.window.dispatchEvent(new f.dom.window.Event('pageshow')); await tick();
  assert.match(f.root.textContent!, /You are signed out/); f.close();
}
{
  const f = await fixture(), pending = deferred();
  f.intercept(path => path === '/v1/devices/revoke' ? pending.promise : undefined);
  f.button('Revoke this browser session').click(); f.button('Confirm revocation').click();
  assert([...f.root.querySelectorAll('button')].every(n => n.disabled));
  f.dom.window.dispatchEvent(new f.dom.window.Event('pagehide'));
  f.dom.window.dispatchEvent(new f.dom.window.Event('pageshow'));
  assert([...f.root.querySelectorAll('button')].every(n => n.disabled));
  f.setValid(false); pending.resolve(json({}, 503)); await tick();
  assert.match(f.root.textContent!, /You are signed out/); assert.doesNotMatch(f.root.textContent!, /Account:|session_current/);
  assert.equal(f.calls.filter(c => c.path.endsWith('/revoke')).length, 1); f.close();
}
{
  const f = await fixture(); f.setValid(false); await f.ui.refresh();
  f.intercept(path => path === '/v1/auth/start' ? Promise.resolve(json({ authorizationUrl: 'https://evil.example/authorize' })) : undefined);
  f.button('Sign in with Personal provider').click(); await tick(); assert.equal(f.navigations.length, 0); assert.match(f.root.textContent!, /Sign-in could not start/);
  f.intercept(undefined); f.button('Sign in with Personal provider').click(); await tick();
  assert.deepEqual(f.navigations, ['https://identity.example.test/authorize?state=synthetic']); f.close();
}
{
  const f = await fixture();
  f.intercept(path => path === '/v1/devices/revoke' ? Promise.reject(new Error('lost response')) : path === '/v1/session' ? Promise.resolve(json({}, 503)) : undefined);
  f.button('Revoke session session_other').click(); f.button('Confirm revocation').click(); await tick();
  assert.match(f.root.textContent!, /current session state could not be confirmed/);
  assert.doesNotMatch(f.root.textContent!, /Account:|session_current|state has been checked/); f.close();
}
{
  const f = await fixture();
  f.intercept(path => path === '/v1/devices/revoke' ? Promise.reject(new Error('lost response')) : undefined);
  f.button('Revoke session session_other').click(); f.button('Confirm revocation').click(); await tick();
  assert.match(f.root.textContent!, /outcome could not be confirmed/);
  assert.match(f.root.textContent!, /Account:/); assert.equal(f.calls.filter(c => c.path.endsWith('/revoke')).length, 1); f.close();
}
console.log('Private browser UI: exact controls, inert content, CSRF, lifecycle concealment, mutation lock, uncertain outcome and pinned navigation passed');

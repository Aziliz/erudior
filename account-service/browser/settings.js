// Private-service-only browser client. No persistent storage or public app imports.
export function mountAccountSettings({ root, window: win, fetch: request = win.fetch.bind(win), navigate = url => win.location.assign(url) }) {
  const doc = root.ownerDocument;
  let config = null, session = null, csrf = null, devices = null;
  let epoch = 0, busy = false, navigating = false, hidden = doc.visibilityState === 'hidden', disposed = false;
  let message = 'Checking your session…', confirmation = null, expiryTimer;
  const signInFailed = win.location.hash === '#sign-in-failed';
  if (signInFailed) win.history.replaceState(null, '', win.location.pathname);
  const alive = ticket => !disposed && !hidden && ticket === epoch;
  const element = (tag, text, parent = root) => {
    const node = doc.createElement(tag);
    if (text !== undefined) node.textContent = text;
    parent.append(node);
    return node;
  };
  function button(text, action, parent = root) {
    const node = element('button', text, parent);
    node.type = 'button'; node.disabled = busy;
    node.addEventListener('click', () => { if (!busy && !hidden && !disposed) action(); });
    return node;
  }
  function clearPrivate() {
    session = null; csrf = null; devices = null; confirmation = null;
    win.clearTimeout(expiryTimer);
  }
  function render(focus = false) {
    root.replaceChildren();
    root.setAttribute('aria-busy', String(busy));
    const title = element('h1', 'Private account settings'); title.tabIndex = -1;
    const status = element('p', hidden ? 'Account details hidden.' : message);
    status.setAttribute('role', 'status'); status.setAttribute('aria-live', 'polite');
    if (hidden) return;
    if (session) {
      const overview = element('section'); overview.setAttribute('aria-label', 'Current session');
      element('h2', 'Current session', overview);
      element('p', `Account: ${session.accountId}`, overview);
      element('p', `Session: ${session.id}`, overview);
      element('p', `Expires: ${date(session.expiresAt)}`, overview);
      const label = element('label', 'Active context', overview);
      label.htmlFor = 'account-active-context';
      const select = element('select', undefined, overview);
      select.id = 'account-active-context';
      select.disabled = busy;
      for (const context of session.contexts) {
        const option = element('option', `${context.kind}: ${context.workspaceId}`, select);
        option.value = context.workspaceId;
        option.selected = context.workspaceId === session.activeWorkspaceId;
      }
      button('Switch context', () => mutate('/v1/session/context', { workspaceId: select.value }), overview);
      button('Sign out', () => mutate('/v1/session/logout', {}, 'logout'), overview);
      if (config?.devicesEnabled) {
        const inventory = element('section'); inventory.setAttribute('aria-label', 'Browser sessions');
        element('h2', 'Browser sessions', inventory);
        element('p', 'These are signed-in browser sessions, not verified physical devices.', inventory);
        if (devices === null) element('p', 'Session management is unavailable. It requires an eligible personal sign-in with recent MFA. You can try a fresh personal sign-in below.', inventory);
        else {
          const list = element('ul', undefined, inventory);
          for (const device of devices) {
            const item = element('li', undefined, list);
            element('p', `${device.current ? 'This browser' : 'Other browser'} · ${device.id}`, item);
            element('p', `Signed in: ${date(device.issuedAt)} · Last used: ${date(device.lastUsedAt)} · Expires: ${date(device.expiresAt)}`, item);
            button(device.current ? 'Revoke this browser session' : `Revoke session ${device.id}`, () => confirmRevoke(device), item);
          }
          button('Revoke all browser sessions', () => confirmRevoke(null), inventory);
        }
      }
    }
    if (config) {
      const signIn = element('section'); signIn.setAttribute('aria-label', 'Sign in');
      element('h2', session ? 'Fresh sign-in' : 'Sign in', signIn);
      element('p', 'Use your configured provider. Signing in does not create an account or grant new access. Fresh personal sign-in may require MFA.', signIn);
      for (const provider of config.providers) button(`${session ? 'Fresh sign-in' : 'Sign in'} with ${provider.label}`, () => signInWith(provider), signIn);
    }
    button('Refresh session', () => refresh(), root);
    if (confirmation) {
      const panel = element('section'); panel.setAttribute('aria-label', 'Confirm session revocation');
      const heading = element('h2', 'Confirm session revocation', panel); heading.tabIndex = -1;
      element('p', confirmation.all ? 'Revoke all currently active browser sessions, including this one? You will need to sign in again. This does not suspend the account or sign out of your identity provider.' : `Revoke ${confirmation.current ? 'this browser session' : 'the selected browser session'}?${confirmation.current ? ' You will need to sign in again.' : ''}`, panel);
      button('Confirm revocation', () => { const target = confirmation; confirmation = null; mutate('/v1/devices/revoke', target.all ? {} : { sessionId: target.id }, 'revoke'); }, panel);
      button('Cancel revocation', () => { confirmation = null; render(true); }, panel);
      if (focus) heading.focus();
    } else if (focus) title.focus();
  }
  const date = seconds => new Date(seconds * 1000).toLocaleString();
  const text = value => typeof value === 'string' && value.length > 0 && value.length <= 256;
  const timestamp = value => Number.isSafeInteger(value) && value >= 0 && value <= 253402300799;
  function parseSession(value) {
    const s = value?.session;
    if (!s || s.expiresAt * 1000 <= Date.now() || !text(s.id) || !text(s.accountId) || !text(s.activeWorkspaceId) || !timestamp(s.expiresAt)
      || !text(value.csrfToken) || !Array.isArray(s.contexts) || !s.contexts.length || s.contexts.length > 128
      || s.contexts.some(c => !c || !text(c.workspaceId) || !['personal', 'family', 'school'].includes(c.kind))
      || !s.contexts.some(c => c.workspaceId === s.activeWorkspaceId)) throw new Error('Invalid session');
    return { id: s.id, accountId: s.accountId, activeWorkspaceId: s.activeWorkspaceId, expiresAt: s.expiresAt,
      contexts: s.contexts.map(c => ({ workspaceId: c.workspaceId, kind: c.kind })) };
  }
  function parseConfig(value) {
    if (!value || typeof value.devicesEnabled !== 'boolean' || !Array.isArray(value.providers) || value.providers.length > 32) throw new Error('Invalid configuration');
    return { devicesEnabled: value.devicesEnabled, providers: value.providers.map(p => {
      if (!p || !/^[a-z][a-z0-9_-]{0,47}$/.test(p.id) || !text(p.label)) throw new Error('Invalid provider');
      const url = new URL(p.authorizationEndpoint);
      if (url.protocol !== 'https:' || url.username || url.password || url.hash || url.search) throw new Error('Invalid endpoint');
      return { id: p.id, label: p.label, authorizationEndpoint: url.href };
    }) };
  }
  async function api(path, body, token = csrf) {
    const url = new URL(path, win.location.origin);
    if (url.origin !== win.location.origin || !path.startsWith('/')) throw new Error('Invalid destination');
    const headers = { 'X-Erudior-Request': '1', Accept: 'application/json' };
    if (body !== undefined) {
      headers['Content-Type'] = 'application/json';
      if (token) headers['X-Erudior-CSRF'] = token;
    }
    const response = await request(url.href, { method: body === undefined ? 'GET' : 'POST', credentials: 'same-origin', mode: 'same-origin', cache: 'no-store', redirect: 'error', referrerPolicy: 'no-referrer', headers,
      ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
    if (!response.ok) { const error = new Error('Request unavailable'); error.status = response.status; throw error; }
    return response.status === 204 ? null : response.json();
  }
  async function refresh() {
    if (disposed || hidden || busy) return;
    const ticket = ++epoch;
    let reconciled = false;
    clearPrivate(); message = 'Checking your session…'; render();
    try {
      if (!config) {
        const value = parseConfig(await api('/v1/ui/config'));
        if (!alive(ticket)) return;
        config = value;
      }
      const value = await api('/v1/session');
      if (!alive(ticket)) return;
      const checked = parseSession(value);
      session = checked; csrf = value.csrfToken; reconciled = true;
      message = 'Signed in. Access is checked by the private service.';
      if (config.devicesEnabled) {
        try {
          const data = await api('/v1/devices');
          if (!alive(ticket)) return;
          if (!Array.isArray(data.devices) || data.devices.length > 32 || data.devices.some(d => !d || !text(d.id) || typeof d.current !== 'boolean' || ![d.issuedAt, d.lastUsedAt, d.expiresAt].every(timestamp))) throw new Error('Invalid inventory');
          devices = data.devices.map(d => ({ id: d.id, current: d.current, issuedAt: d.issuedAt, lastUsedAt: d.lastUsedAt, expiresAt: d.expiresAt }));
        } catch (error) { if (!alive(ticket)) return; if (error.status === 401) throw error; devices = null; }
      }
      if (!alive(ticket)) return;
      expiryTimer = win.setTimeout(() => { conceal(); if (!hidden) refresh(); }, Math.max(0, Math.min(2147483647, session.expiresAt * 1000 - Date.now())));
    } catch (error) {
      if (!alive(ticket)) return;
      reconciled = error.status === 401;
      clearPrivate(); message = error.status === 401 ? (signInFailed ? 'Sign-in was not completed. Try signing in again.' : 'You are signed out. Sign in to continue.') : 'Account settings are unavailable. Try refreshing or signing in again.';
    }
    if (alive(ticket)) render();
    return alive(ticket) && reconciled;
  }
  function confirmRevoke(device) {
    confirmation = device ? { id: device.id, current: device.current, all: false } : { all: true };
    render(true);
  }
  async function mutate(path, body, kind = 'context') {
    if (busy || !session || !csrf) return;
    busy = true; const ticket = ++epoch, token = csrf;
    message = 'Updating your session…'; render();
    let success = false;
    try {
      await api(path, body, token); success = true;
    } catch { /* Reconcile rather than retry a mutation or assert its outcome. */ }
    finally {
      busy = false;
      if (disposed) return;
      clearPrivate();
      if (!alive(ticket)) { if (!hidden) await refresh(); return; }
      const reconciliation = epoch + 1;
      const reconciled = await refresh();
      if (alive(reconciliation)) {
        message = !reconciled ? 'The request outcome and current session state could not be confirmed. Refresh before trying again.' : success ? (kind === 'revoke' ? 'Revocation request completed. Current session state is shown below.' : kind === 'logout' ? 'Sign-out request completed.' : 'Context request completed.') : 'The request outcome could not be confirmed. Current session state has been checked; refresh before trying again.';
        render(true);
      }
    }
  }
  async function signInWith(provider) {
    if (busy) return;
    busy = true; const ticket = ++epoch;
    let reconciled = false;
    clearPrivate(); message = 'Starting sign-in…'; render();
    try {
      const result = await api('/v1/auth/start', { providerId: provider.id });
      if (!alive(ticket)) return;
      const target = new URL(result.authorizationUrl), allowed = new URL(provider.authorizationEndpoint);
      if (target.protocol !== 'https:' || target.origin !== allowed.origin || target.pathname !== allowed.pathname || target.username || target.password || target.hash) throw new Error('Invalid authorization destination');
      navigating = true; navigate(target.href);
    } catch {
      if (alive(ticket)) { message = 'Sign-in could not start. Try again.'; busy = false; render(true); }
    } finally {
      if (!alive(ticket)) { busy = false; if (!hidden && !disposed) refresh(); }
    }
  }
  function conceal() { ++epoch; clearPrivate(); message = 'Account details hidden.'; render(); }
  function visibility() { hidden = doc.visibilityState === 'hidden'; if (hidden) conceal(); else refresh(); }
  function pagehide() { hidden = true; conceal(); }
  function pageshow() { hidden = doc.visibilityState === 'hidden'; if (navigating) { busy = false; navigating = false; } if (!hidden) refresh(); }
  function focus() { if (!hidden && !busy) refresh(); }
  doc.addEventListener('visibilitychange', visibility);
  win.addEventListener('pagehide', pagehide);
  win.addEventListener('pageshow', pageshow);
  win.addEventListener('focus', focus);
  const ready = refresh();
  return { ready, refresh, dispose() { disposed = true; conceal(); root.replaceChildren(); doc.removeEventListener('visibilitychange', visibility); win.removeEventListener('pagehide', pagehide); win.removeEventListener('pageshow', pageshow); win.removeEventListener('focus', focus); } };
}

if (typeof document !== 'undefined') {
  const root = document.getElementById('account-app');
  if (root) mountAccountSettings({ root, window });
}

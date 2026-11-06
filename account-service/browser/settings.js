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
  // Export state is memory-only and scoped to this authenticated page epoch.
  let records = [], jobs = [], selected = new Map(), recordCursor = null, jobCursor = null;
  let exportMessage = '', exportReview = null, cancelReview = null, downloadUrl = null, downloadAbort = null;
  function revokeDownload() { if (downloadUrl) win.URL.revokeObjectURL(downloadUrl); downloadUrl = null; }
  function clearExports() {
    downloadAbort?.abort(); downloadAbort = null;
    revokeDownload(); records = []; jobs = []; selected.clear(); recordCursor = jobCursor = null;
    exportReview = cancelReview = null; exportMessage = '';
  }
  const identifier = value => typeof value === 'string' && /^[A-Za-z0-9_-]{1,128}$/.test(value);
  function checkedJob(job) {
    if (!job || !identifier(job.id) || job.workspaceId !== session.activeWorkspaceId || !['ready', 'cancelled', 'expired'].includes(job.state)
      || !timestamp(job.createdAt) || !timestamp(job.expiresAt) || !Number.isInteger(job.recordCount) || job.recordCount < 1 || job.recordCount > 32) throw new Error('Invalid export');
    return { id: job.id, workspaceId: job.workspaceId, state: job.state, createdAt: job.createdAt, expiresAt: job.expiresAt, recordCount: job.recordCount };
  }
  async function exportPage(kind, cursor, ticket) {
    const query = new URLSearchParams({ workspaceId: session.activeWorkspaceId, limit: '32' });
    if (cursor) query.set('cursor', cursor);
    const data = await api(`/v1/exports${kind === 'records' ? '/records' : ''}?${query}`);
    if (!alive(ticket)) return;
    const values = data?.[kind === 'records' ? 'records' : 'exports'];
    if (!Array.isArray(values) || values.length > 32 || !(data.nextCursor === null || typeof data.nextCursor === 'string' && data.nextCursor.length <= 4096)) throw new Error('Invalid export inventory');
    if (kind === 'records') {
      const page = values.map(r => {
        if (!r || !identifier(r.id) || !Number.isSafeInteger(r.version) || r.version <= 0 || !text(r.category) || !['private', 'released'].includes(r.visibility)) throw new Error('Invalid record metadata');
        return { id: r.id, version: r.version, category: r.category, visibility: r.visibility };
      });
      records = page; recordCursor = data.nextCursor;
    } else { jobs = values.map(checkedJob); jobCursor = data.nextCursor; }
  }
  async function exportAction(action) {
    if (busy || !session || !csrf || !config?.exportsEnabled) return;
    busy = true; const ticket = ++epoch; revokeDownload(); render();
    try { await action(ticket); }
    catch (error) {
      if (alive(ticket)) {
        if (error.status === 401) { clearPrivate(); message = 'Your session is unavailable. Refresh or sign in again.'; }
        else {
          if (error.status === 403 || error.status === 404) clearExports();
          exportMessage = 'Export access or the request outcome could not be confirmed. Refresh saved exports before trying anything else. No request was automatically retried.';
        }
      }
    } finally {
      busy = false;
      if (alive(ticket)) render(true);
      else if (!hidden && !disposed) refresh();
    }
  }
  function renderExports() {
    const section = element('section'); section.setAttribute('aria-label', 'Private record exports');
    element('h2', 'Private record exports', section);
    element('p', 'Select exact record versions to export. Only metadata is shown here. Availability is checked by the service, not inferred from your context.', section);
    const status = element('p', exportMessage, section); status.setAttribute('role', 'status');
    button('Refresh available records', () => exportAction(async ticket => {
      selected.clear(); exportReview = null; records = []; recordCursor = null;
      await exportPage('records', null, ticket);
      if (alive(ticket)) exportMessage = 'Available records refreshed. Review your selection again.';
    }), section);
    const list = element('ul', undefined, section);
    for (const record of records) {
      const li = element('li', undefined, list), label = element('label', undefined, li); label.className = 'record-choice';
      const input = element('input', undefined, label); input.type = 'checkbox'; input.checked = selected.has(record.id);
      input.disabled = busy || !!exportReview || (!input.checked && selected.size >= 32);
      element('span', `${record.id} · version ${record.version} · ${record.category} · ${record.visibility}`, label);
      input.addEventListener('change', () => {
        if (busy || hidden || disposed || exportReview) return;
        if (input.checked && selected.size < 32) selected.set(record.id, { ...record }); else selected.delete(record.id);
        render();
        const replacement = [...root.querySelectorAll('.record-choice input')][records.indexOf(record)]; replacement?.focus();
      });
    }
    if (!records.length) element('p', 'No available record metadata is shown.', section);
    if (recordCursor) button('Next records page', () => exportAction(ticket => exportPage('records', recordCursor, ticket)), section);
    element('p', `${selected.size} of 32 records selected. Selection includes earlier pages.`, section);
    const review = button('Review selected versions', () => {
      exportReview = { requestId: `request_${win.crypto.randomUUID().replaceAll('-', '')}`, records: [...selected.values()] };
      cancelReview = null; render(); root.querySelector('[data-export-review] h3')?.focus();
    }, section); review.disabled ||= !selected.size || !!exportReview;
    if (exportReview) {
      const panel = element('section', undefined, section); panel.dataset.exportReview = '';
      const title = element('h3', 'Confirm selected record versions', panel); title.tabIndex = -1;
      element('p', 'This creates a private, temporary export for this browser session. Downloaded files can contain private information; keep them secure.', panel);
      const scope = element('ul', undefined, panel);
      for (const r of exportReview.records) element('li', `${r.id} · version ${r.version} · ${r.category} · ${r.visibility}`, scope);
      button('Confirm create export', () => {
        const reviewed = exportReview, workspaceId = session.activeWorkspaceId;
        exportReview = null; selected.clear();
        exportAction(async ticket => {
          // Never silently repeat a POST, including after a lost response.
          exportMessage = 'Creating export…';
          const data = await api('/v1/exports', { workspaceId, requestId: reviewed.requestId, records: reviewed.records.map(r => ({ id: r.id, version: r.version })) });
          if (!alive(ticket)) return;
          jobs = [checkedJob(data.export), ...jobs.filter(j => j.id !== data.export.id)].slice(0, 32);
          exportMessage = 'Export created. Download only when you are ready to save a private file.';
        });
      }, panel);
      button('Back to selection', () => { exportReview = null; render(true); }, panel);
    }
    element('h3', 'Saved exports for this browser session', section);
    element('p', 'Refresh this list to resume after a reload or an uncertain create response. A missing job does not prove that a request failed. No export is automatically recreated or downloaded.', section);
    button('Refresh saved exports', () => exportAction(async ticket => {
      jobs = []; jobCursor = null; cancelReview = null;
      await exportPage('exports', null, ticket);
      if (alive(ticket)) exportMessage = 'Saved exports refreshed. These are the currently accessible jobs, not proof of an earlier request’s outcome.';
    }), section);
    const jobList = element('ul', undefined, section);
    for (const job of jobs) {
      const item = element('li', undefined, jobList);
      element('p', `${job.id} · ${job.state} · ${job.recordCount} records · Expires: ${date(job.expiresAt)}`, item);
      button(`Check export ${job.id}`, () => exportAction(async ticket => {
        const data = await api(`/v1/exports/${encodeURIComponent(job.id)}`);
        if (alive(ticket)) { const checked = checkedJob(data.export); jobs = jobs.map(j => j.id === job.id ? checked : j); exportMessage = 'Export status checked.'; }
      }), item);
      if (job.state === 'ready') {
        button(`Prepare download ${job.id}`, () => exportAction(ticket => prepareDownload(job, ticket)), item);
        button(`Cancel export ${job.id}`, () => { cancelReview = job; exportReview = null; render(); root.querySelector('[data-export-cancel] h3')?.focus(); }, item);
      }
    }
    if (!jobs.length) element('p', 'No accessible saved exports are shown.', section);
    if (jobCursor) button('Next saved exports page', () => exportAction(ticket => exportPage('exports', jobCursor, ticket)), section);
    if (cancelReview) {
      const panel = element('section', undefined, section); panel.dataset.exportCancel = '';
      const title = element('h3', 'Confirm export cancellation', panel); title.tabIndex = -1;
      element('p', `Cancel ${cancelReview.id}? This prevents further downloads of this export. Source records and files already downloaded remain.`, panel);
      button('Confirm cancel export', () => {
        const job = cancelReview; cancelReview = null;
        exportAction(async ticket => {
          const data = await api(`/v1/exports/${encodeURIComponent(job.id)}/cancel`, {});
          if (alive(ticket)) { const checked = checkedJob(data.export); jobs = jobs.map(j => j.id === job.id ? checked : j); exportMessage = 'Export cancellation confirmed. Source records and downloaded files remain.'; }
        });
      }, panel);
      button('Keep export', () => { cancelReview = null; render(true); }, panel);
    }
    if (downloadUrl) {
      const link = element('a', 'Save private export JSON', section); link.href = downloadUrl; link.download = 'erudior-record-export.json';
      element('p', 'This prepared download is cleared when you leave, hide, or refresh this page.', section);
    }
  }
  async function prepareDownload(job, ticket) {
    downloadAbort = new win.AbortController();
    const response = await request(new URL(`/v1/exports/${encodeURIComponent(job.id)}/download`, win.location.origin).href, {
      signal: downloadAbort.signal, method: 'GET', credentials: 'same-origin', mode: 'same-origin', cache: 'no-store', redirect: 'error', referrerPolicy: 'no-referrer', headers: { 'X-Erudior-Request': '1', Accept: 'application/json' }
    });
    if (!alive(ticket)) { await response.body?.cancel(); return; }
    if (!response.ok) { const error = new Error('Download unavailable'); error.status = response.status; throw error; }
    const maximum = 2 * 1024 * 1024;
    if (!/^application\/json(?:;|$)/i.test(response.headers.get('content-type') || '') || Number(response.headers.get('content-length')) > maximum || !response.body) { await response.body?.cancel(); throw new Error('Invalid download'); }
    const reader = response.body.getReader(), chunks = []; let size = 0;
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (!alive(ticket)) { await reader.cancel(); return; }
        if (done) break;
        size += value.byteLength;
        if (size > maximum) { await reader.cancel(); throw new Error('Download too large'); }
        chunks.push(value);
      }
      const bytes = new Uint8Array(size); let offset = 0;
      for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
      const artifact = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
      if (artifact?.format !== 'erudior-record-export-v1' || artifact.workspaceId !== session.activeWorkspaceId || !Array.isArray(artifact.records) || artifact.records.length !== job.recordCount) throw new Error('Invalid export artifact');
      if (!alive(ticket)) return;
      downloadUrl = win.URL.createObjectURL(new win.Blob([bytes], { type: 'application/json' }));
      bytes.fill(0); exportMessage = 'Private JSON download prepared. Choose Save private export JSON to save the file.';
    } finally { chunks.length = 0; reader.releaseLock(); }
  }

  function clearPrivate() {
    clearExports();
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
    if (session && config?.exportsEnabled) renderExports();
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
    return { exportsEnabled: value.exportsEnabled === true, devicesEnabled: value.devicesEnabled, providers: value.providers.map(p => {
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
      if (config.exportsEnabled) {
        try {
          await exportPage('records', null, ticket);
          if (!alive(ticket)) return;
          await exportPage('exports', null, ticket);
          if (!alive(ticket)) return;
          exportMessage = 'Select records or resume an accessible saved export.';
        } catch (error) {
          if (!alive(ticket)) return;
          if (error.status === 401) throw error;
          clearExports(); exportMessage = 'Export discovery is unavailable. Refresh to check access again.';
        }
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
    clearExports(); message = 'Updating your session…'; render();
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

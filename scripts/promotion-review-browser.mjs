// Real isolated Worker/D1/R2 + admin browser acceptance. No remote bindings, credentials,
// real course adoption, or publisher authority. Review clicks are synthetic test actions.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { createServer as socketServer } from 'node:net';
import { createHash, randomUUID } from 'node:crypto';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createServer } from 'vite';
import react from '@vitejs/plugin-react';
import { tsImport } from 'tsx/esm/api';

const root = fileURLToPath(new URL('../', import.meta.url));
const worker = path.join(root, 'worker');
const out = path.resolve(process.env.BROWSER_ARTIFACTS || path.join(root, 'test-results/promotion-review'));
const bootstrapOnly = process.argv.includes('--bootstrap-only');
// Virtual same-site HTTPS origins are routed only to real loopback servers.
// This exercises browser cookie/CORS semantics, not production DNS/TLS or a deployment.
const mediaOrigin = 'https://community.example.test';
const appOrigin = 'https://app.example.test';
const bucket = 'erudior-promotion-test';
const base = '/admin/promotions';
const title = 'Synthetic full canonical promotion source';
const secret = 'SECRET_PROMOTION_TEACHER_821';
const orderSecret = 'SECRET_PROMOTION_ORDER_821';
const checks = [], screenshots = [], errors = [], deniedNetwork = [];
await mkdir(out, { recursive: true });
for (const name of ['failure.json', 'failure.png', 'failure.html', 'failure-fields.json', 'result.json', 'bootstrap.json']) await rm(path.join(out, name), { force: true });
const temporary = await mkdtemp(path.join(os.tmpdir(), 'erudior-promotion-browser-'));
const children = new Set();
// Never inherit Cloudflare credentials, proxies, repository .dev.vars, or login state.
const env = Object.fromEntries(['PATH', 'Path', 'SystemRoot', 'WINDIR', 'LANG', 'TMP', 'TEMP', 'TMPDIR']
  .filter(key => process.env[key]).map(key => [key, process.env[key]]));
Object.assign(env, { HOME: temporary, USERPROFILE: temporary, XDG_CONFIG_HOME: temporary,
  CI: 'true', WRANGLER_SEND_METRICS: 'false', NO_COLOR: '1' });
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const sha256 = text => createHash('sha256').update(text).digest('hex');
const clone = value => structuredClone(value);
let server, browser, page, apiServer, appServerOrigin, api, common, wrangler, current = 'startup';
const origin = appOrigin;

function launch(args, extraEnv = {}) {
  const child = spawn(process.execPath, args, { cwd: temporary, env: { ...env, ...extraEnv },
    detached: process.platform !== 'win32', stdio: ['ignore', 'pipe', 'pipe'] });
  children.add(child); child.log = '';
  for (const stream of [child.stdout, child.stderr]) stream.on('data', data => { child.log = (child.log + data).slice(-100000); });
  child.done = new Promise(resolve => {
    child.once('error', error => { child.failure = error; resolve(-1); });
    child.once('exit', code => { child.finished = true; resolve(code ?? -1); });
  });
  return child;
}
async function stop(child) {
  if (!child?.pid) return;
  if (process.platform === 'win32') {
    const killer = spawn('taskkill', ['/pid', String(child.pid), '/T', '/F']);
    await new Promise(resolve => { killer.once('exit', resolve); killer.once('error', resolve); });
  } else {
    try { process.kill(-child.pid, 'SIGTERM'); } catch (error) { if (error.code !== 'ESRCH') throw error; }
    await Promise.race([child.done, delay(1000)]);
    try { process.kill(-child.pid, 'SIGKILL'); } catch (error) { if (error.code !== 'ESRCH') throw error; }
  }
  children.delete(child);
}
async function bounded(child, milliseconds, label) {
  let timer;
  try {
    const code = await Promise.race([child.done, new Promise((_, reject) => {
      timer = setTimeout(() => reject(Error(`${label} timed out`)), milliseconds);
    })]);
    assert.equal(code, 0, `${label}: ${child.failure || ''}\n${child.log}`);
    return child.log;
  } finally { clearTimeout(timer); await stop(child); }
}
async function freePort() {
  const socket = socketServer();
  await new Promise((resolve, reject) => { socket.once('error', reject); socket.listen(0, '127.0.0.1', resolve); });
  const port = socket.address().port;
  await new Promise(resolve => socket.close(resolve));
  return port;
}
function client() {
  let cookie = '';
  return {
    get cookie() { return cookie; },
    async call(method, route, body, headers = {}) {
      const raw = body instanceof Uint8Array;
      const response = await fetch(api + route, { method, redirect: 'manual', signal: AbortSignal.timeout(30000),
        headers: { Origin: origin, Cookie: cookie,
          ...(body !== undefined ? { 'Content-Type': raw ? 'image/png' : 'application/json' } : {}), ...headers },
        body: body === undefined ? undefined : raw ? body : JSON.stringify(body) });
      for (const item of response.headers.getSetCookie()) if (item.startsWith('erudior_session=')) cookie = item.split(';')[0];
      const text = await response.text(); let data;
      try { data = JSON.parse(text); } catch { data = text; }
      return { status: response.status, data, text, headers: response.headers };
    },
    async login(name, role) {
      assert.equal((await this.call('GET', `/auth/dev?name=${encodeURIComponent(name)}&role=${role}`)).status, 302);
      assert.equal((await this.call('POST', '/me/accept', { adult: true, terms: true })).status, 200);
      return this;
    },
  };
}
function ok(response, status = 200) {
  assert.equal(response.status, status, JSON.stringify(response.data));
  if (typeof response.data === 'object' && response.headers.has('cache-control')) {
    assert(response.headers.get('cache-control').includes('no-store'), 'private responses are no-store');
  }
  return response.data;
}
async function d1(sql) {
  return bounded(launch([wrangler, 'd1', 'execute', bucket, ...common, '--command', sql]), 90000, 'Synthetic D1 fault injection');
}
async function putObject(key, bytes, type) {
  // Exercise the same real local R2 store through an isolated emulator worker.
  // This avoids Wrangler 3's broken object-put metadata serialization and never
  // adds a mutation route to the application or contacts a remote bucket.
  const file = path.join(temporary, randomUUID()), script = path.join(temporary, randomUUID() + '.mjs');
  await writeFile(file, bytes);
  const mutationWorker = `export default { async fetch(request, env) { await env.FILES.put(${JSON.stringify(key)}, await request.arrayBuffer(), { httpMetadata: { contentType: ${JSON.stringify(type)} } }); return new Response(null, {status:204}); } }`;
  await writeFile(script, `import { Miniflare } from ${JSON.stringify(pathToFileURL(path.join(worker, 'node_modules/miniflare/dist/src/index.js')).href)};
import { readFile } from 'node:fs/promises';
const mf = new Miniflare({ modules: true, script: ${JSON.stringify(mutationWorker)}, compatibilityDate: '2025-02-01', r2Persist: ${JSON.stringify(path.join(temporary, 'state/v3/r2'))}, r2Buckets: { FILES: ${JSON.stringify(bucket)} } });
try { const result = await mf.dispatchFetch('http://localhost/', { method: 'PUT', body: new Uint8Array(await readFile(${JSON.stringify(file)})) }); if (result.status !== 204) throw Error(await result.text()); } finally { await mf.dispose(); }
`);
  return bounded(launch([script]), 90000, 'Synthetic local R2 fault injection');
}
async function createSource(author, reviewer, canonical, name = title) {
  canonical = clone(canonical); canonical.course.title = name;
  const document = { format: 'erudior-community', version: 1, title: name,
    description: 'Disposable acceptance fixture, never an adopted official course.',
    subject: 'Science', level: 'Middle School', type: 'Course', lessons: [], decks: [], canonical };
  const id = ok(await author.call('POST', '/drafts'), 201).id;
  assert(id); ok(await author.call('PUT', `/drafts/${id}`, document));
  ok(await author.call('POST', `/drafts/${id}/publish`));
  ok(await reviewer.call('POST', `/review/${id}`, { action: 'reviewed', version: 1 }));
  return { id, document };
}
async function inspect(admin, sourceId, version = 1) {
  return ok(await admin.call('GET', `${base}/sources/${sourceId}?version=${version}`));
}
function preparation(source) {
  return { requestId: randomUUID(), communityId: source.source.communityId,
    publishedVersion: source.source.publishedVersion, sourceDigest: source.source.packageSha256, digest: source.digest };
}

async function bootstrap() {
  current = 'isolated Worker/D1/R2 bootstrap';
  const port = await freePort(); api = `http://127.0.0.1:${port}`;
  server = await createServer({ root, configFile: false, plugins: [react()],
    define: { __DEV_COURSE_KEY__: JSON.stringify(''), 'import.meta.env.VITE_COMMUNITY_API': JSON.stringify(mediaOrigin),
      'import.meta.env.VITE_COURSES_URL': JSON.stringify(''), 'import.meta.env.VITE_HOMESCHOOL': JSON.stringify(''), 'import.meta.env.VITE_AS_DESKTOP': JSON.stringify('') },
    server: { host: '127.0.0.1', port: 0, hmr: false }, logLevel: 'warn' });
  await server.listen(); appServerOrigin = `http://127.0.0.1:${server.httpServer.address().port}`;
  const config = path.join(temporary, 'wrangler.toml');
  await writeFile(config, `name = "erudior-promotion-test"
main = ${JSON.stringify(path.join(worker, 'src/index.ts'))}
compatibility_date = "2025-02-01"
workers_dev = false
[[migrations]]
tag = "v1"
new_sqlite_classes = ["LiveRoom"]
[env.dev]
name = "erudior-promotion-test-dev"
workers_dev = false
routes = []
[env.dev.vars]
APP_ORIGIN = ${JSON.stringify(origin)}
ALLOWED_ORIGINS = ${JSON.stringify(origin)}
API_ORIGIN = ${JSON.stringify(mediaOrigin)}
ADMIN_EMAILS = "admin@example.test"
GOOGLE_CLIENT_ID = ""
GITHUB_CLIENT_ID = ""
DEV_LOGIN = "1"
[[env.dev.durable_objects.bindings]]
name = "LIVE"
class_name = "LiveRoom"
[[env.dev.d1_databases]]
binding = "DB"
database_name = ${JSON.stringify(bucket)}
database_id = "00000000-0000-0000-0000-000000000000"
migrations_dir = ${JSON.stringify(path.join(worker, 'migrations'))}
[[env.dev.r2_buckets]]
binding = "FILES"
bucket_name = ${JSON.stringify(bucket)}
`);
  wrangler = path.join(worker, 'node_modules/wrangler/bin/wrangler.js');
  common = ['--config', config, '--env', 'dev', '--local', '--persist-to', path.join(temporary, 'state')];
  await bounded(launch([wrangler, 'd1', 'migrations', 'apply', bucket, ...common]), 90000, 'Local migrations');
  apiServer = launch([wrangler, 'dev', ...common, '--ip', '127.0.0.1', '--port', String(port), '--inspector-port', '0']);
  const deadline = Date.now() + 90000;
  for (;;) {
    if (apiServer.finished || apiServer.failure) throw Error('Local API exited ' + apiServer.log);
    try { if ((await fetch(api + '/me', { signal: AbortSignal.timeout(1000) })).status === 200) break; } catch {}
    if (Date.now() > deadline) throw Error('Local API startup timeout ' + apiServer.log);
    await delay(250);
  }
  const admin = await client().login('Promotion admin', 'admin');
  const author = await client().login('Promotion author', 'author');
  const reviewer = await client().login('Promotion reviewer', 'reviewer');
  const outsider = await client().login('Unrelated image owner', 'author');
  const imageBytes = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aZVEAAAAASUVORK5CYII=', 'base64');
  const image = ok(await author.call('POST', '/images', imageBytes), 201);
  assert.equal(new URL(image.url).origin, mediaOrigin);
  const canonical = JSON.parse(await readFile(path.join(root, 'tests/fixtures/community-canonical.json'), 'utf8'));
  canonical.course.title = title;
  canonical.course.lessons[0].body += `\n\n![Owned synthetic observation image](${image.url})`;
  canonical.course.banks[0].questions[0].explanation = secret;
  canonical.course.banks[0].questions.push({ id: 'synthetic-order-private-key', topic: 'Observation', type: 'order',
    stem: 'Arrange the observation steps in order.', choices: [orderSecret + '_FIRST', orderSecret + '_SECOND'], answer: [] });
  canonical.course.decks[0].cards[0].back = secret;
  canonical.course.spreadsheetAssignments[0].answers = { 'Count!B1': 4 };
  const source = await createSource(author, reviewer, canonical);
  const inspected = await inspect(admin, source.id);
  assert.deepEqual(inspected.candidate.source, canonical, 'all authored surfaces and identities retained');
  assert.equal(inspected.candidate.course.id, canonical.course.id);
  assert.equal(inspected.candidate.course.revision, canonical.course.revision);
  assert.equal(inspected.candidate.provenance.status, 'unapproved-candidate');
  assert.equal(inspected.candidate.provenance.transformations.length, 1);
  assert.equal(inspected.candidate.provenance.transformations[0].imageId, image.id);
  assert(inspected.candidate.course.lessons[0].body.includes('data:image/png;base64,'));
  assert(!JSON.stringify(inspected.candidate.course).includes(image.url), 'candidate has no unresolved owned image');
  const preparer = await tsImport('../src/lib/promotionCandidate.ts', import.meta.url);
  const expected = await preparer.preparePromotionCandidate({ payload: canonical, communityId: source.id,
    publishedVersion: 1, communityImageOrigin: mediaOrigin }, async id => {
    assert.equal(id, image.id); return 'data:image/png;base64,' + imageBytes.toString('base64');
  });
  assert.deepEqual(inspected.candidate, expected, 'real server embeds only exact owned media and preserves canonical parity');
  const request = preparation(inspected);
  const prepared = ok(await admin.call('POST', base + '/candidates', request), 201);
  const replay = await admin.call('POST', base + '/candidates', request);
  assert([200, 201].includes(replay.status), JSON.stringify(replay.data));
  assert.equal(replay.data.id, prepared.id); assert.equal(replay.data.revision, prepared.revision);
  assert.equal(prepared.state, 'prepared'); assert.equal(prepared.review, null); assert.equal(prepared.canExport, false);
  assert.equal((await admin.call('GET', `${base}/candidates/${prepared.id}/export`)).status, 409);
  assert.equal((await admin.call('POST', base + '/candidates', { ...request, digest: '0'.repeat(64) })).status, 409, 'request identity cannot change content');
  for (const identity of [client(), author, reviewer]) {
    for (const [method, route, body] of [
      ['GET', '/session'], ['GET', '/sources'], ['GET', `/sources/${source.id}?version=1`],
      ['GET', '/candidates'], ['GET', `/candidates/${prepared.id}`], ['GET', `/candidates/${prepared.id}/export`],
      ['POST', '/candidates', request], ['POST', `/candidates/${prepared.id}/review`, {}],
      ['POST', `/candidates/${prepared.id}/reject`, {}], ['POST', `/candidates/${prepared.id}/revoke`, {}],
    ]) assert([401, 403].includes((await identity.call(method, base + route, body)).status), `${method} ${route} denied to non-admin`);
  }
  for (const field of ['candidate', 'document', 'review']) {
    const result = await admin.call('POST', base + '/candidates', { ...request, requestId: randomUUID(), [field]: prepared });
    assert.equal(result.status, 400, `${field} import cannot carry review or replace server canonical source`);
  }
  assert.equal((await admin.call('POST', base + '/import', prepared)).status, 404);
  const sources = ok(await admin.call('GET', base + '/sources'));
  assert(sources.sources.some(item => item.communityId === source.id && item.publishedVersion === 1));
  const listed = ok(await admin.call('GET', base + '/candidates'));
  assert.equal(listed.candidates.filter(item => item.id === prepared.id).length, 1);
  const stale = await createSource(author, reviewer, clone(canonical), 'Synthetic stale source');
  const staleInspection = await inspect(admin, stale.id);
  const next = clone(stale.document); next.canonical.course.title = 'New publication version'; next.title = next.canonical.course.title;
  ok(await author.call('PUT', `/drafts/${stale.id}`, next)); ok(await author.call('POST', `/drafts/${stale.id}/publish`));
  assert.equal((await admin.call('POST', base + '/candidates', preparation(staleInspection))).status, 409, 'new immutable publication invalidates captured source');
  assert.equal((await admin.call('GET', `${base}/sources/${stale.id}?version=1`)).status, 409, 'old version cannot masquerade as current reviewed source');
  checks.push('real full canonical source, owned PNG upload and deterministic media-only server parity');
  checks.push('private durable preparation, stable request identity replay, no imported authority, all non-admin endpoints denied');
  checks.push('unreviewed export and stale immutable publication blocked');
  const fixture = { admin, author, reviewer, outsider, image, imageBytes, canonical, source, inspected, prepared };
  await writeFile(path.join(out, 'bootstrap.json'), JSON.stringify({ passed: true, browser: 'not-yet-run',
    scope: 'Disposable identities, loopback Worker, isolated D1/R2; no production writes or publisher authority.',
    candidateId: prepared.id, sourceId: source.id, courseId: canonical.course.id,
    authoredRevision: canonical.course.revision, checks }, null, 2));
  return fixture;
}

const heading = name => page.getByRole('heading', { name, exact: true });
const button = name => page.getByRole('button', { name, exact: true });
async function settled() { await page.waitForFunction(() => document.querySelector('main') && document.querySelector('main').getAttribute('aria-busy') !== 'true'); }
async function click(name) { await button(name).click(); await settled(); }
async function contextFor(identity, width, colorScheme = 'light') {
  const context = await browser.newContext({ viewport: { width, height: 1000 }, colorScheme,
    reducedMotion: 'reduce', acceptDownloads: true });
  await context.route('**/*', async route => {
    const target = new URL(route.request().url());
    if (['data:', 'blob:'].includes(target.protocol)) return route.continue();
    const upstream = target.origin === origin ? appServerOrigin : target.origin === mediaOrigin ? api : null;
    if (!upstream) { deniedNetwork.push({ current, origin: target.origin }); return route.abort(); }
    // Forward real browser cookies, Origin, preflight and request bodies unchanged.
    // Only the socket destination and Host are mapped to disposable local servers.
    const headers = await route.request().allHeaders(); delete headers.host;
    const response = await route.fetch({ url: upstream + target.pathname + target.search, headers, maxRedirects: 0 });
    await route.fulfill({ response });
  });
  // HMR is not part of document acceptance, and no virtual-domain socket may escape.
  await context.routeWebSocket('**/*', socket => {
    const target = new URL(socket.url());
    if (target.hostname !== new URL(origin).hostname) deniedNetwork.push({ current, origin: target.origin });
    socket.close();
  });
  if (identity?.cookie) {
    const [name, ...value] = identity.cookie.split('=');
    await context.addCookies([{ name, value: value.join('='), url: mediaOrigin, httpOnly: true, secure: true, sameSite: 'Lax' }]);
  }
  page = await context.newPage(); page.setDefaultTimeout(20000);
  page.on('pageerror', error => errors.push({ current, message: error.message }));
  return context;
}
async function audit(name) {
  current = name; await page.evaluate(() => document.fonts.ready);
  assert(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth) <= 1, name + ' horizontal overflow');
  await page.addScriptTag({ content: await readFile(path.join(root, 'node_modules/axe-core/axe.min.js'), 'utf8') });
  const violations = await page.evaluate(async () => (await window.axe.run(document, {
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] },
  })).violations.map(item => ({ id: item.id, targets: item.nodes.map(node => ({ target: node.target, summary: node.failureSummary })) })));
  await writeFile(path.join(out, name + '-accessibility.json'), JSON.stringify({ violations }, null, 2));
  await page.screenshot({ path: path.join(out, name + '.png'), fullPage: true }); screenshots.push(name + '.png');
  assert.deepEqual(violations, [], name + ' WCAG 2.2 AA automated checks');
}

const checklistLabels = [
  'I reviewed content accuracy and learner suitability.',
  'I compared the source and embedded candidate for parity, including media substitutions.',
  'I reviewed accessibility and learner-facing resource parity.',
  'I checked source attribution and retained the supporting evidence.',
  'I reviewed evidence of rights to distribute the source content.',
  'I reviewed evidence of rights to distribute all included media (or verified there is no media).',
];
// React updates textarea.defaultValue, so its text becomes part of the wrapping
// label's textContent. Use its semantic role/name, not exact raw label text.
const notes = () => page.getByRole('textbox', { name: /^Review notes and limitations\b/ });
async function uncheckedReview() {
  await click('Begin exact revision review');
  for (const label of checklistLabels) assert.equal(await page.getByLabel(label, { exact: true }).isChecked(), false, label + ' starts unchecked');
  assert.equal(await button('Record review for handoff').isEnabled(), false, 'unchecked form cannot approve');
}
async function cancelBackNavigation() {
  const before = page.url(); let dismissed = false;
  page.once('dialog', async dialog => { assert.equal(dialog.type(), 'beforeunload'); dismissed = true; await dialog.dismiss(); });
  try { await page.goBack({ waitUntil: 'commit', timeout: 10000 }); }
  catch (error) { assert(/ERR_ABORTED|Navigation.*(?:cancel|interrupt)/i.test(String(error)), String(error)); }
  assert(dismissed, 'dirty document Back presents a beforeunload confirmation');
  assert.equal(page.url(), before); assert.equal(await notes().inputValue(), 'Unsaved review must survive cancelled navigation.');
}
async function fillReview(note = 'Synthetic review exercise only. This is not publisher authorization or a determination of real rights.') {
  for (const label of checklistLabels) await page.getByLabel(label, { exact: true }).check();
  for (const [index, kind] of ['content', 'rights', 'media-rights'].entries()) {
    await click('Add evidence');
    await page.getByLabel(`Evidence ${index + 1} kind`, { exact: true }).selectOption(kind);
    await page.getByLabel(`Evidence ${index + 1} reference`, { exact: true }).fill(`Synthetic acceptance fixture ${kind}; retained only inside isolated test state`);
    await page.getByLabel(`Evidence ${index + 1} retained text`, { exact: true }).fill(
      `${kind} test statement. Disposable fixture authored for software validation. No real publication, adoption, external license, or official publisher decision is asserted.`);
  }
  await notes().fill(note);
}
async function withLostResponse(routePath, action, status) {
  const url = mediaOrigin + routePath, ids = [], bodies = [];
  let first = true, committed;
  const intercept = async route => {
    if (route.request().method() !== 'POST') return route.fallback();
    const body = route.request().postDataJSON(); ids.push(body.requestId); bodies.push(body);
    if (first) {
      first = false; const headers = await route.request().allHeaders(); delete headers.host;
      const response = await route.fetch({ url: api + routePath, headers, maxRedirects: 0 });
      assert.equal(response.status(), status, await response.text()); committed = await response.json();
      return route.abort('failed'); // Commit is confirmed; only the browser response is lost.
    }
    return route.fallback();
  };
  await page.route(url, intercept);
  try {
    await action(); await heading('Outcome not confirmed').waitFor();
    assert.equal(await button('Refresh lists').isEnabled(), false, 'uncertain mutation prevents switching');
    const before = page.url(); await button('Leave promotions').click(); assert.equal(page.url(), before, 'uncertain operation cannot discard its retry identity');
    await click('Retry pending operation');
    assert.equal(await heading('Outcome not confirmed').count(), 0);
    assert.equal(ids.length, 2); assert.equal(ids[0], ids[1]); assert.deepEqual(bodies[0], bodies[1], 'retry reuses exact body and stable identity');
    return committed;
  } finally { await page.unroute(url, intercept); }
}
async function mutationResponse(routePath, buttonName) {
  const response = page.waitForResponse(response => response.url() === mediaOrigin + routePath && response.request().method() === 'POST');
  await click(buttonName);
  const received = await response;
  assert([200, 201].includes(received.status()), await received.text());
  return received.json();
}
async function downloadHandoff(admin, saved, name) {
  const retained = ok(await admin.call('GET', `${base}/candidates/${saved.id}/export`));
  const event = page.waitForEvent('download'); await click('Export reviewed handoff');
  const download = await event, file = path.join(out, name + '-handoff.json');
  await download.saveAs(file);
  const bytes = await readFile(file);
  const model = await tsImport('../src/lib/promotionReview.ts', import.meta.url);
  const handoff = await model.verifyPromotionHandoff(bytes, { communityImageOrigin: mediaOrigin, expectedHandoffSha256: retained.handoffSha256 });
  assert.deepEqual(handoff, retained, 'browser file equals the independent authenticated API export');
  assert.deepEqual(handoff.candidate, saved.candidate);
  assert.equal(handoff.status, 'reviewed-not-authorized');
  assert.equal(handoff.review.decision, 'approved-for-handoff');
  assert.equal(handoff.review.candidateSha256, saved.digest);
  for (const key of ['contentAccuracy', 'parityReviewed', 'accessibility', 'attribution', 'sourceRights', 'mediaRights']) assert.equal(handoff.review.checklist[key], true);
  const changed = clone(handoff); changed.candidate.course.lessons[0].body += '\nUnauthorized transport change.';
  await assert.rejects(model.verifyPromotionHandoff(changed, { communityImageOrigin: mediaOrigin, expectedHandoffSha256: retained.handoffSha256 }));
  await assert.rejects(model.verifyPromotionHandoff(bytes, { communityImageOrigin: mediaOrigin, expectedHandoffSha256: '0'.repeat(64) }));
  assert.equal((await admin.call('POST', base + '/candidates', { requestId: randomUUID(), handoff })).status, 400, 'portable reviewed claims cannot re-enter as server review authority');
  await writeFile(path.join(out, name + '-transport.json'), JSON.stringify({ bytes: bytes.length,
    fileSha256: sha256(bytes), independentlyRetainedHandoffSha256: retained.handoffSha256,
    transportIntegrity: true, publisherAuthorization: false, publication: false }, null, 2));
  return { file, handoffSha256: retained.handoffSha256 };
}
async function publisherTransport(exported) {
  current = 'isolated exported handoff repository verifier and unchanged publisher pipeline';
  const log = await bounded(launch(['--import', path.join(root, 'node_modules/tsx/dist/loader.mjs'),
    path.join(root, 'tests/promotion-publisher.test.mts')], {
    PROMOTION_TEST_HANDOFF: exported.file,
    PROMOTION_TEST_MEDIA_ORIGIN: mediaOrigin,
    PROMOTION_TEST_HANDOFF_SHA256: exported.handoffSha256,
  }), 180000, 'Exported fixture through repository verifier and release integrity gates');
  await writeFile(path.join(out, 'publisher-pipeline.log'), log);
  checks.push('actual browser export passed repository verifier and unchanged publisher script in a temporary synthetic repository; independent publisher action remains separate');
}
function deniedDecision(saved, decision, note) {
  return { requestId: randomUUID(), expectedRevision: saved.revision, digest: saved.digest,
    review: { decision, intendedOfficial: { courseId: saved.candidate.course.id, revision: saved.candidate.course.revision },
      checklist: Object.fromEntries(['contentAccuracy', 'parityReviewed', 'accessibility', 'attribution', 'sourceRights', 'mediaRights'].map(key => [key, false])), evidence: [], notes: note } };
}
async function assertSourceGuards(fixture, saved, source, interact = true) {
  const { admin, outsider, image, imageBytes } = fixture;
  const publicSource = await admin.call('GET', `/courses/${source.id}`);
  assert.equal(publicSource.status, 200);
  const exactSource = JSON.stringify(publicSource.data.doc);
  assert.equal(sha256(exactSource), saved.source.packageSha256, 'fault injection retains exact restoration bytes');
  const assertBlocked = async name => {
    const current = ok(await admin.call('GET', `${base}/candidates/${saved.id}`));
    assert(current.problems.length > 0, name + ' invalidates current source'); assert.equal(current.canExport, false);
    assert.equal((await admin.call('GET', `${base}/candidates/${saved.id}/export`)).status, 409, name + ' blocks exact export');
    if (interact) {
      await click('Reload saved candidate'); await heading('Current source problems').waitFor();
      assert.equal(await button('Export reviewed handoff').isEnabled(), false, name + ' disables UI export');
    }
  };
  const assertRestored = async () => {
    const current = ok(await admin.call('GET', `${base}/candidates/${saved.id}`));
    assert.equal(current.canExport, saved.state === 'reviewed'); assert.deepEqual(current.problems, []);
    if (interact) { await click('Reload saved candidate'); assert.equal(await button('Export reviewed handoff').isEnabled(), true); }
  };
  // Deliberate corruption only in the disposable local bucket, never a publication write.
  const corruptSource = clone(publicSource.data.doc); corruptSource.canonical.course.description += ' Changed immutable bytes.';
  await putObject(`courses/${source.id}.v1.json`, JSON.stringify(corruptSource), 'application/json');
  try { await assertBlocked('immutable published source byte mutation'); }
  finally { await putObject(`courses/${source.id}.v1.json`, exactSource, 'application/json'); }
  await assertRestored();
  const reviewedAt = saved.source.reviewedAt;
  assert(/^[A-Za-z0-9_-]+$/.test(source.id) && /^[0-9TZ:.-]+$/.test(reviewedAt));
  await d1(`UPDATE courses SET reviewed_at = '2020-01-01T00:00:00.000Z' WHERE id = '${source.id}'`);
  try { await assertBlocked('current community review mutation'); }
  finally { await d1(`UPDATE courses SET reviewed_at = '${reviewedAt}' WHERE id = '${source.id}'`); }
  await assertRestored();
  const corruptImage = Buffer.from(imageBytes); corruptImage[corruptImage.length - 1] ^= 1;
  await putObject(`images/${image.id}`, corruptImage, 'image/png');
  try { await assertBlocked('owned media byte mutation'); }
  finally { await putObject(`images/${image.id}`, imageBytes, 'image/png'); }
  await assertRestored();
  const outsiderId = ok(await outsider.call('GET', '/me')).user.id;
  assert(/^[A-Za-z0-9_-]+$/.test(outsiderId) && /^[A-Za-z0-9_-]+$/.test(saved.source.ownerId));
  await d1(`UPDATE images SET owner_id = '${outsiderId}' WHERE id = '${image.id}'`);
  try { await assertBlocked('media ownership mutation'); }
  finally { await d1(`UPDATE images SET owner_id = '${saved.source.ownerId}' WHERE id = '${image.id}'`); }
  await assertRestored();
  checks.push(`${interact ? 'reviewed export and UI' : 'prepared candidate API'} fail closed on real R2 immutable-source/media-byte corruption and D1 current-review/media-ownership changes; exact fixture restoration verified`);
}
async function conflictAndRejection(fixture) {
  const { admin, author, reviewer, canonical } = fixture;
  const source = await createSource(author, reviewer, canonical, 'Synthetic conflict and rejection source');
  await click('Refresh lists'); await click(`Inspect source ${source.document.title}`);
  const saved = await mutationResponse(base + '/candidates', 'Prepare and save candidate');
  await uncheckedReview(); await fillReview('Preserved draft after a concurrent exact-revision decision.');
  ok(await admin.call('POST', `${base}/candidates/${saved.id}/reject`, deniedDecision(saved, 'rejected', 'Synthetic concurrent reviewer rejected this fixture.')));
  await click('Record review for handoff');
  await page.getByText(/Your in-memory review notes and checklist are preserved/).waitFor();
  assert.equal(await notes().inputValue(), 'Preserved draft after a concurrent exact-revision decision.');
  for (const label of checklistLabels) assert.equal(await page.getByLabel(label, { exact: true }).isChecked(), true);
  page.once('dialog', dialog => dialog.dismiss()); await click('Reload saved candidate');
  assert.equal(await notes().inputValue(), 'Preserved draft after a concurrent exact-revision decision.');
  page.once('dialog', dialog => dialog.accept()); await click('Reload saved candidate');
  assert.equal(await notes().count(), 0); assert.equal(await button('Export reviewed handoff').count(), 0);
  assert.equal(ok(await admin.call('GET', `${base}/candidates/${saved.id}`)).state, 'rejected');
  // A fresh preparation has no inherited approval; rejection has an explicit cancel path.
  await click(`Inspect source ${source.document.title}`);
  const next = await mutationResponse(base + '/candidates', 'Prepare and save candidate');
  assert.notEqual(next.id, saved.id); assert.equal(next.review, null);
  await click('Reject candidate'); await notes().fill('Synthetic rejection notes awaiting explicit submission.');
  page.once('dialog', dialog => dialog.dismiss()); await click('Cancel review');
  assert.equal(await notes().inputValue(), 'Synthetic rejection notes awaiting explicit submission.');
  page.once('dialog', dialog => dialog.accept()); await click('Cancel review');
  assert.equal(ok(await admin.call('GET', `${base}/candidates/${next.id}`)).state, 'prepared', 'cancel did not reject');
  await click('Reject candidate'); await notes().fill('Synthetic fixture rejected because this exercise must not be treated as an official release.');
  const rejected = await mutationResponse(`${base}/candidates/${next.id}/reject`, 'Confirm rejection');
  assert.equal(rejected.state, 'rejected');
  assert.equal((await admin.call('GET', `${base}/candidates/${next.id}/export`)).status, 409);
  checks.push('concurrent decision preserves dirty checklist/notes, explicit reload cancel/accept, fresh preparation clears authority, rejection cancel and terminal persistence');
}
async function runAcceptance(fixture) {
  const { admin, author, reviewer, canonical } = fixture;
  for (const identity of [null, author, reviewer]) {
    current = 'non-admin private UI denial';
    const context = await contextFor(identity, 320, 'dark');
    await page.goto(origin + '/admin/promotions?app'); await heading('Administrator sign-in required').waitFor();
    assert.equal(await button('Prepare and save candidate').count(), 0);
    assert.equal(await button('Begin exact revision review').count(), 0);
    assert(!(await page.locator('body').textContent()).includes(secret)); await context.close();
  }
  checks.push('anonymous, author and reviewer UI exposes no private candidate editor or teacher keys');
  let last;
  for (const width of [1280, 320]) for (const theme of ['light', 'dark']) {
    const name = `${width}-${theme}`, source = await createSource(author, reviewer, canonical, `${title} ${name}`);
    current = name + ' lifecycle';
    const context = await contextFor(admin, width, theme);
    await page.goto(origin + '/admin/promotions?app&history=before'); await heading('Reviewed community sources').waitFor(); await settled();
    await page.goto(origin + '/admin/promotions?app'); await heading('Reviewed community sources').waitFor(); await settled();
    assert.equal(await page.locator('input[type=file]').count(), 0, 'no import path can convey reviewed authority');
    await click(`Inspect source ${source.document.title}`);
    await page.getByText('Inspect full immutable community source', { exact: true }).click();
    await page.getByText('Inspect full self-contained candidate and teacher keys', { exact: true }).click();
    assert((await page.locator('body').textContent()).includes(secret), 'admin can inspect teacher keys explicitly');
    await audit(name + '-source-parity');
    let saved;
    if (name === '1280-light') saved = await withLostResponse(base + '/candidates', () => click('Prepare and save candidate'), 201);
    else saved = await mutationResponse(base + '/candidates', 'Prepare and save candidate');
    assert.equal(saved.state, 'prepared'); assert.equal(saved.review, null);
    assert.equal(ok(await admin.call('GET', `${base}/candidates/${saved.id}`)).revision, 1, 'save response-loss retry did not duplicate');
    await uncheckedReview(); await notes().fill('Unsaved review must survive cancelled navigation.');
    for (const action of ['Cancel review', 'Close candidate', 'Leave promotions']) {
      current = `${name} dirty ${action} cancellation`;
      const before = page.url(); const dialog = page.waitForEvent('dialog'); const actionClick = click(action);
      const confirmation = await dialog; assert.equal(confirmation.type(), 'confirm'); await confirmation.dismiss(); await actionClick;
      assert.equal(page.url(), before); assert.equal(await notes().inputValue(), 'Unsaved review must survive cancelled navigation.');
    }
    await cancelBackNavigation();
    page.once('dialog', dialog => dialog.accept()); await click('Cancel review'); assert.equal(await notes().count(), 0);
    await uncheckedReview(); await fillReview(); await audit(name + '-review');
    if (name === '1280-light') saved = await withLostResponse(`${base}/candidates/${saved.id}/review`, () => click('Record review for handoff'), 200);
    else saved = await mutationResponse(`${base}/candidates/${saved.id}/review`, 'Record review for handoff');
    assert.equal(saved.state, 'reviewed'); assert.equal(saved.revision, 2); assert.equal(saved.canExport, true);
    assert.deepEqual(saved.history, [saved.review], 'approval is retained as the first authenticated decision');
    const exported = await downloadHandoff(admin, saved, name);
    if (name === '1280-light') {
      await publisherTransport(exported);
      await assertSourceGuards(fixture, saved, source);
    }
    await page.reload(); await heading('Saved candidates and decisions').waitFor(); await settled();
    await click(`Open candidate ${source.document.title}`); assert.equal(await button('Export reviewed handoff').isEnabled(), true);
    await audit(name + '-reviewed-reopened');
    await page.goBack(); await heading('Reviewed community sources').waitFor(); await settled();
    assert(page.url().includes('history=before'));
    await page.goForward(); await heading('Reviewed community sources').waitFor(); await settled();
    await click(`Open candidate ${source.document.title}`); assert.equal(await button('Export reviewed handoff').isEnabled(), true, 'Back/Forward reopens only current server state');
    await click('Open learner-safe preview'); await heading('Learner-safe candidate preview').waitFor();
    assert.equal(await button('Export reviewed handoff').count(), 0, 'private admin controls physically removed');
    assert.equal(await notes().count(), 0);
    assert(!(await page.locator('body').textContent()).includes(secret), 'teacher keys physically absent, not merely hidden');
    assert(!(await page.locator('body').innerHTML()).includes(orderSecret), 'authored ordering answer sequence is absent from learner DOM');
    await page.getByText('Question synthetic-order-private-key', { exact: true }).click();
    await page.getByText(/Ordering choices are withheld: their authored sequence is the answer key/).waitFor();
    assert.equal(await page.locator('iframe').count(), 0, 'learner preview does not execute untrusted resources');
    await audit(name + '-learner-safe'); await click('Close learner preview'); await settled();
    await click('Revoke review'); await click('Cancel review');
    assert.equal(ok(await admin.call('GET', `${base}/candidates/${saved.id}`)).state, 'reviewed');
    await click('Revoke review'); await notes().fill('Synthetic acceptance finished; retained review revoked before any real publication.');
    const revoked = await mutationResponse(`${base}/candidates/${saved.id}/revoke`, 'Confirm revocation');
    assert.equal(revoked.state, 'revoked'); assert.equal(revoked.canExport, false);
    assert.equal(revoked.history.length, 2, 'revocation retains both immutable decisions');
    assert.deepEqual(revoked.history.find(record => record.id === saved.review.id), saved.review, 'original approval and all retained evidence survive revocation unchanged');
    assert.deepEqual(revoked.history.find(record => record.id === revoked.review.id), revoked.review);
    assert.equal(revoked.review.decision, 'revoked');
    assert.equal((await admin.call('GET', `${base}/candidates/${saved.id}/export`)).status, 409);
    await click('Reload saved candidate'); assert.equal(await button('Export reviewed handoff').count(), 0);
    await page.reload(); await heading('Saved candidates and decisions').waitFor(); await settled();
    await click(`Open candidate ${source.document.title}`);
    const reopenedHistory = ok(await admin.call('GET', `${base}/candidates/${saved.id}`));
    assert.deepEqual(reopenedHistory.history, revoked.history); assert.equal(reopenedHistory.canExport, false);
    await page.getByText('Inspect complete decision history and retained evidence', { exact: true }).click();
    const approvedRecord = page.getByRole('region', { name: 'Decision revision 2', exact: true });
    const revokedRecord = page.getByRole('region', { name: 'Decision revision 3', exact: true });
    assert.deepEqual(JSON.parse(await approvedRecord.locator('pre').textContent()), saved.review, 'administrator can inspect original approval evidence after reopening revoked candidate');
    assert.deepEqual(JSON.parse(await revokedRecord.locator('pre').textContent()), revoked.review, 'administrator can inspect the later revocation record and reason');
    assert.equal(await button('Export reviewed handoff').count(), 0, 'historical approval never restores export controls');
    assert.equal((await admin.call('GET', `${base}/candidates/${saved.id}/export`)).status, 409, 'retained approval never restores server export');
    await audit(name + '-revoked-history');
    assert(!(await page.evaluate(() => JSON.stringify([Object.entries(localStorage), Object.entries(sessionStorage)]))).includes(secret), 'private source and review stay out of browser persistence');
    checks.push(`${name}: explicit source/parity inspection, unchecked review + evidence clicks, dirty cancel/close/leave, persistence/reopen, exact transport, learner-safe DOM including ordering-key exclusion, revoke/cancel, both historical evidence records and terminal export denial`);
    if (name === '1280-light') await conflictAndRejection(fixture);
    last = { context, saved: revoked };
    if (name !== '320-dark') await context.close();
  }
  // Current account/session check physically removes all private state.
  current = 'revoked session clears private source and review';
  await click(`Inspect source ${title}`); await click('Prepare and save candidate'); await uncheckedReview();
  await notes().fill(secret + ' unsaved private notes');
  ok(await admin.call('POST', '/auth/logout'));
  await page.evaluate(() => window.dispatchEvent(new Event('focus')));
  await heading('Administrator sign-in required').waitFor();
  assert.equal(await notes().count(), 0); assert(!(await page.locator('body').textContent()).includes(secret));
  assert.equal(await button('Prepare and save candidate').count(), 0);
  checks.push('revoked administrator session clears private candidate, teacher keys, dirty notes and pending authority on current access check');
  await audit('320-dark-session-revoked'); await last.context.close();
}

try {
  const fixture = await bootstrap();
  if (bootstrapOnly) {
    await assertSourceGuards(fixture, fixture.prepared, fixture.source, false);
    await writeFile(path.join(out, 'result.json'), JSON.stringify({ passed: false, bootstrapPassed: true,
      browser: 'not-run: explicit --bootstrap-only', checks, screenshots, errors,
      limitation: 'Bootstrap alone is not browser acceptance. Exact-head CI must run without --bootstrap-only.' }, null, 2));
    console.log('Real Worker/D1/R2 bootstrap passed. Browser and accessibility were not run (--bootstrap-only).');
  } else {
    current = 'browser launch';
    const pw = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
    browser = await (pw.chromium || pw.default.chromium).launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    await runAcceptance(fixture);
    assert.deepEqual(errors, [], 'no browser page errors');
    assert.deepEqual(deniedNetwork, [], 'no attempted external browser requests');
    await writeFile(path.join(out, 'result.json'), JSON.stringify({ passed: true,
      scope: 'Real isolated Worker/D1/R2 and browser; synthetic review actions only. No official publisher decision or publication.',
      checks, screenshots, errors, deniedNetwork }, null, 2));
    console.log('Promotion acceptance passed using disposable local-only identities, Worker/D1/R2 and browser.');
  }
} catch (error) {
  await writeFile(path.join(out, 'failure.json'), JSON.stringify({ current, error: String(error), checks, screenshots, errors, deniedNetwork }, null, 2));
  await page?.screenshot({ path: path.join(out, 'failure.png'), fullPage: true }).catch(() => {});
  if (page) {
    await writeFile(path.join(out, 'failure.html'), await page.content()).catch(() => {});
    const fields = await page.locator('textarea').evaluateAll(nodes => nodes.map(node => ({ value: node.value, labelText: node.closest('label')?.textContent, ariaLabel: node.getAttribute('aria-label') }))).catch(() => []);
    await writeFile(path.join(out, 'failure-fields.json'), JSON.stringify(fields, null, 2));
  }
  if (apiServer) console.error(apiServer.log);
  throw error;
} finally {
  await browser?.close(); await server?.close(); await Promise.all([...children].map(stop));
  await rm(temporary, { recursive: true, force: true });
}

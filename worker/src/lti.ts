/** Optional LTI 1.3 resource-link tool. No registration, account or identity is created here. */
export interface LtiEnv { DB: D1Database; API_ORIGIN: string; APP_ORIGIN: string; LTI_REGISTRATIONS?: string }
export interface LtiRegistration {
  issuer: string; clientId: string; deploymentId: string; authorizationEndpoint: string;
  /** Exact resource URLs on APP_ORIGIN. No prefix/wildcard matching. */
  targets: string[]; keys: (JsonWebKey & { kid: string })[];
}
const CLAIM = 'https://purl.imsglobal.org/spec/lti/claim/';
const TTL = 300;
// Validate vocabulary without mapping any external role to Erudior permissions.
const roleVocabularies: Record<string, string[]> = {
  'http://purl.imsglobal.org/vocab/lis/v2/system/person#': ['Administrator','None','AccountAdmin','Creator','SysAdmin','SysSupport','User'],
  'http://purl.imsglobal.org/vocab/lis/v2/institution/person#': ['Administrator','Faculty','Guest','None','Other','Staff','Student','Alumni','Instructor','Learner','Member','Mentor','Observer','ProspectiveStudent'],
  'http://purl.imsglobal.org/vocab/lis/v2/membership#': ['Administrator','ContentDeveloper','Instructor','Learner','Mentor','Manager','Member','Officer'],
  'http://purl.imsglobal.org/vocab/lti/system/person#': ['TestUser'],
};
const subRoles: Record<string, string[]> = {
  Administrator: ['Administrator','Developer','ExternalDeveloper','ExternalSupport','ExternalSystemAdministrator','Support','SystemAdministrator'],
  ContentDeveloper: ['ContentDeveloper','ContentExpert','ExternalContentExpert','Librarian'],
  Instructor: ['ExternalInstructor','Grader','GuestInstructor','Lecturer','PrimaryInstructor','SecondaryInstructor','TeachingAssistant','TeachingAssistantGroup','TeachingAssistantOffering','TeachingAssistantSection','TeachingAssistantSectionAssociation','TeachingAssistantTemplate'],
  Learner: ['ExternalLearner','GuestLearner','Instructor','Learner','NonCreditLearner'],
  Manager: ['AreaManager','CourseCoordinator','ExternalObserver','Manager','Observer'], Member: ['Member'],
  Mentor: ['Advisor','Auditor','ExternalAdvisor','ExternalAuditor','ExternalLearningFacilitator','ExternalMentor','ExternalReviewer','ExternalTutor','LearningFacilitator','Mentor','Reviewer','Tutor'],
  Officer: ['Chair','Communications','Secretary','Treasurer','Vice-Chair'],
};
const knownRoles = new Set([...Object.entries(roleVocabularies).flatMap(([prefix, values]) => values.map(v => prefix+v)),
  ...Object.entries(subRoles).flatMap(([role, values]) => values.map(v => `http://purl.imsglobal.org/vocab/lis/v2/membership/${role}#${v}`))]);
const LIMIT = 48_000;
class Failure extends Error { constructor(public status: number, message: string) { super(message); } }
const fail = (message = 'Invalid or expired LTI launch.'): never => { throw new Failure(400, message); };
const plain = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
const text = (v: unknown, max = 2048): v is string => typeof v === 'string' && v.length > 0 && v.length <= max && !/[\x00-\x1f\x7f]/.test(v);
const opaque = (v: unknown): v is string => text(v, 255) && /^[\x21-\x7e]+$/.test(v);
function https(value: unknown): URL {
  if (!text(value)) return fail();
  let u: URL; try { u = new URL(value); } catch { return fail(); }
  if (u.protocol !== 'https:' || u.username || u.password || u.hash) return fail();
  return u;
}
function registrations(env: LtiEnv): LtiRegistration[] {
  if (!env.LTI_REGISTRATIONS?.trim()) return [];
  if (env.LTI_REGISTRATIONS.length > 100_000) return fail();
  const app = https(env.APP_ORIGIN); const api = https(env.API_ORIGIN);
  if (app.origin !== env.APP_ORIGIN || api.origin !== env.API_ORIGIN) return fail();
  const rows: unknown = JSON.parse(env.LTI_REGISTRATIONS);
  if (!Array.isArray(rows) || rows.length > 20) return fail();
  const seen = new Set<string>();
  for (const r of rows) {
    if (!plain(r) || Object.keys(r).some(k => !['issuer','clientId','deploymentId','authorizationEndpoint','targets','keys'].includes(k)) || !text(r.issuer) || https(r.issuer).search || !opaque(r.clientId) || !opaque(r.deploymentId)) return fail();
    const auth = https(r.authorizationEndpoint); if (auth.search) return fail();
    const id = JSON.stringify([r.issuer, r.clientId, r.deploymentId]); if (seen.has(id)) return fail(); seen.add(id);
    if (!Array.isArray(r.targets) || !r.targets.length || r.targets.length > 100 || r.targets.some(t => https(t).origin !== app.origin)) return fail();
    if (new Set(r.targets).size !== r.targets.length || !Array.isArray(r.keys) || !r.keys.length || r.keys.length > 8) return fail();
    const kids = new Set<string>();
    for (const k of r.keys) {
      if (!plain(k) || Object.keys(k).some(p => !['kty','n','e','kid','alg','use','key_ops','ext'].includes(p)) || !opaque(k.kid) || kids.has(k.kid) || k.kty !== 'RSA' || !text(k.n, 1400) || !text(k.e, 16) ||
          (k.alg !== undefined && k.alg !== 'RS256') || (k.use !== undefined && k.use !== 'sig') ||
          ['d','p','q','dp','dq','qi','oth'].some(p => p in k) ||
          (k.key_ops !== undefined && (!Array.isArray(k.key_ops) || k.key_ops.some(v => v !== 'verify')))) return fail();
      if (decode(k.n).length < 256) return fail(); kids.add(k.kid);
    }
  }
  return rows as LtiRegistration[];
}
function encode(bytes: Uint8Array): string { return btoa(String.fromCharCode(...bytes)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_'); }
function decode(value: string): Uint8Array {
  if (!/^[A-Za-z0-9_-]+$/.test(value)) return fail();
  try { const bytes = Uint8Array.from(atob(value.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0)); if (encode(bytes) !== value) return fail(); return bytes; } catch { return fail(); }
}
const random = () => encode(crypto.getRandomValues(new Uint8Array(32)));
async function hash(s: string): Promise<string> { return encode(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)))); }
function cookieName(state: string) { return `__Host-erudior_lti_${state}`; }
function cookie(name: string, value: string, age: number) { return `${name}=${value}; Path=/; Secure; HttpOnly; SameSite=None; Max-Age=${age}`; }
function cookies(req: Request): Map<string, string> {
  const result = new Map<string, string>();
  for (const part of (req.headers.get('Cookie') ?? '').split(';')) { const i = part.indexOf('='); if (i < 0) continue; const k = part.slice(0, i).trim(); if (result.has(k)) return fail(); result.set(k, part.slice(i + 1).trim()); }
  return result;
}
async function params(req: Request): Promise<URLSearchParams> {
  let p: URLSearchParams;
  if (req.method === 'GET') { if (req.url.length > 8192) return fail(); p = new URL(req.url).searchParams; }
  else {
    if (req.method !== 'POST' || req.headers.get('Content-Type')?.split(';')[0].trim() !== 'application/x-www-form-urlencoded') throw new Failure(415, 'LTI requires a form POST.');
    const reader = req.body?.getReader(); let size = 0; const chunks: Uint8Array[] = [];
    if (!reader) return fail();
    for (;;) { const {done,value} = await reader.read(); if (done) break; size += value.length; if (size > LIMIT) { await reader.cancel(); throw new Failure(413, 'LTI request is too large.'); } chunks.push(value); }
    const bytes = new Uint8Array(size); let offset = 0; for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
    p = new URLSearchParams(new TextDecoder('utf-8', { fatal: true, ignoreBOM: false }).decode(bytes));
  }
  const seen = new Set<string>(); p.forEach((v,k) => { if (seen.has(k) || !text(k, 100) || v.length > LIMIT) fail(); seen.add(k); });
  if (seen.size > 15) return fail(); return p;
}
interface State { state_hash: string; binding_hash: string; nonce_hash: string; registration_hash: string; target: string; expires: number }
function jsonPart(s: string): Record<string, unknown> {
  const value: unknown = JSON.parse(new TextDecoder('utf-8', { fatal: true, ignoreBOM: false }).decode(decode(s)));
  if (!plain(value)) return fail(); return value;
}
async function verify(token: string, r: LtiRegistration, state: State, now: number): Promise<void> {
  const parts = token.split('.'); if (parts.length !== 3) return fail();
  const header = jsonPart(parts[0]); const claims = jsonPart(parts[1]);
  if (header.alg !== 'RS256' || !opaque(header.kid) || Object.keys(header).some(k => !['alg','kid','typ'].includes(k)) || (header.typ !== undefined && header.typ !== 'JWT')) return fail();
  const jwk = r.keys.find(k => k.kid === header.kid); if (!jwk) return fail();
  const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
  if (!await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, decode(parts[2]), new TextEncoder().encode(`${parts[0]}.${parts[1]}`))) return fail();
  const aud = typeof claims.aud === 'string' ? [claims.aud] : claims.aud;
  if (claims.iss !== r.issuer || !Array.isArray(aud) || aud.length !== 1 || aud[0] !== r.clientId || (claims.azp !== undefined && claims.azp !== r.clientId)) return fail();
  if (typeof claims.exp !== 'number' || !Number.isInteger(claims.exp) || claims.exp <= now || claims.exp > now + TTL + 60 ||
      typeof claims.iat !== 'number' || !Number.isInteger(claims.iat) || claims.iat > now + 30 || claims.iat < now - TTL || claims.exp <= claims.iat ||
      (claims.nbf !== undefined && (typeof claims.nbf !== 'number' || !Number.isInteger(claims.nbf) || claims.nbf > now)) ||
      !text(claims.nonce, 100) || await hash(claims.nonce) !== state.nonce_hash) return fail();
  if (claims[CLAIM+'message_type'] !== 'LtiResourceLinkRequest' || claims[CLAIM+'version'] !== '1.3.0' ||
      claims[CLAIM+'deployment_id'] !== r.deploymentId || claims[CLAIM+'target_link_uri'] !== state.target) return fail();
  const resource = claims[CLAIM+'resource_link']; const roles = claims[CLAIM+'roles'];
  if (!plain(resource) || !opaque(resource.id) || !Array.isArray(roles) || roles.length > 30 || roles.some(v => !text(v, 512) || !/^https?:\/\//.test(v))) return fail();
  if (roles.length && !roles.some(v => knownRoles.has(v as string))) return fail();
  if (claims.sub !== undefined && !opaque(claims.sub)) return fail();
  // Deliberately do not retain or expose identity, context, roles, custom fields or service grants.
}
const safeHeaders = { 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer', 'X-Content-Type-Options': 'nosniff', 'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'" };
export async function handleLti(req: Request, env: LtiEnv): Promise<Response> {
  let clearCookie: string | undefined;
  try {
    const path = new URL(req.url).pathname;
    if (!['/lti/login','/lti/launch'].includes(path)) throw new Failure(404, 'Not found.');
    const rows = registrations(env); if (!rows.length) throw new Failure(404, 'LTI connections are not enabled.');
    const now = Math.floor(Date.now()/1000); const p = await params(req);
    if (path === '/lti/login') {
      const iss = p.get('iss'), client = p.get('client_id'), deployment = p.get('lti_deployment_id'), target = p.get('target_link_uri'), hint = p.get('login_hint');
      if (!text(iss) || !text(target) || !text(hint) || (p.has('client_id') && !opaque(client)) || (p.has('lti_deployment_id') && !opaque(deployment)) || (p.has('lti_message_hint') && !text(p.get('lti_message_hint')))) return fail();
      const matches = rows.filter(r => r.issuer === iss && (!client || r.clientId === client) && (!deployment || r.deploymentId === deployment) && r.targets.includes(target));
      if (matches.length !== 1) return fail('Unknown or ambiguous LTI registration or resource.');
      if ([...cookies(req).keys()].filter(k => k.startsWith('__Host-erudior_lti_')).length >= 8) throw new Failure(429, 'Too many pending launches. Finish or wait before trying again.');
      const r = matches[0], state = random(), binding = random(), nonce = random();
      await env.DB.prepare('DELETE FROM lti_state WHERE expires <= ?').bind(now).run();
      const registrationHash = await hash(JSON.stringify(r));
      const inserted = await env.DB.prepare('INSERT INTO lti_state (state_hash, binding_hash, nonce_hash, registration_hash, target, expires) SELECT ?, ?, ?, ?, ?, ? WHERE (SELECT COUNT(*) FROM lti_state) < 10000 AND (SELECT COUNT(*) FROM lti_state WHERE registration_hash = ?) < 500').bind(await hash(state), await hash(binding), await hash(nonce), registrationHash, target, now+TTL, registrationHash).run();
      if (inserted.meta.changes !== 1) throw new Failure(429, 'Too many pending launches. Try again later.');
      const auth = new URL(r.authorizationEndpoint);
      for (const [k,v] of Object.entries({scope:'openid',response_type:'id_token',client_id:r.clientId,redirect_uri:env.API_ORIGIN+'/lti/launch',login_hint:hint,state,response_mode:'form_post',nonce,prompt:'none'})) auth.searchParams.set(k,v);
      if (p.has('lti_message_hint')) auth.searchParams.set('lti_message_hint', p.get('lti_message_hint')!);
      return new Response(null,{status:302,headers:{...safeHeaders,Location:auth.href,'Set-Cookie':cookie(cookieName(state),binding,TTL)}});
    }
    if (req.method !== 'POST') throw new Failure(405, 'Use a form POST.');
    const state = p.get('state'), token = p.get('id_token');
    if (!state || !/^[A-Za-z0-9_-]{43}$/.test(state) || !text(token,LIMIT)) return fail();
    const binding = cookies(req).get(cookieName(state)); if (!binding || !/^[A-Za-z0-9_-]{43}$/.test(binding)) return fail('Browser binding is missing. Restart the launch with cookies enabled.');
    clearCookie = cookie(cookieName(state),'',0);
    // DELETE RETURNING is atomic: concurrent callbacks cannot both validate/redeem this state.
    const saved = await env.DB.prepare('DELETE FROM lti_state WHERE state_hash = ? AND binding_hash = ? AND expires > ? RETURNING *').bind(await hash(state),await hash(binding),now).first<State>();
    if (!saved) return fail();
    let registration: LtiRegistration | undefined;
    for (const r of rows) if (await hash(JSON.stringify(r)) === saved.registration_hash) registration = r;
    if (!registration || !registration.targets.includes(saved.target)) return fail();
    await verify(token,registration,saved,now);
    return new Response(null,{status:303,headers:{...safeHeaders,Location:saved.target,'Set-Cookie':clearCookie}});
  } catch (e) {
    // Do not log potentially identifying JWT/parser errors.
    return new Response(e instanceof Failure ? e.message : 'LTI launch could not be validated.', { status:e instanceof Failure ? e.status : 400, headers:{...safeHeaders,'Content-Type':'text/plain; charset=utf-8',...(clearCookie ? {'Set-Cookie':clearCookie} : {})} });
  }
}

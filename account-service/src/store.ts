import { randomBytes, timingSafeEqual } from 'node:crypto';
import type { Pool, PoolClient } from 'pg';
import { authorizeAccountOperation } from './authorization.js';
import { ACCOUNT_POLICY, isAccountId, validateAccountSnapshot, type AccountSnapshot, type DeviceSession, type ExternalIdentity, type SessionContext, type Workspace } from './model.js';
import type { OidcTransaction, VerifiedOidcIdentity } from './oidc.js';

export interface StoreProviderPolicy {
  id: string; version: number; configurationHash: string; issuer: string;
  trust: 'personal' | 'school'; schoolId: string | null;
}
export interface StoreOptions {
  providers: () => readonly StoreProviderPolicy[];
  sessionSeconds?: number;
  idleSeconds?: number;
}
export interface StoredLogin { transaction: OidcTransaction; workspaceId: string | null; replacesTokenHash?: string; replacesCsrfHash?: string }
export interface StoredSession {
  session: DeviceSession;
  /** Internal comparison only. Never serialize this value in an HTTP response. */
  csrfHash: string;
  availableContexts: { workspaceId: string; kind: Workspace['kind'] }[];
}
export interface PrivateRecord {
  id: string; version: number; category: AccountSnapshot['records'][number]['category'];
  visibility: 'private' | 'released'; payload: unknown;
}
interface SessionRow {
  token_hash: string; csrf_hash: string; provider_id: string; provider_version: number;
  configuration_hash: string; body: DeviceSession; last_used_at: string; idle_seconds: number;
}
const HASH = /^[a-f0-9]{64}$/;
const PREFIX = 'erudior_account.';
const maxGraphBytes = 4 * 1024 * 1024;
const scalar = (value: unknown): value is string => typeof value === 'string' && HASH.test(value);
const equalHash = (left: string, right: string) => scalar(left) && scalar(right) && timingSafeEqual(Buffer.from(left, 'hex'), Buffer.from(right, 'hex'));
const current = (value: { status: string; startsAt: number; expiresAt: number }, now: number) => value.status === 'active' && value.startsAt <= now && value.expiresAt > now;
const maxSafe = (value: unknown): value is number => typeof value === 'number' && Number.isSafeInteger(value) && value > 0;
class TransactionAuthorizationExpired extends Error {}

/** Server-only PostgreSQL adapter. Call ready() before listening; every operation
 * also checks the acquired connection. No client-supplied graph is accepted here.
 * RLS constrains exact payload selection after the shared TS authorizer permits
 * it. It is defense against a wrong query/scope leak, not a replacement for that
 * authorizer or a boundary against a compromised service/database owner.
 */
export class PostgresAccountStore {
  readonly #pool: Pool;
  readonly #options: StoreOptions;
  readonly #sessionSeconds: number;
  readonly #idleSeconds: number;
  constructor(pool: Pool, options: StoreOptions) {
    this.#pool = pool; this.#options = options;
    this.#sessionSeconds = options.sessionSeconds ?? 28_800;
    this.#idleSeconds = options.idleSeconds ?? 1800;
    if (!maxSafe(this.#sessionSeconds) || this.#sessionSeconds > ACCOUNT_POLICY.authenticationMaxAgeSeconds || !maxSafe(this.#idleSeconds) || this.#idleSeconds > this.#sessionSeconds || typeof options.providers !== 'function') throw new Error('Invalid private account store configuration');
  }

  async ready(): Promise<void> {
    const client = await this.#pool.connect();
    try { await this.#checkRole(client); } finally { client.release(); }
  }

  async #checkRole(client: PoolClient): Promise<void> {
    const result = await client.query<{ safe: boolean }>(`SELECT current_user = session_user
      AND NOT r.rolsuper AND NOT r.rolbypassrls AND NOT r.rolcreaterole AND NOT r.rolcreatedb AND NOT r.rolreplication
      AND NOT pg_has_role(current_user, 'erudior_account_owner', 'MEMBER')
      AND NOT has_schema_privilege(current_user, 'erudior_private', 'CREATE')
      AND NOT has_table_privilege(current_user, 'erudior_private.record_payloads', 'INSERT,UPDATE,DELETE,TRUNCATE,TRIGGER')
      AND NOT has_table_privilege(current_user, 'erudior_private.authority_graph', 'INSERT,UPDATE,DELETE,TRUNCATE,TRIGGER')
      AND has_table_privilege(current_user, 'erudior_private.record_payloads', 'SELECT') AS safe
      FROM pg_roles r WHERE r.rolname = current_user`);
    if (result.rows[0]?.safe !== true) throw new Error('Unsafe private account database role');
  }

  async #transaction<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await this.#pool.connect();
    let destroy = false;
    try {
      await this.#checkRole(client);
      await client.query('BEGIN ISOLATION LEVEL READ COMMITTED');
      await client.query("SET LOCAL statement_timeout = '5s'; SET LOCAL lock_timeout = '5s'; SET LOCAL idle_in_transaction_session_timeout = '5s'");
      await this.#scope(client, { token_hash: '', next_token_hash: '', flow_hash: '', binding_hash: '', record_id: '', record_version: '', workspace_id: '', learner_id: '', graph_revision: '', session_id: '', session_version: '' });
      const value = await fn(client);
      await client.query('COMMIT');
      return value;
    } catch (error) {
      try { await client.query('ROLLBACK'); } catch { destroy = true; }
      throw error;
    } finally { client.release(destroy); }
  }

  async #scope(client: PoolClient, values: Record<string, string>): Promise<void> {
    await client.query('SELECT set_config(setting, value, true) FROM unnest($1::text[], $2::text[]) AS input(setting, value)', [Object.keys(values).map(key => PREFIX + key), Object.values(values)]);
  }
  async #authorized<T>(fn: (client: PoolClient) => Promise<T | null>): Promise<T | null> {
    try { return await this.#transaction(fn); }
    catch (error) { if (error instanceof TransactionAuthorizationExpired) return null; throw error; }
  }
  async #now(client: PoolClient): Promise<number> {
    return Number((await client.query<{ now: string }>('SELECT erudior_private.now_seconds() AS now')).rows[0]!.now);
  }
  async #graph(client: PoolClient, now: number): Promise<AccountSnapshot> {
    const row = (await client.query<{ revision: string; graph: AccountSnapshot }>('SELECT * FROM erudior_private.lock_graph()')).rows[0];
    if (!row || JSON.stringify(row.graph).length > maxGraphBytes || row.graph.sessions.length) throw new Error('Invalid private authority graph');
    const graph = { ...row.graph, revision: Number(row.revision), capturedAt: now, sessions: [] };
    const parsed = validateAccountSnapshot(graph);
    if (!parsed.ok) throw new Error('Invalid private authority graph');
    return parsed.value;
  }
  #provider(id: string, version: number, configurationHash: string): StoreProviderPolicy | null {
    const providers = this.#options.providers();
    const found = providers.filter(p => p.id === id);
    if (found.length !== 1) return null;
    const p = found[0]!;
    if (p.version !== version || p.configurationHash !== configurationHash || !scalar(p.configurationHash) || !maxSafe(p.version) || (p.trust === 'personal') !== (p.schoolId === null)) return null;
    return p;
  }

  #contexts(graph: AccountSnapshot, identity: ExternalIdentity, auth: DeviceSession['authentication'], now: number): SessionContext[] {
    if (auth.kind === 'restricted-learner') return [];
    const account = graph.accounts.find(a => a.id === identity.accountId && a.status === 'active');
    if (!account) return [];
    const learner = graph.learners.find(l => l.accountId === account.id);
    if (identity.trust === 'personal' && (account.ageClass === 'unresolved' || learner && (learner.status !== 'active' || ['under-13', 'unresolved'].includes(learner.ageBand)) || account.ageClass === 'minor' && (!learner || learner.ageBand !== '13-17'))) return [];
    const receipt = (id: string, purpose: string, workspaceId: string, actor: string | null, learnerId: string | null) => {
      const a = graph.authorities.find(x => x.id === id);
      return !!a && current(a, now) && a.purposes.includes(purpose as never) && a.workspaceId === workspaceId && a.accountId === actor && a.learnerId === learnerId && (learnerId === null || a.learnerVersion === graph.learners.find(l => l.id === learnerId && l.status === 'active')?.version);
    };
    return graph.workspaces.filter(w => {
      if (!w.verified || w.status !== 'active') return false;
      if (identity.trust === 'school' && (w.kind !== 'school' || w.id !== identity.schoolId)) return false;
      if (w.kind === 'personal') return identity.trust === 'personal' && w.ownerAccountId === account.id;
      if (w.kind === 'family') return identity.trust === 'personal' && account.ageClass === 'adult' && auth.assurance === 'mfa' && graph.familyMemberships.some(m => m.familyId === w.id && m.accountId === account.id && current(m, now) && receipt(m.authorityId, 'family-administration', w.id, account.id, null));
      const policy = w.schoolPolicy!;
      if (!policy.allowedSources.includes(identity.trust) || policy.minimumAssurance === 'mfa' && auth.assurance !== 'mfa' || auth.authenticatedAt + policy.maxAuthenticationAgeSeconds <= now) return false;
      const staff = account.ageClass === 'adult' && auth.assurance === 'mfa' && graph.schoolMemberships.some(m => m.schoolId === w.id && m.accountId === account.id && current(m, now) && receipt(m.authorityId, 'school-administration', w.id, account.id, null));
      const enrolled = !!learner && learner.status === 'active' && graph.enrollments.some(e => e.schoolId === w.id && e.learnerId === learner.id && current(e, now) && graph.classes.some(c => c.id === e.classId && c.schoolId === w.id && c.status === 'active') && receipt(e.authorityId, 'school-learning', w.id, null, learner.id));
      return staff || enrolled;
    }).map(w => ({ workspaceId: w.id, workspaceVersion: w.version, schoolPolicyVersion: w.schoolPolicy?.version ?? null }));
  }

  #validateSession(graph: AccountSnapshot, row: SessionRow, now: number, requireCurrentContext = true): StoredSession | null {
    const session = row.body;
    const parsed = validateAccountSnapshot({ ...graph, capturedAt: now, sessions: [session] });
    if (!parsed.ok || session.status !== 'active' || session.issuedAt > now || session.expiresAt <= now || Number(row.last_used_at) + row.idle_seconds <= now || session.authentication.kind === 'restricted-learner' || session.principal.kind !== 'account') return null;
    const auth = session.authentication;
    if (auth.authenticatedAt > now || auth.authenticatedAt + ACCOUNT_POLICY.authenticationMaxAgeSeconds <= now) return null;
    const provider = this.#provider(row.provider_id, row.provider_version, row.configuration_hash);
    const identity = graph.identities.find(i => i.id === auth.identityId && i.version === auth.identityVersion && i.status === 'active');
    const account = graph.accounts.find(a => a.id === session.principal.id && a.version === session.principal.version && a.status === 'active');
    if (!provider || !identity || !account || identity.accountId !== account.id || identity.issuer !== provider.issuer || identity.trust !== provider.trust || identity.schoolId !== provider.schoolId || auth.kind !== provider.trust || auth.kind === 'school' && auth.schoolId !== provider.schoolId) return null;
    const contexts = this.#contexts(graph, identity, auth, now);
    if (!contexts.length) return null;
    if (requireCurrentContext) {
      const active = contexts.find(c => c.workspaceId === session.activeWorkspaceId);
      const stored = session.contexts.find(c => c.workspaceId === session.activeWorkspaceId);
      if (!active || !stored || active.workspaceVersion !== stored.workspaceVersion || active.schoolPolicyVersion !== stored.schoolPolicyVersion) return null;
    }
    return { session, csrfHash: row.csrf_hash, availableContexts: contexts.map(c => ({ workspaceId: c.workspaceId, kind: graph.workspaces.find(w => w.id === c.workspaceId)!.kind })) };
  }
  async #session(client: PoolClient, tokenHash: string): Promise<SessionRow | null> {
    await this.#scope(client, { token_hash: tokenHash });
    return (await client.query<SessionRow>('SELECT token_hash, csrf_hash, provider_id, provider_version, configuration_hash, body, last_used_at, idle_seconds FROM erudior_private.device_sessions WHERE token_hash = $1 FOR UPDATE', [tokenHash])).rows[0] ?? null;
  }
  async #touch(client: PoolClient, row: SessionRow, now: number): Promise<void> {
    await client.query('UPDATE erudior_private.device_sessions SET last_used_at = $1 WHERE token_hash = $2', [now, row.token_hash]);
  }

  async beginLogin(input: { stateHash: string; bindingHash: string; transaction: OidcTransaction; workspaceId: string | null; replacesTokenHash?: string; replacesCsrfHash?: string }): Promise<void> {
    if (!scalar(input.stateHash) || !scalar(input.bindingHash) || input.workspaceId !== null && !isAccountId(input.workspaceId) || JSON.stringify(input.transaction).length > 16_384) throw new Error('Invalid private login flow');
    if ((input.replacesTokenHash === undefined) !== (input.replacesCsrfHash === undefined) || input.replacesTokenHash !== undefined && (!scalar(input.replacesTokenHash) || !scalar(input.replacesCsrfHash))) throw new Error('Invalid private login replacement');
    const tx = input.transaction;
    if (!this.#provider(tx.providerId, tx.providerVersion, tx.configurationHash)) throw new Error('Unavailable private identity provider');
    await this.#transaction(async client => {
      const now = await this.#now(client);
      if (!Number.isSafeInteger(tx.createdAt) || !Number.isSafeInteger(tx.expiresAt) || tx.createdAt > now + 5 || tx.createdAt < now - 10 || tx.expiresAt <= now || tx.expiresAt > now + 600) throw new Error('Invalid private login flow');
      await this.#scope(client, { flow_hash: input.stateHash, binding_hash: input.bindingHash });
      await client.query('SELECT pg_advisory_xact_lock(192733, 1)');
      await client.query('SELECT * FROM erudior_private.purge_expired_credentials()');
      const count = Number((await client.query<{ count: string }>('SELECT erudior_private.live_flow_count() AS count')).rows[0]!.count);
      if (count >= 4096) throw new Error('Private login capacity reached');
      await client.query('INSERT INTO erudior_private.oidc_flows(state_hash, binding_hash, transaction, workspace_id, expires_at, replaces_token_hash, replaces_csrf_hash) VALUES($1,$2,$3,$4,$5,$6,$7)', [input.stateHash, input.bindingHash, tx, input.workspaceId, tx.expiresAt, input.replacesTokenHash ?? null, input.replacesCsrfHash ?? null]);
    });
  }
  async consumeLogin(input: { stateHash: string; bindingHash: string }): Promise<StoredLogin | null> {
    if (!scalar(input.stateHash) || !scalar(input.bindingHash)) return null;
    return this.#transaction(async client => {
      await this.#scope(client, { flow_hash: input.stateHash, binding_hash: input.bindingHash });
      const row = (await client.query<{ transaction: OidcTransaction; workspace_id: string | null; replaces_token_hash: string | null; replaces_csrf_hash: string | null }>('DELETE FROM erudior_private.oidc_flows WHERE state_hash=$1 AND binding_hash=$2 AND expires_at > erudior_private.now_seconds() RETURNING transaction, workspace_id, replaces_token_hash, replaces_csrf_hash', [input.stateHash, input.bindingHash])).rows[0];
      return row ? { transaction: row.transaction, workspaceId: row.workspace_id, ...(row.replaces_token_hash && row.replaces_csrf_hash ? { replacesTokenHash: row.replaces_token_hash, replacesCsrfHash: row.replaces_csrf_hash } : {}) } : null;
    });
  }

  async establishSession(input: { identity: VerifiedOidcIdentity; configurationHash: string; workspaceId: string | null; tokenHash: string; csrfHash: string; replacesTokenHash?: string; replacesCsrfHash?: string }): Promise<StoredSession | null> {
    if (!scalar(input.tokenHash) || !scalar(input.csrfHash) || input.workspaceId !== null && !isAccountId(input.workspaceId)) return null;
    if ((input.replacesTokenHash === undefined) !== (input.replacesCsrfHash === undefined) || input.replacesTokenHash !== undefined && (!scalar(input.replacesTokenHash) || !scalar(input.replacesCsrfHash) || input.replacesTokenHash === input.tokenHash)) return null;
    return this.#authorized(async client => {
      let now = await this.#now(client);
      const graph = await this.#graph(client, now);
      now = await this.#now(client); graph.capturedAt = now;
      const proof = input.identity, provider = this.#provider(proof.providerId, proof.providerVersion, input.configurationHash);
      if (!provider || proof.configurationHash !== input.configurationHash || proof.issuer !== provider.issuer || !Number.isSafeInteger(proof.authenticatedAt) || proof.authenticatedAt > now || proof.authenticatedAt + ACCOUNT_POLICY.authenticationMaxAgeSeconds <= now || !['single-factor', 'mfa'].includes(proof.assurance)) return null;
      const identity = graph.identities.find(i => i.issuer === proof.issuer && i.subject === proof.subject && i.status === 'active' && i.trust === provider.trust && i.schoolId === provider.schoolId);
      const account = identity && graph.accounts.find(a => a.id === identity.accountId && a.status === 'active');
      if (!identity || !account) return null;
      const authentication: DeviceSession['authentication'] = provider.trust === 'school' ? { kind: 'school', schoolId: provider.schoolId!, identityId: identity.id, identityVersion: identity.version, authenticatedAt: proof.authenticatedAt, assurance: proof.assurance } : { kind: 'personal', identityId: identity.id, identityVersion: identity.version, authenticatedAt: proof.authenticatedAt, assurance: proof.assurance };
      let contexts = this.#contexts(graph, identity, authentication, now);
      let active = input.workspaceId ? contexts.find(c => c.workspaceId === input.workspaceId) : contexts.find(c => graph.workspaces.find(w => w.id === c.workspaceId)?.kind === 'personal') ?? contexts[0];
      if (!active) return null;
      await client.query('SELECT pg_advisory_xact_lock(192733, 2)');
      const previous = input.replacesTokenHash ? await this.#session(client, input.replacesTokenHash) : null;
      const replace = previous && equalHash(previous.csrf_hash, input.replacesCsrfHash!) ? previous : null;
      const replacedActive = replace?.body.principal.id === account.id && replace.body.status === 'active' && replace.body.expiresAt > now && Number(replace.last_used_at) + replace.idle_seconds > now ? 1 : 0;
      const count = Number((await client.query<{ count: string }>('SELECT erudior_private.active_session_count($1) AS count', [account.id])).rows[0]!.count) - replacedActive;
      if (count >= 32) return null;
      now = await this.#now(client);
      if (!this.#provider(proof.providerId, proof.providerVersion, input.configurationHash) || proof.authenticatedAt + ACCOUNT_POLICY.authenticationMaxAgeSeconds <= now) return null;
      contexts = this.#contexts(graph, identity, authentication, now);
      active = input.workspaceId ? contexts.find(c => c.workspaceId === input.workspaceId) : contexts.find(c => graph.workspaces.find(w => w.id === c.workspaceId)?.kind === 'personal') ?? contexts[0];
      if (!active) return null;
      const session: DeviceSession = { id: 'session_' + randomBytes(24).toString('hex'), version: 1, status: 'active', principal: { kind: 'account', id: account.id, version: account.version }, authentication, activeWorkspaceId: active.workspaceId, contexts, issuedAt: now, expiresAt: Math.min(now + this.#sessionSeconds, proof.authenticatedAt + ACCOUNT_POLICY.authenticationMaxAgeSeconds) };
      if (!validateAccountSnapshot({ ...graph, capturedAt: now, sessions: [session] }).ok) return null;
      await this.#scope(client, { token_hash: input.tokenHash });
      await client.query('INSERT INTO erudior_private.device_sessions(session_id, token_hash, csrf_hash, provider_id, provider_version, configuration_hash, body, last_used_at, idle_seconds, expires_at) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)', [session.id, input.tokenHash, input.csrfHash, provider.id, provider.version, provider.configurationHash, session, now, this.#idleSeconds, session.expiresAt]);
      if (replace) {
        await this.#scope(client, { token_hash: replace.token_hash });
        await client.query('UPDATE erudior_private.device_sessions SET body=$1 WHERE token_hash=$2', [{ ...replace.body, version: replace.body.version + 1, status: 'revoked' }, replace.token_hash]);
      }
      const finalRow: SessionRow = { token_hash: input.tokenHash, csrf_hash: input.csrfHash, provider_id: provider.id, provider_version: provider.version, configuration_hash: provider.configurationHash, body: session, last_used_at: String(now), idle_seconds: this.#idleSeconds };
      if (!this.#validateSession(graph, finalRow, await this.#now(client))) throw new TransactionAuthorizationExpired();
      return { session, csrfHash: input.csrfHash, availableContexts: contexts.map(c => ({ workspaceId: c.workspaceId, kind: graph.workspaces.find(w => w.id === c.workspaceId)!.kind })) };
    });
  }

  async getSession(tokenHash: string): Promise<StoredSession | null> {
    if (!scalar(tokenHash)) return null;
    return this.#authorized(async client => {
      const graph = await this.#graph(client, await this.#now(client));
      const row = await this.#session(client, tokenHash), now = await this.#now(client);
      const currentSession = row && this.#validateSession(graph, row, now);
      if (!row || !currentSession) return null;
      await this.#touch(client, row, now);
      if (!this.#validateSession(graph, { ...row, last_used_at: String(now) }, await this.#now(client))) throw new TransactionAuthorizationExpired();
      return currentSession;
    });
  }
  async switchContext(input: { tokenHash: string; csrfHash: string; workspaceId: string; newTokenHash: string; newCsrfHash: string }): Promise<StoredSession | null> {
    if (![input.tokenHash, input.csrfHash, input.newTokenHash, input.newCsrfHash].every(scalar) || input.tokenHash === input.newTokenHash || input.csrfHash === input.newCsrfHash || !isAccountId(input.workspaceId)) return null;
    return this.#authorized(async client => {
      const graph = await this.#graph(client, await this.#now(client));
      const row = await this.#session(client, input.tokenHash), now = await this.#now(client);
      const existing = row && this.#validateSession(graph, row, now, false);
      if (!row || !existing || !equalHash(row.csrf_hash, input.csrfHash) || !existing.availableContexts.some(c => c.workspaceId === input.workspaceId)) return null;
      const auth = row.body.authentication;
      if (auth.kind === 'restricted-learner') return null;
      const identity = graph.identities.find(i => i.id === auth.identityId)!;
      const session = { ...row.body, version: row.body.version + 1, activeWorkspaceId: input.workspaceId, contexts: this.#contexts(graph, identity, auth, now) };
      await this.#scope(client, { next_token_hash: input.newTokenHash });
      await client.query('UPDATE erudior_private.device_sessions SET token_hash=$1, csrf_hash=$2, body=$3, last_used_at=$4 WHERE token_hash=$5', [input.newTokenHash, input.newCsrfHash, session, now, input.tokenHash]);
      if (!this.#validateSession(graph, { ...row, token_hash: input.newTokenHash, csrf_hash: input.newCsrfHash, body: session, last_used_at: String(now) }, await this.#now(client))) throw new TransactionAuthorizationExpired();
      return { ...existing, session, csrfHash: input.newCsrfHash };
    });
  }
  async revokeSession(input: { tokenHash: string; csrfHash: string }): Promise<boolean> {
    if (!scalar(input.tokenHash) || !scalar(input.csrfHash)) return false;
    return this.#transaction(async client => {
      // Same lock order as reads/switches. Revocation cannot be acknowledged while
      // an earlier protected read still owns the session lock.
      await this.#graph(client, await this.#now(client));
      const row = await this.#session(client, input.tokenHash);
      if (!row || !equalHash(row.csrf_hash, input.csrfHash)) return false;
      await client.query('UPDATE erudior_private.device_sessions SET body=$1 WHERE token_hash=$2', [{ ...row.body, version: row.body.version + 1, status: 'revoked' }, input.tokenHash]);
      return true;
    });
  }
  async readRecord(input: { tokenHash: string; workspaceId: string; recordId: string }): Promise<PrivateRecord | null> {
    if (!scalar(input.tokenHash) || !isAccountId(input.workspaceId) || !isAccountId(input.recordId)) return null;
    return this.#authorized(async client => {
      const graph = await this.#graph(client, await this.#now(client));
      const row = await this.#session(client, input.tokenHash);
      let now = await this.#now(client); graph.capturedAt = now;
      const state = row && this.#validateSession(graph, row, now);
      if (!row || !state || state.session.activeWorkspaceId !== input.workspaceId) return null;
      const metadata = graph.records.find(r => r.id === input.recordId);
      if (!metadata) return null;
      graph.sessions = [state.session];
      const request = { sessionId: state.session.id, sessionVersion: state.session.version, snapshotRevision: graph.revision, workspaceId: input.workspaceId, action: 'record.read' as const, target: { kind: 'record' as const, id: metadata.id, version: metadata.version } };
      const decision = authorizeAccountOperation(graph, request, now);
      if (!decision.allowed) return null;
      await this.#scope(client, { record_id: metadata.id, record_version: String(metadata.version), workspace_id: metadata.workspaceId, learner_id: metadata.learnerId, graph_revision: String(graph.revision), session_id: state.session.id, session_version: String(state.session.version) });
      const payload = (await client.query<{ payload: unknown }>('SELECT payload FROM erudior_private.record_payloads WHERE record_id=$1 AND record_version=$2', [metadata.id, metadata.version])).rows[0];
      if (!payload) return null;
      const touchedAt = await this.#now(client);
      await this.#touch(client, row, touchedAt);
      now = await this.#now(client);
      // All graph/session versions are still locked; time can nevertheless expire
      // while any query (including the idle touch) waits. Roll back the touch if
      // the final authorization fails; no protected result escapes that check.
      if (now >= decision.validUntil || !this.#validateSession(graph, row, now) || !authorizeAccountOperation(graph, request, now).allowed) throw new TransactionAuthorizationExpired();
      return { id: metadata.id, version: metadata.version, category: metadata.category, visibility: metadata.visibility, payload: payload.payload };
    });
  }
  /** Removes only expired login material and expired/revoked session credentials.
   * It never deletes learner identity, authority, or record payloads. */
  async purgeExpired(): Promise<{ flows: number; sessions: number }> {
    return this.#transaction(async client => {
      const row = (await client.query<{ flows: number; sessions: number }>('SELECT * FROM erudior_private.purge_expired_credentials()')).rows[0]!;
      return row;
    });
  }
}

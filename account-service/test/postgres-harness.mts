/** Test-only isolated PostgreSQL database. Never imported by the service. */
import { randomBytes } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { Pool } from 'pg';
import { validateAccountSnapshot, type AccountSnapshot } from '../src/model.ts';

const quote = (value: string) => '"' + value.replaceAll('"', '""') + '"';
const literal = (value: string) => "'" + value.replaceAll("'", "''") + "'";
const canonical = (value: unknown): string => {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return '[' + value.map(canonical).join(',') + ']';
  return '{' + Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => JSON.stringify(k) + ':' + canonical(v)).join(',') + '}';
};
const collections = ['accounts','learners','identities','workspaces','authorities','familyMemberships','guardians','schoolMemberships','classes','teachingAssignments','enrollments','familySchoolLinks','records'] as const;

function trackPoolClose(pool: Pool): () => Promise<void> {
  const closing = new Set<Promise<void>>();
  pool.on('connect', client => {
    const ended = new Promise<void>(resolve => client.once('end', resolve));
    closing.add(ended);
    void ended.then(() => closing.delete(ended));
  });
  return async () => {
    // pg-pool removes idle clients before their asynchronous connection end has
    // finished. Await their public end events before dropping the test database.
    // No error listener is installed: unexpected connection errors still fail.
    await pool.end();
    await Promise.all(closing);
  };
}

export interface PostgresTestHarness {
  admin: Pool; runtime: Pool; runtimeUrl: string; adminUrl: string; databaseName: string; runtimeRole: string;
  /** A valid synthetic snapshot with sessions=[] is required. Existing runtime
   * sessions are deliberately preserved by every graph replacement. */
  seed(graph: AccountSnapshot, payloads?: Record<string, unknown>): Promise<AccountSnapshot>;
  /** The input revision must equal the current graph revision. Changed existing
   * entities must advance their individual versions. Returns next revision. */
  replaceGraph(graph: AccountSnapshot, payloads?: Record<string, unknown>): Promise<AccountSnapshot>;
  close(): Promise<void>;
}

export async function createPostgresHarness(): Promise<PostgresTestHarness> {
  const configured = process.env.ERUDIOR_ACCOUNT_TEST_ADMIN_URL;
  if (!configured) throw new Error('ERUDIOR_ACCOUNT_TEST_ADMIN_URL is required; PostgreSQL integration tests never silently skip');
  const source = new URL(configured);
  if (!['postgres:', 'postgresql:'].includes(source.protocol) || !['127.0.0.1','localhost','[::1]'].includes(source.hostname)) throw new Error('Account tests require an isolated loopback PostgreSQL server');
  const bootstrap = new Pool({ connectionString: source.href, max: 2, connectionTimeoutMillis: 5000 });
  const closeBootstrap = trackPoolClose(bootstrap);
  const suffix = randomBytes(8).toString('hex');
  const databaseName = 'erudior_account_test_' + suffix;
  const runtimeRole = 'erudior_account_test_' + suffix;
  const password = randomBytes(32).toString('hex');
  let admin: Pool | undefined, runtime: Pool | undefined, createdDatabase = false, createdRole = false;
  let closeAdmin: (() => Promise<void>) | undefined, closeRuntime: (() => Promise<void>) | undefined;
  try {
    await bootstrap.query('CREATE DATABASE ' + quote(databaseName)); createdDatabase = true;
    const adminAddress = new URL(source); adminAddress.pathname = '/' + databaseName;
    admin = new Pool({ connectionString: adminAddress.href, max: 6, connectionTimeoutMillis: 5000 });
    closeAdmin = trackPoolClose(admin);
    const migration = await readFile(new URL('../sql/001_private_accounts.sql', import.meta.url), 'utf8');
    await admin.query(migration);
    await bootstrap.query('CREATE ROLE ' + quote(runtimeRole) + ' LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE INHERIT NOREPLICATION NOBYPASSRLS PASSWORD ' + literal(password)); createdRole = true;
    await bootstrap.query('GRANT erudior_account_runtime TO ' + quote(runtimeRole));
    const runtimeAddress = new URL(adminAddress); runtimeAddress.username = runtimeRole; runtimeAddress.password = password;
    runtime = new Pool({ connectionString: runtimeAddress.href, max: 6, connectionTimeoutMillis: 5000 });
    closeRuntime = trackPoolClose(runtime);
    const adminPool = admin;
    const replace = async (input: AccountSnapshot, payloads?: Record<string, unknown>): Promise<AccountSnapshot> => {
      if (input.sessions.length) throw new Error('Synthetic graph seeds must not contain preapproved sessions');
      const parsed = validateAccountSnapshot(input);
      if (!parsed.ok) throw new Error('Invalid synthetic authority graph: ' + parsed.error);
      const client = await adminPool.connect();
      try {
        await client.query('BEGIN');
        const old = (await client.query<{ revision: string; graph: AccountSnapshot }>('SELECT revision, graph FROM erudior_private.authority_graph WHERE singleton FOR UPDATE')).rows[0];
        if (old && Number(old.revision) !== input.revision) throw new Error('Stale test graph replacement');
        if (old) {
          const previous = new Map(collections.flatMap(k => old.graph[k].map(v => [v.id, v] as const)));
          for (const entity of collections.flatMap(k => input[k] as { id: string; version: number }[])) {
            const before = previous.get(entity.id);
            if (before && (entity.version < before.version || canonical(entity) !== canonical(before) && entity.version <= before.version)) throw new Error('Changed authority entity must advance version: ' + entity.id);
          }
        }
        const graph: AccountSnapshot = { ...structuredClone(input), revision: old ? Number(old.revision) + 1 : input.revision, sessions: [] };
        await client.query('INSERT INTO erudior_private.authority_graph(singleton,revision,graph) VALUES(true,$1,$2) ON CONFLICT(singleton) DO UPDATE SET revision=excluded.revision,graph=excluded.graph', [graph.revision, JSON.stringify(graph)]);
        if (payloads) {
          for (const [id, payload] of Object.entries(payloads)) {
            const metadata = graph.records.find(r => r.id === id);
            if (!metadata) throw new Error('Payload is outside the synthetic graph');
            await client.query('INSERT INTO erudior_private.record_payloads(record_id,record_version,workspace_id,learner_id,payload) VALUES($1,$2,$3,$4,$5::jsonb) ON CONFLICT(record_id) DO UPDATE SET record_version=excluded.record_version,workspace_id=excluded.workspace_id,learner_id=excluded.learner_id,payload=excluded.payload', [id, metadata.version, metadata.workspaceId, metadata.learnerId, JSON.stringify(payload)]);
          }
        }
        await client.query('COMMIT'); return graph;
      } catch (error) { await client.query('ROLLBACK'); throw error; } finally { client.release(); }
    };
    return {
      admin, runtime, runtimeUrl: runtimeAddress.href, adminUrl: adminAddress.href, databaseName, runtimeRole,
      seed: replace, replaceGraph: replace,
      async close() {
        await closeRuntime!(); await closeAdmin!();
        try { await bootstrap.query('DROP DATABASE ' + quote(databaseName)); }
        finally { try { await bootstrap.query('DROP ROLE ' + quote(runtimeRole)); } finally { await closeBootstrap(); } }
      },
    };
  } catch (error) {
    await closeRuntime?.(); await closeAdmin?.();
    try { if (createdDatabase) await bootstrap.query('DROP DATABASE ' + quote(databaseName)); if (createdRole) await bootstrap.query('DROP ROLE ' + quote(runtimeRole)); }
    finally { await closeBootstrap(); }
    throw error;
  }
}

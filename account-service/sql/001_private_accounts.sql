-- Explicit administrator migration for an isolated private service/database.
-- Never run from an HTTP request, the public website, or community Worker.
BEGIN;
DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'erudior_account_owner') THEN
    CREATE ROLE erudior_account_owner NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOREPLICATION NOBYPASSRLS;
  END IF;
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'erudior_account_runtime') THEN
    CREATE ROLE erudior_account_runtime NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOREPLICATION NOBYPASSRLS;
  END IF;
  IF EXISTS (SELECT FROM pg_roles WHERE rolname IN ('erudior_account_owner','erudior_account_runtime') AND (rolsuper OR rolcreaterole OR rolcreatedb OR rolreplication OR rolbypassrls)) THEN
    RAISE EXCEPTION 'Unsafe private account role configuration';
  END IF;
END $$;
CREATE SCHEMA erudior_private AUTHORIZATION erudior_account_owner;
REVOKE ALL ON SCHEMA erudior_private FROM PUBLIC;
GRANT USAGE ON SCHEMA erudior_private TO erudior_account_runtime;
SET LOCAL ROLE erudior_account_owner;
ALTER DEFAULT PRIVILEGES IN SCHEMA erudior_private REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;

CREATE FUNCTION erudior_private.now_seconds() RETURNS bigint
LANGUAGE sql VOLATILE SET search_path = pg_catalog, pg_temp
AS $$ SELECT floor(extract(epoch FROM clock_timestamp()))::bigint $$;

CREATE TABLE erudior_private.authority_graph (
  singleton boolean PRIMARY KEY DEFAULT true CHECK (singleton),
  revision bigint NOT NULL CHECK (revision BETWEEN 1 AND 9007199254740991),
  graph jsonb NOT NULL CHECK (jsonb_typeof(graph) = 'object' AND graph->>'format' = 'erudior-private-account-snapshot'
    AND graph->'sessions' = '[]'::jsonb AND octet_length(graph::text) <= 4194304)
);
-- The authority graph is a bounded, server-provisioned integration store. Its
-- replacing/provisioning identity is intentionally absent from the runtime role.
CREATE FUNCTION erudior_private.lock_graph() RETURNS TABLE(revision bigint, graph jsonb)
LANGUAGE sql SECURITY DEFINER SET search_path = pg_catalog, pg_temp
AS $$ SELECT g.revision, g.graph FROM erudior_private.authority_graph g WHERE g.singleton FOR SHARE $$;
CREATE FUNCTION erudior_private.graph_revision() RETURNS bigint
LANGUAGE sql SECURITY DEFINER SET search_path = pg_catalog, pg_temp
AS $$ SELECT g.revision FROM erudior_private.authority_graph g WHERE g.singleton $$;

CREATE TABLE erudior_private.oidc_flows (
  state_hash text PRIMARY KEY CHECK (state_hash ~ '^[a-f0-9]{64}$'),
  binding_hash text NOT NULL CHECK (binding_hash ~ '^[a-f0-9]{64}$'),
  transaction jsonb NOT NULL CHECK (jsonb_typeof(transaction) = 'object' AND octet_length(transaction::text) <= 16384),
  workspace_id text,
  replaces_token_hash text CHECK (replaces_token_hash ~ '^[a-f0-9]{64}$'),
  replaces_csrf_hash text CHECK (replaces_csrf_hash ~ '^[a-f0-9]{64}$'),
  CHECK ((replaces_token_hash IS NULL) = (replaces_csrf_hash IS NULL)),
  expires_at bigint NOT NULL
);
CREATE INDEX oidc_flows_expiry ON erudior_private.oidc_flows(expires_at);
ALTER TABLE erudior_private.oidc_flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE erudior_private.oidc_flows FORCE ROW LEVEL SECURITY;
CREATE POLICY flow_read ON erudior_private.oidc_flows FOR SELECT TO erudior_account_runtime
USING (state_hash = current_setting('erudior_account.flow_hash', true) AND binding_hash = current_setting('erudior_account.binding_hash', true));
CREATE POLICY flow_insert ON erudior_private.oidc_flows FOR INSERT TO erudior_account_runtime
WITH CHECK (state_hash = current_setting('erudior_account.flow_hash', true) AND binding_hash = current_setting('erudior_account.binding_hash', true)
  AND expires_at > erudior_private.now_seconds() AND expires_at <= erudior_private.now_seconds() + 600);
CREATE POLICY flow_consume ON erudior_private.oidc_flows FOR DELETE TO erudior_account_runtime
USING ((state_hash = current_setting('erudior_account.flow_hash', true) AND binding_hash = current_setting('erudior_account.binding_hash', true)) OR expires_at <= erudior_private.now_seconds());
CREATE POLICY flow_owner_count ON erudior_private.oidc_flows FOR SELECT TO erudior_account_owner USING (true);
CREATE FUNCTION erudior_private.live_flow_count() RETURNS bigint
LANGUAGE sql SECURITY DEFINER SET search_path = pg_catalog, pg_temp
AS $$ SELECT count(*) FROM erudior_private.oidc_flows WHERE expires_at > erudior_private.now_seconds() $$;

CREATE TABLE erudior_private.device_sessions (
  session_id text PRIMARY KEY,
  token_hash text NOT NULL UNIQUE CHECK (token_hash ~ '^[a-f0-9]{64}$'),
  csrf_hash text NOT NULL CHECK (csrf_hash ~ '^[a-f0-9]{64}$'),
  provider_id text NOT NULL CHECK (length(provider_id) BETWEEN 1 AND 128),
  provider_version integer NOT NULL CHECK (provider_version > 0),
  configuration_hash text NOT NULL CHECK (configuration_hash ~ '^[a-f0-9]{64}$'),
  body jsonb NOT NULL CHECK (jsonb_typeof(body) = 'object' AND body->>'id' = session_id AND octet_length(body::text) <= 65536),
  last_used_at bigint NOT NULL,
  idle_seconds integer NOT NULL CHECK (idle_seconds BETWEEN 1 AND 43200),
  expires_at bigint NOT NULL CHECK (expires_at = (body->>'expiresAt')::bigint)
);
CREATE INDEX device_session_expiry ON erudior_private.device_sessions(expires_at);
ALTER TABLE erudior_private.device_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE erudior_private.device_sessions FORCE ROW LEVEL SECURITY;
CREATE POLICY session_read ON erudior_private.device_sessions FOR SELECT TO erudior_account_runtime
USING (token_hash = current_setting('erudior_account.token_hash', true) OR token_hash = current_setting('erudior_account.next_token_hash', true));
CREATE POLICY session_insert ON erudior_private.device_sessions FOR INSERT TO erudior_account_runtime
WITH CHECK (token_hash = current_setting('erudior_account.token_hash', true) AND body->>'status' = 'active'
  AND (body->>'issuedAt')::bigint <= erudior_private.now_seconds() AND expires_at > erudior_private.now_seconds()
  AND expires_at <= erudior_private.now_seconds() + 43200);
CREATE POLICY session_update ON erudior_private.device_sessions FOR UPDATE TO erudior_account_runtime
USING (token_hash = current_setting('erudior_account.token_hash', true))
WITH CHECK (token_hash = current_setting('erudior_account.token_hash', true) OR token_hash = current_setting('erudior_account.next_token_hash', true));
CREATE POLICY session_delete ON erudior_private.device_sessions FOR DELETE TO erudior_account_runtime
USING (expires_at <= erudior_private.now_seconds() OR last_used_at + idle_seconds <= erudior_private.now_seconds() OR body->>'status' = 'revoked');
CREATE POLICY session_owner_count ON erudior_private.device_sessions FOR SELECT TO erudior_account_owner USING (true);
CREATE POLICY flow_owner_expiry ON erudior_private.oidc_flows FOR DELETE TO erudior_account_owner
USING (expires_at <= erudior_private.now_seconds());
CREATE POLICY session_owner_expiry ON erudior_private.device_sessions FOR DELETE TO erudior_account_owner
USING (expires_at <= erudior_private.now_seconds() OR last_used_at + idle_seconds <= erudior_private.now_seconds() OR body->>'status' = 'revoked');
CREATE FUNCTION erudior_private.active_session_count(account_id text) RETURNS bigint
LANGUAGE sql SECURITY DEFINER SET search_path = pg_catalog, pg_temp
AS $$ SELECT count(*) FROM erudior_private.device_sessions WHERE body->'principal'->>'id' = account_id
  AND body->>'status' = 'active' AND expires_at > erudior_private.now_seconds()
  AND last_used_at + idle_seconds > erudior_private.now_seconds() $$;
CREATE FUNCTION erudior_private.purge_expired_credentials() RETURNS TABLE(flows integer, sessions integer)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, pg_temp
AS $$ BEGIN
  DELETE FROM erudior_private.oidc_flows WHERE expires_at <= erudior_private.now_seconds();
  GET DIAGNOSTICS flows = ROW_COUNT;
  DELETE FROM erudior_private.device_sessions WHERE expires_at <= erudior_private.now_seconds()
    OR last_used_at + idle_seconds <= erudior_private.now_seconds() OR body->>'status' = 'revoked';
  GET DIAGNOSTICS sessions = ROW_COUNT;
  RETURN NEXT;
END $$;

CREATE TABLE erudior_private.record_payloads (
  record_id text PRIMARY KEY,
  record_version bigint NOT NULL CHECK (record_version BETWEEN 1 AND 9007199254740991),
  workspace_id text NOT NULL,
  learner_id text NOT NULL,
  payload jsonb NOT NULL CHECK (octet_length(payload::text) <= 262144)
);
ALTER TABLE erudior_private.record_payloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE erudior_private.record_payloads FORCE ROW LEVEL SECURITY;
-- Transaction-local claims come exclusively from the trusted service after the
-- existing authorizer permits this exact record. There is no client SQL access.
CREATE POLICY exact_authorized_read ON erudior_private.record_payloads FOR SELECT TO erudior_account_runtime
USING (record_id = current_setting('erudior_account.record_id', true)
  AND record_version::text = current_setting('erudior_account.record_version', true)
  AND workspace_id = current_setting('erudior_account.workspace_id', true)
  AND learner_id = current_setting('erudior_account.learner_id', true)
  AND erudior_private.graph_revision()::text = current_setting('erudior_account.graph_revision', true)
  AND EXISTS (SELECT FROM erudior_private.device_sessions s
    WHERE s.session_id = current_setting('erudior_account.session_id', true)
      AND s.body->>'version' = current_setting('erudior_account.session_version', true)
      AND s.body->>'status' = 'active' AND s.expires_at > erudior_private.now_seconds()
      AND s.last_used_at + s.idle_seconds > erudior_private.now_seconds()));

REVOKE ALL ON ALL TABLES IN SCHEMA erudior_private FROM PUBLIC;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA erudior_private FROM PUBLIC;
GRANT SELECT ON erudior_private.record_payloads TO erudior_account_runtime;
GRANT SELECT, INSERT, UPDATE, DELETE ON erudior_private.device_sessions TO erudior_account_runtime;
GRANT SELECT, INSERT, DELETE ON erudior_private.oidc_flows TO erudior_account_runtime;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA erudior_private TO erudior_account_runtime;
COMMIT;

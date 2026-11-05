-- Opt-in bounded private artifacts only. No authority or source-record writes.
BEGIN;
SET LOCAL ROLE erudior_account_owner;
CREATE TABLE erudior_private.record_exports (
  export_id text PRIMARY KEY,
  session_id text NOT NULL,
  session_version bigint NOT NULL CHECK (session_version > 0),
  delete_after bigint NOT NULL,
  owner_account_id text NOT NULL,
  workspace_id text NOT NULL,
  request_id text NOT NULL,
  scope jsonb NOT NULL CHECK (jsonb_typeof(scope) = 'array' AND jsonb_array_length(scope) BETWEEN 1 AND 32),
  state text NOT NULL CHECK (state IN ('ready','cancelled','expired')),
  created_at bigint NOT NULL,
  expires_at bigint NOT NULL CHECK (expires_at > created_at AND expires_at <= created_at + 86400),
  artifact jsonb CHECK (octet_length(artifact::text) <= 2097152),
  CHECK ((state = 'ready') = (artifact IS NOT NULL)),
  UNIQUE(session_id, request_id)
);
CREATE INDEX record_export_expiry ON erudior_private.record_exports(expires_at);
ALTER TABLE erudior_private.record_exports ENABLE ROW LEVEL SECURITY;
ALTER TABLE erudior_private.record_exports FORCE ROW LEVEL SECURITY;
CREATE POLICY export_scope ON erudior_private.record_exports FOR ALL TO erudior_account_runtime
USING (session_id = current_setting('erudior_account.session_id', true)
  AND session_version::text = current_setting('erudior_account.session_version', true)
  AND owner_account_id = current_setting('erudior_account.owner_account_id', true)
  AND workspace_id = current_setting('erudior_account.workspace_id', true)
  AND EXISTS (SELECT FROM erudior_private.device_sessions s WHERE s.session_id = record_exports.session_id
    AND s.body->'principal'->>'id' = record_exports.owner_account_id
    AND s.body->>'activeWorkspaceId' = record_exports.workspace_id
    AND s.body->>'version' = current_setting('erudior_account.session_version', true)
    AND s.body->>'status' = 'active' AND s.expires_at > erudior_private.now_seconds()
    AND s.last_used_at + s.idle_seconds > erudior_private.now_seconds()));
CREATE POLICY export_owner_count ON erudior_private.record_exports FOR SELECT TO erudior_account_owner USING (true);
CREATE POLICY export_owner_expiry ON erudior_private.record_exports FOR DELETE TO erudior_account_owner
USING (delete_after <= erudior_private.now_seconds());
CREATE POLICY export_owner_expire ON erudior_private.record_exports FOR UPDATE TO erudior_account_owner
USING (expires_at <= erudior_private.now_seconds())
WITH CHECK (state = 'expired' AND artifact IS NULL);
CREATE FUNCTION erudior_private.purge_expired_exports() RETURNS integer
LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, pg_temp
AS $$ DECLARE removed integer; BEGIN
 UPDATE erudior_private.record_exports SET state='expired',artifact=NULL WHERE expires_at <= erudior_private.now_seconds() AND state <> 'expired';
 DELETE FROM erudior_private.record_exports WHERE delete_after <= erudior_private.now_seconds();
 GET DIAGNOSTICS removed = ROW_COUNT; RETURN removed;
END $$;
CREATE FUNCTION erudior_private.export_count() RETURNS bigint
LANGUAGE sql SECURITY DEFINER SET search_path = pg_catalog, pg_temp
AS $$ SELECT count(*) FROM erudior_private.record_exports $$;
CREATE FUNCTION erudior_private.session_export_count(owner_session_id text) RETURNS bigint
LANGUAGE sql SECURITY DEFINER SET search_path = pg_catalog, pg_temp
AS $$ SELECT count(*) FROM erudior_private.record_exports WHERE session_id = owner_session_id $$;
REVOKE ALL ON erudior_private.record_exports FROM PUBLIC;
REVOKE ALL ON FUNCTION erudior_private.purge_expired_exports(), erudior_private.export_count(), erudior_private.session_export_count(text) FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE ON erudior_private.record_exports TO erudior_account_runtime;
GRANT EXECUTE ON FUNCTION erudior_private.purge_expired_exports(), erudior_private.export_count(), erudior_private.session_export_count(text) TO erudior_account_runtime;
COMMIT;

-- Separate transaction-local account management scope. Ordinary session and
-- export scopes cannot enumerate another token or alter another device.
BEGIN;
SET LOCAL ROLE erudior_account_owner;
CREATE POLICY managed_session_read ON erudior_private.device_sessions FOR SELECT TO erudior_account_runtime
USING (body->'principal'->>'kind' = 'account'
  AND body->'principal'->>'id' = current_setting('erudior_account.device_owner_id', true)
  AND erudior_private.graph_revision()::text = current_setting('erudior_account.graph_revision', true));
CREATE POLICY managed_session_revoke ON erudior_private.device_sessions FOR UPDATE TO erudior_account_runtime
USING (body->'principal'->>'kind' = 'account'
  AND body->'principal'->>'id' = current_setting('erudior_account.device_owner_id', true)
  AND erudior_private.graph_revision()::text = current_setting('erudior_account.graph_revision', true))
WITH CHECK (body->'principal'->>'kind' = 'account'
  AND body->'principal'->>'id' = current_setting('erudior_account.device_owner_id', true)
  AND body->>'status' = 'revoked'
  AND erudior_private.graph_revision()::text = current_setting('erudior_account.graph_revision', true));
COMMIT;

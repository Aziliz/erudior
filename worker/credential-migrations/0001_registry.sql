-- Optional, separate registry. Never part of community production migrations.
-- No learner names or original evidence. Enrollment/subject identifiers remain private.
CREATE TABLE credential_registry (
 credential_id TEXT PRIMARY KEY NOT NULL,
 enrollment_id TEXT NOT NULL UNIQUE,
 lookup_hash TEXT NOT NULL UNIQUE,
 revision INTEGER NOT NULL CHECK (revision IN (1,2)),
 issue_request TEXT NOT NULL UNIQUE,
 issue_hash TEXT NOT NULL,
 issue_command TEXT NOT NULL,
 issue_result TEXT NOT NULL,
 revoke_request TEXT UNIQUE,
 revoke_hash TEXT,
 revoke_command TEXT,
 revoke_result TEXT,
 events TEXT NOT NULL,
 CHECK ((revision=1 AND revoke_request IS NULL AND revoke_hash IS NULL AND revoke_command IS NULL AND revoke_result IS NULL)
 OR (revision=2 AND revoke_request IS NOT NULL AND revoke_hash IS NOT NULL AND revoke_command IS NOT NULL AND revoke_result IS NOT NULL))
);

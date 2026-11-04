-- Optional app progress only. Never a community or credential production migration.
CREATE TABLE learner_progress (
 subject_hash TEXT PRIMARY KEY NOT NULL,
 revision INTEGER NOT NULL CHECK(revision >= 1),
 state TEXT NOT NULL CHECK(state IN ('active','erased','expired')),
 envelope TEXT,
 envelope_hash TEXT,
 expires_at INTEGER,
 last_request TEXT,
 last_hash TEXT,
 CHECK ((state='active' AND envelope IS NOT NULL AND envelope_hash IS NOT NULL AND expires_at IS NOT NULL)
 OR (state IN ('erased','expired') AND envelope IS NULL AND envelope_hash IS NULL AND expires_at IS NULL))
);
CREATE TABLE learner_progress_receipts (
 subject_hash TEXT NOT NULL,
 request_hash TEXT NOT NULL,
 body_hash TEXT NOT NULL,
 receipt TEXT NOT NULL,
 PRIMARY KEY(subject_hash, request_hash)
);
CREATE INDEX learner_progress_expiry ON learner_progress(state, expires_at);

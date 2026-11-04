-- Private promotion preparation and retained human review. These tables confer no
-- official publisher authority and are never joined into public catalog routes.
CREATE TABLE promotion_candidates (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  source TEXT NOT NULL,
  source_guard TEXT NOT NULL,
  object_key TEXT NOT NULL UNIQUE,
  digest TEXT NOT NULL,
  revision INTEGER NOT NULL CHECK (revision > 0),
  state TEXT NOT NULL CHECK (state IN ('prepared', 'reviewed', 'rejected', 'revoked')),
  review TEXT,
  created_by TEXT NOT NULL REFERENCES users(id),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX promotion_candidates_page ON promotion_candidates(id);
CREATE TABLE promotion_reviews (
  id TEXT PRIMARY KEY,
  candidate_id TEXT NOT NULL REFERENCES promotion_candidates(id),
  candidate_revision INTEGER NOT NULL,
  record TEXT NOT NULL,
  created_at TEXT NOT NULL,
  UNIQUE(candidate_id, candidate_revision)
);
CREATE TABLE promotion_operations (
  actor_id TEXT NOT NULL REFERENCES users(id),
  request_id TEXT NOT NULL,
  fingerprint TEXT NOT NULL,
  candidate_id TEXT NOT NULL REFERENCES promotion_candidates(id),
  result_revision INTEGER NOT NULL,
  action TEXT NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY(actor_id, request_id)
);

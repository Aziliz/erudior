-- Erudior community courses. Authors are adults who signed in with Google or GitHub.
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  provider TEXT NOT NULL,            -- google | github | dev
  provider_id TEXT NOT NULL,
  email TEXT,
  display_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'author', -- author | reviewer | admin
  banned INTEGER NOT NULL DEFAULT 0,
  accepted_at TEXT,                  -- 18+ and terms accepted
  created_at TEXT NOT NULL,
  UNIQUE (provider, provider_id)
);

CREATE TABLE sessions (
  token_hash TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TEXT NOT NULL
);
CREATE INDEX sessions_user ON sessions(user_id);

CREATE TABLE courses (
  id TEXT PRIMARY KEY,
  owner_id TEXT NOT NULL REFERENCES users(id),
  draft TEXT NOT NULL,               -- the block document being edited (JSON)
  status TEXT NOT NULL DEFAULT 'draft', -- draft | published | unpublished | removed
  version INTEGER NOT NULL DEFAULT 0,   -- published version (0 = never published)
  reviewed_version INTEGER NOT NULL DEFAULT 0,
  reviewed_by TEXT,
  reviewed_at TEXT,
  review_note TEXT,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  subject TEXT NOT NULL DEFAULT 'Other',
  level TEXT NOT NULL DEFAULT 'Adult',
  counts TEXT NOT NULL DEFAULT '{}',   -- {"lessons":n,"questions":n,"cards":n} of the published version
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  published_at TEXT
);
CREATE INDEX courses_owner ON courses(owner_id);
CREATE INDEX courses_status ON courses(status);

CREATE TABLE images (
  id TEXT PRIMARY KEY,
  owner_id TEXT NOT NULL REFERENCES users(id),
  mime TEXT NOT NULL,
  bytes INTEGER NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX images_owner ON images(owner_id);

CREATE TABLE reports (
  id TEXT PRIMARY KEY,
  course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  reason TEXT NOT NULL,
  details TEXT NOT NULL DEFAULT '',
  reporter_id TEXT,
  ip_hash TEXT NOT NULL,
  created_at TEXT NOT NULL,
  resolved_at TEXT,
  resolved_by TEXT,
  resolution TEXT
);
CREATE INDEX reports_open ON reports(resolved_at);
CREATE INDEX reports_ip ON reports(ip_hash, created_at);

-- What reviewers did, for accountability.
CREATE TABLE review_log (
  id TEXT PRIMARY KEY,
  course_id TEXT NOT NULL,
  version INTEGER NOT NULL,
  actor_id TEXT NOT NULL,
  action TEXT NOT NULL,
  note TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL
);

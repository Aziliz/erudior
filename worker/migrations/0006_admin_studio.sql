-- Private administrator materials. Never joined into public community catalog routes.
CREATE TABLE studio_sources (
  community_id TEXT PRIMARY KEY REFERENCES courses(id),
  canonical_id TEXT NOT NULL,
  revision INTEGER NOT NULL,
  digest TEXT NOT NULL,
  version INTEGER NOT NULL,
  reviewed_at TEXT NOT NULL,
  published_at TEXT NOT NULL
);
CREATE INDEX studio_sources_identity ON studio_sources(canonical_id, revision, digest);
CREATE TABLE studio_materials (
  id TEXT PRIMARY KEY,
  document TEXT NOT NULL,
  revision INTEGER NOT NULL,
  title TEXT NOT NULL,
  kind TEXT NOT NULL,
  digest TEXT NOT NULL,
  created_by TEXT NOT NULL REFERENCES users(id),
  updated_at TEXT NOT NULL,
  approval TEXT,
  deleted_at TEXT
);
CREATE INDEX studio_materials_page ON studio_materials(deleted_at, id);
CREATE TABLE studio_operations (
  actor_id TEXT NOT NULL REFERENCES users(id),
  request_id TEXT NOT NULL,
  fingerprint TEXT NOT NULL,
  material_id TEXT NOT NULL,
  result_revision INTEGER NOT NULL,
  action TEXT NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY(actor_id, request_id)
);
-- Discovery cache only; signed current catalog/package checks remain authoritative.
CREATE TABLE studio_official_sources (
  canonical_id TEXT NOT NULL,
  revision INTEGER NOT NULL,
  digest TEXT NOT NULL,
  PRIMARY KEY(canonical_id,revision,digest)
);

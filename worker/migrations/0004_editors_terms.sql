-- Terms v2: community courses belong to Erudior; authors and their chosen editors maintain them.
-- terms_version: which community terms the user accepted (0 = none, 1 = the original terms).
ALTER TABLE users ADD COLUMN terms_version INTEGER NOT NULL DEFAULT 0;
UPDATE users SET terms_version = 1 WHERE accepted_at IS NOT NULL;
-- When the user last signed in or opened the site while signed in (updated at most daily).
-- A course whose owner hasn't been seen for a year can be taken over by another author.
ALTER TABLE users ADD COLUMN last_seen_at TEXT;
UPDATE users SET last_seen_at = COALESCE(accepted_at, created_at);

-- People the owner lets edit and publish a course (besides the owner and Erudior's admins).
CREATE TABLE course_editors (
  course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  added_by TEXT NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY (course_id, user_id)
);
CREATE INDEX course_editors_user ON course_editors(user_id);

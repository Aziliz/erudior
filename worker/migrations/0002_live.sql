-- Live rooms keep nothing; this only rate-limits opening rooms (daily-salted IP hash).
CREATE TABLE live_rooms (
  ip_hash TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX live_rooms_ip ON live_rooms(ip_hash, created_at);

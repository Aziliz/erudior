-- Short-lived anonymous launch correlation only. No platform identity, token, role or grade.
CREATE TABLE lti_state (
  state_hash TEXT PRIMARY KEY NOT NULL,
  binding_hash TEXT NOT NULL,
  nonce_hash TEXT NOT NULL,
  registration_hash TEXT NOT NULL,
  target TEXT NOT NULL,
  expires INTEGER NOT NULL
);
CREATE INDEX lti_state_expiry ON lti_state(expires);
CREATE INDEX lti_state_registration ON lti_state(registration_hash);

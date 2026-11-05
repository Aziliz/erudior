# Private record exports

This service capability exports an explicitly selected set of existing private records. It has no production bindings or public website interface. Account closure, learner erasure, identity verification, recovery, external processor cleanup and complete account-data access requests remain separate work.

## Enablement boundary

The private-service administrator must apply `account-service/sql/002_private_record_exports.sql` after migration 001, using the existing separate database owner. The runtime role still cannot write authority graphs or original record payloads. Migration 002 adds only bounded export storage and narrowly scoped cleanup functions.

Exports are disabled unless the host supplies `StoreOptions.exports.artifactTtlSeconds` and separately supplies the four-method `exports` capability to the HTTP handler. There is no default artifact lifetime. The configured positive lifetime is capped at 24 hours; the originating session's absolute expiry can shorten it. This technical artifact limit does not resolve legal retention or institutional custody. Production enablement still requires the identity, privacy, infrastructure and operational approvals in [ACCOUNT_SERVICE.md](ACCOUNT_SERVICE.md).

## Workflow

- `POST /v1/exports`: supply `workspaceId`, `requestId`, and `records`, an explicit list of `{id, version}` pairs. There is no wildcard, account-wide discovery, client authority graph or request-supplied lifetime.
- `GET /v1/exports/:id`: obtain minimal current status for an authorized export.
- `GET /v1/exports/:id/download`: retrieve a JSON attachment named `erudior-record-export.json`.
- `POST /v1/exports/:id/cancel`: dispose of the creating session's artifact bytes. This does not delete original records.

Every route uses the existing private cookie, same-origin request marker, bounded transport and no-store headers. Mutations require the exact Origin and session CSRF token. No public URL, bearer token or email delivery is created. Audit callbacks contain only operation, outcome and random request ID, without record data or identifiers.

Creation checks the current `record.export` permission for every selected record. Read access alone is insufficient. The service prepares the artifact and stores its job in one PostgreSQL transaction while retaining the authority and session locks. All selected records must still match their exact workspace and version. Final authorization and time checks occur after database waits. Metadata and downloads recheck current export authority; changed records, withdrawn authority, expired authentication and revoked sessions fail closed.

Cancellation is a cleanup-only exception: the same currently authenticated creating session, session version, owner and workspace, with valid CSRF, may dispose of its own artifact after source authority is withdrawn. It receives only minimal cancellation status, never original content. Other sessions cannot cancel or retrieve the artifact.

Artifacts survive service-process restart and browser reload with the same valid session. Re-login or context rotation invalidates access, including switching away and back. A new authorized export request is required. JSON artifacts are unsigned data copies; they do not establish academic credit, official verification or issuer authority.

## Bounds, retries and cleanup

A request contains 1–32 distinct record IDs with positive versions and fits the existing 4 KiB HTTP body limit. The service caps the serialized artifact at 1 MiB; PostgreSQL independently caps its JSON representation at 2 MiB. Creation serializes capacity checks: at most 16 jobs per session and 256 globally. Rejected scopes do not leave partial artifacts.

A request ID binds to the exact canonical record/version set and creating session. Reordering the same set is an idempotent retry; changing its scope is rejected. Cancelled and expired jobs retain minimal idempotency metadata until the original session expires, so retries cannot recreate their bytes. Expiry clears artifact bytes, and cleanup removes terminal metadata after the session lifetime. The host must schedule and monitor `purgeExpired()` before activation; request preparation also runs bounded export expiry cleanup. None of these operations erase learner identities, original records or external accounts.

Forced RLS binds artifacts to owner, workspace, session ID and session version. It protects against wrong queries and pooled connection scope leakage after trusted service authorization. As with the existing record store, it does not protect against a compromised trusted service or database administrator. Backups, deployment logging and processor retention require separately approved operational controls.

## Acceptance

`npm run test:accounts` includes the strict service typecheck and export HTTP contract cases. `npm run test:accounts:integration` includes real PostgreSQL output, scope, role, concurrency and lifecycle tests, independent adversarial race tests, and a full HTTP login/export/retry/cancel flow backed by signed synthetic OIDC and PostgreSQL.

The dedicated private-account workflow supplies a disposable PostgreSQL service. Missing local database configuration fails explicitly. No real learner records, production credentials or provider registration are used. Complete CI acceptance is required before describing this implementation as validated; protocol/database acceptance does not substitute for production activation or a client UI.

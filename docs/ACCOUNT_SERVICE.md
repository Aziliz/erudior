# Private account service integration

Implementation slice: 2026-10-30. This is an internal browser sign-in/session/read boundary for the [account program](ACCOUNT_SYSTEM.md), not a production account launch. It builds on the [domain foundation](ACCOUNT_FOUNDATION.md) without importing private code into the public website, learning application, or public community Worker.

## Release boundary

The implementation provides a provider-neutral OIDC client, a Fetch Request/Response handler, a PostgreSQL adapter, an administrator migration and synthetic protocol/database acceptance tests. There is no deployment manifest, bound production database, provider registration, frontend login screen, signup endpoint, native credential bridge, automatic local-data upload, verified consent collection or actual learner-data erasure executor. A provider login is accepted only for an exact issuer/subject identity already provisioned in trusted server state. Provider email, role, group, school and age claims never create an account or grant authority.

Public learning stays account-free. Public community publishing, local Family/Classroom PIN gates, signed course publishing, learner checkpoint grants and credential issuance remain separate authorities. The account roadmap capability remains In Progress until the complete account lifecycle and production prerequisites are implemented and validated.

## HTTP contract

The handler must run at one exact configured HTTPS application origin. It does not infer origins from Host/forwarding headers, allow cross-origin requests, or serve public-website accounts.

| Method and path | Purpose |
| --- | --- |
| `GET /health` | Process-ready response only, not a database or provider availability guarantee |
| `POST /v1/auth/start` | Start a pinned provider login with optional requested workspace |
| `GET /v1/auth/callback/:providerId` | Consume a browser-bound one-use transaction and redeem/verify the code |
| `GET /v1/session` | Minimal current account/session/context projection and session-bound CSRF token |
| `POST /v1/session/context` | Recheck context authority and rotate session/CSRF credentials |
| `POST /v1/session/logout` | Revoke the exact current device session |
| `GET /v1/workspaces/:workspaceId/records/:recordId` | Read one exact currently authorized record |

All non-callback account requests require `X-Erudior-Request: 1`. Mutations additionally require an exact Origin, bounded JSON, same-origin Fetch Metadata when supplied, and a session-bound CSRF header after login. The health endpoint is exempt. There is no bearer/query-token fallback, method override, arbitrary return URL, client-posted authority graph, list/export endpoint or record mutation API. Unauthorized and nonexistent record IDs return the same generic 404 result. Provider and database failures do not disclose raw errors, tokens or claims.

Responses use `Cache-Control: no-store`, `Referrer-Policy: no-referrer`, defensive content headers and random request IDs. Audit callbacks receive only request ID, operation and outcome. Provider callback URLs, authorization codes, cookies, contact details, subjects and record contents must also be excluded by the eventual proxy/platform logging configuration; the handler cannot configure an external proxy's logs.

## Browser sign-in

The server owns each exact HTTPS issuer, authorization/token/JWKS endpoint, confidential client ID/secret, callback, signing algorithm and approved MFA assurance-context mapping. The implementation deliberately requires the authorization-response issuer parameter. It does not dynamically discover arbitrary providers or follow endpoint redirects.

Each login has random state, nonce and an S256 PKCE verifier, expires in five minutes and is bound to a separate `__Host-erudior-login` Secure, HttpOnly, Path=/, SameSite=Lax cookie. The pending transaction stores the PKCE verifier on the server. The callback atomically consumes the transaction before exchanging the code. A lost or failed exchange requires starting again; it cannot replay a consumed transaction.

The confidential authorization-code client requests only `openid`, a fresh login and `max_age=300`. It uses oauth4webapi protocol validation and explicitly validates the ID-token application signature against the pinned JWKS URI. Issuer, audience, authorized party, nonce, authentication time, issued-at, expiry, algorithm and current transaction configuration must match. Only explicitly configured signed `acr` values establish MFA; `amr`, email verification or asserted roles do not. Provider access/refresh tokens are discarded, not returned to the application.

Token responses are bounded to 64 KiB, JWKS responses to 128 KiB, and each request—including body streaming—to at most five seconds. Redirects and malformed/oversized responses fail closed. New logins obtain current signing keys rather than relying on a stale-key fallback. Configuration hashes bind pending flows and sessions to registration settings, including secret rotation.

Synthetic provider tests use a loopback HTTP server through an explicit trusted test transport mapping synthetic HTTPS endpoints. This proves code redemption, PKCE, signatures and protocol rejection, not real managed-provider configuration or production TLS/browser behavior. Production uses HTTPS fetch without that test transport.

## Device sessions and context isolation

Successful sign-in creates a new 256-bit opaque credential. Only its SHA-256 hash is stored. The cookie is `__Host-erudior-account`, Secure, HttpOnly, Path=/, SameSite=Strict, without a Domain attribute. The default absolute lifetime is eight hours and the idle lifetime is thirty minutes, bounded further by the domain authentication policy. Each device has an independent session. The database limits active sessions to 32 per account with serialized issuance.

A context switch rechecks current identity, account, memberships, verified authority, enrollment and school policy, then rotates both the cookie and CSRF credential and advances session version. It does not renew authentication time or convert school authentication into personal authentication. School-controlled identity and recovery cannot grant Personal or Family access. Teachers remain limited to their current assigned classes and allowed record categories.

The Strict session cookie is ordinarily absent on the cross-site provider callback. Login start therefore binds a possible replacement session on the server. A successful same-browser re-login revokes that exact prior session in the issuance transaction; a failed login does not revoke it and other devices remain independent. Logout revokes the current credential. A future device-management UI and remote device revocation API are not supplied here.

The handler rejects malformed or duplicate protected cookies. It derives a separate session-bound CSRF token with a server-owned HMAC key and checks its persisted hash. Rotating that key requires sign-in again. Provider configuration changes and current account/identity/session revocation invalidate old credentials. Existing local PIN/password gates are not inputs to online authentication.

## PostgreSQL access and consistency

`account-service/sql/001_private_accounts.sql` is an explicit administrator migration for a separate private database. It creates a no-login owner role and a restricted runtime role. The host supplies a dedicated runtime login inheriting only the runtime privileges; it must not use the database owner or administrator. The store checks every acquired connection for unsafe owner/superuser/BYPASSRLS/schema-create or protected graph/payload-write privileges. Call `ready()` before accepting traffic.

The current integration store uses a bounded, server-provisioned authority graph (maximum 4 MiB) and separately stored record payloads (maximum 256 KiB each). This graph is a transitional integration store, not a completed normalized, high-scale multi-school database. There is no runtime authority-provisioning API. A future provisioning service must verify authority evidence, enforce monotonic entity and snapshot revisions, atomically update graph/payload metadata, audit its changes and reconcile deletion/restore fences. The test harness is not that provisioning service.

For a protected read, the store acquires a database transaction, locks the current trusted graph for shared access and the session for update, validates current state through the shared authorizer, scopes an exact payload query with transaction-local claims, retrieves the record, and rechecks current authorization/time before releasing the result. Revocation writers cannot be acknowledged while an earlier protected read still owns the corresponding locks. Requests beginning after acknowledged revocation are denied. Time can expire during query or idle-touch waits, so final checks roll back rather than returning a formerly authorized payload.

Forced row-level security constrains exact record, record revision, workspace, learner, graph revision and active session/version. It is defense against wrong queries and accidental scope leakage after the trusted service authorizes the record; it does not protect against a compromised trusted service that can set transaction claims or a privileged database administrator. The runtime has no learner payload or authority graph write grants. Transaction scope is reset on acquisition and cannot persist across commit/rollback and pool reuse.

Transactions use bounded statement, lock and idle-in-transaction timeouts. Queries are parameterized and use one checked-out connection for the complete transaction. Private authorization and record reads must not be placed behind a query cache or use a shared connection's persistent authorization state. The host must configure its connection pool, verified TLS and deployment-specific trust separately.

Pending flows have a bounded global capacity and serialized creation/consumption. `purgeExpired()` removes only expired login material and expired/revoked session credentials. It does not erase accounts, learners, authority receipts or academic records. Production needs a bounded, monitored cleanup schedule, purpose-based retention, export/deletion execution, processor coordination and tested restoration before collecting real learner data.

## Validation

From the repository root, `npm run test:accounts` runs the isolated strict typecheck, existing domain authorization/lifecycle/security checks, signed-provider OIDC tests and HTTP transport rejection tests. These checks are also part of the full application `npm test` chain.

`npm run test:accounts:integration` requires `ERUDIOR_ACCOUNT_TEST_ADMIN_URL` pointing to a disposable loopback PostgreSQL server with a test administrator allowed to create databases and roles. Missing configuration fails rather than silently skipping. Each suite creates its own synthetic database and restricted runtime login, then closes connections and removes them. The harness waits for connection end events before dropping the database instead of suppressing connection errors.

The dedicated `private-accounts.yml` workflow supplies PostgreSQL 16 with disposable runner-only credentials and read-only repository permissions. It exercises real RLS, credential caps, one-use flows, concurrent issuance/switches, revocation ordering, expiry during blocked queries and final idle touches, transaction scope cleanup, and HTTP requests backed by signed synthetic OIDC and the actual runtime database role. These Request/Response tests are not an actual browser cookie-policy acceptance suite or native application test.

A fresh CI run is required for the recovered branch. Historical local results from the interrupted development attempt are not substituted for validation of the current combined tree. No real provider credentials, personal learner data, consent acceptance or production database mutation are used for these tests.

## Required before activation

Select and review the managed identity provider, launch jurisdictions, hosting region and processor agreements. Provision separate private infrastructure and narrowly scoped operational identities. Implement verified authority collection, consent withdrawal, recovery, export, deletion execution, institutional record custody, device management and explicit local-data migration. Add real browser and native-client acceptance, deployment TLS/proxy/logging/rate-limit checks, incident response, operational monitoring, backup/restore reconciliation and retention drills.

Until these are complete, retain the absent production bindings and signup routes. Do not advertise this internal slice as live accounts, cloud synchronization, verified guardianship, institutional approval or a completed account lifecycle.

# Private device-session management

This capability is part of the separate, not-deployed private account service. It does not enable production accounts, add a settings UI, install native clients, choose providers or regions, or erase account/learner records. “Device” currently means an independent authenticated browser session, not an attested hardware identity.

## Explicit integration

Apply administrator migrations 001, 002 and `account-service/sql/003_private_device_sessions.sql` to the separate private database. Set `StoreOptions.devices: true`, and pass the store as `PrivateAccountHttpConfig.devices`. Without the host option the routes are absent; without the store option management is denied. Existing current-session logout remains available independently.

- `GET /v1/devices`: returns `{devices: [...]}` containing only `id`, `current`, `issuedAt`, `lastUsedAt` and `expiresAt`. The expiry is the earlier idle or absolute deadline. Only active, unexpired owned sessions are listed, at most 32. No provider claims, subjects, workspace names, IPs, user-agent fingerprints, token hashes or CSRF hashes are returned.
- `POST /v1/devices/revoke` with `{sessionId}`: revokes that exact live owned session.
- `POST /v1/devices/revoke` with `{}`: atomically revokes all currently live sessions owned by the actor, including the current session. There is deliberately no client-supplied account ID.

Revocation returns `{revoked, currentRevoked}` and clears the current browser cookie when applicable. Unknown, expired, revoked and other-account targets return the same generic unavailable result. A lost success response can therefore be followed by authentication-required or not-found, rather than a second successful revocation. After current/all revocation the client must sign in again; it must not keep showing an authenticated settings screen.

## Authority and concurrency

Both inventory and remote revocation require a current valid personal-source MFA session authenticated less than five minutes ago, matching the domain's sensitive-authentication policy. School-controlled and restricted learner credentials cannot inspect or manage account-wide personal sessions. The existing sign-in flow supplies fresh provider evidence; passing a timestamp in request JSON cannot refresh it. Personal MFA may revoke the same account's school-source sessions but never another account's sessions. A current active workspace is still required, consistent with the existing private session boundary.

All routes retain exact-origin/browser-request checks; mutations additionally require bounded strict JSON and session-bound CSRF. Authorization resolves the current graph, account, identity, provider configuration and session state. A separate transaction-local RLS owner scope permits management queries only for the resolved account and graph revision. Ordinary record/export/session scopes do not enable inventory access. This is defense against mistaken trusted-service queries, not a boundary against a compromised runtime that can set its own database claims.

The graph and session rows remain locked through commit. Management acquires the same creation lock as session issuance before locking any session rows, so concurrent managers cannot deadlock by holding each other's actor sessions and new sign-ins have a defined order relative to revoke-all. A sign-in ordered after revocation can create a new session: this feature is not account suspension, credential reset or identity-provider logout. Remote revocation waits for an in-flight protected read's session lock. Requests after acknowledged revocation fail closed, including exports tied to the revoked session. Time/provider policy is rechecked after queries and writes; expiry causes rollback rather than partial revocation.

## Validation and remaining work

`npm run test:accounts` includes synthetic HTTP contracts, CSRF/origin rejection, strict body validation and redacted audit/error behavior. `npm run test:accounts:integration` includes disposable PostgreSQL ownership, lifecycle and concurrent-session tests. No real credentials or personal data are used.

Production still requires reviewed identity/hosting/processor choices, trusted authority provisioning, a complete settings and fresh-auth UX, recovery and account lifecycle execution, private deployment and operational review. This slice does not claim those requirements are complete.

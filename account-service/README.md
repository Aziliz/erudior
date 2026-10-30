# Private account service

This directory contains Erudior's account-domain contracts, browser OIDC adapter, opaque device sessions, PostgreSQL store, and read-only private HTTP boundary. It is a separate server component, not part of the public website, application bundle, or community API.

The HTTP handler accepts only identities already provisioned in trusted server state. A verified provider identity does not create an account, prove guardianship, or grant a school role. This implementation has no production endpoint, deployment configuration, signup, native authentication, local-record upload, or deletion executor. Tests use synthetic identities and records.

Run its typecheck and protocol/domain tests from the repository root:

```sh
npm run test:accounts
```

These checks also run in `npm test`. OIDC tests start a loopback synthetic provider with real signing keys; no real provider credentials or personal information are needed.

The database/HTTP acceptance suite requires a disposable local PostgreSQL 16 server. It creates and removes a fresh test database and runtime role; it refuses a non-loopback server and fails when configuration is missing. Use a test administrator with database/role creation rights, never production credentials:

```sh
ERUDIOR_ACCOUNT_TEST_ADMIN_URL='postgresql://TEST_ADMIN:TEST_PASSWORD@127.0.0.1:5432/postgres' \
  npm run test:accounts:integration
```

The dedicated `private-accounts.yml` workflow supplies PostgreSQL and runs both commands. See [Private account service integration](../docs/ACCOUNT_SERVICE.md) for the HTTP contract, provisioning boundary, database roles, and release requirements.

## Trust boundary

The PostgreSQL adapter resolves the authenticated session and current account, authority, workspace, enrollment, and record state in a transaction. It locks the trusted graph and session, applies the shared authorizer, scopes exact payload selection with RLS, and checks current authorization again after retrieval. Parsing an object only checks its structure; it does not establish that its contents are true. Never pass client-posted snapshots, selected local roles, community publisher permissions, school email domains, local PIN results, or unsigned school files as authority.

Authorization decisions and lifecycle plans are short-lived transaction inputs, not bearer credentials. Recheck current revisions, revocation state, policy, and the exact operation before committing a write or releasing a record. Never cache a successful decision as permission for later work. Authentication source remains part of authorization: school-controlled sign-in and recovery do not grant Personal or Family access.

## Integration boundary

Keep this package outside `src/`, the public community `worker/`, and existing local learner-privacy checkpoint grants. Future deployment needs a separate private service and bindings, a selected/configured managed identity provider and storage region, verified authority provisioning, tested browser/native clients, and recovery/export/deletion execution. Do not introduce real learner collection through a demonstration or test adapter.

See [the account design](../docs/ACCOUNT_SYSTEM.md) for the full product and security contract, [the foundation delivery](../docs/ACCOUNT_FOUNDATION.md) for the domain rules, and [the service integration](../docs/ACCOUNT_SERVICE.md) for the current implementation and remaining work.

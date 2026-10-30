# Private account foundation

This directory contains the first executable account-domain contracts for Erudior. It is a separate server component, not part of the public website, application bundle, or community API.

The code evaluates trusted server state and prepares scoped lifecycle plans. It does not authenticate a person, verify guardianship, connect to an identity provider, execute deletion, upload local records, or expose an HTTP service. There is no production account endpoint or deploy configuration in this slice.

Run its typecheck and synthetic acceptance tests from the repository root:

```sh
npm run test:accounts
```

The same checks run as part of `npm test` and the repository's regression workflows. No provider credentials, external database, network access, or real personal information are needed.

## Trust boundary

A future private-service adapter must resolve the authenticated device session and current account, authority, workspace, enrollment, and record state from server-controlled stores in one consistent transaction. Parsing an object only checks its structure; it does not establish that its contents are true. Never pass client-posted snapshots, selected local roles, community publisher permissions, school email domains, local PIN results, or unsigned school files as authority.

Authorization decisions and lifecycle plans are short-lived transaction inputs, not bearer credentials. Recheck current revisions, revocation state, policy, and the exact operation before committing a write or releasing a record. Never cache a successful decision as permission for later work. Authentication source remains part of authorization: school-controlled sign-in and recovery do not grant Personal or Family access.

## Integration boundary

Keep this package outside `src/`, the public community `worker/`, and existing local learner-privacy checkpoint grants. Future deployment needs a separate private service and bindings, managed identity integration, PostgreSQL row-level security, and tested recovery/export/deletion execution. Do not introduce real learner collection through a demonstration or test adapter.

See [the account design](../docs/ACCOUNT_SYSTEM.md) for the full product and security contract and [the foundation delivery](../docs/ACCOUNT_FOUNDATION.md) for the implemented scope and remaining work.

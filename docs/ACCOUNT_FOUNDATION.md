# Private account foundation

Implementation slice: 2026-10-30. This is an internal server-domain foundation for the [account program](ACCOUNT_SYSTEM.md), not a launched account service. Production signup, family-to-school connections, device pairing, and cloud synchronization remain unavailable.

## Purpose

Erudior needs an account model that keeps a person's sign-in, a learner's academic identity, and permission to act in a household or school separate. The existing local Family/Classroom selection, adult PIN, community publishing account, and optional encrypted checkpoint protocol cannot establish these new permissions.

This slice turns the account design into executable, default-deny access decisions and scoped lifecycle plans. It does not add a login screen or accept personal information. Its tests use synthetic identities and records.

## Components and supported scope

| Component | Responsibility |
| --- | --- |
| `account-service/src/model.ts` | Versioned account, learner, workspace, session, authority, and record contracts with structural and relationship validation. |
| `account-service/src/authorization.ts` | Evaluate one exact operation against a current server-resolved snapshot; preserve Personal, Family, and School authentication boundaries. |
| `account-service/src/lifecycle.ts` | Prepare account closure and scoped data-erasure plans; resolve dependent stewardship and keep institutional custody separate. |
| `account-service/src/retention.ts` | Compute explicit retention deadlines, scope-specific holds, monotonic deletion fences, and backup/queued-write reconciliation requirements. |
| `account-service/test/` | Model, permission, lifecycle, and independently authored adversarial acceptance cases. |

No part of this directory is imported into the public website, browser application, or public community Worker. It has no deployment configuration, identity credentials, database connection, HTTP route, queue worker, or deletion executor.

## Authentication and authorization contract

The future identity adapter authenticates a person or a restricted learner device. The private application service then resolves the current session, account state, active context, authority receipts, memberships, class assignments, enrollments, and exact target record from trusted stores. These are distinct steps.

The authorizer does not turn an arbitrary JSON object into verified identity. Structural validation only establishes that the supplied server snapshot is well formed and internally consistent. Never accept a snapshot, role, authentication source, guardian verification, or account version supplied by a browser or mobile request as the authoritative state.

Supported requests identify their session and version, snapshot revision, workspace, exact action, and target version. A successful decision is bound to those inputs and returns entity revision guards, explicit school-policy version guards, and a validity deadline. The adapter must recheck the snapshot revision, all guards, `validUntil`, and current state in the same transaction before mutation or disclosure. Every relevant mutation must advance the applicable entity and snapshot revisions. The adapter must not cache an allow result, use a delayed result after revocation, or treat a serialized decision as a bearer token.

The transaction must use a server clock. Timeouts and fresh-authentication checks are not based on a client's clock. Expired, revoked, stale, contradictory, unknown, and unsupported inputs deny access.

Internal decisions and the authorization graph must not be serialized as client responses. A future API must also avoid disclosing whether a record outside the caller's scope exists. Load only the relevant authorization graph, not an entire institution's private records into a client or a long-lived permission cache.

### Required access boundaries

- A school-controlled sign-in authorizes only its permitted institutional context. It cannot enter Family, change personal recovery, pair a family learner's device, or close the person's entire account.
- A personal sign-in still has to satisfy the selected school's authentication policy and current institutional permissions.
- A named teacher needs an appropriate assignment to the exact class; school membership alone is insufficient for student-record operations.
- A guardian needs current verified authority for the learner, workspace, purpose, and operation. Another child or an unrelated family is outside that grant.
- Released school information requires an authorized school-to-family sharing relationship. Viewing it does not transfer custody to the family.
- A restricted learner session does not acquire guardian, staff, account-recovery, or account-closure powers.
- Revoked sessions, relationships, enrollments, or authorities cannot be restored by a stale client snapshot.

The finite operation set is deliberate. A future unsupported action must receive its own explicit authorization rule and tests before it can be enabled. There is no wildcard administrator or support-operator bypass.

Supported writes are existing mutable practice, guardian family notes and assignments, assigned school assignments, and explicitly granted institutional grade publication. Immutable submission edits, school-record erasure, identity linking, role creation, and attachment transport require their own protocols. School summaries accessed from Family are read-only; that context cannot export or overwrite a school record through these operations.

Learner-bound authority is tied to the current learner revision. Age, account-control, or rights changes must advance that revision, invalidating prior receipts until the appropriate authority is established again. This slice conservatively denies guardian access for adult or unresolved learners and for learners whose rights are independent. Continuing adult or postsecondary guardian sharing needs a separate explicit learner-authorized sharing protocol; the foundation does not silently infer it from a prior parent relationship.

## Account closure and data lifecycle

Closing an adult's account and erasing a learner's records are separate operations. A closure plan identifies the adult's Erudior identity, sign-in links, sessions, contact/recovery information, and relationships. It does not delete the person's underlying external Google or school account, and it does not cascade into every linked learner or institution.

A final guardian's closure must resolve dependent stewardship. A teen who has reached an age threshold but has not established usable independent access remains dependent for this decision. A verified successor, separately valid institutional context, or specifically authorized family-data erasure must resolve the applicable records and authority. Under-13 consent-dependent collection cannot continue while its authority is unresolved.

An independent learner account and school-custodied records survive the closure of a parent's login. A teacher leaving an institution likewise does not erase its grades or learner work. School-controlled deletion requests go to the responsible institution and its policy instead of becoming a family deletion cascade.

Retaining family records under a successor also requires a valid replacement authority for those records. The departing guardian's receipt cannot remain their ongoing access basis. A pending replacement blocks finalization until the new basis is verified and bound, while retaining original authorship and evidence history separately.

Privacy-request authority is separate from permission to collect learning data. Withdrawing learning consent must not prevent a currently verified guardian with the appropriate privacy scope from requesting erasure. A revoked guardian relationship or missing privacy authority still denies that operation.

Interactive operations in this slice require an active account/session, workspace, and applicable relationship. Recovery or privacy intake after those have already closed needs a separately verified intake and job protocol; it must not restore former learning access as a shortcut.

Erasing one family's records does not automatically erase a learner's separately authorized school or independent records. It does require a complete custody and purpose review of the remaining identity. If no independent basis remains, the executor must separately erase the unnecessary learner identity. Account closure also needs to resolve the closing person's own learner association and personal learning data, where present; deleting account metadata alone does not complete that work.

Retention deadlines are inputs to a verified policy, not universal legal constants. A shorter applicable deadline takes precedence. Any hold must name its exact scope, basis, review, and expiry; it cannot retain unrelated data. Plans distinguish access revocation, active-store erasure, backup expiry, and minimal replay/deletion metadata.

These functions prepare plans. They do not assert that any record has actually been deleted. A future executor must commit revision checks, session/authority invalidation, deletion ledger updates, and durable job creation atomically; carry out idempotent per-store deletion; retry failures; record actual completion; and reconcile the trusted deletion ledger before restoring an older backup or accepting queued offline work. After immediate session revocation, narrowly scoped durable job authority must carry already-verified erasure work to completion; the executor cannot depend on the closed account retaining an active session.

## Verification

Run from the repository root:

```sh
npm run test:accounts
npm test
npm run build
```

The focused command typechecks the isolated service and runs synthetic model, authorization, lifecycle, and independent security acceptance suites. The full regression command includes the same checks. The main-branch regression workflow explicitly watches `account-service/**` so a future account-only change cannot miss that gate.

The tests exercise both permitted work and denied transitions. They include linked teacher/guardian contexts, institution-controlled authentication, cross-school and unassigned-class access, unrelated guardians, stale/revoked state, restricted learner actions, account closure with dependent children, school custody, and deletion replay. Passing them validates the internal contracts; it does not substitute for testing an actual provider, database policy, browser session, native secure store, or operational deletion job.

## Remaining integration and release work

The next integration needs a selected identity provider, exact hosting region, and a separate private service. It must implement verified login/recovery, current server-side sessions, PostgreSQL constraints and row-level security, secure web/native session handling, and the concrete adapters supplying this domain's trusted state.

Before collecting real learner information, complete verified guardian/institution authority and notice flows, restricted child pairing, explicit local-data migration, encrypted cache policy, export, consent withdrawal, account transfer, erasure execution, retention jobs, backup reconciliation, monitoring, and operational acceptance. Provider and institutional agreements must cover the actual data flow and retention behavior.

This slice does not change local learner storage, existing family exports, course signing, credential authority, assessment evidence, public learning access, or APK delivery. The account program remains incomplete until the integrated controls are verified together.

# Credential integrity engine

## Scope and authority

This engine implements the original authenticated enrollment, instructor approval, tamper-evident records, equivalent-workload methodology, secure PDF evidence and revocation workflow. **Production qualification issuance is disabled.** No institutional authorization, real learner identity, issuer key or trust registration is created by installing Erudior. Synthetic regression artifacts are not qualifications.

A community account, local parent/teacher label, LTI launch, course-package signature or local educational-hour decision is not credential authority. The credential trust domain is separate from all of those. Existing course signing, content review, licensing and educational grading remain unchanged.

Production activation requires separately authorized institutional issuer and program approval, an approved methodology, identity-verification and instructor authorities, a securely provisioned issuer signing service, a dedicated registry and an approved privacy/retention and recovery policy. This work neither establishes regulatory compliance nor makes an accreditation decision. No production configuration, binding or key is provisioned by its deployment.

## Exact evidence and workload

The adult-gated workspace prepares one exact instructional assignment revision, its requirements/methodology, source snapshots, observations, educational decisions and restoration warnings. Preparation is read-only, rechecks existing authority and current history, and never automatically uploads private work. The exported digest is an integrity reference, not approval. Restored or locally reviewed educational minutes do not become qualifying credit.

The separately authorized instructor must sign the exact evidence digest, configured program/version and full methodology digest, subject/enrollment binding, approved workload and requirement-completion attestation. Enrollment is independently signed by the configured enrollment authority. Neither assertion can be replaced with an arbitrary local name or unsigned boolean. The engine verifies signatures and configured policy; it cannot independently establish that an institution's factual assertions are true.

## Issuance and revocation

The optional worker adapter has a separate credential database, trust configuration and issuer signing dependency. Missing prerequisites deny issuance before storage access. The ordinary community configuration has none of them. Credential migrations are separate from community migrations.

All signed envelopes use a credential-specific domain and distinct enrollment, instructor, issue, revoke, audit, event, status and PDF purposes. The exact audience, issuer, program, evidence, methodology, expiry and request identity are checked. Mutation IDs and expected revisions are bound to the authenticated command; atomic registry writes reject conflicting retries and concurrent duplicate issuance. Successful exact retries within the signed command validity window are idempotent. A fresh issuer-authenticated, read-only audit command recovers the exact stored artifact and private signed enrollment/instructor lineage after a lost response or expired mutation request; it cannot restore or reactivate registry state.

Signed events preserve issuance and terminal revocation. Corrections require revoking the old artifact; no import or backup API can reactivate a registry credential. Hash chaining is not independently tamper-proof: verification relies on separately trusted issuer signatures and exact signed history. Loss or replacement of registry storage must never be treated as evidence that old credentials are active. A complete rollback to an earlier correctly signed issuance row cannot be detected from that row alone: a signature prevents edits, not omission of a later revocation. Production recovery therefore requires separately approved monotonic checkpoints, trusted backups and reconciliation against the latest revocation history before serving status. This engine exposes no registry restore/import route.

## PDF and public verification

The PDF is a deterministic bounded text-only artifact with a detached Ed25519 proof covering its exact bytes and signed issuance event. Verification regenerates the permitted PDF and rejects altered bytes or active-content substitutions. This is **not** an embedded PAdES signature, qualified electronic signature, government-approved certificate or assurance of accreditation. The downloadable bundle preserves the proof needed for independent verification.

A historical issuance signature does not establish current validity. The authorized issuer must generate capability tokens with a cryptographically secure random generator (at least 32 random bytes); shape validation alone cannot prove entropy. Public verification uses that unguessable capability supplied in a POST body, not a token-bearing URL; responses contain minimal status and no learner identity, private evidence, grades or detailed revocation reasons. Signed status binds a fresh verifier challenge, token digest and short validity period. Missing, expired or unavailable status is unknown, not active. Responses are noncacheable. Anyone given a capability can learn its minimal status, so sharing is intentional.

Public artifacts use an opaque subject reference, not a learner name. Keep private evidence exports separately protected. There is no export-to-registry restore operation and no automatic trust in keys carried by an imported artifact. The app currently has no provisioned issuer trust and therefore cannot claim that an arbitrary imported artifact is authentic.

## Validation

Synthetic tests generate ephemeral test keys and original neutral evidence only. The isolated integration harness uses real local D1 and loopback HTTPS verified against its ephemeral certificate authority, with temporary configuration and no remote bindings. It covers default-disabled behavior, unapproved programs, signature/domain/audience/expiry/evidence failures, concurrent issuance, idempotent retry, conflicting replay, exact PDF verification, terminal revocation and privacy-minimal fresh status. Browser tests cover evidence preparation and independent artifact verification, failed/interrupted operations, stale-profile cancellation, keyboard access, light/dark narrow and wide layouts and accessibility. Production verification is read-only and never issues a credential.

## Roadmap boundaries

The user explicitly skipped another audit/redesign of content review, versioning and auditability because that content has already been reviewed. That row remains Planned with a skip note, not counted as implemented. Course adoption of engine features follows completion of the remaining engine capabilities; this change authors no course content. Operational institutional enrollment, issuer activation and public registry provisioning are genuine separately authorized setup prerequisites, not claims of this engine's deployment.

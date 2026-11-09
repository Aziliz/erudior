# Local Family backup verification and staged recovery

This workflow is in the adult Family settings of the local app. It does not enable online accounts, synchronization, identity verification, or new learner-data collection. Plain practice backups and minimized learner recovery remain separate workflows.

## Verify without restoring

Authenticate as the supervising adult, select an existing encrypted Family backup, and enter its backup passphrase. Verification decrypts locally and runs the restore preflight without changing saved Family data. The review shows the backup date and bounded counts of learners, courses, banks, records and attachments, together with differences from the current device and specific recovery warnings. It does not display credential hashes or record payloads.

Use **Finish verification without restoring** to complete a recovery drill without applying the backup. Cancel, leaving the view, hiding the page, locking, or changing the local session clears the in-memory input and prepared review. Nothing is uploaded, and the backup passphrase is not saved.

Verification is not a guarantee that every attachment or referenced course is present. Missing referenced attachment bytes are reported explicitly. It is also not a full restore simulation: actual storage failures can still occur during application.

## Deliberate restore

Restore is a separate, explicitly acknowledged action in the same still-authorized adult session. A prepared review is single-use and bound to the verified input and relevant current local state. Changes invalidate the review rather than silently applying an old plan. An expired or locked adult session requires authentication and verification again.

The existing restore semantics remain authoritative. Imported parental course reviews, classroom sharing and the specified educational review/approval states require their existing fresh review. Privacy consent and transfer bindings are not activated by recovery. Existing encrypted competency-history behavior is preserved; this is not a universal removal or revalidation of every historical decision.

Close other Family windows and avoid editing this Family elsewhere during restore. Recovery spans multiple local files and stores. It is **not an atomic transaction** and does not promise rollback. If application is interrupted, some data may already have changed. Reload saved Family, inspect the result, and explicitly verify again before another attempt. There is no automatic retry. Restoring is not secure erasure of unrelated old files, prior profiles or pending session drafts, and does not restore every external or installed resource.

## Input and authority boundaries

The encrypted envelope and plaintext have explicit size/structure limits. The preflight rejects unsupported versions and key-derivation settings, malformed or duplicate identifiers, ambiguous duplicate JSON fields, invalid record/library structures and malformed attachment data before destructive writes. AES-GCM authentication must succeed with the supplied passphrase. The verified Family flow also rejects missing or malformed adult credential material rather than offering a restore that could prevent the adult from reopening Family. Legacy compatibility is retained only where the existing restore contract supports it.

Local adult/session authorization remains checked during preparation and application. Queued attachment writes recheck the caller's authorization inside their document transaction before saving. Existing deletion tombstones, privacy revocations and restored-library review fences are preserved. Local UI authorization is not encryption, verified guardianship or a server-side account boundary.

## Validation

The dedicated `Family backup recovery acceptance` workflow runs the production build and real browser acceptance using synthetic local Family data and encrypted backup bytes. Existing shared-device acceptance retains its lock, fresh-authentication and deleted-learner checks through the new review flow. Run `npm run test:family-recovery` for the focused backend, document-authority and real-component suites. Focused tests cover preflight failure/no-write behavior, stale prepared state, lifecycle clearing and document-write authorization races.

The browser tests are local-app browser evidence, not a physical Android storage or operating-system file-picker certification. Production/native release gates remain separate. Do not describe the workflow as validated until its exact integrated revision passes the required checks.

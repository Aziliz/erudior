# Local parent homeschool planning

In development on the parent planning branch. Public roadmap remains In Progress until the complete capability is validated.

## Scope and access

The local Family workspace uses its existing supervising-adult password gate. Open **Family → Homeschool planning** for each learner's subject placement, yearly and four-year high-school plans, material lists and field trips. Levels may differ by subject. Plans and completion labels are intentions and parent observations, never earned credits or graduation approval. **Academic records** retains the existing configurable credit/evidence audit and transfer-credit review. **Grades**, **Documents** and **Reports** retain their existing functions.

Public `/parent/planning` explains local-app availability without opening family records or creating accounts. Native delivery is in the next app version; no installer release is bundled with this change. Public website/course reading stays free and account-free. Local private creation/export is unrestricted; community publishing is a separate signed-in 18+ workflow.

## Community review and assignment

In **Family → Courses**, choose a learner and inspect a community course. Preview downloads source into memory only; it never installs or enrolls. Already downloaded courses can be reviewed offline. Inspect readable content/media plus complete inert source and engine definitions. Remote resources are not automatically fetched by the personal preview. Parent judgment is not platform review, verified identity, approval of professional credit or institutional endorsement.

Approval binds the selected learner, community identity/version and SHA-256 of the exact normalized course including media. Confirming saves that version using exact-byte compare-and-swap and adds the assignment without changing learner progress. A remote preview is rechecked against current published content before installation. Concurrent changed local content is never silently overwritten. Failed multi-file operations may leave a downloaded source without an assignment; reload saved Family state to inspect the outcome before retrying.

The learner explicitly starts the reviewed course from Assigned courses. Subject ordering is preserved. Changed content or versions, missing assignments, another learner or restored backup approvals cannot authorize use. Removing an assignment revokes approval but preserves prior progress. Restoring a full backup strips parental community review receipts; fresh local review is required. This is local shared-device protection, not a cryptographic defense against an administrator modifying their own storage.

## Persistence and recovery

Planning data lives in the learner's existing bounded Records document and uses its revision/CAS, credential/profile/deletion checks, audit journal and plain/encrypted full-backup paths. Stale saves fail with Reload rather than overwriting timer/reader updates. Missing evidence references remain visible; removal does not delete document files. Completed field trips do not automatically create attendance, hours or credits. Imported plans are historical untrusted claims, not restored assessment/assignment authority.

External downloads, backups and copies are not erased by local planning removal. Existing Learner privacy controls own learner deletion. Online accounts, managed identity, institutional custody and server retention remain separate work. No jurisdiction is assumed and no legal graduation determination is supplied.

## Acceptance

Focused model/storage/authority/UI tests and a synthetic real-App browser suite cover scope changes, cancellation, history, offline/reload, repeated operations, conflicts, malformed records, changed course versions, revocation, mobile accessibility and public entry. Final exact-head CI, native/browser artifact review, postmerge regression and deployment evidence must be recorded before marking this capability Done.

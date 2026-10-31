# Teacher Content Studio — implementation checkpoint

Status: **In Progress**, existing Later roadmap capability. This checkpoint is not a complete feature and must not be merged/deployed as if it were.

## Hosting decision still pending

The public roadmap specifies admin-panel-only website authoring/review. Current community authentication, credentialed CORS, CSRF and OAuth return routing trust `https://app.erudior.com`, not the public `https://erudior.com` origin. `worker/wrangler.toml` leaves additional allowed origins empty, and the deployment workflow does not override them.

A dedicated server-admin panel on the already trusted app host, linked from the public website, avoids a new origin grant. If the panel must instead run on erudior.com, explicit authorization and a reviewed scoped authentication/origin design are needed first. No origin, identity provider, role promotion, credential, secret or production data has been changed. Teacher/learner accounts stay in the application; public reading remains account-free.

## Host-neutral model checkpoint

`src/lib/adminStudio.ts` provides deterministic resource selection for worksheet, quiz, rubric, discussion, project, lab, presentation and study-guide material. It reuses canonical presentation source extraction and assessed-work validators. It does not invent curriculum or answers. Source IDs, revisions and immutable package digests bind selected resources; exact current source comparison detects deletion, source changes and tampering. Canonical assessed-work snapshots preserve IDs, writing kinds, self-check settings, table structure, lab supervision/safety/questions and referenced rubric criteria. The unmounted learner renderer uses that structured data rather than lossy joined table text. Flashcard backs and choice answers are explicitly teacher-only, separate from learner prompts. Unsupported media/rich blocks are visibly countable exclusions, not remotely loaded content.

The model is not a trust verifier. Its inventory must come from a server-side verified loader. User-provided imports cannot authorize their own source claims. Model-level approval comparison is not authorization: current server admin role, session, terms and exact atomic persistence guards are still required.

Bounded imports carry only material content, never approval/account/official-publication metadata. Copies receive a fresh identity and revision zero. Learner projection is constructed without teacher notes or question answers. Any title/instruction/teacher-note/source/revision edit invalidates the exact content digest used by human approval.

## Remaining completion gates

- Resolve hosting boundary; implement a dedicated server-admin-only panel, not the local adult-gated editor or reviewer queue.
- Server-private persistence, versioned list/read/save/duplicate/delete/export, bounded current verified-source loader and current-admin/session/CSRF checks on every access.
- Atomic revision and source/current-authority checks after asynchronous work; source deletion or review invalidation must immediately block delivery.
- Eight usable builder interfaces, review of the exact saved revision, instructor and answer-free learner presenter, reopen/conflicts/retry/cancel/recovery/import/export.
- No local persistent teacher secrets or student records; no automatic AI content, course publication, official approval or credential issuance.
- Real synthetic admin/browser integration; denial for anonymous, author and reviewer; revoked sessions/roles during requests; unsafe media; stale/deleted sources; answer leakage; import limits; mobile/a11y and screenshot inspection.
- Exact-head required CI before normal merge, full regression after merge, signed-course/integrity/publishing/API/site checks, then safe live unauthenticated gate verification. No real production admin writes.

## Focused verification

`npm run test:admin-studio` runs synthetic host-neutral model/security and inert renderer tests. The renderer is not mounted on any route; server authorization and browser delivery remain pending. Passing it does not establish server authorization, UI completeness, production deployment or independent content review.

## Proposed server/controller contracts (not implemented)

The API/controller split remains host-neutral while the hosting decision is pending:

- The server, not an imported document or local course cache, resolves the source inventory. Official sources require existing signed-catalog/package verification; community sources require exact immutable published/reviewed versions and canonical structural validation. Source type and authorization must be explicit. A structurally valid client-supplied `StudioInventory` is never proof of trust.
- The private library uses bounded pagination and current server-admin authorization. Private responses use `no-store`; no anonymous/catalog path may expose materials, answer keys, private metadata or review notes. Public reading remains unchanged.
- Every create/save/duplicate/delete carries an expected material revision and idempotency identity. Conflicts must preserve the user's unsaved in-memory draft and offer explicit reload/copy choices; automatic overwrite is prohibited. Unknown network outcomes are reconciled using the same request identity before retrying, never a blind new create.
- Approval is a separate explicit human operation on a saved exact revision and content digest, with source references verified again. Any edit invalidates approval. The current approved digest/source state is checked again at presentation/export; approval is never an official course publication or academic-credit grant.
- Current admin role, live session, ban/terms state and expected source state must be tested atomically at each D1 mutation after all asynchronous source/hash work. Reads/exports recheck current authority after asynchronous work before returning private material. Tests must revoke role/session and change/delete sources at those await boundaries, not merely before entering the handler.
- User-facing import is an untrusted copy: fresh server identity, revision zero and no approval. The server reconstructs source snapshots from its current verified inventory before accepting deliverable material. Unsupported/missing sources may be shown as actionable errors, never silently substituted.
- Editor controllers clear private view/preview data and cancel or ignore all stale request results when identity/session/navigation changes. Failed save, Cancel, Back, reload and second-tab conflicts preserve explicit user control. Recovery reopens a server-saved revision or an explicitly exported local copy; this does not authorize unencrypted automatic localStorage persistence of private teacher answers.
- The learner renderer receives only a constructed projection. It has no grading, network media, response persistence, publisher or account authority. Teacher answer reveal is a distinct admin-only presentation surface, never a hidden DOM/CSS pane inside a learner view.

These contracts do not create a server endpoint, migrate storage, grant a security origin or enable a feature. Backend, editor, authentication integration and actual browser/end-to-end acceptance are still outstanding.

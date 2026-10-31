# Teacher Content Studio — implementation checkpoint

Status: **In Progress**, existing Later roadmap capability. This checkpoint is not a complete feature and must not be merged/deployed as if it were.

## Hosting decision still pending

The public roadmap specifies admin-panel-only website authoring/review. Current community authentication, credentialed CORS, CSRF and OAuth return routing trust `https://app.erudior.com`, not the public `https://erudior.com` origin. `worker/wrangler.toml` leaves additional allowed origins empty, and the deployment workflow does not override them.

A dedicated server-admin panel on the already trusted app host, linked from the public website, avoids a new origin grant. If the panel must instead run on erudior.com, explicit authorization and a reviewed scoped authentication/origin design are needed first. No origin, identity provider, role promotion, credential, secret or production data has been changed. Teacher/learner accounts stay in the application; public reading remains account-free.

## Host-neutral model checkpoint

`src/lib/adminStudio.ts` provides deterministic resource selection for worksheet, quiz, rubric, discussion, project, lab, presentation and study-guide material. It reuses canonical presentation source extraction and assessed-work validators. It does not invent curriculum or answers. Source IDs, revisions and immutable package digests bind selected resources; exact current source comparison detects deletion, source changes and tampering. Lab supervision/safety/tables/questions and referenced rubric criteria are preserved as inert text. Unsupported media/rich blocks are visibly countable exclusions, not remotely loaded content.

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

`npm run test:admin-studio` runs synthetic host-neutral model/security tests. Passing it does not establish server authorization, UI completeness, production deployment or independent content review.

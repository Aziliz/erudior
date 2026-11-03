# Teacher Content Studio

Status: **In Progress** until the complete PR, browser acceptance, deployment and live-gate checks pass. This implements the existing roadmap capability, not a separate curriculum or course-publishing system.

## Approved hosting boundary

The dedicated administrator panel is `https://app.erudior.com/admin/studio`, linked from the public website. The user approved this existing trusted host on November 3, 2026. Credentialed CORS, CSRF, identity providers, role assignments and trusted signing keys are unchanged. Public reading remains account-free.

## Authoring and delivery

The eight builders create worksheets, quizzes, rubrics, discussions, projects, labs, presentations and study guides from selected verified canonical resources. Selection order and source provenance are retained. Assessed-work snapshots preserve IDs, writing kinds, self-check settings, table structure, lab supervision/safety/questions and referenced rubric criteria. Unsupported media and rich blocks are visibly reported rather than loaded or silently fabricated.

The private library supports create, reopen, edit, copy, archive/restore, explicit backup export and bounded import. Imports are untrusted copies with new identities and no inherited review. Conflicts preserve the in-memory draft; retries after unknown network or server outcomes retain the same request identity. Cancel and navigation protection keep unsaved work under explicit user control. Teacher content is not automatically persisted in browser storage.

A separate explicit human review binds the saved revision and exact content digest. Edits invalidate review. Teacher presentation, answer-free learner presentation and exports revalidate current authority and source state. Learner DOM contains only the constructed projection, never a hidden answer key. Switching material, session or identity clears private views and stale request results. A failed learner check remains a neutral learner screen rather than exposing the teacher editor.

Studio does not generate curriculum, record learner responses or grades, publish official courses, grant credit, issue credentials, or substitute for independent content review.

## Server trust and persistence

Migration `0006_admin_studio.sql` adds private materials, exact reviews, source registrations and idempotency journal tables. Every endpoint checks a live current administrator session, terms and ban state. Mutations retain the existing CSRF/origin boundary; private responses use `no-store`. The nonauthorizing UI session fingerprint is not a credential.

D1 mutation guards atomically compare current administrator/session authority, material revision and registered source state after asynchronous work. Reviewed community sources must match immutable package bytes and their current publication/review state. Reads and delivery recheck authority and source state before returning private content. Library review records are not represented as current delivery approval until validation occurs.

Official sources use existing trusted Ed25519 keys and the fixed public signed catalog. The server verifies bounded catalog/package bytes and exact identity, revision, size and digest, rejects redirects, and has no browser-cache, unsigned or development-key fallback. It fetches the signed manifest again before mutation or delivery and fails closed when it changed. This is an optimistic cross-system freshness check, consistent with release catalog rechecks: an external CDN publication cannot be atomic with a D1 transaction. Community-state and administrator/material guards remain atomic in D1.

Seventeen current repository courses migrate through the canonical adapter. Existing malformed blocks in `math-geometry` (flashcard references), `math-linear-algebra` (code block) and `science-biology` (C4/CAM block) fail visibly instead of being stripped or silently accepted. Studio does not modify those courses.

## Verification and operations

`npm run test:admin-studio` covers the deterministic model, inert rendering, real React controller flows, dedicated route boundary, signed official-source loader, and 57 SQLite/HTTP authorization, race, replay, recovery and leakage checks. Worker and application TypeScript checks and production builds are required.

`.github/workflows/admin-studio.yml` runs the real isolated Worker, D1 and R2 acceptance fixture. `scripts/admin-studio-browser.mjs` uses disposable synthetic accounts and canonical resources, exercises all eight builders at desktop and narrow widths, captures editor/learner screenshots, and verifies review invalidation, conflicts, retries, import/export, archive/restore and revoked access/source state. It never performs production admin writes.

Completion requires exact-head CI including browser acceptance and screenshot inspection, followed by merge regression, migrations/API/site deployment and safe unauthenticated live-gate checks. Focused tests alone do not establish deployment or browser acceptance.

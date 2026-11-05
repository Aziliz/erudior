# Case Reading and Legal Reasoning — first release

Prepared November 3, 2026 (America/Denver), against app main
`1b370814ffc19d42ed2342a7f493f32785c4378b`. This adds the second available course in
the existing J.D. Preparation program. The program retains 24 courses in three
stages; its availability becomes 2 available and 22 planned.

## Scope and preservation

Revision 1 contains four modules, eight lessons, 80 questions, 64 notecards,
56 glossary entries and four reference sheets. Its original fictional statute and
three-opinion packet support case briefs and a self-assessed capstone memo. It
remains independent preparation, without degree credit or automatic legal-writing
assessment.

The runtime is byte-identical to the separately validated draft. Release activation
changes only the private source's `released` flag; no instructional text, answer key,
identity or completion rule changes in this slice. The app changes comprise the
package, its generated catalog entry, one canonical sitemap URL, this record, and
the existing program acceptance tests. No engine, key or publication workflow changes.

All 22 existing catalog entries and package bytes remain unchanged, including the
newly published LSAT course. The sitemap preserves its 30 earlier URLs and adds
`https://app.erudior.com/case-reading-and-legal-reasoning`.

| Artifact | SHA-256 |
|---|---|
| Course revision 1 | `08701c9e6d80b3a1aa779ebe87ea422c458cb30316a95f4208dfc805eeb3364c` |
| Proposed 23-course source catalog | `8a8cfae58b35c5017db9b89467f9ed8695db6cb7806ae5589df01c04bebdcc19` |
| Authenticated 22-course production baseline catalog | `0ed6d41c6aeb27c119c23511444c02fbaf64bf6eac945d0f25811d70eba494ac` |

## Review evidence

The separate content validation reviewed all lessons, keys, explanations, cards,
glossary entries, references and independent capstone variants. It improved 53
questions and mobile reading layouts. That course-specific run passed 80 keys,
392 negative grading cases, 45 accepted text variants, 448 correct browser answers,
80 incorrect answers, 16 module quizzes and 616 accessibility/overflow audits.
Those results remain scoped to their original app baseline; unchanged course bytes
are established by the digest above.

Release integration uses the current app and complete authenticated source snapshot:

- Both unchanged source builders pass. All 4,973 existing source/output files retain
  their authenticated bytes except the generated catalog, which gains this entry.
- The app checker passes all 23 released packages with its normal 40 runs per drill.
- The production TypeScript/Vite build passes.
- The course answer-key checks pass again on the current app.
- Updated program acceptance verifies both published outlines/counts, readiness for
  Course 2 after completing Course 1, and continued unavailability of Course 3.
- The actual public/app browser journey passes 24 accessibility/layout states at
  320 and 1280 pixels in light/dark themes. Following a program installs nothing;
  viewing either course does not enroll it. Explicit Start installs only that course,
  reload preserves the plan, and Stop following preserves both started courses.
- Browser screenshots of the updated count, overview and lesson were inspected.
  The harness permits its resolved dependency directory so linked local font packages
  load; this does not alter application behavior or production serving rules.

The PR records final full-regression and hosted outcomes for its exact head. The
local environment requires the installed `tsx` Node loader in place of the CLI's
unavailable IPC socket; that launcher adaptation does not omit commands or assertions.

## Authenticated baseline and publication

The production catalog's detached signature verifies against the app-pinned key.
All 22 referenced package digests pass and match the current app packages exactly.
Case Reading is absent from that baseline. A bounded Node HTTPS request with
redirects rejected returned 404 for the proposed immutable revision-1 URL. A separate
Python request returned 403, which was not treated as absence or used to authorize
an upload. The normal publication lane must perform its own fresh verification.

Merge/publication retain full regression, production-key verification, authenticated
prior release, identity/revision compatibility, immutable-object verification, fresh
main and baseline checks, catalog-last upload and authoritative catalog/signature
readback. This preparation document does not itself establish a deployment. Live
catalog/package verification is recorded with the resulting workflow on the PR.

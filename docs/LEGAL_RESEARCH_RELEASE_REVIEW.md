# Legal Research and Citation — release candidate

Prepared November 5, 2026 against app main
`5c55c198809399358836cb4d57a723bc530f7586`. **Draft; not merged or published.**
The candidate adds Legal Research and Citation to the LSAT-first 25-course J.D.
Preparation pathway, showing four available and 21 planned. New plans follow that
order; existing saved 24-course plans remain intact as custom plans. Following the program still enrolls no courses;
viewing each overview also leaves enrollment unchanged. Start course is explicit.

## Package and preservation

Revision 1 has four modules, eight lessons, 80 questions, 64 cards, 56 glossary
entries and four references. The original fictional research packet supports an
authority table, research log and self-assessed explanatory note. It is independent
preparation, without degree credit or automatic assessment of the portfolio prose.

Course SHA-256: `7324211b85de82cc66bb1f94fac0be9a9a27b0a40502c15b47696b2a59bfee36` (193,022 bytes).
Only description metadata differs from the separately validated private draft: it
removes the obsolete 'Third course' ordinal after LSAT became the first program
course. All other fields, including lessons, answer keys, IDs and revision, are
identical. The original validated digest remains in the historical evidence.
Candidate source catalog SHA-256: `203e8433210b95e83fc20a3c27c1b9599ded69c1864479669c31105309f4737b`.

All 25 pre-existing repository packages and catalog entries retain their exact bytes
and values. The sitemap preserves 33 URLs and adds the canonical course overview.
The private source candidate restores three previously supported builder lines for
calculator enum validation/output: without them a full rebuild drops LSAT's existing
calculator:none field. All four valid modes pass, six invalid values fail, and absent
metadata preserves output bytes. Both full builders now reproduce every prior package.
No learner engine, workflow, billing, signing-key or publication-control change is included.

## Executed integration checks

- Both complete source builders and the unchanged checker passed all 26 packages
  before the metadata-only edit; the final course was then rebuilt and rechecked.
  The checker, dependencies and other 25 packages are unchanged.
- Current app answer engine: 80 keys, 392 negative cases, 63 text variants and 40 partial/empty cases pass.
- Program model, pathway, rendered enrollment and existing Runner keyboard tests pass.
- TypeScript/production Vite build passes.
- Actual public/app navigation passes 40 accessibility/layout states at 320px and
  1280px in light/dark Chromium 153. All four course overviews and first lessons open;
  only explicit Start installs each course; reload preserves the saved plan; stopping
  the plan preserves the four started courses. Planned courses have no launch action.
- Representative public count, course overview and phone lesson screenshots were inspected.

The earlier full content/browser validation remains scoped to its original app pin;
this release slice verifies preserved instructional fields and the current integration
above. Targeted tests/build ran after integrating main 6428d4; main 5c55 changes
only a browser assertion, and the final browser run preserves that correction.
Hosted/full-regression results belong to the exact PR head and are not replaced by
local success. This is assistant review, not faculty or university approval.

## Verified release blockers

The production catalog signature and all 24 package hashes verify against the pinned
app key. Baseline catalog SHA-256:
`13315e2ea68091a982ac1bae0358725dddfadd8fee1abf64b83c906af0726ea1`.
Current main already contains three pending German revisions (A1 r4, A2/B1 r3) and
Japanese N5 r1 beyond this signed baseline. This candidate preserves those changes.
Its own additional package is Legal Research and Citation r1.

The unchanged publisher's local compatibility pass fails on 924 inherited vocabulary
lesson references in German A2. It fails before loading a signing key or writing
publication output. Existing [PR 146](https://github.com/Aziliz/erudior/pull/146)
addresses that issue; do not weaken the gate or revert language packages here.

Private source [run 42104620055](https://github.com/Aziliz/erudior-courses/actions/runs/42104620055),
attempt 2, was confirmed from GitHub's workflow annotation to be prevented from
starting by failed account payments or a spending limit. Account-owner action in
GitHub Billing & plans is needed, followed by a normal rerun. No billing changes
were made. Source PR 7 and this app PR remain draft.

Resolve both prerequisites and verify exact-head source/app checks before merging.
Then use the existing full regression, authenticated baseline, revision compatibility,
immutable-object, fresh-main/baseline, catalog-last upload and authoritative-readback
controls. This candidate does not establish a production release.

Merge integration also preserves the subsequent documentation-only main commit
`ef8fa47cb390c27ca4f0a67c9bdebce11f1a1582`; it changes no tested app/course bytes.

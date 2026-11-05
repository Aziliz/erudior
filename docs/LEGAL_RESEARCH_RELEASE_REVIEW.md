# Legal Research and Citation — release candidate

Prepared November 5, 2026 against app main
`b9a96edba067b3687e92bd46d40cdbec92060883`. **Draft; not merged or published.**
The candidate adds course 3 to the existing 24-course J.D. Preparation pathway,
showing 3 available and 21 planned. Following the program still enrolls no courses;
viewing each overview also leaves enrollment unchanged. Start course is explicit.

## Package and preservation

Revision 1 has four modules, eight lessons, 80 questions, 64 cards, 56 glossary
entries and four references. The original fictional research packet supports an
authority table, research log and self-assessed explanatory note. It is independent
preparation, without degree credit or automatic assessment of the portfolio prose.

Course SHA-256: `78b31a37bfe5402f6198cbbe53ed2af88395d8d5a2acc42dd9ee0826463d76fa` (193,030 bytes),
byte-identical to the separately validated private source draft. The source release
flag changes its output destination; it does not alter instructional content or keys.
Candidate source catalog SHA-256: `3e71d2828a674a118d46d28913d17ddfa4b870541ec5e57abb5e27b91e944324`.

All 25 pre-existing repository packages and catalog entries retain their exact bytes
and values. The sitemap preserves 33 URLs and adds the canonical course overview.
The private source candidate restores three previously supported builder lines for
calculator enum validation/output: without them a full rebuild drops LSAT's existing
calculator:none field. All four valid modes pass, six invalid values fail, and absent
metadata preserves output bytes. Both full builders now reproduce every prior package.
No learner engine, workflow, billing, signing-key or publication-control change is included.

## Executed integration checks

- Both complete source builders and the unchanged checker pass all 26 packages.
- Current app answer engine: 80 keys, 392 negative cases, 63 text variants and 40 partial/empty cases pass.
- Program model, pathway, rendered enrollment and existing Runner keyboard tests pass.
- TypeScript/production Vite build passes.
- Actual public/app navigation passes 32 accessibility/layout states at 320px and
  1280px in light/dark Chromium 153. All three course overviews and first lessons open;
  only explicit Start installs each course; reload preserves the saved plan; stopping
  the plan preserves the three started courses. Planned courses have no launch action.
- Representative public count, course overview and phone lesson screenshots were inspected.

The earlier full content/browser validation remains scoped to its original app pin;
this release slice verifies unchanged course bytes and the current integration above.
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

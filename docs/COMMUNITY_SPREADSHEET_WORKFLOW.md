# Community spreadsheet lifecycle

The existing community authoring path accepts the same lesson-linked spreadsheet
assignments as canonical courses. The Spreadsheet tab reuses the shared instructor
editor; the adapter changes only assignments, preserving original community
lesson blocks, metadata and all other content. Shared navigation guards prevent
app controls and browser Back/Forward from discarding dirty or pending work in
community and canonical course editors. Draft save, publication validation
and installation reject malformed, duplicate, oversized or dangling assignments
instead of silently dropping exercises. Existing courses without assignments stay
compatible.

Published exercises retain stable IDs and lesson links. Republishing cannot
remove or reassign an existing exercise. Each new community version remains
unreviewed until a reviewer inspects its complete starter, formulas, protection,
criteria and tolerance, explicitly acknowledges inspection, and approves that exact
version. Queue shortcuts use the same inspection flow; community publication
does not grant official signing or licensing authority.

Publication creates immutable R2 snapshots with conditional writes before a D1
compare-and-swap exposes a new version. Concurrent edits/publications cannot
silently replace a snapshot. Partial failures retain recoverable orphan snapshots;
identical retries can reuse them and different content uses a free version slot.
Version gaps are valid. Permission and moderation conditions are checked at the
commit boundary, not only at request start.

Installation validates before downloading embedded images, preserves starter
workbooks, protection, criteria and tolerance, and retains existing community
provenance/review metadata. The learner uses the canonical grading and isolated
draft workflow.

## Verification

- Root focused suites cover format limits, author/save/reopen/publish UI, portable
  install and grading equivalence, and deterministic publication failures/races.
- `cd worker && npm test` starts an isolated local-only Wrangler/D1/R2 environment,
  applies local migrations and tests actual API workflows. No production secrets,
  state or endpoints are used. The deployment workflow runs this before deploying.
- `worker/node_modules/.bin/tsc -p worker` verifies the shared worker-neutral type
  boundary; production root builds and full regressions remain required after merge.

The public Spreadsheet simulator capability remains In Progress. This work adds
community parity, not complete spreadsheet formula/automation support, independent
accessibility certification, or a new account/promotion/licensing system.

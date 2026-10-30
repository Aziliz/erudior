# Eight-subject community authoring acceptance demo

This is a **synthetic software acceptance demo**, not eight new kindergarten courses. It does not replace curriculum review, teaching, real learner pilots, accessibility certification, or official publication approval.

## Run locally

1. Install the repository's locked dependencies with `npm ci`.
2. Install the matching browser with `npx playwright install chromium`.
3. Run `npm run test:community-k-demo-browser`.
4. Review `test-results/community-k-demo-browser/result.json` and every retained screenshot. A failing assertion produces a screenshot and structured failure diagnostics.

For interactive inspection, run `npm run dev` and open `/tests/fixtures/community-k-demo.html?mode=legacy` or `?mode=canonical`. The acceptance runner supplies the isolated `/synthetic-api` build configuration; interactive use must likewise set `VITE_COMMUNITY_API=/synthetic-api` before starting Vite. These fixtures are development files, not production navigation or bundled course catalog entries.

## What is exercised

Eight small original fixtures cover math, language arts, science, social studies, art, music, physical education and health. Each has stable modules, lessons, practice questions, notecards, glossary and provenance. Resource coverage includes math models, reading and comprehension, phonics/read-aloud, an embedded silent test recording, writing and rubrics, paper-only observation labs, and fictional activity logging.

The actual community creation list and legacy/canonical editors are used. “New course” creates the selected **seed template** in a local mock server; the test then edits, saves, reopens, publishes immutable mock versions and installs them through the production community download converter. This is not a claim that every content item was manually typed into the editor or published to a live service.

The same learner lesson component renders both the normalized synthetic source and installed community copy. Content and resource identities are compared while runtime course/bank namespacing, publication version and unreviewed community provenance are verified separately. Read-only current official course samples also pass through the same normalization and portable-snapshot validators in the unit suite. Parity means supported runtime content behavior, **not equivalent approval, trusted signatures, authorship, enrollment or credit**.

## Isolation and recovery

No real account, credentials, terms acceptance, remote audio, curriculum upload or production API is used. Synthetic state is scoped to the test origin, browser context and editor mode; explicit reset clears only that fixture's state. Audio is inert until a person selects playback. Save/publication failures, retry, repeated actions, existing immutable versions, reload, reset cancellation and preservation of other course drafts are covered. The browser runner blocks external requests.

The single roadmap capability remains separate from official-course adoption, Content Studio and reviewed community-to-official promotion. Existing security, signing, licensing and publication checks remain mandatory and unchanged.

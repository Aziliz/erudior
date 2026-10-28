# Community / Official course parity status

This project currently has two persisted authoring representations:
- `erudior-community` version 1: editor document containing structured lesson blocks and inline questions.
- `examiner-course` version 1: runtime and official content document.

**Do not misrepresent these as the same JSON format.** Both can be played by the official engine after conversion, but a lossless two-way format is not implemented. The migration to a single canonical authoring schema must be versioned and tested against existing community drafts.

## Current implementation
- Community course conversion to official runtime format: `toCourse` in `src/lib/communityFormat.ts`.
- Advanced Markdown fences in new `source` blocks are preserved for the official rendering pipeline; `checkDoc` still enforces draft/publish limits.
- Author-facing module controls, including lesson reassignment and inline delete confirmation.
- The reviewer-gated conversion helper `prepareOfficialPromotion` in `src/lib/communityPromotion.ts` prepares a normal runtime course **without publishing** and requires a published, reviewed version, an explicit official ID and complete content.
- Community authors remain **not reviewed** by default; explicit review/promotion authorization is necessary.
- Tests: `tests/community.test.mts`, `tests/community-modules.test.mts`, `tests/community-promotion.test.mts`.
- CI: `.github/workflows/verify-community.yml` on pull requests.

## Known gaps before merge/promotion
1. True schema convergence and reverse conversion of official files to editable community blocks.
2. Official-only course metadata and resources (including `audio`, `texts`, `work`, specialized question types and media) need a complete mapping and preservation tests.
3. Promotion needs an administrator-only, server-side action, verified immutable review version and image embedding. The helper deliberately does not grant permission or publish.
4. End-to-end browser authoring: add/move/delete modules, reopen persisted draft, preview, publish, and install course.
5. Exact course content / image rights review and accessibility testing.
6. GitHub Actions tests and build must pass; no verified passing run was available when this document was written.

## Definition of done
An existing official course's supported content imports into the community editor without data loss; it can be saved, reopened, validated and converted back with semantic parity. A reviewed published community version can be promoted by an authorized administrator with all dependencies and images preserved. The promoted course is independently verified and published via the official release workflow, not by client-controlled status fields.

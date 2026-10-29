# Community authoring status

PR #1 has been revalidated against the canonical engine and newer activity editors. Its old source-block, JSON-resource, promotion-helper and worker-type changes are superseded by the validated implementations already on main; they must not replace the current validators or authorization boundaries.

## Module and lesson controls

- Legacy drafts can add modules, assign lessons explicitly, reorder modules without changing implicit lesson membership, and delete a module after inline confirmation. Lessons survive module deletion; the confirmation identifies deleted module quiz questions.
- Module deletion is blocked while assessed work or reading-question references depend on it. Lesson deletion is blocked while vocabulary, reader questions, assessed work links or engine activities depend on it.
- Stable IDs are resolved against the latest document. Add operations enforce limits and avoid module/lesson ID collisions; repeated stale operations do not target another item.
- Canonical authoring uses the shared full-course editor, preserving the complete payload. Its module and lesson controls use exact-target inline confirmation and retain typed resource guards.
- The existing serialized save/retry and navigation protection remain in force. Publishing creates a new, not-reviewed community version; editing or deleting draft structure does not rewrite already published versions.

## Distinct work

The canonical course model, asset validation, server publication and immutable official promotion candidate are implemented separately on main. Community publication does not grant official approval. Official publication still requires its authorized signing/release process.

The comprehensive community creation guide/test capability, visual resource-tool audit and eight-subject demo remain separate roadmap items. This module-control completion does not claim those broader workflows are finished.

Validation: `tests/community-modules.test.mts`, `tests/course-structure-controls.test.mts`, and the synthetic browser workflow in `scripts/community-controls-browser.mjs`. The browser fixture does not create production accounts, accept real agreements or publish real courses.

# Interactive model narration

Hydrated math manipulatives already expose a direct, polite live-region description of their current state. Lesson read-aloud now reads that description once instead of walking the picture, toolbar labels, readout and duplicate status. Captions outside the model and surrounding authored teaching text remain in the narrative. An absent, hidden or empty description falls back to the previous traversal behavior.

This is a narrowly scoped change in `speechText`, not a global ban on reading buttons. Phonics, ordinary figures, images, links, mathematics, explicit recording keys and other authored content keep their behavior. The manipulative renderer, DOM controls, accessible names, live announcements, keyboard operations, grading, model state and course content are unchanged. Reading reflects the state when the narration queue is collected; subsequent interaction can be narrated by starting it again, without silently changing an active queue.

## Tests

```
node --import tsx --test tests/model-narration.test.mts
node --import tsx tests/readaloud.test.mts
node --import tsx tests/manip.test.mts
node scripts/model-narration-browser.mjs
```

Eight focused test groups cover all six model kinds, current versus initial state, unchanged controls/live-region semantics, caption/math/prose preservation, hidden and empty status handling, recording replacement and static prerender fallback. The browser regression uses the real manipulative and ReadAloudBar with generic fixtures at 320px/dark and 1280px/light. It checks model-state narration exactly once, captions, keyboard state changes and reset, plus twelve accessibility audits. It uses the same `figure.manip` layout class as production. The initial wrapper omitted this class and produced a spurious narrow-width coin overflow; the wrapper was corrected, not the product styling or assertion.

These local tests passed against the unchanged, blob-verified model/reader dependencies and patched `readAloud.ts` from the existing public validation workspace. They are not a new full checkout/build of the guided-practice PR. Complete-head hosted build/regression outcomes must be recorded separately.

The browser voice is instrumented, not audible. Neither the tests nor their screenshots establish pronunciation, screen-reader interoperability, physical Android behavior, complete-App persistence, release approval or a new installer. Public fixtures contain no private curriculum or learner records. Existing workflow stages and permissions remain intact; new focused checks and evidence are appended.

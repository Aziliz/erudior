# Teacher-paced and student-paced interactive presentations

## Whole-capability acceptance

Original roadmap `8d90b78f` includes slides/presentations from verified content, teacher-paced and student-paced lessons, video questions and reusable resources. Consolidation `077a9952` moved instructional capabilities into the Lesson Engine. This implements the existing single interactive-presentation row, not the separate worksheet/lab/project generator scope and not a replacement for game presenter mode.

- Supervising adults assemble, reorder, review, save, reopen, duplicate, import and export reusable decks from installed course resources. Exact source content and revision are rechecked before delivery. Missing/changed/unsupported material is explicit, not silently replaced.
- Content slides and choice questions retain source provenance. Optional teacher-reviewed direct HTTPS video questions require a text transcript and timestamp; playback is opt-in and the transcript remains usable when offline or media fails. No embedded arbitrary HTML, iframe, script or autoplay.
- Local teacher/student preview works without remote services. Multi-device teacher-paced delivery follows host slide/reveal controls; student-paced delivery allows each learner to advance independently. Answers stay on the server until the appropriate reveal/submission.
- Rooms retain only ephemeral nickname/session state, expose each learner's own response and anonymous aggregate information, and do not change academic evidence, grades, mastery or credentials. Reconnect, stale/replaced sockets, repeated commands and acknowledged closure are tested.
- Durable adult deck storage uses existing cross-platform named-state concurrency and encrypted backup. Revision conflicts fail rather than overwriting newer work; dirty navigation and failed-save recovery preserve drafts.
- Keyboard, responsive 320/1280 layouts, light/dark and accessibility checks cover authoring and playback, including video alternatives, repeated/interrupted flows and reset.
- All exact-head applicable regression/build/browser/API/native gates precede merge. Post-merge regression, native, integrity, separate website/API delivery and signed-course readback precede roadmap Done. Desktop installer packaging remains deferred; no version/tag or new course content is part of this feature.

## Architecture

`presentations.ts` is a strict, bounded pure model with source-safe adapters and validation. `presentationStore.ts` is an authorized revision-checked library over existing named-state storage. Adult authoring and playback are separate screens. A presentation-specific protocol delegates within the existing live Durable Object binding, preserving quiz behavior and existing room lifetime/rate limits without a new binding migration. The server owns pacing, submission and reveal transitions; learner payloads omit unrevealed answers and other learners' identities.

Implementation and validation evidence will be recorded before delivery; this checklist alone is not a pass.

## Use

Open the unlocked Parent or Teacher area → **Interactive presentations**. Create a presentation, choose installed resources, arrange slides and save. Changed source revisions must be replaced rather than silently reused. Export/import creates reusable adult teaching resources; imported copies must be reviewed and source-compatible before delivery. Save conflicts leave your draft intact: export/copy as appropriate, or discard and reload the current library.

For a video question, select a source question's **Video question settings**, add a direct public HTTPS video URL, transcript and pause time, and explicitly acknowledge review. Video-provider pages/iframe embeds are not supported. The transcript path is always available and loading the external video requires learner consent. Playback failure does not block the question.

Local previews support both pacing modes without network access. **Open live presentation** creates an ephemeral multi-device room. Share its learner link/code, select teacher or student pacing, and start. Teacher-paced reveal and advancement are host-controlled; self-paced learners submit and advance independently. Close waits for server acknowledgement. Explicit local forget is labeled unconfirmed and leaves the room to expire; it is not a claim that server state was deleted.

## Verification

Focused model/store/backup/authoring/playback tests run via `node --import tsx tests/presentations.test.mts` and the `presentation-*.test.mts` files. `npm test` includes these in the unweakened full aggregate. `npm run test:presentations-browser` covers reusable authoring and both local playback modes, video transcript alternative, keyboard, 320/1280 light/dark, overflow and axe. `npm test --prefix worker` includes real presentation WebSocket integration alongside existing API/quiz tests. Frontend build and worker typecheck are mandatory, and native named-state CI validates the new explicit allowlist entry. A local sandbox launch failure is not a browser or aggregate pass; the exact candidate's CI results remain decisive.

# LSAT and bar course handoff

Updated November 5, 2026 (America/Denver). User request: take over both courses, publish LSAT if complete and place it first in J.D. Preparation.

## LSAT — Done

`lsat-180-mastery`, revision 1, is complete within the documented course review and already signed/published. It contains 12 modules, 58 lessons, 712 original bank questions, 352 cards, 250 glossary terms and 45 references. Preserve its stable IDs, published bytes and raw-versus-official-score distinctions. The formative course is not an empirically calibrated score predictor.

`docs/LSAT_RELEASE_REVIEW.md` records verified publication and the latest authenticated package download. Source is in private `Aziliz/erudior-courses`, `content/math/lsat-180/`; released app package is `samples/math/lsat-180-mastery.json`. SHA-256: `5bfd58b7ae7eea80eadde241b2a26e1f04d975427a08cfd97801eee62b33edd9`.

The requested J.D. program version 2 begins LSAT → U.S. Legal System → Case Reading → Legal Research, retaining the remaining law sequence. There are 25 courses in the same three stages. LSAT's twelve module names match its actual released outline. Following the program only saves the plan; opening an overview does not enroll or install a course. Existing saved orders and progress are not rewritten. Learners can edit an earlier saved plan to include LSAT or stop following and follow the current program; stopping a plan preserves course enrollments and progress.

Focused program, learning-pathway, enrollment UI, current keyboard controls, LSAT package checks and the production build pass locally. The local preview returned a Vite host-allowlist rejection for the managed preview hostname, so no local browser acceptance is claimed. The browser acceptance script now covers LSAT overview/explicit start/first lesson and retains U.S. Legal System and Case Reading checks, reload/removal, planned-course controls, keyboard and responsive/accessibility audits.

Implementation commit: `42b3e125301fea4468f690f796d8ccbc0bf3f98b`, built on concurrent app head `79928035bdd40b0c1adba52a8ee28115277a915b`. All six saved source blobs match the locally tested files. Completed release and validation outcomes follow below. The live LSAT overview itself was verified at `https://app.erudior.com/lsat-180-mastery` with all 58 lessons, 712 questions and 352 cards.

### Completed publication and program acceptance

Website run `42107518885`, job `127526420231`, passed its build, prerender, startup/browser checks and Cloudflare deployment. A live browser read of `https://erudior.com/programs` confirms 25 courses, with LSAT first and available in Stage 1, followed by U.S. Legal System and Case Reading. The live layout was visually inspected.

The first program browser run reached LSAT's first lesson, then failed a new test assumption that desktop installation must create an explicit one-item `progress.enrolled` array. The fixture supports installed-course enrollment without that explicit array. Commit `5c55c198809399358836cb4d57a723bc530f7586` corrects the assertion to compare enrollment records before/after opening the next overview and verify that only LSAT remains installed. No application behavior or release gate changed.

Corrected program run `42108450049`, job `127529411073`, passed focused tests, production build and all **32** browser states at 320/1280 pixels in light/dark themes. Coverage includes keyboard outlines, LSAT-first follow, explicit start of LSAT and both law courses, first lessons, persistence/removal, planned-course launch prevention and configured accessibility/overflow audits. `results.json` reports no page errors. Artifact `13451534750` was downloaded and independently SHA-256 verified: `5b65832844fbed1f881223c92be5ca63dc8348b11c903f792dd005ae8155c0fa`. Desktop program and phone LSAT overview/lesson screenshots were visually inspected. This is program-integration coverage, not a new academic or question-by-question course review.

Full regression/identity run `42107518928` passed: job `127526142598` completed the full regression suite and production build; job `127526142864` passed product identity. These checks cover implementation commit `42b3e125`; subsequent changes are documentation and the browser fixture correction, with production application/course bytes unchanged.

## U.S. Bar Exam Preparation — In Progress

Continue private branch `course/bar-exam-foundations-20261103`, draft PR [#5](https://github.com/Aziliz/erudior-courses/pull/5). Current Torts review checkpoint: `e71362c4c83a85202b9bfc9ef5082612e2030d9f`, following authoring `238fb563f5b8248417c0434fc08b522067505c08`. Course ID `us-bar-exam-preparation`; source `content/math/bar-exam`; `released:false`.

Four authored cores remain foundations, federal civil procedure, contracts and sales, and torts. Totals are unchanged: 45 lessons, 555 questions (536 single-answer, 19 multiple-response), 360 cards, 319 terms, 38 references, and five manual case files. The 180 module-review selections reuse bank items. Twelve other modules remain planned; this is not a completed bar course.

The **Torts assistant content-validation slice is complete**. All 195 keys were re-solved with answer fields hidden and recorded individually; 30 examples, 120 cards, 93 definitions, nine references, and Cedar's model were reviewed. Five stems were clarified, 129 distractors across 43 items improved, two teaching definitions synchronized, and one model citation corrected. Correct choices, IDs, topic/lesson links, and review flags are unchanged. Correct single choices are strictly longest in 62/180 items, down from 83/180; the bank remains formative, not psychometrically calibrated.

Browser review found cramped text tables. Ten were converted to stacked sections across seven references; compact numerical tables remain, with shortened allocation headers. There are 48 unique reading states plus two final table follow-ups, and 73 graded UI states (60 correct, 13 correctly rejected), using desktop/light and narrow/dark views as documented. The revised glossary definition opens and Close dismisses it; Escape did not dismiss it and remains an app-acceptance issue. This is unchanged production-component review, not full-App import/navigation, module completion, cards, saved progress/reload, native acceptance, or a formal accessibility pass.

Local checks pass: deterministic targeted build, unchanged production course checker, field-preservation preflight, strict source import, canonical validation/roundtrip, and exhaustive grading of 8,880 selection subsets plus 555 unanswered cases and four malformed controls. Thirteen numerical questions and the Cedar allocation were independently checked. The model memo is 694 words and client update 119. Its stipulated 90,000 gross loss yields 45,000 Market, 27,000 Maker, and 18,000 plaintiff-retained loss; these assumptions do not decide actual fault or settlement.

The existing **24 MiB local-source acquisition policy** supports this 1,231,449-byte draft. The separate **900 KiB default** route still rejects it as expected. No production limit, validator, shared builder, app source, workflow, or signing control changed. Community transport and publication acceptance are not claimed.

App pin: `ef8fa47cb390c27ca4f0a67c9bdebce11f1a1582`. Final draft runtime SHA-256: `268fabd0dbfc199e91a27931543e0679ce069335ca60513ccaa7e6f9ddb20c1b`. All 31 saved blobs match local bytes; 5,157 other repository blobs are unchanged, with no deletions or changes outside this course. Historical review evidence remains bound to its original package identities.

Read private `PROGRESS.md`, `OUTLINE.md`, `TORTS-COVERAGE.md`, `RESEARCH-TORTS.md`, `validation/REVIEW-TORTS.md`, the answer ledger, and the review source/runtime/browser manifests. Civil procedure, contracts, and torts remain In Progress for documented depth and qualified independent review. Full learner acceptance is still open.

Next slice: **author the complete Real Property core**, then perform its separate detailed validation slice. Preserve earlier identities and backlogs. Keep this bar course unpublished and outside the J.D. program until its intended scope and release acceptance are complete. LSAT remains separately published and first in that program.

Remote [Check courses run 42131840435](https://github.com/Aziliz/erudior-courses/actions/runs/42131840435) failed for this review checkpoint. Job `127610113009` reports no steps; its log endpoint returns 404 BlobNotFound. The immediate cause is unconfirmed. Do not infer remote CI success from local results or bypass controls.

## Concurrent work and publication

Other chats are editing JD course content and the app. Refresh both repository heads and preserve their changes. Never run a wholesale course sync from a lagging private branch: it can remove newer packages/catalog entries. This change leaves all course packages and the catalog unchanged.

The independent website lane deploys the new program definition. Recent signed-course runs fail on German A2 carried-vocabulary validation; the existing published LSAT remains available. App PR #146 contains a separate proposed repair and was not merged or altered by this takeover. Preserve normal regression, signing, immutable-object and catalog-readback controls.

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

Continue the existing private source branch `course/bar-exam-foundations-20261103`, draft PR [#5](https://github.com/Aziliz/erudior-courses/pull/5). The Contracts and Sales validation checkpoint is `448945a781f08f329e1a8d2650a4c44478cce160`. Course ID `us-bar-exam-preparation`; source `content/math/bar-exam`; `released:false`.

Three authored cores: foundations, federal civil procedure, contracts and sales. Totals remain 30 lessons, 360 questions, 240 cards, 226 glossary terms, 29 references and four manual case-file tasks with separate models. The 120 module-review selections reuse bank questions. Thirteen other modules remain planned; this is not a completed bar course.

The Contracts and Sales assistant validation is complete for lessons 20–30: 22 worked examples, 132 questions and alternatives, 88 cards, 103 terms, nine references, and the Harbor Lantern file/model with both variations. Fifteen question entries were clarified or strengthened without changing identities, answer positions, lesson links, or review selections. Timing and installment qualifications were clarified in teaching materials. The private review records exact corrections and all 132 individual answer rationales.

The unchanged targeted builder, production course checker, strict import, canonical roundtrip, and all 5,760 grading subsets pass locally. Production components passed 40 desktop/narrow reading states and 35 answer/feedback states, plus glossary interactions. These are isolated component checks, not full-App learner acceptance or independent academic review. Full import/navigation/progress, card interaction, and native-device testing remain outstanding. App helpers are pinned to `ef8fa47cb390c27ca4f0a67c9bdebce11f1a1582`; corrected private runtime SHA-256 is `8c4a029decda15869ebe3eb06c6ed17cfd55d38fe5344581a2d117f91d66d25c`.

Next slice: **author Torts through its complete core sequence**, followed by its separate validation slice. Read current private `PROGRESS.md`, `OUTLINE.md`, `CONTRACTS-COVERAGE.md`, and `validation/REVIEW-CONTRACTS.md` before editing. Civil procedure and contracts remain In Progress with depth work and independent qualified review open.

Remote [Check courses run 42114296294](https://github.com/Aziliz/erudior-courses/actions/runs/42114296294) belongs to the validation commit; its latest observed status is recorded on the PR. Do not infer remote CI success from local checks. The prior run failed without reported job steps or an available log, and its immediate cause was unconfirmed. Keep the bar draft unpublished until its intended scope and release acceptance are complete.

## Concurrent work and publication

Other chats are editing JD course content and the app. Refresh both repository heads and preserve their changes. Never run a wholesale course sync from a lagging private branch: it can remove newer packages/catalog entries. This change leaves all course packages and the catalog unchanged.

The independent website lane deploys the new program definition. Recent signed-course runs fail on German A2 carried-vocabulary validation; the existing published LSAT remains available. App PR #146 contains a separate proposed repair and was not merged or altered by this takeover. Preserve normal regression, signing, immutable-object and catalog-readback controls.

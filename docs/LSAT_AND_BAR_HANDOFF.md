# LSAT and bar course handoff

Updated November 6, 2026 (America/Denver). User request: take over both courses, publish LSAT if complete and place it first in J.D. Preparation.

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

Continue private branch `course/bar-exam-foundations-20261103`, draft PR [#5](https://github.com/Aziliz/erudior-courses/pull/5). Constitutional Law authoring checkpoint: `c8a1c8887e06f5076e6ce3bcc611448af7f7a2f7`, following Evidence review checkpoint `5853e3e0844efd83bcd2a3d1aa61cbe3e3d16f1d`. Course `us-bar-exam-preparation`, source `content/math/bar-exam`, remains `released:false`.

The **complete Constitutional Law core authoring slice is finished**. Module 7 adds 24 substantive lessons, 48 worked examples, 312 original questions (288 single, 24 exactly-two multiple), 192 cards, 144 glossary entries, sixteen references and Copper Square's original seven-rule/seven-exhibit case. Its separate 828-word model includes a seven-row matrix and a 30-point manual rubric. The assignment withholds the calculated refund and earliest decision date; a separate miniature calculation appears in the lesson.

Seven cores now total **106 lessons, 1,348 original bank questions (1,268 single, 80 multiple), 848 cards, 685 terms, 77 references and eight manual case files**. The 424 module-review selections reuse bank questions; the separate twelve-item baseline is unchanged. Nine further modules remain Planned without empty runtime modules. Earlier content, stable IDs, review records and depth/independent-review backlogs remain intact.

Research records 119 successful primary-source/official-page retrievals with original-byte identities, plus five resolved initial Cornell reporter-URL failures. The NCBE document identifies November 4, 2026 despite its older URL filename. Current 2026 holdings are incorporated with their actual scope and procedural limits. CONSTITUTIONAL-COVERAGE.md and RESEARCH-CONSTITUTIONAL.md record the map and research decisions. Availability and selected authoring reads are not a substitute for full semantic or independent legal review.

Local structure, identity, glossary/reference links, counts, answer-position distributions, retrieval-card synchronization, independent arithmetic/date checks, preservation and deterministic generation pass. Each lesson has three correct single answers in each position; all six multiple-response pairs occur four times. The length diagnostic finds 135 strictly longest correct choices among 288 singles; this is a review signal, not calibration. The complete detailed content/distractor review remains next.

The unchanged pinned production course checker, field-preservation preflight, strict local-source importer, canonical validation/roundtrip, normalizer and grader pass. All **21,568** selection subsets, 1,348 unanswered cases and four malformed controls were checked. The existing 24 MiB source path accepts the 2,767,511-byte draft (2,558,557 compact bytes); the separate default 900 KiB route still rejects it. No app, production limits, validators, shared builder, workflow or signing control changed. No Constitutional Law browser acceptance is claimed.

App pin: `ef8fa47cb390c27ca4f0a67c9bdebce11f1a1582`. Runtime SHA-256: `2db5c7ff7c5d277891cf6f4c90bc44c4b0c2877b7c9f0283b7acfd710c413b3a`. All **57** changed/new saved blobs match local bytes; all **5,297** untouched repository blobs remain unchanged, including 27 historical validation files not materialized locally. Fifty-three new files bring the private repository to 5,354 blobs. No deletions or edits outside this course. The new m07-prefixed lesson filenames append after the original 82 under the unchanged builder. Generated output stays in the draft lane.

**Next slice: validate the entire Constitutional Law core.** Independently re-solve all 312 questions, audit all lessons, examples, explanations/distractors, cards, definitions, sixteen references, and Copper Square's assignment/model/rubric. Renew current authorities and check cross-core consistency. Preserve stable identities and document substantive corrections. Then repeat technical controls and perform scoped production-component reading/feedback/glossary review at desktop and narrow widths, including the long source index and model matrix. Full-App acquisition/navigation, saved progress, flashcard controls, native acceptance and writing evaluation remain separate work.

Read private PROGRESS.md, OUTLINE.md, CONSTITUTIONAL-COVERAGE.md, RESEARCH-CONSTITUTIONAL.md, validation/AUTHORING-CONSTITUTIONAL.md, the authoring source/runtime results, primary-source record, lesson map, preservation baseline and final manifest. Use check-constitutional.py for this checkpoint and the unchanged check-evidence-runtime.mts with an explicit new report path. Do not overwrite historical reports by rerunning older helpers against new counts.

Keep the bar course private and outside the J.D. pathway until intended scope and release acceptance are complete. Assistant authoring and technical checks are not qualified independent academic review, comprehensive bar coverage or a calibrated exam simulation. LSAT remains separately published and first in the 25-course program.

Remote CI: [Check courses run 42191496325](https://github.com/Aziliz/erudior-courses/actions/runs/42191496325) failed on authoring commit `c8a1c888`, four seconds after creation. Job 127804363811 has no steps; its log download returns 404 BlobNotFound. The immediate cause remains unconfirmed, as in the preceding checks. Local passes do not imply remote CI success, and no controls were bypassed.

## Concurrent work and publication

Other chats are editing JD course content and the app. Refresh both repository heads and preserve their changes. Never run a wholesale course sync from a lagging private branch: it can remove newer packages/catalog entries. This change leaves all course packages and the catalog unchanged.

The independent website lane deploys the new program definition. Recent signed-course runs fail on German A2 carried-vocabulary validation; the existing published LSAT remains available. App PR #146 contains a separate proposed repair and was not merged or altered by this takeover. Preserve normal regression, signing, immutable-object and catalog-readback controls.

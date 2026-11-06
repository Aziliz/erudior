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

Continue private branch `course/bar-exam-foundations-20261103`, draft PR [#5](https://github.com/Aziliz/erudior-courses/pull/5). Evidence authoring checkpoint: `f398980c683f5f86f17a32b40491d3111a8dd4df`, following Real Property review `458fa3965bc4a35af666cec8aa35163dc01dd4b7`. Course `us-bar-exam-preparation`, source `content/math/bar-exam`, remains `released:false`.

The **complete Evidence core authoring slice is finished**. Six cores now contain 82 lessons, 1,036 original questions (980 single-answer, 56 multiple-response), 656 cards, 541 terms, 61 references and seven manual case files. The 328 module-review selections reuse bank items; the separate twelve-item baseline is unchanged. Ten further modules remain planned.

Evidence adds nineteen lessons (64–82), 38 worked examples, 247 questions (228 single, nineteen exactly-two-response), 152 cards, 114 definitions and thirteen references. It covers relevance/procedure, policy exclusions, character/habit, witnesses and impeachment, opinions, hearsay/exceptions, confrontation, privileges, authentication and contents proof. All lessons have substantive instruction, examples, guided practice, common mistakes and key points. The complete original Juniper Cold Storage file supplies seven fictional rules and seven exhibits, a separate 790-word model and a 30-point manual rubric. Unique gross is $27,000, corrected net is $25,000, and the draft overstatement is $8,500. Admission remains separate from liability.

Fourteen primary-source downloads succeeded with raw-byte identities. The actual November 4, 2026 NCBE scope controls over its older URL filename. The current FRE compilation and scheduled December 1, 2026 Rule 801(d)(1)(A) amendment are distinguished; affected questions specify November 2026 or supply the amended rule. Current 2023/2024 changes are incorporated, and withdrawn Rule 609 proposals are not taught as law. Before release, recheck operative rules and intended-exam instructions. Sources, boundaries and deeper work are recorded in EVIDENCE-COVERAGE.md and RESEARCH-EVIDENCE.md.

Local source checks and the unchanged production course checker, field-preservation preflight, strict local-source importer, canonical validation/roundtrip, normalizer and grader pass. All 16,576 selection subsets, 1,036 unanswered cases and four malformed controls were checked. The existing 24 MiB local-source acquisition policy accepts the 2,095,335-byte draft (1,934,143 compact bytes); the separate 900 KiB default route still rejects it. No app source, production limits, validators, shared builder, workflows or signing controls changed.

App pin: `ef8fa47cb390c27ca4f0a67c9bdebce11f1a1582`. Runtime SHA-256: `73cf2217c534a7f6f14b33e7cee378fc43a2685a82d2a37e0a744ad8b754b9b9`. All 49 saved blobs match local bytes; all 5,239 untouched repository blobs remain unchanged, including 27 historical validation files not materialized locally. No deletions or private edits outside this course. The generated runtime stays in the draft build lane.

**Next slice: complete Evidence validation**, including independent re-solving of all 247 keys, distractor/explanation review, 38 worked outcomes, cards/definitions/references, renewed source checks, the Juniper model/rubric and learner rendering. The 140/228 strictly-longest-correct-choice diagnostic needs attention; balanced answer positions do not establish item quality or calibration. No detailed semantic review or browser acceptance is claimed for Evidence yet.

Earlier Civil Procedure, Contracts, Torts and Real Property review reports retain their original source/runtime identities and documented depth/independent-review backlogs. Real Property's prior assistant content and limited production-component browser review are preserved; they do not validate the new Evidence package. The glossary Escape-dismissal issue remains open. Full-App acquisition/navigation, flashcard controls, saved progress, native-device acceptance and learner writing remain separate acceptance work.

After Evidence validation, author the complete **Constitutional Law core**. Read private PROGRESS.md, OUTLINE.md, EVIDENCE-COVERAGE.md, RESEARCH-EVIDENCE.md, validation/AUTHORING-EVIDENCE.md and the source/runtime/primary-source manifests. Keep the bar course private and outside the J.D. pathway until intended scope and release acceptance are complete. Assistant review is not qualified independent academic review or a calibrated exam simulation. LSAT remains separately published and first in that program.

Remote [Check courses run 42172522108](https://github.com/Aziliz/erudior-courses/actions/runs/42172522108) failed on authoring commit `f398980c`. Job `127743408559` reports no steps; logs return 404 BlobNotFound. Its check-run exposes two annotations but no summary; the connector does not support the annotations endpoint. The immediate cause remains unconfirmed. Local checks do not imply remote CI success, and no controls were bypassed.

## Concurrent work and publication

Other chats are editing JD course content and the app. Refresh both repository heads and preserve their changes. Never run a wholesale course sync from a lagging private branch: it can remove newer packages/catalog entries. This change leaves all course packages and the catalog unchanged.

The independent website lane deploys the new program definition. Recent signed-course runs fail on German A2 carried-vocabulary validation; the existing published LSAT remains available. App PR #146 contains a separate proposed repair and was not merged or altered by this takeover. Preserve normal regression, signing, immutable-object and catalog-readback controls.

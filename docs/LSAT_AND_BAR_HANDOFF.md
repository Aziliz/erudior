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

Continue private branch `course/bar-exam-foundations-20261103`, draft PR [#5](https://github.com/Aziliz/erudior-courses/pull/5). Real Property review checkpoint: `458fa3965bc4a35af666cec8aa35163dc01dd4b7`, following authoring `4933e94e751a6f1e2658c94a30eb2b51a71ef2a4`. Course `us-bar-exam-preparation`, source `content/math/bar-exam`, remains `released:false`.

The **Real Property assistant content-validation slice is complete**. Five cores contain 63 lessons, 789 original questions (752 single-answer, 37 multiple-response), 504 cards, 427 terms, 48 references and six manual case files. The 252 module-review selections reuse bank items; the separate twelve-item baseline is unchanged. Eleven further modules remain planned.

All eighteen Real Property lessons, 234 keys and distractors, 36 examples, 144 cards, 108 definitions, ten references and the Alder Court model/rubric were reviewed. The review clarified fifteen stems, replaced 241 weak distractors across 123 changed questions, synchronized four cards and clarified five teaching/source statements. It also removed duplicate titles from fifteen lessons and ten references. All IDs, correct-choice text, keys, topic/lesson links and module-review membership remain unchanged. The 234-item answer ledger has per-item reasoning and final question hashes. Strictly longest correct choices fell from 82 to 44 of 216 singles; this is a diagnostic, not empirical calibration.

The Alder model is 745 words within its 700–1,000-word assignment and uses a 30-point manual rubric. Eleven numerical keys were recalculated. Buyer cash is $73,800, seller net $139,200 and actual cash sources/uses $361,800. The separate foreclosure comparison leaves $20,000 surplus. The model requires documentary mortgage release arrangements, lawful resolution of the valid tenancy, timely cure/objection and a conditional recommendation; supplied fictional rules are not a real closing opinion.

All eighteen primary sources were renewed with unchanged raw bytes. NY §235-b's tenant-misconduct qualification and CACI 4902's secondary easement/maintenance subject are now stated more precisely. The downloaded November 4, 2026 NCBE scope controls over its stale URL/index labels. State examples remain labeled local examples; PROPERTY-COVERAGE.md preserves concrete depth gaps.

Local source checks and the unchanged production course checker, field-preservation preflight, strict local-source importer, canonical validation/roundtrip, normalizer and grader pass. All 12,624 selection subsets, 789 unanswered cases and four malformed controls were checked. The existing 24 MiB local-source acquisition policy accepts the 1,628,183-byte draft (1,504,835 compact bytes); the separate 900 KiB default route still rejects it. No app source, production limits, validators, shared builder, workflows or signing controls changed.

Browser review passed 56 reading states (all eighteen lessons and ten references at desktop/light and 320px iframe/dark) and 51 feedback states: one single per lesson, all eighteen multiples, partial/extra rejection for every pair, wrong/empty single rejection and a desktop Alder multiple. No horizontal overflow was observed. Glossary open and Close worked. The prior Escape-dismissal issue remains open. The review wrapper uses unchanged production components; full-App acquisition/navigation, flashcard controls, saved progress, native devices and learner writing were not accepted by these checks. A final ledger screenshot follow-up was interrupted by another shared preview and is not claimed.

App pin: `ef8fa47cb390c27ca4f0a67c9bdebce11f1a1582`. Final runtime SHA-256: `66fbb5968d3d39fbfabbcbb46ec1d2defeb15de2c1f3d66335cdcd3f88cb626f`. Browser payload SHA-256: `ea28b430adc2fad181bc7c66580d0cde2e1b86ea5f9b247c71795a0f08f1118f`; the sole later difference is review-status changelog metadata, with all rendered content identical. All 47 saved blobs match local bytes; all 5,196 untouched repository blobs remain unchanged, including 27 historical validation files not materialized locally. No deletions or private edits outside this course. The generated runtime stays in the draft build lane.

**Next slice: author the complete Evidence core**, then perform its separate content-validation slice. Preserve the Civil Procedure, Contracts, Torts and Real Property depth/independent-review backlogs. These cores remain In Progress; assistant review is not qualified independent academic review, calibrated exam simulation or full release acceptance.

Read private PROGRESS.md, OUTLINE.md, PROPERTY-COVERAGE.md, RESEARCH-PROPERTY.md, validation/REVIEW-PROPERTY.md, the exact correction records, reviewed-answer ledger and source/runtime/browser manifests. Keep the bar course private and outside the J.D. pathway until its intended scope and release acceptance are complete. LSAT remains separately published and first in that program.

Remote [Check courses run 42166908034](https://github.com/Aziliz/erudior-courses/actions/runs/42166908034) failed on review commit `458fa396`. Job `127725388235` reports no steps; logs return 404 BlobNotFound. Its check-run has two annotations, but the connector does not support retrieving that annotations endpoint. The immediate cause remains unconfirmed. Local checks do not imply remote CI success, and no controls were bypassed.

## Concurrent work and publication

Other chats are editing JD course content and the app. Refresh both repository heads and preserve their changes. Never run a wholesale course sync from a lagging private branch: it can remove newer packages/catalog entries. This change leaves all course packages and the catalog unchanged.

The independent website lane deploys the new program definition. Recent signed-course runs fail on German A2 carried-vocabulary validation; the existing published LSAT remains available. App PR #146 contains a separate proposed repair and was not merged or altered by this takeover. Preserve normal regression, signing, immutable-object and catalog-readback controls.

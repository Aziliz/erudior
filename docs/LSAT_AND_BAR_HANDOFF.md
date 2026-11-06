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

Continue private branch `course/bar-exam-foundations-20261103`, draft PR [#5](https://github.com/Aziliz/erudior-courses/pull/5). Evidence review checkpoint: `5853e3e0844efd83bcd2a3d1aa61cbe3e3d16f1d`, following authoring checkpoint `f398980c683f5f86f17a32b40491d3111a8dd4df`. Course `us-bar-exam-preparation`, source `content/math/bar-exam`, remains `released:false`.

The **complete Evidence validation slice is finished** within assistant substantive review and limited production-component checks. All 247 questions were manually re-solved with individual rationales; every explanation, nineteen lessons, 38 worked examples, 152 cards, 114 definitions, thirteen references and Juniper's model/rubric were reviewed. All keys, correct-choice text, IDs and lesson/topic/review links are unchanged. 640 distractor choices in 214 items were improved, nine stems clarified and four retrieval cards synchronized. Strictly longest correct choices fell from 140 to 12 of 228 singles; 35 are strictly shortest. These are diagnostics, not item calibration.

Six cores still total 82 lessons, 1,036 original questions (980 single, 56 multiple), 656 cards, 541 terms, 61 references and seven manual case files. The 328 module-review selections reuse bank items; the separate twelve-item baseline remains unchanged. Ten further modules remain Planned.

Juniper's assignment no longer gives away its calculated results, and the lesson uses a separate miniature practice calculation. The separate model now includes the requested seven-row purpose/foundation/ruling matrix in a readable two-column layout. Its 913 words meet the 700–1,000 target; the unchanged manual rubric totals 30 points. Independent arithmetic remains 120 invoices, $27,000 unique gross, $25,000 corrected net and $8,500 overstatement. The supplied rules stay fictional and admission stays separate from liability.

Fourteen renewed primary-source downloads returned 200 and matched the authoring snapshot. The actual November 4, 2026 NCBE scope controls over its older URL filename. Current FRE and the scheduled December 1, 2026 Rule 801 amendment are separately identified; affected questions specify November or supply the amended rule. Recheck operative text and intended-exam instructions before release. Source decisions, coverage limits and deeper work are recorded in EVIDENCE-COVERAGE.md and RESEARCH-EVIDENCE.md.

Local source/ledger/identity/preservation checks and the unchanged production course checker, import field-preservation preflight, strict local-source importer, canonical validation/roundtrip, normalizer and grader pass. All 16,576 selection subsets, 1,036 unanswered cases and four malformed controls were checked. The existing 24 MiB local-source policy accepts the 2,114,847-byte draft (1,953,655 compact bytes); the separate default 900 KiB route still rejects it. No app code, production limits, validators, shared builder, workflows or signing controls changed.

Limited component-browser evidence covers 64 unique reading states (all Evidence lessons/references in desktop light and a 320 CSS-pixel dark iframe), four matrix follow-ups and 54 feedback observations. No document horizontal overflow was observed. The final matrix-only adjustment was rechecked at both sizes, with the other rendered content verified unchanged. The record includes transient frame/locator issues and a corrected harness choice-index expectation; it does not mislabel those as course defects. Glossary open/Close works; the existing Escape-dismissal issue remains. Full-App acquisition/navigation, flashcard controls, saved progress, native-device acceptance and learner writing remain separate acceptance work.

App pin: `ef8fa47cb390c27ca4f0a67c9bdebce11f1a1582`. Final runtime SHA-256: `84ceaaea7376711c53db3f7b980568037ac298d4662200cd9fd34cbfc449325d`. All 25 changed/new saved blobs match local bytes; all 5,276 untouched repository blobs remain unchanged, including 27 historical validation files not materialized locally. Thirteen new review files bring the private repository to 5,301 blobs. No deletions or edits outside this course. Generated output stays in the draft lane.

**Next slice: author the complete Constitutional Law core**, then validate it in the following slice. Read private PROGRESS.md, OUTLINE.md, EVIDENCE-COVERAGE.md, RESEARCH-EVIDENCE.md, validation/REVIEW-EVIDENCE.md and the individual-answer, correction, source/runtime/browser and preservation records. Keep earlier Civil Procedure, Contracts, Torts and Real Property review identities and depth/independent-review backlogs intact.

Keep the bar course private and outside the J.D. pathway until intended scope and release acceptance are complete. Assistant review is not qualified independent academic review, comprehensive bar coverage or a calibrated exam simulation. LSAT remains separately published and first in the 25-course program.

Remote CI: [Check courses run 42177790323](https://github.com/Aziliz/erudior-courses/actions/runs/42177790323) failed on review commit `5853e3e0`. Job 127760174873 reports no steps; its log download returns 404 BlobNotFound. The connector also rejects direct check-run detail access. The immediate cause remains unconfirmed. The prior authoring run failed similarly. Local checks do not imply remote CI success, and no controls were bypassed.

## Concurrent work and publication

Other chats are editing JD course content and the app. Refresh both repository heads and preserve their changes. Never run a wholesale course sync from a lagging private branch: it can remove newer packages/catalog entries. This change leaves all course packages and the catalog unchanged.

The independent website lane deploys the new program definition. Recent signed-course runs fail on German A2 carried-vocabulary validation; the existing published LSAT remains available. App PR #146 contains a separate proposed repair and was not merged or altered by this takeover. Preserve normal regression, signing, immutable-object and catalog-readback controls.

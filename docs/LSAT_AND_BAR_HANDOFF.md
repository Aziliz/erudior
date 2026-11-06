# LSAT and bar course handoff

Updated November 6, 2026 (UTC). User request: take over both courses, publish LSAT if complete and place it first in J.D. Preparation.

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

Continue private branch `course/bar-exam-foundations-20261103`, draft PR [#5](https://github.com/Aziliz/erudior-courses/pull/5). Current Real Property authoring checkpoint: `4933e94e751a6f1e2658c94a30eb2b51a71ef2a4`, following Torts review `e71362c4c83a85202b9bfc9ef5082612e2030d9f`. Course `us-bar-exam-preparation`, source `content/math/bar-exam`, remains `released:false`.

The **complete Real Property core authoring slice is finished**. Five cores now contain 63 lessons, 789 questions (752 single-answer, 37 multiple-response), 504 cards, 427 terms, 48 references, and six manual case files. The 252 module-review selections reuse bank items; the separate twelve-item starting baseline is unchanged. Eleven further modules remain planned, not empty runtime modules.

Real Property adds eighteen lessons (46–63), 234 original questions, 144 cards, 108 terms, ten references, and 36 worked examples. Coverage runs through estates, future interests, cotenancy, leasing and housing rights, easements and covenants, land sales, adverse possession, deeds and recording, mortgages and foreclosure. Lessons have 1,078–1,227 whitespace-counted body words. PROPERTY-COVERAGE.md identifies depth limits and advanced variants; this is not a completed examination-coverage claim.

The original Alder Court file supplies fictional rules and documents, a 700–1,000-word assignment, separate 745-word model memorandum, and a 30-point manual rubric. It asks for a conditional closing recommendation, a lawful resolution of a valid tenancy, mortgage release documents, a cure calendar, preservation of access rights, and separate money ledgers. Buyer cash is $73,800; seller net is $139,200; total cash sources and uses are $361,800. A separate foreclosure comparison produces a $20,000 surplus. These are exercise assumptions, not a real closing opinion or an automatic essay score.

Authoring checks pass: preserved earlier source bytes, unique IDs/links/topics, lesson structure, balanced answer positions, eleven independent numeric keys, cash reconciliations and deterministic targeted build. The unchanged production course checker, field-preservation preflight, strict source importer, canonical validation/roundtrip, normalizer, and grader pass all 12,624 selection subsets, 789 unanswered cases, and four malformed controls.

The existing **24 MiB local-source acquisition policy** supports the 1,619,242-byte draft; compact JSON is 1,495,894 bytes. The separate **900 KiB default route** still rejects it as expected. No app source, production limit, validator, shared builder, workflow, signing, or publication control changed. Community transport and release acceptance are not claimed.

App pin: `ef8fa47cb390c27ca4f0a67c9bdebce11f1a1582`. Runtime SHA-256: `62730675f4cb168858799253751d3969b921d8d91d6a38498d051047e6c48168`. All 45 saved blobs match local bytes; 5,184 other repository blobs remain unchanged, including 27 historical validation files not materialized locally. No deletions or private changes outside this course. The generated runtime remains in the draft build lane and is not a public package.

Eighteen primary downloads succeeded. The actual NCBE PDF is dated November 4, 2026 and covers July 2026–February 2028 despite older URL/search labels; it expressly excludes perpetuities from this property scope. New York statutes and California instructions are labeled local examples. Read RESEARCH-PROPERTY.md and the retrieval manifest for scope and authority limits.

**Next slice: detailed Real Property content validation.** Re-solve all 234 keys; review every distractor, example, card, term, reference and the Alder model/rubric; renew material sources; and exercise learner reading and grading. Strictly longest correct options occur in 82/216 new single-answer items, a review diagnostic rather than a quality pass. This authoring slice did not claim semantic re-solve, browser testing, full-App import/navigation, cards/progress persistence, native acceptance, or qualified independent legal review.

Earlier Torts assistant review and browser evidence remain preserved at their original package hash. The glossary Close button worked, but Escape did not dismiss it; that app-acceptance issue remains open. Civil Procedure, Contracts, Torts, and Real Property remain In Progress for documented depth and independent review. After Real Property validation, the next planned authoring core is Evidence.

Read private PROGRESS.md, OUTLINE.md, PROPERTY-COVERAGE.md, RESEARCH-PROPERTY.md, validation/AUTHORING-PROPERTY.md and the property source/runtime manifests. Keep the bar course private and outside the J.D. pathway until its intended scope and release acceptance are complete. LSAT remains separately published and first in that program.

Remote [Check courses run 42137689405](https://github.com/Aziliz/erudior-courses/actions/runs/42137689405) failed for this authoring checkpoint. Job `127629894776` reports no steps; its log endpoint returns 404 BlobNotFound. The immediate cause is unconfirmed. Local checks do not imply remote CI success; controls were not bypassed.

## Concurrent work and publication

Other chats are editing JD course content and the app. Refresh both repository heads and preserve their changes. Never run a wholesale course sync from a lagging private branch: it can remove newer packages/catalog entries. This change leaves all course packages and the catalog unchanged.

The independent website lane deploys the new program definition. Recent signed-course runs fail on German A2 carried-vocabulary validation; the existing published LSAT remains available. App PR #146 contains a separate proposed repair and was not merged or altered by this takeover. Preserve normal regression, signing, immutable-object and catalog-readback controls.

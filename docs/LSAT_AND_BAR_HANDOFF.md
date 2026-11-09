# LSAT and bar course handoff

Updated November 9, 2026 (America/Denver). User request: take over both courses, publish LSAT if complete and place it first in J.D. Preparation.

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

Continue private branch `course/bar-exam-foundations-20261103`, draft PR [#5](https://github.com/Aziliz/erudior-courses/pull/5). Latest checkpoint: `8680db6250068efd6d2d4f9527aa52e565fca5a5`, built on `4358238282cd6aeda978c781613f317695d9c277`. Course `us-bar-exam-preparation`, source `content/math/bar-exam`, stays `released:false` and outside the J.D. pathway.

### Current section: Criminal Law foundations

Added the first **seven lessons of module 8**, numbered 107–113: elements/conduct, culpability, mistake/notice, causation, murder/degree, manslaughter/mitigation and felony-murder limits, and the original Ash Quay supplied-law file. The section has fourteen worked examples, 91 questions (84 singles and seven exactly-two responses), 56 cards, 42 terms, nine references and one manual case file with seven rules, seven exhibits, a separate 826-word model and a 30-point rubric.

The course now contains **113 lessons, 1,439 bank questions, 904 cards, 727 terms, 86 references and nine manual case files**. The 452 module-review selections reuse bank questions; the separate twelve-item starting baseline is unchanged. Seven earlier cores are authored; module 8 remains incomplete and modules 9–16 remain Planned. No empty runtime modules were added.

Twenty-three primary/official sources have successful retrieval identities. The detailed NCBE PDF internally identifies November 4, 2026 and July 2026–February 2028 despite its older filename and search descriptions. Its criminal scope uses supplied statutes for offense/defense elements. State illustrations, published federal snapshots, case-specific holdings and the fictional task rules are distinguished. Source retrieval is not comprehensive or qualified independent legal review.

Ash Quay requires a charge-by-charge recommendation and prioritized investigation. Its reporting deadline is 10:03, the actual call is three minutes late, and a normal timely evacuation would end at 10:06 before a 10:08 failure. The model preserves uncertainty about the worker's actual location instead of treating that arithmetic as proof of homicide causation. The separate reporting offense remains independently analyzed.

### Validation and preservation

Runtime SHA-256: `dc8bfa1d9fe49728f89de2a6e2d9ec5a0fe29fb14dbff64bf6271befe49d3f1b`. File bytes: 2,961,747; compact bytes: 2,738,719. Deterministic targeted generation, production checker/import/roundtrip, 23,024 selection subsets, 1,439 unanswered cases and four malformed controls pass against app candidate `b5de28158f781fbda2b25dfcee8969f4c1b65530`. The existing 24 MiB source route accepts the draft; the default 900 KiB limit still rejects it. No production limits, shared builder, app source, package/catalog, signing controls or workflows changed in this authoring slice.

Every prior lesson, module, reference, question, card and glossary record compares equal by stable identity in the previous and new runtime. All 36 changed/new saved blobs match local tested bytes; 5,375 untouched repository blobs are preserved, 32 files are new and none are deleted. The generated runtime remains ignored and unpublished.

The new production-component browser review passes at 320/1280px in light/dark themes: 64 reading screens, 364 correct-question screens, 364 incorrect/partial-feedback checks, 28 excess-selection rejections, 168 glossary openings across all 42 terms, twelve 200% text screens and 868 keyboard selections. All 23 source links are retained in each configuration. Configured accessibility scans cover all reading and correct-feedback screens. Final reports show no page, overflow or glossary findings; representative screenshots were visually inspected.

This wrapper uses production Markdown, QuestionStem, QuestionBody, normalizer and grader. It is not full-App acquisition/navigation, persistence, flashcard-control acceptance, native course acceptance, automatic writing evaluation, formal accessibility certification or qualified legal review. Evidence and exact identities are in private `validation/REVIEW-CRIMINAL-FOUNDATIONS.md`, the compressed browser result, and `criminal-foundations-source-manifest.json`.

### Next work and open gates

**Next: separate item-by-item content/distractor review of the seven new lessons and Ash Quay.** The introductory set needs stronger competing choices, mixed-fact transfer and fresh assessment. Forty-two of 84 single keys are strictly longest; balanced positions do not imply calibration. Then continue module 8 with the remaining crimes, inchoate offenses, participation, defenses, deeper homicide applications and all constitutional criminal procedure. Read private PROGRESS.md, CRIMINAL-COVERAGE.md and RESEARCH-CRIMINAL-FOUNDATIONS.md. Preserve every earlier depth and independent-review backlog.

The shared reader repair [PR #164](https://github.com/Aziliz/erudior/pull/164) is **unmerged**. Seventeen hosted app checks passed, including full regression, production build, reader acceptance and the broad browser/live workflow. Android upgrade failed twice waiting for checksum-rejection UI after portable-file checks; the retry is job `129305244498` in run `42656739397`. Its precise cause remains unconfirmed. No further blind retry, weakened test, merge or deployment is claimed.

Private course CI for the new checkpoint also failed: [Check courses run 42666386697](https://github.com/Aziliz/erudior-courses/actions/runs/42666386697), job `129331035375`. It has no executed steps; log retrieval returns 404 BlobNotFound. The immediate cause is unconfirmed. Local passes do not imply hosted success. Keep normal source, app, signing and publication gates intact.

### Earlier checkpoint references

Constitutional Law content review is recorded at `ba38c695144638f7a91afcc419961dd10b787cd6`, component review at `0cc9d8024bbf90f41acc73e4c632f3861e1ea63a`, and aligned status at `4358238282cd6aeda978c781613f317695d9c277`. Its 24 lessons, 312 questions, 192 cards, 144 terms and sixteen references retain their source and review identities. The earlier runtime was `e6b7277727243c19207cbcf6738d423990ffdcb4c77125a1bbebe7ce2d01ad83`. Historical reports are not relabeled as reviewing the expanded draft. LSAT remains separately published and first in the 25-course J.D. program.

## Concurrent work and publication

Other chats are editing JD course content and the app. Refresh both repository heads and preserve their changes. Never run a wholesale course sync from a lagging private branch: it can remove newer packages/catalog entries. This change leaves all course packages and the catalog unchanged.

The independent website lane deploys the new program definition. Recent signed-course runs fail on German A2 carried-vocabulary validation; the existing published LSAT remains available. App PR #146 contains a separate proposed repair and was not merged or altered by this takeover. Preserve normal regression, signing, immutable-object and catalog-readback controls.

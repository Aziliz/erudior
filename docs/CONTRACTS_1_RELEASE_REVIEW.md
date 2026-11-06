# Contracts I release review

Validated November 6, 2026. Course `law-contracts-1`, revision 1: four modules, eight lessons, 80 questions (64 choice, eight matching, eight text), 32 module selections, 64 cards, 75 glossary entries and five references. Runtime SHA-256 `192f2fe6727206891f7c5004c82b73fd06837446b9ff7c5bed056be8876ed036`, 205,805 bytes. Repeated scoped builds and the released metadata produce identical reviewed bytes. This report establishes candidate validation; final hosted evidence is recorded in the source PR’s validation/publication.json.

## Content review

All eight lessons, 16 examples, 80 questions/explanations, 64 cards, 75 definitions and five reference sheets were read and cross-checked. Semantic choice answers were selected from the questions before stored key comparison; matching classifications and text answers were checked separately. No substantive stored-key correction was required. The 953-word model satisfies the 900–1,200-word assignment and its 16-point self-assessment rubric. Writing remains self-assessed, not automatically graded.

Repairs: R2 now says “If the board declines,” aligning the promise with the conditional analysis in R4, the model, cards and questions. All 192 distractors were revised into relevant misconceptions and the eight answer-position patterns were varied, retaining 16 correct answers per position. Q0801's formation stem and Q0205's revocation distractor were clarified. The requirements discussion now includes the Article 2 disproportionate-quantity limit. Accessible primary reading anchors replace inaccessible CACI/WPI links. The capstone estimate is 120 minutes including drafting and rubric review. Stable learner IDs are unchanged.

The record audit keeps April 1 approval/signature conditions, April 2 requested deposit, April 5 approval and April 8 signed agreement distinct. The 240-dollar deposit is included in 1,800 dollars; no double recovery or pre-promise 700-dollar tablet reliance. The 100-dollar bonus has no new duty or supplied exception. The notebook transaction distinguishes formation, arbitration-term inclusion, signed quantity and delivery to the destination from carrier dispatch. No shipment, completed breach or remedy is invented.

## Primary-text scope

The source PR’s SOURCES.md and validation/source-review.json record the accessible primary texts and actual section/page pinpoints used to compare the F/D/I/G teaching rules. Model UCC text, illustrative enacted statutes, historical appellate decisions, an identified trial decision and expressly unpublished reading examples remain distinguished. Currentness is limited to the identified retrieved texts; no legal citator, all-state survey, faculty certification or human learner pilot is claimed. The exercises expressly stipulate original teaching rules, select no governing state and are not university credit or bar-eligibility advice. Capacity exceptions, unilateral mistake, public-policy specifics, restitution and specialized statutory regimes remain research boundaries, not purported exhaustive rules.

## Executed checks

- Structural scoped build twice, all IDs, topics, module mappings, reference links, bold glossary links, unique stems/cards and word ranges: pass. Lessons total 8,941 words; model main analysis 953.
- Actual app normalizer/grader: all 80 keys pass; 392 wrong/blank controls, 30 normalization/alias controls and 40 incomplete-match controls pass. All 32 module selections resolve.
- Strict importer and offline API round-trip: pass; every instructional object retained, zero external assets, zero network requests, unchanged source. This is not a browser disconnection test.
- Actual managed app preview: all eight lessons and five references rendered at 1363px and in a 320px iframe without page-level horizontal overflow. Glossary 75 entries/search/inline definition, card front/back and cram rating checked.
- Actual quiz UI: first lesson 9/10 with one deliberate wrong answer, second 10/10, first module 8/8; choice, matching, uppercase text acceptance, corrective explanation and review verified. Initial module lock, unlock after both lessons, and all three saved scores after reload verified. Remaining quizzes were engine-checked, not all completed manually.
- Existing app tests for study programs, enrollment UI, learning pathways, runner-save recovery and course schema pass. Course-signing suite passes with its single child command changed only in an untracked temporary copy from `npx tsx` to `node --import tsx`, avoiding this environment's tsx IPC EPERM. The tracked test is unchanged; hosted full regression must use the original command.
- TypeScript and production Vite build pass. Existing bundle-size advisory remains. No temporary preview flags, allowed-host setting, iframe or adapted test is included in the release.

Tested application engine is authenticated at `e0db61a2766e7918f750e7bb6e4b1a09c00f8f4f`. Concurrent main `8ac3bf95999d14a1af17e77b56264e6fde3073b0` adds Language Arts 6 plus its catalog/sitemap and documentation; no engine changes. Its authenticated catalog and runtime are retained. Candidate app catalog has 31 courses; all 30 existing entries remain byte-equivalent as objects. JD remains 25 courses/three stages, six available/nineteen planned. Legal Research remains a separate pending release.

## Release controls

Authored source parent `76ce717e87ecfcb9e53495a56f3692e6878b4634`; source main `df3667807816a2e6ec96399beeeff9ce1c3d35b5`; authenticated builder blob `3b4c32e91c5900dae0d1708e696da5655b7be85f`. Source PR #16 contains this course, generated package, catalog entry and validation evidence. An earlier private source CI run failed before any steps. Keep that PR unmerged while its check is failed; never claim that check passed.

The separately reviewed public app PR must pass its normal required checks before merge. Merge-triggered publication must run full regression, pinned signing-key matching, authenticated previous catalog, immutable-package checks, current-main and catalog-baseline guards, catalog-last signing/upload and exact public readback. No workflow, key, approval, threshold, application engine or unrelated course is changed. Existing release digests must remain intact, including concurrent Language Arts 6. Publication status and exact workflow IDs are recorded only after verification.

Next authoring slice after this release: Contracts II: Performance, Breach and Remedies.

Source: https://github.com/Aziliz/erudior-courses/pull/16.

Validated source commit: `ef04c2ccdda0ad113097a4874d06ceafb5e354c4`; all 45 uploaded blobs authenticated.

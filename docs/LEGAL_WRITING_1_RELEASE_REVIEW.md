# Legal Writing I release review

Published November 6, 2026. App PR #154 merged at `5c507671af19d78d5512a67c875528ec11672830` after all normal PR checks passed. Merge-triggered course publishing run `42169598325` and website deployment `42169598355` succeeded. Live read-back verified the pinned-key catalog signature, exact runtime digest/length below, all 26 prior course digests and concurrent Math 7 (28 courses total). The remaining notes retain the validation and release-candidate history.

## Candidate

- Course `law-legal-writing-1`, Legal Writing I: Objective Analysis, revision 1.
- Runtime SHA-256 `b761eff63cfbaf6d8a0908f8a246dcc1e0d59fcb5b7a3bad285d023ac19fadb1`, 177,863 bytes.
- Private authored/validated source: `Aziliz/erudior-courses@8792ab4145a6730a15397e045c483d7509ea6984`, source PR [#11](https://github.com/Aziliz/erudior-courses/pull/11), `content/math/legal-writing-1/`.
- Content-validation app baseline: `fd8a1a3559c6c7a83fd3973c6831620444c74203`; integration reconciled with main `552d8e16fb4cccea6c6ef39c692aa9aba6d44577`, preserving the concurrent Math 7 release and handoff documentation.
- Four modules, eight lessons, 80 questions, 64 cards, 56 glossary terms and four embedded references. Includes an original fictional authority/record packet, 937-word annotated model memorandum and self-assessed drafting/revision assignment.

## Validation and repairs

The separate validation slice reviewed the complete packet, lessons, model, rubric, cards, glossary and all questions. Independently selected semantic answers were compared with keys, then exercised through this app's actual normalizer and grader: 80 answer keys, 384 wrong/empty controls, 36 alias/normalization variants and 40 incomplete-answer controls pass. Each lesson has two choice answers in each position. The private source retains the answer oracle, scripts, fingerprints and detailed findings.

Repaired one ambiguous payment-timing question, eight weak distractors, within-lesson answer runs, a deposit-timing detail, five explanations that depended on option position, and duplicate displayed titles in all lessons/references. No stable IDs or engine behavior changed.

The authenticated scoped builder produces the reviewed package reproducibly. Current app course schema, study-program, learning-pathway, enrollment UI, runner-save recovery and production build checks pass. Strict offline import/export preserves all instructional objects and needs no external assets or network requests.

Actual managed browser review covered all eight lesson bodies and four references at desktop and 320px iframe widths, with no page-level horizontal overflow. It exercised glossary definitions/search, card front/back/review, both first-module lesson quizzes (9/10 with one deliberate wrong answer; 10/10), the first module quiz (8/8), choice/match/text grading, explanation/result displays, module unlocking and progress persistence after reload. All module quiz memberships were checked programmatically; no claim is made that all four module quizzes were completed in the browser. Temporary preview environment flags and viewport fixture are excluded from this commit.

This is AI content and software review, not a faculty certification or calibrated assessment study. The substantive Kestrel universe is original fiction, not a representation of Hawaii law or university credit. Extended writing is self-assessed outside the app.

## Integration and release checks

The candidate adds one package and one catalog entry, updates the generated sitemap, and tests the existing J.D. Preparation program's Legal Writing I availability. The pathway remains 25 courses in three stages, with four available and 21 planned at this baseline. Legal Research remains a separate pending release; its recommended prerequisite relationship is preserved. Existing enrollments and progress are unchanged.

The freshly fetched signed baseline authenticated all 26 existing courses. The normal production publisher validated the candidate against that baseline and reached the expected missing-local-signing-key boundary after checking course approvals and immutable revisions. No key was generated, replaced or loaded locally. Hosted publishing remains responsible for signing and publication.

Private source hosted CI was observed failing before any job steps ran; it is not claimed to pass, and the source PR remains unmerged while that check is failed. The public app publication lane has independent normal PR/merge checks. No source-CI status, workflow, billing setting, trusted key or approval receipt is modified or bypassed.

Before publication: verify current PR checks, then use the ordinary merge-triggered full regression, signature-key, authenticated-baseline, immutable-artifact and catalog read-back steps. Verify the exact signed runtime digest above after release. Local broad checks reached the container's tsx CLI IPC restriction (including nested CLI use in the signing test); they are not claimed as a full local suite pass. The unchanged hosted full regression and production build passed in run 42122533543, and Study programs acceptance passed in run 42122533725. The broader browser run 42122533631 found that the isolated course-activity fixture omitted `courseActivities.css`, which the production entry already loads. Importing that same production stylesheet in the fixture restores the workbook scroll container: the 320px preview changes from 865px document overflow to a contained 820px workbook inside a 213px scroll region. No production CSS, assertion, workflow or course bytes are changed by this repair. Repeat the normal hosted checks on the corrected fixture before merging.

On the first fixture-fix head, hosted identity/regression (42164301986), Study programs (42164302105) and reviewed-promotion acceptance (42164302077) passed. The browser run (42164302323) passed the corrected course-activity test, then exposed the same missing production stylesheet in the separate spreadsheet-v2 fixture. Its macro-preview disclosure had zero separation from adjacent controls and failed the unchanged target-size audit. Importing `courseActivities.css` there restores the production 12px disclosure margin and workbook overflow container; managed-browser inspection confirmed both and keyboard expansion. This second repair also changes only the fixture import, not production styling or test thresholds. Require a fresh complete hosted pass before merging.

The Math 7 release advanced main during these checks. Catalog and sitemap conflicts were reconciled by preserving all 27 main catalog entries unchanged and adding only Legal Writing I (28 total). The validated Legal Writing I bytes are unchanged. A merge commit records both branch parents and restarts normal checks on the combined tree.

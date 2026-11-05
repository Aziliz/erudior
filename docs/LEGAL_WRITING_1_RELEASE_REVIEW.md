# Legal Writing I release review

Updated November 5, 2026. Revision 1 is a validated release candidate; publication is not established by this document alone. The final course workflow must pass and the signed release must contain the reviewed bytes.

## Candidate

- Course `law-legal-writing-1`, Legal Writing I: Objective Analysis, revision 1.
- Runtime SHA-256 `b761eff63cfbaf6d8a0908f8a246dcc1e0d59fcb5b7a3bad285d023ac19fadb1`, 177,863 bytes.
- Private authored/validated source: `Aziliz/erudior-courses@8792ab4145a6730a15397e045c483d7509ea6984`, source PR [#11](https://github.com/Aziliz/erudior-courses/pull/11), `content/math/legal-writing-1/`.
- Current app baseline: `fd8a1a3559c6c7a83fd3973c6831620444c74203`.
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

Before publication: verify current PR checks, then use the ordinary merge-triggered full regression, signature-key, authenticated-baseline, immutable-artifact and catalog read-back steps. Verify the exact signed runtime digest above after release. Local `npm test` initially reached the container's tsx CLI IPC restriction; the same remaining test entries are run using `node --import tsx` without changing package scripts. Record the hosted workflow outcome separately; do not equate local checks with a public release.

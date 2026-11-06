# Language Arts 6 revision 1 — validation and release

Content and learner validation completed November 6, 2026. This is slice 2 of the user's two-slice workflow. Signed publication and live verification completed through the normal release pipeline; the receipt appears below.

## Complete course

Nine modules, 36 lessons, 396 mixed-format questions, 36 writing workshops, nine four-criterion rubrics, 180 study cards, 144 glossary entries, and ten references. Eleven reader texts contain 47 sections, including all 24 chapters of *The Wonderful Wizard of Oz* and the retained edition notices, three original poems, an original play, and six groups of original stories and informational packets. Quizzes check bounded skills; writing and performance work need rubric-based review.

Revision 1: `samples/math/language-arts-6.json`, 909,630 bytes, SHA-256 `7e8452c7dd29e7afe29abcf79443ea6a30f99c5ab7c8d4ff524ac09ece25cc7a`. Reviewed draft SHA-256: `c282fead5ca8f72a692cf02782eca1600f3f2c49cb8fc206efbc518bf4f85525`. Deep comparison confirms that every instructional object and learner identity is unchanged from the tested draft; only the initial-release changelog was added.

## Review and corrections

All lessons, worked examples, questions and explanations, writing tasks and rubrics, references and strategy cards were reviewed. The 144 matching definitions were checked against their glossary and card equivalents. Twenty-six corrections address 12 explanations that depended on shuffled choice positions, two textual details, four writing targets, six rubric descriptions, one guide clarification, and reader speaker-line formatting. Exact changes and the nine-module review ledger are in `validation/review-edits.json` and `validation/content-review.md`.

This is author review, not independent human academic approval, standards certification, or a learner pilot. The source audit verifies the entire supplied novel and edition notices and every original poem's line breaks. Fictional survey/attendance/closing records retain their populations, dates, units and limitations. No personal disclosure, recording or public sharing is required.

## Executed validation

| Check | Result |
|---|---|
| Production content checker | Passed on reviewed draft and release candidate |
| Strict canonical migration and offline course snapshot roundtrip | Passed |
| Production answer grading | 5,184 choice subsets; 22,500 matching states; 216 text cases plus 77 accepted variants; 396 unanswered cases |
| Production question components | 1,188 render states; 576 interactions; 36 Enter events; all 360 card sides |
| Source/content consistency | All 24 novel chapters, notices, original poem line breaks, 144 definitions and dataset totals passed |
| Full web application | 19 workflow checks; all 36 lessons, 36 workshop links and 47 reader sections at desktop/mobile sizes |
| Accessibility and layout | 29 automated WCAG states; zero reported violations and no page overflow |
| Quiz persistence | Save/reload/resume, transaction-abort retries without duplicate attempts, offline save and browser-process restart |
| Writing persistence | Confirmed autosave, four rubric self-checks, finish, offline revision and two immutable original submissions survive reload; no automatic grade |
| Reading persistence | Novel chapter completion and next location survive reload; offline next-chapter navigation and completed poem persist |
| Study tools | All references, glossary search, card reveal/rating and retained schedule |

The tested runtime's 376 `src/` files match public main `e0db61a2766e7918f750e7bb6e4b1a09c00f8f4f`; source blobs are in `validation/app-source-manifest.json`. Browser tests use isolated synthetic learner storage. No uncaught browser errors were observed. Evidence does not establish native/Tauri behavior, cold offline startup, physical power-loss resilience, human screen-reader usability, or a learner pilot.

The first browser harness mistakenly treated an asynchronous predicate's Promise as a completed save check. Explicit awaited polling and the app's Saved confirmation corrected the harness; the full successful run uses those checks. No application persistence change was needed.

## Reproduction and publication

Build with `python3 content/math/language-arts-6/build.py`; the shared builder alone omits reader/work fields. Run `validation/check_creation.py` and `validation/check-content-consistency.py`. From the app checkout, run `node --import tsx tests/check-course.mts <package>`, then `ERUDIOR_APP=. node --import tsx <course>/validation/check-course-review.mjs <package>` and `check-rendering.mjs`. Run `check-browser.mjs` with `ERUDIOR_APP`, `CHROMIUM_PATH`, `LA6_COURSE_FILE`, `LA6_BROWSER_OUT`, and `ERUDIOR_APP_COMMIT` as needed.

Add only this course to the latest private/public catalogs and generated sitemap. Preserve all other packages and catalog rows, including concurrent legal-course work. Use the normal publisher's full merge regression, pinned signing key, previous-catalog authentication, immutable package upload, current-main/baseline guards, catalog-last commit and authoritative readback. No publication check is disabled. Source PR: https://github.com/Aziliz/erudior-courses/pull/14.

## Published release — November 6, 2026 UTC

Language Arts 6 revision 1 is live at https://app.erudior.com/language-arts-6. All nine modules are complete. The signed catalog contains 30 courses; its Ed25519 signature verifies against the app's pinned public key. The immutable downloaded course is exactly 909,630 bytes with SHA-256 `7e8452c7dd29e7afe29abcf79443ea6a30f99c5ab7c8d4ff524ac09ece25cc7a` and is byte-for-byte identical to the validated release package.

- Source PR #14 merged as `6df9c7f1c08c9c5d122a898aac6252c018c15e2a`; public PR #158 merged as `8ac3bf95999d14a1af17e77b56264e6fde3073b0`.
- [Signed publisher 42184607500](https://github.com/Aziliz/erudior/actions/runs/42184607500) passed, retaining full regression, key pin, authenticated previous catalog, immutable package checks, current-main/baseline guards and authoritative readback.
- [Website deployment 42184607314](https://github.com/Aziliz/erudior/actions/runs/42184607314) passed. Live browser checks opened the overview, all 36 lesson controls, the first lesson and linked writing/rubric, chapter 24 of the complete novel, and the play's nine speaker labels and four stage directions. The live UI check used cloud Chrome and a disposable temporary guest session and submitted no learner work. Mobile coverage was completed in the local full-app acceptance run; the live viewport was desktop. The standalone live browser script was blocked by the local network/TLS environment, so its failed attempt is not counted as a passing test; certificate verification remained enabled.
- Other public workflow outcomes are recorded in `validation/publication.json`. The private course check reported failure before any job steps and had no retrievable log; it was retried and is not represented as a hosted pass. The exact package's executed local checks and public publisher regression are recorded separately.

Creation and validation/publication slices are both **Done**. Publication and receipt recording do not change instructional content, learner IDs, or the published revision. Reproducible verification scripts and machine-readable receipts are in `validation/`.

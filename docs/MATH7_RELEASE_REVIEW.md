# Math 7 revision 1 release

Math 7 adds nine complete modules with 36 lessons, 432 mixed-format questions, 72 generated drills, 180 cards, 144 glossary entries, 10 reference sheets, and 36 figures. Math 6 is its prerequisite. This is the validated core course; no honors module is advertised.

The candidate is `samples/math/math-7.json`, 650,037 bytes, SHA-256 `3120a2e7213885065968279d6edb55e1e4ac13bcff757876da9d226f427ec431`. All instructional objects and learner IDs match the reviewed draft; only the initial-release changelog differs.

The author checked all keys and worked examples, corrected 16 position-dependent explanations for shuffled choices, varied all 36 select-all layouts, and clarified three geometry prompts. This is author review, not independent human academic approval or standards certification. The private source PR is https://github.com/Aziliz/erudior-courses/pull/12.

Production checker, strict canonical import, and offline export/import pass. Separate rational drill calculations cover 24,207 cases and 72,621 field-grading checks across all 72 drill types (67 finite domains exhaustive; five boundary/sample domains). Grading covers 5,184 choice subsets, 22,500 matching states and 432 text cases. All 432 questions and 360 card sides render correctly. The DrillRunner component passes 144 correct/incorrect scenarios.

All 376 runtime source files match main `9316e8d5965b48509e716b2349f0945bf3791a04`. Full Chromium acceptance passes 14 workflow checks, every lesson/figure at desktop and phone widths, 19 automated accessibility states with zero reported violations, a 320-pixel quiz/calculator, save failures and retries without duplicate attempts, browser restart, and card/drill/reference/glossary flows. A supplemental run answers a previously unanswered question offline and restores it after reconnect/reload. Evidence uses isolated synthetic learner storage. Native/Tauri, cold offline startup, physical power loss, human assistive-technology testing, and a student pilot are outside this evidence.

Only Math 7 is added to the current app catalog and generated sitemap. Other courses are preserved. The normal signed course workflow runs the full regression suite and all existing signing, immutable-object, baseline, current-main, and authoritative-readback checks. Website deployment is triggered by the sitemap change. Publication and live verification are pending; they will be recorded here after successful release.

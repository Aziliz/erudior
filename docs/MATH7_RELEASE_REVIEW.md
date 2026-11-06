# Math 7 revision 1 release

Math 7 adds nine complete modules with 36 lessons, 432 mixed-format questions, 72 generated drills, 180 cards, 144 glossary entries, 10 reference sheets, and 36 figures. Math 6 is its prerequisite. This is the validated core course; no honors module is advertised.

The published package is `samples/math/math-7.json`, 650,037 bytes, SHA-256 `3120a2e7213885065968279d6edb55e1e4ac13bcff757876da9d226f427ec431`. All instructional objects and learner IDs match the reviewed draft; only the initial-release changelog differs.

The author checked all keys and worked examples, corrected 16 position-dependent explanations for shuffled choices, varied all 36 select-all layouts, and clarified three geometry prompts. This is author review, not independent human academic approval or standards certification. The private source PR is https://github.com/Aziliz/erudior-courses/pull/12.

Production checker, strict canonical import, and offline export/import pass. Separate rational drill calculations cover 24,207 cases and 72,621 field-grading checks across all 72 drill types (67 finite domains exhaustive; five boundary/sample domains). Grading covers 5,184 choice subsets, 22,500 matching states and 432 text cases. All 432 questions and 360 card sides render correctly. The DrillRunner component passes 144 correct/incorrect scenarios.

All 376 runtime source files match main `9316e8d5965b48509e716b2349f0945bf3791a04`. Full Chromium acceptance passes 14 workflow checks, every lesson/figure at desktop and phone widths, 19 automated accessibility states with zero reported violations, a 320-pixel quiz/calculator, save failures and retries without duplicate attempts, browser restart, and card/drill/reference/glossary flows. A supplemental run answers a previously unanswered question offline and restores it after reconnect/reload. Evidence uses isolated synthetic learner storage. Native/Tauri, cold offline startup, physical power loss, human assistive-technology testing, and a student pilot are outside this evidence.

Only Math 7 is added to the current app catalog and generated sitemap. Other courses are preserved. The normal signed course workflow runs the full regression suite and all existing signing, immutable-object, baseline, current-main, and authoritative-readback checks. Website deployment is triggered by the sitemap change. Publication and live verification passed; the release record follows.


## Published release — 2026-11-06 UTC

Math 7 revision 1 is published and verified at https://app.erudior.com/math-7. All nine modules are complete. The published signed catalog contains 27 courses; its Ed25519 signature verifies with the public key pinned in the app. The immutable `math-7.r1.json` download is exactly 650,037 bytes with SHA-256 `3120a2e7213885065968279d6edb55e1e4ac13bcff757876da9d226f427ec431`.

- Source PR #12 merged as `4c0a5ee6e25bd423cbe360da28966474d9f22161`; public PR #155 merged as `552d8e16fb4cccea6c6ef39c692aa9aba6d44577`.
- Website deployment [42166213141](https://github.com/Aziliz/erudior/actions/runs/42166213141) passed. Live browser verification covered the complete overview, all 36 lesson controls, and the first lesson's teaching, diagram, worked examples, quiz, cards, drills, and references, using a temporary guest session.
- Signed publisher [42167761947](https://github.com/Aziliz/erudior/actions/runs/42167761947) passed on `80d33712a4632e6a3e19906e30921d0c1888d83f`: full regression, signing-key pin, previous-catalog authentication, immutable upload, current-main/baseline guards, and authoritative readback all passed. No check was disabled.
- Main regression/build [42167446187](https://github.com/Aziliz/erudior/actions/runs/42167446187), all four browser/live jobs [42167446171](https://github.com/Aziliz/erudior/actions/runs/42167446171), and promotion acceptance [42167446094](https://github.com/Aziliz/erudior/actions/runs/42167446094) passed.

The first publisher run stopped correctly at its current-main guard after a concurrent documentation update. The new run used the latest main. An initial browser CI failure was traced to two isolated fixtures missing the production `courseActivities.css` import, which removed workbook scroll containment. Commit `80d33712a4632e6a3e19906e30921d0c1888d83f` adds that import to both fixtures; the unchanged activity and spreadsheet assertions pass locally and in GitHub. Production runtime behavior did not change. The private source CI run failed before any steps and had no retrievable log; it is not represented as a hosted pass.

Final machine-readable evidence and the repeatable live verification script are committed under `content/math/math-7/validation/` in the private course source repository. Creation and validation/publication slices are both **Done**. The course's content, stable learner IDs, and published revision are unchanged by this receipt.

# Math 6 revision 1

The user authorized a complete course in two slices: build all modules, then validate, repair findings and publish. Private source PR [#8](https://github.com/Aziliz/erudior-courses/pull/8) merged as e8878f30fcee6211d1322749928d46a9c5bb4390.

Math 6 contains eight modules, 32 lessons, 328 questions, 66 generated drills, 152 study cards, 138 glossary terms and 10 references. All 32 lessons have worked examples and lesson quizzes; each module has a checkpoint. The runtime is samples/math/math-6.json, revision 1, 459,056 bytes, SHA-256 e82ee5c825e4a7defb7e6c2c4919ddaf79b7eae5d2f114e07f6aeb77efe53fd7. Only public description/changelog changed from the fully reviewed draft; deep comparison preserved every instructional object and learner identity.

Current builder, production checker, 328 semantic keys, 916 wrong-key controls, 20,275 independent drill cases, strict import and offline roundtrip pass. The current-app browser recheck covers all 32 lessons at desktop/phone widths, 16 accessibility scans with zero violations, answer controls, failed-save recovery, loaded-app offline saving and clean browser restart. All 376 runtime source blobs were authenticated to bfaeb8ebba5b7c5b919c02722337a88ea8f01508. Detailed source review, hashes and results remain private under content/math/math-6/.

The same validation found two learner bugs: Save & exit navigated before save success, and submission could clear the recovery draft before progress committed. The app now serializes writes, keeps recoverable drafts, exposes retries and avoids double-counting a retained scored attempt. A mobile calculator overlap is also fixed. TypeScript, Runner recovery and shared-device tests pass; previous complete recovery head a5a913bca2ab64d78adbd7dd0ae10c54a8bc5a76 passed all ten hosted workflows.

Refreshing onto current main revealed missing document/transaction validator deployment triggers and an isolated publisher fixture without its carried-vocabulary prerequisite. Both release triggers now track those validators (also independently fixed on main 97764d1a2a88ce20b9114c5309265dfe04be395d). The test fixture now supplies the explicit synthetic prerequisite without modifying candidate bytes; a negative control verifies publication still rejects the missing prerequisite. No production validation is relaxed.

Private source CI fails before running steps; the project handoff documents a billing restriction, but this run's unavailable log does not independently establish its cause. Local validation is not represented as hosted success. The public publication workflow retains full regression, signing-key verification, authenticated previous catalog, immutable revision checks, latest-main protection and authoritative readback.

Publication is only complete when that workflow and the live signed catalog are verified. The expected learner URL is https://app.erudior.com/math-6. Human assistive-technology, native/Tauri storage, cold offline startup and physical power-loss behavior are outside this browser evidence; no independent human academic approval or guaranteed standards coverage is claimed.

Math 7 is next: create all its modules in one slice, then validate and publish in the next.

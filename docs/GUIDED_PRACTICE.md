# Guided-practice course presentation

A course may explicitly author `assessmentPresentation: "guided-practice"`.
Missing or `"standard"` retains the original exam-preparation interface.
The setting is independent of title, age, grade, read-aloud accessibility,
identity, consent, and account authority. Never infer it from `readAloud`.
Invalid nonempty or null settings are rejected rather than dropped by a fallback.

The setting is preserved by legacy runtime normalization, canonical course
validation/authoring, community block conversion and canonical migration,
source serialization, and private offline course export/import. Canonical
community documents keep it in `canonical.course`, not conflicting listing metadata.
Native/canonical course metadata editing provides a labelled select.

Guided course Today uses the actual next lesson and lesson checkpoints, not the
exam-date plan or readiness estimate. Questions opens a short untimed practice
picker (up to 3, 5, or 10 items). Lessons and units retain their original IDs,
question pools, correct-answer threshold, unlock logic and completion writes.
UI copy calls these practice checkpoints. The runner omits the clock and
reading-heavy confidence/explain-first extras, but still records session duration
and answers. Existing read-aloud controls and recording selection are unchanged.
Results show answer counts, explanations and retry guidance; exact percentage
and duration remain available in Session details and Progress history.
No score or checkpoint is asserted to be grade placement or independent performance.

Both App navigation and the Runner boundary reject timed sessions for a guided
course. A stale saved timed draft is not silently converted, graded, erased or
marked complete. Historical attempts remain records. This is a presentation and
new-session restriction, not a migration of old academic credit or completion.
Existing source review/digest, learner session and adult authority gates still apply.
Standalone banks and standard courses retain their original exam behavior.

## Delivery and acceptance

Generic synthetic fixtures are used in public tests; private Math K content must
remain in the curriculum repository or a private/local review artifact. The Math K
candidate can opt in only after this app capability is available. Older app builds
do not implement it; adding a JSON field alone is not a release guarantee.
No public catalog entry, publication signature, new APK, account activation or
independent academic approval is part of this change.

```
node --import tsx --test tests/guided-practice.test.mts
npm test
npm run build
node scripts/guided-practice-browser.mjs
```

The real-App browser suite exercises desktop/light and 320px/dark layouts,
keyboard answers, deliberate failures, unchanged completion rules, correct retry,
unit unlock, save/resume/reload, a retained blocked timed draft, standard timed
exams, large text, accessibility and public cookie-free fixture reads. It is not
physical Android, real speech-output, or independent child-observation acceptance.

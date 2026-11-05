# LSAT and bar course handoff

Updated November 5, 2026 (America/Denver). User request: take over both courses, publish LSAT if complete and place it first in J.D. Preparation.

## LSAT — Done

`lsat-180-mastery`, revision 1, is complete within the documented course review and already signed/published. It contains 12 modules, 58 lessons, 712 original bank questions, 352 cards, 250 glossary terms and 45 references. Preserve its stable IDs, published bytes and raw-versus-official-score distinctions. The formative course is not an empirically calibrated score predictor.

`docs/LSAT_RELEASE_REVIEW.md` records verified publication and the latest authenticated package download. Source is in private `Aziliz/erudior-courses`, `content/math/lsat-180/`; released app package is `samples/math/lsat-180-mastery.json`. SHA-256: `5bfd58b7ae7eea80eadde241b2a26e1f04d975427a08cfd97801eee62b33edd9`.

The requested J.D. program version 2 begins LSAT → U.S. Legal System → Case Reading → Legal Research, retaining the remaining law sequence. There are 25 courses in the same three stages. LSAT's twelve module names match its actual released outline. Following the program only saves the plan; opening an overview does not enroll or install a course. Existing saved orders and progress are not rewritten. Learners can edit an earlier saved plan to include LSAT or stop following and follow the current program; stopping a plan preserves course enrollments and progress.

Focused program, learning-pathway, enrollment UI and LSAT package checks pass locally. The browser acceptance script now covers LSAT overview/explicit start/first lesson and retains U.S. Legal System and Case Reading checks, reload/removal, planned-course controls, keyboard and responsive/accessibility audits. Deployment and hosted browser outcomes must be checked on the saved commit; this document does not claim they have already passed.

## U.S. Bar Exam Preparation — In Progress

Continue the existing private source branch `course/bar-exam-foundations-20261103`, PR [#5](https://github.com/Aziliz/erudior-courses/pull/5), inspected at `88043ad2d6e0f933ebd1c187b6a021b977454553`. Course ID `us-bar-exam-preparation`; source `content/math/bar-exam`; `released:false`. No bar curriculum or release flag changed during this takeover.

Three authored cores: foundations, federal civil procedure, contracts and sales. Current totals: 30 lessons, 360 questions, 240 cards, 226 glossary terms, 29 references and four manual case-file tasks with separate models. The 120 module-review selections reuse bank questions. Thirteen other modules remain planned; this is not a completed bar course.

Next slice is the documented Contracts and Sales validation, lessons 20–30: review all 22 examples, 132 questions/distractors, 88 cards, 103 terms, nine references, Harbor Lantern's model/variations and production rendering. Fix findings and update the private review evidence. Read `PROGRESS.md`, `CONTRACTS-COVERAGE.md`, `RESEARCH-CONTRACTS.md` and `validation/` at the latest branch head before editing. Torts follows that validation. Civil procedure and contracts retain their remaining depth and independent-review requirements.

Previous source/runtime checks pass within their recorded scope, but full-app learner acceptance remains outstanding. Private Check courses run `42105111925` failed before reported job steps and returned no downloadable log; the immediate cause is unconfirmed. Do not label it passing or infer complete coverage from structural grading checks. Keep the bar draft unpublished until its intended scope and release acceptance are complete.

## Concurrent work and publication

Other chats are editing JD course content and the app. Refresh both repository heads and preserve their changes. Never run a wholesale course sync from a lagging private branch: it can remove newer packages/catalog entries. This change leaves all course packages and the catalog unchanged.

The independent website lane deploys the new program definition. Recent signed-course runs fail on German A2 carried-vocabulary validation; the existing published LSAT remains available. App PR #146 contains a separate proposed repair and was not merged or altered by this takeover. Preserve normal regression, signing, immutable-object and catalog-readback controls.

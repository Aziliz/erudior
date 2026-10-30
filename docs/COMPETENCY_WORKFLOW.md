# Cross-course competency graph

## Scope and identity

The existing 45 stable skill definitions cover 12 supported courses. This capability does not add course content, invent assessment items, certify mastery, or alter course grades. Prerequisite links are validated as a directed acyclic graph. Missing or unassessed skills remain unknown rather than being considered complete.

Authored evidence is resolved only from exact lesson-linked course/bank/question identities. A same-topic question, an unrelated drill, or another lesson's module quiz cannot confer evidence. Ambiguous duplicate identities fail closed. Focused practice uses this same exact question pool, while the existing adaptive question scheduler selects within it.

## Private, durable evidence

A versioned competency ledger lives inside the learner's existing progress file. It captures source identities and semantic fingerprints, estimates and confidence, and retains independent evidence when courses are removed. A changed question or course revision invalidates its old active evidence; old attempts cannot simply be reattached to new content. Previously recorded history is retained for explanation, not added repeatedly to attempt totals.

Single-user and student progress share the existing named-state compare-and-swap transaction boundary. Ordinary progress writes preserve newer competency history. Asynchronous captures are bound to a specific learner, and delayed results must not replace another learner's display. No competency data is uploaded to a server.

## Adult placement versus assessed mastery

The learner Progress page shows assessed estimates, prerequisite gaps, linked study/practice, retained evidence, and separate adult placement labels. It does not offer adult decision controls.

The existing password/PIN-gated parent or classroom-teacher area has a Learning paths tab. An adult selects a learner, skill, action and required reason. Decisions record identity, time and reason; repeated uncertain-write retries use the same operation ID. Actions are ready-to-learn placement, manually satisfied prerequisite, needs-practice override, or revoke. Revocation returns to assessment-derived behavior. An override never rewrites an assessment score and must not be presented as a credential or official external approval.

The App supplies live authorization callbacks. Loading, writing or retrying checks the current unlocked adult area and learner membership again; mounting a component is not authorization. Locking or leaving the area revokes that access. Local records are not cryptographically authenticated third-party credentials.

## Recovery and validation

Existing encrypted family backups carry each learner's ledger and decision history with the rest of their progress. Malformed or oversized ledgers reject before recovery writes. Profile removal must not leave or recreate its competency records. Legacy progress without a ledger remains valid. Its old revisionless attempts remain in history but cannot prove current-question mastery: the first durable capture records a baseline and requires genuinely new answers for an active estimate. This avoids silently assigning old answers to changed content. Plaintext learner backup imports preserve manual decision history as imported and non-operative until an adult reissues a decision; existing operative adult history is not overwritten. Encrypted whole-family recovery occurs in the existing adult-gated area.

Regression coverage includes exact-identity/topic isolation, unassessed skills, prerequisite unlock, evidence replay, course removal/reinstall/revision, manual decision/revoke separation, concurrent writes, locked authority, delayed profile switching, two-learner backup/restore and malformed recovery. Parent/learner DOM tests cover accessible controls, failure retry, and stale results. Native CAS validation runs on the exact feature PR and merged commit; no test or signing lane is bypassed.

Desktop installers are deliberately deferred to a later consolidated release at the user's request. Implementation and web/API delivery do not imply a new desktop version has been distributed.

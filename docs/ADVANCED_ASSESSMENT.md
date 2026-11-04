# Advanced assessment and feedback

This is a reusable educational assessment workspace, not a qualification system, proctoring service or automatic academic grading authority. It does not change legacy quiz scoring, homeschool grades, mastery, credentials or existing assessed-work V1 submissions. No course content is added by this feature.

## Original acceptance and workflow

The original roadmap requires **multi-step math work, oral assessment, rubric revision history, question variants, integrity controls, misconception reporting and verifiable assessment lineage**. The workspace supports these together, rather than treating a final answer as the whole assessment.

1. An author builds a versioned source containing explicit variants, ordered math steps, oral prompts, a versioned rubric, response-pattern definitions and assistance instructions. Canonical and community sources use the same strict portable schema. Local review authority is never a portable course field.
2. The supervising adult opens the exact saved or installed source, reviews it locally, and assigns a particular variant to a current learner. Assignment revisions retain their original source and variant; editing a source does not rewrite existing work.
3. The learner records answers **and reasoning** for math steps. Numeric checks accept decimal/scientific numeric literals within an authored absolute tolerance; they do not establish algebraic equivalence or validate a proof. Text checks use frozen V1 case-insensitive NFKC/whitespace normalization. Reasoning always needs human judgment.
4. Oral work records a transcript and can include an explicitly selected local audio file for playback and human review. Transcript-only work is a valid alternative and is labelled as such. There is no speech recognition, automatic pronunciation score or microphone permission request. File size, encoding and audio type are bounded; supplied duration is descriptive metadata, not authenticated recording time.
5. Assistance is declared by the learner. Response corrections append events rather than removing earlier work. A submission captures the exact assignment, source, variant, rubric, journal prefix and versioned computed feedback. Incomplete checkpoints are distinguishable from complete responses.
6. An adult records criterion-level rubric judgments, explanations and optional evidence-linked misconception observations. Review revisions append to the previous review and reject stale review state. A later judgment never changes the original submission or previous review.
7. The learner and adult can inspect and export the exact evidence and history. Restored sources need fresh local review; imported human judgments remain historical and unverified, even after source approval. A new explicit review creates fresh local provenance.

## Interpreting feedback

A matching authored response pattern is an **observation to discuss**, not proof of the cause of an error. Instructor observations are separately labelled and tied to the selected question/step and immutable submission. No diagnostic label is inferred from a learner's voice, identity, disability or protected traits. Automatic step matches, completion, and human rubric judgments are separate concepts; none automatically awards credit or a qualification.

Explicit variants are not claimed to be psychometrically equivalent. Their identity is pinned at assignment and included in the evidence. Sources and expected answers are local educational data, not securely concealed examination material.

## Integrity and privacy boundaries

The `advanced-assessment` state uses strict finite bounded JSON, exact source comparisons, versioned replay, same-device append-only histories, compare-and-swap persistence and current family/role checks. These controls detect inconsistent application data; they do **not** authenticate an external examiner, establish learner identity, prove independent work, or make a user-controlled device tamper-proof.

Only an explicitly unlocked local supervising-adult context may review sources, assign work or record human judgments. Operations recheck authority and learner membership around asynchronous storage operations. Learners see only their own assignments and evidence. Same-ID retries are idempotent; conflicting revisions require reload rather than overwriting another writer.

Encrypted backup preserves source snapshots, response/audio history, computed feedback and human review lineage. Restore validates the entire library and family membership before writes, quarantines all imported source approvals and reviewer provenance, and rejects malformed or inconsistent journal prefixes. Full profile deletion removes private responses, audio, submissions and feedback while preserving reusable source definitions and a tombstone against stale writers. Ordinary roster changes do not silently delete history.

Oral evidence can contain sensitive personal information. Keep recordings appropriate to the lesson, avoid confidential information, and deliberately share exports only with the intended reviewer. This feature does not upload learner audio to a speech service or community publication endpoint.

## Compatibility and validation

Legacy question/session/drill scoring and assessed-work V1 remain unchanged. `advancedAssessmentScoringV1.ts` freezes the matching rules used by new evidence; future scoring changes require a new explicit version rather than reinterpreting historical submissions.

Focused coverage includes model bounds/replay, variants and rubric lineage, forged feedback, source drift, stale review CAS, repeated/interrupted operations, actual App authority, StrictMode UI, canonical/community save and publication, encrypted recovery and profile deletion. The browser suite exercises real responsive light/dark author, learner and reviewer flows, audio playback evidence, keyboard navigation and accessibility. Release validation uses the existing unweakened regression, native, Android, browser/API, integrity, website and signed-course pipelines. Exact release identifiers are recorded in the completed roadmap entry after delivery, not before validation.

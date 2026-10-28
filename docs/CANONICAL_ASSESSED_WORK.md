# Canonical assessed work: authoring, evidence and instructor review

## Capability and compatibility

Writing prompts, rubric criteria/levels, lab instructions/safety/tables/questions and
activity-log specifications use one worker-safe contract. Both canonical and community
editors expose structured authoring, stable identities, lesson attachments and strict
save/publication validation. Community drafts may remain incomplete for editing, but
publication cannot repair or discard malformed content. Published identity/reference
changes are checked before the existing immutable object and current-authorization
commit gates. Official signatures and licensing requirements are unchanged.

Legacy course normalization remains available for existing installed content. Untrusted
canonical imports and publication validate raw content before normalization. New typed
community assignment blocks do not permit unrestricted source-code blocks.

## Learner and instructor contract

Submitting assessed work captures a versioned, immutable original task and rubric,
learner response, and exact attachment bytes. Writing/lab/activity evidence is scoped
to the learner and course. Draft edits and later course revisions cannot rewrite old
submissions. Unconfirmed submission saves must not leak through either new evidence
or legacy work projections into classroom exports.

Hand-ins reuse the existing bounded schema, class HMAC, exact course filters, receipt
journal and projection recovery. The class secret protects against corruption and
mix-ups, not determined impersonation. No new identity or network authority is added.

An instructor inspects original prompts, lab safety/data, activity specifications and
attachments. A per-item decision chooses only levels present in the original rubric;
reviewed rubric decisions require all original criteria. Decisions and criterion notes
append to that exact hand-in and evidence ID. The derived score uses versioned rubric
sum/max semantics and is not automatically written to academic grades or attendance.
A receipt-wide review remains a separate decision and never silently approves every
rubric. Legacy receipts without original specifications remain readable but cannot be
retroactively assigned today's rubric.

## Recovery and privacy

Evidence travels inside existing progress and receipt files; there is no second review
store or broader native path allowlist. Existing compare-and-swap, pending import,
current membership, deletion markers and protected attachment behavior still apply.
Encrypted backup retains original snapshots and reviews and validates both learner
progress evidence and instructor history before restore mutation. No new cloud learner
storage is introduced. Full-profile deletion and exported-backup/shared-document limits
remain as documented in CLASSROOM_SUBMISSION_WORKFLOW.md.

Before downgrade, export a backup with this version. Older clients do not expose the
optional assessed-work evidence and may reject newer hand-ins; they must not silently
rebuild historical tasks or grades. Reopen or restore with a supporting version.

## Release acceptance

This capability remains local until both-editor create/save/reopen/publish/install,
learner repeat/interrupted saves, signed export, exact instructor review, task revision,
profile isolation, encrypted recovery and malformed input checks pass together.
Full regression, identity, integrity and production publication validation are mandatory.
The broad Shared canonical course and content model remains In Progress; audio/reader
parity, official promotion and other canonical resource families are separate remaining
work. Spreadsheet remains In Progress. No course content creation is part of this work.

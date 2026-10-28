# Classroom submissions, review and recovery

## Complete workflow in this integration branch

1. A learner works in a lesson-linked spreadsheet. **Grade** is practice feedback;
   **Submit for instructor review** captures a separate immutable workbook, original
   rubric/protection/tolerance and deterministic result. Editing later does not
   replace earlier submissions. Failed saves retain the same retry identity and
   are never described as confirmed, including after remount.
2. **Hand in work** reads persisted progress, filters exact assigned courses and
   withholds unconfirmed evidence. Configured learner profiles cannot export under
   a different selected roster ID; asynchronous learner changes invalidate export.
3. The instructor imports the hand-in from the existing teacher area. Schema,
   size, roster, course scope and HMAC checks precede mutation. An immutable receipt
   is retained before projecting work/files into ordinary learner progress.
4. The history shows every receipt, not only the latest grade. Inspect original
   attempts, writing/labs, spreadsheet cells/formulas/criteria and attachments.
   **Reviewed** or **Needs revision** appends a dated instructor decision with a
   note. Repeat clicks/retries do not duplicate a decision; later imports never
   retarget an earlier review. Student hand-ins cannot supply instructor decisions
   or academic grades. Practice results do not automatically become academic grades.
5. Encrypted family backup includes receipts, review history and pending markers.
   Restore validates evidence before changes; old backups without the ledger clear
   it during explicit full restore, avoiding unrelated old-family evidence.

## Persistence and recovery contract

`classroom-submissions` is a version1 named state file. No existing progress or
records schema is replaced; spreadsheet evidence is optional. Limits reject new
oversized content explicitly instead of silently deleting older evidence.

The receipt ledger is authoritative; merged progress is a recoverable projection.
Imports are **not a single transaction across all files**. If a write, membership
recheck or attachment operation fails, the receipt may remain **Received, import
incomplete**, with some projections already present. It cannot be reviewed until
completion. Retry uses the exact retained receipt and safely replays projections.
Reimport of an already complete receipt also repairs projections after a restore
or reset while preserving reviews and avoiding duplicate receipts.

Ledger mutation uses compare-and-swap/read-modify-write. Named-state saves share
coordination; browser IndexedDB CAS and native CAS protect conditional updates.
Native CAS is scoped to webviews in one application process, not separate desktop
processes. Whole-state replacement saves remain replacement operations, not an
automatic merge system. The teacher UI refreshes in-memory state after import.
Do not claim general multi-device synchronization or cross-process transactions.

Attachment import never intentionally replaces differing existing content;
identical data is idempotent. Document write coordination uses Web Locks when
available and otherwise a same-realm queue. Exact attachment bytes also remain
inside each signed receipt, independently of its ordinary document projection.

## Identity and privacy boundaries

A class file contains the HMAC secret. It detects damage and class mix-ups, **not
trusted student identity or determined impersonation**. Guest roster selection is
still a claim. Existing parent/teacher gates control instructor views; no account,
consent, signing, licensing, public role or new network endpoint is introduced.
No learner data, receipt payload or secret is collected in diagnostic artifacts.
The only added native state name is the exact `classroom-submissions` identifier;
path validation and existing item/command scope remain intact.

## Validation and release gate

Focused tests exercise learner submission/retry/remount, exact course/profile
export, malformed genuinely signed payloads, immutable conflicts, repeated and
out-of-order imports, timestamp offsets/ties, current membership, projection
failure/retry/reload, append-only reviews, encrypted recovery, document collisions
and state/CAS concurrency. A cross-layer test follows persisted learner evidence
through signed export, instructor import, review, changed assignment and replay.

The PR adds non-deploying native Windows Rust tests because this cloud workspace
has no cargo toolchain. Native CI, regression, identity and worker checks must pass
before the completed integration is released. Full regression and publishing
checks are required again after merge. No formal approval or release-integrity
check may be bypassed.

## Rollback and remaining roadmap work

Before downgrade, export an encrypted family backup with this version. Older apps
will not expose the new ledger, though its separate file remains; older backup
formats cannot preserve unknown ledger data. Do not delete the ledger to make an
older build appear compatible. Restore/reimport using a supported version.

This completes the classroom submission/history/review/persistence workflow, not
all planned Spreadsheet simulator functionality. Spreadsheet remains **In Progress**:
arithmetic-only formula support still needs functions/ranges and broader usability,
accessibility and independent learner verification. General canonical content parity,
web/app roadmap work precede any new course content creation.

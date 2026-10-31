# Local Classroom and teacher workflows

Status: In Progress. This branch completes the existing classroom roadmap capability, not online school identity or multi-device synchronization.

## Acceptance boundary

One local classroom ledger reuses current classes, course assignments, immutable hand-ins, gradebook and live-game navigation. Teachers create scoped groups/projects and milestones, select exact submitted text for moderated peer feedback, schedule conferences and learner actions, publish local notices with acknowledgments, and record field-trip reflections. Learners must see their assigned items, act, and receive only explicitly released feedback. These interactions never award grades, attendance, academic credit or credentials.

Current class membership and assignments, local adult/learner roles, session generations, persisted credentials and deletion tombstones must be checked before reads and at writes. Compare-and-swap preserves concurrent updates; immutable response source revisions prevent feedback from drifting to later edits. Teacher private notes, unreleased feedback and other learners' private work must not appear in learner projections. A peer receives only the teacher-selected immutable text, never an entire hand-in, grades, notebook or attachments.

Encrypted family backup includes the ledger; recovery validates before writing and quarantines publication/release authority until fresh local teacher action. Profile deletion removes private data and retains tombstones. Restore is multi-file and may partially complete on interruption; no atomicity claim.

## Local-only communication

Notices, conference arrangements and feedback are visible on this configured local/shared device. They are not email, push notifications, video calls, remotely delivered messages or verified school identity. Existing signed class/hand-in exchange remains separate. Public account-free learning is unchanged; native installer delivery follows a later app version.

## Required evidence

Synthetic teacher-to-learner-to-review workflows across all five item types; unrelated class/group denial; stale roles, source revisions, lock/deletion races; edit/revoke/retry/cancel/back/reload/offline/recovery; desktop and narrow-screen keyboard/accessibility screenshots. Existing signing, licensing, integrity, native storage and full regression checks remain required. No production learner/private account writes.

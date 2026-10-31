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

## Using the local workflow

1. In a configured local Classroom, unlock the teacher area and open **Class collaboration**. Existing **Classes and assignments**, **Hand-ins**, **Gradebook**, games and live-room destinations stay separate and reachable.
2. Choose a current class. Create groups if needed, then a project, peer-review task, conference, notice or field trip. Select its audience, save an unpublished draft, inspect it and explicitly **Publish**. Editing creates a new unpublished revision; group membership changes withdraw linked activities.
3. An adult authorizes the intended learner on this shared device. From **Courses → Open my classroom**, the learner sees only their current published items. Submit milestone work/peer feedback/reflections, record conference actions or acknowledge a notice. A submission does not create a grade, attendance entry or credit.
4. The teacher reviews dated immutable responses. **Save review (private)** does not expose feedback. **Release review** gives teacher notes only to the response author; approved project contribution text may reach selected project peers, and approved peer-feedback text reaches the original source author. **Needs revision** does not share a contribution with peers. Withdraw/revoke controls remove current learner access without rewriting history.
5. Refresh after conflicts; an old draft cannot overwrite another writer. Copy/cancel/reopen a changed draft rather than silently rebasing it. A withdrawn item conceals its source but preserves only the learner's own unsent text for copying/discarding. Lock/resume retains drafts; a full process reload loses unsaved in-memory text.

Peer-review source selection currently uses exact submitted writing/lab text from a complete current-class hand-in, bounded to20,000characters. It preserves original whitespace and receipt/work identity. No grade, attachment, notebook or whole progress record is shared. Other assessment evidence remains available through the existing instructor hand-in review rather than being automatically exposed to peers.

This ledger does not travel in legacy class/hand-in exchange files. Its workflows are local/shared-device; encrypted full Family backup is recovery, not cross-device messaging. Current production online school accounts, independent learner devices, video conferencing and notification delivery remain outside this capability.

## Validation progress

The actual-App browser suite passed all five loops at candidate5c64c75d on1280px light and320px dark with keyboard/accessibility checks, offline persistence, role/class privacy, cancellation, revision conflicts and withdrawal. All24screenshots were retained for original-resolution review. The Windows exact-state allowlist/native persistence suite passed. Actual Android acceptance, exact final-head regression and postmerge checks remain required; these preliminary results are not a merge or release claim.

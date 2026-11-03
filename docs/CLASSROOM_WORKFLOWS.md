# Local Classroom and teacher workflows

Status: Done for the local/shared-device capability. PR #129 merged as `9c8a8d96de0a85f4b22e280d2fd6cb7b0f6a8265`. Online school identity, independent-device synchronization and remote delivery remain separate capabilities.

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

Peer-review source selection currently uses exact submitted writing/lab text from a complete current-class hand-in, bounded to 20,000 characters. It preserves original whitespace and receipt/work identity. No grade, attachment, notebook or whole progress record is shared. Other assessment evidence remains available through the existing instructor hand-in review rather than being automatically exposed to peers.

This ledger does not travel in legacy class/hand-in exchange files. Its workflows are local/shared-device; encrypted full Family backup is recovery, not cross-device messaging. Current production online school accounts, independent learner devices, video conferencing and notification delivery remain outside this capability.

## Validation evidence

Exact feature head `78415126a0e1a57965cefbb5fc29a9778a154e38` passed all eight workflows. Actual-App acceptance covers all five teacher → learner → review loops at 1280px light and 320px dark, with no runtime errors, blocked external networking, keyboard/overflow/accessibility checks, cancellation, immutable source selection, conflicts, class/role isolation, private moderation/release/revocation, authenticated reload and offline persistence. All 24 original-resolution browser screenshots were inspected. Some mobile conflict/history content is outside the captured viewport; DOM assertions establish those outcomes.

Actual Android emulator run `41162632137` passed all 12 stages, including the existing installer permission/cancel/approval, corrupted-download rejection, SAF roundtrip, shared-device HOME lock and process restart. The new classroom flow proves a teacher's Bob-only notice, learner acknowledgment, released review and exact ledger persistence through process restart. Three native feature screenshots were inspected; the final review is below the captured fold and verified through DOM and ledger equality. Windows native persistence also passed. No physical-device or newly released installer claim is made.

All nine exact-merge push workflows passed: regression/identity `41163922628`, browser/live/D1/HTTPS `41163922541`, classroom acceptance `41163922534`, native persistence `41163922544`, private-account acceptance `41163922433`, integrity `41163922434`, website deployment `41163922630`, community API deployment `41163922528` and signed publishing `41163922472`. Publishing authenticated the prior catalog, verified unchanged immutable artifacts and byte-compared authoritative R2 catalog/signature readback at 03:29:28 UTC on 2026-10-31.

CI repairs retained all security gates: exact accessible field labels, existing source-test isolation, established erased-profile diagnostics, atomic compare-and-swap preservation of first concurrent deletion markers, the precise synthetic native fixture's default homeschool mode, and awaiting intentional deep-link restoration only after explicit learner authorization. No check was bypassed.

Read-only production verification at 03:38 UTC confirmed `/classroom-workflows` and `/parent/classroom-workflows` in regular and guest modes, including reload, show the configured-local-Classroom boundary and account-free public-learning guidance. Courses/Library guest navigation remained usable. Served asset `index-DikR45Wo.js` matches the merge deployment. No Family, account or learner records were created or opened; private workflows were exercised only with synthetic CI data.

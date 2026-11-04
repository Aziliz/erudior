# Learning diagnostics and targeted intervention

## Original acceptance and boundaries

The original teacher analytics roadmap (`8d90b78f`, consolidated in `077a9952`)
requires transparent misconceptions, reteaching groups, targeted follow-up,
differentiated assignments, classroom observations and parent reports. This is
one complete capability, not a replacement for the completed competency graph.

Acceptance:
- Explain educational skill gaps and observed response patterns with exact source
  identity, dates, amount of evidence and uncertainty. Unknown is not failure.
- Suggest same-skill reteaching groups within explicitly selected learners/classes;
  an adult chooses members and approves personalized support.
- Save/reopen differentiated plans with goals, rationale, exact installed activity
  resources and follow-up dates. Preserve source changes and missing resources as
  visible blockers, not silent substitutions.
- Deliver actionable tasks only to the intended learner, locally or via explicit
  per-learner file handoff. Existing enrollment and prerequisite gates still apply.
- Retain observations separately from measured evidence. Compare only compatible
  baseline/current evidence, describe change rather than causation, and require an
  explicit adult continue/revise/complete/cancel review.
- Preview/export one learner's support summary without classmates or secrets.
- Preserve retry identities, concurrent-edit conflicts, dirty drafts, live adult
  authorization, learner membership, encrypted recovery and profile deletion.
- Cover focused tests, end-to-end browser/accessibility and applicable release lanes.

No clinical diagnosis, psychological trait inference, automatic grade, credential,
new role authority, new course content or claimed AI generation is introduced.

## Architecture

`learningDiagnostics` projects the existing exact-source competency ledger without
changing its mastery rules. `interventions` holds immutable plans and append-only
adult observations/reviews. `interventionStore` checks live authorization and
membership around fresh source/evidence reads and conditional state writes.
The adult ledger is separate from learner progress. Learner handoff files contain
only actionable support instructions and exact resource references, never adult
notes, other learners, mastery authority or credentials.

Implementation and verification evidence will be recorded here before release.

## Using the complete workflow

1. Unlock the existing teacher/parent area and open **Learning diagnostics**.
   Choose a class (or the local family roster), learner and supported skill.
   Inspect evidence sources and repeated response patterns before drawing a
   conclusion. Limited evidence and unknown evidence are separate from a skill gap.
2. Review a suggested group or explicitly select learners. Enter a learning goal,
   differentiated support instructions, optional review date and actual linked
   lesson/practice resources. **Approve and assign plan** saves a separate immutable
   plan and fresh baseline for each learner. Different support needs use separate
   plans. A partial group save reports each failure; retry unchanged details does
   not duplicate the already confirmed plans.
3. The learner opens **Progress → Targeted learning activities**. Only their active
   local plans and explicitly imported recommendations are shown. Launch validates
   source content, profile, enrollment, course prerequisites and skill readiness.
   Unsupported/missing/changed resources stop visibly and need adult review.
4. For a different device, **Export learner activity file** creates a sanitized
   single-plan JSON file. The intended learner explicitly imports it and confirms
   the recipient. Files contain no roster, adult notes, assessment baseline, secret
   or grade. They do not authenticate the sender. Existing verified content must be
   installed; a file never grants enrollment or bypasses prerequisites.
5. Reopen a saved plan to record dated classroom observations or a follow-up review.
   Reviews capture current evidence; comparisons require compatible source lineage
   and new post-plan assessment evidence. Descriptive improvement is not proof of
   causation. Continue, mark for revision, complete or cancel explicitly. Revision
   suspends the old local task; approve a new plan to change immutable instructions.
6. Preview/export a private single-learner support summary. It includes current
   diagnostic evidence even before a plan exists, and distinguishes adult notes,
   baseline evidence, review-time evidence and current evidence.

## Privacy, recovery and limitations

The existing adult gate controls plan and private report operations. Live authority
and membership are rechecked around asynchronous reads and CAS mutations. Learner
handoffs are informational, not an adult authentication channel. No new network
endpoint or cloud learner database is added. Academic grades and mastery algorithms
are not changed by plans, observations, imports or completion.

`interventions` is an exact allowlisted named state on web/native. Encrypted family
backup includes it and validates its learner references before mutation. Legacy
full restore clears unrelated old intervention history. Full learner deletion
removes plans/notes and retains only an ID tombstone to prevent in-flight recreation.
Previously exported files/backups remain outside that deletion operation.

Offline handoff files are copies, not live synchronization: later withdrawal or
revision on the teacher device cannot revoke a copy already exported elsewhere.
Ask for the latest instructions before acting on an old copy. Local cancelled,
completed or revision-needed plans cannot be resurrected by importing the same ID.
Reports and handoffs should be shared only with the intended learner/guardian.

Named-state CAS protects concurrent writes within the supported app storage
coordination; it is not a distributed transaction across devices, course files and
learner progress. Fresh source/evidence rechecks reject detected races and retain
retry identities; uncertain writes remain visibly unconfirmed until reloaded/retried.

## Verification

Focused model, state, backup, task, stale-progress and StrictMode UI suites cover
provenance/uncertainty, group selection/partial saves, plan/event idempotence,
source/profile/authority races, report privacy, encrypted recovery and deletion.
Existing competency UI/persistence and canonical release-lane tests remain intact.
Frontend typecheck/build and worker typecheck plus isolated API/live/presentation
integration passed locally. Local aggregate `npm test` is blocked by sandbox tsx
IPC `EPERM`; Chromium launch is blocked by sandbox socket `EPERM`. Neither blocked
run is claimed as passed. The unweakened aggregate and real Chromium/axe suite run
in CI, along with native and applicable Android checks. CI and post-merge deployment
results must pass before the original roadmap row can become Done.

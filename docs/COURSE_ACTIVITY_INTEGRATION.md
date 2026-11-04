# Lesson-linked engine activities

Courses can link their existing `spreadsheetAssignments`, `advancedAssessments`,
`scientificWorkspaces` and `branchingScenarios` to lessons using `lessonId`.
The lesson shows only explicitly linked sources; the Assignments tab also lists
course-wide sources. No lesson prose, quiz questions, completion rules or historical
results are rewritten by this integration.

Each activity opens its own restorable course URL:
`/<course>/activities/<advanced|scientific|branching|spreadsheet>/<sourceId>`.
Return to lesson uses the source's current validated lesson link. Missing sources
show an unavailable message rather than launching a different activity.

## Supervising-adult handoff

Advanced, scientific and branching activities remain explicit local workflows:

1. Inspect the exact installed course ID/revision and source ID/revision, its
   readable content and inspection SHA-256 fingerprint.
2. Unlock the matching supervising-adult studio and select that installed source.
3. Copy it as an unreviewed local source, save, review its exact content and
   permissions, and approve it locally.
4. Select the intended learner and explicitly assign the saved revision. Advanced
   assessments also require selection of the intended question variant.
5. Open the lesson activity to find that learner's matching assignment.

Local copies have independent IDs/revisions. Optional `courseOrigin` metadata
records the originating course/source IDs and revisions; it grants no authority.
A lesson launch requires both matching origin and equality of the complete
canonical instructional source, ignoring only the independent local identity,
local approval, navigation metadata and lesson binding. Edited copies, a different
course revision, or stale sources cannot silently appear as the current source.
Generic source import/export strips this local binding; authored portable courses
cannot carry it. Backups preserve it as historical data under the existing restore
quarantine, never as fresh approval.

Older copies without the binding remain accessible on Progress and retain all
history. To connect the current course source, copy, review and assign it explicitly;
do not rewrite old assignments or results. An inspection digest is a comparison
aid, not a signature, verified authority or evidence of learning.

Spreadsheets retain their existing local draft, grading and immutable-submission
workflow. The dedicated route adds no adult approval requirement to that existing
workflow. Unsaved inputs, failed draft persistence and in-flight writes retain
navigation protection.

## Scope

This is reusable app integration with synthetic tests, not adoption into real
course artifacts. No private authoring sources, actual published course packages,
publication-review decisions, credential authority or signing policy are changed.
Content review and real learner pilot obligations remain separately deferred.

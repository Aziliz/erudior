# Spreadsheet assignment workflow

## Instructor

Open a course editor and choose **Spreadsheets**. Add an assignment after creating
at least one lesson. Choose the lesson, edit the starter cells/worksheets, add
numeric or text grading criteria, and protect fixed starter inputs. Cell
references preserve worksheet spelling and accept case-insensitive input.
Apply changes to the course, then save. Editing an existing assignment keeps its
stable ID. Removing an unpublished draft attachment requires confirmation;
removing a previously published identity is rejected by release revision checks.

Unapplied assignment edits cannot be silently skipped by tab navigation or course
save. A pending course save cannot be repeated or dismissed with Done. Edits made
during persistence remain dirty until a later save actually includes them.

## Learner

Course Work contains lesson-linked spreadsheet exercises. Each learner has a
separate draft key and the saved envelope identifies the exact assignment
content. Legacy unscoped drafts are not automatically adopted. Changed content
or damaged/protected-cell-modified drafts start from the current starter with an
explanation. Use the address field or bounded row/column paging to reach cells
outside the first viewport; calculated formula results are accessible text.

Grading stores the assignment and submitted-workbook identities with the score.
Earlier submissions are distinguished from current edits. Pending/failed saves
are not called saved, including after leaving and reopening the exercise.
Reset requires confirmation; draft-save and grading failures support retry.
This is local device storage, not cross-device synchronization or an access-control
boundary between people sharing the same unlocked browser profile.

## Review and publishing

The review panel displays lesson links, starter workbooks, protected cells,
criteria and tolerance. Explicit inspection acknowledgement prepares a receipt
bound to the exact portable course snapshot. Any course/reviewer change makes the
receipt unavailable until reviewed again. Export the snapshot and receipt as a
pair. Preparing this record does not authorize official publication.

The existing protected review/release process still requires a matching review
record, pinned signing authority, authenticated previous catalog and package
hashes, compatible revisions, and immutable publication checks. No review or
signature gate is skipped for spreadsheets. Malformed assignments fail visibly
at import rather than silently disappearing.

## Verification and remaining work

Focused tests cover canonical validation, stable identities, author/save/reopen,
learner isolation, full-address bounded navigation, persistence races/recovery,
review invalidation, and portable review snapshots. Full regressions run after
merge. These are DOM and library tests, not a claim of independent learner pilots
or complete accessibility certification.

The single public **Spreadsheet simulator** capability remains **In Progress**.
Community format/authoring/publication/install parity, richer formula/automation
support, and broader instructor/learner/publishing verification remain to finish.

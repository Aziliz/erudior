# Student dashboard and notebook

Open **Courses → Open student workspace**, or `/workspace` in the browser app. No website account or age gate is required. This is private, local planning—not community publishing, an assignment authority or a credential issuer.

## Use

- **Daily plan:** add personal tasks, choose a date, move between Planned/In progress/Done, and filter by date or overdue work.
- **Notebook:** keep independent plain-text notes, questions and reflections.
- **Reading shelf:** track offline books or installed texts; use the notes for author, reading position and reflections.
- **Goals:** describe the target, next steps and evidence of progress.
- **Projects:** track self-directed work; completed projects appear in the personal portfolio.
- Entries may link to an installed course, lesson, reading, reference or work resource. Removing a course preserves the entry but disables unavailable launches. Linking does not enroll, complete, grade or certify anything.
- Search and status filters apply to the selected section. Save explicitly; Cancel discards the draft. Navigation is blocked while editing or saving, and browser close/reload warns about unsaved edits.
- The existing **Courses, skills and progress** destination retains measured course progress, skill prerequisites and assessment evidence. These are not inferred from checked-off workspace tasks.
- The portfolio shows completed personal projects and the selected local learner's existing work photos read-only. Independent learners have a project collection; adult-managed reports, grades and photo editing remain in their existing protected area.

## Persistence, recovery and privacy

`Progress.studentWorkspace` is an optional versioned document. Older progress loads an empty workspace. Writes use the existing per-profile compare-and-swap transaction boundary, check captured profile identity and anonymous generation, and compare the edited entry's original snapshot. Unrelated concurrent entries survive; conflicting edits require reopening. Ordinary lesson-progress saves preserve the current workspace rather than overwriting it with a stale snapshot.

The schema rejects unknown fields, unsafe identifiers, invalid dates/timestamps, duplicate IDs, unsupported links, malformed objects and oversized content. Limits: 500 entries, 160 title characters, 20,000 body characters and 2 MiB UTF-8 serialized workspace. Text is rendered as text, never HTML; links are internal routes resolved only against installed sources.

Existing plain backup, encrypted family backup and anonymous recovery include the document and validate it before restoration. Anonymous privacy inventory reports workspace entries; anonymous erasure and learner-profile deletion remove the corresponding workspace. No cross-device sync or online account collection is introduced. Public temporary-guest sessions remain temporary unless the user chooses existing local storage controls; use backups for durable recovery.

## Verification

`tests/student-workspace.test.mts` covers schema and optimistic mutations; `tests/student-workspace-storage.test.mts` covers actual profile storage, concurrent writes and backups. Existing anonymous erasure/profile deletion regressions include workspace records. UI and real-app browser tests cover CRUD, authority separation, cancelled/repeated actions, profile switching, offline reload, route history, missing links, keyboard/accessibility and responsive layouts. Browser evidence is retained in the `student-workspace-browser` CI artifact.

# Course and pathway progress

The main **Courses** page summarizes the active learner's enrolled courses and saved course pathways. Each course has its own **Progress** tab with lesson completion, module quiz results, course-specific scores, practice coverage, relevant skills, and session history. Existing `/progress` links continue to open the Courses overview.

## Navigation and local workspaces

The main navigation shows **Library**, **Community** when enabled, and **Courses**. An independent learner has no family or classroom management item. An existing local homeschool workspace adds **Family**; an existing local classroom workspace adds **Classroom**. Both open the existing password-protected adult area. These labels describe the saved local workspace mode, not a verified online account role or institutional membership.

Local family/classroom setup remains available as a secondary action in **Library** when the build supports it. Search and the web download link remain accessible as utilities. This navigation change does not introduce accounts, school connections, family invitations, or new permissions.

## What the percentages mean

- Course progress measures completed current core lessons. Optional honors material and removed lesson IDs do not inflate or reduce the core percentage.
- Erudior's existing passed full-course exam completion route remains available. This is labeled **Completed by exam**; it does not fabricate lesson completions.
- Module quizzes, question accuracy, practice duration, and skill mastery remain separate measures. Course progress is not a certificate or a new grading rule.
- The overview's **Average course progress** gives each enrolled course an equal share. A course with no measurable lessons and no qualifying exam contributes zero and is labeled accordingly.
- Pathway progress uses equal shares for the courses in that pathway, including courses not yet started. Unavailable or unmeasured steps contribute zero. The next step is the first incomplete course in the chosen order.
- Aggregate percentages round down only after combining precise fractions. An incomplete course or pathway cannot round up to 100%.

## Enrollment and pathways

Single-user library courses count as enrolled courses. Family views use the current learner's enrolled course list; another learner's installed courses are not offered as custom pathway choices.

Following a pathway saves an ordered plan. It does not download or enroll all courses. A learner opens each available course through the existing catalog and assignment/prerequisite checks. The math starter contains Pre-algebra and Arithmetic, Algebra 1, Algebra 2, Geometry, Trigonometry, Precalculus, and Calculus. A German A1–B1 starter uses the corresponding published courses. Starters are offered only when all their courses exist in the current catalog.

Custom pathways can be named, reordered, edited, and removed. They use current catalog courses or the learner's existing library courses. Removing a pathway preserves all course enrollment and progress. Missing custom courses remain visible as unavailable steps until their content is restored. Removed catalog courses can retain recorded core-lesson progress only when the current catalog supplies a complete lesson-ID allowlist.

No Data Science courses are invented by this change. A custom sequence can use relevant available or imported courses; new course content follows the normal authoring and publication workflow.

## Persistence and recovery

`Progress.learningPathways` is optional for older files and is private to each learner profile. Validation bounds pathway count, course count, and title length and rejects duplicate IDs, malformed data, and unknown properties.

Pathway edits use a captured-profile compare-and-swap update. An editor checks its original pathway against the latest stored value, and profile changes or anonymous-data replacement invalidate stale edits. Successful updates merge only pathway state into the active UI, preserving unrelated newer activity.

Ordinary progress saves preserve the latest pathway list, including its absence, so stale activity cannot erase or resurrect a pathway. Backup restoration explicitly replaces pathways. Ordinary backups, family backups, and anonymous recovery preserve the validated choices. These preferences are not academic evidence or adult authority.

The previous advanced practice tools, cross-course skill evidence, session history, privacy controls, and backups remain available under **Courses → Study tools, skill evidence, and data**.

## Verification and review images

Run `npm run test:learning-progress-browser` for the real-app enrollment, pathway persistence, course navigation, keyboard/accessibility, and responsive workflow. The script uses real bundled course definitions with clearly synthetic local activity and blocks external requests. It writes screenshots and results to `test-results/learning-progress-browser`; GitHub Actions retains them as the `learning-progress-browser` artifact.

Run `npm run test:role-navigation-browser` for independent, local homeschool, and local classroom navigation, the existing adult password gates, per-course Progress, public URL compatibility, and responsive accessibility. Its actual-App browser screenshots use isolated synthetic local workspace data and are written to `test-results/role-navigation-browser`; they do not represent authenticated production accounts.

Model, persistence, recovery, course isolation, and UI regressions also run as part of `npm test`. Browser images are source-rendered app previews. They do not claim native Android system-bar or keyboard verification.

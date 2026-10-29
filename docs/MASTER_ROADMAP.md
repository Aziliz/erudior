# Erudior Master Roadmap — 2026-10-27

## Active whole-capability checkpoint — 2026-10-29

**Learning diagnostics and targeted intervention — Done.** PR #84 (`3a612bb70832d0cc801002c707128f8e62647b29`) completes the original single teacher analytics capability from `8d90b78f` / consolidation `077a9952` without duplicating the completed competency graph.

- Transparent exact-source skill summaries distinguish unknown/limited evidence from demonstrated difficulty, explain repeated-response patterns without causal or clinical claims, and suggest adult-reviewed reteaching/assessment groups. Differentiated per-learner plans retain exact activities, fresh baselines, dates and explicit adult approval.
- Own-learner actionable tasks and sanitized offline handoff preserve enrollment/prerequisite/source checks. Immutable plans and append-only observations/reviews support continue/revise/complete/cancel, descriptive compatible-lineage reassessment, and private single-learner parent reports. Handoff files do not authenticate the sender or grant academic authority; exported copies are not remotely revocable.
- CAS retries, group partial-save recovery, StrictMode/dirty-draft/interrupted flows, live adult/profile authority, encrypted family recovery and profile deletion passed focused and integrated tests. No clinical diagnosis, mastery/grade mutation, new role permissions, network learner service or course content was introduced.
- Exact-head full regression/build, real Chromium 320/1280 light/dark/keyboard/axe, native persistence and Android APK/optimized-size/emulator checks passed. All seven post-merge lanes passed: regression `40822019643`, native `40822019775`, browser/live `40822019669`, integrity `40822019630`, website `40822019624`, API `40822019612`, signed courses `40822019621`. The origin catalog/signature exactly matched signed artifacts; existing immutable packages were verified. Live app controls were verified at `app.erudior.com/progress`.
- Desktop installers remain deferred; no version/tag or desktop release was created. Independent Android work remains preserved. Full original acceptance, usage, privacy and offline-copy limitations are documented in `docs/LEARNING_DIAGNOSTICS.md`.

## Previous whole-capability checkpoint — 2026-10-29

**Teacher-paced and student-paced interactive presentations — Done.** PR #81 (`fde87085f2a15e06101dc2fa5b32e1cd3a2e6df1`) completes the original single presentation capability, not unrelated worksheet/lab/project generators.

- Reusable decks support source-checked authoring, reorder, save/reopen, duplicate, real export/import roundtrip, encrypted backup and conflict-safe adult persistence. Exact installed source content/revision and current adult authority are rechecked before delivery, including recovered rooms and concurrent course changes.
- Local and multi-device teacher-paced/student-paced delivery includes question/reveal controls, opt-in direct HTTPS video with transcript alternatives and timestamp pauses, private learner payloads, server-held unrevealed answers, reconnect/replaced-socket recovery and acknowledged closure. No academic evidence or course content was added.
- Exact-head full regression/build, real Chromium 320/1280 light/dark/keyboard/axe workflows, isolated API/live integration, native persistence and Android package/emulator checks passed. All seven post-merge lanes passed: regression `40817240716`, native `40817240641`, browser/live `40817240659`, integrity `40817240673`, website `40817240652`, API `40817240639`, signed courses/readback `40817240646`. Origin catalog/signature bytes match signed artifacts; existing immutable packages verified.
- Desktop installers remain deferred; no new version/tag or desktop release was created. Independent Android work remains preserved. Full acceptance/use notes are in `docs/INTERACTIVE_PRESENTATIONS.md`.

## Previous whole-capability checkpoint — 2026-10-29

**Learning game mechanics and live quiz modes — Done.** PR #77 (`1c525ae6fb294c688dd1e7cc540ffc1d4879d459`) completes the original single capability with installed-content review boards, bingo, memory and matching; local timer, nickname picker, balanced teams, teacher-tallied polls, text whiteboard, exit tickets and presenter view; plus individual, team and cooperative live quiz modes.

- Source eligibility/exclusions, reset/replay, keyboard use, 320/1280 light/dark layouts, overflow and axe checks passed in real Chromium. Server-authoritative phase/scoring, anonymous learner aggregates, reconnect/close recovery and stale/repeated controls passed isolated API/live integration. Games do not confer academic credit or persist classroom notes.
- All six applicable post-merge lanes passed: full regression/build `40812211502`, browser/live `40812211375`, integrity `40812211455`, website `40812211543`, community API `40812211436`, and signed-course publication with authoritative catalog/signature readback `40812211612`.
- Native persistence code and its workflow-trigger paths were unchanged; that lane did not rerun for this feature. Desktop packaging remains deferred. Existing Android preview work is preserved; this feature does not claim a new installer/version/tag. No new courses or split roadmap rows.

## Previous whole-capability checkpoint — 2026-10-28

**Cross-course competency graph — Done.** PR #76 (`dac59988ca0ff30457204344bd0890dd7d315e32`) completes the original capability without adding course content or splitting it into artificial rows.

- Existing 45 approved skills across 12 courses use exact course/bank/question identities, validated prerequisite links and exact-pool adaptive practice. Same-topic or broad module questions cannot confer evidence; unknown evidence remains unknown.
- Private course-independent history preserves source/revision lineage and retained prerequisites through uninstall/reinstall and encrypted recovery. Legacy revisionless answers remain in history but require new assessment after an identity baseline. Changed sources cannot recycle old mastery. Active snapshot references avoid replay/double counting.
- Student and existing PIN-gated parent/classroom-teacher views separate assessed estimates from explicit reasoned placement, overrides and revocation history. Plaintext imported manual history is non-operative until an adult reissues a decision. This is learning guidance, not a certification or external credential.
- Exact-head full regression/build and native tests passed before normal merge. All six post-merge lanes passed: regression/build `40784958918`, native `40784958941`, integrity `40784958984`, Pages `40784958891`, community API `40784959028`, and authenticated signed-course publication/readback `40784958970`.
- Desktop packaging remains explicitly deferred to a later consolidated release. No new installer or tag is claimed. Next roadmap work has not started in this checkpoint.


**Shared canonical course and content model — Done (implementation, integrated validation and web/API delivery).** On 2026-10-28 the user explicitly deferred new desktop installers until other features are complete and authorized continuing the roadmap. This status does not claim desktop distribution. The complete original model covers modules/lessons, supported question/bank metadata, readers, audio/language, rubrics/work, images and interactive blocks, including authoring, learner, review, publishing, import/export, revisions and recovery. No partial sub-feature rows or completion-count inflation.

- Integrated in PR #73 (`04cfcfd1`): strict canonical envelopes and explicit runtime adapters; reader authoring and revision-aware persistence; complete metadata/audio editing; advanced source validation; safe code/figure/SVG rendering; owned-media handling; canonical community author→review→publish→install and encrypted backup/recovery.
- Acceptance: 28 runtime sources roundtrip exactly, 25 raw sources migrate, and three malformed sources reject. Full regression/build, native persistence, integrity, Pages, community API and signed-course publication passed after PR #73.
- Release preparation: PR #74 sets version 0.25.0. Its post-merge randomized regression exposed exact fractional cancellation; PR #75 fixes only proven rational zero, without broad tolerances or authored course edits. Release target `304969275a78a474e6a78c94aba771cce335775e` includes that fix. Applicable post-merge regression/build, Pages, community API and signed-course checks passed. Native/integrity source is unchanged from the passed `4e9177bb` runs; those path-filtered workflows did not rerun on PR #75.
- Deferred release work: build and verify signed Windows, macOS and Linux installers/updater assets in a later consolidated release after other features are complete, as explicitly requested by the user. The currently published desktop version is v0.24.0; no v0.25.0 tag or desktop distribution is claimed. `30496927` remains the validated canonical implementation checkpoint, not a required tag action now.
- Security, signing, licensing, immutable publication baselines and media ownership gates remain enforced. No new course content is authorized before engine, app and website work is complete. Continue one whole unfinished feature at a time. This roadmap-only update does not alter the validated implementation.

## Implementation checkpoint — 2026-10-28

Classroom history/review/recovery and community spreadsheet workflows are deployed through PR #64 (`52fef593`). Canonical/community writing, rubric, lab and activity authoring, publication/install parity, original task/response evidence, exact human rubric review and encrypted recovery are deployed through PR #71 (`b8a1c516`). All relevant post-merge full regression/build, native persistence, integrity, Pages, community API and signed-course publication checks passed. Test-only PR #69 repaired an asynchronous UI-test race without relaxing assertions. Independent release lanes from PR #70 and other website work are preserved.

**Current counts:** Lesson Engine 14 Done, 2 In Progress, 10 Planned (26 entries). No new rows or completion-count inflation. Canonical implementation and web/API delivery are complete; installers are deliberately deferred, and the simulator retains its original unfinished scope.

**Next unfinished entry in existing Lesson Engine order: Learning content interoperability (CASE, QTI, LTI and Common Cartridge) — Planned.** Learning diagnostics and interactive presentations are complete. Continue one whole capability at a time; no new course content until engine, app and website work is complete. Consolidated desktop packaging remains deferred as requested.

**Spreadsheet simulator — In Progress.** Its instructor/learner/review/publishing workflow is complete. Original scope (architecture `cd9e4e11`, roadmap `7f0da7aa`, later consolidated) also includes spreadsheet functions, named ranges, validation rules and safe simulated macro teaching. Those remain unfinished. Optional Excel-compatible import/export was separate; no imported VBA or untrusted macro execution is permitted.

Courses remain last, after all other engine, website and app features. Public roadmap data in `src/lib/roadmap.ts` is synchronized with this checkpoint. Historical notes below are retained as history, not current status.


## Mission and release policy
All courses are free to read without accounts. Homeschool learners follow grade-appropriate core courses plus parent-selected additions. Professional CE/qualifying education is optional, enrolled, account-backed and only called state-approved after approval. Keep 1.0 scope finite: high-school core first, then K–5, 6–8, Spanish and electives. Require independent content review and real learner pilots. Do not count community-created demonstration courses as completed official courses.

## Course update
### P0 / high school
- English 9–12: composition, research, world/American/British literature, rhetoric and senior project.
- Chemistry and Earth/Environmental Science alongside existing Biology and Physics; practical lab investigations and safety.
- World History, US History, Government/Civics, Economics; source analysis, geography and document annotation.
- Health, PE, art, music, personal finance, computer science.
### P1 / K–8
- Kindergarten–Grade 5 Math, Language Arts, Science and Social Studies, with art/music/health/PE. Systematic phonemic awareness, phonics, fluency, writing, reading comprehension, numbers and data.
- Grade 6–8 core, interdisciplinary science, geography and algebra preparation.
- Spanish 1–2 (listening/speaking), expand German B2 and other languages later.
### Future electives
- Life skills, personal finance progression, digital citizenship, typing and computer literacy, critical thinking, media/AI literacy, communication, engineering and robotics.
- Psychology, philosophy, entrepreneurship, consumer math, career exploration, apprenticeships/trade introductions, advanced math/science.
### Professional real estate
- The six Colorado 168-hour subjects: Real Estate Law and Practice (48), Colorado Contracts and Regulations (48), Closings (24), Trust Accounts (8), Current Legal Issues (8), Practical Applications (32).
- Contract lab: official versioned forms, offers, contingencies, inspection objections, counterproposals, agency and listing agreements.
- Closing workbook: six columns, property tax/HOA prorations, seller net, cash-to-close, commission/payoff reconciliation.
- Trust-account simulator: client ledgers, deposits/disbursements, three-way reconciliations, audit scenarios.
- Transaction simulator: intake → representation → pricing → offer → negotiations → title/inspection/financing → closing → archive; include adverse outcomes.
- Map lessons and assessments to regulator outlines; defend equivalent instructional workload without artificial timers or fluff. Seek approval before offering qualifying certificates.

## Web app update
- Maintain public browse/read/practice with no sign-in. Optional guest local progress.
- Community Course Creator: consistent module/lesson authoring, add/move/delete, images, tables, Markdown, question banks, media, code, phonics, maps, timelines, work and rubrics.
- Single canonical content specification with data-preserving promotion; admin review, immutable version, image packaging, official publisher authorization.
- In-editor help and full community author handbook, examples, validation messages, save/reload test and publish/install test.
- Teacher Assistant: game modes (quiz battle, review board, bingo, memory, matching), interactive presentations, polls, whiteboards, timers, team randomizer, exit tickets.
- Teacher studio: worksheet, quiz, rubric, discussion, project, lab, presentation and study-guide builders from verified content. Require teacher approval for generated materials.
- Teacher analytics: misconception summaries, group recommendations, interventions, rubrics and parent communication.
- Parent and child sign-in: neutral age screening, verifiable parental consent for under-13 profiles, restricted child access, parent PIN/reauth, teen and adult transitions; private by default.
- Professional-only credentials: verified enrollment, official issuer, signed PDF, unguessable ID, public privacy-preserving lookup and revocation. No claim of state credit without authorization.

## Application update
- Multi-child family dashboard; grade-level core assignments with parent-added electives and variable subject-level placement.
- Student own device support: parent-provisioned restricted student login under 13; optional teen independent credentials at 13; unchanged student ID; adult control transition at 18.
- Multi-device sync, interrupted exercise recovery, local drafts, conflict handling; no duplicated credit.
- Graduation planner, transcript/GPA and credit audit, report cards, attendance, state reports, subject standards mapping, transfer credit and portfolio.
- Student workspace: daily plan, notebook, reading shelf, progress/skill map, projects, goals and optional achievement badges.
- Course material inventory, field trip and off-platform activity capture, parent guides, accommodations and independent study.
- Consent, privacy/retention operations, audit logs, least privilege, encryption, backup restoration and WCAG testing.
- Interoperability: CASE, QTI, LTI, OneRoster and Common Cartridge as future-ready design goals.

## Engine update
- Canonical content model: stable course/module/lesson/question IDs, rich text, assets, standards, activities, audio, labs, simulations, assessment and portfolio semantics. Versioned migrations and roundtrip tests.
- Cross-course skill/prerequisite dependency graph, diagnostics and mastery-based remediation; transparent explanations.
- Interactive case file/document engine and approved form templates; annotation, editable overlays, instructor feedback and versioned source forms.
- Workbook/ledger engine with deterministic financial formula checks, partial-credit multi-step math, rounding and accounting validation.
- Scenario and deadline engine with persisted state and consequences.
- Reader, map/timeline, simulation, code and language tools must function equally in community and official courses.
- Question integrity: varied question types, question bank provenance, retake rules, scoring review and correction history.
- Portfolio and educational evidence records; graded work, read-aloud/recording privacy, reports.
- Professional learning/credential tracking separate from public practice and homeschool records. Verify identity where required; record instructional equivalency under approved method.
- Security/privacy: COPPA, FERPA-compatible services, applicable state privacy laws, age-specific permissions, minimal-data storage, verified credential registry, retention and recovery.
- QA: complete test suite, typecheck/build, worker CI, live browser create→save→reopen→publish→install, device/accessibility tests, independent course review and learner pilots.

## Delivery sequencing
1. **Release essentials:** Complete high school core, required engines, course QA and homeschool graduation controls; fix editor data preservation and accessibility/security blockers.
2. **K–5:** Complete official core and band arts/PE; verify pre-reader autonomous experience.
3. **6–8 and Spanish:** Complete bridge courses and language audio/speaking.
4. **Teacher Assistant:** Release an MVP of games, teaching utilities and verified lesson-to-activity.
5. **Further electives and professional programs:** Expand by demand and regulatory authorization.

## Proven vs planned
Existing working functionality documented in `src/lib/roadmap.ts` under `ENGINE` stays labeled done. Community creator revisions and promotion scaffolding in draft PR #1 are **in progress**, not live or approved. Proposed topics remain **planned** until verified in released code and independently reviewed course content.

## Engine publishing integrity — implementation progress (2026-10-28)

- **In draft PR #11 (not released):** deterministic v1 export/import, structural checks for IDs and references, revision compatibility checker, and publishing preflight.
- **Production publisher guard:** `npm run courses:publish` requires `--previous-dir PATH` or `COURSE_PREVIOUS_RELEASE_DIR`; `--dev` remains available without a baseline. Prior catalog must include `courses` and its referenced files. Existing course revision may be repackaged only with identical bytes; changed content requires higher revision and retention of progress-bearing IDs.
- **Still required before release:** trusted acquisition and signature verification of the actual previous production catalog, first-release provenance authorization, deployment integration, full sample-catalog CI and browser/recovery tests. Do not label the shared canonical model Done until these pass and the PR is merged.

### Trusted release verification — development slice
- Previous catalog bytes are verified against an Ed25519 signature when COURSE_PREVIOUS_PUBLIC_KEY is supplied; production requires this key.
- Every previous course file used as a revision baseline is verified against its signed catalog SHA-256 digest before comparison.
- The publisher still needs deployment wiring to fetch the latest published release and securely provision its trusted public key. The Lesson Engine item remains **planned / in draft**, not Done.

### Engine Slice 11 — CI cadence and manifest safety
- Full Lesson Engine regression suite is now configured for **push to main only** (merge); no pull-request or per-commit test-suite trigger.
- Production publisher rejects duplicate course IDs/source entries, unsafe source paths and malformed prior catalog schemas before generating signed files.
- **Still in PR #11, not released:** trusted release acquisition, revision comparisons, validation and signing preflight. Full automated tests deliberately await merge. Do not mark the canonical course model complete until merged validation succeeds.

### Engine backlog progress estimate — 2026-10-28
- The public roadmap currently lists **26 planned Lesson Engine tasks** and existing completed capabilities separately. This PR addresses part of the canonical course/content model, revision protection and publishing integrity, but does not complete all 26 tasks.
- Estimated delivery remaining, grouped into **larger functional slices**, not one tiny fix each: ~3–5 slices to finish and integrate canonical content/publishing (pending CI and deployment compatibility); ~5–8 for cross-course skills, placement and mastery; ~6–10 for teacher learning tools, games, content generation and intervention; ~8–14 for document, financial, case, science and regulated-professional engines; ~5–8 for assessments, content review, interoperability, privacy and end-to-end QA. **Total: ~27–45 substantial slices**, subject to findings and scope.
- Test policy: full suite only after merge to main; draft PR is not considered verified or Done. Update public roadmap status only when implementation has merged and validation succeeded.

### Slice 13 — Explicit first-release publishing
- Signed empty baseline is created **only** when a human manually dispatches the site workflow with `bootstrap_first_release=true`, the remote catalog returns HTTP 404, and the production signing key matches the app-pinned public key.
- All ordinary publishing still requires a signature-verified previous catalog; first-release bootstrap is never automatically activated on a failed fetch.
- Existing catalog courses with established revision numbers can be imported during this one-time initialization. After a release exists, newly introduced courses must begin at revision 1.
- **Status:** implementation on draft PR #11, awaiting merge-only CI and deployment validation; keep public Lesson Engine status planned.

### Slice 14 — Publishing integration blocker fixes
- Corrected prior-course filename validation so valid immutable `course.rN.json` paths are accepted during subsequent publication.
- Corrected the explicitly bootstrapped catalog signature output to a newline-terminated signature string.
- **Status:** both fixes committed on draft PR #11, not merged or verified. The full test suite remains scheduled for merge to `main` only.

### Slice 15 — Immutable artifact deployment guard
- Cloudflare R2 publication now fetches existing versioned course/state files and compares exact bytes before skipping upload. Identical files are reused; mismatches fail publication rather than silently accepting stale or conflicting immutable artifacts.
- HTTP responses other than 200 (verified existing) and 404 (new upload) fail closed. Catalog publication remains last after all immutable files have been verified or uploaded.
- **Status:** committed on draft PR #11; merge-only CI and live deployment verification outstanding. Do not mark the canonical course model Done yet.

### Slice 16 — Catalog publication race guard
- Before uploading the new catalog, the release workflow re-fetches the live catalog with no-cache intent, verifies its signature against pinned Erudior keys, and compares bytes/signature with the authenticated baseline used to validate the update.
- Authorized first-release publishing rechecks that no catalog has appeared. A changed or inaccessible catalog stops the release rather than overwriting it.
- **Limitation:** This is optimistic concurrency protection, not atomic compare-and-swap. A separately authorized writer could still race between recheck and upload. Object-store generation-conditional writes or a centralized single-writer release service remain required for a strict guarantee.
- **Status:** committed in draft PR #11; do not mark the roadmap item Done until merge-only CI and live deployment verification succeed.

### Slice 17 — Stale release prevention
- The site publisher now verifies that its checked-out commit equals current `origin/main` before uploading course packages, and checks again immediately before catalog publication. New commits supersede stale queued or long-running releases.
- The workflow uses `set -euo pipefail` for file uploads so failed commands stop publication; the existing GitHub Actions `site` concurrency group serializes this repository's deployments.
- **Boundary:** These safeguards prevent superseded in-repository workflows from publishing stale catalogs, but they are not an atomic global lock against external writes. Strict cross-client exclusivity still needs a conditional commit or dedicated single-writer service and exclusive credentials.
- **Status:** committed on draft PR #11; full tests remain merge-only. Do not mark the shared canonical course model Done until post-merge verification.

### Slice 18 — Release read-back verification
- After upload, the publisher now downloads the authoritative R2 catalog and detached signature and compares both byte-for-byte with the locally signed release. A mismatch fails the deployment before downstream website work.
- This detects failed or corrupted publication but does not make the two-object catalog/signature update atomic. Existing readers must tolerate short propagation windows; a future single signed manifest object or conditional single-writer commit should address atomicity.
- **Status:** draft PR #11, unmerged. Full test suite runs only after merge. Public roadmap remains Planned pending successful verification.

### Slice 19 — Integration blockers and merge preparation
- **Fixed:** Publication checks now reject dangling lesson-to-module references *before* `normalizeCourse` can silently repair them; regression case added.
- **Hardened:** Previous-release fetch validates catalog format/version, unique course IDs, and filenames tied to course IDs before accepting downloaded artifacts.
- **CI policy:** Merge-only Lesson Engine workflow includes previous-release recheck and trusted-key source changes; no full PR-branch test suite is run.
- **Merge gate:** PR #11 is still in draft. Before merging, review source-format compatibility with the existing 20 published sample courses; then merge and use post-merge CI to verify the complete workflow. If post-merge CI fails, revert or repair promptly before relying on the new publisher.
- **Remaining architectural limitation:** catalog.json and catalog.json.sig are independent R2 objects, and the recheck is not atomic against an external publisher. A single authorized publishing path with exclusive credentials or atomic manifest pointer is still required for full guarantees. Do not claim the backlog item Done before post-merge verification.

## Cross-course competency graph — initial implementation (2026-10-28)
- **PR under development:** Stable cross-course skill IDs, directed prerequisites with missing-link and cycle checks, weighted topic evidence from multiple courses, minimum confidence for mastery, readiness gates, and recommendations for unmastered ready skills.
- **Future integration:** map canonical courses' topics/assessments to approved skill definitions, persist course-independent learner mastery, support explicit placement and teacher override, expose progression in student and parent views, and test privacy/accessibility.
- This item remains **Planned** publicly until merge-only CI completes successfully and at least one course uses the graph end-to-end.

### Cross-course competency graph — placement integration slice (2026-10-28)
- Added `collectCompetencyEvidence` bridge from existing course/question/drill mastery to shared skill IDs, without changing stored Progress format.
- Added `studentCompetencyPlacement` with prerequisite gates, course-specific suggestions, and interpretable mastery/confidence explanations; unknown mastery remains unknown.
- Added targeted tests for missing evidence, recommendation order, blocked prerequisites and nonmutation, included in merge-only full suite.
- **Still outstanding:** real authored skill taxonomy mapped against existing courses, student and teacher interfaces, placement override/history, and graph-driven adaptive practice. PR #15 remains draft and public status stays Planned until merged and verified.

### Post-merge canonical publisher verification — October 28, 2026
- Lesson Engine integrity workflow for merged PR #11: **passed** (GitHub Actions run 40645742318).
- Website/course publishing run 40645742240: **failed** at “Fetch and authenticate previous release”: the served file `lang-german-a1.r3.json` did not match the SHA-256 recorded in the signed catalog. Publication stopped, as designed.
- Investigate whether R2 origin contents, public CDN/cache, or an older immutable object diverged; compare signed catalog digest with authoritative object bytes before choosing a repair. Do not bypass signature/hash checks or mark production publishing Done.

### Cross-course taxonomy slice — 2026-10-28
- Authored thirteen stable, prerequisite-linked competencies for Pre-algebra, Algebra 1 and German A1, mapped to lesson IDs currently listed in the real course catalog. Added validation that all referenced lesson IDs exist.
- Skill assessment evidence remains intentionally unassigned until question-bank topic labels are audited: simply completing an instructional lesson does not count as mastery. No skill is automatically certified or unlocked from lesson availability.
- Regression tests are committed and run only after merge. PR #15 remains draft; mapping evidence, UI and placement integration remain outstanding.
- Production publishing is blocked by a SHA-256 mismatch for the hosted German A1 r3 file. The signed catalog and remote object must be reconciled without bypassing integrity checks.

### Competency graph — assessment-linked evidence slice
- Added a resolver that associates authored skill lesson IDs with actual question topics only when a question is referenced by the lesson's quiz. Generic same-name topics elsewhere in the course do not confer evidence.
- Added the student placement entry point from authored curriculum + installed courses + saved Progress, plus coverage reporting for authored skills without linked assessment.
- Added tests for linked-quiz evidence, unrelated-topic exclusion, unknown mastery, and prerequisite blocking. Full suite is merge-only.
- **Limitation:** Some existing courses' assessments may not be linked directly on lessons; their skills will remain unassessed until verified bank-topic mappings are added. Student UI and persistent graph lineage are still pending; keep the public competency graph Planned.

### Student-facing skill pathway slice
- Progress page now renders a Learning path using installed courses, saved practice evidence, next-skill recommendations, locked prerequisites, and an all-skills drill-down.
- Unlinked assessments do not count as mastery; the interface explains when skills are unassessed, and skill paths appear only for supported installed courses.
- **Still draft:** broader assessment coverage, parent/teacher controls, and merge-only build/test verification. Public roadmap remains In Progress until validated and merged.

### Competency graph — partial-install stability (2026-10-28)
- Student Progress learning paths now use a shared prerequisite-closed eligibility function rather than attempting to render skills from missing course dependencies.
- Algebra 1 installed without Pre-algebra no longer causes an invalid graph via missing prerequisites; uninstalled course skill pathways are omitted until dependencies are available, without inventing mastery.
- Added merge-only regression coverage for no courses, Algebra 1 alone, Pre-algebra alone, and all three mapped courses installed.
- **Status:** PR #15 remains draft. Integration is committed but neither merged nor full-suite verified. Public status remains In Progress.

### Two-slice competency and publishing update — October 28, 2026
- **Competency coverage:** PR #24 merged. Skill graph expanded from 27 to 45 authored definitions across 12 existing courses, including Trigonometry, Precalculus, Calculus, Biology, Physics and German B1. New course-availability/prerequisite test cases are included in the merge-only suite.
- **Previous-release reliability:** PR #25 merged. Course downloads now use bounded retries and longer timeouts, keeping signed catalog verification and SHA-256 integrity enforcement mandatory.
- **Outstanding:** Public course publishing has experienced both a German A1 digest mismatch and a later download timeout. Neither cause is fully resolved or independently verified in production. Keep production course publishing repair **In Progress**.
- **Policy:** Roadmap edits are committed directly to main; application/engine code may use PRs. Full tests are merge-only.

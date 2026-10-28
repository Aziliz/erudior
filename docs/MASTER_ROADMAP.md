# Erudior Master Roadmap — 2026-10-27

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

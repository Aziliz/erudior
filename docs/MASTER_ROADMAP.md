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

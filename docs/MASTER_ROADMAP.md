# Erudior Master Roadmap — 2026-10-27

## Active whole-capability checkpoint — 2026-10-29

**Privacy-preserving learner data architecture — Done (reusable engine; production server identity disabled).** PR #95 (`105b496075b07f359785a9e26b01e0f09b9cdef5`) completes the original `8d90b78f` local anonymous practice, server-backed account progress, isolated credential registry, retention/deletion and recovery engine scope.

- Minimized opt-in checkpoints contain only source-bound non-scoring lesson progress and aggregate practice observations, encrypted before transfer. Explicit preview, memory-only passphrases, external purpose-bound authorization, CAS conflicts, terminal erasure/expiry and staged recovery prevent silent uploads or authority/grade changes. Production identity, guardian-consent verification, separate storage/trust, monitored retention sweeps and backup/deletion reconciliation require separately authorized setup; all new production bindings remain absent. Community authors and credential issuers are not learner identity providers.
- Full **local-only** anonymous archives intentionally include private notes, work, history, pending session and attached files; they are not minimized server checkpoints and are never uploaded automatically. Inventory, encrypted export, explicit typed deletion/replacement confirmation and source-bound recovery preserve unrelated profiles, authentication, courses and settings. Unique attachments are removed; shared or uncertain references are retained and reported. Durable generation fences reject stale progress/session/document writers until reload. Imported educational decisions do not acquire verified authority.
- Browser replacement is one IndexedDB transaction. Native replacement is process-locked with ordinary-error rollback, **not multi-file power-loss atomic or coordinated across independent processes**: abrupt interruption may retain new attachment bytes or make a pending session unavailable; keep the recovery archive, restart, re-inventory and retry. Local erasure never claims to delete remote copies or separately exported backups. Existing credential registry isolation and historical assessment evidence remain intact. See `docs/LEARNER_DATA_PRIVACY.md`.
- Final head `ff868ae79e57a402d02065a5c7fca61161251ef8`: official regression `40918019843`, browser/D1/TLS/cross-tab storage `40918019789`, native `40918019865` and all three Android gates `40918020150` passed. All 44 Chromium states were inspected full-height at native resolution across 320/1280 light/dark with keyboard and WCAG checks. Focused model/store/actual-App authority/UI/backup/anonymous storage and server tests, frontend/worker types and build passed; independent original-scope/security review cleared.
- Exact-merge postrelease regression `40920038576`, browser `40920038516`, native `40920038682`, integrity `40920038592`, website `40920038574`, API `40920038668` and signed courses `40920038470` all passed. Signing job `123610467919` verified 21 unchanged immutable artifacts and the authenticated prior catalog, then both authoritative R2 catalog/signature byte comparisons at 17:27:04 UTC. Live deployed app privacy UI/assets and both `GET /learner-progress/status` and `GET /credentials/status` were verified read-only with `enabled:false`. No real learner records, production profile/data deletion, persistent credentials, trust provisioning, course content or installer release was used or created.

**Independent course review, accessibility and learner pilot verification — Planned, deferred.** Synthetic engine verification is not an independent course review or a real learner pilot. This obligation remains explicit and receives no Done credit.

## Previous whole-capability checkpoint — 2026-10-29

**Credential integrity and compliance evidence — Done (reusable engine; production issuance disabled).** PR #94 (`11c4ddd6dad07343d46042ba0afe2a31d25d6ff8`) implements the original `8d90b78f` enrollment, instructor approval, tamper-evident records, equivalent-hours methodology, secure PDF and revocation engine. It never treats an unapproved program or local educational decision as qualifying authority.

- Independently configured enrollment/instructor/issuer signatures bind exact program/version, subject, source evidence and methodology. Distinct signed command purposes, atomic issuance uniqueness/idempotency, signed event/index/request lineage and terminal revocation preserve audit history. Fresh issuer-authenticated read-only audit retrieval recovers exact private signed commands/artifacts after lost responses without restoring authority.
- PDF evidence is deterministic safe text with an exact-byte detached Ed25519 proof, **not PAdES or accreditation**. Public status has no learner identity/evidence/grades; it is bound to a random challenge, capability digest and expiry. Historical artifacts remain current-status unknown until fresh verification. Private educational exports are explicit, authority-checked and never uploaded automatically.
- Production credential configuration, separate registry bindings and issuer keys are absent. No real qualification, identity verification, key/trust provisioning, role grant or institutional approval occurred. Actual institutional authorization, approved program/method, verified enrollment/instructors, secure issuer service and privacy/recovery policy require separately authorized setup. A complete rollback can omit a later signed revocation; production recovery needs trusted monotonic checkpoints/reconciliation. No arbitrary registry restore route exists. Operational website/app credential and verified-enrollment rows remain separate and Planned.
- Final head `2fa9acce700f833627207f4c4b01552dfb03a25a`: official regression `40895590486`, browser/API/D1/TLS `40895590399`, all three Android gates `40895590421` passed. All 24 Chromium screenshots were reviewed full-height at native resolution across 320/1280 light/dark, keyboard and WCAG checks; padded event-table columns and scroll behavior verified. Focused model/recovery/actual-App-authority/UI/worker tests, frontend/worker types and build passed; independent original-scope/security review cleared. Native state/allowlists and historical grading/course signing are unchanged.
- Exact-merge postrelease regression `40897347741`, browser `40897347665`, integrity `40897347950`, website `40897347743`, API `40897347669` and signed courses `40897347817` all passed. Signing job `123529958929` verified 21 unchanged immutable packages and the authenticated previous catalog, then authoritative R2 catalog/signature byte comparisons at 15:09:53 UTC. Live app render/deployed final UI assets and `GET /credentials/status` returned `enabled:false`, no-store and no-referrer. No production learner/profile or credential mutation was used for validation.

**Content review, versioning and auditability — Planned, skipped at user request.** On 2026-10-29 the user explicitly said to ignore another content review because prior review had already occurred, clarified that engine features should later be integrated into courses themselves, and required remaining engine features first. No new content-review redesign or course-correctness audit was performed; no Done credit is claimed. Existing review, signing, licensing and integrity checks remain intact.

## Previous whole-capability checkpoint — 2026-10-29

**Advanced assessment and feedback — Done.** PR #93 (`67965ebdc2a5aa785ead0fd2828a03c1c76e8472`) completes the original `8d90b78f` acceptance: multi-step math work, oral assessment, rubric revision history, question variants, integrity controls, misconception reporting and verifiable assessment lineage.

- Structured authoring provides explicit finite variants, ordered math responses and reasoning, oral prompts, versioned criterion-level rubrics, assistance instructions and authored response-pattern definitions. Canonical/community save/reopen, reviewed publication, installation and local source approval preserve exact definitions. Changed sources and changed rubrics require explicit greater revisions; assignments pin the variant and source rather than silently rerolling.
- Learners record stepwise answers/reasoning, oral transcripts with optional bounded local audio upload/playback, and assistance declarations. Transcript-only accommodation is explicitly identified. Frozen V1 numeric/text response matching is not symbolic proof validation; oral performance and reasoning require human review. Corrections preserve append-only history and immutable submitted prefixes.
- Human rubric judgments and evidence-linked misconception observations append with stale-review CAS protection. Authored response-pattern matches remain distinct from instructor interpretation and never establish the cause of an error. Exact source, variant, rubric, response-event, submission and review lineage remains inspectable/exportable. Restored source approvals and imported reviewer provenance are independently quarantined; source reapproval alone never authenticates an imported judgment.
- Current-family authority, asynchronous profile/credential changes, repeated/interrupted writes, privacy deletion and encrypted recovery are tested. Existing quiz/session/drill scoring, assessed-work V1, homeschool grades and learning diagnostics remain unchanged. No microphone permission, external audio scoring, identity/proctoring assurance, automatic academic grades, qualification or credential grant is introduced. No new course content; installers/version/tag remain deferred. Usage and limitations: `docs/ADVANCED_ASSESSMENT.md`.
- Final head `cfd7ed05dae10d9231a1bc36aaf1916022f8e9e0` passed regression/build `40883158444`, real browser/API/D1/TLS-LTI `40883158462`, native persistence `40883158621` and all three Android gates `40883158503`. All 32 mobile/desktop light/dark keyboard/WCAG states were inspected at native resolution, with independent original-scope/security/privacy review. An initial release-lane guard found missing shared-validator trigger paths; the repair preserved separate community/course pipelines and the unchanged assertion. Local aggregate execution was constrained by tsx IPC, not substituted for exact official CI.
- Exact merged-main regression `40885295956`, browser `40885295939`, native `40885295978`, integrity `40885296430`, website `40885295947`, API `40885296539` and signed courses `40885296436` all passed. Signing job `123487257695` verified all 21 existing immutable artifacts, authenticated the prior catalog baseline and byte-compared authoritative R2 catalog/signature against signed release artifacts. Live app assets and the advanced-assessment panel match site job `123487256561`; public API readback passed without production learner mutations.

**Scientific and engineering workspaces — Done.** PR #92 (`a198b87cf799a86a4940d1324dc4544353f34cd8`) completes the original `8d90b78f` acceptance: guided labs, measurements, uncertainty, graphing, simulated instruments, engineering design and safe instructor-reviewed evidence.

- Versioned bounded definitions support hypotheses, guided procedure and safety notes, unit-labelled manual observations with explicitly stated absolute uncertainty intervals, reproducible ideal circuit/gas instruments, accessible graphs with exact data tables, design iterations, criterion comparisons, alternatives/tradeoffs and conclusions. Frozen V1 numerical adapters preserve historical calculations; the existing simulations and assessed-work V1 evidence remain unchanged. Results are educational models, not empirical validity, statistical confidence, calibration or safety certification.
- Structured canonical/community authoring preserves exact definitions through save/reopen, review, publishing and installation. Published identity and lesson references remain stable; changed definitions require greater revisions. Local source review is distinct from publication review. Assignments retain exact approved snapshots; later source changes cannot rewrite past trials or submissions.
- Append-only journals preserve corrected trials and design history; immutable submissions, comparisons and human feedback remain separate from calculated criteria/completeness. Live profile/credential checks, CAS, stable retries, privacy deletion, encrypted backup preflight and all-source restore quarantine are tested. Fresh local review receipts never rewrite historical assignment snapshots. Adult-required step notes are learner reports, not authenticated supervision signoffs.
- Final head `85c4ae205fa75d235c607c3306a2dcc3ed855d8d` passed full regression/build `40874788245`, native persistence `40874788148`, all three Android APK/size/emulator gates `40874788506` and complete browser/API/D1/TLS-LTI lane `40874788415`. All 28 Chromium 320/1280 light/dark states passed keyboard, overflow and configured WCAG checks; all 28 were independently inspected in full at native resolution. A malformed synthetic fixture was repaired without weakening domain validation; visual review improved graph tick typography, with actual rendered size assertions across nested evidence views.
- All seven exact-merge post-release lanes passed: regression `40876745223`, native `40876745170`, browser/API tests `40876745232`, integrity `40876745242`, website `40876745249`, community API `40876745240`, signed courses `40876745295`. Independent logs verified the authenticated prior catalog, 21 unchanged immutable artifacts and authoritative R2 catalog/signature byte comparisons. Live Progress renders scientific workspaces and the current-profile boundary; App/index/storage asset hashes match the deployed build, and public API readback passed without production learner changes.
- See `docs/SCIENTIFIC_WORKSPACES.md` for numerical assumptions, workflow and recovery boundaries. No real equipment control, arbitrary imported programs, professional/safety authority, external institutional hand-ins, credentials or new courses are supplied. Desktop installers/version/tag remain deferred; separate security, licensing, signing and human-review boundaries are intact.

## Previous whole-capability checkpoint — 2026-10-29

**Branching scenario and timeline engine — Done.** PR #91 (`896070011aa8f829b6bc58a7d23ad3c9f7642bbf`) completes the original `8d90b78f` acceptance: persistent fictional case files, decision consequences, deadlines, state changes, transaction simulation and project milestones.

- Reusable strict typed decision graphs, conditional choices and declarative effects use an explicit simulated integer clock. Inclusive deadlines apply consequences once in chronological order, with authored-order ties; timeline observations show due ticks, and terminal narrative outcomes remain separate from required-milestone completeness. Cycles, malformed graphs, unsafe values, overflow and unsupported code are rejected.
- Structured authoring preserves exact definitions through canonical/community save, reopen, review, publication and installation. Changed published source requires a greater scenario revision. Local source review is separate from course publication approval; assigned snapshots and prior results never silently change. Synthetic project and generic fictional transaction paths exercise the same engine without new course content.
- Guarded learner inputs, profile/credential rechecks, serialized CAS and stable retry identities preserve interrupted work. Replayed journals, immutable checkpoints, revision comparisons and append-only human feedback remain distinct from computed outcomes. Encrypted recovery quarantines all restored sources, records fresh review provenance and retains historical snapshots; full profile deletion removes private case evidence. Historical timelines and prior document/transaction/presentation/spreadsheet evidence semantics are unchanged.
- Final head `d5a0d4a2d8f0540c1a46736816d37bca93f8c7fb` passed full regression/build `40865436676`, native persistence `40865436632`, all three Android APK/size/emulator gates `40865436658` and complete browser/API/D1/TLS-LTI lane `40865436694`. All 24 Chromium 320/1280 light/dark states passed configured WCAG and keyboard assertions; independent native-resolution review confirmed readable authoring, deadlines, timelines and historical comparisons.
- All seven exact-merge post-release lanes passed: regression `40866930907`, native `40866930894`, browser/API tests `40866930889`, integrity `40866930934`, website `40866930898`, community API `40866931010`, signed courses `40866930947`. Independent logs verified the authenticated previous catalog, 21 unchanged immutable artifacts and authoritative R2 catalog/signature byte comparisons. Live app branching controls and App/index/storage asset hashes match the deployed build; public API readback passed without production learner changes.
- See `docs/BRANCHING_ENGINE.md` for deterministic semantics and recovery boundaries. No real legal, medical, financial or professional authority, calendar-compliance claims, arbitrary code, external hand-ins, credentials or new courses are supplied. Desktop installers/version/tag remain deferred; separate security, licensing, signing and human-review boundaries are intact.

## Previous whole-capability checkpoint — 2026-10-29

**Spreadsheet simulator — Done.** PR #90 (`1870505425ab5be50e5e791a87ef7cb0acd0577c`) completes the original reusable grid scope from architecture `cd9e4e11` and roadmap `7f0da7aa`, preserving the earlier canonical/community instructor, learner, review, publishing and recovery workflows.

- Explicit V2 workbooks add bounded functions, ranges/names, quoted cross-sheet references, dependency recalculation, typed validation and cell explanations. Structured authoring retains metadata through save/reopen, exact review, community publication and installation. Synthetic fixtures demonstrate closing/proration and generic-function reuse without new course content or state-specific engine branches.
- Learner metadata and worksheet identity remain instructor-controlled. Protected raw cells, staged valid edits, current-profile checks, exact retry identities and separate drafts preserve work. Historical V1 grading is unchanged; V2 submissions retain exact source, workbook, deterministic grade and optional bounded simulation history. Mixed-version immutable classroom review and encrypted recovery are validated.
- Macro teaching uses only declarative set/copy cell operations with exact previews, explicit per-run consent, atomic protected-cell/validation checks and replayable before/after traces. No JavaScript, VBA, imported program, filesystem or network operation executes. Local traces are educational evidence, not authenticated proof of identity or an instructor decision.
- Final head `d91a052fe1555e2e9ea24cae282c500dba1b9595` passed full regression/build `40859583865`, all three Android APK/size/emulator checks `40859583817`, and the complete browser/API lane `40859583734`. All 24 real Chromium 320/1280 light/dark workflow states passed every configured WCAG assertion; actual keyboard scrolling and independent native-resolution visual review confirmed readable controls, cell references and bounded tables. Native persistence/state allowlists are unchanged.
- All six applicable exact-merge post-release lanes passed: regression `40860632436`, browser/API tests `40860632504`, integrity `40860632572`, website `40860632576`, community API `40860632554`, signed courses `40860632480`. Authenticated previous catalog and 21 existing immutable artifacts were verified; authoritative R2 catalog/signature bytes exactly matched signed release artifacts. Live app controls and deployed App/spreadsheet/evidence asset hashes match the build; public API readback passed without production learner changes.
- Supported semantics and limits are documented in `docs/SPREADSHEET_SIMULATOR.md`. This is not universal Excel compatibility or exact-decimal financial software. Optional Excel exchange, official templates/new courses, regulatory approval, credentials and consolidated desktop installers remain outside this delivery. No security, licensing, signing or human-review gate was weakened.

## Previous whole-capability checkpoint — 2026-10-29

**Jurisdiction-configurable instructional-hour and assessment evidence tracking — Done.** PR #88 (`278a8ccaf0beeaaeb9ad784adc791ccc9cb37d05`) delivers the full original requirement-to-evidence workflow. PR #89 (`66e65a921475c17bc932e3688934672d92a343f5`) repairs a pre-existing probabilistic drill-generation failure exposed by the mandatory signed-course gate; no course content or validation assertions were weakened.

- Adults author/import, save/reopen and independently review versioned jurisdiction outlines, effective dates, exact installed lesson/assessment source snapshots and defensible equivalent-workload rationale. Assignments retain exact reviewed requirements; no artificial browser timers or automatic credit.
- Learners capture immutable local observations or explicitly unverified outside attestations. Legacy lesson/attempt history does not prove historical source identity; reports disclose that limitation. Complete mapped-bank coverage and configured passing thresholds are distinct from workload minutes.
- Human approval, rejection and revocation append with stale-review compare-and-swap protection. Bounded, nonduplicating educational totals, requirement shortfalls, source/revision comparisons and portable raw-evidence/decision audits are fully integrated. Existing grades, mastery, homeschool records and signed classroom submissions remain unchanged.
- Fresh credential/profile/source checks, private learner projections, profile deletion and encrypted recovery are validated. Restored packs and all restored credit decisions are independently quarantined; fresh pack review records a receipt but never silently reactivates imported credit.
- Exact-head full regression, real browser/mobile/keyboard/all-WCAG, independent visual review and all three Android gates passed for the feature and repair. Native persistence passed for the instructional integration and remains unchanged by the drill-only repair. Final repaired-main regression, browser, integrity, website, API and signed-course lanes passed; authoritative R2 catalog/signature byte comparison and all 21 immutable artifacts were verified. Live app and public API readback passed.
- This is local educational evidence, not approved regulatory hours, identity-verified enrollment, accreditation or a qualifying certificate. No current laws, official forms, new course content or institution submissions were supplied. Separate professional enrollment/credential rows remain planned. Installers/version/tag remain deferred. Usage and limitations: `docs/INSTRUCTIONAL_EVIDENCE.md`.

## Previous whole-capability checkpoint — 2026-10-29

**Jurisdiction-configurable regulated transaction simulations — Done.** PR #87 (`0c7e2c92f2fe27069b817756ac1729e7c25c4fca`) completes the three original capabilities consolidated in `29486a54`: contracts/counteroffers, trust-account reconciliation and full transaction case simulations.

- Adults author/import, save/reopen and explicitly review versioned educational rule packs with jurisdiction/source/effective-date metadata, exact saved document snapshots, form roles and declarative rules. Assignment retains exact reviewed sources; imports and restored backups never convey operative approval without local re-review.
- Learners preserve offer/counteroffer lineage, explicit party responses, fictional deadlines and title/inspection/financing outcomes. Client-owned exact-minor-unit deposits, disbursements and append-only reversals support three-way reconciliation, outstanding items, discrepancy and negative-bank audit findings without floating-point drift or cross-client spending.
- Cases cover intake, representation, pricing, negotiation, successful closing or adverse termination and archive. Frozen outcome documents, recoverable drafts, immutable evidence checkpoints, append-only feedback and side-by-side source/evidence revisions preserve history. Current profile/adult authority, CAS retries, encrypted recovery and deletion are enforced. Same-device portable evidence is not an authenticated remote hand-in.
- Exact-head full regression/build, native named-state validation, all three Android build/size/emulator checks and real Chromium 320/1280 light/dark/keyboard/axe passed, with independent core/acceptance and visual review. All seven post-merge lanes passed: regression `40841340467`, native `40841340406`, browser/live `40841340485`, integrity `40841340338`, website `40841340448`, API `40841340302`, signed courses `40841340255`. Authoritative R2 catalog/signature readback exactly matched signed artifacts; existing immutable packages and the authenticated prior baseline were verified. Live app controls and deployed asset hashes were verified without profile mutation.
- No current laws, official forms, new course content, real money movement, filing, legal/financial advice, regulatory hours or credentials are supplied. Generic branching, spreadsheet and instructional-hour capabilities remain separate unfinished rows. Desktop installers/version/tag remain deferred. Usage and limitations: `docs/REGULATED_TRANSACTIONS.md`.

## Previous whole-capability checkpoint — 2026-10-29

**Interactive document and case file engine — Done.** PR #86 (`8b9963c2753fdd24942154d4b9ef5020201b4272`) completes the original single capability from `8d90b78f` / consolidation `077a9952`: fillable forms, document annotation, side-by-side revision comparison, evidence submissions and instructor feedback with approved versioned source forms.

- The adult studio authors reusable source pages, provenance/license notes, typed fields and page overlays; exact saved source revisions require explicit educational review. Multi-document cases retain approved source snapshots. Source updates require deliberate reapproval/reassignment and cannot mutate earlier evidence.
- Learners fill fields and annotate exact source text or page regions, save/reopen drafts, submit immutable evidence, inspect feedback and revise a copy into a new submission. Adults append feedback and compare actual old/new source, values, annotations and feedback. Source/evidence exports are explicitly local educational records, not authenticated remote classroom hand-ins.
- Fresh profile/adult gates, unlock-credential binding, CAS conflicts, retries, deletion tombstones and encrypted recovery preserve privacy and history. Restored historical sources/feedback remain intact but imported approval authority is quarantined until exact local re-review. Existing signed classroom workflows remain unchanged.
- Exact-head full regression/build, native named-state tests, Android APK/optimized-size/emulator and real Chromium 320/1280 light/dark/keyboard/axe passed. All seven exact-merge post-release lanes passed: regression `40834135725`, native `40834135728`, browser/live `40834135766`, integrity `40834135727`, website `40834135733`, API `40834135818`, signed courses `40834135795`. Authoritative catalog/signature readback exactly matched signed artifacts; unchanged immutable packages were verified. Live app asset hashes match the deployed build.
- This is a same-device educational simulation engine, not official forms, legal/medical advice, electronic signatures or external filing. No course content or third-party credentials were added. Desktop installers/version/tag remain deferred. Full usage, scope and recovery boundaries are documented in `docs/DOCUMENT_ENGINE.md`. Branching scenarios remain their separate original capability.


**Learning content interoperability (CASE, QTI, LTI and Common Cartridge) — Done.** PR #85 (`62613b9b8a1bb8e95e84aa16ba5ea0f55f2efa8f`) completes the original single standards-ready content exchange capability from `8d90b78f` / consolidation `077a9952`, with explicit supported profiles rather than a certification or universal LMS compatibility claim.

- CASE 1.1 framework packages preserve external identifiers/URIs, support explicit local mapping review save/reopen and stable namespace-based skill export without modifying mastery. QTI 3 choice/exact-string item exchange includes exact no-credit preview and explicitly reviewed new native choice-bank adaptations; unsupported grading/content fails instead of silently changing semantics.
- Actual Common Cartridge 1.3 ZIP/manifest exchange preserves accepted static resources and organization order, with safe local preview/re-export and clearly labelled selected lesson text snapshots. No active HTML or external fetch runs on import. Official CASE JSON schema, QTI 3.0.1 XSD and CC 1.3 manifest/link XSD validation passed independently of self-roundtrips.
- Isolated LTI 1.3 OIDC resource-link handling uses pinned public keys, exact registered context/targets, browser-bound state/nonce and atomic D1 replay consumption. Real D1 and Chromium cross-site HTTPS form-post/replay/privacy tests passed. **Production LTI remains disabled until separately approved platform trust configuration and institution-specific testing.** No credentials, real LMS registration, account/role grants, grades, enrollment changes or source-signature authority were created. OneRoster remains explicitly unsupported adjacent roster/SIS work.
- Exact-head full regression/build, Android APK/optimized-size/actual emulator and Chromium 320/1280 light/dark/keyboard/axe passed. All six applicable post-merge lanes passed: regression `40827398132`, browser/LTI `40827398179`, integrity `40827398139`, website `40827398110`, API `40827398157`, signed courses `40827398190`. Published catalog/signature exactly matched signed artifacts and unchanged immutable packages were verified. Live API shows “LTI connections are not enabled”; live app bundle hashes match the deployed build.
- Native persistence source/trigger paths were unchanged; no extra native-state lane was triggered. Desktop installers remain deferred, with no new version/tag or course content. Full profile limits, privacy and actual activation prerequisites are documented in `docs/CONTENT_INTEROPERABILITY.md`.

## Previous whole-capability checkpoint — 2026-10-29

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

**Current counts:** Lesson Engine 24 Done, 0 In Progress, 2 Planned (26 entries). No new rows or completion-count inflation. All requested non-skipped engine capabilities are implemented and validated as reusable code; production identity/credential setup and consolidated installers remain separately gated or deferred.

**Remaining obligations:** Content review, versioning and auditability stays Planned at the user’s request to skip another review; independent course review, accessibility and learner pilot verification stays Planned and deferred, not satisfied by synthetic tests. The requested engine-first work is complete. Integrating the new features into existing courses is the next coordinated scope, not claimed by this update; no course-content changes have begun. Consolidated desktop packaging remains deferred.

**Spreadsheet simulator — Done.** PR #90 completes the original functions, named ranges, validation and safe simulated macro teaching scope alongside the existing instructor/learner/review/publishing workflow. Historical grading and immutable evidence are preserved. Optional Excel-compatible import/export remains separate; imported VBA or untrusted macro execution is never permitted.

Under the latest user clarification, integrating engine features into the existing courses waits until the remaining engine capabilities are complete. Installers remain deferred. Public roadmap data in `src/lib/roadmap.ts` is synchronized with this checkpoint. Historical notes below are retained as history, not current status.


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

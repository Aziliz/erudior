# Examiner: handoff

State as of 2026-10-12, v0.3.0 (commit `8ade459`). Read this first in a new chat.

## What it is

Examiner is Jon's desktop study app for licensing exams. It runs on Linux (.deb, .rpm, AppImage) and Windows (NSIS .exe, .msi).

- **Stack:** Tauri 2 (Rust) with React 19, TypeScript and Vite.
- **Repo:** GitHub `Aziliz/examiner`. The app ID is `com.aziliz.examiner`.
- **First course:** "Colorado Real Estate Broker", bundled with the app and installed on first launch.
- **Later:** a CCNA course, which must stay separate from the Colorado content. That separation is why the app organizes content into courses.

Jon prefers terse answers and wants clarifying questions asked rather than assumptions made.

## Project files

| File | Contents |
|---|---|
| `claude/HANDOFF.md` | This doc |
| `claude/examiner-source.md` | Every source file in the repo, concatenated, with paths |
| `claude/colorado-broker-course.json` | The built course pack (`samples/colorado-broker-course.json` in the repo) |
| `claude/research-notes.md` | The content writers' verified Colorado facts, with source URLs |

The code is on GitHub at https://github.com/Aziliz/examiner (branch `main`, pushed 2026-10-12). To keep working with code, attach that repo to the chat. The Claude GitHub App has push access.

## Features (v0.3.0)

- **Library:** organized by course; standalone question banks are still supported.
- **Import and export:** courses and banks are plain JSON. Formats are in `docs/COURSE_FORMAT.md` and `docs/BANK_FORMAT.md`.
- **Course tabs:** Today (planner), Lessons, Questions, Notecards, Math drills, Glossary, Quick reference.
- **Study planner:**
  - Takes an exam date, study days per week and new cards per day.
  - Builds a daily checklist of lessons, card reviews, practice, drills and full exams in the review phase.
  - Shows a streak and a readiness estimate.
- **Lessons:** Markdown, sanitized through `marked` and `DOMPurify`.
  - `[[term]]` links open glossary pop-ups.
  - Completion is tracked, and each lesson has "practice this" and "flip related cards" links.
- **Timed exams:**
  - A random draw with per-section quotas, auto-submit, and an answer-sheet navigator.
  - **Split timers:** each section runs on its own clock, and a finished section is locked.
  - **Per-section pass marks:** an exam passes only if every section passes.
  - Flags and notes; results broken down by section and topic.
- **Practice mode:**
  - Shows the answer and explanation as you go.
  - Filters: all, unseen, last missed, under 70%, flagged; also by topic or section.
- **Resume:** exams and practice autosave to `session.json`; a banner offers Resume or Discard. The clock pauses while the exam screen is closed.
- **Notecards:**
  - Simplified SM-2 spaced repetition (Again/Hard/Good/Easy) with a limit on new cards per day, plus a cram mode that doesn't change the schedule.
  - Decks can be edited in the app.
  - An automatic "Missed questions" deck is built at runtime from questions you've gotten wrong.
- **Math drills:** JSON templates with random variables, labeled choices and calculated fields.
  - A safe arithmetic evaluator (`src/lib/expr.ts`); the content security policy blocks `eval`.
  - Answers are checked within a tolerance, and each problem shows a worked solution.
- **Glossary and quick reference:** a searchable glossary and printable sheets.
- **Search:** Ctrl+K searches lessons, glossary, reference sheets, questions and cards.
- **Editors:** a question bank editor, a course editor (details, modules, lessons, glossary, reference sheets, drill JSON with a live sample), and a deck editor.
- **Progress page:** history, score trend, weakest topics, backup and restore (one JSON file), and a "Check for updates" link.
- **Course updates:** each course has a `revision` number. A newer bundled revision is offered in-app and keeps progress, because progress is keyed by ids.
- **App updates:** built in but turned off while the repo is private (see Releases).
- **Theme:** light, dark or system. The answer-sheet design uses Public Sans and Source Serif 4, bundled via `fontsource`.

## Code map

| Path | Role |
|---|---|
| `src-tauri/src/lib.rs` | Rust commands described in Storage below, plus `install_kind` |
| `src/App.tsx` | View router, the app API passed to pages, startup seeding, resume, course-update and app-update banners, top-bar search |
| `src/lib/types.ts` | All data types: Bank, Question, Course, Lesson, Deck, Card, Drill, Progress, etc. |
| `src/lib/validate.ts` | Bank parsing and normalizing, warnings, serializing |
| `src/lib/course.ts` | Course parsing and normalizing. Banks inside a course get the runtime id `${courseId}__${localId}`. |
| `src/lib/storage.ts` | Tauri invoke calls, with a localStorage fallback when the UI runs in a plain browser; backup and restore; the session file |
| `src/lib/session.ts` | Drawing exam questions, timed blocks, practice pools, scoring, `finishSession`, `attemptPassed`, saving and restoring a run, `defaultExamOptions` |
| `src/lib/srs.ts` | Spaced repetition scheduling, queues, `missedDeck` and `studyDecks` |
| `src/lib/planner.ts` | Activity log, streak, course numbers, readiness, `planToday` |
| `src/lib/drills.ts`, `src/lib/expr.ts` | The drill engine |
| `src/lib/updates.ts` | The updater wrapper (currently disabled by `UPDATES_ENABLED`) |
| `src/pages/*` | Library, CourseHome (all the tabs), LessonView, Runner (exams and practice), Results, BankHome, Editor (banks), CourseEditor, DeckEditor, CardsRunner, DrillRunner, RefView, ProgressPage, SearchPage |
| `content/` | Course sources and `build_course.py`, described in the next section |

## Content pipeline (Colorado course)

`python3 content/build_course.py` turns these sources into `samples/colorado-broker-course.json`:

- `content/parts/n1–n4.json` and `content/parts/s1–s4.json`: lessons, questions, cards and glossary
- `content/refs/*.md`: the reference sheets
- `content/drills.json`: the drill templates

**Counts:** 8 modules and 48 lessons, each with a 10-question end-of-lesson quiz (`content/lesson-quizzes.json` plus quiz-fill parts `f1`–`f4`). The bank has 458 questions: 219 national and 239 state. 590 cards, 448 glossary terms, 25 drills. App v0.4.0.

| Module | Topic |
|---|---|
| n1 | Property |
| n2 | Money and math |
| n3 | Contracts and disclosures |
| n4 | Agency, fair housing and management |
| s1 | Colorado license law |
| s2 | Colorado relationships and trust accounts |
| s3 | Colorado contracts and forms |
| s4 | Colorado closings and special topics |

There are also 453 cards in 8 decks, 365 glossary terms, 7 reference sheets and 22 drills.

**Exam config mirrors PSI:**
- 154 questions per exam: 80 national and 74 state.
- National portion: 120 minutes, 75% to pass (60 of 80).
- State portion: 110 minutes, 71.6% to pass (53 of 74).
- **Web/browser storage (v0.8.1):** outside Tauri, courses, banks, progress and the session live in IndexedDB (`src/lib/webstore.ts`), not localStorage (5 MB quota overflowed with 16 bundled courses: QuotaExceededError). Old localStorage data is moved over on first open.
- **App v0.8.0: bundled math and science courses (all released).** Sources in `content/math/<course>/` (see `content/math/AUTHORING.md`), built by `python3 content/math/build.py [course]`. Only courses with `released: true` in course.yaml build into `samples/math/` and ship (listed in `samples/math-index.json` by `order`); drafts build into `samples/math-drafts/` (git-ignored). Jon asked for each course to be finished one at a time, in the order Pre-algebra, Algebra 1, Algebra 2 (College Algebra skipped: Precalculus covers it), Geometry, Trigonometry, Precalculus, Calculus, Multivariable, Diff Eq, Linear Algebra, Statistics (split into AP Statistics and a calculus-based Probability & Statistics course, Jon's choice), Physics (split into algebra-based Physics, University Physics I and II). Each course gets an independent review (every question re-solved, drills generated and recomputed) recorded in its PROGRESS.md before release. Released: Pre-algebra (36 lessons, 400 questions, 87 drills), Algebra 1 (32 lessons, 379 questions, 80 drills), Algebra 2 (26 lessons, 298 questions, 71 drills; ends with intro probability/normal distribution and unit circle/trig graphs). Geometry (38 lessons, 425 questions, 93 drills), Trigonometry (38 lessons, 430 questions, 88 drills), Precalculus (40 lessons, 481 questions, 95 drills), Calculus (44 lessons, 480 questions, 90 drills), Multivariable Calculus (37 lessons, 425 questions, 72 drills), Differential Equations (38 lessons, 423 questions, 78 drills), Linear Algebra (38 lessons, 447 questions, 78 drills), AP Statistics (38 lessons, 410 questions, 79 drills), Probability and Statistics (34 lessons, 422 questions, 96 drills), Physics, algebra-based (46 lessons, 517 questions, 133 drills), University Physics I (28 lessons, 294 questions, 80 drills), University Physics II (18 lessons, 187 questions, 53 drills). All 15 planned courses are released. Typing exactly the shown (rounded) answer is always accepted (`shownValue` in src/lib/answers.ts). Known engine limit: factoring drills also accept the expanded form (expression answers are checked by value, not form).
- **App v0.7.0: math engine.** Drills support trig/logs/constants/logic, drill functions (`funcs`) with numerical `deriv`/`integ`/`solve`/`limit`/`extremum`/`sum`, `where` re-roll rules, multi-part `answers` (number, exact fraction, expression checked by sampling, units, sig figs, sci), typed math input with a KaTeX preview, KaTeX math everywhere (`src/lib/math.ts`; inline `$` uses Pandoc rules so prices stay text, verified 0 false hits on the real estate course), and SVG graphs/diagrams (`src/lib/figure.ts`) in drills (`figure`) and lessons (```plot/```shape blocks). `samples/math-sampler-course.json` (built by `content/math-sampler/build.py`, not bundled) demos it. `npm test` runs `tests/` and CI runs it before building. Not done yet: answering by clicking on a graph.
- **App v0.6.2, course `revision` 13.**
  - Lesson page: lesson text, an End-of-lesson quiz panel (launches the quiz as its own screen; Jon tried an inline quiz in v0.6.0 and asked to revert it), then an orange Study tools box with the topic notecards plus the lesson's math drills and quick-reference sheets (`content/lesson-links.json`).
  - Lessons tab: a quiz chip per lesson (size, best score, passed) that starts the quiz; a "Module N quiz" row per module that unlocks when all its lessons are complete. Quiz recording lives in `src/lib/quiz.ts`.
  - Quizzes come from coverage maps in `content/quizzes/*.json`: lesson quizzes sized to each lesson's teaching points (9–29), module quizzes 36–51, 70% to pass. Module completion is `progress.modulesDone`.
  - 809 questions (414 national, 395 state). Glossary 937 entries; bolded lesson terms link to it; abbreviations come from `content/abbreviations.json`.

**How it was made:**
- Eight writer agents worked from `content/SPEC.md`, and independent fact-checkers then reviewed them using `content/REVIEW.md`.
- Colorado facts were checked against C.R.S. and Commission rules (4 CCR 725-1 on law.cornell.edu), dre.colorado.gov, and the 2026 Commission-approved forms.
- Choices were rebalanced so the correct answer is rarely the longest one. Before the rebalance, the longest choice was correct about 65% of the time on the state questions.

**Still open on content:**
- **Van Ed pass partly done (2026-10-12).** Gap-fill at the outline level is done: Claude read the course outlines of the six Van Ed content courses (Law & Practice, Contracts & Regulations, Closings, Legal Issues, Record Keeping & Trust Accounts, Practical Applications) and added parts `g1`–`g5` (10 lessons, 100 questions, 3 drills), each written and then independently fact-checked per SPEC/REVIEW. Jon dropped the 250 cap. **Text comparison started 2026-10-12, stalled:** Van Ed's player is strictly sequential and every subsection ends in a Knowledge Check that gates Next and the outline. Claude read Law & Practice up to the first check (Lesson 1, Nature & Description). Claude's permission system blocks it from submitting quiz answers on Jon's account, so Jon must take each check (and every graded Lesson Assessment) himself before Claude can read further. One conflict found so far: Van Ed keys method of attachment as the most important fixture test; the course keeps intention (the legal view) and now notes Van Ed's framing. The Van Ed free trial expires Fri Oct 16, 2026. The Orientation course needs Jon to tick the name/ID acknowledgment himself.
- **Colorado half audited against the 2026 CREM (2026-10-13).** Van Ed's Colorado courses are mostly assigned CREM reading, so the state parts (s1–s4, g3–g5, f3, f4) and refs 03–05 were checked against CREM Ch 1–5, current rules on LII and statute text. Logs: `content/research/audit-*.md`. Biggest fix: security-deposit return is 30 days (≤60 by lease) since HB25-1249 (Jan 1, 2026). National half (n1–n4, g1, g2, f1, f2, drills, refs 01/02/06/07) also audited 2026-10-13 against federal sources and the PSI bulletin (2598, updated 10/1/2023; exam numbers match). Logs: `content/research/audit-national-*.md`. **Follow-ups not yet done:** rules effective 01/30/2026 (new "Client" definition, Rule 6.27 informed consent before disclosing confidential info, expanded 6.17); Annual Commission Update due by June 30 each year starting 2027; CP-29 and CP-31 repealed; SB26-054 lifts the post-closing occupancy deposit cap from Jan 1, 2027. CREM PDFs are WebFetch-only and truncate at ~116K chars per chapter; read later rules on LII.
- **New forms in 2027.** Commission forms revised for mandatory use on January 1, 2027 were published August 4, 2026. The contracts lesson flags them. Re-check against the new forms once they're in use.
- **Weakly sourced facts, flagged by reviewers:**
  - Net listings: the only source is the 2007 Real Estate Manual.
  - The 2024 for-cause eviction law (HB24-1098): details come from secondary sources.
  - The well-form timing in the contract versus the statute.
  - Who customarily pays the documentary fee: this is not asserted anywhere.

## Van Ed refinement brief

This answers the questions a new chat would ask before starting the Van Ed pass. Jon confirmed these on 2026-10-12.

**1. What exists and where it is**
- **The material** is the "Colorado Real Estate Broker" course pack in this repo, `Aziliz/examiner`. It's also attached to this project as `claude/colorado-broker-course.json`.
- **Edit the sources, not the built file.** The sources are in `content/` (`content/parts/n1–n4.json` national, `content/parts/s1–s4.json` Colorado, `content/refs/*.md`, `content/drills.json`). Rebuild with `python3 content/build_course.py`.
- **Earlier research** checked every Colorado fact against primary sources: C.R.S. Title 12 Article 10 and others, Commission rules 4 CCR 725-1, the dre.colorado.gov pages and 2026 Commission forms, and the PSI candidate bulletin.
  - The bulletin gives the exam structure: national 80 questions / 120 min / 60 to pass; state 74 / 110 / 53 to pass. It also gives the outline weights the bank follows.
  - Notes with URLs are in `content/research/` and `claude/research-notes.md`.
  - Fact-check change logs are summarized under "Content pipeline" above.
- **Van Ed itself:** Jon's course provider for the 168-hour Colorado pre-license program (vaned.com). The course needs Jon's login. He signs in himself in a browser that Claude controls: the desktop app's built-in browser or Claude in Chrome. That needs the chat linked to his computer. Never ask him to paste credentials into chat.

**2. What "refine" means: both**
- **Check:** compare existing lessons, questions, cards and glossary against the Van Ed lessons. Fix anything that conflicts, after checking which source is right against the statute, rule or current form. Adjust terminology and emphasis to match what Van Ed teaches.
- **Fill gaps:** add new lessons, questions and cards for topics Van Ed covers that the course doesn't.

**3. Scope: all modules**
- That means all 8 modules, national (n1–n4) and Colorado (s1–s4).

**4. Where it ends up and copyright**
- **The repo is going private.** Jon chose private; until he changes it in GitHub settings it may still be public, so check before assuming.
- **Write original material regardless.** Van Ed's lessons and quizzes are copyrighted, so use them to learn what to cover and how much weight to give it, then write original questions and explanations from the underlying concepts. Never copy or closely paraphrase their text or reuse their quiz questions.
- **Keep the existing standards** in `content/SPEC.md` and `content/REVIEW.md`:
  - verify Colorado facts against primary sources
  - one best answer per question
  - the correct answer must not be the longest choice in more than about 30% of questions
  - stable ids, because progress is keyed on them
  - every `[[link]]` must resolve to a glossary term
- **Bank size:** Jon dropped the 250 cap on 2026-10-12; the bank can grow. Timed exams still draw 80/74.
- **Ship changes as a new course revision.** Bump `"revision"` in `content/build_course.py` and write a `changelog`, so existing installs are offered the update in-app.

## Storage (per-user app data)

Data lives in `~/.local/share/com.aziliz.examiner/` on Linux and `%APPDATA%\com.aziliz.examiner\` on Windows:
- `courses/<id>.json` and `banks/<id>.json`
- `progress.json`: attempts, question stats, card states, completed lessons, plans, activity, drill stats, flags and notes, and `seededCourses`
- `session.json`: the unfinished exam or practice session

Rust commands: `list_items`, `save_item`, `delete_item` (for kinds `banks` and `courses`), `load_progress`, `save_progress`, `load_state`, `save_state` (`session`), `read_text_file`, `write_text_file`, `data_location`, `install_kind`.

## Releases (updates are off)

- **The repo is private by Jon's choice**, to protect course content written alongside his Van Ed studies. Jon flips the visibility himself in GitHub settings, because this proxy can't change repo settings.
- **App self-updates are therefore off.** Installed copies can't read a private repo's releases.
  - `UPDATES_ENABLED = false` in `src/lib/updates.ts` hides the check.
  - `bundle.createUpdaterArtifacts` is `false`, so builds don't need the signing key.
  - CI no longer uses the signing secret, and `includeUpdaterJson` is `false`.
  - The updater code, plugin config and public key are all still in place.
- **Turning updates back on later:** publish releases to a public repo (e.g. `Aziliz/examiner-releases`, via tauri-action's `owner`/`repo` inputs with a token secret). Then point the endpoint there, set the two flags back to true, and add `TAURI_SIGNING_PRIVATE_KEY`. Jon has the private key file `examiner-updater-PRIVATE.key`; no other copy exists.
- **CI:** `.github/workflows/release.yml` uses `tauri-action`.
  - On Ubuntu 22.04 it builds .deb, .rpm and AppImage; on Windows it builds the NSIS .exe and .msi.
  - Pushing a `v*` tag creates a draft release with the installers. Jon downloads them and installs by hand.
- **Course updates still work.** They ship inside the app, so a newer bundled `revision` is offered in-app.
- **Bumping the version:** change `package.json`, `src-tauri/tauri.conf.json` and `src-tauri/Cargo.toml`.

## Building

```bash
npm install
npm run tauri dev
npx tauri build --bundles deb,rpm,appimage   # Linux
```

Fedora prerequisites: `webkit2gtk4.1-devel openssl-devel curl wget file libappindicator-gtk3-devel librsvg2-devel rpm-build` and the `c-development` group.

To test the UI without Tauri, run `npm run build && npx vite preview`; data then goes to localStorage. Playwright with Chromium works for headless walkthroughs.

## Version history

- **v0.1.0:** the exam simulator: banks, timed and practice modes, editor, progress.
- **v0.2.0:** courses, lessons, notecards, drills, glossary, reference sheets, planner, per-section pass marks, and the bundled Colorado course.
- **v0.3.0:**
  - resume and split timers
  - the missed-questions deck
  - persistent flags and notes, and lesson links
  - search
  - backup and restore
  - course updates and app auto-update

## Possible next steps

- The Van Ed refinement pass.
- A CCNA course pack. The drill engine can't do subnetting yet: it may need bitwise operators or a custom drill type.
- Windows code signing to clear the SmartScreen warning.

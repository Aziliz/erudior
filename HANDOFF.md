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
- **App updates:** checks for new releases, details below.
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
| `src/lib/updates.ts` | The updater wrapper |
| `src/pages/*` | Library, CourseHome (all the tabs), LessonView, Runner (exams and practice), Results, BankHome, Editor (banks), CourseEditor, DeckEditor, CardsRunner, DrillRunner, RefView, ProgressPage, SearchPage |
| `content/` | Course sources and `build_course.py`, described in the next section |

## Content pipeline (Colorado course)

`python3 content/build_course.py` turns these sources into `samples/colorado-broker-course.json`:

- `content/parts/n1–n4.json` and `content/parts/s1–s4.json`: lessons, questions, cards and glossary
- `content/refs/*.md`: the reference sheets
- `content/drills.json`: the drill templates

**Counts:** 8 modules and 38 lessons. The bank has 250 questions: 130 national and 120 state.

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
- Course `revision` is 2.

**How it was made:**
- Eight writer agents worked from `content/SPEC.md`, and independent fact-checkers then reviewed them using `content/REVIEW.md`.
- Colorado facts were checked against C.R.S. and Commission rules (4 CCR 725-1 on law.cornell.edu), dre.colorado.gov, and the 2026 Commission-approved forms.
- Choices were rebalanced so the correct answer is rarely the longest one. Before the rebalance, the longest choice was correct about 65% of the time on the state questions.

**Still open on content:**
- **Van Ed pass not done.** Jon is taking the Van Ed 168-hour pre-license course. The plan was to sign in to Van Ed in a browser and use it to steer emphasis and terminology, without copying their text. This chat couldn't open a browser because it wasn't linked to a computer. Jon shouldn't paste credentials into chat; he signs in himself in the browser.
- **New forms in 2027.** Commission forms revised for mandatory use on January 1, 2027 were published August 4, 2026. The contracts lesson flags them. Re-check against the new forms once they're in use.
- **Weakly sourced facts, flagged by reviewers:**
  - Net listings: the only source is the 2007 Real Estate Manual.
  - The 2024 for-cause eviction law (HB24-1098): details come from secondary sources.
  - The well-form timing in the contract versus the statute.
  - Who customarily pays the documentary fee: this is not asserted anywhere.

## Storage (per-user app data)

Data lives in `~/.local/share/com.aziliz.examiner/` on Linux and `%APPDATA%\com.aziliz.examiner\` on Windows:
- `courses/<id>.json` and `banks/<id>.json`
- `progress.json`: attempts, question stats, card states, completed lessons, plans, activity, drill stats, flags and notes, and `seededCourses`
- `session.json`: the unfinished exam or practice session

Rust commands: `list_items`, `save_item`, `delete_item` (for kinds `banks` and `courses`), `load_progress`, `save_progress`, `load_state`, `save_state` (`session`), `read_text_file`, `write_text_file`, `data_location`, `install_kind`.

## Releases and updates

- **CI:** `.github/workflows/release.yml` uses `tauri-action`.
  - On Ubuntu 22.04 it builds .deb, .rpm and AppImage; on Windows it builds the NSIS .exe and .msi.
  - It signs the installers and writes `latest.json`.
  - Pushing a `v*` tag creates a draft release. **The draft must be published**, because the updater only sees published releases.
- **Secrets Jon must add to `Aziliz/examiner`:**
  - `TAURI_SIGNING_PRIVATE_KEY`: the contents of `examiner-updater-PRIVATE.key`, which was sent to Jon. No copy was kept, and the key has no password.
  - No password secret: the key has no password, and GitHub won't save an empty secret.
- **Public key:** in `src-tauri/tauri.conf.json` under `plugins.updater.pubkey`. The update endpoint is `https://github.com/Aziliz/examiner/releases/latest/download/latest.json`.
- **Who updates how:**
  - Windows and AppImage installs update themselves.
  - .deb/.rpm installs get a notice that opens the release page. `install_kind` tells them apart by checking the `APPIMAGE` environment variable.
  - Tauri also produced `.sig` files for the .deb and .rpm. Its updater may support them now, but that's untested, so those installs still use the notice.
- **v0.2 installs** have no updater; Jon installs v0.3.0 by hand once.
- **Bumping the version:** change `package.json`, `src-tauri/tauri.conf.json` and `src-tauri/Cargo.toml`.

## Building

```bash
npm install
npm run tauri dev
npx tauri build --bundles deb,rpm,appimage   # Linux; set TAURI_SIGNING_PRIVATE_KEY for updater .sig files
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
- Testing .deb/.rpm self-update via the updater.
- Windows code signing to clear the SmartScreen warning.

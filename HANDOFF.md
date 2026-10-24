# Erudior (formerly Examiner): handoff

State as of 2026-10-23, v0.21.0. Read this first in a new chat.

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

## Live hosting and web addresses (2026-10-24)

- Live: app.erudior.com (Pages project `erudior`), courses.erudior.com/v1/ (R2 `erudior-courses`, CORS GET/HEAD *), api.erudior.com (Worker `erudior-community`, D1 `erudior-community` e29b2c3f-3867-41a9-bba7-aa86a3463c39, private R2 `erudior-community`). Cloudflare account 262dfbe98a9322b1f31a693ba1ed5ef3.
- GitHub Aziliz/examiner is **public** (Jon's choice: private repo was out of free Actions minutes). Secrets: CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID, COURSE_SIGNING_KEY, GOOGLE_CLIENT_SECRET, OAUTH_GITHUB_CLIENT_SECRET. Variables: COURSES_URL, R2_BUCKET, PAGES_PROJECT, COMMUNITY_API, D1_DATABASE_ID, ADMIN_EMAILS, GOOGLE_CLIENT_ID, OAUTH_GITHUB_CLIENT_ID.
- Production signing public key in `src/lib/courseKeys.ts`; Jon holds the secret key (password manager).
- Google sign-in: Cloud project `erudior`, External, still in Testing mode. GitHub OAuth app "Erudior" (Aziliz).
- Calculator history: a History list under the keypad (all kinds), kept across screens and the Calculate/Graph tabs while open, cleared on close (module-level `openHistory`).
- Calculator (`components/Calculator.tsx`, `lib/calcKind.ts`): docked left in Runner, DrillRunner, LessonView (toggle tab on the left edge, open state in localStorage `erudior.calculator`, `html.calc-open` shifts `.shell`). Kind: course `calculator` field, else by catalog subject: Real estate/Law → basic (PSI allows only basic), math/science-type → graphing, else scientific. Uses lib/expr.ts with implicit multiplication; DEG mode rewrites trig names to sind etc. Tests: tests/calculator.test.mts.
- Color: `decorateLesson` in Markdown.tsx wraps "## Key points"/"## Common mistakes" sections and "### Example …" blocks in `.lesson-box` and classes blockquotes (callout-tip/-warn/-rule; not in language courses). Subject colors `--subj`/`--subj-soft` from `html[data-subject]` (App effect, `subjectKey` in taxonomy.ts) and `.catalog-card[data-subject]`. Themes: system/light/dark/sepia/dim/contrast (data-theme; system dark media query now only applies with no data-theme). Display math `.math-display` panel; inline math wrapped in `.math-inline` (lib/math.ts).
- **erudior.com vs app.erudior.com (v0.24.0):** one build, same Pages project; `src/lib/site.ts` `IS_SITE` (host erudior.com / www, or `?site` locally, `?app` to leave) renders `src/Site.tsx` (home `pages/Home.tsx` = desktop-app features with screenshots in `public/shots/`, and `pages/DownloadPage.tsx` = installers from the GitHub releases API with SHA-256 digests, install steps, FAQ, earlier versions). Any other path on erudior.com redirects to app.erudior.com. The app: `/` = library (Courses), `/download` redirects to erudior.com/download, logo → erudior.com. Screenshots: `scripts/site-shots.mjs` (seeds a made-up family/class; needs worker dev + two vite servers, see header; `VITE_AS_DESKTOP=1` makes the browser build look like the desktop app).
- **Admin:** hidden `/admin` (view `review`, `pages/ReviewQueue.tsx`, no links anywhere): every community course with a Reviewed / Not reviewed switch (API `GET /review/all`), waiting queue, reports, taken down, people (admins).
- **Auto-updates on (v0.24.0):** `UPDATES_ENABLED = true`; new updater key (public in tauri.conf.json, private as GitHub secret TAURI_SIGNING_PRIVATE_KEY, no password; Jon keeps a copy); `createUpdaterArtifacts`, `includeUpdaterJson: true`; macOS reports install kind "macos". v0.23.0 installs had updates off, so they update by hand once. v0.24.0 shipped without a macOS entry in latest.json (bundles were only dmg); release.yml now builds `app,dmg`, so macOS auto-updates start with the next release (Homebrew installs update via brew meanwhile).
- Website pages (v0.23.0, superseded by the split above): `/` home (`pages/Home.tsx`), `/courses` library, `/community` (`pages/CommunityPage.tsx`: community catalog with subject/level/type filters and the Create a course button; the top-bar Create button is gone), `/download` (`pages/DownloadPage.tsx`: reads `api.github.com/repos/Aziliz/examiner/releases/latest`, matches assets by extension, highlights the visitor's OS, shows the brew command). The Erudior logo goes home. Desktop app: no home/download; Community tab only when there is no homeschool family.
- Labels (`src/lib/taxonomy.ts`): levels Elementary School, Middle School, High School, College, Professional; types Course, Exam prep; ~28 subjects. Old labels (High school, Adult, A1…, old community subjects) are mapped on load; community courses have a `type` (doc field, D1 column `kind`, migration 0003). German courses are tagged High School, College and Professional.
- macOS: release workflow builds a universal .dmg (ad-hoc signed, not notarized) and also uploads it as `Erudior-macOS-universal.dmg`; tap repo Aziliz/homebrew-erudior has `Casks/erudior.rb` (version :latest, sha256 :no_check, clears quarantine in postflight) so `brew install --cask aziliz/erudior/erudior` always gets the latest release. Pushes to the tap aren't allowed from Claude sessions (edit it on github.com). Releases now publish (not draft) on a `v*` tag.
- Website addresses (`src/lib/routes.ts`, wired in App.tsx; website only, not the desktop app): `/` library, `/<course-title-slug>` course or catalog overview (course id also accepted, then rewritten), `/<course>/<tab>`, `/<course>/lessons/<lessonId>`, `/<course>/reference/<id>`, `/progress`, `/search?q=`, `/create`, `/review`, `/live`. Tab switches and overview→course replace the history entry; other screens push one. Activities (practice, results, cards, drills) get an address but reopen the course on reload/back. Pages serves index.html for unknown paths (no 404.html).

## Question types, pictures, diagrams, honors (v0.22.0)

- **Question kinds** (`src/lib/questions.ts`): choice (single or select-all), `text` (fill in the blank: `___` blanks, `accept` lists, normalized matching), `match`, `label` (image + percent `markers`), `order`. Every kind keeps `choices`/`answer`; answers are `Chosen = (number|string)[]`. All scored all-or-nothing; reviews mark each part. UI: `src/components/QuestionBody.tsx` (Runner + Results), bank editor `src/components/QuestionKindEditor.tsx` (all kinds, picture upload, click-to-place markers). Live rooms use choice questions without pictures only. Community courses have every kind (see Community parity).
- **Pictures:** any question can have `image {src, alt, caption?}`. Bundled courses keep SVGs in `<course>/images/`; build.py embeds them as data URLs (lessons `![alt](images/x.svg)` and questions); 400 KB cap; SVG safety check. `scripts/preview-figure.mjs` renders an SVG (with label markers) or a `.mmd` diagram to PNG for checking.
- **Mermaid:** ```mermaid blocks in lessons/reference sheets (`src/lib/diagram.ts` placeholder, `src/lib/mermaidRender.ts` lazy-loads mermaid 11.17.2, theme colors from CSS vars, redraws on theme change, min 70% scale then scrolls). accTitle/accDescr required (build + checker; checker parses with mermaid under jsdom).
- **Honors:** `honors: true` on lessons or modules (`isHonorsLesson`, `coreLessons`, `moduleCoreLessons` in course.ts). Optional: not needed for module/course completion, excluded from module quizzes, grades (via catalog `honorsLessonIds/honorsModuleIds`), full exams and default practice (opt-in checkbox); study time still counts. Catalog counts core `lessons` and `honors` separately. Jon: every school course gets honors lessons (professional courses don't); "more is better as long as it's accurate"; no transcript designation.
- Tests: `tests/questions.test.mts`; walkthrough `scripts/questions-walkthrough.mjs` with fixture `tests/fixtures/math/demo` (build it with build.py; serve on 5182).

## Biology course (v0.21.0)

- First K–12 core course: `content/math/biology` (id `science-biology`, catalog order 16, Science, High school, one credit). 10 modules, 40 lessons, 458 questions, 72 drills, 296 cards, 313 terms, 4 reference sheets (lab math, cell energy, genetics incl. codon table, evolution/ecology). Scope: NGSS HS-LS1–4 and Texas TEKS Biology (RESEARCH.md).
- Process (reuse for the next courses): outline in PROGRESS.md → writer brief WRITERS.md → six writers in parallel, each owning its modules' files (glossary-mN.yaml / cards-mN.yaml split files) and checking with the new `content/math/check-module.sh <course> mN` (builds one module alone into samples/math-drafts) → five independent reviewers (REVIEWERS.md; REVIEW-mN.md with sources) → editor merges: glossary duplicates, reference sheets, full build + checker + axe on lessons, `released: true`.
- Sequence drills (transcription/translation/mutations) are numbered multiple choice (answers must be numbers). Lesson 9 keeps an honors-level water potential extension (Jon may drop it).
- **Revision 2 (v0.22.0):** 34 honors lessons (2–3 per module plus honors modules bio-h1–h3), pictures/diagrams in every lesson, the new question types. Now 74 lessons, 1,149 questions, 142 drills, 645 cards, 740 terms; 167 SVGs, 69 Mermaid diagrams; course file ≈4.3 MB (embedded SVGs). Process: WRITERS-2.md → 13 writers → REVIEWERS-2.md → 13 reviewers → editor merge. `scripts/course-audit.mjs "Biology" light|dark width` checks every lesson (axe, overflow, pictures load, diagrams draw) and samples quiz questions.
- Next courses on the roadmap: Chemistry, English 9–12, World and US History, Government.

## Live room (v0.20.0)

- Jon: hosts are parents/teachers in the desktop app with no account; host chooses untimed (host reveals, 1 point per right answer) or timed (countdown, right answers score 500 + up to 500 for speed); students see only their own result and class totals, never names.
- Server: `worker/src/live.ts`, Durable Object `LiveRoom` (binding `LIVE`, `new_sqlite_classes` migration in wrangler.toml), all state in memory. `POST /live/rooms` → `{code, token, joinUrl}` (6-char code, host token hashed; 30 rooms/hour per daily-salted IP hash in D1 table `live_rooms`, migration 0002). `GET /live/rooms/<code>/ws?role=host&token=…` or `?role=player[&player=<id>]` (WebSocket). Host messages: setup (title, questions ≤100, timed, seconds 5–120), show, reveal, end, remove, close; players: join (nickname ≤20, unique per room), answer (first answer counts). Reveal happens early when every connected player answered, or at the deadline. Players never get the answer before the reveal; reveal gives counts per choice, how many right, their own answer. Rooms close 10 min after the host leaves, after 4 h, or when the host closes; players can reconnect with their id.
- App: `lib/live.ts` (open room, reconnecting socket), Parent/Teacher area → Live room (`pages/LiveHost.tsx`: pick a course's random questions or a lesson/module quiz, pace, open; big code; players with Remove; question, answer counts, reveal/next/finish; summary per question and scores on the host's screen only). Players: Library → "Join a live room" or `/?live=CODE` (`pages/LivePlay.tsx`). Needs `VITE_COMMUNITY_API`; desktop CSP allows `wss://api.erudior.com`.
- Tests: `worker/test/live.test.mjs` (protocol: host token, setup, duplicate nicknames, no answer leak, early reveal, multi-answer, reconnect, timed scoring + auto reveal, remove, close); `scripts/live-walkthrough.mjs` (host + two students), clean light/dark 1280 and 320.

## Classroom mode (v0.19.0, desktop app)

- Jon: both ways of working — students on the teacher's computer (pick their name) and on their own device (class file in, hand-in file out).
- Setup (top bar "Homeschool or classroom") asks Homeschool or Classroom. Classroom = `family.json` with `mode: "classroom"` and `classes: ClassInfo[]` (name, roster of student ids, assignments with optional due dates, `freeChoice`, a 32-byte secret, last hand-in per student). Students start with fresh progress (whatever was on the computer stays as the base progress.json). No state rules, attendance, minutes or reminders in this mode; labels say Teacher.
- Teacher area tabs: Overview (per class: students, assigned, finished, past due, next due), Classes (rename, assign courses + due dates, free choice, roster add/remove/move, "Save class file"), Gradebook (students × assigned courses: grade + lessons + past due; CSV), Hand-ins (import), Grades and Reports (report card, portfolio) and Students and Settings from homeschool.
- Students on the teacher's computer: "Who's learning?" grouped by class; Library shows "Assigned in <class>" with due dates; other catalog courses locked unless the class allows free choice.
- Own device (`lib/classroom.ts`, `components/ClassViews.tsx`): any install without a family (desktop or app.erudior.com) shows "Join a class" → open the class file → pick your name (stored in state file `classes`). The class's assignments show with due dates; "Hand in work" saves `erudior-handin` JSON with the student's attempts, lessons, modules and drills for the assigned courses, HMAC-SHA256 with the class secret over a stable JSON form. Teacher import checks class, roster and HMAC, then merges (attempts by id, earliest completion dates, larger drill tallies, enrolls the courses; installs missing catalog courses). The secret is in the class file, so this stops mix-ups and casual edits, not a determined student (said in the code comment).
- Fixed along the way: under 900px the exam/quiz answer sheet (with Finish quiz / End session) was hidden; it now sits under the question.
- Tests: `tests/classroom.test.mts` (in npm test); `scripts/classroom-walkthrough.mjs` (teacher + a second browser as the student's device: setup, assign with due date, class file, shared-computer quiz, join, hand-in, tampered file refused, gradebook, CSV, reports), clean light/dark 1280 and 320.

## Community parity (after v0.24.0)
- Create a course can do everything official courses do. Format (`communityFormat.ts`, still version 1, all new fields optional so old drafts load): `calculator` (basic/scientific/graphing/none; missing = by subject via `taxonomy.calculatorForSubject`, which `calcKind` also uses; Course.calculator "none" hides the calculator), `exam` (questionCount, minutes, passingPercent), `modules` (title, honors, `quiz` of questions), lesson `module`/`honors`/`minutes`/`drills`/`refs`, questions of every kind (`kind` choice/text/match/label/order, `accept`, `caseSensitive`, `left`, `markers`, `imageId`/`imageAlt`), new blocks (heading `level` 3, `callout` tip/warning/rule, `example`, `math`, `figure` = official figure JSON, `diagram` = Mermaid with title/description; `%%{` and `click` lines stripped), `glossary`, `references`, `drills` (official Drill format, checked with `drillError` on publish, worker too), `language`, `vocab`, `readingList`.
- Editor: tabs About (calculator, practice exam), Modules, Lessons (Lesson settings, all blocks, live figure drawing), Notecards, Glossary, Reference sheets, Drills (form + Try it + Edit as JSON), Language and reading, Publish. Files: `pages/CommunityEditor.tsx`, `CommunityTabs.tsx`, `CommunityQuestion.tsx`.
- `splitMath` moved to `lib/mathSplit.ts` (no KaTeX) so the worker can use it. Installs embed question pictures too (`imageIds`).
- Tests: community.test.mts covers the full doc; `scripts/community-walkthrough.mjs` updated for the Community page and /admin and exercises the new tabs (clean light 1280, dark 320).

## Community courses (v0.18.0)

- Jon's choices: Cloudflare Workers + D1/R2; Google + GitHub sign-in; authors 18+ (checkbox attestation + terms); blocks: text, lists, headings, images, multiple-choice questions, notecard decks; courses go live tagged **Not reviewed**, a reviewer marks a version **Reviewed**; Jon reviews and can grant a Reviewer role to others.
- **API** `worker/` (api.erudior.com): `src/index.ts` (routes listed at the top), `migrations/0001_init.sql` (users, sessions, courses, images, reports, review_log), `wrangler.toml` (env `dev` = localhost with `/auth/dev` sign-in). Sessions are random tokens in an HttpOnly SameSite=Lax cookie (hash in D1). Signed-in writes require an allowed Origin. Public: catalog, published course, images (served with nosniff and a CSP), reports (rate-limited by a daily-salted IP hash). Publishing writes `courses/<id>.v<n>.json` to R2; a new version resets the tag to Not reviewed. Reviewers: mark reviewed / not reviewed, take down (note required; author sees it; can't republish), restore, close reports. Admins: roles and bans (`ADMIN_EMAILS` become admins on sign-in).
- **Format** `src/lib/communityFormat.ts` (shared by worker and app): `checkDoc` (draft vs publish checks, size limits), `safeMd` (escapes HTML outside math, drops code fences, keeps [[glossary]] links, http(s) links only), `toCourse` → app course `community-<id>` with lesson quizzes in one bank, decks, `community` metadata (id, version, review, author).
- **App** (`lib/community.ts`, `VITE_COMMUNITY_API`): Library → Community courses (search, subject, Reviewed only, tags, Report, Update when version or tag changes); installs embed images as data URLs (works offline); course page shows author, tag and "Report this course". Community courses are never assignable, never on reports, and their study time isn't tracked. Web build only: Create (sign-in, terms, your courses, display name), block editor (`pages/CommunityEditor.tsx`: About, Lessons with blocks + preview, Notecards, Publish; autosaves), Review queue (`pages/ReviewQueue.tsx`, People for admins).
- Deploy: `.github/workflows/community.yml` (idle until `COMMUNITY_API` + `D1_DATABASE_ID`); site and release workflows pass `VITE_COMMUNITY_API`; CSP allows api.erudior.com. Setup steps in docs/HOSTING.md.
- Tests: `tests/community.test.mts` (in npm test); `worker/test/api.test.mjs` against `npm run dev` in worker/; `scripts/community-walkthrough.mjs` (write → publish → Library → start → report → review → update), clean in light/dark and at 320px.
- Lawyer questions still open (roadmap): terms text in CreateHome is a plain-language draft.

## Renamed to Erudior (v0.17.0)

- App name Erudior, identifier `com.erudior.app`, Cargo package `erudior` (lib `erudior_lib`), npm name `erudior`. The GitHub repo is still `Aziliz/examiner` (the updater endpoint and release links point there).
- Data folder: `~/.local/share/com.erudior.app/` and `%APPDATA%\com.erudior.app\`. On the first start `move_old_data` (lib.rs) copies top-level JSON files and `courses/`, `banks/`, `documents/` from the old `com.aziliz.examiner` folder (left in place) and writes `.moved-from-examiner`; it skips if the new folder already has progress.json or family.json. Display settings and the cached catalog (localStorage) don't carry over; they rebuild.
- Domains (Jon): web app `app.erudior.com` (Pages project `erudior`), course packages `courses.erudior.com/v1/` (R2 bucket `erudior-courses`). docs/HOSTING.md, CSP and env docs updated; the old azilizlabs hosts never went live and are dropped.
- Internal format strings (`examiner-course`, `examiner-bank`, `examiner-backup`, `examiner-family`, `examiner-records`, `examiner-catalog`, `examiner-states`) and localStorage/IndexedDB keys (`examiner.*`) are unchanged on purpose so existing files keep working.
- Course `author` is now "Erudior" (rebuilt; revisions not bumped, only that field and one precalculus sentence changed).
- The claude.ai roadmap doc still says Examiner in its title.

## More records (v0.17.0)

- **Documents** (Parent area → Documents, `lib/documents.ts`): attach files (≤15 MB; notice of intent, letters, test reports, immunization/exemption, IHIP…) per student, optionally to every student at once. Files stored once as base64 JSON in `documents/<fileId>.json` (new collection kind; `load_item`, `write_base64_file` Rust commands); deleted when no student refers to them; "Save a copy" exports. Included in the encrypted backup (`files`). Listed as "Documents on file" in the progress report and portfolio.
- **Reading log and activities** (Parent area → Reading and activities): books (title, author, finished date, subject, note) and activities (PE/sports, extracurricular, volunteer, work, other; role, dates, hours). Reading log prints in the portfolio and progress reports; activities in those and on the transcript ("Activities and service").
- Dark theme `--ink-3` raised to #b3beb9 so faint text on flagged rows meets 7:1.

## Homeschool records (v0.16.0)

- **Grades** (`lib/grades.ts`; Parent area → Grades): course percent = weighted mean of best score per lesson quiz, best per module test, best full exam, and work the parent graded (default weights 25/35/25/15, editable; parts with no scores are skipped). Parent can set the percent with a reason (printed). Letters A–F with +/- (plus = top 30% of a band, minus = bottom 30%); cutoffs default 90/80/70/60 and can only be made stricter (`cutoffProblem`), per Jon. GPA 4.0 (A+ = 4.0); weighted adds 0.5 Honors, 1.0 AP/dual credit on passing grades. Credits default 1.0 for high school, college and language-level catalog courses, else 0; editable per course with level, grade level, comment.
- **Placement by school year** (`lib/reports.ts`): a course belongs to the year it was finished (last lesson or passing full exam), else the year it was last worked on; the parent can pin it. Past years use the family's start day.
- Also on Grades: courses taken elsewhere (transcript), standardized tests/evaluations.
- **Reports** (Parent area → Reports, `components/ReportDocs.tsx`): report card (per year), high school transcript (credits ≥ 9th grade or any finished credit course, outside courses, yearly and cumulative GPA, credits by subject, DOB/graduation if set on Students), state progress report (whole year or quarters: attendance calendars, days/hours vs state minimum, hours by subject, material covered = lessons finished + tests per course by subject, other learning, grades to date, parent's evaluation per subject, tests; titled "Quarterly report" for NY quarters), portfolio (materials, lesson log, best module test/exam per module with questions and answers, photos of paper work). Every report has the school letterhead (Settings → Home school), a signature line for the administrator and an accuracy statement.
- **Output:** "Print or save as PDF" uses the system print dialog (print CSS shows only the report); "Save as web page" writes a standalone .html with the report's styles. Check window.print() in the Linux and Windows builds before relying on it.
- Photos: `portfolio-<id>.json`, shrunk to 1600 px JPEG; in the encrypted backup.
- Tests: `tests/records.test.mts`; the walkthrough now covers grading scale, a parent grade, comment, test result, every report, print view, web-page save and a photo.

## Homeschool (v0.15.0, desktop app only)

- Turned on in the desktop app (`HOMESCHOOL` in src/lib/family.ts; `VITE_HOMESCHOOL=1` turns it on in a browser for testing). The web build stays free learning with no family features.
- **Setup** (top bar → Homeschool, `pages/FamilySetup.tsx`): state, route (home-education law or another listed route), school year, minutes that make a school day (default from the state's rules), students (name, grade K–12), parent password (8+), optional PIN (4–8 digits). Shows a one-time recovery code. Progress already on the computer becomes the first student's; courses already installed go on that student's list.
- **Students:** each has `progress-<id>.json`, `session-<id>.json`, `records-<id>.json`; course files stay shared. `Progress.enrolled` is the student's In-progress list; removing a course only takes it off that list. With 2+ students the app opens on "Who's learning?" (`WhoPage`).
- **Parent lock** (`ParentGate`): PBKDF2-SHA-256 hashes (310k iterations) in family.json; 5 free wrong tries, then a lock that doubles from 1 minute up to an hour; reset with the recovery code (turns off the PIN, issues a new code). The area locks again whenever you leave it. It's a lock against students, not encryption of the data on disk.
- **Assignments:** ordered per student with a subject; in each subject the first unfinished course is current and the rest say "Starts after …". "May also start courses that aren't assigned" (on by default) controls whether other catalog courses are locked. Finished = every lesson done or full practice exam passed (`courseFinished` in catalog.ts).
- **Time and attendance** (`lib/timer.ts`, `lib/records.ts`): study screens (lessons, exams/practice, cards, drills, vocabulary, reference) count time while the window is visible and there was input in the last 3 minutes; saved about once a minute and when the screen closes. Parents add offline time (date, minutes, subject, note). Days at or over the daily minimum are "Proposed"; the parent confirms (one button) or marks days school / not-school. CSV export of the year.
- **Dashboard** (Parent area → Overview): per student, school days and hours against the state minimum for their grade, pace vs the share of the year gone, hours by subject; "Coming up" reminders (next 45 days + overdue) with Done, plus custom reminders.
- **Reminders** come from the state rules: yearly notice deadline (fixed date, or days before/after the school-year start), one-time notice, other reports (e.g. NY IHIP, PA evaluator, VA results), testing years by grade, yearly assessments. None when the family uses another route.
- **State rules data:** `content/states/states.yaml` (51 jurisdictions: the roadmap's State rules table + sources + machine-readable `rules`), `python3 content/states/build.py` checks it and writes samples/states.json. Every build bundles it; `courses:publish` also publishes `states.<checked-date>.json` in the signed catalog and download builds pick up a newer one (`lib/states.ts`). Unsettled points are flagged per state (KY, KS, DE, ND, MA, CT, NH, RI, WA; ages for SD/TN/UT).
- **Backup** (Parent area → Settings and backup): one file with family, every student's progress and records, courses and banks, AES-256-GCM with a PBKDF2 key (600k) from a passphrase (`lib/backup.ts`). The old plain backup on the Progress page is hidden once a family exists.
- **New school year** button moves the dates forward a year and every student up a grade.
- Tests: `tests/homeschool.test.mts` (in `npm test`); browser: `VITE_HOMESCHOOL=1 npx vite --port 5181` then `node scripts/homeschool-walkthrough.mjs [light|dark] [width] [shots dir]` (setup → study time → PIN → attendance → CSV → assignments → backup → second student, with axe on every new screen). Clean in light/dark at 1280 and at 320px for v0.15.0.

## Course hosting (v0.14.0)

- Plan: the website (examiner.azilizlabs.com, Cloudflare Pages) is free learning; the desktop app is for homeschool families and schools. Both download courses from examiner-courses.azilizlabs.com/v1/ (Cloudflare R2).
- `npm run courses:publish` writes dist-courses/v1: catalog.json (with each file's SHA-256), catalog.json.sig (Ed25519) and immutable `<id>.r<rev>.json` files. The app trusts keys in src/lib/courseKeys.ts (src/lib/courseSource.ts, courseSign.ts), caches the last good catalog for offline use.
- Builds without VITE_COURSES_URL bundle courses as before; with it, no course ships in the build (web build 2.4 MB instead of 16 MB).
- Setup steps (signing key, R2, Pages, token, GitHub secrets/variables) are in docs/HOSTING.md; the "Publish website and courses" workflow stays idle until the COURSES_URL variable is set. `npm run dev:remote` tests the download path locally with a dev key.
- Roadmap doc: claude.ai artifact "Examiner: Free Homeschool Roadmap" (with a State rules tab for all 50 states + DC).

## Layout and accessibility (v0.13.0)

- Pages span 95% of the window (2.5% each side, at least 12px): `--page-width` in styles.css. No fixed-pixel content widths; inline `maxWidth` is only used for small form fields.
- Display menu (top bar): theme, reading width (Full, or Comfortable = 80 characters, for WCAG 1.4.8) and text size (100/115/130%; all font sizes are rem). Stored in localStorage.
- Target: WCAG 2.2 AA, plus AAA where practical: text colors meet 7:1 in light and dark (tokens --ink-2/3, --accent, --ok, --bad, --flag, --study), form-control borders 3:1 (--field), 3px focus outline, skip link, live-region toasts, 28px glossary jump targets, lang="de" on target-language italics and blockquotes in language lessons, no nested interactive controls (catalog cards use a stretched title button), every screen has an h1, no horizontal scrolling at 320px.
- `node scripts/a11y-audit.mjs [light|dark] [width]` runs axe-core over the main screens and reports any overflow; it was clean in light and dark at 1280px and at 320px when v0.13.0 shipped. Automated checks can't judge everything (e.g. screen-reader flow, meaningful alt text); test with NVDA/VoiceOver before claiming full conformance.

## Language courses

- One course per proficiency level (German A1, A2, …), sources in `content/languages/<folder>/`, built by `content/math/build.py` (it covers both areas) to `samples/languages/`. Guide: `content/languages/AUTHORING.md`; `content/languages/check-module.sh <course> mN` builds one module alone.
- Course JSON adds `language` (code, name, tts voice, character keys, ime, level, vocabTarget), `vocab` (term, meanings, pos, plural, example…; nouns carry der/die/das) and `readingList`.
- Vocabulary replaces notecards for language courses (other courses keep notecards). Each word has two typed cards (word → English, English → word). Stages Novice → Beginner → Advanced → Expert, 5 right in a row each; a miss resets the count within the stage; after Expert the card is retired. One counted answer per card per day; misses come back later in the session uncounted; extra practice never changes state. Words unlock when their lesson is complete. Progress key `vocab["courseId/itemId/dir"]`.
- Checking: English meanings are lenient (any listed meaning, ignores to/a/the and parentheses, one or two typos on longer words). German recall is exact except capitalization (accepted with a note); a missing article or ae/oe/ue/ss for umlauts asks again without penalty; a wrong article is wrong.
- Levels build on each other (v0.11.0): `requires:` in course.yaml locks a course in the catalog until every lesson of the required course is complete or its full practice exam is passed. The builder copies the required course's words into the later one (tagged `from`) and rejects new words that repeat them. Progress keys are per language (`de:word/dir`), so levels carry over; old per-course keys migrate at startup. Carried words whose lessons are done join at once; others (exam skippers) join 20 a day.
- German A2 (v0.11.0): 24 lessons, 292 questions, 667 new words + 717 from A1 = 1,384, 14 readings; reviewed module by module against DWDS/Duden and the Goethe A2 rules.
- German B1 (v0.12.0): 30 lessons, 367 questions, 1,020 new words + 1,384 from A1/A2 = 2,404, 14 readings; locked until A2 is done; reviewed module by module. Review sessions are capped at 100 cards (in-progress cards first). `content/languages/prior-words.py <folder>` writes PRIOR-WORDS.tsv for writers of the next level.
- Character buttons insert at the cursor; 🔊 uses the device's voices and hides when none exists for the language.
- German A1 (v0.10.0): 24 lessons, 300 questions, 717 words, 11 readings; written per module, then independently reviewed against DWDS/Duden and the Goethe A1 exam rules. Notes in `content/languages/german-a1/PROGRESS.md` and `RESEARCH.md`. 

## Code map

| Path | Role |
|---|---|
| `src-tauri/src/lib.rs` | Rust commands described in Storage below, plus `install_kind` |
| `src/App.tsx` | View router, the app API passed to pages, startup seeding, resume, course-update and app-update banners, top-bar search |
| `src/lib/types.ts` | All data types: Bank, Question, Course, Lesson, Deck, Card, Drill, Progress, etc. |
| `src/lib/validate.ts` | Bank parsing and normalizing, warnings, serializing |
| `src/lib/questions.ts`, `src/components/QuestionBody.tsx`, `QuestionKindEditor.tsx` | Question kinds: grading, answer UI, editor |
| `src/lib/diagram.ts`, `mermaidRender.ts` | Mermaid diagrams in Markdown |
| `src/lib/course.ts` | Course parsing and normalizing. Banks inside a course get the runtime id `${courseId}__${localId}`. |
| `src/lib/storage.ts` | Tauri invoke calls, with a localStorage fallback when the UI runs in a plain browser; backup and restore; the session file |
| `src/lib/session.ts` | Drawing exam questions, timed blocks, practice pools, scoring, `finishSession`, `attemptPassed`, saving and restoring a run, `defaultExamOptions` |
| `src/lib/srs.ts` | Spaced repetition scheduling, queues, `missedDeck` and `studyDecks` |
| `src/lib/planner.ts` | Activity log, streak, course numbers, readiness, `planToday` |
| `src/lib/drills.ts`, `src/lib/expr.ts` | The drill engine |
| `src/lib/updates.ts` | The updater wrapper (currently disabled by `UPDATES_ENABLED`) |
| `src/lib/vocab.ts` | Language vocabulary reviews: unlocking, due cards, stage ladder (`applyAnswer`), typed-answer checking (`checkMeaning`, `checkRecall`) |
| `src/lib/speech.ts`, `src/lib/ime.ts` | Device text-to-speech; input-converter registry for non-Roman scripts (empty until Japanese/Chinese) |
| `src/pages/VocabRunner.tsx`, `src/pages/VocabTabs.tsx` | Vocabulary review/practice screen; Vocabulary and Reading list tabs |
| `worker/src/live.ts`; `src/lib/live.ts`; `src/pages/LiveHost.tsx`, `LivePlay.tsx` | Live room: Durable Object, client socket, host tab, join/play screen |
| `src/lib/classroom.ts`; `src/pages/TeacherTabs.tsx`; `src/components/ClassViews.tsx` | Classroom mode: class file / hand-in / merge; teacher tabs; Library class sections |
| `worker/`; `src/lib/communityFormat.ts`, `community.ts`; `src/pages/CreateHome.tsx`, `CommunityEditor.tsx`, `ReviewQueue.tsx`; `src/components/CommunityCatalog.tsx` | Community courses: API, format/converter, client, editor, review, Library section |
| `src/lib/grades.ts`, `reports.ts`, `portfolio.ts`; `src/pages/ParentRecords.tsx`; `src/components/ReportDocs.tsx` | Homeschool records: grades/GPA, report data, photos; Grades and Reports tabs; printable documents |
| `src/lib/family.ts`, `records.ts`, `states.ts`, `timer.ts`, `backup.ts` | Homeschool: family/students/parent lock, records + attendance + reminders, state rules, active study timer, encrypted backup |
| `src/pages/FamilySetup.tsx`, `WhoPage.tsx`, `ParentGate.tsx`, `ParentArea.tsx` | Homeschool screens |
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
- **Gap lessons (2026-10-17, v0.9.1):** 39 new lessons across all 15 courses closing the common coverage gaps found by the source check, plus questions/drills for the short sections it added; each course's additions independently reviewed (see PROGRESS.md "Gap lessons"). Math/science totals now 568 lessons, 6605 questions, 1404 drills. Engine: no negative zero in formatted numbers; thousands separators inside $…$ render tight; tiny answers (|x| < 1e-3) without explicit tolerance compare relatively.
- **Source verification (2026-10-17):** all 15 math/science courses checked against .edu and university-run open textbooks (OpenStax, LibreTexts, Paul's Notes, MIT OCW, Penn State STAT), College Board CEDs and NIST CODATA 2022: facts/formulas, topic coverage, answer-key spot checks. No answer keys were wrong; ~120 fixes (missing hypotheses, definitions, constants, conventions stated) and short coverage sections. Each course has `VERIFY.md` (sources, fixes, conventions, remaining gaps). AP Statistics follows the 2019 framework; topics dropped by the 2026–27 framework carry "AP exam scope" notes. New short sections mostly have no questions/drills yet.
- **Course catalog (v0.9.0):** bundled courses are no longer installed on first run. `samples/catalog.json` (written by `content/math/build.py` `write_manifest()`, also called from `content/build_course.py`; metadata from course.yaml `order/subject/level/type` and `content/catalog-extra.json` for the Colorado course) lists every shipped course with counts. Library: "In progress" = courses added/started (stored); "Course catalog" below with search plus Subject/Level/Type chip filters (remembered per browser). Start course loads just that course's chunk (`src/lib/catalog.ts`, Vite import.meta.glob) and stores it. Removing a catalog course from a course page keeps its progress. One-time migration (`progress.catalogV1`): installed catalog courses with no activity are removed. New courses for other subjects: add a catalog entry (subject/level/type) and they get filters automatically.
- **Web/browser storage (v0.8.1):** outside Tauri, courses, banks, progress and the session live in IndexedDB (`src/lib/webstore.ts`), not localStorage (5 MB quota overflowed with 16 bundled courses: QuotaExceededError). Old localStorage data is moved over on first open.
- **App v0.8.0: bundled math and science courses (all released).** Sources in `content/math/<course>/` (see `content/math/AUTHORING.md`), built by `python3 content/math/build.py [course]`. Only courses with `released: true` in course.yaml build into `samples/math/` and ship (listed in `samples/catalog.json` by `order`); drafts build into `samples/math-drafts/` (git-ignored). Jon asked for each course to be finished one at a time, in the order Pre-algebra, Algebra 1, Algebra 2 (College Algebra skipped: Precalculus covers it), Geometry, Trigonometry, Precalculus, Calculus, Multivariable, Diff Eq, Linear Algebra, Statistics (split into AP Statistics and a calculus-based Probability & Statistics course, Jon's choice), Physics (split into algebra-based Physics, University Physics I and II). Each course gets an independent review (every question re-solved, drills generated and recomputed) recorded in its PROGRESS.md before release. Released: Pre-algebra (36 lessons, 400 questions, 87 drills), Algebra 1 (32 lessons, 379 questions, 80 drills), Algebra 2 (26 lessons, 298 questions, 71 drills; ends with intro probability/normal distribution and unit circle/trig graphs). Geometry (38 lessons, 425 questions, 93 drills), Trigonometry (38 lessons, 430 questions, 88 drills), Precalculus (40 lessons, 481 questions, 95 drills), Calculus (44 lessons, 480 questions, 90 drills), Multivariable Calculus (37 lessons, 425 questions, 72 drills), Differential Equations (38 lessons, 423 questions, 78 drills), Linear Algebra (38 lessons, 447 questions, 78 drills), AP Statistics (38 lessons, 410 questions, 79 drills), Probability and Statistics (34 lessons, 422 questions, 96 drills), Physics, algebra-based (46 lessons, 517 questions, 133 drills), University Physics I (28 lessons, 294 questions, 80 drills), University Physics II (18 lessons, 187 questions, 53 drills). All 15 planned courses are released. Typing exactly the shown (rounded) answer is always accepted (`shownValue` in src/lib/answers.ts). Known engine limit: factoring drills also accept the expanded form (expression answers are checked by value, not form).
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

- Homeschool families: `family.json`, and per student `progress-<id>.json`, `session-<id>.json`, `records-<id>.json`, `portfolio-<id>.json` (ids lowercase letters/digits, ≤24)

Rust commands: `list_items`, `save_item`, `delete_item` (for kinds `banks` and `courses`), `load_progress`, `save_progress`, `load_state`, `save_state` (`session`, `family`, `progress-<id>`, `session-<id>`, `records-<id>`, `portfolio-<id>`; checked by `valid_state_name`), `read_text_file`, `write_text_file`, `data_location`, `install_kind`.

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

- **Never above v1.0** (Jon): stay on 0.x until Erudior is ready to support homeschooling families and teachers. The website says it's an early version not to be used in place of homeschool or school yet (home page and Download page).

- **v0.24.0:** erudior.com public site (desktop app features with screenshots, download guide with checksums and FAQ), app.erudior.com starts on Courses, hidden /admin for review tags, calculator (basic/scientific/graphing), lesson colors, subject colors, sepia/dim/high-contrast themes, formula panels, in-app updates on (Windows, macOS, AppImage).
- **v0.23.0:** website home page (/), Courses (/courses), Community page with Create inside, Download page; five levels (Elementary School … Professional) and two types (Course, Exam prep); macOS universal .dmg and Homebrew tap; releases publish automatically.
- **v0.22.0:** question types (text, match, label, order), pictures in questions, Mermaid diagrams, honors lessons/modules; Biology revision 2.
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

- Honors for the other school courses (math, physics, statistics, languages as appropriate; not the professional Colorado course), same process as Biology round 2. Then new courses.
- Roadmap phases 1–4 are built; Biology is the first K-12 course. Next: more courses (Chemistry, English 9–12, histories, Government) and going live (docs/HOSTING.md). Ask Jon first.
- Jon's hosting setup (docs/HOSTING.md) now uses erudior.com.

- The Van Ed refinement pass.
- A CCNA course pack. The drill engine can't do subnetting yet: it may need bitwise operators or a custom drill type.
- Windows code signing to clear the SmartScreen warning.

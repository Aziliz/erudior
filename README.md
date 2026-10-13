# Examiner

A desktop study app for licensing and certification exams, for Linux and Windows. Built with Tauri 2, React and TypeScript.

Content is organized into **courses**. Each course is one file with its own lessons, question banks, notecards, glossary, quick-reference sheets and math drills, so different subjects never mix. See [docs/COURSE_FORMAT.md](docs/COURSE_FORMAT.md).

- **Study planner**: set an exam date and get a daily checklist (lessons, card reviews, practice, drills, full exams near the end), a streak, and a readiness estimate.
- **Lessons**: Markdown lessons grouped into modules, with glossary pop-ups, completion tracking, and "practice this topic" links.
- **Notecards**: spaced repetition (Again/Hard/Good/Easy) plus a cram mode that doesn't affect the schedule. Decks are editable in the app.
- **Math drills**: problem templates that generate fresh numbers every time, with worked solutions.
- **Glossary and quick-reference sheets**: searchable terms and printable one-page summaries.
- **Timed exam mode**: random draw from the bank (with optional fixed counts per section), countdown that auto-submits, an answer-sheet navigator, and a score report by section and topic. Sections can have their own clocks and pass marks, like PSI's national and state portions.
- **Resume anything**: exams and practice autosave. Close the app mid-exam and pick up where you left off.
- **Missed questions deck**: every question you get wrong becomes a spaced-repetition notecard.
- **Flags and notes**: flags and personal notes stay with a question across sessions; practice just your flagged questions; jump from a missed question to the lesson that covers it.
- **Search**: one box (Ctrl+K) across lessons, glossary, reference sheets, questions and notecards.
- **Backup and restore**: one file with every course, bank, note and schedule.
- **Updates**: the app checks GitHub releases. Windows and AppImage installs update themselves; .deb/.rpm installs get a link to the new package. Bundled courses offer their newer revisions too.
- **Practice mode**: check each answer and read the explanation. Filter by topic, section, unseen, last missed, or under-70% questions.
- **Built-in editor**: write and edit questions, sections and exam defaults. Supports multi-answer questions.
- **Progress tracking**: session history, score trend, weakest topics, and one-click practice of missed questions.
- **Open format**: courses and banks are plain JSON (see [docs/COURSE_FORMAT.md](docs/COURSE_FORMAT.md) and [docs/BANK_FORMAT.md](docs/BANK_FORMAT.md)).

Data lives in the per-user app data folder. The path is shown at the bottom of the Progress screen:

- Linux: `~/.local/share/com.aziliz.examiner/`
- Windows: `%APPDATA%\com.aziliz.examiner\`

## Keyboard

| Key | Action |
|---|---|
| `A`–`E` or `1`–`9` | Choose an answer |
| `←` `→` | Previous or next question |
| `F` | Flag for review |
| `Enter` | Practice: check the answer, then go to the next question |
| `Space` | Notecards: flip, then rate Good |
| `1`–`4` | Notecards: Again, Hard, Good, Easy |
| `Ctrl+S` | Editors: save |
| `Ctrl+K` | Search |

## Development

Requirements: Node 20+, Rust stable, and the [Tauri prerequisites](https://tauri.app/start/prerequisites/) for your OS.

```bash
npm install
npm run tauri dev       # desktop app with hot reload
npm run dev             # UI only, in a browser (uses localStorage)
```

On Fedora, the Linux prerequisites are:

```bash
sudo dnf install webkit2gtk4.1-devel openssl-devel curl wget file libappindicator-gtk3-devel librsvg2-devel rpm-build
sudo dnf group install "c-development"
```

## Building installers

**Locally:**

```bash
npx tauri build --bundles deb,rpm,appimage   # Linux
npx tauri build --bundles nsis,msi    # Windows (run on Windows)
```

Output is written to `src-tauri/target/release/bundle/`.

**GitHub Actions** (`.github/workflows/release.yml`) builds `.deb`, `.rpm`, `.AppImage`, the NSIS `.exe` and the `.msi`, signs them, and writes the `latest.json` the in-app updater reads.

One-time setup, in the repo's **Settings → Secrets and variables → Actions**:

| Secret | Value |
|---|---|
| `TAURI_SIGNING_PRIVATE_KEY` | The full contents of the updater private key file |
| `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` | Leave empty (the key has no password), but create it |

The matching public key is already in `src-tauri/tauri.conf.json`. Keep the private key somewhere safe: if it's lost, installed copies can't verify new updates.

To release:

1. Bump the version (below).
2. `git tag v0.3.0 && git push --tags`
3. When the workflow finishes, open the draft release on GitHub and **publish** it. The updater only sees published releases.

Or run **Build installers** manually from the Actions tab to just build and download the artifacts.

The Windows installers aren't code-signed, so SmartScreen shows a warning on first run. Choose **More info**, then **Run anyway**.

## Version bumps

Update the version in `package.json`, `src-tauri/tauri.conf.json` and `src-tauri/Cargo.toml`.

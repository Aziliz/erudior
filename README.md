# Erudior

A free learning app for Linux, Windows and the web, with homeschool record-keeping in the desktop app. Built with Tauri 2, React and TypeScript.

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
- **Course updates**: bundled courses offer their newer revisions in the app. (App self-updates are built in but turned off while the repo is private; see `src/lib/updates.ts`.)
- **Practice mode**: check each answer and read the explanation. Filter by topic, section, unseen, last missed, or under-70% questions.
- **Built-in editor**: write and edit questions, sections and exam defaults. Supports multi-answer questions.
- **Progress tracking**: session history, score trend, weakest topics, and one-click practice of missed questions.
- **Open format**: courses and banks are plain JSON (see [docs/COURSE_FORMAT.md](docs/COURSE_FORMAT.md) and [docs/BANK_FORMAT.md](docs/BANK_FORMAT.md)).

Data lives in the per-user app data folder. The path is shown at the bottom of the Progress screen:

- Linux: `~/.local/share/com.erudior.app/` (before v0.17.0: `com.aziliz.examiner`, copied over on first start)
- Windows: `%APPDATA%\com.erudior.app\`

## License and engine attribution

The Erudior Engine is distributed under the custom [Erudior Engine Source-Available License](LICENSE) (draft v0.1; pending legal review). It is **source-available**, not represented as OSI-approved open-source software.

Developers building applications or services with the Engine must display an Erudior launch splash / "Powered by Erudior" attribution and return publicly deployed or distributed Engine modifications upstream (as source and a pull request or public submission). The official graphic splash is planned for the next development slice; an accessible text splash is the interim compliance option. The requirements do **not** claim ownership of independently authored courses, worksheets, artwork, student records, or data.

See [Engine Licensing and Attribution Guide](docs/ENGINE_LICENSING.md) for examples and scope. Dependencies and other third-party materials retain their own licenses. Review ownership and legal enforceability before treating these terms as final.

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

**GitHub Actions** (`.github/workflows/release.yml`) builds `.deb`, `.rpm`, `.AppImage`, the NSIS `.exe` and the `.msi`.

To release:

1. Bump the version (below).
2. `git tag v0.3.0 && git push --tags`
3. When the workflow finishes, download the installers from the draft release on GitHub (or publish it).

Or run **Build installers** manually from the Actions tab and download the artifacts from the run.

The repo is private, so installed copies can't check its releases and in-app updates are off; install new versions by hand. To turn updates back on, publish releases to a public repo, add the updater signing key as the `TAURI_SIGNING_PRIVATE_KEY` secret, and follow the notes in `src/lib/updates.ts`.

The Windows installers aren't code-signed, so SmartScreen shows a warning on first run. Choose **More info**, then **Run anyway**.

## Version bumps

Update the version in `package.json`, `src-tauri/tauri.conf.json` and `src-tauri/Cargo.toml`.

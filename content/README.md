# Colorado broker course sources

`samples/colorado-broker-course.json` (bundled with the app) is generated from these files. Edit the sources, then run:

```bash
python3 content/build_course.py
```

| Path | What it is |
|---|---|
| `parts/n1–n4.json` | National-portion lessons, questions, notecards and glossary |
| `parts/s1–s4.json` | Colorado state-portion material |
| `parts/g1–g5.json` | Gap-fill parts from the Van Ed outline comparison (mapped to modules in `GAPS` in `build_course.py`); `g3-drills.json` holds their drills |
| `lesson-quizzes.json` | End-of-lesson quiz: bank question ids per lesson, each answerable from that lesson alone |
| `refs/*.md` | Quick-reference sheets |
| `drills.json` | Math drill templates (format in `docs/COURSE_FORMAT.md`) |
| `research/` | Writers' fact notes with source links |
| `SPEC.md`, `REVIEW.md` | The writing and fact-check briefs |

The bundled course is installed once on first launch. To ship an updated course to an existing install, import the regenerated JSON from the Library and choose to replace; progress is kept as long as ids don't change.

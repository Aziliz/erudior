# Course sources

Erudior's course sources (lessons, questions, drills, notecards, pictures, writer notes and
reviews) live in the private repo **Aziliz/erudior-courses**. It builds the course files and
`scripts/sync-to-app.sh` copies them into this repo's `samples/`, which the website deploy signs
and publishes to courses.erudior.com.

Still here:

- `content/states/`: the 50-state homeschool rules (`python3 content/states/build.py` → `samples/states.json`).
- `content/math-sampler/`: a small demo course for the drill engine (`python3 content/math-sampler/build.py`).

The course format is documented in `docs/COURSE_FORMAT.md`.

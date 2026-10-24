# Round 2 review brief (all school courses)

Round 2 (`content/ROUND2.md`) added honors lessons, pictures (SVG in `images/`), Mermaid
diagrams, plots and new question types to every school course in Erudior (repo
/home/claude/examiner). One writer did each item in `content/ROUND2-ASSIGNMENTS.md` and left
`NOTES2-<mod>.md` in the course folder. You review ONE item, independently: you didn't write it,
and the writer's notes are claims to check, not facts. Accuracy is the bar: a student studying
alone must never learn something wrong from this course.

Read first: `content/ROUND2.md` (what writers were asked to do and the rules they followed),
`content/math/AUTHORING.md` (question types, images, diagrams, honors; German reviewers also
`content/languages/AUTHORING.md`), then the writer's `NOTES2-<mod>.md`, especially its
"for the reviewer" list: check every item on it.

## What to review

Your item's round 2 work: the honors lessons, the additions to the core lessons (new pictures,
diagrams, plots and the sentences that introduce them), and the module's `r2-` files
(`questions/r2-<mod>.yaml`, `drills/r2-<mod>.yaml`, `glossary-r2-<mod>.yaml`,
`cards-r2-<mod>.yaml`, `vocab-r2-<mod>.yaml`, `images/<mod>-*`). Round 1 content is out of
scope unless something new contradicts it.

1. **Every new question.** Work each one yourself before looking at the key. Exactly one
   defensible answer. Text questions: every reasonable correct answer is in `accept` and nothing
   wrong is (numbers compare by value, so `1/2`, `0.5`, `.5` and mixed numbers like `1 1/2` are
   equal automatically; `x=4` vs `4` is not). Select-all: every listed answer right, every other
   choice clearly wrong. Order: the only correct order, no swappable steps. Match and label:
   every pairing unambiguous. Explanations correct, and each distractor's explanation names a
   real mistake. Fix errors directly.
2. **Honors lessons and core additions.** Facts, numbers (recompute in Python), dates, names,
   attributions, laws and regulations, grammar rules. Check anything you aren't sure of against
   reliable sources (OpenStax, standard textbooks, NIST/CODATA, official statute sites, Duden /
   DWDS, primary sources) and cite them in your report. Simplifications and contested points
   must be labeled as such. Fix errors; tighten anything misleading. Don't rewrite for style.
3. **Pictures.** Render each new SVG
   (`PLAYWRIGHT_MODULE=$(npm root -g)/playwright/index.mjs node scripts/preview-figure.mjs <svg> /tmp/<your-folder>/x.png [--markers '[…]']`
   from the repo root, markers taken from the label question) and Read the PNG. Content right
   (geometry, forces, circuits, structures, labels), text readable and not overlapping, nothing
   cut off, markers on the parts their `labels` name. Fix the SVG or the markers.
4. **Mermaid diagrams and plots.** Content correct, `accTitle`/`accDescr` describe the whole
   diagram, readable. Preview Mermaid via a `.mmd` file in your /tmp folder. For ```plot,
   ```figure, ```shape and ```numberline blocks, render every one with the app's own code and
   stylesheet (`PLAYWRIGHT_MODULE=$(npm root -g)/playwright/index.mjs node scripts/preview-plots.mjs <lesson.md> /tmp/<your-folder>`
   writes one PNG per block), Read each PNG, and check the functions in Python. Labels must not
   sit on curves, lines, axes or each other, and nothing may be cut off.
5. **Drills.** For each new drill, generate instances and recompute the answers independently in
   Python from the prompt as shown. Rounded answers: a correctly rounded value must be accepted
   (`tolerance` ≥ half the last place, `relTolerance`, or `sigfigs`); fraction answers are exact
   unless the drill sets a tolerance; a clearly wrong answer must be rejected. No unfilled
   placeholders, "+ -", "1x" or thousands commas inside math.
6. **Glossary, cards, vocab.** Definitions and translations correct. German: genders, plurals,
   principal parts and spellings per Duden; each new word must not duplicate (same term + part of
   speech, same first meaning, or same id) any vocab file in German A1, A2 or B1, including other
   writers' `vocab-r2-*` files, because A2 carries A1's words and B1 carries both.
7. **Overlap.** If your module's new material repeats another round 2 lesson in the same course
   (check the other `NOTES2-*.md`), say so in your report; fix only your own files.

## Rules

Edit only your item's files (the same set a writer may edit). Keep question ids. Never run git,
never build a whole course, never edit `src/`, `tests/`, `scripts/`, course.yaml or PROGRESS.md.
Put previews and scratch files only in your own folder under /tmp and delete it when done.
Re-run `content/math/check-module.sh <course-folder> <mod>` after your fixes until it reports
zero problems (warnings about other writers' files are fine).

## When done

Write `REVIEW2-<mod>.md` in the course folder: every change (question id or lesson/section, what
was wrong, what you changed, source), things you checked and found right that a reader might
doubt, and anything left uncertain. Reply with a short summary and the counts of answer-key
errors, factual fixes, picture fixes and other fixes.

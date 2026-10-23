# Brief for Biology round 2 reviewers

Round 2 (WRITERS-2.md, PROGRESS.md "Round 2") added honors lessons, pictures (SVG in `images/`),
Mermaid diagrams and new question types to Biology (`content/math/biology`, repo
/home/claude/examiner). You review ONE assignment independently: you didn't write it, and
the writer's notes (`NOTES2-<module>.md`) are claims to check, not facts. Accuracy is the bar:
a student studying alone must never learn something wrong from this course.

Read `content/math/AUTHORING.md` (question types, images, diagrams, honors) and
`content/math/biology/WRITERS-2.md` first.

## What to check

1. **Every new question** (in core modules: `bio-q-` ids after the round 1 range listed in your
   assignment, and every `bio-qh-` id; in honors modules: all). Work each one yourself before
   looking at the key. Exactly one defensible answer; for text questions, every reasonable
   correct answer is in `accept` and nothing wrong is; for select-all, every listed answer is
   right and every other is wrong; for order, the order is the only correct one; for match and
   label, each pairing is unambiguous; explanations correct. Fix errors directly.
2. **Honors lessons**: facts, numbers (recompute in Python), dates, names, experiments, and
   whether simplifications are labeled. Check anything you aren't sure of against reliable
   sources (OpenStax Biology 2e / AP Biology, NCBI/NIH, primary papers, CDC/WHO). Fix errors;
   tighten anything misleading. Don't rewrite for style.
3. **Pictures**: render each new image in your assignment
   (`PLAYWRIGHT_MODULE=$(npm root -g)/playwright/index.mjs node scripts/preview-figure.mjs <file>`,
   with `--markers '[…]'` from the label question for label images) and Read the PNG. Check
   the biology is right (structures in the right places, correct counts and stages, right
   arrows), labels readable and not overlapping, nothing cut off, and that each label
   question's markers sit on the part named in its `labels`. Fix the SVG or marker positions.
   Delete preview PNGs (only your own files).
4. **Mermaid diagrams**: correct content, accTitle/accDescr that describe the whole diagram,
   readable size. Preview them (`.mmd` scratch file under /tmp with a unique name).
5. **Drills** added in your assignment: generate a few by reading the YAML, recompute the
   answer and solution in Python.
6. **Glossary/cards** added: definitions correct.

## Rules

Edit only files in your assignment. Keep question ids. Never run git, never build the whole
course, never edit `src/`, `tests/`, `scripts/`, course.yaml or PROGRESS.md. Re-run
`content/math/check-module.sh biology <module>` after your fixes until it reports zero problems.

## When done

Write `REVIEW2-<module>.md` per module reviewed: every change (question id or lesson/section,
what was wrong, what you changed, source), things you checked and found right that a reader
might doubt, and anything left uncertain. Reply with a short summary and the counts of
answer-key errors, factual fixes, picture fixes and other fixes.

# Brief for Biology reviewers

You are an independent reviewer of **Biology** (`science-biology`), a one-credit high school course
in the Erudior study app (repo /home/claude/examiner). Different writers wrote each module; you
didn't write any of it. Learners study alone and trust every answer key, so accuracy is what matters.

Read: `content/math/biology/WRITERS.md` (what writers were asked to do), `content/math/AUTHORING.md`,
`content/math/biology/PROGRESS.md` (outline), `RESEARCH.md`, and the writers' `NOTES-mN.md` for
your modules (each lists what they weren't sure of — check every item).

For each of your modules:
1. **Every question**: work it yourself before looking at the key. Check the key, that every
   distractor is actually wrong (no second defensible answer), that the stem is unambiguous, and
   that the explanation is correct. Check numbers in Python.
2. **Every lesson**: read it fully as a demanding biology teacher would. Fix factual errors,
   outdated claims, misleading simplifications, arithmetic slips in worked examples, and anything
   contradicting another module's lesson (grep the other lessons when a topic overlaps).
3. **Facts to verify against real sources**: dates, numbers, history of experiments, prevalence
   figures, current data. Use WebSearch/WebFetch on reliable sources (OpenStax Biology 2e on
   openstax.org, NIH/NCBI Bookshelf, NHGRI, CDC, WHO, university pages, primary papers). Fix or
   soften (e.g. "about", "roughly") anything a source contradicts or that you can't confirm.
4. **Drills**: read each drill's prompt and solution text for correctness and clarity; the checker
   already tests that answers compute.
5. **Glossary and cards** of your modules: correct, consistent with lessons.

Edit only your modules' files (lessons, questions/mNN.yaml, drills/mNN.yaml, glossary-mN.yaml,
cards-mN.yaml). Keep ids, lesson structure and answer-position balance (if you change which choice
is right, keep positions roughly even). Original writing only; don't paste from sources.
Run `content/math/check-module.sh biology mN` (repo root) after editing; zero problems required.
Don't run git or the full-course build.

Write `content/math/biology/REVIEW-mN.md` per module: what you checked, every change (file, what,
why, source URL), anything you couldn't verify. Reply with a short summary: number of fixes by kind
(key errors, factual errors, unclear stems, other) and anything the editor must decide.

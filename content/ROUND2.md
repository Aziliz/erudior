# Round 2 brief: honors, pictures, diagrams and new question types (all school courses)

Erudior (repo /home/claude/examiner) ships school courses written as YAML and Markdown under
`content/math/<course>` and `content/languages/<course>`. Biology already went through this
round (see `content/math/biology` for finished examples: `lessons/05h2-enzyme-kinetics.md`,
`lessons/13h1-free-energy.md`, `questions/m01.yaml` from bio-q-0157, `images/m2-*.svg`). Now every
other school course gets the same: **optional honors lessons**, **pictures and diagrams in every
lesson**, and **new question types**. Many writers work at once, one module each: touch ONLY your
own files (listed below). Learners study alone with no teacher; accuracy comes first, always.

Read first:
1. `content/math/AUTHORING.md`: the format and quality rules, especially "Other question types",
   "Images", "Diagrams (Mermaid)" and "Honors". German writers also read
   `content/languages/AUTHORING.md` (or the language notes in the course folder) for vocab rules.
2. The course's own notes (PROGRESS.md / RESEARCH.md / WRITERS.md in the course folder, if any).
3. Your module's lessons, questions, drills, glossary and cards, so you build on them without
   repeating them and keep the course's id style, tone and notation.

## Your files (create new files; don't edit shared ones)

`<mod>` is your module id (e.g. `alg-m2`, `de1-m3`, `calc-h1`).
- Lessons: edit your module's core lessons (additions only, see below); create honors lessons.
- `questions/r2-<mod>.yaml`: ALL your new questions (core and honors). Ids `<mod>-r2-q01`, …
  (core lessons) and `<mod>-r2-h01`, … (honors lessons).
- `drills/r2-<mod>.yaml`: new drills, ids `<mod>-r2-<slug>`. Language courses have no drills.
- `glossary-r2-<mod>.yaml`, `cards-r2-<mod>.yaml`: new glossary entries and cards (cards need
  `topic`). Before adding a term, grep EVERY `glossary*.yaml` in the course: never define a term or
  alias that exists (language courses fail the build on duplicates).
- German: `vocab-r2-<mod>.yaml` for words an honors lesson introduces (ids `<mod>-r2-w01`…; same
  rules as the course's vocab files; check the course and the courses it `requires` for
  duplicates).
- `images/<mod>-<name>.svg`.
- `NOTES2-<mod>.md`.
Edit an existing question, drill, card or glossary entry ONLY to fix a real error, and list it in
your notes. Never edit course.yaml, PROGRESS.md, other modules' files, `src/`, `tests/`,
`scripts/`; never run git; never build the whole course.

## Honors lessons

- **In a core module:** 2 honors lessons (3 if the module is large and there is more worth
  teaching), front matter `honors: true`, `module: <mod>`. File name: the module's last core lesson
  file's number + `h1`, `h2` (`12-quadratic-formula.md` → `12h1-<slug>.md`), so they sort after the
  module. Lesson ids `<mod>-h-<slug>`.
- **In an honors module** (`<prefix>-h1`, already in course.yaml with `honors: true`): 4 lessons
  on the module's theme, files `90-<slug>.md`, `91-…`, `92-…`, `93-…`, `module: <mod>`
  (no `honors:` line needed). They have a module quiz: mark about a third of their questions
  `module_quiz: true`, at least 2 per lesson. Choose topics that go beyond the core course and
  don't duplicate what the course already teaches; the core modules' writers are adding their
  own honors lessons, which extend single modules, so aim for cross-cutting, capstone material.
- Depth: honors or AP / early college level for high school courses, a real step beyond the core
  lesson for college courses (proofs, derivations, applications, the history and evidence behind
  results). German honors: culture, longer authentic-style texts (original writing, or public
  domain only), extra grammar and vocabulary at the course's CEFR level or slightly above.
- 1,200–2,200 words; `minutes: 35`–`50`; intro tying back to the core lesson; `##` sections that
  explain why/how; at least two worked examples (`### Example 1`, …); "Common mistakes"; "Key
  points". 12–16 questions each, about a third of them new types. Drills wherever there is real
  computation. Glossary entries for every bolded new term; 8–15 cards per honors lesson.
- Label anything contested or simplified as such. Recompute every number in Python.

## Core lessons of your module

- Additions only: don't rewrite or shorten existing text. You may add a sentence or two to
  introduce a picture.
- Every core lesson ends up with at least one picture, Mermaid diagram or figure (```plot /
  ```shape / ```numberline count); add two or three where a structure, process, procedure,
  classification or comparison is taught. Math: diagrams of solution procedures and "which method
  when" decision charts (Mermaid), geometric pictures and labeled figures (SVG or ```shape),
  graphs (```plot). Physics: free-body and setup diagrams, apparatus, circuits, ray diagrams.
  German: label-the-picture scenes (house, body, town, kitchen), dialogue flows, grammar charts.
- 4–6 new questions per core lesson using the new types: at least one `text` (fill in the blank:
  for math, numeric answers or short terms; list every equivalent form), one `order` or `match`,
  one select-all (`answer: [..]`, stem ends "Select all that apply."), and a `label` question
  where the lesson has a picture worth labeling. German: word-order (`order`) questions, typed
  German answers (`text`: list spelling variants such as ae/oe/ue/ss alongside ä/ö/ü/ß; capital
  letters ignored unless `caseSensitive: true`), match word ↔ meaning, label a scene.
  Mark one or two `module_quiz: true` per lesson.

## Rules learned from Biology (follow them)

- An `order` question must have exactly ONE correct order: no two steps that could be swapped.
- Select-all: every listed answer right, every other choice clearly wrong.
- Match/label answers are drop-down text: plain text, no `$math$` (left items may use math).
- Text questions: think of every reasonable correct answer (plural, synonyms, notation variants
  like `1/2`, `0.5`, `.5` are equal automatically; `x=4` vs `4` is not: say "Give only the number").
- Drills: if the prompt says "to 2 decimal places" or "2 significant figures", make sure a
  correctly rounded answer is accepted (`tolerance` ≥ half the last place, or `sigfigs`), for
  every possible input.
- Mermaid: `flowchart TD` (top-down) for chains of more than four boxes; about 12 boxes max;
  `accTitle:` and `accDescr:` describing the whole diagram; quote labels with punctuation.
- Pictures: original SVG only; white background rect, #1c2833 lines and text ≥14px sans-serif,
  soft fills (#dde8f3, #dcf0e3, #f7ebcf, #f8e1dc, #e8e2f3); under ~40 KB; for label questions an
  unlabeled copy (`-blank.svg`) with markers placed exactly on the parts. LOOK at each one:
  `PLAYWRIGHT_MODULE=$(npm root -g)/playwright/index.mjs node scripts/preview-figure.mjs <svg or .mmd> /tmp/<your-own-folder>/x.png [--markers '[…]']`
  from the repo root, then Read the PNG. Put previews and scratch files ONLY in your own folder
  under /tmp (e.g. /tmp/r2-alg-m2/), and delete only your own files.
- Keep apostrophes and quotes intact in YAML (single-quoted strings double an apostrophe: 'it''s').
- Don't overstate: "usually", "about", dates and attributions checked.

## Checking

From the repo root: `content/math/check-module.sh <course-folder> <mod>` (works for every course
and for honors modules). Build and checker must report zero problems. Warnings about other
writers' files are fine.

## When done

Write `NOTES2-<mod>.md` in the course folder: what you added (honors lessons with titles,
questions by type, pictures, diagrams, drills, terms, cards), anything a reviewer should
double-check, errors found in existing content, and sources. Reply with the same summary.

# Brief for Biology round 2 writers: honors, pictures, diagrams, new question types

Biology (`science-biology`, repo /home/claude/examiner, folder `content/math/biology`) is a
released one-credit high school course: 40 core lessons in 10 modules. This round adds
**honors material** (optional lessons at honors/AP-intro depth) and makes the course more
visual and varied: **pictures** (original SVGs), **Mermaid diagrams**, and **new question
types** (fill in the blank, match, put in order, label the picture, select all that apply).
Other writers work in the same folder at the same time: touch ONLY the files in your
assignment, plus new files you create with your own prefix.

Read first:
1. `content/math/AUTHORING.md`, especially "Other question types", "Images", "Diagrams
   (Mermaid)" and "Honors" (new), and the lesson/question rules.
2. `content/math/biology/WRITERS.md`: the biology rules from round 1. They all still apply
   (lesson length and structure, worked examples, accuracy, original writing, drills, glossary,
   cards, answer spread for 4-choice questions).
3. `content/math/biology/PROGRESS.md`: the core outline and the round 2 honors outline (lesson
   ids, file names, titles, topics). Use those exactly.
4. The core lessons, questions, glossary and cards of your module(s), so honors lessons build
   on them without repeating them and new questions don't duplicate old ones.

## What to write

**Honors lessons** (your assignment lists them): `honors: true` in front matter, 1,300–2,200
words, `minutes: 35`–`50`. Go a real step beyond the core lesson (mechanism, quantitative
reasoning, the experiments and data behind it) at the level of an honors course or the start
of AP Biology / intro college biology. Same structure: intro tying to the core lesson, `##`
sections, at least two worked examples (worked problems with data, calculations, predictions),
"Common mistakes", "Key points". Each honors lesson gets:
- 12–16 questions (ids `bio-qh-NNxx` in core modules, `bio-qh-hN-xx` in honors modules), of
  which about a third are other types (text, match, order, label, select-all). In an honors
  MODULE, mark about a third `module_quiz: true` (≥2 per lesson); in a core module honors
  lesson, `module_quiz` isn't used.
- At least one picture or diagram, more where they help. Drills (ids `bio-h-…`, listed in the
  lesson's `drills:`) wherever there is real computation; 1–3 per lesson is typical for
  quantitative lessons.
- Glossary entries for every bolded new term, and 8–15 cards, in your module's files.

**Core lessons of your module(s)** (if your assignment includes them): improve without
rewriting what's there.
- Add at least one picture (SVG in `images/`) or Mermaid diagram to every core lesson, two or
  three where a process, structure or cycle is being taught (cell structures, organelles,
  membranes, mitosis/meiosis stages, DNA, replication fork, transcription/translation, the
  photosynthesis/respiration overview, Punnett/pedigree charts, phylogenies, food webs, cycles,
  body systems, feedback loops). Put each where the text discusses it; mention it in the text.
- Add 4–6 new questions per core lesson using the new types: at least one `text`, one of
  `match`/`order`, one `label` where the lesson has a structure worth labeling, and one
  select-all (`answer: [..]`, stem ends "Select all that apply."). Ids continue the module's
  `bio-q-NNxx` numbering after the highest existing id; mark one or two `module_quiz: true`.
  Don't change existing questions' ids or answers (fix a real error only if you find one, and
  note it in your NOTES).

## Pictures

- Original SVG drawings only (no tracing or copying textbook/web figures). File names start
  with your module code: `images/m2-animal-cell.svg`, `images/h1-error-bars.svg`.
- Style: `viewBox` with a white `<rect>` background; dark #1c2833 outlines; soft fills
  (#dde8f3 blue, #dcf0e3 green, #f7ebcf yellow, #f8e1dc pink, #e8e2f3 lilac); text 14–18px
  `font-family="sans-serif"` in #1c2833; labels with thin leader lines. Schematic and
  clear beats detailed. Keep each under ~40 KB.
- For `label` questions, draw the image WITHOUT the answer labels (the app overlays numbered
  markers at your `labels` x/y percentages); use the same structure, with labels, elsewhere in
  the lesson if you like (a separate labeled file).
- LOOK at every image and diagram before finishing: render it with
  `PLAYWRIGHT_MODULE=$(npm root -g)/playwright/index.mjs node scripts/preview-figure.mjs <file>`
  (from the repo root; add `--markers '[{"x":..,"y":..}]'` for label questions; for a Mermaid
  diagram put the source in a scratch `.mmd` file under /tmp). Then Read the PNG it prints
  and fix anything misplaced, overlapping, cut off or inaccurate. Delete the preview PNGs.
- Alt text: a sentence or two saying what the picture shows (for label images, describe the
  structure without giving away the answers).

## Diagrams

Mermaid `flowchart`, `sequenceDiagram`, `timeline`, `pie`, `stateDiagram` etc. are all fine;
flowcharts suit cycles, pathways, feedback loops, food chains, classification keys. Every one
needs `accTitle:` and `accDescr:` (a full description). Plain-text labels; quote labels with
punctuation: `A["ATP + NADPH"]`. Keep to about 12 nodes.

## Accuracy

Accuracy first, always: check every fact you aren't certain of against a reliable source
(OpenStax Biology 2e / AP Biology, NIH/NCBI, primary literature), check every number in Python,
and prefer current understanding. Honors content invites over-reach: if something is
contested or simplified, say so in the lesson. Every question needs exactly one defensible
answer (all accepted variants listed for text questions).

## Checking

From the repo root: `content/math/check-module.sh biology mN` (core module N, also builds its
honors lessons) or `content/math/check-module.sh biology hN` (honors module). Build and
checker must report zero problems. Never build the whole course, never run git, never edit
`src/`, `tests/`, `scripts/`, `course.yaml`, PROGRESS.md or another writer's files.

## When done

Write `content/math/biology/NOTES2-<module>.md` (e.g. NOTES2-m3.md, NOTES2-h1.md): what you
added (lessons, questions by type, pictures, diagrams, drills, terms, cards), anything a
reviewer should double-check, any errors you found in existing content, and sources. Reply
with the same summary.

# Brief for Biology module writers

You are writing part of **Biology** (`science-biology`), a one-credit high school course in the
Erudior study app (repo at /home/claude/examiner). Learners study alone with no teacher, so every
lesson must teach, not summarize. Other writers are writing the other modules at the same time in
the same folder: touch ONLY the files named in your assignment.

Read first, in this order:
1. `content/math/AUTHORING.md` — the format and quality rules (lessons, questions, drills, cards,
   glossary, figures, math notation, YAML quoting). Follow it exactly, with the biology changes below.
2. `content/math/biology/PROGRESS.md` — the full 40-lesson outline (ids, titles, topics, drill ids).
   Keep the lesson ids, module ids, topics and drill ids exactly as listed for your lessons.
3. `content/math/biology/RESEARCH.md` — scope (NGSS HS-LS1–4 and Texas TEKS Biology).
4. `docs/COURSE_FORMAT.md` — drills, answers, figures reference.
5. One finished lesson + its questions for tone: `content/math/physics/lessons/12-energy.md` and
   `content/math/physics/questions/m04.yaml`.

## Biology-specific rules
- Lesson bodies 1,000–1,800 words. Each lesson: intro tying to the previous lesson; `##` sections
  that explain *why/how* (mechanism, evidence, the classic experiment that showed it); at least two
  worked examples (`### Example 1`, …) — in biology these are worked problems (a cross, a
  calculation, reading a graph or data table, predicting an outcome of an experiment, tracing a
  process step by step); a "Common mistakes" section; "Key points" list at the end.
- Wet labs can't be assumed. Describe classic experiments (Mendel, Griffith/Avery, Hershey–Chase,
  Meselson–Stahl, van Helmont, Pasteur, Grant finches, Lederberg…) and work with their data.
- Figures: use ```plot for graphs (enzyme activity vs temperature, population growth curves,
  survivorship, absorption spectra as bars or curves), ```shape for simple diagrams (labels,
  circles, polygons, arrows) only where they truly help; Punnett squares and data as Markdown tables.
  Figure text is plain text, not TeX.
- Questions: 10–12 per lesson, 4 choices, answer index spread evenly over 0–3 within your files,
  about a third `module_quiz: true` (≥2 per lesson). Mix recall with application: interpret data,
  predict experiment outcomes, crosses, "which conclusion is supported", calculations. Explanations
  say why the right answer is right and name the misconception behind distractors.
- Drills: write every drill id listed in the outline for your lessons (more are welcome where
  there is real computation). Biology drills must have clean numbers (`where` clauses), say how to
  answer (fraction, percent, decimals), and use the right answer type (`fraction` for genetic
  probabilities, `relTolerance` for decimals). A lesson with "—" in the drills column has no drills
  and no `drills:` line.
- Glossary: every **bolded** term gets an entry in YOUR `glossary-mN.yaml` (one file per module you
  write). Bold a term only in the lesson that introduces it. 15–30 terms per module, plus standard
  abbreviations (ATP, DNA, mRNA, PCR, …) where they first appear. If a term clearly belongs to
  another module (e.g. you mention "allele" in module 7), don't bold it; just use it.
- Cards: `cards-mN.yaml`, 15–30 per module: definitions, "compare X vs Y", processes in order,
  formulas. `{front, back, topic}`; topics from the outline.
- Reference sheet ids you may list in lesson `refs:` (they exist; the editor fills them later):
  `bio-ref-lab` (metric units, microscope math, experimental design, graphs), `bio-ref-cell-energy`
  (photosynthesis/respiration equations, ATP yield), `bio-ref-genetics` (crosses, probability rules,
  pedigree symbols, Hardy-Weinberg, chi-square table), `bio-ref-evolution-ecology` (growth
  equations, 10% rule, diversity index, geologic time). Don't edit `references/`.
- Accuracy over volume: current science (e.g. three-domain system; ~30 ATP per glucose in
  eukaryotes, noting older 36–38 figures; endosymbiosis evidence; modern view of
  gene regulation). Check every numeric answer in Python. Avoid anything a reasonable biology
  teacher would call wrong or outdated. Original writing only; don't copy OpenStax/CK-12/Khan or
  any textbook, and use no copyrighted images.
- Respectful, inclusive, factual on human topics (genetic disorders, sex chromosomes, evolution,
  vaccines). Evolution is taught as the well-supported scientific theory it is.

## Checking
After each module: `content/math/check-module.sh biology mN` (N = module number, no leading zero),
from the repo root. Both the build and the checker must report zero problems. Fix everything.
Never run `python3 content/math/build.py biology` on the whole course (other modules are half
written) and never run git.

## When done
Write `content/math/biology/NOTES-mN.md` for each module you wrote (don't edit PROGRESS.md; other
writers are using the folder too): counts (lessons, questions with answer-position tally, drills, glossary, cards),
anything uncertain a reviewer should check, and sources you consulted. Then reply with the same
summary.

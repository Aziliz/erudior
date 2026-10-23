# Round 2 notes: module a2-m5 (Rational expressions and functions)

`content/math/check-module.sh algebra2 a2-m5`: build and checker report zero problems
(7 lessons, 108 questions, 18 drills, 43 cards).

## Added

**Honors lessons** (`honors: true`, `module: a2-m5`)
- `lessons/19h1-slant-asymptotes.md` (a2-m5-h-slant-asymptotes, "Slant asymptotes and end behavior",
  40 min, about 1,890 words of prose). Covers proper and improper rational functions and the
  division form $P/Q = q + r/Q$. It shows why the quotient is the end behavior, which explains all
  three rows of lesson 18's degree table plus slant asymptotes and polynomial end behavior. Also:
  above or below the asymptote from the sign of $r/Q$, crossing horizontal and slant asymptotes at
  the zeros of $r$, average cost $C(x)/x$, and the AM–GM inequality with its proof, used to
  minimize $px + q/x$.
  - Examples: $(x^2 - 4)/(x - 1)$; $(x^3 + 2x^2 + 1)/(x^2 + 1)$, which crosses its slant asymptote
    at $(-1, 1)$; $(2x^2 + x - 3)/(x^2 - 4)$, which crosses $y = 2$ at $x = -5$; and the average
    cost $0.04x + 6 + 900/x$, with a minimum of \$18 at 150 items.
  - Figures: 1 Mermaid diagram and 3 plots.
- `lessons/19h2-partial-fractions.md` (a2-m5-h-partial-fractions, "Partial fraction
  decomposition", 45 min, about 1,670 words). Covers distinct linear factors; why substituting an
  excluded value is legitimate (a polynomial identity); matching coefficients; the cover-up method
  and its limits; counting unknowns to explain the forms for repeated linear factors and
  irreducible quadratics; the uniqueness theorem (stated, not proved, and labeled as such);
  dividing first for improper fractions; and telescoping sums.
  - Examples: $(5x + 1)/((x - 1)(x + 2))$; $(x^2 + 2x + 5)/(x(x - 1)^2)$;
    $(3x^2 + x + 4)/((x + 1)(x^2 + 1))$; $(x^3 + x^2 - 4x + 1)/(x^2 - 1)$; and
    $\sum 1/(k(k + 1))$ to 99 terms. Also the gap-2 sum $\sum 2/(k(k + 2))$.
  - Figures: 1 Mermaid diagram.

**Core lessons 15–19** (additions only, each with a sentence introducing the figure):
- 15: a Mermaid flowchart for simplifying, multiplying and dividing, after the Dividing section.
  The lesson already had a hole plot.
- 16: an SVG of factor columns for building the LCD (`a2-m5-lcd-columns.svg`) and a Mermaid
  flowchart for adding and subtracting.
- 17: a Mermaid flowchart of the method, with its reject-extraneous decision. Also a plot of both
  sides of Example 2, with a paragraph showing that they always differ by exactly 1. That is why
  there is no solution.
- 18: a Mermaid diagram of the hole vs vertical asymptote decision, and a labeled SVG of all five
  features of $f(x) = \dfrac{2x^2 + 4x - 16}{x^2 + 5x + 4}$ (hole $(-4, 4)$, VA $x = -1$, HA
  $y = 2$, intercepts $(2, 0)$ and $(0, -4)$), with a paragraph working them out.
- 19: a Mermaid flowchart of the sign-chart method, with the endpoint decision. Also a plot of
  $\dfrac{x + 1}{x - 3}$ for Example 3.

**Pictures** (original SVGs, all under 13 KB, rendered and checked): `a2-m5-lcd-columns.svg`,
`a2-m5-rational-features.svg` and `a2-m5-rational-features-blank.svg` (the blank one is for the
label question; the markers were placed with the same coordinate map as the drawing and checked
in a preview with markers).

**Diagrams**: 7 Mermaid diagrams (lessons 15, 16, 17, 18, 19, 19h1, 19h2), all `flowchart TD`,
each with accTitle and accDescr, at most 11 boxes, all rendered. Lesson 19's `<`/`>` edge label
uses `#lt;`/`#gt;`.

**Questions** (`questions/r2-a2-m5.yaml`, 53 new)
- Core, a2-m5-r2-q01…q25, 5 per lesson. Each lesson has a text question, a match or order
  question, and a select-all question; lesson 18 also has a label question.
  - text (7): q01, q02, q06, q11, q17, q20, q21
  - match (5): q03, q10, q13, q18, q23
  - order (3): q07, q12, q22
  - select-all (5): q04, q08, q14, q19, q24
  - label (1): q16
  - MC (4): q05, q09, q15, q25
  - module_quiz, 2 per lesson: q01, q04, q06, q08, q11, q14, q16, q18, q22, q24
- Honors, a2-m5-r2-h01…h14 (slant asymptotes) and h15…h28 (partial fractions), 14 per lesson,
  9 MC and 5 new types each. No module_quiz.
  - text: h03, h04, h16, h22
  - select-all: h05, h19
  - match: h06, h21
  - order: h07, h20
- MC answer positions (22 questions): 0: 5, 1: 6, 2: 6, 3: 5.

**Drills** (`drills/r2-a2-m5.yaml`, 5)
- 19h1: a2-m5-r2-slant (slant and vertical asymptotes, expression answer),
  a2-m5-r2-cross-ha (horizontal asymptote and crossing point), a2-m5-r2-avg-cost (AM–GM minimum
  of average cost, money answer).
- 19h2: a2-m5-r2-partial (A and B by cover-up), a2-m5-r2-telescope (exact fraction for
  $\sum d/(k(k + d))$, $d = 1$ or 2).

**Glossary** (`glossary-r2-a2-m5.yaml`, 8 terms): proper rational function, improper rational
function, AM–GM inequality, average cost, partial fraction decomposition, cover-up method,
irreducible quadratic, telescoping sum. Each was checked against every `glossary*.yaml` in the
course, including the other writers' r2 files: no duplicate term or alias. Every bolded term in
lessons 15–19, 19h1 and 19h2 has an entry (oblique asymptote and end behavior already existed).

**Cards** (`cards-r2-a2-m5.yaml`, 21): 11 for 19h1 (topics Slant asymptotes, Average cost) and 10
for 19h2 (topic Partial fractions).

## Verification

- All question keys, distractors and lesson-example numbers were checked with sympy and
  fractions (59 checks, `/tmp/r2-a2-m5/vq.py`, since deleted). These include every partial
  fraction decomposition, division, inequality solution set, asymptote and the average-cost
  minima.
- Each drill was generated 400 times with `generate()` on the built module JSON and checked
  against an independent computation:
  - every independently computed answer, including exact fractions for the telescoping sums
    built with BigInt, was accepted;
  - the shown answer typed back was accepted;
  - a wrong answer was rejected;
  - the text was scanned for NaN, `+ -`, `1x`, `1(` and unfilled placeholders.
  
  0 problems. The average-cost brute-force minimum over integers agreed with $\sqrt{F/p}$ every
  time.
- Order questions were checked for a single valid order. The AM–GM proof order (h07) uses
  3 steps, and the equality condition went into the explanation, because it could otherwise be
  placed in two positions.

## For the reviewer

- Lesson 19h2 says the cover-up method is "often named after the English engineer Oliver
  Heaviside". That is standard usage; please confirm the wording.
- `telescoping sum` is defined in my glossary file. The a2-m7 writer's `24h1-finite-differences.md`
  also bolds **telescoping sum** (and points to this lesson), but their glossary file has no entry
  for it. If they add one later, one of the two must be removed.
- The uniqueness of partial fraction decompositions is stated without proof and labeled as proved
  in more advanced courses. The average-cost model is labeled a simplification.
- The label question q16 reuses the lesson 18 figure, unlabeled.

## Errors found in existing content

None. All five core lessons' examples were re-read and the new figures agree with them. No
existing question, drill, card or glossary entry was edited.

## Sources

Standard results only: the division algorithm, partial fractions (the
"Partial Fractions" sections of OpenStax College Algebra 2e and Precalculus 2e cover the same forms), the AM–GM inequality, and telescoping series. All
explanations, examples, figures and questions are original.

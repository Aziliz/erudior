# Round 2 notes: module alg-m1 (Foundations and linear equations)

`content/math/check-module.sh algebra1 alg-m1`: build and checker report zero problems
(7 lessons, 107 questions, 18 drills, 47 cards).

## Added

**Honors lessons** (both `honors: true`, 45 min, ~1,550–1,800 words of prose)
- `lessons/05h1-decimals-fractions.md` (alg-m1-h-decimals-fractions), "Inside the real numbers:
  decimals, fractions and density": why p/q must terminate or repeat (the remainder argument,
  block length ≤ q − 1), the 2-and-5 test for terminating decimals, repeating decimal → fraction
  by a linear equation (block over 9s; delayed repeats with 100x − 10x), 0.999… = 1, a "which
  method when" chart, recognizing irrational decimals, density of the rationals and
  irrationals, and a first proof by contradiction (no smallest positive rational). Examples:
  which fractions terminate; 0.\overline{135} = 5/37; 0.4\overline{6} = 7/15; a rational and an
  irrational between 2/7 and 3/10.
- `lessons/05h2-rates-and-averages.md` (alg-m1-h-rates-averages), "Rates that combine: work,
  average speed and weighted averages": work rates add (t = ab/(a + b)), opposing rates subtract,
  choosing the rate as the unknown to keep the equation linear, average speed = total distance ÷
  total time, the harmonic mean 2ab/(a + b), the "average 80 mph" impossibility puzzle, weighted
  averages (course grades), and the balance rule w₁(m − x₁) = w₂(x₂ − m), which ties back to
  Lesson 5's mixture. Six worked examples.

**Core lessons 01–05**: additions only; nothing rewritten.
- 01: nested number-sets picture (SVG), "classify a number" decision chart (Mermaid),
  distance-on-the-number-line figure (numberline).
- 02: labeled parts of an expression (SVG), order of operations chart (Mermaid).
- 03: balance-scale picture for 3x + 2 = 11 → 3x = 9 (SVG), solving-strategy chart with the
  no-solution / identity branches (Mermaid), parallel-lines plot for Example 4.
- 04: "solving for a variable" decision chart (one term vs. several, factor out) (Mermaid),
  cylinder unrolled into its net, explaining S = 2πrh + 2πr² (SVG, with a new two-sentence
  paragraph).
- 05: word-problem routine (Mermaid), opposite-direction cyclists (shape), mixture beakers
  showing "acid in = acid out" (SVG, with one new sentence).

**Pictures** (10 SVGs, original, 1–6 KB each, all rendered and looked at): alg-m1-number-sets
(+ -blank), alg-m1-expression-parts (+ -blank), alg-m1-cylinder-net (+ -blank), alg-m1-balance,
alg-m1-mixture, alg-m1-remainder-cycle, alg-m1-work-tape. Blank versions are for label questions;
markers were previewed in position.

**Diagrams**: 6 Mermaid (5 core + 1 honors), all with accTitle/accDescr, all rendered. Figures:
4 new plot/shape/numberline blocks in core lessons, 2 in honors; rendered and checked for
overlapping labels.

**Questions** (51, `questions/r2-alg-m1.yaml`)
- Core alg-m1-r2-q01…q25 (5 per lesson; each lesson has a text, an order or match, and a
  select-all; label questions in 01, 02, 04): label 3, text 5, order 5, match 5, select-all 5,
  MC 2. module_quiz: q01, q04, q06, q09, q12, q13, q18, q22, q23.
- Honors alg-m1-r2-h01…h13 (decimals) and h14…h26 (rates): each 13 = 8 MC + 2 text + 1 order +
  1 match + 1 select-all. No module_quiz (core-module honors).
- Answer positions of the 18 four-choice MC: 0: 4, 1: 5, 2: 5, 3: 4.

**Drills** (5, `drills/r2-alg-m1.yaml`): alg-m1-r2-repeating-two, alg-m1-r2-repeating-delayed
(fraction answers, lowest terms), alg-m1-r2-work-together (fraction or 2 dp, tolerance 0.0051),
alg-m1-r2-round-trip, alg-m1-r2-final-needed (whole-number answers). Each run 400 times against an
independent recomputation, with the correct typed answer accepted every time.

**Glossary** (9, `glossary-r2-alg-m1.yaml`, checked against every glossary*.yaml): terminating
decimal, repeating decimal, lowest terms, dense, work rate, combined rate, average speed,
harmonic mean, weighted average. The honors lesson also bolds **remainder** and **proof by
contradiction**, which already have entries (glossary-r2-alg-m5 and glossary-r2-a1-m7).

**Cards** (20, `cards-r2-alg-m1.yaml`): 11 decimals/density, 9 rates/averages.

## For a reviewer to double-check
- Overlap avoided: I first wrote a proof that √2 is irrational, then found that 32h1
  (a1-m7 honors) already proves it, including why the argument fails for √4. I replaced it with
  density and a different first proof by contradiction (no smallest positive rational). 05h1 now
  points to "an honors lesson in Module 7" for the √2 proof; if 32h1 moves or is renamed, update
  that sentence.
- 05h1 says the "multiply an endless decimal by 10 and subtract" step is fully justified only
  with limits (labeled as a simplification).
- 05h2 labels "rates add" as a modeling assumption (workers don't interfere). The 120 mph return
  speed in Example 5 is described as "over any legal limit".
- Text question accept lists: fractions like "1/2" are compared as text, not by value (see
  `textMatches` in src/lib/questions.ts), so every text blank here has a whole-number answer.
  ROUND2.md says `1/2` and `0.5` compare equal automatically, but in the code they don't.
- Label marker positions: number sets (6 markers), expression parts (5), cylinder net (4).

## Errors found in existing content
None. No existing question, drill, card or glossary entry was changed.

## Sources
Standard results: long-division remainder argument; the terminating-decimal criterion
(denominator 2ᵃ5ᵇ); repeating-decimal conversion (OpenStax Prealgebra 2e / Elementary Algebra 2e,
decimals and real numbers sections); harmonic mean of two speeds and weighted averages (OpenStax
Introductory Statistics 2e, weighted mean). All numbers recomputed in Python (fractions,
remainder cycles of 1/7 and 3/7, work/average-speed/grade examples, every question key and
distractor).

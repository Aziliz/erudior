# Round 2 notes: a1-m7 (Square roots, exponential functions, and sequences)

`content/math/check-module.sh algebra1 a1-m7`: build and checker report zero problems
(8 lessons, 132 questions, 23 drills, 56 cards).

## Added

**Honors lessons** (all `honors: true`, `module: a1-m7`, 45 min)
- `lessons/32h1-irrational-roots.md` (a1-m7-h-irrational-roots), "Proving irrationality and
  rationalizing denominators", about 1,770 words of prose: if n² is even then n is even
  (contrapositive), proof by contradiction that √2 is irrational (with Mermaid outline), history
  (labeled legend), spiral of Theodorus, Example 1 √3 irrational (remainders mod 3), Example 2
  where the argument breaks for √4, the general rule via unique prime factorization (labeled a
  sketch), rationalizing one-term denominators (why: a hand-computation convention, labeled as a
  convention), conjugates; Examples 3–5.
- `lessons/32h2-rational-exponents.md` (a1-m7-h-rational-exponents), "nth roots and rational
  exponents", about 1,360 words of prose: even/odd nth roots and the index, a^(1/n) defined so the
  power rule survives, a^(m/n), warning about negative bases, exponent rules with fractions,
  solving x^(3/2) = 27, exponential functions at half-steps (plot), yearly to monthly factor,
  half-life and doubling time, Kepler's third law T = a^(3/2). Examples 1–5.
- `lessons/32h3-series.md` (a1-m7-h-series), "Series: adding up a sequence", about 1,650 words of
  prose: partial sums and summation notation, arithmetic series by pairing (Gauss story labeled a
  legend; staircase picture), geometric series by subtracting rS, chessboard legend, a savings plan
  (annuity), infinite geometric series with halves-of-a-square picture and partial-sum plot,
  convergence and divergence, repeating decimal 0.3636… = 4/11, total distance of the Lesson 32
  bouncing ball (labeled a model). Examples 1–6, plus a "which formula" Mermaid chart.

**Core lessons 28–32**: additions only (a sentence or two introducing each figure).
- 28 square roots: labeled parts of 5√12 (SVG), squares of area 36/40/49 (SVG), simplifying
  procedure (Mermaid), ladder triangle for Example 4 (```shape).
- 29 root functions: graphing y = a√(x − h) + k (Mermaid), √x, −√x, √(−x), ∛x on one set of
  axes (SVG) with a short paragraph on the two reflections.
- 30 exponential functions: labeled growth/decay graph with initial value and asymptote (SVG),
  "writing a model from a description" (Mermaid).
- 31 linear vs exponential: classify-a-table decision chart (Mermaid), plot of Example 3's two
  offers.
- 32 sequences: plot of the geometric sequence 3, 6, 12, … on y = 1.5·2^x, bouncing ball (SVG)
  with a note that the drop height is not a term.

**Pictures** (14 original SVGs in `images/`, each under 16 KB, all rendered and looked at):
a1-m7-radical-parts(+blank), a1-m7-square-area, a1-m7-root-graphs(+blank), a1-m7-exp-graph
(+blank), a1-m7-bouncing-ball(+blank), a1-m7-theodorus(+blank), a1-m7-staircase,
a1-m7-halves-square(+blank). Label markers were computed from the drawing coordinates and checked
with `--markers`.

**Diagrams**: 7 Mermaid (4 core, 3 honors), all with accTitle/accDescr, all rendered. Labels
avoid ">" (the renderer drops it), using words instead.

**Questions** (`questions/r2-a1-m7.yaml`, 67 new)
- Core a1-m7-r2-q01…q25 (5 per lesson): label 4 (q01, q06, q11, q21), text 5 (q02, q07, q12,
  q17, q22), order 5 (q03, q10, q15, q19, q25), match 5 (q05, q09, q14, q16, q23), select-all 5
  (q04, q08, q13, q18, q24), MC 1 (q20). Lesson 31 has no label question (no picture worth
  labeling). module_quiz: q01, q04, q06, q09, q11, q14, q16, q21, q23.
- Honors a1-m7-r2-h01…h42 (14 per lesson; 8 MC + 6 other types each):
  h01–h14 (irrationality/rationalizing): order h03, select-all h05, text h06 h13, match h09,
  label h10; h15–h28 (rational exponents): text h17 h24, select-all h18 h26, match h19, order
  h20; h29–h42 (series): text h31 h35, select-all h34, match h36, order h37, label h38.
- Answer positions of the 25 new 4-choice MC questions: 0: 6, 1: 7, 2: 6, 3: 6.

**Drills** (`drills/r2-a1-m7.yaml`, 8): a1-m7-r2-rationalize-mono, -rationalize-conj (h1);
-rational-power, -monthly-rate, -half-life (h2); -arith-series, -geom-series, -infinite-geom (h3).
Each was generated 3,000 times with `generate()` and checked against an independent computation;
the correctly rounded 2-decimal answers are accepted (tolerance 0.0051) and a wrong answer is
rejected every time.

**Glossary** (`glossary-r2-a1-m7.yaml`, 16, checked against every glossary*.yaml in the course,
no duplicate terms or aliases): proof by contradiction, rationalizing the denominator, conjugate,
nth root, index, rational exponent, half-life, doubling time, series, partial sum, summation
notation, arithmetic series, geometric series, infinite geometric series, converge, diverge.
Every bolded term in the three honors lessons has an entry (power rule already existed).

**Cards** (`cards-r2-a1-m7.yaml`, 28): 9 irrationality/rationalizing, 9 rational exponents,
10 series.

## For a reviewer to double-check
- History, all hedged in the text: discovery of incommensurability usually credited to the
  Pythagoreans (5th c. BCE), odd/even argument mentioned by Aristotle (Prior Analytics I.23),
  Hippasus story called a legend; Theodorus and the roots of 3 to 17 per Plato's Theaetetus; the
  Gauss story from a memoir written soon after his death in 1855 (Sartorius von Waltershausen),
  called a legend; Kepler's third law published 1619 (Harmonices Mundi).
- Numbers: Mars 1.524 AU → 1.524^1.5 ≈ 1.881 yr; iodine-131 half-life "about 8 days" (8.02 d);
  chessboard 2^64 − 1 grains, "hundreds of times the world's yearly rice harvest at roughly 25 mg
  per grain" (≈ 4.6 × 10^11 t vs roughly 0.5–0.8 × 10^9 t); annuity 100(1.05^10 − 1)/0.05 ≈
  1257.79; all recomputed in Python/sympy.
- Overlap with other Round 2 writers: "proof by contradiction" is also bolded in 05h1 (alg-m1)
  and 90-algebraic-proof (a1-h1); only my glossary defines it, so it serves all three. 05h1 already
  turns repeating decimals into fractions with an equation and points forward to this module's √2
  proof; my series lesson uses a different decimal (0.3636… = 4/11) and the series method, and
  says the Module 1 honors lesson does it another way. 90-algebraic-proof also proves odd squares
  are odd; my lesson proves it in two lines as a lemma.
- 32h2 is a little shorter (≈1,360 words of prose, ≈1,560 with diagrams and plot) than the other
  two, within the 1,200–2,200 range.
- Bold run-in labels "Even index", "Odd index" and "A warning about negative bases." in 32h2 are
  formatting, not glossary terms.

## Errors found in existing content
- None in a1-m7's lessons, questions or drills. Outside my files (not edited): the outline table
  in PROGRESS.md still numbers this module's lessons 26–29 and omits a1-root-functions; the
  lesson files are 28–32.

## Sources
- Standard algebra (definitions, formulas); Aristotle, Prior Analytics I.23; Plato, Theaetetus
  147d; B. Hayes, "Gauss's Day of Reckoning", American Scientist 94 (2006), on the Gauss story;
  NASA planetary fact sheets (Mars semi-major axis 1.524 AU, period 1.881 yr); NNDC/NIST
  iodine-131 half-life 8.02 d; FAO world rice production (hundreds of millions of tonnes a year).

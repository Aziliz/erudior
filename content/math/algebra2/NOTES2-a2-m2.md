# Round 2 notes: module a2-m2 (Complex numbers, quadratics, and systems)

`content/math/check-module.sh algebra2 a2-m2`: build and checker report zero problems
(8 lessons, 122 questions, 21 drills, 52 cards).

## Added

**Honors lessons** (3; the module has five dense core lessons, and Algebra 2 normally covers
matrix arithmetic, which no lesson taught)
- `lessons/09h1-complex-plane.md` (a2-m2-h-complex-plane, "The geometry of complex numbers",
  45 min, ~2,100 words of prose): modulus and distance, $z\bar z = |z|^2$ and $1/z$, addition as
  the parallelogram rule, triangle inequality, multiplication by $i$ as a quarter turn, proof
  that $|zw| = |z||w|$, Brahmagupta–Fibonacci identity (sums of two squares), square roots of
  complex numbers, a quadratic with a complex coefficient (roots not conjugates), history
  (Cardano's 10 = x + y, xy = 40 problem; Bombelli and $x^3 = 15x + 4$; Descartes, Wessel,
  Argand, Gauss). 5 examples, 1 SVG, 2 plots. The angle half of "multiply = stretch and turn"
  is left to the a2-h1 lesson 92-polar-complex, which already points back to this lesson.
- `lessons/09h2-matrix-algebra.md` (a2-m2-h-matrix-algebra, "Matrix arithmetic and inverses",
  45 min, ~1,650 words of prose plus matrices): addition, scalar multiplication, matrix
  multiplication and the dimension rule, why the rule makes sense (quantities × prices),
  non-commutativity, $(AB)^{-1} = B^{-1}A^{-1}$, inverses by row-reducing $[A \mid I]$, solving
  several systems with one inverse, singular matrices, a simplified Hill-cipher example.
  5 examples, 1 Mermaid diagram.
- `lessons/09h3-determinants-cramer.md` (a2-m2-h-cramer, "Determinants and Cramer's rule",
  45 min, ~1,750 words of prose): deriving $ad - bc$ from elimination, Cramer's rule 2 × 2,
  determinant as parallelogram area (with the box-subtraction argument), minors, cofactors,
  cofactor expansion, rule of Sarrus, Cramer's rule 3 × 3 (lesson 08's system), triangle area
  and collinearity, cost of Cramer vs elimination, history. 4 examples, 1 plot.

**Core lessons 05–09** (additions only; nothing rewritten):
- 05: Mermaid "sorting complex numbers" chart; SVG of the powers-of-$i$ cycle with one
  introducing paragraph.
- 06: plot of the three discriminant cases ($x^2 - 2x + c$); new short section "Choosing a
  method" with a Mermaid decision chart (labeled a rule of thumb).
- 07: SVG of line/circle with 2, 1, 0 intersections; Mermaid "substitution or elimination" chart.
- 08: SVG of the cases for three planes (point, common line, parallel planes, prism); Mermaid
  flowchart of the elimination strategy.
- 09: labeled augmented-matrix SVG; Mermaid "reading the result of row reduction" chart.

**Pictures** (10 SVGs, original, 1.5–4 KB each, all rendered and checked, blank versions checked
with their markers): a2-m2-i-cycle(-blank), a2-m2-line-circle(-blank), a2-m2-planes(-blank),
a2-m2-augmented(-blank), a2-m2-modulus(-blank). Generator script kept out of the repo.

**Diagrams** (6 Mermaid, all with accTitle/accDescr, all rendered): complex-number
classification, quadratic method choice, nonlinear-system method choice, three-variable
elimination, reading row-reduction results, finding $A^{-1}$ by $[A \mid I]$.

**Questions** (65 new, `questions/r2-a2-m2.yaml`)
- Core a2-m2-r2-q01…q25 (5 per lesson): label 4 (q01, q11, q16, q21), text 6 (q02, q06, q10,
  q13, q18, q23), match 5 (q03, q07, q15, q20, q25), order 5 (q05, q09, q12, q17, q22),
  select-all 5 (q04, q08, q14, q19, q24). module_quiz: q01, q03, q07, q09, q11, q14, q16, q19,
  q21, q25 (2 per lesson).
- Honors a2-m2-r2-h01…h14 (complex plane: 10 MC, label, text, select-all, match),
  h15…h27 (matrix algebra: 8 MC, 2 text, order, select-all, match), h28…h40 (Cramer: 8 MC,
  2 text, order, select-all, match). No module_quiz (core-module honors lessons).
- Answer positions of the 26 honors MC questions: 0: 6, 1: 7, 2: 7, 3: 6.

**Drills** (7, `drills/r2-a2-m2.yaml`): a2-m2-r2-modulus, a2-m2-r2-complex-sqrt (complex plane);
a2-m2-r2-matrix-sum, a2-m2-r2-matrix-product (matrix algebra); a2-m2-r2-cramer2,
a2-m2-r2-det3, a2-m2-r2-triangle-area (Cramer). Each generated 400 times with `generate()` and
every answer recomputed independently in Python (exact fractions for Cramer): 2,800 instances,
0 failures, no unfilled placeholders.

**Glossary** (14 terms, `glossary-r2-a2-m2.yaml`, checked against every glossary file in the
course, no duplicate terms or aliases): modulus, triangle inequality, Brahmagupta–Fibonacci
identity, scalar multiplication, zero matrix, matrix multiplication, square matrix, singular
matrix, Cramer's rule, minor, cofactor, cofactor expansion, rule of Sarrus, collinear. Every
bolded term in the honors lessons has an entry.

**Cards** (30, `cards-r2-a2-m2.yaml`): 12 complex plane geometry, 9 matrix operations,
9 determinants and Cramer's rule.

## For a reviewer to double-check
- History: Cardano, *Ars Magna* (1545) and the "10 into two parts with product 40" problem;
  Bombelli (*Algebra*, 1572) and $x^3 = 15x + 4$; Descartes' "imaginary" (1637); Wessel (1799),
  Argand (1806), Gauss (1830s). Cramer (1750); Maclaurin's *Treatise of Algebra* (1748,
  posthumous); Seki (1683); Leibniz (1693); Lester Hill (1929). The Brahmagupta–Fibonacci
  identity is said to "appear in Diophantus".
- Operation counts ("on the order of $n!$" for cofactor expansion, "roughly $\tfrac13 n^3$"
  for elimination) are stated as orders of magnitude.
- The determinant-area argument is given only for the arrangement in the picture (said so).
- The Hill-cipher example is labeled simplified (no mod 26) and not secure.
- The "Choosing a method" chart in lesson 06 is labeled a rule of thumb.
- Label markers: planes-blank marker 4 sits in the open middle of the prism (the panel as a
  whole is what's labeled); line-circle markers sit at circle centers.
- Text answers that are negative list both ASCII `-` and Unicode `−`; q10 lists several
  spellings of $-2 - 5i$.

## Errors found in existing content
None. No existing question, drill, card or glossary entry was changed.

## Sources
The mathematics is standard (OpenStax College Algebra 2e and Precalculus 2e cover the same
results). I did not consult web sources in this session: the history dates and attributions
above come from my own knowledge (they match MacTutor History of Mathematics as I know it, and
Hill, "Cryptography in an Algebraic Alphabet", Amer. Math. Monthly 36, 1929), so a reviewer
should spot-check them. Every number in the lessons, questions and drills was recomputed with
sympy.

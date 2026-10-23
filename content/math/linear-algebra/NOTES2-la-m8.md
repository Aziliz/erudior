# Round 2 notes: module la-m8 (Eigenvalues and eigenvectors)

`content/math/check-module.sh linear-algebra la-m8`: build and checker report zero problems
(9 lessons, 147 questions, 21 drills, 71 cards).

## Added

**Honors lessons** (3; the module has six core lessons and three clear extensions)
- `lessons/32h1-cayley-hamilton.md` (la-m8-h-cayley-hamilton, 45 min, ~2,100 words): The
  Cayley–Hamilton theorem and the minimal polynomial. Matrix polynomials, the theorem with a check for
  2×2, a proof for diagonalizable matrices and an adjugate proof sketch (labeled as a sketch), the
  invalid "det(A − AI)" proof, history (Hamilton 1853, Cayley 1858, Frobenius 1878), inverse and
  powers from the theorem, high powers by remainders, the minimal polynomial and the
  diagonalizability test (one direction proved, the other stated). Mermaid decision chart.
  Examples: verify and use it for A⁻¹ and A³; A^k = αA + βI and A¹⁰; minimal polynomials of two
  matrices with the same characteristic polynomial; 3×3 inverse.
- `lessons/32h2-jordan-form.md` (la-m8-h-jordan-form, 45 min, ~1,950 words): Defective matrices and
  the Jordan form. Generalized eigenvectors, Jordan chains, Jordan blocks, nilpotent part, the
  Jordan form theorem (stated; proof left to a second course), block counts from ranks, powers and
  exponentials of blocks, solutions te^{λt}, fragility (2 ± √ε) and why software avoids it.
  History: Jordan 1870, Weierstrass's elementary divisors 1868, the 1874 Jordan–Kronecker dispute.
  Examples: Jordan form and A^k for a 2×2; possible forms of a 3×3 with one eigenvalue; x′ = Ax
  for a defective matrix. One plot (Av₂ = 2v₂ + v₁).
- `lessons/32h3-population-perron.md` (la-m8-h-perron-frobenius, 45 min, ~1,750 words): Population
  models and the Perron–Frobenius theorem. Leslie matrices (Leslie 1945), stable age distribution,
  primitive matrices, Perron–Frobenius for primitive matrices (Perron 1907, Frobenius 1912; the
  irreducible case is mentioned and labeled as not covered), row/column-sum bounds, Markov chains
  as the case r = 1, a short pointer to the power method, the net reproductive number R₀ and why
  r > 1 ⟺ R₀ > 1 (discrete Euler–Lotka argument). Examples: three-class bird population (r = 1.5,
  distribution 5 : 3 : 1); a non-primitive oscillating population; R₀ and the break-even survival
  rate. One plot (growth factor settling to 1.5).

**Core lessons 27–32** (additions only, each with a sentence introducing the figure):
- 27: Mermaid flowchart "testing a number and finding its eigenspace"; SVG reflection across
  x₂ = x₁ (eigenvectors for 1 and −1, a turned vector) after Example 3.
- 28: plot of the characteristic polynomial of Example 2 (roots −1, 3, 4); Mermaid "which method
  finds the eigenvalues".
- 29: Mermaid change-of-coordinates diagram (x → P⁻¹ → D → P = A); Mermaid diagonalizability
  decision chart.
- 30: SVG eigenvalue a + bi in the complex plane (modulus, angle, real and imaginary parts, conjugate).
- 31: SVG trajectories of an attractor, repeller and saddle; Mermaid transition diagram of the
  rental cars (placed after Example 2's steps, not inside the numbered list).
- 32: Mermaid solution procedure for x′ = Ax; SVG trace–determinant plane, with a sentence noting
  that points on the parabola and on the axis are borderline cases.

**Questions** (`questions/r2-la-m8.yaml`, 71): core la-m8-r2-q01–q29 (4–5 per core lesson, 1–2
`module_quiz` each), honors la-m8-r2-h01–h42 (14 per honors lesson, 5 of them new types each).
By type: 26 multiple choice, 15 text, 9 select-all, 9 match, 8 order, 4 label. Every core lesson
has a text, an order or match, and a select-all question; lessons 27, 30, 31 and 32 have a label
question. MC answer positions after rebalancing: 0/1/2/3 = 6/7/7/6.

**Pictures** (8 SVGs, all original, all under 30 KB, rendered and checked with markers):
la-m8-reflection(+blank), la-m8-complex-plane(+blank), la-m8-portraits(+blank),
la-m8-trace-det(+blank). Blank versions are for the label questions.

**Diagrams**: 8 Mermaid (6 in core lessons, 1 in 32h1; checked by rendering), 3 new plots (lesson
28, 32h2, 32h3).

**Drills** (`drills/r2-la-m8.yaml`, 6): la-m8-r2-ch-cube (A³ = αA + βI), la-m8-r2-ch-inverse
(A⁻¹ = pA + qI, exact fractions), la-m8-r2-jordan-power (J^k entries), la-m8-r2-jordan-ode
(x′ = Jx, expression answers), la-m8-r2-leslie-step (one Leslie step, 3 classes),
la-m8-r2-leslie-growth (r, stable share to 3 decimals with tolerance 0.0006, R₀). Formulas were
checked against sympy for all inputs of the Leslie growth drill (123 valid combinations) and
300 random inputs of the Cayley–Hamilton drills.

**Glossary** (`glossary-r2-la-m8.yaml`, 14 terms): matrix polynomial, Cayley–Hamilton theorem,
annihilating polynomial, minimal polynomial, defective, generalized eigenvector, Jordan chain,
Jordan block, nilpotent, Jordan form, Leslie matrix, stable age distribution, primitive matrix,
net reproductive number.

**Cards** (`cards-r2-la-m8.yaml`, 31): 11 Cayley–Hamilton/minimal polynomial, 11 Jordan form,
9 Leslie/Perron–Frobenius.

## For a reviewer
- "Perron–Frobenius theorem" and "dominant eigenvalue" are bolded and defined by the la-h1 writer
  (lesson 91, PageRank). To avoid duplicate glossary terms, 32h3 italicizes them instead of bolding
  them. If la-h1 drops those terms, bold them in 32h3 and add glossary entries.
- 32h3 states Perron–Frobenius for primitive matrices only; 91 states the positive-matrix case.
  They are consistent.
- The Leslie primitivity condition is given only as a sufficient condition (two neighboring
  fertile classes, last class fertile). The R₀ ⟺ r statement assumes the last class reproduces; it
  was also checked numerically on 20,000 random Leslie matrices.
- Jordan form: the 1s go above the diagonal (the convention used in the course's lesson 32 too).
  Question h20 relies on that convention and says so.

## Errors found in existing content
None. No existing question, drill, card or glossary entry was edited.

## Sources
- Wikipedia, Cayley–Hamilton theorem (history section): Hamilton 1853, Cayley 1858, Frobenius 1878.
- Wikipedia, Perron–Frobenius theorem: Perron 1907, Frobenius 1912; statements for positive,
  primitive and irreducible matrices; row-sum bounds.
- Wikipedia, Leslie matrix: Leslie, Biometrika 1945; dominant eigenvalue and stable age distribution.
- F. Brechenmacher, papers on the 1874 Jordan–Kronecker controversy (arXiv 0704.2929, 0712.2566):
  Jordan's 1870 canonical form and Weierstrass's 1868 elementary divisors.
- All worked examples and question answers were recomputed with sympy/numpy.

# Round 2 notes: module la-m9 (Orthogonality, least squares and symmetric matrices)

`content/math/check-module.sh linear-algebra la-m9`: build and checker report zero problems
(11 lessons, 171 questions, 26 drills, 66 cards).

## Honors lessons (`honors: true`, `module: la-m9`)

- `lessons/40h1-inner-product-spaces.md` (la-m9-h-inner-product-spaces, "Inner product spaces and
  Fourier approximation", 50 min, about 1,950 words). Covers the axioms; weighted, matrix
  ($\mathbf{u}^TA\mathbf{v}$ with $A$ positive definite), evaluation and integral inner products;
  orthogonality depends on the inner product; Cauchy–Schwarz and the triangle inequality, with
  proofs; Legendre polynomials by Gram–Schmidt; best approximation of $|t|$ by a quadratic,
  $(15t^2 + 3)/16$, with error $1/\sqrt{96}$; Fourier coefficients as projection coefficients;
  and the Fourier series of $t$ with its error norms for $n = 1, 3, 10$.
  - Figures: 3 plots (Legendre $P_0$ to $P_3$, $|t|$ with its best quadratic, $t$ with its
    order-1 and order-3 approximations).
- `lessons/40h2-householder-qr.md` (la-m9-h-householder, "Householder reflections and stable QR",
  45 min, about 1,720 words). Covers loss of orthogonality in classical Gram–Schmidt. This is a
  hand-traceable Läuchli example with $\varepsilon = 10^{-8}$: $\mathbf{q}_2\cdot\mathbf{q}_3 = \tfrac12$,
  confirmed in numpy. Also covers modified Gram–Schmidt; Householder matrices and their properties;
  $\mathbf{u} = \mathbf{x} - \alpha\mathbf{e}_1$ with a proof and the sign choice; Householder QR
  step by step, with sign fixing; why the method is stable; operation counts; and Givens
  rotations (mentioned only).
  - Examples: the rounding example; $H$ for $(2, 1, 2)$; full QR of a $3 \times 2$ matrix, which
    agrees with Gram–Schmidt.
  - Figures: 1 plot (the reflection of $(3, 4)$ onto $5\mathbf{e}_1$) and 1 Mermaid diagram
    (the QR loop).
- `lessons/40h3-pseudoinverse-low-rank.md` (la-m9-h-pseudoinverse, "The pseudoinverse and
  low-rank approximation", 50 min, about 1,760 words). Covers the minimum-norm least-squares
  solution (proved); the reduced SVD; $A^+ = V_r\Sigma_r^{-1}U_r^T$, with a proof that $A^+\mathbf{b}$
  is the minimum-norm solution; $AA^+$ and $A^+A$ as projections; special cases (a table); the
  Moore–Penrose history; the Frobenius and spectral norms from singular values; the
  Eckart–Young error formulas (proved), with optimality stated without proof; storage counts;
  and truncation of small singular values.
  - Examples: $A = [1\ 1; 1\ 1; 0\ 0]$; the closest solution of $x_1 + 2x_2 + 2x_3 = 9$; the
    rank-one approximation of $[3\ 0; 4\ 5]$; an illustrative singular-value set
    (10, 6, 3, 1, 0.5).
  - Figures: 1 Mermaid diagram (what $A$ and $A^+$ do to the four subspaces) and 1 bar plot.

## Core lessons 33–40 (additions only, each figure introduced by a sentence or two)

- 33: a plot of orthogonal $\mathbf{u}$, $\mathbf{v}$ and $\mathbf{u} + \mathbf{v}$ (Pythagoras), plus a
  paragraph and the SVG `la-m9-four-subspaces.svg` (four fundamental subspaces with their
  dimensions).
- 34: the SVG `la-m9-proj-plane.svg` (orthogonal decomposition and best approximation for a
  plane in $\mathbb{R}^3$), plus a Mermaid chart of how to compute $\operatorname{proj}_W\mathbf{y}$.
- 35: a plot of the first Gram–Schmidt step in $\mathbb{R}^2$ and a Mermaid loop of the process.
- 36: the SVG `la-m9-regression.svg` (data point, fitted value, residual, intercept, line). It
  uses the data $(0,1), (1,1), (2,4), (3,4)$, whose line $y = 0.7 + 1.2x$ is checked in the text.
  Also a Mermaid "which route" chart (independent columns → normal equations or QR; dependent →
  infinitely many solutions). New bolded term: **fitted value**.
- 37: a Mermaid recipe for orthogonal diagonalization, and a plot of the unit circle mapped to an
  ellipse by $[3\ 1; 1\ 3]$.
- 38: a Mermaid classification chart, and a plot of the level curves $Q = \pm4$ of Example 2's
  indefinite form, with the principal axes.
- 39: a Mermaid "which test when" chart.
- 40: the SVG `la-m9-svd-steps.svg` ($V^T$, $\Sigma$, $U$ acting on the unit circle, using the
  example's directions; labeled as a sketch, not to scale), plus a Mermaid chart of the hand
  computation.

**Pictures:** 4 original SVGs, each with a `-blank` copy for a label question, all under 6 KB.
They were rendered and inspected, with markers. The Example 1 matrix of lesson 40 has $\det V = -1$,
so the picture shows $V^T$ as a reflection ($\mathbf{e}_2$ ends up pointing up). This is
consistent with the lesson's "rotate, possibly with a flip".

**Mermaid diagrams:** 10 in total (8 core, 2 honors), all with `accTitle` and `accDescr`, all
rendered. Diagrams 38 and 39 have 4–5 parallel branches; they are wide but legible.

## Questions (`questions/r2-la-m9.yaml`, 82 new)

- **Core** (la-m9-r2-q01 to q40): 5 per lesson. Every lesson has a text question, an order or
  match question, and a select-all question. Lessons 33, 34, 36 and 40 also have a label question.
  Module quiz: 2 per lesson (q01, q03, q06, q09, q11, q13, q16, q18, q21, q22, q26, q27, q31,
  q33, q36, q37).
- **Honors** (h01–h14 for 40h1, h15–h28 for 40h2, h29–h42 for 40h3): 14 per lesson, no
  module_quiz.
- **By type:** 24 MC, 22 text, 14 select-all, 10 order, 8 match, 4 label.
- **MC answer positions:** 6/6/6/6.
- Every answer was computed with sympy or numpy, and each distractor was checked to be wrong.

## Drills (`drills/r2-la-m9.yaml`, 8)

- **40h1:** la-m9-r2-eval-ip, la-m9-r2-weighted (norm accepted to ±0.01), la-m9-r2-fourier (exact
  fractions, $k = 2$–5).
- **40h2:** la-m9-r2-householder (apply $H$ to a vector, exact fractions), la-m9-r2-house-zero
  ($2 \times 2$ $H$ for a Pythagorean pair).
- **40h3:** la-m9-r2-min-norm, la-m9-r2-pinv-rank1, la-m9-r2-lowrank (Frobenius values ±0.01).
- **Verification:** 300 instances of each were generated with the app's `generate()` and
  compared with an independent Python/numpy calculation: 0 mismatches. The text was scanned
  for "+ -", "1t" and similar artifacts; it is clean after fixing the Fourier drill.

## Glossary and cards

- `glossary-r2-la-m9.yaml`, 16 terms: fitted value, inner product space, Cauchy–Schwarz
  inequality, triangle inequality, Legendre polynomials, trigonometric polynomial, Fourier
  coefficients, Fourier series, modified Gram–Schmidt, Householder reflection, hyperplane,
  minimum-norm least-squares solution, reduced SVD, Frobenius norm, spectral norm, Eckart–Young
  theorem. All glossary files were grepped first; "Moore–Penrose inverse" is already an alias of
  pseudoinverse, so it is used in italics, not bold.
- `cards-r2-la-m9.yaml`: 24 cards (8 per honors lesson).

## For a reviewer

- 40h1 uses definite integrals: the needed values are given, and the lesson says so up front.
  The mean-square convergence of Fourier series is stated without proof.
- 40h2: the operation counts ($2mn^2 - \tfrac23n^3$ against $2mn^2$) are the standard textbook
  figures (Golub–Van Loan), not re-derived. The claims about software (sign choice, not forming
  $H$ explicitly) are worded as "usually".
- 40h3: the optimality part of Eckart–Young is stated without proof; the error formulas are
  proved. The singular values in Example 4 are labeled as made up.
- History, all standard: Cauchy 1821, Bunyakovsky 1859, Schwarz 1888; Legendre in the 1780s;
  Fourier's heat book 1822; Householder 1958; Moore 1920 and Penrose 1955; Schmidt 1907, Eckart
  and Young 1936, Mirsky 1960.
- Possible overlap with la-h1 ("Linear algebra at work"): 40h3 mentions image storage only as a
  count, not as an application lesson.
- No errors were found in the existing la-m9 questions, drills, cards or glossary, and no
  existing entries were edited.

## Sources

- Standard results checked against my own sympy/numpy computations: Lay, *Linear Algebra and Its
  Applications* (inner product spaces, Fourier approximation); Trefethen & Bau, *Numerical
  Linear Algebra* (Gram–Schmidt instability, Householder QR); Golub & Van Loan, *Matrix
  Computations* (flop counts); and Stewart, "On the early history of the singular value
  decomposition" (1993; Schmidt, Eckart–Young, Mirsky).

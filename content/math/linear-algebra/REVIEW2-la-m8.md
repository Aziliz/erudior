# Round 2 review: module la-m8 (Eigenvalues and eigenvectors)

Reviewer for item 69. Scope: honors lessons 32h1, 32h2, 32h3; round 2 additions to core lessons
27–32; `questions/r2-la-m8.yaml` (71 questions), `drills/r2-la-m8.yaml` (6), `glossary-r2-la-m8.yaml`,
`cards-r2-la-m8.yaml`, `images/la-m8-*` (8 SVGs). `content/math/check-module.sh linear-algebra la-m8`
reports zero problems after the fixes (9 lessons, 147 questions, 21 drills, 71 cards, 365 terms).

## Changes

### Answer key / explanations
- **la-m8-r2-h03** (explanation): said the distractor $\begin{bmatrix}2&-1\\-1&1\end{bmatrix}$ is "$A - I$ with
  signs changed off the diagonal". It is $A$ itself with the off-diagonal signs changed (diagonal not
  swapped, a slip in the 2×2 inverse formula); $A - I$ is $\begin{bmatrix}1&1\\1&0\end{bmatrix}$. Rewrote the
  sentence; also noted that $A - 3I$ is the negative of the inverse. Key (index 0) was right.

### Facts / precision
- **32h3, Example 1 step 2**: the general expansion was written as $-\lambda^3 + f_2s_1\lambda + f_3s_1s_2$,
  which omits the $f_1\lambda^2$ term (true only because $f_1 = 0$ here). Now gives the full
  $-\lambda^3 + f_1\lambda^2 + f_2s_1\lambda + f_3s_1s_2$ (checked with sympy), then specializes to $f_1 = 0$
  and multiplies by $-1$ to get $\lambda^3 - 1.8\lambda - 0.675 = 0$.
- **32h3, Perron–Frobenius section, Leslie bullet**: the sufficient condition for primitivity
  (last class fertile, two neighboring fertile classes) also needs every survival rate positive
  (otherwise the matrix is reducible, e.g. $s_1 = 0$). Added "and whose survival rates are all positive".
  Source: Caswell, *Matrix Population Models* (2nd ed., 2001), chapter on age-classified models (irreducible Leslie matrix is primitive
  iff the gcd of the fertile ages is 1).
- **32h2, "A fragile form"**: "the Schur form (an orthogonal change of basis to a triangular matrix)"
  is only true for real matrices with real eigenvalues; in general the Schur change of basis is unitary
  (the real Schur form is only block triangular). Reworded accordingly. Source: Golub & Van Loan,
  *Matrix Computations*, §7.1 (Schur decomposition) and §7.4 (real Schur form).

### Pictures / plots
- **Lesson 28 plot** (characteristic polynomial): the function label sat on the curve at the right
  edge and the root label "3" touched the curve. Moved all text to free `labels` (function label in the
  empty upper middle; "λ = -1" below the axis on the left; "λ = 3", "λ = 4" above the axis).
- **32h2 plot** (Av₂ = 2v₂ + v₁): the segment labels v₂ and 2v₂ sat on the x-axis tick labels, and
  "eigenvector line" sat on the dashed line. Moved those labels and "+ v₁" to free `labels` above the
  axis / beside the line, and widened the x range to [-2.5, 3.8] to make room. Re-rendered: no overlaps.

### Glossary
- The writer flagged that 32h3 italicized "Perron–Frobenius theorem" on the assumption that la-h1
  (lesson 91) defines it. la-h1 no longer does (91 mentions it unbolded and points to 32h3; only
  "dominant eigenvalue" is in `glossary-r2-la-h1.yaml`). Following the writer's instruction, bolded it
  in 32h3 and added a `Perron–Frobenius theorem` entry to `glossary-r2-la-m8.yaml` (no duplicate in any
  course glossary). "Dominant eigenvalue" stays italic (defined by la-h1).

## Checked and found right (things a reader might doubt)
- Every question worked independently before reading the key; all 71 keys correct. Notable checks:
  h02 ($A^2 = 5A + 2I$), h07 ($21A - 20I$; $5A - 4I$ is $A^2$), h09/h11 minimal polynomials, h17 (81, 108),
  h18 (eigenvalue 3 twice, rank 1), h25 ($2 \pm \sqrt\varepsilon$), h26 ($(t-4)^3$), h27 (peak 3.874 at
  k = 9 and 10, equal), h31 (1.2), h36 (1.6), q20 (0.4, 0.6), q22 (powers of the absorbing matrix),
  q27 (eigenvalues 2, −4 and −1 ± 2i).
- Order questions (q02, q09, q12, q21, q26, h12, h24, h39): each has only one valid order.
- Select-all questions: every listed answer right, others clearly wrong.
- Worked examples recomputed in sympy/numpy: 32h1 Ex. 1 ($A^3 = 39A - 70I$), Ex. 2 ($A^{10}$ =
  [[117074, −116050], [58025, −57001]]), Ex. 3 (products), Ex. 4 ($B^{-1}$); 32h2 Ex. 1
  ($A^k = 2^{k-1}[[k+2, k], [−k, 2−k]]$, k = 1..5), Ex. 2 ranks, Ex. 3 solution; 32h3 eigenvalues
  1.5, −1.085, −0.415, eigenvector (5, 3, 1), the 15 growth factors in the plot (all match to 3 dp),
  Example 2 eigenvalues 1.105 / −0.905, Example 3 ($R_0 = 2.475$, $s_1 = 4/11$).
- Adjugate proof sketch of Cayley–Hamilton (coefficient matching then left-multiplying by $A^j$
  telescopes) is correct and labeled a sketch; the diagonalizability-via-minimal-polynomial theorem is
  stated correctly for real diagonalization, with only the easy direction proved and the other labeled.
- Jordan form statements: number of blocks = geometric multiplicity; largest block = exponent in the
  minimal polynomial; rank formula for blocks of size ≥ j; real Jordan form exists when all eigenvalues
  are real; $[[2,1],[\varepsilon,2]]$ has eigenvalues $2 \pm \sqrt\varepsilon$.
- Perron–Frobenius (primitive case) items 1–4, row/column-sum bounds on the spectral radius, "regular
  stochastic = primitive stochastic", discrete Euler–Lotka argument for $r$ vs $R_0$ (needs a
  reproducing last class, as stated).
- History: Hamilton 1853 (quaternion case), Cayley 1858 (stated, checked 2×2, claimed 3×3, no general
  proof), Frobenius 1878 (first general proof) — Wikipedia "Cayley–Hamilton theorem" history section;
  Jordan 1870 *Traité des substitutions*, Weierstrass 1868 elementary divisors, 1874 Jordan–Kronecker
  dispute — Brechenmacher (arXiv 0704.2929); Perron 1907, Frobenius 1912; Leslie, *Biometrika* 33 (1945).
- Drills: formulas verified symbolically ($\alpha = (\operatorname{tr}A)^2 - \det A$, $\beta = -\operatorname{tr}A\det A$;
  $A^{-1} = -\tfrac{1}{\det A}A + \tfrac{\operatorname{tr}A}{\det A}I$; $J^k$ entries; $e^{Jt}$ solution;
  Leslie step; 2-class Leslie roots $r$, $\mu$ with $f_1 = r + \mu$, $f_2 s = -r\mu$, class-1 share
  $r/(r+s)$, $R_0 = f_1 + f_2 s$). The "where" clause keeps $f_2$ exact at 2 dp and $r > |\mu|$;
  tolerance 0.0006 accepts any correct 3-dp share. No unfilled placeholders or "+ -" in the solutions.
- SVGs (reflection, complex plane, portraits, trace–determinant) rendered with and without markers:
  geometry right (w = (3,1) ↦ (1,3), v ↦ −v), every marker on the part its label names, no overlaps.
  32h3 plot and the 7 Mermaid diagrams (27, 28, 29 ×2, 31, 32, 32h1) rendered: correct and readable;
  accTitle/accDescr describe each whole diagram. (The writer's notes say 8 Mermaid diagrams; there are 7.)
- Glossary and cards: definitions correct.

## Overlap
- 32h3's short paragraph on the power method and dominant eigenvalue overlaps la-h1 lesson 91 (PageRank
  and the power method). It is a two-sentence pointer, consistent with 91 (positive-matrix case there,
  primitive case here); left as is.

## Uncertain
- Nothing substantive. The "−1" x-axis tick label in the lesson 28 plot is partly covered by the root's
  dot (renderer places tick labels at integers); the eigenvalue is labeled separately, so it stays readable.

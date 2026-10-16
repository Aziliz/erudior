# Linear Algebra (math-linear-algebra) — progress

Id prefix `la-`. Modules la-m1 … la-m9. Question ids `la-q-LLNN` (LL = lesson number).

## Outline (38 lessons)

### la-m1 Bridge: vectors, systems and matrices (high school)
- [x] 01 la-plane-vectors — Vectors in the plane. Drills: la-vec-comb, la-vec-mag
- [x] 02 la-elimination — Solving 2×2 and 3×3 systems by elimination. Drills: la-sys2, la-sys3
- [x] 03 la-matrix-arith — Matrix arithmetic (Algebra 2/Precalc). Drills: la-mat-lin, la-mat-mult2, la-inv2

### la-m2 Systems of linear equations
- [x] 04 la-systems — Systems, augmented matrices, row operations. Drills: la-row-op, la-back-sub
- [x] 05 la-row-reduction — Echelon/RREF, pivots, the algorithm. Drills: la-rref-2x3, la-sys3
- [x] 06 la-solutions — Existence and uniqueness, free variables, general solution. Drills: la-h-inconsistent, la-free-var
- [x] 07 la-applications-systems — Networks, chemical equations, interpolation. Drills: la-network, la-chem, la-interp

### la-m3 Vector equations and linear independence
- [x] 08 la-lin-comb — Vectors in Rⁿ, linear combinations, span. Drills: la-lincomb, la-span-h
- [x] 09 la-matrix-eq — The matrix equation Ax = b. Drills: la-ax-product, la-ax-solve
- [x] 10 la-solution-sets — Homogeneous systems, parametric vector form. Drills: la-param-form, la-particular
- [x] 11 la-independence — Linear independence. Drills: la-indep-h, la-dep-relation

### la-m4 Linear transformations
- [x] 12 la-transformations — Linear transformations. Drills: la-T-image, la-T-from-basis
- [x] 13 la-std-matrix — Standard matrix, geometric transforms. Drills: la-rotate, la-square-image, la-std-compose
- [x] 14 la-onto-one — One-to-one and onto. Drills: la-param-form, la-indep-h

### la-m5 Matrix algebra
- [x] 15 la-matrix-ops — Products, transpose, powers, composition, graphics. Drills: la-mat-mult23, la-mat-power, la-homog
- [x] 16 la-inverse — Inverses, algorithm. Drills: la-inv2, la-inv3, la-inv-solve
- [x] 17 la-imt — Elementary matrices, invertible matrix theorem. Drills: la-elem, la-singular-h
- [x] 18 la-lu — LU factorization. Drills: la-lu2, la-lu3

### la-m6 Determinants
- [x] 19 la-cofactor — Cofactor expansion. Drills: la-det3, la-cofactor, la-det4
- [x] 20 la-det-props — Properties, row operations. Drills: la-det-props, la-det-rowops
- [x] 21 la-cramer-volume — Cramer's rule, adjugate, area/volume. Drills: la-cramer, la-area, la-area-image

### la-m7 Vector spaces
- [x] 22 la-vector-spaces — Vector spaces and subspaces. Drills: la-lincomb, la-poly-comb
- [x] 23 la-nul-col — Null space, column space, kernel and range. Drills: la-nul-basis, la-col-h
- [x] 24 la-bases — Linearly independent sets, bases. Drills: la-nul-basis, la-rank-echelon
- [x] 25 la-coordinates — Coordinates and change of basis. Drills: la-coord, la-change-basis
- [x] 26 la-dim-rank — Dimension, rank, rank–nullity. Drills: la-rank-nullity, la-rank-echelon

### la-m8 Eigenvalues and eigenvectors
- [x] 27 la-eigen — Eigenvalues and eigenvectors. Drills: la-eig-check, la-eigvec
- [x] 28 la-char-eq — Characteristic equation. Drills: la-char-poly, la-eig2, la-eig-tri
- [x] 29 la-diagonalization — Diagonalization. Drills: la-diag-power, la-eigvec
- [x] 30 la-complex-eig — Complex eigenvalues. Drills: la-complex-eig, la-rot-scale
- [x] 31 la-dynamics — Discrete dynamical systems, Markov chains. Drills: la-markov-step, la-steady, la-dyn-long

### la-m9 Orthogonality, least squares and symmetric matrices
- [x] 32 la-inner-product — Inner product, length, orthogonality. Drills: la-dot-len, la-angle, la-unit
- [x] 33 la-projections — Orthogonal sets, projections. Drills: la-proj-line, la-orth-coords
- [x] 34 la-gram-schmidt — Gram–Schmidt, QR. Drills: la-gs, la-qr
- [x] 35 la-least-squares — Least squares, regression. Drills: la-ls-line, la-normal-eq
- [x] 36 la-symmetric — Symmetric matrices, orthogonal diagonalization. Drills: la-sym-eig, la-sym-unit
- [x] 37 la-quadratic-forms — Quadratic forms. Drills: la-qf-matrix, la-qf-eval
- [x] 38 la-svd — Singular value decomposition. Drills: la-singular, la-ata

## Reference sheets
- la-ref-imt (invertible matrix theorem), la-ref-det (determinant properties), la-ref-factor (factorizations), la-ref-row (row reduction & subspaces)

## Status

**Complete.** `python3 content/math/build.py linear-algebra` and
`npx tsx tests/check-course.mts samples/math/math-linear-algebra.json` both pass with zero problems.

Final counts: 9 modules, 38 lessons, 447 questions (answer positions 0/1/2/3 = 114/111/110/112;
every lesson has 3–4 module-quiz questions and every lesson topic appears in its module quiz),
78 drills, 184 notecards, 210 glossary terms (every bolded lesson term matches a term or alias),
4 reference sheets (la-ref-imt, la-ref-det, la-ref-factor, la-ref-row).

Verification: all worked examples and question answers were computed with sympy while writing.
48 of the 78 drills are cross-checked against sympy by a sampling harness
(scratchpad/linalg-w/verify.py + checks.py); the rest are single-formula arithmetic, previewed by hand.
Drill calc expressions end in `+ 0` on purpose, to avoid "-0" showing up in the text.

For a reviewer:
- Lesson bodies are 900–1,300 words (counted without figure blocks); Module 9 lessons are the shortest.
- Bold is used only for glossary terms; theorem labels and emphasis are in italics.
- The answer-position rebalance swapped choice order only in questions whose explanations don't refer
  to choices by position ("the first choice …").
- Module 9 combines orthogonality, least squares, symmetric matrices, quadratic forms and SVD
  (7 lessons) to stay within 9 modules.

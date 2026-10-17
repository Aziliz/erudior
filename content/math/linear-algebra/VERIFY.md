# Linear Algebra: verification against .edu / open-textbook sources (2026-10-17)

Fixes: 8 (6 facts, 2 coverage). 71 questions and 15 drills spot-checked (3 drills against numpy on 1,023 instances). No key errors.

## Sources
Interactive Linear Algebra (Margalit & Rabinoff, Georgia Tech): contents, diagonalization, complex eigenvalues, characteristic polynomial, stochastic matrices; MIT OCW 18.06 syllabus and readings; MIT 18.06SC eigenvalues summary; Georgia Tech Math 1554 schedule and syllabus; Northeastern MATH 4571 quadratic forms notes.

## Fixes
1–2. Lesson 29: diagonalizable over the reals needs all eigenvalues real plus matching multiplicities; "n distinct real eigenvalues"; 3×3 example with eigenvalues 1, ±i.
3. Lesson 28: trace/determinant rule includes complex eigenvalues.
4. Same fixes carried into glossary, cards and reference sheets.
5. Lesson 37: negative semidefinite row; complete 2×2 determinant test.
6. Lesson 38: SVD orthogonal factors may include a reflection.
7. Lesson 15: partitioned (block) matrices.
8. Lesson 29: diagonalization as a change of coordinates (matrix of a map in a basis).

## Conventions kept
Column-stochastic matrices; C = [[a, −b], [b, a]] for complex eigenvalues; det(A − λI); dilation for any uniform scaling; Nul/Col/Row notation (Lay).

## Coverage gaps
- Common: x′ = Ax and the matrix exponential (needs a lesson); positive-definite tests by pivots/minors, Cholesky (thin).
- Optional: general inner product spaces / Fourier approximation; determinant big formula; permutation matrices and LDU; graphs and incidence matrices; power method / PageRank; linear programming, FFT, numerical linear algebra.

## Couldn't verify
Lamar notes didn't load; operation-count figures are standard but not confirmed from a fetched source.

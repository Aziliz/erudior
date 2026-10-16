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


## Review (2026-10-16)

Independent review in three parts: every question solved before checking its key, every lesson computation checked with sympy, every drill generated hundreds of times against an independent solver. All answer keys were correct.

# Linear Algebra review: modules la-m1 to la-m4 (lessons 01-14, questions/drills m1-m4, cards.yaml)

All 141 question keys were solved independently first: every key is correct and exactly one choice is right in each.
All lesson worked examples were re-checked with sympy and are correct.
All 28 drills were checked with 400 generated instances each (11,200 total), comparing every answer against an independent calculation from the prompt as shown: no wrong keys, and every shown answer is accepted when typed.

## Questions (plain-text rendering, positional references)
- Removed Markdown bold or italics from these:
  - stems: 0106, 0309, 0501, 1311 (reworded to "clockwise (not counterclockwise)")
  - explanations: 0903, 1011, 1112
- Replaced references to choices by position ("the first choice", "the second matrix", ...) with the choice's content in these 18 explanations: 0106, 0306, 0401, 0501, 0502, 0507, 0510, 0512, 0810, 1004, 1005, 1204, 1301, 1302, 1304, 1306, 1312, 1409.
- 0510: the explanation said the $-25/-14$ distractor came from "subtracting $4R_2$ before scaling". It doesn't: that operation would not clear the 4 in column 2. Reworded.
- 0406: the explanation said $(3, 1, 2)$ "reads the right-hand column", but that column is $(3, 1, 6)$. Clarified.

## Lessons
- 04: the list of how three planes can meet left out the case where all three equations are the same plane (a whole plane of solutions). Added it.
- 07: in the network figure, the "300" and "200" labels at node B overlapped. Moved the incoming arrow.
- Every other worked example, theorem and figure checked out. Figures were rendered and screenshotted.

## Drills
- la-indep-h: the solution relied on "the determinant", which isn't taught until Module 6. Rewrote it as an explicit row reduction using this problem's numbers (new calcs `r23`, `r32`, `k33`, `mult`).
- la-dep-relation: the answer line could show "+ -\frac..". It now lists $c_1$ and $c_2$ separately.
- la-sys3: added `where` conditions `b23`, `b32`, `b33` $\ne 0$, so the reduced 2×2 system can't show "0y" or "+ 0z".
- Cleaned up "1x", "-1v" and "1e₁" style output in la-vec-comb, la-sys2, la-back-sub, la-rref-2x3, la-T-image, la-T-from-basis and la-param-form.

## Cards
- One card asked whether the solution set of $A\mathbf{x} = \mathbf{b}$ is a "subspace", a term from Module 7. Changed it to "span", matching lesson 10. All other cards checked correct.

## Not changed (notes)
- la-chem: the solution gives the method in general terms only, not this problem's numbers. All 8 reactions were verified balanced.
- Lesson 14 links la-param-form and la-indep-h, which belong to Module 3 lessons; it has no drills of its own.
- Outside my scope: nothing seen needing a fix.

# Linear Algebra review: modules la-m5 to la-m7 (lessons 15-26)

Method: solved every question in questions/m5-m7.yaml independently, checking the matrix work in sympy; checked every worked example in lessons 15-26 in sympy; rendered the lesson and drill figures with renderFigure and the app CSS, then screenshotted them in Playwright; generated 400 instances of each of the 24 drills in scope (plus la-inv2 and la-lincomb, which are linked from lessons in scope) and checked each answer against my own sympy calculation from the prompt text. All answer keys and computed drill answers were correct.

## Questions: Markdown that renders as raw text (fixed)
- la-q-1506 stem: **fail** -> plain text
- la-q-1709 explanation: *columns*
- la-q-2003 explanation: *every*
- la-q-2202 stem: **not**
- la-q-2208 stem: **exactly**; explanation: *at most*
- la-q-2305 explanation: *null*
- la-q-2402 explanation: *which*

## Questions: explanations referring to choices by position (fixed; positions are shuffled)
- la-q-1508 ("the second choice is a scaling")
- la-q-1605 ("The first matrix")
- la-q-1701 ("The first choice")
- la-q-2009 ("The second and third choices")
- la-q-2304 ("The last choice")
- la-q-2403 ("the last choice")
- la-q-2410 ("The first choice ... the last")

## Questions: material from later lessons (fixed)
- la-q-2409 (lesson 24): distractor used "dimension", which lesson 26 introduces. Replaced it with "Any set of vectors in H that contains 0".
- la-q-2510 (lesson 25): stem said "n-dimensional space" before dimension is defined. Changed to "a basis of n vectors".

## Lessons
- 25-coordinates-change-of-basis: "any n-dimensional space" came before lesson 26 defines dimension. Reworded to "any vector space with an n-vector basis".
- 26-dimension-rank: "the bases found in the last two lessons" was wrong (the previous lesson is coordinates). Changed to "in the bases lesson".
- 24-bases front matter: the linked drill la-rank-echelon asks for rank and nullity (lesson 26). Replaced it with la-col-h; la-rank-echelon is still linked from lesson 26.
- All worked examples, theorem statements, IMT lists and figures checked out correct.

## Drills
- la-singular-h (lesson 17, module 5): the solution relied on determinants ("Module 6"), which come later. Rewrote it as a row reduction with h kept symbolic, using the 2x2 ad - bc test from earlier lessons. Added calcs mp22, q23 and q32. Tightened `where` to a12*a21*a31 != 0 so the solution never shows "h + 0" or "- (0)R_1". The solution also printed "1h" / "-1h"; that text is gone.
- la-poly-comb: the prompt printed "+ 0t" terms, with an apologetic note. Added `where` clauses so all coefficients are nonzero, and removed the note. The answer line used [q]_B notation from a later lesson; it now lists c1, c2, c3.
- la-nul-basis: the solution printed "0x_2" or "1x_2". It now shows x1 = -(p)x2 - (q)x4.
- la-col-h: the solution said "plus -2 times" and "0 times". It now writes (s)(column 1) + (t)(column 2).
- la-rank-echelon: the solution showed no work. It now shows the two rows left after clearing column 1 (new calcs e23, e24, e33, e34).
- la-lu2 / la-lu3: divisions like "6/-2" now read "6/(-2)".
- la-det3: "2\cdot-3" now reads (2)(-3).
- Every computed answer matched my independent calculation (24 drills x 400 instances), and the answer the app shows is accepted when typed.

## Outside my scope (not edited)
- None found.

Build: `python3 content/math/build.py linear-algebra` and `npx tsx tests/check-course.mts samples/math-drafts/math-linear-algebra.json` report OK (zero problems).

# Review: Linear Algebra, la-m8 and la-m9 (lessons 27–38, questions m8/m9, drills m8/m9, glossary, references)

## What I checked
- I solved all 47 m8 questions and 65 m9 questions on my own before reading the answer keys. All keys were correct, and each question has exactly one correct choice.
- I checked every worked example in lessons 27–38 with sympy: A^k formulas, P/D/C factorizations, Gram–Schmidt, QR, least-squares fits, spectral decomposition and the SVD. I also checked the figure coordinates numerically and rendered all the figures.
- For the drills, I generated 400 instances of each of the 26 drills (10,400 in total). For every one, I recomputed the answer from the prompt text with sympy/numpy (verify.py): 0 mismatches. The shown answer was accepted when typed in every instance. I also scanned the output for ugly formatting and for placeholder collisions.
- I read the glossary and all 4 reference sheets.

## Fixes
### Questions
- m8 2907: the explanation said "(the second choice)". It now names the concept instead.
- m8 3101: the explanation pointed at choices by position ("the first", "the last") and never explained the third distractor. It now names each matrix and explains why each is wrong (the third has columns summing to 0.9).
- m9 3601: the explanation said "the last matrix". It now names the matrix and explains why the other distractor fails.
- m9 3604: the explanation said "the first/third choice". It now names the matrices and also covers the 1/2-scaled distractor.
- m9 3605: the explanation claimed that symmetry is why A^TA has nonnegative eigenvalues. That is wrong (nonnegativity comes from positive semidefiniteness), and it also pointed to the SVD, which comes later in the course. Rewritten.
- m8 2703 and 3001, m9 3308 and 3609: removed Markdown italics.

### Lessons
- Lesson 28: it said (λ−2)²(λ−5) "is" the characteristic polynomial of the 3×3 matrix B. In fact det(B−λI) = −(λ−2)²(λ−5). Added "up to an overall sign" with the reason.

### Drills
- la-sym-eig: a placeholder collision. The variable `tr` filled `\operatorname{tr}`, so the solution rendered "\operatorname3 A". Renamed it to `trv`.
- la-markov-step and la-sym-unit: the prompt asks for 3 decimals, but the shown answer had 2. Added `format: dp3`.
- la-dyn-long: the solution showed "1v₁ + (1)v₂" and rounded 0.0625 to "0.06". It now uses coef/signedcoef and gives the exact bolded answer (num4).
- la-diag-power: P⁻¹ was shown as "-(1)", "-(-1)". It now shows the computed entries.
- la-eig2: the solution showed "(λ − (3))" and could show "+ 0". Rephrased using the trace and determinant.
- la-singular: the solution could show "+ 0". It now uses the quadratic formula.
- la-complex-eig: √(negative) replaced with i√(…).
- la-rot-scale: "1i" replaced with "i".
- la-qf-matrix: "0x₂²" terms are now excluded (diagonal coefficients are nonzero), and the workaround note was removed.

### References
- det.md: "det A = (−1)^r × product of pivots" holds only if no row scaling is used. Added that condition.

## Unresolved / notes
- None in scope. Glossary: no errors found.
- Remaining cosmetic issues, left as they are: la-eig-tri can show "(0 − λ)"; the angle drill's solution shows "132°" for 131.96 (num1 drops the trailing .0).
- Build and check-course both report OK.

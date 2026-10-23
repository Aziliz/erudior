# Round 2 notes: la-m6 (Determinants)

`content/math/check-module.sh linear-algebra la-m6`: build and checker report zero problems
(5 lessons, 81 questions, 13 drills, 42 cards).

## Honors lessons (2)

- `lessons/21h1-permutation-formula.md`, **la-m6-h-permutation-formula**, "The permutation formula and
  what makes a determinant" (45 min, about 2,180 words). Permutations, inversions, sign, even/odd,
  transpositions (any swap flips the sign); the permutation (Leibniz) formula; why it matches the
  row-1 cofactor expansion (the $(-1)^{1+j}$ sign is $j - 1$ inversions); Sarrus as the $n = 3$ case;
  permutation matrices; the three defining properties (multilinear, alternating, $\det I = 1$) and a
  uniqueness proof sketch; proofs of $\det(AB) = \det A\det B$, $\det A^T = \det A$ and expansion along
  any row or column (the facts lesson 19/20 took on trust); Vandermonde determinant; short history.
  Examples: sign of $(3, 1, 4, 2)$; a sparse $4 \times 4$ with 2 surviving terms ($\det = -30$);
  $3 \times 3$ Vandermonde by row operations.
- `lessons/21h2-determinant-geometry.md`, **la-m6-h-determinant-geometry**, "Determinants in
  geometry: cross products, orientation and polygon areas" (45 min, about 1,640 words). Cross product
  as a formal determinant; scalar triple product $= \det[\mathbf{u}\;\mathbf{v}\;\mathbf{w}]$, and from it
  perpendicularity, anticommutativity, length = area, right-hand rule; tetrahedron volume
  $\tfrac16|\det|$; orientation test and collinearity; line through two points as a $3 \times 3$
  determinant; shoelace formula with the signed-fan explanation; a labeled "looking ahead" paragraph on
  the Jacobian (polar $r$). Examples: $(1,2,3) \times (4,0,-1)$; tetrahedron volume 3; pentagon area 20.

## Core lessons (additions only)

- 19: minor-formation picture (`la-m6-minor.svg`) with an introducing sentence; "which method" Mermaid
  decision chart.
- 20: row-reduction determinant procedure (Mermaid flowchart); three-panel column-operation picture
  (`la-m6-colops.svg`: shear keeps area, scaling doubles it, swap flips orientation) with a short
  introducing paragraph after the transpose rule.
- 21: shear ```plot (column replacement keeps base and height); parallelepiped picture
  (`la-m6-parallelepiped.svg`) with two sentences extending the shear argument to volume.

## Pictures (9 SVGs, original, 1–10 KB each, all rendered and inspected)
la-m6-minor, la-m6-minor-blank, la-m6-colops, la-m6-parallelepiped, la-m6-parallelepiped-blank,
la-m6-h-perm3 (six permutation patterns of a 3×3), la-m6-h-pattern (a 4×4 pattern for a question),
la-m6-h-cross, la-m6-h-cross-blank. Blank versions are for label questions; markers were checked with
`--markers`. Generator: /tmp/r2-la-m6/svgs.py (scratch, not shipped).

## Diagrams (3 Mermaid, all with accTitle/accDescr, rendered)
Choosing a determinant method (lesson 19), row-reduction procedure (lesson 20), defining properties
→ uniqueness → product and transpose rules (21h1). Plus 2 new ```plot figures (shear in 21, shoelace
fan in 21h2).

## Questions (45, `questions/r2-la-m6.yaml`)
- Core, la-m6-r2-q01…q16 (6 / 5 / 5 per lesson): text 6 (q01, q06, q07, q11, q13, q16), match 3
  (q04, q08, q14), order 2 (q03, q10), select-all 3 (q05, q09, q15), label 2 (q02, q12).
  module_quiz: q01, q05 (19); q09, q10 (20); q13, q15 (21).
- Honors 21h1, h01…h15: MC 10 (h04 shows an image), text 2 (h02, h11), match 1 (h05), order 1 (h10),
  select-all 1 (h06).
- Honors 21h2, h16…h29: MC 8, text 2 (h16 with three blanks, h25), label 1 (h17), order 1 (h26),
  match 1 (h27), select-all 1 (h23). No module_quiz on honors (core-module honors lessons).
- Answer positions of the 18 single-answer MC: 0: 5, 1: 4, 2: 5, 3: 4.

## Drills (5, `drills/r2-la-m6.yaml`)
la-m6-r2-perm-sign (inversions and sign of a permutation of 5), la-m6-r2-perm-det (4×4 with one
nonzero entry per row and column), la-m6-r2-cross, la-m6-r2-tetra (exact fraction), la-m6-r2-shoelace
(quadrilateral with one corner per quadrant, so it is always simple and counterclockwise).
Verification: 400 instances each (2,000) generated with the app's `generate()`; every answer was
recomputed in sympy from the prompt text alone (0 mismatches); the shown answer typed back is accepted
and answer + 1 is rejected in every instance.

## Glossary (16, `glossary-r2-la-m6.yaml`) and cards (25, `cards-r2-la-m6.yaml`)
Terms: permutation, inversion, sign of a permutation, even permutation, odd permutation,
transposition, permutation formula (alias Leibniz formula), multilinear, alternating, Vandermonde
determinant, cross product, scalar triple product, right-hand rule, orientation, shoelace formula,
signed area. Checked against every glossary*.yaml in the course (including other writers' r2 files):
no duplicate terms or aliases. Cards: 13 for 21h1, 12 for 21h2.

## For a reviewer
- "permutation matrix" is used (not bolded) in 21h1, because the la-m5 honors lesson 18h1 bolds it and
  should own its glossary entry. "collinear" is likewise left unbolded (la-m1's 03h1 bolds it).
- 21h2 previews the dot product (Module 9) in two sentences; it is needed for the cross product.
- 21h1's uniqueness theorem is a proof sketch (it relies on the row-reduction argument); the general
  Vandermonde product $\prod_{i<j}(x_j - x_i)$ and the simplex volume $1/n!$ are stated, not proved.
- History (21h1): dates from MacTutor (Seki 1683, Leibniz 1693 letter, Cramer 1750, Vandermonde 1771,
  Laplace 1772, Gauss 1801 word for quadratic forms, Cauchy 1812 modern sense and product theorem,
  Binet at the same meeting).
- Lesson 20 now says "the next lesson proves" the area fact, pointing to lesson 21.

## Errors found in existing content
None. No existing question, drill, card or glossary entry was edited.

## Sources
- MacTutor, "Matrices and determinants": https://mathshistory.st-andrews.ac.uk/HistTopics/Matrices_and_determinants/
- Standard results (permutation formula, uniqueness of the determinant, cross product, shoelace
  formula); all examples and question answers computed with sympy.

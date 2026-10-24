# Round 2 review: la-m6 (Determinants)

Reviewer for item 67. Scope: honors lessons 21h1 and 21h2, the round 2 additions to lessons 19, 20
and 21, `questions/r2-la-m6.yaml` (45 questions), `drills/r2-la-m6.yaml` (5 drills),
`glossary-r2-la-m6.yaml` (16 terms), `cards-r2-la-m6.yaml` (24 cards), `images/la-m6-*` (9 SVGs).
`content/math/check-module.sh linear-algebra la-m6` reports zero problems after the fixes.

## Changes

| Where | What was wrong | Change |
|---|---|---|
| la-m6-r2-q03 (order) | "Compute the determinant of each smaller matrix" and "Attach the checkerboard sign" could be done in either order (the lesson itself writes the signs $+,-,+$ before evaluating the minors), so the order question had two correct orders. | Merged them into one step ("Compute each minor … and attach the checkerboard sign … to get its cofactor"); 4 items now. Explanation says why. |
| la-m6-r2-q04 (match) | Explanation said distractor 4 comes from "adding $bc$ instead of subtracting it in the first or last matrix"; that gives 6 and $-2$, not 4. | Now: 4 comes from subtracting the wrong way round, $bc - ad = 1 - (-3)$, in the last matrix. |
| la-m6-r2-q12 (label) | Marker 1 ("Base parallelogram") sat on the vertical edge from the tip of u up to the top face (about 4 px away), so it read as marking that edge. | Moved to (51.8, 63.8), inside the shaded base clear of all edges and arrows; re-rendered with markers. |
| Lesson 21, shear ```plot | The segment label "u" was drawn below the x-axis between the tick labels 1 and 2 ("1 u 2"), and the dashed original parallelogram had no "v" though the caption refers to (u, v). | Dropped the segment label; added free labels "u" at (1.5, 0.2) above the arrow and "v" at (0.25, 1.2) beside the dashed side. Re-rendered: nothing overlaps. |
| Lesson 21h2, pentagon ```plot | Point labels "(−1, 2)" ran over the y-axis tick label 2 and the edge, "(0, 0)" sat on the dashed fan lines and the axis, "(4, 0)" touched the edge to (5, 3). | Widened x range to [−3, 6]; placed those three labels with `labels` at (−1.8, 2.2), (−0.95, 0.3), (3.3, 0.3). Re-rendered: all clear. |
| Lesson 21h2, "Why it works" (shoelace) | "pieces that lie outside the polygon are covered once positively and once negatively" is only true for simple configurations (for a non-convex polygon a piece can be covered several times). | Now: every piece outside is covered as often by positive triangles as by negative ones and cancels; every piece inside is counted exactly once. |

## Checked and right (a reader might doubt)

- Every question worked independently before reading the key (all 45; numeric ones in sympy). Correct
  answers and accept lists are right; select-alls q05, q09, q15, h06, h23 have exactly the listed
  answers; orders q10, h10, h26 have one order (q10 values −2, 1/2, 2, 4, 16).
- h04: the image shows σ = (4, 1, 3, 2), 4 inversions; its inverse (2, 4, 3, 1) also has 4.
- h15: of the 4 wrapped diagonals of a 4×4, (2,3,4,1) and (4,1,2,3) are odd, so "some diagonal
  products also get the wrong sign" is right.
- h17 / la-m6-h-cross: u right, v back (away from viewer), u × v up is right-handed; caption's
  "counterclockwise seen from its tip" correct.
- Lesson 21h1: inversion parity of a swap, 2(j − i) − 1 neighbor swaps; j − 1 inversions at position 1
  giving the cofactor sign; Example 2 det = −30 (sympy); uniqueness proof sketch (labeled as a sketch);
  product-rule proof; transpose rule via σ⁻¹; row-i expansion by i − 1 neighbor swaps; Vandermonde
  (b − a)(c − a)(c − b), direct value 6 for 1, 2, 4. The "Module 2 applications lesson" claim it
  proves is real (lesson 07, la-m2).
- History against MacTutor, "Matrices and determinants"
  (https://mathshistory.st-andrews.ac.uk/HistTopics/Matrices_and_determinants/): Seki 1683; Leibniz
  1693 letter (to de l'Hôpital); Cramer 1750; Vandermonde 1771; Laplace 1772 expansion; Gauss 1801 term
  for quadratic forms; Cauchy 1812 modern sense and product theorem, Binet at the same Institut meeting;
  Sylvester "matrix" 1850 and Cayley 1858, so "decades later" holds.
- Lesson 21h2: Example 1 (−2, 13, −8), √237 ≈ 15.39; Example 2 det 18, volume 3; collinear example;
  line-through-two-points determinant (the reduction to D has the right sign); 5x − 2y = 1; pentagon and
  h25 quadrilateral convex and counterclockwise, areas 20 and 14; fan triangles 6, 9.5, 4.5; Jacobian
  r for polar coordinates.
- Drills: 500 instances each (2,500) generated with the app's `generate()`; answers recomputed in
  Python from the prompt text only: 0 mismatches. Shown answer accepted and answer + 1 rejected in all;
  tetra fraction answer accepted in lowest terms and an unreduced form rejected (lowestTerms, as the
  prompt's "exact fraction" implies). Shoelace quadrilateral (one corner per quadrant) is always simple
  and counterclockwise.
- Pictures: all 9 SVGs rendered and read; the minor, colops, perm3 (all six patterns and signs),
  pattern, parallelepiped and cross pictures are correct; q02 and h17 markers sit on their parts.
- Mermaid (3): rendered; content and accTitle/accDescr right. The "row reduce" chart's
  "no nonzero entry on or below the diagonal → det 0" is correct.
- Glossary/cards: definitions correct; no term or alias duplicates any glossary*.yaml in the course.

## Overlap

None of substance. 18h1 (la-m5) owns "permutation matrix" and 21h1 only uses it unbolded; 26h3 uses
the Vandermonde matrix for interpolation without its determinant.

## Left as is / uncertain

- 21h1's opening says the properties lesson asked learners to accept det(AB) = det A det B; lesson 20
  does name the elementary-matrix proof idea in one sentence, but doesn't carry it out, so the wording
  is fair.
- The 21h1 Mermaid arrow "Uniqueness → permutation formula is det" is one valid route (the lesson also
  shows it by induction against the cofactor expansion); not changed.

Counts: answer-key errors 1 (q03), factual fixes 1 (shoelace cancellation), picture fixes 3 (q12
marker, two plots), other fixes 1 (q04 explanation).

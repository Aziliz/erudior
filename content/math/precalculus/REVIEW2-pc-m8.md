# Review of round 2, module pc-m8 (Vectors)

Reviewer for item 111. Scope: honors lessons 35h1-cross-product and 35h2-lines-planes, round 2 additions to 34-vectors-2d and 35-dot-product-3d, `questions/r2-pc-m8.yaml` (40), `drills/r2-pc-m8.yaml` (6), `glossary-r2-pc-m8.yaml` (11), `cards-r2-pc-m8.yaml` (18), `images/pc-m8-*` (9 SVGs).

`content/math/check-module.sh precalculus pc-m8` after fixes: OK, zero problems.

## Changes

| Where | Problem | Fix |
|---|---|---|
| `images/pc-m8-plane-normal.svg` | The label "P(x, y, z)" ran across the plane's right edge. | Moved it above the point, right-aligned at (400, 266), clear of the edge, the arrow and the other labels. Re-rendered. The blank copy and the h28 markers are unchanged and still on their parts. |
| 35h2, after the parallel/intersecting/skew chart | The chart only covers "solve two equations, then check the third". It leaves out two cases: the first two equations can already contradict each other (then the lines are skew), and the chosen pair may not determine t and s. A student following the chart alone could get stuck. | Added one sentence covering both cases. The chart is unchanged. |
| 35h2, "angle between two planes" | Said the angle between planes is the angle between their normals. Either normal can be reversed, so the standard convention takes the acute angle (OpenStax *Calculus Vol. 3*, sec. 2.5, uses cos θ = \|n₁·n₂\|/(‖n₁‖‖n₂‖)). | Added "(taken as the acute one, 0° to 90°, since either normal can be reversed)". |
| `cards-r2-pc-m8.yaml`, card "Angle between two planes" | Same point as above. | "The angle" → "The acute angle". |

Counts: answer-key errors 0, factual fixes 1 (plane angle, in the lesson and on the card), picture fixes 1, other fixes 1 (the skew-lines caveat).

## Checked and right (things a reader might doubt)

- **All 40 questions.** I worked each one before reading its key, and checked the vector arithmetic in numpy. Results: cross products h01 ⟨−3, 6, −3⟩ and h03 ⟨0, −8, 6⟩ → 10; triple products h05 = 5 and h06 = 3 − k; normal ⟨6, 3, 2⟩ for h19; distances h22 = 5/3 and h23 = 3; h24 gives t = 3 at (5, −5, 9). Every distractor is wrong for the reason its explanation gives. Each select-all set is exact. Each order question has only one valid order. Match answers are unambiguous.
- **Label questions.** All four blanks were rendered with their markers. Every marker sits on the part it names; in the 3D-axes picture I also checked them against the SVG coordinates: x unit (−27, 20), y unit 45, z unit 45, so (2, 3, 0) → (331, 320) and (2, 3, 4) → (331, 140).
- **Worked examples in 35h1 and 35h2.** All recomputed: ⟨−10, 7, 9⟩; Lagrange's identity check 230 = 294 − 64; ⟨4, −3, 5⟩ and area 5√2/2; the 2D triangle area 9.5; volume 13; torque 8.66 N·m and ⟨0, 3, 6⟩; the crossing point (13/4, −1/2, 0); skew-line distance 1/√3; plane 4x − 3y + 5z = 14; intersection point (5/2, −1/2, 1/2); point-to-plane distance 7√2/5 ≈ 1.98.
- **Core plots.** Both new plots were rendered with the app's code. In the work plot, the force arrow (2.72, 1.27) is at 25.03° with length 3.0, as its caption says. The scalar-multiple plot is correct. No labels collide.
- **Mermaid.** All 4 diagrams were previewed. They are readable, and accTitle/accDescr describe the whole diagram.
- **Drills.** Generated 1,500 instances of each drill with the app's own `generate`. I recomputed every answer in Python from the prompt text alone. For triangle-area and plane-distance, the 2-decimal rounded answer is always accepted, the exact forms `sqrt(nn)/2` and `num/sqrt(nn)` are accepted, and an answer off by 0.05 is rejected. The integer drills also reject an answer off by 0.05. No "+ -", "- -", "1x" or leftover placeholders appear in any prompt or solution.
- **Writer's reviewer list.**
  - The plane-equation drill's "exactly as computed" wording is explicit enough, so its single answer is fair.
  - The hedge that the cross product, as defined in the lesson, exists only in 3D is right (a 7-dimensional cross product exists).
  - Hamilton's quaternions date to 1843. Gibbs and Heaviside developed vector analysis independently in the 1880s (Crowe, *A History of Vector Analysis*). The product of two pure quaternions is −(p·q) + p×q, as stated.
  - The q11 and h14 stems resolve the orientation ambiguity.
- **Torque direction for a right-hand thread** (counterclockwise seen from the head → torque toward the viewer → the bolt backs out): correct.
- **Picture conventions.** In the parallelogram and parallelepiped pictures the normal arrow is drawn screen-vertical. These are textbook-style schematics, not exact projections, and nothing in them teaches a wrong fact.
- **Glossary.** None of the 11 terms or their aliases appear in any other glossary file in the course.

## Overlap

- 35h1's 2D shortcut, area = |ad − bc|, is also in pc-m6's honors lesson 27h1-matrix-transformations (|det A| as an area scale factor, with a dissection proof). Lesson 25 has the triangle-area determinant with a column of 1s. The approaches differ (cross product vs. linear map) and the results agree, so the overlap is complementary. Nothing to change.
- No other round 2 lesson in the course covers the cross product, lines and planes in space, or torque.

## Uncertain

Nothing.

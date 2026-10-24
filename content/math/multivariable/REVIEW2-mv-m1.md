# Round 2 review: module mv-m1 (Vectors and the geometry of space)

Reviewer, independent of the writer. `content/math/check-module.sh multivariable mv-m1` after
fixes: build and checker OK, zero problems.

## Changes

| Where | What was wrong | Change |
|---|---|---|
| `questions/r2-mv-m1.yaml`, mv-m1-r2-h19 (explanation) | The explanation said 30° comes from "using tan 2θ in place of cot 2θ and dropping the sign". Wrong: tan 2θ = 1/√3 gives 2θ = 30°, so θ = 15°. The 30° comes from dropping the minus sign only (cot 2θ = 1/√3, 2θ = 60°). The 15° distractor had no explanation. | Rewrote the distractor line: 30° = dropped sign, 15° = also tan in place of cot, 120° = 2θ. The key (60°) is correct: B′ = 2√3 cos 120° + 2 sin 120° = 0, and 30° and 15° give B′ ≠ 0 (checked in Python). |
| `lessons/06h2-quadratic-forms.md`, Example 3 trace check | Said the trace of x′² − y′² + z² = 1 in the plane x = y, written 2x² + z² = 1, is "an ellipse around the axis". Within that tilted plane the horizontal length coordinate is x′ = √2·x, so the trace is x′² + z² = 1, a circle of radius 1 (the waist). It only looks like an ellipse in x, z coordinates. | Explained the √2 factor and called it a circle of radius 1, the narrowest trace. |
| 06h2, "The link to the second-derivative test" | Said the proof that the quadratic part controls the shape "needs more analysis than this course covers". The course's own honors lesson 20h1 ("Why the second-derivative test works") gives that argument. Also "mixed signs a saddle" left out the zero-eigenvalue case. | Points to the honors lesson after Lesson 20 for the reason. Added "a zero eigenvalue leaves the test inconclusive" (agrees with 20h1 and Lesson 17's D = 0 row). |
| 06h2, intro | "Cross terms ... only tilt one of the six standard quadrics" is too strong. For example x² + 2xy + y² = 1 is a pair of planes, and the lesson's own flowchart lists cylinders and degenerate cases. | Now "tilt a surface you already know (one of the six standard quadrics, or a cylinder or other degenerate case)", and says linear terms only shift it. |
| 06h2, intro | "Two results from linear algebra are stated without proof": the second unproved result (the quadratic part controls the shape at a critical point) is from analysis, not linear algebra. | "Two results ... (one from linear algebra, one from analysis)". |
| `lessons/06-surfaces.md`, round 2 quadric key (Mermaid) | The "number of minus signs" node had branches none, one and two only. After the lead-in tells the student to multiply by −1, x² + y² + z² = −1 becomes three minus signs and had no branch. | Added "three → No points at all" and updated accDescr. Rendered. |
| `images/mv-m1-skew-lines.svg` (+ `-blank`) | The "L₂" label overlapped the end of line L₂. The "v₂" label sat on the arrowhead. | Moved L₂ (both files) and v₂ (labeled file) clear of the line. Re-rendered both, with markers. |

## Checked and found right (things a reader might doubt)

- All 58 new questions worked before reading the key. All MC keys, select-all sets, order
  questions (only one valid order each), match pairings and label markers are correct.
  Recomputed in sympy/Python:
  - h06: BAC−CAB gives ⟨1, −2, −1⟩; the distractor (a×b)×c is ⟨−1, −1, 1⟩.
  - Distances: h07 (D = 3), h10 (D = √3), h14 (foot (1, 2, 2)).
  - Angles in q12: 18.4°, 54.7°, 90°, 109.5°, 166.0°.
  - Text answers: q13 = 17/3, q18 = ⟨1, −2, 6⟩, q23 = 3.
  - Eigenvalues: h18 (6, 1), h28 (3, −1).
  - Surface identification: h23 is a two-sheet hyperboloid along ⟨1, 0, 1⟩.
- 06h1: all three examples recomputed:
  - Example 1: a×(b×c) = ⟨8, −4, 0⟩ by both routes; (a×b)×c = ⟨6, −4, 2⟩.
  - Example 2: point to line D = 3, foot (2, 2, 4).
  - Example 3: skew lines, n = ⟨2, −1, −2⟩, D = 3, t = 1, s = 2, closest points (3, 2, 3) and (5, 1, 1).
  - The Cauchy–Schwarz discriminant proof and its equality case are correct.
  - A cyclic shift is two transpositions, so the triple product keeps its sign.
  - "The middle vector gets the plus sign" also holds for (a×b)×c = b(a·c) − a(b·c).
  - The curl-of-curl remark is correctly hedged (Cartesian components, ∇ is an operator).
- 06h2:
  - B′ = B cos 2θ − (A − C) sin 2θ is the standard result.
  - The invariants A + C and B² − 4AC, and the 2×2 eigenvalue formula, are correct.
  - The eigenvalue product is AC − h² = −¼(B² − 4AC).
  - Example 1: eigenvalues 4 and 9, eigenvectors ⟨2, 1⟩ and ⟨−1, 2⟩, θ = 26.57°, tan θ = ½. A′ = 4 was checked by direct substitution.
  - Example 2: xy = ½(x′² − y′²).
  - The conic table (k ≠ 0) and the eigenvalue-sign chart are correct.
  - The Hessian link holds: the discriminant is −4D.
- Drills:
  - rot-angle: 20,000 random forms give B′ = 0 and 0° < θ < 90° every time. Tolerance 0.06 for 1 decimal.
  - eigen2: all 316 admissible (a, c, h) give integer eigenvalues that match numpy.
  - point-line: the cross-product and foot-of-perpendicular distances agree on 2,000 random cases. Tolerance 0.006 for 2 decimals.
  - skew-dist and triple-vec: formulas are as in the lesson. Single-letter names (a, b, c, h, s) do not collide with any TeX braces in the prompts or solutions.
- Pictures: all 6 SVGs and 6 blanks rendered.
  - Geometry is right. The parallelepiped's top face is the base translated by a. b × c points up by the right-hand rule. The axes are right-handed, and the stem's "z up" makes the x/y labels unique.
  - Every label-question marker sits on its named part.
- Plots: the 01 polar wedge (its vertices are on r = 1 + cos θ for θ = 0.5…0.7) and the 06h2 tilted ellipse (the parametrization is 3cos t·û₁ + 2sin t·û₂; marked points at (2.683, 1.342) and (−0.894, 1.789)) were rendered. No label sits on a curve.
- All 8 Mermaid diagrams were rendered and are readable. Their accTitle/accDescr describe the whole chart.
- Glossary: none of the 13 terms or their aliases appears in `glossary.yaml` or any other `glossary-r2-*.yaml`.
- The 19 cards are correct.

## Overlap

06h2 (quadratic forms, eigenvalues, link to the second-derivative test) overlaps with mv-m4's
`20h1-hessian-test.md`, which introduces eigenvalues and diagonalizes the Hessian again.
The overlap is complementary:
- 20h1 explicitly cross-references 06h2 and is written to stand alone.
- 06h2 now points forward to 20h1 for the proof.
- mv-h1's L93 also uses "the quadratic-forms lesson of Module 1".

No change needed beyond the pointer.

## Uncertain / left as is

- In the 06h1 distance chooser, the "point and plane" box assumes the course's ax + by + cz = d
  convention (as Lesson 5 uses). That is fine within the course.
- In the 06h1 intro, the phrase "in two and three dimensions the law of cosines guarantees it"
  is loose but not wrong. Left as is.

## Counts

Answer-key errors 0; explanation errors 1 (h19); factual fixes 5 (06h2 ×4, 06 key); picture fixes 1 (skew-lines SVG pair).

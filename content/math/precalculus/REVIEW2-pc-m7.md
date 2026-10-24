# Round 2 review: module pc-m7 (Conics, parametric equations and polar coordinates)

Reviewer pass over the round 2 work described in `NOTES2-pc-m7.md`. After my fixes,
`content/math/check-module.sh precalculus pc-m7` reports OK: 9 lessons, 147 questions,
20 drills, 59 cards, zero problems.

## Changes

| Where | Problem | Fix | Source / check |
|---|---|---|---|
| 33-polar-conics.md, plot "same focus and directrix, e = ½, 1, 2" | Rendered with the app's code: the "e = 1" label sat on the dashed parabola, "e = 1/2" sat on the y-axis, and the "focus" point label overlapped the ellipse, the parabola and the y-axis. | Moved "e = 1/2" to (−3.4, 0.6), left of the ellipse, and "e = 1" to (−4.2, 3.4), inside the parabola. Dropped the point label and changed the caption to "Same focus (the dot at the pole) and directrix: …". Re-rendered: nothing overlaps. | preview-plots.mjs |
| 28-parabolas.md, Mermaid "equation → vertex, focus, directrix" | The chart said the focus and directrix are "p units" from the vertex. When p < 0 (the chart's own branch for parabolas that open down or left), that reads as a negative distance. | Changed both boxes and the accDescr to "\|p\| units" / "the distance \|p\|". Re-rendered. | Lesson's own table |
| 33-polar-conics.md, Mermaid "reading a polar conic" | The last box told learners to find vertices at θ = 0 and π (or π/2 and 3π/2). A parabola has only one vertex there, because the other angle makes the denominator 0 (Example 2 in the same lesson shows this). | Added "; a parabola has just one" to the box and a matching clause to the accDescr. Re-rendered. | Lesson Example 2 |
| 33h2-conic-geometry.md, Example 3 | The example used the angle-between-vectors formula and cited "the dot product (Module 8)". Module 8 comes after this module, so a learner going in order has never seen the formula. | Stated the formula inline, cos∠(u, v) = (u₁v₁ + u₂v₂)/(\|u\|\|v\|), noting that Module 8 develops it fully. The numbers (0.7295, both angles 43.2°) were already right. | course.yaml module order; Python check |
| 33h3-orbits.md, "A trip to Mars" | Said a Hohmann transfer is "the cheapest way (in fuel) to move a spacecraft between two circular orbits". That overstates it: a bi-elliptic transfer can use less fuel when the radius ratio is above about 11.9. Hohmann is optimal among two-burn transfers between coplanar circular orbits. | Now reads "the most fuel-efficient way … in the same plane using two engine burns". This matches the glossary entry, which already said "two-burn". | Standard orbital mechanics (e.g. Curtis, *Orbital Mechanics for Engineering Students*, §6.3–6.4) |
| 33h1-rotation-of-axes.md, eigenvalue note | The note was labeled "Simplified for now", but it is exact, not a simplification. Module 6 also already has an honors eigenvalue lesson (27h3) that the note didn't mention. | Relabeled it "A look ahead", kept the content and pointed to the Module 6 honors eigenvalue lesson. | pc-m6 27h3 |
| pc-m7-r2-q21 (MC) | The explanation didn't account for the distractor (4, −4.5). | Added "(4, −4.5) forgets the starting y-value 2 (it uses y = −6t)". | Computed |
| pc-m7-r2-q07 (label) | The "Major axis" marker sat on the center-to-focus segment that the picture labels "c", so it was easy to read as the c distance. | Moved the marker to x = 33.2 on the left half of the major axis (between focus 2 and center 1). Re-previewed with all markers. | preview-figure.mjs |
| drills pc-m7-r2-rotation-angle, pc-m7-r2-rotated-coefs | Some inputs gave equations with no real points, for example −6x² + 2xy − 5y² = 8, or A′, C′ both negative with G > 0. The answers were still right, but learners were asked to "rotate" a curve that doesn't exist. | Added `where` conditions `max(max(A, C), B^2 - 4*A*C) > 0` and `max(Ap, Cp) > 0`. The quadratic form is then positive somewhere, so the graph isn't empty. | Algebra |

Counts: answer-key errors 0; factual fixes 2 (Hohmann optimality claim, mislabeled
"simplified" note); picture/figure fixes 4 (lesson 33 plot labels, the q07 marker, two Mermaid
boxes); other fixes 3 (forward reference to the dot product, q21 distractor explanation, empty-graph
drill inputs).

## Checked and found right

- **All 71 new questions:** I worked every one before reading its key. Each has exactly one defensible answer and the `accept` lists are complete. I recomputed the numeric ones:
  - h03: A′ = 4, C′ = 16
  - h04: 8 and −2
  - h11: 6 and 1, θ from cot 2θ = −¾
  - h17: 14 and 6
  - h18: e = 0.707
  - h19: 0.742 and 1.085
  - h35: 1.9^1.5 = 2.619, so the trip is 1.31 years
  - h40: 6.4

  Order questions have no steps that could be swapped. The h24 hyperbola-mirror wording is unambiguous: only the branch around F₂ has a convex side that a ray aimed at F₂ can reach.
- **33h1 algebra (sympy):** the A′/B′/C′/D′/E′ formulas, and A′ − C′ = B / sin 2θ (so it has the sign of B). Examples 1–4 are right, including the foci (±2, ±1) and the parabola focus (1, −1) with directrix y − x = 2. Expanding the distance equation gives back the original equation.
- **33h2:**
  - The Dandelin argument is right, and the e = cos β / cos α sketch is labeled as a sketch.
  - Focal radii: (a − ex₀)² = PF₂² holds.
  - Example 1: P is on the ellipse, PF₂ = 2.6, and the directrix is x = 6.25.
  - The parabola tangent derivation (k = −pm², T = (0, −y₀)) is right.
  - Example 2: FT = FP = 10.
  - Example 3: the tangent slope is −9/20 and both cosines are 0.7295.
  - History: Menaechmus about 350 BC, labeled "traditionally"; Apollonius's *Conics* about 200 BC; Pappus about 320 AD records the focus-directrix property; Kepler coined "focus" in *Ad Vitellionem Paralipomena* (1604) and *focus* is Latin for "hearth"; Dandelin 1822. These match standard histories (MacTutor biographies of Apollonius, Pappus and Dandelin).
- **33h3 values:**
  - 1 AU = 149,597,870.7 km (IAU 2012).
  - NASA planetary fact sheets: Earth e = 0.0167, perihelion 147.1 and aphelion 152.1 million km; Mars a = 1.524, e = 0.0934; Mercury and Jupiter a and T as in the table.
  - The table's a^1.5 values were recomputed: 0.2408, 1.8814, 11.868.
  - Halley's Comet: a ≈ 17.8, e ≈ 0.967, so q ≈ 0.59 and Q ≈ 35.0, and the speed ratio is ≈ 60.
  - The Hohmann transfer to Mars takes 0.709 yr ≈ 259 days.
  - Kepler 1609/1619 and Newton 1687 are right. Hohmann published in 1925 (*Die Erreichbarkeit der Himmelskörper*).
  - 'Oumuamua: found in 2017, e ≈ 1.20.
  - Newton's form of the third law, with M + m, is right, and Jupiter's mass is about 1/1047 of the Sun's.
- **Pictures:** I rendered all 17 SVGs and checked the geometry against the SVG coordinates.
  - The parabola's focus, vertex and directrix are equally spaced; P is equidistant from focus and directrix (220 px each); the focal width is 4p.
  - Ellipse: a² ≈ b² + c².
  - Hyperbola: c = √(a² + b²), with the foci at ±166 px.
  - Orbit: e = 0.6, with the directrix at a/e.
  - The cone-slice parabola plane is parallel to a generator (slope −0.5777 vs −0.5774), and the hyperbola plane misses the apex.
  - Dandelin: both spheres are tangent to the cone and to the plane, and PF₁ = PQ₁ = 62.8, PF₂ = PQ₂ = 116.0.
  - The two Kepler-areas wedges have equal shoelace areas (13545 and 13550 px²).
  - The polar gallery curves are to scale.
  - Every label-question marker sits on its part.
- **Mermaid:** all 9 diagrams render, are readable, and their accTitle/accDescr describe the whole diagram. The two 31-parametric plots are right, including the t = ¼ and ¾ points.
- **Drills:**
  - rotation-angle: the atan2 formula equals ½·arccot((A − C)/B) and makes B′ = 0 for every input. The tolerance of 0.06 is enough for 1 dp.
  - rotated-coefs: every input gives integer A, B, C, and direct rotation reproduces A′, C′ with B′ = 0 (all 128 combinations checked).
  - focal-radii (Pythagorean triples), parabola-tangent, apsides, orbit-from-apsides and kepler-period: the formulas are right and the tolerances cover correct rounding.
- **Glossary and cards:** the 17 terms don't clash with any other glossary file in the course, and the 30 cards are correct.

## Overlap with other modules

pc-m6's honors lessons 27h1 (rotation matrices from the unit circle) and 27h3 (eigenvalues)
overlap lightly with 33h1, which derives the rotation formulas and mentions eigenvalues. They
don't contradict each other. 33h1 now points to 27h3 for the eigenvalue vocabulary. No other
overlap.

## Left uncertain

- The hyperbola in the lesson 33 plot is drawn as two curves, so the renderer gives its branches
  different colors. The caption explains the second branch.
- Historical dates and astronomical constants come from standard references I know well. I didn't
  re-fetch them in this session.

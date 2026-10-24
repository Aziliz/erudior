# Round 2 review: geo-m9 (Coordinate geometry and transformations)

Reviewer, independent of the writer. `content/math/check-module.sh geometry geo-m9` after fixes:
zero problems (7 lessons, 110 questions, 20 drills, 52 cards).

## Changes

### Answer key / question fixes (1)
- **geo-m9-r2-h25** (order, angle-addition proof): step 3 "Multiply out the product $R_\alpha R_\beta$"
  could be done before step 2 ("Write this as the matrix equation…"), so two orders were
  defensible. Reworded to "Multiply out the left side of that equation, $R_\alpha R_\beta$", which
  forces it after step 2. Order now unique.

### Factual fixes (4)
- **38h2 intro**: "packs every transformation that fixes the origin into … a matrix" is false
  (most origin-fixing maps aren't linear). Now "each rotation, reflection or dilation that fixes the
  origin".
- **38h2 "Matrices" section + glossary `linear transformation`**: said every matrix map sends lines
  to lines and keeps parallels parallel. False for determinant 0 (the plane collapses onto a line
  or point, e.g. the zero matrix). Added that exception in both places.
- **38h2 Common mistakes**: "lengths scale by $\sqrt{\det}$" fails for opposite similarities,
  where det = −k². Now "$|\det| = k^2$ … lengths scale by $\sqrt{|\det|}$".
- **38h3 Key points**: "vertices ±a, co-vertices ±b, foci ±c along the major axis" made it sound
  like the co-vertices are on the major axis. Now vertices and foci are on the major axis and the
  co-vertices on the minor axis.

### Picture fixes (7 ```plot blocks, all re-rendered with preview-plots.mjs and checked)
Point labels and segment labels were sitting on lines, curves, axes or tick labels. Each one is now
a free `labels` entry in a clear spot (coordinates, curves and captions unchanged):
- 35 Example 3 square: "A(1, 2)" and "D(4, −2)" crossed the sides.
- 36 Example 2(b): "(1.5, 1.5)" sat on the dashed segment and the right-angle mark.
- 37 Example 4: "x = 1" and "x = 4" sat on the dashed mirror lines; "(0, 5)" ran across the
  x = 1 line. Widened x-range to [−3, 9].
- 38 Example 3 (circles): "⟨4, 6⟩" and "(1, −2)" sat on the arrow and circle; "(4, −2)" on the
  big circle.
- 38h2 unit-vector plot: "(1, 0)" sat on the arrowhead and tick label, "(0, 1)" on the y-axis,
  "(cos θ, sin θ)" touched the arrow tip. Widened x-range to [−1.6, 2].
- 38h2 determinant parallelogram: "(1, 3)" and "(2, 1)" were crossed by the sides.
- 38h3 hyperbola: "F₁(−5, 0)" covered the vertex (−3, 0) and the branch, "(3, 0)" sat on the
  branch, "(5, 16/3)" touched the asymptote, and the focus labels hit the ±6 tick labels.

### Other (1)
- **38h1**: "The name comes from Hermann Weyl's book *Symmetry*" softened to "goes back to". Weyl
  credits Leonardo with the result. The label "Leonardo's theorem" is what later textbooks call it,
  and Weyl's own wording isn't confirmed.

## Checked and found right (things a reader might doubt)
- **All 64 questions worked independently before reading the key.** h08's 180° rotation about
  (−1, 2) is (−2 − x, 4 − y). h19's distractor (11, −4) is the transpose. h22's 50 is
  5·(ad + bc). h26 is reflection in y = x/2: cos 2α = 0.6, sin 2α = 0.8, and (2, 1) is fixed.
  h40 has b² = 1600 − 144 = 1456, and its distractor uses 576/1024. Every select-all set, match
  pairing and order is unique.
- **Lessons.** The 38h1 proofs hold: the three-point uniqueness, the reduction to at most three
  reflections, the two-mirror rules (φ → 2α − φ), the glide-reflection Example 2 and the rectangle
  group. The 38h2 Examples 1–5 recomputed: 30° image (2.964, 2.866), Q′ = (3, 2 + 2√3), (5, 5) →
  (1, 7) in y = 2x, the products in Example 4 (they match Lesson 37 Example 3), the box-minus-
  corners area 5, and image area 15. The 38h3 derivation is right, including both squarings and
  a√((x−c)² + y²) = a² − cx. Examples 1–4 check out: (5, 16/3) is 16/3 and 34/3 from the foci,
  the LORAN numbers give 30 km and b² = 2275, and the vertex is 65 and 35 km from the stations.
- **Facts.** Kepler's first law appeared in *Astronomia nova* in 1609. Earth's orbital e is
  ≈ 0.0167 and Halley's ≈ 0.967 (NASA fact sheets). Apollonius of Perga (c. 262–190 BC) named the
  ellipse, parabola and hyperbola. There are 7 frieze types, and Fedorov listed the 17 wallpaper
  groups in 1891. Weyl, *Symmetry* (1952), attributes the cyclic/dihedral classification to
  Leonardo (see also Ana4, Visual Mathematics: "According to H. Weyl, this theorem is attributed
  to Leonardo"). LORAN dates from WWII; LORAN-C was shut down in the US in 2010 after GPS.
  Lithotripters use ellipsoidal reflectors.
- **SVGs (13), all rendered, with geometry recomputed from the SVG coordinates.**
  - Reflection: A′B′C′ and P′ are the exact mirror images in ℓ, and M is the midpoint.
  - Dilation: all three rays have ratio exactly 2.5.
  - Parabola: p = 40 px, and PF = P-to-directrix = 200 px.
  - Two reflections: the mirrors are at 15° and 55°, and P → P′ → P″ is an 80° turn.
  - Ellipse: a : b : c = 210 : 126 : 168 = 5 : 3 : 4, matching the caption 2a = 10, and P is on
    the curve.
  - Pinwheel: the blades are at 120° steps with no mirror line.
  - Label markers: every marker sits on its named part (q04, q09, q14, q19, h15, h33).
- **Mermaid (7).** All rendered and readable, and each accTitle/accDescr covers the whole diagram.
- **Drills (8).** Generated 300 instances each and recomputed every answer in Python from the
  prompt text, with 0 mismatches. Correctly rounded 2-decimal answers are accepted (rotate-angle,
  tolerance 0.01). For the hyperbola slope, both the fraction b/a and the 2-decimal value are
  accepted (worst rounding error 0.0033 < 0.006), and 1.34 for 4/3 is rejected. No unfilled
  placeholders.
- **Glossary.** All 22 terms checked against every glossary*.yaml in the course: no duplicate
  terms or aliases.
- **Overlap.** No other round 2 lesson in Geometry (NOTES2-*, the other honors lessons, 90–93)
  covers isometry classification, matrices or ellipses/hyperbolas.

## Left as is / uncertain
- 38h1 leaves out the proof that three reflections reduce to a reflection or glide reflection,
  and says so in the lesson.
- The letter symmetries (Z, H, S, N) assume plain sans-serif letters, which is the usual
  textbook convention.
- The two-mirrors drill solution reads oddly when the angle is already positive ("a turn of 120°
  is the same as one of 120° … (add 360° to a negative angle)"), but it isn't wrong.
- The existing glossary entry for **focus** is parabola-specific. 38h3 doesn't bold "foci", so it
  doesn't pop up there.

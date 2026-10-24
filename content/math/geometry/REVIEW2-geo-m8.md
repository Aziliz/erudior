# Round 2 review: geo-m8 (Area, surface area and volume)

Reviewed: honors lessons 34h1 (polyhedra), 34h2 (frustums, caps, Pappus) and 34h3 (isoperimetric); the round 2 additions to core lessons 31–34; `questions/r2-geo-m8.yaml` (64 questions), `drills/r2-geo-m8.yaml` (8 drills), `glossary-r2-geo-m8.yaml` (18), `cards-r2-geo-m8.yaml` (31), and the 20 `images/geo-m8-*` SVGs.

Final check: `content/math/check-module.sh geometry geo-m8` gives 7 lessons, 114 questions, 22 drills, 52 cards, OK (0 problems).

## Changes

### Answer keys and question stems
- **geo-m8-r2-q09 (match).** The distractor "Pi times the difference of the radii squared" can be read as π(R² − r²), which is the correct annulus formula, so it competed with the right answer for "Annulus". Changed to "Pi times the square of the difference of the radii" (π(R − r)², the mistake the explanation names).
- **geo-m8-r2-h21.** The stem said the two planes are "1 and 3 units from the center" without saying which side. If they are on opposite sides the band is 4 thick and 48π is right, so two answers were defensible. The stem now says "on the same side of the center". The explanation now also explains the 48π distractor.
- **geo-m8-r2-h23 (torus volume).** With r = 2 a torus's volume 2π²Rr² and surface area 4π²Rr are equal, so the distractor 96π² labeled "the surface area" was wrong: the surface area was 48π², the same as the key. The "24π" distractor's explanation didn't match its value either. Changed to r = 3, R = 5: key 90π² (≈ 888.3), distractors 45π² (uses πR), 60π² (the surface area 4π²Rr) and 90π (drops the π in the disk's area). The key is still in position 0.

### Explanations
- **geo-m8-r2-h19.** It said 30π "uses 2R in place of 3R", but that gives 3π(10 − 3) = 21π. 30π is the cap's curved area 2πRh = 2π(5)(3). Explanation corrected.

### Lessons (facts)
- **34h2, spherical cap volume.** The derivation slices the hemisphere from y = R − h to R, so it only covers h ≤ R, but the lesson then checked h = 2R with it. I added one sentence: the argument covers h ≤ R, a taller cap is the ball minus a short cap, and the same formula comes out (checked with sympy), so it holds for 0 ≤ h ≤ 2R.
- **34h1, fullerenes.** "Closed cage-shaped molecules made only of carbon … every one has exactly 12 pentagonal rings" is true only for cages whose rings are all pentagons and hexagons with three bonds per atom (classical fullerenes), which are the hypotheses of the lesson's own argument. I reworded it to state those conditions.
- **33, "Naming a solid" Mermaid chart.** The chart's branches give "one flat circular base: cone" and "no bases: sphere", which is wrong for solids like a hemisphere or a torus. The introducing sentence now limits the chart to the six common solids listed above it and says other solids exist. The chart itself is unchanged.

### Pictures and plots
- **geo-m8-pyramid-parts.svg.** The ℓ label sat on the outer lateral edge (apex to back-right corner), so it looked like it named that edge, not the dotted slant height. I moved it inside the green face beside the dotted line. The blank copy and the q16 markers were already correct.
- **Lesson 31, Example 6 plot.** The "(1, 1)" point label sat on the triangle's edge. I replaced it with a free label below-left of the point.
- **Lesson 34h3, area-vs-width plot.** The "(5, 75)" label sat on the parabola, and the "width W (m)" axis title overlapped the curve where it meets the axis. I moved the point label under the curve, widened the x range to 26 and limited the function to 0–20, so the axis title sits clear of the curve.

### Drills
- **geo-m8-r2-torus.** With r = 2, V = S, so a learner who swapped the two formulas was marked right (found by generating instances with the answers swapped). I added `where: r != 2`.

## Checked and found right (a reader might doubt these)
- Every question was worked independently before reading the key. All 64 keys are correct apart from the issues above. Select-all q04 (rhombus, kite, square; ½d₁d₂ also holds for a concave kite) and h13 (3 of 4 true) are right. The order questions have no ties: q15 75.4 / 96 / 100.5 / 113.1; q18 12π / 18π / 27π / 36π; h12 defects 180 / 120 / 90 / 60 / 36; h27 9π / 19π / 64π/3 / 8π²; h42 20 / 27.71 / 36 / 41.57 / 45.84.
- Lesson numbers, recomputed in Python: bucket 3800π ≈ 11,938; lampshade 325π ≈ 1021; bowl 416π/3 ≈ 435.6 and 64π ≈ 201.1; Arctic fraction (1 − sin 66.56°)/2 = 0.0412; torus 18π² ≈ 177.7 and 24π² ≈ 236.9; perimeter-12 table (6.93, 9, 10.39, 11.20, 11.46); Q values π/4, π√3/9 ≈ 0.605, hexagon ≈ 0.907; Example 3 Q ≈ 0.589 and "about 70% more" (20.37/12 = 1.70); best 355 mL can r ≈ 3.84, h ≈ 7.67, S ≈ 277.5; picture frame V, E, F = 16, 32, 16; frustum formula derivation; "averaging the ends" is too big by πh(R − r)²/6; cap formula and a² = h(2R − h); Example 6 grid triangle = 13 (shoelace).
- All 14 vertex types in the angle-defect drill are real (e.g. 4 triangles + square is the snub cube, V = 24; 2 squares + pentagon is the pentagonal prism, V = 10). Each angle sum is right.
- Drills: each of the 8 was generated 1,500 times with the app's `generate`/`checkAll`, compared against independent formulas. Answers correctly rounded to 2 decimals were accepted, exact forms (`2052pi`) were accepted for the frustum and cap drills, the best-can chain (rounded r, then 2r and 6πr²) was accepted, and wrong values were rejected. No unfilled placeholders, "+ -" or "1x". The only comma-grouped numbers are bold answers outside math. 0 failures after the torus fix.
- Pictures: all 14 display SVGs and the 6 blanks were rendered with the label-question markers. Every marker sits on the part its label names. Geometry checked: the cap's right triangle closes (the point lies on the circle to 0.2 px), the cylinder net's width is 6.25r ≈ 2πr, and the Archimedes figure has height 2r for all three solids.
- Mermaid: all 5 render, are readable and have an accTitle and an accDescr that describe the whole chart.
- History (spot-checked against the sources below):
  - Descartes' angle-defect result: about 1630, published only in 1860 (Foucher de Careil).
  - Moscow Papyrus, problem 14: square frustum 4, 2, 6 gives 56, about 1850 BCE.
  - Euler's formula: 1750s.
  - Euclid *Elements* XIII ends with the five solids and the remark that there are no others.
  - Plato's *Timaeus*: four solids matched to the four elements.
  - Pappus (about 320 CE) and Guldin (1600s).
  - Steiner's symmetrization arguments (1838) and the existence gap, closed later (Weierstrass, 1870s).
  - Hales's honeycomb proof (1999 preprint, published 2001).
  - Dido's ox hide in *Aeneid* I.
  - Aluminium can ends are thicker than the walls.

## Overlap
- The angles-around-a-point idea in 34h1 (`geo-m8-vertex-gaps.svg`) touches 19h3 (geo-m5, star polygons and tilings, drill geo-m5-r2-vertex-fill). 19h3 uses it for flat tilings and 34h1 for solid corners, so they complement each other rather than repeat.
- 34h3's geometric AM–GM proof (perpendicular in a semicircle = √ab) is the same picture as the square-root construction in geo-h1 lesson 90. Each uses it for a different purpose. Not changed.

## Left uncertain
- The 34h1 "picture frame" and "drops by 2 per hole" statements assume ordinary polyhedral surfaces. The writer flagged this and the lesson is fine at this level.
- The 34h3 history ("complete proof … late 1800s"; Zenodorus "probably 2nd century BCE") is deliberately vague, which is appropriate.

## Sources
- Wikipedia, [Descartes on Polyhedra](https://en.wikipedia.org/wiki/Descartes_on_Polyhedra) and [Angular defect](https://en.wikipedia.org/wiki/Angular_defect); Eppstein, [Geometry Junkyard: angle defect](https://ics.uci.edu/~eppstein/junkyard/euler/angle.html)
- [Moscow Mathematical Papyrus](https://en.wikipedia.org/wiki/Moscow_Mathematical_Papyrus); [MathWorld](https://mathworld.wolfram.com/MoscowMathematicalPapyrus.html)
- Hales, [The Honeycomb Conjecture (arXiv math/9906042, 1999)](https://arxiv.org/abs/math/9906042), Discrete Comput. Geom. 25 (2001); [Honeycomb theorem](https://en.wikipedia.org/wiki/Honeycomb_theorem)
- Bläsjö, "The Isoperimetric Problem", Amer. Math. Monthly 112 (2005) (Zenodorus, Steiner, Weierstrass)
- Standard formulas checked with Python/sympy.

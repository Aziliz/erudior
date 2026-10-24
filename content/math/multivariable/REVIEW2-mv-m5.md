# Round 2 review: module mv-m5 (Double integrals)

Reviewed: honors lessons 24h1 (numerical) and 24h2 (improper / Fubini), round 2 additions to core
lessons 21-24 (4 SVGs plus blanks, 4 Mermaid), `questions/r2-mv-m5.yaml` (48), `drills/r2-mv-m5.yaml`
(5), `glossary-r2-mv-m5.yaml` (11), `cards-r2-mv-m5.yaml` (20). After fixes,
`content/math/check-module.sh multivariable mv-m5` reports zero problems.

## Changes

| Where | What was wrong | Change |
|---|---|---|
| mv-m5-r2-h14 (stem, explanation) | Answer-key ambiguity: the stem asked only "Which statement is correct?", and choice "The estimate is 0.78, with a standard error of about 0.04" is a true statement about the estimate of the quarter disk's area (0.78, SE = 0.41/10 = 0.041). Two defensible answers. | Stem now says the hits are used to estimate π and asks about "this estimate of π"; explanation says why 0.78 ± 0.04 is the area estimate, not π's. |
| mv-m5-r2-h15 (explanation) | Distractor 2π had no explanation. | Added: 2π is the value for r⁻¹ (reading (x² + y²)^{1/4} as r). |
| mv-m5-r2-h28 (explanation) | Distractor 1/e had no explanation. | Added: 1/e is P(X > 1). |
| 24h1, Simpson-weights figure | Rendered as a `plot`: the corner weight labels "1" sat next to the axis tick labels "1" at the same points, reading as "1 ● 1"; points on the axes. | Changed the block to ```shape (same JSON, no axes or ticks). Re-rendered: clean. |
| 24h1, Monte Carlo figure | The curve label "x² + y² = 1" was drawn at the top-left corner on top of the y-axis title. | Removed the curve label; the caption now names the quarter disk x² + y² ≤ 1. Re-rendered: clean. |
| 24h2, disk-square-disk figure | As a `plot`, all three text labels sat on the y-axis and its tick labels ("disk of radius R√2" over "1.5"/"y", "disk of radius R" over "0.5"). | Changed to ```shape (same JSON). Re-rendered: labels clear of every line. |

## Checked and found right

- All 48 questions worked independently before reading the key; every key and every MC distractor
  rationale checked. Numeric checks in Python: q02 = 5, q05 values, q07 = 4/3, q12 = 81π/2 (36π without
  r), q17 = 24π, q20 x̄ = 1/4, h02 (M = 10, exact 32/3, error 2/3 = formula), h11 (Simpson exact 64/9;
  2×2 midpoint 6.25; 2×2 trapezoid 9; single midpoint 4), h15 4π/3, h17 order π/2 < π < 2π < 4π, h22 3/4,
  h28 1 − 2/e.
- 24h1 numbers: e^{xy} integral Σ1/(n·n!) = 1.3179022; Simpson 1.3181239 (error 0.00022); 3×3 midpoint
  1.3133759 (error 0.0045, ratio 20.4); 2×2 midpoint 1.3080024, actual error 0.0099 vs predicted 1/96
  (∬(x² + y²)e^{xy} = 1 by dblquad); halved mesh for x² + y gives 9.25; pond depths sum 14.1 → 1410 m³;
  all 100 Monte Carlo points checked: 78 filled inside, 22 open outside the unit circle; s = 0.4105,
  SE = 0.164. Crossover d > 4 (midpoint) and d > 8 (Simpson) from N^{-2/d}, N^{-4/d} vs N^{-1/2}.
- Midpoint error sign and constant (h²/24 ∫f_xx …) and exactness for a + bx + cy + dxy; tensor Simpson
  exact for degree ≤ 3 in each variable (Burden & Faires, Numerical Analysis, composite midpoint and
  Simpson rules; the 2D forms follow by tensor product). Note: the lesson's "(at least once the grid is
  fine)" hedge on underestimation is weaker than needed (with f_xx, f_yy ≥ 0 the midpoint rule
  underestimates on every grid, by applying the 1D convexity bound in x then y), but it is not wrong, so
  left as is.
- 24h2: squeeze bounds 1.986 / 2.231 / 2.716 (R = 1) and 3.084 / 3.112 / 3.141 (R = 2), recomputed with
  erf; within 1% of π at R = 2 (0.94%). ∬_{r≥1} 1/(x⁴ + y⁴) = √2 π (via cos⁴ + sin⁴ = (3 + cos 4θ)/4).
  Counterexample ±π/4 and |f| = |cos 2θ|/r² diverging; critical exponents 2 (plane) and 3 (space);
  P(X < Y) = a/(a + b).
- History: Fubini 1907 ("Sugli integrali multipli"), Tonelli 1909; Monte Carlo method at Los Alamos
  late 1940s by Ulam, von Neumann, Metropolis (N. Metropolis, "The beginning of the Monte Carlo method",
  Los Alamos Science, 1987). The absolute-integrability definition is labeled as a simplification of
  Lebesgue theory, as it should be.
- Drills: all 720 midpoint instances (closed forms vs direct midpoint sums and scipy dblquad), all 16
  Simpson instances (closed-form bracket vs the 3×3 weighted sum), all 15 power-disk instances (vs
  scipy quad), the race fraction and box probability. Tolerances: midpoint default 0.01 for "2 decimals",
  Simpson 0.0001 for 4 decimals, power-disk 0.01 for 2 decimals, box 0.0006 for 3 decimals: correctly
  rounded answers accepted, clearly wrong ones rejected. Monte Carlo hit counts are always integers.
- SVGs: all four rendered, plain and blank-with-markers; geometry right (slice at fixed x spans the
  y-direction; Type I limits; polar patch sides; surface patch: a along +x, b along +y, both from the same
  corner, and the drawn normal direction matches ⟨−f_x, −f_y, 1⟩ for the patch's slopes). Every marker
  sits on the part its label names. Small cosmetic point: in mv-m5-polar-patch-blank the Δθ marker covers
  the little angle arc, but it sits between the two rays at the vertex, so the part is unambiguous.
- All 6 Mermaid diagrams rendered: content correct, accTitle/accDescr describe the whole chart, readable.
- Glossary: definitions correct; no term or alias duplicated in any glossary*.yaml in the course.
  Cards correct.
- Overlap: no other round 2 lesson in the course covers numerical integration, Monte Carlo, improper
  double integrals or Fubini/Tonelli (checked every NOTES2 and honors lesson).

## Uncertain / left alone

- The pond depth table (24h1 Example 2) is invented, illustrative data, as the notes say.
- During review I ran one read-only `git status` by mistake (no changes made by it).

## Counts

Answer-key errors 1 (h14); factual fixes 0; picture fixes 3 (three lesson figures); other fixes 2
(missing distractor explanations in h15, h28).

# Round 2 review: module pc-m3 (Polynomial and rational functions)

Reviewer for item 106. Scope: honors lessons 14h1–14h3, round 2 additions to core lessons 08–14,
`questions/r2-pc-m3.yaml`, `drills/r2-pc-m3.yaml`, `glossary-r2-pc-m3.yaml`, `cards-r2-pc-m3.yaml`,
`images/pc-m3-*`. `content/math/check-module.sh precalculus pc-m3` reports zero problems after the fixes.

## Changes

### Answer keys / explanations
- **pc-m3-r2-h08** (explanation): said the distractor $14 + 11i$ comes from "taking $i^2 = +1$". That is
  inconsistent (with $i^2 = +1$, $i^3 = +i$ and the result would be $14 + 13i$). Now: "adding 6 instead of
  subtracting it (writing $6i^2$ as $+6$) gives $14 + 11i$". Key itself (index 3, $2 + 11i$) was right.

### Factual fixes
- **14h3, end of "An application: the thin-lens equation"**: said the center of symmetry of
  $d_i = 10 + \frac{100}{d_o - 10}$ is the point $d_o = d_i = 20$. Wrong: the center is where the asymptotes
  cross, $(f, f) = (10, 10)$. $(20, 20)$ is where the graph meets its axis of symmetry $d_i = d_o$. Rewrote
  the paragraph: center $(10, 10)$; graph symmetric across $d_i = d_o$ because the lens equation is symmetric
  in $d_o, d_i$; it meets that line on the $d_o > f$ branch at $(20, 20)$ (the 2f–2f setting). Checked with
  sympy (solving $10 + 100/(x - 10) = x$ gives $x = 0, 20$).
- **14h2, intro**: "It is how calculators draw smooth curves through data, how fonts and animations bend
  curves" overstated: font outlines use Bézier curves (approximating, not interpolating), and graphics
  generally use low-degree piecewise curves (splines), not one interpolating polynomial. Reworded to
  "a basic tool of numerical computing (smooth curves in graphics and animation are usually built from many
  low-degree pieces called splines, a close relative)".

### Picture/figure fixes (all re-rendered with `preview-plots.mjs` and checked)
Labels in seven figure blocks sat on curves, axes, arrowheads or each other. Moved them to free `labels`
positions (no change to the mathematics):
- 10 (multiplication by $i$ plot): "iz" label crossed the imaginary axis; "i²z", "i³z" labels sat under
  arrowheads. Widened the view to [−5, 5] × [−4.5, 4.5] and placed the three labels clear of segments.
- 11 (Example 3 cubic): "2" sat on the curve, "(0, −4)" on the y-axis tick labels.
- 13 ($1/(x-3)$ vs $1/(x-3)^2$): the two curve labels overlapped each other and the curves. Now
  "solid: …" / "dashed: …" in the empty lower right.
- 14h1 (Bombelli's cubic): "−2 + √3" crossed the y-axis and curve, "4" sat on the curve.
- 14h2 (Lagrange basis plot): "(2, 3)" and "L₀" sat on curves, "L₁" was cut off at the bottom.
- 14h2 (Runge plot): the two curve labels were printed on top of each other on the right spike. Raised the
  y-range to 2.6 and put "solid: 1/(1 + 25x²)" / "dashed: interpolant" above the spikes on either side.
- 14h3 (Example 1 plot): curve label on the curve, "(2, −5)" crossing the vertical asymptote, "center (3, 2)"
  on the asymptote.

### Other fixes
- **pc-m3-r2-lens** (drill solution): printed the product $f d_o$ with a thousands comma inside math
  (e.g. $\dfrac{1,062}{41}$, 14 of 400 instances). The solution now shows $\dfrac{(18)(59)}{41}$; removed the
  unused `prod` calc value.

## Checked and found right
- Every new question worked independently (q01–q31, h01–h38). Select-all sets, order uniqueness, match
  pairings and accept lists are correct (e.g. q04: $x^6 - x^2$ and $x^8 - x^2$ do have exactly 3 turning
  points; q13: $\sqrt{-4}\sqrt{-9} = -6$ with principal roots; q17, q22, q29 sets; h28 inverse asymptotes
  $x = 2$, $y = -4$; h27 $k = 13/2$).
- 14h1 numbers in sympy: depressed-cubic formulas, Example 1–3 (real root −0.403928, conjugates
  $-1.298 \pm 1.807i$; $(1 + \sqrt3)^3 = 10 + 6\sqrt3$), Bombelli's $(2 + i)^3 = 2 + 11i$, $\Delta = -108D$,
  the sign-of-D table. History matches MacTutor (del Ferro c. 1515, Fior–Tartaglia contest 1535, Tartaglia
  to Cardano 1539, *Ars Magna* 1545 with Ferrari's quartic, Bombelli's *Algebra* 1572; Ruffini 1799 with a
  gap, Abel 1824). "Proved in the 1800s" that the irreducible case needs non-real radicals: Hölder 1891
  (also Wantzel 1843) — right.
- 14h2: Lagrange 1795 with Waring 1779 priority (standard; MacTutor / Waring, Phil. Trans. 1779); Shamir,
  CACM 22 (1979); Runge 1901. The degree-10 Runge interpolant's coefficients equal sympy's
  `interpolate` exactly; max ≈ 1.959 at $x \approx \pm0.940$ where $f \approx 0.043$ (lesson: "almost 2 near
  ±0.94, f below 0.05") — right. Examples 1–3 recomputed.
- 14h3: $k = (bc - ad)/c^2$, inverse formula and swapped asymptotes, 3-cycle of $1/(1 - x)$, centers
  (1, 0) and (0, 1), lens values ($d_o = 30, 20, 15, 5 \to 15, 20, 30, -10$), virtual-image sign convention
  (standard "real is positive" convention, e.g. OpenStax *University Physics* vol. 3, §2.5).
- Core additions: the Mermaid charts (08, 09, 10, 11, 12, 13, 14) render and are correct; the 14 number
  lines match Examples 2 and 3; the 12 feature picture ($R = 2(x-1)/(x+1)$, hole (−3, 4), intercepts) and
  every SVG's geometry (thin-lens ray diagram is to scale: f = 10, d_o = 30, d_i = 15, m = −½).
- Label questions q01, q06, q10, q19, h34: rendered with markers; every marker is on the part its label
  names.
- Drills: all 9 generated 400–500 times through `generate()`; answers recomputed in sympy from the prompt
  text: 0 mismatches. Correctly rounded answers accepted (Cardano root at 4 dp; lens d_i at 1 dp and m at
  2 dp, including m computed from the rounded d_i); exact fractions accepted; answers off by 1 (or 0.001 /
  0.3 for the decimals) rejected. No "+ -", "1x" or unfilled placeholders.
- Glossary (11) and cards (25): definitions correct; no duplicates of other glossary files.

## Overlap / notes
- 14h3's "center of symmetry" section repeats a point already made in pc-m2's 07h1 (line 69: a shifted
  $k/x$ is symmetric about the crossing of its asymptotes). 14h3 goes further (the $f(h+s) + f(h-s) = 2v$
  identity, inverses, lens), so it is a mild overlap; not changed. 14h3 already defers the inverse formula
  and involutions to 07h2.
- Lesson 19 uses "interpolation" in the statistics sense (predicting within the data range), while 14h2's
  glossary term is "polynomial interpolation"; consistent, but a learner may notice the two uses.
- Left as is: the 09 "which tool" chart treats linear divisors as $x - c$ only (a divisor like $2x - 1$ is
  not covered), and the 11 strategy chart has no exit when no rational candidate works (14h1 covers that
  case). Both are simplifications, not errors.

# Round 2 review: trig-m9 (Polar coordinates, parametric equations and complex numbers)

Reviewer for item 132. Scope: honors lessons 39h1, 39h2, 39h3; round 2 additions to lessons 35–39;
`questions/r2-trig-m9.yaml` (65), `drills/r2-trig-m9.yaml` (6), `glossary-r2-trig-m9.yaml` (16),
`cards-r2-trig-m9.yaml` (34), `images/trig-m9-*` (12 SVGs).
`content/math/check-module.sh trigonometry trig-m9`: zero problems after the fixes.

## Changes

**Drills (`drills/r2-trig-m9.yaml`)**
- `trig-m9-r2-five-angle`: the solution printed thousands commas inside math (`5^5 = 3,125`,
  `\dfrac{2,762}{3,125}`) and in the bolded answer. Now uses `dp0` for `den`, `num`, `n2`, `d2`.
- `trig-m9-r2-polar-conic`: when $m = c$ (parabola) the normalized form printed `1 - 1\cos\theta`;
  and with $c = 1$ the solution said "divide by 1". Rewrote the solution step to "the denominator
  becomes $1 \pm e\cos\theta$ with $e = m/c$" (numerator now `texfrac`), and set `c` to start at 2 so
  every problem needs the normalizing step the drill is about. Prompt now says "as a fraction, or a
  decimal to 2 places" (tolerance 0.005 already covered 2-decimal answers).
- `trig-m9-r2-roulette`: with $b = 1$ the solution printed `1\cos(…)` / `1\sin(…)`; now `{b:coef}`.
- `trig-m9-r2-unity-factor`: solution's bolded $B$ used `num4`, which drops trailing zeros (0.618
  for a "4 decimal places" answer); now `dp4` (negative zero is stripped by formatNum).

**Plots (label placement; rendered with scripts/preview-plots.mjs)**
- 38 (Example 7 plot): the "−1 + 3i" label sat on the imaginary axis and its tick labels. Moved to a
  free label left of the point.
- 39 (z⁴ = −16 plot): the four "2 cis …" labels overlapped the square's edges and the ±1.5 ticks.
  Moved outside the circle next to each corner.
- 39h1 (e = 0.5, 1, 2 family): "focus" label sat on the y-axis; moved inside the ellipse, left of the axis.
- 39h2 (cycloid arch): the right "cusp" label overlapped the x-axis label and the 10 tick; moved
  above-left of the cusp.
- 39h3 (fifth roots): ω², ω³, ω⁴ labels sat on polygon edges / dashed diagonals; moved outside the circle.

**Lesson text (tightening)**
- 39h2 history: brachistochrone solvers now include Tschirnhaus (Johann Bernoulli plus the five who
  answered: Newton, Jakob Bernoulli, Leibniz, Tschirnhaus, L'Hôpital). Source: Wikipedia,
  "Brachistochrone curve".
- 39h2 "Rolling on a circle": "$a/b = k$ whole gives $k$ cusps" now notes that a hypocycloid needs
  $k \ge 3$ ($k = 2$ is the Tusi segment of Example 4). Same caveat added to the matching card.
- 39h1 Common mistakes: "one vertex usually comes out with $r < 0$" → "in these forms, the far vertex
  always comes out with $r < 0$" (for $e > 1$, $\theta = \pi$ always gives $ed/(1 - e) < 0$).
- 39h1 Mermaid: "Read e (the coefficient …)" → "… without its sign" (after normalizing the
  coefficient is $\pm e$); accDescr updated.
- 39h3 Mermaid: "write it in one function" → "where possible" (e.g. $\sin 2\theta$ cannot be written
  in $\sin\theta$ alone as a polynomial); accDescr updated.

Answer-key errors: 0. No question needed a change.

## Checked and found right (a reader might doubt)
- Every one of the 65 questions worked independently (Python for the numeric ones): e.g. q01
  112.6°, q05 angles 63.4/90/161.6/256.0/333.4°, q14 (17.32 m/s, 1.02 s, 2.04 s, 5.10 m), q20
  306.87°, h06 2ae = 0.0334 AU ≈ 5.0 million km, h29 cos 5θ = −0.07584 and cos 3θ = −0.936, h33
  2 ∓ 2√3 i, h34 cubic, h36 241/243, h37 0.618, h40 8c⁴ − 8c² + 1. All select-all, order, match and
  label keys are unambiguous; order items have distinct values (h26 heights 0.134/0.293/1/1.866/2).
- 39h1: Example 1 rectangular form (x − 6)²/81 + y²/45 = 1 (re-derived from 9(x² + y²) = (15 + 2x)²);
  Example 3 hyperbola (x − 2)² − y²/3 = 1 and asymptote directions; Example 4 directrix
  x + y = −4√2; Halley a 17.8 AU, e 0.967 → 0.59 / 35.0 AU and numerator 1.155; Earth 0.983 / 1.017 AU;
  Kepler's first law 1609.
- 39h2: cycloid/epicycloid/hypocycloid equations and the astroid/deltoid/Tusi reductions (sympy-style
  hand expansion); Example 1 (17.12, 36.85 cm); Example 2 table reproduced exactly, backward window
  |t| < 0.352 and 1.40 cm backward per turn; history dates (Roberval 1634 / Torricelli 1644, Wren 1658,
  Huygens 1659 / 1673, Bernoulli 1696); Ṭūsī 13th century.
- 39h3: triple- and five-angle formulas, z⁶ − 1 factorization, cos 72° = (√5 − 1)/4, heptagon roots
  1.2470, −0.4450, −1.8019, chord product n (square, hexagon), Gauss 1796 at age 18.
- SVGs: all 12 rendered; focus–directrix picture verified numerically (focus x = 270, directrix 510,
  vertices 350 and 30, P = (220.5, 54) gives PF/PD = 0.4999); rolling-circle picture (t ≈ 2.2, P,
  rolled arc and arch width 2π·80 consistent); all six label questions' markers sit on the parts named.
- Mermaid: all 7 rendered and readable; accTitle/accDescr describe the whole diagram.
- Drills: each generated 400 times through the app's own `generate`/`checkAll`, answers recomputed
  independently from the shown inputs: correctly rounded answers accepted, wrong ones rejected,
  0 mismatches; no unfilled placeholders or "+ -".
- Glossary: no term or alias duplicates any glossary*.yaml in the course.

## Overlap
39h1 touches orbits; the Module 5 honors lesson 20h2 has Kepler's equation (time along an orbit), a
different topic, so no duplication. 39h3's cos 72° route is the third derivation in the course (08h1
golden triangle, 27h2 sin 18°); the lesson names those and the heptagon cubic is new. 39h2 points back
to 04h2 for the cycloid and does not redefine it. No changes needed.

## Uncertain
- Train-wheel sizes in 39h2 Example 2 are illustrative and labeled as such.
- "Helen of geometers" is presented as a nickname, which is how it is usually reported.

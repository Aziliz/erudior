# Calculus module 11 (calc-m11, parametric and polar), round 2: review

Reviewer pass over the round 2 additions: honors lessons 46h1 and 46h2, the additions to lessons 45 and 46,
`questions/r2-calc-m11.yaml` (40), `drills/r2-calc-m11.yaml` (5), `glossary-r2-calc-m11.yaml` (11),
`cards-r2-calc-m11.yaml` (22), the 8 `images/calc-m11-*` SVGs, 4 Mermaid diagrams and 3 plots.
`content/math/check-module.sh calculus calc-m11`: OK, zero problems after the fixes.

## Changes

**Factual**
- 46h2, "Area, period and the third law": the lesson said $a = 1.496\times10^{11}$ m and $GM = 1.327\times10^{20}$
  m³/s² give 365.26 days. With those rounded inputs $T = 3.1560\times10^7$ s = 365.28 days, so a student checking
  would not get 365.26. Changed to "about 365.3 days (with more precise values of $a$ and $GM$ the result is the
  sidereal year, 365.26 days)". Recomputed in Python; sidereal year 365.256 d, $GM_\odot = 1.32712\times10^{20}$ m³/s²
  (IAU/NASA Sun fact sheet).

**Pictures and plots**
- 46h1 plot (three tracks): the curve label "cycloid" was drawn at the curve's end point, on top of the "end" point
  label. Removed the curve label; added free labels "cycloid", "straight line" and "drop, then slide" placed off
  every line.
- 46h2 plot (conics for e = 0.5, 1, 2): curve labels are drawn at the last computed point, which for the parabola
  and hyperbola is far outside the view, so the "e = 1" and "e = 2" labels never appeared; "focus" sat on the
  parabola. Replaced the curve labels with free labels for all three curves and moved "focus" clear of the curves
  and axis ticks.
- 46h2 plot (equal-area wedges): "perihelion" was cut off at the right edge and ran into the x tick; "Sun" and
  "aphelion" were crossed by wedge edges. Widened x to 2.7 and moved all three to free labels clear of lines.
- `calc-m11-r2-q04` (label, velocity picture): marker 1 (position vector) sat about 10 px from the path as well as
  on the green vector; moved it down the vector to (24.0, 76.8), well away from the path.
  All four SVGs and blank copies rendered and checked; geometry verified (see below).

**Other**
- Glossary `perihelion` / `aphelion`: aliases `periapsis` / `apoapsis` popped up a Sun-only definition; added a
  sentence saying those are the general names for any central body.

No answer-key errors found.

## Checked and right (a reader might doubt)
- Every one of the 40 questions worked independently before reading the key; one defensible answer each;
  distractor explanations name real mistakes. Notably: h03 astroid $12\pi/5$ (and $8\pi/3$ = $2\pi\int\sin^3t\,dt$),
  h19 $a = 9/2$, h21 1.034 / 0.967 / 1.069 (= 1.034²), h23 $12\pi$ uses $\ell = 3$, q08 point $(-\frac14, \frac{\sqrt3}4)$
  at $\theta = 2\pi/3$, q09 $(-2, 4\pi/3) = (1, \sqrt3)$, h28 $r = 4/3, 2, 8/3, 4$.
- Lesson numbers recomputed in Python: $64\pi/3 \approx 67.02$, $32\pi/5 \approx 20.11$, $8\sqrt3\pi \approx 43.53$, descent
  times 1.004 / 1.141 / 1.190 s, $\int_0^{2\pi}(1+e\cos\theta)^{-2}d\theta = 2\pi(1-e^2)^{-3/2}$ (e = 0.2, 0.5, 0.9),
  Example 5 fraction 0.0978, wedge areas 1.2677 / 1.2680 (equal), Halley 75.1 yr / 0.587 AU / 35.0 AU / 59.6.
- Tautochrone proof (arcsine integral) and cycloid speed/slope/cusp limits derived by hand; correct.
- Drills: all five recomputed independently from the prompts (sample instances match); tolerances 0.006 (2 dp),
  0.001 (3 dp), 0.0006 (3 dp) and `sigfigs: 3` all accept correctly rounded answers.
- SVG geometry: rolling circle has $P = C + a(-\sin t, -\cos t)$ for $t \approx 2.1$, arc PT = OT, arch top at $x = \pi a$,
  height $2a$; focus–directrix ellipse is consistent with $e = 0.6$ at V, the far vertex, the center, $b$, and P.
- Mermaid (4): content correct, accTitle/accDescr describe the whole diagram, readable.
- History: Bernoulli's challenge, *Acta Eruditorum*, June 1696; solvers included Jakob Bernoulli, Leibniz, Newton;
  Huygens, *Horologium Oscillatorium* 1673; Kepler 1609 / 1619; *Principia* 1687 (MacTutor; standard histories).
- Earth perihelion 147.1, aphelion 152.1 million km, e = 0.0167 (NASA Earth fact sheet).
- Overlap: no other round 2 lesson in the course covers polar conics, Kepler or the cycloid; calc-m7's Pappus
  honors lesson touches surface area of revolution but not parametric/polar curves.

## Uncertain / for the owner
- Halley's elements differ by source and epoch: NASA NSSDC comet fact sheet gives a = 17.94 AU, e = 0.967,
  q = 0.587 AU, P = 76.1 yr; JPL osculating elements give a ≈ 17.8 AU. The lesson's "a ≈ 17.8 AU, 75.1 yr" is
  internally consistent and it already says the actual return time varies by a few years; left as is.
- The 46h2 Mermaid chart covers only the $1 + e\cos\theta$ form; the table above it covers the others. Fine as is.

Sources: NASA NSSDC Comet Fact Sheet (https://nssdc.gsfc.nasa.gov/planetary/factsheet/cometfact.html); NASA Earth
and Sun fact sheets; OpenStax Calculus Vol. 2 §7.2, §7.4, §7.5.

# Round 2 notes: trig-m9 (Polar coordinates, parametric equations and complex numbers)

`content/math/check-module.sh trigonometry trig-m9`: build and checker report zero problems
(8 lessons, 121 questions, 19 drills, 62 cards).

## Added

**Honors lessons** (3, one per strand of this large five-lesson module; all `honors: true`, `module: trig-m9`)
- `lessons/39h1-polar-conics.md` (trig-m9-h-polar-conics), "Conics in polar form", 45 min, about
  1,760 words of prose. Focus–directrix definition with eccentricity; derivation of
  $r = \tfrac{ed}{1 + e\cos\theta}$ and the four directrix forms; normalizing the denominator; ellipse,
  parabola and hyperbola examples (the hyperbola's far vertex has $r < 0$); $ed = a(1 - e^2)$ and
  $a(1 \mp e)$; rotated conics ($\theta - \alpha$); orbits (Kepler's first law, Halley's comet, Earth).
  5 worked examples, focus–directrix SVG, Mermaid "identify a polar conic" chart, plot of the
  $e = 0.5, 1, 2$ family.
- `lessons/39h2-cycloids.md` (trig-m9-h-cycloids), "Cycloids and rolling curves", 45 min, about
  1,910 words. Derivation of the cycloid from arc length and vector addition; arch size and cusps;
  trochoids (the train flange that moves backward, with a table); epicycloids and hypocycloids
  derived by matching arcs; the cardioid as an epicycloid (connects to Lesson 36), the astroid via
  triple-angle formulas, the deltoid and the Tusi couple; a short history (area, arc length,
  tautochrone, brachistochrone). 4 worked examples, rolling-wheel SVG, 4 plots.
- `lessons/39h3-roots-of-unity.md` (trig-m9-h-roots-of-unity), "De Moivre's theorem at work:
  identities and roots of unity", 50 min, about 2,030 words. Multiple-angle formulas by expanding
  $(c + is)^n$ (triple angle, then $\cos 5\theta$ and $\sin 5\theta$); primitive roots and conjugate
  pairs; the sum of the roots of unity is 0 (rotation and geometric-series proofs); all roots of
  $c$ as one root times the roots of unity; factoring $z^n - 1$ into real quadratics; $\cos 72^\circ$
  from $w = z + z^{-1}$; the heptagon cubic $w^3 + w^2 - 2w - 1 = 0$ and why the 7-gon is not
  constructible (Wantzel, Gauss's 17-gon); the product of a polygon's chords from one corner is $n$.
  7 worked examples, Mermaid derivation chart, fifth-roots plot.

Overlap check: the Module 1 honors lesson (04h2) already introduces the cycloid in words and
defines it in its glossary, so 39h2 points back to it and does not redefine the term. The Module 6
honors lesson (27h2) builds Chebyshev polynomials by recursion and gets $\sin 18^\circ$, and the
Module 2 honors lesson (08h1) gets $36^\circ$ from a golden triangle. So 39h3 uses De Moivre for the
derivation, works $\cos 5\theta$ / $\sin 5\theta$ (not the same numbers as 27h2), presents
$\cos 72^\circ$ as a third route that names those lessons, and makes the heptagon the new result.
The Module 5 honors lesson's Kepler's equation and the trig-h1 lessons (robot arms, phasors,
Snell's law, great circles) do not overlap with 39h1.

**Core lessons** (additions only, each introduced by a sentence)
- 35: labeled polar-parts SVG (pole, polar axis, r, θ, x and y legs); Mermaid chart for choosing θ
  by quadrant.
- 36: six-panel gallery SVG (circle, cardioid, inner-loop limaçon, 3- and 4-petal roses,
  lemniscate); Mermaid "recognize the polar graph" chart.
- 37: Mermaid "which way to eliminate the parameter" chart; labeled projectile SVG.
- 38: labeled complex-plane SVG (axes, z, conjugate, modulus, argument); Mermaid "a + bi to
  trigonometric form" chart; plot for Example 7 (rotating 3 + i).
- 39: Mermaid "finding the n nth roots" chart; plot of the solutions of $z^4 = -16$ (Example 6).

**Pictures** (12 SVGs in `images/`, original, 3–8 KB except the six-panel gallery at 32–34 KB, all rendered and checked, label markers
checked on the blanks): trig-m9-polar-parts(-blank), trig-m9-polar-gallery(-blank),
trig-m9-projectile-parts(-blank), trig-m9-complex-plane(-blank), trig-m9-focus-directrix(-blank),
trig-m9-rolling-circle(-blank).

**Diagrams**: 7 Mermaid (5 core, 2 honors), all `flowchart TD` with accTitle/accDescr, rendered.
New plots: 8 (2 core, 6 honors), rendered through the app's figure code and looked at.

**Questions** (65, `questions/r2-trig-m9.yaml`)
- Core trig-m9-r2-q01…q25, 5 per lesson. Lessons 35–38: one each of text, label, select-all,
  match, order. Lesson 39: 2 text, select-all, match, order. module_quiz: q01, q03, q06, q08, q11,
  q13, q16, q18, q21, q23 (2 per lesson).
- Honors h01–h13 (polar conics: 8 MC, 2 text, select-all, order, label), h14–h27 (cycloids: 8 MC,
  2 text, match, select-all, order, label), h28–h40 (roots of unity: 8 MC, 2 text, select-all,
  order, match). MC answer positions 2/2/2/2 in each honors lesson. No module_quiz (core-module
  honors).

**Drills** (6, `drills/r2-trig-m9.yaml`): trig-m9-r2-polar-conic, trig-m9-r2-orbit (39h1);
trig-m9-r2-cycloid-point, trig-m9-r2-roulette (39h2); trig-m9-r2-five-angle,
trig-m9-r2-unity-factor (39h3). Each generated 400 times and re-solved independently from the
inputs: 0 mismatches; correctly rounded answers (2 or 4 decimals) were accepted every time and a
wrong answer rejected. Tolerances are half the last place or more; fraction answers use
`kind: fraction`.

**Glossary** (16, `glossary-r2-trig-m9.yaml`, checked against every glossary*.yaml in the course):
focus, directrix, eccentricity, conic section, perihelion, aphelion, cusp, trochoid, epicycloid,
hypocycloid, astroid, deltoid, tautochrone, brachistochrone, primitive root of unity, conjugate
pair. (cycloid already defined in glossary-r2-trig-m1.yaml.)

**Cards** (34, `cards-r2-trig-m9.yaml`): 11 polar conics, 12 rolling curves, 11 roots of unity.

## For a reviewer to double-check
- 39h2 Example 2 uses illustrative train-wheel sizes (rolling radius 0.46 m, flange 3 cm deeper),
  labeled as such; the backward-motion claim "exactly while below the rail top" uses $dx/dt = a - b\cos t$,
  stated as a calculus fact.
- 39h2 history: area 3πa² (Roberval 1634, Torricelli published 1644, given as "1630s–1640s"), arc
  length 8a (Wren, 1658), tautochrone (Huygens, found 1659, published 1673), brachistochrone
  (Johann Bernoulli, 1696). The "Helen of geometers" nickname is given as a nickname, not a quote.
- 39h3: Wantzel's 1837 theorem is quoted without proof, as in 27h2; "first new constructible
  polygon since ancient Greece" for Gauss's 17-gon is the standard phrasing.
- 39h1 orbit values are rounded: Halley a ≈ 17.8 AU, e ≈ 0.967 (perihelion 0.59 AU, aphelion
  35.0 AU from these; published aphelion 35.1 AU); Earth e ≈ 0.0167.
- The circle (e = 0) is described as a limiting case outside the polar-conic family.

## Errors found in existing content
None in trig-m9's existing lessons, questions, drills, cards or glossary.

## Sources
- Wikipedia, "Cycloid" (history: Bovelles, Galileo, Roberval 1634, Torricelli 1644, Wren and
  Pascal's 1658 contest, Bernoulli 1696).
- Wikipedia (archived copy), "Halley's Comet" orbital elements: a 17.8 AU, e 0.967, q 0.586 AU,
  Q 35.1 AU.
- Standard results (focus–directrix conics, cycloid/epicycloid/hypocycloid equations, roots of
  unity, Wantzel's theorem) were re-derived and every number recomputed in Python/sympy.

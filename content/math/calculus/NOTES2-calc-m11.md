# Calculus module 11 (calc-m11, parametric and polar), round 2: writer notes

## Added

**Honors lessons (2)**
- `lessons/46h1-cycloid-surface.md`: calc-h-cycloid-surface, "Surfaces from parametric curves, and the
  fastest slide", 45 min, about 2,000 words. Surface area for parametric curves ($2\pi\int y\,ds$, about
  either axis) and polar curves ($2\pi\int r\sin\theta\,ds$), with the two conditions (radius never negative,
  nothing traced twice); the cycloid derived from a rolling wheel (speed $2a|\sin\frac t2|$, slope
  $\cot\frac t2$, vertical tangents at the cusps, rim point at rest at contact); the brachistochrone (Johann
  Bernoulli 1696) with $T = \int ds/v$ and $v = \sqrt{2gh}$; the tautochrone (Huygens 1673) proved with an
  arcsine integral. 5 worked examples: sphere (parametric), rotated cycloid arch $64\pi/3$, rotated upper
  cardioid $32\pi/5$, three tracks compared (cycloid 3.142, drop-then-slide 3.571, straight line 3.724, in
  units of $\sqrt{a/g}$), equal-time proof.
- `lessons/46h2-polar-conics-kepler.md`: calc-h-polar-conics, "Conics in polar form and Kepler's laws",
  50 min, about 2,000 words. Focus–directrix definition, derivation of $r = ed/(1 + e\cos\theta)$, table of
  the four directrix positions, shape from the denominator (asymptote directions, negative $r$ for the far
  branch), ellipse measurements ($r_{\min}$, $r_{\max}$, $a$, $b$, $c$, semi-latus rectum, $r = a(1 - e^2)/(1 + e\cos\theta)$),
  Kepler's laws (1609/1619, Newton 1687), the second law as $dA/dt = \frac12r^2\,d\theta/dt$, perihelion/aphelion
  speed ratio $(1 + e)/(1 - e)$, ellipse area via the polar integral, period $2\pi ab/h$ and the third law
  using $h^2 = GM\ell$ (stated, not derived). 5 worked examples: ellipse $6/(2 + \cos\theta)$, hyperbola
  $4/(1 + 2\cos\theta)$, Earth, Halley's comet, time fraction on part of an orbit.

**Core lesson additions (additions only)**
- 45-parametric: Mermaid "classify the tangent at $t_0$" decision chart; SVG `calc-m11-velocity.svg`
  (position vector, velocity vector, its components) with an intro sentence; Mermaid chart of how
  position, velocity, acceleration, speed, displacement and distance are related.
- 46-polar: SVG `calc-m11-polar-point.svg` (pole, polar axis, r, θ, x = r cos θ, y = r sin θ) with two
  sentences naming the pole and polar axis; Mermaid procedure for the area between two polar curves.

**Pictures (8 SVGs in `images/`, all original, drawn by script and previewed)**: calc-m11-velocity (+ -blank),
calc-m11-polar-point (+ -blank), calc-m11-rolling-circle (+ -blank, 46h1), calc-m11-focus-directrix
(+ -blank, 46h2). All under 7 KB; label markers previewed on every blank copy.

**Mermaid diagrams (4)**: two in lesson 45, one in lesson 46, one in 46h2 (classify a conic by $e$). All
rendered and checked; each has accTitle/accDescr.

**Plots (3, in the honors lessons)**: three descent tracks (46h1); conics $r = 2/(1 + e\cos\theta)$ for
$e = 0.5, 1, 2$ (46h2); equal-area wedges at perihelion and aphelion for $e = 0.4$ (wedge angles solved
numerically so the areas match, 1.2677 each).

**Questions (`questions/r2-calc-m11.yaml`, 40)**
- Core (10): lesson 45: q01 text, q02 order, q03 select-all, q04 label, q05 match; lesson 46: q06 label,
  q07 text (two blanks), q08 order, q09 select-all, q10 match. `module_quiz: true` on q01, q04, q06, q09.
- Honors 46h1 (h01–h15): 9 multiple choice, 2 text, 1 order, 1 match, 1 select-all, 1 label.
- Honors 46h2 (h16–h30): 9 multiple choice, 2 text, 1 match, 1 order, 1 select-all, 1 label.
- Honors questions carry no `module_quiz`. Answer positions of the 18 single-answer honors questions:
  0→4, 1→5, 2→5, 3→4.

**Drills (`drills/r2-calc-m11.yaml`, 5)**: calc-m11-r2-param-surface (numeric surface area, 2 dp,
tolerance 0.006), calc-m11-r2-cycloid-time (cycloid and ramp times, 3 s.f. via `sigfigs`) for 46h1;
calc-m11-r2-polar-conic (e, r_min, r_max, a; 3 dp, tolerance 0.001), calc-m11-r2-orbit (perihelion, aphelion,
period, speed ratio; 3 s.f.), calc-m11-r2-kepler-time (fraction of period, 3 dp, tolerance 0.0006) for 46h2.
No new core drills (the core lessons already have five).

**Glossary (`glossary-r2-calc-m11.yaml`, 11)**: brachistochrone, tautochrone, focus, directrix,
eccentricity, conic section, semi-major axis, semi-latus rectum, perihelion, aphelion, Kepler's laws.
Every glossary file in the course was checked for duplicate terms and aliases before and after (none).
"cycloid", "surface area of revolution" and the alias "cusp" already exist, so they are not re-bolded or redefined.

**Cards (`cards-r2-calc-m11.yaml`, 22)**: 11 for 46h1 (topics Parametric surface area, Cycloid descent),
11 for 46h2 (Polar conics, Kepler's laws).

`content/math/check-module.sh calculus calc-m11`: OK, zero problems (4 lessons, 67 questions, 10 drills).

## For a reviewer
- All numbers were recomputed in Python (sympy/scipy): $64\pi/3$, $32\pi/5$, $12\pi/5$ (astroid), descent
  times 1.004 / 1.141 / 1.190 s for $a = 1$ m, the tautochrone time from five starting points (numerical
  integration), $\int_0^{2\pi}(1 + e\cos\theta)^{-2}d\theta = 2\pi(1 - e^2)^{-3/2}$ for three values of $e$,
  Earth's period 365.26 days from $a = 1.496\times10^{11}$ m and $GM_\odot = 1.327\times10^{20}$ m³/s², Halley
  75.1 yr / 0.59 AU / 35.0 AU / ratio ≈ 60, and the Example 5 fraction 0.098.
- The drop-then-slide track assumes the corner is rounded with no speed lost; this idealization is stated
  in the lesson and in question h12.
- The brachistochrone's optimality is stated, not proved (calculus of variations is flagged as beyond the
  course). $h^2 = GM\ell$ is stated without derivation, and the lesson says Kepler's laws are excellent
  approximations, not exact, because of planetary perturbations.
- Rounded astronomical values: Earth 147.1 / 152.1 million km, $e \approx 0.0167$; Halley $a \approx 17.8$ AU,
  $e \approx 0.967$, last perihelion 1986. Worth a glance against a current ephemeris source.
- Glossary aliases "focus", "foci", "conic" and "conics" are broad; if a later writer in this course adds a
  different "focus" (e.g. optics), keep one entry.
- Plot curves for the parabola and the hyperbola's far branch run past the view and rely on the
  renderer's clipping (the checker rendered them without problems).

## Errors found in existing content
None in lessons 45–46, questions/m11.yaml or drills/m11.yaml. (Not an error, but PROGRESS.md's outline
numbers these lessons 43 and 44 while the files are 45 and 46; left alone, as PROGRESS.md is shared.)

## Sources
Written from standard references as remembered (no web lookups were made in this pass, so the dates and rounded constants above deserve a spot-check): OpenStax Calculus Volume 2 (§7.2
parametric calculus and surface area, §7.4 polar area and arc length, §7.5 conic sections); Paul's Online
Notes, Calculus II (parametric and polar surface area); the NASA planetary fact sheets and JPL small-body data
(Earth's orbit, the Sun's GM, Halley's comet elements); histories of the brachistochrone (Bernoulli, *Acta Eruditorum*, June 1696)
and of Huygens's *Horologium Oscillatorium* (1673); Kepler's *Astronomia Nova* (1609) and *Harmonices
Mundi* (1619); Newton's *Principia* (1687). All explanations, examples, questions and drawings are original.

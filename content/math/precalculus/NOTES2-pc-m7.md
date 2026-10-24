# Round 2 notes: module pc-m7 (Conics, parametric equations and polar coordinates)

`content/math/check-module.sh precalculus pc-m7`: build and checker report zero problems
(9 lessons, 147 questions, 20 drills, 59 cards).

## Added

**Honors lessons** (3, since the module has 6 core lessons and three distinct topics worth more depth)
- `lessons/33h1-rotation-of-axes.md` (pc-m7-h-rotation, "Rotation of axes", 45 min, ~1,730 words):
  derivation of the rotation formulas from polar coordinates, A′/B′/C′/D′/E′/F′ formulas, where
  cot 2θ = (A − C)/B comes from, cos 2θ → half-angle formulas, invariants A + C and B² − 4AC (why the
  discriminant test works), the eigenvalue shortcut (A′, C′ as roots of λ² − (A + C)λ + AC − B²/4,
  A′ − C′ has the sign of B), a labeled-as-simplified note on eigenvalues. Examples: 5x² − 6xy + 5y² = 8
  (45°), 8x² + 12xy + 17y² = 20 (≈63.4°), x² + 4xy − 2y² = 6 via invariants, and the parabola
  x² + 2xy + y² − 8x + 8y = 0 with its focus (1, −1) rotated back.
- `lessons/33h2-conic-geometry.md` (pc-m7-h-conic-geometry, "Why the definitions agree: Dandelin
  spheres and reflection", 45 min, ~1,890 words): history timeline (Menaechmus, Apollonius, Pappus,
  Kepler's "focus", Dandelin 1822), Dandelin-sphere proof of the sum property, sketch of the directrix
  and e = cos β / cos α (labeled a sketch), ellipse focal radii a ± ex₀ and directrix x = a/e, proof of
  the parabola's reflective property with the double-root tangent and the isosceles triangle, Heron
  shortest-path argument for the ellipse, hyperbola property, applications (whispering gallery,
  lithotripsy, Cassegrain telescope). Examples: focal radii of (3, 12/5) on x²/25 + y²/9 = 1; tangent
  to x² = 8y at (8, 8); dot-product check of equal angles (both ≈ 43.2°).
- `lessons/33h3-orbits.md` (pc-m7-h-orbits, "Orbits and Kepler's laws", 45 min, ~1,560 words):
  r = a(1 − e²)/(1 + e cos θ), perihelion/aphelion a(1 ∓ e) and the reverse formulas, Kepler's three
  laws, speed ratio v_p/v_a = (1 + e)/(1 − e) from equal areas, T² = a³ (labeled a simplification of
  Newton's form), planet table, Hohmann transfer to Mars (≈259 days, labeled simplified), parabolic
  and hyperbolic paths ('Oumuamua). Examples: Earth, Mars at θ = 90°, Halley, a comet from q and Q,
  Earth–Mars transfer.

**Core lessons 28–33**: additions only (pictures/diagrams with a sentence or two of introduction).
- 28: cone-slices SVG (with a short paragraph explaining the four cuts), labeled parabola SVG,
  "equation → vertex, focus, directrix" Mermaid flowchart, dish/reflection SVG.
- 29: labeled ellipse SVG, "reading an ellipse equation" Mermaid decision chart.
- 30: labeled hyperbola SVG, "identify a conic" Mermaid decision chart (xy term / discriminant /
  signs), plus one sentence on degenerate cases.
- 31: "how to eliminate the parameter" Mermaid chart, plot of the segment x = 1 + 4t, y = 2 − 6t with
  t = 0, ¼, ½, ¾, 1 marked.
- 32: "rectangular → polar quadrant check" Mermaid chart (with one sentence on the arctan range),
  polar-curve gallery SVG.
- 33: "reading a polar conic" Mermaid chart, plot of r = 2e/(1 + e cos θ) for e = ½, 1, 2 with the
  same focus and directrix, orbit SVG.

**Pictures** (17 SVGs, original, 1.4–20 KB, all rendered and looked at; blanks checked with markers):
pc-m7-cone-slices(+blank), pc-m7-parabola-parts(+blank), pc-m7-dish, pc-m7-ellipse-parts(+blank),
pc-m7-hyperbola-parts(+blank), pc-m7-polar-gallery(+blank), pc-m7-orbit(+blank), pc-m7-rotated-axes,
pc-m7-dandelin(+blank), pc-m7-kepler-areas. The Dandelin figure is computed (tangent lengths checked
numerically equal to the focal distances); the Kepler-areas figure solves Kepler's equation so the two
wedges are swept in equal times (areas 6.999 and 7.000).

**Diagrams**: 9 Mermaid (6 in core lessons, 3 in honors: rotation procedure, conics history timeline,
Kepler/Newton timeline), all with accTitle/accDescr, all rendered. 2 new ```plot figures.

**Questions** (71 new, `questions/r2-pc-m7.yaml`)
- Core pc-m7-r2-q01…q31 (31; 5–6 per lesson; each lesson has a text, an order or match, a select-all,
  and a label where there is a picture): label 6 (q01, q06, q07, q12, q22, q27), text 6 (q02, q08,
  q13, q17, q23, q28), order 6 (q03, q09, q16, q18, q24, q31), match 6 (q05, q11, q15, q20, q26,
  q29), select-all 6 (q04, q10, q14, q19, q25, q30), MC 1 (q21).
  module_quiz: q01, q05, q07, q10, q12, q15, q19, q20, q22, q25, q28, q29 (2 per lesson).
- Honors pc-m7-r2-h01…h13 (rotation: 8 MC, 2 text, 1 order, 1 match, 1 select-all),
  h14…h26 (geometry: 8 MC, 1 label, 1 order, 1 text, 1 select-all, 1 match),
  h27…h40 (orbits: 9 MC, 2 text, 1 match, 1 order, 1 select-all). No module_quiz (core-module honors).
- Answer positions of the 26 four-choice MC questions: 0: 6, 1: 6, 2: 7, 3: 7.

**Drills** (7, `drills/r2-pc-m7.yaml`): pc-m7-r2-rotation-angle (θ to 1 dp, tolerance 0.06),
pc-m7-r2-rotated-coefs (integer A′, C′; built backward from A′, C′ so cot 2θ = ±3/4; checked for all
inputs), pc-m7-r2-focal-radii (tolerance 0.006 for 2 dp), pc-m7-r2-parabola-tangent,
pc-m7-r2-apsides, pc-m7-r2-orbit-from-apsides (e to 3 dp, tolerance 0.0006),
pc-m7-r2-kepler-period (2 dp, tolerance 0.006).

**Glossary** (17 terms, `glossary-r2-pc-m7.yaml`, checked against every glossary*.yaml, no clashes;
"period" and "principal" already exist, so I used "orbital period" and avoided "principal axes"):
rotation of axes, rotation formulas, invariants, generator, nappes, Dandelin spheres, focal radii,
reflective property, Kepler's first/second/third law, semi-major axis, astronomical unit (AU),
perihelion, aphelion, orbital period, Hohmann transfer orbit.

**Cards** (30, `cards-r2-pc-m7.yaml`, 10 per honors lesson, topics Rotation of axes / Geometry of
conics / Orbits).

## For a reviewer to double-check
- Polar-gallery and other label markers sit on the curves/parts (previewed with markers); the
  ellipse focus/vertex markers are about 50 px apart.
- 33h2 directrix argument (e = cos β / cos α) is presented as a sketch; the angle convention is "β =
  angle between plane and axis".
- 33h3 astronomy values: Earth e ≈ 0.0167 (q 0.983, Q 1.017 AU; 147.1/152.1 million km), Mars a ≈ 1.524,
  e ≈ 0.0934, Halley a ≈ 17.8, e ≈ 0.967, 'Oumuamua e ≈ 1.2, Hohmann 1925, Kepler 1609/1619, Newton
  1687. Mars-mission duration phrased loosely ("roughly six to ten months").
- 33h2 history: Menaechmus "traditionally credited"; Pappus "early 300s AD"; Kepler "focus" 1604.
- Lesson 33 plot labels for e = ½, 1, 2 placed by calculation (not visually previewed: ```plot blocks
  have no standalone preview); the checker renders them without error.

## Errors found in existing content
None. No existing question, drill, card or glossary entry was edited.

## Sources
Standard results (rotation of axes, invariants, Dandelin spheres, reflective properties, Kepler's
laws) written from first principles and verified with sympy/Python (every example and question
recomputed). Historical and astronomical figures are standard values (NASA planetary fact sheets for
a, e and periods; usual history-of-mathematics attributions for Menaechmus, Apollonius, Pappus,
Kepler 1604, Dandelin 1822, Hohmann 1925); not re-fetched in this session.

# Round 2 notes: geo-m9 (Coordinate geometry and transformations)

`content/math/check-module.sh geometry geo-m9`: build and checker report zero problems
(7 lessons, 110 questions, 20 drills, 52 cards).

## Added

**Honors lessons** (3: the module has three separate strands, coordinates/rigid motions,
dilations/symmetry and conics, each with a natural honors step)
- `lessons/38h1-isometries-symmetry-groups.md` (geo-h-isometries, "Reflections as building blocks;
  symmetry groups", 45 min, ~2,050 words): three noncollinear points determine an isometry (proof);
  every isometry is at most three reflections (proof); two reflections = translation by twice the
  gap or rotation by twice the angle (coordinate/polar-angle proofs); orientation, direct and
  opposite isometries, table of the five kinds with fixed points; reflect-then-translate gives a
  reflection or a glide reflection; symmetry groups, rectangle worked out; Leonardo's theorem with
  a proof sketch; frieze and wallpaper patterns mentioned. Examples: two mirrors through the origin
  (both orders), reflect-then-translate, the rectangle's group, naming groups (pentagon, Z, H,
  pinwheel).
- `lessons/38h2-transformation-matrices.md` (geo-h-matrices, "Rotations by any angle and
  transformation matrices", 45 min, ~1,770 words): images of (1, 0) and (0, 1), rotation by any
  angle, 2×2 matrices (columns = images of the basis points), table of matrices, reflection in a
  line through the origin and in y = mx, composition as multiplication (order), angle-addition
  formulas from R_α R_β = R_(α+β), determinant as area factor and orientation. Examples: 30°
  rotation of (4, 1); 60° rotation about (1, 2); reflecting (5, 5) in y = 2x; reflect-then-rotate
  both orders (matches Lesson 37 Example 3); area of an image under a non-similarity.
- `lessons/38h3-ellipses-hyperbolas.md` (geo-h-conics, "Ellipses and hyperbolas from their foci",
  45 min, ~1,700 words): ellipse definition, parts, b² = a² − c² from the co-vertex triangle,
  derivation of the equation, vertical/translated ellipses, eccentricity, Kepler, reflection
  property; hyperbola definition, equation, asymptotes, up-down form; focus–directrix definition
  with e (stated without proof). Examples: ellipse from foci; reading a translated vertical
  ellipse; hyperbola from foci with a check point; locating a ship from a time difference.

**Core lessons 35–38** (additions only, nothing rewritten; a sentence of lead-in where needed):
- 35: quadrilateral-classification flowchart (Mermaid), plot of the Example 3 square, labeled SVG
  of the hypotenuse-midpoint coordinate proof (Example 5).
- 36: labeled reflection SVG (perpendicular bisector, orientation reversal), plot of Example 2(b)
  (reflection in y = x), "rotate about C" procedure (Mermaid).
- 37: dilation SVG (center, rays, k = 2.5), four-kinds-of-rigid-motion flowchart (Mermaid,
  orientation × fixed points), plot of Example 4 (two parallel mirrors).
- 38: labeled parabola-parts SVG, focus/directrix-from-vertex-form procedure (Mermaid), plot of
  Example 3 (translate then dilate a circle).

**Pictures** (13 original SVGs, each under 4 KB, all rendered and looked at; blank copies checked
with their markers): geo-m9-hypotenuse-midpoint (+ -blank), geo-m9-reflection (+ -blank),
geo-m9-dilation (+ -blank), geo-m9-parabola-parts (+ -blank), geo-m9-two-reflections (+ -blank),
geo-m9-rosettes, geo-m9-ellipse-parts (+ -blank).

**Diagrams** (7 Mermaid, all with accTitle/accDescr, rendered): quadrilateral classification (35),
rotating about a center (36), four kinds of rigid motion (37), focus and directrix from
y = a(x − h)² + k (38), Leonardo's theorem (38h1), which matrix is rigid (38h2), conics by
eccentricity (38h3). Plus 7 new ```plot figures (one per core lesson, two in 38h2, one in 38h3),
rendered with src/lib/figure.ts and checked.

**Questions** (64, `questions/r2-geo-m9.yaml`)
- Core geo-m9-r2-q01…q21 (5 per lesson; 38 has 6): text 4 (q01, q06, q11, q16), match 4 (q02,
  q10, q12, q20), select-all 4 (q03, q08, q13, q18), label 4 (q04, q09, q14, q19), order 2 (q07,
  q17), MC 3 (q05, q15, q21). module_quiz: q01, q03, q06, q10, q11, q12, q17, q20 (2 per lesson).
- Honors geo-m9-r2-h01…h15 (isometries: 8 MC, 1 text, 1 order, 2 match, 2 select-all, 1 label),
  h16…h29 (matrices: 9 MC, 2 text, 1 select-all, 1 match, 1 order), h30…h43 (conics: 7 MC,
  2 text, 1 label, 2 select-all, 1 match, 1 order). No module_quiz (core-module honors lessons).
- Answer positions of the 27 four-choice MC questions: 0: 7, 1: 6, 2: 7, 3: 7.

**Drills** (8, `drills/r2-geo-m9.yaml`): geo-m9-r2-two-mirrors, geo-m9-r2-mirror-shift (38h1);
geo-m9-r2-rotate-angle, geo-m9-r2-matrix-image, geo-m9-r2-det-area (38h2); geo-m9-r2-ellipse,
geo-m9-r2-ellipse-eq, geo-m9-r2-hyperbola (38h3). Rounded answers: rotate-angle asks for 2
decimals with tolerance 0.01; the hyperbola slope accepts a fraction or 2 decimals (tolerance
0.006, worst rounding error 0.0033). Ellipse/hyperbola drills use the triples (5, 4, 3),
(10, 8, 6), (13, 12, 5) so every answer is a whole number.

**Glossary** (22 terms, `glossary-r2-geo-m9.yaml`; checked against every glossary*.yaml in the
course, no duplicate terms or aliases): fixed point, orientation, direct isometry, opposite
isometry, symmetry group, cyclic group, dihedral group, Leonardo's theorem, frieze pattern,
matrix, rotation matrix, linear transformation, determinant, conic section, ellipse, major axis,
minor axis, vertices of an ellipse, co-vertex, eccentricity, hyperbola, asymptote. Every bolded
term in the honors lessons has an entry (other bold text is step labels and "Common mistakes"
headings).

**Cards** (31, `cards-r2-geo-m9.yaml`): 12 isometries/symmetry groups, 9 matrices, 10 conics.

## For a reviewer to double-check
- 38h1: the reduction of three reflections to a reflection or glide reflection is stated, labeled
  as skipped ("takes a longer argument"); the rest of the classification is proved.
- 38h1: Leonardo's theorem is stated for bounded figures with finitely many symmetries; the name
  is attributed to Hermann Weyl's *Symmetry* (1952), and the wallpaper count to Fedorov (1891).
- 38h1 Example 4 / h11 / h14: letter symmetries (Z, H, S, N as C2/D2) assume ordinary sans-serif
  letter shapes.
- 38h2: cos and sin beyond 90° are introduced as the unit-circle definition (the course only
  defined right-triangle ratios before); the y = mx reflection formulas are quoted from
  double-angle identities, with a check for m = 1.
- 38h3: the focus–directrix definition with eccentricity e is stated without proof; the circle
  is called the limiting case e = 0. Facts: Earth's orbital e ≈ 0.017, Halley's comet ≈ 0.97,
  Kepler 1609, Apollonius about 200 BC, LORAN from World War II until satellite navigation,
  radio speed "about 300,000 km per second".
- The existing glossary entry for **focus** is parabola-specific; 38h3 does not bold "foci", so it
  doesn't pop up there. Not changed (it is not wrong for the core lesson).
- Label markers: in geo-m9-ellipse-parts-blank the focus and vertex markers are on opposite sides
  (right focus, left vertex) so they don't overlap.

## Errors found in existing content
None. No existing question, drill, card or glossary entry was changed.

## Sources
Standard results; checked against OpenStax *Precalculus* 2e (ch. 8 Analytic Geometry: ellipse,
hyperbola, conics in polar form / eccentricity), OpenStax *Algebra and Trigonometry* (rotation
of axes), Weyl, *Symmetry* (1952) on Leonardo's theorem, Coxeter, *Introduction to Geometry*
(isometries as products of reflections, frieze patterns), NASA planetary and comet fact sheets
(Earth's and Halley's eccentricities). All numbers recomputed in Python (sympy).

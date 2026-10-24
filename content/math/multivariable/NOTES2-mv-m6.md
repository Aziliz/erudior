# Round 2 notes: module mv-m6 (Triple integrals and change of variables)

`content/math/check-module.sh multivariable mv-m6`: build and checker report zero problems
(6 lessons, 93 questions, 14 drills, 37 cards).

## Added

**Honors lessons** (`honors: true`, module mv-m6)
- `lessons/28h1-moments-of-inertia.md` (mv-m6-h-moments-of-inertia, "Moments of inertia of solids",
  45 min, ~1,600 words): I = ∭d²δ dV from rotational kinetic energy; radius of gyration; solid
  cylinder (½ma²); solid ball (⅖ma²) via the I_x + I_y + I_z symmetry trick; thin shell (⅔ma²) by
  differentiating I and m in a; table (hoop, cone 3/10, box); parallel axis theorem with proof;
  rolling race v = √(2gh/(1+β)) (labeled an idealization); Earth's moment of inertia factor 0.3307;
  ball with linearly decreasing density (4/15). 5 worked examples. Density written δ (ρ is taken
  by spherical coordinates). Fills the "solid moments of inertia / radius of gyration" gap in VERIFY.md.
- `lessons/28h2-designing-coordinates.md` (mv-m6-h-designing-coordinates, "Designing coordinates:
  ellipsoids, tori and higher dimensions", 45 min, ~1,800 words): linear maps (|det A|), ellipsoid
  volume and I_z = m(a²+b²)/5, a box slanted by three pairs of planes; Jacobians of compositions
  multiply, deriving ρ² sin φ as (polar factor ρ)·(cylindrical factor r); toroidal coordinates,
  torus volume 2π²Ra², Pappus's centroid theorem; n-ball volumes by scaling and the recursion
  V_n = (2π/n)V_{n−2}, V_4 = π²a⁴/2, peak at n = 5, volume near the surface 1 − (1−ε)ⁿ. 5 worked examples.

**Core lessons 25–28** (additions only, nothing rewritten)
- 25: setup flowchart (Mermaid); tetrahedron with exploded shadow and the inner z-segment (SVG).
- 26: labeled cylindrical-coordinates picture (SVG); setup checklist (Mermaid).
- 27: labeled spherical-coordinates picture (SVG); "which coordinates" decision chart (Mermaid).
- 28: uv-rectangle → curved patch with r_u Δu, r_v Δv (SVG); change-of-variables procedure (Mermaid).

**Pictures** (13 original SVGs, 2–8 KB each, all rendered and checked; blanks for label questions):
mv-m6-tetra-slice(+blank), mv-m6-cyl-point(+blank), mv-m6-sph-point(+blank),
mv-m6-jacobian-map(+blank), mv-m6-parallel-axis(+blank), mv-m6-rolling-race,
mv-m6-torus-section(+blank). Also a ```plot bar chart of unit n-ball volumes (h2).

**Diagrams** (5 Mermaid, all with accTitle/accDescr, rendered): lessons 25, 26, 27, 28 and the
spherical-as-composition chain in 28h2.

**Questions** (49, `questions/r2-mv-m6.yaml`)
- Core mv-m6-r2-q01…q20 (5 per lesson): text 4 (q01, q06, q11, q16), order 2 (q02, q15),
  match 4 (q05, q07, q12, q17), select-all 4 (q03, q08, q13, q18), label 4 (q04, q09, q14, q19),
  MC 2 (q10, q20). module_quiz: q01, q03, q06, q13, q16, q18.
- Honors moments of inertia h01…h15 (15): 8 MC, 3 text, 1 order, 1 match, 1 select-all, 1 label.
- Honors designing coordinates h16…h29 (14): 8 MC, 2 text, 1 order, 1 match, 1 select-all, 1 label.
- Answer positions of the 18 four-choice MC: 0: 5, 1: 4, 2: 5, 3: 4.

**Drills** (6, `drills/r2-mv-m6.yaml`): mv-m6-r2-moi-solid, mv-m6-r2-parallel-axis,
mv-m6-r2-rolling (h1); mv-m6-r2-ellipsoid, mv-m6-r2-planes-volume, mv-m6-r2-torus (h2).
2-decimal answers use tolerance 0.005; I answers use sigfigs 3; the planes drill is an exact fraction.

**Glossary** (8, `glossary-r2-mv-m6.yaml`, checked against every glossary*.yaml): parallel axis
theorem, radius of gyration, rolling without slipping, moment of inertia factor, torus, toroidal
coordinates, Pappus's centroid theorem, n-ball. ("moment of inertia" already exists.)

**Cards** (21, `cards-r2-mv-m6.yaml`): 11 Moments of inertia, 10 Custom coordinates.

## Error fixed in existing content
- `drills/m6.yaml` mv-d-sph-ball: prompt asks for 2 decimals but used `relTolerance: 0.001`, which
  rejected correctly rounded answers for a = 1, n = 2, 3, 4 (e.g. 4π/7 = 1.7952 → 1.80 is off by
  0.0048 > 0.0018). Changed to `tolerance: 0.005`. (mv-d-cyl-integral has the same pattern but all
  its inputs pass; checked.)

## For the reviewer
- "Toroidal coordinates" is also the name of a different (bipolar-based) system; the lesson says so.
- Earth's factor 0.3307 from the Wikipedia "Moment of inertia factor" table; the claim that it is
  measured from precession and the gravity field is stated generally.
- Pappus (about AD 300) and Guldin ("rediscovered in the 1600s") dates are general.
- Rolling race assumes rigid bodies, no slipping, no drag or rolling resistance (stated in lesson).
- All numbers recomputed with sympy (I for cylinder, ball, shell, cone, box, linear-density ball;
  rolling speeds; ellipsoid integrals; slanted box 3 and 9/2; toroidal Jacobian; torus 2π²Ra²;
  Pappus triangle 16π; V_1…V_12; shell fractions; every question's key and distractors).

## Sources
- Wikipedia, "Moment of inertia factor" (Earth 0.3307, Moon 0.393, uniform sphere 0.4).
- Standard results (moments of inertia, parallel axis theorem, Pappus, n-ball recursion) derived in
  the lessons and checked symbolically.

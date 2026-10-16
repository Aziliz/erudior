# Multivariable Calculus (math-multivariable) — progress

Folder `content/math/multivariable`, id prefix `mv-`. College Calculus III; module 1 opens
with a bridge lesson reviewing the single-variable tools the course leans on.

## Outline

| # | Lesson id | Module | Title | Drills |
|---|---|---|---|---|
| 01 | mv-bridge | m1 | Bridge: the single-variable toolkit | mv-d-bridge-deriv, mv-d-bridge-integ |
| 02 | mv-vectors | m1 | Space and vectors | mv-d-dist3, mv-d-vec-ops, mv-d-unit |
| 03 | mv-dot | m1 | The dot product and projections | mv-d-dot-angle, mv-d-proj |
| 04 | mv-cross | m1 | The cross product | mv-d-cross, mv-d-tri-area, mv-d-triple |
| 05 | mv-lines-planes | m1 | Lines and planes | mv-d-plane-3pts, mv-d-point-plane |
| 06 | mv-surfaces | m1 | Cylinders and quadric surfaces | mv-d-sphere-center |
| 07 | mv-vector-functions | m2 | Vector functions and space curves | mv-d-vf-deriv, mv-d-vf-integ |
| 08 | mv-arc-length | m2 | Arc length and curvature | mv-d-arc-helix, mv-d-curv-plane |
| 09 | mv-tnb | m2 | The TNB frame and components of acceleration | mv-d-at-an |
| 10 | mv-motion | m2 | Motion in space and projectiles | mv-d-projectile, mv-d-speed |
| 11 | mv-several-vars | m3 | Functions of several variables | mv-d-domain-eval, mv-d-level |
| 12 | mv-limits | m3 | Limits and continuity | mv-d-limit-path |
| 13 | mv-partials | m3 | Partial derivatives | mv-d-partials, mv-d-second-partials |
| 14 | mv-tangent-planes | m3 | Tangent planes and linear approximation | mv-d-tangent-plane, mv-d-linearize |
| 15 | mv-chain-rule | m3 | The chain rule | mv-d-chain, mv-d-implicit |
| 16 | mv-gradient | m3 | Directional derivatives and the gradient | mv-d-gradient, mv-d-dir-deriv, mv-d-max-rate |
| 17 | mv-extrema | m4 | Local extrema and the second-derivative test | mv-d-crit-pt, mv-d-second-test |
| 18 | mv-absolute-extrema | m4 | Absolute extrema on closed regions | mv-d-abs-rect |
| 19 | mv-lagrange | m4 | Lagrange multipliers | mv-d-lagrange-line, mv-d-lagrange-box |
| 20 | mv-double-rect | m5 | Double integrals over rectangles | mv-d-dbl-rect, mv-d-dbl-avg |
| 21 | mv-double-general | m5 | Double integrals over general regions | mv-d-dbl-region, mv-d-reverse |
| 22 | mv-double-polar | m5 | Double integrals in polar coordinates | mv-d-polar-disk, mv-d-polar-area |
| 23 | mv-double-apps | m5 | Applications: mass, centers of mass, surface area | mv-d-mass-lamina, mv-d-centroid, mv-d-surf-area-graph |
| 24 | mv-triple | m6 | Triple integrals | mv-d-triple-box, mv-d-tetra-vol |
| 25 | mv-cylindrical | m6 | Cylindrical coordinates | mv-d-cyl-convert, mv-d-cyl-integral |
| 26 | mv-spherical | m6 | Spherical coordinates | mv-d-sph-convert, mv-d-sph-ball |
| 27 | mv-jacobian | m6 | Change of variables and Jacobians | mv-d-jacobian, mv-d-cov-linear |
| 28 | mv-vector-fields | m7 | Vector fields | mv-d-vf-eval, mv-d-grad-field |
| 29 | mv-line-integrals | m7 | Line integrals | mv-d-line-scalar, mv-d-work-line |
| 30 | mv-conservative | m7 | Conservative fields and the fundamental theorem | mv-d-potential, mv-d-ftli |
| 31 | mv-green | m7 | Green's theorem | mv-d-green-rect, mv-d-green-area |
| 32 | mv-curl-div | m8 | Curl and divergence | mv-d-curl, mv-d-div |
| 33 | mv-param-surfaces | m8 | Parametric surfaces and surface area | mv-d-param-normal, mv-d-cone-area |
| 34 | mv-surface-integrals | m8 | Surface integrals and flux | mv-d-flux-plane, mv-d-surf-int |
| 35 | mv-stokes | m8 | Stokes' theorem | mv-d-stokes-disk |
| 36 | mv-divergence | m8 | The Divergence theorem | mv-d-div-thm-box, mv-d-div-thm-ball |
| 37 | mv-physics | m8 | Vector calculus in physics | mv-d-gauss-flux |

Modules: m1 Vectors and the geometry of space · m2 Vector functions and motion ·
m3 Partial derivatives · m4 Optimization · m5 Double integrals · m6 Triple integrals and
change of variables · m7 Vector fields and line integrals · m8 Surface integrals and the
big theorems.

References: mv-ref-vectors, mv-ref-differential, mv-ref-integrals, mv-ref-vector-calculus.

## Status

- [x] course.yaml
- [x] m1 (6 lessons, 71 q, 13 drills)  - [x] m2 (4 lessons, 47 q, 7 drills)  - [x] m3 (6 lessons, 69 q, 12 drills)  - [x] m4 (3 lessons, 38 q, 5 drills)  - [x] m5 (4 lessons, 46 q, 9 drills)  - [x] m6 (4 lessons, 44 q, 8 drills)  - [x] m7 (4 lessons, 48 q, 8 drills)  - [x] m8 (6 lessons, 62 q, 10 drills)
- [x] cards, glossary, references
- [x] final build + check (zero problems)

## Final counts

37 lessons in 8 modules, 425 questions (152 in module quizzes; answer positions balanced),
72 drills, 187 notecards, 182 glossary terms, 4 reference sheets.

## Notes for reviewers

- Numbers in lessons, questions and drill formulas were checked with sympy; drills use closed
  forms (nested numerical `integ` works but is ~1.7 s per generation, too slow).
- Lessons 20, 25, 26 are near the 900-word floor; most others are 950-1500.
- Lesson 36 uses `\oiint` once (KaTeX accepts it).
- `mv-d-second-test` asks for a classification as a number code (1 min, 2 max, 3 saddle),
  since drills cannot take text answers.
- Lesson 37 (physics) states Maxwell's equations in SI vacuum form; worth a physics reviewer's glance.

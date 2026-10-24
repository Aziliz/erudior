# NOTES2-phys-m1: Round 2, Measurement and vectors

`content/math/check-module.sh university-physics-1 phys-m1`: build and checker report **zero problems** (4 lessons, 63 questions, 12 drills, 38 cards).

## Honors lessons (both `honors: true`, module `phys-m1`)

| File | Id | Title | Min | Words* | Examples | Pictures / diagrams | Drills |
|---|---|---|---|---|---|---|---|
| lessons/02h1-uncertainty.md | phys-m1-h-uncertainty | Measurement uncertainty and error propagation | 45 | ~1,900 | 3 (mean/SD/SE of five timings; pendulum g = 9.81 ± 0.06 m/s²; mass by difference 3.5 ± 0.3 g) + sin θ worked in text | Mermaid "which propagation rule" (LR); plot of three g results with uncertainty bars vs accepted value | phys-m1-r2-sem, phys-m1-r2-pendulum-g, phys-m1-r2-sphere-volume |
| lessons/02h2-vector-algebra.md | phys-m1-h-vector-algebra | Vector algebra: projections, rotated axes and triple products | 45 | ~1,930 | 4 (force split along/perpendicular to displacement; ramp weight in rotated axes; parallelepiped volume + coplanarity test; centripetal acceleration via ω×(ω×r)) | phys-m1-projection.svg; shape figure of rotated axes; phys-m1-parallelepiped.svg; Mermaid "which vector operation" (LR) | phys-m1-r2-projection, phys-m1-r2-rotate-axes, phys-m1-r2-triple |

*Prose words, excluding code blocks. Two honors lessons: the module has only two core lessons, and these two cover what is clearly worth adding (lab uncertainty, and the vector tools later modules lean on: projections, rotated axes, triple products). Dimensional analysis/Buckingham π was considered for a third and left out.

## Core lesson additions (additions only)

- **01-measurement.md**: Mermaid unit-conversion loop (TD, after Example 2); Mermaid "which significant-figure rule" decision chart (TD, before Example 3); `phys-m1-targets.svg` accuracy/precision targets (after the accuracy/precision paragraph). One introducing sentence for each.
- **02-vectors.md**: `phys-m1-components.svg` (vector with x/y components and θ, after the component formulas); Mermaid "adding vectors by components" procedure with the quadrant check (TD, before Example 1).

## Questions (`questions/r2-phys-m1.yaml`, 39)

- Core (phys-m1-r2-q01–q10, 5 per lesson): 2 text (km/h conversion; magnitude + angle with two blanks), 2 order (lengths by size; resultant-direction steps), 2 match (SI prefixes; dot/cross results), 2 select-all (dimensionally consistent equations; perpendicular pairs), 2 label (accuracy/precision targets; vector components). `module_quiz: true` on q03, q05, q07, q09.
- Honors uncertainty (h01–h14): 9 MC + 5 new types (2 text, match, order, select-all).
- Honors vector algebra (h15–h29): 10 MC + 5 new types (text, match, select-all, label, order).
- MC answer positions across both honors lessons: 0×5, 1×4, 2×5, 3×5. Every number recomputed in Python; every distractor is a named mistake.

## Pictures (original SVG, all under 5 KB, previewed with markers)

phys-m1-targets.svg / -blank.svg, phys-m1-components.svg / -blank.svg, phys-m1-projection.svg / -blank.svg, phys-m1-parallelepiped.svg. Mermaid: 5 (3 core, 2 honors), all with accTitle/accDescr. Lesson figures: 1 plot, 1 shape (rendered and checked).

## Drills (`drills/r2-phys-m1.yaml`, 6)

phys-m1-r2-sem (mean exact to 3 dp; SD and SE to 2 s.f., 6% tolerance), phys-m1-r2-pendulum-g (g ±0.2%, δg ±6%), phys-m1-r2-sphere-volume (V sigfigs 3, δV ±6%), phys-m1-r2-projection (±0.6%), phys-m1-r2-rotate-axes (±0.6%, with figure), phys-m1-r2-triple (integers). Tolerances were checked by simulation (20,000+ instances) so a correctly rounded answer, including one computed from the rounded intermediates shown in the solution, is always accepted. A 2-s.f. edge case (δg = 0.1046, solution path gives 0.11) is why the 2-s.f. tolerances are 6%, not 5%.

## Glossary and cards

- `glossary-r2-phys-m1.yaml`: 15 terms (uncertainty, relative uncertainty, random error, systematic error, standard deviation, standard error of the mean, propagation of uncertainty, adding in quadrature, discrepancy, scalar projection, vector projection, direction cosines, scalar triple product, coplanar, vector triple product). No clash with any term or alias in the course's glossary files (the only duplicate in the course is "kelvin", in the core glossary, not mine).
- `cards-r2-phys-m1.yaml`: 22 cards (11 per honors lesson), topics Measurement uncertainty, Error propagation, Vector projections, Triple products.

## For a reviewer to double-check

- Conventions labeled as conventions in the lesson: uncertainty rounded to 1 s.f. (2 if it starts with 1); analog reading uncertainty of half the smallest division; "consistent if the discrepancy is within about 2 uncertainties" (stated as a rule of thumb assuming δ is about one standard deviation).
- Quadrature is justified briefly ("for independent errors the variances add") rather than derived; the tangent-line rule is labeled as a small-uncertainty approximation.
- Rotated-axes formulas use counterclockwise rotation of the axes (not the vector); h19 and the drill follow that sign convention.
- Example 4 (02h2) takes r from a point on the rotation axis, so ω×(ω×r) gives −ω²ρ toward the axis.
- The g plot's x axis is just 1, 2, 3 for students A, B, C (tick values at 0.5 steps show; cosmetic).

## Errors found in existing content

None in lessons 01–02, questions phys-q-0101–0212 or drills phys-m1.yaml.

## Sources

- J. R. Taylor, *An Introduction to Error Analysis* (2nd ed.): reporting rules, quadrature, power and general rules, standard error.
- JCGM 100:2008 (GUM), terminology for uncertainty, random and systematic effects.
- OpenStax *University Physics* Vol. 1, ch. 1–2 (units, vectors, dot and cross products).
- M. L. Boas, *Mathematical Methods in the Physical Sciences*, ch. 3 and 6 (rotation of axes, triple products, BAC-CAB).
These are standard results; numbers in examples, questions and drills were recomputed in Python (numpy).

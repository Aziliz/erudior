# Physics module 1 (phys-m1, Measurement and vectors), round 2: writer notes

## Added

**Honors lessons (2)**: the module has only two core lessons, so one honors lesson extends each.
- `lessons/02h1-uncertainty.md` (phys-m1-h-uncertainty, "Measurement uncertainty and error propagation", 45 min, about 2,100 words): best value ± uncertainty; absolute, fractional and percent uncertainty; instrument-reading conventions (labeled as conventions); rounding the uncertainty; random vs systematic error; mean, sample standard deviation and standard error $s/\sqrt n$; propagation rules for sums, products, powers and exact constants (quadrature vs direct addition, with a first-order derivation of why products combine fractional uncertainties, and the "perpendicular vectors" picture labeled as an analogy); agreement rule of thumb (labeled as a convention) and percent error; error bars and a $T^2$-vs-$L$ fit. 4 worked examples.
- `lessons/02h2-vector-algebra.md` (phys-m1-h-vector-algebra, "Vector algebra in three dimensions", 45 min, about 2,000 words): unit vectors and direction cosines; scalar and vector projections; the cross product in components (derived from the unit-vector products); parallelogram area and the scalar triple product (volume, coplanarity, cyclic symmetry); components in rotated axes and why magnitudes don't change, applied to a ramp. 5 worked examples (Example 2 reuses the core lesson's vectors and confirms its 12.1).

**Core lessons (additions only)**
- 01-measurement: a dart-target picture for accuracy vs precision, a "which significant-figure rule" Mermaid chart, and a velocity–time plot showing slope and shaded area.
- 02-vectors: a `shape` figure for subtraction (A − B), the components picture, and a Mermaid procedure for adding vectors by components. The components picture sits right after the sentence it illustrates, with a one-sentence lead-in; no existing text was changed.

**Questions (`questions/r2-phys-m1.yaml`, 41)**
- Core (11): phys-m1-r2-q01–q06 (measurement), q07–q11 (vectors). By type: 3 text, 2 match, 2 order, 2 label, 2 select-all. `module_quiz: true` on q03, q04, q07 and q08.
- Honors (30): h01–h15 (uncertainty: 10 multiple choice, 1 select-all, 2 text, 1 match, 1 order) and h16–h30 (vector algebra: 10 multiple choice, 1 select-all, 2 text (one with three blanks), 1 match, 1 label). No `module_quiz` (honors lessons in a core module).
- Answer positions of the 20 single-answer multiple-choice questions: 0→5, 1→5, 2→5, 3→5.

**Pictures (6 SVGs in `images/`, all original)**: phys-m1-targets (+ -blank), phys-m1-components (+ -blank), phys-m1-parallelogram (+ -blank). The blanks are used by label questions q04, q07 and h25. All rendered with preview-figure.mjs and checked, with markers.

**Diagrams**: Mermaid: sig-fig rule chart (01), vector-addition procedure (02), choosing a propagation rule (02h1), cyclic unit-vector order (02h2). Figures: v–t plot (01), subtraction shape (02), error-bar plot (02h1), ramp with tilted axes (02h2). All Mermaid diagrams were rendered and checked.

**Drills (`drills/r2-phys-m1.yaml`, 6)**: phys-m1-r2-mean-sem, -product-unc, -pendulum-g (02h1); phys-m1-r2-cross-components, -projection, -triple-product (02h2). Rounded answers use `sigfigs` (or a tolerance of half the last place), so correctly rounded answers are always accepted.

**Glossary (`glossary-r2-phys-m1.yaml`, 15)**: absolute uncertainty, fractional uncertainty, percent uncertainty, random error, systematic error, standard deviation, standard error of the mean, propagation of uncertainty, adding in quadrature, percent error, error bar, direction cosines, scalar projection, vector projection, scalar triple product. I checked every glossary file in the course for duplicates and found none. Watch the aliases `quadrature`, `standard error` and `triple product` if a later writer adds them.

**Cards (`cards-r2-phys-m1.yaml`, 19)**: 10 on uncertainty, 9 on vector algebra.

`content/math/check-module.sh physics phys-m1`: OK, zero problems.

## For a reviewer
- Conventions that vary between textbooks are presented as conventions: reading to half the smallest division, ±1 in the last digit, uncertainty to 1 sig fig (2 if it starts with 1), and the "agree within combined uncertainty / disagree beyond 2–3×" rule.
- h11 counts a consistent parallax misreading ("always from the same angle") as systematic; the wording is deliberate.
- The error-bar data in 02h1 is illustrative (generated near g = 9.8 m/s²). Its least-squares slope through the origin is 4.03 s²/m, giving g = 9.79 m/s².
- Every number in the lessons, questions and drills was recomputed in Python/numpy.

## Errors found in existing content
None.

## Sources
Standard results only: propagation rules as in Taylor, *An Introduction to Error Analysis*, and in common university lab manuals; vector identities from standard linear algebra. No text was copied.

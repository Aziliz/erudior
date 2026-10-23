# Round 2 notes: la-m4 (Linear transformations)

## Honors lessons (new)
- `lessons/14h1-lines-reflections.md`, `la-m4-h-lines`: **Projections, reflections and rotations through any line** (45 min, about 2,040 words, topic "Reflections and projections"). Covers what linear maps do to lines (lines go to lines or points, parallels stay parallel, midpoints are kept); the projection matrix onto the line at angle θ and in slope form; the reflection R = 2P − I with the doubled angle; idempotent and involution; reflection sends direction φ to 2θ − φ; the theorem that two reflections make the rotation by 2(β − α); rotation then reflection is a reflection; isometries. 3 worked examples (line x₂ = 2x₁ acting on (3, 1); x₁-axis then the 30° line; classifying (1/5)[4 3; 3 −4]).
- `lessons/14h2-preimages-one-sided-inverses.md`, `la-m4-h-inverses`: **Preimages and one-sided inverses** (45 min, about 1,690 words, topic "Preimages and one-sided inverses"). Covers preimages as parallel copies of the solution set of Ax = 0; onto and one-to-one in terms of preimages; composition facts (S∘T one-to-one ⇒ T one-to-one; S∘T onto ⇒ S onto, with a counterexample for the converses); left and right inverses and the pivot conditions; building a right inverse column by column and a left inverse from an invertible block of rows; non-uniqueness; C = D when both exist. 4 worked examples.

## Core lessons (additions only)
- 12 `la-transformations`: SVG `la-m4-domain-range.svg` (domain, codomain, range, a point outside the range) and a Mermaid "Is T linear?" decision chart.
- 13 `la-std-matrix`: a Mermaid recipe chart for the standard matrix, a plot of e₁ and e₂ rotated by 30°, and SVG `la-m4-gallery.svg` (unit square under a 90° rotation, a reflection, a shear and a projection).
- 14 `la-onto-one`: SVG `la-m4-arrow-diagrams.svg` (the four one-to-one/onto combinations, labeled as schematic) and a Mermaid pivot-test chart.

## Questions: `questions/r2-la-m4.yaml` (42)
- Core, 15 (la-m4-r2-q01 to q15): each core lesson has 1 text, 1 label, 1 select-all, 1 order and 1 match question. Module quiz: q01, q03, q06, q07, q12, q14 (2 per lesson).
- Honors `la-m4-h-lines`, 14 (h01 to h14): 8 multiple choice, 2 text, 1 order, 1 label (`la-m4-reflect-line-blank.svg`), 1 select-all, 1 match.
- Honors `la-m4-h-inverses`, 13 (h15 to h27): 8 multiple choice, 2 text, 1 order, 1 match, 1 select-all.
- Multiple-choice answer positions 0/1/2/3 = 4/3/4/5.

## Pictures and diagrams
- SVGs (each with a `-blank` copy for its label question): `la-m4-domain-range`, `la-m4-gallery`, `la-m4-arrow-diagrams`, `la-m4-reflect-line`. All rendered and checked, with markers.
- Mermaid: 4 (lessons 12, 13, 14 and 14h2). Plots: 3 new (lesson 13, 14h1, 14h2).

## Drills: `drills/r2-la-m4.yaml` (5)
- `la-m4-r2-project`, `la-m4-r2-reflect`: project or reflect a point across x₂ = mx₁ (m = ±1, ±2, ±3). Exact fraction or 3-decimal answers, with tolerance 0.001.
- `la-m4-r2-two-reflections`: rotation angle from two mirror angles (multiples of 15°), as an integer in (0°, 360°).
- `la-m4-r2-preimage`: the preimage line p + tv for a 2×3 echelon matrix.
- `la-m4-r2-left-inverse`: a left inverse from a top block with determinant ±1, then use it to solve Ax = b (b is in the range).
- Each drill was generated 500 times and checked against independent conditions: the projection lies on the line and the residual is perpendicular to it; the reflection's midpoint is the projection and its length is preserved; the rotation matrix comes from multiplying the two reflection matrices; Ap = b and Av = 0; CA = I with Cb = x and Ax = b. 0 failures, and the shown answer was accepted every time.

## Glossary and cards
- `glossary-r2-la-m4.yaml` (7): double-angle identities, idempotent, involution, isometry, preimage (alias inverse image), left inverse, right inverse. I searched every glossary file first and found no duplicates.
- `cards-r2-la-m4.yaml` (21): 12 for 14h1, 9 for 14h2.

## For a reviewer
- Stated without proof and labeled as such in the text: every linear isometry of the plane is a rotation or a reflection (14h1); a one-to-one A has n rows forming an invertible block (14h2, "taken on trust", Module 7 rank facts).
- 14h1 derives P(e₁) = cos θ·u from a right-triangle picture, which holds as drawn for 0 < θ < 90°. The text says the lengths are signed for other angles, and it checks the formula for all θ through Pu = u and Pn = 0.
- 14h2 mentions (A^TA)^{-1}A^T as a forward reference to the least-squares lesson, and uses associativity of the matrix product (taught in lesson 03).
- Lesson 14h1 is near the top of the length range (about 2,040 words of prose).

## Errors found in existing content
- None. No existing question, drill, card or glossary entry was edited.

## Verification and sources
- Every formula and number was checked with sympy: the P and R matrices (angle and slope forms), the composition identities, every worked example, and every question key and distractor.
- Standard results only. All explanations, examples and figures are original.
- `content/math/check-module.sh linear-algebra la-m4`: OK (zero problems).

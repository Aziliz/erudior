# Module pc-m8 (Vectors): round 2 notes

`content/math/check-module.sh precalculus pc-m8`: build and checker OK, zero problems (4 lessons, 66 questions, 12 drills, 29 cards).

## Honors lessons (new)
- `lessons/35h1-cross-product.md` (pc-m8-h-cross-product), "The cross product: area, volume and torque", 45 min, about 2,050 words (1,300 excluding math). Covers the determinant form (ties to Lesson 25), a proof that u × v is perpendicular to both factors, Lagrange's identity and the area of a parallelogram, the right-hand rule and the i, j, k cycle, a properties table (anticommutative, not associative), triangle area and the 2D |ad − bc| shortcut, the triple scalar product as a volume and coplanarity test, torque, and a short history (Hamilton's quaternions, Gibbs and Heaviside). 4 worked examples.
- `lessons/35h2-lines-planes.md` (pc-m8-h-lines-planes), "Lines and planes in space", 45 min, about 1,730 words (1,150 excluding math). Covers vector, parametric and symmetric equations of a line; parallel, intersecting and skew lines (with the distance between skew lines in a remark); point-normal and general forms of a plane; the plane through three points; angles between planes; where a line meets a plane; the distance from a point to a plane and between parallel planes. 4 worked examples.

## Core lessons (additions only, existing text unchanged)
- 34-vectors-2d: labeled SVG of a vector's parts (initial and terminal points, components, magnitude, direction angle) with one introducing sentence; a `plot` of v, 2v and −v; a Mermaid "direction angle by quadrant" decision chart with one introducing sentence.
- 35-dot-product-3d: a `plot` of a force at 25° and its horizontal part (Work section); an SVG of right-handed 3D axes with the point (2, 3, 4) and a short paragraph on how such axes are drawn and how to plot a point; a Mermaid "which vector tool for which question" chart (angle, perpendicular test, projection, work, cross product) with one introducing sentence.

## Questions (`questions/r2-pc-m8.yaml`, 40)
- Core, pc-m8-r2-q01 to q12, 6 per lesson. pc-vectors-2d: text 2, select-all 1, label 1, match 1, order 1. pc-dot-product: text 2, select-all 1, match 1, label 1, order 1. module_quiz: q02, q04, q09, q11.
- Honors, pc-m8-r2-h01 to h14 (cross product) and h15 to h28 (lines and planes), 14 per lesson: 9 four-choice, plus 1 each of text, match, order, select-all and label. Four-choice answer positions over both lessons: 4/5/4/5.
- Every answer computed in sympy; each distractor checked wrong; order questions have only one valid order (each step depends on the one before).

## Pictures and diagrams
- 9 SVGs, 20 KB in total: pc-m8-vector-parts (+ -blank), pc-m8-3d-axes (+ -blank), pc-m8-cross-parallelogram (+ -blank), pc-m8-parallelepiped, pc-m8-plane-normal (+ -blank). All rendered and inspected; the blanks were checked with their label markers.
- 4 Mermaid diagrams (2 core, 2 honors: the i → j → k cycle and the parallel/intersecting/skew decision chart), all previewed.
- 2 new `plot` figures in the core lessons, rendered with renderFigure and checked.

## Drills (`drills/r2-pc-m8.yaml`, 6)
pc-m8-r2-cross, pc-m8-r2-triangle-area, pc-m8-r2-box-volume (linked from 35h1); pc-m8-r2-plane-equation, pc-m8-r2-plane-distance, pc-m8-r2-line-plane (linked from 35h2). I generated 500 to 2,000 instances of each and checked the answers against an independent solver that reads the prompt as shown. The displayed answer typed back in is always accepted, a wrong answer is rejected, and no "+ -", "1x" or "+ 0" output appears. The decimal answers (area, distance) ask for 2 decimals with tolerance 0.01, and exact forms such as sqrt(41)/2 are accepted.

## Glossary and cards
- `glossary-r2-pc-m8.yaml`, 11 terms: Lagrange's identity, right-hand rule, anticommutative, parallelepiped, triple scalar product, coplanar, torque, direction vector, symmetric equations, skew lines, normal vector. Before adding them I grepped every glossary file in the course, and none of these terms or aliases already existed. I left generic aliases ("normal", "skew") out.
- `cards-r2-pc-m8.yaml`, 18 cards: 10 for Cross product and 8 for Lines and planes in space.

## For the reviewer
- pc-m8-r2-plane-equation asks for the normal "exactly as computed" (AB × AC, without dividing out a common factor), so the answer is unique. A learner who reduces the normal is marked wrong, even though the prompt says not to.
- 35h1 says the cross product "as defined here" exists only in 3D. That is a deliberate hedge, because a 7-dimensional cross product exists.
- History in 35h1: Hamilton's quaternions (1843), and Gibbs and Heaviside separately developing vector analysis in the 1880s. These are standard facts, but worth a glance.
- The 3D axes label question (q11) depends on the usual right-handed drawing (x toward the viewer, down-left). The stem and the lesson both say this.
- The cross-product label question (h14) names u and v in the stem, because swapping u and v with u × v and v × u would otherwise also be consistent.

## Errors found in existing content
None. I didn't edit any existing question, drill, card or glossary entry.

## Sources
Standard results only (no text or figures copied). I checked facts against OpenStax *Calculus Volume 3*, sections 2.4 (cross product) and 2.5 (lines and planes), and against the usual histories of vector analysis (Crowe, *A History of Vector Analysis*).

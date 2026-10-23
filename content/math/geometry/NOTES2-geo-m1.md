# Geometry module 1 (geo-m1), round 2: writer notes

## Added

**Honors lessons (2)**
- `lessons/04h1-plane-separation.md` (geo-m1-h-plane-separation, "Betweenness, half-planes and Pasch's axiom",
  45 min, about 2,050 words of prose): betweenness defined from the Ruler Postulate (and why exactly one of
  three collinear points is between the others), convex sets and intersections of convex sets, the Plane
  Separation Postulate with a coordinate sign test and crossing-point formula, interiors/exteriors of angles
  and the interior of a triangle as intersections of half-planes, half-spaces, Pasch's axiom with a full proof
  from plane separation, the Crossbar Theorem (statement, why Lesson 13's base-angles proof needs it, proof
  outline only, labeled as such), and the false proof that every triangle is isosceles, with the betweenness
  error explained. 4 worked examples.
- `lessons/04h2-counting-figures.md` (geo-m1-h-counting, "Counting lines, planes, regions and angles", 45 min,
  about 1,450 words of prose plus formulas): C(n,2) and C(n,3) derived by counting ordered choices, lines
  through points with a collinear subset, planes through points in space, crossings and regions of lines in
  general position via the recurrence R(k) = R(k-1) + k, bounded vs unbounded regions (2n unbounded, C(n-1,2)
  bounded), the "each new line adds crossings + 1" rule for parallel/concurrent cases, angles and vertical
  pairs at n concurrent lines (2n(n-1) and n(n-1)), and Moser's circle problem 1 + C(n,2) + C(n,4), which
  explains Lesson 5's 31. 4 worked examples.
- A third honors lesson was not written: the module has 4 core lessons, and the remaining natural topics
  (constructions, axiom systems, radians and clock angles) are already taught in geo-h1, Lesson 39 and Lesson 27.

**Core lessons (additions only)**
- 01: picture of line/ray/segment/point/plane (`geo-m1-figures.svg`), Mermaid "classifying two lines" chart,
  box picture for Example 3 (`geo-m1-box.svg`).
- 02: protractor picture (rays at 45 and 130, 85°) with one sentence on subtracting readings, angle parts
  picture (vertex, sides, interior, exterior) with one sentence, Mermaid procedure for midpoint/bisector problems.
- 03: comparison picture (adjacent complementary / linear pair / supplementary not adjacent), short
  "Which rule applies?" section with a Mermaid decision chart.
- 04: regular hexagon construction picture, short "Choosing a construction" section with a Mermaid chart (LR,
  five short branches).

**Questions (`questions/r2-geo-m1.yaml`, 48)**
- Core geo-m1-r2-q01–q20 (5 per lesson): 3 label, 4 text, 4 match, 4 order, 4 select-all, 1 multiple choice
  with picture. `module_quiz: true` on q01, q03, q06, q09, q12, q14, q16, q20 (2 per lesson).
- Honors geo-m1-r2-h01–h14 (lesson 04h1): 8 multiple choice, 2 select-all, 2 text, 1 order, 1 match.
- Honors geo-m1-r2-h15–h28 (lesson 04h2): 8 multiple choice, 3 text, 1 order, 1 match, 1 select-all.
- Answer positions of the 17 single-answer multiple-choice questions: 0→5, 1→4, 2→4, 3→4.

**Pictures (14 SVGs, all original, in `images/`)**: geo-m1-figures (+ -blank), geo-m1-box, geo-m1-protractor,
geo-m1-angle-parts (+ -blank), geo-m1-pairs-compare, geo-m1-perp-bisector-blank, geo-m1-hexagon,
geo-m1-convex, geo-m1-half-planes, geo-m1-pasch, geo-m1-isosceles-fallacy, geo-m1-four-lines. Each was
rendered with preview-figure.mjs and checked; the three label pictures were checked with their markers.
The accurate panel of the fallacy picture and the four-line arrangement were computed in Python (P is on the
circumcircle, AE = AF = 5.314, EB = FC = 0.632, AB = AE − EB; the four lines make 6 crossings and 11 regions,
3 bounded).

**Mermaid diagrams (6)**: lessons 01–04 as above, plus the chain of ideas in 04h1 and a counting plan in 04h2.
All have accTitle/accDescr and were rendered and checked.

**Drills (`drills/r2-geo-m1.yaml`, 4)**: geo-m1-r2-crossing (04h1: sign test and crossing x, tolerance 0.006
for 2-decimal answers), geo-m1-r2-lines-points, geo-m1-r2-regions, geo-m1-r2-concurrent (04h2; smallest
angle tolerance 0.006).

**Glossary (`glossary-r2-geo-m1.yaml`, 16)**: betweenness, convex set, Plane Separation Postulate,
half-planes, half-spaces, interior of an angle, exterior of an angle, interior of a triangle, Pasch's axiom,
Crossbar Theorem, combination, general position, recurrence, bounded regions, unbounded regions, Moser's
circle problem. All glossary files were grepped first; no duplicates (the existing term `convex` is for
polygons; the new entry is `convex set`).

**Cards (`cards-r2-geo-m1.yaml`, 20)**: 10 for 04h1, 10 for 04h2.

`content/math/check-module.sh geometry geo-m1`: OK, zero problems.

## For a reviewer
- 04h1 history: Pasch 1882 and Hilbert 1899 both took Pasch's statement as an axiom; "many textbooks since the
  1960s" assume a Plane Separation Postulate (SMSG-style systems, Moise). The false proof is attributed to
  W. W. Rouse Ball's popularization in the 1890s (Mathematical Recreations and Essays, 1892); worth a glance.
- 04h1: the claim that P lies on the circumscribed circle is stated without proof (pointed to Module 7);
  the Crossbar Theorem proof is an outline and says so.
- 04h2: "angles" at concurrent lines exclude straight angles (opposite rays); this convention is stated in the
  lesson, questions and drill.
- Lesson 03's and 04's new short sections ("Which rule applies?", "Choosing a construction") are additions of
  two sentences plus a diagram each.

## Errors found in existing content
None found in geo-m1 lessons or questions during this pass.

## Sources
Standard results written from memory and checked by computation: Hilbert, Foundations of Geometry (1899);
Pasch, Vorlesungen über neuere Geometrie (1882); Moise, Elementary Geometry from an Advanced Standpoint
(plane separation, crossbar theorem); Rouse Ball, Mathematical Recreations and Essays (the isosceles fallacy);
standard combinatorics for C(n,k), line arrangements and Moser's circle problem. No web lookups were made, so
dates and attributions above are the items to spot-check. All numbers were recomputed in Python; all writing
and drawings are original.

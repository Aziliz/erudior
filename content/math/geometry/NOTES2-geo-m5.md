# Module geo-m5 (Special segments, polygons and quadrilaterals), round 2: writer's notes

`content/math/check-module.sh geometry geo-m5`: build and checker report zero problems (8 lessons, 124 questions, 19 drills, 51 cards).

## Honors lessons (new, `honors: true`, 45 min each)

- `lessons/19h1-concurrency-proofs.md` (geo-m5-h-concurrency), "Proving the triangle centers exist", about 2,100 words. Proves what Lessons 15–16 only stated. The centroid 2 : 1 split, using two midsegments, a parallelogram (MNDE) and uniqueness of the two-thirds point. The concurrency of the altitudes, which are the perpendicular bisectors of the anticomplementary triangle. The Euler line, by a coordinate proof with A(a, 0), B(b, 0), C(0, c), giving 3G = H + 2O. And the right-triangle circumcenter, by completing the triangle to a rectangle. Four worked examples: thirds of a median; an obtuse orthocenter (6, −4) checked against the big triangle; the Euler line of Lesson 16's triangle (O(3, 1), G(8/3, 4/3), H(2, 2), y = −x + 4); H from O and G. Pictures: geo-m5-centroid-proof.svg and geo-m5-anticomplementary.svg, plus a `shape` figure of the Euler line.
- `lessons/19h2-varignon-diagonals.md` (geo-m5-h-varignon), "Varignon's theorem and classifying quadrilaterals by their diagonals", about 1,800 words. Covers Varignon's theorem with its proof, perimeter = AC + BD, and area = half (the corner-triangle argument for convex quadrilaterals; the concave case is stated). Shows when the Varignon parallelogram is a rectangle, rhombus or square. Classifies convex quadrilaterals by their diagonals, including the kite and the isosceles-trapezoid patterns, and gives counterexamples. Ends with inclusive vs exclusive definitions, labelled as a convention. Four worked examples, including a coordinate check by the box method and a counterexample with congruent, perpendicular diagonals: A(−2, 0), B(0, −3), C(8, 0), D(0, 7). Pictures: geo-m5-varignon.svg and geo-m5-diagonal-patterns.svg. Diagram: Mermaid decision chart (TD, 11 boxes).
- `lessons/19h3-star-polygons-tilings.md` (geo-m5-h-tilings), "Turning angles, star polygons and tilings", about 1,650 words. Covers signed turning, which gives the (n − 2)·180° sum for concave polygons (the turning theorem is accepted, and labelled as such). Star polygons {n/k}: tip angle 180 − 360k/n and tip sum 180(n − 2k), checked a second way by inscribed angles. Vertex configurations and 1/a + 1/b + 1/c = 1/2. The 17 combinations and 21 vertex types. The odd-polygon argument against 3.7.42 and similar types. And the 11 tilings with every vertex alike (3 regular, 8 semiregular). Five worked examples. Pictures: geo-m5-tilings.svg, plus `shape` figures of an L-shaped hexagon and a pentagram.
- Questions: geo-m5-r2-h01 to h39, 13 per lesson. Types: 18 multiple choice; 9 text; 3 order; 3 match; 4 select-all; 2 label (diagonal patterns, tilings). No `module_quiz` (honors lessons in a core module).
- Drills (`drills/r2-geo-m5.yaml`): geo-m5-r2-orthocenter and geo-m5-r2-euler (h1); geo-m5-r2-varignon (h2); geo-m5-r2-star-angle and geo-m5-r2-vertex-fill (h3). Each was generated 1,500 times against an independent calculation, with zero failures. Checks: answers match, convexity holds where needed, star polygons are valid, 2-decimal and rounded-diagonal answers are accepted, and wrong answers are rejected.
- Glossary (`glossary-r2-geo-m5.yaml`, 11): medial triangle, anticomplementary triangle, Varignon parallelogram (alias Varignon's theorem), inclusive definition, exclusive definition, reflex angle, star polygon, Schläfli symbol, edge-to-edge, vertex configuration (aliases vertex type/types), semiregular tiling (alias Archimedean tiling). I checked every geometry glossary*.yaml first and found no duplicates.
- Cards (`cards-r2-geo-m5.yaml`, 26): 8 for h1, 9 for h2, 9 for h3.

## Core lessons (additions only)

- L15: geo-m5-circumcenter-cases.svg (acute/right/obtuse circumcenters) and a Mermaid chart of the circumcircle and incircle constructions.
- L16: geo-m5-special-segments.svg (altitude, angle bisector and median from C, and the perpendicular bisector of AB) and a Mermaid "which center?" chain (TD).
- L17: geo-m5-polygon-parts.svg and a Mermaid "find n from an angle fact" chart.
- L18: a `shape` figure of the isosceles-trapezoid counterexample, and a Mermaid chart of the parallelogram tests (TD).
- L19: a Mermaid family tree, geo-m5-trapezoid-parts.svg, and a `shape` kite with its diagonals.
- Blank copies for label questions: special-segments-blank, polygon-parts-blank, trapezoid-parts-blank, diagonal-patterns-blank (panels reordered, no square), tilings-blank (panels reordered). Every SVG and Mermaid file was previewed, the blank ones with their markers. Every SVG is under 20 KB.
- New questions: geo-m5-r2-q01 to q25, 5 per core lesson. Types: 7 text, 5 match, 4 order, 5 select-all, 3 label, 1 multiple choice. `module_quiz: true` on q01, q05, q06, q08, q12, q14, q16, q18, q21, q22 (2 per lesson).

## For the reviewer

- **Overlap with geo-h1.** `92-euler-nine-point.md` (geo-h1) proves the Euler line by a transformation and cites this module's lesson by title. Mine is a coordinate proof, so the two lessons complement each other. Both have an "H = 3G − 2O" drill: geo-h1-r2-euler-coords and geo-m5-r2-euler. Both use Lesson 16's triangle (0,0), (6,0), (2,4) as an example. Both bold **medial triangle**. My glossary entry was there first; if the geo-h1 writer also adds it, one copy must go.
- Lesson 16 says Euler found the line in 1765. My lesson says only "in the 1760s" and doesn't contradict it.
- Facts to spot-check:
  - Varignon (1654–1722); his proof was published posthumously in 1731.
  - The half-area rule also holds for concave quadrilaterals.
  - 17 combinations and 21 vertex types (both recomputed by enumeration in Python).
  - The six types 3.7.42, 3.8.24, 3.9.18, 3.10.15, 4.5.20 and 5.5.10 appear in no edge-to-edge tiling by regular polygons.
  - 3.3.4.12, 3.4.3.12, 3.3.6.6 and 3.4.4.6 appear only in tilings that mix vertex types.
  - Kepler's *Harmonices Mundi* (1619) was the first systematic treatment.
  - The incenter lies on the Euler line only for isosceles triangles.
- The odd-polygon argument in h3 is proved only for tilings where every vertex has the same type. The stronger claim (no tiling at all) is stated as a known result.
- The h2 area check uses the "box method", which this course doesn't otherwise teach; the lesson explains it in one sentence.
- h1 is about 2,100 words with alt text included, near the 2,200 limit.
- I found no errors in the existing module 5 lessons, questions, drills, cards or glossary, and changed no existing ids or answers.
- Answer positions of the new single-answer multiple-choice questions (19): 0 = 4, 1 = 5, 2 = 5, 3 = 5.

## Sources

- Wikipedia, "Varignon's theorem": publication date, concave and crossed cases, perimeter, and the rectangle and rhombus conditions.
- Wikipedia, "Euclidean tilings by convex regular polygons": the 17/21 counts, the six impossible vertex types, the four found only in k-uniform tilings, and Kepler's *Harmonices Mundi*.
- Python: the vertex-type enumeration, the sympy Euler-line identity, and every number in the examples and questions.
- All text, figures and questions are original.

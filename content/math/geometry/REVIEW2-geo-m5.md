# Module geo-m5, round 2: reviewer's report

`content/math/check-module.sh geometry geo-m5` after fixes: build and checker report zero problems (8 lessons, 124 questions, 19 drills, 51 cards).

## Changes

| Where | What was wrong | Change |
|---|---|---|
| drills/r2-geo-m5.yaml, geo-m5-r2-star-angle (solution) | `{turn}` printed with a thousands comma inside math (`1,440^\circ`, `\dfrac{1,260^\circ}{11}`) for k ≥ 3 | Write the turn as `360^\circ \cdot {k}` instead; removed the now-unused `turn` and `each` calc values |
| drills/r2-geo-m5.yaml, geo-m5-r2-orthocenter (solution) | When C is left of A, the solution printed `\cdot -1` | Parenthesized: `\cdot ({dca})` |
| 19h1-concurrency-proofs.md, intro | Said Lesson 15 proved that the angle bisectors meet at the incenter. Lesson 15 proves the Angle Bisector Theorem but only states the Incenter Theorem | Now says Lesson 15 proved the circumcenter case and the same argument with the Angle Bisector Theorem and its converse gives the incenter |
| questions, geo-m5-r2-h09 explanation | "the incenter, which was proved in Lesson 15" (same issue) | "the idea behind the incenter (Lesson 15), not one of this lesson's proofs" |
| 19h3-star-polygons-tilings.md and glossary `vertex configuration` | "listed in order by their numbers of sides" reads as sorted by side count, which contradicts 3.6.3.6 | Now says the numbers of sides are listed in the order the polygons sit around the vertex (Cundy and Rollett notation, per Wikipedia, "Euclidean tilings by convex regular polygons") |
| 19h2-varignon-diagonals.md, isosceles-trapezoid paragraph | "the two small triangles at the crossing": one of the two triangles is the large one | Now names them as the triangle formed by the two short pieces and the one formed by the two long pieces |
| 19h2, area argument | Cited Lesson 20 (later in the course) as if already known | "Lesson 20 shows why" |
| 19h3, inscribed-angle check | Cited Lesson 29 (much later) as if already known | Marked as a later lesson that the student can skip until they reach it |
| questions, geo-m5-r2-q11 marker 4 (Interior angle) | Marker sat below the shaded wedge | Moved to y = 21.5 so it sits on the wedge. I tried moving marker 5 too, but it then covered the exterior-angle wedge, so it stays beside it |

## Checked and found right

- Every one of the 64 new questions, worked before reading the key: q01–q25 and h01–h39. Each has one defensible answer, the select-all sets are right, the order questions have only one order, and the match and label pairs are unambiguous. Notable ones: h06 H(10, −5); h19 is a rhombus, not a square (diagonals √72 and √32, dot product 0); h29 and h38 ({9/4} has 20°, {9/2} has 100°); h34 is the only order (25.71°, 36°, 45°, 77.14°); q20 D = (3, 5).
- Honors lesson math, recomputed in Python:
  - The Euler-line coordinate proof: H + 2O = (a + b, c) = 3G.
  - Example 2: H(6, −4) and anticomplementary vertices (10, 3), (2, 3), (−2, −3), all at squared distance 65.
  - Example 3: O(3, 1) and y = −x + 4.
  - h2 Example 1: midpoints, perimeter 10 + 8√2 ≈ 21.31, and areas 56 and 28 by the shoelace formula. The box-method corner areas also check.
  - h2 Example 4: sides √13, √73, √113 and √53, no parallel sides, Varignon square of side 5.
  - Star tip angles and the inscribed-angle check.
  - The 17 combinations and 21 vertex types, by enumeration.
- Facts, checked against Wikipedia ("Varignon's theorem"; "Euclidean tilings by convex regular polygons"):
  - Varignon lived 1654–1722, and his proof was published after his death in 1731.
  - The six vertex types that appear in no tiling, and the four that appear only in tilings that mix vertex types.
  - The 3 regular and 8 semiregular tilings. The local definition (same vertex type everywhere) and the global one (vertex-transitive) give the same 11 in the plane.
  - Kepler's *Harmonices Mundi* (1619) was the first systematic treatment.
- Other facts:
  - Euler's 1765 paper (Lesson 16) agrees with "in the 1760s".
  - The incenter is on the Euler line only for isosceles triangles.
  - The h2 classification table, including the kite row, is a real "if and only if" for convex quadrilaterals under this course's exclusive definitions.
  - The isosceles-trapezoid converse is valid.
- Drills: I generated all 5 r2 drills 2,000 times each with the app's generator and recomputed every answer independently in Python, with 0 mismatches.
  - geo-m5-r2-orthocenter: answers are whole numbers.
  - geo-m5-r2-varignon: the quadrilateral is always convex, the stated area K is correct, and the 2-decimal perimeter is accepted (tolerance 0.02).
  - geo-m5-r2-star-angle: {n/k} is always valid. Answers rounded to 2 decimals are accepted (default tolerance 0.01), and answers off by 0.05 are rejected.
  - geo-m5-r2-vertex-fill: only valid combinations come up.
- Pictures: I rendered all 14 SVGs (5 with their label markers) and checked the coordinates in Python.
  - Circumcircle radii are equal, and the triangles are acute, right and obtuse as labelled.
  - The angle bisector's foot is at the correct ratio.
  - In the centroid figure, G, M and N are the exact centroid and midpoints.
  - The anticomplementary vertices are B + C − A and so on, and the altitude feet are correct.
  - The Varignon midpoints are correct.
  - The diagonal-pattern tick marks match their shapes, and the tiling patches are correct.
  - The shape figures (isosceles trapezoid, kite, Euler line, L-hexagon, pentagram) are correct and readable.
- Mermaid: all 6 diagrams render, are correct, and have accTitle and accDescr.

## Overlap

- geo-h1 `92-euler-nine-point.md` also proves the Euler line, by a transformation rather than coordinates. It uses Lesson 16's triangle (0,0), (6,0), (2,4) as a worked example, the same as this module's h1 Example 3. Its drill geo-h1-r2-euler-coords practises H = 3G − 2O like geo-m5-r2-euler. The proofs complement each other, but the worked example and the drill are duplicated. I changed nothing in geo-h1.
- `medial triangle` is defined only in glossary-r2-geo-m5.yaml at present, so there is no duplicate.

## Left uncertain

- In geo-m5-r2-q11, marker 5 sits just beside the exterior-angle wedge rather than on it. It is clear in the preview, but it is not exactly on the part.
- In Lesson 16's "which center?" chart, the final "no" branch sends every remaining need to the orthocenter. That is acceptable as a guide to the four centers, not as a rule.

# Round 2 notes: pre-m8 (Measurement and geometry)

`content/math/check-module.sh prealgebra pre-m8`: build and checker OK, zero problems.

## Honors lessons (3)

The module has six core lessons, so it gets three honors lessons. All are `honors: true`, 35–45 minutes, and about 1,500–1,650 words. Each has at least five worked examples, a "Common mistakes" section and "Key points".

| File | Id | Title | Topic |
|---|---|---|---|
| 35h1-polygon-angles.md | pre-m8-h-polygon-angles | Angles of polygons and tilings | Polygon angles |
| 35h2-cones-spheres.md | pre-m8-h-cones-spheres | Pyramids, cones and spheres | Cones, pyramids and spheres |
| 35h3-measurement-error.md | pre-m8-h-measurement-error | Precision and measurement error | Measurement error |

- **35h1:** the interior angle sum $(n-2)\cdot180°$, proved by triangulating from one vertex; regular polygons; exterior angles summing to 360° (shown by walking around the polygon, then checked with algebra); and why only three regular polygons tile a floor. It ends with a note on the honeycomb conjecture (Hales, 1999).
- **35h2:** where the one-third in $V=\tfrac13Bh$ comes from (a cube splits into three identical pyramids, then Cavalieri's principle, labeled as accepted without proof); slant height by the Pythagorean theorem; the surface areas of a square pyramid and of a cone, with $\pi r\ell$ derived from the unrolled sector; sphere and hemisphere; Archimedes' sphere and cylinder (cone : sphere : cylinder = 1 : 2 : 3) and Cicero's account of his tomb.
- **35h3:** precision, greatest possible error, lower and upper bounds (with $6.5 \le L < 7.5$ under this course's ties-round-up rule), accuracy vs precision, relative and percent error, how errors grow when computing area and volume from bounds, and not reporting false precision. It cross-references the significant-figures honors lesson in pre-m6 (22h2) instead of re-teaching it.

**Changed during writing:** my first 35h1 was on scaling area and volume ($k^2$, $k^3$, the square–cube law). The pre-m4 writer's 16h3-scaling-area-volume.md covers the same ground, so I deleted my lesson, its image, questions, drills, glossary entries and cards, and wrote the polygon-angles lesson instead. For the same reason I dropped my glossary entry for "significant figures", which pre-m6 defines.

## Core lessons (additions only)

| Lesson | Added |
|---|---|
| 30-units | metric-prefix staircase SVG; Mermaid flowchart of the dimensional-analysis loop |
| 31-angles | angle-types SVG (acute, right, obtuse, straight); two Mermaid charts that classify triangles by angles and by sides |
| 32-area | trapezoid-parts SVG, with one added sentence naming the legs and the height; Mermaid "which area formula" chart (LR) |
| 33-circles | circle-parts SVG; SVG of 12 wedges rearranged into a near-parallelogram (the πr² argument); Mermaid "finding the radius from d, C or A" chart |
| 34-volume | cylinder-and-net SVG; Mermaid "perimeter, area, surface area or volume?" chart (LR) |
| 35-pythagorean | Mermaid "hypotenuse or leg?" chart |

## Questions: `questions/r2-pre-m8.yaml` (70)

- **Core lessons, `pre-m8-r2-q01` to `q30`:** 5 per lesson. By type: 9 text, 6 select-all, 6 match, 5 order, 4 label (angle types, trapezoid parts, circle parts, cylinder net). 12 are marked `module_quiz: true`, 2 per lesson.
- **Honors, `pre-m8-r2-h01` to `h40`:** 14 / 13 / 13 questions for the three lessons. By type: 20 multiple choice, 7 text, 5 select-all, 3 match, 3 order, 2 label (pentagon interior and exterior angles, cone parts).
- The correct choice positions in the multiple-choice questions are spread 5 / 5 / 5 / 5.

## Drills: `drills/r2-pre-m8.yaml` (9)

polygon-sum, regular-angle, polygon-sides (35h1); cone-volume, sphere, slant-height (35h2); bounds, area-bounds, percent-error (35h3). All ids start with `pre-m8-r2-`. Answers rounded to the nearest tenth have tolerance 0.051, and exact bounds have tolerance 0.0001. The bounds drill never shows a measurement with misleading trailing zeros, because its `where` rules out multiples of 10 and, for half-centimeter precision, even values of n. Numbers placed inside TeX use `dp0`, so they never get a thousands comma.

## Pictures (17 SVG files)

pre-m8-metric-stairs, pre-m8-angle-types(+blank), pre-m8-trapezoid-parts(+blank), pre-m8-circle-parts(+blank), pre-m8-circle-wedges, pre-m8-cylinder-net(+blank), pre-m8-h-hexagon-triangles, pre-m8-h-polygon-angles(+blank), pre-m8-h-tilings, pre-m8-h-cone-parts(+blank), pre-m8-h-ruler. Every file is original and under 5 KB. I previewed each one, and checked each blank with its label markers.

The honors lessons also use inline figures: a ```shape of a sphere inside a cylinder and a ```numberline of the interval 6.5 ≤ L < 7.5.

## Glossary and cards

- **`glossary-r2-pre-m8.yaml` (20 terms):** diagonal, interior angle, convex, exterior angle, tessellation (alias tiling); pyramid, apex, cone, slant height, Cavalieri's principle, lateral surface, sphere, hemisphere; precision, greatest possible error (GPE), lower bound, upper bound, accuracy, relative error, percent error. I checked every glossary file in the course for duplicate terms and aliases, and found none.
- **`cards-r2-pre-m8.yaml` (29 cards):** 10 for Polygon angles, 10 for Cones, pyramids and spheres, 9 for Measurement error.

## For a reviewer

- **35h1 honeycomb note:** says Hales proved the honeycomb conjecture "in 1999". That is when the proof was announced; it was published in 2001. The bee explanation is labeled as a common explanation.
- **35h2 Great Pyramid figures:** base about 230 m and height about 147 m give about 2.59 million m³. The usually quoted figure is about 2.6 million m³.
- **35h2 Archimedes:** dated "in the 200s BC" on purpose. The tomb story is attributed to Cicero.
- **35h3 vs pre-m6 22h2:** both mention that trailing zeros show precision (12.00 s vs 12 s). The two lessons approach it from different sides (bounds there, significant figures here) and don't contradict each other.
- **Label positions:** the angle-types and polygon-angles markers sit on the angle arcs, not on the vertex dots.
- **Existing content:** I found no errors in the existing pre-m8 questions, drills, cards or glossary, and edited none of them.

## Sources

The formulas are standard. Facts I checked:
- the Great Pyramid's original dimensions (about 230.3 m base, 146.6 m height);
- Galileo's scaling argument (*Two New Sciences*, 1638), though it was dropped along with the scaling lesson;
- Archimedes' *On the Sphere and Cylinder*, and Cicero's *Tusculan Disputations* V on finding the tomb in 75 BC;
- Hales' proof of the honeycomb conjecture (1999 preprint, published 2001 in *Discrete & Computational Geometry*);
- the decomposition of a cube into three congruent square pyramids.

I recomputed every number in Python.

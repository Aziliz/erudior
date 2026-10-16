# Geometry (math-geometry) — progress

Prefix: `geo-`. Modules geo-m1 … geo-m10. Refs: geo-ref-measure (area/volume/circle formulas),
geo-ref-theorems (angles, triangles, quadrilaterals, circles), geo-ref-coord (coordinate, trig, transformations).

## Outline (38 lessons)

### geo-m1 Foundations: points, lines, angles
1. 01 geo-basics — Points, lines, planes (undefined terms, postulates, segments/rays). Drills: geo-segadd
2. 02 geo-measure — Measuring segments and angles (ruler/protractor postulates, midpoint, bisector). Drills: geo-segadd, geo-midpoint-alg, geo-angadd
3. 03 geo-anglepairs — Angle pairs. Drills: geo-comp-supp, geo-vertical-alg
4. 04 geo-construct — Constructions. Drills: geo-angbis, geo-midpoint-alg

### geo-m2 Reasoning and proof
5. 05 geo-conditional — Inductive reasoning and conditional statements. Drills: geo-pattern-lines
6. 06 geo-deductive — Deductive reasoning and algebraic proof. Drills: geo-alg-proof
7. 07 geo-proofs — Two-column and paragraph proofs. Drills: geo-vertical-alg, geo-alg-proof

### geo-m3 Parallel and perpendicular lines
8. 08 geo-transversals — Parallel lines, transversals, proving lines parallel. Drills: geo-parallel-angles, geo-parallel-x
9. 09 geo-perp-slope — Perpendicular lines and slope. Drills: geo-perp-slope, geo-perp-line, geo-point-line-dist

### geo-m4 Triangles and congruence
10. 10 geo-tri-angles — Classification, angle sum, exterior angle. Drills: geo-tri-sum, geo-ext-angle
11. 11 geo-congruent — Congruent figures, SSS, SAS. Drills: geo-cong-x
12. 12 geo-asa-hl — ASA, AAS, HL, CPCTC. Drills: geo-cpctc
13. 13 geo-isosceles — Isosceles and equilateral triangles. Drills: geo-isos-base, geo-isos-alg
14. 14 geo-tri-ineq — Triangle inequalities. Drills: geo-tri-range

### geo-m5 Special segments, polygons, quadrilaterals
15. 15 geo-bisectors — Perpendicular and angle bisectors; circumcenter, incenter. Drills: geo-perp-bis-alg, geo-circumcenter
16. 16 geo-medians — Medians, altitudes, midsegments; centroid, orthocenter. Drills: geo-centroid, geo-centroid-len, geo-midsegment
17. 17 geo-polygons — Polygon angle sums. Drills: geo-poly-interior, geo-poly-sides
18. 18 geo-parallelograms — Parallelograms. Drills: geo-para-alg
19. 19 geo-special-quads — Rectangles, rhombuses, squares, trapezoids, kites. Drills: geo-trap-midseg, geo-rhombus-side

### geo-m6 Similarity and right triangles
20. 20 geo-similar — Similar polygons, scale factor, ratios. Drills: geo-sim-side, geo-scale-area
21. 21 geo-sim-thm — AA, SSS, SAS similarity; side splitter; angle bisector theorem. Drills: geo-side-splitter, geo-angbis-thm
22. 22 geo-pythag — Pythagorean theorem and converse. Drills: geo-pyth-hyp, geo-pyth-leg
23. 23 geo-special-right — Special right triangles, geometric mean. Drills: geo-454590, geo-306090, geo-geomean
24. 24 geo-trig — Sine, cosine, tangent. Drills: geo-trig-side, geo-trig-angle, geo-elevation

### geo-m7 Circles
25. 25 geo-circle-basics — Arcs, central angles, arc length. Drills: geo-arc-length, geo-arc-measure
26. 26 geo-chords-tangents — Chords and tangents. Drills: geo-chord-dist, geo-tangent-len
27. 27 geo-inscribed — Inscribed angles; chord/secant/tangent angles. Drills: geo-inscribed, geo-secant-angle
28. 28 geo-circle-seg — Segment lengths; equation of a circle. Drills: geo-chord-chord, geo-secant-secant, geo-circle-eq

### geo-m8 Area and volume
29. 29 geo-area-poly — Area of polygons. Drills: geo-area-trap, geo-area-kite, geo-area-tri-sas
30. 30 geo-area-circle — Circles, sectors, regular polygons. Drills: geo-sector-area, geo-reg-poly-area
31. 31 geo-surface — Surface area. Drills: geo-sa-cyl, geo-sa-cone, geo-sa-prism
32. 32 geo-volume — Volume, Cavalieri, similar solids. Drills: geo-vol-cone, geo-vol-sphere, geo-vol-pyramid

### geo-m9 Coordinates and transformations
33. 33 geo-coord — Distance, midpoint, partition, coordinate proof. Drills: geo-distance, geo-midpoint, geo-partition
34. 34 geo-rigid — Translations, reflections, rotations. Drills: geo-reflect, geo-rotate
35. 35 geo-dilation — Dilations, compositions, symmetry. Drills: geo-dilate, geo-rot-sym

### geo-m10 College extensions
36. 36 geo-axiomatic — Axiomatic systems, Euclid's postulates. Drills: geo-pattern-lines
37. 37 geo-non-euclid — Parallel postulate, non-Euclidean geometry. Drills: geo-sph-excess
38. 38 geo-probability — Geometric probability. Drills: geo-prob-length, geo-prob-area

## Status — COMPLETE

All 10 modules written; `python3 content/math/build.py geometry` and
`npx tsx tests/check-course.mts samples/math/math-geometry.json` both report zero problems.

Final counts: 38 lessons (10 modules), 425 questions (answer index spread ~even: 0/1/2/3),
92 drills (most with shape/plot figures), 164 notecards, 287 glossary terms, 3 reference sheets
(geo-ref-measure, geo-ref-theorems, geo-ref-coord).

Checks done:
- Numeric question answers re-computed in Python (sympy/math) — all match the keyed choice.
- Every lesson topic has questions; every module quiz covers every topic in its module.
- Every drill is linked from a lesson (1–3 per lesson); every bolded key term has a glossary entry
  (remaining unmatched bolds are emphasis in "Common mistakes" bullets).
- Lesson and drill figures rendered to PNG and eyeballed.

For a reviewer:
- Glossary has 287 terms, above AUTHORING's 120–250 guideline (task asked for 150+).
- A few lessons run ~870–890 words by a strict count (math tokens counted as words); all others 900–1300.
- Lesson 37 figures (sphere triangle, Poincaré disk) are schematic.
- Trapezoid defined as "exactly one pair of parallel sides" (stated explicitly in lesson 19).
- Helper scripts (not part of the course) are in the shared scratchpad under geometry-agent-x7/.

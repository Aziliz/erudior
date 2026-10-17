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


## Review (2026-10-16)

Independent review in three parts: every question solved before checking its key, every lesson example and proof checked, every drill generated hundreds of times against an independent solver. All answer keys were correct. Also: geo-sa-cyl no longer asks for volume (taught in lesson 32); new drill geo-vol-cyl on lesson 32.

# Geometry review A (geo-m1 to geo-m4, lessons 01-14, questions/drills m1-m4, cards.yaml)

All 90 questions were solved independently before reading the keys, and every key was correct.
I generated 400 instances of each of the 24 drills (9,600 in total) and checked each against a
sympy solve of the prompt as shown: none was wrong. Typing the displayed answer is accepted in
every instance. Lesson and drill figures were rendered and screenshotted.

## Lessons
- 01: The "two planes meet in a line" figure drew no line of intersection. Its dashed segment was
  just an edge of plane Q. Redrew it with a vertical plane Q crossing P along a segment labeled ℓ,
  and updated the caption.
- 10: The "isosceles" example triangle (6,0),(10,0),(8,2) actually had a 90° apex, so it was also a
  right triangle. Moved the apex to (8,3).
- 11: Example 3 proved congruence by SSS using BC = √(4²+3²), which needs the Pythagorean theorem /
  distance formula from Modules 6 and 9. Rewrote it to use SAS (right angles from horizontal and
  vertical sides), with a note that SSS also works after Module 6.
- 12: The HL justification uses the Pythagorean theorem. Added "(Module 6)" so the reference is marked.

## Questions
- 0101, 0110, 0503, 1105: removed Markdown italics (*...*) from the explanations.
- 0509: the explanation said "The first is the definition…", which refers to a choice by its
  position. Reworded to refer to the content.
- 0908: the explanation named the wrong mistakes behind the distractors ("forgetting the square
  root" gives none of them). It now says: 39 = no division; 39/17 = dividing by 5+12; 29/13 =
  dropping the +10.
- 1109: the answer choice and explanation relied on the hypotenuse 13 (Pythagorean theorem, which
  comes later). Changed the choice to "Yes, by SAS: each has legs 5 and 12 with a right angle
  between them" and rewrote the explanation.
- 1110: two choices were the same thing (both SAS). Replaced one with "Two pairs of congruent sides
  and a shared third side" (SSS) and updated the explanation.

## Drills (ugly output only; no wrong answers)
- "+ 0" in solutions: added where-conditions to geo-segadd and geo-angadd (b + d != 0),
  geo-consec-int (180 - a*p - c*p != 0), geo-tri-sum (b + d + f != 0) and geo-ext-angle
  (b + d != 0).
- Redundant "so $x = 8$ and $x =$ **8**" when the collected coefficient was 1: required a coefficient
  difference ≥ 2 or ≠ 1 in geo-midpoint-alg, geo-vertical-alg, geo-angbis, geo-alg-proof,
  geo-parallel-x, geo-ext-angle, geo-cong-x, geo-cpctc and geo-isos-alg.

## cards.yaml
All 164 cards were checked and no errors were found.

## Final state
`python3 content/math/build.py geometry` and `npx tsx tests/check-course.mts
samples/math-drafts/math-geometry.json` both pass: OK, no problems.
Nothing unresolved, and no errors were seen in files outside this scope.

# Geometry review, modules geo-m5 to geo-m7 (lessons 15–28)

Method: solved all 101 questions independently before reading keys; re-derived every lesson
example; rendered all 31 lesson figures and 2 instances of every drill figure (Playwright
screenshots); generated 500 instances of each of the 41 drills and checked every target
against an independent calculation parsed from the shown prompt, plus display/rounded-answer
acceptance and exact forms (5sqrt(2), 3pi/4, 6pi).

## Questions (all 101 keys correct)
- geo-q-2307: two distractors were the same value ($5\sqrt3$ and $\sqrt{75}$). Replaced
  $\sqrt{75}$ with $10\sqrt3$ (wrong-piece mistake) and explained it.
- geo-q-1502, geo-q-1910: explanations used Markdown italics (`*sides*`, `*each other*`). Removed.
- geo-q-1912: stem "bisected by the longer one, which it meets 4 units from one end" was
  ambiguous about which diagonal the 4 units is on. Reworded: "The longer diagonal bisects the
  shorter one, and the diagonals cross 4 units from one end of the longer diagonal."

## Drills
- geo-shadow: placeholder collision. Calc value `H` filled `\dfrac{H}{…}` in the solution
  ("\dfrac75.2{47}"). Renamed the value to `ht`.
- geo-elevation: same collision (`\dfrac{H}{{d}}` showed the number). Renamed to `ht`.
- geo-scale-area: answers used relTolerance 0.001 but the shown answer is rounded to 2
  decimals; for small values (e.g. 3.56) the 2-decimal answer was rejected. Switched to
  tolerance 0.01. Solution showed `\tfrac{4}{1}` and "288.00"; now shows k as a reduced
  fraction and plain numbers.
- geo-para-angle, geo-cyclic-quad: solution could show "12x + 0 = 180". Added
  `(a + c)*p != 180` to `where`.
- geo-radians: solution showed "\dfrac{1\pi}{12}" and "\dfrac{1\pi}{1}". Used `{num:coef}`;
  replaced the 180° choice (den 1) with 100°.
- geo-proportion: "1x"/"-1x" possible; now `{lhs:coef}`.
- geo-perp-bis-alg, geo-midsegment, geo-para-alg: solutions printed "x = 7, x = **7**"
  when the coefficient was 1; now "Collect terms: (a - c)x = d - (b), so x = **p**".
- geo-perp-bis-alg: figure height was sqrt(PA² - 9), so for PA up to 147 the triangle was a
  needle ~25x taller than wide. AB isn't given, so the figure is now a fixed schematic.
- geo-circumcenter: solution printed "y - (0) = -2(x - (-3))"; rewritten as rise/run from
  the midpoint with signed values.
- geo-circle-eq: "(x - (-2))^2" now "(x + 2)^2".

## Lessons
No mathematical errors found in lessons 15–28. All worked examples, proofs, and figure
coordinates check out (circumcircle, incircle tangency point, centroid/midpoints, kite,
rhombus right angle, 30-60-90 and 45-45-90 angle labels, geometric-mean triangle, secant
points, chord intersection E = (-1, 4/3), circle plot). Cross-references (Lessons 13, 14,
22, 23; Module 8) point to existing material.

## Notes / unresolved (not errors)
- Lesson 25 parts-of-a-circle figure: "radius" label sits close to the secant line;
  lesson 26/27 point labels crowd their dots. Cosmetic only, left alone.
- geo-elevation figure: for small angles (~10°) the angle label touches the hypotenuse. Cosmetic.
- Nothing seen outside scope that needs fixing.

Build: `python3 content/math/build.py geometry` OK; `npx tsx tests/check-course.mts
samples/math-drafts/math-geometry.json` reports OK (zero problems).

# Geometry review: modules geo-m8 to geo-m10, glossary, references

All 102 questions in m8–m10 were solved independently. Numeric ones were checked in Python (qcheck.py). All 27 drills were run 1000–2000 times against independent formulas, and the displayed answer and 2-decimal answers were typed back in (drills.mts). Every lesson figure and drill figure was rendered and screenshotted (figs.mts, shot.py).

## Questions
- geo-q-3301: the explanation used Markdown italics (*change*). Now plain text.
- geo-q-3609: the explanation used Markdown italics for the book title. Removed them, and added "lies on" to Hilbert's undefined terms. In the stem, "complete, rigorous" is now "rigorous, gap-free", because "complete" is a technical term defined in this lesson.
- geo-q-3307 and geo-q-3606: the explanations referred to choices by position ("the first two", "the third"). They now name the choices.
- geo-q-3803: two choices had the same value (3/4 and 9/12). Replaced 9/12 with 1/12.
- All answer keys are correct, and each question has exactly one correct choice.

## Drills
- geo-rot-sym: the solution had `\tfrac{360^\circ}{n}`, and `{n}` was filled with the number, so it rendered as a broken fraction ("360°/1 5"). Now written as `360^\circ / n`.
- geo-sph-excess: some generated angle sets were not valid spherical triangles (for example 150, 150, 50; each angle must satisfy A + B − C < 180). Added the three conditions to `where`, and removed the redundant sum < 540 check. The area used relTolerance 0.001, so small areas rejected the shown 2-decimal answer. It now uses tolerance 0.02, which also covers working with the solution's 4-decimal radians.
- geo-sa-cyl (volume) and geo-vol-cone: relTolerance 0.0005 rejected the shown 2-decimal answer for small values (for example 1.05). Both now use tolerance 0.01.
- geo-reg-poly-area: rounding the apothem to 2 decimals, as the prompt asks, and then computing the area was rejected (relTolerance 0.001). It now uses relTolerance 0.004.
- geo-partition: the `where` filter often failed all 500 tries and threw "no inputs met". The ratio change is now generated as (m+n)·u, so it always produces a problem.
- geo-vol-pyramid: the prompt didn't say how to give a volume that isn't a whole number. Added "(2 decimals if needed)".
- geo-prob-meet, geo-sa-cyl, geo-vol-sphere: numbers inside TeX were shown with thousands commas ("2,025" renders as "2, 025"). These now use `:dp0`.

## Lessons
- L31: "A cone is the limit of pyramids with circular bases" was self-contradictory. Now: the limit of regular pyramids as the number of base sides grows.
- L36: the equivalents of the parallel postulate were said to follow "given postulates 1–4". That is not true from Euclid's five postulates alone, so it now says "given the rest of Euclid's assumptions". Hilbert's axioms were called "complete", which clashed with the lesson's own definition of completeness. Now "rigorous, gap-free", and "lies on" was added to his undefined terms.
- L37: the lesson said elliptic geometry identifies opposite points because lines don't extend forever. That reasoning was wrong: identifying them is what makes two points determine exactly one line. Rewrote the bullet and paragraph.
- L38: Example 7 was titled "a random chord problem" but isn't one. Retitled.
- All worked examples, proofs, historical claims and figures were checked and are correct.

## Glossary and references
- Added "Area Congruence Postulate", which is bolded in L29 but had no glossary entry.
- "non-Euclidean geometry" said these geometries keep all of Euclid's other postulates, which is untrue of elliptic geometry. Reworded.
- The reference sheets coord.md, measure.md and theorems.md are correct.

## Notes (not changed)
- geo-sa-cyl, which L31 links, also asks for volume, which isn't taught until L32. I kept it because cylinder volume has no other drill.
- Small cosmetic overlaps in drill figures: the "center" label in geo-reg-poly-area, and the angle label on small angles in geo-sector-area.
- No errors were noticed in files outside this scope.

Final state: build OK, and check-course reports OK with 0 problems on 4 runs.

## Gap lessons (2026-10-17)

Fills the gaps listed in VERIFY.md ("Coverage gaps") and makes the source-check sections quizzable.
Totals now: 41 lessons, 476 questions, 103 drills, 184 cards, 300 glossary terms, 3 reference sheets.
Build and check-course: zero problems.

### New lessons
| File | id | Module | Title |
|---|---|---|---|
| lessons/25-law-of-sines.md | geo-law-sines | geo-m6 | The Law of Sines (incl. sine/cosine of obtuse angles, SSA ambiguous case) |
| lessons/26-law-of-cosines.md | geo-law-cosines | geo-m6 | The Law of Cosines and solving any triangle |
| lessons/38-parabolas-similar-circles.md | geo-parabola | geo-m9 | Parabolas from focus and directrix; all circles are similar |

Renumbered files (ids unchanged): old 25–35 are now 27–37, old 36–38 are now 39–41.
In-text lesson numbers updated: "Lesson 28" → 30 (coordinate geometry intro), "Lesson 30" → 32 (volume, ring example).
New cross-references: lesson 11 (SSA) → Lesson 25; lesson 24 intro → next two lessons; lessons 27 and 32
("all circles are similar") → Lesson 38; lesson 37 → next lesson.
course.yaml: description mentions the new topics; no module changes; id/revision/released/order untouched.

### New questions (51)
- geo-law-sines: geo-q-2451 – geo-q-2463 (13; module quiz 2451, 2454, 2455, 2463)
- geo-law-cosines: geo-q-2471 – geo-q-2482 (12; module quiz 2471, 2473, 2477, 2481)
- geo-parabola: geo-q-3551 – geo-q-3563 (13; module quiz 3551, 3553, 3560, 3561)
- Task B: geo-construct (square inscribed in a circle) geo-q-0412 – 0415 (mq 0412);
  geo-bisectors (constructing circumcircle/incircle) geo-q-1512 – 1515 (mq 1512);
  geo-surface (cross sections, solids of revolution) geo-q-3112 – 3116 (mq 3112, 3114).

### New drills (10)
- m6: geo-los-side, geo-los-angle, geo-los-ambiguous (Law of Sines); geo-loc-side, geo-loc-angle, geo-loc-solve (Law of Cosines)
- m9: geo-parabola-eq (expression answer), geo-parabola-focus, geo-circle-similar
- m8: geo-revolve-sa (cone from a right triangle spun about a leg), linked from lesson 33 (geo-surface)

### Also added
- Glossary (10): oblique triangle, Law of Sines, ambiguous case, Law of Cosines, solve a triangle, parabola, focus, directrix, axis of symmetry, vertex of a parabola.
- Cards (20): 11 Law of Sines/Cosines/solving triangles, 6 parabolas/similar circles, 3 for the Task B sections.
- References: theorems.md gets an "Any triangle (oblique triangles)" table; coord.md gets parabola rows, obtuse-angle sin/cos, and the circle-similarity note.

### Verification
- Every new question solved in Python (scratch keycheck.py/qcheck.py) before fixing keys; all keys match; SSA counts checked by a separate case function; parabola equations checked with sympy.
- Each new drill generated 500–600 times (drills.mts): targets match an independent solver that reads the prompt text; displayed answer and a 2-decimal answer accepted; a wrong answer rejected; no "+ -"/"+ 0" artifacts.
- Rounded-intermediate check: for geo-loc-solve, a learner rounding $a$ to 2 decimals can be off by up to ~0.14° in the angles, so those boxes use tolerance 0.15 (others 0.01–0.02).
- All new lesson and drill figures rendered and eyeballed.

### Notes for a reviewer
- course.yaml revision was not bumped (not allowed in this task); the changelog still describes the source check. Whoever releases this should bump revision and mention the three new lessons.
- Lesson 33 (geo-surface) now links 4 drills (AUTHORING suggests 1–3); geo-revolve-sa is the only drill for solids of revolution.
- No new drill for lesson 04 (inscribing a square needs the Pythagorean theorem, which comes in Module 6) or lesson 15 (the construction itself is not a computation; geo-circumcenter and geo-incenter-dist already cover the numbers).
- Lesson 25 extends sine/cosine to obtuse angles with a coordinate definition (lesson 24 only defined acute ratios); lesson 26's proof uses it.
- Conventions in VERIFY.md kept; the circle proof uses positive-k dilations only, as in lesson 37.

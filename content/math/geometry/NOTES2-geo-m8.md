# Round 2 notes: geo-m8 (Area, surface area and volume)

Check: `content/math/check-module.sh geometry geo-m8` gives 7 lessons, 114 questions, 22 drills, 52 cards. Result: OK (0 problems). (The only warning is about another writer's `cards-r2-geo-m9.yaml`.)

## Honors lessons (3)

The module has four core lessons and three clearly separate ideas worth going deeper on, so it has three honors lessons. None overlaps the other honors lessons in the course (checked against every `*h*.md` file, including 19h3 on tilings, which uses angles around a point for flat tilings, not solids).

| File | Id | Title | Words | Questions | Drills |
|---|---|---|---|---|---|
| 34h1-polyhedra.md | geo-m8-h-polyhedra | Regular polyhedra, Euler's formula and angle defect | ~1,760 | h01–h14 | geo-m8-r2-vef-family, geo-m8-r2-angle-defect |
| 34h2-frustums-pappus.md | geo-m8-h-frustums-pappus | Frustums, spherical caps and Pappus's theorem | ~1,750 | h15–h29 | geo-m8-r2-frustum-volume, geo-m8-r2-cap-volume, geo-m8-r2-torus |
| 34h3-isoperimetric.md | geo-m8-h-isoperimetric | The isoperimetric problem: the most area for the least fence | ~1,690 | h30–h44 | geo-m8-r2-fence-wall, geo-m8-r2-ngon-perimeter, geo-m8-r2-best-can |

- **Polyhedra.** Definition of a regular polyhedron (the bipyramid shows why both conditions are needed), the proof that there are only five (angle sum at a vertex below 360°), counting E and V from the faces, duals, angle defect and Descartes' theorem, with a derivation from Euler's formula. Also the soccer ball (truncated icosahedron), the proof that a polyhedron made of pentagons and hexagons with three at each vertex always has exactly 12 pentagons (fullerenes), the picture-frame solid with V − E + F = 0, the Euler characteristic, and a labeled sketch of why V − E + F = 2. 3 worked examples, 2 SVGs, 1 Mermaid diagram, 1 table.
- **Frustums, caps, Pappus.** Frustum volume derived as a big cone minus a similar small cone, with checks at r = 0 and r = R and the "average the ends" mistake. Pyramid frustum (Moscow Papyrus), frustum lateral area, spherical cap base radius, cap volume derived from Lesson 34's Archimedes/Cavalieri comparison plus the frustum formula, and Archimedes' hat-box theorem (stated, proof not given; labeled). Pappus's theorems (stated, labeled as needing calculus) checked on a cone and a pipe, then the torus. 6 worked examples: bucket, lampshade, water in a bowl, fraction of Earth north of the Arctic Circle, Pappus checks, doughnut. 3 SVGs.
- **Isoperimetric problem.** Dido legend (labeled as legend), best rectangle via LW = (P/4)² − t², and the AM–GM inequality with an algebraic and a geometric (semicircle) proof. Then the best pen against a wall, with a reflection argument, the best triangle via Heron plus three-number AM–GM (stated without proof), regular n-gons A = P²/(4n tan(180°/n)), the isoperimetric inequality and quotient, and Steiner's arguments and their gap. In 3D: the least-area box (a cube) and can (h = 2r), with the real-can caveat, soap bubbles and Hales's honeycomb theorem. 4 worked examples, 1 SVG, 1 plot, 2 tables.

## Core lessons (additions only, nothing rewritten)

| Lesson | Added | New questions |
|---|---|---|
| 31 Area of polygons | SVG trapezoid parts; plot of the grid triangle in its enclosing rectangle (Example 6); new short section "Choosing a formula" with a Mermaid decision chart | q01 label, q02 text, q03 match, q04 select-all, q05 order |
| 32 Circles, regular polygons | SVG circle cut into 12 wedges and rearranged; SVG labeled regular octagon; Mermaid steps for regular polygon area | q06 label, q07 text, q08 order, q09 match, q10 select-all |
| 33 Surface area | Mermaid "naming a solid" chart; SVG cylinder and its net; SVG cone parts | q11 label, q12 text, q13 match, q14 select-all, q15 order |
| 34 Volume | Mermaid "choosing a volume formula" chart; SVG square pyramid parts (height, slant height, lateral edge); SVG cone, sphere and cylinder in the ratio 1 : 2 : 3; SVG hemisphere vs cylinder-minus-cone slice | q16 label, q17 text, q18 order, q19 match, q20 select-all |

Each core lesson has two `module_quiz: true` questions: q01, q03, q06, q09, q11, q13, q16, q19.

## Totals

- **Questions:** 64 in `questions/r2-geo-m8.yaml`.
  - Core: 20 (4 label, 4 text, 4 match, 4 order, 4 select-all).
  - Honors: 44. 34h1 has 14 (9 MC, 1 text, 1 match, 1 order, 1 select-all, 1 label); 34h2 has 15 (10 MC, 1 text, 1 match, 1 order, 1 select-all, 1 label); 34h3 has 15 (10 MC, 2 text, 1 match, 1 order, 1 select-all). The correct answers of the 29 four-choice MC questions are spread 7 / 8 / 7 / 7 over positions 0–3. No `module_quiz` (core-module honors lessons).
- **Drills:** 8 in `drills/r2-geo-m8.yaml`, all linked from the honors lessons.
- **Pictures:** 20 original SVGs (all under 11 KB): `geo-m8-trapezoid-parts` (+ `-blank`), `-circle-wedges`, `-regular-polygon` (+ `-blank`), `-cylinder-net`, `-cone-parts` (+ `-blank`), `-pyramid-parts` (+ `-blank`), `-archimedes`, `-hemisphere-slice`, `-platonic` (+ `-blank`), `-vertex-gaps`, `-frustum` (+ `-blank`), `-spherical-cap`, `-torus`, `-same-perimeter`. The six blanks are for label questions.
- **Diagrams:** 5 Mermaid (4 core, 1 honors), all with accTitle/accDescr. Plus 2 new `plot` figures.
- **Glossary:** 18 terms in `glossary-r2-geo-m8.yaml`: regular polyhedron, bipyramid, dual polyhedron, angle defect, Descartes' theorem, truncated icosahedron, Euler characteristic, frustum, spherical cap, hat-box theorem, centroid of a region, Pappus's theorem, torus, isoperimetric problem, arithmetic mean, AM–GM inequality, isoperimetric inequality, isoperimetric quotient. I checked every term and alias against every `glossary*.yaml` in the course, and there are no duplicates. Every bolded term in the 7 lessons has an entry; the other bold text is emphasis such as "Common mistakes" lead-ins and step labels.
- **Cards:** 31 in `cards-r2-geo-m8.yaml`: 4 core, 10 polyhedra, 9 frustums/caps/Pappus, 8 isoperimetric.

## Verification

- Every question was re-solved in Python, including the distractor values named in the explanations.
- Each of the 8 drills was generated 2,000 times with tsx (`generate`/`checkAll` on the built JSON). An answer computed independently from the raw inputs and rounded as the prompt asks was always accepted, and a wrong value was always rejected. The best-can drill also accepts the chain of rounding r first, then h = 2r and S from the rounded r. The frustum drill accepts exact answers typed like `3800pi`. No unfilled placeholders or comma-grouped numbers appear inside math.
- Every SVG, all 5 Mermaid diagrams and the 2 plots were rendered and looked at; label markers were checked with `--markers`.

## For a reviewer to double-check

- **History and attributions.** Descartes' angle-defect result (about 1630, published in the 1800s), Euler's formula (1750s), Euclid *Elements* Book XIII, Plato's *Timaeus*, the Moscow Papyrus (about 1850 BCE, square frustum 4, 2, 6 → 56), Pappus (300s CE) and Guldin (1600s), Zenodorus ("probably 2nd century BCE"), Steiner (1830s, with the existence gap closed "several decades" later; no name given), and Hales (honeycomb conjecture, 1999). I kept these deliberately general.
- **Simplifications that are labeled in the lessons:** Euler's formula proof is a sketch; the hat-box theorem and Pappus's theorems are stated, not proved; the three-number AM–GM is used without proof; Earth is treated as a sphere, with the Arctic Circle at about 66.56° N, giving about 4.1%; the h = 2r can ignores thicker lids. No real can dimensions are quoted.
- **"Polyhedron without holes."** The lesson says V − E + F = 2 for any polyhedron without holes and drops by 2 per hole. This is true for polyhedral surfaces; very strange "polyhedra" (for example, ones whose faces are not simple polygons) are not discussed.
- **Select-all with 3 of 4 correct:** q04 and h13.
- **Lesson 34 diagram:** the third branch, "they grow, then shrink: a ball", is a loose description of a sphere's cross sections, used only to steer to the formula.

## Errors found in existing content

None. No existing questions, drills, cards or glossary entries were edited.

## Sources

Standard geometry; every number was recomputed in Python. I did not look anything up online for this round. The historical facts come from my general knowledge of these standard references, and a reviewer may want to spot-check them: Euclid, *Elements* XIII; Coxeter, *Regular Polytopes* (Platonic solids, angle defect); Lakatos, *Proofs and Refutations* (history of Euler's formula); Hales, "The Honeycomb Conjecture" (Discrete & Computational Geometry, 2001); Bläsjö, "The Isoperimetric Problem" (American Mathematical Monthly, 2005) for Zenodorus and Steiner.

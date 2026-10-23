# NOTES2-geo-h1: Honors module geo-h1, Constructions and classic theorems

`content/math/check-module.sh geometry geo-h1`: build and checker report **zero problems** (4 lessons, 58 questions, 9 drills, 41 cards; 3 of the cards come from other writers' files that share the topic "Euler line").

## What was added

**Lessons** (module `geo-h1`, already `honors: true` in course.yaml):

| File | Id | Title | Min | Prose words* | Worked examples | Pictures / diagrams | Drills |
|---|---|---|---|---|---|---|---|
| 90-constructible-lengths.md | geo-h1-constructible | What compass and straightedge can build | 45 | ~2,100 | 4 (divide a segment into 5 parts; construct the golden ratio; ∛2 not constructible; which n-gons are constructible) + cos 20° cubic in text | ```shape product construction; geo-h1-sqrt.svg; Mermaid "why the three classical problems are impossible" | geo-h1-r2-parallel-product, geo-h1-r2-root-height |
| 91-ceva-menelaus.md | geo-h1-ceva-menelaus | Ceva's and Menelaus's theorems | 45 | ~1,600 | 4 (Ceva lengths; Gergonne point concurrency; Menelaus with an extended side; centroid 2 : 1 from Menelaus) + medians/bisectors/altitudes via Ceva | geo-h1-ceva.svg; geo-h1-menelaus.svg; Mermaid "Ceva or Menelaus?" | geo-h1-r2-ceva-third, geo-h1-r2-menelaus |
| 92-euler-nine-point.md | geo-h1-nine-point | The Euler line and the nine-point circle | 45 | ~1,650 | 3 (Euler line in coordinates for Lesson 16's triangle; its nine-point circle; right triangle) | geo-h1-euler.svg; Mermaid proof outline | geo-h1-r2-euler-coords, geo-h1-r2-right-euler |
| 93-ptolemy-cyclic.md | geo-h1-ptolemy | Cyclic quadrilaterals and Ptolemy's theorem | 45 | ~1,500 | 4 (rectangle gives Pythagoras; isosceles trapezoid diagonal √97; pentagon diagonal = golden ratio; PA = PB + PC with side 7) + Brahmagupta check (area 36) | geo-h1-ptolemy.svg; Mermaid "is it cyclic?" chart | geo-h1-r2-trap-diagonal, geo-h1-r2-brahmagupta, geo-h1-r2-equilateral-arc |

*Prose without Mermaid/figure source and image alt text.

Full proofs in the lessons: product/quotient/square-root constructions; Ceva (area proof and converse); Menelaus (perpendicular heights); Euler line (half-turn plus dilation about G, no coordinates); nine-point circle (dilation from H, parallelogram BHCA*, converse of Thales); Ptolemy (point K and two similar-triangle pairs). Stated without proof and labeled so: the converse "nothing else is constructible", the cubic-with-no-rational-root test, Lindemann's theorem, Gauss–Wantzel, Feuerbach's theorem, Ptolemy's inequality, Brahmagupta's formula, signed-ratio versions of Ceva/Menelaus.

**Questions** (`questions/r2-geo-h1.yaml`, geo-h1-r2-h01 to h58): 14 / 15 / 15 / 14 per lesson.
- 36 four-choice MC, correct positions 10 / 9 / 9 / 8.
- 22 other types (38%): 7 text, 4 select-all, 4 match, 4 order, 3 label (sqrt construction, Ceva figure, Euler line centers).
- `module_quiz: true` on 21 (5 / 5 / 5 / 6), covering all 8 topics.

**Pictures** (original SVG, 1.4–2.4 KB each, previewed with and without markers): geo-h1-sqrt.svg (+ -blank), geo-h1-ceva.svg (+ -blank), geo-h1-menelaus.svg, geo-h1-euler.svg (+ -blank; drawn from exact coordinates A(0,0), B(12,0), C(1,9), all nine points checked to lie on the circle), geo-h1-ptolemy.svg (∠ABK = ∠DBC = 35° checked). **Mermaid**: 4, each with accTitle/accDescr. **Shape figures**: 1.

**Drills** (`drills/r2-geo-h1.yaml`, 9): parallel-product, root-height, ceva-third, menelaus, euler-coords (4 boxes), right-euler (3 boxes), trap-diagonal, brahmagupta, equilateral-arc (2 boxes). Each generated 1,500 times with tsx against an independent formula: exact answer and the 2-decimal rounding accepted (tolerance 0.006 where the prompt asks for 2 places), answer + 1 rejected, Ceva/Menelaus segment answers always whole numbers, no unfilled placeholders, no "+ -" / "- -". 0 failures.

**Glossary** (`glossary-r2-geo-h1.yaml`, 18): constructible number, transcendental, Gauss–Wantzel theorem, Fermat prime, doubling the cube, angle trisection, squaring the circle, cevian, Ceva's theorem, Menelaus's theorem, Gergonne point, Euler points, nine-point circle, nine-point center, Feuerbach's theorem, Ptolemy's theorem, Ptolemy's inequality, Brahmagupta's formula. Checked against every glossary*.yaml: no duplicate terms or aliases. Bolded terms defined elsewhere and not redefined: **golden ratio** (glossary-r2-geo-m6), **concyclic** (glossary-r2-geo-m7), **medial triangle** (glossary-r2-geo-m5; I dropped my own entry), **transversal** (glossary.yaml).

**Cards** (`cards-r2-geo-h1.yaml`): 38 (11 / 9 / 9 / 9 by lesson).

## For a reviewer to double-check

- **Overlap with core-module honors lessons** (written at the same time). 19h1 (geo-m5) proves the Euler line with coordinates and the centroid 2 : 1; lesson 92 cites it and gives a coordinate-free proof plus the nine-point circle, and lesson 91 Example 4 gives a Menelaus proof of 2 : 1 and says so. 30h2 (geo-m7) proves the three concyclic tests and has the "which quadrilaterals are cyclic" table; lesson 93 originally repeated this and was cut to a short recap without proofs that cites 30h2; questions on those tests were replaced by Ptolemy questions. 26h3 (geo-m6) finds the pentagon's diagonal/side = φ with golden triangles; lessons 90 and 93 cite it and reach φ by construction and by Ptolemy. If those lessons are renamed or removed, the cross-references ("the Module 5/6/7 honors lesson …") need updating.
- **History** (hedged in the text): Wantzel 1837 (trisection, cube doubling, necessity in Gauss–Wantzel); Lindemann 1882; Gauss's 17-gon 1796 at age 18; Ceva 1678; Menelaus about 100 CE ("used a version of it" for spherical triangles); Euler 1765; nine-point circle "around 1821" by Brianchon and Poncelet and 1822 by Feuerbach; Ptolemy's *Almagest* about 150 CE (chord table, "an early kind of trigonometric table"); Brahmagupta 628 CE; neusis trisection "attributed to Archimedes".
- The statement "a whole number of degrees is constructible exactly when it is a multiple of 3°" (lesson 90, question h09) follows from Gauss–Wantzel; the lesson gives the reasons (3° = 18° − 15°; 1° would give 20°).
- Lesson 92 calls the map T "half-turn then dilation by 1/2", since Lesson 37 uses positive scale factors only (it mentions that some books call it a dilation by −1/2).
- Label question h44 (Euler figure): markers 2 (centroid) and 3 (nine-point center) are about 6% of the width apart; readable in the preview.

## Errors found in existing content

None. Read lessons 4, 15, 16, 21, 23, 29, 30, 37 and the overlapping honors lessons 19h1, 26h3, 30h1, 30h2.

## Sources

- Standard results as in Coxeter and Greitzer, *Geometry Revisited* (Ceva, Menelaus, Euler line, nine-point circle, Ptolemy); Courant and Robbins, *What Is Mathematics?* ch. III (constructible numbers, the three classical problems, Gauss–Wantzel).
- MacTutor History of Mathematics archive (Wantzel, Lindemann, Gauss, Ceva, Menelaus, Feuerbach, Ptolemy, Brahmagupta) for dates.
- All numbers checked in Python (sympy/fractions): every example, every numeric question key, figure coordinates, and the cyclic quadrilateral 3-5-7-7 with diagonals 7 and 8 (from the diagonal formulas for a cyclic quadrilateral).

# Round 2 notes: geo-m7 (Circles)

## Honors lessons (2)
- `lessons/30h1-power-radical-axis.md` (`geo-m7-h-power-radical`), "The power of a point and the radical axis", 45 min, about 2,100 words. Signed power $d^2 - r^2$ (derived from the line through the center), the power read off the general form $x^2 + y^2 + Dx + Ey + F$, the radical axis (proof by subtracting general forms, perpendicular to the line of centers, the common chord and common tangent cases), and the radical center of three circles. 4 worked examples, a Mermaid chart, an SVG and a plot.
- `lessons/30h2-concyclic-circumcircle.md` (`geo-m7-h-concyclic`), "Concyclic points and the circumcircle", 45 min, about 2,000 words. Three tests for concyclic points (the converse of the cyclic-quadrilateral theorem, the equal-angle converse of the inscribed angle theorem, the converse of intersecting chords), with proofs (the equal-angle test is labeled a proof sketch); a table of which special quadrilaterals are cyclic; the Extended Law of Sines $a/\sin A = 2R$ with a proof covering acute, obtuse and right angles; $R = abc/4K$; and the circle through three points in coordinates. 5 worked examples, a Mermaid chart and an SVG.

I chose 2 lessons rather than 3 because the module has only four core lessons. I left out Ptolemy's theorem because it may overlap with the `geo-h1` honors module ("Constructions and classic theorems").

## Core lessons (additions only)
- 27: SVG `geo-m7-arcs.svg` (Example 1's arcs) and a Mermaid chart (central angle to arc measure, arc length and radians).
- 28: a new short section, "Two right triangles", with SVG `geo-m7-chord-tangent.svg` and a Mermaid chart for which right triangle to draw.
- 29: SVG `geo-m7-angle-types.svg` (the four vertex positions with their arcs) and a Mermaid chart (where the vertex is, and which rule follows).
- 30: SVG `geo-m7-secant-tangent.svg`, a Mermaid chart for which product rule to use, a Mermaid chart of the completing-the-square procedure, and two sentences (with an example) on what a 0 or negative right side means (a single point, or no graph).

## Questions: `questions/r2-geo-m7.yaml` (48)
- Core (q01–q20, 5 per lesson): 4 label, 4 text, 4 match, 4 order, 4 select-all. 8 are `module_quiz` (2 per lesson).
- Honors, power and radical axis (h01–h14): 7 multiple choice, 2 text, 2 select-all, 1 order, 1 match, 1 label.
- Honors, concyclic and circumradius (h15–h28): 8 multiple choice, 3 text, 1 select-all, 1 order, 1 match.
- Correct positions in the multiple-choice questions: index 0 four times, 1 four times, 2 four times, 3 three times.

## Pictures (original SVGs in `images/`)
`geo-m7-arcs.svg`, `geo-m7-circle-parts-blank.svg`, `geo-m7-chord-tangent.svg` and its blank copy, `geo-m7-angle-types.svg` and its blank copy, `geo-m7-secant-tangent.svg` and its blank copy, `geo-m7-radical-axis.svg` and its blank copy, `geo-m7-extended-sines.svg`. All are under 4 KB. I rendered each one, and the blank copies with their markers, and looked at them. Marker positions are computed from the same coordinates that draw the parts.

## Drills: `drills/r2-geo-m7.yaml` (5)
`geo-m7-r2-power` (the power from the general form, plus the tangent length), `geo-m7-r2-radical-axis` (the axis $x = c$ and the common-chord length, with a figure), `geo-m7-r2-circumradius` ($R$ and $b$ from the Extended Law of Sines; tolerance 0.01 for $R$ and 0.02 for $b$, so a $b$ computed from a rounded $R$ is still accepted), `geo-m7-r2-isosceles-circumradius` (with a figure), `geo-m7-r2-circle-3-points`. I checked the geometry of the generated points and lines in Python (2,000 random instances).

## Glossary and cards
- `glossary-r2-geo-m7.yaml` (8): signed power, general form, radical axis, common chord, radical center, concyclic, circumradius, Extended Law of Sines. I grepped every `glossary*.yaml` first. "Power of a point" already exists in `glossary.yaml` (unsigned definition), so the lesson uses it and adds "signed power".
- `cards-r2-geo-m7.yaml` (21): 11 for 30h1 and 10 for 30h2.

## For a reviewer
- "general form" is a generic term. If another writer later adds it (for lines, say), one entry should go.
- The Extended Law of Sines is circle-based, but a geo-m6 honors writer could also choose it. Check for overlap with any `26h*` lesson.
- The proof of the equal-angle test is labeled a sketch: it gives the "inside" case and says the "outside" case is similar.
- The 30h2 kite row follows the course convention that kites exclude rhombuses.

## Errors found in existing content
None. I edited no existing question, drill, card or glossary entry.

## Checks
`content/math/check-module.sh geometry geo-m7`: OK, zero problems. I recomputed every numeric answer and worked example in Python/sympy and fixed one slip in my own explanation before finishing.

## Sources
- Power of a point, and Steiner introducing the term in 1826: Wikipedia, "Power of a point".
- Radical axis and the radical center for non-collinear centers: Encyclopedia of Mathematics, "Radical axis".
- Everything else is standard Euclidean and coordinate geometry, derived in the lessons.

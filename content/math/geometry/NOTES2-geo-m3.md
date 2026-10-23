# Geometry module 3 (geo-m3), round 2: writer notes

## Added

**Honors lessons (2)**, both `honors: true`, `module: geo-m3`
- `lessons/09h1-parallel-proofs.md`, geo-h-parallel-proofs, "Proofs with parallel lines: converses and auxiliary lines" (45 min, about 2,000 words). Covers: a proof of the Corresponding Angles Converse (construct the parallel, then use Protractor Postulate uniqueness); the other converses derived from it (two-column proof of the Consecutive Interior converse); Euclid's indirect proof of I.27 using the Exterior Angle Inequality (I.16); I.29 as the first use of the fifth postulate; neutral geometry (parallels exist but need not be unique), with a caveat about the sphere; Proclus and Ptolemy; the bend theorem with an auxiliary parallel; bisectors of consecutive interior angles meet at 90°; the zigzag rule for several bends, with a proof. 4 worked examples, a Mermaid diagram showing which facts need the postulate, and 2 shape figures.
- `lessons/09h2-lines-vectors.md`, geo-h-lines-vectors, "Slopes and vectors: proving the slope rules" (50 min, about 2,000 words). Covers: proofs of the parallel slope criterion (algebra) and the perpendicular one (Pythagorean converse, both directions); direction vectors and the dot product; normal vectors of Ax + By = C, with one-line equations for parallel and perpendicular lines; the angle between two lines from u·v = |u||v|cos φ (derived from the Law of Cosines), plus the tan formula stated without proof, with its limits; the foot of the perpendicular, a derivation of Lesson 9's distance formula, reflection in a line; distance between parallel lines. 5 worked examples, 2 plots.

**Core lessons (additions only)**
- 08: SVG `geo-m3-angle-pairs.svg` (the four named pairs, shaded); Mermaid chart for naming an angle pair; Mermaid chart showing how the three theorems follow from the Corresponding Angles Postulate.
- 09: plot of a step (3, 2) turned 90° to (−2, 3), for the negative-reciprocal argument; Mermaid chart "parallel, perpendicular or neither" (including the vertical-line cases); SVG `geo-m3-slope-perp.svg` (slope triangle, perpendicular from P, foot F, a longer slanted segment), with one new sentence that introduces and bolds **foot of the perpendicular**.

**Questions (`questions/r2-geo-m3.yaml`, 39)**
- Core, 12 (geo-m3-r2-q01 to q12, 6 per lesson): 2 label, 2 match, 2 order, 2 select-all, 4 text. `module_quiz: true` on q01, q02, q07 and q08.
- Honors 09h1, 13 (h01 to h13): 8 multiple choice, 2 text, 1 order, 1 match, 1 select-all.
- Honors 09h2, 14 (h14 to h27): 8 multiple choice, 3 text (one has two blanks), 1 order, 1 match, 1 select-all.
- The answers to the 16 single-answer multiple-choice questions are spread 4/4/4/4 across positions 0 to 3.

**Pictures (4 SVGs, all original)**: geo-m3-angle-pairs, geo-m3-slope-perp, plus the label-question images geo-m3-transversal-blank (shaded angle; markers on the vertical, consecutive interior, alternate interior and corresponding angles) and geo-m3-slope-perp-blank (run, rise, perpendicular distance, foot, slanted segment). I rendered all of them with preview-figure.mjs and checked them, markers included. The Mermaid diagrams were rendered and checked too.

**Drills (`drills/r2-geo-m3.yaml`, 5)**: geo-m3-r2-bend (bend theorem with algebra, with a figure) and geo-m3-r2-zigzag (two bends, with a figure) for 09h1; geo-m3-r2-angle-lines (to the nearest tenth, tolerance 0.06), geo-m3-r2-foot (integer foot) and geo-m3-r2-parallel-dist (2 decimals, tolerance 0.01) for 09h2. I checked the drill logic independently in Python: the bend algebra over all inputs, and the angle formula against arctangent differences for every slope pair.

**Glossary (`glossary-r2-geo-m3.yaml`, 7 terms)**: auxiliary line, neutral geometry (alias absolute geometry), foot of the perpendicular, direction vector, dot product, normal vector, angle between two lines. I grepped every glossary file first: none of these terms or aliases existed.

**Cards (`cards-r2-geo-m3.yaml`, 19)**: 10 for 09h1, 9 for 09h2.

`content/math/check-module.sh geometry geo-m3`: OK, zero problems.

## For a reviewer
- 09h1 history: Euclid I.16 and I.27 are proved without Postulate 5, and I.29 is its first use. Proclus attempted a proof and reported Ptolemy's attempt. These are standard facts (Heath's edition of the Elements and Proclus's commentary), but please check the wording.
- 09h1 says the course derived the Exterior Angle Inequality from the angle sum (Lesson 10), while Euclid did not need the parallel postulate for it. Both statements are labeled as such.
- 09h2 uses the Pythagorean theorem and the Law of Cosines (Module 6) before Module 6. The intro flags this. The tan formula for the angle between two lines is stated without proof and labeled that way.
- The zigzag rule is stated only for paths that switch direction (left/right) at every bend, using the acute angles at the ends. Outside that setting it needs adjusting, and the lesson says nothing about other paths.
- Some glossary aliases could collide if another module defines "direction vector" or "dot product" (for example geo-m9 round 2). If both exist, keep one.

## Errors found in existing content
None. No existing question, drill, card or glossary entry was edited.

## Sources
Euclid's Elements, Book I (Heath translation), Propositions 16, 27 and 29; Proclus, Commentary on the First Book of Euclid's Elements (on attempts to prove the fifth postulate). The coordinate results are standard analytic geometry; every number was recomputed in Python.

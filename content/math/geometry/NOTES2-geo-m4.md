# Round 2 notes: module geo-m4 (Triangles and congruence)

`content/math/check-module.sh geometry geo-m4`: build and checker report zero problems
(7 lessons, 106 questions, 13 drills, 36 cards).

## Added

**Honors lessons** (both `honors: true`, 45 min, about 2,000 words each, 4 worked examples each)
- `lessons/14h1-ssa-congruence.md` (geo-m4-h-ssa-congruence), "When SSA works: the Long Side SSA
  Theorem". Building a triangle from SSA as a circle crossing a ray (foot of the perpendicular,
  the four cases for an acute angle, right and obtuse angles), a full synthetic proof of the Long
  Side SSA Theorem (SAS copy, isosceles triangle, obtuse angle faces the longest side), HL as a
  corollary without the Pythagorean theorem, SSA with a right or obtuse angle, the two ambiguous
  triangles having supplementary angles at B, and the history (Euclid I.4, I.8, I.26,
  superposition, Hilbert's SAS axiom). Examples: counting triangles for five values of a; SSA with
  lengths 7 and 9 vs 7 and 5; a two-column proof with obtuse angles; the supplementary angle.
- `lessons/14h2-shortest-paths.md` (geo-m4-h-shortest-paths), "Shortest paths and the Triangle
  Inequality". Euclid's proof of the Triangle Inequality (I.20), degenerate triangles, polygonal
  paths and the polygon inequality, the inside-point theorem (I.21) and the half-perimeter /
  perimeter bounds, Heron's problem (reflection, SAS proof that PA = PA', law of reflection), and
  the four-point minimum at the diagonals' intersection. Examples: fourth side of a quadrilateral;
  river problem A(0,3), B(12,6); four stores; bounds on the sum of the diagonals.

**Core lessons 10–14** (additions only, each introduced by a sentence or two):
- 10: Mermaid chart for classifying by sides and by angles; shape figure for Example 4 (one
  exterior angle at each vertex).
- 11: SVG of the SSA "swinging side" (two triangles from the same SSA data) with a short
  explanation; shape figure of the kite for Example 4.
- 12: SVG of the five valid tests; Mermaid "choosing a test" decision chart.
- 13: labeled isosceles-triangle SVG; Mermaid chart of everything that follows from
  △ABD ≅ △CBD; new drill linked in the front matter.
- 14: Mermaid "can three lengths make a triangle?" chart; Hinge Theorem SVG (40° vs 100°).

**Pictures** (12 original SVGs, 1.5–6.7 KB each, all rendered and checked, markers checked on the
blank ones): geo-m4-exterior-angle-blank, geo-m4-ssa-swing, geo-m4-ssa-swing-blank,
geo-m4-congruence-tests, geo-m4-congruence-tests-blank, geo-m4-isosceles,
geo-m4-isosceles-blank, geo-m4-side-angle-blank, geo-m4-hinge, geo-m4-ssa-cases,
geo-m4-heron, geo-m4-heron-blank.

**Diagrams**: 5 Mermaid (lessons 10, 12, 13, 14, 14h1), all with accTitle/accDescr, all
rendered. Plus 5 new shape figures (lessons 11, 10, 14h1 proof figure, 14h2 I.20 and I.21).

**Questions** (`questions/r2-geo-m4.yaml`, 51 new)
- Core geo-m4-r2-q01…q25 (5 per lesson): label 4 (q01, q11, q16, q21), text 6 (q02, q06, q10,
  q13, q17, q22), match 5 (q03, q07, q15, q20, q25), order 4 (q05, q12, q19, q24), select-all 5
  (q04, q08, q14, q18, q23), MC 1 (q09, with picture). module_quiz: q01, q04, q06, q08, q11,
  q14, q16, q21, q23.
- Honors geo-m4-r2-h01…h13 (SSA lesson) and h14…h26 (shortest paths), 13 each: per lesson 7 MC,
  2 text, 1 order, 1 match, 1 label, 1 select-all. MC answer positions 0: 4, 1: 4, 2: 4, 3: 3
  (core q09 included).

**Drills** (`drills/r2-geo-m4.yaml`, 5): geo-m4-r2-isos-ext (lesson 13), geo-m4-r2-ssa-count and
geo-m4-r2-ssa-two (14h1), geo-m4-r2-quad-side and geo-m4-r2-heron (14h2; length to 2 decimals,
tolerance 0.01). Heron's x-coordinate and minimum length were checked against numerical
minimization.

**Glossary** (`glossary-r2-geo-m4.yaml`, 6, checked against every glossary*.yaml): Long Side SSA
Theorem, superposition, degenerate triangle, polygonal path, polygon inequality, Heron's problem.
"Foot of the perpendicular" is bolded in 14h1 but already defined in glossary-r2-geo-m3.yaml, so
it was not re-added.

**Cards** (`cards-r2-geo-m4.yaml`, 20): 10 for SSA and congruence, 10 for shortest paths.

## For a reviewer
- "Long Side SSA Theorem" is a name chosen for this course (the lesson and glossary say so; some
  books write SsA). The name SsA was not used as a glossary term because glossary lookup is
  case-insensitive and would collide with SSA.
- History claims: Euclid I.4 (SAS), I.8 (SSS), I.26 (ASA and AAS), I.20 (Triangle Inequality),
  I.21 (inside point); HL not among Euclid's numbered propositions; Hilbert (1899) takes a form
  of SAS as an axiom; Heron "is credited with" the reflection argument (hedged, since the
  attribution of Catoptrica has been questioned).
- Both honors lessons use the Pythagorean theorem (Module 6) for some lengths, marked as forward
  references; the Hinge picture in lesson 14 quotes lengths from the Law of Cosines (Lesson 26).
- Possible overlap: Heron's problem may also suit a geo-m9 (reflections) honors lesson; the Fermat
  point is only mentioned in 14h2, in case geo-h1 covers it.
- Lesson 25 already counts SSA triangles with trigonometry; 14h1 does the count synthetically and
  focuses on proving when SSA forces congruence.

## Errors found in existing content
None in geo-m4. Seen outside my files (not changed): "general position" is defined in both
glossary-r2-geo-m1.yaml and glossary-r2-geo-m2.yaml.

## Sources
Euclid's Elements, Book I (Propositions 4, 8, 20, 21, 26); D. Hilbert, Grundlagen der Geometrie
(1899), congruence axioms; standard treatments of Heron's reflection problem and SSA. All text,
examples, questions and pictures are original; all numbers recomputed in Python.

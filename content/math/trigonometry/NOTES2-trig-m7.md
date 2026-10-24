# Round 2 notes: trig-m7 (Oblique triangles)

`content/math/check-module.sh trigonometry trig-m7`: build and checker report zero problems
(6 lessons, 92 questions, 13 drills, 34 cards).

## Added

**Honors lessons** (`honors: true`, `module: trig-m7`)
- `lessons/31h1-circumcircle-incircle.md`, `trig-m7-h-circles`, "Honors: The circumcircle, the
  incircle and the extended law of sines" (45 min, about 1,700 words of prose, 1,975 with math).
  Why the circumcenter and incenter exist; the extended law of sines $a/\sin A = 2R$ proved with
  the inscribed angle theorem (acute, obtuse and right cases); $R = abc/(4K)$; $K = rs$; tangent
  lengths $s - a$, $s - b$, $s - c$; right-triangle shortcuts $R = c/2$, $r = (a + b - c)/2$;
  Euler's inequality $R \ge 2r$ (Euler's distance formula stated without proof, labeled as such).
  Six worked examples (including 13-14-15, 3-4-5, and a three-posts / flower-bed application).
- `lessons/31h2-half-angles-tangents.md`, `trig-m7-h-half-angles`, "Honors: Half-angle formulas for
  triangles and the law of tangents" (45 min, about 1,460 words of prose, 1,930 with math).
  Derivation of $\sin\frac A2$, $\cos\frac A2$, $\tan\frac A2$ from the sides and $\tan\frac A2 = r/(s - a)$;
  a full proof of Heron's formula (completing the sketch in lesson 31); the thin-triangle example
  (1000, 1000, 1) showing the law of cosines is ill-conditioned for tiny angles; law of tangents
  with proof and SAS method; Mollweide's formulas with proof and use as a check; history notes.
  Four worked examples, each re-solving a core-lesson triangle so results can be compared.

**Core lessons** (additions only; nothing rewritten). Each already had 1–3 plots/shapes.
- 28 law of sines: labeled-parts SVG `trig-m7-parts.svg` (with lead-in sentence), and a shape
  figure of the obtuse case (altitude outside, angle 180° − A).
- 29 ambiguous case: four-panel SVG `trig-m7-ssa-cases.svg` (a < h, a = h, h < a < b, a ≥ b) and a
  Mermaid decision chart of the SSA method.
- 30 law of cosines: SVG `trig-m7-cos-sign.svg` (C = 60°, 90°, 120° with c² vs a² + b²) and a
  Mermaid "which law first" chart under the "Which law?" table.
- 31 triangle area: shape figure of the obtuse-angle height, and a Mermaid "which area formula" chart.

**Pictures** (8 SVGs, original, 1–6 KB, rendered and inspected; label markers checked):
trig-m7-parts(+blank), trig-m7-ssa-cases(+blank), trig-m7-cos-sign(+blank),
trig-m7-h-circumcircle, trig-m7-h-incircle(+blank). The incircle picture is used in both honors lessons.

**Diagrams** (4 Mermaid, `flowchart TD`, accTitle/accDescr, rendered): SSA method (29), which law
first (30), which area formula (31), SAS by the law of tangents (31h2).

**Questions** (48, `questions/r2-trig-m7.yaml`)
- Core q01–q20, 5 per lesson. By type: text 5 (q01, q06, q11, q16, q17), order 4 (q02, q07, q12,
  q18), select-all 4 (q03, q08, q13, q20), label 3 (q04, q09, q14), match 4 (q05, q10, q15, q19).
  module_quiz: q01, q04, q06, q09, q11, q16, q19.
- Honors 31h1, h01–h14: MC 9, text 2 (h05, h12), label 1 (h08), select-all 1 (h10), match 1 (h11).
- Honors 31h2, h15–h28: MC 9, text 2 (h16, h22), select-all 1 (h18), order 1 (h19), match 1 (h25).
- No module_quiz on honors questions. Answer positions of the 18 MC questions: 4, 4, 5, 5 at 0–3.

**Drills** (4, `drills/r2-trig-m7.yaml`): `trig-m7-r2-circumradius` (R and c from A, B, a),
`trig-m7-r2-circle-radii` (K, R, r from three sides) for 31h1; `trig-m7-r2-half-angle` (tan(C/2) and
C from the sides), `trig-m7-r2-tangents-sas` (half-difference, A, B) for 31h2. Each was generated
3,000 times against an independent solver in tsx (law of cosines cross-check for the angles):
correctly rounded answers accepted (tolerance 0.01 for 2 decimals, 0.0001 for 4), a wrong one
rejected, no unfilled placeholders, thousands separators or stray signs.

**Glossary** (`glossary-r2-trig-m7.yaml`, 11): circumcircle, circumcenter, extended law of sines,
inscribed angle theorem, incircle, incenter, inradius, Euler's inequality, ill-conditioned, law of
tangents, Mollweide's formulas. Checked against every `glossary*.yaml` in the course.

**Cards** (`cards-r2-trig-m7.yaml`, 19): 10 on "Circumcircle and incircle", 9 on "Half-angle and
tangent laws".

## For a reviewer to double-check
- "circumradius" is already defined by the trig-m2 writer (regular-polygon wording), so 31h1 does
  not bold it; it bolds "circumcircle" and "circumcenter" instead. "Thales's theorem" (trig-m8
  writer) is not named in 31h1; the semicircle fact is stated inside the inscribed angle theorem.
- History in 31h2, labeled as disputed: law of tangents credited to Abu al-Wafa (10th century),
  printed by Thomas Fincke in *Geometria rotundi* (1583, the book that named tangent and secant),
  also stated by Viète. Mollweide's formulas: Newton gave a version in 1707, Oppel (1746) and
  Simpson (1748) published both, Mollweide republished them in 1808. Heron's geometric proof in
  the *Metrica*; "some historians think Archimedes knew it earlier" is hedged.
- The thin-triangle example says a six-decimal cosine is stored as 1.000000 or 0.999999 (the exact
  value 0.9999995 is a tie), giving 0° or about 0.081° instead of 0.0573°.
- Euler's inequality and the claim that R/r measures distance from equilateral are stated, not proved.
- Label markers: parts-blank on the midpoints of BC, AC, AB and on the altitude; ssa-cases-blank
  at the top center of each panel; cos-sign-blank under each triangle; incircle-blank on the A-side
  tangent piece of AC, the B and C pieces of BC, the incenter, and the middle of the radius.

## Errors found in existing content
None found. The four core lessons, the m7 drills, cards and glossary entries were read in full;
the 44 existing m7 questions were read at the stem level, with about a quarter checked in full.
Nothing existing was edited.

## Sources
Standard triangle geometry and trigonometry (inscribed angle theorem, extended law of sines,
incircle tangent lengths, half-angle formulas, law of tangents, Mollweide's formulas, Euler's
inequality). History: Wikipedia "Law of tangents" and "Mollweide's formula"; Dictionary of
Scientific Biography entry on Thomas Fincke (MacTutor). All numbers recomputed in Python.

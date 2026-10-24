# Round 2 notes: trig-m2 (Right-triangle trigonometry)

## Honors lessons (both `honors: true`, `module: trig-m2`)
- `lessons/08h1-exact-values-from-polygons.md`, id `trig-m2-h-exact-geometry`: "Exact values from regular polygons: 15°, 22.5°, 18° and 36°" (about 1,870 words, 45 min). Covers the right triangle inside a regular n-gon (side, apothem, area), Archimedes' 96-gon bounds on π, the angle-halving construction (extend the adjacent leg by the hypotenuse, so tan(θ/2) = opp/(adj + hyp)), which gives the exact values at 15°/75° and 22.5°/67.5°, the golden triangle giving sin 18° and cos 36°, a table of the new values, and a note on Gauss–Wantzel. It has 4 worked examples (pentagon, 15°, decagon, roof).
- `lessons/08h2-measurement-error-and-the-horizon.md`, id `trig-m2-h-measurement-error`: "Indirect measurement: error, the best angle and the size of the Earth" (about 1,520 words, 45 min). Covers uncertainty, absolute and relative error, a geometric (no-calculus) derivation of Δh ≈ dΔθ/cos²θ, a proof that 45° minimizes the relative error, distance to the horizon, the dip of the horizon and R = h cos α/(1 − cos α), al-Biruni's method, and the precision trap in 1 − cos α. It has 4 worked examples.

## Core lessons (additions only)
- 05: SVG `trig-m2-two-views.svg` (the same triangle labeled from θ and from β), with two sentences introducing it. Mermaid flowchart TD of the "one ratio → all six" routine.
- 06: Mermaid flowchart for rebuilding an exact value (half square vs half equilateral triangle). I inserted one sentence ("If you forget a value, rebuild it instead of guessing:") and the diagram between "backward." and "The reciprocals follow:". No text was removed.
- 07: Mermaid "which tool solves the right triangle" decision chart after the ratio table.
- 08: Mermaid flowchart of the steps for an elevation/depression/bearing problem; SVG `trig-m2-bearings.svg` (compass with 040° = N 40° E and 200° = S 20° W).

## Questions: `questions/r2-trig-m2.yaml` (48)
- Core (q01–q20, 5 per lesson): 3 label, 5 text, 4 match, 4 order, 4 select-all. Two per lesson are marked `module_quiz: true`.
- Honors (h01–h28, 14 per lesson): 16 multiple choice (answer index 4/4/4/4), 4 text, 2 match, 2 order, 2 select-all, 2 label. That is 6 new-type questions per lesson.
- Label images (with blank copies; I checked the markers on the rendered previews): `trig-m2-sides-blank.svg`, `trig-m2-306090-blank.svg`, `trig-m2-elev-depr-blank.svg`, `trig-m2-pentagon-blank.svg`, `trig-m2-horizon-blank.svg`.

## Pictures and diagrams
- 11 original SVGs, `images/trig-m2-*.svg`, each under 2.5 KB: two-views, bearings, pentagon, fifteen, golden, horizon, plus the 5 blanks above. All were rendered and inspected.
- 4 Mermaid diagrams (lessons 05–08) and 1 `plot` (relative error vs angle, in 08h2).

## Drills: `drills/r2-trig-m2.yaml` (5)
- `trig-m2-r2-polygon`: side, apothem and area of a regular n-gon (2 dp, tolerance 0.01).
- `trig-m2-r2-exact-extended`: exact sin/cos/tan at 15, 75, 22.5, 67.5, and sin/cos at 18, 36, 54, 72 degrees, with the exact TeX shown through the paired-label trick. I checked all 20 (function, angle) cases: each matches exactly one label.
- `trig-m2-r2-height-range`: lowest and highest height from θ ± error (2 dp, tolerance 0.01).
- `trig-m2-r2-horizon`: distance to the horizon in km (1 dp, tolerance 0.051).
- `trig-m2-r2-earth-radius`: R from the height and the dip (3 significant figures, `sigfigs: 3`). The dip shown is rounded to 3 decimals, and the answer is computed from the shown value.

## Glossary and cards
- `glossary-r2-trig-m2.yaml` (10): regular polygon, circumradius, apothem, golden triangle, golden ratio, uncertainty, absolute error, relative error, atmospheric refraction, dip of the horizon (alias "dip"). I checked these against every glossary file in the course: no duplicates.
- `cards-r2-trig-m2.yaml` (19): 11 for 08h1, 8 for 08h2.

## For a reviewer to double-check
- History claims are hedged: Archimedes (3 10/71 < π < 3 1/7, from 96-gons); Gauss around 1800, completed by Wantzel in 1837; al-Biruni's dip method from a mountain near Nandana in the early eleventh century (the lesson gives no specific numbers for his result).
- Refraction is described only as making the horizon "usually a few percent farther". The error formula is labeled an approximation for small Δθ, and Example 2 shows its asymmetry at 80°.
- Overlaps:
  - The halving construction is related to the trig-m6 honors writer's tan-half-angle picture (`trig-m6-h-tan-half-line.svg`).
  - The 15° and 22.5° values also appear, found by formula, in lessons 23 and 25. 08h1 says Module 6 reaches them by formulas.
  - The Eratosthenes measurement is in 04h1. 08h2 uses a different method (the dip), so the two lessons don't repeat each other.
- I recomputed every number in Python, including the worked examples, all distractors and the drill answers.

## Errors found in existing content
- None. I edited no existing question, drill, card or glossary entry.

## Sources
- Standard plane geometry: similar and isosceles triangles, tangent ⟂ radius, the exterior angle theorem.
- Archimedes, *Measurement of a Circle* (the bounds on π).
- Mean Earth radius 6371 km.
- General histories of mathematics and astronomy for al-Biruni and Gauss–Wantzel.

`content/math/check-module.sh trigonometry trig-m2` reports OK (zero problems).

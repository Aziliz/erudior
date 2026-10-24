# Round 2 review: trig-m8 (Vectors in the plane)

Reviewer's scope: honors lessons 34h1 and 34h2, the round 2 additions to lessons 32, 33 and 34,
`questions/r2-trig-m8.yaml` (43), `drills/r2-trig-m8.yaml` (5), `glossary-r2-trig-m8.yaml` (18),
`cards-r2-trig-m8.yaml` (28) and the 10 `images/trig-m8-*` SVGs.
`content/math/check-module.sh trigonometry trig-m8` reports zero problems after the fixes.

Counts: answer-key errors 0, factual fixes 2 (both small precision fixes), picture fixes 7
(3 SVGs, 4 lesson plots), other fixes 0.

## Changes

### Pictures
- `images/trig-m8-incline.svg` and `-blank.svg`: the normal-force arrow N was 120 px long, but the
  W cos θ component it balances is 136 px (W = 150 px, θ = 25°), so the picture showed N < W cos θ,
  which contradicts the lesson's N = W cos θ. I lengthened N to 136 px (tip moved to (297.0, 79.3)) and
  moved its label up with it. q11's marker 4 (49.8 %, 30.1 %) is still on the arrow (checked with markers).
- `images/trig-m8-incline.svg`: the "W, weight" label sat on the dashed completion line; it is now
  centered under the arrow tip.
- `images/trig-m8-centroid.svg`: the "G, centroid" label was crossed by the median from B, and
  "median AM" touched that median. Both labels moved to clear space (G's label below-right of G,
  "median AM" just below its median).
- `images/trig-m8-projection.svg`: the "projection of u onto v" label overlapped the red
  projection arrow near O; moved down below it.
- 34h1 Example 1 plot: the segment labels "v = ⟨4, 2⟩" and "rotated 30°" were drawn on the arrows.
  Replaced with `labels` placed beside the arrow tips.
- 34h1 Example 5 plot (pentagon): "(0, 4)" sat on the y-axis and "(2, 1)" on an edge. Point labels
  replaced with `labels` placed off the edges and axes.
- 34h2 Example 3 plot (distance to a line): "d = 5.2" sat on the dashed segment, "F" on the
  right-angle mark and the line's equation on the line. Replaced with placed `labels`.
- 34h2 Thales plot: the y range [-1.5, 4] cut off the bottom of the circle; now [-3.5, 3.5]. The
  "A" label sat on the circle and "diameter" on the y-axis tick labels; replaced with placed
  `labels` (A, B, P outside the circle; "diameter AB" below the diameter).
All re-rendered with `preview-figure.mjs` / `preview-plots.mjs` and looked at.

### Text (precision)
- 34h1 "The determinant of two vectors": "the angle between u⊥ and v is 90° − φ (up to sign, which
  cosine ignores)". For φ < −90° (e.g. −120°), 90° − φ = 210°, which differs from the unsigned angle
  (150°) by a whole turn, not by a sign. Changed to "up to sign and whole turns". The formula
  det = ‖u‖‖v‖ sin φ was right throughout.
- 34h2 intro: "Two algebra facts from Lesson 33" — Lesson 33 has v·v = ‖v‖² and the expansion of
  (u − v)·(u − v), but not (u + v)·(u − v). Changed to "Two algebra facts, both from expanding dot
  products as in Lesson 33".

## Checked and right (a reader might doubt)
- All 43 questions worked independently before reading the keys; every key, accept list and
  distractor explanation is right. Numeric ones recomputed: h05 (det 21 → 10.5; 10 = half the dot
  product 20; 14.5 = (25+4)/2), h07 shoelace (12 + 17 = 29 → 14.5; the out-of-order listing really
  gives 2), h08 (dot 1, det 7 → 81.87°), h13 (det −10, right turn), h14 (22; 26; 16), h18 (42/13;
  the 6/13 slip), h19 ((4, −2); (1, −5); (2.757, −3.243)), h21 (d² = 56), q10 angles 36.87°, 90°,
  135°, 163.74°, q12 (100, 173.2), q14 (403.1 mi/h, 7.1° east of north). Order questions have one
  order only; select-all choices are each clearly right or wrong.
- Lesson numbers in the honors text: sum formulas = lesson 23, ½ab sin C = lesson 31, Cauchy–Schwarz
  stated in lesson 33, parametric equations = lesson 37 (look-ahead only).
- Worked examples recomputed: rotation of ⟨4, 2⟩ by 30° = ⟨2√3 − 1, 2 + √3⟩, length² 20; square
  corners (3, 5), (0, 4); signed angle 98.13° (atan2(7, −1)); triangle area 11.5 with sin A = 23/√754
  (754 − 225 = 529 = 23²); pentagon terms −3, 26, 38, 12, −8 → 32.5; section points (1, 2), (4, 3);
  centroid (4, 4); line x + 3y = 7; distance 5.2 and foot (2.88, 0.84); P(1.268, 2.719) lies on the
  radius-3 circle; parallelogram diagonal √48 = 4√3 both by the law and by the law of cosines;
  median length formula.
- Spreadsheet ATAN2 takes (x, y), the reverse of programming languages' atan2(y, x) (Microsoft's
  ATAN2(x_num, y_num) documentation; Google Sheets and LibreOffice match).
- History: Cauchy's inequality for sums in *Cours d'analyse* (1821); Bunyakovsky (1859) and Schwarz
  (1888) for integrals; Thales of Miletus (c. 624–546 BC), "traditionally credited", is properly
  hedged (the attribution comes from much later writers, e.g. Diogenes Laërtius).
- Direction-angle flowchart: the axis cases fall in the right branches (b = 0, a < 0 → 180° − 0 = 180°;
  b = 0, a > 0 → 0°). Lagrange's identity, the Cauchy–Schwarz discriminant proof (including the
  equality case and v = 0), and the triangle inequality step are correct.
- Drills: each of the 5 generated 1,500 times with the app's own generator; answers recomputed
  independently from the numbers in the prompt (rotation formula, determinant, atan2, section
  formula, point–line distance and foot). Correctly rounded 2-decimal answers are always accepted
  (tolerance 0.01), exact fractions are accepted for the section drill, +0.5 is always rejected, and
  no prompt has unfilled placeholders, "+ -" or "1x".
- Label markers for q01, q06, q11, h12, h25 rendered on the blanks: each sits on the part its label
  names. (q11's marker 2 covers much of the short W sin θ arrow, as the writer noted; it is still
  unambiguous.)
- Glossary: no term or alias duplicates any other `glossary*.yaml` in the course (the only repeat is
  the deliberate en-dash/hyphen alias pair for Cauchy–Schwarz within the file). Cards correct.

## Overlap
- Honors module lesson `90-robot-arms.md` (trig-h1) also derives the rotation formula from the sum
  formulas and lists the same sign mistake. 34h1 goes on to the determinant, area and orientation,
  so the overlap is one section; noted only, nothing changed in the other writer's file.

## Left uncertain
- Nothing substantive. The 34h1 claim that the orientation test is "the basic step" in hull and
  point-in-triangle programs is a fair generalization, not a sourced claim.

# Geometry module 3 (geo-m3), round 2: review

Reviewed: honors lessons 09h1 and 09h2, the round 2 additions to lessons 08 and 09, `questions/r2-geo-m3.yaml` (39), `drills/r2-geo-m3.yaml` (5), `glossary-r2-geo-m3.yaml` (7), `cards-r2-geo-m3.yaml` (19), and the 4 `images/geo-m3-*` SVGs. `content/math/check-module.sh geometry geo-m3`: OK, zero problems after the fixes.

## Changes

**Questions**
- geo-m3-r2-h15 (why equal slopes never meet): the distractor "Because they are perpendicular to the same line" could be defended, since two lines with the same slope are both perpendicular to a line of slope −1/m, and two lines perpendicular to the same line are parallel. Replaced it with "Because their slopes multiply to $-1$" (clearly wrong: equal slopes multiply to $m^2$). Rewrote the explanation's last sentence to cover the new distractor.

**Lesson text**
- 09h1, "Euclid's split", first sentence: said the converse proof used the parallel postulate "to get exactly one line ℓ′". The proof never uses the uniqueness of ℓ′. It needs the postulate because it applies the Corresponding Angles Postulate, which is equivalent to it, to ℓ′. Reworded to say that.

**Figures** (each re-rendered with preview-plots.mjs and checked)
- 09, rotation plot (step (3, 2) turned to (−2, 3)): both segment labels sat on their arrows. Moved them into `labels` placed beside the arrows.
- 09h1, bend-theorem shape: the "a" at A touched segment AP, the "a" and "b" at P were crowded onto the lines, and the automatic "B" label overlapped BP. Moved the angle labels into the open parts of their angles and put "B" left of the point.
- 09h1, Example 3 zigzag shape: "70°" touched P and line AP, and the automatic "Q" label sat on segment PQ next to "80°". Moved "25°", "70°" and "80°" into their angles and put "Q" to the left of the point.
- 09h2, angle-between-lines plot: the curve label "y = −3x + 4" sat on its line, and "(0.6, 2.2)" touched y = 2x + 1. Replaced them with placed `labels`.
- 09h2, foot-of-perpendicular plot: "3x + 4y = 9" sat on its line, "F(−1, 3)" sat on segment PF, and "P′(−4, −1)" overlapped the dashed segment and the x-axis tick labels. Replaced them with placed `labels`.
- Drills geo-m3-r2-bend and geo-m3-r2-zigzag: the automatic point labels "B" (bend) and "Q" (zigzag) fall on a path segment for every input, because the label always goes to the upper right. They are now `labels` to the left of the point.

## Checked and found right
- Every question worked independently before checking the key. All 39 keys are correct. Select-all questions (q04, q10, h13, h26): every listed answer is right and every other choice is clearly wrong. Order questions (q03, q11, h11, h24) have one possible order. Match and label pairings are unambiguous.
- The angle numbering used in 09h1 and q04 (1, 2 above ℓ and 3, 4 below, left to right) matches Lesson 8's figure and table. All the angle-pair claims in Example 1 and in Euclid's argument hold under it, including the left-hand case.
- Label markers: in geo-m3-transversal-blank, the shaded angle is ∠3's position and markers 1 to 4 sit in the vertical, consecutive interior, alternate interior and corresponding angles. In geo-m3-slope-perp-blank, the markers sit on the run, rise, PF, foot and slanted segment. In geo-m3-slope-perp.svg, PF is perpendicular to the line (dot product about 0 in pixel coordinates), F is on the line, and the run and rise are 4 and 3 grid squares. geo-m3-angle-pairs.svg shades the right angles in all four panels.
- History (Heath's translation of Euclid's Elements, Book I; D. E. Joyce's online Elements at Clark University): I.16 (Exterior Angle Inequality) and I.27 (congruent alternate angles imply parallel lines) are proved without Postulate 5, and I.29 is its first use. Proclus (412–485) attempted a proof of the postulate in his commentary on Book I and reported Ptolemy's attempt. The sphere caveat is correctly worded: I.16 fails on the sphere because lines close up.
- 09h1 cites Lesson 10 for the Exterior Angle Inequality as a consequence of the angle sum. Lesson 10 does derive it that way. 09h2's references to Module 6 (Pythagorean theorem, Law of Cosines), Module 9 (vectors, reflections) and Module 10 (hyperbolic geometry) are accurate.
- Zigzag rule: checked the proof (each segment's angle with the parallels appears once in a right-opening angle and once in a left-opening angle) and Example 3 from coordinates (segments at 25°, 45° and 35° to the horizontal).
- All numbers recomputed in Python: Examples 1 to 5 of 09h2 (81.87° for Example 3, 45° for Example 2), Example 4 of 09h1, and h19 (26.57°), h20, h21, h22, h23 (2.5).
- Drills, checked in Python from the prompts. The bend answer was compared with the angle measured from the figure's coordinates over every valid input. The zigzag bend and end angles were measured from coordinates. The angle-between-lines drill was compared with arctangent differences for every slope pair: the tolerance of 0.06 accepts every correctly rounded answer. The foot drill was checked by independent projection. The parallel-distance drill was checked by point-to-line distance, and the 0.01 tolerance accepts 2-decimal answers. No unfilled placeholders and no "+ -".
- Glossary definitions and cards are correct.

## Overlap
- 09h1's "neutral geometry" section overlaps the round 2 honors lesson 41h2-saccheri-quadrilaterals (geo-m10). Both bold **neutral geometry**, give Euclid I.16 as provable without the parallel postulate, and make the sphere caveat. 09h1 uses it only for the I.27/I.29 split, and 41h2 goes much further, so the two are consistent rather than duplicates. The only glossary entry is in geo-m3. No files changed.
- **Foot of the perpendicular** is also bolded in 14h1 (geo-m4). The only glossary entry is geo-m3's.
- 09h2's dot-product perpendicularity test also appears briefly in 19h2 and 38h2. No conflict.

## Uncertain
- Nothing outstanding.

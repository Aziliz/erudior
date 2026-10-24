# Round 2 review: geo-m6 (Similarity and right triangles)

Reviewer's check: `content/math/check-module.sh geometry geo-m6` reports OK, zero problems (10 lessons, 157 questions, 26 drills).

## Changes

### Answer keys and questions
- **geo-m6-r2-h22** (order, triangulation). The first two steps, "Measure the baseline" and "Measure the angles at both ends", could be done in either order: nothing stops a surveyor measuring the angles first. That made two orders correct. I reworded the stem to say the baseline is already measured, dropped that step and added a final step ("Use one of the new sides as the known side of the next triangle"). Now there is only one order. I updated the explanation to match.
- **geo-m6-r2-q01** (text, scale factor 5/3). Added `1.6667` and `1.7` to `accept`. The stem says "a decimal is fine", and both are correctly rounded values that the old key rejected. Numbers compare by exact value: see `src/lib/questions.ts` `textMatches`.
- **geo-m6-r2-h42** (text, "square"). Added `1×1 square`, `unit square`, `a unit square` and `another square` to `accept`.
- **geo-m6-r2-h07** (explanation). The explanation said "the third choice talks about $a + b$". That choice is the second one. Fixed the reference, and added that a non-primitive hypotenuse can be even (6-8-10).

### Facts
- **26h2, Bearings.** The lesson said "a bearing of 030° points north-northeast". North-northeast is 022.5°. Changed it to "points 30° east of north, between north-northeast (022.5°) and northeast (045°)".
- **26h1, Garfield section.** "Half of the square picture from Lesson 22, cut along a diagonal line" read as if the cut were a diagonal of the outer square. It is actually a diagonal of the tilted inner square. I checked this against geo-m6-rearrangement.svg: the bottom half has left side b and right side a, as in Garfield's figure. Made the sentence say so.
- **glossary-r2-geo-m6.yaml, logarithmic spiral.** "The squares of a golden rectangle trace an approximate one" now reads "Quarter-circle arcs drawn in the nested squares of a golden rectangle approximate one".

### Pictures and figures
- **images/geo-m6-elevation.svg.** The "line of sight" label sat on the line of sight. Moved it up and to the left (270, 135).
- **images/geo-m6-bearings.svg.** The "030°" label was below the dashed return line, nowhere near its arc, so it could be read as the 29° angle between AB and AC. I made the north arrow at A longer, made the arc bigger (r = 65) and put the label inside the 30° wedge.
- **Lesson 25, river ```shape.** The "width" segment label sat on the dashed altitude. Removed it from the segment and added a free label beside the line.
- **Lesson 26, two-boats ```shape.** The "harbor" point label overlapped the 12 km path, and "9 km" touched its path. Both are now free labels placed off the lines.
- **26h1, unit-circle ```plot.** The "(−1, 0)" label overlapped the axis tick labels and the dashed lines. It is now a free label to the upper left, and the x-range is widened to −1.5 so it isn't cut off.

All pictures were re-rendered after the fixes and checked.

## Checked and found right
- **Every question worked independently, numbers in Python.** These were all correct:
  - h16: 136.60 m, which is 50(√3 + 1); P to the foot is 236.60 m.
  - h20: bearing 143.13°.
  - h25: 368.64 m (and BC = 326.08 m).
  - h31: 12.94 cm. h33: 9.71 cm.
  - h38: 89/55 = 1.61818.
  - h41: 12.36 cm.
  - q25: 20.98 m. q31: a = 7. q35: 60°.
  - q26: sin B = 0.6, so two triangles.
  - q27: for a = 12, B ≈ 24.6°, so the triangle is not right.
  - Every triple in h04, h06, h09, h11 and h14.
- **Lesson numbers.**
  - 26h2 Example 1: QT = 329.0, h = 174.3, x = 279.0; both methods agree.
  - 26h2 Example 4: 199.1 m, +24.7 m, +14%.
  - 26h2 Example 2: AC = 50.72 km, ∠BAC = 29.04°, bearing 059.0°, back bearing 239.0°; the coordinates B = (20.00, 34.64) and C = (43.49, 26.09) agree.
  - 26h2 Example 3: 708.2 m and 596.0 m.
  - Lesson 25 river: 338.2 m and 266.5 m. Lesson 26 boats: 17.78 km.
  - 26h3: φ, 1/φ, cos 36° = 0.8090, cos 72° = 0.3090, 5(√5 − 1) ≈ 6.18, the Fibonacci ratio table.
  - 26h1: Euclid's formula table, 65 = 8² + 1² = 7² + 4², and the unit-circle points (slope 1/3 gives (4/5, 3/5); slope 3/4 gives (7/25, 24/25)).
- **Proofs.**
  - The golden-triangle similarity argument: the BD = BC and AD = BD steps, and the ratio CD/BC = BC/AB.
  - The cos 36° derivation from the gnomon.
  - The parity (mod 4) proof and the outline proof that Euclid's formula gives every primitive triple.
  - The two-angle formula: the sine form and the tangent form are equal, checked on 20,000 random drill inputs.
- **Drills.** I re-implemented the two-angle and bearing drills independently and checked them on 20,000 inputs. The bearing never wraps past 360° in the allowed range, and the angle at the turn is always 180° − turn.
  - Tolerances: 0.1 for answers to the nearest tenth, 0.01 for 2 decimals, and 0.02 for the bearing distance. Each is at least half the last place.
  - No placeholder collisions (`d`, `be`, `al` and `turn` appear only as intended).
- **History, against standard sources.**
  - Garfield's proof: *New-England Journal of Education* 3 (1876), written while he was a congressman. He became the 20th president.
  - Plimpton 322: Old Babylonian, about 1800 BCE; row 1 is width 119 and diagonal 169. Its purpose is debated (E. Robson, "Words and pictures", *Amer. Math. Monthly* 109, 2002).
  - Euclid's *Elements*: I.47, VI.31, the Lemma 1 to X.29 (Euclid's formula), and VI Def. 3 (extreme and mean ratio).
  - Snellius: measured an arc from Alkmaar to Bergen op Zoom in 1615, published as *Eratosthenes Batavus* in 1617.
  - Great Trigonometrical Survey: began in 1802 under Lambton. Peak XV's height was computed in 1852–56.
  - "Goldener Schnitt": first used in print by Martin Ohm (1835).
  - Nautilus: shells don't match the golden spiral (C. Falbo, *College Math. J.* 36, 2005).
  - The myths about the Parthenon and the "most beautiful rectangle" are correctly labeled as unsupported or mixed (Markowsky, *College Math. J.* 23, 1992).
- **Label markers.** All six label questions were rendered with their markers. Each marker sits on the part its label names. I checked:
  - the rearrangement picture: a < b on the bottom edge;
  - the pentagon: 3 is the 36° angle, 4 is B, 5 is C;
  - the two-angle picture: 4 is on the ground segment PQ.
- **Mermaid diagrams.** All 8 previewed. Content is correct, `accTitle`/`accDescr` describe each whole diagram, and all are readable.

## Overlap
26h3 (pentagon diagonal/side = φ, by golden triangles) overlaps two lessons from the honors module, geo-h1: lesson 90 (constructing φ) and lesson 93 (φ from Ptolemy's theorem). The three use different methods and refer to each other, so I left this as is. Nothing else repeats another round 2 lesson.

## Uncertain
- Nothing substantive. The "12 km" label in lesson 26's boats figure sits close below its line but doesn't cover it.

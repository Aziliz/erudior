# Round 2 review: trig-m3 (Trig functions of any angle)

I reviewed the writer's round 2 work on its own: honors lessons 12h1 and 12h2, the additions to
core lessons 09–12, `questions/r2-trig-m3.yaml` (48), `drills/r2-trig-m3.yaml` (4),
`glossary-r2-trig-m3.yaml` (7), `cards-r2-trig-m3.yaml` (19) and the 7 `images/trig-m3-*` SVGs.
After my fixes, `content/math/check-module.sh trigonometry trig-m3` reports OK (6 lessons,
95 questions, 13 drills, 46 cards).

## Changes

| Where | Problem | Fix |
|---|---|---|
| 12h2, Example 3 | Gave the true value of sin 2° as 0.034900 "to six decimals". sin(π/90) = 0.0348995, which rounds to 0.034899. | Changed it to 0.034899. (Python) |
| 12h2, first plot (area nesting) | The "sin t" label sat on the dashed segment it names. | Removed the segment label and added a free label "sin t" at (0.64, 0.3), left of the segment. Re-rendered. |
| 12h2, second plot (sin t, t, tan t) | The auto-placed "y = sin t" label sat on the dashed line y = t. | Dropped that function label and added a free label "y = sin t" at (1.15, 0.6), under the sine curve. Re-rendered. |
| images/trig-m3-six-segments.svg | The "csc θ" label sat on the unit-circle arc. | Moved the text from (292, 262) to (306, 252), clear of the arc, the bracket and the tan segment. Re-rendered. |
| trig-m3-r2-h11 (match) | The left item "Half-chord (jya) of θ" → sin θ. Read literally, the half-chord of θ is ½ crd θ = sin(θ/2), not sin θ. | Renamed it "Jya of θ (half the chord of 2θ)". This matches the explanation. |
| 12h1, history Mermaid (label and accDescr) | Spelled "jaib", but the lesson text and the card say *jayb*. | Changed to "jayb" to match. |

Counts: answer-key errors 0; factual fixes 1 (sin 2°); picture fixes 3 (two plots, one SVG);
other fixes 2 (h11 wording, jayb spelling).

## Checked and found right (a reader might doubt these)

- **All 48 questions** worked independently. Highlights:
  - q04: tan 90°, cot 180° and sec 270° are undefined; csc 90° = 1.
  - q09: the reference angle of −320° is 40°.
  - q18: sin(−17π/6) = −1/2.
  - h07: at 120° the ray meets x = 1 at T = (1, −√3) = −2P, on the backward extension, so sec 120° = −2.
  - h14: rise = 5 − 5 cos 20° ≈ 0.30 m. The distractors 1.71 = 5 sin 20° and 1.17 = 5 − 5 cos 40° are right.
  - h20: relative errors 0.17%, 3.0%, 0.49% and 18.8%.
  - h21: 0.00271/0.20271 = 1.34%.
  - h27: tan 2 ≈ −2.185 and sin(−1) ≈ −0.841.
  - Every select-all and order question has exactly one defensible key.
- **12h1 geometry.** I recomputed the SVG: θ = 50°, T at height 240·tan 50°, C at 240·cot 50°. In triangle OBC the angle at C is θ (alternate angles). T = sec θ·P and C = csc θ·P. Example 3 (150°), Example 2 (5/12, 13/12, 12/5, 13/5) and the C/T order around 45° are all correct.
- **Sexagesimal.** 120 sin 45° = 84.8528 = 84;51,10. Arch example: 3.420 m chord, 3.491 m arc, 0.302 m rise.
- **History.**
  - Fincke, *Geometria rotundi* (1583), introduced "tangent" and "secant" (MacTutor, "Thomas Fincke").
  - Hipparchus is "usually credited" with the first chord table, and the lesson hedges this correctly.
  - The Almagest chord table is in half-degree steps with radius 60 (Toomer's translation of the Almagest, I.11).
  - Aryabhata wrote in 499.
  - jyā/jīvā → jība → jayb → sinus: the lesson labels this as the usual account and says the translator is disputed.
  - *Śara* ("arrow") is a Sanskrit name for the versine.
- **12h2 numbers.** I recomputed all of them in Python:
  - both tables;
  - the 1% thresholds, 0.2441 rad = 13.99° and 0.1730 rad = 9.91° (brentq);
  - Example 4: 1.017% and 0.510%;
  - the t⁴/24 ≈ 2.6×10⁻⁷ claim;
  - cos t > 1 − t²/2 from 1 − cos t = 2 sin²(t/2), which holds for every t ≠ 0.

  The t³/6, t³/3 and t⁴/24 error sizes are standard Taylor remainders and are labeled "without proof".
- **Drills.** I enumerated every input of all four drills (they are discrete) and recomputed the answers from the prompt.
  - Correctly rounded answers fall within tolerance every time.
  - An answer one unit off in the last place is rejected.
  - In small-approx, rounding t to 6 decimals before squaring changes the cosine estimate by at most 3×10⁻⁶, which is within tolerance.
- **Core additions.**
  - Four flowcharts: the 09 procedure, the 10 reference-angle method, the 11 denominator chart and the 12 period-then-symmetry routine.
  - The 12 tan-period plot, the reference-quadrant SVG and the labeled unit circle.
  - All render cleanly and are correct, and all markers for q01, q06, q11 and h01 sit on the parts they name.
- **Glossary.** No duplicate terms or aliases in any course glossary. "haversine formula" exists in trig-h1, and m3 only mentions the haversine without defining it.

## Overlap with other round 2 lessons (not changed)

- **12h1 and trig-m6 27h3 (Ptolemy's chords).** Both derive crd θ = 2R sin(θ/2) with radius 60 and base-60 notation. 27h3 goes much deeper and defers the "sine" etymology to 12h1, so the overlap is a short section plus Example 4(a) and question h10.
- **12h2 and trig-m4 17h1/17h2.** Those lessons use sin x/x → 1 and the small-angle limits. 12h2 is the one that proves them, so this looks complementary. The m1 writer's notes say m4 bolds and defines "small-angle approximation". 12h2 uses the phrase but doesn't bold it, which is fine.
- **12h2 and trig-m1 04h1 (angular size).** 12h2 deliberately avoids repeating 04h1 and points to it.

## Left uncertain

- Nothing material. The 12-lesson flowchart strips periods before applying symmetry. That is valid, but if you strip into [0, 2π) the "still negative?" branch rarely fires. It is not wrong, so I left it.

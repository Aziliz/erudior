# Round 2 review: trig-m2 (Right-triangle trigonometry)

Reviewer: independent of the writer. Scope: honors lessons 08h1 and 08h2, the round 2 additions to
core lessons 05–08, `questions/r2-trig-m2.yaml` (48), `drills/r2-trig-m2.yaml` (5),
`glossary-r2-trig-m2.yaml` (10), `cards-r2-trig-m2.yaml` (19), `images/trig-m2-*.svg` (11).

## Changes

| Where | What was wrong | Fix | Source |
|---|---|---|---|
| `trig-m2-r2-q13` (match) | Distractor "secant" is not clearly wrong: $\sec A = c/b$ also links $A$, $b$ and $c$ directly, so "Know $A$ and $c$, want $b$" had two defensible answers. | Distractor changed to "inverse cosine" (which matches nothing: $\cos^{-1}\tfrac{a}{c}$ gives $B$); one sentence added to the explanation. | Definitions of the six ratios |
| `trig-m2-r2-h06` (explanation) | Said "angle $ABD$ is obtuse". In isosceles triangle $ABD$, angle $ABD$ is a base angle, $\theta/2$ (acute); the obtuse angle is $BAD = 180^\circ - \theta$. | Now says angle $ABD$ is one of the equal base angles, $\theta/2$, not a right angle. | Exterior angle theorem |
| 08h2, "The distance to the horizon" | "Usually a few percent farther" understates refraction: standard refraction gives about $3.86\sqrt h$ km vs geometric $3.57\sqrt h$, about 8% farther. | Now "about 8% farther in standard conditions (roughly $3.86\sqrt{h}$ km), though it varies with the weather." | A. T. Young, SDSU, "Distance to the horizon" (aty.sdsu.edu/explain/atmos_refr/horizon.html) |
| 08h2 plot (relative error vs angle) | Point label "45°: 1.75%" touched the curve near 55–60°. | Point label removed; same text as a separate label at (45, 0.8), below the curve. Re-rendered: clear. | — |
| Drill `trig-m2-r2-polygon` (prompt) | A learner who rounds side and apothem to 2 dp before computing the area is rejected (e.g. n = 12, R = 20: 1199.77 vs 1200.00); the prompt didn't say to keep precision. | Prompt adds "(use the unrounded side and apothem for the area)". | — |

## Checked and found right (a reader might doubt these)

- All 48 questions worked independently; numbers recomputed in Python: q11/q14 ($9/\tan 40^\circ = 10.726$), q20 ($x = 3155.6$, $h = 2209.6$), h02 (7.65 / 3.83 / 8.28 / 14.14), h04 (12-gon area exactly 3), h08 ($2(\sqrt5-1) \approx 2.47$), h15 (46.0–49.4; sine 30.2–31.1; 1/tan 32.4–34.8), h18 (0.93 / 0.81 / 0.52 / 53.3), h20 (17.85 km; 12.6, 89.3, 564 distractors), h22 ($R \approx 6371$ km; $h/\tan\alpha \approx 25$ km), h24 (7.14 → 7.1), h25 ($1/(\sin\theta\cos\theta)$ = 2.00, 2.13, 3.11, 7.26). Order questions have a single order; select-all keys correct.
- 08h1: pentagon example (11.76, 8.09, 237.8), $96\sin 1.875^\circ = 3.14103$ (between $3\tfrac{10}{71}$ and $3\tfrac17$), halving construction ($\tan\tfrac\theta2 = \tfrac{\text{opp}}{\text{adj}+\text{hyp}}$, which is Archimedes' own bisection step), $\sqrt{8+4\sqrt3} = \sqrt6+\sqrt2$, golden-triangle proportion and all table entries, decagon side $R/\varphi$, roof $24 - 12\sqrt3 \approx 3.215$. Gauss (1796/1801) and Wantzel (1837): correct; "$\cos 20^\circ$ cannot be written with whole numbers and square roots alone" is true.
- 08h2: tree example (39.06, 38.37, 39.77, 1.8%), small-angle derivation (geometrically sound, labeled approximate), 80° example (5.10 m approx; +5.37/−4.86 exact), $3.57\sqrt h$, 4654 m and 35.7 km, $R$ example (6367 km; 6082–6674 km for ±1′; 4999.5 km with the rounded cosine). al-Biruni at Nandana, Punjab, with the dip method: confirmed (Observatoire de Paris, Etymological Dictionary of Astronomy, "Biruni's method"); his result about 6,336 km, and that source also notes the precision was partly luck, consistent with the lesson's hedge.
- Drills: generated values recomputed in Python. `exact-extended`: 20 (function, angle) cases each match exactly one label value; numeric input accepts `sqrt(...)` expressions (docs/COURSE_FORMAT.md). Tolerances: 0.01 for 2 dp, 0.051 for 1 dp, `sigfigs: 3`; all accept correctly rounded answers. Earth-radius answer is computed from the shown (rounded) dip, so it is consistent with the prompt.
- Pictures: all 11 SVGs rendered, label previews rendered with the question markers; geometry to scale where claimed (30-60-90, 1:√3:2 in the 15° figure), markers on the named parts. In `trig-m2-sides-blank.svg` marker 4 covers the small right-angle box, which is acceptable since it marks that corner.
- Mermaid (05, 06, 07, 08): rendered, readable, content correct, accDescr covers each whole chart.
- Glossary/cards: definitions correct (golden triangle = 36-72-72; pentagon diagonal = φ·side); no duplicate terms or aliases with other glossary files in the course.

## Overlap with other round 2 lessons

- $\sin 18^\circ$ / $\cos 36^\circ$ also derived in `27h2-multiple-angles-chebyshev.md` (trig-m6, by algebra) and mentioned in `39h3-roots-of-unity.md` (trig-m9); both cross-reference 08h1, and 08h1 forward-references Module 6. Different methods, so complementary rather than repeated.
- The angle-halving construction relates to the trig-m6 tan-half-angle lessons (`27h1`, image `trig-m6-h-tan-half-line.svg`); Wantzel's theorem is also quoted in 27h2 and 39h3. 08h2's dip method differs from 04h1's Eratosthenes method.

## Uncertain

- Nothing material. The date of al-Biruni's Nandana measurement is only given as "early eleventh century", which is appropriately vague.

`content/math/check-module.sh trigonometry trig-m2`: OK, zero problems.

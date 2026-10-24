# REVIEW2-pc-m5: Trigonometry review, round 2 review

Reviewer for item 108 (precalculus, pc-m5). Scope: honors lessons 21h1-trig-equations.md and
21h2-combining-waves.md, the round 2 additions to 20-unit-circle.md and 21-trig-graphs-identities.md,
`questions/r2-pc-m5.yaml`, `drills/r2-pc-m5.yaml`, `glossary-r2-pc-m5.yaml`, `cards-r2-pc-m5.yaml`,
`images/pc-m5-*`.

`content/math/check-module.sh precalculus pc-m5` after the fixes: OK, zero problems.

## Changes

| Where | Problem | Change |
|---|---|---|
| 21-trig-graphs-identities.md, tan x plot | Point labels "(0, 0)" and "(π/4, 1)" sat on the y-axis and on the tangent curve. | Dropped the two point labels (dots kept) and named the points in the caption: "The dots mark (0, 0) and (π/4, 1)." |
| 21h1-trig-equations.md, plot in Example 1 | The "11π/6" point label sat on the rising sine curve. | Removed the point label; added a free label at (5.25, −0.4), above the line, clear of the curve and the tick "5". |
| 21h2-combining-waves.md, first plot | The automatic "√3 cos x" curve label was drawn over the sum and cosine curves at the right edge. | Removed that curve label; added a free label "√3 cos x" at (1.9, −1.75), next to the dashed cosine curve near its trough. |
| 21h2-combining-waves.md, beats plot | The automatic "sin 10x + sin 12x" label sat on the fast wave at the right edge. | Removed the curve label; added a free label at (1.6, 2.15), above both envelopes where the wave is small. |
| 21h1-trig-equations.md, Common mistakes, "Using the wrong partner" | "Mixing them gives angles with the wrong sign" reads as if the angle itself has the wrong sign. | Now "gives angles where the function has the wrong sign" (e.g. π − β for cos x = c gives cos = −c). |

All four plots re-rendered with `scripts/preview-plots.mjs` after the change and inspected: no
label on a curve, line or other label, nothing cut off.

## Checked and found right

- **Every question (40)** worked independently before reading the key: q01–q12, h01–h28. All keys
  correct, exactly one defensible answer, distractor explanations name real mistakes. Select-all
  sets verified (q04: 5π/6, 13π/6, −7π/6 have sine 1/2; 7π/6 and −π/6 have −1/2. q11, h07, h14,
  h22 likewise). Order questions (q03, q09, h06, h20) have no swappable steps; q09's periods
  2π/3 < π < 2π < 4π < 5π are distinct. Match/label answers are plain text.
- **Numbers recomputed in Python**: cos⁻¹0.3 = 1.2661, 2π − 1.2661 = 5.0171; sin⁻¹(−0.4) + 2π =
  5.8717, π + 0.4115 = 3.5531; cos⁻¹(−0.6) = 2.2143, 4.0689, π − β = 0.9273; tan⁻¹(−4/3) =
  −0.9273, max at 2.4981; tan⁻¹(3/4) = 0.6435, first top at t = 0.4636 s; daylight 13 h at
  t = 99.08 and 244.92 (days 99 = 9 April, 245 = 2 September in a non-leap year); 14 h at 122.25
  and 221.75 (h12; "171 and 173" distractor = 172 ± 0.856 confirmed); θ over one year stays in
  [−2.94, 3.32], so the claim that other turns don't matter holds. sin 10x + sin 12x =
  2 sin 11x cos x (max error 1e−14); sin x + √3 cos x peaks at (π/6, 2).
- **Lesson facts** (standard results, cf. OpenStax Precalculus 2e, ch. 7 "Trigonometric
  Identities and Equations", sum-to-product and solving trig equations sections): general
  solutions of sin/cos/tan equations; 2B solutions of sin(Bx) = c and cos(Bx) = c in [0, 2π) for
  −1 < c < 1; a sin x + b cos x = R sin(x + φ) derivation and the "add π when a < 0" rule; the
  cosine form R cos(x − δ) with cos δ = b/R, sin δ = a/R (verified by expansion); sum-to-product
  and product-to-sum formulas; beat frequency |f₁ − f₂| (the envelope has half that frequency
  but loudness peaks twice per envelope cycle; e.g. OpenStax University Physics Vol. 1, §17.7
  "Beats"). Simplifications (daylight model, frictionless spring, pure equal tones) are labeled.
- **Drills**: all inputs of solve-sin, solve-cos (18 each), multiple-angle (27) and amp-phase
  (144) recomputed in Python against brute-force root finding / identity checks: no mismatch.
  3-decimal answers have tolerance 0.001 ≥ 0.0005; "exact like sqrt(13)" / "pi/2" works because
  number answers accept typed math (docs/COURSE_FORMAT.md). Beats average can be x.5, tolerance
  0.01. No placeholder problems in the checker run.
- **Pictures**: all 5 SVGs and 3 blanks rendered and read. Geometry checked against the SVG
  source: sinusoid-features (π = 166 px, peaks at π/2 and 5π/2, minimum at 3π/2, zeros at 7π/6
  and 11π/6, y-levels 3/1/−1 consistent); sine-level (points on the circle, r = 140; the blue arc
  runs from the +x axis to the left ray, so it really is π − α); quadrant-signs (signs and 30°
  reference angle of 150° correct); amp-phase (legs a, b, hypotenuse R, angle φ). Label markers
  for q05, q08, h18 sit on the parts their labels name (q05 "Center" marker is just below-left of
  the center dot, where the O is printed; unambiguous).
- **Mermaid** (4): rendered from .mmd files; content correct, accTitle/accDescr describe the
  whole chart, readable.
- **Glossary**: none of the 10 terms or aliases exists in any other `glossary*.yaml` of the
  course; "extraneous solution" reuses glossary.yaml. Definitions correct. Cards (20) correct.
- **Overlap**: no other round 2 lesson in precalculus covers trig equations, amplitude-phase
  form, sum-to-product or beats (grepped all lessons and NOTES2-*.md).

## Left as is / uncertain

- In the first 21h2 plot and the 21h1 plot, the y-axis tick labels (1.5, −0.5) are crossed by
  curves or the dashed line y = −1/2 near x = 0. That is the shared renderer's tick placement,
  not a curve label; left alone.
- h11 accepts pi/4 and 0.785/0.7854; a learner who types 0.79 is marked wrong, which matches the
  stem's "decimal to 3 places".

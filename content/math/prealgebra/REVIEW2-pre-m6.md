# Round 2 review: pre-m6 (Exponents, roots and scientific notation)

Reviewer for item 99. Scope: honors lessons 22h1-radicals and 22h2-sig-figs, round 2 additions to
lessons 20, 21 and 22, `questions/r2-pre-m6.yaml` (45), `drills/r2-pre-m6.yaml` (7),
`glossary-r2-pre-m6.yaml` (7), `cards-r2-pre-m6.yaml` (25), `images/pre-m6-*` (11 SVGs).
`content/math/check-module.sh prealgebra pre-m6` reports zero problems after the fixes.

## Changes

| Where | Problem | Fix |
|---|---|---|
| Lesson 21, bar plot of 2ⁿ | Picture fix. The bar labels (1/8, 1/4, …, 8) are drawn on the same line as the x-axis tick numbers (−3 … 3), so they printed on top of each other ("1/8" over "−3", "2" over "1", …); the y-axis ran through the middle of the 2⁰ bar and its tick "1" sat on that bar. | Rewrote the block: `grid: false`, a baseline segment, bar labels 2⁻³ … 2³ under the bars, and the values 1/8 … 8 as `labels` above each bar. Same data and caption. Rendered and checked. |
| pre-m6-r2-q11 (label, sci-anatomy) | Picture fix. The "Exponent" marker (y 23.2) touched the top of the −4. | Moved to y 17, clear above the −4. |
| pre-m6-r2-h15 (label, radical parts) | Picture fix. The "Index" marker (33.5, 38) sat between the 4 and the small 3, so it could be read as pointing at the coefficient. | Moved to (38.1, 27), directly above the 3. |
| 22h2, "Counting significant figures" rule 5 | Factual wording. "exactly 1,500 to the nearest unit" mixed up a measured value with the lesson's "exact numbers" (counts and definitions). | Now "1,500 to the nearest one". |
| h03, h04, h05, h08 explanations | Other. Some distractors had no explanation (15√16, √2, √10/5, 243, 225). | Added a short line naming the mistake behind each. |

No answer-key errors were found.

## Checked and found right (a reader might doubt)

- All 45 questions worked independently before reading the key. Select-all sets (q02, q08, q14, h14,
  h30) right; order items (q04, q09, q13, h12, h28) have exactly one order; match and label
  pairings unambiguous. h17: 0.006358 to 2 s.f. is 0.0064 (next digit 5). h24: 6.95/3 = 2.3167, so 2.32 s.
  h22: 5.97/7.35 × 10² = 81.2, about 80 (NASA fact sheet values).
- Drills, recomputed in Python: sci-divide over all 402,832 allowed inputs (coefficient and exponent
  match an exact normalization, one adjustment always enough); frac-exponent over every allowed
  base/exponent (all exact, lowest terms); count-sigfigs (all 18 labels counted correctly, none
  ambiguous); simplify-root and like-radicals (r and k square-free, so the answer is unique).
  sigfig-multiply and sigfig-add use `num2`, which is fixed two decimals in `src/lib/drills.ts`, so
  e.g. 2.00 always shows 3 s.f. and the least-precise measurement is always the tenths one.
  `sigfigs: 2` uses ± half a unit in the 2nd figure, so every correctly rounded area is accepted
  (as the writer notes, an unrounded value within that window, such as 23.944 for 24, is accepted too).
  sigfig-add excludes exact half cases.
- Lesson 22 claim "one adjustment is always enough": coefficients in [1, 10) give a product in
  [1, 100) and a quotient in (0.1, 10). True.
- 22h1: tilted square in a 4×4 square has area 16 − 4·2 = 8; all decimal checks (Example 2:
  6.9282) and examples recomputed. Rationalizing denominators is correctly labeled mostly a convention today.
- 22h2: 1 in = 2.54 cm exactly by the 1959 international yard and pound agreement (NIST); SI
  prefixes G, M, k, m, µ, n (BIPM SI Brochure / NIST SP 330); Example 3 (9.492 → 9.5; 4.52 × 0.05 =
  0.226 > 0.2), Example 4 (138.656 → 139), Example 6 (1.5/1.27 = 1.18 → 1.2 × 10⁴), Example 7
  (ratio 80, log₁₀ 80 = 1.9). The significant-figure rules are labeled a school rule of thumb.
- Size-scale SVG: every marker is at the nearest power of ten for its object (virus 10⁻⁷, red blood
  cell ≈ 8 µm, sand grain ≈ 0.5 mm, Everest 8,849 m, Earth 1.27 × 10⁷ m, Earth–Sun 1.5 × 10¹¹ m).
- All 11 SVGs and both other label images (real-numbers, sigfig-zeros) rendered: content right,
  text readable, nothing cut off, markers on the right parts. All 5 Mermaid diagrams rendered and
  correct; accDescr describes each one fully.
- Glossary and cards: no errors. Lesson 20's "is a square root rational?" chart is correct for
  nonnegative rational n (√n is rational exactly when n is the square of a rational).

## Overlap

- pre-m8's honors lesson 35h3 (precision and measurement error) overlaps a little on trailing zeros
  and on rounding results to match measurements, but it cross-references this lesson's
  significant-figures rule and adds greatest possible error and bounds, so the two complement each other.
- pre-m1's 05h3 defines order of magnitude; 22h2 uses it without redefining it, as the writer notes.

## Left uncertain

- Nothing material. The `sigfigs: 2` leniency in pre-m6-r2-sigfig-multiply is an app-wide behavior
  of `sigfigs`, so I left it.

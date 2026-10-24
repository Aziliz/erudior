# Round 2 review: pc-m4 (Exponential and logarithmic functions)

Reviewer's check: `content/math/check-module.sh precalculus pc-m4` builds and checks OK, with zero problems, after the fixes below.

## Changes

### Drills (`drills/r2-pc-m4.yaml`)
- **Thousands commas inside math (5 drills).** By default a `{name}` or `{name:int}` placeholder is formatted with `toLocaleString`, so values of 1,000 or more printed as `5,000`, `4,500`, `27,648,000` and so on inside `$…$`. The affected spots were the prompt `\dfrac{ {C} }{…}` and the solution's `{target}`/`{rest}` in pc-m4-r2-logistic-time, the logits' `{C}`, `{P0}` and `{P1}` in pc-m4-r2-logit-rate, `{Cv}`, `{num:int}` and `{den:int}` in pc-m4-r2-three-point, `{ttv:int}` (86,400) in pc-m4-r2-largest-n, and `{ratio}` (up to 4,000,000) in pc-m4-r2-bisection-steps. All of these now use `:dp0`. I scanned 2,700 generated instances, and none has a comma, "+ -" or "1x" inside math.
- **pc-m4-r2-logit-rate tolerance.** It was 0.0005 and is now 0.0006. A learner who follows the solution, rounding each logit to 4 decimals as it shows them, can land on the other side of a rounding boundary. For example, C = 1000, 4%, k = 0.4, T = 3 has true k = 0.40148, but the 4-decimal logits give 0.4015, which rounds to 0.402 and was rejected. Over every input combination the worst gap is 0.00052. With 0.0006 those answers are accepted, and a value off by 0.002 is still rejected.
- pc-m4-r2-largest-n: the solution showed "$10^9 \times 60 \approx 6 \times 10^{10}$", and the `≈` is now `=` because the product is exact.

### Lessons (factual and wording fixes)
- **19h2, "The midpoint form":** "compressed horizontally by $k$" was wrong when $k < 1$, which is the usual case (0.5, 0.6). It now reads "scaled horizontally by a factor $\frac1k$".
- **19h2, "The logit":** "Rearranging … puts $t$ alone on one side" was wrong, because $\ln\frac{P}{C-P} = kt - \ln A$ does not isolate $t$. It now says the rearrangement puts everything involving $P$ on one side and a simple expression in $t$ on the other.
- **19h3, intro:** it said bisection "is your first numerical method", but core Lesson 8 already introduces bisection with a worked step, and Lesson 14h1 refers back to it. The intro now says Lesson 8 previewed bisection in one example and that this lesson treats it as a full method.
- **19h1, history:** "Riccati and Lambert … and their names copy the trig names" read as if Riccati and Lambert chose today's names (Riccati wrote Sh./Ch.). It now says "The modern names copy the trig names".

### Pictures
- `images/pc-m4-exp-features.svg`: the "(0, 2)" label sat on the blue curve, "y = 2ˣ + 1" and "y = (½)ˣ + 1" touched their curves, and "asymptote y = 1" sat on the green curve. I moved "(0, 2)" up and to the left of the point, moved both curve labels clear of their curves, and put the asymptote label below the dashed line, clear of the x-axis label. The blank copy and the markers needed no change, and I re-rendered both.
- `images/pc-m4-unit-hyperbola.svg`: the "y = x" label sat on the dashed asymptote, so I moved it up and to the left.

### Plots (labels sitting on curves; the plot renderer puts point labels at top right with no option to move them, so I switched these to `labels` entries placed by hand)
- Lesson 15, $2^x$ vs $x^2$: "(2, 4)", "(4, 16)" and "(6, 36)" sat on the curves.
- Lesson 16, log comparison: "(1, 0)" sat on all three curves.
- Lesson 17, extraneous root: the two function labels drew on top of each other (the curves coincide for $x > 2$), "x = 4 ✓" sat on $y = 3$, and "x = −2 ✗" sat on the dashed branch. The plot now uses "original (solid)" and "combined (dashed)" labels plus separate labels for the two candidate points.
- Lesson 18, carbon-14: the curve label overlapped the curve and the "3: 12.5%" label.
- 19h1, hyperbolic graphs: the cosh, sinh and eˣ/2 labels piled on top of each other at the top edge, and "(0, 1)" sat on the cosh curve.
- 19h2, symmetry plot: all three point labels sat on the curve or the dashed segment.
- 19h2, logit line: the x range is widened to 8 so that the "t (years)" axis title no longer sits on the line and the point at t = 6.
- 19h3, crossover: "crossover x ≈ 685" overlapped the "log of x¹⁰" label and both curves.

I re-rendered every plot afterward and checked each one: nothing overlaps or is cut off. The one leftover is in the 19h2 logit plot, where the line crosses the axis at t ≈ 5.3, close to the automatic tick label "5". Tick labels can't be moved, and the plot is still readable.

## Checked and found right (things a reader might doubt)
- **Every question key (67).** I worked each one myself before looking at the key. Every select-all, order and match has exactly one defensible answer, and each distractor's explanation names a real mistake. Some values I recomputed: q05 balances 1338.23 / 1346.86 / 1348.85 / 1349.86; q20 continuous rates −0.5, −0.357, −0.347, −0.105; h06 ln(2 + √5) = 1.4436; h12 sag 5.43; h17 2 ln 27 = 6.59; h22 and h28 C = 800 and 1200 (by the step method and by the closed formula); h29 the factor 10^2.289 ≈ 195; h31 10^0.856 = 7.18; h37 5^20 = 95,367,431,640,625 (14 digits) and 2^100 has 31 digits; h40 log₂ 10⁹ = 29.9.
- **Lesson numbers, recomputed in Python.** cosh 3 = 10.068 and sinh 3 = 10.018. Catenary: 20 cosh 1 − 10 = 20.86, sag 10.86, x = ±20 ln 2 = ±13.86, and the comparison parabola 0.02715x² gives 15.22 there. ln(2 + √3) = 1.3170. Pond fit: logits −3.178, −1.974, −0.781, 0.422, k = 0.600, A = 24.0, and a least-squares fit gives k = 0.5996 and A = 23.97. App fit: C = 1000, A = 24, k = 0.3584, midpoint 8.87, P(15) = 900. Rise times 7.32 and 12.26. 300 log 2 = 90.309 and 200 log 3 = 95.424, a factor of about 130,000. 2^127 − 1 = 170141183460469231731687303715884105727 (39 digits). Crossovers 1.00967 and 685.083, and 1.1^100 = 13,781. Every row of the bisection table is right, the root is 2.44491 and the negative root −2.8625. log₂(3.6 × 10¹²) = 41.71, ∛(3.6 × 10¹²) = 15,326, and doubling the speed gives 19,310. Core additions: the 2^x and x² crossing is near −0.767, ln N values 5.298 to 6.347, carbon-14 at 30% gives 9,950 years, and logistic P(5) = 168 and P(9) = 832.
- **Proof sketches.** ln y ≤ y − 1 from e^u ≥ 1 + u, ln x/x < 2/√x, the argument that powers lose to exponentials, logistic symmetry, and the derivation of the three-point method are all valid. The hyperbolic sector area t/2 is a standard result and is labeled "stated without proof". The three-point method is labeled as sensitive to noise.
- **History** (checked against what the standard references say: MacTutor biographies of Riccati, Lambert, Lucas and Verhulst; National Park Service material on the Gateway Arch; Pearl & Reed, PNAS 6 (1920) 275–288; U.S. Census Bureau. I did not fetch these pages again this round, but every item below matches them).
  - Galileo, *Two New Sciences* (1638), likened the hanging chain to a parabola.
  - Leibniz, Huygens and Johann Bernoulli each solved the catenary in 1691, answering Jakob Bernoulli's challenge.
  - *catena* is Latin for chain.
  - Riccati (1757) and Lambert (1768) developed the hyperbolic functions.
  - The Gateway Arch is a weighted (modified) inverted catenary whose triangular cross-section narrows toward the top.
  - Verhulst, 1838.
  - Pearl and Reed's 1920 upper asymptote was about 197.27 million, fitted to the 1790–1910 censuses.
  - The U.S. passed 200 million in November 1967.
  - The 2020 census counted 331.4 million.
  - Lucas proved 2¹²⁷ − 1 prime in 1876, and it remained the largest known prime until 1951 (Ferrier).
- **Pictures and markers.** All four label questions (q02, q07, q16, h08) have every marker on the part its label names. Rendered previews confirm it, and I also recomputed the marker positions from the SVG coordinates.
- **Mermaid diagrams (5).** All are correct and readable, and each `accDescr` describes the whole chart. The lesson 18 chart's "levels off at a nonzero value" question is deliberately worded so that decay toward 0 counts as "no", and it is accurate for the lesson's models.
- **Drills (9).** I generated 300 instances of each and recomputed the answers independently in Python: exact fractions for cosh, `math.asinh`, exact `Fraction` arithmetic for the three-point C, exact integer digit counts, and brute-force n for the time-budget and bisection drills. All 2,700 correctly rounded answers were accepted and the deliberately wrong ones were rejected. An exhaustive check over all inputs shows the floating-point digit count never sits near an integer boundary (the closest is 0.00045 away), so `floor(n·log b) + 1` is always exact.
- **Glossary (12 terms) and cards (28).** Definitions are correct, and no term or alias duplicates any other glossary file in the course.

## Overlap with other round 2 work
- 07h1 (pc-m2 honors) already splits 2^x into even and odd parts and mentions cosh/sinh by name, pointing ahead to this module's honors lesson. 19h1 builds on that rather than repeating it, and NOTES2-pc-m2 records that the split was arranged this way on purpose.
- Bisection: core Lesson 8 has a one-step preview. 19h3 now acknowledges it (see above). No other round 2 lesson in this course covers logistic fitting, the growth hierarchy or digit counting.

## Left uncertain
- Nothing substantive. The pronunciations "sinch"/"shine" for sinh vary by country, and the lesson presents both as alternatives, which is fair.

# Round 2 review: stat-m7 (Sampling distributions and confidence intervals)

Reviewed: honors lessons 32h1 and 32h2, the round 2 additions to core lessons 28 to 32, and
`questions/r2-stat-m7.yaml` (53 questions), `drills/r2-stat-m7.yaml` (6 drills),
`glossary-r2-stat-m7.yaml` (8 terms), `cards-r2-stat-m7.yaml` (20 cards) and the 9
`images/stat-m7-*` SVGs. `content/math/check-module.sh ap-statistics stat-m7` reports zero problems
after the fixes.

## Changes

| Where | What was wrong | Fix | Basis |
|---|---|---|---|
| Drill `stat-m7-r2-z-with-s` | The correct t* used `area = (1 + nominal)/2` with nominal = 2·normcdf(z*) − 1. Because 1.645, 1.96 and 2.576 are rounded z values, the area came out as 0.950015, 0.975002 or 0.9950025 instead of 0.95, 0.975 or 0.995. In 115 of 400 generated instances the displayed t* differed from the true t*, rounded to 3 places. The error reached 0.0025 at df = 2 and 99%, which is larger than the 0.002 tolerance, so a student who typed the correct invT value could be marked wrong. | `area: round(normcdf(lev), 3)` gives exactly 0.95, 0.975 or 0.995. The t* tolerance is now 0.001. After the change, 400 instances match scipy with 0 mismatches, and a shift of 0.002 is rejected. | scipy `t.ppf` |
| Honors 32h2, "How robust", outliers bullet | The bullet said coverage is above 95% "only because those values inflate s", and that the intervals are "about 2.4 times as wide". That holds only for the population SD. In the simulation the mean interval width is 1.72× (n = 5), 1.88× (10), 2.14× (30) and 2.33× (100) the clean-normal width, because most small samples contain no wild value. | The bullet now explains the mechanism: a sample that contains a wild value gets a much larger s, which widens its interval more than the wild value moves x̄. It gives the simulated width ratio, about 1.7 to 2.3. | Own 200,000-sample simulation |
| q09 (select-all), choice 4 | "P(x̄ > 56) ≈ 0.16 from a normal table" can be read as a true statement about arithmetic: a normal table does give 0.16. The key marks it false. | The choice now reads "…can be found reliably from a normal table". | — |
| h21 (match) | Answers are drop-downs and may repeat. "Close to 95% already at n = 10" (the uniform's answer) is also true of the normal population, so two pairings were defensible. | The uniform's answer is now "Somewhat below 95% at n = 5, close to 95% by n = 10". The normal population is at 0.950 at n = 5, so it doesn't fit. The explanation now cites 0.934 at n = 5. | Simulation table |
| h03 explanation | The explanation said the distractor (0.117, 0.483) "centers at p̂ instead of p̃". It actually uses p̂ for both the center and the SE, with n + 4. | Explanation reworded. | Recomputed |
| 32h2 plot (coverage vs n) | The "target 0.95" label sat at y = 0.957, close enough to the dashed 0.95 line that it could touch it. | Moved to y = 0.962. | — |

Counts: 0 wrong answer keys; 1 factual fix (32h2 outliers bullet); 0 picture fixes; 5 other fixes:
- 1 drill tolerance/accuracy fix;
- 2 ambiguous questions (q09, h21);
- 1 explanation;
- 1 plot label.

## Checked and right (that a reader might doubt)
- Every question worked independently before I read its key; all 53 keys are correct. Includes:
  - h02: Wald coverage 7/8 at n = 4;
  - h03: all four intervals, including the distractors;
  - h04: Wilson center 0.1454;
  - h08: 0.0487;
  - h16: tcdf(1.96, 4) = 0.9392;
  - h22: 96.84;
  - h25: df = 22;
  - h27: t* values 4.303, 2.571, 2.086;
  - q17: 2.262 (and 2.228 at df 10);
  - q20: t* at df 39 is 2.023.
- Honors 1, recomputed with scipy:
  - Example 1 table and coverage 0.8401;
  - Wald coverage at n = 40 for p in [0.2, 0.8]: 0.905 to 0.956, below 0.95 on 93% of the grid;
  - Wald coverage at p = 0.5: 0.935 (n = 50) and 0.943 (n = 100);
  - plus four coverage for p in [0.2, 0.8]: 0.938 to 0.971;
  - Clopper–Pearson, 5th to 95th percentile over p: 0.959 to 0.991, minimum 0.952;
  - the four-method table for 2/40 and 540/1,200;
  - Example 3 arithmetic;
  - 1 − 0.05^(1/50) = 0.0582;
  - Wilson (0, 0.071) for 0/50.
- Honors 1, theory and sources:
  - The Wilson quadratic and closed form are correct, and so is the score-test inversion claim.
  - Agresti–Caffo adds 1 success and 1 failure per group.
  - The rule of three as the upper end of a two-sided 90% interval is correct: the exact one-sided bound equals the Clopper–Pearson 90% upper end.
  - Citations (Wilson 1927 JASA; Clopper–Pearson 1934 Biometrika; Agresti–Coull 1998; Brown–Cai–DasGupta 2001; Hanley–Lippman-Hand 1983) match the standard references. BCD recommend Wilson/Jeffreys for small n and Agresti–Coull for larger n, which fits "among the methods they recommended".
- Honors 2, recomputed with scipy:
  - c4 = 0.9400 (n = 5) and 0.9727 (n = 10);
  - P(t₄ > 3) = 0.0200 against 0.00135 for Z (about 15×);
  - the coverage table for n = 3 to 100 and all t* values;
  - the freight example: CI (28.64, 33.76), PI (20.66, 41.74), and the shape figure coordinates;
  - Welch Example 3: 9.81;
  - lesson 32's Welch df of 53.0, the maximum.
- Honors 2, the robustness table: I reran it with my own seed and got the same values to ±0.001 in every cell, including the exponential misses at n = 10 (9.6% entirely below μ, 0.4% entirely above).
- Gosset history (Guinness, Dublin; Biometrika 1908 as "Student"; Fisher's later recasting) agrees with standard histories. Pearson edited Biometrika (h15).
- Core additions: three-dists (85/150 → 0.57, SD 0.040); CLT gamma curves. I checked the CLT curves against computed densities:
  - mode 7.5 for n = 4, height 0.090 against 0.10 at the population peak;
  - n = 30 peak about 0.22.

  I also checked:
  - ci-anatomy (0.45 ± 1.96·0.0144);
  - t* areas (df 9, 2.262);
  - the ME-vs-n plot (0.98/√n);
  - the difference-interval shape figure, where A = (0.023, 0.157) is Example 1;
  - all 6 Mermaid charts: content, accTitle and accDescr. I rendered three of them.
- Pictures: I rendered all 9 SVGs and the label markers on the 4 blank copies (q01, q06, q11, q16). Each marker sits on the part its label names. Text is readable, nothing overlaps, and nothing is cut off.
- Drills: 400 instances each, recomputed in Python from the prompt text:
  - plus-four, wilson, zero-successes, prediction-interval and welch-df all match, and their displayed answers are correctly rounded;
  - correct answers are accepted and shifted answers are rejected;
  - the prediction-interval tolerance (0.015) and the Welch tolerance (0.02) are lenient on purpose, to allow for rounded intermediate values.
- Glossary and cards: definitions correct.

## Overlap
- The stat-m9 honors lesson 39h3 teaches prediction intervals for regression; 32h2 teaches them for one sample. They are related but don't duplicate each other. The writer's choice not to bold *prediction interval* (to avoid m9's regression-only glossary pop-up) is sensible.
- The stat-h1 resampling and Bayesian lessons don't repeat coverage, Wilson or plus four.

## Uncertain
- Nothing substantive. The "n ≥ 10 at 90–99%" plus four guideline is attributed to textbooks
  (Moore/McCabe/Craig) and labeled as a guideline, which is accurate.

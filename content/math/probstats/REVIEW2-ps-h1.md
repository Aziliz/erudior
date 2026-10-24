# REVIEW2-ps-h1: review of honors module ps-h1 (Modern statistical methods)

Reviewer for item 123. Scope: lessons 90–93, `questions/r2-ps-h1.yaml` (55), `drills/r2-ps-h1.yaml` (11),
`glossary-r2-ps-h1.yaml` (37), `cards-r2-ps-h1.yaml` (40), `images/ps-h1-*` (4 SVGs + 4 blanks), 2 figure
blocks, 3 Mermaid diagrams. `content/math/check-module.sh probstats ps-h1` reports zero problems after the fixes.

## Changes

| Where | What was wrong | Change |
|---|---|---|
| `drills/r2-ps-h1.yaml`, ps-h1-r2-ridge-1d | Answer tolerance 0.0006 for a 4-decimal answer accepted the least-squares slope (λ forgotten) in some instances, e.g. S_xx = 112, S_xy = −3.5, λ = 1: −0.0313 accepted for −0.0310 (found in 3,000 generated instances). | Tolerance 0.0006 → 0.0001 (still ≥ half the last place, so every correctly rounded answer is accepted; regenerated 3,000 instances, all correct answers accepted, wrong ones rejected). |
| `drills/r2-ps-h1.yaml`, ps-h1-r2-lasso-1d | Same over-wide tolerance (0.0006 for 4 decimals). | 0.0006 → 0.0001, same check. |
| Lesson 91, `plot` block (bias–variance) | The x-axis label "penalty λ" sat on the dashed variance curve at the right edge, and the automatic "λ* = 4" point label was crossed by the MSE curve. | x range 0–20 → 0–30 (variance is then under 0.005 at the edge, below the label), axis label shortened to "λ" (the caption names it), the point label replaced by a free label above the minimum at (4, 0.148). Re-rendered: nothing overlaps. Curves unchanged. |
| Lesson 92, BH theorem | "Theorem (Benjamini and Hochberg, 1995) … FDR = m₀q/m" attributes the equality to the 1995 paper, which proved the bound FDR ≤ m₀q/m. Equality for independent continuous p-values came later (Benjamini and Yekutieli 2001; Finner and Roters 2001). | Added one sentence: BH proved the bound; that it holds with equality was shown a few years later. |
| Lesson 90, Example 2 | Text said the spread is "only about twice the noise variance, so about half of what we see is noise", and in the same paragraph that estimates move about a third (35%) of the way. A student plugging S/7 into B = σ²/(σ² + τ²) would expect ≈ 50% shrinkage and see a contradiction. | Added a parenthetical: plugging S/7 into B suggests about half; James–Stein uses (p − 3)σ²/S = 5/14.12 instead of 7/14.12 because E[(p − 3)σ²/S] = B exactly under a normal prior (S/(σ² + τ²) ~ χ²₇, E[1/χ²₇] = 1/5), so it shrinks by 35%. |

No answer-key errors found.

## Checked and found right (things a reader might doubt)

- **All 55 questions worked independently** before reading keys; every key, distractor explanation, `accept`
  list, select-all set, order and match is right. Recomputed: h03 risk 2σ² = 8; h05 risk 4; h07 E(1/χ²₈) = 1/6;
  h08 21.6 (and distractors 21.5, 21.2); h10 2.5; h14 0.4; h15 −0.075; h18 λ* = 2.25; h21 one-SE → λ = 10;
  h22 0.4; h23 30; h28 1 − 0.95¹⁰ = 0.401; h30 Holm 3 (Bonferroni 2, BH 4); h31 BH 5; h34 18/138 = 0.130;
  h35 BH-adjusted 0.035; h36 0.00625; h37 3; h38 0.005 < 0.00556 < 0.01 < 0.05; h43 e^−1.5 = 0.223; h45 1/2;
  h46 0.6; h47 556; h50 e^−0.5 = 0.607.
- **Lesson numbers** (Python): Example 1 of 90 (factor 0.6829, estimates); Example 2 (x̄ = 10.95, S = 14.12,
  factor 0.6459, E → 12.274, F → 9.497) and every arrow end in the `shape` figure; c* and its risk; the
  Stein risk formula and its proof (∑∂gᵢ/∂xᵢ = k(p − 2)/‖x‖²); ridge MSE derivative 2S_xx(λβ² − σ²)/(S_xx + λ)³ and
  MSE(λ*) = σ²/(S_xx + σ²/β²); Example 1 of 91 (0.125); rail-wear 0.58, 0.52, 0, threshold 92.8 (S_xx = 70,
  S_xy = 46.4 match core lesson 34); CV table one-SE rule; 1 − 0.95^m for m = 8, 20, 100; Holm/BH/Bonferroni
  2/3/5 on the sensor list; BH-adjusted values 0.008 … 0.63; 45/125 = 0.36; the four-state transition matrix
  (πP = π verified); MH ratios 0.747, 0.283, 1.27; posterior mean 2.2755 ≈ 2.28 (numerical integration); ESS 526,
  MCSE 0.029.
- **Holm proof** (rank j ≤ m − m₀ + 1 ⇒ threshold ≤ α/m₀, union bound) is correct; FDR ≤ FWER always, with
  equality under the global null (FDP ≤ 1{V ≥ 1}).
- **Positive-part James–Stein** strictly dominates James–Stein (Baranchik 1964; Lehmann and Casella,
  *Theory of Point Estimation*, 2nd ed., §5.5); grand-mean version needs p ≥ 4; X admissible for p = 1, 2.
- **Ridge Bayes reading**: N(0, σ²/λ) prior gives the ridge estimate as posterior mean and mode; Laplace priors give
  the lasso as the posterior mode (Hastie, Tibshirani and Friedman, ESL §3.4). LOO shortcut eᵢ/(1 − hᵢᵢ) for
  least squares and ridge at fixed λ (ESL §7.10).
- **BY correction** q/∑1/j for arbitrary dependence and PRDS result (Benjamini and Yekutieli 2001).
- **Acceptance-rate guides** 0.234 (Roberts, Gelman and Gilks 1997) and ≈ 0.44 in one dimension (Gelman, Roberts
  and Gilks 1996), labeled as rough; Gibbs sampler named by Geman and Geman (1984); Metropolis et al. 1953,
  Hastings 1970; James and Stein 1961; Stein 1956; Hoerl and Kennard 1970; Tibshirani 1996; Holm 1979.
- **Drills**: all 11 generated 3,000 times each with the app's own `generate`/`checkAll`; answers recomputed by an
  independent implementation from the prompt text as shown. Correctly rounded answers are accepted, a clearly wrong
  answer rejected, no unfilled placeholders, NaN, "+ -" or thousands commas. BH and Holm count drills produce every
  count 0–6.
- **Pictures**: all four SVGs and blanks rendered with markers. JS risk curve checked against the Poisson-mixture
  formula (6.209 at ‖θ‖² = 10, 8.240 at 30, 9.033 at 60; oracle 5, 7.5, 8.57). Lasso/ridge: the outer contour
  touches the diamond exactly at its corner (L1 distance 52.0 = diamond size) and the disk tangentially (distance
  52.07 vs radius 52), never crossing either. BH plot points, BH line, Holm and Bonferroni thresholds at the right
  heights. Trace plot consistent with the posterior (mass between about 1 and 4). Every marker sits on the part its
  label names; text readable, nothing cut off.
- **Mermaid** (91, 92, 93): content correct, accTitle/accDescr describe the whole diagram, readable.
- **Glossary**: no term or alias duplicates any other glossary file (en dash/hyphen normalized). *Risk function*
  and *admissible* are defined in glossary-r2-ps-m6, so lesson 90 leaving them unbolded is fine; *burn-in*
  (reliability, ps-m3) vs *burn-in period* (MCMC, here) are distinct entries.
- **Cards**: all 40 correct.

## Overlap

- Lesson 29h2 (ps-m6, decision theory) shrinks a single normal mean toward a prior guess; lesson 90's c·X section
  is the many-means version and builds on it. 29h2 explicitly leaves Stein's paradox to lesson 90. Complementary,
  not duplicated.
- NOTES2-ps-m7 mentions that a multiple-testing honors lesson was left out for this module; lesson 92 covers it.
  No other round 2 lesson covers ridge/lasso, FDR or MCMC.

## Left uncertain

- Nothing material. The ergodic theorem is stated in simplified form (finite/irreducible + aperiodic) and labeled
  so; general state spaces need Harris recurrence, which is beyond the lesson.

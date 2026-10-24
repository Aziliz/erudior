# Round 2 review: stat-m6 (Random variables)

Reviewer, independent of the writer. Scope: honors lessons 27h1 and 27h2, the round 2 additions to
lessons 24–27, `questions/r2-stat-m6.yaml` (48), `drills/r2-stat-m6.yaml` (6),
`glossary-r2-stat-m6.yaml` (9), `cards-r2-stat-m6.yaml` (20) and `images/stat-m6-*` (4).
`content/math/check-module.sh ap-statistics stat-m6` reports OK (zero problems) after the fixes.

## Changes

### Answer keys and explanations
- **stat-m6-r2-h17** (Var(X − Y)): the key (13) was right, but the explanation named a mistake that
  is not among the choices ("subtracting the variances, 16 − 9" = 7) and did not explain the
  distractor 1. Rewrote that sentence: 37 adds the covariance, 25 ignores it, 1 = (4 − 3)² from
  subtracting the SDs.
- **stat-m6-r2-h28** (ρ from Cov): distractor −0.15 matched no identifiable mistake, and the
  explanation's "dividing by σX + σY" (−0.43) is not a choice. Replaced −0.15 with −1.5 (dividing
  by σX only) and rewrote the explanation: −0.6 divides by σY only, −1.5 by σX only (impossible
  for a correlation), −3 is the covariance. Key (index 3, −0.3) unchanged.
- **stat-m6-r2-h14**, **stat-m6-r2-h11**: keys right; added the missing distractor explanations
  (h14: 1.25 = only the 5 non-overlapping pairs, 5 = 10 positions × ½; h11: 0.25 is one card's
  chance).

### Drills
- **stat-m6-r2-shared-pairs**: with n up to 60, C(n, 2) reached 1,035–1,770, and the drill
  formatter prints it with a thousands comma inside math (`$\binom{53}{2} = 1,378$`), which the
  brief forbids. Capped n at 45 (C(45, 2) = 990). Re-sampled: no commas.

### Figures (core lessons)
- **Lesson 25, Pythagorean ```shape**: the segment labels "σX = 3" and "σ(X+Y) = 5" are placed
  only 12 px off their lines and centred, so both texts crossed their sides. Kept the bottom
  label, moved the other two into `labels` placed clear of the lines (4.75, 1.45) and (1.45, 2.05).
- **Lesson 25, normal plot of D = A − B**: point labels "D = 0" and "mean 3" overlapped each other
  (3 units ≈ 30 px apart), and the long x-axis label "D = A − B (minutes)" crossed the right tail of
  the curve. Removed the "D = 0" label (the point stays), shortened the axis label to "D (minutes)"
  (the caption still defines D = A − B), and widened x to [−15, 25] (shade to 25).
- **Lesson 27, geometric cdf plot**: the y-axis label "P(X ≤ k)" sat on the dashed line y = 1
  (y max 1.05). Raised y max to 1.12.

### Lesson text
- **27h1, Example 2**: the limit P(no match) → 1/e is stated without proof; added a pointer to the
  Module 5 honors lesson (23h1, inclusion–exclusion) where it is derived. No other text changes.

## Checked and found right (things a reader might doubt)
- 27h1: proof of E(X + Y) without independence; E(X²) for a die 91/6 ≈ 15.17 and the gap 35/12 ≈
  2.92 = Var; hypergeometric counts 126/378/252/36 of 792 and E = 990/792 = 1.25; matching table for
  n = 3; H₆ = 2.45, 6H₆ = 14.7; stage variances 0.24, 0.75, 2, 6, 30 (sum 38.99, SD 6.24);
  H_n ≈ ln n + 0.5772 (Euler–Mascheroni; "0.58" is fine); the "simulation" figures are confirmed
  by an exact Markov-chain calculation: P(T ≤ 14) = 0.583, P(T ≥ 40) = 0.0049 ≈ 1 in 204;
  birthday pairs 435/365 = 1.19 and P(at least one) = 0.706; P(no match) → 1/e = 0.368.
- 27h2: joint table margins, μX = 0.7, σX² = 0.61, μY = 0.4, σY² = 0.24, E(XY) = 0.45,
  Cov = 0.17, ρ = 0.444; T distribution 0.40/0.25/0.20/0.15, Var(T) = 1.19 both ways; √0.85 =
  0.922; portfolio SDs 10, 8.06, 7.07, 5, 0; Cov(I_i, I_j) = −p(1−p)/(N−1) and the FPC derivation
  (re-derived by hand, and confirmed numerically by the exact hypergeometric check in the fpc drill); Example 4: 0.5966, SD 0.772 vs 0.968 (ratio 1.254, "about 25%"), direct
  E(X²) = 1710/792; Example 5: 900/999 = 0.901, √0.9 = 0.949 (binomial SD ≈ 5% too large),
  399950/399999 = 0.99988. Module 3 is "Two-variable data" (the r cross-reference is right).
  "Correlations tend to rise in a crisis" is labelled as a general observation; it matches the
  finance literature (e.g. Longin and Solnik, "Extreme correlation of international equity
  markets", Journal of Finance 56, 2001). The 10% rule is correctly called a convention.
- Lesson 24 picture: bars at 0.50/0.30/0.15/0.05 to scale, fulcrum at 0.75, dashed line at
  μ + σ = 1.637; label-question markers sit on the fulcrum, bar 0, bar 2 and the dashed line.
- Lesson 26 picture: all three panels share one vertical scale and match B(10, p) exactly; the
  label-question markers sit at the top right of each panel in the right order.
- 7 Mermaid diagrams previewed: content correct, readable, accTitle/accDescr describe the whole
  diagram. Coupon bar plot and portfolio plot: values right, no label on a curve.
- All 48 questions worked independently before reading the keys; all keys right (only the
  explanation/distractor issues above). Text answers: values compare numerically, so 0.140625 vs
  0.1406, 12/19 vs 0.632 and 25/3 vs 8.33 are all covered.
- Drills: 300 instances of each of the 6 regenerated in the app's own engine and recomputed in
  Python from the prompt text (coupon and pairs/empty boxes exactly with fractions; cov-table from
  the parsed table; fpc against exact hypergeometric sums): 0 mismatches; every displayed answer is
  accepted, and all tolerances are at least half the last decimal place asked for.
- Glossary (9) and cards (20): definitions and formulas correct (50-50 mix SD σ√((1+ρ)/2) checked);
  no term or alias duplicates another glossary file in the course.

## Overlap with other round 2 lessons
- 27h1 Examples 2 and 4 (matching problem, shared birthdays) use the same two problems as the
  stat-m5 honors lesson 23h1 (inclusion–exclusion, birthdays and matching). The angle is
  different (23h1: probabilities of no match / at least one match; 27h1: expected counts by
  linearity) and 27h1 itself stresses that difference, so it reads as a deliberate callback. I
  added a cross-reference rather than removing anything. "matching problem" is a glossary term
  only in stat-m6's file, so there is no duplicate definition.

## Left as is / uncertain
- Lesson 25 normal plot: the y-axis is drawn at x = 0, where the curve is high, so the tick numbers
  0.06–0.07 touch the curve. That comes from the renderer drawing the axis at 0, not from the spec,
  and it stays readable.
- The 27h2 railway joint table is invented (and the lesson says "Suppose"), which is fine.

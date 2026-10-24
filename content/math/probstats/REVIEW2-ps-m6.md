# Round 2 review: module ps-m6 (Estimation)

Reviewer pass on the round 2 work listed in `NOTES2-ps-m6.md`: honors lessons 29h1, 29h2 and 29h3, the
additions to core lessons 23–29, `questions/r2-ps-m6.yaml` (77), `drills/r2-ps-m6.yaml` (8),
`glossary-r2-ps-m6.yaml` (21), `cards-r2-ps-m6.yaml` (28) and the 8 `images/ps-m6-*` SVGs.
`content/math/check-module.sh probstats ps-m6` reports zero problems after the fixes.

## Changes

| Where | Problem | Fix |
|---|---|---|
| Drill `ps-m6-r2-newton-step` | Tolerances too tight. The solution prints $e^{-\lambda_0}$ to 4 decimals, and a learner who uses that rounded value (as the solution does) gets $\ell''(\lambda_0)$ off by up to 0.020 (e.g. $n = 25$, $\sum x = 29$, $\lambda_0 = 0.5$) and $\ell'(\lambda_0)$ off by up to 0.0050. Both were checked against tolerance 0.005, so correct work was rejected. Brute force over all 2,154 valid inputs. | Tolerances changed to 0.01 for $\ell'$, 0.03 for $\ell''$ and 0.003 for $\lambda_1$ (the worst case was 0.0018 with rounded intermediates). Clearly wrong answers such as a sign slip or a dropped term still fail. |
| 29h3, "Agresti–Coull" section | Said A–C is "slightly conservative". The same lesson defines **conservative** as coverage ≥ nominal for *every* $p$, and A–C does not meet that: exact coverage at $n = 20$ dips to about 0.929. | Now says its coverage tends to run a little above the nominal level, but not at every $p$, so it is not conservative in the strict sense. |
| 26, MVUE recipe Mermaid (label and accDescr) | "E(W \| T) still beats W" overstates Rao–Blackwell. The variance never increases, but it can stay the same (for example when W is already a function of T). | Changed to "is at least as good as W, but may not be best" in both the label and the accDescr. |
| 29, "priors wash out" plot | The "prior Beta(2, 8)" label ran over the y-axis line and its "4" tick, and "posteriors after 30 of 100" touched the peak of the Beta(32, 78) curve. | The left label is now two short lines ("prior" / "Beta(2, 8)") at θ = 0.1, between the axis and the green curve. The top label moved to θ = 0.56. |
| 29h1, Newton plot | The auto-placed "start 1.5" label sat on the 1.6/1.8 tick labels and the tangent line. | The point is left unlabeled, and a separate label "start 1.5" sits at (1.5, −5.4) below the curve. |
| 29h2, risk-curve plot ($n = 16$) | The y tick labels were cut off at the left edge (".015", ".025"). The "0.5" label sat on the bottom of the green bowl. | The y axis is rescaled to risk × 1000 (0 to 30), with the functions, labels, axis title and caption to match. The label now reads "guess 0.5" and sits at the top, between the arms of the bowl. |
| 29h2, shrinkage risk plot | The "X̄: risk 4" and "θ = 106" labels lay on the orange curve, and the curve cut through the y-axis title at the top left. | Dashed vertical guides now run down to θ = 94 and θ = 106, with their labels beside them near the axis. "X̄: risk 4" moved below the dashed line at the right, and the y range is now 0–10 so the curve stays clear of the axis title. |

Counts: answer-key errors 0; factual fixes 2 (Agresti–Coull wording, Rao–Blackwell label); picture
fixes 4 (three plots in 29h1/29h2, one in 29); other fixes 1 (drill tolerance).

## Checked and found right (things a reader might doubt)

- **29h1, every number:** the Newton table, the Fisher scoring path (1.5 → 0.912 → 0.8744 → 0.87422),
  $\hat\lambda = 0.87422$, $J = 7.345$, SE 0.369, the Wald interval (0.151, 1.597), the likelihood interval
  (0.326, 1.773) (solved with brentq at $\chi^2_{1,0.95} = 3.841$), the delta-method SE 0.154, the claim
  that observed and expected information are equal at the truncated-Poisson MLE (the score equation makes
  $\sum x_i = nE[X]$), trigamma(2) $= \pi^2/6 - 1$, the gamma $nI$, its determinant 181.17 and inverse,
  SEs 0.371/0.422 and correlation −0.880. All recomputed with scipy.
- **29h2:** the constant risk 0.01 of $(X + 2)/20$; the crossing at $p = 0.2, 0.8$; the Beta(5, 25) mean,
  median and mode (0.167, 0.159, 0.143); the Bayes risk of $(X + 1)/18$ under a uniform prior
  (0.009259) and the prior-averaged $R_1 = 1/96$ (numerical integration); the minimax risk identity
  $n/(4(n + \sqrt n)^2) = 1/(4(1 + \sqrt n)^2)$; the $n = 400$ values; the break-even condition
  $(\theta - \mu_0)^2 < \frac{1+c}{1-c}v$; Bayes risk $= cv$ (algebra); Example 3 (|θ − 100| < 6), which is
  consistent with lesson 29's sensor example (posterior variance 3.2, data weight 0.8). The proof that a
  constant-risk Bayes rule is minimax and the uniqueness ⇒ admissibility argument are correct. The
  limiting argument for $\bar X$ being minimax is labeled as a sketch.
- **29h3:** the $n = 5$ Wald table and coverage 0.80115; the $n = 20$ coverages (0.876 at $p = 0.1$,
  0.639 at $p = 0.05$); the erratic-$n$ values 0.951/0.873 ($p = 0.2$, $n = 23/24$) and 0.945/0.792
  ($p = 0.005$, $n = 591/592$); all five intervals for 2 of 20; the zero-failure bounds (0.0950, 0.0999,
  0.1157; Wilson upper 0.1135). The coverage SVG matches the curves I computed: Wald interior mostly
  0.81–0.96, Wilson minimum 0.840 near the ends, Clopper–Pearson ≥ 0.958. The SVG cuts the Wald curve at
  0.75 near $p = 0$ and $p = 1$, and both the alt text and the lesson text say so.
- **Attributions:** Wilson (1927, JASA); Clopper and Pearson (1934, Biometrika); Agresti and Coull
  (1998, The American Statistician 52); Brown, Cai and DasGupta (2001, Statistical Science 16), including
  their recommendation of Wilson or Jeffreys for $n \le 40$ and Agresti–Coull for larger $n$; Efron and
  Hinkley (1978, Biometrika 65, observed vs expected information). Wald's decision theory dates from his
  1939 paper through his 1950 book *Statistical Decision Functions*, so "largely … in the 1940s" is fair.
- **All 77 questions** worked before reading the keys. All are correct and single-answer. Order
  questions have no swappable steps. Select-all keys are right. Numeric keys were checked in scipy
  (q05 tail probabilities 0.023/0.032/0.051/0.092, q27 0.364, h18, h32, h34, h37, h38, h42 and others).
- **Drills:** all instances were recomputed independently (Python) for the other 7 drills. The
  rounding tolerances hold for correctly rounded answers, including those that use a rounded $z$
  (1.96 / 1.645 / 2.576). The `wald-coverage` drill never puts an interval endpoint within 0.0006 of
  $p$, so the ≤ test is not fragile.
- **Pictures:** all 8 SVGs were rendered. The label markers in q01, q06 and q21 sit on the right panels
  and parts. Families: the χ²₅ mode is 3, the F(5, 10) mode is 0.5 and the t₂ peak is 0.354. The resampling
  means (5.75, 9, 4.25) are right. The 6 Mermaid diagrams and all new plots were rendered and read.
- **Glossary:** no term or alias in `glossary-r2-ps-m6.yaml` duplicates any other `glossary*.yaml` in the
  course.

## Notes for others / left uncertain

- `NOTES2-ps-m6.md` is out of date on one point. It says "risk function" and "admissible" were left for
  the ps-h1 writer, but both are defined in `glossary-r2-ps-m6.yaml` (21 entries, not 19). That is fine:
  there are no duplicates, and lesson 90's bolds pick them up.
- **Overlap (reported, not changed):** 29h1's sections "The score and its two facts" and "Observed
  information" repeat material that 33h1 (`ps-m7`, Wald/score/LRT) also derives: the score's mean 0 and
  variance $nI$, and $J = -\ell''$. 29h3 and 33h1 both discuss Wald vs Wilson for a proportion and
  cite Brown, Cai and DasGupta, and 29h3 points to 33h1 for the score-test view. 29h2 and lesson 90
  (`ps-h1`) both define admissibility. 29h2 deliberately stops short of Stein. The overlaps are short and
  the two treatments are consistent.
- The lesson 27 interval chart is wide (a staircase about 880 px wide), as the writer noted. It is
  readable.

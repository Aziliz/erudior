# Round 2 review: module stat-m2 (Position and the normal model)

Reviewer for item 20. Scope: honors lessons 10h1 and 10h2, the round 2 additions to core lessons
07–10, `questions/r2-stat-m2.yaml` (48), `drills/r2-stat-m2.yaml` (5),
`glossary-r2-stat-m2.yaml` (11), `cards-r2-stat-m2.yaml` (21), `images/stat-m2-*` (13).
`content/math/check-module.sh ap-statistics stat-m2` reports zero problems after the fixes.

## Changes

| Where | Problem | Change |
|---|---|---|
| `stat-m2-r2-h12` (text) | "Right-skewed positive data can often be made close to normal by taking the ___ of each value" also has "square root" as a correct answer (the standard milder transformation for right skew), and that answer was marked wrong. | Added `square root`, `square roots`, `sqrt` to `accept`; one sentence in the explanation. |
| Drill `stat-m2-r2-out-of-spec` | `tolerance: 0.0006` on a 4-decimal answer was loose enough that a one-tail-only answer (forgetting the smaller tail) was accepted whenever that tail was under 0.0006, i.e. for \|z\| beyond about 3.24 (inputs allow up to 3.5). | Tolerance 0.0002: still accepts any correctly rounded answer and the table method (two 4-place Φ values, error ≤ 0.0001), and rejects one-tail answers for every input (smallest tail allowed is 0.00023). Regenerated 400 instances: all correct answers accepted, all answers match scipy. |
| Lesson 08, Mermaid chart | Labels had a raw `<` ("if b < 0"), which ROUND2.md says can vanish in the app. | Changed to "if b is negative" (2 labels). |
| Lesson 10h2, Common mistakes | "Reporting $C_p$ for an off-center process" reads as if $C_p$ shouldn't be reported at all; in practice both are reported. | "Reporting only $C_p$ for an off-center process." |

Counts: 1 answer-key error (h12), 0 factual errors, 0 picture fixes, 3 other fixes (drill
tolerance, Mermaid `<`, one wording fix).

## Checked and right (things a reader might doubt)

- **Every question** (q01–q21, h01–h27) worked before reading the key. Among them: q04 z-scores −2,
  −0.5, 0.5, 1.6; q11 SD of 2,3,3,4,5,7 is 1.789; q12 percentages 34/13.5/2.35/0.15; q20
  Φ(−1.2) = 0.115; q21 0.60; h03 Φ⁻¹(0.025) = −1.96, with −1.645 from i/n; h11 gaps 7,4,2,1,1,1,0,1,1
  mean left skew; h17 $C_{pk}$ = 1.33, 0.67 = 2/(6·0.5); h19 $C_{pk}$ 2, 1.33, 1, 0.5 (no ties); h22
  0.27% (A) vs 2.28% (B), $C_{pk}$ 0.33 → 1 and 0.67; h26 40,000 × 63 ppm = 2.52. q05 relies on
  Chebyshev, which lesson 07 teaches. All order questions have one order; all match/label pairings
  are unambiguous.
- **10h1 numbers** (Python/scipy): Example 1 z-scores ±0.16, ±0.49, ±0.89, ±1.53; mean 47.5, SD
  4.17, least-squares line 47.5 + 4.22z, r = 0.998. Example 2 z-scores and gaps, r = 0.902, Q1 = 13,
  Q3 = 21 (median-of-halves, the course's AP convention), fence 33. Example 3 mean 9.2, SD 5.83,
  r = 0.946, P(normal < 0) = 0.057, logs mean 0.890 SD 0.266, r = 0.9985, tails 0.062 vs 0.032.
- **Probability plot correlation cutoffs** (writer's open question): my own simulation (200,000
  samples each, (i − 0.5)/n positions) gives 0.919, 0.9515, 0.977, 0.987, matching the lesson. The
  NIST/SEMATECH e-Handbook table of Filliben's normal PPCC critical values at α = 0.05 gives 0.9173
  (n = 10), 0.9498 (20), 0.9761 (50), 0.9869 (100), so "nearly the same values" is accurate and
  the writer's remembered 0.918 is close (0.917).
- **10h2 numbers**: Example 1 tails 0.0030 + 0.0122 = 0.0152 (15,204 ppm), 98.48% within; $C_p$
  0.83, $C_{pk}$ 0.75; improvement table 15,204 / 12,419 / 165 / 63 ppm; ppm at 3σ/4σ/5σ/6σ = 2,700
  / 63 / 0.57 / 0.002; σmax 0.752, 0.677, 0.971 (Φ⁻¹(0.999) = 3.090); 1 − Φ(4.5) = 3.40 × 10⁻⁶;
  Example 4 expected 1.26 (Poisson P(≥ 9) ≈ 7 × 10⁻⁶, so "seven times the prediction" is a real
  signal).
- **History/conventions**: Shewhart control charts at Bell Telephone Laboratories in the 1920s
  (1924 memo); Six Sigma at Motorola in the 1980s; 1.5σ shift labeled a debated convention;
  $C_{pk}$ ≥ 1.33 / 1.67 labeled industry conventions; Shapiro–Wilk 1965 (Biometrika 52). All
  correct and appropriately hedged.
- **Pictures**: all 13 SVGs rendered and read; the four blanks rendered with the label markers from
  q01, q12, h01, h15. Ogive interpolations (Q1 17.7, median 25.7, Q3 35, P90 45) match the labels;
  QQ-parts data (12 values, mean 51.1) and line agree; the shapes/letters panels bend the right ways
  (skew: both ends same side; tails: opposite sides); capability figure tails 0.30% / 1.22% correct.
  No overlap or cut-off text; every marker sits on the part its label names.
- **Mermaid** (5) rendered; accTitle/accDescr describe the whole diagram. **Plots**: the N(50,5) /
  N(50,10) / N(70,5) plot labels sit above or beside the curves, not on them (peaks 0.080 and 0.040).
- **Drills**: 400 instances each generated with the app's engine and recomputed independently in
  scipy from the prompt text: 0 mismatches; displayed and correctly rounded answers accepted; no
  stray decimals, "+ -" or placeholders.
- **Glossary/cards**: definitions correct; no term or alias duplicates any other `glossary*.yaml`
  in the course.
- **Overlap**: none with other round 2 lessons in the course (stat-m1 honors are density
  histograms, robust statistics, grouped data; 32h2 mentions heavy tails of t only in passing).

## Left as is / uncertain

- The 10h2 "improving a process" flowchart sends "Cpk not well below Cp" plus "Cp at target" to
  "Capable"; a process with $C_p$ = 1.4, $C_{pk}$ = 1.25 would land there while missing a 1.33 $C_{pk}$
  requirement. "Well below" makes it a reasonable simplification, so not changed.
- In the empirical-rule blank, the left inflection point keeps its dot while the right one is
  marker 5; harmless, but it hints the answer.

## Sources

- NIST/SEMATECH e-Handbook of Statistical Methods, 1.3.6.7.6 "Critical values of the normal PPCC
  distribution" (itl.nist.gov/div898/handbook/eda/section3/eda3676.htm).
- Filliben, J. J. (1975), Technometrics 17, 111–117; Shapiro & Wilk (1965), Biometrika 52.
- All numerical checks recomputed with scipy/numpy.

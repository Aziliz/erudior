# Round 2 review: ps-m3 (Continuous random variables)

Reviewed independently: honors lessons 14h1 (hazard, Weibull) and 14h2 (mixed distributions,
censoring, generalized inverse), the figure/diagram additions to core lessons 10–14,
`questions/r2-ps-m3.yaml` (53), `drills/r2-ps-m3.yaml` (6), `glossary-r2-ps-m3.yaml` (14),
`cards-r2-ps-m3.yaml` (18) and the 8 `images/ps-m3-*` SVGs.
`content/math/check-module.sh probstats ps-m3`: zero problems after the fixes.

## Changes

| Where | Problem | Fix |
|---|---|---|
| `images/ps-m3-density-parts.svg` | The label "area = P(a ≤ X ≤ b)" sat on top of the density curve (the word "area" crossed the line near x = a). | Moved the label to the right, below-right of the curve, with a diagonal arrow into the shaded region. Re-rendered; no overlaps. (Blank copy and q01 markers unchanged; they were right.) |
| Lesson 14, inverse-transform `plot` | Point label "X ≈ 2.408" sat on the x-axis. | Dropped the point label and added a free `labels` entry at (3.5, 0.12), clear of the axis and the dashed drop line. |
| Lesson 14h2, mixed-cdf `plot` | Point label "jump of 5/9" sat on the orange cdf line starting at (0, 5/9). | Dropped the point label and added a `labels` entry "jump of 5/9 at w = 0" at (14, 0.33), below the line. |
| Lesson 14h1, Weibull-hazard `plot` | The x-axis title "x (in units of s)" was drawn across the k = 0.5 hazard curve near the right edge. | xLabel shortened to "x"; the caption already states scale s = 1, so nothing is lost. |
| Lesson 14, "which method" Mermaid chart | The LOTUS box said "integrate g(x) f(x)", but the chart reaches LOTUS before asking whether X is discrete, so a discrete learner was told to integrate. | Box now reads "LOTUS: sum g(x) p(x) or integrate g(x) f(x)"; accDescr updated to match. |
| Drill `ps-m3-r2-deductible` solution | `{elim:num2}` (up to about 3,160.60) was printed inside math, so the thousands comma rendered as math punctuation. | Moved the value out of math: "… $\approx$ {elim:num2} dollars". |

No answer-key errors were found; no question ids changed.

## Checked and found right

- **All 53 questions worked independently** before reading keys. Spot values: q03 order (1.890 < 2.25 < 2.381 < 3); q10 (1.44, 3.47, 5, 11.51, 23.03); q13 (75.3, 89.9, 100, 115, 134.9); q20 Γ(5)·2⁵ = 768; h02 0.075; h06 1/0.06 ≈ 16.7 h (33.3 is the weakest part, 61.1 the average of the means); h07 B10 = 1000√0.10536 ≈ 325 (105, 1517 are the named slips); h08 m(8) = 6; h18 E = 0.45 (split and tail formula agree); h20 1000e^−0.2 = 818.73 → 818.70 to the nearest 10 cents as the stem asks; h21 500(1 − e^−0.6) = 225.6; h27 SD = √(237.04 − 79.01) = 12.57, 90th percentile 31 s. Select-all sets (q04, q08, q14, q18, q23, h15, h28) each have every listed answer right and every other one clearly wrong; order questions have no swappable steps; match/label pairings are unambiguous; text accept lists cover the equivalent forms.
- **Lesson numbers recomputed in Python**: 14h1 Examples 1–4 (0.779, 0.368, 8.33, 8.86; 0.702, 0.524, 0.00053, 0.00075, 446, 1805; 0.698, 0.914, 443 vs 886; m(10) = 3.789 by numerical integration) and the 0.002/h = 0.048/day conversion; 14h2 Examples 1–4 (1/9, 80/9 ≈ 8.89 both ways, median 0; 0.221, 1557.60, 1346.80; 0.607, 393.5; W = 22 at U = 0.8, ⌈3.12⌉ = 4). Lesson 14 plot: −ln(0.3)/0.5 = 2.408.
- **Theory statements**: h = −(ln S)′, S = e^−H, need ∫h = ∞ (1/(1+x)² leaves e^−1 alive; defective/cure models are real); Weibull hazard/mean/variance/percentiles; F(s) = 1 − e^−1 for every k; series hazards add and iid Weibulls stay Weibull with scale s·n^(−1/k); IFR ⇒ falling MRL and DFR ⇒ rising MRL; right-continuity of every cdf; F⁻¹(u) ≤ x ⇔ u ≤ F(x); F(X) uniform only for continuous F; Lebesgue decomposition caveat (singular part) labeled. Standard references: Casella & Berger, *Statistical Inference* §1.5, 2.1; NIST/SEMATECH e-Handbook §8.1.2, 8.1.6.2 (hazard, Weibull, bathtub, burn-in).
- **History**: Weibull's strength-of-materials work dates from 1939, with the widely cited paper "A statistical distribution function of wide applicability", J. Appl. Mech. 18 (1951) 293–297; the lesson does not claim he invented the family. Gompertz 1825 (Phil. Trans. R. Soc. 115). Adult mortality doubling about every 8 years is the usual figure and the lesson labels it rough ([Wikipedia: Gompertz–Makeham law](https://en.wikipedia.org/wiki/Gompertz%E2%80%93Makeham_law_of_mortality)).
- **Cross-references**: lesson 4 series systems, lesson 10 quantile and tail formula, lesson 13 Γ recursion, lesson 14 Z² ~ χ²(1) all exist as cited.
- **Pictures**: all 8 SVGs rendered and read. Density-parts median line verified numerically (50.1% of the drawn area to its left); normal-curve inflection dots sit at e^−½ ≈ 0.608 of the peak height; Poisson time line has six events, the gamma bracket ends at the 3rd, the window holds 2. All label-question markers (q01, q06, q11, h14) sit on the parts they name.
- **Mermaid** (6) all rendered and correct, accTitle/accDescr describe the whole diagram. **Plots** in lessons 14, 14h1, 14h2 rendered with the app's code after the fixes; no label on a curve, line or axis, nothing cut off.
- **Drills**: each of the 6 generated 400 times with the app's `generate`; answers recomputed independently from the numbers parsed out of the prompt text (own Lanczos Γ), typed back correctly rounded to the stated places/significant figures (all accepted) and 3% off (all rejected). No unfilled placeholders, "+ -" or "1x".
- **Glossary**: no term or alias duplicates any other glossary file in the course; hazard rate, Weibull distribution, shape/scale parameter and series system link to existing entries in `glossary-a.yaml`. Definitions and cards correct.

## Overlap and left as is

- ps-m2's `ps-m2-poisson-process.svg` (lesson 08) and this module's Poisson time line (lesson 11) overlap a little; lesson 11's version adds the gamma arrival time and is appropriate there.
- 14h2's right-continuity and cdf-jump material builds on lesson 05's step-cdf picture (`ps-m2-cdf-anatomy.svg`) rather than repeating it; acceptable.
- Lesson 20 (core, ps-m4) uses min of exponentials for series systems; 14h1 generalizes to arbitrary hazards. Not round 2 material; no conflict.
- Bathtub SVG: the "roughly constant" middle phase rises gently toward the wear-out phase; fine for an idealization the lesson labels as such.
- Poisson time-line label "count in this window of length 3:" has its continuation ("Poisson(3λ); here 2 events") below the window; readable, left unchanged.

## Uncertain

Nothing material.

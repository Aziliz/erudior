# Round 2 notes: stat-m3 (Two-variable data)

Writer for item 21. `content/math/check-module.sh ap-statistics stat-m3` reports OK (8 lessons,
122 questions, 16 drills, zero problems).

## Honors lessons (3; the module has five core lessons with more worth teaching)

| File | Id | Title | Words* |
|---|---|---|---|
| 15h1-least-squares-algebra.md | stat-m3-h-least-squares | The mathematics of least squares | ~1,850 |
| 15h2-regression-to-the-mean.md | stat-m3-h-regression-mean | Regression to the mean: Galton, fallacies and two regression lines | ~1,700 |
| 15h3-risk-odds-ratios.md | stat-m3-h-risk-odds | Relative risk, odds ratios and adjusting for a lurking variable | ~1,600 |

*Excluding figure and diagram code. All are `minutes: 45`, with 3 worked examples, Common mistakes and Key points.

- 15h1: calculus-free proof of the LSRL formulas (the mean minimizes squared deviations, then the best intercept, then completing the square for the slope); the identity SSE(a, b) = SSE_min + S_xx(b − b̂)² + n(ȳ − a − b x̄)²; proof that SSE_min = SST(1 − r²), so r² really is the square of r; SST = SSR + SSE; the residuals add to 0 and are uncorrelated with x; why n − 2; least absolute deviations; Legendre (1805) and Gauss (1809/1795).
- 15h2: Galton 1886 (205 parent pairs, 930 children, ×1.08, mid-parent, about 2/3); the z-score form; the ability-plus-luck model and reliability; the regression fallacy (Kahneman's flight instructors, sophomore slump, patients, speed cameras) with a Mermaid diagram; control groups; the two regression lines (their slopes multiply to r²) and the SD line.
- 15h3: risk, risk difference, relative risk, odds, odds ratio; absolute vs relative risk; why case-control studies need the OR (invariant to how many controls are sampled; OR ≈ RR for rare outcomes, Cornfield 1951); Simpson's paradox as a weighted average (plot); direct standardization of the lesson-15 hospitals (A 86.9%, B 80.0%); the kidney stone data (Charig et al. 1986); limits of adjustment.

## Core lessons (additions only)

- 11: quadrant SVG (signs of z_x z_y) and a Mermaid diagram "when to summarize with r".
- 12: labeled LSRL-parts SVG (observed, predicted, residual, point of means, intercept, slope) and a Mermaid diagram "from summary statistics to a prediction".
- 13: fan-shaped residual plot; three-panel SVG of an outlier, a high-leverage point and an influential point, with a paragraph of the fitted numbers; a Mermaid diagram "is a line a good model?".
- 14: Mermaid diagram "choosing a transformation"; plot of the raw bacteria counts with the back-transformed exponential model and the raw straight line (ŷ ≈ 3.95 + 27.09x).
- 15: labeled two-way-table-parts SVG and a Mermaid diagram "choosing the denominator".

## Questions (questions/r2-stat-m3.yaml, 65)

- Core: 25 (stat-m3-r2-q01–q25), 5 per lesson: 4 label, 5 text, 5 order, 5 match, 5 select-all, 1 multiple choice (lesson 14 has no label question because its pictures aren't worth labeling). module_quiz: q01, q05, q06, q11, q17, q22.
- Honors: 40 (h01–h14 least squares, h15–h27 regression to the mean, h28–h40 risk and odds): 24 multiple choice, 6 text, 3 order, 3 match, 3 select-all, 1 label. Single-answer key positions over all 25 multiple-choice questions: 6/6/8/5.

## Drills (drills/r2-stat-m3.yaml, 6)

stat-m3-r2-ss-decomp, stat-m3-r2-sse-summary (15h1); stat-m3-r2-retest, stat-m3-r2-two-lines (15h2); stat-m3-r2-rr-or, stat-m3-r2-standardize (15h3). Tolerances accept a correctly rounded answer: SSR/SSE 0.02 at 2 dp (this allows for rounding b along the way), r² 0.001 at 3 dp; s 0.006 at 2 dp; retest 0.06 at 1 dp; slopes 0.0006 at 3 dp; RR/OR 0.01 at 2 dp (this allows for rounding the risks first); rates 0.06 at 1 dp. The core lessons already had their drills, so no new core drills.

## Pictures (images/, all original, 5–10 KB)

stat-m3-quadrants(-blank), stat-m3-lsrl-parts(-blank), stat-m3-unusual-points(-blank), stat-m3-two-way-parts(-blank), stat-m3-ss-decomp(-blank). I previewed each one, and each blank copy with its markers. The SVGs come from /tmp/r2-stat-m3/gen_svgs.py, a scratch file that I didn't keep in the repo.

## Glossary and cards

- glossary-r2-stat-m3.yaml (12): fitted value, regression sum of squares (SSR), sum-of-squares decomposition, least absolute deviations, mid-parent height, regression fallacy, reliability, SD line, risk, risk difference, relative risk (RR), odds ratio (OR). The lessons also bold **odds** (defined in glossary-r2-stat-m5), **standardization** (glossary-r2-stat-m4), **control group** and **case-control** (glossary.yaml). I didn't define them again.
- cards-r2-stat-m3.yaml (29): 10 + 9 + 10, with topics Least-squares theory, Regression to the mean, and Relative risk and odds ratios.

## For the reviewer to double-check

- Galton figures are from his 1886 paper: "930 adult children" (the text says 928 elsewhere), 205 parentages, factor 1.08, offspring deviate about two-thirds of mid-parent. I attribute the flight-instructor story to Kahneman without giving a date or page. The magazine-cover jinx is called a popular story.
- The kidney stone counts are the widely reproduced table from Charig et al. (BMJ 1986): open surgery 81/87 and 192/263; percutaneous (keyhole) 234/270 and 55/80. My mapping of treatment A to open surgery comes from secondary sources.
- Cornfield 1951 is credited with the rare-disease OR ≈ RR point "in his work on smoking and lung cancer." Please confirm the wording is acceptable.
- 15h3's standardization section overlaps a little with 18h3 (causal inference, stat-m4 writer), which also teaches direct standardization. I added a cross-reference. Mine frames it as fixing Simpson's paradox (the weighted-average view); theirs frames it as adjusting for a confounder.
- 15h2 says that in the ability-plus-luck model with equal SDs, the test–retest correlation equals the share of variance from ability. It is labeled a simplified model.
- Label questions use Unicode ŷ, ȳ and x̄ in drop-down text.

## Errors found in existing content

None. All existing m3 questions, drills, cards and glossary entries are unchanged.

## Sources

- Galton, F. (1886). Regression towards mediocrity in hereditary stature. *J. Anthropological Institute* 15, 246–263 (text at york.ac.uk/depts/maths/histstat/galton_reg.htm).
- Charig, C. R. et al. (1986). Comparison of treatment of renal calculi by open surgery, PCNL and ESWL. *BMJ* 292, 879–882. Table as reproduced in Dunn, *Scientific Research Methods* (bookdown.org/pkaldunn), and generalist.academy (2019).
- Kahneman, D. (2011). *Thinking, Fast and Slow* (flight instructors). Legendre (1805) and Gauss (1809) priority history, and Cornfield (1951), are from general knowledge; I didn't re-fetch them.

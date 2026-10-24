# Round 2 review: module stat-m3 (Two-variable data)

Reviewer for assignment 21. Scope: honors lessons 15h1 (least-squares algebra), 15h2 (regression
to the mean), 15h3 (risk and odds ratios); round 2 additions to core lessons 11–15 (found by
diffing against the pre-round-2 build in `samples/math/math-ap-statistics.json`);
`questions/r2-stat-m3.yaml` (65), `drills/r2-stat-m3.yaml` (6), `glossary-r2-stat-m3.yaml` (12),
`cards-r2-stat-m3.yaml` (29), `images/stat-m3-*` (10 SVGs), 7 Mermaid diagrams, 6 new plots.

`content/math/check-module.sh ap-statistics stat-m3` after fixes: OK, zero problems.

## Changes

| Where | What was wrong | Change |
|---|---|---|
| h05 (label, `stat-m3-ss-decomp-blank.svg`) | Marker 4 ("horizontal line at the mean of y") sat 22 px below the dashed line, in empty space; marker 5 ("least-squares line") sat 26 px above the line. Neither was on its part. | Marker 4 y 51.5 → 46.8 (on the dashed line, y = 220 of 470); marker 5 y 14.7 → 20.2 (on the line at x ≈ 5.6). Re-rendered and checked. |
| 15h1 plot (SSE against slope) | The two point labels overlapped each other and sat on the parabola. | Moved them to `labels` below the curve (b = 0.6 label at left, b = 0.8 label at right). Re-rendered. |
| 15h3 plot (Simpson's paradox lines) | "Hospital A" / "Hospital B" labels were struck through by their own lines; "B's actual mix: 90%" was crossed by the dashed 25% line. | Line names moved to free space beside the lines; the two "actual mix" point labels moved into the caption ("Filled dots: … A: 40% severe, 80% survive; B: 10% severe, 90% survive"). Re-rendered. |
| Lesson 14, new bacteria plot | The "straight line" label sat on the exponential curve. | Label moved to `labels` at (5.3, 112), just under the dashed line. Re-rendered. |
| 15h2 intro | "a prediction is always closer to the mean … than the value it was predicted from": false when $|r| = 1$ (or $x = \bar x$). | "never farther from the mean … (and is closer whenever $|r| < 1$)". |
| 15h2 "Two regression lines", glossary `SD line`, h27 explanation | Said the SD line runs "along the long axis of the cloud." In raw units the cloud's principal axis depends on the scales and is not the SD line in general; it is exactly the SD line only in standard units (covariance matrix [[1, r], [r, 1]] has major axis slope ±1). | Lesson: "along the long direction of the cloud (exactly along its long axis when both variables are in standard units)"; glossary: "roughly along the long direction of the cloud"; h27: "along the long direction of the cloud". |
| 15h3 "Odds" | "the odds ratio is always farther from 1 than the relative risk": not when both are 1. | Added "(unless both equal 1)". (OR = RR·(1 − p₂)/(1 − p₁) shows the rest is right.) |
| 15h1 "Why n − 2", h10 explanation | "given any n − 2 residuals, the last two are forced" needs the last two points to have different x values. | Added that condition. |
| drill `stat-m3-r2-sse-summary` | Solution printed thousands commas inside math (`= 3,456`, `\sqrt{14,976/38}`). | `{sst:dp0}` and `{sse:sig8}`; 400 instances regenerated, no commas. |
| drill `stat-m3-r2-rr-or` | Thousands commas inside math (`\dfrac{11,521}{3,318}`). | `{adp:dp0}`, `{bcp:dp0}`. |
| drill `stat-m3-r2-standardize` | Comma inside math (`\dfrac{936}{1,000}`). | `{st:dp0}`, `{nt:dp0}`. |
| drill `stat-m3-r2-retest` | Solution: "the prediction is $0.85 \times 16$ points from it, which is **2.4** points closer" skipped the step that gives 2.4. | New calc `pd = rr*abs(dev)`; now "$0.85 \times 16 = 13.6$ points from it, which is $16 - 13.6 =$ **2.4** points closer". |
| h01, h14, h26, h40 explanations | Distractors with no explanation (h01 "0.2", h14 "0.5", h26 "72.0"/"100.0", h40 "1.75"/"7"). | Added the mistake behind each (unsquared slope difference; no regression r = 1 / full regression r = 0; dividing or multiplying by the factor 2 instead of cancelling). |

Counts: answer-key errors 0; factual fixes 3 (prediction "always closer", SD line "long axis" in
3 places, OR "always farther"); picture fixes 4 (h05 markers, three plots with labels on curves);
other fixes 9 (n − 2 condition, 3 drill comma fixes, retest solution, 4 explanations).

## Checked and found right (things a reader might doubt)

- **Every core and honors question worked before reading the key** (q01–q25, h01–h40): all keys
  right; select-all sets complete (q04, q09, q14, q19, q24, h04, h17, h31); order questions have one
  order; match pairings unambiguous; text `accept` lists complete (numbers compare by value).
  q20 residuals recomputed: raw-count line ŷ = 3.952 + 27.086x, residuals +16.0, −0.04, −14.1,
  −15.2, −7.3, +20.6. q09 "passes through none of the training points" true (3.4, 4.2, 5.0, 5.8, 6.6
  vs 3, 5, 4, 7, 6).
- **Numbers recomputed in Python:** training data S_xx = 10, S_xy = 8, S_yy = 10, b = 0.8, a = 2.6,
  SSE 3.6, SSR 6.4; line y = 3 + 0.6x SSE 4.2 = 3.6 + 0.4 + 0.2, residual sum 1.0; Example 3
  s = √(304/18) = 4.11 (17.8% below 5); h08 2.4475 (2.40, 2.36, 5.99 distractors as described);
  retest 124 and 85.6, tutoring 82.5; two slopes 1.5 × 0.24 = 0.36; exercise OR 0.4737; case-control
  OR 3.5 both ways; hospitals A 0.86875, B 0.800 (plot points match); kidney stones 273/350 = 78%,
  289/350 = 83%, 81/87 = 93%, 234/270 = 87%, 192/263 = 73%, 55/80 = 69%, large-stone shares 75% and
  23%; h28 OR 3.353; h36 78% / 62%. Bacteria log fit 1.30057 + 0.18019x matches the lesson.
- **Unusual-points SVG numbers** (lesson 13 paragraph and q11) from the circle coordinates: base
  line 2.125 + 0.475x, r = 0.974; with A (4.5, 7.5): intercept 2.485, slope 0.475, r = 0.701,
  residual 2.88; with B (16, 9.725): r = 0.993, residual 0; with C (16, 2.5): slope 0.012, r = 0.043,
  residual −1.69. All as stated.
- **Galton (1886)**: "930 adult children … parentages, 205 in number", factor 1.08, offspring
  deviate "on the average, two-thirds" of the mid-parent deviation, and mid-parentage of a man
  deviates "one-third as much" (the reverse regression the lesson mentions). Source: Galton,
  *J. Anthropological Institute* 15 (1886), text at york.ac.uk/depts/maths/histstat/galton_reg.htm
  (the memoir also says 928 in one place; the writer's 930 is the figure in the data description).
  Correlation 1888 ("Co-relations and their measurement", *Proc. R. Soc.*) is right.
- **Charig et al. (1986)**, *BMJ* 292:879–882; treatment A = open surgery, B = PCNL, as in Julious &
  Mullee, *BMJ* 309:1480 (1994), which popularized the table as a Simpson's paradox example.
- **Cornfield (1951)**, *J. Natl. Cancer Inst.* 11:1269–1275, "A method of estimating comparative
  rates from clinical data. Applications to cancer of the lung, breast, and cervix": the
  rare-disease OR ≈ RR argument with lung cancer/smoking data. The lesson's wording is fine.
- **Legendre 1805** (appendix to *Nouvelles méthodes pour la détermination des orbites des
  comètes*), **Gauss 1809** (*Theoria motus*, claiming use since 1795): standard history. Kahneman's
  flight instructors were Israeli Air Force (*Thinking, Fast and Slow*, ch. 17).
- **Reliability claim** (15h2): with X = T + E, independent errors of equal variance,
  corr(X₁, X₂) = σ²_T/(σ²_T + σ²_E); labeled as a simplified model.
- **Pictures:** all 10 SVGs rendered; quadrant, LSRL-parts, unusual-points, two-way and
  ss-decomp content matches the data; markers for q01, q06, q11, q21 (and h05 after the fix)
  checked against element coordinates. Text readable, nothing cut off.
- **Mermaid:** all 7 diagrams rendered; accTitle/accDescr describe each whole diagram; readable.
- **Plots:** the lesson 13 fan plot, lesson 14 plot, 15h1, 15h2 (three lines in z-units) and 15h3
  rendered with the app's own `renderFigure`; after the fixes no label sits on a curve.
- **Drills:** 400 instances each, answers recomputed independently from the prompt text
  (numpy fit for ss-decomp). Every correctly rounded answer is within tolerance; no unfilled
  placeholders, "+ -" or "1x"; no thousands commas inside math after the fixes.
- **Glossary:** no term or alias duplicates any other `glossary*.yaml` in the course.

## Overlap

- 15h3 "Standardization" and 18h3 (stat-m4, causal inference) both teach direct standardization,
  and both modules have a standardized-rate drill (`stat-m3-r2-standardize`,
  `stat-m4-r2-standardize`). 15h3 frames it as the fix for Simpson's paradox (weighted averages)
  and cross-references 18h3; 18h3 frames it as confounder adjustment. Acceptable but repetitive;
  not changed.
- 93-meta-analysis (stat-h1) refers back to 15h3 for RD/RR/OR; no duplication.

## Left uncertain / outside scope

- `stat-m3-r2-ss-decomp`: the writer's note says the 0.02 tolerance "allows for rounding b along
  the way". That holds for b rounded to 4 places (0 failures in 400) but not 2 places (about 85%
  of instances fail). The prompt doesn't ask for b and the solution uses $S_{xy}^2/S_{xx}$, so
  left as is.
- `stat-m3-r2-rr-or`: a student who rounds the two risks to 3 places first is rejected in about
  13% of instances (4 places: 0.5%). The prompt doesn't ask for rounded risks; left as is.
- Label questions q06 and h05 put markers directly on small parts (points, the diamond), which
  hides their shape; the alt text names each one and the positions are unambiguous, so left.

# Round 2 review: module ps-m2 (Discrete random variables)

Reviewer for item 116. Scope: honors lessons 09h1 and 09h2, the round 2 additions to core
lessons 05-09, `questions/r2-ps-m2.yaml` (54), `drills/r2-ps-m2.yaml` (5),
`glossary-r2-ps-m2.yaml` (13), `cards-r2-ps-m2.yaml` (20), `images/ps-m2-*` (11 SVGs).
`content/math/check-module.sh probstats ps-m2` after the fixes: build and checker OK, zero problems.

## Changes

| Where | Problem | Fix |
|---|---|---|
| `ps-m2-r2-h14` (label, PGF fixed-point picture) | Marker 5 ("The line y = s") sat at s = 0.85, where the curve (0.824) and the line (0.85) are about 9 px apart, so the marker covered both and could equally be read as "Graph of the offspring PGF" (marker 4). | Moved marker 5 to (0.12, 0.12) on the line, where the curve is 0.17 higher, and marker 4 to (0.2, 0.32) on the curve. Re-rendered: each marker is now clearly on one feature. |
| `images/ps-m2-cdf-anatomy.svg` | The "flat between values" label was centered under the flat piece and the dashed jump line at x = 0 ran through the word "flat". | Left-aligned the label just right of the dashed line (text-anchor start, x = 171). |
| 09h1, cobweb plot | The curve labels "f(s)" and "y = s" were drawn on top of each other at (1, 1), and "q = 0.5" sat on the curve/line. | Removed the curve labels and point label; placed "f(s)", "y = s" and "q = 0.5" as free labels in clear space. Re-rendered. |
| 09h2, horse-kick bar chart | The y-axis was drawn at x = 0, through the middle of the first pair of bars; the 100/120 tick labels sat on the blue bar; ticks fell at half-integers with no "0"; the x-axis title overlapped the bars at 3. | Turned off the automatic grid and drew the axes with segments: y-axis left of the bars, ticks 0-100, category labels 0-4 under each pair, axis titles clear of the bars. Data and caption unchanged. |
| 09 (core), intro to the MGF-method Mermaid chart | "The method of Example 4" referred to an example that comes after the chart. | "The method of Example 4 below". |
| 08 (core), "Which discrete model?" Mermaid `accDescr` | Said hypergeometric is for sampling without replacement "from a small population"; it is the exact model for any finite population. | "from a finite population". |

## Checked and found right (things a reader might doubt)

- Every question worked before reading the key; numbers recomputed in Python (scipy): q09 hypergeometric
  variance 0.485 vs 0.528; q10 Bin(9, 0.4) has P(3) = P(4) = 0.25082 exactly (tied mode); q20 Poisson(2.5)
  order 0.0668 < 0.0821 < 0.1336 < 0.2052 < 0.2138 < 0.2565; q25 0.0842; h05 2e^-2 = 0.2707; h23 1 - e^(-435/365)
  = 0.696 (exact 0.706); h27 actual TV distances 0.0522, 0.0242, 0.0046, 0.00045 (order correct); h28 108.7.
  All select-all, order, match and label keys are unambiguous; text answers compare by value.
- 09h1: three dice total 10 = 27/216; thinning e^-4.2 = 0.0150; Example 3 iterates 0.25, 0.34375, 0.3950,
  0.4268 and q = 1/2; Poisson(1.5) outbreak q = 0.4172 and iterates 0.2231, 0.3118, 0.3562, 0.3807, 0.3950;
  negative binomial offspring (mean 1.5, k = 0.5) q = 0.7676 ("about 0.77"). The extinction-theorem proof
  (convexity, tangent at 1, the p_k = 0 for k >= 2 sub-case giving f(s) - s = p0(1 - s)) is correct.
- 09h2: welds TV distance 0.00090, Barbour-Hall bound 0.00346; Bin(12, 0.25) vs Poisson(3) 0.0703; Example 2
  P(S = 0) 0.8583 vs 0.8607, P(S >= 2) 0.00806 vs 0.01019 (26% relative); matches table for n = 10 agrees with
  Poisson(1) to four decimals; birthday 253/365 = 0.693151 > ln 2 = 0.693147, exact 0.4927; coupling
  disagreement probability p(1 - e^-p) checked algebraically. Pairwise independence of birthday pairs that
  share a person is correct.
- Bortkiewicz: the 10-corps subset (200 corps-years, 122 deaths, 109/65/22/3/1) is the standard one (Fisher's
  subset of the 14-corps table); mean 0.61, sample variance 0.611, expected 108.67/66.29/20.22/4.11/0.63.
- History and attributions: Galton's question in *The Educational Times* (1873), Watson's answer and the joint
  paper (J. Anthropological Institute 4, 1875), Watson's wrong conclusion that extinction is certain,
  Bienaymé 1845, Steffensen 1930 (Kendall, "Branching processes since 1873", J. London Math. Soc. 1966;
  Wikipedia "Galton-Watson process"). Le Cam, Pacific J. Math. 10 (1960) 1181-1197 (his bound on the L1
  distance is 2 sum p_i^2, so d_TV <= sum p_i^2 as stated). Barbour and Hall, Math. Proc. Cambridge Phil.
  Soc. 95 (1984) 473-480, factor (1 - e^-lambda)/lambda. Chen, Ann. Probab. 3 (1975) 534-545.
  Lloyd-Smith et al., Nature 438 (2005) 355-359.
- Cross-references exist and say what is claimed: lesson 2 (birthday 0.4927, matching -> 1 - 1/e), lessons 6-8
  (factorial moments E[X(X-1)]), lesson 8 (welds Bin(500, 0.004) table, overdispersion), lesson 9 (sums of
  Poissons), lesson 19 (random sums), lesson 33 (chi-square goodness of fit).
- Drills: each generated 400 times with the app's own generator; every target matched an independent Python
  recomputation from the displayed values (extinction by fixed-point iteration, not the p0/p2 shortcut); the
  displayed answer and the answer rounded to 4 decimals were accepted and a wrong answer rejected for every
  instance; no unfilled placeholders, "+ -" or thousands separators.
- Pictures: all 11 SVGs rendered; content correct (tree paths, negative binomial waits 3 + 2 + 4, Poisson
  process interval counts 2 and 3 and the gap between consecutive events, family tree sizes 1, 2, 3, 3), all
  other markers on their parts. Marker 1 in the Poisson-process blank hides the event dot it marks; the label
  is still unambiguous (no other label fits a point on the time line).
- Mermaid: all 7 rendered, readable, content correct, accTitle/accDescr describe the whole chart.
- Glossary and cards: definitions correct; no term or alias duplicates any glossary file in the course.

## Overlap

None found. No other round 2 lesson in the course covers PGFs, branching processes, total variation, Le Cam's
inequality or the Poisson paradigm; lesson 19's random sums (by total expectation) is only pointed to.

## Left uncertain

Nothing substantive. 09h1 notes the independence of kept and discarded counts under thinning without proof;
it is stated as a fact, which it is.

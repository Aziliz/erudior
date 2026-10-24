# Round 2 review: stat-m9 (Chi-square and regression inference)

Reviewed independently: the three honors lessons (39h1, 39h2, 39h3), the additions to lessons
37–39 (3 Mermaid diagrams, 6 SVG figures and their introductions), `questions/r2-stat-m9.yaml`
(54 questions), `drills/r2-stat-m9.yaml` (8 drills), `glossary-r2-stat-m9.yaml` (8 terms),
`cards-r2-stat-m9.yaml` (30 cards) and the 10 `images/stat-m9-*` SVGs.
`content/math/check-module.sh ap-statistics stat-m9`: zero problems after the fixes.

## Changes

| Where | What was wrong | Change |
|---|---|---|
| `drills/r2-stat-m9.yaml`, stat-m9-r2-mean-ci and stat-m9-r2-pred-int | `bb` (slope, step 0.05 from 0.2 to 3) can be 1, so the prompt printed "$\hat{y} = 9.5 + 1x$" (found in 10 of 600 generated instances). | Added `'abs(bb - 1) > 0.01'` to `where` in both drills. |
| stat-m9-r2-h25 (order, Fisher's exact test) | Not a unique order: "write the hypergeometric probability of each possible top-left count" and "identify the tables at least as extreme" could be done in either order (the extreme tables are known from $H_a$ and the margins without any probabilities). | Items now: fix margins, identify the extreme tables, compute the probability of each of *those* tables, add, conclude. Each step now depends on the one before. Explanation rewritten to match. |
| stat-m9-r2-h16 (MC) | Stem said the adjusted residual is "always larger in size" than the standardized residual, which fails when $O = E$ (both are 0). | Stem now starts "For a cell with $O \ne E$, …". |
| 39h1 Example 3, step 3 | "(even combined, 4.41)": the exact combined expected count for 3 and 4 defects is 4.404, so 4.40. The 4.41 came from adding rounded values (4.09 + 0.32). | Changed to 4.40. |
| 39h3 bands plot | The x range runs 5–40 but the data cover 9–31; only the right side (past 31) was marked as extrapolation, so the left strip 5–9 looked like it was inside the data. | Added a dashed vertical line at 9 and changed the caption to "outside the data (tonnages 9 to 31, between the vertical dashed lines) they rest on extrapolation". |

Counts: answer-key errors 1 (h25 order), factual fixes 1 (4.40), picture fixes 1 (bands plot),
other fixes 2 (drill "1x" formatting, h16 stem).

## Checked and found right

- **All 54 questions worked before reading the keys.** Numeric ones recomputed in Python:
  q02 4.05, q05 contributions, q07 18, q13 2.866, h04 χ² = 3.0 / z = 1.732, h15 adjusted residual
  1.75 (distractors 1.03 = 6/√34, 1.06 = 36/34), h18 V = 0.190 (0.268, 0.155 distractors each match
  their stated mistake), h19 φ = 0.2, h22 1/20, h27 5/210 = 0.0238, h29 SE 2.37 (2.28 = n·s_x²,
  2.00 drops 1/n, 4.65 = prediction SE), h35 t = 2.00 (1.73, 2.16, 2.31 each match their mistake),
  h36 3.75, h39 half-widths 0.58 < 1.16 < 2.09 < 2.32. MC answer positions are spread.
- q03 and q14 (orders): follow AP's State–Plan–Do–Conclude sequence; in q03 the large-counts
  check genuinely needs the expected counts, so the order is unique.
- q08: the one-sided two-group question correctly maps to the two-proportion z test.
- **39h1**: Example 1 (χ² = 5.625 = 2.372², p = 0.0177 both ways); Example 2 (p(6.5, df 5) = 0.261,
  P(χ²₅ ≥ 15) = 0.0104, 11.07 critical); Example 3 expected counts 33.80, 42.12, 19.68, 4.09, 0.32,
  χ² = 8.79, p = 0.0030 (df 1) and 0.0123 (df 2). E(χ²) = k − 1 exactly holds for any n (it uses only
  the multinomial variance). Chernoff and Lehmann (1954, *Ann. Math. Statist.* 25) is stated
  correctly: with ungrouped MLEs the limit lies between χ²_{k−1−m} and χ²_{k−1}; Example 3's p̂ from
  the 5-cell data before combining is exactly that case, and the lesson labels it. Fisher 1922
  (JRSS 85, contingency df) and 1924 (JRSS 87, estimated parameters), Pearson's rc − 1 and the
  quarrel are accurate. Cochran's rule is hedged ("often attributed", Cochran 1952/1954).
- **39h2**: all nine adjusted residuals match (2.91, 2.40, −4.84; −0.91, −1.04, 1.75; −1.94,
  −1.29, 2.97); χ² = 24.45 → 244.5 with counts ×10, V = 0.247 both times; 51% vs 49% survey
  z = 2.83, p = 0.0047, φ = 0.02; tea test 1/70 and 17/70; brake pads one-sided Fisher 0.0286
  (scipy `fisher_exact`), two-sided 0.0573, uncorrected χ² = 5.49, p = 0.019; hypergeometric bar
  heights correct. Haberman (1973, *Biometrics* 29) formula, Cramér (1946), Cohen's w conventions
  0.1/0.3/0.5 (1988, labeled as conventions), Fisher's *Design of Experiments* (1935), and the
  "conservative" statement are right.
- **39h3**: Example 1 (CI 9.34–11.66, PI 8.18–12.82; at x̄ ±0.58 and ±2.09), Example 2 (±1.56,
  ±3.82), Example 3 (t = 2.31, p = 0.104; t = 2.18, p = 0.034) all recomputed. SE formulas,
  ȳ–b uncorrelatedness (stated without proof, labeled), and the r → t derivation are correct.
  Plot labels are clear of the curves.
- **Core additions**: GOF-bars (contributions 4.05, 3.27, 0, 0.80; sum 8.12), χ²₅ curve (mean 5,
  observed 6.5, critical 11.07, p 0.26), expected-cell (60 × 70 / 200 = 21), contributions grid
  (sums to 24.45, df 4, above/below directions match O vs E), regression model, and output table
  (t = 2.87, p = 0.0103 and constant t = 1.67, p = 0.112 with df 18) all correct. All rendered and
  read; text readable and nothing cut off. Label markers on the four blank copies (q01, q06, q11,
  q12) sit on the parts their labels name (q12's markers touch the numbers slightly but don't hide
  them).
- **Mermaid**: all four rendered; accTitle/accDescr describe the whole diagram; content correct.
- **Drills**: 300 instances each generated with the app's engine; every answer recomputed
  independently from the printed prompt in Python/scipy (including `fisher_exact`); 0 mismatches.
  400 more each: the answer rounded to the requested decimals is always accepted, and a value 20
  half-places off is always rejected. No unfilled placeholders, "+ -" or thousands commas (only the
  "1x" fixed above). Tolerances wider than half a place (two-cat z ±0.01, cramers-v χ² ±0.03,
  p-values ±0.0006, endpoints ±0.015) are justified by intermediate rounding (t* from a table, t to
  3 decimals) and still reject clearly wrong answers.
- **Glossary/cards**: definitions correct; no term or alias duplicates any other glossary file.

## Overlap

- 39h3's prediction intervals extend stat-m7's 32h2 (one-sample prediction interval
  x̄ ± t*s√(1 + 1/n), same "never narrower than ±1.96σ" point). Consistent and complementary, not
  a duplicate; 32h2 does not bold or gloss "prediction interval", so no glossary clash.
- Fisher's exact test: stat-m8's 36h3 only points forward to 39h2; no duplication.
- Cohen's conventions also appear in stat-m8 36h1 and stat-h1 93; consistent.

## Uncertain / left as is

- 39h2's two-sided Fisher p doubles the one-sided one because the rows are equal (stated); this
  agrees with the usual "sum of tables no more likely than observed" definition here.
- h32 says the PI width approaches "about 2 × 1.96σ, never less"; with finite n the estimate s can
  be below σ in a given sample, but the lesson and question both say "about", which is fine for the
  limiting statement.

# Round 2 review: a1-m8 (Data and statistics)

Reviewer for item 7. Scope: honors lessons 36h1–36h3, round 2 additions to core lessons 33–36,
`questions/r2-a1-m8.yaml` (62), `drills/r2-a1-m8.yaml` (8), `glossary-r2-a1-m8.yaml` (12),
`cards-r2-a1-m8.yaml` (29), `images/a1-m8-*` (16 SVGs). After the fixes,
`content/math/check-module.sh algebra1 a1-m8` reports zero problems (7 lessons, 110 questions,
18 drills, 53 cards).

## Changes

| Where | Problem | Fix |
|---|---|---|
| a1-m8-r2-h10 (order) | The first two steps ("check the graph is bell-shaped", "compute z") are independent, so they could be swapped and the order wasn't unique. | Stem now says the data are roughly normal and asks for the percent *above* $x$. The four items are a chain where each step needs the one before: compute z → left area → subtract from 1 → percent in context. The explanation still says to check the graph first. |
| a1-m8-r2-h16 (MC) | Distractor 62% didn't come from any real mistake, and the explanation didn't cover 50%. | 62% changed to 74% (weights swapped). The explanation now covers 74% and 50%. Answer index unchanged (1). |
| Drill a1-m8-r2-expected-count | The solution printed `{prod}` with the default format, which adds a thousands comma inside math (e.g. `\dfrac{10,088}{197}`). | Changed to `{prod:dp0}`. Checked again on 2,000 instances: no commas. |
| 36h3, "Regression to the mean" | "the prediction is always fewer standard deviations from its mean" is false when $x = \bar x$ (both are 0). | Now reads "whenever $x$ is not exactly at its mean, the prediction is fewer …". The glossary entry "regression to the mean" got the same qualifier. |
| 36h3 SSE `plot` | The point label "minimum at m = 0.9, S = 1.9" sat on the parabola, and the curve label sat at the top right next to the curve's end. | Removed both curve and point labels and added two `labels` entries: the formula at (0.9, 8.5), inside the bowl, and the minimum note at (0.9, 0.7), under the vertex. I rendered the plot with `src/lib/figure.ts` and both labels are clear of the curve and the axis labels. |
| 36 car-data `plot` (round 2 addition) | The "linear" curve label landed on the x-axis label "age (years)" near x = 11, and "exponential" touched its curve. | Removed both function labels. The caption now names them: "the exponential curve (solid) … the line (dashed)". Re-rendered and clean. |

Counts: answer-key errors 0; factual fixes 1 (regression-to-the-mean wording, in the lesson and the glossary); picture/plot fixes 2; other fixes 3 (h10 order uniqueness, h16 distractor, drill comma).

## Checked and found right (a reader might doubt these)

- **Every new question** was worked before reading the key: q01–q18 and h01–h44. Keys, `accept` lists and select-all sets are correct. Distractor explanations match real mistakes (e.g. h41's $1.25x - 0.625$ really is the x-on-y line solved for y; h33's 0.95 ≈ √0.9; h15's 85.02% is the two areas added).
- **Numbers recomputed in Python (numpy/scipy):**
  - Books data (36h1 Ex 4): mean 2.556, population σ = 2.140; 14/18 within 1σ, 17/18 within 2σ, and μ − 2σ = −1.72.
  - z-table entries (all 10 match normcdf to 4 dp); exact 68.27/95.45/99.73; $z_{0.90} = 1.2816$.
  - Study-hours data (36h3 Ex 2): x̄ = 2.9, ȳ = 72.3, σx = 1.670, σy = 9.603, r = 0.9558, LSRL 5.495x + 56.37. The lesson's 56.4 is a correct rounding of 72.3 − 5.50(2.9) = 56.35.
  - 36h3 Ex 1: S(m) = 10m² − 18m + 10, SSE 1.9, residuals −0.2, −0.1, 1.0, −0.9, 0.2.
  - Hospital and kidney-stone weighted averages; expected counts 50.4/69.6/33.6/46.4; handedness expected 6.
  - The car linear model crosses zero at x = 10.86 ("after about 11 years").
- **Correlation picture:** r recomputed from the SVG circle coordinates: 0.95, 0.60, 0.00, −0.60, −0.95 and F = 0.00, exactly as labeled.
- **Sources:**
  - Kidney stones (Charig et al., BMJ 1986; Julious & Mullee, BMJ 1994): 81/87, 192/263, 234/270, 55/80, totals 273/350 and 289/350 match the published table.
  - Berkeley fall 1973 (Bickel, Hammel & O'Connell, Science 1975): 8,442 men at about 44% and 4,321 women at about 35% are the published figures. The lesson's wording "no pattern of bias against women within departments" is accurate and appropriately weak; the paper found, if anything, a small bias in favor of women in some departments.
  - Dates: Simpson 1951, with Pearson (1899) and Yule (1903) noticing it "around 1900"; de Moivre 1733 (normal approximation to the binomial); Gauss 1809 (Theoria motus, observation errors); Legendre 1805 and Gauss 1809 with his claim of earlier use, labeled as debated; Galton 1886 ("Regression towards mediocrity in hereditary stature"). All are standard.
- **Drills (all 8):** I generated 1,500 instances each with the app's own `generate()`. A separate Python solver recomputed each answer from the printed prompt, rounded as the prompt asks, and every one was accepted by `checkAll`. Answers off by 0.2 (0.05 for the 3-dp r) were all rejected. No unfilled placeholders, "+ -", "1x" or NaN appeared, and after the fix no thousands commas either.
  - The normal-table tolerance of 0.06 accepts any correctly rounded 1-dp answer.
  - The overall-rate tolerance of 0.051 accepts ties at …5.
  - The r-squared tolerance of 0.00051 accepts a correctly rounded 3-dp r.
- **Pictures:** all 10 full SVGs and all 6 blanks were rendered. Markers were placed from each label question and land on the parts they name. Box plot: whisker, the Q1 and Q3 box edges, median, outlier. Two-way table: 36, 120, 84, 200. Residual: point, predicted square, residual segment, line. Empirical: the 0–1σ, 1–2σ and 2–3σ bands. Squares: diamond, square, segment, line. Text is readable and nothing is cut off. The squares figure uses equal axis scales, so the shaded squares are true squares.
- **Mermaid diagrams (all 6):** rendered, readable, content correct, and each has an accTitle and an accDescr that describes the whole diagram.
- **Glossary:** no term or alias duplicates any glossary*.yaml in the course. "weighted average", "least-squares regression line", "lurking variable" and "confounding variable" are existing entries.

## Overlap

- 36h2's "Why it happens: overall rates are weighted averages" overlaps alg-m1's honors lesson
  `05h2-rates-and-averages.md` ("Weighted averages", with the balance form $w_1(m - x_1) = w_2(x_2 - m)$).
  36h2 applies the idea to Simpson's paradox and normalizes the weights to sum to 1, so the two
  don't conflict, but the bolded **weighted average** in 36h2 pops up alg-m1's definition (weights
  need not sum to 1). Acceptable; a cross-reference to the earlier honors lesson could be added
  later. Not changed (other writer's file / no error).
- No other round 2 lesson in Algebra 1 covers z-scores, normal distributions, Simpson's paradox,
  expected counts or least squares.

## Left as is / uncertain

- The flowchart in 36h1 branches on "Is z a whole number?" to choose the 68–95–99.7 rule. Strictly, that only covers z = −3 to 3. In practice z = ±4 doesn't come up at this level, so I left it.
- The residual-picture label question (q10): marker 3 covers most of the short dashed residual segment. It is still clearly on that segment and below the visible predicted-value square, so I left it.
- The core lesson 36 residual plot (round 1 content, out of scope) has the axis label "age (years)" close to the points at x = 7–8. Not touched.

# Algebra 2, module a2-m6 (Exponential and logarithmic functions): round 2 review

Reviewer for item 14. Scope: honors lessons 22h1 and 22h2, the round 2 additions to lessons 20–22, `questions/r2-a2-m6.yaml` (43), `drills/r2-a2-m6.yaml` (6), `glossary-r2-a2-m6.yaml` (11), `cards-r2-a2-m6.yaml` (18) and the six `images/a2-m6-*` SVGs.

Counts: answer-key errors 0, factual fixes 1, picture fixes 5, other fixes 4.

## Changes

### Factual fix

- **22h1, "One model, several descriptions"**
  - Problem: the lesson said that for growth the continuous rate is "always a little smaller than $r$". It is not always a little: for $b = 2$, $k = 0.693$ against $r = 1$, and that pair appears in the lesson's own table.
  - Change: now "always smaller than $r$". The next sentence already explains that the two are close for small rates.

### Picture fixes

Each plot was rendered with `src/lib/figure.ts`, and its label positions were checked in a PNG.

- **Lesson 20, plot of $y = 2x$ vs $y = 2^x$**
  - Problem: the curve label "y = 2x (adds 2)" overlapped the point label "(5, 10)". The labels "(1, 2)", "(2, 4)", "(5, 32)" and "(5, 10)" each sat on a curve.
  - Change: the labels are now free `labels` placed clear of both curves.
- **Lesson 22, plot of $3^x = 10$**
  - Problem: the "y = 10" curve label overlapped "x ≈ 2.096", and that label started on the curve $3^x$.
  - Change: both labels moved: "y = 10" to the left end of the line, and "x ≈ 2.096" below-right of the intersection.
- **22h1, plot of $(1 + 1/n)^n$**
  - Problem: the labels "y = e ≈ 2.718" and "y = (1 + 1/n)^n" printed on top of each other at the right edge, and "n = 10: 2.594" sat on the curve.
  - Change: the three labels were moved apart, clear of the curve and the line.
- **22h2, log-log planets plot**
  - Problem: the line of slope 1.5 ran through the first letters of all six planet names.
  - Change: the names are now free labels beside the line (below-right, or above-left where the space ran out).
- **`a2-m6-exp-graph.svg`**
  - Problem: the curve $y = 2^x$ ran through the label "y = 2ˣ (growth)".
  - Change: the label moved left of the curve, to (500, 70). The italic axis letter $x$ was raised 10 px off the dashed decay curve, in both the labeled and the `-blank` copy. Marker positions are unchanged.

### Other fixes

- **Drill `a2-m6-r2-continuous-rate`, solution text**
  - Problem: `{bf}` used the default 2-decimal format. For half-percent rates the solution printed a wrongly rounded factor and a mismatched log, e.g. "growth factor is 1.11, so $k = \ln 1.11 \approx 9.98\%$" for 10.5% (actually $\ln 1.11 = 10.44\%$).
  - Change: now `{bf:num4}`, which prints 1.105.
- **Question h06, explanation**
  - Problem: it said the distractors 3,440 and 2,290 come from decay treated "as if decay were linear". Linear decay doesn't give those numbers.
  - Change: now it says they come from simply multiplying 5,730 by 0.6 or 0.4.
- **Question h14, stem**
  - Problem: it called "divide 69.3 by the percent rate" the "exact rule". It is exact only up to rounding $100\ln 2 = 69.31$.
  - Change: the stem now gives $\ln 2/k$ and says "exact apart from rounding".
- **Card "Rule of 72"**
  - Problem: it said "$69.3 \div R$ is exact".
  - Change: now "essentially exact".

## Checked and found right

- **Every question, worked before reading the key.** All keys are correct, with exactly one defensible answer each.
  - Values recomputed in Python:
    - q05: 1600, 1790.85, 1819.40, 1822.12.
    - q10: −1, 0.5, 1.609, 2.096, 3.170.
    - q11: $\ln 12/\ln 5 = 1.544$.
    - h01–h13: e.g. $\ln 1.04 = 3.92\%$, $e^{0.09} - 1 = 9.42\%$, $1.005^{12} - 1 = 6.17\%$, 7,575 years for 40% carbon-14, $\ln 1.75/6 = 9.33\%$, $\ln 2/0.0866 = 8.00$.
    - h12 effective rates: 5.000, 5.022, 5.064, 5.127%.
    - h20 and h22: $10^{0.3} = 1.995$.
  - h06 key "About 7,570" (exact 7,574.6) is the closest choice. The other three are clearly wrong.
  - Text answers rely on the app's matching (`textMatches`): "107%" in q02 matches only as a string, and "−3" in q07 is normalized to "-3".
- **Order questions** (q05, q10, q11, h12, h26): each has a single valid order.
- **Match and label questions** (q03, q08, q13, h11, h25, q01, q06, h15): every pairing is unambiguous.
- **Label markers.** Rendered on the `-blank` SVGs, every marker sits on the part it names:
  - q01: intercept, asymptote, growth curve, decay curve.
  - q06: base, argument, value.
  - h15: 2, 5, 20, 300. Ticks are at $\log x$, so 2 sits at 30% and 5 at 70% of each decade.
- **22h1 numbers.** All recomputed:
  - Table values: $\ln 1.05$, $\ln 1.10$, $\ln 2$, $\ln 0.8$.
  - Example 1: 3.44%, 28.4%.
  - Example 2: 4.907%, 4.865%, about \$0.70.
  - Partial sums of the series for $e$: 2.71806 and 2.7182815.
  - Rule of 72 table, and $R \cdot T = 72.05$ at 8%.
  - Example 3: 9,950 years. The 50,000-year limit is 8.7 half-lives, with 0.24% remaining.
  - Example 4: $k = 0.0277$, 2.81%, 25.0 years, 6,367 people.
- **22h2 numbers.** All recomputed:
  - Example 1: 75.1 dB and 78.1 dB.
  - Example 2: logs, ratios and differences; slope 0.180, $b = 1.513$, about 6,000 at hour 6, doubling time 1.67 h.
  - Planet logs: all six rows. $T^2/a^3$ is within 0.2% of 1 for every planet. Earth-to-Saturn slope 1.5001; Neptune $30.07^{1.5} = 164.9$ years.
- **Facts and attributions.** All are correct and hedged where needed:
  - Truth in Savings Act / Regulation DD require APY disclosure on deposit accounts (12 U.S.C. 4301 ff.; 12 CFR 1030).
  - The rule of 72 appears without derivation in Pacioli's *Summa de arithmetica* (1494).
  - Carbon-14 half-life 5,730 ± 40 years; conventional radiocarbon ages use the Libby 5,568-year half-life (Stuiver & Polach 1977, *Radiocarbon* 19:355); calibration curves (IntCal); a practical limit of about 50,000 years.
  - Richter's 1935 local magnitude, ×10 amplitude per unit. Moment magnitude, about $10^{1.5}$ energy per unit (Hanks & Kanamori 1979; USGS). Both are labeled as simplifications.
  - $I_0 = 10^{-12}$ W/m², with about 1 W/m² = 120 dB near the threshold of pain (OpenStax *College Physics* 2e, §17.3).
  - Kepler's third law in *Harmonices Mundi* (1619), built on Tycho Brahe's data. Neptune's period is about 164.8 years (NASA/JPL).
  - TI-style exponential regression fits a line to $(x, \ln y)$.
- **Mermaid diagrams.** All five (lessons 20, 21 and 22, 22h1, 22h2) were rendered. The logic is correct, the labels are readable, and each `accDescr` describes the whole chart.
- **Drills.** I generated 500 instances of each of the 6 drills (3,000 in total), recomputed every answer independently from the prompt text, and graded them with `checkAll`.
  - Every correctly rounded answer was accepted, with tolerances of 0.006 at 2 dp, 0.0006 at 3 dp, 0.06 at 1 dp and ±1 year.
  - Wrong answers were rejected. The only exception was at 1%, where $\ln 1.01 = 0.995\% \to 1.00$ really does equal the yearly rate at 2 dp; that is not a defect.
  - There are no unfilled placeholders, "+ -", "1x", or commas inside math. The writer's concern about "$b^{1}$" in `fit-exp` doesn't apply: the engine already drops `^{1}`.
- **Glossary.** The 11 terms and their aliases don't duplicate anything in any `glossary*.yaml`. Every term bolded in 22h1 and 22h2 is covered.

## Overlap

- Kepler's third law is also taught in a2-m4's honors lesson `14h2-power-laws` (Example 2, a planet plot, and drill `a2-m4-r2-kepler`).
  - 22h2 refers to that lesson and uses Kepler for a different purpose: reading the exponent off a log-log graph.
  - Question **h23**, however (period at 4 AU → 8 years), is a plain $T = a^{1.5}$ calculation that duplicates the a2-m4 material. A future editor could replace it with a log-log slope question. I left it, since it's correct and in my files only.
- Core lesson 21 already mentions pH and earthquake scales; 22h2 extends them without contradiction.

## Uncertain / left as is

- **Neptune's period.** "About 164.8 years" is the commonly cited value. NASA's planetary fact sheet lists a slightly different figure (about 59,800 days), from a different averaging. The lesson's "about" covers this.
- **Rule of 72 range.** "Best for rates from about 4% to 12%" is a rule of thumb. The error stays within about 2% across that range, so I left it.

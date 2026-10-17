---
id: stat-chi-gof
module: stat-m9
title: Chi-square goodness-of-fit test
minutes: 30
topics: [Chi-square goodness of fit]
drills: [stat-chi-gof]
refs: [stat-ref-inference, stat-ref-which-test]
---
## Beyond one proportion

The z tests of the last module handle one or two proportions — a categorical variable with
two outcomes. Many categorical variables have more categories: defect type, day of the week,
blood type, die face. To test a claim about the *whole distribution* of such a variable, we
need a way to compare a full set of observed counts to a full set of expected counts at once.
That is the chi-square goodness-of-fit test.

*AP exam scope:* the AP Statistics framework that took effect in the 2026–27 school year
removed the goodness-of-fit test but kept the chi-square tests for two-way tables (next
lesson). This lesson introduces the chi-square statistic, its distribution and its
conditions, which the next lesson relies on, so read it either way.

## The idea

State a hypothesized distribution (the proportion in each category). Multiply by the sample
size to get **expected counts** — what we'd expect to see, on average, if the hypothesis were
true. Then measure how far the **observed counts** are from the expected ones with a single
number:

$$\chi^2 = \sum \frac{(\text{Observed} - \text{Expected})^2}{\text{Expected}}.$$

This is the **chi-square statistic** ($\chi$ is the Greek letter chi). Each term compares one
category: the squared difference is scaled by the expected count, so a miss of 10 counts for
more when only 20 were expected than when 500 were. Large $\chi^2$ means the observed counts
are far from what the hypothesis predicts — evidence against it.

## Chi-square distributions

When $H_0$ is true (and expected counts are large enough), $\chi^2$ follows approximately a
**chi-square distribution**. These distributions

- take only nonnegative values,
- are right-skewed, less so as df increases,
- have mean equal to their degrees of freedom.

For goodness of fit, *df = (number of categories) − 1*: once all but one category's count
is known, the last is determined by the total. The p-value is always the *upper-tail* area,
$P(\chi^2_{\text{df}} \ge \text{observed } \chi^2)$, because only large values are evidence
against $H_0$.

```plot
{"x": [0, 16], "y": [-0.03, 0.26], "grid": false, "functions": [{"f": "chi2pdf(x, 3)"}], "shade": [{"f": "chi2pdf(x, 3)", "from": 8.117, "to": 16}], "segments": [{"from": [0, 0], "to": [16, 0]}], "labels": [{"at": [8.117, -0.018], "text": "8.12"}, {"at": [3, -0.018], "text": "3"}], "caption": "χ² distribution with 3 df; the shaded upper tail beyond 8.12 is the p-value ≈ 0.044"}
```

## The test

- $H_0$: the stated distribution is correct (e.g. $p_1 = 0.4, p_2 = 0.3, \ldots$).
- $H_a$: at least one of the proportions differs from its stated value.

*Conditions*:

1. **Random**: a random sample (or randomized experiment).
2. *10%*: $n \le 0.10N$ when sampling without replacement.
3. **Large counts**: all *expected* counts are at least 5. (Observed counts can be small.)

### Example 1

Historically, rail defects on a network are 40% fastener problems, 30% worn rail, 20% drainage
and 10% cracked ties. In a random sample of 200 recent defects, the counts were 98, 46, 40
and 16. Has the distribution changed? Use $\alpha = 0.05$.

1. *State*: $H_0$: the proportions are 0.40, 0.30, 0.20, 0.10. $H_a$: at least one proportion
   differs.
2. *Plan*: chi-square GOF. Random ✓. Expected counts: $200(0.4) = 80$, $60$, $40$, $20$ — all
   ≥ 5 ✓.
3. *Do*:

   | Category | Observed | Expected | $(O - E)^2/E$ |
   |---|---|---|---|
   | Fasteners | 98 | 80 | $324/80 = 4.050$ |
   | Worn rail | 46 | 60 | $196/60 = 3.267$ |
   | Drainage | 40 | 40 | $0$ |
   | Cracked ties | 16 | 20 | $16/20 = 0.800$ |

   $\chi^2 = 8.117$, df $= 4 - 1 = 3$, p-value $= P(\chi^2_3 \ge 8.117) \approx 0.044$.
4. *Conclude*: $0.044 < 0.05$: reject $H_0$. There is convincing evidence that the
   distribution of defect types has changed.

*Follow-up*: which categories drive the result? The largest contributions are fasteners
(4.05, more than expected) and worn rail (3.27, fewer than expected). Some books use
**standardized residuals** $(O - E)/\sqrt{E}$ for this: $+2.01$ and $-1.81$ here.

### Example 2: a fair die?

A die is rolled 120 times: faces 1–6 appear 15, 25, 18, 22, 14, 26 times. If the die is fair,
each expected count is 20.

$\chi^2 = \dfrac{25 + 25 + 4 + 4 + 36 + 36}{20} = \dfrac{130}{20} = 6.5$, df $= 5$, p-value
$\approx 0.26$. Fail to reject $H_0$: the counts are consistent with a fair die. (The observed
variation is typical of chance.)

## Reading a chi-square table

A chi-square table gives critical values for upper-tail areas. At df = 3, 7.815 cuts off 0.05;
since $8.117 > 7.815$, the p-value is below 0.05. Common 0.05 critical values: df 1: 3.841,
df 2: 5.991, df 3: 7.815, df 4: 9.488, df 5: 11.070.

### Example 3: accidents by day of the week

A railway records 160 minor yard accidents over a year: Monday 22, Tuesday 17, Wednesday 15,
Thursday 16, Friday 19, Saturday 31, Sunday 40. Are accidents equally likely on all days?

Expected count each day: $160/7 \approx 22.86$ (all ≥ 5 ✓). Then
$\chi^2 = \sum (O - E)^2/E \approx 22.7$ with df $= 6$, giving a p-value of about 0.0009. Reject
$H_0$: accidents are not spread evenly. The largest contributions come from Sunday (40 vs. 22.86)
and Saturday — weekends, perhaps because of different staffing.

## Two categories: chi-square meets z

With only two categories, the goodness-of-fit test is the same as a two-sided one-proportion z
test. For the coin machine of lesson 34 (530 heads in 1,000 flips, $p_0 = 0.5$):
$\chi^2 = \dfrac{30^2}{500} + \dfrac{30^2}{500} = 3.6$, and $z = 1.897$ with $z^2 = 3.6$. Both give a
p-value of about 0.058. Chi-square generalizes the z test to any number of categories.

## Common mistakes

- Using proportions or percentages instead of counts in the formula.
- Checking the large-counts condition with observed instead of expected counts.
- Using df = number of categories (forgetting the −1), or $n - 1$.
- Using a two-tailed p-value: chi-square tests are upper-tailed only.
- Concluding from a large p-value that the hypothesized distribution is *correct*.

## Key points

- $\chi^2 = \sum (O - E)^2/E$ with expected counts $E = np_i$ from $H_0$.
- df $=$ categories $- 1$; p-value is the upper-tail area.
- Conditions: random, 10%, all expected counts ≥ 5.
- Follow up a significant result by finding the largest contributions to $\chi^2$.

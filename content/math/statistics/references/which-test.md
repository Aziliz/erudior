---
id: stat-ref-which-test
title: Which procedure should I use?
---
## Step 1: what kind of data?

| Response variable | Groups / structure | Procedure |
|---|---|---|
| Categorical, 2 outcomes | one sample vs. a claimed $p_0$ | one-proportion z test / z interval |
| Categorical, 2 outcomes | two independent groups | two-proportion z test (pooled) / z interval (unpooled) |
| Categorical, 3+ outcomes | one sample vs. a claimed distribution | chi-square goodness of fit |
| Categorical | one sample, two categorical variables | chi-square test of independence |
| Categorical | several samples or treatments | chi-square test of homogeneity |
| Quantitative | one sample vs. a claimed $\mu_0$ | one-sample t test / t interval |
| Quantitative | two measurements per individual (paired) | paired t on the differences |
| Quantitative | two independent groups | two-sample t test / interval |
| Quantitative | three or more independent groups | one-way ANOVA (F test) |
| Two quantitative variables | linear relationship | t test / interval for the slope $\beta_1$ |

## Step 2: test or interval?

- **"Estimate," "how large," "how much"** → confidence interval.
- **"Is there evidence," "does it differ," "is the claim wrong"** → significance test.
- Often do both: the test answers *whether*, the interval answers *how much*.

## Step 3: paired or independent?

Ask: does each value in one group have a natural partner in the other (same person
before/after, twins, the same car with two tire types, left/right)? If yes → paired. If the
groups were sampled or assigned separately → independent.

## Step 4: check conditions

| Procedure | Conditions |
|---|---|
| All | random sample or random assignment; 10% condition when sampling without replacement; independent groups for two-sample procedures |
| z for proportions | large counts: ≥ 10 successes and ≥ 10 failures (tests: use $p_0$ or $\hat{p}_c$) |
| t for means | population normal or $n \ge 30$; small samples: no strong skew or outliers |
| Chi-square | all expected counts ≥ 5 |
| Regression slope | LINER: linear, independent, normal residuals, equal SD, random |
| ANOVA | each group roughly normal; largest SD ≤ 2 × smallest SD |

## Step 5: when conditions fail

| Problem | Alternative |
|---|---|
| Small sample, skew or outliers, paired data | sign test or Wilcoxon signed-rank test |
| Small sample, skew or outliers, two groups | Wilcoxon rank-sum (Mann–Whitney) test |
| Non-normal groups, 3+ groups | Kruskal–Wallis test |
| Too few expected successes (proportion) | exact binomial test |
| Curved scatterplot | transform ($\log y$, $\log x$) and refit |

## Step 6: conclude in context

| Result | Wording |
|---|---|
| p-value ≤ α | "Because p = … < α = …, reject $H_0$. There is convincing evidence that [$H_a$ in context]." |
| p-value > α | "Because p = … > α = …, fail to reject $H_0$. There is not convincing evidence that [$H_a$ in context]." |
| Interval | "We are C% confident that the interval from … to … captures [parameter in context]." |

## Scope of inference

| | Random assignment | No random assignment |
|---|---|---|
| Random sample | causation; generalize to population | association; generalize to population |
| No random sample | causation for subjects like these | association for these individuals only |

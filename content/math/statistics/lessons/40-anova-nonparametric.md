---
id: stat-anova-nonpar
module: stat-m9
title: One-way ANOVA and nonparametric tests
minutes: 40
topics: [ANOVA and nonparametric tests]
drills: [stat-anova-f, stat-sign-test, stat-rank-sum]
refs: [stat-ref-inference, stat-ref-which-test]
---
## Comparing more than two means, and tests without normality

The two-sample t test compares two means. With three or more groups — three track-maintenance
methods, four fertilizers — running every pairwise t test inflates the chance of a false
alarm: with 10 comparisons at $\alpha = 0.05$, the chance of at least one Type I error can
approach 40%. **Analysis of variance** (ANOVA) tests all the means at once. The second half of
this lesson introduces nonparametric tests, which drop the normality condition by working with
signs and ranks.

## One-way ANOVA: the idea

Hypotheses for $k$ groups:

- $H_0: \mu_1 = \mu_2 = \cdots = \mu_k$ (all population means equal);
- $H_a$: at least one mean differs.

The name is misleading — ANOVA compares *means* by comparing two kinds of *variation*:

- **Between-group variation**: how far the group means are from the overall mean.
- **Within-group variation**: how much individual values scatter around their own group mean.

If the group means differ by much more than the within-group scatter would explain, that's
evidence the population means differ.

```plot
{"x": [0, 4], "y": [3, 10], "xLabel": "method", "yLabel": "rating", "points": [{"at": [1, 5], "color": "#2c5e8f"}, {"at": [1, 7], "color": "#2c5e8f"}, {"at": [0.9, 6], "color": "#2c5e8f"}, {"at": [1.1, 6], "color": "#2c5e8f"}, {"at": [1.9, 8], "color": "#c2570c"}, {"at": [2, 9], "color": "#c2570c"}, {"at": [2, 7], "color": "#c2570c"}, {"at": [2.1, 8], "color": "#c2570c"}, {"at": [3, 4], "color": "#2f855a"}, {"at": [2.9, 5], "color": "#2f855a"}, {"at": [3, 6], "color": "#2f855a"}, {"at": [3.1, 5], "color": "#2f855a"}], "segments": [{"from": [0.7, 6], "to": [1.3, 6]}, {"from": [1.7, 8], "to": [2.3, 8]}, {"from": [2.7, 5], "to": [3.3, 5]}, {"from": [0.2, 6.333], "to": [3.8, 6.333], "dashed": true}], "labels": [{"at": [1, 3.4], "text": "A"}, {"at": [2, 3.4], "text": "B"}, {"at": [3, 3.4], "text": "C"}], "caption": "Three groups: group means (solid bars) are far apart relative to the scatter within each group; dashed line is the grand mean"}
```

## The F statistic

With $k$ groups, group sizes $n_i$, group means $\bar{x}_i$, group SDs $s_i$, total $N$ and grand
mean $\bar{x}$:

$$\text{SSG} = \sum n_i(\bar{x}_i - \bar{x})^2, \qquad \text{SSE} = \sum (n_i - 1)s_i^2,$$

$$\text{MSG} = \frac{\text{SSG}}{k - 1}, \qquad \text{MSE} = \frac{\text{SSE}}{N - k}, \qquad F = \frac{\text{MSG}}{\text{MSE}}.$$

SSG ("groups") measures between-group variation and SSE ("error") within-group variation; the
mean squares MS divide each by its degrees of freedom. MSE is a pooled estimate of the common
variance $\sigma^2$. If $H_0$ is true, MSG also estimates $\sigma^2$ and $F$ is near 1; if the means
differ, MSG is inflated and $F$ is large.

Under $H_0$, $F$ follows an **F distribution** with $k - 1$ and $N - k$ degrees of freedom
(numerator and denominator). F distributions are right-skewed and nonnegative; the p-value is
the upper-tail area.

*Conditions*: random samples or random assignment; independent groups; each population
approximately normal (check each group for strong skew or outliers); equal population standard
deviations (rule of thumb: largest $s_i$ no more than twice the smallest).

### Example 1

Twelve track segments are randomly assigned to three maintenance methods (4 each); the response
is a condition rating after a year:

| Method | Ratings | Mean | SD |
|---|---|---|---|
| A | 5, 7, 6, 6 | 6 | 0.816 |
| B | 8, 9, 7, 8 | 8 | 0.816 |
| C | 4, 5, 6, 5 | 5 | 0.816 |

1. Grand mean $\bar{x} = 76/12 \approx 6.333$.
2. SSG $= 4[(6 - 6.333)^2 + (8 - 6.333)^2 + (5 - 6.333)^2] = 4(4.667) \approx 18.67$.
3. SSE: each group's squared deviations sum to 2, so SSE $= 6$.
4. MSG $= 18.67/2 = 9.33$; MSE $= 6/9 = 0.667$; $F = 9.33/0.667 = 14.0$, with df 2 and 9.
5. p-value $= P(F_{2,9} \ge 14.0) \approx 0.0017$. Reject $H_0$: the methods do not all produce the
   same mean rating.

| Source | df | SS | MS | F | P |
|---|---|---|---|---|---|
| Groups | 2 | 18.67 | 9.33 | 14.0 | 0.0017 |
| Error | 9 | 6.00 | 0.667 | | |
| Total | 11 | 24.67 | | | |

ANOVA says *some* difference exists, not *which* means differ. Follow-up comparisons (for example
Tukey's method, or confidence intervals for pairs with an adjusted confidence level) identify
them; here method B looks best.

## Nonparametric tests

t and F procedures assume normal populations (or large samples). When data are small and
clearly non-normal, ordinal, or have outliers, **nonparametric tests** — also called
distribution-free tests — use only signs or ranks of the data, so a single extreme value can't
dominate.

### The sign test

For paired data (or one sample vs. a median), count how many differences are positive, ignoring
zeros. Under $H_0$ (median difference 0), each nonzero difference is positive with probability
0.5, so the count is $B(n, 0.5)$.

#### Example 2

Ten workers try a new keyboard; 8 type faster, 2 slower. One-sided test of "faster":
p-value $= P(X \ge 8)$ for $X \sim B(10, 0.5) = \dfrac{\binom{10}{8} + \binom{10}{9} + \binom{10}{10}}{2^{10}} = \dfrac{45 + 10 + 1}{1024} \approx 0.055$.
Borderline at $\alpha = 0.05$. The sign test ignores *how much* faster, so it has less power than a
paired t test when the t test's conditions hold.

### Wilcoxon signed-rank test

A more powerful paired alternative: rank the absolute differences, attach the signs, and add the
positive ranks. Large or small sums are evidence against $H_0$. It uses magnitudes (through
ranks) but still resists outliers.

### Wilcoxon rank-sum (Mann–Whitney) test

The nonparametric alternative to the two-sample t test. Combine both samples, rank all values
from smallest (rank 1) to largest, and add the ranks of group 1: $W$. If $H_0$ (same
distributions) holds, $W$ should be near its expected value $n_1(N+1)/2$.

#### Example 3

Group A: 12, 15, 19, 22. Group B: 9, 11, 14, 16. Combined order: 9, 11, 12, 14, 15, 16, 19, 22 get
ranks 1–8. Group A has ranks 3, 5, 7, 8, so $W = 23$, versus $4(9)/2 = 18$ expected under $H_0$.
Software (or exact tables) converts $W$ to a p-value.

### Kruskal–Wallis test

The rank-based alternative to one-way ANOVA for $k$ groups: rank all observations together and
compare the groups' average ranks.

| Situation | Parametric | Nonparametric |
|---|---|---|
| Paired data | paired t | sign test, Wilcoxon signed-rank |
| Two independent groups | two-sample t | Wilcoxon rank-sum (Mann–Whitney) |
| $k$ independent groups | one-way ANOVA | Kruskal–Wallis |

## Common mistakes

- Running many two-sample t tests instead of one ANOVA.
- Concluding from a significant F that *all* means differ.
- Swapping the F degrees of freedom: numerator $k - 1$, denominator $N - k$.
- Using ANOVA when one group's SD is several times another's.
- Thinking nonparametric tests need no conditions: they still require random samples and
  independence.

## Key points

- One-way ANOVA: $H_0$ all means equal; $F = \text{MSG}/\text{MSE}$ with df $(k - 1, N - k)$; upper-tail p-value.
- SSG = between-group, SSE = within-group variation; MSE pools the group variances.
- Conditions: random, independent groups, roughly normal, similar SDs.
- Nonparametric tests use signs or ranks: sign test, signed-rank, rank-sum, Kruskal–Wallis.

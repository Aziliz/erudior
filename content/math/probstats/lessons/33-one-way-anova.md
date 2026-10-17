---
id: ps-anova
module: ps-m8
title: One-way analysis of variance
minutes: 45
topics: [One-way ANOVA]
drills: [ps-d-anova-raw, ps-d-anova-summary, ps-d-anova-table]
refs: [ps-ref-testing]
---
## More than two means

The pooled two-sample $t$ test compares two normal means. With $k \ge 3$ groups (three ballast
materials, four tamping schedules), testing every pair separately is a trap: with three pairs
at $\alpha = 0.05$ each, the chance of at least one false alarm when all means are equal can be as
high as $1 - 0.95^3 \approx 0.14$, and with ten pairs about 0.40. **Analysis of variance**
(ANOVA) tests all the means at once with a single $F$ statistic. It is also our second example of
splitting a total sum of squares into pieces, as in regression.

## The model and hypotheses

Group $i$ ($i = 1, \dots, k$) has $n_i$ observations, $N = \sum n_i$ in all:

$$Y_{ij} = \mu_i + \varepsilon_{ij}, \qquad \varepsilon_{ij} \text{ independent } N(0, \sigma^2).$$

Each group is normal with its own mean but a *common* variance. The hypotheses are

$$H_0: \mu_1 = \mu_2 = \cdots = \mu_k \qquad \text{versus} \qquad H_1: \text{not all } \mu_i \text{ are equal}.$$

Write $\bar Y_{i\cdot}$ for the mean of group $i$ and $\bar Y_{\cdot\cdot}$ for the grand mean of all $N$
observations.

## Splitting the variation

Write each deviation from the grand mean as a between-group piece plus a within-group piece:
$Y_{ij} - \bar Y_{\cdot\cdot} = (\bar Y_{i\cdot} - \bar Y_{\cdot\cdot}) + (Y_{ij} - \bar Y_{i\cdot})$. Squaring and
summing over all observations,

$$\underbrace{\sum_{i}\sum_{j}(Y_{ij} - \bar Y_{\cdot\cdot})^2}_{\text{SST}} = \underbrace{\sum_i n_i(\bar Y_{i\cdot} - \bar Y_{\cdot\cdot})^2}_{\text{SSTr}} + \underbrace{\sum_i\sum_j(Y_{ij} - \bar Y_{i\cdot})^2}_{\text{SSE}}.$$

The cross term is $2\sum_i(\bar Y_{i\cdot} - \bar Y_{\cdot\cdot})\sum_j(Y_{ij} - \bar Y_{i\cdot})$, and each inner sum is
zero because deviations from a group's own mean sum to zero.

- The **total sum of squares** SST measures all the variation, on $N - 1$ df.
- The **treatment sum of squares** SSTr (also called the between-groups sum of squares) measures
  how far the group means are from each other, on $k - 1$ df.
- The **error sum of squares** SSE (within groups) measures scatter inside each group, on
  $N - k$ df. Equivalently $\text{SSE} = \sum(n_i - 1)S_i^2$.

Dividing a sum of squares by its degrees of freedom gives a **mean square**:
$\text{MSTr} = \text{SSTr}/(k-1)$ and $\text{MSE} = \text{SSE}/(N-k)$.

## Why the ratio is $F$

*Within groups.* Each $(n_i - 1)S_i^2/\sigma^2 \sim \chi^2_{n_i - 1}$, independently, so
$\text{SSE}/\sigma^2 \sim \chi^2_{N-k}$ whether or not $H_0$ holds, and $E(\text{MSE}) = \sigma^2$. MSE is the
pooled variance estimate from the two-sample $t$ test, extended to $k$ groups.

*Between groups.* A direct calculation gives

$$E(\text{MSTr}) = \sigma^2 + \frac{\sum_i n_i(\mu_i - \bar\mu)^2}{k - 1}, \qquad \bar\mu = \frac{\sum n_i\mu_i}{N}.$$

Under $H_0$ the extra term is zero, and $\text{SSTr}/\sigma^2 \sim \chi^2_{k-1}$, independent of SSE (it is
a function of the group means, which are independent of the group variances). Hence

$$F = \frac{\text{MSTr}}{\text{MSE}} \sim F_{k-1,\, N-k} \quad \text{under } H_0.$$

When the means differ, MSTr is inflated and $F$ tends to be large. Reject $H_0$ when
$F \ge F_{\alpha, k-1, N-k}$; the p-value is the upper tail area. With $k = 2$ groups, $F = t^2$ for the
pooled $t$ statistic, so ANOVA generalizes the two-sample test.

The calculations are summarized in an **ANOVA table**.

### Example 1: ANOVA from raw data

Track settlement (mm) after six months on three ballast types, five sections each:

| Ballast | Settlement | Mean | $\sum(y - \bar y_i)^2$ |
|---|---|---|---|
| A | 10, 13, 14, 13, 15 | 13 | 14 |
| B | 16, 18, 15, 17, 19 | 17 | 10 |
| C | 14, 12, 16, 15, 13 | 14 | 10 |

1. *Grand mean.* $\bar y_{\cdot\cdot} = (65 + 85 + 70)/15 = 14.667$.
2. *SSTr.* $5[(13 - 14.667)^2 + (17 - 14.667)^2 + (14 - 14.667)^2] = 5(2.778 + 5.444 + 0.444) = 43.33$.
3. *SSE.* $14 + 10 + 10 = 34$. (Check: SST $= 77.33 = 43.33 + 34$.)
4. *Mean squares.* $\text{MSTr} = 43.33/2 = 21.67$; $\text{MSE} = 34/12 = 2.833$.
5. *Test.* $F = 21.67/2.833 = 7.65$ on (2, 12) df. $F_{0.05, 2, 12} = 3.89$, so reject; p-value $\approx 0.0072$.

| Source | df | SS | MS | F | p |
|---|---|---|---|---|---|
| Treatments | 2 | 43.33 | 21.67 | 7.65 | 0.0072 |
| Error | 12 | 34.00 | 2.833 | | |
| Total | 14 | 77.33 | | | |

```plot
{"x": [0.3, 3.7], "y": [8, 21], "xLabel": "ballast", "yLabel": "settlement (mm)", "segments": [{"from": [0.75, 11.5], "to": [1.25, 11.5], "color": "#2c5e8f"}, {"from": [1.25, 11.5], "to": [1.25, 14.5], "color": "#2c5e8f"}, {"from": [1.25, 14.5], "to": [0.75, 14.5], "color": "#2c5e8f"}, {"from": [0.75, 14.5], "to": [0.75, 11.5], "color": "#2c5e8f"}, {"from": [1.75, 15.5], "to": [2.25, 15.5], "color": "#c2570c"}, {"from": [2.25, 15.5], "to": [2.25, 18.5], "color": "#c2570c"}, {"from": [2.25, 18.5], "to": [1.75, 18.5], "color": "#c2570c"}, {"from": [1.75, 18.5], "to": [1.75, 15.5], "color": "#c2570c"}, {"from": [2.75, 12.5], "to": [3.25, 12.5], "color": "#2f855a"}, {"from": [3.25, 12.5], "to": [3.25, 15.5], "color": "#2f855a"}, {"from": [3.25, 15.5], "to": [2.75, 15.5], "color": "#2f855a"}, {"from": [2.75, 15.5], "to": [2.75, 12.5], "color": "#2f855a"}, {"from": [0.75, 13], "to": [1.25, 13], "color": "#2c5e8f"}, {"from": [1, 10], "to": [1, 11.5], "color": "#2c5e8f"}, {"from": [1, 14.5], "to": [1, 15], "color": "#2c5e8f"}, {"from": [1.75, 17], "to": [2.25, 17], "color": "#c2570c"}, {"from": [2, 15], "to": [2, 15.5], "color": "#c2570c"}, {"from": [2, 18.5], "to": [2, 19], "color": "#c2570c"}, {"from": [2.75, 14], "to": [3.25, 14], "color": "#2f855a"}, {"from": [3, 12], "to": [3, 12.5], "color": "#2f855a"}, {"from": [3, 15.5], "to": [3, 16], "color": "#2f855a"}, {"from": [0.4, 14.667], "to": [3.6, 14.667], "dashed": true}], "labels": [{"at": [1, 9], "text": "A"}, {"at": [2, 9], "text": "B"}, {"at": [3, 9], "text": "C"}, {"at": [2.5, 15.2], "text": "grand mean"}], "caption": "Boxplots by group: B sits well above the others relative to the spread within groups"}
```

```plot
{"x": [0, 10], "y": [-0.05, 0.4], "grid": false, "functions": [{"f": "(1 + x/6)^(-7)", "from": 0, "to": 10}], "shade": [{"f": "(1 + x/6)^(-7)", "from": 3.885, "to": 10, "color": "#c2570c"}], "segments": [{"from": [0, 0], "to": [10, 0]}, {"from": [7.65, 0], "to": [7.65, 0.1], "color": "#2c5e8f"}], "labels": [{"at": [3.885, -0.028], "text": "3.89"}, {"at": [7.65, 0.12], "text": "F = 7.65"}, {"at": [5.2, 0.06], "text": "α = 0.05"}], "caption": "The F distribution with (2, 12) df (the density is 1 at F = 0, off the top of the view): the 5% rejection region starts at 3.89"}
```

### Example 2: ANOVA from summary statistics

Four tamping schedules give these rail-alignment scores:

| Schedule | 1 | 2 | 3 | 4 |
|---|---|---|---|---|
| $n_i$ | 6 | 8 | 7 | 5 |
| $\bar y_i$ | 24.1 | 27.3 | 25.0 | 29.4 |
| $s_i$ | 2.2 | 2.9 | 2.5 | 3.1 |

1. $N = 26$; grand mean $= (6 \cdot 24.1 + 8 \cdot 27.3 + 7 \cdot 25.0 + 5 \cdot 29.4)/26 = 685/26 = 26.346$.
2. $\text{SSTr} = \sum n_i(\bar y_i - 26.346)^2 = 96.86$; $\text{SSE} = \sum(n_i - 1)s_i^2 = 24.20 + 58.87 + 37.50 + 38.44 = 159.01$.
3. $\text{MSTr} = 96.86/3 = 32.29$; $\text{MSE} = 159.01/22 = 7.228$; $F = 4.47$ on (3, 22) df.
4. $F_{0.05, 3, 22} = 3.05$; p-value $\approx 0.014$. Reject: the schedules do not all have the same mean.

## Assumptions

- *Independence* within and between groups (random assignment or random samples).
- *Normality* within each group. The $F$ test is fairly robust to this, especially with similar
  group sizes, for the same CLT reason as the $t$ test.
- *Equal variances.* More important, particularly when group sizes differ. A common rule of
  thumb: the largest sample s.d. should be no more than about twice the smallest. Look at
  boxplots by group, and at residuals $y_{ij} - \bar y_{i\cdot}$ plotted against group.

## Which means differ? Multiple comparisons

Rejecting $H_0$ says only that *some* means differ. Comparing pairs afterward raises the
problem we started with. The probability of at least one Type I error across a whole family of
comparisons is the **familywise error rate**, and multiple comparison methods control it.

- **Bonferroni correction**. For $m$ comparisons, run each at level $\alpha/m$. By the union bound,
  $P(\text{any false rejection}) \le \sum \alpha/m = \alpha$. Simple, and conservative when $m$ is large.
- **Tukey's method** (honestly significant difference) uses the distribution of the largest
  standardized difference among all pairs of means, giving exact familywise control for all
  pairwise comparisons with equal group sizes and shorter intervals than Bonferroni.

Pairwise intervals use the pooled MSE and its $N - k$ df:
$\bar y_i - \bar y_j \pm t_{\alpha/(2m), N-k}\sqrt{\text{MSE}(1/n_i + 1/n_j)}$.

### Example 3: Bonferroni comparisons

For Example 1, $m = 3$ pairs, so each uses $t_{0.05/6, 12} = 2.779$, and the margin is
$2.779\sqrt{2.833(2/5)} = 2.96$.

- B − A $= 4$: exceeds 2.96, a significant difference.
- B − C $= 3$: just exceeds 2.96, significant.
- C − A $= 1$: not significant.

Ballast B settles more than both A and C; A and C can't be distinguished.

## Common mistakes

- Running all pairwise $t$ tests at $\alpha$ each instead of one $F$ test (or a corrected procedure).
- Reading a significant $F$ as "all the means are different."
- Swapping the df: the numerator has $k - 1$, the denominator $N - k$.
- Forgetting the $n_i$ weights in SSTr when group sizes differ.
- Using a two-tailed rejection region for $F$; only large $F$ is evidence against $H_0$.
- Ignoring very unequal group spreads, especially with unequal group sizes.

## Key points

- Model $Y_{ij} = \mu_i + \varepsilon_{ij}$ with common $\sigma^2$; $H_0$: all $\mu_i$ equal.
- SST = SSTr + SSE, with df $N - 1 = (k - 1) + (N - k)$.
- $F = \text{MSTr}/\text{MSE} \sim F_{k-1, N-k}$ under $H_0$; reject for large $F$.
- MSE estimates $\sigma^2$ always; MSTr does only under $H_0$.
- After rejecting, compare pairs with Bonferroni or Tukey to control the familywise error rate.

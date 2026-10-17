---
id: ps-nonparametric
module: ps-m8
title: Nonparametric methods
minutes: 45
topics: [Nonparametric tests]
drills: [ps-d-sign-test, ps-d-signed-rank, ps-d-rank-sum]
refs: [ps-ref-testing]
---
## Tests that don't assume a distribution

Every test so far has assumed a parametric family: normal errors for $t$, $F$ and regression,
binomial or multinomial counts for the chi-square tests. When the sample is small and the data
are clearly skewed, heavy-tailed or only ordinal (ratings, rankings), those assumptions can
fail in ways the CLT doesn't rescue. A **nonparametric test** (also called distribution-free)
has a null distribution that is the same for every continuous population. The trick is to
throw away the measurement scale and keep only signs or ranks, whose behavior under $H_0$ follows
from symmetry and counting alone.

## The sign test

Let $D_1, \dots, D_n$ be paired differences (or observations minus a hypothesized median) from a
continuous distribution with median $m$. Test $H_0: m = 0$. Under $H_0$, each $D_i$ is positive with
probability $1/2$, independently, so the number of positive differences is

$$B = \#\{i : D_i > 0\} \sim \text{Bin}(n, 1/2) \quad \text{under } H_0.$$

The **sign test** rejects for large $B$ (for $H_1: m > 0$), small $B$, or either, with exact
binomial p-values. Differences exactly equal to zero are dropped and $n$ reduced. For large $n$,
$Z = (B - n/2)/\sqrt{n/4}$ is approximately standard normal. The only assumption beyond
independence is continuity: no normality, not even symmetry.

### Example 1: sign test

Ten track sections are scored for ride quality before and after a new tamping procedure. The
differences (after − before) are

$$1.8,\ -0.4,\ 2.6,\ 0.9,\ 3.1,\ 1.2,\ -1.5,\ 2.2,\ 0.6,\ 4.0.$$

Test $H_0: m = 0$ against $H_1: m > 0$.

1. Eight of the ten differences are positive, so $B = 8$.
2. p-value $= P(B \ge 8) = \dfrac{\binom{10}{8} + \binom{10}{9} + \binom{10}{10}}{2^{10}} = \dfrac{45 + 10 + 1}{1024} = 0.0547.$
3. Not quite significant at 5%. The sign test ignores the fact that the positive differences are
   mostly large and the negative ones small.

## The Wilcoxon signed-rank test

Use the sizes too, through their ranks. Rank $\lvert D_1\rvert, \dots, \lvert D_n\rvert$ from 1 (smallest)
to $n$, and add the ranks belonging to positive differences:

$$W^+ = \sum_{i:\, D_i > 0} \operatorname{rank}(\lvert D_i\rvert).$$

The **Wilcoxon signed-rank test** assumes the differences come from a continuous distribution
*symmetric* about its median $m$, and tests $H_0: m = 0$.

**Null distribution.** If the distribution is symmetric about 0, the sign of each $D_i$ is
independent of $\lvert D_i\rvert$ and equally likely to be $+$ or $-$. So the rank $k$ (for
$k = 1, \dots, n$) is included in $W^+$ with probability $1/2$, independently:
$W^+ = \sum_{k=1}^n kI_k$ with $I_k$ i.i.d. Bernoulli(1/2). Hence

$$E(W^+) = \frac12\sum_{k=1}^n k = \frac{n(n+1)}{4}, \qquad \operatorname{Var}(W^+) = \frac14\sum_{k=1}^n k^2 = \frac{n(n+1)(2n+1)}{24}.$$

The exact distribution comes from counting which of the $2^n$ equally likely sign patterns give
each total; for larger $n$, $Z = \big(W^+ - E(W^+)\big)/\sqrt{\operatorname{Var}(W^+)}$ is approximately
normal.

### Example 2: signed-rank test on the same data

1. *Rank the absolute values.* $0.4, 0.6, 0.9, 1.2, 1.5, 1.8, 2.2, 2.6, 3.1, 4.0$ get ranks 1 through 10.
2. *Negative differences* are $-0.4$ (rank 1) and $-1.5$ (rank 5). So $W^- = 6$ and
   $W^+ = 55 - 6 = 49$ (the ranks total $10 \cdot 11/2 = 55$).
3. *Exact p-value.* Only 14 of the $2^{10} = 1024$ sign patterns give $W^+ \ge 49$, so
   $p = 14/1024 = 0.0137$. Reject at 5%.
4. *Normal approximation.* $E = 27.5$, $\operatorname{Var} = 10(11)(21)/24 = 96.25$, so
   $z = (49 - 27.5)/9.81 = 2.19$ and $p \approx 0.014$.

The signed-rank test detects what the sign test missed because it knows the two negative
differences were small. (The paired $t$ test gives $t = 2.78$, $p = 0.011$, very close.)

```plot
{"x": [-1, 56], "y": [0, 0.045], "xLabel": "W⁺", "yLabel": "probability", "bars": [{"x": 0, "height": 0.00098, "width": 0.9}, {"x": 1, "height": 0.00098, "width": 0.9}, {"x": 2, "height": 0.00098, "width": 0.9}, {"x": 3, "height": 0.00195, "width": 0.9}, {"x": 4, "height": 0.00195, "width": 0.9}, {"x": 5, "height": 0.00293, "width": 0.9}, {"x": 6, "height": 0.00391, "width": 0.9}, {"x": 7, "height": 0.00488, "width": 0.9}, {"x": 8, "height": 0.00586, "width": 0.9}, {"x": 9, "height": 0.00781, "width": 0.9}, {"x": 10, "height": 0.00977, "width": 0.9}, {"x": 11, "height": 0.01074, "width": 0.9}, {"x": 12, "height": 0.0127, "width": 0.9}, {"x": 13, "height": 0.01465, "width": 0.9}, {"x": 14, "height": 0.0166, "width": 0.9}, {"x": 15, "height": 0.01953, "width": 0.9}, {"x": 16, "height": 0.02148, "width": 0.9}, {"x": 17, "height": 0.02344, "width": 0.9}, {"x": 18, "height": 0.02637, "width": 0.9}, {"x": 19, "height": 0.02832, "width": 0.9}, {"x": 20, "height": 0.03027, "width": 0.9}, {"x": 21, "height": 0.03223, "width": 0.9}, {"x": 22, "height": 0.03418, "width": 0.9}, {"x": 23, "height": 0.03516, "width": 0.9}, {"x": 24, "height": 0.03711, "width": 0.9}, {"x": 25, "height": 0.03809, "width": 0.9}, {"x": 26, "height": 0.03809, "width": 0.9}, {"x": 27, "height": 0.03906, "width": 0.9}, {"x": 28, "height": 0.03906, "width": 0.9}, {"x": 29, "height": 0.03809, "width": 0.9}, {"x": 30, "height": 0.03809, "width": 0.9}, {"x": 31, "height": 0.03711, "width": 0.9}, {"x": 32, "height": 0.03516, "width": 0.9}, {"x": 33, "height": 0.03418, "width": 0.9}, {"x": 34, "height": 0.03223, "width": 0.9}, {"x": 35, "height": 0.03027, "width": 0.9}, {"x": 36, "height": 0.02832, "width": 0.9}, {"x": 37, "height": 0.02637, "width": 0.9}, {"x": 38, "height": 0.02344, "width": 0.9}, {"x": 39, "height": 0.02148, "width": 0.9}, {"x": 40, "height": 0.01953, "width": 0.9}, {"x": 41, "height": 0.0166, "width": 0.9}, {"x": 42, "height": 0.01465, "width": 0.9}, {"x": 43, "height": 0.0127, "width": 0.9}, {"x": 44, "height": 0.01074, "width": 0.9}, {"x": 45, "height": 0.00977, "width": 0.9}, {"x": 46, "height": 0.00781, "width": 0.9}, {"x": 47, "height": 0.00586, "width": 0.9}, {"x": 48, "height": 0.00488, "width": 0.9}, {"x": 49, "height": 0.00391, "width": 0.9, "color": "#c2570c"}, {"x": 50, "height": 0.00293, "width": 0.9, "color": "#c2570c"}, {"x": 51, "height": 0.00195, "width": 0.9, "color": "#c2570c"}, {"x": 52, "height": 0.00195, "width": 0.9, "color": "#c2570c"}, {"x": 53, "height": 0.00098, "width": 0.9, "color": "#c2570c"}, {"x": 54, "height": 0.00098, "width": 0.9, "color": "#c2570c"}, {"x": 55, "height": 0.00098, "width": 0.9, "color": "#c2570c"}], "labels": [{"at": [47, 0.031], "text": "P(W⁺ ≥ 49) = 14/1024"}], "segments": [{"from": [49, 0.028], "to": [51, 0.006], "arrow": true}], "caption": "Exact null distribution of the signed-rank statistic for n = 10: symmetric about 27.5; the shaded tail is the p-value"}
```

## The Wilcoxon rank-sum test

For two independent samples $X_1, \dots, X_m$ and $Y_1, \dots, Y_n$ from continuous distributions,
test $H_0$: the two distributions are identical, against a shift alternative (one is the other
moved left or right). Rank all $N = m + n$ values together and let

$$W = \text{sum of the ranks of the } X\text{'s}.$$

This is the **Wilcoxon rank-sum test**. Under $H_0$ every set of $m$ ranks out of $\{1, \dots, N\}$ is
equally likely (there are $\binom{N}{m}$ of them), which gives the exact null distribution. $W$ is
the total of $m$ draws without replacement from $1, \dots, N$, a population with mean $(N+1)/2$
and variance $(N^2 - 1)/12$; the finite-population formula gives

$$E(W) = \frac{m(N+1)}{2}, \qquad \operatorname{Var}(W) = m\cdot\frac{N^2 - 1}{12}\cdot\frac{N - m}{N - 1} = \frac{mn(N+1)}{12}.$$

The equivalent **Mann–Whitney U** statistic is $U = W - m(m+1)/2$, the number of pairs
$(X_i, Y_j)$ with $X_i > Y_j$. It ranges from 0 to $mn$, and $U/(mn)$ estimates $P(X > Y)$.

### Example 3: rank-sum test

Method A gives rail-grinding removal rates 18.2, 21.5, 16.9, 24.8, 20.1; method B gives 15.3, 17.4,
14.8, 19.0, 16.2, 13.9. Is A's distribution shifted upward?

```plot
{"x": [12, 26], "y": [0.4, 2.6], "xLabel": "removal rate", "yLabel": "sample", "points": [{"at": [13.9, 1], "label": "1", "color": "#2c5e8f"}, {"at": [14.8, 1], "label": "2", "color": "#2c5e8f"}, {"at": [15.3, 1], "label": "3", "color": "#2c5e8f"}, {"at": [16.2, 1], "label": "4", "color": "#2c5e8f"}, {"at": [16.9, 2], "label": "5", "color": "#c2570c"}, {"at": [17.4, 1], "label": "6", "color": "#2c5e8f"}, {"at": [18.2, 2], "label": "7", "color": "#c2570c"}, {"at": [19.0, 1], "label": "8", "color": "#2c5e8f"}, {"at": [20.1, 2], "label": "9", "color": "#c2570c"}, {"at": [21.5, 2], "label": "10", "color": "#c2570c"}, {"at": [24.8, 2], "label": "11", "color": "#c2570c"}], "labels": [{"at": [12.7, 2], "text": "A"}, {"at": [12.7, 1], "text": "B"}], "caption": "Both samples on one scale, labeled with their ranks in the combined ordering; A holds ranks 5, 7, 9, 10, 11"}
```

1. *Rank all eleven values.* A's values receive ranks 5, 7, 9, 10, 11, so $W = 42$.
2. *Null moments.* $m = 5$, $n = 6$, $N = 11$: $E(W) = 5(12)/2 = 30$ and $\operatorname{Var}(W) = 5(6)(12)/12 = 30$.
3. *Normal approximation.* $z = (42 - 30)/\sqrt{30} = 2.19$, $p \approx 0.014$.
4. *Exact.* $U = 42 - 15 = 27$ of the 30 pairs have A above B. Only 7 of the $\binom{11}{5} = 462$
   possible rank sets give $W \ge 42$, so $p = 7/462 = 0.015$. Reject at 5%.

Tied values get the average of the ranks they span (two values tied for ranks 4 and 5 each get 4.5),
and the variance formula then needs a small correction that software applies.

## The permutation idea

Rank tests are special cases of a general principle. If $H_0$ says the group labels don't matter,
then every relabeling of the observed data was equally likely. A **permutation test** computes
any chosen statistic (a difference in means, say) for every relabeling and reports the fraction at
least as extreme as the observed one.

### Example 4: a permutation test by hand

Group A: 7, 9, 12. Group B: 4, 5, 8. The observed difference in means is $9.33 - 5.67 = 3.67$.
There are $\binom{6}{3} = 20$ ways to choose which three values are labeled A. Listing them, only two
give a difference of at least 3.67: the observed split, and $\{8, 9, 12\}$ versus $\{4, 5, 7\}$
(difference 4.33). So the one-sided p-value is $2/20 = 0.10$.

With larger samples there are too many relabelings to list, so one samples a few thousand at
random. The p-value is exact under $H_0$ without any distributional assumption; the rank-sum test
is the permutation test applied to ranks, which is why its null distribution can be tabulated
once for all data sets.

## When to prefer them

- *Small samples with skewness, heavy tails or outliers.* One wild value can dominate $\bar x$ and
  $s$, but as a rank it counts no more than the largest (or smallest) ordinary value, however far out it lies.
- *Ordinal data*, where only the order is meaningful.
- *Little cost when the data are normal.* The **asymptotic relative efficiency** (ARE) compares
  the sample sizes two tests need for equal power. Under normality the Wilcoxon tests have ARE
  $3/\pi \approx 0.955$ relative to the $t$ tests: the $t$ test gets from about 95 observations the power the Wilcoxon test needs 100 for. The
  sign test's ARE is only $2/\pi \approx 0.64$. For heavy-tailed populations the Wilcoxon tests can
  be far *more* efficient than $t$, and their ARE relative to $t$ never falls below 0.864.

The rank-based analogue of one-way ANOVA is the **Kruskal–Wallis test**: rank all $N$
observations together and compare the groups' average ranks; its statistic is approximately
$\chi^2_{k-1}$ under $H_0$.

| Situation | Normal-theory test | Rank-based alternative |
|---|---|---|
| One sample or paired | $t$ test | sign test, signed-rank test |
| Two independent samples | two-sample $t$ | rank-sum (Mann–Whitney) |
| $k$ independent samples | one-way ANOVA | Kruskal–Wallis |

## Common mistakes

- Thinking nonparametric means assumption-free: independence is still required, and the signed-rank test needs symmetry.
- Ranking the signed differences instead of their absolute values in the signed-rank test.
- Forgetting to drop zero differences before counting signs.
- Reading a significant rank-sum test as a statement about means; it concerns the distributions (a shift, or $P(X > Y) \ne 1/2$).
- Using the normal approximation with very small samples when the exact distribution is easy to get.

## Key points

- Sign test: $B \sim \text{Bin}(n, 1/2)$ under $H_0$; needs only continuity.
- Signed-rank: $W^+$ = sum of ranks of positive $\lvert D_i\rvert$; mean $n(n+1)/4$, variance $n(n+1)(2n+1)/24$.
- Rank-sum: $W$ = sum of ranks of sample 1 in the combined sample; mean $m(N+1)/2$, variance $mn(N+1)/12$; $U = W - m(m+1)/2$.
- Permutation tests: under $H_0$ all relabelings are equally likely; the p-value is a fraction of relabelings.
- Wilcoxon tests lose about 5% efficiency under normality and can gain a lot with heavy tails.

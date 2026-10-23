---
id: stat-m9-h-chi-theory
module: stat-m9
honors: true
title: 'Where the chi-square test comes from'
minutes: 45
topics: [Chi-square theory]
drills: [stat-m9-r2-two-cat, stat-m9-r2-gof-df]
refs: [stat-ref-inference]
---
## Opening the black box

Lessons 37 and 38 used three facts without proving them: the statistic
$\sum (O - E)^2/E$ follows a chi-square distribution when $H_0$ is true, the degrees of freedom are
"categories minus 1" or $(r - 1)(c - 1)$, and the approximation needs expected counts of at least 5.
This honors lesson explains where each fact comes from. You will see what a chi-square
distribution actually *is*, prove that the two-category test is exactly the z test squared, show
that the statistic averages exactly $k - 1$ under $H_0$, and learn the rule that changes the
degrees of freedom when the hypothesis has to be estimated from the data. The full proof for many
categories needs matrix algebra, so that one step is stated, not proved, and labeled as such.

## What a chi-square distribution is

Let $Z_1, Z_2, \dots, Z_k$ be independent standard normal variables. The distribution of

$$Z_1^2 + Z_2^2 + \cdots + Z_k^2$$

is the **chi-square distribution with $k$ degrees of freedom**. That is the definition; the
density curves in lesson 37 are just pictures of it. Three properties follow at once:

- *It can't be negative*, because it is a sum of squares.
- *Its mean is $k$.* Each $Z_i$ has mean 0 and variance 1, so $E(Z_i^2) = \text{Var}(Z_i) + 0^2 = 1$,
  and the $k$ terms add to $k$.
- *Its variance is $2k$.* For a standard normal $E(Z^4) = 3$, so $\text{Var}(Z^2) = 3 - 1^2 = 2$;
  independent terms add their variances.

With one degree of freedom, $\chi^2_1$ is just a squared z. So a chi-square critical value with
1 df is a squared z critical value: $1.96^2 = 3.8416$, the familiar 3.841 from the table. As $k$
grows, the sum of many independent terms becomes more symmetric (the Central Limit Theorem at
work again), which is why the curves lose their right skew.

```plot
{"x": [0, 20], "y": [0, 0.5], "xLabel": "value", "yLabel": "density", "functions": [{"f": "chi2pdf(x, 1)", "label": "df 1", "from": 0.05}, {"f": "chi2pdf(x, 2)", "label": "df 2"}, {"f": "chi2pdf(x, 4)", "label": "df 4"}, {"f": "chi2pdf(x, 8)", "label": "df 8", "dashed": true}], "caption": "Chi-square densities for 1, 2, 4 and 8 df: each is centered at its df and gets more symmetric as df grows"}
```

## Two categories: exactly the z test, squared

Take a goodness-of-fit test with two categories ("success" and "failure"), sample size $n$ and
null proportion $p_0$. Let $\hat{p}$ be the sample proportion. Then

- successes: $O_1 - E_1 = n\hat{p} - np_0 = n(\hat{p} - p_0)$,
- failures: $O_2 - E_2 = n(1 - \hat{p}) - n(1 - p_0) = -n(\hat{p} - p_0)$.

The two misses are equal and opposite (they must be, since both columns add to $n$). So

$$\chi^2 = n^2(\hat{p} - p_0)^2\left(\frac{1}{np_0} + \frac{1}{n(1 - p_0)}\right) = \frac{n(\hat{p} - p_0)^2}{p_0(1 - p_0)} = \left(\frac{\hat{p} - p_0}{\sqrt{p_0(1 - p_0)/n}}\right)^2 = z^2.$$

The middle step uses $\frac{1}{p_0} + \frac{1}{1 - p_0} = \frac{1}{p_0(1 - p_0)}$. When $n$ is large,
$z$ is approximately standard normal, so $\chi^2 = z^2$ is approximately $\chi^2_1$: two
categories, one degree of freedom. This also explains why each term is divided by $E$ rather than,
say, $E^2$: dividing by $E$ is what turns the squared misses into a squared *standardized* distance.

### Example 1

A supplier claims that 20% of its rail clips fail a stress inspection. In a random sample of 250
clips, 65 fail. Test the claim both ways.

1. *Chi-square*: expected counts $250(0.2) = 50$ fails and 200 passes. Observed 65 and 185.
   $\chi^2 = \dfrac{15^2}{50} + \dfrac{(-15)^2}{200} = 4.5 + 1.125 = 5.625$, df $= 1$.
2. *z test*: $\hat{p} = 65/250 = 0.26$, $SE = \sqrt{0.2(0.8)/250} = 0.0253$,
   $z = (0.26 - 0.20)/0.0253 = 2.372$.
3. *Compare*: $z^2 = 2.372^2 = 5.625$. ✓ The chi-square p-value $P(\chi^2_1 \ge 5.625) = 0.0177$
   equals the two-sided z p-value $2P(Z \ge 2.372) = 0.0177$.

Notice the uneven contributions: the same miss of 15 counts four times as much in the fail
category (expected 50) as in the pass category (expected 200).

## The general case (stated, not proved)

With $k$ categories, each standardized miss $(O_i - E_i)/\sqrt{E_i}$ is roughly normal for large
counts, but the $k$ of them are *not* independent: the misses always add to zero, because the
observed and expected counts both add to $n$. Karl Pearson proved in 1900 that this one linear
constraint costs exactly one dimension: for large $n$, the sum of the $k$ squared terms behaves
like a sum of $k - 1$ independent squared standard normals. That is the source of
df $= k - 1$. (The proof diagonalizes the covariance matrix of the counts; it is usually met in
a second course in mathematical statistics.)

One piece can be checked by hand, and it holds *exactly*, not just for large $n$. Under $H_0$
the count $O_i$ is binomial with mean $np_i$ and variance $np_i(1 - p_i)$, so

$$E\left[\frac{(O_i - np_i)^2}{np_i}\right] = \frac{np_i(1 - p_i)}{np_i} = 1 - p_i, \qquad E(\chi^2) = \sum_{i=1}^{k}(1 - p_i) = k - 1.$$

So under $H_0$ the statistic averages exactly its degrees of freedom, matching the mean of the
$\chi^2_{k-1}$ distribution.

### Example 2

For a fair-die test (6 faces), $E(\chi^2) = 6 - 1 = 5$: if many people each rolled a fair die 120
times and computed $\chi^2$, their values would average 5, with SD about $\sqrt{2 \times 5} = 3.2$
(using the variance of the $\chi^2_5$ approximation). Lesson 37's value, 6.5, is less than half
an SD above that average, which is why its p-value (0.26) was large. A value like 15 would be
more than 3 SDs above the average, and $P(\chi^2_5 \ge 15) \approx 0.010$.

## Degrees of freedom when the model is estimated

Sometimes $H_0$ names a *type* of model but not its parameters: "the counts follow a binomial
distribution" without saying $p$. Then $p$ must be estimated from the same data, and the fitted
expected counts sit closer to the observed ones than the true expected counts would. Fisher
showed (in papers of 1922 and 1924) that each parameter estimated from the counts costs one more
degree of freedom:

$$\text{df} = k - 1 - m, \qquad m = \text{number of parameters estimated}.$$

This one rule also explains the two-way table formula. An $r \times c$ table has $rc$ cells, so
$rc - 1$ df before any estimation. Independence is a model whose parameters are the row
proportions ($r - 1$ free values, since they add to 1) and the column proportions ($c - 1$ free
values), all estimated from the margins. So

$$\text{df} = (rc - 1) - (r - 1) - (c - 1) = rc - r - c + 1 = (r - 1)(c - 1).$$

Pearson himself had used $rc - 1$ for contingency tables; Fisher's correction started a famous
quarrel between them, which Fisher's side won.

*A caution (simplified here):* $k - 1 - m$ is exactly right when the parameters are estimated in
the most efficient way *from the grouped counts*. If they are estimated from the raw data and the
categories are then combined, the true distribution lies between $\chi^2_{k-1-m}$ and
$\chi^2_{k-1}$ (Chernoff and Lehmann, 1954). Checking the p-value with both df, as in the next
example, shows whether that matters.

### Example 3: is the number of defects binomial?

Inspectors check 100 boxes of 4 signal bulbs each and count the defective bulbs per box:

| Defective in box | 0 | 1 | 2 | 3 | 4 |
|---|---|---|---|---|---|
| Boxes | 45 | 28 | 17 | 7 | 3 |

If bulbs fail independently with the same probability, the count per box is binomial with
$n = 4$ and unknown $p$.

1. *Estimate $p$*: total defects $= 28 + 34 + 21 + 12 = 95$ out of 400 bulbs, so $\hat{p} = 0.2375$.
2. *Expected counts*: $100 \times P(X = x)$ with $X \sim B(4, 0.2375)$: 33.80, 42.12, 19.68, 4.09, 0.32.
3. *Large counts*: the last two are below 5 (even combined, 4.41), so combine 2, 3 and 4 into
   "2 or more": observed 27, expected 24.08.
4. *Statistic*: $\dfrac{(45 - 33.80)^2}{33.80} + \dfrac{(28 - 42.12)^2}{42.12} + \dfrac{(27 - 24.08)^2}{24.08} = 3.709 + 4.731 + 0.354 = 8.79$.
5. *df*: 3 categories, 1 parameter estimated: df $= 3 - 1 - 1 = 1$. p-value
   $= P(\chi^2_1 \ge 8.79) = 0.0030$. (With the cautious df $= 2$, p $= 0.012$; either way, reject at
   $\alpha = 0.05$.)
6. *Conclude*: the binomial model does not fit. There are too many boxes with no defects and too
   many with several. Defects cluster: bulbs in the same box probably share a batch or a rough
   shipment, so they don't fail independently.

If the supplier had *claimed* $p = 0.2$ instead, nothing would be estimated and df would be
$3 - 1 = 2$.

## Why "expected counts at least 5"

Everything above rests on each count being roughly normal, which is a large-count approximation
(like the large counts condition for $\hat{p}$). With small expected counts the statistic takes only
a few distinct values and its true distribution can differ noticeably from the chi-square curve,
usually making p-values too small. "All expected counts at least 5" is a safe working rule, and
the one this course uses. A more lenient rule often attributed to W. G. Cochran (1950s) allows up
to 20% of expected counts below 5 as long as none is below 1. When counts are too small, combine
categories (as in Example 3) or use an exact method (next lesson).

## Common mistakes

- Thinking df depends on $n$: it depends only on the number of categories and estimated parameters.
- Forgetting to subtract a degree of freedom for each parameter estimated from the data.
- Subtracting for parameters that $H_0$ *stated* (a claimed $p$ is not estimated).
- Counting categories before combining sparse ones: use the number actually in the test.
- Believing $\chi^2 = z^2$ for any table: it holds for two-category goodness of fit and for
  2 × 2 tables (pooled z), not for larger tables.

## Key points

- $\chi^2_k$ is the distribution of a sum of $k$ independent squared standard normals: mean $k$,
  variance $2k$; $\chi^2_1 = Z^2$, so $3.841 = 1.96^2$.
- Two categories: $\chi^2 = z^2$ exactly, so the GOF test equals the two-sided one-proportion z test.
- Under $H_0$, $E(\chi^2) = k - 1$ exactly; the constraint $\sum (O - E) = 0$ costs one df (Pearson, 1900).
- Estimating $m$ parameters: df $= k - 1 - m$ (Fisher); the two-way formula $(r - 1)(c - 1)$ is this
  rule applied to independence.
- The chi-square curve is a large-count approximation; small expected counts call for combining
  categories or an exact method.

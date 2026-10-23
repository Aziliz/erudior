---
id: stat-m7-h-student-t
module: stat-m7
honors: true
title: 'Where t comes from: degrees of freedom, robustness and prediction'
minutes: 45
topics: [The t distribution in depth]
drills: [stat-m7-r2-z-with-s, stat-m7-r2-prediction-interval, stat-m7-r2-welch-df]
refs: [stat-ref-inference]
---
## A brewer's small-sample problem

Lesson 31 introduced the t distributions as the fix for replacing $\sigma$ by $s$. This honors
lesson explains where they come from, how much the fix matters, how well t intervals hold up
when the population is not normal, and two related tools: an interval for a single future
value, and the degrees-of-freedom formula used for two samples.

The t distribution was worked out by William Sealy Gosset, a chemist at the Guinness brewery in
Dublin. His experiments on barley and yeast gave only a handful of measurements each, and he saw
that the usual normal-based reasoning with $s$ in place of $\sigma$ claimed more precision than
small samples deserve. He published the solution in 1908 in the journal *Biometrika* under the
pen name **Student**, which is why the distribution is still called Student's t. R. A. Fisher
later recast the result in the form used today.

## Degrees of freedom: why n − 1

The sample standard deviation is built from the deviations $x_i - \bar{x}$, and those deviations
always add to zero. Once you know any $n - 1$ of them, the last one is forced. So a sample of
$n$ values carries only $n - 1$ independent pieces of information about spread: its **degrees
of freedom**. Dividing the sum of squared deviations by $n - 1$ rather than $n$ makes $s^2$ an
unbiased estimator of $\sigma^2$ (lesson 05).

One subtlety: $s^2$ is unbiased, but $s$ is not. Square roots pull averages down, so on average
$s$ is a little smaller than $\sigma$; for samples of 5 from a normal population, the mean of $s$
is about $0.94\sigma$, and for samples of 10 about $0.97\sigma$. Small samples tend to
understate the spread, which is part of why their intervals need a larger multiplier.

## How t is built

For a sample from a normal population, three facts hold (stated here without proof):

1. $Z = \dfrac{\bar{x} - \mu}{\sigma/\sqrt{n}}$ is standard normal.
2. $\dfrac{(n-1)s^2}{\sigma^2}$ has a chi-square distribution with $n - 1$ degrees of freedom
   (you will use chi-square distributions for a different purpose in Module 9).
3. $\bar{x}$ and $s$ are independent. This is a special property of normal populations.

Dividing,

$$t = \frac{\bar{x} - \mu}{s/\sqrt{n}} = \frac{Z}{s/\sigma}.$$

So $t$ is a standard normal variable divided by an independent random "scale factor" $s/\sigma$
that hovers around 1. When a sample happens to have a small $s$, the factor is small and $t$ is
large. That is the source of the heavy tails, and the factor is most variable when df is small.
How heavy? With df = 4, $P(t > 3) \approx 0.020$, about 15 times the normal value
$P(Z > 3) \approx 0.00135$.

### Example 1: what z with s really delivers

An analyst has $n = 8$ measurements and builds $\bar{x} \pm 1.96\,s/\sqrt{8}$, calling it a 95%
interval. Its true coverage is the probability that a t variable with 7 df lands between $-1.96$
and $1.96$:

$$P(-1.96 < t_7 < 1.96) = 2\,\text{tcdf}(1.96, 7) - 1 \approx 0.909.$$

The interval is really about a 91% interval. The correct multiplier is $t^* = 2.365$, which
makes the interval $2.365/1.96 \approx 1.21$ times as wide. The table shows the same calculation
for other sample sizes (normal population).

| $n$ | 3 | 5 | 8 | 10 | 15 | 30 | 100 |
|---|---|---|---|---|---|---|---|
| Coverage of $\bar{x} \pm 1.96\,s/\sqrt{n}$ | 0.811 | 0.878 | 0.909 | 0.918 | 0.930 | 0.940 | 0.947 |
| Correct 95% $t^*$ | 4.303 | 2.776 | 2.365 | 2.262 | 2.145 | 2.045 | 1.984 |

```plot
{"x": [0, 32], "y": [0.78, 0.97], "grid": true, "xLabel": "sample size n", "yLabel": "coverage", "functions": [{"f": "0.95", "dashed": true}], "points": [{"at": [3, 0.811]}, {"at": [5, 0.878]}, {"at": [8, 0.909]}, {"at": [10, 0.918]}, {"at": [15, 0.930]}, {"at": [20, 0.935]}, {"at": [30, 0.940]}], "labels": [{"at": [24, 0.957], "text": "target 0.95"}, {"at": [11, 0.86], "text": "x̄ ± 1.96·s/√n"}], "caption": "True coverage of the 'z with s' interval for a normal population; the t interval gets exactly 0.95"}
```

## How robust is the t interval?

The derivation assumes a normal population. To see what happens otherwise, a computer drew 200,000
samples for each case below and recorded how often the 95% t interval captured $\mu$. These are
simulation results, accurate to about ±0.001.

| Population | $n = 5$ | $n = 10$ | $n = 30$ | $n = 100$ |
|---|---|---|---|---|
| Normal | 0.950 | 0.950 | 0.950 | 0.949 |
| Uniform (flat, symmetric) | 0.934 | 0.946 | 0.949 | 0.950 |
| Exponential (strongly right-skewed) | 0.883 | 0.902 | 0.926 | 0.942 |
| Normal with 5% wild values (SD 10 instead of 1) | 0.958 | 0.964 | 0.971 | 0.962 |

What the table shows:

- *Symmetric populations without outliers are no problem*, even for quite small $n$.
- *Strong skew is a problem, and $n \ge 30$ does not fully cure it.* The exponential population
  still gives only 92.6% coverage at $n = 30$. The misses are also lopsided: at $n = 10$, 9.5% of
  the intervals lie entirely below $\mu$ and only 0.4% entirely above. In right-skewed data, a
  sample that misses the long tail has both a small $\bar{x}$ and a small $s$, so its interval
  is too low and too short at the same time.
- *Outliers make intervals wide.* With rare wild values the coverage is above 95%, but only
  because those values inflate $s$: the population SD is $\sqrt{0.95(1) + 0.05(100)} \approx 2.44$
  instead of 1, so the intervals are about 2.4 times as wide as they would be without the wild
  values. In a single small sample, one outlier can also drag $\bar{x}$ far from the center of
  the rest of the data.

This is the evidence behind the core lesson's rule: the "$n \ge 30$" guideline is about
mild skew, and graphs of the data matter more than any single cutoff.

## Prediction intervals: where will the next value fall?

A confidence interval estimates the *mean*. A **prediction interval** answers a different
question: where will one *new* observation from the same population fall? A new value $X$
varies around $\mu$ with variance $\sigma^2$, and $\bar{x}$ misses $\mu$ with variance
$\sigma^2/n$. They are independent, so the variances add:
$\text{Var}(X - \bar{x}) = \sigma^2 + \sigma^2/n$. Estimating $\sigma$ by $s$ gives

$$\bar{x} \pm t^*\, s\sqrt{1 + \frac{1}{n}}, \qquad \text{df} = n - 1.$$

### Example 2: the next freight train

Lesson 31's sample of 16 freight trains had $\bar{x} = 31.2$ min and $s = 4.8$ min, with
95% confidence interval (28.64, 33.76) for the mean loading time. For the next train:

1. df = 15, $t^* = 2.131$.
2. Margin: $2.131(4.8)\sqrt{1 + 1/16} = 10.229(1.0308) \approx 10.54$ min.
3. Prediction interval: $31.2 \pm 10.54 = (20.66, 41.74)$ min.

The prediction interval is about four times as wide. More data shrink the confidence interval
toward a single point, but as $n$ grows the prediction interval only settles toward about
$\mu \pm 1.96\sigma$, because individual trains vary. Two cautions: the prediction interval
needs a *normal population* even when $n$ is large (the CLT is about averages, not single
values), and it describes one future value, not 95% of all future values.

## Welch's degrees of freedom

For two independent samples, lesson 32 used the statistic with standard error
$\sqrt{s_1^2/n_1 + s_2^2/n_2}$ and said technology chooses the df. That formula comes from
the **Welch–Satterthwaite approximation** (Satterthwaite 1946, Welch 1947): pick the df of the
single t distribution whose behavior best matches this combination of two variance estimates.
Writing $a = s_1^2/n_1$ and $b = s_2^2/n_2$,

$$\text{df} = \frac{(a + b)^2}{\dfrac{a^2}{n_1 - 1} + \dfrac{b^2}{n_2 - 1}}.$$

The result always lies between $\min(n_1, n_2) - 1$ and $n_1 + n_2 - 2$. That is why the
conservative choice $\min(n_1, n_2) - 1$ is safe: it is the worst case.

### Example 3: when one group dominates

Group 1: $n_1 = 10$, $s_1 = 12$. Group 2: $n_2 = 25$, $s_2 = 4$.

1. $a = 144/10 = 14.4$ and $b = 16/25 = 0.64$, so almost all of the uncertainty comes from group 1.
2. df $= \dfrac{(15.04)^2}{14.4^2/9 + 0.64^2/24} = \dfrac{226.20}{23.04 + 0.0171} \approx 9.81$.

The df is close to $n_1 - 1 = 9$, because the interval is only as reliable as the noisy small
group. Compare lesson 32's Example 2, where the two groups contributed similar amounts
($a = 1.54$, $b = 1.88$) and the df was about 53.0, the maximum $n_1 + n_2 - 2 = 53$.

## Common mistakes

- Using $z^*$ with $s$ for small samples: a "95%" interval with $n = 8$ is really about 91%.
- Believing $n \ge 30$ makes t procedures exact for any population. With strong skew, coverage
  can still be a few points short, and the misses fall mostly on one side.
- Reporting a confidence interval when the question asks where a single value will fall, or
  using a prediction interval for a non-normal population.
- Forgetting the 1 in $\sqrt{1 + 1/n}$, which turns a prediction interval back into a confidence
  interval.
- Thinking Welch df can be below $\min(n_1, n_2) - 1$ or above $n_1 + n_2 - 2$.

## Key points

- Student (W. S. Gosset, 1908) found the t distribution; $t = Z/(s/\sigma)$ for normal data.
- Degrees of freedom $n - 1$: deviations sum to zero, so only $n - 1$ are free.
- True coverage of $\bar{x} \pm 1.96\,s/\sqrt{n}$ is $2\,\text{tcdf}(1.96, n-1) - 1$, below 95%.
- t intervals are robust to symmetric non-normality, weaker under strong skew (lopsided misses),
  and outliers inflate $s$.
- Prediction interval for one new value: $\bar{x} \pm t^* s\sqrt{1 + 1/n}$ (normal population).
- Welch df lies between $\min(n_1, n_2) - 1$ and $n_1 + n_2 - 2$.

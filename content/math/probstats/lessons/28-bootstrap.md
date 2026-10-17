---
id: ps-bootstrap
module: ps-m6
title: The bootstrap and resampling
minutes: 40
topics: [Bootstrap and resampling]
drills: [ps-d-boot-se-mean, ps-d-boot-median3, ps-d-permutation-p]
refs: [ps-ref-estimation]
---
## When there is no formula

Every interval in the last lesson rested on a pivot whose distribution we could write down:
normal, $t$, chi-square. That works for means and variances of normal samples, but what is the
standard error of a sample *median* from a skewed population? Of a ratio of two means, or a
trimmed mean? The sampling distribution depends on the unknown population in ways no table
covers. The **bootstrap**, introduced by Bradley Efron in 1979, replaces the missing algebra with
computation: it estimates a sampling distribution by resampling the data we already have.

## The plug-in idea

A statistic $\hat\theta$ has a sampling distribution because the data come from an unknown population
distribution $F$. If we knew $F$, we could simulate thousands of samples from it, compute $\hat\theta$ for
each, and read off the standard error directly. We don't know $F$, but we have a good estimate of
it: the **empirical distribution** $\hat F_n$, which puts probability $1/n$ on each observed value
$x_1, \dots, x_n$. By the law of large numbers $\hat F_n(x) \to F(x)$ for every $x$.

The **plug-in principle** says: to learn how $\hat\theta$ behaves when samples come from $F$, study how it
behaves when samples come from $\hat F_n$. Drawing a sample of size $n$ from $\hat F_n$ means drawing $n$
values from the data *with replacement*. The result is a **bootstrap sample** $x_1^*, \dots, x_n^*$; some
original values appear twice or more and others not at all. (Any particular observation is
left out with probability $(1 - 1/n)^n \approx e^{-1} \approx 0.368$, so a bootstrap sample contains about 63% of the
distinct original values.) The statistic computed from it, $\hat\theta^*$, is a **bootstrap replicate**.

## Bootstrap standard errors

The algorithm:

1. Draw a bootstrap sample of size $n$ from the data, with replacement.
2. Compute the replicate $\hat\theta^*$ on it.
3. Repeat $B$ times, giving $\hat\theta^*_1, \dots, \hat\theta^*_B$.
4. The **bootstrap standard error** is the standard deviation of the replicates,
   $$\widehat{\text{SE}}_{\text{boot}} = \sqrt{\frac{1}{B-1}\sum_{b=1}^B\big(\hat\theta^*_b - \bar\theta^*\big)^2}, \qquad \bar\theta^* = \frac1B\sum_b\hat\theta^*_b.$$

The difference $\bar\theta^* - \hat\theta$ estimates the bias of $\hat\theta$, by the same plug-in logic. A few hundred to
a couple of thousand replicates are plenty for a standard error. Two separate errors are at play:
*sampling error*, because $\hat F_n$ is not $F$ (more data is the only cure), and *Monte Carlo error*,
because $B$ is finite (more computing cures it). Resampling cannot create information the
sample does not contain.

### Example 1: the bootstrap reproduces a known answer

Take the sample mean, where we know the truth. Under $\hat F_n$ a single draw $X^*$ has mean $\bar x$ and
variance $\hat\sigma^2 = \frac1n\sum(x_i - \bar x)^2$ (the plug-in variance, dividing by $n$). A bootstrap sample is $n$ iid draws, so as
$B \to \infty$ the bootstrap SE of $\bar x^*$ tends to

$$\frac{\hat\sigma}{\sqrt n} = \sqrt{\frac{n-1}{n}}\cdot\frac{s}{\sqrt n}.$$

For the data $3, 5, 6, 10$: $\bar x = 6$, the squared deviations sum to $9 + 1 + 0 + 16 = 26$, so $\hat\sigma^2 = 6.5$
and the ideal bootstrap SE is $\sqrt{6.5/4} \approx 1.275$. The usual $s/\sqrt n = \sqrt{(26/3)/4} \approx 1.472$ is a bit larger; the
bootstrap matches it up to the factor $\sqrt{(n-1)/n}$, which matters only for tiny samples. The reassuring
point is that the method gets the right answer when we can check it.

### Example 2: an exact bootstrap distribution for a median

With three observations $2, 5, 9$ there are $3^3 = 27$ equally likely ordered bootstrap samples, few
enough to list by type.

1. *Median 2* needs at least two 2s: $\binom32 \cdot 2 = 6$ samples with exactly two, plus $(2, 2, 2)$: probability $7/27$.
2. *Median 9*: likewise $7/27$.
3. *Median 5*: the remaining $13/27$.
4. Mean of the replicates: $(2 \cdot 7 + 5 \cdot 13 + 9 \cdot 7)/27 = 142/27 \approx 5.259$, so the estimated bias of the
   median is $5.259 - 5 = 0.259$.
5. $E[(\text{median}^*)^2] = (4 \cdot 7 + 25 \cdot 13 + 81 \cdot 7)/27 = 920/27 \approx 34.074$, so the bootstrap SE is
   $\sqrt{34.074 - 5.259^2} \approx 2.53$.

Real samples are larger. For $n = 15$ there are $\binom{29}{15} \approx 7.8 \times 10^7$ distinct bootstrap samples (ignoring
order), so in practice we draw $B$ of them at random, which is Monte Carlo approximation of the
exact bootstrap distribution.

## Percentile intervals

The replicates estimate the whole sampling distribution, not just its spread, so they also give
confidence intervals. The simplest is the **percentile interval**: for $100(1-\alpha)\%$ confidence, take the
$\alpha/2$ and $1 - \alpha/2$ quantiles of the replicates. With $B = 2000$ and 95%, that is roughly the 50th and
the 1950th smallest replicate. An alternative is the normal-based interval $\hat\theta \pm z_{\alpha/2}\,\widehat{\text{SE}}_{\text{boot}}$,
sensible when the replicates look roughly normal.

### Example 3: median repair time

Fifteen repair times (hours) on a rail line: 0.6, 0.8, 0.9, 1.1, 1.2, 1.5, 1.7, 2.0, 2.1, 2.3, 2.8, 3.5,
4.2, 5.9, 9.4. The data are strongly right-skewed, so the median, 2.0 hours, is a better summary
than the mean, 2.67, and there is no simple formula for its standard error.

1. Draw $B = 2000$ bootstrap samples of size 15 and record each median.
2. In one run, the replicates had standard deviation 0.49: $\widehat{\text{SE}}_{\text{boot}} \approx 0.49$ hours.
3. The 2.5th and 97.5th percentiles of the replicates were 1.2 and 3.5, so the 95% percentile
   interval is $(1.2,\; 3.5)$ hours.

```plot
{"x": [0.4, 5.2], "y": [0, 480], "xLabel": "median (hours)", "yLabel": "count of 2000", "bars": [{"x": 0.9, "height": 5, "width": 0.09}, {"x": 1.1, "height": 44, "width": 0.09}, {"x": 1.2, "height": 127, "width": 0.09}, {"x": 1.5, "height": 270, "width": 0.09}, {"x": 1.7, "height": 361, "width": 0.09}, {"x": 2.0, "height": 439, "width": 0.09}, {"x": 2.1, "height": 346, "width": 0.09}, {"x": 2.3, "height": 241, "width": 0.09}, {"x": 2.8, "height": 112, "width": 0.09}, {"x": 3.5, "height": 46, "width": 0.09}, {"x": 4.2, "height": 8, "width": 0.09}], "segments": [{"from": [1.2, 0], "to": [1.2, 460], "dashed": true}, {"from": [3.5, 0], "to": [3.5, 460], "dashed": true}], "caption": "2000 bootstrap medians of the 15 repair times (one more replicate fell at 5.9). The median of a resample is always one of the data values, so the replicates pile up on them; dashed lines mark the 95% percentile interval 1.2 to 3.5"}
```

The interval is lopsided around 2.0, reflecting the long right tail. Because the replicates take
only data values, a rerun can move an endpoint to a neighboring value (the lower end sits near
1.1 or 1.2); that is Monte Carlo error, and larger $B$ settles it.

## Limits and variants

- *Small samples.* $\hat F_n$ is a rough copy of $F$ when $n$ is small, and percentile intervals then
  tend to cover less often than advertised. Refinements such as the bias-corrected (BCa) and
  bootstrap-$t$ intervals fix much of this; software provides them.
- *Statistics at the edge of the data.* For the maximum, a bootstrap sample reproduces the
  sample maximum with probability $1 - (1 - 1/n)^n \approx 0.632$, so the bootstrap distribution is mostly a single
  spike, nothing like the true continuous distribution of $X_{(n)}$. The bootstrap fails here.
- *Resample the way the data were generated.* For paired data, resample pairs; for two independent
  groups, resample within each group. Plain resampling of time-ordered data destroys dependence.
- In a **parametric bootstrap** we fit a model and resample from it instead, for example drawing
  samples from Exponential$(\hat\lambda)$ rather than from the data.

## A preview: shuffling for tests

Resampling also tests hypotheses, with a different kind of shuffle. Suppose groups A and B are
compared by the difference in means. If the null hypothesis says the group labels make no
difference, every way of assigning the same values to groups of the same sizes was equally likely.
A **permutation test** recomputes the difference for each relabeling (or for thousands of random
ones) and asks what fraction is at least as large as the observed difference; that fraction is the
p-value, formalized in the next module. For A $= 13, 15, 17$ and B $= 10, 11, 14$ there are $\binom63 = 20$ ways to
choose which three values are labeled A. Since the total is fixed, a larger difference in means is the
same as a larger A sum. The observed A sum is 45, and only one other split reaches it: $\{14, 15, 17\}$, with
sum 46. The one-sided p-value is $2/20 = 0.10$, so a difference this large is not unusual when labels are arbitrary.

Note the contrast. The bootstrap draws *with replacement* to mimic sampling variability, and builds
intervals. A permutation test reshuffles *without replacement* under the null, and builds tests.
The nonparametric lesson at the end of the course returns to permutation tests.

## Common mistakes

- *Resampling without replacement.* That just reorders the data, and every replicate of a
  symmetric statistic equals $\hat\theta$.
- *Using a bootstrap sample of the wrong size.* Each resample has the original $n$.
- *Thinking a larger $B$ shrinks the standard error.* $B$ reduces Monte Carlo noise; the SE itself is
  set by $n$.
- *Trusting the bootstrap for extremes or tiny samples*, where $\hat F_n$ is a poor stand-in for $F$.
- *Confusing the two shuffles*: with replacement for intervals, without replacement for permutation tests.

## Key points

- Empirical distribution: mass $1/n$ on each observation; bootstrap samples are $n$ draws from the data with replacement.
- Bootstrap SE = SD of $B$ replicates $\hat\theta^*_b$; bias estimate $\bar\theta^* - \hat\theta$.
- For the mean the ideal bootstrap SE is $\hat\sigma/\sqrt n$, the plug-in version of $s/\sqrt n$.
- 95% percentile interval: the 2.5th and 97.5th percentiles of the replicates.
- Fails for extremes such as the maximum; small $n$ gives undercoverage; resample as the data were sampled.
- Permutation tests reshuffle labels without replacement under $H_0$.

---
id: ps-m6-h-proportion-intervals
module: ps-m6
honors: true
title: 'Intervals for a proportion: coverage under the microscope'
minutes: 45
topics: [Intervals for a proportion]
drills: [ps-m6-r2-wilson, ps-m6-r2-zero-successes, ps-m6-r2-wald-coverage]
refs: [ps-ref-estimation]
---
## A textbook interval with a hidden flaw

The confidence-interval lesson gave the large-sample interval $\hat p \pm z_{\alpha/2}\sqrt{\hat p(1 - \hat p)/n}$ and warned that it
needs $n\hat p$ and $n(1 - \hat p)$ to be reasonably large. That warning understates the problem. This interval,
called the **Wald interval** for a proportion because it is the Wald interval of the Fisher information
lesson applied to binomial data, can miss far more often than 5% of the time even with
hundreds of observations, and its performance changes erratically as $n$ grows. Because estimating
a proportion is one of the most common tasks in statistics (defect rates, failure probabilities,
survey shares), the question of which interval to use was studied closely; an influential 2001
review by Brown, Cai and DasGupta set out the evidence. This lesson shows how to *compute* the
true coverage of an interval for discrete data, why the Wald interval fails, and four better
intervals, each tied to an idea from this module.

## Exact coverage for discrete data

For a fixed true $p$, the count $X$ takes only the values $0, 1, \dots, n$, and each value $x$ produces one interval.
So the actual **coverage probability** of a method is a finite sum:

$$C(p) = \sum_{x=0}^n \mathbf 1\{p \in \text{interval}(x)\}\binom{n}{x}p^x(1 - p)^{n-x}.$$

The nominal level, say 95%, is a promise about $C(p)$. A method is honest if $C(p)$ stays close to
0.95 for all $p$, and **conservative** if $C(p) \ge 0.95$ everywhere (at the cost of wider intervals).

Because the indicator switches on and off as $p$ crosses interval endpoints, $C(p)$ is a jagged function
of $p$, never exactly 0.95 for all $p$ at once. Discreteness makes some oscillation unavoidable; the
question is how far below 0.95 the dips go.

### Example 1: Wald coverage by hand

Take $n = 5$ and true $p = 0.3$. The Wald intervals for $x = 0, \dots, 5$ are:

| $x$ | $\hat p$ | interval | contains 0.3? | $P(X = x)$ |
|---|---|---|---|---|
| 0 | 0 | $[0, 0]$ | no | 0.1681 |
| 1 | 0.2 | $(-0.151, 0.551)$ | yes | 0.3602 |
| 2 | 0.4 | $(-0.029, 0.829)$ | yes | 0.3087 |
| 3 | 0.6 | $(0.171, 1.029)$ | yes | 0.1323 |
| 4 | 0.8 | $(0.449, 1.151)$ | no | 0.0284 |
| 5 | 1 | $[1, 1]$ | no | 0.0024 |

The coverage is $0.3602 + 0.3087 + 0.1323 = 0.8012$, not 0.95. The failures are built in: when $x = 0$
the estimated variance is 0 and the "interval" is the single point 0, which can never contain a
positive $p$. Notice too the endpoints below 0 and above 1, which are impossible values.

## Why the Wald interval fails

The Wald interval uses the pivot $(\hat p - p)/\sqrt{\hat p(1 - \hat p)/n}$, with the variance estimated *at $\hat p$*. Slutsky's theorem
(the honors lesson on modes of convergence) shows that this pivot tends to $N(0, 1)$, but only as $n \to \infty$; it says nothing
about how large $n$ must be. At realistic $n$, two things go wrong. Near $p = 0$ or 1, $\hat p$ is often 0 or 1 or close to it, so the estimated variance is badly
underestimated and the interval is far too short. And the binomial distribution of $\hat p$ is skewed when
$p$ is away from 0.5, while the interval is symmetric about $\hat p$.

The picture shows the exact coverage for $n = 20$. The Wald curve sits mostly below 0.95 and collapses
near the ends: at $p = 0.1$ the coverage is 0.876, and at $p = 0.05$ it is 0.639. More data do not cure it
smoothly. At $p = 0.2$, the coverage is 0.951 with $n = 23$ but 0.873 with $n = 24$; at $p = 0.005$ it is 0.945 with
$n = 591$ and 0.792 with $n = 592$. Adding one observation can cost 15 percentage points of coverage.

![Exact coverage of three 95% intervals for a proportion with n = 20, plotted against the true p from 0 to 1, with a dashed line at 0.95. Wald: jagged, mostly between about 0.81 and 0.95, falling off the bottom of the chart (below 0.75) near p = 0 and p = 1. Wilson: jagged around 0.95, mostly between about 0.92 and 0.98, dipping to about 0.85 very close to 0 and 1. Clopper–Pearson: always above 0.95, mostly between 0.96 and 0.99.](images/ps-m6-h-coverage.svg)

## The Wilson interval: don't substitute

The lesson on intervals mentioned the **Wilson interval** (Edwin Wilson, 1927): keep the true $p$ in the
standard error and solve the pivot inequality for $p$. Squaring $|\hat p - p| \le z\sqrt{p(1 - p)/n}$ gives a quadratic
inequality in $p$,

$$\Big(1 + \frac{z^2}{n}\Big)p^2 - \Big(2\hat p + \frac{z^2}{n}\Big)p + \hat p^2 \le 0,$$

whose roots are the endpoints:

$$\frac{\hat p + \dfrac{z^2}{2n}}{1 + \dfrac{z^2}{n}} \;\pm\; \frac{z}{1 + \dfrac{z^2}{n}}\sqrt{\frac{\hat p(1 - \hat p)}{n} + \frac{z^2}{4n^2}}, \qquad z = z_{\alpha/2}.$$

Its center is pulled from $\hat p$ toward $\tfrac12$, its endpoints always lie in $[0, 1]$, and it has positive width
even when $x = 0$. (Because it keeps the null value $p$ in the standard error, it is also the interval obtained from the
score test; the honors lesson on Wald, score and likelihood ratio tests in the testing module shows this.) Its coverage hovers near the nominal level (the middle panel), with brief dips
very close to 0 and 1.

## Agresti–Coull: add two successes and two failures

The center of the 95% Wilson interval is $(x + z^2/2)/(n + z^2)$, and $z^2 = 1.96^2 \approx 4$. Agresti and Coull (1998)
turned this into a rule that is easy to remember: add 2 successes and 2 failures, then use the Wald
formula. With $\tilde n = n + 4$ and $\tilde p = (x + 2)/\tilde n$, the **Agresti–Coull interval** is

$$\tilde p \pm 1.96\sqrt{\frac{\tilde p(1 - \tilde p)}{\tilde n}}.$$

It is slightly wider than Wilson's, and its coverage tends to run a little above the nominal level
(though not at every $p$, so it is not conservative in the strict sense above). It is an excellent choice for hand
calculation when $n$ is moderate or large.

## Clopper–Pearson: invert exact tests

The **Clopper–Pearson interval** (1934) uses the binomial distribution directly. Its lower endpoint $p_L$ is the
value of $p$ at which seeing $x$ or more successes has probability exactly $\alpha/2$, and its upper endpoint $p_U$
is where seeing $x$ or fewer has probability $\alpha/2$:

$$P(X \ge x;\, p_L) = \frac\alpha2, \qquad P(X \le x;\, p_U) = \frac\alpha2,$$

with $p_L = 0$ when $x = 0$ and $p_U = 1$ when $x = n$. Each endpoint is the boundary of an exact one-sided test at
level $\alpha/2$, so this is the interval obtained by inverting tests; the testing module develops that
correspondence. Using the link between binomial tails and the beta distribution, the endpoints are beta
quantiles: $p_L$ is the $\alpha/2$ quantile of Beta$(x, n - x + 1)$ and $p_U$ the $1 - \alpha/2$ quantile of Beta$(x + 1, n - x)$.

Clopper–Pearson is often called "exact", but the word describes its construction, not its coverage:
its coverage is *at least* $1 - \alpha$ for every $p$ (bottom panel), and typically well above it, so the intervals
are wider than they need to be.

## Jeffreys: a Bayesian interval with good frequentist coverage

The Bayesian lesson's beta–binomial model gives one more option. With the prior Beta$(\tfrac12, \tfrac12)$, known
as Jeffreys' prior, the posterior is Beta$(x + \tfrac12,\; n - x + \tfrac12)$, and its equal-tailed 95% credible interval is the
**Jeffreys interval**. Judged as a confidence interval, its coverage behaves much like Wilson's. Brown,
Cai and DasGupta recommended the Wilson or Jeffreys interval for small $n$ (up to about 40) and
Agresti–Coull for larger $n$.

### Example 2: two defective fasteners in twenty

An inspection finds $x = 2$ defective fasteners among $n = 20$, so $\hat p = 0.1$. The 95% intervals:

1. *Wald:* $0.1 \pm 1.96\sqrt{0.1 \times 0.9/20} = 0.1 \pm 0.1315$, or $(-0.031,\; 0.231)$: an impossible negative endpoint.
2. *Wilson:* $z^2/n = 3.8415/20 = 0.1921$. Center $(0.1 + 0.0960)/1.1921 = 0.1644$. Half-width
   $\dfrac{1.96}{1.1921}\sqrt{0.0045 + 0.0024} = 1.6442 \times 0.0831 = 0.1366$. Interval $(0.028,\; 0.301)$.
3. *Agresti–Coull:* $\tilde p = 4/24 = 0.1667$, half-width $1.96\sqrt{0.1667 \times 0.8333/24} = 0.1491$, interval $(0.018,\; 0.316)$.
4. *Clopper–Pearson* (beta quantiles by software): $(0.012,\; 0.317)$. *Jeffreys:* $(0.021,\; 0.284)$.

All the better intervals are asymmetric about 0.1, reaching much further up than down, which matches the
right skew of the binomial when $p$ is small. The Wald interval is the outlier.

### Example 3: zero failures

A new brake component passes all $n = 30$ stress tests: $x = 0$. The Wald interval is the point $[0, 0]$, which
claims certainty that the failure probability is zero.

1. *Exact upper bound.* The 95% one-sided upper bound is the $p$ at which zero failures in 30 has probability
   0.05: $(1 - p)^{30} = 0.05$, so $p_U = 1 - 0.05^{1/30} \approx 0.0950$.
2. *The rule of three.* Since $\ln(1 - p) \approx -p$ for small $p$, the equation becomes $e^{-30p} \approx 0.05$, so
   $p_U \approx -\ln(0.05)/30 \approx 2.996/30 \approx 3/30 = 0.1$. In general, after $n$ trials with no events, about $3/n$ is a 95% upper
   bound: the **rule of three**. (For a two-sided 95% interval use 0.025 in place of 0.05: $1 - 0.025^{1/30} \approx 0.116$.)
3. *Wilson* gives $(0,\; 0.114)$, close to the exact two-sided answer.

Thirty clean tests show only that the failure probability is probably below about 10%.

## Common mistakes

- *Trusting the Wald interval because $n$ looks large.* Its coverage is erratic in $n$ and poor near 0 and 1.
- *Reporting $[0, 0]$ after zero successes.* Use an exact bound, the rule of three, or Wilson.
- *Calling Clopper–Pearson "exact" in the sense of exactly 95%.* It guarantees *at least* 95% and is usually wider.
- *Truncating a Wald interval at 0 or 1 and calling it fixed.* The truncated interval still has the same poor coverage.
- *Using $1 - \alpha^{1/n}$ when a two-sided interval is wanted.* The two-sided upper endpoint uses $\alpha/2$.

## Key points

- Coverage for discrete data: $C(p) = \sum_x \mathbf 1\{p \in \text{interval}(x)\}P(X = x)$, a jagged function of $p$.
- Wald $\hat p \pm z\sqrt{\hat p(1 - \hat p)/n}$: undercovers, especially near 0 and 1, erratically in $n$.
- Wilson: solve the pivot inequality for $p$; center $(\hat p + z^2/2n)/(1 + z^2/n)$; good coverage.
- Agresti–Coull (95%): add 2 successes and 2 failures, then use the Wald formula.
- Clopper–Pearson: invert exact binomial tests; coverage always at least $1 - \alpha$.
- Jeffreys: Beta$(x + \tfrac12, n - x + \tfrac12)$ quantiles. Zero events in $n$ trials: 95% upper bound $\approx 3/n$.

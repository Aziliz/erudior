---
id: stat-ci-prop
module: stat-m7
title: Confidence intervals for a proportion
minutes: 35
topics: [Confidence intervals for proportions]
drills: [stat-ci-prop, stat-moe-prop, stat-sample-size-prop]
refs: [stat-ref-inference, stat-ref-which-test]
---
## From a statistic to a range of plausible values

A poll finds 45% support for a ballot measure. The true population proportion is almost
certainly *not* exactly 45% — but how far off could it be? A confidence interval answers
with a range of plausible values and a measure of how reliable the method is. This lesson
builds the interval for a proportion from the sampling distribution of $\hat{p}$ in
lesson 27.

## The idea

From lesson 27, $\hat{p}$ is approximately normal with mean $p$ and standard deviation
$\sqrt{p(1-p)/n}$. So in about 95% of samples, $\hat{p}$ lands within $1.96$ standard
deviations of $p$. Turn that around: in 95% of samples, $p$ is within $1.96$ standard
deviations of $\hat{p}$. The interval

$$\hat{p} \pm 1.96\,\sigma_{\hat{p}}$$

therefore captures $p$ for 95% of all possible samples.

One problem: $\sigma_{\hat{p}}$ involves the unknown $p$. Replace $p$ by $\hat{p}$ to get the
**standard error**:

$$SE_{\hat{p}} = \sqrt{\frac{\hat{p}(1-\hat{p})}{n}}.$$

A standard error is an estimate, from the data, of the standard deviation of a statistic.

## The one-proportion z interval

$$\hat{p} \pm z^*\sqrt{\frac{\hat{p}(1-\hat{p})}{n}}$$

Every confidence interval in this course has the same structure:

$$\text{point estimate} \pm \text{margin of error}, \qquad \text{margin of error} = (\text{critical value}) \times (\text{standard error}).$$

The **point estimate** is the single best guess ($\hat{p}$). The **margin of error** says how
far the estimate is likely to be from the truth. The **critical value** $z^*$ is chosen so
that the middle area under the standard normal curve equals the **confidence level** $C$:

| Confidence level | 90% | 95% | 99% |
|---|---|---|---|
| $z^*$ | 1.645 | 1.960 | 2.576 |

For level $C$, $z^* = \Phi^{-1}\!\left(\frac{1 + C}{2}\right)$; for 95%, $\Phi^{-1}(0.975) = 1.96$.

## Conditions

1. **Random**: the data come from a random sample (or randomized experiment).
2. *10%*: when sampling without replacement, $n \le 0.10N$.
3. **Large counts**: at least 10 successes and 10 failures: $n\hat{p} \ge 10$ and
   $n(1 - \hat{p}) \ge 10$.

The random condition is the important one; no formula can fix a biased sample. The margin
of error covers *only* sampling variability — not undercoverage, nonresponse or bad
wording.

### Example 1

In an SRS of 1,200 voters, 540 support a measure. Construct a 95% confidence interval for
the proportion of all voters who support it.

1. *State*: parameter $p$ = proportion of all voters who support the measure; 95% confidence.
2. *Plan*: one-proportion z interval. Random ✓ (SRS); 10%: surely more than 12,000 voters ✓;
   large counts: 540 and 660 both $\ge 10$ ✓.
3. *Do*: $\hat{p} = 540/1200 = 0.45$; $SE = \sqrt{0.45(0.55)/1200} \approx 0.01436$;
   $ME = 1.96(0.01436) \approx 0.0281$. Interval: $0.45 \pm 0.0281 = (0.422, 0.478)$.
4. *Conclude*: We are 95% confident that between 42.2% and 47.8% of all voters support the
   measure.

Since every plausible value is below 50%, the data give convincing evidence that a
majority does *not* support it.

## Interpreting confidence

Two different statements, both important:

- *Interpreting the interval*: "We are 95% confident that the interval from 0.422 to
  0.478 captures the true proportion of voters who support the measure."
- *Interpreting the confidence level*: "If we took many random samples of 1,200 voters and
  built a 95% interval from each, about 95% of those intervals would capture the true
  proportion."

What it does *not* mean: there is not a 95% probability that $p$ lies in *this* interval.
$p$ is a fixed number; this interval either contains it or doesn't. The 95% describes the
long-run success rate of the *method*.

```plot
{"x": [0.38, 0.56], "y": [0, 11], "grid": false, "segments": [{"from": [0.45, 0], "to": [0.45, 11], "dashed": true}, {"from": [0.42, 1], "to": [0.476, 1]}, {"from": [0.43, 2], "to": [0.486, 2]}, {"from": [0.405, 3], "to": [0.461, 3]}, {"from": [0.437, 4], "to": [0.493, 4]}, {"from": [0.452, 5], "to": [0.508, 5], "color": "#c53030"}, {"from": [0.418, 6], "to": [0.474, 6]}, {"from": [0.426, 7], "to": [0.482, 7]}, {"from": [0.412, 8], "to": [0.468, 8]}, {"from": [0.441, 9], "to": [0.497, 9]}, {"from": [0.424, 10], "to": [0.48, 10]}], "labels": [{"at": [0.45, 0.4], "text": "true p"}], "caption": "Ten 95% intervals from ten samples; one (red) misses the true p"}
```

## What controls the margin of error

$$ME = z^*\sqrt{\frac{\hat{p}(1-\hat{p})}{n}}$$

- *Higher confidence → wider interval*. More confidence requires a larger $z^*$.
- *Larger sample → narrower interval,* but only like $1/\sqrt{n}$: quadrupling $n$ halves
  the margin of error.
- $\hat{p}(1-\hat{p})$ is largest at $\hat{p} = 0.5$, so proportions near 50% have the widest
  intervals.

## Choosing the sample size

To get a margin of error of at most $M$ at confidence level $C$, solve
$z^*\sqrt{p^*(1-p^*)/n} \le M$:

$$n \ge \left(\frac{z^*}{M}\right)^2 p^*(1 - p^*),$$

where $p^*$ is a guess for $p$ from past data. With no guess, use $p^* = 0.5$, which gives the
largest (safest) $n$. *Always round up*.

### Example 2

How many voters should be surveyed for a 95% margin of error of at most 3 percentage points?

$n \ge (1.96/0.03)^2(0.5)(0.5) = 1067.1$, so survey *1,068* voters. This is why national
polls often use about 1,000–1,100 respondents.

### Example 3

A railway believes about 12% of tickets are bought on board. For a 99% margin of error of
2 points: $n \ge (2.576/0.02)^2(0.12)(0.88) \approx 1751.8$, so $n = 1752$.

### Example 4: reading a published poll

A news report says: "52% of likely voters support the measure; the margin of error is ±3
percentage points." What does this mean, and can we conclude a majority supports it?

Almost always the stated margin is for 95% confidence, so the interval is 49% to 55%. Because
values below 50% are plausible, the poll does not establish majority support. The ±3 points
covers only random sampling error; if the "likely voter" screen is inaccurate or certain
groups refused to answer, the true error could be larger.

## Common mistakes

- Saying "95% of the population is in the interval" or "there is a 95% chance $p$ is in this
  interval."
- Using $p^* = 0.5$ when a good prior estimate exists (wasteful), or rounding $n$ down.
- Forgetting that the margin of error ignores bias from nonresponse, undercoverage or wording.
- Checking large counts with the sample size instead of the success and failure counts.

## Key points

- One-proportion z interval: $\hat{p} \pm z^*\sqrt{\hat{p}(1-\hat{p})/n}$; conditions: random, 10%, large counts.
- Estimate ± (critical value)(standard error).
- Confidence level = long-run capture rate of the method.
- ME grows with confidence and shrinks like $1/\sqrt{n}$.
- Sample size: $n \ge (z^*/M)^2p^*(1-p^*)$, rounded up; $p^* = 0.5$ if no guess.

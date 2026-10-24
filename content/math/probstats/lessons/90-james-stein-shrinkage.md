---
id: ps-h1-james-stein
module: ps-h1
title: Shrinkage, empirical Bayes and Stein's paradox
minutes: 45
topics: [Shrinkage estimation]
drills: [ps-h1-r2-js-factor, ps-h1-r2-js-grand]
refs: [ps-ref-estimation]
---
## Many means at once

The estimation lessons judged an estimator by its mean squared error, $\operatorname{MSE} = \operatorname{Var} + \text{Bias}^2$, and showed
that a small bias can be worth paying for a large cut in variance. The Bayesian lesson showed
the same thing from another side: the posterior mean in the normal–normal model pulls $\bar x$
toward the prior mean, and that pull is a deliberate bias. This lesson puts the two ideas
together in the setting that modern data most often present: not one unknown mean but many
of them, estimated side by side. Think of the average ride quality of 50 track sections, the
failure rate of 200 components, or the true batting average of every player in a league.

The surprising answer, found by Charles Stein in 1956, is that when you estimate three or more
means at once, the obvious estimator can always be beaten. This is the starting point for
shrinkage, empirical Bayes and much of modern high-dimensional statistics, including the ridge
and lasso methods of the next lesson.

## The setting and the risk

Suppose $X_1, \dots, X_p$ are independent with $X_i \sim N(\theta_i, \sigma^2)$, where $\sigma^2$ is known and the $p$
means $\theta_1, \dots, \theta_p$ are unrelated unknowns. Each $X_i$ might itself be a sample mean, with
$\sigma$ its standard error. Write $\boldsymbol\theta$ and $\mathbf X$ for the vectors and $\|\mathbf X\|^2 = \sum X_i^2$.

To judge an estimator $\hat{\boldsymbol\theta}$ of the whole vector we add up the squared errors and average:

$$R(\boldsymbol\theta, \hat{\boldsymbol\theta}) = E\Big[\sum_{i=1}^p (\hat\theta_i - \theta_i)^2\Big].$$

As a function of $\boldsymbol\theta$, this is the risk function of the estimator (the decision-theory honors lesson of the estimation module treats risk in general). The obvious estimator
$\hat\theta_i = X_i$ is unbiased, is the MLE, and has risk $p\sigma^2$ whatever $\boldsymbol\theta$ is.

An estimator is admissible if no other estimator has risk at least as small for every $\boldsymbol\theta$
and strictly smaller for some $\boldsymbol\theta$. An inadmissible estimator is beaten everywhere
(or tied) by a competitor, so there is never a reason to use it.

## Shrinking toward zero

Try $c\mathbf X$ for a constant $0 \le c \le 1$, a **shrinkage estimator**: it pulls every coordinate toward 0.
Each coordinate has variance $c^2\sigma^2$ and bias $(c - 1)\theta_i$, so

$$R(\boldsymbol\theta, c\mathbf X) = pc^2\sigma^2 + (1 - c)^2\|\boldsymbol\theta\|^2.$$

Setting the derivative in $c$ to zero gives the best constant and its risk:

$$c^* = \frac{\|\boldsymbol\theta\|^2}{\|\boldsymbol\theta\|^2 + p\sigma^2}, \qquad R(\boldsymbol\theta, c^*\mathbf X) = \frac{p\sigma^2\|\boldsymbol\theta\|^2}{\|\boldsymbol\theta\|^2 + p\sigma^2} < p\sigma^2.$$

So some shrinkage always helps, and it helps most when $\|\boldsymbol\theta\|$ is small. The catch is that
$c^*$ depends on the unknown $\boldsymbol\theta$. But $E\|\mathbf X\|^2 = \|\boldsymbol\theta\|^2 + p\sigma^2$, so the data carry
information about $\|\boldsymbol\theta\|^2$: we can estimate the amount of shrinkage.

## The empirical Bayes route to James–Stein

The Bayesian view makes the estimate exact. Suppose the means themselves were drawn as
$\theta_i \sim N(0, \tau^2)$, independently. The normal–normal formula gives the posterior mean

$$E(\theta_i \mid X_i) = (1 - B)X_i, \qquad B = \frac{\sigma^2}{\sigma^2 + \tau^2}.$$

If $\tau^2$ is unknown, estimate it from the data. This is **empirical Bayes**: the prior's
parameters are estimated from the same data, using the fact that many means are observed at
once. Marginally $X_i \sim N(0, \sigma^2 + \tau^2)$, so $\|\mathbf X\|^2/(\sigma^2 + \tau^2) \sim \chi^2_p$. For a $\chi^2_p$
variable $W$ with $p \ge 3$, $E(1/W) = 1/(p - 2)$, and therefore

$$E\left[\frac{(p - 2)\sigma^2}{\|\mathbf X\|^2}\right] = \frac{\sigma^2}{\sigma^2 + \tau^2} = B.$$

Replacing $B$ by this unbiased estimate gives the **James–Stein estimator** (W. James and
C. Stein, 1961):

$$\hat{\boldsymbol\theta}^{\text{JS}} = \left(1 - \frac{(p - 2)\sigma^2}{\|\mathbf X\|^2}\right)\mathbf X.$$

The factor in brackets is the **shrinkage factor**. When the observations are spread far from 0,
$\|\mathbf X\|^2$ is large and the factor is near 1; when they cluster near 0, the factor is small.

### Example 1: five means

Take $p = 5$, $\sigma = 1$ and $\mathbf X = (2.1, -0.4, 1.3, 0.8, -1.6)$.

1. $\|\mathbf X\|^2 = 4.41 + 0.16 + 1.69 + 0.64 + 2.56 = 9.46$.
2. Shrinkage factor: $1 - 3/9.46 = 0.6829$.
3. Estimates: $0.6829\,\mathbf X = (1.434, -0.273, 0.888, 0.546, -1.093)$.

Every coordinate moves toward 0 by the same proportion, about 32%.

## Stein's theorem and a proof

The empirical Bayes story assumed a prior. Stein's result needs no prior at all.

**Theorem.** For $p \ge 3$ and every $\boldsymbol\theta$,
$$R(\boldsymbol\theta, \hat{\boldsymbol\theta}^{\text{JS}}) = p\sigma^2 - (p - 2)^2\sigma^4\, E\!\left[\frac{1}{\|\mathbf X\|^2}\right] < p\sigma^2.$$

So $\mathbf X$ is inadmissible when $p \ge 3$. (For $p = 1$ and $p = 2$ it is admissible.)

*Proof.* The key tool is **Stein's lemma**: if $Z \sim N(\theta, \sigma^2)$ and $g$ is differentiable with
$E|g'(Z)| < \infty$, then $E[(Z - \theta)g(Z)] = \sigma^2E[g'(Z)]$. It follows from integrating by parts,
because the normal density $\phi$ satisfies $(z - \theta)\phi(z) = -\sigma^2\phi'(z)$.

Write $\hat{\boldsymbol\theta}^{\text{JS}} = \mathbf X - \mathbf g(\mathbf X)$ with $g_i(\mathbf x) = k\,x_i/\|\mathbf x\|^2$ and $k = (p - 2)\sigma^2$. Expanding the square,

$$\|\mathbf X - \mathbf g - \boldsymbol\theta\|^2 = \|\mathbf X - \boldsymbol\theta\|^2 - 2\sum_i (X_i - \theta_i)g_i(\mathbf X) + \|\mathbf g(\mathbf X)\|^2.$$

The first term has expectation $p\sigma^2$. Apply Stein's lemma to each coordinate (the others held fixed):
$\partial g_i/\partial x_i = k\big(1/\|\mathbf x\|^2 - 2x_i^2/\|\mathbf x\|^4\big)$, and summing over $i$ gives $k(p - 2)/\|\mathbf x\|^2$.
Finally $\|\mathbf g\|^2 = k^2/\|\mathbf x\|^2$. So the risk is

$$p\sigma^2 - 2\sigma^2k(p - 2)E\big[\|\mathbf X\|^{-2}\big] + k^2E\big[\|\mathbf X\|^{-2}\big] = p\sigma^2 - (p - 2)^2\sigma^4E\big[\|\mathbf X\|^{-2}\big]. \qquad\blacksquare$$

The expectation is finite only when $p \ge 3$, which is where the condition comes from. At
$\boldsymbol\theta = \mathbf 0$, $E[1/\|\mathbf X\|^2] = 1/((p - 2)\sigma^2)$, so the risk is just $2\sigma^2$, whatever $p$ is. Far from 0 the
gain fades but never becomes a loss.

![Risk curves for p = 10 and σ = 1. The horizontal line at 10 is the risk of X. The James–Stein curve starts at 2 when θ = 0 and rises toward 10 as the squared length of θ grows, always staying below 10. A dashed curve below it, starting at 0, is the risk of the best constant multiple of X, which needs θ to be known.](images/ps-h1-js-risk.svg)

The dashed curve is the "oracle" $c^*\mathbf X$; James–Stein pays only a little for having to estimate $c^*$.

## Why it is called a paradox

The theorem holds even when the $\theta_i$ have nothing to do with each other: the weight of a rail,
the price of tea and a batting average. Using the tea price to estimate the rail weight seems
absurd, and the resolution, known as **Stein's paradox**, is in what is being measured. James–Stein
lowers the *total* squared error. Any one coordinate can do worse; in particular, a $\theta_i$ that is
far from the others is pulled too far. The gain is guaranteed only for the combined loss, so
shrinkage makes sense when that is the loss you care about, as it is for a league table, a set
of sensors or a batch of component ratings.

Two refinements are used in practice.

- The **positive-part James–Stein estimator** replaces the factor by $\max\!\big(0,\, 1 - (p - 2)\sigma^2/\|\mathbf X\|^2\big)$. When
  $\|\mathbf X\|^2 < (p - 2)\sigma^2$ the plain factor is negative and flips every sign, which is never sensible.
  The positive-part version has smaller risk than James–Stein for every $\boldsymbol\theta$.
- **Shrinking toward the grand mean.** Zero is an arbitrary target. With $\bar X$ the average of the $X_i$
  and $S = \sum(X_i - \bar X)^2$,
  $$\hat\theta_i = \bar X + \left(1 - \frac{(p - 3)\sigma^2}{S}\right)(X_i - \bar X).$$
  One degree of freedom is spent estimating the target, so $p - 2$ becomes $p - 3$, and this version
  beats $\mathbf X$ when $p \ge 4$.

### Example 2: eight track sections

An inspection car reports the mean ride-quality index of eight track sections. Each is an average
of many runs, with standard error $\sigma = 1$:

| Section | A | B | C | D | E | F | G | H |
|---|---|---|---|---|---|---|---|---|
| $X_i$ | 12.4 | 9.8 | 11.1 | 10.6 | 13.0 | 8.7 | 10.2 | 11.8 |

1. Grand mean: $\bar X = 87.6/8 = 10.95$.
2. $S = \sum(X_i - 10.95)^2 = 14.12$.
3. Shrinkage factor: $1 - (8 - 3)(1)/14.12 = 1 - 0.354 = 0.6459$.
4. Section E: $10.95 + 0.6459(13.0 - 10.95) = 12.274$. Section F: $10.95 + 0.6459(8.7 - 10.95) = 9.497$.

The best-looking and worst-looking sections both move about a third of the way back toward the
average. The empirical Bayes reading: the spread of the $X_i$ ($S/7 = 2.017$) is only about twice the
noise variance 1, so about half of what we see is noise, and extreme results are partly luck.
Ranking sections by the raw $X_i$ would overstate how different they are.

```shape
{"segments": [{"from": [8, 1], "to": [14, 1]}, {"from": [8, 0], "to": [14, 0]}, {"from": [12.4, 1], "to": [11.887, 0.06], "arrow": true}, {"from": [9.8, 1], "to": [10.207, 0.06], "arrow": true}, {"from": [11.1, 1], "to": [11.047, 0.06], "arrow": true}, {"from": [10.6, 1], "to": [10.724, 0.06], "arrow": true}, {"from": [13.0, 1], "to": [12.274, 0.06], "arrow": true}, {"from": [8.7, 1], "to": [9.497, 0.06], "arrow": true}, {"from": [10.2, 1], "to": [10.466, 0.06], "arrow": true}, {"from": [11.8, 1], "to": [11.499, 0.06], "arrow": true}], "points": [{"at": [12.4, 1], "color": "#2c5e8f"}, {"at": [9.8, 1], "color": "#2c5e8f"}, {"at": [11.1, 1], "color": "#2c5e8f"}, {"at": [10.6, 1], "color": "#2c5e8f"}, {"at": [13.0, 1], "color": "#2c5e8f"}, {"at": [8.7, 1], "color": "#2c5e8f"}, {"at": [10.2, 1], "color": "#2c5e8f"}, {"at": [11.8, 1], "color": "#2c5e8f"}], "labels": [{"at": [11, 1.35], "text": "raw section means Xᵢ"}, {"at": [11, -0.35], "text": "James–Stein estimates"}, {"at": [8, -0.75], "text": "8"}, {"at": [10, -0.75], "text": "10"}, {"at": [12, -0.75], "text": "12"}, {"at": [14, -0.75], "text": "14"}], "caption": "Shrinking toward the grand mean 10.95: every estimate moves 35% of the way toward the center"}
```

## Where shrinkage turns up

Shrinkage is everywhere in modern statistics: insurers blend a policyholder's own claims with
the group average (credibility theory), sports and medical league tables shrink small-sample
rates toward the overall rate, and the ridge and lasso methods of the next lesson shrink regression
coefficients toward zero. In each case the logic is Stein's: many noisy estimates, judged
together, are improved by pooling information across them, often called "borrowing strength".

## Common mistakes

- **Expecting every coordinate to improve.** Stein's theorem is about total risk. A truly unusual
  $\theta_i$ can be estimated worse after shrinkage.
- **Using it with $p = 1$ or $2$.** The factor needs $p \ge 3$ (toward a fixed point) or $p \ge 4$ (toward
  the grand mean); with fewer means nothing beats $\mathbf X$ uniformly.
- **Forgetting the scale.** The formula uses the noise variance $\sigma^2$ of each $X_i$. If the $X_i$ are
  means of $n$ observations with SD $\sigma_0$, then $\sigma^2 = \sigma_0^2/n$.
- **Unequal variances.** The simple formula assumes every $X_i$ has the same $\sigma^2$. With very
  different standard errors, the empirical Bayes version shrinks each estimate by its own factor
  (noisier ones more), which is a different formula.
- **Using the plain factor when it is negative.** Use the positive part.

## Key points

- For $p$ independent $N(\theta_i, \sigma^2)$ observations, $\mathbf X$ has total risk $p\sigma^2$ for every $\boldsymbol\theta$.
- James–Stein: $\hat{\boldsymbol\theta} = \big(1 - (p - 2)\sigma^2/\|\mathbf X\|^2\big)\mathbf X$ has risk $p\sigma^2 - (p - 2)^2\sigma^4E[1/\|\mathbf X\|^2] < p\sigma^2$ when $p \ge 3$, so $\mathbf X$ is
  inadmissible; at $\boldsymbol\theta = \mathbf 0$ the risk is $2\sigma^2$.
- It is an empirical Bayes estimator: the prior variance is estimated from the spread of the data.
- Shrinking toward the grand mean uses $p - 3$ and needs $p \ge 4$; the positive-part version is better still.
- The gain is in total squared error, not in every coordinate.

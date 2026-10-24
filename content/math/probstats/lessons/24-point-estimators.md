---
id: ps-point-estimators
module: ps-m6
title: 'Point estimators: bias, variance and efficiency'
minutes: 40
topics: [Properties of estimators]
drills: [ps-d-mse, ps-d-uniform-estimators, ps-d-crlb]
refs: [ps-ref-estimation]
---
## Judging a guessing rule

A population has an unknown parameter $\theta$: a mean, a failure rate, an upper limit. A
**point estimator** $\hat\theta = h(X_1, \dots, X_n)$ is a rule that turns the sample into a single guess.
Because the sample is random, $\hat\theta$ is a random variable with its own sampling distribution;
the number it produces from one particular data set is the **estimate**. There are usually many
reasonable estimators for the same parameter. This lesson sets out the criteria for choosing
among them (bias, variance, mean squared error, consistency and efficiency) and
introduces the Cramér–Rao bound, which says how good an unbiased estimator can possibly be.
The next lesson gives systematic ways to construct estimators.

## Bias

The **bias** of $\hat\theta$ is $\operatorname{Bias}(\hat\theta) = E[\hat\theta] - \theta$, computed for each possible true value $\theta$. An
estimator is **unbiased** if its bias is zero for every $\theta$: on average over repeated samples, it
is right.

- $\bar X$ is unbiased for $\mu$, since $E[\bar X] = \mu$ for any population.
- $S^2$ is unbiased for $\sigma^2$, for any population with finite variance. *Why:* using
  $\sum(X_i - \bar X)^2 = \sum(X_i - \mu)^2 - n(\bar X - \mu)^2$ and taking expectations,
  $E\big[\sum(X_i - \bar X)^2\big] = n\sigma^2 - n\cdot\frac{\sigma^2}{n} = (n-1)\sigma^2.$
  Dividing by $n - 1$ gives exactly $\sigma^2$. Dividing by $n$ gives
  $\hat\sigma^2 = \frac1n\sum(X_i - \bar X)^2$ with $E[\hat\sigma^2] = \frac{n-1}{n}\sigma^2$, bias $-\sigma^2/n$.
- $S$ is *biased* for $\sigma$ even though $S^2$ is unbiased for $\sigma^2$: since
  $\operatorname{Var}(S) = E[S^2] - (E[S])^2 > 0$, we get $E[S] < \sigma$. Unbiasedness does not survive nonlinear
  transformations.

## Variance and mean squared error

Unbiasedness alone is a weak requirement; an unbiased estimator can still scatter wildly.
The SD of an estimator's sampling distribution is its **standard error**; for $\bar X$ it is $\sigma/\sqrt n$.
A single criterion that combines accuracy and precision is the **mean squared error**,

$$\operatorname{MSE}(\hat\theta) = E\big[(\hat\theta - \theta)^2\big] = \operatorname{Var}(\hat\theta) + \big(\operatorname{Bias}(\hat\theta)\big)^2.$$

*Why the decomposition holds:* write $\hat\theta - \theta = (\hat\theta - E\hat\theta) + (E\hat\theta - \theta)$ and square. The cross term
$2(E\hat\theta - \theta)\,E[\hat\theta - E\hat\theta]$ is zero because $E[\hat\theta - E\hat\theta] = 0$, leaving variance plus squared bias.

```plot
{"x": [3, 17], "y": [0, 0.55], "xLabel": "value of the estimator", "yLabel": "density", "functions": [{"f": "normpdf(x, 10, 2)"}, {"f": "normpdf(x, 10.8, 0.8)"}], "segments": [{"from": [10, 0], "to": [10, 0.53], "dashed": true}], "labels": [{"at": [9.3, 0.52], "text": "θ = 10"}], "caption": "Sampling distributions of two estimators of θ = 10: the wide curve is unbiased with SD 2 (MSE 4); the tall narrow curve is centred at 10.8 with SD 0.8 (MSE 0.64 + 0.64 = 1.28)"}
```

A small bias can be worth paying for a large cut in variance, as the figure shows.

Bias and variance are separate failings, and the target picture below shows all four combinations.
Each dot is the estimate from one sample; bias is how far the cloud's center sits from the bullseye,
and variance is how spread out the cloud is.

![Four targets, each with a bullseye marking the true parameter and nine dots marking estimates from nine samples. Low bias, low variance: the dots are tightly clustered on the bullseye. Low bias, high variance: the dots are scattered widely but centered on the bullseye. High bias, low variance: the dots are tightly clustered but off to the upper right. High bias, high variance: the dots are scattered widely and centered off to the upper right.](images/ps-m6-targets.svg)

### Example 1: dividing by $n - 1$, $n$, or $n + 1$

For a normal sample, $\operatorname{Var}(S^2) = 2\sigma^4/(n-1)$ (previous lesson), so $\operatorname{MSE}(S^2) = 2\sigma^4/(n-1)$. For
$\hat\sigma^2 = \frac{n-1}{n}S^2$:

1. Variance: $\big(\frac{n-1}{n}\big)^2\frac{2\sigma^4}{n-1} = \frac{2(n-1)\sigma^4}{n^2}$.
2. Bias: $-\sigma^2/n$, squared $\sigma^4/n^2$.
3. $\operatorname{MSE}(\hat\sigma^2) = \frac{(2n-1)\sigma^4}{n^2}$.

With $n = 10$ and $\sigma = 1$: $\operatorname{MSE}(S^2) = 0.222$ and $\operatorname{MSE}(\hat\sigma^2) = 0.190$. The biased estimator wins on
MSE. (Dividing by $n + 1$ does better still, $2\sigma^4/(n+1) = 0.182$.) Unbiasedness is a convention
that makes later formulas tidy, not a law of nature.

## Consistency

An estimator $\hat\theta_n$ (based on $n$ observations) is **consistent** if $\hat\theta_n \xrightarrow{P} \theta$: with enough data
it is almost certainly close to the truth. A convenient sufficient condition is
$\operatorname{MSE}(\hat\theta_n) \to 0$, that is, both the bias and the variance tend to 0. *Why:* by Markov's inequality applied
to $(\hat\theta_n - \theta)^2$,

$$P(|\hat\theta_n - \theta| \ge \varepsilon) \le \frac{E[(\hat\theta_n - \theta)^2]}{\varepsilon^2} = \frac{\operatorname{MSE}(\hat\theta_n)}{\varepsilon^2} \to 0.$$

So $\bar X$ (MSE $\sigma^2/n$), $S^2$ and $\hat\sigma^2$ are all consistent. An estimator that ignores most of the data,
such as $X_1$ alone, is unbiased for $\mu$ but not consistent.

## Efficiency

Between two unbiased estimators, prefer the one with smaller variance. The **relative efficiency** of $\hat\theta_1$ to $\hat\theta_2$ is $\operatorname{Var}(\hat\theta_2)/\operatorname{Var}(\hat\theta_1)$; a value of 2 means $\hat\theta_1$ does with $n$
observations what $\hat\theta_2$ needs about $2n$ for.

### Example 2: two estimators of a uniform upper limit

$X_1, \dots, X_n$ are iid Uniform$(0, \theta)$. Compare $\hat\theta_1 = 2\bar X$ with $\hat\theta_2 = \frac{n+1}{n}X_{(n)}$.

1. $\hat\theta_1$: $E[\bar X] = \theta/2$, so $E[2\bar X] = \theta$ (unbiased). $\operatorname{Var}(2\bar X) = 4\cdot\frac{\theta^2/12}{n} = \frac{\theta^2}{3n}$.
2. $\hat\theta_2$: from the order statistics lesson, $f_{\max}(x) = nx^{n-1}/\theta^n$ and $E[X_{(n)}] = \frac{n}{n+1}\theta$, so $\hat\theta_2$ is
   unbiased. Also $E[X_{(n)}^2] = \int_0^\theta x^2\,\frac{nx^{n-1}}{\theta^n}dx = \frac{n}{n+2}\theta^2$, so
   $\operatorname{Var}(X_{(n)}) = \frac{n\theta^2}{n+2} - \frac{n^2\theta^2}{(n+1)^2} = \frac{n\theta^2}{(n+1)^2(n+2)}$ and
   $\operatorname{Var}(\hat\theta_2) = \frac{(n+1)^2}{n^2}\cdot\frac{n\theta^2}{(n+1)^2(n+2)} = \frac{\theta^2}{n(n+2)}.$
3. Relative efficiency of $\hat\theta_2$ to $\hat\theta_1$: $\dfrac{\theta^2/(3n)}{\theta^2/(n(n+2))} = \dfrac{n+2}{3}$.

For $n = 5$ that is $7/3$; for $n = 100$ it is 34. The maximum uses the data far better, and its
variance shrinks like $1/n^2$ instead of $1/n$. Note also that $2\bar X$ can be *smaller* than the largest
observation, an impossible value for $\theta$.

## The Cramér–Rao lower bound

How small can the variance of an unbiased estimator be? For a density (or pmf) $f(x; \theta)$,
define the **Fisher information** in one observation,

$$I(\theta) = E\left[\Big(\frac{\partial}{\partial\theta}\ln f(X; \theta)\Big)^2\right] = -E\left[\frac{\partial^2}{\partial\theta^2}\ln f(X; \theta)\right].$$

It measures how sharply the log-density changes with $\theta$, that is, how much one observation
tells us about $\theta$. The **Cramér–Rao lower bound** (CRLB) states that, under regularity
conditions (chiefly, the support of $f$ must not depend on $\theta$), every unbiased estimator from an
iid sample of size $n$ satisfies

$$\operatorname{Var}(\hat\theta) \ge \frac{1}{n\,I(\theta)}.$$

An unbiased estimator that attains the bound is called **efficient**; no unbiased estimator
can beat it.

### Example 3: Bernoulli

For $f(x; p) = p^x(1-p)^{1-x}$, $x \in \{0, 1\}$:

1. $\ln f = x\ln p + (1 - x)\ln(1 - p)$.
2. $\dfrac{\partial^2}{\partial p^2}\ln f = -\dfrac{x}{p^2} - \dfrac{1 - x}{(1-p)^2}$.
3. $I(p) = \dfrac{E[X]}{p^2} + \dfrac{1 - E[X]}{(1-p)^2} = \dfrac1p + \dfrac1{1-p} = \dfrac{1}{p(1-p)}$.
4. CRLB: $\dfrac{p(1-p)}{n}$, which is exactly $\operatorname{Var}(\hat p)$ for $\hat p = \bar X$.

So the sample proportion is efficient. The same calculation for Poisson($\lambda$) gives
$I(\lambda) = 1/\lambda$ and bound $\lambda/n = \operatorname{Var}(\bar X)$, and for $N(\mu, \sigma^2)$ with known $\sigma$ it gives $\sigma^2/n$: in
all three cases the sample mean is efficient. The uniform example above escapes the bound
(variance of order $1/n^2$) precisely because its support $(0, \theta)$ depends on $\theta$. When no unbiased
estimator attains the bound, the best one can still be found; that is the subject of the lesson
after next.

## Common mistakes

- *Equating unbiased with good.* An unbiased estimator can have a huge variance; compare MSEs.
- *Assuming $S$ is unbiased for $\sigma$* because $S^2$ is unbiased for $\sigma^2$.
- *Squaring the bias incorrectly.* $\operatorname{MSE} = \operatorname{Var} + \operatorname{Bias}^2$, not $\operatorname{Var} + \operatorname{Bias}$.
- *Using the CRLB for non-regular families* (support depending on $\theta$), or for biased estimators.
- *Forgetting the factor $n$.* The bound is $1/(nI(\theta))$ where $I$ is the information per observation.

## Key points

- Bias $= E[\hat\theta] - \theta$; $\bar X$ and $S^2$ are unbiased; $\hat\sigma^2$ (divide by $n$) and $S$ are biased.
- $\operatorname{MSE} = \operatorname{Var} + \operatorname{Bias}^2$; a biased estimator can have smaller MSE.
- Consistent: $\hat\theta_n \xrightarrow{P} \theta$; MSE $\to 0$ is enough.
- Relative efficiency compares variances of unbiased estimators.
- CRLB: $\operatorname{Var}(\hat\theta) \ge 1/(nI(\theta))$ for unbiased estimators of regular families; $\bar X$ attains it for
  Bernoulli, Poisson and normal means.

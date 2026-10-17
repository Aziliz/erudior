---
id: stat-ref-probability
title: Probability and distributions
---
## Probability rules

| Rule | Formula |
|---|---|
| Complement | $P(A^c) = 1 - P(A)$ |
| Addition (general) | $P(A \cup B) = P(A) + P(B) - P(A \cap B)$ |
| Mutually exclusive | $P(A \cap B) = 0$ |
| Conditional | $P(A \mid B) = \dfrac{P(A \cap B)}{P(B)}$ |
| Multiplication (general) | $P(A \cap B) = P(A)\,P(B \mid A)$ |
| Independent | $P(A \mid B) = P(A)$, so $P(A \cap B) = P(A)P(B)$ |
| At least one ($n$ independent trials) | $1 - (1 - p)^n$ |
| Total probability | $P(A) = \sum P(B_i)\,P(A \mid B_i)$ |
| Bayes | $P(B_j \mid A) = \dfrac{P(B_j)\,P(A \mid B_j)}{\sum P(B_i)\,P(A \mid B_i)}$ |

## Simulation

| Step | What to write |
|---|---|
| State | The chance process and the event whose probability you want |
| Plan | Which random numbers stand for which outcomes (one digit for tenths, two for hundredths; ignore unused labels; skip repeats when sampling without replacement), what one trial is, what you record |
| Do | Many trials (hundreds or thousands with technology) |
| Conclude | Estimate = (trials where the event happened) ÷ (number of trials), in context |

Simulation-based inference: simulate under a null model; the proportion of simulated results at least as extreme as the observed one estimates the p-value. Under about 5% counts as convincing evidence against the model.

## Counting

| Count | Formula |
|---|---|
| Arrangements of $n$ objects | $n!$ ($0! = 1$) |
| Permutations (order matters) | $_nP_r = \dfrac{n!}{(n-r)!}$ |
| Combinations (order doesn't) | $\binom{n}{r} = \dfrac{n!}{r!\,(n-r)!}$ |
| Arrangements with repeats | $\dfrac{n!}{n_1!\,n_2!\cdots}$ |
| Hypergeometric | $\dfrac{\binom{K}{k}\binom{N-K}{n-k}}{\binom{N}{n}}$ |

## Random variables

| Quantity | Discrete random variable |
|---|---|
| Mean | $\mu = \sum x_i p_i$ |
| Variance | $\sum (x_i - \mu)^2 p_i = E(X^2) - \mu^2$ |
| Probability of an event | add the $p_i$ of its values |

For a continuous random variable (such as a normal one), probabilities are areas under its density curve.

**Combining:** $\mu_{a+bX} = a + b\mu_X$, $\sigma_{a+bX} = |b|\sigma_X$; $\mu_{X \pm Y} = \mu_X \pm \mu_Y$; if independent, $\sigma^2_{X \pm Y} = \sigma_X^2 + \sigma_Y^2$.

## Distributions

| Distribution | Use | $P(X = k)$ or density | Mean | SD |
|---|---|---|---|---|
| Binomial $B(n, p)$ | successes in $n$ trials | $\binom{n}{k}p^k(1-p)^{n-k}$ | $np$ | $\sqrt{np(1-p)}$ |
| Geometric$(p)$ | trials to 1st success | $(1-p)^{k-1}p$ | $1/p$ | $\sqrt{1-p}/p$ |
| Normal $N(\mu, \sigma)$ | bell-shaped | $\dfrac{1}{\sigma\sqrt{2\pi}}e^{-(x-\mu)^2/(2\sigma^2)}$ | $\mu$ | $\sigma$ |

Extra facts: geometric $P(X > k) = (1-p)^k$; binomial ≈ normal when $np \ge 10$ and $n(1-p) \ge 10$.

## Calculator functions

| Need | TI-style command |
|---|---|
| $P(X = k)$, binomial | binompdf(n, p, k) |
| $P(X \le k)$, binomial | binomcdf(n, p, k) |
| Geometric | geometpdf(p, k), geometcdf(p, k) |
| Normal area | normalcdf(lower, upper, μ, σ) |
| Normal cutoff | invNorm(area to the left, μ, σ) |
| Random integers for a simulation | randInt(low, high, how many) |

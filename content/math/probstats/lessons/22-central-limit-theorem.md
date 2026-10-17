---
id: ps-clt
module: ps-m5
title: The Central Limit Theorem
minutes: 40
topics: [Central Limit Theorem]
drills: [ps-d-clt-sum, ps-d-clt-binom, ps-d-clt-poisson-mean]
refs: [ps-ref-estimation]
---
## The shape of an average

The law of large numbers says $\bar X_n$ homes in on $\mu$. But how is the error $\bar X_n - \mu$
distributed for a given $n$? Remarkably, for large $n$ the answer barely depends on the
population: the error is approximately normal with SD $\sigma/\sqrt n$. This is the **Central Limit Theorem** (**CLT**), and it is the reason the normal distribution runs through all of
statistics. This lesson states it carefully, shows why it is true using moment generating
functions, and uses it to approximate probabilities for sums, means and counts.

## Convergence in distribution

A sequence $Y_1, Y_2, \dots$ with cdfs $F_n$ **converges in distribution** to a random variable $Y$
with cdf $F$ if $F_n(y) \to F(y)$ at every $y$ where $F$ is continuous. It says the *probabilities*
computed from $Y_n$ approach those from $Y$; the values of $Y_n$ themselves need not settle down.
We write $Y_n \xrightarrow{d} Y$.

## Statement

*Central Limit Theorem.* Let $X_1, X_2, \dots$ be iid with mean $\mu$ and finite, positive
variance $\sigma^2$. Then

$$Z_n = \frac{\bar X_n - \mu}{\sigma/\sqrt n} = \frac{S_n - n\mu}{\sigma\sqrt n} \xrightarrow{d} N(0, 1), \qquad S_n = X_1 + \cdots + X_n.$$

That is, $P(Z_n \le z) \to \Phi(z)$ for every $z$. In practice, for large $n$,

$$\bar X_n \approx N\!\left(\mu, \frac{\sigma^2}{n}\right), \qquad S_n \approx N(n\mu,\; n\sigma^2)$$

(second parameter = variance). The mean and variance are exact facts from the previous
module; the CLT adds the *shape*.

## Why it is true: an MGF sketch

Assume the $X_i$ have an MGF near 0. Standardize each term, $Y_i = (X_i - \mu)/\sigma$, so $E[Y_i] = 0$,
$E[Y_i^2] = 1$ and $Z_n = \frac{1}{\sqrt n}\sum Y_i$. By independence,

$$M_{Z_n}(t) = E\Big[e^{(t/\sqrt n)\sum Y_i}\Big] = \Big[M_Y\big(t/\sqrt n\big)\Big]^n.$$

Expand $M_Y$ by Taylor's theorem around 0 using $M_Y(0) = 1$, $M_Y'(0) = E[Y] = 0$, $M_Y''(0) = E[Y^2] = 1$:

$$M_Y(s) = 1 + \frac{s^2}{2} + r(s), \qquad \frac{r(s)}{s^2} \to 0 \text{ as } s \to 0.$$

With $s = t/\sqrt n$,

$$M_{Z_n}(t) = \left[1 + \frac{t^2}{2n} + r\Big(\frac{t}{\sqrt n}\Big)\right]^n \longrightarrow e^{t^2/2},$$

by the calculus limit $(1 + a/n + o(1/n))^n \to e^a$. And $e^{t^2/2}$ is the MGF of $N(0, 1)$. A
continuity theorem (if MGFs converge near 0, the cdfs converge) finishes the argument.

Notice what the proof used: the zero mean and unit variance of $Y$ survive, while every
higher-order feature of the distribution (skewness, the shape of its tails) sits in $r$ and is
wiped out by the factor $1/n$. That is why the limit is the same for every population. (The full
theorem needs only a finite variance; the general proof uses characteristic functions.)

```plot
{"x": [0, 2.6], "y": [0, 1.75], "xLabel": "value of the sample mean", "yLabel": "density", "functions": [{"f": "e^(-x)"}, {"f": "256 x^3 e^(-4x)/6"}, {"f": "16^16 x^15 e^(-16x)/1307674368000"}, {"f": "normpdf(x, 1, 0.25)", "dashed": true}], "caption": "Exact density of the mean of n exponential(1) values: the decreasing curve is n = 1, the low hump n = 4 and the tall peak n = 16; the dashed curve is the CLT normal for n = 16"}
```

The figure shows the CLT at work on a strongly skewed population: by $n = 16$ the exact
density of $\bar X$ is close to the normal curve, with a slight lingering right skew.

## How large must $n$ be?

There is no universal number. Symmetric populations with light tails (like the uniform) are
close to normal by $n \approx 10$; a moderately skewed population (exponential) needs a few dozen;
very skewed or heavy-tailed populations need more. The common "$n \ge 30$" is a rough guide for
moderate skewness. The theorem fails outright without a finite variance: the average of iid
Cauchy variables is Cauchy for every $n$.

### Example 1: rounding errors

A ledger adds 100 amounts, each rounded to the nearest whole unit. The rounding errors are iid
Uniform$(-0.5, 0.5)$: mean 0, variance $1/12$. Find the probability the total rounding error
exceeds 5 in absolute value.

1. $S_{100}$ has mean 0 and variance $100/12$, SD $\approx 2.887$.
2. CLT: $S_{100} \approx N(0, 100/12)$, so
   $P(|S_{100}| > 5) \approx P(|Z| > 5/2.887) = P(|Z| > 1.732) \approx 2(0.0416) = 0.083$.

For uniform terms, $n = 100$ is plenty: the approximation is excellent.

### Example 2: a total of waiting times

Service times are exponential with mean 4 minutes (so SD 4). Find the probability that 36
customers need more than 160 minutes in total.

1. $S_{36}$: mean $36 \times 4 = 144$, SD $\sqrt{36} \times 4 = 24$.
2. $P(S_{36} > 160) \approx P\big(Z > \tfrac{160 - 144}{24}\big) = P(Z > 0.667) \approx 0.252$.

Here we can check: $S_{36}$ is exactly gamma (shape 36, mean 144), and the exact probability is
about 0.242. The CLT answer is off by 0.01 because of the leftover skew, typical for a skewed
population at this $n$.

## Normal approximation to the binomial

A Binomial$(n, p)$ count is a sum of $n$ iid Bernoulli$(p)$ indicators with mean $p$ and variance
$p(1-p)$, so for large $n$, $X \approx N\big(np,\; np(1-p)\big)$. A common rule of thumb asks for $np \ge 10$ and
$n(1-p) \ge 10$.

Because $X$ is integer-valued and the normal is continuous, we apply a **continuity correction**: treat the integer $k$ as the interval $[k - 0.5,\, k + 0.5]$. So
$P(X \le k) \approx \Phi\big(\tfrac{k + 0.5 - np}{\sqrt{np(1-p)}}\big)$ and $P(X \ge k) \approx 1 - \Phi\big(\tfrac{k - 0.5 - np}{\sqrt{np(1-p)}}\big)$.

### Example 3

Each of 400 passengers independently buys a reserved seat with probability 0.3. Find
$P(X \le 110)$.

1. $np = 120$, $np(1-p) = 84$, SD $\approx 9.165$.
2. With the correction: $z = (110.5 - 120)/9.165 \approx -1.037$, so $P(X \le 110) \approx 0.150$.
3. The exact binomial value is 0.1498. Without the correction,
   $z = (110 - 120)/9.165 \approx -1.091$ gives 0.138, noticeably worse.

The same idea applies to a Poisson count with a large mean $\lambda$, which is approximately
$N(\lambda, \lambda)$ since it can be viewed as a sum of many independent Poisson pieces.

## Common mistakes

- *Thinking the data become normal.* The CLT is about the distribution of $\bar X$ or $S_n$; a large
  sample from a skewed population still looks skewed.
- *Using $\sigma$ instead of $\sigma/\sqrt n$ for a mean, or $n\sigma$ instead of $\sqrt n\,\sigma$ for a sum.*
- *Continuity correction in the wrong direction.* $P(X < 110) = P(X \le 109)$ uses 109.5, and
  $P(X \ge 110)$ uses 109.5 as well.
- *Ignoring the conditions.* Independence and finite variance are required; small $n$ with a
  skewed population gives poor approximations.

## Key points

- CLT: $\dfrac{\bar X_n - \mu}{\sigma/\sqrt n} \xrightarrow{d} N(0, 1)$ for iid data with finite variance.
- $\bar X \approx N(\mu, \sigma^2/n)$ and $S_n \approx N(n\mu, n\sigma^2)$ for large $n$.
- MGF proof: $[M_Y(t/\sqrt n)]^n \to e^{t^2/2}$; only the mean and variance survive.
- Binomial: $N(np, np(1-p))$ with a continuity correction of $\pm 0.5$.
- The needed $n$ grows with skewness; heavy tails (no variance) break the theorem.

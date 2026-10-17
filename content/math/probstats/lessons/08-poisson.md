---
id: ps-poisson
module: ps-m2
title: The Poisson distribution
minutes: 40
topics: [Poisson distribution, Poisson process]
drills: [ps-d-poisson-prob, ps-d-poisson-approx, ps-d-poisson-process]
refs: [ps-ref-probability]
---
## Counting rare events

How many calls reach a help desk in an hour? How many flaws are there in 100 meters of cable?
How many radioactive decays does a detector register in a second? In each case there is no
fixed number of trials — events can happen at any moment or place — but each tiny piece of
time or space has only a small chance of an event. The Poisson distribution is the model for
such counts. This lesson derives it as a limit of the binomial, finds its moments, and
introduces the Poisson process, the standard model of events occurring "at random" in time.

## The Poisson as a limit of binomials

Split an hour into $n$ tiny subintervals, each containing a call with probability $p = \lambda/n$
independently, so the expected number of calls is $np = \lambda$. The count is $\text{Bin}(n, \lambda/n)$.
Let $n \to \infty$ with $k$ fixed:

$$\binom{n}{k}\left(\frac{\lambda}{n}\right)^k\left(1 - \frac{\lambda}{n}\right)^{n-k} = \frac{\lambda^k}{k!}\cdot\underbrace{\frac{n(n-1)\cdots(n-k+1)}{n^k}}_{\to\,1}\cdot\underbrace{\left(1 - \frac{\lambda}{n}\right)^{n}}_{\to\,e^{-\lambda}}\cdot\underbrace{\left(1 - \frac{\lambda}{n}\right)^{-k}}_{\to\,1}.$$

The limit is the pmf of the **Poisson distribution** with parameter $\lambda > 0$:

$$p(k) = \frac{e^{-\lambda}\lambda^k}{k!}, \qquad k = 0, 1, 2, \ldots$$

It sums to 1 because $\sum_k \lambda^k/k! = e^{\lambda}$, the Taylor series of the exponential.

## Mean and variance

$$E(X) = \sum_{k=1}^{\infty} k\,\frac{e^{-\lambda}\lambda^k}{k!} = \lambda e^{-\lambda}\sum_{k=1}^{\infty}\frac{\lambda^{k-1}}{(k-1)!} = \lambda e^{-\lambda}e^{\lambda} = \lambda.$$

The same trick, cancelling two factors, gives the factorial moment $E[X(X-1)] = \lambda^2$, so

$$\operatorname{Var}(X) = \lambda^2 + \lambda - \lambda^2 = \lambda.$$

The mean and the variance are equal. This is a quick diagnostic for real count data: if the
sample variance is much larger than the mean ("overdispersion"), the events are probably
clustered and a Poisson model is too optimistic about predictability.

**Shape.** Consecutive probabilities satisfy $p(k)/p(k-1) = \lambda/k$, so the pmf increases
while $k < \lambda$ and decreases after; the mode is $\lfloor \lambda \rfloor$ (both $\lambda - 1$ and
$\lambda$ when $\lambda$ is a whole number). The ratio also gives a fast way to compute successive
terms by hand.

### Example 1: a help desk

Calls arrive at an average of 3.2 per hour. Model the hourly count as $X \sim \text{Poisson}(3.2)$.

```plot
{"bars": [{"x": 0, "height": 0.0408, "width": 0.7}, {"x": 1, "height": 0.1304, "width": 0.7}, {"x": 2, "height": 0.2087, "width": 0.7}, {"x": 3, "height": 0.2226, "width": 0.7}, {"x": 4, "height": 0.1781, "width": 0.7}, {"x": 5, "height": 0.114, "width": 0.7, "color": "#c05621"}, {"x": 6, "height": 0.0608, "width": 0.7, "color": "#c05621"}, {"x": 7, "height": 0.0278, "width": 0.7, "color": "#c05621"}, {"x": 8, "height": 0.0111, "width": 0.7, "color": "#c05621"}, {"x": 9, "height": 0.004, "width": 0.7, "color": "#c05621"}, {"x": 10, "height": 0.0013, "width": 0.7, "color": "#c05621"}, {"x": 11, "height": 0.0004, "width": 0.7, "color": "#c05621"}], "x": [-1, 12], "y": [0, 0.25], "xLabel": "k", "yLabel": "P(X = k)", "caption": "Poisson(3.2); orange bars make up P(X ≥ 5) ≈ 0.219"}
```

1. $P(X = 2) = e^{-3.2}\dfrac{3.2^2}{2!} = 0.04076 \times 5.12 \approx 0.2087$.
2. Build the first terms with the ratio $\lambda/k$: $p(0) = e^{-3.2} \approx 0.0408$,
   $p(1) = 3.2\,p(0) \approx 0.1304$, $p(2) = 1.6\,p(1) \approx 0.2087$,
   $p(3) = \tfrac{3.2}{3}p(2) \approx 0.2226$, $p(4) = 0.8\,p(3) \approx 0.1781$.
3. $P(X \ge 5) = 1 - (0.0408 + 0.1304 + 0.2087 + 0.2226 + 0.1781) \approx 0.219$.
4. Mean 3.2 calls, standard deviation $\sqrt{3.2} \approx 1.79$ calls.

## The Poisson approximation to the binomial

The limit argument says that $\text{Bin}(n, p) \approx \text{Poisson}(np)$ when $n$ is large and $p$ is
small. A common rule of thumb is $n \ge 20$ and $p \le 0.05$ (the approximation is excellent for
$n \ge 100$ with $np \le 10$). The Poisson needs only one parameter, and its terms avoid huge
binomial coefficients.

### Example 2: welds

Each of 500 welds is independently defective with probability 0.004. Let $X$ be the number of
defective welds; exactly, $X \sim \text{Bin}(500, 0.004)$, and approximately $X \sim \text{Poisson}(2)$.

| | Exact binomial | Poisson(2) |
|---|---|---|
| $P(X = 0)$ | 0.1348 | 0.1353 |
| $P(X \le 1)$ | 0.4055 | 0.4060 |
| $P(X = 3)$ | 0.1808 | 0.1804 |

The approximation agrees to about three decimal places. Notice that the variances nearly agree
too: $np(1-p) = 1.992$ versus $\lambda = 2$, because $1 - p \approx 1$.

## The Poisson process

Now think of events happening over continuous time — arrivals, failures, decays. Suppose:

1. counts in non-overlapping time intervals are independent;
2. the distribution of the count in an interval depends only on its length, not its location;
3. in a very short interval of length $h$, the chance of one event is about $\lambda h$, and the
   chance of two or more is negligible compared with $h$.

These describe a **Poisson process** with **rate** $\lambda$ (events per unit time). Dividing an
interval of length $t$ into $n$ pieces of length $t/n$ makes the count approximately
$\text{Bin}(n, \lambda t/n)$, and letting $n \to \infty$ gives the key fact:

$$N(t) = \text{number of events in an interval of length } t \sim \text{Poisson}(\lambda t).$$

The rate scales with the interval: 3.2 calls per hour means a mean of 1.6 per half hour and
76.8 per day. A useful consequence is that if independent Poisson counts are added, the total is
Poisson with the summed mean (two disjoint intervals of one process form a longer interval); the
next lesson proves this with moment generating functions.

### Example 3: flaws in cable

Flaws occur along a cable as a Poisson process with rate 0.4 per 100 meters.

1. In 250 m the mean is $0.4 \times 2.5 = 1$, so $P(\text{no flaws}) = e^{-1} \approx 0.368$.
2. In 500 m the mean is 2, so $P(\text{at least 2 flaws}) = 1 - e^{-2}(1 + 2) \approx 0.594$.
3. Counts in the first 250 m and the next 250 m are independent, each Poisson(1). The chance both
   stretches are flaw-free is $e^{-1} \cdot e^{-1} = e^{-2}$, which is the same as "no flaws in 500 m" —
   consistent, as it must be.

In Module 3 you will look at the *gaps* between events of a Poisson process; they turn out to be
exponential random variables, the continuous cousin of the geometric.

## Common mistakes

- Forgetting to rescale $\lambda$ to the interval in the question (rate per hour versus per 15 minutes).
- Using the Poisson for counts with a fixed, small number of trials or a large success probability.
- Writing the variance as $\lambda^2$ or the standard deviation as $\lambda$; the variance is $\lambda$.
- Computing "at least one" by summing many terms instead of $1 - e^{-\lambda}$.

## Key points

- Poisson$(\lambda)$: $p(k) = e^{-\lambda}\lambda^k/k!$, $k = 0, 1, \ldots$; mean $=$ variance $= \lambda$.
- It is the limit of $\text{Bin}(n, \lambda/n)$; use $\text{Bin}(n, p) \approx \text{Poisson}(np)$ for large $n$, small $p$.
- Successive terms: $p(k) = \tfrac{\lambda}{k}p(k-1)$.
- In a Poisson process with rate $\lambda$, the count in time $t$ is Poisson$(\lambda t)$, and counts in
  disjoint intervals are independent.

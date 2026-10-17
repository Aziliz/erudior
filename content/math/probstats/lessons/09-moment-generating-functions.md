---
id: ps-mgf
module: ps-m2
title: Moment generating functions
minutes: 40
topics: [Moment generating functions]
drills: [ps-d-mgf-write, ps-d-mgf-identify, ps-d-mgf-sum]
refs: [ps-ref-probability]
---
## One function that holds every moment

The mean and variance of each distribution so far took its own algebraic trick: indicators,
factorial moments, differentiating a series. The moment generating function packages all of
those tricks into one tool. It turns the computation of moments into differentiation, it
identifies distributions uniquely, and — its most important use — it turns the distribution of
a *sum* of independent variables into a simple product. That last property is the engine behind
the Central Limit Theorem in Module 5.

## Definition

The **moment generating function** (MGF) of a random variable $X$ is

$$M_X(t) = E\left(e^{tX}\right) = \sum_x e^{tx}p(x),$$

defined for those $t$ where the expectation is finite. We say the MGF *exists* if it is finite
on some open interval $(-h, h)$ around 0. It always equals 1 at $t = 0$.

## Why it generates moments

The $k$-th **moment** of $X$ is $E(X^k)$. Expand the exponential inside the expectation:

$$M_X(t) = E\left(1 + tX + \frac{t^2X^2}{2!} + \frac{t^3X^3}{3!} + \cdots\right) = 1 + E(X)\,t + E(X^2)\frac{t^2}{2!} + E(X^3)\frac{t^3}{3!} + \cdots$$

(when the MGF exists, swapping the expectation and the infinite sum is justified). This is the
Taylor series of $M_X$ at 0, and the coefficient of $t^k/k!$ in a Taylor series is the $k$-th
derivative at 0. So

$$M_X^{(k)}(0) = E(X^k), \qquad \text{in particular } \mu = M'(0), \quad \sigma^2 = M''(0) - [M'(0)]^2.$$

```plot
{"x": [-1, 1], "y": [0, 3.5], "xLabel": "t", "yLabel": "M(t)", "functions": [{"f": "exp(2*(exp(x) - 1))", "label": "M(t)"}], "tangents": [{"f": "exp(2*(exp(x) - 1))", "at": 0}], "points": [{"at": [0, 1], "label": "(0, 1)"}], "caption": "MGF of Poisson(2): it passes through (0, 1) and its slope there (dashed tangent) is the mean, 2"}
```

A shortcut that often saves algebra: let $R(t) = \ln M_X(t)$. Since $R' = M'/M$ and $M(0) = 1$,
$R'(0) = \mu$; differentiating once more gives $R''(0) = M''(0) - M'(0)^2 = \sigma^2$.

## Three key properties

**Linear transformations.** For $Y = aX + b$,
$M_Y(t) = E(e^{t(aX+b)}) = e^{bt}E(e^{(at)X}) = e^{bt}M_X(at)$.

**Sums of independent variables.** If $X$ and $Y$ are independent, then so are $e^{tX}$ and
$e^{tY}$, and the expectation of a product of independent variables is the product of their
expectations (proved in Module 4). Hence

$$M_{X+Y}(t) = E(e^{tX}e^{tY}) = M_X(t)\,M_Y(t).$$

**Uniqueness.** If two random variables have MGFs that exist and agree on an open interval
around 0, they have the same distribution. (The proof uses complex analysis; we take it as given.)
So an MGF is a fingerprint: recognize it, and you know the distribution.

## MGFs of the discrete distributions so far

**Bernoulli$(p)$:** $M(t) = (1 - p)e^{0} + pe^{t} = q + pe^t$.

**Binomial$(n, p)$:** by the binomial theorem,
$M(t) = \sum_k \binom{n}{k}(pe^t)^k q^{n-k} = (q + pe^t)^n$ — the $n$-th power of the Bernoulli
MGF, as expected for a sum of $n$ independent Bernoullis.

**Poisson$(\lambda)$:** $M(t) = \sum_k e^{tk}e^{-\lambda}\dfrac{\lambda^k}{k!} = e^{-\lambda}\sum_k\dfrac{(\lambda e^t)^k}{k!} = e^{\lambda(e^t - 1)}$.

**Geometric$(p)$** (trials): $M(t) = \sum_{k\ge1} e^{tk}q^{k-1}p = pe^t\sum_{j \ge 0}(qe^t)^j = \dfrac{pe^t}{1 - qe^t}$,
valid for $qe^t < 1$, i.e. $t < -\ln q$.

**Negative binomial$(r, p)$:** a sum of $r$ independent geometrics, so
$M(t) = \left(\dfrac{pe^t}{1 - qe^t}\right)^r$.

### Example 1: Poisson moments from the MGF

With $R(t) = \ln M(t) = \lambda(e^t - 1)$: $R'(t) = \lambda e^t$ and $R''(t) = \lambda e^t$, so
$\mu = R'(0) = \lambda$ and $\sigma^2 = R''(0) = \lambda$. Directly: $M'(t) = \lambda e^t M(t)$, so
$M'(0) = \lambda$; $M''(t) = \lambda e^t M(t) + (\lambda e^t)^2 M(t)$, so $E(X^2) = \lambda + \lambda^2$ and
$\sigma^2 = \lambda$.

### Example 2: a small pmf

$X$ takes values 0, 1, 2 with probabilities 0.2, 0.5, 0.3.

1. $M(t) = 0.2 + 0.5e^t + 0.3e^{2t}$.
2. $M'(t) = 0.5e^t + 0.6e^{2t}$, so $E(X) = M'(0) = 1.1$.
3. $M''(t) = 0.5e^t + 1.2e^{2t}$, so $E(X^2) = 1.7$ and $\sigma^2 = 1.7 - 1.21 = 0.49$.

Check directly: $E(X) = 0.5 + 0.6 = 1.1$ and $E(X^2) = 0.5 + 1.2 = 1.7$. ✓

### Example 3: recognizing a distribution

A random variable has MGF $M(t) = (0.3 + 0.7e^t)^8$. This is the binomial form $(q + pe^t)^n$
with $n = 8$, $p = 0.7$. By uniqueness $X \sim \text{Bin}(8, 0.7)$, so $E(X) = 5.6$,
$\operatorname{Var}(X) = 8(0.7)(0.3) = 1.68$, and for example $P(X = 8) = 0.7^8 \approx 0.0576$.

What about $Y = 2X - 3$? Its MGF is $e^{-3t}(0.3 + 0.7e^{2t})^8$, with mean $2(5.6) - 3 = 8.2$.

### Example 4: sums of independent Poissons

Breakdowns on line A are Poisson(1.5) per week and on line B Poisson(2.5), independently. The
total $T = A + B$ has

$$M_T(t) = e^{1.5(e^t - 1)}e^{2.5(e^t - 1)} = e^{4(e^t - 1)},$$

the MGF of Poisson(4). By uniqueness $T \sim \text{Poisson}(4)$, so for example
$P(T = 0) = e^{-4} \approx 0.0183$. The same argument shows that independent
$\text{Bin}(n_1, p)$ and $\text{Bin}(n_2, p)$ add to $\text{Bin}(n_1 + n_2, p)$ — but only when the
success probabilities match; with different $p$'s the product of MGFs is not of binomial form.

### Example 5: geometric moments the quick way

Lesson 7 needed a second derivative of a geometric series to get the variance of
$X \sim \text{Geometric}(p)$. With the log-MGF it is two short derivatives. Here
$R(t) = \ln M(t) = \ln p + t - \ln(1 - qe^t)$, so

$$R'(t) = 1 + \frac{qe^t}{1 - qe^t}, \qquad R''(t) = \frac{qe^t}{(1 - qe^t)^2}.$$

At $t = 0$: $\mu = 1 + \dfrac{q}{p} = \dfrac1p$ and $\sigma^2 = \dfrac{q}{p^2}$, matching lesson 7. Because the
negative binomial MGF is the $r$-th power, its $R$ is $r$ times this one, which gives the mean $r/p$
and variance $rq/p^2$ with no further work.

## When the MGF does not exist

Some distributions have tails so heavy that $E(e^{tX}) = \infty$ for every $t > 0$. For instance,
if $p(k) = \dfrac{6}{\pi^2k^2}$ for $k = 1, 2, \ldots$, then $e^{tk}/k^2 \to \infty$, so the series
diverges for all $t > 0$ (and even the mean is infinite). For such variables, other transforms
(the characteristic function $E(e^{itX})$, which always exists) take over in advanced courses.

## Common mistakes

- Evaluating the derivatives at the wrong point: moments come from derivatives at $t = 0$.
- Taking $M''(0)$ as the variance; it is $E(X^2)$, so subtract $M'(0)^2$.
- Multiplying MGFs of *dependent* variables to get the MGF of a sum.
- Forgetting the $e^{bt}$ factor (or the $at$ argument) for $aX + b$.
- Claiming two distributions match because a few moments agree; uniqueness needs the whole MGF.

## Key points

- $M_X(t) = E(e^{tX})$; $M_X(0) = 1$; $M_X^{(k)}(0) = E(X^k)$.
- $R(t) = \ln M_X(t)$ gives $R'(0) = \mu$ and $R''(0) = \sigma^2$.
- $M_{aX+b}(t) = e^{bt}M_X(at)$; for independent $X, Y$: $M_{X+Y} = M_X M_Y$.
- Uniqueness: equal MGFs near 0 mean equal distributions.
- Bernoulli $q + pe^t$; binomial $(q + pe^t)^n$; Poisson $e^{\lambda(e^t-1)}$; geometric $pe^t/(1 - qe^t)$;
  negative binomial $[pe^t/(1 - qe^t)]^r$.

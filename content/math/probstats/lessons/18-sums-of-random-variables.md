---
id: ps-sums
module: ps-m4
title: Sums of independent random variables
minutes: 35
topics: [Sums of random variables]
drills: [ps-d-sum-normal, ps-d-sum-poisson, ps-d-sum-exp]
refs: [ps-ref-estimation]
---
## Why sums matter

Totals are everywhere: the journey time is the sum of the leg times, the day's failures are
the sum of failures on each line, a sample mean is a sum divided by $n$. The last lesson gave
the mean and variance of a sum. Here we find its whole *distribution* when the terms are
independent, by two methods: a direct one (convolution) and a slick one (moment generating
functions). The results explain why the normal, Poisson and gamma families keep
reappearing.

## Convolution: discrete case

Let $X$ and $Y$ be independent and integer-valued, and $Z = X + Y$. The event $\{Z = z\}$ splits by the
value of $X$: $\{X = k, Y = z - k\}$ over all $k$. Independence turns each joint probability into a
product:

$$P(Z = z) = \sum_k p_X(k)\,p_Y(z - k).$$

This operation on two pmfs is called a **convolution**.

### Example 1: Poisson plus Poisson

Line A has $X \sim \text{Poisson}(\lambda)$ signal faults per day and line B, independently,
$Y \sim \text{Poisson}(\mu)$. For $z = 0, 1, 2, \dots$

$$P(Z = z) = \sum_{k=0}^{z} \frac{e^{-\lambda}\lambda^k}{k!}\cdot\frac{e^{-\mu}\mu^{z-k}}{(z-k)!} = \frac{e^{-(\lambda+\mu)}}{z!}\sum_{k=0}^{z}\binom{z}{k}\lambda^k\mu^{z-k} = \frac{e^{-(\lambda+\mu)}(\lambda+\mu)^z}{z!}.$$

The middle step multiplies and divides by $z!$; the last uses the binomial theorem. So
$X + Y \sim \text{Poisson}(\lambda + \mu)$: *independent Poisson counts add to a Poisson count*. With
$\lambda = 1.5$ and $\mu = 2.5$, the total is Poisson(4) and
$P(Z = 3) = e^{-4}4^3/3! \approx 0.195$.

## Convolution: continuous case

For independent continuous $X, Y$ with densities $f_X, f_Y$, start from the cdf of $Z = X + Y$:

$$F_Z(z) = P(X + Y \le z) = \int_{-\infty}^{\infty} f_X(x)\left[\int_{-\infty}^{z - x} f_Y(y)\,dy\right] dx = \int_{-\infty}^{\infty} f_X(x)\,F_Y(z - x)\,dx.$$

Differentiate in $z$ (under the integral sign):

$$f_Z(z) = \int_{-\infty}^{\infty} f_X(x)\,f_Y(z - x)\,dx.$$

The integrand is nonzero only where *both* $x$ and $z - x$ lie in their supports, and finding
that range is the whole difficulty.

### Example 2: sum of two uniforms

Let $X, Y$ be independent Uniform(0, 1) and $Z = X + Y$, which lies in $(0, 2)$. The integrand
$1 \cdot 1$ is nonzero when $0 < x < 1$ and $0 < z - x < 1$, that is $z - 1 < x < z$. Intersect with $(0, 1)$:

- For $0 < z \le 1$: $x \in (0, z)$, so $f_Z(z) = z$.
- For $1 < z < 2$: $x \in (z - 1, 1)$, so $f_Z(z) = 2 - z$.

```plot
{"x": [-0.3, 2.3], "y": [0, 1.25], "xLabel": "z", "yLabel": "density", "functions": [{"f": "x", "from": 0, "to": 1}, {"f": "2 - x", "from": 1, "to": 2}, {"f": "1", "from": 0, "to": 1, "dashed": true}], "labels": [{"at": [0.3, 1.08], "text": "one uniform"}, {"at": [1.55, 0.8], "text": "sum of two"}], "caption": "The sum of two independent Uniform(0, 1) variables has a triangular density"}
```

Adding two flat densities produced a peak in the middle: there are many ways to make a total
near 1 and few ways to make one near 0 or 2. Repeat the process and the shape becomes ever
more bell-like, a first glimpse of the Central Limit Theorem.

### Example 3: sum of two exponentials

Let $X, Y$ be iid exponential with rate $\lambda$ (mean $1/\lambda$). For $z > 0$ the integrand is nonzero
when $0 < x < z$:

$$f_Z(z) = \int_0^z \lambda e^{-\lambda x}\,\lambda e^{-\lambda(z - x)}\,dx = \lambda^2 e^{-\lambda z}\int_0^z dx = \lambda^2 z e^{-\lambda z}.$$

This is the gamma density with shape 2 and scale $\theta = 1/\lambda$. If two independent stages of a repair each
take an exponential time with rate 1.5 per hour, the chance the whole repair takes more than 2
hours is $\int_2^\infty 2.25 z e^{-1.5z}\,dz = e^{-3}(1 + 3) \approx 0.199$ (integrate by parts).

## Two-variable change of variables

Convolution is one case of a general tool. If $(U, V)$ is a one-to-one, differentiable
transformation of a continuous pair $(X, Y)$, with inverse $x = x(u, v)$, $y = y(u, v)$, the
one-variable formula from the functions-of-a-random-variable lesson extends to

$$f_{U,V}(u, v) = f_{X,Y}\big(x(u, v),\, y(u, v)\big)\,\lvert J\rvert, \qquad J = \det\begin{pmatrix} \partial x/\partial u & \partial x/\partial v \\ \partial y/\partial u & \partial y/\partial v \end{pmatrix},$$

on the image of the support. The absolute value of the Jacobian determinant $J$ does the job of
$|dx/dy|$: it rescales area instead of length. To find the density of a single function such as
$X + Y$, add a convenient second variable, transform, and integrate it out. With $U = X + Y$ and
$V = X$, the inverse is $x = v$, $y = u - v$, so $J = -1$ and $f_{U,V}(u, v) = f_X(v)f_Y(u - v)$ for
independent $X, Y$; integrating over $v$ gives the convolution formula again.

## The MGF method

Convolutions get heavy fast. Moment generating functions turn them into multiplication. If
$X$ and $Y$ are independent,

$$M_{X+Y}(t) = E\big[e^{t(X+Y)}\big] = E\big[e^{tX}e^{tY}\big] = E\big[e^{tX}\big]\,E\big[e^{tY}\big] = M_X(t)\,M_Y(t),$$

using $E[g(X)h(Y)] = E[g(X)]E[h(Y)]$ for independent variables. Since an MGF that exists near
$t = 0$ determines the distribution uniquely, recognizing the product as a known MGF identifies
the distribution of the sum. For $n$ independent terms, $M_{\sum X_i}(t) = \prod M_{X_i}(t)$.

*Poisson again.* $M_X(t) = e^{\lambda(e^t - 1)}$, so the product is $e^{(\lambda+\mu)(e^t - 1)}$, the Poisson$(\lambda+\mu)$
MGF. One line instead of the binomial theorem.

*Normal.* If $X \sim N(\mu_1, \sigma_1^2)$ (mean, variance), then $M_X(t) = e^{\mu_1 t + \sigma_1^2t^2/2}$, and
$M_{aX}(t) = M_X(at)$. For independent $X \sim N(\mu_1, \sigma_1^2)$ and $Y \sim N(\mu_2, \sigma_2^2)$,

$$M_{aX + bY}(t) = e^{a\mu_1 t + a^2\sigma_1^2t^2/2}\,e^{b\mu_2 t + b^2\sigma_2^2t^2/2} = e^{(a\mu_1 + b\mu_2)t + (a^2\sigma_1^2 + b^2\sigma_2^2)t^2/2},$$

so *a linear combination of independent normals is normal*, with
mean $a\mu_1 + b\mu_2$ and variance $a^2\sigma_1^2 + b^2\sigma_2^2$. In particular, the mean of an iid normal
sample is exactly $N(\mu, \sigma^2/n)$.

The same argument gives a family of "closure" results:

| Independent terms | Sum |
|---|---|
| Poisson$(\lambda_i)$ | Poisson$(\sum \lambda_i)$ |
| Binomial$(n_i, p)$, same $p$ | Binomial$(\sum n_i, p)$ |
| $N(\mu_i, \sigma_i^2)$ | $N(\sum \mu_i, \sum \sigma_i^2)$ |
| Exponential, mean $\theta$ ($n$ of them) | Gamma(shape $n$, scale $\theta$) |
| Gamma(shape $\alpha_i$, scale $\theta$), same $\theta$ | Gamma(shape $\sum \alpha_i$, scale $\theta$) |

The conditions matter: binomials with different $p$, or gammas with different scales, do *not*
give a binomial or gamma sum (the MGF product isn't of that form).

### Example 4: a two-leg journey

A freight run has two legs with independent times $X \sim N(42, 9)$ and $Y \sim N(35, 16)$ minutes
(variances 9 and 16). Find $P(X + Y > 85)$ and $P(X > Y + 10)$.

1. $T = X + Y \sim N(77, 25)$, SD 5. $P(T > 85) = P\big(Z > \tfrac{85 - 77}{5}\big) = P(Z > 1.6) \approx 0.0548$.
2. $D = X - Y$ is $aX + bY$ with $a = 1$, $b = -1$: mean $42 - 35 = 7$, variance $9 + 16 = 25$.
   $P(D > 10) = P\big(Z > \tfrac{10 - 7}{5}\big) = P(Z > 0.6) \approx 0.274$.

The variance of the *difference* is $9 + 16$, not $16 - 9$: subtracting an independent random
quantity adds uncertainty.

## $X_1 + X_2$ is not $2X$

If $X_1, X_2$ are iid with variance $\sigma^2$, then $\operatorname{Var}(X_1 + X_2) = 2\sigma^2$ but $\operatorname{Var}(2X_1) = 4\sigma^2$.
Doubling one observation doubles its error; adding a second, independent observation lets
errors partly cancel. In MGF terms, $M_{X_1+X_2}(t) = M(t)^2$ while $M_{2X}(t) = M(2t)$.

## Common mistakes

- *Using MGF products without independence.* The factorization $E[e^{tX}e^{tY}] = E[e^{tX}]E[e^{tY}]$
  needs independence (or, for normals, joint normality handled separately).
- *Adding standard deviations.* Variances add for independent terms; SDs add only when
  $\rho = 1$.
- *Wrong limits in a convolution.* Both $x$ and $z - x$ must be in their supports; this often
  splits the answer into cases.
- *Treating $X_1 + X_2$ like $2X$.* Sums of independent copies are less spread out.
- *Applying closure rules outside their conditions* (different $p$ for binomials, different
  scales for gammas).

## Key points

- Convolution: $P(Z = z) = \sum_k p_X(k)p_Y(z - k)$; $f_Z(z) = \int f_X(x)f_Y(z - x)\,dx$.
- Independent: $M_{X+Y}(t) = M_X(t)M_Y(t)$; match the product to a known MGF.
- Poisson + Poisson is Poisson; normal combinations are normal; $n$ iid exponentials sum to a gamma.
- For independent normals, $aX + bY \sim N(a\mu_1 + b\mu_2,\; a^2\sigma_1^2 + b^2\sigma_2^2)$.

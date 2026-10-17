---
id: ps-gamma-beta
module: ps-m3
title: The gamma and beta distributions
minutes: 45
topics: [Gamma distribution, Beta distribution]
drills: [ps-d-gamma-integral, ps-d-gamma-dist, ps-d-beta]
refs: [ps-ref-probability]
---
## Flexible families

The exponential distribution has a single shape: highest at 0 and decaying. Many positive
quantities — the total time for several jobs, rainfall amounts, the lifetime of a part that
wears out — rise and then fall. The gamma family adds a shape parameter to the exponential and
includes the chi-square distribution, which drives much of statistical inference. The beta
family does the same for quantities confined to $[0, 1]$, such as proportions and probabilities.
Both are built on two special functions from calculus, the gamma and beta functions.

## The gamma function

For $\alpha > 0$, the **gamma function** is

$$\Gamma(\alpha) = \int_0^\infty x^{\alpha - 1}e^{-x}\,dx.$$

(The integral converges at 0 because $\alpha > 0$ and at $\infty$ because $e^{-x}$ beats any power.)

**Recursion.** Integrate by parts with $u = x^{\alpha}$ and $dv = e^{-x}\,dx$:

$$\Gamma(\alpha + 1) = \big[-x^{\alpha}e^{-x}\big]_0^\infty + \alpha\int_0^\infty x^{\alpha - 1}e^{-x}\,dx = \alpha\,\Gamma(\alpha).$$

Since $\Gamma(1) = \int_0^\infty e^{-x}dx = 1$, induction gives $\Gamma(n) = (n - 1)!$ for positive
integers: the gamma function extends the factorial to non-integers.

**Half-integers.** Substituting $x = z^2/2$ in $\Gamma(\tfrac12) = \int_0^\infty x^{-1/2}e^{-x}\,dx$ gives
$\sqrt2\int_0^\infty e^{-z^2/2}\,dz = \sqrt2 \cdot \tfrac12\sqrt{2\pi} = \sqrt\pi$, using the normal integral of
lesson 12. Then the recursion gives, for example, $\Gamma(\tfrac52) = \tfrac32 \cdot \tfrac12 \cdot \sqrt\pi = \tfrac34\sqrt\pi \approx 1.329$.

**The key integral.** Substituting $x = \theta u$ in the definition shows, for $\alpha, \theta > 0$,

$$\int_0^\infty x^{\alpha - 1}e^{-x/\theta}\,dx = \Gamma(\alpha)\,\theta^{\alpha}.$$

This one formula evaluates every integral in this lesson. For instance
$\int_0^\infty x^3e^{-2x}\,dx = \Gamma(4)(\tfrac12)^4 = 6/16 = 0.375$ — no repeated integration by parts.

## The gamma distribution

Dividing the integrand of the key integral by its total gives a density. $X$ has the
**gamma distribution** with **shape parameter** $\alpha > 0$ and **scale parameter** $\theta > 0$ if

$$f(x) = \frac{x^{\alpha - 1}e^{-x/\theta}}{\Gamma(\alpha)\,\theta^{\alpha}}, \qquad x > 0.$$

(Some texts write the scale as $\beta$, and some use the rate $\lambda = 1/\theta$ instead of the scale, so check which a formula means.) With $\alpha = 1$ it is the
exponential distribution with mean $\theta$.

**Moments.** By the key integral with $\alpha + k$ in place of $\alpha$,

$$E(X^k) = \frac{\Gamma(\alpha + k)\,\theta^{\alpha + k}}{\Gamma(\alpha)\,\theta^{\alpha}} = \theta^k\frac{\Gamma(\alpha + k)}{\Gamma(\alpha)}.$$

So $E(X) = \alpha\theta$ and $E(X^2) = \alpha(\alpha + 1)\theta^2$, giving $\operatorname{Var}(X) = \alpha\theta^2$. The MGF,
by the same integral with $1/\theta - t$ in place of $1/\theta$, is $M(t) = (1 - \theta t)^{-\alpha}$ for
$t < 1/\theta$.

```plot
{"x": [0, 10], "y": [0, 1.05], "xLabel": "x", "yLabel": "f(x)", "functions": [{"f": "exp(-x)"}, {"f": "x*exp(-x)"}, {"f": "x^3*exp(-x)/6"}], "labels": [{"at": [0.8, 0.62], "text": "α = 1"}, {"at": [1.9, 0.42], "text": "α = 2"}, {"at": [4.3, 0.27], "text": "α = 4"}], "caption": "Gamma densities with scale θ = 1: shape α = 1 (exponential), 2 and 4"}
```

**Sums.** If $X_1 \sim \text{Gamma}(\alpha_1, \theta)$ and $X_2 \sim \text{Gamma}(\alpha_2, \theta)$ are independent
with the *same scale*, the product of MGFs is $(1 - \theta t)^{-(\alpha_1 + \alpha_2)}$, so
$X_1 + X_2 \sim \text{Gamma}(\alpha_1 + \alpha_2, \theta)$. In particular, a sum of $k$ independent
Exponential$(\lambda)$ variables is $\text{Gamma}(k, 1/\lambda)$.

**Waiting for the $k$-th event.** In a Poisson process with rate $\lambda$, the time $T_k$ of the
$k$-th event is the sum of $k$ independent exponential gaps, so $T_k \sim \text{Gamma}(k, 1/\lambda)$
(called the Erlang distribution when $k$ is an integer). Its tail has a closed form: $T_k > t$
exactly when fewer than $k$ events occur by time $t$, so

$$P(T_k > t) = P(N(t) \le k - 1) = \sum_{j=0}^{k-1} e^{-\lambda t}\frac{(\lambda t)^j}{j!}.$$

### Example 1: the third call

Calls arrive as a Poisson process at 2 per hour. Let $T$ be the time of the third call, so
$T \sim \text{Gamma}(3, \tfrac12)$.

1. $E(T) = 3 \times \tfrac12 = 1.5$ hours and $\operatorname{SD}(T) = \sqrt{3}\times\tfrac12 \approx 0.866$ hours.
2. $P(T > 2) = P(N(2) \le 2)$, where $N(2) \sim \text{Poisson}(4)$:
   $e^{-4}\left(1 + 4 + \tfrac{16}{2}\right) = 13e^{-4} \approx 0.238$.

## The chi-square distribution

The **chi-square distribution** with $\nu$ **degrees of freedom**, $\chi^2(\nu)$, is the gamma
distribution with $\alpha = \nu/2$ and $\theta = 2$:

$$f(x) = \frac{x^{\nu/2 - 1}e^{-x/2}}{\Gamma(\nu/2)\,2^{\nu/2}}, \quad x > 0; \qquad E(X) = \nu, \qquad \operatorname{Var}(X) = 2\nu.$$

Lesson 14 shows that $Z^2 \sim \chi^2(1)$ when $Z$ is standard normal, so by the sum rule a sum of
$\nu$ independent squared standard normals is $\chi^2(\nu)$. That is why chi-square distributions
govern sample variances and goodness-of-fit statistics later in the course. With even $\nu$ the
Poisson tail formula applies: for $\chi^2(4) = \text{Gamma}(2, 2)$,
$P(X > 6) = e^{-3}(1 + 3) \approx 0.199$.

## The beta function and beta distribution

For $a, b > 0$, the **beta function** is $B(a, b) = \int_0^1 x^{a - 1}(1 - x)^{b - 1}\,dx$, and it is
linked to the gamma function by

$$B(a, b) = \frac{\Gamma(a)\,\Gamma(b)}{\Gamma(a + b)}$$

(proved by writing $\Gamma(a)\Gamma(b)$ as a double integral and changing variables). $X$ has the
**beta distribution** with parameters $a, b > 0$ if

$$f(x) = \frac{x^{a - 1}(1 - x)^{b - 1}}{B(a, b)}, \qquad 0 < x < 1.$$

**Moments** follow from the gamma recursion:
$E(X) = \dfrac{B(a + 1, b)}{B(a, b)} = \dfrac{\Gamma(a + 1)\Gamma(a + b)}{\Gamma(a)\Gamma(a + b + 1)} = \dfrac{a}{a + b}$, and similarly

$$\operatorname{Var}(X) = \frac{ab}{(a + b)^2(a + b + 1)}.$$

The family is remarkably flexible: $\text{Beta}(1, 1)$ is $\text{U}(0, 1)$; $a = b$ gives shapes symmetric
about $\tfrac12$; $a < b$ skews right and $a > b$ skews left; parameters below 1 pile density near
the ends. Beta distributions model proportions (the fraction of a day a line is busy) and serve
as prior distributions for an unknown probability $p$ in Bayesian statistics.

```plot
{"x": [0, 1], "y": [0, 2.9], "xLabel": "x", "yLabel": "f(x)", "functions": [{"f": "30*x*(1-x)^4"}, {"f": "6*x*(1-x)"}, {"f": "30*x^4*(1-x)"}], "labels": [{"at": [0.2, 2.65], "text": "Beta(2, 5)"}, {"at": [0.5, 1.65], "text": "Beta(2, 2)"}, {"at": [0.8, 2.65], "text": "Beta(5, 2)"}], "shade": [{"f": "30*x*(1-x)^4", "from": 0.5, "to": 1}], "caption": "Beta densities; shaded: P(X > 0.5) = 7/64 for Beta(2, 5)"}
```

### Example 2: a beta proportion

The fraction $X$ of a shift that a crane is idle is modeled as $\text{Beta}(2, 5)$.

1. $B(2, 5) = \dfrac{\Gamma(2)\Gamma(5)}{\Gamma(7)} = \dfrac{1 \cdot 24}{720} = \dfrac{1}{30}$, so $f(x) = 30x(1 - x)^4$.
2. $E(X) = \dfrac{2}{7} \approx 0.286$ and $\operatorname{Var}(X) = \dfrac{10}{49 \cdot 8} \approx 0.0255$, so $\sigma \approx 0.160$.
3. $P(X > 0.5) = \int_{0.5}^1 30x(1 - x)^4\,dx$. Substitute $u = 1 - x$:
   $\int_0^{0.5} 30(1 - u)u^4\,du = 30\left[\tfrac{u^5}{5} - \tfrac{u^6}{6}\right]_0^{0.5} = 30\left(\tfrac{1}{160} - \tfrac{1}{384}\right) = \tfrac{7}{64} \approx 0.109$.

### Example 3: a gamma integral in disguise

Evaluate $\int_0^\infty x^{5/2}e^{-x/3}\,dx$. Here $\alpha - 1 = \tfrac52$, so $\alpha = \tfrac72$, and $\theta = 3$:
the integral is $\Gamma(\tfrac72)\,3^{7/2}$. With $\Gamma(\tfrac72) = \tfrac52 \cdot \tfrac32 \cdot \tfrac12\sqrt\pi = \tfrac{15}{8}\sqrt\pi \approx 3.323$
and $3^{7/2} \approx 46.77$, the value is about 155.4.

## Common mistakes

- Mixing scale and rate: with scale $\theta$ the mean is $\alpha\theta$; with rate $\lambda$ it is $\alpha/\lambda$.
- Writing $\Gamma(n) = n!$; it is $(n - 1)!$.
- Adding gamma variables with different scales and expecting a gamma.
- Forgetting the normalizing constant $1/B(a, b)$ when integrating a beta density.
- Reading the exponent of $x$ as $\alpha$ in a gamma integral; the exponent is $\alpha - 1$.

## Key points

- $\Gamma(\alpha) = \int_0^\infty x^{\alpha-1}e^{-x}dx$; $\Gamma(\alpha + 1) = \alpha\Gamma(\alpha)$; $\Gamma(n) = (n-1)!$; $\Gamma(\tfrac12) = \sqrt\pi$.
- $\int_0^\infty x^{\alpha-1}e^{-x/\theta}dx = \Gamma(\alpha)\theta^\alpha$.
- $\text{Gamma}(\alpha, \theta)$: mean $\alpha\theta$, variance $\alpha\theta^2$, MGF $(1 - \theta t)^{-\alpha}$; same-scale sums add shapes.
- Time of the $k$-th Poisson event is $\text{Gamma}(k, 1/\lambda)$; $\chi^2(\nu) = \text{Gamma}(\nu/2, 2)$, mean $\nu$, variance $2\nu$.
- $\text{Beta}(a, b)$ on $(0, 1)$: mean $a/(a + b)$, variance $ab/[(a + b)^2(a + b + 1)]$; $B(a, b) = \Gamma(a)\Gamma(b)/\Gamma(a + b)$.

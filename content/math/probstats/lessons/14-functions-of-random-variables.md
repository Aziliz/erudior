---
id: ps-transformations
module: ps-m3
title: Functions of a random variable
minutes: 45
topics: [Functions of a random variable]
drills: [ps-d-cdf-method, ps-d-change-of-variables, ps-d-inverse-transform]
refs: [ps-ref-probability]
---
## Transforming randomness

Often the quantity you care about is a function of one you can model. If a cube's side is random,
so is its volume; if a voltage is random, so is the power $V^2/R$; if a log-return is normal, the
price ratio $e^X$ is not. LOTUS gives the *mean* of $g(X)$ without its distribution, but
probabilities and quantiles need the full distribution of $Y = g(X)$. This lesson gives two
methods — the cdf method, which always works, and the change-of-variables formula, a shortcut
for monotone $g$ — and uses them to explain where the chi-square and lognormal distributions
come from and how computers simulate any distribution from uniform random numbers.

## The discrete case

If $X$ is discrete, collect the $x$-values that map to each $y$:

$$p_Y(y) = P(g(X) = y) = \sum_{x\,:\,g(x) = y} p_X(x).$$

For $X$ uniform on $\{-2, -1, 0, 1, 2\}$ and $Y = X^2$: $p_Y(0) = \tfrac15$, $p_Y(1) = \tfrac25$,
$p_Y(4) = \tfrac25$. Nothing more is needed.

## The cdf method

For continuous $X$, densities cannot simply be added up point by point, but probabilities of
events can. The **cdf method**:

1. Write $F_Y(y) = P(g(X) \le y)$ and rewrite the event $\{g(X) \le y\}$ as an event about $X$.
2. Compute that probability with $F_X$ (or by integrating $f_X$).
3. Differentiate: $f_Y(y) = F_Y'(y)$.
4. State the range of $y$ where the density is positive.

### Example 1: the square of a standard normal

Let $Z \sim \text{N}(0, 1)$ and $Y = Z^2$. For $y > 0$,

$$F_Y(y) = P(Z^2 \le y) = P(-\sqrt y \le Z \le \sqrt y) = \Phi(\sqrt y) - \Phi(-\sqrt y) = 2\Phi(\sqrt y) - 1.$$

Differentiate with the chain rule, using $\Phi' = \phi$:

$$f_Y(y) = 2\phi(\sqrt y)\cdot\frac{1}{2\sqrt y} = \frac{1}{\sqrt{2\pi}}\,y^{-1/2}e^{-y/2}, \qquad y > 0.$$

This is the gamma density with $\alpha = \tfrac12$, $\beta = 2$ (check the constant:
$\Gamma(\tfrac12)\,2^{1/2} = \sqrt{2\pi}$). So $Z^2 \sim \chi^2(1)$, the fact promised in lesson 13.

### Example 2: a non-monotone function

Let $X \sim \text{U}(-1, 2)$ (density $\tfrac13$) and $Y = X^2$, which takes values in $[0, 4]$. The
event $\{X^2 \le y\}$ is $\{-\sqrt y \le X \le \sqrt y\}$, but the interval gets cut off at $-1$:

- For $0 < y < 1$: both endpoints are inside $(-1, 2)$, so $F_Y(y) = \dfrac{2\sqrt y}{3}$ and $f_Y(y) = \dfrac{1}{3\sqrt y}$.
- For $1 \le y < 4$: the left endpoint is below $-1$, so $F_Y(y) = P(-1 \le X \le \sqrt y) = \dfrac{\sqrt y + 1}{3}$
  and $f_Y(y) = \dfrac{1}{6\sqrt y}$.

The density halves at $y = 1$ because, above 1, only one branch ($X = \sqrt y$) produces $y$.
Check: $\int_0^1 \tfrac{dy}{3\sqrt y} + \int_1^4 \tfrac{dy}{6\sqrt y} = \tfrac23 + \tfrac13 = 1$.

```plot
{"x": [0, 4.3], "y": [0, 1.6], "xLabel": "y", "yLabel": "f(y)", "functions": [{"f": "1/(3*sqrt(x))", "from": 0.04, "to": 1}, {"f": "1/(6*sqrt(x))", "from": 1, "to": 4, "color": "#2c5e8f"}], "segments": [{"from": [1, 0.1667], "to": [1, 0.3333], "dashed": true}], "caption": "Density of Y = X² when X ~ U(−1, 2): it jumps down by half at y = 1"}
```

## The change-of-variables formula

When $g$ is strictly monotone and differentiable on the range of $X$, the cdf method can be done
once and for all. Suppose $g$ is increasing with inverse $x = g^{-1}(y)$. Then

$$F_Y(y) = P(g(X) \le y) = P(X \le g^{-1}(y)) = F_X(g^{-1}(y)),$$

and differentiating gives $f_Y(y) = f_X(g^{-1}(y))\,\dfrac{d}{dy}g^{-1}(y)$. If $g$ is decreasing, the
inequality flips, $F_Y(y) = 1 - F_X(g^{-1}(y))$, and the derivative of $g^{-1}$ is negative; the
minus signs cancel. Both cases combine into the **change-of-variables formula**:

$$f_Y(y) = f_X\big(g^{-1}(y)\big)\left|\frac{d}{dy}g^{-1}(y)\right|.$$

**Intuition.** Probability is conserved: the small interval $[x, x + dx]$ maps to $[y, y + dy]$, and
both carry the same probability, so $f_Y(y)\,|dy| = f_X(x)\,|dx|$. Where $g$ stretches the axis,
density thins out; where it compresses, density piles up. The factor $|dx/dy|$ is the
one-dimensional **Jacobian**.

**Linear functions.** For $Y = aX + b$ with $a \ne 0$, $g^{-1}(y) = (y - b)/a$, so

$$f_Y(y) = \frac{1}{|a|}f_X\left(\frac{y - b}{a}\right).$$

Applied to a normal density this recovers $aX + b \sim \text{N}(a\mu + b, a^2\sigma^2)$ from lesson 12.

### Example 3: the lognormal distribution

Let $X \sim \text{N}(\mu, \sigma^2)$ and $Y = e^X$. Then $g$ is increasing, $g^{-1}(y) = \ln y$ and
$\dfrac{d}{dy}\ln y = \dfrac1y$, so for $y > 0$

$$f_Y(y) = \frac{1}{y\,\sigma\sqrt{2\pi}}\exp\left(-\frac{(\ln y - \mu)^2}{2\sigma^2}\right).$$

This is the **lognormal distribution**, a standard model for sizes, incomes and particle
diameters that arise from many multiplicative effects. Probabilities need no new tables:
$P(Y \le c) = P(X \le \ln c)$. Its mean comes from the normal MGF:
$E(Y) = E(e^{X}) = M_X(1) = e^{\mu + \sigma^2/2}$, larger than the median $e^\mu$.

## Simulation: the probability integral transform

Two closely related facts connect every continuous distribution to the uniform. Let $F$ be a
continuous cdf that is strictly increasing where it is between 0 and 1.

1. If $X$ has cdf $F$, then $U = F(X) \sim \text{U}(0, 1)$. *Proof:* for $0 < u < 1$,
   $P(F(X) \le u) = P(X \le F^{-1}(u)) = F(F^{-1}(u)) = u$. This is the
   **probability integral transform**.
2. Conversely, if $U \sim \text{U}(0, 1)$, then $X = F^{-1}(U)$ has cdf $F$, because
   $P(F^{-1}(U) \le x) = P(U \le F(x)) = F(x)$.

The second fact is **inverse transform sampling**, the way software turns uniform random numbers
into draws from other distributions.

### Example 4: simulating an exponential

For Exponential$(\lambda)$, solve $u = 1 - e^{-\lambda x}$ for $x$: $F^{-1}(u) = -\dfrac{\ln(1 - u)}{\lambda}$.
So $X = -\ln(1 - U)/\lambda$ is exponential; since $1 - U$ is also uniform, $-\ln(U)/\lambda$ works too.
With $\lambda = 0.5$ and a generated $U = 0.7$, the simulated value is $-\ln(0.3)/0.5 \approx 2.408$.

Check by change of variables: $Y = -\ln(U)/\lambda$ is decreasing in $U$ with inverse $u = e^{-\lambda y}$, so
$f_Y(y) = 1 \cdot \left|-\lambda e^{-\lambda y}\right| = \lambda e^{-\lambda y}$ for $y > 0$. ✓

## Common mistakes

- Plugging $g^{-1}(y)$ into $f_X$ but forgetting the factor $|dg^{-1}/dy|$.
- Using the change-of-variables formula for a function that is not monotone on the range of $X$
  (like $x^2$ on an interval containing 0); use the cdf method and handle each branch.
- Forgetting to state the new range of $y$.
- Dropping the absolute value for decreasing $g$, which produces a negative "density."
- Assuming $E[g(X)] = g(E(X))$ — for the lognormal, $E(e^X) \ne e^{E(X)}$.

## Key points

- Discrete: add $p_X(x)$ over all $x$ with $g(x) = y$.
- cdf method: $F_Y(y) = P(g(X) \le y)$, rewrite in terms of $X$, then differentiate.
- Monotone $g$: $f_Y(y) = f_X(g^{-1}(y))\,|dg^{-1}(y)/dy|$; linear case $f_Y(y) = f_X((y - b)/a)/|a|$.
- $Z^2 \sim \chi^2(1)$; $e^X$ for normal $X$ is lognormal.
- $F(X) \sim \text{U}(0, 1)$, and $F^{-1}(U)$ has cdf $F$ (inverse transform sampling).

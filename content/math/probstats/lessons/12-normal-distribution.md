---
id: ps-normal
module: ps-m3
title: The normal distribution
minutes: 45
topics: [Normal distribution, Normal approximation]
drills: [ps-d-normal-prob, ps-d-normal-quantile, ps-d-normal-approx]
refs: [ps-ref-probability]
---
## The bell curve

Measurement errors, heights, test scores and the averages of almost anything tend to follow a
bell-shaped curve. The reason, made precise by the Central Limit Theorem in Module 5, is that
sums of many small independent effects are approximately normal whatever the effects
themselves look like. This lesson develops the normal distribution itself: why its density
integrates to 1, its mean, variance and MGF, how standardizing reduces every normal calculation
to one table, and how it approximates the binomial.

## The density

$X$ has the **normal distribution** with mean $\mu$ and variance $\sigma^2$, written
$X \sim \text{N}(\mu, \sigma^2)$, if

$$f(x) = \frac{1}{\sigma\sqrt{2\pi}}\exp\left(-\frac{(x - \mu)^2}{2\sigma^2}\right), \qquad -\infty < x < \infty.$$

The curve is symmetric about $\mu$, peaks there, and has inflection points at $\mu \pm \sigma$.
With $\mu = 0$ and $\sigma = 1$ it is the **standard normal** distribution; its variable is
written $Z$, its density $\phi(z) = \tfrac{1}{\sqrt{2\pi}}e^{-z^2/2}$ and its cdf $\Phi(z)$.

**Why the constant is $\sqrt{2\pi}$.** Let $I = \int_{-\infty}^{\infty} e^{-z^2/2}\,dz$. Then
$I^2 = \iint e^{-(x^2 + y^2)/2}\,dx\,dy$ over the plane, and in polar coordinates

$$I^2 = \int_0^{2\pi}\int_0^\infty e^{-r^2/2}\,r\,dr\,d\theta = 2\pi\left[-e^{-r^2/2}\right]_0^\infty = 2\pi.$$

So $I = \sqrt{2\pi}$ and $\phi$ integrates to 1. The function $e^{-z^2/2}$ has no elementary
antiderivative, which is why $\Phi$ is computed numerically and tabulated.

**Mean and variance of $Z$.** $E(Z) = 0$ because $z\phi(z)$ is odd. For the variance, integrate by
parts with $u = z$ and $dv = z\phi(z)\,dz$ (so $v = -\phi(z)$):

$$E(Z^2) = \int z \cdot z\phi(z)\,dz = \big[-z\phi(z)\big]_{-\infty}^{\infty} + \int \phi(z)\,dz = 0 + 1 = 1.$$

## Standardizing

If $X \sim \text{N}(\mu, \sigma^2)$, then the **z-score**

$$Z = \frac{X - \mu}{\sigma} \sim \text{N}(0, 1).$$

*Proof:* $P(Z \le z) = P(X \le \mu + \sigma z) = \int_{-\infty}^{\mu + \sigma z} f(x)\,dx$. Substituting
$u = (x - \mu)/\sigma$, $dx = \sigma\,du$, turns this into $\int_{-\infty}^{z}\phi(u)\,du = \Phi(z)$.
The same substitution shows more generally that $aX + b \sim \text{N}(a\mu + b, a^2\sigma^2)$: a
linear function of a normal variable is normal. Reversing it, $X = \mu + \sigma Z$, so
$E(X) = \mu$ and $\operatorname{Var}(X) = \sigma^2$, justifying the names of the parameters.

Every normal probability therefore reduces to $\Phi$:

$$P(a < X < b) = \Phi\left(\frac{b - \mu}{\sigma}\right) - \Phi\left(\frac{a - \mu}{\sigma}\right),$$

and symmetry gives $\Phi(-z) = 1 - \Phi(z)$. About 68%, 95% and 99.7% of the probability lies
within 1, 2 and 3 standard deviations of the mean (more precisely 0.6827, 0.9545, 0.9973).

Quantiles go the other way: the $p$-quantile of $X$ is $x_p = \mu + \sigma z_p$, where
$\Phi(z_p) = p$. Useful values: $z_{0.90} = 1.2816$, $z_{0.95} = 1.6449$, $z_{0.975} = 1.9600$,
$z_{0.99} = 2.3263$.

**MGF.** Completing the square, $tz - z^2/2 = t^2/2 - (z - t)^2/2$, so
$M_Z(t) = e^{t^2/2}\int \phi(z - t)\,dz = e^{t^2/2}$. Then $M_X(t) = e^{\mu t}M_Z(\sigma t)$:

$$M_X(t) = \exp\left(\mu t + \tfrac12\sigma^2t^2\right).$$

Its logarithm $\mu t + \sigma^2t^2/2$ has $R'(0) = \mu$ and $R''(0) = \sigma^2$, as it should. A
consequence via MGFs: the sum of independent normals is normal, with the means and variances
added.

### Example 1: bolt lengths

Bolt lengths are $\text{N}(50.0, 0.4^2)$ mm, and the specification is 49.3 to 50.8 mm.

1. Standardize the limits: $z = \dfrac{49.3 - 50}{0.4} = -1.75$ and $z = \dfrac{50.8 - 50}{0.4} = 2$.
2. $P = \Phi(2) - \Phi(-1.75) = 0.97725 - 0.04006 \approx 0.9372$.
3. So about 6.3% of bolts are out of spec, most of them short (4.0%) rather than long (2.3%).

```plot
{"x": [48.6, 51.4], "y": [0, 1.1], "xLabel": "mm", "yLabel": "f(x)", "functions": [{"f": "normpdf(x, 50, 0.4)"}], "shade": [{"f": "normpdf(x, 50, 0.4)", "from": 49.3, "to": 50.8}], "caption": "N(50, 0.4²); shaded: the in-spec area between 49.3 and 50.8, about 0.937"}
```

### Example 2: a percentile

What length is exceeded by only 5% of bolts? We need the 95th percentile:
$x_{0.95} = 50 + 1.6449(0.4) \approx 50.66$ mm.

## Normal approximation to the binomial

A binomial count is a sum of $n$ independent Bernoulli indicators, so for large $n$ it is
approximately normal with the same mean and variance:

$$\text{Bin}(n, p) \approx \text{N}\big(np,\ np(1 - p)\big),$$

a result due to de Moivre and Laplace and the first instance of the Central Limit Theorem. A
common guideline is $np \ge 10$ and $n(1 - p) \ge 10$, so the distribution is not crammed against
0 or $n$. This course uses 10; many textbooks use the looser cutoff 5, so check which one a
problem expects.

**Continuity correction.** The binomial puts its probability on whole numbers; picture each
$P(X = k)$ as a bar of width 1 from $k - 0.5$ to $k + 0.5$. To approximate $P(X \le k)$ by an area
under the normal curve, stop at the right edge of the last bar, $k + 0.5$:

$$P(X \le k) \approx \Phi\left(\frac{k + 0.5 - np}{\sqrt{np(1-p)}}\right), \qquad P(X \ge k) \approx 1 - \Phi\left(\frac{k - 0.5 - np}{\sqrt{np(1-p)}}\right).$$

For a single value, $P(X = k) \approx P(k - 0.5 < Y < k + 0.5)$ with $Y$ normal. The
**continuity correction** matters most when $\sigma$ is small and is negligible when it is large.

```plot
{"bars": [{"x": 18, "height": 0.0024, "width": 0.9, "color": "#c05621"}, {"x": 19, "height": 0.0044, "width": 0.9, "color": "#c05621"}, {"x": 20, "height": 0.0076, "width": 0.9, "color": "#c05621"}, {"x": 21, "height": 0.0124, "width": 0.9, "color": "#c05621"}, {"x": 22, "height": 0.019, "width": 0.9, "color": "#c05621"}, {"x": 23, "height": 0.0277, "width": 0.9, "color": "#c05621"}, {"x": 24, "height": 0.038, "width": 0.9, "color": "#c05621"}, {"x": 25, "height": 0.0496, "width": 0.9, "color": "#c05621"}, {"x": 26, "height": 0.0613, "width": 0.9}, {"x": 27, "height": 0.072, "width": 0.9}, {"x": 28, "height": 0.0804, "width": 0.9}, {"x": 29, "height": 0.0856, "width": 0.9}, {"x": 30, "height": 0.0868, "width": 0.9}, {"x": 31, "height": 0.084, "width": 0.9}, {"x": 32, "height": 0.0776, "width": 0.9}, {"x": 33, "height": 0.0685, "width": 0.9}, {"x": 34, "height": 0.0579, "width": 0.9}, {"x": 35, "height": 0.0468, "width": 0.9}, {"x": 36, "height": 0.0362, "width": 0.9}, {"x": 37, "height": 0.0268, "width": 0.9}, {"x": 38, "height": 0.0191, "width": 0.9}, {"x": 39, "height": 0.013, "width": 0.9}, {"x": 40, "height": 0.0085, "width": 0.9}, {"x": 41, "height": 0.0053, "width": 0.9}, {"x": 42, "height": 0.0032, "width": 0.9}], "x": [17, 43], "y": [0, 0.1], "xLabel": "k", "yLabel": "P(X = k)", "functions": [{"f": "normpdf(x, 30, 4.5826)"}], "segments": [{"from": [25.5, 0], "to": [25.5, 0.09], "dashed": true}], "caption": "Bin(100, 0.3) and its normal curve; the orange bars are P(X ≤ 25), whose right edge is at 25.5"}
```

### Example 3: with and without the correction

$X \sim \text{Bin}(100, 0.3)$, so $np = 30$ and $\sigma = \sqrt{21} \approx 4.583$. Find $P(X \le 25)$.

1. Exact (by software): $0.1631$.
2. With continuity correction: $z = \dfrac{25.5 - 30}{4.583} \approx -0.982$, $\Phi(-0.982) \approx 0.1631$.
3. Without: $z = \dfrac{25 - 30}{4.583} \approx -1.091$, $\Phi(-1.091) \approx 0.1376$ — off by 0.025,
   because it leaves out half of the bar at 25.

Likewise $P(X = 30) \approx \Phi(0.109) - \Phi(-0.109) \approx 0.0869$, against the exact 0.0868.
Without the correction, a normal approximation to the probability of a single value would be 0.

## Common mistakes

- Dividing by the variance instead of the standard deviation when standardizing.
- Writing $\text{N}(\mu, \sigma)$ when the second parameter in this course is the variance $\sigma^2$
  (always check which convention a problem or calculator uses).
- Forgetting $\Phi(-z) = 1 - \Phi(z)$ and reading the wrong tail.
- Shifting the continuity correction the wrong way: for $X \ge k$ use $k - 0.5$; for $X < k$
  (that is, $X \le k - 1$) use $k - 0.5$ as well.
- Using the normal approximation when $np$ or $n(1-p)$ is small.

## Key points

- $\text{N}(\mu, \sigma^2)$ density $\dfrac{1}{\sigma\sqrt{2\pi}}e^{-(x-\mu)^2/(2\sigma^2)}$; mean $\mu$, variance $\sigma^2$.
- $Z = (X - \mu)/\sigma \sim \text{N}(0, 1)$; $P(a < X < b) = \Phi(z_b) - \Phi(z_a)$; $x_p = \mu + \sigma z_p$.
- Linear functions and independent sums of normals are normal; $M(t) = e^{\mu t + \sigma^2t^2/2}$.
- $\text{Bin}(n, p) \approx \text{N}(np, np(1-p))$ when $np, n(1-p) \ge 10$; use the continuity correction.

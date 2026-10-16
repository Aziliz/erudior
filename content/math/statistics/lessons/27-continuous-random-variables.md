---
id: stat-continuous-rv
module: stat-m6
title: Continuous random variables (with calculus)
minutes: 35
topics: [Continuous random variables]
drills: [stat-uniform, stat-exponential, stat-pdf-constant]
refs: [stat-ref-probability]
---
## From sums to integrals

Discrete random variables add probabilities. A continuous random variable — a waiting
time, a measurement, a lifetime — takes any value in an interval, and its probabilities
are areas under a density curve, as you saw with normal distributions. With calculus, the
areas become integrals, and every formula for discrete variables has a continuous twin:
replace $\sum$ with $\int$ and $p_i$ with $f(x)\,dx$. This lesson is the one place in the
course that uses calculus; the rest of the course needs only its results.

## Probability density functions

A **probability density function** (pdf) $f(x)$ of a continuous random variable $X$
satisfies

$$f(x) \ge 0 \quad\text{for all } x, \qquad \int_{-\infty}^{\infty} f(x)\,dx = 1,$$

and probabilities are areas:

$$P(a \le X \le b) = \int_a^b f(x)\,dx.$$

Since the area over a single point is zero, $P(X = a) = 0$, and $\le$ versus $<$ makes no
difference. A density value $f(x)$ is *not* a probability (it can exceed 1); it is
probability *per unit* of $x$ near that point.

## The cumulative distribution function

The **cumulative distribution function** (cdf) is

$$F(x) = P(X \le x) = \int_{-\infty}^{x} f(t)\,dt.$$

$F$ rises from 0 to 1, $P(a < X \le b) = F(b) - F(a)$, and by the Fundamental Theorem of
Calculus, $F'(x) = f(x)$. The **median** $m$ solves $F(m) = 0.5$; any percentile is found
the same way.

## Mean and variance

$$\mu = E(X) = \int_{-\infty}^{\infty} x f(x)\,dx, \qquad \sigma^2 = \int_{-\infty}^{\infty} (x - \mu)^2 f(x)\,dx = E(X^2) - \mu^2.$$

These are the continuous versions of $\sum x_i p_i$ and $\sum (x_i - \mu)^2 p_i$.

### Example 1: a custom density

Let $f(x) = cx^2$ for $0 \le x \le 3$ and 0 elsewhere.

1. Find $c$: $\int_0^3 cx^2\,dx = c \cdot \dfrac{27}{3} = 9c = 1$, so $c = \tfrac19$.
2. $P(X < 2) = \int_0^2 \tfrac{x^2}{9}\,dx = \dfrac{8}{27} \approx 0.296$.
3. Mean: $\mu = \int_0^3 x \cdot \tfrac{x^2}{9}\,dx = \dfrac{1}{9} \cdot \dfrac{81}{4} = 2.25$.
4. $E(X^2) = \int_0^3 \tfrac{x^4}{9}\,dx = \dfrac{243}{45} = 5.4$, so $\sigma^2 = 5.4 - 2.25^2 = 0.3375$
   and $\sigma \approx 0.581$.
5. cdf: $F(x) = x^3/27$ on $[0, 3]$. Median: $m^3/27 = 0.5$ gives $m = 3\sqrt[3]{0.5} \approx 2.381$.

The median (2.381) exceeds the mean (2.25) — the density piles up on the right, a
left-skewed shape.

```plot
{"x": [-0.3, 3.5], "y": [-0.05, 1.1], "functions": [{"f": "x^2/9", "from": 0, "to": 3}], "shade": [{"f": "x^2/9", "from": 0, "to": 2}], "segments": [{"from": [3, 0], "to": [3, 1]}], "caption": "f(x) = x²/9 on [0, 3]; the shaded area is P(X < 2) = 8/27"}
```

## The uniform distribution

A **uniform distribution** on $[a, b]$ has constant density

$$f(x) = \frac{1}{b - a}, \quad a \le x \le b.$$

Probabilities are just lengths times height: $P(c \le X \le d) = \dfrac{d - c}{b - a}$ for
$a \le c \le d \le b$. Integration gives

$$\mu = \frac{a + b}{2}, \qquad \sigma^2 = \frac{(b - a)^2}{12}.$$

### Example 2

Trains leave every 12 minutes, and you arrive at a random time, so your wait $W$ is
uniform on $[0, 12]$.

1. $P(W > 8) = \dfrac{12 - 8}{12} = \dfrac13$.
2. $\mu = 6$ minutes; $\sigma = \dfrac{12}{\sqrt{12}} \approx 3.46$ minutes.

## The exponential distribution

The **exponential distribution** with rate $\lambda > 0$ models waiting times between
events in a Poisson process:

$$f(x) = \lambda e^{-\lambda x}, \quad x \ge 0; \qquad F(x) = 1 - e^{-\lambda x}.$$

So $P(X > t) = e^{-\lambda t}$. Integration by parts gives

$$\mu = \frac{1}{\lambda}, \qquad \sigma = \frac{1}{\lambda}.$$

*Connection to Poisson*: if events occur at rate $\lambda$ per minute, then "the wait
exceeds $t$ minutes" means "zero events in $t$ minutes," and the Poisson count in that
interval has mean $\lambda t$, so $P(X > t) = e^{-\lambda t}$ — exactly the exponential tail.

Like the geometric distribution, the exponential is **memoryless**:
$P(X > s + t \mid X > s) = e^{-\lambda(s+t)}/e^{-\lambda s} = e^{-\lambda t} = P(X > t)$.
Having waited 10 minutes doesn't make the next arrival any more imminent.

### Example 3

Trucks arrive at a loading dock on average every 5 minutes ($\lambda = 0.2$ per minute).

1. $P(\text{next truck takes more than 8 minutes}) = e^{-0.2 \times 8} = e^{-1.6} \approx 0.2019$.
2. $P(\text{within 2 minutes}) = 1 - e^{-0.4} \approx 0.3297$.
3. Median wait: $1 - e^{-0.2m} = 0.5$ gives $m = \ln 2/0.2 \approx 3.47$ minutes — less than the
   mean of 5, because the distribution is right-skewed.

```plot
{"x": [-0.5, 20], "y": [-0.01, 0.22], "functions": [{"f": "0.2*exp(-0.2*x)", "from": 0, "to": 20}], "shade": [{"f": "0.2*exp(-0.2*x)", "from": 8, "to": 20}], "xLabel": "minutes", "yLabel": "f(x)", "caption": "Exponential density with λ = 0.2; shaded: P(X > 8) ≈ 0.20"}
```

## The normal distribution, revisited

The normal pdf $f(x) = \dfrac{1}{\sigma\sqrt{2\pi}}e^{-(x-\mu)^2/(2\sigma^2)}$ has no
elementary antiderivative, which is why we use tables and technology for its cdf. The facts
from Module 2 — total area 1, mean $\mu$, SD $\sigma$ — can all be verified with these integral
definitions.

### Example 4: percentiles of an exponential distribution

Using the trucks of Example 3 (mean 5 minutes), what waiting time is exceeded only 10% of the
time? Solve $P(X > t) = e^{-0.2t} = 0.10$: $t = -\ln(0.10)/0.2 \approx 11.5$ minutes. Any
percentile of a continuous distribution comes from setting the cdf (or the tail) equal to the
target probability and solving — here the cdf has a closed form, so no table is needed.

## Common mistakes

- Treating $f(x)$ as a probability, or expecting $f(x) \le 1$.
- Forgetting that the pdf must integrate to 1 when finding a constant.
- Using the rate $\lambda$ as the mean of an exponential (the mean is $1/\lambda$).
- Computing $\sigma^2$ as $\int x^2 f(x)\,dx$ without subtracting $\mu^2$.

## Key points

- pdf: $f \ge 0$, total area 1, $P(a \le X \le b) = \int_a^b f$; $P(X = a) = 0$.
- cdf $F(x) = \int_{-\infty}^x f$, $F' = f$; median solves $F(m) = 0.5$.
- $\mu = \int x f$, $\sigma^2 = \int x^2 f - \mu^2$.
- Uniform$[a, b]$: $\mu = (a+b)/2$, $\sigma^2 = (b-a)^2/12$.
- Exponential$(\lambda)$: $P(X > t) = e^{-\lambda t}$, $\mu = \sigma = 1/\lambda$, memoryless.

---
id: ps-uniform-exponential
module: ps-m3
title: The uniform and exponential distributions
minutes: 40
topics: [Uniform distribution, Exponential distribution]
drills: [ps-d-uniform, ps-d-exponential, ps-d-exp-poisson]
refs: [ps-ref-probability]
---
## Two basic continuous models

The uniform distribution says "every value in an interval is equally likely"; the
exponential says "events happen at a constant rate, with no aging." They are the simplest
continuous distributions, and both are workhorses: the uniform underlies random number
generation and rounding error, and the exponential models waiting times between the events of
a Poisson process. Deriving their properties is good practice with the integrals of the last
lesson.

## The uniform distribution

$X$ has the **uniform distribution** on $[a, b]$, written $X \sim \text{U}(a, b)$, if its density
is constant on the interval:

$$f(x) = \frac{1}{b - a}, \quad a \le x \le b \quad (0 \text{ elsewhere}); \qquad F(x) = \frac{x - a}{b - a}, \quad a \le x \le b.$$

The height $1/(b - a)$ is forced by total area 1. Probabilities are proportional to length:
for $a \le c \le d \le b$, $P(c \le X \le d) = (d - c)/(b - a)$.

**Mean:** $E(X) = \dfrac{1}{b - a}\int_a^b x\,dx = \dfrac{b^2 - a^2}{2(b - a)} = \dfrac{a + b}{2}$, the midpoint.

**Variance:** $E(X^2) = \dfrac{b^3 - a^3}{3(b - a)} = \dfrac{a^2 + ab + b^2}{3}$, so

$$\operatorname{Var}(X) = \frac{a^2 + ab + b^2}{3} - \frac{(a + b)^2}{4} = \frac{4a^2 + 4ab + 4b^2 - 3a^2 - 6ab - 3b^2}{12} = \frac{(b - a)^2}{12}.$$

The **standard uniform** $\text{U}(0, 1)$ is special: computers generate it, and lesson 14 shows how
to turn it into a draw from any other distribution.

### Example 1: rounding error

Lengths are recorded to the nearest 0.1 mm, so the rounding error $E$ is modeled as uniform on
$[-0.05, 0.05]$.

1. $E(E) = 0$: rounding is unbiased.
2. $\sigma = \dfrac{0.1}{\sqrt{12}} \approx 0.0289$ mm.
3. $P(|E| < 0.02) = \dfrac{0.02 - (-0.02)}{0.1} = 0.4$.

```plot
{"x": [-0.08, 0.08], "y": [0, 12], "xLabel": "e", "yLabel": "f(e)", "functions": [{"f": "10", "from": -0.05, "to": 0.05}], "shade": [{"f": "10", "from": -0.02, "to": 0.02}], "segments": [{"from": [-0.05, 0], "to": [-0.05, 10], "dashed": true}, {"from": [0.05, 0], "to": [0.05, 10], "dashed": true}], "caption": "U(−0.05, 0.05) has height 10; the shaded area P(|E| < 0.02) = 0.04 × 10 = 0.4"}
```

## The exponential distribution

$X$ has the **exponential distribution** with rate $\lambda > 0$ if

$$f(x) = \lambda e^{-\lambda x}, \quad x \ge 0; \qquad F(x) = 1 - e^{-\lambda x}; \qquad P(X > x) = e^{-\lambda x}.$$

The **survival function** $P(X > x)$ is the easiest form to remember and use.

**Mean** by the tail formula: $E(X) = \int_0^\infty e^{-\lambda x}\,dx = \dfrac{1}{\lambda}$.

**Variance:** integrating by parts, $E(X^2) = \int_0^\infty x^2\lambda e^{-\lambda x}\,dx = \dfrac{2}{\lambda}E(X) = \dfrac{2}{\lambda^2}$,
so $\operatorname{Var}(X) = \dfrac{2}{\lambda^2} - \dfrac{1}{\lambda^2} = \dfrac{1}{\lambda^2}$ and $\sigma = \dfrac{1}{\lambda}$:
the standard deviation equals the mean.

**MGF:** $M(t) = \int_0^\infty e^{tx}\lambda e^{-\lambda x}\,dx = \dfrac{\lambda}{\lambda - t}$ for $t < \lambda$.

Watch the parametrization. Some texts and software use the mean $\beta = 1/\lambda$ instead of the
rate, writing $f(x) = \tfrac{1}{\beta}e^{-x/\beta}$. "Exponential with mean 5" and "exponential with
rate 0.2" are the same distribution.

**Median:** $1 - e^{-\lambda m} = \tfrac12$ gives $m = \dfrac{\ln 2}{\lambda} \approx 0.693/\lambda$, below the mean
because of the long right tail.

## Memorylessness

For $s, t \ge 0$,

$$P(X > s + t \mid X > s) = \frac{e^{-\lambda(s+t)}}{e^{-\lambda s}} = e^{-\lambda t} = P(X > t).$$

An item that has survived to age $s$ has the same remaining-life distribution as a new one. This
**memoryless property** is the continuous twin of the geometric's, and the exponential is the only
continuous distribution with it: if $G(x) = P(X > x)$ satisfies $G(s + t) = G(s)G(t)$, then
$\ln G$ is additive and monotone, hence linear, so $G(x) = e^{-\lambda x}$.

Equivalently, the **hazard rate** $h(x) = f(x)/P(X > x)$ — the instantaneous failure rate among
items that have survived to $x$ — is the constant $\lambda$. Electronic components failing from
random shocks fit this "no aging" model fairly well; mechanical parts that wear out do not
(their hazard rate increases), and the gamma and Weibull families handle those.

## The link to the Poisson process

In a Poisson process with rate $\lambda$, let $T$ be the time until the first event. "$T > t$" means
"no events in $[0, t]$," and that count is Poisson$(\lambda t)$:

$$P(T > t) = P(N(t) = 0) = e^{-\lambda t}.$$

So $T$ is exponential with rate $\lambda$. Because the process starts afresh after each event, the
gaps between successive events are independent exponentials with the same rate. Counts are
Poisson; gaps are exponential — two views of one process. (The waiting time to the $k$-th event
is a sum of $k$ gaps: the gamma distribution of lesson 13.)

### Example 2: trucks at a dock

Trucks arrive as a Poisson process averaging one every 5 minutes, so the wait $T$ for the next
truck is exponential with $\lambda = 0.2$ per minute.

```plot
{"x": [-0.5, 20], "y": [-0.01, 0.22], "xLabel": "minutes", "yLabel": "f(t)", "functions": [{"f": "0.2*exp(-0.2*x)", "from": 0, "to": 20}], "shade": [{"f": "0.2*exp(-0.2*x)", "from": 8, "to": 20}], "caption": "Exponential density with λ = 0.2; shaded tail P(T > 8) = e^(−1.6) ≈ 0.20"}
```

1. $P(T > 8) = e^{-0.2 \times 8} = e^{-1.6} \approx 0.2019$.
2. $P(T \le 2) = 1 - e^{-0.4} \approx 0.3297$.
3. Median wait: $\ln 2/0.2 \approx 3.47$ minutes, versus a mean of 5.
4. The time exceeded only 10% of the time solves $e^{-0.2t} = 0.10$: $t = \ln 10/0.2 \approx 11.5$ minutes.

### Example 3: memoryless lifetimes

A sensor's lifetime is exponential with mean 1000 hours. One has already run 600 hours. The
chance it lasts at least 500 more hours is

$$P(X > 1100 \mid X > 600) = P(X > 500) = e^{-500/1000} = e^{-0.5} \approx 0.607,$$

the same as for a brand-new sensor. Replacing a working exponential component early buys nothing.

### Example 4: two views of the same event

Calls arrive at 3 per hour. The probability of no call in the next 30 minutes is, by counts,
$P(N(0.5) = 0) = e^{-1.5}$, and by gaps, $P(T > 0.5) = e^{-3 \times 0.5} = e^{-1.5} \approx 0.223$.

## Common mistakes

- Using the rate as the mean: with rate $\lambda$, the mean is $1/\lambda$.
- Forgetting to put the rate and time in the same units (per hour versus minutes).
- Using $(b - a)/12$ or $(b - a)/\sqrt{12}$ as the uniform *variance*; it is $(b - a)^2/12$.
- Applying memorylessness to lifetimes that wear out.
- Taking $P(X > x) = 1 - e^{-\lambda x}$; that is the cdf, not the survival function.

## Key points

- $\text{U}(a, b)$: $f = 1/(b - a)$, mean $(a + b)/2$, variance $(b - a)^2/12$.
- Exponential$(\lambda)$: $f = \lambda e^{-\lambda x}$, $P(X > x) = e^{-\lambda x}$, mean $1/\lambda$, variance $1/\lambda^2$,
  median $\ln 2/\lambda$, MGF $\lambda/(\lambda - t)$.
- Memoryless: $P(X > s + t \mid X > s) = P(X > t)$; constant hazard rate $\lambda$.
- In a Poisson process with rate $\lambda$, the gaps between events are independent Exponential$(\lambda)$.

---
id: a2-ref-prob-trig
title: Probability, statistics and trigonometry
---
## Counting

| Idea | Formula | Use when |
|---|---|---|
| Counting principle | $m \cdot n \cdot \ldots$ | A sequence of choices: multiply the options at each step |
| Factorial | $n! = n(n - 1)\cdots 1$, $0! = 1$ | Orders of $n$ different objects |
| Permutations | $_nP_r = \dfrac{n!}{(n - r)!}$ | Choose $r$ of $n$, order matters (ranks, titles, codes without repeats) |
| Combinations | $_nC_r = \dfrac{n!}{r!\,(n - r)!}$ | Choose $r$ of $n$, order doesn't matter (groups, hands, committees) |
| Repeated objects | $\dfrac{n!}{a!\,b!\cdots}$ | Arrangements when $a$, $b$, … objects are identical |

Repeats allowed (PINs, plates): $n^r$. Symmetry: $_nC_r = {}_nC_{n-r}$.

## Probability

| Rule | Formula |
|---|---|
| Equally likely outcomes | $P(A) = \dfrac{\text{favorable}}{\text{total}}$ |
| Complement | $P(A^c) = 1 - P(A)$ |
| "At least one" | $1 - P(\text{none})$ |
| Addition ("or") | $P(A \text{ or } B) = P(A) + P(B) - P(A \text{ and } B)$ |
| Mutually exclusive | $P(A \text{ and } B) = 0$, so $P(A \text{ or } B) = P(A) + P(B)$ |
| Conditional ("given") | $P(B \mid A) = \dfrac{P(A \text{ and } B)}{P(A)}$ |
| Multiplication ("and") | $P(A \text{ and } B) = P(A)\,P(B \mid A)$ |
| Independent | $P(B \mid A) = P(B)$, so $P(A \text{ and } B) = P(A)\,P(B)$ |

Two-way table: for $P(\,\cdot \mid A)$, divide by the total of the row or column for $A$.

## Normal distribution

| Idea | Formula |
|---|---|
| Population standard deviation | $\sigma = \sqrt{\dfrac{\sum (x - \mu)^2}{n}}$ (sample $s$ divides by $n - 1$) |
| z-score | $z = \dfrac{x - \mu}{\sigma}$ |
| Area between $a$ and $b$ | `normalcdf(a, b, μ, σ)`, or table area left of $z_b$ minus left of $z_a$ |
| Value at a percentile $p$ | `invNorm(p, μ, σ)` |
| Margin of error (95%, quick) | $\approx \dfrac{1}{\sqrt n}$ |

68–95–99.7 rule: about 68% within $1\sigma$, 95% within $2\sigma$, 99.7% within $3\sigma$ of $\mu$.

| Below | $\mu - 3\sigma$ | $\mu - 2\sigma$ | $\mu - \sigma$ | $\mu$ | $\mu + \sigma$ | $\mu + 2\sigma$ | $\mu + 3\sigma$ |
|---|---|---|---|---|---|---|---|
| Percent | 0.15% | 2.5% | 16% | 50% | 84% | 97.5% | 99.85% |

| z | 0.5 | 1 | 1.28 | 1.5 | 1.645 | 1.96 | 2 | 2.5 | 3 |
|---|---|---|---|---|---|---|---|---|---|
| Area left of z | 0.6915 | 0.8413 | 0.8997 | 0.9332 | 0.9500 | 0.9750 | 0.9772 | 0.9938 | 0.9987 |

Area left of $-z$ = $1 -$ area left of $z$.

## Angles and the unit circle

| Idea | Formula |
|---|---|
| Degrees ↔ radians | $180^\circ = \pi$; multiply by $\dfrac{\pi}{180^\circ}$ or $\dfrac{180^\circ}{\pi}$ |
| Arc length | $s = r\theta$ ($\theta$ in radians) |
| Coterminal angles | $\theta + 360^\circ k$ or $\theta + 2\pi k$ |
| Unit circle point | $(\cos\theta, \sin\theta)$; $\tan\theta = \dfrac{\sin\theta}{\cos\theta}$ |
| Pythagorean identity | $\sin^2\theta + \cos^2\theta = 1$ |

| $\theta$ | $0$ | $\frac{\pi}{6}$ (30°) | $\frac{\pi}{4}$ (45°) | $\frac{\pi}{3}$ (60°) | $\frac{\pi}{2}$ (90°) | $\pi$ (180°) | $\frac{3\pi}{2}$ (270°) |
|---|---|---|---|---|---|---|---|
| $\sin\theta$ | $0$ | $\frac12$ | $\frac{\sqrt2}{2}$ | $\frac{\sqrt3}{2}$ | $1$ | $0$ | $-1$ |
| $\cos\theta$ | $1$ | $\frac{\sqrt3}{2}$ | $\frac{\sqrt2}{2}$ | $\frac12$ | $0$ | $-1$ | $0$ |

| Quadrant | Reference angle | $\sin$ | $\cos$ |
|---|---|---|---|
| I | $\theta$ | + | + |
| II | $180^\circ - \theta$ | + | − |
| III | $\theta - 180^\circ$ | − | − |
| IV | $360^\circ - \theta$ | − | + |

## Sinusoids

$y = a\sin\big(b(x - h)\big) + k$ or $y = a\cos\big(b(x - h)\big) + k$, $b > 0$:

| Feature | Value |
|---|---|
| Amplitude | $\lvert a \rvert = \dfrac{\max - \min}{2}$ |
| Period | $\dfrac{2\pi}{b}$ (so $b = \dfrac{2\pi}{\text{period}}$) |
| Frequency | $\dfrac{b}{2\pi}$ cycles per unit |
| Midline | $y = k = \dfrac{\max + \min}{2}$ |
| Phase shift | $h$ (right if $h > 0$); factor $b$ out of $bx - c$ first |

Starting points: $\sin$ starts on the midline going up, $\cos$ at a maximum, $-\cos$ at a minimum. Key points are a quarter period apart.

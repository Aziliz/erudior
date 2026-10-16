---
id: de-char-complex
module: de-m5
title: 'Constant coefficients: complex roots'
minutes: 30
topics: [Characteristic equation]
drills: [de-char-complex-ivp, de-char-roots]
refs: [de-ref-solutions]
---
## When the discriminant is negative

For $y'' + 4y = 0$, the characteristic equation $r^2 + 4 = 0$ has no real roots, yet we
know two solutions: $\cos 2t$ and $\sin 2t$. Complex roots are where oscillations come
from, and this lesson shows how to turn them into real sines and cosines. The result is
the formula that describes every vibrating spring, swinging pendulum and oscillating
circuit in Module 6.

## Euler's formula

The bridge between exponentials and trigonometry is **Euler's formula**:

$$e^{i\theta} = \cos\theta + i\sin\theta.$$

One way to see it: substitute $i\theta$ into the Taylor series
$e^x = 1 + x + \frac{x^2}{2!} + \frac{x^3}{3!} + \cdots$ and use $i^2 = -1$; the real terms
form the series for $\cos\theta$ and the imaginary terms the series for $\sin\theta$.
Consequently, for a complex number $\lambda + i\mu$,

$$e^{(\lambda + i\mu)t} = e^{\lambda t}e^{i\mu t} = e^{\lambda t}(\cos\mu t + i\sin\mu t).$$

## From complex solutions to real ones

If $b^2 - 4ac < 0$, the roots are $r = \lambda \pm i\mu$ with

$$\lambda = -\frac{b}{2a}, \qquad \mu = \frac{\sqrt{4ac - b^2}}{2a}.$$

The complex functions $e^{(\lambda \pm i\mu)t}$ solve the equation (the algebra of Lesson 19
works the same with complex $r$). But we want real solutions. Since the equation is linear
with real coefficients, the real and imaginary parts of a complex solution are each
solutions. (If $L[u + iv] = 0$ then $L[u] + iL[v] = 0$, and a complex number is zero only
when both parts are.) So

$$y_1 = e^{\lambda t}\cos\mu t, \qquad y_2 = e^{\lambda t}\sin\mu t$$

are real solutions. Their Wronskian is $\mu e^{2\lambda t} \ne 0$ (since $\mu > 0$), so

$$y = e^{\lambda t}\left(c_1\cos\mu t + c_2\sin\mu t\right).$$

## What the parts mean

- $\mu$ is the **angular frequency** of oscillation (radians per unit time); the period is
  $2\pi/\mu$.
- $e^{\lambda t}$ is the **envelope**: if $\lambda < 0$ the oscillations die out; if
  $\lambda > 0$ they grow; if $\lambda = 0$ they continue forever with constant amplitude.

### Example 1

Solve $y'' + 4y = 0$, $y(0) = 3$, $y'(0) = -4$.

- $r^2 + 4 = 0$ gives $r = \pm 2i$: $\lambda = 0$, $\mu = 2$.
- $y = c_1\cos 2t + c_2\sin 2t$; $y' = -2c_1\sin 2t + 2c_2\cos 2t$.
- $c_1 = 3$; $2c_2 = -4$, so $c_2 = -2$.
- Answer: $y = 3\cos 2t - 2\sin 2t$. A pure oscillation with period $\pi$.

### Example 2

Solve $y'' + 2y' + 5y = 0$, $y(0) = 1$, $y'(0) = 3$.

- $r = \dfrac{-2 \pm \sqrt{4 - 20}}{2} = -1 \pm 2i$: $\lambda = -1$, $\mu = 2$.
- $y = e^{-t}(c_1\cos 2t + c_2\sin 2t)$.
- $y(0) = c_1 = 1$.
- $y' = e^{-t}\big[(-c_1 + 2c_2)\cos 2t + (-c_2 - 2c_1)\sin 2t\big]$, so
  $y'(0) = -c_1 + 2c_2 = 3$, giving $c_2 = 2$.
- Answer: $y = e^{-t}(\cos 2t + 2\sin 2t)$.

A handy shortcut for the derivative condition: $y'(0) = \lambda c_1 + \mu c_2$. Here
$-1(1) + 2c_2 = 3$.

```plot
{"x": [0, 6], "y": [-2.5, 2.5], "xLabel": "t", "functions": [{"f": "exp(-x)*(cos(2x) + 2sin(2x))", "label": "y(t)"}, {"f": "sqrt(5)exp(-x)", "dashed": true}, {"f": "-sqrt(5)exp(-x)", "dashed": true}], "labels": [{"at": [2.4, 1.2], "text": "envelope ±√5 e^(−t)"}], "caption": "y = e^(−t)(cos 2t + 2 sin 2t): oscillation inside a decaying envelope."}
```

## Amplitude–phase form

A combination $c_1\cos\mu t + c_2\sin\mu t$ is a single sinusoid:

$$c_1\cos\mu t + c_2\sin\mu t = R\cos(\mu t - \delta), \qquad R = \sqrt{c_1^2 + c_2^2},$$

where $\cos\delta = c_1/R$ and $\sin\delta = c_2/R$. (Expand $R\cos(\mu t - \delta)$ with the
angle-difference formula to check.) $R$ is the **amplitude** and $\delta$ the
**phase angle**. In Example 2, $R = \sqrt{1 + 4} = \sqrt5$ and the envelope of the solution
is $\pm\sqrt5\,e^{-t}$, the dashed curves in the figure.

### Example 3

Write $y = 3\cos 2t - 2\sin 2t$ (Example 1) in amplitude–phase form.

- $R = \sqrt{9 + 4} = \sqrt{13} \approx 3.606$.
- $\cos\delta = 3/\sqrt{13} > 0$ and $\sin\delta = -2/\sqrt{13} < 0$, so $\delta$ is in the
  fourth quadrant: $\delta = -\arctan(2/3) \approx -0.588$ rad.
- $y = \sqrt{13}\cos(2t + 0.588)$. The maximum displacement is about 3.606.

Watch the quadrant: $\arctan(c_2/c_1)$ alone gives the right angle only when $c_1 > 0$; if
$c_1 < 0$, add $\pi$.

### Example 4

Solve $y'' - 4y' + 13y = 0$, $y(0) = 0$, $y'(0) = 6$.

- $r = 2 \pm 3i$. $y = e^{2t}(c_1\cos 3t + c_2\sin 3t)$.
- $c_1 = 0$; $y'(0) = 2c_1 + 3c_2 = 6$, so $c_2 = 2$.
- Answer: $y = 2e^{2t}\sin 3t$, an oscillation that *grows*, since $\lambda = 2 > 0$.

## Summary of the three cases

For $ay'' + by' + cy = 0$:

| Roots | Solution | Behaviour |
|---|---|---|
| $r_1 \ne r_2$ real | $c_1e^{r_1t} + c_2e^{r_2t}$ | no oscillation; at most one sign change |
| $r$ repeated | $(c_1 + c_2t)e^{rt}$ | no oscillation |
| $\lambda \pm i\mu$ | $e^{\lambda t}(c_1\cos\mu t + c_2\sin\mu t)$ | oscillates; decays if $\lambda < 0$ |

## Common mistakes

- **Putting $i$ in the answer.** The final real solution has no $i$.
- **Using $\mu$ as the exponent.** The real part $\lambda$ goes in $e^{\lambda t}$; the
  imaginary part $\mu$ goes inside $\cos$ and $\sin$.
- **Forgetting to divide by $2a$** when finding $\lambda$ and $\mu$.
- **Wrong $y'(0)$.** Differentiate the product; $y'(0) = \lambda c_1 + \mu c_2$, not $\mu c_2$
  alone (unless $\lambda = 0$).
- **Quadrant errors** in the phase angle.

## Key points

- Complex roots $\lambda \pm i\mu$ give $y = e^{\lambda t}(c_1\cos\mu t + c_2\sin\mu t)$.
- $\mu$ sets the angular frequency, $e^{\lambda t}$ the envelope.
- $c_1\cos\mu t + c_2\sin\mu t = R\cos(\mu t - \delta)$ with $R = \sqrt{c_1^2 + c_2^2}$.

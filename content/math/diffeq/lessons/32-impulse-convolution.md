---
id: de-laplace-impulse
module: de-m7
title: Impulses and convolution
minutes: 35
topics: [Impulses and convolution]
drills: [de-impulse-response, de-convolution]
refs: [de-ref-laplace]
---
## Very short, very strong forces

A hammer strikes a mass on a spring. A bat hits a ball. A lightning surge hits a circuit.
These forces act for a tiny time but transfer a definite amount of momentum (or charge).
Modeling them with step functions is clumsy; the right tool is the Dirac delta, an idealized
impulse. This lesson introduces it, then uses it to reach a powerful idea: the response of a
linear system to *any* input is a convolution of the input with the system's response to an
impulse.

## The Dirac delta

Consider a pulse of height $1/\varepsilon$ and width $\varepsilon$ starting at $t = c$:
$d_\varepsilon(t) = \dfrac{u_c(t) - u_{c + \varepsilon}(t)}{\varepsilon}$. Its area (the **impulse**,
$\int F\,dt$) is always 1. As $\varepsilon \to 0$ it gets taller and narrower. The limiting
object is the **Dirac delta** $\delta(t - c)$, characterized by:

$$\delta(t - c) = 0 \text{ for } t \ne c, \qquad \int_{-\infty}^{\infty}\delta(t - c)\,dt = 1,$$

and, more usefully, the **sifting property**: for continuous $f$,

$$\int_{-\infty}^{\infty}f(t)\,\delta(t - c)\,dt = f(c).$$

No ordinary function behaves this way; $\delta$ is a "generalized function", but every
calculation in this course is justified by the limit of $d_\varepsilon$.

The pulses $d_\varepsilon$ for three widths show what "taller and narrower with the same area"
means: each rectangle has area 1.

```plot
{"x": [0, 3], "y": [0, 4.5], "xLabel": "t", "segments": [{"from": [0, 0], "to": [1, 0]}, {"from": [1, 0], "to": [1, 1]}, {"from": [1, 1], "to": [2, 1]}, {"from": [2, 1], "to": [2, 0]}, {"from": [2, 0], "to": [3, 0]}, {"from": [1, 0], "to": [1, 2], "dashed": true}, {"from": [1, 2], "to": [1.5, 2], "dashed": true}, {"from": [1.5, 2], "to": [1.5, 0], "dashed": true}, {"from": [1, 0], "to": [1, 4]}, {"from": [1, 4], "to": [1.25, 4]}, {"from": [1.25, 4], "to": [1.25, 0]}], "labels": [{"at": [2.3, 1.2], "text": "ε = 1, height 1"}, {"at": [2.05, 2.2], "text": "ε = 0.5, height 2"}, {"at": [1.85, 4.2], "text": "ε = 0.25, height 4"}], "caption": "Pulses d_ε starting at c = 1 with widths 1, 0.5 and 0.25: each has area 1, and as ε → 0 they approach δ(t − 1)."}
```

### Its transform

By sifting with $f(t) = e^{-st}$:

$$\mathcal{L}\{\delta(t - c)\} = e^{-cs}, \qquad \mathcal{L}\{\delta(t)\} = 1.$$

(Check with the pulse: $\mathcal{L}\{d_\varepsilon\} = e^{-cs}\dfrac{1 - e^{-\varepsilon s}}{\varepsilon s} \to e^{-cs}$.)

## Impulsive forcing

### Example 1

A spring–mass system $y'' + 4y = 0$ starts at rest at equilibrium, and at $t = 1$ receives a
unit impulse: $y'' + 4y = \delta(t - 1)$, $y(0) = y'(0) = 0$.

- $(s^2 + 4)Y = e^{-s}$, so $Y = \dfrac{e^{-s}}{s^2 + 4}$.
- $\mathcal{L}^{-1}\left\{\dfrac{1}{s^2 + 4}\right\} = \tfrac12\sin 2t$, so
  $y = \tfrac12u_1(t)\sin 2(t - 1)$.
- Nothing happens until $t = 1$; then the mass oscillates. At $t = 1$ the position is still 0
  but the velocity jumps from 0 to 1: an impulse changes momentum instantly.

### Example 2: a struck damped system

Solve $y'' + 2y' + 2y = 3\delta(t - \pi)$, $y(0) = 1$, $y'(0) = -1$.

- $(s^2Y - s + 1) + 2(sY - 1) + 2Y = 3e^{-\pi s}$.
- $(s^2 + 2s + 2)Y = s + 1 + 3e^{-\pi s}$.
- $Y = \dfrac{s + 1}{(s + 1)^2 + 1} + \dfrac{3e^{-\pi s}}{(s + 1)^2 + 1}$.
- $y = e^{-t}\cos t + 3u_\pi(t)e^{-(t - \pi)}\sin(t - \pi)$.

```plot
{"x": [0, 8], "y": [-0.4, 1.1], "xLabel": "t", "functions": [{"f": "exp(-x)*cos(x)", "to": 3.1416, "label": "before kick"}, {"f": "exp(-x)*cos(x) + 3exp(-(x - pi))*sin(x - pi)", "from": 3.1416, "label": "after kick"}], "points": [{"at": [3.1416, -0.0432]}], "caption": "A damped oscillator kicked at t = π: the graph has a corner where the velocity jumps."}
```

## The transfer function and impulse response

For $ay'' + by' + cy = g(t)$ with zero initial conditions, the transform gives

$$Y(s) = \frac{1}{as^2 + bs + c}\,G(s) = H(s)G(s).$$

$H(s) = \dfrac{1}{as^2 + bs + c}$ is the **transfer function**. If $g = \delta(t)$, then $G = 1$
and $Y = H$: so $h(t) = \mathcal{L}^{-1}\{H\}$ is the **impulse response**, the system's reaction
to a single kick at $t = 0$. For general $g$, the output transform is $H \times G$. What
function of $t$ has a product of transforms as its transform?

```mermaid
flowchart LR
  accTitle: A linear system as a block
  accDescr: An input g of t with transform G of s enters a block labeled with the transfer function H of s. The output has transform Y of s equal to H of s times G of s, which in the time domain is the convolution y equals h star g, for zero initial conditions.
  G["Input g(t), G(s)"] --> H["System H(s)"]
  H --> Y["Output Y = H·G, y = h * g"]
```

## Convolution

The **convolution** of $f$ and $g$ is

$$(f * g)(t) = \int_0^t f(t - \tau)\,g(\tau)\,d\tau.$$

**Convolution theorem:** $\mathcal{L}\{f * g\} = F(s)G(s)$.

So the zero-initial-condition response to any forcing is $y = h * g$:

$$y(t) = \int_0^t h(t - \tau)\,g(\tau)\,d\tau.$$

Interpretation: the input at time $\tau$ is a little impulse of size $g(\tau)\,d\tau$; by time
$t$ the system has responded to it by $h(t - \tau)g(\tau)\,d\tau$; linearity lets us add all
these responses. For $y'' + \omega^2y = g$, $h(t) = \dfrac1\omega\sin\omega t$, and this is
exactly the variation-of-parameters formula from Lesson 23.

Convolution behaves like multiplication: $f * g = g * f$ and $f * (g_1 + g_2) = f * g_1 + f * g_2$.
But $f * 1 \ne f$ in general: $(f * 1)(t) = \int_0^t f(\tau)\,d\tau$.

### Example 3: computing a convolution

Find $t * e^{t}$ directly and check with transforms.

- $(t * e^t) = \displaystyle\int_0^t (t - \tau)e^{\tau}\,d\tau$. By parts: $= \big[(t - \tau)e^\tau\big]_0^t + \int_0^t e^\tau\,d\tau = -t + e^t - 1$.
- Transform: $\dfrac{1}{s^2}\cdot\dfrac{1}{s - 1}$. Partial fractions:
  $\dfrac{1}{s^2(s - 1)} = \dfrac{1}{s - 1} - \dfrac1s - \dfrac{1}{s^2}$, inverting to $e^t - 1 - t$. ✓

### Example 4: inverting a product

Find $\mathcal{L}^{-1}\left\{\dfrac{1}{(s^2 + 1)^2}\right\}$.

- Write it as $\dfrac{1}{s^2 + 1}\cdot\dfrac{1}{s^2 + 1}$, so the answer is $\sin t * \sin t$.
- $\displaystyle\int_0^t \sin(t - \tau)\sin\tau\,d\tau = \tfrac12\int_0^t\big[\cos(t - 2\tau) - \cos t\big]d\tau = \tfrac12(\sin t - t\cos t)$.

This is the resonance response: $y'' + y = \sin t$ from rest gives $\tfrac12(\sin t - t\cos t)$,
with the growing $t\cos t$ term.

### Example 5: an answer as an integral

Solve $y'' + 9y = g(t)$, $y(0) = y'(0) = 0$, for an unspecified forcing $g$.

$H = \dfrac{1}{s^2 + 9}$, $h = \tfrac13\sin 3t$, so $y(t) = \dfrac13\displaystyle\int_0^t\sin\big(3(t - \tau)\big)g(\tau)\,d\tau$.
Plug in any $g$ (measured data, even) and integrate numerically.

## Common mistakes

- **Thinking $\delta$ is just a big number.** Its defining feature is unit area; $3\delta(t - c)$
  delivers impulse 3.
- **Transform of a product.** $\mathcal{L}\{fg\} \ne FG$, but $\mathcal{L}\{f * g\} = FG$.
- **Convolution limits.** The integral runs from 0 to $t$, and the argument of one factor is
  $t - \tau$.
- **Nonzero initial conditions.** $y = h * g$ is the zero-state response; add the response to
  the initial conditions separately.

## Key points

- $\delta(t - c)$: zero except at $c$, unit area, $\int f\delta(t - c)\,dt = f(c)$; $\mathcal{L}\{\delta(t - c)\} = e^{-cs}$.
- An impulse makes the velocity jump; the position stays continuous.
- Transfer function $H = 1/(as^2 + bs + c)$; impulse response $h = \mathcal{L}^{-1}\{H\}$.
- Convolution $(f * g)(t) = \int_0^t f(t - \tau)g(\tau)\,d\tau$; $\mathcal{L}\{f * g\} = FG$; zero-state
  response $y = h * g$.

---
id: de-complex-gain
module: de-m6
title: Sinusoidal response with complex exponentials
minutes: 35
topics: [Complex gain]
drills: [de-gain-phase, de-complex-replace]
refs: [de-ref-solutions]
---
## One division instead of two equations

In the last lesson you found steady-state responses to $F_0\cos\omega t$ by guessing
$A\cos\omega t + B\sin\omega t$, substituting, and solving two equations for $A$ and $B$. It
works, but the answer arrives as two numbers that hide what an engineer actually wants to
know: *how much bigger or smaller* the output is than the input, and *how far behind* it runs.

This lesson replaces the cosine by a complex exponential. Differentiating $e^{rt}$ only
multiplies it by $r$, so the whole equation collapses to one complex division, and the
answer comes out directly in amplitude–phase form. You'll need Euler's formula
$e^{i\theta} = \cos\theta + i\sin\theta$ from Lesson 20 and a little complex arithmetic.

## The characteristic polynomial as an operator

Write a constant-coefficient linear equation as $p(D)x = f(t)$, where $D$ means $d/dt$ and
$p$ is the characteristic polynomial. For $mx'' + \gamma x' + kx$, $p(r) = mr^2 + \gamma r + k$.
The key fact is

$$p(D)e^{rt} = p(r)\,e^{rt},$$

because each derivative of $e^{rt}$ brings down one factor of $r$. Lesson 19 used this with
$p(r) = 0$ to find homogeneous solutions; now we use it when $p(r) \ne 0$.

## Complex replacement

Since $\cos\omega t = \operatorname{Re}\,e^{i\omega t}$, solve the **complexified equation**

$$p(D)z = F_0e^{i\omega t}$$

instead. Try $z = Ce^{i\omega t}$: the left side is $Cp(i\omega)e^{i\omega t}$, so
$C = F_0/p(i\omega)$. This is the **exponential response formula**:

$$z_p = \frac{F_0}{p(i\omega)}\,e^{i\omega t}, \qquad \text{provided } p(i\omega) \ne 0.$$

Because $p$ has real coefficients, taking real parts commutes with $p(D)$:
$p(D)(\operatorname{Re}z) = \operatorname{Re}\big(p(D)z\big) = F_0\cos\omega t$. So
$x_p = \operatorname{Re}z_p$. Replacing a real input with a complex exponential and taking
the real part at the end is called **complex replacement**. For an input $F_0\sin\omega t$,
take the imaginary part instead, since $\sin\omega t = \operatorname{Im}\,e^{i\omega t}$.

### Example 1

Find the steady-state response of $x'' + 2x' + 5x = 10\cos t$ (Example 2 of Lesson 25).

- $p(r) = r^2 + 2r + 5$, so $p(i) = -1 + 2i + 5 = 4 + 2i$.
- $z_p = \dfrac{10}{4 + 2i}e^{it}$. Multiply top and bottom by the conjugate:
  $\dfrac{10(4 - 2i)}{16 + 4} = 2 - i$.
- $z_p = (2 - i)(\cos t + i\sin t)$. Its real part is $2\cos t + \sin t$
  (from $2\cos t$ and $-i \cdot i\sin t = \sin t$).

That matches Lesson 25, with one division in place of a $2 \times 2$ system.

## Gain and phase lag

The real payoff comes from writing $p(i\omega)$ in polar form,
$p(i\omega) = |p(i\omega)|e^{i\phi}$. Then

$$z_p = \frac{F_0}{|p(i\omega)|}e^{i(\omega t - \phi)}, \qquad x_p = \frac{F_0}{|p(i\omega)|}\cos(\omega t - \phi).$$

So the response is a cosine at the input frequency with

- **gain** $g(\omega) = \dfrac{1}{|p(i\omega)|}$: output amplitude $= g \times$ input amplitude;
- **phase lag** $\phi = \arg p(i\omega)$: the response reaches its peaks $\phi/\omega$ time
  units after the input does.

The single complex number $\dfrac{1}{p(i\omega)} = g\,e^{-i\phi}$ is the **complex gain**; it
packages both. (Some books scale the input differently, for example writing the right side
as $k\cos\omega t$, so their gain differs from this one by a constant factor.)

For the spring $p(i\omega) = (k - m\omega^2) + i\gamma\omega$, so

$$g = \frac{1}{\sqrt{(k - m\omega^2)^2 + \gamma^2\omega^2}}, \qquad \tan\phi = \frac{\gamma\omega}{k - m\omega^2}.$$

The gain times $F_0$ is exactly the amplitude $R$ from Lesson 25, and its peak is the
practical resonance found there. Because the imaginary part $\gamma\omega$ is positive,
$p(i\omega)$ lies in the upper half-plane and $0 < \phi < \pi$. Use the quadrant, not just
$\arctan$: below $\omega_0$ the real part is positive and $\phi < \pi/2$; at $\omega_0$ the
real part is zero and $\phi = \pi/2$; above $\omega_0$ the real part is negative and
$\phi > \pi/2$.

```plot
{"x": [0, 3], "y": [0, 4.5], "xLabel": "ω", "yLabel": "gain g(ω)", "functions": [{"f": "1/sqrt((1-x^2)^2+(0.25*x)^2)"}, {"f": "1/sqrt((1-x^2)^2+(0.5*x)^2)", "dashed": true}, {"f": "1/sqrt((1-x^2)^2+(x)^2)"}, {"f": "1/sqrt((1-x^2)^2+(2*x)^2)", "dashed": true}], "labels": [{"at": [1.4, 4.0], "text": "γ = 0.25"}], "caption": "Gain of x″ + γx′ + x = cos ωt (m = k = 1, ω₀ = 1). From the tallest curve down: γ = 0.25, 0.5, 1, 2. Light damping gives a tall peak just below ω₀; with γ² ≥ 2 (the bottom curve) there is no peak."}
```

```plot
{"x": [0, 3], "y": [0, 3.3], "xLabel": "ω", "yLabel": "phase lag φ", "functions": [{"f": "atan2(0.25*x, 1-x^2)"}, {"f": "atan2(x, 1-x^2)", "dashed": true}], "points": [{"at": [1, 1.5708], "label": "φ = π/2 at ω₀"}], "caption": "Phase lag for the same oscillator (solid: γ = 0.25, dashed: γ = 1): near 0 for slow forcing, π/2 at ω₀, approaching π for fast forcing. Lighter damping makes the switch sharper."}
```

The pictures tell the physical story. Shake a spring slowly and the mass follows the hand
(lag near 0, gain near $1/k$). Shake it at $\omega_0$ and it lags by a quarter cycle with a
large amplitude. Shake it fast and it barely moves, half a cycle out of step with you.

### Example 2

An RC-type first-order system $x' + 2x = 4\cos 2t$. Find the gain, phase lag and steady
state.

- $p(r) = r + 2$, so $p(2i) = 2 + 2i$, with $|p(2i)| = 2\sqrt2$ and $\phi = \arctan\frac22 = \frac\pi4$
  (first quadrant).
- Gain $g = \dfrac{1}{2\sqrt2}$; amplitude $4g = \sqrt2$.
- $x_p = \sqrt2\cos\left(2t - \dfrac\pi4\right)$, which expands to $\cos 2t + \sin 2t$.
- Check: $x_p' = -2\sin 2t + 2\cos 2t$, and $x_p' + 2x_p = 4\cos 2t$. ✓ The output peaks
  $\phi/\omega = \pi/8 \approx 0.39$ time units after the input.

## Other exponential inputs

The formula works for any complex exponent $a + ib$. An input $e^{at}\cos bt$ or
$e^{at}\sin bt$ is the real or imaginary part of $e^{(a + ib)t}$, so
$z_p = e^{(a + ib)t}/p(a + ib)$.

### Example 3

Find a particular solution of $y'' + y' + y = e^{-t}\sin t$.

- Complexify: $e^{-t}\sin t = \operatorname{Im}\,e^{(-1 + i)t}$.
- $p(-1 + i) = (-1 + i)^2 + (-1 + i) + 1 = -2i - 1 + i + 1 = -i$.
- $z_p = \dfrac{e^{(-1 + i)t}}{-i} = ie^{-t}(\cos t + i\sin t)$, since $\frac{1}{-i} = i$.
- The imaginary part of $ie^{-t}\cos t - e^{-t}\sin t$ is $e^{-t}\cos t$. So $y_p = e^{-t}\cos t$,
  which you can confirm by substituting.

## When $p(i\omega) = 0$: resonance

If $i\omega$ is a root of $p$, the formula divides by zero; the input frequency is a
natural frequency of the undamped system. Then (for a simple root)

$$z_p = \frac{F_0\,t\,e^{i\omega t}}{p'(i\omega)}.$$

For $x'' + 4x = 3\cos 2t$: $p'(r) = 2r$, $p'(2i) = 4i$, and
$z_p = \dfrac{3t}{4i}e^{2it} = -\dfrac{3i}{4}t(\cos 2t + i\sin 2t)$, whose real part is
$\dfrac34t\sin 2t$, the growing resonance response of Lesson 25.

## Common mistakes

- **Evaluating $p(\omega)$ instead of $p(i\omega)$.** The exponent is $i\omega$; real $\omega$
  loses the damping term's role entirely.
- **Taking the real part too early.** $\operatorname{Re}\dfrac{F_0}{p(i\omega)}$ times
  $\cos\omega t$ is wrong; take the real part of the whole product $\dfrac{F_0}{p(i\omega)}e^{i\omega t}$.
- **Wrong quadrant for $\phi$.** Above $\omega_0$ the real part $k - m\omega^2$ is negative and the
  lag exceeds $\pi/2$; a calculator's $\arctan$ returns a negative angle there.
- **Phase lead vs lag.** The response is $\cos(\omega t - \phi)$ with $\phi = \arg p(i\omega)$;
  the complex gain has angle $-\phi$.
- **Using the real part for a sine input.** For $\sin\omega t$, take the imaginary part.

## Key points

- $p(D)e^{rt} = p(r)e^{rt}$. For input $F_0e^{i\omega t}$, $z_p = \dfrac{F_0}{p(i\omega)}e^{i\omega t}$ if $p(i\omega) \ne 0$.
- Complex replacement: real part for $\cos$ inputs, imaginary part for $\sin$ inputs.
- Steady state $x_p = gF_0\cos(\omega t - \phi)$ with gain $g = 1/|p(i\omega)|$ and phase lag $\phi = \arg p(i\omega)$.
- Spring: $\tan\phi = \dfrac{\gamma\omega}{k - m\omega^2}$, $0 < \phi < \pi$, and $\phi = \pi/2$ at $\omega_0$.
- If $p(i\omega) = 0$ (a simple root), use $z_p = \dfrac{F_0te^{i\omega t}}{p'(i\omega)}$.

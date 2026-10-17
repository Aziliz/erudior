---
id: de-forced-vibrations
module: de-m6
title: Forced vibrations, resonance and RLC circuits
minutes: 35
topics: [Forced vibrations, RLC circuits]
drills: [de-steady-amplitude, de-rlc-type]
refs: [de-ref-solutions, de-ref-models]
---
## Pushing on a spring

Now add an external periodic force, a motor with an off-center weight, wind gusts on a
bridge, a road's bumps under a car:

$$mu'' + \gamma u' + ku = F_0\cos\omega t.$$

The solution is $u = u_c + U$, where $u_c$ is the free vibration from the last lesson and
$U$ comes from undetermined coefficients. The interplay between the **forcing frequency**
$\omega$ and the natural frequency $\omega_0 = \sqrt{k/m}$ produces the most important
phenomena in vibration engineering: beats and resonance.

## Undamped forcing, $\omega \ne \omega_0$

With $\gamma = 0$, guess $U = A\cos\omega t$ (no sine is needed because there's no $u'$
term, though including $B\sin\omega t$ just gives $B = 0$):

$$(k - m\omega^2)A = F_0 \quad\Longrightarrow\quad U = \frac{F_0}{m(\omega_0^2 - \omega^2)}\cos\omega t.$$

The response amplitude $\dfrac{F_0}{m|\omega_0^2 - \omega^2|}$ grows as $\omega$ approaches
$\omega_0$.

### Beats

Start from rest, $u(0) = 0$, $u'(0) = 0$. Then

$$u = \frac{F_0}{m(\omega_0^2 - \omega^2)}(\cos\omega t - \cos\omega_0t) = \frac{2F_0}{m(\omega_0^2 - \omega^2)}\sin\frac{(\omega_0 - \omega)t}{2}\,\sin\frac{(\omega_0 + \omega)t}{2},$$

using the identity $\cos A - \cos B = 2\sin\frac{B - A}{2}\sin\frac{A + B}{2}$. When $\omega$
is close to $\omega_0$, this is a fast oscillation (frequency $\frac{\omega_0 + \omega}{2}$)
inside a slowly varying envelope (frequency $\frac{|\omega_0 - \omega|}{2}$). The amplitude
swells and fades periodically: **beats**, the wah-wah you hear when two guitar strings are
slightly out of tune.

```plot
{"x": [0, 60], "y": [-1.2, 1.2], "xLabel": "t", "yLabel": "u", "functions": [{"f": "sin(0.05x)*sin(0.95x)", "label": "u(t)"}, {"f": "sin(0.05x)", "dashed": true}, {"f": "-sin(0.05x)", "dashed": true}], "caption": "Beats: a fast oscillation inside a slowly varying envelope, when the forcing frequency is close to the natural frequency (here ω₀ = 1, ω = 0.9, scaled)."}
```

## Resonance

When $\omega = \omega_0$ exactly (still undamped), the guess $A\cos\omega_0t$ solves the
homogeneous equation, so the modification rule applies: $U = t(A\cos\omega_0t + B\sin\omega_0t)$.
Working it out:

$$U = \frac{F_0}{2m\omega_0}\,t\sin\omega_0t.$$

The amplitude grows linearly without bound. That's **resonance**: forcing at the natural
frequency pumps energy in on every cycle. In practice something breaks, or the
nonlinear effects and damping that the model ignored take over.

### Example 1

A mass of 1 kg on a spring with $k = 4$ N/m is driven by $F(t) = 3\cos 2t$, starting from
rest at equilibrium. Find the motion.

- $\omega_0 = 2 = \omega$: resonance. $U = \dfrac{3}{2(1)(2)}t\sin 2t = \dfrac34 t\sin 2t$
  (this was Example 5 in Lesson 22).
- $u = c_1\cos 2t + c_2\sin 2t + \tfrac34t\sin 2t$; $u(0) = 0$ gives $c_1 = 0$, and
  $u'(0) = 2c_2 = 0$ gives $c_2 = 0$.
- $u = \tfrac34t\sin 2t$, growing amplitude $\tfrac34t$.

## Damped forcing: transient and steady state

With $\gamma > 0$, the free part $u_c$ decays (all its roots have negative real part), so it's
called the **transient solution**. The particular solution
$U = A\cos\omega t + B\sin\omega t$ persists; it's the **steady-state solution**, oscillating
at the forcing frequency. Its amplitude is

$$R = \frac{F_0}{\sqrt{(k - m\omega^2)^2 + \gamma^2\omega^2}} = \frac{F_0}{\sqrt{m^2(\omega_0^2 - \omega^2)^2 + \gamma^2\omega^2}}.$$

Damping keeps $R$ finite even at $\omega = \omega_0$, where $R = F_0/(\gamma\omega_0)$. For light
damping that's still large, which is why damped systems show a sharp peak in response near
$\omega_0$: **practical resonance**.

The peak is not exactly at $\omega_0$. Minimizing the expression under the square root
(it is a quadratic in $\omega^2$) puts the maximum amplitude at

$$\omega_{\max}^2 = \omega_0^2 - \frac{\gamma^2}{2m^2},$$

slightly below $\omega_0$, provided $\gamma^2 < 2mk$. With heavier damping
($\gamma^2 \ge 2mk$) there is no peak at all: the amplitude simply falls as $\omega$
increases from 0.

### Example 2

Find the steady-state response of $u'' + 2u' + 5u = 10\cos t$ and its amplitude.

- Guess $U = A\cos t + B\sin t$. $U'' = -U$, so the equation becomes
  $4U + 2U' = 10\cos t$:
  - $\cos t$: $4A + 2B = 10$
  - $\sin t$: $4B - 2A = 0$, so $A = 2B$.
- Then $8B + 2B = 10$: $B = 1$, $A = 2$. $U = 2\cos t + \sin t$.
- Amplitude $\sqrt{5} \approx 2.236$. Formula check: $\dfrac{10}{\sqrt{(5 - 1)^2 + 4}} = \dfrac{10}{\sqrt{20}} = \sqrt5$. ✓
- Whatever the initial conditions, $u(t) \to 2\cos t + \sin t$ as the transient
  $e^{-t}(\cdots)$ dies away.

## RLC circuits

A resistor, inductor and capacitor in series with a voltage source $E(t)$ obey Kirchhoff's
law $LI' + RI + q/C = E$ (Lesson 13). Since $I = q'$:

$$Lq'' + Rq' + \frac1Cq = E(t).$$

It's the spring–mass equation with a new dictionary:

| Spring–mass | RLC circuit |
|---|---|
| mass $m$ | inductance $L$ |
| damping $\gamma$ | resistance $R$ |
| spring constant $k$ | $1/C$ |
| displacement $u$ | charge $q$ |
| velocity $u'$ | current $I$ |
| external force $F(t)$ | voltage $E(t)$ |

So everything carries over: the circuit is underdamped when $R^2 < 4L/C$, critically damped
when $R^2 = 4L/C$, overdamped when $R^2 > 4L/C$; its natural frequency is $\omega_0 = 1/\sqrt{LC}$.
Radio tuning works by adjusting $C$ so that $\omega_0$ matches the station's frequency,
creating practical resonance for that signal only.

### Example 3

A circuit has $L = 0.5$ H, $R = 2$ Ω, $C = 0.1$ F, no source, $q(0) = 1$ C, $I(0) = 0$.
Find $q(t)$.

- $0.5q'' + 2q' + 10q = 0$, or $q'' + 4q' + 20q = 0$.
- $R^2 = 4 < 4L/C = 20$: underdamped. $r = -2 \pm 4i$.
- $q = e^{-2t}(A\cos 4t + B\sin 4t)$; $A = 1$; $q'(0) = -2A + 4B = 0$, $B = \tfrac12$.
- $q = e^{-2t}\left(\cos 4t + \tfrac12\sin 4t\right)$ coulombs.

## Common mistakes

- **Missing the modification rule at resonance.** If $\omega = \omega_0$ and $\gamma = 0$, the
  guess needs a factor $t$.
- **Treating the transient as steady state.** The steady state oscillates at the *forcing*
  frequency $\omega$, not at the natural frequency.
- **Wrong RLC dictionary.** The capacitor term is $q/C$, so it plays the role of $k = 1/C$.
- **Using the undamped amplitude formula with damping.**

## Key points

- $mu'' + \gamma u' + ku = F_0\cos\omega t$; solution = transient + steady state.
- Undamped, $\omega \ne \omega_0$: amplitude $F_0/(m|\omega_0^2 - \omega^2|)$; near $\omega_0$, beats.
- Undamped, $\omega = \omega_0$: resonance, $U = \dfrac{F_0}{2m\omega_0}t\sin\omega_0t$.
- Damped steady-state amplitude $F_0/\sqrt{(k - m\omega^2)^2 + \gamma^2\omega^2}$.
- RLC: $Lq'' + Rq' + q/C = E(t)$, the same mathematics with $m \to L$, $\gamma \to R$, $k \to 1/C$.

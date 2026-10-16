---
id: de-free-vibrations
module: de-m6
title: Free vibrations
minutes: 35
topics: [Mechanical vibrations]
drills: [de-spring-k, de-damping-type, de-spring-amplitude]
refs: [de-ref-solutions, de-ref-models]
---
## The spring–mass system

The constant-coefficient theory of Module 5 was built for this lesson. A mass $m$ hangs
from (or slides on) a spring. Let $u(t)$ be its displacement from **equilibrium**, the
rest position where the spring force balances gravity, with $u > 0$ meaning stretched
further. Three forces act on the moving mass:

- The **spring force** $-ku$, by **Hooke's law**, where $k > 0$ is the **spring constant**.
  The minus sign: the spring pulls back toward equilibrium.
- A **damping force** $-\gamma u'$ (friction, air, a shock absorber), opposing the velocity.
  $\gamma \ge 0$ is the damping coefficient.
- An external force $F(t)$ (next lesson; zero for now).

Newton's second law $mu'' = \text{total force}$ gives

$$mu'' + \gamma u' + ku = F(t).$$

(Gravity doesn't appear because we measure from the equilibrium position, where it's
already balanced by the spring's initial stretch.) With $F = 0$ the motion is called a
**free vibration**.

### Finding $k$

If a weight $mg$ stretches the spring a distance $L$ at equilibrium, then $kL = mg$, so
$k = mg/L$. In SI units, $g = 9.8$ m/s²; in US units, $g = 32$ ft/s², and a weight given in
pounds must be divided by 32 to get mass in slugs.

### Example 1

A 2 kg mass stretches a spring 0.49 m. Find $k$. $k = \dfrac{2(9.8)}{0.49} = 40$ N/m.

## Undamped motion

With $\gamma = 0$: $mu'' + ku = 0$. The characteristic roots are $\pm i\omega_0$ with

$$\omega_0 = \sqrt{\frac km},$$

the **natural frequency** (in radians per second). The motion is

$$u = A\cos\omega_0t + B\sin\omega_0t = R\cos(\omega_0t - \delta),$$

**simple harmonic motion** with amplitude $R = \sqrt{A^2 + B^2}$ and period $T = 2\pi/\omega_0$.
A stiffer spring (larger $k$) vibrates faster; a heavier mass, slower.

### Example 2

The 2 kg mass from Example 1 ($k = 40$) is pulled down 0.1 m and released with an upward
velocity of 0.5 m/s. Find the motion, the amplitude and the period. (Down is positive.)

- $2u'' + 40u = 0$, so $\omega_0 = \sqrt{20} \approx 4.472$ rad/s.
- $u(0) = 0.1$, $u'(0) = -0.5$: $A = 0.1$, $B = \dfrac{-0.5}{\sqrt{20}} \approx -0.1118$.
- $u = 0.1\cos\sqrt{20}\,t - 0.1118\sin\sqrt{20}\,t$.
- Amplitude $R = \sqrt{0.01 + 0.0125} = \sqrt{0.0225} = 0.15$ m. Period
  $T = 2\pi/\sqrt{20} \approx 1.405$ s.

## Damped motion

With $\gamma > 0$ the characteristic equation $mr^2 + \gamma r + k = 0$ has roots

$$r = \frac{-\gamma \pm \sqrt{\gamma^2 - 4km}}{2m}.$$

The sign of $\gamma^2 - 4km$ decides the behaviour. The value $\gamma_c = 2\sqrt{km}$ where it
switches is the **critical damping** coefficient.

| Case | Condition | Roots | Motion |
|---|---|---|---|
| **Underdamped** | $\gamma^2 < 4km$ | complex $\lambda \pm i\mu$ | decaying oscillation |
| **Critically damped** | $\gamma^2 = 4km$ | repeated real | returns fastest, no oscillation |
| **Overdamped** | $\gamma^2 > 4km$ | two negative reals | slow return, no oscillation |

In every damped case all roots have negative real part ($\lambda = -\gamma/(2m)$ in the
underdamped case), so $u \to 0$: friction eventually stops the motion.

### Underdamped motion

$u = e^{-\gamma t/(2m)}(A\cos\mu t + B\sin\mu t) = Re^{-\gamma t/(2m)}\cos(\mu t - \delta)$,
with **quasi-frequency** $\mu = \dfrac{\sqrt{4km - \gamma^2}}{2m}$, slightly less than
$\omega_0$, and **quasi-period** $2\pi/\mu$. The mass still crosses equilibrium
infinitely often, but each swing is smaller.

### Example 3

A 1 kg mass on a spring with $k = 10$ N/m has damping $\gamma = 2$ N·s/m. It starts at
$u(0) = 1$ m with $u'(0) = 0$. Classify and solve.

- $\gamma^2 = 4 < 4km = 40$: underdamped.
- $r^2 + 2r + 10 = 0$: $r = -1 \pm 3i$.
- $u = e^{-t}(A\cos 3t + B\sin 3t)$; $A = 1$; $u'(0) = -A + 3B = 0$, so $B = \tfrac13$.
- $u = e^{-t}\left(\cos 3t + \tfrac13\sin 3t\right)$. Quasi-period $2\pi/3 \approx 2.09$ s,
  compared with the undamped period $2\pi/\sqrt{10} \approx 1.99$ s.

```plot
{"x": [0, 6], "y": [-1.2, 1.2], "xLabel": "t", "yLabel": "u", "functions": [{"f": "exp(-x)*(cos(3x) + sin(3x)/3)"}, {"f": "(1 + sqrt(10)x)exp(-sqrt(10)x)"}, {"f": "1.1455exp(-1.127x) - 0.1455exp(-8.873x)"}], "labels": [{"at": [1.6, -0.45], "text": "underdamped"}, {"at": [0.55, 0.1], "text": "critical"}, {"at": [2.2, 0.45], "text": "overdamped"}], "caption": "Same mass and spring (m = 1, k = 10), released from u = 1 at rest, with γ = 2 (underdamped), γ = 2√10 ≈ 6.32 (critical), and γ = 10 (overdamped)."}
```

### Example 4

For the same mass and spring, what damping makes the motion critically damped? Solve with
$u(0) = 1$, $u'(0) = 0$.

- $\gamma_c = 2\sqrt{km} = 2\sqrt{10} \approx 6.325$ N·s/m.
- Double root $r = -\gamma_c/(2m) = -\sqrt{10}$: $u = (A + Bt)e^{-\sqrt{10}t}$.
- $A = 1$; $u'(0) = B - \sqrt{10}A = 0$, so $B = \sqrt{10}$: $u = (1 + \sqrt{10}\,t)e^{-\sqrt{10}t}$.

### Example 5

With $\gamma = 10$ (overdamped), $r^2 + 10r + 10 = 0$ gives $r = -5 \pm \sqrt{15}$, about
$-1.127$ and $-8.873$. The slow root $-1.127$ dominates, so the mass creeps back to
equilibrium more slowly than in the critical case, as the figure shows. That's why car
shock absorbers are designed near critical damping: fast return without bouncing.

## Energy

For undamped motion, multiply $mu'' + ku = 0$ by $u'$: $\dfrac{d}{dt}\left(\tfrac12mu'^2 + \tfrac12ku^2\right) = 0$.
Kinetic plus potential energy is constant. With damping, the same calculation gives
$\dfrac{dE}{dt} = -\gamma u'^2 \le 0$: friction removes energy.

## Common mistakes

- **Weight vs mass.** A "4 lb weight" has mass $4/32 = 1/8$ slug.
- **Sign of initial velocity.** If down is positive, an upward push is negative.
- **Classifying by $\gamma$ alone.** Compare $\gamma^2$ with $4km$, not $\gamma$ with $k$.
- **Confusing $\omega_0$ and $\mu$.** The damped quasi-frequency $\mu$ is smaller than
  $\omega_0 = \sqrt{k/m}$.

## Key points

- $mu'' + \gamma u' + ku = F(t)$, with $k = mg/L$ from the static stretch.
- Undamped: $\omega_0 = \sqrt{k/m}$, $u = R\cos(\omega_0t - \delta)$, period $2\pi/\omega_0$.
- Damped: underdamped if $\gamma^2 < 4km$, critical if $=$, overdamped if $>$; all decay.

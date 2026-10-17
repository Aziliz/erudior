---
id: de-heat-wave
module: de-m9
title: The heat and wave equations
minutes: 40
topics: [Heat and wave equations]
drills: [de-heat-term, de-wave-freq]
refs: [de-ref-solutions]
---
## From ODEs to PDEs

The course ends where Fourier began: with **partial differential equations** for
temperature in a rod and vibrations of a string. The technique, **separation of variables**,
reduces each PDE to ODEs you already know how to solve, and Fourier series stitch the pieces
together to match the initial data. Everything in this course meets here: linear equations,
superposition, characteristic equations, boundary value problems and Fourier series.

## The heat equation

A thin rod of length $L$ with insulated sides has temperature $u(x, t)$ at position $x$ and
time $t$. Heat flows from hot to cold at a rate proportional to the temperature gradient,
and a short derivation (conservation of energy) gives the **heat equation**

$$u_t = \alpha^2u_{xx}, \qquad 0 < x < L,\ t > 0,$$

where $\alpha^2$ is the **thermal diffusivity** of the material. We add:

- **Boundary conditions**: ends held at 0°: $u(0, t) = 0$, $u(L, t) = 0$.
- An **initial condition**: $u(x, 0) = f(x)$, the starting temperature profile.

Intuition: $u_{xx} > 0$ where the profile is concave up (a cold spot between warmer
neighbours), and there $u_t > 0$: it warms. The equation smooths bumps out.

## Separation of variables

Look for solutions of the form $u(x, t) = X(x)T(t)$. Substitute:

$$X(x)T'(t) = \alpha^2X''(x)T(t) \quad\Longrightarrow\quad \frac{T'}{\alpha^2T} = \frac{X''}{X}.$$

The left side depends only on $t$, the right only on $x$. For them to be equal for all $x$
and $t$, both must equal the same constant, written $-\lambda$:

$$X'' + \lambda X = 0, \qquad T' + \alpha^2\lambda T = 0.$$

The boundary conditions become $X(0) = 0$, $X(L) = 0$ (otherwise $T \equiv 0$).

### The eigenvalue problem

$X'' + \lambda X = 0$, $X(0) = X(L) = 0$ is a boundary value problem (Lesson 6). It has
nonzero solutions only for special $\lambda$:

- $\lambda \le 0$: only $X = 0$ (exponentials or lines can't vanish at both ends unless zero).
- $\lambda > 0$: $X = c_1\cos\sqrt\lambda x + c_2\sin\sqrt\lambda x$. $X(0) = 0$ gives $c_1 = 0$;
  $X(L) = c_2\sin\sqrt\lambda L = 0$ needs $\sqrt\lambda L = n\pi$.

So the **eigenvalues** and **eigenfunctions** are

$$\lambda_n = \left(\frac{n\pi}{L}\right)^2, \qquad X_n = \sin\frac{n\pi x}{L}, \qquad n = 1, 2, 3, \dots$$

Then $T' = -\alpha^2\lambda_nT$ gives $T_n = e^{-\alpha^2n^2\pi^2t/L^2}$.

### Superposition and Fourier series

Each $u_n = e^{-\alpha^2n^2\pi^2t/L^2}\sin\dfrac{n\pi x}{L}$ satisfies the PDE and boundary
conditions; the equation is linear and homogeneous, so any sum does too:

$$u(x, t) = \sum_{n=1}^\infty b_ne^{-\alpha^2n^2\pi^2t/L^2}\sin\frac{n\pi x}{L}.$$

At $t = 0$ this must equal $f(x)$: $f(x) = \sum b_n\sin\dfrac{n\pi x}{L}$. That's the Fourier sine
series of $f$, so

$$b_n = \frac2L\int_0^Lf(x)\sin\frac{n\pi x}{L}\,dx.$$

### Example 1

A rod of length $L = 1$ with $\alpha^2 = 0.1$ starts at $u(x, 0) = 3\sin\pi x - \sin 4\pi x$, ends at 0.

- The initial data is already a sine series: $b_1 = 3$, $b_4 = -1$, others 0.
- $u(x, t) = 3e^{-0.1\pi^2t}\sin\pi x - e^{-1.6\pi^2t}\sin 4\pi x$.
- The $n = 4$ mode decays 16 times faster. Higher modes die quickly, so after a short time
  the rod's profile is essentially one sine hump fading away.

### Example 2

Same rod, initial temperature $u(x, 0) = 50$ (uniform). From Lesson 37, Example 3, the sine
series of a constant is $\dfrac{4\cdot50}{\pi}\displaystyle\sum_{n\text{ odd}}\frac1n\sin n\pi x$. So

$$u(x, t) = \frac{200}{\pi}\sum_{n\text{ odd}}\frac1ne^{-0.1n^2\pi^2t}\sin n\pi x.$$

At the center at $t = 1$: the first term is $\dfrac{200}{\pi}e^{-0.1\pi^2}\sin\dfrac\pi2 \approx 63.66 \times 0.3727 \approx 23.7$;
the $n = 3$ term is about $-\dfrac{200}{3\pi}e^{-0.9\pi^2} \approx -0.003$. So $u(0.5, 1) \approx 23.7$.

```plot
{"x": [0, 1], "y": [0, 60], "xLabel": "x", "yLabel": "u", "functions": [{"f": "(200/pi)*(exp(-0.1*pi^2*0.05)*sin(pi*x) + exp(-0.9*pi^2*0.05)*sin(3*pi*x)/3 + exp(-2.5*pi^2*0.05)*sin(5*pi*x)/5 + exp(-4.9*pi^2*0.05)*sin(7*pi*x)/7)", "label": "t = 0.05"}, {"f": "(200/pi)*(exp(-0.1*pi^2*0.5)*sin(pi*x) + exp(-0.9*pi^2*0.5)*sin(3*pi*x)/3)", "label": "t = 0.5"}, {"f": "(200/pi)*exp(-0.1*pi^2*2)*sin(pi*x)", "label": "t = 2"}], "caption": "Temperature profiles for Example 2: the uniform 50° rod loses heat through its ends, and the profile relaxes to a fading sine hump. Top to bottom: t = 0.05, 0.5, 2."}
```

## The wave equation

A taut string of length $L$, fixed at both ends, with small vertical displacement $u(x, t)$
obeys the **wave equation**

$$u_{tt} = a^2u_{xx},$$

where $a = \sqrt{\tau/\rho}$ is the wave speed, with $\tau$ the tension and $\rho$ the string's
linear density (mass per unit length). Being second order in $t$,
it needs two initial conditions: position $u(x, 0) = f(x)$ and velocity $u_t(x, 0) = g(x)$.

Separating $u = X(x)T(t)$ gives the same $X$ problem, so $X_n = \sin\dfrac{n\pi x}{L}$, and now
$T'' + a^2\lambda_nT = 0$: an oscillator! So

$$u(x, t) = \sum_{n=1}^\infty\left(b_n\cos\frac{n\pi at}{L} + c_n\sin\frac{n\pi at}{L}\right)\sin\frac{n\pi x}{L},$$

with $b_n$ the sine coefficients of $f$, and $c_n\dfrac{n\pi a}{L}$ the sine coefficients of $g$.

### Normal modes and music

Each term is a **normal mode** (a standing wave) vibrating at frequency
$\omega_n = \dfrac{n\pi a}{L}$ rad/s, that is $\dfrac{na}{2L}$ cycles per second. The **fundamental**
($n = 1$) sets the pitch; the higher modes are **harmonics** at whole-number multiples, which
is why a plucked string sounds musical. Shortening the string or tightening it (raising $a$)
raises the pitch, just as a guitarist's fingers and tuning pegs do.

### Example 3

A string with $L = 2$, $a = 3$ is released from rest ($g = 0$) with $f(x) = 0.1\sin\dfrac{\pi x}{2} + 0.02\sin\dfrac{3\pi x}{2}$.

- $b_1 = 0.1$, $b_3 = 0.02$, all $c_n = 0$.
- $u = 0.1\cos\dfrac{3\pi t}{2}\sin\dfrac{\pi x}{2} + 0.02\cos\dfrac{9\pi t}{2}\sin\dfrac{3\pi x}{2}$.
- Fundamental frequency $\dfrac{a}{2L} = 0.75$ cycles per second; the third harmonic is 2.25.

## Heat versus waves

| | Heat $u_t = \alpha^2u_{xx}$ | Wave $u_{tt} = a^2u_{xx}$ |
|---|---|---|
| time factor | $e^{-\alpha^2(n\pi/L)^2t}$ (decays) | $\cos$, $\sin$ of $\frac{n\pi at}{L}$ (oscillates) |
| initial data | $u(x, 0)$ | $u(x, 0)$ and $u_t(x, 0)$ |
| long run | $u \to 0$ (with zero-temperature ends) | vibrates forever (no damping) |
| high modes | die fastest; smooths | persist; corners stay sharp |

## Common mistakes

- **Wrong separation constant sign.** Choosing $-\lambda$ makes $\lambda > 0$ the useful case.
- **Using the full Fourier series** on $0 < x < L$ with zero ends; it's a sine series.
- **Forgetting the $n^2$** in the heat equation's exponent.
- **One initial condition for the wave equation.** It needs both $f$ and $g$.

## Key points

- Separation $u = X(x)T(t)$ splits a PDE into ODEs; zero boundary values give
  $X_n = \sin\frac{n\pi x}{L}$, $\lambda_n = (n\pi/L)^2$.
- Heat: $u = \sum b_ne^{-\alpha^2(n\pi/L)^2t}\sin\frac{n\pi x}{L}$, $b_n$ = sine coefficients of $u(x, 0)$.
- Wave: $u = \sum\big(b_n\cos\frac{n\pi at}{L} + c_n\sin\frac{n\pi at}{L}\big)\sin\frac{n\pi x}{L}$; normal
  modes with frequencies $\frac{na}{2L}$.

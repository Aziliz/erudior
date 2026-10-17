---
id: de-heat-boundary
module: de-m9
title: Heat flow with insulated ends and nonzero end temperatures
minutes: 35
topics: [Heat boundary conditions]
drills: [de-heat-insulated, de-heat-steady]
refs: [de-ref-solutions]
---
## Changing what happens at the ends

The last lesson held both ends of the rod at 0°, so every bit of heat eventually leaked out
and the temperature fell to zero. Real rods are treated differently: the ends may be
wrapped so that no heat crosses them, or clamped to blocks kept at two different
temperatures. The heat equation $u_t = \alpha^2u_{xx}$ is unchanged; what changes are the
boundary conditions, and with them the eigenfunctions and the long-run behaviour. This
lesson handles both cases with the tools you already have: separation of variables,
Fourier series, and one new idea, subtracting off a steady state.

## Two kinds of boundary condition

Heat flows from hot to cold at a rate proportional to the temperature gradient (Fourier's
law): the heat flux across a point is $-\kappa u_x$, where $\kappa > 0$ is the conductivity.

- Prescribing the temperature at an end, like $u(0, t) = 0$, is a **Dirichlet boundary
  condition**.
- Prescribing the flux instead is a **Neumann boundary condition**. An **insulated end**
  lets no heat through, so the flux is zero there: $u_x(0, t) = 0$.

A rod insulated at both ends (and along its sides) is a closed box for heat: none enters
or leaves, so it should keep its total heat and just even out.

## Insulated ends: a cosine series

Solve $u_t = \alpha^2u_{xx}$ with $u_x(0, t) = u_x(L, t) = 0$ and $u(x, 0) = f(x)$. Separating
$u = X(x)T(t)$ gives the same two ODEs as before,

$$X'' + \lambda X = 0, \qquad T' + \alpha^2\lambda T = 0,$$

but now with $X'(0) = 0$ and $X'(L) = 0$. Check each sign of $\lambda$:

- $\lambda < 0$: $X = c_1e^{kx} + c_2e^{-kx}$ ($k = \sqrt{-\lambda}$). $X'(0) = 0$ forces $c_1 = c_2$,
  and then $X'(L) = c_1k(e^{kL} - e^{-kL}) = 0$ forces $c_1 = 0$. Nothing.
- $\lambda = 0$: $X = c_1 + c_2x$, and $X' = c_2 = 0$. So *constants survive*: $\lambda_0 = 0$,
  $X_0 = 1$. This is new; with zero ends, $\lambda = 0$ gave nothing.
- $\lambda > 0$: $X = c_1\cos\sqrt\lambda x + c_2\sin\sqrt\lambda x$. $X'(0) = \sqrt\lambda c_2 = 0$ gives
  $c_2 = 0$; then $X'(L) = -c_1\sqrt\lambda\sin\sqrt\lambda L = 0$ needs $\sqrt\lambda L = n\pi$.

So the eigenvalues are $\lambda_n = (n\pi/L)^2$ for $n = 0, 1, 2, \dots$, with eigenfunctions
$\cos\dfrac{n\pi x}{L}$ (the $n = 0$ one is the constant 1). Superposing,

$$u(x, t) = \frac{a_0}{2} + \sum_{n=1}^\infty a_ne^{-\alpha^2(n\pi/L)^2t}\cos\frac{n\pi x}{L},$$

and $t = 0$ asks for the **Fourier cosine series** of $f$ on $(0, L)$:

$$a_n = \frac2L\int_0^Lf(x)\cos\frac{n\pi x}{L}\,dx \qquad (n = 0, 1, 2, \dots).$$

As $t \to \infty$ every term but the constant dies, so

$$u(x, t) \to \frac{a_0}{2} = \frac1L\int_0^Lf(x)\,dx,$$

the *average* of the initial temperature. Heat is conserved and spreads out evenly, as the
physics promised.

### Example 1

An insulated rod with $L = 1$, $\alpha^2 = 0.1$ starts at $u(x, 0) = 100x$ (cold at the left end,
hot at the right).

- Long-run temperature: $\dfrac{a_0}{2} = \displaystyle\int_0^1100x\,dx = 50$.
- For $n \ge 1$, integrate by parts: $a_n = 2\displaystyle\int_0^1100x\cos n\pi x\,dx = \dfrac{200\big((-1)^n - 1\big)}{n^2\pi^2}$,
  which is $-\dfrac{400}{n^2\pi^2}$ for odd $n$ and 0 for even $n$.
- So $u(x, t) = 50 - \dfrac{400}{\pi^2}\displaystyle\sum_{n\text{ odd}}\frac{1}{n^2}e^{-0.1n^2\pi^2t}\cos n\pi x$.
- At the cold end at $t = 1$: the $n = 1$ term is $\dfrac{400}{\pi^2}e^{-0.1\pi^2} \approx 40.53 \times 0.3727 \approx 15.11$,
  and the $n = 3$ term is below 0.001. So $u(0, 1) \approx 50 - 15.11 = 34.89$.

```plot
{"x": [0, 1], "y": [0, 100], "xLabel": "x", "yLabel": "u", "functions": [{"f": "100*x", "dashed": true, "label": "t = 0"}, {"f": "50 - (400/pi^2)*(exp(-0.1*pi^2*0.02)*cos(1*pi*x)/1 + exp(-0.9*pi^2*0.02)*cos(3*pi*x)/9 + exp(-2.5*pi^2*0.02)*cos(5*pi*x)/25 + exp(-4.9*pi^2*0.02)*cos(7*pi*x)/49 + exp(-8.1*pi^2*0.02)*cos(9*pi*x)/81 + exp(-12.1*pi^2*0.02)*cos(11*pi*x)/121)"}, {"f": "50 - (400/pi^2)*(exp(-0.1*pi^2*0.3)*cos(1*pi*x)/1 + exp(-0.9*pi^2*0.3)*cos(3*pi*x)/9 + exp(-2.5*pi^2*0.3)*cos(5*pi*x)/25)"}, {"f": "50 - (400/pi^2)*(exp(-0.1*pi^2*2)*cos(1*pi*x)/1)"}, {"f": "50", "dashed": true}], "caption": "Example 1: the insulated rod starting at u = 100x (dashed line). Profiles at t = 0.02, 0.3 and 2 flatten toward the average, 50, and always meet the ends with zero slope."}
```

Notice the profiles meet the ends with zero slope, exactly what $u_x = 0$ says.

### Example 2

A rod with $L = 2$, $\alpha^2 = 0.5$ and insulated ends starts at
$u(x, 0) = 40 + 12\cos\pi x - 5\cos\dfrac{3\pi x}{2}$. Find $u(0, 0.2)$.

- With $L = 2$, $\cos\pi x = \cos\dfrac{2\pi x}{2}$ is the $n = 2$ mode and $\cos\dfrac{3\pi x}{2}$ is $n = 3$.
  The data is already a cosine series: $\frac{a_0}{2} = 40$, $a_2 = 12$, $a_3 = -5$.
- Decay rates $\alpha^2(n\pi/L)^2$: $0.5\pi^2$ for $n = 2$ and $0.5(1.5\pi)^2 = 1.125\pi^2$ for $n = 3$.
- $u(0, 0.2) = 40 + 12e^{-0.1\pi^2} - 5e^{-0.225\pi^2} \approx 40 + 4.47 - 0.54 = 43.93$.
- Long run: $40$.

### Mixed ends

If one end is held at 0 and the other insulated, say $u(0, t) = 0$ and $u_x(L, t) = 0$, the same
steps give $X_n = \sin\dfrac{(2n - 1)\pi x}{2L}$, $n = 1, 2, \dots$: quarter-waves that vanish at
$x = 0$ and are flat at $x = L$.

| Ends | Eigenfunctions | Long run |
|---|---|---|
| $u = 0$ at both | $\sin\frac{n\pi x}{L}$, $n \ge 1$ | $u \to 0$ |
| insulated at both | $1$ and $\cos\frac{n\pi x}{L}$, $n \ge 1$ | $u \to$ average of $f$ |
| $u(0) = 0$, insulated at $L$ | $\sin\frac{(2n - 1)\pi x}{2L}$, $n \ge 1$ | $u \to 0$ |

## Ends held at nonzero temperatures

Now let $u(0, t) = T_1$ and $u(L, t) = T_2$. Separation fails directly: a sum of products
$X(x)T(t)$ can't equal a nonzero constant at an end for all $t$, because each $T(t)$ decays.
The fix is to find where the rod is heading first.

**Step 1: the equilibrium temperature.** A time-independent solution $v(x)$ has $u_t = 0$, so
$v'' = 0$: a straight line. Matching the ends,

$$v(x) = T_1 + (T_2 - T_1)\frac{x}{L}.$$

**Step 2: subtract it.** Let $w = u - v$. Since $v_t = 0$ and $v_{xx} = 0$, $w$ satisfies the same heat
equation, and its end values are $T_1 - T_1 = 0$ and $T_2 - T_2 = 0$: zero ends, solved in the last
lesson with a sine series. Its initial data is $w(x, 0) = f(x) - v(x)$.

**Step 3: add back.**

$$u(x, t) = v(x) + \sum_{n=1}^\infty b_ne^{-\alpha^2(n\pi/L)^2t}\sin\frac{n\pi x}{L}, \qquad b_n = \frac2L\int_0^L\big(f(x) - v(x)\big)\sin\frac{n\pi x}{L}\,dx.$$

As $t \to \infty$, $u \to v$: the rod settles to a straight-line profile between the two end
temperatures, whatever it started as.

### Example 3

A rod with $L = 1$, $\alpha^2 = 0.1$ is at 20° throughout. At $t = 0$ the left end is kept at 20°
and the right end is suddenly raised to 50°. Find $u(x, t)$ and $u(0.5, 1)$.

- Equilibrium: $v(x) = 20 + 30x$.
- $w(x, 0) = 20 - (20 + 30x) = -30x$. Its sine coefficients (integration by parts, as in
  Lesson 39, Example 4) are $b_n = 2\displaystyle\int_0^1(-30x)\sin n\pi x\,dx = \dfrac{60(-1)^n}{n\pi}$.
- $u(x, t) = 20 + 30x + \dfrac{60}{\pi}\displaystyle\sum_{n=1}^\infty\frac{(-1)^n}{n}e^{-0.1n^2\pi^2t}\sin n\pi x$.
- At $x = 0.5$, even $n$ terms vanish ($\sin n\pi/2 = 0$). The $n = 1$ term is
  $-\dfrac{60}{\pi}e^{-0.1\pi^2} \approx -19.10 \times 0.3727 \approx -7.12$; the $n = 3$ term is under 0.001.
  So $u(0.5, 1) \approx 35 - 7.12 = 27.88$, still well below its final value $v(0.5) = 35$.

```plot
{"x": [0, 1], "y": [0, 55], "xLabel": "x", "yLabel": "u", "functions": [{"f": "20 + 30*x - (60/pi)*exp(-0.1*pi^2*0.01)*sin(1*pi*x)/1 + (60/pi)*exp(-0.4*pi^2*0.01)*sin(2*pi*x)/2 - (60/pi)*exp(-0.9*pi^2*0.01)*sin(3*pi*x)/3 + (60/pi)*exp(-1.6*pi^2*0.01)*sin(4*pi*x)/4 - (60/pi)*exp(-2.5*pi^2*0.01)*sin(5*pi*x)/5 + (60/pi)*exp(-3.6*pi^2*0.01)*sin(6*pi*x)/6 - (60/pi)*exp(-4.9*pi^2*0.01)*sin(7*pi*x)/7 + (60/pi)*exp(-6.4*pi^2*0.01)*sin(8*pi*x)/8 - (60/pi)*exp(-8.1*pi^2*0.01)*sin(9*pi*x)/9 + (60/pi)*exp(-10*pi^2*0.01)*sin(10*pi*x)/10 - (60/pi)*exp(-12.1*pi^2*0.01)*sin(11*pi*x)/11 + (60/pi)*exp(-14.4*pi^2*0.01)*sin(12*pi*x)/12 - (60/pi)*exp(-16.9*pi^2*0.01)*sin(13*pi*x)/13 + (60/pi)*exp(-19.6*pi^2*0.01)*sin(14*pi*x)/14 - (60/pi)*exp(-22.5*pi^2*0.01)*sin(15*pi*x)/15 + (60/pi)*exp(-25.6*pi^2*0.01)*sin(16*pi*x)/16 - (60/pi)*exp(-28.9*pi^2*0.01)*sin(17*pi*x)/17 + (60/pi)*exp(-32.4*pi^2*0.01)*sin(18*pi*x)/18 - (60/pi)*exp(-36.1*pi^2*0.01)*sin(19*pi*x)/19 + (60/pi)*exp(-40*pi^2*0.01)*sin(20*pi*x)/20"}, {"f": "20 + 30*x - (60/pi)*exp(-0.1*pi^2*0.2)*sin(1*pi*x)/1 + (60/pi)*exp(-0.4*pi^2*0.2)*sin(2*pi*x)/2 - (60/pi)*exp(-0.9*pi^2*0.2)*sin(3*pi*x)/3 + (60/pi)*exp(-1.6*pi^2*0.2)*sin(4*pi*x)/4 - (60/pi)*exp(-2.5*pi^2*0.2)*sin(5*pi*x)/5 + (60/pi)*exp(-3.6*pi^2*0.2)*sin(6*pi*x)/6"}, {"f": "20 + 30*x - (60/pi)*exp(-0.1*pi^2*1)*sin(1*pi*x)/1 + (60/pi)*exp(-0.4*pi^2*1)*sin(2*pi*x)/2 - (60/pi)*exp(-0.9*pi^2*1)*sin(3*pi*x)/3"}, {"f": "20 + 30*x", "dashed": true, "label": "v(x)"}], "caption": "Example 3: profiles at t = 0.01, 0.2 and 1 (lowest to highest in the middle) rise from 20° toward the equilibrium line v(x) = 20 + 30x (dashed)."}
```

## Common mistakes

- **Dropping the $n = 0$ term** with insulated ends. The constant mode is the long-run
  temperature; without it the rod would wrongly cool to 0.
- **Using a sine series for insulated ends.** Zero slope at the ends calls for cosines.
- **Separating directly with nonzero end temperatures.** First subtract the equilibrium
  $v(x)$ so the ends become zero.
- **Expanding $f$ instead of $f - v$.** The sine series is for $w(x, 0) = f(x) - v(x)$.
- **Confusing $u_x = 0$ with $u = 0$.** Insulated means no heat flow, not zero temperature.

## Key points

- Dirichlet: $u$ given at an end. Neumann: $u_x$ given; insulated means $u_x = 0$.
- Insulated ends: $u = \frac{a_0}{2} + \sum a_ne^{-\alpha^2(n\pi/L)^2t}\cos\frac{n\pi x}{L}$, $a_n$ from the cosine series of $f$; $u \to$ the average of $f$.
- Ends at $T_1$, $T_2$: $u = v + w$ with $v = T_1 + (T_2 - T_1)x/L$ and $w$ the zero-end solution starting from $f - v$; $u \to v$.
- Each boundary condition picks its own eigenfunctions; the time factors $e^{-\alpha^2\lambda_nt}$ always decay.

---
id: calc-ref-applications
title: Applications of derivatives and integrals
---
## Derivative applications

| Task | Tool |
|---|---|
| Tangent line at $a$ | $y = f(a) + f'(a)(x - a)$ |
| Linear approximation | $f(x) \approx f(a) + f'(a)(x - a)$; differentials $dy = f'(x)\,dx$ |
| Newton's method | $x_{n+1} = x_n - f(x_n)/f'(x_n)$ |
| Related rates | relate quantities, differentiate in $t$, then substitute |
| Critical numbers | $f'(c) = 0$ or undefined, $c$ in domain |
| Absolute extrema on $[a, b]$ | compare $f$ at critical numbers and endpoints |
| First derivative test | $f'$: $+\to-$ max, $-\to+$ min |
| Second derivative test | $f'(c) = 0$: $f''(c) > 0$ min, $< 0$ max, $= 0$ inconclusive |
| Inflection point | $f''$ changes sign (point on the graph) |
| MVT | $f'(c) = \dfrac{f(b) - f(a)}{b - a}$ for some $c \in (a, b)$ |

## Motion along a line

$v = s'$, $a = v' = s''$; speed $= \lvert v\rvert$. Speeding up when $v$ and $a$ have the same sign.

- Displacement on $[a, b]$: $\int_a^b v(t)\,dt$. Distance: $\int_a^b\lvert v(t)\rvert\,dt$.
- Position: $s(b) = s(a) + \int_a^b v(t)\,dt$.
- In the plane, $\mathbf r(t) = \langle x(t), y(t)\rangle$: $\mathbf v = \mathbf r'$, $\mathbf a = \mathbf v'$, speed $\lvert\mathbf v\rvert$; $\mathbf r(b) = \mathbf r(a) + \int_a^b\mathbf v\,dt$; distance $\int_a^b\lvert\mathbf v\rvert\,dt$.

## Area and volume

| Quantity | Formula |
|---|---|
| Area between curves ($f \ge g$) | $\int_a^b[f(x) - g(x)]\,dx$ or $\int_c^d[\text{right} - \text{left}]\,dy$ |
| Disk (about the $x$-axis) | $V = \pi\int_a^b[R(x)]^2\,dx$ |
| Washer | $V = \pi\int_a^b\left([R(x)]^2 - [r(x)]^2\right)dx$ |
| Shell (about a vertical axis) | $V = 2\pi\int_a^b(\text{radius})(\text{height})\,dx$ |
| Known cross sections | $V = \int_a^b A(x)\,dx$ |
| Square cross section, side $s$ | $A = s^2$ |
| Equilateral triangle, side $s$ | $A = \tfrac{\sqrt3}{4}s^2$ |
| Semicircle, diameter $s$ | $A = \tfrac{\pi}{8}s^2$ |
| Isosceles right triangle, leg $s$ | $A = \tfrac12s^2$ |

## Length, surface, physics

| Quantity | Formula |
|---|---|
| Arc length | $L = \int_a^b\sqrt{1 + [f'(x)]^2}\,dx$ |
| Surface area (about $x$-axis) | $S = 2\pi\int_a^b f(x)\sqrt{1 + [f'(x)]^2}\,dx$ |
| Work, variable force | $W = \int_a^b F(x)\,dx$ |
| Hooke's law | $F = kx$, so $W = \tfrac12k(b^2 - a^2)$ from $x = a$ to $b$ |
| Pumping liquid | $W = \int(\rho g)\,A(y)\,(\text{distance lifted})\,dy$ |
| Fluid force on a plate | $F = \int\rho g\,(\text{depth})\,(\text{width})\,dy$ |
| Center of mass of a region | $\bar x = \dfrac{1}{A}\int_a^b x f(x)\,dx$, $\bar y = \dfrac{1}{A}\int_a^b \tfrac12 f(x)^2\,dx$ |

Water: $\rho g \approx 9800$ N/m³ $= 62.4$ lb/ft³.

## Differential equations

| Model | Equation | Solution |
|---|---|---|
| Exponential growth/decay | $\dfrac{dy}{dt} = ky$ | $y = y_0e^{kt}$ |
| Newton's law of cooling | $\dfrac{dT}{dt} = k(T - T_s)$ | $T = T_s + (T_0 - T_s)e^{kt}$ |
| Logistic | $\dfrac{dP}{dt} = kP\left(1 - \dfrac PM\right)$ | $P = \dfrac{M}{1 + Ae^{-kt}}$, $A = \dfrac{M - P_0}{P_0}$ |
| Separable | $\dfrac{dy}{dx} = g(x)h(y)$ | $\int\dfrac{dy}{h(y)} = \int g(x)\,dx$ |
| First-order linear | $\dfrac{dy}{dx} + P(x)y = Q(x)$ | $y = \dfrac1\mu\left(\int\mu Q\,dx + C\right)$, $\mu = e^{\int P\,dx}$ |
| Constant coefficients | $\dfrac{dy}{dt} + ky = b$ | $y = \dfrac bk + \left(y_0 - \dfrac bk\right)e^{-kt}$ |
| Mixing tank | $\dfrac{dQ}{dt} = (\text{rate in}) - \dfrac QV(\text{flow out})$ | linear in $Q$ |
| RL circuit | $L\dfrac{dI}{dt} + RI = E$ | constant $E$: $I = \dfrac ER\left(1 - e^{-Rt/L}\right)$ if $I(0) = 0$ |
| Euler's method | $y_{n+1} = y_n + h\,F(x_n, y_n)$ | |

Half-life: $t_{1/2} = \dfrac{\ln 2}{\lvert k\rvert}$. Logistic growth is fastest at $P = M/2$.

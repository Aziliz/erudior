---
id: de-ref-methods
title: Method chooser
---
## First-order equations $y' = f(t, y)$

| If the equation… | Method | Key step |
|---|---|---|
| is $y' = f(t)$ | Integrate | $y = \int f\,dt + C$ |
| factors as $y' = g(t)h(y)$ | Separation of variables | $\int \frac{dy}{h(y)} = \int g\,dt$; check $h(y) = 0$ |
| is linear: $y' + p(t)y = g(t)$ | Integrating factor | $\mu = e^{\int p\,dt}$, $(\mu y)' = \mu g$ |
| is $M\,dx + N\,dy = 0$ with $M_y = N_x$ | Exact | $F_x = M$, $F_y = N$; $F(x, y) = C$ |
| is $M\,dx + N\,dy = 0$, not exact | Integrating factor $\mu(x)$ or $\mu(y)$ | $\frac{M_y - N_x}{N}$ in $x$ only, or $\frac{N_x - M_y}{M}$ in $y$ only |
| is $y' + py = qy^n$ | Bernoulli | $v = y^{1-n}$: $v' + (1-n)pv = (1-n)q$ |
| is $y' = F(y/x)$ | Homogeneous substitution | $y = vx$, $y' = v + xv'$ |
| is $y' = f(ax + by + c)$ | Linear substitution | $u = ax + by + c$ |
| is $y' = f(y)$ and you want behaviour | Phase line | sign of $f$; $f'(y^*)$ for stability |
| has no formula solution | Numerical | Euler, improved Euler, RK4 |

## Linear equations of order 2 and higher

| Situation | Method |
|---|---|
| Constant coefficients, homogeneous | Characteristic equation $ar^2 + br + c = 0$ |
| $at^2y'' + bty' + cy = 0$ | Cauchy–Euler: try $t^m$, $am(m-1) + bm + c = 0$ |
| One solution $y_1$ known | Reduction of order: $y_2 = y_1\int \frac{e^{-\int p}}{y_1^2}$ |
| Constant coefficients, $g$ = polynomial, $e^{\alpha t}$, $\sin$, $\cos$ (products, sums) | Undetermined coefficients (+ modification rule) |
| Any continuous $g$, or variable coefficients with $y_1, y_2$ known | Variation of parameters |
| Piecewise or impulsive forcing; IVP in one pass | Laplace transform |
| Variable coefficients, no closed form | Power series near an ordinary point |

## Systems

| Situation | Method |
|---|---|
| $\mathbf{x}' = A\mathbf{x}$, constant $A$ | Eigenvalues and eigenvectors |
| Classify the origin quickly | Trace $T$ and determinant $D$ |
| Nonlinear $x' = F$, $y' = G$ | Equilibria + Jacobian linearization |
| Linear system with forcing or steps | Laplace transform of each equation |

## Checks that catch most errors

- Substitute the answer back into the equation and the initial conditions.
- Linear first-order: did you divide by the coefficient of $y'$ first?
- Second order: did you fit constants to $y_c + Y$, not $y_c$ alone?
- Laplace: did you transform the right side and include $sy(0) + y'(0)$?

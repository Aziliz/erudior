---
id: de-laplace-ivp
module: de-m7
title: Solving IVPs with Laplace transforms
minutes: 35
topics: [Laplace transform IVPs]
drills: [de-laplace-ivp1, de-laplace-Ys]
refs: [de-ref-laplace]
---
## The key property: derivatives become multiplication

What makes the Laplace transform useful for differential equations is how it treats
derivatives. Integrate by parts with $u = e^{-st}$, $dv = f'(t)\,dt$:

$$\mathcal{L}\{f'\} = \int_0^\infty e^{-st}f'(t)\,dt = \Big[e^{-st}f(t)\Big]_0^\infty + s\int_0^\infty e^{-st}f(t)\,dt = sF(s) - f(0).$$

(The boundary term at infinity vanishes for functions of exponential order when $s$ is large.)
Applying the rule twice:

$$\mathcal{L}\{f''\} = s\mathcal{L}\{f'\} - f'(0) = s^2F(s) - sf(0) - f'(0).$$

In general $\mathcal{L}\{f^{(n)}\} = s^nF(s) - s^{n-1}f(0) - \cdots - f^{(n-1)}(0)$.

Two things happened. Differentiation in $t$ became multiplication by $s$, and the initial
conditions entered automatically. No separate step for fitting constants.

## The method

1. Take the transform of both sides of the ODE, using the derivative rules and the initial
   conditions.
2. Solve the resulting algebraic equation for $Y(s)$.
3. Invert (partial fractions, completing the square) to find $y(t)$.

```shape
{"segments": [{"from": [2.4, 3], "to": [8.3, 3], "arrow": true, "label": "solve ODE (hard)"}, {"from": [1, 2.7], "to": [1, 1.3], "arrow": true, "label": "ℒ"}, {"from": [2.4, 1], "to": [8.3, 1], "arrow": true, "label": "algebra (easy)"}, {"from": [9, 1.3], "to": [9, 2.7], "arrow": true, "label": "ℒ⁻¹"}], "labels": [{"at": [1, 3], "text": "IVP in t"}, {"at": [9, 3], "text": "y(t)"}, {"at": [1, 1], "text": "equation in s"}, {"at": [9, 1], "text": "Y(s)"}], "caption": "The Laplace route: transform, solve algebraically, invert."}
```

### Example 1: first order

Solve $y' + 3y = 6$, $y(0) = 1$.

- Transform: $sY - 1 + 3Y = \dfrac6s$.
- Solve: $(s + 3)Y = 1 + \dfrac6s$, so $Y = \dfrac{1}{s + 3} + \dfrac{6}{s(s + 3)}$.
- Partial fractions: $\dfrac{6}{s(s + 3)} = \dfrac2s - \dfrac{2}{s + 3}$.
- $Y = \dfrac2s - \dfrac{1}{s + 3}$, so $y = 2 - e^{-3t}$.

Check against Lesson 8: equilibrium 2, and $y(0) = 2 - 1 = 1$. ✓

### Example 2: second order

Solve $y'' - y' - 2y = 0$, $y(0) = 1$, $y'(0) = 0$.

- Transform: $\big(s^2Y - s - 0\big) - \big(sY - 1\big) - 2Y = 0$.
- Collect: $(s^2 - s - 2)Y = s - 1$, so $Y = \dfrac{s - 1}{(s - 2)(s + 1)}$.
- Cover-up: at $s = 2$, $\dfrac{1}{3}$; at $s = -1$, $\dfrac{-2}{-3} = \dfrac23$.
- $y = \tfrac13e^{2t} + \tfrac23e^{-t}$.

Notice the polynomial multiplying $Y$, $s^2 - s - 2$, is exactly the characteristic
polynomial. That's no accident: $e^{rt}$ transforms to $1/(s - r)$, and the characteristic
roots become the poles of $Y(s)$.

### Example 3: forcing

Solve $y'' + 4y = 8$, $y(0) = 0$, $y'(0) = 0$.

- Transform: $(s^2 + 4)Y = \dfrac8s$, so $Y = \dfrac{8}{s(s^2 + 4)}$.
- Partial fractions: $\dfrac{8}{s(s^2 + 4)} = \dfrac{2}{s} - \dfrac{2s}{s^2 + 4}$ (cover-up at
  $s = 0$ gives 2; then compare $s^2$ coefficients).
- $y = 2 - 2\cos 2t$.

### Example 4: exponential forcing

Solve $y'' + 2y' + y = 4e^{t}$, $y(0) = 0$, $y'(0) = 0$.

- Transform: $(s^2 + 2s + 1)Y = \dfrac{4}{s - 1}$, so $Y = \dfrac{4}{(s - 1)(s + 1)^2}$.
- Partial fractions: $\dfrac{A}{s - 1} + \dfrac{B}{s + 1} + \dfrac{C}{(s + 1)^2}$.
  $A = \dfrac{4}{4} = 1$ (cover-up at $s = 1$); $C = \dfrac{4}{-2} = -2$ (cover $(s + 1)^2$, set
  $s = -1$); comparing $s^2$ terms, $0 = A + B$, so $B = -1$.
- $y = e^t - e^{-t} - 2te^{-t}$.

### Example 5: complex roots with initial conditions

Solve $y'' + 2y' + 5y = 0$, $y(0) = 1$, $y'(0) = 3$ (Example 2 of Lesson 20).

- $(s^2Y - s - 3) + 2(sY - 1) + 5Y = 0$, so $(s^2 + 2s + 5)Y = s + 5$.
- $Y = \dfrac{s + 5}{(s + 1)^2 + 4} = \dfrac{(s + 1) + 4}{(s + 1)^2 + 4}$.
- $y = e^{-t}\cos 2t + 2e^{-t}\sin 2t$. Same answer as before, with no constants to fit.

## Systems and higher order

The same steps work for higher-order equations (more initial conditions enter) and for
systems: transforming a system of linear ODEs gives a system of linear algebraic equations
for $X(s)$, $Y(s)$, which you solve by elimination or Cramer's rule before inverting.

## Why bother?

For problems like these, Module 6's methods are just as quick. The Laplace method pays off
when:

- the forcing is piecewise (switched on and off) or impulsive (next two lessons);
- you want the whole solution, including initial conditions, in one pass;
- you care about the transfer function $1/(as^2 + bs + c)$, which engineers use to describe
  how a system responds to any input.

### Example 6: a system

Solve $x' = y$, $y' = -x$ with $x(0) = 1$, $y(0) = 0$.

- Transform each equation: $sX - 1 = Y$ and $sY = -X$.
- Substitute $Y = sX - 1$ into the second: $s(sX - 1) = -X$, so $(s^2 + 1)X = s$.
- $X = \dfrac{s}{s^2 + 1}$, so $x = \cos t$; then $Y = sX - 1 = \dfrac{s^2 - (s^2 + 1)}{s^2 + 1} = -\dfrac{1}{s^2 + 1}$,
  so $y = -\sin t$.
- Check: $x' = -\sin t = y$ and $y' = -\cos t = -x$. ✓

## Common mistakes

- **Dropping initial-condition terms.** $\mathcal{L}\{y''\} = s^2Y - sy(0) - y'(0)$; it's easy to
  forget the $sy(0)$.
- **Sign errors** when collecting: $-(sY - y(0))$ becomes $-sY + y(0)$.
- **Forgetting to transform the right side** (the constant 8 becomes $8/s$, not 8).
- **Improper fractions.** If the numerator of $Y$ has degree $\ge$ the denominator, recheck the
  transform step.

## Key points

- $\mathcal{L}\{y'\} = sY - y(0)$; $\mathcal{L}\{y''\} = s^2Y - sy(0) - y'(0)$.
- Transform, solve for $Y(s)$, invert. Initial conditions are built in.
- The coefficient of $Y$ is the characteristic polynomial; its roots are the poles of $Y$.

---
id: de-runge-kutta
module: de-m4
title: Runge–Kutta methods
minutes: 30
topics: [Numerical methods]
drills: [de-rk4-1step, de-heun-1step]
refs: [de-ref-models]
---
## The standard tool

Improved Euler averaged two slopes and gained an order of accuracy. Sampling more slopes
cleverly gains more. The **Runge–Kutta methods** are a family built on this idea, and the
classical fourth-order member, usually called **RK4**, is the default numerical method in
countless programs. It's accurate, simple to code, and needs no derivatives of $f$ beyond
evaluating $f$ itself.

## The RK4 formulas

To advance $y' = f(t, y)$ from $(t_n, y_n)$ by a step $h$:

$$\begin{aligned}
k_1 &= f(t_n,\ y_n)\\
k_2 &= f\!\left(t_n + \tfrac h2,\ y_n + \tfrac h2 k_1\right)\\
k_3 &= f\!\left(t_n + \tfrac h2,\ y_n + \tfrac h2 k_2\right)\\
k_4 &= f(t_n + h,\ y_n + hk_3)\\
y_{n+1} &= y_n + \frac h6\left(k_1 + 2k_2 + 2k_3 + k_4\right)
\end{aligned}$$

Read it as four slope samples:

- $k_1$: the slope at the start (Euler's slope).
- $k_2$: the slope at the midpoint, reached by following $k_1$ for half a step.
- $k_3$: the slope at the midpoint again, this time reached using the better slope $k_2$.
- $k_4$: the slope at the end, reached using $k_3$ for a full step.

The final slope is a weighted average with weights $1, 2, 2, 1$ (dividing by 6). If $f$
depends only on $t$, then $k_2 = k_3$ and the update becomes
$\frac{h}{6}\left(f(t_n) + 4f(t_n + \tfrac h2) + f(t_n + h)\right)$, which is exactly
**Simpson's rule** for $\int f\,dt$. That connection explains the weights.

RK4 has local error proportional to $h^5$ and global error proportional to $h^4$: halving
$h$ cuts the error by about 16. It costs four evaluations of $f$ per step.

### Example 1

Use one RK4 step with $h = 0.5$ for $y' = t + y$, $y(0) = 1$, then a second, to estimate
$y(1)$.

Step 1 from $(0, 1)$:

- $k_1 = 0 + 1 = 1$
- $k_2 = f(0.25,\ 1 + 0.25(1)) = 0.25 + 1.25 = 1.5$
- $k_3 = f(0.25,\ 1 + 0.25(1.5)) = 0.25 + 1.375 = 1.625$
- $k_4 = f(0.5,\ 1 + 0.5(1.625)) = 0.5 + 1.8125 = 2.3125$
- $y_1 = 1 + \dfrac{0.5}{6}(1 + 3 + 3.25 + 2.3125) = 1 + \dfrac{0.5}{6}(9.5625) = 1.796875$

Step 2 from $(0.5, 1.796875)$ (same pattern) gives $y_2 \approx 3.434692$.

The exact value is $3.436564$, so the error is about 0.0019, using just two steps.
Compare: Euler 0.937, improved Euler 0.155, RK4 0.0019 with the same $h = 0.5$.

### Example 2

One RK4 step with $h = 0.2$ for $y' = y$, $y(0) = 1$:

- $k_1 = 1$
- $k_2 = 1 + 0.1(1) = 1.1$
- $k_3 = 1 + 0.1(1.1) = 1.11$
- $k_4 = 1 + 0.2(1.11) = 1.222$
- $y_1 = 1 + \dfrac{0.2}{6}(1 + 2.2 + 2.22 + 1.222) = 1 + \dfrac{0.2}{6}(6.642) = 1.2214$

Exact: $e^{0.2} = 1.221403$. Multiply out and you'll find that one RK4 step for $y' = y$
multiplies by $1 + h + \dfrac{h^2}{2} + \dfrac{h^3}{6} + \dfrac{h^4}{24}$, the first five
terms of the Taylor series of $e^h$. That's what "fourth order" means.

## Comparing the methods

For $y' = y$, $y(0) = 1$ on $[0, 1]$ (exact $e \approx 2.718282$):

| Method | $h$ | Evaluations of $f$ | Estimate | Error |
|---|---|---|---|---|
| Euler | 0.1 | 10 | 2.593742 | $1.2 \times 10^{-1}$ |
| Improved Euler | 0.1 | 20 | 2.714081 | $4.2 \times 10^{-3}$ |
| RK4 | 0.2 | 20 | 2.718251 | $3.1 \times 10^{-5}$ |
| RK4 | 0.1 | 40 | 2.718280 | $2.1 \times 10^{-6}$ |

For the same work (20 evaluations), RK4 is over 100 times more accurate than improved
Euler. Halving its step from 0.2 to 0.1 cut the error by about 15, close to the predicted 16.

```plot
{"x": [-3, 0], "y": [-6, 0], "xLabel": "log₁₀ h", "yLabel": "log₁₀ error", "functions": [{"f": "x + 0.13", "label": "Euler (slope 1)"}, {"f": "2x - 0.38", "label": "improved Euler (slope 2)"}, {"f": "4x - 1.72", "label": "RK4 (slope 4)"}], "caption": "On log–log axes, error against step size is a line whose slope is the order of the method (approximate, for y′ = y on [0, 1])."}
```

## Systems and higher order

All these methods extend directly to systems $\mathbf{y}' = \mathbf{f}(t, \mathbf{y})$:
treat $y$ and each $k_i$ as vectors. Since any higher-order equation can be rewritten as a
first-order system (Module 8), RK4 handles them too. For example $y'' = -y$ becomes
$y_1' = y_2$, $y_2' = -y_1$.

## When numerical methods struggle

- **Blow-up.** Near a vertical asymptote, as with $y' = y^2$, no fixed step size works;
  the solution changes too fast.
- **Stiff equations.** If a solution has a very fast-decaying component, such as
  $y' = -1000(y - \cos t)$, explicit methods like Euler and RK4 need tiny steps just to
  stay stable, even when the solution itself is smooth. Euler's method on $y' = -\lambda y$
  multiplies by $1 - h\lambda$ each step; if $h\lambda > 2$ that factor has size more than 1
  and the numbers explode. Special implicit methods exist for stiff problems.

## Common mistakes

- **Wrong $t$ arguments.** $k_2$ and $k_3$ use $t_n + h/2$; $k_4$ uses $t_n + h$.
- **Wrong $y$ arguments.** $k_3$ uses $y_n + \tfrac h2 k_2$ (not $k_1$); $k_4$ uses
  $y_n + hk_3$ (full step).
- **Forgetting the weights.** The average is $(k_1 + 2k_2 + 2k_3 + k_4)/6$.
- **Rounding the $k$'s.** Keep full precision through the step.

## Key points

- RK4: four slopes $k_1$ to $k_4$, weighted $1, 2, 2, 1$ over 6.
- Global error $\propto h^4$; halving $h$ cuts error by about 16.
- Order of a method = slope of log(error) against log($h$).
- The same formulas work for systems; stiff problems need special methods.

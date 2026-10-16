---
id: calc-slope-fields-euler
module: calc-m9
title: Slope fields and Euler's method
minutes: 35
topics: [Slope fields, Euler's method]
drills: [calc-d-euler, calc-d-slope-field]
refs: [calc-ref-applications]
---
## Equations about rates

A **differential equation** relates an unknown function to its derivatives. Lesson 21 solved the simplest kind, $\frac{dy}{dx} = f(x)$, by antidifferentiating. But most laws of nature describe a rate in terms of the *current state*: a population grows in proportion to its size ($\frac{dP}{dt} = kP$), a cup of coffee cools in proportion to how much hotter it is than the room. These equations, with $y$ on the right side, can't be solved by simply integrating.

This module introduces them at the AP/Calculus II level. (A full treatment is its own course.) This lesson gives two ways to understand solutions without a formula: a picture (slope fields) and a numerical approximation (Euler's method).

## Solutions and the order of an equation

A **solution** of a differential equation is a function that makes it true. Check by substitution: $y = Ce^{2x}$ solves $y' = 2y$, because $y' = 2Ce^{2x} = 2y$. The constant $C$ means there's a whole family of solutions, the **general solution**. An initial condition such as $y(0) = 3$ picks out a **particular solution** ($C = 3$).

The **order** is the highest derivative that appears: $y' = 2y$ is first order; $y'' + y = 0$ is second order.

### Example 1

Verify that $y = \sin x + \cos x$ solves $y'' + y = 0$.

$y' = \cos x - \sin x$, $y'' = -\sin x - \cos x = -y$. So $y'' + y = 0$. ✓

## Slope fields

A first-order equation $\frac{dy}{dx} = F(x, y)$ tells you the slope of the solution curve through every point $(x, y)$, even though you don't know the curve. Draw a short segment with that slope at each point of a grid: that's a **slope field** (or direction field). Solution curves are the curves that run along the segments, tangent to them everywhere.

### Example 2

Sketch the slope field for $\frac{dy}{dx} = x - y$ and the solution through $(0, 1)$.

Compute a few slopes: at $(0, 0)$, slope 0; at $(1, 0)$, slope 1; at $(0, 1)$, slope $-1$; along the line $y = x$, slope 0 everywhere; along $y = x - 1$, slope 1 everywhere.

```plot
{"x": [-3, 3], "y": [-3, 3], "equal": true, "slopeField": {"f": "x - y", "step": 0.5}, "functions": [{"f": "x - 1 + 2e^(-x)", "label": "through (0, 1)"}, {"f": "x - 1", "dashed": true}], "points": [{"at": [0, 1]}], "caption": "Slope field for dy/dx = x − y. Every solution approaches the line y = x − 1"}
```

Even without solving, the picture shows the long-run behavior: every solution curve bends toward the line $y = x - 1$ (which is itself a solution, since its slope 1 equals $x - (x - 1)$). The particular solution drawn is $y = x - 1 + 2e^{-x}$.

## Reading slope fields

- **Slope depends only on $x$** ($\frac{dy}{dx} = f(x)$): segments in each vertical column are parallel. Solutions are vertical shifts of each other.
- **Slope depends only on $y$** ($\frac{dy}{dx} = g(y)$, called **autonomous**): segments in each horizontal row are parallel. Rows where $g(y) = 0$ are horizontal solutions, called **equilibrium solutions**.
- **Where is the slope 0?** Those points (the nullclines) are where solutions have horizontal tangents.

To match an equation with a field, test a few easy points: along the axes, where the slope should be zero, positive or negative.

### Example 3

Which equation goes with a slope field whose segments are horizontal along the lines $y = 0$ and $y = 4$, point upward between them, and downward above $y = 4$?

Slope depends only on $y$, is zero at $y = 0$ and $y = 4$, positive for $0 < y < 4$ and negative for $y > 4$. That matches $\frac{dy}{dx} = y(4 - y)$, a logistic equation (Lesson 37). Solutions starting between 0 and 4 rise toward 4.

```plot
{"x": [0, 4], "y": [-1, 6], "slopeField": {"f": "y(4 - y)", "step": 0.5}, "functions": [{"f": "4", "dashed": true}, {"f": "0", "dashed": true}], "caption": "dy/dx = y(4 − y): equilibria at y = 0 and y = 4"}
```

## Euler's method

Slope fields give a picture. **Euler's method** gives numbers. Start at the initial point $(x_0, y_0)$, and walk a short step $h$ along the tangent line. At the new point, recompute the slope and repeat:

$$x_{n+1} = x_n + h, \qquad y_{n+1} = y_n + h\cdot F(x_n, y_n).$$

Each step is a linear approximation (Lesson 15) with the slope supplied by the differential equation.

### Example 4

Use Euler's method with step size $h = 0.5$ to approximate $y(2)$ for $\frac{dy}{dx} = x + y$, $y(0) = 1$.

| $n$ | $x_n$ | $y_n$ | slope $x_n + y_n$ | $y_{n+1} = y_n + 0.5\cdot\text{slope}$ |
|---|---|---|---|---|
| 0 | 0 | 1 | 1 | 1.5 |
| 1 | 0.5 | 1.5 | 2 | 2.5 |
| 2 | 1 | 2.5 | 3.5 | 4.25 |
| 3 | 1.5 | 4.25 | 5.75 | 7.125 |

So $y(2) \approx \mathbf{7.125}$. The exact solution is $y = 2e^x - x - 1$, giving $y(2) = 2e^2 - 3 \approx 11.78$. Euler's method underestimated badly here because the solution is concave up and grows fast: each tangent-line step falls below the curve. Halving $h$ roughly halves the error (Euler's method is "first order"), so accuracy costs many steps.

```plot
{"x": [-0.2, 2.2], "y": [0, 13], "functions": [{"f": "2e^x - x - 1", "label": "exact"}], "segments": [{"from": [0, 1], "to": [0.5, 1.5]}, {"from": [0.5, 1.5], "to": [1, 2.5]}, {"from": [1, 2.5], "to": [1.5, 4.25]}, {"from": [1.5, 4.25], "to": [2, 7.125]}], "points": [{"at": [2, 7.125], "label": "Euler ≈ 7.125"}, {"at": [2, 11.78], "label": "exact ≈ 11.78"}], "caption": "Euler steps (segments) lag behind a concave-up solution"}
```

*Over or under?* If solution curves are concave up, Euler's method underestimates; if concave down, it overestimates. You can find concavity from the equation itself: differentiate $F(x, y)$ implicitly to get $\frac{d^2y}{dx^2}$.

## Common mistakes

- *Using the new point's slope* in an Euler step. Each step uses the slope at the *start* of the step.
- **Forgetting to multiply by $h$.** The change in $y$ is slope × step.
- **Reading a slope field's $x$-dependence and $y$-dependence backward.** Parallel segments in columns mean slope depends on $x$ only.
- *Treating an equilibrium as unreachable.* Solutions approach some equilibria (stable) and move away from others (unstable).

## Key points

- A differential equation relates a function to its derivatives; solutions form families, fixed by initial conditions.
- A slope field draws $\frac{dy}{dx} = F(x, y)$ as short segments; solution curves follow them.
- Autonomous equations $\frac{dy}{dx} = g(y)$ have equilibrium solutions where $g(y) = 0$.
- Euler's method: $y_{n+1} = y_n + h\,F(x_n, y_n)$; concave-up solutions are underestimated.

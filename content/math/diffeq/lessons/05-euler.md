---
id: de-euler
module: de-m1
title: Euler's method
minutes: 25
topics: [Euler's method]
drills: [de-euler-2step, de-euler-3step]
refs: [de-ref-models]
---
## When formulas run out

Separation of variables solved the growth models in the last lesson, but most
equations, even innocent-looking ones like $y' = x^2 + y^2$, have no solution formula in
terms of familiar functions. Engineers and scientists still need numbers. The simplest
way to get them is **Euler's method**, which turns the slope field from Lesson 2 into
arithmetic. Module 4 improves on it; here we learn the idea.

## The idea: follow the tangent line for a short step

Start at the known point $(x_0, y_0)$. The equation $y' = f(x, y)$ tells you the slope
there, $f(x_0, y_0)$. Over a short horizontal distance $h$, called the **step size**, the
solution curve stays close to its tangent line, so

$$y(x_0 + h) \approx y_0 + h\,f(x_0, y_0).$$

Call that estimate $y_1$, at $x_1 = x_0 + h$. Now repeat from $(x_1, y_1)$, using the slope
the equation gives *there*. In general:

$$x_{n+1} = x_n + h, \qquad y_{n+1} = y_n + h\,f(x_n, y_n).$$

Each step is "new = old + step × slope". This is just the tangent-line (linear)
approximation from calculus, applied over and over.

## Organizing the work

A table keeps the steps straight. Columns: $n$, $x_n$, $y_n$, slope $f(x_n, y_n)$, and the
increment $h \cdot f$.

### Example 1

Use Euler's method with $h = 0.5$ to estimate $y(1)$ for $y' = x + y$, $y(0) = 1$.

| $n$ | $x_n$ | $y_n$ | slope $x_n + y_n$ | $h\cdot$slope |
|---|---|---|---|---|
| 0 | 0 | 1 | 1 | 0.5 |
| 1 | 0.5 | 1.5 | 2 | 1 |
| 2 | 1 | 2.5 | | |

So $y(1) \approx 2.5$. This equation happens to be solvable (Module 2 shows how): the
exact solution is $y = 2e^x - x - 1$, giving $y(1) = 2e - 2 \approx 3.4366$. The estimate
is too low by about 0.94.

### Example 2

Repeat with $h = 0.25$ (four steps).

| $n$ | $x_n$ | $y_n$ | slope | $h\cdot$slope |
|---|---|---|---|---|
| 0 | 0 | 1 | 1 | 0.25 |
| 1 | 0.25 | 1.25 | 1.5 | 0.375 |
| 2 | 0.5 | 1.625 | 2.125 | 0.53125 |
| 3 | 0.75 | 2.15625 | 2.90625 | 0.7265625 |
| 4 | 1 | 2.8828125 | | |

Now $y(1) \approx 2.883$, with error about 0.55. Halving $h$ roughly halved the error
(0.94 to 0.55). For Euler's method that's typical: the error at a fixed point is roughly
proportional to $h$. Module 4 makes that precise and shows methods whose error falls
much faster.

```plot
{"x": [0, 1.1], "y": [0.8, 3.6], "functions": [{"f": "2exp(x) - x - 1", "label": "exact"}], "segments": [{"from": [0, 1], "to": [0.5, 1.5]}, {"from": [0.5, 1.5], "to": [1, 2.5]}, {"from": [0, 1], "to": [0.25, 1.25], "dashed": true}, {"from": [0.25, 1.25], "to": [0.5, 1.625], "dashed": true}, {"from": [0.5, 1.625], "to": [0.75, 2.15625], "dashed": true}, {"from": [0.75, 2.15625], "to": [1, 2.8828125], "dashed": true}], "points": [{"at": [1, 2.5], "label": "h = 0.5"}, {"at": [1, 2.8828125], "label": "h = 0.25"}, {"at": [1, 3.4366], "label": "exact"}], "caption": "Euler polygons for y′ = x + y, y(0) = 1, with h = 0.5 (solid) and h = 0.25 (dashed)."}
```

## Overestimate or underestimate?

Look at the picture: the solution curve is concave up, so each tangent line lies
*below* the curve, and Euler's method underestimates. In general:

- If solutions are **concave up** on the interval ($y'' > 0$), Euler's method
  **underestimates**.
- If solutions are **concave down** ($y'' < 0$), it **overestimates**.

To decide, differentiate the equation. For $y' = x + y$: $y'' = 1 + y' = 1 + x + y$, which
is positive when $x$ and $y$ are positive, so the estimates are low. Errors also
accumulate: each step starts from a point that is already slightly off, on a neighbouring
solution curve.

### Example 3

For $\dfrac{dy}{dt} = -2y$, $y(0) = 3$, use two Euler steps of size $h = 0.1$ to estimate
$y(0.2)$, and say whether it's too high or too low.

- Step 1: slope $= -2(3) = -6$; $y_1 = 3 + 0.1(-6) = 2.4$.
- Step 2: slope $= -2(2.4) = -4.8$; $y_2 = 2.4 + 0.1(-4.8) = 1.92$.
- $y'' = -2y' = 4y > 0$ for positive $y$, so solutions are concave up and 1.92 is an
  underestimate. Indeed the exact value is $3e^{-0.4} \approx 2.011$.

Notice each step just multiplied by $1 - 2h = 0.8$. For $y' = ky$, Euler gives
$y_n = y_0(1 + kh)^n$, the discrete compound-growth formula, while the exact answer is
$y_0e^{knh}$. As $h \to 0$ with $nh$ fixed, $(1 + kh)^n \to e^{knh}$, the same limit that
defines $e$.

### Example 4

Estimate $y(1.2)$ for $y' = \dfrac{y}{x}$, $y(1) = 2$, using $h = 0.1$.

- Slope at $(1, 2)$: $2/1 = 2$; $y_1 = 2 + 0.1(2) = 2.2$ at $x = 1.1$.
- Slope at $(1.1, 2.2)$: $2.2/1.1 = 2$; $y_2 = 2.2 + 0.2 = 2.4$ at $x = 1.2$.
- The exact solution is $y = 2x$, a straight line, so $y(1.2) = 2.4$ exactly. Euler's
  method is exact whenever the solution is a line, because a line *is* its own tangent.

## Common mistakes

- **Using the new slope too early.** Each step uses the slope at the *start* of the
  step, $f(x_n, y_n)$, not at the end.
- **Forgetting to advance $x$.** If the slope depends on $x$, use $x_n$, not $x_0$, at
  step $n$.
- **Miscounting steps.** To go from $x_0$ to $x_{\text{end}}$ takes
  $(x_{\text{end}} - x_0)/h$ steps.
- **Rounding at each step.** Carry full precision through the table and round once.

## Key points

- Euler's method: $y_{n+1} = y_n + h f(x_n, y_n)$, $x_{n+1} = x_n + h$.
- It follows tangent lines, so it underestimates where solutions are concave up and
  overestimates where they are concave down.
- Its error at a fixed point shrinks roughly in proportion to $h$.

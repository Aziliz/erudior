---
id: calc-linearization
module: calc-m4
title: Linear approximation, differentials and Newton's method
minutes: 35
topics: [Linearization, Newton's method]
drills: [calc-d-linearization, calc-d-newton]
refs: [calc-ref-derivatives]
---
## Curves look straight up close

Lesson 6 noted that a smooth curve, magnified enough near a point, looks like its tangent line. This lesson cashes that in three ways: estimating function values (linearization), estimating changes and errors (differentials), and solving equations numerically (Newton's method). All three replace a curve by its tangent line.

## Linearization

The **linearization** of $f$ at $x = a$ is its tangent line, viewed as a function:

$$L(x) = f(a) + f'(a)(x - a).$$

For $x$ near $a$, $f(x) \approx L(x)$. This is the **linear approximation** (or tangent line approximation). Choose $a$ where $f(a)$ and $f'(a)$ are easy to compute and close to the $x$ you care about.

### Example 1

Estimate $\sqrt{4.1}$ without a calculator.

Use $f(x) = \sqrt x$ at $a = 4$ (a perfect square near 4.1). $f(4) = 2$; $f'(x) = \frac{1}{2\sqrt x}$, so $f'(4) = \frac14$.

$$L(x) = 2 + \tfrac14(x - 4), \qquad \sqrt{4.1} \approx L(4.1) = 2 + \tfrac14(0.1) = \mathbf{2.025}.$$

The true value is $2.02485\ldots$, so the estimate is off by about 0.00016.

```plot
{"x": [0, 9], "y": [0, 4], "functions": [{"f": "sqrt(x)", "label": "y = √x"}, {"f": "2 + (x - 4)/4", "dashed": true, "label": "L(x)"}], "points": [{"at": [4, 2], "label": "(4, 2)"}], "caption": "Near x = 4 the tangent line is almost indistinguishable from √x; it lies above the curve"}
```

*Over or under?* Concavity decides. $\sqrt x$ is concave down ($f'' < 0$), so the curve bends below its tangent lines, and the linear approximation is an *overestimate*. If $f'' > 0$ (concave up), the tangent line lies below the curve and $L$ underestimates.

### Example 2

Find the linearization of $f(x) = \sin x$ at $a = 0$, and use it to estimate $\sin(0.05)$.

$f(0) = 0$, $f'(0) = \cos 0 = 1$, so $L(x) = x$. This is the **small-angle approximation** $\sin x \approx x$ used throughout physics (pendulums, optics). Here $\sin(0.05) \approx 0.05$; the true value is $0.049979$.

Other common linearizations at 0: $e^x \approx 1 + x$, $\ln(1 + x) \approx x$, $(1 + x)^k \approx 1 + kx$, $\tan x \approx x$.

## Differentials

The same idea in the language of changes. If $y = f(x)$ and $x$ changes by $dx$, define the **differential**

$$dy = f'(x)\,dx.$$

$dy$ is the change along the tangent line; $\Delta y = f(x + dx) - f(x)$ is the actual change along the curve. For small $dx$, $\Delta y \approx dy$.

```plot
{"x": [0, 3], "y": [0, 6], "functions": [{"f": "x^2/1.5", "label": "y = f(x)"}], "tangents": [{"f": "x^2/1.5", "at": 1.5}], "segments": [{"from": [1.5, 1.5], "to": [2.3, 1.5], "dashed": true, "label": "dx"}, {"from": [2.3, 1.5], "to": [2.3, 3.1], "label": "dy"}, {"from": [2.45, 1.5], "to": [2.45, 3.527], "dashed": true, "label": "Δy"}], "caption": "dy is the rise along the tangent; Δy is the rise along the curve"}
```

### Example 3 (propagated error)

The side of a cube is measured as 10 cm with a possible error of ±0.05 cm. Estimate the maximum error in the computed volume, and the relative error.

$V = s^3$, so $dV = 3s^2\,ds = 3(10)^2(\pm0.05) = \pm15$ cm³.

The volume is $1000$ cm³, so the **relative error** is $\frac{dV}{V} = \frac{15}{1000} = 1.5\%$. Compare the relative error in the side: $\frac{0.05}{10} = 0.5\%$. Cubing triples the relative error, because $\frac{dV}{V} = 3\frac{ds}{s}$.

## Newton's method

To solve $f(x) = 0$ when algebra fails (say $x^3 - 2x - 5 = 0$), start with a guess $x_0$, replace the curve by its tangent line at $x_0$, and find where the tangent line crosses the $x$-axis. That crossing is usually a much better guess.

The tangent at $x_n$ is $y = f(x_n) + f'(x_n)(x - x_n)$. Setting $y = 0$ and solving:

$$x_{n+1} = x_n - \frac{f(x_n)}{f'(x_n)}.$$

Repeat until the digits stop changing. Near a simple root, Newton's method roughly doubles the number of correct digits at each step.

```plot
{"x": [1.5, 3.2], "y": [-4, 18], "functions": [{"f": "x^3 - 2x - 5", "label": "f"}], "tangents": [{"f": "x^3 - 2x - 5", "at": 3}], "points": [{"at": [3, 16]}, {"at": [2.36, 0], "label": "x₁"}, {"at": [2.0946, 0], "label": "root"}], "caption": "The tangent at x₀ = 3 meets the axis at x₁ ≈ 2.36, closer to the root"}
```

### Example 4

Use Newton's method with $x_0 = 2$ to approximate the root of $f(x) = x^3 - 2x - 5$.

$f'(x) = 3x^2 - 2$.

| $n$ | $x_n$ | $f(x_n)$ | $f'(x_n)$ | $x_{n+1}$ |
|---|---|---|---|---|
| 0 | 2 | $-1$ | 10 | $2.1$ |
| 1 | 2.1 | $0.061$ | $11.23$ | $2.094568$ |
| 2 | 2.094568 | $0.000186$ | $11.1616$ | $2.0945515$ |

The root is $x \approx 2.09455$, correct to 5 decimals after just three steps.

### Example 5

Use one step of Newton's method to approximate $\sqrt{10}$, starting from $x_0 = 3$.

$\sqrt{10}$ is the positive root of $f(x) = x^2 - 10$, with $f'(x) = 2x$:
$$x_1 = 3 - \frac{9 - 10}{6} = 3 + \frac16 \approx 3.1667.$$
(The true value is 3.16228.) In general Newton's method for $\sqrt c$ gives $x_{n+1} = \frac12\left(x_n + \frac{c}{x_n}\right)$, the ancient Babylonian square-root method.

*When Newton fails.* If $f'(x_n) = 0$ the tangent is horizontal and never meets the axis. A poor starting point can send the iterates to a different root, or make them bounce around. Start near the root you want (a graph or the IVT helps), and check that the iterates settle down.

### Example 6

Estimate $\sqrt[3]{8.1}$ with a linearization.

Use $f(x) = x^{1/3}$ at $a = 8$: $f(8) = 2$ and $f'(x) = \frac13x^{-2/3}$, so $f'(8) = \frac{1}{3\cdot4} = \frac{1}{12}$. Then $\sqrt[3]{8.1} \approx 2 + \frac{1}{12}(0.1) \approx 2.00833$. The true value is $2.00830$; the cube root is concave down, so the estimate is slightly high.

## Common mistakes

- **Using $f(x)$ for $x$ far from $a$.** Linear approximation is only good nearby.
- **Mixing up $dx$ and $dy$.** $dx$ is the input change you choose; $dy = f'(x)dx$ is the estimated output change.
- *Wrong Newton formula.* It's $x - \frac{f}{f'}$, not $x - \frac{f'}{f}$ or $x + \frac{f}{f'}$.
- *Forgetting radians* in trig linearizations.
- *Relative vs absolute error.* Relative error is $\frac{dV}{V}$, often given as a percent.

## Key points

- $L(x) = f(a) + f'(a)(x - a)$; $f(x) \approx L(x)$ near $a$.
- Concave up ⇒ $L$ underestimates; concave down ⇒ $L$ overestimates.
- Differentials: $dy = f'(x)\,dx \approx \Delta y$; use them to estimate propagated error.
- Newton's method: $x_{n+1} = x_n - \dfrac{f(x_n)}{f'(x_n)}$.

---
id: calc-derivative-def
module: calc-m2
title: The derivative at a point
minutes: 30
topics: [Definition of the derivative, Tangent lines]
drills: [calc-d-diff-quotient, calc-d-tangent-line]
refs: [calc-ref-derivatives]
---
## From average rate to instantaneous rate

Module 1 built limits. Now we use them for the first big idea of calculus: the rate of change at a single instant.

Suppose a ball's height after $t$ seconds is $s(t) = 64t - 16t^2$ feet. Between $t = 1$ and $t = 2$ it rises from $s(1) = 48$ to $s(2) = 64$, so its **average rate of change** is

$$\frac{s(2) - s(1)}{2 - 1} = \frac{64 - 48}{1} = 16 \text{ ft/s}.$$

That's an average over a whole second. What is the velocity *exactly at* $t = 1$? We can't divide by a zero-length time interval, but we can shrink the interval and watch:

| Interval | Average velocity |
|---|---|
| $[1, 2]$ | $16$ |
| $[1, 1.1]$ | $30.4$ |
| $[1, 1.01]$ | $31.84$ |
| $[1, 1.001]$ | $31.984$ |

The averages are heading to 32 ft/s. That limit is the **instantaneous rate of change**, and it's what a speedometer reports.

## The geometry: secants become tangents

On a graph, an average rate of change is the slope of a **secant line**, the line through two points on the curve. As the second point slides toward the first, the secant lines pivot toward a limiting line, the **tangent line**. Its slope is the limit of the secant slopes.

```plot
{"x": [-0.5, 4.5], "y": [-10, 80], "functions": [{"f": "64x - 16x^2", "label": "s(t)"}, {"f": "48 + 16(x - 1)", "dashed": true, "label": "secant"}], "tangents": [{"f": "64x - 16x^2", "at": 1}], "points": [{"at": [1, 48], "label": "(1, 48)"}, {"at": [2, 64], "label": "(2, 64)"}], "xLabel": "t", "yLabel": "s", "caption": "Secant through t = 1 and t = 2 (slope 16) and the tangent at t = 1 (slope 32)"}
```

The same number answers both questions: rate of change at an instant, and slope of the tangent line at a point.

## The definition

The **derivative** of $f$ at $x = a$ is

$$f'(a) = \lim_{h\to 0}\frac{f(a + h) - f(a)}{h},$$

provided the limit exists. The fraction is the **difference quotient**: the slope of the secant line from $(a, f(a))$ to $(a + h, f(a + h))$. As $h \to 0$ it becomes the slope of the tangent.

An equivalent form uses $x$ for the second point:

$$f'(a) = \lim_{x\to a}\frac{f(x) - f(a)}{x - a}.$$

Every derivative-by-definition problem has a $0/0$ form (the numerator and $h$ both vanish), so you use the algebra techniques from Lesson 2 to cancel the $h$.

### Example 1

Use the definition to find $f'(3)$ for $f(x) = x^2 - 4x$.

1. Compute $f(3 + h) = (3 + h)^2 - 4(3 + h) = 9 + 6h + h^2 - 12 - 4h = h^2 + 2h - 3$.
2. $f(3) = 9 - 12 = -3$.
3. Difference quotient: $\dfrac{(h^2 + 2h - 3) - (-3)}{h} = \dfrac{h^2 + 2h}{h} = h + 2$ for $h \ne 0$.
4. Take the limit: $f'(3) = \lim_{h\to0}(h + 2) = \mathbf 2$.

### Example 2

Find $f'(4)$ for $f(x) = \sqrt x$.

$$f'(4) = \lim_{h\to0}\frac{\sqrt{4 + h} - 2}{h}.$$

This is $0/0$ with a root, so multiply by the conjugate:

$$\frac{\sqrt{4 + h} - 2}{h}\cdot\frac{\sqrt{4 + h} + 2}{\sqrt{4 + h} + 2} = \frac{h}{h(\sqrt{4 + h} + 2)} = \frac{1}{\sqrt{4 + h} + 2} \to \frac14.$$

So $f'(4) = \mathbf{\tfrac14}$.

## The tangent line

Once you have the slope $m = f'(a)$ and the point $(a, f(a))$, point-slope form gives the tangent line:

$$y - f(a) = f'(a)(x - a).$$

### Example 3

Find the tangent line to $f(x) = x^2 - 4x$ at $x = 3$.

From Example 1, $f(3) = -3$ and $f'(3) = 2$. So $y - (-3) = 2(x - 3)$, or $y = 2x - 9$.

```plot
{"x": [-1, 6], "y": [-6, 6], "functions": [{"f": "x^2 - 4x", "label": "f"}], "tangents": [{"f": "x^2 - 4x", "at": 3}], "points": [{"at": [3, -3], "label": "(3, −3)"}], "caption": "Tangent line y = 2x − 9 at x = 3"}
```

Zoom in far enough on a smooth curve near a point and it looks straight: it looks like its tangent line. That **local linearity** is why the tangent line is the best straight-line approximation to the curve near $a$ (Lesson 15 uses this for approximations).

## Interpreting the derivative

Units help. If $f(t)$ is measured in units $U$ and $t$ in units $T$, then $f'(t)$ is measured in $U$ per $T$.

| Function | Derivative means | Units |
|---|---|---|
| Position $s(t)$ (m), $t$ in s | velocity | m/s |
| Volume $V(t)$ (L), $t$ in min | rate of flow | L/min |
| Cost $C(q)$ (dollars), $q$ items | marginal cost | dollars per item |
| Temperature $T(d)$ (°C), $d$ in km | temperature gradient | °C per km |

### Example 4

$C(q)$ is the cost in dollars of producing $q$ bicycles, and $C'(200) = 85$. Interpret.

When 200 bicycles are being produced, the cost is increasing at about 85 dollars per additional bicycle. So the 201st bicycle costs roughly 85 dollars to make. (That's the "marginal cost" idea from economics.)

Avoid saying "$C'(200) = 85$ means the cost is 85 dollars": that would be $C(200)$, a different thing.

## Estimating derivatives from data

With a table instead of a formula, estimate $f'(a)$ with a difference quotient. A **symmetric difference quotient** (central difference) using points on both sides is usually more accurate:

$$f'(a) \approx \frac{f(a + h) - f(a - h)}{2h}.$$

If $f(2) = 7.4$ and $f(2.5) = 9.1$ and $f(1.5) = 6.2$, then $f'(2) \approx \frac{9.1 - 6.2}{1} = 2.9$.

## Common mistakes

- **Writing $f(a) + h$ instead of $f(a + h)$.** Substitute $a + h$ for every $x$ in the formula.
- **Losing the $- f(a)$.** The numerator is $f(a + h) - f(a)$; when you subtract a negative, use parentheses.
- **Plugging in $h = 0$ before canceling.** You'll get $0/0$. Simplify until the $h$ in the denominator cancels.
- **Confusing $f(a)$ with $f'(a)$.** One is a height, the other a slope. The tangent line needs both.
- *Dropping units or the "at" in interpretations.* Say what's changing, with respect to what, at which input, in which units.

## Key points

- Average rate of change on $[a, b]$: $\dfrac{f(b) - f(a)}{b - a}$, the slope of a secant line.
- $f'(a) = \lim_{h\to 0}\dfrac{f(a + h) - f(a)}{h}$: the instantaneous rate, the slope of the tangent.
- Tangent line: $y = f(a) + f'(a)(x - a)$.
- Units of $f'$: output units per input unit.
- From data, use a difference quotient (central differences are better).
